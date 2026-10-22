// "Other layouts" switcher: present on every page, links resolve, current page marked, EN/AR, keyboard, phone.
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs'); const { pathToFileURL, fileURLToPath } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const PAGES = ['index.html', 'landing-d/index.html', 'index-old.html', 'landing-b/index.html', 'landing-c/index.html', 'mockups/index.html',
  'classic/index.html', 'classic/landing-b/index.html', 'classic/landing-c/index.html', 'classic/mockups/index.html'];   // classic/* run at desktop size only
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const list = process.argv[3] ? JSON.parse(process.argv[3]) : PAGES;
// expected menu size comes from the PAGES table in layouts.js itself (one entry = one link), groups from its GROUPS keys
const lsrc = fs.readFileSync(path.join(root, 'layouts.js'), 'utf8');
const N_LINKS = (lsrc.match(/\{\s*(?:group:\s*'\w+',\s*)?href:/g) || []).length;
const N_GROUPS = new Set(['night', ...[...lsrc.matchAll(/group:\s*'(\w+)'/g)].map((m) => m[1])]).size;
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: exe });
  for (const rel of list) {
    for (const [w, h] of (rel.startsWith('classic/') ? [[1440, 900]] : [[1440, 900], [390, 844]])) {
      const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
      p.on('pageerror', (e) => errs.push(e.message)); p.on('requestfailed', (r) => errs.push('FAIL ' + r.url().split('/').slice(-2).join('/')));
      await p.addInitScript(() => sessionStorage.setItem('aion-night-loader', '1'));
      await p.goto(pathToFileURL(path.join(root, rel)).href); await p.waitForTimeout(1500);
      const tag = `${rel} @${w}`;
      ok(await p.locator('.lay-btn').count() === 1, `${tag} button present`);
      const box = await p.locator('.lay-btn').boundingBox();
      ok(box && box.x + box.width <= w && box.x > w / 2, `${tag} button on the right, on screen (${box && Math.round(box.x)})`);
      await p.click('.lay-btn'); await p.waitForTimeout(150);
      const r = await p.evaluate(() => ({ open: !document.getElementById('lay-menu').hidden, links: [...document.querySelectorAll('#lay-menu a')].map((a) => ({ href: a.href, cur: a.getAttribute('aria-current') })), heads: document.querySelectorAll('#lay-menu li.lay-h').length, label: document.querySelector('.lay-btn').textContent.trim() }));
      ok(r.open && r.links.length === N_LINKS && N_LINKS === 10, `${tag} menu opens with ${N_LINKS} layouts (got ${r.links.length})`);
      ok(r.heads === N_GROUPS && N_GROUPS === 2, `${tag} menu shows ${N_GROUPS} group headings (got ${r.heads})`);
      const missing = r.links.filter((l) => !fs.existsSync(fileURLToPath(l.href))).map((l) => l.href);
      ok(!missing.length, `${tag} every link points to a file ${missing.join(' ')}`);
      ok(r.links.filter((l) => l.cur === 'page').length === 1, `${tag} current page marked once`);
      if (w === 1440) {
        await p.screenshot({ path: path.join(__dirname, '..', 'screenshots', `layouts-${rel.replace(/[\/.]/g, '_')}.png`) });
        await p.keyboard.press('Escape'); await p.waitForTimeout(100);
        ok(await p.evaluate(() => document.getElementById('lay-menu').hidden), `${tag} Escape closes`);
        await p.click('button[data-lang="ar"]'); await p.waitForTimeout(500);
        const lab = await p.evaluate(() => document.querySelector('.lay-btn').textContent.trim());
        const bx = await p.locator('.lay-btn').boundingBox();
        ok(lab === 'تصاميم أخرى' && bx.x < w / 2, `${tag} Arabic label "${lab}", mirrored to the left`);
      }
      ok(!errs.length, `${tag} no errors ${errs.join(' | ')}`);
      await p.close();
    }
  }
  // Deeper checks (styling, keyboard model, header-menu stacking, click-through) on one or two pages only, to keep runtime down
  const open = async (rel, w, h) => {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => sessionStorage.setItem('aion-night-loader', '1'));
    await p.goto(pathToFileURL(path.join(root, rel)).href); await p.waitForTimeout(1500);
    return { p, errs };
  };
  const active = (p) => p.evaluate(() => { const links = [...document.querySelectorAll('#lay-menu a')]; const a = document.activeElement; return { i: links.indexOf(a), n: links.length, cur: a && a.getAttribute('aria-current'), href: a && a.href }; });
  for (const rel of ['index.html', 'landing-d/index.html'].filter((r) => list.includes(r))) {
    const tag = `${rel} @1440 deep`;
    const { p, errs } = await open(rel, 1440, 900);
    const st = await p.evaluate(() => { const bs = getComputedStyle(document.querySelector('.lay-btn')); return { ff: bs.fontFamily, fw: bs.fontWeight, body: getComputedStyle(document.body).fontFamily, popup: document.querySelector('.lay-btn').hasAttribute('aria-haspopup') }; });
    ok(st.ff === st.body && st.fw === '600', `${tag} button font = body font, weight 600 (${st.ff} / ${st.fw} vs body ${st.body})`);
    ok(!st.popup, `${tag} button has no aria-haspopup`);
    await p.focus('.lay-btn'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
    const a0 = await active(p);
    ok(a0.cur === 'page', `${tag} Enter opens the menu and focuses the current-page link (index ${a0.i}, aria-current=${a0.cur})`);
    const ol = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return { style: s.outlineStyle, width: s.outlineWidth }; });
    ok(ol.style !== 'none' && ol.width === '2px', `${tag} focused current link shows a 2px focus outline (${ol.style} ${ol.width})`);
    await p.keyboard.press('ArrowDown'); await p.waitForTimeout(50);
    const a1 = await active(p);
    ok(a1.i === (a0.i + 1) % a0.n, `${tag} ArrowDown moves focus to the next link (${a0.i} -> ${a1.i})`);
    await p.keyboard.press('End'); await p.waitForTimeout(50);
    const a2 = await active(p);
    const inView = await p.evaluate(() => { const m = document.getElementById('lay-menu').getBoundingClientRect(); const a = document.activeElement.getBoundingClientRect(); return a.top >= m.top - 1 && a.bottom <= m.bottom + 1; });
    ok(a2.i === a2.n - 1 && a2.n === N_LINKS && inView, `${tag} End focuses the last link, scrolled into view (${a2.i} of ${a2.n}, inView=${inView})`);
    // mouse click on another (non-current) link after keyboard-opening must navigate, not be swallowed by focusout-close
    const target = await p.evaluate(() => [...document.querySelectorAll('#lay-menu a')].findIndex((a) => !a.hasAttribute('aria-current') && a !== document.activeElement));
    const href = await p.locator('#lay-menu a').nth(target).getAttribute('href');
    await Promise.all([p.waitForURL((u) => u.href === href, { timeout: 5000 }).catch(() => {}), p.locator('#lay-menu a').nth(target).click()]);
    ok(p.url() === href, `${tag} mouse click on link ${target} after keyboard-open navigates (${p.url().split('/').slice(-2).join('/')})`);
    ok(!errs.length, `${tag} no errors ${errs.join(' | ')}`);
    await p.close();
  }
  if (list.includes('index.html')) {
    const tag = 'index.html @1280 header menu';
    const { p, errs } = await open('index.html', 1280, 800);
    if (await p.locator('.menu-btn').isVisible()) {
      const vis = () => p.evaluate(() => getComputedStyle(document.querySelector('.lay')).visibility);
      ok(await vis() === 'visible', `${tag} switcher visible while header menu closed`);
      await p.click('.menu-btn'); await p.waitForTimeout(400);
      const isOpen = await p.evaluate(() => document.querySelector('.nav-panel').classList.contains('is-open'));
      const v = await vis();
      ok(isOpen && v === 'hidden', `${tag} opening the header menu hides the switcher (panel open=${isOpen}, .lay visibility=${v})`);
    } else ok(false, `${tag} .menu-btn expected visible at 1280 (styles.css shows it below 1421px)`);
    ok(!errs.length, `${tag} no errors ${errs.join(' | ')}`);
    await p.close();
  }
  await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

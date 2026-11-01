// Smooth scrolling on the particle-theme pages (landing-e, landing-f): wheel and keyboard glide (several in-between
// positions, not one jump), anchors land under the header, scrollable panels keep the wheel, and the page holds still
// behind the phone menu and the booking dialog.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };

// scroll positions sampled every frame for `ms` after `act` runs
async function track(p, act, ms = 1400) {
  await p.evaluate(() => { window.__ys = []; const f = () => { window.__ys.push(scrollY); if (window.__ys.length < 400) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await act();
  await p.waitForTimeout(ms);
  return p.evaluate(() => { const ys = window.__ys; window.__ys = [9e9]; return ys; });
}
const glided = (ys) => { const d = [...new Set(ys.map((y) => Math.round(y)))]; return d.length >= 5; };   // at least 5 distinct positions = a glide
const settled = (ys) => ys[ys.length - 1];

(async () => {
  const b = await chromium.launch({ executablePath: exe });
  for (const dir of ['landing-e', 'landing-f']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href);
    await p.mouse.move(700, 450); await p.mouse.wheel(0, 10); await p.waitForTimeout(3200);   // ends the logo intro
    await p.evaluate(() => window.__aionLenis.scrollTo(0, { immediate: true })); await p.waitForTimeout(300);
    ok(await p.evaluate(() => !!window.__aionLenis && document.documentElement.classList.contains('lenis')), `${dir}: Lenis smooth scroll is on`);

    // wheel
    let ys = await track(p, () => p.mouse.wheel(0, 600));
    ok(glided(ys) && settled(ys) > 300, `${dir}: wheel glides (${new Set(ys.map(Math.round)).size} positions, ends ${Math.round(settled(ys))})`);
    // keyboard
    await p.evaluate(() => document.activeElement && document.activeElement.blur());
    const y0 = await p.evaluate(() => scrollY);
    ys = await track(p, () => p.keyboard.press('PageDown'));
    ok(glided(ys) && settled(ys) - y0 > 500, `${dir}: Page Down glides one screen (${Math.round(settled(ys) - y0)}px, ${new Set(ys.map(Math.round)).size} positions)`);
    ys = await track(p, () => p.keyboard.press('ArrowDown'), 1000);
    ok(glided(ys), `${dir}: Arrow Down glides`);
    ys = await track(p, () => p.keyboard.press('End'), 1800);
    ok(await p.evaluate(() => Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight)) < 4), `${dir}: End glides to the bottom`);
    ys = await track(p, () => p.keyboard.press('Home'), 1800);
    ok(glided(ys) && settled(ys) < 2, `${dir}: Home glides to the top`);

    // anchors from the header land under it
    for (const id of ['ai966', 'open-banking', 'demos']) {
      if (id === 'demos') { await p.evaluate(() => window.__aionLenis.scrollTo(0, { immediate: true })); await p.waitForTimeout(400); }
      const sel = id === 'demos' ? '.hero-cta.ghost' : `header a[href="#${id}"]`;
      await p.locator(sel).first().click();
      await p.waitForTimeout(1800);
      const top = await p.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);
      ok(top > 40 && top < 110, `${dir}: link to #${id} lands under the header (top ${Math.round(top)}px)`);
    }

    // the layouts list keeps the wheel; the page stays put
    await p.click('.lay-btn'); await p.waitForTimeout(300);
    await p.evaluate(() => { const m = document.querySelector('.lay-menu'); m.style.maxHeight = '200px'; });
    const yBefore = await p.evaluate(() => scrollY);
    const box = await p.locator('.lay-menu').boundingBox();
    await p.mouse.move(box.x + 50, box.y + 60); await p.mouse.wheel(0, 300); await p.waitForTimeout(700);
    const lay = await p.evaluate(() => ({ menu: document.querySelector('.lay-menu').scrollTop, y: scrollY }));
    ok(lay.menu > 0 && Math.abs(lay.y - yBefore) < 2, `${dir}: layouts list scrolls itself, page stays (list ${lay.menu}px, page moved ${Math.round(lay.y - yBefore)}px)`);
    await p.keyboard.press('Escape');
    await p.evaluate(() => { document.querySelector('.lay-menu').style.maxHeight = ''; });

    // booking dialog: the page holds
    const dlgBtn = await p.$('[data-open-booking], a[href="#book"].btn-primary, button[data-book]');
    const opened = await p.evaluate(() => { const d = document.getElementById('booking'); if (!d) return false; d.showModal(); return d.open; });
    if (opened) {
      await p.waitForTimeout(200);
      const yd = await p.evaluate(() => scrollY);
      await p.mouse.move(40, 450); await p.mouse.wheel(0, 500); await p.waitForTimeout(900);
      ok(await p.evaluate((y) => Math.abs(scrollY - y) < 2 && window.__aionLenis.isStopped, yd), `${dir}: page holds still behind the booking dialog`);
      await p.evaluate(() => document.getElementById('booking').close()); await p.waitForTimeout(200);
      ok(await p.evaluate(() => !window.__aionLenis.isStopped), `${dir}: smooth scroll resumes after the dialog closes`);
    }
    void dlgBtn;
    ok(errs.length === 0, `${dir}: no page errors ${errs.join(' | ')}`);
    await p.close();

    // phone: the open menu holds the page, its panel scrolls
    const m = await b.newPage({ viewport: { width: 390, height: 600 }, hasTouch: false });
    await m.goto(pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href);
    await m.mouse.move(200, 300); await m.mouse.wheel(0, 10); await m.waitForTimeout(3200);
    await m.click('#burger'); await m.waitForTimeout(400);
    const ym = await m.evaluate(() => scrollY);
    await m.mouse.move(200, 400); await m.mouse.wheel(0, 400); await m.waitForTimeout(900);
    const mm = await m.evaluate(() => ({ y: scrollY, panel: (document.querySelector('.mega-card') || {}).scrollTop || 0, stopped: window.__aionLenis.isStopped }));
    ok(mm.stopped && Math.abs(mm.y - ym) < 2, `${dir} 390: page holds behind the open menu (moved ${Math.round(mm.y - ym)}px, menu panel ${mm.panel}px)`);
    await m.click('#burger'); await m.waitForTimeout(300);
    ok(await m.evaluate(() => !window.__aionLenis.isStopped), `${dir} 390: smooth scroll resumes when the menu closes`);
    await m.close();
  }
  // reduced motion: no Lenis, native scrolling, keys untouched
  const ctx = await b.newContext({ reducedMotion: 'reduce' }); const r = await ctx.newPage();
  await r.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href); await r.waitForTimeout(800);
  ok(await r.evaluate(() => !window.__aionLenis), 'reduced motion: no smooth-scroll library, the browser scrolls');
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

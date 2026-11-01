// Review gaps for smooth scrolling on the particle-theme pages (landing-e, landing-f), on top of smooth-scroll-check.js:
// quick key presses add up, a held arrow glides, the desktop dropdown and a short layouts list let the page glide,
// resizing out of the phone menu frees the page, the Book buttons open the dialog, the dialog does not shift the
// layout, and Arabic keeps the glide.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const info = (m) => console.log('INFO ' + m);

// scroll positions sampled every frame for `ms` after `act` runs
async function track(p, act, ms = 1400) {
  await p.evaluate(() => { window.__ys = []; const f = () => { window.__ys.push(scrollY); if (window.__ys.length < 600) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await act();
  await p.waitForTimeout(ms);
  return p.evaluate(() => { const ys = window.__ys; window.__ys = [9e9]; return ys; });
}
const distinct = (ys) => new Set(ys.map((y) => Math.round(y))).size;
const glided = (ys) => distinct(ys) >= 5;
const moved = (ys) => ys[ys.length - 1] - ys[0];
const maxStep = (ys) => ys.slice(1).reduce((m, y, i) => Math.max(m, Math.abs(y - ys[i])), 0);
// a glide, not a jump: at least 5 positions and no single frame covers more than 60% of the move
const glideNotJump = (ys) => glided(ys) && Math.abs(moved(ys)) > 50 && maxStep(ys) < 0.6 * Math.abs(moved(ys));
const describe = (ys) => `${distinct(ys)} positions, moved ${Math.round(moved(ys))}px, largest frame step ${Math.round(maxStep(ys))}px`;

const url = (dir) => pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href;
async function open(b, dir, viewport = { width: 1440, height: 900 }) {
  const p = await b.newPage({ viewport });
  p.__errs = []; p.on('pageerror', (e) => p.__errs.push(e.message));
  await p.goto(url(dir));
  await p.mouse.move(viewport.width / 2, viewport.height / 2); await p.mouse.wheel(0, 10); await p.waitForTimeout(3200);   // ends the logo intro
  await top(p);
  return p;
}
async function top(p) {
  await p.evaluate(() => { window.__aionLenis.scrollTo(0, { immediate: true }); document.activeElement && document.activeElement.blur(); });
  await p.waitForTimeout(300);
}
const closeBooking = (p) => p.evaluate(() => { const d = document.getElementById('booking'); if (d.open) d.close(); });

(async () => {
  // Playwright hides scrollbars in headless Chromium by default; show them so a layout shift from the dialog is real
  const b = await chromium.launch({ executablePath: exe, ignoreDefaultArgs: ['--hide-scrollbars'] });
  for (const dir of ['landing-e', 'landing-f']) {
    const p = await open(b, dir);

    // 1. three quick Page Downs add up to three screens
    {
      for (let i = 0; i < 3; i++) { await p.keyboard.press('PageDown'); if (i < 2) await p.waitForTimeout(100); }
      await p.waitForTimeout(2000);
      const r = await p.evaluate(() => ({ y: scrollY, want: Math.min(3 * (innerHeight - 110), window.__aionLenis.limit) }));
      ok(Math.abs(r.y - r.want) <= 4, `${dir}: 3 quick Page Downs add up (scrollY ${Math.round(r.y)}, expected ${Math.round(r.want)})`);
    }

    // 2. a held Arrow Down glides steadily. Playwright's keyboard.down sends one keydown; an OS key hold sends
    // auto-repeat keydowns (repeat: true) after ~500ms, every ~33ms. Simulate that for 1000ms.
    {
      await top(p);
      const y0 = await p.evaluate(() => scrollY);
      const ys = await track(p, async () => {
        await p.keyboard.down('ArrowDown');
        const t0 = Date.now(); await p.waitForTimeout(500);
        while (Date.now() - t0 < 1000) { await p.keyboard.down('ArrowDown'); await p.waitForTimeout(33); }
        await p.keyboard.up('ArrowDown');
      }, 800);
      const d = ys[ys.length - 1] - y0;
      ok(d > 300 && d < 4000 && distinct(ys) > 5, `${dir}: held Arrow Down (1000ms, auto-repeat) glides steadily (${Math.round(d)}px, ${distinct(ys)} positions)`);
      // the literal single keydown (no auto-repeat), for the record
      await top(p);
      const ys1 = await track(p, async () => { await p.keyboard.down('ArrowDown'); await p.waitForTimeout(1000); await p.keyboard.up('ArrowDown'); }, 400);
      info(`${dir}: single keydown held 1000ms without repeat events moves ${Math.round(moved(ys1))}px (one 140px step expected)`);
    }

    // 3. desktop Solutions dropdown: wheel over a menu card glides the page
    {
      await top(p);
      // a real pointer click: the mouse enters #solBtn first (hover opens the menu), then the click toggles it
      await p.click('#solBtn'); await p.waitForTimeout(400);
      const st = await p.evaluate(() => ({ hidden: document.getElementById('mega').hidden, canHover: matchMedia('(hover:hover)').matches }));
      ok(!st.hidden, `${dir} 1440: a pointer click on #solBtn leaves the Solutions dropdown open (mega hidden=${st.hidden}, hover:hover=${st.canHover})`);
      if (st.hidden) { await p.mouse.move(5, 500); await p.waitForTimeout(300); await p.hover('#solBtn'); await p.waitForTimeout(400); }   // open it by hover to test the wheel
      const card = p.locator('.mega-card').first();
      const vis = await card.isVisible();
      ok(vis, `${dir} 1440: Solutions dropdown is open with a .mega-card visible`);
      if (vis) {
        const box = await card.boundingBox();
        const scrollable = await p.evaluate(() => { const c = document.querySelector('.mega-card'); return c.scrollHeight > c.clientHeight + 1; });
        info(`${dir} 1440: .mega-card scrollable=${scrollable}`);
        await p.mouse.move(box.x + box.width / 2, box.y + Math.min(60, box.height / 2));
        const ys = await track(p, () => p.mouse.wheel(0, 400));
        ok(glideNotJump(ys), `${dir} 1440: wheel over the open dropdown glides the page (${describe(ys)})`);
      }
      await p.keyboard.press('Escape'); await p.waitForTimeout(200);
      await p.evaluate(() => { const m = document.getElementById('mega'); if (!m.hidden) document.getElementById('solBtn').click(); });
      await p.waitForTimeout(200);
    }

    // 5. Book buttons open the booking dialog; WhatsApp links open wa.me in a new tab
    {
      for (const [name, sel] of [['header', 'header [data-open-booking]'], ['hero', '.hero-cta[data-open-booking]'], ['#book', '#book [data-open-booking]']]) {
        await closeBooking(p); await p.waitForTimeout(150);
        const n = await p.locator(sel).count();
        if (!n) { ok(false, `${dir}: ${name} Book button exists (${sel})`); continue; }
        await p.locator(sel).first().click(); await p.waitForTimeout(300);
        ok(await p.evaluate(() => document.getElementById('booking').open === true), `${dir}: ${name} Book button opens dialog#booking`);
        await closeBooking(p); await p.waitForTimeout(200);
      }
      for (const [name, sel] of [['hero', '.hero-micro a'], ['#book', '#book a[href*="wa.me"]']]) {
        const a = await p.$$eval(sel, (els) => els.map((e) => ({ href: e.getAttribute('href') || '', target: e.getAttribute('target') })));
        ok(a.length > 0 && a.every((x) => x.href.startsWith('https://wa.me/') && x.target === '_blank'), `${dir}: ${name} WhatsApp link opens wa.me in a new tab (${JSON.stringify(a)})`);
      }
      await top(p);
    }

    // 6. the booking dialog does not shift the layout (scrollbar-gutter: stable)
    {
      // main is left-anchored (body margin), so its left alone cannot see a right-hand scrollbar vanish; also compare
      // main's width and the left of the first centred .wrap, which move if the scrollbar's space is given back
      const geo = () => p.evaluate(() => { const m = document.querySelector('main').getBoundingClientRect(); const w = document.querySelector('main .wrap').getBoundingClientRect(); return { left: m.left, width: m.width, wrap: w.left }; });
      const sb = await p.evaluate(() => innerWidth - document.documentElement.clientWidth);
      const showHide = async () => {
        const g0 = await geo();
        await p.evaluate(() => document.getElementById('booking').showModal()); await p.waitForTimeout(300);
        const held = await p.evaluate(() => getComputedStyle(document.documentElement).overflow);
        const g1 = await geo();
        await closeBooking(p); await p.waitForTimeout(200);
        return { g0, g1, held };
      };
      const r = await showHide();
      ok(sb > 0 && r.g0.left === r.g1.left, `${dir} 1440: main left is identical before/after showModal (${r.g0.left} -> ${r.g1.left}, scrollbar ${sb}px, html overflow while open: ${r.held})`);
      ok(r.g0.width === r.g1.width && r.g0.wrap === r.g1.wrap, `${dir} 1440: no scrollbar shift when the dialog opens (main width ${r.g0.width} -> ${r.g1.width}, centred .wrap left ${r.g0.wrap} -> ${r.g1.wrap})`);
      // control: without the gutter rule the same measurement must see a shift, or the check above proves nothing
      await p.addStyleTag({ content: 'html.lenis{scrollbar-gutter:auto !important}' });
      const c = await showHide();
      ok(c.g0.width !== c.g1.width || c.g0.wrap !== c.g1.wrap, `${dir} 1440: control - without scrollbar-gutter the same measurement sees the shift (width ${c.g0.width} -> ${c.g1.width}, .wrap ${c.g0.wrap} -> ${c.g1.wrap})`);
      await p.evaluate(() => { const s = [...document.querySelectorAll('style')].pop(); if (s.textContent.includes('scrollbar-gutter:auto')) s.remove(); });
    }

    // 8. a short (non-scrollable) layouts list lets the page glide under the wheel
    {
      await top(p);
      await p.click('.lay-btn'); await p.waitForTimeout(300);
      const measure = () => p.evaluate(() => { const e = document.querySelector('.lay-menu'); return { open: !e.hidden, scrollable: e.scrollHeight > e.clientHeight + 1, sh: e.scrollHeight, ch: e.clientHeight }; });
      let m = await measure();
      info(`${dir} 1440x900: default layouts list ${m.scrollable ? 'is scrollable' : 'fits'} (scrollHeight ${m.sh}, clientHeight ${m.ch})`);
      if (m.scrollable) { await p.evaluate(() => { document.querySelector('.lay-menu').style.maxHeight = 'none'; }); m = await measure(); }   // test-only: let it fit
      ok(m.open && !m.scrollable, `${dir} 1440: layouts list is open and not scrollable (${m.sh}/${m.ch})`);
      const box = await p.locator('.lay-menu').boundingBox();
      await p.mouse.move(box.x + box.width / 2, box.y + Math.min(60, box.height / 2));
      const ys = await track(p, () => p.mouse.wheel(0, 400));
      ok(glideNotJump(ys), `${dir} 1440: wheel over the short layouts list glides the page (${describe(ys)})`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(200);
      await p.evaluate(() => { document.querySelector('.lay-menu').style.maxHeight = ''; });
    }

    ok(p.__errs.length === 0, `${dir} 1440: no page errors ${p.__errs.join(' | ')}`);
    await p.close();

    // 4. phone menu open at 900px holds the page; widening to 1300px frees it
    {
      const t = await open(b, dir, { width: 900, height: 800 });
      await t.click('#burger'); await t.waitForTimeout(400);
      ok(await t.evaluate(() => window.__aionLenis.isStopped), `${dir} 900: open phone menu stops Lenis`);
      await t.setViewportSize({ width: 1300, height: 800 }); await t.waitForTimeout(400);
      const st = await t.evaluate(() => ({ stopped: window.__aionLenis.isStopped, megaHidden: document.getElementById('mega').hidden }));
      ok(!st.stopped, `${dir} 1300: after widening, the menu no longer holds the page (stopped=${st.stopped}, mega hidden=${st.megaHidden})`);
      const mb = await t.evaluate(() => { const r = document.getElementById('mega').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.height }; });
      // a point outside #mega: below it if it leaves room, else at the far left edge
      const pt = mb.h > 0 && mb.bottom < 760 ? { x: 650, y: Math.min(780, mb.bottom + 20) } : (mb.h > 0 ? { x: Math.max(5, mb.left - 20), y: 600 } : { x: 650, y: 600 });
      await t.mouse.move(pt.x, pt.y);
      const outside = await t.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return !el || !el.closest('#mega'); }, pt);
      const y0 = await t.evaluate(() => scrollY);
      await t.mouse.wheel(0, 400); await t.waitForTimeout(1400);
      const y1 = await t.evaluate(() => scrollY);
      ok(outside && Math.abs(y1 - y0) > 50, `${dir} 1300: wheel outside the menu scrolls the page (at ${pt.x},${pt.y} outside=${outside}, moved ${Math.round(y1 - y0)}px)`);
      // clean up: close the menu
      await t.keyboard.press('Escape'); await t.waitForTimeout(200);
      await t.evaluate(() => { const m = document.getElementById('mega'); if (!m.hidden) { const s = document.getElementById('solBtn'); s && s.click(); } });
      await t.waitForTimeout(200);
      info(`${dir} 1300: after cleanup mega hidden=${await t.evaluate(() => document.getElementById('mega').hidden)}, Lenis stopped=${await t.evaluate(() => window.__aionLenis.isStopped)}`);
      ok(t.__errs.length === 0, `${dir} 900->1300: no page errors ${t.__errs.join(' | ')}`);
      await t.close();
    }

    // 7. Arabic keeps the keyboard glide
    {
      const a = await open(b, dir);
      await a.click('#langBtn'); await a.waitForTimeout(600);
      const y0 = await a.evaluate(() => scrollY);
      const ys = await track(a, () => a.keyboard.press('PageDown'));
      const r = await a.evaluate(() => ({ dir: document.documentElement.dir, lang: localStorage.getItem('aion-v2-lang') }));
      ok(r.dir === 'rtl' && glided(ys) && ys[ys.length - 1] - y0 > 500, `${dir} ar: Page Down glides in Arabic (dir=${r.dir}, ${describe(ys)})`);
      await a.evaluate(() => localStorage.removeItem('aion-v2-lang'));
      ok(a.__errs.length === 0, `${dir} ar: no page errors ${a.__errs.join(' | ')}`);
      await a.close();
    }
  }
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

// QA regression checks for the hero mockup (code-review QA handoff).
// Run from this folder: node qa.js
// Prints PASS/FAIL per test and exits 1 on any failure. Does not modify the page sources.
'use strict';

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const CHROME = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const PAGE_URL = pathToFileURL(path.resolve(__dirname, '..', 'mockups', 'index.html')).href;
const HEROES = [1, 2, 3, 4, 5];
const JIDS = ['sme', 'payroll', 'sadad', 'cards', 'lending', 'ews'];

let browser;
const results = [];

/* ------------------------------------------------------------------ helpers */

// Each test gets a fresh context; storage keys for this mockup are cleared before any page script runs.
async function openPage(ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ...ctxOpts });
  await ctx.addInitScript(() => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('aion-mock:')).forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* storage unavailable */ }
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#option-5 .chip', { state: 'attached', timeout: 15000 });
  return { ctx, page, errors };
}

// Collects named checks; a test passes only if every check passes.
class Checks {
  constructor() { this.items = []; }
  ok(name, cond, observed) { this.items.push({ name, pass: !!cond, observed }); }
  near(name, actual, expected, tol) { this.ok(name, Math.abs(actual - expected) <= tol, `actual=${round(actual)} expected=${round(expected)} tol=${tol}`); }
  get passed() { return this.items.every((i) => i.pass); }
}
const round = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

async function pollUntil(fn, timeoutMs, stepMs = 100) {
  const end = Date.now() + timeoutMs;
  let last;
  while (Date.now() < end) {
    last = await fn();
    if (last) return last;
    await new Promise((r) => setTimeout(r, stepMs));
  }
  return last;
}

async function waitForScrollIdle(page, stableMs = 400, timeoutMs = 4000) {
  const end = Date.now() + timeoutMs;
  let prev = await page.evaluate(() => window.scrollY);
  let stableSince = Date.now();
  while (Date.now() < end) {
    await page.waitForTimeout(80);
    const y = await page.evaluate(() => window.scrollY);
    if (y !== prev) { prev = y; stableSince = Date.now(); } else if (Date.now() - stableSince >= stableMs) return y;
  }
  return prev;
}

async function test(id, title, fn) {
  const c = new Checks();
  const started = Date.now();
  let crash = null;
  try { await fn(c); } catch (e) { crash = e; }
  const pass = !crash && c.passed && c.items.length > 0;
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${id}. ${title}  (${secs}s)`);
  for (const i of c.items) {
    if (!i.pass || process.env.QA_VERBOSE) console.log(`      ${i.pass ? 'ok  ' : 'FAIL'} ${i.name}${i.observed !== undefined ? ` :: ${typeof i.observed === 'string' ? i.observed : JSON.stringify(i.observed)}` : ''}`);
  }
  if (crash) console.log(`      ERROR ${crash.stack || crash.message}`);
  results.push({ id, title, pass });
}

// In-page contrast utilities (handles rgb(), rgba(), "rgb(r g b / a)" and "color(srgb r g b / a)").
const CONTRAST_LIB = `
  window.__qa = window.__qa || (() => {
    const parse = (s) => {
      let m = s.match(/^color\\(srgb\\s+([\\d.e+-]+)\\s+([\\d.e+-]+)\\s+([\\d.e+-]+)(?:\\s*\\/\\s*([\\d.e+-]+%?))?\\)$/i);
      if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]) };
      m = s.match(/^rgba?\\(\\s*([\\d.]+)[,\\s]+([\\d.]+)[,\\s]+([\\d.]+)(?:\\s*[,/]\\s*([\\d.]+%?))?\\s*\\)$/i);
      if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]) };
      throw new Error('Unparsed colour: ' + s);
    };
    const over = (top, bot) => {
      const a = top.a + bot.a * (1 - top.a);
      if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
      const ch = (k) => (top[k] * top.a + bot[k] * bot.a * (1 - top.a)) / a;
      return { r: ch('r'), g: ch('g'), b: ch('b'), a };
    };
    // Effective background: composite translucent backgrounds up the ancestor chain onto the page canvas.
    const bgOf = (el) => {
      const layers = [];
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      }
      let acc = { r: 255, g: 255, b: 255, a: 1 };
      const canvas = parse(getComputedStyle(document.body).backgroundColor);
      if (canvas.a > 0) acc = over(canvas, acc);
      for (let i = layers.length - 1; i >= 0; i--) acc = over(layers[i], acc);
      return acc;
    };
    const lum = (c) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const ratio = (fgEl, bgEl) => {
      const bg = bgOf(bgEl || fgEl);
      const fgRaw = getComputedStyle(fgEl).color;
      const fg = over(parse(fgRaw), bg);
      const l1 = lum(fg), l2 = lum(bg);
      return {
        ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
        fg: fgRaw,
        bg: getComputedStyle(bgEl || fgEl).backgroundColor,
        bgEffective: 'rgb(' + [bg.r, bg.g, bg.b].map(Math.round).join(',') + ')',
      };
    };
    return { parse, bgOf, ratio };
  })();
`;

/* ------------------------------------------------------------------ tests */

async function t1Dialog() {
  await test(1, 'Booking dialog: open, submit, close, focus return', async (c) => {
    const { ctx, page } = await openPage();
    try {
      const opener = page.locator('.site-header .btn-book');
      await opener.click();
      await page.waitForSelector('dialog#booking[open]');
      const open = await page.evaluate(() => {
        const d = document.getElementById('booking');
        return { done: getComputedStyle(d.querySelector('.dlg-done')).display, form: getComputedStyle(d.querySelector('form')).display, formVisible: d.querySelector('form').getBoundingClientRect().height > 0 };
      });
      c.ok('on open .dlg-done display is none', open.done === 'none', open);
      c.ok('on open form is visible', open.form !== 'none' && open.formVisible, open);

      await page.fill('#booking input[name="field1"]', 'test@example.com');
      await page.fill('#booking input[name="field2"]', 'Test value two');
      await page.click('#booking button[type="submit"]');
      const after = await page.evaluate(() => {
        const d = document.getElementById('booking');
        const done = d.querySelector('.dlg-done');
        return { open: d.open, form: getComputedStyle(d.querySelector('form')).display, done: getComputedStyle(done).display, doneH: done.getBoundingClientRect().height };
      });
      c.ok('after submit dialog stays open', after.open, after);
      c.ok('after submit form display is none', after.form === 'none', after);
      c.ok('after submit .dlg-done is visible', after.done !== 'none' && after.doneH > 0, after);

      await page.click('#booking .dlg-done .dlg-close');
      await page.waitForFunction(() => !document.getElementById('booking').open, null, { timeout: 3000 }).catch(() => {});
      const closed = await page.evaluate(() => {
        const opener = document.querySelector('.site-header .btn-book');
        const a = document.activeElement;
        return { open: document.getElementById('booking').open, focusIsOpener: a === opener, active: a ? `${a.tagName}.${a.className}` : null };
      });
      c.ok('after Close dialog is closed', !closed.open, closed);
      c.ok('after Close focus returns to opener', closed.focusIsOpener, closed);
    } finally { await ctx.close(); }
  });
}

async function t2Keyboard() {
  await test(2, 'Keyboard: Enter and Space activate chips and keep focus', async (c) => {
    const { ctx, page } = await openPage();
    try {
      const chips = page.locator('#option-1 .chip');
      await chips.nth(2).focus();
      await page.keyboard.press('Enter');
      const enter = await page.evaluate(() => ({
        active: document.activeElement && document.activeElement.dataset.j,
        inHero: !!document.activeElement.closest('#option-1'),
        pressed: document.querySelector('#option-1 .chip[data-j="sadad"]').getAttribute('aria-pressed'),
      }));
      c.ok('Enter: activeElement.dataset.j === sadad', enter.active === 'sadad' && enter.inHero, enter);
      c.ok('Enter: sadad chip aria-pressed=true', enter.pressed === 'true', enter);

      await page.locator('#option-1 .chip').nth(4).focus();
      await page.keyboard.press('Space');
      const space = await page.evaluate(() => ({
        active: document.activeElement && document.activeElement.dataset.j,
        pressed: document.querySelector('#option-1 .chip[data-j="lending"]').getAttribute('aria-pressed'),
        sadadPressed: document.querySelector('#option-1 .chip[data-j="sadad"]').getAttribute('aria-pressed'),
      }));
      c.ok('Space: activeElement.dataset.j === lending', space.active === 'lending', space);
      c.ok('Space: lending aria-pressed=true and sadad released', space.pressed === 'true' && space.sadadPressed === 'false', space);
    } finally { await ctx.close(); }
  });
}

async function t3BodyClick() {
  await test(3, 'Clicking body text does not set aria-pressed on <html>', async (c) => {
    const { ctx, page } = await openPage();
    try {
      await page.waitForTimeout(1200); // let the entrance fade in so text is clickable
      for (const sel of ['#option-1 .copy-2', '#option-1 .copy-1', '#option-2 .copy-3']) {
        await page.locator(sel).click();
      }
      const r = await page.evaluate(() => ({
        ariaPressed: document.documentElement.getAttribute('aria-pressed'),
        lens: document.documentElement.dataset.lens,
        lang: document.documentElement.lang,
      }));
      c.ok('<html> has no aria-pressed', r.ariaPressed === null, r);
      c.ok('<html> lens/lang unchanged', r.lens === 'business' && r.lang === 'en', r);
    } finally { await ctx.close(); }
  });
}

async function t4AnchorOffset() {
  await test(4, 'Options-row link lands #option-3 under the sticky header', async (c) => {
    const { ctx, page } = await openPage();
    try {
      await page.click('.options-row a[href="#option-3"]');
      await page.waitForTimeout(150);
      await waitForScrollIdle(page);
      const r = await page.evaluate(() => ({
        headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
        heroTop: document.getElementById('option-3').getBoundingClientRect().top,
        scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
        scrollY: window.scrollY,
      }));
      c.near(`#option-3 top vs header bottom (scroll-padding-top=${r.scrollPaddingTop}, scrollY=${r.scrollY})`, r.heroTop, r.headerBottom, 6);
    } finally { await ctx.close(); }
  });
}

async function t5Pause() {
  await test(5, 'Pause freezes the progress bar and every animation in #option-1', async (c) => {
    const { ctx, page } = await openPage();
    try {
      await page.waitForTimeout(2600); // entrance transitions (phone tilt 0.45s + 1.6s) settle
      await page.click('#option-1 .pause-btn');
      const before = await page.evaluate(() => document.querySelector('#option-1 .bar-fill').style.transform);
      await page.waitForTimeout(1000);
      const r = await page.evaluate(() => {
        const hero = document.querySelector('#option-1');
        const running = hero.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').map((a) => {
          const t = a.effect && a.effect.target;
          return `${a.constructor.name}:${a.animationName || a.transitionProperty || '?'} on ${t ? (t.className || t.tagName) : '?'}${a.effect && a.effect.pseudoElement ? a.effect.pseudoElement : ''}`;
        });
        return {
          after: hero.querySelector('.bar-fill').style.transform,
          state: hero.querySelector('.pause-btn').dataset.state,
          total: hero.getAnimations({ subtree: true }).length,
          running,
        };
      });
      c.ok('pause button state is paused', r.state === 'paused', r.state);
      c.ok('.bar-fill transform unchanged over 1s', before === r.after, { before, after: r.after });
      c.ok('no animation in #option-1 is running', r.running.length === 0, { total: r.total, running: r.running.slice(0, 10) });
    } finally { await ctx.close(); }
  });
}

async function t6GlobalToggles() {
  await test(6, 'Behind switch and Technical lens apply to all five heroes', async (c) => {
    const { ctx, page } = await openPage();
    try {
      await page.click('#option-3 .behind-switch');
      const b = await page.evaluate(() => ({
        checked: [...document.querySelectorAll('.behind-switch')].map((s) => s.getAttribute('aria-checked')),
        behind: document.documentElement.dataset.behind,
      }));
      c.ok('all five switches aria-checked=true', b.checked.length === 5 && b.checked.every((x) => x === 'true'), b.checked);
      c.ok('html[data-behind] = on', b.behind === 'on', b.behind);

      await page.click('button[data-lens="technical"]');
      const k = await page.evaluate(() => [...document.querySelectorAll('.hero')].map((h) => ({
        id: h.id,
        biz: getComputedStyle(h.querySelector('.kpi-biz')).display,
        tech: getComputedStyle(h.querySelector('.kpi-tech')).display,
      })));
      c.ok('every hero: .kpi-biz hidden', k.length === 5 && k.every((x) => x.biz === 'none'), k);
      c.ok('every hero: .kpi-tech shown', k.length === 5 && k.every((x) => x.tech !== 'none'), k);
    } finally { await ctx.close(); }
  });
}

async function t7AllChips() {
  await test(7, 'Every chip in every hero loads its video, steps, trace and copy', async (c) => {
    const { ctx, page } = await openPage();
    try {
      for (const v of HEROES) {
        for (const j of JIDS) {
          await page.locator(`#option-${v} .chip[data-j="${j}"]`).click();
          const r = await page.evaluate((sel) => {
            const h = document.querySelector(sel);
            return {
              pressed: h.querySelector('.chip[aria-pressed="true"]').dataset.j,
              video: (h.querySelector('video[data-demo-media]') || {}).currentSrc || (h.querySelector('video[data-demo-media]') || {}).src || '',
              steps: h.querySelectorAll('.steps li').length,
              trace: h.querySelectorAll('.trace .tr-item').length,
              copy1: h.querySelector('.copy-1').textContent.trim().length,
            };
          }, `#option-${v}`);
          const good = r.pressed === j && r.video.includes(`/${j}-`) && r.steps >= 4 && r.trace >= 4 && r.copy1 > 0;
          c.ok(`#option-${v} ${j}`, good, r);
        }
      }
    } finally { await ctx.close(); }
  });
}

async function t8Mobile() {
  await test(8, '390px: no horizontal overflow, single-row header, RTL trace settles (en + ar)', async (c) => {
    const { ctx, page } = await openPage({ viewport: { width: 390, height: 844 } });
    try {
      const measure = () => page.evaluate(() => {
        const bar = document.querySelector('.site-header .bar');
        const cs = getComputedStyle(bar);
        const br = bar.getBoundingClientRect();
        const logo = document.querySelector('.logo').getBoundingClientRect();
        const menu = document.querySelector('.menu-btn').getBoundingClientRect();
        const rowTop = br.top + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
        return {
          scrollWidth: document.documentElement.scrollWidth,
          rowTop, menuTop: menu.top, logoTop: logo.top,
          logoMid: (logo.top + logo.bottom) / 2, menuMid: (menu.top + menu.bottom) / 2,
          barHeight: br.height,
        };
      });
      await page.waitForTimeout(400);
      for (const lang of ['en', 'ar']) {
        if (lang === 'ar') { await page.click('button[data-lang="ar"]'); await page.waitForTimeout(400); }
        const m = await measure();
        c.ok(`[${lang}] documentElement.scrollWidth === 390`, m.scrollWidth === 390, m.scrollWidth);
        c.near(`[${lang}] menu button top vs logo row top`, m.menuTop, m.rowTop, 8);
        c.near(`[${lang}] menu button centre vs logo centre (same row)`, m.menuMid, m.logoMid, 8);
      }
      const dir = await page.evaluate(() => document.documentElement.dir);
      c.ok('[ar] html dir=rtl', dir === 'rtl', dir);

      await page.locator('#option-3 .behind-switch').scrollIntoViewIfNeeded();
      await page.click('#option-3 .behind-switch');
      await page.waitForTimeout(1500); // grid-template-rows .7s + trace transform .6s/.1s
      const t = await page.evaluate(() => {
        const tr = document.querySelector('#option-3 .trace');
        const wrap = document.querySelector('#option-3 .trace-wrap');
        return {
          transform: getComputedStyle(tr).transform,
          traceTop: tr.getBoundingClientRect().top,
          wrapTop: wrap.getBoundingClientRect().top,
          scrollWidth: document.documentElement.scrollWidth,
        };
      });
      c.ok('[ar + behind] #option-3 .trace transform is none', t.transform === 'none', t.transform);
      c.ok('[ar + behind] #option-3 .trace top not above .trace-wrap top', t.traceTop >= t.wrapTop - 0.5, { traceTop: round(t.traceTop), wrapTop: round(t.wrapTop) });
      c.ok('[ar + behind] documentElement.scrollWidth === 390', t.scrollWidth === 390, t.scrollWidth);
    } finally { await ctx.close(); }
  });
}

async function t9PhoneTrace() {
  await test(9, '1024px and 1280px with behind on: phone does not overlap the trace', async (c) => {
    for (const width of [1024, 1280]) {
      const { ctx, page } = await openPage({ viewport: { width, height: 900 } });
      try {
        await page.click('#option-1 .behind-switch');
        for (const v of HEROES) { // bring each hero on screen so its entrance (is-in) and tilt apply
          await page.locator(`#option-${v}`).scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
        }
        await page.waitForTimeout(2400); // tilt transition 1.6s + .45s, grid .7s
        const boxes = await page.evaluate(() => [1, 2, 3, 4, 5].map((v) => {
          const p = document.querySelector(`#option-${v} .phone`).getBoundingClientRect();
          const t = document.querySelector(`#option-${v} .trace`).getBoundingClientRect();
          const ix = Math.min(p.right, t.right) - Math.max(p.left, t.left);
          const iy = Math.min(p.bottom, t.bottom) - Math.max(p.top, t.top);
          const r = (b) => [b.left, b.top, b.right, b.bottom].map((n) => Math.round(n));
          return { v, phone: r(p), trace: r(t), overlapX: Math.round(ix * 10) / 10, overlapY: Math.round(iy * 10) / 10, intersects: ix > 0 && iy > 0 };
        }));
        for (const b of boxes) c.ok(`[${width}px] #option-${b.v} phone vs trace`, !b.intersects, b);
      } finally { await ctx.close(); }
    }
  });
}

async function t10ReducedMotion() {
  await test(10, 'prefers-reduced-motion: video waits for play, phone does not animate', async (c) => {
    const { ctx, page } = await openPage({ reducedMotion: 'reduce' });
    try {
      await page.waitForTimeout(1500);
      const v0 = await page.evaluate(() => { const v = document.querySelector('#option-1 video[data-demo-media]'); return { paused: v.paused, t: v.currentTime }; });
      c.ok('video does not autoplay under reduced motion', v0.paused && v0.t === 0, v0);
      await page.click('#option-1 .pause-btn');
      const played = await pollUntil(() => page.evaluate(() => { const v = document.querySelector('#option-1 video[data-demo-media]'); return v.currentTime > 0.5 ? v.currentTime : null; }), 6000, 150);
      c.ok('play button starts the video', !!played, played);

      const phoneAnims = () => page.evaluate(() => [...document.querySelectorAll('.phone, .phone-tilt')]
        .flatMap((el) => el.getAnimations().filter((a) => a.playState === 'running')
          .map((a) => `${el.closest('.hero').id} ${el.className}: ${a.animationName || a.transitionProperty}`)));
      c.ok('no running animation on .phone/.phone-tilt (idle)', (await phoneAnims()).length === 0, await phoneAnims());

      await page.click('#option-1 .chip[data-j="payroll"]'); // option 1 "lift"
      const a1 = await phoneAnims();
      await page.locator('#option-5').scrollIntoViewIfNeeded();
      await page.click('#option-5 .chip[data-j="ews"]'); // option 5 "flip"
      const a5 = await phoneAnims();
      c.ok('no running animation on .phone/.phone-tilt after chip switch (option 1 lift)', a1.length === 0, a1);
      c.ok('no running animation on .phone/.phone-tilt after chip switch (option 5 flip)', a5.length === 0, a5);
    } finally { await ctx.close(); }
  });
}

async function t11DarkContrast() {
  await test(11, 'Dark theme contrast: #option-5 lit trace time >= 4.5:1', async (c) => {
    const { ctx, page } = await openPage({ colorScheme: 'dark' });
    try {
      await page.addScriptTag({ content: CONTRAST_LIB });
      const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
      c.ok('dark scheme active', /dark/.test(scheme), scheme);

      await page.locator('#option-5').scrollIntoViewIfNeeded();
      await page.click('#option-5 .behind-switch');
      await page.click('#option-5 .chip[data-j="ews"]'); // first trace call lights at 0.6s instead of 7.25s (same CSS)
      const lit = await pollUntil(() => page.evaluate(() => !!document.querySelector('#option-5 .tr-item.is-lit')), 9000, 150);
      c.ok('#option-5 has a lit trace item', !!lit);
      await page.waitForTimeout(500); // colour transition .3s
      const tt = await page.evaluate(() => {
        const time = document.querySelector('#option-5 .tr-item.is-lit .tr-time');
        const trace = document.querySelector('#option-5 .trace');
        return { text: time.textContent, ...window.__qa.ratio(time, trace) };
      });
      c.ok('#option-5 .tr-item.is-lit .tr-time vs .trace background >= 4.5', tt.ratio >= 4.5, { ratio: round(tt.ratio), fg: tt.fg, bg: tt.bg });
    } finally { await ctx.close(); }
  });
}

/* ------------------------------------------------------------------ main */
(async () => {
  const t0 = Date.now();
  browser = await chromium.launch({ executablePath: CHROME });
  try {
    await t1Dialog();
    await t2Keyboard();
    await t3BodyClick();
    await t4AnchorOffset();
    await t5Pause();
    await t6GlobalToggles();
    await t7AllChips();
    await t8Mobile();
    await t9PhoneTrace();
    await t10ReducedMotion();
    await t11DarkContrast();
  } finally {
    await browser.close();
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (failed.length) console.log(`Failed: ${failed.map((r) => r.id).join(', ')}`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

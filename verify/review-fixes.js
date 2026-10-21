// Checks the fixes from the code review of the glass variants and the Tilt page (landing-d).
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const url = (p) => pathToFileURL(path.resolve(__dirname, '..', p)).href;
let fails = 0;
const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: exe });
  const page = async (p, w, h, opts = {}) => {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
    const pg = await ctx.newPage(); const errs = [];
    pg.on('pageerror', (e) => errs.push(e.message));
    await pg.addInitScript(() => sessionStorage.setItem('aion-night-loader', '1'));
    await pg.goto(url(p)); await pg.waitForTimeout(1500);
    if (opts.ar) { await pg.click('button[data-lang="ar"]'); await pg.waitForTimeout(600); }
    return { pg, ctx, errs };
  };
  // 1 · reduced motion + Arabic: ribbons do not move
  { const { pg, ctx, errs } = await page('landing-d/index.html', 360, 740, { reduce: true, ar: true });
    const r = await pg.evaluate(() => [...document.querySelectorAll('.ribbon ul')].map((u) => getComputedStyle(u).animationName));
    ok(r.every((n) => n === 'none'), `reduce+ar ribbons static (${r.join(',')})`); ok(!errs.length, 'no errors ' + errs); await ctx.close(); }
  // 2 · ribbons never show a blank tail at wide screens
  for (const [w, ar] of [[1920, false], [1920, true], [2560, false], [2560, true]]) {
    const { pg, ctx } = await page('landing-d/index.html', w, 1080, { ar });
    const r = await pg.evaluate(() => [...document.querySelectorAll('.ribbon')].map((rb) => { const u = rb.querySelector('ul'); return u.offsetWidth - rb.offsetWidth; }));
    ok(r.every((d) => d >= 0), `ribbon list wider than ribbon at ${w} ${ar ? 'ar' : 'en'} (margin ${r.join(',')}px)`); await ctx.close(); }
  // 3 · pause button pauses the ribbons
  { const { pg, ctx } = await page('landing-d/index.html', 1440, 900);
    await pg.click('#rib-pause');
    const st = await pg.evaluate(() => getComputedStyle(document.querySelector('.ribbon ul')).animationPlayState);
    ok(st === 'paused', 'pause button pauses ribbons'); await ctx.close(); }
  // 4 · reduced motion keeps each variant's own lean
  for (const ar of [false, true]) {
    const { pg, ctx } = await page('mockups/index.html', 1440, 900, { reduce: true, ar });
    const r = await pg.evaluate(() => ['6', '7', '8'].map((v) => { const m = new DOMMatrix(getComputedStyle(document.querySelector(`.nhero[data-v="${v}"] .g3d`)).transform); return { v, ry: Math.asin(Math.max(-1, Math.min(1, -m.m13))) * 180 / Math.PI }; }));
    const [s6, s7, s8] = r.map((x) => x.ry); const sg = ar ? -1 : 1;
    ok(s6 * sg < -5 && Math.abs(s7) < 1 && s8 * sg > 5, `reduce ${ar ? 'ar' : 'en'} leans 6/7/8 = ${r.map((x) => x.ry.toFixed(1)).join(' / ')}`); await ctx.close(); }
  // 5 · tilt loop goes idle
  { const { pg, ctx } = await page('landing-d/index.html', 1440, 900);
    await pg.mouse.move(700, 400); await pg.waitForTimeout(2500);
    const n = await pg.evaluate(() => new Promise((res) => { let c = 0; const g = document.querySelector('#hero .g3d') || document.querySelector('.g3d'); const mo = new MutationObserver((m) => { c += m.length; }); mo.observe(g, { attributes: true, attributeFilter: ['style'] }); setTimeout(() => { mo.disconnect(); res(c); }, 600); }));
    ok(n === 0, `glass stage idle after settling (${n} writes in 600ms)`);
    await pg.mouse.move(300, 300); await pg.waitForTimeout(200);
    const moved = await pg.evaluate(() => document.querySelector('.g3d').style.transform);
    ok(/rotateY/.test(moved), 'pointer wakes the stage again');
    // 6 · keyboard on the wall
    await pg.evaluate(() => document.querySelector('#journeys').scrollIntoView()); await pg.waitForTimeout(400);
    await pg.focus('.wcard[data-j="ews"]'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1500);
    const k = await pg.evaluate(() => ({ jid: heroes[0].jid, pressed: document.querySelector('.wcard[data-j="ews"]').getAttribute('aria-pressed'), name: document.querySelector('.wcard[data-j="ews"]').getAttribute('aria-label') }));
    ok(k.jid === 'ews' && k.pressed === 'true', `keyboard Enter plays journey (${JSON.stringify(k)})`); await ctx.close(); }
  // 7 · nothing clipped at 360 in the tilted sections
  for (const ar of [false, true]) {
    const { pg, ctx } = await page('landing-d/index.html', 360, 740, { ar });
    await pg.evaluate(() => document.querySelector('#layer').scrollIntoView()); await pg.waitForTimeout(800);
    const bad = await pg.evaluate(() => [...document.querySelectorAll('.plate, .flip, .tcard, .close-card')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1); }).map((e) => e.className));
    ok(!bad.length, `360 ${ar ? 'ar' : 'en'} no clipped plates/cards ${bad.join(',')}`); await ctx.close(); }
  // 8 · screen readers get one list of the nine rails; the moving copies are hidden; the pause button is named
  for (const ar of [false, true]) {
    const { pg, ctx } = await page('landing-d/index.html', 1440, 900, { ar });
    const r = await pg.evaluate(() => ({
      sr: [...document.querySelectorAll('#rails-sr li')].map((l) => l.textContent),
      hidden: [...document.querySelectorAll('.ribbon')].map((rb) => rb.getAttribute('aria-hidden')),
      copies: [...document.querySelectorAll('.ribbon ul')].map((u) => u.children.length),
    }));
    const lang = ar ? 'ar' : 'en';
    ok(r.sr.length === 9 && new Set(r.sr).size === 9 && r.sr.includes(ar ? 'نفاذ' : 'Nafath') && !r.sr.includes(ar ? 'Nafath' : 'نفاذ'), `${lang} #rails-sr lists the 9 rails once, in the page language (${r.sr.length})`);
    ok(r.hidden.length === 2 && r.hidden.every((h) => h === 'true') && r.copies.every((n) => n === 27), `${lang} ribbons aria-hidden (${r.hidden.join(',')}), each list has 3x rails (${r.copies.join(',')})`);
    const name = ar ? 'إيقاف الشريط المتحرك' : 'Pause the moving rails';
    const n = await pg.getByRole('button', { name, exact: true }).count();
    ok(n === 1, `${lang} #rib-pause accessible name "${name}" (${n} match)`); await ctx.close(); }
  // 9 · pause holds without hover/focus, and a second press resumes
  { const { pg, ctx } = await page('landing-d/index.html', 1440, 900);
    const state = async () => { await pg.mouse.move(5, 5); await pg.evaluate(() => document.activeElement && document.activeElement.blur()); await pg.waitForTimeout(100);
      return pg.evaluate(() => ({ play: [...document.querySelectorAll('.ribbon ul')].map((u) => getComputedStyle(u).animationPlayState), pressed: document.querySelector('#rib-pause').getAttribute('aria-pressed'), cls: document.querySelector('.ribbons').classList.contains('paused') })); };
    await pg.click('#rib-pause'); const s1 = await state();
    ok(s1.play.every((p) => p === 'paused') && s1.pressed === 'true' && s1.cls, `pause stays on after pointer leaves and focus moves (${JSON.stringify(s1)})`);
    await pg.click('#rib-pause'); const s2 = await state();
    ok(s2.play.every((p) => p === 'running') && s2.pressed === 'false' && !s2.cls, `second press resumes the ribbons (${JSON.stringify(s2)})`); await ctx.close(); }
  // 10 · wall cards: exactly one aria-pressed across two switches, kept through a language change
  { const { pg, ctx } = await page('landing-d/index.html', 1440, 900);
    const pressed = () => pg.evaluate(() => ({ jid: heroes[0].jid, on: [...document.querySelectorAll('#wall .wcard')].filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.j) }));
    await pg.click('.wcard[data-j="sme"]'); await pg.waitForTimeout(1200); const p1 = await pressed();
    await pg.click('.wcard[data-j="payroll"]'); await pg.waitForTimeout(1200); const p2 = await pressed();
    ok(p1.jid === 'sme' && p1.on.join() === 'sme' && p2.jid === 'payroll' && p2.on.join() === 'payroll', `wall aria-pressed follows two switches (${JSON.stringify([p1, p2])})`);
    await pg.click('button[data-lang="ar"]'); await pg.waitForTimeout(600);
    const a = await pg.evaluate(() => ({ on: [...document.querySelectorAll('#wall .wcard')].filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.j), labels: [...document.querySelectorAll('#wall .wcard')].map((c) => c.getAttribute('aria-label')) }));
    ok(a.on.join() === 'payroll' && a.labels.length === 6 && a.labels.every((l) => /: شغّلها في الواجهة$/.test(l)), `ar re-render keeps pressed card and Arabic labels (${a.on.join()})`); await ctx.close(); }
  // 11 · scrollFx: --p / --sep follow the scroll, then stop writing; constant under reduced motion
  for (const reduce of [false, true]) {
    const { pg, ctx } = await page('landing-d/index.html', 1440, 900, { reduce });
    const vars = () => pg.evaluate(() => ({ p: parseFloat(document.querySelector('#wall').style.getPropertyValue('--p')), sep: parseFloat(document.querySelector('#stack').style.getPropertyValue('--sep')) }));
    const go = async (sel) => { await pg.evaluate((s) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY), sel); await pg.waitForTimeout(300); };
    const top = await vars(); await go('#journeys'); const atWall = await vars(); await go('#layer'); const atStack = await vars();
    const seq = JSON.stringify([top, atWall, atStack]);
    if (reduce) ok([top, atWall, atStack].every((v) => v.p === 0 && v.sep === 70), `reduce scrollFx constant --p 0 / --sep 70px ${seq}`);
    else {
      ok(top.p === 1 && atWall.p === 0 && top.sep < atStack.sep, `scrollFx: wall stands up and stack separates on scroll ${seq}`);
      const w = await pg.evaluate(() => new Promise((res) => { let c = 0; const mo = new MutationObserver((m) => { c += m.length; }); ['#wall', '#stack'].forEach((s) => mo.observe(document.querySelector(s), { attributes: true, attributeFilter: ['style'] })); setTimeout(() => { mo.disconnect(); res(c); }, 600); }));
      ok(w === 0, `scrollFx idle when not scrolling (${w} writes in 600ms)`);
    }
    await ctx.close(); }
  // 12 · glass stage wakes on scroll and on the language switch alone (no pointer movement)
  { const { pg, ctx } = await page('landing-d/index.html', 1440, 900);
    await pg.waitForTimeout(1500);
    const tf = () => pg.evaluate(() => document.querySelector('.g3d').style.transform);
    const t0 = await tf(); await pg.evaluate(() => scrollTo(0, 200)); await pg.waitForTimeout(800);
    ok(t0 && (await tf()) !== t0, 'scroll wakes the idle glass stage');
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(2000);
    const lw = await pg.evaluate(() => new Promise((res) => { let c = 0; const mo = new MutationObserver((m) => { c += m.length; }); mo.observe(document.querySelector('.g3d'), { attributes: true, attributeFilter: ['style'] }); document.querySelector('button[data-lang="ar"]').click(); setTimeout(() => { mo.disconnect(); res(c); }, 600); }));
    ok(lw > 0, `aion:lang wakes the idle glass stage (${lw} writes)`); await ctx.close(); }
  // 12b · animated (not reduced) lean mirrors in Arabic for the leaning variants 6 and 8
  { const { pg, ctx } = await page('mockups/index.html', 1440, 900);
    const ryAt = async (v) => {
      const sel = `.nhero[data-v="${v}"]`;
      await pg.evaluate((s) => document.querySelector(s).scrollIntoView(), sel); await pg.waitForTimeout(1500);
      // computed (not inline) transform: before the loop first writes, the CSS resting lean is what is on screen
      return pg.evaluate((s) => { const m = new DOMMatrix(getComputedStyle(document.querySelector(s + ' .g3d')).transform); return +(Math.asin(Math.max(-1, Math.min(1, -m.m13))) * 180 / Math.PI).toFixed(1); }, sel);
    };
    const en6 = await ryAt('6'); const en8 = await ryAt('8');
    await pg.evaluate(() => document.querySelector('button[data-lang="ar"]').click()); await pg.waitForTimeout(600);
    const ar6 = await ryAt('6'); const ar8 = await ryAt('8');
    ok(en6 < -5 && ar6 > 5 && en8 > 5 && ar8 < -5, `animated lean mirrors in ar: 6 en/ar ${en6} / ${ar6}, 8 en/ar ${en8} / ${ar8}`); await ctx.close(); }
  // 13 · nav links glide to their section and land it under the sticky header
  for (const reduce of [false, true]) {
    const { pg, ctx } = await page('landing-d/index.html', 1440, 900, { reduce });
    for (const id of ['layer', 'deploy']) {
      await pg.click(`.nav a[href="#${id}"]`);
      const gap = () => pg.evaluate((i) => document.getElementById(i).getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom, id);
      await pg.waitForFunction((i) => Math.abs(document.getElementById(i).getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom) < 6, id, { timeout: 8000 }).catch(() => {});
      await pg.waitForTimeout(600);
      const g = await gap();
      ok(Math.abs(g) < 6, `${reduce ? 'reduce ' : ''}nav #${id} lands under the header (gap ${g.toFixed(1)}px, hash ${await pg.evaluate(() => location.hash)})`);
    }
    await ctx.close(); }
  await b.close();
  console.log(fails ? `${fails} FAILED` : 'ALL PASS');
  process.exit(fails ? 1 : 0);
})();

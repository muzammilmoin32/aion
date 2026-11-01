// Open Banking section on landing-e / landing-f: nav goes there, "Visit Spire" opens spiretech.co, the particle shape
// (and on landing-f the light lines) turn blue there, the cursor follows the section colour, Arabic text.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
// bright, coloured pixels inside one canvas, from a real screenshot (WebGL canvases read back blank)
async function shot(p, sel) {
  const box = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(innerWidth, r.right) - Math.max(0, r.x), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.y) }; }, sel);
  if (!box || box.width < 10 || box.height < 10) return null;
  await p.evaluate((keep) => { const st = document.createElement('style'); st.id = 'only'; st.textContent = `body > *:not(canvas):not(:has(canvas)) { visibility: hidden !important } body { background: #000 !important } canvas:not(${keep}) { visibility: hidden !important } ${keep} { visibility: visible !important }`; document.head.appendChild(st); }, sel);
  const buf = await p.screenshot();   // the canvases fill the viewport; a clip can scroll the page back to the top
  await p.evaluate(() => document.getElementById('only').remove());
  return p.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const t = document.createElement('canvas'); t.width = img.width; t.height = img.height; const x = t.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, t.width, t.height).data; let r = 0, g = 0, bl = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) { const R = d[i], G = d[i + 1], B = d[i + 2]; if (Math.max(R, G, B) - Math.min(R, G, B) > 50) { r += R; g += G; bl += B; n++; } }
    return n ? { r: r / n | 0, g: g / n | 0, b: bl / n | 0, n } : { n: 0 };
  }, buf.toString('base64'));
}
const blue = (c) => c && c.n > 20 && c.b > c.g * 1.25 && c.b > c.r * 1.4;   // blue: not teal (g close to b), not purple (r high)
const at = (p, id) => p.evaluate((i) => scrollTo(0, document.getElementById(i).getBoundingClientRect().top + scrollY - 80), id);

(async () => {
  const b = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const dir of ['landing-e', 'landing-f']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href);
    await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.querySelectorAll('a[href="#open-banking"]').length === 3 && !!document.getElementById('open-banking')), `${dir}: section exists; header, mobile menu and footer link to it`);
    const cta = await p.evaluate(() => { const a = document.querySelector('#open-banking a.btn-primary'); return a && { href: a.href, target: a.target, rel: a.rel }; });
    ok(cta && cta.href === 'https://spiretech.co/' && cta.target === '_blank' && /noopener/.test(cta.rel), `${dir}: Visit Spire → spiretech.co in a new tab`);
    const pc = await p.evaluate(() => { const c = [...document.querySelectorAll('canvas')].find((x) => x.id !== 'th-stream' && x.width > 300); if (c) c.id = c.id || 'pcan'; return '#' + c.id; });

    // header click goes to the section (page navigation)
    await p.click('header a[href="#open-banking"]');
    await p.waitForTimeout(8000);
    const pos = await p.evaluate(() => { const r = document.getElementById('open-banking').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, scene: document.body.dataset.scene }; });
    ok(pos.top < 300 && pos.bottom > 400 && pos.scene === 'openbank', `${dir}: header "Open Banking" scrolls to the section (top ${pos.top | 0}px, scene ${pos.scene})`);
    // software rendering in the test browser runs the theme's 1 s blend over many seconds: poll, don't snapshot once
    const until = async (sel) => { let c; for (let i = 0; i < 8; i += 1) { c = await shot(p, sel); if (blue(c)) break; await p.waitForTimeout(4000); } return c; };
    const pb = await until(pc);
    ok(blue(pb), `${dir}: particle shape is blue (${JSON.stringify(pb)})`);
    if (dir === 'landing-f') { const sb = await until('#th-stream'); ok(blue(sb), `landing-f: lines are blue (${JSON.stringify(sb)})`); }
    await p.screenshot({ path: path.join(__dirname, 'screenshots', `${dir}-open-banking.png`) });

    // cursor colour follows the section
    await p.mouse.move(700, 450); await p.mouse.move(720, 460); await p.waitForTimeout(900);
    const cur = await p.evaluate(() => ({ f: getComputedStyle(document.querySelector('#cursor .ct')).filter, ring: getComputedStyle(document.getElementById('cursor'), '::after').borderTopColor }));
    ok(/hue-rotate\(40deg\)/.test(cur.f) && cur.ring.replace(/\s/g, '') !== 'rgb(255,255,255)', `${dir}: cursor blue at Open Banking (ring ${cur.ring})`);
    await at(p, 'ai966'); await p.waitForTimeout(1500); await p.mouse.move(700, 450); await p.waitForTimeout(500);
    ok(await p.evaluate(() => document.body.dataset.scene === 'neural' && /hue-rotate\(82deg\)/.test(getComputedStyle(document.querySelector('#cursor .ct')).filter)), `${dir}: cursor purple at Ai966`);
    await at(p, 'proof'); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => /hue-rotate\(0deg\)/.test(getComputedStyle(document.querySelector('#cursor .ct')).filter)), `${dir}: cursor back to teal after`);

    // Arabic
    await p.click('#langBtn'); await p.waitForTimeout(800);
    const ar = await p.evaluate(() => {
      const s = document.getElementById('open-banking'); const left = [];
      const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.nodeValue.replace(/\b(Spire|Aion)\b/g, '').trim(); if (/[A-Za-z]{3,}/.test(t)) left.push(t); }
      return { left, cap: s.querySelector('.slot').dataset.caption };
    });
    ok(ar.left.length === 0 && /[؀-ۿ]/.test(ar.cap), `${dir}: section fully Arabic ${JSON.stringify(ar.left)}`);
    await at(p, 'open-banking'); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(__dirname, 'screenshots', `${dir}-open-banking-ar.png`) });
    await p.click('#langBtn'); await p.evaluate(() => localStorage.removeItem('aion-v2-lang'));
    ok(errs.length === 0, `${dir}: no page errors ${errs.join(' | ')}`);
    await p.close();
  }
  // phone width: no sideways scroll
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href);
  await m.evaluate(() => document.getElementById('open-banking').scrollIntoView()); await m.waitForTimeout(1500);
  ok(await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '390px: no horizontal scroll');
  await m.screenshot({ path: path.join(__dirname, 'screenshots', 'landing-e-open-banking-390.png') });
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

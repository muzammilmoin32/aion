// The main pages (no window.AION_STREAM_ONLY) keep the light stream teal: the purple tint is landing-f only.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
// colour of the bright pixels inside one element's box, from a real screenshot (decoded in the page);
// WebGL canvases read back blank through drawImage, so a screenshot is the only honest source
async function shot(p, sel, hide) {
  const box = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(innerWidth, r.right) - Math.max(0, r.x), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.y) }; }, sel);
  if (!box || box.width < 10 || box.height < 10) return null;
  await p.evaluate((h) => { const st = document.createElement('style'); st.id = 'only'; st.textContent = h; document.head.appendChild(st); }, hide);
  const buf = await p.screenshot({ clip: box });
  await p.evaluate(() => document.getElementById('only').remove());
  return p.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const t = document.createElement('canvas'); t.width = img.width; t.height = img.height; const x = t.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, t.width, t.height).data; let r = 0, g = 0, bl = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) { const R = d[i], G = d[i + 1], B = d[i + 2]; const mx = Math.max(R, G, B), mn = Math.min(R, G, B); if (mx - mn > 50) { r += R; g += G; bl += B; n++; } }
    return n ? { r: r / n | 0, g: g / n | 0, b: bl / n | 0, n } : { n: 0 };
  }, buf.toString('base64'));
}
const purple = (c) => c && c.n > 20 && c.r > c.g && c.b > c.g;
const teal = (c) => c && c.n > 20 && c.g > c.r && !purple(c);
const only = (keep) => `body > *:not(canvas):not(:has(canvas)) { visibility: hidden !important } body { background: #000 !important } canvas:not(${keep}) { visibility: hidden !important } ${keep} { visibility: visible !important }`;
(async () => {
  const b = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const page of ['index.html', 'landing-d/index.html', 'mockups/index.html']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('aion-night-loader', '1'); } catch (e) { /* storage blocked */ } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', page)).href);
    await p.waitForTimeout(1500);
    const pre = await p.evaluate(() => ({ only: 'AION_STREAM_ONLY' in window, stream: !!document.getElementById('th-stream'), skin: document.documentElement.dataset.skin }));
    ok(!pre.only && pre.stream && pre.skin === 'night', `${page}: night skin, #th-stream present, no AION_STREAM_ONLY (${JSON.stringify(pre)})`);
    if (!pre.stream) { await ctx.close(); continue; }
    // three points along the stream's run: just under the hero, the middle, and near #contact where it ends
    const span = await p.evaluate(() => {
      const top = (e) => e.getBoundingClientRect().top + scrollY;
      const h = document.querySelector('.hero'); const c = document.getElementById('contact');
      const a = h ? top(h) : 0; const z = c ? top(c) : document.documentElement.scrollHeight - innerHeight;
      return { a, z };
    });
    const at = [0.05, 0.45, 0.85].map((f) => Math.round(span.a + (span.z - span.a) * f));
    const seen = [];
    for (const y of at) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(2500);
      const c = await shot(p, '#th-stream', only('#th-stream'));
      seen.push(c);
      ok(teal(c), `${page}: stream teal at y=${y} (${JSON.stringify(c)})`);
    }
    await p.screenshot({ path: path.join(__dirname, 'screenshots', `${page.replace(/[\/.]/g, '-')}-no-tint.png`) });
    ok(!seen.some(purple), `${page}: no purple-dominant sample at any scroll position`);
    ok(errs.length === 0, `${page}: no page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

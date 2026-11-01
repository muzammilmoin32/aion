// Ai966 on landing-e/landing-f: the particle shape (theme) and the light lines (landing-f) turn purple there, teal elsewhere.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
// average hue character of the bright pixels of one canvas: purple has blue > green, teal has green > red
const sample = (sel) => (s) => {
  const c = document.querySelector(s); if (!c) return null;
  const t = document.createElement('canvas'); t.width = 240; t.height = 150; const x = t.getContext('2d');
  x.drawImage(c, 0, 0, 240, 150); const d = x.getImageData(0, 0, 240, 150).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) { if (d[i + 3] > 40 && d[i] + d[i + 1] + d[i + 2] > 120) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; } }
  return n ? { r: r / n | 0, g: g / n | 0, b: b / n | 0, n } : { n: 0 };
};
// colour of the bright pixels inside one element's box, from a real screenshot (decoded in the page)
async function shot(p, sel, hide) {
  const box = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(innerWidth, r.right) - Math.max(0, r.x), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.y) }; }, sel);
  if (!box || box.width < 10 || box.height < 10) return null;
  // show only that canvas: hide page content and the other canvas so only its pixels count
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
const teal = (c) => c && c.n > 20 && c.g > c.r && !(c.r > c.g && c.b > c.g);
(async () => {
  const b = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const dir of ['landing-e', 'landing-f']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href);
    await p.waitForTimeout(1500);
    const go = async (id) => { await p.evaluate((i) => { const e = document.getElementById(i); scrollTo(0, e.getBoundingClientRect().top + scrollY - 80); }, id); await p.waitForTimeout(4000); };
    // the theme's particle canvas: the first canvas that is not the light stream
    const pc = await p.evaluate(() => { const c = [...document.querySelectorAll('canvas')].find((x) => x.id !== 'th-stream' && x.width > 300); if (c) c.id = c.id || 'pcan'; return c ? '#' + c.id : null; });
    const sc = await p.evaluate(() => (document.getElementById('th-stream') ? '#th-stream' : null));
    const only = (keep) => `body > *:not(canvas):not(:has(canvas)) { visibility: hidden !important } body { background: #000 !important } canvas:not(${keep}) { visibility: hidden !important } ${keep} { visibility: visible !important }`;
    const P = () => shot(p, pc, only(pc)); const S = () => (sc ? shot(p, sc, only(sc)) : null);
    await go('numbers');
    const p1 = await P(); const s1 = await S();
    await go('ai966');
    ok(await p.evaluate(() => document.body.dataset.scene === 'neural'), `${dir}: Ai966 is the active scene`);
    const p2 = await P(); const s2 = await S();
    await p.screenshot({ path: path.join(__dirname, 'screenshots', `${dir}-ai966-purple.png`) });
    ok(!purple(p1) && purple(p2), `${dir}: particles teal before (${JSON.stringify(p1)}) → purple at Ai966 (${JSON.stringify(p2)})`);
    if (dir === 'landing-f') ok(sc && teal(s1) && purple(s2), `landing-f: lines teal before (${JSON.stringify(s1)}) → purple at Ai966 (${JSON.stringify(s2)})`);
    await go('proof');
    const p3 = await P(); const s3 = await S();
    ok(!purple(p3) && (dir === 'landing-e' || !purple(s3)), `${dir}: back to teal after Ai966 (${JSON.stringify(p3)} ${JSON.stringify(s3)})`);
    ok(errs.length === 0, `${dir}: no page errors ${errs.join(' | ')}`);
    await p.close();
  }
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

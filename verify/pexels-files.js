// Finds the MP4 file URLs for the chosen Pexels clips (opens each video page in the browser).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');
const uniq = require('../screenshots/pexels-items.json');
const want = JSON.parse(process.argv[2] || '{}');

(async () => {
  const b = await chromium.launch({ executablePath: path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe'), args: ['--disable-blink-features=AutomationControlled'] });
  const c = await b.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', viewport: { width: 1366, height: 900 } });
  const out = {};
  for (const [j, id] of Object.entries(want)) {
    const href = uniq.find((u) => u.h.endsWith(`-${id}/`)).h;
    const p = await c.newPage();
    const seen = new Set();
    p.on('request', (r) => { if (/video-files/.test(r.url())) seen.add(r.url().split('?')[0]); });
    await p.goto(href, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(5000);
    const html = await p.content();
    (html.match(/https:\/\/videos\.pexels\.com\/video-files\/[^"'\s<>]+?\.mp4/g) || []).forEach((u) => seen.add(u));
    const title = await p.evaluate(() => document.title);
    out[j] = { id, title, files: [...seen] };
    console.log(j, id, title.slice(0, 80));
    [...seen].forEach((u) => console.log('   ', u));
    await p.close();
  }
  fs.writeFileSync(path.resolve(__dirname, '..', 'screenshots', process.argv[3] || 'pexels-files.json'), JSON.stringify(out, null, 1));
  await b.close();
})();

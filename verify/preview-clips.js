// Previews remote candidate clips: three frames each (1 s, 4 s, 8 s), portrait-cropped like the phone.
// Usage: node preview-clips.js <candidates.json in screenshots/> <out.png>
const path = require('path');
const { chromium } = require('playwright-core');
const cand = require(path.resolve(__dirname, '..', 'screenshots', process.argv[2]));
const OUT = path.resolve(__dirname, '..', 'screenshots', process.argv[3] || 'preview-clips.png');

(async () => {
  const b = await chromium.launch({ executablePath: path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe') });
  const p = await b.newPage({ viewport: { width: 1400, height: 300 } });
  const rows = [];
  for (const [k, { id, files }] of Object.entries(cand)) {
    const own = files.filter((f) => f.includes(`/${id}/`));
    const src = own.find((f) => /640_360|360_640/.test(f)) || own[0];
    await p.setContent('<body style="margin:0;background:#fff"><video id="v" muted playsinline style="width:240px;height:300px;object-fit:cover"></video></body>');
    const frames = [];
    const ok = await p.evaluate(async (s) => {
      const v = document.getElementById('v');
      v.src = s;
      try { await new Promise((r, j) => { v.addEventListener('loadeddata', r, { once: true }); v.addEventListener('error', j, { once: true }); setTimeout(j, 20000); }); return v.duration; } catch (e) { return 0; }
    }, src);
    for (const t of [1, 4, 8]) {
      if (!ok) break;
      await p.evaluate(async (tt) => { const v = document.getElementById('v'); v.currentTime = Math.min(tt, v.duration - 0.2); await new Promise((r) => v.addEventListener('seeked', r, { once: true })); }, t);
      await p.waitForTimeout(200);
      frames.push((await p.screenshot({ clip: { x: 0, y: 0, width: 240, height: 300 } })).toString('base64'));
    }
    rows.push({ k, id, dur: ok, frames });
    console.log(k, id, ok ? `${ok.toFixed(1)}s` : 'failed');
  }
  const q = await b.newPage({ viewport: { width: 1500, height: 400 } });
  await q.setContent(`<style>body{margin:0;font:13px sans-serif}.r{display:flex;gap:4px;align-items:center;margin:4px}.r span{width:110px}</style>${rows.map((r) => `<div class="r"><span>${r.k} ${r.id}<br>${r.dur ? r.dur.toFixed(1) + 's' : ''}</span>${r.frames.map((f) => `<img style="height:220px" src="data:image/png;base64,${f}">`).join('')}</div>`).join('')}`);
  await q.screenshot({ path: OUT, fullPage: true });
  await b.close();
})();

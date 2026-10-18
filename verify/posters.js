// Posters from ~1.5 s into each clip (portrait crop at each clip's focal point), plus a contact sheet.
// Usage: node posters.js '{"sme":"50% 50%", ...}'
const fs = require('fs');
const path = require('path');
const url = require('url');
const { chromium } = require('playwright-core');
const FOCUS = JSON.parse(process.argv[2] || '{}');

(async () => {
  const b = await chromium.launch({ executablePath: path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe') });
  const p = await b.newPage({ viewport: { width: 405, height: 720 } });
  await p.goto(url.pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href);
  const shots = [];
  for (const j of ['sme', 'payroll', 'sadad', 'cards', 'lending', 'ews']) {
    const src = url.pathToFileURL(path.resolve(__dirname, '..', 'assets', 'video', `${j}-720.mp4`)).href;
    const info = await p.evaluate(async ([s, pos]) => {
      document.body.innerHTML = '';
      document.body.style.margin = 0;
      const v = document.createElement('video');
      v.muted = true;
      v.style.cssText = `position:fixed;inset:0;width:405px;height:720px;object-fit:cover;z-index:99999;object-position:${pos}`;
      v.src = s;
      document.body.appendChild(v);
      await new Promise((r) => v.addEventListener('loadeddata', r, { once: true }));
      v.currentTime = Math.min(1.5, v.duration / 3);
      await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
      return `${v.videoWidth}x${v.videoHeight} ${v.duration.toFixed(1)}s`;
    }, [src, FOCUS[j] || '50% 50%']);
    await p.waitForTimeout(300);
    const buf = await p.screenshot({ type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: 405, height: 720 } });
    fs.writeFileSync(path.resolve(__dirname, '..', 'assets', 'video', `${j}-poster.jpg`), buf);
    shots.push(buf.toString('base64'));
    console.log(j, info);
  }
  const q = await b.newPage({ viewport: { width: 1300, height: 400 } });
  await q.setContent(`<div style="display:flex;gap:6px">${shots.map((s) => `<img style="height:380px" src="data:image/jpeg;base64,${s}">`).join('')}</div>`);
  await q.screenshot({ path: path.resolve(__dirname, '..', 'screenshots', 'poster-sheet.png') });
  await b.close();
})();

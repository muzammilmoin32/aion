// Section 06 of landing-e/landing-f: the phone plays the main page's sample clips; steps follow the video; Arabic text.
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: exe, args: ['--autoplay-policy=no-user-gesture-required'] });
  for (const dir of ['landing-e', 'landing-f']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', dir, 'index.html')).href);
    await p.evaluate(() => document.getElementById('demos').scrollIntoView());
    await p.waitForFunction(() => { const v = document.querySelector('#screen video'); return v && v.readyState >= 2 && !v.paused; }, null, { timeout: 15000 }).catch(() => {});
    const r = await p.evaluate(() => { const v = document.querySelector('#screen video'); return { src: v.currentSrc, playing: !v.paused, t: v.currentTime, n: document.querySelector('.scr-n').textContent }; });
    ok(/assets\/video\/sme-720\.mp4$/.test(r.src) && r.playing, `${dir}: phone plays sme clip (${r.src.split('/').pop()}, playing=${r.playing})`);
    await p.evaluate(() => { const v = document.querySelector('#screen video'); v.currentTime = v.duration * 0.55; });
    await p.waitForTimeout(800);
    ok(await p.evaluate(() => document.querySelector('.scr-n').textContent === '4/6' && document.querySelectorAll('#ltrace .trace-row.done').length === 3), `${dir}: step follows video time (55% → 4/6)`);
    await p.click('#jlist .jitem[data-j="5"]');
    await p.waitForTimeout(600);
    ok(await p.evaluate(() => /ews-720\.mp4$/.test(document.querySelector('#screen video').src) && document.querySelector('.scr-n').textContent === '1/6'), `${dir}: early-warning journey → ews clip, back to step 1`);
    await p.click('#pauseBtn'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => document.querySelector('#screen video').paused), `${dir}: pause stops the video`);
    await p.click('#pauseBtn');
    await p.click('#langBtn'); await p.waitForTimeout(800);
    const ar = await p.evaluate(() => ({ dir: document.documentElement.dir, tag: document.querySelector('.scr-tag').textContent, cap: document.querySelector('#screen .cap').textContent, top: document.querySelector('.scr-top').textContent }));
    ok(ar.dir === 'rtl' && /[؀-ۿ]/.test(ar.tag) && /[؀-ۿ]/.test(ar.cap) && /[؀-ۿ]/.test(ar.top), `${dir}: Arabic overlay (${ar.tag} | ${ar.cap})`);
    await p.evaluate(() => { const v = document.querySelector('#screen video'); v.currentTime = v.duration * 0.9; });
    await p.waitForTimeout(800);
    ok(await p.evaluate(() => /[؀-ۿ]/.test(document.querySelector('#screen .cap').textContent)), `${dir}: Arabic caption after the step changes`);
    await p.locator('#demo').screenshot({ path: path.join(__dirname, 'screenshots', `${dir}-demos-ar.png`) });
    await p.click('#langBtn'); await p.waitForTimeout(300);
    await p.locator('#demo').screenshot({ path: path.join(__dirname, 'screenshots', `${dir}-demos-en.png`) });
    ok(errs.length === 0, `${dir}: no page errors ${errs.join(' | ')}`);
    await p.evaluate(() => localStorage.removeItem('aion-v2-lang'));
    await p.close();
  }
  // review gaps: pip not pre-filled on arrival, off-screen pause, autoplay blocked, Play under reduced motion
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href);
    await p.waitForTimeout(4000);   // longer than a step: a timer-driven pip would be full by now
    ok(await p.evaluate(() => !document.querySelector('#screen video').getAttribute('src')), 'clip not fetched while section 06 is far away');
    await p.evaluate(() => document.getElementById('demos').scrollIntoView());
    await p.waitForFunction(() => !document.querySelector('#screen video').paused, null, { timeout: 15000 }).catch(() => {});
    const a = await p.evaluate(() => { const v = document.querySelector('#screen video'); const pip = getComputedStyle(document.querySelector('#prog i.now'), '::after').transform; const m = /matrix\(([^,]+)/.exec(pip); return { t: v.currentTime, sx: m ? +m[1] : 1, n: document.querySelector('.scr-n').textContent }; });
    ok(a.n === '1/6' && a.sx < 0.6, `on arrival: step 1 and pip 1 not already full (t=${a.t.toFixed(2)}s, fill=${a.sx.toFixed(2)})`);
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
    ok(await p.evaluate(() => document.querySelector('#screen video').paused && document.getElementById('demo').classList.contains('paused')), 'off screen: video and pip paused');
    await p.evaluate(() => document.getElementById('demos').scrollIntoView()); await p.waitForTimeout(1200);
    ok(await p.evaluate(() => !document.querySelector('#screen video').paused), 'back on screen: plays again');
    await p.close();
  }
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('blocked', 'NotAllowedError')); }; });
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href);
    await p.evaluate(() => document.getElementById('demos').scrollIntoView()); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.querySelector('#pauseBtn span').textContent === 'Play' && document.querySelector('#pauseBtn use').getAttribute('href') === '#i-play'), 'autoplay blocked: button offers Play');
    await p.close();
  }
  {
    const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    await p.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href);
    await p.evaluate(() => document.getElementById('demos').scrollIntoView()); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.querySelector('#pauseBtn span').textContent === 'Play'), 'reduced motion: still, button says Play');
    await p.click('#pauseBtn'); await p.waitForTimeout(2500);
    ok(await p.evaluate(() => !document.querySelector('#screen video').paused && document.querySelector('#pauseBtn span').textContent === 'Pause'), 'reduced motion: Play starts the clip');
    await ctx.close();
  }
  // reduced motion: still frame, step 4
  const ctx = await b.newContext({ reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(pathToFileURL(path.resolve(__dirname, '..', 'landing-e', 'index.html')).href);
  await p.waitForTimeout(1500);
  ok(await p.evaluate(() => document.querySelector('#screen video').paused && document.querySelector('.scr-n').textContent === '4/6'), 'reduced motion: no playback, step 4/6 shown');
  await b.close();
  console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();

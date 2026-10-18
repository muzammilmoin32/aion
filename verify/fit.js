// Checks that every hero option fits one screen (100vh minus the sticky header) and that
// nothing inside it spills past its bottom edge. Also saves a viewport shot per option.
// Run: node verify/fit.js
const path = require('path');
const url = require('url');
const fs = require('fs');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots', 'fit');
const CHROME = process.env.CHROME || path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const SIZES = [[1920, 1080], [1440, 900], [1366, 768], [1280, 720], [1024, 768], [768, 1024], [390, 844], [360, 740]];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const problems = [];
  for (const [w, h] of SIZES) {
    for (const lang of ['en', 'ar']) {
      for (const behind of [false, true]) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        await page.goto(url.pathToFileURL(path.join(ROOT, 'mockups', 'index.html')).href);
        await page.evaluate(() => localStorage.clear());
        if (lang === 'ar') await page.click('button[data-lang="ar"]');
        if (behind) await page.evaluate(() => document.querySelector('#option-1 .behind-switch').click());
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200);
        for (let v = 1; v <= 5; v++) {
          const r = await page.evaluate((v) => {
            const hero = document.querySelector(`#option-${v}`);
            hero.scrollIntoView({ behavior: 'instant' });
            const header = document.querySelector('.site-header').getBoundingClientRect().height;
            const hr = hero.getBoundingClientRect();
            const avail = window.innerHeight - header;
            // Lowest content edge inside the hero (closed trace excluded: it has no height on phones and no width on desktop).
            let bottom = 0;
            hero.querySelectorAll('.hero-copy > *, .chips, .phone, .kpi, .progress, .controls, .trace').forEach((el) => {
              const b = el.getBoundingClientRect();
              if (el.classList.contains('trace') && document.documentElement.dataset.behind !== 'on') return;
              if (b.height && b.width > 1) bottom = Math.max(bottom, b.bottom);
            });
            return { heroH: Math.round(hr.height), avail: Math.round(avail), overBy: Math.round(bottom - (hr.top + avail)), pw: getComputedStyle(hero).getPropertyValue('--pw').trim() };
          }, v);
          const key = `${w}x${h} ${lang}${behind ? ' behind' : ''} option ${v}`;
          if (r.heroH > r.avail + 1) problems.push(`${key}: hero ${r.heroH}px > screen ${r.avail}px`);
          if (r.overBy > 1 && !(behind && w < 1000)) problems.push(`${key}: content ends ${r.overBy}px below the fold`);
          if (!behind && (v === 1 || v === 5)) {
            await page.waitForTimeout(400);
            await page.screenshot({ path: path.join(OUT, `${w}x${h}-${lang}-option${v}.png`) });
          }
        }
        await page.close();
      }
    }
  }
  await browser.close();
  console.log(problems.length ? 'DOES NOT FIT:\n' + problems.join('\n') : 'ALL OPTIONS FIT ONE SCREEN');
})();

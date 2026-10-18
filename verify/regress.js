// Regression checks for the second code review's findings. Run: node verify/regress.js
const path = require('path');
const url = require('url');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const PAGE = url.pathToFileURL(path.join(ROOT, 'mockups', 'index.html')).href;
const results = [];
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const open = async (opts, setup) => {
    const p = await browser.newPage(opts);
    await p.goto(PAGE);
    await p.evaluate(() => localStorage.clear());
    if (setup) await setup(p);
    await p.waitForTimeout(1600);
    return p;
  };

  // 1. Opening the mobile menu does not resize the phones or the heroes.
  let p = await open({ viewport: { width: 390, height: 844 } });
  const before = await p.evaluate(() => [document.querySelector('#option-3 .phone').offsetWidth, document.querySelector('#option-3').offsetHeight]);
  await p.click('.menu-btn');
  await p.waitForTimeout(1300);
  const after = await p.evaluate(() => [document.querySelector('#option-3 .phone').offsetWidth, document.querySelector('#option-3').offsetHeight]);
  check('Menu open keeps phone width and hero height', Math.abs(before[0] - after[0]) <= 1 && Math.abs(before[1] - after[1]) <= 1, `${before} -> ${after}`);

  // 2. Mobile vertical step bars are full height in every option.
  const bars = await p.evaluate(() => [1, 2, 3, 4, 5].map((v) => Math.round(document.querySelector(`#option-${v} .st-bar`).getBoundingClientRect().height)));
  check('Mobile step bars >= 17px tall in all options', bars.every((h) => h >= 17), bars.join(','));
  await p.close();

  // 3. RTL: trace dots sit on the timeline line.
  p = await open({ viewport: { width: 1440, height: 900 } }, async (pg) => {
    await pg.click('button[data-lang="ar"]');
    await pg.click('#option-1 .behind-switch');
  });
  const off = await p.evaluate(() => {
    const list = document.querySelector('#option-1 .trace-list');
    const line = getComputedStyle(list, '::before');
    const lr = list.getBoundingClientRect();
    const lineX = lr.right - parseFloat(line.insetInlineStart || line.right) - parseFloat(line.width) / 2;
    return [...list.querySelectorAll('.tr-dot')].map((d) => { const r = d.getBoundingClientRect(); return Math.round(Math.abs(r.left + r.width / 2 - lineX)); });
  });
  check('RTL trace dots centred on the timeline (<= 2px)', off.every((d) => d <= 2), off.join(','));
  await p.close();

  // 4. Dark mode: the logo link has an accessible name.
  p = await open({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const name = await p.evaluate(() => [...document.querySelectorAll('.logo img')].filter((i) => getComputedStyle(i).display !== 'none').map((i) => i.alt).join('|'));
  check('Dark-mode logo announces "Aion Digital"', name === 'Aion Digital', name);
  await p.close();

  // 5. 1000px with the trace open: KPI stays clear of the copy, and inside option 5's panel.
  p = await open({ viewport: { width: 1000, height: 800 } }, async (pg) => pg.click('#option-1 .behind-switch'));
  await p.waitForTimeout(1200);
  const kpi = await p.evaluate(() => {
    const k1 = document.querySelector('#option-1 .kpi').getBoundingClientRect();
    const c1 = document.querySelector('#option-1 .hero-copy').getBoundingClientRect();
    const k5 = document.querySelector('#option-5 .kpi').getBoundingClientRect();
    const s5 = document.querySelector('#option-5 .hero-stage').getBoundingClientRect();
    return { gap1: Math.round(k1.left - c1.right), in5: Math.round(k5.left - s5.left) };
  });
  check('1000px trace on: KPI clear of copy (opt 1) and inside panel (opt 5)', kpi.gap1 >= 0 && kpi.in5 >= 0, JSON.stringify(kpi));
  await p.close();

  // 6. Clicking the last chip on a phone scrolls only the chip row, not the page.
  p = await open({ viewport: { width: 390, height: 844 } });
  await p.evaluate(() => document.querySelector('#option-2').scrollIntoView({ behavior: 'instant' }));
  await p.waitForTimeout(400);
  const y0 = await p.evaluate(() => window.scrollY);
  await p.evaluate(() => document.querySelector('#option-2 .chip[data-j="ews"]').click());
  await p.waitForTimeout(900);
  const y1 = await p.evaluate(() => window.scrollY);
  const chipVisible = await p.evaluate(() => { const c = document.querySelector('#option-2 .chips').getBoundingClientRect(); const r = document.querySelector('#option-2 .chip[data-j="ews"]').getBoundingClientRect(); return r.left >= c.left - 1 && r.right <= c.right + 1; });
  check('Phone chip click scrolls the chip row only', Math.abs(y1 - y0) <= 1 && chipVisible, `scrollY ${y0}->${y1}, visible ${chipVisible}`);
  await p.close();

  await browser.close();
  console.log(results.join('\n'));
  process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;
})();

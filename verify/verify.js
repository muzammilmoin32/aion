// Headless check of the hero mockup: screenshots + clicks every control.
// Run: node verify/verify.js   (from the project folder or this folder)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots');
const URL = 'file:///' + path.join(ROOT, 'mockups', 'index.html').replace(/\\/g, '/');
const CHROME = process.env.CHROME || path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const only = process.argv[2]; // optional filter, e.g. "390"

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const problems = [];

  for (const width of [1440, 390]) {
    if (only && String(width) !== only) continue;
    for (const lang of ['en', 'ar']) {
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark' && width === 390 && lang === 'ar') continue;
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        page.on('pageerror', (e) => problems.push(`[${width} ${lang}] pageerror: ${e.message}`));
        page.on('console', (m) => m.type() === 'error' && !/fonts\.g/.test(m.text()) && problems.push(`[${width} ${lang}] console: ${m.text()}`));
        await page.goto(URL);
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForTimeout(800);
        if (lang === 'ar') await page.click('[data-lang="ar"]');
        await page.evaluate(() => document.fonts.ready);

        const tag = `${width}-${lang}${theme === 'dark' ? '-dark' : ''}`;
        await page.screenshot({ path: path.join(OUT, `header-${tag}.png`), clip: { x: 0, y: 0, width, height: 130 } });

        for (let v = 1; v <= 5; v++) {
          const hero = page.locator(`#option-${v}`);
          await hero.scrollIntoViewIfNeeded();
          await page.waitForTimeout(theme === 'dark' ? 2200 : 7000); // let entrance + one beat play
          await hero.screenshot({ path: path.join(OUT, `option${v}-${tag}.png`) });
        }

        if (theme === 'light') {
          // Behind switch on (in option 1) must apply to all five versions.
          await page.locator('#option-1 .behind-switch').click();
          const checked = await page.$$eval('.behind-switch', (els) => els.map((e) => e.getAttribute('aria-checked')));
          if (checked.some((c) => c !== 'true')) problems.push(`[${width} ${lang}] behind switch not synced: ${checked}`);
          await page.click('[data-lens="technical"]').catch(async () => { // in collapsed menu on mobile
            await page.click('.menu-btn'); await page.click('[data-lens="technical"]'); await page.click('.menu-btn');
          });
          for (const v of [1, 3, 5]) {
            const hero = page.locator(`#option-${v}`);
            await hero.scrollIntoViewIfNeeded();
            await page.waitForTimeout(9000);
            await hero.screenshot({ path: path.join(OUT, `option${v}-${tag}-behind-technical.png`), timeout: 60000 })
              .catch((e) => problems.push(`[${tag}] option ${v} behind screenshot: ${e.message.split('\n')[0]}`));
          }

          // Every chip in every version
          for (let v = 1; v <= 5; v++) {
            const ids = await page.$$eval(`#option-${v} .chip`, (els) => els.map((e) => e.dataset.j));
            for (const id of ids) {
              await page.locator(`#option-${v} .chip[data-j="${id}"]`).click();
              const st = await page.evaluate(([v, id]) => {
                const h = document.querySelector(`#option-${v}`);
                return {
                  pressed: h.querySelector(`.chip[data-j="${id}"]`).getAttribute('aria-pressed'),
                  screens: h.querySelectorAll('.screen').length,
                  steps: h.querySelectorAll('.steps li').length,
                  trace: h.querySelectorAll('.tr-item').length,
                  copy: h.querySelector('.copy-1').textContent.trim().length,
                };
              }, [v, id]);
              if (st.pressed !== 'true' || !st.screens || st.screens !== st.steps || !st.trace || !st.copy) problems.push(`[${width} ${lang}] option ${v} chip ${id} bad state ${JSON.stringify(st)}`);
            }
            await page.locator(`#option-${v} .chip[data-j="sme"]`).click();
          }
          // Shot of a second journey with trace on
          await page.locator('#option-2 .chip[data-j="ews"]').click();
          await page.locator('#option-2').scrollIntoViewIfNeeded();
          await page.waitForTimeout(13000);
          await page.locator('#option-2').screenshot({ path: path.join(OUT, `option2-${tag}-ews-behind.png`) });

          // Pause button
          const t1 = await page.$eval('#option-2 .bar-fill', (e) => e.style.transform);
          await page.locator('#option-2 .pause-btn').click();
          await page.waitForTimeout(600);
          const t2 = await page.$eval('#option-2 .bar-fill', (e) => e.style.transform);
          await page.waitForTimeout(600);
          const t3 = await page.$eval('#option-2 .bar-fill', (e) => e.style.transform);
          if (t2 !== t3) problems.push(`[${width} ${lang}] pause did not stop progress (${t1} ${t2} ${t3})`);
          await page.locator('#option-2 .pause-btn').click();

          // Booking dialog
          await page.locator('#option-1 .ctas [data-open-booking]').click();
          if (!(await page.$eval('#booking', (d) => d.open))) problems.push(`[${width} ${lang}] booking dialog did not open`);
          await page.fill('#booking input[name="field1"]', 'test');
          await page.fill('#booking input[name="field2"]', 'test');
          await page.screenshot({ path: path.join(OUT, `dialog-${tag}.png`) });
          await page.click('#booking button[type="submit"]');
          if (!(await page.$eval('.dlg-done', (d) => !d.hidden))) problems.push(`[${width} ${lang}] booking submit did not show done state`);
          await page.click('#booking .dlg-done .dlg-close');
          if (await page.$eval('#booking', (d) => d.open)) problems.push(`[${width} ${lang}] booking dialog did not close`);

          // WhatsApp link
          const wa = await page.$$eval('a[href^="https://wa.me/"]', (a) => a.length);
          if (wa !== 5) problems.push(`[${width} ${lang}] expected 5 WhatsApp links, got ${wa}`);

          // Mobile menu
          if (width < 1180) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.click('.menu-btn');
            await page.waitForTimeout(300);
            await page.screenshot({ path: path.join(OUT, `menu-open-${tag}.png`), clip: { x: 0, y: 0, width, height: 520 } });
            await page.click('.menu-btn');
          }

          // Options row anchors
          await page.click('.options-row a[href="#option-4"]');
          await page.waitForTimeout(900);
          const top4 = await page.$eval('#option-4', (e) => Math.round(e.getBoundingClientRect().top));
          const hh = await page.$eval('.site-header', (e) => Math.round(e.getBoundingClientRect().height));
          if (top4 < hh - 4 || top4 > hh + 40) problems.push(`[${width} ${lang}] option-4 anchor lands at ${top4}, header ${hh}`);
        }

        // Horizontal overflow + elements wider than viewport
        const over = await page.evaluate(() => {
          const w = document.documentElement.clientWidth;
          const bad = [];
          if (document.documentElement.scrollWidth > w) bad.push(`page scrollWidth ${document.documentElement.scrollWidth} > ${w}`);
          document.querySelectorAll('.hero-copy *, .ctas .btn, .steps, .kpi, .trace, .controls, .bar, .chips').forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width && (r.right > w + 1 || r.left < -1)) bad.push(`${el.className || el.tagName} [${Math.round(r.left)}, ${Math.round(r.right)}]`);
          });
          return [...new Set(bad)].slice(0, 12);
        });
        over.forEach((o) => problems.push(`[${width} ${lang} ${theme}] overflow: ${o}`));
        await ctx.close();
      }
    }
  }

  // Reduced motion: demo still advances, no errors
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => problems.push(`[reduced] ${e.message}`));
  await page.goto(URL);
  await page.waitForTimeout(6000);
  const beat = await page.$eval('#option-1 .steps [aria-current="step"]', (e) => e.textContent).catch(() => null);
  if (!beat) problems.push('[reduced] no current step');
  await page.screenshot({ path: path.join(OUT, 'reduced-motion-1440.png') });
  await ctx.close();

  // Keyboard: tab order reaches chips and switch, focus visible
  const kctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const kp = await kctx.newPage();
  await kp.goto(URL);
  const seen = [];
  for (let i = 0; i < 30; i++) {
    await kp.keyboard.press('Tab');
    seen.push(await kp.evaluate(() => { const a = document.activeElement; return `${a.tagName}.${a.className}`.slice(0, 40); }));
  }
  if (!seen.some((s) => s.includes('chip'))) problems.push('[keyboard] chips not reachable');
  if (!seen.some((s) => s.includes('behind-switch'))) problems.push('[keyboard] switch not reachable');
  await kp.locator('#option-1 .chip[data-j="payroll"]').focus();
  await kp.keyboard.press('Enter');
  if ((await kp.$eval('#option-1 .chip[data-j="payroll"]', (e) => e.getAttribute('aria-pressed'))) !== 'true') problems.push('[keyboard] Enter on chip did nothing');
  await kp.locator('#option-1 .chip[data-j="sadad"]').focus();
  await kp.screenshot({ path: path.join(OUT, 'focus-chip-1440.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await kctx.close();

  await browser.close();
  console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'ALL CHECKS PASSED');
})();

// Theme v2 pages (landing-e, landing-f): the client's particle theme with our 4D glass hero in section 02 (#tilt).
// Asserts: clean load, one embedded hero, theme intact, header/numbers content, EN -> Arabic RTL -> EN round trip,
// language persistence on these pages only (never the main site's aion-mock:* keys), #langBtn markup.
// Run from verify/:  node theme-v2-test.js   (exit code 1 on any FAIL)
const { chromium } = require('playwright-core');
const path = require('path');
const { pathToFileURL } = require('url');
const exe = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const url = (p) => pathToFileURL(path.resolve(__dirname, '..', p, 'index.html')).href;
let fails = 0;
const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
const PAGES = ['landing-e', 'landing-f'];
const TITLE = 'Aion v2 Homepage';
const NAV = ['Solutions', 'Intelligence (Ai966)', 'Open Banking', 'Platform', 'Company'];

// In-page helpers, installed before any page script runs.
function helpers() {
  const SKIP = '#tilt, script, style, template, .lay, svg';
  const ATTRS = ['aria-label', 'placeholder', 'title', 'alt', 'data-caption', 'data-scene-name'];
  const ALLOW = [
    /[A-Za-z][\w-]*(?:\.[A-Za-z_][\w-]*)+(?:\/[\w\-./]*)?/g,                       // code identifiers / domains: nafath.authenticate, aiondigital.com/about-us
    /\b(?:Ai966|Rubix|Aion|AION|aion|Spire|FCA|IBAN|SAR|CR|GOSI|ERP|AML|WPS|SADAD)\b/g,     // names and acronyms ("aion" = footer logo wordmark)
    /\+966 5X XXX XXXX/g, /\b\d+X+\b/g,                                              // masked placeholders (+966 5X XXX XXXX, CR 10XXXXXXXX)
  ];
  const textNodes = () => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest(SKIP) ? 2 : 1) });
    let n; while ((n = w.nextNode())) out.push(n);
    return out;
  };
  const attrEls = () => [document.getElementById('tilt'), ...[...document.body.querySelectorAll('*')].filter((el) => !el.closest(SKIP))]
    .filter((el) => el && ATTRS.some((a) => el.hasAttribute(a)));
  window.__t = {
    // English text left after the switch to Arabic (outside #tilt etc.), allow-listed tokens removed
    leftovers() {
      const left = new Set();
      for (const n of textNodes()) {
        let s = n.nodeValue.replace(/\s+/g, ' ').trim();
        for (const re of ALLOW) s = s.replace(re, ' ');
        if (/[A-Za-z]{3,}/.test(s)) left.add(n.nodeValue.replace(/\s+/g, ' ').trim());
      }
      return [...left];
    },
    // Arabic text left after the switch back to English (the logo tagline and the lang="ar" button word are Arabic by design)
    arabicLeft() {
      return [...new Set(textNodes().filter((n) => /[؀-ۿ]/.test(n.nodeValue) && !n.parentElement.closest('[lang="ar"]')).map((n) => n.nodeValue.trim()))];
    },
    snap() {
      const text = new Map(); textNodes().filter((n) => !n.parentElement.closest('#langBtn, #screen, #prog, #ltrace, #kpiText')).forEach((n) => text.set(n, n.nodeValue));   // #langBtn is rebuilt by design (asserted separately)
      const attr = new Map(); attrEls().forEach((el) => { const o = {}; ATTRS.forEach((a) => { if (el.hasAttribute(a)) o[a] = el.getAttribute(a); }); attr.set(el, o); });
      return { text, attr };
    },
    record() { this.a = this.snap(); },
    // nodes the theme's own scripts rewrite in English on their own (demo player, counters) are not language state
    stabilise() {
      const b = this.snap(); let dyn = 0;
      for (const [n, v] of this.a.text) if (!n.isConnected || b.text.get(n) !== v) { this.a.text.delete(n); dyn++; }
      for (const [el, o] of this.a.attr) if (!el.isConnected || JSON.stringify(b.attr.get(el)) !== JSON.stringify(o)) { this.a.attr.delete(el); dyn++; }
      return { text: this.a.text.size, attr: this.a.attr.size, dyn };
    },
    // the round trip: every recorded text node and attribute equals its English original
    diff() {
      const bad = [];
      for (const [n, v] of this.a.text) {
        if (!n.isConnected) bad.push('text node removed: ' + v.trim().slice(0, 50));
        else if (n.nodeValue !== v) bad.push(`text "${v.trim().slice(0, 50)}" -> "${n.nodeValue.trim().slice(0, 50)}"`);
      }
      for (const [el, o] of this.a.attr) {
        for (const a of Object.keys(o)) if (el.getAttribute(a) !== o[a]) bad.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}[${a}] "${o[a]}" -> "${el.getAttribute(a)}"`);
      }
      return bad;
    },
  };
}

(async () => {
  const b = await chromium.launch({ executablePath: exe });
  const open = async (pg, w, h, init) => {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    p.on('requestfailed', (r) => /\.mp4$/.test(r.url()) && /ERR_ABORTED/.test((r.failure() || {}).errorText) ? 0 : errs.push('requestfailed: ' + r.url() + ' ' + (r.failure() || {}).errorText));
    p.on('response', (r) => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
    await p.addInitScript(helpers);
    if (init) await p.addInitScript(init);
    await p.goto(url(pg), { waitUntil: 'load' }); await p.waitForTimeout(3000);
    await p.mouse.move(w / 2, h / 2); await p.mouse.wheel(0, 5); await p.waitForTimeout(500);
    return { p, ctx, errs };
  };
  // scroll the whole page once so reveals and counters run, then return to the top
  const scrollThrough = async (p) => {
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
    await p.waitForTimeout(2500); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  };
  const toLang = async (p, want) => {
    await p.evaluate(() => document.getElementById('langBtn').scrollIntoView({ block: 'nearest' }));
    await p.click('#langBtn'); await p.waitForTimeout(1200);
    const got = await p.evaluate(() => document.documentElement.lang);
    if (got !== want) throw new Error(`#langBtn did not switch to ${want} (lang=${got})`);
  };
  const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const btnState = (p) => p.evaluate(() => { const bt = document.getElementById('langBtn'); return { html: bt.innerHTML, lang: bt.getAttribute('lang'), label: bt.getAttribute('aria-label') }; });
  const mockKeys = (p) => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('aion-mock:')).map((k) => [k, localStorage.getItem(k)])));

  for (const pg of PAGES) {
    // ---------- 1440 x 900: English ----------
    { const { p, ctx, errs } = await open(pg, 1440, 900);
      const s = await p.evaluate(() => ({
        heroes: typeof heroes === 'undefined' ? -1 : heroes.length,
        inTilt: typeof heroes !== 'undefined' && heroes.every((h) => !!h.el.closest('#tilt')),
        g3d: document.querySelectorAll('#tilt .g3d').length, allG3d: document.querySelectorAll('.g3d').length,
        stream: !!document.getElementById('th-stream'), title: document.title, layBtn: !!document.querySelector('.lay-btn'),
        embed: document.body.dataset.embed, dir: document.documentElement.dir || 'ltr',
        nav: [...document.querySelectorAll('.nav-links > a, .nav-links > button')].map((a) => a.textContent.trim()),
        mobile: [...document.querySelectorAll('.mm-mobile a.mm-item')].map((a) => a.textContent.trim()),
      }));
      ok(s.heroes === 1 && s.inTilt && s.g3d === 1 && s.allG3d === 1, `${pg} 1440 exactly one glass hero, inside #tilt (heroes=${s.heroes}, #tilt .g3d=${s.g3d}, all .g3d=${s.allG3d})`);
      ok(s.stream === (pg === 'landing-f'), `${pg} #th-stream ${pg === 'landing-f' ? 'present' : 'absent'} (${s.stream})`);
      ok(s.title === TITLE, `${pg} document.title "${s.title}"`);
      ok(s.layBtn, `${pg} .lay-btn present`);
      ok(s.embed === 'hero' && s.dir === 'ltr', `${pg} body[data-embed=hero], starts LTR (${s.embed}, ${s.dir})`);
      ok(JSON.stringify(s.nav) === JSON.stringify(NAV), `${pg} desktop nav is the 5 items incl. Platform (${s.nav.join(' | ')})`);
      ok(JSON.stringify(s.mobile) === JSON.stringify(NAV.slice(1)), `${pg} mobile .mm-mobile lists the same items (Solutions = the menu itself) (${s.mobile.join(' | ')})`);
      const bt = await btnState(p);
      ok(bt.html === '<span lang="ar">عربي</span>' && bt.lang === null && bt.label === 'Switch to Arabic', `${pg} EN #langBtn markup ${JSON.stringify(bt)}`);

      await scrollThrough(p);
      ok(await overflow(p) <= 0, `${pg} 1440 EN no horizontal overflow (${await overflow(p)}px)`);
      const n = await p.evaluate(async () => {
        document.getElementById('numbers').scrollIntoView(); await new Promise((r) => setTimeout(r, 2500));
        const q = document.querySelector('.quote');
        return { nums: [...document.querySelectorAll('#numbers .nums strong')].map((e) => e.textContent.trim()), text: document.getElementById('numbers').textContent,
          offices: document.querySelector('#numbers .offices').textContent.trim(), quoteLabel: q ? q.parentElement.querySelector('.who span').textContent.trim() : null };
      });
      ok(JSON.stringify(n.nums) === '["9","800+","3","6"]', `${pg} numbers are 9, 800+, 3, 6 (${n.nums.join(', ')})`);
      ok(!/150\+/.test(n.text) && !/\b5x\b/i.test(n.text), `${pg} numbers section has no 150+ / 5x`);
      ok(n.offices === 'Riyadh · Manama · Karachi', `${pg} offices "${n.offices}"`);
      ok(/placeholder/i.test(n.quoteLabel || ''), `${pg} quote label says placeholder ("${n.quoteLabel}")`);

      // ---------- Arabic ----------
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
      await p.evaluate(() => __t.record()); await p.waitForTimeout(3000);
      const st = await p.evaluate(() => __t.stabilise());
      ok(st.text > 200 && st.attr > 10, `${pg} recorded English originals (${st.text} text nodes, ${st.attr} elements with attributes; ${st.dyn} self-updating excluded)`);
      await toLang(p, 'ar');
      const a = await p.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang, title: document.title,
        tiltLabel: document.getElementById('tilt').getAttribute('aria-label'), copy1: (document.querySelector('#tilt .copy-1') || {}).textContent || '', left: __t.leftovers() }));
      ok(a.dir === 'rtl' && a.lang === 'ar', `${pg} AR html dir=${a.dir} lang=${a.lang}`);
      ok(a.title === TITLE, `${pg} AR document.title unchanged ("${a.title}")`);
      ok(a.tiltLabel === 'عرض مباشر', `${pg} AR #tilt aria-label "${a.tiltLabel}"`);
      ok(/[؀-ۿ]/.test(a.copy1) && !/[A-Za-z]{3,}/.test(a.copy1.replace(/\b(?:Aion|AION|Rubix|Ai966)\b/g, '')), `${pg} AR #tilt .copy-1 is Arabic ("${a.copy1.trim().slice(0, 40)}")`);
      ok(a.left.length === 0, `${pg} AR no English text outside #tilt (${a.left.length}): ${JSON.stringify(a.left.slice(0, 15))}`);
      const ab = await btnState(p);
      ok(ab.html === '<span lang="en">EN</span>' && ab.lang === null && /[؀-ۿ]/.test(ab.label || ''), `${pg} AR #langBtn markup ${JSON.stringify(ab)}`);
      await scrollThrough(p);
      ok(await overflow(p) <= 0, `${pg} 1440 AR no horizontal overflow (${await overflow(p)}px)`);
      await p.evaluate(() => document.getElementById('demos').scrollIntoView()); await p.waitForTimeout(3500);
      const later = await p.evaluate(() => __t.leftovers());
      ok(later.length === 0, `${pg} AR still no English after the theme's scripts ran ~3s with #demos in view (${later.length}): ${JSON.stringify(later.slice(0, 15))}`);

      // ---------- back to English ----------
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
      await toLang(p, 'en');
      const e = await p.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang, diff: __t.diff(), arabic: __t.arabicLeft(),
        tiltLabel: document.getElementById('tilt').getAttribute('aria-label'), copy1: (document.querySelector('#tilt .copy-1') || {}).textContent || '' }));
      ok(e.dir === 'ltr' && e.lang === 'en', `${pg} back to EN html dir=${e.dir} lang=${e.lang}`);
      ok(e.diff.length === 0, `${pg} back to EN every text node and attribute equals its original (${e.diff.length} differ): ${JSON.stringify(e.diff.slice(0, 10))}`);
      ok(e.arabic.length === 0, `${pg} back to EN no Arabic text left outside #tilt: ${JSON.stringify(e.arabic.slice(0, 10))}`);
      ok(!/[؀-ۿ]/.test(e.copy1) && /[A-Za-z]{3,}/.test(e.copy1), `${pg} back to EN #tilt .copy-1 English ("${e.copy1.trim().slice(0, 40)}")`);
      const eb = await btnState(p);
      ok(eb.html === '<span lang="ar">عربي</span>' && eb.lang === null && eb.label === 'Switch to Arabic', `${pg} back to EN #langBtn markup ${JSON.stringify(eb)}`);

      // isolation in a fresh browser: the language toggle and the glass section's switch never write the main site's keys
      await p.click('#tilt .behind-switch'); await p.waitForTimeout(600);
      const keys = await mockKeys(p);
      const v2 = await p.evaluate(() => localStorage.getItem('aion-v2-lang'));
      ok(!('aion-mock:lang' in keys) && !('aion-mock:lens' in keys) && !('aion-mock:behind' in keys), `${pg} fresh storage: no aion-mock:lang/lens/behind written ${JSON.stringify(keys)}`);
      ok(v2 === 'en', `${pg} aion-v2-lang stored as "en" after the round trip (${v2})`);
      ok(errs.length === 0, `${pg} 1440 no page errors / failed requests ${JSON.stringify(errs.slice(0, 5))}`);
      await ctx.close(); }

    // ---------- persistence and isolation ----------
    { const { p, ctx, errs } = await open(pg, 1440, 900, () => {
        if (sessionStorage.getItem('__seeded')) return; sessionStorage.setItem('__seeded', '1');
        localStorage.setItem('aion-v2-lang', 'ar'); localStorage.setItem('aion-mock:lang', 'en'); localStorage.setItem('aion-mock:behind', '0');
      });
      const s = await p.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang,
        tiltLabel: document.getElementById('tilt').getAttribute('aria-label'), copy1: (document.querySelector('#tilt .copy-1') || {}).textContent || '', left: __t.leftovers() }));
      ok(s.dir === 'rtl' && s.lang === 'ar', `${pg} stored aion-v2-lang=ar loads RTL (dir=${s.dir} lang=${s.lang})`);
      ok(s.tiltLabel === 'عرض مباشر' && /[؀-ۿ]/.test(s.copy1), `${pg} stored Arabic reaches #tilt (label "${s.tiltLabel}", copy-1 "${s.copy1.trim().slice(0, 30)}")`);
      ok(s.left.length === 0, `${pg} stored Arabic: no English outside #tilt (${s.left.length}): ${JSON.stringify(s.left.slice(0, 10))}`);
      const bt = await btnState(p);
      ok(bt.html === '<span lang="en">EN</span>' && bt.lang === null, `${pg} stored Arabic #langBtn markup ${JSON.stringify(bt)}`);
      const before = await p.evaluate(() => document.documentElement.dataset.behind);
      await p.evaluate(() => document.getElementById('tilt').scrollIntoView()); await p.waitForTimeout(800);
      await p.click('#tilt .behind-switch'); await p.waitForTimeout(800);
      const after = await p.evaluate(() => ({ behind: document.documentElement.dataset.behind, checked: document.querySelector('#tilt .behind-switch').getAttribute('aria-checked') }));
      ok(before === 'off' && after.behind === 'on' && after.checked === 'true', `${pg} behind-switch works (behind ${before} -> ${after.behind}, aria-checked=${after.checked})`);
      const keys = await mockKeys(p);
      ok(keys['aion-mock:lang'] === 'en' && keys['aion-mock:behind'] === '0', `${pg} main site keys unchanged after behind-switch (lang=${keys['aion-mock:lang']}, behind=${keys['aion-mock:behind']})`);
      ok(!('aion-mock:lens' in keys), `${pg} aion-mock:lens not written ${JSON.stringify(keys)}`);
      ok(errs.length === 0, `${pg} persistence run no page errors / failed requests ${JSON.stringify(errs.slice(0, 5))}`);
      await ctx.close(); }

    // ---------- 390 x 844: overflow + RTL ----------
    { const { p, ctx, errs } = await open(pg, 390, 844);
      await scrollThrough(p);
      ok(await overflow(p) <= 0, `${pg} 390 EN no horizontal overflow (${await overflow(p)}px)`);
      await p.click('#burger'); await p.waitForTimeout(400);
      const mob = await p.evaluate(() => [...document.querySelectorAll('.mm-mobile a.mm-item')].filter((a) => a.getClientRects().length && a.getBoundingClientRect().width > 0).map((a) => a.textContent.trim()));
      ok(mob.includes('Platform'), `${pg} 390 open menu shows Platform (${mob.join(' | ')})`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      await toLang(p, 'ar');
      const s = await p.evaluate(() => ({ dir: document.documentElement.dir, copy1: (document.querySelector('#tilt .copy-1') || {}).textContent || '', left: __t.leftovers() }));
      ok(s.dir === 'rtl' && /[؀-ۿ]/.test(s.copy1), `${pg} 390 AR dir=${s.dir}, #tilt Arabic`);
      ok(s.left.length === 0, `${pg} 390 AR no English outside #tilt (${s.left.length}): ${JSON.stringify(s.left.slice(0, 10))}`);
      await scrollThrough(p);
      const o = await overflow(p);
      const wide = o > 0 ? await p.evaluate(() => [...document.body.querySelectorAll('*')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1) && !el.closest('[aria-hidden="true"]'); }).slice(0, 6).map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')}`)) : [];
      ok(o <= 0, `${pg} 390 AR no horizontal overflow (${o}px) ${wide.join(', ')}`);
      ok(errs.length === 0, `${pg} 390 no page errors / failed requests ${JSON.stringify(errs.slice(0, 5))}`);
      await ctx.close(); }
  }
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

'use strict';

/*
 * "Other layouts" switcher: a pill at the top right (under the header) that opens a menu of every
 * landing-page layout and the hero mockups. Self-contained (own styles); include it on any page with
 * <script src="…/layouts.js" defer></script>. Paths resolve from this script's own location.
 * ARABIC REVIEW: Arabic strings below are drafts for a native Saudi reader.
 */
(() => {
  // href is relative to the project root; the share build rewrites ROOT_FOR to point across folders
  const ROOT_FOR = {"site":"","mockups":"../Aion Hero Mockups/"};
  const PAGES = [
    { href: 'index.html', root: 'site', en: 'Main page', ar: 'الصفحة الرئيسية', noteEn: 'Night theme, 4D glass hero', noteAr: 'الطابع الليلي، واجهة زجاجية رباعية الأبعاد' },
    { href: 'landing-d/index.html', root: 'site', en: 'Tilt page', ar: 'صفحة الإمالة', noteEn: 'Tilted, scroll-driven sections', noteAr: 'أقسام مائلة تتحرك مع التمرير' },
    { href: 'index-old.html', root: 'site', en: 'Landing A', ar: 'الصفحة أ', noteEn: 'First layout, night theme', noteAr: 'التصميم الأول، الطابع الليلي' },
    { href: 'landing-b/index.html', root: 'site', en: 'Landing B', ar: 'الصفحة ب', noteEn: 'Second layout, night theme', noteAr: 'التصميم الثاني، الطابع الليلي' },
    { href: 'landing-c/index.html', root: 'site', en: 'Landing C', ar: 'الصفحة ج', noteEn: 'Third layout, night theme', noteAr: 'التصميم الثالث، الطابع الليلي' },
    { href: 'index.html', root: 'mockups', path: 'mockups/', en: 'Hero section mockups', ar: 'نماذج القسم الرئيسي', noteEn: 'Eight hero options on one page', noteAr: 'ثمانية خيارات للقسم الرئيسي' },
    // the same layouts as they were before the dark theme (restored into classic/)
    { group: 'classic', href: 'classic/index.html', root: 'site', en: 'Landing A', ar: 'الصفحة أ', noteEn: 'Light, before the theme', noteAr: 'فاتح، قبل الطابع الليلي' },
    { group: 'classic', href: 'classic/landing-b/index.html', root: 'site', en: 'Landing B', ar: 'الصفحة ب', noteEn: 'Light, before the theme', noteAr: 'فاتح، قبل الطابع الليلي' },
    { group: 'classic', href: 'classic/landing-c/index.html', root: 'site', en: 'Landing C', ar: 'الصفحة ج', noteEn: 'Light, before the theme', noteAr: 'فاتح، قبل الطابع الليلي' },
    { group: 'classic', href: 'classic/mockups/index.html', root: 'site', en: 'Hero section mockups', ar: 'نماذج القسم الرئيسي', noteEn: 'Five light hero options', noteAr: 'خمسة خيارات فاتحة للقسم الرئيسي' },
  ];
  const GROUPS = { night: ['Night theme', 'الطابع الليلي'], classic: ['Before the theme', 'قبل الطابع الليلي'] };
  const TXT = { btn: ['Other layouts', 'تصاميم أخرى'], label: ['Layouts', 'التصاميم'], here: ['you are here', 'أنت هنا'] };

  const me = document.currentScript && document.currentScript.src;
  const base = me ? new URL('.', me) : new URL('./', location.href);
  const urlOf = (p) => { const r = ROOT_FOR[p.root]; return new URL(r ? r + p.href : (p.path || '') + p.href, base); };
  const same = (a, b) => a.pathname.replace(/\/index\.html$/, '/') === b.pathname.replace(/\/index\.html$/, '/');
  const ar = () => document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
  const t = (pair) => pair[ar() ? 1 : 0];

  const css = `
.lay { position: fixed; inset-inline-end: 16px; top: calc(var(--header-h, 64px) + 12px); z-index: 45; }   /* under the header (50) and its open menu */
body:has(.nav-panel.is-open) .lay { visibility: hidden; }
.lay-btn { display: inline-flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 14px 0 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid rgb(47 214 201 / .35); background: rgb(10 14 14 / .78); color: #e8fffb; font-family: inherit; font-size: 13px; font-weight: 600; line-height: 1;
  backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); box-shadow: 0 10px 30px rgb(0 0 0 / .35); transition: border-color .2s, background .2s; }
.lay-btn:hover, .lay-btn[aria-expanded="true"] { border-color: rgb(47 214 201 / .8); background: rgb(14 22 22 / .9); }
.lay-btn svg { width: 16px; height: 16px; flex: none; }
.lay-menu { position: absolute; inset-inline-end: 0; top: calc(100% + 8px); width: min(300px, calc(100vw - 32px)); max-height: calc(100vh - var(--header-h, 64px) - 80px); overflow-y: auto; overscroll-behavior: contain; margin: 0; padding: 8px; list-style: none;
  border-radius: 16px; border: 1px solid rgb(255 255 255 / .1); background: rgb(12 14 14 / .94); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgb(0 0 0 / .55); }
.lay-menu[hidden] { display: none; }
.lay-menu .lay-h + li .lay-h, .lay-menu li + .lay-h { margin-top: 6px; border-top: 1px solid rgb(255 255 255 / .08); padding-top: 12px; }
.lay-menu .lay-h { padding: 6px 10px 8px; font: 500 11px/1 ui-monospace, "JetBrains Mono", monospace; letter-spacing: .04em; color: rgb(232 255 251 / .5); }
.lay-menu a { display: grid; gap: 3px; padding: 10px 12px; border-radius: 10px; color: #e8fffb; text-decoration: none; }
.lay-menu a:hover { background: rgb(47 214 201 / .12); }
.lay-menu a[aria-current="page"] { background: rgb(47 214 201 / .16); box-shadow: inset 2px 0 0 #2fd6c9; }
:root[dir="rtl"] .lay-menu a[aria-current="page"] { box-shadow: inset -2px 0 0 #2fd6c9; }
.lay-menu a:focus-visible { outline: 2px solid #2fd6c9; outline-offset: -2px; }
.lay-menu b { font-size: 14px; font-weight: 600; line-height: 1.2; }
.lay-menu small { font-size: 12px; color: rgb(232 255 251 / .6); }
.lay-menu .lay-here { color: #2fd6c9; font-weight: 600; }
@media (max-width: 640px) { .lay { top: auto; bottom: 16px; } .lay-menu { top: auto; bottom: calc(100% + 8px); max-height: calc(100vh - 120px); } .lay-btn .lay-t { display: none; } .lay-btn { padding: 0 11px; } }
@media (prefers-reduced-motion: reduce) { .lay-btn { transition: none; } }
@media print { .lay { display: none; } }`;

  function init() {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const wrap = document.createElement('div'); wrap.className = 'lay';
    wrap.innerHTML = `<button type="button" class="lay-btn" aria-expanded="false" aria-controls="lay-menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      <span class="lay-t"></span></button><ul class="lay-menu" id="lay-menu" hidden></ul>`;
    document.body.appendChild(wrap);
    const btn = wrap.querySelector('.lay-btn'); const menu = wrap.querySelector('.lay-menu');
    const here = new URL(location.href);

    const render = () => {
      const fi = [...menu.querySelectorAll('a')].indexOf(document.activeElement);   // keep keyboard focus across a language switch
      const lang = ar() ? 'ar' : 'en';
      btn.querySelector('.lay-t').textContent = t(TXT.btn);
      btn.setAttribute('aria-label', t(TXT.btn));
      menu.setAttribute('aria-label', t(TXT.label));
      let g = null;
      menu.innerHTML = PAGES.map((p) => {
        const grp = p.group || 'night'; const head = grp !== g ? `<li class="lay-h" aria-hidden="true">${t(GROUPS[grp])}</li>` : ''; g = grp;
        const u = urlOf(p); const cur = same(u, here);
        return head + `<li><a href="${u.href}"${cur ? ' aria-current="page"' : ''}><b>${p[lang]}</b><small>${cur ? `<span class="lay-here">${t(TXT.here)}</span> · ` : ''}${lang === 'ar' ? p.noteAr : p.noteEn}</small></a></li>`;
      }).join('');
      if (fi >= 0) { const a = menu.querySelectorAll('a')[fi]; if (a) a.focus(); }
    };
    const open = (v, focus) => {
      btn.setAttribute('aria-expanded', String(v)); menu.hidden = !v;
      if (v && focus) { const a = menu.querySelector('a[aria-current]') || menu.querySelector('a'); if (a) a.focus(); }
    };
    render();
    btn.addEventListener('click', (e) => open(menu.hidden, e.detail === 0));   // keyboard click (detail 0) moves focus into the menu
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) open(false); });
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { e.preventDefault(); e.stopPropagation(); open(false); btn.focus(); return; }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !menu.hidden) {
        const links = [...menu.querySelectorAll('a')]; const i = links.indexOf(document.activeElement);
        e.preventDefault(); e.stopPropagation();
        links[(i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length].focus();
      }
      if ((e.key === 'Home' || e.key === 'End') && !menu.hidden && menu.contains(document.activeElement)) {
        const links = menu.querySelectorAll('a'); e.preventDefault(); e.stopPropagation();
        links[e.key === 'Home' ? 0 : links.length - 1].focus();
      }
    });
    // Safari does not focus links on mousedown: don't close while a pointer press inside the menu is in progress
    let pressing = false;
    wrap.addEventListener('pointerdown', () => { pressing = true; });
    addEventListener('pointerup', () => setTimeout(() => { pressing = false; }, 0), true);
    wrap.addEventListener('focusout', (e) => { if (!pressing && !wrap.contains(e.relatedTarget)) open(false); });
    // follow the page's EN / عربي switch
    document.addEventListener('aion:lang', render);
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

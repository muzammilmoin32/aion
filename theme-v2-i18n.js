'use strict';

/*
 * EN / عربي for the particle-theme pages (landing-e, landing-f). The theme's عربي button switches the whole
 * page to Arabic, right to left: the theme's text from theme-v2-ar.js (including text its scripts write later,
 * like the demo steps), and the 4D glass section through app.js (setLang). The choice is remembered for these
 * pages only, so it never changes the main site's language.
 */
(() => {
  const AR = window.THEME_V2_AR || {};
  const KEY = 'aion-v2-lang';
  const root = document.documentElement;
  const SKIP = '#tilt, script, style, template, .lay, svg';
  const ATTRS = ['aria-label', 'placeholder', 'title', 'alt', 'data-caption', 'data-scene-name'];   // captions are drawn by CSS
  const origText = new WeakMap();   // text node → its English
  const origAttr = new WeakMap();   // element → { attr: English }
  let lang = 'en';
  try { if (localStorage.getItem(KEY) === 'ar') lang = 'ar'; } catch (e) { /* storage blocked */ }
  if (lang === 'ar') { root.lang = 'ar'; root.dir = 'rtl'; }   // no English-direction flash before the switch runs

  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  function textNode(n) {
    if (!n.parentElement || n.parentElement.closest(SKIP)) return;
    if (lang === 'ar') {
      const en = origText.has(n) ? origText.get(n) : n.nodeValue;
      const ar = AR[norm(en)];
      if (!ar) return;
      if (!origText.has(n)) origText.set(n, en);
      const lead = en.match(/^\s*/)[0]; const tail = en.match(/\s*$/)[0];
      const v = lead + ar + tail;
      if (n.nodeValue !== v) n.nodeValue = v;
    } else if (origText.has(n)) {
      const en = origText.get(n); origText.delete(n);
      if (n.nodeValue !== en) n.nodeValue = en;
    }
  }
  function element(el) {
    if (el.id !== 'tilt' && el.closest(SKIP)) return;   // #tilt's own label is ours to translate; its contents are app.js's
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const store = origAttr.get(el) || {};
      if (lang === 'ar') {
        const en = store[a] !== undefined ? store[a] : el.getAttribute(a);
        const ar = AR[norm(en)];
        if (!ar) continue;
        store[a] = en; origAttr.set(el, store);
        if (el.getAttribute(a) !== ar) el.setAttribute(a, ar);
      } else if (store[a] !== undefined) { el.setAttribute(a, store[a]); delete store[a]; }
    }
  }
  function walk(node) {
    if (node.nodeType === 3) { textNode(node); return; }
    if (node.nodeType !== 1) return;
    element(node);
    if (node.closest(SKIP)) return;
    const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: (n) => { if (n.nodeType === 1 && n.matches(SKIP)) { if (n.id === 'tilt') element(n); return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; },
    });
    let n; while ((n = w.nextNode())) { if (n.nodeType === 3) textNode(n); else element(n); }
  }

  // the theme's scripts keep writing text (demo steps, counters): translate what they add while Arabic is on
  const mo = new MutationObserver((list) => {
    if (lang !== 'ar') return;
    for (const m of list) {
      if (m.type === 'characterData') textNode(m.target);
      else if (m.type === 'attributes') element(m.target);
      else m.addedNodes.forEach(walk);
    }
  });

  function apply(next) {
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage blocked */ }
    if (typeof setLang === 'function') setLang(lang);   // the glass section, <html lang/dir>, aion:lang for the lines
    else { root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr'; }
    walk(document.body);
    const btn = document.getElementById('langBtn');
    if (btn) {
      // the visible word is in the other language: mark just that word, so the (translated) label keeps the page's voice
      btn.removeAttribute('lang');
      btn.innerHTML = lang === 'ar' ? '<span lang="en">EN</span>' : '<span lang="ar">عربي</span>';
      const label = lang === 'ar' ? 'Switch to English' : 'Switch to Arabic';
      const s = origAttr.get(btn) || {}; s['aria-label'] = label; origAttr.set(btn, s);   // translated by element() below
      btn.setAttribute('aria-label', lang === 'ar' ? AR[label] || label : label);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('langBtn');
    if (btn) btn.addEventListener('click', () => apply(lang === 'ar' ? 'en' : 'ar'));
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    // after app.js has built the glass section (its init also runs on DOMContentLoaded)
    apply(lang);   // app.js (deferred earlier) has already built the glass section
  });
})();

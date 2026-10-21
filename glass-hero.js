'use strict';

/*
 * The 4D glass-stage hero: labels in the glass window and the layered pointer/scroll tilt.
 * Works for every hero that contains a .g3d stage (landing pages and the mockup variants 6–8).
 * Base angles come from CSS custom properties on the hero (--g-rx, --g-ry, --g-rz), so each
 * variant can lean differently. Loaded after app.js. Uses globals: T, L, heroes.
 * ARABIC REVIEW: Arabic strings below are drafts for a native Saudi reader.
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const $ = (s, el = document) => el.querySelector(s);
  const TXT = {
    chip: T('running on aion · 800+ banking APIs', 'يعمل على Aion · أكثر من 800 واجهة برمجة'),
    bank: T('Aion Reference Bank', 'بنك Aion المرجعي'),
    steps: T('steps', 'خطوات'), calls: T('calls', 'استدعاءات'), running: T('running', 'قيد التشغيل'),
  };

  function labels(h) {
    const el = h.el;
    const sync = () => {
      const j = h.journey;
      const set = (s, v) => { const n = $(s, el); if (n) n.innerHTML = v; };
      set('.n-chip', L(TXT.chip));
      set('.g-name', `${L(TXT.bank)} · ${L(j.chip)}`);
      set('.g-steps', `${j.beats.length} ${L(TXT.steps)} · ${j.trace.length} ${L(TXT.calls)}`);
      set('.g-run', L(TXT.running));
    };
    sync();
    new MutationObserver(sync).observe($('.steps', el), { childList: true });
  }

  function rig(h) {
    const el = h.el;
    const g = $('.g3d', el);
    const cs = getComputedStyle(el);
    const num = (p, d) => { const v = parseFloat(cs.getPropertyValue(p)); return Number.isFinite(v) ? v : d; };
    return {
      h, g, back: $('.gback', el), l1: $('.gl1', el), l2: $('.gl2', el), l3: $('.gl3', el), panel: $('.gpanel', el),
      chipsL: $('.gl1 .chips', el), ctrlL: $('.gl1 .controls', el),
      base: { rx: num('--g-rx', 8), ry: num('--g-ry', -14), rz: num('--g-rz', 1.5) },
      cur: null,
    };
  }

  function init() {
    if (typeof heroes === 'undefined') return;
    const list = heroes.filter((h) => h.el.querySelector('.g3d'));
    if (!list.length) return;
    list.forEach(labels);
    document.addEventListener('aion:lang', () => list.forEach((h) => { const n = $('.n-chip', h.el); if (n) n.innerHTML = L(TXT.chip); }));
    if (reduce) return;
    const rigs = list.map(rig);
    let mx = 0; let my = 0;
    let running = false; let last = 0;
    const wake = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } };
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;   // a finger would leave the stage stuck off-centre
      mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
      const boxes = rigs.map((r) => (r.h.visible ? r.g.getBoundingClientRect() : null));
      rigs.forEach((r, i) => { const b = boxes[i]; if (!b) return; r.panel.style.setProperty('--mx', `${e.clientX - b.left}px`); r.panel.style.setProperty('--my', `${e.clientY - b.top}px`); });
      wake();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { mx = 0; my = 0; wake(); });
    addEventListener('scroll', wake, { passive: true });
    addEventListener('resize', wake);
    document.addEventListener('aion:lang', wake);
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      const rtl = document.documentElement.dir === 'rtl' ? -1 : 1;   // mirror the lean in Arabic
      const mob = innerWidth < 1000 || coarse;
      const live = rigs.filter((r) => r.h.visible);
      const boxes = live.map((r) => r.h.el.getBoundingClientRect());   // read every hero first, then write
      let moving = false;
      live.forEach((r, i) => {
        const box = boxes[i];
        const s = clamp(-box.top / (innerHeight * 0.9));               // leans back as this hero scrolls away
        const act = mob ? 0.35 : 1 - s * 0.6;
        const ry0 = r.base.ry * rtl; const rz0 = r.base.rz * rtl; const sg = ry0 <= 0 ? 1 : -1;
        const tg = {
          rx: (mob ? r.base.rx * 0.75 : r.base.rx) - my * 18 * act + s * 26,
          ry: (mob ? ry0 * 0.45 : ry0) + mx * 34 * act + s * 6 * sg,
          rz: rz0 - s * 2 * sg, ty: -s * 40, s: 1 - s * 0.06, px: mx * act, py: my * act,
        };
        if (!r.cur) r.cur = { ...tg };
        const kf = 1 - Math.exp(-dt * 11);
        for (const k in r.cur) { const d = tg[k] - r.cur[k]; r.cur[k] += d * kf; if (Math.abs(d) > 0.005) moving = true; }
        const c = r.cur;
        r.g.style.transform = `translate3d(0,${c.ty.toFixed(2)}px,0) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) rotateZ(${c.rz.toFixed(2)}deg) scale(${c.s.toFixed(4)})`;
        r.back.style.transform = `translate3d(${(c.px * 36).toFixed(1)}px,${(c.py * 24).toFixed(1)}px,-90px)`;
        r.l1.style.transform = `translate3d(${(-c.px * 12).toFixed(1)}px,${(-c.py * 8).toFixed(1)}px,30px)`;
        r.l2.style.transform = `translate3d(${(-c.px * 34).toFixed(1)}px,${(-c.py * 22).toFixed(1)}px,120px)`;
        r.l3.style.transform = `translate3d(${(-c.px * 52).toFixed(1)}px,${(-c.py * 32).toFixed(1)}px,190px)`;
        if (r.chipsL) r.chipsL.style.transform = `translate3d(${(-c.px * 22).toFixed(1)}px,${(-c.py * 14).toFixed(1)}px,${mob ? 28 : 70}px)`;
        if (r.ctrlL) r.ctrlL.style.transform = `translate3d(${(-c.px * 26).toFixed(1)}px,${(-c.py * 16).toFixed(1)}px,${mob ? 36 : 90}px)`;
      });
      // settled and nothing changing: stop until the pointer, scroll or language wakes it again
      if (moving) requestAnimationFrame(loop); else running = false;
    };
    wake();
    setTimeout(wake, 400);   // the visibility observer may report after the first frame
  }
  // app.js builds the heroes on DOMContentLoaded; run right after it.
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
})();

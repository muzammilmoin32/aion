'use strict';

/*
 * Landing D · "Tilt": sections built around 3D tilt (journey wall, layer stack, tilted ribbons,
 * flip-in numbers, pointer-tilt cards, tilting closing card). Loaded after app.js, video-demo.js
 * and glass-hero.js. Uses globals: T, ph, L, JOURNEYS, heroes.
 * ARABIC REVIEW: Arabic strings are drafts for a native Saudi reader. Underlined values are samples.
 */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const N = (en, ar) => T(en, ar);

  const TX = {
    skip: N('Skip to content', 'انتقل إلى المحتوى'),
    pill: N('live inside a Top 5 Saudi bank', 'يعمل داخل أحد أكبر خمسة بنوك سعودية'),
    navJ: N('Journeys', 'الرحلات'), navL: N('The layer', 'الطبقة'), navN: N('Numbers', 'الأرقام'), navD: N('Deployment', 'النشر'),
    wTag: N('demo library', 'مكتبة العروض'),
    wH: N('Six journeys. <em class="s">One layer.</em>', 'ست رحلات. <em class="s">طبقة واحدة.</em>'),
    wP: N('Each card is a real journey running on the Aion reference bank. Tap one to play it in the phone above.', 'كل بطاقة رحلة حقيقية تعمل على بنك Aion المرجعي. اضغط إحداها لتشغيلها في الجوال أعلاه.'),
    play: N('Play in the hero', 'شغّلها في الواجهة'),
    pause: N('Pause the moving rails', 'إيقاف الشريط المتحرك'),
    lTag: N('what sits behind every screen', 'ما خلف كل شاشة'),
    lH: N('Your core stays. <em class="s">We add the layer.</em>', 'نظامك يبقى. <em class="s">ونحن نضيف الطبقة.</em>'),
    lP: N('Scroll to pull the stack apart: the bank\'s channels on top, the Aion layer in the middle, the existing core underneath, unchanged.', 'مرّر لتفكيك الطبقات: قنوات البنك في الأعلى، وطبقة Aion في الوسط، والنظام الأساسي الحالي في الأسفل دون تغيير.'),
    pTop: N('Channels', 'القنوات'), pTopS: N('mobile · web · RM · partners', 'الجوال · الويب · مدير العلاقة · الشركاء'),
    pMid: N('Aion layer', 'طبقة Aion'), pMidS: N('Rubix · 800+ APIs · Ai966', 'Rubix · +800 واجهة · Ai966'),
    pLow: N('Existing core', 'النظام الأساسي'), pLowS: N('unchanged', 'دون تغيير'),
    g1: N('The bank\'s apps and channels', 'تطبيقات البنك وقنواته'), g1s: N('Mobile, web, RM and partner apps, in the bank\'s own brand.', 'تطبيقات الجوال والويب ومدير العلاقة والشركاء، بعلامة البنك.'),
    g2: N('The Aion layer', 'طبقة Aion'), g2s: N('Journeys, open banking rails and Ai966 intelligence, behind one API gateway.', 'الرحلات وقنوات المصرفية المفتوحة وذكاء Ai966، خلف بوابة واجهات برمجة واحدة.'),
    g3: N('The existing core', 'النظام الأساسي الحالي'), g3s: N('Stays where it is. Aion connects to it, it does not replace it.', 'يبقى كما هو. Aion يتصل به ولا يستبدله.'),
    quote: N('“Your core stays. We add the layer that makes it move.”', '«نظامك الأساسي يبقى. ونحن نضيف الطبقة التي تحرّكه.»'),
    nTag: N('proof', 'الإثبات'),
    nH: N('Numbers we did <em class="s">not</em> have to explain away.', 'أرقام <em class="s">لم</em> نحتج إلى تبريرها.'),
    nP: N('Company facts, each with a source line.', 'حقائق عن الشركة، لكلٍّ منها مصدر.'),
    nums: [
      ['800+', N('banking APIs', 'واجهة برمجة مصرفية'), N('accounts, payments, cards, lending', 'الحسابات والمدفوعات والبطاقات والتمويل')],
      ['9', N('years in Saudi and GCC banking', 'سنوات في القطاع المصرفي'), N('founded 2017 · Riyadh', 'تأسست 2017 · الرياض')],
      ['3', N('open banking licences', 'تراخيص للمصرفية المفتوحة'), N('SAMA · CBB · FCA', 'ساما · البحرين · المملكة المتحدة')],
      ['~6', N('months to a live SME business', 'أشهر لإطلاق أعمال المنشآت'), N(ph('sample'), ph('نموذج'))],
    ],
    dTag: N('deployment', 'النشر'),
    dH: N('Where it runs is <em class="s">your choice.</em>', 'مكان التشغيل <em class="s">قرارك.</em>'),
    dP: N('Move the pointer over a card: each one tilts toward you. Containerised on Kubernetes in every option.', 'حرّك المؤشر فوق أي بطاقة لتميل نحوك. خدمات في حاويات على Kubernetes في كل خيار.'),
    plans: [
      ['bank', N('On-premise', 'داخل مقر البنك'), N('In the bank\'s own data centre, beside the existing core.', 'في مركز بيانات البنك، بجانب النظام الأساسي.'), [N('Bank-operated Kubernetes', 'Kubernetes يديره البنك'), N('Air-gapped options', 'خيارات معزولة'), N('Aion support on site', 'دعم Aion في الموقع')]],
      ['shield', N('In-Kingdom cloud', 'سحابة داخل المملكة'), N('Data stays in Saudi Arabia. The fastest path to launch.', 'البيانات تبقى في السعودية. أسرع طريق للإطلاق.'), [N('SAMA cyber framework alignment', 'التوافق مع الإطار السيبراني لساما'), N('Managed upgrades', 'تحديثات مُدارة'), N('Scales with demand', 'يتوسع مع الطلب')], true],
      ['lock', N('Private cloud', 'سحابة خاصة'), N('Dedicated to one bank, with bank-held keys.', 'مخصصة لبنك واحد، بمفاتيح يحتفظ بها البنك.'), [N('Single-tenant', 'مستأجر واحد'), N('Custom network rules', 'قواعد شبكة مخصصة'), N('Named specialist', 'أخصائي مسمّى')]],
    ],
    cNow: N('what now', 'ماذا الآن'),
    cH: N('See it on your own journeys in <em class="s">20 minutes.</em>', 'شاهده على رحلاتك أنت خلال <em class="s">20 دقيقة.</em>'),
    cP: N('Pick the journey your board asks about most. We run it live on the reference bank and show what sits behind every screen.', 'اختر الرحلة التي يسأل عنها مجلس إدارتك أكثر. نشغّلها مباشرة ونعرض ما خلف كل شاشة.'),
    foot: N('Riyadh · Manama · Karachi', 'الرياض · المنامة · كراتشي'),
  };
  const RAILS = [['Nafath', 'نفاذ'], ['Wathq', 'واثق'], ['SIMAH', 'سمة'], ['SADAD', 'سداد'], ['SARIE', 'سريع'], ['mada', 'مدى'], ['Mudad / WPS', 'مدد / حماية الأجور'], ['GOSI', 'التأمينات'], ['ZATCA', 'الزكاة والضريبة']];
  const WALL = ['sme', 'payroll', 'sadad', 'cards', 'lending', 'ews'];

  function render() {
    $$('[data-d]').forEach((el) => { const v = TX[el.dataset.d]; if (v) el.innerHTML = L(v); });
    $('#wall').innerHTML = WALL.map((id) => {
      const j = JOURNEYS[id]; const v = j.video || {};
      const on = typeof heroes !== 'undefined' && heroes[0] && heroes[0].jid === id;
      return `<button type="button" class="wcard" data-j="${id}" aria-pressed="${on}" aria-label="${L(j.chip)}: ${L(TX.play)}"><video class="wv" muted loop playsinline preload="none" poster="${v.poster || ''}" data-src="${v.thumb || ''}" style="object-position:${v.focus || '50% 50%'}" aria-hidden="true"></video>
        <span class="wplay" aria-hidden="true"><svg class="ic"><use href="#i-arrow"/></svg></span>
        <span class="wb"><span class="wt">${L(j.chip)}</span><span class="wl">${L(j.copy[0])}</span><span class="wk">${L(j.kpi.label)}</span></span></button>`;
    }).join('');
    const rails = (ar) => RAILS.concat(RAILS, RAILS).map(([en, a]) => `<li>${ar ? a : en}</li>`).join('');
    const ar = document.documentElement.dir === 'rtl';
    $$('.ribbon').forEach((r) => { r.innerHTML = `<ul>${rails(ar)}</ul><ul>${rails(ar)}</ul>`; r.setAttribute('aria-hidden', 'true'); });
    $('#rails-sr').innerHTML = RAILS.map(([en, a]) => `<li>${ar ? a : en}</li>`).join('');
    $('#flips').innerHTML = TX.nums.map(([n, l, s], i) => `<div class="flip" style="--i:${i}"><div class="face"><span class="n">${n}</span><span><span class="l">${L(l)}</span><br><span class="s">${L(s)}</span></span></div></div>`).join('');
    $('#tcards').innerHTML = TX.plans.map(([icon, h, p, li, rec]) => `<div class="tcard${rec ? ' rec' : ''}"><span class="ti"><svg class="ic"><use href="#i-${icon}"/></svg></span><h3>${L(h)}</h3><p>${L(p)}</p><ul>${li.map((x) => `<li>${L(x)}</li>`).join('')}</ul></div>`).join('');
    wireThumbs();
  }

  /* journey wall: card videos play while on screen; clicking plays the journey in the hero */
  let thumbIO;
  function wireThumbs() {
    if (!thumbIO) {
      thumbIO = new IntersectionObserver((es) => es.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting && !reduce) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
      }), { threshold: 0.3 });
    }
    thumbIO.disconnect();
    $$('#wall video').forEach((v) => thumbIO.observe(v));
  }

  /* scroll-linked tilt: the wall stands up, the stack separates */
  function scrollFx() {
    const wall = $('#wall'); const wallSec = $('#journeys'); const stack = $('#stack'); const stackSec = $('#layer');
    if (reduce) { wall.style.setProperty('--p', '0'); stack.style.setProperty('--sep', '70px'); return; }
    let queued = false;
    const tick = () => {
      queued = false;
      const vh = innerHeight;
      const wr = wallSec.getBoundingClientRect(); const sr = stackSec.getBoundingClientRect();   // read both, then write
      // 1 = lying flat (section below the fold) → 0 = upright once the section is in view
      const pw = clamp((wr.top - vh * 0.15) / (vh * 0.7));
      const ps = clamp((vh - sr.top) / (vh + sr.height * 0.4));
      wall.style.setProperty('--p', pw.toFixed(3));
      stack.style.setProperty('--sep', `${(12 + ps * 110).toFixed(1)}px`);
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    tick();
  }

  /* pointer tilt for cards and the closing card */
  function pointerTilt(el, max) {
    if (reduce || coarse) return;
    let r = null;   // measured once per hover: measuring the already-tilted card on every move makes it jitter
    el.addEventListener('pointerenter', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); r = el.getBoundingClientRect(); });
    addEventListener('scroll', () => { r = null; }, { passive: true });
    el.addEventListener('pointermove', (e) => {
      if (!r) r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      el.classList.add('is-tilting');
      el.style.setProperty('--ry', `${((x - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${((0.5 - y) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => { el.classList.remove('is-tilting'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  }

  function reveals() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.2 });
    $$('main .reveal, main .split, #flips').forEach((el) => io.observe(el));
  }
  function splitWords() {
    $$('main .split').forEach((h) => {
      const walk = (n) => [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s); } }); c.replaceWith(f); } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
      });
      walk(h); $$('.w', h).forEach((w, i) => { w.style.transitionDelay = `${i * 0.06}s`; });
    });
  }

  function init() {
    render(); splitWords(); reveals(); scrollFx();
    const bindTilts = () => { $$('.tcard').forEach((c) => pointerTilt(c, 9)); };
    bindTilts(); pointerTilt($('.close-card'), 6);
    $('#wall').addEventListener('click', (e) => {
      const b = e.target.closest('.wcard'); if (!b || typeof heroes === 'undefined' || !heroes[0]) return;
      heroes[0].setJourney(b.dataset.j);
      $$('#wall .wcard').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      heroes[0].el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    document.addEventListener('aion:lang', () => { render(); splitWords(); $$('main .split').forEach((h) => h.classList.add('in')); bindTilts(); $('#flips').classList.add('in'); });
    const rb = $('#rib-pause');
    rb.addEventListener('click', () => { const p = rb.getAttribute('aria-pressed') !== 'true'; rb.setAttribute('aria-pressed', String(p)); $('.ribbons').classList.toggle('paused', p); });
    $('#year').textContent = new Date().getFullYear();
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
})();

'use strict';

/*
 * Aion landing page in the "Night" theme: the theme's own sections (connects row, feature rows,
 * travelling statement, reliability cards, daily dashboard, numbers, estimator, CTA, footer)
 * written for Aion, plus the 4D glass-stage tilt of the hero. Loaded after app.js and video-demo.js,
 * before theme-dark.js (which adds the loader, light stream, cursor ring and smooth scrolling).
 * Uses globals from app.js: T, ph, L, state, heroes, JOURNEYS, setLens.
 *
 * ARABIC REVIEW: every `ar` string below is a draft for review by a native Saudi reader.
 * Values with a dotted underline (ph) are sample figures for this mockup.
 */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const N = (en, ar) => T(en, ar);
  const S = (s) => ph(s); // sample value

  /* ------------------------------------------------------------------ strings */
  const TX = {
    skip: N('Skip to content', 'انتقل إلى المحتوى'),
    navProduct: N('Product', 'المنتج'), navHow: N('How it works', 'كيف يعمل'), navProof: N('Proof', 'الإثبات'), navDeploy: N('Deployment', 'النشر'),
    pill: N('live inside a Top 5 Saudi bank', 'يعمل داخل أحد أكبر خمسة بنوك سعودية'),
    heroChip: N('running on aion · 800+ banking APIs', 'يعمل على Aion · أكثر من 800 واجهة برمجة'),
    running: N('running', 'قيد التشغيل'), stepsOf: N('steps', 'خطوات'),
    conLabel: N('connected to the rails Saudi banks know', 'مرتبط بالقنوات التي تعرفها البنوك السعودية'),
    gTag: N('sme onboarding', 'فتح حسابات المنشآت'),
    gH: N('Most of opening a business account is <em class="s">paperwork.</em>', 'معظم فتح حساب تجاري <em class="s">أوراق.</em>'),
    gP: N('Owners queue at a branch, documents go back and forth, checks wait on email. Aion takes the paperwork out and leaves the bank the decisions.', 'يصطف الملاك في الفرع، وتتنقل المستندات ذهابًا وإيابًا، وتنتظر الفحوص البريد. Aion يزيل الأوراق ويترك للبنك القرارات.'),
    f1H: N('One timeline, every check', 'خط زمني واحد لكل الفحوص'),
    f1P: N('Nafath, Wathq, owner consent, SIMAH and the core account, in one run the bank can watch.', 'نفاذ وواثق وموافقة الشركاء وسمة والحساب الأساسي، في مسار واحد يراقبه البنك.'),
    f2H: N('Approvals where people already are', 'الموافقات حيث يوجد الناس'),
    f2P: N('Maker-checker on the phone. The checker approves the payroll run in one tap, and the WPS file is built for Mudad.', 'المُدخِل والمُعتمِد من الجوال. يعتمد المُعتمِد مسيّر الرواتب بلمسة، ويُعدّ ملف حماية الأجور لمدد.'),
    f3H: N('Every journey is on the record', 'كل رحلة موثّقة'),
    f3P: N('Every call to every rail is logged with its time stamp: the audit trail a regulator asks for.', 'كل استدعاء لكل قناة مسجّل بتوقيته: سجل التدقيق الذي تطلبه الجهة الرقابية.'),
    tlHead: N('journey #4192 · al noor trading llc', 'رحلة #4192 · شركة النور للتجارة'), tlDone: N('account live', 'الحساب مفعّل'),
    apFrom: N('aion · just now', 'aion · الآن'),
    apMsg: N('The payroll run for <b>Al Noor Trading LLC</b> is ready: 120 staff, 2 errors fixed before release.', 'مسيّر رواتب <b>شركة النور للتجارة</b> جاهز: 120 موظفًا، وتم تصحيح خطأين قبل الصرف.'),
    apDoc: N('wps-file-mudad.sif', 'ملف-حماية-الأجور.sif'), apDocM: N('120 rows', '120 صفًا'),
    apOk: N('Approve and release', 'اعتماد وصرف'), apDone: N('✓ Approved, salaries released', '✓ تم الاعتماد وصرف الرواتب'), apLater: N('Review', 'مراجعة'),
    isoHead: N('journeys per weekday · sample', 'الرحلات حسب أيام الأسبوع · نموذج'),
    days: [N('sun', 'الأحد'), N('mon', 'الإثنين'), N('tue', 'الثلاثاء'), N('wed', 'الأربعاء'), N('thu', 'الخميس'), N('sat', 'السبت')],
    tvL: N('[ what we actually do ]', '[ ما نفعله حقًا ]'),
    stmt: N('Your core stays. We add the layer that makes it move.', 'نظامك الأساسي يبقى. ونحن نضيف الطبقة التي تحرّكه.'),
    bTag: N('the aion layer', 'طبقة Aion'),
    bH: N('<em class="s">Boring</em> in the ways a bank needs.', '<em class="s">مملّ</em> بالطريقة التي يحتاجها البنك.'),
    bP: N('Registries, consent, audit, licences. The parts nobody shows in a demo, and the parts a CTO and a regulator check first.', 'السجلات والموافقات والتدقيق والتراخيص. الأجزاء التي لا يعرضها أحد، وهي أول ما يفحصه رئيس التقنية والجهة الرقابية.'),
    c1H: N('One layer, every rail', 'طبقة واحدة لكل القنوات'),
    c1P: N('Connectors to the existing core, card processors and the Saudi rails and registries, behind one API gateway.', 'موصلات للنظام الأساسي الحالي ومعالجات البطاقات والقنوات والسجلات السعودية، خلف بوابة واجهات برمجة واحدة.'),
    c1F: N('authentication · consent · rate limiting · audit', 'المصادقة · الموافقة · تحديد المعدل · التدقيق'),
    c2H: N('Compliance you never chase', 'امتثال لا تلاحقه'),
    c2P: N('Licensed for open banking in three jurisdictions, with certification status stated honestly.', 'مرخّص للمصرفية المفتوحة في ثلاث جهات، مع ذكر حالة الشهادات بصدق.'),
    c2L: N('licences and certification', 'التراخيص والشهادات'),
    c2F: N('↗ every technical statement reviewed before launch', '↗ تُراجع كل عبارة تقنية قبل الإطلاق'),
    reg: [
      [N('open-banking', 'المصرفية-المفتوحة'), N('SAMA · Saudi Arabia', 'ساما · السعودية'), 100, N('licensed', 'مرخّص')],
      [N('open-banking', 'المصرفية-المفتوحة'), N('CBB · Bahrain', 'مصرف البحرين المركزي'), 100, N('licensed', 'مرخّص')],
      [N('open-banking', 'المصرفية-المفتوحة'), N('FCA · United Kingdom', 'هيئة السلوك المالي · المملكة المتحدة'), 100, N('licensed', 'مرخّص')],
      [N('iso-27001 · soc-2', 'iso-27001 · soc-2'), N('certification', 'الشهادة'), 55, N('in progress', 'قيد التنفيذ')],
    ],
    sTag: N('daily view', 'العرض اليومي'),
    sH: N('A <em class="s">Sunday,</em> seen from Aion.', '<em class="s">يوم أحد</em> كما يراه Aion.'),
    sP: N('The screen a bank\'s digital team keeps open: which rails were called, what went straight through, and what still waits on a person. Sample data.', 'الشاشة التي يبقيها الفريق الرقمي مفتوحة: أي القنوات استُدعيت، وما مرّ مباشرة، وما ينتظر شخصًا. بيانات نموذجية.'),
    d1: N('this week, calls by rail', 'هذا الأسبوع، الاستدعاءات حسب القناة'), d1n: N('next run in', 'التشغيل التالي خلال'),
    d2: N('straight-through', 'تمرّ مباشرة'), d2s: N('of journeys needed no manual step · sample', 'من الرحلات لم تحتج خطوة يدوية · نموذج'),
    d3: N('waiting on a checker', 'بانتظار المُعتمِد'), d3s: N('approvals, oldest 2 hours', 'موافقات، أقدمها منذ ساعتين'),
    d4: N('rail response times', 'أزمنة استجابة القنوات'), d4s: N('● this week   ○ 90-day average', '● هذا الأسبوع   ○ متوسط 90 يومًا'),
    d5: N('where journeys ran today', 'أين جرت الرحلات اليوم'), d5s: N('every call checked against the bank\'s rules', 'كل استدعاء يُطابق قواعد البنك'),
    nTag: N('proof', 'الإثبات'),
    nH: N('Numbers we did <em class="s">not</em> have to explain away.', 'أرقام <em class="s">لم</em> نحتج إلى تبريرها.'),
    nP: N('Company facts, each with a source line. KPI figures in the demos are samples until measured at a live deployment.', 'حقائق عن الشركة، لكلٍّ منها مصدر. أرقام المؤشرات في العروض نموذجية حتى تُقاس في تشغيل فعلي.'),
    st1: N('banking APIs', 'واجهة برمجة مصرفية'), st1s: N('across accounts, payments, cards, lending', 'للحسابات والمدفوعات والبطاقات والتمويل'),
    st2: N('years in Saudi and GCC banking', 'سنوات في القطاع المصرفي'), st2s: N('founded 2017 · headquartered in Riyadh', 'تأسست 2017 · المقر في الرياض'),
    st3: N('open banking licences', 'تراخيص المصرفية المفتوحة'),
    q: N('“' + S('We opened business accounts for multi-owner LLCs with no branch visit and no paper.') + '”', '«' + S('فتحنا حسابات تجارية لشركات متعددة الشركاء دون زيارة فرع ودون ورق.') + '»'),
    qBy: N(S('Sample quote') + ' · Head of SME Banking, a Top 5 Saudi bank', S('اقتباس نموذجي') + ' · رئيس الخدمات المصرفية للمنشآت، أحد أكبر خمسة بنوك سعودية'),
    pTag: N('deployment', 'النشر'),
    pH: N('Your core stays. <em class="s">We add the layer.</em>', 'نظامك يبقى. <em class="s">ونحن نضيف الطبقة.</em>'),
    pP: N('Containerised on Kubernetes, deployable in the bank\'s own data centre or an in-Kingdom cloud. A full SME banking business can go live in about six months.', 'خدمات في حاويات على Kubernetes، قابلة للنشر في مركز بيانات البنك أو سحابة داخل المملكة. يمكن إطلاق أعمال مصرفية متكاملة للمنشآت خلال نحو ستة أشهر.'),
    eL: N('estimate', 'تقدير'), eQ: N('How many journeys do you want live at launch?', 'كم رحلة تريد تشغيلها عند الإطلاق؟'),
    eY: N('time to go live', 'الوقت حتى الإطلاق'), eM: N('months · sample', 'أشهر · نموذج'),
    jn: N('journeys', 'رحلات'), j1: N('journey', 'رحلة'),
    plans: [
      { n: N('On-premise', 'داخل مقر البنك'), s: N('in the bank\'s own data centre', 'في مركز بيانات البنك'), li: [N('Runs beside the existing core', 'يعمل بجانب النظام الأساسي'), N('Bank-operated Kubernetes', 'Kubernetes يديره البنك'), N('Air-gapped options', 'خيارات معزولة'), N('Aion support on site', 'دعم Aion في الموقع')] },
      { n: N('In-Kingdom cloud', 'سحابة داخل المملكة'), s: N('data stays in Saudi Arabia', 'البيانات تبقى في السعودية'), li: [N('Fastest path to launch', 'أسرع طريق للإطلاق'), N('SAMA cyber framework alignment', 'التوافق مع الإطار السيبراني لساما'), N('Managed upgrades', 'تحديثات مُدارة'), N('Scales with demand', 'يتوسع مع الطلب')], rec: true },
      { n: N('Private cloud', 'سحابة خاصة'), s: N('dedicated to one bank', 'مخصصة لبنك واحد'), li: [N('Single-tenant', 'مستأجر واحد'), N('Bank-held keys', 'مفاتيح يحتفظ بها البنك'), N('Custom network rules', 'قواعد شبكة مخصصة'), N('Named specialist', 'أخصائي مسمّى')] },
    ],
    mostPicked: N('most picked', 'الأكثر اختيارًا'), talk: N('Talk to us', 'تحدث إلينا'),
    ccP: N('The layer behind the bank\'s app: journeys, rails and intelligence for Saudi and GCC banks.', 'الطبقة خلف تطبيق البنك: رحلات وقنوات وذكاء للبنوك في السعودية والخليج.'),
    ccOff: N('offices', 'المكاتب'), ccCities: N('Riyadh · Manama · Karachi', 'الرياض · المنامة · كراتشي'),
    ccNow: N('what now', 'ماذا الآن'),
    ccH: N('See it on your own journeys in <em class="s">20 minutes.</em>', 'شاهده على رحلاتك أنت خلال <em class="s">20 دقيقة.</em>'),
    ccT: N('Pick the journey your board asks about most. We run it live on the reference bank and show what sits behind every screen.', 'اختر الرحلة التي يسأل عنها مجلس إدارتك أكثر. نشغّلها مباشرة على البنك المرجعي ونعرض ما خلف كل شاشة.'),
    status: [N('800+ banking APIs', 'أكثر من 800 واجهة برمجة'), N('licensed by SAMA, CBB and FCA', 'مرخّص من ساما ومصرف البحرين المركزي وهيئة السلوك المالي'), N('in-Kingdom deployment', 'نشر داخل المملكة')],
    legal: N('Licence wording is a sample, checked with compliance before launch.', 'صياغة التراخيص نموذجية وتُراجع مع الامتثال قبل الإطلاق.'),
    foot: [
      [N('solutions', 'الحلول'), [N('SME onboarding', 'فتح حسابات المنشآت'), N('Bulk payroll', 'الرواتب المجمّعة'), N('SADAD payments', 'مدفوعات سداد'), N('Cards and spend', 'البطاقات والإنفاق')]],
      [N('intelligence', 'الذكاء'), [N('Early warning', 'الإنذار المبكر'), N('Next best product', 'المنتج الأنسب'), N('Retention', 'الاحتفاظ'), N('Policy copilot', 'مساعد السياسات')]],
      [N('open banking', 'المصرفية المفتوحة'), [N('Cash-flow lending', 'التمويل بالتدفقات'), N('Engage', 'Engage'), N('Nomou', 'Nomou'), N('Consent', 'الموافقات')]],
      [N('company', 'الشركة'), [N('About', 'من نحن'), N('Leadership', 'القيادة'), N('Careers', 'الوظائف'), N('Contact', 'تواصل معنا')]],
    ],
  };
  const RAILS = [['NF', N('nafath', 'نفاذ')], ['WQ', N('wathq', 'واثق')], ['SM', N('simah', 'سمة')], ['SD', N('sadad', 'سداد')], ['SR', N('sarie', 'سريع')], ['MD', N('mada', 'مدى')], ['WPS', N('mudad', 'مدد')], ['GO', N('gosi', 'التأمينات')], ['ZT', N('zatca', 'الزكاة')]];
  const TIMELINE = [[N('nafath auth', 'مصادقة نفاذ'), 8, '0.4s'], [N('wathq cr lookup', 'استعلام واثق'), 30, '1.1s'], [N('owner consent', 'موافقة الشركاء'), 62, S('4 min')], [N('simah check', 'فحص سمة'), 78, '2.3s'], [N('core account', 'الحساب الأساسي'), 92, '0.9s']];
  const NETWORK = [['boubyan', 'Boubyan Bank'], ['kfh-jazeel', 'KFH Jazeel Banking'], ['kfh-bahrain', 'KFH Bahrain'], ['daon', 'Daon'], ['kasisto', 'Kasisto'], ['qarar', 'Qarar'], ['wise', 'Wise']];
  const HUB = [['NF', N('nafath', 'نفاذ'), 14, 50], ['WQ', N('wathq', 'واثق'), 32, 14], ['SM', N('simah', 'سمة'), 68, 14], ['SD', N('sadad', 'سداد'), 86, 50]];

  /* ------------------------------------------------------------------ render */
  const base = document.body.dataset.base || '';
  function split(el) {
    // wrap words for the theme's blur-in, keeping inline markup (<em>)
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s); } });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
    });
    walk(el);
    $$('.w', el).forEach((w, i) => { w.style.transitionDelay = `${i * 0.06}s`; });
  }
  function render() {
    $$('[data-n]').forEach((el) => {
      const v = TX[el.dataset.n];
      if (!v) return;
      el.innerHTML = L(v);
      if (el.classList.contains('split')) split(el);
    });
    $$('[data-n-aria]').forEach((el) => el.setAttribute('aria-label', L(TX[el.dataset.nAria]).replace(/<[^>]+>/g, '')));
    $('#apps').innerHTML = RAILS.map(([c, n], i) => `${i ? '<div class="link" aria-hidden="true"><b></b></div>' : ''}<div class="app"><div class="t">${c}</div><span class="mono">${L(n)}</span></div>`).join('');
    $('#timeline').innerHTML = `<div class="p-head"><span class="mono">${L(TX.tlHead)}</span><span class="mono ok">${L(TX.tlDone)}</span></div>` +
      TIMELINE.map(([l, w, t], i) => `<div class="trow"><span>${L(l)}</span><div class="tbar"><span style="--w:${w}%;--d:${0.1 + i * 0.15}s"></span></div><span class="mono">${t}</span></div>`).join('') +
      '<div class="axis mono small"><span>0</span><span>1m</span><span>3m</span><span>5m</span></div>';
    $('#approve').innerHTML = `<div class="msg"><div class="av"><svg class="ic"><use href="#i-check"/></svg></div><div class="body"><span class="mono">${L(TX.apFrom)}</span>${L(TX.apMsg)}
      <div class="doc"><span>${L(TX.apDoc)}</span><span class="mono">${L(TX.apDocM)}</span></div>
      <div class="acts"><button type="button" class="btn btn-primary sm" id="signBtn">${L(TX.apOk)}</button><button type="button" class="btn sm">${L(TX.apLater)}</button></div></div></div>`;
    const hs = [60, 85, 110, 130, 100, 170];
    $('#iso').innerHTML = `<div class="p-head"><span class="mono">${L(TX.isoHead)}</span></div><div class="iso">${hs.map((h, i) => `<div class="ib${i === 4 ? ' hot' : ''}"><div class="col" style="--h:${h}px;--d:${i * 0.08}s"><div class="fr"></div><div class="sd"></div><div class="tp"></div></div><span class="mono">${L(TX.days[i])}</span></div>`).join('')}</div>`;
    $('#stmtH').innerHTML = L(TX.stmt).split(' ').map((w) => `<span class="sw">${w}</span>`).join(' ');
    $('#hubwrap').innerHTML = `<svg id="hubsvg" aria-hidden="true"></svg><div id="hub"></div>` + HUB.map(([c, n, x, y]) => `<div class="hn" data-x="${x}" data-y="${y}"><i>${c}</i><span class="mono">${L(n)}</span></div>`).join('');
    $('#region').innerHTML = TX.reg.map(([a, b, w, s], i) => `<div class="rr"><div><b>${L(a)}</b><span class="mono">${L(b)}</span></div><div class="track"><span style="--w:${w}%;--d:${0.2 + i * 0.15}s"></span></div><span class="mono">${L(s)}</span></div>`).join('');
    $('#nlogos').innerHTML = NETWORK.map(([f, n], i) => `<li class="reveal" style="--i:${i}"><img src="${base}assets/network/${f}.png" alt="${n}" loading="lazy"></li>`).join('');
    $('#plans').innerHTML = TX.plans.map((p, i) => `<div class="plan reveal${p.rec ? ' rec' : ''}" style="--i:${i}">${p.rec ? `<span class="mp">${L(TX.mostPicked)}</span>` : ''}<span class="mono">${L(p.s)}</span><div class="pr">${L(p.n)}</div><ul>${p.li.map((x) => `<li>${L(x)}</li>`).join('')}</ul><button type="button" class="btn" data-open-booking>${L(TX.talk)}</button></div>`).join('');
    $('#statusRow').innerHTML = TX.status.map((s) => `<span><span class="dot"></span>${L(s)}</span>`).join('');
    $('#footGrid').innerHTML = `<div><img class="f-logo" src="${base}assets/logo-aion-white.png" alt="Aion Digital" width="1000" height="436"><p class="f-p">${L(TX.ccP)}</p><p class="mono small">${L(TX.ccCities)}</p></div>` +
      TX.foot.map(([h, items]) => `<div><h5>${L(h)}</h5>${items.map((x) => `<a href="#glue">${L(x)}</a>`).join('')}</div>`).join('');
    $('#year').textContent = new Date().getFullYear();
    layoutHub(); updEstimate(); observeReveals();
  }

  /* ------------------------------------------------------------------ reveals + counters */
  let io;
  function observeReveals() {
    if (!io) {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.dispatchEvent(new Event('revealed'));
        io.unobserve(e.target);
      }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    }
    $$('main .reveal:not(.in), main .split:not(.in), main .npanel:not(.in), main .stat:not(.in)').forEach((el) => io.observe(el));
  }
  function count(el, to, suf = '') {
    if (reduce) { el.textContent = to.toLocaleString() + suf; return; }
    const t0 = performance.now(); const d = 1800;
    (function f(n) { const k = Math.min(1, (n - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString() + suf; if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function wireCounters() {
    $$('[data-count]').forEach((el) => {
      const host = el.closest('.reveal'); if (!host) return;
      const run = () => count(el, +el.dataset.count);
      if (host.classList.contains('in')) run(); else host.addEventListener('revealed', run, { once: true });
    });
    const ringCard = $('#ringCard');
    const ringRun = () => { $('#ringFg').style.strokeDashoffset = 314 * (1 - 0.82); count($('#ringN'), 82, '%'); };
    if (ringCard.classList.contains('in')) ringRun(); else ringCard.addEventListener('revealed', ringRun, { once: true });
  }

  /* ------------------------------------------------------------------ hub, heat, wave, dmap, rails loop */
  let hubDots = [];
  function layoutHub() {
    const wrap = $('#hubwrap'); const svg = $('#hubsvg'); if (!wrap) return;
    const W = wrap.clientWidth; const H = wrap.clientHeight; svg.innerHTML = ''; hubDots = [];
    $$('.hn', wrap).forEach((n) => {
      n.style.left = `${n.dataset.x}%`; n.style.top = `${n.dataset.y}%`;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M${W * n.dataset.x / 100},${H * n.dataset.y / 100} L${W / 2},${H / 2}`); p.setAttribute('class', 'hline'); svg.appendChild(p);
      const d = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); d.setAttribute('r', 2.5); d.setAttribute('class', 'hdot'); svg.appendChild(d);
      hubDots.push({ p, d, L: p.getTotalLength(), off: Math.random() });
    });
  }
  function dashboards() {
    const heat = $('#heat'); const rails = ['NF', 'WQ', 'SM', 'SD', 'MD'];
    const days = [N('sun', 'أحد'), N('mon', 'إثن'), N('tue', 'ثلا'), N('wed', 'أرب'), N('thu', 'خمي'), N('fri', 'جمع'), N('sat', 'سبت')];
    const drawHeat = () => { heat.innerHTML = '<span></span>' + days.map((d) => `<span class="mono">${L(d)}</span>`).join('') + rails.map((r) => `<span class="mono">${r}</span>${'<i class="c"></i>'.repeat(7)}`).join(''); };
    drawHeat(); document.addEventListener('aion:lang', drawHeat);
    const shuffle = () => $$('.c', heat).forEach((c, i) => { const col = i % 7; const v = col === 5 ? Math.random() * 0.4 : Math.random(); c.className = `c ${v > 0.93 ? 'hot' : v > 0.7 ? 'l3' : v > 0.45 ? 'l2' : v > 0.2 ? 'l1' : ''}`; });
    shuffle(); if (!reduce) setInterval(shuffle, 1800);
    let n = 12; if (!reduce) setInterval(() => { n = n <= 1 ? 12 : n - 1; $('#nextN').textContent = n; }, 1000);
    const w1 = $('#w1'); const w2 = $('#w2');
    const mk = (t, ph2, a) => { let d = ''; for (let x = 0; x <= 300; x += 6) { const y = 45 + Math.sin(x * 0.03 + t * 0.0015 + ph2) * a + Math.sin(x * 0.011 + ph2) * 8; d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`; } return d; };
    loopFns.push((t) => { w1.setAttribute('d', mk(t, 0, 18)); w2.setAttribute('d', mk(t, Math.PI, 14)); });
    const dm = $('#dmap'); for (let i = 0; i < 90; i += 1) dm.insertAdjacentHTML('beforeend', `<i class="${Math.random() < 0.12 ? 'on' : ''}" style="--d:${(Math.random() * 2).toFixed(2)}s"></i>`);
    loopFns.push((t) => hubDots.forEach((h) => { const pt = h.p.getPointAtLength(h.L * (((t * 0.00035) + h.off) % 1)); h.d.setAttribute('cx', pt.x); h.d.setAttribute('cy', pt.y); }));
    // rails row: a dot runs along the line and lights each stop
    (async function railsLoop() {
      if (reduce) { $$('#apps .app').forEach((a) => a.classList.add('on')); return; }
      for (;;) {
        const apps = $$('#apps .app'); const links = $$('#apps .link b');
        apps.forEach((a) => a.classList.remove('on')); if (apps[0]) apps[0].classList.add('on');
        for (let i = 0; i < links.length; i += 1) {
          const b = links[i]; if (!b.isConnected) break;
          b.style.opacity = 1;
          const rtl = document.documentElement.dir === 'rtl';
          await b.animate([{ left: rtl ? '100%' : '0%' }, { left: rtl ? '0%' : '100%' }], { duration: 460, easing: 'ease-in-out' }).finished.catch(() => {});
          b.style.opacity = 0; if (apps[i + 1]) apps[i + 1].classList.add('on');
        }
        await wait(1600);
      }
    })();
    // approval demo
    setInterval(() => { const b = $('#signBtn'); if (!b) return; const d = !b.classList.contains('done'); b.classList.toggle('done', d); b.innerHTML = L(d ? TX.apDone : TX.apOk); }, 2600);
  }

  /* ------------------------------------------------------------------ estimator */
  function updEstimate() {
    const range = $('#range'); if (!range) return;
    const n = +range.value; const f = (n - 1) / 11;
    const months = n <= 2 ? 3 : n <= 6 ? 6 : 9;
    const pi = n <= 2 ? 0 : n <= 6 ? 1 : 2;
    const dg = $('#digits'); const s = String(months);
    while (dg.children.length < s.length) { const d = document.createElement('div'); d.className = 'digit'; for (let k = 0; k < 10; k += 1) { const sp = document.createElement('span'); sp.textContent = k; d.appendChild(sp); } dg.appendChild(d); }
    while (dg.children.length > s.length) dg.lastChild.remove();
    [...s].forEach((ch, i) => { dg.children[i].style.transform = `translateY(${-ch * 40}px)`; });
    $('#rv').textContent = `${n} ${L(n > 1 ? TX.jn : TX.j1)}`;
    $('#planName').innerHTML = L([N('Pilot', 'تجريبي'), N('Full SME banking', 'خدمات منشآت متكاملة'), N('Bank-wide layer', 'طبقة على مستوى البنك')][pi]);
    $('#planNote').innerHTML = L([N('one segment, the hero journey first', 'شريحة واحدة، بدءًا بالرحلة الرئيسية'), N('the six-month path for an SME business', 'مسار الأشهر الستة لأعمال المنشآت'), N('SME, retail and corporate on one layer', 'المنشآت والأفراد والشركات على طبقة واحدة')][pi]);
    range.style.background = `linear-gradient(${document.documentElement.dir === 'rtl' ? 270 : 90}deg,var(--brand) ${f * 100}%,#222 ${f * 100}%)`;
    $('#range').setAttribute('aria-valuetext', `${n} ${L(n > 1 ? TX.jn : TX.j1)}, ${months} ${L(TX.eM)}`);
  }

  const loopFns = [];

  /* ------------------------------------------------------------------ the travelling statement plate */
  function statement() {
    const trav = $('#trav'); const sec = $('#statement'); const hub = () => $('#hub');
    const stmt = $('.stmt', trav); const tile = $('.tile', trav); const plate = $('.plate', trav); const grid = $('.grid', trav);
    const TS = 64;
    if (reduce) { trav.style.display = 'none'; sec.classList.add('static'); sec.innerHTML = `<div class="nwrap"><div class="plate-static"><span class="mono">${L(TX.tvL)}</span><h3>${L(TX.stmt)}</h3></div></div>`; $$('.hn').forEach((n) => n.classList.add('on')); return; }
    loopFns.push(() => {
      const vw = innerWidth; const vh = innerHeight; const cx = vw / 2; const cy = vh / 2;
      const r = sec.getBoundingClientRect(); const total = sec.offsetHeight - vh; const p = -r.top / total;
      let x = cx; let y = cy; let w = TS; let hh = TS; let op = 1; let open = 0; let dock = 0;
      const words = $$('.sw', stmt);
      if (r.top > vh) op = 0;
      else if (r.top > 0) { const k = ease(clamp((vh - r.top) / vh)); y = lerp(vh + TS, cy, k); }
      else if (p <= 1) {
        open = p < 0.55 ? ease(clamp(p / 0.25)) : ease(clamp(1 - (p - 0.55) / 0.25));
        const PW = Math.min(1040, vw * 0.94); const PH = Math.min(vw < 900 ? 420 : 380, vh * 0.62);
        w = lerp(TS, PW, open); hh = lerp(TS, PH, open);
        const k = clamp((p - 0.18) / 0.36); words.forEach((s, i) => s.classList.toggle('on', i / words.length < k));
      } else {
        const hb = hub(); if (!hb) { op = 0; } else {
          const hr = hb.getBoundingClientRect(); const hx = hr.left + hr.width / 2; const hy = hr.top + hr.height / 2;
          dock = ease(clamp(1 - (hy - cy) / (vh * 0.75)));
          if (hy > cy) { x = lerp(cx, hx, dock); y = cy; } else { x = hx; y = hy; dock = 1; }
          if (hy < -100) op = 0;
        }
      }
      trav.style.opacity = op; trav.style.width = `${w}px`; trav.style.height = `${hh}px`;
      trav.style.transform = `translate(${x - w / 2}px,${y - hh / 2}px)`;
      plate.style.borderRadius = `${lerp(16, 26, open)}px`;
      stmt.style.opacity = clamp((open - 0.7) / 0.25); grid.style.opacity = open * 0.9;
      stmt.style.transform = `translateY(${(1 - open) * 20}px)`;
      tile.style.top = `${lerp(50, 70, open)}%`;
      tile.style.background = `rgba(3,20,18,${1 - dock})`; tile.style.color = dock > 0.5 ? '#031412' : '#6ff0e4';
      tile.style.transform = `scale(${lerp(1, 1.15, dock)})`;
      const on = dock >= 1; if (on !== statement.on) { statement.on = on; $$('.hn').forEach((n) => n.classList.toggle('on', on)); }
    });
  }

  /* ------------------------------------------------------------------ boot */
  function init() {
    render();
    wireCounters();
    dashboards();
    statement();
    $('#range').addEventListener('input', updEstimate);
    addEventListener('resize', layoutHub);
    document.addEventListener('aion:lang', () => { render(); wireCounters(); });
    let last = performance.now();
    const loop = (t) => { requestAnimationFrame(loop); const dt = Math.min(0.05, (t - last) / 1000); last = t; for (let i = loopFns.length - 1; i >= 0; i -= 1) { try { loopFns[i](t, dt); } catch (e) { console.warn(e); loopFns.splice(i, 1); } } };
    requestAnimationFrame(loop);
  }
  // app.js builds the hero on DOMContentLoaded; run after it.
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
})();

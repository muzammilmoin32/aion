'use strict';

/*
 * Aion homepage hero: five design options (front-end mockup).
 * Source of truth for every string and fact: "Aion Website The Script.docx".
 * Visual theme: Aion's existing brand (teal #009899, petrol blue, the teal arc).
 *
 * ARABIC REVIEW: every `ar` string in this file is a draft translation. It MUST be
 * reviewed by a native Saudi Arabic reader before publishing (script, "Proof, trust
 * and pre-publish checks": "Arabic reviewed by a native Saudi reader, not
 * machine-translated and left").
 *
 * Anything in [square brackets] rendered with class "ph" is a placeholder the script
 * leaves open (unmeasured KPIs, unnamed form fields, fictional names, unwritten copy).
 */

const LOOP_MS = 30000; // Demo template: 30 seconds, silent, looping.
const T = (en, ar) => ({ en, ar });
// Sample values (realistic examples for the mockup) carry a dotted underline and a tooltip.
const ph = (s) => `<span class="ph" title="Sample value">${s}</span>`;
const P = (en, ar) => T(ph(en), ph(ar));

const state = { lang: 'en', lens: 'business', behind: false, theme: 'auto' };
const store = {
  get(k) { try { return localStorage.getItem('aion-mock:' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('aion-mock:' + k, v); } catch (e) { /* storage blocked */ } },
};
const L = (x) => (x == null ? '' : typeof x === 'string' ? x : (x[state.lang] ?? x.en));

/* ------------------------------------------------------------------ UI strings */
const UI = {
  title: T('Aion · Hero options (mockup)', 'Aion · خيارات الواجهة الرئيسية (نموذج أولي)'),
  h1: T('Aion homepage hero: five design options', 'الواجهة الرئيسية لموقع Aion: خمسة خيارات تصميم'),
  skip: T('Skip to the options', 'انتقل إلى الخيارات'),
  'nav.solutions': T('Solutions', 'الحلول'),
  'nav.intel': T('Intelligence (Ai966)', 'الذكاء (Ai966)'),
  'nav.ob': T('Open Banking', 'المصرفية المفتوحة'),
  'nav.platform': T('Platform', 'المنصة'),
  'nav.company': T('Company', 'الشركة'),
  menu: T('Menu', 'القائمة'),
  primaryNav: T('Primary', 'التنقل الرئيسي'),
  view: T('View', 'طريقة العرض'),
  business: T('Business view', 'عرض الأعمال'),
  technical: T('Technical view', 'العرض التقني'),
  language: T('Language', 'اللغة'),
  book: T('Book a walkthrough', 'احجز جولة تعريفية'),
  options: T('Design options', 'خيارات التصميم'),
  option: T('Option', 'الخيار'),
  toLanding: T('← Landing page', '→ الصفحة الرئيسية'),
  vidTag: T('Sample video', 'فيديو نموذجي'),
  theme: T('Theme', 'المظهر'),
  auto: T('Auto', 'تلقائي'),
  light: T('Light', 'فاتح'),
  dark: T('Dark', 'داكن'),
  journeys: T('Journeys', 'الرحلات'),
  behind: T("Show what's behind it", 'اعرض ما خلف الشاشة'),
  behindTitle: T('Behind the screen', 'خلف الشاشة'),
  traceNote: T(
    'Times shown are the demo clock, ' + ph('sample timings') + '.',
    'الأوقات المعروضة هي توقيت العرض التوضيحي، ' + ph('توقيتات نموذجية') + '.'
  ),
  pause: T('Pause demo', 'إيقاف العرض مؤقتًا'),
  play: T('Play demo', 'تشغيل العرض'),
  bookLong: T('Book a 20-minute walkthrough', 'احجز جولة تعريفية مدتها 20 دقيقة'),
  whatsapp: T('Message us on WhatsApp', 'راسلنا عبر واتساب'),
  progress: T('Journey steps', 'خطوات الرحلة'),
  demo: T('Demo', 'عرض توضيحي'),
  step: T('Step', 'الخطوة'),
  of: T('of', 'من'),
  svc: T('Services called', 'الخدمات المستدعاة'),
  latency: T('Latency', 'زمن الاستجابة'),
  deploy: T('Deployment pattern', 'نمط النشر'),
  toConfirm: P('Kubernetes, in-Kingdom cloud', 'Kubernetes، سحابة داخل المملكة'),
  techFoot: T(
    'Latency and deployment pattern: ' + ph('sample values, confirmed by the technology lead before launch') + '.',
    'زمن الاستجابة ونمط النشر: ' + ph('قيم نموذجية يعتمدها مسؤول التقنية قبل الإطلاق') + '.'
  ),
  dlgTitle: T('Book a 20-minute walkthrough', 'احجز جولة تعريفية مدتها 20 دقيقة'),
  dlgIntro: T('Two fields only, then the calendar.', 'حقلان فقط، ثم التقويم.'),
  dlgNote: T('We reply within one working day with a time that suits you.', 'نرد خلال يوم عمل واحد بموعد يناسبك.'),
  f1: T('Work email', 'البريد الإلكتروني للعمل'),
  f2: T('Bank or company', 'البنك أو الشركة'),
  submit: T('Continue to calendar', 'المتابعة إلى التقويم'),
  done: T('Thank you. A calendar invite for your 20-minute walkthrough is on its way.', 'شكرًا لك. دعوة التقويم لجولتك التعريفية ومدتها 20 دقيقة في طريقها إليك.'),
  close: T('Close', 'إغلاق'),
};

/* ------------------------------------------------- shared words for demo screens */
const W = {
  bank: T('Aion Reference Bank', 'بنك Aion المرجعي'), // working name from the script's casting rules
  llc: P('Al Noor Trading LLC', 'شركة النور للتجارة'),
  tradeCo: P('Al Waha Trading Co.', 'شركة الواحة التجارية'),
  amount: T(`SAR ${ph('48,250')}`, `${ph('48,250')} ر.س`),
  limit: T(`SAR ${ph('750,000')}`, `${ph('750,000')} ر.س`),
  iban: '<bdi dir="ltr" class="mono">SA•• •••• •••• •••• •••• ••••</bdi>',
  cr: '<bdi dir="ltr" class="mono">••••••••••</bdi>',
  nafath: T('Nafath', 'نفاذ'),
  wathq: T('Wathq', 'واثق'),
  simah: T('SIMAH', 'سمة'),
  approved: T('Approved', 'تمت الموافقة'),
  approve: T('Approve', 'اعتماد'),
  signed: T('Signed', 'تم التوقيع'),
  waiting: T('Waiting', 'بانتظار'),
  owner: T('Owner', 'الشريك'),
  staff: T('Staff', 'الموظف'),
  maker: T('Maker', 'المُدخِل'),
  checker: T('Checker', 'المُعتمِد'),
  submit: T('Submit', 'إرسال'),
  rm: T('RM', 'مدير العلاقة'),
  payrollRun: T('Payroll run', 'مسيّر الرواتب'),
  wrongIban: T('Wrong IBAN', 'آيبان غير صحيح'),
  missingId: T('Missing ID', 'هوية مفقودة'),
  fixed: T('Fixed', 'تم التصحيح'),
  workingCap: T('Working capital', 'رأس مال عامل'),
};

/* --------------------------------------------------------- screen building blocks */
const ic = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const bub = (name, tone = 'teal') => `<span class="bub ${tone}">${ic(name)}</span>`;
const rv = (html, d = 0, cls = '') => `<div class="rv ${cls}" style="--d:${d}ms">${html}</div>`;
const chk = (d = 0, cls = '') => `<span class="chk ${cls}" style="--d:${d}ms" aria-hidden="true">${ic('check')}</span>`;
const swap = (a, b, d) => `<span class="swap" style="--d:${d}ms"><span class="sa">${a}</span><span class="sb">${b}</span></span>`;
const pill = (txt, tone = 'ok') => `<span class="pill ${tone}">${txt}</span>`;
/* App chrome: teal header (status bar, bank, screen title), light body, home indicator. */
const appTop = (title = '', tag = '') =>
  `<div class="app-top"><div class="status"><span>9:41</span><span class="sig" aria-hidden="true"><i></i><i></i><i></i></span></div>` +
  `<div class="app-id"><span class="app-mark">${ic('bank')}</span><span class="app-name">${L(W.bank)}</span>${tag ? `<span class="app-tag">${tag}</span>` : ''}</div>` +
  `${title ? `<p class="app-title">${title}</p>` : ''}</div>`;
const body = (html, foot = '') => `<div class="scr-body">${html}${foot ? `<div class="scr-foot">${foot}</div>` : ''}</div>`;
const scr = (title, inner, foot = '', tag = '') => appTop(title, tag) + body(inner, foot);
const card = (html, d = 0, cls = '') => rv(html, d, 'card ' + cls);
/* A list row: icon bubble, title (+ optional sub line), right-hand slot. */
const item = ({ i, tone = 'teal', t, s = '', r = '', d = 0, cls = '' }) =>
  rv(`${i ? bub(i, tone) : ''}<span class="r-l"><span class="r-t">${t}</span>${s ? `<span class="r-s">${s}</span>` : ''}</span><span class="r-r">${r}</span>`, d, 'row ' + cls);
const btn = (label, d = 0, tap = true) =>
  rv(`<span class="scr-btn${tap ? ' tap' : ''}" style="--td:${d + 700}ms">${label}</span>`, d, 'btn-wrap');
const sk = () => '<span class="sk"></span><span class="sk s2"></span><span class="sk s3"></span>';
const field = (label, value, d = 0) => rv(`<span class="field-l">${label}</span><span class="field">${value}</span>`, d, 'field-wrap');
const done = (label, d = 0) => rv(`<span class="burst">${chk(d + 200, 'big')}</span><p class="done-t">${label}</p>`, d, 'done');

/* ---------------------------------------------------------------------- journeys
 * Each journey follows the Demo library template: five or six beats (one screen
 * each, captions on screen), three lines of side copy, one board KPI, and the
 * "under the hood" trace. `trace[].at` = [beat index, fraction of that beat].
 * `video` is reserved for the real MP4/WebM + poster (see Hero.setMedia).
 */
const JOURNEYS = {
  /* 1. SME onboarding: three-owner LLC (homepage hero) */
  sme: {
    icon: 'building',
    chip: T('SME onboarding', 'فتح حسابات المنشآت'),
    copy: [
      T('A three-owner LLC. Business account open on a phone.', 'شركة ذات مسؤولية محدودة بثلاثة شركاء. حساب تجاري يُفتح من الجوال.'),
      T('Every owner approves through Nafath. The CR comes from Wathq. No branch visit, no paper.', 'كل شريك يوافق عبر نفاذ. السجل التجاري يأتي من واثق. بلا زيارة للفرع، وبلا ورق.'),
      T('Running on Aion inside a Top 5 Saudi bank.', 'يعمل على Aion داخل أحد أكبر خمسة بنوك سعودية.'),
    ],
    kpi: {
      icon: 'clock',
      label: T('Time to account', 'الوقت حتى فتح الحساب'),
      value: T(`${ph('12')} minutes`, `${ph('12')} دقيقة`),
      note: T('live deployment', 'تشغيل فعلي'),
    },
    foot: T(
      '¹ ' + ph('Sample figure for this mockup') + '. The final number comes from the live deployment.',
      '¹ ' + ph('رقم نموذجي لهذا النموذج') + '. يأتي الرقم النهائي من التشغيل الفعلي.'
    ),
    beats: [
      {
        icon: 'building',
        step: T('Open', 'فتح'),
        cap: T('Owner taps Open business account', 'المالك يضغط «فتح حساب تجاري»'),
        scr: () => scr(L(T('Business account', 'حساب تجاري')),
          card(`${bub('building')}<p class="c-t">${L(W.llc)}</p><div class="sk-wrap">${sk()}</div>`, 150, 'hero-card'),
          btn(L(T('Open business account', 'فتح حساب تجاري')), 500)),
      },
      {
        icon: 'shield',
        step: T('Nafath', 'نفاذ'),
        cap: T('Owner approves with Nafath', 'المالك يوافق عبر نفاذ'),
        scr: () => scr(L(T('Approve with Nafath', 'وافق عبر نفاذ')),
          card(`<span class="ring">${ic('shield')}</span><p class="c-t">${L(W.nafath)}</p><p class="c-s">${L(W.owner)} 1</p><span class="naf-code" aria-hidden="true">••</span>`, 100, 'center') +
          item({ i: 'send', t: L(T('Request sent to the Nafath app', 'أُرسل الطلب إلى تطبيق نفاذ')), r: chk(2200), d: 900 }),
          rv(pill(L(W.approved)), 2400)),
      },
      {
        icon: 'search',
        step: T('Wathq', 'واثق'),
        cap: T('CR number entered. Wathq returns company and owner details', 'إدخال رقم السجل التجاري. واثق يعيد بيانات الشركة والشركاء'),
        scr: () => scr(L(T('Company details', 'بيانات الشركة')),
          field(L(T('CR number', 'رقم السجل التجاري')), `<span class="typing">${W.cr}</span>`) +
          card(`<span class="src">${ic('search')}${L(W.wathq)}</span><p class="c-t">${L(W.llc)}</p>`, 1500, 'src-card') +
          `<div class="list">${[1, 2, 3].map((n, i) => item({ i: 'users', tone: 'blue', t: `${L(W.owner)} ${n}`, d: 1900 + i * 250 })).join('')}</div>`),
      },
      {
        icon: 'users',
        step: T('Owners', 'الشركاء'),
        cap: T('The two co-owners approve with Nafath on their own phones', 'الشريكان الآخران يوافقان عبر نفاذ من جواليهما'),
        scr: () => scr(L(T('Owner approvals', 'موافقات الشركاء')),
          `<div class="minis">${[1, 2, 3].map((n, i) => {
            const d = n === 1 ? 0 : 1200 + (i - 1) * 1100;
            return rv(`<span class="mini-top"></span><span class="ring sm">${ic('shield')}</span><span class="mini-n">${L(W.owner)} ${n}</span>${chk(d)}${swap(L(W.waiting), L(W.signed), d)}`, 150 * i, 'mini');
          }).join('')}</div>` + rv(`<p class="c-s">${L(W.llc)}</p>`, 600, 'center-txt')),
      },
      {
        icon: 'search',
        step: T('SIMAH', 'سمة'),
        cap: T('SIMAH and screening checks tick through', 'اكتمال فحص سمة وفحوصات التدقيق'),
        scr: () => scr(L(T('Checks', 'الفحوصات')),
          card(`<p class="c-s">${L(W.llc)}</p>`, 0, 'slim') +
          `<div class="list">` +
          item({ i: 'search', t: L(W.simah), r: chk(1300), d: 200 }) +
          item({ i: 'shield', tone: 'blue', t: L(T('AML screening', 'فحص مكافحة غسل الأموال')), r: chk(2600), d: 400 }) +
          `</div>`),
      },
      {
        icon: 'card',
        step: T('Live', 'جاهز'),
        cap: T('Account live. IBAN shown, virtual card issued', 'الحساب مفعّل. يظهر الآيبان، وتُصدر بطاقة افتراضية'),
        scr: () => scr('',
          done(L(T('Account live', 'الحساب مفعّل'))) +
          field('IBAN', W.iban, 500) +
          rv(`<div class="vcard"><span class="vc-top"><span class="vc-bank">${L(W.bank)}</span><span class="vc-chip"></span></span><span class="vc-num mono" dir="ltr">•••• •••• •••• ••••</span><span class="vc-l">${L(T('Virtual card issued', 'صدرت بطاقة افتراضية'))}</span></div>`, 1300)),
      },
    ],
    trace: [
      { label: T('Nafath authentication', 'مصادقة نفاذ'), at: [1, 0.45] },
      { label: T('Wathq CR lookup', 'استعلام السجل التجاري عبر واثق'), at: [2, 0.35] },
      { label: T('Owner consent', 'موافقة الشركاء'), at: [3, 0.6] },
      { label: T('SIMAH check', 'فحص سمة'), at: [4, 0.3] },
      { label: T('AML screening', 'فحص مكافحة غسل الأموال'), at: [4, 0.55] },
      { label: T('Core account creation', 'إنشاء الحساب في النظام المصرفي الأساسي'), at: [5, 0.1] },
      { label: T('Card issued', 'إصدار البطاقة'), at: [5, 0.3] },
    ],
  },

  /* 2a. Bulk payroll */
  payroll: {
    icon: 'users',
    chip: T('Bulk payroll', 'الرواتب المجمّعة'),
    copy: [
      T('Payroll for 120 staff, approved from a phone.', 'رواتب 120 موظفًا، معتمدة من الجوال.'),
      T('The WPS file is built automatically.', 'ملف نظام حماية الأجور يُعدّ تلقائيًا.'),
      T('Errors are caught before the money moves.', 'الأخطاء تُكتشف قبل أن تتحرك الأموال.'),
    ],
    kpi: {
      icon: 'shield',
      label: T('Errors caught before release', 'أخطاء اكتُشفت قبل الصرف'),
      value: T(`${ph('2')} per run`, `${ph('2')} لكل دورة`),
      note: T('sourced', 'موثّق المصدر'),
    },
    foot: T(
      '¹ ' + ph('Sample figure for this mockup') + '. The final number comes from a live deployment or a named benchmark.',
      '¹ ' + ph('رقم نموذجي لهذا النموذج') + '. يأتي الرقم النهائي من تشغيل فعلي أو مرجع مقارنة مسمّى.'
    ),
    beats: [
      {
        icon: 'file',
        step: T('File', 'الملف'),
        cap: T('Payroll file pulled from the ERP or uploaded', 'سحب ملف الرواتب من نظام تخطيط الموارد أو رفعه'),
        scr: () => scr(L(W.payrollRun),
          card(`${bub('file')}<p class="c-t">${L(T('Source: ERP', 'المصدر: نظام تخطيط الموارد'))}</p><div class="load"><span></span></div>`, 100, 'hero-card') +
          rv(`<p class="big-n">120</p><p class="c-s">${L(T('staff', 'موظفًا'))}</p>`, 1600, 'count') +
          item({ i: 'receipt', tone: 'blue', t: L(T('Total', 'الإجمالي')), r: L(W.amount), d: 2100 })),
      },
      {
        icon: 'alert',
        step: T('Errors', 'الأخطاء'),
        cap: T('Two errors flagged before release: wrong IBAN, missing ID', 'رصد خطأين قبل الصرف: آيبان غير صحيح، وهوية مفقودة'),
        scr: () => scr(L(T('2 errors before release', 'خطآن قبل الصرف')),
          `<div class="list">` +
          item({ i: 'alert', tone: 'red', t: `${L(W.staff)} ${ph('#014')}`, s: L(W.wrongIban), r: pill('!', 'bad'), d: 500, cls: 'flag' }) +
          item({ i: 'alert', tone: 'red', t: `${L(W.staff)} ${ph('#087')}`, s: L(W.missingId), r: pill('!', 'bad'), d: 1000, cls: 'flag' }) +
          item({ i: 'users', t: L(T('Other rows', 'بقية الصفوف')), r: chk(1500), d: 1400 }) + `</div>`),
      },
      {
        icon: 'check',
        step: T('Fixed', 'التصحيح'),
        cap: T('Both errors fixed inline', 'تصحيح الخطأين في مكانهما'),
        scr: () => scr(L(T('Fix inline', 'التصحيح في المكان')),
          `<div class="list">` +
          item({ i: 'file', t: `${L(W.staff)} ${ph('#014')}`, s: L(W.wrongIban), r: swap(pill('!', 'bad'), pill(L(W.fixed)), 1300), d: 0 }) +
          item({ i: 'file', t: `${L(W.staff)} ${ph('#087')}`, s: L(W.missingId), r: swap(pill('!', 'bad'), pill(L(W.fixed)), 2600), d: 150 }) + `</div>`,
          rv(pill(L(T('0 errors', '0 أخطاء'))), 3000)),
      },
      {
        icon: 'users',
        step: T('Approve', 'الاعتماد'),
        cap: T('Maker submits, checker approves on mobile', 'المُدخِل يرسل، والمُعتمِد يوافق من الجوال'),
        scr: () => scr(L(W.payrollRun) + ' · 120',
          item({ i: 'send', t: L(W.maker), r: `<span class="scr-btn sm tap" style="--td:700ms">${L(W.submit)}</span>`, d: 0 }) +
          card(`<span class="src">${ic('users')}${L(W.checker)}</span><p class="c-t">${L(W.payrollRun)} · 120</p><span class="scr-btn tap" style="--td:2600ms">${L(W.approve)}</span>`, 1500),
          rv(pill(L(W.approved)), 3200)),
      },
      {
        icon: 'bank',
        step: T('WPS', 'حماية الأجور'),
        cap: T('WPS file prepared for Mudad. Salaries released', 'إعداد ملف حماية الأجور لمنصة مدد. صرف الرواتب'),
        scr: () => scr('',
          done(L(T('Salaries released', 'تم صرف الرواتب')), 1800) +
          `<div class="list">` +
          item({ i: 'file', t: L(T('WPS file ready for Mudad', 'ملف حماية الأجور جاهز لمدد')), r: chk(800), d: 200 }) +
          item({ i: 'bank', tone: 'blue', t: L(T('Salaries released', 'تم صرف الرواتب')), r: chk(2000), d: 1500 }) + `</div>`),
      },
    ],
    trace: [
      { label: T('ERP payroll file', 'ملف الرواتب من نظام تخطيط الموارد'), at: [0, 0.4] },
      { label: T('IBAN check', 'التحقق من الآيبان'), at: [1, 0.15] },
      { label: T('ID check', 'التحقق من الهوية'), at: [1, 0.25] },
      { label: T('Maker submission', 'إرسال المُدخِل'), at: [3, 0.15] },
      { label: T('Checker approval', 'موافقة المُعتمِد'), at: [3, 0.5] },
      { label: T('WPS file for Mudad', 'ملف حماية الأجور لمدد'), at: [4, 0.15] },
      { label: T('Salaries released', 'صرف الرواتب'), at: [4, 0.35] },
    ],
  },

  /* 2b. SADAD and government payments */
  sadad: {
    icon: 'receipt',
    chip: T('SADAD and government payments', 'سداد والمدفوعات الحكومية'),
    copy: [
      T('Every government and utility bill in one place.', 'كل الفواتير الحكومية وفواتير الخدمات في مكان واحد.'),
      T('Paid through SADAD in one approval.', 'تُسدَّد عبر سداد بموافقة واحدة.'),
      T("Next month's dues forecast before they land.", 'توقّع مستحقات الشهر القادم قبل حلولها.'),
    ],
    kpi: {
      icon: 'chart',
      label: T('Share of SME payments moved to digital', 'حصة مدفوعات المنشآت المنتقلة إلى الرقمية'),
      value: T(`${ph('64')}%`, `${ph('64')}٪`),
      note: T('sourced', 'موثّق المصدر'),
    },
    foot: T(
      '¹ ' + ph('Sample figure for this mockup') + '. The final number comes from a live deployment or a named benchmark.',
      '¹ ' + ph('رقم نموذجي لهذا النموذج') + '. يأتي الرقم النهائي من تشغيل فعلي أو مرجع مقارنة مسمّى.'
    ),
    beats: [
      {
        icon: 'calendar',
        step: T('Dues', 'المستحقات'),
        cap: T('What is due this month: ZATCA VAT, GOSI, municipality, utilities', 'مستحقات هذا الشهر: ضريبة القيمة المضافة، التأمينات الاجتماعية، البلدية، الخدمات'),
        scr: () => scr(L(T('Due this month', 'مستحق هذا الشهر')),
          `<div class="list">${BILLS().map((b, i) => item({ i: b.i, tone: b.tone, t: b.t, r: L(W.amount), d: 300 + i * 300 })).join('')}</div>`),
      },
      {
        icon: 'check',
        step: T('Select', 'الاختيار'),
        cap: T('Four selected, paid in one action', 'اختيار أربع فواتير وسدادها بإجراء واحد'),
        scr: () => scr(L(T('Select bills', 'اختيار الفواتير')),
          `<div class="list">${BILLS().map((b, i) => item({ i: b.i, tone: b.tone, t: b.t, r: chk(300 + i * 350, 'box'), d: 0 })).join('')}</div>`,
          btn(L(T('Pay 4 bills', 'سداد 4 فواتير')), 1700)),
      },
      {
        icon: 'users',
        step: T('Approve', 'الاعتماد'),
        cap: T('Checker approves', 'المُعتمِد يوافق'),
        scr: () => scr(L(T('Approval', 'الاعتماد')),
          card(`<span class="src">${ic('users')}${L(W.checker)}</span><p class="c-t">SADAD · 4</p><span class="scr-btn tap" style="--td:1500ms">${L(W.approve)}</span>`, 0),
          rv(pill(L(W.approved)), 2200)),
      },
      {
        icon: 'receipt',
        step: T('Receipts', 'الإيصالات'),
        cap: T('Receipts filed', 'حفظ الإيصالات'),
        scr: () => scr(L(T('Paid via SADAD', 'سُدّدت عبر سداد')),
          `<div class="list">${BILLS().map((b, i) => item({ i: 'receipt', tone: b.tone, t: b.t, s: L(T('Receipt filed', 'حُفظ الإيصال')), r: chk(500 + i * 400), d: 200 + i * 400 })).join('')}</div>`),
      },
      {
        icon: 'calendar',
        step: T('Forecast', 'التوقع'),
        cap: T("Next month's dues forecast", 'توقّع مستحقات الشهر القادم'),
        scr: () => scr(L(T('Next month', 'الشهر القادم')),
          `<div class="list">${BILLS().map((b, i) => item({ i: b.i, tone: b.tone, t: b.t, r: pill(L(T('Forecast', 'متوقع')), 'soft'), d: 300 + i * 350 })).join('')}</div>`),
      },
    ],
    trace: [
      { label: T('SADAD bill inquiry', 'الاستعلام عن الفواتير عبر سداد'), at: [0, 0.3] },
      { label: T('Bill selection (4)', 'اختيار الفواتير (4)'), at: [1, 0.5] },
      { label: T('Checker approval', 'موافقة المُعتمِد'), at: [2, 0.4] },
      { label: T('SADAD payment', 'السداد عبر سداد'), at: [2, 0.7] },
      { label: T('Receipts filed', 'حفظ الإيصالات'), at: [3, 0.4] },
      { label: T('Dues forecast', 'توقّع المستحقات'), at: [4, 0.3] },
    ],
  },

  /* Wave 2, #4. SME cards and spend. The script gives this journey in one line only:
     "Owner issues cards to five staff, sets limits by category, receipts captured,
     everything syncs to the ERP". Beats are derived strictly from that line (four
     beats). Side copy is not written in the script yet, so it stays a placeholder. */
  cards: {
    icon: 'card',
    chip: T('SME card and spend', 'بطاقات المنشآت والإنفاق'),
    copy: [
      P('Company cards for five staff, issued in minutes.', 'بطاقات لخمسة موظفين، تُصدر في دقائق.'),
      P('Limits by category, receipts captured on the spot.', 'حدود حسب الفئة، وإيصالات تُلتقط فورًا.'),
      P('Every transaction lands in the ERP on its own.', 'كل معاملة تصل إلى نظام تخطيط الموارد تلقائيًا.'),
    ],
    kpi: {
      icon: 'card',
      label: T('Card spend per SME', 'إنفاق البطاقات لكل منشأة'),
      value: T(`SAR ${ph('18,400')} / month`, `${ph('18,400')} ر.س / شهريًا`),
      note: T('sourced', 'موثّق المصدر'),
    },
    foot: T(
      '¹ ' + ph('Sample figure for this mockup') + '. The final number comes from a live deployment or a named benchmark.',
      '¹ ' + ph('رقم نموذجي لهذا النموذج') + '. يأتي الرقم النهائي من تشغيل فعلي أو مرجع مقارنة مسمّى.'
    ),
    beats: [
      {
        icon: 'card',
        step: T('Issue', 'الإصدار'),
        cap: T('Owner issues cards to five staff', 'المالك يصدر بطاقات لخمسة موظفين'),
        scr: () => scr(L(T('Cards', 'البطاقات')),
          `<div class="list">${[1, 2, 3, 4, 5].map((n, i) => item({ i: 'card', tone: i % 2 ? 'blue' : 'teal', t: `${L(W.staff)} ${n}`, r: chk(700 + i * 600), d: 150 + i * 150 })).join('')}</div>`),
      },
      {
        icon: 'layers',
        step: T('Limits', 'الحدود'),
        cap: T('Limits set by category', 'تحديد الحدود حسب الفئة'),
        scr: () => scr(L(T('Limits by category', 'الحدود حسب الفئة')),
          `<div class="list">${[1, 2, 3].map((n, i) => rv(
            `${bub('layers', ['teal', 'blue', 'amber'][i])}<span class="r-l"><span class="r-t">${ph(L([T('Travel', 'السفر'), T('Fuel', 'الوقود'), T('Supplies', 'المستلزمات')][i]))}</span><span class="r-s">${L(W.limit)}</span><span class="slider" style="--to:${[62, 38, 80][i]}%;--sd:${600 + i * 500}ms"><span></span></span></span>`,
            150 + i * 200, 'row lim')).join('')}</div>`),
      },
      {
        icon: 'receipt',
        step: T('Receipts', 'الإيصالات'),
        cap: T('Receipts captured', 'التقاط الإيصالات'),
        scr: () => scr(L(T('Receipts', 'الإيصالات')),
          rv('<div class="receipt" aria-hidden="true"><span></span><span></span><span></span><span></span></div>', 0, 'snap') +
          `<div class="list">${[1, 2, 3].map((n, i) => item({ i: 'receipt', tone: 'amber', t: `${L(W.staff)} ${n}`, s: L(W.amount), r: chk(1400 + i * 500), d: 1200 + i * 300 })).join('')}</div>`),
      },
      {
        icon: 'sync',
        step: T('ERP sync', 'المزامنة'),
        cap: T('Everything syncs to the ERP', 'مزامنة كل شيء مع نظام تخطيط الموارد'),
        scr: () => scr(L(T('ERP sync', 'المزامنة')),
          rv(`<div class="sync" aria-hidden="true"><span class="s-a">${ic('bank')}</span><span class="s-arrows"></span><span class="s-b">ERP</span></div>`, 0) +
          `<div class="list">` +
          item({ i: 'card', t: L(T('Cards', 'البطاقات')), r: chk(1600), d: 900 }) +
          item({ i: 'layers', tone: 'blue', t: L(T('Limits', 'الحدود')), r: chk(2100), d: 1100 }) +
          item({ i: 'receipt', tone: 'amber', t: L(T('Receipts', 'الإيصالات')), r: chk(2600), d: 1300 }) + `</div>`),
      },
    ],
    trace: [
      { label: T('Card issuing ×5', 'إصدار البطاقات ×5'), at: [0, 0.5] },
      { label: T('Category limits', 'حدود الفئات'), at: [1, 0.45] },
      { label: T('Receipt capture', 'التقاط الإيصالات'), at: [2, 0.3] },
      { label: T('ERP sync', 'المزامنة مع نظام تخطيط الموارد'), at: [3, 0.3] },
    ],
  },

  /* OB1. SME cash-flow lending */
  lending: {
    icon: 'chart',
    chip: T('Cash-flow lending', 'التمويل بالتدفقات النقدية'),
    copy: [
      T('Twelve months of bank statements become a cash-flow statement in seconds.', 'كشوف حساب اثني عشر شهرًا تصبح قائمة تدفقات نقدية في ثوانٍ.'),
      T('Credit decided on how the business actually trades.', 'قرار الائتمان مبني على طريقة عمل المنشأة الفعلية.'),
      T('Built on our SAMA open banking licence.', 'مبني على ترخيصنا للمصرفية المفتوحة من ساما.'),
    ],
    kpi: {
      icon: 'clock',
      label: T('Time to credit decision', 'الوقت حتى قرار الائتمان'),
      value: T(`${ph('4')} minutes`, `${ph('4')} دقائق`),
      note: T('sourced', 'موثّق المصدر'),
    },
    foot: T(
      '¹ ' + ph('Sample figure for this mockup') + '. The final number comes from a live deployment or a named benchmark.',
      '¹ ' + ph('رقم نموذجي لهذا النموذج') + '. يأتي الرقم النهائي من تشغيل فعلي أو مرجع مقارنة مسمّى.'
    ),
    beats: [
      {
        icon: 'file',
        step: T('Apply', 'الطلب'),
        cap: T('Owner applies for working capital', 'المالك يتقدم بطلب رأس مال عامل'),
        scr: () => scr(L(W.workingCap),
          card(`${bub('chart')}<p class="c-t">${L(W.llc)}</p><div class="sk-wrap">${sk()}</div>`, 150, 'hero-card'),
          btn(L(T('Apply', 'تقدّم بطلب')), 500)),
      },
      {
        icon: 'link',
        step: T('Consent', 'الموافقة'),
        cap: T('Accounts at two other banks connected on one consent screen', 'ربط حسابات في بنكين آخرين من شاشة موافقة واحدة'),
        scr: () => scr(L(T('Consent', 'الموافقة')),
          `<div class="list">` +
          item({ i: 'bank', tone: 'blue', t: ph(L(T('Partner Bank A', 'البنك الشريك أ'))), r: '<span class="tgl" style="--sd:700ms"></span>', d: 100 }) +
          item({ i: 'bank', tone: 'blue', t: ph(L(T('Partner Bank B', 'البنك الشريك ب'))), r: '<span class="tgl" style="--sd:1100ms"></span>', d: 200 }) + `</div>` +
          card(`<span class="kv"><span>${L(T('What is shared', 'ما تتم مشاركته'))}</span><b>${L(T('Statements', 'كشوف الحساب'))}</b></span><span class="kv"><span>${L(T('For how long', 'لأي مدة'))}</span><b>${ph(L(T('12 months', '12 شهرًا')))}</b></span>`, 400, 'slim'),
          btn(L(T('Allow', 'سماح')), 1500)),
      },
      {
        icon: 'calendar',
        step: T('Statements', 'الكشوف'),
        cap: T('12 months of statements pulled and categorised', 'سحب كشوف 12 شهرًا وتصنيفها'),
        scr: () => scr(L(T('12 months', '12 شهرًا')),
          card(`<div class="months">${Array.from({ length: 12 }, (_, i) => `<span style="--md:${300 + i * 140}ms"></span>`).join('')}</div>`, 0) +
          rv(['Inflows|التدفقات الداخلة', 'Payroll|الرواتب', 'VAT|ضريبة القيمة المضافة'].map((s) => pill(L(T(...s.split('|'))), 'soft')).join(''), 2300, 'tags')),
      },
      {
        icon: 'chart',
        step: T('Cash flow', 'التدفقات'),
        cap: T('Cash-flow statement: inflows, payroll, VAT, net cash by month', 'قائمة التدفقات النقدية: التدفقات الداخلة، الرواتب، ضريبة القيمة المضافة، صافي النقد شهريًا'),
        scr: () => scr(L(T('Cash-flow statement', 'قائمة التدفقات النقدية')),
          card(`<p class="c-s">${L(T('Net cash by month', 'صافي النقد شهريًا'))}</p><div class="bars">${[46, 58, 40, 64, 52, 70, 48, 62, 74, 56, 68, 60].map((h, i) => `<span style="--h:${h}%;--bd:${300 + i * 70}ms"></span>`).join('')}</div><span class="illus">${L(T('Illustrative, fictional data', 'بيانات توضيحية خيالية'))}</span>`, 0)),
      },
      {
        icon: 'spark',
        step: T('Decision', 'القرار'),
        cap: T('Credit decision with a limit and the reasons', 'قرار ائتماني بحدٍّ وأسبابه'),
        scr: () => scr(L(T('Credit decision', 'قرار الائتمان')),
          card(`<span class="src">${ic('spark')}${L(T('Limit', 'الحد'))}</span><p class="big-n sm">${L(W.limit)}</p>`, 0, 'grad') +
          rv(`<p class="c-s">${L(T('Reasons', 'الأسباب'))}</p>`, 900) +
          `<div class="list">` +
          item({ i: 'check', t: ph(L(T('Steady inflows in 12 of 12 months', 'تدفقات داخلة مستقرة في 12 من 12 شهرًا'))), d: 1200 }) +
          item({ i: 'check', t: ph(L(T('Payroll and VAT paid on time', 'سداد الرواتب وضريبة القيمة المضافة في موعدها'))), d: 1500 }) + `</div>`),
      },
      {
        icon: 'check',
        step: T('Accept', 'القبول'),
        cap: T('Owner accepts', 'المالك يقبل'),
        scr: () => scr(L(W.workingCap),
          card(`<span class="src">${ic('chart')}${L(W.workingCap)}</span><p class="big-n sm">${L(W.limit)}</p>`, 0, 'grad'),
          btn(L(T('Accept offer', 'قبول العرض')), 300) + rv(pill(L(T('Accepted', 'تم القبول'))), 1600)),
      },
    ],
    trace: [
      { label: T('Consent (2 banks)', 'الموافقة (بنكان)'), at: [1, 0.55] },
      { label: T('Account data pulled · 12 months', 'سحب بيانات الحسابات · 12 شهرًا'), at: [2, 0.2] },
      { label: T('Categorisation', 'التصنيف'), at: [2, 0.55] },
      { label: T('Cash-flow statement', 'قائمة التدفقات النقدية'), at: [3, 0.2] },
      { label: T('Credit decision', 'قرار الائتمان'), at: [4, 0.15] },
      { label: T('Offer accepted', 'قبول العرض'), at: [5, 0.4] },
    ],
  },

  /* 3. RM early warning (Ai966) */
  ews: {
    icon: 'spark',
    chip: T('RM early warning (AI)', 'الإنذار المبكر لمدير العلاقة (ذكاء اصطناعي)'),
    copy: [
      T('Your SME customer will miss payroll in 60 days. It is already in the transactions.', 'عميلك من المنشآت سيتعثر في دفع الرواتب خلال 60 يومًا. المؤشرات موجودة في معاملاته بالفعل.'),
      T('Ai966 tells the RM who to call, what to offer, and when.', 'Ai966 يخبر مدير العلاقة بمن يتصل، وماذا يعرض، ومتى.'),
      T('Every result is measured against a holdout group.', 'كل نتيجة تُقاس مقارنةً بمجموعة ضابطة.'),
    ],
    // KPI rule from the script: show the measurement method, not an uplift number.
    kpi: {
      icon: 'chart',
      label: T('Result', 'النتيجة'),
      value: T('Measured against a holdout group', 'تُقاس مقارنةً بمجموعة ضابطة'),
      note: T('method shown, no uplift figure', 'تُعرض المنهجية دون رقم تحسّن'),
      method: true,
    },
    foot: T(
      'No uplift figure appears until it is measured at a bank. All demo data is fictional.',
      'لا يظهر أي رقم تحسّن قبل قياسه في بنك. جميع بيانات العروض التوضيحية خيالية.'
    ),
    beats: [
      {
        icon: 'alert',
        step: T('Signal', 'الإشارة'),
        cap: T('Signal: a trading company will likely miss payroll in about 60 days', 'إشارة: شركة تجارية يُرجَّح أن تتعثر في دفع الرواتب خلال نحو 60 يومًا'),
        scr: () => scr('Ai966',
          card(`<span class="src">${ic('spark')}Ai966</span><p class="c-t">${L(W.tradeCo)}</p><p class="alert">${ic('alert')}${L(T('Likely to miss payroll', 'احتمال التعثر في الرواتب'))}</p><p class="big-n">~60 <small>${L(T('days', 'يومًا'))}</small></p>`, 300, 'warn'),
          '', L(W.rm)),
      },
      {
        icon: 'down',
        step: T('Reasons', 'الأسباب'),
        cap: T('Reasons: balances falling four months running, receivables slowing, VAT paid in part', 'الأسباب: أرصدة تتراجع أربعة أشهر متتالية، وتباطؤ التحصيل، وسداد جزئي لضريبة القيمة المضافة'),
        scr: () => scr(L(T('Why', 'لماذا')),
          card(`<p class="c-s">${L(W.tradeCo)}</p>`, 0, 'slim') +
          `<div class="list">` +
          item({ i: 'down', tone: 'red', t: L(T('Balances falling four months running', 'أرصدة تتراجع أربعة أشهر متتالية')), d: 400 }) +
          item({ i: 'down', tone: 'red', t: L(T('Receivables slowing', 'تباطؤ التحصيل')), d: 1200 }) +
          item({ i: 'down', tone: 'red', t: L(T('VAT paid in part', 'سداد جزئي لضريبة القيمة المضافة')), d: 2000 }) + `</div>`, '', L(W.rm)),
      },
      {
        icon: 'spark',
        step: T('Action', 'الإجراء'),
        cap: T('Suggested action: offer a working capital line, with a call script', 'الإجراء المقترح: عرض تسهيل رأس مال عامل، مع نص للمكالمة'),
        scr: () => scr(L(T('Suggested action', 'الإجراء المقترح')),
          card(`<span class="src">${ic('spark')}Ai966</span><p class="c-t">${L(T('Offer a working capital line', 'عرض تسهيل رأس مال عامل'))}</p>`, 0, 'grad') +
          card(`<p class="c-s">${L(T('Call script', 'نص المكالمة'))}</p><p class="script">${ph(L(T('Open with the next payroll date, then offer a working capital line sized to two payrolls.', 'ابدأ بموعد الرواتب القادم، ثم اعرض تسهيل رأس مال عامل يغطي دورتي رواتب.')))}</p>`, 1000, 'slim'),
          '', L(W.rm)),
      },
      {
        icon: 'phone',
        step: T('Call', 'الاتصال'),
        cap: T('RM taps call and logs the outcome', 'مدير العلاقة يتصل ويسجّل النتيجة'),
        scr: () => scr(L(W.tradeCo),
          rv(`<span class="call tap" style="--td:700ms" aria-hidden="true">${ic('phone')}</span>`, 200, 'call-wrap') +
          item({ i: 'file', t: L(T('Outcome', 'النتيجة')), r: ph(L(T('Meeting booked', 'تم حجز اجتماع'))), d: 2000 }),
          rv(pill(L(T('Outcome logged', 'تم تسجيل النتيجة'))), 2800), L(W.rm)),
      },
      {
        icon: 'chart',
        step: T('Holdout', 'المقارنة'),
        cap: T('This group compared against the holdout group', 'مقارنة هذه المجموعة بالمجموعة الضابطة'),
        scr: () => scr(L(T('Measured against a holdout group', 'القياس مقارنةً بمجموعة ضابطة')),
          card(`<div class="holdout"><div><span class="hb"></span><span>${L(T('This group', 'هذه المجموعة'))}</span></div><div><span class="hb"></span><span>${L(T('Holdout group', 'المجموعة الضابطة'))}</span></div></div><span class="illus">${L(T('Fictional data. The result appears once it is measured at a bank.', 'بيانات خيالية. تظهر النتيجة بعد قياسها في بنك.'))}</span>`, 300),
          '', L(W.rm)),
      },
    ],
    trace: [
      { label: T('Transaction data', 'بيانات المعاملات'), at: [0, 0.1] },
      { label: T('Customer state', 'حالة العميل'), at: [1, 0.2] },
      { label: T('Signal', 'الإشارة'), at: [1, 0.6] },
      { label: T('Action', 'الإجراء'), at: [2, 0.3] },
      { label: T('Attribution', 'قياس الأثر'), at: [4, 0.3] },
    ],
  },
};
// Order of the chips, as listed in "Scroll 0: the hero".
const JOURNEY_ORDER = ['sme', 'payroll', 'sadad', 'cards', 'lending', 'ews'];

function BILLS() {
  return [
    { i: 'receipt', tone: 'amber', t: L(T('ZATCA VAT', 'ضريبة القيمة المضافة (الزكاة والضريبة والجمارك)')) },
    { i: 'users', tone: 'blue', t: L(T('GOSI', 'التأمينات الاجتماعية')) },
    { i: 'building', tone: 'teal', t: L(T('Municipality', 'البلدية')) },
    { i: 'bolt', tone: 'green', t: L(T('Utilities', 'الخدمات')) },
  ];
}

/* --------------------------------------------------------------------- the hero */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const fmt = (ms) => `00:${String(Math.floor(ms / 1000)).padStart(2, '0')}`;
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

class Hero {
  constructor(el, v) {
    this.el = el;
    this.v = v;
    this.jid = 'sme';
    this.elapsed = 0;
    this.beat = -1;
    this.lit = -1;
    this.paused = false;
    this.visible = false;
    const q = (s) => el.querySelector(s);
    this.h2 = q('.copy-1');
    this.c2 = q('.copy-2');
    this.c3 = q('.copy-3');
    this.chips = q('.chips');
    this.kpi = q('.kpi');
    this.toast = q('.toast');
    this.cap = q('.cap-t');
    this.srCap = q('.sr-caption');
    this.fill = q('.bar-fill');
    this.steps = q('.steps');
    this.trace = q('.trace');
    this.traceList = q('.trace-list');
    this.sw = q('.behind-switch');
    this.pauseBtn = q('.pause-btn');
    this.foot = q('.foot');
    this.phoneFig = q('.phone-fig');
    this.media = q('[data-demo-media]');

    this.h2.id = `copy1-${v}`;
    this.trace.id = `trace-${v}`;
    el.setAttribute('aria-labelledby', this.h2.id);
    this.sw.setAttribute('aria-controls', this.trace.id);

    this.chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-j]');
      if (b && b.dataset.j !== this.jid) this.setJourney(b.dataset.j);
    });
    this.sw.addEventListener('click', () => setBehind(!state.behind));
    if (this.isVideo()) {
      this.media.muted = true;
      this.media.playsInline = true;
      this.media.addEventListener('loadedmetadata', () => this.render()); // steps and trace follow the real duration
      if (reduceMotion.matches) this.paused = true; // poster first; the visitor presses play
    }
    this.pauseBtn.addEventListener('click', () => { this.paused = !this.paused; this.syncPause(); });
    this.render();
  }

  get journey() { return JOURNEYS[this.jid]; }

  setJourney(id) {
    this.jid = id;
    this.elapsed = 0;
    if (this.isVideo()) this.media.currentTime = 0;
    this.render();
    restart(this.el, 'is-switching');
    scheduleFit(this);
    const chip = this.chips.querySelector(`[data-j="${id}"]`);
    chip.focus({ preventScroll: true }); // keep focus after the chips re-render
    // On phones the chips are one swipeable row: scroll only that row (never the page).
    const cr = this.chips.getBoundingClientRect();
    const r = chip.getBoundingClientRect();
    const dx = r.left < cr.left ? r.left - cr.left - 8 : r.right > cr.right ? r.right - cr.right + 8 : 0;
    if (dx) this.chips.scrollBy({ left: dx, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  isVideo() { return this.media instanceof HTMLVideoElement; }

  /* Demo length: 30 s for the HTML demos; a real video's own duration once it is known. */
  loopMs() { return this.isVideo() && this.media.duration > 0 && Number.isFinite(this.media.duration) ? this.media.duration * 1000 : LOOP_MS; }

  /* One screen per option: size the phone so everything in this hero fits the viewport under
     the sticky header. Phone-area height scales linearly with the phone width, so one
     measurement gives the answer; CSS eases --pw-fit to it. */
  /* Returns the target phone width (reads only); apply() writes it. */
  measure() {
    if (this.el.classList.contains('is-focus')) return null;
    const stacked = window.matchMedia('(max-width: 999px)').matches;
    const cs = getComputedStyle(this.el);
    const avail = viewportH() - headerH();
    const area = this.el.querySelector('.phone-area');
    const phoneW = this.el.querySelector('.phone').offsetWidth;
    if (!phoneW || !area.offsetHeight) return null;
    const inner = this.el.querySelector('.hero-inner');
    const ics = getComputedStyle(inner);
    const content = stacked
      ? inner.offsetHeight
      : this.el.querySelector('.hero-stage').offsetHeight + parseFloat(ics.paddingTop) + parseFloat(ics.paddingBottom);
    // The phone's grid row can be taller than the phone (a long trace beside it on phones):
    // measure that whole row, so only the phone-driven part scales.
    const a = area.getBoundingClientRect();
    let rowBottom = a.bottom;
    if (stacked) this.el.querySelectorAll('.progress, .controls, .trace-wrap').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height && r.width > 1 && r.top >= a.top - 2 && r.top < a.bottom) rowBottom = Math.max(rowBottom, r.bottom);
    });
    let rowExtra = rowBottom - a.bottom;
    // Desktop with the trace open: a trace taller than the phone column is a fixed cost, not phone-driven.
    const tw = this.el.querySelector('.trace-wrap');
    if (!stacked && tw.offsetWidth > 1) {
      const colBottom = this.el.querySelector('.controls').getBoundingClientRect().bottom;
      rowExtra = Math.max(0, tw.getBoundingClientRect().bottom - colBottom);
    }
    const other = content + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) - area.offsetHeight - rowExtra;
    // Tall screens (tablets in portrait, big monitors) may use a larger phone so the hero is not lost in space.
    const baseMax = stacked ? 230 : ({ 2: 236, 4: 244, 5: 244 }[this.v] || 250);
    const max = Math.max(baseMax, Math.min(stacked ? 300 : 330, avail * (stacked ? 0.27 : 0.3)));
    const min = stacked ? 104 : 120;
    return Math.floor(Math.max(min, Math.min(max, (avail - other - 14) / (area.offsetHeight / phoneW))));
  }

  apply(target) {
    if (target == null) return;
    const cur = parseFloat(this.el.style.getPropertyValue('--pw-fit'));
    if (Math.abs(cur - target) >= 1 || Number.isNaN(cur)) this.el.style.setProperty('--pw-fit', `${target}px`);
  }

  /* Real-video swap point. Replace the <div data-demo-media> in index.html with
     <video data-demo-media muted playsinline loop autoplay preload="none" aria-hidden="true"></video>
     and fill `video: { webm, mp4, poster }` on each journey. Beats, progress and trace
     then follow video.currentTime instead of the internal clock. */
  setMedia(j) {
    if (this.isVideo()) {
      const v = j.video || {};
      this.media.poster = v.poster || '';
      this.media.innerHTML = [v.webm && `<source src="${v.webm}" type="video/webm">`, v.mp4 && `<source src="${v.mp4}" type="video/mp4">`].filter(Boolean).join('');
      this.media.load();
      return;
    }
    this.media.innerHTML = j.beats.map((b, i) => `<div class="screen" data-beat="${i}">${b.scr()}</div>`).join('');
    this.screens = [...this.media.children];
  }

  render() {
    const j = this.journey;
    const n = j.beats.length;
    const beatLen = this.loopMs() / n;

    this.chips.setAttribute('aria-label', L(UI.journeys));
    this.chips.innerHTML = JOURNEY_ORDER.map((id) =>
      `<button type="button" class="chip" data-j="${id}" aria-pressed="${id === this.jid}">${ic(JOURNEYS[id].icon)}<span>${L(JOURNEYS[id].chip)}</span></button>`).join('');

    const c1 = L(j.copy[0]);
    this.h2.innerHTML = c1.includes('<') ? c1 : c1.split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
    this.c2.innerHTML = L(j.copy[1]);
    this.c3.innerHTML = L(j.copy[2]);

    const k = j.kpi;
    this.kpi.classList.toggle('is-method', !!k.method);
    this.kpi.innerHTML = bub(k.icon) +
      `<span class="kpi-biz"><span class="kpi-label">${L(k.label)}</span><strong class="kpi-val">${L(k.value)}</strong><span class="kpi-note">${L(k.note)}${k.method ? '' : ' ¹'}</span></span>` +
      `<span class="kpi-tech"><span class="kpi-label">${L(UI.svc)}: <strong>${j.trace.length}</strong></span><span class="kpi-label">${L(UI.latency)}: <strong>${ph('420 ms')}</strong></span><span class="kpi-label">${L(UI.deploy)}: <strong>${L(UI.toConfirm)}</strong></span></span>`;
    this.foot.innerHTML = `<span class="foot-biz">${L(j.foot)}</span><span class="foot-tech">${L(UI.techFoot)}</span>`;

    // HTML screens carry text, so they rebuild on journey or language change; a video only on journey change.
    const mediaKey = this.isVideo() ? this.jid : `${this.jid}:${state.lang}`;
    if (mediaKey !== this.mediaKey) { this.setMedia(j); this.mediaKey = mediaKey; }
    this.phoneFig.setAttribute('aria-label', `${L(UI.demo)}: ${L(j.chip)}`);

    this.steps.setAttribute('aria-label', L(UI.progress));
    this.steps.innerHTML = j.beats.map((b) => `<li><span class="st-bar"><i></i></span><span class="st-l">${L(b.step)}</span></li>`).join('');
    this.stepEls = [...this.steps.children];

    this.traceAt = j.trace.map((t) => (t.at[0] + t.at[1]) * beatLen);
    this.traceList.innerHTML = j.trace.map((t) =>
      `<li class="tr-item"><span class="tr-dot" aria-hidden="true"></span><span class="tr-label">${L(t.label)}</span><time class="tr-time">--:--</time></li>`).join('');
    this.traceItems = [...this.traceList.children];

    this.beat = -1;
    this.lit = -1;
    this.lastT = this.elapsed;
    this.syncPause();
    this.update();
  }

  syncPause() {
    const label = L(this.paused ? UI.play : UI.pause);
    this.pauseBtn.setAttribute('aria-label', label);
    this.pauseBtn.title = label;
    this.pauseBtn.dataset.state = this.paused ? 'paused' : 'playing';
    this.el.classList.toggle('is-paused', this.paused);
    if (this.isVideo()) (this.paused || !this.visible) ? this.media.pause() : this.media.play().catch(() => {});
  }

  tick(dt) {
    if (!this.visible || this.paused) return;
    this.elapsed = this.isVideo() ? this.media.currentTime * 1000 : (this.elapsed + dt) % LOOP_MS;
    this.update();
  }

  update() {
    const j = this.journey;
    const t = this.elapsed;
    const n = j.beats.length;
    const loop = this.loopMs();
    const beatLen = loop / n;
    const beat = Math.min(n - 1, Math.floor(t / beatLen));
    const reduce = reduceMotion.matches;
    // Reduced motion: bars step per beat instead of sliding every frame.
    this.fill.style.transform = `scaleX(${reduce ? (beat + 1) / n : t / loop})`;

    if (beat !== this.beat || t < this.lastT) {
      this.beat = beat;
      if (this.screens) this.screens.forEach((s, i) => {
        s.classList.toggle('is-active', i === beat);
        s.toggleAttribute('inert', i !== beat);
      });
      this.stepEls.forEach((li, i) => {
        li.classList.toggle('is-done', i < beat);
        li.style.removeProperty('--p');
        if (i === beat) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      const b = j.beats[beat];
      const cap = L(b.cap);
      this.cap.textContent = cap;
      this.srCap.textContent = `${L(UI.step)} ${beat + 1} ${L(UI.of)} ${n}: ${cap}`;
      this.toast.innerHTML = `${bub(b.icon)}<span class="toast-x"><b>${L(b.step)}</b><small>${L(UI.step)} ${beat + 1} ${L(UI.of)} ${n}</small></span>`;
      restart(this.el, 'is-beat');
    }
    // Segmented progress: the current step's bar fills across its beat.
    this.stepEls[beat].style.setProperty('--p', reduce ? 1 : ((t - beat * beatLen) / beatLen).toFixed(3));

    let lit = 0;
    while (lit < this.traceAt.length && t >= this.traceAt[lit]) lit++;
    if (lit !== this.lit) {
      this.traceItems.forEach((li, i) => {
        const on = i < lit;
        li.classList.toggle('is-lit', on);
        li.classList.toggle('is-now', i === lit - 1);
        li.querySelector('.tr-time').textContent = on ? fmt(this.traceAt[i]) : '--:--';
      });
      this.lit = lit;
    }
    this.lastT = t;
  }
}

/* --------------------------------------------------------------- global state */
const heroes = [];
/* Screen height for fitting: the small viewport (100svh, same as the CSS), so mobile toolbars
   showing/hiding don't resize the phones mid-scroll. Header height excludes the open mobile menu. */
let svhProbe = null;
const viewportH = () => {
  if (!svhProbe) {
    svhProbe = document.createElement('div');
    svhProbe.setAttribute('aria-hidden', 'true');
    svhProbe.style.cssText = 'position:fixed;inset:0 auto auto 0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(svhProbe);
  }
  return svhProbe.offsetHeight || window.innerHeight;
};
let closedHeaderH = 0;
const headerH = () => {
  const header = document.querySelector('.site-header');
  const open = document.getElementById('nav-panel').classList.contains('is-open');
  if (!open || !closedHeaderH) closedHeaderH = header.offsetHeight; // remembered while the menu is closed
  return closedHeaderH;
};
// Re-fit heroes to the screen: batched in one frame (all reads, then all writes), and once more
// after the CSS transitions (trace column, phone size) have settled.
let fitRaf = 0;
let fitTimer = 0;
let fitOnly = null;
function runFit(list) {
  const targets = list.map((h) => h.measure());
  list.forEach((h, i) => h.apply(targets[i]));
}
function scheduleFit(only) {
  fitOnly = fitRaf ? (fitOnly === only ? only : null) : (only || null);
  if (!fitRaf) {
    fitRaf = requestAnimationFrame(() => {
      fitRaf = 0;
      const list = fitOnly ? [fitOnly] : heroes;
      runFit(list);
      clearTimeout(fitTimer);
      fitTimer = setTimeout(() => runFit(list), 900);
    });
  }
}
const root = document.documentElement;

function applyI18n() {
  document.title = L(UI.title);
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = L(UI[el.dataset.i18n]); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', L(UI[el.dataset.i18nAria])); });
  document.querySelectorAll('[data-opt-n]').forEach((el) => { el.textContent = `${L(UI.option)} ${el.dataset.optN}`; });
}

function setLang(lang) {
  state.lang = lang;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('button[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  applyI18n();
  heroes.forEach((h) => h.render());
  scheduleFit();
  store.set('lang', lang);
  document.dispatchEvent(new CustomEvent('aion:lang', { detail: lang }));
}

function setLens(lens) {
  state.lens = lens;
  root.dataset.lens = lens;
  document.querySelectorAll('button[data-lens]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens === lens)));
  store.set('lens', lens);
  document.dispatchEvent(new CustomEvent('aion:lens', { detail: lens }));
}

/* FLIP: layout changes (grid tracks, areas) snap in CSS, so record where each part sits, apply the
   change, then glide every part from its old place to its new one. */
const FLIP_PARTS = '.chips, .phone-fig, .progress, .controls, .copy-1, .copy-2, .copy-3, .ctas, .foot';
function flip(els, mutate) {
  const first = els.map((el) => el.getBoundingClientRect()); // includes any glide still in flight
  mutate();
  if (reduceMotion.matches) return;
  els.forEach((el) => { el.style.transition = 'none'; el.style.transform = 'none'; });
  const moved = [];
  els.forEach((el, i) => {
    // Compare centres: a part may change width as its column changes.
    const last = el.getBoundingClientRect();
    // Parts that appear or disappear (display: none) have no position to glide from or to.
    if ((!first[i].width && !first[i].height) || (!last.width && !last.height)) { el.style.transition = ''; el.style.transform = ''; return; }
    const dx = (first[i].left + first[i].width / 2) - (last.left + last.width / 2);
    const dy = first[i].top - last.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) { el.style.transition = ''; el.style.transform = ''; return; }
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    moved.push(el);
  });
  if (!moved.length) return;
  void document.body.offsetWidth;
  moved.forEach((el) => {
    el.style.transition = 'transform .75s cubic-bezier(.22, .8, .24, 1)';
    el.style.transform = '';
    const done = (e) => {
      if (e && (e.target !== el || e.propertyName !== 'transform')) return; // ignore bubbling child transitions
      el.style.transition = '';
      el.removeEventListener('transitionend', done);
    };
    el.addEventListener('transitionend', done);
    setTimeout(done, 900);
  });
}

function setBehind(on) {
  const visibleParts = heroes.filter((h) => h.visible && h.settled).flatMap((h) => [...h.el.querySelectorAll(FLIP_PARTS)]);
  flip(visibleParts, () => {
    state.behind = on;
    root.dataset.behind = on ? 'on' : 'off';
  });
  heroes.forEach((h) => {
    h.sw.setAttribute('aria-checked', String(on));
    h.trace.toggleAttribute('inert', !on);
    h.trace.setAttribute('aria-hidden', String(!on));
  });
  scheduleFit();
  store.set('behind', on ? '1' : '0');
}

function setTheme(theme) {
  state.theme = theme;
  if (theme === 'auto') delete root.dataset.theme; else root.dataset.theme = theme;
  document.querySelectorAll('button[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
  store.set('theme', theme);
}

/* ---------------------------------------------------------------------- boot */
function init() {
  const tpl = document.getElementById('hero-tpl');
  const main = document.getElementById('heroes');
  // Which designs to render: the landing page uses one ("1"); /mockups renders all five.
  const versions = (main.dataset.versions || '1,2,3,4,5').split(',').map(Number);
  versions.forEach((v) => {
    const frag = tpl.content.cloneNode(true);
    const sec = frag.querySelector('.hero');
    sec.id = main.dataset.heroId && versions.length === 1 ? main.dataset.heroId : `option-${v}`;
    sec.dataset.v = v;
    main.appendChild(frag);
    heroes.push(new Hero(main.lastElementChild, v));
  });

  // Calm entrance once; demos and CSS loops pause while off screen.
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const h = heroes.find((x) => x.el === e.target);
    h.visible = e.isIntersecting;
    if (e.isIntersecting && !h.el.classList.contains('is-in')) {
      h.el.classList.add('is-in');
      setTimeout(() => { h.settled = true; }, 1500); // FLIP only after the entrance has finished
    }
    h.el.classList.toggle('is-onscreen', e.isIntersecting);
    if (h.isVideo()) (e.isIntersecting && !h.paused) ? h.media.play().catch(() => {}) : h.media.pause();
  }), { threshold: 0.15 });
  heroes.forEach((h) => io.observe(h.el));

  document.querySelectorAll('button[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  document.querySelectorAll('button[data-lens]').forEach((b) => b.addEventListener('click', () => setLens(b.dataset.lens)));
  document.querySelectorAll('button[data-theme-set]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));

  // Anchor jumps land exactly under the sticky header, whatever its height at this width.
  const header = document.querySelector('.site-header');
  // Height without the open mobile menu, so opening it doesn't resize every hero.
  new ResizeObserver(() => { root.style.setProperty('--header-h', `${headerH()}px`); scheduleFit(); }).observe(header);
  let lastW = window.innerWidth;
  let lastH = viewportH();
  window.addEventListener('resize', () => {
    // Mobile toolbars change innerHeight but not the small viewport: ignore those.
    if (window.innerWidth === lastW && viewportH() === lastH) return;
    lastW = window.innerWidth;
    lastH = viewportH();
    scheduleFit();
  });
  document.fonts.ready.then(() => scheduleFit());
  document.fonts.addEventListener('loadingdone', () => scheduleFit()); // e.g. Arabic fonts arrive after a language switch

  // Booking dialog (two fields only, per the script)
  const dlg = document.getElementById('booking');
  const form = dlg.querySelector('form');
  const doneEl = dlg.querySelector('.dlg-done');

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const panel = document.getElementById('nav-panel');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dlg.open && panel.classList.contains('is-open')) {
      menuBtn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
      menuBtn.focus();
    }
  });
  // Placeholder menu items: no destinations yet.
  document.querySelectorAll('.nav-list a[href="#"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));

  let opener = null;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open-booking]');
    if (!b) return;
    opener = b;
    form.hidden = false;
    doneEl.hidden = true;
    form.reset();
    dlg.showModal();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.hidden = true;
    doneEl.hidden = false;
    doneEl.querySelector('.dlg-close').focus();
  });
  dlg.querySelectorAll('.dlg-close').forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => opener && opener.focus());

  const pick = (k, allowed) => (allowed.includes(store.get(k)) ? store.get(k) : allowed[0]);
  setTheme(pick('theme', ['auto', 'light', 'dark']));
  setLens(pick('lens', ['business', 'technical']));
  setLang(pick('lang', ['en', 'ar']));
  setBehind(store.get('behind') === '1');

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(100, now - last);
    last = now;
    heroes.forEach((h) => h.tick(dt));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', init);

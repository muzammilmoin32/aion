'use strict';

/*
 * Aion landing page (index.html): every section below the hero.
 * Uses globals from app.js: T, P, ph, L, state, UI, JOURNEYS, heroes, Hero, setLens, ic, bub, reduceMotion.
 * Source of truth for every string: "Aion Website The Script.docx" (Homepage scroll by scroll,
 * Navigation, Demo library, Under the hood, Proof). [Bracketed] = placeholder the script leaves open.
 *
 * ARABIC REVIEW: every `ar` string in this file is a draft translation and MUST be reviewed by a
 * native Saudi Arabic reader before publishing.
 */

/* ------------------------------------------------------------------ static strings (data-l="key") */
const LS = {
  h1: T('Aion Digital', 'Aion Digital'),
  skip: T('Skip to content', 'انتقل إلى المحتوى'),
  railsLabel: T('The rails Saudi banks know', 'القنوات التي تعرفها البنوك السعودية'),
  jEyebrow: T('Demo library', 'مكتبة العروض'),
  jTitle: T('Pick your journey', 'اختر رحلتك'),
  jSub: T('Every card is a 6-second loop. Open one for the full 30-second demo.', 'كل بطاقة مقطع متكرر مدته 6 ثوانٍ. افتح أيًّا منها لمشاهدة العرض الكامل في 30 ثانية.'),
  segLabel: T('Segment', 'الشريحة'),
  lEyebrow: T('The Aion layer', 'طبقة Aion'),
  lTitle: T('What sits behind every screen', 'ما الذي يقف خلف كل شاشة'),
  lTop: T("The bank's apps and channels", 'تطبيقات البنك وقنواته'),
  lCore: T('Your existing core', 'نظامك المصرفي الأساسي الحالي'),
  lUnchanged: T('unchanged', 'دون تغيير'),
  lQuote: T('Your core stays. We add the layer that makes it move.', 'نظامك الأساسي يبقى. ونحن نضيف الطبقة التي تحرّكه.'),
  vEyebrow: T('Business view · Technical view', 'عرض الأعمال · العرض التقني'),
  vTitle: T('One site, two readers', 'موقع واحد، وقارئان'),
  vBody: T('Business view shows KPI captions on every demo. Technical view swaps them for architecture captions: services called, latency, deployment pattern. No separate microsite.',
    'عرض الأعمال يُظهر مؤشرات الأداء على كل عرض توضيحي. والعرض التقني يستبدلها بتعليقات معمارية: الخدمات المستدعاة، وزمن الاستجابة، ونمط النشر. دون موقع منفصل.'),
  vCxo: T('Bank CXOs (CEO, Head of SME, Head of Retail, CDO). They give us 10 seconds and want an outcome.', 'الإدارة التنفيذية في البنوك (الرئيس التنفيذي، رئيس قطاع المنشآت، رئيس قطاع الأفراد، رئيس التحول الرقمي). يمنحوننا 10 ثوانٍ ويريدون نتيجة.'),
  vCto: T('Bank CTOs, CIOs and architects. They want proof it is real and modern, and will dig.', 'رؤساء التقنية والمعلومات والمعماريون في البنوك. يريدون دليلًا على أنه حقيقي وحديث، وسيتعمقون.'),
  vCardBiz: T('What a CXO sees', 'ما يراه التنفيذي'),
  vCardTech: T('What a CTO sees', 'ما يراه التقني'),
  pEyebrow: T('Under the hood', 'تحت الغطاء'),
  pTitle: T('Start from any journey. Drill down three levels.', 'ابدأ من أي رحلة. وتعمّق ثلاثة مستويات.'),
  pArch: T('The platform, layer by layer', 'المنصة، طبقة تلو طبقة'),
  pDraft: T('Draft. Every technical statement is reviewed by the technology lead and checked against what runs in production before publishing.',
    'مسودة. يراجع مسؤول التقنية كل عبارة تقنية، وتُطابَق مع ما يعمل فعليًا قبل النشر.'),
  nTitle: T('Aion in four numbers', 'Aion في أربعة أرقام'),
  nSource: T('Source: Aion company facts, ' + ph('sample source line'), 'المصدر: حقائق الشركة، ' + ph('سطر مصدر نموذجي')),
  obEyebrow: T('Open banking', 'المصرفية المفتوحة'),
  obTitle: T('Show the product, not the pipe.', 'اعرض المنتج، لا الأنابيب.'),
  obBody: T('Nobody buys "account information services." They buy a faster credit decision.', 'لا أحد يشتري «خدمات معلومات الحسابات». بل يشتري قرار ائتمان أسرع.'),
  obBody2: T("Engage and Nomou can also run on the bank's own data first, without open banking; consent then widens the view to other banks.", 'يمكن لـ Engage وNomou العمل أولًا على بيانات البنك نفسه دون المصرفية المفتوحة، ثم توسّع الموافقة الرؤية لتشمل بنوكًا أخرى.'),
  aiTitle: T('Show the decision, not the model.', 'اعرض القرار، لا النموذج.'),
  aiBody: T('Every Ai966 demo ends with a person making a better decision, and the result measured against a holdout group.', 'كل عرض من Ai966 ينتهي بشخص يتخذ قرارًا أفضل، مع قياس النتيجة مقارنةً بمجموعة ضابطة.'),
  aiBody2: T('All demos run on fictional data. No uplift figure appears until it is measured at a bank.', 'تعمل كل العروض على بيانات خيالية. ولا يظهر أي رقم تحسّن قبل قياسه في بنك.'),
  thisGroup: T('This group', 'هذه المجموعة'),
  holdout: T('Holdout group', 'المجموعة الضابطة'),
  result: T('Measured at the bank', 'تُقاس لدى البنك'),
  prEyebrow: T('Proof', 'الإثبات'),
  prTitle: T('Our network', 'شبكتنا'),
  prSub: T('Banks and technology partners in the Aion network.', 'بنوك وشركاء تقنيون ضمن شبكة Aion.'),
  prQuote: T('“' + ph('We opened business accounts for multi-owner LLCs with no branch visit and no paper.') + '”', '«' + ph('فتحنا حسابات تجارية لشركات متعددة الشركاء دون زيارة فرع ودون ورق.') + '»'),
  prBank: T(ph('Sample quote') + ' · Head of SME Banking, a Top 5 Saudi bank', ph('اقتباس نموذجي') + ' · رئيس الخدمات المصرفية للمنشآت، أحد أكبر خمسة بنوك سعودية'),
  sEyebrow: T('Velocity', 'وتيرة الإطلاق'),
  sTitle: T('Shipped this month', 'ما أطلقناه هذا الشهر'),
  sNote: T('Updated monthly, owned by the product team. The entries below are samples.', 'يُحدَّث شهريًا، ويتولاه فريق المنتج. البنود أدناه نماذج.'),
  cTitle: T('See it on your own journeys in 20 minutes.', 'شاهده على رحلاتك أنت خلال 20 دقيقة.'),
  fOffices: T('Offices', 'المكاتب'),
  fRiyadh: T('Riyadh', 'الرياض'),
  fManama: T('Manama', 'المنامة'),
  fKarachi: T('Karachi', 'كراتشي'),
  fLicences: T('Licensed by SAMA (Saudi Arabia), CBB (Bahrain) and FCA (UK). ' + ph('Sample wording, checked with compliance before launch.'), 'مرخّصة من ساما (السعودية) ومصرف البحرين المركزي وهيئة السلوك المالي (المملكة المتحدة). ' + ph('صياغة نموذجية تُراجع مع الامتثال قبل الإطلاق.')),
  fMockups: T('Hero section mockups', 'نماذج الواجهة الرئيسية'),
  fTheme: T('Theme', 'المظهر'),
  ddEyebrow: T('Demo library', 'مكتبة العروض'),
  dd30: T('The 30 seconds', 'الثواني الثلاثون'),
  ddKpi: T('Board KPI', 'مؤشر مجلس الإدارة'),
  ddVideo: T('Storyboard preview. The 30-second video follows in production.', 'معاينة القصة المصوّرة. يلي ذلك الفيديو ومدته 30 ثانية.'),
  pause: T('Pause storyboard', 'إيقاف القصة المصوّرة مؤقتًا'),
  play: T('Play storyboard', 'تشغيل القصة المصوّرة'),
  pAria: T('Open banking and Ai966', 'المصرفية المفتوحة وAi966'),
  ddPreview: T('Concept preview until the product is built. Shown on a laptop, not a phone.', 'معاينة لمفهوم حتى يُبنى المنتج. تُعرض على حاسوب محمول، لا على جوال.'),
  ddTech: T('Leads in the Technical view.', 'يتصدّر في العرض التقني.'),
  close: T('Close', 'إغلاق'),
  vidTag: T('Sample video', 'فيديو نموذجي'),
};

/* ------------------------------------------------------------------ navigation (script: "Navigation") */
const NAV = [
  { id: 'solutions', label: T('Solutions', 'الحلول'), cols: [
    { h: T('SME', 'المنشآت'), go: 'seg:sme', items: [
      [T('Digital onboarding (LLC, multi-owner, sole proprietor)', 'فتح الحسابات رقميًا (ذات مسؤولية محدودة، متعددة الشركاء، مؤسسة فردية)'), 'card:sme-onb'],
      [T('Business accounts and sub-accounts', 'الحسابات التجارية والحسابات الفرعية'), 'seg:sme'],
      [T('Bulk payroll (Mudad/WPS)', 'الرواتب المجمّعة (مدد/حماية الأجور)'), 'card:payroll'],
      [T('SADAD and government payments', 'سداد والمدفوعات الحكومية'), 'card:sadad'],
      [T('SME cards and spend management', 'بطاقات المنشآت وإدارة الإنفاق'), 'card:cards'],
      [T('Financing request journey', 'رحلة طلب التمويل'), 'card:fin-req'],
      [T("Banking inside the SME's ERP", 'الخدمات المصرفية داخل نظام تخطيط الموارد للمنشأة'), 'card:erp'],
    ] },
    { h: T('Retail', 'الأفراد'), go: 'seg:retail', items: [
      [T('Onboarding with Nafath', 'فتح الحساب عبر نفاذ'), 'card:retail-onb'],
      [T('Accounts and instant transfers', 'الحسابات والتحويلات الفورية'), 'seg:retail'],
      [T('Cards and wallet', 'البطاقات والمحفظة'), 'seg:retail'],
      [T('Personal finance view', 'عرض المالية الشخصية'), 'card:engage'],
    ] },
    { h: T('Corporate', 'الشركات'), go: 'seg:corporate', items: [
      [T('Bulk payments with maker-checker approval', 'المدفوعات المجمّعة باعتماد المُدخِل والمُعتمِد'), 'card:supplier'],
      [T('Liquidity and cash view', 'عرض السيولة والنقد'), 'card:corp-appr'],
      [T('Approvals on mobile', 'الاعتمادات من الجوال'), 'card:corp-appr'],
      [T('ERP and host-to-host connectivity', 'الربط مع نظام تخطيط الموارد والربط المباشر بين الأنظمة'), 'card:erp'],
    ] },
    { h: T('Wallets and BaaS', 'المحافظ والخدمات المصرفية كخدمة'), go: 'seg:ob', items: [
      [T('White-label wallets', 'محافظ بعلامة بيضاء'), 'card:telco'],
      [T('Banking as a service for telcos, fintechs and corporates', 'الخدمات المصرفية كخدمة لشركات الاتصالات والتقنية المالية والشركات'), 'card:telco'],
    ] },
  ] },
  { id: 'intel', label: T('Intelligence (Ai966)', 'الذكاء (Ai966)'), cols: [{ items: [
    [T('Early warning', 'الإنذار المبكر'), 'card:ews'],
    [T('Next best product', 'المنتج الأنسب التالي'), 'card:nbp'],
    [T('Customers hiding in the payment file', 'عملاء مختبئون في ملف المدفوعات'), 'card:hiding'],
    [T('Retention', 'الاحتفاظ بالعملاء'), 'card:retention'],
    [T('Capital allocation (preview)', 'توزيع رأس المال (معاينة)'), 'card:capital'],
    [T('Policy copilot', 'مساعد السياسات'), 'card:copilot'],
    [T('How every result is measured', 'كيف تُقاس كل نتيجة'), '#principles'],
  ] }] },
  { id: 'ob', label: T('Open Banking', 'المصرفية المفتوحة'), cols: [{ items: [
    [T('SME cash-flow lending', 'تمويل المنشآت بالتدفقات النقدية'), 'card:lending'],
    [T('Mortgage affordability', 'القدرة على تحمّل التمويل العقاري'), 'card:mortgage'],
    [T('Engage (personal finance)', 'Engage (المالية الشخصية)'), 'card:engage'],
    [T('Nomou (business finance)', 'Nomou (مالية الأعمال)'), 'card:nomou'],
    [T('Consent and compliance', 'الموافقات والامتثال'), 'card:consent'],
    [T('Embedded finance in ERP', 'التمويل المدمج في نظام تخطيط الموارد'), 'card:erp'],
    [T('Our licences (SAMA, CBB, FCA)', 'تراخيصنا (ساما، مصرف البحرين المركزي، هيئة السلوك المالي)'), '#principles'],
  ] }] },
  { id: 'platform', label: T('Platform', 'المنصة'), cols: [{ items: [
    [T('Rubix architecture', 'بنية Rubix'), '#platform'],
    [T('API catalogue', 'دليل واجهات البرمجة'), '#platform'],
    [T('Security and compliance', 'الأمن والامتثال'), '#platform'],
    [T('Deployment options', 'خيارات النشر'), '#platform'],
  ] }] },
  { id: 'company', label: T('Company', 'الشركة'), cols: [{ items: [
    [T('About', 'من نحن'), '#numbers'],
    [T('Leadership and board', 'القيادة ومجلس الإدارة'), '#contact'],
    [T('Careers', 'الوظائف'), '#contact'],
    [T('Aion Connect', 'Aion Connect'), '#contact'],
    [T('Contact', 'تواصل معنا'), '#contact'],
  ] }] },
];

/* ------------------------------------------------------------------ demo library (script: "Demo library") */
const SEGMENTS = [
  ['all', T('All', 'الكل')],
  ['sme', T('SME', 'المنشآت')],
  ['retail', T('Retail', 'الأفراد')],
  ['corporate', T('Corporate', 'الشركات')],
  ['ai', T('AI (Ai966)', 'الذكاء الاصطناعي (Ai966)')],
  ['ob', T('Open banking and embedded finance', 'المصرفية المفتوحة والتمويل المدمج')],
];
const WAVES = {
  w1: T('Wave 1 · at launch', 'الموجة 1 · عند الإطلاق'),
  w2: T('Wave 2', 'الموجة 2'),
  preview: T('Preview', 'معاينة'),
};
const S = (en, ar) => T(en, ar);
// built: id of a fully animated journey in app.js (opens the live demo); others open the storyboard.
const CARDS = [
  { id: 'sme-onb', segs: ['sme'], built: 'sme', icon: 'building', wave: 'w1', title: S('SME onboarding: three-owner LLC', 'فتح حساب منشأة: شركة بثلاثة شركاء'),
    kpi: S('Time to account', 'الوقت حتى فتح الحساب') },
  { id: 'payroll', segs: ['sme'], built: 'payroll', icon: 'users', wave: 'w1', title: S('Bulk payroll', 'الرواتب المجمّعة'), kpi: S('Errors caught before release', 'أخطاء اكتُشفت قبل الصرف') },
  { id: 'sadad', segs: ['sme'], built: 'sadad', icon: 'receipt', wave: 'w1', title: S('SADAD and government payments', 'سداد والمدفوعات الحكومية'), kpi: S('Share of SME payments moved to digital', 'حصة مدفوعات المنشآت المنتقلة إلى الرقمية') },
  { id: 'lending', segs: ['sme', 'ob'], built: 'lending', icon: 'chart', wave: 'w1', title: S('SME cash-flow lending', 'تمويل المنشآت بالتدفقات النقدية'), kpi: S('Time to credit decision', 'الوقت حتى قرار الائتمان') },
  { id: 'ews', segs: ['ai'], built: 'ews', icon: 'spark', wave: 'w1', title: S('RM early warning (Ai966)', 'الإنذار المبكر لمدير العلاقة (Ai966)'), kpi: S('Measured against a holdout group', 'تُقاس مقارنةً بمجموعة ضابطة') },
  { id: 'supplier', segs: ['corporate', 'sme'], icon: 'send', wave: 'w1', title: S('Supplier bulk payments', 'مدفوعات الموردين المجمّعة'),
    line: S('A batch of supplier payments routed automatically to the cheapest and fastest rail, with a cash view before and after.', 'دفعة من مدفوعات الموردين تُوجَّه تلقائيًا إلى أرخص وأسرع قناة دفع، مع عرض للنقد قبل الدفع وبعده.'),
    kpi: S('Cost per transaction', 'تكلفة المعاملة') },
  { id: 'cards', segs: ['sme'], built: 'cards', icon: 'card', wave: 'w2', title: S('SME cards and spend', 'بطاقات المنشآت والإنفاق'),
    line: S('Owner issues cards to five staff, sets limits by category, receipts captured, everything syncs to the ERP.', 'المالك يصدر بطاقات لخمسة موظفين، ويحدد الحدود حسب الفئة، وتُلتقط الإيصالات، ويتزامن كل شيء مع نظام تخطيط الموارد.'),
    kpi: S('Card spend per SME, cost to serve', 'إنفاق البطاقات لكل منشأة، وتكلفة الخدمة') },
  { id: 'fin-req', segs: ['sme'], icon: 'file', wave: 'w2', title: S('SME financing request', 'طلب تمويل المنشأة'),
    line: S("Offer pre-built from the SME's own transactions and SIMAH, owner accepts, funds land.", 'عرض مُعدّ مسبقًا من معاملات المنشأة نفسها ومن سمة، يقبله المالك، وتصل الأموال.'),
    kpi: S('Time to decision', 'الوقت حتى القرار') },
  { id: 'erp', segs: ['sme', 'ob'], icon: 'layers', wave: 'w2', title: S('Banking inside the ERP', 'الخدمات المصرفية داخل نظام تخطيط الموارد'),
    line: S('Inside SAP, the SME sees its balance, pays a supplier, and gets a financing offer on an invoice.', 'داخل SAP، ترى المنشأة رصيدها، وتدفع لمورد، وتحصل على عرض تمويل على فاتورة.'),
    kpi: S('New SMEs acquired through the ERP channel', 'منشآت جديدة مكتسبة عبر قناة نظام تخطيط الموارد') },
  { id: 'retail-onb', segs: ['retail'], icon: 'shield', wave: 'w2', title: S('Retail onboarding', 'فتح حسابات الأفراد'),
    line: S('Nafath to funded account to first instant transfer.', 'من نفاذ إلى حساب مموَّل إلى أول تحويل فوري.'),
    kpi: S('Time to first transaction', 'الوقت حتى أول معاملة') },
  { id: 'corp-appr', segs: ['corporate'], icon: 'check', wave: 'w2', title: S('Corporate approvals', 'موافقات الشركات'),
    line: S('Treasurer reviews a bulk batch with liquidity view, approves maker-checker on mobile.', 'أمين الخزينة يراجع دفعة مجمّعة مع عرض السيولة، ويعتمدها بنظام المُدخِل والمُعتمِد من الجوال.'),
    kpi: S('Approval cycle time', 'زمن دورة الاعتماد') },
  { id: 'telco', segs: ['retail', 'ob'], icon: 'phone', wave: 'w2', title: S('Wallet for a telco', 'محفظة لشركة اتصالات'),
    line: S('White-label wallet launched under a telco brand: top-up, pay, transfer.', 'محفظة بعلامة بيضاء تُطلق باسم شركة اتصالات: شحن، ودفع، وتحويل.'),
    kpi: S('Time to launch a new brand', 'الوقت لإطلاق علامة جديدة') },
  { id: 'ob-cash', segs: ['sme', 'ob'], icon: 'link', wave: 'w2', title: S('Open banking cash view', 'عرض النقد عبر المصرفية المفتوحة'),
    line: S('SME connects accounts at two other banks with consent, sees one cash position.', 'المنشأة تربط حساباتها في بنكين آخرين بموافقتها، وترى مركزًا نقديًا واحدًا.'),
    kpi: S('Share of wallet visibility', 'نسبة الرؤية لحصة المحفظة') },
  { id: 'mortgage', segs: ['retail', 'ob'], icon: 'building', wave: 'w2', title: S('Mortgage affordability', 'القدرة على تحمّل التمويل العقاري'),
    copy: [S('Verified income and commitments from every account the applicant holds.', 'دخل والتزامات موثّقة من كل حساب يملكه المتقدّم.'),
      S('Affordability decided in minutes, evidence attached.', 'تُحسم القدرة على السداد في دقائق، مع الأدلة.'),
      S('No salary certificates, no stamped statements.', 'بلا تعريفات رواتب، وبلا كشوف مختومة.')],
    beats: [S('Applicant shares the salary account held at another bank', 'المتقدّم يشارك حساب الراتب في بنك آخر'),
      S('Verified salary, existing commitments, monthly spending', 'راتب موثّق، والالتزامات القائمة، والإنفاق الشهري'),
      S('Affordability and maximum amount', 'القدرة على السداد والحد الأقصى للمبلغ'),
      S("The underwriter's view shows the evidence behind the number", 'شاشة المُقيِّم تعرض الأدلة وراء الرقم')],
    kpi: S('Time to approval in principle', 'الوقت حتى الموافقة المبدئية') },
  { id: 'engage', segs: ['retail', 'ob'], icon: 'chart', wave: 'w2', title: S('Engage, personal finance', 'Engage، المالية الشخصية'),
    copy: [S('Every account the customer holds, inside your app.', 'كل حسابات العميل داخل تطبيقك.'),
      S('Spending sorted, goals tracked, nudges that help.', 'إنفاق مصنّف، وأهداف متابَعة، وتنبيهات مفيدة.'),
      S('The bank becomes where they manage money, not just keep it.', 'يصبح البنك المكان الذي يديرون فيه أموالهم، لا مجرد مكان لحفظها.')],
    beats: [S('Retail customer links accounts across banks', 'عميل فرد يربط حساباته في عدة بنوك'),
      S('One balance, spending sorted by category', 'رصيد واحد، وإنفاق مصنّف حسب الفئة'),
      S('Sets a goal (school fees, Umrah) with a monthly plan', 'يحدد هدفًا (رسوم المدرسة، العمرة) بخطة شهرية'),
      S('A gentle nudge when spending drifts', 'تنبيه لطيف عند انحراف الإنفاق'),
      S('A savings product offered at the right moment', 'عرض منتج ادخار في الوقت المناسب')],
    kpi: S('Monthly active use of the app', 'الاستخدام الشهري النشط للتطبيق') },
  { id: 'nomou', segs: ['sme', 'ob'], icon: 'chart', wave: 'w2', title: S('Nomou, business finance', 'Nomou، مالية الأعمال'),
    copy: [S("An SME's whole financial position on one screen.", 'المركز المالي الكامل للمنشأة في شاشة واحدة.'),
      S('Cash forecast, receivables, payables and VAT due.', 'توقع النقد، والذمم المدينة، والذمم الدائنة، وضريبة القيمة المضافة المستحقة.'),
      S('The shortfall is seen in week one, not week seven.', 'يظهر العجز في الأسبوع الأول، لا السابع.')],
    beats: [S('SME owner sees cash across all banks in one figure', 'مالك المنشأة يرى نقده في كل البنوك برقم واحد'),
      S('90-day cash forecast', 'توقع نقدي لـ 90 يومًا'),
      S('Receivables and payables due', 'الذمم المدينة والدائنة المستحقة'),
      S('ZATCA VAT due flagged', 'تنبيه بضريبة القيمة المضافة المستحقة لهيئة الزكاة والضريبة والجمارك'),
      S('A shortfall shows in week seven, with a one-tap financing offer today', 'يظهر عجز في الأسبوع السابع، مع عرض تمويل بلمسة واحدة اليوم')],
    kpi: S('Financing take-up from the forecast', 'الإقبال على التمويل من التوقع') },
  { id: 'consent', segs: ['ob'], icon: 'lock', wave: 'w2', tech: true, title: S('Consent and compliance', 'الموافقات والامتثال'),
    copy: [S('Every data permission visible, time-bound and revocable.', 'كل إذن بيانات ظاهر، ومحدد بوقت، وقابل للإلغاء.'),
      S('A full audit trail behind every call.', 'سجل تدقيق كامل خلف كل استدعاء.'),
      S('Licensed in Saudi Arabia, Bahrain and the UK.', 'مرخّص في السعودية والبحرين والمملكة المتحدة.')],
    beats: [S('Customer sees every active consent, what is shared and until when', 'العميل يرى كل موافقة نشطة، وما تتم مشاركته وحتى متى'),
      S('Revokes one in two taps', 'يلغي إحداها بلمستين'),
      S("Switch to the bank's side: consent registry, audit trail for every data call, expiry alerts", 'الانتقال إلى جانب البنك: سجل الموافقات، وسجل تدقيق لكل استدعاء بيانات، وتنبيهات الانتهاء'),
      S('A regulator report produced in one click', 'تقرير للجهة الرقابية بنقرة واحدة')],
    kpi: S('Time to produce a regulator report', 'الوقت لإعداد تقرير الجهة الرقابية') },
  { id: 'nbp', segs: ['ai'], icon: 'users', wave: 'w2', title: S('Next best product', 'المنتج الأنسب التالي'),
    copy: [S('Every morning, the RM knows who to call, what to offer, and why.', 'كل صباح، يعرف مدير العلاقة بمن يتصل، وماذا يعرض، ولماذا.'),
      S("Ranked from the bank's own transaction data.", 'مرتّبة من بيانات معاملات البنك نفسه.'),
      S('Each call measured against customers nobody called.', 'كل مكالمة تُقاس مقارنةً بعملاء لم يتصل بهم أحد.')],
    beats: [S('RM opens the morning list, five customers ranked', 'مدير العلاقة يفتح قائمة الصباح، خمسة عملاء مرتّبون'),
      S('Taps one: payroll growing, supplier payments rising, no trade finance with us', 'يختار أحدهم: رواتب تنمو، ومدفوعات موردين ترتفع، ولا تمويل تجاري لدينا'),
      S('Suggested offer pre-filled', 'عرض مقترح مُعبّأ مسبقًا'),
      S('RM sends it in one tap', 'يرسله مدير العلاقة بلمسة واحدة'),
      S('Outcome logged', 'تسجيل النتيجة')],
    kpi: S('Conversion against the holdout group (method shown)', 'التحويل مقارنةً بالمجموعة الضابطة (مع عرض المنهجية)') },
  { id: 'hiding', segs: ['ai'], icon: 'search', wave: 'w2', title: S('Customers hiding in the payment file', 'عملاء مختبئون في ملف المدفوعات'),
    copy: [S("Your clients' payment files already name your next customers.", 'ملفات مدفوعات عملائك تسمّي عملاءك القادمين بالفعل.'),
      S('Ai966 finds the suppliers who bank elsewhere.', 'Ai966 يجد الموردين الذين يتعاملون مع بنوك أخرى.'),
      S('Acquisition from data you already hold.', 'اكتساب عملاء من بيانات لديك بالفعل.')],
    beats: [S('An existing SME client runs its supplier payments', 'عميل منشأة حالي يُجري مدفوعات موردين'),
      S('The run fans out into dozens of businesses', 'تتوزع الدفعة على عشرات المنشآت'),
      S('The ones that bank elsewhere light up, with how much and how often they are paid', 'تبرز المنشآت التي تتعامل مع بنوك أخرى، مع حجم المدفوعات وتكرارها'),
      S('A pre-qualified invitation goes out', 'تُرسل دعوة مؤهّلة مسبقًا'),
      S('It opens straight into the onboarding journey', 'تفتح مباشرة رحلة فتح الحساب')],
    kpi: S('Cost to acquire', 'تكلفة الاكتساب') },
  { id: 'retention', segs: ['ai'], icon: 'down', wave: 'w2', title: S('Retention', 'الاحتفاظ بالعملاء'),
    copy: [S('Customers leave in the data before they leave the bank.', 'العملاء يغادرون في البيانات قبل أن يغادروا البنك.'),
      S('Ai966 sees it months ahead.', 'Ai966 يرى ذلك قبل أشهر.'),
      S('The RM acts while there is still time.', 'مدير العلاقة يتصرف ما دام هناك وقت.')],
    beats: [S('Signals stack up: payroll moved to another bank, balances leaving, card spend falling', 'تتراكم الإشارات: الرواتب انتقلت إلى بنك آخر، والأرصدة تغادر، وإنفاق البطاقات يتراجع'),
      S('RM alerted with the likely reason and a retention offer', 'تنبيه مدير العلاقة بالسبب المرجّح وعرض للاحتفاظ'),
      S('Saved or lost, tracked against the holdout', 'نجح الاحتفاظ أو لا، يُتابَع مقارنةً بالمجموعة الضابطة')],
    kpi: S('Attrition against the holdout group', 'التسرّب مقارنةً بالمجموعة الضابطة') },
  { id: 'capital', segs: ['ai'], icon: 'layers', wave: 'preview', preview: true, title: S('Capital allocation for the CXO', 'توزيع رأس المال للإدارة التنفيذية'),
    copy: [S('Where should the next riyal of SME credit go?', 'أين يجب أن يذهب الريال التالي من ائتمان المنشآت؟'),
      S("Live cash flows decide, not last year's financials.", 'التدفقات النقدية الحية هي التي تقرر، لا قوائم العام الماضي.'),
      S('A committee-ready answer in minutes.', 'إجابة جاهزة للجنة خلال دقائق.')],
    beats: [S('Head of SME or CRO sees the SME book by segment, with risk-adjusted return built from live cash flows', 'رئيس قطاع المنشآت أو رئيس المخاطر يرى محفظة المنشآت حسب الشريحة، مع عائد معدّل بالمخاطر مبني على التدفقات النقدية الحية'),
      S('A suggestion to move limit headroom from one segment to another', 'اقتراح بنقل هامش الحدود من شريحة إلى أخرى'),
      S('A slider shows the effect', 'شريط تمرير يوضح الأثر'),
      S('A one-page note for the credit committee is drafted', 'صياغة مذكرة من صفحة واحدة للجنة الائتمان')],
    kpi: S('Method only', 'المنهجية فقط') },
  { id: 'copilot', segs: ['ai'], icon: 'chat', wave: 'w2', title: S('Policy and compliance copilot', 'مساعد السياسات والامتثال'),
    copy: [S('Every employee gets the right policy answer in seconds.', 'كل موظف يحصل على إجابة السياسة الصحيحة في ثوانٍ.'),
      S('In Arabic or English, with the clause cited.', 'بالعربية أو الإنجليزية، مع ذكر البند.'),
      S("Grounded only in the bank's own documents.", 'مستندة فقط إلى مستندات البنك نفسه.')],
    beats: [S('A branch officer asks, in Arabic, whether an LLC with a foreign partner can open an account', 'موظف فرع يسأل بالعربية هل يمكن لشركة ذات مسؤولية محدودة بشريك أجنبي فتح حساب'),
      S("The answer comes back grounded in the bank's own policy, with the clause cited", 'تأتي الإجابة مستندة إلى سياسة البنك نفسه، مع ذكر البند'),
      S('Escalation path shown if the case is unclear', 'عرض مسار التصعيد إذا كانت الحالة غير واضحة')],
    kpi: S('Time to answer a policy query', 'الوقت للإجابة عن استفسار سياسة') },
];
const CARD_UI = {
  watch: T('Watch the 30-second demo', 'شاهد العرض في 30 ثانية'),
  story: T('See the 30 seconds', 'اطّلع على الثواني الثلاثين'),
};
const cardLine = (c) => c.line || (c.built ? JOURNEYS[c.built].copy[0] : c.copy && c.copy[0]);

/* ------------------------------------------------------------------ other section data */
const RAILS = [['Nafath', 'نفاذ', 'shield'], ['Wathq', 'واثق', 'building'], ['SIMAH', 'سمة', 'search'], ['SADAD', 'سداد', 'receipt'],
  ['SARIE', 'سريع', 'send'], ['mada', 'مدى', 'card'], ['Mudad/WPS', 'مدد/حماية الأجور', 'users'], ['GOSI', 'التأمينات الاجتماعية', 'users'], ['ZATCA', 'هيئة الزكاة والضريبة والجمارك', 'file']];
// Asset paths work from the root page and from /landing-b/, /landing-c/ (body[data-base="../"]).
const BASE = document.body.dataset.base || '';
// "Our network" logos as shown on aiondigital.com.
const NETWORK = [['boubyan', 'Boubyan Bank'], ['kfh-jazeel', 'KFH Jazeel Banking'], ['kfh-bahrain', 'KFH Bahrain'], ['daon', 'Daon'], ['kasisto', 'Kasisto'], ['qarar', 'Qarar'], ['wise', 'Wise']];
const SHIPPED = [
  [T('14 Oct 2026', '14 أكتوبر 2026'), T('Arabic captions on every demo', 'ترجمة عربية على كل عرض توضيحي')],
  [T('9 Oct 2026', '9 أكتوبر 2026'), T('Consent dashboard: revoke a permission in two taps', 'لوحة الموافقات: إلغاء الإذن بلمستين')],
  [T('2 Oct 2026', '2 أكتوبر 2026'), T("SADAD dues forecast for the next month", 'توقع مستحقات سداد للشهر القادم')],
  [T('26 Sep 2026', '26 سبتمبر 2026'), T('Payroll file checks for IBAN and ID before release', 'فحوص ملف الرواتب للآيبان والهوية قبل الصرف')],
];
const CHANNELS = [T('Mobile', 'الجوال'), T('Web', 'الويب'), T('RM apps', 'تطبيقات مدير العلاقة'), T('Partner apps', 'تطبيقات الشركاء')];
const AION_LAYER = [{ img: 'rubix', alt: 'Aion Rubix' }, T('800+ APIs', '+800 واجهة برمجة'), T('Open banking rails', 'قنوات المصرفية المفتوحة'), { img: 'ai966-white', alt: 'Ai966' }];
const LEVELS = [
  { t: T('The switch on every demo', 'المفتاح في كل عرض توضيحي'), d: T('The live trace beside the phone: each service and rail called, in order, with time stamps. Plain labels, no jargon.', 'التتبع المباشر بجانب الجوال: كل خدمة وقناة مستدعاة، بالترتيب، مع الأوقات. بعناوين واضحة ودون مصطلحات معقدة.') },
  { t: T('Click any step in the trace', 'انقر أي خطوة في التتبع'), d: T('A side panel with four lines: what the service does, the pattern it uses, where it runs, and which APIs from the catalogue it uses.', 'لوحة جانبية من أربعة أسطر: ما تفعله الخدمة، والنمط الذي تستخدمه، وأين تعمل، وأي واجهات برمجة من الدليل تستخدم.') },
  { t: T('The Platform page', 'صفحة المنصة'), d: T('One interactive architecture diagram the visitor can click layer by layer.', 'مخطط معماري تفاعلي واحد يتنقّل فيه الزائر طبقة تلو طبقة.') },
];
const ARCH = [
  { icon: 'phone', t: T('Channels', 'القنوات'), d: T("The bank's mobile, web, RM and partner apps.", 'تطبيقات البنك للجوال والويب ومدير العلاقة والشركاء.') },
  { icon: 'lock', t: T('API gateway and security', 'بوابة واجهات البرمجة والأمن'), d: T('Authentication, consent, rate limiting, audit.', 'المصادقة، والموافقة، وتحديد معدل الطلبات، والتدقيق.') },
  { icon: 'layers', t: T('Journey orchestration', 'تنسيق الرحلات'), d: T('Onboarding, payments, lending, cards, built as configurable flows.', 'فتح الحسابات، والمدفوعات، والتمويل، والبطاقات، مبنية كتدفقات قابلة للتهيئة.') },
  { icon: 'building', t: T('Domain microservices', 'الخدمات المصغّرة للمجالات'), d: T('Accounts, payments, cards, lending, customer, notifications. 800+ APIs in total.', 'الحسابات، والمدفوعات، والبطاقات، والتمويل، والعملاء، والإشعارات. أكثر من 800 واجهة برمجة إجمالًا.') },
  { icon: 'link', t: T('Connectors', 'الموصلات'), d: T('Existing core banking, card processors, and Saudi rails and registries: Nafath, Wathq, SIMAH, SADAD, SARIE, mada.', 'النظام المصرفي الأساسي الحالي، ومعالجات البطاقات، والقنوات والسجلات السعودية: نفاذ، وواثق، وسمة، وسداد، وسريع، ومدى.') },
  { icon: 'sync', t: T('Data and events', 'البيانات والأحداث'), d: T('The event stream that feeds Ai966 signals.', 'تدفق الأحداث الذي يغذي إشارات Ai966.') },
  { icon: 'bank', t: T('Runtime', 'بيئة التشغيل'), d: T("Containerised services on Kubernetes, cloud-native, deployable in the bank's own data centre or an in-Kingdom cloud.", 'خدمات في حاويات على Kubernetes، سحابية الأصل، قابلة للنشر في مركز بيانات البنك أو في سحابة داخل المملكة.') },
];
const BLOCKS = [
  { icon: 'layers', t: T('Deployment options', 'خيارات النشر'), d: T('On-premise · private cloud · in-Kingdom public cloud', 'داخل مقر البنك · سحابة خاصة · سحابة عامة داخل المملكة') },
  { icon: 'shield', t: T('Security and compliance', 'الأمن والامتثال'), d: T('SAMA cyber framework alignment. ISO 27001 and SOC 2: in progress until certified.', 'التوافق مع الإطار السيبراني لساما. ISO 27001 وSOC 2: قيد التنفيذ حتى الحصول على الشهادة.') },
  { icon: 'calendar', t: T('How we go live', 'كيف ننطلق'), d: T('A six-month path for an SME business: ' + ph('Discover · Configure · Integrate · Launch'), 'مسار من ستة أشهر لأعمال المنشآت: ' + ph('الاكتشاف · التهيئة · التكامل · الإطلاق')) },
];
const NUMBERS = [
  { to: 9, pre: '', suf: '', l: T('years in Saudi and GCC banking', 'سنوات في القطاع المصرفي في السعودية والخليج') },
  { to: 800, pre: '', suf: '+', l: T('banking APIs', 'واجهة برمجة مصرفية') },
  { to: 3, pre: '', suf: '', l: T('open banking licences: SAMA, CBB, FCA', 'تراخيص للمصرفية المفتوحة: ساما، مصرف البحرين المركزي، هيئة السلوك المالي') },
  { to: 6, pre: '~', suf: '', l: T('months to take a full SME banking business live', 'أشهر تقريبًا لإطلاق أعمال مصرفية متكاملة للمنشآت') },
];

/* ------------------------------------------------------------------ rendering */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
let activeSeg = 'all';
let booted = false;
// After the first render, re-rendered items (language change) appear revealed instead of fading again.
const revCls = (extra = '') => `reveal${booted ? ' in' : ''}${extra}`;

function renderStatic() {
  $$('[data-l]').forEach((el) => { el.innerHTML = L(LS[el.dataset.l]); });
  $$('[data-l-aria]').forEach((el) => el.setAttribute('aria-label', L(LS[el.dataset.lAria])));
}

function navTarget(go) {
  return go.startsWith('#') ? go : '#journeys';
}
function renderNav() {
  const list = $('#mega-nav');
  list.innerHTML = NAV.map((n) => `
    <li class="nav-item${n.cols.length > 1 ? ' is-wide' : ''}">
      <button type="button" class="nav-trigger" aria-expanded="false" aria-controls="mega-${n.id}">${L(n.label)}<svg class="ic chev" aria-hidden="true"><use href="#i-chev"/></svg></button>
      <div class="mega" id="mega-${n.id}">
        <div class="mega-cols">${n.cols.map((c) => `
          <div class="mega-col">${c.h ? `<a class="mega-h" href="#journeys" data-go="${c.go}">${L(c.h)}</a>` : ''}
            <ul>${c.items.map(([t, go]) => `<li><a href="${navTarget(go)}" data-go="${go}">${L(t)}</a></li>`).join('')}</ul>
          </div>`).join('')}
        </div>
      </div>
    </li>`).join('');
}

function renderRails() {
  const one = RAILS.map(([en, ar, i]) => `<li>${bub(i)}<span>${state.lang === 'ar' ? ar : en}</span></li>`).join('');
  $('#rails-track').innerHTML = `<ul>${one}</ul><ul aria-hidden="true">${one}</ul>`;
}

function renderFilters() {
  $('#seg-filter').innerHTML = SEGMENTS.map(([id, t]) =>
    `<button type="button" data-seg="${id}" aria-pressed="${id === activeSeg}">${L(t)}<span class="count">${id === 'all' ? CARDS.length : CARDS.filter((c) => c.segs.includes(id)).length}</span></button>`).join('');
}

// Sample footage: built journeys use their own clip; the others reuse one of the six clips.
function clipFor(c, i) {
  const ids = Object.keys(JOURNEYS).filter((k) => JOURNEYS[k].video);
  if (!ids.length) return null;
  return JOURNEYS[c.built && JOURNEYS[c.built].video ? c.built : ids[i % ids.length]].video;
}
function thumb(c, i) {
  // Video version: built journeys loop their real (sample) clip; it only loads and plays on screen.
  const v = clipFor(c, i);
  if (v) {
    return `<span class="thumb vthumb" aria-hidden="true"><video muted loop playsinline preload="none" poster="${v.poster}" data-src="${v.thumb}" style="object-position:${v.focus}"></video><span class="vt-play">${ic('arrow')}</span></span>`;
  }
  return `<span class="thumb t-${(i % 4) + 1}" aria-hidden="true">
    <span class="t-phone"><span class="t-top"><span class="t-ic">${ic(c.icon)}</span><i></i><i></i></span>
      <span class="t-body"><span class="t-row"><b></b><i></i></span><span class="t-row"><b></b><i></i></span><span class="t-row"><b></b><i></i></span>
      <span class="t-btn"></span><span class="t-chk">${ic('check')}</span></span></span>
    <span class="t-glow"></span></span>`;
}
function renderCards() {
  const segName = (id) => L(SEGMENTS.find(([s]) => s === id)[1]);
  $('#cards').innerHTML = CARDS.map((c, i) => `
    <li class="jcard ${revCls()}${c.built ? ' is-live' : ''}${c.tech ? ' is-tech' : ''}" data-card="${c.id}" style="--i:${i % 6}" ${activeSeg !== 'all' && !c.segs.includes(activeSeg) ? 'hidden' : ''}>
      <button type="button" class="jc-btn" aria-haspopup="dialog" aria-labelledby="jc-t-${c.id} jc-c-${c.id}" aria-describedby="jc-l-${c.id} jc-k-${c.id}">
        ${thumb(c, i)}
        <span class="jc-meta"><span class="jc-seg">${segName(c.segs[0])}</span><span class="jc-wave ${c.wave}">${L(WAVES[c.wave])}</span></span>
        <span class="jc-title" id="jc-t-${c.id}">${L(c.title)}</span>
        <span class="jc-line" id="jc-l-${c.id}">${L(cardLine(c))}</span>
        <span class="jc-kpi" id="jc-k-${c.id}">${ic('chart')}<span>${L(c.kpi)}</span></span>
        <span class="jc-cta" id="jc-c-${c.id}">${L(c.built ? CARD_UI.watch : CARD_UI.story)}${ic('arrow', 'arr')}</span>
      </button>
    </li>`).join('');
  observeReveals($('#cards'));
}

function renderLayer() {
  $('#chan-chips').innerHTML = CHANNELS.map((t) => `<li>${L(t)}</li>`).join('');
  $('#aion-chips').innerHTML = AION_LAYER.map((t) => (t.img
    ? `<li class="logo-chip"><img src="${BASE}assets/products/${t.img}.png" alt="${t.alt}" loading="lazy"></li>`
    : `<li>${L(t)}</li>`)).join('');
}

function renderLens() {
  const j = JOURNEYS.sme;
  $('#lens-biz').innerHTML = `${bub('clock')}<span><small>${L(j.kpi.label)}</small><b>${L(j.kpi.value)}</b><em>${L(j.kpi.note)} ¹</em></span>`;
  $('#lens-tech').innerHTML = `${bub('layers')}<span><small>${L(UI.svc)}: <b>${j.trace.length}</b></small><small>${L(UI.latency)}: <b>${ph('420 ms')}</b></small><small>${L(UI.deploy)}: <b>${L(UI.toConfirm)}</b></small></span>`;
  $('#lens-trace').innerHTML = j.trace.map((t, i) => `<li style="--i:${i}"><span></span>${L(t.label)}</li>`).join('');
  syncLens();
}
function syncLens() {
  $$('[data-lens2]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens2 === state.lens)));
  $('#lens-card').dataset.lens = state.lens;
  $$('.jcard.is-tech').forEach((c) => c.classList.toggle('is-lit', state.lens === 'technical'));
}

let archIdx = 0;
function renderArch() {
  $('#levels').innerHTML = LEVELS.map((l, i) => `<li class="${revCls()}" style="--i:${i}"><span class="lv-n">${i + 1}</span><h3>${L(l.t)}</h3><p>${L(l.d)}</p></li>`).join('');
  $('#arch-stack').innerHTML = ARCH.map((a, i) => `<li><button type="button" class="arch-layer" data-i="${i}" aria-pressed="${i === archIdx}" aria-controls="arch-detail" style="--i:${i}">${bub(a.icon)}<span>${L(a.t)}</span><span class="al-n">0${i + 1}</span></button></li>`).join('');
  $('#arch-blocks').innerHTML = BLOCKS.map((b, i) => `<li class="${revCls()}" style="--i:${i}">${bub(b.icon)}<h3>${L(b.t)}</h3><p>${L(b.d)}</p></li>`).join('');
  showArch(archIdx);
  observeReveals($('#platform'));
}
function showArch(i) {
  archIdx = i;
  const a = ARCH[i];
  $$('.arch-layer').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
  const d = $('#arch-detail');
  d.innerHTML = `<span class="ad-n">0${i + 1} / 0${ARCH.length}</span><span class="ad-ic">${ic(a.icon)}</span><h3>${L(a.t)}</h3><p>${L(a.d)}</p>`;
  d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap');
  $('#arch-stack').style.setProperty('--sel', i);
}

function renderNumbers() {
  $('#nums').innerHTML = NUMBERS.map((n, i) => `
    <li class="num ${counted ? revCls() : 'reveal'}" style="--i:${i}">
      <span class="sr-only">${n.pre}${n.to}${n.suf}</span><span class="num-v" aria-hidden="true" data-to="${n.to}" data-pre="${n.pre}" data-suf="${n.suf}">${n.pre}${counted ? n.to : 0}${n.suf}</span>
      <span class="num-l">${L(n.l)}</span>
      <span class="num-src">${L(LS.nSource)}</span>
    </li>`).join('');
  observeReveals($('#nums'));
}

function renderProof() {
  const marquee = document.body.classList.contains('lp-b');
  const logos = (hidden) => NETWORK.map(([f, name], i) => `<li class="${hidden || marquee ? 'in' : revCls()}" style="--i:${i}"${hidden ? ' aria-hidden="true"' : ''}><img src="${BASE}assets/network/${f}.png" alt="${hidden ? '' : name}" loading="lazy"></li>`).join('');
  // Landing B shows the network as a scrolling strip (second copy is decorative).
  $('#logos').innerHTML = logos(false) + (document.body.classList.contains('lp-b') ? logos(true) : '');
  $('#shipped-list').innerHTML = SHIPPED.map(([d, t], i) => `<li class="${revCls()}" style="--i:${i}"><span class="sh-dot"></span><span class="sh-date">${ph(L(d))}</span><span class="sh-line">${ph(L(t))}</span></li>`).join('');
  observeReveals($('#proof'));
  observeReveals($('#shipped'));
}

function renderFooter() {
  $('#f-nav').innerHTML = NAV.map((n) => `<div><p class="f-h">${L(n.label)}</p><ul>${n.cols.flatMap((c) => c.items).slice(0, 5)
    .map(([t, go]) => `<li><a href="${navTarget(go)}" data-go="${go}">${L(t)}</a></li>`).join('')}</ul></div>`).join('');
  $('#year').textContent = new Date().getFullYear();
}

const has = (sel) => !!document.querySelector(sel);
function renderAll() {
  if (revealIO) revealIO.disconnect();
  renderStatic();
  renderNav();
  renderRails();
  renderFilters();
  renderCards();
  renderLayer();
  renderLens();
  renderArch();
  renderNumbers();
  renderProof();
  renderFooter();
  if (openCardId) openCard(openCardId, true);
  observeReveals(document);
  booted = true;
  watchVideoThumbs();
}

let thumbIO = null;
function watchVideoThumbs() {
  const vids = $$('.vthumb video');
  if (!vids.length) return;
  if (!thumbIO) {
    thumbIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting && !reduceMotion.matches) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else v.pause();
    }), { threshold: 0.25 });
  }
  thumbIO.disconnect();
  vids.forEach((v) => thumbIO.observe(v));
}

/* ------------------------------------------------------------------ scroll reveal + count-up */
let revealIO;
let counted = false;
function observeReveals(root) {
  if (!revealIO) return;
  $$('.reveal:not(.in)', root).forEach((el) => revealIO.observe(el));
}
function countUp() {
  if (counted) return;
  counted = true;
  $$('.num-v').forEach((el) => {
    const to = Number(el.dataset.to);
    const { pre, suf } = el.dataset;
    if (reduceMotion.matches) { el.textContent = `${pre}${to}${suf}`; return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1600);
      const e = 1 - (1 - p) ** 4;
      el.textContent = `${pre}${Math.round(to * e)}${suf}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ------------------------------------------------------------------ demo dialog */
let focusHero = null;
let openCardId = null;
let storyTimer = 0;
let ddOpener = null;
let storyPaused = false;
let storyTick = null;
function openCard(id, rerender = false) {
  const c = CARDS.find((x) => x.id === id);
  if (!c) return;
  openCardId = id;
  const dlg = $('#demo-dialog');
  if (!dlg.open && !rerender) ddOpener = document.activeElement;
  const live = $('.dd-live', dlg);
  const story = $('.dd-story', dlg);
  $('.dd-seg', dlg).textContent = L(SEGMENTS.find(([s]) => s === c.segs[0])[1]);
  const wave = $('.dd-wave', dlg);
  wave.className = `jc-wave dd-wave ${c.wave}`;
  wave.textContent = L(WAVES[c.wave]);
  $('#demo-title').innerHTML = L(c.title);
  clearInterval(storyTimer);

  if (c.built) {
    story.hidden = true;
    live.hidden = false;
    if (!focusHero) {
      const frag = $('#hero-tpl').content.cloneNode(true);
      const sec = frag.querySelector('.hero');
      sec.classList.add('is-focus', 'is-in', 'is-onscreen');
      sec.dataset.v = ($('#heroes').dataset.versions || '1').split(',')[0]; // same design as the page's hero
      sec.id = 'focus-demo';
      live.appendChild(frag);
      focusHero = new Hero(live.lastElementChild, 'f');
      focusHero.settled = true;
      heroes.push(focusHero);
      focusHero.sw.setAttribute('aria-checked', String(state.behind));
      focusHero.trace.toggleAttribute('inert', !state.behind);
      focusHero.trace.setAttribute('aria-hidden', String(!state.behind));
    }
    if (!rerender || focusHero.jid !== c.built) focusHero.setJourney(c.built);
    focusHero.visible = true;
  } else {
    live.hidden = true;
    story.hidden = false;
    if (focusHero) focusHero.visible = false;
    const lines = c.copy || [c.line];
    const beats = c.beats || [c.line];
    $('.st-copy', story).innerHTML = lines.map((l, i) => `<p class="${i === 0 ? 'lead' : ''}">${L(l)}</p>`).join('');
    $('.st-beats', story).innerHTML = beats.map((b, i) => `<li style="--i:${i}"><span class="bn">${i + 1}</span><span>${L(b)}</span></li>`).join('');
    $('.st-kpi', story).innerHTML = `${bub('chart')}<span><small>${L(LS.ddKpi)}</small><b>${L(c.kpi)}</b></span>`;
    $('.st-ic', story).innerHTML = ic(c.icon);
    const clip = clipFor(c, CARDS.indexOf(c));
    const sv = $('.st-video', story);
    if (clip && sv) {
      if (!sv.src.endsWith(clip.mp4.split('/').pop())) { sv.poster = clip.poster; sv.src = clip.mp4; sv.style.objectPosition = clip.focus; }
      if (!reduceMotion.matches) sv.play().catch(() => {});
    }
    $('.st-notes', story).innerHTML = [c.preview && L(LS.ddPreview), c.tech && L(LS.ddTech), L(LS.ddVideo)].filter(Boolean).map((t) => `<p>${t}</p>`).join('');
    // Storyboard plays the beats on the template's 30-second clock.
    let k = 0;
    const items = $$('.st-beats li', story);
    const cap = $('.st-cap', story);
    const tickBeat = () => {
      items.forEach((li, i) => { li.classList.toggle('is-on', i === k); li.classList.toggle('is-done', i < k); });
      cap.innerHTML = L(beats[k]);
      cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
      story.style.setProperty('--beat-ms', `${30000 / beats.length}ms`);
      k = (k + 1) % beats.length;
    };
    storyTick = tickBeat;
    if (reduceMotion.matches) {
      // Reduced motion: show every step at once, no auto-advance.
      items.forEach((li) => li.classList.add('is-done'));
      cap.innerHTML = L(beats[0]);
    } else {
      tickBeat();
      storyPaused = false;
      if (!storyPaused) storyTimer = setInterval(tickBeat, 30000 / beats.length);
    }
    syncStoryPause();
  }
  if (!dlg.open) dlg.showModal();
}
function syncStoryPause() {
  const b = $('.st-pause');
  if (!b) return;
  b.hidden = reduceMotion.matches;
  b.dataset.state = storyPaused ? 'paused' : 'playing';
  b.setAttribute('aria-label', L(storyPaused ? LS.play : LS.pause));
  b.title = L(storyPaused ? LS.play : LS.pause);
}
function toggleStory() {
  const c = CARDS.find((x) => x.id === openCardId);
  if (!c) return;
  storyPaused = !storyPaused;
  clearInterval(storyTimer);
  if (!storyPaused && storyTick) storyTimer = setInterval(storyTick, 30000 / (c.beats || [c.line]).length);
  $('.dd-story').classList.toggle('is-paused', storyPaused);
  const sv = $('.st-video');
  if (sv && sv.src) storyPaused ? sv.pause() : sv.play().catch(() => {});
  syncStoryPause();
}
function closeCard() {
  clearInterval(storyTimer);
  const sv = $('.st-video');
  if (sv) sv.pause();
  const id = openCardId;
  openCardId = null;
  storyPaused = false;
  $('.dd-story').classList.remove('is-paused');
  if (focusHero) focusHero.visible = false;
  // Return focus somewhere visible (the opener may sit in a now-closed menu).
  const visible = (el) => el && el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const target = visible(ddOpener) ? ddOpener : ($(`.jcard[data-card="${id}"]:not([hidden]) .jc-btn`) || $('#j-title'));
  if (target) target.focus({ preventScroll: !visible(ddOpener) ? false : true });
  ddOpener = null;
}

/* ------------------------------------------------------------------ navigation behaviour */
function closeMegas(except) {
  $$('.nav-trigger[aria-expanded="true"]').forEach((b) => { if (b !== except) b.setAttribute('aria-expanded', 'false'); });
}
function go(target) {
  closeMegas();
  const menuBtn = $('.menu-btn[aria-expanded="true"]');
  if (menuBtn) menuBtn.click();
  if (target.startsWith('card:')) { openCard(target.slice(5)); return true; }
  if (target.startsWith('seg:')) { setSeg(target.slice(4)); return false; }
  return false;
}
function setSeg(seg) {
  activeSeg = seg;
  $$('#seg-filter button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.seg === seg)));
  $$('.jcard').forEach((li) => {
    const c = CARDS.find((x) => x.id === li.dataset.card);
    const show = seg === 'all' || c.segs.includes(seg);
    li.hidden = !show;
    if (show) { li.classList.remove('pop'); void li.offsetWidth; li.classList.add('pop'); }
  });
}

/* ------------------------------------------------------------------ boot */
function initLanding() {
  revealIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
    if (e.target.closest('#nums')) countUp();
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  renderAll();
  observeReveals(document);

  // Landing B: the network strip scrolls inside its own masked viewport, with a pause control.
  if (document.body.classList.contains('lp-b')) {
    const list = $('#logos');
    const vp = document.createElement('div');
    vp.className = 'logos-viewport';
    list.before(vp);
    vp.append(list);
    const bar = document.createElement('div');
    bar.className = 'logos-bar';
    bar.innerHTML = '<button type="button" class="pause-btn" data-state="playing"><span aria-hidden="true"></span></button>';
    vp.after(bar);
    const pb = $('button', bar);
    const sync = () => {
      const paused = $('#proof').classList.contains('is-paused');
      pb.dataset.state = paused ? 'paused' : 'playing';
      pb.setAttribute('aria-label', L(paused ? LS.play : LS.pause).replace(/storyboard|القصة المصوّرة/, (m) => (m === 'storyboard' ? 'logos' : 'الشعارات')));
    };
    pb.addEventListener('click', () => { $('#proof').classList.toggle('is-paused'); sync(); });
    sync();
    $('#proof').classList.add('loop-sec');
  }

  // Pause decorative loops in sections that are off screen.
  const loopIO = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-on', e.isIntersecting)), { threshold: 0 });
  $$('.loop-sec').forEach((s) => loopIO.observe(s));

  // Mega menus: click to toggle; hover opens on desktop pointers.
  const nav = $('#mega-nav');
  nav.addEventListener('click', (e) => {
    const t = e.target.closest('.nav-trigger');
    if (t) {
      // A mouse hover already opened it: the click that follows should not close it again.
      if (t === hoverOpened && performance.now() - hoverAt < 600) return;
      const open = t.getAttribute('aria-expanded') !== 'true';
      closeMegas(t);
      t.setAttribute('aria-expanded', String(open));
    }
  });
  let hoverT = 0;
  let hoverOpened = null;
  let hoverAt = 0;
  nav.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1421px)').matches) return;
    const item = e.target.closest('.nav-item');
    if (!item) return;
    clearTimeout(hoverT);
    const t = $('.nav-trigger', item);
    if (t.getAttribute('aria-expanded') === 'true') return;
    closeMegas(t);
    t.setAttribute('aria-expanded', 'true');
    hoverOpened = t;
    hoverAt = performance.now();
  });
  nav.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1421px)').matches) return;
    hoverT = setTimeout(() => { if (!nav.contains(document.activeElement)) closeMegas(); }, 220);
  });
  // Keyboard: a panel closes when focus leaves its item.
  nav.addEventListener('focusout', (e) => {
    const it = e.relatedTarget && e.relatedTarget.closest('#mega-nav .nav-item');
    if (it) { closeMegas($('.nav-trigger', it)); return; }
    // Clicks inside a panel may not move focus (Safari, panel padding): decide after the click lands.
    setTimeout(() => { if (!nav.contains(document.activeElement) && !nav.matches(':hover')) closeMegas(); });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) closeMegas();
    const link = e.target.closest('[data-go]');
    if (!link || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (go(link.dataset.go)) e.preventDefault();
  });
  // Escape closes only the open submenu (captured before app.js closes the whole mobile menu).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || $('#demo-dialog').open) return;
    const open = $('.nav-trigger[aria-expanded="true"]');
    if (open) { closeMegas(); open.focus(); e.stopPropagation(); }
  }, { capture: true });

  // Journey filters + cards
  $('#seg-filter').addEventListener('click', (e) => { const b = e.target.closest('[data-seg]'); if (b) setSeg(b.dataset.seg); });
  $('#cards').addEventListener('click', (e) => { const li = e.target.closest('.jcard'); if (li) openCard(li.dataset.card); });
  const dlg = $('#demo-dialog');
  $$('[data-dd-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', closeCard);
  $('.st-pause', dlg).addEventListener('click', toggleStory);

  // Lens demo mirrors the header toggle.
  $$('[data-lens2]').forEach((b) => b.addEventListener('click', () => setLens(b.dataset.lens2)));
  document.addEventListener('aion:lens', syncLens);
  document.addEventListener('aion:lang', renderAll);

  // Architecture explorer: click a layer; it also walks the layers on its own until touched.
  let archAuto = 0;
  let touched = false;
  const stopAuto = () => { touched = true; clearInterval(archAuto); };
  $('#arch-stack').addEventListener('click', (e) => {
    const b = e.target.closest('.arch-layer');
    if (!b) return;
    stopAuto();
    $('#arch-detail').setAttribute('aria-live', 'polite'); // announce only what the visitor chose
    showArch(Number(b.dataset.i));
  });
  // The walk-through stops as soon as the visitor engages (hover, focus) or a dialog is open.
  $('.arch').addEventListener('focusin', stopAuto);
  $('.arch').addEventListener('pointerenter', stopAuto);
  new IntersectionObserver((entries) => entries.forEach((e) => {
    clearInterval(archAuto);
    if (e.isIntersecting && !touched && !reduceMotion.matches) {
      archAuto = setInterval(() => { if (!$('#demo-dialog').open) showArch((archIdx + 1) % ARCH.length); }, 3200);
    }
  }), { threshold: 0.4 }).observe($('#arch-stack'));
}

document.addEventListener('DOMContentLoaded', initLanding);

// Interaction captures for the landing page: mega menu, demo dialogs, mobile, Arabic.
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const OUT=f=>path.resolve(__dirname,'..','screenshots',f);
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const errs=[];const page=async(w,h,lang)=>{const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errs.push(w+' '+e.message));
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','index.html')).href);await p.evaluate(()=>localStorage.clear());await p.reload();
 if(lang==='ar')await p.click('button[data-lang="ar"]');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);return p;};
// Desktop: mega menu, built demo, storyboard
let p=await page(1440,900,'en');
await p.click('.nav-trigger[aria-controls="mega-solutions"]');await p.waitForTimeout(500);await p.screenshot({path:OUT('LU-mega.png')});
await p.click('#mega-solutions a[data-go="card:payroll"]');await p.waitForTimeout(4000);await p.screenshot({path:OUT('LU-dialog-live.png')});
console.log('dialog open',await p.$eval('#demo-dialog',d=>d.open),'focus hero journey',await p.evaluate(()=>heroes.find(h=>h.v==='f')&&heroes.find(h=>h.v==='f').jid));
await p.keyboard.press('Escape');await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('#journeys').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(600);
await p.click('#seg-filter [data-seg="ai"]');await p.waitForTimeout(700);
console.log('visible AI cards',await p.$$eval('.jcard:not([hidden])',l=>l.length));
await p.click('.jcard[data-card="hiding"] .jc-btn');await p.waitForTimeout(6500);await p.screenshot({path:OUT('LU-dialog-story.png')});
await p.keyboard.press('Escape');
await p.close();
// Arabic desktop
p=await page(1440,900,'ar');await p.screenshot({path:OUT('LU-ar-hero.png')});
await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelector('#journeys').scrollIntoView({behavior:'instant'})});await p.waitForTimeout(1200);await p.screenshot({path:OUT('LU-ar-journeys.png')});
await p.evaluate(()=>document.querySelector('#platform').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(1200);await p.screenshot({path:OUT('LU-ar-platform.png')});
await p.close();
// Mobile
p=await page(390,844,'en');await p.screenshot({path:OUT('LU-m-hero.png')});
await p.click('.menu-btn');await p.click('.nav-trigger[aria-controls="mega-solutions"]');await p.waitForTimeout(500);await p.screenshot({path:OUT('LU-m-menu.png')});
await p.click('.menu-btn');
for(const s of ['#journeys','#layer','#lens','#platform','#numbers','#contact']){await p.evaluate(s=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelector(s).scrollIntoView({behavior:'instant'})},s);await p.waitForTimeout(900);await p.screenshot({path:OUT('LU-m-'+s.slice(1)+'.png')});}
console.log('mobile overflow',await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth));
await p.close();
console.log('errors',JSON.stringify(errs));await b.close();})();

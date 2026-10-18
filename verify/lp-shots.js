// Section captures for landing A/B/C. Usage: node lp-shots.js <a|b|c> [width] [lang] [theme]
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [pg='a',w='1440',lang='en',theme='light']=process.argv.slice(2);
const FILE={a:'index.html',b:'landing-b/index.html',c:'landing-c/index.html'}[pg];
const SECS=['#top','#journeys','#layer','#numbers','#principles','#proof','#shipped','#contact'];
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:900},colorScheme:theme});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>!/fonts\.g/.test(r.url())&&errs.push('404 '+r.url()));
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..',FILE)).href);await p.evaluate(()=>localStorage.clear());await p.reload();
if(lang==='ar')await p.click('button[data-lang="ar"]');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1400);
for(const s of SECS){await p.evaluate(s=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelector(s).scrollIntoView({behavior:'instant'});document.querySelector('.site-header').style.visibility='hidden';document.querySelector('.design-switch').style.visibility='hidden';},s);
 await p.waitForTimeout(1500);await p.locator(s).screenshot({path:path.resolve(__dirname,'..','screenshots',`P${pg}-${w}-${lang}${theme!=='light'?'-'+theme:''}-${s.slice(1)}.png`)});}
console.log(pg,w,lang,'errors',JSON.stringify(errs));await b.close();})();

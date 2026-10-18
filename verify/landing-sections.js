// Per-section screenshots of the landing page. Usage: node landing-sections.js [width] [lang] [theme]
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [w='1440',lang='en',theme='light']=process.argv.slice(2);
const SECS=['#top','.rails','#journeys','#layer','#lens','#platform','#numbers','#principles','#proof','#shipped','#contact','.site-footer'];
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:900},colorScheme:theme});
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','index.html')).href);await p.evaluate(()=>localStorage.clear());await p.reload();
if(lang==='ar')await p.click('button[data-lang="ar"]');
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
for(const s of SECS){const el=p.locator(s).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(1800);
 await p.evaluate(()=>document.querySelector('.site-header').style.visibility='hidden');
 await el.screenshot({path:path.resolve(__dirname,'..','screenshots',`L-${w}-${lang}${theme!=='light'?'-'+theme:''}-${s.replace(/[#.]/g,'')}.png`)});
 await p.evaluate(()=>document.querySelector('.site-header').style.visibility='');}
await b.close();})();

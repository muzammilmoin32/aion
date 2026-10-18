// Fast visual pass: each option at a given width/lang, optional behind switch on.
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [w='1440',lang='en',behind='0',opts='1,2,3,4,5',theme='light']=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:900}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','mockups','index.html')).href);await p.waitForTimeout(400);
if(lang==='ar')await p.click('button[data-lang="ar"]');
if(theme!=='light')await p.click('button[data-theme-set="'+theme+'"]');
if(behind==='1')await p.click('#option-1 .behind-switch');
await p.evaluate(()=>document.fonts.ready);
for(const v of opts.split(',')){await p.locator('#option-'+v).scrollIntoViewIfNeeded();await p.waitForTimeout(6500);
 await p.locator('#option-'+v).screenshot({path:path.resolve(__dirname,'..','screenshots',`q-${v}-${w}-${lang}${behind==='1'?'-behind':''}${theme!=='light'?'-'+theme:''}.png`)});}
console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth));
await b.close();})();

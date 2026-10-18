// Full-page screenshots of the landing page. Usage: node landing-shot.js [width] [lang] [theme]
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [w='1440',lang='en',theme='light']=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:900},colorScheme:theme});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','index.html')).href);await p.evaluate(()=>localStorage.clear());await p.reload();
if(lang==='ar')await p.click('button[data-lang="ar"]');
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
// scroll through so reveals fire
const H=await p.evaluate(()=>document.body.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120);}
await p.waitForTimeout(1800);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(600);
await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`landing-${w}-${lang}${theme!=='light'?'-'+theme:''}.png`),fullPage:true});
console.log('height',H,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),'errors',JSON.stringify(errs));
await b.close();})();

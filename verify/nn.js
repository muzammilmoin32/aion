const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const open=async(w,h,lang)=>{const p=await b.newPage({viewport:{width:w,height:h}});const e=[];p.on('pageerror',x=>e.push(x.message));p.errs=e;
 await p.addInitScript(()=>{try{sessionStorage.setItem('aion-night-loader','1')}catch(e){}});
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','index.html')).href);await p.evaluate(()=>localStorage.clear());
 if(lang==='ar')await p.click('button[data-lang="ar"]');await p.waitForTimeout(3000);return p;};
const shot=async(p,s,n)=>{await p.evaluate(s=>{document.querySelectorAll('.reveal,.split,.npanel,.stat').forEach(e=>e.classList.add('in'));document.querySelector(s).scrollIntoView({behavior:'instant'})},s);await p.waitForTimeout(1300);await p.screenshot({path:path.resolve(__dirname,'..','screenshots','NN2-'+n+'.png')});};
let p=await open(1440,900,'en');await p.mouse.move(1150,380);await p.waitForTimeout(800);await p.screenshot({path:path.resolve(__dirname,'..','screenshots','NN2-hero.png')});
// smooth scroll: mouse wheel notches and fine trackpad deltas both move the page, with easing (intermediate positions)
await p.mouse.move(700,500);const ys=[];await p.mouse.wheel(0,300);for(let i=0;i<6;i++){await p.waitForTimeout(60);ys.push(await p.evaluate(()=>Math.round(scrollY)));}
for(let i=0;i<20;i++){await p.mouse.wheel(0,7.5);await p.waitForTimeout(8);}await p.waitForTimeout(700);ys.push(await p.evaluate(()=>Math.round(scrollY)));
console.log('wheel easing',ys.join(' '));
for(const [s,n] of [['#glue','glue'],['#boring','boring'],['#numbers','numbers'],['#contact','contact']])await shot(p,s,n);
console.log('en errors',p.errs);await p.close();
p=await open(390,844,'en');await p.screenshot({path:path.resolve(__dirname,'..','screenshots','NN2-m-hero.png')});await shot(p,'#glue','m-glue');await shot(p,'#sunday','m-sunday');
console.log('m overflow',await p.evaluate(()=>{const W=innerWidth;return [...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();if(!r.width||el.closest('svg,.apps,.chips,.g3d,#trav'))return false;return r.right>W+1||r.left<-1}).slice(0,6).map(e=>e.className+'')}),p.errs);await p.close();
p=await open(1440,900,'ar');await p.mouse.move(300,380);await p.waitForTimeout(800);await p.screenshot({path:path.resolve(__dirname,'..','screenshots','NN2-ar-hero.png')});await shot(p,'#glue','ar-glue');console.log('ar errors',p.errs);await p.close();
await b.close();})();

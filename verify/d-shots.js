const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [w='1440',h='900',lang='en']=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:+h}});const e=[];p.on('pageerror',x=>e.push(x.message));p.on('requestfailed',r=>!/fonts\.g/.test(r.url())&&!/ABORTED/.test(r.failure().errorText)&&e.push('404 '+r.url().split('/').pop()));
await p.addInitScript(()=>{try{sessionStorage.setItem('aion-night-loader','1')}catch(e){}});
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','landing-d','index.html')).href,{timeout:90000});if(lang==='ar')await p.click('button[data-lang="ar"]');
await p.mouse.move(+w*.7,300);await p.waitForTimeout(2500);await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`D-${w}${lang}-hero.png`)});
const go=async(s,off,n)=>{await p.evaluate(([s,o])=>{const el=document.querySelector(s);scrollTo(0,el.offsetTop+o)},[s,off]);await p.waitForTimeout(1600);await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`D-${w}${lang}-${n}.png`)});};
await go('#journeys',-500,'wall-flat');await go('#journeys',-80,'wall-up');await go('#layer',-150,'stack');await go('.ribbons',-300,'ribbons');await go('#numbers',-80,'flips');
await go('#deploy',-60,'cards');const c=await p.$('.tcard.rec');if(c&&+w>900){const bb=await c.boundingBox();await p.mouse.move(bb.x+bb.width*.85,bb.y+bb.height*.2);await p.waitForTimeout(500);await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`D-${w}${lang}-cards-tilt.png`)});}
await go('#contact',-120,'close');
await p.evaluate(()=>document.querySelector('#journeys').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(800);await p.click('.wcard[data-j="ews"]');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>({j:heroes[0].jid,y:Math.round(scrollY),over:document.documentElement.scrollWidth-innerWidth}));
console.log(w,lang,JSON.stringify(r),e);await b.close();})();

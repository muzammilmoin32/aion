// Night theme checks from the code review.
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const PAGE=f=>url.pathToFileURL(path.resolve(__dirname,'..',f)).href;const out=[];const ok=(n,c,d='')=>out.push(`${c?'PASS':'FAIL'}  ${n}${d?'  ('+d+')':''}`);
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
 // 1. loader animations reject -> hero still appears
 let p=await b.newPage({viewport:{width:1440,height:900}});
 await p.addInitScript(()=>{const o=Element.prototype.animate;Element.prototype.animate=function(...a){const an=o.apply(this,a);if(this.id==='th-lpanel'){an.cancel();}return an;};});
 await p.goto(PAGE('index.html'));await p.waitForTimeout(4600);
 const r1=await p.evaluate(()=>({boot:document.documentElement.classList.contains('th-boot'),op:getComputedStyle(document.querySelector('.hero .hero-copy > *')).opacity,loader:!!document.getElementById('th-loader')}));
 ok('Loader failure still reveals the hero',!r1.boot&&r1.op==='1'&&!r1.loader,JSON.stringify(r1));await p.close();
 // 2. tilt waits for the entrance, then follows the pointer
 p=await b.newPage({viewport:{width:1440,height:900}});await p.addInitScript(()=>{try{sessionStorage.setItem('aion-night-loader','1')}catch(e){}});
 await p.goto(PAGE('index.html'));await p.waitForTimeout(500);
 const early=await p.evaluate(()=>document.querySelector('#top .phone-tilt').style.transform);
 await p.waitForTimeout(2200);await p.mouse.move(200,200);await p.waitForTimeout(800);
 const late=await p.evaluate(()=>document.querySelector('#top .phone-tilt').style.transform);
 ok('Tilt starts after the entrance and follows the pointer',early===''&&/rotateY/.test(late),`early="${early}" late="${late.slice(0,60)}"`);
 // 3. skip link moves focus
 await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.waitForTimeout(800);
 ok('Skip link moves focus to main',await p.evaluate(()=>document.activeElement.id)==='main');
 // 4. wheel scrolls (mouse wheel notches)
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);await p.mouse.move(700,500);
 for(let i=0;i<3;i++){await p.mouse.wheel(0,200);await p.waitForTimeout(60);}await p.waitForTimeout(1200);
 const y=await p.evaluate(()=>scrollY);ok('Mouse wheel scrolls the page',y>=400,'scrollY '+y);
 await p.close();
 // 5. reduced motion: reveals visible, no stream
 p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await p.goto(PAGE('index.html'));await p.waitForTimeout(1500);
 const r5=await p.evaluate(()=>({hidden:[...document.querySelectorAll('.reveal')].filter(e=>getComputedStyle(e).opacity!=='1').length,stream:!!document.getElementById('th-stream')&&getComputedStyle(document.getElementById('th-stream')).display}));
 ok('Reduced motion: every reveal visible, stream off',r5.hidden===0&&r5.stream==='none',JSON.stringify(r5));await p.close();
 await b.close();console.log(out.join('\n'));})();

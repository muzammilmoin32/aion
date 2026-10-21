// Night theme captures. Usage: node night-shots.js [width] [lang] [sections]
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [w='1440',lang='en',secs='1']=process.argv.slice(2);
const PAGES={A:'index.html',B:'landing-b/index.html',C:'landing-c/index.html',M:'mockups/index.html'};
const SECS=['#journeys','#layer','#lens','#platform','#numbers','#principles','#proof','#contact','.site-footer'];
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe'),args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [k,f] of Object.entries(PAGES)){const p=await b.newPage({viewport:{width:+w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&!/fonts\.g/.test(m.text())&&errs.push(m.text()));
 await p.addInitScript(()=>{try{sessionStorage.setItem('aion-night-loader','1')}catch(e){}});
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..',f)).href);await p.evaluate(()=>localStorage.clear());
 if(lang==='ar')await p.click('button[data-lang="ar"]');
 await p.evaluate(()=>document.fonts.ready);await p.mouse.move(+w*0.75,450);await p.waitForTimeout(3500);
 const gl=await p.evaluate(()=>!!document.getElementById('th-stream')&&document.getElementById('th-stream').width);
 await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`N-${k}-${w}-${lang}-hero.png`)});
 if(secs==='1'&&k!=='M'){for(const s of SECS){if(!await p.$(s))continue;await p.evaluate(s=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelector(s).scrollIntoView({behavior:'instant'})},s);await p.waitForTimeout(1300);await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`N-${k}-${w}-${lang}-${s.replace(/[#.]/g,'')}.png`)});}}
 console.log(k,'canvas',gl,'errors',JSON.stringify(errs));await p.close();}
await b.close();})();

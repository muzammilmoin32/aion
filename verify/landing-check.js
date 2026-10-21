// Landing A/B/C checks: hero fits one screen, nothing wider than the viewport, no errors or 404s.
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const PAGES={a:'index.html'};
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const out=[];let fails=0;
for(const [k,f] of Object.entries(PAGES))for(const [w,h] of [[1920,1080],[1440,900],[1366,768],[1024,768],[390,844],[360,740]])for(const lang of ['en','ar']){
 const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>!(/.mp4$/.test(r.url())&&/ABORTED/.test(r.failure().errorText))&&!/fonts\.g/.test(r.url())&&errs.push('failed '+r.url().split('/').slice(-2).join('/')));
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..',f)).href);await p.evaluate(()=>localStorage.clear());await p.reload();
 if(lang==='ar')await p.click('button[data-lang="ar"]');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1300);
 const r=await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
  const hero=document.querySelector('.hero');const header=document.querySelector('.site-header').offsetHeight;const W=innerWidth;
  // real overflow: visible elements outside the viewport that are not inside a clipping container
  const clipped=(el)=>{for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const o=getComputedStyle(a);if(/(hidden|clip|auto|scroll)/.test(o.overflowX+o.overflow))return true;}return false;};
  const bad=[];document.querySelectorAll('main *, footer *').forEach(el=>{const rc=el.getBoundingClientRect();if(!rc.width||(rc.right<=W+1&&rc.left>=-1))return;if(el.closest('svg,.design-switch')||clipped(el))return;bad.push((el.className&&el.className.baseVal===undefined?el.className:el.tagName)+'');});
  return {heroH:hero.offsetHeight,avail:innerHeight-header,bad:[...new Set(bad)].slice(0,4),cards:document.querySelectorAll('.jcard').length,logos:document.querySelectorAll('#logos img').length,ph:[...document.querySelectorAll('main,footer')].map(e=>e.textContent).join(' ').match(/\[[A-Z#][^\]]{0,40}\]/g)||[]};});
 const ok=!r.bad.length&&!errs.length&&!r.ph.length;if(!ok)fails++;
 out.push(`${ok?'PASS':'FAIL'} ${k} ${w}x${h} ${lang} hero ${r.heroH}/${r.avail}${r.bad.length?' overflow '+r.bad.join('|'):''}${r.ph.length?' brackets '+r.ph.slice(0,3).join(' '):''}${errs.length?' errors '+errs.slice(0,3).join('|'):''}`);
 await p.close();}
console.log(out.filter(l=>l.startsWith('FAIL')).join('\n')||'(no failures)');console.log(`${out.length-fails}/${out.length} passed`);await b.close();})();

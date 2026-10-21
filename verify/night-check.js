// New landing page: no errors, nothing off-screen, no bracket placeholders, at several sizes, EN + AR.
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const out=[];
for(const [w,h] of [[1440,900],[1024,768],[390,844],[360,740]])for(const lang of ['en','ar']){
 const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{try{sessionStorage.setItem('aion-night-loader','1')}catch(e){}});
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..','index.html')).href,{timeout:90000,waitUntil:'domcontentloaded'});
 if(lang==='ar')await p.click('button[data-lang="ar"]');await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>{document.querySelectorAll('.reveal,.split').forEach(e=>e.classList.add('in'));const W=innerWidth;
  const clipped=el=>{for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const o=getComputedStyle(a);if(/(hidden|clip|auto|scroll)/.test(o.overflowX))return true}return false};
  const bad=[...document.querySelectorAll('main *, footer *')].filter(el=>{const rc=el.getBoundingClientRect();if(!rc.width||el.closest('svg,.g3d,#trav'))return false;return (rc.right>W+1||rc.left<-1)&&!clipped(el)}).slice(0,4).map(e=>(typeof e.className==='string'?e.className:e.tagName));
  return {bad,sx:document.documentElement.scrollWidth-W,ph:(document.body.textContent.match(/\[[A-Z#][^\]]{0,30}\]/g)||[]).length};});
 const ok=!r.bad.length&&r.sx<=0&&!errs.length&&!r.ph;out.push(`${ok?'PASS':'FAIL'} ${w}x${h} ${lang} ${JSON.stringify(r)} ${errs.join('|')}`);await p.close();}
console.log(out.join('\n'));await b.close();})();

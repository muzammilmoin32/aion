// Section sweep: captures each landing section at tablet and phone widths. Usage: node sweep2.js <file> <tag> <w>
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [file,tag,w]=process.argv.slice(2);
const SECS=['#journeys','#layer','#lens','#platform','#numbers','#principles','#proof','#shipped','#contact','.site-footer'];
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
const p=await b.newPage({viewport:{width:+w,height:900}});
await p.goto(url.pathToFileURL(path.resolve(__dirname,'..',file)).href);await p.waitForTimeout(1500);
const bad=await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelector('.design-switch').style.display='none';
 const W=innerWidth,out=[];const clipped=el=>{for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const o=getComputedStyle(a);if(/(hidden|clip|auto|scroll)/.test(o.overflowX))return true}return false};
 document.querySelectorAll('main *, footer *').forEach(el=>{const r=el.getBoundingClientRect();if(!r.width||el.closest('svg'))return;if((r.right>W+1||r.left<-1)&&!clipped(el))out.push((typeof el.className==='string'?el.className:el.tagName).slice(0,30)+' '+Math.round(r.left)+'..'+Math.round(r.right));});return [...new Set(out)].slice(0,8)});
console.log(tag,w,'overflow:',JSON.stringify(bad));
for(const s of SECS){const el=p.locator(s).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(500);await el.screenshot({path:path.resolve(__dirname,'..','screenshots',`S2-${tag}-${w}-${s.replace(/[#.]/g,'')}.png`)});}
await b.close();})();

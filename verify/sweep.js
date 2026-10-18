// Responsive sweep: viewport captures of the hero at many widths for one page.
// Usage: node sweep.js <file> <tag> [section]
const path=require('path');const url=require('url');const {chromium}=require('playwright-core');
const [file='landing-c-video/index.html',tag='cv',sec='#top']=process.argv.slice(2);
const W=[[1280,800],[1112,834],[1024,1366],[820,1180],[600,960],[414,896],[360,780],[320,640]];
(async()=>{const b=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright','chromium-1243','chrome-win64','chrome.exe')});
for(const [w,h] of W){const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto(url.pathToFileURL(path.resolve(__dirname,'..',file)).href);await p.waitForTimeout(2200);
 await p.evaluate(s=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));if(s!=='#top')document.querySelector(s).scrollIntoView({behavior:'instant'});},sec);await p.waitForTimeout(700);
 await p.screenshot({path:path.resolve(__dirname,'..','screenshots',`S-${tag}-${sec.slice(1)}-${w}.png`)});await p.close();}
await b.close();})();

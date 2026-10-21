'use strict';

/*
 * Aion "Night" theme: motion layer (loaded last, after app.js / landing.js).
 *  1. Loader: an Aion-teal screen, ring counts in, then folds into the header logo (once per session).
 *  2. Light stream: one glowing ribbon of fibres down the page (WebGL2), pinched to a bright point
 *     beside the hero phone, soft and out of focus through the middle sections.
 *  3. Double tilt on every hero phone: the phone tilts toward the pointer and leans back as the hero
 *     scrolls away, while its back frame and the floating KPI / step cards sit at other depths and
 *     slide against it.
 *  4. Cursor ring, header glass on scroll, eased wheel scrolling.
 * Everything respects prefers-reduced-motion and coarse pointers.
 */
(() => {
  const root = document.documentElement;
  root.dataset.skin = 'night';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sst = (t) => t * t * (3 - 2 * t);
  const loopFns = [];
  const base = () => document.body.dataset.base || '';
  let seenLoader = false;
  try { seenLoader = sessionStorage.getItem('aion-night-loader') === '1'; } catch (e) { /* storage blocked */ }
  const showLoader = !reduce && !seenLoader;
  if (showLoader) root.classList.add('th-boot');
  let finished = false;
  let finish = () => { root.classList.remove('th-boot'); };
  const done = () => { if (finished) return; finished = true; finish(); };
  if (showLoader) setTimeout(done, 4000);   // fail-safe: never leave the hero hidden

  /* ------------------------------------------------------------------ shared rAF loop */
  let lastT = performance.now();
  function loop(t) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, Math.max(0, (t - lastT) / 1000));
    lastT = t;
    for (let i = loopFns.length - 1; i >= 0; i -= 1) {
      try { loopFns[i](t, dt); } catch (e) { console.warn(e); loopFns.splice(i, 1); }
    }
  }

  /* ------------------------------------------------------------------ eased wheel scrolling */
  const SS = (() => {
    // settings: window.AION_SCROLL (waves-settings.js). Touch screens keep their native momentum scrolling.
    const SC = (() => { const u = window.AION_SCROLL || {}; const n = (v, d, lo, hi) => (v !== null && v !== '' && Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
      return { enabled: u.enabled !== false, smoothness: n(u.smoothness, 1, 0.3, 3), wheelSpeed: n(u.wheelSpeed, 1, 0.3, 3), keyboard: u.keyboard !== false }; })();
    if (reduce || coarse || !SC.enabled) return { start() {}, to(y) { scrollTo(0, y); } };
    const rate = 5.5 / SC.smoothness;   // higher smoothness = longer, softer glide
    let aim = null;   // { el, off } while gliding to an in-page anchor
    let target = scrollY; let cur = scrollY; let active = false; let locked = true;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.shiftKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // let scrollable panels (menus, dialogs, chip rows) scroll themselves
      for (let el = e.target; el && el !== document.body; el = el.parentElement) {
        if (el.matches && el.matches('dialog, .nav-panel, .mega')) return;
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return;
      }
      if (document.querySelector('dialog[open]')) return;
      e.preventDefault();
      if (locked) return;
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 40; else if (e.deltaMode === 2) d *= innerHeight;
      d *= SC.wheelSpeed;
      if (!active) { target = cur = scrollY; }
      aim = null;
      target = clamp(target + d, 0, max());
      active = true;
    }, { passive: false });
    addEventListener('scroll', () => { if (!active) { target = cur = scrollY; } }, { passive: true });
    const stop = () => { if (active) { active = false; aim = null; target = cur = scrollY; } };
    addEventListener('pointerdown', stop);
    // keyboard scrolling glides too (arrows, Page Up/Down, Space, Home/End), unless the key belongs to a control
    const KEYS = { ArrowDown: 1, ArrowUp: -1, PageDown: 2, PageUp: -2, ' ': 2, Home: -3, End: 3 };
    addEventListener('keydown', (e) => {
      const k = KEYS[e.key];
      const t = e.target;
      const own = t && t.closest && t.closest('input, textarea, select, button, [contenteditable], [role="slider"], [role="tablist"], [role="radiogroup"], [role="menu"], dialog, .nav-panel, .mega');
      const mods = e.altKey || e.ctrlKey || e.metaKey;
      // during the loader the page must not move (its overflow lock does not hold on every page)
      if (locked) { if (k !== undefined && !own && !mods) e.preventDefault(); return; }
      // any key we leave to the browser ends a running glide first, so the glide cannot drag the page back afterwards
      if (!SC.keyboard || k === undefined || mods || own || document.querySelector('dialog[open], .nav-panel.is-open') || e.defaultPrevented) { stop(); return; }
      e.preventDefault();
      if (!active) { target = cur = scrollY; }
      aim = null;
      const step = Math.abs(k) === 1 ? 120 : innerHeight * 0.85;
      if (Math.abs(k) === 3) target = k > 0 ? max() : 0;
      else target = clamp(target + Math.sign(k) * (e.shiftKey && e.key === ' ' ? -1 : 1) * step, 0, max());
      active = true;
    });
    loopFns.push((t, dt) => {
      if (!active) return;
      // re-aim each frame: heroes above the anchor can still change height during the glide
      if (aim) target = clamp(aim.el.getBoundingClientRect().top + scrollY - aim.off, 0, max());
      const d = target - cur;
      cur += d * (1 - Math.exp(-dt * rate));
      if (Math.abs(d) < 0.4) { cur = target; active = false; aim = null; }
      window.scrollTo(0, Math.round(cur * 100) / 100);
    });
    return { start() { locked = false; target = cur = scrollY; }, to(y, el, off = 0) { aim = el ? { el, off } : null; target = clamp(y, 0, max()); cur = scrollY; active = true; } };
  })();

  /* ------------------------------------------------------------------ light stream (WebGL2) */
  /* Waves settings: waves-settings.js (window.AION_WAVES) overrides these defaults. */
  const WV = (() => {
    const d = {
      enabled: true,
      colors: { main: [60, 228, 212], core: [92, 200, 255], white: [235, 255, 250], dust: [210, 255, 248], point: [77, 235, 219] },
      fibres: 110, fibreBrightness: 1.35, fibreThickness: 1, ribbonWidth: 1, glowLayers: 40, glowLayersMobile: 12, flowSpeed: 1, waviness: 1,
      dust: 1.6, dustSpeed: 1, dustSpread: 1, bokeh: 0.16, specks: 90,
      boost: { extraDust: 2.2, brighterDust: 0.7, brighterGlow: 0.45, easeSeconds: 0.35 },
      path: { brightPointX: 0.62, brightPointXMobile: 0.86, swingInSoftSections: 0.68, swingElsewhere: 0.42, bendEveryScreens: 1.3, endSweep: true },
      drawAhead: 0.72, drawDelay: 0, blurAll: true, blurAmount: 1, softEdge: 150, heroBrightness: 1, sectionBrightness: 0.7, closingBrightness: 0.85,
    };
    const u = window.AION_WAVES || {};
    // a typo in the settings file ("fast", 1,8) falls back to the default instead of hiding the dust
    const num = (v, def, lo, hi) => (v !== null && v !== '' && Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : def);
    return { ...d, ...u, dustSpeed: num(u.dustSpeed, d.dustSpeed, 0, 4), dustSpread: num(u.dustSpread, d.dustSpread, 0, 3), drawAhead: num(u.drawAhead, d.drawAhead, 0.4, 1.5), drawDelay: num(u.drawDelay, d.drawDelay, 0, 3), blurAmount: num(u.blurAmount, d.blurAmount, 0, 1), colors: { ...d.colors, ...(u.colors || {}) }, boost: { ...d.boost, ...(u.boost || {}) }, path: { ...d.path, ...(u.path || {}) } };
  })();
  const gf = (v) => Number(v).toFixed(4);                          // number -> GLSL float
  const gc = (c) => `vec3(${c.map((x) => gf(x / 255)).join(',')})`; // [r,g,b] -> GLSL vec3

  function StreamGL(c) {
    const gl = c.getContext('webgl2', { antialias: !coarse, alpha: true, premultipliedAlpha: true, powerPreference: coarse ? 'default' : 'high-performance' });
    if (!gl) return null;
    const TW = 2048;
    const COMMON = `#version 300 es
precision highp float;
uniform sampler2D uPath; uniform vec2 uRes; uniform float uScroll,uTime,uHead,uFogA,uFogB; uniform vec2 uZ[8]; uniform int uZN;
vec4 P(int i,int k){return texelFetch(uPath,ivec2(i%${TW},(i/${TW})*2+k),0);}
// soft focus inside every marked section (.fogzone), sharp in the gaps between them
float focusAt(float y){ float b=0.; for(int i=0;i<8;i++){ if(i>=uZN) break; vec2 z=uZ[i]; b=max(b, smoothstep(z.x,z.x+${gf(WV.softEdge)},y)*(1.-smoothstep(z.y-${gf(WV.softEdge)},z.y,y))); } return 1.-b*${gf(WV.blurAmount)}; }   // blurAmount: how far out of focus the soft zones go
float headAt(float y){return smoothstep(uHead+30.,uHead-220.,y);}
float frontAt(float y){float d=(y-uHead+70.)/70.;return exp(-d*d);}
vec4 clip(vec2 p){return vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,0.,1.);}
`;
    const VS_LINE = COMMON + `
uniform int uFirst; uniform float uPass; uniform float uBoost;
in vec4 aS1; in vec4 aS2; in vec3 aCol;
out float vD; out float vHW; out float vW; out float vA; out vec3 vC; out float vS; out float vPh; out float vSp;
void main(){
  int i=uFirst+gl_VertexID/2; float side=float(gl_VertexID%2)*2.-1.;
  vec4 a=P(i,0), b=P(i,1); float w=b.x, sq=b.y, R=b.z, s=b.w;
  float o=aS1.x*w*sq + aS1.y*(3.+24.*(1.-sq)) + aS1.z*w*.05*sq + sin(s*6.+uTime*.16*aS2.x+aS1.w)*w*${gf(0.07 * WV.waviness)}*sq;
  float f=focusAt(a.y), hw, al;
  o=mix(o,clamp(o,-R*.85,R*.85),f);   // only keep fibres from folding where they are in sharp focus
  if(uPass<.5){ hw=aS2.z*.5+1.2; vW=aS2.z*.5; al=aS2.y*f; }
  else if(uPass<1.5){ hw=mix(8.,52.,1.-f); vW=0.; al=aS2.y*mix(.11,.15,1.-f); }
  else { hw=mix(70.,190.,1.-f); vW=0.; al=mix(.03,.07,1.-f); o=0.; }
  vec2 pos=a.xy+a.zw*(o+side*hw); pos.y-=uScroll;
  al*=1.+${gf(WV.boost.brighterGlow)}*uBoost;
  vD=side*hw; vHW=hw; vA=al*headAt(a.y)*(1.+2.2*frontAt(a.y)*f); vC=aCol; vS=s; vPh=aS1.w; vSp=aS2.x;
  gl_Position=clip(pos);
}`;
    const FS_LINE = `#version 300 es
precision highp float;
uniform float uPass,uTime; in float vD,vHW,vW,vA,vS,vPh,vSp; in vec3 vC; out vec4 o;
void main(){ float a;
  float pulse=pow(.5+.5*sin(vS*46.-uTime*(.45+vSp*.75)+vPh*7.),10.);
  if(uPass<.5) a=clamp(vW+.65-abs(vD),0.,1.)*(.62+1.5*pulse);
  else { float t=abs(vD)/vHW; a=exp(-t*t*3.2); }
  a*=vA; o=vec4(vC*a,a); }`;
    const VS_SPR = COMMON + `
uniform float uN,uKnotI,uBoost;
in vec4 aP; in vec4 aK;      // aP: u|x, offset|y, speed px/s, radius   aK: phase, kind, alpha, cyan mix
out vec2 vUv; out float vA; out float vKind; out vec3 vCol;
void main(){
  vec2 q=vec2(float(gl_VertexID%2),float(gl_VertexID/2))*2.-1.;
  float kind=aK.y; vec2 c; float y, foc;
  float tw=.6+.4*sin(uTime*(1.5+aK.x)+aK.x*9.);
  if(kind>2.5){                                  // 3: faint dust scattered over the whole page
    c=vec2(aP.x*uRes.x+sin(uTime*.2+aK.x*7.)*14., aP.y+cos(uTime*.15+aK.x*5.)*10.);
    y=c.y; foc=mix(.35,1.,focusAt(y)); vA=aK.z*tw*foc;
  } else {
    float fi;
    if(kind>.5&&kind<1.5) fi=uKnotI;            // 1: the bright point
    else fi=fract(aP.x+uTime*aP.z/(6.*uN))*(uN-2.);   // 0 dust rushing along the ribbon, 2 bokeh drifting
    int i=int(fi); float fr=fi-float(i);
    vec4 a=mix(P(i,0),P(i+1,0),fr), b=mix(P(i,1),P(i+1,1),fr);
    float spread=(kind>1.5)? (b.x*b.y+60.)*1.8 : (b.x*b.y+24.);
    float o=(kind>.5&&kind<1.5)?0.:aP.y*spread + sin(uTime*1.3+aK.x*11.)*(kind>1.5?18.:4.);
    if(kind<.5){ float f0=focusAt(a.y); o=mix(o,clamp(o,-b.z*.85,b.z*.85),f0); }   // like the fibres: dust must not fold through a tight bend
    c=a.xy+a.zw*o; y=a.y; foc=focusAt(y);
    float al = aK.z<0. ? -aK.z*uBoost : aK.z*(1.+${gf(WV.boost.brighterDust)}*uBoost);   // negative alpha: extra particles that appear only when boosted
    vA = (kind>.5&&kind<1.5) ? .94+.06*sin(uTime*.9)*(1.+uBoost) : al*tw*foc;
  }
  vA*=headAt(y);
  c.y-=uScroll;
  vUv=q; vKind=kind; vCol=mix(${gc(WV.colors.dust)},vec3(.6,.88,1.),aK.w);
  gl_Position=clip(c+q*aP.w);
}`;
    const FS_SPR = `#version 300 es
precision highp float;
in vec2 vUv; in float vA,vKind; in vec3 vCol; out vec4 o;
void main(){ float r2=dot(vUv,vUv); vec3 col=vCol; float a;
  if(vKind>.5&&vKind<1.5){ a=.5*exp(-r2*60.)+.22*exp(-r2*12.)+.07*exp(-r2*3.); col=mix(${gc(WV.colors.point)},vec3(.92,1.,.98),exp(-r2*40.)); }
  else if(vKind>1.5&&vKind<2.5){ float r=sqrt(r2); a=(smoothstep(1.,.86,r)*.55+.45*exp(-r2*2.2))*smoothstep(1.,.97,r); }
  else { a=exp(-r2*4.)+.6*exp(-r2*14.); }
  a*=vA; if(a<.002) discard; o=vec4(col*a,a); }`;
    function prog(vs, fs) {
      const p = gl.createProgram();
      for (const [t, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
        const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
        gl.attachShader(p, s);
      }
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
      return p;
    }
    const PL = prog(VS_LINE, FS_LINE); const PS = prog(VS_SPR, FS_SPR);
    if (!PL || !PS) return null;
    const names = ['uPath', 'uRes', 'uScroll', 'uTime', 'uHead', 'uFogA', 'uFogB', 'uFirst', 'uPass', 'uN', 'uKnotI', 'uBoost', 'uZ', 'uZN'];
    const uL = {}; const uS = {};
    names.forEach((n) => { uL[n] = gl.getUniformLocation(PL, n); uS[n] = gl.getUniformLocation(PS, n); });
    const tex = gl.createTexture(); const vaoL = gl.createVertexArray(); const vaoS = gl.createVertexArray(); const bufL = gl.createBuffer(); const bufS = gl.createBuffer();
    let boost = 0;
    let zones = [];
    let W; let H; let dpr; let pts = []; let pinch = 0; let head = 0; let built = false; let fogA = 0; let fogB = 0; let nStr = 0; let nSpr = 0; let started = false; let startT = 0; let maxS = 0;
    const GLOW = Math.round(coarse ? WV.glowLayersMobile : WV.glowLayers);
    c.addEventListener('webglcontextlost', (e) => { e.preventDefault(); built = false; });
    const abs = (el) => { const r = el.getBoundingClientRect(); return { t: r.top + scrollY, h: r.height }; };

    function build() {
      const heroEl = document.querySelector('.hero');
      if (!heroEl) return;
      dpr = coarse ? 1 : Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); gl.viewport(0, 0, c.width, c.height);
      const k = Math.min(1.15, Math.max(0.6, W / 1400)) * WV.ribbonWidth;
      const hero = abs(heroEl); const hh = hero.t + hero.h;
      const docH = document.documentElement.scrollHeight;
      maxS = Math.max(0, docH - H);
      const endEl = document.getElementById('contact');
      const end = endEl ? abs(endEl) : { t: docH - H, h: H };
      // soft (out-of-focus) zone: the sections between the hero and the close
      // soft zones only where the page marks them (.fogzone, up to 8); the stream stays sharp elsewhere
      zones = [...document.querySelectorAll('.fogzone')].slice(0, 8).map((el) => { const r = abs(el); return [r.t + 20, r.t + r.h - 20]; }).filter((z) => z[1] - z[0] > 300);
      if (WV.blurAll) {
        // one soft zone from the end of the hero to the top of the last section: every section, gap and bend in between blurs
        // heroes are not reading sections (the mockups page stacks eight of them in <main>): no reading sections, no blur
        const secs = document.querySelectorAll('main > section:not(.hero)');
        if (secs.length) { const lastSec = abs(secs[secs.length - 1]); if (lastSec.t - hh > 400) zones = [[hh + 40, lastSec.t - 20]]; }
      }
      const fzr = zones.length ? { t: zones[0][0], h: zones[zones.length - 1][1] - zones[0][0] } : null;
      if (fzr) { fogA = fzr.t; fogB = fzr.t + fzr.h; } else { fogA = fogB = -1e6; }
      const inZone = (yy) => zones.some((z) => yy > z[0] && yy < z[1]);
      const rtl = root.dir === 'rtl';
      const X = (f) => (rtl ? 1 - f : f);
      const vx = W < 1000 ? WV.path.brightPointXMobile : WV.path.brightPointX;              // bright point sits beside the phone (away from the copy on phones)
      const cp = [[X(1.18), -hh * 0.32, 300, 1], [X(0.86), hh * 0.18, 240, 0.6], [X(vx), hh * 0.6, 40, 0], [X(0.3), hh * 0.92, 190, 0.5], [X(0.22), hh * 1.18, 230, 0.85]];
      let y = hh * 1.18; let n = 0; const stepY = Math.max(700, H * WV.path.bendEveryScreens); const stopY = end.t - H * (WV.path.endSweep ? 0.9 : 0.35);
      // wide edge-to-edge swings only inside a soft zone (with blurAll: every bend up to the last section); otherwise a gentle meander that stays clear of the text column
      while (y + stepY < stopY) { y += stepY; n += 1; const sw = inZone(y) ? WV.path.swingInSoftSections : WV.path.swingElsewhere; cp.push([X(n % 2 ? 0.5 - sw : 0.5 + sw), y, inZone(y) ? 320 : 200, 1]); }
      if (WV.path.endSweep) {
        // one smooth sweep behind the closing card, then off the bottom (no tight corners)
        const last = cp[cp.length - 1];
        const from = last[0] > 0.5 ? 1 : 0;
        cp.push([X(from ? 0.78 : 0.22), end.t - H * 0.2, 240, 1], [X(0.5), end.t + end.h * 0.5, 200, 0.9], [X(from ? 0.2 : 0.8), end.t + end.h + H * 0.3, 240, 1], [X(from ? 0.1 : 0.9), Math.max(docH, end.t + end.h) + H, 240, 1]);
      } else {
        cp.push([X(-0.25), end.t + 40, 230, 0.9], [X(0.45), end.t + end.h * 0.4, 90, 0.08], [X(1.25), end.t + end.h * 0.8, 240, 0.95], [X(0.5), Math.max(docH, end.t + end.h) + 300, 240, 1]);
      }
      const raw = [];
      for (let i = 0; i < cp.length - 1; i += 1) {
        const p0 = cp[Math.max(0, i - 1)]; const p1 = cp[i]; const p2 = cp[i + 1]; const p3 = cp[Math.min(cp.length - 1, i + 2)];
        const steps = Math.max(60, Math.round(Math.hypot((p2[0] - p1[0]) * W, p2[1] - p1[1]) / 3));
        for (let s = 0; s < steps; s += 1) {
          const t = s / steps; const t2 = t * t; const t3 = t2 * t; const sm = sst(t);
          const cr = (j) => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
          raw.push([cr(0) * W, cr(1), lerp(p1[2], p2[2], sm) * k, lerp(p1[3], p2[3], sm)]);
        }
      }
      const SP = 6; pts = [raw[0].slice()]; let need = SP;
      for (let i = 1; i < raw.length; i += 1) {
        let [ax, ay, aw, aq] = raw[i - 1]; const q = raw[i]; let d = Math.hypot(q[0] - ax, q[1] - ay);
        while (d >= need) { const f = need / d; ax += (q[0] - ax) * f; ay += (q[1] - ay) * f; aw += (q[2] - aw) * f; aq += (q[3] - aq) * f; pts.push([ax, ay, aw, aq]); d -= need; need = SP; }
        need -= d;
      }
      const NPt = pts.length; const nx = new Float32Array(NPt); const ny = new Float32Array(NPt); const R = new Float32Array(NPt); const cap = new Float32Array(NPt); const tmp = new Float32Array(NPt);
      for (let i = 0; i < NPt; i += 1) { const a = pts[Math.max(0, i - 3)]; const b = pts[Math.min(NPt - 1, i + 3)]; const dx = b[0] - a[0]; const dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; nx[i] = -dy / l; ny[i] = dx / l; }
      for (let i = 0; i < NPt; i += 1) { const a = Math.max(0, i - 8); const b = Math.min(NPt - 1, i + 8); let dt = Math.abs(Math.atan2(ny[b], nx[b]) - Math.atan2(ny[a], nx[a])); if (dt > Math.PI) dt = 2 * Math.PI - dt; R[i] = dt < 1e-4 ? 1e6 : ((b - a) * SP) / dt; }
      for (let i = 0; i < NPt; i += 1) cap[i] = Math.min(pts[i][2], R[i] * 0.7 / Math.max(pts[i][3], 0.05));
      for (let pass = 0; pass < 2; pass += 1) { tmp.set(cap); for (let i = 0; i < NPt; i += 1) { let m = 1e9; for (let j = Math.max(0, i - 14); j <= Math.min(NPt - 1, i + 14); j += 1) m = Math.min(m, tmp[j]); cap[i] = m; } }
      tmp.set(cap);
      for (let i = 0; i < NPt; i += 1) { let s2 = 0; let c2 = 0; for (let j = Math.max(0, i - 18); j <= Math.min(NPt - 1, i + 18); j += 1) { s2 += tmp[j]; c2 += 1; } cap[i] = s2 / c2; }
      let mq = 9; pinch = 0;
      for (let i = 0; i < NPt && pts[i][1] < hh; i += 1) if (pts[i][3] < mq) { mq = pts[i][3]; pinch = i; }
      const rows = Math.ceil(NPt / TW); const data = new Float32Array(TW * rows * 2 * 4);
      for (let i = 0; i < NPt; i += 1) {
        const x0 = i % TW; const y0 = Math.floor(i / TW) * 2;
        data.set([pts[i][0], pts[i][1], nx[i], ny[i]], (y0 * TW + x0) * 4);
        data.set([Math.min(pts[i][2], Math.max(cap[i], (i > pinch + 200 ? 150 : 0) * pts[i][3])), pts[i][3], Math.min(R[i], 1e6), i * SP / 1000], ((y0 + 1) * TW + x0) * 4);
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TW, rows * 2, 0, gl.RGBA, gl.FLOAT, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      // fibres: Aion teal, a cyan core, a few white
      const Rn = ((s) => () => { s = Math.sin(s * 9301 + 49297) * 233280; return s - Math.floor(s); })(11); const N = Math.max(8, Math.round(WV.fibres)); const st = [];
      for (let i = 0; i < N; i += 1) {
        const f = (i / (N - 1)) * 2 - 1; const mid = Math.abs(f + 0.1) < 0.35; const r = Rn();
        const col = r < 0.06 ? WV.colors.white : (mid && r < 0.55) ? WV.colors.core : WV.colors.main;
        st.push({ f, col, a: (0.12 + Rn() * 0.32) * WV.fibreBrightness, lw: (0.45 + Rn() * 0.8) * WV.fibreThickness, ph: Rn() * 6.283, nz: (Rn() - 0.5) * 2, core: Math.pow(Rn(), 1.6) * (Rn() < 0.5 ? -1 : 1), sp: 0.2 + Rn() * 0.6 });
      }
      for (let i = st.length - 1; i > 0; i -= 1) { const j = Math.floor(Rn() * (i + 1)); [st[i], st[j]] = [st[j], st[i]]; }
      const inst = new Float32Array(N * 11);
      st.forEach((s, i) => inst.set([s.f, s.core, s.nz, s.ph, s.sp, s.a, s.lw, 0, s.col[0] / 255, s.col[1] / 255, s.col[2] / 255], i * 11));
      nStr = N;
      gl.bindVertexArray(vaoL); gl.bindBuffer(gl.ARRAY_BUFFER, bufL); gl.bufferData(gl.ARRAY_BUFFER, inst, gl.STATIC_DRAW);
      [['aS1', 4, 0], ['aS2', 4, 16], ['aCol', 3, 32]].forEach(([nm, sz, off]) => { const l = gl.getAttribLocation(PL, nm); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, sz, gl.FLOAT, false, 44, off); gl.vertexAttribDivisor(l, 1); });
      const sp = []; const docH2 = document.documentElement.scrollHeight;
      // 0: dust inside the ribbon, rushing along it
      const ND = Math.round(NPt * WV.dust); const dS = WV.dustSpeed; const dW = WV.dustSpread;
      for (let i = 0; i < ND; i += 1) { const cy = Rn() < 0.22 ? 1 : 0; sp.push(Rn(), (Rn() - 0.5) * 1.3 * dW * (Rn() < 0.75 ? 1 : 1.8), (70 + Rn() * 190) * dS, 1.4 + Math.pow(Rn(), 2.5) * 2.8, Rn() * 6.28, 0, 0.7 + Rn() * 0.6, cy); }
      // 0b: extra dust that only shows while "Show what's behind it" is on
      for (let i = 0; i < Math.round(NPt * WV.boost.extraDust); i += 1) { const cy = Rn() < 0.35 ? 1 : 0; sp.push(Rn(), (Rn() - 0.5) * 1.6 * dW, (90 + Rn() * 260) * dS, 1.2 + Math.pow(Rn(), 2.2) * 3.2, Rn() * 6.28, 0, -(0.8 + Rn() * 0.6), cy); }
      // 2: soft bokeh discs drifting around the ribbon
      const NB = Math.round(NPt * WV.bokeh);
      for (let i = 0; i < NB; i += 1) sp.push(Rn(), (Rn() - 0.5) * 2, 10 + Rn() * 30, 4 + Math.pow(Rn(), 1.5) * 18, Rn() * 6.28, 2, 0.08 + Rn() * 0.2, Rn() < 0.4 ? 1 : 0);
      // 3: faint specks scattered over the whole page
      const NF = Math.round(docH2 / H * WV.specks);
      for (let i = 0; i < NF; i += 1) sp.push(Rn(), Rn() * docH2, 0, 0.6 + Rn() * 1.1, Rn() * 6.28, 3, 0.12 + Rn() * 0.3, Rn() < 0.3 ? 1 : 0);
      // 1: the bright point
      sp.push(0, 0, 0, 190, 0, 1, 1, 0); nSpr = sp.length / 8;
      gl.bindVertexArray(vaoS); gl.bindBuffer(gl.ARRAY_BUFFER, bufS); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sp), gl.STATIC_DRAW);
      [['aP', 4, 0], ['aK', 4, 16]].forEach(([nm, sz, off]) => { const l = gl.getAttribLocation(PS, nm); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, sz, gl.FLOAT, false, 32, off); gl.vertexAttribDivisor(l, 1); });
      gl.bindVertexArray(null);
      built = true;
    }
    function draw(now, dt) {
      if (!built) return;
      dt = dt || 0.016; const t = now * 0.001 * WV.flowSpeed; const sy = scrollY;
      const intro = started ? sst(clamp((now - startT) / 1600)) : 0;
      // the drawing tip stays on screen (drawAhead × screen height) and moves with the scroll itself:
      // scroll fast and it draws fast, scroll slowly and it draws slowly. drawDelay > 0 adds a lag in seconds.
      // over the last half-screen of scroll the tip runs ahead and off the bottom, so the closing sweep always finishes
      const tail = sst(clamp((sy - (maxS - H * 0.5)) / (H * 0.5)));
      const ahead = WV.drawAhead + (Math.max(WV.drawAhead, 1.4) - WV.drawAhead) * tail;
      const target = sy + H * (0.08 + (ahead - 0.08) * intro);
      head = Number.isFinite(head) && WV.drawDelay > 0 ? head + (target - head) * (1 - Math.exp(-dt / WV.drawDelay)) : target;
      let i0 = 0; while (i0 < pts.length - 1 && pts[i0][1] < sy - 340) i0 += 1;
      let i1 = i0; while (i1 < pts.length - 1 && pts[i1][1] < Math.min(sy + H + 340, head + 60)) i1 += 1;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (i1 - i0 < 2) return;
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      const set = (u) => { gl.uniform1i(u.uPath, 0); gl.uniform2f(u.uRes, W, H); gl.uniform1f(u.uScroll, sy); gl.uniform1f(u.uTime, t); gl.uniform1f(u.uHead, head); gl.uniform1f(u.uFogA, fogA); gl.uniform1f(u.uFogB, fogB); gl.uniform1i(u.uZN, zones.length); if (zones.length) gl.uniform2fv(u.uZ, new Float32Array(zones.flat().concat(new Array(16 - zones.length * 2).fill(-1e6)))); };
      gl.useProgram(PL); set(uL); gl.uniform1f(uL.uBoost, boost); gl.uniform1i(uL.uFirst, i0); gl.bindVertexArray(vaoL);
      const n = (i1 - i0 + 1) * 2;
      gl.uniform1f(uL.uPass, 2); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, n, 1);
      gl.uniform1f(uL.uPass, 1); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, n, GLOW);
      gl.uniform1f(uL.uPass, 0); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, n, nStr);
      // ease the particle boost toward the switch state
      const want = root.dataset.behind === 'on' ? 1 : 0;
      boost += (want - boost) * (1 - Math.exp(-dt / Math.max(0.05, WV.boost.easeSeconds)));
      gl.useProgram(PS); set(uS); gl.uniform1f(uS.uN, pts.length); gl.uniform1f(uS.uKnotI, pinch); gl.uniform1f(uS.uBoost, boost); gl.bindVertexArray(vaoS);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, nSpr);
      gl.bindVertexArray(null);
    }
    let rtm;
    const rebuild = () => { clearTimeout(rtm); rtm = setTimeout(() => { try { build(); } catch (e) { console.warn(e); } }, 150); };
    let lw = innerWidth; let lh = innerHeight;
    addEventListener('resize', () => {
      if (innerWidth === lw && Math.abs(innerHeight - lh) < 150) return;   // mobile toolbar show/hide
      lw = innerWidth; lh = innerHeight; rebuild();
    });
    addEventListener('load', rebuild);
    document.addEventListener('aion:lang', rebuild);            // layout (and direction) changes with the language
    if (document.fonts) document.fonts.ready.then(rebuild);
    // section heights settle after reveals and videos load
    new ResizeObserver(rebuild).observe(document.body);
    try { build(); } catch (e) { console.warn(e); return null; }
    head = H * 0.08; loopFns.push(draw);
    // full brightness in the hero; dimmed behind the reading sections so text stays legible
    let dimLast = -1;
    loopFns.push(() => {
      const heroEl = document.querySelector('.hero'); if (!heroEl) return;
      const hEnd = heroEl.offsetTop + heroEl.offsetHeight;
      const ctaEl = document.getElementById('contact');
      const k = clamp((scrollY + innerHeight * 0.5 - hEnd * 0.75) / (innerHeight * 0.6));
      let o = WV.heroBrightness - k * (WV.heroBrightness - WV.sectionBrightness);
      if (ctaEl) { const c = ctaEl.getBoundingClientRect(); if (c.top < innerHeight * 0.6) o = Math.max(o, WV.closingBrightness); }
      if (Math.abs(o - dimLast) > 0.01) { c.style.opacity = o.toFixed(2); dimLast = o; }
    });
    return { build, start() { if (!started) { started = true; startT = performance.now(); } } };
  }

  /* ------------------------------------------------------------------ double tilt on the hero phones */
  function setupTilt() {
    if (reduce || typeof heroes === 'undefined') return;
    let mx = 0; let my = 0; let px = innerWidth / 2; let py = innerHeight / 2; let moved = true;
    addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; px = e.clientX; py = e.clientY; moved = true; }, { passive: true });
    let base = -15;
    const readBase = () => { base = parseFloat(getComputedStyle(root).getPropertyValue('--tilt')) || -15; };
    readBase();
    document.addEventListener('aion:lang', () => requestAnimationFrame(readBase));
    document.addEventListener('mouseleave', () => { mx = 0; my = 0; });
    const rigs = new Map();
    const rig = (h) => {
      if (rigs.has(h)) return rigs.get(h);
      const tilt = h.el.querySelector('.phone-tilt');
      if (!tilt) return null;
      tilt.style.position = 'relative';
      const back = document.createElement('span'); back.className = 'phone-back'; back.setAttribute('aria-hidden', 'true');
      tilt.prepend(back);
      const screen = h.el.querySelector('.phone-screen');
      if (!screen) return null;
      const glare = document.createElement('span'); glare.className = 'phone-glare'; glare.setAttribute('aria-hidden', 'true');
      screen.append(glare);
      h.el.classList.add('th-tilt');
      const r = { tilt, back, screen, glare, cards: [...h.el.querySelectorAll('.kpi, .toast')], cur: { rx: 4, ry: 0, rz: 0, ty: 0, s: 1, px: 0, py: 0 }, init: false };
      rigs.set(h, r);
      return r;
    };
    loopFns.push((t, dt) => {
      const mob = innerWidth < 1000 || coarse;
      const sign = base < 0 ? 1 : -1;   // base: -15° LTR, +15° RTL
      // reads first (all heroes), then writes
      const live = [];
      for (const h of heroes) {
        if (!h.visible || !h.settled || h.el.querySelector('.g3d')) continue;   // entrance first; glass heroes tilt via glass-hero.js
        const r = rig(h);
        if (!r) continue;
        live.push([h, r, h.el.getBoundingClientRect(), moved ? r.screen.getBoundingClientRect() : null]);
      }
      moved = false;
      for (const [h, r, box, sb] of live) {
        // lean back as this hero scrolls up and away
        const s = clamp(-box.top / (innerHeight * 0.9));
        const act = mob ? 0 : 1 - s * 0.6;
        const tg = {
          rx: (mob ? 4 : 6) - my * 16 * act + s * 22,
          ry: base + mx * 30 * act + s * 5 * sign,
          rz: (-base / 7) - s * 2 * sign,
          ty: -s * 36,
          s: 1 - s * 0.05,
          px: mx * act,
          py: my * act,
        };
        if (!r.init) { Object.assign(r.cur, tg); r.init = true; }
        const kf = 1 - Math.exp(-(dt || 0.016) * 11);
        for (const k in r.cur) r.cur[k] += (tg[k] - r.cur[k]) * kf;
        const c = r.cur;
        r.tilt.style.transform = `translate3d(0,${c.ty.toFixed(2)}px,0) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) rotateZ(${c.rz.toFixed(2)}deg) scale(${c.s.toFixed(4)})`;
        r.back.style.transform = `translate3d(${(c.px * 36).toFixed(1)}px,${(c.py * 24).toFixed(1)}px,-80px)`;
        // floating cards sit in front: they slide the other way
        // floating cards: the toast animates transform on each beat, so both use the translate property
        r.cards.forEach((el, i) => { el.style.translate = `${(-c.px * (34 + i * 10)).toFixed(1)}px ${(-c.py * (22 + i * 6)).toFixed(1)}px`; });
        if (sb) {
          r.glare.style.setProperty('--mx', `${(px - sb.left).toFixed(0)}px`);
          r.glare.style.setProperty('--my', `${(py - sb.top).toFixed(0)}px`);
        }
      }
    });
  }

  /* ------------------------------------------------------------------ boot */
  function init() {
    const body = document.body;
    const canvas = document.createElement('canvas'); canvas.id = 'th-stream'; canvas.setAttribute('aria-hidden', 'true');
    const grain = document.createElement('div'); grain.id = 'th-grain'; grain.setAttribute('aria-hidden', 'true');
    body.prepend(grain); body.prepend(canvas);
    const Stream = reduce || !WV.enabled ? null : StreamGL(canvas);

    // header glass once the page scrolls
    const hdr = document.querySelector('.site-header');
    const onScroll = () => hdr && hdr.classList.toggle('th-scrolled', scrollY > 20);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // in-page links glide with the eased scroll (after the page's own handlers have had their say)
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      let el = null;
      try { el = document.getElementById(decodeURIComponent(id.slice(1))); } catch (err) { el = null; }
      if (!el) return;
      e.preventDefault();
      const hh = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || document.querySelector('.site-header').offsetHeight;
      SS.to(el.getBoundingClientRect().top + scrollY - hh, el, hh);
      if (!el.matches('a,button,input,select,textarea,[tabindex]')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      history.pushState(null, '', id);
    });

    // cursor ring
    if (!coarse && !reduce) {
      const ring = document.createElement('div'); ring.id = 'th-ring'; ring.setAttribute('aria-hidden', 'true'); body.append(ring);
      let mx = -100; let my = -100; let x = -100; let y = -100;
      addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; ring.style.opacity = 1; ring.classList.toggle('big', !!e.target.closest('a,button,input,[role="switch"]')); }, { passive: true });
      loopFns.push((t, dt) => { const k = 1 - Math.exp(-(dt || 0.016) * 14); x += (mx - x) * k; y += (my - y) * k; ring.style.transform = `translate3d(${x}px,${y}px,0)`; });
    }

    setupTilt();
    requestAnimationFrame(loop);

    finish = () => { root.classList.remove('th-boot'); body.classList.remove('th-loading'); SS.start(); if (Stream) Stream.start(); const l = document.getElementById('th-loader'); if (l) l.remove(); };
    if (!showLoader) { done(); return; }

    // loader: Aion-teal screen, ring counts in, folds into the header logo
    try { sessionStorage.setItem('aion-night-loader', '1'); } catch (e) { /* storage blocked */ }
    body.classList.add('th-loading');
    const L = document.createElement('div'); L.id = 'th-loader'; L.setAttribute('aria-hidden', 'true');
    L.innerHTML = `<div id="th-lpanel"><div id="th-ltile"><svg id="th-lring" viewBox="0 0 100 100"><circle class="tr" cx="50" cy="50" r="46"/><circle id="th-lbar" cx="50" cy="50" r="46" stroke-dasharray="289" stroke-dashoffset="289" stroke-linecap="round"/></svg><img src="${base()}assets/logo-aion-white.png" alt=""></div><div id="th-lcount">0%</div></div>`;
    body.append(L);
    const panel = L.querySelector('#th-lpanel'); const bar = L.querySelector('#th-lbar'); const cnt = L.querySelector('#th-lcount'); const ringEl = L.querySelector('#th-lring'); const tile = L.querySelector('#th-ltile');
    const t0 = performance.now(); const dur = 1300;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - p, 2.2);
      cnt.textContent = `${Math.round(e * 100)}%`; bar.style.strokeDashoffset = 289 * (1 - e);
      if (p < 1) { requestAnimationFrame(tick); return; }
      fold();
    };
    async function fold() {
      try { await foldAnim(); } catch (e) { /* cancelled */ } finally { done(); L.remove(); }
    }
    async function foldAnim() {
      cnt.style.opacity = 0; ringEl.style.opacity = 0;
      const logo = document.querySelector('.site-header .logo');
      const m = logo ? logo.getBoundingClientRect() : { left: 24, top: 16, width: 100, height: 40 };
      await panel.animate([{ width: `${innerWidth}px`, height: `${innerHeight}px`, borderRadius: '0px' }, { width: '220px', height: '150px', borderRadius: '36px' }], { duration: 700, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
      done();
      if (!L.isConnected) return;
      tile.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
      await panel.animate([{ left: '50%', top: '50%', width: '220px', height: '150px', borderRadius: '36px', opacity: 1 }, { left: `${m.left + m.width / 2}px`, top: `${m.top + m.height / 2}px`, width: `${m.width}px`, height: `${m.height}px`, borderRadius: '10px', opacity: 0.0 }], { duration: 700, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
    }
    requestAnimationFrame(tick);
  }

  // This script is deferred and loads last: wait for DOMContentLoaded so app.js has built the heroes first.
  if (document.readyState === 'complete') init(); else document.addEventListener('DOMContentLoaded', init);
})();

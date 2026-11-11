import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

/* ================= utilities ================= */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const PAST=y=>y>0&&y<2026;
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[(r()*a.length)|0];
const fmt=t=>{t=Math.max(0,Math.ceil(t));return`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`};
const col=c=>new THREE.Color(c);
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const TOUCH=matchMedia('(pointer:coarse)').matches;

/* ================= renderer & post ================= */
const cv=$('stage');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
let DPR=Math.min(devicePixelRatio||1,TOUCH?1.5:2);
renderer.setPixelRatio(DPR);
const camera=new THREE.PerspectiveCamera(42,1,.1,600);
const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);

const rt=new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,samples:TOUCH?2:4});
const composer=new EffectComposer(renderer,rt);
const renderPass=new RenderPass(scene,camera);
const bloom=new UnrealBloomPass(new THREE.Vector2(256,256),.6,.55,.82);
const outPass=new OutputPass();
const GradeShader={
  uniforms:{tDiffuse:{value:null},uRes:{value:new THREE.Vector2(1,1)},uTime:{value:0},uSat:{value:1},uCon:{value:1},uMul:{value:new THREE.Vector3(1,1,1)},uAdd:{value:new THREE.Vector3()},
    uGrain:{value:.02},uVig:{value:.3},uLines:{value:0},uShift:{value:0},uRed:{value:0},uFlash:{value:0},uChroma:{value:0},uDesat:{value:0}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 uRes;uniform float uTime,uSat,uCon,uGrain,uVig,uLines,uShift,uRed,uFlash,uChroma,uDesat;uniform vec3 uMul,uAdd;varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec2 uv=vUv;vec2 d=uv-.5;float r=length(d);
    float ca=uChroma*r*r*.012+uShift/uRes.x;
    vec3 c;c.r=texture2D(tDiffuse,uv-d*ca*2.-vec2(uShift/uRes.x,0.)).r;c.g=texture2D(tDiffuse,uv).g;c.b=texture2D(tDiffuse,uv+d*ca).b;
    float l=dot(c,vec3(.3,.59,.11));
    c=mix(vec3(l),c,uSat);c=(c-.5)*uCon+.5;c=c*uMul+uAdd;
    c=mix(c,vec3(dot(c,vec3(.3,.59,.11))),uDesat);
    c*=1.-uVig*smoothstep(.32,.92,r*1.3);
    c+=(h(uv*uRes+fract(uTime*7.13)*100.)-.5)*uGrain;
    c*=1.-uLines*.14*step(.5,fract(gl_FragCoord.y*.5));
    c=mix(c,vec3(.75,.04,.03),uRed*smoothstep(.25,.85,r*1.4));
    c=mix(c,vec3(1.,.95,.86),uFlash);
    gl_FragColor=vec4(c,1.);}`
};
const grade=new ShaderPass(GradeShader);
composer.addPass(renderPass);composer.addPass(bloom);composer.addPass(outPass);composer.addPass(grade);
const GU=grade.uniforms;
const FILM={
  oil:{sat:.92,con:1.04,mul:[1.08,.98,.84],add:[.04,.015,0],grain:.07,vig:.62},
  tintype:{sat:0,con:1.18,mul:[1.04,.98,.88],add:[.03,.01,0],grain:.11,vig:.65},
  sepia:{sat:0,con:.95,mul:[1.12,.92,.68],add:[.07,.03,-.01],grain:.1,vig:.58},
  bw:{sat:0,con:1.3,mul:[1,1,1],add:[0,0,0],grain:.12,vig:.6},
  kodak:{sat:1.28,con:1.05,mul:[1.04,.98,.88],add:[.05,.03,.06],grain:.045,vig:.32},
  faded:{sat:.76,con:.88,mul:[.92,.88,.8],add:[.12,.09,.07],grain:.055,vig:.38},
  vhs:{sat:1.22,con:1.05,mul:[1,1,1],add:[0,0,.02],grain:.05,vig:.42,lines:.7,shift:1.3,chroma:1},
  crt:{sat:1.05,con:1.05,mul:[.95,1,1.08],add:[0,0,.02],grain:.035,vig:.36,lines:1},
  none:{sat:1.04,con:1.02,mul:[1,1,1],add:[0,0,0],grain:.018,vig:.22},
  future:{sat:1.05,con:1.04,mul:[.88,1.02,1.08],add:[0,.012,.03],grain:.012,vig:.3,chroma:.6},
  deep:{sat:1.1,con:1.06,mul:[.95,.9,1.1],add:[0,0,.02],grain:.012,vig:.48,chroma:.8}
};
function setFilm(k){const f=FILM[k]||FILM.none;GU.uSat.value=f.sat;GU.uCon.value=f.con;GU.uMul.value.set(...f.mul);GU.uAdd.value.set(...f.add);GU.uGrain.value=f.grain*(RM?.25:.5);GU.uVig.value=f.vig;GU.uLines.value=f.lines||0;GU.uShift.value=f.shift||0;GU.uChroma.value=f.chroma||0}

let W=1,H=1;
function resize(){
  W=innerWidth;H=innerHeight;renderer.setPixelRatio(DPR);renderer.setSize(W,H,false);composer.setPixelRatio(DPR);composer.setSize(W,H);
  bloom.resolution.set(W*DPR*.5,H*DPR*.5);GU.uRes.value.set(W*DPR,H*DPR);camera.aspect=W/H;camera.updateProjectionMatrix();
}
addEventListener('resize',resize);

/* ================= procedural textures ================= */
function canvasTex(w,h,draw,{srgb=true,repeat=true}={}){
  const c=document.createElement('canvas');c.width=w;c.height=h;const o=c.getContext('2d');draw(o,w,h);
  const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping}
  t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
function noiseFill(o,w,h,n,a,r=Math.random){for(let i=0;i<n;i++){o.fillStyle=r()<.5?`rgba(0,0,0,${a*r()})`:`rgba(255,255,255,${a*r()*.8})`;const s=1+r()*3;o.fillRect(r()*w,r()*h,s,s)}}
function shadeHex(hex,k){const c=col(hex);c.r=clamp(c.r*k,0,1);c.g=clamp(c.g*k,0,1);c.b=clamp(c.b*k,0,1);return'#'+c.getHexString()}

/* ground textures: 512px tile = 6 world units */
const GROUND={
  cobbles(o,w,h,c,r){o.fillStyle=shadeHex(c,.55);o.fillRect(0,0,w,h);const rows=16,rh=h/rows;
    for(let y=0;y<rows;y++){const off=(y%2)*20;for(let x=-40+off;x<w+40;x+=40){const sx=x+(r()-.5)*4,sy=y*rh,k=.75+r()*.5;o.fillStyle=shadeHex(c,k);o.beginPath();o.ellipse(sx+18,sy+rh/2,17,rh*.42,0,0,7);o.fill();
      o.fillStyle='rgba(255,255,255,.07)';o.beginPath();o.ellipse(sx+15,sy+rh*.4,10,rh*.18,0,0,7);o.fill()}}noiseFill(o,w,h,2500,.18,r)},
  dirt(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);for(let i=0;i<60;i++){o.fillStyle=`rgba(${r()<.5?'0,0,0':'255,240,210'},${.04+r()*.06})`;o.beginPath();o.ellipse(r()*w,r()*h,20+r()*60,8+r()*20,r()*3,0,7);o.fill()}
    o.strokeStyle='rgba(60,40,20,.18)';o.lineWidth=2;for(let i=0;i<14;i++){o.beginPath();const y=r()*h;o.moveTo(0,y);for(let x=0;x<w;x+=32)o.lineTo(x,y+(r()-.5)*8);o.stroke()}noiseFill(o,w,h,5000,.2,r)},
  sand(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);o.strokeStyle='rgba(120,90,50,.12)';o.lineWidth=3;for(let y=0;y<h;y+=18){o.beginPath();for(let x=0;x<=w;x+=16)o.lineTo(x,y+Math.sin(x*.03+y)*5);o.stroke()}noiseFill(o,w,h,6000,.12,r)},
  asphalt(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);noiseFill(o,w,h,9000,.22,r);o.strokeStyle='rgba(0,0,0,.25)';o.lineWidth=1.5;for(let i=0;i<5;i++){o.beginPath();let x=r()*w,y=r()*h;o.moveTo(x,y);for(let k=0;k<6;k++){x+=(r()-.5)*60;y+=(r()-.5)*60;o.lineTo(x,y)}o.stroke()}},
  pavement(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);const s=w/6;for(let y=0;y<6;y++)for(let x=0;x<6;x++){o.fillStyle=shadeHex(c,.92+r()*.16);o.fillRect(x*s+2,y*s+2,s-4,s-4)}noiseFill(o,w,h,3000,.08,r)},
  snow(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);for(let i=0;i<40;i++){o.fillStyle=`rgba(${r()<.5?'150,170,200':'255,255,255'},${.08+r()*.1})`;o.beginPath();o.ellipse(r()*w,r()*h,30+r()*60,10+r()*20,r()*3,0,7);o.fill()}
    o.fillStyle='rgba(90,100,120,.12)';for(let i=0;i<30;i++){const x=r()*w,y=r()*h;o.beginPath();o.ellipse(x,y,5,8,0,0,7);o.fill();o.beginPath();o.ellipse(x+9,y+16,5,8,0,0,7);o.fill()}noiseFill(o,w,h,2000,.06,r)},
  tiles(o,w,h,c,r){o.fillStyle=shadeHex(c,.7);o.fillRect(0,0,w,h);const s=w/4;for(let y=0;y<4;y++)for(let x=0;x<4;x++){o.fillStyle=shadeHex(c,.95+r()*.1);o.fillRect(x*s+3,y*s+3,s-6,s-6);o.fillStyle='rgba(255,255,255,.05)';o.fillRect(x*s+3,y*s+3,s-6,4)}noiseFill(o,w,h,1500,.05,r)},
  grid(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);noiseFill(o,w,h,1500,.06,r);o.fillStyle=shadeHex(c,1.3);const s=w/4;for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(r()<.25)o.fillRect(x*s+4,y*s+4,s-8,s-8)},
  grass(o,w,h,c,r){o.fillStyle=c;o.fillRect(0,0,w,h);for(let i=0;i<9000;i++){o.fillStyle=`rgba(${r()<.5?'20,50,10':'190,230,120'},${.15+r()*.2})`;o.fillRect(r()*w,r()*h,1.5,3+r()*4)}}
};
function groundTex(kind,c,seed){const r=rng(seed);return canvasTex(512,512,(o,w,h)=>GROUND[kind](o,w,h,c,r))}
/* emissive line overlay for neon floors */
function lineTex(c,glow){return canvasTex(256,256,(o,w,h)=>{o.fillStyle='#000';o.fillRect(0,0,w,h);o.strokeStyle=c;o.lineWidth=glow?3:2;o.shadowColor=c;o.shadowBlur=glow?10:4;o.strokeRect(1,1,w-2,h-2)})}

/* building facades: 128x256 = 4 x 8 world units; separate color + emissive */
function facade(style,base,win,litC,lit,seed){
  const r=rng(seed),cw=128,chh=256;
  const map=canvasTex(cw,chh,(o,w,h)=>{
    o.fillStyle=base;o.fillRect(0,0,w,h);noiseFill(o,w,h,900,.14,r);
    if(style==='brick'||style==='gable'){o.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<h;y+=6){o.fillRect(0,y,w,1);for(let x=(y/6%2)*8;x<w;x+=16)o.fillRect(x,y,1,6)}}
    if(style==='glass'){const g=o.createLinearGradient(0,0,w,h);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.2)');o.fillStyle=g;o.fillRect(0,0,w,h);
      o.fillStyle='rgba(0,0,0,.35)';for(let x=0;x<w;x+=16)o.fillRect(x,0,2,h);for(let y=0;y<h;y+=32)o.fillRect(0,y,w,2)}
    if(style==='deco'){o.fillStyle='rgba(255,255,255,.07)';for(let x=12;x<w;x+=32)o.fillRect(x,0,6,h)}
    if(style==='wood'){o.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<h;y+=10)o.fillRect(0,y,w,2)}
    if(style!=='glass'){for(let y=18;y<h-14;y+=32)for(let x=12;x<w-14;x+=32){o.fillStyle=win;o.fillRect(x,y,18,22);o.fillStyle='rgba(255,255,255,.12)';o.fillRect(x,y,18,2);o.fillStyle='rgba(0,0,0,.35)';o.fillRect(x-2,y+22,22,3)}}
  });
  const em=canvasTex(cw,chh,(o,w,h)=>{
    o.fillStyle='#000';o.fillRect(0,0,w,h);
    const rr=rng(seed+7);
    if(style==='glass'){for(let y=4;y<h;y+=32)for(let x=2;x<w;x+=16)if(rr()<lit){o.fillStyle=Array.isArray(litC)?pick(rr,litC):litC;o.globalAlpha=.55+rr()*.45;o.fillRect(x+2,y,12,26)}}
    else for(let y=18;y<h-14;y+=32)for(let x=12;x<w-14;x+=32)if(rr()<lit){o.fillStyle=Array.isArray(litC)?pick(rr,litC):litC;o.globalAlpha=.6+rr()*.4;o.fillRect(x,y,18,22);o.globalAlpha=.25;o.fillRect(x-2,y-2,22,26)}
    o.globalAlpha=1;
  });
  return{map,em};
}
const softTex=canvasTex(64,64,(o,w,h)=>{const g=o.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');o.fillStyle=g;o.fillRect(0,0,w,h)},{repeat:false});
const cloudTex=canvasTex(256,128,(o,w,h)=>{const r=rng(9);for(let i=0;i<26;i++){const x=40+r()*176,y=50+r()*40,R=18+r()*34,g=o.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');o.fillStyle=g;o.fillRect(0,0,w,h)}},{repeat:false});

/* ================= audio ================= */
let AC=null,master=null,muted=false,amb=null;
try{muted=localStorage.getItem('tl-muted')==='1'}catch(e){}
function audio(){if(AC)return AC;try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:.55;master.connect(AC.destination)}catch(e){AC=null}return AC}
function beep(f,d,type='square',v=.06,slide=0){const a=audio();if(!a||muted)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02)}
function noise(d,v=.12,f0=1200,f1=200,q=1){const a=audio();if(!a||muted)return;const n=a.sampleRate*d|0,b=a.createBuffer(1,n,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<n;i++)ch[i]=Math.random()*2-1;
  const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;s.buffer=b;fl.type='bandpass';fl.Q.value=q;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(fl);fl.connect(g);g.connect(master);s.start(t)}
const SFX={
  hit(){noise(.12,.18,1800,300,.8);beep(160,.08,'square',.05,.5)},
  swing(){noise(.12,.05,600,2400,2)},
  hurt(){beep(140,.18,'sawtooth',.07,.4);noise(.15,.12,800,150)},
  dash(){noise(.22,.08,300,3000,1.5)},
  coin(){beep(1320,.06,'square',.03);setTimeout(()=>beep(1760,.08,'square',.03),50)},
  pick(){beep(660,.08,'triangle',.07);setTimeout(()=>beep(990,.12,'triangle',.07),70)},
  ok(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.18,'triangle',.07),i*90))},
  bad(){[300,220,150].forEach((f,i)=>setTimeout(()=>beep(f,.25,'sawtooth',.06),i*140))},
  rift(){beep(70,.6,'sawtooth',.06,2.5);noise(.6,.08,200,1800,3)},
  shot(){beep(900,.1,'square',.025,.4)},
  whoosh(){noise(1.6,.16,120,4000,1.2);beep(55,1.6,'sawtooth',.05,8)},
  boom(){noise(.8,.25,400,40,.6);beep(50,.8,'sine',.12,.5)},
  click(){beep(1800,.025,'square',.025)},
  tick(){beep(2400,.02,'square',.02)}
};
function stopAmb(){if(!amb)return;const old=amb,a=AC;amb=null;clearInterval(old.iv);try{old.g.gain.setTargetAtTime(0,a.currentTime,.6)}catch(e){}setTimeout(()=>{try{old.g.disconnect()}catch(e){}},3000)}
/* era music: each era has its own key, tempo, chords, instrument and a fixed arpeggio figure (no random notes) */
const Q={M:[0,4,7],m:[0,3,7],M7:[0,4,7,11],m7:[0,3,7,10],s:[0,5,7],d:[0,3,6]};
const MUS={
 1610:{r:50,bpm:84,n:8,inst:'pluck',pad:1,prog:[[0,'m'],[-2,'M'],[-4,'M'],[-5,'m']],fig:[[0,1,2,3,2,1,2,-1],[0,2,1,3,2,4,3,-1]]},/* baroque harpsichord */
 1869:{r:55,bpm:96,n:8,inst:'pluck',pad:0,prog:[[0,'M'],[0,'M'],[5,'M'],[7,'M']],fig:[[0,-1,1,2,-1,1,2,-1],[0,-1,2,1,-1,2,3,-1]]},/* frontier guitar */
 1903:{r:58,bpm:132,n:6,inst:'bell',pad:1,prog:[[0,'M'],[5,'M'],[7,'M'],[0,'M']],fig:[[2,1,0,1,2,3],[3,2,1,2,3,4]]},/* music-box waltz */
 1927:{r:46,bpm:104,n:8,inst:'ep',pad:1,swing:.3,prog:[[0,'m7'],[5,'m7'],[7,'m7'],[0,'m7']],fig:[[0,-1,2,-1,3,2,-1,1],[3,-1,2,-1,1,-1,0,2]]},/* smoky jazz */
 1957:{r:49,bpm:92,n:8,inst:'ep',pad:1,prog:[[0,'M'],[9,'m'],[5,'M'],[7,'M']],fig:[[2,-1,2,-1,1,-1,2,0],[1,-1,1,-1,0,-1,1,2]]},/* doo-wop */
 1969:{r:55,bpm:72,n:8,inst:'ep',pad:2,prog:[[0,'M7'],[2,'M'],[0,'M7'],[7,'M']],fig:[[0,-1,-1,2,-1,-1,4,-1],[1,-1,-1,3,-1,-1,5,-1]]},/* dreamy */
 1985:{r:41,bpm:108,n:8,inst:'synth',pad:1,bass:1,prog:[[0,'m'],[-4,'M'],[-2,'M'],[-5,'M']],fig:[[0,1,2,1,0,1,2,3],[0,1,2,3,2,1,2,1]]},/* synthwave arps */
 1999:{r:49,bpm:100,n:8,inst:'ep',pad:2,bass:1,prog:[[0,'m7'],[-2,'M7'],[-4,'M7'],[-7,'M']],fig:[[0,-1,-1,1,-1,2,-1,-1],[2,-1,-1,1,-1,0,-1,-1]]},/* chill downtempo */
 2026:{r:55,bpm:78,n:8,inst:'ep',pad:2,prog:[[0,'M7'],[9,'m7'],[5,'M7'],[7,'s']],fig:[[0,-1,2,-1,3,-1,2,-1],[1,-1,3,-1,4,-1,3,-1]]},/* lo-fi calm */
 2088:{r:52,bpm:96,n:8,inst:'bell',pad:2,bass:1,prog:[[0,'m7'],[-4,'M7'],[-2,'M'],[-7,'M']],fig:[[0,2,3,2,0,2,3,4],[3,2,0,2,3,4,3,2]]},/* neon-city glass */
 2150:{r:44,bpm:66,n:8,inst:'bell',pad:2,prog:[[0,'m7'],[3,'M7'],[-2,'M7'],[-4,'M']],fig:[[0,-1,-1,-1,2,-1,-1,-1],[3,-1,-1,-1,1,-1,-1,-1]]},/* cold orbit */
 2240:{r:62,bpm:84,n:8,inst:'synth',pad:2,prog:[[0,'M7'],[7,'M'],[9,'m7'],[5,'M7']],fig:[[0,1,2,3,4,3,2,1],[4,3,2,1,0,1,2,3]]},/* bright future */
 2400:{r:46,bpm:60,n:8,inst:'bell',pad:2,prog:[[0,'m'],[-2,'M'],[-4,'M7'],[-5,'m']],fig:[[0,-1,2,-1,-1,3,-1,-1],[2,-1,1,-1,-1,0,-1,-1]]},/* ruins */
 2600:{r:58,bpm:76,n:8,inst:'ep',pad:2,prog:[[0,'M7'],[2,'M'],[4,'m7'],[2,'M']],fig:[[0,-1,1,2,-1,3,-1,2],[2,-1,3,4,-1,3,-1,1]]},
 0:{r:46,bpm:58,n:8,inst:'bell',pad:2,prog:[[0,'d'],[-2,'m'],[-4,'d'],[-5,'m']],fig:[[0,-1,-1,2,-1,-1,1,-1],[2,-1,-1,0,-1,-1,3,-1]]},/* the end */
 [-1]:{r:44,bpm:64,n:8,inst:'bell',pad:2,prog:[[0,'M7'],[7,'M7'],[5,'M7'],[7,'s']],fig:[[0,2,4,2,0,2,4,5],[1,3,5,3,1,3,5,6]]}/* nexus: serene arpeggios */
};
function setAmbient(year){
  const a=audio();if(!a)return;stopAmb();if(muted)return;
  const keys=Object.keys(MUS).map(Number);
  const P=MUS[year]||MUS[keys[Math.abs(year|0)%keys.length]];
  const sw=P.swing||0,step=60/P.bpm/2;
  const out=a.createGain();out.gain.value=0;
  const dl=a.createDelay(1);dl.delayTime.value=step*3;const fb=a.createGain();fb.gain.value=.26;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=800;
  out.connect(master);out.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(master);
  const hz=n=>P.r*Math.pow(2,n/12);
  const env=(g,t,d,v,at=.01)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+at);g.gain.exponentialRampToValueAtTime(.0001,t+d)};
  const osc=(type,fr,t,d,v,at,dest)=>{const x=a.createOscillator(),g=a.createGain();x.type=type;x.frequency.value=fr;env(g,t,d,v,at);x.connect(g);g.connect(dest||out);x.start(t);x.stop(t+d+.05)};
  const voice=(fr,t,len)=>{
    if(P.inst==='pluck'){osc('triangle',fr,t,.7,.07,.005);osc('sine',fr*2,t,.3,.02,.005)}
    else if(P.inst==='bell'){osc('sine',fr,t,2.2,.06,.005);osc('sine',fr*2.76,t,.5,.006,.005)}
    else if(P.inst==='ep'){osc('sine',fr,t,1.3,.08,.008);osc('sine',fr*2,t,.35,.025,.008);}
    else{const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(800,t);f.frequency.exponentialRampToValueAtTime(220,t+.35);f.connect(out);osc('sawtooth',fr,t,.4,.045,.005,f)}};
  const padNote=(fr,t,d)=>{osc('sine',fr,t,d,.034,d*.35);osc('sine',fr*1.004,t,d,.026,d*.35)};
  let i=0;
  const tick=()=>{if(!AC||muted)return;const bar=Math.floor(i/P.n),k=i%P.n,ch=P.prog[bar%4],tones=Q[ch[1]],base=ch[0]+24;
    const t=a.currentTime+.06+((k%2&&sw)?step*sw:0);
    if(k===0){const d=step*P.n*.98;if(P.pad){tones.forEach(x=>padNote(hz(base+x-24),t,d))}if(P.bass||P.pad===1)osc('sine',hz(base-24+0),t,d*.7,.1,.02)}
    if(P.bass&&k%4===0)osc('sine',hz(base-24),t,step*3,.09,.01);
    const fig=P.fig[Math.floor(bar/2)%2][k];
    if(fig>=0){const oct=Math.floor(fig/tones.length),nt=tones[fig%tones.length];voice(hz(base+nt+12*oct-12),t)}
    i++};
  const iv=setInterval(tick,step*1000);
  out.gain.setTargetAtTime(.4,a.currentTime,1.2);amb={o:[],g:out,iv};tick()
}
function setMuted(m){muted=m;try{localStorage.setItem('tl-muted',m?'1':'0')}catch(e){}if(master)master.gain.value=m?0:.55;$('mute').textContent=m?'✕':'♪';$('mute').setAttribute('aria-label',m?'Activar sonido':'Silenciar')}

/* ================= shared geometry/material cache ================= */
const KEEP=new Set();
const GEO={};
function geo(key,make){if(!GEO[key]){GEO[key]=make();KEEP.add(GEO[key])}return GEO[key]}
const MATS={};
function mat(c,o={}){const k=c+JSON.stringify(o);if(!MATS[k]){MATS[k]=new THREE.MeshStandardMaterial({color:c,roughness:.75,metalness:0,...o});KEEP.add(MATS[k])}return MATS[k]}
function glow(c,i=2.5,o={}){return mat('#000000',{emissive:c,emissiveIntensity:i,roughness:.4,...o})}
function addMat(c,op=1){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})}
const BOX=()=>geo('box',()=>new THREE.BoxGeometry(1,1,1));
const CYL=()=>geo('cyl',()=>new THREE.CylinderGeometry(.5,.5,1,20));
const SPH=()=>geo('sph',()=>new THREE.SphereGeometry(.5,24,16));
function mesh(g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1,shadow=true){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);if(shadow){o.castShadow=true;o.receiveShadow=true}return o}
function box(m,x,y,z,sx,sy,sz,sh=true){return mesh(BOX(),m,x,y,z,sx,sy,sz,sh)}
function cyl(m,x,y,z,r,h,sh=true){return mesh(CYL(),m,x,y,z,r*2,h,r*2,sh)}
function sph(m,x,y,z,r,sh=true){return mesh(SPH(),m,x,y,z,r*2,r*2,r*2,sh)}
function disposeTree(o,skip){o.traverse(n=>{if(n.geometry&&!KEEP.has(n.geometry))n.geometry.dispose();const ms=n.material?(Array.isArray(n.material)?n.material:[n.material]):[];ms.forEach(m=>{if(KEEP.has(m)||(skip&&skip.has(m)))return;['map','emissiveMap','roughnessMap','alphaMap'].forEach(k=>{if(m[k]&&m[k]!==softTex&&m[k]!==cloudTex&&!(skip&&skip.has(m[k])))m[k].dispose()});m.dispose()})})}

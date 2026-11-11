
/* ================= character rigs ================= */
const SUIT={coat:'#334152',pants:'#1e2530',skin:'#e2b48c',hair:'#3a2618',scarf:'#b8452e',goggles:true,belt:'#c9a24a',boots:'#2a1a10',hat:'none',cape:null};
const LORD_SUIT={...SUIT,hat:'crown',hatC:'#ffd24a',cape:'#8a1a2a'};
const HUNTER_FIT={coat:'#221a30',pants:'#120c1c',skin:'#6a6070',hair:'#0e0a14',hat:'visor',hatC:'#ff2a4a',hood:'#1a1226',cape:'#4a1a68',boots:'#0a0810'};
const ELITE_FIT={coat:'#3a1018',pants:'#1c080c',skin:'#6a6070',hair:'#0e0a14',hat:'visor',hatC:'#ffd24a',hood:'#260a10',cape:'#a81a2a',boots:'#0a0408'};
const LORD_FIT={coat:'#f4ecd8',pants:'#3a2c14',skin:'#d8d0e8',hair:'#ffffff',hat:'crown',hatC:'#ffd24a',cape:'#8a1a2a',dress:true,longHair:true,belt:'#ffd24a',boots:'#3a2c14'};
const MERCHANT_FIT={coat:'#5a2a7a',pants:'#2a1440',skin:'#c68b5e',hair:'#e8e8f0',hat:'top',hatC:'#2a1440',dress:true,longHair:true,scarf:'#ffd24a'};
const NPC_SKIN=['#e2b48c','#c68b5e','#8d5a3b','#f0c9a6','#6b4430'],NPC_HAIR=['#2a1a10','#5a3a20','#c9a050','#1a1a1a','#8a8a8a','#7a2a14'];

/* ---- modelled humanoid kit (Blender -> GLB, recoloured per outfit) ---- */
let KIT=null;
const KROUGH={coat:.75,pants:.85,skin:.55,hair:.9,boots:.5,belt:.3,trim:.6,shirt:.8};
function kitColors(f){return{coat:f.coat,pants:f.pants,skin:f.skin,hair:f.hair,boots:f.boots||'#1a1410',belt:f.belt||'#14100c',trim:'#14100c',shirt:f.shirt||f.hood||'#e8e0d0'}}
function kitPart(n,f){const o=KIT[n].clone(true),c=kitColors(f);o.traverse(m=>{if(m.isMesh){const k=m.material.name;m.material=mat(c[k]||'#888888',{roughness:KROUGH[k]||.7,metalness:k==='belt'&&f.belt?.85:0});m.castShadow=true}});return o}
function parseGlb(b64,names){return new Promise(res=>{try{const b=atob(b64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  new GLTFLoader().parse(u.buffer,'',g=>{try{const k={};for(const n of names){const o=g.scene.getObjectByName(n);if(!o)throw 0;k[n]=o}res(k)}catch(e){res(null)}},()=>res(null))}catch(e){res(null)}})}
let CK=null;
const CROUGH={eye:.3,horn:.5,tooth:.4};
const mixCol=(c,t,f)=>'#'+new THREE.Color(c).lerp(new THREE.Color(t),f).getHexString();
function crPart(n,map){const o=CK[n].clone(true);o.traverse(m=>{if(m.isMesh){const k=m.material.name;m.material=mat(map[k]||'#888888',{roughness:CROUGH[k]||.85});m.castShadow=true}});return o}
async function loadKit(){KIT=await parseGlb(KIT_B64,['leg','arm','torso','head']);CK=await parseGlb(CK_B64,['sauro_body','sauro_neck','sauro_leg','dino_body','dino_neck','dino_leg','mam_body','mam_leg','rap_torso','rap_head','rap_leg','tri_torso','tri_head','tri_leg'])}

function makeRig(fit,k=1){
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);body.scale.setScalar(k);
  const cm=mat(fit.coat,{roughness:.7}),pm=mat(fit.pants,{roughness:.8}),sk=mat(fit.skin,{roughness:.55}),hm=mat(fit.hair,{roughness:.9}),bm=mat(fit.boots||'#1a1410',{roughness:.5});
  const legs=[];for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.15,.95,0);if(KIT)p.add(kitPart('leg',fit));else{p.add(box(pm,0,-.42,0,.22,.84,.24));p.add(box(bm,0,-.86,.05,.25,.16,.36))}body.add(p);legs.push(p)}
  const torso=new THREE.Group();torso.position.y=.95;body.add(torso);
  if(KIT)torso.add(kitPart('torso',fit));else torso.add(box(cm,0,.44,0,.6,.86,.36));
  if(fit.dress)torso.add(mesh(geo('skirt',()=>new THREE.CylinderGeometry(.31,.46,.8,14)),cm,0,-.12,0));else if(!KIT)torso.add(box(cm,0,-.02,0,.6,.24,.35));
  if(fit.belt&&!KIT)torso.add(box(mat(fit.belt,{metalness:.85,roughness:.3}),0,.08,0,.63,.08,.38));
  const arms=[];for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.41,.8,0);if(KIT)p.add(kitPart('arm',fit));else{p.add(box(cm,0,-.32,0,.18,.7,.2));p.add(sph(sk,0,-.72,0,.09))}torso.add(p);arms.push(p)}
  const head=new THREE.Group();head.position.y=1.1;torso.add(head);
  if(KIT)head.add(kitPart('head',fit));else{head.add(mesh(SPH(),sk,0,.06,0,.46,.52,.46));
  head.add(mesh(DOME(),hm,0,.1,-.02,.5,.42,.5))}
  if(fit.longHair)head.add(box(hm,0,-.12,-.18,.42,.5,.12));
  const eye=mat('#140e0a');for(const s of[-1,1])head.add(sph(eye,s*.08,.08,KIT?.222:.215,.03,false));
  if(fit.scarf){const sc=new THREE.Mesh(TOR(.17,.06),mat(fit.scarf,{roughness:.9}));sc.rotation.x=Math.PI/2;sc.position.y=.9;torso.add(sc);torso.add(box(mat(fit.scarf),.12,.62,.2,.1,.3,.05))}
  if(fit.goggles){const gm=mat('#c9a24a',{metalness:.9,roughness:.2});for(const s of[-1,1]){const t=new THREE.Mesh(TOR(.07,.022),gm);t.position.set(s*.09,.25,.2);head.add(t);head.add(sph(glow('#ff9a3a',1.2),s*.09,.25,.2,.055,false))}head.add(box(mat('#3a2418'),0,.25,0,.48,.05,.46,false))}
  const hc=fit.hatC||'#222';
  switch(fit.hat){
    case'top':head.add(cyl(mat(hc),0,.48,0,.19,.42));head.add(cyl(mat(hc),0,.28,0,.32,.035));break;
    case'fedora':head.add(cyl(mat(hc),0,.38,0,.2,.2));head.add(cyl(mat(hc),0,.28,0,.34,.03));break;
    case'cap':head.add(mesh(DOME(),mat(hc),0,.2,0,.52,.36,.52));head.add(box(mat(hc),0,.2,.24,.36,.03,.2));break;
    case'visor':{if(fit.hood){head.add(mesh(SPH(),mat(fit.hood,{roughness:.9}),0,.1,-.05,.58,.62,.56))}head.add(box(glow(hc,4.5),0,.1,.22,.42,.08,.06,false));break}
    case'crown':{const gm=mat(hc,{metalness:.95,roughness:.2,emissive:'#ffaa20',emissiveIntensity:.8});head.add(cyl(gm,0,.34,0,.22,.14));for(let i=0;i<5;i++){const a=i/5*Math.PI*2;head.add(mesh(CONE(),gm,Math.sin(a)*.2,.48,Math.cos(a)*.2,.08,.16,.08))}head.add(sph(glow('#ff2a4a',4),0,.36,.22,.045,false));break}
  }
  let cape=null;if(fit.cape){cape=new THREE.Group();cape.position.set(0,.84,-.2);const cm2=mat(fit.cape,{roughness:.85,side:THREE.DoubleSide});cape.add(box(cm2,0,-.6,0,.62,1.25,.04));torso.add(cape)}
  g.traverse(o=>{if(o.isMesh){o.castShadow=true}});
  return{g,body,legs,arms,torso,head,cape,k,ph:Math.random()*6};
}

function makeDinoRig(fit){
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const cm=mat(fit.coat,{roughness:.85,flatShading:true}),bl=mat('#d8cfa0',{roughness:.9,flatShading:true}),eye=mat('#140e0a'),horn=mat('#efe6cc');
  const torso=new THREE.Group();torso.position.y=.9;body.add(torso);const head=new THREE.Group();torso.add(head);
  const legs=[new THREE.Group(),new THREE.Group()];const tri=Math.random()<.4;
  if(tri){legs[0].position.set(0,.7,0);legs[1].position.set(0,.7,0);body.add(legs[0]);body.add(legs[1]);
    if(CK){const mp={skin:fit.coat,belly:'#d8cfa0',horn:'#efe6cc',frill:'#8a5a3a',dark:mixCol(fit.coat,'#000000',.35),eye:'#140e0a'};
      torso.add(crPart('tri_torso',mp));head.position.set(0,.1,1.05);head.add(crPart('tri_head',mp));for(const sx of[-1,1])head.add(sph(eye,sx*.28,.1,.3,.05,false));
      for(const[x,z,i]of[[.35,.55,0],[-.35,.55,1],[.35,-.55,1],[-.35,-.55,0]]){const lp=crPart('tri_leg',mp);lp.position.set(x,0,z);legs[i].add(lp)}}
    else{torso.add(box(cm,0,.1,0,.95,.8,1.7));torso.add(box(bl,0,-.2,0,.8,.3,1.5));const tl=mesh(CONE(),cm,0,.05,-1.2,.45,1.2,.45);tl.rotation.x=-Math.PI/2;torso.add(tl);
    head.position.set(0,.1,1.05);head.add(box(cm,0,0,.2,.55,.5,.7));head.add(box(mat('#8a5a3a',{flatShading:true}),0,.35,-.05,1.1,.95,.12));
    for(const sx of[-1,1]){const h=mesh(CONE(),horn,sx*.18,.3,.6,.1,.5,.1);h.rotation.x=1.2;head.add(h);head.add(sph(eye,sx*.28,.1,.3,.05,false))}head.add(mesh(CONE(),horn,0,.05,.65,.1,.3,.1));
    for(const[x,z,i]of[[.35,.55,0],[-.35,.55,1],[.35,-.55,1],[-.35,-.55,0]])legs[i].add(box(cm,x,-.35,z,.28,.7,.3))}}
  else if(CK){const mp={skin:fit.coat,belly:'#d8cfa0',horn:'#efe6cc',dark:mixCol(fit.coat,'#000000',.4),tooth:'#f4f0e0',eye:'#140e0a'};
    for(const[i,s2]of[[0,-1],[1,1]]){legs[i].position.set(s2*.18,.75,-.05);legs[i].add(crPart('rap_leg',mp));body.add(legs[i])}
    torso.add(crPart('rap_torso',mp));head.position.set(0,.8,.7);head.add(crPart('rap_head',mp));for(const sx of[-1,1])head.add(sph(eye,sx*.16,.06,.1,.04,false))}
  else{for(const[i,s2]of[[0,-1],[1,1]]){legs[i].position.set(s2*.18,.75,-.05);legs[i].add(box(cm,0,-.37,0,.16,.75,.2));legs[i].add(box(bl,0,-.76,.1,.18,.1,.3));body.add(legs[i])}
    torso.add(box(cm,0,.05,0,.55,.6,1.2));torso.add(box(bl,0,-.2,.05,.45,.2,1));const tl=mesh(CONE(),cm,0,.1,-1.15,.4,1.7,.4);tl.rotation.x=-Math.PI/2;torso.add(tl);
    torso.add(box(cm,0,.45,.55,.25,.5,.3));head.position.set(0,.8,.7);head.add(box(cm,0,0,.15,.3,.28,.6));head.add(box(bl,0,-.12,.2,.26,.08,.5));for(const sx of[-1,1])head.add(sph(eye,sx*.16,.06,.1,.04,false))}
  const arms=[new THREE.Group(),new THREE.Group()];torso.add(arms[0]);torso.add(arms[1]);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true});
  return{g,body,legs,arms,torso,head,cape:null,k:1,ph:Math.random()*6};
}
function animRig(R,dt,{moving=false,speed=1,swing=0,wind=0,hurt=0,dead=0,dash=0}={}){
  R.ph+=dt*(moving?9*speed:2);const s=moving?Math.sin(R.ph):0,a=moving?.75:0;
  R.legs[0].rotation.x=s*a;R.legs[1].rotation.x=-s*a;
  R.arms[0].rotation.x=-s*a*.8;R.arms[1].rotation.x=s*a*.8;
  R.arms[0].rotation.z=-.06;R.arms[1].rotation.z=.06;
  R.body.position.y=moving?Math.abs(Math.cos(R.ph))*.06:Math.sin(R.ph*.5)*.012;
  R.torso.rotation.x=moving?.08:0;
  if(wind>0){R.arms[1].rotation.x=-2.6;R.arms[1].rotation.z=.5;R.torso.rotation.y=.4}
  else if(swing>0){const k=swing/.18;R.arms[1].rotation.x=-2.4+(1-k)*3.2;R.arms[1].rotation.z=.2;R.torso.rotation.y=-.5*(1-k)}
  else R.torso.rotation.y*=.8;
  if(dash>0){R.torso.rotation.x=.45;R.legs[0].rotation.x=-.9;R.legs[1].rotation.x=.6}
  if(R.cape)R.cape.rotation.x=.12+(moving?.35+Math.sin(R.ph*2)*.08:Math.sin(R.ph)*.04)+(dash>0?.6:0);
  R.body.rotation.z=hurt>0?Math.sin(hurt*60)*.08:0;
  if(dead>0){R.body.rotation.x=-Math.PI/2*(1-dead/.5);R.body.position.y=.15}
}
function faceTo(R,ang,dt,k=14){let d=ang-R.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));R.g.rotation.y+=d*Math.min(1,dt*k)}

/* ================= player ================= */
const ch={x:0,z:0,fx:1,fz:0,moving:false,target:null,openOnArrive:null,carry:0,cells:0,hp:100,maxHp:100,dmg:20,spd:1,timeB:0,dashK:1,regen:2,armor:1,coinK:1,coolK:1,
  atkCd:0,dashCd:0,dashT:0,dashX:0,dashZ:0,inv:0,swing:0,kbx:0,kbz:0,regenWait:0,stepT:0,rig:null,carryMesh:null,hurtT:0};
let PSUIT=SUIT;
function buildPlayer(){if(ch.rig){scene.remove(ch.rig.g)}ch.rig=makeRig(PSUIT,1);scene.add(ch.rig.g);
  const sh=new THREE.Mesh(geo('blob',()=>new THREE.CircleGeometry(.5,24)),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.25,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;ch.rig.g.add(sh);
  const aura=new THREE.PointLight('#ffd8a8',12,7,1.6);aura.position.set(0,2.6,1.4);ch.rig.g.add(aura);ch.aura=aura;ch.gearObjs=[];if(typeof refreshGearVisual==='function')refreshGearVisual()}

/* ================= DOM labels (damage, bubbles, arrows) ================= */
const LBL=$('labels');const labels=[];
const _v=new THREE.Vector3();
function project(x,y,z){_v.set(x,y,z).project(camera);return{x:(_v.x*.5+.5)*W,y:(-_v.y*.5+.5)*H,behind:_v.z>1}}
function floatText(x,y,z,txt,c,big){const d=document.createElement('div');d.className='fl';d.textContent=txt;d.style.color=c;if(big)d.style.fontSize='22px';LBL.appendChild(d);labels.push({d,x,y,z,vy:1.4,life:.9,max:.9})}
function updateLabels(dt){
  for(let i=labels.length-1;i>=0;i--){const l=labels[i];l.life-=dt;l.y+=l.vy*dt;if(l.life<=0){l.d.remove();labels.splice(i,1);continue}const p=project(l.x,l.y,l.z);l.d.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;l.d.style.opacity=Math.min(1,l.life/l.max*2)}
  if(!WD)return;
  for(const n of WD.npcs){
    if(n.bt>0&&n.bubble&&!n.dying){n.bt-=dt;if(!n.bd){n.bd=document.createElement('div');n.bd.className='bubble'+(n.kind==='hunter'?' h':n.kind==='lord'?' l':'');LBL.appendChild(n.bd)}n.bd.textContent=n.bubble;const p=project(n.x,2.5*(n.k||1)+.3,n.z);n.bd.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;n.bd.hidden=p.behind}
    else if(n.bd){n.bd.remove();n.bd=null}
    if((n.kind==='hunter'||n.peer||n.kind==='cbot'||(n.kind==='guardian'&&n.hostile))&&!n.dying){if(!n.hd){n.hd=document.createElement('div');n.hd.style.cssText='position:absolute;left:0;top:0;width:44px;height:5px;background:#200814;border:1px solid #000;border-radius:2px;overflow:hidden';n.hd.innerHTML=`<i style="display:block;height:100%;background:${n.elite?'#ffd24a':'#b44aff'}"></i>`;LBL.appendChild(n.hd)}
      const p=project(n.x,2.35*(n.k||1),n.z);n.hd.style.transform=`translate(${p.x-22}px,${p.y}px)`;n.hd.firstChild.style.width=(100*Math.max(0,n.hp/n.maxHp))+'%'}
    else if(n.hd){n.hd.remove();n.hd=null}
  }
}
function clearLabels(){labels.forEach(l=>l.d.remove());labels.length=0;LBL.querySelectorAll('.bubble,.arrow,div').forEach(d=>d.remove());arrowEl=null}
let arrowEl=null;
function updateArrow(){
  let tgt=null,cls='';if(mode==='play'&&G&&!G.over&&!busy()){const o=objectiveTarget();if(o){tgt=o.p;cls=o.c}}
  if(!tgt){if(arrowEl)arrowEl.hidden=true;return}
  const p=project(tgt.x,1.2,tgt.z);const m=60;const off=p.behind||p.x<m||p.x>W-m||p.y<m+60||p.y>H-m;
  if(!arrowEl){arrowEl=document.createElement('div');LBL.appendChild(arrowEl)}arrowEl.className='arrow '+cls;arrowEl.hidden=false;
  if(off){let dx=tgt.x-ch.x;const px=dx>0?W-36:36,py=clamp(p.y,120,H-140);arrowEl.style.transform=`translate(${px-11}px,${py}px) rotate(${dx>0?90:-90}deg)`}
  else{const bob=Math.sin(T*5)*6;arrowEl.style.transform=`translate(${p.x-11}px,${p.y-120+bob}px) rotate(180deg)`}
}

/* ================= particles ================= */
const FXN=1600;
const fxGeo=new THREE.BufferGeometry();const fxPos=new Float32Array(FXN*3),fxCol=new Float32Array(FXN*3),fxSize=new Float32Array(FXN);
fxGeo.setAttribute('position',new THREE.BufferAttribute(fxPos,3));fxGeo.setAttribute('color',new THREE.BufferAttribute(fxCol,3));fxGeo.setAttribute('aSize',new THREE.BufferAttribute(fxSize,1));
const fxMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true,uniforms:{map:{value:softTex},px:{value:1}},
  vertexShader:`attribute float aSize;varying vec3 vC;uniform float px;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*px*300./-mv.z;gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform sampler2D map;varying vec3 vC;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vC*2.2*t.a,t.a);}`});
const fxPts=new THREE.Points(fxGeo,fxMat);fxPts.frustumCulled=false;scene.add(fxPts);
const FX=[];let fxHead=0;
for(let i=0;i<FXN;i++)FX.push({life:0});
function burst(x,y,z,c,n,sp=4,size=.35,up=2,grav=6){const cc=col(c);for(let i=0;i<n;i++){const p=FX[fxHead];fxHead=(fxHead+1)%FXN;const a=Math.random()*6.28,b=Math.random()*2-1,v=(.3+Math.random())*sp;
  p.x=x;p.y=y;p.z=z;p.vx=Math.cos(a)*v*Math.sqrt(1-b*b);p.vz=Math.sin(a)*v*Math.sqrt(1-b*b);p.vy=b*v+up;p.life=p.max=.45+Math.random()*.45;p.c=cc;p.s=size*(.6+Math.random()*.8);p.g=grav}}
function updateFx(dt){for(let i=0;i<FXN;i++){const p=FX[i];if(p.life>0){p.life-=dt;p.vy-=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.y<.05){p.y=.05;p.vy*=-.3;p.vx*=.6;p.vz*=.6}
    const k=Math.max(0,p.life/p.max);fxPos[i*3]=p.x;fxPos[i*3+1]=p.y;fxPos[i*3+2]=p.z;fxCol[i*3]=p.c.r*k;fxCol[i*3+1]=p.c.g*k;fxCol[i*3+2]=p.c.b*k;fxSize[i]=p.s*(.5+k*.5)}else fxSize[i]=0}
  fxGeo.attributes.position.needsUpdate=fxGeo.attributes.color.needsUpdate=fxGeo.attributes.aSize.needsUpdate=true}

/* transient meshes: slashes, shockwaves */
const TRANS=[];
function slash(x,z,ang,c='#ffe8c0',r=1.6){const m=new THREE.Mesh(geo('slash',()=>new THREE.RingGeometry(.7,1.6,28,1,-1.1,2.2)),addMat(c,.9));m.rotation.x=-Math.PI/2;m.rotation.z=ang-Math.PI/2;m.position.set(x,1.25,z);m.scale.setScalar(r/1.6);scene.add(m);TRANS.push({m,life:.2,max:.2,kind:'slash'})}
function updateTrans(dt){for(let i=TRANS.length-1;i>=0;i--){const t=TRANS[i];t.life-=dt;t.m.material.opacity=Math.max(0,t.life/t.max)*.9;t.m.scale.multiplyScalar(1+dt*1.5);if(t.life<=0){scene.remove(t.m);t.m.material.dispose();TRANS.splice(i,1)}}}

/* ================= items ================= */
function itemMesh(name){
  const g=new THREE.Group(),gold=mat('#e8c060',{metalness:.95,roughness:.2,emissive:'#ff9a2a',emissiveIntensity:.6}),gl=glow('#ffb35c',3);
  switch(name){
    case'lens':{const t=new THREE.Mesh(TOR(.28,.05),gold);g.add(t);g.add(mesh(SPH(),new THREE.MeshStandardMaterial({color:'#cfe8ff',emissive:'#8ac8ff',emissiveIntensity:1.5,transparent:true,opacity:.8}),0,0,0,.5,.5,.12));break}
    case'golden spike':{const c=mesh(CONE(),gold,0,0,0,.18,.8,.18);c.rotation.x=Math.PI;g.add(c);g.add(cyl(gold,0,.42,0,.13,.08));break}
    case'propeller':{const w=mat('#8a5a2a',{emissive:'#ff8a2a',emissiveIntensity:.3});g.add(box(w,0,0,0,1,.1,.06));g.add(cyl(gold,0,0,0,.08,.12));g.rotation.x=Math.PI/2;break}
    case'sound discs':for(let i=0;i<3;i++){g.add(cyl(mat('#111',{emissive:'#ff8a2a',emissiveIntensity:.25,roughness:.2}),0,i*.07,0,.3,.04));g.add(cyl(gl,0,i*.07+.02,0,.08,.02))}break;
    case'vacuum tube':g.add(mesh(CYL(),new THREE.MeshStandardMaterial({color:'#ffd8a0',transparent:true,opacity:.55,emissive:'#ff8a2a',emissiveIntensity:1}),0,.15,0,.3,.55,.3));g.add(cyl(gl,0,.1,0,.06,.3));g.add(cyl(mat('#222'),0,-.18,0,.17,.12));break;
    case'antenna':{const am=mat('#ccc',{metalness:.9,emissive:'#ff8a2a',emissiveIntensity:.3});g.add(cyl(am,0,0,0,.03,.8));for(let k=0;k<4;k++)g.add(box(am,0,.1+k*.1-.15,0,.7-k*.12,.03,.03));break}
    case'fuse':g.add(mesh(CYL(),new THREE.MeshStandardMaterial({color:'#e8f0ff',transparent:true,opacity:.6,emissive:'#3ae8ff',emissiveIntensity:1.6}),0,0,0,.18,.55,.18));for(const y of[-.3,.3])g.add(cyl(gold,0,y,0,.1,.1));g.rotation.z=Math.PI/2;break;
    case'floppy disk':g.add(box(mat('#2a2a3a',{emissive:'#3a3aff',emissiveIntensity:.2}),0,0,0,.5,.5,.05));g.add(box(mat('#c8c8d0',{metalness:.8}),0,.17,0,.28,.16,.06));g.add(box(mat('#f0f0f0'),0,-.08,0,.38,.2,.06));break;
    case'seed capsule':g.add(mesh(SPH(),new THREE.MeshStandardMaterial({color:'#c8ffe0',emissive:'#5affb8',emissiveIntensity:1.6,transparent:true,opacity:.8}),0,0,0,.35,.6,.35));g.add(sph(mat('#3a8a3a'),0,0,0,.08));break;
    case'docking key':g.add(box(mat('#e8e8f8',{metalness:.8,emissive:'#9ae8ff',emissiveIntensity:.5}),0,0,0,.18,.6,.18));{const t1=new THREE.Mesh(TOR(.15,.04),glow('#9ae8ff',3));t1.position.y=.4;g.add(t1)}break;
    case'memory crystal':g.add(mesh(OCTA(),mat('#ffe8a0',{emissive:'#ffb040',emissiveIntensity:2.2,roughness:.1}),0,0,0,.4,.7,.4));break;
    case'decoder chip':g.add(box(mat('#1a3a2a',{emissive:'#7ae8ff',emissiveIntensity:.6}),0,0,0,.5,.06,.5));for(let i=0;i<5;i++)g.add(box(gold,-.2+i*.1,0,.28,.04,.04,.08));g.rotation.x=1;break;
    case'chronon core':g.add(sph(glow('#ffd080',4),0,0,0,.22,false));{const t=new THREE.Mesh(TOR(.32,.03),gold);g.add(t);const t2=t.clone();t2.rotation.x=Math.PI/2;g.add(t2)}break;
    case'relic':g.add(mesh(OCTA(),mat('#d8b8ff',{emissive:'#b44aff',emissiveIntensity:2.4,roughness:.1,metalness:.3}),0,0,0,.42,.62,.42));break;
    case'cell':g.add(mesh(CYL(),new THREE.MeshStandardMaterial({color:'#c8fff4',emissive:'#5ff5d6',emissiveIntensity:2.4,transparent:true,opacity:.85}),0,0,0,.26,.5,.26));for(const y of[-.28,.28])g.add(cyl(mat('#c9a24a',{metalness:.9}),0,y,0,.15,.06));break;
    default:g.add(mesh(ICO(),gl,0,0,0,.4,.4,.4));
  }
  return g;
}
const ITEMC={relic:'#b44aff',cell:'#5ff5d6'};
function dropItem(kind,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);const m=itemMesh(kind==='item'?ERA[G.cur].mission.item:kind);m.position.y=1;g.add(m);
  const c=ITEMC[kind]||'#ff8a2a';const beam=new THREE.Mesh(geo('ibeam',()=>new THREE.CylinderGeometry(.22,.22,10,16,1,true)),addMat(c,.12));beam.position.y=5;g.add(beam);
  const ring=new THREE.Mesh(geo('iring',()=>new THREE.RingGeometry(.5,.62,32)),addMat(c,.6));ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);
  WD.group.add(g);const it={kind,x,z,g,m,t:Math.random()*6};WD.items.push(it);return it;
}
function removeItem(it){WD.group.remove(it.g);disposeTree(it.g);WD.items.splice(WD.items.indexOf(it),1)}
function randSpot(r,avoid=[],span=70){for(let k=0;k<40;k++){const x=WD.mx+(r()*2-1)*span,z=ZMIN+.5+r()*(ZMAX-ZMIN-1);if(Math.abs(x-WD.mx)<10)continue;if(avoid.some(a=>Math.abs(a-x)<8))continue;return{x,z}}return{x:WD.mx+20,z:1}}
function placeItem(r){const p=randSpot(r,[WD.land.x],75);dropItem('item',p.x,p.z)}
function placeRelic(r){const p=randSpot(r,[WD.land.x],115);dropItem('relic',p.x,p.z)}
function placeRepair(r){
  r=r||Math.random;WD.items.filter(i=>i.kind==='cell').forEach(removeItem);WD.delivered=0;ch.cells=0;
  if(WD.stab){WD.group.remove(WD.stab.g);disposeTree(WD.stab.g)}
  let sx;do{sx=(r()*2-1)*60}while(Math.abs(sx-WD.mx)<14||Math.abs(sx-WD.land.x)<10);
  const g=new THREE.Group();g.position.set(sx,0,ZMIN+.3);const bm=mat('#2a3a3a',{metalness:.7,roughness:.3});g.add(cyl(bm,0,.25,0,1.1,.5));g.add(cyl(mat('#c9a24a',{metalness:.9,roughness:.2}),0,1.4,0,.25,2.2));
  const slots=[];for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const s=sph(new THREE.MeshStandardMaterial({color:'#222',emissive:'#5ff5d6',emissiveIntensity:.1}),Math.cos(a)*.7,.75,Math.sin(a)*.7,.2,false);g.add(s);slots.push(s)}
  const core=sph(glow('#5ff5d6',3),0,2.7,0,.35,false);g.add(core);const rg=new THREE.Mesh(TOR(.7,.04),glow('#5ff5d6',2.5));rg.position.y=2.7;g.add(rg);
  const ring=new THREE.Mesh(geo('lring',()=>new THREE.RingGeometry(1.05,1.3,48)),addMat('#5ff5d6',.7));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);
  WD.group.add(g);WD.stab={x:sx,z:ZMIN+.3,g,slots,core,rg};
  for(let i=0;i<3;i++){const p=randSpot(r,[sx],60);dropItem('cell',p.x,p.z)}
}
function updateItems(dt){
  for(const it of WD.items){it.t+=dt;it.m.position.y=1+Math.sin(it.t*2.2)*.15;it.m.rotation.y=it.t*1.6;}
  if(WD.stab){WD.stab.rg.rotation.set(T*1.3,T*.9,0);WD.stab.core.scale.setScalar(1+Math.sin(T*4)*.1)}
  if(WD.landRing){const show=mode==='play'&&G&&missionOpen(G.cur)&&!activeRepair();WD.landRing.visible=WD.landBeam.visible=show||(G&&G.cur===NX)||(G&&G.cur===TH&&false);
    WD.landRing.material.opacity=.45+Math.sin(T*3)*.25*(ch.carry?1.4:.6);WD.landRing.material.color.set(ch.carry?'#ffd24a':'#ff8a2a');WD.landBeam.material.opacity=ch.carry?.12:.05}
  if(ch.carryMesh){ch.carryMesh.position.set(ch.x,2.75+Math.sin(T*3)*.08,ch.z);ch.carryMesh.rotation.y=T*1.8}
}
function setCarry(on){if(ch.carryMesh){scene.remove(ch.carryMesh);disposeTree(ch.carryMesh);ch.carryMesh=null}if(on&&G&&hasM(G.cur)){ch.carryMesh=itemMesh(ERA[G.cur].mission.item);ch.carryMesh.scale.setScalar(.8);scene.add(ch.carryMesh)}ch.carry=on?1:0}

/* ================= citizens & merchant ================= */
function spawnCitizen(r,x,z){
  const c=ERA[WD.year].npc;
  const fit={coat:pick(r,c.coats),pants:pick(r,c.pants),skin:pick(r,NPC_SKIN),hair:pick(r,NPC_HAIR),hat:pick(r,c.hats),hatC:pick(r,c.hatCs),dress:r()<.3,longHair:r()<.35,boots:'#1a1410'};
  if(WD.year===NX){fit.coat=pick(r,['#3a2a5a','#2a3a5a','#5a3a2a']);fit.hat='visor';fit.hatC=pick(r,['#5ff5d6','#ffd24a'])}
  addNpc({kind:'citizen',fit,x,z:z==null?ZMIN+r()*(ZMAX-ZMIN):z,hp:50,sp:1.3+r()*.5});
}
function spawnCitizens(r){
  if(WD.year===TH)return;const n=WD.year===NX?3:TOUCH?7:10;
  for(let i=0;i<n;i++)spawnCitizen(r,WD.mx+(r()*2-1)*38);
}
function streamCitizens(dt){
  if(!G||WD.year===TH)return;WD.citT-=dt;if(WD.citT>0)return;WD.citT=.6;
  const target=WD.year===NX?3:TOUCH?7:10;let n=0;
  for(const c of WD.npcs){if(c.kind!=='citizen'||c.dying)continue;if(!c.hostile&&!(c.flee>0)&&Math.abs(c.x-camX)>75){c.dying=.01;continue}n++}
  if(n<target){const side=Math.random()<.5?-1:1;spawnCitizen(Math.random,camX+side*(22+Math.random()*12))}
}
function addNpc(o){const k=o.k||1;const dino=WD.year===-66000000&&(o.kind==='citizen'||o.kind==='guardian'),rig=dino?makeDinoRig(o.fit):makeRig(o.fit,k);if(dino&&k>1)rig.g.scale.setScalar(k);rig.g.position.set(o.x,0,o.z);WD.group.add(rig.g);
  const n={tx:o.x,tz:o.z,wait:Math.random()*3,moving:false,hostile:false,atkCd:.8,wind:0,swind:0,kbx:0,kbz:0,hitT:0,dying:0,calmT:0,flee:0,bt:0,bubble:'',talkCd:3+Math.random()*6,maxHp:o.hp,...o,rig,k,ang:0};
  WD.npcs.push(n);return n}
function spawnMerchant(){const n=addNpc({kind:'merchant',fit:MERCHANT_FIT,x:WD.land.x,z:ZMIN-.4,hp:999,sp:0});n.rig.g.rotation.y=0;n.bubble='Coins for power, traveler.';n.bt=4;WD.merchant=n}

/* ================= combat ================= */
const heatLvl=()=>Math.floor(G.heat/34);
let hitStop=0,shk=0,redT=0;
function riftPos(){let side=Math.random()<.5?-1:1;let x=camX+side*13;x=x;if(Math.abs(x-ch.x)<6){side=-side;x=camX+side*13}return{x,z:ZMIN+Math.random()*(ZMAX-ZMIN),side}}
function openPortal(p){const g=new THREE.Group();g.position.set(p.x,1.4,p.z);const r1=new THREE.Mesh(TOR(1,.06),glow('#b44aff',4));g.add(r1);const disc=new THREE.Mesh(geo('pdisc',()=>new THREE.CircleGeometry(.95,32)),addMat('#6a1aff',.5));g.add(disc);
  g.rotation.y=Math.PI/2*.6;scene.add(g);WD.portal={...p,t:.9,g,r1,disc};SFX.rift()}
function closePortal(){if(WD.portal&&WD.portal.g){scene.remove(WD.portal.g);WD.portal.disc.material.dispose()}WD.portal=null}
const dTier=()=>Math.max(0,G.tier-2);
function spawnHunter(p){
  p=p||riftPos();const elite=dTier()>=1&&Math.random()<.3,hhp=Math.round((95+25*dTier())*(elite?1.5:1));
  const n=addNpc({kind:'hunter',fit:elite?ELITE_FIT:HUNTER_FIT,x:p.x,z:p.z,hp:hhp,elite,sp:4.4,hostile:true});
  n.bubble=pick(Math.random,['Target acquired.','History ends here.',"You don't belong in this year.",'The Time Lord sends regards.']);n.bt=2.2;
  Object.assign(n,{dodgeCd:1,retreat:0,burst:0,shootCd:1.5+Math.random(),lungeCd:1.2,lunge:0,lx:0,lz:0});
  burst(p.x,1.4,p.z,'#b44aff',40,6,.5);hint('hunt',TOUCH?'A Time Hunter! Use HIT to fight and DASH to dodge.':'A Time Hunter! J to hit, K to dash.',300);
}
function hurtNpc(n,dmg,dx,dz){
  if(n.peer){floatText(n.x,2.2,n.z,String(Math.max(1,Math.round(dmg))),'#fff6d8');SFX.hit();hitStop=.045;burst(n.x,1.3,n.z,'#ffffff',8,3,.25);duelSend({t:'hit',d:Math.max(1,Math.round(dmg)),x:ch.x,z:ch.z});return}
  n.hp-=dmg;n.hitT=.15;hitStop=.045;shk=Math.max(shk,.25);floatText(n.x,2.2*(n.k||1),n.z,String(dmg),'#fff6d8');SFX.hit();
  const l=Math.hypot(dx,dz)||1,kb=n.kind==='citizen'?9:n.kind==='lord'?1.2:n.kind==='guardian'?1.4:4.5;n.kbx=dx/l*kb;n.kbz=dz/l*kb;
  burst(n.x,1.3*(n.k||1),n.z,'#ffffff',6,3,.25);
  if(n.kind==='citizen'){
    if(!n.hostile){n.bubble=pick(Math.random,['Hey!',"You'll regret that!",'Help!']);n.bt=1.5;
      WD.npcs.forEach(o=>{if(o!==n&&o.kind==='citizen'&&!o.dying&&!o.hostile&&Math.abs(o.x-n.x)<10){if(Math.random()<.6){o.hostile=true;o.calmT=12;o.bubble='Leave them alone!';o.bt=1.5}else{o.flee=3;o.bubble='Run!';o.bt=1.2}}})}
    n.hostile=true;n.calmT=10;n.wind=0;n.atkCd=Math.max(n.atkCd,.45);
  }
  if(n.kind==='guardian'&&!n.hostile&&n.hp>0){n.hostile=true;n.calmT=6;n.wind=0;n.bubble=pick(Math.random,['You dare?','Then face me!','So be it.']);n.bt=2}
  if(n.hp<=0)killNpc(n);
}
function killNpc(n){
  if(n.kind==='lord')return lordDown(n);
  if(n.kind==='guardian')return guardianDown(n);
  if(n.kind==='cbot')return botDown(n);
  n.dying=.5;n.hostile=false;n.wind=0;burst(n.x,1.2,n.z,n.kind==='hunter'?'#b44aff':'#7fd8e6',30,5,.4);
  const hunter=n.kind==='hunter',total=Math.round((hunter?(n.elite?2:1)*(20+(Math.random()*11|0)):5+(Math.random()*8|0))*ch.coinK),k=hunter?4:2+(Math.random()*2|0);
  for(let i=0;i<k;i++)dropCoin(n.x+(Math.random()-.5)*1.4,clamp(n.z+(Math.random()-.5)*1.2,ZMIN,ZMAX),Math.max(1,Math.round(total/k)));
  if(hunter){G.score+=25;G.hunters++;toast('Time Hunter down! +25');huntDrop(n)}
  else{const before=G.heat;G.heat=Math.min(100,G.heat+22);G.kills++;
    if(before<68&&G.heat>=68)toast('Heat is critical. The Hunters can smell you now.',true);else if(before<34&&G.heat>=34)toast('The timeline noticed. Heat is rising.',true)}
}
function dropCoin(x,z,v){const m=new THREE.Mesh(geo('coin',()=>{const g=new THREE.CylinderGeometry(.2,.2,.05,20);g.rotateX(Math.PI/2);return g}),mat('#ffd24a',{metalness:.95,roughness:.2,emissive:'#a86a10',emissiveIntensity:.6}));
  m.position.set(x,.5,z);m.castShadow=true;WD.group.add(m);WD.coins.push({x,z,v,m,t:Math.random()*6,vy:3+Math.random()*2,y:.5})}
function hurtPlayer(dmg,src){
  if(ch.inv>0||G.over)return;dmg=Math.max(1,Math.round(dmg*ch.armor));ch.hp-=dmg;ch.inv=.4;ch.regenWait=6;ch.hurtT=.25;hitStop=.07;shk=Math.max(shk,.6);floatText(ch.x,2.4,ch.z,'-'+dmg,'#ff6b5a');redT=Math.max(redT,.35);SFX.hurt();
  const dx=ch.x-src.x,dz=ch.z-src.z,l=Math.hypot(dx,dz)||1;ch.kbx=dx/l*7;ch.kbz=dz/l*7;
  if((src.kind==='hunter'||src.kind==='cbot'||src.kind==='guardian')&&ch.carry&&missionOpen(G.cur)){setCarry(false);dropItem('item',ch.x+dx/l*2.5,clamp(ch.z+dz/l*1.5,ZMIN,ZMAX));toast(`A Hunter knocked ${artItem()} out of your hands!`,true)}
  if(ch.hp<=0)knockout();
}
function artItem(){return'the '+ERA[G.cur].mission.item}
function knockout(){
  if(DU.on)return duelKnockout();
  if(G.boss&&G.boss.on)return lordWins();
  const lost=Math.floor(G.coins*.4);G.coins-=lost;ch.hp=ch.maxHp;ch.inv=2;
  if(ch.carry&&missionOpen(G.cur))dropItem('item',ch.x,ch.z);setCarry(false);
  for(let i=0;i<ch.cells;i++)dropItem('cell',clamp(ch.x+(Math.random()-.5)*3,-L+2,L-2),ch.z);ch.cells=0;
  const rp=activeRepair();if(rp&&rp.time!=null)rp.time-=25;else if(missionOpen(G.cur)&&G.timers[G.cur]!=null)G.timers[G.cur]-=25;
  WD.npcs.filter(n=>n.kind==='hunter').forEach(n=>{n.dying=.01});WD.npcs.forEach(n=>{n.hostile=false;n.wind=0;n.flee=0});WD.huntT=10;clearShots();closePortal();
  burst(ch.x,1.5,ch.z,'#ffb35c',40,6,.45);ch.target=null;
  if(G.cur!==NX)travel(NX);else{ch.x=WD.mx;ch.z=ZMIN+.6}
  toast(`Knocked out of time! Back at the Nexus. You lost ${lost} coins and 25 seconds.`,true);
}
function clearShots(){WD.shots.forEach(s=>scene.remove(s.m));WD.shots=[];WD.rings.forEach(r=>{scene.remove(r.m);r.m.material.dispose()});WD.rings=[]}
function shoot(x,y,z,vx,vz,dmg,gold){const m=new THREE.Mesh(SPH(),glow(gold?'#ffd24a':'#d05aff',6));m.scale.setScalar(.26);m.position.set(x,y,z);scene.add(m);WD.shots.push({x,z,y,vx,vz,dmg,life:2.6,m,g:gold})}
function aimAssist(){let best=null,bd=3.4;for(const n of WD.npcs){if(n.dying||n.kind==='merchant')continue;if(n.kind==='citizen'&&!n.hostile)continue;const d=Math.hypot(n.x-ch.x,n.z-ch.z);if(d<bd){bd=d;best=n}}
  if(best){const dx=best.x-ch.x,dz=best.z-ch.z,l=Math.hypot(dx,dz)||1;ch.fx=dx/l;ch.fz=dz/l}}
function playerAttack(){
  if(ch.atkCd>0||busy())return;ch.atkCd=.36*(MAGIC.haste>0?.6:1);ch.swing=.18;SFX.swing();aimAssist();imbueProc();
  const ang=Math.atan2(ch.fx,ch.fz);slash(ch.x+ch.fx*.6,ch.z+ch.fz*.6,ang);
  WD.npcs.forEach(n=>{if(n.dying||n.kind==='merchant')return;if(DU.hunter&&!n.peer&&n.kind!=='guardian'&&n.kind!=='cbot')return;const big=n.kind==='lord'?1.2:0,dx=n.x-ch.x,dz=n.z-ch.z,d=Math.hypot(dx,dz);if(d>2+big)return;if(d>.4&&(dx*ch.fx+dz*ch.fz)/d<.3)return;
    if((n.kind==='hunter'||n.kind==='cbot')&&n.dodgeCd<=0&&n.wind<=0&&n.swind<=0&&Math.random()<.4){burst(n.x,1.3,n.z,'#b44aff',16,4,.35);n.x=ch.x-ch.fx*1.6;n.z=clamp(ch.z-ch.fz*1.2,ZMIN,ZMAX);burst(n.x,1.3,n.z,'#b44aff',16,4,.35);
      n.dodgeCd=2.6;n.atkCd=.2;n.lunge=0;n.retreat=0;floatText(ch.x,2.6,ch.z,'DODGED','#d8a0ff');beep(1000,.05);return}
    hurtNpc(n,ch.dmg+(Math.random()*8-4|0),dx,dz)});
}
function playerDash(){
  if(ch.dashCd>0||busy())return;ch.dashCd=.9*ch.dashK;ch.dashT=.2;ch.inv=Math.max(ch.inv,.28);SFX.dash();
  let dx=0,dz=0;if(keys.has('arrowleft')||keys.has('a'))dx--;if(keys.has('arrowright')||keys.has('d'))dx++;if(keys.has('arrowup')||keys.has('w'))dz--;if(keys.has('arrowdown')||keys.has('s'))dz++;
  if(!dx&&!dz){if(ch.target){dx=ch.target.x-ch.x;dz=ch.target.z-ch.z}else{dx=ch.fx;dz=ch.fz}}
  const l=Math.hypot(dx,dz)||1;ch.dashX=dx/l;ch.dashZ=dz/l;ch.fx=ch.dashX;ch.fz=ch.dashZ;ch.target=null;burst(ch.x,1,ch.z,'#6ad8e8',14,2,.35,0,0);
}
function updateCombat(dt){
  ch.atkCd-=dt;ch.dashCd-=dt;ch.inv-=dt;ch.swing-=dt;ch.regenWait-=dt;ch.hurtT-=dt;
  if(ch.regenWait<=0&&ch.hp<ch.maxHp)ch.hp=Math.min(ch.maxHp,ch.hp+ch.regen*dt);
  G.heat=Math.max(0,G.heat-.5*ch.coolK*dt);
  const hl=G.heat>=10?1+heatLvl():0,cap=(G.cur===NX||G.boss||G.free||DU.on)?0:hl;
  WD.huntT-=dt;
  if(WD.portal){WD.portal.t-=dt;const P=WD.portal;P.r1.rotation.z+=dt*6;P.g.scale.setScalar(Math.min(1,(1-P.t/.9)*2.2));if(Math.random()<.5)burst(P.x,1.4,P.z,'#b44aff',2,2,.3,0,0);if(P.t<=0){const pp={x:P.x,z:P.z};closePortal();spawnHunter(pp)}}
  else if(WD.huntT<=0){const alive=WD.npcs.filter(n=>n.kind==='hunter'&&!n.dying).length;let go=alive<cap;if(!go&&cap===0&&alive===0&&G.cur!==NX&&!G.boss&&!G.free&&!DU.on&&Math.random()<.015)go=true;/* rare stray hunter while incognito */if(go){openPortal(riftPos());toast('A rift is opening. Time Hunter incoming!',true)}WD.huntT=cap?Math.max(20,38-G.heat*.15):90}
  for(const b of WD.shots){b.life-=dt;b.x+=b.vx*dt;b.z+=b.vz*dt;b.m.position.set(b.x,b.y,b.z);if(Math.random()<.6)burst(b.x,b.y,b.z,b.g?'#ffd24a':'#b44aff',1,.4,.25,0,0);
    if(Math.hypot(b.x-ch.x,b.z-ch.z)<.55){b.life=0;hurtPlayer(b.dmg,{x:b.x,z:b.z,kind:b.g?'lord':'hunter'})}if(b.life<=0)scene.remove(b.m)}
  WD.shots=WD.shots.filter(b=>b.life>0);
  for(const g of WD.rings){g.r+=7.5*dt;g.life-=dt;if(g.r>0){g.m.visible=true;g.m.scale.setScalar(g.r);g.m.material.opacity=Math.min(1,g.life)*.9}else g.m.visible=false;
    if(g.r>0&&!g.hit&&ch.inv<=0&&Math.abs(Math.hypot(ch.x-g.x,ch.z-g.z)-g.r)<.45){g.hit=true;hurtPlayer(22,{x:g.x,z:g.z,kind:'lord'})}if(g.life<=0){scene.remove(g.m);g.m.material.dispose()}}
  WD.rings=WD.rings.filter(g=>g.life>0);
  for(const n of WD.npcs){
    if(n.dying)continue;if(n.peer){n.hitT-=dt;continue}n.hitT-=dt;n.atkCd-=dt;n.strikeT=(n.strikeT||0)-dt;
    if(n.kbx||n.kbz){n.x=n.x+n.kbx*dt;n.z=clamp(n.z+n.kbz*dt,ZMIN,ZMAX);const f=Math.pow(.02,dt);n.kbx*=f;n.kbz*=f;if(Math.hypot(n.kbx,n.kbz)<.2)n.kbx=n.kbz=0}
    if(n.slow>0)n.slow-=dt;if(n.frozen>0&&n.kind!=='lord'){n.frozen-=dt;n.moving=false;continue}
    if(n.kind==='lord'){updateLord(n,dt);continue}
    if(n.hostile){
      const dx=ch.x-n.x,dz=ch.z-n.z,d=Math.hypot(dx,dz)||1,reach=n.reach||1.5,H_=n.kind==='hunter'||n.kind==='cbot'||n.kind==='guardian';
      if(n.kind==='citizen'){n.calmT-=dt;if(n.calmT<=0&&d>12){n.hostile=false;n.bubble='Hmph.';n.bt=1.2;n.tx=n.x;n.tz=n.z;continue}}
      if(n.kind==='guardian'){if(d>16){n.calmT-=dt;if(n.calmT<=0){n.hostile=false;n.hp=n.maxHp;n.wind=0;n.lunge=0;n.moving=false;n.bubble='...';n.bt=1.5;continue}}else n.calmT=6}
      n.ang=Math.atan2(dx,dz);
      if(n.wind>0){n.wind-=dt;n.moving=false;if(n.wind<=0){n.strikeT=.18;n.atkCd=n.atkT||(H_?.55:1.1);if(H_&&!n.guard)n.retreat=.3;slash(n.x+dx/d*.6,n.z+dz/d*.6,n.ang,n.kind==='guardian'?'#ffd24a':n.kind==='cbot'?'#8ad8ff':H_?'#d05aff':'#ffffff',1.3);if(d<reach+.5)hurtPlayer(n.dm||(H_?24+4*dTier():12+dTier()),n)}continue}
      if(H_){n.shootCd-=dt;n.lungeCd-=dt;n.dodgeCd-=dt;
        if(n.swind>0){n.swind-=dt;n.moving=false;if(n.swind<=0){shoot(n.x+dx/d*.5,1.5,n.z+dz/d*.5,dx/d*10,dz/d*10,n.shd||(14+2*dTier()));SFX.shot();if(n.burst>0){n.burst--;n.swind=.16}}continue}
        if(n.retreat>0){n.retreat-=dt;n.x=n.x-dx/d*5*dt;n.z=clamp(n.z-dz/d*5*dt,ZMIN,ZMAX);n.moving=true;continue}
        if(n.lunge>0){n.lunge-=dt;n.x=n.x+n.lx*14*dt*(n.slow>0?.5:1);n.z=clamp(n.z+n.lz*14*dt*(n.slow>0?.5:1),ZMIN,ZMAX);n.moving=true;if(Math.random()<.7)burst(n.x,1,n.z,'#b44aff',1,1,.3,0,0);if(d<reach){n.lunge=0;if(n.atkCd<=0)n.wind=.16}continue}
        if(d>4&&n.shootCd<=0){n.swind=.4;n.burst=1+(dTier()>=1?1:0);n.shootCd=1.6+Math.random()*.9;continue}
        if(d>reach&&d<6&&n.lungeCd<=0){n.lunge=.24;n.lx=dx/d;n.lz=dz/d;n.lungeCd=1.7+Math.random();continue}}
      if(d<reach){n.moving=false;if(n.atkCd<=0)n.wind=n.windT||(H_?.22:.38);continue}
      const sp=(n.spd||(H_?4.4:2.4))*dt*(n.slow>0?.4:1),tx=ch.x-dx/d*reach*.8,tz=ch.z-dz/d*reach*.8,ex=tx-n.x,ez=tz-n.z,el=Math.hypot(ex,ez)||1;
      n.x=n.x+ex/el*sp;n.z=clamp(n.z+ez/el*sp,ZMIN,ZMAX);n.moving=true;
    }else if(n.flee>0){n.flee-=dt;const dir=n.x<ch.x?-1:1;n.x=n.x+dir*4*dt;n.ang=dir*Math.PI/2;n.moving=true;n.tx=n.x;n.tz=n.z}
  }
  for(const c of WD.coins){c.t+=dt;if(c.vy||c.y>.5){c.vy-=14*dt;c.y+=c.vy*dt;if(c.y<.35){c.y=.35;c.vy=0}}const d=Math.hypot(c.x-ch.x,c.z-ch.z);if(d<3.2){c.x+=(ch.x-c.x)*dt*7;c.z+=(ch.z-c.z)*dt*7}
    c.m.position.set(c.x,c.y+Math.sin(c.t*3)*.06,c.z);c.m.rotation.y=c.t*4;if(d<.6){c.got=true;G.coins+=c.v;SFX.coin();floatText(c.x,1.6,c.z,'+'+c.v,'#ffd24a');WD.group.remove(c.m)}}
  WD.coins=WD.coins.filter(c=>!c.got);
}
function updateNpcs(dt,live){
  for(const n of WD.npcs){
    if(n.dying){n.dying-=dt;animRig(n.rig,dt,{dead:Math.max(0,n.dying)});n.rig.g.position.set(n.x,0,n.z);if(n.dying<=0){WD.group.remove(n.rig.g);if(n.bd)n.bd.remove();if(n.hd)n.hd.remove();n.bd=n.hd=null}continue}
    if(live&&!n.hostile&&!(n.flee>0)&&n.kind!=='lord'&&n.kind!=='merchant'&&n.kind!=='guardian'&&!n.peer){
      n.wait-=dt;const dx=n.tx-n.x,dz=n.tz-n.z,d=Math.hypot(dx,dz);
      if(n.wait>0||d<.2){n.moving=false;if(n.wait<=0){n.wait=1+Math.random()*4;n.tx=clamp(n.x+(Math.random()-.5)*16,-L+3,L-3);n.tz=ZMIN+Math.random()*(ZMAX-ZMIN)}}
      else{const sp=n.sp*dt;n.x+=dx/d*sp;n.z+=dz/d*sp;n.ang=Math.atan2(dx,dz);n.moving=true;if(d<.3)n.wait=1+Math.random()*4}
      if(mode==='play'&&n.kind==='citizen'){n.talkCd-=dt;if(n.talkCd<=0&&Math.hypot(n.x-ch.x,n.z-ch.z)<3){n.bubble=pick(Math.random,ERA[WD.year].talk);n.bt=2.4;n.talkCd=10+Math.random()*10;n.ang=Math.atan2(ch.x-n.x,ch.z-n.z)}}
    }
    if(n.kind==='merchant'){n.ang=Math.atan2(ch.x-n.x,ch.z-n.z)*.4}
    if(n.kind==='guardian'&&!n.hostile){const gd=Math.hypot(n.x-ch.x,n.z-ch.z);n.moving=false;if(gd<7){n.ang=Math.atan2(ch.x-n.x,ch.z-n.z);if(!n.greeted){n.greeted=true;n.bubble=n.greet;n.bt=4}}}
    // soft separation from player
    const sx=n.x-ch.x,sz=n.z-ch.z,sd=Math.hypot(sx,sz);if(sd<.7&&sd>0&&n.kind!=='merchant'){n.x+=sx/sd*(.7-sd)*.5;n.z=clamp(n.z+sz/sd*(.7-sd)*.5,ZMIN,ZMAX)}
    n.rig.g.position.set(n.x,0,n.z);faceTo(n.rig,n.ang,dt,10);
    animRig(n.rig,dt,{moving:n.moving,speed:n.kind==='hunter'||n.kind==='cbot'?1.4:1,swing:n.strikeT>0?n.strikeT:0,wind:n.wind>0||n.swind>0?1:0,hurt:n.hitT});
    if(n.hitT>0)n.rig.g.position.y=.05;
  }
  WD.npcs=WD.npcs.filter(n=>!(n.dying&&n.dying<=0));
}

/* ================= the Time Lord ================= */
function lordName(){const r=boardShared&&boardRows.find(q=>q.lord);return r?`Time Lord ${String(r.name||'').slice(0,16)}`:'The Time Lord'}
function summon(k){for(let i=0;i<k;i++)spawnHunter(riftPos())}
function spawnLord(){
  const B=G.boss;B.on=true;const x=B.mode==='invade'?WD.land.x:ch.x+(ch.x<0?1:-1)*9,z=(ZMIN+ZMAX)/2;
  const n=addNpc({kind:'lord',fit:LORD_FIT,x,z,hp:900,k:1.55,sp:0,hostile:true});
  Object.assign(n,{cd:2.4,st:null,stT:0,phase:1,sumCd:0});n.bubble=pick(Math.random,['So you are the one who keeps mending my work.','Every line ends with me.','I was you, once.']);n.bt=3.5;
  B.n=n;burst(x,2,z,'#ffd24a',90,8,.6);burst(x,2,z,'#ff2a4a',50,6,.5);shk=1;SFX.boom();
  $('bossName').textContent=lordName();$('bossHp').style.width='100%';$('bossbar').hidden=false;
}
function updateLord(n,dt){
  const dx=ch.x-n.x,dz=ch.z-n.z,d=Math.hypot(dx,dz)||1,R=2.6,p2=n.phase===2;n.ang=Math.atan2(dx,dz);
  if(!p2&&n.hp<n.maxHp*.5){n.phase=2;n.bubble='Enough. I have seen how this ends.';n.bt=3;shk=1;burst(n.x,2,n.z,'#ff2a4a',90,8,.6);summon(2);n.sumCd=16;n.cd=1.2;n.st=null;n.wind=0;n.swind=0;return}
  n.sumCd-=dt;n.moving=false;
  if(n.st){n.stT-=dt;
    if(n.st==='sweep'){n.wind=Math.max(.01,n.stT);if(n.stT<=0){n.wind=0;n.strikeT=.25;n.st=null;n.cd=p2?.8:1.3;shk=Math.max(shk,.4);SFX.hit();slash(n.x+dx/d*1.2,n.z+dz/d*1.2,n.ang,'#ffd24a',2.8);
        if(d<R+.6)hurtPlayer(28,n)}}
    else if(n.st==='fan'){n.swind=Math.max(.01,n.stT*.7);if(n.stT<=0){n.swind=0;n.st=null;n.cd=p2?1:1.6;const k=p2?7:5,base=Math.atan2(dz,dx);SFX.shot();
        for(let i=0;i<k;i++){const a=base+(i-(k-1)/2)*.2;shoot(n.x+Math.cos(a),2.2,n.z+Math.sin(a),Math.cos(a)*8,Math.sin(a)*8,16,true)}}}
    else if(n.st==='wave'){n.wind=Math.max(.01,n.stT);if(n.stT<=0){n.wind=0;n.st=null;n.cd=p2?1.1:1.7;shk=.8;SFX.boom();addRing(n.x,n.z,.4,2.4);if(p2)addRing(n.x,n.z,-2.4,2.8)}}
    return}
  n.cd-=dt;
  if(n.cd<=0){const q=Math.random();
    if(p2&&n.sumCd<=0&&WD.npcs.filter(h=>h.kind==='hunter'&&!h.dying).length<1){summon(2);n.sumCd=16;n.cd=1;n.bubble='Hunters. To me.';n.bt=2;return}
    if(d<R){if(q<.7){n.st='sweep';n.stT=p2?.36:.5}else{n.st='wave';n.stT=.6}}
    else if(q<.4){n.st='fan';n.stT=.6}
    else if(q<.72){burst(n.x,2,n.z,'#ffd24a',30,5,.4);n.x=ch.x-ch.fx*2;n.z=clamp(ch.z-ch.fz*1.5,ZMIN,ZMAX);burst(n.x,2,n.z,'#ffd24a',30,5,.4);beep(900,.08);n.st='sweep';n.stT=p2?.34:.44}
    else{n.st='wave';n.stT=.7}
    return}
  if(d>R*.8){const sp=(p2?3.6:2.7)*dt,tx=ch.x-dx/d*R*.7,tz=ch.z-dz/d*R*.7,ex=tx-n.x,ez=tz-n.z,el=Math.hypot(ex,ez)||1;n.x=n.x+ex/el*sp;n.z=clamp(n.z+ez/el*sp,ZMIN,ZMAX);n.moving=true}
}
function addRing(x,z,r,life){const m=new THREE.Mesh(geo('wring',()=>{const g=new THREE.TorusGeometry(1,.06,8,96);g.rotateX(Math.PI/2);return g}),addMat('#ff3a4a',.9));m.position.set(x,.25,z);m.visible=false;scene.add(m);WD.rings.push({x,z,r,life,m})}
function lordDown(n){
  n.dying=1.4;n.hostile=false;n.wind=0;n.swind=0;n.st=null;shk=1.3;hitStop=.25;
  for(let i=0;i<5;i++)burst(n.x+(Math.random()-.5)*2,1.5+Math.random()*2,n.z,i%2?'#ffd24a':'#ffffff',60,8,.6);
  clearShots();WD.npcs.forEach(h=>{if(h.kind==='hunter'&&!h.dying){h.dying=.5;h.hostile=false;burst(h.x,1.3,h.z,'#b44aff',24,5,.4)}});
  G.score+=1500;$('bossbar').hidden=true;SFX.ok();SFX.boom();
  G.over={win:true,lord:true,year:G.boss.mode==='invade'?G.prev:G.cur};
  setTimeout(()=>{mode='over';showEnd()},2400);
}
function lordWins(){
  G.over={win:false,byLord:true,sealed:!!G.sealed,year:G.boss.mode==='invade'?G.prev:G.cur};$('bossbar').hidden=true;redT=1;burst(ch.x,1.4,ch.z,'#7fd8e6',60,6,.5);ch.inv=99;SFX.bad();
  setTimeout(()=>{mode='over';showEnd()},1800);
}

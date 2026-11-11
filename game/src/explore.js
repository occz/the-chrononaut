/* ================= EXPLORE: open-world prototype (2D chunks, heightfield, caves below, islands above) ================= */
const EXP={on:false,layer:0,gS:null,gC:null,S:new Map(),C:new Map(),visS:new Set(),visC:new Set(),got:new Set(),disc:new Set(),crystals:0,seed:1,target:null,cd:0,tt:0,mmT:0,isl:[],P:{x:0,y:0,z:0,vy:0,fx:0,fz:1,moving:false,air:false}};
const EK=new Set(),CS=32,SEG=32,SEA=-4,CWALL=7;
const sm01=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function h2(x,z,s){let h=Math.imul(x|0,374761393)^Math.imul(z|0,668265263)^Math.imul(s|0,2147483647);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
function vn(x,z,s){const xi=Math.floor(x),zi=Math.floor(z),fx=x-xi,fz=z-zi,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);
  const a=h2(xi,zi,s),b=h2(xi+1,zi,s),c=h2(xi,zi+1,s),d=h2(xi+1,zi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,z,s,o=4){let a=.5,f=1,t=0,n=0;for(let i=0;i<o;i++){t+=vn(x*f,z*f,s+i*17)*a;n+=a;a*=.5;f*=2}return t/n}
/* surface height: rolling hills + terraced cliff regions + sea */
function surf(x,z){const s=EXP.seed,n=fbm(x*.011,z*.011,s,5);let h=(n-.46)*46;
  const q=h/7,f=q-Math.floor(q),tr=(Math.floor(q)+sm01((f-.5)/.22))*7,mk=sm01((fbm(x*.008,z*.008,s+300,2)-.5)/.12);
  return h+(tr-h)*.8*mk}
function biomeM(x,z){return fbm(x*.02,z*.02,EXP.seed+90,3)}
/* deterministic points of interest per chunk */
function feat(ci,cj){const key=ci+','+cj;if(EXP.fc.has(key))return EXP.fc.get(key);
  const r=rng(h2(ci,cj,EXP.seed+55)*1e9|0),roll=r(),F={ci,cj,ruin:null,cave:null,up:null};
  const spot=(tries,ok)=>{for(let k=0;k<tries;k++){const x=ci*CS+6+r()*(CS-12),z=cj*CS+6+r()*(CS-12),h=surf(x,z);if(h>SEA+2&&h<15&&ok(x,z,h))return{x,z,h}}return null};
  const flat=(x,z)=>Math.abs(surf(x+3,z)-surf(x-3,z))+Math.abs(surf(x,z+3)-surf(x,z-3))<2.2;
  if(roll<.2){const p=spot(8,flat);if(p)F.ruin=p}
  else if(roll<.36){let b=null,bs=-1;for(let k=0;k<10;k++){const x=ci*CS+6+r()*(CS-12),z=cj*CS+6+r()*(CS-12),h=surf(x,z);if(h<SEA+2.5||h>16)continue;const s=Math.abs(surf(x+2,z)-surf(x-2,z))+Math.abs(surf(x,z+2)-surf(x,z-2));if(s>bs){bs=s;b={x,z,h}}}F.cave=b}
  else if(roll<.54){const p=spot(8,(x,z)=>true);if(p){const a=r()*6.28,iy=32+r()*14;F.up={x:p.x,z:p.z,h:p.h,top:iy+1.6,isl:{x:p.x-Math.cos(a)*5.5,z:p.z-Math.sin(a)*5.5,y:iy,r:9.5}}}}
  EXP.fc.set(key,F);return F}
/* caves */
function caveO(x,z){const s=EXP.seed;let o=sm01((fbm(x*.05,z*.05,s+500,3)-.455)/.07);
  const ci=Math.floor(x/CS),cj=Math.floor(z/CS);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const c=feat(ci+a,cj+b).cave;if(c){const d=Math.hypot(x-c.x,z-c.z);o=Math.max(o,sm01(1-(d-5)/4))}}
  return o}
const caveFloor=(x,z)=>{const o=caveO(x,z);return CWALL+((vn(x*.3,z*.3,EXP.seed+700)*1.4)-CWALL)*o};
function groundAt(x,z,y){
  if(EXP.layer===1)return caveFloor(x,z);
  let g=surf(x,z);const ci=Math.floor(x/CS),cj=Math.floor(z/CS);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const u=feat(ci+a,cj+b).up;if(u){const d=Math.hypot(x-u.isl.x,z-u.isl.z);if(d<u.isl.r*.95&&y>u.isl.y-2.2)g=Math.max(g,u.isl.y)}}
  return g}
/* ---------- shared geometry/materials ---------- */
let EXG=null;
function exShared(){if(EXG)return EXG;const K=o=>{KEEP.add(o);return o};
  const m=(c,o)=>K(new THREE.MeshStandardMaterial({color:c,roughness:.85,flatShading:true,...o}));
  EXG={trunk:K(new THREE.CylinderGeometry(.16,.26,1.7,6).translate(0,.85,0)),fol:K(new THREE.ConeGeometry(1.35,3.4,7).translate(0,3.0,0)),fol2:K(new THREE.ConeGeometry(.95,2.4,7).translate(0,4.4,0)),
    rock:K(new THREE.IcosahedronGeometry(1,0)),col:K(new THREE.CylinderGeometry(.5,.6,1,8).translate(0,.5,0)),stal:K(new THREE.ConeGeometry(.5,1,6).translate(0,.5,0)),
    crys:K(new THREE.OctahedronGeometry(.42).scale(1,1.7,1)),beam:K(new THREE.CylinderGeometry(.55,.9,36,16,1,true).translate(0,18,0)),ring:K(new THREE.RingGeometry(1.2,1.6,32).rotateX(-Math.PI/2)),
    m:{trunk:m('#5a3d24'),fol:m('#ffffff'),rock:m('#8a8782'),stone:m('#b9ad92'),dark:m('#0a0610',{flatShading:false}),stal:m('#4a4260'),isl:m('#6b5a48'),grass:m('#6fae52'),
      crys:K(new THREE.MeshStandardMaterial({color:'#2ab8e8',emissive:'#4ad8ff',emissiveIntensity:1.8,roughness:.2,flatShading:true})),
      crysV:K(new THREE.MeshStandardMaterial({color:'#a04aff',emissive:'#b44aff',emissiveIntensity:1.8,roughness:.2,flatShading:true})),
      beamG:K(new THREE.MeshBasicMaterial({color:'#ffd24a',transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      beamV:K(new THREE.MeshBasicMaterial({color:'#b44aff',transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      beamC:K(new THREE.MeshBasicMaterial({color:'#4ad8ff',transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      ringV:K(new THREE.MeshBasicMaterial({color:'#b44aff',transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      ringC:K(new THREE.MeshBasicMaterial({color:'#4ad8ff',transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}))}};
  return EXG}
function halo(c,s,y){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:c,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(s,s,1);sp.position.y=y;return sp}
function addCrystal(c,id,x,y,z,v,violet){
  if(EXP.got.has(id))return;const X=exShared(),m=new THREE.Mesh(X.crys,violet?X.m.crysV:X.m.crys);m.position.set(x,y+.9,z);m.add(halo(violet?'#b44aff':'#4ad8ff',2.4,0));c.g.add(m);c.picks.push({m,x,y:y+.9,z,v,id,ph:Math.random()*6})}
/* ---------- surface chunk ---------- */
function terrainMesh(ci,cj,hf,colf){
  const g=new THREE.PlaneGeometry(CS,CS,SEG,SEG);g.rotateX(-Math.PI/2);g.translate(ci*CS+CS/2,0,cj*CS+CS/2);
  const p=g.attributes.position,n=p.count,col=new Float32Array(n*3);
  for(let i=0;i<n;i++)p.setY(i,hf(p.getX(i),p.getZ(i)));
  g.computeVertexNormals();const nm=g.attributes.normal;
  for(let i=0;i<n;i++){const c=colf(p.getX(i),p.getY(i),p.getZ(i),nm.getY(i));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));return g}
const _c=new THREE.Color(),_c2=new THREE.Color();
function surfColor(x,h,z,ny){const m=biomeM(x,z),j=(vn(x*.9,z*.9,EXP.seed+3)-.5)*.14;
  if(h<SEA+.7)_c.set('#d6c386');
  else if(h>20)_c.set('#eef3f8');
  else if(ny<.74)_c.set('#837e7a').lerp(_c2.set('#a39b92'),vn(x*.3,z*.3,5));
  else{_c.set(m>.52?'#4c8a3e':m>.44?'#6aa148':'#a39a52');_c.lerp(_c2.set('#9bc866'),sm01((h-4)/10)*.35)}
  if(h<SEA+1.6&&h>=SEA+.7)_c.lerp(_c2.set('#d6c386'),.5);
  _c.offsetHSL(0,0,j);return _c}
function buildSurf(ci,cj){
  const X=exShared(),c={g:new THREE.Group(),picks:[],anim:[],ci,cj,F:feat(ci,cj)},r=rng(h2(ci,cj,EXP.seed+7)*1e9|0);
  const t=new THREE.Mesh(terrainMesh(ci,cj,surf,surfColor),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true}));t.receiveShadow=true;c.g.add(t);
  /* trees & rocks */
  const T=[],R=[];
  for(let k=0;k<120;k++){const x=ci*CS+r()*CS,z=cj*CS+r()*CS,h=surf(x,z);if(h<SEA+1.4||h>17)continue;
    const sl=Math.abs(surf(x+1,z)-surf(x-1,z))+Math.abs(surf(x,z+1)-surf(x,z-1));if(sl>1.5)continue;
    const F0=feat(ci,cj);if((F0.ruin&&Math.hypot(x-F0.ruin.x,z-F0.ruin.z)<9)||(F0.cave&&Math.hypot(x-F0.cave.x,z-F0.cave.z)<6)||(F0.up&&Math.hypot(x-F0.up.x,z-F0.up.z)<4))continue;const fo=fbm(x*.035,z*.035,EXP.seed+40,3);if(fo<.47+r()*.1)continue;T.push([x,h,z,.5+r()*.5,r()*6])}
  for(let k=0;k<16;k++){const x=ci*CS+r()*CS,z=cj*CS+r()*CS,h=surf(x,z);if(h<SEA+.8)continue;R.push([x,h,z,.4+r()*r()*2.2,r()*6])}
  const dm=new THREE.Object3D();
  if(T.length){const tm=new THREE.InstancedMesh(X.trunk,X.m.trunk,T.length),fm=new THREE.InstancedMesh(X.fol,X.m.fol,T.length),f2=new THREE.InstancedMesh(X.fol2,X.m.fol,T.length);
    T.forEach((a,i)=>{dm.position.set(a[0],a[1]-.1,a[2]);dm.rotation.set(0,a[4],0);dm.scale.setScalar(a[3]);dm.updateMatrix();tm.setMatrixAt(i,dm.matrix);fm.setMatrixAt(i,dm.matrix);f2.setMatrixAt(i,dm.matrix);
      const snow=a[1]>13;_c.set(snow?'#e6eef0':['#2f6b3a','#3f7d3c','#2a5f46','#4a8a3a'][(a[4]*7|0)%4]);fm.setColorAt(i,_c);f2.setColorAt(i,_c)});
    [tm,fm,f2].forEach(m=>{m.castShadow=true;c.g.add(m)});fm.instanceColor.needsUpdate=true;f2.instanceColor.needsUpdate=true}
  if(R.length){const rm=new THREE.InstancedMesh(X.rock,X.m.rock,R.length);R.forEach((a,i)=>{dm.position.set(a[0],a[1]+a[3]*.3,a[2]);dm.rotation.set(a[4],a[4]*2,0);dm.scale.set(a[3],a[3]*.7,a[3]*.9);dm.updateMatrix();rm.setMatrixAt(i,dm.matrix)});rm.castShadow=true;rm.receiveShadow=true;c.g.add(rm)}
  /* free crystals */
  for(let k=0;k<3;k++){const x=ci*CS+3+r()*(CS-6),z=cj*CS+3+r()*(CS-6),h=surf(x,z);if(h>SEA+1.2&&h<18)addCrystal(c,`S${ci},${cj}:${k}`,x,h,z,1,false)}
  const F=c.F;
  if(F.ruin){const{x,z,h}=F.ruin,gr=new THREE.Group();gr.position.set(x,h,z);
    const base=new THREE.Mesh(new THREE.CylinderGeometry(7,7.6,.5,24),new THREE.MeshStandardMaterial({color:'#8c8472',roughness:.9,flatShading:true}));base.position.y=-.1;base.receiveShadow=true;gr.add(base);
    const n=8;for(let i=0;i<n;i++){const a=i/n*6.28+.2,hh=(i%3===0?1.4:3.2+r()*1.4),cm=new THREE.Mesh(X.col,X.m.stone);cm.scale.set(1,hh,1);cm.position.set(Math.cos(a)*5.4,.1,Math.sin(a)*5.4);cm.rotation.z=(r()-.5)*.1;cm.castShadow=true;gr.add(cm);
      if(i%2===0){const cap=new THREE.Mesh(new THREE.BoxGeometry(1.5,.4,1.5),X.m.stone);cap.position.set(cm.position.x,hh+.3,cm.position.z);cap.castShadow=true;gr.add(cap)}}
    const alt=new THREE.Mesh(new THREE.BoxGeometry(1.6,1,1.6),X.m.stone);alt.position.y=.5;alt.castShadow=true;gr.add(alt);
    const bm=new THREE.Mesh(X.beam,X.m.beamG);bm.position.y=0;gr.add(bm);c.g.add(gr);addCrystal(c,`R${ci},${cj}`,x,h+1,z,6,false)}
  if(F.cave){const{x,z,h}=F.cave,gr=new THREE.Group();gr.position.set(x,h,z);
    const dk=new THREE.Mesh(new THREE.CircleGeometry(2.1,24),X.m.dark);dk.position.set(0,1.9,.05);gr.add(dk);
    for(const sx of[-1,1]){const p=new THREE.Mesh(X.col,X.m.rock);p.scale.set(1.4,4.6,1.4);p.position.set(sx*2.4,-.4,0);p.castShadow=true;gr.add(p)}
    const lt=new THREE.Mesh(new THREE.BoxGeometry(6.6,1.3,1.8),X.m.rock);lt.position.set(0,4.3,0);lt.castShadow=true;gr.add(lt);
    const rg=new THREE.Mesh(X.ring,X.m.ringV);rg.position.y=.1;rg.scale.setScalar(1.6);gr.add(rg);
    const bm=new THREE.Mesh(X.beam,X.m.beamV);gr.add(bm);gr.add(halo('#b44aff',7,2));c.g.add(gr);c.anim.push(t=>{rg.rotation.y=t;rg.material.opacity=.55+Math.sin(t*3)*.25})}
  if(F.up){const u=F.up,gr=new THREE.Group();gr.position.set(u.x,u.h,u.z);
    const col=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.4,u.top-u.h,20,1,true).translate(0,(u.top-u.h)/2,0),X.m.beamC);gr.add(col);
    const rg=[0,1,2,3].map(i=>{const m=new THREE.Mesh(X.ring,X.m.ringC);m.scale.setScalar(1.5);gr.add(m);return m});
    gr.add(halo('#4ad8ff',6,1));c.g.add(gr);
    c.anim.push(t=>{rg.forEach((m,i)=>{const f=((t*.35+i/4)%1);m.position.y=f*(u.top-u.h);m.material.opacity=.7})});
    const I=u.isl,ig=new THREE.Group();ig.position.set(I.x,I.y,I.z);
    const body=new THREE.Mesh(new THREE.CylinderGeometry(I.r,I.r*.2,9,18,1),X.m.isl);body.position.y=-4.5;body.castShadow=true;ig.add(body);
    const top=new THREE.Mesh(new THREE.CylinderGeometry(I.r,I.r,.4,18),X.m.grass);top.position.y=-.2;top.receiveShadow=true;ig.add(top);
    for(let k=0;k<5;k++){const a=r()*6.28,d=2+r()*(I.r-4),tm=new THREE.Mesh(X.trunk,X.m.trunk);const s=.7+r()*.6;tm.scale.setScalar(s);tm.position.set(Math.cos(a)*d,0,Math.sin(a)*d);ig.add(tm);const fl=new THREE.Mesh(X.fol,X.m.grass);fl.scale.setScalar(s);fl.position.copy(tm.position);ig.add(fl)}
    c.g.add(ig);c.isl=ig;
    for(let k=0;k<3;k++){const a=k*2.1+r(),d=I.r*.55;addCrystal(c,`I${ci},${cj}:${k}`,I.x+Math.cos(a)*d,I.y,I.z+Math.sin(a)*d,3,false)}
    addCrystal(c,`IC${ci},${cj}`,I.x,I.y,I.z,8,true)}
  EXP.gS.add(c.g);EXP.S.set(ci+','+cj,c);return c}
/* ---------- cave chunk ---------- */
function caveColor(x,h,z){const o=caveO(x,z),j=(vn(x*.8,z*.8,EXP.seed+4)-.5)*.1;
  if(o>.5)_c.set('#5d5676').lerp(_c2.set('#3d5a6e'),vn(x*.12,z*.12,9)*.6);else _c.set('#2b2735').lerp(_c2.set('#3a3347'),o*2);
  _c.offsetHSL(0,0,j);return _c}
function buildCave(ci,cj){
  const X=exShared(),c={g:new THREE.Group(),picks:[],anim:[],ci,cj,F:feat(ci,cj)},r=rng(h2(ci,cj,EXP.seed+8)*1e9|0);
  const t=new THREE.Mesh(terrainMesh(ci,cj,caveFloor,(x,h,z)=>caveColor(x,h,z)),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,flatShading:true}));t.receiveShadow=true;c.g.add(t);
  const S=[];for(let k=0;k<26;k++){const x=ci*CS+r()*CS,z=cj*CS+r()*CS;if(caveO(x,z)<.75)continue;S.push([x,caveFloor(x,z),z,.5+r()*1.6])}
  if(S.length){const sm=new THREE.InstancedMesh(X.stal,X.m.stal,S.length),d=new THREE.Object3D();S.forEach((a,i)=>{d.position.set(a[0],a[1],a[2]);d.rotation.set(0,a[3]*5,0);d.scale.set(a[3],a[3]*2.2,a[3]);d.updateMatrix();sm.setMatrixAt(i,d.matrix)});sm.castShadow=true;c.g.add(sm)}
  for(let k=0;k<4;k++){const x=ci*CS+3+r()*(CS-6),z=cj*CS+3+r()*(CS-6);if(caveO(x,z)>.8)addCrystal(c,`C${ci},${cj}:${k}`,x,caveFloor(x,z),z,2,k%2===0)}
  if(c.F.cave){const{x,z}=c.F.cave,fy=caveFloor(x,z),gr=new THREE.Group();gr.position.set(x,fy,z);
    const rg=new THREE.Mesh(X.ring,X.m.ringC);rg.scale.setScalar(1.8);gr.add(rg);const bm=new THREE.Mesh(X.beam,X.m.beamC);gr.add(bm);gr.add(halo('#4ad8ff',6,2));c.g.add(gr);c.anim.push(t=>{rg.rotation.y=-t})}
  EXP.gC.add(c.g);EXP.C.set(ci+','+cj,c);return c}
/* ---------- streaming ---------- */
function exDrop(c,map,key,grp){grp.remove(c.g);c.g.traverse(o=>{if(o.isInstancedMesh)o.dispose()});disposeTree(c.g);map.delete(key)}
function exStream(max=1){
  const map=EXP.layer?EXP.C:EXP.S,grp=EXP.layer?EXP.gC:EXP.gS,bld=EXP.layer?buildCave:buildSurf,R=EXP.layer?1:2,ci=Math.floor(EXP.P.x/CS),cj=Math.floor(EXP.P.z/CS);let n=0;
  const ord=[];for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++)ord.push([a,b,a*a+b*b]);ord.sort((p,q)=>p[2]-q[2]);
  for(const[a,b]of ord){if(n>=max)break;if(!map.has((ci+a)+','+(cj+b))){bld(ci+a,cj+b);n++}}
  for(const[k,c]of[...map])if(Math.abs(c.ci-ci)>R+1||Math.abs(c.cj-cj)>R+1)exDrop(c,map,k,grp)}
/* ---------- atmosphere ---------- */
const SK={night:new THREE.Color('#0a1230'),day:new THREE.Color('#8ec8ee'),dusk:new THREE.Color('#ee9a6a'),cave:new THREE.Color('#06050c')},_sk=new THREE.Color();
function exAtmos(dt){
  const P=EXP.P;let day=0,dusk=0;
  if(EXP.layer){_sk.copy(SK.cave);scene.fog.density=.034;sun.intensity=0;hemi.intensity=.5;hemi.color.set('#8aa0ff');hemi.groundColor.set('#403858');EXP.lamp.intensity=60;EXP.lamp.distance=24}
  else{EXP.tt+=dt;const a=(EXP.tt/260+.28)*6.283,s=Math.sin(a);day=Math.max(0,Math.min(1,s*1.7+.2));dusk=1-Math.abs(Math.max(-1,Math.min(1,s*3)));
    _sk.copy(SK.night).lerp(SK.day,day).lerp(SK.dusk,dusk*.55);scene.fog.density=.0095;
    sun.intensity=2.6*day;sun.color.set('#ffffff').lerp(_c.set('#ffb070'),dusk*.7);hemi.intensity=.28+.75*day;hemi.color.set('#bfd8ff');hemi.groundColor.set('#4a4a3a');
    EXP.lamp.intensity=(1-day)*45;EXP.lamp.distance=18;
    WD.sunOff.set(Math.cos(a)*50,Math.max(8,s*60+10),22)}
  scene.background=_sk;scene.fog.color.copy(_sk);
  EXP.dayK=day}
/* ---------- HUD ---------- */
function exHud(){
  if(EXP.hud)return;const st=document.createElement('style');st.textContent=`#exHud{position:fixed;inset:0;z-index:4;pointer-events:none;font:600 13px/1.3 Inter,system-ui,sans-serif;color:#f3e6c8}
#exHud .pl{position:absolute;background:rgba(10,8,16,.62);border:1px solid rgba(255,190,90,.35);border-radius:10px;padding:8px 12px;backdrop-filter:blur(6px)}
#exHud .tl{left:12px;top:12px}#exHud .tl b{display:block;font:700 18px Georgia,serif;color:#ffcf7a;letter-spacing:.04em}
#exHud canvas{position:absolute;right:12px;top:12px;width:132px;height:132px;border-radius:10px;border:1px solid rgba(255,190,90,.35);background:rgba(10,8,16,.62)}
#exHud .hint{left:50%;bottom:14px;transform:translateX(-50%);font-weight:500;opacity:.85;text-align:center;max-width:70vw}
#exHud button{pointer-events:auto;font:700 12px Inter,system-ui,sans-serif;letter-spacing:.1em;color:#ffcf7a;background:rgba(10,8,16,.7);border:1px solid rgba(255,190,90,.5);border-radius:999px;padding:9px 16px;cursor:pointer}
#exHud #exExit{position:absolute;left:12px;top:86px}#exHud #exJump{position:absolute;right:18px;bottom:22px;width:84px;height:84px;border-radius:50%;font-size:13px;background:rgba(40,160,200,.35);border-color:#6ad8e8;color:#d8f6ff}
#exHud .big{position:absolute;left:50%;top:22%;transform:translateX(-50%);font:700 26px Georgia,serif;color:#ffe0a0;text-shadow:0 2px 14px #000;letter-spacing:.06em;opacity:0;transition:opacity .5s}
@media (max-width:680px){#exHud .hint{display:none}}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='exHud';d.innerHTML=`<div class="pl tl"><b id="exLay">SURFACE</b><span id="exInfo"></span></div><canvas id="exMap" width="264" height="264"></canvas><button id="exExit">← EXIT</button><button id="exJump">JUMP</button><div class="big" id="exBig"></div><div class="pl hint">WASD / arrows or tap to move · SPACE jump · find ruins, dark caves below and cyan updrafts that lift you to the floating islands</div>`;document.body.appendChild(d);EXP.hud=d;
  $('exExit').onclick=exploreExit;const jb=$('exJump');jb.addEventListener('pointerdown',e=>{e.stopPropagation();exJump()});
}
function exBig(t){const b=$('exBig');b.textContent=t;b.style.opacity=1;clearTimeout(EXP.bt);EXP.bt=setTimeout(()=>b.style.opacity=0,2400)}
function exJump(){const P=EXP.P;if(!P.air){P.vy=9.5;P.air=true;beep(420,.12,'triangle',.05,1.8)}}
/* ---------- start / exit ---------- */
function exploreStart(){
  audio();exShared();
  Object.assign(EXP,{on:true,layer:0,seed:(Math.random()*1e6|0)+1,fc:new Map(),S:new Map(),C:new Map(),visS:new Set(),visC:new Set(),got:new Set(),disc:new Set(),crystals:0,target:null,cd:0,tt:0});
  EXP.gS=new THREE.Group();EXP.gC=new THREE.Group();EXP.gC.visible=false;scene.add(EXP.gS,EXP.gC);
  if(!EXP.lamp){EXP.lamp=new THREE.PointLight('#ffd9a0',0,18,1.5);scene.add(EXP.lamp)}
  if(!EXP.water){EXP.water=new THREE.Mesh(new THREE.PlaneGeometry(600,600).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:'#2b78a8',roughness:.12,metalness:.15,transparent:true,opacity:.78}));scene.add(EXP.water)}
  EXP.water.visible=true;
  mode='explore';$('title').hidden=true;$('hud').hidden=true;if(WD&&WD.group)WD.group.visible=false;
  PSUIT=SUIT;buildPlayer();ch.rig.g.visible=true;
  setFilm('none');renderer.toneMappingExposure=1.05;bloom.strength=.32;bloom.threshold=.72;bloom.radius=.4;
  scene.fog=new THREE.FogExp2('#8ec8ee',.0095);
  /* spawn on gentle dry land near origin */
  const P=EXP.P;let sp=null;for(let k=0;k<400&&!sp;k++){const a=k*.7,d=3+k*1.6,x=Math.cos(a)*d,z=Math.sin(a)*d,h=surf(x,z);if(h>SEA+1.5&&h<5&&Math.abs(surf(x+2,z)-surf(x-2,z))+Math.abs(surf(x,z+2)-surf(x,z-2))<1.2)sp={x,z}}
  sp=sp||{x:0,z:0};Object.assign(P,{x:sp.x,z:sp.z,y:surf(sp.x,sp.z),vy:0,fx:0,fz:1,moving:false,air:false});
  exHud();EXP.hud.hidden=false;
  for(let k=0;k<30;k++)exStream(99);
  camX=P.x;EXP.cam={x:P.x,y:P.y,z:P.z};exAtmos(0);
  exBig('THE OPEN WORLD');
}
function exploreExit(){
  if(!EXP.on)return;EXP.on=false;
  for(const[g,m]of[[EXP.gS,EXP.S],[EXP.gC,EXP.C]]){scene.remove(g);g.traverse(o=>{if(o.isInstancedMesh)o.dispose()});disposeTree(g);m.clear()}
  EXP.water.visible=false;EXP.lamp.intensity=0;EXP.hud.hidden=true;EK.clear();
  if(WD&&WD.group)WD.group.visible=true;
  if(ch.rig){scene.remove(ch.rig.g);ch.rig=null}
  mode='title';scene.background=null;genWorld(WD?WD.year:2026);camX=0;streamChunks(99);updateWorldStream(0);$('title').hidden=false;
}
/* ---------- per-frame ---------- */
function exSetLayer(n,x,z){
  EXP.layer=n;EXP.gS.visible=!n;EXP.gC.visible=!!n;EXP.water.visible=!n;const P=EXP.P;P.x=x;P.z=z;P.y=groundAt(x,z,0);P.vy=0;P.air=false;EXP.cd=1.4;EXP.cam={x:x,y:P.y,z:z};EXP.target=null;
  for(let k=0;k<30;k++)exStream(99);exAtmos(0);beep(n?220:520,.35,'sine',.06,n?.5:1.6);
  exBig(n?'DEEP BELOW':'SURFACE')}
function exploreTick(dt){
  const P=EXP.P;let vx=0,vz=0;
  if(EK.has('a')||EK.has('arrowleft'))vx--;if(EK.has('d')||EK.has('arrowright'))vx++;if(EK.has('w')||EK.has('arrowup'))vz--;if(EK.has('s')||EK.has('arrowdown'))vz++;
  if(vx||vz)EXP.target=null;
  if(!vx&&!vz&&EXP.target){const dx=EXP.target.x-P.x,dz=EXP.target.z-P.z,d=Math.hypot(dx,dz);if(d<.3)EXP.target=null;else{vx=dx/d;vz=dz/d}}
  const l=Math.hypot(vx,vz);P.moving=l>.01;
  if(P.moving){const k=1/Math.max(1,l),sp=6.2,sx=vx*k*sp*dt,sz=vz*k*sp*dt;P.fx=vx/l;P.fz=vz/l;
    const ok=(nx,nz)=>{
      if(EXP.layer){return caveO(nx,nz)>.5}
      const g=groundAt(nx,nz,P.y),gc=groundAt(P.x,P.z,P.y);if(g<SEA-1.4)return false;
      const run=Math.hypot(nx-P.x,nz-P.z)||1;if(g>P.y+.35&&(g-gc)/run>1.25)return false;return true};
    if(ok(P.x+sx,P.z+sz)){P.x+=sx;P.z+=sz}else if(ok(P.x+sx,P.z)){P.x+=sx}else if(ok(P.x,P.z+sz)){P.z+=sz}}
  /* vertical: gravity, ground, updrafts */
  if(!EXP.layer){for(const c of EXP.S.values()){const u=c.F.up;if(u&&Math.hypot(P.x-u.x,P.z-u.z)<2.3&&P.y<u.top){P.vy=Math.min(P.vy+44*dt,8.5);P.air=true}}}
  P.vy-=26*dt;P.y+=P.vy*dt;const g=groundAt(P.x,P.z,P.y-P.vy*dt);
  if(P.y<=g){P.y=g;P.vy=0;P.air=false}else if(P.y>g+.12)P.air=true;
  /* portals between layers */
  EXP.cd-=dt;
  if(EXP.cd<=0){
    if(!EXP.layer){for(const c of EXP.S.values()){const cv_=c.F.cave;if(cv_&&Math.hypot(P.x-cv_.x,P.z-cv_.z)<1.9&&Math.abs(P.y-cv_.h)<3){if(!EXP.disc.has('cave'+c.ci+','+c.cj)){EXP.disc.add('cave'+c.ci+','+c.cj)}exSetLayer(1,cv_.x,cv_.z+3.2);break}}}
    else{const ci=Math.floor(P.x/CS),cj=Math.floor(P.z/CS);let done=false;for(let a=-1;a<=1&&!done;a++)for(let b=-1;b<=1&&!done;b++){const cv_=feat(ci+a,cj+b).cave;if(cv_&&Math.hypot(P.x-cv_.x,P.z-cv_.z)<1.9){exSetLayer(0,cv_.x,cv_.z+3.2);done=true}}}}
  /* pickups */
  const pm=EXP.layer?EXP.C:EXP.S;
  for(const c of pm.values())for(let i=c.picks.length-1;i>=0;i--){const p=c.picks[i];p.m.rotation.y+=dt*1.6;p.m.position.y=p.y+Math.sin(EXP.tt*2.4+p.ph)*.18+(EXP.layer?0:0);
    if(Math.abs(p.x-P.x)<1.6&&Math.abs(p.z-P.z)<1.6&&Math.abs(p.y-P.y)<2.6){EXP.got.add(p.id);EXP.crystals+=p.v;c.g.remove(p.m);c.picks.splice(i,1);burst(p.x,p.y,p.z,'#6ad8e8',24,4,.3,3);beep(880+p.v*60,.14,'sine',.07,1.5);
      if(p.v>=6)exBig(p.v>=8?'ISLAND RELIC +'+p.v:'RUIN RELIC +'+p.v)}}
  /* discoveries */
  if(!EXP.layer){for(const c of EXP.S.values()){const F=c.F;for(const[k,o,msg]of[['ruin',F.ruin,'ANCIENT RUINS'],['up',F.up,'UPDRAFT SPOTTED']]){if(o&&!EXP.disc.has(k+c.ci+','+c.cj)&&Math.hypot(P.x-o.x,P.z-o.z)<26){EXP.disc.add(k+c.ci+','+c.cj);exBig(msg)}}
    if(F.cave&&!EXP.disc.has('cv'+c.ci+','+c.cj)&&Math.hypot(P.x-F.cave.x,P.z-F.cave.z)<26){EXP.disc.add('cv'+c.ci+','+c.cj);exBig('CAVE ENTRANCE')}}}
  /* rig */
  const R=ch.rig;if(R){R.g.position.set(P.x,P.y,P.z);faceTo(R,Math.atan2(P.fx,P.fz),dt,14);animRig(R,dt,{moving:P.moving&&!P.air,speed:1.1,swing:0,dash:0,hurt:0})}
  /* anim of props */
  const mm=EXP.layer?EXP.C:EXP.S;mm.forEach(c=>c.anim.forEach(f=>f(EXP.tt)));EXP.tt+=EXP.layer?dt:0;
  exStream(1);exAtmos(dt);
  /* camera + light */
  const cm=EXP.cam;cm.x=lerp(cm.x,P.x,1-Math.pow(.003,dt));cm.z=lerp(cm.z,P.z,1-Math.pow(.003,dt));cm.y=lerp(cm.y,P.y,1-Math.pow(.01,dt));
  const asp=W/H,vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*asp),dist=clamp((asp<1?10:15)/Math.tan(hf/2),22,46);
  camX=cm.x;camera.position.set(cm.x,cm.y+dist*.78+2,cm.z+dist*.62);camera.lookAt(cm.x,cm.y+1,cm.z-.5);
  sun.position.set(P.x+WD.sunOff.x,Math.max(10,P.y)+WD.sunOff.y,P.z+WD.sunOff.z);sun.target.position.set(P.x,P.y,P.z);
  EXP.lamp.position.set(P.x,P.y+3.2,P.z+.5);EXP.water.position.set(Math.round(P.x/8)*8,SEA,Math.round(P.z/8)*8);
  /* hud */
  const vis=EXP.layer?EXP.visC:EXP.visS,ci=Math.floor(P.x/CS),cj=Math.floor(P.z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)vis.add((ci+a)+','+(cj+b));
  EXP.mmT-=dt;if(EXP.mmT<=0){EXP.mmT=.15;exMap();$('exLay').textContent=EXP.layer?'THE DEEP':(P.y>26?'FLOATING ISLES':P.y>12?'HIGHLANDS':'SURFACE');
    $('exInfo').innerHTML=`Altitude ${P.y.toFixed(0)} m · Crystals <b style="display:inline;font:700 13px Inter;color:#6ad8e8">${EXP.crystals}</b><br>x ${P.x.toFixed(0)}  z ${P.z.toFixed(0)}`}
}
function exMap(){
  const cvs=$('exMap'),o=cvs.getContext('2d'),P=EXP.P,S=.5,w=cvs.width;o.clearRect(0,0,w,w);o.save();o.translate(w/2,w/2);
  const vis=EXP.layer?EXP.visC:EXP.visS;
  for(const k of vis){const[a,b]=k.split(',').map(Number),x=(a*CS-P.x)*S*2,z=(b*CS-P.z)*S*2;if(Math.abs(x)>w||Math.abs(z)>w)continue;
    o.fillStyle=EXP.layer?'rgba(120,100,190,.45)':'rgba(120,170,90,.45)';o.fillRect(x,z,CS*S*2-1,CS*S*2-1);
    const F=EXP.fc.get(k);if(F&&!EXP.layer){const dot=(p,c)=>{if(!p)return;o.fillStyle=c;o.beginPath();o.arc((p.x-P.x)*S*2,(p.z-P.z)*S*2,5,0,6.3);o.fill()};dot(F.ruin,'#ffd24a');dot(F.cave,'#b44aff');dot(F.up,'#4ad8ff')}
    else if(F&&EXP.layer&&F.cave){o.fillStyle='#4ad8ff';o.beginPath();o.arc((F.cave.x-P.x)*S*2,(F.cave.z-P.z)*S*2,5,0,6.3);o.fill()}}
  o.rotate(Math.atan2(P.fx,-P.fz));o.fillStyle='#fff';o.beginPath();o.moveTo(0,-9);o.lineTo(6,7);o.lineTo(-6,7);o.closePath();o.fill();o.restore();
  o.fillStyle='#ffcf7a';o.font='700 14px Georgia';o.fillText('N',w/2-5,16)}
/* input */
addEventListener('keydown',e=>{if(!EXP.on)return;const k=e.key.toLowerCase();if(e.repeat)return;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
  if(k===' ')exJump();else if(k==='escape')exploreExit();else EK.add(k)});
addEventListener('keyup',e=>{EK.delete(e.key.toLowerCase())});
cv.addEventListener('pointerdown',e=>{if(!EXP.on)return;ndc.set(e.clientX/W*2-1,-(e.clientY/H)*2+1);ray.setFromCamera(ndc,camera);
  const pl=new THREE.Plane(new THREE.Vector3(0,1,0),-EXP.P.y),p=new THREE.Vector3();if(ray.ray.intersectPlane(pl,p))EXP.target={x:p.x,z:p.z}});

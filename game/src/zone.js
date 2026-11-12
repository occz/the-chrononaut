/* ================= THE ZONE: hostile alien dimension reached from the Nexus (open world, chunked, WoW-style camera) ================= */
const ZN={on:false,g:null,mons:[],picks:[],S:new Map(),seed:1,loot:0,kills:0,yaw:0,pitch:.4,dist:16,home:{x:0,z:0},stash:null,bolts:[],slams:[],spawned:new Set(),killed:new Set(),exitT:0,mmT:0,drag:null,time:0,cam:{x:0,y:0,z:0},gotP:new Set()};
const ZCS=32,ZSEG=32,ZLAVA=-5;
const zsm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function zh2(x,z,s){let h=Math.imul(x|0,374761393)^Math.imul(z|0,668265263)^Math.imul(s|0,2147483647);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
function zvn(x,z,s){const xi=Math.floor(x),zi=Math.floor(z),fx=x-xi,fz=z-zi,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);
  const a=zh2(xi,zi,s),b=zh2(xi+1,zi,s),c=zh2(xi,zi+1,s),d=zh2(xi+1,zi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function zfbm(x,z,s,o=4){let a=.5,f=1,t=0,n=0;for(let i=0;i<o;i++){t+=zvn(x*f,z*f,s+i*17)*a;n+=a;a*=.5;f*=2}return t/n}
function zsurf(x,z){const s=ZN.seed,n=zfbm(x*.012,z*.012,s,5);let h=(n-.47)*54;
  const q=h/8,f=q-Math.floor(q),tr=(Math.floor(q)+zsm((f-.5)/.2))*8,mk=zsm((zfbm(x*.009,z*.009,s+300,2)-.48)/.1);h=h+(tr-h)*.8*mk;
  const d=Math.hypot(x-ZN.home.x,z-ZN.home.z);return h+(1.2-h)*zsm(1-d/30)}
const zTier=(x,z)=>Math.min(6,Math.floor(Math.hypot(x-ZN.home.x,z-ZN.home.z)/115));
/* ---------- shared assets ---------- */
let ZG=null;
function zShared(){if(ZG)return ZG;const K=o=>{KEEP.add(o);return o},M=(c,o)=>K(new THREE.MeshStandardMaterial({color:c,roughness:.8,flatShading:true,...o}));
  ZG={spire:K(new THREE.ConeGeometry(.38,5.2,5).translate(0,2.6,0)),tip:K(new THREE.IcosahedronGeometry(.42,0).translate(0,5.4,0)),stem:K(new THREE.CylinderGeometry(.12,.2,1.1,6).translate(0,.55,0)),cap:K(new THREE.SphereGeometry(.75,8,5,0,6.3,0,1.6).translate(0,1.05,0)),
    crys:K(new THREE.OctahedronGeometry(.5).scale(.8,2.3,.8).translate(0,1.1,0)),rock:K(new THREE.IcosahedronGeometry(1,0)),sph:K(new THREE.SphereGeometry(.5,12,8)),cyl:K(new THREE.CylinderGeometry(.5,.5,1,8).translate(0,.5,0)),cone:K(new THREE.ConeGeometry(.5,1,6).translate(0,.5,0)),
    beam:K(new THREE.CylinderGeometry(.6,.9,40,16,1,true).translate(0,20,0)),ring:K(new THREE.RingGeometry(1.2,1.6,32).rotateX(-Math.PI/2)),box:K(new THREE.BoxGeometry(1,1,1)),
    m:{bark:M('#1b1022'),tipM:K(new THREE.MeshStandardMaterial({color:'#000',emissive:'#ff3a6a',emissiveIntensity:2.2,flatShading:true})),stem:M('#c8b8d8'),capM:K(new THREE.MeshStandardMaterial({color:'#103a40',emissive:'#2af0d0',emissiveIntensity:1.5,roughness:.5,flatShading:true})),
      crysM:K(new THREE.MeshStandardMaterial({color:'#2a0a2a',emissive:'#ff3aa0',emissiveIntensity:1.9,roughness:.25,flatShading:true})),rock:M('#2d2536'),
      skin:M('#3a1f33'),skin2:M('#4a2a3a'),dark:M('#150a1c'),bone:M('#c9bfae'),
      eye:K(new THREE.MeshBasicMaterial({color:'#ff2a1a',toneMapped:false})),eyeC:K(new THREE.MeshBasicMaterial({color:'#6af0ff',toneMapped:false})),
      void:K(new THREE.MeshStandardMaterial({color:'#05000a',emissive:'#8a2aff',emissiveIntensity:1.1,roughness:.6,flatShading:true})),
      core:K(new THREE.MeshStandardMaterial({color:'#000',emissive:'#ff5a2a',emissiveIntensity:3,flatShading:true})),
      beamV:K(new THREE.MeshBasicMaterial({color:'#b44aff',transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      beamR:K(new THREE.MeshBasicMaterial({color:'#ff3a2a',transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      ringV:K(new THREE.MeshBasicMaterial({color:'#b44aff',transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      ringR:K(new THREE.MeshBasicMaterial({color:'#ff3a2a',transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})),
      bolt:K(new THREE.MeshBasicMaterial({color:'#c46aff',toneMapped:false})),
      lava:K(new THREE.MeshStandardMaterial({color:'#3a0a00',emissive:'#ff5a14',emissiveIntensity:1.7,roughness:.5}))}};
  return ZG}
function zHalo(c,s,y){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:c,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(s,s,1);sp.position.y=y;return sp}
const _zc=new THREE.Color(),_zc2=new THREE.Color();
function zColor(x,h,z,ny){const j=(zvn(x*.9,z*.9,ZN.seed+3)-.5)*.12,bio=zfbm(x*.03,z*.03,ZN.seed+90,3);
  if(h<ZLAVA+.8)_zc.set('#ff6a1a');
  else if(ny<.7)_zc.set('#2a2432').lerp(_zc2.set('#4a3a52'),zvn(x*.3,z*.3,5));
  else{_zc.set(bio>.55?'#22403e':bio>.45?'#3b2d4a':'#4a2a3c');_zc.lerp(_zc2.set('#6a5a70'),zsm((h-6)/14)*.5);if(zvn(x*.15,z*.15,ZN.seed+11)>.74)_zc.lerp(_zc2.set('#8a1a3a'),.55)}
  if(h<ZLAVA+1.8&&h>=ZLAVA+.8)_zc.lerp(_zc2.set('#ff6a1a'),.4);
  _zc.offsetHSL(0,0,j);return _zc}
function zTerrain(ci,cj){
  const g=new THREE.PlaneGeometry(ZCS,ZCS,ZSEG,ZSEG);g.rotateX(-Math.PI/2);g.translate(ci*ZCS+ZCS/2,0,cj*ZCS+ZCS/2);
  const p=g.attributes.position,n=p.count,col=new Float32Array(n*3);
  for(let i=0;i<n;i++)p.setY(i,zsurf(p.getX(i),p.getZ(i)));g.computeVertexNormals();const nm=g.attributes.normal;
  for(let i=0;i<n;i++){const c=zColor(p.getX(i),p.getY(i),p.getZ(i),nm.getY(i));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));return g}
function zCrystal(c,id,x,y,z,kind,v){if(ZN.gotP.has(id))return;const X=zShared();
  const m=new THREE.Mesh(X.crys,X.m.crysM);m.scale.setScalar(.7);m.position.set(x,y,z);m.add(zHalo('#ff3aa0',2.6,1));c.g.add(m);c.picks.push({m,x,y,z,id,kind,v,ph:Math.random()*6})}
const ZSEEDS=['void','ember','storm','echo','past','future'];
function zChunk(ci,cj){
  const X=zShared(),c={g:new THREE.Group(),ci,cj,picks:[]},r=rng(zh2(ci,cj,ZN.seed+7)*1e9|0),home=ZN.home;
  const t=new THREE.Mesh(zTerrain(ci,cj),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:true}));t.receiveShadow=true;c.g.add(t);c.t=t;
  const T=[],MU=[],CR=[],RK=[],dm=new THREE.Object3D();
  const near=(x,z)=>Math.hypot(x-home.x,z-home.z)<9;
  for(let k=0;k<70;k++){const x=ci*ZCS+r()*ZCS,z=cj*ZCS+r()*ZCS,h=zsurf(x,z);if(h<ZLAVA+1.6||h>20||near(x,z))continue;
    const sl=Math.abs(zsurf(x+1,z)-zsurf(x-1,z))+Math.abs(zsurf(x,z+1)-zsurf(x,z-1));if(sl>1.6)continue;
    const a=r(),f=zfbm(x*.04,z*.04,ZN.seed+40,3);
    if(a<.42&&f>.46)T.push([x,h,z,.6+r()*.9,r()*6]);else if(a<.62)MU.push([x,h,z,.3+r()*.6,r()*6]);else CR.push([x,h,z,.4+r()*.9,r()*6])}
  for(let k=0;k<14;k++){const x=ci*ZCS+r()*ZCS,z=cj*ZCS+r()*ZCS,h=zsurf(x,z);if(h<ZLAVA+1||near(x,z))continue;RK.push([x,h,z,.4+r()*r()*2.4,r()*6])}
  const inst=(geo,mat,arr,fn)=>{if(!arr.length)return null;const m=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((a,i)=>{fn(a);dm.updateMatrix();m.setMatrixAt(i,dm.matrix)});c.g.add(m);return m};
  const place=a=>{dm.position.set(a[0],a[1]-.05,a[2]);dm.rotation.set(0,a[4],0);dm.scale.setScalar(a[3])};
  const s1=inst(X.spire,X.m.bark,T,place),s2=inst(X.tip,X.m.tipM,T,place);if(s1)s1.castShadow=true;
  inst(X.stem,X.m.stem,MU,place);inst(X.cap,X.m.capM,MU,place);
  const cc=inst(X.crys,X.m.crysM,CR,place);
  const rk=inst(X.rock,X.m.rock,RK,a=>{dm.position.set(a[0],a[1]+a[3]*.3,a[2]);dm.rotation.set(a[4],a[4]*2,0);dm.scale.set(a[3],a[3]*.7,a[3]*.9)});if(rk){rk.castShadow=true;rk.receiveShadow=true}
  const tier=zTier(ci*ZCS+16,cj*ZCS+16);
  for(let k=0;k<3;k++){const x=ci*ZCS+3+r()*(ZCS-6),z=cj*ZCS+3+r()*(ZCS-6),h=zsurf(x,z);if(h>ZLAVA+1.4&&h<22)zCrystal(c,`P${ci},${cj}:${k}`,x,h,z,'coin',Math.round((7+r()*6)*(1+tier*.55)))}
  if(r()<.16){const x=ci*ZCS+4+r()*(ZCS-8),z=cj*ZCS+4+r()*(ZCS-8),h=zsurf(x,z);if(h>ZLAVA+1.4&&h<22)zCrystal(c,`B${ci},${cj}`,x,h,z,'seed',ZSEEDS[(r()*6)|0])}
  /* monster packs (never near the home gate) */
  const cx=ci*ZCS+ZCS/2,cz=cj*ZCS+ZCS/2;
  if(Math.hypot(cx-home.x,cz-home.z)>34){const packs=1+(r()<.55?1:0)+(tier>=1&&r()<.45?1:0);
    for(let k=0;k<packs;k++){const id=`${ci},${cj}:${k}`;if(ZN.killed.has(id)||ZN.spawned.has(id))continue;
      const px=ci*ZCS+5+r()*(ZCS-10),pz=cj*ZCS+5+r()*(ZCS-10),ph=zsurf(px,pz);if(ph<ZLAVA+2||ph>20)continue;
      const tt=zTier(px,pz),roll=r();let type='crawler',cnt=3+(r()*3|0);
      if(tt>=1&&roll>.93){type='warden';cnt=1}else if(roll>.7){type='brute';cnt=1+(tt>=2?1:0)+(r()<.3?1:0)}else if(roll>.42){type='wraith';cnt=1+(r()*(1+tt*.5)|0)}
      ZN.spawned.add(id);const pk={id,alive:cnt};for(let i=0;i<cnt;i++)zSpawn(type,px+(r()-.5)*5,pz+(r()-.5)*5,tt,pk)}}
  ZN.g.add(c.g);ZN.S.set(ci+','+cj,c);return c}
/* ---------- monsters ---------- */
const ZTYPES={
  crawler:{hp:46,dmg:9,spd:5.4,reach:1.5,wind:.28,aggro:15,coin:7,s:.95,name:'Skitter'},
  brute:{hp:270,dmg:30,spd:3.1,reach:2.6,wind:.7,aggro:13,coin:30,s:1.55,name:'Gorebrute'},
  wraith:{hp:95,dmg:17,spd:3.6,reach:0,wind:0,aggro:19,coin:16,s:1.1,name:'Voidwraith'},
  warden:{hp:1300,dmg:40,spd:3.3,reach:3.6,wind:.8,aggro:21,coin:140,s:2.7,name:'Zone Warden'}};
function zMesh(m,geo,mat,x,y,z,sx,sy,sz){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy??sx,sz??sx);o.castShadow=true;m.add(o);return o}
function zBuild(type){const X=zShared(),M=X.m,g=new THREE.Group(),legs=[],arms=[];let body;
  if(type==='crawler'){
    body=zMesh(g,X.sph,M.skin,0,.65,0,1.0,.6,1.5);zMesh(g,X.sph,M.skin2,0,.85,.7,.7,.5,.7);
    for(const s of[-.2,.2])zMesh(g,X.sph,M.eye,s,1.0,1.18,.14);
    for(let i=0;i<6;i++){const side=i%2?1:-1,zz=-.5+(i>>1)*.5,p=new THREE.Group();p.position.set(side*.45,.7,zz);const l=zMesh(p,X.cyl,M.dark,side*.45,-.3,0,.09,1,.09);l.rotation.z=side*.9;l.position.y=-.55;g.add(p);legs.push(p)}
    for(let i=0;i<4;i++)zMesh(g,X.cone,M.bone,0,1.05,-.5+i*.3,.12,.35,.12)}
  else if(type==='brute'){
    body=zMesh(g,X.sph,M.skin,0,1.25,0,1.3,1.2,1.0);zMesh(g,X.sph,M.skin2,0,1.95,.2,.7,.65,.7);
    for(const s of[-.22,.22]){zMesh(g,X.sph,M.eye,s,2.05,.62,.12);const h=zMesh(g,X.cone,M.bone,s*2.2,2.5,.15,.16,.7,.16);h.rotation.z=-s*1.4}
    for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.85,1.7,0);zMesh(p,X.cyl,M.skin2,0,-.7,0,.32,1.5,.32);zMesh(p,X.sph,M.dark,0,-1.55,0,.6);g.add(p);arms.push(p);
      const l=new THREE.Group();l.position.set(s*.35,.8,0);zMesh(l,X.cyl,M.dark,0,-.8,0,.34,.85,.34);g.add(l);legs.push(l)}
    zMesh(g,X.sph,M.core,0,1.3,.5,.22)}
  else if(type==='wraith'){
    body=zMesh(g,X.cone,M.void,0,.1,0,1.1,2.4,1.1);body.rotation.x=Math.PI;body.position.y=2.4;
    zMesh(g,X.sph,M.dark,0,2.6,0,.6,.7,.6);for(const s of[-.14,.14])zMesh(g,X.sph,M.eyeC,s,2.65,.28,.11);
    for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.55,2.1,.1);zMesh(p,X.cyl,M.void,0,-.4,0,.14,.9,.14);g.add(p);arms.push(p)}}
  else{
    body=zMesh(g,X.sph,M.skin,0,1.3,0,1.35,1.3,1.1);zMesh(g,X.sph,M.skin2,0,2.1,.2,.75,.7,.75);
    for(const s of[-.22,.22])zMesh(g,X.sph,M.eye,s,2.2,.66,.13);
    for(let i=0;i<7;i++){const a=(i/7-.5)*2.4;const h=zMesh(g,X.cone,M.bone,Math.sin(a)*.5,2.7+Math.cos(a)*.25,-.1,.15,.9,.15);h.rotation.z=-a*.9}
    for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.95,1.8,0);zMesh(p,X.cyl,M.skin2,0,-.8,0,.36,1.7,.36);zMesh(p,X.sph,M.dark,0,-1.75,0,.7);g.add(p);arms.push(p);
      const l=new THREE.Group();l.position.set(s*.4,.85,0);zMesh(l,X.cyl,M.dark,0,-.8,0,.38,.9,.38);g.add(l);legs.push(l)}
    zMesh(g,X.sph,M.core,0,1.35,.55,.34);g.add(zHalo('#ff5a2a',4,1.4))}
  return{g,legs,arms,body}}
function zSpawn(type,x,z,tier,pk){const S=ZTYPES[type],rig=zBuild(type),hpK=1+.7*tier,hp=Math.round(S.hp*hpK);
  const n={kind:'zmon',type,x,z,y:zsurf(x,z),hx:x,hz:z,hp,maxHp:hp,dm:S.dmg*(1+.45*tier),spd:S.spd,reach:S.reach,windT:S.wind,aggroR:S.aggro,k:S.s,coin:S.coin,tier,
    rig,g:rig.g,pk,aggro:false,dying:0,hitT:0,kbx:0,kbz:0,atkCd:1,wind:0,ang:Math.random()*6.28,moving:false,tm:Math.random()*9,shootCd:1.5+Math.random(),slamCd:5,lungeCd:0,lunge:0,idle:0,hp0:hp};
  rig.g.scale.setScalar(S.s);rig.g.position.set(x,n.y,z);ZN.g.add(rig.g);ZN.mons.push(n);return n}
function zRemoveMon(n,real){ZN.g.remove(n.g);disposeTree(n.g);if(n.bd){n.bd.remove();n.bd=null}if(n.hd){n.hd.remove();n.hd=null}const i=ZN.mons.indexOf(n);if(i>=0)ZN.mons.splice(i,1);
  if(real&&n.pk){n.pk.alive--;if(n.pk.alive<=0)ZN.killed.add(n.pk.id)}else if(!real&&n.pk){n.pk.alive--;if(n.pk.alive<=0)ZN.spawned.delete(n.pk.id)}}
function zoneKill(n){
  if(n.dying)return;n.dying=.6;n.aggro=false;const S=ZTYPES[n.type],t=n.tier;ZN.kills++;
  const v=Math.max(1,Math.round(n.coin*(1+.45*t)*ch.coinK));ZN.loot+=v;floatText(n.x,2.8*n.k,n.z,'+'+v,'#ff9ad8');burst(n.x,1.4*n.k,n.z,'#ff3a6a',30,5,.4);SFX.ok&&SFX.ok();
  if(Math.random()<(n.type==='warden'?1:n.type==='brute'?.35:.12)){const el=ZSEEDS[(Math.random()*6)|0];G.seeds[el]++;toast(`The ${S.name} dropped a ${ELEM[el].n} seed. Mix seeds at the Seed Forge in the Nexus.`)}
  const gp=n.type==='warden'?1:n.type==='brute'?.22:n.type==='wraith'?.1:.04;
  if(Math.random()<gp){const g=genGear(null,n.type==='warden'?Math.max(2,rollRar(1.4)):rollRar(.45+.1*t));dropGear(g,n.x+(Math.random()-.5)*1.4,n.z+(Math.random()-.5)*1.4);burst(n.x,1.5,n.z,RAR[g.rar].c,24,4,.4)}
  if(n.type==='warden'){toast('A Zone Warden falls. The land trembles.');shk=Math.max(shk,1)}
}
function zoneMonTick(n,dt){
  const P=ch;n.tm+=dt;n.hitT-=dt;
  if(n.dying){n.dying-=dt;const k=Math.max(0,n.dying/.6);n.g.scale.setScalar(ZTYPES[n.type].s*(.2+.8*k));n.g.rotation.z+=dt*3;if(n.dying<=0)zRemoveMon(n,true);return}
  if(n.kbx||n.kbz){const nx=n.x+n.kbx*dt,nz=n.z+n.kbz*dt;if(zsurf(nx,nz)>ZLAVA+.6){n.x=nx;n.z=nz}const f=Math.pow(.02,dt);n.kbx*=f;n.kbz*=f;if(Math.hypot(n.kbx,n.kbz)<.2)n.kbx=n.kbz=0}
  const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz)||1,S=ZTYPES[n.type];
  if(n.hp<n.hp0&&!n.aggro){n.aggro=true;if(n.pk)for(const o of ZN.mons)if(o.pk===n.pk)o.aggro=true}
  if(!n.aggro){if(d<n.aggroR&&P.hp>0){n.aggro=true;if(n.pk)for(const o of ZN.mons)if(o.pk===n.pk)o.aggro=true}
    else{n.idle-=dt;if(n.idle<=0){n.idle=2+Math.random()*3;n.ang=Math.random()*6.28;n.wan=Math.random()<.5}n.moving=!!n.wan&&n.type!=='wraith';
      if(n.moving){const nx=n.x+Math.sin(n.ang)*1.2*dt,nz=n.z+Math.cos(n.ang)*1.2*dt;if(zsurf(nx,nz)>ZLAVA+1&&Math.hypot(nx-n.hx,nz-n.hz)<8){n.x=nx;n.z=nz}}}}
  else{
    if(Math.hypot(n.x-n.hx,n.z-n.hz)>48||d>40||P.hp<=0){n.aggro=false;n.hp=n.maxHp;n.hp0=n.hp;n.wind=0;n.x+=(n.hx-n.x)*.02}
    else{n.ang=Math.atan2(dx,dz);const slow=n.slow>0?(n.slow-=dt,.45):1;if(n.frozen>0){n.frozen-=dt;n.moving=false}
    else if(n.type==='wraith'){
      n.moving=true;const want=d<7?-1:d>11?1:0,sp=n.spd*dt*slow;if(want){const nx=n.x+dx/d*want*sp,nz=n.z+dz/d*want*sp;if(zsurf(nx,nz)>ZLAVA){n.x=nx;n.z=nz}}else{n.x+=-dz/d*sp*.5;n.z+=dx/d*sp*.5}
      n.shootCd-=dt;if(n.shootCd<=0&&d<20){n.shootCd=1.7+Math.random()*.8;ZN.bolts.push({x:n.x,y:n.y+2.3,z:n.z,vx:dx/d*11,vz:dz/d*11,life:2.6,dm:n.dm,m:(()=>{const b=new THREE.Mesh(zShared().sph,zShared().m.bolt);b.scale.setScalar(.5);b.position.set(n.x,n.y+2.3,n.z);ZN.g.add(b);return b})()});n.wc=.2}
    }else{
      n.atkCd-=dt;n.lungeCd-=dt;
      if(n.wind>0){n.wind-=dt;n.moving=false;if(n.wind<=0){n.atkCd=n.type==='crawler'?1.0:1.9;slash(n.x+dx/d*.8,n.z+dz/d*.8,n.ang,'#ff5a8a',1.4);if(d<n.reach+.7)hurtPlayer(Math.round(n.dm),{x:n.x,z:n.z,kind:'zmon'})}}
      else if(n.lunge>0){n.lunge-=dt;n.x+=Math.sin(n.ang)*11*dt;n.z+=Math.cos(n.ang)*11*dt;if(d<n.reach){n.lunge=0;n.wind=.12}}
      else if(d<n.reach){n.moving=false;if(n.atkCd<=0)n.wind=n.windT}
      else{const sp=n.spd*dt*slow,nx=n.x+dx/d*sp,nz=n.z+dz/d*sp;if(zsurf(nx,nz)>ZLAVA+.3){n.x=nx;n.z=nz}else if(zsurf(n.x+dx/d*sp,n.z)>ZLAVA+.3)n.x+=dx/d*sp;else if(zsurf(n.x,n.z+dz/d*sp)>ZLAVA+.3)n.z+=dz/d*sp;n.moving=true;
        if(n.type==='crawler'&&n.lungeCd<=0&&d<6&&d>2.5){n.lunge=.22;n.lungeCd=2.2+Math.random()}}
      if(n.type==='warden'){n.slamCd-=dt;if(n.slamCd<=0&&d<14){n.slamCd=6.5;const m=new THREE.Mesh(zShared().ring,zShared().m.ringR.clone());m.position.set(n.x,zsurf(n.x,n.z)+.25,n.z);m.scale.setScalar(6.5/1.4);ZN.g.add(m);ZN.slams.push({x:n.x,z:n.z,t:1.5,r:6.5,m,dm:n.dm*1.15});toast('The Warden raises its fists. Get out of the red circle!',true)}}
    }}}
  n.y=zsurf(n.x,n.z)+(n.type==='wraith'?.4+Math.sin(n.tm*2.2)*.25:0);n.g.position.set(n.x,n.y,n.z);
  const ta=n.ang,cur=n.g.rotation.y;let da=ta-cur;da=Math.atan2(Math.sin(da),Math.cos(da));n.g.rotation.y=cur+da*Math.min(1,dt*9);
  const sw=Math.sin(n.tm*(n.type==='crawler'?18:7))*(n.moving?.8:0);n.rig.legs.forEach((l,i)=>l.rotation.x=sw*(i%2?1:-1));
  const wa=n.wind>0?-1.9:n.wc>0?-1.2:0;if(n.wc>0)n.wc-=dt;n.rig.arms.forEach((a,i)=>a.rotation.x=wa||sw*.5*(i%2?-1:1));
  if(n.hitT>0)n.g.scale.setScalar(ZTYPES[n.type].s*1.08);else n.g.scale.setScalar(ZTYPES[n.type].s);
}
/* ---------- enter / exit ---------- */
function buildZoneGate(g){
  const X=zShared(),gx=-16,gr=new THREE.Group();gr.position.set(gx,0,-4.2);
  const U={t:{value:0}},sw=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false,uniforms:U,
    vertexShader:'varying vec2 v;void main(){v=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float t;varying vec2 v;void main(){float r=length(v);if(r>1.)discard;float a=atan(v.y,v.x);float s=sin(a*3.+log(r+.03)*8.+t*2.4)*.5+.5;float s2=sin(a*5.-log(r+.03)*12.-t*1.7)*.5+.5;float core=smoothstep(.5,0.,r);vec3 c=mix(vec3(.15,0.,.02),vec3(1.,.12,.2),s)+vec3(.6,0.,.8)*s2*.4*r+vec3(1.,.5,.4)*core*core*.5;float rim=smoothstep(1.,.8,r);gl_FragColor=vec4(c*rim,rim*.85);}'});
  const disc=new THREE.Mesh(new THREE.CircleGeometry(1.9,48),sw);disc.position.y=2.3;gr.add(disc);
  const rune=mat('#1c0f24',{metalness:.6,roughness:.4});
  for(const s of[-1,1]){const p=new THREE.Mesh(X.cyl,rune);p.scale.set(.7,4.9,.7);p.position.set(s*2.2,0,0);p.castShadow=true;gr.add(p);for(let i=0;i<3;i++){const sp=new THREE.Mesh(X.cone,rune);sp.scale.set(.3,1.2,.3);sp.position.set(s*(2.2+(i-1)*.0),4.9+i*.0,(i-1)*.25);sp.rotation.z=-s*.25*i;gr.add(sp)}}
  const arc=new THREE.Mesh(new THREE.TorusGeometry(2.2,.32,8,28,Math.PI),rune);arc.position.y=2.4+.0;arc.rotation.z=0;arc.position.y=2.4;gr.add(arc);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.95,.07,8,48),glow('#ff3a4a',3));ring.position.y=2.3;gr.add(ring);
  const lt=new THREE.PointLight('#ff2a3a',20,12,1.5);lt.position.set(0,2.3,1.5);gr.add(lt);gr.add(zHalo('#ff2a3a',7,2.3));
  const lab=sign?sign('THE ZONE',2.6,.55,'#ff6a7a'):null;if(lab){lab.position.set(0,5.9,.1);gr.add(lab)}
  const rg=new THREE.Mesh(geo('zgring',()=>new THREE.RingGeometry(1.05,1.3,48)),addMat('#ff3a4a',.75));rg.rotation.x=-Math.PI/2;rg.position.set(gx,.04,ZMIN+.2);g.add(rg);
  const bm=new THREE.Mesh(geo('zgbeam',()=>new THREE.CylinderGeometry(1.1,1.1,14,32,1,true)),addMat('#ff3a4a',.07));bm.position.set(gx,7,ZMIN+.2);g.add(bm);
  g.add(gr);WD.zgate={x:gx,g:gr,rg};
  WD.anim.push(t=>{U.t.value=t;ring.rotation.z=t*.8;rg.material.opacity=.5+Math.sin(t*3)*.25})}
function zoneEnter(){
  if(ZN.on||!G||(DU.on&&!DU.solo)||trav)return;
  ZN.on=true;ZN.seed=((Math.random()*1e6)|0)+1;ZN.loot=0;ZN.kills=0;ZN.killed=new Set();ZN.spawned=new Set();ZN.gotP=new Set();ZN.mons=[];ZN.S=new Map();ZN.bolts=[];ZN.slams=[];ZN.exitT=0;ZN.time=0;
  ZN.home={x:0,z:0};closePanel();clearMagic();
  const st=ZN.stash={group:WD.group,items:WD.items,npcs:WD.npcs,coins:WD.coins,shots:WD.shots,rings:WD.rings,portal:WD.portal,huntT:WD.huntT,sunOff:WD.sunOff,fog:scene.fog,sc:sun.color.clone(),si:sun.intensity,hc:hemi.color.clone(),hg:hemi.groundColor.clone(),hi:hemi.intensity,exp:renderer.toneMappingExposure,bl:[bloom.strength,bloom.threshold,bloom.radius],px:ch.x,pz:ch.z,mach:WD.machine&&WD.machine.visible};
  closePortal();st.group.visible=false;
  ZN.g=new THREE.Group();scene.add(ZN.g);Object.assign(WD,{group:ZN.g,items:[],npcs:ZN.mons,coins:[],shots:[],rings:[],portal:null,huntT:1e9,sunOff:new THREE.Vector3(-30,34,24)});
  scene.fog=new THREE.FogExp2('#2a0a30',.011);sun.color.set('#ff7a5a');hemi.color.set('#9a6aff');hemi.groundColor.set('#401030');hemi.intensity=.62;sun.intensity=1.5;
  renderer.toneMappingExposure=1.08;bloom.strength=.5;bloom.threshold=.62;bloom.radius=.5;setFilm('none');
  /* alien sky dome */
  ZN.dome=new THREE.Mesh(new THREE.SphereGeometry(420,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false,uniforms:{t:{value:0}},
    vertexShader:'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 p;float h(vec3 q){return fract(sin(dot(q,vec3(12.9898,78.233,37.7)))*43758.5453);}void main(){float y=p.y;vec3 c=mix(vec3(.42,.07,.16),vec3(.05,.01,.12),smoothstep(-.05,.6,y));c=mix(vec3(.12,.02,.05),c,smoothstep(-.4,0.,y));vec3 q=floor(p*90.);float s=step(.985,h(q))*smoothstep(.1,.5,y);c+=vec3(s);vec3 mp=normalize(vec3(-.55,.38,-.75));float d=distance(p,mp);c=mix(c,vec3(.95,.55,.5),smoothstep(.11,.1,d)*.95);c+=vec3(1.,.3,.4)*smoothstep(.3,.1,d)*.25;vec3 m2=normalize(vec3(.7,.28,-.5));c=mix(c,vec3(.6,.8,1.),smoothstep(.04,.035,distance(p,m2)));gl_FragColor=vec4(c,1.);}'}));
  ZN.dome.renderOrder=-10;scene.add(ZN.dome);scene.background=new THREE.Color('#1a0620');
  ZN.lava=new THREE.Mesh(new THREE.PlaneGeometry(700,700).rotateX(-Math.PI/2),zShared().m.lava);ZN.lava.position.y=ZLAVA;scene.add(ZN.lava);
  ch.x=0;ch.z=0;ch.y=zsurf(0,0);ch.target=null;ch.vy=0;ZN.yaw=0;ZN.cam={x:0,y:ch.y,z:0};ch.hp=ch.maxHp;
  for(let k=0;k<40;k++)zStream(99);
  /* return gate */
  const X=zShared(),hg=new THREE.Group();hg.position.set(0,zsurf(0,-4),-4);const rg=new THREE.Mesh(X.ring,X.m.ringV);rg.scale.setScalar(1.7);hg.add(rg);const bm=new THREE.Mesh(X.beam,X.m.beamV);hg.add(bm);hg.add(zHalo('#b44aff',7,2));
  const rlab=sign('RETURN',2,.45,'#c88aff');rlab.position.set(0,3.4,0);hg.add(rlab);ZN.g.add(hg);ZN.retG=hg;ZN.retRg=rg;ZN.home.rx=0;ZN.home.rz=-4;
  zHud();ZN.hud.hidden=false;GU.uFlash.value=.45;beep&&beep(120,.6,'sawtooth',.06,.4);
  toast('You stepped into THE ZONE. Everything here wants you dead. Loot is lost if you fall.',true);
}
function zoneExit(dead){
  if(!ZN.on)return;ZN.on=false;fxRoot.position.y=0;const st=ZN.stash;
  for(const n of [...ZN.mons])zRemoveMon(n,false);
  scene.remove(ZN.g);ZN.g.traverse(o=>{if(o.isInstancedMesh)o.dispose()});disposeTree(ZN.g);ZN.S.clear();
  scene.remove(ZN.dome);ZN.dome.geometry.dispose();ZN.dome.material.dispose();scene.remove(ZN.lava);
  for(const b of ZN.bolts)scene.remove(b.m);ZN.bolts=[];ZN.slams=[];
  clearMagic();
  Object.assign(WD,{group:st.group,items:st.items,npcs:st.npcs,coins:st.coins,shots:st.shots,rings:st.rings,portal:st.portal,huntT:st.huntT,sunOff:st.sunOff});
  st.group.visible=true;scene.fog=st.fog;sun.color.copy(st.sc);sun.intensity=st.si;hemi.color.copy(st.hc);hemi.groundColor.copy(st.hg);hemi.intensity=st.hi;
  renderer.toneMappingExposure=st.exp;bloom.strength=st.bl[0];bloom.threshold=st.bl[1];bloom.radius=st.bl[2];setFilm(ERA[WD.year].film);scene.background=null;
  ch.y=0;ch.vy=0;ch.target=null;ch.x=WD.zgate?WD.zgate.x:0;ch.z=ZMIN+.8;camX=ch.x;ch.hp=ch.maxHp;ch.inv=1.5;ch.rig.g.position.y=0;
  ZN.hud.hidden=true;GU.uFlash.value=.45;
  if(dead){const l=ZN.loot;toast(`Killed in THE ZONE. You lost the ${l} coins you were carrying.`,true)}
  else{G.coins+=ZN.loot;if(ZN.loot)toast(`You escaped THE ZONE with ${ZN.loot} coins and ${ZN.kills} kills.`);else toast('You returned to the Nexus.')}
  ZN.loot=0;
}
function zoneKnockout(){
  floatText(ch.x,2.6,ch.z,'YOU DIED','#ff3a3a');burst(ch.x,1.5,ch.z,'#ff3a6a',50,6,.5);zoneExit(true)}
/* ---------- streaming ---------- */
function zStream(max=1){const R=2,ci=Math.floor(ch.x/ZCS),cj=Math.floor(ch.z/ZCS);let n=0;const ord=[];for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++)ord.push([a,b,a*a+b*b]);ord.sort((p,q)=>p[2]-q[2]);
  for(const[a,b]of ord){if(n>=max)break;if(!ZN.S.has((ci+a)+','+(cj+b))){zChunk(ci+a,cj+b);n++}}
  for(const[k,c]of[...ZN.S])if(Math.abs(c.ci-ci)>R+1||Math.abs(c.cj-cj)>R+1){ZN.g.remove(c.g);c.g.traverse(o=>{if(o.isInstancedMesh)o.dispose()});disposeTree(c.g);ZN.S.delete(k)}}
/* ---------- player + update ---------- */
const zRot=(dx,dz)=>{const c=Math.cos(ZN.yaw),s=Math.sin(ZN.yaw);return[dx*c+dz*s,-dx*s+dz*c]};
function zoneOk(nx,nz){const g=zsurf(nx,nz);if(g<ZLAVA-1.2)return false;const run=Math.hypot(nx-ch.x,nz-ch.z)||1;return!(g>ch.y+.4&&(g-zsurf(ch.x,ch.z))/run>1.3)}
function zonePlayer(dt){
  let vx=0,vz=0;
  if(keys.has('arrowleft')||keys.has('a'))vx--;if(keys.has('arrowright')||keys.has('d'))vx++;if(keys.has('arrowup')||keys.has('w'))vz--;if(keys.has('arrowdown')||keys.has('s'))vz++;
  if(keys.has('z'))ZN.yaw-=dt*1.8;if(keys.has('c'))ZN.yaw+=dt*1.8;
  if(vx||vz){const r=zRot(vx,vz);vx=r[0];vz=r[1]}
  else if(ch.target){const dx=ch.target.x-ch.x,dz=ch.target.z-ch.z,d=Math.hypot(dx,dz);if(d<.25)ch.target=null;else{vx=dx/d;vz=dz/d}}
  const l=Math.hypot(vx,vz);ch.moving=l>.01;const sp=5.4*ch.spd*(MAGIC.haste>0?1.6:1);
  const mv=(sx,sz)=>{if(zoneOk(ch.x+sx,ch.z+sz)){ch.x+=sx;ch.z+=sz}else if(zoneOk(ch.x+sx,ch.z)){ch.x+=sx}else if(zoneOk(ch.x,ch.z+sz)){ch.z+=sz}};
  if(ch.dashT>0){ch.dashT-=dt;mv(ch.dashX*18*dt,ch.dashZ*18*dt);if(Math.random()<.8)burst(ch.x,1,ch.z,'#6ad8e8',2,.5,.35,0,0)}
  else if(ch.moving){const k=l>1?1/l:1;mv(vx*k*sp*dt,vz*k*sp*dt);ch.fx=vx/l;ch.fz=vz/l;ch.stepT-=dt;if(ch.stepT<=0){ch.stepT=.32;noise(.05,.02,500,300)}}
  if(ch.kbx||ch.kbz){const sx=ch.kbx*dt,sz=ch.kbz*dt;mv(sx,sz);const f=Math.pow(.01,dt);ch.kbx*=f;ch.kbz*=f;if(Math.hypot(ch.kbx,ch.kbz)<.2)ch.kbx=ch.kbz=0}
  const g=zsurf(ch.x,ch.z);ch.y+=(g-ch.y)*Math.min(1,dt*18);if(Math.abs(g-ch.y)<.02)ch.y=g;
  if(g<ZLAVA+.5&&ch.inv<=0){hurtPlayer(10,{x:ch.x,z:ch.z+.01,kind:'lava'});ch.inv=.55;toast('The lava burns!',true)}
}
function zoneTick(dt){
  ZN.time+=dt;
  ch.atkCd-=dt;ch.dashCd-=dt;ch.inv-=dt;ch.swing-=dt;ch.regenWait-=dt;ch.hurtT-=dt;if(ch.regenWait<=0&&ch.hp<ch.maxHp)ch.hp=Math.min(ch.maxHp,ch.hp+ch.regen*.5*dt);
  zonePlayer(dt);fxRoot.position.y=ch.y;checkPickups();updateMagic(dt);zStream(1);
  for(const it of WD.items){it.t+=dt;it.m.position.y=zsurf(it.x,it.z)+Math.sin(it.t*2.2)*.15;it.m.rotation.y=it.t*1.6}
  for(const n of [...ZN.mons]){zoneMonTick(n,dt);if(Math.hypot(n.x-ch.x,n.z-ch.z)>75&&!n.dying&&ZN.mons.includes(n))zRemoveMon(n,false)}
  for(const b of ZN.bolts){b.life-=dt;b.x+=b.vx*dt;b.z+=b.vz*dt;b.m.position.set(b.x,zsurf(b.x,b.z)+1.5,b.z);b.m.rotation.y+=dt*8;if(Math.random()<.5)burst(b.x,1.5,b.z,'#c46aff',1,.4,.22,0,0);
    if(Math.hypot(b.x-ch.x,b.z-ch.z)<.8){b.life=0;hurtPlayer(Math.round(b.dm),{x:b.x,z:b.z,kind:'zmon'})}if(b.life<=0)ZN.g.remove(b.m)}
  ZN.bolts=ZN.bolts.filter(b=>b.life>0);
  for(const s of ZN.slams){s.t-=dt;s.m.material.opacity=.3+.5*(1-s.t/1.5);if(s.t<=0){burst(s.x,1,s.z,'#ff5a2a',60,8,.5);shk=Math.max(shk,1);SFX.hit&&SFX.hit();if(Math.hypot(ch.x-s.x,ch.z-s.z)<s.r)hurtPlayer(Math.round(s.dm),{x:s.x,z:s.z,kind:'zmon'});ZN.g.remove(s.m);s.m.material.dispose()}}
  ZN.slams=ZN.slams.filter(s=>s.t>0);
  /* crystals, blooms */
  for(const c of ZN.S.values())for(let i=c.picks.length-1;i>=0;i--){const p=c.picks[i];p.m.rotation.y+=dt*1.8;p.m.position.y=p.y+.15+Math.sin(ZN.time*2.4+p.ph)*.15;
    if(Math.abs(p.x-ch.x)<1.5&&Math.abs(p.z-ch.z)<1.5){ZN.gotP.add(p.id);c.g.remove(p.m);c.picks.splice(i,1);burst(p.x,1,p.z,'#ff7ad0',24,4,.3,3);beep&&beep(760,.14,'sine',.07,1.5);
      if(p.kind==='coin'){const v=Math.round(p.v*ch.coinK);ZN.loot+=v;floatText(p.x,1.8,p.z,'+'+v,'#ff9ad8')}
      else{G.seeds[p.v]++;toast(`You found a ${ELEM[p.v].n} seed. Mix seeds at the Seed Forge in the Nexus.`)}}}
  /* return gate: stand in it for a moment */
  const rd=Math.hypot(ch.x-ZN.home.rx,ch.z-ZN.home.rz);ZN.retRg.rotation.y=ZN.time;
  if(rd<2.2&&ch.hp>0){ZN.exitT+=dt;if(ZN.exitT>1.1)return zoneExit(false)}else ZN.exitT=Math.max(0,ZN.exitT-dt*2);
  /* hud */
  ZN.mmT-=dt;if(ZN.mmT<=0){ZN.mmT=.15;zMap()}
}
function zoneCamera(dt){
  const asp=W/H,dist=ZN.dist*(asp<1?1.25:1),cp=Math.cos(ZN.pitch),sp=Math.sin(ZN.pitch),cm=ZN.cam,k=1-Math.pow(.0005,dt);
  cm.x+=(ch.x-cm.x)*k;cm.z+=(ch.z-cm.z)*k;cm.y+=(ch.y-cm.y)*(1-Math.pow(.01,dt));
  let cx=cm.x+Math.sin(ZN.yaw)*cp*dist,cz=cm.z+Math.cos(ZN.yaw)*cp*dist,cy=cm.y+2.2+sp*dist;const gh=zsurf(cx,cz)+1.4;if(cy<gh)cy=gh;
  const sx=(Math.random()-.5)*shk*.5,sy=(Math.random()-.5)*shk*.5;
  camera.position.set(cx+sx,cy+sy,cz);camera.lookAt(cm.x,cm.y+1.9,cm.z);camX=cm.x;
  sun.position.set(ch.x+WD.sunOff.x,ch.y+WD.sunOff.y,ch.z+WD.sunOff.z);sun.target.position.set(ch.x,ch.y,ch.z);shk=Math.max(0,shk-dt*2.2);
  ZN.dome.position.copy(camera.position);ZN.lava.position.set(Math.round(ch.x/8)*8,ZLAVA,Math.round(ch.z/8)*8);ZN.dome.material.uniforms.t.value=ZN.time}
/* ---------- input ---------- */
cv.addEventListener('pointerdown',e=>{if(!ZN.on)return;ZN.drag={x:e.clientX,y:e.clientY,moved:false,id:e.pointerId}});
addEventListener('pointermove',e=>{const d=ZN.drag;if(!ZN.on||!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.moved&&Math.hypot(dx,dy)>9)d.moved=true;if(d.moved){ZN.yaw-=(e.clientX-(d.lx??d.x))*.0065;ZN.pitch=Math.max(.14,Math.min(.9,ZN.pitch+(e.clientY-(d.ly??d.y))*.004))}d.lx=e.clientX;d.ly=e.clientY});
addEventListener('pointerup',e=>{const d=ZN.drag;if(!ZN.on||!d||d.id!==e.pointerId)return;ZN.drag=null;if(d.moved||busy())return;
  ndc.set(e.clientX/W*2-1,-(e.clientY/H)*2+1);ray.setFromCamera(ndc,camera);const meshes=[];ZN.S.forEach(c=>meshes.push(c.t));const h=ray.intersectObjects(meshes,false)[0];
  if(h){ch.target={x:h.point.x,z:h.point.z};burst(h.point.x,.1,h.point.z,'#ff7ad0',6,1,.25,0,0)}});
cv.addEventListener('wheel',e=>{if(!ZN.on)return;ZN.dist=Math.max(6,Math.min(22,ZN.dist+e.deltaY*.01));e.preventDefault()},{passive:false});
/* ---------- hud ---------- */
function zHud(){
  if(ZN.hud)return;const st=document.createElement('style');st.textContent=`#znHud{position:fixed;inset:0;z-index:4;pointer-events:none;font:600 13px/1.3 Inter,system-ui,sans-serif;color:#f6d8e0}
#znHud .pl{position:absolute;background:rgba(18,4,14,.66);border:1px solid rgba(255,70,110,.45);border-radius:10px;padding:8px 12px;backdrop-filter:blur(6px)}
#znHud .tl{left:12px;top:64px}#znHud .tl b{display:block;font:700 18px Georgia,serif;color:#ff7a96;letter-spacing:.08em}
#znHud canvas{position:absolute;right:12px;top:64px;width:120px;height:120px;border-radius:10px;border:1px solid rgba(255,70,110,.45);background:rgba(18,4,14,.66)}
#znHud .hint{left:50%;bottom:112px;transform:translateX(-50%);font-weight:500;opacity:.8;text-align:center;max-width:62vw;font-size:12px}
@media (max-width:680px){#znHud .hint{display:none}}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='znHud';d.innerHTML=`<div class="pl tl"><b>THE ZONE</b><span id="znInfo"></span></div><canvas id="znMap" width="240" height="240"></canvas><div class="pl hint">Drag to turn the camera · wheel to zoom · Z/C rotate · loot is only safe when you step into the violet RETURN gate</div>`;document.body.appendChild(d);ZN.hud=d}
function zMap(){
  const cvs=$('znMap'),o=cvs.getContext('2d'),S=1.1,w=cvs.width;o.clearRect(0,0,w,w);o.save();o.translate(w/2,w/2);
  const r=Math.atan2(-Math.sin(ZN.yaw)*0,1);
  const tx=(x,z)=>{const dx=x-ch.x,dz=z-ch.z,c=Math.cos(ZN.yaw),s=Math.sin(ZN.yaw);return[(dx*c-dz*s)*S,(dx*s+dz*c)*S]};
  for(const m of ZN.mons){if(m.dying)continue;const[x,y]=tx(m.x,m.z);if(Math.abs(x)>w/2||Math.abs(y)>w/2)continue;o.fillStyle=m.aggro?'#ff3a3a':'#a87a40';o.beginPath();o.arc(x,y,m.type==='warden'?6:3,0,6.3);o.fill()}
  for(const c of ZN.S.values())for(const p of c.picks){const[x,y]=tx(p.x,p.z);if(Math.abs(x)>w/2||Math.abs(y)>w/2)continue;o.fillStyle=p.kind==='seed'?'#7affc8':'#ff7ad0';o.fillRect(x-2,y-2,4,4)}
  {const[x,y]=tx(ZN.home.rx,ZN.home.rz);const cl=(v)=>Math.max(-w/2+8,Math.min(w/2-8,v));o.fillStyle='#b44aff';o.beginPath();o.arc(cl(x),cl(y),6,0,6.3);o.fill()}
  o.fillStyle='#fff';o.beginPath();o.moveTo(0,-8);o.lineTo(6,6);o.lineTo(-6,6);o.closePath();o.fill();o.restore();
  const t=zTier(ch.x,ch.z);$('znInfo').innerHTML=`Danger <b style="display:inline;font:700 13px Inter;color:#ff7a96">${t+1}</b> · Loot <b style="display:inline;font:700 13px Inter;color:#ffd24a">${ZN.loot}</b> coins<br>Kills ${ZN.kills}`}

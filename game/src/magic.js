/* ================= magic: spells, seeds, mana, fountain, forge ================= */
const ELEM={past:{n:'Past',c:'#e8b865'},future:{n:'Future',c:'#5ff5d6'},void:{n:'Void',c:'#b44aff'},ember:{n:'Ember',c:'#ff7a3a'},storm:{n:'Storm',c:'#ffe45a'},echo:{n:'Echo',c:'#7ad0ff'}};
const ELKEYS=Object.keys(ELEM);
const MAGIC={cd:[0,0],cdMax:[1,1],haste:0,proj:[],fx:[],tm:[],wells:[],blades:null,ward:null,sparkT:0,warnT:0,forge:[],forgeMsg:''};
const isFoe=n=>!n.dying&&(n.kind==='hunter'||n.kind==='lord'||n.kind==='citizen');
const foesIn=(x,z,r)=>WD.npcs.filter(n=>isFoe(n)&&Math.hypot(n.x-x,n.z-z)<=r+(n.kind==='lord'?1:0));
const pw=id=>1+.3*((G.spells[id]||1)-1);
function hitFoe(n,dmg,fx,fz){if(n.dying)return;hurtNpc(n,Math.max(1,Math.round(dmg)),n.x-fx,n.z-fz)}
function aim(range=11){let best=null,bd=range;
  for(const n of WD.npcs){if(!isFoe(n))continue;const dx=n.x-ch.x,dz=n.z-ch.z,d=Math.hypot(dx,dz);if(d<bd&&(dx*ch.fx+dz*ch.fz)/(d||1)>-.3){bd=d;best=n}}
  if(best){const dx=best.x-ch.x,dz=best.z-ch.z,l=Math.hypot(dx,dz)||1;ch.fx=dx/l;ch.fz=dz/l}return best}
/* ---- visual helpers ---- */
function mfx(m,life,upd){scene.add(m);MAGIC.fx.push({m,life,max:life,upd})}
function ringFx(x,z,r,c,life=.5,y=.08){const m=new THREE.Mesh(geo('mring',()=>new THREE.RingGeometry(.88,1,56)),addMat(c,.85));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.scale.setScalar(.3);
  mfx(m,life,k=>{m.scale.setScalar(.3+(r-.3)*(1-Math.pow(1-k,2)));m.material.opacity=.85*(1-k)})}
function boltFx(x1,z1,x2,z2,c){
  for(let j=0;j<3;j++){const pts=[],n=7;for(let i=0;i<=n;i++){const t=i/n,mid=i&&i<n;pts.push(new THREE.Vector3(x1+(x2-x1)*t+(mid?(Math.random()-.5)*.9:0)+j*.03,1.3+(mid?(Math.random()-.5)*.6:0),z1+(z2-z1)*t+(mid?(Math.random()-.5)*.9:0)))}
    const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));m.userData.geo=true;mfx(m,.3,k=>{m.material.opacity=1-k})}
  burst(x2,1.3,z2,c,14,3,.3)}
function projectile(x,y,z,vx,vz,dmg,c,pierce){const m=new THREE.Mesh(SPH(),glow(c,5));m.scale.setScalar(.34);m.position.set(x,y,z);scene.add(m);MAGIC.proj.push({x,y,z,vx,vz,dmg,c,m,life:1.4,pierce,hit:new Set()})}
const later=(t,fn)=>MAGIC.tm.push({t,fn});
/* ---- spells ---- */
const SPELLS={
  bolt:{n:'Chrono Bolt',el:'past',t:1,cost:6,cd:.5,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 5 14h6l-2 8 10-13h-6z"/></svg>',d:'A bolt of frozen time that homes in on nearby foes. Weak, but cheap.',
    cast(p){aim(11);projectile(ch.x+ch.fx*.6,1.3,ch.z+ch.fz*.6,ch.fx*15,ch.fz*15,16*p,'#e8b865',false);SFX.shot()}},
  ward:{n:'Echo Ward',el:'echo',t:1,cost:18,cd:7,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="3"/></svg>',d:'An echo of a second ago shields you. Nothing can hurt you for 2.4 s.',
    cast(p){ch.inv=Math.max(ch.inv,2.4*p);MAGIC.ward={t:2.4*p,m:null};ringFx(ch.x,ch.z,2.4,'#7ad0ff',.6);burst(ch.x,1.2,ch.z,'#7ad0ff',24,3,.3);SFX.ok()}},
  blink:{n:'Blink Step',el:'void',t:1,cost:12,cd:3,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h10M9 6l6 6-6 6M18 6v12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',d:'Skip 7 steps ahead through the void. Foes at the landing are hurt.',
    cast(p){burst(ch.x,1,ch.z,'#b44aff',22,3,.35);const nx=ch.x+ch.fx*7,nz=clamp(ch.z+ch.fz*7,ZMIN,ZMAX);ch.x=nx;ch.z=nz;ch.inv=Math.max(ch.inv,.4);
      burst(nx,1,nz,'#b44aff',26,4,.4);ringFx(nx,nz,2.4,'#b44aff',.4);for(const n of foesIn(nx,nz,2.4))hitFoe(n,16*p,nx,nz);SFX.dash()}},
  mend:{n:'Rewind Mend',el:'past',t:1,cost:24,cd:8,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg>',d:'Rewinds your wounds. Restores 40 health.',
    cast(p){const h=Math.round(40*p);ch.hp=Math.min(ch.maxHp,ch.hp+h);floatText(ch.x,2.6,ch.z,'+'+h,'#86e09a',true);ringFx(ch.x,ch.z,2,'#86e09a',.6);burst(ch.x,1.4,ch.z,'#86e09a',26,2.5,.3);SFX.ok()}},
  slow:{n:'Molasses Time',el:'future',t:1,cost:16,cd:7,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',d:'Time turns to syrup ahead of you. Foes inside move at 40% for 5 s.',
    cast(p){aim(8);const x=ch.x+ch.fx*3.2,z=clamp(ch.z+ch.fz*3.2,ZMIN,ZMAX);ringFx(x,z,5.5,'#5ff5d6',.8);for(const n of foesIn(x,z,5.5)){if(n.kind==='lord')continue;n.slow=5*p;burst(n.x,1.2,n.z,'#5ff5d6',10,2,.28)}SFX.ok()}},
  nova:{n:'Chrono Nova',el:'ember',t:1,cost:22,cd:6,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 1 2.5 7.5L22 6l-4.5 6.5L22 18l-7.5-2.5L12 23l-2.5-7.5L2 18l4.5-5.5L2 6l7.5 2.5z"/></svg>',d:'A burst of time in every direction. Damages and shoves away nearby foes.',
    cast(p){ringFx(ch.x,ch.z,4.8,'#ff7a3a',.45);burst(ch.x,1.2,ch.z,'#ff7a3a',40,6,.4);shk=Math.max(shk,.45);for(const n of foesIn(ch.x,ch.z,4.8))hitFoe(n,26*p,ch.x,ch.z);SFX.hit()}},
  haste:{n:'Fast Forward',el:'storm',t:1,cost:18,cd:14,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5l8 7-8 7zM12 5l8 7-8 7z"/></svg>',d:'You skip ahead of the clock: +60% speed and 40% faster attacks for 6 s.',
    cast(p){MAGIC.haste=6*p;ringFx(ch.x,ch.z,2,'#ffe45a',.5);burst(ch.x,1.2,ch.z,'#ffe45a',24,4,.3);SFX.ok()}},
  arc:{n:'Paradox Arc',el:'storm',t:2,cost:22,cd:3,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3l9 8-5 1 9 9M14 3h6v6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',d:'Lightning leaps between up to four foes. Hits for 22 each.',
    cast(p){aim(11);let px=ch.x,pz=ch.z;const used=new Set();
      for(let i=0;i<4;i++){let best=null,bd=11;for(const n of WD.npcs){if(!isFoe(n)||used.has(n))continue;const d=Math.hypot(n.x-px,n.z-pz);if(d<bd){bd=d;best=n}}
        if(!best)break;used.add(best);boltFx(px,pz,best.x,best.z,'#ffe45a');hitFoe(best,22*p,px,pz);px=best.x;pz=best.z}
      if(!used.size)boltFx(ch.x,ch.z,ch.x+ch.fx*7,ch.z+ch.fz*7,'#ffe45a');SFX.shot()}},
  stasis:{n:'Stasis Field',el:'future',t:2,cost:30,cd:12,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8 3l4 3 4-3M8 21l4-3 4 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',d:'Time stops around you. Every foe nearby is frozen for 3 s (the Time Lord is immune).',
    cast(p){ringFx(ch.x,ch.z,7.5,'#5ff5d6',.7);for(const n of foesIn(ch.x,ch.z,7.5)){if(n.kind==='lord'){floatText(n.x,3,n.z,'IMMUNE','#5ff5d6');continue}n.frozen=3*p;n.wind=0;n.swind=0;n.lunge=0;n.retreat=0;burst(n.x,1.3,n.z,'#5ff5d6',14,3,.3)}shk=Math.max(shk,.3);SFX.ok()}},
  well:{n:'Gravity Well',el:'void',t:2,cost:28,cd:10,g:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.5"/><path d="M12 2a10 10 0 1 0 10 10M12 6a6 6 0 1 0 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',d:'A pocket of collapsed time drags foes in and crushes them for 2.6 s.',
    cast(p){aim(9);const x=ch.x+ch.fx*6,z=clamp(ch.z+ch.fz*6,ZMIN,ZMAX);const m=new THREE.Mesh(SPH(),glow('#b44aff',3));m.scale.setScalar(.8);m.position.set(x,1.2,z);scene.add(m);
      MAGIC.wells.push({x,z,t:2.6*p,tick:0,m,p});ringFx(x,z,6,'#b44aff',.6);SFX.ok()}},
  meteor:{n:'Chrono Meteors',el:'ember',t:2,cost:32,cd:9,g:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="16" cy="16" r="5"/><path d="M12 12 2 2M11 17 3 13M17 11 13 3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',d:'Three burning minutes fall from the sky onto your target. 30 damage each.',
    cast(p){const t=aim(12),bx=t?t.x:ch.x+ch.fx*7,bz=t?t.z:ch.z+ch.fz*7;
      for(let i=0;i<3;i++){const x=bx+(i?(Math.random()-.5)*4:0),z=clamp(bz+(i?(Math.random()-.5)*3:0),ZMIN,ZMAX),d=.25+i*.4;
        const mk=new THREE.Mesh(geo('mring',()=>new THREE.RingGeometry(.88,1,56)),addMat('#ff7a3a',.7));mk.rotation.x=-Math.PI/2;mk.position.set(x,.09,z);mk.scale.setScalar(2.2);mfx(mk,d+.45,k=>{mk.material.opacity=.7*(1-k)});
        const ball=new THREE.Mesh(SPH(),glow('#ff7a3a',5));ball.scale.setScalar(.9);ball.position.set(x,14,z);scene.add(ball);
        MAGIC.proj.push({meteor:true,x,z,y:14,t:0,d,m:ball,dmg:30*p,life:d+.3,hit:new Set()})}
      SFX.ok()}},
  blades:{n:'Phantom Blades',el:'echo',t:2,cost:26,cd:12,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 20 18 4l1 3-9 14zM19 20 6 4 5 7l9 14z"/></svg>',d:'Three spectral blades orbit you for 6 s and cut anything they touch.',
    cast(p){clearBlades();const g=new THREE.Group();for(let i=0;i<3;i++){const b=box(glow('#7ad0ff',4),0,0,0,.16,.16,1.1,false);b.userData.a=i/3*Math.PI*2;g.add(b)}scene.add(g);
      MAGIC.blades={g,t:6*p,p,cd:new Map()};ringFx(ch.x,ch.z,2.2,'#7ad0ff',.5);SFX.ok()}},
  drain:{n:'Entropy Touch',el:'void',t:2,cost:20,cd:4,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 4a9 9 0 1 0 0 16 7 7 0 0 1 0-16z"/></svg>',d:'A cone of decay in front of you. Hurts foes and heals you for 40% of the damage.',
    cast(p){aim(5);const ang=Math.atan2(ch.fx,ch.fz);slash(ch.x+ch.fx*.8,ch.z+ch.fz*.8,ang,'#b44aff',3.4);let tot=0;
      for(const n of WD.npcs){if(!isFoe(n))continue;const dx=n.x-ch.x,dz=n.z-ch.z,d=Math.hypot(dx,dz);if(d>4.4||(d>.4&&(dx*ch.fx+dz*ch.fz)/d<.2))continue;tot+=Math.round(20*p);hitFoe(n,20*p,ch.x,ch.z)}
      if(tot){const h=Math.round(tot*.4);ch.hp=Math.min(ch.maxHp,ch.hp+h);floatText(ch.x,2.6,ch.z,'+'+h,'#86e09a')}SFX.swing()}},
  veil:{n:'Veil of Ages',el:'echo',t:2,cost:26,cd:15,g:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 10-1 4.5 4.5 0 0 1 0 9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',d:'History forgets your crimes. Lowers heat by 40.',
    cast(p){G.heat=Math.max(0,G.heat-40*p);ringFx(ch.x,ch.z,3.5,'#7ad0ff',.8);burst(ch.x,1.5,ch.z,'#7ad0ff',30,2.5,.4);toast('The timeline loses track of you. Heat lowered.');SFX.ok()}},
  wrath:{n:"Time Lord's Wrath",el:'storm',t:3,cost:60,cd:20,g:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.5 4.5l3 3M16.5 16.5l3 3M4.5 19.5l3-3M16.5 7.5l3-3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',d:'The Time Lord\'s own power. Everything hostile nearby takes 60 damage.',
    cast(p){ringFx(ch.x,ch.z,15,'#ffe45a',.9);ringFx(ch.x,ch.z,10,'#ffffff',.7);GU.uFlash.value=.4;shk=Math.max(shk,1);burst(ch.x,1.5,ch.z,'#ffe45a',60,8,.5);
      for(const n of foesIn(ch.x,ch.z,15)){boltFx(ch.x,ch.z,n.x,n.z,'#ffe45a');hitFoe(n,60*p,ch.x,ch.z)}SFX.hit()}}
};
/* ---- casting ---- */
function castSpell(i){
  if(!G||busy()||ch.hp<=0)return;const id=G.slots[i];
  if(!id){hint('empty'+i,`The ${i?'E':'Q'} slot is empty. Open the bag (I) to equip a spell.`);return}
  const S=SPELLS[id];if(MAGIC.cd[i]>0)return;
  if(ch.mana<S.cost){if(T>MAGIC.warnT){MAGIC.warnT=T+1.2;toast('Not enough mana. Refill at the fountain in the Nexus.',true);SFX.bad()}return}
  ch.mana-=S.cost;MAGIC.cd[i]=MAGIC.cdMax[i]=S.cd*(MAGIC.haste>0?.7:1);ch.swing=.18;S.cast(pw(id));
}
function clearBlades(){if(MAGIC.blades){scene.remove(MAGIC.blades.g);MAGIC.blades=null}}
function clearMagic(){
  for(const p of MAGIC.proj)scene.remove(p.m);for(const f of MAGIC.fx){scene.remove(f.m);f.m.material&&f.m.material.dispose();f.m.userData.geo&&f.m.geometry.dispose()}
  for(const w of MAGIC.wells)scene.remove(w.m);clearBlades();if(MAGIC.ward&&MAGIC.ward.m)scene.remove(MAGIC.ward.m);
  MAGIC.proj=[];MAGIC.fx=[];MAGIC.tm=[];MAGIC.wells=[];MAGIC.ward=null;MAGIC.haste=0;MAGIC.cd=[0,0];
}
function updateMagic(dt){
  if(!G||!WD)return;
  for(let i=0;i<2;i++)if(MAGIC.cd[i]>0)MAGIC.cd[i]-=dt;
  if(MAGIC.haste>0){MAGIC.haste-=dt;if(ch.moving&&Math.random()<.5)burst(ch.x,.8,ch.z,'#ffe45a',1,.5,.3,0,0)}
  // projectiles + meteors
  for(const p of MAGIC.proj){
    if(p.meteor){p.t+=dt;const k=Math.min(1,p.t/p.d);p.m.position.y=14-13*k*k;p.life-=dt;if(!p.done)burst(p.x,p.m.position.y,p.z,'#ff7a3a',1,.5,.4,0,0);
      if(!p.done&&p.t>=p.d){p.done=true;scene.remove(p.m);burst(p.x,1,p.z,'#ff7a3a',50,7,.5);burst(p.x,1,p.z,'#ffe0a0',20,4,.35);ringFx(p.x,p.z,2.6,'#ff7a3a',.4);shk=Math.max(shk,.5);SFX.hit();for(const n of foesIn(p.x,p.z,2.5))hitFoe(n,p.dmg,p.x,p.z)}continue}
    p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.m.position.set(p.x,p.y,p.z);if(Math.random()<.8)burst(p.x,p.y,p.z,p.c,1,.4,.22,0,0);
    for(const n of WD.npcs){if(!isFoe(n)||p.hit.has(n))continue;if(Math.hypot(n.x-p.x,n.z-p.z)<.85+(n.kind==='lord'?.8:0)){p.hit.add(n);hitFoe(n,p.dmg,p.x-p.vx,p.z-p.vz);burst(p.x,p.y,p.z,p.c,16,4,.3);if(!p.pierce){p.life=0;break}}}
    if(p.life<=0)scene.remove(p.m)}
  MAGIC.proj=MAGIC.proj.filter(p=>p.life>0);
  // effects
  for(const f of MAGIC.fx){f.life-=dt;const k=1-Math.max(0,f.life/f.max);f.upd(k);if(f.life<=0){scene.remove(f.m);f.m.material&&f.m.material.dispose();f.m.userData.geo&&f.m.geometry.dispose()}}
  MAGIC.fx=MAGIC.fx.filter(f=>f.life>0);
  for(const t of MAGIC.tm)t.t-=dt;for(const t of MAGIC.tm)if(t.t<=0)t.fn();MAGIC.tm=MAGIC.tm.filter(t=>t.t>0);
  // gravity wells
  for(const w of MAGIC.wells){w.t-=dt;w.tick-=dt;w.m.scale.setScalar(.7+Math.sin(T*10)*.12);w.m.rotation.y+=dt*4;if(Math.random()<.6)burst(w.x+(Math.random()-.5)*5,.5+Math.random()*2,w.z+(Math.random()-.5)*5,'#b44aff',1,-1,.25,0,0);
    for(const n of foesIn(w.x,w.z,6)){if(n.kind==='lord')continue;const dx=w.x-n.x,dz=w.z-n.z,d=Math.hypot(dx,dz)||1;if(d>.5){n.x+=dx/d*4.5*dt;n.z=clamp(n.z+dz/d*4.5*dt,ZMIN,ZMAX)}}
    if(w.tick<=0){w.tick=.5;for(const n of foesIn(w.x,w.z,2.6))hitFoe(n,9*w.p,w.x,w.z)}
    if(w.t<=0){scene.remove(w.m);burst(w.x,1.2,w.z,'#b44aff',40,5,.4);ringFx(w.x,w.z,3,'#b44aff',.4)}}
  MAGIC.wells=MAGIC.wells.filter(w=>w.t>0);
  // phantom blades
  const B=MAGIC.blades;if(B){B.t-=dt;B.g.position.set(ch.x,1.2,ch.z);
    B.g.children.forEach(b=>{b.userData.a+=dt*6;const a=b.userData.a;b.position.set(Math.cos(a)*1.9,0,Math.sin(a)*1.9);b.rotation.y=-a;
      const bx=ch.x+Math.cos(a)*1.9,bz=ch.z+Math.sin(a)*1.9;for(const n of foesIn(bx,bz,.8)){if((B.cd.get(n)||0)>T)continue;B.cd.set(n,T+.45);hitFoe(n,12*B.p,ch.x,ch.z)}});
    if(B.t<=0){burst(ch.x,1.2,ch.z,'#7ad0ff',24,3,.3);clearBlades()}}
  // ward bubble
  const W_=MAGIC.ward;if(W_){W_.t-=dt;if(!W_.m){W_.m=new THREE.Mesh(SPH(),new THREE.MeshBasicMaterial({color:'#7ad0ff',transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));W_.m.scale.setScalar(2.6);scene.add(W_.m)}
    W_.m.position.set(ch.x,1.1,ch.z);W_.m.material.opacity=.14+Math.sin(T*14)*.06;if(W_.t<=0){scene.remove(W_.m);W_.m.material.dispose();MAGIC.ward=null}}
  // frozen foes and seed sparkles
  MAGIC.sparkT-=dt;if(MAGIC.sparkT<=0){MAGIC.sparkT=.3;
    for(const n of WD.npcs)if(n.frozen>0)burst(n.x,1.4,n.z,'#bff8ff',3,1.5,.25,1,2);
    for(const it of WD.items)if(it.kind==='mseed'&&Math.abs(it.x-ch.x)<18)burst(it.x,1.2,it.z,ELEM[it.el].c,2,1.2,.26,1.5,2);
    if(WD.fountain)burst(WD.fountain.x+(Math.random()-.5)*.8,2.2,ZMIN+.2,'#5ff5d6',3,1.6,.3,3,5)}
}
/* ---- hidden seeds ---- */
function dropSeed(el,x,z,key){
  const c=ELEM[el].c,g=new THREE.Group();g.position.set(x,0,z);const m=new THREE.Group();
  m.add(mesh(SPH(),glow(c,3.5),0,0,0,.34,.34,.34,false));m.add(new THREE.Mesh(TOR(.3,.025),glow(c,2.5)));m.position.y=1;g.add(m);
  const ring=new THREE.Mesh(geo('iring',()=>new THREE.RingGeometry(.5,.62,32)),addMat(c,.35));ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);
  WD.group.add(g);WD.items.push({kind:'mseed',el,key,x,z,g,m,t:Math.random()*6});
}
function placeSeeds(){
  if(!G||WD.year===NX||WD.year===TH)return;
  const rr=rng(G.seed*7+WD.year*13+5);
  for(let i=0;i<2;i++){const side=rr()<.5?-1:1,x=WD.mx+side*(55+rr()*75),z=rr()<.5?ZMIN+.2:ZMAX-.6,el=ELKEYS[rr()*ELKEYS.length|0],key=WD.year+'_'+i;if(G.seedGot[key])continue;dropSeed(el,x,z,key)}
}
function pickSeed(it){G.seeds[it.el]++;G.seedGot[it.key]=true;removeItem(it);SFX.ok();burst(ch.x,1.5,ch.z,ELEM[it.el].c,40,5,.4);ringFx(ch.x,ch.z,2.4,ELEM[it.el].c,.6);
  toast(`${ELEM[it.el].n} seed found! Mix seeds at the Spell Forge in the Nexus bazaar.`)}
/* ---- fountain (Nexus) ---- */
function buildFountain(g,x){
  const fg=new THREE.Group();fg.position.set(x,0,ZMIN+.2);const st=mat('#8a8fa8',{metalness:.5,roughness:.4});
  fg.add(cyl(st,0,.3,0,1.7,.6));fg.add(cyl(glow('#5ff5d6',1.2),0,.62,0,1.45,.06,false));fg.add(cyl(st,0,1.25,0,.28,1.4));
  const orb=mesh(SPH(),glow('#5ff5d6',3.2),0,2.2,0,.55,.55,.55,false);fg.add(orb);
  const rg=new THREE.Mesh(TOR(1.7,.07),glow('#c9a24a',1.4));rg.rotation.x=Math.PI/2;rg.position.y=.62;fg.add(rg);
  fg.traverse(o=>{if(o.isMesh)o.castShadow=true});g.add(fg);WD.anim.push(t=>{orb.scale.setScalar(.55+Math.sin(t*3)*.07);orb.position.y=2.2+Math.sin(t*2)*.08});
  return{x,g:fg};
}
function drinkFountain(){
  if(ch.mana>=ch.maxMana-.5){toast('Your mana is already full.');return}
  ch.mana=ch.maxMana;SFX.ok();ringFx(ch.x,ch.z,3,'#5ff5d6',.7);burst(ch.x,1.5,ch.z,'#5ff5d6',40,4,.4);toast('The fountain restores your mana.');
}
/* ---- HUD ---- */
function updateMagicHUD(){
  $('mpBar').style.width=(100*clamp(ch.mana/ch.maxMana,0,1))+'%';$('mpTxt').textContent=Math.floor(ch.mana)+' / '+ch.maxMana;
  for(let i=0;i<2;i++){const id=G.slots[i],b=$('sp'+i),S=id&&SPELLS[id];
    b.classList.toggle('empty',!S);b.style.setProperty('--sc',S?ELEM[S.el].c:'#6e5320');
    const g=b.querySelector('.sg');if(g.dataset.id!==(id||'')){g.dataset.id=id||'';g.innerHTML=S?S.g:'·';b.querySelector('.sc').textContent=S?S.cost:'';b.title=S?`${S.n} · ${S.cost} mana`:'Empty slot'}
    b.classList.toggle('nomp',!!S&&ch.mana<S.cost);
    b.querySelector('.cdo').style.transform=`scaleY(${MAGIC.cd[i]>0?clamp(MAGIC.cd[i]/MAGIC.cdMax[i],0,1):0})`}
}
/* ---- spellbook (inside the inventory) ---- */
let spSel=null;
const lvPips=id=>'●'.repeat(G.spells[id])+'○'.repeat(3-G.spells[id]);
function spCell(id,attr){const S=SPELLS[id],c=ELEM[S.el].c;return`<button class="gs" ${attr} style="--rc:${c}"><span class="gg">${S.g}</span><small>${S.n}</small><small class="lv">${lvPips(id)}</small></button>`}
function renderSpells(){
  const el=$('spBook');if(!el||!G)return;
  $('spSeeds').innerHTML=ELKEYS.filter(k=>G.seeds[k]>0).map(k=>`<span style="color:${ELEM[k].c}">${ELEM[k].n} ×${G.seeds[k]}</span>`).join(' · ')||'no seeds yet';
  $('spSlots').innerHTML=[0,1].map(i=>{const id=G.slots[i];return id?`<div class="slotwrap"><span class="kb">${i?'E':'Q'}</span>${spCell(id,`data-slot="${i}"`)}</div>`
    :`<div class="slotwrap"><span class="kb">${i?'E':'Q'}</span><button class="gs empty" data-slot="${i}" disabled><span class="gg">·</span><small>empty</small></button></div>`}).join('');
  const known=Object.keys(G.spells);
  $('spList').innerHTML=known.map(id=>spCell(id,`data-sp="${id}"`)).join('');
  $('spList').querySelectorAll('.gs').forEach(b=>b.classList.toggle('sel',b.dataset.sp===spSel));
  const d=$('spDetail');
  if(!spSel||!G.spells[spSel]){d.innerHTML='<p class="hint">Pick a spell to equip it on Q or E. Click an equipped spell to unequip it. Hidden seeds are scattered across the eras; mix them at the Nexus.</p>'}
  else{const S=SPELLS[spSel],p=pw(spSel);d.innerHTML=`<h3 style="color:${ELEM[S.el].c}">${S.n}</h3><div class="sub">${ELEM[S.el].n} · level ${G.spells[spSel]}/3 · ${S.cost} mana · ${S.cd}s cooldown${p>1?` · +${Math.round((p-1)*100)}% power`:''}</div><p style="margin:4px 0 0;font-size:13.5px">${S.d}</p>
    <div class="acts"><button class="btn sm" id="eqQ">EQUIP ON Q</button><button class="btn sm" id="eqE">EQUIP ON E</button></div>`;
    $('eqQ').onclick=()=>eqSpell(0);$('eqE').onclick=()=>eqSpell(1)}
}
function eqSpell(i){const id=spSel;if(!id)return;const o=1-i;if(G.slots[o]===id)G.slots[o]=G.slots[i];G.slots[i]=id;SFX.click();renderSpells()}
function initMagicUI(){
  $('spBook').addEventListener('click',e=>{const b=e.target.closest('.gs');if(!b||b.disabled)return;
    if(b.dataset.slot!=null){G.slots[+b.dataset.slot]=null;SFX.click()}else if(b.dataset.sp){spSel=b.dataset.sp;SFX.click()}renderSpells()});
  $('forge').addEventListener('click',e=>{const s=e.target.closest('.seed');if(s){const k=s.dataset.el;const used=MAGIC.forge.filter(x=>x===k).length;if(MAGIC.forge.length<2&&G.seeds[k]-used>0){MAGIC.forge.push(k);MAGIC.forgeMsg='';SFX.click()}renderForge();return}
    const sl=e.target.closest('.fslot');if(sl&&sl.dataset.i!=null){MAGIC.forge.splice(+sl.dataset.i,1);renderForge();return}
    if(e.target.closest('#mix'))fuse()});
}
/* ---- spell forge (Nexus bazaar) ---- */
const forgeCost=()=>40+10*Math.min(8,G.fusions);
function renderForge(){
  const f=$('forge');if(!f||!G)return;const cost=forgeCost(),n=MAGIC.forge.length;
  f.innerHTML=`<p class="hint" style="margin:0 0 8px">Put two seeds in the forge for ${cost} coins and get a random spell. Seeds of the same element make that element's spells likelier. A spell you already know levels up instead.</p>
  <div class="seedrow">${ELKEYS.map(k=>{const left=G.seeds[k]-MAGIC.forge.filter(x=>x===k).length;return`<button class="seed" data-el="${k}" style="--c:${ELEM[k].c}" ${left>0&&n<2?'':'disabled'}><i></i>${ELEM[k].n} <b>×${left}</b></button>`}).join('')}</div>
  <div class="forgeline"><div class="fslots">${[0,1].map(i=>MAGIC.forge[i]?`<button class="fslot" data-i="${i}" style="--c:${ELEM[MAGIC.forge[i]].c}">${ELEM[MAGIC.forge[i]].n}</button>`:`<span class="fslot empty">seed</span>`).join('<em>+</em>')}</div>
  <button class="buy" id="mix" ${n===2&&G.coins>=cost?'':'disabled'}><span class="coin"></span>${cost} MIX</button></div>
  <div class="forgeres" id="fgRes">${MAGIC.forgeMsg}</div>`;
}
function fuse(){
  if(MAGIC.forge.length<2)return;const cost=forgeCost();if(G.coins<cost)return;const[a,b]=MAGIC.forge;
  const pool=Object.keys(SPELLS).map(id=>{const S=SPELLS[id];if((G.spells[id]||0)>=3)return[id,0];let w=S.t===1?10:S.t===2?6:.7;w*=1+2*((S.el===a)+(S.el===b));return[id,w]});
  const tot=pool.reduce((s,p)=>s+p[1],0);if(tot<=0){MAGIC.forgeMsg='Every spell is at its maximum level.';renderForge();return}
  G.coins-=cost;G.seeds[a]--;G.seeds[b]--;G.fusions++;MAGIC.forge=[];
  let x=Math.random()*tot,id=pool[0][0];for(const[i,w]of pool){x-=w;if(x<0){id=i;break}}
  const was=G.spells[id]||0;G.spells[id]=was+1;const S=SPELLS[id],c=ELEM[S.el].c;
  if(!was&&!G.slots[0])G.slots[0]=id;
  MAGIC.forgeMsg=was?`<b style="color:${c}">${S.n}</b> grew stronger: level ${was+1}!`:`New spell: <b style="color:${c}">${S.n}</b>. ${S.d}`;
  SFX.ok();$('sCoins').textContent=G.coins;renderForge();
}

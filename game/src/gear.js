/* ================= gear, bag & inventory ================= */
const SLOTS=['weapon','armor','boots','trinket'];
const SLOT_N={weapon:'Weapon',armor:'Armor',boots:'Boots',trinket:'Trinket'};
const SLOT_G={weapon:'⚔',armor:'⛨',boots:'≫',trinket:'✦'};
const RAR=[{n:'Common',c:'#b8b2a6',m:1,w:58},{n:'Uncommon',c:'#6fd16f',m:1.35,w:28},{n:'Rare',c:'#4aa8ff',m:1.8,w:10},{n:'Epic',c:'#b44aff',m:2.4,w:3.2},{n:'Legendary',c:'#ffb020',m:3.2,w:.7}];
const PREFIX=[['Worn','Plain','Dusty'],['Fine','Tuned','Polished'],['Tempered','Phased','Resonant'],['Eternal','Paradox','Quantum'],['Primordial','Apex','Timeless']];
const BASES={weapon:['Brass Blade','Chrono Saber','Rift Cleaver','Phase Baton'],armor:['Dust Coat','Temporal Vest','Flux Plate','Era Cloak'],boots:['Walker Boots','Phase Treads','Echo Greaves'],trinket:['Pocket Watch','Gear Charm','Hourglass Shard','Signet of Ages']};
const STAT={
  dmg:['Attack',v=>'+'+v],hp:['Max HP',v=>'+'+v],armor:['Damage reduction',v=>'+'+Math.round(v*100)+'%'],spd:['Move speed',v=>'+'+Math.round(v*100)+'%'],
  dash:['Dash cooldown',v=>'-'+Math.round(v*100)+'%'],regen:['Regen',v=>'+'+v.toFixed(1)+'/s'],coin:['Coins found',v=>'+'+Math.round(v*100)+'%'],
  cool:['Heat cooling',v=>'+'+Math.round(v*100)+'%'],time:['Mission time',v=>'+'+v+'s']};
const BAG_MAX=16;
let invOpen=false,invSel=null,gearUid=1,bagSeen=0,fullT=0;
const gLv=()=>1+.22*Math.max(0,G.tier-2);
function statVal(k,m){const lv=gLv();switch(k){
  case'dmg':return Math.max(1,Math.round(3*m*lv));case'hp':return Math.round(9*m*lv);case'armor':return Math.round(.03*m*200)/200;
  case'spd':return Math.round(.02*m*200)/200;case'dash':return Math.round(.03*m*200)/200;case'regen':return Math.round(.7*m*10)/10;
  case'coin':return Math.round(.05*m*200)/200;case'cool':return Math.round(.07*m*200)/200;case'time':return Math.max(1,Math.round(2.5*m))}}
function rollRar(boost=0){const w=RAR.map((r,i)=>r.w*(i?1+boost:1)),t=w.reduce((a,b)=>a+b,0);let x=Math.random()*t,i=0;for(;i<w.length-1;i++){x-=w[i];if(x<0)break}return i}
function genGear(slot,rar){
  slot=slot||pick(Math.random,SLOTS);rar=rar==null?rollRar(Math.min(1.5,.25*Math.max(0,G.tier-2))):rar;const m=RAR[rar].m,mods={};
  if(slot==='weapon')mods.dmg=statVal('dmg',m);
  else if(slot==='armor'){mods.armor=statVal('armor',m);mods.hp=statVal('hp',m*.8)}
  else if(slot==='boots'){mods.spd=statVal('spd',m);mods.dash=statVal('dash',m*.8)}
  else{const k=pick(Math.random,['regen','coin','cool','time']);mods[k]=statVal(k,m)}
  const pool=Object.keys(STAT).filter(k=>!(k in mods));
  for(let i=0;i<Math.min(rar,3);i++){if(!pool.length)break;const k=pool.splice(Math.random()*pool.length|0,1)[0];mods[k]=statVal(k,m*.6)}
  return{id:gearUid++,slot,rar,lv:Math.round(gLv()*10)/10,name:pick(Math.random,PREFIX[rar])+' '+pick(Math.random,BASES[slot]),mods};
}
const gearValue=g=>Math.round(10*Math.pow(RAR[g.rar].m,1.6)*(1+Object.keys(g.mods).length*.3));
function gearSum(k){let s=0;for(const sl of SLOTS){const g=G.eq[sl];if(g&&g.mods[k])s+=g.mods[k]}return s}
function applyGear(){
  if(!G.eq)return;
  ch.maxHp+=gearSum('hp');ch.dmg+=gearSum('dmg');ch.spd+=gearSum('spd');ch.timeB+=gearSum('time');
  ch.dashK*=Math.max(.4,1-gearSum('dash'));ch.armor*=1-Math.min(.6,gearSum('armor'));ch.coinK+=gearSum('coin');ch.coolK+=gearSum('cool');ch.regen+=gearSum('regen');
}
/* ---- world drops ---- */
function dropGear(g,x,z){
  const c=RAR[g.rar].c,grp=new THREE.Group();grp.position.set(x,0,z);
  const gm=glow(c,1.6),dk=mat('#2a2230',{metalness:.7,roughness:.35}),m=new THREE.Group();
  if(g.slot==='weapon'){m.add(box(gm,0,.15,0,.12,.9,.05,false));m.add(box(dk,0,-.34,0,.34,.08,.1,false));m.add(box(dk,0,-.5,0,.1,.26,.1,false))}
  else if(g.slot==='armor'){m.add(box(dk,0,0,0,.62,.7,.28,false));m.add(box(gm,0,.05,.15,.34,.34,.03,false));m.add(box(dk,-.4,.22,0,.22,.2,.26,false));m.add(box(dk,.4,.22,0,.22,.2,.26,false))}
  else if(g.slot==='boots'){for(const s of[-.2,.2]){m.add(box(dk,s,-.1,0,.26,.3,.34,false));m.add(box(gm,s,-.28,.05,.28,.06,.4,false))}}
  else{m.add(new THREE.Mesh(TOR(.3,.06),gm));m.add(mesh(SPH(),glow(c,2.6),0,0,0,.22,.22,.22,false))}
  m.position.y=1;grp.add(m);
  const hh=8+g.rar*3,beam=new THREE.Mesh(geo('gb'+g.rar,()=>new THREE.CylinderGeometry(.2,.2,hh,12,1,true)),addMat(c,.16+g.rar*.03));beam.position.y=hh/2;grp.add(beam);
  const ring=new THREE.Mesh(geo('iring',()=>new THREE.RingGeometry(.5,.62,32)),addMat(c,.6));ring.rotation.x=-Math.PI/2;ring.position.y=.03;grp.add(ring);
  WD.group.add(grp);const it={kind:'gear',gear:g,x,z,g:grp,m,t:Math.random()*6};WD.items.push(it);return it;
}
function huntDrop(n){
  const ch_=n.elite?.7:.3;if(Math.random()>ch_)return;
  const g=genGear(null,n.elite?Math.max(1,rollRar(.8)):undefined);
  dropGear(g,n.x+(Math.random()-.5),clamp(n.z+(Math.random()-.5),ZMIN,ZMAX));burst(n.x,1.5,n.z,RAR[g.rar].c,24,4,.4);
}
function maybeWildGear(dt){
  if(!G||G.boss||mode!=='play'||WD.year===TH)return;
  WD.gearT=(WD.gearT??(30+Math.random()*30))-dt;if(WD.gearT>0)return;WD.gearT=55+Math.random()*50;
  if(Math.random()>.45||WD.items.filter(i=>i.kind==='gear').length>=2)return;
  const side=Math.random()<.5?-1:1;dropGear(genGear(),camX+side*(22+Math.random()*22),ZMIN+.6+Math.random()*(ZMAX-ZMIN-1.2));
}
function cullGear(){for(const it of [...WD.items])if(it.kind==='gear'&&Math.abs(it.x-camX)>140)removeItem(it)}
function pickGear(it){
  if(G.bag.length>=BAG_MAX){fullT-=0;if(T>fullT){fullT=T+3;toast('Your bag is full. Sell or drop something (I).',true)}return false}
  const g=it.gear;G.bag.push(g);removeItem(it);SFX.pick();burst(ch.x,1.5,ch.z,RAR[g.rar].c,24,3,.35);
  floatText(ch.x,2.6,ch.z,g.name,RAR[g.rar].c);toast(`${RAR[g.rar].n} ${SLOT_N[g.slot].toLowerCase()}: ${g.name} (press I)`);if(g.rar>=3)SFX.ok();updateBagBadge();return true;
}
function updateBagBadge(){const b=$('bagN');if(!b||!G)return;const n=G.bag.length-bagSeen;b.textContent=n>0?n:'';b.hidden=n<=0}
/* ---- inventory UI ---- */
function openInv(){invOpen=true;invSel=null;bagSeen=G.bag.length;updateBagBadge();$('inv').hidden=false;keys.clear();renderInv()}
function closeInv(){invOpen=false;$('inv').hidden=true}
const modLines=(g,cmp)=>Object.entries(g.mods).map(([k,v])=>{let d='';if(cmp){const o=cmp.mods[k]||0,df=v-o;if(Math.abs(df)>1e-6)d=` <i class="${df>0?'up':'dn'}">${df>0?'▲':'▼'}</i>`}return`<div class="ml"><span>${STAT[k][0]}</span><b>${STAT[k][1](v)}${d}</b></div>`}).join('');
function slotCell(g,attr,label){
  return g?`<button class="gc" ${attr} style="--rc:${RAR[g.rar].c}"><span class="gg">${SLOT_G[g.slot]}</span><small>${g.name}</small></button>`
    :`<button class="gc empty" ${attr} disabled><span class="gg">${SLOT_G[label]||''}</span><small>${label?SLOT_N[label]:''}</small></button>`}
function renderInv(){
  const sel=invSel&&(invSel.from==='bag'?G.bag[invSel.i]:G.eq[invSel.slot]);if(!sel)invSel=null;
  $('invEq').innerHTML=SLOTS.map(s=>slotCell(G.eq[s],G.eq[s]?`data-eq="${s}"`:'',s)).join('');
  $('invBag').innerHTML=Array.from({length:BAG_MAX},(_,i)=>G.bag[i]?slotCell(G.bag[i],`data-bag="${i}"`):`<button class="gc empty" disabled></button>`).join('');
  $('invBagN').textContent=`${G.bag.length}/${BAG_MAX}`;
  document.querySelectorAll('#inv .gc').forEach(b=>{const on=invSel&&((invSel.from==='bag'&&b.dataset.bag==invSel.i)||(invSel.from==='eq'&&b.dataset.eq===invSel.slot));b.classList.toggle('sel',!!on)});
  const d=$('invDetail');
  if(!sel){d.innerHTML='<p class="hint">Select an item. Gear drops from Time Hunters and turns up now and then in the eras.</p>'}
  else{const cmp=invSel.from==='bag'?G.eq[sel.slot]:null,r=RAR[sel.rar];
    d.innerHTML=`<h3 style="color:${r.c}">${sel.name}</h3><div class="sub">${r.n} ${SLOT_N[sel.slot]} · lvl ${sel.lv}</div>${modLines(sel,cmp)}
    ${cmp?`<div class="sub" style="margin-top:6px">Compared with equipped: ${cmp.name}</div>`:''}
    <div class="acts">${invSel.from==='bag'?`<button class="btn sm" id="iEq">EQUIP</button><button class="btn ghost sm" id="iSell">SELL <span class="coin"></span>${gearValue(sel)}</button>`:`<button class="btn ghost sm" id="iUn" ${G.bag.length>=BAG_MAX?'disabled':''}>UNEQUIP</button>`}</div>`;
    if($('iEq'))$('iEq').onclick=equipSel;if($('iSell'))$('iSell').onclick=sellSel;if($('iUn'))$('iUn').onclick=unequipSel}
  const base=60/60;const rel=relicCount();
  const rows=[['Max HP',Math.round(ch.maxHp)],['Attack',ch.dmg],['Move speed','x'+ch.spd.toFixed(2)],['Dash cooldown',(.9*ch.dashK).toFixed(2)+'s'],['Damage reduction',Math.round((1-ch.armor)*100)+'%'],['Regen',ch.regen.toFixed(1)+'/s'],['Coins found','+'+Math.round((ch.coinK-1)*100)+'%'],['Heat cooling','x'+ch.coolK.toFixed(2)],['Mission time','+'+Math.round(ch.timeB)+'s'],['Relics',rel+'/14'],['Coins',G.coins]];
  $('invStats').innerHTML=rows.map(([a,b])=>`<div class="ml"><span>${a}</span><b>${b}</b></div>`).join('');
}
function equipSel(){const g=G.bag[invSel.i];if(!g)return;const old=G.eq[g.slot];G.bag.splice(invSel.i,1);G.eq[g.slot]=g;if(old)G.bag.push(old);invSel={from:'eq',slot:g.slot};SFX.click();stats();refreshGearVisual();renderInv()}
function unequipSel(){const g=G.eq[invSel.slot];if(!g||G.bag.length>=BAG_MAX)return;G.eq[invSel.slot]=null;G.bag.push(g);invSel={from:'bag',i:G.bag.length-1};SFX.click();stats();refreshGearVisual();renderInv()}
function sellSel(){const g=G.bag[invSel.i];if(!g)return;G.coins+=gearValue(g);G.bag.splice(invSel.i,1);invSel=null;SFX.coin();renderInv()}
function initInv(){
  $('inv').addEventListener('click',e=>{const b=e.target.closest('.gc');if(b&&!b.disabled){invSel=b.dataset.bag!=null?{from:'bag',i:+b.dataset.bag}:{from:'eq',slot:b.dataset.eq};SFX.click();renderInv()}});
  $('iClose').onclick=closeInv;$('iX').onclick=closeInv;$('inv').addEventListener('click',e=>{if(e.target.id==='inv')closeInv()});$('bag').onclick=()=>{if(!G||mode!=='play')return;if(invOpen)closeInv();else if(!busy())openInv()};
}
/* ---- gear visible on the character ---- */
function refreshGearVisual(){
  const R=ch.rig;if(!R||!G||!G.eq)return;
  (ch.gearObjs||[]).forEach(o=>o.parent&&o.parent.remove(o));ch.gearObjs=[];
  const add=(par,o)=>{par.add(o);o.traverse(x=>{if(x.isMesh)x.castShadow=true});ch.gearObjs.push(o)};
  const dk=mat('#241c2c',{metalness:.7,roughness:.35});
  const met=g=>{const c=RAR[g.rar].c;return mat(c,{metalness:.85,roughness:.28,emissive:c,emissiveIntensity:.12+.16*g.rar})};
  const gl=g=>glow(RAR[g.rar].c,1.2+.8*g.rar);
  const w=G.eq.weapon;
  if(w){const s=1+.1*w.rar,gr=new THREE.Group();gr.add(box(gl(w),0,-1.28*s,.02,.07*s,.95*s,.035,false));gr.add(box(met(w),0,-.84,.02,.3,.05,.09,false));gr.add(box(dk,0,-.76,.02,.06,.16,.06,false));
    if(w.rar>=3)gr.add(box(gl(w),0,-1.28*s,.02,.13*s,1.0*s,.02,false));add(R.arms[1],gr)}
  const a=G.eq.armor;
  if(a){const m=met(a);for(let i=0;i<2;i++)add(R.arms[i],box(m,0,.0,0,.27,.15,.3,false));
    const ch_=new THREE.Group();ch_.add(box(dk,0,.46,.19,.52,.56,.05,false));ch_.add(box(m,0,.46,.225,.12,.5,.02,false));ch_.add(box(m,0,.72,.19,.54,.07,.06,false));add(R.torso,ch_);
    if(a.rar>=3)add(R.torso,box(gl(a),0,.3,.23,.4,.03,.02,false))}
  const b=G.eq.boots;
  if(b){const m=met(b);for(let i=0;i<2;i++){const g2=new THREE.Group();g2.add(box(m,0,-.78,.05,.27,.3,.38,false));g2.add(box(gl(b),0,-.94,.05,.29,.04,.4,false));add(R.legs[i],g2)}}
  const t=G.eq.trinket;
  if(t){const g3=new THREE.Group(),c=RAR[t.rar].c;const ring=new THREE.Mesh(TOR(.1,.02),met(t));ring.position.set(0,.66,.2);g3.add(ring);g3.add(mesh(SPH(),glow(c,2.2+t.rar),0,.66,.2,.1,.1,.1,false));
    if(t.rar>=3){const o=new THREE.Mesh(TOR(.14,.012),glow(c,2));o.position.set(0,.66,.2);o.rotation.x=Math.PI/2.4;g3.add(o)}add(R.torso,g3)}
}

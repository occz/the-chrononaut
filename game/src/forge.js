/* ================= forges, wild finds & imbued gear ================= */
const FORGE_COST={gear:60,spell:60,imbue:80},FORGE_FAIL={gear:.25,spell:.25,imbue:.30};
let FJ={g:[],s:[],ig:null,is:null,msg:{gear:'',spell:'',imbue:''}},wildUid=1;
/* ---- extra random finds in the eras ---- */
function dropScroll(id,x,z){
  const S=SPELLS[id],c=ELEM[S.el].c,g=new THREE.Group();g.position.set(x,0,z);const m=new THREE.Group();
  m.add(box(mat('#e8d9b0',{roughness:.8}),0,0,0,.5,.7,.06,false));m.add(box(glow(c,2.2),0,0,.04,.32,.04,.02,false));m.add(box(glow(c,2.2),0,.16,.04,.32,.04,.02,false));m.add(box(glow(c,2.2),0,-.16,.04,.32,.04,.02,false));
  m.add(cyl(mat('#7a5a2a'),0,.38,0,.07,.58,false));m.children[m.children.length-1].rotation.z=Math.PI/2;
  m.position.y=1;g.add(m);
  const hh=7,beam=new THREE.Mesh(geo('gb_sc',()=>new THREE.CylinderGeometry(.16,.16,hh,12,1,true)),addMat(c,.2));beam.position.y=hh/2;g.add(beam);
  const ring=new THREE.Mesh(geo('iring',()=>new THREE.RingGeometry(.5,.62,32)),addMat(c,.5));ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);
  WD.group.add(g);WD.items.push({kind:'scroll',sp:id,x,z,g,m,t:Math.random()*6});
}
function pickScroll(it){
  const id=it.sp,S=SPELLS[id],c=ELEM[S.el].c;removeItem(it);SFX.ok();burst(ch.x,1.5,ch.z,c,40,5,.4);ringFx(ch.x,ch.z,2.4,c,.6);
  const was=G.spells[id]||0;
  if(was>=3){G.coins+=40;toast(`Scroll of ${S.n}: you already master it. +40 coins.`);return}
  G.spells[id]=was+1;if(!was&&!G.slots[0])G.slots[0]=id;else if(!was&&!G.slots[1])G.slots[1]=id;
  toast(was?`Scroll of ${S.n}: spell level ${was+1}!`:`Scroll found! You learned ${S.n} (press I).`);
}
function rollSpellId(){
  const ids=Object.keys(SPELLS),w=ids.map(id=>{const S=SPELLS[id];return S.t===1?10:S.t===2?6:.7}),t=w.reduce((a,b)=>a+b,0);let x=Math.random()*t;
  for(let i=0;i<ids.length;i++){x-=w[i];if(x<0)return ids[i]}return ids[0];
}
function wildSpot(){const side=Math.random()<.5?-1:1;return[camX+side*(20+Math.random()*24),ZMIN+.6+Math.random()*(ZMAX-ZMIN-1.2)]}
function dropWildMagic(x,z){
  if(Math.random()<.6)dropSeed(pick(Math.random,ELKEYS),x,z,'w'+(wildUid++));else dropScroll(rollSpellId(),x,z);
}
function maybeWildMagic(dt){
  if(!G||G.boss||mode!=='play'||WD.year===TH||WD.year===NX)return;
  WD.magT=(WD.magT??(20+Math.random()*25))-dt;if(WD.magT>0)return;WD.magT=40+Math.random()*40;
  if(Math.random()>.7||WD.items.filter(i=>i.kind==='scroll'||(i.kind==='mseed'&&i.key[0]==='w')).length>=3)return;
  const[x,z]=wildSpot();dropWildMagic(x,z);
}
function huntBonus(n){if(Math.random()<.32)dropWildMagic(n.x+(Math.random()-.5)*1.6,clamp(n.z+(Math.random()-.5)*1.4,ZMIN,ZMAX))}
/* ---- imbued gear: free spell casts while fighting ---- */
const imbChance=g=>g.slot==='weapon'?.28:.12;
function imbueProc(){
  if(!G||!G.eq||T<(MAGIC.imbT||0))return;
  for(const sl of SLOTS){const g=G.eq[sl];if(!g||!g.imb||!SPELLS[g.imb.id])continue;
    if(Math.random()<imbChance(g)){MAGIC.imbT=T+1.1;const S=SPELLS[g.imb.id];floatText(ch.x,3,ch.z,S.n,ELEM[S.el].c);S.cast(1+.3*(g.imb.lv-1));return}}
}
/* ---- forge helpers ---- */
function dropSpell(id){delete G.spells[id];for(let i=0;i<2;i++)if(G.slots[i]===id)G.slots[i]=null;if(!Object.keys(G.spells).length){G.spells.bolt=1;G.slots[1]=G.slots[1]||'bolt';return true}return false}
function forgeFx(ok){if(ok){SFX.ok();shk=Math.max(shk,.15)}else{SFX.bad();shk=Math.max(shk,.35)}}
const bagGear=id=>G.bag.find(g=>g.id===id);
function gearGrid(sel,attr){return G.bag.length?G.bag.map(g=>slotCell(g,`${attr}="${g.id}"`).replace('class="gc"',`class="gc${sel.includes(g.id)?' sel':''}"`)).join(''):'<span class="hint">Your bag is empty. Gear drops from Hunters and turns up in the eras.</span>'}
function spellGrid(sel,attr){return Object.keys(G.spells).map(id=>spCell(id,`${attr}="${id}"`).replace('class="gs"',`class="gs${sel.includes(id)?' sel':''}"`)).join('')}
const failTxt=k=>`<span class="warn">${Math.round(FORGE_FAIL[k]*100)}% chance to fail and lose both</span>`;
function renderForges(){
  const el=$('forges');if(!el||!G)return;
  FJ.g=FJ.g.filter(bagGear);FJ.s=FJ.s.filter(id=>G.spells[id]);if(FJ.ig&&!bagGear(FJ.ig))FJ.ig=null;if(FJ.is&&!G.spells[FJ.is])FJ.is=null;
  const nm=id=>`<b style="color:${ELEM[SPELLS[id].el].c}">${SPELLS[id].n}</b>`,gn=id=>{const g=bagGear(id);return`<b style="color:${RAR[g.rar].c}">${g.name}</b>`};
  const sl=(a,f)=>a.length?a.map(f).join(' + '):'<span class="hint">nothing selected</span>';
  el.innerHTML=
  `<div class="label" style="margin-top:14px">GEAR FORGE</div>
  <p class="hint">Melt two pieces from your bag into one new random piece. Mixing can raise or lower the quality. ${failTxt('gear')}.</p>
  <div class="fgrid">${gearGrid(FJ.g,'data-fg')}</div>
  <div class="forgeline"><div class="fslots">${sl(FJ.g,gn)}</div><button class="buy" id="fgMix" ${FJ.g.length===2&&G.coins>=FORGE_COST.gear?'':'disabled'}><span class="coin"></span>${FORGE_COST.gear} MIX</button></div>
  <div class="forgeres">${FJ.msg.gear}</div>
  <div class="label" style="margin-top:14px">SPELL FUSION</div>
  <p class="hint">Fuse two known spells into one random new spell. Higher-level spells give better odds of a powerful result. ${failTxt('spell')}.</p>
  <div class="splist">${spellGrid(FJ.s,'data-fs')}</div>
  <div class="forgeline"><div class="fslots">${sl(FJ.s,nm)}</div><button class="buy" id="fsMix" ${FJ.s.length===2&&G.coins>=FORGE_COST.spell?'':'disabled'}><span class="coin"></span>${FORGE_COST.spell} FUSE</button></div>
  <div class="forgeres">${FJ.msg.spell}</div>
  <div class="label" style="margin-top:14px">IMBUE FORGE</div>
  <p class="hint">Bind a spell into a piece of gear. Imbued gear casts that spell for free while you fight (28% per attack on a weapon, 12% on other gear). The spell loses one level. ${failTxt('imbue')}.</p>
  <div class="fgrid">${gearGrid(FJ.ig?[FJ.ig]:[],'data-fig')}</div>
  <div class="splist" style="margin-top:6px">${spellGrid(FJ.is?[FJ.is]:[],'data-fis')}</div>
  <div class="forgeline"><div class="fslots">${FJ.ig?gn(FJ.ig):'<span class="hint">a piece of gear</span>'}<em>+</em>${FJ.is?nm(FJ.is):'<span class="hint">a spell</span>'}</div><button class="buy" id="fiMix" ${FJ.ig&&FJ.is&&G.coins>=FORGE_COST.imbue?'':'disabled'}><span class="coin"></span>${FORGE_COST.imbue} IMBUE</button></div>
  <div class="forgeres">${FJ.msg.imbue}</div>`;
}
function initForges(){
  $('forges').addEventListener('click',e=>{
    const fg=e.target.closest('[data-fg]'),fs=e.target.closest('[data-fs]'),fig=e.target.closest('[data-fig]'),fis=e.target.closest('[data-fis]');
    if(fg){const id=+fg.dataset.fg,i=FJ.g.indexOf(id);if(i>=0)FJ.g.splice(i,1);else if(FJ.g.length<2)FJ.g.push(id);SFX.click()}
    else if(fs){const id=fs.dataset.fs,i=FJ.s.indexOf(id);if(i>=0)FJ.s.splice(i,1);else if(FJ.s.length<2)FJ.s.push(id);SFX.click()}
    else if(fig){const id=+fig.dataset.fig;FJ.ig=FJ.ig===id?null:id;SFX.click()}
    else if(fis){const id=fis.dataset.fis;FJ.is=FJ.is===id?null:id;SFX.click()}
    else if(e.target.closest('#fgMix'))return mixGear();else if(e.target.closest('#fsMix'))return fuseSpells();else if(e.target.closest('#fiMix'))return imbueGear();
    else return;
    renderForges();
  });
}
function afterForge(){$('sCoins').textContent=G.coins;stats();refreshGearVisual();renderForges();if(typeof renderSpells==='function')renderSpells()}
function mixGear(){
  if(FJ.g.length<2||G.coins<FORGE_COST.gear)return;const a=bagGear(FJ.g[0]),b=bagGear(FJ.g[1]);if(!a||!b)return;
  G.coins-=FORGE_COST.gear;G.bag=G.bag.filter(g=>g!==a&&g!==b);FJ.g=[];
  if(Math.random()<FORGE_FAIL.gear){FJ.msg.gear=`<span class="bad">The forge screams and the metal turns to dust. ${a.name} and ${b.name} are lost.</span>`;forgeFx(false);return afterForge()}
  const slot=Math.random()<.8?pick(Math.random,[a.slot,b.slot]):pick(Math.random,SLOTS),r=Math.random(),rar=clamp(Math.max(a.rar,b.rar)+(r<.3?1:r<.8?0:-1),0,4);
  const g=genGear(slot,rar);G.bag.push(g);FJ.msg.gear=`Forged: <b style="color:${RAR[g.rar].c}">${g.name}</b> (${RAR[g.rar].n} ${SLOT_N[g.slot].toLowerCase()}).`;forgeFx(true);burst(ch.x,1.5,ch.z,RAR[g.rar].c,30,4,.35);afterForge();
}
function fuseSpells(){
  if(FJ.s.length<2||G.coins<FORGE_COST.spell)return;const[a,b]=FJ.s;if(!G.spells[a]||!G.spells[b])return;
  const la=G.spells[a],lb=G.spells[b];G.coins-=FORGE_COST.spell;FJ.s=[];
  const gave=dropSpell(a)|dropSpell(b);
  if(Math.random()<FORGE_FAIL.spell){FJ.msg.spell=`<span class="bad">The fusion collapses. ${SPELLS[a].n} and ${SPELLS[b].n} are gone.${gave?' A spark of Chrono Bolt remains.':''}</span>`;forgeFx(false);return afterForge()}
  const boost=1+.6*(la+lb-2),ea=SPELLS[a].el,eb=SPELLS[b].el;
  const pool=Object.keys(SPELLS).filter(id=>id!==a&&id!==b&&(G.spells[id]||0)<3).map(id=>{const S=SPELLS[id];let w=S.t===1?10:S.t===2?6*boost:.7*boost;w*=1+1.5*((S.el===ea)+(S.el===eb));if(!G.spells[id])w*=2;return[id,w]});
  const tot=pool.reduce((s,p)=>s+p[1],0);let x=Math.random()*tot,id=pool[0][0];for(const[i,w]of pool){x-=w;if(x<0){id=i;break}}
  const was=G.spells[id]||0;G.spells[id]=was+1;if(!was){if(!G.slots[0])G.slots[0]=id;else if(!G.slots[1])G.slots[1]=id}
  const S=SPELLS[id];FJ.msg.spell=was?`<b style="color:${ELEM[S.el].c}">${S.n}</b> grew stronger: level ${was+1}!`:`New spell: <b style="color:${ELEM[S.el].c}">${S.n}</b>. ${S.d}`;
  forgeFx(true);ringFx(ch.x,ch.z,2.4,ELEM[S.el].c,.6);afterForge();
}
function imbueGear(){
  if(!FJ.ig||!FJ.is||G.coins<FORGE_COST.imbue)return;const g=bagGear(FJ.ig),id=FJ.is;if(!g||!G.spells[id])return;
  const lv=G.spells[id],S=SPELLS[id];G.coins-=FORGE_COST.imbue;FJ.ig=null;FJ.is=null;
  if(Math.random()<FORGE_FAIL.imbue){G.bag=G.bag.filter(x=>x!==g);const gave=dropSpell(id);FJ.msg.imbue=`<span class="bad">The magic tears the gear apart. ${g.name} and ${S.n} are lost.${gave?' A spark of Chrono Bolt remains.':''}</span>`;forgeFx(false);return afterForge()}
  if(lv>1)G.spells[id]=lv-1;else dropSpell(id);
  if(!g.imb)g.name+=' ✧';g.imb={id,lv};
  FJ.msg.imbue=`<b style="color:${RAR[g.rar].c}">${g.name}</b> now carries ${S.n} (level ${lv}).`;forgeFx(true);ringFx(ch.x,ch.z,2.4,ELEM[S.el].c,.6);afterForge();
}


/* ================= state ================= */
let G=null,mode='title',T=0,camX=0,camZoom=1,trav=null;
let panelOpen=false,briefOpen=false,miniOpen=false,shopOpen=false;
const keys=new Set();
const busy=()=>!!trav||invOpen||panelOpen||briefOpen||miniOpen||shopOpen||mode!=='play';
const repairEra=()=>{const f=G.timeline.filter(y=>!PAST(y));return f.length?f[f.length-1]:null};
const activeRepair=()=>G&&G.repairs.length&&repairEra()===G.cur?G.repairs[0]:null;
const missionOpen=y=>!!G&&hasM(y)&&G.status[y]==='open';
const relicCount=()=>G?Object.keys(G.relics).length:0;

function stats(){
  const u=G.up,R=y=>!!G.relics[y];
  ch.maxHp=100+25*u.hp+(R(1969)?20:0)+(R(-15000)?15:0);ch.dmg=20+6*u.dmg+(R(1957)?5:0)+(R(2600)?8:0);
  ch.spd=1+.08*u.spd+(R(1000)?.06:0)+(R(1903)?.06:0)+(R(2150)?.06:0);ch.timeB=10*u.time+(R(1869)?6:0)+(R(2240)?6:0);
  ch.dashK=Math.pow(.85,u.dash)*(R(1985)?.85:1);ch.armor=(R(1999)?.9:1)*(R(2400)?.88:1)*(R(80)?.92:1);ch.coinK=1+(R(1610)?.25:0)+(R(2026)?.25:0)+(R(-2560)?.2:0);
  ch.coolK=R(1927)?1.4:1;ch.regen=R(2088)?4:2;applyGear();ch.maxMana=100+25*(u.mana||0)+(R(-66000000)?25:0);ch.mana=ch.mana==null?ch.maxMana:Math.min(ch.mana,ch.maxMana);ch.hp=Math.min(ch.hp,ch.maxHp);if(DU.on)duelStats();
}

function newGame(){
  G={timeline:[...TIERS[0],...TIERS[1],...TIERS[2]].sort((a,b)=>a-b),erased:[],status:{},timers:{},bonus:{},repairs:[],score:0,missions:0,repairsDone:0,tier:2,cur:2026,over:null,coins:0,heat:0,kills:0,hunters:0,
    up:{mana:0,hp:0,dmg:0,spd:0,time:0,dash:0},relics:{},prev:2026,boss:null,sealed:false,free:false,seed:(DU.on&&DU.seed)?DU.seed:(Math.random()*1e6)|0,guards:{},hints:{},spells:{bolt:1},slots:[null,'bolt'],seeds:{past:0,future:0,void:0,ember:0,storm:0,echo:0},seedGot:{},fusions:0,bag:[],eq:{weapon:null,armor:null,boots:null,trinket:null}};
  bagSeen=0;invOpen=false;$('inv').hidden=true;PSUIT=SUIT;buildPlayer();$('bossbar').hidden=true;stats();ch.hp=ch.maxHp;ch.mana=ch.maxMana;spSel=null;MAGIC.forge=[];MAGIC.forgeMsg='';ch.inv=0;ch.carry=0;setCarry(false);
  G.timeline.filter(hasM).forEach(y=>G.status[y]='open');
  mode='play';$('title').hidden=true;$('end').hidden=true;$('hud').hidden=false;
  if(DU.on&&DU.hunter){duelHunterInit();return}
  arrive(2026,true);
}
function initTimer(y){if(G.timers[y]==null){G.timers[y]=ERA[y].mission.time+ch.timeB+(G.bonus[y]||0);delete G.bonus[y]}}
function arrive(year,first){
  G.cur=year;setCarry(false);ch.cells=0;ch.inv=1;ch.kbx=ch.kbz=0;clearLabels();if(WD){clearShots();closePortal()}genWorld(year);
  ch.x=WD.mx;ch.z=ZMIN+.6;ch.fx=0;ch.fz=1;ch.target=null;camX=ch.x;streamChunks(99);
  $('hudY').textContent=fy(year);$('hudE').textContent=ERA[year].name;renderTimeline();setAmbient(year);
  if(DU.on&&DU.hunter){hunterArrive(year);return}
  if(year===TH){G.boss={mode:'invade',t:2.2,on:false,n:null};toast('The Throne of Time. He is waiting.',true);return}
  if(year===NX){toast('The Nexus. No clocks, no Hunters. Walk to the bazaar to trade.');return}
  G.prev=year;
  const rp=activeRepair();
  if(rp){if(rp.time==null)rp.time=70+ch.timeB;showRepairBrief(rp);if(missionOpen(year))initTimer(year);return}
  if(hasM(year)){const st=G.status[year];
    if(st==='open'){initTimer(year);showBrief(year)}
    else if(st==='done')toast(`${fy(year)}: the event happened. History holds.`);
    else toast(`${fy(year)} is broken. Repair it from ${repairEra()||'the future'}.`,true)}
  else if(first)showIntro();
  else if(G.repairs.length)toast(`Paradox pending: repair it in ${repairEra()}.`,true);
  else toast(`${fy(year)}: ${ERA[year].name}. Your base. Nothing to fix here.`);
}
function openMissions(){return G.timeline.filter(y=>missionOpen(y))}
function eraseEra(v){G.timeline=G.timeline.filter(y=>y!==v);G.erased.push(v);G.repairs=G.repairs.filter(rp=>rp.forYear!==v);renderTimeline()}
function failMission(y){
  if(miniOpen)closeMini();setCarry(false);redT=1;SFX.bad();
  if(PAST(y)){
    G.status[y]='failed';delete G.timers[y];
    const cands=G.timeline.filter(v=>v!==G.cur);const victim=cands[cands.length-1];
    if(victim==null)return endGame();
    eraseEra(victim);G.repairs.push({forYear:y,restore:victim,time:null});
    toast(`PARADOX! ${fy(y)} failed and ${fy(victim)} vanished from the timeline.`,true);
    WD.items.filter(i=>i.kind==='item').forEach(removeItem);
    if(checkCollapse())return;
    setTimeout(()=>G&&!G.over&&toast(`Travel to ${repairEra()} to repair the damage.`,true),3200);
  }else{
    const cands=G.timeline.filter(v=>v!==G.cur);const victim=cands[0];
    if(victim==null)return endGame();
    eraseEra(victim);G.timers[y]=ERA[y].mission.time;
    toast(`The future slipped and ${fy(victim)} was erased. The future isn't written yet: try ${fy(y)} again.`,true);
    if(checkCollapse())return;
    WD.items.filter(i=>i.kind==='item').forEach(removeItem);placeItem(Math.random);
  }
  renderTimeline();checkRound();
}
function failRepair(){
  const rp=G.repairs[0];redT=1;ch.cells=0;SFX.bad();
  const cands=G.timeline.filter(v=>v!==G.cur);const victim=cands[0];
  if(victim==null)return endGame();
  eraseEra(victim);toast(`Repair failed! ${victim} has been erased.`,true);
  if(checkCollapse())return;
  if(G.repairs[0]===rp){rp.time=70;placeRepair();setTimeout(()=>G&&!G.over&&toast('The stabilizer reset. Try again.',true),2600)}
  const nr=activeRepair();if(nr&&nr.time==null){nr.time=70;placeRepair()}
  renderTimeline();checkRound();
}
function ripple(y){
  const next=G.timeline.find(v=>v>y&&missionOpen(v));if(!next)return;
  if(G.timers[next]!=null)G.timers[next]+=15;else G.bonus[next]=(G.bonus[next]||0)+15;
  setTimeout(()=>G&&!G.over&&toast(`Ripple effect: ${fy(y)} secured, ${fy(next)} gets +15 seconds.`),2400);
}
function succeedMission(y){
  if(!G||G.over)return;
  const tl=G.timers[y]||0;G.status[y]='done';G.missions++;G.score+=100+2*Math.ceil(tl);delete G.timers[y];setCarry(false);
  const c=Math.round(30*ch.coinK);G.coins+=c;floatText(ch.x,2.8,ch.z,`+${c} coins`,'#ffd24a',true);
  SFX.ok();burst(WD.land.x,2,ZMIN,'#ffd24a',90,7,.5,3);if(WD.landGroup)burst(WD.land.x,6,FRONT,'#ffb35c',60,6,.6,2);GU.uFlash.value=.35;
  toast(`✓ ${ERA[y].mission.must}`);ripple(y);renderTimeline();if(DU.on&&!DU.hunter&&G.missions>=DU.goal){duelWin();return}checkRound();
}
function succeedRepair(){
  const rp=G.repairs.shift();G.repairsDone++;G.score+=60+Math.ceil(rp.time||0);G.coins+=Math.round(20*ch.coinK);SFX.ok();
  if(!G.timeline.includes(rp.restore)){G.timeline.push(rp.restore);G.timeline.sort((a,b)=>a-b);G.erased=G.erased.filter(v=>v!==rp.restore)}
  if(G.timeline.includes(rp.forYear)){G.status[rp.forYear]='open';delete G.timers[rp.forYear]}
  if(WD.stab){burst(WD.stab.x,2.5,WD.stab.z,'#5ff5d6',90,7,.5);WD.group.remove(WD.stab.g);disposeTree(WD.stab.g);WD.stab=null}
  WD.items.filter(i=>i.kind==='cell').forEach(removeItem);GU.uFlash.value=.3;
  toast(`Timeline repaired! ${rp.restore} restored. ${rp.forYear} can be retried.`);
  renderTimeline();
  const n=activeRepair();if(n){n.time=70;placeRepair();setTimeout(()=>showRepairBrief(n),1400)}
  else if(missionOpen(G.cur)){if(!WD.items.some(i=>i.kind==='item')&&!ch.carry)placeItem(Math.random);initTimer(G.cur);setTimeout(()=>G&&!G.over&&toast(`Now finish this era's own mission: ${ERA[G.cur].mission.label}.`),3000)}
  checkRound();
}
function checkCollapse(){
  if(G.boss||G.free)return true;
  const past=G.timeline.filter(PAST),fut=G.timeline.filter(y=>!PAST(y));
  if(G.timeline.length<=1||!past.length||(G.repairs.length&&!fut.length)){endGame();return true}
  return false;
}
function checkRound(){
  if(G.over||G.repairs.length||G.sealed||G.boss||G.free)return;
  const ms=G.timeline.filter(hasM);
  if(!ms.length||!ms.every(y=>G.status[y]==='done'))return;
  G.tier++;G.score+=250;
  if(G.tier>=TIERS.length){G.score+=500;return endGame(true)}
  const add=TIERS[G.tier].filter(y=>!G.timeline.includes(y)&&!G.erased.includes(y));
  add.forEach(y=>{G.timeline.push(y);if(hasM(y))G.status[y]='open'});G.timeline.sort((a,b)=>a-b);
  renderTimeline();
  setTimeout(()=>toast(`Timeline stable! +250. The line grows: ${add.map(fy).join(' and ')}.`),1000);
}
function endGame(win){if(G.over||G.boss||G.free)return;if(win)sealLine();else trapped()}
function trapped(){
  if(G.boss||G.over||G.free)return;if(miniOpen)closeMini();closePanel();
  G.boss={mode:'trapped',t:3,on:false,n:null};G.repairs=[];G.timers={};
  if(WD.stab){WD.group.remove(WD.stab.g);WD.stab=null}WD.items.filter(i=>i.kind==='item'||i.kind==='cell').forEach(removeItem);setCarry(false);ch.cells=0;closePortal();
  WD.npcs.forEach(n=>{if(n.kind==='citizen'){n.hostile=false;n.wind=0;n.flee=7}else if(n.kind==='hunter')n.dying=.01});
  redT=1;renderTimeline();toast(`The line has collapsed. You are trapped in ${fy(G.cur)}. Something is coming...`,true);SFX.bad();
}
function sealLine(){
  G.sealed=true;renderTimeline();
  $('briefCard').classList.remove('paradox');$('bDate').textContent='ALL ERAS SECURE';$('bYear').textContent=fy(YEARS[0])+' – '+fy(YEARS[YEARS.length-1]);$('bEra').textContent='The whole causal line';$('bMustL').textContent='TIMELINE SEALED';$('bMust').textContent='History holds from end to end. +500';
  $('bTask').innerHTML='One thing remains: the <em>Time Lord</em>. Keep hunting relics, coins and upgrades for as long as you like. When you are ready, open the machine and choose <em>INVADE</em>. There is no way back from the Throne.';
  openBrief();
}
function roamFree(){
  $('end').hidden=true;mode='play';G.over=null;G.boss=null;G.sealed=false;G.free=true;G.repairs=[];G.erased=[];G.timers={};G.heat=0;
  G.timeline=[...YEARS];G.timeline.forEach(y=>{if(hasM(y))G.status[y]='done'});
  PSUIT=LORD_SUIT;buildPlayer();ch.hp=ch.maxHp;ch.inv=1;arrive(G.timeline.includes(G.prev)?G.prev:2026);toast('You are the Time Lord. Every year is open to you.');
}

/* ================= UI ================= */
let toastTimer=0;
function toast(msg,warn){const t=$('toast');t.textContent=msg;t.className='toast'+(warn?' warn':'');t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,3800)}
function chipState(y){if(G.erased.includes(y))return'erased';if(G.repairs.length&&repairEra()===y)return'repair';return hasM(y)?(G.status[y]||'open'):''}
function renderTimeline(){
  if(!G)return;const ys=[...new Set([...G.timeline,...G.erased])].sort((a,b)=>a-b);
  $('tl').innerHTML=ys.map(y=>`<span class="chip ${chipState(y)} ${y===G.cur?'cur':''}">${fy(y)}</span>`).join('');
  const c=$('tl').querySelector('.cur');if(c)c.scrollIntoView({inline:'center',block:'nearest'});
}
let objCache='';
function objectiveTarget(){
  if(!G||!WD)return null;if(DU.on&&DU.hunter)return WD.clue?{p:WD.clue,c:'c'}:null;if(G.boss&&G.boss.n&&!G.boss.n.dying)return{p:G.boss.n,c:''};if(G.boss)return null;
  if(G.cur===NX)return WD.merchant?{p:{x:WD.land.x,z:ZMIN},c:'m'}:null;
  const rp=activeRepair();if(rp&&WD.stab){if(ch.cells>0||!WD.items.some(i=>i.kind==='cell'))return{p:WD.stab,c:'c'};const c=nearest(WD.items.filter(i=>i.kind==='cell'));return c?{p:c,c:'c'}:null}
  if(missionOpen(G.cur)&&!rp){if(ch.carry)return{p:{x:WD.land.x,z:ZMIN},c:''};const it=WD.items.find(i=>i.kind==='item');return it?{p:it,c:''}:null}
  return{p:{x:WD.mx,z:ZMIN},c:'m'};
}
function nearest(a){let b=null,bd=1e9;for(const i of a){const d=Math.abs(i.x-ch.x);if(d<bd){bd=d;b=i}}return b}
function updateHUD(){
  const show=mode==='play'&&G&&!G.over;$('status').hidden=!show;$('actions').hidden=!show;$('spells').hidden=!show;$('hud').hidden=!(mode==='play'||mode==='over');
  if(!G)return;
  let html='';const rp=activeRepair();
  if(DU.on&&DU.hunter)html=duelObj();
  else if(G.boss)html=G.boss.on?'<span>Defeat the Time Lord</span>':'<span>Something is coming...</span>';
  else if(rp)html=`<span class="t ${rp.time<15?'low':''}">${fmt(rp.time)}</span><span>Paradox: cells ${WD.delivered+ch.cells}/3 → stabilizer</span>`;
  else if(missionOpen(G.cur)){const t=G.timers[G.cur];html=`<span class="t ${t<15?'low':''}">${fmt(t)}</span><span>${ch.carry?`Bring ${artItem()} to the ${ERA[G.cur].mission.label}`:`Find ${artItem()}`}</span>`}
  else if(G.cur===NX)html='<span>Walk to the bazaar to trade</span>';
  else if(G.cur!==TH)html=G.sealed?'<span>Line sealed · invade the Throne when ready</span>':G.free?'<span>Roam time freely</span>':'<span>Return to the Chrono·Cabin and pick an era</span>';
  if(DU.on&&!DU.hunter&&!G.over)html+=`<span>Duel ${G.missions}/${DU.goal}</span>`;
  if(html!==objCache){$('obj').innerHTML=html;objCache=html}
  $('score').textContent=G.score;
  $('hpBar').style.width=(100*clamp(ch.hp/ch.maxHp,0,1))+'%';$('hpTxt').textContent=Math.ceil(Math.max(0,ch.hp));$('coins').textContent=G.coins;$('heatBar').style.width=Math.round(G.heat)+'%';
  updateMagicHUD();$('relN').textContent=relicCount();$('atkN').textContent=ch.dmg;
  if(G.boss&&G.boss.n)$('bossHp').style.width=(100*clamp(G.boss.n.hp/G.boss.n.maxHp,0,1))+'%';
  const it=interactable();$('bUse').hidden=!it;if(it){$('bUse').textContent=it.label;hint('use_'+it.k,(TOUCH?'Tap '+it.label+' to use ':'Press E to use ')+USE_H[it.k]+'.')}
}

/* briefings */
function showBrief(y){
  const m=ERA[y].mission;$('briefCard').classList.remove('paradox');$('bDate').textContent=m.date.toUpperCase();$('bYear').textContent=fy(y);$('bEra').textContent=ERA[y].name;
  $('bMustL').textContent='MUST HAPPEN';$('bMust').textContent=m.must;$('bTask').innerHTML=m.task+` You have <em>${fmt(G.timers[y])}</em>.`;openBrief();
}
function showRepairBrief(rp){
  $('briefCard').classList.add('paradox');$('bDate').textContent='TEMPORAL ALERT';$('bYear').textContent=fy(G.cur);$('bEra').textContent=ERA[G.cur].name;
  $('bMustL').textContent='PARADOX';$('bMust').textContent=`The failure in ${rp.forYear} erased ${rp.restore}.`;
  $('bTask').innerHTML='Collect the 3 <em>chronon cells</em> and feed them to the <em>stabilizer</em> before the clock runs out. Succeed and the lost era returns; fail and the earliest past is erased.';
  openBrief();
}
let introHint=false;
function hint(k,msg,delay=0){if(!G||G.hints[k])return;G.hints[k]=1;setTimeout(()=>G&&!G.over&&toast(msg),delay)}
const USE_H={fountain:'the mana fountain',machine:'the time machine',shop:'the Bazaar',land:'the task'};
function showIntro(){
  $('briefCard').classList.remove('paradox');$('bDate').textContent='BASE OF OPERATIONS';$('bYear').textContent='2026';$('bEra').textContent='Present Day';
  $('bMustL').textContent='YOUR JOB';$('bMust').textContent='Keep the causal line intact.';
  $('bTask').innerHTML=`History is breaking in <em>${openMissions().length} eras</em>. Step into the time machine and choose one.`;
  introHint=true;openBrief();
}
function openBrief(){briefOpen=true;$('brief').hidden=false;keys.clear();setTimeout(()=>$('bGo').focus(),50)}
$('bGo').onclick=()=>{briefOpen=false;$('brief').hidden=true;cv.focus();if(introHint){introHint=false;hint('move',TOUCH?'Tap the ground to walk to the time machine.':'Walk with WASD or the arrow keys.',500);hint('spell',TOUCH?'Tap the spell button to cast Chrono Bolt. Mana is limited: refill it at the Nexus fountain.':'Press E to cast Chrono Bolt. Mana is limited: refill it at the Nexus fountain.',7500)}};

/* ================= interactions ================= */
function interactable(){
  if(!G||busy()||!WD)return null;
  if(Math.abs(ch.x-WD.mx)<2.2&&ch.z<ZMIN+2)return{k:'machine',label:'MACHINE'};
  if(G.cur===NX&&Math.abs(ch.x-WD.land.x)<2.6&&ch.z<ZMIN+2.2)return{k:'shop',label:'BAZAAR'};
  if(G.cur===NX&&WD.fountain&&Math.abs(ch.x-WD.fountain.x)<2.8&&ch.z<ZMIN+2.6)return{k:'fountain',label:'FOUNTAIN'};
  if(missionOpen(G.cur)&&!activeRepair()&&ch.carry&&Math.abs(ch.x-WD.land.x)<2.4&&ch.z<ZMIN+2.2)return{k:'land',label:'USE'};
  return null;
}
function interact(){const it=interactable();if(!it)return;SFX.click();if(it.k==='machine')openPanel();else if(it.k==='shop')openShop();else if(it.k==='fountain')drinkFountain();else if(it.k==='land')openMini(G.cur)}
function checkPickups(){
  for(const it of [...WD.items]){if(Math.hypot(it.x-ch.x,it.z-ch.z)>(it.kind==='gear'||it.kind==='mseed'?1.2:.9))continue;
    if(it.kind==='item'&&missionOpen(G.cur)&&!ch.carry&&!activeRepair()){removeItem(it);setCarry(true);SFX.pick();burst(ch.x,1.5,ch.z,'#ffb35c',24,3,.35);toast(`You have ${artItem()}! Bring it to the ${ERA[G.cur].mission.label}.`)}
    else if(it.kind==='relic'){removeItem(it);G.relics[G.cur]=true;stats();G.score+=40;SFX.ok();burst(ch.x,1.5,ch.z,'#b44aff',50,5,.45);const[n,d]=RELIC[G.cur];toast(`Relic: ${n} · ${d}`)}
    else if(it.kind==='gear'){pickGear(it)}
    else if(it.kind==='mseed'){pickSeed(it)}
    else if(it.kind==='cell'&&activeRepair()){removeItem(it);ch.cells++;SFX.pick();burst(ch.x,1.5,ch.z,'#5ff5d6',24,3,.35);toast(`Chronon cell ${WD.delivered+ch.cells}/3`)}}
  if(WD.stab&&ch.cells>0&&Math.hypot(WD.stab.x-ch.x,WD.stab.z-ch.z)<1.6){for(let i=0;i<ch.cells;i++){const s=WD.stab.slots[WD.delivered+i];if(s)s.material.emissiveIntensity=4}WD.delivered+=ch.cells;ch.cells=0;SFX.pick();burst(WD.stab.x,1.2,WD.stab.z,'#5ff5d6',30,4,.4);if(WD.delivered>=3)succeedRepair()}
  if(ch.openOnArrive&&!ch.target){const k=ch.openOnArrive;ch.openOnArrive=null;const it=interactable();if(it&&it.k===k)interact()}
}

/* ================= console (time machine) ================= */
let selYear=2026;
function openPanel(){if(G.boss){toast('The machine does not respond. There is no way out.',true);return}panelOpen=true;$('panel').hidden=false;keys.clear();selYear=G.cur>0?G.cur:G.prev;renderPanel();setTimeout(()=>$('go').focus(),50)}
function closePanel(){panelOpen=false;$('panel').hidden=true}
function renderPanel(){
  const ys=[...new Set([...G.timeline,...G.erased])].sort((a,b)=>a-b);
  $('keys').innerHTML=ys.map(y=>{const s=chipState(y);return`<button data-y="${y}" aria-pressed="${y===selYear}" ${G.erased.includes(y)?'disabled':''}>${fy(y)}<i class="${s}"></i></button>`}).join('');
  $('keys').querySelectorAll('button').forEach(b=>b.onclick=()=>{selYear=+b.dataset.y;SFX.click();renderPanel()});
  const d=String(selYear).padStart(4,'0');$('tubes').innerHTML=[...d].map(c=>`<div class="tube"><span>${c}</span></div>`).join('');
  const s=chipState(selYear),e=ERA[selYear];let txt=`<em>${e.name}</em> · `;
  if(selYear===G.cur)txt+='you are here';else if(s==='repair')txt+='paradox: repair needed here';else if(s==='open')txt+=`mission open · ${fmt(G.timers[selYear]??e.mission.time+ch.timeB+(G.bonus[selYear]||0))}`;
  else if(s==='done')txt+='stable';else if(s==='failed')txt+='broken: repair it from the future';else txt+=selYear===2026?'your base':'no mission';
  $('dest').innerHTML=txt;$('nowY').textContent=G.cur===NX?'∞':G.cur===TH?'END':G.cur;$('go').disabled=selYear===G.cur;
  $('invade').hidden=!G.sealed||G.boss;$('toNexus').hidden=!!G.boss||G.cur===NX||(DU.hunter&&G.cur===TH);$('toNexus').textContent=DU.hunter?'HQ':'NEXUS ∞';
}
$('close').onclick=()=>{closePanel();cv.focus()};
$('go').onclick=()=>{if(selYear!==G.cur)travel(selYear)};
$('toNexus').onclick=()=>travel(DU.hunter?TH:NX);
$('invade').onclick=()=>travel(TH);

/* ================= travel (time tunnel) ================= */
const tunnelScene=new THREE.Scene(),tunnelCam=new THREE.PerspectiveCamera(70,1,.1,400);
const tunnelMat=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{t:{value:0},c1:{value:col('#ff8a2a')},c2:{value:col('#5ff5d6')}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float t;uniform vec3 c1,c2;varying vec2 vUv;float h(float n){return fract(sin(n)*43758.5453);}void main(){float y=vUv.y*60.-t*28.;float a=vUv.x*6.2831;
    float ring=smoothstep(.4,0.,abs(fract(y)-.5))*.9;float streak=pow(h(floor(vUv.x*90.)),18.)*smoothstep(0.,1.,fract(y*.2+h(floor(vUv.x*90.))));
    float tick=step(.96,fract(vUv.x*24.))*step(.5,fract(y*.5));vec3 c=mix(c1,c2,.5+.5*sin(y*.15+a));gl_FragColor=vec4(c*(ring*.6+streak*2.5+tick*.8)+c*.04,1.);}`});
const tunnel=new THREE.Mesh(new THREE.CylinderGeometry(6,6,300,48,1,true),tunnelMat);tunnel.rotation.x=Math.PI/2;tunnelScene.add(tunnel);
const tclock=new THREE.Group();for(let i=0;i<12;i++){const a=i/12*Math.PI*2,m=new THREE.Mesh(BOX(),new THREE.MeshBasicMaterial({color:'#ffd27a',toneMapped:false}));m.scale.set(.15,.6,.05);m.position.set(Math.cos(a)*3,Math.sin(a)*3,0);m.rotation.z=a+Math.PI/2;tclock.add(m)}tclock.position.z=-40;tunnelScene.add(tclock);
function travel(to){
  closePanel();if(trav)return;if(DU.on&&!DU.hunter)duelSend({t:'trav',from:G.cur,to});trav={t:0,to,switched:false,gen:false};ch.target=null;SFX.whoosh();keys.clear();
}
function updateTravel(dt){
  const tr=trav;tr.t+=dt;const t=tr.t;
  if(t<.3)GU.uFlash.value=t/.3;
  else if(!tr.switched){tr.switched=true;renderPass.scene=tunnelScene;renderPass.camera=tunnelCam;tunnelCam.aspect=W/H;tunnelCam.updateProjectionMatrix();bloom.strength=1.2;bloom.threshold=.2;setFilm('deep');renderer.toneMappingExposure=1;$('hud').style.opacity=.3}
  if(t>=.3&&t<1.5){GU.uFlash.value=Math.max(0,1-(t-.3)/.25)+Math.max(0,(t-1.25)/.25);tunnelMat.uniforms.t.value=t;tunnelCam.position.set(Math.sin(t*3)*.6,Math.cos(t*2.3)*.6,0);tunnelCam.rotation.z=t*1.2;tclock.position.z=-40+(t-.3)*30;tclock.rotation.z=-t*4}
  if(t>=1.5&&!tr.gen){tr.gen=true;GU.uFlash.value=1;renderPass.scene=scene;renderPass.camera=camera;$('hud').style.opacity=1;if(G.boss&&G.boss.mode==='invade'){}arrive(tr.to)}
  if(t>=1.5)GU.uFlash.value=Math.max(0,1-(t-1.5)/.45);
  if(t>=1.95){GU.uFlash.value=0;trav=null}
}

/* ================= shop (Nexus bazaar) ================= */
const wareCost=w=>w.use?w.base:Math.round(w.base*(1+.7*G.up[w.k]));
function openShop(){shopOpen=true;$('shop').hidden=false;keys.clear();renderShop()}
function renderShop(){
  $('sCoins').textContent=G.coins;
  $('wares').innerHTML=WARES.map((w,i)=>{const lvl=w.use?0:G.up[w.k],maxed=!w.use&&lvl>=w.max,c=wareCost(w);
    return`<div class="ware"><div><h3>${w.n}${w.use?'':`<span class="pips">${Array.from({length:w.max},(_,k)=>`<i class="${k<lvl?'on':''}"></i>`).join('')}</span>`}</h3><p>${w.d}</p></div>
    <button class="buy" data-i="${i}" ${maxed||G.coins<c?'disabled':''}>${maxed?'MAX':`<span class="coin"></span>${c}`}</button></div>`}).join('');
  $('wares').querySelectorAll('.buy').forEach(b=>b.onclick=()=>buy(WARES[+b.dataset.i]));
  renderForge();
  $('sRelN').textContent=`${relicCount()}/14`;
  $('sRelics').innerHTML=YEARS.map(y=>G.relics[y]?`<span title="${RELIC[y][1]}">${RELIC[y][0]} <em>${RELIC[y][1]}</em></span>`:`<span style="opacity:.35">${fy(y)} · ???</span>`).join('');
}
function buy(w){const c=wareCost(w);if(G.coins<c)return;G.coins-=c;SFX.coin();
  if(w.k==='heal')ch.hp=ch.maxHp;else if(w.k==='cool')G.heat=0;else{G.up[w.k]++;stats();if(w.k==='hp')ch.hp=ch.maxHp;if(w.k==='mana')ch.mana=ch.maxMana}renderShop()}
$('sLeave').onclick=()=>{shopOpen=false;$('shop').hidden=true;cv.focus()};

/* ================= minigames ================= */
const mc=$('mc'),mx=mc.getContext('2d');const MW=800,MH=500;let MG=null;
function sizeMini(){const r=mc.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);mc.width=Math.max(320,r.width*d);mc.height=mc.width*MH/MW}
function openMini(y){
  const m=ERA[y].mission.mini;miniOpen=true;$('mini').hidden=false;keys.clear();sizeMini();
  $('mTitle').textContent=m.title;$('mHint').textContent=m.hint;
  MG={type:m.type,skin:m.skin,y,t:0,done:false,flash:0,flashC:'#ff4f45',msg:'',msgT:0};
  const r=Math.random,act=$('mAct');act.hidden=!(m.type==='timing'||m.type==='hold');
  act.textContent=m.act||(m.type==='hold'?'HOLD':m.skin==='hammer'?'STRIKE':m.skin==='reel'?'SYNC':'BURN');
  if(m.type==='targets'){MG.tg=[];MG.dec=[];if(m.skin==='moons'){const side=[-1,1,1,-1],dist=[95,130,175,240];for(let i=0;i<4;i++)MG.tg.push({x:400+side[i]*dist[i]+(r()-.5)*14,y:250+(r()-.5)*10,r:6,got:false});
      for(let i=0;i<16;i++){let x,y;do{x=200+r()*400;y=60+r()*380}while(Math.abs(y-250)<30||Math.hypot(x-400,y-250)<80);MG.dec.push({x,y,r:2+r()*3})}}
    else{for(let i=0;i<4;i++)MG.tg.push({x:120+r()*560,y:90+r()*320,r:16,got:false,ph:r()*6,ax:40+r()*60,ay:20+r()*40,cx:0,cy:0});MG.tg.forEach(t=>{t.cx=t.x;t.cy=t.y});for(let i=0;i<24;i++)MG.dec.push({x:r()*800,y:r()*500,r:10+r()*16,a:r()*6,s:.3+r()})}}
  if(m.type==='timing'){Object.assign(MG,{p:0,dir:1,sp:.75,zc:.3+r()*.4,zw:.18,hits:0,miss:0,anim:0})}
  if(m.type==='hold'){Object.assign(MG,{pos:.5,vel:0,hold:false,prog:0,wind:0,crashT:0})}
  if(m.type==='tune'){Object.assign(MG,{d:r()<.5?.1:.9,tv:.3+r()*.4,lock:0,drag:false,lx:0,beepT:0})}
  if(m.type==='simon'){Object.assign(MG,{seq:[],len:3,phase:'show',i:0,st:.6,lit:-1,litT:0});for(let i=0;i<5;i++)MG.seq.push(r()*4|0)}
  if(m.type==='sequence'){MG.code=m.code;MG.i=0;const ex='A0ZET1'.split('');MG.keys=[...m.code.split(''),...ex].sort(()=>r()-.5)}
}
function closeMini(){miniOpen=false;$('mini').hidden=true;if(MG)MG.hold=false;MG=null;cv.focus()}
$('mLeave').onclick=closeMini;
function miniWin(){if(!MG||MG.done)return;MG.done=true;const y=MG.y;setTimeout(()=>{closeMini();succeedMission(y)},650);MG.flash=.6;MG.flashC='#86e09a'}
function miniBad(msg){if(!MG)return;MG.flash=.4;MG.flashC='#ff4f45';if(msg){MG.msg=msg;MG.msgT=1.6}SFX.bad()}
function miniAct(down){
  if(!MG||MG.done)return;
  if(MG.type==='hold'){MG.hold=down;return}
  if(MG.type!=='timing'||!down)return;
  MG.anim=.25;const ok=Math.abs(MG.p-MG.zc)<MG.zw/2;
  if(ok){MG.hits++;SFX.hit();beep(600+MG.hits*200,.1,'triangle',.07);MG.zw*=.8;MG.sp*=1.15;MG.zc=.15+Math.random()*.7;MG.flash=.2;MG.flashC='#ffd24a';if(MG.hits>=3)miniWin()}
  else{MG.miss++;if(MG.skin==='reel'){MG.hits=0;MG.zw=.18;MG.sp=.75;miniBad('Out of sync! Back to zero.')}
    else if(MG.skin==='hammer'){if(MG.miss>=3){MG.hits=0;MG.miss=0;MG.zw=.18;MG.sp=.75;miniBad('Three misses. Start over.')}else miniBad()}
    else{MG.hits=Math.max(0,MG.hits-1);miniBad('Burn outside the window.')}}
}
function miniPoint(px,py,type){
  if(!MG||MG.done)return;const r=mc.getBoundingClientRect(),x=(px-r.left)/r.width*MW,y=(py-r.top)/r.height*MH;
  if(MG.type==='targets'&&type==='down'){const t=MG.tg.find(t=>!t.got&&Math.hypot(t.x-x,t.y-y)<(MG.skin==='moons'?18:30));
    if(t){t.got=true;SFX.pick();if(MG.tg.every(t=>t.got))miniWin()}else{miniBad(MG.skin==='moons'?"That's a star. -3 s":"That's a leaf. -3 s");G.timers[MG.y]-=3}}
  if(MG.type==='tune'){if(type==='down'){MG.drag=true;MG.lx=x}else if(type==='move'&&MG.drag){MG.d=clamp(MG.d+(x-MG.lx)/700,0,1);MG.lx=x}else if(type==='up')MG.drag=false}
  if(MG.type==='simon'&&type==='down'&&MG.phase==='input'){const pad=simonPad(x,y);if(pad>=0)simonPress(pad)}
  if(MG.type==='sequence'&&type==='down'){const k=seqKeyAt(x,y);if(k)seqType(k)}
}
function miniKey(k,down){
  if(!MG)return false;
  if((k===' '||k==='enter')&&(MG.type==='timing'||MG.type==='hold')){miniAct(down);return true}
  if(!down)return false;
  if(MG.type==='simon'&&/^[1-4]$/.test(k)&&MG.phase==='input'){simonPress(+k-1);return true}
  if(MG.type==='sequence'&&/^[a-z0-9]$/.test(k)){seqType(k.toUpperCase());return true}
  return false;
}
const SIMC={board:['#ff3ac8','#3ae8ff','#ffe83a','#8a3aff'],archive:['#ffd27a','#ffb050','#ffe8b0','#ff9a40'],ochre:['#c8421a','#e8a038','#8a3a1a','#f0d8a0'],mosaic:['#c83a3a','#3a6ab8','#e8c84a','#4a9a5a']};
function simonPad(x,y){for(let i=0;i<4;i++){const px=130+i*150;if(x>px-60&&x<px+60&&y>150&&y<390)return i}return-1}
function simonPress(i){MG.lit=i;MG.litT=.25;beep([392,494,587,698][i],.22,'triangle',.08);
  if(MG.seq[MG.i]===i){MG.i++;if(MG.i>=MG.len){if(MG.len>=5)miniWin();else{MG.len++;MG.phase='show';MG.i=0;MG.st=.9}}}
  else{miniBad('Wrong pattern. Watch again.');MG.phase='show';MG.i=0;MG.st=1.1}}
function seqKeyAt(x,y){const n=MG.keys.length,cols=6,kw=110,kh=54;for(let i=0;i<n;i++){const cx=70+(i%cols)*kw+kw/2,cy=330+Math.floor(i/cols)*(kh+10)+kh/2;if(Math.abs(x-cx)<kw/2-5&&Math.abs(y-cy)<kh/2)return MG.keys[i]}return null}
function seqType(c){if(MG.done)return;if(MG.code[MG.i]===c){MG.i++;SFX.tick();if(MG.i>=MG.code.length)miniWin()}else{MG.i=0;miniBad('Typo. The line was cleared.')}}

function updateMini(dt){
  const m=MG;m.t+=dt;m.flash=Math.max(0,m.flash-dt);m.msgT-=dt;
  if(m.type==='timing'&&!m.done){m.p+=m.dir*m.sp*dt;if(m.p>1){m.p=1;m.dir=-1}if(m.p<0){m.p=0;m.dir=1}m.anim=Math.max(0,m.anim-dt)}
  if(m.type==='hold'&&!m.done){if(m.crashT>0){m.crashT-=dt}else{m.wind+=(Math.random()-.5)*dt*3;m.wind*=.98;m.vel+=((m.hold?1.5:-1.1)+m.wind)*dt;m.vel*=.985;m.pos+=m.vel*dt;
    const bc=.55+Math.sin(m.t*.6)*.15,bh=.14;m.bc=bc;m.bh=bh;if(Math.abs(m.pos-bc)<bh)m.prog+=dt;else m.prog=Math.max(0,m.prog-dt*.5);
    if(m.pos<0||m.pos>1){m.crashT=1.2;m.pos=.5;m.vel=0;m.prog=0;miniBad(ERA[m.y].mission.mini.crash)}if(m.prog>=6)miniWin()}}
  if(m.type==='tune'&&!m.done){let v=0;if(keys.has('arrowleft')||keys.has('a'))v--;if(keys.has('arrowright')||keys.has('d'))v++;m.d=clamp(m.d+v*.35*dt,0,1);m.cl=1-Math.min(1,Math.abs(m.d-m.tv)*5);
    if(m.cl>.9)m.lock+=dt;else m.lock=Math.max(0,m.lock-dt*.8);m.beepT-=dt;if(m.cl>.5&&m.beepT<=0){beep(880,.06,'sine',.06*m.cl);m.beepT=.5}if(m.lock>=2.5)miniWin()}
  if(m.type==='simon'&&m.phase==='show'){m.st-=dt;if(m.st<=0){if(m.i<m.len){m.lit=m.seq[m.i];m.litT=.42;beep([392,494,587,698][m.lit],.3,'triangle',.07);m.i++;m.st=.6}else{m.phase='input';m.i=0}}}
  if(m.litT>0){m.litT-=dt;if(m.litT<=0)m.lit=-1}
  drawMini();
  const t=G.timers[m.y];$('mClock').textContent=fmt(t);$('mClock').className='clock'+(t<15?' low':'');
}
function drawMini(){
  const m=MG,o=mx,s=mc.width/MW;o.setTransform(s,0,0,s,0,0);o.clearRect(0,0,MW,MH);
  ({targets:dTargets,timing:dTiming,hold:dHold,tune:dTune,simon:dSimon,sequence:dSeq})[m.type](o,m);
  if(m.flash>0){o.fillStyle=m.flashC;o.globalAlpha=m.flash*.5;o.fillRect(0,0,MW,MH);o.globalAlpha=1}
  if(m.msgT>0){o.font='600 22px "Chakra Petch",sans-serif';o.textAlign='center';o.fillStyle='#000a';o.fillRect(0,MH-60,MW,44);o.fillStyle='#ffd8d0';o.fillText(m.msg,MW/2,MH-31)}
  if(m.done){o.font='400 64px "Nixie One",monospace';o.textAlign='center';o.fillStyle='#86e09a';o.shadowColor='#3fbf5a';o.shadowBlur=24;o.fillText('DONE!',MW/2,MH/2+20);o.shadowBlur=0}
}
function glowText(o,t,x,y,c,f){o.font=f;o.textAlign='center';o.fillStyle=c;o.shadowColor=c;o.shadowBlur=14;o.fillText(t,x,y);o.shadowBlur=0}
function dTargets(o,m){
  if(m.skin==='moons'){o.fillStyle='#03040c';o.fillRect(0,0,MW,MH);o.save();o.beginPath();o.arc(400,250,235,0,7);o.clip();const g=o.createRadialGradient(400,250,10,400,250,240);g.addColorStop(0,'#141a38');g.addColorStop(1,'#04050e');o.fillStyle=g;o.fillRect(0,0,MW,MH);
    m.dec.forEach(d=>{o.fillStyle='#fff6e0';o.shadowColor='#fff';o.shadowBlur=6;o.beginPath();o.arc(d.x,d.y,d.r*(.8+.2*Math.sin(m.t*3+d.x)),0,7);o.fill()});o.shadowBlur=0;
    const j=o.createRadialGradient(385,235,4,400,250,48);j.addColorStop(0,'#fff0d0');j.addColorStop(.6,'#e8b878');j.addColorStop(1,'#8a5a30');o.fillStyle=j;o.beginPath();o.arc(400,250,46,0,7);o.fill();
    o.fillStyle='rgba(140,80,40,.45)';for(const y of[-22,-8,10,24])o.fillRect(356,250+y,88,5);
    m.tg.forEach(t=>{o.fillStyle='#fffaf0';o.shadowColor='#fff';o.shadowBlur=10;o.beginPath();o.arc(t.x,t.y,t.r,0,7);o.fill();o.shadowBlur=0;if(t.got){o.strokeStyle='#86e09a';o.lineWidth=3;o.beginPath();o.arc(t.x,t.y,16,0,7);o.stroke()}});
    o.restore();o.strokeStyle='#6b5a3c';o.lineWidth=14;o.beginPath();o.arc(400,250,240,0,7);o.stroke();o.strokeStyle='#c9a24a';o.lineWidth=2;o.beginPath();o.arc(400,250,232,0,7);o.stroke();
    glowText(o,`${m.tg.filter(t=>t.got).length}/4 moons`,90,470,'#ffc27a','600 22px "Chakra Petch"');return}
  const g=o.createLinearGradient(0,0,0,MH);g.addColorStop(0,'#bdf0dc');g.addColorStop(1,'#4a9a7a');o.fillStyle=g;o.fillRect(0,0,MW,MH);
  m.dec.forEach(d=>{d.a+=.01*d.s;o.save();o.translate((d.x+m.t*12*d.s)%840-20,d.y+Math.sin(m.t+d.a)*8);o.rotate(d.a);o.fillStyle='#3a8a4a';o.beginPath();o.ellipse(0,0,d.r,d.r*.45,0,0,7);o.fill();o.strokeStyle='#2a6a3a';o.beginPath();o.moveTo(-d.r,0);o.lineTo(d.r,0);o.stroke();o.restore()});
  m.tg.forEach(t=>{if(t.got)return;t.x=t.cx+Math.sin(m.t*1.1+t.ph)*t.ax;t.y=t.cy+Math.sin(m.t*1.7+t.ph)*t.ay;o.fillStyle='#e8f0e8';o.fillRect(t.x-14,t.y-4,28,8);o.fillStyle='#8aa';for(const s of[-1,1]){o.beginPath();o.ellipse(t.x+s*16,t.y-6,10,3,0,0,7);o.fill()}
    const on=Math.sin(m.t*8+t.ph)>0;o.fillStyle=on?'#5affb8':'#1a5a3a';o.shadowColor='#5affb8';o.shadowBlur=on?16:0;o.beginPath();o.arc(t.x,t.y+6,4,0,7);o.fill();o.shadowBlur=0});
  glowText(o,`${m.tg.filter(t=>t.got).length}/4 drones`,90,470,'#ffffff','600 22px "Chakra Petch"');
}
function dTiming(o,m){
  const sk=m.skin;
  if(sk==='hammer'){const g=o.createLinearGradient(0,0,0,MH);g.addColorStop(0,'#c8c0a8');g.addColorStop(1,'#8a7458');o.fillStyle=g;o.fillRect(0,0,MW,MH);
    o.fillStyle='#4a3424';for(let x=-20;x<MW;x+=70)o.fillRect(x,300,40,60);o.fillStyle='#5a5a5a';o.fillRect(0,300,MW,10);o.fillRect(0,345,MW,10);
    const dep=m.hits/3;o.fillStyle='#ffd24a';o.shadowColor='#ffb020';o.shadowBlur=18;o.fillRect(392,230+dep*60,16,80-dep*60);o.beginPath();o.moveTo(386,230+dep*60);o.lineTo(414,230+dep*60);o.lineTo(400,218+dep*60);o.fill();o.shadowBlur=0;
    o.save();o.translate(470,130);o.rotate(-.9+(m.anim>0?m.anim*4:0)-(m.anim>0?1:0));o.fillStyle='#6a4a2a';o.fillRect(-6,0,12,150);o.fillStyle='#3a3a3a';o.fillRect(-36,-20,72,30);o.restore()}
  else if(sk==='reel'){o.fillStyle='#0a0a0a';o.fillRect(0,0,MW,MH);for(let i=0;i<5;i++){const x=((i*190-m.t*160)%950+950)%950-150;o.fillStyle='#1a1a1a';o.fillRect(x,40,170,230);o.fillStyle='#d8d8d8';o.fillRect(x+15,60,140,190);
      o.fillStyle='#555';o.beginPath();o.arc(x+85,140,30,0,7);o.fill();o.fillStyle='#222';o.fillRect(x+70,170+Math.abs(Math.sin(m.t*8+i))*14,30,6);for(let k=0;k<9;k++){o.fillStyle='#0a0a0a';o.fillRect(x+4,46+k*25,8,12);o.fillRect(x+158,46+k*25,8,12)}}
    o.strokeStyle='#c8c8c8';o.lineWidth=2;o.beginPath();for(let x=0;x<MW;x+=4)o.lineTo(x,330+Math.sin(x*.08+m.t*14)*(10+20*Math.abs(Math.sin(x*.01+m.t))));o.stroke()}
  else if(sk==='dig'){const g=o.createLinearGradient(0,0,0,MH);g.addColorStop(0,'#c8482a');g.addColorStop(.55,'#f0b060');g.addColorStop(1,'#f8dca0');o.fillStyle=g;o.fillRect(0,0,MW,MH);
    o.fillStyle='#fff0a0';o.shadowColor='#ff6a1a';o.shadowBlur=40;o.beginPath();o.arc(610,70+Math.sin(m.t*2)*6,26,0,7);o.fill();o.shadowBlur=0;o.strokeStyle='#ffd080';o.lineWidth=10;o.beginPath();o.moveTo(610,70);o.lineTo(780,0);o.stroke();
    o.fillStyle='#4a3a22';o.fillRect(0,300,MW,200);o.fillStyle='#3a2c1a';for(let x=0;x<MW;x+=60)o.fillRect(x+(x/60%2)*20,320+(x/60%3)*30,26,8);
    const dep=m.hits/3;o.fillStyle='#120a04';o.beginPath();o.ellipse(400,305,34+dep*60,10+dep*18,0,0,7);o.fill();
    o.save();o.translate(470,220);o.rotate(.2+(m.anim>0?m.anim*3:0));o.fillStyle='#e8dcc0';o.beginPath();o.moveTo(0,0);o.lineTo(-14,60);o.lineTo(0,50);o.lineTo(14,60);o.closePath();o.fill();o.restore()}
  else if(sk==='stone'){const g=o.createLinearGradient(0,0,0,MH);g.addColorStop(0,'#78b8e8');g.addColorStop(1,'#fff0cc');o.fillStyle=g;o.fillRect(0,0,MW,MH);o.fillStyle='#e8d098';o.fillRect(0,360,MW,140);
    o.fillStyle='#d8b878';o.beginPath();o.moveTo(150,360);o.lineTo(400,205);o.lineTo(650,360);o.closePath();o.fill();o.strokeStyle='#b89858';o.lineWidth=2;for(let i=1;i<6;i++){o.beginPath();o.moveTo(150+i*20,360-i*25);o.lineTo(650-i*20,360-i*25);o.stroke()}
    const cy=160-(1-m.hits/3)*130;o.strokeStyle='#6a4a2a';o.lineWidth=3;o.beginPath();o.moveTo(400,0);o.lineTo(400,cy);o.stroke();o.fillStyle='#e8b830';o.shadowColor='#ffd24a';o.shadowBlur=18;o.beginPath();o.moveTo(400,cy+10);o.lineTo(430,cy+46);o.lineTo(370,cy+46);o.closePath();o.fill();o.shadowBlur=0}
  else{o.fillStyle='#030312';o.fillRect(0,0,MW,MH);for(let i=0;i<70;i++){o.fillStyle='#fff8';o.fillRect((i*137)%MW,(i*89)%MH,2,2)}const dist=1-m.hits/3;
    o.strokeStyle='#9a9ab8';o.lineWidth=16;o.beginPath();o.ellipse(400,170,260+(1-dist)*40,60,0,Math.PI,0);o.stroke();o.fillStyle='#ff9ad8';o.fillRect(392,150,16,30);
    const sx=400,sy=200+dist*100,sc=.5+(1-dist)*.5;o.save();o.translate(sx,sy);o.scale(sc,sc);o.fillStyle='#f0f0f8';o.beginPath();o.moveTo(0,-60);o.lineTo(30,30);o.lineTo(-30,30);o.fill();o.fillStyle='#9ae8ff';o.shadowColor='#9ae8ff';o.shadowBlur=20;o.fillRect(-10,30,20,m.anim>0?50:14);o.restore();o.shadowBlur=0}
  const bx=80,bw=640,by=420;o.fillStyle='#0c0a0e';o.fillRect(bx-4,by-4,bw+8,40);o.fillStyle='#2a241e';o.fillRect(bx,by,bw,32);
  o.fillStyle='#ffd24a';o.shadowColor='#ffb020';o.shadowBlur=14;o.fillRect(bx+(m.zc-m.zw/2)*bw,by,m.zw*bw,32);o.shadowBlur=0;
  o.fillStyle='#fff';o.fillRect(bx+m.p*bw-3,by-10,6,52);
  for(let i=0;i<3;i++){o.fillStyle=i<m.hits?'#86e09a':'#3a322a';o.beginPath();o.arc(MW-130+i*34,40,11,0,7);o.fill()}
  if(m.skin==='hammer')for(let i=0;i<3;i++){o.fillStyle=i<m.miss?'#ff4f45':'#3a322a';o.fillRect(40+i*26,30,18,18)}
}
function dHold(o,m){
  const core=m.skin==='core',bc=m.bc||.55,bh=m.bh||.14,Y=v=>440-v*380;
  if(!core){const g=o.createLinearGradient(0,0,0,MH);g.addColorStop(0,'#9ec4dc');g.addColorStop(1,'#f0e4c8');o.fillStyle=g;o.fillRect(0,0,MW,MH);
    o.fillStyle='#e0cfa0';o.beginPath();o.moveTo(0,MH);for(let x=0;x<=MW;x+=20)o.lineTo(x,450+Math.sin((x+m.t*120)*.012)*16);o.lineTo(MW,MH);o.fill();
    o.fillStyle='rgba(80,200,110,.22)';o.fillRect(0,Y(bc+bh),MW,(bh*2)*380);o.strokeStyle='rgba(60,170,90,.7)';o.setLineDash([10,8]);o.strokeRect(-2,Y(bc+bh),MW+4,bh*2*380);o.setLineDash([]);
    const py=Y(m.pos);o.save();o.translate(300,py);o.rotate(-m.vel*.3);o.fillStyle='#e8dcc0';o.fillRect(-60,-14,120,5);o.fillRect(-60,10,120,5);o.fillStyle='#6a4a2a';for(const x of[-50,-20,20,50])o.fillRect(x,-14,3,28);o.fillRect(-70,-2,40,3);o.fillStyle='#3a2a1a';o.fillRect(-6,-4,14,8);
    o.fillStyle='#555';o.fillRect(58,-14+Math.sin(m.t*60)*10,4,28);o.restore();
    o.strokeStyle='rgba(255,255,255,.6)';for(let i=0;i<6;i++){const y=((i*90+m.t*40)%500);o.beginPath();o.moveTo(((i*170-m.t*300)%900+900)%900-50,y);o.lineTo(((i*170-m.t*300)%900+900)%900+10,y);o.stroke()}}
  else{o.fillStyle='#0a0402';o.fillRect(0,0,MW,MH);o.fillStyle='rgba(255,210,74,.18)';o.fillRect(300,Y(bc+bh),200,bh*2*380);o.strokeStyle='#ffd24a';o.lineWidth=2;o.strokeRect(300,Y(bc+bh),200,bh*2*380);
    o.strokeStyle='#5a3a1a';o.lineWidth=4;o.strokeRect(340,60,120,380);const h=m.pos*380,gr=o.createLinearGradient(0,440,0,60);gr.addColorStop(0,'#ff8a2a');gr.addColorStop(.6,'#ffd080');gr.addColorStop(1,'#ffffff');
    o.fillStyle=gr;o.shadowColor='#ff8a2a';o.shadowBlur=30;o.fillRect(344,440-h,112,h);o.shadowBlur=0;for(let i=0;i<8;i++){o.strokeStyle=`rgba(255,200,120,${.2+.2*Math.sin(m.t*5+i)})`;o.beginPath();o.arc(400,440-h,30+i*14+Math.sin(m.t*3+i)*6,0,7);o.stroke()}}
  o.fillStyle='#0c0a0e';o.fillRect(40,20,220,22);o.fillStyle=core?'#ffd24a':'#86e09a';o.fillRect(42,22,216*Math.min(1,m.prog/6),18);glowText(o,`${Math.min(6,m.prog).toFixed(1)} / 6 s`,150,70,'#fff6e0','600 20px "Chakra Petch"');
}
function dTune(o,m){
  const cl=m.cl||0,sk=m.skin;
  if(sk==='tv'){o.fillStyle='#3a2a1a';o.fillRect(0,0,MW,MH);o.fillStyle='#1a1410';o.fillRect(140,40,520,360);const ix=170,iy=60,iw=460,ih=320;
    const id=o.createImageData(230,160);for(let i=0;i<id.data.length;i+=4){const n=Math.random()*255*(1-cl)+(cl*40);id.data[i]=id.data[i+1]=id.data[i+2]=n;id.data[i+3]=255}
    const tc=document.createElement('canvas');tc.width=230;tc.height=160;tc.getContext('2d').putImageData(id,0,0);o.imageSmoothingEnabled=false;o.drawImage(tc,ix,iy,iw,ih);o.imageSmoothingEnabled=true;
    o.globalAlpha=cl;o.fillStyle='#222';o.fillRect(ix,iy+ih*.7,iw,ih*.3);o.fillStyle='#ddd';o.beginPath();o.arc(ix+iw*.8,iy+70,30,0,7);o.fill();o.fillStyle='#ccc';o.fillRect(ix+180,iy+ih*.55,70,40);o.fillRect(ix+170,iy+ih*.67,90,8);
    o.fillStyle='#eee';o.beginPath();o.arc(ix+300,iy+ih*.58,10,0,7);o.fill();o.fillRect(ix+293,iy+ih*.6,14,26);o.globalAlpha=1;o.strokeStyle='#5a4030';o.lineWidth=18;o.strokeRect(ix-9,iy-9,iw+18,ih+18);
    o.save();o.translate(400,440);o.rotate((m.d-.5)*2);o.strokeStyle='#bbb';o.lineWidth=4;o.beginPath();o.moveTo(0,0);o.lineTo(0,-50);for(let k=0;k<4;k++){o.moveTo(-40+k*8,-20-k*9);o.lineTo(40-k*8,-20-k*9)}o.stroke();o.restore()}
  else{o.fillStyle=sk==='radio'?'#2a1e14':'#05040f';o.fillRect(0,0,MW,MH);
    o.strokeStyle=sk==='radio'?'#7fd88f':'#aa9aff';o.shadowColor=o.strokeStyle;o.shadowBlur=10;o.lineWidth=2.5;o.beginPath();for(let x=0;x<MW;x+=3){const clean=Math.sin(x*.05+m.t*(sk==='radio'?10:6))*60*(sk==='radio'?(Math.sin(m.t*6.28*2)>0?1:.1):1);o.lineTo(x,200+clean*cl+(Math.random()-.5)*140*(1-cl))}o.stroke();o.shadowBlur=0;
    if(sk==='radio'){const g=o.createLinearGradient(0,330,0,450);g.addColorStop(0,'#e8d8a8');g.addColorStop(1,'#c8b078');o.fillStyle=g;o.fillRect(60,340,680,90);o.fillStyle='#3a2a1a';o.font='600 16px "Chakra Petch"';o.textAlign='center';
      for(let i=0;i<=10;i++){const x=80+i*64;o.fillRect(x,345,2,i%2?14:22);if(i%2===0)o.fillText(String(540+i*106),x,395)}o.fillStyle='#c8382c';o.fillRect(80+m.d*640-2,340,4,90)}
    else{o.strokeStyle='#3a3070';o.lineWidth=1;for(let x=0;x<MW;x+=40){o.beginPath();o.moveTo(x,0);o.lineTo(x,400);o.stroke()}o.fillStyle='#14102a';o.fillRect(60,360,680,50);o.fillStyle='#aa9aff';o.fillRect(60+m.d*680-4,355,8,60)}}
  o.fillStyle='#0c0a0e';o.fillRect(560,20,220,22);o.fillStyle='#86e09a';o.fillRect(562,22,216*Math.min(1,m.lock/2.5),18);glowText(o,cl>.9?'LOCKED':cl>.5?'CLOSE...':'SEARCHING',670,70,cl>.9?'#86e09a':'#ffc27a','600 20px "Chakra Petch"');
}
function dSimon(o,m){
  const C=SIMC[m.skin]||SIMC.board;o.fillStyle=m.skin==='board'?'#0a0614':'#f4ecd8';o.fillRect(0,0,MW,MH);
  for(let i=0;i<4;i++){const x=130+i*150,on=m.lit===i;o.fillStyle=m.skin==='board'?'#1a1428':'#e0d0b0';o.fillRect(x-60,150,120,240);
    o.fillStyle=C[i];o.globalAlpha=on?1:.25;o.shadowColor=C[i];o.shadowBlur=on?40:0;
    if(m.skin==='board'){o.fillRect(x-40,170,80,200);o.globalAlpha=1;o.fillStyle='#ddd';o.fillRect(x-30,260+(on?-60:0),60,16)}else{o.beginPath();o.arc(x,270,52,0,7);o.fill();o.globalAlpha=1;o.strokeStyle='#8a6a3a';o.lineWidth=4;o.beginPath();o.arc(x,270,56,0,7);o.stroke()}
    o.globalAlpha=1;o.shadowBlur=0;o.fillStyle=m.skin==='board'?'#fff':'#3a2a1a';o.font='700 22px "Chakra Petch"';o.textAlign='center';o.fillText(String(i+1),x,425)}
  glowText(o,m.phase==='show'?'WATCH THE PATTERN':`YOUR TURN · ${m.i}/${m.len}`,400,80,m.skin==='board'?'#ff9ae0':'#a8701a','700 28px "Chakra Petch"');
  for(let i=0;i<3;i++){o.fillStyle=i<m.len-3+(m.done?1:0)?'#86e09a':'#555';o.beginPath();o.arc(370+i*30,110,8,0,7);o.fill()}
}
function dSeq(o,m){
  o.fillStyle='#061008';o.fillRect(0,0,MW,MH);o.font='400 26px "Nixie One",monospace';o.textAlign='left';
  const c='#7fff9a';o.fillStyle=c;o.shadowColor=c;o.shadowBlur=8;o.fillText('CENTRAL BANK · SYSTEM 1999',40,50);o.fillText(`23:59:${String(Math.max(0,59-Math.floor(m.t))).padStart(2,'0')}`,600,50);
  o.fillText('> patch required:  '+m.code,40,110);o.fillText('C:\\> '+m.code.slice(0,m.i)+(Math.sin(m.t*8)>0?'█':''),40,170);o.shadowBlur=0;
  const n=m.keys.length,kw=110,kh=54;for(let i=0;i<n;i++){const x=70+(i%6)*kw,y=330+Math.floor(i/6)*(kh+10);o.fillStyle='#d8ccab';o.fillRect(x+5,y,kw-10,kh);o.fillStyle='#6f6650';o.fillRect(x+5,y+kh-6,kw-10,6);o.fillStyle='#2a241e';o.font='700 26px "Chakra Petch"';o.textAlign='center';o.fillText(m.keys[i],x+kw/2,y+36)}
  o.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<MH;y+=4)o.fillRect(0,y,MW,2);
}
const actBtn=$('mAct');
actBtn.addEventListener('pointerdown',e=>{e.preventDefault();miniAct(true)});
['pointerup','pointerleave','pointercancel'].forEach(ev=>actBtn.addEventListener(ev,()=>{if(MG&&MG.type==='hold')miniAct(false)}));
mc.addEventListener('pointerdown',e=>{mc.setPointerCapture(e.pointerId);miniPoint(e.clientX,e.clientY,'down')});
mc.addEventListener('pointermove',e=>miniPoint(e.clientX,e.clientY,'move'));
mc.addEventListener('pointerup',e=>miniPoint(e.clientX,e.clientY,'up'));

/* ================= end + ranking ================= */
function showEnd(){
  $('end').hidden=false;const o=G.over;
  $('eTitle').textContent=o.lord?'TIME IS YOURS':o.sealed?'YOU FELL AT THE THRONE':'TRAPPED IN TIME';$('eTitle').className='result'+(o.win?' win':'');
  $('eCurio').textContent=(o.lord?`The throne is yours, and your name now waits for the next challenger. Save your score, then roam time as you please. Final year: ${fy(o.year)}.`:o.sealed?`You sealed the whole timeline, then fell at the Throne. Final year: ${fy(o.year)} · ${ERA[o.year].name}.`:`You were trapped in ${fy(o.year)} · ${ERA[o.year].name}, and he found you there.`)
    +` Hunters defeated: ${G.hunters}. Citizens erased: ${G.kills}. Relics: ${relicCount()}/14.`;
  $('eScore').textContent=G.score;$('eMiss').textContent=G.missions;$('eRep').textContent=G.repairsDone;
  $('saveBtn').disabled=false;$('pname').disabled=false;$('saveBtn').textContent='SAVE';try{$('pname').value=localStorage.getItem('tl-name')||''}catch(e){}
  $('roam').hidden=!o.lord;renderBoard();
}
$('again').onclick=()=>{$('end').hidden=true;newGame()};
$('roam').onclick=roamFree;
let db=null,boardRows=[],boardShared=false,myId=null;
function localScores(){try{return JSON.parse(localStorage.getItem('tl-scores')||'[]')}catch(e){return[]}}
function renderBoard(){
  const rows=boardShared?boardRows:localScores().sort((a,b)=>b.score-a.score).slice(0,15);
  const html=rows.length?`<thead><tr><th>#</th><th>NAME</th><th>SCORE</th><th>ENDED IN</th></tr></thead><tbody>`+rows.map((r,i)=>`<tr class="${r._id&&r._id===myId?'me':''}${r.lord?' lord':''}"><td>${i+1}</td><td></td><td>${Number(r.score)|0}</td><td>${fy(Number(r.year)||0)}</td></tr>`).join('')+'</tbody>'
    :'<tbody><tr><td style="color:#c9a24a">No scores yet. Be the first chrononaut.</td></tr></tbody>';
  ['board2'].forEach(id=>{const t=$(id);t.innerHTML=html;if(rows.length)t.querySelectorAll('tbody tr').forEach((tr,i)=>tr.children[1].textContent=(rows[i].lord?'♛ ':'')+String(rows[i].name||'Anonymous').slice(0,16))});
  const note=boardShared?'Shared ranking · everyone who opens this game sees it.':'Scores saved on this device only.';$('note2').textContent=note;
}
(async()=>{
  renderBoard();
  try{db=window.claude&&window.claude.use?await window.claude.use('db'):null}catch(e){db=null}
  if(!db)return;
  const timer=setTimeout(()=>{if(!boardShared)$('note2').textContent='Shared ranking is not reachable right now.'},10000);
  db.collection('scores').orderBy('score','desc').limit(15).onSnapshot(snap=>{clearTimeout(timer);boardShared=true;boardRows=snap.docs.map(d=>({...d.data(),_id:d.id}));renderBoard()},()=>{clearTimeout(timer);boardShared=false;renderBoard()});
})();
$('saveForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!G||!G.over)return;const name=($('pname').value.trim()||'Anonymous').slice(0,16);
  const row={name,score:G.score,missions:G.missions,repairs:G.repairsDone,year:G.over.year,win:!!G.over.win,lord:!!G.over.lord,at:Date.now()};
  $('saveBtn').disabled=true;$('pname').disabled=true;let saved=false;
  if(db&&boardShared){try{const ref=db.collection('scores').doc();myId=ref.id;await ref.set(row);saved=true}catch(err){myId=null}}
  if(!saved){try{const l=localScores();l.push(row);localStorage.setItem('tl-scores',JSON.stringify(l))}catch(err){}if(boardShared)toast('Saved on this device only: the shared ranking is read-only for you.',true)}
  try{localStorage.setItem('tl-name',name)}catch(err){}
  $('saveBtn').textContent='SAVED';renderBoard();
});

/* ================= input ================= */
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();audio();
  if(e.target&&e.target.tagName==='INPUT')return;
  if(miniOpen){if(k==='escape'){closeMini();return}if(miniKey(k,true)){e.preventDefault();return}keys.add(k);return}
  if(k==='escape'){if(invOpen)closeInv();if(panelOpen)closePanel();if(shopOpen){shopOpen=false;$('shop').hidden=true}return}
  if(k==='i'&&!e.repeat&&G&&mode==='play'){if(invOpen)closeInv();else if(!busy())openInv();return}
  if(briefOpen&&(k==='enter'||k===' ')){e.preventDefault();$('bGo').click();return}
  if(busy())return;
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
  if(e.repeat)return;keys.add(k);
  if(k==='j')playerAttack();else if(k==='k'||k===' '||k==='shift')playerDash();else if(k==='q')castSpell(0);else if(k==='e'){if(interactable())interact();else castSpell(1)}else if(k==='enter')interact();
  if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){ch.target=null;ch.openOnArrive=null}
});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys.delete(k);if(miniOpen)miniKey(k,false)});
addEventListener('blur',()=>keys.clear());
const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),ndc=new THREE.Vector2(),hitP=new THREE.Vector3();
const _box=new THREE.Box3();
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{
  audio();if(busy())return;if(e.button===2){playerAttack();return}
  ndc.set(e.clientX/W*2-1,-(e.clientY/H)*2+1);ray.setFromCamera(ndc,camera);
  const hitObj=(o)=>{if(!o)return false;_box.setFromObject(o);return ray.ray.intersectsBox(_box)};
  if(WD.machine&&hitObj(WD.machine)){ch.target={x:WD.mx,z:ZMIN+.4};ch.openOnArrive='machine';return}
  if(WD.fountain&&hitObj(WD.fountain.g)){ch.target={x:WD.fountain.x,z:ZMIN+.4};ch.openOnArrive='fountain';return}
  if(WD.landGroup&&(G.cur===NX||(missionOpen(G.cur)&&ch.carry))&&hitObj(WD.landGroup)){ch.target={x:WD.land.x,z:ZMIN+.4};ch.openOnArrive=G.cur===NX?'shop':'land';return}
  if(ray.ray.intersectPlane(plane,hitP)){ch.target={x:hitP.x,z:clamp(hitP.z,ZMIN,ZMAX)};ch.openOnArrive=null;
    if(hitP.z<ZMIN+.5&&Math.abs(hitP.x-WD.mx)<2.5){ch.target.x=WD.mx;ch.openOnArrive='machine'}
    burst(ch.target.x,.1,ch.target.z,'#ffd27a',6,1,.25,0,0)}
});
const hold=(id,fn)=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();audio();fn()});
hold('bHit',playerAttack);hold('bDash',playerDash);hold('bUse',interact);hold('sp0',()=>castSpell(0));hold('sp1',()=>castSpell(1));
$('mute').onclick=()=>{setMuted(!muted);if(!muted&&G)setAmbient(G.cur)};
$('start').onclick=()=>{audio();DU.on=false;DU.solo=false;DU.hunter=false;newGame()};
$('soloHunter').onclick=()=>soloStart();

/* ================= main update ================= */
function updatePlayer(dt){
  let vx=0,vz=0;
  if(keys.has('arrowleft')||keys.has('a'))vx--;if(keys.has('arrowright')||keys.has('d'))vx++;if(keys.has('arrowup')||keys.has('w'))vz--;if(keys.has('arrowdown')||keys.has('s'))vz++;
  if(!vx&&!vz&&ch.target){const dx=ch.target.x-ch.x,dz=ch.target.z-ch.z,d=Math.hypot(dx,dz);if(d<.15)ch.target=null;else{vx=dx/d;vz=dz/d;if(d<.4){vx*=d/.4;vz*=d/.4}}}
  const l=Math.hypot(vx,vz);ch.moving=l>.01;
  const sp=5.2*ch.spd*(MAGIC.haste>0?1.6:1);
  if(ch.dashT>0){ch.dashT-=dt;ch.x+=ch.dashX*18*dt;ch.z+=ch.dashZ*18*dt;if(Math.random()<.8)burst(ch.x,1,ch.z,'#6ad8e8',2,.5,.35,0,0)}
  else if(ch.moving){const k=l>1?1/l:1;ch.x+=vx*k*sp*dt;ch.z+=vz*k*sp*dt;ch.fx=vx/l;ch.fz=vz/l;ch.stepT-=dt;if(ch.stepT<=0){ch.stepT=.32;noise(.05,.02,500,300)}}
  if(ch.kbx||ch.kbz){ch.x+=ch.kbx*dt;ch.z+=ch.kbz*dt;const f=Math.pow(.01,dt);ch.kbx*=f;ch.kbz*=f;if(Math.hypot(ch.kbx,ch.kbz)<.2)ch.kbx=ch.kbz=0}
  ch.x=ch.x;ch.z=clamp(ch.z,ZMIN,ZMAX);
}
function updateGame(dt){
  updatePlayer(dt);checkPickups();updateCombat(dt);updateMagic(dt);
  const rp=activeRepair();
  if(G.boss&&!G.over){if(!G.boss.on){G.boss.t-=dt;if(G.boss.t<=0)spawnLord()}}
  else if(rp){rp.time-=dt;if(rp.time<=0)failRepair()}
  else if(missionOpen(G.cur)&&G.timers[G.cur]!=null&&!G.over){G.timers[G.cur]-=dt;if(G.timers[G.cur]<=0)failMission(G.cur)}
}
function updateCamera(dt){
  const asp=W/H,vf=THREE.MathUtils.degToRad(camera.fov),hf=2*Math.atan(Math.tan(vf/2)*asp);
  const want=asp<1?7.5:11;let dist=clamp(want/Math.tan(hf/2),15,34);
  const tx=mode==='play'||mode==='over'?ch.x:T*1.6;
  camX=lerp(camX,tx,1-Math.pow(.02,dt));
  const sx=(Math.random()-.5)*shk*.5,sy=(Math.random()-.5)*shk*.5;
  const lookZ=mode==='play'?clamp(ch.z,ZMIN,ZMAX)*.5:0;
  camera.position.set(camX+sx,dist*.4+1.8+sy,lookZ+dist*.92);camera.lookAt(camX,2.3,lookZ-2.2);
  if(WD&&WD.sunOff){sun.position.set(camX+WD.sunOff.x,WD.sunOff.y,WD.sunOff.z);sun.target.position.set(camX,0,0)}
  shk=Math.max(0,shk-dt*2.2);
}
let last=performance.now(),fpsEma=1/60,lowT=0;
function frame(now){
  requestAnimationFrame(frame);
  let dt=Math.min(.05,(now-last)/1000);last=now;fpsEma=lerp(fpsEma,dt,.05);
  if(fpsEma>1/38){lowT+=dt;if(lowT>3&&DPR>1){DPR=Math.max(1,DPR-.25);resize();lowT=0}}else lowT=0;
  T+=dt;GU.uTime.value=T;fxMat.uniforms.px.value=DPR;
  if(trav)updateTravel(dt);
  if(!trav&&WD){
    const live=!(invOpen||panelOpen||briefOpen||shopOpen||miniOpen);
    let gdt=dt;if(hitStop>0){hitStop-=dt;gdt=dt*.08}
    if(DU.on)duelTick(dt);
    if(mode==='play'&&G&&!G.over&&live)updateGame(gdt);
    else if(mode==='play'&&G&&miniOpen&&!G.over&&missionOpen(G.cur)){G.timers[G.cur]-=dt;if(G.timers[G.cur]<=0)failMission(G.cur)}
    if(ch.rig&&(mode==='play'||mode==='over')){ch.rig.g.position.set(ch.x,0,ch.z);faceTo(ch.rig,Math.atan2(ch.fx,ch.fz),dt,16);
      animRig(ch.rig,gdt,{moving:ch.moving&&live,speed:ch.spd*1.1,swing:Math.max(0,ch.swing),dash:ch.dashT,hurt:ch.hurtT});ch.rig.g.visible=!(ch.inv>0&&ch.inv<1.5&&Math.sin(T*40)>0&&!ch.dashT)}
    updateNpcs(gdt,live||mode!=='play');updateItems(dt);
    WD.anim.forEach(f=>f(T));WD.chunks.forEach(c=>c.anim.forEach(f=>f(T)));WD.clouds.forEach(c=>{c.position.x+=c.userData.drift*dt;if(c.position.x>200)c.position.x=-200});
    updateWeather(dt,T,camX);
    if(WD.cdSign&&G&&missionOpen(1999)&&G.cur===1999){const t=Math.max(0,G.timers[1999]|0);if(t!==WD.cdT){WD.cdT=t;const m=WD.cdSign.material;m.emissiveMap.dispose();m.emissiveMap=textTex(`23:${String(59-Math.min(59,Math.floor(t/60))).padStart(2,'0')}:${String(59-t%60).padStart(2,'0')}`,{color:'#ff3a3a',glowC:'#ff3a3a'});m.needsUpdate=true}}
    updateCamera(dt);updateWorldStream(dt);if(G&&mode==='play'){maybeWildGear(dt);cullGear()}
  }
  if(miniOpen&&MG)updateMini(dt);
  updateFx(dt);updateTrans(dt);
  redT=Math.max(0,redT-dt*1.4);GU.uRed.value=redT*.8+(G&&mode==='play'&&ch.hp<ch.maxHp*.25?.25+.1*Math.sin(T*6):0);
  if(!trav&&GU.uFlash.value>0&&GU.uFlash.value<.5)GU.uFlash.value=Math.max(0,GU.uFlash.value-dt*1.2);
  GU.uDesat.value=G&&G.boss&&!G.boss.on?.4:lerp(GU.uDesat.value,0,dt*2);
  if(mode==='play'||mode==='over'){updateLabels(dt);updateArrow();updateHUD()}else updateLabels(dt);
  composer.render(dt);
}

/* ================= boot ================= */
function boot(){initInv();initMagicUI();
  resize();
  const pool=[1985,2150,1927,1610,2400,2600,2088];const y=pool[(Math.random()*pool.length)|0];
  genWorld(y);camX=0;streamChunks(99);updateWorldStream(0);
  $('veil').hidden=true;window.__tlReady=true;$('title').hidden=false;setMuted(muted);
  requestAnimationFrame(t=>{last=t;frame(t)});
  document.fonts&&document.fonts.ready.then(()=>{if(WD&&WD.machine)setMachineYear(WD.year)});
}
boot();

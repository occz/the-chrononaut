/* ================= online duel: Chrononaut vs Time Hunter (2 players, WebSocket relay) ================= */
const DU={on:false,solo:false,kills:0,role:null,hunter:false,ws:null,room:'',host:false,started:false,over:false,seed:0,goal:5,peer:null,peerY:null,range:null,trail:[],sendT:0,pingI:0,tight:null,clue:null};
const DUEL_URL='https://the-chrononaut.causal-line.workers.dev/play.html';
const duelCan=()=>location.protocol.startsWith('http')&&!/claude|anthropic/i.test(location.hostname);
const duelSend=o=>{if(DU.ws&&DU.ws.readyState===1)try{DU.ws.send(JSON.stringify(o))}catch(e){}};
const duelMsg=(m)=>{const e=$('duelMsg');e.textContent=m||'';e.hidden=!m};
function duelReset(){if(DU.ws){try{DU.ws.onclose=null;DU.ws.close()}catch(e){}}clearInterval(DU.pingI);Object.assign(DU,{ws:null,room:'',host:false,started:false,role:null});$('duelMenu').hidden=false;$('duelWait').hidden=true;duelMsg('')}
function duelOpen(){
  duelReset();$('title').hidden=true;$('duel').hidden=false;
  if(!duelCan()){$('duelMenu').hidden=true;duelMsg('Online duels need the website version (this preview blocks connections). Play at '+DUEL_URL)}
}
function duelConnect(code,host,role){
  duelMsg('');DU.host=host;DU.role=role;DU.room=code;let url;
  try{url=`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws?room=${code}&h=${host?1:0}`;DU.ws=new WebSocket(url)}catch(e){return duelMsg('Could not connect.')}
  $('duelMenu').hidden=true;$('duelWait').hidden=false;$('duelRoom').textContent=code;
  $('duelRole').textContent=host?(role==='hunter'?'YOU ARE THE TIME HUNTER':'YOU ARE THE CHRONONAUT'):'JOINING ROOM';
  $('duelStatus').textContent=host?'Waiting for your opponent. Share this code.':'Connecting...';
  DU.ws.onopen=()=>{DU.pingI=setInterval(()=>duelSend({t:'p'}),20000)};
  DU.ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}duelRecv(m)};
  DU.ws.onclose=()=>{clearInterval(DU.pingI);if(DU.started&&!DU.over)duelFinish(null,'The connection was lost.');else if(!DU.started){duelReset();duelMsg('Could not reach the duel server.')}};
  DU.ws.onerror=()=>{};
}
function duelRecv(m){
  switch(m.t){
    case'err':{const w=m.m;duelReset();duelMsg(w);break}
    case'peers':
      if(m.n>=2&&DU.host&&!DU.started){const seed=(Math.random()*1e6)|0;duelSend({t:'start',seed,goal:DU.goal,hostRole:DU.role});duelStart(seed)}
      else if(m.n<2&&DU.started&&!DU.over)duelFinish(null,'Your opponent left the duel.');
      break;
    case'start':if(!DU.started&&!DU.host){DU.role=m.hostRole==='hunter'?'runner':'hunter';DU.goal=m.goal||5;duelStart(m.seed)}break;
    case's':duelPeerState(m);break;
    case'hit':if(G&&!G.over&&DU.started){if(document.hidden)ch.inv=0;hurtPlayer(m.d,{x:m.x,z:m.z,kind:'hunter'});if(!trav)duelSend(duelState())}break;
    case'trav':DU.trail.push({from:m.from,to:m.to,at:Date.now(),found:false});break;
    case'ko':if(!DU.hunter&&G){G.coins+=40;G.score+=50;toast('You beat the Hunter! +40 coins',false);SFX.ok()}break;
    case'end':duelFinish(DU.hunter?!m.runnerWon:!!m.runnerWon,m.text);break;
  }
}
function duelStart(seed){
  DU.started=true;DU.on=true;DU.over=false;DU.seed=seed;DU.hunter=DU.role==='hunter';DU.peer=null;DU.peerY=null;DU.range=null;DU.trail=[];DU.tight=null;DU.clue=null;
  $('duel').hidden=true;audio();newGame();
  toast(DU.hunter?'You are the Time Hunter. Read the clock, jump through time, find the Chrononaut.':`You are the Chrononaut. Complete ${DU.goal} missions to win. A Hunter is after you.`);
}
function duelStats(){if(DU.on&&DU.hunter){ch.maxHp=200;ch.dmg=24;ch.spd=1.1;ch.maxMana=999;ch.coinK=0;ch.hp=Math.min(ch.hp,ch.maxHp)}}
function duelHunterInit(){
  PSUIT=HUNTER_FIT;buildPlayer();G.timeline=[...YEARS];G.timeline.forEach(y=>{if(hasM(y))G.status[y]='done'});G.tier=2;stats();ch.hp=ch.maxHp;ch.mana=ch.maxMana;
  if(DU.solo)soloNewTarget(true);
  arrive(TH,true);
}
function duelKnockout(){
  if(DU.hunter){duelSend({t:'ko'});if(DU.solo)BOT.power+=.1;ch.hp=ch.maxHp;ch.inv=2;toast('You were beaten. Regrouping at HQ...',true);travel(TH);return}
  duelSend({t:'end',runnerWon:false});duelFinish(false,'The Hunter caught you. History is unwritten.');
}
function duelWin(){duelSend({t:'end',runnerWon:true});duelFinish(true,'You patched enough of history. The Hunter never found you in time.')}
function duelFinish(win,text){
  if(DU.over)return;DU.over=true;if(G)G.over={duel:true,year:G.cur};
  const t=$('deTitle');t.textContent=win==null?'DUEL ENDED':win?'VICTORY':'DEFEAT';
  $('deText').textContent=text||(win?(DU.hunter?'You eliminated the Chrononaut. The timeline is yours to rewrite.':'The timeline holds.'):(DU.hunter?'The Chrononaut got away.':'The Hunter caught you.'));
  if(win&&DU.hunter&&!text)$('deText').textContent='You hunted the Chrononaut down. History is safe from tampering.';
  $('duelEnd').hidden=false;$('hclock').hidden=true;clearInterval(DU.pingI);try{DU.ws&&DU.ws.close()}catch(e){}
}
$('duelBtn').onclick=()=>{audio();duelOpen()};
$('duelBack').onclick=()=>{duelReset();$('duel').hidden=true;$('title').hidden=false};
$('duelRun').onclick=()=>{audio();duelConnect(duelCode(),true,'runner')};
$('duelHun').onclick=()=>{audio();duelConnect(duelCode(),true,'hunter')};
$('duelJoin').onclick=()=>{audio();const c=($('duelCode').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.length<4)return duelMsg('Enter the 4-letter code.');duelConnect(c,false,null);$('duelStatus').textContent='Connecting...'};
$('deBack').onclick=()=>location.reload();
function duelCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let c='';for(let i=0;i<4;i++)c+=a[(Math.random()*a.length)|0];return c}

/* ---- per-frame ---- */
function duelPeerState(m){
  DU.peer={...m,at:Date.now()};
  if(DU.hunter&&DU.peerY!==m.y){DU.peerY=m.y;DU.tight=null;const idx=YEARS.indexOf(m.y);
    if(idx<0)DU.range={lost:true};
    else{const w=()=>Math.max(DU.solo?1:0,1+((Math.random()*4)|0)-((m.m||0)>>1));DU.range={lo:Math.max(0,idx-w()),hi:Math.min(YEARS.length-1,idx+w()),idx}}}
}
const duelState=()=>({t:'s',y:G.cur,x:+ch.x.toFixed(2),z:+ch.z.toFixed(2),fx:+ch.fx.toFixed(2),fz:+ch.fz.toFixed(2),mv:ch.moving?1:0,sw:ch.swing>0?1:0,hp:Math.round(ch.hp),mh:ch.maxHp,m:G.missions||0,hid:document.hidden?1:0});
/* a background tab stops running frames: keep sending a heartbeat so the rival does not vanish and HP bars stay live */
setInterval(()=>{if(document.hidden&&DU.started&&!DU.over&&!DU.solo&&G&&!trav)duelSend(duelState())},700);
document.addEventListener('visibilitychange',()=>{if(DU.started&&!DU.over&&!DU.solo&&G&&!trav)duelSend(duelState())});
const peerFresh=P=>!!P&&Date.now()-P.at<(P.hid?8000:4000);
function duelTick(dt){
  if(!G||!WD||DU.over)return;
  const t=performance.now();
  if(DU.solo){soloTick(dt);if(DU.hunter){ch.mana=ch.maxMana;duelClock();duelClueTick()}return}
  if(!trav&&t-DU.sendT>66){DU.sendT=t;duelSend(duelState())}
  if(DU.hunter){ch.mana=ch.maxMana;duelClock();duelClueTick()}
  /* puppet of the other player */
  const P=DU.peer,same=peerFresh(P)&&P.y===G.cur&&!trav;let n=WD.puppet;
  if(same&&!n){n=addNpc({kind:'peer',peer:true,fit:DU.hunter?SUIT:HUNTER_FIT,x:P.x,z:P.z,hp:P.hp||100,sp:0});n.maxHp=P.mh||100;WD.puppet=n;
    if(DU.hunter){toast('Target located!',true);SFX.ok()}else{toast('A Time Hunter has found you!',true);SFX.bad();burst(n.x,1.4,n.z,'#b44aff',40,6,.5)}}
  else if(!same&&n){WD.group.remove(n.rig.g);if(n.bd)n.bd.remove();if(n.hd)n.hd.remove();n.bd=n.hd=null;WD.npcs=WD.npcs.filter(q=>q!==n);WD.puppet=null;n=null}
  if(n){const k=1-Math.pow(.0005,dt);n.x=lerp(n.x,P.x,k);n.z=lerp(n.z,P.z,k);n.ang=Math.atan2(P.fx,P.fz);n.moving=!!P.mv;{const now=Date.now();if(n.hp<(n.ph??n.hp))n.lhit=now;n.hp=now-(n.lhit||0)<350?Math.min(n.hp,P.hp):P.hp;n.ph=n.hp}n.maxHp=P.mh;n.strikeT=Math.max(0,(n.strikeT||0)-dt);if(P.sw&&!n.swPrev)n.strikeT=.18;n.swPrev=P.sw}
}
function duelObj(){
  if(DU.solo&&BOT.npc&&!BOT.npc.dying)return`<span>Eliminate Chrononaut ${BOT.n}!</span>`;
  if(G.cur===TH)return DU.solo?`<span>Rank ${RANKS[rankOf(DU.kills)][0]} · ${DU.kills} down. Use the machine to hunt.</span>`:'<span>Use the machine to jump into history. Read the clock.</span>';
  if(WD.clue)return'<span>Temporal residue nearby. Follow the arrow.</span>';
  if(WD.puppet)return'<span>Eliminate the Chrononaut!</span>';
  return'<span>No trace here. Check the clock, then jump.</span>';
}
function duelClock(){
  const el=$('hclock');el.hidden=false;const R=DU.range,P=DU.peer;let key,lo=-1,hi=-1,txt='',sub='';
  const here=peerFresh(P)&&P.y===G.cur;
  if(!R){txt='SCANNING...';sub='Waiting for a signature'}
  else if(R.lost){txt='SIGNAL LOST';sub='He is out of reach, in the Nexus'}
  else{lo=R.lo;hi=R.hi;if(here||(DU.tight&&DU.tight.y===DU.peerY&&Date.now()<DU.tight.until)){lo=hi=R.idx}
    txt=lo===hi?`${fy(YEARS[lo])} · ${ERA[YEARS[lo]].name}`:`${fy(YEARS[lo])}  to  ${fy(YEARS[hi])}`;
    sub=DU.solo?`${hi-lo+1} era${hi===lo?'':'s'} · ${BOT.n} · level ${BOT.lvl+1} · rank ${RANKS[rankOf(DU.kills)][0]}`:`${hi-lo+1} era${hi===lo?'':'s'} · he has fixed ${P?P.m||0:0}/${DU.goal}`}
  const me=YEARS.indexOf(G.cur);key=[lo,hi,me,txt,sub].join('|');if(key===DU.ck)return;DU.ck=key;
  $('hcBar').innerHTML=YEARS.map((y,i)=>`<i class="${i>=lo&&i<=hi&&lo>=0?'on':''} ${i===me?'me':''}" title="${fy(y)}"></i>`).join('');$('hcTxt').textContent=txt;$('hcSub').textContent=sub;
}
function hunterArrive(year){
  DU.ck='';WD.clue=null;
  if(year===TH){
    const x0=WD.mx,add=(fit,x,z,k,line)=>{const n=addNpc({kind:'merchant',fit,x,z,hp:999,sp:0,k});n.bubble=line;n.bt=9;return n};
    add(LORD_SUIT,x0+5,ZMIN+3,1.3,'Find the Chrononaut. Erase him from history.');
    add(HUNTER_FIT,x0-4,ZMIN+2.4,1,'Read the clock. Follow the signature.');
    add(ELITE_FIT,x0-8,ZMIN+4.5,1,'Search the eras he visited. He leaves traces.');
    add(HUNTER_FIT,x0+9,ZMIN+5,1,'Fresh residue is the only sure thing.');
    toast('Hunter HQ. The Time Lord wants the Chrononaut gone.');return}
  /* temporal residue: where the Chrononaut departed from */
  let e=null;for(const q of DU.trail)if(q.from===year&&!q.found)e=q;
  if(e){const g=new THREE.Group(),x=clamp(WD.mx+(Math.random()-.5)*26,-L+4,L-4),z=ZMIN+2+Math.random()*7;g.position.set(x,0,z);
    const o=new THREE.Mesh(OCTA(),glow('#5ff5d6',3.2));o.scale.set(.7,1.1,.7);g.add(o);
    const ring=new THREE.Mesh(geo('lring',()=>new THREE.RingGeometry(1.05,1.3,48)),addMat('#5ff5d6',.7));ring.rotation.x=-Math.PI/2;ring.position.y=.05;g.add(ring);
    const pl=new THREE.PointLight('#5ff5d6',14,7,1.6);pl.position.y=1.5;g.add(pl);WD.group.add(g);WD.anim.push(t=>{o.position.y=1.4+Math.sin(t*2.2)*.2;o.rotation.y=t*1.4});
    WD.clue={x,z,g,e}}
}
function duelClueTick(){
  const c=WD.clue;if(!c||busy())return;if(Math.hypot(c.x-ch.x,c.z-ch.z)>1.7)return;
  c.e.found=true;WD.group.remove(c.g);WD.clue=null;SFX.pick();burst(c.x,1.4,c.z,'#5ff5d6',50,5,.5);
  const age=Math.max(1,Math.round((Date.now()-c.e.at)/1000)),to=c.e.to;
  if(to===NX)toast(`Residue: the Chrononaut slipped into the Nexus ${age}s ago. He is out of reach.`,true);
  else{toast(`Residue: the Chrononaut jumped to ${fy(to)}, ${ERA[to].name}, ${age}s ago.`,true);if(DU.peerY===to)DU.tight={y:to,until:Date.now()+25000}}
}

/* ================= era guardians (all modes) ================= */
const GUARD_LINES=["I guard this age. Leave me be.","This era is not yours to take.","Walk on, traveler. I will not stop you.","Every age has a keeper. I am this one's."];
function placeGuardian(year){
  if(!G||!G.guards||G.guards[year]||year===NX||year===TH||!ERA[year])return;
  const lk=ERA[year].look,acc=lk.lamps||(lk.sun&&lk.sun[0])||'#ffd27a',r=Math.random;
  let x;for(let i=0;i<20;i++){x=WD.mx+(r()<.5?-1:1)*(16+r()*20);if(Math.abs(x-WD.land.x)>9)break}
  const fit={coat:'#26262e',pants:'#16161c',skin:pick(r,['#b89a80','#8a6a50','#d8b898','#6a4a38']),hair:'#1a1410',hat:'visor',hatC:acc,hood:'#1c1c24',cape:acc,belt:acc,scarf:acc,boots:'#101014'};
  const n=addNpc({kind:'guardian',guard:true,fit,k:WD.year===-66000000?2.3:1.55,x,z:ZMIN+3+r()*(ZMAX-ZMIN-5),hp:430,sp:0});
  n.maxHp=n.hp;n.greet=pick(r,GUARD_LINES);n.reach=2.5;n.spd=3.3;n.dm=30;n.windT=.5;n.atkT=1.3;
  Object.assign(n,{shootCd:999,lungeCd:2.5+r()*2,dodgeCd:99,retreat:0,burst:0,lunge:0,lx:0,lz:0,swind:0,calmT:6});
  WD.guardian=n;
}
function guardianDown(n){
  n.dying=.7;n.hostile=false;n.wind=0;burst(n.x,1.6,n.z,'#ffd24a',70,7,.6);G.guards[WD.year]=true;G.score+=150;
  const c=Math.round((60+Math.random()*30)*(ch.coinK||1));for(let i=0;i<5;i++)dropCoin(n.x+(Math.random()-.5)*2,clamp(n.z+(Math.random()-.5)*1.6,ZMIN,ZMAX),Math.round(c/5));
  const rar=Math.random()<.1?4:Math.random()<.38?3:2,g=genGear(null,rar),nm=ERA[WD.year].name.replace(/^The /,'');g.name=`${nm} ${g.name.split(' ').slice(1).join(' ')}`;g.src=nm;
  dropGear(g,n.x,clamp(n.z+.4,ZMIN,ZMAX));toast(`The Guardian of ${nm} falls. It leaves: ${g.name}`);SFX.ok();GU.uFlash.value=.3;
}

/* ================= Hunter solo: chase an endless line of AI Chrononauts ================= */
const RANKS=[['Recruit',0],['Tracker',1],['Hunter',2],['Stalker',4],['Elite Hunter',6],['Master Hunter',9],['Time Marshal',13],['Time Lord',18]];
const BOT_NAMES=['Ada','Kairos','Mara','Jonas','Idris','Lena','Orion','Vesper','Tomas','Yuki','Silas','Noor'];
const BOT_COATS=['#3a5a3a','#5a3a3a','#3a3a6a','#6a5a2a','#4a3a5a','#2a5a5a'];
const BOT={on:false,n:null,y:2026,m:0,lvl:0,t0:0,hpf:1,npc:null,stay:0,mt:0,lt:0,gone:0,respawn:0,power:1,id:0};
const rankOf=k=>{let r=0;RANKS.forEach((q,i)=>{if(k>=q[1])r=i});return r};
function soloStart(){
  audio();Object.assign(DU,{on:true,solo:true,role:'hunter',hunter:true,started:true,over:false,seed:0,peer:null,peerY:null,range:null,trail:[],tight:null,clue:null,kills:0});
  $('title').hidden=true;newGame();toast('Hunter mode. Track down the Chrononaut. Another one appears after every kill.')
}
function soloNewTarget(first){
  const eras=YEARS.filter(y=>y!==G.cur);BOT.id++;
  Object.assign(BOT,{on:true,n:pick(Math.random,BOT_NAMES),y:pick(Math.random,eras),m:0,lvl:0,t0:Date.now(),hpf:1,npc:null,stay:15+Math.random()*15,mt:0,lt:0,gone:0,respawn:0,power:1+.28*DU.kills});
  DU.trail=[];DU.peer=null;DU.peerY=null;DU.range=null;DU.tight=null;botMove(BOT.y,true);
  if(!first)toast(`New signature detected: Chrononaut ${BOT.n}. Rank ${RANKS[rankOf(DU.kills)][0]}.`,true)
}
function botPower(){return BOT.power*(1+Math.min(1.6,BOT.lvl*.22))}
function botMove(to,silent){
  if(!silent&&BOT.y!=null)DU.trail.push({from:BOT.y,to,at:Date.now(),found:false});
  BOT.y=to;BOT.stay=18+Math.random()*22;BOT.gone=0;duelPeerState({y:BOT.y,m:BOT.m});
}
function soloTick(dt){
  if(!BOT.on||!G||G.over)return;
  const now=Date.now(),el=(now-BOT.t0)/1000;
  DU.peer={y:BOT.y,m:BOT.m,at:now};
  if(trav)return;
  /* the Chrononaut keeps progressing while you search */
  const lvl=Math.floor(el/45);if(lvl>BOT.lvl){BOT.lvl=lvl;BOT.m=lvl*2;toast(`Chrononaut ${BOT.n} grows stronger (level ${lvl+1}).`,true);if(BOT.y!==G.cur)duelPeerState({y:BOT.y,m:BOT.m})}
  const fighting=BOT.npc&&!BOT.npc.dying;
  if(!fighting&&G.cur!==TH&&BOT.y===G.cur){/* he is here: spawn him */
    if(G.cur!==NX){const r=Math.random,sx=r()<.5?-1:1;const n=addNpc({kind:'cbot',fit:{coat:pick(r,BOT_COATS),pants:'#1e2530',skin:pick(r,NPC_SKIN),hair:pick(r,NPC_HAIR),scarf:pick(r,['#b8452e','#2e8ab8','#8ab82e','#b82e8a']),goggles:true,belt:'#c9a24a',boots:'#2a1a10',hat:'none'},x:clamp(ch.x+sx*(9+r()*4),-L+3,L-3),z:ZMIN+3+r()*(ZMAX-ZMIN-5),hp:1,sp:0,hostile:true});
      const P=botPower();n.maxHp=Math.round(110*P);n.hp=Math.max(8,Math.round(BOT.hpf*n.maxHp));n.dm=Math.round(10+7*P);n.shd=Math.round(8+3*P);n.spd=Math.min(6.2,3.6+.55*P);n.windT=Math.max(.14,.3-.03*P);n.atkT=Math.max(.35,.85-.1*P);n.guard=false;
      Object.assign(n,{shootCd:2+Math.random()*2,dodgeCd:1.2,retreat:0,burst:0,lunge:0,lx:0,lz:0,swind:0,lungeCd:1.5,wait:0,fleeCd:3+Math.random()*3});
      n.bubble=`${BOT.n}: You found me.`;n.bt=2.4;BOT.npc=n;burst(n.x,1.4,n.z,'#8ad8ff',40,6,.5);toast(`Chrononaut ${BOT.n} located!`,true);SFX.ok()}
  }else if(fighting&&BOT.y!==G.cur){BOT.hpf=BOT.npc.hp/BOT.npc.maxHp;WD.group.remove(BOT.npc.rig.g);if(BOT.npc.bd)BOT.npc.bd.remove();if(BOT.npc.hd)BOT.npc.hd.remove();BOT.npc.bd=BOT.npc.hd=null;WD.npcs=WD.npcs.filter(q=>q!==BOT.npc);BOT.npc=null}
  if(BOT.npc&&BOT.npc.dying)BOT.npc=null;
  /* regenerate slowly */
  if(!BOT.npc&&BOT.hpf<1)BOT.hpf=Math.min(1,BOT.hpf+dt*.012);
  const npc=BOT.npc;
  if(npc&&!npc.dying){
    npc.fleeCd-=dt;
    if(npc.hp<npc.maxHp*.27&&npc.fleeCd<=0&&Math.random()<dt*.5){/* badly hurt: jump away */
      BOT.hpf=npc.hp/npc.maxHp;burst(npc.x,1.4,npc.z,'#8ad8ff',50,6,.5);floatText(npc.x,2.6,npc.z,'ESCAPED','#8ad8ff');SFX.whoosh();
      WD.group.remove(npc.rig.g);if(npc.bd)npc.bd.remove();if(npc.hd)npc.hd.remove();npc.bd=npc.hd=null;WD.npcs=WD.npcs.filter(q=>q!==npc);BOT.npc=null;
      let to=pick(Math.random,YEARS.filter(y=>y!==G.cur));botMove(to);toast(`${BOT.n} jumped away, wounded. Find the residue.`,true)}
  }else if(BOT.y!==G.cur){
    BOT.stay-=dt;if(BOT.stay<=0){
      let to=Math.random()<.12?NX:pick(Math.random,YEARS.filter(y=>y!==BOT.y));
      botMove(to);if(to===G.cur){toast(`Chrononaut ${BOT.n} jumps into this era!`,true)}}
  }
}
function botDown(n){
  n.dying=.6;n.hostile=false;n.wind=0;burst(n.x,1.3,n.z,'#8ad8ff',50,6,.5);BOT.npc=null;BOT.on=false;
  const before=rankOf(DU.kills);DU.kills++;const after=rankOf(DU.kills);G.score+=100*(1+after);G.tier=2+after;stats();
  const c=Math.round((40+Math.random()*30)*(1+.2*after));for(let i=0;i<4;i++)dropCoin(n.x+(Math.random()-.5)*1.6,clamp(n.z+(Math.random()-.5)*1.2,ZMIN,ZMAX),Math.round(c/4));
  const g=genGear(null,Math.max(1,rollRar(.5+.25*after)));dropGear(g,n.x,clamp(n.z+.4,ZMIN,ZMAX));burst(n.x,1.5,n.z,RAR[g.rar].c,24,4,.4);
  toast(`Chrononaut ${BOT.n} eliminated! ${DU.kills} down.`);SFX.ok();
  if(after>before)setTimeout(()=>toast(`RANK UP: ${RANKS[after][0]}`),1500);
  setTimeout(()=>{if(DU.on&&DU.solo&&!DU.over)soloNewTarget(false)},3500);
}

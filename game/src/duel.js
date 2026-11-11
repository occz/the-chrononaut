/* ================= online duel: Chrononaut vs Time Hunter (2 players, WebSocket relay) ================= */
const DU={on:false,role:null,hunter:false,ws:null,room:'',host:false,started:false,over:false,seed:0,goal:5,peer:null,peerY:null,range:null,trail:[],sendT:0,pingI:0,tight:null,clue:null};
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
    case'hit':if(G&&!G.over&&DU.started)hurtPlayer(m.d,{x:m.x,z:m.z,kind:'hunter'});break;
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
  PSUIT=HUNTER_FIT;buildPlayer();G.timeline=[...YEARS];G.timeline.forEach(y=>{if(hasM(y))G.status[y]='done'});G.tier=99;stats();ch.hp=ch.maxHp;ch.mana=ch.maxMana;
  $('mute').hidden=false;arrive(TH,true);
}
function duelKnockout(){
  if(DU.hunter){duelSend({t:'ko'});ch.hp=ch.maxHp;ch.inv=2;toast('You were beaten. Regrouping at HQ...',true);travel(TH);return}
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
    else{const w=()=>Math.max(0,1+((Math.random()*4)|0)-((m.m||0)>>1));DU.range={lo:Math.max(0,idx-w()),hi:Math.min(YEARS.length-1,idx+w()),idx}}}
}
function duelTick(dt){
  if(!G||!WD||DU.over)return;
  const t=performance.now();
  if(!trav&&t-DU.sendT>66){DU.sendT=t;duelSend({t:'s',y:G.cur,x:+ch.x.toFixed(2),z:+ch.z.toFixed(2),fx:+ch.fx.toFixed(2),fz:+ch.fz.toFixed(2),mv:ch.moving?1:0,sw:ch.swing>0?1:0,hp:Math.round(ch.hp),mh:ch.maxHp,m:G.missions||0})}
  if(DU.hunter){ch.mana=ch.maxMana;duelClock();duelClueTick()}
  /* puppet of the other player */
  const P=DU.peer,same=!!P&&P.y===G.cur&&!trav&&Date.now()-P.at<4000;let n=WD.puppet;
  if(same&&!n){n=addNpc({kind:'peer',peer:true,fit:DU.hunter?SUIT:HUNTER_FIT,x:P.x,z:P.z,hp:P.hp||100,sp:0});n.maxHp=P.mh||100;WD.puppet=n;
    if(DU.hunter){toast('Target located!',true);SFX.ok()}else{toast('A Time Hunter has found you!',true);SFX.bad();burst(n.x,1.4,n.z,'#b44aff',40,6,.5)}}
  else if(!same&&n){WD.group.remove(n.rig.g);if(n.bd)n.bd.remove();if(n.hd)n.hd.remove();n.bd=n.hd=null;WD.npcs=WD.npcs.filter(q=>q!==n);WD.puppet=null;n=null}
  if(n){const k=1-Math.pow(.0005,dt);n.x=lerp(n.x,P.x,k);n.z=lerp(n.z,P.z,k);n.ang=Math.atan2(P.fx,P.fz);n.moving=!!P.mv;n.hp=P.hp;n.maxHp=P.mh;n.strikeT=Math.max(0,(n.strikeT||0)-dt);if(P.sw&&!n.swPrev)n.strikeT=.18;n.swPrev=P.sw}
}
function duelObj(){
  if(G.cur===TH)return'<span>Use the machine to jump into history. Read the clock.</span>';
  if(WD.clue)return'<span>Temporal residue nearby. Follow the arrow.</span>';
  if(WD.puppet)return'<span>Eliminate the Chrononaut!</span>';
  return'<span>No trace here. Check the clock, then jump.</span>';
}
function duelClock(){
  const el=$('hclock');el.hidden=false;const R=DU.range,P=DU.peer;let key,lo=-1,hi=-1,txt='',sub='';
  const here=P&&P.y===G.cur&&Date.now()-P.at<4000;
  if(!R){txt='SCANNING...';sub='Waiting for a signature'}
  else if(R.lost){txt='SIGNAL LOST';sub='He is out of reach, in the Nexus'}
  else{lo=R.lo;hi=R.hi;if(here||(DU.tight&&DU.tight.y===DU.peerY&&Date.now()<DU.tight.until)){lo=hi=R.idx}
    txt=lo===hi?`${fy(YEARS[lo])} · ${ERA[YEARS[lo]].name}`:`${fy(YEARS[lo])}  to  ${fy(YEARS[hi])}`;
    sub=`${hi-lo+1} era${hi===lo?'':'s'} · he has fixed ${P?P.m||0:0}/${DU.goal}`}
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

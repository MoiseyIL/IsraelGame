/* ---------- loop ---------- */
let last=performance.now(),lastSec=-1;
function frame(now){const rdt=Math.min(.1,(now-last)/1000);last=now;
  if(S.started&&!S.over&&S.speed===0&&S.mission)pauseThink(rdt);else pauseReset();
  if(S.started&&!S.over&&S.speed>0){S.acc+=rdt*RATE*S.speed;let n=0;while(S.acc>=1&&n<240&&!S.over){tick(1);S.acc-=1;n++;}}
  if($('#brief').hidden&&$('#camp').hidden)radioStep(rdt); // the radio waits while the order or the HQ screen is open
  if(now-lastSave>10000){lastSave=now;saveGame();}
  if(S.started&&!S.over&&S.speed>0)dbLog(false);
  if(S.alarm&&!S.alarmKnown&&S.log.some(m=>m.urgent)){S.alarmKnown=true;updObj();}
  const sec=Math.floor(S.t/15);if(sec!==lastSec){lastSec=sec;$('#clock').textContent=fmt(S.t);updUnits();dirty=true;}
  render();requestAnimationFrame(frame);}
const SAVE_KEY=(HE?('reshet-save-he'):EN?'reshet-save-en':('reshet-save-ru'));let lastSave=0;
function saveGame(){if(!S||!S.started||S.over)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify({v:1,at:Date.now(),S}));}catch(e){}}
function loadGame(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(d&&d.S&&d.S.started&&!d.S.over)return d.S;}catch(e){}return null;}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.hidden){saveGame();dbLog(true);}});window.addEventListener('pagehide',()=>{saveGame();dbLog(true);});
async function start(data){
  C=loadCamp()||newCamp();saveCamp();TR=loadTR();MS=loadMS();try{const md=localStorage.getItem(MODE_KEY);MODE=['train','mission'].includes(md)?md:'camp';}catch(e){}
  let saved=(data&&data.S)?null:loadGame();if(saved&&saved.train&&!(saved.city&&saved.city.g===3)){clearSave();saved=null;}const S0=(data&&data.S)||saved;if(S0)MODE=S0.mission?'mission':S0.train?'train':'camp';
  const city=S0?(S0.city||{seed:SEED,dens:'normal'}):MODE==='train'?{seed:TR.seed,dens:TR.dens,g:3}:MODE==='mission'?{seed:MS.seed,dens:MS.dens,g:3}:{seed:SEED,dens:'normal'};genCity(city.seed,city.dens,city.g>=2);buildNav();
  S=S0||(MODE==='train'?newState(TR):MODE==='mission'?newMissionState(MS):newState());
  if(!S.civW){S.civW=[];S.civDead=0;S.civAid=0;S.civEvac=0;S.amb=[];infs().forEach(u=>{for(let i=0;i<(u.civHit||0)&&u.inB;i++)S.civW.push(newCivW(u.inB));});}
  try{await Promise.race([Promise.all([(HE?('700 16px "Rubik"'):('700 16px "Roboto Condensed"')),(HE?('16px "Heebo"'):('16px "PT Mono"'))].map(f=>document.fonts.load(f,(HE?('דיר 214'):((EN?("Deir 214"):('Дейр 214'))))))),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
  $("#loading").hidden=true;showSplash();
  rebuildLog();updUnits();updObj();setSpeedUI();
  setBriefHead();if(S.over)showDebrief();else if(!S.started)(S.mission?showMission():S.train?showTrain():showCamp());else if(saved){S.speed=0;setSpeedUI();$('#bGo').textContent=(HE?('להמשיך את המבצע · '):((EN?("Continue the operation ·"):('Продолжить операцию · '))))+fmt(S.t);$('#bEnd').hidden=false;$('#brief').hidden=false;}else{S.speed=0;setSpeedUI();}
  if(S.truth)$('#truthPill').hidden=false;
  resize();dirty=true;requestAnimationFrame(frame);}
window.claude?.hot?.snapshot?.(()=>({S}));
window.__kp={get S(){return S;},get C(){return C;},trial:o=>{setCity(o.seed,o.dens,true);return newState(o);},mtrial:o=>{setCity(o.seed,o.dens,true);return newMissionState(o);},chk:(x,y)=>({town:inTown(x,y),blk:!!blockOf(x,y),free:navFree(Math.floor(x/NG),Math.floor(y/NG))}),M:()=>M,tick:dt=>tick(dt),radioStep,BL:()=>BL,DEB:()=>DEB,toS:(x,y)=>toS(x,y),center:(x,y,s)=>centerOn(x,y,s||clamp(cw/W*2,minS(),maxS())),say:(u,t,o)=>say(u,t,[],o||{})};
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});

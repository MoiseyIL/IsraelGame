/* ---------- critical requests, fighting through to a position, withdrawal under cover ---------- */
// A critical request is a decision only the commander can take. It arrives with its radio message as a red card over the
// map: big buttons and a 30-second countdown that runs only while the game runs. Without an answer the team does the
// default itself. In missions the game pauses while a card is up (switch in the mission settings).
// Cards hold functions, so they live outside S (not saved); a reload simply drops pending cards.
var CRIT=[],CRIT_WAS=0;
const CRIT_T=30;
function chq(text,act){qPut({from:T3('Кобра-6','צפע','Cobra-6'),out:true,text,act,chips:[],pr:-2});}
function critReset(){CRIT=[];CRIT_WAS=0;const el=document.getElementById('crit');if(el){el.hidden=true;el.innerHTML='';}}
const critReq=o=>Object.assign({id:'c'+Math.random().toString(36).slice(2),left:CRIT_T,def:0},o);
// the request goes out as a radio message; the card appears when the message is on the air
function critSay(u,text,r){r.from=u.call;r.uid=u.type==='inf'?u.id:null;r.text=text;say(u,text,[],{urgent:true,pr:-1,crit:r,known:u.type==='inf'?'st':undefined});}
function critPush(r){if(S.over)return;if(r.key&&CRIT.some(x=>x.key===r.key))return;if(r.valid&&!r.valid())return;CRIT.push(r);
  if(S.mission&&S.critPause&&S.speed>0){CRIT_WAS=CRIT_WAS||S.speed;S.speed=0;setSpeedUI();}
  try{navigator.vibrate&&navigator.vibrate([140,90,140]);}catch(e){}beep();setTimeout(beep,260);critRender();updUnits();dirty=true;}
function critResume(){if(!CRIT.length&&CRIT_WAS){if(!S.over){S.speed=CRIT_WAS;setSpeedUI();}CRIT_WAS=0;}}
function critAnswer(r,i){const k=CRIT.indexOf(r);if(k<0)return;CRIT.splice(k,1);const b=r.btns[i];if(b&&b.fn)b.fn();critResume();critRender();updUnits();dirty=true;}
function critTick(rdt){if(!CRIT.length)return;if(S.over){critReset();return;}
  let ch=false;for(const r of CRIT.slice())if(r.valid&&!r.valid()){CRIT.splice(CRIT.indexOf(r),1);ch=true;}
  if(ch){critResume();critRender();updUnits();}if(!CRIT.length)return;dirty=true;
  if(S.speed<=0)return;const r=CRIT[0];r.left-=rdt;if(r.left<=0){critAnswer(r,r.def);return;}
  const bar=document.querySelector('#crit .cbar i');if(bar)bar.style.width=(100*r.left/CRIT_T).toFixed(1)+'%';}
function critRender(){let el=document.getElementById('crit');if(!el){el=document.createElement('div');el.id='crit';el.setAttribute('role','alertdialog');$('#mapwrap').appendChild(el);}
  if(!CRIT.length||S.over){el.hidden=true;el.innerHTML='';return;}el.hidden=false;const r=CRIT[0];
  el.innerHTML=`<div class="ch"><b>${esc(r.from)}</b>${CRIT.length>1?`<span class="cn">${esc(T3('запросов','בקשות','requests'))}: ${CRIT.length}</span>`:''}</div><div class="ct">${esc(r.text)}</div>`+
    `<div class="cb">${r.btns.map((b,i)=>`<button data-ci="${i}"${i===r.def?' class="def"':''}>${esc(b.t)}</button>`).join('')}</div>`+
    `<div class="cbar"><i style="width:${(100*r.left/CRIT_T).toFixed(1)}%"></i></div><div class="cleft">${esc(T3('Без ответа','בלי תשובה','No answer'))}: ${esc(r.btns[r.def].t)}${S.speed<=0?' · '+esc(T3('игра на паузе','המשחק מושהה','game paused')):''}</div>`;
  el.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>critAnswer(r,+b.dataset.ci));}
const critOf=uid=>CRIT.some(r=>r.uid===uid);
// map: a pulsing red ring around a team that waits for your decision
function drawCritRings(c){if(!CRIT.length)return;const ph=(performance.now()/700)%1;for(const r of CRIT){if(!r.uid)continue;const m=S.marks.own[r.uid];if(!m)continue;const [sx,sy]=toS(m.x,m.y);
  c.save();c.strokeStyle=`rgba(226,38,38,${(1-ph).toFixed(2)})`;c.lineWidth=3;c.beginPath();c.arc(sx,sy,18+ph*18,0,7);c.stroke();c.strokeStyle='#e22626';c.lineWidth=2;c.beginPath();c.arc(sx,sy,18,0,7);c.stroke();c.restore();}}

// ---- fighting through to a position ----
// On contact a team going somewhere takes a FIRING position: in sight of the enemy, against a house wall or behind
// debris (no longer a blind corner where the fight simply stops). Then the commander chooses: fight through (fire and
// movement: when the enemy is pinned the team rushes 30–40 m along its route; a big team does it half covering half),
// go around (90 m around the enemy, with a report), or wait in position.
function findFirePos(u,en){const e0=en.reduce((a,e)=>!a||Math.hypot(e.x-u.x,e.y-u.y)<Math.hypot(a.x-u.x,a.y-u.y)?e:a,null);if(!e0)return null;let best=null;
  for(const r of [6,14,24,36])for(let a=0;a<16;a++){const x=u.x+Math.cos(a*Math.PI/8)*r,y=u.y+Math.sin(a*Math.PI/8)*r;
    if(x<0||y<0||x>MWm||y>MHm||!navFree(Math.floor(x/NG),Math.floor(y/NG)))continue;if(Math.hypot(x-e0.x,y-e0.y)>(e0.bld&&!outside(e0)?88:135))continue;if(!losPtE(x,y,e0))continue;
    const deb=debCov(x,y),wall=bldAt(x,y,8);const cov=deb?Math.min(deb,.55):wall?.6:0;if(!cov)continue;const sc=cov+r*.004;if(!best||sc<best[4])best=[x,y,null,cov,sc];}
  return best;}
const ftGoing=u=>u.resume&&['move','assault','cordon','search'].includes(u.resume.st);
function ftAsk(u,en,ratio){u.ftPend=1;const e0=en[0],no=tgtNo(e0),n=en.reduce((s,e)=>s+e.men,0);
  const w=e0.bld&&!outside(e0)?T3(`в здании ${e0.bld}`,`במבנה ${e0.bld}`,`in building ${e0.bld}`):placeTxt(e0.x,e0.y);
  const pick=(m,txt)=>()=>{u.ftPend=0;u.ftMode=m;u.ftT=S.t;chq(txt);u.decT=S.t+3;}; /* the team acts on its next decision, after the order is on the air */
  critSay(u,T3(`Кобра-6, я ${u.call}! На пути противник: цель ${no}, ${w}, ${cnt(n)}. ${ratio>=.8?'Силы равны или наши больше':'Противник сильнее'}. Пробиваться, обходить или ждать? Приём.`,
      `צפע, כאן ${u.call}! אויב בדרך: מטרה ${no}, ${w}, ${cnt(n)}. ${ratio>=.8?'הכוחות שקולים או שאנחנו חזקים יותר':'האויב חזק יותר'}. לפרוץ, לעקוף או לחכות? עבור.`,
      `Cobra-6, this is ${u.call}! Enemy on our route: target ${no}, ${w}, ${cnt(n)}. ${ratio>=.8?'Forces even or in our favour':'The enemy is stronger'}. Fight through, go around or wait? Over.`),
    critReq({key:'ft'+u.id,def:ratio>=.8?0:1,valid:()=>u.men>1&&u.ftPend===1,btns:[
      {t:T3('Пробиваться','לפרוץ','Fight through'),fn:pick('push',T3(`${u.call}, я Кобра-6. Пробиваться огнём и перебежками. Приём.`,`${u.call}, כאן צפע. לפרוץ באש ובדילוגים. עבור.`,`${u.call}, this is Cobra-6. Fight through by fire and movement. Over.`))},
      {t:T3('Обходить','לעקוף','Go around'),fn:pick('bypass',T3(`${u.call}, я Кобра-6. Обходить. Приём.`,`${u.call}, כאן צפע. לעקוף. עבור.`,`${u.call}, this is Cobra-6. Go around. Over.`))},
      {t:T3('Ждать','לחכות','Wait'),fn:pick('wait',T3(`${u.call}, я Кобра-6. Держать позицию, ждать. Приём.`,`${u.call}, כאן צפע. להחזיק עמדה ולחכות. עבור.`,`${u.call}, this is Cobra-6. Hold the position and wait. Over.`))}]}));}
// "can't get around": the streets are under fire — the commander decides (default: hold on)
function stuckAsk(u,e){if(u.stuckRep)return;u.stuckRep=1;u.ftMode=null;const back=wdBack(u);
  critSay(u,STUCK_TXT(u,e),critReq({key:'st'+u.id,def:1,valid:()=>u.men>1,btns:[
    {t:T3('Пробиваться','לפרוץ','Fight through'),fn:()=>{chq(T3(`${u.call}, я Кобра-6. Пробиваться огнём и перебежками. Приём.`,`${u.call}, כאן צפע. לפרוץ באש ובדילוגים. עבור.`,`${u.call}, this is Cobra-6. Fight through by fire and movement. Over.`));u.ftMode='push';u.ftT=S.t;u.byp=0;u.stuckRep=0;}},
    {t:T3('Держаться','להחזיק','Hold on'),fn:()=>{chq(T3(`${u.call}, я Кобра-6. Держаться. Приём.`,`${u.call}, כאן צפע. להחזיק מעמד. עבור.`,`${u.call}, this is Cobra-6. Hold on. Over.`));u.ftMode='wait';u.ftT=S.t;}},
    {t:T3('Отойти','לסגת','Withdraw'),fn:()=>{chq(T3(`${u.call}, я Кобра-6. Отходить: ${placeTxt(back.x,back.y)}. Приём.`,`${u.call}, כאן צפע. לסגת: ${placeTxt(back.x,back.y)}. עבור.`,`${u.call}, this is Cobra-6. Withdraw: ${placeTxt(back.x,back.y)}. Over.`));orderExec(u,{kind:'retreat',x:back.x,y:back.y});}}]}));}
function ftBypass(u){const en=(u.threats||[]).map(E_).filter(e=>e&&e.men>0);u.avoid=u.avoid||[];
  // too close to slip away, or already tried twice: no detour exists
  if(en.some(e=>Math.hypot(e.x-u.x,e.y-u.y)<60)||(u.byp||0)>=2){stuckAsk(u,en[0]||{x:u.x,y:u.y,bld:0});return;}
  for(const e of en)u.avoid.push({x:e.x,y:e.y,r:90,bld:e.bld&&!outside(e)?e.bld:0,until:S.t+1800});u.byp=(u.byp||0)+1;u.threats=[];
  const r=u.resume;resumeOrder(u);for(const id of u.cont){const e=E_(id);if(e)e.cont=e.cont.filter(x=>x!==u.id);}u.cont=[];
  if(!u.bypSaid){u.bypSaid=1;say(u,T3(`Кобра-6, я ${u.call}. Обходим другой улицей, держим направление на квадрат ${r?cell(r.tx,r.ty):cell(u.tx,u.ty)}.`,`צפע, כאן ${u.call}. עוקפים ברחוב אחר, ממשיכים לכיוון משבצת ${r?cell(r.tx,r.ty):cell(u.tx,u.ty)}.`,`Cobra-6, this is ${u.call}. Going around by another street, heading for grid ${r?cell(r.tx,r.ty):cell(u.tx,u.ty)}.`),[],{urgent:true,known:'st'});}}
// called by the team leader every 15 s while the team fights from its position; true = decided, nothing else to do
function ftStep(u,en){u.ftT=S.t;
  if(u.ftMode==='wait'){if(u.cont.length||S.t-(u.contT||0)<60)return true;resumeOrder(u);u.resumeNote=true;return true;}
  if(u.ftMode==='bypass'){ftBypass(u);return true;}
  if(u.ftMode!=='push'||!u.resume)return false;
  if(!u.cont.length){resumeOrder(u);return true;} // the enemy has lost sight of us: keep going
  const pinned=en.every(e=>(e.sup||0)>55),big=u.men>=12;
  if(pinned||big){u.st='bound';u.tx=u.resume.tx;u.ty=u.resume.ty;u.pkey=null;u.boundEnd=S.t+(big&&!pinned?14:20);
    if(!u.ftSaid){u.ftSaid=1;say(u,T3(`Кобра-6, я ${u.call}. ${big&&!pinned?'Половина прикрывает огнём, половина перебегает':'Противник прижат, перебегаем'}. Пробиваемся к позиции.`,`צפע, כאן ${u.call}. ${big&&!pinned?'חצי מחפים באש, חצי מדלגים':'האויב מרותק, מדלגים'}. פורצים לעמדה.`,`Cobra-6, this is ${u.call}. ${big&&!pinned?'Half cover with fire, half rush':'The enemy is pinned, rushing'}. Fighting through to the position.`),[],{known:'st'});}}
  return true;}

// ---- withdrawal under cover ----
// A battered team ordered to withdraw asks a team nearby that is still in good shape to cover it. The helper takes a
// firing position and pins the enemy down; then the battered team breaks contact and goes back. A team with one man
// left is evacuated: the helper comes, takes its wounded and brings them back. Then the helper returns to its task.
function battered(u){const mx=u.max0||u.men+u.wounded;return u.men<=1||S.t-(u.contT||-1e9)<60&&(u.men<=mx/2||u.wounded>=u.men||(u.sup||0)>60);}
function wdHelpers(u){return infs().filter(v=>v!==u&&v.men>1&&v.st!=='broken'&&v.men>=.6*(v.max0||v.men)&&v.ammo>40&&!(v.cont.length&&(v.sup||0)>40)&&!(S.wd||[]).some(w=>w.hid===v.id||w.uid===v.id)&&Math.hypot(v.x-u.x,v.y-u.y)<300)
  .sort((a,b)=>inCircle(a)-inCircle(b)||Math.hypot(a.x-u.x,a.y-u.y)-Math.hypot(b.x-u.x,b.y-u.y));}
const inCircle=v=>S.mission&&S.obj&&Math.hypot(v.x-S.obj.x,v.y-S.obj.y)<HOLD_R?1:0;
const wdBack=u=>{const B=S.ourBase;if(!B)return{x:u.x,y:Math.min(MHm-20,u.y+250)};const dx=B.x-u.x,dy=B.y-u.y,d=Math.hypot(dx,dy)||1,r=Math.min(d,250);return{x:u.x+dx/d*r,y:u.y+dy/d*r};};
function wdAsk(u,a,k,quiet){const H=wdHelpers(u),pt={x:a.x,y:a.y},evac=u.men<=1;k=(k||0)%Math.max(1,H.length);const h=H[k],auto=!!a.auto;
  const self=()=>{chq(T3(`${u.call}, я Кобра-6. Отходить самостоятельно. Приём.`,`${u.call}, כאן צפע. לסגת בכוחות עצמכם. עבור.`,`${u.call}, this is Cobra-6. Withdraw on your own. Over.`));orderExec(u,Object.assign({},a,{plain:true}));};
  const hold=()=>chq(T3(`${u.call}, я Кобра-6. Держаться. Приём.`,`${u.call}, כאן צפע. להחזיק מעמד. עבור.`,`${u.call}, this is Cobra-6. Hold on. Over.`));
  if(!h){const r=critReq({key:'wd'+u.id,valid:()=>u.men+u.wounded>0,btns:evac?[{t:T3('Вызвать Ангела','להזעיק ינשוף','Call Angel'),fn:()=>angelTo(u)},{t:T3('Держаться','להחזיק','Hold on'),fn:hold}]:[{t:T3('Отходить сами','לסגת לבד','Withdraw alone'),fn:self},{t:T3('Держаться','להחזיק','Hold on'),fn:hold}]});
    const txt=T3(`Кобра-6, я ${u.call}. Прикрыть ${evac?'эвакуацию':'отход'} некому: рядом нет отряда в силах. ${evac?'Нужен Ангел.':'Отходим сами под огнём?'} Приём.`,`צפע, כאן ${u.call}. אין מי שיחפה על ${evac?'הפינוי':'הנסיגה'}: אין צוות כשיר בקרבת מקום. ${evac?'צריך ינשוף.':'לסגת לבד תחת אש?'} עבור.`,`Cobra-6, this is ${u.call}. Nobody to cover the ${evac?'evacuation':'withdrawal'}: no fit team nearby. ${evac?'Need Angel.':'Withdraw alone under fire?'} Over.`);
    if(quiet){Object.assign(r,{from:u.call,uid:u.id,text:txt});critPush(r);}else critSay(u,txt,r);return;}
  const r=critReq({key:'wd'+u.id,def:auto&&evac?(H.length>1?2:1):0,valid:()=>u.men+u.wounded>0&&h.men>1,btns:[
    {t:evac?T3(`${h.call} забирает`,`${h.call} מפנה`,`${h.call} picks them up`):T3(`${h.call} прикрывает`,`${h.call} מחפה`,`${h.call} covers`),fn:()=>wdGo(u,h,pt)},
    ...(H.length>1?[{t:T3('Другой отряд','צוות אחר','Another team'),fn:()=>wdAsk(Object.assign(u),a,k+1,true)}]:[]),
    {t:evac?T3('Вызвать Ангела','להזעיק ינשוף','Call Angel'):T3('Без прикрытия','בלי חיפוי','No cover'),fn:evac?()=>angelTo(u):self}]});
  const txt=evac?T3(`Кобра-6, я ${u.call}. Сами не выйдем: в строю ${u.men}, раненых ${u.wounded}. Прошу эвакуацию, может забрать ${h.call}. Приём.`,`צפע, כאן ${u.call}. לא נצא לבד: כשירים ${u.men}, פצועים ${u.wounded}. מבקשים פינוי, ${h.call} יכול לאסוף. עבור.`,`Cobra-6, this is ${u.call}. We can't get out: ${u.men} fit, ${u.wounded} wounded. Request evacuation, ${h.call} can pick us up. Over.`)
    :T3(`Кобра-6, я ${u.call}. Сами не оторвёмся: в строю ${u.men}, раненых ${u.wounded}. Прошу прикрыть отход, ближе всех ${h.call}. Приём.`,`צפע, כאן ${u.call}. לא נתנתק לבד: כשירים ${u.men}, פצועים ${u.wounded}. מבקשים חיפוי לנסיגה, הכי קרוב ${h.call}. עבור.`,`Cobra-6, this is ${u.call}. We can't break off alone: ${u.men} fit, ${u.wounded} wounded. Request cover to withdraw, nearest is ${h.call}. Over.`);
  if(quiet){Object.assign(r,{from:u.call,uid:u.id,text:txt});critPush(r);}else critSay(u,txt,r);}
function angelTo(u){const lz=S.nid++;S.marks.lz.push({id:lz,x:u.x,y:u.y});chq(T3(`Ангел, я Кобра-6. Эвакуация раненых для ${u.call}, площадка на месте. Приём.`,`ינשוף, כאן צפע. פינוי פצועים עבור ${u.call}, המנחת במקום. עבור.`,`Angel, this is Cobra-6. Casualty evacuation for ${u.call}, LZ on site. Over.`),{k:'med',x:u.x,y:u.y,lz,uid:u.id});}
function wdGo(u,h,pt){S.wd=S.wd||[];const evac=u.men<=1;
  chq(evac?T3(`${h.call}, я Кобра-6. Забрать раненых ${u.call} и отходить: ${placeTxt(pt.x,pt.y)}. Приём.`,`${h.call}, כאן צפע. לאסוף את הפצועים של ${u.call} ולסגת: ${placeTxt(pt.x,pt.y)}. עבור.`,`${h.call}, this is Cobra-6. Pick up ${u.call}'s wounded and withdraw: ${placeTxt(pt.x,pt.y)}. Over.`)
    :T3(`${h.call}, я Кобра-6. Прикрыть отход ${u.call}. Приём.`,`${h.call}, כאן צפע. לחפות על נסיגת ${u.call}. עבור.`,`${h.call}, this is Cobra-6. Cover ${u.call}'s withdrawal. Over.`));
  S.wd.push({uid:u.id,hid:h.id,tx:pt.x,ty:pt.y,ph:evac?'pick':'cover',evac,t0:S.t,fireT:0,prev:h.lastOrd||null});h.wdHelp=1;
  const dx=h.x-u.x,dy=h.y-u.y,d=Math.hypot(dx,dy)||1,r=evac?0:Math.min(40,d);orderExec(h,{kind:'move',x:u.x+dx/d*r,y:u.y+dy/d*r,quiet:true,wd:1});h.ftMode='push';h.ftT=S.t;h.ftSaid=1;
  say(h,evac?T3(`Я ${h.call}. Принял, идём за ${u.call}.`,`כאן ${h.call}. רות, יוצאים לאסוף את ${u.call}.`,`This is ${h.call}. Roger, going for ${u.call}.`):T3(`Я ${h.call}. Принял, прикрываем ${u.call}.`,`כאן ${h.call}. רות, מחפים על ${u.call}.`,`This is ${h.call}. Roger, covering ${u.call}.`),[],{known:'st'});}
function wdTick(dt){const L=S.wd;if(!L||!L.length)return;
  for(const W of L.slice()){const u=U_(W.uid),h=U_(W.hid);const end=()=>{L.splice(L.indexOf(W),1);if(h)h.wdHelp=0;if(u)u.wdHide=0;};
    if(!u||!h){end();continue;}
    // the helper itself is badly hit: the cover has failed
    if(h.men<=1||h.men<(h.max0||h.men)*.4){end();const both=()=>{chq(T3(`${u.call}, ${h.call}, я Кобра-6. Отходить обоим: ${placeTxt(W.tx,W.ty)}. Приём.`,`${u.call}, ${h.call}, כאן צפע. שניכם לסגת: ${placeTxt(W.tx,W.ty)}. עבור.`,`${u.call}, ${h.call}, this is Cobra-6. Both withdraw: ${placeTxt(W.tx,W.ty)}. Over.`));for(const v of [u,h])if(v.men>1)orderExec(v,{kind:'retreat',x:W.tx,y:W.ty,plain:true,quiet:true});};
      critSay(h,T3(`Кобра-6, я ${h.call}. Прикрытие сорвано, у нас тяжёлые потери. Приём.`,`צפע, כאן ${h.call}. החיפוי נכשל, יש לנו אבדות כבדות. עבור.`,`Cobra-6, this is ${h.call}. The cover has failed, we have heavy losses. Over.`),
        critReq({key:'wdx'+h.id,valid:()=>h.men+h.wounded>0,btns:[{t:T3('Отходить обоим','שניהם לסגת','Both withdraw'),fn:both},{t:T3('Держаться','להחזיק','Hold on'),fn:()=>{}}]}));continue;}
    if(W.ph==='cover'){const foes=u.cont.length?u.cont:(u.lastCont||[]);const hits=h.cont.filter(id=>foes.includes(id));
      if(hits.length){W.fireT+=dt;for(const id of hits){const e=E_(id);if(e)e.sup=Math.min(100,(e.sup||0)+25*dt);}}
      const pinned=foes.map(E_).filter(e=>e&&e.men>0).every(e=>(e.sup||0)>60);
      if(W.fireT>=15&&pinned||W.fireT>=25||!u.cont.length&&S.t-(u.contT||0)>20||S.t-W.t0>150){W.ph='go';
        u.posOn=0;u.posCov=0;u.resume=null;u.threats=[];u.ftMode=null;u.ftPend=0;u.inB=0;occSet(u.id,0,null);u.st='retreat';u.tx=W.tx;u.ty=W.ty;u.pkey=null;delete S.marks.ord[u.id];
        for(const id of u.cont){const e=E_(id);if(e)e.cont=e.cont.filter(x=>x!==u.id);}u.cont=[];u.wdHide=S.t+45;
        say(u,T3(`Кобра-6, я ${u.call}. Отрываемся под прикрытием ${h.call}, отходим: ${placeTxt(W.tx,W.ty)}.`,`צפע, כאן ${u.call}. מתנתקים בחיפוי של ${h.call}, נסוגים: ${placeTxt(W.tx,W.ty)}.`,`Cobra-6, this is ${u.call}. Breaking off under ${h.call}'s cover, withdrawing: ${placeTxt(W.tx,W.ty)}.`),[],{urgent:true,known:'st'});}}
    else if(W.ph==='pick'){if(Math.hypot(h.x-u.x,h.y-u.y)<25){W.ph='go';h.wounded+=u.wounded;u.wounded=0;u.wdHide=S.t+600;
        orderExec(h,{kind:'retreat',x:W.tx,y:W.ty,plain:true,quiet:true,wd:1});
        say(h,T3(`Кобра-6, я ${h.call}. Раненых ${u.call} забрали, отходим: ${placeTxt(W.tx,W.ty)}.`,`צפע, כאן ${h.call}. אספנו את הפצועים של ${u.call}, נסוגים: ${placeTxt(W.tx,W.ty)}.`,`Cobra-6, this is ${h.call}. We have ${u.call}'s wounded, withdrawing: ${placeTxt(W.tx,W.ty)}.`),[],{urgent:true,known:'st'});}
      else if(S.t-W.t0>420)end();}
    else if(W.ph==='go'){if(W.evac){u.x=h.x+4;u.y=h.y+4;S.marks.own[u.id]={x:u.x,y:u.y};} // carried along
      const who=W.evac?h:u,at=Math.hypot(who.x-W.tx,who.y-W.ty)<35||who.st==='hold';
      if(at||S.t-W.t0>600){end();
        if(W.evac){const r=critReq({key:'an'+h.id,valid:()=>h.wounded>0,btns:[{t:T3('Вызвать Ангела','להזעיק ינשוף','Call Angel'),fn:()=>angelTo(h)},{t:T3('Позже','אחר כך','Later'),fn:()=>{}}]});
          critSay(h,T3(`Кобра-6, я ${h.call}. Раненых ${u.call} вынесли, раненых у нас ${h.wounded}. Нужен Ангел. Приём.`,`צפע, כאן ${h.call}. פינינו את הפצועים של ${u.call}, יש אצלנו ${h.wounded} פצועים. צריך ינשוף. עבור.`,`Cobra-6, this is ${h.call}. ${u.call}'s wounded are out, ${h.wounded} wounded with us. Need Angel. Over.`),r);}
        else{say(h,T3(`Кобра-6, я ${h.call}. Отход ${u.call} прикрыли, возвращаемся к задаче.`,`צפע, כאן ${h.call}. חיפינו על נסיגת ${u.call}, חוזרים למשימה.`,`Cobra-6, this is ${h.call}. ${u.call}'s withdrawal covered, back to our task.`),[],{known:'st'});
          if(W.prev)orderExec(h,Object.assign({},W.prev,{quiet:true}));}}}}}
// map: the helper's line to the team it covers
function drawWdLines(c){const L=S.wd;if(!L||!L.length)return;c.save();c.setLineDash([6,5]);c.lineWidth=2.2;c.strokeStyle='rgba(31,111,176,.9)';
  for(const W of L){const a=S.marks.own[W.hid],b=S.marks.own[W.uid];if(!a||!b)continue;const [x1,y1]=toS(a.x,a.y),[x2,y2]=toS(b.x,b.y);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    const [tx,ty]=toS(W.tx,W.ty);c.beginPath();c.moveTo(x2,y2);c.lineTo(tx,ty);c.stroke();}
  c.restore();}

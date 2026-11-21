function findCover(u,en){for(const r of [8,15,24,34,46])for(let a=0;a<16;a++){const x=u.x+Math.cos(a*Math.PI/8)*r,y=u.y+Math.sin(a*Math.PI/8)*r;if(x<0||y<0||x>MWm||y>MHm)continue;if(!navFree(Math.floor(x/NG),Math.floor(y/NG)))continue;if(en.some(e=>losPtE(x,y,e)))continue;return[x,y,null,.35];}const d=debCoverPt(u,en);return d?[d[0],d[1],d[2],DEBT[d[2].t].cov]:null;}
const AUTO_ST=['move','hold','cordon','recon','snipe','obs','aim','search'];
function resumeOrder(u){const r=u.resume;u.resume=null;if(!r){u.st='hold';u.tx=u.x;u.ty=u.y;return;}
  if(r.st==='hold'||r.st==='cordon'){u.st='hold';u.tx=u.x;u.ty=u.y;return;}
  u.st=r.st==='obs'?'recon':r.st==='aim'?'snipe':r.st==='search'?'move':r.st;u.tx=r.tx;u.ty=r.ty;u.tb=r.tb;if(r.st==='search')u.searchOn=true;u.pkey=null;}
const STUCK_TXT=(u,e)=>(HE?(`צפע, כאן ${u.call}. אי אפשר לעקוף: הרחובות בטווח אש, האויב ${e.bld&&!outside(e)?'במבנה '+e.bld:placeTxt(e.x,e.y)}. מחזיקים מחסה, מחכים להוראות.`):((EN?(`Cobra-6, this is ${u.call}. Can't get around: the streets are covered by fire, enemy ${e.bld&&!outside(e)?'in building '+e.bld:placeTxt(e.x,e.y)}. Holding cover, awaiting orders.`):(`Кобра-6, я ${u.call}. Обойти не удаётся: улицы простреливаются, противник ${e.bld&&!outside(e)?'в здании '+e.bld:placeTxt(e.x,e.y)}. Держим укрытие, ждём указаний.`))));
function leaderDecide(u){
  u.avoid=(u.avoid||[]).filter(a=>a.until>S.t);
  const en=(u.threats||[]).map(E_).filter(e=>e&&!e.gone&&e.men>0);
  if(!en.length){if(S.t-(u.contT||0)>20){const was=u.resume&&!['hold','cordon'].includes(u.resume.st);u.threats=[];u.byp=0;resumeOrder(u);if(was)u.resumeNote=true;}return;}
  const ourFP=u.men*(u.ammo>0?1:.2)*(u.uc?1.3:1)*(u.sup>60?.5:1)*(u.q||1);
  const enMen=en.reduce((s,e)=>s+e.men,0),enFP=en.reduce((s,e)=>s+e.men*(e.sup>60?.5:1)*(e.bld&&!outside(e)?1.5:1),0);
  const ratio=ourFP/Math.max(.5,enFP);const mission=u.resume?u.resume.st:'hold';
  const stealth=['recon','snipe','obs','aim'].includes(mission)&&!S.alarm,heavyW=u.wounded>=Math.max(2,u.men/2),lowAmmo=u.ammo<20,holding=mission==='hold'||mission==='cordon';
  const tgt=en.find(e=>e.bld&&!outside(e)&&!BN(e.bld).prot&&!S.destroyed[e.bld]);
  const addAvoid=r=>{for(const e of en)u.avoid.push({x:e.x,y:e.y,r,bld:e.bld&&!outside(e)?e.bld:0,until:S.t+1800});};
  const stuck=()=>{if(!u.stuckRep){u.stuckRep=1;say(u,STUCK_TXT(u,en[0]),[],{urgent:true,known:'st'});}};
  if(!holding&&!stealth&&ratio>=2&&enMen<=4&&u.men>=5&&u.ammo>40&&!heavyW&&tgt){const b=tgt.bld,B=BN(b);
    u.st='assault';u.tb=b;u.tx=B.cx;u.ty=B.cy;u.pkey=null;u.autoAs=true;u.threats=[];
    u.method=S.marks.bied&&S.marks.bied[b]?(u.sap?'sapper':'wall'):(u.sap?'sapper':'door');say(u,ASSAULT_TXT(u,b),[bChip(b,'hos')],{urgent:true,known:'st',pid:b});return;}
  if(ratio<.8||heavyW||stealth||lowAmmo){const why=heavyW?WHY_W:lowAmmo?WHY_AMMO:stealth?WHY_STEALTH:WHY_STRONG;
    if(holding||!u.resume){addAvoid(180);u.threats=[];const e0=en[0];const dx=u.x-e0.x,dy=u.y-e0.y,d=Math.hypot(dx,dy)||1;u.resume=null;u.st='move';u.tx=clamp(u.x+dx/d*120,0,MWm);u.ty=clamp(u.y+dy/d*120,0,MHm);u.pkey=null;say(u,WITHDRAW_TXT(u,why),[],{urgent:true,known:'st'});u.cont=[];return;}
    if((u.byp||0)>=2){stuck();return;}
    u.byp=(u.byp||0)+1;addAvoid(180);u.threats=[];resumeOrder(u);say(u,BYPASS_TXT(u,why),[],{urgent:true,known:'st'});u.cont=[];return;}
  if(!u.cont.length){if(S.t-(u.contT||0)>30){const was=u.resume&&!['hold','cordon'].includes(u.resume.st);
      if(was){if((u.byp||0)>=2){stuck();return;}u.byp=(u.byp||0)+1;addAvoid(180);}
      u.threats=[];resumeOrder(u);if(was)u.resumeNote=true;}return;}
  {const pin=u.sup>60;if(pin&&!u.holdPin&&(!u.holdRep||S.t-u.holdRep>120)){u.holdRep=S.t;say(u,HOLD_TXT(u),[],{known:'st',urgent:true});}u.holdPin=pin;}/* only "pinned down" is news; holding cover is what a team in a fight does anyway */}
const RESUME_TXT=u=>(HE?(`צפע, כאן ${u.call}. האש פסקה, ממשיכים במשימה.`):((EN?(`Cobra-6, this is ${u.call}. Fire has stopped, continuing the task.`):(`Кобра-6, я ${u.call}. Огонь стих, продолжаем задачу.`))));const ASSAULT_TXT=(u,b)=>(HE?(`צפע, כאן ${u.call}. עליונות האש שלנו, האויב מעט. מאגפים ופורצים למבנה ${b}.`):((EN?(`Cobra-6, this is ${u.call}. We have fire superiority, few enemy. Flanking and assaulting building ${b}.`):(`Кобра-6, я ${u.call}. Огневое превосходство наше, противника немного. Обходим с фланга и штурмуем здание ${b}.`))));const BYPASS_TXT=(u,why)=>(HE?(`צפע, כאן ${u.call}. ${why} מתנתקים ועוקפים ברחוב אחר.`):((EN?(`Cobra-6, this is ${u.call}. ${why} Breaking contact, going around by another street.`):(`Кобра-6, я ${u.call}. ${why} Разрываем контакт, обходим другой улицей.`))));const WITHDRAW_TXT=(u,why)=>(HE?(`צפע, כאן ${u.call}. ${why} מתנתקים ויוצאים מטווח האש.`):((EN?(`Cobra-6, this is ${u.call}. ${why} Breaking contact, getting out from under fire.`):(`Кобра-6, я ${u.call}. ${why} Разрываем контакт, отходим из-под огня.`))));const HOLD_TXT=u=>(HE?(`צפע, כאן ${u.call}. מחזיקים מחסה ויורים. ${u.sup>60?(S.mission?'מרותקים באש כבדה, צריך עזרה.':'מרותקים באש כבדה, צריך סיוע של «שרף».'):'האויב מתנגד.'}`):((EN?(`Cobra-6, this is ${u.call}. Holding cover, returning fire. ${u.sup>60?(S.mission?'Pinned down by heavy fire, need help.':'Pinned down by heavy fire, need Hammer support.'):'The enemy is resisting.'}`):(`Кобра-6, я ${u.call}. Держим укрытие, ведём огонь. ${u.sup>60?(S.mission?'Прижаты плотным огнём, нужна помощь.':'Прижаты плотным огнём, нужна поддержка «Молота».'):'Противник сопротивляется.'}`))));
const WHY_STRONG=(HE?('האויב חזק יותר.'):((EN?("The enemy is stronger."):('Противник сильнее.')))),WHY_W=(HE?('יש הרבה פצועים.'):((EN?("Too many wounded."):('Много раненых.')))),WHY_STEALTH=(HE?('המשימה חשאית, הקרב מפריע לה.'):((EN?("The task is covert, the fight gets in the way."):('Задача скрытная, бой ей мешает.')))),WHY_AMMO=(HE?('מעט תחמושת.'):((EN?("Low on ammo."):('Мало патронов.'))));
function moveAlong(o,step){const key=Math.round(o.tx)+','+Math.round(o.ty)+'/'+((o.avoid&&o.avoid.length)||0);if(o.pkey!==key||!o.path){AV=o.avoid&&o.avoid.length?avoidMask(o.avoid):null;o.path=null;if(o.veh&&NAVV){const n0=NAV;NAV=NAVV;FP_OK=true;const p=findPath(o.x,o.y,o.tx,o.ty);NAV=n0;if(FP_OK)o.path=p;}if(!o.path)o.path=findPath(o.x,o.y,o.tx,o.ty);AV=null;o.pkey=key;}
  if(!o.veh)step*=slowAt(o.x,o.y);
  while(step>0&&o.path.length){const p=o.path[0];const d=Math.hypot(p[0]-o.x,p[1]-o.y);if(d<=step){o.x=p[0];o.y=p[1];step-=d;o.path.shift();}else{o.x+=(p[0]-o.x)/d*step;o.y+=(p[1]-o.y)/d*step;step=0;}}
  return o.path.length===0;}
function resonance(){return(S.reson||0)+(S.civDead||0)*2+(S.civW?S.civW.length:0)+Object.keys(S.destroyed||{}).length+Math.floor(dmgCount()/3)+(S.noWarn||0);}
const resLevel=p=>p>=7?(HE?('גבוהה'):((EN?("high"):('высокий')))):p>=3?(HE?('בינונית'):((EN?("noticeable"):('заметный')))):(HE?('נמוכה'):((EN?("low"):('низкий'))));
function stepTo(o,tx,ty,step){const dx=tx-o.x,dy=ty-o.y,d=Math.hypot(dx,dy);if(d<=step||d<1e-6){o.x=tx;o.y=ty;return true;}o.x+=dx/d*step;o.y+=dy/d*step;return false;}
function raiseAlarm(){if(S.alarm)return;S.alarm=true;S.alarmT0=S.t;
  for(const e of alive()){e.alert=true;
    if(e.kind==='leader'&&e.leader&&infs().some(u=>u.men>=3&&Math.hypot(u.x-e.x,u.y-e.y)<120)){e.mode='defend';e.trapped=true;}
    else if(e.kind==='leader'&&e.leader){S.lpath=[[e.x,e.y]];const B=BN(S.T);if(e.men>1){const g=Object.assign({},e,{id:'eL2',men:1,max:1,leader:false,cont:[],acc:0});S.enemies.push(g);e.men-=1;}e.mode='move';e.bld=0;e.tx=B.cx;e.ty=B.cy;e.dest=S.T;e.runT=S.t;}
    else if(e.kind==='rest'||e.kind==='patrol'){const B=BN(S.L);e.mode='move';e.bld=0;e.tx=B.cx+(Math.random()-.5)*20;e.ty=B.cy+12;e.dest=S.L;}
  }}

// ---- "take position": the team goes to the point and finds cover there by itself, never inside a building ----
// 1) wreckage, ruins, an orchard or the wadi bed within 50 m; 2) otherwise the wall of a house; 3) otherwise it lies down and says so.
// Among equal spots it prefers one the known enemy cannot see.
const POS_R=50;
function posThreat(x,y){let best=null,bd=1e9;const T=S.tg&&S.tg.by;
  if(T)for(const id in T){const r=T[id];if(r.ls==null||r.hide||r.dead||S.t-r.ls>TG_GREY)continue;const d=Math.hypot(r.lx-x,r.ly-y);if(d<bd){bd=d;best={x:r.lx,y:r.ly};}}
  if(!best&&S.mission&&S.obj)best={x:S.obj.x,y:S.obj.y};return best;}
function posPick(x,y){const th=posThreat(x,y),hid=(px,py)=>!th||!los(px,py,th.x,th.y),cands=[];
  for(const r of [0,6,12,18,26,34,42,POS_R])for(let a=0;a<(r?16:1);a++){const px=x+Math.cos(a*Math.PI/8)*r,py=y+Math.sin(a*Math.PI/8)*r;
    if(px<0||py<0||px>MWm||py>MHm||!navFree(px/NG|0,py/NG|0))continue;cands.push([px,py,r]);}
  let best=null;
  for(const [px,py,r] of cands){const dc=debCov(px,py),nat=!inTown(px,py)&&coverAt(px,py);if(!dc&&!nat)continue;
    const s=r+(hid(px,py)?0:25)+(dc?dc*40:20);if(!best||s<best.s)best={x:px,y:py,s,k:'cover',cov:dc||.5,d:dc?debNear(px,py,4):null,nat:!dc};}
  if(best)return best;
  // against a wall: a house right next to the street; in villages houses stand back in their yards, then the yard wall
  for(const [px,py,r] of cands){const cx=px/NG|0,cy=py/NG|0;let kind=null;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=(cx+dx+.5)*NG,ny=(cy+dy+.5)*NG,k=blockOf(nx,ny);if(!k||k.lot||k.road)continue;if(bldAt(nx,ny,6)){kind='wall';break;}kind=kind||'fence';}
    if(!kind)continue;const s=r+(hid(px,py)?0:25)+(kind==='fence'?8:0);if(!best||s<best.s)best={x:px,y:py,s,k:kind,cov:kind==='wall'?.45:.5};}
  return best||{x,y,k:'prone',cov:.6};}
function posArrive(u){
  if(u.posOn===1){const p=posPick(u.x,u.y);u.posP=p;u.posOn=2;if(Math.hypot(p.x-u.x,p.y-u.y)>3){u.st='move';u.tx=p.x;u.ty=p.y;u.pkey=null;return true;}}
  if(u.posOn!==2)return false;const p=u.posP;u.posOn=0;u.st='hold';u.tx=u.x;u.ty=u.y;u.posCov=p.cov;delete S.marks.ord[u.id];
  const th=posThreat(u.x,u.y),sec=th?T3(` Наблюдаем на ${DIRS_TO[dirIdx(th.x-u.x,th.y-u.y)]}.`,` מתצפתים ל${DIRS_TO[dirIdx(th.x-u.x,th.y-u.y)]}.`,` Watching ${DIRS_TO[dirIdx(th.x-u.x,th.y-u.y)]}.`):'';
  const inOrch=M.orch&&M.orch.some(o=>u.x>o.x0&&u.x<o.x1&&u.y>o.y0&&u.y<o.y1);
  const where=p.k==='cover'?(p.d?debAt(p.d)+' ':p.nat?(inOrch?T3('в саду, ','במטע, ','in the orchard, '):T3('в русле вади, ','בערוץ הוואדי, ','in the wadi bed, ')):T3('рядом с руинами, ','ליד ההריסות, ','by the ruins, ')):'';
  const wb=p.k==='wall'?bldAt(u.x,u.y,15):null,loc=p.k==='fence'?T3('у ограды двора, ','צמודים לגדר של חצר, ','against a yard wall, ')+placeTxt(u.x,u.y):wb?T3(`у стены здания ${wb.n}, квадрат ${cell(u.x,u.y)}`,`צמודים לקיר של מבנה ${wb.n}, משבצת ${cell(u.x,u.y)}`,`against the wall of building ${wb.n}, grid ${cell(u.x,u.y)}`):where+placeTxt(u.x,u.y);
  const txt=p.k==='prone'?T3(`Кобра-6, я ${u.call}. Укрытий и построек рядом нет, залегли: ${placeTxt(u.x,u.y)}.${sec} Приём.`,`צפע, כאן ${u.call}. אין מחסה ואין מבנים בקרבת מקום, שכבנו: ${placeTxt(u.x,u.y)}.${sec} עבור.`,`Cobra-6, this is ${u.call}. No cover and no buildings nearby, lying prone: ${placeTxt(u.x,u.y)}.${sec} Over.`)
    :T3(`Кобра-6, я ${u.call}. Заняли позицию ${loc}.${sec} Приём.`,`צפע, כאן ${u.call}. תפסנו עמדה ${loc}.${sec} עבור.`,`Cobra-6, this is ${u.call}. In position ${loc}.${sec} Over.`);
  say(u,txt,[],{known:'st',act:{k:'clrOrd',uid:u.id}});return true;}

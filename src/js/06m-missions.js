/* ---------- missions: our forces against a regular army; "king of the hill" race to plant a charge in the town center ---------- */
const MIS_KEY=HE?'reshet-mission-he':EN?'reshet-mission-en':'reshet-mission-ru';
let MS=null;
const T3=(ru,he,en)=>HE?he:EN?en:ru;
// Russian Armed Forces, open sources only. Numbers are game conventions.
const RUF={
 sso:{n:['ССО','כוחות מבצעים מיוחדים','SSO'],men:8,q:1.15,
  pub:['Силы специальных операций ВС России. Управление создано в 2009 году на базе 322-го центра ГРУ, о создании ССО объявлено в марте 2013 года. По открытым данным, действовали в Крыму (2014) и в Сирии (с 2015).','כוחות המבצעים המיוחדים של צבא רוסיה. המפקדה הוקמה ב-2009 על בסיס מרכז 322 של ה-GRU, ועל הקמת הכוחות הוכרז במרץ 2013. לפי מקורות פתוחים פעלו בקרים (2014) ובסוריה (מ-2015).','Special Operations Forces of the Russian Armed Forces. The directorate was created in 2009 from the GRU 322nd center, and the forces were announced in March 2013. According to open sources they operated in Crimea (2014) and Syria (from 2015).'],
  gm:['Малая группа высокой выучки: самые точные и стойкие.','צוות קטן ומיומן מאוד: המדויקים והעמידים ביותר.','Small, highly trained team: the most accurate and resilient.'],src:'https://en.wikipedia.org/wiki/Special_Operations_Forces_(Russia)'},
 spn:{n:['Спецназ ГРУ','ספצנאז GRU','GRU Spetsnaz'],men:8,q:1.05,
  pub:['Части специального назначения военной разведки России. По открытым данным, их задача — разведка и диверсии; их называют элитной пехотой, поддерживающей общевойсковые соединения.','יחידות המיוחדות של המודיעין הצבאי הרוסי. לפי מקורות פתוחים משימתן סיור וחבלה; מתארים אותן כחי״ר מובחר התומך בעוצבות.','Special purpose units of Russian military intelligence. According to open sources their task is reconnaissance and sabotage; they are described as elite infantry supporting conventional formations.'],
  gm:['Разведывательно-диверсионная группа: точный огонь, скрытное выдвижение.','צוות סיור וחבלה: אש מדויקת, תנועה חשאית.','Reconnaissance and sabotage team: accurate fire, stealthy movement.'],src:'https://en.wikipedia.org/wiki/Spetsnaz_GRU'},
 vdv:{n:['ВДВ','כוחות מוטסים','VDV'],men:16,q:.95,
  pub:['Воздушно-десантные войска России, образованы указом от 7 мая 1992 года. Роли по открытым данным: лёгкая, воздушно-десантная, аэромобильная и механизированная пехота; с 2013 года — ядро сил быстрого реагирования.','הכוחות המוטסים של רוסיה, הוקמו בצו מ-7 במאי 1992. לפי מקורות פתוחים: חי״ר קל, מוצנח, מוסק וממוכן; מ-2013 — הליבה של כוחות התגובה המהירה.','Russian Airborne Forces, established by decree of 7 May 1992. According to open sources: light, airborne, airmobile and mechanized infantry; since 2013 the core of the rapid reaction forces.'],
  gm:['Десантно-штурмовой взвод: напористый штурм.','מחלקת הסתערות מוטסת: הסתערות נמרצת.','Air assault platoon: aggressive assault.'],src:'https://en.wikipedia.org/wiki/Russian_Airborne_Forces'},
 mp:{n:['Морская пехота','חי״ר ימי','Naval Infantry'],men:16,q:.92,
  pub:['Морская пехота — десантные войска ВМФ России; в советском флоте воссоздана в 1961 году. По открытым данным, исторически тесно связана с ВДВ.','החי״ר הימי — כוח הנחיתה של הצי הרוסי; הוקם מחדש בצי הסובייטי ב-1961. לפי מקורות פתוחים קשור היסטורית לכוחות המוטסים.','Naval Infantry — the amphibious force of the Russian Navy; re-formed in the Soviet Navy in 1961. According to open sources it has close historical ties with the VDV.'],
  gm:['Взвод морской пехоты: штурмовые действия.','מחלקת חי״ר ימי: פעולות הסתערות.','Naval infantry platoon: assault operations.'],src:'https://en.wikipedia.org/wiki/Russian_Naval_Infantry'},
 msv:{n:['Мотострелки','חי״ר ממוכן','Motor Riflemen'],men:16,q:.85,
  pub:['Мотострелковые войска — род сухопутных войск России, основа общевойсковых соединений.','חיל הרובאים הממוכן — זרוע של כוחות היבשה הרוסיים, הבסיס של העוצבות.','Motor Rifle Troops — a combat arm of the Russian Ground Forces and the core of combined-arms formations.'],
  gm:['Мотострелковый взвод: много стволов, удерживает позиции.','מחלקת חי״ר ממוכן: הרבה קני ירי, מחזיקה עמדות.','Motor rifle platoon: many rifles, holds positions.'],src:'https://en.wikipedia.org/wiki/Russian_Ground_Forces'},
 isp:{n:['Инженерно-сапёрные','הנדסה קרבית','Combat Engineers'],men:6,q:.85,sap:true,
  pub:['Инженерные войска России: инженерная разведка, разминирование, заграждения и подрывные работы.','כוחות ההנדסה של רוסיה: סיור הנדסי, פינוי מוקשים, מכשולים והריסות.','Russian Engineer Troops: engineer reconnaissance, mine clearing, obstacles and demolitions.'],
  gm:['Сапёры: быстрее ставят и обезвреживают заряд.','חבלנים: מציבים ומנטרלים מטען מהר יותר.','Sappers: plant and defuse charges faster.'],src:'https://en.wikipedia.org/wiki/Russian_Ground_Forces'}};
// analogs: which Russian unit answers each of our units
const ANALOG={ym:'spn',dv:'spn',mg:'sso',eg:'sso',sgol:'spn',stz:'spn',sgv:'spn',snh:'spn',gol:'msv',tz:'vdv',gv:'mp',nh:'msv',kf:'msv',yh:'isp'};
const NATIONS=[['ru',['Россия','רוסיה','Russia'],true],['x1',['Другие страны — позже','מדינות נוספות — בהמשך','More countries — later'],false]];
const PLANT_T=60,PLANT_SAP=40,DET_T=300,HOLD_R=70;
function loadMS(){let d=null;try{d=JSON.parse(localStorage.getItem(MIS_KEY)||'null');}catch(e){}if(!d||!d.seed)d={seed:1000+rnd(9000),diff:1,dens:'normal',sel:['ym','eg','gol','yh'],nation:'ru'};d.sel=(d.sel||[]).filter(t=>TU[t]&&!TU[t].off);return d;}
function saveMS(){try{localStorage.setItem(MIS_KEY,JSON.stringify(MS));localStorage.setItem(MODE_KEY,MODE);}catch(e){}}
function enemyOrder(o){const r=mulberry(o.seed*7+o.diff*3+11);let list=o.sel.map(t=>ANALOG[t]).filter(Boolean);
  if(!list.length)list=['msv','spn'];if(o.diff===0&&list.length>=3)list.splice(list.findIndex(t=>t!=='isp'),1);
  if(o.diff>=2)list.push('msv');if(o.diff>=3)list.push('vdv');if(!list.includes('isp')&&r()<.6)list.push('isp');return list.slice(0,8);}
const ourMen=sel=>sel.reduce((s,t)=>s+(TU[t].men||0),0);
const enMen=o=>enemyOrder(o).reduce((s,t)=>s+Math.round(RUF[t].men*(o.diff===0?.8:1)),0);
function newMissionState(o){const st=newState({seed:o.seed,diff:o.diff,dens:o.dens,sel:o.sel});
  st.mission=true;st.train=false;st.city.g=3;st.opName=['Миссия','משימה','Mission'];st.traps={};st.ieds=[];st.decoy=0;st.alarm=true;st.alarmT0=0;st.mob=true;st.mobK=0;
  const O=nearFree(M.avx[0],M.avy[0])||[M.cx/NG|0,M.cy/NG|0];const ox=O[0]*NG+NG/2,oy=O[1]*NG+NG/2;st.obj={x:ox,y:oy};
  const d=Math.max(500,Math.min(oy-60,1150,2100-oy));const ours=nearFree(ox,oy+d)||[ox/NG|0,(oy+d)/NG|0],theirs=nearFree(ox,oy-d)||[ox/NG|0,(oy-d)/NG|0];
  st.ourBase={x:ours[0]*NG,y:ours[1]*NG};st.enBase={x:theirs[0]*NG,y:theirs[1]*NG};
  st.units.filter(u=>u.type==='inf').forEach((u,i)=>{u.pace='fast';u.x=st.ourBase.x-90+(i%4)*60;u.y=st.ourBase.y+Math.floor(i/4)*40;u.tx=u.x;u.ty=u.y;st.marks.own[u.id]={x:u.x,y:u.y};});
  const ya=st.units.find(u=>u.type==='uav');if(ya){ya.x=ox;ya.y=oy+200;}st.uav={x:ox,y:oy+200,tx:ox,ty:oy+200};
  const order=enemyOrder(o);const b0=BL[0].n;
  st.enemies=order.map((t,i)=>{const R=RUF[t];const g=grp('a'+i,'army',Math.round(R.men*(o.diff===0?.8:1)),b0,{alert:true,rt:t,q:(R.q||1)+(o.diff>=3?.05:0),sap:!!R.sap,mode:'base',role:'',prog:0});
    g.bld=0;g.x=st.enBase.x-90+(i%4)*60;g.y=st.enBase.y-Math.floor(i/4)*40;g.tx=g.x;g.ty=g.y;return g;});
  st.units=st.units.filter(u=>u.id!=='mo');st.mol.st='none';st.mol.ammo=0;st.mol.gun=0;st.mol.cover=null;
  st.charge={us:null,them:null};st.mres=null;st.enOrder=order;st.aiT=0;st.contact0=0;return st;}
// ---- army AI: fire and maneuver, bounding overwatch, strongpoints, flanking, reserve, orderly withdrawal ----
const ARMY_SPD=1.45;
function armyGoTo(e,x,y,role){const p=nearFree(x,y);if(!p)return;e.mode='amove';e.role=role||e.role;e.bld=0;e.tx=p[0]*NG+NG/2;e.ty=p[1]*NG+NG/2;e.leg=0;e.pause=0;e.pkey=null;}
function strongpoint(e){const b=BL.filter(b=>!S.destroyed[b.n]&&!S.enemies.some(o=>o!==e&&!o.gone&&o.bld===b.n)).reduce((a,b)=>!a||Math.hypot(b.cx-e.x,b.cy-e.y)<Math.hypot(a.cx-e.x,a.cy-e.y)?b:a,null);
  if(b&&Math.hypot(b.cx-e.x,b.cy-e.y)<70){e.bld=b.n;e.x=b.cx;e.y=b.cy;}e.mode='hold';}
function ringPoints(n,r0,r1,side){const O=S.obj,out=[];for(let i=0;i<n;i++){const a=(side<0?Math.PI:0)+(-.9+1.8*(i+.5)/n)*Math.PI/2-Math.PI/2*(side<0?-1:1);const r=r0+(r1-r0)*((i*37)%10)/10;out.push([O.x+Math.cos(a)*r,O.y+Math.sin(a)*r*(side<0?1:1)]);}return out;}
function armyCommand(){const O=S.obj,A=alive().filter(e=>e.kind==='army'&&e.mode!=='withdraw');if(!A.length)return;const U=infs().filter(u=>u.men>0);
  const free=e=>!e.cont.length&&e.mode!=='plant'&&e.mode!=='defuse';
  const nearO=e=>Math.hypot(e.x-O.x,e.y-O.y);
  // our charge is ticking: everyone converges, the sappers defuse
  if(S.charge.us){const def=A.filter(e=>e.sap)[0]||A.reduce((a,e)=>!a||nearO(e)<nearO(a)?e:a,null);
    for(const e of A){if(!free(e))continue;if(e===def){if(nearO(e)>25)armyGoTo(e,O.x,O.y,'defuse');else{e.mode='defuse';e.role='defuse';}}else if(nearO(e)>140)armyGoTo(e,O.x+(e.x-O.x)*.3,O.y+(e.y-O.y)*.3,'support');}return;}
  // their charge is ticking: hold strongpoints around the objective
  if(S.charge.them){const pts=ringPoints(A.length,60,150,-1);A.forEach((e,i)=>{if(!free(e))return;if(e.mode==='hold'&&nearO(e)<190)return;armyGoTo(e,pts[i][0],pts[i][1],'defend');});return;}
  // race: carrier with escort to the objective, overwatch takes buildings on the near side, one reserve held back
  let carrier=A.find(e=>e.role==='carrier');if(!carrier){carrier=A.filter(e=>e.sap)[0]||A.reduce((a,e)=>!a||e.men*e.q>a.men*a.q?e:a,null);carrier.role='carrier';}
  const others=A.filter(e=>e!==carrier);const reserve=others.length>=3?others.reduce((a,e)=>!a||e.men<a.men?e:a,null):null;
  const escort=others.filter(e=>e!==reserve).sort((a,b)=>nearO(a)-nearO(b))[0];
  const ow=others.filter(e=>e!==reserve&&e!==escort);const pts=ringPoints(Math.max(1,ow.length),90,170,-1);
  if(free(carrier)&&carrier.mode!=='hold'||carrier.mode==='base'){if(nearO(carrier)>25)armyGoTo(carrier,O.x,O.y,'carrier');}
  if(carrier.mode==='hold'&&nearO(carrier)<30&&!carrier.cont.length){carrier.mode='plant';carrier.prog=carrier.prog||0;}
  if(escort&&free(escort)&&(escort.mode==='base'||escort.mode==='hold'&&nearO(escort)>120))armyGoTo(escort,(carrier.tx+carrier.x)/2,(carrier.ty+carrier.y)/2+20,'escort');
  ow.forEach((e,i)=>{if(free(e)&&(e.mode==='base'||e.mode==='hold'&&e.role!=='overwatch'))armyGoTo(e,pts[i][0],pts[i][1],'overwatch');});
  if(reserve&&free(reserve)&&reserve.mode==='base'&&(S.t-T0>480||S.contact0))armyGoTo(reserve,O.x,O.y-120,'reserve');
  // a group in contact is supported by a neighbour that flanks the enemy
  for(const e of A){if(!e.cont.length||e.flankCalled&&S.t-e.flankCalled<120)continue;const u=U_(e.cont[0]);if(!u)continue;
    const helper=A.filter(o=>o!==e&&free(o)&&o.role!=='carrier'&&Math.hypot(o.x-e.x,o.y-e.y)<450).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
    if(helper){const dx=u.x-e.x,dy=u.y-e.y,l=Math.hypot(dx,dy)||1,s=helper.id.charCodeAt(1)%2?1:-1;armyGoTo(helper,u.x-dy/l*110*s,u.y+dx/l*110*s,'flank');helper.flankT=S.t;e.flankCalled=S.t;}}
  for(const e of A)if(e.role==='flank'&&e.mode==='hold'&&S.t-(e.flankT||0)>150)e.role='overwatch';}
function armyTick(dt){const O=S.obj,U=infs();
  for(const e of alive()){if(e.kind!=='army')continue;
    if(e.mode!=='withdraw'&&e.men<=Math.ceil(e.max*.35)){e.mode='withdraw';e.bld=0;const p=nearFree(S.enBase.x,S.enBase.y);e.tx=p[0]*NG;e.ty=p[1]*NG;e.pkey=null;if(e.role==='carrier')e.role='';}
    if(e.mode==='withdraw'){if(moveAlong(e,ARMY_SPD*1.2*dt)){e.gone=true;S.enWithdrawn=(S.enWithdrawn||0)+e.men;}continue;}
    if(e.cont.length){S.contact0=S.contact0||S.t;if(e.mode==='amove')strongpoint(e);if(e.mode==='plant'||e.mode==='defuse'){e.mode='hold';}continue;}
    if(e.mode==='amove'){if((e.sup||0)>60)continue;if(e.pause>0){e.pause-=dt;continue;}
      if(moveAlong(e,ARMY_SPD*dt)){const atO=Math.hypot(e.x-O.x,e.y-O.y)<30;if(atO&&e.role==='carrier'&&!S.charge.them){e.mode='plant';e.prog=e.prog||0;}else if(atO&&e.role==='defuse'){e.mode='defuse';}else strongpoint(e);}
      else{e.leg=(e.leg||0)+ARMY_SPD*dt;if(e.leg>110&&e.role!=='defuse'){e.leg=0;e.pause=15;}}}
    else if(e.mode==='plant'||e.mode==='defuse'){const busy=U.some(u=>u.men>0&&Math.hypot(u.x-e.x,u.y-e.y)<HOLD_R);if(busy)continue;e.prog=(e.prog||0)+dt;
      if(e.prog>=(e.sap?PLANT_SAP:PLANT_T)){e.prog=0;if(e.mode==='plant'&&!S.charge.them){S.charge.them={tDet:S.t+DET_T};e.mode='hold';say({call:T3('Разведка','מודיעין','Intel'),type:'x'},T3(`Кобра-6, я Разведка. Перехват: противник установил заряд на объекте. Подрыв примерно в ${fmt(S.t+DET_T)}. Приём.`,`צפע, כאן מודיעין. יירוט: האויב הציב מטען ביעד. פיצוץ בערך ב-${fmt(S.t+DET_T)}. עבור.`,`Cobra-6, this is Intel. Intercept: the enemy has planted a charge at the objective. Detonation at about ${fmt(S.t+DET_T)}. Over.`),[],{urgent:true});}
        else if(e.mode==='defuse'&&S.charge.us){S.charge.us=null;e.mode='hold';say({call:T3('Разведка','מודיעין','Intel'),type:'x'},T3('Кобра-6, я Разведка. Перехват: противник обезвредил наш заряд. Приём.','צפע, כאן מודיעין. יירוט: האויב נטרל את המטען שלנו. עבור.','Cobra-6, this is Intel. Intercept: the enemy has defused our charge. Over.'),[],{urgent:true});}}}}}
function ourPlantTick(dt){const O=S.obj;for(const u of infs()){if(u.afterMove&&u.st==='hold'&&Math.hypot(u.x-O.x,u.y-O.y)<40){const k=u.afterMove;u.afterMove=null;missionAct(u,{k});}if(u.st!=='plant'&&u.st!=='defuse')continue;if(u.men<=0){u.st='hold';continue;}
    if(Math.hypot(u.x-O.x,u.y-O.y)>40){u.st='hold';continue;}
    if(u.cont.length||alive().some(e=>e.kind==='army'&&Math.hypot(e.x-O.x,e.y-O.y)<HOLD_R)){continue;}
    u.prog=(u.prog||0)+dt;if(u.prog<(u.sap?PLANT_SAP:PLANT_T))continue;u.prog=0;
    if(u.st==='plant'&&!S.charge.us){S.charge.us={tDet:S.t+DET_T,uid:u.id};u.st='hold';say(u,T3(`Кобра-6, я ${u.call}. Заряд установлен. Подрыв в ${fmt(S.t+DET_T)}. Держим объект. Приём.`,`צפע, כאן ${u.call}. המטען הוצב. פיצוץ ב-${fmt(S.t+DET_T)}. מחזיקים ביעד. עבור.`,`Cobra-6, this is ${u.call}. Charge planted. Detonation at ${fmt(S.t+DET_T)}. Holding the objective. Over.`),[],{urgent:true,known:'st'});}
    else if(u.st==='defuse'&&S.charge.them){S.charge.them=null;u.st='hold';say(u,T3(`Кобра-6, я ${u.call}. Заряд противника обезврежен. Приём.`,`צפע, כאן ${u.call}. מטען האויב נוטרל. עבור.`,`Cobra-6, this is ${u.call}. Enemy charge defused. Over.`),[],{urgent:true,known:'st'});}else u.st='hold';}}
function missionTick(dt){if(S.t>=S.aiT){S.aiT=S.t+8;armyCommand();}armyTick(dt);ourPlantTick(dt);
  if(S.charge.us&&S.t>=S.charge.us.tDet){S.mres='win';endGame('mwin');return;}
  if(S.charge.them&&S.t>=S.charge.them.tDet){S.mres='lose';endGame('mlose');return;}
  if(!alive().some(e=>e.kind==='army')){S.mres='win';endGame('mclear');}}
function missionEnd(why){S.over=true;clearSave();S.speed=0;S.radio.q=[];setSpeedUI();S.endWhy=why;UI.target=null;updTarget();closeSheet();
  if(!S.mres)S.mres=why==='wiped'?'lose':why==='manual'?'lose':'draw';
  S.result=S.mres==='win'?(why==='mclear'?T3('Победа: противник уничтожен или отошёл','ניצחון: האויב הושמד או נסוג','Victory: the enemy was destroyed or withdrew'):T3('Победа: наш заряд сработал','ניצחון: המטען שלנו התפוצץ','Victory: our charge detonated')):S.mres==='lose'?(why==='mlose'?T3('Поражение: сработал заряд противника','תבוסה: מטען האויב התפוצץ','Defeat: the enemy charge detonated'):T3('Поражение: группы потеряли боеспособность','תבוסה: הצוותים איבדו כשירות','Defeat: our teams are combat ineffective')):T3('Ничья: время вышло','תיקו: הזמן נגמר','Draw: time ran out');
  missionDebrief();}
function missionDebrief(){const tot=S.enemies.filter(e=>e.kind==='army').reduce((s,e)=>s+(e.max||0),0);
  $('#dTitle').textContent=T3('Итоги миссии','סיכום משימה','Mission debrief');
  $('#dMeta').textContent=`${T3('код','קוד','code')} ${codeTxt(S.city.seed)} · ${fmt(S.t)}`;$('#dRes').textContent=S.result;
  const rows=[[T3('Противник: потери','אויב: אבדות','Enemy losses'),`${S.stats.ek} / ${tot}`],[T3('Противник отошёл','אויב נסוג','Enemy withdrew'),S.enWithdrawn||0],[T3('Наши погибшие','הרוגים שלנו','Our killed'),S.stats.kia],[T3('Наши раненые','פצועים שלנו','Our wounded'),S.stats.wia],[T3('Мирные: ранены / погибли','אזרחים: פצועים / הרוגים','Civilians: wounded / killed'),`${S.civW.length} / ${S.civDead}`]];
  $('#dStat').innerHTML='';rows.forEach(([a,b])=>{const x=document.createElement('span');x.textContent=a;const y=document.createElement('b');y.textContent=b;$('#dStat').append(x,y);});
  $('#dNote').textContent=T3(`Силы противника: ${S.enOrder.map(t=>L2(RUF[t].n)).join(', ')}.`,`כוחות האויב: ${S.enOrder.map(t=>L2(RUF[t].n)).join(', ')}.`,`Enemy forces: ${S.enOrder.map(t=>L2(RUF[t].n)).join(', ')}.`);
  $('#debrief').hidden=false;$('#bEnd').hidden=true;}
function missionStartRadio(){const O=S.obj;hq(T3(`Всем станциям сети «Кобра», я Кобра-6. Миссия — начало. Задача: установить заряд на объекте в квадрате ${cell(O.x,O.y)} и удержать до подрыва. Противник идёт с севера с той же задачей. Приём.`,`כל התחנות ברשת «צפע», כאן צפע. המשימה מתחילה. המטרה: להציב מטען ביעד במשבצת ${cell(O.x,O.y)} ולהחזיק עד הפיצוץ. האויב מגיע מצפון עם אותה משימה. עבור.`,`All stations on the Cobra net, this is Cobra-6. Mission begins. Task: plant a charge at the objective in grid ${cell(O.x,O.y)} and hold it until detonation. The enemy is coming from the north with the same task. Over.`));
  infs().forEach(u=>say(u,T3(`Кобра-6, я ${u.call}. На исходной, к выдвижению готов. Приём.`,`צפע, כאן ${u.call}. בנקודת היציאה, מוכן לתנועה. עבור.`,`Cobra-6, this is ${u.call}. At the start line, ready to move. Over.`),[posChip(u)],{known:'full'}));
  say({call:T3('Разведка','מודיעין','Intel'),type:'x'},T3(`Кобра-6, я Разведка. Противник — подразделения армии России, ориентировочно ${S.enOrder.length} групп: ${[...new Set(S.enOrder)].map(t=>L2(RUF[t].n)).join(', ')}. Действуют перекатами, занимают здания как опорные пункты. Приём.`,`צפע, כאן מודיעין. האויב — יחידות של צבא רוסיה, בערך ${S.enOrder.length} צוותים: ${[...new Set(S.enOrder)].map(t=>L2(RUF[t].n)).join(', ')}. נעים בדילוגים ותופסים מבנים כנקודות חוזק. עבור.`,`Cobra-6, this is Intel. The enemy is Russian Army units, about ${S.enOrder.length} groups: ${[...new Set(S.enOrder)].map(t=>L2(RUF[t].n)).join(', ')}. They move in bounds and take buildings as strongpoints. Over.`));}
function missionBrief(){$('#bTitle').textContent=T3('Миссия: царь горы','משימה: מלך הגבעה','Mission: king of the hill');
  $('#bMeta').textContent=T3(`Код ${codeTxt(S.city.seed)} · рота «Кобра» против армии России · начало 02:00 · конец 06:30`,`קוד ${codeTxt(S.city.seed)} · פלוגת «צפע» מול צבא רוסיה · תחילה 02:00 · סיום 06:30`,`Code ${codeTxt(S.city.seed)} · Cobra company vs the Russian Army · start 02:00 · end 06:30`);
  $('#bSit').textContent=T3('Учебный бой с регулярной армией. В центре города — объект. Кто первым установит заряд и удержит его 5 минут до подрыва, тот победил. Противник идёт с севера с той же задачей и может обезвредить наш заряд, а мы — его. Установка занимает минуту (сапёрам — 40 секунд) и возможна, только если у объекта нет противника ближе 70 м. Противник виден только по докладам.','קרב אימון מול צבא סדיר. במרכז העיר יש יעד. מי שיציב ראשון מטען ויחזיק בו 5 דקות עד הפיצוץ — מנצח. האויב מגיע מצפון עם אותה משימה ויכול לנטרל את המטען שלנו, ואנחנו את שלו. ההצבה לוקחת דקה (לחבלנים — 40 שניות) ואפשרית רק אם אין אויב במרחק 70 מ׳ מהיעד. את האויב רואים רק לפי הדיווחים.','A training battle against a regular army. There is an objective in the town center. Whoever first plants a charge and holds it for 5 minutes until detonation wins. The enemy comes from the north with the same task and can defuse our charge, and we can defuse theirs. Planting takes a minute (sappers 40 seconds) and is only possible with no enemy within 70 m of the objective. You see the enemy only through reports.');
  const by={};infs().forEach(x=>{(by[x.tt]=by[x.tt]||[]).push(x.call);});
  const nOur=infs().reduce((s,x)=>s+x.men,0),nEn=S.enemies.filter(e=>e.kind==='army').reduce((s,e)=>s+e.max,0);
  $('#bUnits').innerHTML=`<li><b>${esc(T3(`Численность: наших ${nOur}, противника около ${nEn}.`,`גודל הכוחות: שלנו ${nOur}, של האויב בערך ${nEn}.`,`Strength: ours ${nOur}, the enemy about ${nEn}.`))}</b></li>`+Object.keys(by).map(t=>`<li><b>${esc(by[t].join(', '))}</b>: ${esc(L2(TU[t].gm))}</li>`).join('')+`<li>${esc(T3('Поддержка: беспилотник «Ястреб», вертолёты эвакуации «Ангел». Ударного вертолёта нет.','סיוע: הכטב״ם «זיק», מסוקי הפינוי «ינשוף». אין מסוק קרב.','Support: the Hawk UAV, the Angel medevac helicopters. No attack helicopter.'))}</li><li>${esc(T3('Противник: ','האויב: ','Enemy: '))}${esc(S.enOrder.map(t=>L2(RUF[t].n)).join(', '))}</li>`;}
function missionObj(){const o=$('#obj');o.innerHTML='';const left=t=>fmt(Math.max(0,t-S.t)).slice(3);const ch=S.charge;
  const items=[[T3('Объект','יעד','Objective'),cell(S.obj.x,S.obj.y)],[T3('Наш заряд','המטען שלנו','Our charge'),ch.us?`${T3('подрыв через','פיצוץ בעוד','blows in')} ${fmt(Math.max(0,ch.us.tDet-S.t)).slice(3)}`:T3('нет','אין','none')],[T3('Заряд противника','מטען האויב','Enemy charge'),ch.them?`${T3('подрыв через','פיצוץ בעוד','blows in')} ${fmt(Math.max(0,ch.them.tDet-S.t)).slice(3)}`:T3('нет','אין','none')]];
  items.forEach(([a,b],i)=>{const s=document.createElement('span');if(i===2&&ch.them)s.className='bad';else if(i===1&&ch.us)s.className='good';s.textContent=a+': ';const bb=document.createElement('b');bb.textContent=b;s.appendChild(bb);o.appendChild(s);});}
function drawObjective(c){const O=S.obj,[sx,sy]=toS(O.x,O.y),r=HOLD_R*K*V.s;c.save();c.strokeStyle='#7a1a8a';c.lineWidth=2.5;c.setLineDash([6,4]);c.beginPath();c.arc(sx,sy,r,0,7);c.stroke();c.setLineDash([]);
  c.fillStyle='rgba(122,26,138,.15)';c.fill();c.fillStyle='#7a1a8a';c.beginPath();c.moveTo(sx,sy-11);c.lineTo(sx+11,sy);c.lineTo(sx,sy+11);c.lineTo(sx-11,sy);c.closePath();c.fill();
  c.font='700 11px "Roboto Condensed", Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';halo(c,T3('ОБЪЕКТ','יעד','OBJECTIVE'),sx,sy-r-9,'#7a1a8a');
  if(S.charge.us||S.charge.them){const t=S.charge.us||S.charge.them;halo(c,(S.charge.us?T3('наш заряд ','מטען שלנו ','our charge '):T3('заряд противника ','מטען האויב ','enemy charge '))+fmt(Math.max(0,t.tDet-S.t)).slice(3),sx,sy+r+10,S.charge.us?'#1f6fb0':'#c42828');}c.restore();}
function missionButtons(u,id,btns){const O=S.obj,d=Math.hypot(S.marks.own[id].x-O.x,S.marks.own[id].y-O.y);
  btns.push({t:T3('К объекту','אל היעד','To the objective'),d:T3(`квадрат ${cell(O.x,O.y)}`,`משבצת ${cell(O.x,O.y)}`,`grid ${cell(O.x,O.y)}`),on:()=>hq(T3(`${u.call}, я Кобра-6. Выдвигайся к объекту, квадрат ${cell(O.x,O.y)}. Приём.`,`${u.call}, כאן צפע. לנוע אל היעד, משבצת ${cell(O.x,O.y)}. עבור.`,`${u.call}, this is Cobra-6. Move to the objective, grid ${cell(O.x,O.y)}. Over.`),{k:'order',uid:id,kind:'move',x:O.x,y:O.y})});
  btns.push({t:T3('Установить заряд','להציב מטען','Plant the charge'),d:S.charge.us?T3('уже установлен','כבר הוצב','already planted'):T3(`у объекта · ${u.sap?'40 с':'1 мин'}`,`ליד היעד · ${u.sap?'40 שנ׳':'דקה'}`,`at the objective · ${u.sap?'40 s':'1 min'}`),dis:!!S.charge.us,on:()=>hq(T3(`${u.call}, я Кобра-6. Установить заряд на объекте. Приём.`,`${u.call}, כאן צפע. להציב מטען ביעד. עבור.`,`${u.call}, this is Cobra-6. Plant the charge at the objective. Over.`),{k:'mplant',uid:id})});
  if(S.charge.them)btns.push({t:T3('Обезвредить заряд','לנטרל מטען','Defuse the charge'),d:T3('заряд противника на объекте','מטען האויב ביעד','enemy charge at the objective'),danger:true,on:()=>hq(T3(`${u.call}, я Кобра-6. Обезвредить заряд противника. Приём.`,`${u.call}, כאן צפע. לנטרל את מטען האויב. עבור.`,`${u.call}, this is Cobra-6. Defuse the enemy charge. Over.`),{k:'mdefuse',uid:id})});}
function missionAct(u,a){const O=S.obj;if(Math.hypot(u.x-O.x,u.y-O.y)>40){say(u,T3(`Кобра-6, я ${u.call}. Мы не у объекта, сначала выдвинемся.`,`צפע, כאן ${u.call}. אנחנו לא ליד היעד, קודם ננוע.`,`Cobra-6, this is ${u.call}. We're not at the objective, moving there first.`),[],{front:true});orderExec(u,{k:'order',kind:'move',x:O.x,y:O.y});u.afterMove=a.k;return;}
  if(a.k==='mplant'&&S.charge.us)return;if(a.k==='mdefuse'&&!S.charge.them)return;u.st=a.k==='mplant'?'plant':'defuse';u.prog=0;
  say(u,a.k==='mplant'?T3(`Я ${u.call}. Принял, ставим заряд.`,`כאן ${u.call}. רות, מציבים מטען.`,`This is ${u.call}. Roger, planting the charge.`):T3(`Я ${u.call}. Принял, обезвреживаем.`,`כאן ${u.call}. רות, מנטרלים.`,`This is ${u.call}. Roger, defusing.`),[],{front:true,known:'st'});}
// ---- setup screen ----
function showMission(){const sel=MS.sel,h=[];const ord=enemyOrder(MS);
  h.push(tabs()+langBar()+`<div class="stamp">${T3('МИССИЯ','משימה','MISSION')}</div><h1>${T3('Царь горы','מלך הגבעה','King of the hill')}</h1>`);
  h.push(`<p class="meta">${T3('Учебный бой с регулярной армией другой страны. В центре города — объект: кто первым установит заряд и удержит его 5 минут, тот победил. Без прокачки. Позже здесь появится техника.','קרב אימון מול צבא סדיר של מדינה אחרת. במרכז העיר יש יעד: מי שמציב ראשון מטען ומחזיק בו 5 דקות — מנצח. בלי התקדמות. בהמשך יתווספו כלי רכב.','A training battle against another country\'s regular army. There is an objective in the town center: whoever first plants a charge and holds it for 5 minutes wins. No progression. Vehicles will come later.')}</p>`);
  h.push(`<h2>${T3('Параметры','פרמטרים','Settings')}</h2><div class="trow"><span>${T3('Код','קוד','Code')}</span><span class="code"><input id="mSeed" inputmode="numeric" maxlength="4" value="${MS.seed}"><button id="mNewSeed">${T3('Новый код','קוד חדש','New code')}</button></span></div>`);
  h.push(`<div class="trow"><span>${T3('Противник','אויב','Opponent')}</span><span class="seg2">${NATIONS.map(([k,n,ok])=>`<button data-nat="${k}"${MS.nation===k?' class="on"':''}${ok?'':' disabled'}>${esc(L2(n))}</button>`).join('')}</span></div>`);
  h.push(`<div class="trow"><span>${T3('Сложность','קושי','Difficulty')}</span><span class="seg2">${DIFF.map((d,i)=>`<button data-md="${i}"${MS.diff===i?' class="on"':''}>${L2(d)}</button>`).join('')}</span></div>`);
  h.push(`<div class="trow"><span>${T3('Застройка','בנייה','Density')}</span><span class="seg2">${Object.keys(DENS).map(k=>`<button data-mdn="${k}"${MS.dens===k?' class="on"':''}>${L2(DENS[k])}</button>`).join('')}</span></div>`);
  if(!M.classic)h.push(`<div class="tprev"><img id="tPrev" alt=""><div><b>${T3('Местность','שטח','Terrain')}:</b> ${esc(L2(TOWNL[M.type]))}<br><small>${T3('объект — в центре, мы — с юга, противник — с севера','היעד במרכז, אנחנו מדרום, האויב מצפון','objective in the center, we come from the south, the enemy from the north')}</small></div></div>`);
  h.push(`<p class="meta">${T3('Поддержка: беспилотник «Ястреб» и вертолёты эвакуации «Ангел». Ударного вертолёта и техники в этом режиме нет ни у одной стороны.','סיוע: הכטב״ם «זיק» ומסוקי הפינוי «ינשוף». מסוק קרב וכלי רכב אין לאף צד במצב הזה.','Support: the Hawk UAV and the Angel medevac helicopters. Neither side has an attack helicopter or vehicles in this mode.')}</p>`);
  h.push(`<h2>${T3('Противник (разведка)','האויב (מודיעין)','Enemy (intelligence)')}</h2><p>${T3('Отряды-аналоги ваших сил, по сложности — больше или меньше:','צוותים מקבילים לכוחות שלכם, לפי הקושי — יותר או פחות:','Counterparts of your forces, more or fewer by difficulty:')} <b>${esc(ord.map(t=>L2(RUF[t].n)).join(', '))}</b></p>`);
  {const a=ourMen(sel),b=enMen(MS),r=a?b/a:0;h.push(`<div class="mcount"><span><small>${T3('Ваши силы','הכוחות שלכם','Your forces')}</small><b>${a}</b>${T3('бойцов','לוחמים','soldiers')}</span><span class="vs">${T3('против','מול','vs')}</span><span><small>${T3('Противник (разведка)','האויב (מודיעין)','Enemy (intelligence)')}</small><b>~${b}</b>${T3('солдат','חיילים','soldiers')}</span></div><p class="meta">${a?(r>1.15?T3(`Противник сильнее числом примерно в ${r.toFixed(1).replace('.',',')} раза.`,`האויב גדול יותר בערך פי ${r.toFixed(1)}.`,`The enemy outnumbers you about ${r.toFixed(1)} to 1.`):r<.87?T3(`Вы сильнее числом примерно в ${(1/r).toFixed(1).replace('.',',')} раза.`,`אתם גדולים יותר בערך פי ${(1/r).toFixed(1)}.`,`You outnumber the enemy about ${(1/r).toFixed(1)} to 1.`):T3('Силы примерно равны по численности.','הכוחות שקולים בערך במספרם.','The forces are roughly equal in numbers.')):T3('Выберите свои отряды ниже.','בחרו את הצוותים שלכם למטה.','Pick your teams below.')} ${T3('Выучка отрядов различается — см. описания.','רמת האימון שונה בין היחידות — ראו בתיאורים.','Training differs between units — see the descriptions.')}</p>`);}
  h.push(`<h2>${T3(`Ваши силы · ${sel.length} из ${MAXG}`,`הכוחות שלכם · ${sel.length} מתוך ${MAXG}`,`Your forces · ${sel.length} of ${MAXG}`)}</h2>`+(sel.length?`<div class="selc">${sel.map((t,i)=>`<button data-mrm="${i}">${esc(L2(TU[t].n))} ✕</button>`).join('')}</div>`:''));
  h.push(`<button class="go" id="mGo"${!sel.length?' disabled':''}>${T3('К боевому приказу','לפקודת המבצע','To the operation order')}</button>`);
  h.push(`<h2>${T3('Наши подразделения','היחידות שלנו','Our units')}</h2>`);
  for(const [c,cn] of UCAT){if(c==='bdr')continue;h.push(`<h3>${L2(cn)}</h3>`);for(const t of Object.keys(TU).filter(k=>TU[k].c===c)){const T=TU[t];const n=sel.filter(x=>x===t).length;
    h.push(`<div class="ucard"><div class="uh"><b>${esc(L2(T.n))}</b><button data-madd="${t}"${sel.length>=MAXG||n>=2?' disabled':''}>${n?`+ (${n})`:'+'}</button></div><div class="ug">${esc(L2(T.gm))} <small>${ABIL(t)} · ${T3('аналог у противника','המקבילה אצל האויב','enemy counterpart')}: ${esc(L2(RUF[ANALOG[t]].n))}</small></div></div>`);}}
  h.push(`<h2>${T3('Армия России: подразделения','צבא רוסיה: היחידות','Russian Army: units')}</h2><p class="meta">${T3('Сведения — только из открытых источников. Численность и характеристики в игре — игровые условности.','המידע — ממקורות פתוחים בלבד. מספר הלוחמים והמאפיינים במשחק — מוסכמות של המשחק.','Information comes only from open sources. Team sizes and ratings in the game are game conventions.')}</p>`);
  for(const t of Object.keys(RUF)){const R=RUF[t];h.push(`<div class="ucard"><div class="uh"><b>${esc(L2(R.n))}</b><small>${R.men} ${T3('чел.','לוחמים','men')}</small></div><div class="ug"><b>${T3('В игре:','במשחק:','In the game:')}</b> ${esc(L2(R.gm))}</div><details><summary>${T3('Из открытых источников','ממקורות פתוחים','From open sources')}</summary><p>${esc(L2(R.pub))} <a href="${R.src}" target="_blank" rel="noopener">${T3('источник','מקור','source')}</a></p></details></div>`);}
  const d=$('#campDoc');d.innerHTML=h.join('');$('#camp').hidden=false;bindTabs();bindLang(d);
  const pv=$('#tPrev');if(pv&&mapCv){const c=document.createElement('canvas');c.width=220;c.height=Math.round(220*H/W);c.getContext('2d').drawImage(mapCv,0,0,c.width,c.height);pv.src=c.toDataURL('image/jpeg',.82);}
  const ch=(city)=>{if(city)setCity(MS.seed,MS.dens,true);S=newMissionState(MS);resetView();saveMS();showMission();};
  const sv=$('#mSeed');sv.onchange=()=>{const v=parseInt(sv.value.replace(/\D/g,''),10);if(v>=1000&&v<=9999&&v!==MS.seed){MS.seed=v;ch(true);}else sv.value=MS.seed;};
  $('#mNewSeed').onclick=()=>{MS.seed=1000+rnd(9000);ch(true);};
  d.querySelectorAll('[data-md]').forEach(b=>b.onclick=()=>{MS.diff=+b.dataset.md;ch(false);});
  d.querySelectorAll('[data-mdn]').forEach(b=>b.onclick=()=>{MS.dens=b.dataset.mdn;ch(true);});
  d.querySelectorAll('[data-madd]').forEach(b=>b.onclick=()=>{MS.sel.push(b.dataset.madd);ch(false);});
  d.querySelectorAll('[data-mrm]').forEach(b=>b.onclick=()=>{MS.sel.splice(+b.dataset.mrm,1);ch(false);});
  $('#mGo').onclick=()=>{if(!MS.sel.length)return;$('#camp').hidden=true;setBriefHead();$('#bGo').textContent=T3('Начать миссию','להתחיל משימה','Start mission');$('#bEnd').hidden=true;$('#brief').hidden=false;$('#brief').scrollTop=0;};}

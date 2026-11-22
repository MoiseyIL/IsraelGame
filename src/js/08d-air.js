/* ---------- drones, the satellite, and what the enemy knows about us ---------- */
// Each side's reconnaissance drone follows a real aircraft. Endurance, speed and sensors come from open sources
// (manufacturers' pages and defence press); the sensor radius and detection chances are game conventions.
//   Israel — Elbit Skylark I-LE: battalion level, about 3 h in the air, electric and quiet.
//   Russia — Orlan-10: about 16 h, cruise 100–120 km/h, a camera and a thermal camera; petrol engine, can be heard.
//   South Africa — Denel Seeker 400: up to 16 h, cruise about 150 km/h, two sensor payloads at once; piston engine.
//     Whether it is in service now is unclear in open sources; in the game it stands in for the army's drone.
//   Ukraine — DeViRo Leleka-100: Ukrainian-made, electric (quiet), about 2–2.5 h in the air, cruise about 70 km/h.
const DRONE={
  il:{n:['Elbit Skylark I-LE','Elbit Skylark I-LE','Elbit Skylark I-LE'],end:3*3600,swap:20*60,spd:25,r:320},
  ru:{n:['«Орлан-10»','«אורלן-10»','Orlan-10'],end:16*3600,spd:30,r:320,p:.9},
  za:{n:['Denel Seeker 400','Denel Seeker 400','Denel Seeker 400'],end:16*3600,spd:40,r:360,p:1},
  ua:{n:['«Лелека-100»','«לֶלֶקה-100»','Leleka-100'],end:2.5*3600,swap:20*60,spd:20,r:300,p:.9,quiet:true},
};
const INTEL=()=>({call:T3('Разведка','מודיעין','Intel'),type:'x'});
const uavUp=()=>!S.uav||!S.uav.down;

// ---- our drone: when the battery runs out it goes back to change it; meanwhile Intel can order a satellite picture ----
function uavAirTick(dt){const U=S.uav,ya=U_('ya');if(!U||!ya)return;const D=DRONE.il;
  if(U.air==null){U.air=0;U.home=S.ourBase?{x:S.ourBase.x,y:S.ourBase.y}:{x:U.x,y:U.y};}
  if(U.down){stepTo(U,U.home.x,U.home.y,D.spd*dt);U.downT-=dt;
    if(U.downT<=0){U.down=false;U.air=0;U.warn=false;say(ya,T3(`Кобра-6, я Ястреб. Батарея заменена, снова в воздухе. Выхожу в квадрат ${cell(U.tx,U.ty)}. Приём.`,`צפע, כאן זיק. הסוללה הוחלפה, שוב באוויר. יוצא למשבצת ${cell(U.tx,U.ty)}. עבור.`,`Cobra-6, this is Hawk. Battery changed, airborne again. Heading for grid ${cell(U.tx,U.ty)}. Over.`),[],{});}
    return;}
  U.air+=dt;
  if(!U.warn&&U.air>=D.end-600){U.warn=true;say(ya,T3(`Кобра-6, я Ястреб. Через 10 минут ухожу на смену батареи, примерно на 20 минут. Приём.`,`צפע, כאן זיק. בעוד 10 דקות יוצא להחלפת סוללה, לכ־20 דקות. עבור.`,`Cobra-6, this is Hawk. In 10 minutes I leave to change the battery, for about 20 minutes. Over.`),[],{});}
  if(U.air>=D.end){U.down=true;U.downT=D.swap;U.scan=null;
    say(ya,T3(`Кобра-6, я Ястреб. Батарея на исходе, ухожу на смену. Вернусь около ${fmt(S.t+D.swap)}. Пока меня нет — снимок со спутника через Разведку. Приём.`,`צפע, כאן זיק. הסוללה נגמרת, יוצא להחלפה. אחזור בסביבות ${fmt(S.t+D.swap)}. עד אז — צילום לוויין דרך המודיעין. עבור.`,`Cobra-6, this is Hawk. Battery low, leaving to change it. Back around ${fmt(S.t+D.swap)}. Until then, a satellite picture through Intel. Over.`),[],{urgent:true});dirty=true;}}
function uavLeft(){const U=S.uav;return U.down?0:Math.max(0,DRONE.il.end-(U.air||0));}

// a satellite pass: only while our drone is down; the picture comes a few minutes later, shows only what is in the open,
// and at night it is a radar picture — people and vehicles, not who they are. The marks age three times faster.
const SAT_WAIT=5*60,SAT_R=600,SAT_GAP=30*60;
function satAsk(x,y){
  if(uavUp()){say(INTEL(),T3('Кобра-6, я Разведка. Ястреб в воздухе — спутник не даём, работайте с беспилотником. Приём.','צפע, כאן מודיעין. זיק באוויר — לוויין לא ניתן, עבדו עם הכטב״ם. עבור.','Cobra-6, this is Intel. Hawk is airborne — no satellite, work with the drone. Over.'),[],{front:true});return;}
  if(S.sat&&S.sat.next>S.t){say(INTEL(),T3(`Кобра-6, я Разведка. Следующий пролёт спутника около ${fmt(S.sat.next)}. Приём.`,`צפע, כאן מודיעין. מעבר הלוויין הבא בסביבות ${fmt(S.sat.next)}. עבור.`,`Cobra-6, this is Intel. Next satellite pass around ${fmt(S.sat.next)}. Over.`),[],{front:true});return;}
  S.sat={x,y,at:S.t+SAT_WAIT,next:S.t+SAT_GAP};
  say(INTEL(),T3(`Кобра-6, я Разведка. Принял, снимок района квадрат ${cell(x,y)} будет около ${fmt(S.t+SAT_WAIT)}. Ночью снимок радарный: видно людей и машины на улицах, кто это — не различить. Приём.`,`צפע, כאן מודיעין. רות, צילום של משבצת ${cell(x,y)} יגיע בסביבות ${fmt(S.t+SAT_WAIT)}. בלילה הצילום מכ״מי: רואים אנשים ורכבים ברחובות, לא מי הם. עבור.`,`Cobra-6, this is Intel. Roger, a picture of grid ${cell(x,y)} around ${fmt(S.t+SAT_WAIT)}. At night it is a radar picture: people and vehicles in the streets, not who they are. Over.`),[],{front:true});}
function satTick(){const s=S.sat;if(!s||!s.at||S.t<s.at)return;s.at=0;const ob=INTEL(),no=[];
  for(const e of alive()){if(!outside(e)||Math.hypot(e.x-s.x,e.y-s.y)>SAT_R)continue;seeTgt(e,ob,{quiet:true,sat:true});const r=S.tg.by[e.id];r.warned=true;no.push(r.no);}
  say(ob,T3(`Кобра-6, я Разведка. Снимок со спутника, квадрат ${cell(s.x,s.y)}, на ${fmt(S.t)}: ${no.length?`на улицах целей: ${no.length} (${no.join(', ')})`:'на улицах никого'}. В зданиях не видно. Метки устаревают быстро. Приём.`,`צפע, כאן מודיעין. צילום לוויין, משבצת ${cell(s.x,s.y)}, נכון ל־${fmt(S.t)}: ${no.length?`מטרות ברחובות: ${no.length} (${no.join(', ')})`:'ברחובות אין איש'}. בתוך מבנים לא רואים. הסימונים מתיישנים מהר. עבור.`,`Cobra-6, this is Intel. Satellite picture, grid ${cell(s.x,s.y)}, as of ${fmt(S.t)}: ${no.length?`targets in the streets: ${no.length} (${no.join(', ')})`:'nobody in the streets'}. Nothing visible inside buildings. The marks age fast. Over.`),[],{pr:1});dirty=true;}

// ---- what the enemy knows: only what its groups saw, what its drone saw, and who opened fire on it ----
// S.ek[unit id] = {x,y,t,men,sup,b,src}. A mark is what the enemy acts on; it ages like ours.
function ekTick(dt){if(!S.mission)return;const A=alive().filter(e=>e.kind==='army');const K=(S.ek=S.ek||{}),D=DRONE[S.nation]||DRONE.ru,eu=S.euav;
  for(const u of infs()){if(u.men<=0){delete K[u.id];continue;}
    const mv=u._ex!=null&&Math.hypot(u.x-u._ex,u.y-u._ey)>.5*dt;u._ex=u.x;u._ey=u.y;const quiet=u.pace==='stealth'?.6:1;let src=null;
    if(A.some(e=>e.cont.includes(u.id))||u.cont.some(id=>{const e=E_(id);return e&&e.kind==='army';}))src='fire';
    else for(const e of A){const d=Math.hypot(u.x-e.x,u.y-e.y),R=(u.veh?450:u.inB?0:(mv?260:160)*quiet)*(tacOf().eye||1);if(d<R&&Math.random()<.35*dt){src='eye';break;}}
    if(!src&&eu&&!eu.down&&!u.inB&&Math.hypot(u.x-eu.x,u.y-eu.y)<D.r&&Math.random()<(u.veh?.25:mv?.06:.02)*quiet*D.p*dt)src='uav';
    if(src)K[u.id]={x:u.x,y:u.y,t:S.t,men:u.men,sup:u.sup||0,b:u.inB||0,src};}
  for(const id in K)if(S.t-K[id].t>900)delete K[id];}
const ekList=age=>Object.entries(S.ek||{}).filter(([,k])=>S.t-k.t<age).map(([id,k])=>Object.assign({id},k));
const ekNear=(p,R,age)=>ekList(age||180).some(k=>Math.hypot(k.x-p.x,k.y-p.y)<R);

// the enemy drone: goes to look where our teams were last seen, otherwise watches the approaches to the objective from our side
function euavTick(dt){if(!S.mission||!S.euav||!S.obj)return;const eu=S.euav,D=DRONE[S.nation]||DRONE.ru,O=S.obj;
  // a short-endurance drone leaves to change its battery, like ours
  eu.air=(eu.air||0)+dt;if(eu.down){stepTo(eu,S.enBase.x,S.enBase.y,D.spd*dt);if((eu.downT-=dt)<=0){eu.down=false;eu.air=0;}return;}
  if(eu.air>=D.end){eu.down=true;eu.downT=D.swap||1200;return;}
  if(Math.hypot(eu.x-O.x,eu.y-O.y)<200)eu.recon=true;
  if(S.t>=(eu.retask||0)){eu.retask=S.t+90;const k=ekList(600).filter(k=>S.t-k.t>45).sort((a,b)=>b.t-a.t)[0];
    if(k){eu.tx=k.x;eu.ty=k.y;}else{const B=S.ourBase||O,f=eu.leg=((eu.leg||0)+1)%3,s=[.15,.45,.75][f];eu.tx=O.x+(B.x-O.x)*s+(f===1?-150:f===2?150:0);eu.ty=O.y+(B.y-O.y)*s;}}
  stepTo(eu,eu.tx,eu.ty,D.spd*dt);
  // we hear it (petrol engine): a team under it reports once in a while; the Hawk sees it too
  if(S.t-(eu.heard||-1e9)<600)return;
  const u=D.quiet?null:infs().find(u=>u.men>0&&Math.hypot(u.x-eu.x,u.y-eu.y)<260),ya=uavUp()&&Math.hypot(S.uav.x-eu.x,S.uav.y-eu.y)<320?U_('ya'):null,ob=u||ya;if(!ob)return;
  eu.heard=S.t;S.marks.euav={x:eu.x,y:eu.y,t:S.t};
  say(ob,T3(`Кобра-6, я ${ob.call}. ${u?'Над нами':'Вижу'} беспилотник противника, квадрат ${cell(eu.x,eu.y)}. На улицах нас видно. Приём.`,`צפע, כאן ${ob.call}. ${u?'מעלינו':'רואה'} כטב״ם של האויב, משבצת ${cell(eu.x,eu.y)}. ברחובות רואים אותנו. עבור.`,`Cobra-6, this is ${ob.call}. Enemy drone ${u?'over us':'in sight'}, grid ${cell(eu.x,eu.y)}. We can be seen in the streets. Over.`),[],{pr:2});dirty=true;}
function drawEuav(c){const m=S.marks.euav;if(!m||S.t-m.t>600)return;const [x,y]=toS(m.x,m.y);c.save();c.globalAlpha=S.t-m.t<180?1:.55;
  c.strokeStyle='#a01818';c.fillStyle='#ffd9d9';c.lineWidth=1.8;c.beginPath();c.moveTo(x,y-9);c.lineTo(x+12,y+6);c.lineTo(x,y+2);c.lineTo(x-12,y+6);c.closePath();c.fill();c.stroke();
  c.font=(HE?('700 10px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));halo(c,T3('чужой БПЛА','כטב״ם אויב','enemy UAV'),x,y+17,'#7a1010');c.restore();}
function airTick(dt){uavAirTick(dt);satTick();ekTick(dt);euavTick(dt);}

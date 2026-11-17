function flushEK(ids){let n=0;for(const id of ids||[]){const e=E_(id);if(e&&e.unrep&&!e.gone){n+=e.unrep;e.unrep=0;}}return n;}
function noise(x,y,r){if(S.alarm)return;for(const e of alive()){if(e.alert)continue;if(Math.hypot(e.x-x,e.y-y)<r){if(e.leader){raiseAlarm();return;}e.alert=true;}}}
function scheduleAlarm(e,d){if(S.alarm)return;e.caller=true;e.alert=true;if(!S.alarmT||S.alarmT>S.t+d)S.alarmT=S.t+d;}
function enemyShot(e){if(S.alarm)return;scheduleAlarm(e,60);noise(e.x,e.y,300);}
function sleepEntry(u){let det=0,woke=0,lead=false;for(const e of alive()){if(e.bld!==u.tb||e.mv||e.alert)continue;
  if(e.kind==='look'){e.alert=true;woke+=e.men;continue;}const p=(u.cap||(u.uc?.75:.55))+(sk(u,'capture')?.1:0);
  if(e.leader&&Math.random()<p*.9){e.leader=false;e.men--;det++;lead=true;if(S.leader==='free'){S.leader='captured';S.pris={uid:u.id,st:'held'};}}
  for(let i=e.men-(e.leader?1:0);i>0;i--)if(Math.random()<p){e.men--;det++;}
  if(e.men<=0)e.gone=true;else{e.alert=true;woke+=e.men;}}
  S.stats.det+=det;u.kills=(u.kills||0)+det;if(det||woke)say(u,(HE?(`צפע, כאן ${u.call}. נכנסנו בשקט.${det?` נתפסו ישנים: ${det}.`:''}${lead?' בין העצורים — «המהנדס»!':''}${woke?` התעוררו: ${woke}, פועלים.`:''}`):((EN?(`Cobra-6, this is ${u.call}. Went in quietly.${det?` Caught asleep: ${det}.`:''}${lead?' "The Engineer" is among the detainees!':''}${woke?` Woke up: ${woke}, engaging.`:''}`):(`Кобра-6, я ${u.call}. Вошли тихо.${det?` Взяли спящими: ${det}.`:''}${lead?' Среди задержанных — «Инженер»!':''}${woke?` Проснулись: ${woke}, работаем.`:''}`)))),[],{urgent:!!woke||lead,known:'st',det,kobj:lead?['eng',(HE?('נעצר'):((EN?("detained"):('задержан'))))]:null});}
function droneExec(u,a){const B=BN(a.b);if(u.droneT>0){say(u,(HE?(`צפע, כאן ${u.call}. הרחפן כבר באוויר.`):((EN?(`Cobra-6, this is ${u.call}. The drone is already in the air.`):(`Кобра-6, я ${u.call}. Дрон уже в воздухе.`)))),[],{front:true});return;}if(!u.drones){say(u,(HE?(`צפע, כאן ${u.call}. נגמרו הסוללות לרחפן.`):((EN?(`Cobra-6, this is ${u.call}. Out of drone batteries.`):(`Кобра-6, я ${u.call}. Батареи для дрона закончились.`)))),[],{front:true});return;}if(Math.hypot(u.x-B.cx,u.y-B.cy)>350){say(u,(HE?(`צפע, כאן ${u.call}. מבנה ${a.b} רחוק מדי, הסוללה לא תספיק. צריך להתקרב.`):((EN?(`Cobra-6, this is ${u.call}. Building ${a.b} is too far, the battery won't last. We need to get closer.`):(`Кобра-6, я ${u.call}. До здания ${a.b} далеко, батареи не хватит. Нужно подойти ближе.`)))),[],{front:true});return;}u.droneT=60;u.drones--;u.droneB=a.b;say(u,(HE?(`כאן ${u.call}. רות, המפעיל מטיס רחפן למבנה ${a.b}.`):((EN?(`This is ${u.call}. Roger, the operator is sending the drone into building ${a.b}.`):(`Я ${u.call}. Принял, оператор запускает дрон в здание ${a.b}.`)))),[],{front:true});}
function labBlast(b){const B=BN(b);S.lab='destroyed';S.destroyed[b]=true;raiseAlarm();
  for(const e of alive())if(e.bld===b&&!e.mv){S.stats.ek+=e.men;if(e.leader&&S.leader==='free'){S.leader='killed';S.body={x:e.x,y:e.y,rubble:true};}e.men=0;e.gone=true;}
  S.civHarm+=S.civ[b];S.civDead+=S.civ[b];S.civ[b]=0;killCivIn(b);
  for(const u of infs()){const d=Math.hypot(u.x-B.cx,u.y-B.cy);if(d<45&&u.men>0){const n=u.men;for(let i=0;i<n;i++)if(Math.random()<(u.inB===b?.35:.15))casualty(u);}}
  for(const o of BL){if(o.n===b)continue;if(Math.hypot(o.cx-B.cx,o.cy-B.cy)<45)for(let i=S.civ[o.n];i>0;i--)if(Math.random()<.4)addCivW(o.n);}}
function casualty(u){u.tccc=false;u.men--;const w=Math.random()<.7;if(w){u.wounded++;u.newW++;S.stats.wia++;}else{S.stats.kia++;u.newK++;}u.morale-=9;hitMan(u,w?'w':'k');}


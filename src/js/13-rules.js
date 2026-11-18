function flushEK(ids){let n=0;for(const id of ids||[]){const e=E_(id);if(e&&e.unrep&&!e.gone){n+=e.unrep;e.unrep=0;}}return n;}
function noise(x,y,r){if(S.alarm)return;for(const e of alive()){if(e.alert)continue;if(e.wakeT||infs().some(u=>u.inB&&u.inB===e.bld))continue;if(Math.hypot(e.x-x,e.y-y)<r){if(e.leader){raiseAlarm();return;}e.alert=true;}}}
function scheduleAlarm(e,d){if(S.alarm)return;e.caller=true;e.alert=true;if(!S.alarmT||S.alarmT>S.t+d)S.alarmT=S.t+d;}
function enemyShot(e){if(S.alarm)return;scheduleAlarm(e,60);noise(e.x,e.y,300);}
function sleepEntry(u){let det=0,woke=0,lead=false;for(const e of alive()){if(e.bld!==u.tb||e.mv||e.alert)continue;
  if(e.kind==='look'){e.alert=true;woke+=e.men;continue;}const p=(u.cap||(u.uc?.75:.55))+(sk(u,'capture')?.1:0);
  if(e.leader&&Math.random()<p*.9){e.leader=false;e.men--;det++;lead=true;if(S.leader==='free'){S.leader='captured';S.pris={uid:u.id,st:'held'};}}
  for(let i=e.men-(e.leader?1:0);i>0;i--)if(Math.random()<p){e.men--;det++;}
  if(e.men<=0)e.gone=true;else if(u.occupy){e.wakeT=S.t+60+Math.floor(Math.random()*240);}else{e.alert=true;woke+=e.men;}}
  S.stats.det+=det;u.kills=(u.kills||0)+det;if(det||woke)say(u,(HE?(`צפע, כאן ${u.call}. נכנסנו בשקט.${det?` נתפסו ישנים: ${det}.`:''}${lead?' בין העצורים — «המהנדס»!':''}${woke?` התעוררו: ${woke}, פועלים.`:''}`):((EN?(`Cobra-6, this is ${u.call}. Went in quietly.${det?` Caught asleep: ${det}.`:''}${lead?' "The Engineer" is among the detainees!':''}${woke?` Woke up: ${woke}, engaging.`:''}`):(`Кобра-6, я ${u.call}. Вошли тихо.${det?` Взяли спящими: ${det}.`:''}${lead?' Среди задержанных — «Инженер»!':''}${woke?` Проснулись: ${woke}, работаем.`:''}`)))),[],{urgent:!!woke||lead,known:'st',det,kobj:lead?['eng',(HE?('נעצר'):((EN?("detained"):('задержан'))))]:null});}
function droneExec(u,a){const B=BN(a.b);if(u.droneT>0){say(u,(HE?(`צפע, כאן ${u.call}. הרחפן כבר באוויר.`):((EN?(`Cobra-6, this is ${u.call}. The drone is already in the air.`):(`Кобра-6, я ${u.call}. Дрон уже в воздухе.`)))),[],{front:true});return;}if(!u.drones){say(u,(HE?(`צפע, כאן ${u.call}. נגמרו הסוללות לרחפן.`):((EN?(`Cobra-6, this is ${u.call}. Out of drone batteries.`):(`Кобра-6, я ${u.call}. Батареи для дрона закончились.`)))),[],{front:true});return;}if(Math.hypot(u.x-B.cx,u.y-B.cy)>350){say(u,(HE?(`צפע, כאן ${u.call}. מבנה ${a.b} רחוק מדי, הסוללה לא תספיק. צריך להתקרב.`):((EN?(`Cobra-6, this is ${u.call}. Building ${a.b} is too far, the battery won't last. We need to get closer.`):(`Кобра-6, я ${u.call}. До здания ${a.b} далеко, батареи не хватит. Нужно подойти ближе.`)))),[],{front:true});return;}u.droneT=60;u.drones--;u.droneB=a.b;say(u,(HE?(`כאן ${u.call}. רות, המפעיל מטיס רחפן למבנה ${a.b}.`):((EN?(`This is ${u.call}. Roger, the operator is sending the drone into building ${a.b}.`):(`Я ${u.call}. Принял, оператор запускает дрон в здание ${a.b}.`)))),[],{front:true});}
function labBlast(b){const B=BN(b);S.lab='destroyed';S.destroyed[b]=true;raiseAlarm();
  for(const e of alive())if(e.bld===b&&!e.mv){S.stats.ek+=e.men;if(e.leader&&S.leader==='free'){S.leader='killed';S.body={x:e.x,y:e.y,rubble:true};}e.men=0;e.gone=true;}
  S.civHarm+=S.civ[b];S.civDead+=S.civ[b];S.civ[b]=0;killCivIn(b);
  for(const u of infs()){const d=Math.hypot(u.x-B.cx,u.y-B.cy);if(d<45&&u.men>0){const n=u.men;for(let i=0;i<n;i++)if(Math.random()<(u.inB===b?.35:.15))casualty(u);}}
  for(const o of BL){if(o.n===b)continue;if(Math.hypot(o.cx-B.cx,o.cy-B.cy)<45)for(let i=S.civ[o.n];i>0;i--)if(Math.random()<.4)addCivW(o.n);}}
function casualty(u){u.tccc=false;u.men--;const w=Math.random()<.7;if(w){u.wounded++;u.newW++;S.stats.wia++;}else{S.stats.kia++;u.newK++;}u.morale-=9*(u.mk||1);hitMan(u,w?'w':'k');}

// buildings our teams hold as cover, as known from their reports
function occSet(uid,b,st){S.occ=S.occ||{};for(const k in S.occ){delete S.occ[k][uid];if(!Object.keys(S.occ[k]).length)delete S.occ[k];}if(b&&st)(S.occ[b]=S.occ[b]||{})[uid]=st;}
function occLine(n){const o=S.occ&&S.occ[n];if(!o)return T3('Наших отрядов внутри нет (по докладам).','אין בפנים צוותים שלנו (לפי הדיווחים).','None of our teams inside (per reports).');
  return Object.keys(o).map(id=>{const u=U_(id);if(!u)return'';return o[id]==='occupy'?T3(`Внутри: ${u.call} — заняли как укрытие. Здание не зачищено: возможны ловушки и противник.`,`בפנים: ${u.call} — תפסו כמחסה. המבנה לא טוהר: ייתכנו מטענים ואויב.`,`Inside: ${u.call} — holding it as cover. Not cleared: traps and enemy are possible.`):T3(`Внутри: ${u.call} — идёт зачистка.`,`בפנים: ${u.call} — טיהור בעיצומו.`,`Inside: ${u.call} — clearing in progress.`);}).filter(Boolean).join('\n');}
function occButtons(n){const o=S.occ&&S.occ[n];if(!o||!S.started||S.over)return[];
  return Object.keys(o).filter(id=>o[id]==='occupy'&&U_(id)).map(id=>{const u=U_(id);return{t:T3('Зачистить здание','לטהר את המבנה','Clear the building'),d:T3(`силами: ${u.call}`,`בכוח: ${u.call}`,`by: ${u.call}`),wide:true,
    on:()=>hq(T3(`${u.call}, я Кобра-6. Зачистить здание ${n} полностью. Приём.`,`${u.call}, כאן צפע. לטהר את מבנה ${n} עד הסוף. עבור.`,`${u.call}, this is Cobra-6. Clear building ${n} completely. Over.`),{k:'clearB',uid:id})};});}
// risks of an uncleared building: a device inside, sleepers upstairs who wake up later
function occTick(){for(const u of infs()){if(u.st!=='occupy'||!u.occTrapT||S.t<u.occTrapT)continue;u.occTrapT=0;const k=1+(Math.random()<.5?1:0);for(let i=0;i<k&&u.men>0;i++)casualty(u);raiseAlarm();
    say(u,T3(`Кобра-6, я ${u.call}! Подрыв внутри здания ${u.inB}! Есть потери! Дом не был проверен. Приём.`,`צפע, כאן ${u.call}! פיצוץ בתוך מבנה ${u.inB}! יש נפגעים! הבית לא נבדק. עבור.`,`Cobra-6, this is ${u.call}! Explosion inside building ${u.inB}! We have casualties! The house was not checked. Over.`),[bChip(u.inB,'ied')],{urgent:true,known:'full'});}
  for(const e of alive())if(e.wakeT&&S.t>=e.wakeT){e.wakeT=0;e.alert=true;wakeInHeldHouse(e);}}
function entryAmbush(u){const en=alive().filter(e=>e.bld===u.tb&&!e.mv&&!e.roof&&e.alert&&!e.wakeT);if(!en.length||u.men<=0)return;
  const p=(u.method==='wall'?.05:u.occupy?(u.pace==='fast'?.5:.25):.12)*(u.ent||1);let k=0;for(let i=u.men;i>0&&k<6;i--)if(Math.random()<p){casualty(u);k++;}raiseAlarm();if(!k)return;
  say(u,T3(`Кобра-6, я ${u.call}! Нас встретили огнём на входе в здание ${u.tb}! ${k===1?'Один выбыл':'Потери: '+k}! Ведём бой!`,`צפע, כאן ${u.call}! קיבלו אותנו באש בכניסה למבנה ${u.tb}! ${k===1?'נפגע אחד':'נפגעים: '+k}! בקרב!`,`Cobra-6, this is ${u.call}! We were met with fire at the entrance to building ${u.tb}! ${k===1?'One down':'Casualties: '+k}! Engaging!`),[bChip(u.tb,'hos')],{urgent:true,known:'full',pid:u.tb});}
// shooting from a held house wakes whoever sleeps upstairs within 30–60 s; half the time our men hear them first
function upstairsTick(){for(const u of infs()){if(!u.inB||!u.cont.length||u.men<=0)continue;
    for(const e of alive()){if(e.bld!==u.inB||e.mv||e.roof||u.cont.includes(e.id))continue;if(e.alert&&!e.wakeT)continue;
      const t=S.t+30+Math.floor(Math.random()*31);if(!e.wakeT||e.wakeT>t){e.wakeT=t;e.wakeBy=u.id;e.warnT=Math.random()<.5?t-10-Math.floor(Math.random()*11):0;}}}
  for(const e of alive()){if(e.warnT&&S.t>=e.warnT){e.warnT=0;const u=U_(e.wakeBy);if(u&&u.inB===e.bld&&u.men>0){const fl=BN(e.bld).fl;
      say(u,T3(`Кобра-6, я ${u.call}. Слышим движение ${fl>1?'на втором этаже':'в соседних комнатах'}, голоса. Похоже, в здании противник. Приём.`,`צפע, כאן ${u.call}. שומעים תנועה ${fl>1?'בקומה השנייה':'בחדרים הסמוכים'}, קולות. נראה שיש אויב בבניין. עבור.`,`Cobra-6, this is ${u.call}. We hear movement ${fl>1?'on the second floor':'in the next rooms'}, voices. Looks like there's enemy in the building. Over.`),[bChip(e.bld,'hos')],{urgent:true,known:'st'});}}}}
// when a sleeper in a house we hold wakes up: the alarm goes up at once, one or two try to slip away, the rest fight
function wakeInHeldHouse(e){const hb=e.bld;if(!hb||!BN(hb))return;const u=infs().find(x=>x.inB&&x.inB===hb&&x.men>0);if(!u)return;raiseAlarm();
  // the alarm sends groups to the Engineer's house; these are already in a fight in their own house and stay
  e.bld=hb;e.mode='defend';e.dest=0;e.scoot=false;const HB=BN(hb);e.x=HB.cx;e.y=HB.cy;
  if(e.men>=2&&!e.leader){const k=Math.min(e.men-1,1+(e.men>=4&&Math.random()<.5?1:0));const far=BL.filter(b=>b.n!==e.bld&&!S.destroyed[b.n]&&Math.hypot(b.cx-e.x,b.cy-e.y)>150&&Math.hypot(b.cx-e.x,b.cy-e.y)<320);
    if(far.length){const d=pick(far);const g=grp(e.id+'x','rest',k,hb,{alert:true});g.mode='move';g.bld=0;g.dest=d.n;g.tx=d.cx;g.ty=d.cy;g.scoot=true;S.enemies.push(g);e.men-=k;e.max=Math.max(1,(e.max||e.men)-k);}}}

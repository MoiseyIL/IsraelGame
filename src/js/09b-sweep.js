/* ---------- target check: all stations report what they see now; old marks fade or go ---------- */
// A mark is "stale" (drawn grey) when nobody has confirmed it for 15 minutes, or when the last check could not see it.
const STALE=900;
const ptStale=m=>!!m.uc||(m.t!=null&&S.t-m.t>STALE);
const bStale=n=>!!(S.marks.bu&&S.marks.bu[n])||(S.marks.bt&&S.marks.bt[n]!=null&&S.t-S.marks.bt[n]>STALE);
function markB(n,k,t){S.marks.b[n]=k;(S.marks.bt||(S.marks.bt={}))[n]=t;if(S.marks.bu)delete S.marks.bu[n];}
// who of ours can see a point now: a ground team within 150 m with a line of sight, or the UAV within 320 m
function seesPt(x,y,e){for(const u of infs()){if(u.men<=0)continue;const p=uPos(u,x,y),q=e?ePos(e,p[0],p[1]):[x,y];if(Math.hypot(p[0]-q[0],p[1]-q[1])<150&&los(p[0],p[1],q[0],q[1]))return u;}
  const ya=U_('ya');if(ya&&S.uav&&Math.hypot(S.uav.x-x,S.uav.y-y)<320&&(!e||outside(e)))return ya;return null;}
function sweep(){const rep=new Map(),add=(u,t)=>{if(!rep.has(u))rep.set(u,[]);rep.get(u).push(t);};const A=alive();const seen=new Set();
  // enemy marks in the street: still there — moved to where they are now; nobody there — removed; not visible — grey
  for(const m of [...S.marks.m]){const e=A.find(e=>outside(e)&&!seen.has(e)&&Math.hypot(e.x-m.x,e.y-m.y)<45&&seesPt(e.x,e.y,e));
    if(e){seen.add(e);m.x=e.x;m.y=e.y;m.t=S.t;m.n=cnt(e.men);m.uc=false;add(seesPt(e.x,e.y,e),T3(`противник ${placeTxt(e.x,e.y)} на месте, ${cnt(e.men)}`,`האויב ${placeTxt(e.x,e.y)} עדיין שם, ${cnt(e.men)}`,`enemy ${placeTxt(e.x,e.y)} still there, ${cnt(e.men)}`));continue;}
    const ob=seesPt(m.x,m.y);if(ob){S.marks.m.splice(S.marks.m.indexOf(m),1);add(ob,T3(`${placeTxt(m.x,m.y)}: противника нет, метку снимаем`,`${placeTxt(m.x,m.y)}: אין אויב, מורידים את הסימון`,`${placeTxt(m.x,m.y)}: no enemy, mark removed`));}
    else m.uc=true;}
  // enemy marks on buildings: fire from it confirms; inside a building nobody can be seen, so a quiet one is only "unconfirmed"
  for(const n in S.marks.b){if(S.marks.b[n]!=='hos')continue;if(S.destroyed[n]||S.cleared[n]){delete S.marks.b[n];continue;}
    const f=A.find(e=>e.bld==n&&!outside(e)&&e.cont.length);if(f){markB(n,'hos',S.t);add(U_(f.cont[0]),T3(`из здания ${n} ведут огонь`,`יורים ממבנה ${n}`,`fire from building ${n}`));}
    else (S.marks.bu||(S.marks.bu={}))[n]=1;}
  // new targets: groups in the open that someone sees, and buildings that fire at us
  for(const e of A){if(seen.has(e))continue;
    if(outside(e)){const ob=seesPt(e.x,e.y,e);if(!ob||S.marks.m.some(m=>Math.hypot(m.x-e.x,m.y-e.y)<45))continue;S.marks.m.push({id:S.nid++,x:e.x,y:e.y,t:S.t,n:cnt(e.men)});seen.add(e);
      add(ob,T3(`новая цель: ${cnt(e.men)} ${e.roof?'на крыше здания '+e.bld:placeTxt(e.x,e.y)}`,`מטרה חדשה: ${cnt(e.men)} ${e.roof?'על גג מבנה '+e.bld:placeTxt(e.x,e.y)}`,`new target: ${cnt(e.men)} ${e.roof?'on the roof of building '+e.bld:placeTxt(e.x,e.y)}`));}
    else if(e.bld&&e.cont.length&&S.marks.b[e.bld]!=='hos'){markB(e.bld,'hos',S.t);add(U_(e.cont[0]),T3(`новая цель: огонь из здания ${e.bld}`,`מטרה חדשה: אש ממבנה ${e.bld}`,`new target: fire from building ${e.bld}`));}}
  const grey=S.marks.m.filter(m=>m.uc).length+Object.keys(S.marks.bu||{}).filter(n=>S.marks.b[n]==='hos').length;
  for(const [u,a0] of rep){let a=[...new Set(a0)].join('; ');a=a.charAt(0).toUpperCase()+a.slice(1);say(u,T3(`Кобра-6, я ${u.call}. ${a}. Приём.`,`צפע, כאן ${u.call}. ${a}. עבור.`,`Cobra-6, this is ${u.call}. ${a}. Over.`),[],{known:'st'});}
  const w={call:T3('Штаб роты','מפקדת הפלוגה','Company HQ'),type:'x'};
  say(w,(rep.size?'':T3('Новых целей никто не видит. ','אף אחד לא רואה מטרות חדשות. ','Nobody sees any new targets. '))
    +(grey?T3(`Не подтверждено и показано серым: ${grey}.`,`לא אומתו ומוצגים באפור: ${grey}.`,`Unconfirmed, shown in grey: ${grey}.`):T3('Все метки на карте подтверждены.','כל הסימונים במפה אומתו.','Every mark on the map is confirmed.')),[],{});
  dirty=true;}
const SWEEP_TXT=()=>T3('Всем станциям сети «Кобра», я Кобра-6. Доложить цели: что видите сейчас, по старым меткам — подтвердить или снять. Приём.','כל התחנות ברשת «צפע», כאן צפע. דווחו מטרות: מה אתם רואים עכשיו, ולגבי הסימונים הישנים — לאמת או להוריד. עבור.','All stations on the Cobra net, this is Cobra-6. Report targets: what you see now; confirm or clear the old marks. Over.');

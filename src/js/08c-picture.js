/* ---------- the picture: every enemy group our side has seen, kept on the map by itself ---------- */
// One group = one target card. A card is updated by whoever sees the group (teams, the UAV, a firefight); nobody has
// to tap anything. Only what changes decisions goes on the air: a new target close to our teams or the objective,
// or a known target closing in. Everything else appears on the map quietly.
// Age: fresh for 3 min, turns grey by 10 min, disappears after 30 min without being seen.
const TG_FRESH=180,TG_GREY=600,TG_GONE=1800,TG_DEAD=120,TG_NEAR=300;
function tgRec(e){tgtNo(e);return S.tg.by[e.id];}
const tgAge=r=>S.t-r.ls;
const tgShown=r=>r.ls!=null&&!r.hide&&(r.dead?S.t-r.dead<TG_DEAD:tgAge(r)<TG_GONE);
function tgWhere(r){return r.roof?T3(`на крыше здания ${r.bld}`,`על גג מבנה ${r.bld}`,`on the roof of building ${r.bld}`):r.bld?T3(`в здании ${r.bld}`,`במבנה ${r.bld}`,`in building ${r.bld}`):placeTxt(r.lx,r.ly);}
const tgDir=r=>r.mv&&(r.dx||r.dy)?DIRS_TO[dirIdx(r.dx,r.dy)]:'';
// is this group a threat right now: close to one of our teams, close to the objective, or coming at us
function tgDanger(e){let best=null;for(const u of infs()){if(u.men<=0)continue;const d=Math.hypot(u.x-e.x,u.y-e.y);if(!best||d<best.d)best={u,d};}
  if(best&&best.d<TG_NEAR)return best;
  if(S.mission&&S.obj&&Math.hypot(S.obj.x-e.x,S.obj.y-e.y)<250)return{obj:true,d:Math.hypot(S.obj.x-e.x,S.obj.y-e.y)};
  if(best&&e.mv&&best.d<500&&e.tx!=null){const vx=e.tx-e.x,vy=e.ty-e.y,wx=best.u.x-e.x,wy=best.u.y-e.y,l=Math.hypot(vx,vy)*Math.hypot(wx,wy)||1;if((vx*wx+vy*wy)/l>.7)return Object.assign({toward:true},best);}
  return null;}
// someone of ours sees the group now
function seeTgt(e,ob,o){o=o||{};const r=tgRec(e);const isNew=r.ls==null||r.hide;
  if(e.mv&&e.tx!=null){r.dx=e.tx-e.x;r.dy=e.ty-e.y;}else{r.dx=0;r.dy=0;}
  r.lx=e.x;r.ly=e.y;r.bld=(e.bld&&(!outside(e)||e.roof))?e.bld:0;r.roof=!!e.roof;r.men=e.men;r.mv=!!e.mv;r.ls=S.t;r.by=ob.call;r.army=e.kind==='army';r.uni=r.army?uniOf(e):'';r.hide=false;r.dead=0;
  r.act=e.veh?T3('едут на машинах','נוסעים ברכבים','riding vehicles'):e.roof?T3('наблюдают с крыши','מתצפתים מהגג','watching from a roof'):e.mv?T3(`идут на ${tgDir(r)}`,`נעים ${tgDir(r)}`,`moving ${tgDir(r)}`):r.bld?T3('в здании','במבנה','inside a building'):T3('стоят','עומדים','standing');
  if(isNew){r.first=S.t;r.warned=false;jrAdd({t:S.t,from:T3('Карта','מפה','Map'),text:T3(`Цель ${r.no}: ${cnt(e.men)}, ${tgWhere(r)} (видит ${ob.call}).`,`מטרה ${r.no}: ${cnt(e.men)}, ${tgWhere(r)} (רואה: ${ob.call}).`,`Target ${r.no}: ${cnt(e.men)}, ${tgWhere(r)} (seen by ${ob.call}).`),eid:e.id});}
  if(!o.quiet&&!o.contact&&!r.warned){const dg=tgDanger(e);if(dg){r.warned=true;tgSay(e,r,ob,dg,isNew);}}
  dirty=true;return isNew;}
function tgSay(e,r,ob,dg,isNew){const mv=r.mv?T3(`, идут на ${tgDir(r)}`,`, נעים ${tgDir(r)}`,`, moving ${tgDir(r)}`):'';
  const why=dg.obj?T3(`, у объекта`,`, ליד היעד`,`, near the objective`):dg.u&&dg.u!==ob?T3(`; ближе всех ${dg.u.call}, ${Math.round(dg.d/10)*10} м`,`; הכי קרוב: ${dg.u.call}, ${Math.round(dg.d/10)*10} מ׳`,`; nearest is ${dg.u.call}, ${Math.round(dg.d/10)*10} m`):dg.u?T3(`, ${Math.round(dg.d/10)*10} м от нас`,`, ${Math.round(dg.d/10)*10} מ׳ מאיתנו`,`, ${Math.round(dg.d/10)*10} m from us`):'';
  const head=isNew?T3(`Новая цель ${r.no}`,`מטרה חדשה ${r.no}`,`New target ${r.no}`):T3(`Цель ${r.no} приближается`,`מטרה ${r.no} מתקרבת`,`Target ${r.no} closing in`);
  say(ob,T3(`Кобра-6, я ${ob.call}. ${head}: ${cnt(e.men)}, ${tgWhere(r)}${mv}${why}. Приём.`,`צפע, כאן ${ob.call}. ${head}: ${cnt(e.men)}, ${tgWhere(r)}${mv}${why}. עבור.`,`Cobra-6, this is ${ob.call}. ${head}: ${cnt(e.men)}, ${tgWhere(r)}${mv}${why}. Over.`),[],{pr:2,known:ob.type==='inf'?'st':undefined});
  r.t=S.t;} // counts as reported on the air (target numbers in later reports say "target N", not "new")
// who of ours sees a known group now: a team in contact with it, a team with a line of sight to it in the open, or the UAV over it
function tgSeenBy(e){for(const u of infs())if(u.men>0&&u.cont.includes(e.id))return u;
  if(!outside(e))return null;
  for(const u of infs()){if(u.men<=0)continue;const d=Math.hypot(u.x-e.x,u.y-e.y);if(d>(u.optic?420:260))continue;if(e.roof||losUE(u,e))return u;}
  const ya=U_('ya');if(ya&&S.uav&&Math.hypot(S.uav.x-e.x,S.uav.y-e.y)<320)return ya;return null;}
// every few seconds: keep tracking known groups, add groups that opened fire on us, cross out groups that were destroyed in front of us
function pictureTick(){if((S.t|0)%3)return;const T=(S.tg=S.tg||{n:0,by:{}});
  for(const e of alive()){const r=T.by[e.id],known=r&&r.ls!=null&&!r.hide&&!r.dead;
    if(known){const ob=tgSeenBy(e);if(ob)seeTgt(e,ob,{track:true});}
    else{const u=infs().find(u=>u.men>0&&u.cont.includes(e.id));if(u)seeTgt(e,u,{contact:true});}}
  for(const e of S.enemies){const r=T.by[e.id];if(!r||r.ls==null||r.dead||r.hide)continue;if(e.men<=0&&S.t-r.ls<60){r.dead=S.t;r.men=0;dirty=true;}}}
// map: one symbol per target. Red = seen in the last 3 min, then fading to grey by 10 min; an arrow while it moves; a cross when destroyed
function tgPos(r){if(r.bld){const b=BN(r.bld);const [sx,sy]=toS(b.cx,b.cy);return[sx+14,sy-12];}return toS(r.lx,r.ly);}
function drawPicture(c){const T=S.tg;if(!T)return;for(const id in T.by){const r=T.by[id];if(!tgShown(r))continue;const [x,y]=tgPos(r);
  if(r.dead){c.save();c.globalAlpha=.8;c.strokeStyle='#7a1010';c.lineWidth=3;c.beginPath();c.moveTo(x-8,y-8);c.lineTo(x+8,y+8);c.moveTo(x+8,y-8);c.lineTo(x-8,y+8);c.stroke();c.restore();continue;}
  const a=tgAge(r),k=clamp((a-TG_FRESH)/(TG_GREY-TG_FRESH),0,1);const mix=(p,q)=>'#'+[0,1,2].map(i=>Math.round(parseInt(p.substr(1+i*2,2),16)*(1-k)+parseInt(q.substr(1+i*2,2),16)*k).toString(16).padStart(2,'0')).join('');
  if(a<30){c.save();c.strokeStyle='rgba(200,30,30,.55)';c.lineWidth=2;c.beginPath();c.arc(x,y,19,0,7);c.stroke();c.restore();} // just appeared
  if(r.mv&&a<TG_FRESH&&(r.dx||r.dy)){const l=Math.hypot(r.dx,r.dy)||1,ux=r.dx/l,uy=r.dy/l;c.save();c.strokeStyle='#a01818';c.fillStyle='#a01818';c.lineWidth=2.4;c.beginPath();c.moveTo(x+ux*12,y+uy*12);c.lineTo(x+ux*30,y+uy*30);c.stroke();
    c.beginPath();c.moveTo(x+ux*36,y+uy*36);c.lineTo(x+ux*28-uy*6,y+uy*28+ux*6);c.lineTo(x+ux*28+uy*6,y+uy*28-ux*6);c.closePath();c.fill();c.restore();}
  const R=11;c.beginPath();c.moveTo(x,y-R);c.lineTo(x+R,y);c.lineTo(x,y+R);c.lineTo(x-R,y);c.closePath();c.fillStyle=mix('#ff9b9b','#d2d0cc');c.fill();c.strokeStyle=mix('#7a1010','#77736c');c.lineWidth=1.8;c.stroke();
  c.fillStyle=k>.5?'#3d3a35':'#5a0b0b';c.font=(HE?('700 10px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText(String(r.no),x,y+.5);
  if(a>=TG_FRESH){c.font=(HE?('10px "Heebo", sans-serif'):('10px "PT Mono", monospace'));halo(c,fmt(r.ls),x,y+19,'#6b6863');}}}
function hitTgt(x,y){const T=S.tg;if(!T)return null;let best=null,bd=17;for(const id in T.by){const r=T.by[id];if(!tgShown(r))continue;const [sx,sy]=tgPos(r),d=Math.hypot(sx-x,sy-y);if(d<bd){bd=d;best=r;}}return best;}
// card of a target: everything the reports said, without taking air time
function openTgtSheet(no){const T=S.tg;const id=Object.keys(T.by).find(k=>T.by[k].no===no);if(!id)return;const r=T.by[id],e=E_(id);
  const st=r.dead?T3('уничтожена','הושמדה','destroyed'):tgAge(r)<TG_FRESH?T3('видят сейчас','רואים עכשיו','in sight now'):T3(`потеряна, последний раз ${fmt(r.ls)}`,`אבדה, נראתה לאחרונה ב־${fmt(r.ls)}`,`lost, last seen ${fmt(r.ls)}`);
  const fight=infs().filter(u=>u.men>0&&u.cont.includes(id)).map(u=>u.call);
  const lines=[T3(`Состояние: ${st}.`,`מצב: ${st}.`,`Status: ${st}.`),
    T3(`Численность: ${cnt(r.men)}. Где: ${tgWhere(r)}. Действия: ${r.act}.`,`גודל: ${cnt(r.men)}. איפה: ${tgWhere(r)}. פעילות: ${r.act}.`,`Size: ${cnt(r.men)}. Where: ${tgWhere(r)}. Activity: ${r.act}.`),
    T3(`Принадлежность: ${r.army?(r.uni||L2(NAT_S().uni)):'без формы, вооружены'}.`,`זיהוי: ${r.army?(r.uni||L2(NAT_S().uni)):'ללא מדים, חמושים'}.`,`Unit: ${r.army?(r.uni||L2(NAT_S().uni)):'no uniforms, armed'}.`),
    T3(`Впервые: ${fmt(r.first)}. Последним видел: ${r.by}, ${fmt(r.ls)}.`,`לראשונה: ${fmt(r.first)}. ראה אחרון: ${r.by}, ${fmt(r.ls)}.`,`First seen ${fmt(r.first)}. Last seen by ${r.by} at ${fmt(r.ls)}.`)];
  if(fight.length)lines.push(T3(`Ведут бой: ${fight.join(', ')}.`,`בקרב איתה: ${fight.join(', ')}.`,`Engaged by: ${fight.join(', ')}.`));
  const btns=[];if(!r.dead&&!r.bld&&U_('ya'))btns.push({t:T3('Ястреб: осмотреть','זיק: לסרוק','Hawk: scan'),d:T3('район вокруг цели','האזור סביב המטרה','the area around it'),on:()=>hq(T3(`Ястреб, я Кобра-6. Просканировать район: квадрат ${cell(r.lx,r.ly)}, цель ${r.no}. Приём.`,`זיק, כאן צפע. סרוק את האזור: משבצת ${cell(r.lx,r.ly)}, מטרה ${r.no}. עבור.`,`Hawk, this is Cobra-6. Scan the area: grid ${cell(r.lx,r.ly)}, target ${r.no}. Over.`),{k:'scan',x:r.lx,y:r.ly})});
  btns.push({t:T3('Убрать с карты','להסיר מהמפה','Remove from map'),d:T3('появится снова, если увидят','תופיע שוב אם יראו','reappears if seen again'),on:()=>{r.hide=true;dirty=true;}});
  openSheet(T3(`Цель ${r.no}`,`מטרה ${r.no}`,`Target ${r.no}`),lines.join('\n'),btns);}

// "in cover ..." goes into the report the team sends in the same second; on its own it is not worth air time
function coverNote(u){const q=S.radio.q;for(let i=q.length-1;i>=0;i--){const m=q[i];if(m.uid===u.id&&m.qt===S.t){m.text=m.text.replace(/\s*(Ведём бой!|Отвечаем\.|Работаем!|Engaging!|Returning fire\.|בקרב!|משיבים אש\.|פועלים!)?\s*$/,s=>' '+u.coverTxt+(s.trim()?' '+s.trim():''));u.coverTxt=null;return;}}
  u.coverTxt=null;} // mid-fight: the fight is already reported, moving to cover is not news
// ---- fire zones: where our teams are exchanging fire, so it is clear where not to walk in ----
// A zone is the corridor between the team and the enemy position as our side knows it, plus a patch around that position.
// Bright while the fight goes on, fades out over 90 s after the shooting stops.
const FZ_FADE=90;
function fireZoneTick(){const Z=(S.fz=S.fz||{});const T=S.tg&&S.tg.by;
  for(const u of infs()){if(u.men<=0||!u.cont.length)continue;const up=u.inB?BN(u.inB):null;
    for(const id of u.cont){const r=T&&T[id],e=E_(id);if(!e)continue;let ex,ey;
      if(r&&r.ls!=null){if(r.bld){const b=BN(r.bld);ex=b.cx;ey=b.cy;}else{ex=r.lx;ey=r.ly;}}else{ex=e.x;ey=e.y;}
      Z[u.id+'|'+id]={ux:up?up.cx:u.x,uy:up?up.cy:u.y,ex,ey,t:S.t};}}
  for(const k in Z)if(S.t-Z[k].t>FZ_FADE)delete Z[k];}
function drawFireZones(c){const Z=S.fz;if(!Z)return;c.save();c.lineCap='round';
  for(const k in Z){const z=Z[k],a=clamp(1-(S.t-z.t)/FZ_FADE,0,1);if(a<=0)continue;
    c.strokeStyle=`rgba(200,35,25,${.16*a})`;c.lineWidth=46;c.beginPath();c.moveTo(z.ux,z.uy);c.lineTo(z.ex,z.ey);c.stroke();
    c.fillStyle=`rgba(200,35,25,${.14*a})`;c.beginPath();c.arc(z.ex,z.ey,60,0,7);c.fill();
    c.strokeStyle=`rgba(170,25,20,${.55*a})`;c.lineWidth=2.5;c.setLineDash([9,7]);c.beginPath();c.arc(z.ex,z.ey,60,0,7);c.stroke();c.setLineDash([]);}
  c.restore();}

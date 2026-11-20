/* ---------- marks the player keeps by hand, and the UAV scan of an area ---------- */
// Enemy groups are on the map by themselves (08c-picture.js). What is left here: building marks the player sets
// (suspected, civilians, tunnel), which turn grey after 15 minutes without confirmation, and old saved point marks.
const STALE=900;
const ptStale=m=>!!m.uc||(m.t!=null&&S.t-m.t>STALE);
const bStale=n=>!!(S.marks.bu&&S.marks.bu[n])||(S.marks.bt&&S.marks.bt[n]!=null&&S.t-S.marks.bt[n]>STALE);
function markB(n,k,t){S.marks.b[n]=k;(S.marks.bt||(S.marks.bt={}))[n]=t;if(S.marks.bu)delete S.marks.bu[n];}
// ---- the UAV scans an area: flies there, looks for about a minute, then the map in its circle is up to date ----
const SCAN_R=320,SCAN_T=60;
function uavScanStart(x,y){S.uav.tx=x;S.uav.ty=y;S.uav.scan={x,y,t:0};const ya=U_('ya');
  say(ya,T3(`Кобра-6, я Ястреб. Принял, выхожу в район, квадрат ${cell(x,y)}. Осмотр займёт около минуты, потом доложу. Приём.`,`צפע, כאן זיק. רות, יוצא לאזור, משבצת ${cell(x,y)}. הסריקה תיקח בערך דקה, אחר כך אדווח. עבור.`,`Cobra-6, this is Hawk. Roger, heading for the area, grid ${cell(x,y)}. The scan takes about a minute, then I'll report. Over.`),[],{});}
function uavScanTick(dt){const sc=S.uav.scan;if(!sc)return;if(Math.hypot(S.uav.x-sc.x,S.uav.y-sc.y)>8)return;sc.t+=dt;if(sc.t<SCAN_T)return;S.uav.scan=null;uavScan(sc.x,sc.y);}
function uavScan(cx,cy){const ya=U_('ya'),inR=(x,y)=>Math.hypot(x-cx,y-cy)<SCAN_R,T=(S.tg=S.tg||{n:0,by:{}});let ok=0,gone=0;const nw=[];
  // everyone in the open inside the circle is found (a man lying on a roof can be missed)
  for(const e of alive()){if(!outside(e)||!inR(e.x,e.y))continue;if(e.roof&&Math.random()<.2)continue;
    const r=T.by[e.id],was=r&&r.ls!=null&&!r.hide&&!r.dead;seeTgt(e,ya,{quiet:true});const rr=T.by[e.id];if(was)ok++;else nw.push(T3(`цель ${rr.no} — ${cnt(e.men)}, ${tgWhere(rr)}`,`מטרה ${rr.no} — ${cnt(e.men)}, ${tgWhere(rr)}`,`target ${rr.no} — ${cnt(e.men)}, ${tgWhere(rr)}`));}
  // targets last seen in the open inside the circle and not there now: gone from the map
  let inside=0;for(const id in T.by){const r=T.by[id];if(r.ls==null||r.hide||r.dead||r.ls===S.t)continue;if(!inR(r.lx,r.ly))continue;if(r.bld&&!r.roof){inside++;continue;}r.hide=true;gone++;}
  say(ya,T3(`Кобра-6, я Ястреб. Район квадрат ${cell(cx,cy)} осмотрен. Подтверждено целей: ${ok}, снято с карты: ${gone}. ${nw.length?'Новые: '+nw.join('; ')+'.':'Новых нет.'}${inside?` В зданиях отмечено целей: ${inside}, внутрь не вижу.`:''} Приём.`,
    `צפע, כאן זיק. סרקתי את האזור, משבצת ${cell(cx,cy)}. מטרות שאומתו: ${ok}, הוסרו מהמפה: ${gone}. ${nw.length?'חדשות: '+nw.join('; ')+'.':'אין חדשות.'}${inside?` מטרות מסומנות במבנים: ${inside}, לתוכם אני לא רואה.`:''} עבור.`,
    `Cobra-6, this is Hawk. Area around grid ${cell(cx,cy)} scanned. Targets confirmed: ${ok}, removed from the map: ${gone}. ${nw.length?'New: '+nw.join('; ')+'.':'No new ones.'}${inside?` Targets marked in buildings: ${inside}, I can't see inside.`:''} Over.`),[],{known:'st'});dirty=true;}

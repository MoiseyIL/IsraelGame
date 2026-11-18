/* ---------- war damage: wreckage in the streets, damage to buildings from fire ---------- */
// The town has been fought over before: burnt-out cars, rubble, barricades, collapsed walls, craters.
// They are placed from the map seed (the same map always has the same wreckage), on their own random stream,
// so the streets and the buildings stay exactly as they were.
let DSEED=SEED,DEB=[],NAVV=null,SLOW=null;
// cov: how much of the fire still reaches a group behind it (lower is better); slow: walking pace over it;
// heavy: across the whole street, vehicles cannot pass
const DEBT={
  car:{cov:.5,slow:1,n:['Сгоревшая машина','מכונית שרופה','Burnt-out car'],at:['за сгоревшей машиной','מאחורי מכונית שרופה,','behind a burnt-out car']},
  rubble:{cov:.35,slow:.5,n:['Завал','ערימת הריסות','Rubble pile'],at:['за завалом','מאחורי ערימת הריסות,','behind a rubble pile']},
  barr:{cov:.35,slow:.6,n:['Баррикада','מחסום','Barricade'],at:['за баррикадой','מאחורי מחסום,','behind a barricade']},
  wall:{cov:.4,slow:1,n:['Обрушенная стена','קיר שהתמוטט','Collapsed wall'],at:['за обрушенной стеной','מאחורי קיר שהתמוטט,','behind a collapsed wall']},
  crater:{cov:.5,slow:.6,n:['Воронка','מכתש','Crater'],at:['в воронке','בתוך מכתש,','in a crater']}};
const debAt=d=>L2(DEBT[d.t].at);
function genDebris(){DEB=[];const r=mulberry(DSEED*577+29);
  const cx=M.classic?700:M.cx,cy=M.classic?860:M.cy,rx=M.classic?500:M.rx,ry=M.classic?640:M.ry;
  const avX=M.classic?[700]:M.avx,avY=M.classic?[860]:M.avy,gw=M.classic?14:(M.ga||12)+2;
  // main roads stay passable for vehicles; nothing at all near their crossings (the mission objective is there)
  const onAv=(x,y)=>avX.some(a=>Math.abs(x-a)<gw)||avY.some(a=>Math.abs(y-a)<gw)||(!M.classic&&M.diag&&lineDist(x,y,M.diag)<14);
  const cross=[];avX.forEach(a=>avY.forEach(b=>cross.push([a,b])));
  const N=clamp(Math.round(BL.length*.2),10,36);
  for(let t=0;t<N*60&&DEB.length<N;t++){const x=cx+(r()*2-1)*rx,y=cy+(r()*2-1)*ry,roll=r(),side=r(),len=r();
    if(!inTown(x,y))continue;const gx=Math.floor(x/NG),gy=Math.floor(y/NG);if(!navFree(gx,gy))continue;
    if(cross.some(c=>Math.hypot(c[0]-x,c[1]-y)<55)||DEB.some(d=>Math.hypot(d.cx-x,d.cy-y)<40))continue;
    const run=(dx,dy)=>{let k=0;while(k<10&&navFree(gx+dx*(k+1),gy+dy*(k+1)))k++;return k;};
    const L=run(-1,0),R=run(1,0),U=run(0,-1),D=run(0,1);const wH=(L+R+1)*NG,wV=(U+D+1)*NG;
    const hz=wH>=wV,across=Math.min(wH,wV);if(across<8||across>34)continue;const open=false,av=onAv(x,y);
    const t0=av||open?(roll<.5?'car':roll<.8?'crater':'wall'):(roll<.3?'rubble':roll<.55?'car':roll<.68?'barr':roll<.82?'crater':'wall');
    // the street runs along the longer free direction; a0..a1 is its full width across
    const a0=hz?(gy-U)*NG:(gx-L)*NG,a1=hz?(gy+D+1)*NG:(gx+R+1)*NG,p=hz?x:y;let b0,b1,c0,c1;
    if(t0==='car'){const k=side<.5;c0=k?a0+.6:a1-3.2;c1=c0+2.6;b0=p-2.5;b1=p+2.5;}
    else if(t0==='crater'){const q=(a0+a1)/2+(side-.5)*across*.3;c0=q-3.5;c1=q+3.5;b0=p-3.5;b1=p+3.5;}
    else if(t0==='wall'){const k=side<.5;c0=k?a0+.3:a1-2.3;c1=c0+2;b0=p-5-len*5;b1=p+5+len*5;}
    else{const full=!open&&!av;const w=t0==='barr'?2.5:7+len*4;b0=p-w/2;b1=p+w/2;if(full){c0=a0;c1=a1;}else{const q=(a0+a1)/2;c0=q-6;c1=q+6;}}
    const d=hz?{x0:b0,x1:b1,y0:c0,y1:c1}:{x0:c0,x1:c1,y0:b0,y1:b1};d.t=t0;d.hz=hz;d.cx=(d.x0+d.x1)/2;d.cy=(d.y0+d.y1)/2;d.heavy=(t0==='rubble'||t0==='barr')&&!open&&!av;d.sd=Math.floor(r()*1e6);DEB.push(d);}
  // vehicles go around everything; on foot a group climbs over rubble, barricades and craters at a slower pace
  NAVV=NAV.slice();SLOW=new Uint8Array(NW*NH);
  for(const d of DEB){const x0=Math.floor(d.x0/NG),x1=Math.floor((d.x1-.01)/NG),y0=Math.floor(d.y0/NG),y1=Math.floor((d.y1-.01)/NG);
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=NW||y>=NH)continue;NAVV[y*NW+x]=1;if(DEBT[d.t].slow<1)SLOW[y*NW+x]=1;}}}
const rectDist=(x,y,o)=>Math.hypot(Math.max(o.x0-x,0,x-o.x1),Math.max(o.y0-y,0,y-o.y1));
function debNear(x,y,r){for(const d of DEB)if(rectDist(x,y,d)<=r)return d;return null;}
// how much of the fire reaches a group standing at x,y on the street: wreckage or the ruins of a building next to it
function debCov(x,y){let c=0;for(const d of DEB)if(rectDist(x,y,d)<=4){const k=DEBT[d.t].cov;if(!c||k<c)c=k;}
  if(c&&c<=.35)return c;for(const n in S.destroyed){const b=BN(+n);if(b&&rectDist(x,y,b)<=7)return .35;}
  for(const n in (S.bdmg||{}))if(S.bdmg[n]>=70){const b=BN(+n);if(b&&rectDist(x,y,b)<=7)return .35;}return c||0;}
const slowAt=(x,y)=>SLOW&&SLOW[Math.floor(y/NG)*NW+Math.floor(x/NG)]?.6:1;
// the side of a wreck away from the enemy, if it is close and not toward the enemy
function debCoverPt(u,en){const ex=en.reduce((s,e)=>s+e.x,0)/en.length,ey=en.reduce((s,e)=>s+e.y,0)/en.length,de=Math.hypot(u.x-ex,u.y-ey);
  const list=DEB.filter(d=>Math.hypot(d.cx-u.x,d.cy-u.y)<70).sort((a,b)=>Math.hypot(a.cx-u.x,a.cy-u.y)-Math.hypot(b.cx-u.x,b.cy-u.y));
  for(const d of list){const vx=d.cx-ex,vy=d.cy-ey,l=Math.hypot(vx,vy)||1;const ext=Math.abs(vx/l)*(d.x1-d.x0)/2+Math.abs(vy/l)*(d.y1-d.y0)/2;
    for(const k of [ext+2,ext*.5,0]){const px=d.cx+vx/l*k,py=d.cy+vy/l*k;if(!navFree(Math.floor(px/NG),Math.floor(py/NG)))continue;
      if(Math.hypot(px-ex,py-ey)<de-30)break;return[px,py,d];}}return null;}
// drawn on the live map in metres; small objects are enlarged so they stay visible when zoomed out (z = pixels per metre)
function drawDebris(g,z){for(const d of DEB){const r=mulberry(d.sd),w=d.x1-d.x0,h=d.y1-d.y0;g.save();
  if(!d.heavy){const e=clamp(7/(z*Math.max(w,h)),1.4,2.6);g.translate(d.cx,d.cy);g.scale(e,e);g.translate(-d.cx,-d.cy);}
  if(d.t==='car'){const L=Math.max(w,h)*1.35,S2=Math.min(w,h)*1.35;g.translate(d.cx,d.cy);if(!d.hz)g.rotate(Math.PI/2);g.rotate((r()-.5)*.5);
    g.fillStyle='#3b3633';g.fillRect(-L/2,-S2/2,L,S2);g.fillStyle='#6b5d50';g.fillRect(-L/4,-S2/2+.6,L/2,S2-1.2);g.strokeStyle='#1d1a18';g.lineWidth=.8;g.strokeRect(-L/2,-S2/2,L,S2);}
  else if(d.t==='crater'){g.fillStyle='rgba(95,80,60,.55)';g.beginPath();g.arc(d.cx,d.cy,w*.62,0,7);g.fill();g.fillStyle='rgba(60,52,42,.7)';g.beginPath();g.arc(d.cx,d.cy,w*.34,0,7);g.fill();}
  else if(d.t==='wall'){g.fillStyle='#6f685d';g.fillRect(d.x0,d.y0,w,h);g.fillStyle='#4f4a42';const n=Math.max(3,Math.round(Math.max(w,h)/3));
    for(let i=0;i<n;i++){const t=i/n,px=d.hz?d.x0+w*t:d.cx+(r()-.5)*4,py=d.hz?d.cy+(r()-.5)*4:d.y0+h*t;g.fillRect(px-1,py-1,2+r()*1.5,2+r()*1.5);}}
  else if(d.t==='barr'){g.fillStyle='#9c8b66';const n=Math.max(3,Math.round(Math.max(w,h)/2.2));for(let i=0;i<n;i++){const t=(i+.5)/n,px=d.hz?d.cx:d.x0+w*t,py=d.hz?d.y0+h*t:d.cy;
      g.beginPath();g.ellipse(px,py,d.hz?1.8:1.2,d.hz?1.2:1.8,0,0,7);g.fill();}g.strokeStyle='#5d5037';g.lineWidth=.6;g.strokeRect(d.x0,d.y0,w,h);}
  else{g.fillStyle='rgba(88,82,72,.5)';g.beginPath();g.ellipse(d.cx,d.cy,w*.55,h*.55,0,0,7);g.fill();const n=Math.round(w*h/7)+8;for(let i=0;i<n;i++){const px=d.x0+r()*w,py=d.y0+r()*h,s=1.5+r()*2.8;g.fillStyle=['#5f594f','#77705f','#4c473f','#8a8273'][Math.floor(r()*4)];
      g.beginPath();g.moveTo(px-s,py);g.lineTo(px-s*.2,py-s*.8);g.lineTo(px+s,py-s*.2);g.lineTo(px+s*.4,py+s*.8);g.closePath();g.fill();}}
  g.restore();}}

// ---- damage to buildings ----
// 0 intact, 1 windows blown out, 2 holes in the walls, 3 partly collapsed, 4 destroyed
const BST=[['цело','שלם','intact'],['окна выбиты','החלונות נופצו','windows blown out'],['пробоины в стенах','פרצות בקירות','holes in the walls'],['частично обрушено','קרס חלקית','partly collapsed'],['разрушено','הרוס','destroyed']];
const dmgSt=d=>d>=70?3:d>=45?2:d>=20?1:0;
function bState(b){if(S.destroyed[b])return 4;return dmgSt((S.bdmg||{})[b]||0);}
// how much of the fire reaches the people inside: the same for both sides, worse the more the building is damaged
function bcov(b){if(S.destroyed[b])return .6;return .35+Math.min(99,(S.bdmg||{})[b]||0)*.004;}
const isOur=s=>s.type==='inf';
// heavy weapons: 2 = machine guns and launchers (infantry platoons, army platoons), 1 = machine gun, 0 = rifles only
function hwOf(s){if(isOur(s))return s.cls?(s.cls==='inf'?2:1):(s.id==='k1'||s.id==='k2'?2:1);
  if(s.kind==='army')return({vdv:2,mp:2,msv:2,sso:1,spn:1,shturm:2,stormv:2,bars:2,sobr:1,razv:1})[s.rt]||0;return(s.kind==='leader'||s.kind==='rest')&&s.max>=3?1:0;}
function lawOf(s){if(isOur(s))return hwOf(s)>=2?3:s.cls==='sf'||s.cls==='rec'||s.id==='dv'?1:0;
  if(s.kind==='army')return({vdv:3,mp:3,msv:3,sso:1,spn:1,shturm:3,stormv:1,bars:2,razv:1})[s.rt]||0;return(s.kind==='leader'||s.kind==='rest')&&s.max>=3?1:0;}
const dmgCount=()=>Object.keys(S.bdmg||{}).filter(n=>!S.destroyed[n]&&S.bdmg[n]>=20).length;
// fire at a building someone is shooting from: rifles break windows, machine guns more, launchers punch holes
function wpnFire(s,b,sh,dt,tgt){const B=BN(b);if(!B||S.destroyed[b]||s.men<=0)return;const hw=hwOf(s);
  // never at a building where our own side is inside
  if(isOur(s)?infs().some(x=>x.inB===b&&x.men>0):alive().some(o=>o!==tgt&&o.bld===b&&!o.mv&&!outside(o)))return;
  bHit(b,s.men*sh*dt*(hw>=1?.009:.006),hw>=1?40:25,s);
  if(s.law==null)s.law=lawOf(s);if(s.law<=0||s.men<3)return;
  if(isOur(s)&&B.prot)return; // rules of engagement: no launchers at schools, clinics, mosques
  s.lawT=(s.lawT==null?15+Math.random()*25:s.lawT)-dt;if(s.lawT>0)return;s.lawT=55+Math.random()*40;s.law--;
  bHit(b,15+Math.random()*10,85,s);if(Math.random()<(isOur(s)?.45:.35))tgt.acc+=1;
  if(isOur(s)&&S.civ[b]>0&&Math.random()<.3){addCivW(b);s.civHit=(s.civHit||0)+1;
    say(s,T3(`Кобра-6, я ${s.call}. Выстрел из гранатомёта по огневой точке в здании ${b}. Похоже, внутри были мирные, есть пострадавшие. Приём.`,`צפע, כאן ${s.call}. ירי מטול לעבר עמדת הירי במבנה ${b}. נראה שבפנים היו אזרחים, יש נפגעים. עבור.`,`Cobra-6, this is ${s.call}. Launcher round at the firing point in building ${b}. Looks like there were civilians inside, some are hurt. Over.`),[bChip(b,'civ')],{urgent:true,known:'st'});}}
function bHit(b,amt,cap,src){if(S.destroyed[b])return;S.bdmg=S.bdmg||{};const d0=S.bdmg[b]||0;if(d0>=cap)return;const d1=Math.min(cap,d0+amt);S.bdmg[b]=d1;
  const s0=dmgSt(d0),s1=dmgSt(d1);if(s1>s0)bStateUp(b,s1,src);dirty=true;}
function bStateUp(b,st,src){const ours=infs().filter(u=>u.inB===b&&u.men>0);
  if(st===3){for(const u of ours){const n=u.men;for(let i=0;i<n&&u.men>0;i++)if(Math.random()<.1)casualty(u);}
    for(const e of alive())if(e.bld===b&&!e.mv&&e.men>0){let k=0;for(let i=e.men;i>0;i--)if(Math.random()<.1)k++;k=Math.min(k,e.men-(e.leader?1:0));if(k>0){e.men-=k;S.stats.ek+=k;if(src&&isOur(src))src.kills=(src.kills||0)+k;if(e.men<=0)e.gone=true;}}
    if(S.civ[b]>0)for(let i=S.civ[b];i>0;i--)if(Math.random()<.15)addCivW(b);}
  const u=ours[0];
  if(u){if(st>=2)say(u,st===3?T3(`Кобра-6, я ${u.call}! Здание ${b} частично обрушилось! Есть потери, укрытие ненадёжное. Приём.`,`צפע, כאן ${u.call}! מבנה ${b} קרס חלקית! יש נפגעים, המחסה לא אמין. עבור.`,`Cobra-6, this is ${u.call}! Building ${b} has partly collapsed! Casualties, the cover is no good. Over.`)
      :T3(`Кобра-6, я ${u.call}. По нашему зданию ${b} бьют из гранатомётов, в стенах пробоины. Укрытие слабеет.`,`צפע, כאן ${u.call}. יורים טילים על המבנה שלנו, ${b}, יש פרצות בקירות. המחסה נחלש.`,`Cobra-6, this is ${u.call}. They're hitting our building ${b} with launchers, holes in the walls. The cover is getting weaker.`),[],{urgent:true,known:'st'});return;}
  if(st===3&&src&&isOur(src))say(src,T3(`Кобра-6, я ${src.call}. Здание ${b}, откуда вёлся огонь, частично обрушилось.`,`צפע, כאן ${src.call}. מבנה ${b}, שממנו ירו, קרס חלקית.`,`Cobra-6, this is ${src.call}. Building ${b}, where the fire came from, has partly collapsed.`),[bChip(b,'hos')],{known:'st'});}
// damage drawn over the map: shattered windows, holes, a collapsed corner
function drawBDmg(c){for(const n in (S.bdmg||{})){if(S.destroyed[n])continue;const st=dmgSt(S.bdmg[n]);if(!st)continue;const b=BN(+n),r=mulberry(+n*97+3),w=b.x1-b.x0,h=b.y1-b.y0;
  c.fillStyle='rgba(25,25,25,.75)';const k=st*3+2;for(let i=0;i<k;i++){const ed=Math.floor(r()*4),t=.15+r()*.7;const px=ed<2?b.x0+w*t:(ed===2?b.x0+1.5:b.x1-1.5),py=ed>=2?b.y0+h*t:(ed===0?b.y0+1.5:b.y1-1.5);c.fillRect(px-1.2,py-1.2,2.4,2.4);}
  if(st>=2){c.fillStyle='rgba(20,20,20,.8)';for(let i=0;i<st;i++){const px=b.x0+w*(.2+r()*.6),py=b.y0+h*(.2+r()*.6);c.beginPath();c.arc(px,py,2+r()*1.5,0,7);c.fill();}}
  if(st>=3){const cx=r()<.5?b.x0:b.x1,cy=r()<.5?b.y0:b.y1;c.fillStyle='rgba(60,56,50,.85)';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+(b.cx-cx)*1.1,cy);c.lineTo(cx,cy+(b.cy-cy)*1.1);c.closePath();c.fill();}}}

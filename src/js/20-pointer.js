/* ---------- pointer ---------- */
const ptrs=new Map();let gest=null;
function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function hitMark(x,y){for(const u of [...S.units].reverse()){const m=S.marks.own[u.id];const [sx,sy]=toS(m.x,m.y);if(Math.abs(sx-x)<20&&Math.abs(sy-y)<16)return{kind:'own',id:u.id,drag:(u.type==='inf')&&!UI.target};}
  for(const m of (S.marks.ied||[])){const [sx,sy]=toS(m.x,m.y);if(Math.hypot(sx-x,sy-y)<16)return{kind:'ied',id:m.id,drag:!UI.target};}
  {const r=hitTgt(x,y);if(r)return{kind:'tg',id:r.no,drag:false};}
  for(let i=S.marks.m.length-1;i>=0;i--){const m=S.marks.m[i];const [sx,sy]=toS(m.x,m.y);if(Math.hypot(sx-x,sy-y)<16)return{kind:'pt',id:m.id,drag:!UI.target};}return null;}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);const p=pos(e);ptrs.set(e.pointerId,p);
  if(ptrs.size===1)gest={type:'pan',sx:p.x,sy:p.y,ox:V.ox,oy:V.oy,t:performance.now(),moved:false,mark:hitMark(p.x,p.y)};
  else if(ptrs.size===2){const [a,b]=[...ptrs.values()];gest={type:'pinch',d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,s:V.s,ox:V.ox,oy:V.oy};}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const p=pos(e);ptrs.set(e.pointerId,p);if(!gest)return;
  if(gest.type==='pinch'&&ptrs.size>=2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;const wx=(gest.mx-gest.ox)/gest.s,wy=(gest.my-gest.oy)/gest.s;V.s=clamp(gest.s*d/gest.d,minS(),maxS());V.ox=mx-wx*V.s;V.oy=my-wy*V.s;clampView();}
  else if(gest.type==='pan'){const dx=p.x-gest.sx,dy=p.y-gest.sy;if(!gest.moved&&Math.hypot(dx,dy)>7)gest.moved=true;if(!gest.moved)return;
    if(gest.mark&&gest.mark.drag){const [mx,my]=toM(p.x,p.y);const o=gest.mark.kind==='own'?S.marks.own[gest.mark.id]:gest.mark.kind==='ied'?(S.marks.ied||[]).find(m=>m.id===gest.mark.id):S.marks.m.find(m=>m.id===gest.mark.id);if(o){o.x=clamp(mx,0,MWm);o.y=clamp(my,0,MHm);}dirty=true;}
    else{V.ox=gest.ox+dx;V.oy=gest.oy+dy;clampView();}}});
function endPtr(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(gest&&gest.type==='pan'&&!gest.moved&&performance.now()-gest.t<600&&e.type==='pointerup')onTap(gest.sx,gest.sy,gest.mark);gest=ptrs.size?{type:'none'}:null;}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('wheel',e=>{e.preventDefault();const p=pos(e);const wx=(p.x-V.ox)/V.s,wy=(p.y-V.oy)/V.s;V.s=clamp(V.s*Math.exp(-e.deltaY*.0015),minS(),maxS());V.ox=p.x-wx*V.s;V.oy=p.y-wy*V.s;clampView();},{passive:false});
function onTap(x,y,mark){const [mx,my]=toM(x,y);if(mx<0||my<0||mx>MWm||my>MHm)return;
  const t=UI.target;
  if(t){if(t.needB){const b=bldAt(mx,my,25);if(!b)return;t.b=b.n;t.pt={x:b.cx,y:b.cy};}else{t.pt={x:mx,y:my};}updTarget();dirty=true;return;}
  if(mark){if(mark.kind==='own')selectUnit(mark.id,false);else if(mark.kind==='ied')openIedSheet(mark.id);else if(mark.kind==='tg')openTgtSheet(mark.id);else openPtSheet(mark.id);return;}
  const b=bldAt(mx,my,0);if(b){openBldSheet(b.n);return;}
  if(selId){selId=null;updUnits();dirty=true;}}


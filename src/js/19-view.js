/* ---------- view ---------- */
const cv=$('#map'),ctx=cv.getContext('2d');let mapCv=null,cw=300,ch=300,dpr=1,dirty=true;
const V={s:.5,ox:0,oy:0};
const minS=()=>Math.min(cw/W,ch/H)*.94,maxS=()=>3.2;
const toS=(x,y)=>[V.ox+x*K*V.s,V.oy+y*K*V.s];
const toM=(sx,sy)=>[(sx-V.ox)/V.s/K,(sy-V.oy)/V.s/K];
function clampView(){V.s=clamp(V.s,minS(),maxS());const mw=W*V.s,mh=H*V.s,pad=60;V.ox=mw<cw?(cw-mw)/2:clamp(V.ox,cw-mw-pad,pad);V.oy=mh<ch?(ch-mh)/2:clamp(V.oy,ch-mh-pad,pad);dirty=true;}
function centerOn(x,y,s){if(s)V.s=s;V.ox=cw/2-x*K*V.s;V.oy=ch/2-y*K*V.s;clampView();}
function ensureVisible(x,y){const [sx,sy]=toS(x,y);if(sx<30||sy<30||sx>cw-30||sy>ch-30)centerOn(x,y);}
function resize(){const r=cv.getBoundingClientRect();if(!r.width||!r.height)return;const cx=(cw/2-V.ox)/V.s,cy=(ch/2-V.oy)/V.s;cw=r.width;ch=r.height;dpr=Math.min(3,window.devicePixelRatio||1);cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);
  if(!resize.done){resize.done=true;centerOn(700,1650,clamp(cw/W*1.5,minS(),maxS()));}else{V.ox=cw/2-cx*V.s;V.oy=ch/2-cy*V.s;clampView();}dirty=true;}
new ResizeObserver(resize).observe(cv);

function arrow(c,ax,ay,bx,by,col){c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2;c.setLineDash([7,5]);c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();c.setLineDash([]);const a=Math.atan2(by-ay,bx-ax);c.beginPath();c.moveTo(bx,by);c.lineTo(bx-11*Math.cos(a-.4),by-11*Math.sin(a-.4));c.lineTo(bx-11*Math.cos(a+.4),by-11*Math.sin(a+.4));c.closePath();c.fill();c.restore();}
function halo(c,t,x,y,col){c.lineWidth=3;c.strokeStyle='rgba(244,242,236,.92)';c.strokeText(t,x,y);c.fillStyle=col;c.fillText(t,x,y);}
function symHos(c,x,y,r,t){c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r,y);c.lineTo(x,y+r);c.lineTo(x-r,y);c.closePath();c.fillStyle='#ff9b9b';c.fill();c.strokeStyle='#7a1010';c.lineWidth=1.8;c.stroke();if(t){c.fillStyle='#5a0b0b';c.font=(HE?('700 10px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText(t,x,y+.5);}}
function symUnk(c,x,y){c.beginPath();c.arc(x,y,9,0,7);c.fillStyle='#ffef8a';c.fill();c.strokeStyle='#6b5a00';c.lineWidth=1.8;c.stroke();c.fillStyle='#4a3e00';c.font=(HE?('700 11px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText('?',x,y+.5);}
function symTun(c,x,y){c.beginPath();c.arc(x,y,9,0,7);c.fillStyle='#e3c08a';c.fill();c.strokeStyle='#5a3a10';c.lineWidth=1.8;c.stroke();c.beginPath();c.moveTo(x-5,y-3);c.lineTo(x+5,y-3);c.lineTo(x,y+4);c.closePath();c.fillStyle='#5a3a10';c.fill();}
function symIed(c,x,y,r){c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r,y+r*.8);c.lineTo(x-r,y+r*.8);c.closePath();c.fillStyle='#ffcf5a';c.fill();c.strokeStyle='#7a3a00';c.lineWidth=1.8;c.stroke();c.fillStyle='#5a2800';c.font='700 '+Math.round(r*1.1)+'px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('!',x,y+r*.3);}
function symCiv(c,x,y){c.fillStyle='#a8e6a1';c.strokeStyle='#1f5a1a';c.lineWidth=1.8;c.fillRect(x-8,y-8,16,16);c.strokeRect(x-8,y-8,16,16);}
const UI={target:null};
function unitGlyph(c,u,sx,sy,w,h){c.strokeStyle='#14324a';c.lineWidth=1.2;c.beginPath();
  if(u.sap){c.moveTo(sx-8,sy-4);c.lineTo(sx+8,sy-4);for(const dx of [-8,0,8]){c.moveTo(sx+dx,sy-4);c.lineTo(sx+dx,sy+4);}c.lineWidth=1.8;c.stroke();}
  else if(u.cls==='inf'||u.cls==='rec'){if(u.cls==='rec'){c.moveTo(sx-w/2,sy+h/2);c.lineTo(sx+w/2,sy-h/2);}else{c.moveTo(sx-w/2,sy-h/2);c.lineTo(sx+w/2,sy+h/2);c.moveTo(sx+w/2,sy-h/2);c.lineTo(sx-w/2,sy+h/2);}c.stroke();}
  else{if(u.uc){c.moveTo(sx-w/2,sy+h/2);c.lineTo(sx+w/2,sy-h/2);}else{c.moveTo(sx-w/2,sy-h/2);c.lineTo(sx+w/2,sy+h/2);c.moveTo(sx+w/2,sy-h/2);c.lineTo(sx-w/2,sy+h/2);}c.stroke();
    c.fillStyle='#a8dcf5';c.fillRect(sx-6.5,sy-4.5,13,9);c.fillStyle='#14324a';c.font='700 8px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('SF',sx,sy+.5);}
  if(u.veh){c.fillStyle='#14324a';for(const dx of [-6,6]){c.beginPath();c.arc(sx+dx,sy+h/2+4,2.4,0,7);c.fill();}}}
function unitIco(u){if(u.type!=='inf')return'';const F='<rect x=\"2\" y=\"3\" width=\"26\" height=\"16\" fill=\"#a8dcf5\" stroke=\"#14324a\" stroke-width=\"1.5\"/>';const S2='<rect x=\"9\" y=\"7\" width=\"12\" height=\"8\" fill=\"#a8dcf5\"/><text x=\"15\" y=\"13.6\" font-size=\"7\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#14324a\" font-family=\"Arial,sans-serif\">SF</text>';
  if(u.sap)return'<svg class="ico" viewBox="0 0 30 22">'+F+'<path d="M7 8h16M7 8v7M15 8v7M23 8v7" stroke="#14324a" stroke-width="1.7" fill="none"/></svg>';
  if(u.cls==='inf')return'<svg class="ico" viewBox="0 0 30 22">'+F+'<path d="M2 3l26 16M28 3L2 19" stroke="#14324a" stroke-width="1.2"/></svg>';
  if(u.cls==='rec')return'<svg class="ico" viewBox="0 0 30 22">'+F+'<path d="M2 19L28 3" stroke="#14324a" stroke-width="1.2"/></svg>';
  return'<svg class="ico" viewBox="0 0 30 22">'+F+(u.uc?'<path d="M2 19L28 3" stroke="#14324a" stroke-width="1.2"/>':'<path d="M2 3l26 16M28 3L2 19" stroke="#14324a" stroke-width="1.2"/>')+S2+'</svg>';}
function render(){
  if(!dirty||!mapCv)return;dirty=false;const c=ctx;
  c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#15181c';c.fillRect(0,0,cw,ch);
  c.save();c.translate(V.ox,V.oy);c.scale(V.s*K,V.s*K);
  c.drawImage(mapCv,0,0,MWm,MHm);
  for(const n in S.destroyed){const b=BN(+n);c.fillStyle='rgba(30,30,30,.75)';c.fillRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);c.strokeStyle='#111';c.lineWidth=2/(V.s*K);c.beginPath();c.moveTo(b.x0,b.y0);c.lineTo(b.x1,b.y1);c.moveTo(b.x1,b.y0);c.lineTo(b.x0,b.y1);c.stroke();}
  drawBDmg(c);drawDebris(c,V.s*K);
  for(const n in S.cleared){const b=BN(+n);c.strokeStyle='#1f6fb0';c.lineWidth=3/(V.s*K);c.strokeRect(b.x0-2,b.y0-2,b.x1-b.x0+4,b.y1-b.y0+4);}
  c.lineWidth=1.2/(V.s*K);c.strokeStyle='rgba(176,30,120,.7)';c.beginPath();for(let x=CELL;x<MWm;x+=CELL){c.moveTo(x,0);c.lineTo(x,MHm);}for(let y=CELL;y<MHm;y+=CELL){c.moveTo(0,y);c.lineTo(MWm,y);}c.stroke();
  if(S.marks.labArea){const A=S.marks.labArea;c.setLineDash([12/(V.s*K),8/(V.s*K)]);c.strokeStyle='rgba(205,125,20,.95)';c.lineWidth=3/(V.s*K);c.strokeRect(A.x+5,A.y+5,CELL-10,CELL-10);c.setLineDash([]);}
  const t=UI.target;
  if(t&&t.pt){if(t.b){const b=BN(t.b);c.strokeStyle='#e9a21a';c.lineWidth=4/(V.s*K);c.strokeRect(b.x0-3,b.y0-3,b.x1-b.x0+6,b.y1-b.y0+6);if(t.kind==='strike'){c.setLineDash([8/(V.s*K),6/(V.s*K)]);c.strokeStyle='rgba(200,40,40,.8)';c.lineWidth=2/(V.s*K);c.beginPath();c.arc(b.cx,b.cy,100,0,7);c.stroke();c.setLineDash([]);}if(t.kind==='cordon'){c.setLineDash([8/(V.s*K),6/(V.s*K)]);c.strokeStyle='rgba(31,111,176,.8)';c.lineWidth=2/(V.s*K);c.beginPath();c.arc(b.cx,b.cy,120,0,7);c.stroke();c.setLineDash([]);}}
    if(t.kind==='uav'){c.setLineDash([8/(V.s*K),6/(V.s*K)]);c.strokeStyle='rgba(31,111,176,.8)';c.lineWidth=2/(V.s*K);c.beginPath();c.arc(t.pt.x,t.pt.y,320,0,7);c.stroke();c.setLineDash([]);}}
  if(S.mol.cover&&S.mol.st==='station'){c.setLineDash([10/(V.s*K),7/(V.s*K)]);c.strokeStyle='rgba(196,40,40,.7)';c.lineWidth=2/(V.s*K);c.beginPath();c.arc(S.mol.cover.x,S.mol.cover.y,250,0,7);c.stroke();c.setLineDash([]);}
  // uav orbit
  c.setLineDash([10/(V.s*K),8/(V.s*K)]);c.strokeStyle='rgba(31,111,176,.55)';c.lineWidth=1.6/(V.s*K);c.beginPath();c.arc(S.uav.tx,S.uav.ty,320,0,7);c.stroke();c.setLineDash([]);
  c.restore();
  // grid labels (cells)
  c.font=(HE?('700 11px "Heebo", sans-serif'):('700 11px "PT Mono", monospace'));c.textAlign='center';c.textBaseline='middle';
  const [x0,y0]=toS(0,0);const ty=Math.max(y0,0)+10,lx=Math.max(x0,0)+11;
  for(let j=0;j<7;j++){const [sx]=toS(j*CELL+CELL/2,0);if(sx<14||sx>cw-14)continue;c.fillStyle='rgba(120,20,85,.85)';c.fillRect(sx-9,ty-8,18,16);c.fillStyle='#fff';c.fillText(COLS[j],sx,ty);}
  for(let k=0;k<11;k++){const [,sy]=toS(0,k*CELL+CELL/2);if(sy<28||sy>ch-10)continue;c.fillStyle='rgba(120,20,85,.85)';c.fillRect(lx-10,sy-8,20,16);c.fillStyle='#fff';c.fillText(k+1,lx,sy);}
  // staging
  if(S.mol.cover&&S.mol.st==='station'){const [sx,sy]=toS(S.mol.cover.x,S.mol.cover.y-250);c.font='700 11px "Rubik", "Roboto Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';halo(c,(HE?('חיפוי «שרף»'):((EN?("Hammer cover"):('прикрытие «Молота»')))),sx,sy-8,'#a01818');}
  if(S.marks.labArea){const [sx,sy]=toS(S.marks.labArea.x+CELL/2,S.marks.labArea.y+5);c.font='700 11px "Rubik", "Roboto Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';halo(c,(HE?('אזור המעבדה (מודיעין)'):((EN?("workshop area (intel)"):('район мастерской (разведка)')))),sx,sy+10,'#9a5300');}
  {const [sx,sy]=toS(STAGE.x,STAGE.y);c.font=(HE?('700 12px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign='center';halo(c,(HE?('נק״כ «ארז»'):((EN?("Staging \"Cedar\""):('ТС «Кедр»')))),sx,sy+28,'#14324a');}
  // building marks
  for(const n in S.marks.b){const b=BN(+n),[sx,sy]=toS(b.cx,b.cy),k=S.marks.b[n];const ox=sx+14,oy=sy-12;if(k==='hos')symHos(c,ox,oy,10,'');else if(k==='unk')symUnk(c,ox,oy);else if(k==='civ')symCiv(c,ox,oy);else if(k==='tun')symTun(c,ox,oy);}
  for(const n in (S.marks.bied||{})){const b=BN(+n),[sx,sy]=toS(b.cx,b.cy);symIed(c,sx-15,sy-12,9);}
  for(const m of (S.marks.ied||[])){const [sx,sy]=toS(m.x,m.y);symIed(c,sx,sy,11);c.font='10px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';halo(c,(HE?('מטען '):((EN?("IED "):('СВУ '))))+fmt(m.t),sx,sy+19,'#7a3a00');}
  for(const m of S.marks.m){const [sx,sy]=toS(m.x,m.y);symHos(c,sx,sy,11,'');c.font=(HE?('10px "Heebo", sans-serif'):('10px "PT Mono", monospace'));c.textAlign='center';c.textBaseline='middle';halo(c,fmt(m.t),sx,sy+19,'#7a1010');}
  for(const id in S.marks.ord){const o=S.marks.ord[id];const a=toS(o.fx,o.fy),b=toS(o.x,o.y);arrow(c,a[0],a[1],b[0],b[1],'#1f6fb0');}
  for(const m of S.marks.strike){const b=BN(m.b),[sx,sy]=toS(b.cx,b.cy),r=100*K*V.s;c.save();c.strokeStyle='#c42828';c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.arc(sx,sy,r,0,7);c.stroke();c.setLineDash([]);c.font=(HE?('700 11px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';halo(c,m.tI?(S.t<m.tI?(HE?(`תקיפה ${fmt(m.tI)}`):((EN?(`strike ${fmt(m.tI)}`):(`удар ${fmt(m.tI)}`)))):(HE?('תקיפה'):((EN?("strike"):('удар'))))):(HE?('בקשה'):((EN?("requested"):('заявка')))),sx,sy-r-8,'#c42828');c.restore();}
  if(S.marks.car){const [sx,sy]=toS(S.marks.car.x,S.marks.car.y);c.save();c.fillStyle='#a8dcf5';c.strokeStyle='#14324a';c.lineWidth=1.6;c.fillRect(sx-17,sy-9,34,18);c.strokeRect(sx-17,sy-9,34,18);c.fillStyle='#14324a';c.font='700 10px "Rubik", "Roboto Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText((HE?('רכב'):((EN?("CAR"):('АВТО')))),sx,sy+.5);c.restore();}
  if(S.mission)drawObjective(c);
  for(const z of S.marks.lz){const [sx,sy]=toS(z.x,z.y);c.save();c.strokeStyle='#1f6fb0';c.lineWidth=2;c.fillStyle='rgba(235,245,252,.9)';c.beginPath();c.arc(sx,sy,13,0,7);c.fill();c.stroke();c.fillStyle='#14324a';c.font=(HE?('700 12px "Rubik", sans-serif'):('700 12px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText('H',sx,sy+.5);c.restore();}
  for(const b in S.pc){const pc=S.pc[b],B=BN(+b),[sx,sy]=toS(B.cx,B.y0);c.font=(HE?('700 11px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';halo(c,(HE?(`«סיר לחץ» ${pc.stage}`):((EN?(`"PRESSURE COOKER" ${pc.stage}`):(`«СКОРОВАРКА» ${pc.stage}`)))),sx,sy-10,'#8a4a00');}
  if(S.truth&&S.lpath&&S.lpath.length>1){c.save();const P=S.lpath.map(q=>toS(q[0],q[1]));c.strokeStyle='#b0121b';c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();P.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.setLineDash([]);const a=P[P.length-2],z=P[P.length-1],ang=Math.atan2(z[1]-a[1],z[0]-a[0]);c.fillStyle='#b0121b';c.beginPath();c.moveTo(z[0],z[1]);c.lineTo(z[0]-13*Math.cos(ang-.45),z[1]-13*Math.sin(ang-.45));c.lineTo(z[0]-13*Math.cos(ang+.45),z[1]-13*Math.sin(ang+.45));c.closePath();c.fill();c.beginPath();c.arc(P[0][0],P[0][1],5,0,7);c.fill();c.font='700 12px "Rubik", "Roboto Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';halo(c,(HE?('מסלול «המהנדס»'):((EN?("Engineer's route"):('путь «Инженера»')))),(P[0][0]+z[0])/2,(P[0][1]+z[1])/2-12,'#b0121b');if(S.leader==='escaped')halo(c,(HE?('ברח במנהרה'):((EN?("escaped into tunnel"):('ушёл в ход')))),z[0],z[1]+30,'#b0121b');c.restore();}
  if(S.truth){c.save();for(const u of infs()){const m=S.marks.own[u.id];const a=toS(m.x,m.y),b=toS(u.x,u.y);c.strokeStyle='rgba(20,20,20,.7)';c.setLineDash([3,3]);c.lineWidth=1.5;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.setLineDash([]);c.fillStyle='#14324a';c.beginPath();c.arc(b[0],b[1],6,0,7);c.fill();c.font=(HE?('700 11px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign=(HE?('right'):('left'));c.textBaseline='middle';halo(c,u.sh+(HE?(' בפועל'):((EN?(" actual"):(' факт')))),(HE?(b[0]-9):(b[0]+9)),b[1],'#14324a');}
    for(const e of alive()){const [sx,sy]=toS(e.x,e.y);c.fillStyle='#c42828';c.beginPath();c.arc(sx,sy,8,0,7);c.fill();c.fillStyle='#fff';c.font=(HE?('700 10px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText(e.men,sx,sy+.5);}
    [[S.L,(HE?('«המהנדס»'):((EN?("\"The Engineer\""):('«Инженер»'))))],[S.T,(HE?('מנהרה'):((EN?("tunnel"):('ход'))))],[S.Wk,(HE?('מעבדה'):((EN?("workshop"):('мастерская'))))]].forEach(([n,l])=>{const b=BN(n),[sx,sy]=toS(b.cx,b.cy);c.font=(HE?('700 12px "Rubik", sans-serif'):('700 12px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';halo(c,l,sx,sy+20,'#8a1a1a');});
    for(const b of BL){if(S.civ[b.n]>0){const [sx,sy]=toS(b.cx,b.cy);c.fillStyle='rgba(60,140,60,.85)';c.font=(HE?('700 10px "Rubik", sans-serif'):('700 10px "Roboto Condensed", sans-serif'));c.textAlign='center';c.fillText((HE?('א'):((EN?("c"):('м'))))+S.civ[b.n],sx-14,sy+12);}}c.restore();}
  for(const u of S.units){const m=S.marks.own[u.id];const [sx,sy]=toS(m.x,m.y);c.save();const w=28,h=18;
    if(selId===u.id){c.fillStyle='rgba(31,111,176,.3)';c.fillRect(sx-w/2-5,sy-h/2-5,w+10,h+10);}
    c.fillStyle='#a8dcf5';c.strokeStyle='#14324a';c.lineWidth=1.6;c.fillRect(sx-w/2,sy-h/2,w,h);c.strokeRect(sx-w/2,sy-h/2,w,h);
    if(u.type==='inf'){unitGlyph(c,u,sx,sy,w,h);}
    else{c.fillStyle='#14324a';c.font=(HE?('700 10px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';c.fillText(u.type==='uav'?(HE?('כטב״ם'):((EN?("UAV"):('БПЛА')))):u.sh===(HE?('ש'):((EN?("Hm"):('М'))))?(HE?('קרב'):((EN?("FOB"):('ВОП')))):(HE?('פינוי'):('MED')),sx,sy+.5);}
    c.font=(HE?('700 11px "Rubik", sans-serif'):('700 11px "Roboto Condensed", sans-serif'));c.textAlign='center';c.textBaseline='middle';if(u.type==='inf')halo(c,u.sh,sx,sy+h/2+(u.veh?15:9),'#14324a');c.restore();}
  if(t&&t.pt&&!t.b){const [sx,sy]=toS(t.pt.x,t.pt.y);c.save();c.strokeStyle='#e9a21a';c.lineWidth=2;c.beginPath();c.arc(sx,sy,10,0,7);c.moveTo(sx-17,sy);c.lineTo(sx+17,sy);c.moveTo(sx,sy-17);c.lineTo(sx,sy+17);c.stroke();c.restore();}
}


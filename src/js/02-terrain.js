/* ---------- generated maps for training: town type and shape, roads, terrain ---------- */
const M_CLASSIC={classic:true,type:'classic',cx:700,cy:860,rx:500,ry:640,minA:500};
let M=M_CLASSIC;
const TOWN={grid:['Город','העיר'],old:['Старый город','העיר העתיקה'],camp:['Лагерь беженцев','מחנה הפליטים'],village:['Деревня','הכפר'],mixed:['Город со старым центром','העיר עם הגרעין העתיק']};
const TOWNL={grid:['город с прямыми улицами','עיר עם רחובות ישרים'],old:['старый город, узкие переулки','עיר עתיקה, סמטאות צרות'],camp:['лагерь беженцев, очень плотная застройка','מחנה פליטים, בנייה צפופה מאוד'],village:['деревня, дома с дворами','כפר, בתים עם חצרות'],mixed:['город со старым центром','עיר עם גרעין עתיק']};
function segDist(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy||1;const t=clamp(((px-ax)*dx+(py-ay)*dy)/l,0,1);return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function lineDist(x,y,pts){let d=1e9;for(let i=1;i<pts.length;i++)d=Math.min(d,segDist(x,y,pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1]));return d;}
// our groups outside the town are harder to spot in orchards and in the wadi bed
function coverAt(x,y){if(M.classic||inTown(x,y))return false;if(M.orch.some(o=>x>o.x0&&x<o.x1&&y>o.y0&&y<o.y1))return true;return!!(M.wadi&&lineDist(x,y,M.wadi)<16);}
function genCity2(seed,dens){const r=mulberry(seed*31+7);BL=[];BLOCKS=[];
  const type=['grid','old','camp','village','mixed'][Math.floor(r()*5)];const dn=dens==='dense'?1:dens==='sparse'?-1:0;
  let rx,ry;if(type==='camp'){rx=250+r()*120;ry=290+r()*150;}else if(type==='village'){rx=400+r()*150;ry=430+r()*190;}else{rx=340+r()*210;ry=400+r()*240;}
  if(r()<.35){if(r()<.5)rx*=.75;else ry*=.8;}ry=Math.min(ry,630);rx=Math.min(rx,540);
  const cy=230+ry+r()*Math.max(0,1540-2*ry-230),cx=150+rx+r()*Math.max(0,1100-2*rx);
  const ph=[r()*6.28,r()*6.28,r()*6.28],am=[.07+r()*.1,.04+r()*.07,.03];
  const edge=(x,y)=>{const a=Math.atan2((y-cy)/ry,(x-cx)/rx);return 1+am[0]*Math.sin(2*a+ph[0])+am[1]*Math.sin(3*a+ph[1])+am[2]*Math.sin(5*a+ph[2]);};
  const P={grid:{sx:[120,170],sy:[105,150],g:7,ga:13,jit:2,split:0,lot:.07,ins:[3,8],shr:.5,n:[.15,.55,.85],minA:500,fl:[1,2]},
    old:{sx:[70,110],sy:[62,96],g:4,ga:10,jit:6,split:.4,lot:.04,ins:[1,3],shr:.25,n:[.05,.35,.75],minA:330,fl:[2,3]},
    camp:{sx:[48,72],sy:[44,66],g:3,ga:8,jit:3,split:.25,lot:.02,ins:[.5,1.5],shr:.12,n:[.05,.4,.8],minA:300,fl:[2,4]},
    village:{sx:[105,150],sy:[100,140],g:8,ga:12,jit:8,split:0,lot:.14,ins:[4,10],shr:.6,n:[.5,.9,1],minA:300,fl:[1,2]},
    mixed:{sx:[120,165],sy:[105,145],g:7,ga:13,jit:2,split:0,lot:.06,ins:[3,8],shr:.5,n:[.15,.55,.85],minA:450,fl:[1,2]}}[type];
  const lotP=Math.max(.01,P.lot+(dn<0?.1:dn>0?-.03:0));
  const ax=cx+(r()-.5)*rx*.5,ay=cy+(r()-.5)*ry*.5;
  const steps=(c0,lo,hi,a,b)=>{const out=[c0];for(let v=c0;v>lo;){v-=a+r()*(b-a);out.unshift(v);}for(let v=c0;v<hi;){v+=a+r()*(b-a);out.push(v);}return out;};
  const xs=steps(ax,cx-rx*1.2,cx+rx*1.2,P.sx[0],P.sx[1]),ys=steps(ay,cy-ry*1.2,cy+ry*1.2,P.sy[0],P.sy[1]);
  const avy=[ay];if(type!=='camp'&&ys.length>7&&r()<.6){const i=ys.indexOf(ay);const j=clamp(i+(r()<.5?-3:3),1,ys.length-2);if(Math.abs(ys[j]-ay)>150)avy.push(ys[j]);}
  const isAv=(v,arr)=>arr.some(a=>Math.abs(a-v)<.01);
  const cells=[];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
    const gl=isAv(xs[i],[ax])?P.ga:P.g,gr=isAv(xs[i+1],[ax])?P.ga:P.g,gt=isAv(ys[j],avy)?P.ga:P.g,gb=isAv(ys[j+1],avy)?P.ga:P.g;
    const b={x0:xs[i]+gl+r()*P.jit,x1:xs[i+1]-gr-r()*P.jit,y0:ys[j]+gt+r()*P.jit,y1:ys[j+1]-gb-r()*P.jit};
    const bx=(b.x0+b.x1)/2,by=(b.y0+b.y1)/2;const e=Math.sqrt(((bx-cx)/rx)**2+((by-cy)/ry)**2)/edge(bx,by);
    if(e>.88+r()*.22)continue;if(type==='village'&&e>.35&&r()<.15)continue;
    const core=type==='mixed'&&e<.5;const split=core?.9:P.split;
    if(r()<split&&!isAv(xs[i],[ax])){const w=b.x1-b.x0,h=b.y1-b.y0,f=.35+r()*.3,al=core?4:P.g;
      if(w>h){const m=b.x0+w*f;cells.push({...b,x1:m-al/2,core},{...b,x0:m+al/2,core});}else{const m=b.y0+h*f;cells.push({...b,y1:m-al/2,core},{...b,y0:m+al/2,core});}}
    else cells.push({...b,core});}
  // a diagonal main road cuts through some towns
  let diag=null;if(type!=='camp'&&type!=='old'&&r()<.45){const d=ry*(.5+r()*.6)*(r()<.5?-1:1);diag=[[cx-rx*1.25,cy-d/2],[cx+rx*1.25,cy+d/2]];}
  const raw=[];const minW=type==='camp'?26:34;
  for(const b of cells){if(b.x1-b.x0<minW||b.y1-b.y0<minW)continue;
    if(diag){let hit=false;for(let t=0;t<=1&&!hit;t+=.004){const x=diag[0][0]+(diag[1][0]-diag[0][0])*t,y=diag[0][1]+(diag[1][1]-diag[0][1])*t;if(x>b.x0-12&&x<b.x1+12&&y>b.y0-12&&y<b.y1+12)hit=true;}if(hit){b.lot=true;b.road=true;BLOCKS.push(b);continue;}}
    BLOCKS.push(b);if(r()<lotP){b.lot=true;continue;}
    const pp=b.core?{n:[.05,.35,.75],ins:[1,3],shr:.25}:P;
    if(type==='village'){const k=1+(r()<.6?1:0)+(r()<.3?1:0);const placed=[];for(let q=0;q<k*5&&placed.length<k;q++){const w=16+r()*18,h=15+r()*16;if(w>b.x1-b.x0-8||h>b.y1-b.y0-8)continue;const x0=b.x0+4+r()*(b.x1-b.x0-8-w),y0=b.y0+4+r()*(b.y1-b.y0-8-h);
        if(placed.some(o=>x0<o.x1+6&&x0+w>o.x0-6&&y0<o.y1+6&&y0+h>o.y0-6))continue;const o={x0,x1:x0+w,y0,y1:y0+h};placed.push(o);raw.push(o);}continue;}
    const n=r()<pp.n[0]?1:r()<pp.n[1]?2:r()<pp.n[2]?3:4+(type==='camp'&&r()<.5?1:0);const horiz=(b.x1-b.x0)>(b.y1-b.y0);
    let cuts=[0];for(let k=1;k<n;k++)cuts.push(k/n+(r()-.5)*.12);cuts.push(1);
    for(let k=0;k<n;k++){let x0,x1,y0,y1;
      if(horiz){x0=b.x0+(b.x1-b.x0)*cuts[k];x1=b.x0+(b.x1-b.x0)*cuts[k+1];y0=b.y0;y1=b.y1;}else{y0=b.y0+(b.y1-b.y0)*cuts[k];y1=b.y0+(b.y1-b.y0)*cuts[k+1];x0=b.x0;x1=b.x1;}
      const ins=()=>pp.ins[0]+r()*(pp.ins[1]-pp.ins[0]);x0+=ins();x1-=ins();y0+=ins();y1-=ins();
      const sw=x1-x0,sh=y1-y0;if(r()<pp.shr){const f=.65+r()*.3;if(r()<.5)x1=x0+sw*f;else x0=x1-sw*f;}if(r()<pp.shr){const f=.65+r()*.3;if(r()<.5)y1=y0+sh*f;else y0=y1-sh*f;}
      if(x1-x0<12||y1-y0<12)continue;raw.push({x0,x1,y0,y1});}}
  raw.sort((a,b)=>Math.floor(a.y0/90)-Math.floor(b.y0/90)||a.x0-b.x0);
  raw.forEach((b,i)=>{b.n=i+1;b.cx=(b.x0+b.x1)/2;b.cy=(b.y0+b.y1)/2;b.area=(b.x1-b.x0)*(b.y1-b.y0);b.prot=null;b.fl=P.fl[0]+Math.floor(r()*(P.fl[1]-P.fl[0]+1));if(b.area>1500&&b.fl<2)b.fl=2;BL.push(b);});
  const big=[...BL].sort((a,b)=>b.area-a.area).slice(0,Math.max(6,Math.round(BL.length*.12)));const used=new Set();
  const protAt=(tx,ty,label)=>{const c=big.filter(b=>!used.has(b));if(!c.length)return;const b=c.reduce((a,o)=>Math.hypot(o.cx-tx,o.cy-ty)<Math.hypot(a.cx-tx,a.cy-ty)?o:a);b.prot=label;used.add(b);};
  protAt(cx+(r()-.5)*rx*1.2,cy+ry*.35,HE?'בית ספר':'школа');protAt(cx+(r()-.5)*rx*1.2,cy-ry*.35,HE?'מרפאה':'поликлиника');
  if(type!=='grid')protAt(cx+(r()-.5)*rx*.5,cy+(r()-.5)*ry*.5,HE?'מסגד':'мечеть');
  // terrain and roads
  const pal=['#d9d6c4','#d6d1b8','#d3d6c0','#ddd3bb','#d8d8c6'];
  const T={classic:false,type,cx,cy,rx,ry,edge,minA:P.minA,avx:[ax],avy,diag,bg:pal[Math.floor(r()*pal.length)],roads:[],tracks:[],orch:[],hills:[],fields:[],wadi:null,cem:null,ga:P.ga};
  const outT=(x,y,m)=>Math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2)>(m||1.15);
  const nearBase=(x,y,d)=>Math.hypot(x-700,y-2090)<d;
  const top=cy-ry*1.05,bot=cy+ry*1.05,left=cx-rx*1.1,right=cx+rx*1.1;const wAv=P.ga*2-6;
  T.roads.push({w:wAv,pts:[[ax+(r()-.5)*300,0],[ax+(r()-.5)*60,top*.5],[ax,top],[ax,bot],[(ax+700)/2+(r()-.5)*160,(bot+2090)/2],[700,2090],[700+(r()-.5)*300,MHm]]});
  avy.forEach((y,i)=>T.roads.push({w:i?wAv-4:wAv,pts:[[0,y+(r()-.5)*240],[left*.5,y+(r()-.5)*60],[left,y],[right,y],[(right+MWm)/2,y+(r()-.5)*60],[MWm,y+(r()-.5)*240]]}));
  if(diag)T.roads.push({w:12,pts:diag});
  for(let i=0;i<5;i++){const hx=r()*MWm,hy=r()*1900;if(!outT(hx,hy,1.35)||nearBase(hx,hy,320))continue;T.hills.push({x:hx,y:hy,r:110+r()*150,h:280+Math.floor(r()*350),k:3+Math.floor(r()*3)});}
  if(r()<.85){const pts=[];const fromW=r()<.5;let x=fromW?0:MWm,y=200+r()*1500;const dx=fromW?1:-1;for(let k=0;k<12;k++){pts.push([x,y]);x+=dx*(MWm/11);y+=(r()-.5)*260;
      let g=0;while(!outT(x,y,1.1)&&g++<20)y+=y<cy?-30:30;y=clamp(y,40,1950);}T.wadi=pts;}
  for(let i=0;i<14&&T.orch.length<7;i++){const w=110+r()*170,h=80+r()*150,x0=r()*(MWm-w),y0=r()*(1950-h);const cxo=x0+w/2,cyo=y0+h/2;
    if(!outT(cxo,cyo,1.25)||nearBase(cxo,cyo,260)||T.orch.some(o=>x0<o.x1+20&&x0+w>o.x0-20&&y0<o.y1+20&&y0+h>o.y0-20))continue;T.orch.push({x0,y0,x1:x0+w,y1:y0+h,olive:r()<.6});}
  for(let i=0;i<10&&T.fields.length<5;i++){const w=120+r()*200,h=90+r()*160,x0=r()*(MWm-w),y0=r()*(2000-h);const cxo=x0+w/2,cyo=y0+h/2;
    if(!outT(cxo,cyo,1.2)||nearBase(cxo,cyo,240)||T.orch.some(o=>x0<o.x1&&x0+w>o.x0&&y0<o.y1&&y0+h>o.y0))continue;T.fields.push({x0,y0,x1:x0+w,y1:y0+h,a:r()<.5});}
  for(let i=0;i<3;i++){const a=r()*6.28;const sx=cx+Math.cos(a)*rx*1.1,sy=cy+Math.sin(a)*ry*1.1;const ex=clamp(sx+Math.cos(a)*(250+r()*350),0,MWm),ey=clamp(sy+Math.sin(a)*(250+r()*350),0,2000);T.tracks.push([[sx,sy],[(sx+ex)/2+(r()-.5)*120,(sy+ey)/2+(r()-.5)*120],[ex,ey]]);}
  const lots=BLOCKS.filter(b=>b.lot&&!b.road);if(lots.length&&r()<.7){const dc=b=>Math.hypot((b.x0+b.x1)/2-cx,(b.y0+b.y1)/2-cy);const c=lots.reduce((a,b)=>dc(b)>dc(a)?b:a);c.cem=true;T.cem=c;}
  {const ar=BL.filter(b=>!b.prot).map(b=>b.area).sort((a,b)=>b-a);T.minA=Math.min(P.minA,(ar[Math.min(ar.length-1,24)]||200)-1);}
  M=T;}
function drawTerrain2(g){const r=mulberry(M.cx*7+M.cy);
  g.fillStyle=M.bg;g.fillRect(0,0,MWm,MHm);
  for(let i=0;i<2600;i++){const x=r()*MWm,y=r()*MHm;if(inTown(x,y))continue;g.fillStyle='rgba(140,130,100,.28)';g.beginPath();g.arc(x,y,1.5,0,7);g.fill();}
  for(const f of M.fields){g.fillStyle='rgba(190,178,130,.35)';g.fillRect(f.x0,f.y0,f.x1-f.x0,f.y1-f.y0);g.strokeStyle='rgba(150,130,90,.35)';g.lineWidth=1.2;g.beginPath();
    if(f.a)for(let x=f.x0+6;x<f.x1;x+=9){g.moveTo(x,f.y0);g.lineTo(x,f.y1);}else for(let y=f.y0+6;y<f.y1;y+=9){g.moveTo(f.x0,y);g.lineTo(f.x1,y);}g.stroke();}
  for(const h of M.hills){for(let k=1;k<=h.k;k++){const rr=h.r*(1-(k-1)/(h.k+.5));g.strokeStyle=`rgba(140,105,60,${.25+k*.08})`;g.lineWidth=1.4;g.beginPath();g.ellipse(h.x,h.y,rr*1.15,rr*.85,(h.x%3)*.3,0,7);g.stroke();}}
  for(const o of M.orch){g.fillStyle='rgba(120,140,90,.16)';g.fillRect(o.x0,o.y0,o.x1-o.x0,o.y1-o.y0);g.fillStyle=o.olive?'rgba(96,116,70,.6)':'rgba(80,120,60,.55)';
    for(let y=o.y0+8;y<o.y1-4;y+=14)for(let x=o.x0+8+((y/14)%2)*5;x<o.x1-4;x+=14){g.beginPath();g.arc(x,y,3.2,0,7);g.fill();}}
  if(M.wadi){const w=M.wadi;const path=()=>{g.beginPath();w.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));};g.lineCap='round';g.lineJoin='round';
    path();g.strokeStyle='rgba(200,180,140,.8)';g.lineWidth=26;g.stroke();path();g.strokeStyle='rgba(150,120,80,.75)';g.lineWidth=5;g.setLineDash([14,9]);g.stroke();g.setLineDash([]);}
  g.strokeStyle='rgba(150,120,80,.7)';g.lineWidth=5;g.setLineDash([12,9]);for(const t of M.tracks){g.beginPath();g.moveTo(t[0][0],t[0][1]);g.quadraticCurveTo(t[1][0],t[1][1],t[2][0],t[2][1]);g.stroke();}g.setLineDash([]);}
function drawRoads2(g,inner){for(const rd of M.roads){g.lineCap='round';g.lineJoin='round';g.beginPath();rd.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
  if(!inner){g.strokeStyle='#9d9785';g.lineWidth=rd.w+4;g.stroke();}g.strokeStyle='#f4f2ec';g.lineWidth=rd.w;g.stroke();}}
function drawLabels2(g){g.font=(HE?'20px "Rubik", Arial, sans-serif':'italic 20px "Roboto Condensed", sans-serif');g.fillStyle='#6a5a3c';g.textAlign='center';g.textBaseline='middle';
  for(const h of M.hills)g.fillText(HE?`▲ ${h.h}`:`▲ ${h.h}`,h.x,h.y);
  if(M.wadi){const p=M.wadi[Math.floor(M.wadi.length/2)];g.fillText(HE?'ואדי':'вади',p[0],p[1]-24);}
  M.orch.forEach((o,i)=>{if(i<3)g.fillText(o.olive?(HE?'זיתים':'оливы'):(HE?'מטעים':'сады'),(o.x0+o.x1)/2,o.y0-12);});
  if(M.cem){const c=M.cem;g.fillStyle='rgba(90,90,80,.5)';for(let y=c.y0+8;y<c.y1-6;y+=10)for(let x=c.x0+8;x<c.x1-6;x+=12)g.fillRect(x,y,4,7);g.fillStyle='#6a5a3c';g.font=(HE?'15px "Rubik", Arial, sans-serif':'italic 15px "Roboto Condensed", sans-serif');g.fillText(HE?'בית קברות':'кладбище',(c.x0+c.x1)/2,c.y1+12);}}
function bldAt(x,y,tol){for(const b of BL)if(x>=b.x0-2&&x<=b.x1+2&&y>=b.y0-2&&y<=b.y1+2)return b;if(!tol)return null;let best=null,bd=tol;for(const b of BL){const dx=Math.max(b.x0-x,0,x-b.x1),dy=Math.max(b.y0-y,0,y-b.y1),d=Math.hypot(dx,dy);if(d<bd){bd=d;best=b;}}return best;}
const cell=(x,y)=>COLS[clamp(Math.floor(x/CELL),0,6)]+(clamp(Math.floor(y/CELL),0,10)+1);
function placeTxt(x,y){const b=bldAt(x,y,45);return b?(HE?(`ליד מבנה ${b.n}, משבצת ${cell(x,y)}`):(`у здания ${b.n}, квадрат ${cell(x,y)}`)):(HE?(`משבצת ${cell(x,y)}`):(`квадрат ${cell(x,y)}`));}
const inTown=(x,y)=>M.classic?((x-700)/500)**2+((y-860)/640)**2<1:((x-M.cx)/M.rx)**2+((y-M.cy)/M.ry)**2<M.edge(x,y)**2;

function drawMap(){
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');g.scale(K,K);
  const r=mulberry(77);
  if(M.classic){
  g.fillStyle='#d9d6c4';g.fillRect(0,0,MWm,MHm);
  for(let i=0;i<5200;i++){const x=r()*MWm,y=r()*MHm;if(inTown(x,y))continue;const orch=Math.sin(x*.004+1.3)*Math.cos(y*.003)>.15;if(!orch&&r()<.85)continue;g.fillStyle=orch?'rgba(96,116,70,.55)':'rgba(140,130,100,.3)';g.beginPath();g.arc(x,y,orch?3.2:1.6,0,7);g.fill();}
  g.strokeStyle='rgba(150,120,80,.7)';g.lineWidth=7;g.setLineDash([16,10]);g.beginPath();g.moveTo(1400,1300);g.bezierCurveTo(1200,1500,1300,1750,1050,1900);g.bezierCurveTo(900,2000,950,2150,880,2200);g.stroke();g.setLineDash([]);
  const road=(pts,w)=>{g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.strokeStyle='#9d9785';g.lineWidth=w+4;g.stroke();g.strokeStyle='#f4f2ec';g.lineWidth=w;g.stroke();};
  road([[700,0],[700,MHm]],22);road([[0,860],[MWm,860]],20);road([[700,1700],[420,1900],[300,2200]],10);road([[1150,860],[1300,700],[1400,650]],10);
  for(const b of BLOCKS){g.fillStyle='#f1efe8';g.fillRect(b.x0-8,b.y0-8,b.x1-b.x0+16,b.y1-b.y0+16);}
  g.fillStyle='#f4f2ec';g.fillRect(689,0,22,MHm);g.fillRect(0,850,MWm,20);
  }else{drawTerrain2(g);drawRoads2(g);for(const b of BLOCKS){if(b.road)continue;g.fillStyle='#f1efe8';g.fillRect(b.x0-5,b.y0-5,b.x1-b.x0+10,b.y1-b.y0+10);}drawRoads2(g,true);}
  for(const b of BLOCKS){if(b.road)continue;g.fillStyle=b.lot?'#d8d5c2':'#e3dfd2';g.fillRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);g.strokeStyle='rgba(120,112,95,.5)';g.lineWidth=1;g.strokeRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);}
  for(const b of BL){g.fillStyle=b.prot?'#c9d3df':'#bdb6a6';g.fillRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);g.strokeStyle='#3f3b33';g.lineWidth=1.6;g.strokeRect(b.x0,b.y0,b.x1-b.x0,b.y1-b.y0);
    g.fillStyle='rgba(63,59,51,.18)';g.fillRect(b.x0+2,b.y1-4,b.x1-b.x0-2,4);}
  g.textAlign='center';g.textBaseline='middle';
  for(const b of BL){const fs=clamp(Math.min(b.x1-b.x0,b.y1-b.y0)*.55,13,20);g.font=(HE?(`700 ${fs}px "Rubik", Arial, sans-serif`):(`700 ${fs}px "Roboto Condensed", "Arial Narrow", sans-serif`));g.lineWidth=3.5;g.strokeStyle='rgba(244,242,236,.9)';g.strokeText(b.n,b.cx,b.cy);g.fillStyle='#14171b';g.fillText(b.n,b.cx,b.cy);
    if(b.prot){g.font=(HE?('700 14px "Rubik", sans-serif'):('700 14px "Roboto Condensed", sans-serif'));g.strokeText(b.prot.toUpperCase(),b.cx,b.y1+12);g.fillStyle='#24467a';g.fillText(b.prot.toUpperCase(),b.cx,b.y1+12);}}
  g.font=(HE?('700 34px "Rubik", Arial, sans-serif'):('700 30px "Roboto Condensed", sans-serif'));g.lineWidth=5;g.strokeStyle='rgba(217,214,196,.9)';g.fillStyle='#2b2e33';g.letterSpacing=(HE?('2px'):('6px'));const TX=M.classic?700:M.cx,TY=M.classic?170:Math.max(50,M.cy-M.ry-50);g.strokeText((HE?('דיר נביל'):('ДЕЙР-НАБИЛЬ')),TX,TY);g.fillText((HE?('דיר נביל'):('ДЕЙР-НАБИЛЬ')),TX,TY);g.letterSpacing='0px';
  g.font=(HE?('20px "Rubik", Arial, sans-serif'):('italic 20px "Roboto Condensed", sans-serif'));g.fillStyle='#6a5a3c';if(M.classic){g.fillText((HE?('ואדי'):('вади')),1210,1640);g.fillText((HE?('מטעים'):('сады')),280,1700);g.fillText((HE?('מטעים'):('сады')),1100,1150);}else drawLabels2(g);
  g.font=(HE?('17px "Heebo", Arial, sans-serif'):('16px "PT Mono", monospace'));g.textAlign='right';g.textBaseline='bottom';g.fillStyle='rgba(34,37,42,.75)';g.fillText((HE?('תצ״א מקודד «דיר נביל» · גיליון 1 · רשת 200 מ׳'):('GRG «ДЕЙР-НАБИЛЬ» · лист 1 · сетка 200 м')),MWm-14,MHm-12);
  return cv;
}


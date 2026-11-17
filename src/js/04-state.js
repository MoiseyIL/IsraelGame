/* ---------- state ---------- */
let S;
function squad(id,call,sh,x,y,men,uc){return{id,call,sh,type:'inf',x,y,men:men||8,uc:!!uc,elite:!!uc,drones:3,droneT:0,droneB:0,method:'door',breachT:0,surpT:0,dogBonus:false,dogDone:false,cordon:0,trapNote:'',wounded:0,ammo:100,morale:85,st:'hold',tx:x,ty:y,tb:0,inB:0,clearT:0,acc:0,cont:[],seen:{},newW:0,newK:0,lastCas:0,inFight:false,lowAmmo:false,wT:0,demo:0};}
function grp(id,kind,men,b,o){const B=BN(b);return Object.assign({id,kind,men,max:men,bld:b,x:B.cx,y:B.cy,roof:false,alert:false,leader:false,mode:'idle',wp:null,wi:0,acc:0,cont:[],gone:false,mv:false,tT:0},o||{});}
function newState(TRN){TRN=TRN||null;
  const r=TRN?mulberry(TRN.seed*13+TRN.diff*7+1):Math.random;const pick=a=>a[Math.floor(r()*a.length)];const MX=M.cx,MY=M.cy,RX=M.rx,RY=M.ry;const okB=BL.filter(b=>!b.prot&&b.area>(M.minA||500));
  const nB=M.classic?[880,330,380,700]:[MY+20,MY-RY*.83,RX*.76,MX];let north=okB.filter(b=>b.cy<nB[0]&&b.cy>nB[1]&&Math.abs(b.cx-nB[3])<nB[2]);if(north.length<3)north=okB.filter(b=>b.cy<MY+RY*.2);if(!north.length)north=okB;const L=pick(north);
  const near=(b,a,lo,hi)=>{const d=Math.hypot(b.cx-a.cx,b.cy-a.cy);return d>lo&&d<hi;};
  const pk=(list,fb)=>list.length?pick(list):fb.find(b=>b);
  const T=pk(okB.filter(b=>b!==L&&near(b,L,90,220)),okB.filter(b=>b!==L&&near(b,L,40,400)));
  const Wk=pk(okB.filter(b=>b!==L&&b!==T&&near(b,L,180,420)),okB.filter(b=>b!==L&&b!==T));
  const R=pk(okB.filter(b=>![L,T,Wk].includes(b)&&near(b,L,120,350)),okB.filter(b=>![L,T,Wk].includes(b)));
  let decoys=okB.filter(b=>![L,T,Wk,R].includes(b)&&near(b,L,70,280));if(decoys.length<2)decoys=okB.filter(b=>![L,T,Wk,R].includes(b)).sort((a,b)=>Math.hypot(a.cx-L.cx,a.cy-L.cy)-Math.hypot(b.cx-L.cx,b.cy-L.cy)).slice(0,6);const cand=[L,pick(decoys)];let d2=pick(decoys);while(d2===cand[1]&&decoys.length>1)d2=pick(decoys);cand.push(d2);cand.sort(()=>r()-.5);
  const sT=M.classic?[1180,700,1380]:[MY+RY*.5,MX,MY+RY*.81];let south=okB.filter(b=>b.cy>sT[0]&&b!==L);if(south.length<2)south=[...okB].filter(b=>b!==L).sort((a,b)=>b.cy-a.cy).slice(0,8);const Lk1=south.reduce((a,b)=>Math.abs(b.cx-sT[1])+Math.abs(b.cy-sT[2])*.5<Math.abs(a.cx-sT[1])+Math.abs(a.cy-sT[2])*.5?b:a);
  const Lk2=pk(south.filter(b=>b!==Lk1&&Math.abs(b.cx-Lk1.cx)>250),south.filter(b=>b!==Lk1).concat(okB.filter(b=>b!==Lk1&&b!==L)));
  const civ={};BL.forEach(b=>{civ[b.n]=b.prot===(HE?('מרפאה'):('поликлиника'))?7:b.prot?0:(r()<.68?1+Math.floor(r()*6):0);});
  civ[L.n]=r()<.55?3+Math.floor(r()*3):0;civ[Wk.n]=0;civ[R.n]=r()<.3?2:0;civ[Lk1.n]=Math.max(civ[Lk1.n],2);
  const TM=TRN?[.6,.9,1,1.15][TRN.diff]:1;const traps={};[[L,.6],[Wk,.8],[R,.5],[T,.4]].forEach(([b,p])=>{if(r()<p*TM)traps[b.n]=true;});
  const decoyB=cand.find(b=>b!==L);traps[decoyB.n]=true;
  const ieds=M.classic?[{x:700,y:950+r()*450},{x:r()<.5?300+r()*250:850+r()*250,y:860}]:[{x:M.avx[0],y:MY+60+r()*RY*.6},{x:r()<.5?MX-RX*.8+r()*RX*.5:MX+RX*.3+r()*RX*.5,y:M.avy[0]}];if(TRN){ieds.length=[1,2,2,3][TRN.diff];if(ieds.length>2)ieds[2]=M.classic?{x:700,y:380+r()*380}:{x:M.avx[0],y:MY-RY*.75+r()*RY*.6};}
  civ[decoyB.n]=0;
  const ps=Math.min(1,RY/600);const pw=M.classic?[[700,700],[560,700],[560,1020],[840,1020],[840,700]]:[[MX,MY-160*ps],[MX-140*ps,MY-160*ps],[MX-140*ps,MY+160*ps],[MX+140*ps,MY+160*ps],[MX+140*ps,MY-160*ps]];
  const units=[squad('k1',(HE?('צפע 1'):('Кобра-1')),(HE?('צ1'):('К1')),660,2040),squad('k2',(HE?('צפע 2'):('Кобра-2')),(HE?('צ2'):('К2')),700,2075),squad('k3',(HE?('יהלום'):('Алмаз')),(HE?('יה'):('Ал')),740,2040,6),squad('dv',(HE?('דובדבן'):('Вишня')),(HE?('ד'):('В')),610,2080,8,true),
    {id:'ya',call:(HE?('זיק'):('Ястреб')),sh:(HE?('ז'):('Я')),type:'uav',x:M.classic?700:MX,y:M.classic?1500:Math.min(1700,MY+RY)},{id:'mo',call:(HE?('שרף'):('Молот')),sh:(HE?('ש'):('М')),type:'strike',x:610,y:2140},{id:'an',call:(HE?('ינשוף'):('Ангел')),sh:(HE?('י'):('А')),type:'medevac',x:790,y:2140}];
  units[3].veh=true;units[3].carU=true;units[2].sap=true;
  if(TRN)units.splice(0,4,...mkTrainUnits(TRN.sel));else units.forEach(u=>{if(u.type==='inf')crewApply(u);});
  let ens=[grp('eL','leader',3,L.n,{leader:true}),grp('eW','lab',2,Wk.n),grp('eR','rest',3,R.n),grp('o1','look',1,Lk1.n,{roof:true}),grp('o2','look',1,Lk2.n,{roof:true}),Object.assign(grp('eP','patrol',2,L.n,{mode:'patrol',wp:pw,wi:1}),{bld:0,x:pw[0][0],y:pw[0][1]})];
  if(TRN){const D=TRN.diff;const used=[L,T,Wk,R,decoyB];ens=[grp('eL','leader',[2,3,3,4][D]+(r()<.5?1:0),L.n,{leader:true}),grp('eW','lab',[1,2,2,3][D],Wk.n),grp('eR','rest',[2,3,3,3][D],R.n)];
    for(let i=0;i<[0,0,1,2][D];i++){const b=pk(okB.filter(x=>!used.includes(x)&&near(x,L,150,450)),okB.filter(x=>!used.includes(x)));used.push(b);ens.push(grp('eR'+(i+2),'rest',2+(r()<.5?1:0),b.n));}
    const lks=[];const lc=okB.filter(b=>!used.includes(b)&&(M.classic?(b.cy>1100||Math.abs(b.cx-700)>330):(b.cy>MY+RY*.375||Math.abs(b.cx-MX)>RX*.66)));for(let i=0;i<[1,2,2,3][D]+(r()<.4?1:0)&&lc.length;i++){const far=lc.filter(b=>lks.every(o=>Math.hypot(o.cx-b.cx,o.cy-b.cy)>220));const b=far.length?pick(far):pick(lc);lks.push(b);lc.splice(lc.indexOf(b),1);civ[b.n]=Math.max(civ[b.n],2);ens.push(grp('o'+(i+1),'look',1,b.n,{roof:true}));}
    const pw2=M.classic?[[700,1020],[560,1020],[560,1300],[840,1300],[840,1020]]:[[MX,MY+160*ps],[MX-140*ps,MY+160*ps],[MX-140*ps,MY+Math.min(440,RY*.7)],[MX+140*ps,MY+Math.min(440,RY*.7)],[MX+140*ps,MY+160*ps]];const pws=[pw,pw2];for(let i=0;i<[0,1,1,2][D];i++){const w=pws[i];ens.push(Object.assign(grp('eP'+(i||''),'patrol',2,L.n,{mode:'patrol',wp:w,wi:1}),{bld:0,x:w[0][0],y:w[0][1]}));}}
  const intel=TRN?mkIntel(ens,TRN.diff,traps,ieds,r):null;
  const own={},known={};units.forEach(u=>{own[u.id]={x:u.x,y:u.y};known[u.id]={t:T0,men:u.men||0,wounded:0,ammo:100,st:(HE?('במקום'):('на месте'))};});
  return{train:!!TRN,city:{seed:TRN?TRN.seed:SEED,dens:TRN?TRN.dens:'normal',g:TRN?2:0},intel,mobK:TRN?[1,2,3,4][TRN.diff]:null,diff:TRN?TRN.diff:null,op:TRN?0:C?C.op:1,opName:TRN?['Тренировка','אימון']:C?C.opName:['Решет','רשת'],day:C&&!TRN?C.day:0,t:T0,speed:0,acc:0,started:false,over:false,result:null,truth:false,alarm:false,
    L:L.n,T:T.n,Wk:Wk.n,R:R.n,cand:cand.map(b=>b.n),civ,civHarm:0,leader:'free',lab:'intact',destroyed:{},
    units,uav:M.classic?{x:700,y:1500,tx:700,ty:1500}:{x:MX,y:Math.min(1700,MY+RY),tx:MX,ty:Math.min(1700,MY+RY)},
    enemies:ens,
    strike:{pend:[]},mol:{st:'station',ammo:4,fuel:5400,tA:0,relief:0,gun:10,cover:null},med:{free:1,trips:[]},dogs:2,pc:{},traps,civOut:0,fled:0,decoy:decoyB.n,ieds,civW:[],civDead:0,civAid:0,civEvac:0,amb:[],
    marks:{own,ord:{},b:{},m:[],strike:[],lz:[]},pidT:{},cleared:{},
    known,kobj:{eng:(HE?('לא אותר'):('не найден')),lab:(HE?('לא אותרה'):('не найдена'))},stats:{kia:0,died:0,evac:0,ek:0,wia:0,det:0,dogsLost:0},
    log:[],radio:{q:[],cur:null,prog:0,dur:0,gap:0},nid:1};
}
const U_=id=>S.units.find(u=>u.id===id);
const E_=id=>S.enemies.find(e=>e.id===id);
const infs=()=>S.units.filter(u=>u.type==='inf');
const alive=()=>S.enemies.filter(e=>!e.gone&&e.men>0);
const outside=e=>!e.bld||e.roof||e.mode==='move'||e.mode==='patrol';


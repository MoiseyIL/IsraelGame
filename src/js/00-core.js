const $=s=>document.querySelector(s);
const MWm=1400,MHm=2200,K=960/1400,W=960,H=Math.round(MHm*K),CELL=200,COLS=(HE?('זוהדגבא'):('ABCDEFG')),SEED=2311;
const T0=2*3600,T_END=5*3600+30*60,T_HARD=6*3600+30*60,RATE=12;
const STAGE={x:700,y:2060};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const hyp=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}


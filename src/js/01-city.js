/* ---------- city ---------- */
let BL=[],BLOCKS=[];
const BN=n=>BL[n-1];
function genCity(seed,dens,g2){if(g2){genCity2(seed,dens);return;}M=M_CLASSIC;seed=seed||SEED;const LOT=dens==='sparse'?.17:dens==='dense'?.03:.07,SPL=dens==='dense'?.35:dens==='sparse'?.75:.55;
  const r=mulberry(seed);BL=[];BLOCKS=[];
  const xs=[700];for(let x=700;x>260;){x-=125+r()*45;xs.unshift(Math.max(240,x));}for(let x=700;x<1140;){x+=125+r()*45;xs.push(Math.min(1160,x));}
  const ys=[860];for(let y=860;y>270;){y-=110+r()*40;ys.unshift(Math.max(250,y));}for(let y=860;y<1440;){y+=110+r()*40;ys.push(Math.min(1460,y));}
  const raw=[];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
    const gl=xs[i]===700?13:7,gr=xs[i+1]===700?13:7,gt=ys[j]===860?12:6,gb=ys[j+1]===860?12:6;
    const b={x0:xs[i]+gl,x1:xs[i+1]-gr,y0:ys[j]+gt,y1:ys[j+1]-gb};
    const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;const e=((cx-700)/470)**2+((cy-860)/600)**2;
    if(e>.82+r()*.3)continue;if(b.x1-b.x0<40||b.y1-b.y0<40)continue;BLOCKS.push(b);
    if(r()<LOT){b.lot=true;continue;}
    const n=r()<(dens==='dense'?.05:.15)?1:r()<SPL?2:r()<.85?3:4;const horiz=(b.x1-b.x0)>(b.y1-b.y0);
    let cuts=[0];for(let k=1;k<n;k++)cuts.push(k/n+(r()-.5)*.12);cuts.push(1);
    for(let k=0;k<n;k++){let x0,x1,y0,y1;
      if(horiz){x0=b.x0+(b.x1-b.x0)*cuts[k];x1=b.x0+(b.x1-b.x0)*cuts[k+1];y0=b.y0;y1=b.y1;}else{y0=b.y0+(b.y1-b.y0)*cuts[k];y1=b.y0+(b.y1-b.y0)*cuts[k+1];x0=b.x0;x1=b.x1;}
      const ins=()=>3+r()*5;x0+=ins();x1-=ins();y0+=ins();y1-=ins();
      const sw=x1-x0,sh=y1-y0;if(r()<.5){const f=.65+r()*.3;if(r()<.5)x1=x0+sw*f;else x0=x1-sw*f;}if(r()<.5){const f=.65+r()*.3;if(r()<.5)y1=y0+sh*f;else y0=y1-sh*f;}
      if(x1-x0<14||y1-y0<14)continue;raw.push({x0,x1,y0,y1,row:j});}
  }
  raw.sort((a,b)=>a.row-b.row||a.x0-b.x0);
  raw.forEach((b,i)=>{b.n=i+1;b.cx=(b.x0+b.x1)/2;b.cy=(b.y0+b.y1)/2;b.area=(b.x1-b.x0)*(b.y1-b.y0);b.prot=null;BL.push(b);});
  const fr=mulberry(seed+7);BL.forEach(b=>{b.fl=b.area>1500?(fr()<.5?3:2):b.area>500?(fr()<.6?2:1):1;});
  const big=[...BL].sort((a,b)=>b.area-a.area).slice(0,14);const sch=big.reduce((a,b)=>Math.hypot(b.cx-420,b.cy-1150)<Math.hypot(a.cx-420,a.cy-1150)?b:a,big[0]);sch.prot=(HE?('בית ספר'):((EN?("school"):('школа'))));
  const cl=big.filter(b=>b!==sch).reduce((a,b)=>Math.hypot(b.cx-980,b.cy-620)<Math.hypot(a.cx-980,a.cy-620)?b:a);cl.prot=(HE?('מרפאה'):((EN?("clinic"):('поликлиника'))));
}

/* ---------- simulation ---------- */
const NG=5,NW=Math.ceil(MWm/NG),NH=Math.ceil(MHm/NG);let NAV=null;
function buildNav(){NAV=new Uint8Array(NW*NH);for(const b of BLOCKS){if(b.lot)continue;const x0=Math.floor((b.x0+1)/NG),x1=Math.floor((b.x1-1)/NG),y0=Math.floor((b.y0+1)/NG),y1=Math.floor((b.y1-1)/NG);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)NAV[y*NW+x]=1;}genDebris();}
const navFree=(cx,cy)=>cx>=0&&cy>=0&&cx<NW&&cy<NH&&!NAV[cy*NW+cx];
function nearFree(x,y){const cx=Math.floor(x/NG),cy=Math.floor(y/NG);if(navFree(cx,cy))return[cx,cy];for(let r=1;r<60;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(navFree(cx+dx,cy+dy)){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[cx+dx,cy+dy];}}}if(best)return best;}return null;}
function los(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d/2.5);for(let i=1;i<n;i++){const x=ax+(bx-ax)*i/n,y=ay+(by-ay)*i/n;if(!navFree(Math.floor(x/NG),Math.floor(y/NG)))return false;}return true;}
let FP_OK=true;
function findPath(sx,sy,tx,ty){if(!NAV)return[[tx,ty]];const s=nearFree(sx,sy),t=nearFree(tx,ty);if(!s||!t){FP_OK=false;return[[tx,ty]];}
  const N=NW*NH,si=s[1]*NW+s[0],ti=t[1]*NW+t[0];const g=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),done=new Uint8Array(N);
  const hp=[],hf=[];const push=(i,f)=>{hp.push(i);hf.push(f);let k=hp.length-1;while(k>0){const p=(k-1)>>1;if(hf[p]<=hf[k])break;[hp[p],hp[k]]=[hp[k],hp[p]];[hf[p],hf[k]]=[hf[k],hf[p]];k=p;}};
  const pop=()=>{const top=hp[0],li=hp.pop(),lf=hf.pop();if(hp.length){hp[0]=li;hf[0]=lf;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<hp.length&&hf[l]<hf[m])m=l;if(r<hp.length&&hf[r]<hf[m])m=r;if(m===k)break;[hp[m],hp[k]]=[hp[k],hp[m]];[hf[m],hf[k]]=[hf[k],hf[m]];k=m;}}return top;};
  const hx=t[0],hy=t[1];g[si]=0;push(si,0);const D=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  while(hp.length){const i=pop();if(done[i])continue;done[i]=1;if(i===ti)break;const x=i%NW,y=(i/NW)|0;
    for(const [dx,dy,c] of D){const nx=x+dx,ny=y+dy;if(!navFree(nx,ny))continue;if(dx&&dy&&(!navFree(x+dx,y)||!navFree(x,y+dy)))continue;const j=ny*NW+nx;let cc=c;if(AV&&AV[j])cc*=25;const ng=g[i]+cc;if(ng<g[j]){g[j]=ng;from[j]=i;push(j,ng+Math.hypot(nx-hx,ny-hy));}}}
  if(from[ti]<0&&si!==ti){FP_OK=false;return[[tx,ty]];}
  const cells=[];for(let i=ti;i!==-1;i=from[i]){cells.push([(i%NW+.5)*NG,(((i/NW)|0)+.5)*NG]);if(i===si)break;}cells.reverse();
  const pts=[];let cur=[sx,sy],k=0;if(!los(sx,sy,cells[0][0],cells[0][1]))pts.push(cells[0]);cur=cells[0];
  while(k<cells.length-1){let j=cells.length-1;while(j>k+1&&!los(cur[0],cur[1],cells[j][0],cells[j][1]))j--;pts.push(cells[j]);cur=cells[j];k=j;}
  pts.push([tx,ty]);return pts;}
let AV=null;const AVC={};
function avoidMask(list){const key=list.map(a=>Math.round(a.x)+':'+Math.round(a.y)+':'+(a.bld||0)+':'+a.r).join('|');if(AVC[key])return AVC[key];const m=new Uint8Array(NW*NH);
  for(const a of list){const R=a.r,t={x:a.x,y:a.y,bld:a.bld||0,mode:a.bld?'defend':'x',mv:false};const x0=Math.max(0,Math.floor((a.x-R)/NG)),x1=Math.min(NW-1,Math.floor((a.x+R)/NG)),y0=Math.max(0,Math.floor((a.y-R)/NG)),y1=Math.min(NH-1,Math.floor((a.y+R)/NG));
    for(let cy=y0;cy<=y1;cy++)for(let cx=x0;cx<=x1;cx++){if(NAV[cy*NW+cx])continue;const px=(cx+.5)*NG,py=(cy+.5)*NG;if(Math.hypot(px-a.x,py-a.y)>R)continue;if(Math.hypot(px-a.x,py-a.y)<35||losPtE(px,py,t))m[cy*NW+cx]=1;}}
  AVC[key]=m;return m;}
function blockOf(x,y){for(const k of BLOCKS)if(x>=k.x0-1&&x<=k.x1+1&&y>=k.y0-1&&y<=k.y1+1)return k;return null;}
function openPt(x,y,ox,oy){if(navFree(Math.floor(x/NG),Math.floor(y/NG)))return[x,y];const k=blockOf(x,y);if(!k)return[x,y];
  let px=clamp(ox,k.x0,k.x1),py=clamp(oy,k.y0,k.y1);if(px>k.x0&&px<k.x1&&py>k.y0&&py<k.y1){const dl=px-k.x0,dr=k.x1-px,dt=py-k.y0,db=k.y1-py,m=Math.min(dl,dr,dt,db);if(m===dl)px=k.x0;else if(m===dr)px=k.x1;else if(m===dt)py=k.y0;else py=k.y1;}
  const dx=ox-px,dy=oy-py,d=Math.hypot(dx,dy)||1;return[px+dx/d*3,py+dy/d*3];}
function ePos(e,ox,oy){if(e.bld&&!e.mv&&e.mode!=='patrol'&&e.mode!=='move'){const b=BN(e.bld);return openPt(b.cx,b.cy,ox,oy);}return openPt(e.x,e.y,ox,oy);}
function uPos(u,ox,oy){if(u.inB){const b=BN(u.inB);return openPt(b.cx,b.cy,ox,oy);}return openPt(u.x,u.y,ox,oy);}
function losUE(u,e){const a=uPos(u,e.x,e.y),b=ePos(e,u.x,u.y);return los(a[0],a[1],b[0],b[1]);}
function losPtE(x,y,e){const b=ePos(e,x,y);return los(x,y,b[0],b[1]);}

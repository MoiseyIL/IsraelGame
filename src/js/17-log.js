/* ---------- log ---------- */
const logEl=$('#log');let liveEl=null;
function nearBottom(){return logEl.scrollHeight-logEl.scrollTop-logEl.clientHeight<80;}
function msgEl(m){const el=document.createElement('div');el.className='msg'+(m.out?' out':'')+(m.crit?' crit':m.urgent?' urg':m.out?'':' rt');
  const mh=document.createElement('div');mh.className='mh';const w=document.createElement('span');w.className='who';w.textContent=m.from;const tm=document.createElement('span');tm.className='tm';tm.textContent=fmt(m.t);mh.append(w,tm);
  const tx=document.createElement('div');tx.className='txt';tx.textContent=m.text;el.append(mh,tx);
  if(m.note){const nt=document.createElement('div');nt.className='note';nt.textContent=m.note;el.appendChild(nt);}
  if(m.chips&&m.chips.length){const cw=document.createElement('div');cw.className='chips';m.chips.forEach(c=>{const b=document.createElement('button');b.className='chip '+c.k+(c.used?' used':'');b.textContent=(c.used?'✓ ':'◎ ')+c.label;b.onclick=()=>useChip(m,c,b);cw.appendChild(b);});el.appendChild(cw);}
  return el;}
function liveStart(m){const nb=nearBottom();const e=logEl.querySelector('.empty');if(e)e.remove();liveEl=msgEl({...m,chips:[],text:'',note:''});liveEl.classList.add('live');logEl.appendChild(liveEl);if(nb)logEl.scrollTop=logEl.scrollHeight;}
function liveUpdate(m,p){if(!liveEl)liveStart(m);liveEl.querySelector('.txt').textContent=m.text.slice(0,Math.ceil(m.text.length*Math.min(1,p*1.08)));}
function liveEnd(m){const nb=nearBottom();const el=msgEl(m);if(liveEl&&liveEl.parentNode)liveEl.replaceWith(el);else logEl.appendChild(el);liveEl=null;while(logEl.children.length>220)logEl.firstChild.remove();if(nb)logEl.scrollTop=logEl.scrollHeight;}
function rebuildLog(){logEl.innerHTML='';if(!S.log.length)logEl.innerHTML=(HE?('<div class="empty">הקשר שקט. קראו את הפקודה והתחילו את המבצע.</div>'):((EN?("<div class=\"empty\">The radio is silent. Read the order and start the operation.</div>"):('<div class="empty">Эфир молчит. Изучите приказ и начните операцию.</div>'))));S.log.forEach(m=>logEl.appendChild(msgEl(m)));liveEl=null;if(S.radio.cur)liveStart(S.radio.cur);logEl.scrollTop=logEl.scrollHeight;}
function useChip(m,c,b){let p;
  if(c.k==='ied'){if(c.b){(S.marks.bied||(S.marks.bied={}))[c.b]=1;p={x:BN(c.b).cx,y:BN(c.b).cy};}else{S.marks.ied=S.marks.ied||[];if(!(c.mid&&S.marks.ied.find(e=>e.id===c.mid))){c.mid=S.nid++;S.marks.ied.push({id:c.mid,x:c.x,y:c.y,t:m.t});}p=c;}c.used=true;b.classList.add('used');b.textContent='✓ '+c.label;dirty=true;if(p)ensureVisible(p.x,p.y);return;}
  if(c.k==='pos'){S.marks.own[c.uid]={x:c.x,y:c.y};p=c;}
  else if(c.b){markB(c.b,c.k,m.t);p={x:BN(c.b).cx,y:BN(c.b).cy};}
  else{const ex=(c.mid&&S.marks.m.find(e=>e.id===c.mid))||(c.no&&S.marks.m.find(e=>e.no===c.no));if(ex){ex.x=c.x;ex.y=c.y;ex.t=m.t;ex.uc=false;}else{c.mid=S.nid++;S.marks.m.push({id:c.mid,x:c.x,y:c.y,t:m.t,n:c.n,no:c.no||0});}p=c;}
  c.used=true;b.classList.add('used');b.textContent='✓ '+c.label;dirty=true;if(p)ensureVisible(p.x,p.y);}
function lamp(k){$('#lamp').className='lamp'+(k?' '+k:'');}


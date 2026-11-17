/* ---------- radio ---------- */
function stLabel(u){if(u.men<=1)return(HE?('לא כשיר'):('небоеспособно'));if(u.veh)return(HE?('ברכב'):('в машине'));if(u.cont.length)return(HE?('בקרב'):('бой'));return{move:(HE?('בתנועה'):('марш')),cover:(HE?('למחסה'):('в укрытие')),incover:(HE?('במחסה'):('в укрытии')),exfil:(HE?('פינוי'):('эвакуация')),search:(HE?('חיפוש'):('обыск')),recon:(HE?('סיור'):('разведка')),obs:(HE?('בתצפית'):('наблюдение')),snipe:(HE?('יציאה לעמדה'):('выход на позицию')),aim:(HE?('צלף בפעולה'):('снайпер')),assault:(HE?('הסתערות'):('штурм')),breach:(HE?('פריצה'):('вход')),clearing:(HE?('טיהור'):('зачистка')),cordon:(HE?('כיתור'):('оцепление')),retreat:(HE?('נסיגה'):('отход')),hold:(HE?('בעמדה'):('на позиции')),broken:(HE?('לא כשיר'):('небоеспособно'))}[u.st]||(HE?('במקום'):('на месте'));}
function say(u,text,chips,o){o=o||{};const m={from:u.call,uid:u.id||null,text,note:o.note||'',chips:chips||[],urgent:!!o.urgent,act:o.act||null,kobj:o.kobj||null,pid:o.pid||0,ek:o.ek||0,det:o.det||0};
  if(o.known&&u.type==='inf')m.known=o.known==='full'?{men:u.men,wounded:u.wounded,ammo:Math.round(u.ammo/10)*10,st:stLabel(u),full:true}:{st:stLabel(u)};
  if(m.urgent||o.front){m.front=!!o.front;const i=S.radio.q.findIndex(x=>!x.urgent&&!x.front);if(i<0)S.radio.q.push(m);else S.radio.q.splice(i,0,m);}else S.radio.q.push(m);}
function hq(text,act){S.radio.q.push({from:(HE?('צפע'):('Кобра-6')),out:true,text,act,chips:[]});}
function posChip(u){return{k:'pos',uid:u.id,x:u.x,y:u.y,label:(HE?(`${u.sh} ← ${cell(u.x,u.y)}${(bldAt(u.x,u.y,45)?' · מבנה '+bldAt(u.x,u.y,45).n:'')}`):(`${u.sh} → ${cell(u.x,u.y)}${(bldAt(u.x,u.y,45)?' · зд. '+bldAt(u.x,u.y,45).n:'')}`))};}
function bChip(n,k){return{k,b:n,label:(HE?(`${{hos:'אויב',unk:'לא מזוהים',civ:'אזרחים',tun:'מנהרה',ied:'מטען'}[k]}: מבנה ${n}`):(`${{hos:'противник',unk:'неопознанные',civ:'мирные',tun:'подземный ход',ied:'СВУ'}[k]}: зд. ${n}`))};}
function ptChip(e){return{k:'hos',x:e.x+(Math.random()-.5)*30,y:e.y+(Math.random()-.5)*30,n:cnt(e.men),label:(HE?(`אויב: ${cell(e.x,e.y)}`):(`противник: ${cell(e.x,e.y)}`))};}
function salute(e,act){const where=e.bld&&e.mode!=='move'&&e.mode!=='patrol'?(HE?(`${e.roof?'גג מבנה':'מבנה'} ${e.bld}, משבצת ${cell(e.x,e.y)}`):(`${e.roof?'крыша здания':'здание'} ${e.bld}, квадрат ${cell(e.x,e.y)}`)):placeTxt(e.x,e.y);
  return(HE?(`דיווח: כמות — ${cnt(e.men)}; פעילות — ${act}; מיקום — ${where}; זיהוי — ללא מדים, חמושים; שעה — ${fmt(S.t)}; נשק — ${pick(WEAP)}.`):(`SALUTE: численность — ${cnt(e.men)}; действия — ${act}; место — ${where}; принадлежность — без формы, вооружены; время — ${fmt(S.t)}; оружие — ${pick(WEAP)}.`));}

function deliver(m){
  m.id=S.nid++;S.log.push(m);if(S.log.length>220)S.log.shift();
  if(m.known&&m.uid){const k=S.known[m.uid];k.st=m.known.st;if(m.known.full){k.men=m.known.men;k.wounded=m.known.wounded;k.ammo=m.known.ammo;k.t=m.t;}}
  if(m.kobj)S.kobj[m.kobj[0]]=m.kobj[1];
  if(m.pid)S.pidT[m.pid]=m.t;
  if(m.ek)S.kek=(S.kek||0)+m.ek;if(m.det)S.kdet=(S.kdet||0)+m.det;
  if(m.act)doAct(m.act);
  liveEnd(m);updUnits();updObj();
  if(m.urgent){try{navigator.vibrate&&navigator.vibrate(90);}catch(e){}}
  dirty=true;
}
function radioStep(rdt){
  const R=S.radio;if(R.gap>0){R.gap-=rdt;return;}
  if(!R.cur){if(!R.q.length)return;R.cur=R.q.shift();R.prog=0;R.dur=clamp(.6+R.cur.text.length*.016,1,3.4)/(S.speed>=4?1.35:1);R.cur.t=S.t;liveStart(R.cur);if(R.cur.out)beep();squelch();setHiss(!R.cur.out);lamp(R.cur.out?'tx':'rx');}
  R.prog+=rdt;liveUpdate(R.cur,Math.min(1,R.prog/R.dur));
  if(R.prog>=R.dur){const m=R.cur;R.cur=null;R.gap=.35;squelch();setHiss(false);lamp('');deliver(m);}
}


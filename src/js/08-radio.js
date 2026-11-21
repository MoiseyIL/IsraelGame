/* ---------- radio ---------- */
function stLabel(u){if(u.men<=1)return(HE?('לא כשיר'):((EN?("combat ineffective"):('небоеспособно'))));if(u.veh)return(HE?('ברכב'):((EN?("in vehicle"):('в машине'))));if(u.cont.length)return(HE?('בקרב'):((EN?("contact"):('бой'))));return{move:(HE?('בתנועה'):((EN?("moving"):('марш')))),cover:(HE?('למחסה'):((EN?("taking cover"):('в укрытие')))),incover:(HE?('במחסה'):((EN?("in cover"):('в укрытии')))),exfil:(HE?('פינוי'):((EN?("evacuating"):('эвакуация')))),search:(HE?('חיפוש'):((EN?("searching"):('обыск')))),recon:(HE?('סיור'):((EN?("recon"):('разведка')))),obs:(HE?('בתצפית'):((EN?("observing"):('наблюдение')))),snipe:(HE?('יציאה לעמדה'):((EN?("moving to position"):('выход на позицию')))),aim:(HE?('צלף בפעולה'):((EN?("sniper"):('снайпер')))),assault:(HE?('הסתערות'):((EN?("assault"):('штурм')))),breach:(HE?('פריצה'):((EN?("breaching"):('вход')))),clearing:(HE?('טיהור'):((EN?("clearing"):('зачистка')))),cordon:(HE?('כיתור'):((EN?("cordon"):('оцепление')))),occupy:T3('в здании','במבנה','holding building'),retreat:(HE?('נסיגה'):((EN?("withdrawing"):('отход')))),hold:(HE?('בעמדה'):((EN?("in position"):('на позиции')))),broken:(HE?('לא כשיר'):((EN?("combat ineffective"):('небоеспособно'))))}[u.st]||(HE?('במקום'):((EN?("in place"):('на месте'))));}
// sightings are collected for ~20 s and sent as one report when there are several
function spotDesc(e){const fixed=e.bld&&!e.mv&&e.mode!=='patrol';const w=e.roof?T3(`крыша здания ${e.bld}`,`גג מבנה ${e.bld}`,`roof of building ${e.bld}`):fixed?T3(`здание ${e.bld}`,`מבנה ${e.bld}`,`building ${e.bld}`):placeTxt(e.x,e.y);
  return`${cnt(e.men)} — ${w}${e.mv?T3(', движутся',', בתנועה',', moving'):''}`;}
function flushSpots(){const B=S.spotBuf;if(!B)return;for(const k in B){const b=B[k];if(S.t-b.t0<20&&b.items.length<5)continue;delete B[k];
    if(b.items.length===1){const it=b.items[0];say(b.u,it.text,it.chips,{pid:it.pid,known:b.u.type==='inf'?'st':undefined,noSpot:true});continue;}
    const list=b.items.map((it,i)=>`${i+1}) ${it.d}`).join('; ');const quiet=S.alarm?'':T3(' Нас не обнаружили, огонь не открываем.',' לא זיהו אותנו, לא פותחים באש.',' We have not been spotted, holding fire.');
    const chips=[].concat(...b.items.map(it=>it.chips));b.items.forEach(it=>{if(it.pid)S.pidT[it.pid]=S.t;});
    say(b.u,T3(`Кобра-6, я ${b.u.call}. Наблюдаю противника, групп: ${b.items.length}. ${list}.${quiet} Приём.`,`צפע, כאן ${b.u.call}. רואים אויב, חוליות: ${b.items.length}. ${list}.${quiet} עבור.`,`Cobra-6, this is ${b.u.call}. Enemy in sight, groups: ${b.items.length}. ${list}.${quiet} Over.`),chips,{known:b.u.type==='inf'?'st':undefined,noSpot:true});}}
function say(u,text,chips,o){o=o||{};chips=(chips||[]).filter(c=>c.k!=='pos'&&!(c.k==='hos'&&(c.x!=null&&!c.b||o.eid)));if(o.eid&&!o.noSpot){const tg=tgtNote(o);if(!tg)return;text=insTag(text,tg.tag);numChips(chips,tg.no);if(o.spot)o.spot=tg.d+' — '+o.spot;}
  if(o.spot&&!o.noSpot){const B=(S.spotBuf=S.spotBuf||{});const k=u.id||u.call;(B[k]=B[k]||{u:{id:u.id,call:u.call,type:u.type},t0:S.t,items:[]}).items.push({text,chips:chips||[],pid:o.pid||0,d:o.spot});return;}
  if(o.known&&u.id&&!u.men&&u.type==='inf'){const uu=U_(u.id);if(uu)u=uu;}if(S.mission)text=text.replace(/боевиков/g,'солдат противника').replace(/מחבלים/g,'חיילי אויב').replace(/מחבל/g,'חייל אויב');const m={from:u.call,uid:u.id||null,eid:o.eid||'',qt:S.t,text,note:o.note||'',chips:chips||[],urgent:!!o.urgent,act:o.act||null,kobj:o.kobj||null,pid:o.pid||0,ek:o.ek||0,det:o.det||0};
  if(o.known&&u.type==='inf')m.known=o.known==='full'?{men:u.men,wounded:u.wounded,ammo:Math.round(u.ammo/10)*10,st:stLabel(u),full:true}:{st:stLabel(u)};
  if(S.radio.q.some(x=>x.uid&&x.uid===m.uid&&x.text===m.text))return; // the same message already waiting
  m.front=!!o.front;m.pr=o.pr!=null?o.pr:o.front?-1:m.urgent?0:o.noSpot?2:3; /* an answer to the commander's call comes at once */qPut(m);}
// higher precedence goes first, the same precedence in order of arrival
const prOf=x=>x.pr!=null?x.pr:x.front?-1:x.urgent?0:x.out?1:3;
// a team's own messages keep their order (a later urgent one never overtakes an earlier one of the same team)
function qPut(m){const q=S.radio.q,p=prOf(m);let i=q.findIndex(x=>prOf(x)>p);if(i<0)i=q.length;
  if(m.uid){let last=-1;q.forEach((x,k)=>{if(x.uid===m.uid)last=k;});if(i<=last)i=last+1;}q.splice(i,0,m);}
// the commander's own transmissions go ahead of routine reports already waiting (urgent ones still come first)
function hq(text,act){qPut({from:(HE?('צפע'):((EN?("Cobra-6"):('Кобра-6')))),out:true,text,act,chips:[],pr:1});}
function posChip(u){return{k:'pos',uid:u.id,x:u.x,y:u.y,label:(HE?(`${u.sh} ← ${cell(u.x,u.y)}${(bldAt(u.x,u.y,45)?' · מבנה '+bldAt(u.x,u.y,45).n:'')}`):((EN?(`${u.sh} → ${cell(u.x,u.y)}${(bldAt(u.x,u.y,45)?' · bldg '+bldAt(u.x,u.y,45).n:'')}`):(`${u.sh} → ${cell(u.x,u.y)}${(bldAt(u.x,u.y,45)?' · зд. '+bldAt(u.x,u.y,45).n:'')}`))))};}
function bChip(n,k){return{k,b:n,label:(HE?(`${{hos:'אויב',unk:'לא מזוהים',civ:'אזרחים',tun:'מנהרה',ied:'מטען'}[k]}: מבנה ${n}`):((EN?(`${{hos:'enemy',unk:'unidentified',civ:'civilians',tun:'tunnel',ied:'IED'}[k]}: bldg ${n}`):(`${{hos:'противник',unk:'неопознанные',civ:'мирные',tun:'подземный ход',ied:'СВУ'}[k]}: зд. ${n}`))))};}
function ptChip(e){return{k:'hos',x:e.x+(Math.random()-.5)*30,y:e.y+(Math.random()-.5)*30,n:cnt(e.men),label:(HE?(`אויב: ${cell(e.x,e.y)}`):((EN?(`enemy: ${cell(e.x,e.y)}`):(`противник: ${cell(e.x,e.y)}`))))};}
function salute(e,act){const where=e.bld&&e.mode!=='move'&&e.mode!=='patrol'?(HE?(`${e.roof?'גג מבנה':'מבנה'} ${e.bld}, משבצת ${cell(e.x,e.y)}`):((EN?(`${e.roof?'roof of building':'building'} ${e.bld}, grid ${cell(e.x,e.y)}`):(`${e.roof?'крыша здания':'здание'} ${e.bld}, квадрат ${cell(e.x,e.y)}`)))):placeTxt(e.x,e.y);
  return(HE?(`דיווח: כמות — ${cnt(e.men)}; פעילות — ${act}; מיקום — ${where}; זיהוי — ${e.kind==='army'?uniOf(e):'ללא מדים, חמושים'}; שעה — ${fmt(S.t)}; נשק — ${pick(WEAP)}.`):((EN?(`SALUTE: size — ${cnt(e.men)}; activity — ${act}; location — ${where}; unit — ${e.kind==='army'?uniOf(e):'no uniforms, armed'}; time — ${fmt(S.t)}; equipment — ${pick(WEAP)}.`):(`SALUTE: численность — ${cnt(e.men)}; действия — ${act}; место — ${where}; принадлежность — ${e.kind==='army'?uniOf(e):'без формы, вооружены'}; время — ${fmt(S.t)}; оружие — ${pick(WEAP)}.`))));}

function deliver(m){
  m.id=S.nid++;S.log.push(m);if(S.log.length>220)S.log.shift();jrAdd(m);
  if(m.known&&m.uid){const k=S.known[m.uid];k.st=m.known.st;if(m.known.full){k.men=m.known.men;k.wounded=m.known.wounded;k.ammo=m.known.ammo;k.t=m.t;}}
  if(m.kobj)S.kobj[m.kobj[0]]=m.kobj[1];
  if(m.pid)S.pidT[m.pid]=m.t;
  if(m.ek)S.kek=(S.kek||0)+m.ek;if(m.det)S.kdet=(S.kdet||0)+m.det;
  if(m.act)doAct(m.act);
  liveEnd(m);updUnits();updObj();
  // a short buzz for urgent traffic: only while the game runs and the sound is on, at most once in 4 s
  if(m.urgent&&soundOn&&S.speed>0&&!document.hidden&&performance.now()-(window.__vibT||0)>4000){window.__vibT=performance.now();try{navigator.vibrate&&navigator.vibrate(90);}catch(e){}}
  dirty=true;
}
function radioStep(rdt){
  const R=S.radio;if(R.gap>0){R.gap-=rdt;return;}
  if(!R.cur){if(!R.q.length)return;R.cur=R.q.shift();R.prog=0;R.dur=clamp(.6+R.cur.text.length*.016,1,3.4)/(S.speed>=4?1.35:1);R.cur.t=S.t;liveStart(R.cur);if(R.cur.out)beep();squelch();setHiss(!R.cur.out);lamp(R.cur.out?'tx':'rx');}
  R.prog+=rdt;liveUpdate(R.cur,Math.min(1,R.prog/R.dur));
  if(R.prog>=R.dur){const m=R.cur;R.cur=null;R.gap=.35;squelch();setHiss(false);lamp('');deliver(m);}
}


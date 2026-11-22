/* ---------- target numbers and the battle journal ---------- */
// Every enemy group our side reports gets a number. Reports then say whether it is a new target or a known one
// that has moved, and the mark on the map carries the same number, so one group is one mark.
function tgtNo(e){const T=(S.tg=S.tg||{n:0,by:{}});let r=T.by[e.id];if(!r){r=T.by[e.id]={no:++T.n,x:e.x,y:e.y,t:-1e9};}return r.no;}
// what to say about a group now; null = it was reported recently and has not moved (sightings only)
function tgtNote(o){const T=(S.tg=S.tg||{n:0,by:{}});let r=T.by[o.eid],isNew=false;
  if(!r||r.t<-1e8){isNew=!r||r.t<-1e8;r=T.by[o.eid]=r||{no:++T.n};}
  else{const moved=Math.hypot(r.x-o.ex,r.y-o.ey)>60;if(o.spot&&(!moved&&S.t-r.t<600||moved&&S.t-r.t<90))return null;r.mv=moved;}
  r.x=o.ex;r.y=o.ey;r.t=S.t;const no=r.no;
  const tag=isNew?T3(`Новая цель ${no}.`,`מטרה חדשה ${no}.`,`New target ${no}.`):T3(`Цель ${no}.`,`מטרה ${no}.`,`Target ${no}.`); // movement is shown on the map
  const d=isNew?T3(`цель ${no}, новая`,`מטרה ${no}, חדשה`,`target ${no}, new`):T3(`цель ${no}, сместилась`,`מטרה ${no}, זזה`,`target ${no}, moved`);
  return{no,tag,d};}
// the tag goes right after the call sign ("Cobra-6, this is Egoz.")
const insTag=(text,tag)=>{const m=text.match(/^(.*?[.!]\s)/);return m?m[1]+tag+' '+text.slice(m[1].length):tag+' '+text;};
function numChips(chips,no){(chips||[]).forEach(c=>{if(c.k==='hos'&&c.x!=null&&!c.b){c.no=no;c.label=T3(`цель ${no}: ${cell(c.x,c.y)}`,`מטרה ${no}: ${cell(c.x,c.y)}`,`target ${no}: ${cell(c.x,c.y)}`);}});}

// ---- journal: every message of the operation, to save or send ----
const JR_MAX=2500;
function jrAdd(m){const J=(S.jr=S.jr||[]);J.push([m.t,m.from,m.text,m.eid||'']);if(J.length>JR_MAX)J.splice(0,J.length-JR_MAX);}
function jrText(){const L=[];const mode=S.mission?T3('Миссия','משימה','Mission'):S.train?T3('Тренировка','אימון','Training'):T3('Кампания','מערכה','Campaign');
  L.push(`Project: End of Terror — ${T3('журнал боя','יומן קרב','battle journal')}`);
  L.push(`${mode} · ${T3('код','קוד','code')} ${S.city&&S.city.seed} · ${T3('застройка','בנייה','density')} ${S.city&&S.city.dens}${S.diff!=null?' · '+T3('сложность','קושי','difficulty')+' '+S.diff:''} · ${T3('время','שעה','time')} ${fmt(S.t)}${S.result?' · '+S.result:''}`);L.push('');
  for(const [t,f,x,e] of (S.jr||[]))L.push(`[${fmt(t)}] ${f}: ${x}${e?`  {${e}}`:''}`);
  // service data for analysing the game: where everyone really was at the moment of saving
  L.push('');L.push(T3('--- служебные данные (для разбора, в игре не видны) ---','--- נתונים טכניים (לניתוח, לא נראים במשחק) ---','--- service data (for analysis, not shown in the game) ---'));
  for(const u of infs())L.push(`${u.call}: ${cell(u.x,u.y)} (${Math.round(u.x)},${Math.round(u.y)}) ${u.st} ${u.men}/${u.wounded} ${T3('БК','תחמ׳','ammo')} ${Math.round(u.ammo)}%${u.inB?' bld '+u.inB:''}`);
  for(const e of S.enemies){const no=S.tg&&S.tg.by[e.id]?' #'+S.tg.by[e.id].no:'';L.push(`{${e.id}}${no} ${e.kind}${e.rt?'/'+e.rt:''} ${e.gone||e.men<=0?'×':''}${e.men}/${e.max||''} ${cell(e.x,e.y)} (${Math.round(e.x)},${Math.round(e.y)}) ${e.mode||''}${e.bld?' bld '+e.bld:''}${e.roof?' roof':''}`);}
  return L.join('\n');}
function openJournal(){dbLog(true);const was=S.speed;if(S.started&&!S.over){S.speed=0;setSpeedUI();}
  let el=$('#jr');if(!el){el=document.createElement('div');el.id='jr';el.className='ov';document.body.appendChild(el);}
  el.innerHTML=`<div class="doc jrdoc"><h1>${T3('Журнал боя','יומן קרב','Battle journal')}</h1><p class="meta">${T3('Все сообщения операции по порядку. Внизу — служебные данные: где на самом деле были все группы. Сохраните или скопируйте и пришлите для разбора.','כל ההודעות של המבצע לפי הסדר. למטה — נתונים טכניים: איפה באמת היו כל החוליות. שמרו או העתיקו ושלחו לניתוח.','Every message of the operation in order. At the bottom is service data: where every group really was. Save or copy it and send it for analysis.')}</p>
    <textarea id="jrT" readonly spellcheck="false"></textarea><div class="jrb"><button class="go" id="jrCopy">${T3('Скопировать','להעתיק','Copy')}</button><button class="go alt" id="jrSave">${T3('Сохранить файл','לשמור קובץ','Save file')}</button><button class="go alt" id="jrClose">${T3('Закрыть','לסגור','Close')}</button></div><p class="meta" id="jrMsg"></p></div>`;
  el.hidden=false;const ta=$('#jrT');ta.value=jrText();ta.scrollTop=ta.scrollHeight;const msg=t=>{$('#jrMsg').textContent=t;};
  $('#jrCopy').onclick=async()=>{ta.focus();ta.select();let ok=false;try{await navigator.clipboard.writeText(ta.value);ok=true;}catch(e){try{ok=document.execCommand('copy');}catch(e2){}}
    msg(ok?T3('Скопировано.','הועתק.','Copied.'):T3('Не удалось скопировать автоматически: текст выделен, скопируйте вручную.','לא הצלחתי להעתיק אוטומטית: הטקסט מסומן, העתיקו ידנית.','Could not copy automatically: the text is selected, copy it by hand.'));};
  // in the claude.ai viewer a file is offered through its downloads capability; elsewhere (GitHub Pages) a plain download link
  const dlP=window.claude&&window.claude.use?window.claude.use('downloads').catch(()=>null):Promise.resolve(null);
  $('#jrSave').onclick=async()=>{const name=`journal-${S.city&&S.city.seed}-${fmt(S.t).replace(':','')}.txt`;const dl=await dlP;
    if(dl){try{await dl.save({filename:name,data:ta.value});msg(T3('Файл сохранён.','הקובץ נשמר.','File saved.'));}catch(e){msg(e&&e.code==='declined'?T3('Сохранение отменено.','השמירה בוטלה.','Saving cancelled.'):T3('Сохранить не получилось, используйте «Скопировать».','השמירה לא הצליחה, השתמשו ב«להעתיק».','Saving failed, use Copy.'));}return;}
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ta.value],{type:'text/plain;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);msg(T3('Файл сохранён в загрузки (если браузер разрешил).','הקובץ נשמר בהורדות (אם הדפדפן איפשר).','File saved to downloads (if the browser allowed it).'));}catch(e){msg(T3('Сохранить не получилось, используйте «Скопировать».','השמירה לא הצליחה, השתמשו ב«להעתיק».','Saving failed, use Copy.'));}};
  $('#jrClose').onclick=()=>{el.hidden=true;if(S.started&&!S.over){S.speed=was;setSpeedUI();}};}

// a short note instead of a full contact report; true when it was sent
function fightNote(u,e,m,first){const T=(S.tg=S.tg||{n:0,by:{}});const no=tgtNo(e),r=T.by[e.id];const other=r.ct&&S.t-r.ct<120&&r.cu!==u.id;r.ct=S.t;r.cu=u.id;
  if(first&&!other)return false;const where=m==='close'?T3(`внутри здания ${u.inB}`,`בתוך מבנה ${u.inB}`,`inside building ${u.inB}`):e.bld&&!outside(e)?T3(`в здании ${e.bld}`,`במבנה ${e.bld}`,`in building ${e.bld}`):placeTxt(e.x,e.y);
  if(first)say(u,T3(`Кобра-6, я ${u.call}. Веду бой с целью ${no}, ${where}.`,`צפע, כאן ${u.call}. בקרב עם מטרה ${no}, ${where}.`,`Cobra-6, this is ${u.call}. Engaging target ${no}, ${where}.`),[],{known:'st'});
  else say(u,T3(`Кобра-6, я ${u.call}! Ещё противник: цель ${no}, ${where}, ${cnt(e.men)}. Ведём бой.`,`צפע, כאן ${u.call}! עוד אויב: מטרה ${no}, ${where}, ${cnt(e.men)}. בקרב.`,`Cobra-6, this is ${u.call}! More enemy: target ${no}, ${where}, ${cnt(e.men)}. Engaging.`),e.bld&&!outside(e)?[bChip(e.bld,'hos')]:[Object.assign(ptChip(e),{no,label:T3(`цель ${no}: ${cell(e.x,e.y)}`,`מטרה ${no}: ${cell(e.x,e.y)}`,`target ${no}: ${cell(e.x,e.y)}`)})],{urgent:true,known:'st'});
  return true;}

const dstM=(u,e)=>Math.max(20,Math.round(Math.hypot(e.x-u.x,e.y-u.y)/10)*10);
// company HQ keeps the target list while there is fighting: every 5 minutes a summary of who is engaging which target
// (a staff note in the log, it does not take air time)
function battleSum(){const U=infs().filter(u=>u.inFight&&u.men>0);if(!U.length){S.sumT=0;return;}if(!S.sumT){S.sumT=S.t;S.sum0={k:S.kek||0,c:S.stats.kia+S.stats.wia};return;}if(S.t-S.sumT<300)return;
  const by={};for(const u of U)for(const id of Object.keys(u.fightE||{})){const e=E_(id);if(!e||e.gone||e.men<=0)continue;const no=tgtNo(e);(by[no]=by[no]||{e,u:[]}).u.push(u.call);}
  const nos=Object.keys(by).sort((a,b)=>a-b);const w=e=>e.bld&&!outside(e)?T3(`здание ${e.bld}`,`מבנה ${e.bld}`,`building ${e.bld}`):cell(e.x,e.y);
  const list=nos.map(n=>T3(`цель ${n} (${w(by[n].e)}) — ${by[n].u.join(', ')}`,`מטרה ${n} (${w(by[n].e)}) — ${by[n].u.join(', ')}`,`target ${n} (${w(by[n].e)}) — ${by[n].u.join(', ')}`)).join('; ');
  const k=(S.kek||0)-S.sum0.k,c=S.stats.kia+S.stats.wia-S.sum0.c;S.sumT=S.t;S.sum0={k:S.kek||0,c:S.stats.kia+S.stats.wia};
  const m={from:T3('Штаб роты','מפקדת הפלוגה','Company HQ'),uid:null,text:T3(`Сводка ${fmt(S.t)}. Бой: ${list||'цели не уточнены'}. За 5 минут: нейтрализовано противника — ${k}, наши потери — ${c}.`,`סיכום ${fmt(S.t)}. קרב: ${list||'המטרות לא מוגדרות'}. ב־5 הדקות האחרונות: אויב — ${k} נוטרלו, אצלנו — ${c} נפגעים.`,`Summary ${fmt(S.t)}. In action: ${list||'targets not identified'}. Last 5 minutes: enemy — ${k} neutralized, ours — ${c} casualties.`),note:'',chips:[],t:S.t};
  deliver(m);}

// ---- claude.ai only: the journal of the current battle is kept in the artifact's database, one document overwritten
// each time (a new battle replaces the old one), so it can be read for analysis without copying. Elsewhere: nothing.
let DBP=null,dbLast=0;
function dbLog(force){if(!window.claude||!window.claude.use||!S||!S.started)return;const now=performance.now();if(!force&&now-dbLast<60000)return;dbLast=now;
  if(!DBP)DBP=window.claude.use('db').catch(()=>null);
  DBP.then(db=>{if(!db)return;let t=jrText();
    // a document holds 256 KiB: keep the head, the service data and as many of the newest messages as fit
    if(t.length>100000){const L=t.split('\n'),cut=L.findIndex(x=>x.startsWith('--- '));const head=L.slice(0,3),tail=cut>0?L.slice(cut-1):[],body=L.slice(3,cut>0?cut-1:L.length);
      let keep=[],n=0;for(let i=body.length-1;i>=0&&n<90000;i--){keep.unshift(body[i]);n+=body[i].length+1;}t=[...head,`… (${body.length-keep.length})`,...keep,...tail].join('\n');}
    return db.doc('battlelog/current').set({lang:window.GAME_LANG||'',mode:S.mission?'mission':S.train?'train':'camp',code:S.city&&S.city.seed,t:fmt(S.t),over:!!S.over,result:S.result||'',saved:new Date().toISOString(),text:t});}).catch(()=>{});}

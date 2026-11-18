/* ---------- target numbers and the battle journal ---------- */
// Every enemy group our side reports gets a number. Reports then say whether it is a new target or a known one
// that has moved, and the mark on the map carries the same number, so one group is one mark.
function tgtNo(e){const T=(S.tg=S.tg||{n:0,by:{}});let r=T.by[e.id];if(!r){r=T.by[e.id]={no:++T.n,x:e.x,y:e.y,t:-1e9};}return r.no;}
// what to say about a group now; null = it was reported recently and has not moved (sightings only)
function tgtNote(o){const T=(S.tg=S.tg||{n:0,by:{}});let r=T.by[o.eid],isNew=false;
  if(!r||r.t<-1e8){isNew=!r||r.t<-1e8;r=T.by[o.eid]=r||{no:++T.n};}
  else{const moved=Math.hypot(r.x-o.ex,r.y-o.ey)>60;if(o.spot&&(!moved&&S.t-r.t<600||moved&&S.t-r.t<90))return null;r.mv=moved;}
  r.x=o.ex;r.y=o.ey;r.t=S.t;const no=r.no;
  const tag=isNew?T3(`Новая цель ${no}.`,`מטרה חדשה ${no}.`,`New target ${no}.`):r.mv?T3(`Цель ${no} сместилась.`,`מטרה ${no} זזה.`,`Target ${no} has moved.`):T3(`Цель ${no}.`,`מטרה ${no}.`,`Target ${no}.`);
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
function openJournal(){const was=S.speed;if(S.started&&!S.over){S.speed=0;setSpeedUI();}
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

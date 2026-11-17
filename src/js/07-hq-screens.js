function setBriefHead(){setBriefBody();if(S.train){const c=codeTxt(S.city.seed),dn=L2(DIFF[S.diff||0]);$('#bTitle').textContent=HE?'מבצע אימון':'Тренировочная операция';$('#bMeta').textContent=HE?`קוד ${c} · פלוגת «צפע» · קושי: ${dn} · תחילה 02:00 · שחר 05:30`:`Код ${c} · рота «Кобра» · сложность: ${dn.toLowerCase()} · начало 02:00 · рассвет 05:30`;$('#dTitle').textContent=HE?`סיכום אימון · ${c}`:`Итоги тренировки · ${c}`;return;}
  const n=L2(S.opName||['Решет','רשת']);
  $('#bTitle').textContent=HE?`פקודת מבצע: «${n}»`:`Боевой приказ: операция «${n}»`;
  $('#bMeta').textContent=HE?`פלוגת «צפע» · מבצע מס׳ ${S.op||1} · ${opDate(S.day)} · תחילה 02:00 · שחר 05:30`:`Рота «Кобра» · операция №${S.op||1} · ${opDate(S.day)} · начало 02:00 · рассвет 05:30`;
  $('#dTitle').textContent=HE?`סיכום מבצע «${n}»`:`Итоги операции «${n}»`;}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const opsWord=n=>HE?(n===1?'מבצע אחד':`${n} מבצעים`):(n===1?'одну операцию':`${n} операции`);
function showCamp(){const h=[];const r=C.last;
  h.push(tabs()+`<div class="stamp">${HE?'מפקדה':'ШТАБ'}</div><h1>${HE?'פלוגת «צפע»':'Рота «Кобра»'}</h1>`);
  h.push(`<div class="meta">${HE?`המבצע הבא: מס׳ ${C.op}, «${esc(L2(C.opName))}» · ${opDate(C.day)}`:`Следующая операция: №${C.op}, «${esc(L2(C.opName))}» · ${opDate(C.day)}`}</div>`);
  if(!r)h.push(`<p>${HE?'פלוגת «צפע» הוקמה לפעולה נגד חוליות «חדיד» באזור דיר נביל. הניסיון של הלוחמים ושל הצוותים נשמר ממבצע למבצע. מי שנפל לא חוזר. פצועים מחמיצים מבצע עד שלושה, ובמקומם מגיעים לוחמים חדשים. צוות שצובר ניסיון עולה ברמה ומקבל מיומנות.':'Рота «Кобра» сведена для операций против ячеек «Хадид» в районе Дейр-Набиля. Опыт бойцов и групп сохраняется от операции к операции. Погибшие не возвращаются. Раненые пропускают от одной до трёх операций, на их место приходят новички. Группа, набравшая опыт, растёт в уровне и получает навык.'}</p>`);
  else{h.push(`<h2>${HE?`סיכום מבצע «${esc(L2(r.name))}»`:`Итоги операции «${esc(L2(r.name))}»`}</h2><p class="cres">${esc(r.result||'')}</p>`);
    if(r.fallen.length)h.push(`<div class="mem"><b>${HE?'נפלו במבצע':'Погибли в операции'}</b>${r.fallen.map(id=>{const m=MAN(id);return`<div>${esc(manName(m))} · ${esc(L2(GNAME[m.g]))}, ${esc(L2(ROLE[m.role]))}</div>`;}).join('')}<small>${HE?'יהי זכרם ברוך':'Вечная память'}</small></div>`);
    const li=(title,ids,f)=>{if(ids.length)h.push(`<p><b>${title}</b> ${ids.map(id=>{const m=MAN(id);return esc(f?f(m):manName(m));}).join('; ')}.</p>`);};
    li(HE?'נפצעו:':'Ранены:',r.wounded,m=>`${manName(m)} (${L2(GNAME[m.g])}) — ${HE?'יחזור בעוד ':'вернётся через '}${opsWord(m.out)}`);
    li(HE?'הועלו בדרגה:':'Повышены в звании:',r.promoted,m=>`${L2(m.n)} — ${L2(rankOf(m))}`);
    li(HE?'קיבלו פיקוד:':'Приняли командование группой:',r.cmdNew,m=>`${manName(m)} (${L2(GNAME[m.g])})`);
    li(HE?'חזרו לצוות אחרי פציעה:':'Вернулись в строй после ранения:',r.returned);
    li(HE?'הגיעו לוחמים חדשים:':'Пополнение:',r.recruits,m=>`${manName(m)} (${L2(GNAME[m.g])}, ${L2(ROLE[m.role])})`);}
  for(const g of GIDS){const G=C.groups[g];if(!G.pend)continue;const opts=SKILLS[FORCE[g]].filter(k=>!G.sk.includes(k));if(!opts.length){G.pend=0;continue;}
    h.push(`<div class="pick"><b>${HE?`${esc(L2(GNAME[g]))} עלה לרמה ${G.lvl}. בחרו מיומנות:`:`${esc(L2(GNAME[g]))}: уровень ${G.lvl}. Выберите навык:`}</b>${opts.map(k=>`<button data-g="${g}" data-k="${k}"><b>${esc(L2(SK[k][0]))}</b><small>${esc(L2(SK[k][1]))}</small></button>`).join('')}</div>`);}
  for(const g of GIDS){const G=C.groups[g];const dep=new Set(deploy(g));const nx=GLVL[G.lvl];
    h.push(`<h2>${esc(L2(GNAME[g]))} · ${esc(L2(FNAME[FORCE[g]]))}</h2><div class="gl">${HE?`רמה ${G.lvl}${nx?` · ניסיון ${G.xp}/${nx}`:' · רמה מרבית'}`:`Уровень ${G.lvl}${nx?` · опыт ${G.xp}/${nx}`:' · высший уровень'}`}${G.sk.length?` · ${HE?'מיומנויות':'навыки'}: ${G.sk.map(k=>esc(L2(SK[k][0]))).join(', ')}`:''}</div><div class="ros">`);
    const men=C.men.filter(m=>m.g===g&&m.st!=='kia').sort((a,b)=>a.no-b.no);
    for(const m of men){const st=m.st==='wia'?(HE?`פצוע · עוד ${opsWord(m.out)}`:`ранен · ещё ${opsWord(m.out)}`):dep.has(m.id)?(HE?'כשיר':'в строю'):(HE?'עתודה':'резерв');
      h.push(`<div class="rr${m.st==='wia'?' w':''}"><span class="no">${m.no}</span><span><b>${esc(manName(m))}</b><small>${esc(L2(ROLE[m.role]))} · ${HE?'מבצעים':'операций'}: ${m.ops}</small></span><span class="st">${st}</span></div>`);}
    h.push('</div>');}
  const fallen=C.men.filter(m=>m.st==='kia');
  if(fallen.length)h.push(`<h2>${HE?'יזכור':'Память'}</h2><div class="mem">${fallen.map(m=>`<div>${esc(manName(m))} · ${esc(L2(GNAME[m.g]))} · ${HE?'מבצע':'операция'} «${esc(L2(m.opName))}», ${opDate(m.day)}</div>`).join('')}</div>`);
  if(C.hist.length)h.push(`<h2>${HE?'יומן המבצעים':'Журнал операций'}</h2><div class="hist">${C.hist.map(x=>`<div><span>${x.op}. «${esc(L2(x.name))}»</span><span>${esc(x.result||'')}${x.kia?(HE?` · נפלו: ${x.kia}`:` · погибли: ${x.kia}`):''}</span></div>`).join('')}</div>`);
  h.push(`<button class="go" id="cGo">${HE?'לפקודת המבצע':'К боевому приказу'}</button><button class="go alt" id="cNew">${HE?'מערכה חדשה':'Новая кампания'}</button>`);
  const d=$('#campDoc');d.innerHTML=h.join('');$('#camp').hidden=false;$('#camp').scrollTop=0;bindTabs();
  d.querySelectorAll('.pick button').forEach(b=>b.onclick=()=>{const G=C.groups[b.dataset.g];if(G.pend>0&&!G.sk.includes(b.dataset.k)){G.sk.push(b.dataset.k);G.pend--;saveCamp();const u=U_(b.dataset.g);if(u&&!S.started)u.sk=G.sk.slice();}showCamp();});
  $('#cGo').onclick=()=>{$('#camp').hidden=true;setBriefHead();$('#bGo').textContent=HE?'התחל מבצע':'Начать операцию';$('#bEnd').hidden=true;$('#brief').hidden=false;$('#brief').scrollTop=0;};
  let armed=0;$('#cNew').onclick=()=>{const b=$('#cNew');if(performance.now()-armed>4000){armed=performance.now();b.textContent=HE?'בטוח? הלוחמים וההיסטוריה יימחקו':'Точно? Бойцы и история будут удалены';return;}
    clearSave();newCamp();saveCamp();S=newState();resetView();showCamp();};}


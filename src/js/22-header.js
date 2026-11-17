/* ---------- header ---------- */
function setSpeedUI(){document.querySelectorAll('#speed button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===S.speed)));}
document.querySelectorAll('#speed button').forEach(b=>b.onclick=()=>{if(!S.started||S.over)return;S.speed=+b.dataset.s;setSpeedUI();if(AC&&AC.state==='suspended')AC.resume();});
$('#bSound').onclick=()=>{soundOn=!soundOn;$('#sndWave').style.opacity=soundOn?1:.15;initAudio();if(!soundOn)setHiss(false);};
$('#bHelp').onclick=()=>{if(S.started&&!S.over){S.speed=0;setSpeedUI();}$('#bGo').textContent=S.started?(HE?('חזרה למבצע'):('Вернуться к операции')):(HE?('התחל מבצע'):('Начать операцию'));$('#bEnd').hidden=!S.started||S.over;$('#bNew').hidden=true;setBriefHead();$('#brief').hidden=false;};
$('#bNew').onclick=()=>{$('#bNew').hidden=true;$('#bAgain').onclick();};
$('#bEnd').onclick=()=>{$('#brief').hidden=true;endGame('manual');};
$('#bGo').onclick=()=>{$('#brief').hidden=true;$('#bNew').hidden=true;initAudio();if(AC&&AC.state==='suspended')AC.resume();try{navigator.wakeLock&&navigator.wakeLock.request('screen').catch(()=>{});}catch(e){}
  if(!S.started){S.started=true;S.speed=1;
    hq((HE?(`כל התחנות ברשת «צפע», כאן צפע. מבצע «${L2(S.opName)}» — מתחילים. שקט ברשת. דווחו מוכנות. עבור.`):(`Всем станциям сети «Кобра», я Кобра-6. Операция «${L2(S.opName)}» — начало. Соблюдать тишину в эфире. Доложить готовность. Приём.`)));
    infs().forEach(u=>say(u,(HE?(`צפע, כאן ${u.call}. בנק״כ «ארז», מוכן לתנועה. עבור.`):(`Кобра-6, я ${u.call}. На ТС «Кедр», к выдвижению готов. Приём.`)),[posChip(u)],{known:'full'}));
    say(U_('ya'),(HE?('צפע, כאן זיק. באוויר, שוהה דרומית לעיר. עבור.'):('Кобра-6, я Ястреб. В воздухе, барражирую южнее города. Приём.')));
    say({call:(HE?('מודיעין'):('Разведка')),type:'x'},(HE?(`צפע, כאן מודיעין. «המהנדס», לפי המידע האחרון, נמצא באחד המבנים: ${S.cand.join(', ')}. איתו שניים-שלושה מאבטחים. המעבדה — כנראה במשבצת ${cell(BN(S.Wk).cx,BN(S.Wk).cy)}. ייתכנו תצפיתנים על הגגות בכניסה הדרומית ומטענים בכניסות. ייתכן שיש מנהרה, והפתח שלה עד 200 מ׳ מהבית של «המהנדס». עבור.`):(`Кобра-6, я Разведка. «Инженер», по последним данным, в одном из зданий: ${S.cand.join(', ')}. С ним двое-трое охраны. Мастерская — предположительно квадрат ${cell(BN(S.Wk).cx,BN(S.Wk).cy)}. Возможны наблюдатели на крышах у южного въезда, взрывные устройства на входах. Вероятен подземный ход, вход в него — не дальше 200 м от дома «Инженера». Приём.`)),S.cand.map(n=>bChip(n,'unk')),{act:{k:'labArea',x:BN(S.Wk).cx,y:BN(S.Wk).cy}});}
  else if(!S.over)S.speed=1;setSpeedUI();};
$('#bTruth').onclick=()=>{S.truth=true;$('#debrief').hidden=true;$('#truthPill').hidden=false;const L=BN(S.L);centerOn(L.cx,L.cy,clamp(cw/W*2.4,minS(),maxS()));};
$('#truthPill').onclick=()=>{$('#debrief').hidden=false;};
function resetView(){unitsEl.innerHTML='';$('#debrief').hidden=true;$('#truthPill').hidden=true;UI.target=null;selId=null;updTarget();rebuildLog();updUnits();updObj();setSpeedUI();dirty=true;}
$('#bAgain').onclick=()=>{clearSave();if(S.train){S=newState(TR);resetView();showTrain();}else{S=newState();resetView();showCamp();}};


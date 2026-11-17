/* ---------- campaign: named soldiers carried over from operation to operation ---------- */
const CAMP_KEY=HE?'reshet-camp-he':EN?'reshet-camp-en':'reshet-camp-ru';let C=null;
const L2=a=>a?(HE?a[1]:EN&&a[2]!=null?a[2]:a[0]):'';
const rnd=n=>Math.floor(Math.random()*n);
const FN=[['Авраам','אברהם',"Avraham"],['Даниэль','דניאל',"Daniel"],['Йонатан','יונתן',"Yonatan"],['Ноам','נועם',"Noam"],['Ори','אורי',"Ori"],['Итай','איתי',"Itai"],['Эйтан','איתן',"Eitan"],['Амит','עמית',"Amit"],['Идо','עידו',"Ido"],['Омер','עומר',"Omer"],['Яир','יאיר',"Yair"],['Гай','גיא',"Guy"],['Рои','רועי',"Roi"],['Нир','ניר',"Nir"],['Асаф','אסף',"Asaf"],['Михаэль','מיכאל',"Michael"],['Давид','דוד',"David"],['Ариэль','אריאל',"Ariel"],['Элад','אלעד',"Elad"],['Матан','מתן',"Matan"],['Йосеф','יוסף',"Yosef"],['Амир','אמיר',"Amir"],['Барак','ברק',"Barak"],['Лиор','ליאור',"Lior"],['Эяль','אייל',"Eyal"],['Нетанэль','נתנאל',"Netanel"],['Шахар','שחר',"Shahar"],['Дима','דימה',"Dima"],['Алекс','אלכס',"Alex"],['Эльдад','אלדד',"Eldad"],['Хен','חן',"Hen"],['Ярден','ירדן',"Yarden"],['Ави','אבי',"Avi"],['Ицхак','יצחק',"Yitzhak"],['Йоав','יואב',"Yoav"],['Надав','נדב',"Nadav"]];
const LN=[['Коэн','כהן',"Cohen"],['Леви','לוי',"Levi"],['Мизрахи','מזרחי',"Mizrahi"],['Перец','פרץ',"Peretz"],['Битон','ביטון',"Biton"],['Даган','דגן',"Dagan"],['Фридман','פרידמן',"Friedman"],['Шапиро','שפירא',"Shapira"],['Азулай','אזולאי',"Azulay"],['Охана','אוחנה',"Ohana"],['Голан','גולן',"Golan"],['Бен-Давид','בן דוד',"Ben-David"],['Кац','כץ',"Katz"],['Амар','עמר',"Amar"],['Малка','מלכה',"Malka"],['Хадад','חדד',"Hadad"],['Розен','רוזן',"Rosen"],['Авидан','אבידן',"Avidan"],['Коган','קוגן',"Kogan"],['Зильберман','זילברמן',"Zilberman"],['Нахум','נחום',"Nahum"],['Ашкенази','אשכנזי',"Ashkenazi"],['Бен-Ами','בן עמי',"Ben-Ami"],['Яфе','יפה',"Yafe"],['Вайс','וייס',"Weiss"],['Сасон','ששון',"Sasson"],['Гросс','גרוס',"Gross"],['Эльбаз','אלבז',"Elbaz"],['Шитрит','שטרית',"Shitrit"],['Рубин','רובין',"Rubin"],['Шарон','שרון',"Sharon"],['Бен-Хаим','בן חיים',"Ben-Haim"],['Элькаям','אלקיים',"Elkayam"],['Даан','דהן',"Dahan"],['Сабаг','סבג',"Sabag"],['Бен-Шимон','בן שמעון',"Ben-Shimon"],['Амсалем','אמסלם',"Amsalem"],['Вакнин','וקנין',"Vaknin"],['Бузагло','בוזגלו',"Buzaglo"],['Эдри','אדרי',"Edri"],['Габай','גבאי',"Gabay"],['Тургеман','תורג׳מן',"Turgeman"],['Абутбуль','אבוטבול',"Abutbul"],['Охайон','אוחיון',"Ohayon"],['Свиса','סויסה',"Swissa"],['Кахлон','כחלון',"Kahlon"],['Атиас','אטיאס',"Atias"],['Зоар','זוהר',"Zohar"],['Сегаль','סגל',"Segal"],['Кляйн','קליין',"Klein"],['Шварц','שוורץ',"Schwartz"],['Гольдберг','גולדברג',"Goldberg"],['Розенберг','רוזנברג',"Rosenberg"],['Фельдман','פלדמן',"Feldman"],['Горовиц','הורוביץ',"Horowitz"],['Лернер','לרנר',"Lerner"],['Левин','לוין',"Levin"],['Беркович','ברקוביץ׳',"Berkovich"],['Каплан','קפלן',"Kaplan"],['Штерн','שטרן',"Stern"],['Вайнберг','וינברג',"Weinberg"],['Мор','מור',"Mor"],['Таль','טל',"Tal"],['Шалев','שלו',"Shalev"],['Пелед','פלד',"Peled"],['Харель','הראל',"Harel"],['Шараби','שרעבי',"Sharabi"],['Цадок','צדוק',"Tzadok"],['Ицхаки','יצחקי',"Yitzhaki"],['Бен-Цви','בן צבי',"Ben-Zvi"],['Арад','ערד',"Arad"],['Эвен','אבן',"Even"],['Ронен','רונן',"Ronen"],['Элияу','אליהו',"Eliyahu"],['Мордехай','מרדכי',"Mordechai"],['Шемеш','שמש',"Shemesh"],['Хазан','חזן',"Hazan"],['Саадон','סעדון',"Saadon"],['Бен-Харуш','בן חרוש',"Ben-Harush"],['Асулин','אסולין',"Asulin"],['Эльмалиах','אלמליח',"Elmaliah"],['Африат','אפריאט',"Afriat"],['Тубуль','טובול',"Tubul"],['Пинто','פינטו',"Pinto"],['Абержель','אברג׳ל',"Abergel"],['Мазор','מזור',"Mazor"],['Эзра','עזרא',"Ezra"],['Навон','נבון',"Navon"],['Гильбоа','גלבוע',"Gilboa"],['Кармель','כרמל',"Carmel"],['Орен','אורן',"Oren"],['Эрез','ארז',"Erez"],['Алон','אלון',"Alon"],['Бар','בר',"Bar"],['Раз','רז',"Raz"],['Шакед','שקד',"Shaked"],['Дрор','דרור',"Dror"],['Нахмиас','נחמיאס',"Nahmias"],['Иегуда','יהודה',"Yehuda"],['Шрики','שריקי',"Shriki"],['Ифарган','איפרגן',"Ifergan"],['Ревиво','רביבו',"Revivo"],['Данино','דנינו',"Danino"],['Мояль','מויאל',"Moyal"],['Кадош','קדוש',"Kadosh"],['Рахамим','רחמים',"Rahamim"],['Битан','ביטן',"Bitan"],['Яаков','יעקב',"Yaakov"],['Толедано','טולדנו',"Toledano"],['Шушан','שושן',"Shushan"],['Медина','מדינה',"Medina"],['Загури','זגורי',"Zaguri"],['Полак','פולק',"Polak"],['Гутман','גוטמן',"Gutman"],['Варди','ורדי',"Vardi"],['Лави','לביא',"Lavi"],['Замир','זמיר',"Zamir"],['Офер','עופר',"Ofer"],['Амитай','אמיתי',"Amitai"],['Сиван','סיון',"Sivan"],['Тамир','תמיר',"Tamir"]];
// Druze soldiers serve in all three units; their names are drawn from a separate list.
const DFN=[['Фирас','פיראס',"Firas"],['Салман','סלמאן',"Salman"],['Ваэль','ואאל',"Wael"],['Камаль','כמאל',"Kamal"],['Шади','שאדי',"Shadi"]];
const DLN=[['Халаби','חלבי',"Halabi"],['Кабалан','קבלאן',"Kabalan"],['Ханифес','חניפס',"Hanifes"],['Асад','אסעד',"Assad"],['Сааб','סעב',"Saab"],['Мансур','מנסור',"Mansour"],['Нафаа','נפאע',"Nafaa"]];
const GIDS=['k1','k2','k3','dv'];
const FORCE={k1:'ym',k2:'ym',k3:'yh',dv:'dv'};
const CAP={k1:8,k2:8,k3:6,dv:8};
const TPL={ym:['cmd','med','drone','mg','brc','rif','rif','rif'],yh:['cmd','med','drone','sap','sap','sap'],dv:['cmd','med','drone','snp','mg','rif','rif','rif']};
const GNAME={k1:['Кобра-1','צפע 1',"Cobra-1"],k2:['Кобра-2','צפע 2',"Cobra-2"],k3:['Алмаз','יהלום',"Diamond"],dv:['Вишня','דובדבן',"Cherry"]};
const FNAME={ym:['ЯМАМ, штурмовая группа','ימ״מ, צוות הסתערות',"Yamam, assault team"],yh:['сапёры «Яхалом»','חבלני «יהלום»',"Yahalom sappers"],dv:['мистаарвим «Дувдеван»','מסתערבי «דובדבן»',"Duvdevan mista'arvim"]};
// YAMAM is a police unit and uses Border Police ranks; Yahalom and Duvdevan use IDF ranks.
const RANKS={ym:[['капрал','רב-שוטר',"Corporal"],['сержант','סמל',"Sergeant"],['старший сержант','סמל ראשון',"Staff Sergeant"],['старшина','רב-סמל',"Sergeant First Class"],['старший старшина','רב-סמל מתקדם',"Master Sergeant"]],
  ymo:[['младший инспектор','מפקח משנה',"Sub-Inspector"],['инспектор','מפקח',"Inspector"],['старший инспектор','פקד',"Chief Inspector"]],
  idf:[['рядовой','טוראי',"Private"],['ефрейтор','רב״ט',"Corporal"],['сержант','סמל',"Sergeant"],['старший сержант','סמ״ר',"Staff Sergeant"],['старшина','רס״ל',"Sergeant First Class"]],
  idfo:[['младший лейтенант','סג״ם',"Second Lieutenant"],['лейтенант','סגן',"Lieutenant"],['капитан','סרן',"Captain"]]};
const RK_XP=[0,5,12,21,32],RKO_XP=[0,12,28],GLVL=[0,8,20,36,56];
const ROLE={cmd:['командир группы','מפקד הצוות',"team leader"],med:['медик','חובש',"medic"],drone:['оператор дрона','מפעיל רחפן',"drone operator"],mg:['пулемётчик','מקלען',"machine gunner"],brc:['подрывник','פורץ',"breacher"],sap:['сапёр','חבלן',"sapper"],snp:['снайпер','צלף',"sniper"],rif:['стрелок','לוחם',"rifleman"]};
const SKILLS={ym:['cqb','capture','fire','stealth'],yh:['fastdis','charge','demo','fire'],dv:['stealth','recon','sniper','capture']};
const SK={cqb:[['Быстрая зачистка','טיהור מהיר',"Fast clearing"],['зачистка зданий на 20% быстрее','טיהור מבנים מהיר ב-20%',"buildings cleared 20% faster"]],
  capture:[['Взятие живыми','לכידה בחיים',"Taken alive"],['на 10% чаще берут спящих живыми','סיכוי גבוה ב-10% לתפוס ישנים בחיים',"10% more often take sleepers alive"]],
  fire:[['Огневая дисциплина','משמעת אש',"Fire discipline"],['в перестрелке на 15% точнее','מדויקים ב-15% בקרב אש',"15% more accurate in firefights"]],
  stealth:[['Скрытное выдвижение','תנועה חשאית',"Stealthy approach"],['наблюдатели и патрули замечают на 40% реже','תצפיתנים וסיורים מבחינים ב-40% פחות',"lookouts and patrols notice them 40% less"]],
  fastdis:[['Быстрое разминирование','פירוק מהיר',"Fast clearing of traps"],['ловушку с двери снимают на 40% быстрее','מפרקים מטען מהדלת מהר יותר ב-40%',"door traps removed 40% faster"]],
  charge:[['Направленный заряд','מטען כיווני',"Shaped charge"],['подрыв стены на 40% быстрее','פריצת קיר מהירה ב-40%',"wall breaching 40% faster"]],
  demo:[['Подрыв мастерской','השמדת מעבדה',"Workshop demolition"],['мастерскую готовят к подрыву за 3 минуты вместо 5','מכינים את המעבדה לפיצוץ ב-3 דקות במקום 5',"workshop rigged for demolition in 3 minutes instead of 5"]],
  recon:[['Разведка','תצפית',"Reconnaissance"],['наблюдение за зданием на треть короче','תצפית על מבנה קצרה בשליש',"building observation a third shorter"]],
  sniper:[['Снайперская пара','צמד צלפים',"Sniper pair"],['снайпер почти не промахивается по наблюдателям','הצלף כמעט לא מחטיא תצפיתנים',"the sniper almost never misses lookouts"]]};
const OPNAMES=[['Тихая вода','מים שקטים',"Still Water"],['Медная нить','חוט נחושת',"Copper Thread"],['Белый камень','אבן לבנה',"White Stone"],['Сухая ветка','ענף יבש',"Dry Branch"],['Старый колодец','באר ישנה',"Old Well"],['Песочные часы','שעון חול',"Hourglass"],['Глиняный кувшин','כד חרס',"Clay Jug"],['Северный ветер','רוח צפונית',"North Wind"],['Ночная тропа','שביל לילה',"Night Trail"],['Каменная соль','מלח סלעים',"Rock Salt"],['Чёрный кедр','ארז שחור',"Black Cedar"],['Тёмный двор','חצר חשוכה',"Dark Yard"]];
const MONTHS=HE?['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']:(EN?(['January','February','March','April','May','June','July','August','September','October','November','December']):(['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']));
function opDate(day){const d=new Date(2026,10,14+(day||0));return HE?`ליל ${d.getDate()} ב${MONTHS[d.getMonth()]}`:(EN?(`night of ${MONTHS[d.getMonth()]} ${d.getDate()}`):(`ночь на ${d.getDate()} ${MONTHS[d.getMonth()]}`));}
const rkIdx=(xp,t)=>{let i=0;while(i+1<t.length&&xp>=t[i+1])i++;return i;};
function rankOf(m){const ym=FORCE[m.g]==='ym';return m.off?RANKS[ym?'ymo':'idfo'][rkIdx(m.xp,RKO_XP)]:RANKS[ym?'ym':'idf'][rkIdx(m.xp,RK_XP)];}
const rankKey=m=>(m.off?'o':'e')+(m.off?rkIdx(m.xp,RKO_XP):rkIdx(m.xp,RK_XP));
const rankLvl=m=>m.off?Math.min(4,3+rkIdx(m.xp,RKO_XP)):rkIdx(m.xp,RK_XP);
const MAN=id=>C&&C.men.find(m=>m.id===id);
const manName=m=>m?`${L2(rankOf(m))} ${L2(m.n)}`:'';
const sk=(u,k)=>!!(u.sk&&u.sk.includes(k));
function freeNo(g){const used=new Set(C.men.filter(m=>m.g===g&&m.st!=='kia').map(m=>m.no));let n=1;while(used.has(n))n++;return n;}
// Surnames never repeat among soldiers on the roster (on duty, wounded, reserve); if possible not even among the fallen.
// First names are not repeated either while unused ones remain.
function uniqName(skip){const others=C.men.filter(m=>m!==skip&&m.n);const sur=m=>m.n[0].split(' ').slice(1).join(' '),fir=m=>m.n[0].split(' ')[0];
  const live=new Set(others.filter(m=>m.st!=='kia').map(sur)),all=new Set(others.map(sur)),liveF=new Set(others.filter(m=>m.st!=='kia').map(fir));
  const pickFrom=(list,bad)=>{const ok=list.filter(x=>!bad.has(x[0]));return ok.length?pick(ok):null;};
  if(Math.random()<.12){const fn=pickFrom(DFN,liveF),ln=pickFrom(DLN,all)||pickFrom(DLN,live);if(fn&&ln)return[fn,ln];}
  const ln=pickFrom(LN,all)||pickFrom(LN,live)||pick(LN);const fn=pickFrom(FN,liveF)||pick(FN);return[fn,ln];}
const nameOf=([fn,ln])=>[fn[0]+' '+ln[0],fn[1]+' '+ln[1],fn[2]+' '+ln[2]];
function fixDupNames(c){const seen=new Set();for(const m of [...c.men].filter(m=>m.st!=='kia').sort((a,b)=>b.ops-a.ops||a.id-b.id)){const s=m.n[0].split(' ').slice(1).join(' ');if(seen.has(s)){m.n=nameOf(uniqName(m));}seen.add(m.n[0].split(' ').slice(1).join(' '));}}
function mkMan(g,role,fresh){const f=FORCE[g];const [fn,ln]=uniqName();const off=role==='cmd';
  // YAMAM recruits come from experienced police officers; army units take young conscripts.
  const xp=fresh?(f==='ym'?5+rnd(4):0):(f==='ym'?(off?12+rnd(10):8+rnd(20)):(off?rnd(14):rnd(14)));
  const m={id:C.nid++,g,role,off,xp,ops:0,st:'ok',out:0,no:freeNo(g),n:[fn[0]+' '+ln[0],fn[1]+' '+ln[1],fn[2]+' '+ln[2]]};C.men.push(m);return m;}
function newCamp(){C={v:1,op:1,day:0,opName:['Решет','רשת',"Reshet"],used:[],nid:1,groups:{},men:[],last:null,hist:[]};
  for(const g of GIDS){C.groups[g]={xp:0,lvl:1,sk:[],pend:0};TPL[FORCE[g]].forEach(r=>mkMan(g,r,false));}return C;}
function saveCamp(){try{localStorage.setItem(CAMP_KEY,JSON.stringify(C));}catch(e){}}
function loadCamp(){try{const d=JSON.parse(localStorage.getItem(CAMP_KEY)||'null');if(d&&d.v===1&&d.men){C=d;fixDupNames(d);return d;}}catch(e){}return null;}
function deploy(g){const fit=C.men.filter(m=>m.g===g&&m.st==='ok').sort((a,b)=>b.xp-a.xp);const out=[];
  for(const r of TPL[FORCE[g]]){const i=fit.findIndex(m=>m.role===r);if(i>=0)out.push(fit.splice(i,1)[0]);}
  while(out.length<CAP[g]&&fit.length)out.push(fit.shift());return out.slice(0,CAP[g]).map(m=>m.id);}
function crewApply(u){if(!C||!C.groups[u.id])return;const G=C.groups[u.id];u.crew=deploy(u.id);u.cs={};u.newIds=[];u.kills=0;u.fought=false;
  if(u.crew.length)u.men=u.crew.length;u.sk=G.sk.slice();
  const avg=u.crew.reduce((s,id)=>s+rankLvl(MAN(id)),0)/Math.max(1,u.crew.length);
  u.q=+(.92+avg*.04+(G.lvl-1)*.02).toFixed(3);u.morale=Math.round(Math.min(92,75+avg*4));}
function roleOk(u,r){if(!u.crew||!C)return true;return u.crew.some(id=>{const m=MAN(id);return m&&m.role===r&&!u.cs[id];});}
function hitMan(u,k){if(!u.crew||!C)return;const ok=u.crew.filter(id=>!u.cs[id]);if(!ok.length)return;const id=ok[rnd(ok.length)];u.cs[id]=k;(u.newIds||(u.newIds=[])).push(id);}
function dowMan(u){if(!u.crew||!C)return null;const w=u.crew.filter(id=>u.cs[id]==='w');if(!w.length)return null;const id=w[rnd(w.length)];u.cs[id]='k';return MAN(id);}
function evacMen(u){if(!u.crew)return;for(const id of u.crew)if(u.cs[id]==='w')u.cs[id]='we';}
// Radio gives casualties by roster number only (no names on the net); the commander's log adds who it is.
function casRep(u){const ids=(u.newIds||[]).filter(id=>MAN(id));u.newIds=[];if(!ids.length)return{t:'',note:''};
  let t=HE?` מספרים: ${ids.map(id=>MAN(id).no).join(', ')}.`:(EN?(` Roster numbers: ${ids.map(id=>MAN(id).no).join(', ')}.`):(` Номера: ${ids.map(id=>MAN(id).no).join(', ')}.`));
  for(const id of ids){const m=MAN(id);
    if(m.role==='cmd'&&!roleOk(u,'cmd')){const nx=curCmd(u);if(nx)t+=HE?` המפקד נפגע, מספר ${nx.no} מקבל פיקוד.`:(EN?(` Team leader is down, number ${nx.no} has command.`):(` Командир выбыл, командование принял номер ${nx.no}.`));}
    else if(m.role==='med'&&!roleOk(u,'med'))t+=HE?' החובש נפגע.':(EN?(" Medic is down."):(' Медик выбыл.'));
    else if(m.role==='drone'&&!roleOk(u,'drone'))t+=HE?' מפעיל הרחפן נפגע, אין רחפן.':(EN?(" Drone operator is down, no drone."):(' Оператор дрона выбыл, дрона нет.'));}
  const note=ids.map(id=>{const m=MAN(id);const k=u.cs[id];return HE?`מס׳ ${m.no} — ${manName(m)}, ${k==='k'?'נהרג':'נפצע'}`:(EN?(`#${m.no} — ${manName(m)}, ${k==='k'?'killed':'wounded'}`):(`№${m.no} — ${manName(m)}, ${k==='k'?'погиб':'ранен'}`));}).join(' · ');
  return{t,note};}
function curCmd(u){const a=u.crew.map(MAN).filter(m=>m&&!u.cs[m.id]);return a.find(m=>m.role==='cmd')||a.sort((x,y)=>y.xp-x.xp)[0];}
function crewLine(u){if(!u.crew||!C)return'';const cm=curCmd(u);if(!cm)return'';
  return(HE?`מפקד: ${manName(cm)} · רמה ${C.groups[u.id].lvl}`:(EN?(`Team leader: ${manName(cm)} · level ${C.groups[u.id].lvl}`):(`Командир: ${manName(cm)} · уровень ${C.groups[u.id].lvl}`)))+'\n';}
function nextOpName(){const free=OPNAMES.map((_,i)=>i).filter(i=>!C.used.includes(i));const i=free.length?pick(free):rnd(OPNAMES.length);C.used.push(i);return OPNAMES[i];}
function campAfter(){if(!C||S.campDone||S.train||S.mission)return;S.campDone=true;
  const ok=S.leader==='killed'||S.leader==='captured';const best=S.leader==='captured'&&S.lab==='destroyed'&&!S.civHarm;
  const r={op:S.op||C.op,name:S.opName||C.opName,day:S.day||0,result:S.result,ok,fallen:[],wounded:[],promoted:[],returned:[],recruits:[],lvlUp:[],cmdNew:[]};
  for(const m of C.men)if(m.st==='wia'){m.out--;if(m.out<=0){m.st='ok';m.out=0;r.returned.push(m.id);}}
  for(const u of infs()){const G=C.groups[u.id];if(!G)continue;
    for(const id of u.crew||[]){const m=MAN(id);if(!m)continue;const k=u.cs[id];
      if(k==='k'){m.st='kia';m.op=r.op;m.opName=r.name;m.day=r.day;r.fallen.push(id);continue;}
      const r0=rankKey(m);m.ops++;m.xp+=1+(ok?1:0)+(u.fought?1:0)+(best?1:0);if(rankKey(m)!==r0)r.promoted.push(id);
      if(k==='w'||k==='we'){const x=Math.random();m.st='wia';m.out=x<.6?1:x<.9?2:3;r.wounded.push(id);}}
    const l0=G.lvl;G.xp+=2+(ok?2:0)+(u.fought?1:0)+Math.min(3,u.kills||0)+(best?1:0);
    while(G.lvl<GLVL.length&&G.xp>=GLVL[G.lvl])G.lvl++;if(G.lvl>l0){G.pend+=G.lvl-l0;r.lvlUp.push(u.id);}}
  for(const g of GIDS){const fit=()=>C.men.filter(m=>m.g===g&&m.st==='ok');
    if(!fit().some(m=>m.role==='cmd')){const nc=fit().sort((a,b)=>b.xp-a.xp)[0];if(nc){nc.role='cmd';r.cmdNew.push(nc.id);}}
    while(fit().length<CAP[g]){const have=fit().map(m=>m.role);const need=TPL[FORCE[g]].filter(x=>{const i=have.indexOf(x);if(i>=0){have.splice(i,1);return false;}return true;});
      r.recruits.push(mkMan(g,need[0]||'rif',true).id);}}
  C.hist.push({op:r.op,name:r.name,day:r.day,result:S.result,ok,kia:r.fallen.length,wia:r.wounded.length});
  C.op++;C.day+=4+rnd(9);C.opName=nextOpName();C.last=r;saveCamp();
  S.fallen=r.fallen.map(id=>`${manName(MAN(id))} (${L2(GNAME[MAN(id).g])})`);}


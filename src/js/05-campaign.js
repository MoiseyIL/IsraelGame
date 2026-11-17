/* ---------- campaign: named soldiers carried over from operation to operation ---------- */
const CAMP_KEY=HE?'reshet-camp-he':'reshet-camp-ru';let C=null;
const L2=a=>a?(HE?a[1]:a[0]):'';
const rnd=n=>Math.floor(Math.random()*n);
const FN=[['Авраам','אברהם'],['Даниэль','דניאל'],['Йонатан','יונתן'],['Ноам','נועם'],['Ори','אורי'],['Итай','איתי'],['Эйтан','איתן'],['Амит','עמית'],['Идо','עידו'],['Омер','עומר'],['Яир','יאיר'],['Гай','גיא'],['Рои','רועי'],['Нир','ניר'],['Асаф','אסף'],['Михаэль','מיכאל'],['Давид','דוד'],['Ариэль','אריאל'],['Элад','אלעד'],['Матан','מתן'],['Йосеф','יוסף'],['Амир','אמיר'],['Барак','ברק'],['Лиор','ליאור'],['Эяль','אייל'],['Нетанэль','נתנאל'],['Шахар','שחר'],['Дима','דימה'],['Алекс','אלכס'],['Эльдад','אלדד'],['Хен','חן'],['Ярден','ירדן'],['Ави','אבי'],['Ицхак','יצחק'],['Йоав','יואב'],['Надав','נדב']];
const LN=[['Коэн','כהן'],['Леви','לוי'],['Мизрахи','מזרחי'],['Перец','פרץ'],['Битон','ביטון'],['Даган','דגן'],['Фридман','פרידמן'],['Шапиро','שפירא'],['Азулай','אזולאי'],['Охана','אוחנה'],['Голан','גולן'],['Бен-Давид','בן דוד'],['Кац','כץ'],['Амар','עמר'],['Малка','מלכה'],['Хадад','חדד'],['Розен','רוזן'],['Авидан','אבידן'],['Коган','קוגן'],['Зильберман','זילברמן'],['Нахум','נחום'],['Ашкенази','אשכנזי'],['Бен-Ами','בן עמי'],['Яфе','יפה'],['Вайс','וייס'],['Сасон','ששון'],['Гросс','גרוס'],['Эльбаз','אלבז'],['Шитрит','שטרית'],['Рубин','רובין']];
// Druze soldiers serve in all three units; their names are drawn from a separate list.
const DFN=[['Фирас','פיראס'],['Салман','סלמאן'],['Ваэль','ואאל'],['Камаль','כמאל'],['Шади','שאדי']];
const DLN=[['Халаби','חלבי'],['Кабалан','קבלאן'],['Ханифес','חניפס'],['Асад','אסעד']];
const GIDS=['k1','k2','k3','dv'];
const FORCE={k1:'ym',k2:'ym',k3:'yh',dv:'dv'};
const CAP={k1:8,k2:8,k3:6,dv:8};
const TPL={ym:['cmd','med','drone','mg','brc','rif','rif','rif'],yh:['cmd','med','drone','sap','sap','sap'],dv:['cmd','med','drone','snp','mg','rif','rif','rif']};
const GNAME={k1:['Кобра-1','צפע 1'],k2:['Кобра-2','צפע 2'],k3:['Алмаз','יהלום'],dv:['Вишня','דובדבן']};
const FNAME={ym:['ЯМАМ, штурмовая группа','ימ״מ, צוות הסתערות'],yh:['сапёры «Яхалом»','חבלני «יהלום»'],dv:['мистаарвим «Дувдеван»','מסתערבי «דובדבן»']};
// YAMAM is a police unit and uses Border Police ranks; Yahalom and Duvdevan use IDF ranks.
const RANKS={ym:[['капрал','רב-שוטר'],['сержант','סמל'],['старший сержант','סמל ראשון'],['старшина','רב-סמל'],['старший старшина','רב-סמל מתקדם']],
  ymo:[['младший инспектор','מפקח משנה'],['инспектор','מפקח'],['старший инспектор','פקד']],
  idf:[['рядовой','טוראי'],['ефрейтор','רב״ט'],['сержант','סמל'],['старший сержант','סמ״ר'],['старшина','רס״ל']],
  idfo:[['младший лейтенант','סג״ם'],['лейтенант','סגן'],['капитан','סרן']]};
const RK_XP=[0,5,12,21,32],RKO_XP=[0,12,28],GLVL=[0,8,20,36,56];
const ROLE={cmd:['командир группы','מפקד הצוות'],med:['медик','חובש'],drone:['оператор дрона','מפעיל רחפן'],mg:['пулемётчик','מקלען'],brc:['подрывник','פורץ'],sap:['сапёр','חבלן'],snp:['снайпер','צלף'],rif:['стрелок','לוחם']};
const SKILLS={ym:['cqb','capture','fire','stealth'],yh:['fastdis','charge','demo','fire'],dv:['stealth','recon','sniper','capture']};
const SK={cqb:[['Быстрая зачистка','טיהור מהיר'],['зачистка зданий на 20% быстрее','טיהור מבנים מהיר ב-20%']],
  capture:[['Взятие живыми','לכידה בחיים'],['на 10% чаще берут спящих живыми','סיכוי גבוה ב-10% לתפוס ישנים בחיים']],
  fire:[['Огневая дисциплина','משמעת אש'],['в перестрелке на 15% точнее','מדויקים ב-15% בקרב אש']],
  stealth:[['Скрытное выдвижение','תנועה חשאית'],['наблюдатели и патрули замечают на 40% реже','תצפיתנים וסיורים מבחינים ב-40% פחות']],
  fastdis:[['Быстрое разминирование','פירוק מהיר'],['ловушку с двери снимают на 40% быстрее','מפרקים מטען מהדלת מהר יותר ב-40%']],
  charge:[['Направленный заряд','מטען כיווני'],['подрыв стены на 40% быстрее','פריצת קיר מהירה ב-40%']],
  demo:[['Подрыв мастерской','השמדת מעבדה'],['мастерскую готовят к подрыву за 3 минуты вместо 5','מכינים את המעבדה לפיצוץ ב-3 דקות במקום 5']],
  recon:[['Разведка','תצפית'],['наблюдение за зданием на треть короче','תצפית על מבנה קצרה בשליש']],
  sniper:[['Снайперская пара','צמד צלפים'],['снайпер почти не промахивается по наблюдателям','הצלף כמעט לא מחטיא תצפיתנים']]};
const OPNAMES=[['Тихая вода','מים שקטים'],['Медная нить','חוט נחושת'],['Белый камень','אבן לבנה'],['Сухая ветка','ענף יבש'],['Старый колодец','באר ישנה'],['Песочные часы','שעון חול'],['Глиняный кувшин','כד חרס'],['Северный ветер','רוח צפונית'],['Ночная тропа','שביל לילה'],['Каменная соль','מלח סלעים'],['Чёрный кедр','ארז שחור'],['Тёмный двор','חצר חשוכה']];
const MONTHS=HE?['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function opDate(day){const d=new Date(2026,10,14+(day||0));return HE?`ליל ${d.getDate()} ב${MONTHS[d.getMonth()]}`:`ночь на ${d.getDate()} ${MONTHS[d.getMonth()]}`;}
const rkIdx=(xp,t)=>{let i=0;while(i+1<t.length&&xp>=t[i+1])i++;return i;};
function rankOf(m){const ym=FORCE[m.g]==='ym';return m.off?RANKS[ym?'ymo':'idfo'][rkIdx(m.xp,RKO_XP)]:RANKS[ym?'ym':'idf'][rkIdx(m.xp,RK_XP)];}
const rankKey=m=>(m.off?'o':'e')+(m.off?rkIdx(m.xp,RKO_XP):rkIdx(m.xp,RK_XP));
const rankLvl=m=>m.off?Math.min(4,3+rkIdx(m.xp,RKO_XP)):rkIdx(m.xp,RK_XP);
const MAN=id=>C&&C.men.find(m=>m.id===id);
const manName=m=>m?`${L2(rankOf(m))} ${L2(m.n)}`:'';
const sk=(u,k)=>!!(u.sk&&u.sk.includes(k));
function freeNo(g){const used=new Set(C.men.filter(m=>m.g===g&&m.st!=='kia').map(m=>m.no));let n=1;while(used.has(n))n++;return n;}
function mkMan(g,role,fresh){const f=FORCE[g];const dz=Math.random()<.12;const fn=pick(dz?DFN:FN),ln=pick(dz?DLN:LN);const off=role==='cmd';
  // YAMAM recruits come from experienced police officers; army units take young conscripts.
  const xp=fresh?(f==='ym'?5+rnd(4):0):(f==='ym'?(off?12+rnd(10):8+rnd(20)):(off?rnd(14):rnd(14)));
  const m={id:C.nid++,g,role,off,xp,ops:0,st:'ok',out:0,no:freeNo(g),n:[fn[0]+' '+ln[0],fn[1]+' '+ln[1]]};C.men.push(m);return m;}
function newCamp(){C={v:1,op:1,day:0,opName:['Решет','רשת'],used:[],nid:1,groups:{},men:[],last:null,hist:[]};
  for(const g of GIDS){C.groups[g]={xp:0,lvl:1,sk:[],pend:0};TPL[FORCE[g]].forEach(r=>mkMan(g,r,false));}return C;}
function saveCamp(){try{localStorage.setItem(CAMP_KEY,JSON.stringify(C));}catch(e){}}
function loadCamp(){try{const d=JSON.parse(localStorage.getItem(CAMP_KEY)||'null');if(d&&d.v===1&&d.men)return d;}catch(e){}return null;}
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
  let t=HE?` מספרים: ${ids.map(id=>MAN(id).no).join(', ')}.`:` Номера: ${ids.map(id=>MAN(id).no).join(', ')}.`;
  for(const id of ids){const m=MAN(id);
    if(m.role==='cmd'&&!roleOk(u,'cmd')){const nx=curCmd(u);if(nx)t+=HE?` המפקד נפגע, מספר ${nx.no} מקבל פיקוד.`:` Командир выбыл, командование принял номер ${nx.no}.`;}
    else if(m.role==='med'&&!roleOk(u,'med'))t+=HE?' החובש נפגע.':' Медик выбыл.';
    else if(m.role==='drone'&&!roleOk(u,'drone'))t+=HE?' מפעיל הרחפן נפגע, אין רחפן.':' Оператор дрона выбыл, дрона нет.';}
  const note=ids.map(id=>{const m=MAN(id);const k=u.cs[id];return HE?`מס׳ ${m.no} — ${manName(m)}, ${k==='k'?'נהרג':'נפצע'}`:`№${m.no} — ${manName(m)}, ${k==='k'?'погиб':'ранен'}`;}).join(' · ');
  return{t,note};}
function curCmd(u){const a=u.crew.map(MAN).filter(m=>m&&!u.cs[m.id]);return a.find(m=>m.role==='cmd')||a.sort((x,y)=>y.xp-x.xp)[0];}
function crewLine(u){if(!u.crew||!C)return'';const cm=curCmd(u);if(!cm)return'';
  return(HE?`מפקד: ${manName(cm)} · רמה ${C.groups[u.id].lvl}`:`Командир: ${manName(cm)} · уровень ${C.groups[u.id].lvl}`)+'\n';}
function nextOpName(){const free=OPNAMES.map((_,i)=>i).filter(i=>!C.used.includes(i));const i=free.length?pick(free):rnd(OPNAMES.length);C.used.push(i);return OPNAMES[i];}
function campAfter(){if(!C||S.campDone||S.train)return;S.campDone=true;
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


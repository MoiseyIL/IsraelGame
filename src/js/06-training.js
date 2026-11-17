/* ---------- training: generated city and enemy, forces chosen from the full list ---------- */
const TRAIN_KEY=HE?'reshet-train-he':'reshet-train-ru',MODE_KEY='reshet-mode';
let TR=null,MODE='camp';
const DIFF=[['Лёгкая','קלה'],['Средняя','בינונית'],['Тяжёлая','קשה'],['Очень тяжёлая','קשה מאוד']];
const DENS={sparse:['Редкая','דלילה'],normal:['Обычная','רגילה'],dense:['Плотная','צפופה']};
const MAXG=7;
const UCAT=[['sf',['Спецназ и полиция','יחידות מיוחדות']],['rec',['Разведка пехотных бригад','סיירות החטיבות']],['inf',['Пехотные бригады','חטיבות חי״ר']],['eng',['Инженерные войска','הנדסה קרבית']],['bdr',['Корпус охраны границ','מערך הגנת הגבולות']]];
// pub: only what is published (Wikipedia, IDF site, news). Numbers under "В игре" are game conventions.
const TU={
 ym:{c:'sf',n:['ЯМАМ','ימ״מ'],sh:['ЯМ','ימ'],men:8,q:1,stl:1,cap:.6,clr:1,st:[3,3,5],
  pub:['Спецподразделение полиции Израиля по борьбе с террором, в составе пограничной полиции, создано в 1974 году. Штурм зданий, освобождение заложников, задержание разыскиваемых.','היחידה המשטרתית ללוחמה בטרור, חלק ממשמר הגבול, הוקמה ב-1974. פריצה למבנים, חילוץ בני ערובה, מעצר מבוקשים.'],
  gm:['Штурмовая группа, оружие с глушителями. Чаще всех берёт живыми.','צוות הסתערות, נשק עם משתיקים. לוכד בחיים יותר מכולם.'],src:'https://en.wikipedia.org/wiki/Yamam'},
 dv:{c:'sf',n:['Дувдеван','דובדבן'],sh:['Дв','דב'],men:8,uc:true,veh:true,cap:.75,st:[3,5,4],
  pub:['Подразделение мистаарвим бригады коммандос «Оз»: бойцы действуют под видом местных жителей и задерживают разыскиваемых на Западном берегу.','יחידת מסתערבים בחטיבת הקומנדו «עוז»: הלוחמים פועלים בהסוואה של תושבים מקומיים ועוצרים מבוקשים ביהודה ושומרון.'],
  gm:['Под видом местных, на гражданской машине. Наблюдатели почти не замечают.','בהסוואה של מקומיים, ברכב אזרחי. תצפיתנים כמעט לא מבחינים בהם.'],src:'https://en.wikipedia.org/wiki/Duvdevan_Unit'},
 mg:{c:'sf',n:['Маглан','מגלן'],sh:['Мг','מג'],men:6,q:1.05,stl:.8,cap:.5,clr:1.25,optic:true,atgm:4,st:[3,4,2],
  pub:['Подразделение 212 бригады коммандос, создано в 1986 году как противотанковое и разведывательное, с современным вооружением. Задачи засекречены. По сообщениям ЦАХАЛ о Хан-Юнисе (2024): наводили огонь с воздуха, вели снайперский огонь и ближний бой, применяли высокоточные боеприпасы, малыми дронами осматривали здания.','יחידה 212 בחטיבת הקומנדו, הוקמה ב-1986 כיחידת נ״ט וסיור עם אמצעי לחימה מתקדמים. המשימות מסווגות. לפי דיווחי צה״ל מחאן יונס (2024): הכוונת אש מהאוויר, ירי צלפים, לחימה מטווח קצר, חימוש מדויק ורחפנים קטנים לסריקת מבנים.'],
  gm:['Малая группа. Управляемые ракеты по огневым точкам, дальняя оптика: видит дальше и подтверждает цели для удара. Долгая зачистка — не её работа.','צוות קטן. טילים מונחים נגד עמדות ירי, אופטיקה לטווח ארוך: רואה רחוק יותר ומאמת מטרות לתקיפה. טיהור ארוך — לא המקצוע שלה.'],src:'https://en.wikipedia.org/wiki/Maglan'},
 eg:{c:'sf',n:['Эгоз','אגוז'],sh:['Эг','אג'],men:8,q:1.1,stl:.7,amb:.8,cap:.55,st:[4,4,4],
  pub:['Подразделение 621 бригады коммандос, создано в 1995 году для противопартизанской войны против «Хезболлы» на юге Ливана. После 2000 года действует на Западном берегу и в Газе: специальная разведка, рейды, борьба с террором. Действует малыми группами. Участвовало в операции в Дженине в июле 2023 года.','יחידה 621 בחטיבת הקומנדו, הוקמה ב-1995 ללוחמת גרילה נגד חיזבאללה בדרום לבנון. אחרי 2000 פועלת ביהודה ושומרון וברצועת עזה: סיור מיוחד, פשיטות, לוחמה בטרור. פועלת בצוותים קטנים. השתתפה במבצע בג׳נין ביולי 2023.'],
  gm:['Скрытный ночной рейд, засады на патрули, сильна в уличном бою.','פשיטה לילית חשאית, מארבים לסיורים, חזקה בקרב ברחוב.'],src:'https://en.wikipedia.org/wiki/Egoz_Unit'},
 yh:{c:'eng',n:['Яхалом','יהלום'],sh:['Ях','יה'],men:6,q:.95,sap:true,st:[2,3,3],
  pub:['Специальное подразделение инженерных войск ЦАХАЛ: разминирование, подрывные работы, туннели.','היחידה המיוחדת של חיל ההנדסה הקרבית: פירוק מטענים, הריסות, מנהרות.'],
  gm:['Тихо снимают ловушки с дверей, подрывают мастерскую и подземный ход.','מפרקים מטענים בדלתות בשקט, מפוצצים את המעבדה והמנהרה.'],src:'https://en.wikipedia.org/wiki/Yahalom_(unit)'},
 sgol:{c:'rec',n:['Сайерет Голани','סיירת גולני'],sh:['СГл','סג'],men:8,q:1,stl:.8,cap:.55,st:[3,4,3],
  pub:['Разведывательное подразделение бригады «Голани». У каждой регулярной пехотной бригады ЦАХАЛ есть своё разведподразделение.','יחידת הסיור של חטיבת גולני. לכל חטיבת חי״ר סדירה בצה״ל יש יחידת סיור משלה.'],
  gm:['Небольшая подготовленная группа: скрытное выдвижение, разведка, штурм.','צוות קטן ומיומן: תנועה חשאית, סיור, הסתערות.'],src:'https://en.wikipedia.org/wiki/Golani_Brigade'},
 stz:{c:'rec',n:['Разведбат «Цанханим»','פלס״ר צנחנים'],sh:['РЦ','פצ'],men:8,q:1,stl:.8,cap:.55,st:[3,4,3],
  pub:['Разведывательный батальон (5135) бригады «Цанханим». Источники по-разному называют его роль: разведка или патрулирование.','גדוד הסיור (5135) של חטיבת הצנחנים. המקורות מתארים את תפקידו בצורות שונות: סיור או פטרול.'],
  gm:['Небольшая подготовленная группа: скрытное выдвижение, разведка, штурм.','צוות קטן ומיומן: תנועה חשאית, סיור, הסתערות.'],src:'https://en.wikipedia.org/wiki/35th_Paratroopers_Brigade_(Israel)'},
 sgv:{c:'rec',n:['Сайерет Гивати','סיירת גבעתי'],sh:['СГв','סב'],men:8,q:1,stl:.8,cap:.55,st:[3,4,3],
  pub:['Разведывательный батальон 846 «Шуалей Шимшон» («Лисы Самсона») бригады «Гивати».','גדוד הסיור 846 «שועלי שמשון» של חטיבת גבעתי.'],
  gm:['Небольшая подготовленная группа: скрытное выдвижение, разведка, штурм.','צוות קטן ומיומן: תנועה חשאית, סיור, הסתערות.'],src:'https://en.wikipedia.org/wiki/Givati_Brigade'},
 snh:{c:'rec',n:['Разведбат «Нахаль»','גדס״ר נח״ל'],sh:['РН','גנ'],men:8,q:1,stl:.8,cap:.55,ask:true,st:[3,4,3],
  pub:['Разведывательный батальон бригады «Нахаль». По сообщению СМИ, в одном рейде на Западном берегу разведчики «Нахаля» задержали 11 разыскиваемых и опросили около 80 жителей.','גדוד הסיור של חטיבת הנח״ל. לפי דיווח בתקשורת, בפשיטה אחת ביהודה ושומרון עצרו לוחמי הסיור של הנח״ל 11 מבוקשים ותחקרו כ-80 תושבים.'],
  gm:['Скрытная группа. Может опросить жителей дома: подсказки разведки, но это время и риск шума.','צוות חשאי. יכול לתחקר תושבי בית: רמזים מודיעיניים, אבל זה לוקח זמן ויש סיכון לרעש.'],src:'https://www.ynetnews.com/article/hj0000sjsigg'},
 gol:{c:'inf',n:['Голани','גולני'],sh:['Гл','גו'],men:16,q:.85,stl:2.2,loud:true,cap:.4,clr:.75,dr:2,st:[5,1,3],
  pub:['1-я пехотная бригада, создана в 1948 году, Северный военный округ. Батальоны 12-й «Барак», 13-й «Гидеон», 51-й.','חטיבת חי״ר 1, הוקמה ב-1948, פיקוד הצפון. גדודים 12 «ברק», 13 «גדעון», 51.'],
  gm:['Пехотный взвод: много стволов, оцепление и обыск. Без глушителей — шумный и заметный.','מחלקת חי״ר: הרבה קני ירי, כיתור וסריקה. בלי משתיקים — רועשת ובולטת.'],src:'https://en.wikipedia.org/wiki/Golani_Brigade'},
 tz:{c:'inf',n:['Цанханим','צנחנים'],sh:['Цн','צנ'],men:16,q:.85,stl:2.2,loud:true,cap:.4,clr:.75,dr:2,st:[5,1,3],
  pub:['35-я парашютно-десантная бригада (98-я дивизия). Батальоны 101-й, 202-й, 890-й. Создана в 1950-х, когда подразделение 101 объединили с 890-м батальоном.','חטיבת הצנחנים 35 (אוגדה 98). גדודים 101, 202, 890. הוקמה בשנות ה-50 מאיחוד יחידה 101 עם גדוד 890.'],
  gm:['Пехотный взвод: много стволов, оцепление и обыск. Без глушителей — шумный и заметный.','מחלקת חי״ר: הרבה קני ירי, כיתור וסריקה. בלי משתיקים — רועשת ובולטת.'],src:'https://en.wikipedia.org/wiki/35th_Paratroopers_Brigade_(Israel)'},
 gv:{c:'inf',n:['Гивати','גבעתי'],sh:['Гв','גב'],men:16,q:.85,stl:2.2,loud:true,cap:.4,clr:.75,dr:2,st:[5,1,3],
  pub:['84-я пехотная бригада, Южный военный округ. Батальоны «Шакед», «Цабар», «Ротем». По сообщению ЦАХАЛ, батальон «Цабар» в Газе обнаружил мастерскую по производству оружия.','חטיבת חי״ר 84, פיקוד הדרום. גדודים «שקד», «צבר», «רותם». לפי דיווח צה״ל, גדוד «צבר» איתר בעזה בית מלאכה לייצור אמצעי לחימה.'],
  gm:['Пехотный взвод: много стволов, оцепление и обыск. Без глушителей — шумный и заметный.','מחלקת חי״ר: הרבה קני ירי, כיתור וסריקה. בלי משתיקים — רועשת ובולטת.'],src:'https://en.wikipedia.org/wiki/Givati_Brigade'},
 nh:{c:'inf',n:['Нахаль','נח״ל'],sh:['Нх','נח'],men:16,q:.85,stl:2.2,loud:true,cap:.4,clr:.75,dr:2,ask:true,st:[5,1,3],
  pub:['933-я пехотная бригада, одна из пяти пехотных бригад ЦАХАЛ. Части бригады действуют на Западном берегу: «каждый день — от поиска оружия до задержаний и опросов на месте» (офицер бригады, Ynet).','חטיבת חי״ר 933, אחת מחמש חטיבות החי״ר של צה״ל. כוחות החטיבה פועלים ביהודה ושומרון: «כל יום — מחיפוש אמצעי לחימה ועד מעצרים ותחקורים בשטח» (קצין בחטיבה, ynet).'],
  gm:['Пехотный взвод. Может опросить жителей дома: подсказки разведки, но это время и риск шума.','מחלקת חי״ר. יכולה לתחקר תושבי בית: רמזים מודיעיניים, אבל זה לוקח זמן ויש סיכון לרעש.'],src:'https://en.wikipedia.org/wiki/Nahal_Brigade'},
 kf:{c:'inf',n:['Кфир','כפיר'],sh:['Кф','כפ'],men:16,q:.85,stl:2.2,loud:true,cap:.4,clr:.75,dr:2,cp:true,st:[5,1,3],
  pub:['900-я пехотная бригада, создана в 2005 году, по данным ЦАХАЛ — крупнейшая пехотная. Главная задача — борьба с террором в Иудее и Самарии: рейды, патрули, блокпосты, задержания. Батальоны «Нахшон», «Шимшон», «Харув», «Духифат», «Нецах Иехуда».','חטיבת חי״ר 900, הוקמה ב-2005, לפי צה״ל חטיבת החי״ר הגדולה ביותר. המשימה העיקרית — לוחמה בטרור ביהודה ושומרון: פשיטות, סיורים, מחסומים, מעצרים. גדודים «נחשון», «שמשון», «חרוב», «דוכיפת», «נצח יהודה».'],
  gm:['Пехотный взвод. Может поставить блокпост: вооружённых, которых поднимут по тревоге, задерживают на подходе.','מחלקת חי״ר. יכולה להציב מחסום: חמושים שמגויסים בכוננות נעצרים בדרך.'],src:'https://en.wikipedia.org/wiki/Kfir_Brigade'},
 car:{c:'bdr',n:['Каракаль','קרקל'],off:true,
  pub:['Первый смешанный (мужчины и женщины) батальон лёгкой пехоты, создан в 2004 году. Охраняет закреплённый участок границы с Египтом и, в отличие от другой пехоты, не наступает на чужую территорию.','גדוד חי״ר קל מעורב (גברים ונשים) הראשון, הוקם ב-2004. מגן על גזרה קבועה בגבול מצרים, ובניגוד לשאר החי״ר אינו מתמרן לשטח האויב.'],src:'https://en.wikipedia.org/wiki/Caracal_Battalion'},
 bar:{c:'bdr',n:['Бардалас','ברדלס'],off:true,
  pub:['Смешанный батальон лёгкой пехоты Корпуса охраны границ. Охраняет южную границу — участок Аравы на границе с Иорданией.','גדוד חי״ר קל מעורב במערך הגנת הגבולות. מגן על הגבול הדרומי — גזרת הערבה בגבול ירדן.'],src:'https://www.timesofisrael.com/co-ed-battalions-to-get-new-home-in-border-defense-force/'},
 ary:{c:'bdr',n:['Львы Иордана','אריות הירדן'],off:true,
  pub:['Смешанный батальон лёгкой пехоты Корпуса охраны границ, охраняет северную часть Иорданской долины.','גדוד חי״ר קל מעורב במערך הגנת הגבולות, מגן על צפון בקעת הירדן.'],src:'https://www.timesofisrael.com/co-ed-battalions-to-get-new-home-in-border-defense-force/'}};
const ABIL=t=>{const T=TU[t],a=[];
  a.push(HE?`${T.men} לוחמים`:`${T.men} бойцов`);a.push(T.loud?(HE?'בלי משתיקים':'без глушителей'):(HE?'משתיקים':'глушители'));
  if(T.veh)a.push(HE?'רכב אזרחי':'гражданская машина');if(T.sap)a.push(HE?'פירוק מטענים':'разминирование');
  if(T.atgm)a.push(HE?`טילים מונחים: ${T.atgm}`:`управляемых ракет: ${T.atgm}`);if(T.optic)a.push(HE?'אופטיקה רחוקה':'дальняя оптика');
  if(T.ask)a.push(HE?'תחקור תושבים':'опрос жителей');if(T.cp)a.push(HE?'מחסום':'блокпост');if(T.amb)a.push(HE?'מארבים':'засады');
  a.push(HE?`רחפנים: ${T.dr??3}`:`дронов: ${T.dr??3}`);return a.join(' · ');};
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);const rng=a=>a[0]===a[1]?String(a[0]):`${a[0]}–${a[1]}`;
const powerOf=t=>{const T=TU[t];return T.men*(T.q||1)*(T.uc?1.3:1)+(T.atgm?2:0);};
function loadTR(){let d=null;try{d=JSON.parse(localStorage.getItem(TRAIN_KEY)||'null');}catch(e){}
  if(!d||!d.seed)d={seed:1000+rnd(9000),diff:1,dens:'normal',sel:[],limit:false};d.sel=(d.sel||[]).filter(t=>TU[t]&&!TU[t].off);return d;}
function saveTR(){try{localStorage.setItem(TRAIN_KEY,JSON.stringify(TR));localStorage.setItem(MODE_KEY,MODE);}catch(e){}}
function setCity(seed,dens,g2){genCity(seed,dens,g2);buildNav();for(const k in AVC)delete AVC[k];if(mapCv)mapCv=drawMap();}
// units of a training operation, in the order they were chosen
function mkTrainUnits(sel){const cnt={};return sel.map((t,i)=>{const T=TU[t];cnt[t]=(cnt[t]||0)+1;const multi=sel.filter(x=>x===t).length>1;
  const call=L2(T.n)+(multi?(HE?' ':'-')+cnt[t]:''),sh=L2(T.sh)+(multi?cnt[t]:'');
  const u=squad('t'+i,call,sh,610+(i%4)*60,2035+Math.floor(i/4)*45,T.men,!!T.uc);
  Object.assign(u,{tt:t,cls:T.c,q:T.q||1,stl:T.stl||1,cap:T.cap,clr:T.clr||1,loud:!!T.loud,amb:T.amb||0,optic:!!T.optic,atgm:T.atgm||0,ask:!!T.ask,cpU:!!T.cp,drones:T.dr??3,sap:!!T.sap,veh:!!T.veh,carU:!!T.veh});return u;});}
// what the intelligence summary says (estimates, not the truth)
function mkIntel(ens,D,traps,ieds,r){const tot=ens.filter(e=>e.kind!=='look'&&e.kind!=='patrol').reduce((s,e)=>s+e.men,0)+ens.filter(e=>e.kind==='patrol').reduce((s,e)=>s+e.men,0);
  const lk=ens.filter(e=>e.kind==='look').length;const lo=Math.max(3,Math.round(tot*(.75+r()*.1))),hi=Math.round(tot*(1.15+r()*.15))+1;
  return{lo,hi,lk:[Math.max(0,lk-(r()<.5?1:0)),lk+(r()<.5?1:0)],traps:Object.keys(traps).length,ieds:ieds.length,mob:D,tot};}
function recommend(I){const E=(I.lo+I.hi)/2;const sel=['ym','yh',I.lk[1]>=2?'dv':'eg'];if(I.mob>=2)sel.push('kf');
  const add=['eg','sgol','ym','gv','mg','tz'];let i=0;const P=()=>sel.reduce((s,t)=>s+powerOf(t),0);
  while(P()<3.2*E&&sel.length<MAXG)sel.push(add[i++%add.length]);return sel;}
function checks(I,sel){const has=f=>sel.some(t=>f(TU[t],t));const out=[];
  out.push([has(T=>T.sap),HE?'חבלנים: מעבדה ומטענים בדלתות':'Сапёры: мастерская и ловушки на дверях',HE?'בלי חבלנים פיצוץ המעבדה ארוך ומסוכן יותר':'без сапёров подрыв мастерской дольше и опаснее']);
  if(I.lk[1]>=2)out.push([has(T=>T.uc||(T.stl||1)<1),HE?`צוות חשאי נגד תצפיתנים (${rng(I.lk)})`:`Скрытная группа против наблюдателей (${rng(I.lk)})`,HE?'בלי זה הכוננות תעלה מוקדם':'без неё тревогу поднимут рано']);
  out.push([has(T=>(T.cap||0)>=.55),HE?'צוות ללכידת «המהנדס» בחיים':'Группа для задержания «Инженера» живым',HE?'ימ״מ, דובדבן או אגוז':'ЯМАМ, Дувдеван или Эгоз']);
  out.push([sel.length>=3,HE?'מספיק צוותים לכיתור המנהרה':'Хватает групп, чтобы оцепить подземный ход',HE?'לפחות 3 צוותים קרקעיים':'нужно хотя бы 3 наземные группы']);
  if(I.mob>=2)out.push([has(T=>T.c==='inf')||sel.length>=5,HE?'עתודה נגד חמושים שיגויסו בכוננות':'Резерв против вооружённых, которых поднимут по тревоге',HE?'מחלקת חי״ר; לכפיר יש מחסום':'пехотный взвод; у «Кфира» есть блокпост']);
  return out;}
const ratioOf=(I,sel)=>sel.reduce((s,t)=>s+powerOf(t),0)/Math.max(1,(I.lo+I.hi)/2);
const codeTxt=s=>'R-'+s;
function trainParamsChanged(cityToo){if(cityToo)setCity(TR.seed,TR.dens,true);S=newState(TR);resetView();saveTR();showTrain();}
function tabs(){return`<div class="tabs"><button data-m="camp"${MODE==='camp'?' class="on"':''}>${HE?'מערכה':'Кампания'}</button><button data-m="train"${MODE==='train'?' class="on"':''}>${HE?'אימון':'Тренировка'}</button></div>`;}
function bindTabs(){document.querySelectorAll('#campDoc .tabs button').forEach(b=>b.onclick=()=>{const m=b.dataset.m;if(m===MODE)return;MODE=m;saveTR();
  if(m==='train'){setCity(TR.seed,TR.dens,true);S=newState(TR);resetView();showTrain();}else{setCity(SEED,'normal');S=newState();resetView();showCamp();}});}
function showTrain(){const I=S.intel,sel=TR.sel,h=[];const rec=recommend(I);const lim=TR.limit?rec.length:MAXG;const over=sel.length>lim;
  h.push(tabs()+`<div class="stamp">${HE?'אימון':'ТРЕНИРОВКА'}</div><h1>${HE?'מבצע אימון':'Тренировочная операция'}</h1>`);
  h.push(`<p class="meta">${HE?'בלי התקדמות: התוצאה לא משפיעה על המערכה. אותו קוד — אותה עיר ואותו אויב, אפשר לשחק אותו שוב או לתת לחבר.':'Без прокачки: результат не влияет на кампанию. Один код — один и тот же город и противник: можно переиграть или дать код другому.'}</p>`);
  h.push(`<h2>${HE?'פרמטרים':'Параметры'}</h2><div class="trow"><span>${HE?'קוד מבצע':'Код операции'}</span><span class="code"><input id="tSeed" inputmode="numeric" maxlength="4" value="${TR.seed}" aria-label="${HE?'קוד':'код'}"><button id="tNewSeed">${HE?'קוד חדש':'Новый код'}</button></span></div>`);
  h.push(`<div class="trow"><span>${HE?'קושי':'Сложность'}</span><span class="seg2">${DIFF.map((d,i)=>`<button data-d="${i}"${TR.diff===i?' class="on"':''}>${L2(d)}</button>`).join('')}</span></div>`);
  h.push(`<div class="trow"><span>${HE?'בנייה':'Застройка'}</span><span class="seg2">${Object.keys(DENS).map(k=>`<button data-dn="${k}"${TR.dens===k?' class="on"':''}>${L2(DENS[k])}</button>`).join('')}</span></div>`);
  const feat=[M.hills.length?(HE?'גבעות':'холмы'):'',M.wadi?(HE?'ואדי':'вади'):'',M.orch.length?(HE?'מטעים':'сады'):'',M.fields.length?(HE?'שדות':'поля'):'',M.diag?(HE?'כביש אלכסוני':'диагональная трасса'):''].filter(Boolean).join(', ');
  if(!M.classic)h.push(`<div class="tprev"><img id="tPrev" alt=""><div><b>${HE?'שטח':'Местность'}:</b> ${esc(L2(TOWNL[M.type]))}${feat?' · '+feat:''}<br><small>${HE?`מבנים: ${BL.length}`:`зданий: ${BL.length}`}</small></div></div>`);
  h.push(`<h2>${HE?'סיכום מודיעין':'Разведсводка'}</h2><ul>`+[
    HE?`חמושים: ${I.lo}–${I.hi} (הערכה)`:`Вооружённых: ${I.lo}–${I.hi} (оценка)`,
    HE?`תצפיתנים על גגות: ${rng(I.lk)}`:`Наблюдателей на крышах: ${rng(I.lk)}`,
    I.traps>2?(HE?'מטענים בדלתות: סבירים':'Ловушки на дверях: вероятны'):(HE?'מטענים בדלתות: אפשריים':'Ловушки на дверях: возможны'),
    HE?`מטענים ברחובות הראשיים: ${I.ieds>2?'כמה':'אפשריים'}`:`СВУ на главных улицах: ${I.ieds>2?'несколько':'возможны'}`,
    HE?'מנהרה: סבירה':'Подземный ход: вероятен',
    HE?`גיוס מקומיים בכוננות: ${['נמוך','בינוני','גבוה','גבוה מאוד'][I.mob]}`:`Готовность местных вооружиться по тревоге: ${['низкая','средняя','высокая','очень высокая'][I.mob]}`].map(x=>`<li>${x}</li>`).join('')+'</ul>');
  const R=ratioOf(I,sel),lvl=R<2?0:R<3?1:R<4.5?2:3;const lt=[['недостаточно','לא מספיק'],['мало','מעט'],['достаточно','מספיק'],['с запасом','עם עודף']][lvl];
  h.push(`<h2>${HE?'המלצת המפקדה':'Рекомендация штаба'}</h2><p>${HE?'יחס כוחות להסתערות על מבנים מוגנים: לפי הכלל הקלסי צריך לפחות 3:1, בעיר בדרך כלל יותר.':'Соотношение сил для штурма обороняемых зданий: по классическому правилу нужно не меньше 3:1, в городе обычно больше.'}</p>`);
  h.push(`<div class="ratio"><div class="bar"><i style="width:${Math.min(100,R/6*100)}%" class="l${lvl}"></i><b style="inset-inline-start:50%"></b></div><span>${R.toFixed(1).replace('.',HE?'.':',')} : 1 · ${L2(lt)}</span></div>`);
  h.push(`<ul class="chk">${checks(I,sel).map(([ok,t,why])=>`<li class="${ok?'ok':'no'}">${ok?'✓':'✗'} ${t}${ok?'':` <small>— ${why}</small>`}</li>`).join('')}</ul>`);
  h.push(`<p class="meta">${HE?'מומלץ':'Рекомендовано'}: ${rec.map(t=>esc(L2(TU[t].n))).join(', ')}</p><button class="go alt" id="tRec">${HE?'לקחת את ההרכב המומלץ':'Взять рекомендованный состав'}</button>`);
  h.push(`<label class="tog"><input type="checkbox" id="tLim"${TR.limit?' checked':''}> ${HE?`מגבלת מפקדה: לא יותר מ-${rec.length} צוותים`:`Лимит штаба: не больше ${rec.length} групп`}</label>`);
  h.push(`<h2>${HE?`הכוחות שלכם · ${sel.length} מתוך ${lim}`:`Ваши силы · ${sel.length} из ${lim}`}</h2>`);
  h.push(sel.length?`<div class="selc">${sel.map((t,i)=>`<button data-rm="${i}">${esc(L2(TU[t].n))} ✕</button>`).join('')}</div>`:`<p class="meta">${HE?'לא נבחרו צוותים. הוסיפו מהרשימה למטה.':'Группы не выбраны. Добавьте из списка ниже.'}</p>`);
  if(over)h.push(`<p class="warn">${HE?'יותר צוותים ממגבלת המפקדה.':'Групп больше, чем разрешает штаб.'}</p>`);
  h.push(`<p class="meta">${HE?'תמיד זמינים: הכטב״ם «זיק», מסוק הקרב «שרף», מסוקי הפינוי «ינשוף», שני כלבי «עוקץ».':'Всегда в распоряжении: беспилотник «Ястреб», ударный вертолёт «Молот», вертолёты эвакуации «Ангел», две собаки «Окец».'}</p>`);
  h.push(`<button class="go" id="tGo"${!sel.length||over?' disabled':''}>${HE?'לפקודת המבצע':'К боевому приказу'}</button>`);
  h.push(`<h2>${HE?'רשימת הכוחות':'Список подразделений'}</h2><p class="meta">${HE?'המידע על היחידות — ממקורות פתוחים בלבד. מספר הלוחמים והמאפיינים במשחק — מוסכמות של המשחק.':'Сведения о подразделениях — только из открытых источников. Численность и характеристики в игре — игровые условности.'}</p>`);
  for(const [c,cn] of UCAT){h.push(`<h3>${L2(cn)}</h3>`);
    for(const t of Object.keys(TU).filter(k=>TU[k].c===c)){const T=TU[t];const n=sel.filter(x=>x===t).length;
      h.push(`<div class="ucard${T.off?' off':''}"><div class="uh"><b>${esc(L2(T.n))}</b>${T.off?`<small>${HE?'לא משתתף בפשיטות':'в рейдах не участвует'}</small>`:`<button data-add="${t}"${sel.length>=lim||n>=2?' disabled':''}>${n?`+ (${n})`:'+'}</button>`}</div>`);
      if(!T.off)h.push(`<div class="us"><span>${HE?'אש':'Огонь'} ${stars(T.st[0])}</span><span>${HE?'חשאיות':'Скрытность'} ${stars(T.st[1])}</span><span>${HE?'הסתערות':'Штурм'} ${stars(T.st[2])}</span></div><div class="ug"><b>${HE?'במשחק:':'В игре:'}</b> ${esc(L2(T.gm))} <small>${ABIL(t)}</small></div>`);
      h.push(`<details><summary>${HE?'ממקורות פתוחים':'Из открытых источников'}</summary><p>${esc(L2(T.pub))} <a href="${T.src}" target="_blank" rel="noopener">${HE?'מקור':'источник'}</a></p></details></div>`);}}
  const d=$('#campDoc');d.innerHTML=h.join('');$('#camp').hidden=false;bindTabs();
  const pv=$('#tPrev');if(pv&&mapCv){const c=document.createElement('canvas');c.width=220;c.height=Math.round(220*H/W);c.getContext('2d').drawImage(mapCv,0,0,c.width,c.height);pv.src=c.toDataURL('image/jpeg',.82);}
  const sv=$('#tSeed');sv.onchange=()=>{const v=parseInt(sv.value.replace(/\D/g,''),10);if(v>=1000&&v<=9999&&v!==TR.seed){TR.seed=v;trainParamsChanged(true);}else sv.value=TR.seed;};
  $('#tNewSeed').onclick=()=>{TR.seed=1000+rnd(9000);trainParamsChanged(true);};
  d.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{TR.diff=+b.dataset.d;trainParamsChanged(false);});
  d.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>{TR.dens=b.dataset.dn;trainParamsChanged(true);});
  d.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{TR.sel.push(b.dataset.add);trainParamsChanged(false);});
  d.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{TR.sel.splice(+b.dataset.rm,1);trainParamsChanged(false);});
  $('#tRec').onclick=()=>{TR.sel=rec.slice();trainParamsChanged(false);};
  $('#tLim').onchange=e=>{TR.limit=e.target.checked;saveTR();showTrain();};
  $('#tGo').onclick=()=>{if(!TR.sel.length)return;$('#camp').hidden=true;setBriefHead();$('#bGo').textContent=HE?'התחל מבצע':'Начать операцию';$('#bEnd').hidden=true;$('#brief').hidden=false;$('#brief').scrollTop=0;};}
let BRIEF0=null;
function setBriefBody(){const s=$('#bSit'),u=$('#bUnits');if(!s||!u)return;if(!BRIEF0)BRIEF0=[s.innerHTML,u.innerHTML];
  if(!S.train){s.innerHTML=BRIEF0[0];u.innerHTML=BRIEF0[1];return;}const I=S.intel;
  s.textContent=HE?`${L2(TOWN[M.type]||['Город','העיר'])} דיר נביל. חוליה של ארגון «חדיד», לפי הערכת המודיעין ${I.lo}–${I.hi} חמושים, מתכננת סדרת פיגועים. מפקד החוליה, המכונה «המהנדס», מנהל ייצור מטענים. בבניינים מסביב ישנים אזרחים. תצפיתנים על הגגות: ${rng(I.lk)}. סבירה מנהרה.`:`${L2(TOWN[M.type]||['Город','העיר'])} Дейр-Набиль. Ячейка группировки «Хадид», по оценке разведки ${I.lo}–${I.hi} вооружённых, готовит серию терактов. Командир ячейки, кличка «Инженер», руководит изготовлением взрывных устройств. В зданиях вокруг спят мирные жители. Наблюдателей на крышах: ${rng(I.lk)}. Вероятен подземный ход.`;
  const by={};infs().forEach(x=>{(by[x.tt]=by[x.tt]||[]).push(x.call);});
  u.innerHTML=Object.keys(by).map(t=>`<li><b>${esc(by[t].join(', '))}</b>: ${esc(L2(TU[t].gm))} <small>(${ABIL(t)})</small></li>`).join('')+`<li>${HE?'זיק, שרף, ינשוף, כלבי עוקץ — כמו בפקודה הרגילה.':'Ястреб, Молот, Ангел, собаки «Окец» — как в обычном приказе.'}</li>`;}
// Maglan: guided missile at a firing point
function atgmExec(u,b){if(!(u.atgm>0)){say(u,HE?`צפע, כאן ${u.call}. אין טילים.`:`Кобра-6, я ${u.call}. Ракет нет.`,[],{front:true});return;}
  const B=BN(b);if(Math.hypot(u.x-B.cx,u.y-B.cy)>700){say(u,HE?`צפע, כאן ${u.call}. מבנה ${b} רחוק מדי, צריך להתקרב.`:`Кобра-6, я ${u.call}. Здание ${b} слишком далеко, нужно подойти ближе.`,[],{front:true});return;}
  u.atgm--;u.atgmT=25;u.atgmB=b;say(u,HE?`צפע, כאן ${u.call}. רות, טיל לעמדה במבנה ${b}. שיגור בעוד חצי דקה.`:`Кобра-6, я ${u.call}. Принял, ракета по огневой точке в здании ${b}. Пуск через полминуты.`,[],{front:true,known:'st'});}
function atgmHit(u,b){raiseAlarm();let k=0,left=1+(Math.random()<.5?1:0);
  for(const e of alive()){if(left<=0)break;if(e.bld!==b||e.mv)continue;if(!(e.roof||e.alert||e.cont.length))continue;let n=Math.min(left,e.men-(e.leader?1:0));if(n<=0)continue;e.men-=n;k+=n;left-=n;if(e.men<=0)e.gone=true;}
  S.stats.ek+=k;u.kills=(u.kills||0)+k;let civ=0;if(S.civ[b]>0&&Math.random()<.35){addCivW(b);civ=1;}
  say(u,HE?`צפע, כאן ${u.call}. פגיעה במבנה ${b}. ${k?`נוטרלו מחבלים: ${k}.`:'אין תוצאה נראית.'}${civ?' ייתכן שנפגעו אזרחים.':''} נותרו טילים: ${u.atgm}.`:`Кобра-6, я ${u.call}. Попадание в здание ${b}. ${k?`Нейтрализовано боевиков: ${k}.`:'Результата не наблюдаем.'}${civ?' Возможно, пострадали мирные.':''} Осталось ракет: ${u.atgm}.`,k?[bChip(b,'hos')]:[],{front:true,urgent:!!civ,ek:k});}
// Nahal: questioning residents of a house
const ASK_ARR=u=>HE?`צפע, כאן ${u.call}. ליד מבנה ${u.tb}, מתחקרים את התושבים.`:`Кобра-6, я ${u.call}. У здания ${u.tb}, опрашиваем жильцов.`;
function askResult(u,b){if(!S.civ[b]){say(u,HE?`צפע, כאן ${u.call}. במבנה ${b} אין דיירים, אין את מי לתחקר.`:`Кобра-6, я ${u.call}. В здании ${b} жильцов нет, опросить некого.`,[],{known:'st',front:true});return;}
  if(!S.alarm&&Math.random()<.2){const e=alive().filter(x=>!x.alert).sort((a,c)=>hyp(a,u)-hyp(c,u))[0];if(e&&hyp(e,u)<350)scheduleAlarm(e,90);}
  const x=Math.random();let t,ch=[];
  if(x<.4&&S.lab==='intact'){t=HE?`שכנים מספרים: במבנה ${S.Wk} עובדים בלילות, יש ריח כימי.`:`Соседи говорят: в здании ${S.Wk} работают по ночам, пахнет химией.`;ch=[bChip(S.Wk,'unk')];}
  else if(x<.7){const n=pick([S.L,S.R]);t=HE?`תושבים ראו חמושים נכנסים למבנה ${n}.`:`Жильцы видели, как в здание ${n} заходили вооружённые.`;ch=[bChip(n,'unk')];}
  else if(x<.82){t=HE?`שכנים מתלוננים: בחצר של מבנה ${S.T} חפרו חודשים.`:`Соседи жалуются: во дворе здания ${S.T} месяцами что-то копали.`;ch=[bChip(S.T,'tun')];}
  else t=HE?'התושבים שותקים, אומרים שלא יודעים כלום.':'Жильцы молчат, говорят, что ничего не знают.';
  say(u,HE?`צפע, כאן ${u.call}. התחקור במבנה ${b} הסתיים. ${t} עבור.`:`Кобра-6, я ${u.call}. Опрос в здании ${b} закончен. ${t} Приём.`,ch,{known:'st',front:true});}
// Kfir: a checkpoint stops armed men called out by the alarm
const cpActive=()=>infs().filter(u=>u.cpOn&&['hold','incover','cover'].includes(u.st)&&u.men>2);


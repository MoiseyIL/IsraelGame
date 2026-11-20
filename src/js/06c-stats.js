/* ---------- characteristics: one table for every unit, ours and the enemy's ---------- */
// Game conventions on a 1..10 scale, not real data. This table is the single source: the battle parameters
// (accuracy, how often the group is hit, how easily it is spotted, pace, clearing time, capture chance,
// observation time) are all computed from it, so what the catalog shows is what happens in the game.
const CH_K=[['Огневая мощь','עוצמת אש','Firepower'],['Стойкость','עמידות','Resilience'],['Скрытность','חשאיות','Stealth'],['Скорость','מהירות','Speed'],['Штурм','הסתערות','Assault'],['Захват','לכידה','Capture'],['Разведка','סיור','Recon']];
// what each characteristic is made of in the game (shown once, above the catalog)
const CH_SUB=[
  ['огонь всей группы: численность × меткость; чем больше, тем быстрее противник несёт потери','האש של כל הצוות: מספר הלוחמים × דיוק; ככל שגבוה יותר, האויב סופג אבדות מהר יותר','fire of the whole group: numbers × accuracy; the higher, the faster the enemy takes losses'],
  ['как часто попадают по группе и как быстро падает её дух при потерях','באיזו תדירות פוגעים בצוות ועד כמה המורל שלו יורד עם אבדות','how often the group is hit and how fast its morale drops with losses'],
  ['как легко группу замечают наблюдатели и патрули','באיזו קלות תצפיתנים וסיורים מבחינים בצוות','how easily lookouts and patrols spot the group'],
  ['скорость передвижения пешком','מהירות התנועה ברגל','pace on foot'],
  ['время зачистки здания, потери при входе, бой внутри здания','זמן טיהור מבנה, אבדות בכניסה, קרב בתוך מבנה','time to clear a building, losses at the entrance, fighting inside'],
  ['шанс взять противника живым','הסיכוי לתפוס את האויב בחיים','chance of taking the enemy alive'],
  ['как быстро группа ведёт скрытное наблюдение за зданием','כמה מהר הצוות מסיים תצפית חשאית על מבנה','how fast the group completes covert observation of a building']];
// weights of the final power score
const CH_W=[.3,.2,.1,.1,.15,.05,.1];
//        fire res stl spd asl cap rec
const CH={
  ym:  [7,6,6,6,9,9,5], dv:[7,6,8,7,8,9,7], mg:[6,7,7,6,4,5,9], eg:[7,7,8,7,7,6,7], yh:[6,5,6,5,6,5,5],
  sgol:[7,6,7,7,6,6,7], stz:[7,6,7,7,6,6,7], sgv:[7,6,7,7,6,6,7], snh:[7,6,7,7,6,6,7],
  gol: [9,5,3,4,6,4,4], tz:[9,5,3,4,6,4,4], gv:[9,5,3,4,6,4,4], nh:[9,5,3,4,6,4,4], kf:[9,5,3,4,6,4,4],
  // Russian Army (missions)
  sso: [7,8,8,7,8,5,7], spn:[7,7,7,7,7,5,7], vdv:[10,6,3,6,7,4,4], mp:[9,5,3,5,7,4,4], msv:[9,5,3,4,5,4,4], isp:[6,5,5,5,5,4,5],
  shturm:[8,5,3,5,8,3,4], stormv:[7,3,2,5,6,2,2], bars:[7,4,3,4,4,3,3], sobr:[7,6,5,6,8,7,4], razv:[7,6,7,7,6,5,7], snip:[4,5,8,6,2,2,9],
  // South Africa (missions)
  za_stf:[7,6,6,6,9,8,5], za_sf:[7,7,8,7,7,6,7], za_pf:[6,6,8,7,5,5,8], za_para:[9,6,3,6,7,4,4], za_inf:[8,5,3,4,5,4,4], za_eng:[6,5,5,5,5,4,5]};
// special abilities: tags, not numbers; each adds a little to the final score (no more than +5)
function chTags(t){const T=TU[t]||ENU[t]||{},a=[];
  if(T.uc)a.push([['маскировка под местных','הסוואה כמקומיים','disguised as locals'],1]);if(T.veh)a.push([['машина','רכב','car'],1]);
  if(T.atgm)a.push([['ракеты','טילים','missiles'],2]);if(T.optic)a.push([['оптика','אופטיקה','optics'],1]);if(T.sap)a.push([['сапёры','חבלנים','sappers'],2]);
  if(T.ask)a.push([['опрос жителей','תחקור תושבים','questioning residents'],1]);if(T.cp)a.push([['блокпост','מחסום','checkpoint'],1]);if(T.amb)a.push([['засады','מארבים','ambushes'],1]);return a;}
function chPower(t){const c=CH[t];if(!c)return 0;const b=Math.min(5,chTags(t).reduce((s,x)=>s+x[1],0));return Math.round(10*c.reduce((s,v,i)=>s+v*CH_W[i],0))+b;}
// battle parameters from the table
const fpOf=f=>.168*f*f; // fire of the whole group at full strength, in "rifle equivalents"
function mechOf(t,men){const [f,r,s,v,a,c,k]=CH[t];return{q:+(fpOf(f)/men).toFixed(3),rk:+(1.6-.1*r).toFixed(2),mk:+(1.5-.1*r).toFixed(2),stl:+(2**((6-s)/3)).toFixed(2),
  spd:+(.6+.08*v).toFixed(2),clr:+((1.5-.08*a)*(men>=12?.75:1)).toFixed(2),ent:+(1.5-.1*a).toFixed(2),cq:+(.7+.05*a).toFixed(2),cap:+(.1+.07*c).toFixed(2),rc:+(1.5-.1*k).toFixed(2)};}
// catalog block: seven bars and the final score
function chHTML(t){const c=CH[t];if(!c)return'';const tg=chTags(t);
  return`<div class="chs">${c.map((v,i)=>`<span class="cn">${esc(L2(CH_K[i]))}</span><span class="cb"><i style="width:${v*10}%"></i></span><span class="cv">${v}</span>`).join('')}</div>`
    +armsHTML(t)+`<div class="cpw"><span>${tg.length?esc(tg.map(x=>L2(x[0])).join(' · ')):''}</span><b>${T3('Сила','עוצמה','Power')} ${chPower(t)}</b></div>`;}
function chLegend(){return`<details class="chl"><summary>${T3('Что означают характеристики','מה המאפיינים אומרים','What the ratings mean')}</summary><ul>${CH_K.map((k,i)=>`<li><b>${esc(L2(k))}</b> (${Math.round(CH_W[i]*100)}%) — ${esc(L2(CH_SUB[i]))}</li>`).join('')}</ul><p>${T3('Сила — итог из семи характеристик, в скобках их вес; особые возможности добавляют до 5 очков. Шкала 1–10 и все числа — игровые условности.','עוצמה — סיכום שבעת המאפיינים, בסוגריים המשקל של כל אחד; יכולות מיוחדות מוסיפות עד 5 נקודות. הסולם 1–10 וכל המספרים — מוסכמות של המשחק.','Power is the total of the seven ratings, with each weight in brackets; special abilities add up to 5 points. The 1–10 scale and all the numbers are game conventions.')}</p></details>`;}

/* ---------- weapons of each unit, and how each country's army fights ---------- */
// Kit, per group: mg — machine guns; rk — rockets (RPG-7, Matador); gl — 40 mm grenade volleys (GP-25/30 under the barrel,
// Milkor MGL); mk — a marksman or sniper. The weapon names in ARMS come from open sources; the counts are game conventions.
const KIT={
  // ours. Infantry platoons: Tavor X95, Negev, Matador; snipers in each company
  gol:{mg:2,rk:3,gl:0,mk:1},tz:{mg:2,rk:3,gl:0,mk:1},gv:{mg:2,rk:3,gl:0,mk:1},nh:{mg:2,rk:3,gl:0,mk:1},kf:{mg:2,rk:3,gl:0,mk:1},
  sgol:{mg:1,rk:1,gl:0,mk:1},stz:{mg:1,rk:1,gl:0,mk:1},sgv:{mg:1,rk:1,gl:0,mk:1},snh:{mg:1,rk:1,gl:0,mk:1},
  eg:{mg:1,rk:1,gl:0,mk:1},mg:{mg:1,rk:0,gl:0,mk:1},dv:{mg:0,rk:0,gl:0,mk:0},ym:{mg:0,rk:0,gl:0,mk:1},yh:{mg:1,rk:0,gl:0,mk:0},
  csq:{mg:1,rk:1,gl:0,mk:0}, // campaign squads Cobra-1/2 (8 men)
  // Russia: AK-74M, PKP/PKM or RPK-74M, RPG-7, GP-25/30 under the barrel, SVD
  msv:{mg:2,rk:4,gl:3,mk:1},vdv:{mg:2,rk:4,gl:3,mk:1},mp:{mg:2,rk:4,gl:3,mk:1},shturm:{mg:2,rk:4,gl:3,mk:1},
  stormv:{mg:1,rk:2,gl:1,mk:0},bars:{mg:1,rk:2,gl:2,mk:0},sso:{mg:1,rk:1,gl:1,mk:1},spn:{mg:1,rk:1,gl:1,mk:1},
  razv:{mg:1,rk:1,gl:1,mk:1},snip:{mg:0,rk:0,gl:0,mk:1},sobr:{mg:0,rk:0,gl:0,mk:1},isp:{mg:0,rk:0,gl:0,mk:0},
  // South Africa: R4 rifles, SS-77 machine guns, Milkor MGL six-shot 40 mm launchers
  za_inf:{mg:2,rk:0,gl:4,mk:0},za_para:{mg:2,rk:0,gl:4,mk:0},za_sf:{mg:1,rk:0,gl:2,mk:1},za_pf:{mg:1,rk:0,gl:1,mk:1},za_stf:{mg:0,rk:0,gl:0,mk:1},za_eng:{mg:1,rk:0,gl:0,mk:0},
  // insurgents: a bigger group has a machine gun and an RPG
  ins3:{mg:1,rk:1,gl:0,mk:0},ins:{mg:0,rk:0,gl:0,mk:0}};
// named weapons, only where open sources name them
const ARMS={
  idf:['Tavor X95, Negev, «Матадор»','Tavor X95, נגב, «מטאדור»','Tavor X95, Negev, Matador'],
  idfr:['Tavor X95, Negev','Tavor X95, נגב','Tavor X95, Negev'],
  ru:['АК-74М, ПКП/ПКМ или РПК-74М, РПГ-7, ГП-25/30, СВД','AK-74M, PKP/PKM או RPK-74M, RPG-7, GP-25/30, SVD','AK-74M, PKP/PKM or RPK-74M, RPG-7, GP-25/30, SVD'],
  ru2:['АК-74М, ПКП/ПКМ или РПК-74М, РПГ-7, ГП-25/30','AK-74M, PKP/PKM או RPK-74M, RPG-7, GP-25/30','AK-74M, PKP/PKM or RPK-74M, RPG-7, GP-25/30'],
  za:['R4, SS-77, Milkor MGL','R4, SS-77, Milkor MGL','R4, SS-77, Milkor MGL']};
const ARMS_OF={gol:'idf',tz:'idf',gv:'idf',nh:'idf',kf:'idf',sgol:'idfr',stz:'idfr',sgv:'idfr',snh:'idfr',eg:'idfr',
  msv:'ru',vdv:'ru',mp:'ru',shturm:'ru',stormv:'ru2',bars:'ru2',razv:'ru',za_inf:'za',za_para:'za',za_pf:'za'};
function kitKey(s){if(s.type==='inf')return s.tt||({k1:'csq',k2:'csq',k3:'yh',dv:'dv'})[s.id]||'csq';if(s.kind==='army')return s.rt;return(s.kind==='leader'||s.kind==='rest')&&s.max>=3?'ins3':'ins';}
const kitOf=s=>KIT[kitKey(s)]||KIT.ins;
// catalog line: what the group carries
function armsHTML(t){const k=KIT[t];if(!k)return'';const a=[];
  if(k.mg)a.push(T3(`пулемётов ${k.mg}`,`מקלעים: ${k.mg}`,`machine guns ${k.mg}`));if(k.rk)a.push(TU[t]?T3(`выстрелов «Матадор» ${k.rk}`,`רקטות מטאדור: ${k.rk}`,`Matador rounds ${k.rk}`):T3(`выстрелов РПГ ${k.rk}`,`רקטות RPG: ${k.rk}`,`RPG rounds ${k.rk}`));
  if(k.gl)a.push(T3(`залпов 40-мм гранатомёта ${k.gl}`,`מטחי מטול 40 מ״מ: ${k.gl}`,`40 mm grenade volleys ${k.gl}`));if(k.mk)a.push(T3('снайпер','צלף','sniper'));
  const nm=ARMS_OF[t]?L2(ARMS[ARMS_OF[t]])+' · ':'';return`<div class="arms"><b>${T3('Оружие:','נשק:','Weapons:')}</b> ${esc(nm)}${a.length?esc(a.join(' · ')):T3('только стрелковое','נשק קל בלבד','small arms only')}</div>`;}
// 40 mm grenades: lobbed over cover and into windows, so they reach a group that rifles cannot
function glFire(s,tgt,dt,b){const k=kitOf(s);if(!k.gl||s.men<2)return;if(s.glN==null)s.glN=k.gl;if(s.glN<=0)return;
  s.glT=(s.glT==null?10+Math.random()*20:s.glT)-dt;if(s.glT>0)return;s.glT=35+Math.random()*20;s.glN--;
  tgt.acc+=.3+(b?.15:0);tgt.sup=Math.min(100,(tgt.sup||0)+25);if(b&&!(isOur(s)&&BN(b)&&BN(b).prot))bHit(b,6,45,s);}

// ---- how each country fights (missions) ----
// Russia, from open analyses of the war in Ukraine: troops are split into line, assault, specialised and expendable ones;
// expendable groups go first and reveal the defence, assault groups follow; heavy losses are accepted; small groups
// try to slip through gaps. South Africa: a small professional army; the infantry section works as machine-gun groups
// and a rifle group with a grenade launcher (fire and movement); here it is played cautiously — reconnaissance first,
// bounds near the enemy, losses avoided. The South African part is a game interpretation: open sources describe the
// weapons and the units, not a detailed doctrine.
const TAC={
  ru:{wd:.25,wdX:.1,boundM:150,boundS:8,near:250,supStop:80,lead:["stormv","bars"]},
  za:{wd:.4,wdX:.4,boundM:100,boundS:15,near:350,supStop:85,lead:["za_pf","za_sf"]}};
const tacOf=()=>TAC[(S&&S.nation)||'ru']||TAC.ru;
const ARMY_BASE=1.6; // the same walking pace as our teams at the fast pace in town
// near our teams the army moves by bounds; far from them it simply walks
const armyNearUs=(e,T)=>infs().some(u=>u.men>0&&Math.hypot(u.x-e.x,u.y-e.y)<T.near);

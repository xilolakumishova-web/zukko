/* Ingliz tili savollari */
(function(){
'use strict';
const {ri, pick, shuffle, mcq} = Z;
const Q = (q, correct, distract, exp, extra) => Object.assign({q, exp}, mcq(correct, distract, String), extra||{});

/* So'zlar: [inglizcha, emoji, o'zbekcha, kategoriya] */
const W = [
 ['apple','🍎','olma','food'],['banana','🍌','banan','food'],['grapes','🍇','uzum','food'],['lemon','🍋','limon','food'],['cherry','🍒','olcha','food'],['watermelon','🍉','tarvuz','food'],['strawberry','🍓','qulupnay','food'],['carrot','🥕','sabzi','food'],['tomato','🍅','pomidor','food'],['potato','🥔','kartoshka','food'],['bread','🍞','non','food'],['cheese','🧀','pishloq','food'],['egg','🥚','tuxum','food'],['milk','🥛','sut','food'],['cake','🎂','tort','food'],['honey','🍯','asal','food'],['onion','🧅','piyoz','food'],['corn','🌽','makkajo\'xori','food'],['pear','🍐','nok','food'],['peach','🍑','shaftoli','food'],
 ['cat','🐱','mushuk','animal'],['dog','🐶','it','animal'],['horse','🐴','ot','animal'],['cow','🐮','sigir','animal'],['sheep','🐑','qo\'y','animal'],['rabbit','🐰','quyon','animal'],['lion','🦁','sher','animal'],['tiger','🐯','yo\'lbars','animal'],['bear','🐻','ayiq','animal'],['monkey','🐵','maymun','animal'],['elephant','🐘','fil','animal'],['camel','🐫','tuya','animal'],['fish','🐟','baliq','animal'],['bird','🐦','qush','animal'],['owl','🦉','boyo\'g\'li','animal'],['frog','🐸','qurbaqa','animal'],['snake','🐍','ilon','animal'],['mouse','🐭','sichqon','animal'],['wolf','🐺','bo\'ri','animal'],['fox','🦊','tulki','animal'],['turtle','🐢','toshbaqa','animal'],['bee','🐝','ari','animal'],['butterfly','🦋','kapalak','animal'],['duck','🦆','o\'rdak','animal'],['chicken','🐔','tovuq','animal'],['giraffe','🦒','jirafa','animal'],
 ['sun','☀️','quyosh','nature'],['moon','🌙','oy','nature'],['star','⭐','yulduz','nature'],['tree','🌳','daraxt','nature'],['flower','🌸','gul','nature'],['rain','🌧️','yomg\'ir','nature'],['snow','❄️','qor','nature'],['cloud','☁️','bulut','nature'],['fire','🔥','olov','nature'],['mountain','⛰️','tog\'','nature'],['sea','🌊','dengiz','nature'],['leaf','🍃','barg','nature'],
 ['book','📕','kitob','school'],['pen','🖊️','ruchka','school'],['pencil','✏️','qalam','school'],['bag','🎒','sumka','school'],['ruler','📏','chizg\'ich','school'],['scissors','✂️','qaychi','school'],['computer','💻','kompyuter','school'],['clock','⏰','soat','school'],['teacher','👩‍🏫','o\'qituvchi','school'],['globe','🌍','globus','school'],
 ['house','🏠','uy','home'],['door','🚪','eshik','home'],['bed','🛏️','karavot','home'],['chair','🪑','stul','home'],['key','🔑','kalit','home'],['lamp','💡','chiroq','home'],['phone','📱','telefon','home'],['cup','☕','piyola','home'],['window','🪟','deraza','home'],
 ['car','🚗','mashina','transport'],['bus','🚌','avtobus','transport'],['train','🚆','poyezd','transport'],['plane','✈️','samolyot','transport'],['ship','🚢','kema','transport'],['bike','🚲','velosiped','transport'],['rocket','🚀','raketa','transport'],
 ['ball','⚽','to\'p','toys'],['kite','🪁','varrak','toys'],['doll','🪆','qo\'g\'irchoq','toys'],['gift','🎁','sovg\'a','toys'],['balloon','🎈','shar','toys'],
 ['hand','✋','qo\'l','body'],['eye','👁️','ko\'z','body'],['ear','👂','quloq','body'],['nose','👃','burun','body'],['foot','🦶','oyoq (panja)','body'],['tooth','🦷','tish','body'],['heart','❤️','yurak','body'],
 ['hat','👒','shlyapa','clothes'],['shoes','👟','poyabzal','clothes'],['dress','👗','ko\'ylak','clothes'],['shirt','👕','futbolka','clothes'],['socks','🧦','paypoq','clothes'],['glasses','👓','ko\'zoynak','clothes'],['umbrella','☂️','soyabon','clothes']
];
const CAT_UZ = {food:'Ovqat va mevalar',animal:'Hayvonlar',nature:'Tabiat',school:'Maktab',home:'Uy',transport:'Transport',toys:'O\'yinchoqlar',body:'Tana a\'zolari',clothes:'Kiyimlar'};
Z.WORDS = W;

function vocab(lv){
  const w = pick(W); const others = shuffle(W.filter(x=>x!==w));
  const same = others.filter(x=>x[3]===w[3]).concat(others);
  const t = lv===1 ? ri(0,1) : lv===2 ? ri(0,3) : ri(2,4);
  if (t===0) return Q(`<span style="font-size:72px">${w[1]}</span>\nThis is ...`, w[0], same.slice(0,3).map(x=>x[0]), `${w[1]} — ${w[0]} (${w[2]})`, {speak:w[0]});
  if (t===1) return Q(`<b>"${w[0]}"</b> so'zining tarjimasi qaysi?`, w[2], same.slice(0,3).map(x=>x[2]), `${w[0]} — ${w[2]} ${w[1]}`, {speak:w[0]});
  if (t===2) return Q(`<b>"${w[2]}"</b> ingliz tilida qanday bo'ladi?`, w[0], same.slice(0,3).map(x=>x[0]), `${w[2]} — ${w[0]} ${w[1]}`, {speak:w[0]});
  if (t===3){ // which is not in category
    const cat = w[3]; const inCat = shuffle(W.filter(x=>x[3]===cat && x!==w)).slice(0,3); const odd = pick(W.filter(x=>x[3]!==cat));
    return Q(`Qaysi so'z boshqalariga <b>mos kelmaydi</b>?`, odd[0], inCat.map(x=>x[0]), `${inCat.map(x=>x[0]).join(', ')} — ${CAT_UZ[cat].toLowerCase()}. "${odd[0]}" (${odd[2]}) esa boshqa guruhdan.`);
  }
  // spelling
  const word = w[0]; if (word.length<4) return vocab(lv);
  const i = ri(1, word.length-2); const wrongs = new Set();
  const swap = word.slice(0,i-1)+word[i]+word[i-1]+word.slice(i+1);
  if (swap!==word) wrongs.add(swap);
  wrongs.add(word.slice(0,i)+word.slice(i+1));
  wrongs.add(word.slice(0,i)+word[i]+word.slice(i));
  const vow='aeiou'; const vi=[...word].findIndex(c=>vow.includes(c)); if (vi>=0){ const r=pick([...vow].filter(c=>c!==word[vi])); wrongs.add(word.slice(0,vi)+r+word.slice(vi+1)); }
  return Q(`${w[1]} — <b>${w[2]}</b>. To'g'ri yozilganini toping:`, word, [...wrongs].filter(x=>x!==word), `To'g'ri yozilishi: ${word}`, {speak:word});
}

/* Ko'plik */
const PL = [['box','boxes','-x bilan tugasa +es'],['bus','buses','-s bilan tugasa +es'],['dish','dishes','-sh bilan tugasa +es'],['watch','watches','-ch bilan tugasa +es'],['tomato','tomatoes','-o bilan tugasa ko\'pincha +es'],['potato','potatoes','-o bilan tugasa ko\'pincha +es'],['baby','babies','undosh + y → ies'],['city','cities','undosh + y → ies'],['strawberry','strawberries','undosh + y → ies'],['toy','toys','unli + y → faqat +s'],['boy','boys','unli + y → faqat +s'],['monkey','monkeys','unli + y → faqat +s'],['leaf','leaves','-f → -ves'],['wolf','wolves','-f → -ves'],['knife','knives','-fe → -ves'],['scarf','scarves','-f → -ves'],['man','men','noto\'g\'ri (istisno) so\'z'],['woman','women','istisno'],['child','children','istisno'],['tooth','teeth','istisno'],['foot','feet','istisno'],['mouse','mice','istisno'],['sheep','sheep','o\'zgarmaydi'],['fish','fish','o\'zgarmaydi'],['photo','photos','istisno: -o bo\'lsa ham +s'],['piano','pianos','istisno: +s'],['radio','radios','istisno: +s'],['goose','geese','istisno'],['person','people','istisno'],['roof','roofs','istisno: +s']];
function plural(lv){
  const p = pick(PL); const s=p[0];
  const wr = [s+'s', s+'es', s.replace(/y$/,'ies'), s.replace(/fe?$/,'ves'), s+'ies'];
  if (lv===3 && ri(0,1)){ const n=ri(2,9); return Q(`Gapni to'ldiring: <b>I have ${n} ______.</b> (${s})`, p[1], wr, `${s} → ${p[1]} (${p[2]})`); }
  return Q(`<b>${s}</b> so'zining ko'plik shakli qaysi?`, p[1], wr, `${s} → ${p[1]} (${p[2]})`, {speak:p[1]});
}

/* To be / have got */
const SUBJ = [['I','am','have'],['You','are','have'],['He','is','has'],['She','is','has'],['It','is','has'],['We','are','have'],['They','are','have'],['My mother','is','has'],['Tom and Ann','are','have'],['The cat','is','has'],['These books','are','have'],['My friends','are','have'],['This apple','is','has']];
const ADJ = ['happy','tall','hungry','at school','from Uzbekistan','very kind','tired','in the garden','ten years old','good students'];
function tobe(lv){
  const s = pick(SUBJ); const t = lv===1 ? 0 : lv===2 ? ri(0,2) : ri(1,4);
  if (t===0) return Q(`<b>${s[0]} ___ ${pick(ADJ.slice(0,6))}.</b>`, s[1], ['am','is','are'].filter(x=>x!==s[1]).concat(['be']), `${s[0]} bilan "${s[1]}" ishlatiladi. I → am; he/she/it (birlik) → is; we/you/they (ko'plik) → are.`);
  if (t===1){ const hv = s[2]==='has'?'has got':'have got'; return Q(`<b>${s[0]} ___ a new bike.</b>`, hv, ['has got','have got','is got','are got'].filter(x=>x!==hv), `he/she/it → has got; I/you/we/they → have got`); }
  if (t===2){ const neg = s[1]==='am'?'am not':s[1]==='is'?'isn\'t':'aren\'t'; return Q(`Inkor shaklini tanlang: <b>${s[0]} ___ at home now.</b>`, neg, ['am not','isn\'t','aren\'t','don\'t'].filter(x=>x!==neg), `${s[1]} → ${neg}`); }
  if (t===3){ const past = s[1]==='are'?'were':'was'; return Q(`O'tgan zamon: <b>${s[0]} ___ at the park yesterday.</b>`, past, ['was','were','is','are'].filter(x=>x!==past), `"yesterday" — o'tgan zamon. I/he/she/it → was; we/you/they → were`); }
  const q = s[1]==='am'?'Am':s[1]==='is'?'Is':'Are'; const sub = s[0]==='I'?'I':s[0].toLowerCase().startsWith('my')||s[0].startsWith('The')||s[0].startsWith('These')||s[0].startsWith('This')?s[0][0].toLowerCase()+s[0].slice(1):s[0];
  return Q(`Savol tuzing: <b>___ ${sub} ready?</b>`, q, ['Am','Is','Are','Do','Does'].filter(x=>x!==q), `${s[0]} → ${q}`);
}

/* Artikllar */
const ART = [['apple','an'],['orange','an'],['egg','an'],['umbrella','an'],['hour','an'],['elephant','an'],['owl','an'],['ice cream','an'],['island','an'],['honest boy','an'],['banana','a'],['cat','a'],['university','a'],['uniform','a'],['house','a'],['dog','a'],['European city','a'],['one-dollar note','a'],['yellow bag','a'],['useful book','a']];
const THE = [['___ sun is very hot.','The','Dunyoda yagona narsalar oldidan "the": the sun, the moon'],['I play ___ piano.','the','Musiqa asboblari oldidan "the"'],['Look at ___ moon!','the','Yagona narsa: the moon'],['I have ___ dog. ___ dog is black.','a / The','Birinchi tilga olinganda "a", keyin "the"'],['My father is ___ doctor.','a','Kasb oldidan a/an'],['She drinks ___ milk every day.','—','Sanalmaydigan ot (milk) oldidan artikl ishlatilmaydi'],['There are ___ apples on the table.','some','Ko\'plikdagi otlar oldidan "some" (darak gapda)'],['Are there ___ eggs in the fridge?','any','So\'roq va inkor gaplarda "any"']];
function articles(lv){
  if (lv>=2 && ri(0,1)){ const t=pick(THE); const alts = ['a','an','the','The','some','any','—','a / The','an / The','the / A'].filter(x=>x!==t[1]); return Q(`<b>${t[0]}</b>`, t[1], shuffle(alts), t[2]); }
  const a = pick(ART);
  return Q(`<b>___ ${a[0]}</b>`, a[1], ['a','an','the'].filter(x=>x!==a[1]).concat(['some']), a[1]==='an' ? `"${a[0]}" unli tovush bilan boshlanadi → an` : `"${a[0]}" undosh tovush bilan boshlanadi → a${/^u|^one|^Eu/.test(a[0])?' (yozilishi unli, lekin talaffuzi "yu"/"va" — undosh tovush!)':''}`);
}

/* Zamonlar */
const VERBS = [['play','plays','played','playing','o\'ynamoq'],['read','reads','read','reading','o\'qimoq'],['go','goes','went','going','bormoq'],['eat','eats','ate','eating','yemoq'],['swim','swims','swam','swimming','suzmoq'],['write','writes','wrote','writing','yozmoq'],['run','runs','ran','running','yugurmoq'],['watch','watches','watched','watching','tomosha qilmoq'],['study','studies','studied','studying','o\'qimoq'],['drink','drinks','drank','drinking','ichmoq'],['see','sees','saw','seeing','ko\'rmoq'],['buy','buys','bought','buying','sotib olmoq'],['make','makes','made','making','yasamoq'],['sing','sings','sang','singing','kuylamoq'],['sleep','sleeps','slept','sleeping','uxlamoq'],['fly','flies','flew','flying','uchmoq'],['take','takes','took','taking','olmoq'],['come','comes','came','coming','kelmoq'],['have','has','had','having','ega bo\'lmoq'],['do','does','did','doing','qilmoq']];
function tenses(lv){
  const v = pick(VERBS); const t = lv===1 ? ri(0,1) : lv===2 ? ri(0,3) : ri(1,5);
  const forms = [v[0],v[1],v[2],v[3],'is '+v[3],'are '+v[3]];
  if (t===0){ const s=pick(['He','She','My brother','Anna']); return Q(`<b>${s} ___ every day.</b> (${v[0]})`, v[1], [v[0],v[2],v[3]], `Present Simple: he/she/it + fe'l + s/es → ${v[1]}. "every day" — har kuni (odat).`); }
  if (t===1){ const s=pick([['I','am'],['She','is'],['They','are'],['We','are'],['He','is']]); return Q(`<b>Look! ${s[0]} ___ now.</b> (${v[0]})`, `${s[1]} ${v[3]}`, [v[1], v[0], `${s[1]==='is'?'are':'is'} ${v[3]}`, v[2]], `"Look!", "now" — Present Continuous: ${s[0]} ${s[1]} ${v[3]}`); }
  if (t===2){ const s=pick(['I','We','They','She','He']); return Q(`<b>${s} ___ yesterday.</b> (${v[0]})`, v[2], [v[0], v[1], v[0]+'ed'].filter(x=>x!==v[2]).concat([v[3]]), `"yesterday" — Past Simple. ${v[0]} → ${v[2]}`); }
  if (t===3){ return Q(`<b>${v[0]}</b> fe'lining o'tgan zamon (Past Simple) shakli qaysi?`, v[2], [v[0]+'ed', v[1], v[3], v[0]+'d'].filter(x=>x!==v[2]), `${v[0]} (${v[4]}) → ${v[2]}`); }
  if (t===4){ const s=pick(['He','She','Tom']); return Q(`Inkor: <b>${s} ___ ${v[0]} on Sundays.</b>`, `doesn't`, [`don't`, `isn't`, `didn't`], `Present Simple, he/she/it → doesn't + fe'l (s qo'shilmaydi)`); }
  const s=pick(['you','they']); return Q(`Savol: <b>___ ${s} ${v[0]} last week?</b>`, 'Did', ['Do','Does','Were','Are'], `"last week" — o'tgan zamon → Did`);
}

/* Predloglar */
const PREP = [['🐱📦','The cat is ___ the box.','in','ichida'],['📚🪑','The book is ___ the chair.','on','ustida'],['⚽🛏️','The ball is ___ the bed.','under','tagida'],['🐶🏠','The dog is ___ the house (oldida).','in front of','oldida'],['🌳🏠','The tree is ___ the house (orqasida).','behind','orqasida'],['🐭🧀🐱','The cheese is ___ the mouse and the cat.','between','o\'rtasida'],['🏫','I go to school ___ Monday.','on','hafta kunlari oldidan "on"'],['🕗','The lesson starts ___ 8 o\'clock.','at','soat oldidan "at"'],['📅','My birthday is ___ May.','in','oylar oldidan "in"'],['❄️','It snows ___ winter.','in','fasllar oldidan "in"'],['🌙','I sleep ___ night.','at','"at night" — kechasi'],['🌅','I get up early ___ the morning.','in','"in the morning"'],['🗓️','We were born ___ 2016.','in','yillar oldidan "in"'],['🐦🌳','The bird is ___ the tree (yonida).','next to','yonida']];
function preps(lv){
  const p = pick(PREP);
  return Q(`<span style="font-size:44px">${p[0]}</span>\n<b>${p[1]}</b>`, p[2], ['in','on','at','under','behind','between','next to','in front of'].filter(x=>x!==p[2]), `"${p[2]}" — ${p[3]}`);
}

/* Antonim va daraja */
const OPP = [['big','small'],['tall','short'],['hot','cold'],['fast','slow'],['happy','sad'],['old','young'],['open','close'],['day','night'],['up','down'],['clean','dirty'],['rich','poor'],['strong','weak'],['heavy','light'],['early','late'],['full','empty'],['good','bad'],['new','old'],['long','short'],['easy','difficult'],['quiet','loud']];
const COMP = [['big','bigger','the biggest'],['small','smaller','the smallest'],['tall','taller','the tallest'],['happy','happier','the happiest'],['good','better','the best'],['bad','worse','the worst'],['beautiful','more beautiful','the most beautiful'],['fast','faster','the fastest'],['hot','hotter','the hottest'],['interesting','more interesting','the most interesting'],['easy','easier','the easiest'],['far','farther','the farthest']];
function opps(lv){
  if (lv===1 || ri(0,1)===0){ const o=pick(OPP); return Q(`<b>${o[0]}</b> so'zining qarama-qarshi ma'nolisi (antonimi) qaysi?`, o[1], shuffle(OPP.filter(x=>x!==o && x[1]!==o[1])).slice(0,3).map(x=>x[1]), `${o[0]} ↔ ${o[1]}`, {speak:o[0]+'. '+o[1]}); }
  const c=pick(COMP); const t=ri(0,1);
  if (t===0) return Q(`<b>This one is ___ than that one.</b> (${c[0]})`, c[1], [c[0]+'er', 'more '+c[0], c[2], c[0]].filter(x=>x!==c[1]), `"than" — qiyosiy daraja: ${c[0]} → ${c[1]}`);
  return Q(`<b>It is ___ day of the year.</b> (${c[0]})`, c[2], ['the '+c[0]+'est','the more '+c[0], c[1], 'the most '+c[0]].filter(x=>x!==c[2]), `Orttirma daraja: ${c[0]} → ${c[2]}`);
}

/* Reading — qisqa matnlar */
const READ = [
 {t:'My name is Lola. I am nine years old. I live in Samarkand with my parents and my little brother Aziz. Aziz is five. We have got a cat. Its name is Momo. Momo likes milk and fish.',
  qs:[['How old is Lola?','nine',['five','ten','seven']],['Where does Lola live?','in Samarkand',['in Tashkent','in Bukhara','in London']],['What is the cat\'s name?','Momo',['Aziz','Lola','Milk']],['Who is five years old?','Aziz',['Lola','Momo','her mother']]]},
 {t:'Tom gets up at seven o\'clock. He washes his face and eats breakfast. He goes to school by bus. His favourite subject is Maths. After school he plays football with his friends.',
  qs:[['When does Tom get up?','at seven o\'clock',['at six o\'clock','at eight o\'clock','at night']],['How does Tom go to school?','by bus',['by car','on foot','by bike']],['What is Tom\'s favourite subject?','Maths',['English','Music','Art']],['What does Tom do after school?','He plays football.',['He sleeps.','He reads a book.','He watches TV.']]]},
 {t:'It is winter. It is cold and snowy. The children are in the park. Ali is making a snowman. Madina and Zarina are skating. Their dog Bobik is running in the snow.',
  qs:[['What season is it?','winter',['summer','spring','autumn']],['What is Ali doing?','making a snowman',['skating','running','sleeping']],['Who is skating?','Madina and Zarina',['Ali and Bobik','Ali','Bobik']],['What is the weather like?','cold and snowy',['hot and sunny','warm and rainy','windy and hot']]]},
 {t:'Sara\'s birthday is on the 12th of May. She is ten today. Her mother made a big chocolate cake. Her friends gave her a book, a doll and a red ball. Sara was very happy.',
  qs:[['When is Sara\'s birthday?','on the 12th of May',['on the 10th of May','in June','on Monday']],['How old is Sara now?','ten',['nine','twelve','eleven']],['What kind of cake did her mother make?','chocolate',['apple','lemon','honey']],['What colour was the ball?','red',['blue','green','yellow']]]},
 {t:'There is a small zoo in our town. There are two lions, three monkeys and a big elephant. The monkeys are funny. They eat bananas. The elephant is very big but it is kind. Children love the zoo.',
  qs:[['How many lions are there?','two',['three','one','four']],['What do the monkeys eat?','bananas',['meat','apples','fish']],['Which animal is very big?','the elephant',['the lion','the monkey','the cat']],['The monkeys are ...','funny',['sad','big','angry']]]}
];
function reading(lv){
  const r = pick(READ); const q = pick(r.qs);
  return Q(`<div style="font-weight:700;font-size:16.5px;background:var(--pri-l);padding:12px;border-radius:14px;line-height:1.55">📖 ${r.t}</div>\n<b>${q[0]}</b>`, q[1], q[2], `Matnda shunday deyilgan. Javob: ${q[1]}`, {speak:r.t});
}

/* Dialog va iboralar */
const DIA = [['How are you?','I\'m fine, thank you.',['I\'m ten.','My name is Ali.','Yes, I do.']],['What is your name?','My name is Bekzod.',['I\'m fine.','I\'m from Tashkent.','It\'s blue.']],['How old are you?','I\'m nine years old.',['I\'m fine.','It\'s nine o\'clock.','I have nine books.']],['Where are you from?','I\'m from Uzbekistan.',['I\'m a student.','I\'m happy.','It\'s on the table.']],['What colour is the sky?','It\'s blue.',['It\'s big.','It\'s Monday.','Yes, it is.']],['Can you swim?','Yes, I can.',['Yes, I do.','Yes, I am.','Yes, it is.']],['Do you like apples?','Yes, I do.',['Yes, I am.','Yes, I can.','Yes, they are.']],['What time is it?','It\'s five o\'clock.',['It\'s Friday.','It\'s five years.','It\'s hot.']],['Thank you very much!','You\'re welcome.',['Thank you.','Goodbye.','Sorry.']],['What day is it today?','It\'s Tuesday.',['It\'s May.','It\'s sunny.','It\'s 2 o\'clock.']]];
function dialog(lv){ const d = pick(DIA); return Q(`Savolga mos javobni tanlang:\n<b>— ${d[0]}</b>`, d[1], d[2], `"${d[0]}" → "${d[1]}"`, {speak:d[0]+' '+d[1]}); }

Z.ENG = [
  {id:'en_vocab', n:'So\'z boyligi', e:'🔤', c:'c-blu', g:vocab, d:'Rasm va so\'zlar, imlo'},
  {id:'en_plural', n:'Ko\'plik (Plurals)', e:'🍎', c:'c-red', g:plural, d:'box → boxes, child → children'},
  {id:'en_be', n:'To be / Have got', e:'🙋', c:'c-pri', g:tobe, d:'am, is, are, was, were'},
  {id:'en_art', n:'Artikllar', e:'🅰️', c:'c-org', g:articles, d:'a, an, the, some, any'},
  {id:'en_tense', n:'Zamonlar', e:'⏳', c:'c-grn', g:tenses, d:'Present, Continuous, Past'},
  {id:'en_prep', n:'Predloglar', e:'📦', c:'c-tea', g:preps, d:'in, on, at, under...'},
  {id:'en_opp', n:'Sifatlar', e:'↔️', c:'c-pnk', g:opps, d:'Antonimlar, bigger, the best'},
  {id:'en_dialog', n:'Muloqot', e:'💬', c:'c-ind', g:dialog, d:'Savol-javob iboralari'},
  {id:'en_read', n:'Reading', e:'📖', c:'c-brn', g:reading, d:'Matnni o\'qib tushunish'}
];
})();

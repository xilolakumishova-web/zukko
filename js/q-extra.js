/* Qo'shimcha generatorlar: test kitoblaridagi qolgan mavzular
   (har bir mantiqiy jumboq kompyuter tomonidan tekshiriladi — javob yagona) */
(function(){
'use strict';
const {ri, pick, shuffle, mcq} = Z;
const Q = (q, correct, distract, exp, extra) => Object.assign({q, exp}, mcq(correct, distract, extra && extra.fmt), extra||{});
const QS = (q, correct, distract, exp, extra) => Q(q, correct, distract, exp, Object.assign({fmt:String}, extra||{}));
const NAMES = ['Ali','Vali','Botir','Anvar','Madina','Zarina','Jasur','Nodira','Sardor','Laylo','Aziz','Kamola','Diyor','Shahzoda','Bekzod','Malika','Umid','Gulnoza'];
const perms = arr => arr.length<=1 ? [arr.slice()] : [].concat(...arr.map((x,i)=>perms(arr.slice(0,i).concat(arr.slice(i+1))).map(p=>[x].concat(p))));
const gcd = (a,b)=> b ? gcd(b, a%b) : a;
const lcm = (a,b)=> a/gcd(a,b)*b;
const KUN = ['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba'];
const kun = i => KUN[((i%7)+7)%7];
const S = () => Z.qsvg;

/* ===== MATEMATIKA ===== */

/* 1. Xona birliklari va raqamlar */
const CLS = ['birlar','minglar','millionlar'];
function place(lv){
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,5) : ri(3,7);
  if (t===0){ const n=ri(1000000,99999999); const s=String(n); const k=ri(0,Math.min(2,Math.floor((s.length-1)/3)));
    const part = s.slice(Math.max(0,s.length-3*(k+1)), s.length-3*k); const sum=[...part].reduce((a,b)=>a+ +b,0);
    return Q(`<b>${n.toLocaleString('ru-RU').replace(/,/g,' ')}</b> sonining <b>${CLS[k]} sinfidagi</b> raqamlar yig'indisini toping.`, sum, [sum+1,sum-1,[...s].reduce((a,b)=>a+ +b,0),sum+2], `Sonni o'ngdan 3 tadan guruhlarga ajratamiz: ${CLS[k]} sinfi — ${part}. ${[...part].join(' + ')} = ${sum}`); }
  if (t===1){ const len=ri(6,9); let s=String(ri(1,9)); while(s.length<len) s+=ri(0,9); const d=pick([...new Set(s.slice(0,-1))].filter(x=>x!=='0'&&s.split(x).length===2)); if(!d) return place(lv);
    const pos=s.length-1-s.indexOf(d); const ratio=Math.pow(10,pos);
    return Q(`<b>${s}</b> sonidagi <b>${d}</b> raqamining o'rin qiymati uning o'z qiymatidan necha marta katta?`, ratio, [ratio*10, ratio/10, ratio*d], `${d} raqami o'ngdan ${pos+1}-xonada turibdi, uning o'rin qiymati ${d}·${ratio} = ${(d*ratio).toLocaleString('ru-RU')}. Demak ${ratio.toLocaleString('ru-RU')} marta katta.`, {fmt:x=>Number(x).toLocaleString('ru-RU')}); }
  if (t===2){ const k=ri(3,6); const big=Math.pow(10,k)-1; const ask=pick([['eng katta','dan oldingi',big-1],['eng katta','dan keyingi',big+1],['eng kichik','dan oldingi',Math.pow(10,k-1)-1]]);
    return Q(`<b>${ask[0]} ${k} xonali son${ask[1]}</b> sonni toping.`, ask[2], [ask[2]+2, ask[2]-1, ask[2]+1, ask[2]*10].filter(x=>x!==ask[2]), `${ask[0]} ${k} xonali son: ${ask[0]==='eng katta'?big:Math.pow(10,k-1)}. Javob: ${ask[2]}`); }
  if (t===3){ // a * b solishtirish
    const L=ri(6,8); const a=[ri(1,9)]; while(a.length<L) a.push(ri(0,9)); const pos=ri(1,L-2); const b=a.slice(); for (let i=pos+1;i<L;i++) b[i]=ri(0,9);
    const A=+a.join(''); const ok=[]; for (let d=0;d<=9;d++){ const bb=b.slice(); bb[pos]=d; if (A > +bb.join('')) ok.push(d); }
    if (!ok.length || ok.length===10) return place(lv);
    const pat=b.map((x,i)=>i===pos?'*':x).join(''); const sum=ok.reduce((x,y)=>x+y,0);
    return Q(`<b>${A} > ${pat}</b> to'g'ri bo'lishi uchun <b>*</b> o'rniga qo'yish mumkin bo'lgan barcha raqamlar yig'indisini toping.`, sum, [sum+a[pos], sum-ok[ok.length-1], sum+ok.length, 45-sum].filter(x=>x>=0&&x!==sum), `Sonlarni chapdan xonama-xona solishtiramiz. Mos raqamlar: ${ok.join(', ')}. Yig'indi: ${sum}`); }
  if (t===4){ const k=pick([3,9]); const d=[ri(1,9),ri(0,9),ri(0,9)]; const last=ri(0,9); const base=d.reduce((a,b)=>a+b,0)+last;
    const ok=[]; for (let a=0;a<=9;a++) if ((base+a)%k===0) ok.push(a); const sum=ok.reduce((x,y)=>x+y,0);
    return Q(`<b>${d.join('')}a${last}</b> — besh xonali son. U <b>${k}</b> ga qoldiqsiz bo'linishi uchun <b>a</b> ning barcha mumkin qiymatlari yig'indisini toping.`, sum, [sum+3, sum-3, ok.length, sum+k].filter(x=>x>=0&&x!==sum), `${k} ga bo'linish belgisi: raqamlar yig'indisi ${k} ga bo'linishi kerak. ${d.join('+')}+${last} = ${base}. a = ${ok.join(', ')}. Yig'indi ${sum}`); }
  if (t===5){ const ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,ri(4,6)); const which=pick(['eng katta','eng kichik']); const n=ds.length;
    const sorted=ds.slice().sort((a,b)=>which==='eng katta'?b-a:a-b); if (which==='eng kichik' && sorted[0]===0){ const i=sorted.findIndex(x=>x>0); [sorted[0],sorted[i]]=[sorted[i],sorted[0]]; }
    const ans=+sorted.join(''); const wrong1=+ds.slice().sort((a,b)=>a-b).join('')||+ds.slice().sort((a,b)=>b-a).join(''); const w2=+sorted.slice(0,-2).concat(sorted.slice(-2).reverse()).join('');
    return Q(`<b>${ds.join(', ')}</b> raqamlarini bir martadan ishlatib tuzilgan <b>${which} ${n} xonali</b> sonni toping.`, ans, [w2, wrong1, +sorted.slice(1).concat(sorted[0]).join('')||ans+9].filter(x=>String(x).length===n&&x!==ans), `${which==='eng katta'?'Kattadan kichikka':'Kichikdan kattaga'} terib chiqamiz${which==='eng kichik'&&ds.includes(0)?' (0 birinchi turolmaydi)':''}: ${ans}`); }
  if (t===6){ const a=ri(2,9); const x=pick([[2,'bir xonali','ikki xonali']]);
    const ok=[...Array(9).keys()].map(i=>i+1).filter(n=>n*2<10 && n*3>=10); return Q(`Qaysi bir xonali sonni 2 ga ko'paytirsak bir xonali son, 3 ga ko'paytirsak ikki xonali son hosil bo'ladi?`, ok.join(' yoki '), ['3','2 yoki 3','5'], `n·2 < 10 → n ≤ 4; n·3 ≥ 10 → n ≥ 4. Javob: 4`, {fmt:String}); }
  // raqamlar yig'indisi bo'yicha
  const s=ri(20,34); const k=4; const max=9*k; return Q(`Raqamlari yig'indisi <b>${s}</b> ga teng bo'lgan eng katta <b>${k} xonali</b> son va eng kichik ${k} xonali son ayirmasini toping.`, (()=>{ const big=[]; let r=s; for(let i=0;i<k;i++){ const d=Math.min(9,r); big.push(d); r-=d; } const sm=[]; r=s; for(let i=0;i<k;i++){ const left=k-1-i; const d=Math.max(i===0?1:0, r-9*left); sm.push(d); r-=d; } return +big.join('') - +sm.join(''); })(), [], `Eng katta sonda chapdagi raqamlar imkon qadar katta, eng kichikda — imkon qadar kichik bo'lishi kerak.`);
}

/* 2. Qoldiq, karrali va bo'luvchilar */
function remain(lv){
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,5) : ri(3,7);
  if (t===0){ const k=ri(3,6), pat=['Qizil','Yashil','Ko\'k','Sariq','Oq','Binafsha'].slice(0,k); const n=ri(20,120); const c=pat[(n-1)%k];
    return QS(`Chiroqlar shu tartibda takrorlanib yonadi: <b>${pat.join(', ')}, ${pat[0]}, ...</b>\n<b>${n}-chiroq</b> qaysi rangda?`, c, pat.filter(x=>x!==c), `Guruhda ${k} ta chiroq. ${n} = ${k}·${Math.floor((n-1)/k)} + ${(n-1)%k+1} → guruhning ${(n-1)%k+1}-chirog'i: ${c}.`); }
  if (t===1){ const b=ri(3,9), q=ri(5,30), r=ri(1,b-1); const a=b*q+r; return Q(`Sonni <b>${b}</b> ga bo'lganda bo'linma <b>${q}</b>, qoldiq <b>${r}</b> chiqdi. Shu sonni toping.`, a, [b*q, b*q-r, b*(q+1)+r, q*r+b], `Son = bo'luvchi · bo'linma + qoldiq = ${b}·${q} + ${r} = ${a}`); }
  if (t===2){ const b=ri(4,12); return Q(`Biror sonni <b>${b}</b> ga bo'lganda hosil bo'lishi mumkin bo'lgan <b>eng katta qoldiq</b> nechaga teng?`, b-1, [b, b-2, b+1, 1], `Qoldiq har doim bo'luvchidan kichik: eng kattasi ${b} − 1 = ${b-1}.`); }
  if (t===3){ const tr=pick([[2,3,4],[3,4,6],[2,3,5],[3,4,5],[2,5,6],[4,6,8]]); const L=tr.reduce(lcm); const r=ri(1,tr[0]-1); const m=ri(1,Math.max(1,Math.floor(80/L))); const ans=L*m+r; const lo=ans-ri(1,Math.min(8,L-1)), hi=lo+L-1;
    const cand=[]; for(let x=lo+1;x<hi;x++) if(tr.every(d=>x%d===r)) cand.push(x); if (cand.length!==1) return remain(lv);
    return Q(`Qo'ylarni ${tr.join(' tadan, ')} tadan sanaganda doim <b>${r} ta</b> ortib qoladi. Qo'ylar soni <b>${lo}</b> dan ko'p, <b>${hi}</b> dan kam. Nechta qo'y bor?`, ans, [ans+1, ans-r, ans+L, ans-1].filter(x=>x>lo&&x<hi&&x!==ans).concat([ans+2]), `${tr.join(', ')} ga bo'linadigan sonlar — ${L} ga karrali. ${L}·${m} + ${r} = ${ans}.`); }
  if (t===4){ const g=ri(4,15); let a,b; do{ a=g*ri(2,9); b=g*ri(2,9); }while(a===b||gcd(a,b)!==g);
    return QS(`<b>${a} ta olma</b> va <b>${b} ta nok</b>ni hech narsa ortmaydigan qilib, iloji boricha ko'p qutiga teng bo'lish kerak. Nechta quti bo'ladi va har birida nechta meva?`, `${g} quti (${a/g} olma, ${b/g} nok)`, [g%2===0?`${g/2} quti (${2*a/g} olma, ${2*b/g} nok)`:`${g} quti (${a/g+1} olma, ${b/g} nok)`, `${a/g} quti (${g} olma, ${b/g} nok)`, `${g*2} quti`, `${a+b} quti (1 tadan)`, `${g+1} quti`], `Quti soni — ${a} va ${b} ning eng katta umumiy bo'luvchisi: EKUB = ${g}. Har qutida ${a/g} olma va ${b/g} nok.`); }
  if (t===5){ const p=pick([[4,2,5,3],[3,1,5,2],[4,1,6,3],[5,2,6,1],[3,2,7,4],[4,3,5,1]]); const lo=ri(20,40), hi=lo+20;
    const c=[]; for(let x=lo+1;x<hi;x++) if (x%p[0]===p[1] && x%p[2]===p[3]) c.push(x); if (c.length!==1) return remain(lv);
    return Q(`Somsalar soni <b>${lo}</b> dan ko'p, <b>${hi}</b> dan kam. Ularni ${p[0]} tadan tarelkaga solsa <b>${p[1]} ta</b>, ${p[2]} tadan solsa <b>${p[3]} ta</b> ortadi. Nechta somsa bor?`, c[0], [c[0]+1, c[0]+p[0], c[0]-p[2], c[0]+2].filter(x=>x>lo&&x<hi&&x!==c[0]).concat([c[0]+p[0]*p[2]]), `${p[2]} ga bo'lganda qoldiq ${p[3]} bo'ladigan sonlarni tekshiramiz va ulardan ${p[0]} ga bo'lganda qoldiq ${p[1]} bo'ladiganini tanlaymiz: ${c[0]}.`); }
  if (t===6){ const a=ri(4,15), b=ri(4,15); if (a===b || lcm(a,b)>110) return remain(lv); const L=lcm(a,b); const tf=m=>`${8+Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
    return QS(`Bir avtobus har <b>${a} daqiqada</b>, ikkinchisi har <b>${b} daqiqada</b> bekatdan jo'naydi. Ular soat 8:00 da birga jo'nadi. Keyingi safar ular soat nechada birga jo'naydi?`, tf(L), [tf(a+b), tf(Math.max(a,b)), tf(L+Math.min(a,b)), tf(a*b===L?L*2:a*b)].filter(x=>x!==tf(L)), `${a} va ${b} ning eng kichik umumiy karralisi (EKUK) = ${L} daqiqa. 8:00 + ${L} min = ${tf(L)}.`); }
  const n=ri(40,100), d=ri(3,8); const c=Math.floor(n/d); return Q(`1 dan <b>${n}</b> gacha bo'lgan sonlar orasida <b>${d}</b> ga bo'linadiganlari nechta?`, c, [c+1, c-1, Math.ceil(n/d)+1, n-c], `${n} : ${d} = ${c} (qoldiq ${n%d}). Demak ${c} ta.`);
}

/* 3. Kombinatorika */
function comb(lv){
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,5) : ri(3,7);
  if (t===0){ const a=ri(2,5), b=ri(2,4); return Q(`Malikada <b>${a} xil</b> ko'ylak va <b>${b} xil</b> yubka bor. U nechta turli ko'rinishda kiyinishi mumkin (1 ko'ylak + 1 yubka)?`, a*b, [a+b, a*b+1, a*b-1, a*b*2], `Har bir ko'ylakka ${b} xil yubka: ${a}·${b} = ${a*b}`); }
  if (t===1){ const n=ri(4,10); return Q(`Turnirda <b>${n} ta</b> o'yinchi bor. Har biri boshqa har biri bilan bir martadan o'ynadi. Jami nechta o'yin bo'ldi?`, n*(n-1)/2, [n*(n-1), n*n, n*(n-1)/2+n, n*2], `${n}·${n-1} : 2 = ${n*(n-1)/2} (har o'yin ikki marta sanalmasligi uchun 2 ga bo'lamiz)`); }
  if (t===2){ const a=ri(2,4), b=ri(2,4), c=ri(2,4); return Q(`A dan B ga <b>${a}</b> ta, B dan C ga <b>${b}</b> ta, C dan D ga <b>${c}</b> ta yo'l bor. A dan D ga (B va C orqali) necha xil yo'l bilan borish mumkin?`, a*b*c, [a+b+c, a*b+c, a*b*c+1, a*c], `${a}·${b}·${c} = ${a*b*c}`); }
  if (t===3){ const n=pick([3,4]); const f=n===3?6:24; return Q(`<b>${n} ta</b> do'st rasmga tushish uchun bir qatorga necha xil tartibda turishi mumkin?`, f, [n*n, n*2, f/2, f+n], `Birinchi o'ringa ${n} xil, ikkinchisiga ${n-1}, ... : ${[...Array(n)].map((_,i)=>n-i).join('·')} = ${f}`); }
  if (t===4){ const ds=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,ri(3,4)); const zero=ri(0,1)===1; if (zero) ds[0]=0; const k=ds.length; const nz=ds.filter(x=>x>0).length;
    const ans = zero ? nz*(k-1)*(k-2) : k*(k-1)*(k-2);
    return Q(`<b>${ds.join(', ')}</b> raqamlaridan raqamlari takrorlanmaydigan nechta <b>uch xonali</b> son tuzish mumkin?`, ans, [k*k*k, k*(k-1)*(k-2)+(zero?k:0)+ (zero?0:k), k*3, ans+k-1].filter(x=>x!==ans), zero ? `Yuzlar xonasiga 0 qo'yib bo'lmaydi: ${nz} xil. O'nlarga ${k-1}, birlarga ${k-2}: ${nz}·${k-1}·${k-2} = ${ans}` : `${k}·${k-1}·${k-2} = ${ans}`); }
  if (t===5){ const n=ri(5,10); const d=n*(n-3)/2; return Q(`<b>${n} burchakli</b> ko'pburchakning nechta diagonali bor?`, d, [n*(n-3), n*(n-1)/2, d+1, d-n].filter(x=>x>0), `Har bir uchdan ${n}−3 = ${n-3} ta diagonal chiqadi: ${n}·${n-3} : 2 = ${d}`); }
  if (t===6){ const n=ri(4,8); return Q(`Kvadrat shaklidagi maydonning har bir tomoniga <b>${n} tadan</b> ustun o'rnatildi (burchakdagilar ikki tomonga ham tegishli). Jami nechta ustun?`, 4*n-4, [4*n, 4*n-2, 4*(n-1)+1, 4*n-8], `4·${n} = ${4*n}, burchakdagi 4 ta ustun ikki marta sanalgan: ${4*n} − 4 = ${4*n-4}`); }
  const m=ri(3,5); const sq=[...Array(m)].reduce((s,_,i)=>s+(i+1)*(i+1),0); const n=ri(3,5); const tri = n*(n+1)/2;
  return Q(`Uchburchak ichida uchidan asosga <b>${n}</b> ta kesma o'tkazildi (yon tomonlar bilan birga ${n+2} ta chiziq). Rasmda jami nechta uchburchak bor?`, (n+2)*(n+1)/2, [n+1, (n+2)*(n+1), n*(n+1)/2, n+2], `Asos ${n+1} ta bo'lakka bo'lingan. Har bir uchburchak asosdagi ${n+2} ta nuqtadan ikkitasini tanlash bilan beriladi: ${n+2}·${n+1} : 2 = ${(n+2)*(n+1)/2}`);
}

/* 4. Soat burchaklari */
function clockAng(lv){
  const t = lv===1 ? 0 : lv===2 ? ri(0,2) : ri(1,3);
  const ang = (h,m) => { const a=Math.abs(30*(h%12) - 5.5*m); return Math.min(a, 360-a); };
  if (t===0){ const h=ri(1,12); const a=ang(h,0); return QS(`Soat aniq <b>${h}:00</b> ni ko'rsatmoqda. Millar orasidagi kichik burchak necha gradus?`, a+'°', [a+30, Math.abs(a-30)||60, 360-a===a?a+60:360-a, a+15].map(x=>x+'°'), `Siferblat 12 ta bo'lakka bo'lingan, har biri 30°. ${h}:00 da millar orasi ${Math.min(h%12,12-h%12)} bo'lak: ${a}°`); }
  if (t===1){ const h=ri(1,11), m=30; const a=ang(h,m); return QS(`Soat <b>${h}:30</b>. Millar orasidagi kichik burchak necha gradus?`, a+'°', [a+15, Math.abs(a-15), a+30, ang(h,0)].filter(x=>x!==a).map(x=>x+'°'), `Daqiqa mili 6 da. Soat mili ${h} va ${h+1} ning o'rtasida (yarim soat o'tdi). Ular orasi ${a/30} bo'lak: ${a}°`); }
  if (t===2){ const fast=ri(0,1), k=ri(2,5), hrs=pick([6,8,10,12,24]); const set=ri(6,10); const diff=k*hrs; const sh=set*60 + (fast?diff:-diff);
    const f = m => `${String(Math.floor(((m%1440)+1440)%1440/60)).padStart(2,'0')}:${String(((m%60)+60)%60).padStart(2,'0')}`;
    return QS(`Soat har soatda <b>${k} daqiqa ${fast?'oldinga ketadi':'orqada qoladi'}</b>. U soat <b>${String(set).padStart(2,'0')}:00</b> da to'g'rilandi. <b>${hrs} soatdan</b> keyin (aslida ${f(set*60+hrs*60)} bo'lganda) soat nimani ko'rsatadi?`, f(sh+hrs*60), [f(set*60+hrs*60+(fast?-diff:diff)), f(set*60+hrs*60), f(sh+hrs*60+k), f(set*60+hrs*60+(fast?diff/2:-diff/2))], `${hrs} soatda ${k}·${hrs} = ${diff} daqiqa ${fast?'oldinga ketadi':'orqada qoladi'}.`); }
  const h=ri(1,11), m=pick([10,15,20,40,45,50]); const a=ang(h,m);
  return QS(`Soat <b>${h}:${m}</b>. Millar orasidagi kichik burchak necha gradus? (Soat mili ham asta siljiydi!)`, a+'°', [Math.min(Math.abs(30*h-6*m),360-Math.abs(30*h-6*m)), a+5, a+15, Math.abs(a-10)].filter(x=>x!==a).map(x=>x+'°'), `Daqiqa mili: ${m}·6° = ${6*m}°. Soat mili: ${h}·30° + ${m}·0,5° = ${30*h+m/2}°. Farq: ${a}°`);
}

/* 5. Yo'nalishlar va koordinatalar */
function coordSvg(pts){
  let b=''; const s=24, o=8, W=10*s;
  for (let i=0;i<=10;i++){ b+=`<line x1="${o+i*s}" y1="${o}" x2="${o+i*s}" y2="${o+W}" stroke="#ddd"/><line x1="${o}" y1="${o+i*s}" x2="${o+W}" y2="${o+i*s}" stroke="#ddd"/>`; }
  b+=`<line x1="${o}" y1="${o+W}" x2="${o+W+8}" y2="${o+W}" stroke="#2B2350" stroke-width="2"/><line x1="${o}" y1="${o+W}" x2="${o}" y2="${o-6}" stroke="#2B2350" stroke-width="2"/>`;
  for (let i=1;i<=10;i++){ b+=S().txt(o+i*s, o+W+12, i, 10, '#6B6590'); b+=S().txt(o-2, o+W-i*s, i, 10, '#6B6590','end'); }
  pts.forEach(([x,y,l],k)=>{ b+=`<circle cx="${o+x*s}" cy="${o+W-y*s}" r="6" fill="${['#6C4CF1','#FF8A00','#1FB866','#FF4F8B'][k%4]}"/>`+S().txt(o+x*s+11, o+W-y*s-10, l, 15); });
  return S().wrap(W+30, W+30, b);
}
function coord(lv){
  const t = lv===1 ? ri(0,1) : ri(0,3);
  if (t===0){ const x=ri(1,9), y=ri(1,9); const others=[[x<9?x+1:x-1, y<9?y+1:y-1,'B'],[x>2?x-2:x+2, y>2?y-2:y+3,'C']];
    return QS(`<b>A</b> nuqtaning koordinatalarini toping.`, `(${x}; ${y})`, [`(${y}; ${x})`, `(${x+1}; ${y})`, `(${x}; ${y-1>0?y-1:y+1})`], `Avval gorizontal o'qdan (x) ${x}, keyin vertikal o'qdan (y) ${y}: A(${x}; ${y}). Tartib muhim!`, {html:coordSvg([[x,y,'A']].concat(others))}); }
  if (t===1){ const steps=[...Array(ri(3,5))].map(()=>[pick(['shimolga','janubga','sharqqa','g\'arbga']), ri(1,5)]);
    let dx=0, dy=0; steps.forEach(([d,n])=>{ if(d==='shimolga')dy+=n; if(d==='janubga')dy-=n; if(d==='sharqqa')dx+=n; if(d==='g\'arbga')dx-=n; });
    if (!dx && !dy) return coord(lv);
    const desc=(x,y)=>{ const p=[]; if(y) p.push(`${Math.abs(y)} qadam ${y>0?'shimolda':'janubda'}`); if(x) p.push(`${Math.abs(x)} qadam ${x>0?'sharqda':'g\'arbda'}`); return p.length?p.join(', '):'boshlang\'ich joyida'; };
    return QS(`Salim ${steps.map(([d,n])=>`<b>${n} qadam ${d}</b>`).join(', ')} yurdi. U boshlagan joyidan qayerda turibdi?`, desc(dx,dy), [desc(-dx,dy), desc(dx,-dy), desc(dy,dx), desc(dx+1,dy), desc(dx,dy+1), desc(-dx,-dy)].filter(x=>x!==desc(dx,dy)), `Shimol (+) va janub (−): ${dy}. Sharq (+) va g'arb (−): ${dx}. Natija: ${desc(dx,dy)}.`); }
  if (t===2){ const x=ri(1,6), y=ri(1,6), dx=ri(1,4), dy=ri(1,4); return QS(`A(${x}; ${y}) nuqtani <b>${dx} birlik o'ngga</b> va <b>${dy} birlik yuqoriga</b> surdik. Yangi nuqtaning koordinatalari?`, `(${x+dx}; ${y+dy})`, [`(${x+dy}; ${y+dx})`, `(${x-dx}; ${y+dy})`, `(${x+dx}; ${y-dy})`], `O'ngga — x ga qo'shamiz, yuqoriga — y ga qo'shamiz: (${x}+${dx}; ${y}+${dy}).`); }
  const x1=ri(1,4), y1=ri(1,4), w=ri(2,5), hh=ri(2,5); return Q(`To'g'ri to'rtburchakning uchlari: A(${x1}; ${y1}), B(${x1+w}; ${y1}), C(${x1+w}; ${y1+hh}), D(${x1}; ${y1+hh}). Uning yuzini toping.`, w*hh, [2*(w+hh), w+hh, w*hh+w, (w+1)*(hh+1)], `Tomonlari: ${x1+w}−${x1} = ${w} va ${y1+hh}−${y1} = ${hh}. Yuza: ${w}·${hh} = ${w*hh}`, {html:coordSvg([[x1,y1,'A'],[x1+w,y1,'B'],[x1+w,y1+hh,'C'],[x1,y1+hh,'D']])});
}

/* 6. Kub va jismlar */
function netSvg(cells, labels){
  const s=46; let b=''; const xs=cells.map(c=>c[0]), ys=cells.map(c=>c[1]);
  cells.forEach(([x,y],i)=>{ b+=`<rect x="${4+x*s}" y="${4+y*s}" width="${s}" height="${s}" fill="#fff" stroke="#2B2350" stroke-width="2.5"/>`+S().txt(4+x*s+s/2, 4+y*s+s/2+1, labels[i], 22); });
  return S().wrap((Math.max(...xs)+1)*s+8, (Math.max(...ys)+1)*s+8, b);
}
const NETS = [ // [kataklar, qarama-qarshi juftlar (indekslar)] — 3D bukish orqali tekshirilgan
  {c:[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]], o:[[0,5],[1,3],[2,4]]},
  {c:[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], o:[[0,5],[1,3],[2,4]]},
  {c:[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], o:[[0,3],[1,4],[2,5]]},
  {c:[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]], o:[[0,2],[1,4],[3,5]]},
  {c:[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]], o:[[0,3],[1,5],[2,4]]},
  {c:[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]], o:[[0,5],[1,3],[2,4]]},
  {c:[[0,1],[1,1],[1,0],[2,1],[3,1],[3,2]], o:[[0,3],[1,4],[2,5]]},
  {c:[[1,0],[1,1],[0,1],[2,1],[2,2],[3,2]], o:[[0,4],[1,5],[2,3]]}
];
function cube(lv){
  const t = lv===1 ? ri(0,1) : lv===2 ? ri(0,3) : ri(2,4);
  if (t===0){ const n=pick([3,4]); const k=pick([3,2,1,0]); const cnt={3:8,2:12*(n-2),1:6*(n-2)*(n-2),0:Math.pow(n-2,3)}[k];
    return Q(`Katta kubning barcha sirtlari bo'yaldi, keyin u <b>${n*n*n} ta</b> bir xil kubchaga (${n}×${n}×${n}) kesildi. Nechta kubchaning <b>${k===0?'birorta ham sirti bo\'yalmagan':'aynan '+k+' ta sirti bo\'yalgan'}</b>?`, cnt, [8,12*(n-2),6*(n-2)*(n-2),Math.pow(n-2,3),cnt+2].filter(x=>x!==cnt), {3:'3 ta sirt — faqat burchaklarda: 8 ta.',2:`2 ta sirt — qirralar o'rtasida: 12 qirra · ${n-2} = ${12*(n-2)}.`,1:`1 ta sirt — yoqlar markazida: 6 yoq · ${(n-2)*(n-2)} = ${6*(n-2)*(n-2)}.`,0:`Bo'yalmaganlar — ichkarida: ${n-2}·${n-2}·${n-2} = ${Math.pow(n-2,3)}.`}[k]); }
  if (t===1){ const a=ri(1,6); return Q(`O'yin toshida (zarik) qarama-qarshi yoqlardagi sonlar yig'indisi doim 7 ga teng. <b>${a}</b> ning qarshisida qaysi son turadi?`, 7-a, [1,2,3,4,5,6].filter(x=>x!==7-a&&x!==a), `7 − ${a} = ${7-a}`); }
  if (t===2){ const N=pick(NETS); const nums=shuffle([1,2,3,4,5,6]); const [i,j]=pick(N.o); const ask=ri(0,1)?i:j; const opp=ask===i?j:i;
    const labels=nums.slice(); return Q(`Kubning yoyilmasi berilgan. Kub yasalganda <b>${labels[ask]}</b> soni yozilgan yoqning <b>qarshisida</b> qaysi son bo'ladi?`, labels[opp], labels.filter((_,k)=>k!==ask&&k!==opp), `Yoyilmani xayolan bukamiz. Bir qatorda yonma-yon turgan uchta katakdan chetdagi ikkitasi qarama-qarshi bo'ladi. ${labels[ask]} qarshisida — ${labels[opp]}.`, {html:netSvg(N.c, labels)}); }
  if (t===3){ const N=pick(NETS); const S7=ri(7,12); const vals=Array(6).fill(0); const pairs=N.o; const used=new Set();
    pairs.forEach(([i,j])=>{ let a; do{ a=ri(1,S7-1); }while(used.has(a)||used.has(S7-a)||a===S7-a); used.add(a); used.add(S7-a); vals[i]=a; vals[j]=S7-a; });
    const [p1,p2]=shuffle(pairs.slice()).slice(0,2); const mI=pick(p1), nI=pick(p2); const lab=vals.map((v,k)=>k===mI?'M':k===nI?'N':String(v));
    return Q(`Kub yoyilmasida qarama-qarshi yoqlardagi sonlar yig'indisi o'zaro teng. <b>M + N</b> ni toping.`, vals[mI]+vals[nI], [vals[mI]+vals[nI]+1, S7, vals[mI]+vals[nI]-2, 2*S7-vals[mI]].filter(x=>x>0&&x!==vals[mI]+vals[nI]), `Qarama-qarshi juftlarni topamiz. Ma'lum juftdan yig'indi ${S7}. M = ${vals[mI]}, N = ${vals[nI]}. M + N = ${vals[mI]+vals[nI]}`, {html:netSvg(N.c, lab)}); }
  const a=ri(2,5), b=ri(2,5), c=ri(2,4); return Q(`O'lchamlari <b>${a}×${b}×${c}</b> bo'lgan parallelepiped 1×1×1 kubchalardan yig'ilgan. Nechta kubcha ishlatilgan?`, a*b*c, [a*b+c, 2*(a*b+b*c+a*c), a*b*c-a, (a+b)*c], `Hajm = ${a}·${b}·${c} = ${a*b*c} ta kubcha`);
}

/* 7. Harakat va ish */
function motion(lv){
  const t = lv===1 ? ri(0,1) : lv===2 ? ri(0,4) : ri(2,6);
  const [A,B] = shuffle(NAMES);
  if (t===0){ const v=ri(3,6)*10, tt=ri(2,5); return Q(`Mashina <b>${v*tt} km</b> yo'lni <b>${tt} soatda</b> bosib o'tdi. Uning tezligi?`, v, [v*tt, v+10, v-10, v*tt/2], `v = S : t = ${v*tt} : ${tt} = ${v} km/soat`); }
  if (t===1){ const v=pick([200,300,400,500]), d=v*ri(3,8); return Q(`${A} daqiqasiga <b>${v} m</b> yuradi. <b>${d/1000>=1&&d%1000===0?d/1000+' km':d+' m'}</b> masofani necha daqiqada yuradi?`, d/v, [d/v+1, d/v-1, d/100, d/v*2], `${d} : ${v} = ${d/v} daqiqa`); }
  if (t===2){ const v1=ri(3,6)*10, v2=v1+ri(1,3)*5, head=pick([10,20,30]); const lead=v1*head/60; const tt=lead/(v2-v1)*60; if (!Number.isInteger(tt)) return motion(lv);
    return Q(`${A} soatiga <b>${v1} km</b> tezlikda yo'lga chiqdi. <b>${head} daqiqadan</b> keyin ortidan ${B} soatiga <b>${v2} km</b> tezlikda chiqdi. ${B} necha daqiqada quvib yetadi?`, tt, [tt+head, tt/2, tt+10, lead*10].filter(x=>x>0&&x!==tt), `${head} daqiqada ${A} ${lead} km o'zib ketadi. Yaqinlashish tezligi ${v2}−${v1} = ${v2-v1} km/soat. ${lead} : ${v2-v1} soat = ${tt} daqiqa`); }
  if (t===3){ const L=ri(3,8), cons=pick([30,35,40,45]), dist=pick([20,25,30]); const range=L/10*cons; const need=dist*2;
    const ans = range>=need ? 'Ha, yetadi' : `Yo'q, ${need-range} km yetmaydi`; return QS(`Skuter 1 litr benzinda <b>${cons} km</b> yuradi. Manzilgacha <b>${dist} km</b>. Bakda <b>${(L/10).toString().replace('.',',')} litr</b> benzin. Borib-qaytishga yetadimi?`, ans, ['Ha, yetadi', `Yo'q, ${Math.abs(need-range)+5} km yetmaydi`, `Yo'q, borishga ham yetmaydi`, `Yo'q, ${dist} km yetmaydi`].filter(x=>x!==ans), `${L/10}·${cons} = ${range} km yuradi. Borib-qaytish: ${need} km.`); }
  if (t===4){ const v1=ri(4,8)*10, v2=ri(4,8)*10, tt=ri(2,4); const D=(v1+v2)*tt; return Q(`Orasi <b>${D} km</b> bo'lgan ikki shahardan bir vaqtda ikki mashina bir-biriga qarab chiqdi. Tezliklari <b>${v1}</b> va <b>${v2} km/soat</b>. Necha soatdan keyin uchrashadi?`, tt, [tt+1, tt*2, D/v1|0, tt+2].filter(x=>x!==tt), `Yaqinlashish tezligi ${v1}+${v2} = ${v1+v2}. ${D} : ${v1+v2} = ${tt} soat`); }
  if (t===5){ const a=pick([2,3,4,6]), job=a*ri(4,10); return Q(`Bir usta bir kunda <b>${a} ta</b> stul yasaydi. <b>${job} ta</b> stulni <b>${pick([2])} ta</b> usta birgalikda necha kunda yasaydi?`, job/(2*a), [job/a, job/(2*a)+1, job/a/4|0||1, job-2*a].filter(x=>x>0&&x!==job/(2*a)), `Ikki usta bir kunda ${2*a} ta yasaydi. ${job} : ${2*a} = ${job/(2*a)} kun`); }
  const L=pick([100,120,150,200]), v=pick([10,15,20]); const bridge=pick([100,200,300]); return Q(`Uzunligi <b>${L} m</b> bo'lgan poyezd sekundiga <b>${v} m</b> tezlikda yurib, uzunligi <b>${bridge} m</b> bo'lgan ko'prikdan to'liq o'tdi. Bunga necha sekund ketdi?`, (L+bridge)/v, [bridge/v, L/v, (L+bridge)/v+5, (bridge-L>0?bridge-L:L)/v].filter(x=>Number.isInteger(x)&&x!==(L+bridge)/v), `Poyezd ko'prik uzunligi + o'z uzunligi qadar yurishi kerak: ${bridge}+${L} = ${L+bridge} m. ${L+bridge} : ${v} = ${(L+bridge)/v} s`);
}

/* ===== MANTIQ ===== */

/* 8. Hafta kunlari mantiqi */
function days(lv){
  const t = lv===1 ? ri(0,1) : lv===2 ? ri(0,2) : ri(1,3);
  if (t===0){ const s=ri(0,6), a=ri(1,3), b=ri(1,3); const w=pick([['Ertaga','Kecha',1,-1],['Indinga','Kecha',2,-1],['Ertaga','O\'tgan kuni',1,-2]]);
    const today=s; const known=today+w[2]; return QS(`<b>${w[0]}</b> — ${kun(known)}. <b>${w[1]}</b> haftaning qaysi kuni edi?`, kun(today+w[3]), [kun(today), kun(today+w[3]-1), kun(known), kun(today+1)].filter(x=>x!==kun(today+w[3])), `${w[0]} ${kun(known)} bo'lsa, bugun — ${kun(today)}. ${w[1]} — ${kun(today+w[3])}.`); }
  if (t===1){ const d=ri(1,28), wd=ri(0,6), x=ri(1,30); return QS(`Oyning <b>${d}-sanasi</b> — ${kun(wd)}. Shu oyning <b>${x}-sanasi</b> qaysi kun? (oy 30 kunlik)`, kun(wd+x-d), KUN.filter(k=>k!==kun(wd+x-d)), `Farq ${x-d} kun. ${x-d} ni 7 ga bo'lganda qoldiq ${(((x-d)%7)+7)%7} → ${kun(wd)}dan ${(((x-d)%7)+7)%7} kun ${x>=d?'keyin':'(aylanib)'}: ${kun(wd+x-d)}.`); }
  // yolg'onchilar (kecha yolg'on gapirdim)
  for (let tries=0; tries<300; tries++){
    const lieA = shuffle([0,1,2,3,4,5,6]).slice(0,3).sort(), lieB = shuffle([0,1,2,3,4,5,6]).slice(0,3).sort();
    const can = (lie, d) => { const liesToday = lie.includes(d), liedY = lie.includes((d+6)%7); return liesToday ? !liedY : liedY; };
    const sol = [0,1,2,3,4,5,6].filter(d=>can(lieA,d) && can(lieB,d));
    if (sol.length!==1) continue;
    const [P1,P2] = shuffle(NAMES).slice(0,2); const fmt = l=>l.map(kun).map(x=>x.toLowerCase()).join(', ');
    return QS(`${P1} faqat <b>${fmt(lieA)}</b> kunlari yolg'on gapiradi. ${P2} faqat <b>${fmt(lieB)}</b> kunlari yolg'on gapiradi. Boshqa kunlari ikkalasi rost gapiradi. Bir kuni ikkalasi ham: <b>«Men kecha yolg'on gapirdim»</b>, dedi. Bu qaysi kun edi?`, kun(sol[0]), KUN.filter(k=>k!==kun(sol[0])),
      `Bunday gapni aytish mumkin bo'lgan kunlar: yo bugun yolg'on gapiradigan, kecha esa rost gapirgan kun; yo bugun rost gapiradigan, kecha esa yolg'on gapirgan kun. ${P1} uchun: ${[0,1,2,3,4,5,6].filter(d=>can(lieA,d)).map(kun).join(', ')}. ${P2} uchun: ${[0,1,2,3,4,5,6].filter(d=>can(lieB,d)).map(kun).join(', ')}. Umumiy kun: ${kun(sol[0])}.`, {one:true});
  }
  return days(1);
}

/* 9. Kim nima? (jadval mantiqi) — yagona yechim tekshiriladi */
const ITEMS = [['Kitob','Soat','Samokat','Dron'],['olma','nok','uzum','anor'],['qizil','ko\'k','yashil','sariq'],['futbol','shaxmat','suzish','kurash'],['mushuk','it','to\'tiqush','baliq']];
const VERB = ['sovg\'a oldi','yaxshi ko\'radi','rangni tanladi','to\'garagiga qatnashadi','boqadi'];
function grid(lv){
  const n = lv===1 ? 3 : 4; const ii = ri(0,ITEMS.length-1); const items = ITEMS[ii].slice(0,n); const ppl = shuffle(NAMES).slice(0,n);
  for (let tries=0; tries<400; tries++){
    const sol = shuffle([...Array(n).keys()]); // ppl[i] -> items[sol[i]]
    const all = perms([...Array(n).keys()]);
    const clues = []; const pool = [];
    for (let i=0;i<n;i++) for (let j=0;j<n;j++){ if (sol[i]===j) pool.push({p:i,it:j,pos:true}); else pool.push({p:i,it:j,pos:false}); }
    let cands = all; const used = [];
    for (const c of shuffle(pool)){
      if (c.pos && used.filter(u=>u.pos).length>=1) continue;
      const next = cands.filter(pm => c.pos ? pm[c.p]===c.it : pm[c.p]!==c.it);
      if (next.length < cands.length){ used.push(c); cands = next; }
      if (cands.length===1) break;
    }
    if (cands.length!==1 || used.length > n+1) continue;
    const ask = ri(0,n-1);
    const vb = VERB[ii];
    const txt = used.map(c=> c.pos ? `${ppl[c.p]} ${items[c.it]}ni tanladi.` : `${ppl[c.p]} ${items[c.it]}ni tanlamadi.`).map(x=>'• '+x).join('\n');
    return QS(`${ppl.join(', ')} har biri bittadan va har xil narsa tanladi: <b>${items.join(', ')}</b>.\n${txt}\n<b>${ppl[ask]} nimani tanlagan?</b>`, items[sol[ask]], items.filter((_,k)=>k!==sol[ask]),
      `Jadval tuzib, "emas" belgilarini qo'yamiz. Yagona to'g'ri taqsimot: ${ppl.map((p,i)=>`${p} — ${items[sol[i]]}`).join('; ')}.`, {one:true});
  }
  return grid(1);
}

/* 10. Qatordagi tartib (chap/o'ng/yonida) — yagona yechim */
const OBJ = [['Qizil','Ko\'k','Yashil','Sariq','Oq'],['olma','nok','uzum','anor','behi'],['Ali','Vali','Botir','Anvar','Sardor']];
function line(lv){
  const n = lv===1 ? 4 : 5; const things = shuffle(pick(OBJ)).slice(0,n);
  for (let tries=0; tries<500; tries++){
    const sol = shuffle(things.slice()); // sol[pos] = thing
    const pos = x => sol.indexOf(x);
    const pool = [];
    things.forEach(a=>{
      pool.push({t:`${a} eng chapda`, f:p=>p.indexOf(a)===0, ok:pos(a)===0});
      pool.push({t:`${a} eng o'ngda`, f:p=>p.indexOf(a)===n-1, ok:pos(a)===n-1});
      pool.push({t:`${a} chekkada emas`, f:p=>p.indexOf(a)>0&&p.indexOf(a)<n-1, ok:pos(a)>0&&pos(a)<n-1});
      things.forEach(b=>{ if (a===b) return;
        pool.push({t:`${a} ${b}dan chapda`, f:p=>p.indexOf(a)<p.indexOf(b), ok:pos(a)<pos(b)});
        pool.push({t:`${a} ${b}ning yonida`, f:p=>Math.abs(p.indexOf(a)-p.indexOf(b))===1, ok:Math.abs(pos(a)-pos(b))===1});
        pool.push({t:`${a} ${b}ning yonida emas`, f:p=>Math.abs(p.indexOf(a)-p.indexOf(b))!==1, ok:Math.abs(pos(a)-pos(b))!==1});
      });
    });
    let cands = perms(things); const used=[];
    for (const c of shuffle(pool.filter(c=>c.ok))){ const nx = cands.filter(c.f); if (nx.length<cands.length){ used.push(c); cands=nx; } if (cands.length===1) break; if (used.length>n) break; }
    if (cands.length!==1 || used.length>n) continue;
    const k = ri(1,n);
    return QS(`${n} ta narsa bir qatorga terildi: ${things.join(', ')}.\n${used.map(c=>'• '+c.t+'.').join('\n')}\n<b>Chapdan ${k}-o'rinda nima turibdi?</b>`, sol[k-1], sol.filter((_,i)=>i!==k-1), `Yagona tartib (chapdan o'ngga): ${sol.join(' → ')}.`, {one:true});
  }
  return line(lv);
}

/* 11. Sandiq kodi */
function code(lv){
  const fb = (g,c) => { let a=0,b=0; for (let i=0;i<3;i++){ if (g[i]===c[i]) a++; else if (c.includes(g[i])) b++; } return [a,b]; };
  const all=[]; for (let x=0;x<1000;x++){ const s=String(x).padStart(3,'0'); if (new Set(s).size===3) all.push(s); }
  for (let tries=0; tries<300; tries++){
    const secret = pick(all); const clues = []; let cands = all.slice();
    for (let k=0;k<40 && cands.length>1;k++){
      const g = pick(all); const r = fb(g, secret); if (g===secret) continue;
      const nx = cands.filter(c=>{ const q=fb(g,c); return q[0]===r[0]&&q[1]===r[1]; });
      if (nx.length < cands.length){ clues.push([g,r]); cands = nx; }
      if (clues.length>5) break;
    }
    if (cands.length!==1 || clues.length<3 || clues.length>5) continue;
    const desc = ([a,b]) => a===0&&b===0 ? 'hech bir raqam to\'g\'ri emas' : [a?`${a} ta raqam to'g'ri va o'z o'rnida`:'', b?`${b} ta raqam to'g'ri, lekin o'rni noto'g'ri`:''].filter(Boolean).join('; ');
    const dist = shuffle(all.filter(c=>c!==secret && clues.filter(([g,r])=>{const q=fb(g,c); return q[0]===r[0]&&q[1]===r[1];}).length>=clues.length-1)).slice(0,3);
    while (dist.length<3) dist.push(pick(all.filter(c=>c!==secret&&!dist.includes(c))));
    return QS(`Sandiqni ochish uchun 3 xonali kod kerak (raqamlar takrorlanmaydi). Maslahatlar:\n${clues.map(([g,r])=>`<b>${g.split('').join(' ')}</b> — ${desc(r)}.`).join('\n')}\n<b>Kod qaysi?</b>`, secret.split('').join(' '), dist.map(d=>d.split('').join(' ')), `Har bir maslahatni tekshiramiz. Faqat ${secret} barcha shartlarga mos keladi.`, {one:true});
  }
  return code(lv);
}

/* 12. Shartli mulohaza (Agar ... bo'lsa) */
const IFS = [
  ['yomg\'ir yog\'sa','yo\'lak ho\'l bo\'ladi','yomg\'ir yog\'di','yo\'lak ho\'l','yo\'lak quruq','yomg\'ir yog\'madi'],
  ['Ali uy vazifasini bajarsa','u multfilm ko\'radi','Ali uy vazifasini bajardi','Ali multfilm ko\'rdi','Ali multfilm ko\'rmadi','Ali uy vazifasini bajarmadi'],
  ['quyosh chiqsa','hovli yorishadi','quyosh chiqdi','hovli yorishdi','hovli yorishmadi','quyosh chiqmadi'],
  ['suv 0°C gacha sovusa','u muzlaydi','suv 0°C gacha sovudi','suv muzladi','suv muzlamadi','suv 0°C gacha sovumadi'],
  ['o\'quvchi Prezident maktabiga kirsa','u imtihondan o\'tgan bo\'ladi','Laylo Prezident maktabiga kirdi','Laylo imtihondan o\'tgan','Laylo imtihondan o\'tmagan','Laylo Prezident maktabiga kirmadi'],
  ['do\'konda chegirma bo\'lsa','u yerda odam ko\'p bo\'ladi','do\'konda chegirma bor','do\'konda odam ko\'p','do\'konda odam kam','do\'konda chegirma yo\'q']
];
const ALL_S = [
  ['mushuklar','sut ichadi','Momo — mushuk','Momo sut ichadi','Bobik sut ichadi','Bobik — mushuk'],
  ['qushlarning','tumshug\'i bor','Burgut — qush','burgutning tumshug\'i bor','toshbaqaning tumshug\'i bor','toshbaqa — qush'],
  ['Prezident maktabi o\'quvchilari','ingliz tilini biladi','Aziz — Prezident maktabi o\'quvchisi','Aziz ingliz tilini biladi','Kamola ingliz tilini biladi','Kamola — Prezident maktabi o\'quvchisi'],
  ['mevali daraxtlar','bahorda gullaydi','O\'rik — mevali daraxt','o\'rik bahorda gullaydi','lola bahorda gullaydi','lola — mevali daraxt']
];
function cond(lv){
  const t = ri(0, lv===1 ? 1 : 4);
  const c = pick(IFS);
  const head = `Qoida: <b>«Agar ${c[0]}, ${c[1]}.»</b> Qoida doim to'g'ri.\n`;
  if (t===0) return QS(head+`Ma'lum: <b>${c[2]}</b>. Qaysi xulosa to'g'ri?`, `${c[3][0].toUpperCase()+c[3].slice(1)} — albatta.`, [`${c[4][0].toUpperCase()+c[4].slice(1)}.`, 'Hech narsa aytib bo\'lmaydi.', `${c[5][0].toUpperCase()+c[5].slice(1)}.`], `Shart bajarildi — natija albatta bo'ladi.`, {one:true});
  if (t===1) return QS(head+`Ma'lum: <b>${c[4]}</b>. Qaysi xulosa to'g'ri?`, `${c[5][0].toUpperCase()+c[5].slice(1)} — albatta.`, [`${c[2][0].toUpperCase()+c[2].slice(1)}.`, 'Hech narsa aytib bo\'lmaydi.', `${c[3][0].toUpperCase()+c[3].slice(1)}.`], `Agar shart bajarilganida, natija ham bo'lardi. Natija yo'q — demak shart ham bajarilmagan.`, {one:true});
  if (t===2) return QS(head+`Ma'lum: <b>${c[3]}</b>. Bundan «${c[2]}» degan xulosa chiqadimi?`, 'Yo\'q, aniq aytib bo\'lmaydi — natijaga boshqa sabab ham olib kelgan bo\'lishi mumkin.', ['Ha, albatta.', 'Yo\'q, aksincha — shart bajarilmagan.', 'Ha, chunki qoida doim to\'g\'ri.'], `«Agar A bo'lsa, B bo'ladi» — B bo'lgani A bo'lganini isbotlamaydi. Bu ko'p uchraydigan mantiqiy xato!`, {one:true});
  if (t===3) return QS(head+`Ma'lum: <b>${c[5]}</b>. Bundan «${c[4]}» degan xulosa chiqadimi?`, 'Yo\'q, aniq aytib bo\'lmaydi.', ['Ha, albatta.', 'Yo\'q, aksincha — natija albatta bo\'ladi.', 'Ha, chunki shart bajarilmadi.'], `Qoida shart bajarilmagan holat haqida hech narsa demaydi. Natija boshqa sabab bilan ham bo'lishi mumkin.`, {one:true});
  const s = pick(ALL_S);
  const ok = ri(0,1);
  if (ok) return QS(`<b>«Barcha ${s[0]} ${s[1]}. ${s[2]}.»</b>\nQaysi xulosa to'g'ri?`, `${s[3][0].toUpperCase()+s[3].slice(1)}.`, ['Hech narsa aytib bo\'lmaydi.', `Faqat ${s[0]} ${s[1]}.`, `${s[3][0].toUpperCase()+s[3].slice(1)} emas.`], `Umumiy qoida guruhning har bir a'zosiga tegishli.`, {one:true});
  return QS(`<b>«Barcha ${s[0]} ${s[1]}.»</b> Ma'lum: <b>${s[4]}</b>. Bundan «${s[5]}» degan xulosa chiqadimi?`, 'Yo\'q — boshqalar ham shunday bo\'lishi mumkin.', ['Ha, albatta.', 'Ha, chunki qoida doim to\'g\'ri.', 'Yo\'q, chunki qoida noto\'g\'ri.'], `«Barcha A — B» degani «barcha B — A» degani emas.`, {one:true});
}

/* 13. Shifrlar */
const WORDS = ['MAKTAB','KITOB','ZUKKO','OLMA','QALAM','DAFTAR','SUDOKU','BILIM','YULDUZ','DUNYO','SHAXMAT','MANTIQ','DOSTLIK','NON','TOSH','GUL','ANOR','BAHOR','DARYO','SAMO','TULKI','QUYON','SABZI','PIYOLA','DOSKA','QUYOSH','KEMA','SOAT'];
const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shift = (w,k) => w.split('').map(ch=>AB[(AB.indexOf(ch)+k+26)%26]).join('');
function cipher(lv){
  const t = lv===1 ? ri(0,1) : ri(0,3);
  if (t===0){ const k=lv===1?1:ri(1,3); const [w1,w2]=shuffle(WORDS); return QS(`<b>${w1}</b> so'zi <b>${shift(w1,k)}</b> deb shifrlangan. Shu qoida bilan <b>${w2}</b> qanday yoziladi?`, shift(w2,k), [shift(w2,k+1), shift(w2,-k), shift(w2,k).split('').reverse().join('')].filter(x=>x!==shift(w2,k)), `Har bir harf alifboda ${k} ta keyingisiga suriladi (Z dan keyin yana A).`); }
  if (t===1){ const w=pick(WORDS.filter(x=>x.length<=6)); const nums=w.split('').map(c=>AB.indexOf(c)+1); return QS(`Harflar raqamlar bilan almashtirildi: A=1, B=2, C=3, ... Z=26. <b>${nums.join('-')}</b> qaysi so'z?`, w, shuffle(WORDS.filter(x=>x!==w&&x.length===w.length)).slice(0,2).concat([shift(w,1), shift(w,-1), w.split('').reverse().join('')]), `${w.split('').map((c,i)=>c+'='+nums[i]).join(', ')}`); }
  if (t===2){ const w=pick(WORDS); const s=w.split('').map(c=>AB.indexOf(c)+1).reduce((a,b)=>a+b,0); return Q(`A=1, B=2, C=3, ... Z=26 bo'lsa, <b>${w}</b> so'zidagi harflar qiymatlari yig'indisi nechaga teng?`, s, [s+1, s-2, s+10, w.length*10], `${w.split('').map(c=>AB.indexOf(c)+1).join(' + ')} = ${s}`); }
  const w=pick(WORDS); const r=w.split('').reverse().join(''); const w2=pick(WORDS.filter(x=>x!==w)); return QS(`<b>${w}</b> so'zi <b>${r}</b> deb yozilgan. Shu qoida bilan <b>${w2}</b> qanday yoziladi?`, w2.split('').reverse().join(''), [shift(w2,1), w2.slice(1)+w2[0], w2.split('').sort().join('')].filter(x=>x!==w2.split('').reverse().join('')), `So'z teskari tartibda yoziladi.`);
}

/* 14. Eng yomon holat (Dirixle prinsipi) */
function worst(lv){
  const cols=shuffle(['qizil','ko\'k','yashil','sariq','oq']).slice(0,ri(2,lv===1?3:4)); const cnt=cols.map(()=>ri(3,12)); const thing=pick(['shar','qalam','paypoq','tasma','konfet']);
  const t = lv===1 ? 0 : ri(0,2);
  const list = cols.map((c,i)=>`${cnt[i]} ta ${c}`).join(', ');
  if (t===0) return Q(`Qutida ${list} ${thing} bor. Qaramasdan kamida nechta ${thing} olinsa, ulardan <b>ikkitasi albatta bir xil rangda</b> bo'ladi?`, cols.length+1, [cols.length, 2, cnt.reduce((a,b)=>a+b,0), Math.max(...cnt)+1], `Eng yomon holat: dastlab har rangdan bittadan — ${cols.length} ta. Keyingisi albatta takrorlanadi: ${cols.length+1}.`);
  if (t===1){ const i=ri(0,cols.length-1); const others=cnt.reduce((a,b)=>a+b,0)-cnt[i]; return Q(`Qutida ${list} ${thing} bor. Kamida nechta olinsa, <b>albatta bitta ${cols[i]}</b> ${thing} bo'ladi?`, others+1, [others, cnt[i]+1, cols.length+1, others+2], `Eng yomon holatda avval boshqa ranglarning hammasi chiqadi: ${others} ta. Keyingisi albatta ${cols[i]}: ${others+1}.`); }
  const k=ri(3,Math.min(...cnt)); const ans=cols.length*(k-1)+1; return Q(`Qutida ${list} ${thing} bor. Kamida nechta olinsa, <b>bir xil rangdagi ${k} ta</b> ${thing} albatta bo'ladi?`, ans, [cols.length*k, ans-1, k+cols.length, ans+cols.length], `Eng yomon holat: har rangdan ${k-1} tadan — ${cols.length*(k-1)} ta. Keyingisi biror rangni ${k} taga yetkazadi: ${ans}.`);
}

/* ro'yxatdan o'tkazish */
Z.MATH.push(
  {id:'m_place', n:'Xona birliklari', e:'🔣', c:'c-ind', g:place, d:'Sinflar, raqamlar, yulduzchali solishtirish'},
  {id:'m_rem', n:'Qoldiq, EKUB, EKUK', e:'➗', c:'c-org', g:remain, d:'Qoldiqli bo\'lish, takrorlanish, qutilarga bo\'lish'},
  {id:'m_comb', n:'Kombinatorika', e:'🎲', c:'c-pnk', g:comb, d:'Nechta usul? Turnir, yo\'llar, diagonallar'},
  {id:'m_motion', n:'Harakat va ish', e:'🚗', c:'c-blu', g:motion, d:'Tezlik, quvib yetish, uchrashish'},
  {id:'m_clock', n:'Soat burchaklari', e:'🕓', c:'c-red', g:clockAng, d:'Millar orasidagi burchak, xato soat'},
  {id:'m_coord', n:'Koordinata va yo\'nalish', e:'🧭', c:'c-tea', g:coord, d:'Nuqtalar, shimol-janub-sharq-g\'arb'},
  {id:'m_cube', n:'Kub va yoyilmalar', e:'🧊', c:'c-grn', g:cube, d:'Bo\'yalgan kub, zarik, kub yoyilmasi'}
);
Z.LOGIC.push(
  {id:'lg_days', n:'Hafta kunlari mantiqi', e:'📅', c:'c-org', g:days, d:'Ertaga, kecha, yolg\'onchi egizaklar'},
  {id:'lg_grid', n:'Kim nimani tanladi?', e:'🧩', c:'c-pri', g:grid, d:'Jadval mantiqi (yagona yechim)'},
  {id:'lg_line', n:'Qatordagi tartib', e:'↔️', c:'c-grn', g:line, d:'Chapda, o\'ngda, yonida — kim qayerda?'},
  {id:'lg_code', n:'Sandiq kodi', e:'🔒', c:'c-brn', g:code, d:'Maslahatlardan maxfiy kodni top'},
  {id:'lg_cond', n:'Agar..., u holda...', e:'🔀', c:'c-ind', g:cond, d:'Shartli mulohaza va mantiqiy xatolar'},
  {id:'lg_cipher', n:'Shifrlar', e:'🔐', c:'c-red', g:cipher, d:'Harf siljitish, raqamli kod'},
  {id:'lg_worst', n:'Eng yomon holat', e:'🎒', c:'c-tea', g:worst, d:'Qorong\'ida nechta olish kerak?'},
  ...(Z.STORY||[])
);

/* Imtihon rejasini kengaytirish */
const pm = Z.EXAMS.find(e=>e.id==='pm1');
if (pm){ pm.plan = [['m_arith',3],['m_place',2],['m_seq',3],['m_eq',3],['m_rem',2],['m_rem',3],['m_time',2],['m_clock',2],['m_units',3],['m_geom',2],['m_geom',3],['m_cube',2],['m_coord',2],['m_comb',2],['m_motion',2],['m_word',3],['m_frac',2],['m_nums',3],
  ['lg_puzzle',3],['lg_truth',3],['lg_crit',3],['lg_cond',2],['lg_line',2],['lg_grid',2],['lg_code',2],['lg_days',3],['lg_worst',2],['lg_family',1],['lg_shorq',1],['lg_analogy',3]];
  pm.d = 'Matematika + mantiq + tanqidiy fikrlash · 30 savol · 45 daqiqa'; }
Z.EXAMS.push({id:'pm_hard', n:'Al-Xorazmiy darajasi (qiyin)', e:'🦉', d:'Eng qiyin savollar · 25 savol · 40 daqiqa', min:40,
  plan:[['m_arith',3],['m_place',3],['m_rem',3],['m_comb',3],['m_clock',3],['m_cube',3],['m_motion',3],['m_eq',3],['m_seq',3],['m_frac',3],['m_nums',3],['m_geom',3],['m_word',3],
    ['lg_code',3],['lg_grid',3],['lg_line',3],['lg_days',3],['lg_cond',3],['lg_truth',3],['lg_crit',3],['lg_worst',3],['lg_cipher',3],['lg_sets',3],['lg_family',1],['lg_shorq',1]]});
})();

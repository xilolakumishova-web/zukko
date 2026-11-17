/* Matematika savollari — generatorlar (har safar yangi savol) */
(function(){
'use strict';
const {ri, pick, shuffle, mcq} = Z;
const Q = (q, correct, distract, exp, extra) => Object.assign({q, exp}, mcq(correct, distract, extra && extra.fmt), extra||{});
const near = (x, k) => { const out=[]; for (let i=1;i<=6;i++){ out.push(x+i*(k||1)); out.push(x-i*(k||1)); } return shuffle(out).filter(v=>v>=0); };
const fmtN = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');

/* ---------- SVG yordamchilari ---------- */
const S = {
  wrap:(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" width="${Math.min(w,420)}" xmlns="http://www.w3.org/2000/svg" font-family="Nunito,sans-serif" font-weight="800">${body}</svg>`,
  poly:(pts,fill)=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${fill||'#EEE9FF'}" stroke="#6C4CF1" stroke-width="3" stroke-linejoin="round"/>`,
  txt:(x,y,t,size,col,anchor)=>`<text x="${x}" y="${y}" font-size="${size||18}" fill="${col||'#2B2350'}" text-anchor="${anchor||'middle'}" dominant-baseline="middle">${t}</text>`
};

/* 1. HISOBLASH */
function arith(lv){
  if (lv===1){
    const t = ri(0,3);
    if (t===0){ const a=ri(120,899), b=ri(45,99)+ri(0,1)*100; return Q(`Hisoblang: <b>${a} + ${b}</b>`, a+b, [a+b+10,a+b-10,a+b+100,a+b-1], `${a} + ${b} = ${a+b}`); }
    if (t===1){ const a=ri(300,999), b=ri(105,a-50); return Q(`Hisoblang: <b>${a} − ${b}</b>`, a-b, [a-b+10,a-b-10,a-b+100,a-b+1], `${a} − ${b} = ${a-b}`); }
    if (t===2){ const a=ri(12,49), b=ri(3,9); return Q(`Hisoblang: <b>${a} × ${b}</b>`, a*b, [a*b+b,a*b-b,a*b+10,a*(b+1)], `${a} × ${b} = ${a*b}`); }
    const b=ri(3,9), c=ri(12,99), a=b*c; return Q(`Hisoblang: <b>${a} : ${b}</b>`, c, [c+1,c-1,c+10,c-10], `${a} : ${b} = ${c}, chunki ${c} × ${b} = ${a}`);
  }
  if (lv===2){
    const t = ri(0,4);
    if (t===0){ const a=ri(10,60), b=ri(3,9), c=ri(3,9); const r=a+b*c, wrong=(a+b)*c; return Q(`Hisoblang: <b>${a} + ${b} × ${c}</b>`, r, [wrong, r+b, r-c, a*b+c], `Avval ko'paytirish: ${b} × ${c} = ${b*c}, keyin qo'shish: ${a} + ${b*c} = ${r}.\nEsda tut: × va : amallari + va − dan oldin bajariladi!`); }
    if (t===1){ const a=ri(5,20), b=ri(2,15), c=ri(2,6), d=ri(1,20); const r=(a+b)*c-d; return Q(`Hisoblang: <b>(${a} + ${b}) × ${c} − ${d}</b>`, r, [a+b*c-d, r+d*2, r+c, (a+b)*(c-d>0?c-d:1)], `Qavs ichi: ${a}+${b}=${a+b}; ${a+b}×${c}=${(a+b)*c}; ${(a+b)*c}−${d}=${r}`); }
    if (t===2){ const c=pick([10,20,5,4]), a=c*ri(2,15), b=pick([10,100,2,5]); const d=pick([10,100]); const r=a*b/c*d; return Q(`Hisoblang: <b>${a} · ${b} : ${c} · ${d}</b>`, r, [a*b/(c*d), r*10, r/10, a*b*d], `Amallar chapdan o'ngga bajariladi: ${a}·${b}=${a*b}; ${a*b}:${c}=${a*b/c}; ${a*b/c}·${d}=${fmtN(r)}`, {fmt:fmtN}); }
    if (t===3){ const b=ri(2,5), c=ri(1,b*3), a=ri(5,30); const d=b*ri(2,8)+0; const r=a+d/b; return Q(`Hisoblang: <b>${a} + ${d} : ${b}</b>`, r, [(a+d)/b|0, r+1, r+b, a+d-b], `Avval bo'lish: ${d} : ${b} = ${d/b}, keyin ${a} + ${d/b} = ${r}`); }
    const a=ri(100,500), b=ri(2,9)*10, c=ri(2,9); const r=a-b*c; if (r<0) return arith(2);
    return Q(`Hisoblang: <b>${a} − ${b} · ${c}</b>`, r, [(a-b)*c, r+c, r-10, r+b], `${b}·${c}=${b*c}; ${a}−${b*c}=${r}`);
  }
  const t = ri(0,5);
  if (t===0){ const n=ri(15,79); return Q(`Qulay usulda hisoblang: <b>25 · ${n} · 4</b>`, 100*n, [100*n+25, 10*n, 100*n-4, 1000*n], `25 · 4 = 100 bo'lgani uchun javob 100 · ${n} = ${100*n}`); }
  if (t===1){ const n=ri(13,79); return Q(`Qulay usulda hisoblang: <b>${n} · 99 + ${n}</b>`, n*100, [n*99, n*100+n, n*101, n*98], `${n}·99 + ${n}·1 = ${n}·(99+1) = ${n}·100 = ${n*100}`); }
  if (t===2){ const n=pick([10,20,30,40,50,100]); const s=n*(n+1)/2; return Q(`Yig'indini toping: <b>1 + 2 + 3 + ... + ${n}</b>`, s, [s+n, s-n, n*n, n*(n-1)/2+1], `Juftlab qo'shamiz: (1+${n}) + (2+${n-1}) + ... Har juftlik ${n+1} ga teng, juftliklar ${n/2} ta. ${n+1} · ${n/2} = ${s}`); }
  if (t===3){ const k=ri(3,9), a=ri(200,400), x=ri(10,60), c=ri(2,9); const b=a-x-c; return Q(`Tenglikdagi <b>△</b> ni toping:\n${k} · ${b} = ${k} · ${a} − ${k} · △ − ${k} · ${c}`, x, [x+c, a-b, x-c, k*x], `${k} ga ikkala tomonni bo'lamiz: ${b} = ${a} − △ − ${c}. △ = ${a} − ${c} − ${b} = ${x}`); }
  if (t===4){ const a=pick([999,99,9]); return Q(`Hisoblang: <b>999 + 99 + 9 + 3</b>`, 1110, [1100,1111,1010,1210], `(999+1)+(99+1)+(9+1) = 1000+100+10 = 1110`); }
  const a=ri(11,19), b=ri(11,19); return Q(`Hisoblang: <b>${a} · ${b} − ${a} · ${b-10}</b>`, a*10, [a*b-10, a*(b-10), b*10, a*10+b], `${a}·${b} − ${a}·${b-10} = ${a}·(${b}−${b-10}) = ${a}·10 = ${a*10}`);
}

/* 2. KETMA-KETLIKLAR */
function seq(lv){
  let arr, rule;
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,5) : ri(3,7);
  if (t===0){ const s=ri(2,30), d=ri(2,9); arr=[...Array(6)].map((_,i)=>s+i*d); rule=`har safar ${d} ga oshadi`; }
  else if (t===1){ const s=ri(60,120), d=ri(3,9); arr=[...Array(6)].map((_,i)=>s-i*d); rule=`har safar ${d} ga kamayadi`; }
  else if (t===2){ const s=ri(1,5), q=pick([2,3]); arr=[...Array(6)].map((_,i)=>s*Math.pow(q,i)); rule=`har safar ${q} marta ortadi`; }
  else if (t===3){ const s=ri(5,15), d=ri(1,3), st=ri(1,2); arr=[s]; for(let i=1;i<7;i++) arr.push(arr[i-1]+d+(i-1)*st); rule=`ayirmalar ${d}, ${d+st}, ${d+2*st}, ... bo'lib ortib boradi`; }
  else if (t===4){ const a=ri(1,3), b=ri(2,4); arr=[a,b]; for(let i=2;i<7;i++) arr.push(arr[i-1]+arr[i-2]); rule='har bir son oldingi ikkitasining yig\'indisiga teng'; }
  else if (t===5){ const s=ri(2,9), m=ri(2,3), p=ri(1,4); arr=[s]; for(let i=1;i<6;i++) arr.push(i%2? arr[i-1]*m : arr[i-1]+p); rule=`navbat bilan ×${m} va +${p}`; }
  else if (t===6){ const s=ri(1,4); arr=[...Array(6)].map((_,i)=>(s+i)*(s+i)); rule='kvadrat sonlar: '+arr.slice(0,3).map((v,i)=>`${s+i}·${s+i}`).join(', ')+'...'; }
  else { const s=ri(10,40), d=ri(2,5); arr=[s]; for(let i=1;i<7;i++) arr.push(i%2? arr[i-1]+d*2 : arr[i-1]-d); rule=`navbat bilan +${2*d} va −${d}`; }
  if (lv===3 && ri(0,1)){ // ikki noma'lum yig'indisi
    const n=Math.min(arr.length,8); const a2=arr.slice(0,n); const i1=ri(2,3), i2=ri(i1+2,n-2);
    const shown=a2.map((v,i)=>i===i1||i===i2?'__':v).join(', ');
    const s=a2[i1]+a2[i2];
    return Q(`Ketma-ketlikda tushirib qoldirilgan sonlar yig'indisini toping:\n<b>${shown}</b>`, s, [s+2,s-2,s+a2[1]-a2[0],s+10], `Qonuniyat: ${rule}. Tushirilganlar: ${a2[i1]} va ${a2[i2]}, yig'indisi ${s}`);
  }
  const hide = ri(0,2)===0 ? ri(2,4) : arr.length-1;
  const shown = arr.slice(0, hide===arr.length-1?arr.length-1:arr.length).map((v,i)=>i===hide?'?':v);
  if (hide===arr.length-1) shown.push('?');
  const ans = arr[hide];
  return Q(`Qonuniyatni toping va <b>?</b> o'rniga mos sonni qo'ying:\n<b>${shown.join(', ')}</b>`, ans, near(ans, ans>50?2:1), `Qonuniyat: ${rule}. Javob: ${ans}`);
}

/* 3. TENGLAMA VA TENGSIZLIK */
function eq(lv){
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,4) : ri(3,6);
  if (t===0){ const x=ri(10,90), a=ri(10,90); return Q(`Tenglamani yeching: <b>x + ${a} = ${x+a}</b>`, x, near(x), `x = ${x+a} − ${a} = ${x}`); }
  if (t===1){ const x=ri(3,12), a=ri(3,9); const r=x*a; return Q(`Tenglamani yeching: <b>${a} · x = ${r}</b>`, x, near(x), `x = ${r} : ${a} = ${x}`); }
  if (t===2){ const b=ri(5,20), c=ri(10,40); const R=b+c; const ans=R-b-1+0; const lim=c+b; // star + b < c+..
    const a1=ri(20,40), a2=ri(5,15); const right=a1-a2; const max=right-b-1;
    if (max<1) return eq(1);
    return Q(`Tengsizlik to'g'ri bo'lishi uchun ⭐ o'rnida eng katta qaysi natural son bo'lishi mumkin?\n<b>⭐ + ${b} < ${a1} − ${a2}</b>`, max, [max+1, right, max-1, right-b+1], `${a1} − ${a2} = ${right}. ⭐ + ${b} < ${right} ⇒ ⭐ < ${right-b}. Eng kattasi ${max}.`); }
  if (t===3){ const x=ri(4,20), k=ri(2,5), c=ri(3,15), a=ri(20,50); const R=a+k*x-c; return Q(`Tenglamani yeching:\n<b>${a} + (${k}x − ${c}) = ${R}</b>`, x, near(x), `${k}x − ${c} = ${R} − ${a} = ${R-a}; ${k}x = ${R-a+c}; x = ${x}`); }
  if (t===4){ const q=ri(2,8), b=ri(10,40); const a=q*ri(3,12); const r=a/q+b; return Q(`Zanjirdagi <b>?</b> ni toping:\n<b>${a}</b>  —(:)→  <b>?</b>  —(+)→  <b>${b}</b>  =  <b>${r}</b>`, q, [q+1,q-1,a/q,r-b+1], `${a} : ? + ${b} = ${r} ⇒ ${a} : ? = ${r-b} ⇒ ? = ${a} : ${r-b} = ${q}`); }
  if (t===5){ const lo=ri(10,40), hi=lo+ri(5,12); const cnt=hi-lo-1; return Q(`Nechta natural son <b>${lo} < x < ${hi}</b> qo'sh tengsizlikni qanoatlantiradi?`, cnt, [cnt+1,cnt+2,cnt-1,hi-lo+1], `${lo+1} dan ${hi-1} gacha: ${hi-1} − ${lo+1} + 1 = ${cnt} ta`); }
  // a+b, a+c, b+c sistemalari
  const a=ri(1,6), b=ri(1,6), c=ri(1,6);
  const e1=3*a+2*b+3*c, e2=a+5*b+c;
  return Q(`Agar <b>3a + 2b + 3c = ${e1}</b> va <b>a + 5b + c = ${e2}</b> bo'lsa, <b>a + c</b> ni toping.`, a+c, [a+c+1,a+c-1,b,a+b+c], `a + c = m deb olaylik: 3m + 2b = ${e1}, m + 5b = ${e2}. Ikkinchisini 3 ga ko'paytirib birinchisini ayiramiz: 13b = ${3*e2-e1} ⇒ b = ${b}, m = ${e2} − ${5*b} = ${a+c}`);
}

/* 4. VAQT */
const KUN = ['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba'];
function clockSvg(hh, mm){
  const ang = (deg,len)=>[60+len*Math.sin(deg*Math.PI/180), 60-len*Math.cos(deg*Math.PI/180)];
  let ticks=''; for(let i=1;i<=12;i++){ const [x,y]=ang(i*30,44); ticks+=S.txt(x,y,i,13); }
  const [hx,hy]=ang((hh%12)*30+mm/2,28), [mx,my]=ang(mm*6,40);
  return S.wrap(120,120,`<circle cx="60" cy="60" r="56" fill="#fff" stroke="#6C4CF1" stroke-width="4"/>${ticks}<line x1="60" y1="60" x2="${hx}" y2="${hy}" stroke="#2B2350" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="${mx}" y2="${my}" stroke="#FF8A00" stroke-width="3.5" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#2B2350"/>`).replace('width="120"','width="150"');
}
const hm = (h,m)=> h ? `${h} soat ${m} min` : `${m} min`;
function time(lv){
  const t = lv===1 ? ri(0,3) : lv===2 ? ri(2,6) : ri(4,8);
  if (t===0){ const hh=ri(1,12), mm=pick([0,15,30,45,10,20,40,50,5,25,35,55]); const ans=`${hh}:${String(mm).padStart(2,'0')}`;
    const d=[`${(hh%12)+1}:${String(mm).padStart(2,'0')}`, `${hh}:${String((mm+30)%60).padStart(2,'0')}`, `${mm/5||12}:${String(hh*5%60).padStart(2,'0')}`, `${hh===1?12:hh-1}:${String(mm).padStart(2,'0')}`];
    return Q(`Soat qanday vaqtni ko'rsatmoqda?`, ans, d, `Kichik (qora) mil soatni, katta (to'q sariq) mil daqiqani ko'rsatadi: ${ans}`, {html:clockSvg(hh,mm), fmt:String}); }
  if (t===1){ const m=ri(2,9), s=ri(5,55); const r=m*60+s; return Q(`<b>${m} min ${s} s</b> = ? sekund`, r, [m*100+s, r+60, r-60, m*60], `1 min = 60 s. ${m}·60 + ${s} = ${r} s`); }
  if (t===2){ const h=ri(2,6), m=ri(5,55); return Q(`<b>${h} soat ${m} daqiqa</b> necha daqiqa?`, h*60+m, [h*100+m, h*60+m+60, h*60, h*60+m-10], `${h}·60 + ${m} = ${h*60+m} daqiqa`); }
  if (t===3){ const d=ri(2,6), h=ri(1,20); return Q(`<b>${d} sutka ${h} soat</b> necha soat?`, d*24+h, [d*12+h, d*24+h+24, d*20+h, d*60+h], `1 sutka = 24 soat. ${d}·24 + ${h} = ${d*24+h}`); }
  if (t===4){ const h1=ri(3,9), m1=ri(5,40), h2=ri(1,h1-1), m2=ri(m1+5,59); const tot=(h1*60+m1)-(h2*60+m2); const R=hm(Math.floor(tot/60),tot%60);
    return Q(`Hisoblang: <b>${hm(h1,m1)} − ${hm(h2,m2)}</b>`, R, [hm(Math.floor(tot/60)+1,tot%60), hm(h1-h2,m2-m1), hm(Math.floor(tot/60),(tot%60+20)%60), hm(Math.floor(tot/60)+1,(m2-m1))], `${hm(h1,m1)} = ${h1-1} soat ${m1+60} min. ${m1+60}−${m2}=${m1+60-m2} min, ${h1-1}−${h2}=${h1-1-h2} soat. Javob: ${R}`, {fmt:String}); }
  if (t===5){ const a=ri(7,11), am=ri(0,55), dur=ri(70,250); const e=a*60+am+dur; const R=`${Math.floor(e/60)}:${String(e%60).padStart(2,'0')}`;
    return Q(`Dars soat <b>${a}:${String(am).padStart(2,'0')}</b> da boshlanib, <b>${dur} daqiqa</b> davom etdi. Dars soat nechada tugadi?`, R, [`${Math.floor(e/60)+1}:${String(e%60).padStart(2,'0')}`, `${Math.floor((e-60)/60)}:${String(e%60).padStart(2,'0')}`, `${Math.floor(e/60)}:${String((e+10)%60).padStart(2,'0')}`, `${a+Math.floor(dur/100)}:${String((am+dur%100)%60).padStart(2,'0')}`], `${dur} daqiqa = ${Math.floor(dur/60)} soat ${dur%60} daqiqa. ${a}:${String(am).padStart(2,'0')} + ${Math.floor(dur/60)} s ${dur%60} min = ${R}`, {fmt:String}); }
  if (t===6){ const s=ri(0,6), n=ri(10,60); const e=(s+n)%7; return Q(`Bugun <b>${KUN[s]}</b>. <b>${n} kundan</b> keyin haftaning qaysi kuni bo'ladi?`, KUN[e], KUN.filter((_,i)=>i!==e), `Har 7 kunda hafta kuni takrorlanadi. ${n} = 7·${Math.floor(n/7)} + ${n%7}. ${KUN[s]}dan ${n%7} kun keyin — ${KUN[e]}.`, {fmt:String}); }
  if (t===7){ const behind=ri(5,15), think=ri(5,20); const H=12, M=ri(10,40);
    // soat orqada 'behind' min, u 'think' min oldinda deb o'ylaydi. Soatga qarab vaqt T bo'ldi deb o'yladi.
    const tf = m => `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
    const shown = H*60+M + think; const real = shown + behind; const R=tf(real);
    return Q(`Salimning soati <b>${behind} daqiqa orqada</b>. Lekin u soatini <b>${think} daqiqa oldinda</b> deb o'ylaydi. Soatiga qarab, u vaqt <b>${H}:${String(M).padStart(2,'0')}</b> bo'ldi deb o'yladi. Aslida soat necha?`, R,
      [tf(H*60+M), tf(H*60+M+behind), tf(H*60+M+think), tf(H*60+M-think+behind)],
      `Salim soat ko'rsatgan vaqtdan ${think} daqiqani ayirib o'ylagan. Demak soat ${tf(shown)} ni ko'rsatgan. Soat ${behind} daqiqa orqada, shuning uchun haqiqiy vaqt: ${tf(shown)} + ${behind} min = ${R}.`, {fmt:String}); }
  const fl1=ri(1,3), fl2=fl1+ri(2,4), sec=ri(4,8); const per=sec; const a=ri(2,4), b=a+ri(3,6);
  return Q(`Lift ${fl1}-qavatdan ${fl2}-qavatga <b>${(fl2-fl1)*per} soniyada</b> ko'tariladi. U ${a}-qavatdan ${b}-qavatga necha soniyada ko'tariladi?`, (b-a)*per, [b*per/1, (b-a+1)*per, (b-a-1)*per, Math.round((fl2-fl1)*per*b/fl2)], `${fl1}→${fl2}: ${fl2-fl1} ta qavat oralig'i, har biri ${per} s. ${a}→${b}: ${b-a} ta oraliq · ${per} = ${(b-a)*per} s. (Qavatlar sonini emas, oraliqlarni sanaymiz!)`);
}

/* 5. O'LCHOV BIRLIKLARI */
function units(lv){
  const t = lv===1 ? ri(0,3) : lv===2 ? ri(2,6) : ri(4,7);
  if (t===0){ const m=ri(2,9), cm=ri(5,95); return Q(`<b>${m} m ${cm} sm</b> = ? sm`, m*100+cm, [m*10+cm, m*1000+cm, m*100+cm+100, m+cm], `1 m = 100 sm. ${m}·100 + ${cm} = ${m*100+cm} sm`); }
  if (t===1){ const kg=ri(2,9), g=ri(50,950); return Q(`<b>${kg} kg ${g} g</b> = ? g`, kg*1000+g, [kg*100+g, kg*1000+g+1000, kg+g, kg*10000+g], `1 kg = 1000 g. ${kg}·1000 + ${g} = ${kg*1000+g} g`); }
  if (t===2){ const km=ri(2,9), m=ri(50,950); return Q(`<b>${km} km ${m} m</b> = ? m`, km*1000+m, [km*100+m, km*1000+m*10, km*10000+m, km+m], `1 km = 1000 m. ${km*1000+m} m`); }
  if (t===3){ const dm=ri(2,9), cm=ri(1,9); return Q(`<b>${dm} dm ${cm} sm</b> = ? mm`, dm*100+cm*10, [dm*10+cm, dm*100+cm, dm*1000+cm*10, dm*100+cm*100], `1 dm = 100 mm, 1 sm = 10 mm. ${dm*100}+${cm*10} = ${dm*100+cm*10} mm`); }
  if (t===4){ const opts=[['4 km/soat',1],['4 km/min',0],['400 m/soat',0],['40 km/min',0]]; const kind=pick(['walk','car','snail']);
    const sets = {walk:{q:'Anvar maktabga piyoda boradi. Uning tezligi qaysi biriga teng bo\'lishi mumkin?',c:'5 km/soat',d:['5 km/min','50 m/soat','50 km/min'],e:'Odam piyoda soatiga taxminan 4-6 km yuradi. 5 km/min — mashinadan ham tez!'},
      car:{q:'Yengil mashinaning shahar tashqarisidagi tezligi qaysi biri bo\'lishi mumkin?',c:'90 km/soat',d:['90 m/soat','9 km/min','900 km/soat'],e:'Mashina odatda soatiga 60-100 km yuradi. 900 km/soat — samolyot tezligi.'},
      snail:{q:'Shilliqqurt (ulitka) tezligi qaysi biri bo\'lishi mumkin?',c:'5 m/soat',d:['5 km/soat','5 m/s','50 km/soat'],e:'Shilliqqurt juda sekin — soatiga bir necha metr yuradi.'}}[kind];
    return Q(sets.q, sets.c, sets.d, sets.e, {fmt:String}); }
  if (t===5){ const L=ri(2,6)*1, n=pick([10,20,25,50]); const len=L*100; const pieces=len/n; return Q(`<b>${L} m</b> uzunlikdagi arqon har <b>${n} sm</b> dan qirqildi. Nechta bo'lak hosil bo'ladi?`, pieces, [pieces-1, pieces+1, L*n, len], `${L} m = ${len} sm. ${len} : ${n} = ${pieces} ta bo'lak`); }
  if (t===6){ const l=ri(2,9), w=ri(2,9), hh=ri(2,9); return Q(`Akvarium o'lchamlari: uzunligi <b>${l} dm</b>, eni <b>${w} dm</b>, balandligi <b>${hh} dm</b>. Unga necha litr suv sig'adi? (1 dm³ = 1 litr)`, l*w*hh, [l*w+hh, 2*(l+w+hh), l*w*hh+l*w, (l+w)*hh], `Hajm = ${l}·${w}·${hh} = ${l*w*hh} dm³ = ${l*w*hh} litr`); }
  const l=8, w=pick([5,4,6]), hh=ri(5,7), full=l*w*hh, water=full-ri(10,full/2|0);
  return Q(`Akvarium uzunligi <b>${l} dm</b>, eni <b>${w*10} sm</b>. Unda <b>${water} litr</b> suv bor, to'ldirish uchun yana <b>${full-water} litr</b> kerak. Akvarium balandligi qancha?`, `${hh} dm`, [`${hh+1} dm`, `${hh*10+4} sm`, `${hh-1} dm`, `${(hh*10+5)} sm`], `To'liq hajm: ${water}+${full-water} = ${full} litr = ${full} dm³. Eni ${w*10} sm = ${w} dm. Balandlik = ${full} : (${l}·${w}) = ${hh} dm`, {fmt:String});
}

/* 6. GEOMETRIYA */
function rectSvg(a,b,unit){
  const W=Math.min(260, 26*a), H=Math.min(160, 26*b);
  return S.wrap(W+60,H+50, `<rect x="30" y="10" width="${W}" height="${H}" fill="#EEE9FF" stroke="#6C4CF1" stroke-width="3" rx="2"/>${S.txt(30+W/2,H+32,a+' '+unit)}${S.txt(18,10+H/2,b+' '+unit,18,'#2B2350','end').replace('text-anchor="end"','text-anchor="end"')}`);
}
function lShapeSvg(W,H,cw,ch){ // to'g'ri to'rtburchakdan yuqori o'ng burchak kesilgan
  const sx=240/W, sy=170/H; const s=Math.min(sx,sy);
  const P=(x,y)=>[20+x*s, 10+y*s];
  const pts=[P(0,0),P(W-cw,0),P(W-cw,ch),P(W,ch),P(W,H),P(0,H)];
  return S.wrap(W*s+90, H*s+50, S.poly(pts) + S.txt(20+(W*s)/2, 10+H*s+22, W+' sm') + S.txt(12, 10+H*s/2, H+' sm',16,'#2B2350','end') + S.txt(20+(W-cw/2)*s, 10+ch*s-12, cw+' sm') + S.txt(20+W*s+8, 10+(ch+(H-ch)/2)*s, (H-ch)+' sm',16,'#2B2350','start'));
}
const SOLIDS = [
  {n:'kub', e:12, v:8, f:6}, {n:'to\'rtburchakli piramida', e:8, v:5, f:5}, {n:'uchburchakli piramida', e:6, v:4, f:4},
  {n:'uchburchakli prizma', e:9, v:6, f:5}, {n:'to\'g\'ri burchakli parallelepiped', e:12, v:8, f:6}, {n:'beshburchakli piramida', e:10, v:6, f:6}];
function pyramidSvg(){ return S.wrap(200,170,`<polygon points="20,150 130,150 180,115" fill="#EEE9FF" stroke="none"/><line x1="100" y1="10" x2="20" y2="150" stroke="#6C4CF1" stroke-width="3"/><line x1="100" y1="10" x2="130" y2="150" stroke="#6C4CF1" stroke-width="3"/><line x1="100" y1="10" x2="180" y2="115" stroke="#6C4CF1" stroke-width="3"/><line x1="100" y1="10" x2="70" y2="115" stroke="#6C4CF1" stroke-width="2.5" stroke-dasharray="7 6"/><line x1="20" y1="150" x2="130" y2="150" stroke="#6C4CF1" stroke-width="3"/><line x1="130" y1="150" x2="180" y2="115" stroke="#6C4CF1" stroke-width="3"/><line x1="20" y1="150" x2="70" y2="115" stroke="#6C4CF1" stroke-width="2.5" stroke-dasharray="7 6"/><line x1="70" y1="115" x2="180" y2="115" stroke="#6C4CF1" stroke-width="2.5" stroke-dasharray="7 6"/>`); }
function geom(lv){
  const t = lv===1 ? ri(0,3) : lv===2 ? ri(2,6) : ri(4,8);
  if (t===0){ const a=ri(3,12), b=ri(2,9); return Q(`To'g'ri to'rtburchakning perimetrini toping.`, `${2*(a+b)} sm`, [`${a*b} sm`, `${a+b} sm`, `${2*(a+b)+2} sm`, `${2*a+b} sm`], `P = 2·(${a}+${b}) = ${2*(a+b)} sm`, {html:rectSvg(a,b,'sm'), fmt:String}); }
  if (t===1){ const a=ri(3,12), b=ri(2,9); return Q(`To'g'ri to'rtburchakning yuzini toping.`, `${a*b} sm²`, [`${2*(a+b)} sm²`, `${a*b+a} sm²`, `${a+b} sm²`, `${a*b-b} sm²`], `S = ${a}·${b} = ${a*b} sm²`, {html:rectSvg(a,b,'sm'), fmt:String}); }
  if (t===2){ const P=4*ri(3,12); const a=P/4; return Q(`Kvadratning perimetri <b>${P} sm</b>. Uning yuzini toping.`, a*a, [P, a*4, a*a+a, (a+1)*(a+1)], `Tomoni = ${P} : 4 = ${a} sm. Yuzi = ${a}·${a} = ${a*a} sm²`); }
  if (t===3){ const s=pick(SOLIDS); const k=pick(['e','v','f']); const nm={e:'qirrasi',v:'uchi',f:'yog\'i'}[k];
    return Q(`<b>${s.n[0].toUpperCase()+s.n.slice(1)}</b>ning nechta ${nm} bor?`, s[k], [s.e,s.v,s.f,s[k]+1,s[k]-1].filter(x=>x!==s[k]), `${s.n}: ${s.v} ta uch, ${s.e} ta qirra, ${s.f} ta yoq.`, k==='e'&&s.n.startsWith('to\'rt')?{html:pyramidSvg()}:{}); }
  if (t===4){ const W=ri(10,16), H=ri(9,14), cw=ri(3,W-5), ch=ri(2,H-5); const P=2*(W+H);
    return Q(`Shaklning perimetrini toping. (Barcha burchaklar to'g'ri)`, `${P} sm`, [`${P-2*ch} sm`, `${P+2*ch} sm`, `${P-cw} sm`, `${W*H} sm`], `Kesilgan burchak perimetrni o'zgartirmaydi: tomonlarni "surib" to'g'ri to'rtburchak hosil qilamiz. P = 2·(${W}+${H}) = ${P} sm`, {html:lShapeSvg(W,H,cw,ch), fmt:String}); }
  if (t===5){ const d=pick([10,20,30,40,50,60]); const sm=(180-d)/2; return Q(`Yoyiq burchak ikki burchakka ajratildi, ulardan biri ikkinchisidan <b>${d}°</b> katta. Kichigini toping.`, `${sm}°`, [`${sm+d}°`, `${90-d}°`, `${sm+10}°`, `${180-d}°`], `Yoyiq burchak = 180°. (180° − ${d}°) : 2 = ${sm}°`, {fmt:String}); }
  if (t===6){ const a=ri(30,80), b=ri(30,100-a+40); const c=180-a-b; if (c<=10) return geom(lv); return Q(`Uchburchakning ikki burchagi <b>${a}°</b> va <b>${b}°</b>. Uchinchi burchagini toping.`, `${c}°`, [`${c+10}°`, `${360-a-b}°`, `${90-a>0?90-a:c-10}°`, `${c-5}°`], `Uchburchak burchaklari yig'indisi 180°. 180 − ${a} − ${b} = ${c}°`, {fmt:String}); }
  if (t===7){ const n=ri(2,5); const sq=n*n; const small=[...Array(n)].reduce((s,_,i)=>s+(i+1)*(i+1),0); return Q(`<b>${n}×${n}</b> katakli kvadratda jami nechta kvadrat bor? (turli o'lchamdagilarini ham sanang)`, small, [sq, sq+1, small+n, small-1], `1×1: ${n*n}, ` + [...Array(n-1)].map((_,i)=>`${i+2}×${i+2}: ${(n-i-1)*(n-i-1)}`).join(', ') + `. Jami ${small}`); }
  const side=ri(2,6); const cubes=pick([2,3]); return Q(`Qirrasi <b>${side} sm</b> bo'lgan ${cubes} ta kub yonma-yon (bitta qatorga) qo'yildi. Hosil bo'lgan shaklning hajmini toping.`, cubes*side*side*side, [side*side*side, cubes*side*side, cubes*side*3, cubes*side*side*side+side], `Bitta kub hajmi ${side}·${side}·${side} = ${side**3} sm³. ${cubes} tasi: ${cubes*side**3} sm³`);
}

/* 7. MATNLI MASALALAR */
const NAMES = ['Ali','Vali','Botir','Anvar','Madina','Zarina','Jasur','Nodira','Sardor','Laylo','Aziz','Kamola','Diyor','Shahzoda','Bekzod','Malika'];
const THINGS = [['qalam','ta'],['olma','ta'],['kitob','ta'],['konfet','ta'],['marka','ta'],['daftar','ta']];
function word(lv){
  const [A,B] = shuffle(NAMES); const [th] = pick(THINGS);
  const t = lv===1 ? ri(0,3) : lv===2 ? ri(2,7) : ri(5,11);
  if (t===0){ const a=ri(10,40), d=ri(3,12); const b=a+d; return Q(`${A}da <b>${a} ta ${th}</b> bor, bu ${B}nikidan <b>${d} ta kam</b>. Ikkalasida jami nechta ${th} bor?`, a+b, [a+a-d, a+d, b, a*2], `"${d} ta kam" — demak ${B}da ${a}+${d}=${b} ta. Jami: ${a}+${b}=${a+b}`); }
  if (t===1){ const a=ri(3,9), k=ri(2,5); return Q(`${A}da <b>${a} ta ${th}</b> bor. ${B}da undan <b>${k} marta ko'p</b>. ${B}da nechta ${th} bor?`, a*k, [a+k, a*k+a, a*(k-1), a*k-k], `${a} · ${k} = ${a*k}`); }
  if (t===2){ const p=ri(15,60)*100, n=ri(2,6), q=ri(5,30)*100; return Q(`Daftar <b>${p} so'm</b>, ruchka <b>${q} so'm</b>. ${A} ${n} ta daftar va 1 ta ruchka oldi. Jami qancha to'ladi?`, `${fmtN(n*p+q)} so'm`, [`${fmtN(n*(p+q))} so'm`, `${fmtN(p+q)} so'm`, `${fmtN(n*p)} so'm`, `${fmtN(n*p+q+100)} so'm`], `${n}·${p} + ${q} = ${n*p+q} so'm`, {fmt:String}); }
  if (t===3){ const tot=ri(30,80), give=ri(5,15), get=ri(3,10); return Q(`${A}da <b>${tot} ta ${th}</b> bor edi. U do'stiga <b>${give} ta</b> berdi, keyin onasi unga yana <b>${get} ta</b> berdi. Hozir nechta?`, tot-give+get, [tot-give-get, tot+give+get, tot-give, tot+get], `${tot} − ${give} + ${get} = ${tot-give+get}`); }
  if (t===4){ const small=ri(10,90)*(lv>2?2:1), k=ri(2,5); const diff=small*(k-1); return Q(`Ikki sonning ayirmasi <b>${diff}</b> ga teng. Birinchi son ikkinchisidan <b>${k} marta kichik</b>. Shu sonlarni toping.`, `${small}, ${small*k}`, [`${small*2}, ${small*k*2}`, `${small+10}, ${small*k+10}`, `${small-k}, ${(small-k)*k}`, `${diff}, ${diff*k}`], `Kichik son 1 qism bo'lsa, katta son ${k} qism. Ayirma ${k-1} qism = ${diff} ⇒ 1 qism = ${small}. Sonlar: ${small} va ${small*k}`, {fmt:String}); }
  if (t===5){ const a=ri(5,25), b=ri(5,25); const s=a+b, d=Math.abs(a-b); if (!d) return word(lv); const big=Math.max(a,b), sm=Math.min(a,b);
    return Q(`${A} va ${B}da jami <b>${s} ta ${th}</b> bor. ${A}da ${B}nikidan <b>${d} ta ko'p</b>. ${A}da nechta ${th} bor?`, big, [sm, s-d, big+d, s/2|0], `(${s} + ${d}) : 2 = ${big}. ${B}da: ${sm}`); }
  if (t===6){ const per=ri(3,7), sticks=ri(5,9), broke=ri(1,sticks-1); const tot=sticks-broke+broke*per; return Q(`${A} ${sticks} ta cho'pdan bir nechtasini <b>${per} bo'lakka</b> bo'ldi. Natijada jami <b>${tot} ta</b> cho'p bo'ldi. Sinmay qolgan cho'plar nechta?`, sticks-broke, [broke, sticks-broke+1, sticks-broke-1, tot-sticks], `Har bir singan cho'p ${per-1} ta qo'shimcha cho'p beradi. Qo'shimcha: ${tot}−${sticks} = ${tot-sticks} ⇒ ${tot-sticks}:${per-1} = ${broke} ta singan. Sinmagan: ${sticks}−${broke} = ${sticks-broke}`); }
  if (t===7){ const v=ri(40,80), tt=ri(2,5); return Q(`Avtobus <b>${v} km/soat</b> tezlik bilan <b>${tt} soat</b> yurdi. U qancha masofani bosib o'tdi?`, v*tt, [v+tt, v*tt+v, v*(tt-1), v*tt/2], `S = v · t = ${v}·${tt} = ${v*tt} km`); }
  if (t===8){ const v1=ri(40,70), v2=ri(50,90), tt=ri(2,4); const D=(v1+v2)*tt; return Q(`Orasidagi masofa <b>${D} km</b> bo'lgan ikki shahardan bir vaqtda bir-biriga qarab ikki mashina yo'lga chiqdi. Tezliklari <b>${v1}</b> va <b>${v2} km/soat</b>. Ular necha soatdan keyin uchrashadi?`, tt, [tt+1, tt*2, D/v1|0, tt+2], `Yaqinlashish tezligi ${v1}+${v2} = ${v1+v2} km/soat. ${D} : ${v1+v2} = ${tt} soat`); }
  if (t===9){ const a=ri(30,60), d=ri(3,9); const daysPer=a+(a+d); const total=daysPer*ri(5,16); const days=total/daysPer;
    const s=ri(0,5); let wd=0, idx=0; // yakshanba dam olish
    let rem=days, cur=0; while(rem>0){ if (cur%7!==6) rem--; if (rem>0) cur++; } const endDay=KUN[cur%7];
    return Q(`Bir ishchi bir kunda <b>${a} ta</b> buyum, ikkinchisi undan <b>${d} ta ko'p</b> tayyorlaydi. Ular birgalikda ishni <b>dushanba</b> boshlashsa, jami <b>${total} ta</b> buyumni haftaning qaysi kuni tugatishadi? (Yakshanba — dam olish kuni)`, endDay, KUN.slice(0,6).filter(k=>k!==endDay), `Bir kunda: ${a}+${a+d} = ${daysPer} ta. ${total}:${daysPer} = ${days} ish kuni. Yakshanbalarni tashlab sanaymiz → ${endDay}.`, {fmt:String}); }
  if (t===10){ const age=ri(6,12), k=ri(3,5), y=ri(2,8); const fa=age*k; return Q(`${A} ${age} yoshda, otasi undan <b>${k} marta katta</b>. <b>${y} yildan keyin</b> ularning yoshlari yig'indisi nechaga teng bo'ladi?`, age+fa+2*y, [age+fa+y, age+fa, age+fa+2*y+2, (age+y)*k], `Hozir: ${age}+${fa} = ${age+fa}. Har yili yig'indi 2 ga ortadi: ${age+fa}+2·${y} = ${age+fa+2*y}`); }
  const p1=ri(4,8)*1, rate=pick([1,3]); const full=7, half=3; const hours=ri(2,6); const pay=full + (hours-1)*2*half;
  return Q(`Velosiped ijarasi: <b>1-soat — $${full}</b>, qo'shimcha har yarim soat — <b>$${half}</b> dan. Aziz <b>${hours} soat</b> velosiped mindi. U qancha to'laydi?`, `$${pay}`, [`$${full*hours}`, `$${full+(hours-1)*half}`, `$${pay+half}`, `$${pay-half}`], `1-soat: $${full}. Qolgan ${hours-1} soat = ${(hours-1)*2} ta yarim soat · $${half} = $${(hours-1)*2*half}. Jami $${pay}`, {fmt:String});
}

/* 8. KASRLAR */
function gridSvg(cols, rows, shaded){
  let b=''; const s=34; let k=0;
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){ b+=`<rect x="${4+c*s}" y="${4+r*s}" width="${s}" height="${s}" fill="${shaded.includes(k)?'#2D9CDB':'#fff'}" stroke="#2B2350" stroke-width="2"/>`; k++; }
  return S.wrap(cols*s+8, rows*s+8, b);
}
function frac(lv){
  const t = lv===1 ? ri(0,2) : lv===2 ? ri(1,5) : ri(3,7);
  if (t===0){ const d=pick([2,3,4,5,6,8,10]), n=ri(1,d-1), m=d*ri(2,12); return Q(`<b>${m}</b> ning <b>${n}/${d}</b> qismini toping.`, m/d*n, [m/d, m*n, m/n|0, m/d*(n+1)], `${m} : ${d} = ${m/d} (bir qism). ${m/d} · ${n} = ${m/d*n}`); }
  if (t===1){ const cols=ri(4,6), rows=ri(2,4), tot=cols*rows; const sh=ri(2,tot-2); const cells=shuffle([...Array(tot).keys()]).slice(0,sh);
    return Q(`Shaklning qanday qismi bo'yalgan?`, `${sh}/${tot}`, [`${tot-sh}/${tot}`, `${sh}/${tot-sh}`, `${sh+1}/${tot}`, `${tot}/${sh}`], `Jami ${tot} ta katak, ${sh} tasi bo'yalgan: ${sh}/${tot}`, {html:gridSvg(cols,rows,cells), fmt:String}); }
  if (t===2){ const d=pick([5,6,7,8,9,10,12]); const a=ri(1,d-1); let b=ri(1,d-1); while(b===a) b=ri(1,d-1); const big=Math.max(a,b);
    return Q(`Qaysi kasr katta: <b>${a}/${d}</b> yoki <b>${b}/${d}</b>?`, `${big}/${d}`, [`${Math.min(a,b)}/${d}`, 'Ular teng', `Aniqlab bo'lmaydi`], `Maxrajlar teng bo'lsa, surati katta kasr katta: ${big}/${d}`, {fmt:String}); }
  if (t===3){ const n=ri(1,3), d=n+ri(1,4); const part=ri(2,8); const whole=d*part; const read=n*part; return Q(`Kitob <b>${whole} betli</b>. Madina uning <b>${n}/${d}</b> qismini o'qidi. Yana necha bet qoldi?`, whole-read, [read, whole/d, whole-read+part, whole-n], `${whole}:${d}·${n} = ${read} bet o'qildi. ${whole}−${read} = ${whole-read} bet qoldi`); }
  if (t===4){ const d=pick([2,3,4,5]), q=ri(3,9); const part=q; const tot=d*part; return Q(`Sonning <b>1/${d}</b> qismi <b>${part}</b> ga teng. Sonning o'zini toping.`, tot, [part+d, part*(d+1), part, tot+d], `Butun son = ${part} · ${d} = ${tot}`); }
  if (t===5){ const a=pick([[1,2],[1,3],[2,3],[1,4],[3,4],[2,5]]); const k=ri(2,4); return Q(`Qaysi kasr <b>${a[0]}/${a[1]}</b> ga teng?`, `${a[0]*k}/${a[1]*k}`, [`${a[0]+k}/${a[1]+k}`, `${a[0]*k}/${a[1]+k}`, `${a[1]}/${a[0]}`, `${a[0]*k+1}/${a[1]*k}`], `Surat va maxrajni ${k} ga ko'paytiramiz: ${a[0]*k}/${a[1]*k}`, {fmt:String}); }
  if (t===6){ const V=pick([40,48,56,64,72,80]); const q1=pick([[1,4],[1,8],[3,8]]); const q2=[5,8]; const w1=V*q1[0]/q1[1], w2=V*q2[0]/q2[1]; const add=w2-w1; if (add<=0) return frac(lv);
    return Q(`Idishning <b>${q1[0]}/${q1[1]}</b> qismida suv bor. Idishga <b>${add} litr</b> suv quyilgach, uning <b>5/8</b> qismi to'ldi. Idish hajmini toping.`, V, [V+8, V-8, add*2, V+16], `${q2[0]}/8 − ${q1[0]*8/q1[1]}/8 = ${(w2-w1)*8/V}/8 qism = ${add} litr. 1/8 qism = ${V/8} l, butun idish ${V} litr`); }
  const tot=ri(2,6)*12; return Q(`Sinfda <b>${tot}</b> o'quvchi bor. Ularning <b>1/3</b> qismi qizlar, qolganlari o'g'il bolalar. O'g'il bolalar qizlardan nechta ko'p?`, tot/3, [tot/3*2, tot/2, tot/6, tot/3+2], `Qizlar ${tot/3}, o'g'illar ${tot/3*2}. Farq ${tot/3}`);
}

/* 9. SONLAR XOSSALARI */
const ROM = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
const toRom = n => { let s=''; for (const [v,r] of ROM) while(n>=v){ s+=r; n-=v; } return s; };
function nums(lv){
  const t = lv===1 ? ri(0,3) : lv===2 ? ri(2,6) : ri(4,9);
  if (t===0){ const arr=shuffle([...Array(6)].map(()=>ri(1000,6999))); const k=ri(2,4); const sorted=arr.slice().sort((a,b)=>a-b);
    return Q(`Sonlar o'sish tartibida joylashtirilsa, <b>${k}-o'rinda</b> qaysi son turadi?\n<b>${arr.join(', ')}</b>`, sorted[k-1], [sorted[k-2], sorted[k], arr[k-1], sorted[6-k]], `Tartib: ${sorted.join(' < ')}. ${k}-o'rinda: ${sorted[k-1]}`); }
  if (t===1){ const n=ri(11,3999); const r=toRom(n); return Q(`<b>${n}</b> soni rim raqamlarida qanday yoziladi?`, r, [toRom(n+1), toRom(n-1)+'I', toRom(n+10), r.split('').reverse().join('')].filter(x=>x!==r), `Rim raqamlari: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. ${n} = ${r}`, {fmt:String}); }
  if (t===2){ const n=ri(1234,98765); const p=pick([10,100,1000]); const R=Math.round(n/p)*p; return Q(`<b>${n}</b> sonini ${p===10?'o\'nlar':p===100?'yuzlar':'minglar'} xonasigacha yaxlitlang.`, R, [Math.floor(n/p)*p===R?Math.ceil(n/p)*p:Math.floor(n/p)*p, R+p, n, R-p*2], `Yaxlitlashda keyingi raqamga qaraymiz: 5 va undan katta bo'lsa — yuqoriga. Javob: ${R}`); }
  if (t===3){ const a=ri(2,9); const q=pick([[3,'3'],[5,'5'],[9,'9'],[4,'4']]); const base=ri(10,99)*q[0];
    const list=shuffle([base, base+1, base+2, base+q[0]+1, base+q[0]*3, base-1]).slice(0,6); const cnt=list.filter(x=>x%q[0]===0).length;
    return Q(`Quyidagi sonlardan nechtasi <b>${q[1]}</b> ga qoldiqsiz bo'linadi?\n<b>${list.join('; ')}</b>`, cnt, [cnt+1, cnt-1>=0?cnt-1:cnt+2, cnt+2, list.length], `${q[0]} ga bo'linadiganlar: ${list.filter(x=>x%q[0]===0).join(', ')}`); }
  if (t===4){ const pr=pick([[2,3],[2,5],[3,4],[3,5]]); const L=pr[0]*pr[1]; const cnt=Math.floor(99/L)-Math.floor(9/L);
    return Q(`Barcha ikki xonali sonlar ichida <b>${pr[0]}</b> ga ham, <b>${pr[1]}</b> ga ham bo'linadiganlari nechta?`, cnt, [cnt+1, cnt-1, Math.floor(90/pr[0]), cnt+2], `${pr[0]} ga ham ${pr[1]} ga ham bo'linadigan son ${L} ga bo'linadi. 10..99 orasida: ${Math.ceil(10/L)*L} dan ${Math.floor(99/L)*L} gacha — ${cnt} ta`); }
  if (t===5){ const k=pick([3,4]); const ans= k===3?102:1023; return Q(`Barcha raqamlari turlicha bo'lgan eng kichik <b>${k} xonali</b> sonni toping.`, ans, k===3?[123,100,120]:[1234,1000,1203], `Birinchi raqam 0 bo'lolmaydi, shuning uchun 1; keyin eng kichiklari: 0, 2${k===4?', 3':''}. Javob: ${ans}`); }
  if (t===6){ const d=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,4); const evens=d.filter(x=>x%2===0); if(!evens.length) return nums(lv);
    const perms=[]; const per=(arr,cur)=>{ if(!arr.length){perms.push(+cur.join(''));return;} arr.forEach((x,i)=>per(arr.filter((_,j)=>j!==i),cur.concat(x))); }; per(d,[]);
    const ev=perms.filter(x=>x%2===0); const mx=Math.max(...ev), mn=Math.min(...ev);
    return Q(`<b>${d.join(', ')}</b> raqamlarini faqat bir martadan ishlatib tuzish mumkin bo'lgan eng katta va eng kichik <b>juft</b> sonlar ayirmasini toping.`, mx-mn, [Math.max(...perms)-Math.min(...perms), mx-mn+9, mx-mn-18, mx-Math.min(...perms)], `Eng katta juft: ${mx}, eng kichik juft: ${mn}. Ayirma: ${mx-mn}`); }
  if (t===7){ const y=ri(2001,2019); const r=Math.round(y/10)*10; const ok=[r-5,r+4].map(v=>Math.max(v,r-5)); const bad = r+5;
    const a=r-ri(1,4), b=r+ri(0,4), c=r+5;
    return Q(`Ikki aka-uka tug'ilgan yillarini o'nlar xonasigacha yaxlitlashdi va ikkalasida ham <b>${r}</b> chiqdi. Quyidagilardan qaysi biri ularning tug'ilgan yillari bo'la <b>olmaydi</b>?`, `${a}, ${c}`, [`${r-5}, ${r+4}`, `${r}, ${r+2}`, `${r-1}, ${r+3}`, `${r-3}, ${r+1}`], `${r} ga yaxlitlanadigan yillar: ${r-5} dan ${r+4} gacha. ${c} esa ${r+10} ga yaxlitlanadi.`, {fmt:String}); }
  if (t===8){ const n=pick([123456,401319,234221,583920,719432]); const s=String(n); const del=pick([2,3]);
    // eng katta qoldirish (greedy)
    const keep=s.length-del; let res='', start=0; for(let i=0;i<keep;i++){ let best=-1,bi=start; for(let j=start;j<=s.length-(keep-i);j++){ if(+s[j]>best){best=+s[j];bi=j;} } res+=s[bi]; start=bi+1; }
    const wrong1 = s.slice(0,keep), wrong2 = s.slice(del);
    return Q(`<b>${n}</b> sonidan shunday <b>${del} ta</b> raqamni o'chiringki, qolgan son eng <b>katta</b> bo'lsin.`, +res, [+wrong1, +wrong2, +s.split('').sort().reverse().join('').slice(0,keep)].filter(x=>x!==+res), `Har qadamda chapdan imkon qadar katta raqam tanlaymiz (tartibni buzmasdan). Javob: ${res}`); }
  const k=ri(3,6); const p=Math.pow(10,k-1); return Q(`Eng katta <b>${k} xonali</b> son bilan eng kichik <b>${k} xonali</b> son ayirmasi nechaga teng?`, (p*10-1)-p, [p*10-1, p*9, (p*10-1)-p+1, p*8], `${p*10-1} − ${p} = ${(p*10-1)-p}`);
}

/* 10. JADVAL VA DIAGRAMMA */
function barSvg(labels, vals, unit){
  const W=Math.max(300, labels.length*70), H=200, mx=Math.max(...vals)*1.15; const bw=40;
  let b=`<line x1="40" y1="170" x2="${W-10}" y2="170" stroke="#2B2350" stroke-width="2"/><line x1="40" y1="10" x2="40" y2="170" stroke="#2B2350" stroke-width="2"/>`;
  const step = mx>60?20:mx>30?10:5;
  for (let v=0; v<=mx; v+=step){ const y=170-v/mx*155; b+=`<line x1="36" y1="${y}" x2="${W-10}" y2="${y}" stroke="#ddd" stroke-width="1"/>`+S.txt(30,y,v,12,'#6B6590','end'); }
  const cols=['#6C4CF1','#FF8A00','#1FB866','#FF4F8B','#2D9CDB','#FFC93C'];
  labels.forEach((l,i)=>{ const x=60+i*((W-70)/labels.length); const hgt=vals[i]/mx*155; b+=`<rect x="${x}" y="${170-hgt}" width="${bw}" height="${hgt}" rx="5" fill="${cols[i%6]}"/>`+S.txt(x+bw/2,186,l,13); });
  return S.wrap(W, H, b);
}
function data(lv){
  const L = pick([['Du','Se','Cho','Pa','Ju'],['Olma','Nok','Uzum','Anor'],['1-A','1-B','2-A','2-B','3-A']]);
  const step = lv===1?5:lv===2?5:2; const vals = L.map(()=>ri(2,14)*step);
  const t = lv===1 ? ri(0,1) : lv===2 ? ri(1,3) : ri(2,4);
  const html = barSvg(L, vals);
  const mxI = vals.indexOf(Math.max(...vals)), mnI = vals.indexOf(Math.min(...vals));
  if (vals.filter(v=>v===vals[mxI]).length>1 || vals.filter(v=>v===vals[mnI]).length>1) return data(lv);
  if (t===0) return Q(`Diagrammada eng katta qiymat qaysi ustunda?`, L[mxI], L.filter((_,i)=>i!==mxI), `Eng baland ustun — ${L[mxI]} (${vals[mxI]})`, {html, fmt:String});
  if (t===1){ const i=ri(0,L.length-1); return Q(`Diagramma bo'yicha <b>${L[i]}</b> ustunining qiymati nechaga teng?`, vals[i], vals.filter((_,j)=>j!==i).concat(vals[i]+step), `Ustun tepasidan chap shkalaga qaraymiz: ${vals[i]}`, {html}); }
  if (t===2) return Q(`Eng katta va eng kichik qiymatlar farqi nechaga teng?`, vals[mxI]-vals[mnI], [vals[mxI]+vals[mnI], vals[mxI]-vals[mnI]+step, vals[mxI], vals[mnI]], `${vals[mxI]} − ${vals[mnI]} = ${vals[mxI]-vals[mnI]}`, {html});
  if (t===3){ const s=vals.reduce((a,b)=>a+b,0); return Q(`Barcha ustunlar qiymatlari yig'indisi nechaga teng?`, s, [s+step, s-step, s+2*step, vals[mxI]*L.length], `${vals.join(' + ')} = ${s}`, {html}); }
  const i=ri(0,L.length-2); const j=i+1; const r=vals[i]+vals[j]; return Q(`<b>${L[i]}</b> va <b>${L[j]}</b> qiymatlari yig'indisi eng kichik qiymatdan necha birlik ko'p?`, r-vals[mnI], [r, r-vals[mnI]+step, r-vals[mxI], vals[i]-vals[mnI]], `${vals[i]}+${vals[j]} = ${r}; ${r} − ${vals[mnI]} = ${r-vals[mnI]}`, {html});
}

Z.MATH = [
  {id:'m_arith', n:'Hisoblash', e:'🧮', c:'c-pri', g:arith, d:'Amallar tartibi, qulay usullar'},
  {id:'m_seq', n:'Ketma-ketliklar', e:'🔢', c:'c-org', g:seq, d:'Qonuniyatni top'},
  {id:'m_eq', n:'Tenglama va tengsizlik', e:'⚖️', c:'c-grn', g:eq, d:'Noma\'lumni top'},
  {id:'m_word', n:'Matnli masalalar', e:'📖', c:'c-blu', g:word, d:'Hayotiy masalalar'},
  {id:'m_time', n:'Vaqt', e:'⏰', c:'c-pnk', g:time, d:'Soat, daqiqa, hafta kunlari'},
  {id:'m_units', n:'O\'lchov birliklari', e:'📏', c:'c-tea', g:units, d:'m, sm, kg, litr, tezlik'},
  {id:'m_geom', n:'Geometriya', e:'📐', c:'c-ind', g:geom, d:'Perimetr, yuza, burchak, jismlar'},
  {id:'m_frac', n:'Kasrlar va ulushlar', e:'🍕', c:'c-red', g:frac, d:'Qism, ulush, taqqoslash'},
  {id:'m_nums', n:'Sonlar sirlari', e:'💎', c:'c-yel', g:nums, d:'Bo\'linish, rim raqamlari, raqamlar'},
  {id:'m_data', n:'Diagrammalar', e:'📊', c:'c-brn', g:data, d:'Grafik va jadval o\'qish'}
];
Z.qsvg = S;
})();

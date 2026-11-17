/* Mantiq va tanqidiy fikrlash savollari */
(function(){
'use strict';
const {ri, pick, shuffle, mcq} = Z;
const Q = (q, correct, distract, exp, extra) => Object.assign({q, exp}, mcq(correct, distract, String), extra||{});
const NAMES = ['Ali','Vali','Botir','Anvar','Madina','Zarina','Jasur','Nodira','Sardor','Laylo','Aziz','Kamola','Diyor','Shahzoda','Bekzod','Malika','Umid','Gulnoza'];

/* 1. Ortiqchasini top */
const GROUPS = [
  ['Mevalar',['olma','nok','o\'rik','shaftoli','gilos','anor','behi']],
  ['Sabzavotlar',['sabzi','piyoz','karam','bodring','lavlagi','turp']],
  ['Hayvonlar (yovvoyi)',['sher','bo\'ri','tulki','ayiq','yo\'lbars','fil']],
  ['Uy hayvonlari',['sigir','qo\'y','echki','ot','tovuq','mushuk']],
  ['Transport',['avtobus','poyezd','samolyot','kema','metro','tramvay']],
  ['Kasblar',['shifokor','o\'qituvchi','haydovchi','oshpaz','quruvchi','dehqon']],
  ['Ranglar',['qizil','sariq','yashil','ko\'k','oq','qora']],
  ['Fasllar',['qish','bahor','yoz','kuz']],
  ['Shaharlar',['Toshkent','Samarqand','Buxoro','Xiva','Namangan','Termiz']],
  ['Musiqa asboblari',['dutor','rubob','doira','pianino','skripka','nay']],
  ['Geometrik shakllar',['kvadrat','uchburchak','doira','romb','trapetsiya']],
  ['Hafta kunlari',['dushanba','seshanba','chorshanba','payshanba','juma']],
  ['Qushlar',['qaldirg\'och','burgut','musicha','laylak','to\'tiqush','chumchuq']]
];
function odd(lv){
  if (ri(0,1)){
    const t = ri(0, lv===1?2:5); let base, oddN, rule;
    const mk = f => { const s=new Set(); while(s.size<3) s.add(f()); return [...s]; };
    if (t===0){ base=mk(()=>ri(5,49)*2); oddN=ri(5,49)*2+1; rule='qolganlari juft sonlar'; }
    else if (t===1){ base=mk(()=>ri(2,30)*5); do{oddN=ri(11,150);}while(oddN%5===0); rule='qolganlari 5 ga bo\'linadi'; }
    else if (t===2){ base=mk(()=>ri(100,999)); oddN=ri(10,99); rule='qolganlari uch xonali'; }
    else if (t===3){ base=mk(()=>ri(2,33)*3); do{oddN=ri(10,99);}while(oddN%3===0); rule='qolganlari 3 ga bo\'linadi (raqamlari yig\'indisi 3 ga karrali)'; }
    else if (t===4){ base=shuffle([4,9,16,25,36,49,64,81]).slice(0,3); do{oddN=ri(10,80);}while([16,25,36,49,64].includes(oddN)); rule='qolganlari kvadrat sonlar (2·2, 3·3, ...)'; }
    else { const d=ri(1,9); base=mk(()=>ri(1,9)*10+d); let e; do{e=ri(0,9);}while(e===d); oddN=ri(1,9)*10+e; rule=`qolganlarining oxirgi raqami ${d}`; }
    return Q(`Qaysi son ortiqcha?\n<b>${shuffle(base.concat(oddN)).join(', ')}</b>`, oddN, base, `${oddN} ortiqcha, chunki ${rule}.`);
  }
  const [g1, g2] = shuffle(GROUPS); const base = shuffle(g1[1]).slice(0,3); const o = pick(g2[1]);
  return Q(`Qaysi so'z ortiqcha?\n<b>${shuffle(base.concat(o)).join(', ')}</b>`, o, base, `${base.join(', ')} — ${g1[0].toLowerCase()}. "${o}" esa ${g2[0].toLowerCase()} guruhiga kiradi.`);
}

/* 2. O'xshashlik (analogiya) */
const ANA = [
  ['Qush : uya = Ari : ?','in (uya)',['asal','gul','qanot'],'Qush uyada, ari inda yashaydi — yashash joyi.'],
  ['Baliq : suv = Qush : ?','havo',['daraxt','tuxum','pat'],'Baliq suvda suzadi, qush havoda uchadi.'],
  ['Qalam : yozish = Qaychi : ?','kesish',['qog\'oz','o\'tkir','temir'],'Asbob va uning vazifasi.'],
  ['Shifokor : kasalxona = O\'qituvchi : ?','maktab',['dars','o\'quvchi','kitob'],'Kasb va ish joyi.'],
  ['Issiq : sovuq = Kun : ?','tun',['quyosh','ertalab','yorug\''],'Qarama-qarshi ma\'noli so\'zlar.'],
  ['Barmoq : qo\'l = Yaproq : ?','daraxt',['yashil','kuz','gul'],'Qism va butun.'],
  ['Sigir : buzoq = Ot : ?','toy',['qo\'zi','kuchuk','otxona'],'Hayvon va uning bolasi.'],
  ['Kitob : sahifa = Uy : ?','xona',['tom','ko\'cha','eshik qulfi'],'Butun va uning qismlari.'],
  ['Non : novvoy = Kiyim : ?','tikuvchi',['do\'kon','mato','igna'],'Mahsulot va uni yasovchi.'],
  ['Yoz : issiq = Qish : ?','sovuq',['qor','dekabr','chang\'i'],'Fasl va uning belgisi.'],
  ['Ko\'z : ko\'rish = Quloq : ?','eshitish',['tovush','bosh','musiqa'],'A\'zo va uning vazifasi.'],
  ['Soat : vaqt = Termometr : ?','harorat',['kasallik','simob','shifokor'],'Asbob va u o\'lchaydigan narsa.'],
  ['Tez : sekin = Baland : ?','past',['uzun','tog\'','katta'],'Antonimlar.'],
  ['Pilla : ipak = Paxta : ?','ip (gazlama)',['dala','oq','chigit'],'Xomashyo va undan olinadigan mahsulot.'],
  ['Toshkent : O\'zbekiston = Parij : ?','Fransiya',['Yevropa','London','Eyfel minorasi'],'Poytaxt va davlat.'],
  ['Dutor : chalmoq = Kitob : ?','o\'qimoq',['yozmoq','javon','sahifa'],'Narsa va u bilan bajariladigan harakat.']
];
function analogy(lv){
  if (ri(0,1)){
    const t=ri(0, lv===1?1:3); const a=ri(2,9), b=ri(2,9);
    if (t===0){ const k=ri(2,5); return Q(`Qonuniyatni toping:\n<b>${a} → ${a*k}</b>,  <b>${b} → ${b*k}</b>,  <b>${a+b} → ?</b>`, (a+b)*k, [(a+b)*k+k, (a+b)+k, (a+b)*(k+1), a*b*k], `Har bir son ${k} ga ko'paytirilyapti: ${a+b}·${k} = ${(a+b)*k}`); }
    if (t===1){ const k=ri(3,15); return Q(`Qonuniyatni toping:\n<b>${a} → ${a+k}</b>,  <b>${b+10} → ${b+10+k}</b>,  <b>${a*b} → ?</b>`, a*b+k, [a*b+k+1, a*b*k, a*b-k, a*b+k*2], `Har bir songa ${k} qo'shilyapti: ${a*b}+${k} = ${a*b+k}`); }
    if (t===2) return Q(`Qonuniyatni toping:\n<b>${a} → ${a*a}</b>,  <b>${b} → ${b*b}</b>,  <b>${a+1===b?b+1:a+1} → ?</b>`, (a+1===b?b+1:a+1)**2, [(a+1===b?b+1:a+1)*2, (a+1===b?b+1:a+1)**2+1, (a+1===b?b+1:a+1)*3, (a+1===b?b+1:a+1)**2-2], `Son o'ziga ko'paytirilyapti (kvadrat).`);
    // triangle puzzle: (x+y) / z ... like photo Q20: top, left, right -> center = (left+right)/top? 3,4,8 -> 5?; use center = top + (right-left)? we craft: center = (left + right) : 2 + top - ... keep simple: center = left + right - top
    const tr=[...Array(3)].map(()=>{const t2=ri(2,9), l=ri(5,20), r=ri(5,20); return [t2,l,r,l+r-t2];});
    const [x,y,z]=tr;
    return Q(`Uchburchaklarda qonuniyat bor: (tepa; chap; o'ng) → markaz.\n<b>(${x[0]}; ${x[1]}; ${x[2]}) → ${x[3]}</b>\n<b>(${y[0]}; ${y[1]}; ${y[2]}) → ${y[3]}</b>\n<b>(${z[0]}; ${z[1]}; ${z[2]}) → ?</b>`, z[3], [z[1]+z[2]+z[0], z[1]*z[2]/z[0]|0, z[3]+2, z[2]-z[1]+z[0]], `Markaz = chap + o'ng − tepa. ${z[1]}+${z[2]}−${z[0]} = ${z[3]}`);
  }
  const a = pick(ANA); return Q(`<b>${a[0]}</b>`, a[1], a[2], a[3]);
}

/* 3. Rost va yolg'on — kim qildi? (brute force bilan yagona yechim) */
function truth(lv){
  if (ri(0,2)===0) return pick(TRUTH_BANK)();
  const ppl = shuffle(NAMES).slice(0,3+(lv===3?1:0));
  const n = ppl.length;
  const deed = pick(['vazani sindirgan','derazani ochiq qoldirgan','oxirgi konfetni yegan','sinf jurnalini yashirgan','sharbatni to\'kib yuborgan']);
  for (let tries=0; tries<200; tries++){
    // har bir odam bitta gap aytadi: [type, target]: 'did' (X qildi), 'not' (X qilmadi)
    const st = ppl.map((p,i)=>{ const tgt=ri(0,n-1); return [ri(0,1)?'did':'not', tgt]; });
    const mode = pick(['oneTrue','oneLie']);
    const sols=[];
    for (let c=0;c<n;c++){ const truths = st.map(([ty,t])=> ty==='did' ? t===c : t!==c); const k=truths.filter(Boolean).length; if ((mode==='oneTrue'&&k===1)||(mode==='oneLie'&&k===n-1)) sols.push(c); }
    if (sols.length!==1) continue;
    const c = sols[0];
    const txt = st.map(([ty,t],i)=>`${ppl[i]}: «${t===i ? (ty==='did'?'Men':'Men') : ppl[t]} ${ty==='did' ? (t===i?'qildim':'qildi') : (t===i?'qilmadim':'qilmadi')}»`).join('\n');
    const truths = st.map(([ty,t])=> ty==='did' ? t===c : t!==c);
    return Q(`Kimdir ${deed}. Bolalar shunday dedi:\n<b>${txt}</b>\nMa'lumki, ulardan <b>${mode==='oneTrue'?'faqat bittasi rost':'faqat bittasi yolg\'on'}</b> gapirdi. Kim ${deed}?`, ppl[c], ppl.filter((_,i)=>i!==c),
      `Har bir bolani navbatma-navbat "aybdor" deb tekshiramiz. Faqat ${ppl[c]} aybdor bo'lganda shart bajariladi: ${ppl.map((p,i)=>`${p} — ${truths[i]?'rost':'yolg\'on'}`).join(', ')}.`);
  }
  return pick(TRUTH_BANK)();
}
const TRUTH_BANK = [
  ()=>Q(`Orolda ikki xil odam yashaydi: <b>ritsarlar</b> doim rost, <b>yolg'onchilar</b> doim yolg'on gapiradi. A dedi: «Biz ikkalamiz ham yolg'onchimiz». A va B kim?`, 'A — yolg\'onchi, B — ritsar', ['Ikkalasi ritsar','Ikkalasi yolg\'onchi','A — ritsar, B — yolg\'onchi'], 'Agar A ritsar bo\'lsa, o\'zini yolg\'onchi demasdi. Demak A yolg\'onchi va gapi yolg\'on — ya\'ni ikkalasi yolg\'onchi emas. Shunday qilib B — ritsar.'),
  ()=>Q(`Uch quti bor: birida faqat olma, birida faqat nok, birida aralash. Hamma yorliqlar <b>noto'g'ri</b> yopishtirilgan. «Aralash» yorliqli qutidan bitta meva olib, u <b>olma</b> chiqdi. «Nok» yorliqli qutida nima bor?`, 'aralash', ['faqat olma','faqat nok','aniqlab bo\'lmaydi'], '«Aralash» qutida aralash bo\'lolmaydi, olma chiqdi — demak u faqat olma. «Nok» qutida nok bo\'lolmaydi, olma ham emas → aralash. «Olma» qutida esa nok.'),
  ()=>Q(`Ali: «Vali yolg'on gapiryapti». Vali: «Sardor yolg'on gapiryapti». Sardor: «Ali ham, Vali ham yolg'on gapiryapti». Kim rost gapiryapti?`, 'Faqat Vali', ['Faqat Ali','Faqat Sardor','Ali va Sardor'], 'Agar Sardor rost bo\'lsa, Vali yolg\'on → Sardor rost emas — ziddiyat. Demak Sardor yolg\'on, Vali rost, Ali esa yolg\'on (Vali rost bo\'lgani uchun).'),
  ()=>Q(`Uch do'st — Aziz, Bekzod, Diyor — turli rangdagi (qizil, ko'k, yashil) futbolka kiygan. Aziz qizil kiymagan. Bekzod ko'k ham, qizil ham kiymagan. Diyor qanday rangda?`, 'qizil', ['ko\'k','yashil','aniqlab bo\'lmaydi'], 'Bekzod — yashil. Aziz qizil emas → ko\'k. Diyor — qizil.'),
  ()=>Q(`Mushuk uch qutidan birida. 1-qutida: «Mushuk shu yerda». 2-qutida: «Mushuk bu yerda emas». 3-qutida: «Mushuk 1-qutida emas». Yozuvlardan <b>faqat bittasi rost</b>. Mushuk qayerda?`, '2-qutida', ['1-qutida','3-qutida','hech qaysida'], 'Mushuk 2-qutida bo\'lsa: 1-yolg\'on, 2-yolg\'on, 3-rost — faqat bittasi rost ✔. Boshqa holatlarda rost gaplar soni 1 ta emas.'),
  ()=>Q(`Laylo Malikadan katta. Malika Nodiradan katta. Nodira Kamoladan kichik, lekin Kamola Malikadan kichik. Eng kichigi kim?`, 'Nodira', ['Kamola','Malika','Laylo'], 'Tartib: Laylo > Malika > Kamola > Nodira.'),
  ()=>Q(`«Barcha mushuklar suzishni yaxshi ko'rmaydi. Momo — mushuk.» Qaysi xulosa to'g'ri?`, 'Momo suzishni yaxshi ko\'rmaydi', ['Momo suzishni yaxshi ko\'radi','Momo it','Barcha hayvonlar suzmaydi'], 'Umumiy qoida har bir mushukka tegishli, Momo esa mushuk.'),
  ()=>Q(`Ritsar har doim rost, yolg'onchi har doim yolg'on gapiradi. Kimdir: «Men yolg'onchiman» dedi. Bu gapni kim aytishi mumkin?`, 'Hech kim ayta olmaydi', ['Ritsar','Yolg\'onchi','Ikkalasi ham'], 'Ritsar o\'zini yolg\'onchi demaydi (yolg\'on bo\'ladi). Yolg\'onchi bu gapni aytsa, rost gapirgan bo\'ladi. Demak bunday gapni hech kim aytolmaydi.')
];

/* 4. Joylashuv va tartib */
function order(lv){
  const t = ri(0, lv===1?1:4);
  if (t===0){ const a=ri(3,12), b=ri(2,10); return Q(`Navbatda turgan Alining oldida <b>${a}</b> kishi, orqasida <b>${b}</b> kishi bor. Navbatda jami necha kishi?`, a+b+1, [a+b, a+b+2, a+b-1], `${a} + ${b} + Alining o'zi (1) = ${a+b+1}`); }
  if (t===1){ const n=ri(10,30), k=ri(3,n-3); return Q(`Qatorda <b>${n}</b> ta bola turibdi. Madina chapdan <b>${k}-o'rinda</b>. U o'ngdan nechanchi o'rinda?`, n-k+1, [n-k, n-k+2, k], `O'ngdan o'rni = ${n} − ${k} + 1 = ${n-k+1}`); }
  if (t===2){ const p=shuffle(NAMES).slice(0,4); // p[0]>p[1]>p[2]>p[3] by height
    const facts=shuffle([`${p[1]} ${p[2]}dan baland`,`${p[0]} ${p[1]}dan baland`,`${p[3]} ${p[2]}dan past`]);
    const ask=pick([['eng baland',0],['eng past',3],['bo\'yi bo\'yicha ikkinchi (balanddan)',1]]);
    return Q(`${facts.join('. ')}. Kim <b>${ask[0]}</b>?`, p[ask[1]], p.filter((_,i)=>i!==ask[1]), `Tartib (balanddan pastga): ${p.join(' > ')}`); }
  if (t===3){ const p=shuffle(NAMES).slice(0,3); // p[1] faqat p[0]dan ortda => p[0]=1, p[1]=2, p[2]=3
    const ans=`${p[0]} – 1, ${p[1]} – 2, ${p[2]} – 3`;
    return Q(`${p.slice().sort().join(', ')} yugurish musobaqasida sovrinli o'rinlarni egalladi. <b>${p[1]} faqat ${p[0]}dan ortda qoldi</b>. O'rinlarni toping.`, ans, [`${p[1]} – 1, ${p[0]} – 2, ${p[2]} – 3`, `${p[2]} – 1, ${p[0]} – 2, ${p[1]} – 3`, `${p[0]} – 1, ${p[2]} – 2, ${p[1]} – 3`], `"Faqat ${p[0]}dan ortda" — demak ${p[1]} ikkinchi, ${p[0]} birinchi. ${p[2]} — uchinchi.`); }
  const fl=ri(5,12), a=ri(2,fl-2); const b=ri(1,fl-a); return Q(`<b>${fl} qavatli</b> uyda Aziz ${a}-qavatda yashaydi. Do'sti undan <b>${b} qavat yuqorida</b> yashaydi. Do'sti yuqoridan nechanchi qavatda?`, fl-(a+b)+1, [fl-(a+b), a+b, fl-a], `Do'sti ${a+b}-qavatda. Yuqoridan: ${fl} − ${a+b} + 1 = ${fl-(a+b)+1}`);
}

/* 5. Tanqidiy fikrlash (asl matnlar) */
const CRIT = [
  {t:'Maktab hovlisiga yangi o\'yin maydonchasi qurilgandan keyin tanaffusda janjallashadigan bolalar soni kamaydi. Direktor: «Bolalar band bo\'lsa, kamroq janjallashadi», dedi.',q:'Qaysi fikr direktorning gapini <b>kuchaytiradi</b>?',a:'Maydonchada o\'ynagan bolalar orasida janjal deyarli bo\'lmagan.',d:['Maydoncha qurilishi qimmatga tushdi.','Ba\'zi bolalar maydonchani yoqtirmaydi.','Shu vaqtda yangi qorovul ishga kelgan va hovlini kuzatgan.'],e:'To\'g\'ri javob janjal kamayishini aynan o\'yin bilan band bo\'lishga bog\'laydi. Qorovul haqidagi fikr esa boshqa sababni ko\'rsatadi — u kuchsizlantiradi.'},
  {t:'Sardor: «Men har kuni ertalab badantarbiya qilaman, shuning uchun darsda diqqatim yaxshi».',q:'Qaysi fikr Sardorning gapini <b>zaiflashtiradi</b>?',a:'Sardor badantarbiya qilmagan kunlari ham diqqati xuddi shunday yaxshi bo\'ladi.',d:['Badantarbiya sog\'liq uchun foydali.','Sardorning do\'stlari ham badantarbiya qiladi.','Sardor matematikani yaxshi ko\'radi.'],e:'Agar badantarbiyasiz ham natija bir xil bo\'lsa, demak sabab badantarbiya emas — bu gapni zaiflashtiradi.'},
  {t:'Bog\'bon: «Bu yil olma daraxtlarimiz ko\'p hosil berdi, chunki men yangi o\'g\'itdan foydalandim».',q:'Qaysi fikr bog\'bonning xulosasini <b>zaiflashtiradi</b>?',a:'Bu yil butun viloyatda ob-havo juda qulay bo\'lib, hamma bog\'larda hosil ko\'p bo\'ldi.',d:['Yangi o\'g\'it qimmat turadi.','Bog\'bon olmalarni bozorda sotdi.','O\'tgan yili ham bog\'bon daraxtlarni sug\'organ.'],e:'Hosil boshqa sabab (ob-havo) tufayli ham ko\'paygan bo\'lishi mumkin — demak o\'g\'it sabab ekani shubhali.'},
  {t:'«Kutubxonaga ko\'p boradigan o\'quvchilar odatda insho yozishda yuqori baho olishadi».',q:'Bu matndan qaysi xulosa <b>eng to\'g\'ri</b>?',a:'Ko\'p kitob o\'qish insho yozishga yordam berishi mumkin.',d:['Kutubxonaga bormaganlar hech qachon yaxshi baho olmaydi.','Barcha o\'quvchilar kutubxonaga boradi.','Insho yozish oson.'],e:'Matn "odatda" deydi — bu ehtimolni bildiradi. "Hech qachon", "barcha" kabi qat\'iy xulosalar noto\'g\'ri.'},
  {t:'Qaysi gap <b>fakt</b> (tekshirib bo\'ladigan haqiqat)?',q:'',a:'O\'zbekiston poytaxti — Toshkent.',d:['Qish — eng chiroyli fasl.','Futbol eng qiziqarli o\'yin.','Matematika eng muhim fan.'],e:'Fakt — isbotlanadigan ma\'lumot. Qolganlari shaxsiy fikr (didga bog\'liq).'},
  {t:'Qaysi gap <b>fikr</b> (shaxsiy qarash)?',q:'',a:'Olma — eng mazali meva.',d:['Olma daraxtda o\'sadi.','Bir haftada 7 kun bor.','Suv 100°C da qaynaydi.'],e:'"Eng mazali" — didga bog\'liq shaxsiy fikr. Qolganlari fakt.'},
  {t:'Laylo: «Kecha yomg\'ir yog\'di, shuning uchun bugun ko\'cha ho\'l».',q:'Laylo qaysi taxminga tayanmoqda?',a:'Kechagi yomg\'ir suvi hali qurimagan.',d:['Bugun ham yomg\'ir yog\'adi.','Yomg\'ir har kuni yog\'adi.','Ko\'cha hech qachon qurimaydi.'],e:'Xulosa to\'g\'ri bo\'lishi uchun suv hali qurimagan bo\'lishi kerak — bu yashirin taxmin.'},
  {t:'Bir o\'quvchi: «Sinfimizdagi 3 ta bola qizil sumka bilan keladi va ularning hammasi a\'lochi. Demak qizil sumka a\'lo o\'qishga yordam beradi».',q:'Bu fikrlashdagi xato nimada?',a:'Juda kam misolga qarab umumiy xulosa chiqarilgan.',d:['Qizil rang chiroyli emas.','A\'lochilar ko\'p.','Sumka qimmat.'],e:'3 ta misol umumiy qoida uchun yetarli emas, va sumka rangi baholarga sabab bo\'lmaydi — bu "tasodifiy bog\'liqlik" xatosi.'},
  {t:'Shahar meri: «Ko\'chalarga ko\'proq axlat qutilari qo\'ysak, ko\'chalar tozaroq bo\'ladi».',q:'Qaysi fikr merning gapini <b>kuchaytiradi</b>?',a:'Odamlar axlatni ko\'pincha yaqin atrofda quti bo\'lmagani uchun yerga tashlaydi.',d:['Axlat qutilari qimmat.','Shaharda ko\'p daraxt bor.','Ba\'zi odamlar ko\'chada yurmaydi.'],e:'Agar axlat tashlashning sababi qutining yo\'qligi bo\'lsa, quti qo\'yish muammoni hal qiladi — bu kuchaytiradi.'},
  {t:'Reklamada: «Bizning tish pastamizni ishlatgan 10 kishidan 9 tasi mamnun!»',q:'Bu da\'voni tekshirish uchun eng muhim savol qaysi?',a:'Qancha odam so\'ralgan va ular qanday tanlangan?',d:['Pasta qanday rangda?','Pasta qayerda sotiladi?','Reklamani kim chizgan?'],e:'Agar faqat 10 kishi so\'ralgan bo\'lsa yoki ularni ishlab chiqaruvchi tanlagan bo\'lsa, natija ishonchsiz.'},
  {t:'Ona: «Kim kech uxlasa, ertalab charchab turadi. Aziz bugun charchab turdi».',q:'Qaysi xulosa <b>albatta to\'g\'ri</b>?',a:'Hech qaysi — Aziz boshqa sabab bilan ham charchagan bo\'lishi mumkin.',d:['Aziz kecha kech uxlagan.','Aziz har doim kech uxlaydi.','Aziz kasal.'],e:'"Kech uxlash → charchoq" degani "charchoq → kech uxlash" degani emas. Charchoqning boshqa sabablari ham bor.'},
  {t:'«Hayvonot bog\'lari hayvonlarni qafasda saqlaydi, shuning uchun ular kerak emas», — deydi Umid.',q:'Qaysi fikr Umidning gapini <b>zaiflashtiradi</b>?',a:'Hayvonot bog\'lari yo\'qolib ketayotgan hayvon turlarini ko\'paytirib, tabiatga qaytaradi.',d:['Hayvonot bog\'iga chipta kerak.','Ba\'zi hayvonlar uxlashni yaxshi ko\'radi.','Bolalar hayvonlarni yaxshi ko\'radi va ularni rasmga oladi.'],e:'Bu fikr hayvonot bog\'larining muhim foydasini ko\'rsatadi — Umidning "kerak emas" degan gapiga qarshi kuchli dalil.'}
];
function crit(){ const c = pick(CRIT); return Q(`${c.t}${c.q?'\n'+c.q:''}`, c.a, c.d, c.e, {one:true}); }

/* 6. Ulug'bek jumboqlari */
function puzzle(lv){
  const t = ri(0, 10);
  if (t===0){ const heads=ri(8,20); const rab=ri(1,heads-1); const ch=heads-rab; const legs=ch*2+rab*4;
    return Q(`Hovlida tovuqlar va quyonlar bor. Ularning jami <b>${heads} ta boshi</b> va <b>${legs} ta oyog'i</b> bor. Nechta quyon bor?`, rab, [ch, rab+1, rab-1, legs/4|0], `Hammasi tovuq bo'lsa ${heads*2} ta oyoq bo'lardi. Ortiqcha ${legs-heads*2} ta oyoq — har bir quyon 2 ta ortiqcha beradi: ${(legs-heads*2)}:2 = ${rab} ta quyon.`); }
  if (t===1){ const n=ri(4,10); return Q(`Uchrashuvda <b>${n} ta do'st</b> har biri boshqa har biri bilan bir martadan qo'l berib ko'rishdi. Jami nechta qo'l berib ko'rishish bo'ldi?`, n*(n-1)/2, [n*(n-1), n*n, n*(n-1)/2+n, n], `Har biri ${n-1} kishi bilan ko'rishadi, lekin har bir ko'rishish 2 marta sanalgani uchun ${n}·${n-1}:2 = ${n*(n-1)/2}`); }
  if (t===2){ const pieces=ri(3,9), min=ri(2,6); return Q(`Yog'ochni bir marta arralash uchun <b>${min} daqiqa</b> kerak. Uni <b>${pieces} bo'lakka</b> bo'lish uchun qancha vaqt kerak?`, `${(pieces-1)*min} daqiqa`, [`${pieces*min} daqiqa`, `${(pieces+1)*min} daqiqa`, `${(pieces-2)*min} daqiqa`], `${pieces} bo'lak uchun ${pieces-1} marta arralash kerak: ${pieces-1}·${min} = ${(pieces-1)*min} daqiqa`); }
  if (t===3){ const len=ri(4,12)*5, step=5; const posts=len/step+1; return Q(`Uzunligi <b>${len} m</b> bo'lgan to'g'ri yo'lakning bir chetiga har <b>${step} m</b> da (boshi va oxirini ham qo'shib) daraxt ekildi. Nechta daraxt ekilgan?`, posts, [posts-1, posts+1, len/step*2], `Oraliqlar: ${len}:${step} = ${len/step}. Daraxtlar oraliqlardan 1 ta ko'p: ${posts}`); }
  if (t===4){ const c=ri(2,4); const per=ri(4,8); return Q(`Qutida <b>${c} xil rangdagi</b> paypoqlar bor (har rangdan ${per} tadan). Qorong'ida qaramasdan kamida nechta paypoq olinsa, albatta bir xil rangli juft chiqadi?`, c+1, [c, 2, c*2, per+1], `Eng yomon holatda dastlab har rangdan bittadan olinadi (${c} ta). Keyingisi albatta juft hosil qiladi: ${c+1}`); }
  if (t===5){ const p=pick([20,25,50,100,120]); let d=0; for (let i=1;i<=p;i++) d+=String(i).length; return Q(`Kitob sahifalarini 1 dan <b>${p}</b> gacha raqamlash uchun jami nechta raqam yoziladi?`, d, [p, d+9, d-9, p*2], `1-9: 9 ta raqam` + (p>9?`, 10-${Math.min(p,99)}: ${(Math.min(p,99)-9)*2} ta`:'') + (p>99?`, 100-${p}: ${(p-99)*3} ta`:'') + `. Jami ${d}`); }
  if (t===6){ const heads=20; return Q(`Ajdarhoning <b>20 ta</b> boshi bor. Botir uning har <b>3 ta</b> boshini kesganda, o'rniga <b>1 ta</b> yangi bosh o'sib chiqadi (3 tadan kam kesilsa, o'smaydi). Ajdarhoni yengish uchun Botir jami nechta bosh kesadi?`, 29, [20, 27, 30, 26], `Har 3 ta kesishda boshlar 2 taga kamayadi. 20 → 18 → ... → 2 (9 marta, 27 bosh kesildi), oxirgi 2 boshni kesganda yangi o'smaydi: 27+2 = 29`); }
  if (t===7){ const w=ri(2,5); return Q(`Shilliqqurt <b>${w+5} m</b> chuqurlikdagi quduq tubida. U kunduzi <b>3 m</b> yuqoriga chiqadi, kechasi <b>2 m</b> pastga sirpanadi. U necha kunda quduqdan chiqadi?`, w+3, [w+5, w+2, w+4, (w+5)/1], `Har sutkada 1 m ko'tariladi. ${w+2} sutkadan keyin u ${w+2} m balandlikda; ertasi kunduzi yana 3 m ko'tarilib ${w+5} m ga yetadi — ${w+3}-kuni chiqadi.`); }
  if (t===8){ const n=ri(3,7); return Q(`Bitta mushuk bitta sichqonni <b>${n} daqiqada</b> tutadi. <b>${n} ta mushuk</b> ${n} ta sichqonni necha daqiqada tutadi?`, n, [n*n, 1, n*2], `Har bir mushuk o'z sichqonini bir vaqtda tutadi — yana ${n} daqiqa.`); }
  if (t===9){ const n=pick([9,27]); const ans=n===9?2:3; return Q(`<b>${n} ta</b> bir xil ko'rinishdagi tangadan bittasi soxta — u yengilroq. Pallali tarozida (toshsiz) eng kamida necha marta tortib, soxtasini albatta topish mumkin?`, ans, [ans+1, ans+2, n/3, ans-1].filter(x=>x>0), `Tangalarni 3 ta teng guruhga bo'lamiz: ikkitasini tortamiz — yengili soxtani saqlaydi, teng bo'lsa — uchinchi guruhda. Har tortishda guruh 3 marta kichrayadi: ${n===9?'9 → 3 → 1 (2 marta)':'27 → 9 → 3 → 1 (3 marta)'}.`); }
  const n=ri(5,9); const pairs=n; return Q(`Ota-onaning <b>${n} ta</b> o'g'li bor. Har bir o'g'lining bittadan singlisi bor. Oilada jami nechta farzand?`, n+1, [n*2, n, n+2], `Hamma o'g'illarning singlisi bitta qiz — demak farzandlar ${n}+1 = ${n+1}`);
}

/* 7. Shakl qonuniyatlari (emoji) */
const EMO = ['🔴','🟦','🔺','⭐','🟢','🟨','💜','🔶','🍎','🐟','🌙','☀️'];
function pattern(lv){
  const t = ri(0, lv===1?1:4);
  const [a,b,c,d] = shuffle(EMO);
  if (t===0){ const base=[a,b,c]; const L=ri(7,9); const s=[...Array(L)].map((_,i)=>base[i%3]); return Q(`Keyingi shakl qaysi?\n<span style="font-size:34px;letter-spacing:4px">${s.join('')}❓</span>`, base[L%3], [a,b,c,d].filter(x=>x!==base[L%3]), `Takrorlanuvchi guruh: ${base.join('')}`); }
  if (t===1){ const base=[a,a,b]; const L=ri(7,10); const s=[...Array(L)].map((_,i)=>base[i%3]); return Q(`Keyingi shakl qaysi?\n<span style="font-size:34px;letter-spacing:4px">${s.join('')}❓</span>`, base[L%3], [a,b,c,d].filter(x=>x!==base[L%3]), `Takrorlanuvchi guruh: ${base.join('')}`); }
  if (t===2){ // o'sib boruvchi: a, ab, abb, abbb
    const groups=[1,2,3]; const s=groups.map(k=>a+b.repeat(k)).join(' '); return Q(`Keyingi guruhda nechta ${b} bo'ladi?\n<span style="font-size:30px">${s} …</span>`, 4, [3,5,6], `Har guruhda ${b} lar bittaga ko'payadi: 1, 2, 3 → 4`); }
  if (t===3){ const x=ri(2,9), y=ri(2,9); const pair=[pick(['🍎','🍐','🍇']), pick(['🍌','🍋','🥕'])];
    return Q(`<span style="font-size:28px">${pair[0]} + ${pair[0]} = ${2*x}\n${pair[0]} + ${pair[1]} = ${x+y}\n${pair[1]} + ${pair[1]} + ${pair[0]} = ?</span>`, 2*y+x, [x+y, 2*x+y, 2*y, 3*y], `${pair[0]} = ${x}, ${pair[1]} = ${x+y}−${x} = ${y}. ${y}+${y}+${x} = ${2*y+x}`); }
  const n=ri(3,6); const m=[...Array(3)].map((_,r)=>[...Array(3)].map((_,c)=>n*(r+1)+c)); const ans=m[2][2];
  return Q(`Jadvalda qonuniyat bor. <b>?</b> ni toping.\n<span style="font-family:monospace;font-size:22px">${m.map((r,i)=>r.map((v,j)=>i===2&&j===2?' ?':String(v).padStart(2,' ')).join('  ')).join('\n')}</span>`, ans, [ans+1, ans-1, ans+n, ans+2], `Har qatorda son 1 ga, har ustunda ${n} ga ortadi. Javob: ${ans}`);
}

/* 8. To'plamlar (Eyler–Venn) */
function vennSvg(a,b,both,la,lb){ return Z.qsvg.wrap(300,170,`<circle cx="115" cy="85" r="70" fill="#6C4CF1" fill-opacity=".22" stroke="#6C4CF1" stroke-width="3"/><circle cx="185" cy="85" r="70" fill="#FF8A00" fill-opacity=".22" stroke="#FF8A00" stroke-width="3"/>`+Z.qsvg.txt(80,85,a,22)+Z.qsvg.txt(150,85,both,22)+Z.qsvg.txt(220,85,b,22)+Z.qsvg.txt(85,10,la,14,'#4E31CF')+Z.qsvg.txt(215,10,lb,14,'#D96F00')); }
function sets(lv){
  const acts = pick([['futbol','shaxmat'],['rasm','musiqa'],['olma','nok'],['ingliz tili','rus tili'],['suzish','kurash']]);
  const both=ri(2,8), onlyA=ri(3,12), onlyB=ri(3,12), none=ri(0,6); const A=onlyA+both, B=onlyB+both, tot=onlyA+onlyB+both+none;
  const t = ri(0, lv===1?1:3);
  if (t===0) return Q(`Sinfda ${A} bola <b>${acts[0]}</b>ni, ${B} bola <b>${acts[1]}</b>ni yaxshi ko'radi. ${both} bola ikkalasini ham yaxshi ko'radi. Kamida bittasini yaxshi ko'radigan nechta bola bor?`, A+B-both, [A+B, A+B-2*both, A+B+both], `${A} + ${B} − ${both} = ${A+B-both} (ikkalasini sevuvchilar 2 marta sanalmasligi uchun ayiramiz)`, {html:vennSvg('?','?',both,acts[0],acts[1])});
  if (t===1) return Q(`Diagrammaga qarang. Faqat <b>${acts[0]}</b>ni yaxshi ko'radiganlar nechta?`, onlyA, [A, both, onlyB, onlyA+onlyB], `Faqat ${acts[0]} — chap doiraning kesishmaga kirmagan qismi: ${onlyA}`, {html:vennSvg(onlyA,onlyB,both,acts[0],acts[1])});
  if (t===2) return Q(`Sinfda <b>${tot}</b> o'quvchi bor. ${A} tasi ${acts[0]}, ${B} tasi ${acts[1]} bilan shug'ullanadi, ${both} tasi ikkalasi bilan. Nechta o'quvchi hech qaysi biri bilan shug'ullanmaydi?`, none, [none+both, tot-A-B, none+1, none+2].filter(x=>x>=0), `Kamida bittasi bilan: ${A}+${B}−${both} = ${A+B-both}. Hech qaysi: ${tot}−${A+B-both} = ${none}`);
  return Q(`${tot} ta o'quvchidan ${A} tasi ${acts[0]}ni, ${B} tasi ${acts[1]}ni tanladi, ${none} tasi hech birini tanlamadi. Nechta o'quvchi ikkalasini ham tanlagan?`, both, [both+1, both-1>=0?both-1:both+2, A+B-tot, none], `Kamida bittasini tanlaganlar: ${tot}−${none} = ${tot-none}. Ikkalasi: ${A}+${B}−${tot-none} = ${both}`);
}

Z.LOGIC = [
  {id:'lg_puzzle', n:'Ulug\'bek jumboqlari', e:'🔭', c:'c-ind', g:puzzle, d:'Aqlni charxlovchi topishmoqlar'},
  {id:'lg_truth', n:'Rost va yolg\'on', e:'🕵️', c:'c-red', g:truth, d:'Kim aybdor? Ritsar va yolg\'onchilar'},
  {id:'lg_crit', n:'Tanqidiy fikrlash', e:'💡', c:'c-yel', g:crit, d:'Kuchaytir, zaiflashtir, xulosa'},
  {id:'lg_order', n:'Tartib va joylashuv', e:'🏁', c:'c-grn', g:order, d:'Navbat, bo\'y, o\'rinlar'},
  {id:'lg_odd', n:'Ortiqchasini top', e:'🔍', c:'c-org', g:odd, d:'Guruhga mos kelmaydigani'},
  {id:'lg_analogy', n:'O\'xshashlik', e:'🔗', c:'c-pnk', g:analogy, d:'Qonuniyat va bog\'lanish'},
  {id:'lg_pattern', n:'Shakl qonuniyatlari', e:'🔷', c:'c-blu', g:pattern, d:'Keyingi shakl, emoji tenglamalar'},
  {id:'lg_sets', n:'To\'plamlar', e:'⭕', c:'c-tea', g:sets, d:'Eyler–Venn diagrammalari'}
];
})();

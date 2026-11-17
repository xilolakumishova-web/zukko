/* Ekranlar: bosh sahifa, fanlar, o'yinlar, do'kon, yutuqlar, ota-ona paneli */
(function(){
'use strict';
const h = Z.h;
Z.GAMES = Z.GAMES || [];

function greet(){ const hr = new Date().getHours(); return hr<12?'Xayrli tong':hr<18?'Xayrli kun':'Xayrli kech'; }

/* ---------- Onboarding ---------- */
function onboarding(app){
  const S = Z.S; let av = S.avatar||'🦁', gr = S.grade||4;
  const name = h('input',{class:'field',placeholder:'Ismingni yoz...',maxlength:'20',value:S.name||''});
  const avs = h('div',{class:'avpick'});
  Z.AVATARS.filter(a=>a[1]===0).forEach(([e])=>{ const b=h('button',{class:e===av?'on':'',onclick:()=>{av=e;[...avs.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');Z.sfx('pop');}},e); avs.appendChild(b); });
  const seg = h('div',{class:'seg'}); [3,4].forEach(g=>{ const b=h('button',{class:g===gr?'on':'',onclick:()=>{gr=g;[...seg.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');}}, g+'-sinf'); seg.appendChild(b); });
  app.appendChild(h('div',{class:'col',style:{maxWidth:'520px',margin:'10px auto'}},
    h('div',{class:'center'}, Z.starSvg(110), h('h1',null,'Zukko\'ga xush kelibsan!'), h('p',{class:'muted'},'Prezident maktabiga o\'ynab tayyorlanamiz: matematika, ingliz tili, mantiq va 14 ta aqlli o\'yin!')),
    h('div',{class:'card col'},
      h('b',null,'Isming nima?'), name,
      h('b',null,'O\'zingga qahramon tanla:'), avs,
      h('b',null,'Nechanchi sinfda o\'qiysan?'), seg,
      h('button',{class:'btn grn wide',style:{marginTop:'8px'},onclick:()=>{
        const n = name.value.trim(); if (!n){ name.focus(); Z.toast('Ismingni yozib qo\'y 🙂'); return; }
        S.name = n; S.avatar = av; S.grade = gr; S.created = true; Z.save(); Z.sfx('win'); Z.confetti();
        Z.nav.root('Zukko', home);
        setTimeout(()=>Z.modal([h('div',{style:{fontSize:'64px'}},'🎁'), h('h2',null,'Salom, '+n+'!'), h('p',null,'Sovg\'a sifatida 50 ta tanga oldingi. To\'g\'ri javoblar va o\'yinlardagi g\'alabalar uchun yana tangalar, yulduzlar va nishonlar olasan. Tangalarga do\'kondan yangi qahramonlar va mavzular sotib ol!')],[{t:'Boshladik! 🚀',cls:'grn'}]), 400);
      }}, 'Boshlash 🚀'))));
}

/* ---------- Bosh sahifa ---------- */
function home(app){
  const S = Z.S; Z.touchDay(); Z.renderTop();
  const L = Z.levelInfo(S.xp); const d = Z.daily();
  app.appendChild(h('div',{class:'hero'},
    h('div',{class:'sparkle'},'✨'),
    h('div',{class:'av'}, S.avatar),
    h('div',{class:'grow'},
      h('div',{style:{opacity:.9,fontSize:'14px'}}, greet()+','),
      h('h2',null, S.name+'!'),
      h('div',{style:{fontSize:'14px'}}, L.rank.e+' '+L.rank.n+' · '+L.lv+'-daraja'),
      h('div',{class:'lvbar'}, h('i',{style:{width:L.pct+'%'}})),
      h('div',{style:{fontSize:'12px',opacity:.85,marginTop:'3px'}}, 'Keyingi darajagacha '+L.toNext+' XP'))));

  app.appendChild(h('div',{class:'h-sec'},'🎯 Bugungi vazifalar', d.claimed?h('span',{class:'pill',style:{background:'var(--grn-l)'}},'✅ Bajarildi'):null));
  app.appendChild(h('div',{class:'daily'}, Z.DAILY.map(x=>{ const v=Math.min(d[x.k]||0,x.n); return h('div',{class:'d'+(v>=x.n?' done':'')}, h('div',{style:{fontSize:'28px'}},v>=x.n?'✅':x.e), h('div',{class:'grow'}, h('div',{style:{fontSize:'14px'}},x.t), h('div',{class:'pb'},h('i',{style:{width:(v/x.n*100)+'%'}})), h('div',{class:'small muted'},v+' / '+x.n))); })));

  app.appendChild(h('div',{class:'h-sec'},'📚 O\'rganamiz'));
  const tiles = h('div',{class:'tiles'});
  const T = (cls, em, t, s, fn, badge) => h('button',{class:'tile '+cls,onclick:()=>{Z.sfx('click');fn();}}, badge?h('span',{class:'badge'},badge):null, h('div',{class:'em'},em), h('div',{class:'t'},t), h('div',{class:'s'},s));
  const prog = list => { let a=0; list.forEach(t=>{for(let l=1;l<=3;l++) a+=Z.starsOf(t.id,l);}); return a+'/'+(list.length*9)+'⭐'; };
  tiles.append(
    T('c-pri','🧮','Matematika',Z.MATH.length+' ta mavzu',()=>subject('Matematika','🧮',Z.MATH), prog(Z.MATH)),
    T('c-blu','🇬🇧','Ingliz tili',Z.ENG.length+' ta mavzu',()=>subject('Ingliz tili','🇬🇧',Z.ENG), prog(Z.ENG)),
    T('c-org','🧠','Mantiq',Z.LOGIC.length+' ta mavzu',()=>subject('Mantiq va tanqidiy fikrlash','🧠',Z.LOGIC), prog(Z.LOGIC)),
    T('c-red','📝','Imtihon','Haqiqiy test sinovi',()=>exams()),
    T('c-grn','🎮','O\'yinlar',Z.GAMES.length+' ta aqlli o\'yin',()=>games()),
    T('c-tea','🛠️','Xatolar','Xatolarni tuzatamiz',()=>Z.startMistakes(), (S.mistakes||[]).length||null));
  app.appendChild(tiles);

  app.appendChild(h('div',{class:'h-sec'},'🎮 Tezkor o\'yinlar'));
  const g = h('div',{class:'tiles'});
  Z.GAMES.filter(x=>x.hot).forEach(x=>g.appendChild(T(x.c, x.e, x.n, x.d, ()=>openGame(x))));
  app.appendChild(g);

  app.appendChild(h('div',{class:'h-sec'},'⭐ Mening dunyom'));
  const m = h('div',{class:'tiles'});
  m.append(
    T('c-yel','🏪','Do\'kon','Qahramon va mavzular',()=>shop()),
    T('c-pnk','🏅','Yutuqlar',S.badges.length+'/'+Z.BADGES.length+' nishon',()=>badges()),
    T('c-ind','👨‍👩‍👧','Ota-onalar','Statistika va sozlamalar',()=>parents()));
  app.appendChild(m);
  app.appendChild(h('div',{style:{marginTop:'18px'}}, Z.mascot(Z.pick(['Har kuni ozgina mashq — katta natija! Bugun 20 ta to\'g\'ri javob berib ko\'r 💪','Bilasanmi? Mirzo Ulug\'bek yoshligidan matematikaga qiziqqan! 🔭','Imtihonda shoshma: savolni oxirigacha o\'qi, keyin javob ber 🧐','Xato qilsang — tushuntirishni o\'qi. Shunda miyang kuchayadi! 🧠','O\'yin o\'ynash ham mashq: sudoku va shaxmat mantiqni charxlaydi ♟️']))));
}

/* ---------- Fan sahifasi ---------- */
function subject(title, em, list){
  Z.nav.go(em+' '+title, app => {
    app.appendChild(Z.mascot('Mavzuni tanla. Har bir darajada 10 ta savol. 2 ta yulduz olsang, keyingi daraja ochiladi! ⭐⭐'));
    const g = h('div',{class:'topics',style:{marginTop:'14px'}});
    list.forEach(t=>{
      const st = Z.S.stats[t.id];
      const lv = h('div',{class:'lv'});
      [1,2,3].forEach(l=>{
        const open = Z.levelUnlocked(t.id,l), s = Z.starsOf(t.id,l);
        lv.appendChild(h('button',{class:'lvb'+(open?'':' lock'),onclick:e=>{ e.stopPropagation(); Z.sfx('click'); if(!open){ Z.toast('Avval '+(l-1)+'-darajadan 2 ta ⭐ ol'); return; } Z.startLesson(t,l); }},
          open ? [['','Oson','O\'rta','Qiyin'][l],' ',h('span',{class:'st'}, '★'.repeat(s)+'☆'.repeat(3-s))] : ['🔒 ',['','Oson','O\'rta','Qiyin'][l]]));
      });
      const firstOpen = [3,2,1].find(l=>Z.levelUnlocked(t.id,l) && Z.starsOf(t.id,l)<3) || 1;
      g.appendChild(h('div',{class:'topic',onclick:()=>{Z.sfx('click');Z.startLesson(t, firstOpen);},style:{cursor:'pointer'}},
        h('div',{class:'ti '+t.c}, t.e),
        h('div',{class:'grow'}, h('div',{class:'tn'}, t.n), h('div',{class:'small muted'}, t.d + (st?' · '+Math.round(st.c/st.t*100)+'%':'')), lv)));
    });
    app.appendChild(g);
  });
}

/* ---------- Imtihonlar ---------- */
function exams(){
  Z.nav.go('📝 Imtihon sinovi', app => {
    app.appendChild(Z.mascot('Haqiqiy imtihon kabi: vaqt bor, javoblar oxirida tekshiriladi. Tinch o\'tir, diqqat bilan o\'qi! 🍀'));
    const g = h('div',{class:'col',style:{marginTop:'14px'}});
    Z.EXAMS.forEach(ex=>{
      const best = Z.S.exams.filter(e=>e.id===ex.id).reduce((m,e)=>Math.max(m,Math.round(e.c/e.n*100)),-1);
      g.appendChild(h('div',{class:'topic',style:{cursor:'pointer'},onclick:()=>{ Z.sfx('click'); Z.modal([h('div',{style:{fontSize:'60px'}},ex.e),h('h2',null,ex.n),h('p',null,ex.d),h('p',{class:'muted small'},'Savollarni istalgan tartibda yechish mumkin. Vaqt tugasa, imtihon avtomatik yakunlanadi.')],[{t:'Boshlash ⏱',cls:'grn',fn:()=>Z.startExam(ex)},{t:'Keyinroq',cls:'ghost'}]); }},
        h('div',{class:'ti c-red'}, ex.e), h('div',{class:'grow'}, h('div',{class:'tn'}, ex.n), h('div',{class:'small muted'}, ex.d), best>=0?h('div',{class:'small',style:{color:'var(--grn-d)'}},'Eng yaxshi natija: '+best+'%'):null)));
    });
    app.appendChild(g);
    if (Z.S.exams.length){
      app.appendChild(h('div',{class:'h-sec'},'📈 Oxirgi natijalar'));
      const tb = h('table',{class:'st card'}, h('tr',null,h('th',null,'Sana'),h('th',null,'Test'),h('th',null,'Natija'),h('th',null,'Baho')));
      Z.S.exams.slice(-8).reverse().forEach(e=>tb.appendChild(h('tr',null,h('td',null,e.d),h('td',null,(Z.EXAMS.find(x=>x.id===e.id)||{e:''}).e),h('td',null,e.c+'/'+e.n),h('td',null,h('b',null,e.g)))));
      app.appendChild(tb);
    }
  });
}

/* ---------- O'yinlar ---------- */
function openGame(g){ Z.gamePlay(g.id); Z.nav.go(g.e+' '+g.n, app => g.run(app)); }
Z.openGame = openGame;
function games(){
  Z.nav.go('🎮 Aqlli o\'yinlar', app => {
    app.appendChild(Z.mascot('Har bir g\'alaba uchun tanga va XP olasan! Qaysi o\'yindan boshlaymiz? 🎲'));
    const cats = [['Mantiq va hisob',x=>x.cat==='logic'],['Strategiya (kompyuterga qarshi)',x=>x.cat==='strategy'],['Tezkorlik va xotira',x=>x.cat==='fast']];
    cats.forEach(([n,f])=>{
      app.appendChild(h('div',{class:'h-sec'}, n));
      const t = h('div',{class:'tiles'});
      Z.GAMES.filter(f).forEach(g=>{ const st=Z.S.games[g.id]; t.appendChild(h('button',{class:'tile '+g.c,onclick:()=>{Z.sfx('click');openGame(g);}}, st&&st.wins?h('span',{class:'badge'},'🏆 '+st.wins):null, h('div',{class:'em'},g.e), h('div',{class:'t'},g.n), h('div',{class:'s'},g.d))); });
      app.appendChild(t);
    });
  });
}

/* ---------- Do'kon ---------- */
function shop(){
  Z.nav.go('🏪 Do\'kon', app => {
    const S = Z.S;
    const draw = () => {
      app.innerHTML = '';
      app.appendChild(Z.mascot('Tangalaringni yangi qahramon va mavzularga almashtir! 🪙 Sende: '+S.coins+' ta tanga.'));
      app.appendChild(h('div',{class:'h-sec'},'🦸 Qahramonlar'));
      const g = h('div',{class:'grid3'});
      Z.AVATARS.forEach(([e,p])=>{
        const own = S.owned.includes(e), on = S.avatar===e;
        g.appendChild(h('div',{class:'item'}, h('div',{class:'em'},e),
          on ? h('div',{class:'nm',style:{color:'var(--grn-d)'}},'✓ Tanlangan') :
          own ? h('button',{class:'btn sm blu',onclick:()=>{S.avatar=e;Z.save();Z.sfx('pop');draw();}},'Tanlash') :
          h('button',{class:'btn sm yel',onclick:()=>{ if(Z.spend(p)){ S.owned.push(e); S.avatar=e; Z.save(); Z.sfx('win'); Z.confetti(80); draw(); } }},'🪙 '+p)));
      });
      app.appendChild(g);
      app.appendChild(h('div',{class:'h-sec'},'🎨 Mavzular (rang)'));
      const t = h('div',{class:'grid3'});
      Z.THEMES.forEach(th=>{
        const own = (S.themes||['']).includes(th.id), on = (S.theme||'')===th.id;
        t.appendChild(h('div',{class:'item'}, h('div',{class:'em'},th.e), h('div',{class:'nm'},th.n),
          on ? h('div',{class:'nm',style:{color:'var(--grn-d)'}},'✓ Faol') :
          own ? h('button',{class:'btn sm blu',onclick:()=>{S.theme=th.id;Z.save();Z.applyTheme();draw();}},'Yoqish') :
          h('button',{class:'btn sm yel',onclick:()=>{ if(Z.spend(th.p)){ (S.themes=S.themes||['']).push(th.id); S.theme=th.id; Z.save(); Z.applyTheme(); Z.sfx('win'); draw(); } }},'🪙 '+th.p)));
      });
      app.appendChild(t);
    };
    draw();
  });
}

/* ---------- Yutuqlar ---------- */
function badges(){
  Z.nav.go('🏅 Yutuqlar', app => {
    const S = Z.S, L = Z.levelInfo(S.xp);
    app.appendChild(h('div',{class:'card'},
      h('div',{class:'row'}, h('div',{style:{fontSize:'54px'}},L.rank.e), h('div',{class:'grow'}, h('h2',null,L.rank.n), h('div',{class:'muted'}, L.lv+'-daraja · '+S.xp+' XP · '+S.totalCorrect+' ta to\'g\'ri javob')))));
    app.appendChild(h('div',{class:'h-sec'},'🪜 Unvonlar zinapoyasi'));
    const r = h('div',{class:'col'});
    Z.RANKS.forEach(k=>r.appendChild(h('div',{class:'card row',style:{padding:'10px 14px',opacity:S.xp>=k.xp?1:.5}}, h('span',{style:{fontSize:'28px'}},k.e), h('b',{class:'grow'},k.n), h('span',{class:'muted'},k.xp+' XP'), S.xp>=k.xp?'✅':'🔒')));
    app.appendChild(r);
    app.appendChild(h('div',{class:'h-sec'},'🏅 Nishonlar ('+S.badges.length+'/'+Z.BADGES.length+')'));
    const g = h('div',{class:'grid3'});
    Z.BADGES.forEach(b=>{ const got=S.badges.includes(b.id); g.appendChild(h('div',{class:'item'+(got?'':' lock')}, h('div',{class:'em'},b.e), h('div',{class:'nm'},b.n), h('div',{class:'small muted'},b.d))); });
    app.appendChild(g);
  });
}

/* ---------- Ota-onalar paneli ---------- */
function parents(){
  Z.nav.go('👨‍👩‍👧 Ota-onalar paneli', app => {
    const S = Z.S;
    const acc = S.totalAnswers ? Math.round(S.totalCorrect/S.totalAnswers*100) : 0;
    app.appendChild(h('div',{class:'tiles'},
      [['✅',S.totalCorrect,'to\'g\'ri javob'],['🎯',acc+'%','aniqlik'],['📚',S.lessons,'dars'],['📝',S.exams.length,'imtihon'],['🔥',S.bestStreak||0,'eng uzun seriya'],['🏆',Object.values(S.games).reduce((a,g)=>a+g.wins,0),'o\'yin g\'alabasi']]
      .map(([e,v,t])=>h('div',{class:'card center'}, h('div',{style:{fontSize:'30px'}},e), h('div',{style:{fontSize:'26px',fontWeight:900}},v), h('div',{class:'small muted'},t)))));
    // oxirgi 7 kun
    app.appendChild(h('div',{class:'h-sec'},'📅 Oxirgi 7 kun faolligi'));
    const days = []; for (let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); days.push([['Ya','Du','Se','Ch','Pa','Ju','Sh'][d.getDay()], (S.hist[k]||{t:0,c:0})]); }
    const mx = Math.max(10, ...days.map(d=>d[1].t));
    app.appendChild(h('div',{class:'card',style:{display:'flex',alignItems:'flex-end',gap:'10px',height:'170px'}}, days.map(([n,v])=>h('div',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',height:'100%',justifyContent:'flex-end'}},
      h('div',{class:'small'},v.c), h('div',{style:{width:'100%',height:(v.c/mx*110)+'px',background:'var(--grn)',borderRadius:'8px 8px 0 0',minHeight:'3px'}}), h('div',{class:'small muted'},n)))));
    // mavzular bo'yicha
    app.appendChild(h('div',{class:'h-sec'},'📊 Mavzular bo\'yicha natijalar'));
    const rows = Z.allTopics().map(t=>[t, S.stats[t.id]]).filter(x=>x[1]).sort((a,b)=>a[1].c/a[1].t - b[1].c/b[1].t);
    if (!rows.length) app.appendChild(h('div',{class:'card muted'},'Hali ma\'lumot yo\'q. Farzandingiz darslarni boshlagach, bu yerda kuchli va kuchsiz mavzulari ko\'rinadi.'));
    else {
      const tb = h('div',{class:'card col'});
      rows.forEach(([t,s])=>{ const p=Math.round(s.c/s.t*100); tb.appendChild(h('div',null, h('div',{class:'row'}, h('span',null,t.e), h('b',{class:'grow'},t.n), h('span',{class:'small muted'},s.c+'/'+s.t), h('b',{style:{color:p>=80?'var(--grn-d)':p>=60?'var(--org-d)':'var(--red)'}},p+'%')), h('div',{class:'bar',style:{marginTop:'4px'}}, h('i',{style:{width:p+'%',background:p>=80?'var(--grn)':p>=60?'var(--org)':'var(--red)'}})))); });
      app.appendChild(tb);
      const weak = rows.filter(([t,s])=>s.t>=5 && s.c/s.t<.7).slice(0,3);
      if (weak.length) app.appendChild(h('div',{class:'card',style:{marginTop:'10px',background:'var(--red-l)'}}, h('b',null,'💡 Tavsiya: '), 'ko\'proq mashq kerak bo\'lgan mavzular — ', weak.map(([t])=>t.n).join(', '), '.'));
    }
    // sozlamalar
    app.appendChild(h('div',{class:'h-sec'},'⚙️ Sozlamalar'));
    const name = h('input',{class:'field',value:S.name,maxlength:'20'});
    const seg = h('div',{class:'seg'}); [3,4].forEach(g=>{ const b=h('button',{class:g===S.grade?'on':'',onclick:()=>{S.grade=g;Z.save();[...seg.children].forEach(x=>x.classList.remove('on'));b.classList.add('on');}}, g+'-sinf'); seg.appendChild(b); });
    app.appendChild(h('div',{class:'card col'},
      h('b',null,'Ism'), h('div',{class:'row'}, h('div',{class:'grow'},name), h('button',{class:'btn sm',onclick:()=>{ if(name.value.trim()){S.name=name.value.trim();Z.save();Z.toast('Saqlandi ✅');} }},'Saqlash')),
      h('b',null,'Sinf'), seg,
      h('div',{class:'row'}, h('b',{class:'grow'},'Ovozlar'), h('button',{class:'btn sm '+(S.sound?'grn':'ghost'),onclick:e=>{S.sound=!S.sound;Z.save();e.target.textContent=S.sound?'🔊 Yoqilgan':'🔇 O\'chirilgan';e.target.className='btn sm '+(S.sound?'grn':'ghost');}}, S.sound?'🔊 Yoqilgan':'🔇 O\'chirilgan')),
      h('button',{class:'btn red sm',onclick:()=>Z.modal([h('h2',null,'Hammasini o\'chirish?'),h('p',null,'Barcha tangalar, yulduzlar va statistika o\'chadi. Buni qaytarib bo\'lmaydi.')],[{t:'Ha, o\'chirish',cls:'red',fn:()=>{Z.resetAll();Z.applyTheme();Z.nav.root('Zukko',onboarding);}},{t:'Bekor qilish',cls:'ghost'}])},'🗑 Progressni tozalash')));
    app.appendChild(h('p',{class:'small muted center',style:{marginTop:'16px'}},'Zukko · Prezident, Al-Xorazmiy va ixtisoslashtirilgan maktablarga tayyorlov (3–4 sinf). Savollar har safar yangidan yaratiladi. Natijalar shu qurilmada saqlanadi.'));
  });
}

/* ---------- start ---------- */
function start(){
  Z.load(); Z.applyTheme();
  if (Z.S.created){ Z.touchDay(); Z.nav.root('Zukko', home); }
  else Z.nav.root('Zukko', onboarding);
  document.addEventListener('keydown', e=>{ if (e.key==='Escape') document.getElementById('overlay').classList.remove('on'); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/claude|claudeusercontent/.test(location.host)){
    try{ navigator.serviceWorker.register('sw.js').catch(()=>{}); }catch(e){}
  }
}
Z.home = home;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

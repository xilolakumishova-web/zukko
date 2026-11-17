/* Dars va imtihon dvigateli */
(function(){
'use strict';
const h = Z.h;
const LETTERS = ['A','B','C','D','E'];

Z.allTopics = () => [...Z.MATH, ...Z.ENG, ...Z.LOGIC];
Z.topicById = id => Z.allTopics().find(t=>t.id===id);
Z.starsOf = (id, lv) => Z.S.stars[id+'_'+lv] || 0;
Z.levelUnlocked = (id, lv) => lv===1 || Z.starsOf(id, lv-1) >= 2;

/* bitta savolni chizish */
function questionView(q, opts){
  const box = h('div',{class:'qcard'});
  if (opts.topic) box.appendChild(h('div',{class:'qtopic'}, opts.topic));
  const qt = h('div',{class:'qtext',html:q.q});
  box.appendChild(qt);
  if (q.speak) box.appendChild(h('div',{style:{marginBottom:'10px'}}, h('button',{class:'speak',onclick:()=>Z.speak(q.speak)},'🔊 Tinglash')));
  if (q.html) box.appendChild(h('div',{class:'qimg',html:q.html}));
  const long = q.one || q.opts.some(o=>String(o).length>22);
  const grid = h('div',{class:'opts'+(long?' one':'')});
  const btns = q.opts.map((o,i)=>{
    const b = h('button',{class:'opt'}, h('span',{class:'k'},LETTERS[i]), h('span',{html:String(o)}));
    b.onclick = ()=>opts.onPick(i, b, btns);
    grid.appendChild(b); return b;
  });
  box.appendChild(grid);
  return {box, btns};
}

/* ---------------- DARS ---------------- */
Z.startLesson = function(topic, lv, custom){
  const N = custom ? custom.length : 10;
  Z.nav.go(topic.e+' '+topic.n+(custom?' — xatolar':' · '+['','Oson','O\'rta','Qiyin'][lv]), app => {
    let i = 0, correct = 0, combo = 0, earned = 0;
    const seen = new Set();
    const next = () => {
      if (i >= N) return finish();
      let q;
      if (custom) q = custom[i];
      else { for (let k=0;k<12;k++){ q = topic.g(lv); if (!seen.has(q.q)) break; } seen.add(q.q); }
      app.innerHTML = '';
      const head = h('div',{class:'qhead'},
        h('div',{class:'qprog'}, h('i',{style:{width:(i/N*100)+'%'}})),
        h('span',{class:'pill'}, (i+1)+'/'+N),
        combo>=2 ? h('span',{class:'pill fire'},'🔥×'+combo) : null);
      app.appendChild(head);
      let answered = false;
      const {box} = questionView(q, {topic: custom ? (Z.topicById(q.tid)||{n:''}).n : null, onPick:(k, b, btns)=>{
        if (answered) return; answered = true;
        const ok = k === q.a;
        btns.forEach((x,j)=>{ if (j===q.a) x.classList.add('ok'); });
        const tid = custom ? q.tid : topic.id;
        Z.recordAnswer(tid, ok);
        if (ok){
          correct++; combo++;
          const c = 5 + (combo>=3 ? 3 : 0); earned += c;
          Z.sfx('ok'); Z.reward(c, 10, b);
          if (custom) Z.S.mistakes = (Z.S.mistakes||[]).filter(m=>m.q!==q.q);
        } else {
          b.classList.add('bad'); combo = 0; Z.sfx('bad');
          if (!custom){ const m = Z.S.mistakes || (Z.S.mistakes = []); if (!m.some(x=>x.q===q.q)) m.push(Object.assign({tid:topic.id}, q)); if (m.length>60) m.shift(); }
        }
        Z.save();
        const fb = h('div',{class:'fb '+(ok?'ok':'bad')},
          h('div',{class:'big'}, ok?'🎉':'🤔'),
          h('div',{class:'grow'}, h('div',{style:{fontWeight:900,fontSize:'18px'}}, ok ? Z.praise() : 'To\'g\'ri javob: '+LETTERS[q.a]+') '+String(q.opts[q.a]).replace(/<[^>]+>/g,'')), h('div',{class:'ex'}, q.exp||'')));
        box.appendChild(fb);
        const nb = h('button',{class:'btn wide '+(ok?'grn':'org'),style:{marginTop:'14px'},onclick:()=>{ Z.sfx('click'); i++; next(); }}, i+1>=N ? 'Natijani ko\'rish 🏁' : 'Davom etish ➜');
        box.appendChild(nb);
        setTimeout(()=>nb.scrollIntoView({behavior:'smooth',block:'nearest'}), 60);
      }});
      app.appendChild(box);
    };
    const finish = () => {
      const pct = correct / N;
      const grade = pct>=.9?5:pct>=.7?4:pct>=.5?3:2;
      const stars = pct>=.9?3:pct>=.7?2:pct>=.5?1:0;
      const S = Z.S;
      if (!custom){
        const key = topic.id+'_'+lv; const prev = S.stars[key]||0;
        if (stars > prev) S.stars[key] = stars;
        S.lessons++; Z.dailyAdd('lessons');
      }
      const bonus = stars*10;
      Z.save();
      app.innerHTML = '';
      const gc = {5:'var(--grn)',4:'var(--blu)',3:'var(--org)',2:'var(--red)'}[grade];
      app.appendChild(h('div',{class:'card res'},
        h('h2',null, grade>=4 ? 'Ajoyib natija!' : grade===3 ? 'Yaxshi harakat!' : 'Mashq qilishda davom et!'),
        h('div',{class:'stars'}, [0,1,2].map(k=>h('span',{class:k<stars?'':'off'},'⭐'))),
        h('div',{class:'grade',style:{background:gc}}, grade),
        h('div',{class:'muted'}, 'Baho · '+correct+' / '+N+' to\'g\'ri'),
        h('div',{class:'rw'}, h('span',{class:'pill coin'},'🪙 +'+(earned+bonus)), h('span',{class:'pill xp'},'⚡ +'+(correct*10+stars*15)+' XP')),
        Z.mascot(grade>=4 ? 'Sen haqiqiy zukko ekansan! Keyingi darajaga o\'t! 🚀' : grade===3 ? 'Yomon emas! Yana bir marta urinib, 3 yulduz olishga harakat qil! 💪' : 'Xatolar — o\'rganish yo\'li. Tushuntirishlarni o\'qib, qayta urinib ko\'r! 🌱', grade<3?'sad':null),
        h('div',{class:'row',style:{justifyContent:'center',marginTop:'16px'}},
          h('button',{class:'btn grn',onclick:()=>Z.startLessonAgain(topic, lv, custom)},'🔄 Qayta'),
          (!custom && lv<3 && Z.levelUnlocked(topic.id, lv+1)) ? h('button',{class:'btn org',onclick:()=>{ Z.nav.back(); Z.startLesson(topic, lv+1); }},'Keyingi daraja ➜') : null,
          h('button',{class:'btn ghost',onclick:()=>Z.nav.back()},'Chiqish'))));
      if (stars>=1){ Z.confetti(stars*60); Z.sfx('win'); }
      Z.reward(bonus, stars*15);
    };
    next();
  });
};
Z.startLessonAgain = function(topic, lv, custom){ Z.nav.back(); if (custom) Z.startMistakes(); else Z.startLesson(topic, lv); };

/* Xatolar ustida ishlash */
Z.startMistakes = function(){
  const m = (Z.S.mistakes||[]).slice(-10);
  if (!m.length){ Z.toast('Xatolar yo\'q — barakalla! 🎉'); return; }
  Z.startLesson({id:'mistakes', n:'Xatolar ustida ishlash', e:'🛠️'}, 1, Z.shuffle(m));
};

/* ---------------- IMTIHON ---------------- */
Z.EXAMS = [
  {id:'pm1', n:'Prezident maktabi — 1-bosqich (sinov)', e:'🏛️', d:'Matematika + mantiq + tanqidiy fikrlash · 30 savol · 45 daqiqa', min:45,
    plan:[['m_arith',2],['m_arith',3],['m_seq',3],['m_eq',2],['m_eq',3],['m_time',2],['m_time',3],['m_units',3],['m_geom',2],['m_geom',3],['m_word',2],['m_word',3],['m_word',3],['m_frac',2],['m_frac',3],['m_nums',2],['m_nums',3],['m_data',3],
      ['lg_puzzle',2],['lg_puzzle',3],['lg_truth',2],['lg_truth',3],['lg_crit',2],['lg_crit',3],['lg_order',3],['lg_analogy',2],['lg_pattern',3],['lg_sets',3],['lg_odd',2],['m_seq',2]]},
  {id:'eng', n:'Ingliz tili — sinov testi', e:'🇬🇧', d:'Grammar · Vocabulary · Reading · 20 savol · 25 daqiqa', min:25,
    plan:[['en_vocab',2],['en_vocab',3],['en_vocab',3],['en_plural',2],['en_plural',3],['en_be',2],['en_be',3],['en_art',2],['en_art',3],['en_tense',2],['en_tense',3],['en_tense',3],['en_prep',2],['en_prep',3],['en_opp',3],['en_dialog',2],['en_dialog',3],['en_read',3],['en_read',3],['en_read',3]]},
  {id:'mini', n:'Mini-test (aralash)', e:'⚡', d:'Hammasidan ozgina · 15 savol · 20 daqiqa', min:20,
    plan:[['m_arith',2],['m_seq',2],['m_eq',2],['m_time',2],['m_geom',2],['m_word',2],['m_frac',2],['lg_puzzle',2],['lg_truth',2],['lg_crit',2],['lg_order',2],['en_vocab',2],['en_be',2],['en_tense',2],['en_read',2]]}
];
Z.startExam = function(ex){
  Z.nav.go(ex.e+' '+ex.n, app => {
    const qs = ex.plan.map(([id,lv])=>{ const t=Z.topicById(id); let q; const seen=new Set(); q=t.g(lv); return Object.assign({tid:id}, q); });
    const ans = qs.map(()=>-1);
    let cur = 0, left = ex.min*60, done = false;
    const tick = Z.interval(()=>{ if (done) return; left--; const t=document.getElementById('extimer'); if (t){ t.textContent='⏱ '+Z.fmtTime(left); if (left<60) t.style.color='var(--red)'; } if (left<=0){ Z.toast('Vaqt tugadi! ⏰'); submit(); } }, 1000);
    const render = () => {
      app.innerHTML = '';
      const q = qs[cur];
      app.appendChild(h('div',{class:'qhead'},
        h('div',{class:'qprog'}, h('i',{style:{width:(ans.filter(a=>a>=0).length/qs.length*100)+'%'}})),
        h('span',{class:'pill timer',id:'extimer'},'⏱ '+Z.fmtTime(left))));
      const {box, btns} = questionView(q, {topic:(cur+1)+'-savol · '+Z.topicById(q.tid).n, onPick:(k,b,bs)=>{ ans[cur]=k; Z.sfx('pop'); bs.forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); setTimeout(()=>{ if (cur<qs.length-1){ cur++; render(); } else render(); }, 280); }});
      if (ans[cur]>=0) btns[ans[cur]].classList.add('sel');
      app.appendChild(box);
      const nav = h('div',{class:'row',style:{justifyContent:'space-between',marginTop:'14px'}},
        h('button',{class:'btn ghost sm',disabled:cur===0,onclick:()=>{cur--;render();}},'‹ Oldingi'),
        h('button',{class:'btn org sm',onclick:()=>{ const n=ans.filter(a=>a<0).length; Z.modal([h('h2',null,'Imtihonni yakunlaysizmi?'), h('p',null, n ? n+' ta savolga javob berilmagan.' : 'Barcha savollarga javob berdingiz.')],[{t:'Ha, yakunlash',cls:'grn',fn:submit},{t:'Davom etish',cls:'ghost'}]); }},'Yakunlash 🏁'),
        h('button',{class:'btn ghost sm',disabled:cur===qs.length-1,onclick:()=>{cur++;render();}},'Keyingi ›'));
      app.appendChild(nav);
      const dots = h('div',{class:'row',style:{marginTop:'14px',gap:'6px',justifyContent:'center'}});
      qs.forEach((_,k)=>dots.appendChild(h('button',{class:'lvb',style:{background:k===cur?'var(--pri)':ans[k]>=0?'var(--grn-l)':'',color:k===cur?'#fff':''},onclick:()=>{cur=k;render();}}, k+1)));
      app.appendChild(dots);
    };
    const submit = () => {
      if (done) return; done = true; clearInterval(tick);
      let c = 0; qs.forEach((q,k)=>{ const ok = ans[k]===q.a; if (ok) c++; Z.recordAnswer(q.tid, ok); if (!ok){ const m=Z.S.mistakes||(Z.S.mistakes=[]); if(!m.some(x=>x.q===q.q)) m.push(q); if(m.length>60)m.shift(); } });
      const pct = c/qs.length; const grade = pct>=.86?5:pct>=.7?4:pct>=.5?3:2;
      const spent = ex.min*60-left;
      Z.S.exams.push({id:ex.id, c, n:qs.length, g:grade, d:Z.today(), t:spent}); if (Z.S.exams.length>50) Z.S.exams.shift();
      Z.dailyAdd('lessons'); Z.save();
      const coins = c*3 + (grade===5?50:grade===4?25:0);
      app.innerHTML = '';
      const gc = {5:'var(--grn)',4:'var(--blu)',3:'var(--org)',2:'var(--red)'}[grade];
      const score = Math.round(pct*100);
      app.appendChild(h('div',{class:'card res'},
        h('h2',null,'Imtihon natijasi'),
        h('div',{class:'grade',style:{background:gc}}, grade),
        h('div',{style:{fontSize:'22px',fontWeight:900}}, c+' / '+qs.length+' to\'g\'ri · '+score+'%'),
        h('div',{class:'muted'}, 'Sarflangan vaqt: '+Z.fmtTime(spent)),
        h('div',{class:'rw'}, h('span',{class:'pill coin'},'🪙 +'+coins), h('span',{class:'pill xp'},'⚡ +'+(c*12)+' XP')),
        Z.mascot(score>=86 ? 'Zo\'r! Sen Prezident maktabi imtihoniga tayyor bo\'lib boryapsan! 🎓' : score>=60 ? 'Yaxshi! Xatolar ro\'yxatini ko\'rib chiq va yana mashq qil. 💪' : 'Hali mashq kerak. Mavzular bo\'yicha darslarni o\'tib, qayta topshir! 🌱')));
      const rv = h('div',{class:'col',style:{marginTop:'14px'}}, h('div',{class:'h-sec'},'📋 Javoblar tahlili'));
      qs.forEach((q,k)=>{
        const ok = ans[k]===q.a;
        rv.appendChild(h('details',{class:'card',style:{padding:'12px'}},
          h('summary',{style:{cursor:'pointer',fontWeight:900}}, (ok?'✅ ':'❌ ')+(k+1)+'-savol · '+Z.topicById(q.tid).n),
          h('div',{class:'qtext',style:{fontSize:'16px'},html:q.q}), q.html?h('div',{class:'qimg',html:q.html}):null,
          h('div',null,'Sizning javobingiz: ', h('b',{html: ans[k]>=0 ? LETTERS[ans[k]]+') '+q.opts[ans[k]] : '—'})),
          h('div',{style:{color:'var(--grn-d)'}},'To\'g\'ri javob: ', h('b',{html:LETTERS[q.a]+') '+q.opts[q.a]})),
          h('div',{class:'ex muted',style:{marginTop:'6px',whiteSpace:'pre-line'}}, q.exp)));
      });
      app.appendChild(rv);
      app.appendChild(h('div',{class:'row',style:{justifyContent:'center',marginTop:'14px'}}, h('button',{class:'btn ghost',onclick:()=>Z.nav.back()},'Chiqish')));
      if (grade>=4){ Z.confetti(220); Z.sfx('win'); }
      Z.reward(coins, c*12);
    };
    render();
  });
};
})();

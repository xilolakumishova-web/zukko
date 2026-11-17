/* Kichik o'yinlar: Xotira, Kod buzar, Hanoy minorasi, 15 jumboq, Tezkor hisob */
(function(){
'use strict';
const h = Z.h, {ri, pick, shuffle} = Z;

/* ---------- XOTIRA (inglizcha so'z ↔ rasm) ---------- */
function memory(app){
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Kartalarni ochib, juftini top: inglizcha so\'z va uning rasmi! Bu ham xotirani, ham ingliz tilini kuchaytiradi 🧠🇬🇧'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    [[6,'Oson','12 karta','c-grn'],[8,'O\'rta','16 karta','c-org'],[10,'Qiyin','20 karta','c-red']].forEach(([n,a,b,c])=>t.appendChild(h('button',{class:'tile '+c,onclick:()=>{Z.sfx('click');play(n);}}, h('div',{class:'em'},'🧠'), h('div',{class:'t'},a), h('div',{class:'s'},b))));
    app.appendChild(t);
  };
  const play = n => {
    const words = shuffle(Z.WORDS).slice(0,n);
    const cards = shuffle([].concat(...words.map((w,i)=>[{id:i,k:'e',w},{id:i,k:'t',w}])));
    let open = [], got = 0, tries = 0, lock = false;
    app.innerHTML='';
    const cols = n<=6?4:n<=8?4:5;
    const grid = h('div',{class:'mem',style:{gridTemplateColumns:`repeat(${cols},1fr)`}});
    const info = h('span',{class:'ginfo'},'');
    app.appendChild(h('div',{class:'gwrap'}, h('div',{class:'gbar'}, info, h('button',{class:'btn sm ghost',onclick:menu},'↩')), grid));
    const upd = () => info.textContent = '✅ '+got+'/'+n+' · 👆 '+tries;
    cards.forEach(c=>{
      const el = h('div',{class:'mcard'}, h('div',{class:'in'}, h('div',{class:'bk'},'⭐'), h('div',{class:'fr'}, c.k==='e' ? h('div',{class:'e'},c.w[1]) : h('div',null,c.w[0]))));
      el.onclick = () => {
        if (lock || el.classList.contains('up')) return;
        el.classList.add('up'); Z.sfx('click'); if (c.k==='t') Z.speak(c.w[0]);
        open.push([c,el]);
        if (open.length===2){
          tries++; const [[a,ea],[b,eb]] = open; open=[];
          if (a.id===b.id){ got++; Z.sfx('ok'); ea.classList.add('got'); eb.classList.add('got'); Z.toast(a.w[1]+' '+a.w[0]+' — '+a.w[2], 1400);
            if (got===n){ const coins = Math.max(10, n*4 - Math.max(0,tries-n)*2); Z.gameWin('memory', coins, 25); setTimeout(()=>Z.winModal('Ajoyib xotira!', tries+' ta urinishda', coins, ()=>play(n), '🧠'), 600); } }
          else { lock=true; setTimeout(()=>{ ea.classList.remove('up'); eb.classList.remove('up'); lock=false; }, 900); }
          upd();
        }
      };
      grid.appendChild(el);
    });
    upd();
  };
  menu();
}

/* ---------- KOD BUZAR (Mastermind) ---------- */
function mastermind(app){
  const COLS = ['#FF4D4D','#3FA7FF','#FFD93D','#2ECC71','#B66DFF','#FF9F1C'];
  const play = (len, nc) => {
    const secret = [...Array(len)].map(()=>ri(0,nc-1));
    const rows = []; let cur = Array(len).fill(-1), won = false; const MAX = 10;
    app.innerHTML='';
    const board = h('div',{class:'col',style:{alignItems:'center',gap:'6px'}});
    const pal = h('div',{class:'row',style:{justifyContent:'center'}});
    app.appendChild(h('div',{class:'gwrap'},
      Z.mascot('Kompyuter '+len+' ta rangdan maxfiy kod o\'yladi (ranglar takrorlanishi mumkin). Har urinishdan keyin: ⚫ — rang ham, joy ham to\'g\'ri; ⚪ — rang bor, lekin joyi boshqa. '+MAX+' urinishda top! 🔐'),
      board, pal,
      h('div',{class:'gbar'}, h('button',{class:'btn sm blu',onclick:()=>{ const last=[...cur.keys()].reverse().find(k=>cur[k]>=0); if(last!=null){cur[last]=-1;draw();} }},'⌫'), h('button',{class:'btn sm grn',onclick:submit},'✅ Tekshirish'), h('button',{class:'btn sm ghost',onclick:menu},'↩'))));
    COLS.slice(0,nc).forEach((c,i)=>pal.appendChild(h('button',{class:'peg',style:{background:c,width:'46px',height:'46px',boxShadow:'0 4px 0 rgba(0,0,0,.2)'},onclick:()=>{ const k=cur.indexOf(-1); if(k>=0 && !won){ cur[k]=i; Z.sfx('pop'); draw(); } }})));
    function fb(g){ let b=0,w=0; const s1=[],g1=[]; g.forEach((x,i)=>{ if(x===secret[i]) b++; else { s1.push(secret[i]); g1.push(x); } }); g1.forEach(x=>{ const k=s1.indexOf(x); if(k>=0){ w++; s1.splice(k,1); } }); return [b,w]; }
    function draw(){
      board.innerHTML='';
      rows.forEach(([g,[b,w]],i)=>board.appendChild(h('div',{class:'mm-row'}, h('b',{style:{width:'22px'}},i+1), g.map(x=>h('div',{class:'peg',style:{background:COLS[x]}})), h('div',{class:'keys'}, [...Array(len)].map((_,k)=>h('i',{class:k<b?'b':k<b+w?'w':''}))))));
      if (!won && rows.length<MAX) board.appendChild(h('div',{class:'mm-row',style:{outline:'3px solid var(--pri)'}}, h('b',{style:{width:'22px'}},rows.length+1), cur.map((x,k)=>h('div',{class:'peg',style:{background:x>=0?COLS[x]:''},onclick:()=>{cur[k]=-1;draw();}}))));
    }
    function submit(){
      if (won) return; if (cur.includes(-1)){ Z.toast('Hamma kataklarni to\'ldir'); return; }
      const r = fb(cur); rows.push([cur.slice(), r]); cur = Array(len).fill(-1);
      if (r[0]===len){ won=true; draw(); const coins = 15 + (MAX-rows.length)*4 + (len-3)*10; Z.gameWin('mastermind', coins, 30); setTimeout(()=>Z.winModal('Kod buzildi! 🔓', rows.length+' ta urinishda', coins, ()=>play(len,nc), '🔐'), 500); return; }
      Z.sfx('click');
      if (rows.length>=MAX){ won=true; draw(); Z.sfx('lose'); Z.modal([h('h2',null,'Urinishlar tugadi'), h('p',null,'Maxfiy kod:'), h('div',{class:'row',style:{justifyContent:'center'}}, secret.map(x=>h('div',{class:'peg',style:{background:COLS[x]}})))],[{t:'Yana',cls:'grn',fn:()=>play(len,nc)},{t:'Chiqish',cls:'ghost',fn:menu}]); return; }
      draw();
    }
    draw();
  };
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Kod buzar — haqiqiy detektiv o\'yini! Mantiqiy xulosa chiqarib, maxfiy rangli kodni top 🕵️'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    [[3,4,'Oson','3 ta katak, 4 rang','c-grn'],[4,6,'Klassik','4 ta katak, 6 rang','c-pri']].forEach(([l,c,a,b,cl])=>t.appendChild(h('button',{class:'tile '+cl,onclick:()=>{Z.sfx('click');play(l,c);}}, h('div',{class:'em'},'🔐'), h('div',{class:'t'},a), h('div',{class:'s'},b))));
    app.appendChild(t);
  };
  menu();
}

/* ---------- HANOY MINORASI ---------- */
function hanoi(app){
  const DC = ['#FF4D4D','#FF9F1C','#FFD93D','#2ECC71','#3FA7FF','#B66DFF','#FF6FB5'];
  const G = Z.S.games.hanoi || (Z.S.games.hanoi = {wins:0, plays:0}); G.n = G.n || 3;
  const play = () => {
    const n = Math.min(G.n, 7); const pegs = [[...Array(n)].map((_,i)=>n-i), [], []];
    let sel = -1, moves = 0, won = false; const min = Math.pow(2,n)-1;
    app.innerHTML='';
    const area = h('div',{class:'row',style:{justifyContent:'center',gap:'10px',flexWrap:'nowrap',width:'100%',maxWidth:'640px'}});
    const info = h('span',{class:'ginfo'},'');
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},'🗼 '+n+' ta disk'), info, h('button',{class:'btn sm ghost',onclick:play},'🔄')),
      area,
      h('div',{class:'howto'},'Barcha disklarni chapdagi ustundan o\'ngdagi ustunga o\'tkaz. Bir vaqtda faqat bitta (eng ustki) diskni olish mumkin va katta disk kichigining ustiga qo\'yilmaydi. Eng kam yurishlar: '+min)));
    function draw(){
      info.textContent = '👣 '+moves;
      area.innerHTML='';
      pegs.forEach((p,i)=>{
        const col = h('div',{style:{flex:1,height:(n*30+60)+'px',background:i===sel?'var(--pri-l)':'var(--card)',borderRadius:'16px',boxShadow:'var(--shadow)',display:'flex',flexDirection:'column-reverse',alignItems:'center',padding:'10px 4px',position:'relative',cursor:'pointer'},onclick:()=>click(i)});
        col.appendChild(h('div',{style:{position:'absolute',bottom:'10px',width:'8px',height:(n*30+20)+'px',background:'#8B5A2B',borderRadius:'4px'}}));
        p.forEach(d=>col.appendChild(h('div',{style:{width:(20+d*(80/n))+'%',height:'26px',marginTop:'4px',background:DC[d-1],borderRadius:'13px',boxShadow:'inset 0 -4px 0 rgba(0,0,0,.2)',zIndex:1}})));
        area.appendChild(col);
      });
    }
    function click(i){
      if (won) return;
      if (sel<0){ if (pegs[i].length){ sel=i; Z.sfx('click'); draw(); } return; }
      if (sel===i){ sel=-1; draw(); return; }
      const d = pegs[sel][pegs[sel].length-1], top = pegs[i][pegs[i].length-1];
      if (top && top<d){ Z.sfx('bad'); Z.toast('Katta diskni kichigining ustiga qo\'yib bo\'lmaydi!'); sel=-1; draw(); return; }
      pegs[i].push(pegs[sel].pop()); moves++; sel=-1; Z.sfx('move'); draw();
      if (pegs[2].length===n){ won=true; const coins = 10*n + (moves===min?20:0); G.n++; Z.gameWin('hanoi', coins, 10*n); setTimeout(()=>Z.winModal(moves===min?'Mukammal! Eng kam yurish!':'Minora ko\'chirildi!', moves+' yurish (eng kami '+min+')', coins, play, '🗼'), 500); }
    }
    draw();
  };
  play();
}

/* ---------- 15 JUMBOQ ---------- */
function fifteen(app){
  const play = () => {
    let t = [...Array(15).keys()].map(x=>x+1).concat(0);
    // yechiladigan aralashtirish: tasodifiy yurishlar
    let e = 15; for (let k=0;k<300;k++){ const r=e>>2, c=e&3; const nb=[]; if(r>0)nb.push(e-4); if(r<3)nb.push(e+4); if(c>0)nb.push(e-1); if(c<3)nb.push(e+1); const n=pick(nb); [t[e],t[n]]=[t[n],t[e]]; e=n; }
    let moves=0, won=false; const t0=Date.now();
    app.innerHTML='';
    const grid = h('div',{class:'f15'}); const info=h('span',{class:'ginfo'},'');
    app.appendChild(h('div',{class:'gwrap'}, h('div',{class:'gbar'}, info, h('button',{class:'btn sm ghost',onclick:play},'🔄 Aralashtirish')), grid, h('div',{class:'howto'},'Bo\'sh katak yonidagi sonni bosib, uni suring. Sonlarni 1 dan 15 gacha tartib bilan joylashtir!')));
    function draw(){ info.textContent='👣 '+moves; grid.innerHTML=''; t.forEach((v,i)=>grid.appendChild(h('button',{class:v?'':'emp',onclick:()=>click(i)}, v||''))); }
    function click(i){
      if (won) return; const z=t.indexOf(0); const ok = (Math.abs(i-z)===4) || (Math.abs(i-z)===1 && (i>>2)===(z>>2));
      if (!ok) return; [t[i],t[z]]=[t[z],t[i]]; moves++; Z.sfx('move'); draw();
      if (t.slice(0,15).every((v,k)=>v===k+1)){ won=true; const coins=40; Z.gameWin('fifteen', coins, 40); setTimeout(()=>Z.winModal('Tartibga solindi!', moves+' yurish · '+Z.fmtTime((Date.now()-t0)/1000), coins, play, '🔢'), 400); }
    }
    draw();
  };
  play();
}

/* ---------- TEZKOR HISOB ---------- */
function speed(app){
  const G = Z.S.games.speed || (Z.S.games.speed = {wins:0, plays:0}); G.best = G.best || 0;
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('60 soniyada imkon qadar ko\'p misol yech! Har bir to\'g\'ri javob +1 ochko. Rekordingni yangila! ⚡ Rekord: '+G.best));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    [['add','➕','Qo\'shish-ayirish','c-grn'],['mul','✖️','Ko\'paytirish jadvali','c-org'],['mix','🌀','Aralash','c-pri']].forEach(([k,e,n,c])=>t.appendChild(h('button',{class:'tile '+c,onclick:()=>{Z.sfx('click');play(k);}}, h('div',{class:'em'},e), h('div',{class:'t'},n))));
    app.appendChild(t);
  };
  const gen = k => { const m = k==='mix' ? pick(['add','sub','mul','div']) : k==='add' ? pick(['add','sub']) : pick(['mul','mul','div']);
    if (m==='add'){ const a=ri(10,99), b=ri(5,99); return [a+' + '+b, a+b]; }
    if (m==='sub'){ const a=ri(20,120), b=ri(5,a-1); return [a+' − '+b, a-b]; }
    if (m==='mul'){ const a=ri(2,10), b=ri(2,10); return [a+' × '+b, a*b]; }
    const b=ri(2,10), c=ri(2,10); return [(b*c)+' : '+b, c]; };
  const play = k => {
    let score=0, left=60, q=gen(k), ans='', over=false;
    app.innerHTML='';
    const qEl=h('div',{class:'big-q'}), aEl=h('div',{class:'ans-box'}), tEl=h('span',{class:'ginfo'}), sEl=h('span',{class:'ginfo'});
    const kp = h('div',{class:'kp'});
    [1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].forEach(x=>kp.appendChild(h('button',{onclick:()=>press(String(x)),style:x==='✓'?{background:'var(--grn)',color:'#fff'}:null}, x)));
    app.appendChild(h('div',{class:'gwrap'}, h('div',{class:'gbar'}, tEl, sEl), qEl, aEl, kp));
    const draw = () => { qEl.textContent=q[0]+' = ?'; aEl.textContent=ans||' '; tEl.textContent='⏱ '+left; sEl.textContent='⭐ '+score; };
    function press(x){
      if (over) return;
      if (x==='⌫'){ ans=ans.slice(0,-1); }
      else if (x==='✓'){ if(!ans) return; if (+ans===q[1]){ score++; Z.sfx('ok'); aEl.style.borderColor='var(--grn)'; } else { Z.sfx('bad'); aEl.style.borderColor='var(--red)'; } setTimeout(()=>aEl.style.borderColor='',250); q=gen(k); ans=''; }
      else if (ans.length<4){ ans+=x; if (+ans===q[1] && String(q[1]).length===ans.length){ score++; Z.sfx('ok'); q=gen(k); ans=''; } }
      draw();
    }
    const onKey = e => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key==='Backspace') press('⌫'); else if (e.key==='Enter') press('✓'); };
    document.addEventListener('keydown', onKey); offKey = () => document.removeEventListener('keydown', onKey);
    Z.interval(()=>{ if (over) return; left--; draw(); if (left<=0){ over=true; document.removeEventListener('keydown', onKey);
      const rec = score > G.best; if (rec) G.best = score; const coins = score*2 + (rec?20:0);
      if (score>=10) Z.gameWin('speed', coins, score*3); else { Z.reward(coins, score*3); Z.save(); }
      Z.winModal(rec?'Yangi rekord! 🏆':'Vaqt tugadi!', score+' ta to\'g\'ri javob · Rekord: '+G.best, coins, ()=>play(k), rec?'🏆':'⚡'); } }, 1000);
    draw();
  };
  let offKey = null;
  menu();
  return () => offKey && offKey();
}

Z.GAMES.push(
  {id:'memory', n:'Xotira (English)', e:'🧠', c:'c-tea', d:'Rasm va so\'z juftini top', cat:'fast', hot:true, run:memory},
  {id:'speed', n:'Tezkor hisob', e:'⚡', c:'c-org', d:'60 soniyada misollar', cat:'fast', hot:true, run:speed},
  {id:'mastermind', n:'Kod buzar', e:'🔐', c:'c-ind', d:'Maxfiy rangli kodni top', cat:'logic', hot:false, run:mastermind},
  {id:'hanoi', n:'Hanoy minorasi', e:'🗼', c:'c-red', d:'Disklarni ko\'chir', cat:'logic', hot:false, run:hanoi},
  {id:'fifteen', n:'15 jumboq', e:'🔟', c:'c-yel', d:'Sonlarni tartibla', cat:'logic', hot:false, run:fifteen}
);
})();

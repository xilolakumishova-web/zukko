/* Sudoku: 4×4 (rasmli), 6×6, 9×9 */
(function(){
'use strict';
const h = Z.h;
const CFG = {
  4:{br:2,bc:2,holes:9,coins:15,n:'4×4 (oson)'},
  6:{br:2,bc:3,holes:18,coins:30,n:'6×6 (o\'rta)'},
  9:{br:3,bc:3,holes:40,coins:60,n:'9×9 (qiyin)'},
  10:{br:3,bc:3,holes:50,coins:100,n:'9×9 (usta)',size:9}
};
const FRUITS = ['','🍎','🍌','🍇','🍊'];

function ok(g, N, br, bc, r, c, v){
  for (let i=0;i<N;i++){ if (g[r*N+i]===v || g[i*N+c]===v) return false; }
  const r0=r-r%br, c0=c-c%bc;
  for (let i=0;i<br;i++) for (let j=0;j<bc;j++) if (g[(r0+i)*N+c0+j]===v) return false;
  return true;
}
function fill(g, N, br, bc){
  const i = g.indexOf(0); if (i<0) return true;
  const r=Math.floor(i/N), c=i%N;
  for (const v of Z.shuffle([...Array(N)].map((_,k)=>k+1))){ if (ok(g,N,br,bc,r,c,v)){ g[i]=v; if (fill(g,N,br,bc)) return true; g[i]=0; } }
  return false;
}
function count(g, N, br, bc, lim){
  let best=-1, bestCnt=99;
  for (let i=0;i<N*N;i++) if (!g[i]){ let k=0; const r=Math.floor(i/N), c=i%N; for (let v=1;v<=N;v++) if (ok(g,N,br,bc,r,c,v)) k++; if (k<bestCnt){bestCnt=k;best=i;} if(!k) return 0; }
  if (best<0) return 1;
  let total=0; const r=Math.floor(best/N), c=best%N;
  for (let v=1;v<=N;v++) if (ok(g,N,br,bc,r,c,v)){ g[best]=v; total+=count(g,N,br,bc,lim-total); g[best]=0; if (total>=lim) break; }
  return total;
}
Z.sudokuGen = function(N, br, bc, holes){
  const sol = Array(N*N).fill(0); fill(sol, N, br, bc);
  const puz = sol.slice(); let removed = 0;
  for (const i of Z.shuffle([...Array(N*N).keys()])){
    if (removed>=holes) break;
    const keep = puz[i]; puz[i]=0;
    if (count(puz.slice(),N,br,bc,2)!==1) puz[i]=keep; else removed++;
  }
  return {sol, puz};
};

function run(app){
  let mode = null;
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Sudoku qoidasi: har bir qator, ustun va qalin chiziqli blokda har bir son faqat bir marta bo\'lishi kerak. 🔢'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    [['4f','🍎','Mevali 4×4','Kichkintoylar uchun','c-red'],['4','4️⃣','4×4','Oson · 15🪙','c-grn'],['6','6️⃣','6×6','O\'rta · 30🪙','c-blu'],['9','9️⃣','9×9','Qiyin · 60🪙','c-pri'],['10','👑','9×9 Usta','Juda qiyin · 100🪙','c-ind']].forEach(([k,e,n,d,c])=>
      t.appendChild(h('button',{class:'tile '+c,onclick:()=>{Z.sfx('click'); mode=k; play();}}, h('div',{class:'em'},e), h('div',{class:'t'},n), h('div',{class:'s'},d))));
    app.appendChild(t);
  };
  const play = () => {
    const fruit = mode==='4f'; const key = fruit ? 4 : +mode; const cfg = CFG[key]; const N = cfg.size || key;
    const {sol, puz} = Z.sudokuGen(N, cfg.br, cfg.bc, cfg.holes);
    const cur = puz.slice(); let sel = -1, mistakes = 0, t0 = Date.now(), won = false, hints = 0;
    app.innerHTML='';
    const info = h('div',{class:'gbar'}, h('span',{class:'ginfo',id:'sdt'},'⏱ 0:00'), h('span',{class:'ginfo',id:'sdm'},'❌ 0'), h('button',{class:'btn sm yel',onclick:hint},'💡 Yordam (10🪙)'), h('button',{class:'btn sm ghost',onclick:menu},'↩ Menyu'));
    const grid = h('div',{class:'sdk board-shadow',style:{gridTemplateColumns:`repeat(${N},1fr)`}});
    const pad = h('div',{class:'numpad'});
    app.appendChild(h('div',{class:'gwrap'}, info, grid, pad));
    Z.interval(()=>{ const e=document.getElementById('sdt'); if(e && !won) e.textContent='⏱ '+Z.fmtTime((Date.now()-t0)/1000); }, 1000);
    const lab = v => v ? (fruit ? FRUITS[v] : v) : '';
    function draw(){
      grid.innerHTML='';
      const sv = sel>=0 ? cur[sel] : 0;
      for (let i=0;i<N*N;i++){
        const r=Math.floor(i/N), c=i%N;
        const cls = ['c'];
        if (puz[i]) cls.push('giv'); else if (cur[i]) cls.push(cur[i]===sol[i]?'usr':'err');
        if (sel>=0){ const sr=Math.floor(sel/N), sc=sel%N; if (i===sel) cls.push('sel'); else if (sr===r||sc===c||(Math.floor(sr/cfg.br)===Math.floor(r/cfg.br)&&Math.floor(sc/cfg.bc)===Math.floor(c/cfg.bc))) cls.push('hl'); if (sv && cur[i]===sv && i!==sel) cls.push('same'); }
        const st = {};
        if (c%cfg.bc===cfg.bc-1 && c<N-1) st.marginRight='3px';
        if (r%cfg.br===cfg.br-1 && r<N-1) st.marginBottom='3px';
        grid.appendChild(h('div',{class:cls.join(' '),style:st,onclick:()=>{ sel=i; Z.sfx('click'); draw(); }}, lab(cur[i])));
      }
      pad.innerHTML='';
      for (let v=1;v<=N;v++){ const used = cur.filter((x,k)=>x===v && x===sol[k]).length===N; pad.appendChild(h('button',{class:used?'done':'',onclick:()=>put(v)}, lab(v))); }
      pad.appendChild(h('button',{onclick:()=>put(0),style:{width:'70px'}},'⌫'));
    }
    function put(v){
      if (sel<0 || puz[sel] || won) { if(sel<0) Z.toast('Avval katakni tanla 👆'); return; }
      cur[sel]=v;
      if (v && v!==sol[sel]){ mistakes++; Z.sfx('bad'); document.getElementById('sdm').textContent='❌ '+mistakes; } else if (v) Z.sfx('pop');
      draw(); check();
    }
    function hint(){
      if (won) return;
      const empty = [...Array(N*N).keys()].filter(i=>cur[i]!==sol[i]);
      if (!empty.length) return;
      if (!Z.spend(10)) return;
      const i = sel>=0 && cur[sel]!==sol[sel] ? sel : Z.pick(empty);
      cur[i]=sol[i]; sel=i; hints++; Z.sfx('pop'); draw(); check();
    }
    function check(){
      if (cur.every((v,i)=>v===sol[i])){
        won = true; const secs=(Date.now()-t0)/1000;
        const coins = Math.max(5, cfg.coins - mistakes*2 - hints*5);
        Z.gameWin('sudoku', coins, cfg.coins);
        setTimeout(()=>Z.winModal('Sudoku yechildi!', 'Vaqt: '+Z.fmtTime(secs)+' · Xatolar: '+mistakes, coins, play, '🧩'), 700);
      }
    }
    const onKey = e => { if (/^[1-9]$/.test(e.key) && +e.key<=N) put(+e.key); if (e.key==='Backspace'||e.key==='Delete') put(0);
      if (sel>=0 && e.key.startsWith('Arrow')){ const d={ArrowUp:-N,ArrowDown:N,ArrowLeft:-1,ArrowRight:1}[e.key]; const n=sel+d; if(n>=0&&n<N*N){sel=n;draw();} e.preventDefault(); } };
    document.addEventListener('keydown', onKey); cleanupFns.push(()=>document.removeEventListener('keydown', onKey));
    draw();
  };
  const cleanupFns = [];
  menu();
  return () => cleanupFns.forEach(f=>f());
}
Z.GAMES = Z.GAMES || [];
Z.GAMES.push({id:'sudoku', n:'Sudoku', e:'🔢', c:'c-pri', d:'4×4 dan 9×9 gacha', cat:'logic', hot:true, run});
})();

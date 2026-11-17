/* Konstruktor: bo'laklardan to'g'ri to'rtburchak yig'ish (polimino) */
(function(){
'use strict';
const h = Z.h, {ri, shuffle, pick} = Z;
const PCOL = ['#FF6B6B','#4D96FF','#FFB72B','#6BCB77','#B76BFF','#FF8FD8','#2ED3C6','#FF8A00','#8D6E63','#5C6BC0','#26A69A','#EC407A'];
const SIZES = [[4,3],[5,3],[5,4],[6,4],[6,5],[7,5],[8,5],[8,6]];

function partition(W, H){
  for (let attempt=0; attempt<50; attempt++){
    const id = Array(W*H).fill(-1); const regions = [];
    const nb = i => { const x=i%W, y=Math.floor(i/W), r=[]; if(x>0)r.push(i-1); if(x<W-1)r.push(i+1); if(y>0)r.push(i-W); if(y<H-1)r.push(i+W); return r; };
    let ok = true;
    while (id.includes(-1)){
      const free = [...id.keys()].filter(i=>id[i]<0);
      free.sort((a,b)=>nb(a).filter(j=>id[j]<0).length - nb(b).filter(j=>id[j]<0).length);
      const seed = free[0]; const target = ri(3,5); const reg=[seed]; id[seed]=regions.length;
      while (reg.length<target){ const fr = Z.uniq([].concat(...reg.map(nb))).filter(j=>id[j]<0); if(!fr.length) break; const c=pick(fr); id[c]=regions.length; reg.push(c); }
      if (reg.length<3){ // qo'shni bo'lakka qo'shamiz
        const adj = Z.uniq([].concat(...reg.map(nb))).filter(j=>id[j]>=0 && id[j]!==regions.length);
        if (!adj.length){ ok=false; break; }
        const t = id[pick(adj)]; reg.forEach(c=>{ id[c]=t; regions[t].push(c); });
      } else regions.push(reg);
    }
    if (!ok || regions.some(r=>r.length>6)) continue;
    return regions.map(r=>norm(r.map(i=>[i%W, Math.floor(i/W)])));
  }
  return null;
}
function norm(cells){ const mx=Math.min(...cells.map(c=>c[0])), my=Math.min(...cells.map(c=>c[1])); return cells.map(([x,y])=>[x-mx,y-my]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]); }
function rot(cells){ return norm(cells.map(([x,y])=>[-y,x])); }

function run(app){
  const G = Z.S.games.blocks || (Z.S.games.blocks = {wins:0, plays:0}); G.lv = G.lv || 1;
  const play = () => {
    const [W,H] = SIZES[Math.min(G.lv-1, SIZES.length-1)];
    const pieces = partition(W,H).map((c,i)=>{ let s=c; for(let k=ri(0,3);k>0;k--) s=rot(s); return {id:i, cells:s, col:PCOL[i%PCOL.length], at:null}; });
    let sel = null, won = false;
    app.innerHTML='';
    const cs = Math.min(46, Math.floor((Math.min(innerWidth,700)-60)/W));
    const grid = h('div',{class:'bgrid board-shadow',style:{gridTemplateColumns:`repeat(${W},${cs}px)`,gridAutoRows:cs+'px'}});
    const tray = h('div',{class:'tray'});
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},'🧱 '+G.lv+'-daraja · '+W+'×'+H), h('button',{class:'btn sm blu',onclick:rotateSel},'⟳ Aylantir'), h('button',{class:'btn sm ghost',onclick:play},'🔄')),
      grid, tray,
      h('div',{class:'howto'},'Pastdagi bo\'lakni tanla (yana bossang — aylanadi), so\'ng maydondagi katakni bos — bo\'lak o\'sha yerga qo\'yiladi. Qo\'yilgan bo\'lakni bossang, u qaytib chiqadi. Butun maydonni to\'ldir!')));
    function occ(){ const o = Array(W*H).fill(-1); pieces.forEach(p=>{ if(p.at) p.cells.forEach(([x,y])=>{ o[(p.at[1]+y)*W + p.at[0]+x] = p.id; }); }); return o; }
    function fits(p, ax, ay, o){ return p.cells.every(([x,y])=>{ const X=ax+x, Y=ay+y; return X>=0&&Y>=0&&X<W&&Y<H&&o[Y*W+X]<0; }); }
    function rotateSel(){ if (!sel){ Z.toast('Avval bo\'lakni tanla 👇'); return; } sel.cells = rot(sel.cells); Z.sfx('pop'); draw(); }
    function draw(preview){
      const o = occ(); grid.innerHTML='';
      for (let i=0;i<W*H;i++){
        const x=i%W, y=Math.floor(i/W); const pid=o[i];
        const c = h('div',{class:'bc',style:{background: pid>=0 ? pieces[pid].col : (preview&&preview.has(i)?'rgba(108,76,241,.35)':'')}});
        c.onclick = () => cellClick(x,y);
        c.onmouseenter = () => { if (sel && !won){ const anchor = anchorFor(sel, x, y); const pv=new Set(); if (fits(sel, anchor[0], anchor[1], occ())) sel.cells.forEach(([a,b])=>pv.add((anchor[1]+b)*W+anchor[0]+a)); draw(pv); } };
        grid.appendChild(c);
      }
      tray.innerHTML='';
      pieces.filter(p=>!p.at).forEach(p=>{
        const pw = Math.max(...p.cells.map(c=>c[0]))+1, ph = Math.max(...p.cells.map(c=>c[1]))+1; const s = Math.min(28, cs*0.65);
        const el = h('div',{class:'tpiece'+(sel===p?' sel':''),style:{gridTemplateColumns:`repeat(${pw},${s}px)`,gridAutoRows:s+'px'}});
        for (let y=0;y<ph;y++) for (let x=0;x<pw;x++){ const has = p.cells.some(c=>c[0]===x&&c[1]===y); el.appendChild(h('div',{class:'bc',style:{background:has?p.col:'transparent'}})); }
        el.onclick = () => { if (sel===p) rotateSel(); else { sel=p; Z.sfx('click'); draw(); } };
        tray.appendChild(el);
      });
    }
    // bosilgan katak bo'lakning birinchi (yuqori-chap) katagiga to'g'ri keladi
    function anchorFor(p, x, y){ const f = p.cells[0]; return [x-f[0], y-f[1]]; }
    function cellClick(x,y){
      if (won) return;
      const o = occ(); const pid = o[y*W+x];
      if (pid>=0){ pieces[pid].at=null; sel=pieces[pid]; Z.sfx('pop'); draw(); return; }
      if (!sel){ Z.toast('Avval pastdan bo\'lak tanla 👇'); return; }
      const [ax,ay] = anchorFor(sel, x, y);
      if (!fits(sel, ax, ay, o)){ Z.sfx('bad'); Z.toast('Bu yerga sig\'maydi — aylantirib ko\'r ⟳'); return; }
      sel.at=[ax,ay]; Z.sfx('move');
      sel = pieces.find(p=>!p.at) || null;
      draw();
      if (pieces.every(p=>p.at)){
        won = true; const coins = 10 + G.lv*4; G.lv++;
        Z.gameWin('blocks', coins, 20);
        setTimeout(()=>Z.winModal('Konstruktor yig\'ildi!', 'Keyingi daraja: '+G.lv, coins, play, '🧱'), 600);
      }
    }
    sel = pieces[0]; draw();
  };
  play();
}
Z.GAMES.push({id:'blocks', n:'Konstruktor', e:'🧱', c:'c-brn', d:'Bo\'laklardan maydonni to\'ldir', cat:'logic', hot:false, run});
})();

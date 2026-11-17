/* Shashka (rus qoidalari) — kompyuterga qarshi */
(function(){
'use strict';
const h = Z.h;
// w = oq oddiy, W = oq damka, b = qora oddiy, B = qora damka
const side = p => p ? p.toLowerCase() : null;
const isK = p => p==='W' || p==='B';
const DIRS = [[-1,-1],[-1,1],[1,-1],[1,1]];
const inb = (r,c) => r>=0&&r<8&&c>=0&&c<8;

function initial(){ const b=Array(64).fill(''); for (let r=0;r<8;r++) for (let c=0;c<8;c++) if ((r+c)%2){ if (r<3) b[r*8+c]='b'; if (r>4) b[r*8+c]='w'; } return b; }
function captures(b, sq, p, taken){
  // qaytaradi: [{path:[...], caps:[...], kingAt}]
  const res = []; const r=sq>>3, c=sq&7; const me=side(p); const king=isK(p);
  for (const [dr,dc] of DIRS){
    if (king){
      let rr=r+dr, cc=c+dc;
      while (inb(rr,cc) && !b[rr*8+cc]) { rr+=dr; cc+=dc; }
      if (!inb(rr,cc)) continue; const mid=rr*8+cc; if (side(b[mid])===me || taken.includes(mid)) continue;
      let lr=rr+dr, lc=cc+dc; const lands=[];
      while (inb(lr,lc) && !b[lr*8+lc]) { lands.push(lr*8+lc); lr+=dr; lc+=dc; }
      for (const land of lands){
        const nb=b.slice(); nb[land]=p; nb[sq]='';
        const more = captures(nb, land, p, taken.concat(mid));
        if (more.length) more.forEach(m=>res.push({path:[land].concat(m.path), caps:[mid].concat(m.caps), king:true}));
        else res.push({path:[land], caps:[mid], king:true});
      }
    } else {
      const mr=r+dr, mc=c+dc, lr=r+2*dr, lc=c+2*dc;
      if (!inb(lr,lc)) continue; const mid=mr*8+mc, land=lr*8+lc;
      if (!b[mid] || side(b[mid])===me || taken.includes(mid) || b[land]) continue;
      const promote = (me==='w' && lr===0) || (me==='b' && lr===7);
      const np = promote ? p.toUpperCase() : p;
      const nb=b.slice(); nb[land]=np; nb[sq]='';
      const more = captures(nb, land, np, taken.concat(mid));
      if (more.length) more.forEach(m=>res.push({path:[land].concat(m.path), caps:[mid].concat(m.caps), king:promote||m.king}));
      else res.push({path:[land], caps:[mid], king:promote});
    }
  }
  return res;
}
function moves(b, turn){
  const caps = [], quiet = [];
  for (let sq=0;sq<64;sq++){ const p=b[sq]; if (side(p)!==turn) continue;
    captures(b, sq, p, []).forEach(m=>caps.push(Object.assign({f:sq}, m)));
    if (caps.length) continue;
    const r=sq>>3, c=sq&7;
    for (const [dr,dc] of DIRS){
      if (!isK(p) && dr !== (turn==='w'?-1:1)) continue;
      let rr=r+dr, cc=c+dc;
      while (inb(rr,cc) && !b[rr*8+cc]){ const t=rr*8+cc; quiet.push({f:sq, path:[t], caps:[], king: !isK(p) && ((turn==='w'&&rr===0)||(turn==='b'&&rr===7))}); if (!isK(p)) break; rr+=dr; cc+=dc; }
    }
  }
  return caps.length ? caps : quiet;
}
function apply(b, m){ const nb=b.slice(); const p=nb[m.f]; nb[m.f]=''; m.caps.forEach(x=>nb[x]=''); const t=m.path[m.path.length-1]; nb[t] = m.king ? p.toUpperCase() : p; return nb; }
function evaluate(b){ let v=0; for (let sq=0;sq<64;sq++){ const p=b[sq]; if(!p) continue; const r=sq>>3; let x = isK(p)?320:100; if (!isK(p)) x += (side(p)==='w' ? (7-r) : r)*4; const cc=sq&7; x += (cc>1&&cc<6)?3:0; v += side(p)==='w'?x:-x; } return v; }
function search(b, turn, d, a, be){
  const ms = moves(b, turn); if (!ms.length) return -100000-d;
  if (d===0) return (turn==='w'?1:-1)*evaluate(b);
  for (const m of ms){ const v = -search(apply(b,m), turn==='w'?'b':'w', d-1, -be, -a); if (v>=be) return be; if (v>a) a=v; }
  return a;
}
function best(b, turn, d, noise){ let bm=null, bv=-Infinity; for (const m of Z.shuffle(moves(b,turn))){ const v=-search(apply(b,m), turn==='w'?'b':'w', d-1, -Infinity, Infinity) + Math.random()*noise; if (v>bv){bv=v;bm=m;} } return bm; }

function run(app){
  const LV = [{n:'Oson',d:1,noise:120,c:25,e:'🐣'},{n:'O\'rta',d:3,noise:15,c:50,e:'🦊'},{n:'Qiyin',d:5,noise:0,c:100,e:'🦁'}];
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Shashka: donalar faqat qora kataklarda qiyshiq yuradi. Urish majburiy! Oxirgi qatorga yetgan dona "damka" bo\'ladi va uzoqqa yura oladi. 👑'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    LV.forEach((l,i)=>t.appendChild(h('button',{class:'tile '+['c-grn','c-org','c-red'][i],onclick:()=>{Z.sfx('click');play(l);}}, h('div',{class:'em'},l.e), h('div',{class:'t'},l.n), h('div',{class:'s'},'G\'alaba: '+l.c+'🪙'))));
    app.appendChild(t);
  };
  const play = L => {
    let b = initial(), turn='w', sel=-1, partial=[], over=false, last=null, hist=[];
    app.innerHTML='';
    const board = h('div',{class:'cb'}); const status = h('span',{class:'ginfo'},'Sening yurishing (oq)');
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},L.e+' '+L.n), status), board,
      h('div',{class:'gbar'},
        h('button',{class:'btn sm blu',onclick:()=>{ if (over||turn!=='w'||!hist.length) return; b=hist.pop(); sel=-1; partial=[]; last=null; draw(); }},'↶ Qaytarish'),
        h('button',{class:'btn sm ghost',onclick:()=>play(L)},'🔄'), h('button',{class:'btn sm ghost',onclick:menu},'↩'))));
    function avail(){ return moves(b,'w'); }
    function draw(){
      board.innerHTML='';
      const ms = avail(); const mustCap = ms.length && ms[0].caps.length;
      const cand = sel>=0 ? ms.filter(m=>m.f===sel && partial.every((x,i)=>m.path[i]===x)) : [];
      const nextSq = new Set(cand.map(m=>m.path[partial.length]).filter(x=>x!=null));
      const curPos = partial.length ? partial[partial.length-1] : sel;
      for (let sq=0;sq<64;sq++){
        const r=sq>>3, c=sq&7; const p=b[sq];
        const cls=['sq',(r+c)%2?'d':'l']; if (sq===curPos) cls.push('sel'); if (nextSq.has(sq)) cls.push('dot'); if (last && (last.f===sq || last.path.includes(sq))) cls.push('last');
        let shown = p; if (partial.length && sq===sel) shown=''; if (partial.length && sq===curPos) shown=b[sel];
        const capturedSoFar = cand.length ? cand[0].caps.slice(0, partial.length) : [];
        const el = h('div',{class:cls.join(' '),onclick:()=>click(sq)});
        if (shown && !capturedSoFar.includes(sq)){ const must = mustCap && turn==='w' && side(shown)==='w' && ms.some(m=>m.f===sq) && sel<0; el.appendChild(h('div',{class:'ck '+side(shown)+(must?' must':'')}, isK(shown)?'👑':'')); }
        else if (shown) el.appendChild(h('div',{class:'ck '+side(shown),style:{opacity:.35}}, isK(shown)?'👑':''));
        board.appendChild(el);
      }
    }
    function click(sq){
      if (over || turn!=='w') return;
      const ms = avail();
      if (partial.length===0 && side(b[sq])==='w'){
        if (!ms.some(m=>m.f===sq)){ Z.sfx('bad'); if (ms[0] && ms[0].caps.length) Z.toast('Urish majburiy! Sariq doiradagi donani tanla'); sel=-1; draw(); return; }
        sel=sq; Z.sfx('click'); draw(); return;
      }
      if (sel<0) return;
      const cand = ms.filter(m=>m.f===sel && partial.every((x,i)=>m.path[i]===x) && m.path[partial.length]===sq);
      if (!cand.length){ return; }
      partial.push(sq); Z.sfx('move');
      const done = cand.filter(m=>m.path.length===partial.length);
      if (done.length){ const m=done[0]; hist.push(b); b=apply(b,m); last=m; sel=-1; partial=[]; draw(); if (!end('b')) ai(); return; }
      draw();
    }
    function ai(){
      turn='b'; status.textContent='🤔 Kompyuter o\'ylayapti...';
      setTimeout(()=>{ const m = best(b,'b',L.d,L.noise); b=apply(b,m); last=m; turn='w'; Z.sfx(m.caps.length?'pop':'move'); draw(); if (!end('w')) status.textContent = avail()[0] && avail()[0].caps.length ? '⚔️ Urishing kerak!' : 'Sening yurishing (oq)'; }, 300);
    }
    function end(next){
      if (moves(b,next).length) return false;
      over = true;
      if (next==='b'){ status.textContent='🏆 Sen yutding!'; Z.gameWin('checkers', L.c, 60); setTimeout(()=>Z.winModal('Sen yutding!', L.n+' darajadagi kompyuterni yengding!', L.c, ()=>play(L), '👑'), 600); }
      else { status.textContent='Kompyuter yutdi'; Z.sfx('lose'); Z.modal([h('div',{style:{fontSize:'64px'}},'🤖'),h('h2',null,'Kompyuter yutdi'),h('p',null,'Qayta urinib ko\'r — sen albatta uddalaysan!')],[{t:'Qayta',cls:'grn',fn:()=>play(L)},{t:'Menyu',cls:'ghost',fn:menu}]); }
      return true;
    }
    draw();
  };
  menu();
}
Z.GAMES.push({id:'checkers', n:'Shashka', e:'⛀', c:'c-red', d:'Kompyuterga qarshi', cat:'strategy', hot:false, run});
})();

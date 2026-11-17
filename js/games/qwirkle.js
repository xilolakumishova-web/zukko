/* Qwirkle — rang va shakl bo'yicha qatorlar tuzish */
(function(){
'use strict';
const h = Z.h;
const COLS = ['#FF4D4D','#FF9F1C','#FFD93D','#2ECC71','#3FA7FF','#B66DFF'];
const CNAME = ['qizil','to\'q sariq','sariq','yashil','ko\'k','binafsha'];
const SHAPES = [
  c=>`<circle cx="12" cy="12" r="8" fill="${c}"/>`,
  c=>`<rect x="4.5" y="4.5" width="15" height="15" rx="1.5" fill="${c}"/>`,
  c=>`<polygon points="12,2.5 21.5,12 12,21.5 2.5,12" fill="${c}"/>`,
  c=>`<polygon points="12,2 14.6,9.4 22,12 14.6,14.6 12,22 9.4,14.6 2,12 9.4,9.4" fill="${c}"/>`,
  c=>`<g fill="${c}"><circle cx="12" cy="7" r="4.6"/><circle cx="7" cy="12" r="4.6"/><circle cx="17" cy="12" r="4.6"/><circle cx="12" cy="17" r="4.6"/><circle cx="12" cy="12" r="3"/></g>`,
  c=>`<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="${c}"/>`
];
const tileSvg = t => `<svg viewBox="0 0 24 24" width="80%" height="80%">${SHAPES[t.s](COLS[t.c])}</svg>`;

function bagNew(){ const b=[]; for(let k=0;k<3;k++) for(let c=0;c<6;c++) for(let s=0;s<6;s++) b.push({c,s}); return Z.shuffle(b); }
const K = (x,y)=>x+','+y;

/* joylashtirishni tekshirish va ochkoni hisoblash; -1 = noto'g'ri */
function score(board, placed){
  if (!placed.length) return -1;
  const tmp = new Map(board); for (const p of placed){ if (tmp.has(K(p.x,p.y))) return -1; tmp.set(K(p.x,p.y), p.t); }
  const sameRow = placed.every(p=>p.y===placed[0].y), sameCol = placed.every(p=>p.x===placed[0].x);
  if (!sameRow && !sameCol) return -1;
  const lineAt = (x,y,dx,dy) => { let sx=x, sy=y; while (tmp.has(K(sx-dx,sy-dy))){ sx-=dx; sy-=dy; } const L=[]; while (tmp.has(K(sx,sy))){ L.push({x:sx,y:sy,t:tmp.get(K(sx,sy))}); sx+=dx; sy+=dy; } return L; };
  const valid = L => { if (L.length>6) return false; if (L.length<2) return true; const cs=new Set(L.map(z=>z.t.c)), ss=new Set(L.map(z=>z.t.s)); return (cs.size===1 && ss.size===L.length) || (ss.size===1 && cs.size===L.length); };
  // asosiy yo'nalish
  let dx=1, dy=0; if (placed.length>1 && sameCol){ dx=0; dy=1; }
  const main = lineAt(placed[0].x, placed[0].y, dx, dy);
  if (placed.length>1 && !placed.every(p=>main.some(m=>m.x===p.x&&m.y===p.y))) return -1; // bo'shliq bor
  let total = 0, touched = board.size===0;
  const lines = [main];
  for (const p of placed) lines.push(lineAt(p.x, p.y, dy, dx));
  if (placed.length===1) lines[1] = lineAt(placed[0].x, placed[0].y, 0, 1);
  for (const L of lines){ if (!valid(L)) return -1; if (L.length>1){ total += L.length + (L.length===6?6:0); if (L.some(z=>board.has(K(z.x,z.y)))) touched=true; } }
  if (!touched) return -1;
  if (total===0) total = 1;
  return total;
}
function frontier(board){ if (!board.size) return [[0,0]]; const s=new Set(), out=[]; for (const k of board.keys()){ const [x,y]=k.split(',').map(Number); for (const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ const kk=K(x+a,y+b); if(!board.has(kk) && !s.has(kk)){ s.add(kk); out.push([x+a,y+b]); } } } return out; }
function aiMove(board, hand){
  let best = {sc:-1, pl:[]};
  const tryExtend = (placed, used) => {
    const sc = score(board, placed); if (sc<0) return;
    if (sc>best.sc) best = {sc, pl:placed.slice()};
    if (placed.length>=hand.length) return;
    const dirs = placed.length===1 ? [[1,0],[0,1]] : [placed[0].y===placed[1].y?[1,0]:[0,1]];
    for (const [dx,dy] of dirs){
      const tmp = new Map(board); placed.forEach(p=>tmp.set(K(p.x,p.y),p.t));
      // chiziq uchlari
      let sx=placed[0].x, sy=placed[0].y; while (tmp.has(K(sx-dx,sy-dy))){sx-=dx;sy-=dy;}
      let ex=placed[0].x, ey=placed[0].y; while (tmp.has(K(ex+dx,ey+dy))){ex+=dx;ey+=dy;}
      for (const [cx,cy] of [[sx-dx,sy-dy],[ex+dx,ey+dy]]) for (let i=0;i<hand.length;i++){ if (used.has(i)) continue; const np=placed.concat({x:cx,y:cy,t:hand[i],i}); const nu=new Set(used); nu.add(i); tryExtend(np, nu); }
    }
  };
  for (const [x,y] of frontier(board)) for (let i=0;i<hand.length;i++) tryExtend([{x,y,t:hand[i],i}], new Set([i]));
  return best;
}

function run(app){
  const play = () => {
    const bag = bagNew(); const board = new Map(); const hand = bag.splice(0,6), ai = bag.splice(0,6);
    let pend = [], sel = -1, sc = {me:0, ai:0}, xmode = false, xsel = new Set(), over = false, passes = 0, lastAi = [];
    app.innerHTML='';
    const top = h('div',{class:'gbar'}); const wrap = h('div',{class:'qwb'}); const handEl = h('div',{class:'hand'}); const btns = h('div',{class:'gbar'});
    app.appendChild(h('div',{class:'gwrap'}, top, wrap, handEl, btns, h('div',{class:'howto'},'Bir qatorga (gorizontal yoki vertikal) bir xil RANGDAGI turli shakllarni yoki bir xil SHAKLDAGI turli ranglarni qo\'y. Qatorda 6 tadan oshmasin. 6 tasini to\'ldirsang — QWIRKLE! (+6 ochko)')));
    function draw(){
      top.innerHTML='';
      top.append(h('span',{class:'ginfo'},'🧒 Sen: '+sc.me), h('span',{class:'ginfo'},'🤖 Kompyuter: '+sc.ai), h('span',{class:'ginfo'},'👜 Xaltada: '+bag.length));
      const all = new Map(board); pend.forEach(p=>all.set(K(p.x,p.y),p.t));
      let xs=[0], ys=[0]; for (const k of all.keys()){ const [x,y]=k.split(',').map(Number); xs.push(x); ys.push(y); }
      const x0=Math.min(...xs)-1, x1=Math.max(...xs)+1, y0=Math.min(...ys)-1, y1=Math.max(...ys)+1;
      const g = h('div',{class:'qwg',style:{gridTemplateColumns:`repeat(${x1-x0+1},42px)`}});
      const fr = new Set(frontier(all).map(([x,y])=>K(x,y)));
      for (let y=y0;y<=y1;y++) for (let x=x0;x<=x1;x++){
        const k=K(x,y); const t=all.get(k);
        if (t){ const isNew = pend.find(p=>p.x===x&&p.y===y); const isAi = lastAi.some(p=>p.x===x&&p.y===y);
          g.appendChild(h('div',{class:'qc'}, h('div',{class:'qt'+(isNew?' new':''),style:isAi?{outline:'3px solid #3FA7FF'}:null,html:tileSvg(t),onclick:()=>{ if(isNew){ pend=pend.filter(p=>p!==isNew); Z.sfx('pop'); draw(); } }}))); }
        else g.appendChild(h('div',{class:'qc'+(sel>=0 && fr.has(k)?' can':''),onclick:()=>place(x,y)}));
      }
      wrap.innerHTML=''; wrap.appendChild(g);
      handEl.innerHTML='';
      hand.forEach((t,i)=>{ if (pend.some(p=>p.i===i)) return; handEl.appendChild(h('div',{class:'qt'+(sel===i?' sel':'')+(xsel.has(i)?' xsel':''),html:tileSvg(t),title:CNAME[t.c],onclick:()=>{ if (over) return; if (xmode){ xsel.has(i)?xsel.delete(i):xsel.add(i); } else sel = sel===i?-1:i; Z.sfx('click'); draw(); }})); });
      btns.innerHTML='';
      if (over){ btns.append(h('button',{class:'btn grn',onclick:play},'🔄 Yangi o\'yin')); return; }
      if (xmode) btns.append(h('button',{class:'btn sm org',onclick:doExchange},'🔁 Tanlanganlarni almashtirish ('+xsel.size+')'), h('button',{class:'btn sm ghost',onclick:()=>{xmode=false;xsel.clear();draw();}},'Bekor'));
      else btns.append(h('button',{class:'btn sm grn',disabled:!pend.length,onclick:confirm},'✅ Tasdiqlash'+(pend.length?' (+'+Math.max(0,score(board,pend))+')':'')), h('button',{class:'btn sm blu',disabled:!pend.length,onclick:()=>{pend=[];draw();}},'↶ Qaytarish'), h('button',{class:'btn sm ghost',disabled:!!pend.length||!bag.length,onclick:()=>{xmode=true;sel=-1;draw();}},'🔁 Almashtirish'), h('button',{class:'btn sm yel',onclick:hint},'💡 (5🪙)'));
      setTimeout(()=>{ const n = wrap.querySelector('.new') || wrap.querySelector('.qt'); if (n && !wrap.dataset.c){ n.scrollIntoView({block:'center',inline:'center'}); wrap.dataset.c=1; window.scrollTo(0,0); } }, 30);
    }
    function place(x,y){ if (sel<0 || over) return; pend.push({x,y,t:hand[sel],i:sel}); const nx = hand.findIndex((_,i)=>!pend.some(p=>p.i===i)); sel=-1; Z.sfx('move'); draw(); }
    function confirm(){
      const s = score(board, pend);
      if (s<0){ Z.sfx('bad'); Z.toast('Bunday qo\'yish mumkin emas: bitta qatorda bir xil rang (turli shakl) yoki bir xil shakl (turli rang) bo\'lsin'); return; }
      pend.forEach(p=>board.set(K(p.x,p.y),p.t));
      const idx = pend.map(p=>p.i).sort((a,b)=>b-a); idx.forEach(i=>hand.splice(i,1));
      sc.me += s; Z.sfx(s>=12?'win':'ok'); if (s>=12) Z.confetti(80); pend=[]; passes=0;
      while (hand.length<6 && bag.length) hand.push(bag.pop());
      if (!hand.length){ sc.me += 6; return finish(); }
      draw(); setTimeout(aiTurn, 500);
    }
    function doExchange(){ if (!xsel.size){ Z.toast('Almashtiriladigan toshlarni tanla'); return; } if (bag.length<xsel.size){ Z.toast('Xaltada yetarli tosh yo\'q'); return; }
      [...xsel].sort((a,b)=>b-a).forEach(i=>{ bag.push(hand.splice(i,1)[0]); }); Z.shuffle(bag).forEach((t,i)=>bag[i]=t); while(hand.length<6 && bag.length) hand.push(bag.shift());
      xmode=false; xsel.clear(); passes=0; draw(); setTimeout(aiTurn, 500); }
    function hint(){ if (pend.length){ pend=[]; } const m = aiMove(board, hand); if (m.sc<0){ Z.toast('Yurish yo\'q — almashtir 🔁'); return; } if (!Z.spend(5)) return; pend = m.pl.map(p=>({x:p.x,y:p.y,t:p.t,i:p.i})); draw(); }
    function aiTurn(){
      const m = aiMove(board, ai);
      if (m.sc<0){ // almashtirish yoki o'tkazish
        if (bag.length>=3){ ai.splice(0,3).forEach(t=>bag.push(t)); Z.shuffle(bag); while(ai.length<6&&bag.length) ai.push(bag.shift()); Z.toast('🤖 Kompyuter toshlarini almashtirdi'); }
        else { passes++; Z.toast('🤖 Kompyuter yurish qilolmadi'); }
        lastAi=[];
        if (passes>=2 || !playerCanMove()) return finish();
        return draw();
      }
      m.pl.forEach(p=>board.set(K(p.x,p.y),p.t)); m.pl.map(p=>p.i).sort((a,b)=>b-a).forEach(i=>ai.splice(i,1));
      sc.ai += m.sc; lastAi = m.pl; Z.sfx('move');
      while (ai.length<6 && bag.length) ai.push(bag.pop());
      if (!ai.length){ sc.ai += 6; return finish(); }
      if (!playerCanMove() && !bag.length) return finish();
      draw();
    }
    function playerCanMove(){ return aiMove(board, hand).sc>=0 || bag.length>0; }
    function finish(){
      over = true; draw();
      if (sc.me > sc.ai){ const coins = 40 + Math.floor(sc.me/10); Z.gameWin('qwirkle', coins, 60); setTimeout(()=>Z.winModal('Sen yutding! '+sc.me+' : '+sc.ai, null, coins, play, '🏆'), 500); }
      else { Z.sfx('lose'); Z.modal([h('div',{style:{fontSize:'60px'}},sc.me===sc.ai?'🤝':'🤖'), h('h2',null, sc.me===sc.ai?'Durang!':'Kompyuter yutdi'), h('p',null, sc.me+' : '+sc.ai)],[{t:'Yana',cls:'grn',fn:play},{t:'Chiqish',cls:'ghost',fn:()=>Z.nav.back()}]); }
    }
    draw();
  };
  play();
}
Z.GAMES.push({id:'qwirkle', n:'Qwirkle', e:'🔶', c:'c-yel', d:'Rang va shakl strategiyasi', cat:'strategy', hot:false, run});
})();

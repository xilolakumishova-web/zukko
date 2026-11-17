/* Shaxmat — kompyuterga qarshi */
(function(){
'use strict';
const h = Z.h;
const GLYPH = {k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
const VAL = {p:100,n:300,b:320,r:500,q:900,k:0};
const isW = p => p && p === p.toUpperCase();
const col = p => p ? (isW(p)?'w':'b') : null;
const N8 = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const K8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const DIAG = [[-1,-1],[-1,1],[1,-1],[1,1]], ORTH = [[-1,0],[1,0],[0,-1],[0,1]];

function initial(){
  const b = Array(64).fill('');
  const back = 'rnbqkbnr';
  for (let c=0;c<8;c++){ b[c]=back[c]; b[8+c]='p'; b[48+c]='P'; b[56+c]=back[c].toUpperCase(); }
  return {b, turn:'w', cs:{K:1,Q:1,k:1,q:1}, ep:-1};
}
function attacked(b, sq, by){ // by: 'w' | 'b'
  const r=sq>>3, c=sq&7;
  const pawnDir = by==='w' ? 1 : -1; // oq piyoda pastdan hujum qiladi
  for (const dc of [-1,1]){ const rr=r+pawnDir, cc=c+dc; if (rr>=0&&rr<8&&cc>=0&&cc<8){ const p=b[rr*8+cc]; if (p && col(p)===by && p.toLowerCase()==='p') return true; } }
  for (const [dr,dc] of N8){ const rr=r+dr, cc=c+dc; if (rr>=0&&rr<8&&cc>=0&&cc<8){ const p=b[rr*8+cc]; if (p && col(p)===by && p.toLowerCase()==='n') return true; } }
  for (const [dr,dc] of K8){ const rr=r+dr, cc=c+dc; if (rr>=0&&rr<8&&cc>=0&&cc<8){ const p=b[rr*8+cc]; if (p && col(p)===by && p.toLowerCase()==='k') return true; } }
  for (const [dirs, types] of [[DIAG,'bq'],[ORTH,'rq']]) for (const [dr,dc] of dirs){ let rr=r+dr, cc=c+dc; while (rr>=0&&rr<8&&cc>=0&&cc<8){ const p=b[rr*8+cc]; if (p){ if (col(p)===by && types.includes(p.toLowerCase())) return true; break; } rr+=dr; cc+=dc; } }
  return false;
}
function kingSq(b, side){ const k = side==='w'?'K':'k'; return b.indexOf(k); }
function inCheck(s, side){ return attacked(s.b, kingSq(s.b, side), side==='w'?'b':'w'); }
function pseudo(s){
  const {b, turn} = s; const mv = [];
  for (let sq=0; sq<64; sq++){
    const p = b[sq]; if (!p || col(p)!==turn) continue;
    const t = p.toLowerCase(), r = sq>>3, c = sq&7;
    const add = (to, extra) => mv.push(Object.assign({f:sq, t:to, p, x:b[to]}, extra||{}));
    if (t==='p'){
      const d = turn==='w' ? -1 : 1, start = turn==='w' ? 6 : 1, last = turn==='w' ? 0 : 7;
      const one = sq + d*8;
      if (one>=0 && one<64 && !b[one]){ add(one, (one>>3)===last?{promo:1}:null); if (r===start && !b[one+d*8]) add(one+d*8, {dbl:1}); }
      for (const dc of [-1,1]){ const cc=c+dc; if (cc<0||cc>7) continue; const to = (r+d)*8+cc; if (to<0||to>63) continue;
        if (b[to] && col(b[to])!==turn) add(to, (to>>3)===last?{promo:1}:null);
        else if (to===s.ep) add(to, {epc: r*8+cc}); }
    } else if (t==='n' || t==='k'){
      for (const [dr,dc] of (t==='n'?N8:K8)){ const rr=r+dr, cc=c+dc; if (rr<0||rr>7||cc<0||cc>7) continue; const to=rr*8+cc; if (!b[to] || col(b[to])!==turn) add(to); }
      if (t==='k'){
        const opp = turn==='w'?'b':'w', row = turn==='w'?56:0;
        if (sq===row+4 && !attacked(b, sq, opp)){
          if (s.cs[turn==='w'?'K':'k'] && !b[row+5] && !b[row+6] && b[row+7]===(turn==='w'?'R':'r') && !attacked(b,row+5,opp) && !attacked(b,row+6,opp)) add(row+6, {castle:'K'});
          if (s.cs[turn==='w'?'Q':'q'] && !b[row+3] && !b[row+2] && !b[row+1] && b[row]===(turn==='w'?'R':'r') && !attacked(b,row+3,opp) && !attacked(b,row+2,opp)) add(row+2, {castle:'Q'});
        }
      }
    } else {
      const dirs = t==='b'?DIAG : t==='r'?ORTH : DIAG.concat(ORTH);
      for (const [dr,dc] of dirs){ let rr=r+dr, cc=c+dc; while (rr>=0&&rr<8&&cc>=0&&cc<8){ const to=rr*8+cc; if (b[to]){ if (col(b[to])!==turn) add(to); break; } add(to); rr+=dr; cc+=dc; } }
    }
  }
  return mv;
}
function make(s, m){
  const b = s.b.slice(); const cs = Object.assign({}, s.cs);
  b[m.t] = m.promo ? (s.turn==='w'?'Q':'q') : m.p; b[m.f] = '';
  if (m.epc!=null) b[m.epc] = '';
  if (m.castle){ const row = s.turn==='w'?56:0; if (m.castle==='K'){ b[row+5]=b[row+7]; b[row+7]=''; } else { b[row+3]=b[row]; b[row]=''; } }
  if (m.p==='K'){ cs.K=0; cs.Q=0; } if (m.p==='k'){ cs.k=0; cs.q=0; }
  if (m.f===63||m.t===63) cs.K=0; if (m.f===56||m.t===56) cs.Q=0; if (m.f===7||m.t===7) cs.k=0; if (m.f===0||m.t===0) cs.q=0;
  return {b, turn: s.turn==='w'?'b':'w', cs, ep: m.dbl ? (m.f+m.t)/2 : -1};
}
function legal(s){ return pseudo(s).filter(m=>{ const n = make(s,m); return !inCheck(n, s.turn); }); }
const CENTER = sq => { const r=sq>>3, c=sq&7; return 3.5-Math.max(Math.abs(r-3.5), Math.abs(c-3.5)); };
function evaluate(s){ // oq nuqtai nazaridan
  let v = 0;
  for (let sq=0;sq<64;sq++){ const p=s.b[sq]; if(!p) continue; const t=p.toLowerCase(); let x = VAL[t];
    if (t==='n'||t==='b') x += CENTER(sq)*10;
    if (t==='p') x += (isW(p) ? (6-(sq>>3)) : ((sq>>3)-1))*6 + CENTER(sq)*3;
    if (t==='q') x += CENTER(sq)*3;
    v += isW(p) ? x : -x; }
  return v;
}
function search(s, depth, alpha, beta){
  const moves = legal(s);
  if (!moves.length) return inCheck(s, s.turn) ? -100000 - depth : 0;
  if (depth===0) return (s.turn==='w'?1:-1) * evaluate(s);
  moves.sort((a,b)=>(b.x?VAL[b.x.toLowerCase()]:0)-(a.x?VAL[a.x.toLowerCase()]:0));
  for (const m of moves){ const v = -search(make(s,m), depth-1, -beta, -alpha); if (v>=beta) return beta; if (v>alpha) alpha=v; }
  return alpha;
}
function best(s, depth, noise){
  const moves = Z.shuffle(legal(s)); let bm = null, bv = -Infinity;
  moves.sort((a,b)=>(b.x?VAL[b.x.toLowerCase()]:0)-(a.x?VAL[a.x.toLowerCase()]:0));
  for (const m of moves){ const v = -search(make(s,m), depth-1, -Infinity, -bv+1) + (noise? Math.random()*noise : 0); if (v>bv){ bv=v; bm=m; } }
  return bm;
}
Z.chessEngine = {initial, legal, make, inCheck, best};

function run(app){
  const G = Z.S.games.chess || (Z.S.games.chess = {wins:0, plays:0});
  const LV = [{n:'Oson',d:1,noise:250,c:30,e:'🐣'},{n:'O\'rta',d:2,noise:40,c:60,e:'🦊'},{n:'Qiyin',d:3,noise:0,c:120,e:'🦁'}];
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Shaxmat — aqlning eng zo\'r mashqi! Sen oq donalar bilan o\'ynaysan. Kompyuter darajasini tanla ♟️'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    LV.forEach((l,i)=>t.appendChild(h('button',{class:'tile '+['c-grn','c-org','c-red'][i],onclick:()=>{Z.sfx('click');play(l);}}, h('div',{class:'em'},l.e), h('div',{class:'t'},l.n), h('div',{class:'s'},'G\'alaba: '+l.c+'🪙'))));
    app.appendChild(t);
    app.appendChild(h('div',{class:'card',style:{marginTop:'14px'}}, h('b',null,'📘 Donalar qanday yuradi?'), h('div',{class:'small',style:{marginTop:'6px',lineHeight:1.6}},
      '♚ Shoh — har tomonga 1 katak. ♛ Farzin — to\'g\'ri va qiyshiq, istalgancha. ♜ Ruh (to\'ra) — to\'g\'ri chiziq bo\'ylab. ♝ Fil — qiyshiq (diagonal). ♞ Ot — "G" harfi shaklida, boshqa donalar ustidan sakraydi. ♟ Piyoda — oldinga 1 katak (birinchi yurishda 2), qiyshiq uradi. Raqib shohiga "mot" qilsang — yutasan!')));
  };
  const play = L => {
    let s = initial(), sel = -1, moves = [], last = null, hist = [], over = false, thinking = false;
    app.innerHTML='';
    const board = h('div',{class:'cb'});
    const status = h('span',{class:'ginfo'},'Sening yurishing (oq)');
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'}, L.e+' '+L.n), status),
      board,
      h('div',{class:'gbar'},
        h('button',{class:'btn sm blu',onclick:()=>{ if (thinking||over||hist.length<2) return; hist.pop(); s=hist.pop(); last=null; sel=-1; moves=[]; draw(); }},'↶ Qaytarish'),
        h('button',{class:'btn sm yel',onclick:hint},'💡 Maslahat (5🪙)'),
        h('button',{class:'btn sm ghost',onclick:()=>Z.modal([h('h2',null,'Taslim bo\'lasanmi?')],[{t:'Ha',cls:'red',fn:()=>{over=true;Z.sfx('lose');menu();}},{t:'Yo\'q',cls:'ghost'}])},'🏳️'),
        h('button',{class:'btn sm ghost',onclick:menu},'↩'))));
    function draw(hintMove){
      board.innerHTML='';
      const chk = inCheck(s, s.turn) ? kingSq(s.b, s.turn) : -1;
      for (let sq=0; sq<64; sq++){
        const r=sq>>3, c=sq&7; const p=s.b[sq];
        const cls = ['sq', (r+c)%2 ? 'd':'l'];
        if (sq===sel) cls.push('sel');
        if (last && (sq===last.f||sq===last.t)) cls.push('last');
        if (hintMove && (sq===hintMove.f||sq===hintMove.t)) cls.push('sel');
        if (sq===chk) cls.push('chk');
        const mv = moves.find(m=>m.t===sq); if (mv) cls.push(mv.x||mv.epc!=null ? 'cap':'dot');
        const el = h('div',{class:cls.join(' '),onclick:()=>click(sq)}, p ? h('span',{class:isW(p)?'pc-w':'pc-b'}, GLYPH[p.toLowerCase()]) : '');
        if (c===0) el.appendChild(h('span',{class:'coord'}, 8-r));
        board.appendChild(el);
      }
    }
    function click(sq){
      if (over || thinking || s.turn!=='w') return;
      const mv = moves.find(m=>m.t===sq);
      if (mv){ doMove(mv); return; }
      if (s.b[sq] && isW(s.b[sq])){ sel=sq; moves=legal(s).filter(m=>m.f===sq); Z.sfx('click'); }
      else { sel=-1; moves=[]; }
      draw();
    }
    function doMove(m){
      hist.push(s); s = make(s, m); last = m; sel=-1; moves=[]; Z.sfx(m.x?'pop':'move'); draw();
      if (end()) return;
      thinking = true; status.textContent = '🤔 Kompyuter o\'ylayapti...';
      setTimeout(()=>{
        const bm = best(s, L.d, L.noise);
        hist.push(s); s = make(s, bm); last = bm; thinking = false; Z.sfx(bm.x?'pop':'move'); draw();
        if (!end()) status.textContent = inCheck(s,'w') ? '⚠️ Shohingga shoh (kish)!' : 'Sening yurishing (oq)';
      }, 250);
    }
    function end(){
      const lm = legal(s);
      const onlyKings = s.b.filter(Boolean).length===2;
      if (lm.length && !onlyKings) return false;
      over = true;
      if (onlyKings || !inCheck(s, s.turn)){ status.textContent='🤝 Durang'; Z.modal([h('div',{style:{fontSize:'64px'}},'🤝'),h('h2',null,'Durang!'),h('p',null,'Yaxshi o\'yin! +10🪙')],[{t:'Yana',cls:'grn',fn:()=>play(L)},{t:'Menyu',cls:'ghost',fn:menu}]); Z.reward(10,10); return true; }
      if (s.turn==='b'){ status.textContent='🏆 Mot! Sen yutding!'; Z.gameWin('chess', L.c, 80); setTimeout(()=>Z.winModal('Mot! Sen yutding!', L.n+' darajadagi kompyuterni yengding!', L.c, ()=>play(L), '♛'), 600); }
      else { status.textContent='Kompyuter yutdi'; Z.sfx('lose'); Z.modal([h('div',{style:{fontSize:'64px'}},'🤖'),h('h2',null,'Bu safar kompyuter yutdi'),h('p',null,'Hechqisi yo\'q! Har bir o\'yin seni kuchliroq qiladi.')],[{t:'Qayta o\'ynash',cls:'grn',fn:()=>play(L)},{t:'Menyu',cls:'ghost',fn:menu}]); }
      return true;
    }
    function hint(){ if (over||thinking||s.turn!=='w') return; if (!Z.spend(5)) return; const m = best(s, 2, 0); sel=m.f; moves=legal(s).filter(x=>x.f===m.f); draw(m); }
    draw();
  };
  menu();
}
Z.GAMES.push({id:'chess', n:'Shaxmat', e:'♞', c:'c-ind', d:'Kompyuterga qarshi', cat:'strategy', hot:true, run});
})();

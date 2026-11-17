/* Tangram — 7 bo'lakdan shakl yig'ish */
(function(){
'use strict';
const h = Z.h;
const PUZ = [{"n":"Uchburchak","e":"🔺","poly":[[0,0],[4,0],[0,4]],"sol":{"L1":[[2,0],[2,2],[0,0]],"L2":[[2,0],[4,0],[2,2]],"M":[[1,3],[1,1],[2,2]],"Q":[[1,1],[1,2],[0,2],[0,1]],"P":[[1,2],[1,3],[0,4],[0,3]],"S1":[[0,1],[0,0],[1,1]],"S2":[[0,2],[1,2],[0,3]]}},{"n":"To'rtburchak","e":"▬","poly":[[0,0],[4,0],[4,2],[0,2]],"sol":{"L1":[[2,0],[2,2],[0,0]],"L2":[[0,2],[0,0],[2,2]],"M":[[4,0],[4,2],[3,1]],"Q":[[3,0],[3,1],[2,1],[2,0]],"P":[[4,2],[3,2],[2,1],[3,1]],"S1":[[2,2],[2,1],[3,2]],"S2":[[3,0],[4,0],[3,1]]}},{"n":"Uy","e":"🏠","poly":[[2,0],[4,2],[3,2],[3,4],[1,4],[1,2],[0,2]],"sol":{"L1":[[3,2],[3,4],[1,2]],"L2":[[1,4],[1,2],[3,4]],"M":[[3,1],[1,1],[2,0]],"Q":[[2,1],[2,2],[1,2],[1,1]],"P":[[4,2],[3,2],[2,1],[3,1]],"S1":[[1,2],[0,2],[1,1]],"S2":[[2,2],[2,1],[3,2]]}},{"n":"Olmos","e":"💎","poly":[[2,0],[4,2],[2,4],[0,2]],"sol":{"L1":[[2,2],[2,4],[0,2]],"L2":[[2,2],[0,2],[2,0]],"M":[[3,3],[3,1],[4,2]],"Q":[[3,1],[3,2],[2,2],[2,1]],"P":[[3,2],[3,3],[2,4],[2,3]],"S1":[[2,1],[2,0],[3,1]],"S2":[[2,2],[3,2],[2,3]]}},{"n":"Kema","e":"⛵","poly":[[3,0],[5,2],[4,3],[1,3],[0,2],[1,2]],"sol":{"L1":[[3,2],[1,2],[3,0]],"L2":[[3,2],[3,0],[5,2]],"M":[[0,2],[2,2],[1,3]],"Q":[[3,2],[3,3],[2,3],[2,2]],"P":[[4,3],[3,3],[4,2],[5,2]],"S1":[[2,3],[1,3],[2,2]],"S2":[[3,2],[4,2],[3,3]]}},{"n":"Raketa","e":"🚀","poly":[[2,0],[3,1],[3,3],[4,4],[0,4],[1,3],[1,1]],"sol":{"L1":[[3,1],[3,3],[1,1]],"L2":[[1,3],[1,1],[3,3]],"M":[[3,1],[1,1],[2,0]],"Q":[[2,3],[2,4],[1,4],[1,3]],"P":[[4,4],[3,4],[2,3],[3,3]],"S1":[[1,4],[0,4],[1,3]],"S2":[[2,4],[2,3],[3,4]]}},{"n":"Trapetsiya","e":"⏢","poly":[[0,0],[6,0],[4,2],[2,2]],"sol":{"L1":[[2,0],[2,2],[0,0]],"L2":[[2,2],[2,0],[4,2]],"M":[[3,1],[5,1],[4,2]],"Q":[[4,0],[4,1],[3,1],[3,0]],"P":[[5,1],[4,1],[5,0],[6,0]],"S1":[[3,0],[3,1],[2,0]],"S2":[[4,0],[5,0],[4,1]]}},{"n":"Parallelogramm","e":"▱","poly":[[0,0],[4,0],[6,2],[2,2]],"sol":{"L1":[[2,0],[2,2],[0,0]],"L2":[[4,2],[4,0],[6,2]],"M":[[4,0],[4,2],[3,1]],"Q":[[3,0],[3,1],[2,1],[2,0]],"P":[[4,2],[3,2],[2,1],[3,1]],"S1":[[2,2],[2,1],[3,2]],"S2":[[3,0],[4,0],[3,1]]}},{"n":"O'q","e":"➡️","poly":[[1,1],[3,1],[3,0],[5,2],[3,4],[3,3],[1,3]],"sol":{"L1":[[3,1],[3,3],[1,1]],"L2":[[1,3],[1,1],[3,3]],"M":[[4,3],[4,1],[5,2]],"Q":[[4,1],[4,2],[3,2],[3,1]],"P":[[4,2],[4,3],[3,4],[3,3]],"S1":[[3,1],[3,0],[4,1]],"S2":[[3,2],[4,2],[3,3]]}},{"n":"Mushuk","e":"🐱","poly":[[0,0],[1,1],[3,1],[4,0],[4,2],[3,3],[1,3],[0,2]],"sol":{"L1":[[4,2],[2,2],[4,0]],"L2":[[0,2],[0,0],[2,2]],"M":[[1,1],[3,1],[2,2]],"Q":[[2,2],[2,3],[1,3],[1,2]],"P":[[3,3],[2,3],[3,2],[4,2]],"S1":[[1,2],[1,3],[0,2]],"S2":[[2,2],[3,2],[2,3]]}},{"n":"Shlyapa","e":"🎩","poly":[[1,0],[3,0],[3,2],[4,2],[4,3],[0,3],[0,2],[1,2]],"sol":{"L1":[[3,0],[3,2],[1,0]],"L2":[[2,3],[0,3],[2,1]],"M":[[1,2],[1,0],[2,1]],"Q":[[4,2],[4,3],[3,3],[3,2]],"P":[[3,2],[3,3],[2,2],[2,1]],"S1":[[2,3],[2,2],[3,3]],"S2":[[0,2],[1,2],[0,3]]}},{"n":"Archa","e":"🎄","poly":[[2,0],[3,1],[4,2],[3,2],[4,3],[3,3],[2,4],[1,3],[0,3],[1,2],[0,2],[1,1]],"sol":{"L1":[[2,2],[0,2],[2,0]],"L2":[[2,2],[2,0],[4,2]],"M":[[2,2],[2,4],[1,3]],"Q":[[3,2],[3,3],[2,3],[2,2]],"P":[[1,3],[0,3],[1,2],[2,2]],"S1":[[3,3],[3,2],[4,3]],"S2":[[2,3],[3,3],[2,4]]}},{"n":"Baliq","e":"🐟","poly":[[1,0],[4,0],[5,1],[4,2],[1,2],[1,1],[0,2],[0,0],[1,1]],"sol":{"L1":[[3,0],[3,2],[1,0]],"L2":[[1,2],[1,0],[3,2]],"M":[[0,2],[0,0],[1,1]],"Q":[[4,0],[4,1],[3,1],[3,0]],"P":[[4,2],[3,2],[4,1],[5,1]],"S1":[[4,1],[4,0],[5,1]],"S2":[[3,1],[4,1],[3,2]]}},{"n":"Qayiq","e":"🚤","poly":[[2,0],[4,0],[4,1],[7,1],[6,2],[1,2],[0,1],[2,1]],"sol":{"L1":[[4,0],[4,2],[2,0]],"L2":[[2,2],[2,0],[4,2]],"M":[[0,1],[2,1],[1,2]],"Q":[[5,1],[5,2],[4,2],[4,1]],"P":[[6,2],[5,2],[6,1],[7,1]],"S1":[[2,2],[1,2],[2,1]],"S2":[[5,1],[6,1],[5,2]]}},{"n":"Zinapoya","e":"🪜","poly":[[0,0],[1,0],[1,1],[3,1],[3,2],[4,2],[4,3],[0,3]],"sol":{"L1":[[2,1],[2,3],[0,1]],"L2":[[0,3],[0,1],[2,3]],"M":[[4,3],[2,3],[3,2]],"Q":[[1,0],[1,1],[0,1],[0,0]],"P":[[3,1],[3,2],[2,3],[2,2]],"S1":[[4,2],[4,3],[3,2]],"S2":[[2,1],[3,1],[2,2]]}},{"n":"Kapalak","e":"🦋","poly":[[0,0],[2,2],[4,0],[4,4],[2,2],[0,4]],"sol":{"L1":[[4,2],[4,4],[2,2]],"L2":[[4,2],[2,2],[4,0]],"M":[[1,3],[1,1],[2,2]],"Q":[[1,1],[1,2],[0,2],[0,1]],"P":[[1,2],[1,3],[0,4],[0,3]],"S1":[[0,1],[0,0],[1,1]],"S2":[[0,2],[1,2],[0,3]]}},{"n":"Shaxmat katagi","e":"🏁","poly":[[0,0],[2,0],[2,2],[4,2],[4,4],[2,4],[2,2],[0,2]],"sol":{"L1":[[2,0],[2,2],[0,0]],"L2":[[0,2],[0,0],[2,2]],"M":[[4,2],[4,4],[3,3]],"Q":[[3,2],[3,3],[2,3],[2,2]],"P":[[4,4],[3,4],[2,3],[3,3]],"S1":[[2,4],[2,3],[3,4]],"S2":[[3,2],[4,2],[3,3]]}}];
const BASE = { L1:[[0,0],[2,0],[0,2]], L2:[[0,0],[2,0],[0,2]], M:[[0,0],[2,0],[1,1]], Q:[[0,0],[1,0],[1,1],[0,1]], P:[[0,0],[1,0],[2,1],[1,1]], S1:[[0,0],[1,0],[0,1]], S2:[[0,0],[1,0],[0,1]] };
const COL = { L1:'#FF6B6B', L2:'#4D96FF', M:'#FFB72B', Q:'#6BCB77', P:'#B76BFF', S1:'#FF8FD8', S2:'#2ED3C6' };
const NAMES = ['L1','L2','M','Q','P','S1','S2'];
const QOFF = [[.5,.17],[.83,.5],[.5,.83],[.17,.5]];
function inside(x,y,poly){ let c=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const [x1,y1]=poly[i],[x2,y2]=poly[j]; if((y1>y)!==(y2>y)){ const xi=x1+(y-y1)*(x2-x1)/(y2-y1); if(x<xi) c=!c; } } return c; }
function raster(poly){ const xs=poly.map(p=>p[0]), ys=poly.map(p=>p[1]); const s=new Set();
  for(let cx=Math.floor(Math.min(...xs))-1;cx<=Math.max(...xs);cx++) for(let cy=Math.floor(Math.min(...ys))-1;cy<=Math.max(...ys);cy++) QOFF.forEach(([ox,oy],q)=>{ if(inside(cx+ox,cy+oy,poly)) s.add(cx+','+cy+','+q); });
  return s; }
function shape(name, rot, flip){
  let p = BASE[name].map(([x,y])=>[flip?-x:x, y]);
  for (let k=0;k<rot;k++) p = p.map(([x,y])=>[-y,x]);
  const mx=Math.min(...p.map(v=>v[0])), my=Math.min(...p.map(v=>v[1]));
  return p.map(([x,y])=>[x-mx,y-my]);
}
const key = p => p.map(v=>v.join(',')).sort().join(';');

function run(app){
  const S = Z.S;
  const solved = (S.games.tangram && S.games.tangram.solved) || [];
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Tangram — qadimiy Xitoy jumbog\'i! 7 ta bo\'lakdan berilgan shaklni yig\'. Bo\'lakni sudrab olib bor, bosib aylantir. 🧩'));
    const g = h('div',{class:'tiles',style:{marginTop:'14px'}});
    PUZ.forEach((p,i)=>{
      const done = solved.includes(p.n);
      const sv = `<svg viewBox="-0.5 -0.5 ${Math.max(...p.poly.map(v=>v[0]))+1} ${Math.max(...p.poly.map(v=>v[1]))+1}" width="70" height="56"><polygon points="${p.poly.map(v=>v.join(',')).join(' ')}" fill="${done?'#1FB866':'#2B2350'}" opacity="${done?1:.8}"/></svg>`;
      g.appendChild(h('button',{class:'tile '+(done?'c-grn':i<4?'c-blu':i<10?'c-pri':'c-ind'),onclick:()=>{Z.sfx('click');play(i);}}, h('div',{html:sv}), h('div',{class:'t'}, p.e+' '+p.n), h('div',{class:'s'}, done?'✅ Yig\'ilgan':(i<4?'Oson':i<10?'O\'rta':'Qiyin'))));
    });
    app.appendChild(g);
  };
  const play = idx => {
    const P = PUZ[idx]; const easy = idx < 4;
    app.innerHTML='';
    const W = Math.max(...P.poly.map(v=>v[0])), Hh = Math.max(...P.poly.map(v=>v[1]));
    let OX = 1; const OY = 1;
    const VW = Math.max(W+2, 8.5), trayY = Hh + 2.4, VH = trayY + 5;
    OX += Math.floor((VW-W-2)/2);
    const target = raster(P.poly.map(([x,y])=>[x+OX, y+OY]));
    const st = {};
    const g = VW/8.5;
    const trayPos = {L1:[0.2,0],L2:[2.9,0],M:[5.9,0.5],Q:[0.4,3],P:[2,3],S1:[5,3],S2:[6.8,3]};
    NAMES.forEach(n=>{ st[n] = {x:Math.round(trayPos[n][0]*g), y:Math.round(trayY+trayPos[n][1]), rot:0, flip:false}; });
    let sel = null, won = false, hints = 0;
    const svg = Z.svgEl('svg',{viewBox:`0 0 ${VW} ${VH}`, class:'play', width:Math.min(560, innerWidth-28)});
    svg.style.touchAction='none';
    // grid fon
    for (let x=0;x<=VW;x++) svg.appendChild(Z.svgEl('line',{x1:x,y1:0,x2:x,y2:trayY-0.5,stroke:'rgba(108,76,241,.08)','stroke-width':.03}));
    for (let y=0;y<trayY;y++) svg.appendChild(Z.svgEl('line',{x1:0,y1:y,x2:VW,y2:y,stroke:'rgba(108,76,241,.08)','stroke-width':.03}));
    svg.appendChild(Z.svgEl('line',{x1:0,y1:trayY-0.4,x2:VW,y2:trayY-0.4,stroke:'rgba(0,0,0,.12)','stroke-width':.05,'stroke-dasharray':'.2 .2'}));
    svg.appendChild(Z.svgEl('polygon',{points:P.poly.map(([x,y])=>(x+OX)+','+(y+OY)).join(' '),fill:'#2B2350',opacity:.85}));
    if (easy) Object.values(P.sol).forEach(pp=>svg.appendChild(Z.svgEl('polygon',{points:pp.map(([x,y])=>(x+OX)+','+(y+OY)).join(' '),fill:'none',stroke:'rgba(255,255,255,.55)','stroke-width':.04})));
    const layer = Z.svgEl('g'); svg.appendChild(layer);
    const els = {};
    function draw(){
      NAMES.forEach(n=>{
        const s = st[n]; const pts = shape(n,s.rot,s.flip).map(([x,y])=>(x+s.x)+','+(y+s.y)).join(' ');
        if (!els[n]){ els[n] = Z.svgEl('polygon',{class:'tg-piece',fill:COL[n]}); layer.appendChild(els[n]); attach(n); }
        els[n].setAttribute('points', pts);
        els[n].setAttribute('class','tg-piece'+(sel===n?' sel':''));
      });
    }
    function toSvg(e){ const r = svg.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*VW, (e.clientY-r.top)/r.height*VH]; }
    function attach(n){
      const el = els[n];
      el.addEventListener('pointerdown', e=>{
        if (won) return; e.preventDefault(); el.setPointerCapture(e.pointerId);
        sel = n; layer.appendChild(el); draw();
        const [sx,sy] = toSvg(e); const s0 = {x:st[n].x, y:st[n].y}; let moved = false;
        const mv = ev => { const [x,y] = toSvg(ev); if (Math.abs(x-sx)+Math.abs(y-sy) > .15) moved = true; st[n].x = s0.x + x - sx; st[n].y = s0.y + y - sy; draw(); };
        const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
          if (!moved) rotate(); else { snap(n); Z.sfx('move'); } draw(); check(); };
        el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      });
    }
    function snap(n){ const s = st[n]; s.x = Math.round(s.x); s.y = Math.round(s.y); const sh = shape(n,s.rot,s.flip); const w=Math.max(...sh.map(v=>v[0])), hh=Math.max(...sh.map(v=>v[1])); s.x=Math.max(0,Math.min(VW-w,s.x)); s.y=Math.max(0,Math.min(VH-hh,s.y)); }
    function rotate(){ if (!sel) { Z.toast('Avval bo\'lakni tanla 👆'); return; } const s = st[sel]; s.rot = (s.rot+1)%4; snap(sel); Z.sfx('pop'); draw(); check(); }
    function flip(){ if (!sel) { Z.toast('Avval bo\'lakni tanla 👆'); return; } if (sel!=='P'){ Z.toast('Faqat binafsha parallelogrammni ag\'darish mumkin'); return; } st[sel].flip = !st[sel].flip; snap(sel); Z.sfx('pop'); draw(); check(); }
    function placedSet(){ const all = new Map(); let total=0; NAMES.forEach(n=>{ const s=st[n]; const r=raster(shape(n,s.rot,s.flip).map(([x,y])=>[x+s.x,y+s.y])); r.forEach(k=>{ all.set(k,(all.get(k)||0)+1); }); total+=r.size; }); return all; }
    function check(){
      const all = placedSet(); let okc = 0;
      for (const k of target) if (all.get(k)===1) okc++;
      const pct = Math.round(okc/target.size*100);
      const pe = document.getElementById('tgp'); if (pe) pe.textContent = '🎯 '+pct+'%';
      if (okc === target.size && [...all.values()].every(v=>v===1) && [...all.keys()].every(k=>target.has(k))){
        won = true; sel = null; draw();
        const coins = Math.max(10, (easy?20:idx<10?35:50) - hints*8);
        const g = S.games.tangram || (S.games.tangram={wins:0,plays:0}); g.solved = g.solved || []; if (!g.solved.includes(P.n)) g.solved.push(P.n);
        Z.gameWin('tangram', coins, 40);
        setTimeout(()=>Z.modal([h('div',{style:{fontSize:'70px'}},P.e), h('h2',null,'Zo\'r! '+P.n+' yig\'ildi!'), h('div',{class:'row',style:{justifyContent:'center'}},h('span',{class:'pill coin'},'🪙 +'+coins))],
          [{t:'Keyingisi ➜',cls:'grn',fn:()=>play((idx+1)%PUZ.length)},{t:'Ro\'yxat',cls:'ghost',fn:menu}]), 600);
      }
    }
    function hint(){
      if (won) return;
      const type = n => n.replace(/\d/,'');
      const slotKey = m => key(P.sol[m].map(([x,y])=>[x+OX,y+OY]));
      const cur = n => { const s=st[n]; return key(shape(n,s.rot,s.flip).map(([x,y])=>[x+s.x,y+s.y])); };
      const good = new Set(), usedPieces = new Set();
      NAMES.forEach(m=>{ const p = NAMES.find(n=>type(n)===type(m) && !usedPieces.has(n) && cur(n)===slotKey(m)); if (p){ good.add(m); usedPieces.add(p); } });
      const slot = NAMES.find(m=>!good.has(m)); if (!slot) return;
      const piece = NAMES.find(n=>type(n)===type(slot) && !usedPieces.has(n));
      if (!Z.spend(10)) return;
      const tp = P.sol[slot].map(([x,y])=>[x+OX,y+OY]); const mx=Math.min(...tp.map(v=>v[0])), my=Math.min(...tp.map(v=>v[1]));
      const tk = key(tp.map(([x,y])=>[x-mx,y-my]));
      for (let f=0; f<2; f++) for (let r=0;r<4;r++){ if (key(shape(piece,r,!!f))===tk){ st[piece]={x:mx,y:my,rot:r,flip:!!f}; hints++; sel=piece; Z.sfx('pop'); draw(); check(); return; } }
    }
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'}, P.e+' '+P.n), h('span',{class:'ginfo',id:'tgp'},'🎯 0%')),
      svg,
      h('div',{class:'gbar'},
        h('button',{class:'btn sm blu',onclick:rotate},'⟳ Aylantir'),
        h('button',{class:'btn sm',onclick:flip},'⇋ Ag\'dar'),
        h('button',{class:'btn sm yel',onclick:hint},'💡 Yordam (10🪙)'),
        h('button',{class:'btn sm ghost',onclick:()=>play(idx)},'🔄'),
        h('button',{class:'btn sm ghost',onclick:menu},'↩ Ro\'yxat')),
      h('div',{class:'howto'},'Bo\'lakni barmoq bilan sudrab, qora shakl ustiga qo\'y. Bo\'lakka bir marta bossang — 90° aylanadi. Bo\'laklar ustma-ust tushmasligi kerak.')));
    draw();
  };
  menu();
}
Z.GAMES.push({id:'tangram', n:'Tangram', e:'🔷', c:'c-blu', d:'7 bo\'lakdan shakl yasa', cat:'logic', hot:true, run});
})();

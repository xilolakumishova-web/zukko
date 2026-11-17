/* Saralash: rangli sharlarni naychalarga ajratish */
(function(){
'use strict';
const h = Z.h;
const COLORS = ['#FF4D4D','#4D96FF','#FFC93C','#1FB866','#B76BFF','#FF8A00','#FF6FB5','#2ED3C6','#8B5A2B','#2B2350'];
const CAP = 4;

function solvable(tubes, limit){
  const seen = new Set(); let nodes = 0;
  const key = t => t.map(x=>x.join('')).sort().join('|');
  const done = t => t.every(x=>x.length===0 || (x.length===CAP && x.every(c=>c===x[0])));
  const dfs = t => {
    if (done(t)) return true;
    if (++nodes > limit) return false;
    const k = key(t); if (seen.has(k)) return false; seen.add(k);
    for (let i=0;i<t.length;i++){ const a=t[i]; if (!a.length) continue; const c=a[a.length-1];
      if (a.length===CAP && a.every(x=>x===c)) continue;
      for (let j=0;j<t.length;j++){ if (i===j) continue; const b=t[j]; if (b.length>=CAP) continue; if (b.length && b[b.length-1]!==c) continue; if (!b.length && a.every(x=>x===c)) continue;
        const n = t.map(x=>x.slice()); n[j].push(n[i].pop()); if (dfs(n)) return true; } }
    return false;
  };
  return dfs(tubes);
}
function gen(nc){
  for (let tries=0; tries<40; tries++){
    const balls = Z.shuffle([].concat(...[...Array(nc)].map((_,c)=>Array(CAP).fill(c))));
    const tubes = [...Array(nc)].map((_,i)=>balls.slice(i*CAP,(i+1)*CAP)); tubes.push([],[]);
    if (tubes.some(t=>t.length===CAP && t.every(c=>c===t[0]))) continue;
    if (solvable(tubes.map(x=>x.slice()), 60000)) return tubes;
  }
  const tubes=[...Array(nc)].map((_,c)=>Array(CAP).fill(c)); tubes.push([],[]); // ehtiyot
  return tubes;
}

function run(app){
  const G = Z.S.games.ballsort || (Z.S.games.ballsort = {wins:0, plays:0}); G.lv = G.lv || 1;
  const play = () => {
    const nc = Math.min(3 + Math.floor((G.lv-1)/2), 9);
    let tubes = gen(nc); const start = tubes.map(x=>x.slice());
    let sel = -1, moves = 0, hist = [], won = false, extra = false;
    app.innerHTML='';
    const wrapT = h('div',{class:'tubes'});
    const info = h('span',{class:'ginfo'},'');
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},'🧪 '+G.lv+'-daraja'), info),
      wrapT,
      h('div',{class:'gbar'},
        h('button',{class:'btn sm blu',onclick:()=>{ if(hist.length && !won){ tubes=hist.pop(); moves++; sel=-1; Z.sfx('pop'); draw(); } }},'↶ Orqaga'),
        h('button',{class:'btn sm yel',onclick:()=>{ if (extra||won) return; if (Z.spend(15)){ extra=true; tubes.push([]); draw(); } }},'➕ Naycha (15🪙)'),
        h('button',{class:'btn sm ghost',onclick:()=>{ tubes=start.map(x=>x.slice()); hist=[]; moves=0; sel=-1; extra=false; draw(); }},'🔄 Qayta')),
      h('div',{class:'howto'},'Naychani bos — ustki shar ko\'tariladi. Keyin boshqa naychani bos. Sharni faqat bo\'sh naychaga yoki xuddi shu rangli shar ustiga qo\'yish mumkin. Har bir naychada bitta rang qolsin!')));
    function draw(){
      wrapT.innerHTML=''; info.textContent='👣 '+moves+' yurish';
      tubes.forEach((t,i)=>{
        const full = t.length===CAP && t.every(c=>c===t[0]);
        const el = h('div',{class:'tube'+(i===sel?' sel':'')+(full?' full':''),onclick:()=>click(i)});
        t.forEach(c=>el.appendChild(h('div',{class:'ball',style:{background:COLORS[c]}})));
        wrapT.appendChild(el);
      });
    }
    function click(i){
      if (won) return;
      if (sel<0){ if (tubes[i].length){ sel=i; Z.sfx('click'); } draw(); return; }
      if (sel===i){ sel=-1; draw(); return; }
      const a=tubes[sel], b=tubes[i]; const c=a[a.length-1];
      if (b.length>=CAP || (b.length && b[b.length-1]!==c)){ Z.sfx('bad'); sel = tubes[i].length? i : -1; draw(); return; }
      hist.push(tubes.map(x=>x.slice()));
      // bir xil rangli bir nechta sharni birga ko'chiramiz
      while (a.length && a[a.length-1]===c && b.length<CAP) b.push(a.pop());
      moves++; sel=-1; Z.sfx('move'); draw();
      if (tubes.every(x=>x.length===0 || (x.length===CAP && x.every(k=>k===x[0])))){
        won = true; const coins = 10 + nc*3; G.lv++;
        Z.gameWin('ballsort', coins, 20);
        setTimeout(()=>Z.winModal('Hammasi saralandi!', moves+' ta yurishda · Keyingi: '+G.lv+'-daraja', coins, play, '🧪'), 600);
      }
    }
    draw();
  };
  play();
}
Z.GAMES.push({id:'ballsort', n:'Saralash', e:'🧪', c:'c-pnk', d:'Sharlarni rangiga ajrat', cat:'logic', hot:true, run});
})();

/* SET — uchlikni top */
(function(){
'use strict';
const h = Z.h;
const COLS = ['#E8364F','#1FA35C','#6C4CF1'];
function shapePath(s){ return s===0 ? '<rect x="4" y="2" width="22" height="46" rx="11"/>' : s===1 ? '<polygon points="15,1 28,25 15,49 2,25"/>' : '<path d="M8 4 C22 -2 30 12 22 22 C16 30 30 38 22 46 C10 52 2 40 8 30 C14 22 0 14 8 4Z"/>'; }
function cardSvg(c){
  const color = COLS[c.c]; const id='p'+c.c;
  const fill = c.f===0 ? color : c.f===1 ? `url(#${id})` : 'none';
  const shp = shapePath(c.s);
  let out = '';
  for (let i=0;i<c.n+1;i++) out += `<svg viewBox="-2 -2 34 54" width="24%" style="max-width:44px"><defs><pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="${color}"/></pattern></defs><g fill="${fill}" stroke="${color}" stroke-width="3">${shp}</g></svg>`;
  return out;
}
const isSet = (a,b,c) => ['n','s','c','f'].every(k=>{ const v=[a[k],b[k],c[k]]; return (v[0]===v[1]&&v[1]===v[2]) || (v[0]!==v[1]&&v[1]!==v[2]&&v[0]!==v[2]); });
function findSet(cards){ for (let i=0;i<cards.length;i++) for (let j=i+1;j<cards.length;j++) for (let k=j+1;k<cards.length;k++) if (isSet(cards[i],cards[j],cards[k])) return [i,j,k]; return null; }

function run(app){
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('SET — diqqat o\'yini! 3 ta kartadan iborat "SET" top: har bir belgi (soni, shakli, rangi, to\'ldirilishi) uchala kartada YO hammasi bir xil, YO hammasi har xil bo\'lishi kerak. 🃏'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    t.append(
      h('button',{class:'tile c-grn',onclick:()=>{Z.sfx('click');play(true);}}, h('div',{class:'em'},'🃏'), h('div',{class:'t'},'SET Junior'), h('div',{class:'s'},'3 belgi (hammasi to\'liq bo\'yalgan)')),
      h('button',{class:'tile c-pri',onclick:()=>{Z.sfx('click');play(false);}}, h('div',{class:'em'},'🎴'), h('div',{class:'t'},'SET Klassik'), h('div',{class:'s'},'4 belgi · 81 karta')));
    app.appendChild(t);
    app.appendChild(h('div',{class:'card',style:{marginTop:'14px'}}, h('b',null,'Misol:'), h('div',{class:'small',style:{marginTop:'6px'}},'1 ta qizil oval, 2 ta qizil romb, 3 ta qizil to\'lqin — SET ✅ (soni har xil, shakli har xil, rangi bir xil). 1 ta qizil oval, 1 ta yashil oval, 2 ta binafsha oval — SET emas ❌ (soni: 1,1,2 — ikkitasi bir xil, biri boshqa).')));
  };
  const play = junior => {
    let deck = []; for (let n=0;n<3;n++) for (let s=0;s<3;s++) for (let c=0;c<3;c++) for (let f=0;f<(junior?1:3);f++) deck.push({n,s,c,f});
    deck = Z.shuffle(deck);
    let table = deck.splice(0,12), sel = [], found = 0, t0 = Date.now(), over = false, hintIdx = [];
    const goal = junior ? 6 : 10;
    app.innerHTML='';
    const grid = h('div',{class:'setg'}); const info = h('div',{class:'gbar'});
    app.appendChild(h('div',{class:'gwrap'}, info, grid, h('div',{class:'gbar'},
      h('button',{class:'btn sm yel',onclick:()=>{ const s=findSet(table); if(!s){ add3(); return; } if(!Z.spend(5)) return; hintIdx=[s[0]]; draw(); }},'💡 Yordam (5🪙)'),
      h('button',{class:'btn sm blu',onclick:()=>{ if (findSet(table)){ Z.toast('Diqqat! Stolda SET bor 😉'); return; } add3(); }},'➕ 3 karta'),
      h('button',{class:'btn sm ghost',onclick:menu},'↩'))));
    Z.interval(()=>{ const e=document.getElementById('settime'); if (e && !over) e.textContent='⏱ '+Z.fmtTime((Date.now()-t0)/1000); }, 1000);
    function add3(){ if (deck.length<3){ Z.toast('Kartalar tugadi'); return; } table.push(...deck.splice(0,3)); draw(); }
    function draw(){
      info.innerHTML=''; info.append(h('span',{class:'ginfo'},'✅ '+found+' / '+goal+' SET'), h('span',{class:'ginfo',id:'settime'},'⏱ '+Z.fmtTime((Date.now()-t0)/1000)), h('span',{class:'ginfo'},'🂠 '+deck.length));
      grid.innerHTML='';
      table.forEach((c,i)=>grid.appendChild(h('div',{class:'scard'+(sel.includes(i)?' sel':'')+(hintIdx.includes(i)?' hint':''),html:cardSvg(c),onclick:()=>pick(i)})));
    }
    function pick(i){
      if (over) return;
      if (sel.includes(i)) sel = sel.filter(x=>x!==i); else sel.push(i);
      Z.sfx('click');
      if (sel.length===3){
        const [a,b,c] = sel.map(x=>table[x]);
        if (isSet(a,b,c)){
          found++; Z.sfx('ok'); Z.reward(3, 5);
          const idx = sel.slice().sort((x,y)=>y-x);
          if (table.length>12 || deck.length<3) idx.forEach(x=>table.splice(x,1));
          else { const nw = deck.splice(0,3); sel.forEach((x,k)=>table[x]=nw[k]); }
          sel=[]; hintIdx=[];
          if (found>=goal || (!deck.length && !findSet(table))){ over=true; draw(); const secs=(Date.now()-t0)/1000; const coins = (junior?25:50) + Math.max(0, Math.round((junior?120:300)-secs)/10|0);
            Z.gameWin('set', coins, 50); setTimeout(()=>Z.winModal('Barakalla, SET ustasi!', found+' ta SET · '+Z.fmtTime(secs), coins, ()=>play(junior), '🃏'), 500); return; }
        } else {
          Z.sfx('bad'); const bad = sel.slice(); draw(); bad.forEach(x=>grid.children[x].classList.add('bad'));
          const why = ['n','s','c','f'].filter(k=>{ const v=[a[k],b[k],c[k]]; return !((v[0]===v[1]&&v[1]===v[2])||(v[0]!==v[1]&&v[1]!==v[2]&&v[0]!==v[2])); }).map(k=>({n:'soni',s:'shakli',c:'rangi',f:'bo\'yalishi'})[k]);
          Z.toast('SET emas: '+why.join(', ')+' — ikkitasi bir xil, biri boshqa');
          sel=[]; setTimeout(draw, 450); return;
        }
      }
      draw();
    }
    draw();
  };
  menu();
}
Z.GAMES.push({id:'set', n:'SET', e:'🃏', c:'c-grn', d:'Uchlikni top — diqqat o\'yini', cat:'fast', hot:true, run});
})();

/* Mantiqiy zanjirlar va sonli piramida */
(function(){
'use strict';
const h = Z.h, {ri, pick, shuffle} = Z;

function genChain(lv){
  const len = Math.min(3 + Math.floor(lv/3), 6);
  const big = lv > 4;
  let v = ri(2, big?30:12); const nodes=[v]; const ops=[];
  for (let i=0;i<len-1;i++){
    let op, a, nv;
    for (let t=0;t<30;t++){
      op = pick(lv<2?['+','−']:lv<4?['+','−','×']:['+','−','×',':']);
      a = op==='×' ? ri(2, big?5:3) : op===':' ? pick([2,3,4,5]) : ri(2, big?40:15);
      nv = op==='+'?v+a: op==='−'?v-a: op==='×'?v*a: v/a;
      if (nv>0 && Number.isInteger(nv) && nv<500) break;
    }
    if (!(nv>0 && Number.isInteger(nv))) { op='+'; a=ri(2,9); nv=v+a; }
    ops.push([op,a]); nodes.push(nv); v=nv;
  }
  // yashiriladigan tugunlar
  const k = Math.min(1 + Math.floor(lv/2), len-1);
  let hide = shuffle([...Array(len).keys()]).slice(0,k);
  if (!hide.length) hide=[len-1];
  return {nodes, ops, hide:new Set(hide)};
}

function genPyramid(lv){
  const n = lv<3?3:lv<6?4:5;
  const base = [...Array(n)].map(()=>ri(1, lv<3?9:lv<6?12:15));
  const rows = [base]; while (rows[0].length>1){ const r=rows[0]; rows.unshift(r.slice(1).map((x,i)=>x+r[i])); }
  // rows[0] = tepasi
  const cells = []; rows.forEach((r,i)=>r.forEach((_,j)=>cells.push([i,j])));
  const known = new Set(cells.map(c=>c.join(',')));
  const solvable = kn => { const K=new Set(kn); let ch=true; while(ch){ ch=false; for (let i=0;i<rows.length-1;i++) for (let j=0;j<rows[i].length;j++){ const p=i+','+j, a=(i+1)+','+j, b=(i+1)+','+(j+1); const c=[p,a,b].filter(x=>K.has(x)).length; if (c===2){ [p,a,b].forEach(x=>K.add(x)); ch=true; } } } return K.size===cells.length; };
  const target = Math.floor(cells.length * (lv<3?0.45:0.55));
  let hidden = 0;
  for (const c of shuffle(cells)){ if (hidden>=target) break; const k=c.join(','); known.delete(k); if (solvable(known)) hidden++; else known.add(k); }
  return {rows, known};
}

function run(app){
  const S = Z.S; const G = S.games.chain || (S.games.chain = {wins:0, plays:0});
  G.lv = G.lv || 1; G.plv = G.plv || 1;
  const menu = () => {
    app.innerHTML='';
    app.appendChild(Z.mascot('Zanjirdagi har bir strelka — bitta amal. Bo\'sh kataklarga to\'g\'ri sonni yoz! Piramidada esa har bir g\'isht ostidagi ikki g\'ishtning yig\'indisiga teng. 🧱'));
    const t = h('div',{class:'tiles',style:{marginTop:'14px'}});
    t.append(
      h('button',{class:'tile c-org',onclick:()=>{Z.sfx('click');chain();}}, h('div',{class:'em'},'⛓️'), h('div',{class:'t'},'Sonli zanjir'), h('div',{class:'s'}, G.lv+'-daraja')),
      h('button',{class:'tile c-brn',onclick:()=>{Z.sfx('click');pyramid();}}, h('div',{class:'em'},'🧱'), h('div',{class:'t'},'Sonli piramida'), h('div',{class:'s'}, G.plv+'-daraja')));
    app.appendChild(t);
  };
  const inputBox = (correct, onOk) => {
    const inp = h('input',{type:'text',inputmode:'numeric',autocomplete:'off'});
    inp.dataset.ans = correct;
    return inp;
  };
  const checkAll = (inputs, onWin) => {
    let all = true;
    inputs.forEach(inp=>{ const ok = String(inp.value.trim())===String(inp.dataset.ans); const node=inp.parentElement; node.classList.remove('ok','bad'); if (inp.value.trim()==='') { all=false; return; } node.classList.add(ok?'ok':'bad'); if(!ok) all=false; });
    if (all) onWin(); else { Z.sfx('bad'); Z.toast('Qizil kataklarni qayta tekshir 🔍'); }
  };
  const chain = () => {
    app.innerHTML='';
    const P = genChain(G.lv);
    const box = h('div',{class:'chain'}); const inputs = [];
    P.nodes.forEach((v,i)=>{
      if (i>0){ const [op,a]=P.ops[i-1]; box.appendChild(h('div',{class:'carrow'}, h('div',null, op+a), h('span',null,'➜'))); }
      if (P.hide.has(i)){ const inp=inputBox(v); inputs.push(inp); box.appendChild(h('div',{class:'cnode'}, inp)); }
      else box.appendChild(h('div',{class:'cnode'}, v));
    });
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},'⛓️ '+G.lv+'-daraja'), h('button',{class:'btn sm ghost',onclick:menu},'↩ Menyu')),
      box,
      h('button',{class:'btn grn',onclick:()=>checkAll(inputs, ()=>{ const c = 8+G.lv*2; G.lv++; Z.gameWin('chain', c, 15); setTimeout(()=>Z.winModal('To\'g\'ri!', 'Keyingi daraja: '+G.lv, c, chain, '⛓️'), 500); })},'✅ Tekshirish'),
      h('div',{class:'howto'},'Maslahat: noma\'lum son oldinda bo\'lsa, teskari amalni bajar (+ o\'rniga −, × o\'rniga :).')));
    setTimeout(()=>inputs[0] && inputs[0].focus(), 100);
  };
  const pyramid = () => {
    app.innerHTML='';
    const P = genPyramid(G.plv); const inputs = [];
    const wrap = h('div',{class:'col',style:{alignItems:'center',gap:'6px'}});
    P.rows.forEach((r,i)=>{
      const row = h('div',{class:'row',style:{gap:'6px',justifyContent:'center',flexWrap:'nowrap'}});
      r.forEach((v,j)=>{
        if (P.known.has(i+','+j)) row.appendChild(h('div',{class:'cnode',style:{width:'64px',height:'54px',background:'#FFE7C2',borderRadius:'10px'}}, v));
        else { const inp=inputBox(v); inp.style.width='56px'; inp.style.height='44px'; inputs.push(inp); row.appendChild(h('div',{class:'cnode',style:{width:'64px',height:'54px',borderRadius:'10px'}}, inp)); }
      });
      wrap.appendChild(row);
    });
    app.appendChild(h('div',{class:'gwrap'},
      h('div',{class:'gbar'}, h('span',{class:'ginfo'},'🧱 '+G.plv+'-daraja'), h('button',{class:'btn sm ghost',onclick:menu},'↩ Menyu')),
      wrap,
      h('button',{class:'btn grn',onclick:()=>checkAll(inputs, ()=>{ const c = 10+G.plv*2; G.plv++; Z.gameWin('chain', c, 15); setTimeout(()=>Z.winModal('Piramida qurildi!', 'Keyingi daraja: '+G.plv, c, pyramid, '🧱'), 500); })},'✅ Tekshirish'),
      h('div',{class:'howto'},'Har bir g\'isht = ostidagi ikki g\'isht yig\'indisi. Agar yuqoridagi va bitta pastdagi ma\'lum bo\'lsa — ayir!')));
  };
  menu();
}
Z.GAMES.push({id:'chain', n:'Mantiqiy zanjir', e:'⛓️', c:'c-org', d:'Zanjir va sonli piramida', cat:'logic', hot:true, run});
})();

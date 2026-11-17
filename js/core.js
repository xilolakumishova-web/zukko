/* Zukko — core: holat, mukofotlar, ovoz, navigatsiya, yordamchilar */
(function(){
'use strict';
const Z = window.Z = {};

/* ---------- DOM helper ---------- */
Z.h = function(tag, props, ...kids){
  const el = document.createElement(tag);
  if (props) for (const k in props){
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(9)){
    if (c == null || c === false) continue;
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
};
const h = Z.h;
Z.svgEl = function(tag, attrs){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

/* ---------- random helpers ---------- */
Z.ri = (a,b)=> a + Math.floor(Math.random()*(b-a+1));
Z.pick = arr => arr[Math.floor(Math.random()*arr.length)];
Z.shuffle = arr => { const a = arr.slice(); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
Z.uniq = arr => [...new Set(arr)];
/* 4 variantli savol: to'g'ri javob + chalg'ituvchilar */
Z.mcq = function(correct, distract, fmt){
  fmt = fmt || (x=>String(x));
  const c = fmt(correct);
  const set = [c];
  for (const d of distract){
    if (typeof d === 'number' && typeof correct === 'number' && ((d < 0 && correct >= 0) || (!Number.isInteger(d) && Number.isInteger(correct)) || !isFinite(d))) continue;
    const s = fmt(d); if (!set.includes(s)) set.push(s); if (set.length===4) break; }
  let k = 1;
  while (set.length < 4 && typeof correct === 'number'){ const v = correct + Math.ceil(k/2)*(k%2?1:-1)*Math.max(1,Math.round(Math.abs(correct)*0.1)); const s = fmt(v); if (!(v<0 && correct>=0) && !set.includes(s)) set.push(s); k++; if(k>40)break; }
  const opts = Z.shuffle(set);
  return { opts, a: opts.indexOf(c) };
};

/* ---------- storage ---------- */
const KEY = 'zukko_v1';
const today = () => { const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); };
Z.today = today;
function defaults(){
  return { created:false, name:'', avatar:'🦁', grade:4, coins:50, xp:0, streak:0, lastDay:'', bestStreak:0,
    stats:{}, stars:{}, badges:[], owned:['🦁','🐯','🐼','🐰'], theme:'', themes:[''],
    games:{}, daily:{date:'',answers:0,games:0,lessons:0,claimed:false}, sound:true, totalCorrect:0, totalAnswers:0,
    lessons:0, exams:[], hist:{} };
}
let mem = null;
Z.load = function(){
  try { const s = localStorage.getItem(KEY); if (s) mem = Object.assign(defaults(), JSON.parse(s)); } catch(e){}
  if (!mem) mem = defaults();
  Z.S = mem;
  return mem;
};
Z.save = function(){ try { localStorage.setItem(KEY, JSON.stringify(Z.S)); } catch(e){} };
Z.resetAll = function(){ try{ localStorage.removeItem(KEY);}catch(e){} mem=null; Z.load(); };

/* ---------- sound (WebAudio) ---------- */
let actx = null;
function ctx(){ if (!actx){ try{ actx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return actx; }
function tone(freq, t0, dur, type, vol){
  const c = ctx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type||'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime+t0);
  g.gain.exponentialRampToValueAtTime(vol||0.18, c.currentTime+t0+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+t0+dur);
  o.connect(g); g.connect(c.destination);
  o.start(c.currentTime+t0); o.stop(c.currentTime+t0+dur+0.05);
}
Z.sfx = function(kind){
  if (!Z.S || !Z.S.sound) return;
  try{
    const c = ctx(); if (c && c.state==='suspended') c.resume();
    switch(kind){
      case 'ok': tone(660,0,.12,'triangle'); tone(880,.1,.18,'triangle'); tone(1320,.2,.22,'triangle',.12); break;
      case 'bad': tone(220,0,.18,'sawtooth',.08); tone(165,.15,.25,'sawtooth',.08); break;
      case 'coin': tone(988,0,.08,'square',.07); tone(1319,.07,.2,'square',.07); break;
      case 'win': [523,659,784,1047,784,1047].forEach((f,i)=>tone(f,i*.11,.2,'triangle',.15)); break;
      case 'lose': [392,330,262].forEach((f,i)=>tone(f,i*.18,.25,'triangle',.12)); break;
      case 'click': tone(500,0,.05,'sine',.08); break;
      case 'pop': tone(780,0,.07,'sine',.12); break;
      case 'move': tone(300,0,.06,'triangle',.12); break;
    }
  }catch(e){}
};

/* ---------- speech ---------- */
Z.speak = function(text, lang){
  try{
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'en-US'; u.rate = 0.85;
    const vs = speechSynthesis.getVoices().filter(v=>v.lang && v.lang.startsWith((lang||'en-US').slice(0,2)));
    if (vs.length) u.voice = vs[0];
    speechSynthesis.speak(u);
  }catch(e){}
};

/* ---------- confetti ---------- */
Z.confetti = function(n){
  const cv = document.getElementById('confetti'); if (!cv) return;
  const c = cv.getContext('2d'); const W = cv.width = innerWidth, H = cv.height = innerHeight;
  const cols = ['#6C4CF1','#FF8A00','#1FB866','#FF4F8B','#FFC93C','#2D9CDB'];
  const ps = []; n = n||140;
  for (let i=0;i<n;i++) ps.push({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,r:Math.random()*6+4,c:Z.pick(cols),a:Math.random()*6,va:(Math.random()-.5)*.4,s:Math.random()<.5});
  let fr = 0;
  (function step(){
    c.clearRect(0,0,W,H); fr++;
    for (const p of ps){ p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      c.save(); c.translate(p.x,p.y); c.rotate(p.a); c.fillStyle = p.c;
      if (p.s) c.fillRect(-p.r,-p.r/2,p.r*2,p.r); else { c.beginPath(); c.arc(0,0,p.r*.7,0,7); c.fill(); }
      c.restore(); }
    if (fr < 170) requestAnimationFrame(step); else c.clearRect(0,0,W,H);
  })();
};

/* ---------- toast & modal ---------- */
Z.toast = function(msg, ms){
  const t = h('div',{class:'toast'}, msg); document.body.appendChild(t);
  setTimeout(()=>t.remove(), ms||2200);
};
Z.modal = function(content, buttons, opts){
  const ov = document.getElementById('overlay');
  ov.innerHTML = '';
  const box = h('div',{class:'modal'}, content);
  const close = ()=>{ ov.classList.remove('on'); ov.innerHTML=''; };
  if (buttons && buttons.length){
    const row = h('div',{class:'row',style:{justifyContent:'center',marginTop:'16px'}});
    for (const b of buttons) row.appendChild(h('button',{class:'btn '+(b.cls||''), onclick:()=>{ Z.sfx('click'); if(!b.keep) close(); b.fn && b.fn(); }}, b.t));
    box.appendChild(row);
  }
  ov.appendChild(box); ov.classList.add('on');
  ov.onclick = e => { if (e.target===ov && !(opts&&opts.lock)) close(); };
  return close;
};

/* ---------- mascot (Yulduzcha) ---------- */
Z.starSvg = function(size, mood){
  size = size||64;
  const smile = mood==='sad' ? 'M24 41 Q32 35 40 41' : 'M23 37 Q32 46 41 37';
  return h('div',{class:'star-m',style:{width:size+'px',height:size+'px'},html:
  `<svg viewBox="0 0 64 64" width="${size}" height="${size}"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE071"/><stop offset="1" stop-color="#FFB800"/></linearGradient></defs>
  <path d="M32 3 L40.5 21.5 L61 23.6 L45.6 37.4 L50 57.6 L32 47.2 L14 57.6 L18.4 37.4 L3 23.6 L23.5 21.5 Z" fill="url(#sg)" stroke="#E09B00" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="25" cy="30" r="3.4" fill="#2B2350"/><circle cx="39" cy="30" r="3.4" fill="#2B2350"/>
  <circle cx="26.2" cy="28.8" r="1.1" fill="#fff"/><circle cx="40.2" cy="28.8" r="1.1" fill="#fff"/>
  <circle cx="20" cy="37" r="3" fill="#FF8FA3" opacity=".6"/><circle cx="44" cy="37" r="3" fill="#FF8FA3" opacity=".6"/>
  <path d="${smile}" stroke="#2B2350" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`});
};
Z.mascot = function(text, mood){
  return h('div',{class:'mascot'}, Z.starSvg(64,mood), h('div',{class:'bubble'}, text));
};
Z.praise = ()=> Z.pick(['Barakalla! 🎉','Zo\'r! 🌟','Ofarin! 👏','Juda yaxshi! 💪','Aqlli bola! 🧠','Ajoyib! ✨','To\'ppa-to\'g\'ri! ✅','Qoyil! 🏆']);
Z.console = ()=> Z.pick(['Hechqisi yo\'q, keyingisida albatta topasan! 💪','Xato — bu o\'rganish yo\'li! 🌱','Diqqat bilan o\'qi, sen uddalaysan! 🔍','Yana bir urinib ko\'r! 🙂']);

/* ---------- level / rank ---------- */
Z.RANKS = [
  {xp:0, n:'Kichik yulduz', e:'⭐'},
  {xp:200, n:'Bilimdon', e:'📘'},
  {xp:600, n:'Zukko', e:'🧠'},
  {xp:1200, n:'Mantiq ustasi', e:'🧩'},
  {xp:2200, n:'Olim', e:'🔭'},
  {xp:3600, n:'Alloma', e:'🏛️'},
  {xp:5500, n:'Ulug\'bek vorisi', e:'🌌'},
  {xp:8000, n:'Prezident maktabi o\'quvchisi', e:'🎓'}
];
Z.levelInfo = function(xp){
  const lv = Math.floor(Math.sqrt(xp/40))+1;
  const cur = 40*(lv-1)*(lv-1), nxt = 40*lv*lv;
  let rank = Z.RANKS[0]; for (const r of Z.RANKS) if (xp >= r.xp) rank = r;
  return { lv, pct: Math.min(100, Math.round((xp-cur)/(nxt-cur)*100)), rank, toNext: nxt-xp };
};

/* ---------- streak (kunlik) ---------- */
Z.touchDay = function(){
  const S = Z.S, t = today();
  if (S.lastDay === t) return;
  const y = new Date(); y.setDate(y.getDate()-1);
  const ys = y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
  S.streak = (S.lastDay === ys) ? S.streak+1 : 1;
  S.bestStreak = Math.max(S.bestStreak||0, S.streak);
  S.lastDay = t;
  Z.save();
};
Z.DAILY = [
  {k:'answers', n:20, t:'20 ta to\'g\'ri javob', e:'✅'},
  {k:'lessons', n:2, t:'2 ta dars tugat', e:'📚'},
  {k:'games', n:2, t:'2 ta o\'yinda g\'alaba', e:'🎮'}
];
Z.daily = function(){
  const S = Z.S;
  if (S.daily.date !== today()) S.daily = {date:today(),answers:0,games:0,lessons:0,claimed:false};
  return S.daily;
};
Z.dailyAdd = function(k, n){
  const d = Z.daily(); d[k] = (d[k]||0) + (n||1);
  if (!d.claimed && Z.DAILY.every(x=>d[x.k]>=x.n)){
    d.claimed = true;
    setTimeout(()=>{ Z.sfx('win'); Z.confetti(200);
      Z.modal([h('div',{style:{fontSize:'70px'}},'🎁'), h('h2',null,'Kunlik vazifa bajarildi!'), h('p',null,'Sovg\'a: +100 tanga va +50 XP')],[{t:'Olish 🎉',cls:'grn',fn:()=>Z.reward(100,50)}]);
    }, 900);
  }
  Z.save();
};

/* ---------- rewards ---------- */
Z.reward = function(coins, xp, fromEl){
  const S = Z.S;
  coins = Math.round(coins||0); xp = Math.round(xp||0);
  const before = Z.levelInfo(S.xp).lv;
  S.coins += coins; S.xp += xp; Z.save();
  if (coins > 0){
    Z.sfx('coin');
    const target = document.querySelector('.pill.coin');
    if (fromEl && target){
      const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
      for (let i=0;i<Math.min(6,Math.ceil(coins/5));i++){
        const c = h('div',{class:'flycoin'},'🪙');
        c.style.left = (a.left+a.width/2+(Math.random()-.5)*40)+'px'; c.style.top = (a.top+a.height/2)+'px';
        document.body.appendChild(c);
        setTimeout(()=>{ c.style.left=(b.left+10)+'px'; c.style.top=(b.top+4)+'px'; c.style.opacity='.4'; }, 30+i*70);
        setTimeout(()=>c.remove(), 950+i*70);
      }
    }
  }
  Z.renderTop();
  const p = document.querySelector('.pill.coin'); if (p){ p.classList.remove('coinbump'); void p.offsetWidth; p.classList.add('coinbump'); }
  const after = Z.levelInfo(S.xp);
  if (after.lv > before){
    setTimeout(()=>{ Z.sfx('win'); Z.confetti(180);
      Z.modal([h('div',{style:{fontSize:'70px'}},'🚀'), h('h2',null,'Yangi daraja: '+after.lv+'!'), h('p',null,'Unvoning: '+after.rank.e+' '+after.rank.n), h('p',{class:'muted'},'Sovg\'a: +'+(after.lv*10)+' tanga')],[{t:'Davom etamiz!',cls:'grn',fn:()=>{S.coins+=after.lv*10;Z.save();Z.renderTop();}}]);
    }, 600);
  }
  Z.checkBadges();
};
Z.recordAnswer = function(topic, ok){
  const S = Z.S;
  const st = S.stats[topic] || (S.stats[topic] = {c:0,t:0});
  st.t++; if (ok) st.c++;
  S.totalAnswers++; if (ok){ S.totalCorrect++; Z.dailyAdd('answers'); }
  const d = today(); const hd = S.hist[d] || (S.hist[d] = {c:0,t:0}); hd.t++; if (ok) hd.c++;
  const keys = Object.keys(S.hist); if (keys.length > 60) delete S.hist[keys[0]];
  Z.save();
};
Z.gameWin = function(id, coins, xp, extra){
  const S = Z.S;
  const g = S.games[id] || (S.games[id] = {wins:0, plays:0});
  g.wins++; if (extra) Object.assign(g, extra(g)||{});
  Z.dailyAdd('games');
  Z.save();
  Z.sfx('win'); Z.confetti();
  Z.reward(coins, xp);
};
Z.gamePlay = function(id){ const g = Z.S.games[id] || (Z.S.games[id] = {wins:0, plays:0}); g.plays++; Z.save(); };
Z.spend = function(n){ if (Z.S.coins < n){ Z.toast('Tangalar yetarli emas 🪙'); Z.sfx('bad'); return false; } Z.S.coins -= n; Z.save(); Z.renderTop(); return true; };
Z.winModal = function(title, sub, coins, again, emoji){
  Z.modal([h('div',{style:{fontSize:'72px'}}, emoji||'🏆'), h('h2',null,title), sub?h('p',{class:'muted'},sub):null,
    coins?h('div',{class:'rw',style:{display:'flex',justifyContent:'center',gap:'8px'}}, h('span',{class:'pill coin'},'🪙 +'+coins)):null],
    [{t:'Yana o\'ynash 🔄',cls:'grn',fn:again},{t:'Chiqish',cls:'ghost',fn:()=>Z.nav.back()}]);
};

/* ---------- badges ---------- */
Z.BADGES = [
  {id:'first', e:'🌱', n:'Birinchi qadam', d:'Birinchi to\'g\'ri javob', ok:S=>S.totalCorrect>=1},
  {id:'c50', e:'🎯', n:'Mergan', d:'50 ta to\'g\'ri javob', ok:S=>S.totalCorrect>=50},
  {id:'c200', e:'🏹', n:'Snayper', d:'200 ta to\'g\'ri javob', ok:S=>S.totalCorrect>=200},
  {id:'c500', e:'🧠', n:'Daho', d:'500 ta to\'g\'ri javob', ok:S=>S.totalCorrect>=500},
  {id:'s3', e:'🔥', n:'Olovli', d:'3 kun ketma-ket o\'qish', ok:S=>S.bestStreak>=3},
  {id:'s7', e:'☄️', n:'Haftalik qahramon', d:'7 kun ketma-ket', ok:S=>S.bestStreak>=7},
  {id:'l5', e:'📚', n:'Kitobxon', d:'5 ta dars tugatish', ok:S=>S.lessons>=5},
  {id:'l25', e:'🎓', n:'A\'lochi', d:'25 ta dars tugatish', ok:S=>S.lessons>=25},
  {id:'ex1', e:'📝', n:'Imtihonchi', d:'Sinov imtihonini topshirish', ok:S=>S.exams.length>=1},
  {id:'ex5', e:'🏅', n:'Imtihon ustasi', d:'Imtihonda 5 baho olish', ok:S=>S.exams.some(e=>e.g===5)},
  {id:'rich', e:'💰', n:'Boyvachcha', d:'1000 tanga yig\'ish', ok:S=>S.coins>=1000},
  {id:'lv5', e:'🚀', n:'Raketa', d:'5-darajaga chiqish', ok:S=>Z.levelInfo(S.xp).lv>=5},
  {id:'lv10', e:'🌌', n:'Kosmonavt', d:'10-darajaga chiqish', ok:S=>Z.levelInfo(S.xp).lv>=10},
  {id:'sudoku', e:'🔢', n:'Sudoku ustasi', d:'5 ta sudoku yechish', ok:S=>(S.games.sudoku||{}).wins>=5},
  {id:'chess', e:'♞', n:'Shaxmatchi', d:'Kompyuterni shaxmatda yutish', ok:S=>(S.games.chess||{}).wins>=1},
  {id:'checkers', e:'⛀', n:'Shashkachi', d:'Kompyuterni shashkada yutish', ok:S=>(S.games.checkers||{}).wins>=1},
  {id:'tangram', e:'🔷', n:'Tangramchi', d:'5 ta tangram yig\'ish', ok:S=>(S.games.tangram||{}).wins>=5},
  {id:'set', e:'🃏', n:'SET ovchisi', d:'SET o\'yinini yutish', ok:S=>(S.games.set||{}).wins>=1},
  {id:'gamer', e:'🎮', n:'O\'yinchi', d:'8 xil o\'yinda g\'alaba', ok:S=>Object.values(S.games).filter(g=>g.wins>0).length>=8},
  {id:'eng', e:'🇬🇧', n:'English star', d:'Ingliz tilidan 100 to\'g\'ri javob', ok:S=>Object.keys(S.stats).filter(k=>k.startsWith('en_')).reduce((a,k)=>a+S.stats[k].c,0)>=100},
  {id:'logic', e:'🦉', n:'Donishmand boyo\'g\'li', d:'Mantiqdan 100 to\'g\'ri javob', ok:S=>Object.keys(S.stats).filter(k=>k.startsWith('lg_')).reduce((a,k)=>a+S.stats[k].c,0)>=100},
  {id:'math', e:'➗', n:'Matematik', d:'Matematikadan 150 to\'g\'ri javob', ok:S=>Object.keys(S.stats).filter(k=>k.startsWith('m_')).reduce((a,k)=>a+S.stats[k].c,0)>=150}
];
Z.checkBadges = function(){
  const S = Z.S;
  for (const b of Z.BADGES){
    if (!S.badges.includes(b.id) && b.ok(S)){
      S.badges.push(b.id); Z.save();
      setTimeout(()=>{ Z.sfx('win'); Z.toast('Yangi nishon: '+b.e+' '+b.n+'! (+30 🪙)', 3000); S.coins+=30; Z.save(); Z.renderTop(); }, 400);
    }
  }
};

/* ---------- shop items ---------- */
Z.AVATARS = [
  ['🦁',0],['🐯',0],['🐼',0],['🐰',0],['🐻',60],['🦊',60],['🐨',60],['🐸',60],['🐵',80],['🐧',80],['🦉',100],['🐢',100],
  ['🦄',150],['🐲',200],['🦖',200],['🐬',150],['🦅',150],['🐝',120],['🦋',120],['🐙',150],['🤖',250],['👨‍🚀',300],['🧙',300],['🦸',350],['🥷',350],['👑',500]
];
Z.THEMES = [
  {id:'', n:'Quyoshli', e:'☀️', p:0},
  {id:'theme-ocean', n:'Okean', e:'🌊', p:150},
  {id:'theme-forest', n:'O\'rmon', e:'🌳', p:150},
  {id:'theme-candy', n:'Shirinlik', e:'🍭', p:200},
  {id:'theme-space', n:'Koinot (tun)', e:'🌌', p:300}
];
Z.applyTheme = function(){ document.body.className = Z.S.theme || ''; };

/* ---------- navigation ---------- */
const stack = [];
let cleanup = null;
Z.nav = {
  go(title, render, opts){
    stack.push({title, render, opts:opts||{}});
    Z.nav._show();
  },
  root(title, render){ stack.length = 0; Z.nav.go(title, render, {root:true}); },
  back(){
    if (stack.length > 1){ stack.pop(); Z.nav._show(); }
  },
  replace(title, render, opts){ stack.pop(); Z.nav.go(title, render, opts); },
  refresh(){ Z.nav._show(); },
  _show(){
    if (cleanup){ try{cleanup();}catch(e){} cleanup = null; }
    Z.clearIntervals();
    try{ speechSynthesis.cancel(); }catch(e){}
    const top = stack[stack.length-1];
    const app = document.getElementById('app'); app.innerHTML = '';
    document.getElementById('overlay').classList.remove('on');
    Z.renderTop();
    const r = top.render(app);
    if (typeof r === 'function') cleanup = r;
    window.scrollTo(0,0);
  },
  depth(){ return stack.length; }
};
Z.renderTop = function(){
  const tb = document.getElementById('topbar'); if (!tb) return;
  const S = Z.S; const top = stack[stack.length-1];
  tb.innerHTML = '';
  const bar = h('div',{class:'tb'});
  if (stack.length > 1) bar.appendChild(h('button',{class:'back',onclick:()=>{Z.sfx('click');Z.nav.back();},'aria-label':'Orqaga'},'‹'));
  else bar.appendChild(h('div',{style:{fontSize:'28px'}},'⭐'));
  bar.appendChild(h('div',{class:'ttl'}, top ? top.title : 'Zukko'));
  bar.appendChild(h('span',{class:'pill fire',title:'Kunlik seriya'},h('span',{class:'ic'},'🔥'), S.streak||0));
  bar.appendChild(h('span',{class:'pill coin',title:'Tangalar'},h('span',{class:'ic'},'🪙'), S.coins));
  bar.appendChild(h('span',{class:'pill xp',title:'Daraja'},h('span',{class:'ic'},'⚡'), Z.levelInfo(S.xp).lv));
  tb.appendChild(bar);
};

/* timer helper that auto-stops on navigation */
Z.interval = function(fn, ms){ const id = setInterval(fn, ms); Z._ints = Z._ints||[]; Z._ints.push(id); return id; };
Z.clearIntervals = function(){ (Z._ints||[]).forEach(clearInterval); Z._ints = []; };
Z.fmtTime = s => { s = Math.max(0,Math.floor(s)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };

})();

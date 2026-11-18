// Nouveaux types d'énigmes : calcul en images, bidons, traversée, miroirs, balance, statues, relief,
// onde radio, anagramme, picross, binaire, code couleur, mémoire, labyrinthe, et clavier du sas.
(() => {
  'use strict';
  const K = window.GameKit, LG = window.Logic, { rand, shuffle } = LG;
  const W = K.W, $ = K.$;
  const G = () => K.G, L = () => K.L(), tr = (k, v) => K.tr(k, v);
  const lvl = () => K.G.lvl;
  const box = () => $('#pzb');
  const done = p => K.api.solved(p.id);
  const ROMAN = n => { let s = ''; [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } }); return s; };

  // ---------- Calcul en images ----------
  W.algebra = {
    init(p, d) {
      const lv = lvl(), max = [6, 9, 9][lv];
      for (;;) {
        const [x, y, z] = shuffle([...Array(max).keys()].map(i => i + 1)).slice(0, 3);
        let lines, q, ans;
        if (lv < 2) { lines = [['A+A+A', 3 * x], ['A+B+B', x + 2 * y], ['B+C+C', y + 2 * z]]; q = lv ? 'C+A×B' : 'A+B+C'; ans = lv ? z + x * y : x + y + z; }
        else { lines = [['A+A+A', 3 * x], ['A×B+B', x * y + y], ['B×C−A', y * z - x]]; q = 'C×C+A−B'; ans = z * z + x - y; if (y * z - x < 0 || ans < 0) continue; }
        Object.assign(p, { lines, q, ans, x, e: d.icons || ['🍎', '🍌', '🍐'] }); return;
      }
    },
    render(p) {
      const tok = s => [...s].map(ch => ({ A: 0, B: 1, C: 2 })[ch] != null ? `<span class="em">${p.e[{ A: 0, B: 1, C: 2 }[ch]]}</span>` : `<i>${ch}</i>`).join('');
      box().innerHTML = `<div class="alg">${p.lines.map(([s, v]) => `<div>${tok(s)}<i>=</i><b>${v}</b></div>`).join('')}<div class="qq">${tok(p.q)}<i>=</i><b>?</b></div></div>` + K.inputRow('number');
      K.bindInput(v => /^\s*\d+\s*$/.test(v) && +v === p.ans, p);
    },
    hint: p => tr('algH', { x: p.e[0], v: p.x })
  };

  // ---------- Bidons d'eau ----------
  W.jugs = {
    init(p) { Object.assign(p, LG.genJugs([8, 10, 13][lvl()], [4, 6, 8][lvl()])); p.s = [0, 0]; },
    act(p, mv) {
      const [x, y] = p.s, a = p.a, b = p.b, p1 = Math.min(x, b - y), p2 = Math.min(y, a - x);
      p.s = { fA: [a, y], fB: [x, b], eA: [0, y], eB: [x, 0], pAB: [x - p1, y + p1], pBA: [x + p2, y - p2] }[mv];
      K.beep(mv[0] === 'f' ? 300 : mv[0] === 'e' ? 200 : 420, .15, 'sine', .08);
      W.jugs.render(p);
      if (p.s.includes(p.t)) setTimeout(() => K.solve(p), 500);
    },
    render(p) {
      const jug = (k, cap, v) => `<div class="jug"><div class="jbody" style="height:${60 + cap / p.b * 150}px"><div class="water" style="height:${v / cap * 100}%"></div><span>${v} / ${cap} L</span></div>
        <div class="jbtn"><button class="btn" data-m="f${k}">${tr('fill')}</button><button class="btn" data-m="e${k}">${tr('empty')}</button><button class="btn" data-m="${k === 'A' ? 'pAB' : 'pBA'}">${tr('pour')}</button></div></div>`;
      box().innerHTML = `<p class="goal">🎯 ${tr('goalL', { t: p.t })}</p><div class="jugs">${jug('A', p.a, p.s[0])}${jug('B', p.b, p.s[1])}</div><div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('[data-m]').forEach(b => { b.onclick = () => W.jugs.act(p, b.dataset.m); });
      $('#rs').onclick = () => { p.s = [0, 0]; W.jugs.render(p); };
    },
    hint: p => { const path = LG.jugsBFS(p.a, p.b, p.s, p.t); return path && path.length ? tr('nextStep', { x: L().jugMoves[path[0]] }) : ''; }
  };

  // ---------- Traversée ----------
  const RIV = ['🧑‍✈️', '🐈', '🐦', '🍚'];
  W.river = {
    init(p) { p.s = 0; p.boat = 0; p.n = 0; p.max = [0, 7, 7][lvl()]; },
    render(p) {
      const me = p.s & 1, side = b => (p.s >> b) & 1;
      const bank = sd => `<div class="bank${me === sd ? ' here' : ''}"><h4>${sd ? tr('bankR') : tr('bankL')}</h4><div class="items">${[1, 2, 3].filter(b => side(b) === sd && p.boat !== b).map(b => `<button class="ri" data-b="${b}" ${me !== sd ? 'disabled' : ''}>${RIV[b]}</button>`).join('')}</div></div>`;
      box().innerHTML = `<div class="river">${bank(0)}<div class="water2"><div class="dinghy ${me ? 'r' : 'l'}">${RIV[0]}${p.boat ? `<button class="ri" data-b="${p.boat}">${RIV[p.boat]}</button>` : ''}</div></div>${bank(1)}</div>
        ${p.max ? `<p class="cnt">${tr('crossings', { n: p.n, m: p.max })}</p>` : ''}<div class="row"><button class="btn gold" id="cross">${tr('cross')}</button><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.ri').forEach(b => { b.onclick = () => { const it = +b.dataset.b; p.boat = p.boat === it ? 0 : it; K.beep(500, .05, 'triangle', .06); W.river.render(p); }; });
      $('#rs').onclick = () => { W.river.init(p); W.river.render(p); };
      $('#cross').onclick = () => {
        let n2 = p.s ^ 1; if (p.boat) n2 ^= 1 << p.boat;
        p.n++; K.beep(220, .3, 'sine', .08);
        if (LG.riverBad(n2)) {
          const sd = b => (n2 >> b) & 1, msg = sd(1) === sd(2) && sd(1) !== (n2 & 1) ? tr('eatBird') : tr('eatRice');
          W.river.init(p); W.river.render(p); K.fail(msg); return;
        }
        p.s = n2; p.boat = 0;
        if (p.s === 15) { W.river.render(p); setTimeout(() => K.solve(p), 500); return; }
        if (p.max && p.n >= p.max) { W.river.init(p); W.river.render(p); K.fail(tr('tooMany')); return; }
        W.river.render(p);
      };
    },
    hint: p => { const path = LG.riverBFS(p.s ^ 0); return path && path.length ? tr('nextStep', { x: L().riverNames[path[0]] }) : ''; }
  };

  // ---------- Miroirs ----------
  W.mirror = {
    init(p) { const lv = lvl(); p.M = LG.genMirror([5, 6, 7][lv], [2, 3, 4][lv], [1, 3, 4][lv], [0, 2, 3][lv]); },
    render(p) {
      const { n, cells, sr } = p.M, tr2 = LG.traceBeam(p.M);
      if (p.hl >= 2 && (p.tip == null || cells[p.tip].o === cells[p.tip].sol)) p.tip = cells.findIndex(c => c.path && c.o !== c.sol);
      const pts = tr2.pts.map(([r, c]) => `${(c + .5).toFixed(2)},${(r + .5).toFixed(2)}`).join(' ');
      box().innerHTML = `<div class="mirwrap"><span class="sun" style="top:${(sr + .5) * 100 / n}%">☀️</span><div class="mirgrid" style="--n:${n}">
        ${cells.map((c, i) => `<button class="mc2 ${c.t}${p.tip === i && p.hl >= 2 ? ' tip' : ''}" data-i="${i}" ${c.t === 'm' ? '' : 'disabled'}>${c.t === 'm' ? `<i style="transform:rotate(${c.o ? 45 : -45}deg)"></i>` : c.t === 'x' ? '🪨' : c.t === 'g' ? '👁️' : ''}</button>`).join('')}
        <svg viewBox="0 0 ${n} ${n}" preserveAspectRatio="none"><polyline points="${pts}" class="${tr2.hit ? 'hit' : ''}"/></svg></div></div>`;
      box().querySelectorAll('.mc2.m').forEach(b => { b.onclick = () => { const c = cells[+b.dataset.i]; c.o ^= 1; K.beep(640, .04, 'triangle', .06); W.mirror.render(p); if (LG.traceBeam(p.M).hit) setTimeout(() => K.solve(p), 700); }; });
    },
    hint: () => tr('mirH')
  };

  // ---------- Balance ----------
  W.weights = {
    init(p) {
      const lv = lvl(), m = [6, 7, 8][lv], maxW = [12, 15, 20][lv];
      p.ws = shuffle([...Array(maxW).keys()].map(i => i + 1)).slice(0, m);
      const k = lv ? [0, 3, 4][lv] : 2 + rand(2);
      p.sol = shuffle([...Array(m).keys()]).slice(0, k); p.T = p.sol.reduce((s, i) => s + p.ws[i], 0); p.k = lv ? k : 0; p.sel = [];
    },
    lab: (p, v) => lvl() === 2 ? ROMAN(v) : String(v),
    render(p) {
      const sum = p.sel.reduce((s, i) => s + p.ws[i], 0), ang = Math.max(-16, Math.min(16, (sum - p.T) * 2.5));
      box().innerHTML = `<p class="goal">⚖️ ${tr('target', { t: W.weights.lab(p, p.T) })}${p.k ? ' — ' + tr('pickK', { k: p.k }) : ''}</p>
        <div class="scale"><div class="beam" style="transform:rotate(${ang}deg)"><div class="pan l" style="transform:rotate(${-ang}deg)"><span>🗿</span><b>${W.weights.lab(p, p.T)}</b></div><div class="pan r" style="transform:rotate(${-ang}deg)">${p.sel.map(i => `<em>${W.weights.lab(p, p.ws[i])}</em>`).join('')}</div></div><div class="post"></div></div>
        <div class="stones">${p.ws.map((v, i) => `<button class="stone${p.sel.includes(i) ? ' on' : ''}" data-i="${i}">${W.weights.lab(p, v)}</button>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.stone').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.sel = p.sel.includes(i) ? p.sel.filter(x => x !== i) : p.sel.concat(i); K.beep(260, .08, 'triangle', .08); W.weights.render(p); }; });
      $('#ok').onclick = () => { const s = p.sel.reduce((a, i) => a + p.ws[i], 0); if (s === p.T && (!p.k || p.sel.length === p.k)) K.solve(p); else K.fail(); };
    },
    hint: p => tr('stoneH', { x: W.weights.lab(p, p.ws[p.sol[0]]) })
  };

  // ---------- Regard des statues ----------
  const NESW = ['N', 'E', 'S', 'W'];
  W.facing = {
    init(p) { const t = G().v.face.tgt; p.d = t.map(x => (x + 1 + rand(3)) % 4); },
    render(p) {
      const g = G(), B = g.v.beasts;
      if (!g.f.doc_camp) { box().innerHTML = `<p class="cnt">${tr('noLegend')}</p>`; return; }
      box().innerHTML = `<ul class="clues">${g.v.faceClues(g).map(c => `<li>${K.esc(c)}</li>`).join('')}</ul><p class="cnt">N ↑ · ${tr('turn')}</p>
        <div class="seq idols">${B.map((b, i) => `<button class="idol" data-i="${i}"><b>${b.i}</b><span>${K.esc(K.X(b.n))}</span><em style="transform:rotate(${p.d[i] * 90}deg)">⬆</em></button>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.idol').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.d[i] = (p.d[i] + 1) % 4; K.beep(180, .12, 'square', .05); b.querySelector('em').style.transform = `rotate(${p.d[i] * 90}deg)`; }; });
      $('#ok').onclick = () => { if (p.d.every((x, i) => x === g.v.face.tgt[i])) K.solve(p); else K.fail(); };
    },
    hint: () => { const g = G(); return tr('faceH', { b: K.X(g.v.beasts[0].n), d: L().dirArrow[NESW[g.v.face.tgt[0]]] }); }
  };

  // ---------- Relief à faire pivoter ----------
  W.rotimg = {
    init(p, d) {
      p.n = [3, 3, 4][lvl()]; do { p.r = Array.from({ length: p.n * p.n }, () => rand(4)); } while (p.r.filter(Boolean).length < p.n);
      p.c = p.r.slice(); p.img = K.slideImage(d.img, null); p.full = K.slideImage(d.img, G().code[d.dig]);
    },
    render(p) {
      const n = p.n;
      if (p.hl >= 2 && (p.tip == null || p.r[p.tip] === 0)) p.tip = p.r.findIndex(x => x);
      box().innerHTML = `<div class="slide rot" style="--n:${n}">${p.r.map((v, i) => `<button class="tile${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}" style="left:${(i % n) * 100 / n}%;top:${Math.floor(i / n) * 100 / n}%"><div style="transform:rotate(${p.c[i] * 90}deg);background-image:url(${p.img});background-size:${n * 100}%;background-position:${(i % n) * 100 / (n - 1)}% ${Math.floor(i / n) * 100 / (n - 1)}%"></div></button>`).join('')}</div>`;
      box().querySelectorAll('.tile').forEach(b => {
        b.onclick = () => {
          const i = +b.dataset.i; p.r[i] = (p.r[i] + 1) % 4; p.c[i]++; b.firstElementChild.style.transform = `rotate(${p.c[i] * 90}deg)`; K.beep(240, .05, 'square', .05);
          if (p.r.every(x => x === 0)) setTimeout(() => { box().querySelector('.slide').innerHTML = `<img src="${p.full}" alt="">`; setTimeout(() => K.solve(p), 700); }, 250);
        };
      });
    },
    hint: () => tr('rotH')
  };

  // ---------- Onde radio ----------
  W.wave = {
    init(p) { const lv = lvl(); p.ta = 1 + rand(5); p.tf = 1 + rand(6); p.tp = lv === 2 ? rand(4) : 0; p.a = p.ta === 3 ? 2 : 3; p.f = p.tf === 3 ? 4 : 3; p.ph = 0; p.seed = rand(1000); },
    draw(p) {
      const cv = $('#scope'); if (!cv) return; const c = cv.getContext('2d'), w = cv.width, h = cv.height, lv = lvl();
      c.fillStyle = '#03140d'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(80,255,150,.12)'; c.lineWidth = 1;
      for (let x = 0; x <= w; x += w / 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += h / 6) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      const curve = (A, F, P, noise, col, dash) => { c.strokeStyle = col; c.lineWidth = 3; c.setLineDash(dash); c.beginPath(); for (let x = 0; x <= w; x += 3) { const n = noise ? (Math.sin(x * .37 + p.seed) * Math.sin(x * .11) * 5) : 0; const y = h / 2 - A * (h / 12) * Math.sin(2 * Math.PI * F * x / w + P * Math.PI / 2) + n; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]); };
      curve(p.ta, p.tf, p.tp, lv > 0, '#ffab40', [8, 6]); curve(p.a, p.f, p.ph, false, '#62ffa6', []);
    },
    render(p) {
      const sl = (k, lab, max) => `<label class="sl">${lab} <input type="range" min="${k === 'ph' ? 0 : 1}" max="${max}" step="1" value="${p[k]}" data-k="${k}"><b>${p[k]}</b></label>`;
      box().innerHTML = `<canvas id="scope" width="600" height="200"></canvas><div class="sliders">${sl('a', tr('amp'), 5)}${sl('f', tr('freq'), 6)}${lvl() === 2 ? sl('ph', tr('phase'), 3) : ''}</div><p class="cnt" id="wst"></p>`;
      box().querySelectorAll('input[type=range]').forEach(inp => {
        inp.oninput = () => {
          p[inp.dataset.k] = +inp.value; inp.nextElementSibling.textContent = inp.value; W.wave.draw(p); K.beep(300 + p.f * 80, .03, 'sine', .04);
          if (p.a === p.ta && p.f === p.tf && p.ph === p.tp && !p.lock) { p.lock = 1; $('#wst').textContent = tr('waveOk'); setTimeout(() => K.solve(p), 700); }
        };
      });
      W.wave.draw(p);
    },
    hint: p => tr('waveH', { x: p.tf })
  };

  // ---------- Anagramme ----------
  W.anagram = {
    sync(p) { const w = K.norm(p.def.word(G())); if (p.w !== w) { p.w = w; do { p.perm = shuffle([...w].map((_, i) => i)); } while (p.perm.every((v, i) => v === i)); p.pick = []; } return w; },
    render(p) {
      const w = W.anagram.sync(p);
      box().innerHTML = `<div class="ana slots">${[...w].map((_, i) => `<span class="${p.pick[i] != null ? 'on' : ''}" data-i="${i}">${p.pick[i] != null ? w[p.perm[p.pick[i]]] : ''}</span>`).join('')}</div>
        <div class="ana tiles">${p.perm.map((k, j) => `<button data-j="${j}" ${p.pick.includes(j) ? 'disabled' : ''}>${w[k]}</button>`).join('')}</div>
        <div class="row"><button class="btn" id="rs">${tr('clear')}</button></div>`;
      box().querySelectorAll('.tiles button').forEach(b => {
        b.onclick = () => {
          p.pick.push(+b.dataset.j); K.beep(560 + p.pick.length * 40, .05, 'triangle', .06);
          if (p.pick.length === w.length) { const got = p.pick.map(j => w[p.perm[j]]).join(''); if (got === w) { W.anagram.render(p); setTimeout(() => K.solve(p), 400); return; } p.pick = []; W.anagram.render(p); K.fail(); return; }
          W.anagram.render(p);
        };
      });
      box().querySelectorAll('.slots span').forEach(s => { s.onclick = () => { p.pick = p.pick.slice(0, +s.dataset.i); W.anagram.render(p); }; });
      $('#rs').onclick = () => { p.pick = []; W.anagram.render(p); };
    },
    hint: p => tr('first', { x: K.norm(p.def.word(G()))[0] })
  };

  // ---------- Picross ----------
  W.nonogram = {
    init(p, d) {
      p.n = 5; p.sol = LG.DIG5[G().code[d.dig]].join('').split('').map(Number); p.g = Array(25).fill(0); p.mk = Array(25).fill(0);
      p.lock = shuffle(p.sol.map((v, i) => v ? i : -1).filter(i => i >= 0)).slice(0, [6, 2, 0][lvl()]); p.lock.forEach(i => { p.g[i] = 1; });
      p.cl = LG.nonoClues(p.sol, 5);
    },
    render(p) {
      const n = p.n;
      if (p.hl >= 2 && (p.tip == null || p.g[p.tip])) p.tip = p.sol.findIndex((v, i) => v && !p.g[i]);
      box().innerHTML = `<table class="nono"><tr><td></td>${p.cl.cols.map(c => `<th>${c.join('<br>')}</th>`).join('')}</tr>${Array.from({ length: n }, (_, r) => `<tr><th class="rh">${p.cl.rows[r].join(' ')}</th>${Array.from({ length: n }, (_, c) => { const i = r * n + c; return `<td><button class="nc${p.g[i] ? ' on' : ''}${p.mk[i] ? ' mk' : ''}${p.lock.includes(i) ? ' lk' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}"></button></td>`; }).join('')}</tr>`).join('')}</table>`;
      box().querySelectorAll('.nc').forEach(b => {
        const i = +b.dataset.i;
        b.onclick = () => {
          if (p.lock.includes(i)) return; p.g[i] ^= 1; p.mk[i] = 0; K.beep(p.g[i] ? 520 : 380, .04, 'square', .05);
          const now = LG.nonoClues(p.g, n);
          if (JSON.stringify(now) === JSON.stringify(p.cl)) { W.nonogram.render(p); box().querySelector('.nono').classList.add('win'); setTimeout(() => K.solve(p), 900); } else W.nonogram.render(p);
        };
        b.oncontextmenu = e => { e.preventDefault(); if (p.lock.includes(i)) return; p.mk[i] ^= 1; if (p.mk[i]) p.g[i] = 0; W.nonogram.render(p); };
      });
    },
    hint: () => tr('nonoH')
  };

  // ---------- Disjoncteurs binaires ----------
  W.binary = {
    init(p) { const b = [4, 6, 8][lvl()]; p.b = b; do { p.t = 3 + rand((1 << b) - 3); } while (p.t.toString(2).split('1').length - 1 < 2); p.on = Array(b).fill(0); },
    render(p) {
      const lv = lvl(), val = i => 1 << (p.b - 1 - i), cur = p.on.reduce((s, v, i) => s + (v ? val(i) : 0), 0);
      box().innerHTML = `<p class="goal">⚡ ${tr('binTarget', { t: p.t })}</p><div class="bins">${p.on.map((v, i) => `<button class="bin${v ? ' on' : ''}" data-i="${i}"><i></i><span>${lv === 0 || (lv === 1 && i >= p.b - 2) ? val(i) : ''}</span></button>`).join('')}</div>
        ${lv === 0 ? `<p class="cnt">${tr('binVal', { v: cur })}</p>` : ''}<div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.bin').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.on[i] ^= 1; K.beep(p.on[i] ? 700 : 350, .05, 'square', .05); W.binary.render(p); }; });
      $('#ok').onclick = () => { if (p.on.reduce((s, v, i) => s + (v ? val(i) : 0), 0) === p.t) K.solve(p); else K.fail(); };
    },
    hint: p => { let v = 1; while (v * 2 <= p.t) v *= 2; return tr('binH', { x: v }); }
  };

  // ---------- Code couleur (Mastermind) ----------
  const MM = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];
  W.master = {
    init(p) {
      const lv = lvl(); p.L = [3, 4, 4][lv]; p.k = [4, 5, 6][lv]; p.max = [10, 9, 8][lv];
      p.code = lv ? Array.from({ length: p.L }, () => rand(p.k)) : shuffle([...Array(p.k).keys()]).slice(0, p.L); p.hist = []; p.cur = [];
    },
    score(a, b) { let ex = 0; const ca = {}, cb = {}; a.forEach((v, i) => { if (v === b[i]) ex++; else { ca[v] = (ca[v] || 0) + 1; cb[b[i]] = (cb[b[i]] || 0) + 1; } }); let mis = 0; for (const k in ca) mis += Math.min(ca[k], cb[k] || 0); return [ex, mis]; },
    render(p) {
      box().innerHTML = `<p class="cnt">${tr('mmLegend')}</p><div class="mm">${p.hist.map(([g, e, m]) => `<div class="mrow">${g.map(v => `<span>${MM[v]}</span>`).join('')}<em>${'●'.repeat(e) + '○'.repeat(m) || '—'}</em></div>`).join('')}
        <div class="mrow cur">${Array.from({ length: p.L }, (_, i) => `<span>${p.cur[i] != null ? MM[p.cur[i]] : '·'}</span>`).join('')}</div></div>
        <div class="row">${MM.slice(0, p.k).map((s, i) => `<button class="btn sym" data-v="${i}">${s}</button>`).join('')}<button class="btn" id="er">${tr('erase')}</button></div>
        <p class="cnt">${tr('triesLeft', { n: p.max - p.hist.length })}</p><div class="row"><button class="btn gold" id="ok" ${p.cur.length < p.L ? 'disabled' : ''}>${tr('tryIt')}</button></div>`;
      box().querySelectorAll('.sym').forEach(b => { b.onclick = () => { if (p.cur.length < p.L) { p.cur.push(+b.dataset.v); K.beep(400 + p.cur.length * 60, .05, 'triangle', .06); W.master.render(p); } }; });
      $('#er').onclick = () => { p.cur.pop(); W.master.render(p); };
      $('#ok').onclick = () => {
        const [e, m] = W.master.score(p.cur, p.code); p.hist.push([p.cur, e, m]); p.cur = [];
        if (e === p.L) { W.master.render(p); setTimeout(() => K.solve(p), 500); return; }
        if (p.hist.length >= p.max) { W.master.init(p); W.master.render(p); K.fail(tr('mmLost')); return; }
        W.master.render(p);
      };
    },
    hint: p => tr('mmH', { x: MM[p.code[0]] })
  };

  // ---------- Mémoire ----------
  const MEM = ['🚀', '🛰️', '🌍', '🌙', '⭐', '☄️', '👩‍🚀', '🪐', '🔭', '🌌'];
  W.memory = {
    init(p) { const lv = lvl(), P = [6, 8, 10][lv]; p.cols = [4, 4, 5][lv]; p.deck = shuffle(MEM.slice(0, P).flatMap(x => [x, x])); p.open = []; p.ok = []; p.err = 0; p.max = [0, 0, 14][lv]; p.busy = false; },
    render(p) {
      box().innerHTML = `<div class="memg" style="grid-template-columns:repeat(${p.cols},1fr)">${p.deck.map((s, i) => { const up = p.open.includes(i) || p.ok.includes(i) || p.peek; return `<button class="mem${up ? ' up' : ''}${p.ok.includes(i) ? ' ok' : ''}" data-i="${i}"><span>${up ? s : ''}</span></button>`; }).join('')}</div>
        ${p.max ? `<p class="cnt">${tr('errors', { n: p.err, m: p.max })}</p>` : ''}`;
      box().querySelectorAll('.mem').forEach(b => {
        b.onclick = () => {
          const i = +b.dataset.i; if (p.busy || p.open.includes(i) || p.ok.includes(i)) return;
          p.open.push(i); K.beep(600, .04, 'triangle', .06); W.memory.render(p);
          if (p.open.length < 2) return;
          const [a, c] = p.open;
          if (p.deck[a] === p.deck[c]) { p.ok.push(a, c); p.open = []; K.beep(880, .1, 'triangle', .08); W.memory.render(p); if (p.ok.length === p.deck.length) setTimeout(() => K.solve(p), 500); return; }
          p.err++; p.busy = true;
          setTimeout(() => { p.open = []; p.busy = false; if (p.max && p.err > p.max) { W.memory.init(p); W.memory.render(p); K.fail(tr('memLost')); } else if (box()) W.memory.render(p); }, 750);
        };
      });
    },
    onHint2(p) { p.peek = true; setTimeout(() => { p.peek = false; if (box() && G().modal && G().modal.id === p.id) W.memory.render(p); }, 1500); }
  };

  // ---------- Labyrinthe ----------
  W.maze = {
    init(p) { const lv = lvl(); p.M = LG.genMaze([6, 8, 10][lv]); p.pos = 0; p.fog = lv === 2; },
    move(p, d) {
      if (done(p)) return; const { n, w } = p.M;
      if (w[p.pos] & (1 << d)) { K.beep(120, .06, 'square', .05); return; }
      p.pos += [-n, 1, n, -1][d]; K.beep(500, .03, 'sine', .05); W.maze.render(p);
      if (p.pos === p.M.goal) setTimeout(() => K.solve(p), 300);
    },
    path(p) {
      const { n, w } = p.M, prev = new Map([[p.pos, -1]]), q = [p.pos];
      while (q.length) { const i = q.shift(); if (i === p.M.goal) break; for (let d = 0; d < 4; d++) { if (w[i] & (1 << d)) continue; const j = i + [-n, 1, n, -1][d]; if (!prev.has(j)) { prev.set(j, i); q.push(j); } } }
      const out = []; let k = p.M.goal; while (k !== -1 && k != null) { out.push(k); k = prev.get(k); } return out;
    },
    render(p) {
      const { n, w } = p.M, r0 = Math.floor(p.pos / n), c0 = p.pos % n, trail = p.trail || [];
      box().innerHTML = `<div class="maze" style="--n:${n}">${w.map((v, i) => { const r = Math.floor(i / n), c = i % n, fog = p.fog && Math.abs(r - r0) + Math.abs(c - c0) > 2;
        return `<div class="mz${fog ? ' fog' : ''}${trail.includes(i) ? ' trail' : ''}" style="border-top-width:${v & 1 ? 3 : 0}px;border-right-width:${v & 2 ? 3 : 0}px;border-bottom-width:${v & 4 ? 3 : 0}px;border-left-width:${v & 8 ? 3 : 0}px">${i === p.pos ? '🤖' : i === p.M.goal && !fog ? '🧪' : ''}</div>`; }).join('')}</div>
        <div class="pad4"><button class="btn" data-d="0">▲</button><div><button class="btn" data-d="3">◀</button><button class="btn" data-d="2">▼</button><button class="btn" data-d="1">▶</button></div></div><p class="cnt">${tr('mazeH')}</p>`;
      box().querySelectorAll('.pad4 button').forEach(b => { b.onclick = () => W.maze.move(p, +b.dataset.d); });
    },
    onHint2(p) { p.trail = W.maze.path(p); setTimeout(() => { p.trail = null; if (box() && G().modal && G().modal.id === p.id) W.maze.render(p); }, 2500); }
  };

  // ---------- Clavier numérique du sas (verrou final de la station) ----------
  W.keypad = {
    buf: '',
    render() {
      const g = G();
      $('#mb').innerHTML = `<p class="ins">${tr('lockI')}</p><div class="plate">${tr('order')} : ${g.perm.map(s => `<b>${s}</b>`).join(' – ')}</div>
        <div class="kp"><div class="kdisp">${K.SYM.map((_, i) => `<span>${W.keypad.buf[i] ?? '_'}</span>`).join('')}</div>
        <div class="kgrid">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⏎'].map(k => `<button class="btn" data-k="${k}">${k}</button>`).join('')}</div></div><div id="fb"></div>`;
      $('#mb').querySelectorAll('.kgrid button').forEach(b => { b.onclick = () => W.keypad.key(b.dataset.k); });
    },
    key(k) {
      const g = G();
      if (k === 'C') W.keypad.buf = '';
      else if (k === '⏎') {
        if (!K.SYM.every(s => g.found[s])) { K.sfx.bad(); $('#fb').textContent = tr('lockMissing'); return; }
        if (W.keypad.buf === g.perm.map(s => g.code[s]).join('')) { W.keypad.buf = ''; K.win(); return; }
        W.keypad.buf = ''; W.keypad.render(); K.fail(tr('wrongCode')); return;
      } else if (W.keypad.buf.length < K.SYM.length) { W.keypad.buf += k; K.beep(700 + +k * 30, .06, 'square', .05); }
      W.keypad.render();
    }
  };
})();

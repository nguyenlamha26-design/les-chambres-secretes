// Logique pure des énigmes (utilisable dans le navigateur et dans Node pour les tests)
(function (root) {
  'use strict';
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- Morse ----------
  const MC = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----' };
  // Séquence [allumé, durée en unités] : point 1, trait 3, pause 1, entre lettres 3, fin 9
  function morseSeq(word) {
    const seq = [];
    [...word].forEach((ch, i) => {
      [...MC[ch]].forEach((s, j) => { seq.push([1, s === '.' ? 1 : 3]); if (j < MC[ch].length - 1) seq.push([0, 1]); });
      seq.push([0, i < word.length - 1 ? 3 : 9]);
    });
    return seq;
  }
  function morseOn(seq, unit, ms) {
    const total = seq.reduce((s, x) => s + x[1], 0);
    let x = (ms / unit) % total;
    for (const [on, d] of seq) { if (x < d) return on; x -= d; }
    return 0;
  }

  // ---------- La carte secrète (A connaît la valeur, B le symbole) ----------
  const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  function solveCards(S) {
    const cnt = r => S.filter(c => c.r === r).length;
    const suit = s => S.filter(c => c.s === s);
    // A : « je ne sais pas » -> la valeur n'est pas unique
    const c1 = S.filter(c => cnt(c.r) > 1);
    // B : « je savais que tu ne savais pas, et je ne sais pas non plus »
    const c2 = c1.filter(c => suit(c.s).every(d => cnt(d.r) > 1) && suit(c.s).length > 1);
    // A : « maintenant je sais »
    const c3 = c2.filter(c => c2.filter(d => d.r === c.r).length === 1);
    // B : « moi aussi »
    const c4 = c3.filter(c => c3.filter(d => d.s === c.s).length === 1);
    return { c1, c2, c3, c4 };
  }
  const S_ = 0, H_ = 1, D_ = 2, C_ = 3;
  const CLASSIC = [['A', H_], ['Q', H_], ['4', H_], ['J', S_], ['8', S_], ['4', S_], ['2', S_], ['7', S_], ['3', S_],
    ['K', C_], ['Q', C_], ['5', C_], ['4', C_], ['6', C_], ['A', D_], ['5', D_]].map(([r, s]) => ({ r, s }));
  function genCards(n) {
    const nr = { 10: 6, 12: 7, 16: 9 }[n] || 7, minC2 = 4;
    for (let k = 0; k < 60000; k++) {
      const deck = [];
      shuffle(RANKS).slice(0, nr).forEach(r => { for (let s = 0; s < 4; s++) deck.push({ r, s }); });
      const set = shuffle(deck).slice(0, n);
      const sol = solveCards(set);
      if (sol.c4.length === 1 && sol.c2.length >= minC2 && sol.c3.length >= 2) return { set, ans: sol.c4[0] };
    }
    return { set: CLASSIC, ans: { r: '5', s: D_ } };
  }

  // ---------- La règle cachée ----------
  const RULES = {
    sum: { d: 3, dig: '123456789', f: a => a.reduce((x, y) => x + y, 0) },
    even: { d: 4, dig: '123456789', f: a => a.filter(x => x % 2 === 0).length },
    loops: { d: 4, dig: '012356789', f: a => a.reduce((s, x) => s + ({ 0: 1, 6: 1, 8: 2, 9: 1 }[x] || 0), 0) },
    range: { d: 4, dig: '123456789', f: a => Math.max(...a) - Math.min(...a) },
    prod: { d: 4, dig: '123456789', f: a => a[0] * a[3] },
    diff: { d: 4, dig: '123456789', f: a => Math.abs(a[0] * 10 + a[1] - a[2] * 10 - a[3]) },
    max: { d: 4, dig: '0123456789', f: a => Math.max(...a) },
    firstlast: { d: 4, dig: '123456789', f: a => a[0] + a[3] },
    alt: { d: 4, dig: '123456789', f: a => Math.abs(a[0] + a[2] - a[1] - a[3]) }
  };
  const POOLS = [['sum', 'even', 'max'], ['loops', 'range', 'firstlast'], ['prod', 'diff', 'alt']];
  function genPattern(level, variant) {
    const rule = POOLS[level][variant % 3], R = RULES[rule];
    for (;;) {
      const seen = new Set(), rows = [];
      while (rows.length < 5) {
        const a = Array.from({ length: R.d }, () => +R.dig[rand(R.dig.length)]);
        const n = a.join('');
        if (a[0] === 0 || seen.has(n)) continue;
        seen.add(n); rows.push([n, R.f(a)]);
      }
      const ex = rows.slice(0, 4);
      if (new Set(ex.map(r => r[1])).size >= 3) return { rule, ex, q: rows[4][0], ans: rows[4][1] };
    }
  }


  // ---------- Interrupteurs (« lights out ») ----------
  function lightsPress(g, n, i) {
    const r = Math.floor(i / n), c = i % n;
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const y = r + dr, x = c + dc; if (y >= 0 && y < n && x >= 0 && x < n) g[y * n + x] ^= 1; });
  }
  function genLights(n, k) {
    for (;;) {
      const g = Array(n * n).fill(1), sol = new Set();
      while (sol.size < k) sol.add(rand(n * n));
      sol.forEach(i => lightsPress(g, n, i));
      if (g.some(x => !x)) return { g, sol: [...sol] };
    }
  }

  // ---------- Taquin ----------
  const slideNb = (n, i) => { const r = Math.floor(i / n), c = i % n, o = []; if (r) o.push(i - n); if (r < n - 1) o.push(i + n); if (c) o.push(i - 1); if (c < n - 1) o.push(i + 1); return o; };
  function genSlide(n, moves) {
    for (;;) {
      const a = [...Array(n * n).keys()]; let b = n * n - 1, prev = -1;
      for (let i = 0; i < moves; i++) { const nb = slideNb(n, b).filter(x => x !== prev), x = nb[rand(nb.length)]; [a[b], a[x]] = [a[x], a[b]]; prev = b; b = x; }
      if (a.some((v, i) => v !== i)) return a;
    }
  }

  // ---------- Circuit (tuyaux) : bits N=1 E=2 S=4 O=8 ----------
  const rot = (m, r) => { for (let i = 0; i < ((r % 4) + 4) % 4; i++) m = ((m << 1) | (m >> 3)) & 15; return m; };
  const DIRS = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]];
  function findPath(n, sr, dr) {
    const seen = new Set(), path = [];
    const go = (r, c) => {
      seen.add(r * n + c); path.push([r, c]);
      if (c === n - 1 && r === dr && path.length >= n + 2) return true;
      for (const [y, x] of shuffle(DIRS)) { const rr = r + y, cc = c + x; if (rr >= 0 && rr < n && cc >= 0 && cc < n && !seen.has(rr * n + cc) && go(rr, cc)) return true; }
      path.pop(); return false;
    };
    return go(sr, 0) ? path : null;
  }
  function pipesOk(P) {
    const { n, tiles, src, dst } = P, m = i => rot(tiles[i].m, tiles[i].r), seen = new Set([src * n]);
    if (!(m(src * n) & 8)) return { ok: false, seen: new Set() };
    const q = [src * n];
    while (q.length) {
      const i = q.shift(), r = Math.floor(i / n), c = i % n;
      for (const [y, x, b, o] of DIRS) {
        const rr = r + y, cc = c + x, j = rr * n + cc;
        if ((m(i) & b) && rr >= 0 && rr < n && cc >= 0 && cc < n && (m(j) & o) && !seen.has(j)) { seen.add(j); q.push(j); }
      }
    }
    return { ok: seen.has(dst * n + n - 1) && !!(m(dst * n + n - 1) & 2), seen };
  }
  function genPipes(n) {
    for (;;) {
      const src = rand(n), dst = rand(n), path = findPath(n, src, dst);
      if (!path || path.length > n * n * 0.7) continue;
      const tiles = Array.from({ length: n * n }, () => ({ m: [5, 3, 7][rand(3)], r: rand(4), path: false }));
      path.forEach(([r, c], k) => {
        let m = 0;
        const link = (p) => { if (!p) return; const [y, x] = [p[0] - r, p[1] - c]; for (const [a, b, bit] of DIRS) if (a === y && b === x) m |= bit; };
        if (k === 0) m |= 8; else link(path[k - 1]);
        if (k === path.length - 1) m |= 2; else link(path[k + 1]);
        tiles[r * n + c] = { m, r: rand(4), path: true };
      });
      const P = { n, tiles, src, dst };
      if (!pipesOk(P).ok) return P;
    }
  }

  // ---------- Carte marine ----------
  const OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };
  function genMap(n, steps) {
    for (;;) {
      let r = rand(n), c = rand(n); const start = [r, c], moves = [];
      for (let i = 0; i < steps; i++) {
        const opts = [], last = moves[moves.length - 1];
        for (const [d, y, x] of [['N', -1, 0], ['E', 0, 1], ['S', 1, 0], ['W', 0, -1]]) for (let k = 1; k <= 3; k++) {
          const rr = r + y * k, cc = c + x * k;
          if (rr >= 0 && rr < n && cc >= 0 && cc < n && (!last || (last[0] !== d && OPP[d] !== last[0]))) opts.push([d, k, rr, cc]);
        }
        const o = opts[rand(opts.length)]; moves.push([o[0], o[1]]); r = o[2]; c = o[3];
      }
      if (r !== start[0] || c !== start[1]) return { n, start, moves, end: [r, c] };
    }
  }

  // ---------- Chiffrements ----------
  const NUMS = {
    fr: ['ZERO', 'UN', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX', 'SEPT', 'HUIT', 'NEUF'],
    en: ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'],
    vi: ['KHONG', 'MOT', 'HAI', 'BA', 'BON', 'NAM', 'SAU', 'BAY', 'TAM', 'CHIN']
  };
  const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase();
  const caesar = (s, k) => plain(s).replace(/[A-Z]/g, ch => String.fromCharCode(65 + (((ch.charCodeAt(0) - 65 + k) % 26) + 26) % 26));
  const GLYPHS = ['◆', '◇', '○', '◎', '□', '▣', '△', '▽', '▼', '◁', '▷', '☆', '♤', '♡', '♢', '♧', '✚', '✕', '✱', '❖', '☾', '☀', '⌘', '☂', '⊕', '⊗'];
  const genGlyphs = () => { const g = shuffle(GLYPHS), m = {}; for (let i = 0; i < 26; i++) m[String.fromCharCode(65 + i)] = g[i]; return m; };

  // ---------- Labyrinthe (murs : N=1 E=2 S=4 O=8) ----------
  function genMaze(n) {
    const w = Array(n * n).fill(15), seen = new Set([0]), st = [0];
    while (st.length) {
      const i = st[st.length - 1], r = Math.floor(i / n), c = i % n;
      const nb = shuffle([[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]]).filter(([y, x]) => { const rr = r + y, cc = c + x; return rr >= 0 && rr < n && cc >= 0 && cc < n && !seen.has(rr * n + cc); });
      if (!nb.length) { st.pop(); continue; }
      const [y, x, b, o] = nb[0], j = (r + y) * n + c + x; w[i] &= ~b; w[j] &= ~o; seen.add(j); st.push(j);
    }
    return { n, w, start: 0, goal: n * n - 1 };
  }

  // ---------- Miroirs : '/' = 0, '\' = 1 ; directions 0=N 1=E 2=S 3=O ----------
  const DV = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const reflect = (o, d) => o === 0 ? [1, 0, 3, 2][d] : [3, 2, 1, 0][d];
  function traceBeam(M) {
    const { n, cells, sr } = M; let r = sr, c = 0, d = 1; const pts = [[r, -1]];
    for (let k = 0; k < n * n * 4; k++) {
      if (r < 0 || r >= n || c < 0 || c >= n) { pts.push([r, c]); return { pts, hit: false }; }
      const cell = cells[r * n + c]; pts.push([r, c]);
      if (cell.t === 'x') return { pts, hit: false };
      if (cell.t === 'g') return { pts, hit: true };
      if (cell.t === 'm') d = reflect(cell.o, d);
      r += DV[d][0]; c += DV[d][1];
    }
    return { pts, hit: false };
  }
  function genMirror(n, mirrors, decoys, stones) {
    for (let tries = 0; tries < 5000; tries++) {
      const cells = Array.from({ length: n * n }, () => ({ t: '' })), used = new Set(), sr = rand(n);
      let r = sr, c = 0, d = 1, ok = true;
      const free = (rr, cc) => rr >= 0 && rr < n && cc >= 0 && cc < n && !used.has(rr * n + cc);
      for (let m = 0; m <= mirrors && ok; m++) {
        const L = rand(3); const seg = [];
        for (let k = 0; k <= L; k++) { const rr = r + DV[d][0] * k, cc = c + DV[d][1] * k; if (!free(rr, cc)) { ok = false; break; } seg.push([rr, cc]); }
        if (!ok) break;
        seg.forEach(([y, x]) => used.add(y * n + x));
        const [er, ec] = seg[seg.length - 1];
        if (m === mirrors) { cells[er * n + ec] = { t: 'g' }; break; }
        const nd = shuffle([(d + 1) % 4, (d + 3) % 4]).find(nd2 => free(er + DV[nd2][0], ec + DV[nd2][1]));
        if (nd == null) { ok = false; break; }
        const o = reflect(0, d) === nd ? 0 : 1; cells[er * n + ec] = { t: 'm', o, sol: o, path: true };
        d = nd; r = er + DV[d][0]; c = ec + DV[d][1];
      }
      if (!ok || !cells.some(x => x.t === 'g')) continue;
      const freeCells = shuffle([...Array(n * n).keys()].filter(i => !used.has(i) && cells[i].t === ''));
      freeCells.slice(0, decoys).forEach(i => { cells[i] = { t: 'm', o: rand(2) }; });
      freeCells.slice(decoys, decoys + stones).forEach(i => { cells[i] = { t: 'x' }; });
      const M = { n, cells, sr };
      for (let k = 0; k < 30; k++) { cells.forEach(x => { if (x.t === 'm') x.o = rand(2); }); if (!traceBeam(M).hit) return M; }
    }
    return null;
  }

  // ---------- Bidons d'eau ----------
  function jugsBFS(a, b, s0, t) {
    const key = s => s.join(','), prev = new Map([[key(s0), null]]), q = [s0];
    while (q.length) {
      const s = q.shift();
      if (s[0] === t || s[1] === t) { const path = []; let k = key(s); while (prev.get(k)) { const [pk, mv] = prev.get(k); path.unshift(mv); k = pk; } return path; }
      const [x, y] = s, p1 = Math.min(x, b - y), p2 = Math.min(y, a - x);
      [[[a, y], 'fA'], [[x, b], 'fB'], [[0, y], 'eA'], [[x, 0], 'eB'], [[x - p1, y + p1], 'pAB'], [[x + p2, y - p2], 'pBA']].forEach(([n2, mv]) => { if (!prev.has(key(n2))) { prev.set(key(n2), [key(s), mv]); q.push(n2); } });
    }
    return null;
  }
  function genJugs(maxB, minSteps) {
    for (;;) {
      const a = 3 + rand(3), b = a + 2 + rand(maxB - a - 1), t = 1 + rand(b - 1);
      if (t === a || b > maxB) continue;
      const p = jugsBFS(a, b, [0, 0], t);
      if (p && p.length >= minSteps) return { a, b, t };
    }
  }

  // ---------- Traversée (chat, oiseau, riz) : bits 0=toi 1=chat 2=oiseau 3=riz, 1 = rive d'arrivée ----------
  const riverBad = s => { const me = s & 1, side = b => (s >> b) & 1; return (side(1) === side(2) && side(1) !== me) || (side(2) === side(3) && side(2) !== me); };
  function riverBFS(s0) {
    const prev = new Map([[s0, null]]), q = [s0];
    while (q.length) {
      const s = q.shift();
      if (s === 15) { const path = []; let k = s; while (prev.get(k)) { path.unshift(prev.get(k)[1]); k = prev.get(k)[0]; } return path; }
      const me = s & 1;
      for (const it of [0, 1, 2, 3]) {
        if (it && ((s >> it) & 1) !== me) continue;
        let n2 = s ^ 1; if (it) n2 ^= 1 << it;
        if (!riverBad(n2) && !prev.has(n2)) { prev.set(n2, [s, it]); q.push(n2); }
      }
    }
    return null;
  }

  // ---------- Picross : chiffres 5×5 ----------
  const DIG5 = [['01110', '10001', '10001', '10001', '01110'], ['00100', '01100', '00100', '00100', '01110'], ['11110', '00001', '01110', '10000', '11111'],
    ['11110', '00001', '00110', '00001', '11110'], ['10010', '10010', '11111', '00010', '00010'], ['11111', '10000', '11110', '00001', '11110'],
    ['01110', '10000', '11110', '10001', '01110'], ['11111', '00001', '00010', '00100', '00100'], ['01110', '10001', '01110', '10001', '01110'], ['01110', '10001', '01111', '00001', '01110']];
  const runs = a => { const o = []; let k = 0; a.forEach(v => { if (v) k++; else if (k) { o.push(k); k = 0; } }); if (k) o.push(k); return o.length ? o : [0]; };
  function nonoClues(g, n) {
    const rows = [], cols = [];
    for (let r = 0; r < n; r++) rows.push(runs(g.slice(r * n, r * n + n)));
    for (let c = 0; c < n; c++) cols.push(runs(Array.from({ length: n }, (_, r) => g[r * n + c])));
    return { rows, cols };
  }

  const api = { rand, shuffle, MC, morseSeq, morseOn, RANKS, solveCards, genCards, CLASSIC, RULES, genPattern, lightsPress, genLights, slideNb, genSlide, rot, pipesOk, genPipes, genMap, NUMS, plain, caesar, GLYPHS, genGlyphs, genMaze, traceBeam, genMirror, jugsBFS, genJugs, riverBad, riverBFS, DIG5, nonoClues };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Logic = api;
})(typeof window !== 'undefined' ? window : globalThis);

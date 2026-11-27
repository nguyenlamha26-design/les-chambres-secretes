// Moteur du jeu d'évasion : exploration, inventaire, carnet, énigmes, chrono et verrou final.
(() => {
  'use strict';
  const LG = window.Logic;
  const { rand, shuffle, MC, morseSeq, morseOn, RANKS, genCards, genPattern, NUMS } = LG;
  const SC = window.Content, SYM = ['★', '●', '▲', '■', '◆', '♥'], SUITS = ['♠', '♥', '♦', '♣'];
  const $ = s => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
  };
  const LV = [
    { time: 3600, hints: 8, pen: 0, unit: 230, cards: 10 },
    { time: 2700, hints: 5, pen: 20, unit: 170, cards: 12 },
    { time: 1800, hints: 2, pen: 45, unit: 120, cards: 16 }
  ];

  let lang = store.get('mt-lang', null) || (navigator.language || 'fr').slice(0, 2);
  if (!window.T[lang]) lang = 'fr';
  const L = () => window.T[lang];
  const tr = (k, v) => { let s = L()[k]; if (v) for (const a in v) s = s.split('{' + a + '}').join(v[a]); return s; };
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').replace(/[^a-z0-9]/gi, '').toUpperCase();
  const fmt = s => { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

  let G = null, menuSc = 0, menuLv = 1, menuCat = 'all', menuMode = /enquete/.test(location.hash) ? 'enq' : /culture|legende/.test(location.hash) ? 'cul' : store.get('mt-mode', 'esc');
  // Catégories des scénarios (un scénario peut en avoir plusieurs) ; « corsé » se déduit de S.hard
  const CATS = [
    ['all', '✨', { fr: 'Tous', en: 'All', vi: 'Tất cả' }],
    ['story', '📖', { fr: 'Récit', en: 'Story', vi: 'Cốt truyện' }],
    ['family', '👨‍👩‍👧', { fr: 'Famille', en: 'Family', vi: 'Gia đình' }],
    ['culture', '🌍', { fr: 'Culture', en: 'Culture', vi: 'Văn hóa' }],
    ['mystery', '🔍', { fr: 'Enquête', en: 'Mystery', vi: 'Điều tra' }],
    ['adventure', '🧭', { fr: 'Aventure', en: 'Adventure', vi: 'Phiêu lưu' }],
    ['thrill', '👻', { fr: 'Frissons', en: 'Thrills', vi: 'Rùng rợn' }],
    ['hard', '💀', { fr: 'Corsé', en: 'Tough', vi: 'Khó nhằn' }]
  ];
  const TAGS = {
    class: ['family'], ship: ['family', 'adventure', 'culture'], temple: ['adventure', 'family'], station: ['adventure', 'story'],
    city: ['mystery', 'culture'], lantern: ['culture', 'family'], train: ['adventure', 'culture'], halloween: ['family', 'thrill'],
    xmas: ['family'], games: ['thrill'], empty: ['thrill'], magic: ['family', 'adventure'], mafia: ['mystery', 'story', 'culture'],
    philo: ['culture'], phare: ['story'], other: ['story', 'mystery'],
    pho: ['culture', 'story', 'family'], wuxia: ['culture', 'story', 'adventure'],
    theatre: ['mystery', 'story', 'culture'], musee: ['mystery', 'culture', 'family']
  };
  const tagsOf = s => (TAGS[s.id] || []).concat(s.hard ? ['hard'] : []);
  const catName = id => { const c = CATS.find(x => x[0] === id); return c ? c[2][lang] || c[2].fr : id; };

  // Résout un texte : objet {fr,en,vi}, fonction, ou chaîne avec des {variables}
  function X(t) {
    if (t == null) return '';
    if (typeof t === 'function') t = t(G);
    if (t && typeof t === 'object' && !Array.isArray(t) && 'fr' in t) t = t[lang] ?? t.fr;
    if (typeof t !== 'string' || !G) return t;
    return t.replace(/\{([\w★●▲■◆♥]+)\}/g, (m, k) => {
      if (k[0] === 'd' && SYM.includes(k.slice(1))) return G.code[k.slice(1)];
      if (k === 'typoWord') return api.typoWord();
      if (k === 'mword') return G.mword;
      if (k in G.v) { const v = G.v[k]; return typeof v === 'function' ? X(v(G)) : (v && typeof v === 'object' && 'fr' in v ? v[lang] : String(v)); }
      return m;
    });
  }
  const typoErrs = s => [...s.normalize('NFC').matchAll(/\{([^|}]+)\|([^}]+)\}/g)].map(m => [m[1], m[2]]);
  const diffAt = (w, r) => { let k = 0; while (k < r.length - 1 && w[k] === r[k]) k++; return k; };

  // ---------------- Son ----------------
  let AC = null, muted = store.get('mt-mute', false), amb = null;
  function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }
  function beep(f, d, type = 'sine', v = .15, at = 0) {
    if (muted) return null;
    const a = ac(); if (!a) return null;
    const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + at;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .01);
    g.gain.setValueAtTime(v, t0 + Math.max(.012, d - .02)); g.gain.linearRampToValueAtTime(0, t0 + d);
    o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + d + .05);
    return o;
  }
  const sfx = {
    click() { beep(700, .04, 'square', .04); },
    ok() { [523, 659, 784, 1047].forEach((f, i) => beep(f, .18, 'triangle', .14, i * .09)); },
    bad() { beep(160, .22, 'sawtooth', .09); beep(115, .3, 'sawtooth', .09, .12); },
    item() { beep(880, .08, 'triangle', .12); beep(1320, .14, 'triangle', .1, .07); },
    step() { beep(220, .08, 'sine', .08); beep(180, .1, 'sine', .06, .1); },
    win() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => beep(f, .32, 'triangle', .15, i * .12)); },
    lose() { [330, 262, 196, 131].forEach((f, i) => beep(f, .42, 'sine', .15, i * .26)); }
  };
  function stopAmb() { if (amb) { try { amb.src.stop(); amb.lfo.stop(); } catch { /* déjà arrêté */ } amb = null; } }
  function startAmb() {
    stopAmb();
    if (muted || !G) return;
    const a = ac(); if (!a) return;
    const [type, freq, vol] = G.S.amb, buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
    src.buffer = buf; src.loop = true; fl.type = type; fl.frequency.value = freq; g.gain.value = vol;
    lfo.frequency.value = .16; lg.gain.value = vol * .55; lfo.connect(lg).connect(g.gain);
    src.connect(fl).connect(g).connect(a.destination); src.start(); lfo.start();
    amb = { src, lfo };
  }

  // ---------------- Messages ----------------
  function toast(msg) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 3400);
  }
  // La bulle reste affichée jusqu'à ce qu'on la ferme (✕, clic sur la bulle ou Échap) ou qu'un autre texte la remplace
  function say(text) {
    const el = $('#msg'); el.innerHTML = `<span>${esc(text)}</span><button class="msgx" aria-label="${esc(L().close || '✕')}">✕</button>`; el.hidden = false; el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  }
  $('#msg').onclick = () => { $('#msg').hidden = true; };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').hidden) $('#msg').hidden = true; });

  // ---------------- API utilisée par le contenu ----------------
  const api = {
    X, L, tr, lang: () => lang,
    has: i => G.inv.includes(i),
    take(i) { if (G.inv.includes(i)) return; G.inv.push(i); sfx.item(); toast(tr('took', { x: X(G.S.items[i].n) })); renderInv(true); },
    drop(i) { G.inv = G.inv.filter(x => x !== i); if (G.held === i) G.held = null; renderInv(); },
    set(f) { G.f[f] = 1; buildHS(); updateNav(); },
    say: t => say(X(t)),
    doc: (id, quiet) => openDoc(id, quiet),
    keep(id) { if (!G.docs.includes(id)) { G.docs.push(id); G.f['doc_' + id] = 1; toast(tr('newDoc', { x: X(G.S.docs[id].t) })); } },
    pz: id => openModal('pz', id),
    solved: id => !!G.f['pz_' + id],
    digit(s) { if (G.found[s]) return; G.found[s] = 1; toast(tr('digitFound', { s, d: G.code[s] })); updateHUD(); if (SYM.every(x => G.found[x])) setTimeout(() => toast(tr('allFound')), 900); },
    note(id, t) { if (!G.notes[id]) { G.notes[id] = t; G.noteOrder.push(id); } },
    go: v => goView(v),
    typoWord: () => typoErrs(G.S.typo[lang]).map(([w, r]) => norm(r[diffAt(w, r)])).join('')
  };

  // ---------------- Langue ----------------
  const LANGS = [['fr', 'Français', 'FR'], ['en', 'English', 'EN'], ['vi', 'Tiếng Việt', 'VI']];
  document.addEventListener('click', e => { const b = e.target.closest('.lg[data-l]'); if (b && window.T[b.dataset.l]) { sfx.click(); lang = b.dataset.l; store.set('mt-lang', lang); document.documentElement.lang = lang; refresh(); } });
  function refresh() {
    document.title = L().title;
    if (!$('#menu').hidden) renderMenu();
    if (!G) return;
    updateHUD(); buildHS(); renderInv(); updateNav();
    if (!$('#intro').hidden) renderIntro();
    if (!$('#modal').hidden) renderModal();
    if (!$('#end').hidden) renderEnd();
  }

  // ---------------- Menu ----------------
  const thumbs = [];
  function makeThumbs() {
    const off = document.createElement('canvas'); off.width = 1600; off.height = 900; const oc = off.getContext('2d');
    SC.forEach((s, i) => {
      oc.setTransform(1, 0, 0, 1, 0, 0);
      window.Scenes[s.views.a.scene](oc, 2.4, { f: {}, v: {}, code: {}, inv: [], morse: 1 });
      const th = document.createElement('canvas'); th.width = 400; th.height = 225; th.getContext('2d').drawImage(off, 0, 0, 400, 225); thumbs[i] = th;
    });
  }
  function renderMenu() {
    const l = L(), best = store.get('mt-best2', {});
    $('#menu').innerHTML = `<div class="mwrap">
      <div class="langs">${LANGS.map(([c, n]) => `<button class="lg${c === lang ? ' on' : ''}" data-l="${c}">${n}</button>`).join('')}</div>
      <h1>${l.title}</h1><p class="tagline">${l.tag}</p>
      ${window.Dossier ? `<div class="modes">${[['esc', '🔓', 'modeEsc'], ['enq', '🔍', 'modeEnq'], ['cul', '🏮', 'modeCul']].map(([m, ic, k]) => `<button class="mode${m === menuMode ? ' on' : ''}" data-m="${m}"><span>${ic}</span><b>${window.Dossier.u(k)}</b><small>${window.Dossier.u(k + 'D')}</small></button>`).join('')}</div>` : ''}
      ${(menuMode === 'enq' || menuMode === 'cul') && window.Dossier ? '<div id="dosList"></div>' : `<h3>${l.pickSc}</h3>
      <div class="cats">${CATS.map(([id, ic]) => `<button class="cat${id === menuCat ? ' on' : ''}" data-c="${id}">${ic} ${catName(id)} <i>${id === 'all' ? SC.length : SC.filter(s => tagsOf(s).includes(id)).length}</i></button>`).join('')}</div>
      <div class="scs">${SC.map((s, i) => `<button class="sc${i === menuSc ? ' on' : ''}"${menuCat !== 'all' && !tagsOf(s).includes(menuCat) ? ' hidden' : ''}><canvas width="400" height="225"></canvas>
        <div class="sct">${s.hard ? `<span class="hardtag">💀 ${l.hard || ''}</span>` : ''}<b>${s.icon} ${X(s.name)}</b><small>${X(s.desc)}</small><span class="ctags">${(TAGS[s.id] || []).map(c => `<i>${CATS.find(x => x[0] === c)[1]} ${catName(c)}</i>`).join('')}</span><em>${best[i + '-' + menuLv] ? '🏆 ' + l.best + ' : ' + fmt(best[i + '-' + menuLv]) : ''}</em></div></button>`).join('')}</div>
      <h3>${l.pickLv}</h3>
      <div class="lvs">${[0, 1, 2].map(i => `<button class="lv${i === menuLv ? ' on' : ''}"><b>${'★'.repeat(i + 1)} ${l.lv[i]}</b><small>${l.lvd[i]}</small></button>`).join('')}</div>
      <div class="row"><button class="btn big" id="lbBtn">🏆 ${l.lbTitle || ""}</button><button class="btn gold big" id="go">${l.play} →</button></div>`}
      <section id="cmts" class="cmts"></section>
      <p class="credit">${{ fr: 'Créatrice : ', en: 'Created by ', vi: 'Tác giả: ' }[lang] || 'Créatrice : '}<b>Lam Ha Nguyen</b></p></div>`;
    document.querySelectorAll('.mode').forEach(b => { b.onclick = () => { sfx.click(); menuMode = b.dataset.m; store.set('mt-mode', menuMode); renderMenu(); }; });
    if ($('#dosList')) { window.Dossier.list($('#dosList'), menuMode); if (window.Comments) window.Comments.mount($('#cmts')); return; }
    document.querySelectorAll('.sc').forEach((b, i) => { b.querySelector('canvas').getContext('2d').drawImage(thumbs[i], 0, 0); b.onclick = () => { sfx.click(); menuSc = i; renderMenu(); }; });
    document.querySelectorAll('.lv').forEach((b, i) => { b.onclick = () => { sfx.click(); menuLv = i; renderMenu(); }; });
    document.querySelectorAll('.cat').forEach(b => { b.onclick = () => { sfx.click(); menuCat = b.dataset.c; renderMenu(); }; });
    if (window.Comments) window.Comments.mount($('#cmts'));
    $('#go').onclick = () => { sfx.click(); startGame(menuSc, menuLv); };
    $('#lbBtn').onclick = () => { sfx.click(); if (window.Leaderboard) window.Leaderboard.open(menuSc, menuLv); };
  }
  function toMenu() {
    stopAmb(); stopMorse(); G = null;
    ['#intro', '#modal', '#end'].forEach(s => { $(s).hidden = true; });
    $('#hud').hidden = true; $('#gameui').hidden = true; document.body.classList.add('nohud'); $('#hs').innerHTML = '';
    $('#menu').hidden = false; renderMenu();
  }

  // ---------------- Partie ----------------
  function startGame(sc, lvl) {
    const S = SC[sc], LVL = S.hard ? { ...LV[lvl], time: Math.round(LV[lvl].time * .75), hints: Math.max(1, LV[lvl].hints - 2), pen: LV[lvl].pen + 15 } : LV[lvl];
    let perm = SYM.slice();
    if (lvl > 0) do { perm = shuffle(SYM); } while (perm.every((v, i) => v === SYM[i]));
    G = { sc, S, lvl, cfg: LVL, v: {}, f: {}, inv: [], held: null, docs: [], notes: {}, noteOrder: [], code: {}, found: {}, perm, dial: [0, 0, 0, 0, 0, 0],
      left: LVL.time, hints: LVL.hints, used: 0, state: 'intro', view: S.order[0], ps: {}, modal: null, last: 0, openAt: 0, fade: 0, jTab: 'docs',
      mword: S.morse ? S.morse[lvl] : null };
    SYM.forEach(s => { G.code[s] = rand(10); });
    G.mseq = G.mword ? morseSeq(G.mword) : null;
    Object.assign(G, api);
    if (S.init) S.init(G);
    $('#menu').hidden = true; $('#end').hidden = true; $('#hs').innerHTML = ''; $('#msg').hidden = true;
    $('#intro').hidden = false; renderIntro();
  }
  function renderIntro() {
    $('#intro').innerHTML = `<div class="panel story"><div class="ico">${G.S.icon}</div><h2>${X(G.S.name)}</h2><p>${X(G.S.intro)}</p>
      <p class="tip">🧭 ${tr('controls')}</p>
      <p style="color:var(--gold);font-size:15px">${'★'.repeat(G.lvl + 1)} ${L().lv[G.lvl]} — ${G.S.hard ? `<b class="hardtag">💀 ${L().hard}</b> ${L().hardd.replace('{t}', Math.round(G.cfg.time / 60)).replace('{h}', G.cfg.hints).replace('{p}', G.cfg.pen)}` : L().lvd[G.lvl]}</p>
      <div class="row"><button class="btn" id="back">← ${L().menu}</button><button class="btn gold big" id="begin">${L().begin}</button></div></div>`;
    $('#back').onclick = toMenu;
    $('#begin').onclick = () => {
      sfx.click(); $('#intro').hidden = true; $('#hud').hidden = false; $('#gameui').hidden = false; document.body.classList.remove('nohud');
      $('#hs').classList.toggle('easy', G.lvl === 0);
      G.state = 'play'; G.last = performance.now(); G.fade = performance.now(); updateHUD(); buildHS(); renderInv(); updateNav(); startAmb();
    };
  }
  function updateHUD() {
    if (!G) return;
    $('#scname').textContent = G.S.icon + ' ' + X(G.S.name);
    $('#quit').textContent = '← ' + L().quit;
    $('#hintTop').textContent = '💡 ' + G.hints; $('#hintTop').title = L().hint;
    $('#jBtn').textContent = '📖 ' + L().journal;
    $('#scanBtn').textContent = '🔍'; $('#scanBtn').title = L().scanTip;
    $('#mute').textContent = muted ? '🔇' : '🔊'; $('#mute').title = L().sound;
    $('#slots').innerHTML = SYM.map(s => `<span class="${G.found[s] ? 'on' : ''}">${s}<b>${G.found[s] ? G.code[s] : '?'}</b></span>`).join('');
    $('#hudLangs').innerHTML = LANGS.map(([c, , n]) => `<button class="lg${c === lang ? ' on' : ''}" data-l="${c}">${n}</button>`).join('');
    if (!$('#modal').hidden && G.modal && G.modal.kind === 'pz') { const b = $('#mhint'); if (b) b.textContent = '💡 ' + L().hint + ' (' + G.hints + ')'; }
    showTime();
  }
  function showTime() { const el = $('#timer'); el.textContent = fmt(G.left); el.classList.toggle('low', G.left < 120); }

  // ---------------- Vues et zones ----------------
  const isDark = () => { const vw = G.S.views[G.view]; return !!(vw.dark && vw.dark(G)); };
  const canSee = () => { const vw = G.S.views[G.view]; return !isDark() || (vw.light && G.inv.includes(vw.light)); };
  function buildHS() {
    const box = $('#hs'); box.innerHTML = '';
    if (!G || G.state !== 'play' || !canSee()) return;
    G.S.hs.forEach((h, k) => {
      if (h.v !== G.view || (h.show && !h.show(G))) return;
      const b = document.createElement('button'), seen = G.f['seen_' + k];
      b.className = 'hs' + (h.hid ? ' hid' : '') + (h.fin ? ' fin' : '');
      b.style.cssText = `left:${h.r[0] / 16}%;top:${h.r[1] / 9}%;width:${h.r[2] / 16}%;height:${h.r[3] / 9}%`;
      b.innerHTML = `<span class="lbl">${h.hid && !seen ? '?' : esc(X(h.n))}</span>`;
      b.setAttribute('aria-label', h.hid && !seen ? '?' : X(h.n));
      b.onclick = e => {
        e.stopPropagation(); sfx.click(); G.f['seen_' + k] = 1;
        if (h.fin) openLock(); else h.click(G);
        buildHS(); renderInv();
      };
      box.appendChild(b);
    });
  }
  function neighbours() { const o = G.S.order, i = o.indexOf(G.view); return [o[(i - 1 + o.length) % o.length], o[(i + 1) % o.length]]; }
  function updateNav() {
    if (!G) return;
    const [l, r] = neighbours(), lab = id => { const vw = G.S.views[id]; return (vw.lock && vw.lock(G) ? '🔒 ' : '') + X(vw.n); };
    $('#navL').innerHTML = `◀<span>${esc(lab(l))}</span>`; $('#navR').innerHTML = `<span>${esc(lab(r))}</span>▶`;
    $('#vname').textContent = X(G.S.views[G.view].n);
  }
  function goView(to) {
    const vw = G.S.views[to];
    if (vw.lock && vw.lock(G) && !(vw.unlock && vw.unlock(G))) { sfx.bad(); say(X(vw.lockMsg)); return; }
    sfx.step(); G.view = to; G.fade = performance.now(); buildHS(); updateNav();
    if (!canSee()) say(tr('tooDark'));
    else if (vw.enter && !G.f['seen_' + to]) { G.f['seen_' + to] = 1; say(X(vw.enter)); }
  }
  $('#navL').onclick = () => goView(neighbours()[0]);
  $('#navR').onclick = () => goView(neighbours()[1]);
  const hsBox = $('#hs');
  hsBox.addEventListener('pointermove', e => { if (!G) return; const r = hsBox.getBoundingClientRect(); G.mx = (e.clientX - r.left) / r.width * 1600; G.my = (e.clientY - r.top) / r.height * 900; });
  hsBox.addEventListener('pointerleave', () => { if (G) { G.mx = null; G.my = null; } });
  hsBox.addEventListener('click', () => { if (G && G.held) { G.held = null; renderInv(); } });
  let scanT = 0;
  $('#scanBtn').onclick = () => { hsBox.classList.add('scan'); clearTimeout(scanT); scanT = setTimeout(() => hsBox.classList.remove('scan'), 2600); };

  // ---------------- Inventaire ----------------
  function renderInv(flash) {
    if (!G) return;
    const box = $('#inv');
    box.innerHTML = G.inv.map(i => `<button class="it${G.held === i ? ' held' : ''}" data-i="${i}" title="${esc(X(G.S.items[i].n))}">${G.S.items[i].i}</button>`).join('') || `<span class="empty">🎒</span>`;
    box.title = L().invTip;
    if (flash) { const last = box.lastElementChild; if (last) last.classList.add('new'); }
    box.querySelectorAll('.it').forEach(b => { b.onclick = e => { e.stopPropagation(); onItem(b.dataset.i); }; });
    $('#heldLbl').textContent = G.held ? L().held + ' : ' + X(G.S.items[G.held].n) : '';
    $('#stage').classList.toggle('holding', !!G.held);
  }
  function onItem(i) {
    sfx.click();
    if (G.held && G.held !== i) {
      const a = G.held, c = (G.S.combos || []).find(([x, y]) => (x === a && y === i) || (x === i && y === a));
      G.held = null;
      if (c) { api.drop(c[0]); api.drop(c[1]); api.take(c[2]); say(X(c[3])); }
      else { G.held = i; say(X(G.S.items[i].n) + ' — ' + X(G.S.items[i].d)); }
    } else if (G.held === i) {
      G.held = null; const it = G.S.items[i];
      if (it.ex) it.ex(G); else say(X(it.n) + ' — ' + X(it.d));
    } else { G.held = i; say(X(G.S.items[i].n) + ' — ' + X(G.S.items[i].d)); }
    renderInv();
  }

  // ---------------- Fenêtres (énigme, document, carnet, verrou) ----------------
  function openModal(kind, id) { G.modal = { kind, id }; $('#modal').hidden = false; renderModal(); if (kind === 'pz' && G.S.pzs[id].type === 'morse' && !api.solved(id)) playMorse(); }
  function closeModal() {
    stopMorse(); stopSimon(); $('#modal').hidden = true; if (!G) return;
    G.modal = null; buildHS(); renderInv(); updateNav();
  }
  $('#mclose').onclick = closeModal;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', e => {
    if (!G || G.state !== 'play') return;
    if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); else if (G.held) { G.held = null; renderInv(); } return; }
    if ($('#modal').hidden) { if (e.key === 'ArrowLeft') goView(neighbours()[0]); if (e.key === 'ArrowRight') goView(neighbours()[1]); return; }
    const m = G.modal;
    if (m && m.kind === 'lock' && W.keypad && /^[0-9]$/.test(e.key) && G.S.id === 'station') { W.keypad.key(e.key); return; }
    if (!m || m.kind !== 'pz' || document.activeElement.tagName === 'INPUT') return;
    const p = ps(m.id);
    if (p.type === 'wlock' && /^[a-z0-9]$/i.test(e.key)) W.wlock.key(p, e.key.toUpperCase());
    const dk = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key];
    if (p.type === 'maze' && dk != null) { e.preventDefault(); W.maze.move(p, dk); }
  });
  $('#mhint').onclick = () => useHint();
  $('#hintTop').onclick = () => useHint();
  $('#jBtn').onclick = () => openModal('journal');

  function renderModal() {
    const m = G.modal; if (!m) return;
    $('#mhint').hidden = true;
    if (m.kind === 'pz') renderPz(m.id);
    else if (m.kind === 'doc') renderDoc(m.id);
    else if (m.kind === 'journal') renderJournal();
    else if (m.kind === 'lock') renderLock();
  }
  function openDoc(id, quiet) {
    if (!G.docs.includes(id)) { G.docs.push(id); G.f['doc_' + id] = 1; if (!quiet) toast(tr('newDoc', { x: X(G.S.docs[id].t) })); }
    openModal('doc', id);
  }
  function renderDoc(id) {
    const d = G.S.docs[id];
    $('#mt').textContent = '📜 ' + X(d.t);
    $('#mb').innerHTML = `<div class="doc ${d.s === 'screen' ? 'termdoc' : (d.s || 'paper')}">${String(X(d.b)).replace(/\n/g, '<br>')}</div><div class="row"><button class="btn gold" id="cont">${tr('close')}</button></div>`;
    $('#cont').onclick = closeModal;
  }
  function renderJournal() {
    $('#mt').textContent = '📖 ' + L().journal;
    const tabs = [['docs', L().jDocs], ['notes', L().jNotes], ['code', L().jCode]];
    let body = '';
    if (G.jTab === 'docs') body = G.docs.length ? `<div class="jlist">${G.docs.map(id => `<button class="btn jd" data-d="${id}">📜 ${esc(X(G.S.docs[id].t))}</button>`).join('')}</div>` : `<p class="cnt">${L().jEmpty}</p>`;
    if (G.jTab === 'notes') body = G.noteOrder.length ? `<ul class="jnotes">${G.noteOrder.map(id => `<li>${esc(X(G.notes[id]))}</li>`).join('')}</ul>` : `<p class="cnt">${L().jEmpty}</p>`;
    if (G.jTab === 'code') body = `<div class="jcode">${SYM.map(s => `<div><span>${s}</span><b>${G.found[s] ? G.code[s] : '?'}</b></div>`).join('')}</div><p class="tip">🧭 ${tr('controls')}</p>`;
    $('#mb').innerHTML = `<div class="tabs">${tabs.map(([k, n]) => `<button class="tab${G.jTab === k ? ' on' : ''}" data-t="${k}">${n}</button>`).join('')}</div>${body}`;
    $('#mb').querySelectorAll('.tab').forEach(b => { b.onclick = () => { G.jTab = b.dataset.t; renderJournal(); }; });
    $('#mb').querySelectorAll('.jd').forEach(b => { b.onclick = () => openDoc(b.dataset.d, true); });
  }

  // ---------------- Énigmes ----------------
  function ps(id) {
    if (!G.ps[id]) { const def = G.S.pzs[id], p = { id, def, type: def.type, hl: 0 }; if (W[def.type].init) W[def.type].init(p, def); G.ps[id] = p; }
    return G.ps[id];
  }
  function renderPz(id) {
    const p = ps(id), d = p.def, P = L().pz[p.type] || L().pz.word;
    $('#mt').textContent = X(d.t) || P.t;
    const mb = $('#mb');
    if (api.solved(id)) {
      mb.innerHTML = `<div class="winbox"><div class="chk">✓</div><h3>${tr('solved')}</h3><p>${esc(X(d.done))}</p>${d.dig ? `<div class="bigd"><small>${d.dig}</small>${G.code[d.dig]}</div>` : ''}
        <div class="row"><button class="btn gold" id="cont">${tr('cont')}</button></div></div>`;
      $('#cont').onclick = closeModal; $('#cont').focus();
      return;
    }
    $('#mhint').hidden = false; $('#mhint').textContent = '💡 ' + L().hint + ' (' + G.hints + ')';
    mb.innerHTML = (d.ctx ? `<p class="ctx">${esc(X(d.ctx))}</p>` : '') + (d.ins || P.i ? `<p class="ins">${d.ins ? esc(X(d.ins)) : P.i}</p>` : '') + `<div id="pzb"></div><div id="hintbox"></div><div id="fb"></div>`;
    W[p.type].render(p, $('#pzb'));
    showHints(p);
  }
  function hintText(p, n) {
    const d = p.def, P = L().pz[p.type] || L().pz.word;
    if (n === 1) return d.h1 ? X(d.h1) : P.h;
    if (d.h2) return d.h2(G);
    return W[p.type].hint ? W[p.type].hint(p) : P.h;
  }
  function showHints(p) { const hb = $('#hintbox'); if (hb) hb.innerHTML = [1, 2].filter(n => n <= p.hl).map(n => `<p>💡 ${esc(hintText(p, n))}</p>`).join(''); }
  function useHint() {
    if (!G || G.state !== 'play') return;
    const m = G.modal;
    if (m && m.kind === 'pz' && !api.solved(m.id)) {
      const p = ps(m.id);
      if (p.hl >= 2) { toast(tr('noMoreHint')); return; }
      if (G.hints <= 0) { sfx.bad(); toast(tr('noHint')); return; }
      G.hints--; G.used++; p.hl++; beep(988, .12, 'triangle', .1); beep(1319, .2, 'triangle', .1, .1);
      updateHUD(); if (p.hl === 2 && W[p.type].onHint2) W[p.type].onHint2(p); renderPz(m.id);
      return;
    }
    if (SYM.every(s => G.found[s])) { say(tr('allFound')); return; }
    const goal = G.S.goals.find(([done, can]) => !done(G) && can(G));
    if (!goal) { say(tr('noGoal')); return; }
    if (G.hints <= 0) { sfx.bad(); toast(tr('noHint')); return; }
    G.hints--; G.used++; beep(988, .12, 'triangle', .1); updateHUD();
    if (m) closeModal();
    say('💡 ' + X(goal[2]));
  }
  function fail(msg) {
    sfx.bad();
    const pen = G.cfg.pen; if (pen) { G.left -= pen; showTime(); }
    const fb = $('#fb'); if (fb) fb.textContent = (msg || tr('wrong')) + (pen ? '  −' + pen + ' s' : '');
    const pn = $('#mpanel'); pn.classList.remove('shake'); void pn.offsetWidth; pn.classList.add('shake');
  }
  function solve(p) {
    if (!G || api.solved(p.id)) return;
    G.f['pz_' + p.id] = 1; stopMorse(); stopSimon(); sfx.ok();
    const d = p.def;
    if (d.ok) d.ok(G);
    if (d.dig) api.digit(d.dig);
    if (d.note) api.note(p.id, d.note);
    updateHUD(); buildHS(); renderInv(); updateNav();
    if (G.modal && G.modal.kind === 'pz' && G.modal.id === p.id) renderPz(p.id);
  }
  const inputRow = type => `<div class="row"><input class="ans" id="ans" ${type === 'number' ? 'inputmode="numeric"' : ''} autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${tr('ansPh')}"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
  function bindInput(test, p) {
    const inp = $('#ans'), go = () => { if (!inp.value.trim()) return; if (test(inp.value)) solve(p); else { fail(); inp.select(); } };
    $('#ok').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
    if (matchMedia('(hover:hover)').matches) inp.focus();
  }
  const pretty = s => [...s].map(ch => ch === '.' ? '<i class="dot"></i>' : ch === '-' ? '<i class="dash"></i>' : '<i class="gap"></i>').join('');
  const PAD = ['red', 'blue', 'yellow', 'green'], PADF = [330, 440, 554, 659];
  const NOTEF = [262, 294, 330, 349, 392, 440, 494, 523];

  const W = {
    typo: {
      init(p) { p.found = []; },
      render(p, box) {
        const errs = []; let k = 0;
        const src = G.S.typo[lang].normalize('NFC').replace(/\{([^|}]+)\|([^}]+)\}/g, (m, w, r) => { errs.push([w, r]); return '\u0001' + (k++) + '\u0001'; });
        if (p.hl >= 2 && (p.tip == null || p.found.includes(p.tip))) p.tip = errs.findIndex((e, n) => !p.found.includes(n));
        const html = src.split(/(\s+)/).map(tok => {
          if (!tok.trim()) return ' ';
          const m = tok.match(/^(.*)\u0001(\d+)\u0001(.*)$/);
          if (!m) return `<span class="w">${tok}</span>`;
          const n = +m[2], [w, r] = errs[n], f = p.found.includes(n), d = diffAt(w, r);
          return `${m[1]}<span class="w${f ? ' fixed' : ''}${!f && p.hl >= 2 && p.tip === n ? ' tip' : ''}" data-n="${n}">${f ? r.slice(0, d) + '<mark>' + r[d] + '</mark>' + r.slice(d + 1) : w}</span>${m[3]}`;
        }).join('');
        const slots = errs.map((e, n) => p.found.includes(n) ? `<b class="on">${norm(e[1][diffAt(e[0], e[1])])}</b>` : (G.lvl < 2 ? '<b>?</b>' : '')).join('');
        box.innerHTML = `<div class="paper ${G.S.id}">${html}</div><div class="letters">${slots}</div>` + (G.lvl < 2 ? `<p class="cnt">${tr('found')} : ${p.found.length} / ${errs.length}</p>` : '');
        box.querySelectorAll('.w').forEach(s => {
          s.onclick = () => {
            if (api.solved(p.id) || p.found.length === errs.length) return;
            const n = s.dataset.n;
            if (n == null) { s.classList.add('no'); setTimeout(() => s.classList.remove('no'), 500); fail(tr('notErr')); return; }
            if (p.found.includes(+n)) return;
            p.found.push(+n); beep(880, .1, 'triangle', .1); renderPz(p.id);
            if (p.found.length === errs.length) setTimeout(() => solve(p), 1200);
          };
        });
      },
      hint: () => tr('typoTip')
    },
    morse: {
      render(p, box) {
        box.innerHTML = `<div class="lampwrap"><div class="lamp" id="lamp"></div><div class="trans" id="trans">${G.lvl === 0 ? pretty([...G.mword].map(c => MC[c]).join(' ')) : ''}</div></div>
          <div class="row" style="margin-top:4px"><button class="btn" id="mplay">${tr('playSig')}</button></div>${inputRow()}
          <details class="mtable" open><summary>${tr('table')}</summary><div class="mgrid">${Object.keys(MC).sort((a, b) => (isNaN(a) - isNaN(b)) * -1 || (a < b ? -1 : 1)).map(k => `<span><b>${k}</b>${pretty(MC[k])}</span>`).join('')}</div></details>`;
        $('#mplay').onclick = () => playMorse();
        bindInput(v => norm(v) === G.mword, p);
      },
      hint: () => tr('first', { x: G.mword[0] })
    },
    word: {
      render(p, box) { box.innerHTML = `<div class="term">${esc(X(p.def.ctx))}<span class="cur">▌</span></div>` + inputRow(); bindInput(v => p.def.ans(G).map(norm).includes(norm(v)), p); }
    },
    rebus: {
      render(p, box) {
        const [pic, ans] = L().rebus[G.lvl][p.def.idx];
        box.innerHTML = `<div class="rebus">${pic.split(' + ').map(e => `<span>${e}</span>`).join('<i>+</i>')}<i>=</i><span class="q">?</span></div>`
          + (G.lvl < 2 ? `<p class="cnt">${tr('letters', { n: ans[0].length })}</p>` : '') + inputRow();
        bindInput(v => ans.includes(norm(v).toLowerCase()), p);
      },
      hint: p => tr('first', { x: L().rebus[G.lvl][p.def.idx][1][0][0].toUpperCase() })
    },
    pattern: {
      init(p, d) { Object.assign(p, genPattern(G.lvl, d.pt)); },
      render(p, box) {
        box.innerHTML = `<div class="eqs">${p.ex.map(([n, v]) => `<div>${n}<i>=</i>${v}</div>`).join('')}<div class="qq">${p.q}<i>=</i><b>?</b></div></div>` + inputRow('number');
        bindInput(v => /^\s*\d+\s*$/.test(v) && +v === p.ans, p);
      },
      hint: p => L().rules[p.rule]
    },
    cards: {
      init(p) { Object.assign(p, genCards(G.cfg.cards)); p.pick = null; },
      render(p, box) {
        const same = (a, b) => a && b && a.r === b.r && a.s === b.s;
        box.innerHTML = `<div class="cardrows">${SUITS.map((s, si) => {
          const cs = p.set.filter(c => c.s === si).sort((a, b) => RANKS.indexOf(a.r) - RANKS.indexOf(b.r));
          return cs.length ? `<div class="crow">${cs.map((c, k) => `<button class="card${si === 1 || si === 2 ? ' red' : ''}${same(p.pick, c) ? ' sel' : ''}" style="animation-delay:${(si * 4 + k) * .04}s" data-r="${c.r}" data-s="${c.s}"><b>${c.r}</b><span>${s}</span></button>`).join('')}</div>` : '';
        }).join('')}</div>
          <div class="dlg">${L().dlg.map((d, k) => `<p class="${k % 2 ? 'b' : 'a'}"><b>${k % 2 ? 'B' : 'A'}</b>« ${d} »</p>`).join('')}</div>
          <p class="cnt">${tr('cardsQ')}</p><div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
        box.querySelectorAll('.card').forEach(b => {
          b.onclick = () => { sfx.click(); p.pick = { r: b.dataset.r, s: +b.dataset.s }; box.querySelectorAll('.card').forEach(x => x.classList.toggle('sel', x === b)); };
        });
        $('#ok').onclick = () => { if (!p.pick) return; if (same(p.pick, p.ans)) solve(p); else fail(); };
      },
      hint: p => tr('suit', { x: SUITS[p.ans.s] })
    },
    cipher: {
      init(p) { p.s = 0; },
      render(p, box) {
        const enc = LG.caesar(p.def.msg(G), p.def.k(G)), AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const row = sh => [...AZ].map(ch => `<i>${String.fromCharCode(65 + ((ch.charCodeAt(0) - 65 + sh) % 26 + 26) % 26)}</i>`).join('');
        box.innerHTML = `<div class="ciph">${enc}</div>
          <div class="wheel"><div class="wl"><small>${tr('decoded')}</small><div class="abc">${[...AZ].map(c => `<i>${c}</i>`).join('')}</div></div>
          <div class="wl"><small>🔒</small><div class="abc enc">${row(p.s)}</div></div></div>
          <div class="row"><button class="btn" id="cl">◀</button><span class="shift">${tr('shift')} : <b>${p.s}</b></span><button class="btn" id="cr">▶</button></div>
          ${G.lvl < 2 ? `<div class="ciph dec">${LG.caesar(enc, -p.s)}</div>` : ''}` + inputRow();
        $('#cl').onclick = () => { p.s = (p.s + 25) % 26; beep(500, .03, 'square', .04); W.cipher.render(p, box); };
        $('#cr').onclick = () => { p.s = (p.s + 1) % 26; beep(520, .03, 'square', .04); W.cipher.render(p, box); };
        bindInput(v => p.def.ans(G).map(norm).includes(norm(v)), p);
      }
    },
    glyph: {
      render(p, box) {
        const word = NUMS[lang][G.code['▲']], gl = G.v.glyph;
        const key = G.f.glyphkey ? `<div class="gkey">${Object.entries(gl).map(([l, s]) => `<span><b>${s}</b>${l}</span>`).join('')}</div>` : `<p class="cnt">${tr('keyMissing')}</p>`;
        box.innerHTML = `<div class="glyphs">${[...word].map(ch => `<span>${gl[ch]}</span>`).join('')}</div>${key}` + inputRow();
        bindInput(v => [String(G.code['▲']), NUMS.fr[G.code['▲']], NUMS.en[G.code['▲']], NUMS.vi[G.code['▲']]].includes(norm(v)), p);
      },
      hint: () => tr('first', { x: NUMS[lang][G.code['▲']][0] })
    },
    lights: {
      init(p) { p.n = [3, 4, 5][G.lvl]; const g = LG.genLights(p.n, [3, 5, 7][G.lvl]); p.g = g.g; p.g0 = g.g.slice(); p.sol = g.sol; p.pr = Array(p.n * p.n).fill(0); },
      render(p, box) {
        const need = i => (p.sol.includes(i) ? 1 : 0) ^ p.pr[i];
        if (p.hl >= 2 && (p.tip == null || !need(p.tip))) p.tip = p.g.findIndex((x, i) => need(i));
        box.innerHTML = `<div class="lgrid" style="grid-template-columns:repeat(${p.n},1fr)">${p.g.map((v, i) => `<button class="lc${v ? ' on' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}"></button>`).join('')}</div>
          <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
        box.querySelectorAll('.lc').forEach(b => {
          b.onclick = () => {
            const i = +b.dataset.i; LG.lightsPress(p.g, p.n, i); p.pr[i] ^= 1; beep(p.g[i] ? 660 : 440, .06, 'square', .05);
            if (p.g.every(Boolean)) { W.lights.render(p, box); setTimeout(() => solve(p), 500); } else W.lights.render(p, box);
          };
        });
        $('#rs').onclick = () => { p.g = p.g0.slice(); p.pr.fill(0); W.lights.render(p, box); };
      },
      hint: () => tr('press')
    },
    simon: {
      init(p) { p.seq = Array.from({ length: [4, 6, 8][G.lvl] }, () => rand(4)); p.i = 0; p.ready = false; },
      render(p, box) {
        box.innerHTML = `<div class="simon">${PAD.map((c, i) => `<button class="pad ${c}" data-i="${i}"></button>`).join('')}</div>
          <p class="cnt" id="sst">${p.ready ? tr('yourTurn') + ' ' + p.i + ' / ' + p.seq.length : ''}</p>
          <div class="row"><button class="btn gold" id="splay">${tr('listen')}</button></div>`;
        $('#splay').onclick = () => playSimon(p);
        box.querySelectorAll('.pad').forEach(b => {
          b.onclick = () => {
            if (!p.ready) return;
            const i = +b.dataset.i; flashPad(i, 250);
            if (i !== p.seq[p.i]) { p.ready = false; p.i = 0; fail(); $('#sst').textContent = ''; return; }
            p.i++; $('#sst').textContent = tr('yourTurn') + ' ' + p.i + ' / ' + p.seq.length;
            if (p.i === p.seq.length) { p.ready = false; setTimeout(() => solve(p), 400); }
          };
        });
      },
      hint: p => tr('simonH', { x: p.seq.slice(0, 2).map(i => L().colors[PAD[i]]).join(', ') })
    },
    clock: {
      init(p) { p.h = 12; p.m = 0; },
      render(p, box) {
        const ha = ((p.h % 12) + p.m / 60) * 30, ma = p.m * 6;
        const ticks = Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * Math.PI / 6; return `<text x="${100 + Math.sin(a) * 74}" y="${106 + -Math.cos(a) * 74}">${i + 1}</text>`; }).join('');
        box.innerHTML = `<svg class="clk" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" class="rim"/><circle cx="100" cy="100" r="88" class="face"/>${ticks}
          <line x1="100" y1="100" x2="100" y2="52" class="hh" transform="rotate(${ha} 100 100)"/><line x1="100" y1="100" x2="100" y2="26" class="mh" transform="rotate(${ma} 100 100)"/><circle cx="100" cy="100" r="6" class="pin"/></svg>
          <div class="row"><span class="ctl">${tr('hour')} <button class="btn" data-a="h-">−</button><button class="btn" data-a="h+">+</button></span>
          <span class="ctl">${tr('minute')} <button class="btn" data-a="m-">−</button><button class="btn" data-a="m+">+</button></span></div>
          <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
        box.querySelectorAll('[data-a]').forEach(b => {
          b.onclick = () => {
            const a = b.dataset.a; beep(900, .02, 'square', .04);
            if (a === 'h+') p.h = p.h % 12 + 1; if (a === 'h-') p.h = (p.h + 10) % 12 + 1;
            if (a === 'm+') { p.m = (p.m + 5) % 60; } if (a === 'm-') { p.m = (p.m + 55) % 60; }
            W.clock.render(p, box);
          };
        });
        $('#ok').onclick = () => { const [th, tm] = p.def.target(G); if (p.h % 12 === th % 12 && p.m === tm) solve(p); else fail(); };
      },
      hint: p => tr('clockH', { x: p.def.target(G)[0] })
    },
    seq: {
      init(p) { p.in = []; },
      render(p, box) {
        const d = p.def, items = d.items(G), ans = d.ans(G);
        const sheet = d.sheet ? `<div class="sheet">🎼 ${esc(d.sheet(G))}</div>` : '';
        const btn = it => d.style === 'books' ? `<button class="book" data-k="${it.k}" style="--c:${({ red: '#d33a2c', orange: '#ec8a22', yellow: '#efd23a', green: '#3fa34d', blue: '#2e6fd1', indigo: '#3b2f9a', violet: '#8e3fbf', brown: '#6b4423', black: '#1d1d22', white: '#e9e6dc', pink: '#ee86b5' })[it.color]}"><span>${esc(it.label)}</span></button>`
          : d.style === 'piano' ? `<button class="key" data-k="${it.k}"><span>${G.lvl < 2 || it.k === 0 ? esc(it.label) : ''}</span></button>`
            : `<button class="idol" data-k="${it.k}"><b>${it.icon}</b><span>${esc(it.label)}</span></button>`;
        box.innerHTML = sheet + `<div class="seq ${d.style}">${items.map(btn).join('')}</div>
          <div class="prog">${ans.map((_, i) => `<i class="${i < p.in.length ? 'on' : ''}"></i>`).join('')}</div>
          <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
        box.querySelectorAll('.seq button').forEach(b => {
          b.onclick = () => {
            const k = isNaN(b.dataset.k) ? b.dataset.k : +b.dataset.k;
            if (d.style === 'piano') beep(NOTEF[k], .35, 'triangle', .16); else beep(500 + p.in.length * 60, .06, 'triangle', .08);
            b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
            p.in.push(k);
            box.querySelectorAll('.prog i').forEach((x, i) => x.classList.toggle('on', i < p.in.length));
            if (p.in.length === ans.length) {
              const ok = p.in.every((x, i) => x === ans[i]); p.in = [];
              if (ok) setTimeout(() => solve(p), 350); else { fail(); setTimeout(() => box.querySelectorAll('.prog i').forEach(x => x.classList.remove('on')), 300); }
            }
          };
        });
        $('#rs').onclick = () => { p.in = []; W.seq.render(p, box); };
      }
    },
    slide: {
      init(p) { p.n = [3, 3, 4][G.lvl]; p.a = LG.genSlide(p.n, [30, 80, 200][G.lvl]); p.img = slideImage(p.def.img, null); p.full = slideImage(p.def.img, G.code[p.def.dig]); },
      render(p, box) {
        const n = p.n, blank = n * n - 1, nums = G.lvl === 0 || p.hl >= 2;
        box.innerHTML = `<div class="slide" style="--n:${n}">${p.a.map((v, i) => v === blank ? '' : `<button class="tile" data-i="${i}" style="left:${(i % n) * 100 / n}%;top:${Math.floor(i / n) * 100 / n}%;background-image:url(${p.img});background-position:${(v % n) * 100 / (n - 1)}% ${Math.floor(v / n) * 100 / (n - 1)}%">${nums ? `<em>${v + 1}</em>` : ''}</button>`).join('')}</div>`;
        box.querySelectorAll('.tile').forEach(b => {
          b.onclick = () => {
            const i = +b.dataset.i, e = p.a.indexOf(blank);
            if (!LG.slideNb(n, i).includes(e)) return;
            [p.a[i], p.a[e]] = [p.a[e], p.a[i]]; beep(300, .04, 'square', .04);
            if (p.a.every((v, k) => v === k)) { box.querySelector('.slide').innerHTML = `<img src="${p.full}" alt="">`; setTimeout(() => solve(p), 700); } else W.slide.render(p, box);
          };
        });
      },
      hint: () => tr('slideH')
    },
    pipes: {
      init(p) { p.P = LG.genPipes([4, 5, 6][G.lvl]); p.P.tiles.forEach(t => { t.c = t.r; }); },
      render(p, box) {
        const { n, tiles, src, dst } = p.P, seen = LG.pipesOk(p.P).seen, theme = G.S.id;
        if (p.hl >= 2 && (p.tip == null || LG.rot(tiles[p.tip].m, tiles[p.tip].r) === tiles[p.tip].m || (tiles[p.tip].m % 5 === 0 && tiles[p.tip].r % 2 === 0))) p.tip = tiles.findIndex(t => t.path && !(t.r % 4 === 0 || ((t.m === 5 || t.m === 10) && t.r % 2 === 0)));
        const svg = m => `<svg viewBox="0 0 100 100">${[[1, '50,50 50,0'], [2, '50,50 100,50'], [4, '50,50 50,100'], [8, '50,50 0,50']].filter(([b]) => m & b).map(([, pts]) => `<polyline points="${pts}"/>`).join('')}<circle cx="50" cy="50" r="13"/></svg>`;
        box.innerHTML = `<div class="pipes ${theme}" style="--n:${n}"><span class="io in" style="top:${(src + .5) * 100 / n}%">▶</span><span class="io out" style="top:${(dst + .5) * 100 / n}%">▶</span>
          <div class="pgrid" style="grid-template-columns:repeat(${n},1fr)">${tiles.map((t, i) => `<button class="pt${seen.has(i) ? ' live' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}"><div style="transform:rotate(${t.c * 90}deg)">${svg(t.m)}</div></button>`).join('')}</div></div>`;
        box.querySelectorAll('.pt').forEach(b => {
          b.onclick = () => {
            const i = +b.dataset.i, t = tiles[i]; t.r = (t.r + 1) % 4; t.c++; beep(420, .03, 'square', .04);
            b.firstElementChild.style.transform = `rotate(${t.c * 90}deg)`;
            const res = LG.pipesOk(p.P);
            box.querySelectorAll('.pt').forEach((x, k) => x.classList.toggle('live', res.seen.has(k)));
            if (res.ok) setTimeout(() => solve(p), 600);
          };
        });
      },
      hint: () => tr('pipeH')
    },
    map: {
      render(p, box) {
        const M = G.v.map, n = M.n;
        box.innerHTML = `<div class="dirs">🧭 ${esc(X(G.v.dirs))}</div><div class="map" style="grid-template-columns:repeat(${n},1fr)">${Array.from({ length: n * n }, (_, i) => {
          const r = Math.floor(i / n), c = i % n, st = r === M.start[0] && c === M.start[1];
          return `<button class="mc${st ? ' st' : ''}" data-i="${i}">${st ? '🗼' : (LG.rot(i * 7 + 3, 1) % 5 === 0 ? '〰' : '')}</button>`;
        }).join('')}</div><p class="cnt">N ↑</p>`;
        box.querySelectorAll('.mc').forEach(b => {
          b.onclick = () => { const i = +b.dataset.i; if (Math.floor(i / n) === M.end[0] && i % n === M.end[1]) { b.textContent = '🐟'; solve(p); } else fail(); };
        });
      },
      hint: () => tr('mapH', { x: G.v.map.end[1] + 1 })
    },
    wlock: {
      init(p, d) { p.w = Array(d.len).fill(0); p.cur = 0; },
      chars: p => p.def.chars === 'digits' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      key(p, ch) { const cs = W.wlock.chars(p), k = cs.indexOf(ch); if (k < 0) return; p.w[p.cur] = k; p.cur = (p.cur + 1) % p.w.length; beep(600, .03, 'square', .05); W.wlock.render(p, $('#pzb')); },
      render(p, box) {
        const cs = W.wlock.chars(p);
        box.innerHTML = `<div class="dials">${p.w.map((v, k) => `<div class="dial"><button data-k="${k}" data-d="1">▲</button><div class="num${k === p.cur ? ' cur' : ''}" data-k="${k}">${cs[v]}</div><button data-k="${k}" data-d="-1">▼</button></div>`).join('')}</div>
          <div class="row"><button class="btn gold" id="ok">${tr('open')}</button></div>`;
        box.querySelectorAll('.dial button').forEach(b => { b.onclick = () => { const k = +b.dataset.k; p.w[k] = (p.w[k] + +b.dataset.d + cs.length) % cs.length; p.cur = k; beep(500, .03, 'square', .05); W.wlock.render(p, box); }; });
        box.querySelectorAll('.num').forEach(b => { b.onclick = () => { p.cur = +b.dataset.k; W.wlock.render(p, box); }; });
        $('#ok').onclick = () => { if (p.w.map(v => cs[v]).join('') === norm(p.def.ans(G))) solve(p); else fail(); };
      },
      hint: p => tr('lockH', { x: norm(p.def.ans(G))[0] })
    }
  };

  // Image du taquin, dessinée selon le scénario, avec le chiffre ★
  function slideImage(kind, d) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 600; const c = cv.getContext('2d');
    const lgr = (y0, y1, a, b) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    if (kind === 'ship') {
      c.fillStyle = lgr(0, 380, '#2b2a5a', '#f08a4b'); c.fillRect(0, 0, 600, 380);
      c.fillStyle = '#ffd27a'; c.beginPath(); c.arc(430, 330, 70, 0, Math.PI * 2); c.fill();
      c.fillStyle = lgr(370, 600, '#1d5a80', '#0a2238'); c.fillRect(0, 370, 600, 230);
      for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(255,210,140,.5)'; c.fillRect(360 + Math.sin(i) * 40, 390 + i * 14, 140 - i * 8, 3); }
      c.fillStyle = '#3a2010'; c.beginPath(); c.moveTo(70, 400); c.lineTo(420, 400); c.lineTo(380, 470); c.lineTo(110, 470); c.fill();
      c.fillStyle = '#5a3418'; c.fillRect(236, 120, 10, 282);
      c.fillStyle = '#f2e6c8'; c.beginPath(); c.moveTo(250, 130); c.lineTo(250, 390); c.lineTo(400, 390); c.fill(); c.beginPath(); c.moveTo(232, 150); c.lineTo(232, 390); c.lineTo(110, 390); c.fill();
      if (d != null) { c.fillStyle = '#ffd27a'; c.font = 'bold 54px Georgia'; c.textAlign = 'center'; c.fillText('★ ' + d, 245, 455); }
      c.strokeStyle = '#1a1a2a'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(120 + i * 60, 90 + i * 20, 14, Math.PI * 1.1, Math.PI * 1.9); c.arc(148 + i * 60, 90 + i * 20, 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    } else {
      c.fillStyle = lgr(0, 600, '#6a6552', '#3a372c'); c.fillRect(0, 0, 600, 600);
      for (let r = 0; r < 6; r++) for (let k = 0; k < 6; k++) { c.strokeStyle = 'rgba(0,0,0,.25)'; c.strokeRect(k * 100 + (r % 2) * 50, r * 100, 100, 100); }
      c.strokeStyle = '#e8c468'; c.lineWidth = 8; c.beginPath(); c.arc(300, 150, 70, 0, Math.PI * 2); c.stroke();
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.beginPath(); c.moveTo(300 + Math.cos(a) * 85, 150 + Math.sin(a) * 85); c.lineTo(300 + Math.cos(a) * 115, 150 + Math.sin(a) * 115); c.stroke(); }
      c.fillStyle = '#4a6a3a'; c.beginPath(); c.ellipse(300, 380, 230, 60, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.moveTo(70, 380); c.lineTo(10, 350); c.lineTo(70, 360); c.fill();
      c.fillStyle = '#f2ead0'; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(380 + i * 14, 362); c.lineTo(387 + i * 14, 345); c.lineTo(394 + i * 14, 362); c.fill(); }
      c.fillStyle = '#ffd27a'; c.beginPath(); c.arc(420, 350, 12, 0, Math.PI * 2); c.fill();
      if (d != null) { c.fillStyle = '#ffd27a'; c.font = 'bold 72px Georgia'; c.textAlign = 'center'; c.fillText('★ ' + d, 300, 540); }
    }
    return cv.toDataURL('image/jpeg', .85);
  }

  window.GameKit = { menu: () => { if (!$('#menu').hidden) renderMenu(); }, fmt, get lang() { return lang; }, get G() { return G; }, W, tr, L, X, solve, fail, beep, sfx, esc, norm, inputRow, bindInput, slideImage, api, ps, renderPz, $ };

  // Signal Morse joué dans la fenêtre (lampe + son)
  let M = null, mOsc = [];
  function stopMorse() { mOsc.forEach(o => { try { o.stop(); } catch { /* déjà arrêté */ } }); mOsc = []; M = null; const l = $('#lamp'); if (l) l.classList.remove('on'); }
  function playMorse() {
    stopMorse();
    const unit = G.cfg.unit, seq = G.mseq; let at = .2;
    seq.forEach(([on, d]) => { if (on) { const o = beep(620, d * unit / 1000, 'sine', .12, at); if (o) mOsc.push(o); } at += d * unit / 1000; });
    M = { t0: performance.now() + 200, seq, unit };
  }
  function lampTick(now) {
    if (!M) return;
    const lamp = $('#lamp'); if (!lamp) { M = null; return; }
    let x = (now - M.t0) / M.unit, on = 0, done = true, shown = '';
    if (x < 0) return;
    for (const [o, d] of M.seq) { if (x < d) { on = o; done = false; break; } x -= d; shown += o ? (d === 1 ? '.' : '-') : (d >= 3 ? ' ' : ''); }
    lamp.classList.toggle('on', !!on);
    if (G.lvl === 1) { const el = $('#trans'); if (el && el.dataset.s !== shown) { el.dataset.s = shown; el.innerHTML = pretty(shown); } }
    if (done) M = null;
  }
  // Séquence du jeu de mémoire
  let simonT = [];
  function stopSimon() { simonT.forEach(clearTimeout); simonT = []; }
  function flashPad(i, ms) { const b = document.querySelector(`.pad[data-i="${i}"]`); if (!b) return; b.classList.add('lit'); beep(PADF[i], ms / 1000, 'triangle', .14); setTimeout(() => b.classList.remove('lit'), ms); }
  function playSimon(p) {
    stopSimon(); p.ready = false; p.i = 0; const step = [700, 560, 430][G.lvl] * (p.hl >= 2 ? 1.5 : 1);
    const st = $('#sst'); if (st) st.textContent = tr('watch');
    p.seq.forEach((v, k) => simonT.push(setTimeout(() => flashPad(v, step * .7), 400 + k * step)));
    simonT.push(setTimeout(() => { p.ready = true; const s = $('#sst'); if (s) s.textContent = tr('yourTurn') + ' 0 / ' + p.seq.length; }, 400 + p.seq.length * step));
  }

  // ---------------- Verrou final ----------------
  function openLock() {
    const need = G.S.finNeed && G.S.finNeed(G);
    if (need) { sfx.bad(); say(X(need)); return; }
    openModal('lock');
  }
  function renderLock() {
    $('#mt').textContent = '🔒 ' + tr('lockT');
    if (G.S.id === 'station' && W.keypad) return W.keypad.render();
    $('#mb').innerHTML = `<p class="ins">${tr('lockI')}</p><div class="lockth ${G.S.id}"><div class="plate">${tr('order')} : ${G.perm.map(s => `<b>${s}</b>`).join(' – ')}</div>
      <div class="dials">${G.dial.map((d, k) => `<div class="dial"><button data-k="${k}" data-d="1">▲</button><div class="num" id="d${k}">${d}</div><button data-k="${k}" data-d="-1">▼</button></div>`).join('')}</div>
      </div><div class="row"><button class="btn gold big" id="ok">${tr('open')}</button></div><div id="fb"></div>`;
    $('#mb').querySelectorAll('.dial button').forEach(b => {
      b.onclick = () => {
        const k = +b.dataset.k; G.dial[k] = (G.dial[k] + +b.dataset.d + 10) % 10; beep(300 + G.dial[k] * 20, .04, 'square', .05);
        const el = $('#d' + k); el.textContent = G.dial[k]; el.classList.remove('roll'); void el.offsetWidth; el.classList.add('roll');
      };
    });
    $('#ok').onclick = () => {
      if (!SYM.every(s => G.found[s])) { sfx.bad(); $('#fb').textContent = tr('lockMissing'); return; }
      if (G.dial.join('') === G.perm.map(s => G.code[s]).join('')) win(); else fail(tr('wrongCode'));
    };
  }
  window.GameKit.win = () => win(); window.GameKit.SYM = SYM;
  function win() {
    const h = G.S.hs.find(x => x.fin && x.v === G.view) || G.S.hs.find(x => x.fin);
    G.winRect = h.r; G.state = 'opening'; G.openAt = performance.now(); closeModal(); $('#hs').innerHTML = ''; stopAmb(); sfx.win();
  }
  function finish(won) {
    G.state = won ? 'won' : 'lost'; G.modal = null; $('#modal').hidden = true; $('#hs').innerHTML = ''; stopMorse(); stopSimon(); stopAmb();
    if (won) {
      const used = Math.round(G.cfg.time - G.left), best = store.get('mt-best2', {}), key = G.sc + '-' + G.lvl;
      G.usedTime = used; G.newBest = !best[key] || used < best[key];
      if (G.newBest) { best[key] = used; store.set('mt-best2', best); }
      G.stars = (G.used <= 1 && G.left > G.cfg.time * .4) ? 3 : (G.left > G.cfg.time * .15 ? 2 : 1);
    } else sfx.lose();
    $('#end').hidden = false; renderEnd();
  }
  function renderEnd() {
    const l = L(), won = G.state === 'won';
    $('#end').innerHTML = won
      ? `<div class="panel story"><div class="stars">${[1, 2, 3].map(n => `<i class="${n <= G.stars ? 'on' : ''}">★</i>`).join('')}</div><h2>${l.win}</h2><p>${X(G.S.outro)}</p>
          <div class="stats"><div><b>${fmt(G.usedTime)}</b>${l.time}</div><div><b>${G.used}</b>${l.hintsUsed}</div><div><b>${'★'.repeat(G.lvl + 1)}</b>${l.lv[G.lvl]}</div></div>
          ${G.newBest ? `<p class="nb">🏆 ${l.newBest}</p>` : ''}<div id="lbWin"></div>
          <div class="row"><button class="btn" id="emenu">${l.menu}</button><button class="btn gold big" id="eagain">${l.again}</button></div></div>`
      : `<div class="panel story"><div class="ico">⏳</div><h2>${l.lose}</h2><p>${l.loseSub}</p>
          <div class="row"><button class="btn" id="emenu">${l.menu}</button><button class="btn gold big" id="eagain">${l.again}</button></div></div>`;
    $('#emenu').onclick = toMenu;
    if (won && window.Leaderboard) window.Leaderboard.onWin(G, $('#lbWin'));
    $('#eagain').onclick = () => { const { sc, lvl } = G; $('#hud').hidden = true; $('#gameui').hidden = true; document.body.classList.add('nohud'); startGame(sc, lvl); };
  }
  let quitArm = 0;
  $('#quit').onclick = () => {
    if (Date.now() - quitArm < 3000) { toMenu(); return; }
    quitArm = Date.now(); $('#quit').textContent = L().quitQ; setTimeout(() => { if (G) $('#quit').textContent = '← ' + L().quit; }, 3000);
  };
  $('#mute').onclick = () => { muted = !muted; store.set('mt-mute', muted); if (muted) { stopAmb(); stopMorse(); } else startAmb(); updateHUD(); };

  // ---------------- Boucle d'animation ----------------
  const cv = $('#cv'), ctx = cv.getContext('2d');
  const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  let menuMx = null, menuMy = null;
  document.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); menuMx = (e.clientX - r.left) / r.width * 1600; menuMy = (e.clientY - r.top) / r.height * 900; });
  function frame(now) {
    const t = now / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (G) {
      const mi = G.S.pzs.morse ? 'morse' : null;
      const st = { f: G.f, v: G.v, code: G.code, held: G.held, mx: G.mx, my: G.my, inv: G.inv,
        morse: G.mseq ? (api.solved(mi) ? 1 : morseOn(G.mseq, G.cfg.unit * 1.25, now)) : (G.f.signal ? 1 : 0),
        glyphWord: G.S.id === 'temple' ? NUMS[lang][G.code['▲']] : '' };
      if (window.FX) window.FX.camera(ctx, t, G.mx, G.my, now - G.fade);
      try { window.Scenes[G.S.views[G.view].scene](ctx, t, st); } catch (e) { if (!frame.err) { frame.err = 1; console.error(e); } }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      if (window.FX) window.FX.grade(ctx, G.S.id);
      // Obscurité et lumière portée
      if (isDark()) {
        if (!canSee()) { ctx.fillStyle = 'rgba(0,0,0,.965)'; ctx.fillRect(0, 0, 1600, 900); }
        else {
          const mx = G.mx ?? 800, my = G.my ?? 450, rad = 300 + Math.sin(t * 9) * 6;
          const g = ctx.createRadialGradient(mx, my, 30, mx, my, rad); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.65, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,.965)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, 1600, 900);
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .18; const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, rad); g2.addColorStop(0, G.S.id === 'temple' ? '#ff9a40' : '#cfe8ff'); g2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, 1600, 900); ctx.restore();
        }
      }
      // Scintillement des cachettes (niveau facile)
      if (G.lvl === 0 && G.state === 'play' && canSee()) G.S.hs.forEach((h, k) => {
        if (!h.hid || h.v !== G.view || G.f['seen_' + k] || (h.show && !h.show(G))) return;
        const a = Math.max(0, Math.sin(t * 2.2 + k * 1.7)) ** 6; if (a < .02) return;
        const x = h.r[0] + h.r[2] * (.3 + R(k) * .4), y = h.r[1] + h.r[3] * (.3 + R(k + 3) * .4), s = 14 + a * 10;
        ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = '#fff6c8'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke(); ctx.restore();
      });
      // Rendu final : halo, particules, lueur de survol, grain
      if (window.FX) {
        window.FX.bloom(ctx, cv, window.FX.theme(G.S.id).bloom);
        if (G.state === 'play' && canSee() && G.mx != null && $('#modal').hidden) {
          const h = G.S.hs.find((h, k) => h.v === G.view && (!h.show || h.show(G)) && (!h.hid || G.f['seen_' + k]) && G.mx >= h.r[0] && G.mx <= h.r[0] + h.r[2] && G.my >= h.r[1] && G.my <= h.r[1] + h.r[3]);
          window.FX.hover(ctx, t, h && h.r);
        }
        window.FX.particles(ctx, t, G.S.id); window.FX.grain(ctx);
      }
      // Fondu au changement de vue
      const fa = 1 - (now - G.fade) / 450; if (fa > 0) { ctx.fillStyle = `rgba(0,0,0,${fa})`; ctx.fillRect(0, 0, 1600, 900); }
      if (G.state === 'play') {
        const dt = Math.min(1, (now - G.last) / 1000); G.last = now; G.left -= dt;
        if (Math.ceil(G.left) !== G.shown) { G.shown = Math.ceil(G.left); showTime(); if (G.left < 10 && G.left > 0) beep(880, .05, 'square', .04); }
        if (G.left <= 0) finish(false);
      }
      if (G.state === 'opening' || G.state === 'won') {
        const p = Math.min(1, (now - G.openAt) / 2400), r = G.winRect, cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = G.state === 'won' ? .55 : Math.min(1, p * 1.4);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 + p * 1700); g.addColorStop(0, '#fffbe6'); g.addColorStop(.35, 'rgba(255,214,120,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1600, 900);
        for (let i = 0; i < 14; i++) { ctx.globalAlpha = .12 * p; ctx.beginPath(); const a = i * Math.PI / 7 + t * .2; ctx.moveTo(cx, cy); ctx.arc(cx, cy, 1900, a, a + .12); ctx.fill(); }
        ctx.restore();
        if (G.state === 'opening' && p >= 1) finish(true);
        if (G.state === 'won') for (let i = 0; i < 130; i++) {
          const life = ((now - G.openAt) / 1000 * (.25 + R(i) * .3) + R(i + 9)) % 1;
          ctx.save(); ctx.translate(R(i + 3) * 1600 + Math.sin(t * 2 + i) * 30, life * 980 - 40); ctx.rotate(t * (1 + R(i) * 4) + i);
          ctx.fillStyle = ['#e8c468', '#62d48a', '#5ad1ff', '#ff7a7a', '#fff'][i % 5]; ctx.fillRect(-7, -4, 14, 8); ctx.restore();
        }
      }
      lampTick(now);
    } else {
      if (window.FX) window.FX.camera(ctx, t, menuMx, menuMy, 1e9);
      try { window.Scenes[SC[menuSc].views.a.scene](ctx, t, { f: {}, v: {}, code: {}, inv: [], morse: 0 }); } catch (e) { if (!frame.err) { frame.err = 1; console.error(e); } }
      if (window.FX) { window.FX.grade(ctx, SC[menuSc].id); window.FX.bloom(ctx, cv, window.FX.theme(SC[menuSc].id).bloom); window.FX.particles(ctx, t, SC[menuSc].id); }
    }
    requestAnimationFrame(frame);
  }

  makeThumbs(); document.documentElement.lang = lang; refresh(); requestAnimationFrame(frame);
  // Accès de débogage pour les tests automatisés
  window.__game = { finish, get G() { return G; }, startGame, solve: id => solve(ps(id)), ps, goView, api };
})();

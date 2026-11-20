// Classement des joueurs : le nom est demandé après chaque victoire, puis enregistré
// en ligne (Supabase, si config.js est rempli) ou, à défaut, dans le navigateur.
(() => {
  'use strict';
  const K = window.GameKit, cfg = window.LB_CONFIG || {}, online = !!(cfg.url && cfg.key);
  const S = {
    fr: { lbTitle: 'Classement', yourName: 'Ton nom pour le classement', save: 'Enregistrer', skip: 'Passer', rank: 'Rang', player: 'Joueur', time: 'Temps', hints: 'Indices', date: 'Date',
      empty: 'Personne n’a encore réussi ce scénario à ce niveau. Sois le premier !', saved: 'Bravo {n} ! Tu es {r}e sur {t}.', lbFirst: 'Bravo {n} ! Tu es 1er sur {t} !', offline: 'Classement en ligne indisponible : score gardé sur cet appareil.',
      local: 'Classement de cet appareil', global: 'Classement mondial', loading: 'Chargement…', close: 'Fermer', top: 'Top 10' },
    en: { lbTitle: 'Leaderboard', yourName: 'Your name for the leaderboard', save: 'Save', skip: 'Skip', rank: 'Rank', player: 'Player', time: 'Time', hints: 'Hints', date: 'Date',
      empty: 'Nobody has beaten this scenario at this level yet. Be the first!', saved: 'Well done {n}! You are #{r} out of {t}.', lbFirst: 'Well done {n}! You are #1 out of {t}!', offline: 'Online leaderboard unavailable: score kept on this device.',
      local: 'This device’s leaderboard', global: 'World leaderboard', loading: 'Loading…', close: 'Close', top: 'Top 10' },
    vi: { lbTitle: 'Bảng xếp hạng', yourName: 'Tên của bạn trên bảng xếp hạng', save: 'Lưu', skip: 'Bỏ qua', rank: 'Hạng', player: 'Người chơi', time: 'Thời gian', hints: 'Gợi ý', date: 'Ngày',
      empty: 'Chưa có ai vượt qua kịch bản này ở cấp độ này. Hãy là người đầu tiên!', saved: 'Giỏi lắm {n}! Bạn đứng hạng {r} trên {t}.', lbFirst: 'Giỏi lắm {n}! Bạn đứng hạng nhất trên {t}!', offline: 'Không kết nối được bảng xếp hạng trực tuyến: điểm được lưu trên máy này.',
      local: 'Bảng xếp hạng trên máy này', global: 'Bảng xếp hạng toàn cầu', loading: 'Đang tải…', close: 'Đóng', top: 'Top 10' }
  };
  for (const l in S) Object.assign(window.T[l], S[l]);
  const tr = (k, v) => K.tr(k, v), esc = s => K.esc(s), $ = s => document.querySelector(s);
  const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* indisponible */ } } };
  const clean = s => String(s).replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
  const same = (a, b) => a.name === b.name && new Date(a.created_at).getTime() === new Date(b.created_at).getTime();
  const byScore = (a, b) => a.seconds - b.seconds || a.hints - b.hints || String(a.created_at).localeCompare(String(b.created_at));

  // ---------- Stockage ----------
  const headers = () => ({ apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' });
  async function fetchAll(scenario, level) {
    if (online) {
      try {
        const r = await fetch(`${cfg.url}/rest/v1/scores?select=name,seconds,hints,created_at&scenario=eq.${encodeURIComponent(scenario)}&level=eq.${level}&order=seconds.asc,hints.asc,created_at.asc&limit=200`, { headers: headers() });
        if (r.ok) return { rows: await r.json(), online: true };
      } catch { /* hors ligne */ }
    }
    return { rows: store.get('mt-scores', []).filter(s => s.scenario === scenario && s.level === level).sort(byScore), online: false };
  }
  async function submit(row) {
    if (online) {
      try { const r = await fetch(`${cfg.url}/rest/v1/scores`, { method: 'POST', headers: { ...headers(), Prefer: 'return=minimal' }, body: JSON.stringify(row) }); if (r.ok) return true; } catch { /* hors ligne */ }
    }
    const all = store.get('mt-scores', []); all.push(row); store.set('mt-scores', all.slice(-500)); return false;
  }

  // ---------- Tableau ----------
  function table(rows, mine) {
    if (!rows.length) return `<p class="cnt">${tr('empty')}</p>`;
    const medal = i => ['🥇', '🥈', '🥉'][i] || (i + 1);
    return `<table class="lb"><tr><th>${tr('rank')}</th><th>${tr('player')}</th><th>${tr('time')}</th><th>${tr('hints')}</th><th>${tr('date')}</th></tr>${rows.slice(0, 10).map((r, i) =>
      `<tr class="${mine && same(r, mine) ? 'me' : ''}"><td>${medal(i)}</td><td>${esc(r.name)}</td><td>${K.fmt(r.seconds)}</td><td>${r.hints}</td><td>${new Date(r.created_at).toLocaleDateString(K.lang)}</td></tr>`).join('')}</table>`;
  }

  // ---------- Après une victoire ----------
  function onWin(G, el) {
    if (!el) return;
    if (G.lbRow) return showResult(G, el);
    el.innerHTML = `<div class="lbform"><label for="lbName">🏆 ${tr('yourName')}</label><div class="row"><input id="lbName" class="ans" maxlength="20" autocomplete="nickname" value="${esc(store.get('mt-name', ''))}"><button class="btn gold" id="lbSave">${tr('save')}</button><button class="btn" id="lbSkip">${tr('skip')}</button></div></div>`;
    const inp = $('#lbName'); inp.style.textTransform = 'none'; inp.focus();
    let busy = false;
    const go = async () => {
      const name = clean(inp.value); if (!name) { inp.focus(); return; }
      if (busy) return; busy = true;
      store.set('mt-name', name); $('#lbSave').disabled = true;
      G.lbRow = { name, scenario: G.S.id, level: G.lvl, seconds: Math.max(1, G.usedTime), hints: G.used, created_at: new Date().toISOString() };
      G.lbOnline = await submit(G.lbRow);
      showResult(G, el);
    };
    $('#lbSave').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
    $('#lbSkip').onclick = () => { el.innerHTML = ''; };
  }
  async function showResult(G, el) {
    el.innerHTML = `<p class="cnt">${tr('loading')}</p>`;
    const { rows, online: on } = await fetchAll(G.S.id, G.lvl), me = G.lbRow;
    if (!rows.some(x => same(x, me))) { rows.push(me); rows.sort(byScore); }
    const r = rows.findIndex(x => same(x, me)) + 1;
    el.innerHTML = `<p class="nb">${tr(r === 1 ? 'lbFirst' : 'saved', { n: esc(me.name), r, t: rows.length })}</p>${!G.lbOnline && online ? `<p class="cnt">${tr('offline')}</p>` : ''}${table(rows, me)}<p class="cnt">${on ? '🌍 ' + tr('global') : '💻 ' + tr('local')}</p>`;
  }

  // ---------- Fenêtre du menu ----------
  let sel = { sc: 0, lv: 1 };
  function open(sc, lv) { sel = { sc, lv }; let box = $('#lbModal'); if (!box) { box = document.createElement('section'); box.id = 'lbModal'; box.className = 'screen'; document.body.appendChild(box); box.onclick = e => { if (e.target === box) box.hidden = true; }; } box.hidden = false; render(); }
  async function render() {
    const box = $('#lbModal'), L = K.L(), SC = window.Content;
    box.innerHTML = `<div class="panel"><div class="ph"><h2>🏆 ${tr('lbTitle')}</h2><button class="btn" id="lbClose">✕</button></div>
      <div class="tabs">${SC.map((s, i) => `<button class="tab${i === sel.sc ? ' on' : ''}" data-s="${i}">${s.icon} ${esc(K.X(s.name))}</button>`).join('')}</div>
      <div class="tabs">${[0, 1, 2].map(i => `<button class="tab${i === sel.lv ? ' on' : ''}" data-l="${i}">${'★'.repeat(i + 1)} ${L.lv[i]}</button>`).join('')}</div>
      <div id="lbBody"><p class="cnt">${tr('loading')}</p></div></div>`;
    $('#lbClose').onclick = () => { box.hidden = true; };
    box.querySelectorAll('[data-s]').forEach(b => { b.onclick = () => { sel.sc = +b.dataset.s; render(); }; });
    box.querySelectorAll('[data-l]').forEach(b => { b.onclick = () => { sel.lv = +b.dataset.l; render(); }; });
    const want = { ...sel }, { rows, online: on } = await fetchAll(SC[sel.sc].id, sel.lv);
    if (want.sc !== sel.sc || want.lv !== sel.lv || box.hidden) return;
    $('#lbBody').innerHTML = table(rows) + `<p class="cnt">${on ? '🌍 ' + tr('global') : '💻 ' + tr('local')}</p>`;
  }
  document.addEventListener('keydown', e => { const b = $('#lbModal'); if (e.key === 'Escape' && b && !b.hidden) b.hidden = true; });
  document.addEventListener('click', e => { if (e.target.closest('.lg[data-l]')) { const b = $('#lbModal'); if (b && !b.hidden) setTimeout(render, 0); } });

  window.Leaderboard = { onWin, open, online };
})();

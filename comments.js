// Commentaires des joueurs, affichés en bas du menu. Ils sont enregistrés dans Supabase
// (table « comments », voir supabase.sql) : tout le monde peut lire et publier, personne ne peut modifier.
// Pour masquer un message indésirable : Supabase › Table Editor › comments › cocher « hidden » (ou supprimer la ligne).
(() => {
  'use strict';
  const K = window.GameKit, cfg = window.LB_CONFIG || {}, online = !!(cfg.url && cfg.key);
  const S = {
    fr: {
      cmTitle: '💬 Vos commentaires', cmIntro: 'Un coup de cœur, une idée, un bogue ? Laisse un mot à la créatrice et aux autres joueurs.',
      cmName: 'Ton prénom', cmMsg: 'Ton commentaire…', cmGeneral: 'Le jeu en général', cmRate: 'Ta note :', cmSend: 'Publier',
      cmSent: 'Merci ! Ton commentaire est publié.', cmWait: 'Attends une minute avant de publier un autre commentaire.', cmShort: 'Écris ton prénom et au moins quelques mots.',
      cmEmpty: 'Aucun commentaire pour l’instant. Sois le premier ou la première !', cmOff: 'Les commentaires ne sont pas encore activés.', cmErr: 'Impossible de publier pour le moment. Réessaie plus tard.',
      cmLoading: 'Chargement des commentaires…', cmMore: 'Voir plus de commentaires', cmPublic: 'Ton prénom et ton message seront visibles par tout le monde. Reste poli·e, et n’écris pas d’informations personnelles.'
    },
    en: {
      cmTitle: '💬 Your comments', cmIntro: 'A favourite, an idea, a bug? Leave a note for the creator and other players.',
      cmName: 'Your first name', cmMsg: 'Your comment…', cmGeneral: 'The game in general', cmRate: 'Your rating:', cmSend: 'Post',
      cmSent: 'Thank you! Your comment is posted.', cmWait: 'Please wait a minute before posting another comment.', cmShort: 'Write your name and at least a few words.',
      cmEmpty: 'No comments yet. Be the first!', cmOff: 'Comments are not enabled yet.', cmErr: 'Unable to post right now. Please try again later.',
      cmLoading: 'Loading comments…', cmMore: 'Show more comments', cmPublic: 'Your name and message will be visible to everyone. Be kind, and don’t share personal information.'
    },
    vi: {
      cmTitle: '💬 Bình luận của bạn', cmIntro: 'Một màn chơi yêu thích, một ý tưởng, một lỗi? Hãy để lại lời nhắn cho tác giả và những người chơi khác.',
      cmName: 'Tên của bạn', cmMsg: 'Bình luận của bạn…', cmGeneral: 'Trò chơi nói chung', cmRate: 'Đánh giá:', cmSend: 'Đăng',
      cmSent: 'Cảm ơn bạn! Bình luận đã được đăng.', cmWait: 'Hãy chờ một phút trước khi đăng bình luận khác.', cmShort: 'Hãy ghi tên và viết ít nhất vài chữ.',
      cmEmpty: 'Chưa có bình luận nào. Hãy là người đầu tiên!', cmOff: 'Chức năng bình luận chưa được bật.', cmErr: 'Hiện không thể đăng. Hãy thử lại sau.',
      cmLoading: 'Đang tải bình luận…', cmMore: 'Xem thêm bình luận', cmPublic: 'Tên và lời nhắn của bạn sẽ hiển thị công khai. Hãy lịch sự và đừng ghi thông tin cá nhân.'
    }
  };
  for (const l in S) Object.assign(window.T[l], S[l]);
  const tr = k => K.tr(k), esc = s => K.esc(s), X = t => K.X(t);
  const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* indisponible */ } } };
  const clean = (s, n, multi) => String(s).replace(multi ? /[\u0000-\u0009\u000b-\u001f<>]/g : /[\u0000-\u001f<>]/g, '').replace(multi ? /[ \t]+/g : /\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
  const headers = () => ({ apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' });
  const st = { rows: null, status: 'idle', draft: { name: store.get('mt-name', ''), msg: '', sc: '', rating: 0 }, note: '', shown: 8, busy: false };

  async function load() {
    st.status = 'loading';
    if (!online) { st.status = 'off'; return; }
    try {
      const r = await fetch(`${cfg.url}/rest/v1/comments?select=name,message,scenario,rating,created_at&order=created_at.desc&limit=100`, { headers: headers() });
      if (!r.ok) { st.status = 'off'; return; }
      st.rows = await r.json(); st.status = 'ok';
    } catch { st.status = 'off'; }
  }
  async function post() {
    const d = st.draft, name = clean(d.name, 20), message = clean(d.msg, 600, true);
    if (!name || message.length < 3) { st.note = tr('cmShort'); return render(); }
    if (Date.now() - store.get('mt-cm-last', 0) < 60000) { st.note = tr('cmWait'); return render(); }
    if (st.busy) return; st.busy = true;
    const row = { name, message, scenario: d.sc || null, rating: d.rating || null };
    try {
      const r = await fetch(`${cfg.url}/rest/v1/comments`, { method: 'POST', headers: { ...headers(), Prefer: 'return=minimal' }, body: JSON.stringify(row) });
      if (!r.ok) throw new Error(r.status);
      store.set('mt-cm-last', Date.now()); store.set('mt-name', name);
      (st.rows = st.rows || []).unshift({ ...row, created_at: new Date().toISOString() });
      d.msg = ''; d.rating = 0; st.note = tr('cmSent');
    } catch { st.note = tr('cmErr'); }
    st.busy = false; render();
  }

  const scName = id => { const s = (window.Content || []).find(x => x.id === id); return s ? s.icon + ' ' + X(s.name) : ''; };
  function item(c) {
    const date = new Date(c.created_at).toLocaleDateString(K.lang, { day: 'numeric', month: 'short', year: 'numeric' });
    return `<article class="cm"><header><b>${esc(c.name)}</b>${c.rating ? `<span class="st">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</span>` : ''}${c.scenario && scName(c.scenario) ? `<span class="sc2">${esc(scName(c.scenario))}</span>` : ''}<span>${date}</span></header><p>${esc(c.message)}</p></article>`;
  }
  function render() {
    const el = document.getElementById('cmts'); if (!el) return;
    const d = st.draft, focus = document.activeElement && document.activeElement.id;
    let list;
    if (st.status === 'off') list = `<p class="cnt">${tr('cmOff')}</p>`;
    else if (st.status !== 'ok') list = `<p class="cnt">${tr('cmLoading')}</p>`;
    else if (!st.rows.length) list = `<p class="cnt">${tr('cmEmpty')}</p>`;
    else list = st.rows.slice(0, st.shown).map(item).join('') + (st.rows.length > st.shown ? `<div class="row"><button class="btn" id="cmMore">${tr('cmMore')}</button></div>` : '');
    el.innerHTML = `<h3>${tr('cmTitle')}</h3><p>${tr('cmIntro')}</p>
      ${st.status === 'off' ? '' : `<div class="cmform">
        <input id="cmName" maxlength="20" autocomplete="nickname" placeholder="${esc(tr('cmName'))}" value="${esc(d.name)}">
        <select id="cmSc"><option value="">${esc(tr('cmGeneral'))}</option>${(window.Content || []).map(s => `<option value="${s.id}"${d.sc === s.id ? ' selected' : ''}>${esc(s.icon + ' ' + X(s.name))}</option>`).join('')}</select>
        <textarea id="cmMsg" maxlength="600" placeholder="${esc(tr('cmMsg'))}">${esc(d.msg)}</textarea>
        <div class="cmrow"><div class="cmstars">${tr('cmRate')} ${[1, 2, 3, 4, 5].map(n => `<button data-n="${n}" class="${n <= d.rating ? 'on' : ''}" aria-label="${n}/5">★</button>`).join('')}</div>
          <button class="btn gold" id="cmSend"${st.busy ? ' disabled' : ''}>${tr('cmSend')}</button></div>
        <p class="cmnote">${esc(st.note)}</p><p class="cmhint">${tr('cmPublic')}</p></div>`}
      <div class="cmlist">${list}</div>`;
    const $ = id => document.getElementById(id);
    if ($('cmName')) {
      $('cmName').oninput = e => { d.name = e.target.value; };
      $('cmMsg').oninput = e => { d.msg = e.target.value; };
      $('cmSc').onchange = e => { d.sc = e.target.value; };
      el.querySelectorAll('.cmstars button').forEach(b => { b.onclick = () => { d.rating = d.rating === +b.dataset.n ? 0 : +b.dataset.n; render(); }; });
      $('cmSend').onclick = post;
      if (focus && $(focus)) $(focus).focus();
    }
    if ($('cmMore')) $('cmMore').onclick = () => { st.shown += 10; render(); };
  }
  async function mount() {
    render();
    if (st.status === 'idle') { await load(); render(); }
  }

  window.Comments = { mount, reload() { st.status = 'idle'; return mount(); } };
  // Le menu a été dessiné avant le chargement du classement et des commentaires : on le redessine une fois tout prêt.
  if (K.menu) K.menu(); else if (document.getElementById('cmts')) mount();
})();

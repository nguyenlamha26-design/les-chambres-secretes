// Mode enquête : un dossier par affaire, des scellés à ouvrir, des documents à lire,
// des missions par chapitre, une réponse à justifier par une pièce, un score sur 1000.
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const lang = () => (window.GameKit ? window.GameKit.lang : 'fr');
  const X = v => v == null ? '' : (typeof v === 'object' && !Array.isArray(v) && 'fr' in v) ? (v[lang()] ?? v.fr) : String(v);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const H = v => esc(X(v)).replace(/\n/g, '<br>');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  const click = () => { try { window.GameKit.sfx.click(); } catch (e) { /* sans son */ } };
  const beep = (...a) => { try { window.GameKit.beep(...a); } catch (e) { /* sans son */ } };
  window.Dossiers = window.Dossiers || [];

  // ---------------- Textes de l'interface ----------------
  const U = {
    fr: {
      modeEsc: 'Jeux d’évasion', modeEscD: 'Explore des salles, fouille, résous des énigmes', modeEnq: 'Enquêtes', modeEnqD: 'Lis le dossier, recoupe les preuves, désigne le coupable',
      archTitle: 'Archives des affaires', archSub: 'Chaque dossier est une vraie enquête : constats, rapports, dépositions, messages, caméras. Lis, recoupe, puis rends tes conclusions, preuve à l’appui.',
      docs: 'documents', people: 'personnes', chaps: 'chapitres', open: 'Ouvrir le dossier', resume: 'Reprendre', restart: 'Recommencer', solved: 'Classé', inProg: 'En cours · chapitre {n}', best: 'Meilleur score', pts: 'pts',
      confirmRestart: 'Recommencer ce dossier depuis le début ? Ta progression sera effacée.',
      startShift: 'Prendre le service', skip: 'Passer', incoming: 'Appel entrant', pickUp: 'Décrocher', next: 'Suite', openFile: 'Ouvrir le dossier',
      chap: 'Chapitre', mission: 'Mission', order: 'Ordre de mission', score: 'Score', read: 'Documents lus', report: 'Rendre mes conclusions',
      sealed: 'Scellés', sealedSub: 'Touche un scellé pour l’ouvrir', locked: 'S’ouvre au chapitre {n}', unseal: 'Briser le scellé', newDoc: 'NOUVEAU', opened: 'Scellé ouvert : {n} document(s) épinglé(s) au tableau.',
      notes: 'Carnet', notesPh: 'Tes notes, hypothèses, heures à recouper… (enregistré automatiquement)', hint: 'Indice', hintCost: 'Un indice coûte 100 points. Le prendre ?', rules: 'Règles', quit: 'Archives',
      rulesBody: 'Ouvre les scellés de la colonne de droite : leurs documents s’épinglent au tableau. Lis-les tous, recoupe les heures, les lieux et les mensonges.\nChaque chapitre contient des missions. Pour en valider une, choisis ta réponse ET la pièce qui la prouve.\nTu commences avec 1000 points. Mauvaise réponse : −100. Accuser un innocent : −250. Mauvaise pièce justificative : −50. Indice : −100.\nUtilise le carnet pour noter tes pistes, et marque les personnes comme suspectes ou écartées.',
      answer: 'Ta réponse', proof: 'Pièce justificative', proofSub: 'Choisis, parmi les documents lus, celui qui le prouve.', noRead: 'Lis d’abord des documents du dossier.', send: 'Envoyer',
      needAns: 'Choisis une réponse.', needDoc: 'Joins une pièce justificative.', wrongAns: '« Ce n’est pas ce que disent les pièces. Relis le dossier. » (−{n} points)', wrongAcc: '« Tu accuses quelqu’un d’innocent ! Reprends tout depuis le début. » (−250 points)', wrongDoc: '« La conclusion est bonne, mais cette pièce ne le prouve pas. » (−50 points)',
      okTitle: 'Mission accomplie', newSeals: 'Nouveaux scellés disponibles.', cont: 'Continuer', back: 'Retour au tableau',
      endTitle: 'Dossier classé', truth: 'Ce qui s’est vraiment passé', time: 'Temps', errors: 'Erreurs', hints: 'Indices', toArch: 'Retour aux archives', replay: 'Rejouer',
      ranks: ['Stagiaire', 'Enquêteur·rice', 'Inspecteur·rice principal·e', 'Commissaire'],
      victim: 'Victime', markQ: 'À vérifier', markS: 'Suspect·e', markC: 'Écarté·e', age: '{n} ans', close: 'Fermer', prev: '◀', nextD: '▶',
      k: { report: 'Rapport', pv: 'Procès-verbal', dep: 'Déposition', sms: 'Messages', cam: 'Caméra', bill: 'Reçu', bank: 'Relevé', photo: 'Photo', note: 'Note', letter: 'Lettre', calls: 'Appels' },
      depT: 'DÉPOSITION', depOf: 'Témoin', q: 'Question', ownerOf: 'Téléphone de {x}', camT: 'EXTRAIT VIDÉO', total: 'TOTAL'
    },
    en: {
      modeEsc: 'Escape games', modeEscD: 'Explore rooms, search, solve puzzles', modeEnq: 'Investigations', modeEnqD: 'Read the case file, cross-check the evidence, name the culprit',
      archTitle: 'Case archives', archSub: 'Each file is a real investigation: reports, statements, messages, camera logs. Read, cross-check, then submit your conclusions, with evidence.',
      docs: 'documents', people: 'people', chaps: 'chapters', open: 'Open the file', resume: 'Resume', restart: 'Restart', solved: 'Closed', inProg: 'In progress · chapter {n}', best: 'Best score', pts: 'pts',
      confirmRestart: 'Restart this case from the beginning? Your progress will be erased.',
      startShift: 'Start your shift', skip: 'Skip', incoming: 'Incoming call', pickUp: 'Answer', next: 'Next', openFile: 'Open the file',
      chap: 'Chapter', mission: 'Mission', order: 'Orders', score: 'Score', read: 'Documents read', report: 'Submit my conclusions',
      sealed: 'Sealed evidence', sealedSub: 'Tap a seal to open it', locked: 'Opens in chapter {n}', unseal: 'Break the seal', newDoc: 'NEW', opened: 'Seal broken: {n} document(s) pinned to the board.',
      notes: 'Notebook', notesPh: 'Your notes, theories, times to cross-check… (saved automatically)', hint: 'Hint', hintCost: 'A hint costs 100 points. Take it?', rules: 'Rules', quit: 'Archives',
      rulesBody: 'Open the seals in the right-hand column: their documents get pinned to the board. Read them all, cross-check times, places and lies.\nEach chapter has missions. To complete one, choose your answer AND the document that proves it.\nYou start with 1000 points. Wrong answer: −100. Accusing an innocent person: −250. Wrong supporting document: −50. Hint: −100.\nUse the notebook for your leads, and mark people as suspects or cleared.',
      answer: 'Your answer', proof: 'Supporting document', proofSub: 'Choose, among the documents you have read, the one that proves it.', noRead: 'Read some documents from the file first.', send: 'Send',
      needAns: 'Choose an answer.', needDoc: 'Attach a supporting document.', wrongAns: '“That’s not what the evidence says. Read the file again.” (−{n} points)', wrongAcc: '“You’re accusing an innocent person! Go back over everything.” (−250 points)', wrongDoc: '“The conclusion is right, but that document doesn’t prove it.” (−50 points)',
      okTitle: 'Mission complete', newSeals: 'New sealed evidence available.', cont: 'Continue', back: 'Back to the board',
      endTitle: 'Case closed', truth: 'What really happened', time: 'Time', errors: 'Mistakes', hints: 'Hints', toArch: 'Back to the archives', replay: 'Play again',
      ranks: ['Trainee', 'Investigator', 'Senior inspector', 'Chief inspector'],
      victim: 'Victim', markQ: 'To check', markS: 'Suspect', markC: 'Cleared', age: 'age {n}', close: 'Close', prev: '◀', nextD: '▶',
      k: { report: 'Report', pv: 'Official record', dep: 'Statement', sms: 'Messages', cam: 'Camera', bill: 'Receipt', bank: 'Statement', photo: 'Photo', note: 'Note', letter: 'Letter', calls: 'Calls' },
      depT: 'WITNESS STATEMENT', depOf: 'Witness', q: 'Question', ownerOf: '{x}’s phone', camT: 'VIDEO EXTRACT', total: 'TOTAL'
    },
    vi: {
      modeEsc: 'Thoát phòng', modeEscD: 'Khám phá căn phòng, lục tìm, giải câu đố', modeEnq: 'Phá án', modeEnqD: 'Đọc hồ sơ, đối chiếu chứng cứ, chỉ ra thủ phạm',
      archTitle: 'Kho hồ sơ vụ án', archSub: 'Mỗi hồ sơ là một cuộc điều tra thật sự: biên bản, báo cáo, lời khai, tin nhắn, camera. Hãy đọc, đối chiếu, rồi đưa ra kết luận kèm bằng chứng.',
      docs: 'tài liệu', people: 'nhân vật', chaps: 'chương', open: 'Mở hồ sơ', resume: 'Tiếp tục', restart: 'Chơi lại', solved: 'Đã khép', inProg: 'Đang điều tra · chương {n}', best: 'Điểm cao nhất', pts: 'điểm',
      confirmRestart: 'Điều tra lại hồ sơ này từ đầu? Tiến trình sẽ bị xóa.',
      startShift: 'Vào ca trực', skip: 'Bỏ qua', incoming: 'Cuộc gọi đến', pickUp: 'Nhấc máy', next: 'Tiếp', openFile: 'Mở hồ sơ',
      chap: 'Chương', mission: 'Nhiệm vụ', order: 'Lệnh giao', score: 'Điểm', read: 'Tài liệu đã xem', report: 'Gửi kết luận',
      sealed: 'Hồ sơ niêm phong', sealedSub: 'Chạm vào để bóc niêm phong', locked: 'Mở ở chương {n}', unseal: 'Bóc niêm phong', newDoc: 'MỚI', opened: 'Đã bóc niêm phong: {n} tài liệu được ghim lên bảng.',
      notes: 'Sổ tay', notesPh: 'Ghi chú, giả thuyết, các mốc giờ cần đối chiếu… (tự động lưu)', hint: 'Manh mối', hintCost: 'Mỗi manh mối trừ 100 điểm. Vẫn lấy?', rules: 'Luật chơi', quit: 'Kho hồ sơ',
      rulesBody: 'Bóc các hồ sơ niêm phong ở cột bên phải: tài liệu bên trong sẽ được ghim lên bảng. Hãy đọc hết, đối chiếu giờ giấc, địa điểm và những lời nói dối.\nMỗi chương có các nhiệm vụ. Để hoàn thành, hãy chọn câu trả lời VÀ tài liệu chứng minh điều đó.\nBạn bắt đầu với 1000 điểm. Trả lời sai: −100. Buộc tội người vô tội: −250. Nộp sai tài liệu: −50. Manh mối: −100.\nDùng sổ tay để ghi lại hướng điều tra, và đánh dấu từng người là nghi phạm hay đã loại trừ.',
      answer: 'Câu trả lời', proof: 'Tài liệu chứng minh', proofSub: 'Chọn, trong số tài liệu đã đọc, tài liệu chứng minh điều đó.', noRead: 'Hãy đọc tài liệu trong hồ sơ trước.', send: 'Gửi',
      needAns: 'Hãy chọn một câu trả lời.', needDoc: 'Hãy đính kèm tài liệu chứng minh.', wrongAns: '« Hồ sơ không nói vậy. Đọc lại đi. » (−{n} điểm)', wrongAcc: '« Bạn đang buộc tội người vô tội! Xem lại toàn bộ đi. » (−250 điểm)', wrongDoc: '« Kết luận đúng, nhưng tài liệu này không chứng minh được. » (−50 điểm)',
      okTitle: 'Hoàn thành nhiệm vụ', newSeals: 'Có hồ sơ niêm phong mới.', cont: 'Tiếp tục', back: 'Quay lại bảng',
      endTitle: 'Hồ sơ đã khép', truth: 'Sự thật', time: 'Thời gian', errors: 'Lần sai', hints: 'Manh mối', toArch: 'Về kho hồ sơ', replay: 'Chơi lại',
      ranks: ['Thực tập sinh', 'Điều tra viên', 'Điều tra viên chính', 'Trưởng phòng điều tra'],
      victim: 'Nạn nhân', markQ: 'Cần xác minh', markS: 'Nghi phạm', markC: 'Đã loại trừ', age: '{n} tuổi', close: 'Đóng', prev: '◀', nextD: '▶',
      k: { report: 'Báo cáo', pv: 'Biên bản', dep: 'Lời khai', sms: 'Tin nhắn', cam: 'Camera', bill: 'Hóa đơn', bank: 'Sao kê', photo: 'Ảnh', note: 'Ghi chú', letter: 'Thư', calls: 'Cuộc gọi' },
      depT: 'BIÊN BẢN LỜI KHAI', depOf: 'Người khai', q: 'Hỏi', ownerOf: 'Điện thoại của {x}', camT: 'TRÍCH XUẤT CAMERA', total: 'TỔNG'
    }
  };
  const u = (k, p) => { let s = (U[lang()] || U.fr)[k] ?? U.fr[k]; if (p) for (const n in p) s = s.split('{' + n + '}').join(p[n]); return s; };
  const ICON = { report: '📑', pv: '📋', dep: '🗣️', sms: '💬', cam: '📹', bill: '🧾', bank: '🏦', photo: '📷', note: '🗒️', letter: '✉️', calls: '📞' };

  // ---------------- Portraits ----------------
  function face(f, big) {
    f = f || {}; const s = f.s || '#e8c4a0', h = f.h || '#2a2018', c = f.c || '#3a4a6a', st = f.st || 'short';
    const hair = {
      short: `<path d="M30 46c0-20 12-30 30-30s30 10 30 30c-6-10-16-14-30-14s-24 4-30 14z" fill="${h}"/>`,
      side: `<path d="M29 50c-2-22 12-34 31-34 20 0 32 12 30 34-4-12-14-18-36-16-12 1-20 6-25 16z" fill="${h}"/>`,
      long: `<path d="M26 92c-4-30-6-76 34-76s38 46 34 76l-10-4c4-20 4-38-2-48-8 6-20 8-38 6-6 12-6 26-8 46z" fill="${h}"/>`,
      bun: `<circle cx="60" cy="14" r="10" fill="${h}"/><path d="M30 48c0-20 12-30 30-30s30 10 30 30c-8-12-18-16-30-16s-22 4-30 16z" fill="${h}"/>`,
      bald: `<path d="M30 52c0-6 2-10 4-12M90 52c0-6-2-10-4-12" stroke="${h}" stroke-width="6" fill="none"/>`,
      cap: `<path d="M28 40c2-16 14-24 32-24s30 8 32 24z" fill="${h}"/><rect x="58" y="36" width="44" height="7" rx="3" fill="${h}"/>`
    }[st] || '';
    return `<svg class="face${big ? ' big' : ''}" viewBox="0 0 120 130" aria-hidden="true">
      <rect width="120" height="130" fill="${f.bg || '#cfd3d6'}"/>${[30, 50, 70, 90, 110].map(y => `<line x1="0" x2="120" y1="${y}" y2="${y}" stroke="#0002"/>`).join('')}
      <path d="M10 130c4-30 22-40 50-40s46 10 50 40z" fill="${c}"/><path d="M50 92l10 14 10-14z" fill="${f.sh || '#f2efe8'}"/>
      <rect x="52" y="74" width="16" height="20" fill="${s}"/><ellipse cx="60" cy="54" rx="27" ry="32" fill="${s}"/>
      ${hair}${f.old ? `<path d="M44 74q16 6 32 0M42 40q6-3 12 0M66 40q6-3 12 0" stroke="#0003" fill="none" stroke-width="1.5"/>` : ''}
      <circle cx="49" cy="56" r="3" fill="#2a1a14"/><circle cx="71" cy="56" r="3" fill="#2a1a14"/>
      ${f.g ? `<g fill="none" stroke="#222" stroke-width="2"><circle cx="49" cy="56" r="8"/><circle cx="71" cy="56" r="8"/><path d="M57 56h6"/></g>` : ''}
      ${f.m ? `<path d="M48 72q12-5 24 0" stroke="${h}" stroke-width="4" fill="none"/>` : ''}
      <path d="M52 76q8 4 16 0" stroke="#8a4a3a" stroke-width="2.5" fill="none"/>
    </svg>`;
  }

  // ---------------- Rendu des documents ----------------
  const rowsT = rows => `<table class="dtab">${rows.map(r => `<tr>${r.map((c, i) => `<${i ? 'td' : 'th'}>${H(c)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</table>`;
  const paras = b => b ? `<div class="dbody">${X(b).split('\n').map(p => p ? `<p>${esc(p)}</p>` : '').join('')}</div>` : '';
  function docHTML(d) {
    const k = d.k;
    if (k === 'sms') return `<div class="phone"><div class="phtop">${d.label ? H(d.label) : esc(u('ownerOf', { x: X(d.owner) }))}<b>${H(d.with)}</b></div><div class="phmsgs">${d.msgs.map(m => m[0] === 'day' ? `<div class="phday">${H(m[1])}</div>`
      : `<div class="bub${m[0] ? ' me' : ''}">${H(m[2])}<i>${esc(m[1])}</i></div>`).join('')}</div>${d.foot ? `<p class="phfoot">${H(d.foot)}</p>` : ''}</div>`;
    if (k === 'cam') return `<div class="cctv"><div class="cchead"><span>● REC</span><b>${H(d.src)}</b><span>${H(d.day)}</span></div>${d.rows.map(r => `<div class="ccrow"><time>${esc(r[0])}</time><p>${H(r[1])}</p></div>`).join('')}${d.foot ? `<p class="ccfoot">${H(d.foot)}</p>` : ''}</div>`;
    if (k === 'bill') return `<div class="rcpt"><h4>${H(d.org)}</h4><p class="rsub">${H(d.sub)}</p><hr>${d.items.map(r => `<div class="rl"><span>${H(r[0])}</span><span>${H(r[1])}</span></div>`).join('')}<hr>
      <div class="rl tot"><span>${u('total')}</span><span>${H(d.total)}</span></div>${d.foot ? `<p class="rsub">${H(d.foot)}</p>` : ''}</div>`;
    if (k === 'photo') return `<figure class="polar"><div class="shot" style="background:${d.bg || '#3a3a3a'}">${d.items.map(it => `<span style="left:${it[1]}%;top:${it[2]}%;font-size:${it[3] || 40}px">${it[0]}</span>`).join('')}
      ${(d.marks || []).map(m => `<em style="left:${m[1]}%;top:${m[2]}%">${m[0]}</em>`).join('')}</div><figcaption>${H(d.cap)}</figcaption>
      ${d.legend ? `<ol class="legend">${d.legend.map(l => `<li>${H(l)}</li>`).join('')}</ol>` : ''}</figure>`;
    const head = `<div class="phead"><span>${H(d.org)}</span><span>${esc(d.ref || '')}</span></div>`;
    if (k === 'dep') return `<div class="paper dep">${head}<h3>${u('depT')}</h3><div class="dmeta">${(d.meta || []).map(r => `<p><b>${H(r[0])}</b> ${H(r[1])}</p>`).join('')}</div>
      ${d.qa.map(([q, a]) => `<p class="dq">— ${H(q)}</p><p class="da">${H(a)}</p>`).join('')}${d.sign ? `<p class="dsign">${H(d.sign)}</p>` : ''}</div>`;
    if (k === 'letter' || k === 'note') return `<div class="paper ${k}">${d.org ? head : ''}<h3>${H(d.t2 || '')}</h3>${d.rows ? rowsT(d.rows) : ''}${paras(d.body)}${d.sign ? `<p class="dsign">${H(d.sign)}</p>` : ''}</div>`;
    return `<div class="paper ${k}">${head}<h3>${H(d.t2 || d.t)}</h3>${d.sub ? `<p class="dsub">${H(d.sub)}</p>` : ''}${d.rows ? rowsT(d.rows) : ''}${paras(d.body)}
      ${d.stamp ? `<div class="stamp">${H(d.stamp)}</div>` : ''}${d.sign ? `<p class="dsign">${H(d.sign)}</p>` : ''}</div>`;
  }

  // ---------------- État ----------------
  let C = null, st = null, view = 'board', modal = null, ring = null, toastT = null, shown = null;
  const KEY = id => 'mt-dos-' + id;
  const fresh = c => ({ intro: 0, open: [], read: [], ch: 0, m: 0, score: 1000, hints: {}, notes: '', marks: {}, done: false, t0: Date.now(), t: 0, err: 0, sel: {}, pd: {} });
  const save = () => { if (C && st) store.set(KEY(C.id), st); };
  const folderOf = id => C.folders.find(f => f.docs.includes(id));
  const openDocs = () => C.folders.filter(f => st.open.includes(f.id)).flatMap(f => f.docs);
  const mission = () => C.chapters[st.ch] && C.chapters[st.ch].missions[st.m];
  const seed = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const order = (n, key) => { const a = [...Array(n).keys()]; let h = seed(key); for (let i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ensureEl = () => {
    let el = $('#dossier'); if (!el) { el = document.createElement('section'); el.id = 'dossier'; el.className = 'screen'; el.hidden = true; document.body.appendChild(el); }
    return el;
  };
  const toast = msg => { const t = $('#dtoast'); if (!t) return; t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); };

  // ---------------- Liste des dossiers (dans le menu) ----------------
  function list(el) {
    const best = store.get('mt-dos-best', {});
    el.innerHTML = `<div class="darch"><h3>🗄️ ${u('archTitle')}</h3><p class="dsubt">${u('archSub')}</p><div class="dfiles">${window.Dossiers.map(c => {
      const s = store.get(KEY(c.id), null), n = c.folders.reduce((a, f) => a + f.docs.length, 0);
      const status = s && s.done ? `<span class="dst ok">✔ ${u('solved')} · ${s.score} ${u('pts')}</span>` : s && (s.open.length || s.intro) ? `<span class="dst">${u('inProg', { n: s.ch + 1 })}</span>` : '';
      return `<article class="dfile" style="--acc:${c.color || '#c8302a'}"><div class="dfhead"><span>${H(c.place)}</span><span>DOSSIER ${esc(c.no)}</span></div>
        <div class="dfic">${c.icon}</div><h4>${H(c.title)}</h4><p>${H(c.pitch)}</p>
        <div class="dfstats"><span>📄 ${n} ${u('docs')}</span><span>👤 ${c.people.length} ${u('people')}</span><span>📚 ${c.chapters.length} ${u('chaps')}</span></div>
        ${status}${best[c.id] != null ? `<span class="dst best">🏆 ${u('best')} : ${best[c.id]} ${u('pts')}</span>` : ''}
        <div class="dfbtns"><button class="dbtn red" data-open="${c.id}">${s && !s.done && (s.open.length || s.intro) ? u('resume') : u('open')} →</button>${s ? `<button class="dbtn ghost" data-restart="${c.id}">↺ ${u('restart')}</button>` : ''}</div></article>`;
    }).join('')}</div></div>`;
    el.querySelectorAll('[data-open]').forEach(b => { b.onclick = () => { click(); openCase(b.dataset.open, false); }; });
    el.querySelectorAll('[data-restart]').forEach(b => { b.onclick = () => { if (!confirm(u('confirmRestart'))) return; click(); openCase(b.dataset.restart, true); }; });
  }

  // ---------------- Ouverture / sortie ----------------
  function openCase(id, restart) {
    C = window.Dossiers.find(c => c.id === id); if (!C) return;
    st = restart ? null : store.get(KEY(id), null);
    if (!st || st.done) st = fresh(C);
    st.t0 = Date.now() - (st.t || 0) * 1000;
    save(); view = st.intro >= 3 ? 'board' : 'intro'; modal = null;
    $('#menu').hidden = true; ensureEl().hidden = false; document.body.classList.add('dosmode'); window.scrollTo(0, 0); render();
  }
  function quit() {
    stopRing(); if (st && !st.done) { st.t = Math.round((Date.now() - st.t0) / 1000); save(); }
    C = null; st = null; modal = null; ensureEl().hidden = true; ensureEl().innerHTML = ''; document.body.classList.remove('dosmode');
    $('#menu').hidden = false; if (window.GameKit) window.GameKit.menu();
  }
  const stopRing = () => { if (ring) { clearInterval(ring); ring = null; } };

  // ---------------- Rendu général ----------------
  const langs = () => `<div class="dlangs">${[['fr', 'FR'], ['en', 'EN'], ['vi', 'VI']].map(([c, n]) => `<button class="lg${c === lang() ? ' on' : ''}" data-l="${c}">${n}</button>`).join('')}</div>`;
  function render() {
    if (!C) return; const el = ensureEl();
    if (view === 'intro') return renderIntro(el);
    if (view === 'end') return renderEnd(el);
    renderBoard(el);
  }

  function renderIntro(el) {
    const I = C.intro;
    let body;
    if (st.intro === 0) {
      stopRing();
      body = `<div class="dint s0"><div class="dclock">${esc(I.time)}</div><p class="ddate">${H(I.date)}</p><p class="dunit">${H(I.unit)}</p><p class="dlead">${H(I.lead)}</p><button class="dbtn light" id="dgo">${u('startShift')}</button></div>`;
    } else if (st.intro === 1) {
      body = `<div class="dint s1"><div class="dring">☎</div><p class="dunit">${u('incoming')}</p><h2>${H(I.boss.name)}</h2><p class="ddate">${H(I.boss.role)}</p><button class="dbtn light" id="dgo">${u('pickUp')}</button></div>`;
      if (!ring) { const r = () => { beep(880, .12, 'sine', .05); setTimeout(() => beep(880, .12, 'sine', .05), 180); }; r(); ring = setInterval(r, 1600); }
    } else {
      stopRing(); const n = st.callN || 1;
      body = `<div class="dint s2"><p class="dunit">☎ ${H(I.boss.name)} — ${H(I.boss.role)}</p><div class="dcall">${I.call.slice(0, n).map((l, i) => `<p class="${i === n - 1 ? 'last' : ''}">${H(l)}</p>`).join('')}</div>
        <button class="dbtn light" id="dgo">${n < I.call.length ? u('next') + ' ›' : u('openFile') + ' →'}</button></div>`;
    }
    el.innerHTML = `<div class="dintro" style="--acc:${C.color || '#c8302a'}"><div class="dintop">${langs()}<button class="dskip" id="dskip">${u('skip')} ⏭</button></div>${body}</div>`;
    $('#dskip').onclick = () => { click(); stopRing(); st.intro = 3; save(); view = 'board'; modal = 'rules'; render(); };
    $('#dgo').onclick = () => {
      click();
      if (st.intro === 2) { st.callN = (st.callN || 1) + 1; if (st.callN > I.call.length) { st.intro = 3; view = 'board'; modal = 'rules'; } }
      else st.intro++;
      save(); render();
    };
  }

  // ---------------- Tableau d'enquête ----------------
  function renderBoard(el) {
    const mi = mission(), od = openDocs(), readN = od.filter(d => st.read.includes(d)).length, total = C.folders.reduce((a, f) => a + f.docs.length, 0);
    const nM = C.chapters[st.ch] ? C.chapters[st.ch].missions.length : 0;
    el.innerHTML = `<div class="dboard" style="--acc:${C.color || '#c8302a'}">
      <header class="dtop"><button class="dbtn ghost sm" id="dquit">← ${u('quit')}</button>
        <div class="dtitle"><small>${H(C.intro.unit)} · DOSSIER ${esc(C.no)}</small><b>${H(C.title)}</b></div>
        <div class="dscore">${u('score')} <b>${st.score}</b></div>${langs()}</header>
      <nav class="dchaps">${C.chapters.map((c, i) => `<span class="${i < st.ch ? 'done' : i === st.ch ? 'on' : ''}"><b>${u('chap')} ${i + 1}</b>${H(c.t)}</span>`).join('')}</nav>
      ${mi ? `<div class="dmis"><div><span class="dtag">${u('order')} · ${u('mission')} ${st.m + 1}/${nM}</span><b>${H(mi.order)}</b></div><div class="dstat">${u('read')} <b>${readN} / ${total}</b></div></div>` : ''}
      <div class="dmain"><div class="cork">
        <div class="cgroup"><div class="crow ppl">${C.people.map(p => `<button class="pcard${p.victim ? ' vic' : ''}" data-p="${p.id}"><span class="pin"></span>${face(p.face)}<b>${H(p.name)}</b><small>${p.victim ? u('victim') : H(p.role)}</small>${st.marks[p.id] ? `<i class="mk ${st.marks[p.id]}">${st.marks[p.id] === 's' ? '?!' : '✓'}</i>` : ''}</button>`).join('')}</div></div>
        ${C.folders.filter(f => st.open.includes(f.id)).map(f => `<div class="cgroup"><h5>${esc(f.id)} · ${H(f.t)}</h5><div class="crow">${f.docs.map((id, j) => { const d = C.docs[id], un = !st.read.includes(id);
          return `<button class="dcard k-${d.k}${un ? ' new' : ''}" data-d="${id}" style="--r:${((seed(id) % 7) - 3) * .8}deg"><span class="pin"></span><i>${ICON[d.k] || '📄'}</i><small>${u('k')[d.k] || ''}</small><b>${H(d.t)}</b>${un ? `<em>${u('newDoc')}</em>` : ''}</button>`; }).join('')}</div></div>`).join('')}
      </div>
      <aside class="tray"><h4>🔒 ${u('sealed')}</h4><p>${u('sealedSub')}</p>${C.folders.filter(f => !st.open.includes(f.id)).map(f => f.ch <= st.ch
        ? `<button class="seal" data-f="${f.id}"><small>${esc(f.id)}</small><b>${H(f.t)}</b><i>${f.docs.length} ${u('docs')}</i><span class="tape">${u('unseal')}</span></button>`
        : `<div class="seal lock"><small>${esc(f.id)}</small><b>${H(f.t)}</b><i>${u('locked', { n: f.ch + 1 })}</i></div>`).join('')}</aside></div>
      <footer class="dbar"><button class="dbtn ghost" id="dnotes">📝 ${u('notes')}</button><button class="dbtn ghost" id="drules">❔ ${u('rules')}</button>
        ${mi ? `<button class="dbtn red big" id="drep">⚖️ ${u('report')}</button>` : ''}</footer>
      <div class="dtoast" id="dtoast" hidden></div>${modal ? `<div class="dmod" id="dmod"><div class="dmbox${modal === shown ? ' still' : ''}">${modalHTML()}</div></div>` : ''}</div>`;
    const sc = $('#dmod .dmbox'), keep = modal === shown && sc && window.__dScroll; shown = modal; if (keep) sc.scrollTop = window.__dScroll;
    if (sc) sc.onscroll = () => { window.__dScroll = sc.scrollTop; }; if (!keep) window.__dScroll = 0;
    $('#dquit').onclick = () => { click(); quit(); };
    el.querySelectorAll('.pcard').forEach(b => { b.onclick = () => { click(); modal = 'p:' + b.dataset.p; render(); }; });
    el.querySelectorAll('.dcard').forEach(b => { b.onclick = () => { click(); showDoc(b.dataset.d); }; });
    el.querySelectorAll('.seal[data-f]').forEach(b => { b.onclick = () => {
      const f = C.folders.find(x => x.id === b.dataset.f); st.open.push(f.id); save(); beep(220, .25, 'sawtooth', .05); setTimeout(() => beep(330, .2, 'triangle', .05), 120);
      render(); toast(u('opened', { n: f.docs.length }));
    }; });
    $('#dnotes').onclick = () => { click(); modal = 'notes'; render(); };
    $('#drules').onclick = () => { click(); modal = 'rules'; render(); };
    if ($('#drep')) $('#drep').onclick = () => { click(); modal = 'report'; render(); };
    if (modal) bindModal();
  }
  function showDoc(id) { if (!st.read.includes(id)) { st.read.push(id); save(); } modal = 'd:' + id; render(); }

  // ---------------- Fenêtres ----------------
  function modalHTML() {
    const x = `<button class="dx" id="dx" aria-label="${u('close')}">✕</button>`;
    if (modal.startsWith('d:')) {
      const id = modal.slice(2), d = C.docs[id], f = folderOf(id), od = openDocs(), i = od.indexOf(id);
      return `<div class="dmh"><span>${esc(f.id)} · ${u('k')[d.k] || ''}</span><b>${H(d.t)}</b>${x}</div><div class="dview">${docHTML(d)}</div>
        <div class="dnav"><button class="dbtn ghost sm" data-go="${od[i - 1] || ''}" ${i > 0 ? '' : 'disabled'}>${u('prev')}</button><span>${i + 1} / ${od.length}</span><button class="dbtn ghost sm" data-go="${od[i + 1] || ''}" ${i < od.length - 1 ? '' : 'disabled'}>${u('nextD')}</button></div>`;
    }
    if (modal.startsWith('p:')) {
      const p = C.people.find(q => q.id === modal.slice(2)), m = st.marks[p.id] || '';
      return `<div class="dmh"><span>${p.victim ? u('victim') : H(p.role)}</span><b>${H(p.name)}</b>${x}</div><div class="pbig">${face(p.face, true)}<div><p class="page">${u('age', { n: p.age })} · ${H(p.role)}</p><p>${H(p.bio)}</p>
        ${p.victim ? '' : `<div class="marks">${[['', u('markQ')], ['s', '🔴 ' + u('markS')], ['c', '🟢 ' + u('markC')]].map(([k, l]) => `<button class="dbtn ghost sm${m === k ? ' on' : ''}" data-mk="${k}">${l}</button>`).join('')}</div>`}</div></div>`;
    }
    if (modal === 'notes') return `<div class="dmh"><span>📝</span><b>${u('notes')}</b>${x}</div><textarea id="dnote" placeholder="${esc(u('notesPh'))}">${esc(st.notes)}</textarea>`;
    if (modal === 'rules') return `<div class="dmh"><span>DOSSIER ${esc(C.no)}</span><b>${u('rules')}</b>${x}</div><div class="drules">${u('rulesBody').split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div><div class="drow"><button class="dbtn red" id="dx2">OK</button></div>`;
    if (modal === 'ok') {
      const done = st.ch >= C.chapters.length;
      return `<div class="dok"><div class="dstamp2">✔</div><h3>${u('okTitle')}</h3><p class="dbossq">« ${H(st.lastOk)} »</p><p class="dsubt">— ${H(C.intro.boss.name)}</p>${st.newCh && !done ? `<p class="dnew">🔓 ${u('newSeals')}</p>` : ''}<div class="drow"><button class="dbtn red" id="dcont">${u('cont')} →</button></div></div>`;
    }
    if (modal === 'report') {
      const mi = mission(), key = st.ch + '-' + st.m, sel = st.sel[key], pd = st.pd[key], ord = order(mi.opts.length, C.id + key), rd = openDocs().filter(d => st.read.includes(d));
      return `<div class="dmh"><span>${H(C.intro.boss.name)} · ${u('mission')} ${st.m + 1}</span><b>${u('report')}</b>${x}</div><div class="drep">
        <h3>${H(mi.q)}</h3><h5>${u('answer')}</h5><div class="dopts">${ord.map((o, j) => `<button class="dopt${sel === o ? ' on' : ''}" data-o="${o}"><b>${'ABCDE'[j]}</b><span>${H(mi.opts[o])}</span></button>`).join('')}</div>
        ${mi.proof ? `<h5>${u('proof')}</h5><p class="dsubt">${u('proofSub')}</p>${rd.length ? `<div class="dprf">${rd.map(id => { const d = C.docs[id]; return `<button class="dpd${pd === id ? ' on' : ''}" data-pd="${id}"><i>${ICON[d.k] || '📄'}</i><span>${H(d.t)}</span></button>`; }).join('')}</div>` : `<p class="dwarn">${u('noRead')}</p>`}` : ''}
        ${st.hints[key] ? `<p class="dhintt">💡 ${H(mi.hint)}</p>` : ''}
        <p class="dfb" id="dfb">${st.fb ? esc(st.fb) : ''}</p>
        <div class="drow">${st.hints[key] ? '' : `<button class="dbtn ghost" id="dhint">💡 ${u('hint')} (−100)</button>`}<button class="dbtn red big" id="dsend">${u('send')} ✉</button></div></div>`;
    }
    return '';
  }
  function bindModal() {
    const close = () => { click(); modal = null; st.fb = ''; render(); };
    if ($('#dx')) $('#dx').onclick = close; if ($('#dx2')) $('#dx2').onclick = close;
    $('#dmod').onclick = e => { if (e.target.id === 'dmod' && modal !== 'ok') close(); };
    document.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => { if (b.dataset.go) { click(); showDoc(b.dataset.go); } }; });
    document.querySelectorAll('[data-mk]').forEach(b => { b.onclick = () => { click(); const id = modal.slice(2); if (b.dataset.mk) st.marks[id] = b.dataset.mk; else delete st.marks[id]; save(); render(); }; });
    if ($('#dnote')) { const t = $('#dnote'); t.oninput = () => { st.notes = t.value; save(); }; t.focus(); }
    if ($('#dcont')) $('#dcont').onclick = () => { click(); modal = null; if (st.ch >= C.chapters.length) finish(); else render(); };
    if (modal === 'report') {
      const key = st.ch + '-' + st.m, mi = mission();
      document.querySelectorAll('.dopt').forEach(b => { b.onclick = () => { click(); st.sel[key] = +b.dataset.o; st.fb = ''; save(); render(); }; });
      document.querySelectorAll('.dpd').forEach(b => { b.onclick = () => { click(); st.pd[key] = b.dataset.pd; st.fb = ''; save(); render(); }; });
      if ($('#dhint')) $('#dhint').onclick = () => { if (!confirm(u('hintCost'))) return; click(); st.hints[key] = 1; st.score = Math.max(0, st.score - 100); save(); render(); };
      $('#dsend').onclick = () => {
        const sel = st.sel[key], pd = st.pd[key];
        if (sel == null) { st.fb = u('needAns'); return render(); }
        if (mi.proof && !pd) { st.fb = u('needDoc'); return render(); }
        if (sel !== 0) {
          const pen = mi.accuse ? 250 : 100; st.score = Math.max(0, st.score - pen); st.err++; st.fb = mi.accuse ? u('wrongAcc') : u('wrongAns', { n: pen });
          beep(140, .35, 'sawtooth', .06); save(); return render();
        }
        if (mi.proof && !mi.proof.includes(pd)) { st.score = Math.max(0, st.score - 50); st.err++; st.fb = u('wrongDoc'); beep(160, .3, 'sawtooth', .05); save(); return render(); }
        beep(660, .12, 'triangle', .06); setTimeout(() => beep(990, .2, 'triangle', .06), 130);
        st.lastOk = mi.ok; st.fb = ''; st.newCh = false; st.m++;
        if (st.m >= C.chapters[st.ch].missions.length) { st.ch++; st.m = 0; st.newCh = true; }
        save(); modal = 'ok'; render();
      };
    }
  }

  // ---------------- Fin ----------------
  function finish() {
    st.done = true; st.t = Math.round((Date.now() - st.t0) / 1000); save();
    const best = store.get('mt-dos-best', {}); if (best[C.id] == null || st.score > best[C.id]) { best[C.id] = st.score; store.set('mt-dos-best', best); }
    view = 'end'; render();
  }
  function renderEnd(el) {
    const r = st.score >= 900 ? 3 : st.score >= 700 ? 2 : st.score >= 450 ? 1 : 0, mm = Math.floor(st.t / 60), ss = String(st.t % 60).padStart(2, '0');
    el.innerHTML = `<div class="dend" style="--acc:${C.color || '#c8302a'}"><div class="dintop">${langs()}</div><div class="dendbox">
      <div class="dstampbig">${u('endTitle')}</div><h2>${C.icon} ${H(C.title)}</h2>
      <div class="dscores"><div><b>${st.score}</b><small>/ 1000</small></div><div><b>${mm}:${ss}</b><small>${u('time')}</small></div><div><b>${st.err}</b><small>${u('errors')}</small></div><div><b>${Object.keys(st.hints).length}</b><small>${u('hints')}</small></div></div>
      <p class="drank">🎖️ ${u('ranks')[r]}</p><h4>${u('truth')}</h4><div class="dtruth">${X(C.truth).split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="drow"><button class="dbtn ghost" id="dback">${u('toArch')}</button><button class="dbtn red" id="dagain">↺ ${u('replay')}</button></div></div></div>`;
    $('#dback').onclick = () => { click(); quit(); };
    $('#dagain').onclick = () => { click(); const id = C.id; openCase(id, true); };
  }

  // ---------------- Événements globaux ----------------
  document.addEventListener('click', e => { if (e.target.closest('.lg[data-l]') && C && !ensureEl().hidden) setTimeout(render, 0); });
  document.addEventListener('keydown', e => {
    if (!C || ensureEl().hidden || view !== 'board' || !modal) return;
    if (e.key === 'Escape' && modal !== 'ok') { modal = null; st.fb = ''; render(); }
    if (modal.startsWith('d:') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { const od = openDocs(), i = od.indexOf(modal.slice(2)), j = i + (e.key === 'ArrowRight' ? 1 : -1); if (od[j]) showDoc(od[j]); }
  });

  window.Dossier = { list, open: openCase, u, render: () => render(), get state() { return st; }, get C() { return C; } };
})();

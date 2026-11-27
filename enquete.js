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
      modeEsc: 'Jeux d’évasion', modeEscD: 'Explore des salles, fouille, résous des énigmes', modeEnq: 'Enquêtes', modeEnqD: 'Affaires d’aujourd’hui et légendes d’autrefois : recoupe les preuves, désigne le coupable',
      culTitle: 'Contes et légendes', culSub: 'Des contes que l’on se raconte depuis des siècles, rouverts comme de vraies affaires : actes, chansons, témoignages. Lis, recoupe, puis rends ton jugement, preuve à l’appui.',
      startOld: 'Entrer au tribunal', messenger: 'Un messager frappe le tambour', receive: 'Recevoir le message', ranksOld: ['Garde du tribunal', 'Greffier', 'Mandarin du district', 'Grand juge de la province'], depOld: 'TÉMOIGNAGE RECUEILLI AU TRIBUNAL',
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
      k: { report: 'Rapport', pv: 'Procès-verbal', dep: 'Déposition', sms: 'Messages', cam: 'Caméra', bill: 'Reçu', bank: 'Relevé', photo: 'Photo', note: 'Note', letter: 'Lettre', calls: 'Appels', deed: 'Acte', verse: 'Chanson' }, photoBy: 'Photo d’illustration :',
      depT: 'DÉPOSITION', depOf: 'Témoin', q: 'Question', ownerOf: 'Téléphone de {x}', camT: 'EXTRAIT VIDÉO', total: 'TOTAL'
    },
    en: {
      modeEsc: 'Escape games', modeEscD: 'Explore rooms, search, solve puzzles', modeEnq: 'Investigations', modeEnqD: 'Cases of today and legends of old: cross-check the evidence, name the culprit',
      culTitle: 'Tales and legends', culSub: 'Tales people have told for centuries, reopened as real cases: deeds, songs, testimonies. Read, cross-check, then deliver your judgment, with evidence.',
      startOld: 'Enter the courthouse', messenger: 'A messenger beats the drum', receive: 'Receive the message', ranksOld: ['Court guard', 'Clerk', 'District mandarin', 'Provincial high judge'], depOld: 'TESTIMONY TAKEN AT THE COURT',
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
      k: { report: 'Report', pv: 'Official record', dep: 'Statement', sms: 'Messages', cam: 'Camera', bill: 'Receipt', bank: 'Statement', photo: 'Photo', note: 'Note', letter: 'Letter', calls: 'Calls', deed: 'Deed', verse: 'Song' }, photoBy: 'Illustrative photo:',
      depT: 'WITNESS STATEMENT', depOf: 'Witness', q: 'Question', ownerOf: '{x}’s phone', camT: 'VIDEO EXTRACT', total: 'TOTAL'
    },
    vi: {
      modeEsc: 'Thoát phòng', modeEscD: 'Khám phá căn phòng, lục tìm, giải câu đố', modeEnq: 'Phá án', modeEnqD: 'Vụ án hôm nay và truyền thuyết ngày xưa: đối chiếu chứng cứ, chỉ ra thủ phạm',
      culTitle: 'Truyền thuyết', culSub: 'Những câu chuyện được kể lại qua bao đời, mở lại như những vụ án thật: văn tự, câu vè, lời khai. Hãy đọc, đối chiếu, rồi xử án kèm bằng chứng.',
      startOld: 'Vào công đường', messenger: 'Có người đánh trống báo tin', receive: 'Nhận tin', ranksOld: ['Lính lệ', 'Thư lại', 'Tri huyện', 'Quan Án sát'], depOld: 'LỜI KHAI TẠI NHA MÔN',
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
      k: { report: 'Báo cáo', pv: 'Biên bản', dep: 'Lời khai', sms: 'Tin nhắn', cam: 'Camera', bill: 'Hóa đơn', bank: 'Sao kê', photo: 'Ảnh', note: 'Ghi chú', letter: 'Thư', calls: 'Cuộc gọi', deed: 'Văn tự', verse: 'Câu vè' }, photoBy: 'Ảnh minh họa:',
      depT: 'BIÊN BẢN LỜI KHAI', depOf: 'Người khai', q: 'Hỏi', ownerOf: 'Điện thoại của {x}', camT: 'TRÍCH XUẤT CAMERA', total: 'TỔNG'
    }
  };
  const u = (k, p) => { let s = (U[lang()] || U.fr)[k] ?? U.fr[k]; if (p) for (const n in p) s = s.split('{' + n + '}').join(p[n]); return s; };
  const ICON = { report: '📑', pv: '📋', dep: '🗣️', sms: '💬', cam: '📹', bill: '🧾', bank: '🏦', photo: '📷', note: '🗒️', letter: '✉️', calls: '📞', deed: '📜', verse: '🎋' };

  // ---------------- Portraits (style photo d'identité, dessinés en SVG) ----------------
  let fid = 0;
  const hex = c => { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); };
  const tone = (c, k) => { const [r, g, b] = hex(c); const f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); return '#' + [r, g, b].map(v => f(v).toString(16).padStart(2, '0')).join(''); };
  function face(f, big) {
    f = f || {}; const s = f.s || '#e8c4a0', h = f.h || '#2a2018', c = f.c || '#3a4a6a', st = f.st || 'short', id = 'pf' + (++fid);
    let seed = 0; for (const ch of s + h + c + st + (f.g || '') + (f.m || '')) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return (seed >>> 8) / 16777216; };
    const jw = 24 + rnd() * 5, ey = 57 + rnd() * 2, ex = 10 + rnd() * 2, nl = 9 + rnd() * 3, my = 77 + rnd() * 2, lw = 6 + rnd() * 2.5, br = rnd() * 2;
    const iris = f.e || (rnd() < .5 ? '#3a2416' : '#2a1a10'), sd = tone(s, -.22), sdd = tone(s, -.38), sl = tone(s, .25), hl = tone(h, .28), hd = tone(h, -.35), cl = tone(c, .18), cd = tone(c, -.4);
    const fem = st === 'long' || st === 'bun';
    const head = `M${60 - jw - 3} 54C${60 - jw - 3} 32 ${46} 23 60 23S${60 + jw + 3} 32 ${60 + jw + 3} 54C${60 + jw + 2} 70 ${60 + jw - 6} 82 ${66} 88Q60 91 54 88C${60 - jw + 6} 82 ${60 - jw - 2} 70 ${60 - jw - 3} 54Z`;
    const back = st === 'long' ? `<path d="M${60 - jw - 9} 56C${60 - jw - 12} 26 44 14 60 14S${60 + jw + 12} 26 ${60 + jw + 9} 56C${60 + jw + 12} 80 ${60 + jw + 16} 100 ${60 + jw + 8} 118L${60 - jw - 8} 118C${60 - jw - 16} 100 ${60 - jw - 12} 80 ${60 - jw - 9} 56Z" fill="url(#${id}h)"/>`
      : st === 'bun' ? `<ellipse cx="60" cy="17" rx="13" ry="10" fill="url(#${id}h)"/><path d="M50 14q10-6 20 0" stroke="${hl}" stroke-width="1" fill="none" opacity=".5"/>` : '';
    const strands = (d, n) => Array.from({ length: n }, (_, i) => `<path d="${d(i, n)}" stroke="${hl}" stroke-width=".6" fill="none" opacity=".35"/>`).join('');
    const front = {
      short: `<path d="M${60 - jw - 3} 52C${60 - jw - 5} 30 44 18 60 18S${60 + jw + 5} 30 ${60 + jw + 3} 52C${60 + jw} 42 ${60 + jw - 4} 36 ${60 + jw - 8} 34C68 37 52 37 40 33C${60 - jw + 2} 38 ${60 - jw} 44 ${60 - jw - 3} 52Z" fill="url(#${id}h)"/>` + strands((i, n) => `M${40 + i * 40 / n} 21q${3 - i * .6} 6 ${1 + i * .4} 13`, 9),
      side: `<path d="M${60 - jw - 4} 54C${60 - jw - 6} 28 44 17 61 17S${60 + jw + 6} 30 ${60 + jw + 3} 54C${60 + jw + 1} 44 ${60 + jw - 3} 38 ${60 + jw - 7} 35C70 33 54 31 46 36C40 38 ${60 - jw} 44 ${60 - jw - 4} 54Z" fill="url(#${id}h)"/>` + strands((i, n) => `M${46 + i * 30 / n} 20q${10 - i} 4 ${16 - i} 14`, 8) + `<path d="M46 23q4 9 0 13" stroke="${hd}" stroke-width="1" fill="none" opacity=".6"/>`,
      long: `<path d="M${60 - jw - 6} 66C${60 - jw - 8} 30 44 17 60 17S${60 + jw + 8} 30 ${60 + jw + 6} 66C${60 + jw + 2} 52 ${60 + jw - 2} 40 ${62} 31C${56} 40 46 44 ${60 - jw - 1} 46C${60 - jw - 3} 52 ${60 - jw - 4} 58 ${60 - jw - 6} 66Z" fill="url(#${id}h)"/>` + strands((i, n) => `M${60 - i * 3} 22q${-6 - i} 10 ${-12 - i * 1.5} ${24 + i * 4}`, 7) + strands((i, n) => `M${62 + i * 3} 22q${6 + i} 10 ${10 + i * 1.5} ${24 + i * 4}`, 7),
      bun: `<path d="M${60 - jw - 3} 54C${60 - jw - 5} 30 44 21 60 21S${60 + jw + 5} 30 ${60 + jw + 3} 54C${60 + jw} 42 ${60 + jw - 6} 35 60 33C${60 - jw + 6} 35 ${60 - jw} 42 ${60 - jw - 3} 54Z" fill="url(#${id}h)"/>` + strands((i, n) => `M60 23q${-14 + i * 3.5} 3 ${-20 + i * 5} 14`, 9),
      bald: `<path d="M${60 - jw - 4} 66C${60 - jw - 6} 56 ${60 - jw - 4} 46 ${60 - jw - 1} 42L${60 - jw + 3} 44C${60 - jw + 1} 52 ${60 - jw} 60 ${60 - jw - 1} 68ZM${60 + jw + 4} 66C${60 + jw + 6} 56 ${60 + jw + 4} 46 ${60 + jw + 1} 42L${60 + jw - 3} 44C${60 + jw - 1} 52 ${60 + jw} 60 ${60 + jw + 1} 68Z" fill="url(#${id}h)"/><ellipse cx="54" cy="31" rx="11" ry="5" fill="#fff" opacity=".22"/>`,
      turban: `<path d="M${60 - jw - 3} 50C${60 - jw - 4} 40 ${60 - jw - 2} 36 ${60 - jw} 35L${60 + jw} 35C${60 + jw + 2} 36 ${60 + jw + 4} 40 ${60 + jw + 3} 50C${60 + jw} 44 ${60 + jw - 3} 40 60 40S${60 - jw} 44 ${60 - jw - 3} 50Z" fill="url(#${id}h)"/>
        <path d="M${60 - jw - 4} 38C${60 - jw - 5} 24 46 18 60 18S${60 + jw + 5} 24 ${60 + jw + 4} 38Q60 44 ${60 - jw - 4} 38Z" fill="url(#${id}t)"/>${[0, 1, 2, 3].map(i => `<path d="M${60 - jw - 3 + i} ${36 - i * 4}Q60 ${41 - i * 4.5} ${60 + jw + 3 - i} ${36 - i * 4}" stroke="#000" stroke-width=".8" fill="none" opacity=".45"/>`).join('')}`,
      scarf: `<path d="M${60 - jw - 6} 92C${60 - jw - 10} 60 ${60 - jw - 8} 26 60 16C${60 + jw + 8} 26 ${60 + jw + 10} 60 ${60 + jw + 6} 92L${60 + jw - 1} 92C${60 + jw + 2} 70 ${60 + jw + 1} 52 ${60 + jw - 2} 42Q${60 + 8} 36 60 30Q${60 - 8} 36 ${60 - jw + 2} 42C${60 - jw - 1} 52 ${60 - jw - 2} 70 ${60 - jw + 1} 92Z" fill="url(#${id}t)"/><path d="M${60 - jw + 2} 42Q${60 - 8} 36 60 30Q${60 + 8} 36 ${60 + jw - 2} 42" stroke="${tone(f.k || '#1a1a1a', .3)}" stroke-width=".8" fill="none" opacity=".6"/>`,
      cap: `<path d="M${60 - jw - 3} 52C${60 - jw - 4} 44 ${60 - jw - 2} 40 ${60 - jw} 38L${60 + jw} 38C${60 + jw + 2} 40 ${60 + jw + 4} 44 ${60 + jw + 3} 52C${60 + jw} 46 ${60 + jw - 3} 42 60 42S${60 - jw} 46 ${60 - jw - 3} 52Z" fill="url(#${id}h)"/>
        <path d="M${60 - jw - 2} 40C${60 - jw - 2} 22 46 15 60 15S${60 + jw + 2} 22 ${60 + jw + 2} 40Z" fill="url(#${id}c)"/><path d="M${60 - jw - 4} 40Q60 34 ${60 + jw + 4} 40L${60 + jw + 6} 45Q60 38 ${60 - jw - 6} 45Z" fill="${cd}"/>
        <rect x="55" y="25" width="10" height="8" rx="1.5" fill="#d8b84a"/><path d="M57 29h6M60 26.5v5" stroke="#7a5a10" stroke-width=".9"/>`
    }[st] || '';
    const eye = x => `<path d="M${x - 6} ${ey}Q${x} ${ey - 4.6} ${x + 6} ${ey}Q${x} ${ey + 3.4} ${x - 6} ${ey}Z" fill="#f4efe8"/>
      <circle cx="${x}" cy="${ey - .2}" r="2.7" fill="${iris}"/><circle cx="${x}" cy="${ey - .2}" r="1.3" fill="#0a0604"/><circle cx="${x + .9}" cy="${ey - 1.2}" r=".75" fill="#fff" opacity=".9"/>
      <path d="M${x - 6.4} ${ey + .2}Q${x} ${ey - 5.2} ${x + 6.4} ${ey - .4}" stroke="${hd}" stroke-width="1.4" fill="none"/><path d="M${x - 5} ${ey + 2.2}Q${x} ${ey + 4} ${x + 5} ${ey + 2}" stroke="${sd}" stroke-width=".7" fill="none" opacity=".8"/>
      ${f.old ? `<path d="M${x - 5} ${ey + 4.5}Q${x} ${ey + 7} ${x + 5} ${ey + 4.2}" stroke="${sdd}" stroke-width=".6" fill="none" opacity=".6"/>` : ''}`;
    const brow = (x, k) => `<path d="M${x - 7 * k} ${ey - 7 + br}Q${x - 1 * k} ${ey - 11.5 + br} ${x + 7 * k} ${ey - 8.5 + br}L${x + 7 * k} ${ey - 7.4 + br}Q${x} ${ey - 9.6 + br} ${x - 7 * k} ${ey - 5.8 + br}Z" fill="${st === 'bald' ? tone(h, -.2) : hd}" opacity="${fem ? .75 : .95}"/>`;
    const L = 60 - ex, R = 60 + ex, nb = ey + nl;
    return `<svg class="face${big ? ' big' : ''}" viewBox="0 0 120 130" aria-hidden="true"><defs>
      <radialGradient id="${id}b" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${tone(f.bg || '#cdd3d8', .35)}"/><stop offset="1" stop-color="${tone(f.bg || '#cdd3d8', -.18)}"/></radialGradient>
      <radialGradient id="${id}s" cx="44%" cy="40%" r="62%"><stop offset="0" stop-color="${sl}"/><stop offset=".55" stop-color="${s}"/><stop offset="1" stop-color="${sd}"/></radialGradient>
      <linearGradient id="${id}h" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${hl}"/><stop offset=".45" stop-color="${h}"/><stop offset="1" stop-color="${hd}"/></linearGradient>
      <linearGradient id="${id}t" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${tone(f.k || '#1a1a1a', .3)}"/><stop offset=".5" stop-color="${f.k || '#1a1a1a'}"/><stop offset="1" stop-color="${tone(f.k || '#1a1a1a', -.4)}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cl}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${cd}"/></linearGradient>
      <radialGradient id="${id}v" cx="50%" cy="45%" r="70%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
      <filter id="${id}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="${fid % 97}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0"/></filter>
      <filter id="${id}k"><feGaussianBlur stdDeviation=".3"/><feColorMatrix type="saturate" values=".82"/></filter><filter id="${id}B" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <linearGradient id="${id}x" x1="0" y1="0" x2="1" y2=".25"><stop offset=".42" stop-color="${sdd}" stop-opacity="0"/><stop offset="1" stop-color="${sdd}" stop-opacity=".5"/></linearGradient></defs>
      <rect width="120" height="130" fill="url(#${id}b)"/>
      <g filter="url(#${id}k)"><g transform="translate(-10 -3) scale(1.17)">${back}
      <path d="M4 130C6 108 22 98 44 94L60 100L76 94C98 98 114 108 116 130Z" fill="url(#${id}c)"/>
      <path d="M48 92Q60 104 72 92L70 99Q60 108 50 99Z" fill="${f.sh || (fem ? s : '#efece4')}"/>${f.col === 'cross' ? `<path d="M45 94L66 130L74 130L52 92Z" fill="${tone(c, -.25)}"/><path d="M75 94L58 120" stroke="${cd}" stroke-width="1.4" opacity=".6"/><path d="M47 93L68 130" stroke="${f.sh || '#e8dcc0'}" stroke-width="2.4" opacity=".85"/>` : fem ? '' : `<path d="M47 93L60 112L73 93L69 104L60 116L51 104Z" fill="${f.sh || '#efece4'}" opacity=".95"/><path d="M60 112v18" stroke="${cd}" stroke-width=".8" opacity=".5"/>`}
      <path d="M30 112Q34 104 44 100M90 112Q86 104 76 100" stroke="${cd}" stroke-width="1.2" fill="none" opacity=".5"/>
      <path d="M51 78L51 98Q60 104 69 98L69 78Z" fill="${sd}"/><path d="M51 84Q60 92 69 84L69 80L51 80Z" fill="${sdd}" opacity=".55"/>
      <ellipse cx="${60 - jw - 3}" cy="${ey + 3}" rx="4" ry="7" fill="${sd}"/><ellipse cx="${60 + jw + 3}" cy="${ey + 3}" rx="4" ry="7" fill="${sd}"/>
      <path d="${head}" fill="url(#${id}s)"/><path d="${head}" fill="url(#${id}x)"/>
      <g filter="url(#${id}B)"><path d="${head}" fill="none" stroke="${sdd}" stroke-width="3" opacity=".3"/><ellipse cx="56" cy="37" rx="11" ry="5" fill="#fff" opacity=".2"/><ellipse cx="${L - 3}" cy="${ey + 9}" rx="5" ry="3" fill="#fff" opacity=".16"/><ellipse cx="${R + 3}" cy="${ey + 9}" rx="5" ry="3" fill="#fff" opacity=".1"/>
      <ellipse cx="${60 + 3.5}" cy="${nb - 3}" rx="2.4" ry="6" fill="${sdd}" opacity=".35"/><ellipse cx="60" cy="${my + 5.5}" rx="4" ry="1.6" fill="${sdd}" opacity=".35"/><ellipse cx="${60 + jw - 3}" cy="${my - 4}" rx="4" ry="9" fill="${sdd}" opacity=".25"/></g>
      <ellipse cx="${L - 4}" cy="${my - 8}" rx="6" ry="4" fill="#d0605a" opacity="${fem ? .16 : .09}"/><ellipse cx="${R + 4}" cy="${my - 8}" rx="6" ry="4" fill="#d0605a" opacity="${fem ? .16 : .09}"/>
      <ellipse cx="${L}" cy="${ey - 1}" rx="8" ry="5" fill="${sd}" opacity=".35"/><ellipse cx="${R}" cy="${ey - 1}" rx="8" ry="5" fill="${sd}" opacity=".35"/>
      ${eye(L)}${eye(R)}${brow(L, 1)}${brow(R, -1)}
      <path d="M${60 - 2} ${ey + 2}Q${60 - 3.5} ${nb - 4} ${60 - 4.5} ${nb}" stroke="${sd}" stroke-width="1.1" fill="none" opacity=".8"/><path d="M61 ${ey + 3}L61.5 ${nb - 3}" stroke="${sl}" stroke-width="1.6" opacity=".55"/>
      <path d="M${60 - 5.5} ${nb + .5}Q${60 - 3} ${nb + 3} 60 ${nb + 2.2}Q${60 + 3} ${nb + 3} ${60 + 5.5} ${nb + .5}" stroke="${sdd}" stroke-width="1" fill="none"/>
      <ellipse cx="${60 - 2.6}" cy="${nb + 1.2}" rx="1.3" ry=".8" fill="${sdd}"/><ellipse cx="${60 + 2.6}" cy="${nb + 1.2}" rx="1.3" ry=".8" fill="${sdd}"/>
      ${f.old ? `<path d="M${60 - 7} ${nb + 2}Q${60 - 10} ${my} ${60 - 8} ${my + 4}M${60 + 7} ${nb + 2}Q${60 + 10} ${my} ${60 + 8} ${my + 4}M46 38q14-3 28 0M48 42q12-2 24 0" stroke="${sdd}" stroke-width=".7" fill="none" opacity=".55"/>` : ''}
      <path d="M${60 - lw} ${my}Q${60 - 2} ${my - 2.6} 60 ${my - 1.6}Q${60 + 2} ${my - 2.6} ${60 + lw} ${my}Q60 ${my + .8} ${60 - lw} ${my}Z" fill="${tone(fem ? '#b8505a' : s, fem ? 0 : -.3)}"/>
      <path d="M${60 - lw + 1} ${my + .3}Q60 ${my + 4.4} ${60 + lw - 1} ${my + .3}Q60 ${my + 1.4} ${60 - lw + 1} ${my + .3}Z" fill="${tone(fem ? '#c86a70' : s, fem ? 0 : -.18)}"/>
      <path d="M${60 - lw} ${my}Q60 ${my + 1} ${60 + lw} ${my}" stroke="${tone(s, -.55)}" stroke-width=".8" fill="none"/>
      <path d="M${60 - 3} ${my + 7}Q60 ${my + 8.5} ${60 + 3} ${my + 7}" stroke="${sd}" stroke-width=".8" fill="none" opacity=".6"/>
      ${f.m ? `<path d="M${60 - lw - 3} ${my - .5}Q${60 - lw} ${my - 6} 60 ${my - 4.2}Q${60 + lw} ${my - 6} ${60 + lw + 3} ${my - .5}Q${60 + lw} ${my - 3} 60 ${my - 2.4}Q${60 - lw} ${my - 3} ${60 - lw - 3} ${my - .5}Z" fill="url(#${id}h)"/>` : ''}
      ${front}
      ${f.g ? `<g fill="#bcd8e8" fill-opacity=".12" stroke="#1a1a1a" stroke-width="1.3"><rect x="${L - 8}" y="${ey - 6}" width="16" height="12" rx="4"/><rect x="${R - 8}" y="${ey - 6}" width="16" height="12" rx="4"/></g><path d="M${L + 8} ${ey - 1}Q60 ${ey - 3} ${R - 8} ${ey - 1}M${L - 8} ${ey - 2}L${60 - jw - 3} ${ey - 3}M${R + 8} ${ey - 2}L${60 + jw + 3} ${ey - 3}" stroke="#1a1a1a" stroke-width="1.2" fill="none"/><path d="M${L - 5} ${ey - 4}l4 0M${R - 5} ${ey - 4}l4 0" stroke="#fff" stroke-width="1" opacity=".6"/>` : ''}
      </g></g><rect width="120" height="130" fill="url(#${id}v)"/><rect width="120" height="130" filter="url(#${id}n)" opacity=".8" style="mix-blend-mode:overlay"/>
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
    if (k === 'photo') return `<figure class="polar"><div class="shot${d.img ? ' real' : ''}" style="background:${d.bg || '#2a2a2a'}">${d.img
        ? `<img src="https://images.unsplash.com/photo-${d.img}?w=1100&q=78&auto=format" style="object-position:${d.pos || 'center'}" alt="" draggable="false"><i class="grain"></i>${d.when ? `<time class="exif">${esc(d.when)}</time>` : ''}`
        : (d.items || []).map(it => `<span style="left:${it[1]}%;top:${it[2]}%;font-size:${it[3] || 40}px">${it[0]}</span>`).join('')}
      ${(d.marks || []).map(m => `<em style="left:${m[1]}%;top:${m[2]}%">${m[0]}</em>`).join('')}</div><figcaption>${H(d.cap)}</figcaption>
      ${d.credit ? `<small class="credit">${esc(u('photoBy'))} ${esc(d.credit)} · Unsplash</small>` : ''}
      ${d.legend ? `<ol class="legend">${d.legend.map(l => `<li>${H(l)}</li>`).join('')}</ol>` : ''}</figure>`;
    if (k === 'deed') return `<div class="paper deed"><div class="phead"><span>${H(d.org)}</span><span>${H(d.ref || '')}</span></div><h3>${H(d.t2 || d.t)}</h3>${d.sub ? `<p class="dsub">${H(d.sub)}</p>` : ''}
      <div class="dbody">${X(d.body).split('\n').map(p => p ? `<p>${esc(p).replace(/\[\[(.+?)\]\]/g, '<span class="ink2">$1</span>')}</p>` : '').join('')}</div>
      ${d.sign ? `<p class="dsign">${H(d.sign)}</p>` : ''}${d.seal ? `<div class="vseal">${esc(d.seal)}</div>` : ''}</div>`;
    if (k === 'verse') return `<div class="paper verse"><h3>${H(d.t2 || d.t)}</h3>${d.sub ? `<p class="dsub">${H(d.sub)}</p>` : ''}<div class="vlines">${X(d.body).split('\n').map(p => p ? `<p>${esc(p)}</p>` : '<br>').join('')}</div>${d.foot ? `<p class="vfoot">${H(d.foot)}</p>` : ''}</div>`;
    const head = `<div class="phead"><span>${H(d.org)}</span><span>${H(d.ref || '')}</span></div>`;
    if (k === 'dep') return `<div class="paper dep">${head}<h3>${C && C.era === 'old' ? u('depOld') : u('depT')}</h3><div class="dmeta">${(d.meta || []).map(r => `<p><b>${H(r[0])}</b> ${H(r[1])}</p>`).join('')}</div>
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
    const cardOf = c => {
        const s = store.get(KEY(c.id), null), n = c.folders.reduce((a, f) => a + f.docs.length, 0);
        const status = s && s.done ? `<span class="dst ok">✔ ${u('solved')} · ${s.score} ${u('pts')}</span>` : s && (s.open.length || s.intro) ? `<span class="dst">${u('inProg', { n: s.ch + 1 })}</span>` : '';
        return `<article class="dfile" style="--acc:${c.color || '#c8302a'}"><div class="dfhead"><span>${H(c.place)}</span><span>DOSSIER ${esc(c.no)}</span></div>
          <div class="dfic">${c.icon}</div><h4>${H(c.title)}</h4><p>${H(c.pitch)}</p>
          <div class="dfstats"><span>📄 ${n} ${u('docs')}</span><span>👤 ${c.people.length} ${u('people')}</span><span>📚 ${c.chapters.length} ${u('chaps')}</span></div>
          ${status}${best[c.id] != null ? `<span class="dst best">🏆 ${u('best')} : ${best[c.id]} ${u('pts')}</span>` : ''}
          <div class="dfbtns"><button class="dbtn red" data-open="${c.id}">${s && !s.done && (s.open.length || s.intro) ? u('resume') : u('open')} →</button>${s ? `<button class="dbtn ghost" data-restart="${c.id}">↺ ${u('restart')}</button>` : ''}</div></article>`;
    };
    const group = (cls, title, sub, arr) => arr.length ? `<div class="darch${cls}"><h3>${title}</h3><p class="dsubt">${sub}</p><div class="dfiles">${arr.map(cardOf).join('')}</div></div>` : '';
    el.innerHTML = group('', '🗄️ ' + u('archTitle'), u('archSub'), window.Dossiers.filter(c => c.mode !== 'cul'))
      + group(' old', '🏮 ' + u('culTitle'), u('culSub'), window.Dossiers.filter(c => c.mode === 'cul'));
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
    const I = C.intro, old = C.era === 'old';
    let body;
    if (st.intro === 0) {
      stopRing();
      body = `<div class="dint s0"><div class="dclock">${H(I.time)}</div><p class="ddate">${H(I.date)}</p><p class="dunit">${H(I.unit)}</p><p class="dlead">${H(I.lead)}</p><button class="dbtn light" id="dgo">${old ? u('startOld') : u('startShift')}</button></div>`;
    } else if (st.intro === 1) {
      body = `<div class="dint s1"><div class="dring">${old ? '🥁' : '☎'}</div><p class="dunit">${old ? u('messenger') : u('incoming')}</p><h2>${H(I.boss.name)}</h2><p class="ddate">${H(I.boss.role)}</p><button class="dbtn light" id="dgo">${old ? u('receive') : u('pickUp')}</button></div>`;
      if (!ring) { const r = old ? () => { beep(90, .25, 'sine', .14); setTimeout(() => beep(90, .25, 'sine', .14), 260); setTimeout(() => beep(70, .4, 'sine', .14), 560); } : () => { beep(880, .12, 'sine', .05); setTimeout(() => beep(880, .12, 'sine', .05), 180); }; r(); ring = setInterval(r, old ? 2200 : 1600); }
    } else {
      stopRing(); const n = st.callN || 1;
      body = `<div class="dint s2"><p class="dunit">${old ? '📜' : '☎'} ${H(I.boss.name)} — ${H(I.boss.role)}</p><div class="dcall">${I.call.slice(0, n).map((l, i) => `<p class="${i === n - 1 ? 'last' : ''}">${H(l)}</p>`).join('')}</div>
        <button class="dbtn light" id="dgo">${n < I.call.length ? u('next') + ' ›' : u('openFile') + ' →'}</button></div>`;
    }
    el.innerHTML = `<div class="dintro${C.era === 'old' ? ' old' : ''}" style="--acc:${C.color || '#c8302a'}"><div class="dintop">${langs()}<button class="dskip" id="dskip">${u('skip')} ⏭</button></div>${body}</div>`;
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
    el.innerHTML = `<div class="dboard${C.era === 'old' ? ' old' : ''}" style="--acc:${C.color || '#c8302a'}">
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
    el.innerHTML = `<div class="dend${C.era === 'old' ? ' old' : ''}" style="--acc:${C.color || '#c8302a'}"><div class="dintop">${langs()}</div><div class="dendbox">
      <div class="dstampbig">${u('endTitle')}</div><h2>${C.icon} ${H(C.title)}</h2>
      <div class="dscores"><div><b>${st.score}</b><small>/ 1000</small></div><div><b>${mm}:${ss}</b><small>${u('time')}</small></div><div><b>${st.err}</b><small>${u('errors')}</small></div><div><b>${Object.keys(st.hints).length}</b><small>${u('hints')}</small></div></div>
      <p class="drank">🎖️ ${u(C.era === 'old' ? 'ranksOld' : 'ranks')[r]}</p><h4>${u('truth')}</h4><div class="dtruth">${X(C.truth).split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div>
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

  window.Dossier = { list, face, open: openCase, u, render: () => render(), get state() { return st; }, get C() { return C; } };
})();

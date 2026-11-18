// Énigmes du scénario « L'emblème volé » : ordinateur, article déchiré, plan de rue, factures, inventaire à colorier, quiz.
(() => {
  'use strict';
  const K = window.GameKit, { shuffle } = window.Logic, W = K.W, $ = K.$;
  const G = () => K.G, tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  const box = () => $('#pzb');
  const UI = {
    fr: { letters2: '{n} lettres', assembled: 'Article reconstitué', noPlan: 'Il te faudrait le plan complet de la rénovation. Il est peut-être dans l’ordinateur du suspect…', pick: '— boutique —', oddS: 'Côté impair', evenS: 'Côté pair', street: 'Rue Saint-Germain', inv: 'Facture', day: 'Jour', client: 'Client', item: 'Article', total: 'Total', cash: 'comptant', card: 'carte', colorIf: 'colorie si', wrongN: '{n} mauvaise(s) réponse(s). Recommence !', noChat: 'Sans savoir ce que Marc a raconté à Mme Hébert, impossible de choisir la bonne facture.', clue: 'Indice de Marc', invH: 'C’est la facture n° {x}.', colH: 'La case qui clignote doit être coloriée.', assocH: '{a} est au numéro {n}.', quizH: 'Bonne réponse à la première question : {x}.', artH: 'Le titre du journal vient en premier.', pwdUser: 'Utilisateur : marc.l' },
    en: { letters2: '{n} letters', assembled: 'Restored article', noPlan: 'You would need the full renovation plan. Maybe it is on the suspect’s computer…', pick: '— shop —', oddS: 'Odd side', evenS: 'Even side', street: 'Rue Saint-Germain', inv: 'Invoice', day: 'Day', client: 'Customer', item: 'Item', total: 'Total', cash: 'cash', card: 'card', colorIf: 'colour if', wrongN: '{n} wrong answer(s). Try again!', noChat: 'Without knowing what Marc told Mrs Hébert, there is no way to pick the right invoice.', clue: 'Marc’s clue', invH: 'It is invoice no. {x}.', colH: 'The blinking square must be coloured.', assocH: '{a} is at number {n}.', quizH: 'Right answer to the first question: {x}.', artH: 'The newspaper’s headline comes first.', pwdUser: 'User: marc.l' },
    vi: { letters2: '{n} chữ cái', assembled: 'Bài báo đã ghép', noPlan: 'Bạn cần bản kế hoạch cải tạo đầy đủ. Có lẽ nó nằm trong máy tính của nghi phạm…', pick: '— cửa hàng —', oddS: 'Dãy lẻ', evenS: 'Dãy chẵn', street: 'Phố Saint-Germain', inv: 'Hóa đơn', day: 'Ngày', client: 'Khách', item: 'Mặt hàng', total: 'Tổng', cash: 'tiền mặt', card: 'thẻ', colorIf: 'tô nếu', wrongN: 'Sai {n} câu. Làm lại nhé!', noChat: 'Không biết Marc đã kể gì với bà Hébert thì chẳng thể chọn đúng hóa đơn.', clue: 'Gợi ý của Marc', invH: 'Đó là hóa đơn số {x}.', colH: 'Ô đang nhấp nháy phải được tô màu.', assocH: '{a} ở số nhà {n}.', quizH: 'Đáp án đúng của câu đầu tiên: {x}.', artH: 'Tên báo luôn đứng đầu.', pwdUser: 'Người dùng: marc.l' }
  };
  const PZ = {
    fr: { wallpaper: { t: 'Ordinateur', i: 'Trouve le mot de passe grâce au fond d’écran et au nombre de lettres.', h: 'Que représente la photo ? Écris son nom, sans article.' }, article: { t: 'Article déchiré', i: 'Clique sur les morceaux dans l’ordre pour reconstituer l’article.', h: 'Suis la logique d’un article : titre, faits, enquête, témoins, appel au public.' }, assoc: { t: 'Plan de rue', i: 'Choisis la boutique de chaque numéro pour respecter toutes les notes.', h: 'Commence par les notes les plus sûres (numéro exact, côté de la rue), puis « en face » et « à côté ».' }, invoice: { t: 'Factures', i: 'Clique sur la facture qui correspond à l’indice, puis valide.', h: 'Garde seulement les factures du bon jour, puis applique les autres conditions.' }, color: { t: 'Coloriage', i: 'Colorie chaque case dont la quantité respecte la règle de sa colonne.', h: 'Traite une colonne à la fois.' }, quiz: { t: 'Quiz', i: 'Réponds à toutes les questions, puis valide.', h: 'Pense au fleuve, aux musées de Pointe-au-Père… et au Vietnam !' } },
    en: { wallpaper: { t: 'Computer', i: 'Find the password from the wallpaper and the number of letters.', h: 'What does the photo show? Type its name.' }, article: { t: 'Torn Article', i: 'Click the pieces in order to rebuild the article.', h: 'Follow the logic of an article: headline, facts, investigation, witnesses, appeal to the public.' }, assoc: { t: 'Street Plan', i: 'Choose the shop at each number so that every note is respected.', h: 'Start with the surest notes (exact number, side of the street), then “opposite” and “next to”.' }, invoice: { t: 'Invoices', i: 'Click the invoice that matches the clue, then check.', h: 'Keep only the invoices from the right day, then apply the other conditions.' }, color: { t: 'Colouring', i: 'Colour every square whose quantity follows its column’s rule.', h: 'Deal with one column at a time.' }, quiz: { t: 'Quiz', i: 'Answer every question, then check.', h: 'Think of the river, the Pointe-au-Père museums… and Vietnam!' } },
    vi: { wallpaper: { t: 'Máy tính', i: 'Tìm mật khẩu nhờ hình nền và số chữ cái.', h: 'Bức ảnh chụp gì? Hãy viết tên của nó (không dấu cũng được).' }, article: { t: 'Bài báo bị xé', i: 'Bấm vào các mảnh theo đúng thứ tự để ghép lại bài báo.', h: 'Theo logic của một bài báo: tiêu đề, sự việc, điều tra, nhân chứng, lời kêu gọi.' }, assoc: { t: 'Sơ đồ phố', i: 'Chọn cửa hàng cho từng số nhà sao cho đúng với mọi ghi chú.', h: 'Bắt đầu với những ghi chú chắc chắn nhất (số nhà, dãy phố), rồi đến « đối diện » và « cạnh ».' }, invoice: { t: 'Hóa đơn', i: 'Bấm vào hóa đơn khớp với gợi ý rồi kiểm tra.', h: 'Chỉ giữ lại hóa đơn của đúng ngày, rồi áp dụng các điều kiện khác.' }, color: { t: 'Tô màu', i: 'Tô màu mọi ô có số lượng thỏa quy tắc của cột đó.', h: 'Xử lý từng cột một.' }, quiz: { t: 'Câu đố', i: 'Trả lời tất cả các câu hỏi rồi kiểm tra.', h: 'Hãy nghĩ đến dòng sông, các bảo tàng ở Pointe-au-Père… và Việt Nam!' } }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ---------- Ordinateur : fond d'écran ----------
  function drawWallpaper(cv) {
    const c = cv.getContext('2d'), w = cv.width, h = cv.height;
    const sky = c.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#f6b26b'); sky.addColorStop(.55, '#f9d9a6'); sky.addColorStop(.56, '#4a7aa0'); sky.addColorStop(1, '#203a55'); c.fillStyle = sky; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff3d6'; c.beginPath(); c.arc(w * .78, h * .5, 26, Math.PI, 0); c.fill();
    c.fillStyle = '#3c5a3a'; c.beginPath(); c.moveTo(0, h * .62); c.quadraticCurveTo(w * .25, h * .5, w * .45, h * .62); c.lineTo(w * .45, h); c.lineTo(0, h); c.fill();
    c.fillStyle = '#f4f4f0'; c.beginPath(); c.moveTo(w * .26, h * .58); c.lineTo(w * .34, h * .58); c.lineTo(w * .325, h * .2); c.lineTo(w * .275, h * .2); c.fill();
    c.fillStyle = '#c0392b'; c.fillRect(w * .268, h * .12, w * .064, h * .09); c.beginPath(); c.moveTo(w * .262, h * .12); c.lineTo(w * .3, h * .05); c.lineTo(w * .338, h * .12); c.fill();
    c.fillStyle = 'rgba(255,240,180,.9)'; c.fillRect(w * .28, h * .14, w * .04, h * .045);
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(w * .5 + i * 30, h * .7 + i * 8); c.lineTo(w * .58 + i * 30, h * .7 + i * 8); c.stroke(); }
  }
  W.wallpaper = {
    render(p) {
      const g = G(), pw = g.v.pwd[K.api.lang()];
      box().innerHTML = `<div class="pc"><canvas id="wall" width="560" height="300"></canvas><div class="login"><span>👤 ${tr('pwdUser')}</span><div class="pslots">${[...pw].map(() => '<i></i>').join('')}</div><small>${tr('letters2', { n: pw.length })}</small></div></div>` + K.inputRow();
      drawWallpaper($('#wall'));
      K.bindInput(v => K.norm(v) === pw, p);
    },
    hint: () => tr('first', { x: G().v.pwd[K.api.lang()][0] })
  };

  // ---------- Article déchiré ----------
  W.article = {
    init(p) { const a = G().v.art; do { p.order = shuffle(a); } while (p.order.every((v, i) => v === a[i])); p.pick = []; },
    render(p) {
      const g = G(), txt = X(g.v.ARTICLE);
      box().innerHTML = `<div class="art"><div class="scraps">${p.order.map(i => `<button class="scrap" data-i="${i}" ${p.pick.includes(i) ? 'disabled' : ''}>${esc(txt[i])}</button>`).join('')}</div>
        <div class="assembled"><h4>${tr('assembled')}</h4>${p.pick.map((i, k) => `<p data-k="${k}">${esc(txt[i])}</p>`).join('')}</div></div><div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.scrap').forEach(b => { b.onclick = () => {
        p.pick.push(+b.dataset.i); K.beep(420, .05, 'triangle', .06);
        if (p.pick.length === g.v.art.length) { const ok = p.pick.every((v, k) => v === g.v.art[k]); if (ok) { W.article.render(p); setTimeout(() => K.solve(p), 500); return; } p.pick = []; W.article.render(p); K.fail(); return; }
        W.article.render(p);
      }; });
      box().querySelectorAll('.assembled p').forEach(e => { e.onclick = () => { p.pick = p.pick.slice(0, +e.dataset.k); W.article.render(p); }; });
      $('#rs').onclick = () => { p.pick = []; W.article.render(p); };
    },
    hint: () => tr('artH')
  };

  // ---------- Plan de rue : associer boutiques et numéros ----------
  W.assoc = {
    init(p) { p.sel = Array(6).fill(-1); },
    render(p) {
      const g = G(), v = g.v;
      if (!g.f.doc_plan) { box().innerHTML = `<p class="cnt">${tr('noPlan')}</p>`; return; }
      const lot = l => `<div class="lot${p.tip === l && p.hl >= 2 ? ' tip' : ''}"><b>${v.LOTNUM(l)}</b><select data-l="${l}"><option value="-1">${tr('pick')}</option>${v.shops.map((s, i) => `<option value="${i}" ${p.sel[l] === i ? 'selected' : ''}>${s.i} ${esc(X(s.n))}</option>`).join('')}</select></div>`;
      box().innerHTML = `<ul class="clues">${v.clues(g).map(c => `<li>${esc(c)}</li>`).join('')}</ul>
        <div class="streetmap"><small>${tr('oddS')} ↑</small><div class="lots">${[0, 1, 2].map(lot).join('')}</div><div class="road">🚗 ${tr('street')} — W ⟷ E</div><div class="lots">${[3, 4, 5].map(lot).join('')}</div><small>${tr('evenS')} ↓</small></div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('select').forEach(s => { s.onchange = () => { p.sel[+s.dataset.l] = +s.value; }; });
      $('#ok').onclick = () => { if (p.sel.every((s, l) => s >= 0 && v.street.L[s] === l)) K.solve(p); else K.fail(); };
    },
    onHint2(p) { const v = G().v; p.tip = v.street.L[0]; },
    hint: () => { const v = G().v; return tr('assocH', { a: X(v.shops[0].n), n: v.LOTNUM(v.street.L[0]) }); }
  };

  // ---------- Factures ----------
  W.invoice = {
    init(p) { p.pick = null; },
    render(p) {
      const g = G(), v = g.v;
      if (!g.f.doc_chat) { box().innerHTML = `<p class="cnt">${tr('noChat')}</p>`; return; }
      box().innerHTML = `<p class="goal">💬 ${tr('clue')} : « ${esc(v.invClue(g))} »</p><div class="invs">${v.inv.list.map((f, i) => `<button class="invc${p.pick === i ? ' sel' : ''}" data-i="${i}">
        <h5>${tr('inv')} n° ${f.no}</h5><p>${tr('day')} : <b>${esc(X(v.DAYS)[f.day])}</b></p><p>${tr('client')} : ${esc(f.client)}</p><p>${tr('item')} : ${esc(X(v.GAMES)[f.game])}</p>
        <p>${tr('total')} : <b>${f.amount.toFixed(2)} $</b></p><p class="pay">${f.pay === 'cash' ? '💵 ' + tr('cash') : '💳 ' + tr('card')}</p></button>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.invc').forEach(b => { b.onclick = () => { p.pick = +b.dataset.i; K.beep(500, .04, 'triangle', .05); box().querySelectorAll('.invc').forEach(x => x.classList.toggle('sel', x === b)); }; });
      $('#ok').onclick = () => { if (p.pick == null) return; if (v.inv.list[p.pick].target) K.solve(p); else K.fail(); };
    },
    hint: () => tr('invH', { x: G().v.inv.list.find(f => f.target).no })
  };

  // ---------- Inventaire à colorier ----------
  W.color = {
    init(p) { p.on = Array(25).fill(0); },
    render(p) {
      const g = G(), v = g.v, C = v.color, cats = X(v.CATS);
      if (p.hl >= 2 && (p.tip == null || p.on[p.tip] === C.bm[p.tip])) p.tip = C.bm.findIndex((b, i) => b !== p.on[i]);
      box().innerHTML = `<table class="inv"><tr>${cats.map((c, k) => `<th>${esc(c)}<small>${tr('colorIf')} ${esc(X(v.RULES[C.rules[k]][1]))}</small></th>`).join('')}</tr>
        ${[0, 1, 2, 3, 4].map(r => `<tr>${[0, 1, 2, 3, 4].map(c => { const i = r * 5 + c; return `<td><button class="cc${p.on[i] ? ' on' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}">${C.vals[i]}</button></td>`; }).join('')}</tr>`).join('')}</table>`;
      box().querySelectorAll('.cc').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i; p.on[i] ^= 1; K.beep(p.on[i] ? 600 : 400, .04, 'square', .05);
        if (p.on.every((x, k) => x === C.bm[k])) { W.color.render(p); box().querySelector('.inv').classList.add('win'); setTimeout(() => K.solve(p), 900); } else W.color.render(p);
      }; });
    },
    hint: () => tr('colH')
  };

  // ---------- Quiz géographique ----------
  W.quiz = {
    init(p) { p.ans = G().v.quiz.map(() => null); },
    render(p) {
      const g = G(), v = g.v;
      box().innerHTML = `<ol class="quiz">${v.quiz.map((q, k) => { const t = X(v.QUIZ[q.q]); return `<li><p>${esc(t[0])}</p><div>${q.o.map(o => `<button class="btn qo${p.ans[k] === o ? ' on' : ''}" data-k="${k}" data-o="${o}">${esc(t[o])}</button>`).join('')}</div></li>`; }).join('')}</ol>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.qo').forEach(b => { b.onclick = () => { p.ans[+b.dataset.k] = +b.dataset.o; K.beep(520, .04, 'triangle', .05); W.quiz.render(p); }; });
      $('#ok').onclick = () => { const wrong = p.ans.filter(a => a !== 1).length; if (!wrong) K.solve(p); else K.fail(tr('wrongN', { n: wrong })); };
    },
    hint: () => { const v = G().v; return tr('quizH', { x: X(v.QUIZ[v.quiz[0].q])[1] }); }
  };
})();

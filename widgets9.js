// Énigmes de récit : journal à reconstituer, lettre déchirée, conversation miroir, deux écritures, formulaire.
// Elles sont génériques : chaque scénario leur fournit ses propres pages, lignes, répliques et notes.
(() => {
  'use strict';
  const K = window.GameKit, { shuffle } = window.Logic, W = K.W, $ = K.$;
  const tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  const lv = () => Math.min(2, K.G.lvl + (K.G.S.hard ? 1 : 0));
  const box = () => $('#pzb');
  const br = s => esc(s).replace(/\n/g, '<br>');
  const start = (s, n = 9) => { const w = String(s).split(/\s+/); return w.slice(0, n).join(' ') + (w.length > n ? '…' : ''); };
  const tilt = i => ((i * 37) % 9 - 4) * .5 + 'deg';
  const forLv = list => list.map((x, i) => i).filter(i => (list[i].lv || 0) <= lv());

  const UI = {
    fr: {
      lbLoose: 'Pages éparpillées', lbTorn: 'date arrachée', lbEmpty: 'Clique sur la page qui vient en premier.', lbCount: 'Pages remises en place : {n} / {m}',
      lbBad: 'Cette page ne vient pas maintenant. Relis la dernière page placée.', lbH: 'La page suivante commence par : « {x} »',
      tnPieces: 'Les morceaux', tnUndo: 'Clique sur une ligne de la lettre pour la retirer.', tnBad: 'Les phrases ne s’enchaînent pas. On recommence.', tnH: 'La ligne suivante : « {x} »', tnBack: 'Une ligne est mal placée : retire les lignes jusqu’à « {x} ».',
      rfTrust: 'Confiance', rfH: 'La réponse qui touche juste : « {x} »',
      hdRules: 'Relis ton journal intime : il dit comment, toi, tu écris.', hdAll: 'Attribue d’abord toutes les notes.', hdBad: '{n} note(s) mal attribuée(s).', hdH: '« {x} » a été écrite par : {y}.',
      rcBad: '{n} réponse(s) fausse(s).', rcH: 'Première question : « {x} ».'
    },
    en: {
      lbLoose: 'Loose pages', lbTorn: 'date torn off', lbEmpty: 'Click the page that comes first.', lbCount: 'Pages put back: {n} / {m}',
      lbBad: 'This page doesn’t come next. Reread the last page you placed.', lbH: 'The next page begins: “{x}”',
      tnPieces: 'The pieces', tnUndo: 'Click a line of the letter to remove it.', tnBad: 'The sentences don’t follow on. Start again.', tnH: 'The next line: “{x}”', tnBack: 'A line is out of place: remove lines back to “{x}”.',
      rfTrust: 'Trust', rfH: 'The answer that rings true: “{x}”',
      hdRules: 'Reread your diary: it says how YOU write.', hdAll: 'Assign every note first.', hdBad: '{n} note(s) assigned to the wrong person.', hdH: '“{x}” was written by: {y}.',
      rcBad: '{n} wrong answer(s).', rcH: 'First question: “{x}”.'
    },
    vi: {
      lbLoose: 'Những trang rời', lbTorn: 'mất ngày tháng', lbEmpty: 'Bấm vào trang đứng đầu.', lbCount: 'Đã xếp lại: {n} / {m} trang',
      lbBad: 'Trang này chưa đến lượt. Hãy đọc lại trang vừa xếp.', lbH: 'Trang tiếp theo bắt đầu bằng: « {x} »',
      tnPieces: 'Các mảnh giấy', tnUndo: 'Bấm vào một dòng của lá thư để gỡ nó ra.', tnBad: 'Các câu không nối được với nhau. Làm lại nhé.', tnH: 'Dòng tiếp theo: « {x} »', tnBack: 'Có một dòng bị đặt sai: hãy gỡ các dòng cho đến « {x} ».',
      rfTrust: 'Niềm tin', rfH: 'Câu trả lời chạm đến lòng người: « {x} »',
      hdRules: 'Hãy đọc lại nhật ký của bạn: nó cho biết BẠN viết như thế nào.', hdAll: 'Hãy gán người viết cho tất cả ghi chú trước.', hdBad: '{n} ghi chú bị gán sai người.', hdH: '« {x} » do {y} viết.',
      rcBad: '{n} câu trả lời sai.', rcH: 'Câu hỏi đầu tiên: « {x} ».'
    }
  };
  const PZ = {
    fr: {
      logbook: { t: 'Le journal à reconstituer', i: 'Clique sur les pages dans l’ordre chronologique. Quand une date manque, le récit te dit où va la page.', h: 'Cherche les mots qui relient les pages : « deuxième nuit », « hier », « au réveil »…' },
      torn: { t: 'La lettre déchirée', i: 'Clique sur les morceaux dans l’ordre pour reconstituer la lettre.', h: 'Chaque phrase répond à la précédente.' },
      reflet: { t: 'La conversation miroir', i: 'Choisis tes réponses. Une phrase blessante, ou fausse, fait reculer ton reflet.', h: 'Écoute ce que ressent ton reflet, et sers-toi de tout ce que tu as découvert.' },
      hands: { t: 'Les deux écritures', i: 'Clique sur chaque note pour dire qui l’a écrite, puis valide.', h: 'Compare chaque note à ce que ton journal dit de toi.' },
      recall: { t: 'Le formulaire', i: 'Remplis chaque ligne grâce à ce que tu as lu, puis valide.', h: 'Toutes les réponses sont dans les documents de ton Carnet.' }
    },
    en: {
      logbook: { t: 'The logbook to rebuild', i: 'Click the pages in chronological order. When a date is missing, the story tells you where the page goes.', h: 'Look for the words linking the pages: “second night”, “yesterday”, “on waking”…' },
      torn: { t: 'The torn letter', i: 'Click the pieces in order to rebuild the letter.', h: 'Each sentence answers the one before.' },
      reflet: { t: 'The mirror conversation', i: 'Choose your replies. A hurtful or untrue line makes your reflection pull away.', h: 'Listen to what your reflection feels, and use everything you have discovered.' },
      hands: { t: 'Two handwritings', i: 'Click each note to say who wrote it, then check.', h: 'Compare each note with what your diary says about you.' },
      recall: { t: 'The form', i: 'Fill in each line from what you have read, then check.', h: 'All the answers are in the documents in your Journal.' }
    },
    vi: {
      logbook: { t: 'Cuốn nhật ký cần ghép lại', i: 'Bấm vào các trang theo đúng trình tự thời gian. Khi thiếu ngày tháng, câu chuyện sẽ cho bạn biết trang đó nằm ở đâu.', h: 'Tìm những từ nối các trang: « đêm thứ hai », « hôm qua », « vừa thức dậy »…' },
      torn: { t: 'Lá thư bị xé', i: 'Bấm vào các mảnh theo đúng thứ tự để ghép lại lá thư.', h: 'Mỗi câu nối tiếp câu trước.' },
      reflet: { t: 'Cuộc trò chuyện trong gương', i: 'Chọn câu trả lời. Một câu gây tổn thương hoặc sai sự thật sẽ khiến hình bóng lùi xa.', h: 'Lắng nghe cảm xúc của hình bóng, và dùng mọi điều bạn đã khám phá.' },
      hands: { t: 'Hai nét chữ', i: 'Bấm vào từng ghi chú để chọn người viết, rồi kiểm tra.', h: 'So sánh từng ghi chú với những gì nhật ký nói về bạn.' },
      recall: { t: 'Tờ khai', i: 'Điền từng dòng dựa trên những gì bạn đã đọc, rồi kiểm tra.', h: 'Mọi câu trả lời đều nằm trong các tài liệu của Sổ tay.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ---- Journal à reconstituer : pages {d: date, b: texte} données dans l'ordre ----
  W.logbook = {
    init(p, d) { const n = d.pages(K.G).length; do { p.order = shuffle([...Array(n).keys()]); } while (p.order[0] === 0); p.done = []; p.bad = null; },
    render(p) {
      const d = p.def, pg = d.pages(K.G), l = lv();
      const dated = i => l === 0 || (l === 1 ? i % 3 !== 1 : i % 2 === 0);
      const left = p.order.filter(i => !p.done.includes(i));
      box().innerHTML = `<div class="lbk ${d.look || ''}">
        <div class="lbk-loose"><h4>${tr('lbLoose')}</h4>${left.map(i => `<button class="lpage${p.bad === i ? ' bad' : ''}" data-i="${i}" style="--r:${tilt(i)}">${dated(i) ? `<b>${esc(X(pg[i].d))}</b>` : `<b class="torn">${tr('lbTorn')}</b>`}${br(X(pg[i].b))}</button>`).join('')}</div>
        <div class="lbk-book"><h4>${esc(X(d.book))}</h4>${p.done.map((i, k) => `<div class="lline${k === p.done.length - 1 ? ' nw' : ''}"><b>${esc(X(pg[i].d))}</b> ${br(X(pg[i].b))}</div>`).join('') || `<p class="lempty">${tr('lbEmpty')}</p>`}</div></div>
        <p class="cnt">${tr('lbCount', { n: p.done.length, m: pg.length })}</p>`;
      const bk = box().querySelector('.lbk-book'); bk.scrollTop = bk.scrollHeight;
      box().querySelectorAll('.lpage').forEach(b => { b.onclick = () => {
        if (K.G.f['pz_' + p.id]) return;
        const i = +b.dataset.i;
        if (i !== p.done.length) { p.bad = i; W.logbook.render(p); K.fail(tr('lbBad')); return; }
        p.bad = null; p.done.push(i); K.beep(440 + p.done.length * 40, .07, 'triangle', .06); W.logbook.render(p);
        if (p.done.length === pg.length) setTimeout(() => K.solve(p), 900);
      }; });
    },
    hint(p) { const pg = p.def.pages(K.G); return tr('lbH', { x: start(X(pg[Math.min(p.done.length, pg.length - 1)].b)) }); }
  };

  // ---- Lettre déchirée : lignes données dans l'ordre ----
  W.torn = {
    init(p, d) {
      const n = d.lines(K.G).length, l = lv();
      p.fixed = l === 0 ? [0, n - 1] : l === 1 ? [0] : [];
      const free = [...Array(n).keys()].filter(i => !p.fixed.includes(i));
      do { p.order = shuffle(free); } while (p.order.length > 1 && p.order.every((v, k) => v === free[k]));
      p.pick = p.fixed.includes(0) ? [0] : [];
    },
    render(p) {
      const d = p.def, ln = d.lines(K.G), n = ln.length, lastFixed = p.fixed.includes(n - 1);
      const left = p.order.filter(i => !p.pick.includes(i));
      box().innerHTML = `<div class="tn ${d.look || ''}">
        <div class="tnp"><h4>${tr('tnPieces')}</h4>${left.map(i => `<button class="strip" data-i="${i}" style="--r:${tilt(i + 3)}">${esc(X(ln[i]))}</button>`).join('')}</div>
        <div class="tnl">${p.pick.map((i, k) => `<p data-k="${k}" class="${p.fixed.includes(i) ? 'fx' : ''}${k === p.pick.length - 1 && k ? ' nw' : ''}">${esc(X(ln[i]))}</p>`).join('')}${lastFixed ? `<p class="fx sig">${'· · ·'}</p><p class="fx">${esc(X(ln[n - 1]))}</p>` : ''}</div></div>
        <p class="cnt">${tr('tnUndo')}</p>`;
      box().querySelectorAll('.strip').forEach(b => { b.onclick = () => {
        if (K.G.f['pz_' + p.id]) return;
        p.pick.push(+b.dataset.i); K.beep(500, .05, 'triangle', .06);
        const need = n - (lastFixed ? 1 : 0);
        if (p.pick.length === need) {
          const full = lastFixed ? p.pick.concat(n - 1) : p.pick;
          if (full.every((v, k) => v === k)) { p.pick = full; p.fixed = p.fixed.filter(i => i !== n - 1); W.torn.render(p); setTimeout(() => K.solve(p), 900); return; }
          p.pick = p.fixed.includes(0) ? [0] : []; W.torn.render(p); K.fail(tr('tnBad')); return;
        }
        W.torn.render(p);
      }; });
      box().querySelectorAll('.tnl p[data-k]').forEach(e => { e.onclick = () => {
        if (K.G.f['pz_' + p.id] || e.classList.contains('fx')) return;
        p.pick = p.pick.slice(0, +e.dataset.k); W.torn.render(p);
      }; });
    },
    hint(p) {
      const ln = p.def.lines(K.G), ok = p.pick.findIndex((v, k) => v !== k);
      if (ok >= 0) return tr('tnBack', { x: start(X(ln[ok - 1] != null ? ln[ok - 1] : ln[0]), 6) });
      return tr('tnH', { x: start(X(ln[Math.min(p.pick.length, ln.length - 1)])) });
    }
  };

  // ---- Conversation miroir : répliques {q, o: [[réponse, juste, réaction], …], lv} ----
  W.reflet = {
    init(p, d) { p.nodes = forLv(d.nodes); p.k = 0; p.log = []; p.ord = p.nodes.map(i => shuffle([...d.nodes[i].o.keys()])); p.react = null; p.anim = -1; p.end = null; },
    render(p) {
      const d = p.def, done = p.k >= p.nodes.length, node = done ? null : d.nodes[p.nodes[p.k]];
      const flip = !done && lv() >= 1 && p.anim !== p.k; p.anim = p.k;
      const said = done ? X(p.end) : X(node.q);
      box().innerHTML = `<div class="refl${p.react ? ' fog' : ''}">
        <div class="rmirror"><div class="rface"></div><div class="rsay${flip ? ' flip' : ''}${done ? ' end' : ''}">${esc(said)}</div></div>
        <div class="rtrust" title="${tr('rfTrust')}">${p.nodes.map((_, i) => `<i class="${i < p.k ? 'on' : ''}"></i>`).join('')}</div>
        <div class="rlog">${p.log.map(([s, t]) => `<div class="rl-${s}"><small>${esc(X(s === 'a' ? d.who : d.me))}</small>${esc(X(t))}</div>`).join('')}</div>
        ${p.react ? `<p class="rreact">${esc(X(p.react))}</p>` : ''}
        ${done ? '' : `<div class="ropts">${p.ord[p.k].map(j => `<button class="btn ropt" data-j="${j}">${esc(X(node.o[j][0]))}</button>`).join('')}</div>`}</div>`;
      const lg = box().querySelector('.rlog'); lg.scrollTop = lg.scrollHeight;
      box().querySelectorAll('.ropt').forEach(b => { b.onclick = () => {
        if (K.G.f['pz_' + p.id]) return;
        const [txt, ok, re] = node.o[+b.dataset.j];
        if (!ok) { p.react = re; W.reflet.render(p); K.fail(); return; }
        p.react = null; p.log.push(['a', node.q], ['b', txt]); p.k++; const fb = $('#fb'); if (fb) fb.textContent = '';
        K.beep(600 + p.k * 50, .1, 'sine', .06);
        if (p.k >= p.nodes.length) { p.end = re; W.reflet.render(p); setTimeout(() => K.solve(p), 2600); return; }
        p.log.push(['a', re]); p.log = p.log.slice(-6);
        W.reflet.render(p);
      }; });
    },
    hint(p) { const node = p.def.nodes[p.nodes[Math.min(p.k, p.nodes.length - 1)]]; return tr('rfH', { x: X(node.o.find(o => o[1])[0]) }); }
  };

  // ---- Deux écritures : notes {t, w: 0 ou 1, lv} ----
  W.hands = {
    init(p, d) { p.ns = shuffle(forLv(d.notes)); p.a = {}; },
    render(p) {
      const d = p.def;
      box().innerHTML = (lv() < 2 ? `<div class="hrules">${br(X(d.rules))}</div>` : `<p class="cnt">${tr('hdRules')}</p>`)
        + `<div class="hnotes">${p.ns.map(i => { const a = p.a[i]; return `<button class="hnote a${a == null ? 'x' : a}" data-i="${i}"><span>${esc(X(d.notes[i].t))}</span><em>${a == null ? '?' : esc(X(d.names[a]))}</em></button>`; }).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.hnote').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i; p.a[i] = p.a[i] == null ? 0 : 1 - p.a[i]; K.beep(p.a[i] ? 660 : 520, .04, 'triangle', .05); W.hands.render(p);
      }; });
      $('#ok').onclick = () => {
        if (p.ns.some(i => p.a[i] == null)) { $('#fb').textContent = tr('hdAll'); return; }
        const bad = p.ns.filter(i => p.a[i] !== d.notes[i].w).length;
        if (!bad) K.solve(p); else K.fail(tr('hdBad', { n: bad }));
      };
    },
    hint(p) {
      const d = p.def, i = p.ns.find(k => p.a[k] !== d.notes[k].w); const k = i == null ? p.ns[0] : i;
      return tr('hdH', { x: start(X(d.notes[k].t), 6), y: X(d.names[d.notes[k].w]) });
    }
  };

  // ---- Formulaire : questions {q, o: [bonne, autres…], lv} ----
  W.recall = {
    init(p, d) { p.qs = forLv(d.qs); p.ord = p.qs.map(i => shuffle([...d.qs[i].o.keys()])); p.ans = {}; },
    render(p) {
      const d = p.def;
      box().innerHTML = `<div class="rform"><h4>${esc(X(d.head))}</h4><ol>${p.qs.map((i, k) => `<li>${esc(X(d.qs[i].q))}<div>${p.ord[k].map(o => `<button class="btn rco${p.ans[k] === o ? ' on' : ''}" data-k="${k}" data-o="${o}">${esc(X(d.qs[i].o[o]))}</button>`).join('')}</div></li>`).join('')}</ol></div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.rco').forEach(b => { b.onclick = () => { p.ans[+b.dataset.k] = +b.dataset.o; K.beep(520, .04, 'triangle', .05); W.recall.render(p); }; });
      $('#ok').onclick = () => { const bad = p.qs.filter((i, k) => p.ans[k] !== 0).length; if (!bad) K.solve(p); else K.fail(tr('rcBad', { n: bad })); };
    },
    hint(p) { const q = p.def.qs[p.qs[0]]; return tr('rcH', { x: X(q.o[0]) }); }
  };
})();

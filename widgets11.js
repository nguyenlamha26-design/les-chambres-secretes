// Énigmes d'enquête, génériques : chaque scénario fournit ses suspects, ses échantillons, ses témoignages et ses preuves.
// prints : comparer une empreinte de semelle partielle aux chaussures des suspects
// lab    : trouver l'échantillon empoisonné (ou suspect) avec un nombre limité de bandelettes réactives
// contra : interrogatoire, confronter chaque mensonge à la bonne pièce à conviction
// clue   : relire un document et désigner la phrase qui trahit son auteur
// accuse : l'accusation finale (qui, comment, pourquoi), chaque réponse appuyée par une preuve
(() => {
  'use strict';
  const K = window.GameKit, { shuffle } = window.Logic, W = K.W, $ = K.$;
  const tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  const lv = () => Math.min(2, K.G.lvl + (K.G.S.hard ? 1 : 0));
  const box = () => $('#pzb');
  const rand = n => Math.floor(Math.random() * n);
  const done = p => K.G.f['pz_' + p.id];
  const start = (s, n = 8) => { const w = String(s).split(/\s+/); return w.slice(0, n).join(' ') + (w.length > n ? '…' : ''); };
  // Pièces à conviction du scénario : [{ id, i, n, d, has(g) }]
  const evOf = p => (p.def.ev || K.G.S.evidence || []);
  const evName = (p, id) => { const e = evOf(p).find(x => x.id === id); return e ? e.i + ' ' + X(e.n) : '?'; };

  const UI = {
    fr: {
      prScene: 'Empreinte relevée', prSmudge: 'zone effacée', prPick: 'Clique sur la semelle qui correspond, puis valide.', prBad: 'Cette semelle ne correspond pas à l’empreinte.', prH: 'La semelle de {x} ne correspond pas à la rangée {r} (en partant du talon).', prNone: 'Choisis d’abord une semelle.',
      lbStrips: 'Bandelette', lbSample: 'Échantillon', lbRun: '🧪 Tremper les bandelettes', lbPos: 'POSITIF', lbNeg: 'négatif', lbAsk: 'Quel échantillon contient le produit ?', lbConclude: 'Conclure', lbBad: 'Mauvaise conclusion : les bandelettes sont gâchées. On recommence avec des neuves.', lbNoRun: 'Trempe d’abord les bandelettes.', lbLeft: 'Tu n’as que {n} bandelettes : une seule analyse possible. Coche, pour chaque bandelette, les échantillons dont tu y déposes une goutte.', lbH: 'Donne à chaque échantillon une combinaison différente de bandelettes : aucune, la 1, la 2, la 1 et la 2…',
      ctSays: 'Déclarations', ctEv: 'Pièces à conviction', ctPresent: '⚖️ Confronter', ctPick: 'Choisis une déclaration, puis la preuve qui la contredit.', ctBad: 'Cette preuve ne contredit pas cette déclaration.', ctTrue: 'Cette déclaration tient la route : rien ne la contredit.', ctMiss: 'Il te manque encore des preuves pour confronter ce témoin. Continue de fouiller.', ctLeft: 'Mensonges à démasquer : {n}', ctH: '« {x} » est contredit par : {y}.', ctUnknown: 'pièce non trouvée',
      clBad: 'Ce n’est pas ce passage qui trahit son auteur.', clPick: 'Clique sur le ou les passages suspects, puis valide.', clH: 'Le passage suspect commence par : « {x} »', clNone: 'Sélectionne d’abord un passage.',
      acProof: 'Preuve :', acPick: 'Choisis…', acBad: '{n} point(s) de ton accusation ne tiennent pas devant un juge.', acH: '{x} → {y}', acAll: 'Réponds à toutes les questions, preuves comprises.'
    },
    en: {
      prScene: 'Print found', prSmudge: 'smudged area', prPick: 'Click the matching sole, then check.', prBad: 'That sole doesn’t match the print.', prH: '{x}’s sole doesn’t match row {r} (counting from the heel).', prNone: 'Pick a sole first.',
      lbStrips: 'Strip', lbSample: 'Sample', lbRun: '🧪 Dip the strips', lbPos: 'POSITIVE', lbNeg: 'negative', lbAsk: 'Which sample contains the substance?', lbConclude: 'Conclude', lbBad: 'Wrong conclusion: the strips are wasted. Starting again with fresh ones.', lbNoRun: 'Dip the strips first.', lbLeft: 'You only have {n} strips: one analysis only. For each strip, tick the samples you put a drop of on it.', lbH: 'Give each sample a different combination of strips: none, strip 1, strip 2, strips 1 and 2…',
      ctSays: 'Statements', ctEv: 'Evidence', ctPresent: '⚖️ Confront', ctPick: 'Pick a statement, then the evidence that contradicts it.', ctBad: 'That evidence doesn’t contradict this statement.', ctTrue: 'That statement holds up: nothing contradicts it.', ctMiss: 'You are still missing evidence to confront this witness. Keep searching.', ctLeft: 'Lies to expose: {n}', ctH: '“{x}” is contradicted by: {y}.', ctUnknown: 'evidence not found',
      clBad: 'That is not the passage that gives its author away.', clPick: 'Click the suspicious passage(s), then check.', clH: 'The suspicious passage begins: “{x}”', clNone: 'Select a passage first.',
      acProof: 'Evidence:', acPick: 'Choose…', acBad: '{n} point(s) of your accusation wouldn’t stand up in court.', acH: '{x} → {y}', acAll: 'Answer every question, evidence included.'
    },
    vi: {
      prScene: 'Dấu giày thu được', prSmudge: 'vùng bị nhòe', prPick: 'Bấm vào đế giày khớp với dấu, rồi kiểm tra.', prBad: 'Đế giày này không khớp với dấu giày.', prH: 'Đế giày của {x} không khớp ở hàng {r} (tính từ gót).', prNone: 'Hãy chọn một đế giày trước.',
      lbStrips: 'Que thử', lbSample: 'Mẫu', lbRun: '🧪 Nhúng que thử', lbPos: 'DƯƠNG TÍNH', lbNeg: 'âm tính', lbAsk: 'Mẫu nào chứa chất đó?', lbConclude: 'Kết luận', lbBad: 'Kết luận sai: que thử đã hỏng. Làm lại với que mới.', lbNoRun: 'Hãy nhúng que thử trước.', lbLeft: 'Bạn chỉ có {n} que thử: chỉ phân tích được một lần. Với mỗi que, hãy đánh dấu những mẫu bạn nhỏ một giọt lên đó.', lbH: 'Cho mỗi mẫu một tổ hợp que thử khác nhau: không que nào, que 1, que 2, cả que 1 và 2…',
      ctSays: 'Lời khai', ctEv: 'Vật chứng', ctPresent: '⚖️ Đối chất', ctPick: 'Chọn một lời khai, rồi chọn vật chứng mâu thuẫn với nó.', ctBad: 'Vật chứng này không mâu thuẫn với lời khai đó.', ctTrue: 'Lời khai này đứng vững: không có gì mâu thuẫn.', ctMiss: 'Bạn còn thiếu vật chứng để đối chất nhân chứng này. Hãy tiếp tục tìm kiếm.', ctLeft: 'Lời nói dối cần vạch trần: {n}', ctH: '« {x} » mâu thuẫn với: {y}.', ctUnknown: 'chưa tìm thấy',
      clBad: 'Đó không phải đoạn làm lộ người viết.', clPick: 'Bấm vào (các) đoạn đáng ngờ, rồi kiểm tra.', clH: 'Đoạn đáng ngờ bắt đầu bằng: « {x} »', clNone: 'Hãy chọn một đoạn trước.',
      acProof: 'Bằng chứng:', acPick: 'Chọn…', acBad: '{n} điểm trong lời buộc tội của bạn không đứng vững trước tòa.', acH: '{x} → {y}', acAll: 'Hãy trả lời mọi câu hỏi, kể cả phần bằng chứng.'
    }
  };
  const PZ = {
    fr: {
      prints: { t: 'Les empreintes', i: 'Compare l’empreinte relevée aux semelles des suspects. Les zones effacées ne comptent pas.', h: 'Compare rangée par rangée, en partant du talon.' },
      lab: { t: 'L’analyse', i: 'Dépose des gouttes des échantillons sur les bandelettes, trempe-les une seule fois, puis déduis quel échantillon est en cause.', h: 'Chaque échantillon doit avoir sa propre combinaison de bandelettes.' },
      contra: { t: 'L’interrogatoire', i: 'Écoute le témoin. Quand une déclaration est fausse, confronte-la à la preuve qui la contredit.', h: 'Relis tes pièces à conviction et les documents de ton Carnet.' },
      clue: { t: 'Le document', i: 'Relis ce document attentivement : un passage trahit son auteur.', h: 'Cherche un détail que l’auteur ne pouvait pas connaître… ou qu’il n’aurait pas dû écrire.' },
      accuse: { t: 'L’accusation', i: 'Réponds à chaque question et, quand on te le demande, cite la preuve qui l’établit.', h: 'Reprends tout ton Carnet : chaque réponse doit s’appuyer sur une pièce.' }
    },
    en: {
      prints: { t: 'The prints', i: 'Compare the print found with the suspects’ soles. Smudged areas don’t count.', h: 'Compare row by row, starting from the heel.' },
      lab: { t: 'The analysis', i: 'Put drops of the samples on the strips, dip them once, then work out which sample is the one.', h: 'Each sample needs its own combination of strips.' },
      contra: { t: 'The interrogation', i: 'Listen to the witness. When a statement is false, confront it with the evidence that contradicts it.', h: 'Reread your evidence and the documents in your Journal.' },
      clue: { t: 'The document', i: 'Read this document carefully: one passage gives its author away.', h: 'Look for a detail the author could not have known… or should not have written.' },
      accuse: { t: 'The accusation', i: 'Answer each question and, when asked, cite the evidence that proves it.', h: 'Go through your whole Journal: every answer must rest on a piece of evidence.' }
    },
    vi: {
      prints: { t: 'Dấu giày', i: 'So sánh dấu giày thu được với đế giày của các nghi phạm. Vùng bị nhòe không tính.', h: 'So từng hàng một, bắt đầu từ gót.' },
      lab: { t: 'Xét nghiệm', i: 'Nhỏ từng mẫu lên các que thử, nhúng que một lần duy nhất, rồi suy ra mẫu nào có vấn đề.', h: 'Mỗi mẫu cần một tổ hợp que thử riêng.' },
      contra: { t: 'Thẩm vấn', i: 'Lắng nghe nhân chứng. Khi một lời khai sai, hãy đối chất nó với vật chứng mâu thuẫn.', h: 'Đọc lại vật chứng và các tài liệu trong Sổ tay.' },
      clue: { t: 'Tài liệu', i: 'Đọc kỹ tài liệu này: có một đoạn làm lộ người viết.', h: 'Tìm một chi tiết mà người viết không thể biết… hoặc lẽ ra không nên viết ra.' },
      accuse: { t: 'Lời buộc tội', i: 'Trả lời từng câu hỏi và, khi được yêu cầu, chỉ ra bằng chứng chứng minh điều đó.', h: 'Xem lại toàn bộ Sổ tay: mỗi câu trả lời phải dựa trên một vật chứng.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ---- Empreintes : sus [noms], ans (indice du coupable, < 3) ----
  const COLS = 5, ROWS = 11;
  const inSole = (r, c) => !((r === 0 || r === ROWS - 1) && (c === 0 || c === COLS - 1)) && !((r === 5 || r === 6) && (c === 0 || c === COLS - 1));
  const CELLS = []; for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (inSole(r, c)) CELLS.push(r * COLS + c);
  W.prints = {
    init(p, d) {
      const l = lv(), n = Math.min(d.sus.length, [3, 4, 5][l]), flips = [9, 6, 3][l], hide = [.3, .42, .52][l];
      p.who = [...Array(n).keys()]; if (!p.who.includes(d.ans)) p.who[n - 1] = d.ans;
      for (;;) {
        const base = {}; CELLS.forEach(k => { base[k] = Math.random() < .5 ? 1 : 0; });
        const pat = {}; p.who.forEach(i => { pat[i] = { ...base }; if (i !== d.ans) shuffle(CELLS).slice(0, flips).forEach(k => { pat[i][k] ^= 1; }); });
        const hidden = new Set(shuffle(CELLS).slice(0, Math.round(CELLS.length * hide)));
        const ok = p.who.every(i => i === d.ans || CELLS.some(k => !hidden.has(k) && pat[i][k] !== base[k]));
        if (ok) { Object.assign(p, { pat, hidden: [...hidden], pick: null, order: shuffle(p.who.slice()) }); return; }
      }
    },
    sole(pat, hidden) {
      const H = new Set(hidden || []);
      let s = '<div class="sole">'; for (let r = ROWS - 1; r >= 0; r--) for (let c = 0; c < COLS; c++) { const k = r * COLS + c; s += !inSole(r, c) ? '<i class="x"></i>' : H.has(k) ? '<i class="h"></i>' : `<i class="${pat[k] ? 'f' : ''}"></i>`; }
      return s + '</div>';
    },
    render(p) {
      const d = p.def;
      box().innerHTML = `<div class="prw"><div class="prscene ${d.style || ''}"><b>${tr('prScene')}</b>${W.prints.sole(p.pat[d.ans], p.hidden)}<small>▒ ${tr('prSmudge')}</small></div>
        <div class="prsus">${p.order.map(i => `<button class="prs${p.pick === i ? ' on' : ''}" data-i="${i}">${W.prints.sole(p.pat[i])}<span>${esc(X(d.sus[i]))}</span></button>`).join('')}</div></div>
        <p class="cnt">${tr('prPick')}</p><div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.prs').forEach(b => { b.onclick = () => { p.pick = +b.dataset.i; K.beep(520, .04, 'triangle', .05); W.prints.render(p); }; });
      $('#ok').onclick = () => { if (done(p)) return; if (p.pick == null) { $('#fb').textContent = tr('prNone'); return; } if (p.pick === d.ans) K.solve(p); else K.fail(tr('prBad')); };
    },
    hint(p) {
      const d = p.def, H = new Set(p.hidden), base = p.pat[d.ans];
      for (const i of p.order) { if (i === d.ans) continue; const k = CELLS.find(c => !H.has(c) && p.pat[i][c] !== base[c]); if (k != null) return tr('prH', { x: X(d.sus[i]), r: Math.floor(k / COLS) + 1 }); }
      return tr('prPick');
    }
  };

  // ---- Analyse : samples [{i, n}], ans (indice, < 4) ----
  W.lab = {
    init(p, d) {
      const l = lv(), n = Math.min(d.samples.length, [4, 6, 8][l]);
      p.s = [...Array(n).keys()]; if (!p.s.includes(d.ans)) p.s[n - 1] = d.ans; p.s = shuffle(p.s);
      p.k = Math.ceil(Math.log2(n)); p.m = {}; p.res = null; p.pick = null;
    },
    render(p) {
      const d = p.def, ran = !!p.res;
      box().innerHTML = `<p class="cnt">${tr('lbLeft', { n: p.k })}</p><table class="labt"><tr><th>${tr('lbSample')}</th>${Array.from({ length: p.k }, (_, j) => `<th>${tr('lbStrips')} ${j + 1}${ran ? `<span class="strip ${p.res[j] ? 'pos' : 'neg'}">${p.res[j] ? tr('lbPos') : tr('lbNeg')}</span>` : ''}</th>`).join('')}<th></th></tr>
        ${p.s.map(i => `<tr><td class="lbn"><b>${d.samples[i].i}</b>${esc(X(d.samples[i].n))}</td>${Array.from({ length: p.k }, (_, j) => `<td><button class="drop${p.m[i + '_' + j] ? ' on' : ''}" data-i="${i}" data-j="${j}" ${ran ? 'disabled' : ''}>${p.m[i + '_' + j] ? '💧' : ''}</button></td>`).join('')}
        <td>${ran ? `<button class="btn lbp${p.pick === i ? ' on' : ''}" data-i="${i}">◎</button>` : ''}</td></tr>`).join('')}</table>
        <div class="row">${ran ? `<span class="cnt">${tr('lbAsk')}</span><button class="btn gold" id="ok">${tr('lbConclude')}</button>` : `<button class="btn gold" id="run">${tr('lbRun')}</button>`}</div>`;
      box().querySelectorAll('.drop').forEach(b => { b.onclick = () => { const key = b.dataset.i + '_' + b.dataset.j; p.m[key] = !p.m[key]; K.beep(700, .03, 'sine', .05); W.lab.render(p); }; });
      box().querySelectorAll('.lbp').forEach(b => { b.onclick = () => { p.pick = +b.dataset.i; W.lab.render(p); }; });
      if ($('#run')) $('#run').onclick = () => { p.res = Array.from({ length: p.k }, (_, j) => !!p.m[d.ans + '_' + j]); K.beep(300, .3, 'sine', .08); W.lab.render(p); };
      if ($('#ok')) $('#ok').onclick = () => {
        if (done(p)) return; if (p.pick == null) { $('#fb').textContent = tr('lbAsk'); return; }
        if (p.pick === d.ans) K.solve(p); else { p.m = {}; p.res = null; p.pick = null; W.lab.render(p); K.fail(tr('lbBad')); }
      };
    },
    hint: () => tr('lbH')
  };

  // ---- Interrogatoire : who, st [{t, ev (id ou null), re, lv}] ----
  W.contra = {
    init(p, d) { p.st = d.st.map((s, i) => i).filter(i => (d.st[i].lv || 0) <= lv()); p.done = []; p.sel = null; p.ev = null; },
    need(p) { return p.st.filter(i => p.def.st[i].ev); },
    render(p) {
      const d = p.def, G = K.G, evs = evOf(p), need = W.contra.need(p), left = need.filter(i => !p.done.includes(i));
      const missing = left.some(i => { const e = evs.find(x => x.id === d.st[i].ev); return e && !e.has(G); });
      box().innerHTML = `<div class="ctw"><div class="ctwho">${d.face || '🧑'}<b>${esc(X(d.who))}</b><small>${esc(X(d.role || ''))}</small></div>
        <div class="ctcols"><div class="ctst"><h4>${tr('ctSays')}</h4>${p.st.map(i => { const s = d.st[i], k = p.done.includes(i);
          return `<button class="cts${p.sel === i ? ' on' : ''}${k ? ' broke' : ''}" data-i="${i}" ${k ? 'disabled' : ''}>« ${esc(X(s.t))} »${k ? `<em>${esc(X(s.re))}</em>` : ''}</button>`; }).join('')}</div>
        <div class="ctev"><h4>${tr('ctEv')}</h4>${evs.map(e => e.has(G) ? `<button class="cte${p.ev === e.id ? ' on' : ''}" data-e="${e.id}"><b>${e.i}</b>${esc(X(e.n))}</button>` : `<span class="cte no"><b>❔</b>${tr('ctUnknown')}</span>`).join('')}</div></div>
        <p class="cnt">${tr('ctLeft', { n: left.length })}${missing ? ' — ' + tr('ctMiss') : ''}</p>
        <div class="row"><button class="btn gold" id="ok">${tr('ctPresent')}</button></div></div>`;
      box().querySelectorAll('.cts').forEach(b => { b.onclick = () => { p.sel = +b.dataset.i; K.beep(520, .03, 'triangle', .05); W.contra.render(p); }; });
      box().querySelectorAll('.cte[data-e]').forEach(b => { b.onclick = () => { p.ev = b.dataset.e; K.beep(620, .03, 'triangle', .05); W.contra.render(p); }; });
      $('#ok').onclick = () => {
        if (done(p)) return;
        if (p.sel == null || !p.ev) { $('#fb').textContent = tr('ctPick'); return; }
        const s = d.st[p.sel];
        if (!s.ev) { K.fail(tr('ctTrue')); return; }
        if (s.ev !== p.ev) { K.fail(tr('ctBad')); return; }
        p.done.push(p.sel); p.sel = null; p.ev = null; K.beep(880, .15, 'square', .06); W.contra.render(p);
        if (W.contra.need(p).every(i => p.done.includes(i))) setTimeout(() => K.solve(p), 1400);
      };
    },
    hint(p) {
      const d = p.def, i = W.contra.need(p).find(k => !p.done.includes(k));
      return i == null ? tr('ctPick') : tr('ctH', { x: start(X(d.st[i].t)), y: evName(p, d.st[i].ev) });
    }
  };

  // ---- Document : head, parts [segments], ans [indices] ----
  W.clue = {
    init(p) { p.sel = []; },
    render(p) {
      const d = p.def;
      box().innerHTML = `<div class="cldoc ${d.look || ''}"><h4>${esc(X(d.head))}</h4><p>${d.parts.map((s, i) => `<span class="clp${p.sel.includes(i) ? ' on' : ''}" data-i="${i}">${esc(X(s))}</span>`).join(' ')}</p></div>
        <p class="cnt">${d.q ? esc(X(d.q)) + ' ' : ''}${tr('clPick')}</p><div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.clp').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.sel = p.sel.includes(i) ? p.sel.filter(x => x !== i) : p.sel.concat(i); K.beep(560, .03, 'triangle', .05); W.clue.render(p); }; });
      $('#ok').onclick = () => {
        if (done(p)) return; if (!p.sel.length) { $('#fb').textContent = tr('clNone'); return; }
        const ok = p.sel.length === d.ans.length && d.ans.every(i => p.sel.includes(i));
        if (ok) K.solve(p); else { p.sel = []; W.clue.render(p); K.fail(tr('clBad')); }
      };
    },
    hint(p) { return tr('clH', { x: start(X(p.def.parts[p.def.ans[0]]), 6) }); }
  };

  // ---- Accusation : qs [{q, o: [bonne, autres…], ev (preuve attendue), lv}] ----
  W.accuse = {
    init(p, d) { p.qs = d.qs.map((q, i) => i).filter(i => (d.qs[i].lv || 0) <= lv()); p.ord = p.qs.map(i => shuffle([...d.qs[i].o.keys()])); p.a = {}; p.e = {}; },
    proof: (p, i) => lv() >= 1 && !!p.def.qs[i].ev,
    render(p) {
      const d = p.def, G = K.G, evs = evOf(p).filter(e => e.has(G));
      box().innerHTML = `<div class="acc">${p.qs.map((i, k) => { const q = d.qs[i];
        return `<div class="accq"><h4>${esc(X(q.q))}</h4><div class="acco">${p.ord[k].map(o => `<button class="btn aco${p.a[i] === o ? ' on' : ''}" data-i="${i}" data-o="${o}">${esc(X(q.o[o]))}</button>`).join('')}</div>
          ${W.accuse.proof(p, i) ? `<label class="acev">${tr('acProof')} <select data-i="${i}"><option value="">${tr('acPick')}</option>${evs.map(e => `<option value="${e.id}"${p.e[i] === e.id ? ' selected' : ''}>${e.i} ${esc(X(e.n))}</option>`).join('')}</select></label>` : ''}</div>`; }).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">⚖️ ${tr('check')}</button></div>`;
      box().querySelectorAll('.aco').forEach(b => { b.onclick = () => { p.a[+b.dataset.i] = +b.dataset.o; K.beep(520, .03, 'triangle', .05); W.accuse.render(p); }; });
      box().querySelectorAll('.acev select').forEach(s => { s.onchange = () => { p.e[+s.dataset.i] = s.value; }; });
      $('#ok').onclick = () => {
        if (done(p)) return;
        if (p.qs.some(i => p.a[i] == null || (W.accuse.proof(p, i) && !p.e[i]))) { $('#fb').textContent = tr('acAll'); return; }
        const bad = p.qs.filter(i => p.a[i] !== 0 || (W.accuse.proof(p, i) && p.e[i] !== d.qs[i].ev)).length;
        if (!bad) K.solve(p); else K.fail(tr('acBad', { n: bad }));
      };
    },
    hint(p) {
      const d = p.def, i = p.qs.find(k => p.a[k] !== 0 || (W.accuse.proof(p, k) && p.e[k] !== d.qs[k].ev)); const k = i == null ? p.qs[0] : i, q = d.qs[k];
      return tr('acH', { x: X(q.q), y: X(q.o[0]) + (W.accuse.proof(p, k) ? ' (' + evName(p, q.ev) + ')' : '') });
    }
  };
})();

// Énigmes culturelles.
// Cuisine vietnamienne : la balance à épices, la dégustation du bouillon, l'assiette d'herbes.
// Wuxia : les huit trigrammes (ordre du Ciel antérieur), les cinq éléments, la cithare qin pentatonique.
// Chaque scénario fournit ses propres listes (épices, ingrédients, herbes, noms) dans la définition de l'énigme.
(() => {
  'use strict';
  const K = window.GameKit, { shuffle } = window.Logic, W = K.W, $ = K.$;
  const tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  const lv = () => Math.min(2, K.G.lvl + (K.G.S.hard ? 1 : 0));
  const box = () => $('#pzb');
  const rand = n => Math.floor(Math.random() * n);
  const done = p => K.G.f['pz_' + p.id];

  const UI = {
    fr: {
      spPot: 'La grande marmite de Bà contient {l} litres.', spCard: 'Fiche de Bà, pour 10 litres :', spRead: 'Les quantités sont sur la fiche de recette de Bà (dans ton Carnet). Attention : elle est écrite pour 10 litres.',
      spBad: '{n} épice(s) mal dosée(s).', spH: '{x} : il en faut {n} g.', spZero: 'aucune',
      tsGoal: 'Le goût que Bà notait sur le mur de la cuisine', tsSpoons: 'Cuillerées : {n} / {m}', tsUndo: '↶ Annuler', tsBad: 'Trop de cuillerées : le bouillon est gâché. On repart du bouillon de base.', tsH: 'Bà commençait toujours par : {x}.',
      hbPick: 'Choisis…', hbAll: 'Nomme d’abord toutes les herbes.', hbBad: '{n} herbe(s) mal nommée(s).', hbH: '« {x} », c’est : {y}.',
      bgRule: 'Dans l’ordre du Ciel antérieur, chaque trigramme fait face à son contraire : chaque trait plein devient brisé, et chaque trait brisé devient plein.', bgClick: 'Clique sur un trait pour le changer. Le trait du bas est en bas.', bgTable: 'Les huit trigrammes', bgBad: '{n} trigramme(s) faux.', bgH: '{x} fait face à {y} : c’est son exact contraire.', bgDoc: 'La forme des trigrammes nommés est dans le Manuel des huit trigrammes (ton Carnet).',
      wxGen: 'Engendrement', wxCtl: 'Domination', wxDoc: 'Les deux cycles sont dans le Traité des cinq éléments (ton Carnet).', wxSeal: 'Sceau {n} / {m}', wxBad: 'Le sceau rejette ta réponse.', wxH: 'La réponse est : {x}.',
      wxQ0: 'Qu’engendre {x} ?', wxQ1: 'Quel élément engendre {x} ?', wxQ2: 'Que domine {x} ?', wxQ3: 'Quel élément domine {x} ?',
      qnScore: 'Partition', qnRead: 'La partition est dans ton Carnet. Le premier son de la mélodie est la corde la plus grave.', qnBad: 'Fausse note. La mélodie reprend du début.', qnH: 'La mélodie commence par : {x}.', qnProg: 'Notes justes : {n} / {m}'
    },
    en: {
      spPot: 'Bà’s big stockpot holds {l} litres.', spCard: 'Bà’s card, for 10 litres:', spRead: 'The amounts are on Bà’s recipe card (in your Journal). Careful: it is written for 10 litres.',
      spBad: '{n} spice(s) wrongly measured.', spH: '{x}: you need {n} g.', spZero: 'none',
      tsGoal: 'The taste Bà wrote on the kitchen wall', tsSpoons: 'Spoonfuls: {n} / {m}', tsUndo: '↶ Undo', tsBad: 'Too many spoonfuls: the broth is ruined. Back to the base broth.', tsH: 'Bà always started with: {x}.',
      hbPick: 'Choose…', hbAll: 'Name every herb first.', hbBad: '{n} herb(s) wrongly named.', hbH: '“{x}” is: {y}.',
      bgRule: 'In the Earlier Heaven order, each trigram faces its opposite: every solid line becomes broken, and every broken line becomes solid.', bgClick: 'Click a line to change it. The bottom line is at the bottom.', bgTable: 'The eight trigrams', bgBad: '{n} trigram(s) wrong.', bgH: '{x} faces {y}: it is its exact opposite.', bgDoc: 'The shape of the named trigrams is in the Manual of the Eight Trigrams (your Journal).',
      wxGen: 'Generation', wxCtl: 'Control', wxDoc: 'Both cycles are in the Treatise on the Five Elements (your Journal).', wxSeal: 'Seal {n} / {m}', wxBad: 'The seal rejects your answer.', wxH: 'The answer is: {x}.',
      wxQ0: '{x} generates…', wxQ1: 'Which element generates {x}?', wxQ2: '{x} controls…', wxQ3: 'Which element controls {x}?',
      qnScore: 'Score', qnRead: 'The score is in your Journal. The first sound of the scale is the lowest string.', qnBad: 'Wrong note. The melody starts again.', qnH: 'The melody begins: {x}.', qnProg: 'Right notes: {n} / {m}'
    },
    vi: {
      spPot: 'Nồi nước dùng lớn của bà chứa {l} lít.', spCard: 'Công thức của bà, cho 10 lít:', spRead: 'Định lượng nằm trong tấm thẻ công thức của bà (trong Sổ tay). Cẩn thận: thẻ ghi cho 10 lít.',
      spBad: '{n} loại gia vị cân sai.', spH: '{x}: cần {n} g.', spZero: 'không có',
      tsGoal: 'Vị nước dùng bà ghi trên tường bếp', tsSpoons: 'Số thìa: {n} / {m}', tsUndo: '↶ Hoàn tác', tsBad: 'Quá nhiều thìa: nồi nước hỏng rồi. Làm lại từ nước dùng gốc.', tsH: 'Bà luôn bắt đầu bằng: {x}.',
      hbPick: 'Chọn…', hbAll: 'Hãy gọi tên tất cả các loại rau trước.', hbBad: '{n} loại rau bị gọi sai tên.', hbH: '« {x} » là: {y}.',
      bgRule: 'Theo Tiên Thiên Bát Quái, mỗi quẻ đối diện với quẻ ngược với nó: mỗi hào dương (liền) thành hào âm (đứt), và ngược lại.', bgClick: 'Bấm vào một hào để đổi. Hào dưới cùng nằm ở dưới.', bgTable: 'Tám quẻ', bgBad: '{n} quẻ sai.', bgH: 'Quẻ {x} đối diện quẻ {y}: hai quẻ ngược hẳn nhau.', bgDoc: 'Hình dạng các quẻ có tên nằm trong Sách Bát Quái (trong Sổ tay).',
      wxGen: 'Tương sinh', wxCtl: 'Tương khắc', wxDoc: 'Hai vòng sinh khắc nằm trong Luận về Ngũ Hành (trong Sổ tay).', wxSeal: 'Ấn {n} / {m}', wxBad: 'Phong ấn không chấp nhận câu trả lời.', wxH: 'Đáp án là: {x}.',
      wxQ0: '{x} sinh ra…', wxQ1: 'Hành nào sinh ra {x}?', wxQ2: '{x} khắc…', wxQ3: 'Hành nào khắc {x}?',
      qnScore: 'Khúc phổ', qnRead: 'Khúc phổ nằm trong Sổ tay. Âm đầu tiên của thang âm là dây trầm nhất.', qnBad: 'Sai nốt. Giai điệu bắt đầu lại.', qnH: 'Giai điệu bắt đầu bằng: {x}.', qnProg: 'Nốt đúng: {n} / {m}'
    }
  };
  const PZ = {
    fr: {
      spice: { t: 'La balance à épices', i: 'Pèse chaque épice pour la grande marmite, puis valide. Les épices qui ne sont pas dans la recette restent à zéro.', h: 'Les quantités de la fiche sont pour 10 litres : fais une règle de trois.' },
      taste: { t: 'La dégustation', i: 'Ajoute des cuillerées jusqu’à atteindre exactement le goût noté par Bà, sans dépasser le nombre de cuillerées permis.', h: 'Regarde ce que chaque ingrédient ajoute, et compte ce qui manque sur chaque jauge.' },
      herbs: { t: 'L’assiette d’herbes', i: 'Donne son nom à chaque herbe de l’assiette, puis valide.', h: 'Lis bien la couleur, la forme des feuilles et le goût.' },
      bagua: { t: 'Les huit trigrammes', i: 'Complète la formation : chaque trigramme doit être le contraire de celui qui lui fait face. Puis valide.', h: 'Regarde le trigramme d’en face et inverse chacun de ses traits.' },
      wuxing: { t: 'Les cinq éléments', i: 'Pour briser chaque sceau, choisis l’élément qui répond à la question.', h: 'Bois → Feu → Terre → Métal → Eau → Bois : c’est le cycle d’engendrement.' },
      qin: { t: 'La cithare qin', i: 'Joue la mélodie de la partition, note après note, sur les cinq cordes.', h: 'Les cinq notes vont de la plus grave à la plus aiguë : gōng, shāng, jué, zhǐ, yǔ.' }
    },
    en: {
      spice: { t: 'The spice scale', i: 'Weigh each spice for the big stockpot, then check. Spices that are not in the recipe stay at zero.', h: 'The card’s amounts are for 10 litres: scale them up.' },
      taste: { t: 'The tasting', i: 'Add spoonfuls until you reach exactly the taste Bà wrote down, without going over the number of spoonfuls allowed.', h: 'Look at what each ingredient adds, and count what is missing on each gauge.' },
      herbs: { t: 'The herb plate', i: 'Name each herb on the plate, then check.', h: 'Read the colour, the shape of the leaves and the taste carefully.' },
      bagua: { t: 'The eight trigrams', i: 'Complete the formation: each trigram must be the opposite of the one facing it. Then check.', h: 'Look at the trigram opposite and flip each of its lines.' },
      wuxing: { t: 'The five elements', i: 'To break each seal, pick the element that answers the question.', h: 'Wood → Fire → Earth → Metal → Water → Wood: that is the generation cycle.' },
      qin: { t: 'The qin zither', i: 'Play the melody from the score, note by note, on the five strings.', h: 'The five notes go from lowest to highest: gōng, shāng, jué, zhǐ, yǔ.' }
    },
    vi: {
      spice: { t: 'Chiếc cân gia vị', i: 'Cân từng loại gia vị cho nồi lớn, rồi kiểm tra. Gia vị không có trong công thức thì để bằng không.', h: 'Định lượng trong thẻ là cho 10 lít: hãy nhân theo tỉ lệ.' },
      taste: { t: 'Nếm nước dùng', i: 'Thêm từng thìa cho đến khi đạt đúng vị bà đã ghi, không vượt quá số thìa cho phép.', h: 'Xem mỗi nguyên liệu thêm vào vị gì, rồi đếm xem mỗi thang còn thiếu bao nhiêu.' },
      herbs: { t: 'Đĩa rau thơm', i: 'Gọi tên từng loại rau trên đĩa, rồi kiểm tra.', h: 'Đọc kỹ màu sắc, hình dạng lá và mùi vị.' },
      bagua: { t: 'Bát quái', i: 'Hoàn thành trận đồ: mỗi quẻ phải ngược với quẻ đối diện. Rồi kiểm tra.', h: 'Nhìn quẻ đối diện và đảo ngược từng hào của nó.' },
      wuxing: { t: 'Ngũ hành', i: 'Muốn phá mỗi phong ấn, hãy chọn hành đúng với câu hỏi.', h: 'Mộc → Hỏa → Thổ → Kim → Thủy → Mộc: đó là vòng tương sinh.' },
      qin: { t: 'Cây đàn cổ cầm', i: 'Đánh giai điệu trong khúc phổ, từng nốt một, trên năm dây đàn.', h: 'Năm âm đi từ trầm đến bổng: cung, thương, giốc, chủy, vũ.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ---- Balance à épices : spices [{i, n, g (grammes pour 10 L)}], decoys [{i, n}], liters [par niveau] ----
  W.spice = {
    init(p, d) {
      const l = lv(); p.L = d.liters[l];
      p.rows = shuffle(d.spices.map((_, i) => 's' + i).concat(shuffle(d.decoys.map((_, i) => 'd' + i)).slice(0, [1, 2, 3][l])));
      p.w = {};
    },
    item: (p, r) => (r[0] === 's' ? p.def.spices : p.def.decoys)[+r.slice(1)],
    need: (p, r) => r[0] === 's' ? p.def.spices[+r.slice(1)].g * p.L / 10 : 0,
    render(p) {
      const d = p.def;
      box().innerHTML = `<div class="spc"><p class="goal">⚖️ ${tr('spPot', { l: p.L })}</p>
        ${lv() === 0 ? `<div class="spcard"><b>${tr('spCard')}</b> ${d.spices.map(s => `${s.i} ${esc(X(s.n))} ${s.g} g`).join(' · ')}</div>` : `<p class="cnt">${tr('spRead')}</p>`}
        <div class="sprows">${p.rows.map(r => { const s = W.spice.item(p, r); return `<div class="sprow"><span class="spn"><b>${s.i}</b>${esc(X(s.n))}</span>
          <span class="spb"><button class="btn" data-r="${r}" data-d="-5">−5</button><button class="btn" data-r="${r}" data-d="-1">−1</button><span class="spg">${p.w[r] || 0} g</span><button class="btn" data-r="${r}" data-d="1">+1</button><button class="btn" data-r="${r}" data-d="5">+5</button></span></div>`; }).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div></div>`;
      box().querySelectorAll('.spb .btn').forEach(b => { b.onclick = () => {
        const r = b.dataset.r; p.w[r] = Math.max(0, Math.min(200, (p.w[r] || 0) + +b.dataset.d)); K.beep(380 + p.w[r] * 3, .03, 'triangle', .05); W.spice.render(p);
      }; });
      $('#ok').onclick = () => { if (done(p)) return; const bad = p.rows.filter(r => (p.w[r] || 0) !== W.spice.need(p, r)).length; if (!bad) K.solve(p); else K.fail(tr('spBad', { n: bad })); };
    },
    hint(p) { const r = p.rows.find(x => (p.w[x] || 0) !== W.spice.need(p, x)) || p.rows[0]; const n = W.spice.need(p, r); return tr('spH', { x: X(W.spice.item(p, r).n), n: n || 0 }); }
  };

  // ---- Dégustation : ings [{i, n, v: [a, b, c]}], axes [3 noms], start [a, b, c] ----
  W.taste = {
    init(p, d) {
      const n = [3, 4, 5][lv()], top = 11;
      for (;;) {
        const sol = Array.from({ length: n }, () => rand(d.ings.length));
        const tg = d.start.map((s, a) => s + sol.reduce((t, i) => t + d.ings[i].v[a], 0));
        if (new Set(sol).size < Math.min(3, n) || tg.some(v => v > top)) continue;
        Object.assign(p, { n, sol, tg, top, add: [] }); return;
      }
    },
    cur(p) { return p.def.start.map((s, a) => s + p.add.reduce((t, i) => t + p.def.ings[i].v[a], 0)); },
    render(p) {
      const d = p.def, cur = W.taste.cur(p);
      box().innerHTML = `<div class="tst"><p class="goal">🍲 ${tr('tsGoal')}</p>
        <div class="tmeters">${d.axes.map((a, k) => `<div class="tm"><b>${esc(X(a))}</b><div class="tbar">${Array.from({ length: p.top }, (_, j) => `<i class="${j < cur[k] ? 'on' : ''}${j === p.tg[k] - 1 ? ' tgt' : ''}${j < cur[k] && j >= p.tg[k] ? ' over' : ''}"></i>`).join('')}</div><span>${cur[k]} / ${p.tg[k]}</span></div>`).join('')}</div>
        <div class="tings">${d.ings.map((g, i) => `<button class="btn ting" data-i="${i}"><b>${g.i}</b>${esc(X(g.n))}<small>${g.v.map((v, k) => v ? `${v > 0 ? '+' : ''}${v} ${esc(X(d.axes[k]))}` : '').filter(Boolean).join(' · ')}</small></button>`).join('')}</div>
        <p class="cnt">${tr('tsSpoons', { n: p.add.length, m: p.n })} ${p.add.map(i => d.ings[i].i).join(' ')}</p>
        <div class="row"><button class="btn" id="tu">${tr('tsUndo')}</button><button class="btn" id="rs">↺ ${tr('reset')}</button></div></div>`;
      box().querySelectorAll('.ting').forEach(b => { b.onclick = () => {
        if (done(p)) return;
        p.add.push(+b.dataset.i); K.beep(300 + p.add.length * 50, .08, 'sine', .07);
        const c = W.taste.cur(p);
        if (c.every((v, k) => v === p.tg[k])) { W.taste.render(p); setTimeout(() => K.solve(p), 700); return; }
        if (p.add.length >= p.n) { p.add = []; W.taste.render(p); K.fail(tr('tsBad')); return; }
        W.taste.render(p);
      }; });
      $('#tu').onclick = () => { p.add.pop(); W.taste.render(p); };
      $('#rs').onclick = () => { p.add = []; W.taste.render(p); };
    },
    hint(p) { return tr('tsH', { x: p.sol.map(i => p.def.ings[i].i + ' ' + X(p.def.ings[i].n)).slice(0, 2).join(', ') }); }
  };

  // ---- Assiette d'herbes : herbs [{i, n, d}] ----
  W.herbs = {
    init(p, d) {
      const l = lv(), all = shuffle([...d.herbs.keys()]), n = Math.min(d.herbs.length - (l ? 1 : 0), [4, 5, 6][l]);
      p.hs = all.slice(0, n); p.opt = shuffle(all.slice(0, n + (l ? 1 : 0))); p.a = {};
    },
    render(p) {
      const d = p.def;
      box().innerHTML = `<div class="herbs">${p.hs.map(i => `<div class="herb"><b>${d.herbs[i].i}</b><p>${esc(X(d.herbs[i].d))}</p>
        <select data-i="${i}"><option value="">${tr('hbPick')}</option>${p.opt.map(o => `<option value="${o}"${p.a[i] === o ? ' selected' : ''}>${esc(X(d.herbs[o].n))}</option>`).join('')}</select></div>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.herb select').forEach(s => { s.onchange = () => { p.a[+s.dataset.i] = s.value === '' ? undefined : +s.value; }; });
      $('#ok').onclick = () => {
        if (done(p)) return;
        if (p.hs.some(i => p.a[i] == null)) { $('#fb').textContent = tr('hbAll'); return; }
        const bad = p.hs.filter(i => p.a[i] !== i).length; if (!bad) K.solve(p); else K.fail(tr('hbBad', { n: bad }));
      };
    },
    hint(p) { const d = p.def, i = p.hs.find(k => p.a[k] !== k); const k = i == null ? p.hs[0] : i; const w = X(d.herbs[k].d).split(/\s+/); return tr('hbH', { x: w.slice(0, 6).join(' ') + (w.length > 6 ? '…' : ''), y: X(d.herbs[k].n) }); }
  };

  // ---- Huit trigrammes : names [8 noms, ordre du Ciel antérieur], sym [8 caractères] ----
  const TRI = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1]];
  const triHtml = (lines, k, edit) => `<span class="tri3">${[2, 1, 0].map(j => `<i class="ln${lines[j] ? '' : ' yin'}${edit ? ' ed' : ''}" data-k="${k}" data-j="${j}"><s></s><s></s></i>`).join('')}</span>`;
  W.bagua = {
    init(p) {
      const l = lv(), pairs = shuffle([0, 1, 2, 3]), singles = [3, 2, 2][l], doubles = [0, 1, 2][l];
      p.ed = []; p.named = [];
      pairs.slice(0, singles).forEach(j => p.ed.push(Math.random() < .5 ? j : j + 4));
      pairs.slice(singles, singles + doubles).forEach(j => { p.ed.push(j, j + 4); p.named.push(Math.random() < .5 ? j : j + 4); });
      p.g = TRI.map((t, k) => { if (!p.ed.includes(k)) return t.slice(); let x; do { x = [rand(2), rand(2), rand(2)]; } while (x.join() === t.join()); return x; });
    },
    render(p) {
      const d = p.def, l = lv(), nm = k => esc(X(d.names[k]));
      const pos = k => { const a = (-90 - k * 45) * Math.PI / 180; return `left:${50 + Math.cos(a) * 39}%;top:${50 + Math.sin(a) * 39}%`; };
      box().innerHTML = `<p class="goal">${tr('bgRule')}</p><div class="bagua"><div class="taiji">☯</div>
        ${TRI.map((_, k) => { const ed = p.ed.includes(k), show = !ed || p.named.includes(k); return `<div class="trig${ed ? ' ed' : ''}" style="${pos(k)}">${triHtml(p.g[k], k, ed)}<small>${show ? nm(k) : '?'}</small></div>`; }).join('')}</div>
        <p class="cnt">${tr('bgClick')}</p>
        ${p.named.length ? (l < 2 ? `<details class="bgtab"><summary>${tr('bgTable')}</summary><div>${TRI.map((t, k) => `<span>${triHtml(t, k, false)}${nm(k)}</span>`).join('')}</div></details>` : `<p class="cnt">${tr('bgDoc')}</p>`) : ''}
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.ln.ed').forEach(b => { b.onclick = () => { if (done(p)) return; const k = +b.dataset.k, j = +b.dataset.j; p.g[k][j] ^= 1; K.beep(p.g[k][j] ? 520 : 390, .05, 'triangle', .06); W.bagua.render(p); }; });
      $('#ok').onclick = () => { if (done(p)) return; const bad = p.ed.filter(k => p.g[k].join() !== TRI[k].join()).length; if (!bad) K.solve(p); else K.fail(tr('bgBad', { n: bad })); };
    },
    hint(p) { const k = p.ed.find(x => p.g[x].join() !== TRI[x].join()); const q = k == null ? p.ed[0] : k; return tr('bgH', { x: X(p.def.names[q]), y: X(p.def.names[(q + 4) % 8]) }); }
  };

  // ---- Cinq éléments : el [5 {i, n}] dans l'ordre d'engendrement (Bois, Feu, Terre, Métal, Eau) ----
  const WX = [x => (x + 1) % 5, x => (x + 4) % 5, x => (x + 2) % 5, x => (x + 3) % 5];
  W.wuxing = {
    init(p) {
      const l = lv(), types = l ? [0, 1, 2, 3] : [0, 1, 2], n = [4, 5, 6][l];
      p.qs = []; for (let k = 0; k < n; k++) { let q; do { q = { t: types[rand(types.length)], x: rand(5) }; } while (p.qs.some(o => o.t === q.t && o.x === q.x)); p.qs.push(q); }
      p.r = 0;
    },
    render(p) {
      const d = p.def, el = k => `${d.el[k].i} ${esc(X(d.el[k].n))}`, q = p.qs[Math.min(p.r, p.qs.length - 1)];
      box().innerHTML = (lv() === 0 ? `<div class="wxcyc"><span><b>${tr('wxGen')}</b> ${[0, 1, 2, 3, 4, 0].map(k => d.el[k].i).join(' → ')}</span><span><b>${tr('wxCtl')}</b> ${[0, 2, 4, 1, 3, 0].map(k => d.el[k].i).join(' → ')}</span></div>` : `<p class="cnt">${tr('wxDoc')}</p>`)
        + `<div class="wxseal"><small>${tr('wxSeal', { n: p.r + 1, m: p.qs.length })}</small><b>${d.el[q.x].i}</b><p>${esc(tr('wxQ' + q.t, { x: X(d.el[q.x].n) }))}</p></div>
        <div class="wxopts">${d.el.map((e, k) => `<button class="btn wxo" data-k="${k}">${el(k)}</button>`).join('')}</div>
        <div class="prog">${p.qs.map((_, i) => `<i class="${i < p.r ? 'on' : ''}"></i>`).join('')}</div>`;
      box().querySelectorAll('.wxo').forEach(b => { b.onclick = () => {
        if (done(p)) return;
        if (+b.dataset.k !== WX[q.t](q.x)) { K.fail(tr('wxBad')); return; }
        p.r++; K.beep(500 + p.r * 70, .12, 'sine', .07);
        if (p.r >= p.qs.length) { p.r = p.qs.length - 1; W.wuxing.render(p); setTimeout(() => K.solve(p), 500); return; }
        W.wuxing.render(p);
      }; });
    },
    hint(p) { const q = p.qs[p.r]; return tr('wxH', { x: X(p.def.el[WX[q.t](q.x)].n) }); }
  };

  // ---- Cithare qin : names [5 noms], chars [5 caractères], melody [indices] ----
  const QF = [262, 294, 330, 392, 440];
  W.qin = {
    init(p, d) { p.n = Math.min(d.melody.length, [5, 7, 9][lv()]); p.i = 0; p.last = -1; },
    pluck(k) { K.beep(QF[k], 1.4, 'triangle', .16); K.beep(QF[k] * 2, .7, 'sine', .05); K.beep(QF[k] * 3, .3, 'sine', .02); },
    render(p) {
      const d = p.def, l = lv(), mel = d.melody.slice(0, p.n);
      box().innerHTML = (l === 0 ? `<div class="qscore"><b>${tr('qnScore')}</b> ${mel.map((k, i) => `<span class="${i < p.i ? 'on' : ''}">${esc(X(d.names[k]))}</span>`).join(' · ')}</div>` : `<p class="cnt">${tr('qnRead')}</p>`)
        + `<div class="qin">${d.names.map((nm, k) => `<button class="qstr${p.last === k ? ' hit' : ''}" data-k="${k}" style="--h:${7 - k}px"><span>${l < 2 ? esc(X(nm)) : ''}</span><em>${d.chars[k]}</em></button>`).join('')}</div>
        <div class="prog">${mel.map((_, i) => `<i class="${i < p.i ? 'on' : ''}"></i>`).join('')}</div>`;
      box().querySelectorAll('.qstr').forEach(b => { b.onclick = () => {
        if (done(p)) return;
        const k = +b.dataset.k; W.qin.pluck(k); p.last = k;
        if (k !== mel[p.i]) { p.i = 0; W.qin.render(p); K.fail(tr('qnBad')); return; }
        p.i++; W.qin.render(p);
        if (p.i >= p.n) setTimeout(() => K.solve(p), 900);
      }; });
    },
    hint(p) { return tr('qnH', { x: p.def.melody.slice(0, 3).map(k => X(p.def.names[k])).join(', ') }); }
  };
})();

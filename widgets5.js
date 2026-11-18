// Énigmes des scénarios « La maison des lanternes » et « Le train de nuit » :
// teintures, poissons bloqués, boulier, zodiaque vietnamien, symétrie, devinettes, rythme du tambour,
// horaires, aiguillage des wagons, bagages, vannes, empreintes, mots mêlés, télégramme à trous.
(() => {
  'use strict';
  const K = window.GameKit, { rand, shuffle } = window.Logic, W = K.W, $ = K.$;
  const G = () => K.G, tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s), lvl = () => K.G.lvl, lang = () => K.api.lang();
  const box = () => $('#pzb');
  const T = (fr, en, vi) => ({ fr, en, vi });

  const UI = {
    fr: { target: 'Couleur demandée', yours: 'Ton mélange', drops: 'gouttes', mixH: 'Il faut {n} goutte(s) de {x} (dans la recette la plus simple).', rushH: 'Déplace ce bloc : {x}.', abVal: 'Valeur : {v}', abH: 'Le nombre à former est {x}.',
      zodRef: 'Repère : {y} était l’année du {a}. Le cycle dure 12 ans.', zodQ: 'Quel animal pour quelqu’un né en {y}, après le Tết ?', zodH: 'Réponse : {x}.', round: 'Question {n} / {m}', symH: 'La case qui clignote est fausse.',
      tap: '🥁 Frappe !', rhyListen: '▶ Écouter le rythme', rhyH: 'Le rythme est : {x} (• court, — long).', rhyBad: 'Ce n’est pas le bon rythme…',
      schQ: 'À quelle heure (HH:MM) le train arrivera-t-il à {t} ?', schH: 'Heure prévue à {t} : {x}, puis ajoute le retard.', station: 'Gare', time: 'Heure',
      trackA: 'Arrivée', siding: 'Voie de garage', trackB: 'Départ', wanted: 'Ordre demandé', mAB: 'Arrivée → Départ', mAS: 'Arrivée → Garage', mSB: 'Garage → Départ', shuntBad: 'Mauvais wagon ! On recommence la manœuvre.', shuntH: 'Prochaine manœuvre : {x}.',
      rotate: '⟳ Tourner', packH: 'Commence par la plus grande valise, dans un coin.', valveH: 'La vanne {x} doit être tournée {n} fois.', gauge: 'Jauge', valve: 'Vanne', goalV: 'objectif',
      fpRound: 'Empreinte {n} / {m}', fpH: 'C’est l’empreinte n° {x}.', wsFound: 'Mots trouvés : {n} / {m}', wsH: 'Cherche le mot {x}.', clozeH: 'Le premier trou est : {x}.', blank: '_____' },
    en: { target: 'Requested colour', yours: 'Your mix', drops: 'drops', mixH: 'You need {n} drop(s) of {x} (in the simplest recipe).', rushH: 'Move this block: {x}.', abVal: 'Value: {v}', abH: 'The number to make is {x}.',
      zodRef: 'Reference: {y} was the year of the {a}. The cycle lasts 12 years.', zodQ: 'Which animal for someone born in {y}, after Tết?', zodH: 'Answer: {x}.', round: 'Question {n} / {m}', symH: 'The blinking square is wrong.',
      tap: '🥁 Strike!', rhyListen: '▶ Listen to the rhythm', rhyH: 'The rhythm is: {x} (• short, — long).', rhyBad: 'That is not the right rhythm…',
      schQ: 'At what time (HH:MM) will the train reach {t}?', schH: 'Scheduled time at {t}: {x}, then add the delay.', station: 'Station', time: 'Time',
      trackA: 'Arrivals', siding: 'Siding', trackB: 'Departures', wanted: 'Requested order', mAB: 'Arrivals → Departures', mAS: 'Arrivals → Siding', mSB: 'Siding → Departures', shuntBad: 'Wrong wagon! Start the shunting again.', shuntH: 'Next move: {x}.',
      rotate: '⟳ Rotate', packH: 'Start with the biggest suitcase, in a corner.', valveH: 'Valve {x} must be turned {n} time(s).', gauge: 'Gauge', valve: 'Valve', goalV: 'target',
      fpRound: 'Fingerprint {n} / {m}', fpH: 'It is fingerprint no. {x}.', wsFound: 'Words found: {n} / {m}', wsH: 'Look for the word {x}.', clozeH: 'The first gap is: {x}.', blank: '_____' },
    vi: { target: 'Màu cần pha', yours: 'Màu của bạn', drops: 'giọt', mixH: 'Cần {n} giọt {x} (theo công thức đơn giản nhất).', rushH: 'Hãy di chuyển khối này: {x}.', abVal: 'Giá trị: {v}', abH: 'Số cần tạo là {x}.',
      zodRef: 'Mốc: năm {y} là năm {a}. Một vòng con giáp kéo dài 12 năm.', zodQ: 'Người sinh năm {y}, sau Tết, tuổi con gì?', zodH: 'Đáp án: {x}.', round: 'Câu {n} / {m}', symH: 'Ô đang nhấp nháy bị sai.',
      tap: '🥁 Đánh!', rhyListen: '▶ Nghe nhịp trống', rhyH: 'Nhịp trống là: {x} (• ngắn, — dài).', rhyBad: 'Chưa đúng nhịp rồi…',
      schQ: 'Tàu sẽ đến {t} lúc mấy giờ (HH:MM)?', schH: 'Giờ dự kiến ở {t}: {x}, rồi cộng thêm thời gian trễ.', station: 'Ga', time: 'Giờ',
      trackA: 'Đường đến', siding: 'Đường tránh', trackB: 'Đường đi', wanted: 'Thứ tự yêu cầu', mAB: 'Đường đến → Đường đi', mAS: 'Đường đến → Đường tránh', mSB: 'Đường tránh → Đường đi', shuntBad: 'Sai toa rồi! Làm lại từ đầu.', shuntH: 'Bước tiếp theo: {x}.',
      rotate: '⟳ Xoay', packH: 'Bắt đầu với chiếc vali lớn nhất, đặt vào một góc.', valveH: 'Van {x} phải được vặn {n} lần.', gauge: 'Đồng hồ', valve: 'Van', goalV: 'mục tiêu',
      fpRound: 'Dấu vân tay {n} / {m}', fpH: 'Đó là dấu vân tay số {x}.', wsFound: 'Từ đã tìm: {n} / {m}', wsH: 'Hãy tìm từ {x}.', clozeH: 'Ô trống đầu tiên là: {x}.', blank: '_____' }
  };
  const PZ = {
    fr: {
      mix: { t: 'Les teintures', i: 'Ajoute des gouttes de teinture jusqu’à obtenir exactement la couleur demandée, puis valide.', h: 'Seules les proportions comptent : 2 rouges + 2 jaunes donnent la même couleur que 1 + 1.' },
      rush: { t: 'Le bassin aux carpes', i: 'Fais glisser les blocs (clique sur une moitié pour avancer dans ce sens) pour libérer la carpe dorée vers la sortie à droite.', h: 'Repère les blocs qui barrent la rangée de la carpe dorée, et ce qui les bloque à leur tour.' },
      abacus: { t: 'Le boulier', i: 'Forme le nombre sur le boulier : une perle du haut vaut 5, chaque perle du bas vaut 1.', h: 'Traite une colonne à la fois, en commençant par la gauche.' },
      zodiac: { t: 'Le calendrier lunaire', i: 'Retrouve l’animal de chaque année. Au Vietnam, le chat remplace le lapin !', h: 'Compte de 12 en 12 à partir de l’année repère.' },
      symmetry: { t: 'La lanterne symétrique', i: 'Complète le motif pour qu’il soit parfaitement symétrique, comme dans un miroir.', h: 'Chaque case colorée a une jumelle à la même distance de l’axe.' },
      riddle: { t: 'Les devinettes', i: 'Choisis la bonne réponse à chaque devinette.', h: 'Pense au sens figuré des mots.' },
      rhythm: { t: 'Le tambour', i: 'Écoute le rythme, puis frappe le tambour en respectant les coups courts et longs.', h: 'Ne cherche pas la vitesse : seule la différence entre court et long compte.' },
      schedule: { t: 'L’horaire', i: 'Lis l’horaire et calcule l’heure d’arrivée.', h: 'Ajoute le retard à l’heure prévue, minute par minute.' },
      shunt: { t: 'L’aiguillage', i: 'Fais passer les wagons de la voie d’arrivée à la voie de départ dans l’ordre demandé, en t’aidant de la voie de garage (le dernier wagon garé en ressort le premier).', h: 'Pour chaque wagon demandé : s’il est en tête d’arrivée, envoie-le ; s’il est au bout du garage, sors-le ; sinon, gare le suivant.' },
      pack: { t: 'Le porte-bagages', i: 'Range toutes les valises dans le porte-bagages, sans trou. Choisis une valise, tourne-la si besoin, puis clique sur une case.', h: 'Les coins et les bords sont les plus difficiles : remplis-les d’abord.' },
      valves: { t: 'La chaudière', i: 'Chaque vanne modifie plusieurs jauges. Règle le nombre de tours de chaque vanne pour amener toutes les jauges à leur objectif.', h: 'Commence par la jauge que peu de vannes modifient.' },
      match: { t: 'Les empreintes', i: 'Quelle empreinte est exactement identique au modèle ?', h: 'Compare les coupures dans les anneaux, une par une.' },
      wordsearch: { t: 'Les mots mêlés', i: 'Retrouve les mots de la liste : clique sur la première lettre, puis sur la dernière.', h: 'Cherche d’abord les lettres rares du mot.' },
      cloze: { t: 'Le télégramme', i: 'Complète le télégramme : clique sur un trou, puis sur le bon mot.', h: 'Relis tout le message : chaque trou n’accepte qu’un mot logique.' }
    },
    en: {
      mix: { t: 'The Dyes', i: 'Add drops of dye until you get exactly the requested colour, then check.', h: 'Only the proportions matter: 2 red + 2 yellow give the same colour as 1 + 1.' },
      rush: { t: 'The Koi Pond', i: 'Slide the blocks (click one half to move it that way) to free the golden koi towards the exit on the right.', h: 'Find the blocks barring the golden koi’s row, then what blocks them in turn.' },
      abacus: { t: 'The Abacus', i: 'Set the number on the abacus: an upper bead is worth 5, each lower bead is worth 1.', h: 'Do one column at a time, starting from the left.' },
      zodiac: { t: 'The Lunar Calendar', i: 'Find the animal of each year. In Vietnam, the cat replaces the rabbit!', h: 'Count in twelves from the reference year.' },
      symmetry: { t: 'The Symmetric Lantern', i: 'Complete the pattern so that it is perfectly symmetrical, as in a mirror.', h: 'Each coloured square has a twin at the same distance from the axis.' },
      riddle: { t: 'Riddles', i: 'Choose the right answer to each riddle.', h: 'Think about the figurative meaning of the words.' },
      rhythm: { t: 'The Drum', i: 'Listen to the rhythm, then strike the drum keeping the short and long beats.', h: 'Don’t worry about speed: only the difference between short and long matters.' },
      schedule: { t: 'The Timetable', i: 'Read the timetable and work out the arrival time.', h: 'Add the delay to the scheduled time, minute by minute.' },
      shunt: { t: 'Shunting', i: 'Move the wagons from the arrival track to the departure track in the requested order, using the siding (the last wagon in comes out first).', h: 'For each wanted wagon: if it is first on arrivals, send it; if it is at the end of the siding, take it out; otherwise, park the next one.' },
      pack: { t: 'The Luggage Rack', i: 'Fit every suitcase into the rack with no gaps. Pick a suitcase, rotate it if needed, then click a square.', h: 'Corners and edges are the hardest: fill them first.' },
      valves: { t: 'The Boiler', i: 'Each valve changes several gauges. Set how many turns each valve gets so that every gauge reaches its target.', h: 'Start with the gauge that few valves affect.' },
      match: { t: 'Fingerprints', i: 'Which fingerprint is exactly identical to the model?', h: 'Compare the breaks in the rings, one by one.' },
      wordsearch: { t: 'Word Search', i: 'Find the words in the list: click the first letter, then the last.', h: 'Look for the rare letters of the word first.' },
      cloze: { t: 'The Telegram', i: 'Complete the telegram: click a gap, then the right word.', h: 'Read the whole message: each gap only fits one logical word.' }
    },
    vi: {
      mix: { t: 'Pha thuốc nhuộm', i: 'Thêm từng giọt thuốc nhuộm cho đến khi được đúng màu yêu cầu rồi kiểm tra.', h: 'Chỉ tỉ lệ là quan trọng: 2 đỏ + 2 vàng cho cùng màu với 1 + 1.' },
      rush: { t: 'Hồ cá chép', i: 'Trượt các khối (bấm vào một nửa khối để đẩy về phía đó) để giải thoát chú cá chép vàng ra lối thoát bên phải.', h: 'Tìm những khối chắn hàng của cá chép vàng, rồi xem cái gì chắn chúng.' },
      abacus: { t: 'Bàn tính', i: 'Tạo con số trên bàn tính: hạt phía trên có giá trị 5, mỗi hạt phía dưới có giá trị 1.', h: 'Làm từng cột một, bắt đầu từ bên trái.' },
      zodiac: { t: 'Lịch âm', i: 'Tìm con giáp của mỗi năm. Ở Việt Nam, con mèo thay cho con thỏ!', h: 'Đếm cách 12 năm một từ năm mốc.' },
      symmetry: { t: 'Chiếc đèn đối xứng', i: 'Hoàn thành họa tiết sao cho đối xứng hoàn hảo, như soi gương.', h: 'Mỗi ô tô màu có một ô sinh đôi cách trục cùng một khoảng.' },
      riddle: { t: 'Câu đố', i: 'Chọn đáp án đúng cho mỗi câu đố.', h: 'Hãy nghĩ đến nghĩa bóng của từ.' },
      rhythm: { t: 'Cái trống', i: 'Nghe nhịp trống, rồi đánh trống theo đúng các tiếng ngắn và dài.', h: 'Không cần nhanh: chỉ cần phân biệt tiếng ngắn và tiếng dài.' },
      schedule: { t: 'Lịch tàu', i: 'Đọc lịch tàu và tính giờ đến.', h: 'Cộng thời gian trễ vào giờ dự kiến, từng phút một.' },
      shunt: { t: 'Dồn toa', i: 'Chuyển các toa từ đường đến sang đường đi theo đúng thứ tự yêu cầu, dùng đường tránh để hỗ trợ (toa vào sau cùng sẽ ra trước tiên).', h: 'Với mỗi toa cần: nếu nó đứng đầu đường đến, chuyển đi; nếu nó ở cuối đường tránh, kéo ra; nếu không, đưa toa kế tiếp vào đường tránh.' },
      pack: { t: 'Giá hành lý', i: 'Xếp hết vali lên giá sao cho không còn chỗ trống. Chọn một vali, xoay nếu cần, rồi bấm vào một ô.', h: 'Góc và cạnh là khó nhất: hãy lấp chúng trước.' },
      valves: { t: 'Nồi hơi', i: 'Mỗi van làm thay đổi nhiều đồng hồ. Chỉnh số vòng vặn của từng van để mọi đồng hồ đạt mục tiêu.', h: 'Bắt đầu với đồng hồ ít van tác động nhất.' },
      match: { t: 'Dấu vân tay', i: 'Dấu vân tay nào giống hệt mẫu?', h: 'So sánh từng chỗ đứt trên các vòng.' },
      wordsearch: { t: 'Ô chữ ẩn', i: 'Tìm các từ trong danh sách: bấm vào chữ cái đầu, rồi bấm vào chữ cái cuối.', h: 'Hãy tìm trước những chữ cái hiếm của từ.' },
      cloze: { t: 'Bức điện tín', i: 'Hoàn thành bức điện: bấm vào một ô trống, rồi bấm vào từ đúng.', h: 'Đọc cả bức điện: mỗi ô trống chỉ hợp với một từ hợp lý.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ================= Teintures =================
  const DYES = { red: [220, 40, 40], yellow: [245, 205, 40], blue: [40, 80, 200], white: [250, 250, 250], black: [30, 30, 30] };
  const DYEN = { red: T('rouge', 'red', 'đỏ'), yellow: T('jaune', 'yellow', 'vàng'), blue: T('bleu', 'blue', 'lam'), white: T('blanc', 'white', 'trắng'), black: T('noir', 'black', 'đen') };
  const mixRGB = (keys, cnt) => { const tot = cnt.reduce((a, b) => a + b, 0); if (!tot) return 'rgb(240,232,214)'; return 'rgb(' + [0, 1, 2].map(ch => Math.round(255 * Math.exp(keys.reduce((s, k, i) => s + cnt[i] / tot * Math.log(Math.max(.03, DYES[k][ch] / 255)), 0)))).join(',') + ')'; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  W.mix = {
    init(p) {
      const lv = lvl(); p.keys = [['red', 'yellow', 'blue'], ['red', 'yellow', 'blue', 'white'], ['red', 'yellow', 'blue', 'white', 'black']][lv];
      for (;;) { const use = shuffle(p.keys.map((_, i) => i)).slice(0, lv + 2); const r = p.keys.map((_, i) => use.includes(i) ? 1 + rand(3) : 0); const g = r.filter(Boolean).reduce(gcd); p.rec = r.map(v => v / g); if (p.rec.filter(Boolean).length === lv + 2) break; }
      p.cnt = p.keys.map(() => 0);
    },
    same(a, b) { const sa = a.reduce((x, y) => x + y, 0), sb = b.reduce((x, y) => x + y, 0); return sa > 0 && a.every((v, i) => v * sb === b[i] * sa); },
    render(p) {
      box().innerHTML = `<div class="swatches"><div><span style="background:${mixRGB(p.keys, p.rec)}"></span><small>${tr('target')}</small></div><div><span style="background:${mixRGB(p.keys, p.cnt)}"></span><small>${tr('yours')}</small></div></div>
        <div class="dyes">${p.keys.map((k, i) => `<div class="dye"><i style="background:rgb(${DYES[k]})"></i><b>${esc(X(DYEN[k]))}</b><div><button class="btn" data-i="${i}" data-d="-1">−</button><em>${p.cnt[i]}</em><button class="btn" data-i="${i}" data-d="1">+</button></div></div>`).join('')}</div>
        <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.dye .btn').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.cnt[i] = Math.max(0, Math.min(9, p.cnt[i] + +b.dataset.d)); K.beep(300 + i * 80, .05, 'sine', .06); W.mix.render(p); }; });
      $('#rs').onclick = () => { p.cnt = p.keys.map(() => 0); W.mix.render(p); };
      $('#ok').onclick = () => { if (W.mix.same(p.cnt, p.rec)) K.solve(p); else K.fail(); };
    },
    hint: p => { const i = p.rec.findIndex(Boolean); return tr('mixH', { n: p.rec[i], x: X(DYEN[p.keys[i]]) }); }
  };

  // ================= Carpes bloquées (6×6, sortie à droite de la rangée 2) =================
  const RN = 6, RROW = 2;
  const rKey = s => s.map(b => b.r * 6 + b.c).join(',');
  const rOcc = (B, s, skip) => { const o = new Set(); s.forEach((b, i) => { if (i === skip) return; for (let k = 0; k < B[i].len; k++) o.add((b.r + (B[i].h ? 0 : k)) * RN + b.c + (B[i].h ? k : 0)); }); return o; };
  const rMoves = (B, s) => { const out = []; s.forEach((b, i) => { const o = rOcc(B, s, i); [-1, 1].forEach(d => { const nb = B[i].h ? { r: b.r, c: b.c + d } : { r: b.r + d, c: b.c }; const cells = Array.from({ length: B[i].len }, (_, k) => [nb.r + (B[i].h ? 0 : k), nb.c + (B[i].h ? k : 0)]); if (cells.every(([r, c]) => r >= 0 && r < RN && c >= 0 && c < RN && !o.has(r * RN + c))) { const n2 = s.slice(); n2[i] = nb; out.push([n2, i, d]); } }); }); return out; };
  const rBFS = (B, s0) => { const prev = new Map([[rKey(s0), null]]), q = [s0]; while (q.length && prev.size < 30000) { const s = q.shift(); if (s[0].c === 4) { const path = []; let k = rKey(s); while (prev.get(k)) { const [pk, mv] = prev.get(k); path.unshift(mv); k = pk; } return path; } for (const [n2, i, d] of rMoves(B, s)) { const k = rKey(n2); if (!prev.has(k)) { prev.set(k, [rKey(s), [i, d]]); q.push(n2); } } } return null; };
  W.rush = {
    bfs: (p) => rBFS(p.B, p.s),
    init(p) {
      const lv = lvl(), nb = [6, 8, 10][lv], minM = [5, 8, 11][lv];
      for (let tries = 0; tries < 40; tries++) {
        const B = [{ h: true, len: 2 }], s = [{ r: RROW, c: 4 }];
        for (let k = 0; k < 60 && B.length < nb + 1; k++) { const h = !!rand(2), len = rand(10) < 3 ? 3 : 2, r = rand(RN - (h ? 0 : len - 1)), c = rand(RN - (h ? len - 1 : 0)); if (h && r === RROW) continue; const cells = Array.from({ length: len }, (_, j) => (r + (h ? 0 : j)) * RN + c + (h ? j : 0)); const o = rOcc(B, s, -1); if (cells.some(x => o.has(x))) continue; B.push({ h, len }); s.push({ r, c }); }
        // Explore tout l'espace des positions, puis prend la plus éloignée d'une position gagnante.
        const seen = new Map([[rKey(s), s]]), q = [s];
        while (q.length && seen.size < 12000) { const x = q.shift(); for (const [n2] of rMoves(B, x)) { const k = rKey(n2); if (!seen.has(k)) { seen.set(k, n2); q.push(n2); } } }
        const dist = new Map(), q2 = [];
        for (const [k, st] of seen) if (st[0].c === 4) { dist.set(k, 0); q2.push(st); }
        let far = s, fd = 0;
        while (q2.length) { const x = q2.shift(), d = dist.get(rKey(x)); if (d > fd) { fd = d; far = x; } for (const [n2] of rMoves(B, x)) { const k = rKey(n2); if (seen.has(k) && !dist.has(k)) { dist.set(k, d + 1); q2.push(n2); } } }
        if (!p.best || fd > p.best[2]) p.best = [B, far, fd];
        if (fd >= minM) break;
      }
      if (p.best && p.best[2] >= 3) { const [B, far] = p.best; delete p.best; Object.assign(p, { B, s: far, s0: far.map(b => ({ ...b })) }); return; }
      Object.assign(p, { B: [{ h: true, len: 2 }, { h: false, len: 3 }], s: [{ r: RROW, c: 0 }, { r: 1, c: 3 }] }); p.s0 = p.s.map(b => ({ ...b }));
    },
    render(p) {
      const cell = 100 / RN;
      box().innerHTML = `<div class="pond"><span class="exit" style="top:${RROW * cell}%;height:${cell}%">➜</span>${p.s.map((b, i) => `<button class="koi${i ? '' : ' gold'}${p.B[i].h ? ' h' : ' v'}" data-i="${i}" style="left:${b.c * cell}%;top:${b.r * cell}%;width:${(p.B[i].h ? p.B[i].len : 1) * cell}%;height:${(p.B[i].h ? 1 : p.B[i].len) * cell}%">${i ? (p.B[i].h ? '🪵' : '🪷') : '🐟'}</button>`).join('')}</div>
        <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.koi').forEach(b => { b.onclick = e => {
        const i = +b.dataset.i, r = b.getBoundingClientRect(), d = p.B[i].h ? (e.clientX - r.left < r.width / 2 ? -1 : 1) : (e.clientY - r.top < r.height / 2 ? -1 : 1);
        const mv = rMoves(p.B, p.s).find(([, j, dd]) => j === i && dd === d); if (!mv) { K.beep(140, .06, 'square', .04); return; }
        p.s = mv[0]; K.beep(380, .05, 'sine', .06);
        if (p.s[0].c === 4) { W.rush.render(p); box().querySelector('.koi.gold').classList.add('out'); setTimeout(() => K.solve(p), 700); return; }
        W.rush.render(p);
      }; });
      $('#rs').onclick = () => { p.s = p.s0.map(b => ({ ...b })); W.rush.render(p); };
    },
    hint: p => { const path = rBFS(p.B, p.s); if (!path || !path.length) return ''; const [i, d] = path[0]; return tr('rushH', { x: (i ? (p.B[i].h ? '🪵' : '🪷') : '🐟') + ' ' + (p.B[i].h ? (d < 0 ? '←' : '→') : (d < 0 ? '↑' : '↓')) }); }
  };

  // ================= Boulier =================
  W.abacus = {
    init(p) { p.n = [4, 4, 5][lvl()]; p.h = Array(p.n).fill(0); p.l = Array(p.n).fill(0); },
    val: p => p.h.reduce((s, h, i) => s * 10 + 5 * h + p.l[i], 0),
    render(p) {
      box().innerHTML = `<div class="abacus">${p.h.map((h, i) => `<div class="rod"><button class="bd up${h ? ' on' : ''}" data-i="${i}" data-t="h"></button><i class="bar"></i>${[0, 1, 2, 3].map(k => `<button class="bd${k < p.l[i] ? ' on' : ''}" data-i="${i}" data-k="${k}"></button>`).join('')}</div>`).join('')}</div>
        ${lvl() === 0 ? `<p class="cnt">${tr('abVal', { v: W.abacus.val(p) })}</p>` : ''}<div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.bd').forEach(b => { b.onclick = () => { const i = +b.dataset.i; if (b.dataset.t === 'h') p.h[i] ^= 1; else { const k = +b.dataset.k; p.l[i] = p.l[i] === k + 1 ? k : k + 1; } K.beep(700, .03, 'square', .04); W.abacus.render(p); }; });
      $('#ok').onclick = () => { if (W.abacus.val(p) === p.def.target(G())) K.solve(p); else K.fail(); };
    },
    hint: p => tr('abH', { x: p.def.target(G()) })
  };

  // ================= Zodiaque vietnamien =================
  const ZOD = [['🐀', T('Rat', 'Rat', 'Tý (Chuột)')], ['🐃', T('Buffle', 'Buffalo', 'Sửu (Trâu)')], ['🐅', T('Tigre', 'Tiger', 'Dần (Hổ)')], ['🐈', T('Chat', 'Cat', 'Mão (Mèo)')], ['🐉', T('Dragon', 'Dragon', 'Thìn (Rồng)')], ['🐍', T('Serpent', 'Snake', 'Tỵ (Rắn)')],
    ['🐎', T('Cheval', 'Horse', 'Ngọ (Ngựa)')], ['🐐', T('Chèvre', 'Goat', 'Mùi (Dê)')], ['🐒', T('Singe', 'Monkey', 'Thân (Khỉ)')], ['🐓', T('Coq', 'Rooster', 'Dậu (Gà)')], ['🐕', T('Chien', 'Dog', 'Tuất (Chó)')], ['🐖', T('Cochon', 'Pig', 'Hợi (Lợn)')]];
  const zIdx = y => ((y - 4) % 12 + 12) % 12;
  W.zodiac = {
    init(p) { p.ref = [2020, 1996, 1984][lvl()]; p.qs = Array.from({ length: [2, 3, 4][lvl()] }, () => { let y; do { y = 1900 + rand(130); } while (y === p.ref); return y; }); p.r = 0; },
    render(p) {
      const y = p.qs[p.r];
      box().innerHTML = `<p class="goal">${tr('zodRef', { y: p.ref, a: X(ZOD[zIdx(p.ref)][1]) })}</p><p class="cnt">${tr('round', { n: p.r + 1, m: p.qs.length })}</p><p class="goal">${tr('zodQ', { y })}</p>
        <div class="zod">${ZOD.map(([e, n], i) => `<button class="btn${p.hl >= 2 && i === zIdx(y) ? ' tipb' : ''}" data-i="${i}"><b>${e}</b>${esc(X(n))}</button>`).join('')}</div>`;
      box().querySelectorAll('.zod .btn').forEach(b => { b.onclick = () => {
        if (+b.dataset.i !== zIdx(y)) { K.fail(); return; }
        K.beep(880, .1, 'triangle', .08); if (++p.r >= p.qs.length) { p.r--; setTimeout(() => K.solve(p), 300); return; } p.hl = Math.min(p.hl, 1); W.zodiac.render(p);
      }; });
    },
    hint: p => tr('zodH', { x: X(ZOD[zIdx(p.qs[p.r])][1]) })
  };

  // ================= Symétrie =================
  W.symmetry = {
    init(p) {
      const lv = lvl(); p.w = [6, 8, 8][lv]; p.h = [4, 6, 8][lv]; p.quad = lv === 2;
      const hw = p.w / 2, hh = p.h / 2; p.sol = Array(p.w * p.h).fill(0);
      for (let r = 0; r < (p.quad ? hh : p.h); r++) for (let c = 0; c < hw; c++) if (rand(100) < 45) { const set = (rr, cc) => { p.sol[rr * p.w + cc] = 1; }; set(r, c); set(r, p.w - 1 - c); if (p.quad) { set(p.h - 1 - r, c); set(p.h - 1 - r, p.w - 1 - c); } }
      p.given = i => { const r = Math.floor(i / p.w), c = i % p.w; return c < hw && (!p.quad || r < hh); };
      p.cur = p.sol.map((v, i) => p.given(i) ? v : 0);
    },
    render(p) {
      if (p.hl >= 2) p.tip = p.cur.findIndex((v, i) => v !== p.sol[i]);
      box().innerHTML = `<div class="sym${p.quad ? ' quad' : ''}" style="--w:${p.w}">${p.cur.map((v, i) => `<button class="sy${v ? ' on' : ''}${p.given(i) ? ' gv' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}"></button>`).join('')}</div>`;
      box().querySelectorAll('.sy:not(.gv)').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.cur[i] ^= 1; K.beep(p.cur[i] ? 620 : 420, .04, 'triangle', .05); if (p.cur.every((v, k) => v === p.sol[k])) { W.symmetry.render(p); setTimeout(() => K.solve(p), 500); } else W.symmetry.render(p); }; });
    },
    hint: () => tr('symH')
  };

  // ================= Devinettes =================
  const RID = [
    [T('J’ai des dents mais je ne mords jamais.', 'I have teeth but I never bite.', 'Tôi có răng nhưng không bao giờ cắn.'), [T('Un peigne', 'A comb', 'Cái lược'), T('Un requin', 'A shark', 'Con cá mập'), T('Une fourchette', 'A fork', 'Cái nĩa'), T('Un crocodile', 'A crocodile', 'Con cá sấu')]],
    [T('Je monte et je descends sans jamais bouger.', 'I go up and down without ever moving.', 'Tôi lên rồi xuống mà chẳng bao giờ di chuyển.'), [T('Un escalier', 'A staircase', 'Cầu thang'), T('Un ascenseur', 'A lift', 'Thang máy'), T('Un oiseau', 'A bird', 'Con chim'), T('La marée', 'The tide', 'Thủy triều')]],
    [T('Plus on m’enlève de terre, plus je deviens grand.', 'The more earth you take from me, the bigger I get.', 'Càng lấy đất ra, tôi càng to.'), [T('Un trou', 'A hole', 'Cái hố'), T('Une montagne', 'A mountain', 'Ngọn núi'), T('Un arbre', 'A tree', 'Cái cây'), T('Un château', 'A castle', 'Lâu đài')]],
    [T('Je parle sans bouche et j’entends sans oreilles.', 'I speak without a mouth and hear without ears.', 'Tôi nói không cần miệng và nghe không cần tai.'), [T('L’écho', 'An echo', 'Tiếng vọng'), T('Le vent', 'The wind', 'Cơn gió'), T('Un livre', 'A book', 'Quyển sách'), T('Un perroquet', 'A parrot', 'Con vẹt')]],
    [T('J’ai des aiguilles mais je ne couds pas.', 'I have hands but I cannot clap.', 'Tôi có kim nhưng không bao giờ khâu vá.'), [T('Une horloge', 'A clock', 'Cái đồng hồ'), T('Un hérisson', 'A hedgehog', 'Con nhím'), T('Une couturière', 'A tailor', 'Thợ may'), T('Un cactus', 'A cactus', 'Cây xương rồng')]],
    [T('Je me mouille en séchant.', 'I get wetter the more I dry.', 'Càng làm khô, tôi càng ướt.'), [T('Une serviette', 'A towel', 'Cái khăn tắm'), T('Le soleil', 'The sun', 'Mặt trời'), T('Une éponge', 'A sponge', 'Miếng bọt biển'), T('La pluie', 'The rain', 'Cơn mưa')]],
    [T('On me jette quand on a besoin de moi, on me remonte quand on n’en veut plus.', 'You throw me out when you need me and pull me in when you don’t.', 'Cần thì người ta ném tôi đi, không cần thì kéo tôi lên.'), [T('Une ancre', 'An anchor', 'Cái mỏ neo'), T('Un filet', 'A net', 'Tấm lưới'), T('Un ballon', 'A ball', 'Quả bóng'), T('Une bouée', 'A buoy', 'Cái phao')]],
    [T('Je suis plein de trous, mais je retiens l’eau.', 'I am full of holes, yet I hold water.', 'Tôi đầy lỗ thủng nhưng vẫn giữ được nước.'), [T('Une éponge', 'A sponge', 'Miếng bọt biển'), T('Un seau', 'A bucket', 'Cái xô'), T('Une passoire', 'A sieve', 'Cái rây'), T('Un nuage', 'A cloud', 'Đám mây')]]
  ];
  W.riddle = {
    init(p) { p.qs = shuffle([...RID.keys()]).slice(0, [3, 4, 5][lvl()]).map(k => ({ k, o: shuffle([0, 1, 2, 3]) })); p.r = 0; },
    render(p) {
      const q = p.qs[p.r], R = RID[q.k];
      box().innerHTML = `<p class="cnt">${tr('round', { n: p.r + 1, m: p.qs.length })}</p><p class="scroll">« ${esc(X(R[0]))} »</p><div class="row">${q.o.map(i => `<button class="btn${p.hl >= 2 && i === 0 ? ' tipb' : ''}" data-i="${i}">${esc(X(R[1][i]))}</button>`).join('')}</div>`;
      box().querySelectorAll('.row .btn').forEach(b => { b.onclick = () => { if (+b.dataset.i) { K.fail(); return; } K.beep(880, .1, 'triangle', .08); if (++p.r >= p.qs.length) { p.r--; setTimeout(() => K.solve(p), 300); return; } p.hl = Math.min(p.hl, 1); W.riddle.render(p); }; });
    },
    hint: p => X(RID[p.qs[p.r].k][1][0])
  };

  // ================= Rythme du tambour =================
  W.rhythm = {
    init(p) { const n = [3, 4, 5][lvl()]; do { p.pat = Array.from({ length: n }, () => rand(2)); } while (!p.pat.includes(0) || !p.pat.includes(1)); p.taps = []; },
    play(p) { let at = .3; const beat = () => { const b = $('#drum'); if (b) { b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); } }; K.beep(110, .18, 'sine', .3, at); setTimeout(beat, at * 1000); p.pat.forEach(x => { at += x ? .75 : .32; K.beep(110, .18, 'sine', .3, at); setTimeout(beat, at * 1000); }); p.taps = []; },
    render(p) {
      box().innerHTML = `<div class="row"><button class="btn" id="listen">${tr('rhyListen')}</button></div><button class="drum" id="drum">${tr('tap')}</button><div class="prog">${[0, ...p.pat].map((_, i) => `<i class="${i < p.taps.length ? 'on' : ''}"></i>`).join('')}</div>`;
      $('#listen').onclick = () => W.rhythm.play(p);
      $('#drum').onclick = () => {
        const now = performance.now(); if (p.taps.length && now - p.taps[p.taps.length - 1] > 2500) p.taps = [];
        p.taps.push(now); K.beep(130, .15, 'sine', .3); const b = $('#drum'); b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
        box().querySelectorAll('.prog i').forEach((x, i) => x.classList.toggle('on', i < p.taps.length));
        if (p.taps.length === p.pat.length + 1) {
          const iv = p.taps.slice(1).map((t, i) => t - p.taps[i]), mn = Math.min(...iv), mx = Math.max(...iv), cut = mx / mn > 1.4 ? Math.sqrt(mn * mx) : Infinity;
          const got = iv.map(v => v > cut ? 1 : 0); p.taps = [];
          if (got.every((v, i) => v === p.pat[i])) setTimeout(() => K.solve(p), 300); else { K.fail(tr('rhyBad')); box().querySelectorAll('.prog i').forEach(x => x.classList.remove('on')); }
        }
      };
    },
    hint: p => tr('rhyH', { x: p.pat.map(x => x ? '—' : '•').join(' ') })
  };

  // ================= Horaire du train =================
  const STN = ['Montréal', 'Drummondville', 'Charny', 'Montmagny', 'La Pocatière', 'Rivière-du-Loup', 'Trois-Pistoles', 'Rimouski', 'Mont-Joli', 'Amqui', 'Matapédia'];
  const hm = m => String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, '0') + ':' + String(((m % 60) + 60) % 60).padStart(2, '0');
  W.schedule = {
    init(p) {
      const lv = lvl(); let t = 18 * 60 + 30 + rand(10) * 5 + (lv === 2 ? 60 : 0); p.rows = STN.map((s, i) => { if (i) t += 25 + rand(12) * 5; return [s, t]; });
      p.si = 5 + rand(2); p.ti = p.si + 2 + rand(STN.length - p.si - 2); p.d = 10 + rand(8) * 5; p.e = lv ? 5 + rand(3) * 5 : 0;
      p.ans = p.rows[p.ti][1] + p.d + p.e * (p.ti - p.si);
    },
    question(p) {
      const s = STN[p.si];
      const base = { fr: `Le train a ${p.d} min de retard en quittant ${s}.`, en: `The train is ${p.d} min late leaving ${s}.`, vi: `Tàu trễ ${p.d} phút khi rời ${s}.` }[lang()];
      const grow = p.e ? { fr: ` La tempête lui fait perdre ${p.e} min de plus entre chaque gare.`, en: ` The storm costs it ${p.e} more minutes between each station.`, vi: ` Bão tuyết làm tàu trễ thêm ${p.e} phút giữa mỗi ga.` }[lang()] : '';
      return base + grow;
    },
    render(p) {
      box().innerHTML = `<table class="sched"><tr><th>${tr('station')}</th><th>${tr('time')}</th></tr>${p.rows.map(([s, t]) => `<tr><td>${s}</td><td>${hm(t)}</td></tr>`).join('')}</table>
        <p class="goal">${esc(W.schedule.question(p))}</p><p class="goal">${tr('schQ', { t: STN[p.ti] })}</p>` + K.inputRow();
      K.bindInput(v => { const d = String(v).replace(/\D/g, ''); return d.length >= 3 && d.padStart(4, '0') === hm(p.ans).replace(':', ''); }, p);
    },
    hint: p => tr('schH', { t: STN[p.ti], x: hm(p.rows[p.ti][1]) })
  };

  // ================= Aiguillage des wagons =================
  W.shunt = {
    init(p) {
      const n = [4, 5, 6][lvl()];
      for (;;) {
        const A = shuffle([...Array(n).keys()].map(i => i + 1)), a = A.slice(), S = [], B = [];
        while (B.length < n) { const ops = []; if (a.length) ops.push('AB', 'AS'); if (S.length) ops.push('SB'); const o = ops[rand(ops.length)]; if (o === 'AB') B.push(a.shift()); else if (o === 'AS') S.push(a.shift()); else B.push(S.pop()); }
        if (B.join() !== A.join() && B.join() !== A.slice().reverse().join()) { Object.assign(p, { A0: A, want: B }); break; }
      }
      W.shunt.reset(p);
    },
    reset(p) { p.A = p.A0.slice(); p.S = []; p.B = []; },
    next(p) { const need = p.want[p.B.length]; if (p.A[0] === need) return 'AB'; if (p.S[p.S.length - 1] === need) return 'SB'; return 'AS'; },
    render(p) {
      const wag = (w, cls = '') => `<span class="wag${cls}">${w}</span>`;
      box().innerHTML = `<p class="goal">🎯 ${tr('wanted')} : ${p.want.join(' – ')}</p>
        <div class="yard"><div class="trk"><small>${tr('trackA')}</small><div>${p.A.map(w => wag(w)).join('')}</div></div>
        <div class="trk sd"><small>${tr('siding')}</small><div>${p.S.map(w => wag(w, ' parked')).join('')}</div></div>
        <div class="trk"><small>${tr('trackB')}</small><div>${p.B.map(w => wag(w, ' ok')).join('')}</div></div></div>
        <div class="row"><button class="btn" data-m="AB" ${p.A.length ? '' : 'disabled'}>${tr('mAB')}</button><button class="btn" data-m="AS" ${p.A.length ? '' : 'disabled'}>${tr('mAS')}</button><button class="btn" data-m="SB" ${p.S.length ? '' : 'disabled'}>${tr('mSB')}</button></div>`;
      box().querySelectorAll('[data-m]').forEach(b => { b.onclick = () => {
        const m = b.dataset.m; if (m === 'AB') p.B.push(p.A.shift()); else if (m === 'AS') p.S.push(p.A.shift()); else p.B.push(p.S.pop());
        K.beep(m === 'AS' ? 200 : 320, .12, 'square', .05);
        if (p.B.length && p.B[p.B.length - 1] !== p.want[p.B.length - 1]) { W.shunt.reset(p); W.shunt.render(p); K.fail(tr('shuntBad')); return; }
        if (p.B.length === p.want.length) { W.shunt.render(p); setTimeout(() => K.solve(p), 400); return; }
        W.shunt.render(p);
      }; });
    },
    hint: p => tr('shuntH', { x: tr({ AB: 'mAB', AS: 'mAS', SB: 'mSB' }[W.shunt.next(p)]) })
  };

  // ================= Porte-bagages =================
  const nrm = s => { const r0 = Math.min(...s.map(c => c[0])), c0 = Math.min(...s.map(c => c[1])); return s.map(([r, c]) => [r - r0, c - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const rot = s => nrm(s.map(([r, c]) => [c, -r]));
  const PCOL = ['#c0392b', '#2e6fd1', '#3fa34d', '#e8a33a', '#8e3fbf', '#1fa3a3'];
  W.pack = {
    init(p) {
      const [R, C, k] = [[3, 4, 3], [4, 5, 4], [5, 5, 5]][lvl()];
      for (;;) {
        const own = Array(R * C).fill(-1), seeds = shuffle([...Array(R * C).keys()]).slice(0, k); seeds.forEach((s, i) => { own[s] = i; });
        const nb = i => { const r = Math.floor(i / C), c = i % C, o = []; if (r) o.push(i - C); if (r < R - 1) o.push(i + C); if (c) o.push(i - 1); if (c < C - 1) o.push(i + 1); return o; };
        for (let g = 0; g < 2000 && own.includes(-1); g++) { const reg = rand(k), fr = []; own.forEach((o, i) => { if (o === reg) nb(i).forEach(j => { if (own[j] < 0) fr.push(j); }); }); if (fr.length) own[fr[rand(fr.length)]] = reg; }
        if (own.includes(-1)) continue;
        const pieces = Array.from({ length: k }, (_, i) => nrm(own.map((o, j) => o === i ? [Math.floor(j / C), j % C] : null).filter(Boolean)));
        if (pieces.some(s => s.length < 2 || s.length > 7)) continue;
        Object.assign(p, { R, C, pieces: pieces.map(s => { let x = s; for (let t = rand(4); t--;) x = rot(x); return x; }), place: Array(k).fill(null), sel: 0 }); return;
      }
    },
    grid(p) { const g = Array(p.R * p.C).fill(-1); p.place.forEach((pl, i) => { if (pl) p.pieces[i].forEach(([r, c]) => { g[(pl[0] + r) * p.C + pl[1] + c] = i; }); }); return g; },
    mini: (s, col) => { const h = Math.max(...s.map(c => c[0])) + 1, w = Math.max(...s.map(c => c[1])) + 1; return `<svg viewBox="0 0 ${w} ${h}" style="width:${w * 18}px;height:${h * 18}px">${s.map(([r, c]) => `<rect x="${c + .05}" y="${r + .05}" width=".9" height=".9" rx=".15" fill="${col}"/>`).join('')}</svg>`; },
    render(p) {
      const g = W.pack.grid(p);
      box().innerHTML = `<div class="rack" style="--c:${p.C}">${g.map((o, i) => `<button class="rc" data-i="${i}" style="${o >= 0 ? `background:${PCOL[o]}` : ''}"></button>`).join('')}</div>
        <div class="tray">${p.pieces.map((s, i) => p.place[i] ? '' : `<button class="pc${p.sel === i ? ' sel' : ''}" data-i="${i}">${W.pack.mini(s, PCOL[i])}</button>`).join('')}</div>
        <div class="row"><button class="btn" id="rot">${tr('rotate')}</button><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.pc').forEach(b => { b.onclick = () => { p.sel = +b.dataset.i; W.pack.render(p); }; });
      $('#rot').onclick = () => { if (p.sel != null && !p.place[p.sel]) { p.pieces[p.sel] = rot(p.pieces[p.sel]); K.beep(500, .04, 'triangle', .05); W.pack.render(p); } };
      $('#rs').onclick = () => { p.place = p.place.map(() => null); W.pack.render(p); };
      box().querySelectorAll('.rc').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i, gg = W.pack.grid(p);
        if (gg[i] >= 0) { p.place[gg[i]] = null; p.sel = gg[i]; W.pack.render(p); return; }
        if (p.sel == null || p.place[p.sel]) return;
        const r0 = Math.floor(i / p.C), c0 = i % p.C, s = p.pieces[p.sel], a = s[0];
        const cells = s.map(([r, c]) => [r0 + r - a[0], c0 + c - a[1]]);
        if (!cells.every(([r, c]) => r >= 0 && r < p.R && c >= 0 && c < p.C && gg[r * p.C + c] < 0)) { K.beep(140, .08, 'square', .05); return; }
        p.place[p.sel] = [r0 - a[0], c0 - a[1]]; K.beep(420, .06, 'triangle', .06);
        const nx = p.place.findIndex(x => !x); p.sel = nx < 0 ? null : nx;
        if (nx < 0) { W.pack.render(p); setTimeout(() => K.solve(p), 400); return; }
        W.pack.render(p);
      }; });
    },
    hint: () => tr('packH')
  };

  // ================= Vannes de la chaudière =================
  W.valves = {
    init(p) {
      const lv = lvl(), m = 3, v = [3, 3, 4][lv];
      for (;;) {
        p.A = Array.from({ length: v }, () => Array.from({ length: m }, () => rand(6) - 2)); p.c = Array.from({ length: v }, () => rand(4));
        if (p.c.filter(Boolean).length < 2 || p.A.some(r => r.every(x => !x))) continue;
        p.s = Array.from({ length: m }, () => 15 + rand(20)); p.t = p.s.map((s, j) => s + p.A.reduce((a, r, i) => a + r[j] * p.c[i], 0));
        if (p.t.every((x, j) => x >= 0 && x <= 60 && x !== p.s[j])) break;
      }
      p.n = p.A.map(() => 0);
    },
    vals: p => p.s.map((s, j) => s + p.A.reduce((a, r, i) => a + r[j] * p.n[i], 0)),
    render(p) {
      const cur = W.valves.vals(p), sg = x => (x > 0 ? '+' : '') + x;
      box().innerHTML = `<div class="gauges">${cur.map((v, j) => `<div class="gauge${v === p.t[j] ? ' ok' : ''}"><svg viewBox="-50 -50 100 60"><path d="M-40 0 A40 40 0 0 1 40 0" class="arc"/><line x1="0" y1="0" x2="${-36 * Math.cos(Math.PI * Math.min(60, Math.max(0, v)) / 60)}" y2="${-36 * Math.sin(Math.PI * Math.min(60, Math.max(0, v)) / 60)}" class="ndl"/><line x1="0" y1="0" x2="${-40 * Math.cos(Math.PI * p.t[j] / 60)}" y2="${-40 * Math.sin(Math.PI * p.t[j] / 60)}" class="tgt"/></svg><b>${v}</b><small>${tr('goalV')} ${p.t[j]}</small></div>`).join('')}</div>
        <div class="valves">${p.A.map((r, i) => `<div class="vlv"><b>${tr('valve')} ${'ABCD'[i]}</b>${lvl() < 2 ? `<small>${r.map(sg).join(' / ')}</small>` : ''}<div><button class="btn" data-i="${i}" data-d="-1">−</button><em>${p.n[i]}</em><button class="btn" data-i="${i}" data-d="1">+</button></div></div>`).join('')}</div>`;
      box().querySelectorAll('.vlv .btn').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.n[i] = Math.max(0, Math.min(6, p.n[i] + +b.dataset.d)); K.beep(220 + i * 40, .08, 'sawtooth', .04); W.valves.render(p); if (W.valves.vals(p).every((x, j) => x === p.t[j])) setTimeout(() => K.solve(p), 500); }; });
    },
    hint: p => tr('valveH', { x: 'ABCD'[0], n: p.c[0] })
  };

  // ================= Empreintes =================
  const fpDraw = (cv, f) => {
    const c = cv.getContext('2d'), w = cv.width; c.fillStyle = '#f4f1e8'; c.fillRect(0, 0, w, w); c.translate(w / 2, w / 2); c.strokeStyle = '#2a2a3a'; c.lineWidth = 2.2;
    f.rings.forEach((br, k) => { const rx = 8 + k * 7, ry = rx * 1.3; c.beginPath(); c.ellipse(f.cx, f.cy, rx, ry, f.tilt, br + .5, br + Math.PI * 2 - .1); c.stroke(); });
    c.setTransform(1, 0, 0, 1, 0, 0);
  };
  const fpNew = () => ({ cx: rand(7) - 3, cy: rand(7) - 3, tilt: (rand(20) - 10) / 30, rings: Array.from({ length: 7 }, () => rand(628) / 100) });
  W.match = {
    init(p) {
      const lv = lvl(), nOpt = [4, 5, 6][lv];
      p.rounds = Array.from({ length: [1, 2, 3][lv] }, () => {
        const f = fpNew(), opts = [f];
        while (opts.length < nOpt) { const g = JSON.parse(JSON.stringify(f)); const k = rand(7); g.rings[k] = (g.rings[k] + 1.2 + rand(300) / 100) % 6.28; if (lv < 2 && rand(2)) g.tilt += .35; opts.push(g); }
        const o = shuffle(opts.map((_, i) => i)); return { f, opts: o.map(i => opts[i]), ans: o.indexOf(0) };
      });
      p.r = 0;
    },
    render(p) {
      const R = p.rounds[p.r];
      box().innerHTML = `<p class="cnt">${tr('fpRound', { n: p.r + 1, m: p.rounds.length })}</p><div class="fp"><canvas width="150" height="150" class="model"></canvas></div><div class="fps">${R.opts.map((_, i) => `<button class="fpo" data-i="${i}"><b>${i + 1}</b><canvas width="120" height="120"></canvas></button>`).join('')}</div>`;
      fpDraw(box().querySelector('.model'), R.f); box().querySelectorAll('.fpo canvas').forEach((cv, i) => fpDraw(cv, R.opts[i]));
      box().querySelectorAll('.fpo').forEach(b => { b.onclick = () => { if (+b.dataset.i !== R.ans) { K.fail(); return; } K.beep(880, .1, 'triangle', .08); if (++p.r >= p.rounds.length) { p.r--; setTimeout(() => K.solve(p), 300); return; } W.match.render(p); }; });
    },
    hint: p => tr('fpH', { x: p.rounds[p.r].ans + 1 })
  };

  // ================= Mots mêlés =================
  const WS = { fr: ['TRAIN', 'NEIGE', 'BILLET', 'QUAI', 'WAGON', 'GARE', 'RAILS', 'VAPEUR', 'TUNNEL', 'SIFFLET'], en: ['TRAIN', 'SNOW', 'TICKET', 'PLATFORM', 'WAGON', 'STATION', 'RAILS', 'STEAM', 'TUNNEL', 'WHISTLE'], vi: ['TAUHOA', 'NHAGA', 'VETAU', 'TUYET', 'TOATAU', 'DUONGRAY', 'HOINUOC', 'DUONGHAM', 'COITAU', 'SANGA'] };
  W.wordsearch = {
    sync(p) {
      const l = lang(); if (p.l === l) return; p.l = l;
      const lv = lvl(), n = [8, 10, 12][lv], dirs = [[[0, 1], [1, 0]], [[0, 1], [1, 0], [0, -1], [-1, 0]], [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]][lv];
      for (;;) {
        const g = Array(n * n).fill(''), words = shuffle(WS[l]).slice(0, [4, 6, 8][lv]).filter(w => w.length <= n), pos = {}; let ok = true;
        for (const w of words) { let placed = false; for (let t = 0; t < 300 && !placed; t++) { const [dr, dc] = dirs[rand(dirs.length)], r = rand(n), c = rand(n), cells = [...w].map((_, k) => [r + dr * k, c + dc * k]); if (cells.every(([rr, cc], k) => rr >= 0 && rr < n && cc >= 0 && cc < n && (!g[rr * n + cc] || g[rr * n + cc] === w[k]))) { cells.forEach(([rr, cc], k) => { g[rr * n + cc] = w[k]; }); pos[w] = cells.map(([rr, cc]) => rr * n + cc); placed = true; } } if (!placed) { ok = false; break; } }
        if (!ok) continue;
        const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; Object.assign(p, { n, g: g.map(ch => ch || AZ[rand(26)]), words, pos, found: [], a: null }); return;
      }
    },
    render(p) {
      W.wordsearch.sync(p);
      const fc = new Set(p.found.flatMap(w => p.pos[w])), tipw = p.hl >= 2 ? p.words.find(w => !p.found.includes(w)) : null;
      box().innerHTML = `<div class="ws" style="--n:${p.n}">${p.g.map((ch, i) => `<button class="wc${fc.has(i) ? ' on' : ''}${p.a === i ? ' a' : ''}${tipw && p.pos[tipw][0] === i ? ' tip' : ''}" data-i="${i}">${ch}</button>`).join('')}</div>
        <div class="wl">${p.words.map(w => `<span class="${p.found.includes(w) ? 'ok' : ''}">${w}</span>`).join('')}</div><p class="cnt">${tr('wsFound', { n: p.found.length, m: p.words.length })}</p>`;
      box().querySelectorAll('.wc').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i; if (p.a == null) { p.a = i; W.wordsearch.render(p); return; }
        const a = p.a; p.a = null;
        const w = p.words.find(w => !p.found.includes(w) && ((p.pos[w][0] === a && p.pos[w][w.length - 1] === i) || (p.pos[w][0] === i && p.pos[w][w.length - 1] === a)));
        if (w) { p.found.push(w); K.beep(880, .1, 'triangle', .08); if (p.found.length === p.words.length) { W.wordsearch.render(p); setTimeout(() => K.solve(p), 400); return; } } else K.beep(160, .08, 'sawtooth', .05);
        W.wordsearch.render(p);
      }; });
    },
    hint: p => tr('wsH', { x: p.words.find(w => !p.found.includes(w)) || '' })
  };

  // ================= Télégramme à trous =================
  const TEL = {
    fr: ['ARRÊT FORCÉ PRÈS DE', 'MONT-JOLI', 'STOP TEMPÊTE DE', 'NEIGE', 'STOP CHAUFFAGE EN', 'PANNE', 'STOP CODE DU COFFRET DANS LE', 'FOURGON', 'STOP NE PAS', 'OUVRIR', 'SANS LE', 'CHEF', 'STOP', ['SOLEIL', 'PLAGE', 'GÂTEAU']],
    en: ['FORCED STOP NEAR', 'MONT-JOLI', 'STOP SNOW', 'STORM', 'STOP HEATING', 'BROKEN', 'STOP CABINET CODE IN THE', 'VAN', 'STOP DO NOT', 'OPEN', 'WITHOUT THE', 'CONDUCTOR', 'STOP', ['BEACH', 'SUNSHINE', 'CAKE']],
    vi: ['TÀU DỪNG KHẨN CẤP GẦN', 'MONT-JOLI', 'STOP BÃO', 'TUYẾT', 'STOP HỆ THỐNG SƯỞI', 'HỎNG', 'STOP MÃ TỦ ĐIỆN Ở TOA', 'HÀNH LÝ', 'STOP KHÔNG ĐƯỢC', 'MỞ', 'KHI CHƯA CÓ', 'TRƯỞNG TÀU', 'STOP', ['BÃI BIỂN', 'NẮNG ĐẸP', 'BÁNH NGỌT']]
  };
  W.cloze = {
    sync(p) {
      const l = lang(); if (p.l === l) return; p.l = l;
      const parts = TEL[l], gaps = [1, 3, 5, 7, 9, 11], use = shuffle(gaps).slice(0, [3, 5, 6][lvl()]).sort((a, b) => a - b);
      Object.assign(p, { parts, gaps: use, fill: {}, cur: use[0], bank: shuffle(use.map(i => parts[i]).concat(lvl() ? parts[13].slice(0, lvl() + 1) : [])) });
    },
    render(p) {
      W.cloze.sync(p);
      box().innerHTML = `<div class="tel">${p.parts.slice(0, 13).map((w, i) => p.gaps.includes(i) ? `<button class="gap${p.cur === i ? ' cur' : ''}${p.fill[i] ? ' on' : ''}" data-i="${i}">${p.fill[i] || tr('blank')}</button>` : `<span>${esc(w)}</span>`).join(' ')}</div>
        <div class="row">${p.bank.map((w, k) => `<button class="btn wb" data-k="${k}" ${Object.values(p.fill).includes(w) ? 'disabled' : ''}>${esc(w)}</button>`).join('')}</div>`;
      box().querySelectorAll('.gap').forEach(b => { b.onclick = () => { const i = +b.dataset.i; if (p.fill[i]) delete p.fill[i]; p.cur = i; W.cloze.render(p); }; });
      box().querySelectorAll('.wb').forEach(b => { b.onclick = () => {
        if (p.cur == null) return; p.fill[p.cur] = p.bank[+b.dataset.k]; K.beep(520, .04, 'square', .05);
        p.cur = p.gaps.find(i => !p.fill[i]) ?? null;
        if (p.cur == null) { if (p.gaps.every(i => p.fill[i] === p.parts[i])) { W.cloze.render(p); setTimeout(() => K.solve(p), 400); return; } p.fill = {}; p.cur = p.gaps[0]; W.cloze.render(p); K.fail(); return; }
        W.cloze.render(p);
      }; });
    },
    hint: p => tr('clozeH', { x: p.parts[p.gaps[0]] })
  };
})();

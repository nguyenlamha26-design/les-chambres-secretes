// 14 nouveaux types d'énigmes : sudoku, différences, paires de mots, anneaux couplés, comptage, intrus,
// tours de Hanoï, carré magique, suites, chemin d'un seul trait, pièce sans retournement, tri logique,
// cadran de coffre-fort et cavalier d'échecs.
(() => {
  'use strict';
  const K = window.GameKit, { rand, shuffle } = window.Logic, W = K.W, $ = K.$;
  const G = () => K.G, tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s), lvl = () => K.G.lvl;
  const box = () => $('#pzb');
  const T = (fr, en, vi) => ({ fr, en, vi });

  const UI = {
    fr: { diffFound: 'Différences trouvées : {n} / {m}', pairsHead: '{a} ↔ {b}', ringTarget: 'Position à obtenir', ringH: 'Tourne l’anneau {n} vers la {d}.', left: 'gauche', right: 'droite',
      countH: 'La réponse est entre {a} et {b}.', oddRound: 'Manche {n} / {m}', hanoiMoves: 'Coups : {n}', hanoiMax: 'Coups : {n} / {m}', hanoiOver: 'Trop de coups ! Les disques reprennent leur place.', hanoiH: 'Déplace le disque du pilier {a} vers le pilier {b}.',
      magicSum: 'Chaque ligne, colonne et diagonale doit faire {s}.', strokeLeft: 'Cases restantes : {n}', strokeH: 'La case surlignée est la suivante sur un bon chemin (reviens en arrière si besoin).', shadowRound: 'Pièce {n} / {m}', shadowH: 'C’est la pièce n° {x}.',
      cheap: 'Du moins cher ➜ au plus cher', sortH: 'Le moins cher est : {x}.', dialRec: 'Arrêts enregistrés', dialH: 'Première étape : {x}.', dialR: 'droite', dialL: 'gauche', open: 'Ouvrir',
      chessMoves: 'Coups : {n} / {m}', chessOver: 'Trop de coups : le cavalier revient au départ.', chessH: 'Saute sur la case surlignée.', seriesH: 'Indice : {x}', missed: 'Raté !', sudokuH: 'Une case vient d’être remplie pour toi.', magicH: 'Une pierre vient d’être posée pour toi.' },
    en: { diffFound: 'Differences found: {n} / {m}', pairsHead: '{a} ↔ {b}', ringTarget: 'Position to reach', ringH: 'Turn ring {n} to the {d}.', left: 'left', right: 'right',
      countH: 'The answer is between {a} and {b}.', oddRound: 'Round {n} / {m}', hanoiMoves: 'Moves: {n}', hanoiMax: 'Moves: {n} / {m}', hanoiOver: 'Too many moves! The discs go back to the start.', hanoiH: 'Move the disc from pillar {a} to pillar {b}.',
      magicSum: 'Every row, column and diagonal must add up to {s}.', strokeLeft: 'Squares left: {n}', strokeH: 'The highlighted square is next on a good path (go back if needed).', shadowRound: 'Piece {n} / {m}', shadowH: 'It is piece no. {x}.',
      cheap: 'Cheapest ➜ most expensive', sortH: 'The cheapest is: {x}.', dialRec: 'Recorded stops', dialH: 'First step: {x}.', dialR: 'right', dialL: 'left', open: 'Open',
      chessMoves: 'Moves: {n} / {m}', chessOver: 'Too many moves: the knight goes back to the start.', chessH: 'Jump to the highlighted square.', seriesH: 'Hint: {x}', missed: 'Missed!', sudokuH: 'A square has just been filled in for you.', magicH: 'A stone has just been placed for you.' },
    vi: { diffFound: 'Đã tìm thấy: {n} / {m} điểm khác', pairsHead: '{a} ↔ {b}', ringTarget: 'Vị trí cần đạt', ringH: 'Xoay vòng {n} sang {d}.', left: 'trái', right: 'phải',
      countH: 'Đáp án nằm trong khoảng {a} đến {b}.', oddRound: 'Lượt {n} / {m}', hanoiMoves: 'Số bước: {n}', hanoiMax: 'Số bước: {n} / {m}', hanoiOver: 'Quá nhiều bước! Các đĩa trở về chỗ cũ.', hanoiH: 'Chuyển đĩa từ cột {a} sang cột {b}.',
      magicSum: 'Mỗi hàng, cột và đường chéo phải có tổng bằng {s}.', strokeLeft: 'Ô còn lại: {n}', strokeH: 'Ô được tô sáng là ô tiếp theo trên một đường đi đúng (lùi lại nếu cần).', shadowRound: 'Mảnh {n} / {m}', shadowH: 'Đó là mảnh số {x}.',
      cheap: 'Rẻ nhất ➜ đắt nhất', sortH: 'Món rẻ nhất là: {x}.', dialRec: 'Các điểm dừng đã ghi', dialH: 'Bước đầu tiên: {x}.', dialR: 'phải', dialL: 'trái', open: 'Mở',
      chessMoves: 'Số nước: {n} / {m}', chessOver: 'Quá nhiều nước: quân mã trở về chỗ xuất phát.', chessH: 'Nhảy đến ô được tô sáng.', seriesH: 'Gợi ý: {x}', missed: 'Trượt rồi!', sudokuH: 'Một ô vừa được điền giúp bạn.', magicH: 'Một hòn đá vừa được đặt giúp bạn.' }
  };
  const PZ = {
    fr: {
      sudoku: { t: 'Grille secrète', i: 'Remplis la grille : chaque ligne, chaque colonne et chaque carré 2×2 contient une seule fois chaque image. Clique sur une case pour changer son image.', h: 'Cherche la ligne ou la colonne à laquelle il ne manque qu’une image.' },
      spot: { t: 'Les différences', i: 'Les deux photos semblent identiques… Clique sur chaque différence (sur l’une ou l’autre photo).', h: 'Compare zone par zone : en haut à gauche, puis en haut à droite, etc.' },
      pairs: { t: 'Les paires de mots', i: 'Associe chaque mot à sa traduction : clique sur un mot à gauche, puis sur sa traduction à droite.', h: 'Commence par les mots que tu connais déjà, puis procède par élimination.' },
      rings: { t: 'L’astrolabe', i: 'Fais tourner les anneaux pour afficher la position demandée dans la fenêtre. Attention : chaque anneau entraîne celui du dessous dans l’autre sens.', h: 'Règle les anneaux dans l’ordre, du premier au dernier.' },
      count: { t: 'Le compte des poissons', i: 'Observe bien l’image et réponds à la question.', h: 'Compte en balayant l’image de gauche à droite, une colonne à la fois.' },
      odd: { t: 'L’intrus', i: 'Dans chaque série, un seul élément n’a rien à faire là. Clique sur l’intrus.', h: 'Cherche ce que les autres ont en commun.' },
      hanoi: { t: 'Les disques de pierre', i: 'Déplace toute la pile sur le pilier de droite. Un seul disque à la fois, et jamais un grand disque sur un plus petit. Clique sur un pilier pour prendre son disque du dessus, puis sur un autre pour le poser.', h: 'Avec un nombre impair de disques, le plus petit va d’abord à droite ; avec un nombre pair, au milieu.' },
      magic: { t: 'Le carré magique', i: 'Place les nombres de 1 à 9 (une seule fois chacun) pour que toutes les lignes, colonnes et diagonales aient la même somme.', h: 'Le nombre du centre est toujours 5. Les nombres pairs vont dans les coins.' },
      series: { t: 'La suite de nombres', i: 'Trouve la règle de la suite et écris le nombre suivant.', h: 'Calcule l’écart entre deux nombres voisins… puis l’écart entre les écarts.' },
      stroke: { t: 'D’un seul trait', i: 'Trace un chemin qui part de la case de départ et passe une seule fois par chaque case libre. Clique sur les cases voisines pour avancer ; clique sur une case déjà tracée pour revenir en arrière.', h: 'Longe les bords et garde les coins pour ne pas les isoler.' },
      shadow: { t: 'La bonne pièce', i: 'Quelle pièce correspond au modèle en la faisant seulement tourner, sans la retourner ? Les autres sont des reflets dans un miroir.', h: 'Repère une petite « bosse » du modèle et regarde de quel côté elle se trouve.' },
      sort: { t: 'Le rangement des prix', i: 'Grâce aux indices, range les articles du moins cher au plus cher en cliquant dans l’ordre.', h: 'Commence par les indices « le moins cher » ou « le plus cher », puis place les autres.' },
      dial: { t: 'Le cadran du coffre', i: 'Tourne le cadran en suivant la combinaison : à droite (les nombres montent) ou à gauche (ils descendent). Chaque changement de sens enregistre un arrêt. Clique sur « Ouvrir » à la fin.', h: 'La combinaison est écrite quelque part dans le bureau.' },
      chess: { t: 'Le cavalier', i: 'Amène le cavalier ♞ sur la case cible 🎯 en exactement le nombre de coups indiqué. Il se déplace en « L » et ne peut pas atterrir sur les pions ♟.', h: 'Travaille à l’envers : depuis quelles cases le cavalier peut-il atteindre la cible en un coup ?' }
    },
    en: {
      sudoku: { t: 'Secret Grid', i: 'Fill the grid: every row, column and 2×2 square contains each picture exactly once. Click a square to change its picture.', h: 'Look for the row or column that is missing just one picture.' },
      spot: { t: 'Spot the Difference', i: 'The two photos look identical… Click every difference (on either photo).', h: 'Compare area by area: top left, then top right, and so on.' },
      pairs: { t: 'Word Pairs', i: 'Match each word with its translation: click a word on the left, then its translation on the right.', h: 'Start with the words you already know, then work by elimination.' },
      rings: { t: 'The Astrolabe', i: 'Turn the rings to show the requested position in the window. Careful: each ring drags the one below it the other way.', h: 'Set the rings in order, from first to last.' },
      count: { t: 'Counting Fish', i: 'Look carefully at the picture and answer the question.', h: 'Count by sweeping the picture from left to right, one column at a time.' },
      odd: { t: 'Odd One Out', i: 'In each series, one item doesn’t belong. Click the odd one out.', h: 'Look for what the others have in common.' },
      hanoi: { t: 'The Stone Discs', i: 'Move the whole stack onto the right-hand pillar. One disc at a time, and never a big disc on a smaller one. Click a pillar to take its top disc, then another to drop it.', h: 'With an odd number of discs, the smallest goes right first; with an even number, to the middle.' },
      magic: { t: 'The Magic Square', i: 'Place the numbers 1 to 9 (once each) so that every row, column and diagonal has the same sum.', h: 'The centre number is always 5. Even numbers go in the corners.' },
      series: { t: 'Number Sequence', i: 'Find the rule of the sequence and type the next number.', h: 'Work out the gap between neighbouring numbers… then the gap between the gaps.' },
      stroke: { t: 'In One Stroke', i: 'Draw a path from the start square that visits every free square exactly once. Click neighbouring squares to move forward; click a square already on the path to go back.', h: 'Follow the edges and keep the corners from getting cut off.' },
      shadow: { t: 'The Right Piece', i: 'Which piece matches the model by turning only, without flipping it over? The others are mirror images.', h: 'Find a small “bump” on the model and see which side it is on.' },
      sort: { t: 'Sorting the Prices', i: 'Using the clues, sort the items from cheapest to most expensive by clicking them in order.', h: 'Start with the “cheapest” or “most expensive” clues, then place the rest.' },
      dial: { t: 'The Safe Dial', i: 'Turn the dial following the combination: right (numbers go up) or left (they go down). Each change of direction records a stop. Click “Open” at the end.', h: 'The combination is written somewhere in the office.' },
      chess: { t: 'The Knight', i: 'Bring the knight ♞ to the target square 🎯 in exactly the number of moves shown. It moves in an “L” and cannot land on the pawns ♟.', h: 'Work backwards: from which squares can the knight reach the target in one move?' }
    },
    vi: {
      sudoku: { t: 'Lưới bí mật', i: 'Điền vào lưới: mỗi hàng, mỗi cột và mỗi ô vuông 2×2 chứa mỗi hình đúng một lần. Bấm vào một ô để đổi hình.', h: 'Tìm hàng hoặc cột chỉ còn thiếu một hình.' },
      spot: { t: 'Tìm điểm khác nhau', i: 'Hai bức ảnh trông giống hệt nhau… Hãy bấm vào từng điểm khác nhau (trên ảnh nào cũng được).', h: 'So sánh từng vùng: góc trên bên trái, rồi góc trên bên phải, v.v.' },
      pairs: { t: 'Ghép cặp từ', i: 'Ghép mỗi từ với bản dịch của nó: bấm vào một từ bên trái, rồi bấm vào bản dịch bên phải.', h: 'Bắt đầu với những từ bạn đã biết, rồi loại trừ dần.' },
      rings: { t: 'Thước đo sao', i: 'Xoay các vòng để hiện đúng vị trí yêu cầu trong khung. Cẩn thận: mỗi vòng kéo vòng bên dưới quay ngược chiều.', h: 'Chỉnh các vòng theo thứ tự, từ vòng đầu đến vòng cuối.' },
      count: { t: 'Đếm cá', i: 'Quan sát kỹ bức tranh rồi trả lời câu hỏi.', h: 'Đếm bằng cách quét bức tranh từ trái sang phải, từng cột một.' },
      odd: { t: 'Tìm kẻ lạc loài', i: 'Trong mỗi nhóm, chỉ có một thứ không cùng loại. Bấm vào thứ đó.', h: 'Tìm điểm chung của những thứ còn lại.' },
      hanoi: { t: 'Những chiếc đĩa đá', i: 'Chuyển cả chồng đĩa sang cột bên phải. Mỗi lần một đĩa, và không bao giờ đặt đĩa lớn lên đĩa nhỏ. Bấm vào một cột để lấy đĩa trên cùng, rồi bấm cột khác để đặt xuống.', h: 'Nếu số đĩa là lẻ, đĩa nhỏ nhất đi sang phải trước; nếu chẵn, sang cột giữa.' },
      magic: { t: 'Ma phương', i: 'Đặt các số từ 1 đến 9 (mỗi số một lần) sao cho mọi hàng, cột và đường chéo có cùng tổng.', h: 'Số ở giữa luôn là 5. Các số chẵn nằm ở bốn góc.' },
      series: { t: 'Dãy số', i: 'Tìm quy luật của dãy rồi viết số tiếp theo.', h: 'Tính khoảng cách giữa hai số liền nhau… rồi khoảng cách giữa các khoảng cách.' },
      stroke: { t: 'Một nét vẽ', i: 'Vẽ một đường đi từ ô xuất phát, đi qua mỗi ô trống đúng một lần. Bấm vào ô bên cạnh để tiến lên; bấm vào ô đã đi qua để lùi lại.', h: 'Đi men theo các cạnh và đừng để các góc bị cô lập.' },
      shadow: { t: 'Mảnh ghép đúng', i: 'Mảnh nào trùng với mẫu khi chỉ xoay mà không lật? Các mảnh còn lại là hình phản chiếu qua gương.', h: 'Tìm một « chỗ lồi » nhỏ trên mẫu và xem nó nằm ở phía nào.' },
      sort: { t: 'Sắp xếp giá tiền', i: 'Dựa vào gợi ý, sắp xếp các món từ rẻ nhất đến đắt nhất bằng cách bấm theo thứ tự.', h: 'Bắt đầu với gợi ý « rẻ nhất » hoặc « đắt nhất », rồi xếp các món còn lại.' },
      dial: { t: 'Mặt số két sắt', i: 'Xoay mặt số theo tổ hợp: sang phải (số tăng) hoặc sang trái (số giảm). Mỗi lần đổi chiều sẽ ghi lại một điểm dừng. Bấm « Mở » khi xong.', h: 'Tổ hợp được ghi ở đâu đó trong văn phòng.' },
      chess: { t: 'Quân mã', i: 'Đưa quân mã ♞ đến ô đích 🎯 trong đúng số nước đã cho. Mã đi hình chữ « L » và không được đứng lên ô có tốt ♟.', h: 'Hãy nghĩ ngược lại: từ những ô nào quân mã có thể đến đích trong một nước?' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ================= Sudoku 4×4 =================
  const ok4 = (g, i, v) => { const r = i >> 2, c = i & 3; for (let k = 0; k < 4; k++) { if (g[r * 4 + k] === v || g[k * 4 + c] === v) return false; } const br = r & 2, bc = c & 2; for (const dr of [0, 1]) for (const dc of [0, 1]) if (g[(br + dr) * 4 + bc + dc] === v) return false; return true; };
  const count4 = (g, lim = 2) => { const i = g.indexOf(-1); if (i < 0) return 1; let n = 0; for (let v = 0; v < 4 && n < lim; v++) if (ok4(g, i, v)) { g[i] = v; n += count4(g, lim - n); g[i] = -1; } return n; };
  W.sudoku = {
    init(p, d) {
      let g = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]]; const s = shuffle([0, 1, 2, 3]); g = g.map(r => r.map(v => s[v]));
      if (rand(2)) [g[0], g[1]] = [g[1], g[0]]; if (rand(2)) [g[2], g[3]] = [g[3], g[2]]; if (rand(2)) g = [g[2], g[3], g[0], g[1]];
      if (rand(2)) g = g.map(r => [r[1], r[0], r[2], r[3]]); if (rand(2)) g = g.map(r => [r[0], r[1], r[3], r[2]]); if (rand(2)) g = g.map(r => [r[2], r[3], r[0], r[1]]);
      if (rand(2)) g = g[0].map((_, c) => g.map(r => r[c]));
      p.sol = g.flat(); const keep = [8, 6, 5][lvl()]; p.given = new Set([...Array(16).keys()]);
      for (const i of shuffle([...Array(16).keys()])) { if (p.given.size <= keep) break; p.given.delete(i); const t = p.sol.map((v, k) => p.given.has(k) ? v : -1); if (count4(t) !== 1) p.given.add(i); }
      p.cur = p.sol.map((v, i) => p.given.has(i) ? v : -1); p.ic = d.icons || ['🍎', '🍌', '🍐', '🍇'];
    },
    render(p) {
      box().innerHTML = `<div class="sdk">${p.cur.map((v, i) => `<button class="sc4${p.given.has(i) ? ' gv' : ''}" data-i="${i}">${v < 0 ? '' : p.ic[v]}</button>`).join('')}</div><div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.sc4').forEach(b => { b.onclick = () => { const i = +b.dataset.i; if (p.given.has(i)) return; p.cur[i] = p.cur[i] >= 3 ? -1 : p.cur[i] + 1; K.beep(500 + p.cur[i] * 60, .04, 'triangle', .05); W.sudoku.render(p); if (p.cur.every((v, k) => v === p.sol[k])) setTimeout(() => K.solve(p), 400); }; });
      $('#ok').onclick = () => { if (p.cur.every((v, k) => v === p.sol[k])) K.solve(p); else K.fail(); };
    },
    onHint2(p) { const i = p.cur.findIndex((v, k) => v !== p.sol[k]); if (i >= 0) { p.cur[i] = p.sol[i]; p.given.add(i); } },
    hint: () => tr('sudokuH')
  };

  // ================= Différences =================
  const SPOTI = ['📚', '🍎', '✏️', '🎒', '⚽', '🌵', '🖍️', '📐', '🧸', '⏰', '🎨', '📏', '🌍', '🎈', '🧃'];
  W.spot = {
    init(p) {
      const n = [3, 5, 7][lvl()], items = [];
      for (let k = 0; k < 18; k++) { let x, y, t = 0; do { x = 30 + rand(260); y = 70 + rand(130); t++; } while (t < 40 && items.some(o => Math.hypot(o.x - x, o.y - y) < 34)); items.push({ e: SPOTI[rand(SPOTI.length)], x, y, s: 20 + rand(10) }); }
      const right = items.map(o => ({ ...o })), diffs = [];
      shuffle([...items.keys()]).slice(0, n).forEach(k => {
        const o = right[k], kind = rand(3);
        if (kind === 0) { let e; do { e = SPOTI[rand(SPOTI.length)]; } while (e === o.e); o.e = e; } else if (kind === 1) o.gone = true; else o.s = Math.round(o.s * 1.6);
        diffs.push({ x: o.x, y: o.y });
      });
      Object.assign(p, { left: items, right, diffs, found: [], miss: 0 });
    },
    draw(cv, list, p) {
      const c = cv.getContext('2d');
      c.fillStyle = '#d9cfb6'; c.fillRect(0, 0, 320, 230); c.fillStyle = '#1a3d35'; c.fillRect(40, 10, 240, 50); c.fillStyle = '#6b4728'; c.fillRect(0, 205, 320, 25);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      list.forEach(o => { if (o.gone) return; c.font = `${o.s}px Segoe UI Emoji, sans-serif`; c.fillText(o.e, o.x, o.y); });
      c.lineWidth = 3;
      p.found.forEach(k => { c.strokeStyle = '#2e9a5a'; c.beginPath(); c.arc(p.diffs[k].x, p.diffs[k].y, 22, 0, Math.PI * 2); c.stroke(); });
      if (p.tip != null && !p.found.includes(p.tip)) { c.strokeStyle = '#ff5a5a'; c.setLineDash([5, 4]); c.beginPath(); c.arc(p.diffs[p.tip].x, p.diffs[p.tip].y, 26, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); }
    },
    render(p) {
      box().innerHTML = `<div class="spot"><canvas width="320" height="230"></canvas><canvas width="320" height="230"></canvas></div><p class="cnt">${tr('diffFound', { n: p.found.length, m: p.diffs.length })}</p>`;
      const cvs = box().querySelectorAll('canvas'); W.spot.draw(cvs[0], p.left, p); W.spot.draw(cvs[1], p.right, p);
      cvs.forEach(cv => { cv.onclick = e => {
        const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 320, y = (e.clientY - r.top) / r.height * 230;
        const k = p.diffs.findIndex((d, i) => !p.found.includes(i) && Math.hypot(d.x - x, d.y - y) < 24);
        if (k >= 0) { p.found.push(k); K.beep(880, .1, 'triangle', .1); W.spot.render(p); if (p.found.length === p.diffs.length) setTimeout(() => K.solve(p), 500); }
        else { p.miss++; if (lvl() === 2) K.fail(tr('missed')); else K.beep(160, .12, 'sawtooth', .06); }
      }; });
    },
    onHint2(p) { p.tip = p.diffs.findIndex((d, i) => !p.found.includes(i)); }
  };

  // ================= Paires de mots =================
  const WORDS = [T('pomme', 'apple', 'quả táo'), T('livre', 'book', 'quyển sách'), T('chat', 'cat', 'con mèo'), T('école', 'school', 'trường học'), T('crayon', 'pencil', 'bút chì'), T('maison', 'house', 'ngôi nhà'),
    T('eau', 'water', 'nước'), T('soleil', 'sun', 'mặt trời'), T('lune', 'moon', 'mặt trăng'), T('fleur', 'flower', 'bông hoa'), T('poisson', 'fish', 'con cá'), T('oiseau', 'bird', 'con chim'), T('gâteau', 'cake', 'bánh ngọt'), T('ami', 'friend', 'bạn bè')];
  const LNAME = { fr: 'Français', en: 'English', vi: 'Tiếng Việt' };
  W.pairs = {
    init(p) { p.items = shuffle([...WORDS.keys()]).slice(0, [4, 5, 6][lvl()]); p.rorder = shuffle(p.items.slice()); p.done = []; p.sel = null; },
    render(p) {
      const l = K.api.lang(), o = l === 'vi' ? 'fr' : 'vi';
      box().innerHTML = `<p class="cnt">${tr('pairsHead', { a: LNAME[l], b: LNAME[o] })}</p><div class="pairs"><div>${p.items.map(k => `<button class="btn pw${p.done.includes(k) ? ' ok' : ''}${p.sel === k ? ' sel' : ''}" data-k="${k}" data-s="l">${esc(WORDS[k][l])}</button>`).join('')}</div>
        <div>${p.rorder.map(k => `<button class="btn pw${p.done.includes(k) ? ' ok' : ''}" data-k="${k}" data-s="r">${esc(WORDS[k][o])}</button>`).join('')}</div></div>`;
      box().querySelectorAll('.pw').forEach(b => { b.onclick = () => {
        const k = +b.dataset.k; if (p.done.includes(k)) return;
        if (b.dataset.s === 'l') { p.sel = k; K.beep(500, .04, 'triangle', .05); W.pairs.render(p); return; }
        if (p.sel == null) return;
        if (p.sel === k) { p.done.push(k); p.sel = null; K.beep(880, .1, 'triangle', .08); W.pairs.render(p); if (p.done.length === p.items.length) setTimeout(() => K.solve(p), 400); }
        else { p.sel = null; W.pairs.render(p); if (lvl() === 2) K.fail(); else K.beep(160, .12, 'sawtooth', .06); }
      }; });
    },
    hint: p => { const l = K.api.lang(), o = l === 'vi' ? 'fr' : 'vi', k = p.items.find(x => !p.done.includes(x)); return k == null ? '' : `${WORDS[k][l]} = ${WORDS[k][o]}`; }
  };

  // ================= Anneaux couplés =================
  const RSYM = ['🐟', '⭐', '🌙', '⚓', '☀️', '🧭', '🐚', '🌊'];
  W.rings = {
    init(p) { const R = [3, 4, 5][lvl()]; p.syms = Array.from({ length: R }, () => shuffle(RSYM)); p.o = Array(R).fill(0); for (let k = 0; k < [6, 12, 20][lvl()] || p.o.every(v => !v); k++) W.rings.turn(p, rand(R), rand(2) ? 1 : -1); },
    turn(p, k, d) { p.o[k] = (p.o[k] + d + 8) % 8; if (k + 1 < p.o.length) p.o[k + 1] = (p.o[k + 1] - d + 8) % 8; },
    render(p) {
      box().innerHTML = `<p class="goal">🎯 ${tr('ringTarget')} : ${p.syms.map(s => s[0]).join(' ')}</p><div class="rings">${p.syms.map((s, k) => `<div class="ring"><button class="btn" data-k="${k}" data-d="-1">◀</button><div class="strip">${[-2, -1, 0, 1, 2].map(j => `<span class="${j ? '' : 'win'}">${s[(p.o[k] + j + 8) % 8]}</span>`).join('')}</div><button class="btn" data-k="${k}" data-d="1">▶</button></div>`).join('')}</div>`;
      box().querySelectorAll('.ring .btn').forEach(b => { b.onclick = () => { W.rings.turn(p, +b.dataset.k, +b.dataset.d); K.beep(300 + +b.dataset.k * 60, .05, 'square', .05); W.rings.render(p); if (p.o.every(v => !v)) setTimeout(() => K.solve(p), 500); }; });
    },
    hint: p => { const k = p.o.findIndex(v => v); if (k < 0) return ''; return tr('ringH', { n: k + 1, d: p.o[k] <= 4 ? tr('left') : tr('right') }); }
  };

  // ================= Comptage de poissons =================
  const FCOL = ['#e0453a', '#f2c230', '#3a8ee0'];
  W.count = {
    init(p) {
      const lv = lvl();
      for (;;) {
        const N = [18, 26, 34][lv], f = [];
        for (let k = 0; k < N; k++) { let x, y, t = 0; do { x = 40 + rand(520); y = 40 + rand(240); t++; } while (t < 50 && f.some(o => Math.hypot(o.x - x, o.y - y) < 42)); f.push({ x, y, d: rand(2) ? 1 : -1, c: rand(3), s: rand(3) === 0 ? .6 : 1 }); }
        const ans = [f.filter(o => o.c === 0).length, f.filter(o => o.c === 0 && o.d < 0).length, f.filter(o => (o.c === 0 || o.c === 1) && o.d > 0 && o.s === 1).length][lv];
        if (ans >= 2) { Object.assign(p, { f, ans }); return; }
      }
    },
    render(p) {
      const q = { fr: ['Combien de poissons rouges vois-tu ?', 'Combien de poissons rouges nagent vers la gauche ?', 'Combien de poissons rouges ou jaunes nagent vers la droite, sans compter les petits ?'], en: ['How many red fish can you see?', 'How many red fish are swimming to the left?', 'How many red or yellow fish are swimming to the right, not counting the small ones?'], vi: ['Bạn thấy bao nhiêu con cá màu đỏ?', 'Có bao nhiêu con cá đỏ đang bơi sang trái?', 'Có bao nhiêu con cá đỏ hoặc vàng đang bơi sang phải, không tính những con nhỏ?'] }[K.api.lang()][lvl()];
      box().innerHTML = `<canvas id="fishes" width="600" height="320"></canvas><p class="goal">${esc(q)}</p>` + K.inputRow('number');
      const c = $('#fishes').getContext('2d'); const bg = c.createLinearGradient(0, 0, 0, 320); bg.addColorStop(0, '#2a6a8a'); bg.addColorStop(1, '#0c2a3e'); c.fillStyle = bg; c.fillRect(0, 0, 600, 320);
      c.strokeStyle = 'rgba(220,200,150,.25)'; c.lineWidth = 1; for (let x = -320; x < 600; x += 24) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 320, 320); c.moveTo(x + 320, 0); c.lineTo(x, 320); c.stroke(); }
      p.f.forEach(o => { c.save(); c.translate(o.x, o.y); c.scale(o.d * o.s, o.s); c.fillStyle = FCOL[o.c]; c.beginPath(); c.ellipse(0, 0, 20, 11, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-16, 0); c.lineTo(-30, -10); c.lineTo(-30, 10); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(10, -3, 3.5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(11, -3, 1.6, 0, Math.PI * 2); c.fill(); c.restore(); });
      K.bindInput(v => /^\s*\d+\s*$/.test(v) && +v === p.ans, p);
    },
    hint: p => tr('countH', { a: Math.max(0, p.ans - 1), b: p.ans + 1 })
  };

  // ================= L'intrus =================
  const ODD = [
    [['🍎', '🍌', '🍇', '🍐', '🥕'], T('La carotte est un légume, pas un fruit.', 'The carrot is a vegetable, not a fruit.', 'Cà rốt là rau củ, không phải trái cây.')],
    [['🐟', '🦈', '🐠', '🐡', '🐬'], T('Le dauphin est un mammifère, pas un poisson.', 'The dolphin is a mammal, not a fish.', 'Cá heo là động vật có vú, không phải cá.')],
    [['🐔', '🦆', '🦉', '🐦', '🦇'], T('La chauve-souris n’est pas un oiseau.', 'The bat is not a bird.', 'Con dơi không phải là chim.')],
    [['⛵', '🚢', '🛶', '🚤', '✈️'], T('L’avion ne flotte pas sur l’eau.', 'The plane doesn’t float on water.', 'Máy bay không nổi trên mặt nước.')],
    [['🌹', '🌻', '🌷', '🌼', '🍄'], T('Le champignon n’est pas une fleur.', 'The mushroom is not a flower.', 'Cây nấm không phải là hoa.')],
    [['2', '4', '8', '16', '20'], T('20 n’est pas une puissance de 2.', '20 is not a power of 2.', '20 không phải là lũy thừa của 2.')],
    [['3', '5', '7', '11', '9'], T('9 n’est pas un nombre premier (9 = 3 × 3).', '9 is not a prime number (9 = 3 × 3).', '9 không phải là số nguyên tố (9 = 3 × 3).')],
    [['1', '4', '9', '16', '15'], T('15 n’est pas un carré parfait.', '15 is not a perfect square.', '15 không phải là số chính phương.')],
    [['🦀', '🦞', '🦐', '🐙', '🐢'], T('La tortue est un reptile avec un squelette ; les autres n’ont pas d’os.', 'The turtle is a reptile with a skeleton; the others have no bones.', 'Con rùa là bò sát có bộ xương; những con còn lại không có xương.')]
  ];
  W.odd = {
    init(p) { p.sets = shuffle([...ODD.keys()]).slice(0, [2, 3, 4][lvl()]).map(k => ({ k, o: shuffle([0, 1, 2, 3, 4]) })); p.r = 0; p.why = ''; },
    render(p) {
      const s = p.sets[p.r];
      box().innerHTML = `<p class="cnt">${tr('oddRound', { n: p.r + 1, m: p.sets.length })}</p><div class="odd">${s.o.map(i => `<button class="oddi${p.hl >= 2 && i === 4 ? ' tip' : ''}" data-i="${i}">${ODD[s.k][0][i]}</button>`).join('')}</div><p class="cnt ok">${esc(p.why)}</p>`;
      box().querySelectorAll('.oddi').forEach(b => { b.onclick = () => {
        if (+b.dataset.i !== 4) { K.fail(); return; }
        p.why = '✓ ' + X(ODD[s.k][1]); K.beep(880, .1, 'triangle', .08);
        if (++p.r >= p.sets.length) { p.r--; W.odd.render(p); setTimeout(() => K.solve(p), 900); return; }
        p.hl = Math.min(p.hl, 1); W.odd.render(p);
      }; });
    },
    hint: p => X(ODD[p.sets[p.r].k][1])
  };

  // ================= Tours de Hanoï =================
  W.hanoi = {
    init(p) { const n = [3, 4, 5][lvl()]; p.n = n; p.pos = Array(n + 1).fill(0); p.sel = null; p.m = 0; p.max = [0, (1 << n) - 1 + 10, (1 << n) - 1 + 4][lvl()]; },
    top: (p, peg) => { for (let d = 1; d <= p.n; d++) if (p.pos[d] === peg) return d; return 0; },
    next(p, n, target) { if (!n) return null; const at = p.pos[n]; if (at === target) return W.hanoi.next(p, n - 1, target); const other = 3 - at - target; return W.hanoi.next(p, n - 1, other) || [at, target]; },
    render(p) {
      box().innerHTML = `<div class="hanoi">${[0, 1, 2].map(peg => `<button class="peg${p.sel === peg ? ' sel' : ''}" data-p="${peg}"><i class="rod"></i>${Array.from({ length: p.n }, (_, k) => p.n - k).filter(d => p.pos[d] === peg).map(d => `<span class="disk" style="width:${30 + d * 22}px;background:hsl(${30 + d * 40},45%,${40 + d * 4}%)"></span>`).join('')}</button>`).join('')}</div>
        <p class="cnt">${p.max ? tr('hanoiMax', { n: p.m, m: p.max }) : tr('hanoiMoves', { n: p.m })}</p><div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.peg').forEach(b => { b.onclick = () => {
        const peg = +b.dataset.p;
        if (p.sel == null) { if (W.hanoi.top(p, peg)) { p.sel = peg; W.hanoi.render(p); } return; }
        if (peg === p.sel) { p.sel = null; W.hanoi.render(p); return; }
        const d = W.hanoi.top(p, p.sel), t = W.hanoi.top(p, peg);
        if (t && t < d) { K.beep(150, .1, 'sawtooth', .06); p.sel = null; W.hanoi.render(p); return; }
        p.pos[d] = peg; p.sel = null; p.m++; K.beep(260 + d * 50, .08, 'triangle', .08);
        if (p.pos.slice(1).every(x => x === 2)) { W.hanoi.render(p); setTimeout(() => K.solve(p), 500); return; }
        if (p.max && p.m >= p.max) { W.hanoi.init(p); W.hanoi.render(p); K.fail(tr('hanoiOver')); return; }
        W.hanoi.render(p);
      }; });
      $('#rs').onclick = () => { W.hanoi.init(p); W.hanoi.render(p); };
    },
    hint: p => { const m = W.hanoi.next(p, p.n, 2); return m ? tr('hanoiH', { a: m[0] + 1, b: m[1] + 1 }) : ''; }
  };

  // ================= Carré magique =================
  const LO = [2, 7, 6, 9, 5, 1, 4, 3, 8];
  const SQS = (() => { const out = [], rot = s => [6, 3, 0, 7, 4, 1, 8, 5, 2].map(i => s[i]), mir = s => [2, 1, 0, 5, 4, 3, 8, 7, 6].map(i => s[i]); let s = LO; for (let k = 0; k < 4; k++) { out.push(s, mir(s)); s = rot(s); } return out; })();
  W.magic = {
    init(p) {
      p.sol = SQS[rand(8)]; const keep = [5, 3, 2][lvl()];
      for (;;) { const gv = shuffle([...Array(9).keys()]).slice(0, keep); if (SQS.filter(s => gv.every(i => s[i] === p.sol[i])).length === 1) { p.given = new Set(gv); break; } }
      p.cur = p.sol.map((v, i) => p.given.has(i) ? v : 0);
    },
    render(p) {
      box().innerHTML = `${lvl() < 2 ? `<p class="cnt">${tr('magicSum', { s: 15 })}</p>` : ''}<div class="magic">${p.cur.map((v, i) => p.given.has(i) ? `<span class="mg gv">${v}</span>` : `<select class="mg" data-i="${i}"><option value="0">·</option>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<option ${v === n ? 'selected' : ''}>${n}</option>`).join('')}</select>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('select.mg').forEach(s => { s.onchange = () => { p.cur[+s.dataset.i] = +s.value; K.beep(400, .04, 'triangle', .05); }; });
      $('#ok').onclick = () => { if (SQS.some(s => s.every((v, i) => v === p.cur[i]))) K.solve(p); else K.fail(); };
    },
    onHint2(p) { const i = p.cur.findIndex((v, k) => v !== p.sol[k]); if (i >= 0) { p.cur[i] = p.sol[i]; p.given.add(i); } },
    hint: () => tr('magicH')
  };

  // ================= Suites de nombres =================
  const SER = {
    arith: [T('On ajoute toujours le même nombre.', 'The same number is added each time.', 'Mỗi lần cộng thêm cùng một số.'), () => { const a = 1 + rand(9), d = 2 + rand(8); return Array.from({ length: 6 }, (_, k) => a + k * d); }],
    geom: [T('Chaque nombre est le double du précédent.', 'Each number is double the previous one.', 'Mỗi số gấp đôi số trước.'), () => { const a = 1 + rand(5); return Array.from({ length: 6 }, (_, k) => a * 2 ** k); }],
    squares: [T('Ce sont des carrés : 1×1, 2×2, 3×3…', 'They are squares: 1×1, 2×2, 3×3…', 'Đó là các số chính phương: 1×1, 2×2, 3×3…'), () => { const a = 1 + rand(4); return Array.from({ length: 6 }, (_, k) => (a + k) ** 2); }],
    alt: [T('On ajoute un nombre, puis on en retire un autre, en alternance.', 'Add one number, then subtract another, alternately.', 'Lần lượt cộng một số rồi trừ một số khác.'), () => { const a = 5 + rand(10), u = 3 + rand(6), v = 1 + rand(u - 1); const s = [a]; for (let k = 1; k < 6; k++) s.push(s[k - 1] + (k % 2 ? u : -v)); return s; }],
    tri: [T('Les écarts augmentent de 1 à chaque fois.', 'The gaps grow by 1 each time.', 'Khoảng cách tăng thêm 1 sau mỗi lần.'), () => { const a = 1 + rand(5), g = 1 + rand(3); const s = [a]; for (let k = 1; k < 6; k++) s.push(s[k - 1] + g + k - 1); return s; }],
    dbl1: [T('On double, puis on ajoute 1.', 'Double it, then add 1.', 'Nhân đôi rồi cộng 1.'), () => { const s = [1 + rand(4)]; for (let k = 1; k < 6; k++) s.push(s[k - 1] * 2 + 1); return s; }],
    fib: [T('Chaque nombre est la somme des deux précédents.', 'Each number is the sum of the two before it.', 'Mỗi số bằng tổng hai số đứng trước.'), () => { const s = [1 + rand(4), 2 + rand(4)]; while (s.length < 6) s.push(s[s.length - 1] + s[s.length - 2]); return s; }],
    cubes: [T('Ce sont des cubes : 1×1×1, 2×2×2…', 'They are cubes: 1×1×1, 2×2×2…', 'Đó là các lập phương: 1×1×1, 2×2×2…'), () => { const a = 1 + rand(3); return Array.from({ length: 6 }, (_, k) => (a + k) ** 3); }],
    sqp: [T('Les écarts sont 1, 3, 5, 7… (nombres impairs).', 'The gaps are 1, 3, 5, 7… (odd numbers).', 'Khoảng cách là 1, 3, 5, 7… (các số lẻ).'), () => { const a = 2 + rand(8); return Array.from({ length: 6 }, (_, k) => a + k * k); }]
  };
  W.series = {
    init(p) { const kinds = [['arith', 'geom'], ['squares', 'alt', 'tri', 'dbl1'], ['fib', 'cubes', 'sqp', 'dbl1']][lvl()]; p.kind = kinds[rand(kinds.length)]; p.s = SER[p.kind][1](); },
    render(p) {
      box().innerHTML = `<div class="series">${p.s.slice(0, 5).map(v => `<span>${v}</span>`).join('<i>,</i>')}<i>,</i><span class="q">?</span></div>` + K.inputRow('number');
      K.bindInput(v => /^\s*\d+\s*$/.test(v) && +v === p.s[5], p);
    },
    hint: p => tr('seriesH', { x: X(SER[p.kind][0]) })
  };

  // ================= D'un seul trait =================
  W.stroke = {
    init(p) {
      const n = [5, 6, 7][lvl()], need = Math.ceil(n * n * [.84, .86, .9][lvl()]), nb = i => { const r = Math.floor(i / n), c = i % n, o = []; if (r) o.push(i - n); if (r < n - 1) o.push(i + n); if (c) o.push(i - 1); if (c < n - 1) o.push(i + 1); return o; };
      for (;;) {
        const seen = new Set(), path = [rand(n * n)]; seen.add(path[0]);
        for (;;) { const cur = path[path.length - 1], opts = nb(cur).filter(j => !seen.has(j)); if (!opts.length) break; const deg = j => nb(j).filter(x => !seen.has(x)).length; const m = Math.min(...opts.map(deg)); const best = opts.filter(j => deg(j) === m); const j = best[rand(best.length)]; seen.add(j); path.push(j); }
        if (path.length >= need && path.length < n * n + 1) { Object.assign(p, { n, sol: path, free: new Set(path), path: [path[0]], nb }); return; }
      }
    },
    render(p) {
      const n = p.n, head = p.path[p.path.length - 1], left = p.free.size - p.path.length;
      if (p.hl >= 2) { let k = 0; while (k < p.path.length && p.path[k] === p.sol[k]) k++; p.tip = k < p.path.length ? p.sol[k - 1] : p.sol[k]; }
      box().innerHTML = `<div class="stroke" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => { const k = p.path.indexOf(i); return `<button class="sk${p.free.has(i) ? '' : ' blk'}${k >= 0 ? ' on' : ''}${i === head ? ' head' : ''}${i === p.sol[0] ? ' st' : ''}${p.hl >= 2 && p.tip === i ? ' tip' : ''}" data-i="${i}" ${p.free.has(i) ? '' : 'disabled'}>${k >= 0 ? k + 1 : ''}</button>`; }).join('')}</div>
        <p class="cnt">${tr('strokeLeft', { n: left })}</p><div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.sk:not(.blk)').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i, k = p.path.indexOf(i);
        if (k >= 0) { p.path = p.path.slice(0, k + 1); W.stroke.render(p); return; }
        if (!p.nb(p.path[p.path.length - 1]).includes(i)) return;
        p.path.push(i); K.beep(400 + p.path.length * 12, .04, 'triangle', .05);
        if (p.path.length === p.free.size) { W.stroke.render(p); setTimeout(() => K.solve(p), 400); return; }
        if (!p.nb(i).some(j => p.free.has(j) && !p.path.includes(j))) K.beep(140, .15, 'sawtooth', .05);
        W.stroke.render(p);
      }; });
      $('#rs').onclick = () => { p.path = [p.sol[0]]; W.stroke.render(p); };
    },
    hint: () => tr('strokeH')
  };

  // ================= La bonne pièce (sans retournement) =================
  const PENT = [[[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], [[0, 1], [1, 1], [2, 0], [2, 1], [3, 0]], [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]], [[0, 1], [1, 0], [1, 1], [2, 1], [3, 1]], [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]];
  const norm = s => { const r0 = Math.min(...s.map(c => c[0])), c0 = Math.min(...s.map(c => c[1])); return s.map(([r, c]) => [r - r0, c - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const rotP = s => norm(s.map(([r, c]) => [c, -r])), mirP = s => norm(s.map(([r, c]) => [r, -c]));
  const key = s => JSON.stringify(norm(s));
  W.shadow = {
    init(p) {
      p.rounds = Array.from({ length: [1, 2, 3][lvl()] }, () => {
        const base = norm(PENT[rand(PENT.length)]); let good = base; for (let k = 1 + rand(3); k--;) good = rotP(good);
        const rots = new Set([0, 1, 2, 3].map(k => { let s = base; for (let j = 0; j < k; j++) s = rotP(s); return key(s); }));
        const opts = [good]; let m = mirP(base); const tried = new Set();
        for (let k = 0; k < 4 && opts.length < 4; k++) { m = rotP(m); const kk = key(m); if (!rots.has(kk) && !tried.has(kk)) { tried.add(kk); opts.push(m); } }
        while (opts.length < 4) opts.push(mirP(rotP(good)));
        const order = shuffle([0, 1, 2, 3]); return { base, opts: order.map(i => opts[i]), ans: order.indexOf(0) };
      });
      p.r = 0;
    },
    svg(s, cls) { const h = Math.max(...s.map(c => c[0])) + 1, w = Math.max(...s.map(c => c[1])) + 1; return `<svg class="${cls}" viewBox="-0.2 -0.2 ${Math.max(w, h) + .4} ${Math.max(w, h) + .4}">${s.map(([r, c]) => `<rect x="${c + .04}" y="${r + .04}" width=".92" height=".92" rx=".12"/>`).join('')}</svg>`; },
    render(p) {
      const R = p.rounds[p.r];
      box().innerHTML = `<p class="cnt">${tr('shadowRound', { n: p.r + 1, m: p.rounds.length })}</p><div class="shmodel">${W.shadow.svg(R.base, 'model')}</div>
        <div class="shopts">${R.opts.map((o, i) => `<button class="shopt" data-i="${i}"><b>${i + 1}</b>${W.shadow.svg(o, 'opt')}</button>`).join('')}</div>`;
      box().querySelectorAll('.shopt').forEach(b => { b.onclick = () => {
        if (+b.dataset.i !== R.ans) { K.fail(); return; }
        K.beep(880, .1, 'triangle', .08);
        if (++p.r >= p.rounds.length) { p.r--; setTimeout(() => K.solve(p), 300); return; }
        W.shadow.render(p);
      }; });
    },
    hint: p => tr('shadowH', { x: p.rounds[p.r].ans + 1 })
  };

  // ================= Tri logique =================
  const SORTC = {
    gt: T('{A} coûte plus cher que {B}.', '{A} costs more than {B}.', '{A} đắt hơn {B}.'),
    lo: T('{A} est le moins cher de tous.', '{A} is the cheapest of all.', '{A} rẻ nhất trong tất cả.'),
    hi: T('{A} est le plus cher de tous.', '{A} is the most expensive of all.', '{A} đắt nhất trong tất cả.'),
    next: T('{A} coûte juste un peu plus que {B} : aucun article n’est entre les deux.', '{A} costs just a little more than {B}: nothing is priced in between.', '{A} chỉ đắt hơn {B} một chút: không có món nào ở giữa.'),
    mid: T('{A} n’est ni le moins cher ni le plus cher.', '{A} is neither the cheapest nor the most expensive.', '{A} không rẻ nhất cũng không đắt nhất.')
  };
  const perms = n => { const out = [], go = (a, r) => { if (!r.length) { out.push(a); return; } r.forEach((x, i) => go(a.concat(x), r.filter((_, j) => j !== i))); }; go([], [...Array(n).keys()]); return out; };
  W.sort = {
    init(p, d) {
      const n = [4, 5, 5][lvl()], P = perms(n), holds = (c, o) => { const r = x => o.indexOf(x); switch (c.t) { case 'gt': return r(c.a) > r(c.b); case 'lo': return r(c.a) === 0; case 'hi': return r(c.a) === n - 1; case 'next': return r(c.a) === r(c.b) + 1; case 'mid': return r(c.a) > 0 && r(c.a) < n - 1; } };
      for (;;) {
        const o = shuffle([...Array(n).keys()]), pool = [], clues = [];
        for (let a = 0; a < n; a++) { pool.push({ t: 'mid', a }); if (lvl() < 2) pool.push({ t: 'lo', a }, { t: 'hi', a }); for (let b = 0; b < n; b++) if (a !== b) pool.push({ t: 'gt', a, b }, { t: 'next', a, b }); }
        let left = P.length;
        for (const c of shuffle(pool.filter(c => holds(c, o)))) { const nl = P.filter(q => clues.concat(c).every(x => holds(x, q))).length; if (nl < left) { clues.push(c); left = nl; } if (left === 1) break; }
        if (left === 1 && clues.length <= n + 2) { Object.assign(p, { n, o, clues, names: d.items, pick: [] }); return; }
      }
    },
    render(p) {
      const g = G(), names = p.names(g), low = s => s.charAt(0).toLowerCase() + s.slice(1);
      box().innerHTML = `<ul class="clues">${p.clues.map(c => `<li>${esc(X(SORTC[c.t]).replace('{A}', names[c.a]).replace('{B}', c.b != null ? low(names[c.b]) : ''))}</li>`).join('')}</ul>
        <p class="cnt">${tr('cheap')}</p><div class="sortit">${names.map((nm, i) => `<button class="btn${p.pick.includes(i) ? ' on' : ''}" data-i="${i}" ${p.pick.includes(i) ? 'disabled' : ''}>${p.pick.includes(i) ? (p.pick.indexOf(i) + 1) + '. ' : ''}${esc(nm)}</button>`).join('')}</div>
        <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.sortit .btn').forEach(b => { b.onclick = () => {
        p.pick.push(+b.dataset.i); K.beep(450 + p.pick.length * 50, .05, 'triangle', .06);
        if (p.pick.length === p.n) { if (p.pick.every((v, k) => v === p.o[k])) { W.sort.render(p); setTimeout(() => K.solve(p), 400); return; } p.pick = []; W.sort.render(p); K.fail(); return; }
        W.sort.render(p);
      }; });
      $('#rs').onclick = () => { p.pick = []; W.sort.render(p); };
    },
    hint: p => tr('sortH', { x: p.names(G())[p.o[0]] })
  };

  // ================= Cadran du coffre =================
  W.dial = {
    init(p) { p.pos = 0; p.stops = []; p.dir = 0; },
    move(p, d, k) {
      if (p.dir && d !== p.dir) p.stops.push([p.dir, p.pos]);
      p.dir = d; p.pos = ((p.pos + d * k) % 40 + 40) % 40; K.beep(900, .02, 'square', .03); W.dial.render(p);
    },
    render(p) {
      const seq = G().v.dial.seq, nm = d => d > 0 ? 'R' : 'L';
      box().innerHTML = `<div class="dialw"><svg viewBox="-110 -110 220 220" class="sdial"><circle r="104" class="rim"/><g style="transform:rotate(${-p.pos * 9}deg)">${Array.from({ length: 40 }, (_, k) => `<line x1="0" y1="-96" x2="0" y2="${k % 5 ? -88 : -80}" transform="rotate(${k * 9})"/>${k % 5 ? '' : `<text transform="rotate(${k * 9}) translate(0,-64)">${k}</text>`}`).join('')}</g><polygon points="-7,-110 7,-110 0,-96" class="mark"/><circle r="22" class="knob"/></svg>
        <div class="dnum">${p.pos}</div></div>
        <div class="row"><button class="btn" data-d="-1" data-k="5">⟲ 5</button><button class="btn" data-d="-1" data-k="1">⟲ 1</button><button class="btn" data-d="1" data-k="1">1 ⟳</button><button class="btn" data-d="1" data-k="5">5 ⟳</button></div>
        ${lvl() === 0 ? `<p class="cnt">${tr('dialRec')} : ${p.stops.map(([d, v]) => nm(d) + v).join(' · ') || '—'}</p>` : ''}
        <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button><button class="btn gold" id="ok">${tr('open')}</button></div>`;
      box().querySelectorAll('[data-d]').forEach(b => { b.onclick = () => W.dial.move(p, +b.dataset.d, +b.dataset.k); });
      $('#rs').onclick = () => { W.dial.init(p); W.dial.render(p); };
      $('#ok').onclick = () => {
        const stops = p.stops.concat(p.dir ? [[p.dir, p.pos]] : []);
        if (stops.length === seq.length && stops.every(([d, v], i) => d === seq[i][0] && v === seq[i][1])) K.solve(p); else { W.dial.init(p); W.dial.render(p); K.fail(); }
      };
    },
    hint: () => { const s = G().v.dial.seq[0]; return tr('dialH', { x: (s[0] > 0 ? tr('dialR') : tr('dialL')) + ' → ' + s[1] }); }
  };

  // ================= Cavalier d'échecs =================
  const KM = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  W.chess = {
    init(p) {
      const lv = lvl(), n = [5, 6, 8][lv], want = [2, 3, 4][lv], pawns = [0, 3, 6][lv];
      for (;;) {
        const blk = new Set(shuffle([...Array(n * n).keys()]).slice(0, pawns)); let st; do { st = rand(n * n); } while (blk.has(st));
        const dist = new Map([[st, 0]]), q = [st], prev = new Map();
        while (q.length) { const i = q.shift(), r = Math.floor(i / n), c = i % n; for (const [a, b] of KM) { const rr = r + a, cc = c + b, j = rr * n + cc; if (rr >= 0 && rr < n && cc >= 0 && cc < n && !blk.has(j) && !dist.has(j)) { dist.set(j, dist.get(i) + 1); prev.set(j, i); q.push(j); } } }
        const cands = [...dist].filter(([, d]) => d === want).map(([j]) => j);
        if (cands.length) { Object.assign(p, { n, blk, st, tgt: cands[rand(cands.length)], k: want, pos: st, m: 0 }); return; }
      }
    },
    legal(p, i) { const n = p.n, r = Math.floor(p.pos / n), c = p.pos % n, rr = Math.floor(i / n), cc = i % n; return !p.blk.has(i) && KM.some(([a, b]) => r + a === rr && c + b === cc); },
    nextStep(p) {
      const n = p.n, dist = new Map([[p.tgt, 0]]), q = [p.tgt];
      while (q.length) { const i = q.shift(), r = Math.floor(i / n), c = i % n; for (const [a, b] of KM) { const rr = r + a, cc = c + b, j = rr * n + cc; if (rr >= 0 && rr < n && cc >= 0 && cc < n && !p.blk.has(j) && !dist.has(j)) { dist.set(j, dist.get(i) + 1); q.push(j); } } }
      const left = p.k - p.m; return [...Array(n * n).keys()].find(i => W.chess.legal(p, i) && dist.get(i) === left - 1);
    },
    render(p) {
      const n = p.n, tip = p.hl >= 2 ? W.chess.nextStep(p) : -1;
      box().innerHTML = `<div class="chess" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => { const r = Math.floor(i / n), c = i % n, lg = W.chess.legal(p, i);
        return `<button class="cq${(r + c) % 2 ? ' dk' : ''}${lvl() === 0 && lg ? ' lgm' : ''}${tip === i ? ' tip' : ''}" data-i="${i}">${i === p.pos ? '♞' : p.blk.has(i) ? '♟' : i === p.tgt ? '🎯' : ''}</button>`; }).join('')}</div>
        <p class="cnt">${tr('chessMoves', { n: p.m, m: p.k })}</p>`;
      box().querySelectorAll('.cq').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i; if (!W.chess.legal(p, i)) return;
        p.pos = i; p.m++; K.beep(520, .06, 'triangle', .06);
        if (p.pos === p.tgt && p.m === p.k) { W.chess.render(p); setTimeout(() => K.solve(p), 400); return; }
        if (p.m >= p.k) { p.pos = p.st; p.m = 0; W.chess.render(p); K.fail(tr('chessOver')); return; }
        W.chess.render(p);
      }; });
    },
    hint: () => tr('chessH')
  };
})();

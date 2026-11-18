// Énigmes festives : Halloween (gobelets, fantômes, crochetage, toile d'araignée, tombes, costume)
// et Noël (cloches, guirlande, traîneau sur la glace, recette, calendrier de l'Avent, patron de cube).
(() => {
  'use strict';
  const K = window.GameKit, { rand, shuffle } = window.Logic, W = K.W, $ = K.$;
  const G = () => K.G, tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s), lvl = () => K.G.lvl;
  const box = () => $('#pzb');
  const T = (fr, en, vi) => ({ fr, en, vi });

  const UI = {
    fr: { shWatch: 'Regarde bien où est la bille…', shPick: 'Sous quel gobelet est la bille ?', shStart: '▶ Mélanger', shH: 'Le mélange sera plus lent.', catchGo: '▶ Commencer', caught: 'Attrapés : {n} / {m}', missed2: 'Échappés : {n} / {m}', catchLost: 'Trop de fantômes se sont échappés !',
      pinTest: 'Tester', pinTries: 'Essais restants : {n}', pinLost: 'La serrure se bloque… les goupilles changent !', pinH: 'La première goupille est à la hauteur {x}.', pathSum: 'Somme du chemin : {s} / objectif {t}', pathH: 'Commence par la case surlignée.',
      minesLeft: 'Tombes à éviter : {n}', minesBoom: 'Un fantôme surgit de la tombe ! Tout recommence.', minesH: 'Un chiffre indique combien de tombes hantées touchent la case (même en diagonale). Clic droit pour marquer.',
      outfitH: 'Commence par les indices qui affirment quelque chose (et non ceux qui excluent).', bellH: 'La cloche la plus grave est la n° {x}.', bellOrder: 'Du plus grave ➜ au plus aigu', graphH: 'Une boule a été colorée pour toi.',
      run: '▶ Lancer', clearP: '⌫', progLen: 'Commandes : {n} / {m}', progBad: 'Le traîneau n’est pas arrivé au cadeau. On recommence !', progH: 'Premier mouvement : {x}.', recipeQ: 'Question {n} / {m}', chainH: 'Après la première opération, on obtient {x}.', cubeQ: 'Quand le cube est plié, quelle face se trouve en face de {x} ?', cubeH: 'C’est {x}.' },
    en: { shWatch: 'Watch where the ball goes…', shPick: 'Which cup is the ball under?', shStart: '▶ Shuffle', shH: 'The shuffle will be slower.', catchGo: '▶ Start', caught: 'Caught: {n} / {m}', missed2: 'Escaped: {n} / {m}', catchLost: 'Too many ghosts escaped!',
      pinTest: 'Test', pinTries: 'Tries left: {n}', pinLost: 'The lock jams… the pins change!', pinH: 'The first pin is at height {x}.', pathSum: 'Path total: {s} / target {t}', pathH: 'Start with the highlighted square.',
      minesLeft: 'Graves to avoid: {n}', minesBoom: 'A ghost bursts out of the grave! Start again.', minesH: 'A number shows how many haunted graves touch the square (diagonals too). Right-click to mark.',
      outfitH: 'Start with the clues that state something (not the ones that rule things out).', bellH: 'The lowest bell is no. {x}.', bellOrder: 'Lowest ➜ highest', graphH: 'A bauble has been coloured for you.',
      run: '▶ Run', clearP: '⌫', progLen: 'Commands: {n} / {m}', progBad: 'The sleigh didn’t reach the present. Try again!', progH: 'First move: {x}.', recipeQ: 'Question {n} / {m}', chainH: 'After the first operation you get {x}.', cubeQ: 'When the cube is folded, which face is opposite {x}?', cubeH: 'It is {x}.' },
    vi: { shWatch: 'Nhìn kỹ viên bi đi đâu…', shPick: 'Viên bi nằm dưới cốc nào?', shStart: '▶ Xáo cốc', shH: 'Lần xáo sẽ chậm hơn.', catchGo: '▶ Bắt đầu', caught: 'Đã bắt: {n} / {m}', missed2: 'Trốn thoát: {n} / {m}', catchLost: 'Quá nhiều con ma đã trốn thoát!',
      pinTest: 'Thử', pinTries: 'Lượt thử còn lại: {n}', pinLost: 'Ổ khóa bị kẹt… các chốt đổi vị trí!', pinH: 'Chốt đầu tiên ở độ cao {x}.', pathSum: 'Tổng đường đi: {s} / mục tiêu {t}', pathH: 'Bắt đầu từ ô được tô sáng.',
      minesLeft: 'Số mộ cần tránh: {n}', minesBoom: 'Một con ma vọt ra khỏi mộ! Làm lại từ đầu.', minesH: 'Mỗi con số cho biết có bao nhiêu ngôi mộ bị ám quanh ô đó (kể cả đường chéo). Bấm chuột phải để đánh dấu.',
      outfitH: 'Bắt đầu với những gợi ý khẳng định (không phải những gợi ý loại trừ).', bellH: 'Chiếc chuông trầm nhất là số {x}.', bellOrder: 'Trầm nhất ➜ cao nhất', graphH: 'Một quả châu đã được tô màu giúp bạn.',
      run: '▶ Chạy', clearP: '⌫', progLen: 'Lệnh: {n} / {m}', progBad: 'Xe trượt chưa đến chỗ món quà. Thử lại nhé!', progH: 'Bước đầu tiên: {x}.', recipeQ: 'Câu {n} / {m}', chainH: 'Sau phép tính đầu tiên, ta được {x}.', cubeQ: 'Khi gấp thành hình lập phương, mặt nào đối diện với {x}?', cubeH: 'Đó là {x}.' }
  };
  const PZ = {
    fr: {
      shells: { t: 'Les gobelets de la voyante', i: 'Suis la bille des yeux pendant que les gobelets se mélangent, puis clique sur le bon.', h: 'Ne regarde que le gobelet de la bille, pas les autres.' },
      catch: { t: 'Les fantômes', i: 'Clique sur les fantômes avant qu’ils ne disparaissent.', h: 'Garde les yeux au centre de la grille pour tout voir d’un coup.' },
      pins: { t: 'La serrure à goupilles', i: 'Règle la hauteur de chaque goupille, puis teste : ✓ = bonne hauteur, ↑ = trop bas, ↓ = trop haut.', h: 'Prends toujours le milieu de ce qui reste possible.' },
      pathsum: { t: 'La toile d’araignée', i: 'Descends de la première à la dernière rangée (tout droit ou en diagonale) pour que la somme des cases fasse exactement l’objectif.', h: 'Pars du bas : quelles cases peuvent encore atteindre l’objectif ?' },
      mines: { t: 'Les tombes hantées', i: 'Découvre toutes les tombes paisibles sans réveiller les fantômes. Les chiffres comptent les tombes hantées voisines.', h: 'Un « 0 » libère automatiquement ses voisines. Repère les chiffres égaux au nombre de cases cachées autour.' },
      outfit: { t: 'Le costume du fantôme', i: 'Grâce aux témoignages, reconstitue le costume d’Edgar : choisis un élément par catégorie.', h: 'Barre ce qui est exclu dans chaque catégorie : il n’en reste qu’un.' },
      pitch: { t: 'Les cloches', i: 'Écoute chaque cloche, puis clique-les dans l’ordre, de la plus grave à la plus aiguë.', h: 'Compare les cloches deux par deux.' },
      graph: { t: 'La guirlande', i: 'Colore les boules : deux boules reliées par un fil ne doivent jamais avoir la même couleur. Clique pour changer de couleur.', h: 'Commence là où il y a le plus de fils.' },
      program: { t: 'Le traîneau sur la glace', i: 'Programme les déplacements du traîneau, puis lance-le. Sur la glace, il glisse jusqu’au prochain obstacle !', h: 'Cherche d’abord les obstacles qui peuvent arrêter le traîneau près du cadeau.' },
      recipe: { t: 'La recette des biscuits', i: 'Adapte la recette au nombre de lutins et réponds aux questions.', h: 'Calcule d’abord la quantité pour un seul lutin.' },
      chain: { t: 'Le calendrier de l’Avent', i: 'Fais les calculs dans l’ordre, de case en case, et donne le dernier résultat.', h: 'Écris chaque résultat intermédiaire.' },
      cube: { t: 'Le papier cadeau', i: 'Ce patron se plie en cube autour du cadeau. Trouve la face opposée.', h: 'Deux cases séparées par une seule case, sur une même ligne, sont opposées.' }
    },
    en: {
      shells: { t: 'The Fortune Teller’s Cups', i: 'Follow the ball with your eyes while the cups are shuffled, then click the right one.', h: 'Watch only the cup with the ball, not the others.' },
      catch: { t: 'The Ghosts', i: 'Click the ghosts before they vanish.', h: 'Keep your eyes on the centre of the grid to see everything at once.' },
      pins: { t: 'The Pin Lock', i: 'Set the height of each pin, then test: ✓ = right height, ↑ = too low, ↓ = too high.', h: 'Always pick the middle of what is still possible.' },
      pathsum: { t: 'The Spider Web', i: 'Go down from the first to the last row (straight or diagonally) so that the squares add up exactly to the target.', h: 'Work from the bottom: which squares can still reach the target?' },
      mines: { t: 'The Haunted Graves', i: 'Uncover every peaceful grave without waking the ghosts. Numbers count the neighbouring haunted graves.', h: 'A “0” opens its neighbours automatically. Look for numbers equal to the hidden squares around them.' },
      outfit: { t: 'The Ghost’s Costume', i: 'Using the witnesses, rebuild Edgar’s costume: pick one item per category.', h: 'Cross out what is ruled out in each category: only one remains.' },
      pitch: { t: 'The Bells', i: 'Listen to each bell, then click them in order, from lowest to highest.', h: 'Compare the bells two at a time.' },
      graph: { t: 'The Garland', i: 'Colour the baubles: two baubles joined by a string must never share a colour. Click to change colour.', h: 'Start where there are the most strings.' },
      program: { t: 'The Sleigh on the Ice', i: 'Program the sleigh’s moves, then launch it. On ice, it slides until the next obstacle!', h: 'First look for obstacles that can stop the sleigh next to the present.' },
      recipe: { t: 'The Cookie Recipe', i: 'Scale the recipe to the number of elves and answer the questions.', h: 'Work out the amount for a single elf first.' },
      chain: { t: 'The Advent Calendar', i: 'Do the sums in order, door by door, and give the final result.', h: 'Write down each intermediate result.' },
      cube: { t: 'The Wrapping Paper', i: 'This net folds into a cube around the present. Find the opposite face.', h: 'Two squares separated by exactly one square in a straight line are opposite.' }
    },
    vi: {
      shells: { t: 'Những chiếc cốc của bà thầy bói', i: 'Dõi theo viên bi khi các cốc được xáo, rồi bấm vào cốc đúng.', h: 'Chỉ nhìn chiếc cốc có viên bi thôi.' },
      catch: { t: 'Những con ma', i: 'Bấm vào những con ma trước khi chúng biến mất.', h: 'Hãy nhìn vào giữa lưới để thấy tất cả cùng lúc.' },
      pins: { t: 'Ổ khóa chốt', i: 'Chỉnh độ cao từng chốt rồi thử: ✓ = đúng, ↑ = thấp quá, ↓ = cao quá.', h: 'Luôn chọn giá trị ở giữa khoảng còn lại.' },
      pathsum: { t: 'Mạng nhện', i: 'Đi từ hàng đầu xuống hàng cuối (thẳng hoặc chéo) sao cho tổng các ô đúng bằng mục tiêu.', h: 'Hãy nghĩ từ dưới lên: những ô nào còn có thể đạt mục tiêu?' },
      mines: { t: 'Những ngôi mộ bị ám', i: 'Mở hết những ngôi mộ yên bình mà không đánh thức các con ma. Con số đếm số mộ bị ám ở xung quanh.', h: 'Ô « 0 » tự mở các ô xung quanh. Tìm những con số bằng đúng số ô còn ẩn quanh nó.' },
      outfit: { t: 'Bộ trang phục của con ma', i: 'Dựa vào lời nhân chứng, ghép lại trang phục của Edgar: chọn một món mỗi loại.', h: 'Gạch những món bị loại ở mỗi loại: chỉ còn lại một.' },
      pitch: { t: 'Những chiếc chuông', i: 'Nghe từng chiếc chuông, rồi bấm theo thứ tự từ trầm nhất đến cao nhất.', h: 'So sánh từng cặp chuông một.' },
      graph: { t: 'Dây đèn trang trí', i: 'Tô màu các quả châu: hai quả nối với nhau không được cùng màu. Bấm để đổi màu.', h: 'Bắt đầu từ chỗ có nhiều dây nối nhất.' },
      program: { t: 'Xe trượt trên băng', i: 'Lập trình các bước đi của xe trượt rồi cho chạy. Trên băng, xe trượt mãi đến khi gặp vật cản!', h: 'Trước hết hãy tìm những vật cản có thể chặn xe ngay cạnh món quà.' },
      recipe: { t: 'Công thức bánh quy', i: 'Điều chỉnh công thức theo số chú lùn rồi trả lời các câu hỏi.', h: 'Hãy tính lượng cho một chú lùn trước.' },
      chain: { t: 'Lịch Mùa Vọng', i: 'Tính lần lượt từng ô, theo thứ tự, rồi cho kết quả cuối cùng.', h: 'Ghi lại từng kết quả trung gian.' },
      cube: { t: 'Giấy gói quà', i: 'Tấm giấy này gấp thành hình lập phương quanh món quà. Tìm mặt đối diện.', h: 'Hai ô cách nhau đúng một ô trên cùng một hàng thẳng thì đối diện nhau.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ================= Gobelets =================
  W.shells = {
    init(p) { p.n = [3, 4, 5][lvl()]; p.rounds = [1, 2, 3][lvl()]; p.r = 0; p.ready = false; p.slow = 1; },
    render(p) {
      box().innerHTML = `<p class="cnt" id="shmsg">${tr('round', { n: p.r + 1, m: p.rounds })} — ${tr('shWatch')}</p><div class="cups" style="--n:${p.n}">${Array.from({ length: p.n }, (_, i) => `<button class="cup" data-i="${i}" style="left:${i * 100 / p.n}%">🥤</button>`).join('')}<span class="ball" id="ball">🔮</span></div><div class="row"><button class="btn gold" id="shgo">${tr('shStart')}</button></div>`;
      p.pos = [...Array(p.n).keys()]; p.ballCup = rand(p.n); p.ready = false;
      const ball = $('#ball'); ball.style.left = `calc(${p.ballCup * 100 / p.n}% + ${50 / p.n}% - 14px)`;
      $('#shgo').onclick = () => {
        $('#shgo').disabled = true; ball.style.opacity = '0'; const cups = box().querySelectorAll('.cup'); const sp = [600, 450, 320][lvl()] * p.slow; let k = 0, n = [5, 8, 12][lvl()];
        const step = () => {
          if (!cups[0].isConnected) return;
          if (k++ >= n) { p.ready = true; $('#shmsg').textContent = tr('shPick'); return; }
          const a = rand(p.n); let b; do { b = rand(p.n); } while (b === a);
          const ia = p.pos.indexOf(a), ib = p.pos.indexOf(b); [p.pos[ia], p.pos[ib]] = [p.pos[ib], p.pos[ia]];
          cups.forEach((c, i) => { c.style.transition = `left ${sp}ms`; c.style.left = (p.pos.indexOf(i) * 100 / p.n) + '%'; });
          K.beep(300 + k * 20, .05, 'triangle', .04); setTimeout(step, sp + 40);
        };
        setTimeout(step, 400);
      };
      box().querySelectorAll('.cup').forEach(c => { c.onclick = () => {
        if (!p.ready) return; p.ready = false; const i = +c.dataset.i;
        ball.style.left = `calc(${p.pos.indexOf(p.ballCup) * 100 / p.n}% + ${50 / p.n}% - 14px)`; ball.style.opacity = '1';
        if (i !== p.ballCup) { setTimeout(() => { W.shells.render(p); K.fail(); }, 900); return; }
        K.beep(880, .12, 'triangle', .1); if (++p.r >= p.rounds) { p.r--; setTimeout(() => K.solve(p), 700); return; } setTimeout(() => W.shells.render(p), 900);
      }; });
    },
    onHint2(p) { p.slow = 1.8; },
    hint: () => tr('shH')
  };

  // ================= Fantômes =================
  W.catch = {
    init(p) { p.n = [3, 4, 4][lvl()]; p.need = [8, 10, 12][lvl()]; p.maxMiss = [6, 4, 3][lvl()]; p.life = [1100, 850, 650][lvl()]; p.ok = 0; p.miss = 0; p.on = false; },
    render(p) {
      box().innerHTML = `<div class="ghosts" style="--n:${p.n}">${Array.from({ length: p.n * p.n }, (_, i) => `<button class="gh" data-i="${i}"></button>`).join('')}</div><p class="cnt" id="ghs">${tr('caught', { n: p.ok, m: p.need })} · ${tr('missed2', { n: p.miss, m: p.maxMiss })}</p><div class="row"><button class="btn gold" id="ghgo">${tr('catchGo')}</button></div>`;
      const cells = box().querySelectorAll('.gh'), upd = () => { const s = $('#ghs'); if (s) s.textContent = `${tr('caught', { n: p.ok, m: p.need })} · ${tr('missed2', { n: p.miss, m: p.maxMiss })}`; };
      const spawn = () => {
        if (!p.on || !cells[0].isConnected) return;
        const i = rand(cells.length), c = cells[i]; if (c.classList.contains('up')) { setTimeout(spawn, 120); return; }
        c.classList.add('up'); c.textContent = '👻';
        c.t = setTimeout(() => { if (!c.classList.contains('up')) return; c.classList.remove('up'); c.textContent = ''; p.miss++; upd(); if (p.miss >= p.maxMiss) { p.on = false; W.catch.init(p); W.catch.render(p); K.fail(tr('catchLost')); } }, p.life);
        setTimeout(spawn, p.life * (.5 + Math.random() * .5));
      };
      cells.forEach(c => { c.onclick = () => { if (!c.classList.contains('up')) return; clearTimeout(c.t); c.classList.remove('up'); c.textContent = '✨'; setTimeout(() => { if (!c.classList.contains('up')) c.textContent = ''; }, 250); p.ok++; K.beep(700 + p.ok * 30, .06, 'triangle', .07); upd(); if (p.ok >= p.need) { p.on = false; setTimeout(() => K.solve(p), 400); } }; });
      $('#ghgo').onclick = () => { if (p.on) return; p.ok = 0; p.miss = 0; upd(); p.on = true; $('#ghgo').disabled = true; setTimeout(spawn, 500); };
    }
  };

  // ================= Serrure à goupilles =================
  W.pins = {
    init(p) { p.n = [3, 4, 5][lvl()]; p.max = [5, 7, 9][lvl()]; p.code = Array.from({ length: p.n }, () => 1 + rand(p.max)); p.cur = Array(p.n).fill(1); p.fb = Array(p.n).fill(''); p.tries = [8, 7, 6][lvl()]; },
    render(p) {
      box().innerHTML = `<div class="pins">${p.cur.map((v, i) => `<div class="pin"><button class="btn" data-i="${i}" data-d="1">▲</button><div class="pinbar"><i style="height:${v / p.max * 100}%"></i><b>${v}</b></div><button class="btn" data-i="${i}" data-d="-1">▼</button><em class="${p.fb[i] === '✓' ? 'ok' : ''}">${p.fb[i]}</em></div>`).join('')}</div>
        <p class="cnt">${tr('pinTries', { n: p.tries })}</p><div class="row"><button class="btn gold" id="ok">${tr('pinTest')}</button></div>`;
      box().querySelectorAll('.pin .btn').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.cur[i] = Math.max(1, Math.min(p.max, p.cur[i] + +b.dataset.d)); K.beep(400 + p.cur[i] * 40, .03, 'square', .04); W.pins.render(p); }; });
      $('#ok').onclick = () => {
        p.fb = p.cur.map((v, i) => v === p.code[i] ? '✓' : v < p.code[i] ? '↑' : '↓'); p.tries--; K.beep(220, .1, 'square', .06);
        if (p.fb.every(x => x === '✓')) { W.pins.render(p); setTimeout(() => K.solve(p), 400); return; }
        if (p.tries <= 0) { W.pins.init(p); W.pins.render(p); K.fail(tr('pinLost')); return; }
        W.pins.render(p);
      };
    },
    hint: p => tr('pinH', { x: p.code[0] })
  };

  // ================= Toile d'araignée (somme de chemin) =================
  W.pathsum = {
    init(p) {
      const n = [4, 5, 6][lvl()]; p.n = n; p.g = Array.from({ length: n * n }, () => 1 + rand(9));
      let c = rand(n); p.sol = [c]; for (let r = 1; r < n; r++) { c = Math.max(0, Math.min(n - 1, c + rand(3) - 1)); p.sol.push(c); }
      p.t = p.sol.reduce((s, c2, r) => s + p.g[r * n + c2], 0); p.path = [];
    },
    render(p) {
      const n = p.n, sum = p.path.reduce((s, c, r) => s + p.g[r * n + c], 0), r0 = p.path.length;
      box().innerHTML = `<div class="web" style="--n:${n}">${p.g.map((v, i) => { const r = Math.floor(i / n), c = i % n, on = p.path[r] === c, can = r === r0 && (r0 === 0 || Math.abs(c - p.path[r0 - 1]) <= 1);
        return `<button class="wb2${on ? ' on' : ''}${can ? ' can' : ''}${p.hl >= 2 && r0 === 0 && r === 0 && c === p.sol[0] ? ' tip' : ''}" data-i="${i}">${v}</button>`; }).join('')}</div>
        <p class="goal">🕸️ ${tr('pathSum', { s: sum, t: p.t })}</p><div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.wb2').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i, r = Math.floor(i / n), c = i % n;
        if (r !== p.path.length || (r && Math.abs(c - p.path[r - 1]) > 1)) return;
        p.path.push(c); K.beep(400 + r * 60, .05, 'triangle', .05);
        if (p.path.length === n) { const s = p.path.reduce((a, cc, rr) => a + p.g[rr * n + cc], 0); if (s === p.t) { W.pathsum.render(p); setTimeout(() => K.solve(p), 400); return; } p.path = []; W.pathsum.render(p); K.fail(); return; }
        W.pathsum.render(p);
      }; });
      $('#rs').onclick = () => { p.path = []; W.pathsum.render(p); };
    },
    hint: () => tr('pathH')
  };

  // ================= Tombes hantées (démineur) =================
  W.mines = {
    init(p) { p.n = [5, 6, 7][lvl()]; p.m = [3, 5, 8][lvl()]; p.bomb = null; p.open = Array(p.n * p.n).fill(0); p.flag = Array(p.n * p.n).fill(0); },
    nb(p, i) { const n = p.n, r = Math.floor(i / n), c = i % n, o = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < n && cc >= 0 && cc < n) o.push(rr * n + cc); } return o; },
    reveal(p, i) { if (p.open[i]) return; p.open[i] = 1; p.flag[i] = 0; if (!p.bomb.has(i) && !W.mines.nb(p, i).some(j => p.bomb.has(j))) W.mines.nb(p, i).forEach(j => W.mines.reveal(p, j)); },
    render(p) {
      const n = p.n, cnt = i => W.mines.nb(p, i).filter(j => p.bomb && p.bomb.has(j)).length;
      box().innerHTML = `<div class="graves" style="--n:${n}">${p.open.map((o, i) => `<button class="gv2${o ? ' op' : ''}${p.flag[i] ? ' fl' : ''}" data-i="${i}">${o ? (cnt(i) || '') : p.flag[i] ? '🚩' : '🪦'}</button>`).join('')}</div><p class="cnt">${tr('minesLeft', { n: p.m })}</p>`;
      box().querySelectorAll('.gv2').forEach(b => {
        const i = +b.dataset.i;
        b.onclick = () => {
          if (p.open[i] || p.flag[i]) return;
          if (!p.bomb) { const safe = new Set([i, ...W.mines.nb(p, i)]); p.bomb = new Set(shuffle([...Array(n * n).keys()].filter(j => !safe.has(j))).slice(0, p.m)); }
          if (p.bomb.has(i)) { K.beep(90, .4, 'sawtooth', .1); W.mines.init(p); W.mines.render(p); K.fail(tr('minesBoom')); return; }
          W.mines.reveal(p, i); K.beep(500, .03, 'triangle', .05);
          if (p.open.filter(Boolean).length === n * n - p.m) { W.mines.render(p); setTimeout(() => K.solve(p), 400); return; }
          W.mines.render(p);
        };
        b.oncontextmenu = e => { e.preventDefault(); if (p.open[i]) return; p.flag[i] ^= 1; W.mines.render(p); };
      });
    },
    hint: () => tr('minesH')
  };

  // ================= Costume du fantôme =================
  const OUT = [
    { k: T('Chapeau', 'Hat', 'Mũ'), o: [['🎩', T('haut-de-forme', 'top hat', 'mũ chóp cao')], ['👒', T('chapeau à fleurs', 'flowery hat', 'mũ hoa')], ['🧢', T('casquette', 'cap', 'mũ lưỡi trai')], ['👑', T('couronne', 'crown', 'vương miện')]] },
    { k: T('Masque', 'Mask', 'Mặt nạ'), o: [['🎭', T('masque de théâtre', 'theatre mask', 'mặt nạ sân khấu')], ['💀', T('crâne', 'skull', 'đầu lâu')], ['👺', T('masque de démon', 'demon mask', 'mặt nạ quỷ')], ['🤡', T('nez de clown', 'clown nose', 'mũi hề')]] },
    { k: T('Cape', 'Cape', 'Áo choàng'), o: [['🟥', T('cape rouge', 'red cape', 'áo choàng đỏ')], ['⬛', T('cape noire', 'black cape', 'áo choàng đen')], ['🟧', T('cape orange', 'orange cape', 'áo choàng cam')], ['🟪', T('cape violette', 'purple cape', 'áo choàng tím')]] },
    { k: T('Accessoire', 'Prop', 'Đạo cụ'), o: [['🧹', T('balai', 'broom', 'cây chổi')], ['🪄', T('baguette', 'wand', 'đũa phép')], ['🔦', T('lampe', 'torch', 'đèn pin')], ['🍭', T('sucette', 'lollipop', 'kẹo mút')]] }
  ];
  const OCL = { yes: T('Un témoin est sûr : {x}.', 'One witness is sure: {x}.', 'Một nhân chứng chắc chắn: {x}.'), no2: T('Ce n’était ni {x} ni {y}.', 'It was neither {x} nor {y}.', 'Không phải {x}, cũng không phải {y}.'), no1: T('Ce n’était pas {x}.', 'It was not {x}.', 'Không phải {x}.') };
  W.outfit = {
    init(p) {
      const lv = lvl(), cats = OUT.slice(0, lv === 2 ? 4 : 3); p.cats = cats; p.sol = cats.map(() => rand(4)); p.sel = cats.map(() => -1);
      p.clues = []; cats.forEach((c, k) => {
        const others = shuffle([0, 1, 2, 3].filter(i => i !== p.sol[k]));
        if (lv === 0 && k === 0) p.clues.push({ t: 'yes', k, a: p.sol[k] });
        else { p.clues.push({ t: 'no2', k, a: others[0], b: others[1] }); p.clues.push({ t: 'no1', k, a: others[2] }); }
      });
      p.clues = shuffle(p.clues);
    },
    render(p) {
      const nm = (k, i) => X(p.cats[k].o[i][1]);
      box().innerHTML = `<ul class="clues">${p.clues.map(c => `<li>${esc(X(OCL[c.t]).replace('{x}', nm(c.k, c.a)).replace('{y}', c.b != null ? nm(c.k, c.b) : ''))}</li>`).join('')}</ul>
        <div class="outfit">${p.cats.map((c, k) => `<div><b>${esc(X(c.k))}</b><div>${c.o.map(([e, n], i) => `<button class="btn of${p.sel[k] === i ? ' on' : ''}" data-k="${k}" data-i="${i}" title="${esc(X(n))}">${e}</button>`).join('')}</div></div>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${tr('check')}</button></div>`;
      box().querySelectorAll('.of').forEach(b => { b.onclick = () => { p.sel[+b.dataset.k] = +b.dataset.i; K.beep(520, .04, 'triangle', .05); W.outfit.render(p); }; });
      $('#ok').onclick = () => { if (p.sel.every((v, k) => v === p.sol[k])) K.solve(p); else K.fail(); };
    },
    hint: () => tr('outfitH')
  };

  // ================= Cloches (ordre des hauteurs) =================
  const BF = [262, 294, 330, 392, 440, 523, 587, 659, 784];
  W.pitch = {
    init(p) { const n = [4, 5, 6][lvl()]; p.f = shuffle(BF).slice(0, n); p.pick = []; },
    ring: f => { K.beep(f, .9, 'sine', .14); K.beep(f * 2.01, .5, 'sine', .04); },
    render(p) {
      const order = p.f.map((f, i) => i).sort((a, b) => p.f[a] - p.f[b]);
      box().innerHTML = `<p class="cnt">${tr('bellOrder')}</p><div class="bells">${p.f.map((f, i) => `<div class="bell${p.pick.includes(i) ? ' used' : ''}${p.hl >= 2 && i === order[0] ? ' tip' : ''}"><button class="ring" data-i="${i}">🔔<small>${i + 1}</small></button><button class="btn pk" data-i="${i}" ${p.pick.includes(i) ? 'disabled' : ''}>${p.pick.includes(i) ? p.pick.indexOf(i) + 1 : '＋'}</button></div>`).join('')}</div>
        <div class="row"><button class="btn" id="rs">↺ ${tr('reset')}</button></div>`;
      box().querySelectorAll('.ring').forEach(b => { b.onclick = () => { W.pitch.ring(p.f[+b.dataset.i]); b.classList.remove('swing'); void b.offsetWidth; b.classList.add('swing'); }; });
      box().querySelectorAll('.pk').forEach(b => { b.onclick = () => {
        p.pick.push(+b.dataset.i); W.pitch.ring(p.f[+b.dataset.i]);
        if (p.pick.length === p.f.length) { if (p.pick.every((v, k) => v === order[k])) { W.pitch.render(p); setTimeout(() => K.solve(p), 500); return; } p.pick = []; W.pitch.render(p); K.fail(); return; }
        W.pitch.render(p);
      }; });
      $('#rs').onclick = () => { p.pick = []; W.pitch.render(p); };
    },
    hint: p => tr('bellH', { x: p.f.indexOf(Math.min(...p.f)) + 1 })
  };

  // ================= Guirlande (coloriage de graphe) =================
  const GC = ['#d33a2c', '#2e9a4a', '#e8b830'];
  W.graph = {
    init(p) {
      const n = [6, 8, 10][lvl()]; p.n = n; p.sol = [rand(3)];
      for (let i = 1; i < n; i++) { const opts = [0, 1, 2].filter(c => c !== p.sol[i - 1] && (i < n - 1 || c !== p.sol[0])); p.sol.push(opts[rand(opts.length)]); }
      p.e = []; for (let i = 0; i < n; i++) p.e.push([i, (i + 1) % n]);
      for (let k = 0; k < n * [1, 1.5, 2][lvl()]; k++) { const a = rand(n), b = rand(n); if (a !== b && p.sol[a] !== p.sol[b] && !p.e.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) p.e.push([a, b]); }
      p.fix = new Set(shuffle([...Array(n).keys()]).slice(0, [3, 2, 1][lvl()])); p.c = p.sol.map((v, i) => p.fix.has(i) ? v : -1);
    },
    render(p) {
      const n = p.n, P = i => [50 + 40 * Math.cos(i * 2 * Math.PI / n - Math.PI / 2), 50 + 40 * Math.sin(i * 2 * Math.PI / n - Math.PI / 2)];
      const bad = new Set(); p.e.forEach(([a, b]) => { if (p.c[a] >= 0 && p.c[a] === p.c[b]) { bad.add(a); bad.add(b); } });
      box().innerHTML = `<svg class="garl" viewBox="0 0 100 100">${p.e.map(([a, b]) => `<line x1="${P(a)[0]}" y1="${P(a)[1]}" x2="${P(b)[0]}" y2="${P(b)[1]}" class="${bad.has(a) && bad.has(b) && p.c[a] === p.c[b] ? 'bad' : ''}"/>`).join('')}
        ${p.c.map((c, i) => `<g class="bl${p.fix.has(i) ? ' fx' : ''}" data-i="${i}"><circle cx="${P(i)[0]}" cy="${P(i)[1]}" r="6" fill="${c < 0 ? '#e9e4d6' : GC[c]}"/><circle cx="${P(i)[0] - 2}" cy="${P(i)[1] - 2}" r="1.6" fill="#fff8"/></g>`).join('')}</svg>`;
      box().querySelectorAll('.bl:not(.fx)').forEach(g => { g.onclick = () => {
        const i = +g.dataset.i; p.c[i] = p.c[i] >= 2 ? -1 : p.c[i] + 1; K.beep(600 + p.c[i] * 100, .05, 'triangle', .06);
        const ok = p.c.every(c => c >= 0) && p.e.every(([a, b]) => p.c[a] !== p.c[b]);
        W.graph.render(p); if (ok) setTimeout(() => K.solve(p), 500);
      }; });
    },
    onHint2(p) { const i = p.c.findIndex((c, k) => c !== p.sol[k] && !p.fix.has(k)); if (i >= 0) { p.c[i] = p.sol[i]; p.fix.add(i); } },
    hint: () => tr('graphH')
  };

  // ================= Traîneau sur la glace (programmation) =================
  const DV = [[-1, 0], [0, 1], [1, 0], [0, -1]], ARR = ['↑', '→', '↓', '←'];
  const slide = (P, pos, d) => { const n = P.n; let [r, c] = [Math.floor(pos / n), pos % n]; for (;;) { const rr = r + DV[d][0], cc = c + DV[d][1]; if (rr < 0 || rr >= n || cc < 0 || cc >= n || P.wall.has(rr * n + cc)) break; r = rr; c = cc; if (r * n + c === P.goal) break; } return r * n + c; };
  W.program = {
    init(p) {
      const lv = lvl(), n = [5, 6, 7][lv], minM = [3, 4, 5][lv];
      for (let t = 0; t < 2000; t++) {
        const wall = new Set(shuffle([...Array(n * n).keys()]).slice(0, [4, 6, 9][lv])); const free = [...Array(n * n).keys()].filter(i => !wall.has(i)); const start = free[rand(free.length)], goal = free[rand(free.length)]; if (start === goal) continue;
        const P = { n, wall, start, goal }, prev = new Map([[start, null]]), q = [start]; let found = null;
        while (q.length) { const s = q.shift(); if (s === goal) { found = s; break; } for (let d = 0; d < 4; d++) { const s2 = slide(P, s, d); if (!prev.has(s2)) { prev.set(s2, [s, d]); q.push(s2); } } }
        if (found == null) continue; const path = []; let k = goal; while (prev.get(k)) { path.unshift(prev.get(k)[1]); k = prev.get(k)[0]; }
        if (path.length >= minM && path.length <= minM + 2) { Object.assign(p, P, { sol: path, max: path.length + [3, 2, 1][lv], prog: [], pos: start }); return; }
      }
    },
    render(p) {
      const n = p.n;
      box().innerHTML = `<div class="ice" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => `<div class="ic${p.wall.has(i) ? ' w' : ''}">${i === p.pos ? '🛷' : i === p.goal ? '🎁' : p.wall.has(i) ? '🌲' : ''}</div>`).join('')}</div>
        <div class="prog2">${p.prog.map(d => `<span>${ARR[d]}</span>`).join('') || '<em>…</em>'}</div><p class="cnt">${tr('progLen', { n: p.prog.length, m: p.max })}</p>
        <div class="row">${ARR.map((a, d) => `<button class="btn ar" data-d="${d}">${a}</button>`).join('')}<button class="btn" id="pclr">${tr('clearP')}</button><button class="btn gold" id="prun">${tr('run')}</button></div>`;
      box().querySelectorAll('.ar').forEach(b => { b.onclick = () => { if (p.prog.length < p.max) { p.prog.push(+b.dataset.d); K.beep(500, .03, 'square', .04); W.program.render(p); } }; });
      $('#pclr').onclick = () => { p.prog.pop(); W.program.render(p); };
      $('#prun').onclick = () => {
        if (!p.prog.length) return; const steps = p.prog.slice(); box().querySelectorAll('button').forEach(b => { b.disabled = true; });
        const go = () => {
          if (!steps.length) { if (p.pos === p.goal) setTimeout(() => K.solve(p), 300); else { p.pos = p.start; p.prog = []; W.program.render(p); K.fail(tr('progBad')); } return; }
          p.pos = slide(p, p.pos, steps.shift()); K.beep(260, .2, 'sine', .07); W.program.render(p); box().querySelectorAll('button').forEach(b => { b.disabled = true; });
          if (p.pos === p.goal) { setTimeout(() => K.solve(p), 500); return; } setTimeout(go, 450);
        };
        go();
      };
    },
    hint: p => tr('progH', { x: ARR[p.sol[0]] })
  };

  // ================= Recette de biscuits =================
  const ING = [[T('farine', 'flour', 'bột mì'), 'g', 60], [T('beurre', 'butter', 'bơ'), 'g', 25], [T('sucre', 'sugar', 'đường'), 'g', 20], [T('œufs', 'eggs', 'quả trứng'), '', 1], [T('pépites de chocolat', 'chocolate chips', 'sô-cô-la chip'), 'g', 15], [T('gingembre', 'ginger', 'gừng'), 'g', 2]];
  W.recipe = {
    init(p) { const lv = lvl(); p.base = [2, 4, 6][lv]; p.ings = shuffle([...ING.keys()]).slice(0, 4); p.qs = shuffle(p.ings).slice(0, [1, 2, 3][lv]).map(k => ({ k })); p.r = 0; },
    amount: (p, k, people) => ING[k][2] * people / 2,
    render(p) {
      const lv = lvl(), elves = [4, 12, 18][lv], q = p.qs[p.r], u = ING[q.k][1];
      const head = { fr: `Recette pour ${p.base} lutins :`, en: `Recipe for ${p.base} elves:`, vi: `Công thức cho ${p.base} chú lùn:` }[K.api.lang()];
      const ask = { fr: `Combien ${/^[aeiouœéè]/i.test(X(ING[q.k][0])) ? "d’" : "de "}${X(ING[q.k][0])}${u ? ' (en ' + u + ')' : ''} pour ${elves} lutins ?`, en: `How much ${X(ING[q.k][0])}${u ? ' (in ' + u + ')' : ''} for ${elves} elves?`, vi: `Cần bao nhiêu ${X(ING[q.k][0])}${u ? ' (' + u + ')' : ''} cho ${elves} chú lùn?` }[K.api.lang()];
      p.ans = ING[q.k][2] * elves / 2;
      box().innerHTML = `<div class="recipe"><b>🍪 ${head}</b>${p.ings.map(k => `<div>${ING[k][2] * p.base / 2} ${ING[k][1]} ${esc(X(ING[k][0]))}</div>`).join('')}</div><p class="cnt">${tr('recipeQ', { n: p.r + 1, m: p.qs.length })}</p><p class="goal">${esc(ask)}</p>` + K.inputRow('number');
      const inp = $('#ans'), go = () => { const v = +String(inp.value).replace(',', '.'); if (!inp.value.trim()) return; if (Math.abs(v - p.ans) < .01) { K.beep(880, .1, 'triangle', .08); if (++p.r >= p.qs.length) { p.r--; K.solve(p); return; } W.recipe.render(p); } else { K.fail(); inp.select(); } };
      $('#ok').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
    },
    hint: () => K.L().pz.recipe.h
  };

  // ================= Calendrier de l'Avent (calcul en chaîne) =================
  W.chain = {
    init(p) {
      const lv = lvl(), n = [4, 5, 6][lv]; let v = 2 + rand(9); p.start = v; p.ops = [];
      for (let k = 0; k < n; k++) {
        const opts = ['+', '−', '×']; if (v % 2 === 0 || v % 3 === 0) opts.push('÷'); let o = opts[rand(opts.length)], a;
        if (o === '+') a = 2 + rand([9, 15, 25][lv]); if (o === '−') { if (v < 4) { o = '+'; a = 3 + rand(9); } else a = 1 + rand(Math.min(v - 1, 20)); } if (o === '×') a = 2 + rand(lv ? 4 : 2); if (o === '÷') { a = v % 3 === 0 && rand(2) ? 3 : (v % 2 === 0 ? 2 : 3); }
        v = o === '+' ? v + a : o === '−' ? v - a : o === '×' ? v * a : v / a; p.ops.push([o, a, v]);
      }
      p.ans = v;
    },
    render(p) {
      box().innerHTML = `<div class="advent"><span class="d0">${p.start}</span>${p.ops.map(([o, a], k) => `<i>➜</i><span class="d"><small>${k + 1}</small>${o} ${a}</span>`).join('')}<i>➜</i><span class="q">?</span></div>` + K.inputRow('number');
      K.bindInput(v => /^\s*-?\d+\s*$/.test(v) && +v === p.ans, p);
    },
    hint: p => tr('chainH', { x: p.ops[0][2] })
  };

  // ================= Patron de cube =================
  const CF = ['🎁', '⭐', '🎄', '❄️', '🔔', '🦌'];
  const fold = cells => {
    const key = (x, y) => x + ',' + y, set = new Map(cells.map((c, i) => [key(c[0], c[1]), i])), nrm = Array(cells.length), seen = new Set([0]);
    const neg = v => v.map(x => -x), st = [[0, [0, 0, -1], [1, 0, 0], [0, 1, 0]]]; nrm[0] = [0, 0, -1];
    while (st.length) {
      const [i, nv, u, v] = st.pop(), [x, y] = cells[i];
      [[1, 0, u, neg(nv), v], [-1, 0, neg(u), nv, v], [0, 1, v, u, neg(nv)], [0, -1, neg(v), u, nv]].forEach(([dx, dy, n2, u2, v2]) => {
        const j = set.get(key(x + dx, y + dy)); if (j == null || seen.has(j)) return; seen.add(j); nrm[j] = n2;
        st.push([j, n2, dx ? u2 : u, dy ? v2 : v]);
      });
    }
    return nrm;
  };
  W.cube = {
    init(p) {
      p.rounds = Array.from({ length: [1, 2, 3][lvl()] }, () => {
        for (;;) {
          const cells = [[0, 0]], has = (x, y) => cells.some(c => c[0] === x && c[1] === y);
          while (cells.length < 6) { const [x, y] = cells[rand(cells.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][rand(4)]; if (!has(x + d[0], y + d[1])) cells.push([x + d[0], y + d[1]]); }
          const nr = fold(cells); if (new Set(nr.map(v => v.join())).size !== 6) continue;
          const x0 = Math.min(...cells.map(c => c[0])), y0 = Math.min(...cells.map(c => c[1])), faces = shuffle(CF);
          const q = rand(6), opp = nr.findIndex(v => v.every((a, k) => a === -nr[q][k]));
          return { cells: cells.map(([x, y]) => [x - x0, y - y0]), faces, q, opp };
        }
      });
      p.r = 0;
    },
    render(p) {
      const R = p.rounds[p.r], w = Math.max(...R.cells.map(c => c[0])) + 1, h = Math.max(...R.cells.map(c => c[1])) + 1;
      box().innerHTML = `<p class="cnt">${tr('round', { n: p.r + 1, m: p.rounds.length })}</p><div class="net" style="grid-template-columns:repeat(${w},56px);grid-template-rows:repeat(${h},56px)">${R.cells.map(([x, y], i) => `<span class="${i === R.q ? 'q' : ''}" style="grid-column:${x + 1};grid-row:${y + 1}">${R.faces[i]}</span>`).join('')}</div>
        <p class="goal">${tr('cubeQ', { x: R.faces[R.q] })}</p><div class="row">${R.faces.map((f, i) => i === R.q ? '' : `<button class="btn cf" data-i="${i}">${f}</button>`).join('')}</div>`;
      box().querySelectorAll('.cf').forEach(b => { b.onclick = () => { if (+b.dataset.i !== R.opp) { K.fail(); return; } K.beep(880, .1, 'triangle', .08); if (++p.r >= p.rounds.length) { p.r--; setTimeout(() => K.solve(p), 300); return; } W.cube.render(p); }; });
    },
    hint: p => tr('cubeH', { x: p.rounds[p.r].faces[p.rounds[p.r].opp] })
  };
})();

// Énigmes supplémentaires : deux ou trois de plus par scénario, chacune d'un type propre.
// Le verrou final passe à six symboles : ★ ● ▲ ■ ◆ ♥.
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });
  const { rand } = window.Logic;
  const [CLASS, SHIP, TEMPLE, STATION, CITY] = window.Content;
  const hs = (S, fr) => S.hs.find(h => h.n && h.n.fr === fr);
  const goal = (S, ...g) => S.goals.push(g);

  // ============ Classe : différences (◆), paires de mots (♥), grille secrète (fusible) ============
  Object.assign(CLASS.items, {
    secretbox: { i: '🎁', n: T('Boîte à secrets de Nhi', 'Nhi’s secret box', 'Hộp bí mật của Nhi'), d: T('Une petite boîte fermée par une grille de fruits à compléter.', 'A little box locked by a grid of fruit to complete.', 'Một chiếc hộp nhỏ được khóa bằng lưới trái cây cần điền.'), ex: g => g.solved('sudoku') ? g.say(T('La boîte est vide.', 'The box is empty.', 'Hộp đã trống.')) : g.pz('sudoku') }
  });
  CLASS.docs.teacher.b = T(
    "Nhi,\n\nJe veux bien que tu prépares ta chasse au trésor d'anniversaire dans ma classe ce soir, à une condition : tout doit être rangé avant 8 h demain matin !\n\nLe clavier électrique, près de la porte, n'a plus de courant : un fusible a grillé dans le panneau. Tu as rangé le fusible neuf dans ta « boîte à secrets », je la laisse dans ce tiroir. Une fois le fusible remplacé, il faudra rallumer tous les voyants en même temps… mais chaque bouton fait aussi basculer ses voisins.\n\nBonne chance à ton invité(e) !\n— M. Tremblay",
    "Nhi,\n\nI'm happy for you to set up your birthday treasure hunt in my classroom tonight, on one condition: everything must be tidied up before 8 a.m. tomorrow!\n\nThe electric keyboard by the door has no power: a fuse has blown in the panel. You put the new fuse in your 'secret box', and I'm leaving it in this drawer. Once the fuse is replaced, every light will need to be on at the same time… but each button also flips its neighbours.\n\nGood luck to your guest!\n— Mr Tremblay",
    'Nhi à,\n\nThầy đồng ý cho em tổ chức trò truy tìm kho báu mừng sinh nhật trong lớp tối nay, với một điều kiện: mọi thứ phải gọn gàng trước 8 giờ sáng mai!\n\nCây đàn điện cạnh cửa mất điện vì một cầu chì trong bảng điện bị cháy. Em đã cất cầu chì mới trong « hộp bí mật » của em, thầy để hộp trong ngăn kéo này. Thay cầu chì xong, phải làm cho tất cả đèn cùng sáng một lúc… nhưng mỗi nút lại làm đảo cả các ô bên cạnh.\n\nChúc bạn của em may mắn!\n— Thầy Tremblay');
  Object.assign(CLASS.pzs, {
    spot: { type: 'spot', dig: '◆', t: T('Les deux photos', 'The two photos', 'Hai bức ảnh'), ctx: T('Nhi a épinglé deux photos du même pupitre, prises à une minute d’intervalle. Au dos : « Trouve ce qui a changé ! »', 'Nhi pinned up two photos of the same desk, taken a minute apart. On the back: “Find what changed!”', 'Nhi ghim hai bức ảnh chụp cùng một chiếc bàn, cách nhau một phút. Mặt sau ghi: « Tìm xem cái gì đã thay đổi! »'),
      done: T('Au dos de la seconde photo, écrit en tout petit : ◆ et un chiffre.', 'On the back of the second photo, in tiny letters: ◆ and a digit.', 'Mặt sau bức ảnh thứ hai, chữ viết nhỏ xíu: ◆ và một chữ số.') },
    pairs: { type: 'pairs', dig: '♥', t: T('Les cartes de vocabulaire', 'The vocabulary cards', 'Thẻ từ vựng'), ctx: T('Nhi apprend le vietnamien et le français à ses amis. « Associe mes cartes et je te donne mon cœur… enfin, un chiffre ! »', 'Nhi teaches her friends Vietnamese and French. “Match my cards and I’ll give you my heart… well, a digit!”', 'Nhi dạy bạn bè tiếng Việt và tiếng Pháp. « Ghép đúng các thẻ của mình, mình sẽ tặng bạn trái tim… à, một chữ số! »'),
      done: T('Sous la dernière carte, un cœur ♥ et un chiffre.', 'Under the last card, a heart ♥ and a digit.', 'Dưới tấm thẻ cuối cùng có một trái tim ♥ và một chữ số.') },
    sudoku: { type: 'sudoku', icons: ['🍎', '🍌', '🍐', '🍇'], t: T('La boîte à secrets', 'The secret box', 'Hộp bí mật'), ctx: T('Le couvercle porte une grille de fruits à moitié remplie. Un déclic se fera quand elle sera complète.', 'The lid has a half-filled grid of fruit. It will click open once it is complete.', 'Nắp hộp có một lưới trái cây mới điền một nửa. Điền đủ là hộp sẽ bật mở.'),
      done: T('Clic ! Dans la boîte : le fusible neuf.', 'Click! Inside the box: the new fuse.', 'Tách! Trong hộp: chiếc cầu chì mới.'), ok: g => { g.drop('secretbox'); g.take('fuse'); } }
  });
  hs(CLASS, 'Photo').click = g => g.solved('spot') ? g.say(T('Toi et Nhi, grimaçant au premier rang. « Meilleurs amis pour toujours. »', 'You and Nhi pulling faces in the front row. “Best friends forever.”', 'Bạn và Nhi đang nhăn mặt ở hàng đầu. « Bạn thân mãi mãi. »')) : g.pz('spot');
  hs(CLASS, 'Pupitres').click = g => g.pz('pairs');
  hs(CLASS, 'Tiroir du bureau').click = g => {
    if (g.f.drawer) return g.say(T('Le tiroir est vide maintenant.', 'The drawer is empty now.', 'Ngăn kéo giờ đã trống.'));
    if (g.has('key')) { g.set('drawer'); g.drop('key'); g.take('secretbox'); g.doc('teacher'); return g.say(T('La petite clé tourne. Dans le tiroir : la boîte à secrets de Nhi et un mot du professeur.', 'The little key turns. In the drawer: Nhi’s secret box and a note from the teacher.', 'Chiếc chìa nhỏ xoay được. Trong ngăn kéo: hộp bí mật của Nhi và lời nhắn của thầy.')); }
    g.say(T('Le tiroir du bureau est fermé à clé. Une toute petite serrure dorée.', 'The desk drawer is locked. A tiny golden lock.', 'Ngăn kéo bàn bị khóa. Một ổ khóa vàng nhỏ xíu.'));
  };
  goal(CLASS, g => g.solved('sudoku'), g => g.has('secretbox'), T('Examine la boîte à secrets : complète sa grille de fruits.', 'Examine the secret box: complete its fruit grid.', 'Xem kỹ hộp bí mật: điền đủ lưới trái cây.'));
  goal(CLASS, g => g.solved('spot'), g => true, T('La photo épinglée au fond de la classe : cherche les différences.', 'The photo pinned at the back of the room: spot the differences.', 'Bức ảnh ghim ở cuối lớp: hãy tìm điểm khác nhau.'));
  goal(CLASS, g => g.solved('pairs'), g => true, T('Sur les pupitres, les cartes de vocabulaire de Nhi attendent d’être associées.', 'On the desks, Nhi’s vocabulary cards are waiting to be matched.', 'Trên bàn học, thẻ từ vựng của Nhi đang chờ được ghép cặp.'));

  // ============ Bateau : intrus (astrolabe), anneaux (◆), comptage (♥) ============
  Object.assign(SHIP.items, {
    astro: { i: '🧭', n: T('Astrolabe', 'Astrolabe', 'Thước đo sao'), d: T('L’astrolabe en laiton du capitaine. Ses anneaux sont déréglés.', 'The captain’s brass astrolabe. Its rings are out of alignment.', 'Thước đo sao bằng đồng của thuyền trưởng. Các vòng của nó bị lệch.'), ex: g => g.solved('rings') ? g.say(T('L’astrolabe est bien réglé.', 'The astrolabe is properly set.', 'Thước đo sao đã được chỉnh đúng.')) : g.pz('rings') }
  });
  Object.assign(SHIP.pzs, {
    odd: { type: 'odd', t: T('Le tiroir aux devinettes', 'The riddle drawer', 'Ngăn kéo câu đố'), ctx: T('Le tiroir de la couchette est bloqué par des tuiles de bois gravées. Tư y a écrit : « Pousse l’intruse de chaque rangée. »', 'The bunk drawer is jammed with carved wooden tiles. Tư wrote on it: “Push the odd one out in each row.”', 'Ngăn kéo dưới giường bị kẹt bởi những miếng gỗ khắc hình. Chú Tư viết lên đó: « Hãy đẩy miếng lạc loài ở mỗi hàng. »'),
      done: T('Le tiroir glisse enfin : dedans, l’astrolabe du capitaine.', 'The drawer finally slides open: inside, the captain’s astrolabe.', 'Ngăn kéo cuối cùng cũng trượt ra: bên trong là thước đo sao của thuyền trưởng.'), ok: g => g.take('astro') },
    rings: { type: 'rings', dig: '◆', t: T('L’astrolabe', 'The astrolabe', 'Thước đo sao'), ctx: T('« Règle l’astrolabe comme au soir du départ, et il te montrera le ◆. » — Lâm', '“Set the astrolabe as on the evening we set sail, and it will show you the ◆.” — Lâm', '« Chỉnh thước đo sao như buổi tối ra khơi, nó sẽ chỉ cho cháu dấu ◆. » — Lâm'),
      done: T('Tous les symboles s’alignent. Au dos de l’astrolabe s’ouvre une trappe : ◆ et un chiffre.', 'All the symbols line up. A hatch opens on the back of the astrolabe: ◆ and a digit.', 'Mọi ký hiệu thẳng hàng. Mặt sau thước đo sao bật ra một nắp nhỏ: ◆ và một chữ số.') },
    count: { type: 'count', dig: '♥', t: T('La pêche du jour', 'The day’s catch', 'Mẻ cá hôm nay'), ctx: T('Dans le filet, la pêche de la veille sèche encore. Sur l’étiquette, le capitaine a griffonné une question… et un ♥.', 'In the net, yesterday’s catch is still drying. On the tag, the captain scribbled a question… and a ♥.', 'Trong lưới, mẻ cá hôm qua vẫn đang phơi. Trên nhãn, thuyền trưởng viết nguệch ngoạc một câu hỏi… và một dấu ♥.'),
      done: T('C’est le bon compte ! Sous l’étiquette : ♥ et un chiffre.', 'That’s the right count! Under the tag: ♥ and a digit.', 'Đếm đúng rồi! Dưới nhãn: ♥ và một chữ số.') }
  });
  hs(SHIP, 'Tiroir').click = g => g.solved('odd') ? g.say(T('Des chemises pliées et une vieille pipe.', 'Folded shirts and an old pipe.', 'Mấy chiếc áo gấp gọn và một cái tẩu cũ.')) : g.pz('odd');
  hs(SHIP, 'Filets de pêche').click = g => g.pz('count');
  goal(SHIP, g => g.solved('odd'), g => true, T('Le tiroir sous la couchette est bloqué par des tuiles : trouve les intrus.', 'The drawer under the bunk is jammed by tiles: find the odd ones out.', 'Ngăn kéo dưới giường bị kẹt bởi các miếng gỗ: hãy tìm những miếng lạc loài.'));
  goal(SHIP, g => g.solved('rings'), g => g.has('astro'), T('Examine l’astrolabe dans ton inventaire et aligne ses anneaux.', 'Examine the astrolabe in your inventory and line up its rings.', 'Xem kỹ thước đo sao trong túi đồ và chỉnh các vòng thẳng hàng.'));
  goal(SHIP, g => g.solved('count'), g => true, T('Les filets près de la porte : compte la pêche du jour.', 'The nets by the door: count the day’s catch.', 'Những tấm lưới cạnh cửa: đếm mẻ cá hôm nay.'));

  // ============ Temple : tours de pierre (◆), carré magique (♥) ============
  Object.assign(TEMPLE.pzs, {
    hanoi: { type: 'hanoi', dig: '◆', t: T('Les piliers de la crypte', 'The crypt pillars', 'Các cột trong hầm mộ'), ctx: T('Trois piliers, et des disques de pierre empilés du plus grand au plus petit. Gravé au pied du pilier de droite : ◆.', 'Three pillars, with stone discs stacked from largest to smallest. Carved at the foot of the right-hand pillar: ◆.', 'Ba chiếc cột, với những chiếc đĩa đá xếp chồng từ lớn đến nhỏ. Dưới chân cột bên phải có khắc: ◆.'),
      done: T('Le dernier disque se pose : une dalle s’enfonce et révèle ◆ et un chiffre.', 'The last disc settles: a slab sinks to reveal ◆ and a digit.', 'Chiếc đĩa cuối cùng được đặt xuống: một phiến đá lún xuống, lộ ra ◆ và một chữ số.') },
    magic: { type: 'magic', dig: '♥', t: T('La tablette des nombres', 'The number tablet', 'Tấm bia số'), ctx: T('Haut sur le mur, une tablette de neuf cases. Élise a noté : « Les anciens aimaient l’équilibre parfait. »', 'High on the wall, a tablet of nine squares. Élise noted: “The ancients loved perfect balance.”', 'Trên cao tường có một tấm bia chín ô. Élise ghi chú: « Người xưa yêu sự cân bằng hoàn hảo. »'),
      done: T('La tablette se met à briller. Au centre, un cœur ♥ et un chiffre apparaissent.', 'The tablet begins to glow. In the centre, a heart ♥ and a digit appear.', 'Tấm bia bừng sáng. Ở giữa hiện ra một trái tim ♥ và một chữ số.') }
  });
  TEMPLE.hs.push(
    { v: 'c', r: [560, 140, 480, 240], n: T('Piliers de pierre', 'Stone pillars', 'Cột đá'), click: g => g.pz('hanoi') },
    { v: 'a', r: [1180, 40, 230, 230], n: T('Tablette des nombres', 'Number tablet', 'Bia số'), click: g => g.pz('magic') }
  );
  goal(TEMPLE, g => g.solved('magic'), g => true, T('En haut à droite de la salle, une tablette de neuf cases attend ses nombres.', 'High on the right of the hall, a nine-square tablet awaits its numbers.', 'Trên cao bên phải sảnh, một tấm bia chín ô đang chờ các con số.'));
  goal(TEMPLE, g => g.solved('hanoi'), g => g.f.crypt && g.has('torch'), T('Dans la crypte, déplace les disques de pierre sur le pilier de droite.', 'In the crypt, move the stone discs onto the right-hand pillar.', 'Trong hầm mộ, chuyển các đĩa đá sang cột bên phải.'));

  // ============ Station : soudure d'un seul trait (porte), pulsar (◆), pièce de rechange (♥) ============
  STATION.views.b.lock = g => !g.f.weld;
  STATION.views.b.lockMsg = T('La porte de la salle des machines est bloquée : un câble a fondu dans la cloison. Le panneau de maintenance du poste de contrôle permet de refaire la soudure.', 'The engine-room door is jammed: a cable has melted inside the wall. The maintenance panel in the control room can re-weld it.', 'Cửa phòng máy bị kẹt: một sợi cáp đã chảy trong vách. Bảng bảo trì ở phòng điều khiển có thể hàn lại.');
  Object.assign(STATION.pzs, {
    stroke: { type: 'stroke', t: T('La soudure', 'The weld', 'Mối hàn'), ctx: T('Le robot soudeur doit refaire le circuit en un seul passage, sans repasser deux fois au même endroit.', 'The welding robot must redo the circuit in a single pass, without going over the same spot twice.', 'Rô-bốt hàn phải hàn lại mạch trong một lần đi, không được đi qua một chỗ hai lần.'),
      done: T('Le circuit est soudé ! On entend la porte de la salle des machines se déverrouiller.', 'The circuit is welded! You hear the engine-room door unlock.', 'Mạch đã được hàn xong! Bạn nghe thấy cửa phòng máy mở khóa.'), ok: g => g.set('weld') },
    series: { type: 'series', dig: '◆', t: T('Le pulsar', 'The pulsar', 'Sao xung'), ctx: T('Par le hublot, une étoile clignote par salves. HÉLIOS a compté les impulsions : « Trouve l’impulsion suivante et je te donne le ◆. »', 'Through the porthole, a star flashes in bursts. HELIOS counted the pulses: “Find the next pulse and I will give you the ◆.”', 'Qua ô cửa sổ, một ngôi sao nhấp nháy từng đợt. HELIOS đã đếm các xung: « Tìm ra xung tiếp theo, tôi sẽ cho bạn dấu ◆. »'),
      done: T('« CORRECT. » HÉLIOS affiche : ◆ et un chiffre.', '“CORRECT.” HELIOS displays: ◆ and a digit.', '« CHÍNH XÁC. » HELIOS hiển thị: ◆ và một chữ số.') },
    shadow: { type: 'shadow', dig: '♥', t: T('Les pièces de rechange', 'The spare parts', 'Phụ tùng thay thế'), ctx: T('Il faut remplacer un connecteur. Dans le tiroir, plusieurs pièces se ressemblent… mais certaines ont été fabriquées à l’envers.', 'A connector needs replacing. In the drawer, several parts look alike… but some were made back to front.', 'Cần thay một đầu nối. Trong ngăn kéo có nhiều mảnh trông giống nhau… nhưng vài mảnh được làm ngược.'),
      done: T('La pièce s’emboîte parfaitement. Gravé dessus : ♥ et un chiffre.', 'The part fits perfectly. Engraved on it: ♥ and a digit.', 'Mảnh ghép khớp hoàn hảo. Khắc trên đó: ♥ và một chữ số.') }
  });
  STATION.hs.push(
    { v: 'a', r: [30, 560, 230, 200], n: T('Panneau de maintenance', 'Maintenance panel', 'Bảng bảo trì'), click: g => g.solved('stroke') ? g.say(T('« SOUDURE OK ».', '“WELD OK”.', '« HÀN XONG ».')) : g.pz('stroke') },
    { v: 'b', r: [60, 600, 360, 140], n: T('Pièces de rechange', 'Spare parts', 'Phụ tùng'), click: g => g.pz('shadow') }
  );
  hs(STATION, 'Hublot').click = g => g.pz('series');
  STATION.goals.unshift([g => g.f.weld, g => true, T('La salle des machines est bloquée : refais la soudure au panneau de maintenance, en bas à gauche du poste de contrôle.', 'The engine room is jammed: redo the weld at the maintenance panel, bottom left of the control room.', 'Phòng máy bị kẹt: hãy hàn lại ở bảng bảo trì, góc dưới bên trái phòng điều khiển.')]);
  goal(STATION, g => g.solved('series'), g => true, T('Le hublot des quartiers : HÉLIOS a noté les impulsions d’un pulsar.', 'The porthole in the quarters: HELIOS logged a pulsar’s pulses.', 'Ô cửa sổ ở khu nghỉ: HELIOS đã ghi lại các xung của một sao xung.'));
  goal(STATION, g => g.solved('shadow'), g => g.f.weld, T('Dans la salle des machines, le tiroir des pièces de rechange.', 'In the engine room, the spare-parts drawer.', 'Trong phòng máy, ngăn kéo phụ tùng thay thế.'));

  // ============ Enquête : coffre (article), échiquier (◆), rangement des prix (♥) ============
  const cityInit = CITY.init;
  CITY.init = g => {
    cityInit(g);
    const seq = [[1, 5 + rand(30)], [-1, 0], [1, 0]]; if (g.lvl === 2) seq.push([-1, 0]);
    for (let k = 1; k < seq.length; k++) { let v; do { v = 1 + rand(39); } while (seq.slice(0, k).some(s => s[1] === v)); seq[k][1] = v; }
    g.v.dial = { seq };
    const parts = seq.map(([, v], k) => { if (g.lvl === 0 || k % 2 === 0 || v < 2) return [v]; const a = 1 + rand(v - 1); return [a, v - a]; });
    g.v.dialNote = g2 => seq.map(([d], k) => g2.X(d > 0 ? T('droite', 'right', 'phải') : T('gauche', 'left', 'trái')) + ' ' + parts[k].join(' + ')).join(' — ');
  };
  ['fr', 'en', 'vi'].forEach(l => {
    const d = CITY.docs.dossier.b;
    d[l] = d[l].replace('au fond du tiroir', 'rangé dans le coffre des pièces à conviction').replace('at the back of the drawer', 'locked in the evidence safe').replace('dưới đáy ngăn kéo', 'cất trong két sắt đựng tang vật');
  });
  CITY.items.scraps.d = T('Un article de journal déchiré en bandes, sorti du coffre.', 'A newspaper article torn into strips, taken from the safe.', 'Một bài báo bị xé thành nhiều mảnh, lấy ra từ két sắt.');
  Object.assign(CITY.pzs, {
    safe: { type: 'dial', t: T('Le coffre des pièces à conviction', 'The evidence safe', 'Két sắt tang vật'), ctx: T('Un vieux coffre à cadran. La combinaison est forcément notée quelque part dans ce bureau…', 'An old dial safe. The combination must be written down somewhere in this office…', 'Một chiếc két sắt cũ có mặt số. Tổ hợp chắc chắn được ghi ở đâu đó trong văn phòng này…'),
      done: T('Le coffre s’ouvre : un article de journal déchiré en bandes.', 'The safe opens: a newspaper article torn into strips.', 'Két sắt mở ra: một bài báo bị xé thành nhiều mảnh.'), ok: g => { g.set('scraps'); g.take('scraps'); } },
    chess: { type: 'chess', dig: '◆', t: T('L’échiquier de Marc', 'Marc’s chessboard', 'Bàn cờ của Marc'), ctx: T('Une partie inachevée. Une carte : « Mon cavalier connaît le chemin du ◆. »', 'An unfinished game. A card: “My knight knows the way to the ◆.”', 'Một ván cờ dở dang. Một tấm thẻ: « Quân mã của tôi biết đường đến dấu ◆. »'),
      done: T('Sous la case d’arrivée, un petit papier : ◆ et un chiffre.', 'Under the target square, a small slip: ◆ and a digit.', 'Dưới ô đích có một mẩu giấy nhỏ: ◆ và một chữ số.') },
    prices: { type: 'sort', dig: '♥', items: g => g.X(g.v.GAMES).slice(0, [4, 5, 5][g.lvl]), t: T('Les étiquettes de prix', 'The price tags', 'Nhãn giá'), ctx: T('Marc a retiré les étiquettes de prix et laissé des indices. « Range-les et tu auras mon ♥. »', 'Marc removed the price tags and left clues. “Sort them and you will have my ♥.”', 'Marc đã gỡ nhãn giá và để lại gợi ý. « Sắp xếp đúng, bạn sẽ có dấu ♥ của tôi. »'),
      done: T('Derrière le jeu le plus cher : ♥ et un chiffre.', 'Behind the most expensive game: ♥ and a digit.', 'Sau món đắt nhất: ♥ và một chữ số.') }
  });
  hs(CITY, 'Tiroir').click = g => g.say(T('Rien que des trombones et des élastiques.', 'Nothing but paper clips and rubber bands.', 'Chỉ có kẹp giấy và dây chun.'));
  hs(CITY, 'Étagères de jeux').click = g => g.pz('prices');
  CITY.hs.push(
    { v: 'a', r: [180, 640, 190, 190], n: T('Coffre-fort', 'Safe', 'Két sắt'), click: g => g.f.scraps ? (g.solved('article') ? g.say(T('Le coffre est vide.', 'The safe is empty.', 'Két sắt đã trống.')) : g.pz('article')) : g.pz('safe') },
    { v: 'a', r: [600, 562, 260, 40], n: T('Sous-main', 'Desk pad', 'Tấm lót bàn'), hid: true, click: g => { g.note('dial', T('Combinaison du coffre : {dialNote}', 'Safe combination: {dialNote}', 'Tổ hợp két sắt: {dialNote}')); g.say(T('Sous le sous-main, un post-it : « Coffre : {dialNote} ».', 'Under the desk pad, a sticky note: “Safe: {dialNote}”.', 'Dưới tấm lót bàn có một mẩu giấy nhớ: « Két: {dialNote} ».')); } },
    { v: 'd', r: [50, 610, 240, 180], n: T('Échiquier', 'Chessboard', 'Bàn cờ vua'), click: g => g.pz('chess') }
  );
  const gi = CITY.goals.findIndex(x => x[2].fr.startsWith('Fouille le tiroir'));
  CITY.goals.splice(gi, 1,
    [g => !!g.notes.dial, g => true, T('La combinaison du coffre est cachée sous quelque chose, sur le bureau…', 'The safe combination is hidden under something on the desk…', 'Tổ hợp két sắt được giấu dưới một thứ gì đó trên bàn…')],
    [g => g.f.scraps, g => true, T('Ouvre le coffre-fort sous le bureau avec la combinaison.', 'Open the safe under the desk with the combination.', 'Mở két sắt dưới bàn bằng tổ hợp.')]);
  goal(CITY, g => g.solved('chess'), g => g.f.map, T('Dans la boutique, l’échiquier de Marc : amène le cavalier sur la cible.', 'In the shop, Marc’s chessboard: bring the knight to the target.', 'Trong cửa hàng, bàn cờ của Marc: đưa quân mã đến ô đích.'));
  goal(CITY, g => g.solved('prices'), g => g.f.map, T('Les étagères de jeux : range les prix grâce aux indices.', 'The game shelves: sort the prices using the clues.', 'Kệ trò chơi: sắp xếp giá theo gợi ý.'));

  // Correction d'un texte du quiz sur l'intrus (tortue) — voir widgets4 : rien à faire ici.
})();

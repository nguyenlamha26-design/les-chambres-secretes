// Scénario 5 — « L'emblème volé », tiré du plan d'énigmes « Fête Céd » :
// ordinateur à déverrouiller, plan de rénovation et boutiques, dossier policier (inventaire à colorier,
// article déchiré), boutiques visitées, factures, conversations avec Mme Hébert et quiz géographique.
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });
  const { rand, shuffle } = window.Logic;

  // ---------- Boutiques et indices du plan de rénovation ----------
  const SHOPS = [
    { k: 'ludo', i: '🎲', n: T('La boutique de jeux', 'The game shop', 'Cửa hàng trò chơi') },
    { k: 'bake', i: '🥐', n: T('La boulangerie de Mme Hébert', 'Mrs Hébert’s bakery', 'Tiệm bánh của bà Hébert') },
    { k: 'book', i: '📚', n: T('La librairie', 'The bookshop', 'Hiệu sách') },
    { k: 'flow', i: '💐', n: T('La boutique de fleurs', 'The flower shop', 'Tiệm hoa') },
    { k: 'hard', i: '🔧', n: T('La quincaillerie', 'The hardware store', 'Cửa hàng kim khí') },
    { k: 'phar', i: '💊', n: T('La pharmacie', 'The pharmacy', 'Hiệu thuốc') }
  ];
  const LOTNUM = l => l < 3 ? 101 + 2 * l : 102 + 2 * (l - 3);
  const CLUE = {
    at: T('{A} est au numéro {n}.', '{A} is at number {n}.', '{A} ở số nhà {n}.'),
    not: T('{A} n’est pas au numéro {n}.', '{A} is not at number {n}.', '{A} không ở số nhà {n}.'),
    face: T('{A} est juste en face de {B}.', '{A} is directly opposite {B}.', '{A} nằm ngay đối diện {B}.'),
    next: T('{A} est juste à côté de {B}.', '{A} is right next to {B}.', '{A} nằm ngay cạnh {B}.'),
    odd: T('{A} est du côté des numéros impairs.', '{A} is on the odd-numbered side.', '{A} nằm ở dãy số lẻ.'),
    even: T('{A} est du côté des numéros pairs.', '{A} is on the even-numbered side.', '{A} nằm ở dãy số chẵn.'),
    west: T('{A} est au bout ouest de son trottoir.', '{A} is at the west end of its side of the street.', '{A} nằm ở đầu phía tây của dãy phố bên đó.'),
    east: T('{A} est au bout est de son trottoir.', '{A} is at the east end of its side of the street.', '{A} nằm ở đầu phía đông của dãy phố bên đó.'),
    lower: T('{A} a un numéro plus petit que {B}.', '{A} has a lower number than {B}.', 'Số nhà của {A} nhỏ hơn số nhà của {B}.')
  };
  const holds = (c, L) => {
    const a = L[c.a], b = L[c.b];
    switch (c.t) {
      case 'at': return a === c.l; case 'not': return a !== c.l;
      case 'face': return a % 3 === b % 3 && (a < 3) !== (b < 3);
      case 'next': return (a < 3) === (b < 3) && Math.abs(a - b) === 1;
      case 'odd': return a < 3; case 'even': return a >= 3;
      case 'west': return a % 3 === 0; case 'east': return a % 3 === 2;
      case 'lower': return LOTNUM(a) < LOTNUM(b);
    }
  };
  const PERMS = (() => { const out = [], go = (arr, rest) => { if (!rest.length) { out.push(arr); return; } rest.forEach((x, i) => go(arr.concat(x), rest.filter((_, j) => j !== i))); }; go([], [0, 1, 2, 3, 4, 5]); return out; })();
  function genStreet(lvl) {
    for (;;) {
      const L = shuffle([0, 1, 2, 3, 4, 5]);
      if (!(L[0] % 3 === L[1] % 3 && (L[0] < 3) !== (L[1] < 3))) continue;   // la boulangerie est en face de la boutique de jeux
      const clues = [{ t: 'face', a: 1, b: 0 }], maxAt = [2, 1, 0][lvl];
      const pool = [];
      for (let a = 0; a < 6; a++) {
        pool.push({ t: L[a] < 3 ? 'odd' : 'even', a }, { t: 'not', a, l: (L[a] + 1 + rand(5)) % 6 });
        if (L[a] % 3 === 0) pool.push({ t: 'west', a }); if (L[a] % 3 === 2) pool.push({ t: 'east', a });
        pool.push({ t: 'at', a, l: L[a] });
        for (let b = 0; b < 6; b++) if (a !== b) { ['face', 'next', 'lower'].forEach(t => { const c = { t, a, b }; if (holds(c, L)) pool.push(c); }); }
      }
      let at = 0, ok = false;
      for (const c of shuffle(pool)) {
        if (c.t === 'at' && at >= maxAt) continue;
        const before = PERMS.filter(P => clues.every(x => holds(x, P))).length;
        const after = PERMS.filter(P => clues.concat(c).every(x => holds(x, P))).length;
        if (after < before) { clues.push(c); if (c.t === 'at') at++; }
        if (after === 1) { ok = true; break; }
      }
      if (ok && clues.length <= 9) return { L, clues: shuffle(clues) };
    }
  }

  // ---------- Factures ----------
  const DAYS = T(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy']);
  const CLIENTS = ['M. Roy', 'Mme Gagnon', 'M. Côté', 'Mme Ouellet', 'M. Pelletier', 'Mme Bélanger', 'M. Lévesque', 'Mme Dubé'];
  const GAMES = T(['Échecs en bois', 'Casse-tête 1000 pièces', 'Jeu de go', 'Dés de collection', 'Cartes anciennes', 'Mah-jong', 'Jeu de dames', 'Puzzle du phare'],
    ['Wooden chess', '1000-piece jigsaw', 'Go set', 'Collector dice', 'Antique cards', 'Mahjong', 'Draughts', 'Lighthouse puzzle'],
    ['Cờ vua gỗ', 'Tranh ghép 1000 mảnh', 'Cờ vây', 'Xúc xắc sưu tầm', 'Bài cổ', 'Mạt chược', 'Cờ đam', 'Tranh ghép ngọn hải đăng']);
  function genInvoices(lvl) {
    const n = [5, 6, 7][lvl], D = rand(6), cl = shuffle(CLIENTS), A = 40 + rand(40);
    const mk = (day, pay, amount, k) => ({ no: 1000 + rand(9000), day, pay, amount: amount + rand(100) / 100, client: cl[k % cl.length], game: rand(8) });
    const list = [mk(D, 'cash', A, 0)]; list[0].target = true;
    if (lvl >= 1) list.push(mk(D, 'card', A + 5 + rand(20), 1));            // plus chère, mais payée par carte
    else list.push(mk(D, 'card', A - 10 - rand(15), 1));
    list.push(mk(D, 'cash', A - 8 - rand(20), 2));
    if (lvl === 2) list.push(mk(D, 'cash', A + 6 + rand(15), 3));            // plus chère, mais rapportée par ce client
    while (list.length < n) { let d; do { d = rand(6); } while (d === D); list.push(mk(d, rand(2) ? 'cash' : 'card', 15 + rand(80), list.length)); }
    const ex = lvl === 2 ? list[3].client : null;
    return { list: shuffle(list), D, ex };
  }

  // ---------- Inventaire à colorier ----------
  const RULES = {
    ge10: [v => v >= 10, '≥ 10'], lt5: [v => v < 5, '< 5'], even: [v => v % 2 === 0, T('pair', 'even', 'chẵn')], odd: [v => v % 2 === 1, T('impair', 'odd', 'lẻ')],
    mult3: [v => v % 3 === 0, T('multiple de 3', 'multiple of 3', 'bội của 3')], ge12: [v => v >= 12, '≥ 12'], lt4: [v => v < 4, '< 4'], mult4: [v => v % 4 === 0, T('multiple de 4', 'multiple of 4', 'bội của 4')]
  };
  const CATS = T(['Échecs', 'Cartes', 'Dés', 'Casse-têtes', 'Billes'], ['Chess', 'Cards', 'Dice', 'Puzzles', 'Marbles'], ['Cờ vua', 'Bài', 'Xúc xắc', 'Tranh ghép', 'Bi']);
  function genColor(lvl, digit) {
    const pools = [['ge10', 'lt5'], ['ge10', 'lt5', 'even', 'odd'], ['mult3', 'even', 'odd', 'ge12', 'lt4', 'mult4']][lvl];
    const rules = Array.from({ length: 5 }, () => pools[rand(pools.length)]);
    const bm = window.Logic.DIG5[digit].join('').split('').map(Number);
    const vals = bm.map((b, i) => { const f = RULES[rules[i % 5]][0]; let v; do { v = 1 + rand(20); } while (f(v) !== !!b); return v; });
    return { rules, vals, bm };
  }

  // ---------- Quiz géographique ----------
  const QUIZ = [
    T(['Quel fleuve coule devant Rimouski ?', 'Le Saint-Laurent', 'Le Mississippi', 'Le Fraser', 'Le Mékong'], ['Which river flows past Rimouski?', 'The St. Lawrence', 'The Mississippi', 'The Fraser', 'The Mekong'], ['Con sông nào chảy qua trước Rimouski?', 'Sông Saint-Laurent', 'Sông Mississippi', 'Sông Fraser', 'Sông Mê Kông']),
    T(['Dans quelle région du Québec se trouve Rimouski ?', 'Le Bas-Saint-Laurent', 'L’Abitibi', 'L’Estrie', 'L’Outaouais'], ['Which region of Quebec is Rimouski in?', 'Bas-Saint-Laurent', 'Abitibi', 'Estrie', 'Outaouais'], ['Rimouski thuộc vùng nào của Québec?', 'Bas-Saint-Laurent', 'Abitibi', 'Estrie', 'Outaouais']),
    T(['Quel paquebot a fait naufrage au large de Pointe-au-Père en 1914 ?', 'L’Empress of Ireland', 'Le Titanic', 'Le Lusitania', 'Le Queen Mary'], ['Which liner sank off Pointe-au-Père in 1914?', 'The Empress of Ireland', 'The Titanic', 'The Lusitania', 'The Queen Mary'], ['Con tàu khách nào bị đắm ngoài khơi Pointe-au-Père năm 1914?', 'Empress of Ireland', 'Titanic', 'Lusitania', 'Queen Mary']),
    T(['Quel sous-marin peut-on visiter à Pointe-au-Père ?', 'L’Onondaga', 'Le Nautilus', 'Le Redoutable', 'Le Surcouf'], ['Which submarine can you visit at Pointe-au-Père?', 'The Onondaga', 'The Nautilus', 'The Redoutable', 'The Surcouf'], ['Có thể tham quan tàu ngầm nào ở Pointe-au-Père?', 'Onondaga', 'Nautilus', 'Redoutable', 'Surcouf']),
    T(['Quelle est la capitale du Québec ?', 'Québec', 'Montréal', 'Gatineau', 'Sherbrooke'], ['What is the capital of Quebec?', 'Quebec City', 'Montreal', 'Gatineau', 'Sherbrooke'], ['Thủ phủ của tỉnh Québec là gì?', 'Thành phố Québec', 'Montréal', 'Gatineau', 'Sherbrooke']),
    T(['Quelle est la capitale du Vietnam ?', 'Hanoï', 'Hô-Chi-Minh-Ville', 'Huế', 'Đà Nẵng'], ['What is the capital of Vietnam?', 'Hanoi', 'Ho Chi Minh City', 'Huế', 'Đà Nẵng'], ['Thủ đô của Việt Nam là gì?', 'Hà Nội', 'Thành phố Hồ Chí Minh', 'Huế', 'Đà Nẵng']),
    T(['Quelle feuille figure sur le drapeau du Canada ?', 'L’érable', 'Le chêne', 'Le bouleau', 'Le pin'], ['Which leaf is on the flag of Canada?', 'The maple', 'The oak', 'The birch', 'The pine'], ['Lá gì có trên quốc kỳ Canada?', 'Lá phong', 'Lá sồi', 'Lá bạch dương', 'Lá thông']),
    T(['Quel océan borde l’est du Canada ?', 'L’Atlantique', 'Le Pacifique', 'L’océan Indien', 'La mer du Nord'], ['Which ocean borders eastern Canada?', 'The Atlantic', 'The Pacific', 'The Indian Ocean', 'The North Sea'], ['Đại dương nào giáp phía đông Canada?', 'Đại Tây Dương', 'Thái Bình Dương', 'Ấn Độ Dương', 'Biển Bắc']),
    T(['Où trouve-t-on des milliers d’îlots de calcaire au Vietnam ?', 'La baie d’Hạ Long', 'La baie de Fundy', 'La baie d’Hudson', 'La baie de Chaleur'], ['Where are thousands of limestone islets found in Vietnam?', 'Hạ Long Bay', 'The Bay of Fundy', 'Hudson Bay', 'Chaleur Bay'], ['Hàng nghìn đảo đá vôi ở Việt Nam nằm ở đâu?', 'Vịnh Hạ Long', 'Vịnh Fundy', 'Vịnh Hudson', 'Vịnh Chaleur']),
    T(['Quelle est la ville la plus peuplée du Canada ?', 'Toronto', 'Montréal', 'Vancouver', 'Calgary'], ['Which is the most populous city in Canada?', 'Toronto', 'Montreal', 'Vancouver', 'Calgary'], ['Thành phố đông dân nhất Canada là thành phố nào?', 'Toronto', 'Montréal', 'Vancouver', 'Calgary'])
  ];

  // ---------- Article déchiré ----------
  const ARTICLE = T([
    'L’ÉCHO DU FLEUVE — Nuit agitée à l’hôtel de ville !',
    'Dans la nuit de samedi à dimanche, la Rose des vents d’or, emblème de la ville, a disparu de sa vitrine.',
    'Aucune alarme ne s’est déclenchée : le voleur connaissait visiblement les lieux.',
    'Les enquêteurs recherchent un employé arrivé en ville il y a trois mois, qui travaillait dans une boutique de jeux du centre-ville.',
    'Selon une voisine, il « adorait les énigmes et ne parlait que de géographie ».',
    'Toute personne ayant des renseignements est priée de contacter la police.'
  ], [
    'THE RIVER ECHO — A busy night at City Hall!',
    'During the night from Saturday to Sunday, the Golden Compass Rose, emblem of the city, vanished from its display case.',
    'No alarm went off: the thief clearly knew the building well.',
    'Investigators are looking for an employee who arrived in town three months ago and worked in a downtown game shop.',
    'According to a neighbour, he “loved puzzles and talked about nothing but geography”.',
    'Anyone with information is asked to contact the police.'
  ], [
    'TIẾNG VỌNG DÒNG SÔNG — Một đêm náo động tại tòa thị chính!',
    'Trong đêm thứ Bảy rạng sáng Chủ nhật, Hoa gió vàng, biểu tượng của thành phố, đã biến mất khỏi tủ kính trưng bày.',
    'Không có chuông báo động nào reo: rõ ràng kẻ trộm rất thông thạo nơi này.',
    'Các điều tra viên đang tìm một nhân viên đến thành phố cách đây ba tháng, làm việc tại một cửa hàng trò chơi ở trung tâm.',
    'Theo một người hàng xóm, anh ta « rất mê câu đố và chỉ toàn nói chuyện địa lý ».',
    'Ai có thông tin xin vui lòng liên hệ với cảnh sát.'
  ]);

  const city = {
    id: 'city', icon: '🕵️', amb: ['lowpass', 700, .05], morse: null,
    name: T("L'emblème volé", 'The Stolen Emblem', 'Biểu tượng bị đánh cắp'),
    desc: T('Une enquête en ville, une nuit d’hiver.', 'A city investigation on a winter night.', 'Cuộc điều tra trong thành phố, một đêm mùa đông.'),
    intro: T("Rimouski, une nuit de décembre. La Rose des vents d'or, l'emblème de la ville exposé à l'hôtel de ville, a disparu. Le suspect : un trafiquant arrivé il y a trois mois, qui travaillait dans une boutique du centre-ville. La police te confie son bureau, son ordinateur et son dossier. Retrouve l'emblème avant le départ du premier traversier, à l'aube !",
      "Rimouski, one December night. The Golden Compass Rose, the city's emblem displayed at City Hall, has vanished. The suspect: a trafficker who arrived three months ago and worked in a downtown shop. The police hand you his office, his computer and his file. Find the emblem before the first ferry leaves at dawn!",
      'Rimouski, một đêm tháng Mười Hai. Hoa gió vàng, biểu tượng của thành phố trưng bày tại tòa thị chính, đã biến mất. Nghi phạm: một tay buôn lậu đến đây ba tháng trước, làm việc trong một cửa hàng ở trung tâm. Cảnh sát giao cho bạn văn phòng, máy tính và hồ sơ của hắn. Hãy tìm lại biểu tượng trước khi chuyến phà đầu tiên rời bến lúc bình minh!'),
    outro: T("Le cadenas cède. Dans la réserve, enveloppée dans une couverture : la Rose des vents d'or ! Dehors, les gyrophares s'allument : le trafiquant vient d'être arrêté au quai du traversier. Mme Hébert t'offre un chocolat chaud : « Il aimait tant les jeux… cette fois, il a perdu. »",
      "The padlock gives way. In the back room, wrapped in a blanket: the Golden Compass Rose! Outside, police lights flash: the trafficker has just been arrested at the ferry dock. Mrs Hébert hands you a hot chocolate: 'He loved games so much… this time, he lost.'",
      'Ổ khóa bật mở. Trong kho, được quấn trong một tấm chăn: Hoa gió vàng! Bên ngoài, đèn xe cảnh sát nhấp nháy: tay buôn lậu vừa bị bắt ở bến phà. Bà Hébert mời bạn một cốc sô-cô-la nóng: « Hắn mê trò chơi đến thế… lần này thì hắn thua rồi. »'),
    views: {
      a: { scene: 'cityA', n: T("Le bureau d'enquête", 'The investigation office', 'Văn phòng điều tra') },
      b: { scene: 'cityB', n: T('Rue Saint-Germain, côté impair', 'Rue Saint-Germain, odd side', 'Phố Saint-Germain, dãy số lẻ') },
      c: { scene: 'cityC', n: T('Rue Saint-Germain, côté pair', 'Rue Saint-Germain, even side', 'Phố Saint-Germain, dãy số chẵn') },
      d: { scene: 'cityD', n: T('La boutique de jeux', 'The game shop', 'Cửa hàng trò chơi'), lock: g => !g.f.map,
        lockMsg: T('Tu ne sais pas encore dans quelle boutique il travaillait : les enseignes sont cachées par les échafaudages.', 'You don’t know yet which shop he worked in: the signs are hidden by scaffolding.', 'Bạn vẫn chưa biết hắn làm ở cửa hàng nào: các biển hiệu bị giàn giáo che khuất.') }
    },
    order: ['a', 'b', 'c', 'd'],
    init(g) {
      const v = g.v;
      Object.assign(v, { street: genStreet(g.lvl), inv: genInvoices(g.lvl), color: genColor(g.lvl, g.code['★']), shops: SHOPS, LOTNUM, CLUE, DAYS, GAMES, CATS, RULES, ARTICLE, QUIZ });
      v.quiz = shuffle([...QUIZ.keys()]).slice(0, [4, 6, 8][g.lvl]).map(q => ({ q, o: shuffle([1, 2, 3, 4]) }));
      v.art = [[0, 1, 3, 5], [0, 1, 3, 4, 5], [0, 1, 2, 3, 4, 5]][g.lvl];
      v.pwd = { fr: 'PHARE', en: 'LIGHTHOUSE', vi: 'HAIDANG' };
      v.clues = g2 => v.street.clues.map(c => g2.X(CLUE[c.t]).replace('{A}', g2.X(SHOPS[c.a].n)).replace('{B}', c.b != null ? (s => s.charAt(0).toLowerCase() + s.slice(1))(g2.X(SHOPS[c.b].n)) : '').replace('{n}', c.l != null ? LOTNUM(c.l) : ''));
      v.invClue = g2 => {
        const day = g2.X(DAYS)[v.inv.D];
        return g2.X([T('{d}, j’ai vendu le jeu le plus cher de toute la journée !', '{d}, I sold the most expensive game of the whole day!', '{d}, mình đã bán được món đồ chơi đắt nhất cả ngày!'),
          T('{d}, ma plus grosse vente payée comptant. Les cartes de crédit, je ne les compte pas !', '{d}, my biggest sale paid in cash. Card payments don’t count!', '{d}, đơn hàng lớn nhất trả bằng tiền mặt. Trả bằng thẻ thì không tính!'),
          T('{d}, ma plus grosse vente payée comptant… sans compter celle de {c} : il m’a tout rapporté le lendemain.', '{d}, my biggest cash sale… not counting {c}’s: he brought it all back the next day.', '{d}, đơn hàng lớn nhất trả bằng tiền mặt… không tính đơn của {c}: hôm sau ông ấy đã trả lại hết.')][g2.lvl]).replace('{d}', day.charAt(0).toUpperCase() + day.slice(1)).replace('{c}', v.inv.ex || '');
      };
    },
    items: {
      scraps: { i: '📰', n: T('Morceaux d’article', 'Article scraps', 'Mảnh bài báo'), d: T('Un article de journal déchiré en bandes.', 'A newspaper article torn into strips.', 'Một bài báo bị xé thành nhiều mảnh.'), ex: g => g.pz('article') }
    },
    combos: [],
    docs: {
      dossier: { s: 'paper', t: T('Dossier policier n° 2047', 'Police file no. 2047', 'Hồ sơ cảnh sát số 2047'), b: T(
        "Objet : vol de la Rose des vents d'or.\n\nSuspect : « Marc L. », arrivé à Rimouski il y a trois mois. Employé d'une boutique de jeux de la rue Saint-Germain (adresse exacte inconnue : toutes les enseignes sont cachées par les travaux de rénovation).\n\nRetrouvé dans son bureau pendant la perquisition :\n– un ordinateur protégé par un mot de passe ;\n– l'inventaire de la boutique, annoté de sa main : « colorier selon les colonnes » ;\n– un article de journal déchiré, au fond du tiroir.\n\nTémoignages : le suspect adore les jeux et entretient une belle amitié avec Mme Hébert, la boulangère d'en face. Elle accepte de nous montrer leurs conversations.\n\nLe premier traversier part à l'aube. Le temps presse.",
        "Subject: theft of the Golden Compass Rose.\n\nSuspect: 'Marc L.', arrived in Rimouski three months ago. Employee of a game shop on Rue Saint-Germain (exact address unknown: every sign is hidden by the renovation works).\n\nFound in his office during the search:\n– a password-protected computer;\n– the shop's inventory, annotated in his hand: 'colour by columns';\n– a torn newspaper article, at the back of the drawer.\n\nWitnesses: the suspect loves games and is close friends with Mrs Hébert, the baker across the street. She agrees to show us their conversations.\n\nThe first ferry leaves at dawn. Time is short.",
        'Vụ việc: trộm Hoa gió vàng.\n\nNghi phạm: « Marc L. », đến Rimouski ba tháng trước. Nhân viên một cửa hàng trò chơi trên phố Saint-Germain (chưa rõ địa chỉ chính xác: mọi biển hiệu đều bị che vì công trình cải tạo).\n\nTìm thấy trong văn phòng của hắn khi khám xét:\n– một máy tính có mật khẩu;\n– bảng kiểm kê của cửa hàng, có ghi chú tay: « tô màu theo từng cột »;\n– một bài báo bị xé, dưới đáy ngăn kéo.\n\nNhân chứng: nghi phạm rất mê trò chơi và có tình bạn đẹp với bà Hébert, chủ tiệm bánh đối diện. Bà đồng ý cho chúng tôi xem các cuộc trò chuyện của họ.\n\nChuyến phà đầu tiên rời bến lúc bình minh. Thời gian gấp rút.') },
      plan: { s: 'paper', t: T('Plan de rénovation du centre-ville', 'Downtown renovation plan', 'Kế hoạch cải tạo trung tâm'), b: g => g.X(T('Rue Saint-Germain — côté impair : 101, 103, 105 (d’ouest en est) ; côté pair : 102, 104, 106, juste en face.\nLes enseignes sont démontées pendant les travaux. Notes de l’urbaniste :',
        'Rue Saint-Germain — odd side: 101, 103, 105 (west to east); even side: 102, 104, 106, directly opposite.\nSigns are removed during the works. Planner’s notes:',
        'Phố Saint-Germain — dãy lẻ: 101, 103, 105 (từ tây sang đông); dãy chẵn: 102, 104, 106, ngay đối diện.\nBiển hiệu được tháo xuống trong thời gian thi công. Ghi chú của kiến trúc sư:')) + '\n\n' + g.v.clues(g).map(s => '• ' + s).join('\n') },
      chat: { s: 'screen', t: T('Conversations avec Mme Hébert', 'Chats with Mrs Hébert', 'Tin nhắn với bà Hébert'), b: g => g.X(T(
        "Mme Hébert : Bonne semaine à la boutique, mon grand ?\nMarc : Excellente ! {invClue}\nMme Hébert : Tu notes toujours tes petits codes secrets sur tes factures ?\nMarc : Toujours, dans le coin, à côté d'un petit carré ■. 😉\nMme Hébert : Et ce gros paquet que tu as caché dans ta réserve ?\nMarc : Une surprise… Personne n'y entre sans réussir mon quiz de géographie !\nMme Hébert : Toi et tes jeux ! Passe prendre un croissant demain.",
        "Mrs Hébert: Good week at the shop, dear?\nMarc: Excellent! {invClue}\nMrs Hébert: Do you still write your little secret codes on your invoices?\nMarc: Always, in the corner, next to a little square ■. 😉\nMrs Hébert: And that big package you hid in your back room?\nMarc: A surprise… Nobody gets in without passing my geography quiz!\nMrs Hébert: You and your games! Come by for a croissant tomorrow.",
        'Bà Hébert: Tuần này cửa hàng buôn bán tốt chứ cháu?\nMarc: Tuyệt lắm ạ! {invClue}\nBà Hébert: Cháu vẫn ghi mấy mật mã nhỏ lên hóa đơn à?\nMarc: Lúc nào cũng vậy, ở góc, cạnh một ô vuông nhỏ ■. 😉\nBà Hébert: Còn cái gói to cháu giấu trong kho là gì thế?\nMarc: Bất ngờ ạ… Không ai vào được nếu không vượt qua câu đố địa lý của cháu!\nBà Hébert: Cháu với mấy trò chơi của cháu! Mai ghé lấy bánh sừng bò nhé.')) },
      article: { s: 'old', t: T('L’article reconstitué', 'The restored article', 'Bài báo đã ghép lại'), b: g => g.v.art.map(i => g.X(ARTICLE)[i]).join('\n\n') }
    },
    pzs: {
      pc: { type: 'wallpaper', t: T('L’ordinateur du suspect', 'The suspect’s computer', 'Máy tính của nghi phạm'), ctx: T('Le fond d’écran montre sa photo préférée. Sous le champ du mot de passe, un indice : « Mon endroit préféré en ville. »', 'The wallpaper shows his favourite photo. Under the password field, a hint: “My favourite place in town.”', 'Hình nền là bức ảnh hắn thích nhất. Dưới ô mật khẩu có gợi ý: « Nơi tôi thích nhất trong thành phố. »'),
        done: T('Session ouverte ! Sur le bureau de l’ordinateur : le plan de rénovation du centre-ville.', 'Logged in! On the desktop: the downtown renovation plan.', 'Đã đăng nhập! Trên màn hình: kế hoạch cải tạo trung tâm thành phố.'), ok: g => { g.set('pc'); g.doc('plan'); } },
      article: { type: 'article', dig: '●', t: T('L’article déchiré', 'The torn article', 'Bài báo bị xé'), ctx: T('Des bandes de papier journal, froissées. Remets-les dans l’ordre pour lire l’article.', 'Crumpled strips of newspaper. Put them back in order to read the article.', 'Những mảnh giấy báo nhàu nát. Hãy sắp xếp lại để đọc bài báo.'),
        done: T('L’article est complet. Dans la marge, griffonné au stylo : ● et un chiffre.', 'The article is complete. In the margin, scribbled in pen: ● and a digit.', 'Bài báo đã hoàn chỉnh. Bên lề có viết nguệch ngoạc bằng bút: ● và một chữ số.'), ok: g => g.doc('article') },
      color: { type: 'color', dig: '★', t: T('L’inventaire de la boutique', 'The shop inventory', 'Bảng kiểm kê cửa hàng'), ctx: T('Les quantités en stock, et l’annotation du suspect : « colorier selon les colonnes ».', 'Stock quantities, with the suspect’s note: “colour by columns”.', 'Số lượng hàng tồn kho, kèm ghi chú của nghi phạm: « tô màu theo từng cột ».'),
        done: T('Les cases colorées dessinent un chiffre : c’est le ★ !', 'The coloured squares draw a digit: it is the ★!', 'Các ô được tô màu vẽ thành một chữ số: đó là ★!') },
      street: { type: 'assoc', dig: '▲', t: T('Le plan de la rue', 'The street plan', 'Sơ đồ phố'), ctx: T('Sur le panneau du chantier, un plan incomplet de la rue. Associe chaque boutique à son numéro grâce aux notes de l’urbaniste.', 'On the building-site board, an incomplete street plan. Match each shop to its number using the planner’s notes.', 'Trên bảng công trường có sơ đồ phố còn dang dở. Hãy ghép mỗi cửa hàng với số nhà của nó nhờ ghi chú của kiến trúc sư.'),
        done: T('Tout concorde ! Sur la porte de la boutique de jeux, un autocollant : ▲ et un chiffre.', 'Everything fits! On the game shop door, a sticker: ▲ and a digit.', 'Mọi thứ đều khớp! Trên cửa cửa hàng trò chơi có một miếng dán: ▲ và một chữ số.'), ok: g => g.set('map') },
      invoice: { type: 'invoice', dig: '■', t: T('Les factures', 'The invoices', 'Các hóa đơn'), ctx: T('Une pile de factures de la semaine. Laquelle porte le code dont parlait Marc à Mme Hébert ?', 'A stack of this week’s invoices. Which one carries the code Marc mentioned to Mrs Hébert?', 'Một chồng hóa đơn trong tuần. Hóa đơn nào mang mật mã mà Marc nhắc với bà Hébert?'),
        done: T('Dans le coin de la facture, au crayon : ■ et un chiffre.', 'In the corner of the invoice, in pencil: ■ and a digit.', 'Ở góc hóa đơn, viết bằng bút chì: ■ và một chữ số.') },
      quiz: { type: 'quiz', t: T('Le quiz de Marc', 'Marc’s quiz', 'Câu đố của Marc'), ctx: T('Sur le plateau de jeu, une carte : « Seuls les vrais connaisseurs entrent dans ma réserve. »', 'On the game board, a card: “Only true connoisseurs may enter my back room.”', 'Trên bàn cờ có một tấm thẻ: « Chỉ người thực sự hiểu biết mới được vào kho của tôi. »'),
        done: T('Clic ! Le loquet de la réserve se libère. Il ne reste que le cadenas…', 'Click! The back-room latch releases. Only the padlock remains…', 'Tách! Chốt cửa kho bật ra. Chỉ còn lại ổ khóa…'), ok: g => g.set('quiz') }
    },
    hs: [
      { v: 'a', r: [560, 300, 330, 260], n: T('Ordinateur', 'Computer', 'Máy tính'), click: g => g.f.pc ? g.doc('plan', true) : g.pz('pc') },
      { v: 'a', r: [960, 560, 220, 90], n: T('Dossier policier', 'Police file', 'Hồ sơ cảnh sát'), click: g => g.doc('dossier', true) },
      { v: 'a', r: [380, 680, 300, 110], n: T('Tiroir', 'Drawer', 'Ngăn kéo'), click: g => {
        if (g.f.scraps) return g.solved('article') ? g.say(T('Le tiroir est vide.', 'The drawer is empty.', 'Ngăn kéo đã trống.')) : g.pz('article');
        g.set('scraps'); g.take('scraps'); g.say(T('Au fond du tiroir, un article de journal déchiré en bandes.', 'At the back of the drawer, a newspaper article torn into strips.', 'Dưới đáy ngăn kéo có một bài báo bị xé thành nhiều mảnh.'));
      } },
      { v: 'a', r: [1200, 140, 330, 300], n: T('Tableau d’enquête', 'Investigation board', 'Bảng điều tra'), click: g => g.pz('color') },
      { v: 'a', r: [100, 120, 360, 330], n: T('Fenêtre', 'Window', 'Cửa sổ'), click: g => g.say(T('La neige tombe sur Rimouski. Au loin, le fleuve est noir et le phare de Pointe-au-Père clignote.', 'Snow falls on Rimouski. In the distance the river is black and the Pointe-au-Père lighthouse blinks.', 'Tuyết rơi trên Rimouski. Xa xa, dòng sông đen thẫm và ngọn hải đăng Pointe-au-Père nhấp nháy.')) },
      { v: 'a', r: [1250, 640, 150, 170], n: T('Corbeille', 'Bin', 'Thùng rác'), hid: true, click: g => { g.note('receipt', T('Reçu de quincaillerie : 1 cadenas à 6 chiffres, 1 couverture épaisse.', 'Hardware receipt: 1 six-digit padlock, 1 thick blanket.', 'Biên lai cửa hàng kim khí: 1 ổ khóa sáu số, 1 tấm chăn dày.')); g.say(T('Un reçu froissé : « 1 cadenas à 6 chiffres, 1 couverture épaisse ». Pour emballer quelque chose de précieux ?', 'A crumpled receipt: “1 six-digit padlock, 1 thick blanket”. To wrap something precious?', 'Một biên lai nhàu: « 1 ổ khóa sáu số, 1 tấm chăn dày ». Để gói thứ gì đó quý giá?')); } },
      { v: 'b', r: [660, 470, 280, 280], n: T('Panneau du chantier', 'Building-site board', 'Bảng công trường'), click: g => g.f.pc ? (g.solved('street') ? g.doc('plan', true) : g.pz('street')) : g.say(T('Un panneau de chantier avec un plan à moitié effacé. Il te faudrait le plan complet de la rénovation… peut-être dans l’ordinateur du suspect ?', 'A building-site board with a half-erased plan. You would need the full renovation plan… perhaps on the suspect’s computer?', 'Một bảng công trường với sơ đồ bị xóa mất một nửa. Bạn cần bản kế hoạch cải tạo đầy đủ… có lẽ trong máy tính của nghi phạm?')) },
      ...[0, 1, 2, 3, 4, 5].map(l => ({ v: l < 3 ? 'b' : 'c', r: [[80, 130, 440, 520], [580, 130, 440, 320], [1080, 130, 440, 520]][l % 3], n: g => g.f.map ? g.X(SHOPS[g.v.street.L.indexOf(l)].n) + ' — ' + LOTNUM(l) : g.X(T('Façade n° ', 'Shopfront no. ', 'Mặt tiền số ')) + LOTNUM(l), click: g => shopClick(g, l) })),
      { v: 'c', r: [1300, 700, 220, 140], n: T('Bac à neige', 'Snowbank', 'Đống tuyết'), hid: true, click: g => { g.note('glove', T('Un gant perdu dans la neige, brodé « M. L. ». Il est passé par ici en courant.', 'A glove lost in the snow, embroidered “M. L.”. He ran through here.', 'Một chiếc găng tay rơi trong tuyết, thêu chữ « M. L. ». Hắn đã chạy qua đây.')); g.say(T('Dans la neige, un gant brodé « M. L. »… Il est passé par ici en courant.', 'In the snow, a glove embroidered “M. L.”… He ran through here.', 'Trong tuyết có một chiếc găng tay thêu « M. L. »… Hắn đã chạy qua đây.')); } },
      { v: 'd', r: [300, 600, 440, 160], n: T('Comptoir et factures', 'Counter and invoices', 'Quầy và hóa đơn'), click: g => g.pz('invoice') },
      { v: 'd', r: [820, 560, 330, 200], n: T('Plateau de jeu', 'Game board', 'Bàn cờ'), click: g => g.solved('quiz') ? g.say(T('Le plateau est rangé. Le loquet de la réserve est ouvert.', 'The board is tidied away. The back-room latch is open.', 'Bàn cờ đã dọn. Chốt cửa kho đã mở.')) : g.pz('quiz') },
      { v: 'd', r: [80, 120, 420, 440], n: T('Étagères de jeux', 'Game shelves', 'Kệ trò chơi'), click: g => g.say(T('Des centaines de boîtes de jeux. Sur l’une d’elles, une étiquette : « Réservé — M. L. ». Vide.', 'Hundreds of game boxes. On one, a label: “Reserved — M. L.”. Empty.', 'Hàng trăm hộp trò chơi. Trên một hộp có nhãn: « Đã giữ — M. L. ». Trống rỗng.')) },
      { v: 'd', r: [560, 120, 360, 300], n: T('Vitrine', 'Shop window', 'Cửa kính'), click: g => g.say(T('Par la vitrine, juste en face : la boulangerie de Mme Hébert, encore éclairée.', 'Through the window, right opposite: Mrs Hébert’s bakery, still lit.', 'Qua cửa kính, ngay đối diện: tiệm bánh của bà Hébert vẫn còn sáng đèn.')) },
      { v: 'd', r: [1150, 130, 330, 620], n: T('Porte de la réserve', 'Back-room door', 'Cửa kho'), fin: true }
    ],
    finNeed: g => g.f.quiz ? null : T('La porte de la réserve a un loquet et un écriteau : « Seuls les vrais connaisseurs entrent. Réussis mon quiz sur le plateau de jeu. »', 'The back-room door has a latch and a sign: “Only true connoisseurs may enter. Pass my quiz on the game board.”', 'Cửa kho có chốt và một tấm biển: « Chỉ người thực sự hiểu biết mới được vào. Hãy vượt qua câu đố trên bàn cờ. »'),
    goals: [
      [g => g.f.doc_dossier, g => true, T('Lis le dossier policier posé sur le bureau.', 'Read the police file on the desk.', 'Đọc hồ sơ cảnh sát trên bàn.')],
      [g => g.f.pc, g => true, T('Le fond d’écran de l’ordinateur est un indice : le mot de passe est le nom de ce lieu.', 'The computer wallpaper is a clue: the password is the name of that place.', 'Hình nền máy tính là một gợi ý: mật khẩu là tên của nơi đó.')],
      [g => g.f.scraps, g => true, T('Fouille le tiroir du bureau.', 'Search the desk drawer.', 'Lục ngăn kéo bàn làm việc.')],
      [g => g.solved('article'), g => g.f.scraps, T('Examine les morceaux d’article et remets-les dans l’ordre.', 'Examine the article scraps and put them back in order.', 'Xem kỹ các mảnh bài báo và sắp xếp lại.')],
      [g => g.solved('color'), g => true, T('Le tableau d’enquête : colorie l’inventaire selon la règle de chaque colonne.', 'The investigation board: colour the inventory by each column’s rule.', 'Bảng điều tra: tô màu bảng kiểm kê theo quy tắc của từng cột.')],
      [g => g.solved('street'), g => g.f.pc, T('Dans la rue, le panneau du chantier : associe les boutiques à leurs numéros.', 'In the street, the building-site board: match the shops to their numbers.', 'Ngoài phố, bảng công trường: ghép các cửa hàng với số nhà.')],
      [g => g.f.doc_chat, g => g.f.map, T('Mme Hébert, à la boulangerie d’en face, a des conversations à te montrer.', 'Mrs Hébert, at the bakery opposite, has chats to show you.', 'Bà Hébert ở tiệm bánh đối diện có tin nhắn muốn cho bạn xem.')],
      [g => g.solved('invoice'), g => g.f.doc_chat, T('Dans la boutique de jeux, trouve la facture dont parle Marc.', 'In the game shop, find the invoice Marc talks about.', 'Trong cửa hàng trò chơi, tìm hóa đơn mà Marc nhắc đến.')],
      [g => g.solved('quiz'), g => g.f.map, T('Le plateau de jeu de la boutique : le quiz géographique ouvre la réserve.', 'The shop’s game board: the geography quiz opens the back room.', 'Bàn cờ trong cửa hàng: câu đố địa lý sẽ mở kho.')]
    ]
  };

  function shopClick(g, l) {
    if (!g.f.map) return g.say(T('Des échafaudages et des bâches cachent l’enseigne. Impossible de savoir quelle boutique se trouve ici.', 'Scaffolding and tarps hide the sign. No way to tell which shop is here.', 'Giàn giáo và bạt che kín biển hiệu. Không thể biết cửa hàng nào ở đây.'));
    const k = SHOPS[g.v.street.L.indexOf(l)].k;
    if (k === 'ludo') { g.say(T('Tu pousses la porte de la boutique de jeux…', 'You push open the game shop door…', 'Bạn đẩy cửa bước vào cửa hàng trò chơi…')); return g.go('d'); }
    if (k === 'bake') { g.say(T('Mme Hébert t’accueille, les yeux rougis : « Je n’arrive pas à croire que Marc ait fait ça. Tenez, voici nos messages. »', 'Mrs Hébert greets you, her eyes red: “I can’t believe Marc did this. Here, these are our messages.”', 'Bà Hébert ra đón bạn, mắt đỏ hoe: « Tôi không thể tin Marc lại làm vậy. Đây, tin nhắn của chúng tôi đây. »')); return g.doc('chat'); }
    const msg = {
      book: T('Le libraire : « Il m’a acheté un atlas du Québec et un livre de quiz de géographie. Un passionné ! »', 'The bookseller: “He bought a Quebec atlas and a geography quiz book from me. A real enthusiast!”', 'Người bán sách: « Cậu ta mua của tôi một cuốn atlas Québec và một cuốn câu đố địa lý. Đúng là người đam mê! »'),
      flow: T('La fleuriste : « Chaque samedi, il commandait un bouquet… pour Mme Hébert, en face de chez lui. »', 'The florist: “Every Saturday he ordered a bouquet… for Mrs Hébert, across from his shop.”', 'Cô bán hoa: « Thứ Bảy nào cậu ta cũng đặt một bó hoa… tặng bà Hébert, đối diện cửa hàng cậu ta. »'),
      hard: T('Le quincaillier : « Un cadenas à six chiffres et une grosse couverture, la veille du vol. »', 'The hardware seller: “A six-digit padlock and a big blanket, the day before the theft.”', 'Chủ cửa hàng kim khí: « Một ổ khóa sáu số và một tấm chăn to, ngay hôm trước vụ trộm. »'),
      phar: T('La pharmacienne : « Il est venu acheter des pastilles pour la gorge. Il parlait sans arrêt de traversier… »', 'The pharmacist: “He came to buy throat lozenges. He kept talking about the ferry…”', 'Dược sĩ: « Cậu ta đến mua kẹo ngậm ho. Cứ nói mãi về chuyến phà… »')
    }[k];
    g.note('shop_' + k, msg); g.say(msg);
  }

  window.Content.push(city);
})();

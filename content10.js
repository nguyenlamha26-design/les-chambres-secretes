// Scénarios 12 à 14 : « L'Académie de Brumeval » (école de magie), « La Famille Corsetti » (mafia, Montréal 1931)
// et « L'Agora du temps » (les philosophes).
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });
  const say = (g, t) => g.say(t);

  // ============================ 12. L'ACADÉMIE DE BRUMEVAL ============================
  const magic = {
    id: 'magic', icon: '🪄', amb: ['bandpass', 900, .03], morse: null,
    name: T('L’Académie de Brumeval', 'Brumeval Academy', 'Học viện Brumeval'),
    desc: T('Une école de magie cachée dans les Laurentides.', 'A school of magic hidden in the Laurentians.', 'Một ngôi trường phép thuật ẩn mình giữa dãy Laurentides.'),
    intro: T("Nuit du solstice d'hiver, à l'Académie de magie de Brumeval, cachée dans la brume des Laurentides. Tu es en première année. Au dîner, la directrice Ombeline a disparu dans un tourbillon d'étincelles, et la grande porte de l'Académie s'est scellée de six runes : ★ ● ▲ ■ ◆ ♥. Un parchemin flotte devant toi : « Seul un élève digne de Brumeval peut rouvrir la porte. Prouve-le. »",
      "Winter solstice night at Brumeval Academy of Magic, hidden in the Laurentian mist. You are a first-year student. At dinner, Headmistress Ombeline vanished in a swirl of sparks, and the Academy's great door sealed itself with six runes: ★ ● ▲ ■ ◆ ♥. A parchment floats in front of you: “Only a student worthy of Brumeval can open the door again. Prove it.”",
      'Đêm đông chí ở Học viện phép thuật Brumeval, ẩn trong sương mù dãy Laurentides. Bạn là học sinh năm nhất. Trong bữa tối, hiệu trưởng Ombeline biến mất trong một cơn lốc tia lửa, và cánh cổng lớn của học viện tự niêm phong bằng sáu ký tự: ★ ● ▲ ■ ◆ ♥. Một cuộn giấy da lơ lửng trước mặt bạn: « Chỉ học sinh xứng đáng với Brumeval mới mở lại được cánh cổng. Hãy chứng minh điều đó. »'),
    outro: T("Les six runes s'illuminent et la grande porte s'ouvre en grinçant. Dans le hall, la directrice Ombeline t'attend, une tasse de chocolat chaud à la main : « Félicitations. C'était ton examen de fin de trimestre… et tu l'as réussi avec brio. » Les élèves applaudissent, et des lanternes enchantées s'envolent vers le ciel étoilé.",
      "The six runes light up and the great door creaks open. In the hall, Headmistress Ombeline is waiting, a cup of hot chocolate in hand: “Congratulations. That was your end-of-term exam… and you passed with flying colours.” The students cheer, and enchanted lanterns float up into the starry sky.",
      'Sáu ký tự bừng sáng và cánh cổng lớn kẽo kẹt mở ra. Trong sảnh, hiệu trưởng Ombeline đang chờ bạn, tay cầm tách sô-cô-la nóng: « Chúc mừng em. Đó là bài thi cuối kỳ… và em đã đỗ xuất sắc. » Các học sinh vỗ tay, và những chiếc đèn lồng phép bay lên bầu trời đầy sao.'),
    views: {
      a: { scene: 'magicA', n: T('Le cachot des potions', 'The potions dungeon', 'Hầm độc dược') },
      b: { scene: 'magicB', n: T('La tour d’astronomie', 'The astronomy tower', 'Tháp thiên văn') },
      c: { scene: 'magicC', n: T('La bibliothèque interdite', 'The forbidden library', 'Thư viện cấm'), dark: g => true, light: 'candle' }
    },
    order: ['a', 'b', 'c'],
    items: { candle: { i: '🕯️', n: T('Bougie éternelle', 'Everlasting candle', 'Nến vĩnh cửu'), d: T('Une bougie dont la flamme ne s’éteint jamais. Idéale pour les endroits sombres.', 'A candle whose flame never goes out. Ideal for dark places.', 'Một cây nến không bao giờ tắt. Rất hợp cho những nơi tối tăm.') } },
    combos: [],
    docs: {
      parch: { s: 'old', t: T('Le parchemin flottant', 'The floating parchment', 'Cuộn giấy da lơ lửng'), b: T(
        "Six épreuves, six runes :\n★ la potion du cachot\n● la boîte à baguette\n▲ l'horloge de la tour\n■ les cartes du ciel\n◆ la course de balais\n♥ le miroir de la bibliothèque\n\nLa bibliothèque est plongée dans l'ombre : seule une flamme éternelle peut l'éclairer. — O.",
        "Six trials, six runes:\n★ the dungeon potion\n● the wand box\n▲ the tower clock\n■ the star charts\n◆ the broom race\n♥ the library mirror\n\nThe library lies in darkness: only an everlasting flame can light it. — O.",
        'Sáu thử thách, sáu ký tự:\n★ thuốc phép trong hầm\n● hộp đũa phép\n▲ đồng hồ trên tháp\n■ bản đồ sao\n◆ cuộc đua chổi bay\n♥ chiếc gương trong thư viện\n\nThư viện chìm trong bóng tối: chỉ ngọn lửa vĩnh cửu mới soi sáng được. — O.') },
      rules: { s: 'note', t: T('Règlement de l’Académie', 'Academy rules', 'Nội quy học viện'), b: T(
        "Article 1 : on ne vole pas dans les couloirs.\nArticle 2 : on ne nourrit pas les gargouilles.\nArticle 7 : toute potion ratée doit être signalée au professeur Lambert.\nArticle 12 : la bibliothèque interdite est… interdite. Sauf pendant les examens.",
        "Article 1: no flying in the corridors.\nArticle 2: do not feed the gargoyles.\nArticle 7: any failed potion must be reported to Professor Lambert.\nArticle 12: the forbidden library is… forbidden. Except during exams.",
        'Điều 1: không bay trong hành lang.\nĐiều 2: không cho tượng máng xối ăn.\nĐiều 7: mọi lọ thuốc hỏng phải báo cho giáo sư Lambert.\nĐiều 12: thư viện cấm thì… cấm. Trừ mùa thi.') }
    },
    pzs: {
      potion: { type: 'potion', dig: '★', t: T('La potion de lumière', 'The light potion', 'Thuốc ánh sáng'), ctx: T('Le chaudron du professeur Lambert bouillonne. Trois flacons : rouge, jaune et bleu. Le grimoire est ouvert à la page « Potion de lumière ».', 'Professor Lambert’s cauldron is bubbling. Three flasks: red, yellow and blue. The book is open at “Light Potion”.', 'Chiếc vạc của giáo sư Lambert đang sôi. Ba lọ: đỏ, vàng và xanh lam. Cuốn sách mở ở trang « Thuốc ánh sáng ».'),
        done: T('La potion s’illumine ! Une bougie éternelle s’allume au-dessus du chaudron, et la vapeur dessine ★ et un chiffre.', 'The potion glows! An everlasting candle lights up above the cauldron, and the steam draws ★ and a digit.', 'Thuốc phát sáng! Một cây nến vĩnh cửu bừng cháy trên vạc, và hơi nước vẽ ra ★ cùng một chữ số.'), ok: g => g.take('candle') },
      wand: { type: 'vigenere', dig: '●', t: T('La boîte à baguette', 'The wand box', 'Hộp đũa phép'), ctx: T('Une longue boîte de bois, scellée par un message chiffré. Sur la baguette posée à côté, une clé est gravée.', 'A long wooden box, sealed by an encrypted message. On the wand beside it, a key is carved.', 'Một chiếc hộp gỗ dài, niêm phong bằng một thông điệp mã hóa. Trên cây đũa đặt bên cạnh có khắc một chiếc khóa.'),
        done: T('La boîte s’ouvre : à l’intérieur, ● et un chiffre en lettres d’argent.', 'The box opens: inside, ● and a digit in silver letters.', 'Chiếc hộp mở ra: bên trong là ● và một chữ số bằng chữ bạc.') },
      clock: { type: 'gears', dig: '▲', t: T('L’horloge de la tour', 'The tower clock', 'Đồng hồ trên tháp'), ctx: T('Le mécanisme de l’horloge est à nu. Le gardien a écrit sur le mur : « Qui comprend mes roues connaîtra l’heure. »', 'The clock mechanism is exposed. The keeper wrote on the wall: “Whoever understands my wheels will know the time.”', 'Bộ máy đồng hồ để lộ ra ngoài. Người gác viết trên tường: « Ai hiểu những bánh xe của ta sẽ biết giờ. »'),
        done: T('L’horloge sonne douze coups. Sur le cadran : ▲ et un chiffre.', 'The clock strikes twelve. On the dial: ▲ and a digit.', 'Đồng hồ điểm mười hai tiếng. Trên mặt số: ▲ và một chữ số.') },
      stars: { type: 'rotmatch', dig: '■', t: T('Les cartes du ciel', 'The star charts', 'Bản đồ sao'), ctx: T('Le télescope pointe vers une constellation. Sur la table, des cartes du ciel… dont certaines ont été copiées à l’envers.', 'The telescope points at a constellation. On the table, star charts… some copied back to front.', 'Kính thiên văn hướng về một chòm sao. Trên bàn có những tấm bản đồ sao… vài tấm bị chép ngược.'),
        done: T('La constellation brille plus fort : ■ et un chiffre apparaissent entre les étoiles.', 'The constellation shines brighter: ■ and a digit appear among the stars.', 'Chòm sao sáng rực hơn: ■ và một chữ số hiện ra giữa các vì sao.') },
      broom: { type: 'broom', dig: '◆', t: T('La course de balais', 'The broom race', 'Cuộc đua chổi bay'), ctx: T('Par la fenêtre de la tour, un balai t’attend. Le parcours au-dessus du lac est balisé d’anneaux dorés… et de rochers flottants.', 'Through the tower window, a broom is waiting. The course over the lake is marked with golden rings… and floating rocks.', 'Qua cửa sổ tháp, một cây chổi đang chờ. Đường bay trên hồ được đánh dấu bằng vòng vàng… và đá lơ lửng.'),
        done: T('Tu reviens par la fenêtre, décoiffé·e mais victorieux·se. Le dernier anneau porte ◆ et un chiffre.', 'You fly back through the window, windswept but victorious. The last ring bears ◆ and a digit.', 'Bạn bay về qua cửa sổ, tóc rối bù nhưng chiến thắng. Chiếc vòng cuối mang ◆ và một chữ số.') },
      mirror: { type: 'mrune', dig: '♥', t: T('Le miroir aux runes', 'The rune mirror', 'Gương ký tự'), ctx: T('Au fond de la bibliothèque, un grand miroir ancien montre une rune… mais un miroir montre toujours les choses à l’envers.', 'At the back of the library, a tall old mirror shows a rune… but a mirror always shows things the wrong way round.', 'Cuối thư viện, một chiếc gương cổ lớn hiện ra một ký tự… nhưng gương luôn cho thấy mọi thứ bị lật ngược.'),
        done: T('La rune s’embrase dans le miroir, qui affiche : ♥ et un chiffre.', 'The rune blazes in the mirror, which shows: ♥ and a digit.', 'Ký tự bùng sáng trong gương, hiện ra: ♥ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [520, 420, 560, 360], n: T('Chaudron', 'Cauldron', 'Vạc'), click: g => g.pz('potion') },
      { v: 'a', r: [80, 520, 380, 200], n: T('Boîte à baguette', 'Wand box', 'Hộp đũa phép'), click: g => g.pz('wand') },
      { v: 'a', r: [620, 110, 360, 220], n: T('Parchemin flottant', 'Floating parchment', 'Cuộn giấy da'), click: g => g.doc('parch', true) },
      { v: 'a', r: [1120, 120, 400, 440], n: T('Étagères de flacons', 'Flask shelves', 'Kệ lọ thuốc'), click: g => say(g, T('Des flacons étiquetés : « Larmes de licorne (périmées) », « Poussière de lune », « Ne PAS ouvrir ».', 'Labelled flasks: “Unicorn tears (expired)”, “Moon dust”, “Do NOT open”.', 'Những lọ có nhãn: « Nước mắt kỳ lân (hết hạn) », « Bụi trăng », « KHÔNG được mở ».')) },
      { v: 'a', r: [1180, 600, 260, 160], n: T('Grimoire tombé', 'Fallen book', 'Cuốn sách rơi'), hid: true, click: g => g.doc('rules', true) },
      { v: 'b', r: [120, 160, 420, 520], n: T('Horloge', 'Clock', 'Đồng hồ'), click: g => g.pz('clock') },
      { v: 'b', r: [620, 420, 420, 300], n: T('Table des cartes', 'Chart table', 'Bàn bản đồ'), click: g => g.pz('stars') },
      { v: 'b', r: [1120, 100, 380, 520], n: T('Fenêtre et balai', 'Window and broom', 'Cửa sổ và chổi bay'), click: g => g.pz('broom') },
      { v: 'b', r: [660, 120, 300, 260], n: T('Télescope', 'Telescope', 'Kính thiên văn'), click: g => { g.note('scope', T('Au télescope : la constellation de la Chouette a la forme d’un serpent replié.', 'Through the telescope: the Owl constellation looks like a coiled snake.', 'Qua kính thiên văn: chòm sao Cú Mèo có hình con rắn cuộn.')); say(g, T('Dans le télescope, la constellation de la Chouette scintille. Il faudra la reconnaître, même tournée.', 'In the telescope, the Owl constellation twinkles. You will need to recognise it, even rotated.', 'Trong kính thiên văn, chòm sao Cú Mèo lấp lánh. Bạn cần nhận ra nó, kể cả khi bị xoay.')); } },
      { v: 'c', r: [560, 120, 480, 600], n: T('Grand miroir', 'Tall mirror', 'Gương lớn'), click: g => g.pz('mirror') },
      { v: 'c', r: [1180, 140, 340, 560], n: T('Grande porte', 'Great door', 'Cổng lớn'), fin: true },
      { v: 'c', r: [80, 160, 400, 520], n: T('Rayonnages', 'Bookshelves', 'Giá sách'), click: g => say(g, T('Des livres qui chuchotent quand on passe. L’un d’eux ronfle.', 'Books that whisper as you pass. One of them is snoring.', 'Những cuốn sách thì thầm khi bạn đi qua. Một cuốn đang ngáy.')) }
    ],
    goals: [
      [g => g.f.doc_parch, g => true, T('Lis le parchemin qui flotte dans le cachot.', 'Read the parchment floating in the dungeon.', 'Đọc cuộn giấy da lơ lửng trong hầm.')],
      [g => g.solved('potion'), g => true, T('Le chaudron : déduis la recette de la potion.', 'The cauldron: work out the potion recipe.', 'Chiếc vạc: suy ra công thức thuốc.')],
      [g => g.solved('wand'), g => true, T('La boîte à baguette : déchiffre le message avec la clé.', 'The wand box: decrypt the message with the key.', 'Hộp đũa phép: giải mã thông điệp bằng chìa khóa.')],
      [g => g.solved('clock'), g => true, T('Dans la tour, l’horloge attend que tu comprennes ses roues.', 'In the tower, the clock waits for you to understand its wheels.', 'Trên tháp, đồng hồ chờ bạn hiểu các bánh xe.')],
      [g => g.solved('stars'), g => true, T('Les cartes du ciel : retrouve la constellation tournée.', 'The star charts: find the rotated constellation.', 'Bản đồ sao: tìm chòm sao bị xoay.')],
      [g => g.solved('broom'), g => true, T('Par la fenêtre de la tour : la course de balais.', 'Through the tower window: the broom race.', 'Qua cửa sổ tháp: cuộc đua chổi bay.')],
      [g => g.solved('mirror'), g => g.has('candle'), T('Avec la bougie éternelle, va au miroir de la bibliothèque.', 'With the everlasting candle, go to the library mirror.', 'Mang nến vĩnh cửu đến chiếc gương trong thư viện.')]
    ]
  };

  // ============================ 13. LA FAMILLE CORSETTI ============================
  const mafia = {
    id: 'mafia', icon: '🎩', amb: ['lowpass', 700, .04], morse: null,
    name: T('La Famille Corsetti', 'The Corsetti Family', 'Gia đình Corsetti'),
    desc: T('Montréal, 1931 : la prohibition, un bar clandestin et une trahison.', 'Montréal, 1931: Prohibition, a speakeasy and a betrayal.', 'Montréal, 1931: lệnh cấm rượu, một quán bar lậu và một vụ phản bội.'),
    intro: T("Montréal, hiver 1931. Tu es le nouveau comptable d'une « boulangerie » du boulevard Saint-Laurent… qui cache le bar clandestin de la famille Corsetti. Cette nuit, le coffre du parrain a été vidé, et la police va débarquer. Tout le monde a filé, sauf toi, enfermé·e dans l'arrière-boutique. L'inspecteur Lachance te glisse un mot sous la porte : « Trouve qui a trahi, réunis les preuves, et la porte de service s'ouvrira. Six chiffres. »",
      "Montréal, winter 1931. You are the new bookkeeper of a “bakery” on Saint-Laurent Boulevard… which hides the Corsetti family's speakeasy. Tonight the boss's safe has been emptied, and the police are about to raid. Everyone has fled except you, locked in the back room. Inspector Lachance slips a note under the door: “Find out who betrayed, gather the evidence, and the service door will open. Six digits.”",
      'Montréal, mùa đông năm 1931. Bạn là kế toán mới của một « tiệm bánh » trên đại lộ Saint-Laurent… nơi che giấu quán bar lậu của gia đình Corsetti. Đêm nay két sắt của ông trùm bị vét sạch, và cảnh sát sắp ập đến. Mọi người đã chạy hết, trừ bạn, bị nhốt trong phòng sau. Thanh tra Lachance luồn một mẩu giấy qua khe cửa: « Hãy tìm kẻ phản bội, gom đủ bằng chứng, cửa sau sẽ mở. Sáu chữ số. »'),
    outro: T("La porte de service s'ouvre sur la ruelle enneigée. L'inspecteur Lachance t'attend sous un réverbère, le col relevé. Tu lui tends le livre de comptes, les relevés et le nom du traître. « Beau travail. Avec ça, la famille Corsetti ne vendra plus une seule bouteille à Montréal. » Il te tend une carte : « Si un jour tu veux un vrai métier… la police cherche des gens comme toi. »",
      "The service door opens onto the snowy alley. Inspector Lachance is waiting under a street lamp, collar turned up. You hand him the account book, the records and the traitor's name. “Fine work. With this, the Corsetti family won't sell another bottle in Montréal.” He hands you a card: “If you ever want a real job… the police need people like you.”",
      'Cửa sau mở ra con hẻm phủ tuyết. Thanh tra Lachance đứng chờ dưới ngọn đèn đường, cổ áo dựng cao. Bạn đưa ông cuốn sổ sách, các bản ghi và tên kẻ phản bội. « Làm tốt lắm. Với những thứ này, nhà Corsetti sẽ không bán thêm được chai rượu nào ở Montréal. » Ông đưa bạn một tấm danh thiếp: « Nếu có ngày muốn làm nghề tử tế… cảnh sát đang cần người như cậu. »'),
    views: {
      a: { scene: 'mafiaA', n: T('Le bar clandestin', 'The speakeasy', 'Quán bar lậu') },
      b: { scene: 'mafiaB', n: T('Le bureau du parrain', 'The boss’s office', 'Văn phòng ông trùm') },
      c: { scene: 'mafiaC', n: T('L’entrepôt du port', 'The harbour warehouse', 'Nhà kho bến cảng'), lock: g => !g.f.wkey,
        lockMsg: T('Le passage vers l’entrepôt est fermé par un cadenas. La clé doit être dans le bureau du parrain.', 'The passage to the warehouse is padlocked. The key must be in the boss’s office.', 'Lối sang nhà kho bị khóa bằng ổ khóa. Chìa khóa chắc ở trong văn phòng ông trùm.') }
    },
    order: ['a', 'b', 'c'],
    items: { key: { i: '🗝️', n: T('Clé de l’entrepôt', 'Warehouse key', 'Chìa khóa nhà kho'), d: T('Une lourde clé, avec une étiquette : « Quai 7 ».', 'A heavy key with a tag: “Pier 7”.', 'Một chiếc chìa khóa nặng, có thẻ ghi: « Cầu tàu 7 ».') } },
    combos: [],
    docs: {
      note: { s: 'paper', t: T('Le mot de l’inspecteur', 'The inspector’s note', 'Mẩu giấy của thanh tra'), b: T(
        "Je sais que tu n'y es pour rien. Aide-moi.\n\n★ la partie de poker\n● le téléphone sur écoute\n▲ le livre de comptes\n■ le partage des quartiers\n◆ la contrebande de l'entrepôt\n♥ le tableau des alibis\n\nLa clé de l'entrepôt est dans le bureau du parrain, sous le livre de comptes.\n— Insp. J. Lachance",
        "I know you're not involved. Help me.\n\n★ the poker game\n● the tapped phone\n▲ the account book\n■ the district map\n◆ the warehouse contraband\n♥ the alibi board\n\nThe warehouse key is in the boss's office, under the account book.\n— Insp. J. Lachance",
        'Tôi biết cậu không dính líu gì. Hãy giúp tôi.\n\n★ ván poker\n● điện thoại bị nghe lén\n▲ cuốn sổ sách\n■ bản đồ chia địa bàn\n◆ hàng lậu trong nhà kho\n♥ bảng chứng cứ ngoại phạm\n\nChìa khóa nhà kho nằm trong văn phòng ông trùm, dưới cuốn sổ sách.\n— Thanh tra J. Lachance') },
      press: { s: 'old', t: T('Coupure de journal', 'Newspaper clipping', 'Mẩu báo cũ'), b: T(
        "« PROHIBITION : LA POLICE SAISIT 300 CAISSES DE WHISKY AU PORT »\nLes enquêteurs soupçonnent une « boulangerie » du boulevard Saint-Laurent de servir de façade. Un informateur aurait permis la saisie… La famille Corsetti cherche activement le traître.",
        "“PROHIBITION: POLICE SEIZE 300 CRATES OF WHISKY AT THE HARBOUR”\nInvestigators suspect a “bakery” on Saint-Laurent Boulevard of being a front. An informer is said to have made the seizure possible… The Corsetti family is actively hunting the traitor.",
        '« LỆNH CẤM RƯỢU: CẢNH SÁT THU GIỮ 300 THÙNG WHISKY Ở BẾN CẢNG »\nCác điều tra viên nghi một « tiệm bánh » trên đại lộ Saint-Laurent là bình phong. Nghe nói có người chỉ điểm giúp vụ thu giữ… Nhà Corsetti đang ráo riết truy tìm kẻ phản bội.') }
    },
    pzs: {
      poker: { type: 'poker', dig: '★', t: T('La partie de poker', 'The poker game', 'Ván poker'), ctx: T('Sur la table de jeu, la dernière main est restée retournée. Le croupier jurait que le gagnant était le traître…', 'On the gaming table, the last hand was left face up. The dealer swore the winner was the traitor…', 'Trên bàn chơi, ván cuối vẫn còn để ngửa. Người chia bài thề rằng người thắng chính là kẻ phản bội…'),
        done: T('Sous le tapis vert du gagnant : ★ et un chiffre.', 'Under the winner’s green cloth: ★ and a digit.', 'Dưới tấm thảm xanh của người thắng: ★ và một chữ số.') },
      phone: { type: 'rotary', dig: '●', t: T('Le téléphone sur écoute', 'The tapped phone', 'Điện thoại bị nghe lén'), ctx: T('Un appareil d’écoute est branché sur le téléphone du bar. Il a enregistré le dernier numéro composé.', 'A listening device is wired into the bar phone. It recorded the last number dialled.', 'Một thiết bị nghe lén được gắn vào điện thoại của quán. Nó đã ghi lại số vừa được quay.'),
        done: T('Ce numéro, c’est celui du commissariat ! L’enregistreur affiche ● et un chiffre.', 'That number is the police station’s! The recorder shows ● and a digit.', 'Đó là số của đồn cảnh sát! Máy ghi hiện ● và một chữ số.') },
      ledger: { type: 'ledger', dig: '▲', t: T('Le livre de comptes', 'The account book', 'Cuốn sổ sách'), ctx: T('Le grand livre du parrain. Quelqu’un a « arrangé » les chiffres pour cacher un vol.', 'The boss’s ledger. Someone “adjusted” the figures to hide a theft.', 'Cuốn sổ cái của ông trùm. Có người đã « sửa » số liệu để che giấu một vụ trộm.'),
        done: T('La ligne trafiquée est soulignée à l’encre rouge : ▲ et un chiffre. Sous le livre, une clé !', 'The forged line is underlined in red ink: ▲ and a digit. Under the book, a key!', 'Dòng bị sửa được gạch chân bằng mực đỏ: ▲ và một chữ số. Dưới cuốn sổ có một chiếc chìa khóa!'), ok: g => g.take('key') },
      map: { type: 'shikaku', dig: '■', t: T('Le partage des quartiers', 'The district map', 'Bản đồ chia địa bàn'), ctx: T('Sur le mur, la carte de Montréal que les familles se disputent. Chaque famille a droit à un quartier rectangulaire d’une taille précise.', 'On the wall, the map of Montréal the families fight over. Each family gets a rectangular district of a precise size.', 'Trên tường là bản đồ Montréal mà các gia đình tranh giành. Mỗi gia đình được một địa bàn hình chữ nhật với kích thước nhất định.'),
        done: T('Le partage est parfait. Au dos de la carte : ■ et un chiffre.', 'The split is perfect. On the back of the map: ■ and a digit.', 'Cách chia hoàn hảo. Mặt sau bản đồ: ■ và một chữ số.') },
      cargo: { type: 'knap', dig: '◆', t: T('La contrebande', 'The contraband', 'Hàng lậu'), ctx: T('Le dernier camion doit partir avant la police. On ne peut pas tout prendre : choisis bien.', 'The last truck must leave before the police arrive. You can’t take everything: choose well.', 'Chuyến xe cuối phải đi trước khi cảnh sát đến. Không thể mang hết: hãy chọn khéo.'),
        done: T('Le camion part chargé de preuves pour l’inspecteur. Sur la bâche : ◆ et un chiffre.', 'The truck leaves loaded with evidence for the inspector. On the tarpaulin: ◆ and a digit.', 'Xe tải chạy đi, chở đầy bằng chứng cho thanh tra. Trên tấm bạt: ◆ và một chữ số.') },
      alibi: { type: 'alibi', dig: '♥', t: T('Le tableau des alibis', 'The alibi board', 'Bảng chứng cứ ngoại phạm'), ctx: T('Le contremaître a épinglé les alibis de chacun et les témoignages des dockers.', 'The foreman pinned up everyone’s alibis and the dockers’ sightings.', 'Quản đốc đã ghim lời khai của từng người và lời kể của các phu bến cảng.'),
        done: T('Le traître est démasqué. Derrière sa photo : ♥ et un chiffre.', 'The traitor is unmasked. Behind their photo: ♥ and a digit.', 'Kẻ phản bội đã lộ mặt. Sau tấm ảnh: ♥ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [480, 500, 640, 280], n: T('Table de poker', 'Poker table', 'Bàn poker'), click: g => g.pz('poker') },
      { v: 'a', r: [1240, 260, 200, 260], n: T('Téléphone', 'Telephone', 'Điện thoại'), click: g => g.pz('phone') },
      { v: 'a', r: [380, 120, 840, 280], n: T('Comptoir et bouteilles', 'Bar and bottles', 'Quầy rượu'), click: g => say(g, T('Des bouteilles « de sirop » partout. Ça sent le whisky à plein nez.', '“Syrup” bottles everywhere. It reeks of whisky.', 'Đầy những chai « si-rô ». Mùi whisky nồng nặc.')) },
      { v: 'a', r: [60, 600, 260, 200], n: T('Mot sous la porte', 'Note under the door', 'Mẩu giấy dưới cửa'), click: g => g.doc('note', true) },
      { v: 'a', r: [1380, 640, 160, 140], n: T('Journal froissé', 'Crumpled newspaper', 'Tờ báo nhàu'), hid: true, click: g => g.doc('press', true) },
      { v: 'b', r: [560, 460, 480, 260], n: T('Bureau et livre de comptes', 'Desk and ledger', 'Bàn và sổ sách'), click: g => g.pz('ledger') },
      { v: 'b', r: [80, 120, 420, 380], n: T('Carte de Montréal', 'Map of Montréal', 'Bản đồ Montréal'), click: g => g.pz('map') },
      { v: 'b', r: [1140, 160, 340, 460], n: T('Coffre vide', 'Empty safe', 'Két sắt trống'), click: g => say(g, T('Le coffre du parrain est grand ouvert… et vide. Pas une trace d’effraction : le voleur connaissait la combinaison.', 'The boss’s safe is wide open… and empty. No sign of forced entry: the thief knew the combination.', 'Két sắt của ông trùm mở toang… và trống rỗng. Không có dấu vết phá khóa: kẻ trộm biết mã số.')) },
      { v: 'c', r: [100, 380, 880, 400], n: T('Caisses de contrebande', 'Contraband crates', 'Thùng hàng lậu'), click: g => g.pz('cargo') },
      { v: 'c', r: [1060, 120, 380, 320], n: T('Tableau des alibis', 'Alibi board', 'Bảng ngoại phạm'), click: g => g.pz('alibi') },
      { v: 'c', r: [1240, 480, 260, 320], n: T('Porte de service', 'Service door', 'Cửa sau'), fin: true }
    ],
    goals: [
      [g => g.f.doc_note, g => true, T('Un mot a été glissé sous la porte du bar.', 'A note was slipped under the bar door.', 'Có mẩu giấy được luồn dưới cửa quán.')],
      [g => g.solved('poker'), g => true, T('La table de poker : trouve la main gagnante.', 'The poker table: find the winning hand.', 'Bàn poker: tìm bài thắng.')],
      [g => g.solved('phone'), g => true, T('Le téléphone : compte les déclics de l’enregistrement.', 'The phone: count the clicks on the recording.', 'Điện thoại: đếm tiếng tách trong bản ghi.')],
      [g => g.solved('ledger'), g => true, T('Dans le bureau, le livre de comptes cache une ligne trafiquée.', 'In the office, the ledger hides a forged line.', 'Trong văn phòng, cuốn sổ sách giấu một dòng bị sửa.')],
      [g => g.solved('map'), g => true, T('La carte de Montréal : partage les quartiers.', 'The map of Montréal: split the districts.', 'Bản đồ Montréal: chia địa bàn.')],
      [g => g.f.wkey, g => g.has('key'), T('La clé ouvre le passage vers l’entrepôt.', 'The key opens the passage to the warehouse.', 'Chìa khóa mở lối sang nhà kho.')],
      [g => g.solved('cargo'), g => g.f.wkey, T('Dans l’entrepôt, charge le camion.', 'In the warehouse, load the truck.', 'Trong nhà kho, chất hàng lên xe.')],
      [g => g.solved('alibi'), g => g.f.wkey, T('Le tableau des alibis : trouve qui ment.', 'The alibi board: find who is lying.', 'Bảng ngoại phạm: tìm ai nói dối.')]
    ]
  };
  mafia.views.c.unlock = g => { if (!g.has('key')) return false; g.set('wkey'); g.drop('key'); g.say(T('Le cadenas cède. Une odeur de sel et de bois mouillé : l’entrepôt du port.', 'The padlock gives. A smell of salt and wet wood: the harbour warehouse.', 'Ổ khóa bật ra. Mùi muối và gỗ ẩm: nhà kho bến cảng.')); return true; };

  // ============================ 14. L'AGORA DU TEMPS ============================
  const philo = {
    id: 'philo', icon: '🏛️', amb: ['bandpass', 1200, .02], morse: null,
    name: T('L’Agora du temps', 'The Agora of Time', 'Quảng trường thời gian'),
    desc: T('Socrate, Platon, Descartes, Rousseau, Marx et Hồ Chí Minh t’attendent.', 'Socrates, Plato, Descartes, Rousseau, Marx and Hồ Chí Minh are waiting for you.', 'Socrates, Plato, Descartes, Rousseau, Marx và Hồ Chí Minh đang chờ bạn.'),
    intro: T("Tu t'es endormi·e à la bibliothèque, la tête sur un livre d'histoire des idées. Tu te réveilles sous un ciel doré, au milieu d'une agora de marbre où se croisent des penseurs de toutes les époques. Un vieil homme pieds nus s'approche : « Je suis Socrate. Ici, personne ne sort sans avoir réfléchi. Six penseurs, six épreuves. La porte du temps s'ouvrira avec six chiffres. »",
      "You fell asleep in the library, your head on a history-of-ideas book. You wake under a golden sky, in a marble agora where thinkers from every era cross paths. A barefoot old man approaches: “I am Socrates. Here, nobody leaves without thinking. Six thinkers, six trials. The door of time will open with six digits.”",
      'Bạn ngủ quên trong thư viện, gục đầu lên cuốn sách lịch sử tư tưởng. Bạn tỉnh dậy dưới bầu trời vàng óng, giữa một quảng trường cẩm thạch nơi các nhà tư tưởng của mọi thời đại gặp nhau. Một ông lão chân trần tiến lại: « Ta là Socrates. Ở đây, không ai ra về mà không suy nghĩ. Sáu nhà tư tưởng, sáu thử thách. Cánh cửa thời gian sẽ mở bằng sáu chữ số. »'),
    outro: T("La porte du temps s'ouvre dans un souffle de lumière. Socrate te sourit : « Je sais que je ne sais rien… mais toi, tu as appris à réfléchir. » Tu te réveilles à la bibliothèque. Sur ton livre ouvert, quelqu'un a écrit au crayon : « Continue de te poser des questions. »",
      "The door of time opens in a breath of light. Socrates smiles at you: “I know that I know nothing… but you have learnt to think.” You wake up in the library. On your open book, someone has written in pencil: “Keep asking questions.”",
      'Cánh cửa thời gian mở ra trong một luồng sáng. Socrates mỉm cười với bạn: « Ta biết rằng ta không biết gì… nhưng con thì đã học được cách suy nghĩ. » Bạn tỉnh dậy trong thư viện. Trên cuốn sách đang mở, ai đó viết bằng bút chì: « Hãy tiếp tục đặt câu hỏi. »'),
    views: {
      a: { scene: 'philoA', n: T('L’agora d’Athènes', 'The Athenian agora', 'Quảng trường Athens') },
      b: { scene: 'philoB', n: T('Le salon des Lumières', 'The Enlightenment salon', 'Phòng khách thời Khai sáng') },
      c: { scene: 'philoC', n: T('La grande bibliothèque', 'The great library', 'Thư viện lớn'), dark: g => true, light: 'lantern' }
    },
    order: ['a', 'b', 'c'],
    items: { lantern: { i: '🏮', n: T('Lanterne de Diogène', 'Diogenes’ lantern', 'Đèn lồng của Diogenes'), d: T('La lanterne du philosophe Diogène, qui « cherchait un homme » en plein jour.', 'The lantern of the philosopher Diogenes, who “looked for an honest man” in broad daylight.', 'Chiếc đèn lồng của triết gia Diogenes, người « đi tìm một con người » giữa ban ngày.') } },
    combos: [],
    docs: {
      scroll: { s: 'old', t: T('Le rouleau de l’agora', 'The agora scroll', 'Cuộn sách ở quảng trường'), b: T(
        "Six penseurs, six épreuves :\n★ Socrate, qui interroge (Athènes, Ve siècle av. J.-C.)\n● Platon, et ses solides parfaits (Athènes, IVe siècle av. J.-C.)\n▲ Descartes, et son repère (France, XVIIe siècle)\n■ Rousseau, et la volonté générale (Genève, XVIIIe siècle)\n◆ Marx, et la valeur des marchandises (Londres, XIXe siècle)\n♥ Hồ Chí Minh, et le long voyage d'une vie (Vietnam, XXe siècle)\n\nLa grande bibliothèque est obscure. Diogène se promène toujours avec une lanterne…",
        "Six thinkers, six trials:\n★ Socrates, who questions (Athens, 5th century BC)\n● Plato, and his perfect solids (Athens, 4th century BC)\n▲ Descartes, and his coordinate grid (France, 17th century)\n■ Rousseau, and the general will (Geneva, 18th century)\n◆ Marx, and the value of commodities (London, 19th century)\n♥ Hồ Chí Minh, and the long journey of a life (Vietnam, 20th century)\n\nThe great library is dark. Diogenes always walks around with a lantern…",
        'Sáu nhà tư tưởng, sáu thử thách:\n★ Socrates, người luôn đặt câu hỏi (Athens, thế kỷ V TCN)\n● Plato, với các khối hoàn hảo (Athens, thế kỷ IV TCN)\n▲ Descartes, với hệ trục tọa độ (Pháp, thế kỷ XVII)\n■ Rousseau, với ý chí chung (Genève, thế kỷ XVIII)\n◆ Marx, với giá trị của hàng hóa (London, thế kỷ XIX)\n♥ Hồ Chí Minh, với hành trình dài của một đời người (Việt Nam, thế kỷ XX)\n\nThư viện lớn tối om. Diogenes thì lúc nào cũng mang theo đèn lồng…') },
      quotes: { s: 'paper', t: T('Carnet de citations', 'Book of quotations', 'Sổ trích dẫn'), b: T(
        "« Je sais que je ne sais rien. » — attribuée à Socrate\n« Je pense, donc je suis. » — Descartes, Discours de la méthode (1637)\n« L'homme est né libre, et partout il est dans les fers. » — Rousseau, Du contrat social (1762)\n« Les philosophes n'ont fait qu'interpréter le monde de différentes manières ; ce qui importe, c'est de le transformer. » — Marx, Thèses sur Feuerbach (1845)\n« Rien n'est plus précieux que l'indépendance et la liberté. » — Hồ Chí Minh (1966)",
        "“I know that I know nothing.” — attributed to Socrates\n“I think, therefore I am.” — Descartes, Discourse on the Method (1637)\n“Man is born free, and everywhere he is in chains.” — Rousseau, The Social Contract (1762)\n“The philosophers have only interpreted the world in various ways; the point is to change it.” — Marx, Theses on Feuerbach (1845)\n“Nothing is more precious than independence and freedom.” — Hồ Chí Minh (1966)",
        '« Tôi biết rằng tôi không biết gì. » — được cho là của Socrates\n« Tôi tư duy, nên tôi tồn tại. » — Descartes, Luận về phương pháp (1637)\n« Con người sinh ra tự do, nhưng ở đâu cũng bị xiềng xích. » — Rousseau, Khế ước xã hội (1762)\n« Các nhà triết học chỉ giải thích thế giới bằng nhiều cách khác nhau; vấn đề là cải tạo nó. » — Marx, Luận cương về Feuerbach (1845)\n« Không có gì quý hơn độc lập, tự do. » — Hồ Chí Minh (1966)') }
    },
    pzs: {
      socrates: { type: 'syllog', dig: '★', t: T('Le dialogue de Socrate', 'Socrates’ dialogue', 'Cuộc đối thoại của Socrates'), ctx: T('Socrate s’assoit sur une marche : « Ne crois rien parce qu’on te le dit. Dis-moi plutôt ce qui découle vraiment de ce que tu sais. »', 'Socrates sits on a step: “Believe nothing just because you are told. Tell me instead what truly follows from what you know.”', 'Socrates ngồi xuống bậc thềm: « Đừng tin điều gì chỉ vì người ta nói. Hãy cho ta biết điều gì thực sự suy ra được từ những gì con biết. »'),
        done: T('« Bien raisonné ! » Socrate trace dans le sable : ★ et un chiffre.', '“Well reasoned!” Socrates draws in the sand: ★ and a digit.', '« Lập luận tốt lắm! » Socrates vẽ trên cát: ★ và một chữ số.') },
      plato: { type: 'euler', dig: '●', t: T('Les solides de Platon', 'Plato’s solids', 'Các khối của Plato'), ctx: T('Platon fait tourner des solides de cristal : « Ces formes parfaites cachent une loi que tout géomètre devrait connaître. »', 'Plato turns crystal solids in his hands: “These perfect shapes hide a law every geometer should know.”', 'Plato xoay những khối pha lê trong tay: « Những hình hoàn hảo này ẩn chứa một định luật mà nhà hình học nào cũng nên biết. »'),
        done: T('Les cristaux s’alignent et reflètent ● et un chiffre.', 'The crystals line up and reflect ● and a digit.', 'Các khối pha lê xếp thẳng hàng và phản chiếu ● cùng một chữ số.') },
      descartes: { type: 'cartesian', dig: '▲', t: T('Le repère de Descartes', 'Descartes’ grid', 'Hệ trục của Descartes'), ctx: T('Descartes regarde une mouche se poser sur un plafond quadrillé : « Deux nombres suffisent pour dire où elle est. »', 'Descartes watches a fly land on a tiled ceiling: “Two numbers are enough to say where it is.”', 'Descartes nhìn một con ruồi đậu trên trần nhà kẻ ô: « Chỉ cần hai con số là biết nó ở đâu. »'),
        done: T('« Je pense, donc je trouve ! » Sur le quadrillage : ▲ et un chiffre.', '“I think, therefore I find!” On the grid: ▲ and a digit.', '« Tôi tư duy, nên tôi tìm ra! » Trên lưới: ▲ và một chữ số.') },
      rousseau: { type: 'condorcet', dig: '■', t: T('Le vote de la cité', 'The city vote', 'Cuộc bỏ phiếu của thành bang'), ctx: T('Rousseau te tend les bulletins de l’assemblée : « La volonté générale n’est pas toujours celle du plus grand nombre de premiers choix. »', 'Rousseau hands you the assembly’s ballots: “The general will is not always the one with the most first choices.”', 'Rousseau đưa bạn các lá phiếu của hội đồng: « Ý chí chung không phải lúc nào cũng là lựa chọn được nhiều người xếp đầu nhất. »'),
        done: T('La cité adopte le projet. Sur l’urne : ■ et un chiffre.', 'The city adopts the project. On the ballot box: ■ and a digit.', 'Thành bang thông qua dự án. Trên hòm phiếu: ■ và một chữ số.') },
      marx: { type: 'barter', dig: '◆', t: T('La valeur des marchandises', 'The value of commodities', 'Giá trị của hàng hóa'), ctx: T('Dans la salle de lecture, Marx feuillette ses notes : « 20 aunes de toile = 1 habit… Chaque marchandise exprime sa valeur dans une autre. Fais le calcul. »', 'In the reading room, Marx leafs through his notes: “20 yards of linen = 1 coat… Every commodity expresses its value in another. Do the sum.”', 'Trong phòng đọc, Marx lật giở ghi chép: « 20 thước vải = 1 áo khoác… Mỗi hàng hóa biểu hiện giá trị của nó qua một hàng hóa khác. Hãy tính đi. »'),
        done: T('Marx hoche la tête et souligne : ◆ et un chiffre.', 'Marx nods and underlines: ◆ and a digit.', 'Marx gật đầu và gạch chân: ◆ và một chữ số.') },
      hcm: { type: 'timeline', dig: '♥', t: T('Le voyage d’une vie', 'A life’s journey', 'Hành trình một đời người'), ctx: T('Sur un globe ancien, des étiquettes racontent le parcours de Hồ Chí Minh, parti de Saïgon en 1911 et revenu trente ans plus tard. Elles se sont mélangées.', 'On an old globe, labels tell the journey of Hồ Chí Minh, who left Saigon in 1911 and came back thirty years later. They have got mixed up.', 'Trên một quả địa cầu cũ, những tấm nhãn kể lại hành trình của Hồ Chí Minh, người rời Sài Gòn năm 1911 và trở về ba mươi năm sau. Chúng đã bị xáo trộn.'),
        done: T('Le globe tourne et s’arrête sur le Vietnam : ♥ et un chiffre.', 'The globe spins and stops on Vietnam: ♥ and a digit.', 'Quả địa cầu quay rồi dừng ở Việt Nam: ♥ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [200, 420, 420, 360], n: T('Socrate', 'Socrates', 'Socrates'), click: g => g.pz('socrates') },
      { v: 'a', r: [940, 400, 420, 380], n: T('Platon', 'Plato', 'Plato'), click: g => g.pz('plato') },
      { v: 'a', r: [660, 560, 260, 200], n: T('Rouleau', 'Scroll', 'Cuộn sách'), click: g => g.doc('scroll', true) },
      { v: 'a', r: [1400, 520, 160, 240], n: T('Tonneau', 'Barrel', 'Thùng gỗ'), hid: true, click: g => { if (g.has('lantern') || g.f.lant) return say(g, T('Diogène dort dans son tonneau.', 'Diogenes is asleep in his barrel.', 'Diogenes đang ngủ trong thùng gỗ.')); g.set('lant'); g.take('lantern'); say(g, T('Diogène sort de son tonneau : « Tu me caches le soleil… Tiens, prends ma lanterne, j’ai trouvé l’humain que je cherchais. »', 'Diogenes climbs out of his barrel: “You’re blocking my sun… Here, take my lantern, I’ve found the person I was looking for.”', 'Diogenes chui ra khỏi thùng: « Con che mất nắng của ta rồi… Đây, cầm lấy đèn lồng của ta, ta đã tìm thấy con người mà ta tìm kiếm. »')); } },
      { v: 'b', r: [120, 160, 460, 540], n: T('Descartes', 'Descartes', 'Descartes'), click: g => g.pz('descartes') },
      { v: 'b', r: [960, 180, 460, 540], n: T('Rousseau', 'Rousseau', 'Rousseau'), click: g => g.pz('rousseau') },
      { v: 'b', r: [640, 520, 300, 220], n: T('Carnet de citations', 'Book of quotations', 'Sổ trích dẫn'), click: g => g.doc('quotes', true) },
      { v: 'c', r: [120, 300, 500, 460], n: T('Marx', 'Marx', 'Marx'), click: g => g.pz('marx') },
      { v: 'c', r: [700, 300, 360, 440], n: T('Globe', 'Globe', 'Quả địa cầu'), click: g => g.pz('hcm') },
      { v: 'c', r: [1180, 120, 340, 600], n: T('Porte du temps', 'Door of time', 'Cánh cửa thời gian'), fin: true }
    ],
    goals: [
      [g => g.f.doc_scroll, g => true, T('Un rouleau est posé au centre de l’agora.', 'A scroll lies in the middle of the agora.', 'Có một cuộn sách đặt giữa quảng trường.')],
      [g => g.solved('socrates'), g => true, T('Socrate t’attend pour un dialogue.', 'Socrates is waiting for a dialogue.', 'Socrates đang chờ đối thoại.')],
      [g => g.solved('plato'), g => true, T('Platon et ses solides parfaits.', 'Plato and his perfect solids.', 'Plato và các khối hoàn hảo.')],
      [g => g.solved('descartes'), g => true, T('Dans le salon, place les points de Descartes.', 'In the salon, plot Descartes’ points.', 'Trong phòng khách, đặt các điểm của Descartes.')],
      [g => g.solved('rousseau'), g => true, T('Rousseau : trouve le projet qui gagne tous ses duels.', 'Rousseau: find the project that wins every duel.', 'Rousseau: tìm dự án thắng mọi cuộc đấu tay đôi.')],
      [g => g.has('lantern') || g.f.lant, g => true, T('La bibliothèque est noire. Un philosophe dort dans un tonneau, sur l’agora…', 'The library is dark. A philosopher sleeps in a barrel, on the agora…', 'Thư viện tối om. Có một triết gia ngủ trong thùng gỗ ở quảng trường…')],
      [g => g.solved('marx'), g => g.has('lantern'), T('Dans la bibliothèque, Marx compare les marchandises.', 'In the library, Marx compares commodities.', 'Trong thư viện, Marx so sánh các hàng hóa.')],
      [g => g.solved('hcm'), g => g.has('lantern'), T('Le globe : remets en ordre le voyage de Hồ Chí Minh.', 'The globe: put Hồ Chí Minh’s journey in order.', 'Quả địa cầu: sắp xếp lại hành trình của Hồ Chí Minh.')]
    ]
  };

  window.Content.push(magic, mafia, philo);
})();

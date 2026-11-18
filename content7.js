// Scénarios 6 et 7 : « La maison des lanternes » (Hội An, fête de la mi-automne) et « Le train de nuit » (tempête près de Mont-Joli).
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });
  const { rand, shuffle } = window.Logic;

  // ============================ 6. LA MAISON DES LANTERNES ============================
  const LTYPES = T(['lanternes de soie rouge', 'lanternes en forme de lotus', 'lanternes étoiles', 'lanternes carpes', 'lanternes lunes'],
    ['red silk lanterns', 'lotus lanterns', 'star lanterns', 'carp lanterns', 'moon lanterns'],
    ['đèn lồng lụa đỏ', 'đèn hoa sen', 'đèn ông sao', 'đèn cá chép', 'đèn mặt trăng']);
  const lantern = {
    id: 'lantern', icon: '🏮', amb: ['bandpass', 1800, .025], morse: null,
    name: T('La maison des lanternes', 'The Lantern House', 'Ngôi nhà đèn lồng'),
    desc: T('Hội An, la nuit de la fête de la mi-automne.', 'Hội An, on the night of the Mid-Autumn Festival.', 'Hội An, đêm Tết Trung Thu.'),
    intro: T("Hội An, la nuit de la fête de la mi-automne. Tu es l'apprenti(e) du vieux maître Châu, fabricant de lanternes. Ce soir, toute la ville descend vers la rivière… mais le maître est parti en verrouillant la maison derrière lui. Sur l'établi, une lettre t'attend. Dehors, les tambours de la fête résonnent déjà.",
      "Hội An, on the night of the Mid-Autumn Festival. You are the apprentice of old Master Châu, a lantern maker. Tonight the whole town is heading down to the river… but the master has left, locking the house behind him. On the workbench, a letter is waiting for you. Outside, the festival drums are already beating.",
      'Hội An, đêm Tết Trung Thu. Bạn là học trò của cụ Châu, người thợ làm đèn lồng lâu năm. Tối nay cả phố kéo nhau xuống bờ sông… nhưng cụ đã ra ngoài và khóa cửa nhà lại. Trên bàn làm việc có một lá thư đang chờ bạn. Ngoài kia, tiếng trống hội đã rộn ràng.'),
    outro: T("Le verrou de bronze cède et le portail s'ouvre sur la rue illuminée. Sur la rivière, des centaines de lanternes flottent sous la pleine lune. Le maître Châu t'attend sur le pont, avec sa petite-fille Mai : « Tu es prêt(e). L'an prochain, c'est toi qui feras la lanterne de la lune. »",
      "The bronze bolt gives way and the gate opens onto the glowing street. On the river, hundreds of lanterns float beneath the full moon. Master Châu is waiting for you on the bridge with his granddaughter Mai: 'You are ready. Next year, you will make the moon lantern.'",
      'Chốt đồng bật ra, cánh cổng mở ra con phố rực rỡ ánh đèn. Trên sông, hàng trăm chiếc đèn hoa đăng trôi dưới trăng rằm. Cụ Châu cùng cháu gái Mai đang đợi bạn trên cầu: « Con đã sẵn sàng rồi. Năm sau, chính con sẽ làm chiếc đèn mặt trăng. »'),
    views: {
      a: { scene: 'lanternA', n: T('L’atelier', 'The workshop', 'Xưởng làm đèn') },
      b: { scene: 'lanternB', n: T('La cour', 'The courtyard', 'Sân trong') },
      c: { scene: 'lanternC', n: T('Le salon des ancêtres', 'The ancestors’ hall', 'Gian thờ tổ tiên'), lock: g => !g.f.drum,
        lockMsg: T('La porte du salon des ancêtres est close. Un écriteau : « On n’entre ici qu’au rythme du tambour du maître. »', 'The door of the ancestors’ hall is shut. A sign says: “Enter only to the rhythm of the master’s drum.”', 'Cửa gian thờ đóng kín. Tấm biển ghi: « Chỉ được vào theo nhịp trống của thầy. »') }
    },
    order: ['a', 'b', 'c'],
    init(g) {
      const v = g.v, lv = g.lvl, n = [1, 3, 4][lv], max = [9999, 3000, 25000][lv];
      v.lines = shuffle([0, 1, 2, 3, 4]).slice(0, n).map(k => [k, lv === 0 ? 1000 + rand(9000) : 100 + rand(max - 100)]);
      v.total = v.lines.reduce((s, l) => s + l[1], 0);
    },
    items: {},
    combos: [],
    docs: {
      master: { s: 'old', t: T('La lettre du maître Châu', 'Master Châu’s letter', 'Thư của cụ Châu'), b: T(
        "Mon apprenti(e),\n\nJe pars à la fête avec Mai. Toi, tu as une dernière épreuve : prouver que tu connais tous les secrets de l'atelier.\n\nJ'ai fermé le portail avec le vieux verrou de bronze. Il porte six symboles : ★ ● ▲ ■ ◆ ♥. Chaque chiffre est caché dans ce que je t'ai appris : les couleurs, les motifs, les comptes, le bassin, le calendrier et les devinettes de grand-mère.\n\nLe salon des ancêtres ne s'ouvre qu'au rythme de mon tambour. Tu l'as entendu mille fois.\n\nRejoins-nous au pont avant que la lune ne soit au plus haut.\n— Châu",
        "My apprentice,\n\nI am off to the festival with Mai. You have one last test: prove that you know every secret of the workshop.\n\nI have shut the gate with the old bronze bolt. It bears six symbols: ★ ● ▲ ■ ◆ ♥. Each digit is hidden in something I taught you: colours, patterns, accounts, the pond, the calendar and grandmother's riddles.\n\nThe ancestors' hall only opens to the rhythm of my drum. You have heard it a thousand times.\n\nJoin us at the bridge before the moon is at its highest.\n— Châu",
        'Con của thầy,\n\nThầy đi xem hội cùng bé Mai. Con còn một thử thách cuối cùng: chứng minh con đã biết hết bí mật của xưởng.\n\nThầy đã khóa cổng bằng chiếc chốt đồng cũ. Nó mang sáu ký hiệu: ★ ● ▲ ■ ◆ ♥. Mỗi chữ số được giấu trong những gì thầy đã dạy con: màu sắc, hoa văn, sổ sách, hồ cá, lịch âm và những câu đố của bà.\n\nGian thờ tổ tiên chỉ mở theo nhịp trống của thầy. Con đã nghe nó cả nghìn lần rồi.\n\nHãy đến cầu gặp thầy trước khi trăng lên cao nhất.\n— Châu') },
      order: { s: 'paper', t: T('Bon de commande', 'Order form', 'Phiếu đặt hàng'), b: g => g.X(T('Commande pour la fête — à reporter sur le boulier :', 'Festival order — to be entered on the abacus:', 'Đơn hàng cho ngày hội — ghi lên bàn tính:')) + '\n\n' + g.v.lines.map(([k, n]) => `• ${n} ${g.X(LTYPES)[k]}`).join('\n') + (g.lvl === 0 ? '' : '\n\n' + g.X(T('« Le boulier doit montrer le total de la commande. »', '“The abacus must show the order total.”', '« Bàn tính phải hiện tổng số đơn hàng. »'))) },
      well: { s: 'note', t: T('Le mot de Mai', 'Mai’s note', 'Mẩu giấy của Mai'), b: T(
        "Psst ! C'est Mai. Grand-père frappe toujours le tambour avant d'entrer chez les ancêtres. Des coups courts et des coups longs… écoute-le bien, et refais exactement pareil.\n\nEt pour les carpes : grand-père dit que la dorée ne sort jamais la première, il faut d'abord faire de la place.",
        "Psst! It's Mai. Grandpa always beats the drum before going in to the ancestors. Short beats and long beats… listen carefully and do exactly the same.\n\nAnd about the carp: Grandpa says the golden one never gets out first, you have to make room before.",
        'Suỵt! Mai đây. Ông luôn đánh trống trước khi vào gian thờ. Có tiếng ngắn, có tiếng dài… nghe kỹ rồi làm y hệt nhé.\n\nCòn chuyện cá chép: ông bảo con cá vàng không bao giờ ra trước, phải dọn đường cho nó đã.') },
      grandma: { s: 'old', t: T('La lettre de grand-mère', 'Grandmother’s letter', 'Thư của bà'), b: T(
        "Pour l'apprenti(e) de mon mari,\n\nQuand j'étais jeune, je fabriquais les lanternes avec lui. Chaque année, à la mi-automne, nous posions des devinettes aux enfants du quartier, et ceux qui répondaient recevaient un gâteau de lune.\n\nNotre calendrier est celui de la lune : les années s'appellent comme les douze animaux, et chez nous, c'est le chat qui remplace le lapin.\n\nQue ta lanterne brille longtemps.\n— Bà Lan",
        "To my husband's apprentice,\n\nWhen I was young, I made lanterns with him. Every year at Mid-Autumn we would ask the neighbourhood children riddles, and those who answered got a mooncake.\n\nOur calendar is the moon's: years are named after the twelve animals, and here it is the cat that replaces the rabbit.\n\nMay your lantern shine for a long time.\n— Bà Lan",
        'Gửi người học trò của ông nhà tôi,\n\nHồi còn trẻ, tôi cùng ông làm đèn lồng. Năm nào cũng vậy, cứ đến Trung Thu, chúng tôi lại ra câu đố cho bọn trẻ trong xóm, ai trả lời đúng thì được một chiếc bánh trung thu.\n\nLịch của chúng ta là lịch âm: các năm mang tên mười hai con giáp, và ở nhà mình, con mèo thay cho con thỏ.\n\nChúc chiếc đèn của con luôn rực sáng.\n— Bà Lan') }
    },
    pzs: {
      mix: { type: 'mix', dig: '★', t: T('Les pots de teinture', 'The dye pots', 'Những hũ thuốc nhuộm'), ctx: T('Un carré de soie est épinglé au mur : la couleur exacte de la lanterne de la lune. « Retrouve-la avec mes teintures. »', 'A square of silk is pinned to the wall: the exact colour of the moon lantern. “Match it with my dyes.”', 'Một mảnh lụa ghim trên tường: đúng màu của chiếc đèn mặt trăng. « Hãy pha lại màu này bằng thuốc nhuộm của thầy. »'),
        done: T('La soie a pris la bonne teinte. Au fond du pot, une petite plaque : ★ et un chiffre.', 'The silk has taken the right shade. At the bottom of the pot, a small plate: ★ and a digit.', 'Mảnh lụa đã lên đúng màu. Dưới đáy hũ có một miếng đồng nhỏ: ★ và một chữ số.') },
      symmetry: { type: 'symmetry', dig: '●', t: T('Le cadre de soie', 'The silk frame', 'Khung lụa'), ctx: T('Le motif de la lanterne n’est peint qu’à moitié. « Une belle lanterne est la même des deux côtés. »', 'The lantern pattern is only half painted. “A fine lantern is the same on both sides.”', 'Họa tiết đèn mới vẽ được một nửa. « Đèn đẹp là đèn hai bên như nhau. »'),
        done: T('Le motif est parfait. Au centre apparaît un ● et un chiffre.', 'The pattern is perfect. In the centre appear a ● and a digit.', 'Họa tiết đã hoàn hảo. Ở giữa hiện ra dấu ● và một chữ số.') },
      abacus: { type: 'abacus', dig: '▲', target: g => g.v.total, t: T('Le boulier du comptoir', 'The counter abacus', 'Bàn tính trên quầy'), ctx: T('Le maître tient ses comptes au boulier. Le bon de commande est rangé dans le tiroir du comptoir.', 'The master keeps his accounts on the abacus. The order form is in the counter drawer.', 'Thầy ghi sổ bằng bàn tính. Phiếu đặt hàng được cất trong ngăn kéo của quầy.'),
        done: T('Le compte est juste ! Sous le boulier, gravé : ▲ et un chiffre.', 'The total is right! Under the abacus, carved: ▲ and a digit.', 'Tính đúng rồi! Dưới bàn tính có khắc: ▲ và một chữ số.') },
      rush: { type: 'rush', dig: '■', t: T('Le bassin aux carpes', 'The koi pond', 'Hồ cá chép'), ctx: T('La carpe dorée est coincée entre les bûches flottantes et les lotus. Le maître dit qu’elle porte bonheur à qui la libère.', 'The golden koi is stuck between floating logs and lotuses. The master says it brings luck to whoever frees it.', 'Chú cá chép vàng bị kẹt giữa những khúc gỗ trôi và hoa sen. Thầy bảo ai giải thoát được nó sẽ gặp may.'),
        done: T('La carpe file vers la sortie ! Sur une pierre du fond : ■ et un chiffre.', 'The koi darts to the exit! On a stone at the bottom: ■ and a digit.', 'Chú cá vọt ra lối thoát! Trên một hòn đá dưới đáy: ■ và một chữ số.') },
      rhythm: { type: 'rhythm', t: T('Le tambour de la cour', 'The courtyard drum', 'Cái trống trong sân'), ctx: T('Le grand tambour du maître. Il frappe toujours le même rythme avant d’entrer chez les ancêtres.', 'The master’s big drum. He always beats the same rhythm before entering the ancestors’ hall.', 'Chiếc trống lớn của thầy. Thầy luôn đánh cùng một nhịp trước khi vào gian thờ.'),
        done: T('Derrière toi, la porte du salon des ancêtres glisse doucement.', 'Behind you, the door of the ancestors’ hall slides gently open.', 'Sau lưng bạn, cánh cửa gian thờ nhẹ nhàng trượt mở.'), ok: g => g.set('drum') },
      zodiac: { type: 'zodiac', dig: '◆', t: T('Le calendrier lunaire', 'The lunar calendar', 'Tờ lịch âm'), ctx: T('Un grand calendrier peint, avec les douze animaux. Dessous, les années de naissance de la famille, sans les animaux…', 'A large painted calendar with the twelve animals. Below, the family’s birth years, without the animals…', 'Một tờ lịch lớn vẽ mười hai con giáp. Bên dưới là năm sinh của cả nhà, nhưng thiếu tên con giáp…'),
        done: T('Les animaux sont tous à leur place. Le chat du calendrier cligne de l’œil : ◆ et un chiffre.', 'The animals are all in place. The calendar cat winks: ◆ and a digit.', 'Các con giáp đã về đúng chỗ. Chú mèo trên lịch nháy mắt: ◆ và một chữ số.') },
      riddle: { type: 'riddle', dig: '♥', t: T('Les devinettes de grand-mère', 'Grandmother’s riddles', 'Câu đố của bà'), ctx: T('Un rouleau suspendu : les devinettes que grand-mère posait aux enfants à la mi-automne.', 'A hanging scroll: the riddles grandmother used to ask the children at Mid-Autumn.', 'Một cuộn giấy treo: những câu đố bà hay đố bọn trẻ mỗi dịp Trung Thu.'),
        done: T('Au bas du rouleau, un cœur ♥ et un chiffre, à côté d’un gâteau de lune dessiné.', 'At the bottom of the scroll, a heart ♥ and a digit, next to a drawn mooncake.', 'Cuối cuộn giấy có một trái tim ♥ và một chữ số, bên cạnh hình chiếc bánh trung thu.') }
    },
    hs: [
      { v: 'a', r: [100, 560, 360, 200], n: T('Pots de teinture', 'Dye pots', 'Hũ thuốc nhuộm'), click: g => g.pz('mix') },
      { v: 'a', r: [560, 160, 380, 360], n: T('Cadre de soie', 'Silk frame', 'Khung lụa'), click: g => g.pz('symmetry') },
      { v: 'a', r: [600, 600, 220, 100], n: T('Lettre du maître', 'Master’s letter', 'Thư của thầy'), click: g => g.doc('master', true) },
      { v: 'a', r: [1060, 520, 400, 150], n: T('Boulier', 'Abacus', 'Bàn tính'), click: g => g.pz('abacus') },
      { v: 'a', r: [1080, 690, 360, 120], n: T('Tiroir du comptoir', 'Counter drawer', 'Ngăn kéo quầy'), click: g => g.doc('order', true) },
      { v: 'a', r: [1060, 100, 460, 240], n: T('Lanternes', 'Lanterns', 'Đèn lồng'), click: g => g.say(T('Des lanternes en forme de carpe, d’étoile et de lotus, prêtes pour la fête. Il manque la plus belle : la lanterne de la lune.', 'Lanterns shaped like carp, stars and lotuses, ready for the festival. The finest is missing: the moon lantern.', 'Những chiếc đèn hình cá chép, ngôi sao, hoa sen đã sẵn sàng cho ngày hội. Chỉ thiếu chiếc đẹp nhất: đèn mặt trăng.')) },
      { v: 'a', r: [100, 100, 320, 300], n: T('Fenêtre', 'Window', 'Cửa sổ'), click: g => g.say(T('La pleine lune monte au-dessus des toits de tuiles. On entend la musique de la fête.', 'The full moon rises above the tiled roofs. You can hear the festival music.', 'Trăng rằm lên cao trên những mái ngói. Tiếng nhạc hội vọng tới.')) },
      { v: 'b', r: [520, 600, 560, 240], n: T('Bassin aux carpes', 'Koi pond', 'Hồ cá chép'), click: g => g.pz('rush') },
      { v: 'b', r: [1220, 420, 280, 300], n: T('Tambour', 'Drum', 'Trống'), click: g => g.solved('rhythm') ? g.say(T('Le tambour vibre encore doucement.', 'The drum is still humming softly.', 'Chiếc trống vẫn còn rung nhè nhẹ.')) : g.pz('rhythm') },
      { v: 'b', r: [100, 480, 280, 300], n: T('Puits', 'Well', 'Giếng'), click: g => { g.doc('well'); g.say(T('Un seau est accroché à la margelle… avec un papier plié dedans !', 'A bucket hangs on the rim… with a folded paper inside!', 'Một chiếc gàu treo trên thành giếng… bên trong có một tờ giấy gấp!')); } },
      { v: 'b', r: [620, 140, 360, 400], n: T('Portail de la rue', 'Street gate', 'Cổng ra phố'), fin: true },
      { v: 'b', r: [380, 60, 140, 170], n: T('Lanterne éteinte', 'Unlit lantern', 'Chiếc đèn tắt'), hid: true, click: g => { g.note('lamp', T('Lanterne éteinte : « Les lotus restent debout, les bûches restent couchées. »', 'Unlit lantern: “Lotuses stay upright, logs stay lying down.”', 'Chiếc đèn tắt: « Hoa sen đứng thẳng, khúc gỗ nằm ngang. »')); g.say(T('Dans la lanterne éteinte, un papier : « Les lotus restent debout, les bûches restent couchées. »', 'Inside the unlit lantern, a paper: “Lotuses stay upright, logs stay lying down.”', 'Trong chiếc đèn tắt có một mẩu giấy: « Hoa sen đứng thẳng, khúc gỗ nằm ngang. »')); } },
      { v: 'c', r: [500, 260, 600, 300], n: T('Autel', 'Altar', 'Bàn thờ'), click: g => g.say(T('L’autel des ancêtres : encens, fruits, et des gâteaux de lune posés pour la fête.', 'The ancestors’ altar: incense, fruit and mooncakes set out for the festival.', 'Bàn thờ tổ tiên: hương trầm, mâm quả và bánh trung thu bày cho ngày hội.')) },
      { v: 'c', r: [600, 580, 400, 110], n: T('Nappe de l’autel', 'Altar cloth', 'Khăn bàn thờ'), hid: true, click: g => { g.doc('grandma'); g.say(T('Sous la nappe brodée, une lettre jaunie de grand-mère.', 'Under the embroidered cloth, a yellowed letter from grandmother.', 'Dưới tấm khăn thêu có một lá thư ố vàng của bà.')); } },
      { v: 'c', r: [100, 150, 280, 380], n: T('Calendrier lunaire', 'Lunar calendar', 'Lịch âm'), click: g => g.pz('zodiac') },
      { v: 'c', r: [1220, 130, 280, 440], n: T('Rouleau des devinettes', 'Riddle scroll', 'Cuộn câu đố'), click: g => g.pz('riddle') },
      { v: 'c', r: [700, 80, 200, 170], n: T('Portrait', 'Portrait', 'Bức chân dung'), click: g => g.say(T('Le portrait de grand-mère Lan, souriante, une lanterne à la main.', 'A portrait of grandmother Lan, smiling, a lantern in her hand.', 'Chân dung bà Lan đang mỉm cười, tay cầm chiếc đèn lồng.')) }
    ],
    goals: [
      [g => g.f.doc_master, g => true, T('Sur l’établi de l’atelier, une lettre du maître t’attend.', 'On the workshop bench, a letter from the master is waiting for you.', 'Trên bàn xưởng có lá thư của thầy đang chờ bạn.')],
      [g => g.solved('mix'), g => true, T('Les pots de teinture : retrouve la couleur du carré de soie.', 'The dye pots: match the colour of the silk square.', 'Những hũ thuốc nhuộm: pha lại màu của mảnh lụa.')],
      [g => g.solved('symmetry'), g => true, T('Le cadre de soie : complète le motif comme dans un miroir.', 'The silk frame: complete the pattern as in a mirror.', 'Khung lụa: vẽ nốt họa tiết như soi gương.')],
      [g => g.f.doc_order, g => true, T('Le bon de commande est dans le tiroir du comptoir.', 'The order form is in the counter drawer.', 'Phiếu đặt hàng nằm trong ngăn kéo của quầy.')],
      [g => g.solved('abacus'), g => g.f.doc_order, T('Reporte le total de la commande sur le boulier.', 'Enter the order total on the abacus.', 'Ghi tổng số đơn hàng lên bàn tính.')],
      [g => g.f.doc_well, g => true, T('Dans la cour, regarde dans le seau du puits.', 'In the courtyard, look in the well bucket.', 'Ngoài sân, hãy nhìn vào chiếc gàu bên giếng.')],
      [g => g.solved('rhythm'), g => true, T('Le tambour de la cour ouvre le salon des ancêtres : écoute puis reproduis le rythme.', 'The courtyard drum opens the ancestors’ hall: listen, then reproduce the rhythm.', 'Chiếc trống trong sân mở gian thờ: nghe rồi đánh lại đúng nhịp.')],
      [g => g.solved('rush'), g => true, T('Le bassin : libère la carpe dorée.', 'The pond: free the golden koi.', 'Hồ cá: giải thoát chú cá chép vàng.')],
      [g => g.solved('zodiac'), g => g.f.drum, T('Dans le salon, le calendrier lunaire attend ses animaux.', 'In the hall, the lunar calendar is waiting for its animals.', 'Trong gian thờ, tờ lịch âm đang chờ các con giáp.')],
      [g => g.solved('riddle'), g => g.f.drum, T('Le rouleau des devinettes de grand-mère, à droite de l’autel.', 'Grandmother’s riddle scroll, to the right of the altar.', 'Cuộn câu đố của bà, bên phải bàn thờ.')]
    ]
  };

  // ============================ 7. LE TRAIN DE NUIT ============================
  const train = {
    id: 'train', icon: '🚂', amb: ['lowpass', 260, .1], morse: null,
    name: T('Le train de nuit', 'The Night Train', 'Chuyến tàu đêm'),
    desc: T('Bloqué par la tempête, entre Rimouski et Mont-Joli.', 'Stuck in a blizzard between Rimouski and Mont-Joli.', 'Mắc kẹt trong bão tuyết giữa Rimouski và Mont-Joli.'),
    intro: T("Le train de nuit pour Halifax vient de quitter Rimouski quand la tempête le cloue sur place, en pleine campagne. Le chef de train, M. Gagné, est parti dégager la voie… et n'est jamais revenu. Le chauffage faiblit, la radio est muette, et le coffret de commande, dans le fourgon à bagages, est verrouillé par six symboles. Les passagers dorment. C'est à toi de jouer.",
      "The night train to Halifax has just left Rimouski when the blizzard pins it down in the middle of nowhere. The conductor, Mr Gagné, went out to clear the track… and never came back. The heating is fading, the radio is silent, and the control cabinet in the baggage car is locked with six symbols. The passengers are asleep. It's up to you.",
      'Chuyến tàu đêm đi Halifax vừa rời Rimouski thì bão tuyết chặn đứng nó giữa đồng không. Trưởng tàu, ông Gagné, đã ra ngoài dọn đường ray… và không quay lại. Hệ thống sưởi yếu dần, radio im bặt, còn tủ điều khiển trong toa hành lý bị khóa bằng sáu ký hiệu. Hành khách đều đang ngủ. Đến lượt bạn rồi.'),
    outro: T("Le coffret s'ouvre : tu relances le chauffage et la radio. « Ici Mont-Joli, on vous reçoit ! Un chasse-neige arrive. » Une heure plus tard, M. Gagné remonte à bord, couvert de neige mais sain et sauf, escorté par l'équipe du chasse-neige. Il te serre la main : « Le train t'appartient, pour cette nuit ! »",
      "The cabinet opens: you restart the heating and the radio. 'Mont-Joli here, we read you! A snowplough is on its way.' An hour later, Mr Gagné climbs back aboard, covered in snow but safe and sound, escorted by the snowplough crew. He shakes your hand: 'The train is yours for tonight!'",
      'Tủ điện mở ra: bạn khởi động lại hệ thống sưởi và radio. « Mont-Joli đây, chúng tôi nghe rõ! Xe ủi tuyết đang tới. » Một giờ sau, ông Gagné trở lại tàu, người phủ đầy tuyết nhưng bình an vô sự, cùng đội xe ủi tuyết. Ông bắt tay bạn: « Đêm nay, con tàu là của cháu! »'),
    views: {
      a: { scene: 'trainA', n: T('Le compartiment', 'The compartment', 'Khoang giường nằm') },
      b: { scene: 'trainB', n: T('La voiture-restaurant', 'The dining car', 'Toa ăn') },
      c: { scene: 'trainC', n: T('Le fourgon à bagages', 'The baggage car', 'Toa hành lý'), dark: g => true, light: 'lamp' }
    },
    order: ['a', 'b', 'c'],
    items: {
      lamp: { i: '🏮', n: T('Lanterne de chemin de fer', 'Railway lantern', 'Đèn bão đường sắt'), d: T('Une vieille lanterne à pétrole du chemin de fer. Parfaite pour le fourgon plongé dans le noir.', 'An old railway oil lantern. Perfect for the pitch-dark baggage car.', 'Một chiếc đèn dầu cũ của ngành đường sắt. Rất hợp cho toa hành lý tối om.') }
    },
    combos: [],
    docs: {
      notice: { s: 'paper', t: T('Avis du chef de train', 'Conductor’s notice', 'Thông báo của trưởng tàu'), b: T(
        "AVIS AUX VOYAGEURS\n\nTempête de neige : arrêt prolongé entre Rimouski et Mont-Joli.\nJe pars dégager la voie avec une pelle. Restez au chaud.\n\nPour le personnel : le code du coffret de commande est réparti selon l'habitude (★ ● ▲ ■ ◆ ♥). L'horaire, le journal, le télégramme, mon verre, la chaudière et le tableau de manœuvre.\n\nLa lanterne de secours est dans une des valises du porte-bagages.\n— R. Gagné, chef de train",
        "NOTICE TO PASSENGERS\n\nBlizzard: extended stop between Rimouski and Mont-Joli.\nI am going out to clear the track with a shovel. Stay warm.\n\nFor staff: the control cabinet code is split up as usual (★ ● ▲ ■ ◆ ♥). The timetable, the newspaper, the telegram, my glass, the boiler and the shunting board.\n\nThe emergency lantern is in one of the suitcases on the luggage rack.\n— R. Gagné, conductor",
        'THÔNG BÁO GỬI HÀNH KHÁCH\n\nBão tuyết: tàu dừng lâu giữa Rimouski và Mont-Joli.\nTôi ra ngoài dọn đường ray bằng xẻng. Xin quý khách giữ ấm.\n\nGửi nhân viên: mã tủ điều khiển được chia như thường lệ (★ ● ▲ ■ ◆ ♥). Lịch tàu, tờ báo, bức điện, cái ly của tôi, nồi hơi và bảng dồn toa.\n\nĐèn dự phòng nằm trong một chiếc vali trên giá hành lý.\n— R. Gagné, trưởng tàu') },
      ticket: { s: 'paper', t: T('Talon de billet', 'Ticket stub', 'Cuống vé'), b: T(
        "BILLET — Montréal ➜ Halifax\nVoiture 7, couchette 12\n\nAu dos, griffonné au crayon : « Le chef boit toujours son thé dans le même verre, au bout de la voiture-restaurant. Il laisse ses empreintes partout. »",
        "TICKET — Montréal ➜ Halifax\nCar 7, berth 12\n\nOn the back, scribbled in pencil: “The conductor always drinks his tea from the same glass, at the end of the dining car. He leaves his fingerprints everywhere.”",
        'VÉ — Montréal ➜ Halifax\nToa 7, giường 12\n\nMặt sau viết vội bằng bút chì: « Trưởng tàu luôn uống trà bằng cùng một cái ly, ở cuối toa ăn. Ông ấy để lại dấu vân tay khắp nơi. »') },
      letter: { s: 'old', t: T('Lettre dans le sac postal', 'Letter in the mailbag', 'Lá thư trong túi bưu phẩm'), b: T(
        "Chère Lise,\n\nSi le train s'arrête encore dans la neige cet hiver, ne t'inquiète pas : je connais chaque traverse entre Rimouski et Mont-Joli. Je reviens toujours.\n\nTon père qui t'aime,\nRoger Gagné",
        "Dear Lise,\n\nIf the train gets stuck in the snow again this winter, don't worry: I know every sleeper between Rimouski and Mont-Joli. I always come back.\n\nYour loving father,\nRoger Gagné",
        'Lise yêu quý,\n\nNếu mùa đông này tàu lại kẹt trong tuyết, con đừng lo nhé: bố thuộc từng thanh tà vẹt giữa Rimouski và Mont-Joli. Bố lúc nào cũng trở về.\n\nBố yêu con,\nRoger Gagné') }
    },
    pzs: {
      schedule: { type: 'schedule', dig: '★', t: T('L’horaire', 'The timetable', 'Lịch tàu'), ctx: T('L’horaire affiché dans le compartiment. Le chef de train y a ajouté au crayon une question de calcul… et une étoile.', 'The timetable posted in the compartment. The conductor added a sum in pencil… and a star.', 'Lịch tàu dán trong khoang. Trưởng tàu đã viết thêm bằng bút chì một bài tính… và một ngôi sao.'),
        done: T('Juste ! Sous l’horaire, au crayon : ★ et un chiffre.', 'Correct! Under the timetable, in pencil: ★ and a digit.', 'Chính xác! Dưới lịch tàu, bằng bút chì: ★ và một chữ số.') },
      pack: { type: 'pack', t: T('Le porte-bagages', 'The luggage rack', 'Giá hành lý'), ctx: T('Les valises sont tombées pendant le freinage. Il faut tout remettre en place pour atteindre celle du chef de train.', 'The suitcases fell off when the train braked. Everything has to go back so you can reach the conductor’s.', 'Mấy chiếc vali rơi xuống khi tàu phanh gấp. Phải xếp lại hết mới lấy được vali của trưởng tàu.'),
        done: T('Tout est rangé. Dans la valise du chef : une lanterne de chemin de fer !', 'Everything is in place. In the conductor’s suitcase: a railway lantern!', 'Đã xếp xong. Trong vali của trưởng tàu: một chiếc đèn bão đường sắt!'), ok: g => g.take('lamp') },
      wordsearch: { type: 'wordsearch', dig: '◆', t: T('Le journal du soir', 'The evening paper', 'Tờ báo buổi tối'), ctx: T('Le chef de train avait commencé les mots mêlés du journal. Dans la marge : « ◆ quand tout est trouvé ».', 'The conductor had started the newspaper word search. In the margin: “◆ when all are found”.', 'Trưởng tàu đã bắt đầu giải ô chữ trên báo. Bên lề ghi: « ◆ khi tìm hết ».'),
        done: T('Tous les mots sont entourés. Dans la marge : ◆ et un chiffre.', 'Every word is circled. In the margin: ◆ and a digit.', 'Đã khoanh hết các từ. Bên lề: ◆ và một chữ số.') },
      cloze: { type: 'cloze', dig: '♥', t: T('Le télégramme', 'The telegram', 'Bức điện tín'), ctx: T('Un télégramme mouillé, posé sur le bar. Certains mots ont été effacés par la neige.', 'A soggy telegram on the bar. Some words have been washed out by the snow.', 'Một bức điện ướt sũng đặt trên quầy. Vài chữ đã bị tuyết làm nhòe.'),
        done: T('Le message est complet. Au dos du télégramme : ♥ et un chiffre.', 'The message is complete. On the back of the telegram: ♥ and a digit.', 'Bức điện đã đầy đủ. Mặt sau: ♥ và một chữ số.') },
      match: { type: 'match', dig: '■', t: T('Le verre du chef', 'The conductor’s glass', 'Cái ly của trưởng tàu'), ctx: T('Sur le verre de thé, une empreinte bien nette. Le chef a laissé ses fiches d’empreintes dans un tiroir : laquelle est la sienne ?', 'On the tea glass, a clear fingerprint. The conductor left his fingerprint cards in a drawer: which one is his?', 'Trên ly trà có một dấu vân tay rất rõ. Trưởng tàu để các phiếu vân tay trong ngăn kéo: phiếu nào là của ông?'),
        done: T('C’est bien lui. Sur sa fiche : ■ et un chiffre.', 'It is him. On his card: ■ and a digit.', 'Đúng là ông ấy. Trên phiếu của ông: ■ và một chữ số.') },
      valves: { type: 'valves', dig: '▲', t: T('La chaudière', 'The boiler', 'Nồi hơi'), ctx: T('La chaudière du chauffage s’essouffle. Trois jauges, plusieurs vannes… et un ▲ peint sur le manomètre.', 'The heating boiler is running out of steam. Three gauges, several valves… and a ▲ painted on the pressure gauge.', 'Nồi hơi sưởi đang yếu dần. Ba đồng hồ, nhiều van… và một dấu ▲ vẽ trên áp kế.'),
        done: T('La chaudière ronronne et la chaleur revient. Sur le manomètre : ▲ et un chiffre.', 'The boiler purrs and the heat comes back. On the pressure gauge: ▲ and a digit.', 'Nồi hơi chạy êm, hơi ấm trở lại. Trên áp kế: ▲ và một chữ số.') },
      shunt: { type: 'shunt', dig: '●', t: T('Le tableau de manœuvre', 'The shunting board', 'Bảng dồn toa'), ctx: T('Un tableau de bois avec des wagons miniatures. Le dépôt de Mont-Joli demande un ordre précis pour accrocher le chasse-neige.', 'A wooden board with miniature wagons. The Mont-Joli depot wants a precise order to couple the snowplough.', 'Một tấm bảng gỗ với những toa tàu mô hình. Kho Mont-Joli yêu cầu một thứ tự chính xác để nối xe ủi tuyết.'),
        done: T('Les wagons sont dans l’ordre. Sous le dernier : ● et un chiffre.', 'The wagons are in order. Under the last one: ● and a digit.', 'Các toa đã đúng thứ tự. Dưới toa cuối cùng: ● và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [500, 110, 600, 340], n: T('Fenêtre', 'Window', 'Cửa sổ'), click: g => g.say(T('Dehors, la neige tourbillonne dans le noir. On distingue à peine les poteaux télégraphiques.', 'Outside, snow swirls in the dark. You can barely make out the telegraph poles.', 'Bên ngoài, tuyết xoáy trong bóng tối. Chỉ thấy lờ mờ những cột điện tín.')) },
      { v: 'a', r: [120, 150, 270, 320], n: T('Horaire', 'Timetable', 'Lịch tàu'), click: g => g.pz('schedule') },
      { v: 'a', r: [1150, 80, 400, 190], n: T('Porte-bagages', 'Luggage rack', 'Giá hành lý'), click: g => g.solved('pack') ? g.say(T('Les valises sont bien rangées.', 'The suitcases are neatly stowed.', 'Các vali đã được xếp gọn.')) : g.pz('pack') },
      { v: 'a', r: [1250, 300, 230, 300], n: T('Avis sur la porte', 'Notice on the door', 'Thông báo trên cửa'), click: g => g.doc('notice', true) },
      { v: 'a', r: [200, 560, 1000, 200], n: T('Banquette', 'Seat', 'Ghế'), click: g => g.say(T('La banquette-couchette, encore tiède. Ton manteau est roulé en oreiller.', 'The bunk seat, still warm. Your coat is rolled up as a pillow.', 'Chiếc ghế giường còn ấm. Áo khoác của bạn cuộn làm gối.')) },
      { v: 'a', r: [320, 770, 320, 100], n: T('Sous la banquette', 'Under the seat', 'Dưới ghế'), hid: true, click: g => { g.doc('ticket'); g.say(T('Sous la banquette, un talon de billet annoté.', 'Under the seat, an annotated ticket stub.', 'Dưới ghế có một cuống vé ghi chú.')); } },
      { v: 'b', r: [560, 560, 480, 180], n: T('Journal', 'Newspaper', 'Tờ báo'), click: g => g.pz('wordsearch') },
      { v: 'b', r: [1150, 470, 380, 250], n: T('Bar et télégramme', 'Bar and telegram', 'Quầy và bức điện'), click: g => g.pz('cloze') },
      { v: 'b', r: [160, 540, 300, 180], n: T('Verre de thé', 'Tea glass', 'Ly trà'), click: g => g.pz('match') },
      { v: 'b', r: [880, 500, 140, 70], n: T('Corbeille à pain', 'Bread basket', 'Giỏ bánh mì'), hid: true, click: g => { g.note('bread', T('Corbeille à pain : « Valises du compartiment : la plus grosse d’abord. » — R. G.', 'Bread basket: “Compartment suitcases: biggest first.” — R. G.', 'Giỏ bánh mì: « Vali trong khoang: xếp chiếc to nhất trước. » — R. G.')); g.say(T('Sous un petit pain, une note du chef : « Valises du compartiment : la plus grosse d’abord. »', 'Under a bread roll, a note from the conductor: “Compartment suitcases: biggest first.”', 'Dưới ổ bánh mì có mẩu giấy của trưởng tàu: « Vali trong khoang: xếp chiếc to nhất trước. »')); } },
      { v: 'b', r: [100, 110, 1400, 260], n: T('Fenêtres', 'Windows', 'Cửa sổ'), click: g => g.say(T('Les tables sont dressées pour le petit-déjeuner. Le givre dessine des fougères sur les vitres.', 'The tables are laid for breakfast. Frost draws ferns on the windows.', 'Các bàn đã bày sẵn cho bữa sáng. Sương giá vẽ những chiếc lá dương xỉ trên kính.')) },
      { v: 'c', r: [80, 220, 380, 480], n: T('Chaudière', 'Boiler', 'Nồi hơi'), click: g => g.pz('valves') },
      { v: 'c', r: [560, 150, 440, 290], n: T('Tableau de manœuvre', 'Shunting board', 'Bảng dồn toa'), click: g => g.pz('shunt') },
      { v: 'c', r: [1100, 650, 300, 190], n: T('Sacs postaux', 'Mailbags', 'Túi bưu phẩm'), hid: true, click: g => { g.doc('letter'); g.say(T('Parmi les sacs postaux, une lettre signée Roger Gagné.', 'Among the mailbags, a letter signed Roger Gagné.', 'Giữa những túi bưu phẩm có một lá thư ký tên Roger Gagné.')); } },
      { v: 'c', r: [1150, 140, 320, 420], n: T('Coffret de commande', 'Control cabinet', 'Tủ điều khiển'), fin: true }
    ],
    goals: [
      [g => g.f.doc_notice, g => true, T('Un avis du chef de train est affiché sur la porte du compartiment.', 'A notice from the conductor is posted on the compartment door.', 'Có thông báo của trưởng tàu dán trên cửa khoang.')],
      [g => g.solved('schedule'), g => true, T('L’horaire du compartiment cache un calcul d’heure d’arrivée.', 'The compartment timetable hides an arrival-time sum.', 'Lịch tàu trong khoang có một bài tính giờ đến.')],
      [g => g.solved('pack'), g => true, T('Range les valises du porte-bagages pour trouver la lanterne.', 'Stow the suitcases on the rack to find the lantern.', 'Xếp lại vali trên giá để tìm chiếc đèn.')],
      [g => g.solved('wordsearch'), g => true, T('Dans la voiture-restaurant, le journal attend ses mots mêlés.', 'In the dining car, the newspaper word search awaits.', 'Trong toa ăn, tờ báo có ô chữ đang chờ bạn.')],
      [g => g.solved('cloze'), g => true, T('Le télégramme sur le bar : complète les mots effacés.', 'The telegram on the bar: fill in the washed-out words.', 'Bức điện trên quầy: điền những chữ bị nhòe.')],
      [g => g.solved('match'), g => true, T('Le verre de thé du chef : compare son empreinte aux fiches.', 'The conductor’s tea glass: compare the fingerprint with the cards.', 'Ly trà của trưởng tàu: so dấu vân tay với các phiếu.')],
      [g => g.has('lamp'), g => g.solved('pack'), T('Prends la lanterne pour éclairer le fourgon à bagages.', 'Take the lantern to light the baggage car.', 'Mang đèn theo để soi toa hành lý.')],
      [g => g.solved('valves'), g => g.has('lamp'), T('Dans le fourgon, règle les vannes de la chaudière.', 'In the baggage car, set the boiler valves.', 'Trong toa hành lý, chỉnh các van của nồi hơi.')],
      [g => g.solved('shunt'), g => g.has('lamp'), T('Le tableau de manœuvre du fourgon : range les wagons dans l’ordre demandé.', 'The baggage-car shunting board: put the wagons in the requested order.', 'Bảng dồn toa trong toa hành lý: xếp các toa theo đúng thứ tự.')]
    ]
  };

  window.Content.push(lantern, train);
})();

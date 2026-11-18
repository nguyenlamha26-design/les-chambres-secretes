// Scénarios festifs : « Le manoir hanté » (Halloween) et « L'atelier des lutins » (Noël).
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });

  // ============================ 8. LE MANOIR HANTÉ ============================
  const manor = {
    id: 'halloween', icon: '🎃', amb: ['lowpass', 420, .07], morse: null,
    name: T('Le manoir hanté', 'The Haunted Manor', 'Tòa lâu đài ma ám'),
    desc: T('Halloween : un pari, un manoir, un fantôme joueur.', 'Halloween: a dare, a manor, a playful ghost.', 'Halloween: một vụ thách đố, một tòa lâu đài, một con ma thích chơi.'),
    intro: T("Soir d'Halloween. Tes amis t'ont mis au défi d'entrer dans le vieux manoir Mortimer, au bout de la rue. À peine as-tu franchi le seuil que la porte claque derrière toi. Une voix douce résonne : « Enfin de la visite ! Je m'appelle Edgar. Je m'ennuie depuis cent ans… Joue à mes jeux, et je t'ouvrirai. » La porte porte un cadenas à six symboles.",
      "Halloween night. Your friends dared you to go into the old Mortimer manor at the end of the street. As soon as you step inside, the door slams behind you. A gentle voice echoes: 'At last, a visitor! My name is Edgar. I have been bored for a hundred years… Play my games, and I will let you out.' The door bears a six-symbol padlock.",
      'Đêm Halloween. Bạn bè thách bạn bước vào tòa lâu đài cũ Mortimer ở cuối phố. Bạn vừa qua ngưỡng cửa thì cánh cửa đóng sập sau lưng. Một giọng nói dịu dàng vang lên: « Cuối cùng cũng có khách! Ta là Edgar. Ta buồn chán suốt một trăm năm rồi… Hãy chơi các trò của ta, ta sẽ mở cửa cho. » Trên cửa có một ổ khóa sáu ký hiệu.'),
    outro: T("Le cadenas tombe. Edgar apparaît, rayonnant : « Merci ! C'était le plus bel Halloween depuis un siècle. » Il te tend un grand chaudron rempli de bonbons. La porte s'ouvre : tes amis, sur le trottoir, n'en croient pas leurs yeux. Edgar te fait un clin d'œil depuis la fenêtre : « Reviens l'an prochain ! »",
      "The padlock drops. Edgar appears, beaming: 'Thank you! That was the best Halloween in a century.' He hands you a big cauldron full of sweets. The door swings open: your friends on the pavement can't believe their eyes. Edgar winks at you from the window: 'Come back next year!'",
      'Ổ khóa rơi xuống. Edgar hiện ra, rạng rỡ: « Cảm ơn nhé! Đây là mùa Halloween vui nhất suốt một thế kỷ. » Ông đưa bạn một chiếc vạc to đầy kẹo. Cửa mở ra: lũ bạn đứng ngoài vỉa hè không tin nổi vào mắt mình. Edgar nháy mắt với bạn qua khung cửa sổ: « Năm sau nhớ quay lại nhé! »'),
    views: {
      a: { scene: 'hallA', n: T('Le grand hall', 'The great hall', 'Đại sảnh') },
      b: { scene: 'hallB', n: T('Le grenier', 'The attic', 'Gác xép') },
      c: { scene: 'hallC', n: T('Le jardin aux tombes', 'The graveyard garden', 'Khu vườn nghĩa địa'), lock: g => !g.f.gardenKey,
        lockMsg: T('La porte du jardin est fermée par une grosse serrure rouillée. La clé doit être quelque part dans la maison…', 'The garden door is shut with a big rusty lock. The key must be somewhere in the house…', 'Cửa ra vườn bị khóa bằng một ổ khóa to gỉ sét. Chìa khóa chắc đang ở đâu đó trong nhà…') }
    },
    order: ['a', 'b', 'c'],
    items: { gkey: { i: '🗝️', n: T('Clé rouillée', 'Rusty key', 'Chìa khóa gỉ'), d: T('Une grosse clé rouillée, ornée d’une chauve-souris.', 'A big rusty key decorated with a bat.', 'Một chiếc chìa khóa to gỉ sét, khắc hình con dơi.') } },
    combos: [],
    docs: {
      dare: { s: 'note', t: T('Le défi des copains', 'Your friends’ dare', 'Lời thách của lũ bạn'), b: T(
        "« Chiche que tu restes 10 minutes dans le manoir Mortimer ! On t'attend dehors avec les bonbons. 🎃\n— Léo, Nhi et Sam »\n\nAu dos, d'une écriture fine et ancienne : « Six jeux, six symboles : ★ ● ▲ ■ ◆ ♥. La voyante, mes portraits, la toile, le coffre, la garde-robe et le jardin. — E. »",
        "“Bet you can't stay 10 minutes in the Mortimer manor! We'll wait outside with the sweets. 🎃\n— Léo, Nhi and Sam”\n\nOn the back, in fine old-fashioned handwriting: “Six games, six symbols: ★ ● ▲ ■ ◆ ♥. The fortune teller, my portraits, the web, the chest, the wardrobe and the garden. — E.”",
        '« Dám ở trong lâu đài Mortimer 10 phút không! Bọn mình chờ ngoài này với kẹo nhé. 🎃\n— Léo, Nhi và Sam »\n\nMặt sau, nét chữ nhỏ và cổ: « Sáu trò chơi, sáu ký hiệu: ★ ● ▲ ■ ◆ ♥. Bà thầy bói, những bức chân dung của ta, mạng nhện, chiếc rương, tủ quần áo và khu vườn. — E. »') },
      edgar: { s: 'old', t: T('Le journal d’Edgar', 'Edgar’s diary', 'Nhật ký của Edgar'), b: T(
        "31 octobre 1924. Ce soir, grand bal costumé au manoir. J'ai choisi mon costume en secret : personne ne doit le deviner avant minuit…\n\nHélas, je me suis endormi dans le grenier et je ne me suis jamais réveillé. Depuis, chaque Halloween, j'attends quelqu'un pour jouer. Les invités du bal se souviennent encore de mon costume ; leurs témoignages sont épinglés dans la garde-robe.",
        "31 October 1924. Tonight, a grand costume ball at the manor. I chose my costume in secret: nobody must guess it before midnight…\n\nAlas, I fell asleep in the attic and never woke up. Since then, every Halloween, I wait for someone to play with. The ball guests still remember my costume; their accounts are pinned inside the wardrobe.",
        'Ngày 31 tháng 10 năm 1924. Tối nay có dạ hội hóa trang lớn ở lâu đài. Ta đã bí mật chọn trang phục: không ai được đoán ra trước nửa đêm…\n\nTiếc thay, ta ngủ quên trên gác xép và không bao giờ tỉnh dậy nữa. Từ đó, mỗi mùa Halloween, ta lại chờ ai đó đến chơi cùng. Khách dự dạ hội vẫn nhớ bộ trang phục của ta; lời kể của họ được ghim trong tủ quần áo.') }
    },
    pzs: {
      shells: { type: 'shells', dig: '★', t: T('La table de la voyante', 'The fortune teller’s table', 'Bàn của bà thầy bói'), ctx: T('Une poupée de voyante s’anime : « Où est passée ma boule de cristal ? Ouvre bien les yeux… »', 'A fortune-teller puppet comes to life: “Where has my crystal ball gone? Keep your eyes open…”', 'Con rối thầy bói cử động: « Quả cầu pha lê của ta đi đâu rồi? Mở to mắt ra nhé… »'),
        done: T('« Bravo ! » La poupée te tend une carte : ★ et un chiffre.', '“Well done!” The puppet hands you a card: ★ and a digit.', '« Giỏi lắm! » Con rối đưa bạn một tấm thẻ: ★ và một chữ số.') },
      catch: { type: 'catch', dig: '●', t: T('La galerie des portraits', 'The portrait gallery', 'Hành lang chân dung'), ctx: T('Les ancêtres d’Edgar s’échappent de leurs cadres pour jouer à cache-cache. Attrape-les !', 'Edgar’s ancestors slip out of their frames to play hide-and-seek. Catch them!', 'Tổ tiên của Edgar trốn khỏi khung tranh để chơi trốn tìm. Hãy bắt lấy họ!'),
        done: T('Les fantômes regagnent leurs cadres en riant. Sous le dernier : ● et un chiffre.', 'The ghosts return to their frames, laughing. Under the last one: ● and a digit.', 'Những con ma cười khúc khích quay về khung tranh. Dưới bức cuối cùng: ● và một chữ số.') },
      pins: { type: 'pins', dig: '▲', t: T('Le vieux coffre', 'The old chest', 'Chiếc rương cũ'), ctx: T('Un coffre bardé de fer, fermé par une serrure à goupilles. Edgar chuchote : « Écoute bien chaque goupille… »', 'An iron-bound chest closed with a pin lock. Edgar whispers: “Listen carefully to each pin…”', 'Một chiếc rương bọc sắt có ổ khóa chốt. Edgar thì thầm: « Hãy lắng nghe từng chốt… »'),
        done: T('Le coffre s’ouvre : une clé rouillée et, gravé dans le couvercle, ▲ et un chiffre.', 'The chest opens: a rusty key and, carved in the lid, ▲ and a digit.', 'Chiếc rương mở ra: một chìa khóa gỉ, trên nắp khắc ▲ và một chữ số.'), ok: g => g.take('gkey') },
      web: { type: 'pathsum', dig: '■', t: T('La toile d’araignée', 'The spider web', 'Mạng nhện'), ctx: T('Une araignée géante (et très polie) a tissé des nombres dans sa toile. « Descends jusqu’en bas avec exactement le bon total. »', 'A giant (and very polite) spider has woven numbers into its web. “Climb down to the bottom with exactly the right total.”', 'Một con nhện khổng lồ (và rất lịch sự) đã dệt những con số vào mạng. « Hãy đi xuống tận đáy với đúng tổng cần tìm. »'),
        done: T('L’araignée applaudit avec ses huit pattes et dépose : ■ et un chiffre.', 'The spider claps with all eight legs and leaves: ■ and a digit.', 'Con nhện vỗ tay bằng cả tám chân và để lại: ■ và một chữ số.') },
      outfit: { type: 'outfit', dig: '♥', t: T('La garde-robe', 'The wardrobe', 'Tủ quần áo'), ctx: T('Des témoignages des invités du bal de 1924 sont épinglés à l’intérieur de la porte.', 'Accounts from the 1924 ball guests are pinned inside the door.', 'Lời kể của khách dự dạ hội năm 1924 được ghim bên trong cánh tủ.'),
        done: T('« C’était bien mon costume ! » s’écrie Edgar. Au fond de la garde-robe : ♥ et un chiffre.', '“That was my costume!” cries Edgar. At the back of the wardrobe: ♥ and a digit.', '« Đúng là trang phục của ta! » Edgar reo lên. Trong góc tủ: ♥ và một chữ số.') },
      mines: { type: 'mines', dig: '◆', t: T('Les tombes du jardin', 'The garden graves', 'Những ngôi mộ trong vườn'), ctx: T('Certaines tombes abritent des fantômes grincheux qui détestent être dérangés. Les pierres paisibles indiquent combien de voisines sont hantées.', 'Some graves hide grumpy ghosts who hate being disturbed. The peaceful stones show how many neighbours are haunted.', 'Vài ngôi mộ có những con ma khó tính ghét bị quấy rầy. Những tấm bia yên bình cho biết có bao nhiêu mộ bên cạnh bị ám.'),
        done: T('Le jardin s’apaise. Sur la plus vieille tombe apparaissent ◆ et un chiffre.', 'The garden settles down. On the oldest grave appear ◆ and a digit.', 'Khu vườn yên ắng trở lại. Trên ngôi mộ cổ nhất hiện ra ◆ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [100, 520, 420, 240], n: T('Table de la voyante', 'Fortune teller’s table', 'Bàn thầy bói'), click: g => g.pz('shells') },
      { v: 'a', r: [560, 110, 480, 330], n: T('Portraits', 'Portraits', 'Chân dung'), click: g => g.pz('catch') },
      { v: 'a', r: [600, 640, 200, 90], n: T('Enveloppe', 'Envelope', 'Phong bì'), click: g => g.doc('dare', true) },
      { v: 'a', r: [1060, 160, 140, 460], n: T('Horloge', 'Clock', 'Đồng hồ'), click: g => g.say(T('L’horloge est bloquée sur minuit moins une. Son tic-tac résonne quand même…', 'The clock is stuck at one minute to midnight. You can still hear it ticking…', 'Chiếc đồng hồ dừng ở lúc nửa đêm kém một phút. Vậy mà vẫn nghe tiếng tích tắc…')) },
      { v: 'a', r: [1090, 440, 80, 140], n: T('Balancier', 'Pendulum', 'Quả lắc'), hid: true, click: g => { g.note('clock', T('Dans l’horloge : « Le coffre du grenier ne s’ouvre qu’aux oreilles patientes. »', 'Inside the clock: “The attic chest only opens to patient ears.”', 'Trong đồng hồ: « Chiếc rương trên gác chỉ mở cho người kiên nhẫn lắng nghe. »')); g.say(T('Derrière le balancier, un papier : « Le coffre du grenier ne s’ouvre qu’aux oreilles patientes. »', 'Behind the pendulum, a note: “The attic chest only opens to patient ears.”', 'Sau quả lắc có mẩu giấy: « Chiếc rương trên gác chỉ mở cho người kiên nhẫn lắng nghe. »')); } },
      { v: 'a', r: [1240, 160, 300, 560], n: T('Porte d’entrée', 'Front door', 'Cửa chính'), fin: true },
      { v: 'b', r: [100, 140, 360, 560], n: T('Garde-robe', 'Wardrobe', 'Tủ quần áo'), click: g => g.pz('outfit') },
      { v: 'b', r: [560, 110, 480, 380], n: T('Toile d’araignée', 'Spider web', 'Mạng nhện'), click: g => g.pz('web') },
      { v: 'b', r: [1080, 560, 360, 220], n: T('Vieux coffre', 'Old chest', 'Rương cũ'), click: g => g.solved('pins') ? g.say(T('Le coffre est vide.', 'The chest is empty.', 'Chiếc rương đã trống.')) : g.pz('pins') },
      { v: 'b', r: [1100, 200, 340, 240], n: T('Livres poussiéreux', 'Dusty books', 'Sách bụi bặm'), click: g => g.doc('edgar', true) },
      { v: 'c', r: [260, 560, 1080, 300], n: T('Tombes', 'Graves', 'Mộ'), click: g => g.pz('mines') },
      { v: 'c', r: [1380, 640, 150, 150], n: T('Citrouille', 'Pumpkin', 'Quả bí ngô'), hid: true, click: g => g.say(T('Dans la citrouille creusée, un bonbon et un mot : « Commence toujours par un coin. — E. »', 'Inside the carved pumpkin, a sweet and a note: “Always start with a corner. — E.”', 'Trong quả bí ngô khoét rỗng có một viên kẹo và mẩu giấy: « Luôn bắt đầu từ một góc. — E. »')) },
      { v: 'c', r: [600, 140, 400, 300], n: T('Grille du jardin', 'Garden gate', 'Cổng vườn'), click: g => g.say(T('La grille donne sur la rue. Tes amis t’attendent de l’autre côté de la maison.', 'The gate opens onto the street. Your friends are waiting on the other side of the house.', 'Cánh cổng nhìn ra phố. Lũ bạn đang chờ bạn ở phía bên kia ngôi nhà.')) }
    ],
    goals: [
      [g => g.f.doc_dare, g => true, T('Une enveloppe traîne sur le sol du hall.', 'An envelope lies on the hall floor.', 'Có một phong bì nằm trên sàn đại sảnh.')],
      [g => g.solved('shells'), g => true, T('La table de la voyante : suis la boule de cristal.', 'The fortune teller’s table: follow the crystal ball.', 'Bàn thầy bói: dõi theo quả cầu pha lê.')],
      [g => g.solved('catch'), g => true, T('Les portraits du hall : attrape les fantômes.', 'The hall portraits: catch the ghosts.', 'Những bức chân dung ở sảnh: bắt lấy các con ma.')],
      [g => g.solved('web'), g => true, T('Au grenier, la toile d’araignée cache un calcul.', 'In the attic, the spider web hides a sum.', 'Trên gác xép, mạng nhện ẩn một phép tính.')],
      [g => g.f.doc_edgar, g => true, T('Au grenier, les livres poussiéreux contiennent le journal d’Edgar.', 'In the attic, the dusty books contain Edgar’s diary.', 'Trên gác xép, chồng sách bụi có cuốn nhật ký của Edgar.')],
      [g => g.solved('outfit'), g => true, T('La garde-robe : reconstitue le costume d’Edgar.', 'The wardrobe: rebuild Edgar’s costume.', 'Tủ quần áo: ghép lại bộ trang phục của Edgar.')],
      [g => g.solved('pins'), g => true, T('Le vieux coffre du grenier : règle les goupilles.', 'The old attic chest: set the pins.', 'Chiếc rương cũ trên gác: chỉnh các chốt.')],
      [g => g.f.gardenKey, g => g.has('gkey'), T('La clé rouillée ouvre la porte du jardin.', 'The rusty key opens the garden door.', 'Chìa khóa gỉ mở được cửa ra vườn.')],
      [g => g.solved('mines'), g => g.f.gardenKey, T('Le jardin : découvre les tombes paisibles.', 'The garden: uncover the peaceful graves.', 'Khu vườn: mở những ngôi mộ yên bình.')]
    ]
  };
  manor.views.c.unlock = g => { if (!g.has('gkey')) return false; g.set('gardenKey'); g.drop('gkey'); g.say(T('La clé rouillée tourne en grinçant. Le jardin s’ouvre dans la brume.', 'The rusty key turns with a creak. The garden opens into the mist.', 'Chìa khóa gỉ xoay kẽo kẹt. Khu vườn mở ra trong màn sương.')); return true; };

  // ============================ 9. L'ATELIER DES LUTINS ============================
  const workshop = {
    id: 'xmas', icon: '🎄', amb: ['bandpass', 3200, .015], morse: null,
    name: T('L’atelier des lutins', 'The Elves’ Workshop', 'Xưởng của các chú lùn'),
    desc: T('Le soir de Noël, au pôle Nord.', 'Christmas Eve at the North Pole.', 'Đêm Giáng sinh ở Bắc Cực.'),
    intro: T("Le soir de Noël, au pôle Nord. Tu es le tout nouveau lutin de l'atelier. Catastrophe : la porte du hangar du traîneau s'est verrouillée, et le Père Noël doit partir à minuit ! La cheffe des lutins, Mère Flocon, a laissé six symboles sur la serrure… et des épreuves partout dans l'atelier. À toi de jouer, petit lutin !",
      "Christmas Eve at the North Pole. You are the newest elf in the workshop. Disaster: the sleigh hangar door has locked itself, and Father Christmas has to leave at midnight! The head elf, Mother Snowflake, left six symbols on the lock… and challenges all over the workshop. Your turn, little elf!",
      'Đêm Giáng sinh ở Bắc Cực. Bạn là chú lùn mới nhất của xưởng. Thật tai họa: cửa nhà để xe trượt tuyết tự khóa lại, mà ông già Noel phải lên đường lúc nửa đêm! Bà trưởng lùn Bông Tuyết đã để lại sáu ký hiệu trên ổ khóa… cùng những thử thách khắp xưởng. Đến lượt bạn rồi, chú lùn nhỏ!'),
    outro: T("La grande porte du hangar s'ouvre dans un nuage de neige. Les rennes piaffent, les grelots tintent. Le Père Noël te tapote l'épaule : « Bon travail, petit lutin ! » Le traîneau s'élève dans la nuit étoilée, et au loin, tu entends : « Joyeux Noël à tous ! »",
      "The great hangar door opens in a cloud of snow. The reindeer stamp, the sleigh bells jingle. Father Christmas pats you on the shoulder: 'Well done, little elf!' The sleigh rises into the starry night, and far away you hear: 'Merry Christmas to all!'",
      'Cánh cửa lớn của nhà xe mở ra trong làn tuyết bay. Đàn tuần lộc giậm chân, chuông leng keng vang lên. Ông già Noel vỗ vai bạn: « Làm tốt lắm, chú lùn nhỏ! » Chiếc xe trượt bay vút lên bầu trời đầy sao, và xa xa bạn nghe thấy: « Chúc mọi người Giáng sinh vui vẻ! »'),
    views: {
      a: { scene: 'xmasA', n: T('L’atelier', 'The workshop', 'Xưởng làm đồ chơi') },
      b: { scene: 'xmasB', n: T('La cuisine', 'The kitchen', 'Nhà bếp') },
      c: { scene: 'xmasC', n: T('La cour enneigée', 'The snowy yard', 'Sân tuyết') }
    },
    order: ['a', 'b', 'c'],
    items: {},
    combos: [],
    docs: {
      mother: { s: 'note', t: T('Le mot de Mère Flocon', 'Mother Snowflake’s note', 'Lời nhắn của bà Bông Tuyết'), b: T(
        "Petit lutin,\n\nLa porte du hangar ne s'ouvre qu'avec les six chiffres de Noël : ★ ● ▲ ■ ◆ ♥. Chaque atelier en cache un : les cloches, l'emballage, les biscuits, le calendrier de l'Avent, le sapin et la patinoire.\n\nMinuit, c'est bientôt. Fais vite… mais fais bien !\n— Mère Flocon",
        "Little elf,\n\nThe hangar door only opens with the six Christmas digits: ★ ● ▲ ■ ◆ ♥. Each workshop hides one: the bells, the wrapping, the cookies, the Advent calendar, the tree and the ice rink.\n\nMidnight is coming. Be quick… but be careful!\n— Mother Snowflake",
        'Chú lùn nhỏ,\n\nCửa nhà xe chỉ mở bằng sáu chữ số Giáng sinh: ★ ● ▲ ■ ◆ ♥. Mỗi góc xưởng giấu một số: những chiếc chuông, giấy gói quà, bánh quy, lịch Mùa Vọng, cây thông và sân băng.\n\nSắp nửa đêm rồi. Nhanh lên… nhưng phải cẩn thận nhé!\n— Bà Bông Tuyết') },
      letter: { s: 'paper', t: T('Une lettre d’enfant', 'A child’s letter', 'Thư của một em bé'), b: T(
        "Cher Père Noël,\n\nJe m'appelle An, j'ai 7 ans et j'habite à Hội An, au Vietnam. Ici il ne neige jamais, mais on accroche des étoiles en papier partout ! Cette année, je voudrais un traîneau en bois pour mon petit frère, et des biscuits au gingembre pour toi et les rennes.\n\nJoyeux Noël !\nAn",
        "Dear Father Christmas,\n\nMy name is An, I am 7 and I live in Hội An, in Vietnam. It never snows here, but we hang paper stars everywhere! This year I would like a wooden sleigh for my little brother, and gingerbread biscuits for you and the reindeer.\n\nMerry Christmas!\nAn",
        'Ông già Noel kính mến,\n\nCháu tên là An, cháu 7 tuổi và sống ở Hội An, Việt Nam. Ở đây không bao giờ có tuyết, nhưng mọi người treo sao giấy khắp nơi! Năm nay cháu muốn một chiếc xe trượt bằng gỗ cho em trai, và bánh quy gừng cho ông và đàn tuần lộc.\n\nChúc ông Giáng sinh vui vẻ!\nAn') }
    },
    pzs: {
      bells: { type: 'pitch', dig: '★', t: T('Les cloches de l’atelier', 'The workshop bells', 'Những chiếc chuông'), ctx: T('Les cloches du traîneau ont été décrochées. Pour qu’elles sonnent juste, il faut les raccrocher de la plus grave à la plus aiguë.', 'The sleigh bells have been taken down. To ring true, they must be hung back from lowest to highest.', 'Chuông xe trượt đã bị tháo xuống. Muốn kêu đúng, phải treo lại từ chiếc trầm nhất đến chiếc cao nhất.'),
        done: T('Les cloches carillonnent parfaitement. Sur la plus grosse : ★ et un chiffre.', 'The bells chime perfectly. On the biggest one: ★ and a digit.', 'Những chiếc chuông ngân vang hoàn hảo. Trên chiếc lớn nhất: ★ và một chữ số.') },
      wrap: { type: 'cube', dig: '♥', t: T('La table d’emballage', 'The wrapping table', 'Bàn gói quà'), ctx: T('Les feuilles de papier cadeau sont prédécoupées pour faire des boîtes. Mère Flocon veut savoir ce qui sera face à face.', 'The wrapping sheets are pre-cut to make boxes. Mother Snowflake wants to know what will face what.', 'Giấy gói quà đã được cắt sẵn để gấp hộp. Bà Bông Tuyết muốn biết mặt nào sẽ đối diện mặt nào.'),
        done: T('Le paquet est parfait. Sur l’étiquette : ♥ et un chiffre.', 'The parcel is perfect. On the tag: ♥ and a digit.', 'Gói quà thật hoàn hảo. Trên nhãn: ♥ và một chữ số.') },
      cookies: { type: 'recipe', dig: '■', t: T('La recette des biscuits', 'The cookie recipe', 'Công thức bánh quy'), ctx: T('Tous les lutins veulent des biscuits avant le départ ! Il faut agrandir la recette de Mère Flocon.', 'Every elf wants cookies before take-off! Mother Snowflake’s recipe has to be scaled up.', 'Chú lùn nào cũng muốn ăn bánh quy trước giờ xuất phát! Phải tăng công thức của bà Bông Tuyết lên.'),
        done: T('Les biscuits sortent du four. Sur la plaque : ■ et un chiffre en sucre glace.', 'The cookies come out of the oven. On the tray: ■ and a digit in icing sugar.', 'Bánh quy ra lò. Trên khay: ■ và một chữ số bằng đường bột.') },
      advent: { type: 'chain', dig: '◆', t: T('Le calendrier de l’Avent', 'The Advent calendar', 'Lịch Mùa Vọng'), ctx: T('Chaque porte du calendrier cache une opération. La dernière porte attend le résultat.', 'Each door of the calendar hides an operation. The last door is waiting for the result.', 'Mỗi ô cửa của tờ lịch giấu một phép tính. Ô cuối cùng đang chờ kết quả.'),
        done: T('La 24e porte s’ouvre : ◆ et un chiffre en chocolat.', 'The 24th door opens: ◆ and a chocolate digit.', 'Ô cửa thứ 24 mở ra: ◆ và một chữ số bằng sô-cô-la.') },
      garland: { type: 'graph', dig: '●', t: T('La guirlande du sapin', 'The tree garland', 'Dây đèn trên cây thông'), ctx: T('La guirlande clignote mal : deux boules reliées ne doivent jamais être de la même couleur.', 'The garland is flickering: two connected baubles must never be the same colour.', 'Dây đèn nhấp nháy lung tung: hai quả châu nối nhau không được cùng màu.'),
        done: T('Le sapin s’illumine ! L’étoile de la cime affiche : ● et un chiffre.', 'The tree lights up! The star on top shows: ● and a digit.', 'Cây thông bừng sáng! Ngôi sao trên đỉnh hiện: ● và một chữ số.') },
      sled: { type: 'program', dig: '▲', t: T('La patinoire', 'The ice rink', 'Sân băng'), ctx: T('Un cadeau est tombé au milieu de la patinoire gelée. Programme le petit traîneau téléguidé pour aller le chercher.', 'A present has fallen in the middle of the frozen rink. Program the little remote-controlled sleigh to fetch it.', 'Một món quà rơi giữa sân băng. Hãy lập trình chiếc xe trượt điều khiển từ xa để đi lấy nó.'),
        done: T('Le traîneau rapporte le cadeau. Sur le papier : ▲ et un chiffre.', 'The sleigh brings back the present. On the wrapping: ▲ and a digit.', 'Xe trượt mang món quà về. Trên giấy gói: ▲ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [100, 100, 420, 300], n: T('Cloches', 'Bells', 'Chuông'), click: g => g.pz('bells') },
      { v: 'a', r: [560, 540, 480, 220], n: T('Table d’emballage', 'Wrapping table', 'Bàn gói quà'), click: g => g.pz('wrap') },
      { v: 'a', r: [600, 100, 480, 300], n: T('Étagères de jouets', 'Toy shelves', 'Kệ đồ chơi'), click: g => g.say(T('Des trains en bois, des poupées, des toupies… tous étiquetés pour les enfants du monde entier.', 'Wooden trains, dolls, spinning tops… all labelled for children all over the world.', 'Tàu gỗ, búp bê, con quay… tất cả đều dán nhãn gửi trẻ em khắp thế giới.')) },
      { v: 'a', r: [100, 470, 340, 120], n: T('Mot épinglé', 'Pinned note', 'Mẩu giấy ghim'), click: g => g.doc('mother', true) },
      { v: 'a', r: [1180, 140, 340, 600], n: T('Porte du hangar', 'Hangar door', 'Cửa nhà xe'), fin: true },
      { v: 'b', r: [100, 460, 440, 280], n: T('Four et recette', 'Oven and recipe', 'Lò nướng và công thức'), click: g => g.pz('cookies') },
      { v: 'b', r: [620, 110, 400, 330], n: T('Calendrier de l’Avent', 'Advent calendar', 'Lịch Mùa Vọng'), click: g => g.pz('advent') },
      { v: 'b', r: [1150, 120, 330, 280], n: T('Fenêtre', 'Window', 'Cửa sổ'), click: g => g.say(T('Dehors, une aurore boréale ondule au-dessus des sapins.', 'Outside, the northern lights ripple above the fir trees.', 'Bên ngoài, cực quang uốn lượn trên những rặng thông.')) },
      { v: 'b', r: [1180, 560, 170, 170], n: T('Pot à biscuits', 'Cookie jar', 'Hũ bánh quy'), hid: true, click: g => { g.doc('letter'); g.say(T('Au fond du pot à biscuits, une lettre d’enfant tombée du sac postal.', 'At the bottom of the cookie jar, a child’s letter fallen from the mailbag.', 'Dưới đáy hũ bánh quy có một lá thư của em bé rơi ra từ túi thư.')); } },
      { v: 'c', r: [150, 80, 460, 680], n: T('Sapin', 'Christmas tree', 'Cây thông'), click: g => g.pz('garland') },
      { v: 'c', r: [700, 520, 820, 330], n: T('Patinoire', 'Ice rink', 'Sân băng'), click: g => g.pz('sled') },
      { v: 'c', r: [800, 110, 600, 330], n: T('Écurie des rennes', 'Reindeer stable', 'Chuồng tuần lộc'), click: g => g.say(T('Les rennes attendent, harnachés, en mâchonnant du lichen. Le plus petit a le nez qui brille.', 'The reindeer wait in their harnesses, munching lichen. The smallest one has a glowing nose.', 'Đàn tuần lộc đã thắng yên cương, vừa chờ vừa nhai rêu. Con nhỏ nhất có chiếc mũi phát sáng.')) }
    ],
    goals: [
      [g => g.f.doc_mother, g => true, T('Un mot de Mère Flocon est épinglé près des cloches.', 'A note from Mother Snowflake is pinned near the bells.', 'Lời nhắn của bà Bông Tuyết được ghim gần mấy chiếc chuông.')],
      [g => g.solved('bells'), g => true, T('Raccroche les cloches de la plus grave à la plus aiguë.', 'Hang the bells back from lowest to highest.', 'Treo lại chuông từ trầm nhất đến cao nhất.')],
      [g => g.solved('wrap'), g => true, T('La table d’emballage : imagine le cube plié.', 'The wrapping table: picture the folded cube.', 'Bàn gói quà: hãy tưởng tượng hình lập phương đã gấp.')],
      [g => g.solved('cookies'), g => true, T('À la cuisine, agrandis la recette des biscuits.', 'In the kitchen, scale up the cookie recipe.', 'Trong bếp, hãy tăng công thức bánh quy.')],
      [g => g.solved('advent'), g => true, T('Le calendrier de l’Avent : calcule de porte en porte.', 'The Advent calendar: calculate door by door.', 'Lịch Mùa Vọng: tính lần lượt từng ô cửa.')],
      [g => g.solved('garland'), g => true, T('Dans la cour, répare la guirlande du sapin.', 'In the yard, fix the tree garland.', 'Ngoài sân, sửa lại dây đèn cây thông.')],
      [g => g.solved('sled'), g => true, T('La patinoire : programme le traîneau jusqu’au cadeau.', 'The ice rink: program the sleigh to the present.', 'Sân băng: lập trình xe trượt đến chỗ món quà.')]
    ]
  };

  window.Content.push(manor, workshop);
})();

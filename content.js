// Contenu des quatre scénarios : histoire, vues, objets, documents, énigmes et zones à fouiller.
// Chaque texte est donné en trois langues : T(français, anglais, vietnamien).
(() => {
  'use strict';
  const T = (fr, en, vi) => ({ fr, en, vi });
  const { rand, shuffle, NUMS, genMap, genGlyphs } = window.Logic;
  const hm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const numAns = d => [String(d), NUMS.fr[d], NUMS.en[d], NUMS.vi[d]];
  const SYM = ['★', '●', '▲', '■'];

  // ============================ 1. LA CLASSE ============================
  const SUBJ = T(['Français', 'Histoire', 'Mathématiques', 'Sciences', 'Musique', 'Anglais'],
    ['French', 'History', 'Mathematics', 'Science', 'Music', 'English'],
    ['Ngữ văn', 'Lịch sử', 'Toán', 'Khoa học', 'Âm nhạc', 'Tiếng Anh']);
  const classroom = {
    id: 'class', icon: '🎒', amb: ['bandpass', 2600, .05], morse: null,
    name: T('Le cartable verrouillé', 'The Locked Schoolbag', 'Chiếc cặp bị khóa'),
    desc: T("Une classe, la nuit, sous l'orage.", 'A classroom at night, in a thunderstorm.', 'Lớp học ban đêm, giữa cơn giông.'),
    intro: T("Tu t'es assoupi(e) au fond de la classe après les cours. Quand tu rouvres les yeux, il fait nuit, l'orage gronde… et ton cartable est fermé par un gros cadenas à six chiffres. Au fond de la classe, sur le tableau de liège, un mot porte ton nom. Quelqu'un joue avec toi ce soir.",
      'You dozed off at the back of the classroom after school. When you open your eyes it is dark, thunder rumbles… and your schoolbag is shut with a big six-digit padlock. At the back of the room, on the cork board, a note has your name on it. Someone is playing a game with you tonight.',
      'Bạn ngủ quên ở cuối lớp sau giờ học. Khi mở mắt ra, trời đã tối, sấm rền vang… và chiếc cặp của bạn bị khóa bằng một ổ khóa sáu số. Ở cuối lớp, trên bảng ghim, có một mẩu giấy ghi tên bạn. Tối nay, có người đang chơi trò đố vui với bạn.'),
    outro: T("Clac ! Le cadenas cède. Dans ton cartable : une clé et une carte « Ouvre la porte ! ». Tu tournes la clé… la lumière du couloir jaillit : « SURPRISE ! JOYEUX ANNIVERSAIRE ! » Nhi et toute la classe t'attendaient, autour d'un gâteau couvert de bougies.",
      "Clack! The padlock gives way. Inside your bag: a key and a card saying 'Open the door!'. You turn the key… light floods in from the hallway: 'SURPRISE! HAPPY BIRTHDAY!' Nhi and the whole class were waiting for you, around a cake covered in candles.",
      'Tách! Ổ khóa bật mở. Trong cặp có một chiếc chìa khóa và tấm thiệp « Mở cửa ra nào! ». Bạn xoay chìa… ánh đèn hành lang ùa vào: « BẤT NGỜ CHƯA! CHÚC MỪNG SINH NHẬT! » Nhi và cả lớp đang chờ bạn quanh chiếc bánh kem cắm đầy nến.'),
    views: {
      a: { scene: 'classA', n: T('Le tableau', 'The blackboard', 'Bảng đen') },
      b: { scene: 'classB', n: T('Le fond de la classe', 'The back of the room', 'Cuối lớp') },
      c: { scene: 'classC', n: T('La porte', 'The door', 'Cửa ra vào') }
    },
    order: ['a', 'b', 'c'],
    typo: {
      fr: "Ce soir, la {slasse|classe} est vide et silencieuse. La pluie frappe {res|les} vitres, et le vieux tableau noir {ast|est} encore couvert de craie. Près de la {penêtre|fenêtre}, un cartable verrouillé attend son propriétaire.",
      en: 'Tonight the {crassroom|classroom} is empty and silent. Rain taps {an|on} the windows, and the old {blakkboard|blackboard} is still covered in chalk. Near the door, a locked schoolbag waits for its owner to come {bach|back}.',
      vi: 'Đêm nay, lớp học vắng lặng. Mưa gõ nhẹ lên ô cửa kính, chiếc {pàn|bàn} gỗ cũ phủ đầy bụi phấn. {Cói|Cái} cặp bị khóa {lằm|nằm} im trong góc, dưới tấm {bảnh|bảng} đen, chờ chủ nhân quay lại.'
    },
    init(g) {
      const v = g.v; let t = 7 * 60 + 45 + rand(4) * 5;
      v.tt = shuffle([0, 1, 2, 3, 4, 5]).map(s => { const r = [s, t]; t += 55 + rand(4) * 5; return r; });
      const m = v.tt.find(x => x[0] === 2)[1]; v.ch = Math.floor(m / 60) % 12 || 12; v.cm = m % 60;
      v.rain = [['red', 'orange', 'yellow', 'green', 'blue'], ['red', 'orange', 'yellow', 'green', 'blue', 'violet'], ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']][g.lvl];
      v.shelf = shuffle(v.rain.concat([['brown', 'black'], ['brown', 'black', 'pink'], ['brown', 'black', 'pink', 'white']][g.lvl]));
    },
    items: {
      battery: { i: '🔋', n: T('Pile', 'Battery', 'Viên pin'), d: T('Une pile neuve, trouvée dans la poche d’une veste.', 'A fresh battery from a jacket pocket.', 'Một viên pin mới, tìm thấy trong túi áo khoác.') },
      uv0: { i: '🔦', n: T('Lampe UV (vide)', 'UV torch (empty)', 'Đèn UV (hết pin)'), d: T('Une lampe à lumière noire. Le compartiment à pile est vide.', 'A black-light torch. The battery compartment is empty.', 'Một chiếc đèn tia cực tím. Ngăn chứa pin đang trống.') },
      uv: { i: '🟣', n: T('Lampe UV', 'UV torch', 'Đèn UV'), d: T('Elle émet une lumière violette. Garde-la en main et promène-la sur le décor : l’encre invisible apparaîtra.', 'It gives off a violet glow. Hold it and sweep it over the room: invisible ink will show up.', 'Đèn phát ra ánh tím. Hãy cầm nó và rọi khắp phòng: mực tàng hình sẽ hiện ra.') },
      key: { i: '🗝️', n: T('Petite clé dorée', 'Small golden key', 'Chìa khóa vàng nhỏ'), d: T('Trouvée dans l’horloge. Elle est minuscule, comme pour un tiroir.', 'Found inside the clock. It is tiny, just right for a drawer.', 'Tìm thấy trong đồng hồ. Nó nhỏ xíu, vừa với một ngăn kéo.') },
      fuse: { i: '🔌', n: T('Fusible', 'Fuse', 'Cầu chì'), d: T('Un fusible neuf. Le panneau électrique près de la porte en a justement un de grillé.', 'A new fuse. The breaker panel by the door happens to have a blown one.', 'Một chiếc cầu chì mới. Bảng điện cạnh cửa đang có một cái bị cháy.') },
      worksheet: { i: '📄', n: T("Feuille d'exercices", 'Worksheet', 'Phiếu bài tập'), d: T('Des calculs… avec des fruits à la place des nombres.', 'Sums… with fruit instead of numbers.', 'Những phép tính… dùng trái cây thay cho con số.'), ex: g => g.pz('algebra') }
    },
    combos: [['battery', 'uv0', 'uv', T('Tu glisses la pile dans la lampe. Une lueur violette s’allume !', 'You slide the battery into the torch. A violet glow lights up!', 'Bạn lắp pin vào đèn. Một ánh tím bừng sáng!')]],
    docs: {
      note: { s: 'note', t: T('Le mot de Nhi', "Nhi's note", 'Mẩu giấy của Nhi'), b: T(
        "Coucou, la marmotte ! 😄\n\nTu dormais si bien que je n'ai pas voulu te réveiller… alors j'ai verrouillé ton cartable. Juste un petit défi, promis.\n\nSix chiffres sont cachés dans cette classe. Chacun est marqué d'un symbole : ★ ● ▲ ■ ◆ ♥. Le cadenas te dira dans quel ordre les composer.\n\nCherche partout : derrière, dessous, dedans. Certaines choses ne se voient pas à l'œil nu… Et si tu bloques, rappelle-toi que j'adore les arcs-en-ciel, la musique et les maths.\n\n— Nhi\n\nP.-S. Le tableau noir est plein de fautes. Ce n'est pas un hasard.",
        "Hey, sleepyhead! 😄\n\nYou were sleeping so soundly I didn't want to wake you… so I locked your schoolbag. Just a little challenge, I promise.\n\nSix digits are hidden in this classroom. Each one is marked with a symbol: ★ ● ▲ ■ ◆ ♥. The padlock will tell you which order to enter them in.\n\nSearch everywhere: behind, under, inside. Some things can't be seen with the naked eye… And if you get stuck, remember that I love rainbows, music and maths.\n\n— Nhi\n\nP.S. The blackboard is full of mistakes. That's no accident.",
        'Chào bạn ngủ nướng! 😄\n\nThấy bạn ngủ ngon quá nên mình không nỡ đánh thức… thế là mình khóa cặp của bạn lại. Chỉ thử thách một xíu thôi, hứa đó.\n\nCó sáu chữ số được giấu trong lớp này. Mỗi số mang một ký hiệu: ★ ● ▲ ■ ◆ ♥. Ổ khóa sẽ cho bạn biết phải nhập theo thứ tự nào.\n\nTìm khắp nơi nhé: phía sau, bên dưới, bên trong. Có những thứ mắt thường không nhìn thấy được… Nếu bí quá, hãy nhớ rằng mình rất mê cầu vồng, âm nhạc và toán học.\n\n— Nhi\n\nT.B. Bảng đen đầy lỗi chính tả. Không phải ngẫu nhiên đâu.') },
      tt: { s: 'paper', t: T('Emploi du temps', 'Timetable', 'Thời khóa biểu'), b: g => {
        const rows = g.v.tt.slice().sort((a, b) => a[1] - b[1]).map(([s, m]) => `<tr><td>${hm(m)}</td><td>${g.X(SUBJ)[s]}</td></tr>`).join('');
        return `<table class="tt">${rows}</table><p class="hand">${g.X(T('Dans la marge, l’écriture de Nhi : « Mon cours préféré ? Celui où l’on compte. L’horloge du fond s’est arrêtée… elle aimerait bien le connaître, elle aussi. »',
          'In the margin, in Nhi’s handwriting: “My favourite class? The one where we count. The clock at the back has stopped… it would like to know it too.”',
          'Bên lề, nét chữ của Nhi: « Môn học mình thích nhất ư? Môn mà ta phải đếm. Chiếc đồng hồ cuối lớp đã đứng rồi… nó cũng muốn biết giờ của môn ấy đấy. »'))}</p>`;
      } },
      teacher: { s: 'paper', t: T('Mot du professeur', 'Note from the teacher', 'Lời nhắn của thầy'), b: T(
        "Nhi,\n\nJe veux bien que tu prépares ta chasse au trésor d'anniversaire dans ma classe ce soir, à une condition : tout doit être rangé avant 8 h demain matin !\n\nLe clavier électrique, près de la porte, n'a plus de courant : un fusible a grillé dans le panneau. Je t'en laisse un neuf dans ce tiroir. Une fois remplacé, il faudra rallumer tous les voyants en même temps… mais chaque bouton fait aussi basculer ses voisins.\n\nTu m'as dit que ton ami(e) devrait rejouer ta mélodie « à l'oreille » sur les touches lumineuses. Bonne chance à lui (ou elle) !\n— M. Tremblay",
        "Nhi,\n\nI'm happy for you to set up your birthday treasure hunt in my classroom tonight, on one condition: everything must be tidied up before 8 a.m. tomorrow!\n\nThe electric keyboard by the door has no power: a fuse has blown in the panel. I'm leaving you a new one in this drawer. Once it's replaced, every light will need to be on at the same time… but each button also flips its neighbours.\n\nYou told me your friend will have to play your melody back 'by ear' on the light-up keys. Good luck to them!\n— Mr Tremblay",
        'Nhi à,\n\nThầy đồng ý cho em tổ chức trò truy tìm kho báu mừng sinh nhật trong lớp tối nay, với một điều kiện: mọi thứ phải gọn gàng trước 8 giờ sáng mai!\n\nCây đàn điện cạnh cửa mất điện vì một cầu chì trong bảng điện bị cháy. Thầy để sẵn một cái mới trong ngăn kéo này. Thay xong, phải làm cho tất cả đèn cùng sáng một lúc… nhưng mỗi nút lại làm đảo cả các ô bên cạnh.\n\nEm bảo bạn của em sẽ phải chơi lại giai điệu của em « bằng tai » trên các phím phát sáng. Chúc bạn ấy may mắn!\n— Thầy Tremblay') },
      envelope: { s: 'note', t: T('Enveloppe cachée', 'Hidden envelope', 'Phong bì bí mật'), b: T(
        "Bravo, rat de bibliothèque ! 📚\nTu as remis les livres dans l'ordre de l'arc-en-ciel.\n\nDans cette enveloppe : une feuille de calculs… avec des fruits. Trouve ce que vaut chaque fruit, et le chiffre ■ est à toi.\n— N.",
        "Well done, bookworm! 📚\nYou put the books back in rainbow order.\n\nIn this envelope: a sheet of sums… with fruit. Work out what each fruit is worth, and the ■ digit is yours.\n— N.",
        'Giỏi lắm, mọt sách! 📚\nBạn đã xếp sách theo đúng thứ tự cầu vồng.\n\nTrong phong bì này có một tờ phép tính… bằng trái cây. Tìm ra giá trị của từng loại quả, chữ số ■ sẽ là của bạn.\n— N.') },
      draft: { s: 'paper', t: T('Brouillon froissé', 'Crumpled draft', 'Bản nháp nhàu nát'), b: T(
        "Idées pour la chasse au trésor (NE PAS LAISSER TRAÎNER !!)\n\n– tableau noir : fautes → mot → casier\n– lampe à lumière noire : il lui faut une pile (la veste du concierge ?)\n– l'affiche cache un ▲ à l'encre invisible\n– horloge : heure du cours de maths → clé du tiroir → fusible\n– cartes du bureau → ●\n– ~~arc-en-ciel sur la fenêtre~~ trop facile ?\n– clavier : rejouer ma mélodie à l'oreille → ★\n\nÇa va être génial.",
        "Treasure hunt ideas (DON'T LEAVE THIS LYING AROUND!!)\n\n– blackboard: mistakes → word → locker\n– black-light torch: needs a battery (the caretaker's jacket?)\n– the poster hides a ▲ in invisible ink\n– clock: time of maths class → drawer key → fuse\n– cards on the desk → ●\n– ~~rainbow on the window~~ too easy?\n– keyboard: play my melody back by ear → ★\n\nThis is going to be great.",
        'Ý tưởng cho trò truy tìm kho báu (KHÔNG ĐƯỢC ĐỂ LUNG TUNG!!)\n\n– bảng đen: lỗi chính tả → từ → tủ đồ\n– đèn tia cực tím: cần pin (áo khoác của bác bảo vệ?)\n– tấm áp phích giấu chữ số ▲ bằng mực tàng hình\n– đồng hồ: giờ học Toán → chìa khóa ngăn kéo → cầu chì\n– bộ bài trên bàn → ●\n– ~~cầu vồng trên cửa kính~~ dễ quá?\n– đàn điện: chơi lại giai điệu bằng tai → ★\n\nChắc chắn sẽ vui lắm đây.') }
    },
    pzs: {
      typo: { type: 'typo', t: T('Le tableau noir', 'The blackboard', 'Bảng đen'), ctx: T('Le texte du tableau a été recopié par Nhi… avec des fautes volontaires.', 'Nhi copied out the text on the board… with deliberate mistakes.', 'Nhi đã chép lại đoạn văn trên bảng… với những lỗi cố ý.'),
        done: T('Les lettres corrigées forment le mot {typoWord}. Un mot de quatre lettres… comme un cadenas ?', 'The corrected letters spell {typoWord}. A four-letter word… like a padlock?', 'Các chữ cái được sửa ghép thành từ {typoWord}. Một từ bốn chữ cái… giống một ổ khóa?'),
        note: T('Mot du tableau : {typoWord}', 'Word on the board: {typoWord}', 'Từ trên bảng: {typoWord}') },
      locker: { type: 'wlock', chars: 'letters', len: 4, ans: g => g.typoWord(), t: T('Le casier de Nhi', "Nhi's locker", 'Tủ đồ của Nhi'), ctx: T('Un cadenas à quatre lettres. Un autocollant : « Ce que j’écris au tableau m’ouvre. »', 'A four-letter padlock. A sticker says: “What I write on the board opens me.”', 'Một ổ khóa bốn chữ cái. Có miếng dán: « Thứ mình viết trên bảng sẽ mở được mình. »'),
        done: T('Le casier s’ouvre : une lampe à lumière noire… sans pile.', 'The locker opens: a black-light torch… with no battery.', 'Tủ mở ra: một chiếc đèn tia cực tím… không có pin.'), ok: g => g.take('uv0') },
      clock: { type: 'clock', target: g => [g.v.ch, g.v.cm], t: T("L'horloge arrêtée", 'The stopped clock', 'Chiếc đồng hồ đứng'), ctx: T('Sous l’horloge, une étiquette : « Remets-moi à l’heure de ton cours préféré… ou plutôt du sien. »', 'Under the clock, a label: “Set me to the time of your favourite class… or rather, hers.”', 'Dưới đồng hồ có một nhãn dán: « Hãy chỉnh tôi về giờ môn học yêu thích của bạn… à không, của cô ấy. »'),
        done: T('Clic ! Le dos de l’horloge s’ouvre : une petite clé dorée tombe dans ta main.', 'Click! The back of the clock pops open: a small golden key drops into your hand.', 'Tách! Mặt sau đồng hồ bật mở: một chiếc chìa khóa vàng nhỏ rơi vào tay bạn.'), ok: g => g.take('key') },
      cards: { type: 'cards', dig: '●', t: T('Les cartes du bureau', 'The cards on the desk', 'Bộ bài trên bàn'), ctx: T('Un tour de logique, inspiré d’une vieille énigme que Nhi adore. Au dos de la bonne carte, un ● est dessiné.', 'A logic trick, inspired by an old riddle Nhi loves. On the back of the right card, a ● is drawn.', 'Một trò logic, lấy cảm hứng từ câu đố cũ mà Nhi rất thích. Mặt sau lá bài đúng có vẽ một dấu ●.'),
        done: T('Au dos de la carte : ● et un chiffre.', 'On the back of the card: ● and a digit.', 'Mặt sau lá bài: ● và một chữ số.') },
      books: { type: 'seq', style: 'books', items: g => g.v.shelf.map(c => ({ k: c, label: g.L().colors[c], color: c })), ans: g => g.v.rain,
        t: T('La bibliothèque', 'The bookshelf', 'Giá sách'), ctx: T('Une rangée de livres aux couleurs vives. Ils semblent attendre d’être tirés dans un certain ordre…', 'A row of brightly coloured books. They seem to be waiting to be pulled in a certain order…', 'Một hàng sách nhiều màu rực rỡ. Có vẻ chúng đang chờ được kéo ra theo một thứ tự nhất định…'),
        h2: g => g.tr('firstStep', { x: g.L().colors[g.v.rain[0]] }),
        done: T('Un déclic : derrière les livres, un compartiment secret ! Une enveloppe avec une feuille de calculs.', 'A click: behind the books, a secret compartment! An envelope with a sheet of sums.', 'Tách: sau hàng sách là một ngăn bí mật! Một phong bì đựng tờ phép tính.'), ok: g => { g.take('worksheet'); g.doc('envelope'); } },
      algebra: { type: 'algebra', dig: '■', icons: ['🍎', '🍌', '🍐'], t: T('Les fruits de Nhi', "Nhi's fruit sums", 'Phép tính trái cây của Nhi'), ctx: T('« Les maths, c’est de la magie », a écrit Nhi. Et une poire vaut plus que tu ne crois…', '“Maths is magic,” Nhi wrote. And a pear is worth more than you think…', '« Toán học là phép màu », Nhi viết. Và một quả lê đáng giá hơn bạn tưởng…'),
        done: T('En bas de la feuille, Nhi a dessiné un ■ et un chiffre.', 'At the bottom of the sheet, Nhi drew a ■ and a digit.', 'Cuối trang, Nhi vẽ một dấu ■ và một chữ số.') },
      lights: { type: 'lights', t: T('Le panneau électrique', 'The breaker panel', 'Bảng điện'), ctx: T('Le fusible neuf est en place. Il reste à réarmer le panneau.', 'The new fuse is in. Now the panel has to be reset.', 'Cầu chì mới đã lắp xong. Giờ phải khởi động lại bảng điện.'),
        done: T('Les néons clignotent puis s’allument. Près de la porte, le clavier électrique émet un petit bip.', 'The fluorescent lights flicker and come on. By the door, the electric keyboard gives a little beep.', 'Đèn huỳnh quang chớp chớp rồi bật sáng. Cạnh cửa, cây đàn điện kêu « bíp » một tiếng.'), ok: g => g.set('lights') },
      piano: { type: 'simon', dig: '★', t: T('Le clavier électrique', 'The electric keyboard', 'Cây đàn điện'), ctx: T('Un post-it sur le clavier : « Écoute ma mélodie sur les touches lumineuses, puis rejoue-la. Je te donnerai une étoile. »', 'A sticky note on the keyboard: “Listen to my melody on the light-up keys, then play it back. I will give you a star.”', 'Mẩu giấy dán trên đàn: « Nghe giai điệu của mình trên các phím phát sáng, rồi chơi lại. Mình sẽ tặng bạn một ngôi sao. »'),
        done: T('Le couvercle du clavier s’ouvre : une étoile ★ et un chiffre, dessinés au feutre doré.', 'The keyboard lid opens: a star ★ and a digit, drawn in gold marker.', 'Nắp đàn mở ra: một ngôi sao ★ và một chữ số, vẽ bằng bút nhũ vàng.') }
    },
    hs: [
      { v: 'a', r: [180, 150, 620, 330], n: T('Tableau noir', 'Blackboard', 'Bảng đen'), click: g => g.pz('typo') },
      { v: 'a', r: [828, 172, 134, 186], n: T('Affiche', 'Poster', 'Áp phích'), click: g => {
        if (g.f.uvPoster) return g.say(T('Sous la lumière violette : ▲ = {d▲}.', 'Under the violet light: ▲ = {d▲}.', 'Dưới ánh tím: ▲ = {d▲}.'));
        if (g.held === 'uv') { g.set('uvPoster'); g.digit('▲'); return g.say(T('Sous la lumière violette, des traits invisibles s’illuminent : un ▲ et le chiffre {d▲} !', 'Under the violet light, invisible lines glow: a ▲ and the digit {d▲}!', 'Dưới ánh tím, những nét vẽ vô hình bừng sáng: một dấu ▲ và chữ số {d▲}!')); }
        g.say(T('Une affiche de formes : cercle, triangle, carré… Le papier brille bizarrement par endroits, comme si on y avait écrit avec un feutre transparent.', 'A poster of shapes: circle, triangle, square… The paper shines oddly in places, as if someone wrote on it with a clear marker.', 'Một tấm áp phích các hình khối: tròn, tam giác, vuông… Có vài chỗ giấy bóng lên kỳ lạ, như thể ai đó đã viết bằng bút trong suốt.'));
      } },
      { v: 'a', r: [990, 100, 420, 390], n: T('Fenêtre', 'Window', 'Cửa sổ'), click: g => { g.note('fog', T('Buée de la fenêtre : un arc-en-ciel et « les livres aussi aiment cet ordre ».', 'Fog on the window: a rainbow and “books like this order too”.', 'Hơi nước trên cửa kính: một cầu vồng và « sách cũng thích thứ tự này ».'));
        g.say(T('La pluie ruisselle sur les vitres. Dans la buée, quelqu’un a dessiné du doigt un arc-en-ciel et écrit : « Les livres aussi aiment cet ordre. »', 'Rain streams down the panes. In the fog, someone has drawn a rainbow with a finger and written: “Books like this order too.”', 'Mưa chảy ròng ròng trên kính. Trên lớp hơi nước, ai đó đã lấy ngón tay vẽ một cầu vồng và viết: « Sách cũng thích thứ tự này. »')); } },
      { v: 'a', r: [545, 0, 110, 170], n: T('Lampe', 'Lamp', 'Đèn treo'), click: g => g.say(T('La lampe se balance doucement. Le courant vacille à chaque éclair.', 'The lamp sways gently. The power flickers with each flash of lightning.', 'Chiếc đèn đung đưa nhè nhẹ. Điện chập chờn theo từng tia chớp.')) },
      { v: 'a', r: [350, 598, 180, 84], n: T('Cahier d’appel', 'Register', 'Sổ điểm danh'), click: g => g.say(T('Le cahier d’appel du prof. Dans la marge : « Nhi — chasse au trésor ce soir, d’accord. Tout ranger avant 8 h ! »', 'The teacher’s register. In the margin: “Nhi — treasure hunt tonight, OK. Tidy everything before 8 a.m.!”', 'Sổ điểm danh của thầy. Bên lề ghi: « Nhi — tối nay chơi truy tìm kho báu, đồng ý. Dọn dẹp trước 8 giờ! »')) },
      { v: 'a', r: [612, 600, 132, 72], n: T('Jeu de cartes', 'Deck of cards', 'Bộ bài'), click: g => g.pz('cards') },
      { v: 'a', r: [288, 478, 104, 28], n: T('Craies', 'Chalk', 'Phấn'), hid: true, click: g => g.say(T('Sous les craies, un minuscule mot plié : « Le ● dort dans les cartes. Le ▲ ne se voit pas à l’œil nu. »', 'Under the chalk, a tiny folded note: “The ● sleeps in the cards. The ▲ can’t be seen with the naked eye.”', 'Dưới mấy viên phấn có một mẩu giấy gấp nhỏ: « Dấu ● ngủ trong bộ bài. Dấu ▲ thì mắt thường không thấy được. »')) },
      { v: 'a', r: [250, 740, 300, 110], n: T('Tiroir du bureau', 'Desk drawer', 'Ngăn kéo bàn'), click: g => {
        if (g.f.drawer) return g.say(T('Le tiroir est vide maintenant.', 'The drawer is empty now.', 'Ngăn kéo giờ đã trống.'));
        if (g.has('key')) { g.set('drawer'); g.drop('key'); g.take('fuse'); g.doc('teacher'); return g.say(T('La petite clé tourne. Dans le tiroir : un fusible neuf et un mot du professeur.', 'The little key turns. In the drawer: a new fuse and a note from the teacher.', 'Chiếc chìa nhỏ xoay được. Trong ngăn kéo: một cầu chì mới và lời nhắn của thầy.')); }
        g.say(T('Le tiroir du bureau est fermé à clé. Une toute petite serrure dorée.', 'The desk drawer is locked. A tiny golden lock.', 'Ngăn kéo bàn bị khóa. Một ổ khóa vàng nhỏ xíu.'));
      } },
      { v: 'a', r: [1125, 545, 250, 280], n: T('Ton cartable', 'Your schoolbag', 'Chiếc cặp của bạn'), fin: true },
      { v: 'b', r: [120, 170, 400, 520], n: T('Bibliothèque', 'Bookshelf', 'Giá sách'), click: g => g.solved('books') ? g.say(T('Le compartiment secret est vide.', 'The secret compartment is empty.', 'Ngăn bí mật đã trống.')) : g.pz('books') },
      { v: 'b', r: [705, 135, 190, 190], n: T('Horloge', 'Clock', 'Đồng hồ'), click: g => g.solved('clock') ? g.say(T('L’horloge tourne de nouveau : tic, tac…', 'The clock is ticking again: tick, tock…', 'Đồng hồ chạy lại rồi: tích tắc…')) : g.pz('clock') },
      { v: 'b', r: [1010, 170, 200, 150], n: T('Mot épinglé', 'Pinned note', 'Mẩu giấy ghim'), click: g => g.doc('note', true) },
      { v: 'b', r: [1225, 170, 205, 280], n: T('Emploi du temps', 'Timetable', 'Thời khóa biểu'), click: g => g.doc('tt', true) },
      { v: 'b', r: [1010, 330, 200, 120], n: T('Photo', 'Photo', 'Bức ảnh'), click: g => g.say(T('Une photo de classe : toi et Nhi, grimaçant au premier rang. Au dos : « Meilleurs amis pour toujours. »', 'A class photo: you and Nhi pulling faces in the front row. On the back: “Best friends forever.”', 'Ảnh tập thể lớp: bạn và Nhi đang nhăn mặt ở hàng đầu. Mặt sau ghi: « Bạn thân mãi mãi. »')) },
      { v: 'b', r: [560, 330, 140, 180], n: T('Globe', 'Globe', 'Quả địa cầu'), click: g => g.say(T('Tu fais tourner le globe. Deux petites étoiles collées : une sur le Québec, une sur le Vietnam.', 'You spin the globe. Two little stickers: one on Quebec, one on Vietnam.', 'Bạn xoay quả địa cầu. Có hai ngôi sao nhỏ được dán: một ở Québec, một ở Việt Nam.')) },
      { v: 'b', r: [620, 640, 620, 260], n: T('Pupitres', 'Desks', 'Bàn học'), click: g => g.say(T('Des pupitres gravés de prénoms et de cœurs. Sur l’un d’eux, au compas : « Nhi ♥ énigmes ».', 'Desks carved with names and hearts. On one, scratched with a compass: “Nhi ♥ puzzles”.', 'Những chiếc bàn khắc đầy tên và trái tim. Trên một chiếc có dòng khắc bằng com-pa: « Nhi ♥ câu đố ».')) },
      { v: 'b', r: [1300, 650, 130, 170], n: T('Corbeille', 'Bin', 'Thùng rác'), hid: true, click: g => { g.doc('draft'); g.say(T('Au fond de la corbeille, une feuille froissée… le brouillon de Nhi !', 'At the bottom of the bin, a crumpled sheet… Nhi’s draft!', 'Dưới đáy thùng rác có một tờ giấy nhàu… bản nháp của Nhi!')); } },
      { v: 'c', r: [80, 180, 400, 560], n: T('Casiers', 'Lockers', 'Tủ đồ'), click: g => g.solved('locker') ? g.say(T('Le casier de Nhi est ouvert et vide.', 'Nhi’s locker is open and empty.', 'Tủ của Nhi đã mở và trống trơn.')) : g.pz('locker') },
      { v: 'c', r: [600, 140, 280, 600], n: T('Porte', 'Door', 'Cửa'), click: g => g.say(T('Verrouillée de l’extérieur. Derrière, tu crois entendre des chuchotements… et un rire étouffé.', 'Locked from the outside. Behind it, you think you hear whispering… and a muffled giggle.', 'Bị khóa từ bên ngoài. Phía sau, bạn nghe như có tiếng thì thầm… và một tiếng cười khúc khích.')) },
      { v: 'c', r: [905, 360, 80, 110], n: T('Panneau électrique', 'Breaker panel', 'Bảng điện'), click: g => {
        if (g.solved('lights')) return g.say(T('Tous les voyants sont verts.', 'All the lights are green.', 'Tất cả đèn đều xanh.'));
        if (!g.f.fuse) {
          if (g.has('fuse')) { g.set('fuse'); g.drop('fuse'); g.say(T('Tu remplaces le fusible grillé. Le panneau s’allume… à moitié.', 'You replace the blown fuse. The panel lights up… halfway.', 'Bạn thay chiếc cầu chì cháy. Bảng điện sáng lên… được một nửa.')); return g.pz('lights'); }
          return g.say(T('Un des fusibles du panneau est noirci et fendu. Sans fusible neuf, rien ne marchera.', 'One of the panel’s fuses is blackened and cracked. Without a new fuse, nothing will work.', 'Một chiếc cầu chì trong bảng bị cháy đen và nứt. Không có cầu chì mới thì chẳng có gì chạy được.'));
        }
        g.pz('lights');
      } },
      { v: 'c', r: [1030, 170, 150, 200], n: T('Veste', 'Jacket', 'Áo khoác'), click: g => g.say(T('La vieille veste du concierge. Une des poches est bizarrement gonflée…', 'The caretaker’s old jacket. One of the pockets bulges oddly…', 'Chiếc áo khoác cũ của bác bảo vệ. Một bên túi phồng lên kỳ lạ…')) },
      { v: 'c', r: [1055, 380, 90, 80], n: T('Poche', 'Pocket', 'Túi áo'), hid: true, show: g => !g.f.pocket, click: g => { g.set('pocket'); g.take('battery'); g.say(T('Dans la poche : une pile neuve !', 'In the pocket: a fresh battery!', 'Trong túi: một viên pin mới!')); } },
      { v: 'c', r: [1220, 560, 340, 200], n: T('Clavier électrique', 'Electric keyboard', 'Đàn điện'), click: g => {
        if (!g.f.lights) return g.say(T('Le clavier ne s’allume pas. Pas de courant de ce côté de la classe.', 'The keyboard won’t turn on. No power on this side of the room.', 'Đàn không lên. Phía này của lớp bị mất điện.'));
        g.solved('piano') ? g.say(T('Le clavier joue tout seul un petit « Joyeux anniversaire ».', 'The keyboard plays a little “Happy Birthday” on its own.', 'Cây đàn tự chơi một đoạn « Chúc mừng sinh nhật ».')) : g.pz('piano');
      } }
    ],
    goals: [
      [g => g.f.doc_note, g => true, T('Au fond de la classe, sur le tableau de liège, un mot t’attend.', 'At the back of the room, on the cork board, a note is waiting for you.', 'Ở cuối lớp, trên bảng ghim, có một mẩu giấy đang chờ bạn.')],
      [g => g.solved('typo'), g => true, T('Le tableau noir est plein de fautes : clique sur les mots mal écrits.', 'The blackboard is full of mistakes: click the misspelled words.', 'Bảng đen đầy lỗi chính tả: hãy bấm vào những từ viết sai.')],
      [g => g.solved('locker'), g => g.solved('typo'), T('Le mot du tableau ouvre le casier de Nhi, près de la porte.', 'The word from the board opens Nhi’s locker, by the door.', 'Từ trên bảng sẽ mở được tủ của Nhi, cạnh cửa ra vào.')],
      [g => g.f.pocket, g => g.solved('locker'), T('Ta lampe a besoin d’une pile. Une veste est accrochée près de la porte…', 'Your torch needs a battery. A jacket hangs by the door…', 'Đèn của bạn cần pin. Có một chiếc áo khoác treo cạnh cửa…')],
      [g => g.has('uv') || g.f.uvPoster, g => g.has('uv0') && g.has('battery'), T('Combine la pile et la lampe : prends l’une en main, puis clique sur l’autre.', 'Combine the battery and the torch: hold one, then click the other.', 'Ghép pin với đèn: cầm một món lên rồi bấm vào món kia.')],
      [g => g.f.uvPoster, g => g.has('uv'), T('Prends la lampe UV en main et éclaire l’affiche près du tableau.', 'Hold the UV torch and shine it on the poster by the board.', 'Cầm đèn UV và rọi vào tấm áp phích cạnh bảng đen.')],
      [g => g.solved('clock'), g => true, T('L’horloge du fond est arrêtée. L’emploi du temps et la note de Nhi te disent quelle heure régler.', 'The clock at the back has stopped. The timetable and Nhi’s note tell you which time to set.', 'Đồng hồ cuối lớp đã đứng. Thời khóa biểu và lời ghi chú của Nhi cho bạn biết cần chỉnh giờ nào.')],
      [g => g.f.drawer, g => g.has('key'), T('La petite clé dorée ouvre le tiroir du bureau du prof.', 'The small golden key opens the teacher’s desk drawer.', 'Chìa khóa vàng nhỏ mở được ngăn kéo bàn giáo viên.')],
      [g => g.solved('cards'), g => true, T('Les cartes sur le bureau cachent une énigme de logique.', 'The cards on the desk hide a logic puzzle.', 'Bộ bài trên bàn ẩn chứa một câu đố logic.')],
      [g => g.solved('books'), g => true, T('Regarde la fenêtre de près, puis la bibliothèque.', 'Look closely at the window, then at the bookshelf.', 'Nhìn kỹ cửa sổ, rồi đến giá sách.')],
      [g => g.solved('algebra'), g => g.solved('books'), T('Examine la feuille de calculs dans ton inventaire.', 'Examine the sheet of sums in your inventory.', 'Xem kỹ tờ phép tính trong túi đồ.')],
      [g => g.f.fuse, g => g.has('fuse'), T('Le fusible va dans le panneau électrique près de la porte.', 'The fuse goes into the breaker panel by the door.', 'Cầu chì lắp vào bảng điện cạnh cửa.')],
      [g => g.solved('lights'), g => g.f.fuse, T('Rallume tous les voyants du panneau électrique.', 'Turn on every light on the breaker panel.', 'Bật sáng tất cả đèn trên bảng điện.')],
      [g => g.solved('piano'), g => g.f.lights, T('Le clavier a du courant : écoute la mélodie et rejoue-la.', 'The keyboard has power: listen to the melody and play it back.', 'Đàn đã có điện: hãy nghe giai điệu rồi chơi lại.')]
    ]
  };

  // ============================ 2. LE BATEAU ============================
  const ship = {
    id: 'ship', icon: '⛵', amb: ['lowpass', 520, .1], morse: ['SOS', 'HALONG', 'LANTERN'],
    name: T('La flotte de pêche', 'The Fishing Fleet', 'Đoàn thuyền đánh cá'),
    desc: T("La cabine d'un bateau, au large de la baie d'Hạ Long.", 'A boat cabin off Hạ Long Bay.', 'Khoang thuyền giữa vịnh Hạ Long.'),
    intro: T("Baie d'Hạ Long, juin 1958. Tu es le jeune apprenti du capitaine Lâm, à bord du Hòn Lửa. Tu te réveilles seul dans sa cabine : la porte est verrouillée, le bateau tangue, la tempête se lève. Par le hublot, le phare clignote d'une drôle de façon. Le journal de bord du capitaine est ouvert sur la table…",
      "Hạ Long Bay, June 1958. You are the young apprentice of Captain Lâm, aboard the Hòn Lửa. You wake up alone in his cabin: the door is locked, the boat is rolling, a storm is rising. Through the porthole, the lighthouse is blinking in a strange way. The captain's logbook lies open on the table…",
      'Vịnh Hạ Long, tháng Sáu năm 1958. Bạn là chú thủy thủ học việc của thuyền trưởng Lâm trên thuyền Hòn Lửa. Bạn tỉnh dậy một mình trong khoang của ông: cửa bị khóa, thuyền chòng chành, bão đang nổi. Qua ô cửa tròn, ngọn hải đăng nhấp nháy rất lạ. Cuốn nhật ký hải trình của thuyền trưởng đang mở trên bàn…'),
    outro: T("Le coffre s'ouvre : la clé de la cabine est là, posée sur une photo de l'équipage. Tu ouvres la porte. Le jour se lève, la tempête s'est éloignée et la flotte rentre au port, les filets pleins. Sur le pont du bateau voisin, le capitaine Lâm lève son chapeau : « Bienvenue dans l'équipage, matelot ! »",
      "The chest opens: the cabin key is there, lying on a photo of the crew. You open the door. Dawn is breaking, the storm has passed and the fleet is heading home with full nets. On the deck of the next boat, Captain Lâm raises his hat: 'Welcome to the crew, sailor!'",
      'Chiếc rương bật mở: chìa khóa khoang thuyền nằm đó, trên tấm ảnh của cả thuyền. Bạn mở cửa. Trời rạng sáng, cơn bão đã qua và đoàn thuyền trở về bến với những khoang cá đầy. Trên boong thuyền bên cạnh, thuyền trưởng Lâm giơ mũ chào: « Chào mừng cháu gia nhập thuyền, chàng thủy thủ! »'),
    views: {
      a: { scene: 'shipA', n: T('La cabine', 'The cabin', 'Khoang thuyền') },
      b: { scene: 'shipB', n: T('La couchette', 'The bunk', 'Giường ngủ') },
      c: { scene: 'shipC', n: T('La porte', 'The door', 'Cửa khoang') }
    },
    order: ['a', 'b', 'c'],
    init(g) {
      const v = g.v; v.k = 2 + rand(6);
      v.map = genMap([5, 6, 7][g.lvl], [3, 4, 5][g.lvl]);
      v.dirs = g2 => v.map.moves.map(([d, k]) => k + ' ' + g2.L().dirs[d]).join(', ');
      v.msg = g2 => ({ fr: 'CHERCHE DANS LES FILETS', en: 'SEARCH THE NETS', vi: 'TIM TRONG LUOI' })[g2.lang()];
    },
    items: {
      brass: { i: '🔑', n: T('Clé en laiton', 'Brass key', 'Chìa khóa đồng'), d: T('Trouvée dans un flotteur. Elle a la taille d’une serrure de boîte.', 'Found inside a float. It is the size of a box lock.', 'Tìm thấy trong một chiếc phao. Nó cỡ vừa ổ khóa của một chiếc hộp.') },
      pieces: { i: '🧩', n: T('Morceaux de photo', 'Photo pieces', 'Mảnh ảnh'), d: T('Une photo découpée en carrés.', 'A photo cut into squares.', 'Một tấm ảnh bị cắt thành nhiều ô vuông.'), ex: g => g.pz('slide') }
    },
    combos: [],
    docs: {
      log: { s: 'old', t: T('Journal de bord', 'Logbook', 'Nhật ký hải trình'), b: T(
        "12 juin 1958.\n\nLa flotte a quitté le port au coucher du soleil. Belle mer, belle pêche en vue.\n\nMinuit. Le vent tourne. Le bateau de Tư a cassé son mât ; je pars l'aider avec la chaloupe. Mon apprenti dort dans ma cabine : je l'enferme, la mer est trop dangereuse cette nuit.\n\nPetit, si tu lis ces lignes : la clé de la cabine est dans mon coffre. Tu connais la règle de notre équipage — un vrai marin trouve son chemin seul. J'ai semé le code dans la cabine, chaque chiffre sous un symbole : ★ ● ▲ ■ ◆ ♥.\n\n– Mon vieil ami le gardien du phare sait parler en lumière, et ma radio ne répond qu'à ceux qui connaissent son mot.\n– Tu te souviens de l'épreuve des deux bidons ? Les tonneaux t'attendent.\n– Et l'énigme du chat, de l'oiseau et du riz que Tư nous pose à chaque traversée… je l'ai écrite sur la caisse.\n\nLa page suivante est écrite en code. Toi seul sais le lire.\n— Capitaine Lâm",
        "12 June 1958.\n\nThe fleet left port at sunset. Calm sea, a good catch ahead.\n\nMidnight. The wind is turning. Tư's boat has broken its mast; I'm taking the dinghy to help. My apprentice is asleep in my cabin: I'm locking him in, the sea is too dangerous tonight.\n\nLad, if you read this: the cabin key is in my chest. You know our crew's rule — a true sailor finds his own way. I've scattered the code around the cabin, each digit under a symbol: ★ ● ▲ ■ ◆ ♥.\n\n– My old friend the lighthouse keeper can speak in light, and my radio only answers those who know his word.\n– Remember the test of the two cans? The barrels are waiting for you.\n– And the riddle of the cat, the bird and the rice that Tư asks us on every crossing… I wrote it on the crate.\n\nThe next page is written in code. Only you can read it.\n— Captain Lâm",
        'Ngày 12 tháng 6 năm 1958.\n\nĐoàn thuyền rời bến lúc hoàng hôn. Biển êm, hứa hẹn một mẻ lưới đầy.\n\nNửa đêm. Gió đổi chiều. Thuyền của Tư bị gãy cột buồm; tôi chèo xuồng sang giúp. Chú học việc đang ngủ trong khoang của tôi: tôi khóa cửa lại, đêm nay biển quá nguy hiểm.\n\nCháu à, nếu cháu đọc được những dòng này: chìa khóa khoang nằm trong rương của chú. Cháu biết luật của thuyền mình rồi — một thủy thủ thực thụ phải tự tìm đường. Chú đã rải mật mã khắp khoang, mỗi chữ số mang một ký hiệu: ★ ● ▲ ■ ◆ ♥.\n\n– Ông bạn già giữ hải đăng biết nói bằng ánh sáng, còn radio của chú chỉ trả lời người biết từ khóa của ông ấy.\n– Cháu còn nhớ bài thử thách hai chiếc can chứ? Mấy thùng gỗ đang chờ cháu.\n– Còn câu đố con mèo, con chim và bao gạo mà chú Tư hay đố mỗi chuyến đò… chú đã viết lên thùng hàng.\n\nTrang sau được viết bằng mật mã. Chỉ cháu mới đọc được.\n— Thuyền trưởng Lâm') },
      crew: { s: 'old', t: T('Photo de l’équipage', 'Crew photo', 'Ảnh cả thuyền'), b: T(
        "Une photo jaunie : quatre pêcheurs souriants devant un bateau à voile. Au dos :\n« L'équipage du Hòn Lửa, 1957. Lâm, Tư, Hai… et le petit, qui deviendra un grand marin. »\n\nLe bateau s'appelle Hòn Lửa — « la boule de feu », comme le soleil qui se couche dans la mer.",
        "A yellowed photo: four smiling fishermen in front of a sailing boat. On the back:\n'The crew of the Hòn Lửa, 1957. Lâm, Tư, Hai… and the little one, who will become a great sailor.'\n\nThe boat is called Hòn Lửa — 'the ball of fire', like the sun setting into the sea.",
        'Một tấm ảnh ố vàng: bốn ngư dân tươi cười trước một con thuyền buồm. Mặt sau ghi:\n« Thuyền Hòn Lửa, 1957. Lâm, Tư, Hai… và thằng nhóc, sau này sẽ thành một thủy thủ cừ khôi. »\n\nCon thuyền tên là Hòn Lửa — như mặt trời xuống biển tựa hòn lửa.') },
      radio: { s: 'screen', t: T('Message radio', 'Radio message', 'Tin nhắn radio'), b: T(
        "… krrr… ici Lâm… Si tu m'entends, petit, c'est que tu as lu le phare. Bravo.\n\nLe chiffre ▲ est sur ma carte marine, au-dessus de ma couchette. Pars du phare, puis : {dirs}. Là où tu arrives, j'ai dessiné un poisson avec son chiffre.\n\nEt ne touche pas à mes biscuits… krrr…",
        "… krrr… Lâm here… If you can hear me, lad, you've read the lighthouse. Well done.\n\nThe ▲ digit is on my sea chart, above my bunk. Start from the lighthouse, then: {dirs}. Where you end up, I drew a fish with its digit.\n\nAnd keep your hands off my biscuits… krrr…",
        '… rè rè… Lâm đây… Nếu cháu nghe được chú, tức là cháu đã đọc được ngọn hải đăng. Giỏi lắm.\n\nChữ số ▲ nằm trên tấm hải đồ phía trên giường của chú. Xuất phát từ ngọn hải đăng, rồi đi: {dirs}. Đến nơi, cháu sẽ thấy chú vẽ một con cá cùng chữ số của nó.\n\nVà đừng có đụng vào bánh quy của chú… rè rè…') }
    },
    pzs: {
      morse: { type: 'morse', t: T('Le phare', 'The lighthouse', 'Ngọn hải đăng'), ctx: T('Au loin, le phare clignote. Ce n’est pas son rythme habituel… c’est un message du gardien.', 'In the distance, the lighthouse blinks. That is not its usual rhythm… it is a message from the keeper.', 'Xa xa, ngọn hải đăng nhấp nháy. Đó không phải nhịp thường ngày… mà là thông điệp của người gác.'),
        done: T('Le mot du phare : {mword}. Le capitaine parlait d’une radio…', 'The lighthouse’s word: {mword}. The captain mentioned a radio…', 'Từ khóa của hải đăng: {mword}. Thuyền trưởng có nhắc đến một chiếc radio…'), note: T('Mot du phare : {mword}', 'Lighthouse word: {mword}', 'Từ khóa hải đăng: {mword}') },
      radio: { type: 'word', ans: g => [g.mword], t: T('La radio', 'The radio', 'Chiếc radio'), ctx: T('Une vieille radio à lampes. Sur l’écran : « INDICATIF ? » Le capitaine ne répond qu’à ceux qui connaissent le mot du phare.', 'An old valve radio. On the display: “CALL SIGN?” The captain only answers those who know the lighthouse’s word.', 'Một chiếc radio đèn cũ. Trên màn hình: « MÃ GỌI? » Thuyền trưởng chỉ trả lời người biết từ khóa của ngọn hải đăng.'),
        h2: g => g.tr('first', { x: g.mword[0] }), done: T('Grésillements… puis la voix du capitaine !', 'Crackling… then the captain’s voice!', 'Tiếng rè rè… rồi giọng thuyền trưởng vang lên!'), ok: g => { g.set('radio'); g.doc('radio'); } },
      map: { type: 'map', dig: '▲', t: T('La carte marine', 'The sea chart', 'Tấm hải đồ'), ctx: T('Le phare est entouré de rouge. Directions du capitaine : {dirs}.', 'The lighthouse is circled in red. The captain’s directions: {dirs}.', 'Ngọn hải đăng được khoanh đỏ. Chỉ dẫn của thuyền trưởng: {dirs}.'),
        done: T('Un petit poisson dessiné à l’encre, avec un ▲ et un chiffre.', 'A little fish drawn in ink, with a ▲ and a digit.', 'Một con cá nhỏ vẽ bằng mực, kèm dấu ▲ và một chữ số.') },
      cipher: { type: 'cipher', k: g => g.v.k, msg: g => g.v.msg(g), ans: g => ({ fr: ['FILETS', 'FILET'], en: ['NETS', 'NET'], vi: ['LUOI'] })[g.lang()], t: T('La page chiffrée', 'The coded page', 'Trang mật mã'), ctx: g => g.X(T('Sous le texte codé, le capitaine a écrit : « Chaque lettre a avancé dans l’alphabet. De combien ? Compte les poissons gravés sur ma boussole. »', 'Under the coded text, the captain wrote: “Each letter has moved forward in the alphabet. By how much? Count the fish engraved on my compass.”', 'Dưới đoạn mật mã, thuyền trưởng viết: « Mỗi chữ cái đã tiến lên trong bảng chữ cái. Bao nhiêu bước ư? Hãy đếm số con cá khắc trên la bàn của chú. »')) + (g.lvl === 0 ? g.X(T(' (Décalage : {k})', ' (Shift: {k})', ' (Độ dịch: {k})')) : ''),
        h2: g => g.tr('first', { x: g.v.msg(g)[0] }) + ' — ' + g.L().shift + ' : ' + g.v.k, done: T('« Cherche dans les filets. » Les filets de pêche, près de la porte !', '“Search the nets.” The fishing nets, by the door!', '« Tìm trong lưới. » Những tấm lưới đánh cá cạnh cửa!'), note: T('Message décodé : chercher dans les filets.', 'Decoded message: search the nets.', 'Thông điệp đã giải: tìm trong lưới.') },
      slide: { type: 'slide', dig: '★', img: 'ship', t: T('La photo déchirée', 'The torn photo', 'Tấm ảnh bị xé'), ctx: T('Le capitaine a découpé une photo de son bateau. Sur la coque, quelque chose est peint…', 'The captain cut up a photo of his boat. Something is painted on the hull…', 'Thuyền trưởng đã cắt nhỏ tấm ảnh con thuyền của mình. Trên mạn thuyền có vẽ gì đó…'),
        done: T('La photo du Hòn Lửa ! Sur la coque, le capitaine a peint une étoile ★ et un chiffre.', 'The photo of the Hòn Lửa! On the hull, the captain painted a star ★ and a digit.', 'Ảnh thuyền Hòn Lửa! Trên mạn thuyền, thuyền trưởng sơn một ngôi sao ★ và một chữ số.') },
      jugs: { type: 'jugs', dig: '●', t: T('Les tonneaux d’eau douce', 'The fresh-water barrels', 'Thùng nước ngọt'), ctx: T('Craie sur le tonneau : « La ration du matelot se mesure sans graduations. Remplis le seau à la juste quantité, et le ● apparaîtra au fond. »', 'Chalk on the barrel: “A sailor’s ration is measured without markings. Fill the bucket with exactly the right amount, and the ● will appear at the bottom.”', 'Phấn viết trên thùng: « Khẩu phần của thủy thủ được đong không cần vạch chia. Đổ đúng lượng nước vào xô, dấu ● sẽ hiện ra dưới đáy. »'),
        done: T('Le niveau est parfait. Au fond du seau, peint en blanc : ● et un chiffre.', 'The level is perfect. At the bottom of the bucket, painted in white: ● and a digit.', 'Mực nước vừa khít. Dưới đáy xô, sơn màu trắng: ● và một chữ số.') },
      river: { type: 'river', dig: '■', t: T('L’énigme de Tư', 'Tư’s riddle', 'Câu đố của chú Tư'), ctx: T('Sur la caisse, l’écriture de Tư : « Avant la tempête, il faut tout passer sur mon bateau. Montre-moi l’ordre des traversées. »', 'On the crate, in Tư’s handwriting: “Before the storm, everything must go over to my boat. Show me the order of the crossings.”', 'Trên thùng hàng, nét chữ của chú Tư: « Trước khi bão đến, phải chở hết sang thuyền chú. Cho chú xem thứ tự các chuyến đò. »'),
        done: T('Tout est passé sans dégâts. Sous la caisse, gravé au couteau : ■ et un chiffre.', 'Everything made it across unharmed. Under the crate, carved with a knife: ■ and a digit.', 'Mọi thứ đã sang an toàn. Dưới đáy thùng, khắc bằng dao: ■ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [880, 130, 340, 340], n: T('Hublot', 'Porthole', 'Ô cửa tròn'), click: g => g.pz('morse') },
      { v: 'a', r: [255, 655, 330, 120], n: T('Journal de bord', 'Logbook', 'Nhật ký hải trình'), click: g => { if (!g.f.doc_log) return g.doc('log'); g.pz('cipher'); } },
      { v: 'a', r: [645, 660, 180, 100], n: T('Cartes', 'Cards', 'Bộ bài'), click: g => g.say(T('Le jeu de cartes du capitaine, abandonné en pleine partie. Pas le temps de jouer cette nuit.', 'The captain’s deck of cards, left mid-game. No time to play tonight.', 'Bộ bài của thuyền trưởng, bỏ dở giữa ván. Đêm nay không có thời gian chơi đâu.')) },
      { v: 'a', r: [852, 585, 146, 150], n: T('Boussole', 'Compass', 'La bàn'), click: g => { g.note('compass', T('Boussole : {k} poissons gravés.', 'Compass: {k} engraved fish.', 'La bàn: {k} con cá được khắc.')); g.say(T('Une boussole en laiton. Autour de la rose des vents, {k} petits poissons sont gravés.', 'A brass compass. Around the compass rose, {k} little fish are engraved.', 'Một chiếc la bàn bằng đồng. Quanh hoa gió có khắc {k} con cá nhỏ.')); } },
      { v: 'a', r: [400, 60, 140, 220], n: T('Lanterne', 'Lantern', 'Đèn bão'), click: g => g.say(T('La lanterne se balance au rythme de la houle.', 'The lantern swings with the swell.', 'Chiếc đèn bão đung đưa theo nhịp sóng.')) },
      { v: 'a', r: [1160, 535, 320, 250], n: T('Coffre du capitaine', 'Captain’s chest', 'Rương của thuyền trưởng'), fin: true },
      { v: 'b', r: [150, 140, 520, 360], n: T('Carte marine', 'Sea chart', 'Hải đồ'), click: g => g.f.radio ? g.pz('map') : g.say(T('Une carte marine quadrillée. Le phare de l’île est entouré de rouge. Sans instructions, impossible de savoir où regarder.', 'A gridded sea chart. The island lighthouse is circled in red. Without directions, there is no telling where to look.', 'Một tấm hải đồ kẻ ô. Ngọn hải đăng trên đảo được khoanh đỏ. Không có chỉ dẫn thì chẳng biết phải tìm ở đâu.')) },
      { v: 'b', r: [760, 200, 120, 150], n: T('Photo encadrée', 'Framed photo', 'Ảnh đóng khung'), click: g => g.doc('crew', true) },
      { v: 'b', r: [920, 180, 120, 120], n: T('Baromètre', 'Barometer', 'Phong vũ biểu'), click: g => g.say(T('L’aiguille du baromètre chute : la tempête est sur vous.', 'The barometer needle is dropping: the storm is upon you.', 'Kim phong vũ biểu tụt xuống: cơn bão đang ập tới.')) },
      { v: 'b', r: [700, 500, 560, 180], n: T('Couchette', 'Bunk', 'Giường'), click: g => g.say(T('La couchette du capitaine. Sous l’oreiller… rien. Il est plus malin que ça.', 'The captain’s bunk. Under the pillow… nothing. He is smarter than that.', 'Giường của thuyền trưởng. Dưới gối… chẳng có gì. Ông ấy khôn hơn thế.')) },
      { v: 'b', r: [760, 690, 240, 80], n: T('Tiroir', 'Drawer', 'Ngăn kéo'), click: g => g.say(T('Des chemises pliées et une vieille pipe. Rien d’utile.', 'Folded shirts and an old pipe. Nothing useful.', 'Mấy chiếc áo gấp gọn và một cái tẩu cũ. Không có gì hữu ích.')) },
      { v: 'b', r: [1245, 330, 200, 75], n: T('Bateau en bouteille', 'Ship in a bottle', 'Thuyền trong chai'), click: g => g.say(T('Un bateau en bouteille. Sur la voile minuscule : « Lâm & Tư, 1950 ».', 'A ship in a bottle. On the tiny sail: “Lâm & Tư, 1950”.', 'Một con thuyền trong chai. Trên cánh buồm tí hon: « Lâm & Tư, 1950 ».')) },
      { v: 'b', r: [1445, 335, 110, 70], n: T('Boîte en bois', 'Wooden box', 'Hộp gỗ'), click: g => {
        if (g.f.box) return g.say(T('La boîte est vide.', 'The box is empty.', 'Chiếc hộp đã trống.'));
        if (g.has('brass')) { g.set('box'); g.drop('brass'); g.take('pieces'); return g.say(T('La clé en laiton ouvre la boîte : des morceaux de photo, découpés en carrés.', 'The brass key opens the box: pieces of a photo, cut into squares.', 'Chìa khóa đồng mở được hộp: bên trong là những mảnh ảnh cắt vuông.')); }
        g.say(T('Une boîte en bois fermée par une petite serrure en laiton.', 'A wooden box with a small brass lock.', 'Một chiếc hộp gỗ có ổ khóa đồng nhỏ.'));
      } },
      { v: 'c', r: [120, 380, 360, 220], n: T('Radio', 'Radio', 'Radio'), click: g => g.f.radio ? g.doc('radio', true) : g.pz('radio') },
      { v: 'c', r: [100, 640, 380, 220], n: T('Tonneaux', 'Barrels', 'Thùng gỗ'), click: g => g.pz('jugs') },
      { v: 'c', r: [650, 120, 300, 640], n: T('Porte', 'Door', 'Cửa'), click: g => g.say(T('Verrouillée de l’extérieur. La clé est dans le coffre du capitaine.', 'Locked from outside. The key is in the captain’s chest.', 'Bị khóa từ bên ngoài. Chìa khóa nằm trong rương của thuyền trưởng.')) },
      { v: 'c', r: [1000, 120, 560, 400], n: T('Filets de pêche', 'Fishing nets', 'Lưới đánh cá'), click: g => g.say(T('Des filets suspendus, garnis de flotteurs en liège. L’un d’eux a l’air différent des autres…', 'Hanging nets lined with cork floats. One of them looks different from the others…', 'Những tấm lưới treo đầy phao bấc. Có một chiếc phao trông khác hẳn những chiếc còn lại…')) },
      { v: 'c', r: [1318, 298, 74, 74], n: T('Flotteur', 'Float', 'Phao'), hid: true, show: g => !g.f.float, click: g => { g.set('float'); g.take('brass'); g.say(T('Ce flotteur sonne creux… Tu le dévisses : une clé en laiton !', 'This float sounds hollow… You unscrew it: a brass key!', 'Chiếc phao này kêu rỗng… Bạn vặn nó ra: một chiếc chìa khóa đồng!')); } },
      { v: 'c', r: [1050, 560, 400, 260], n: T('Caisses', 'Crates', 'Thùng hàng'), click: g => g.pz('river') }
    ],
    goals: [
      [g => g.f.doc_log, g => true, T('Le journal de bord est ouvert sur la table.', 'The logbook is open on the table.', 'Cuốn nhật ký hải trình đang mở trên bàn.')],
      [g => g.solved('morse'), g => true, T('Le phare clignote un message : regarde par le hublot.', 'The lighthouse is blinking a message: look through the porthole.', 'Hải đăng đang nháy một thông điệp: hãy nhìn qua ô cửa tròn.')],
      [g => g.f.radio, g => g.solved('morse'), T('La radio, près de la porte, attend le mot du phare.', 'The radio by the door is waiting for the lighthouse’s word.', 'Chiếc radio cạnh cửa đang chờ từ khóa của hải đăng.')],
      [g => g.solved('map'), g => g.f.radio, T('Suis les directions de la radio sur la carte marine.', 'Follow the radio’s directions on the sea chart.', 'Đi theo chỉ dẫn từ radio trên tấm hải đồ.')],
      [g => g.solved('cipher'), g => g.f.doc_log, T('La page codée du journal : le décalage est gravé sur la boussole.', 'The coded page of the log: the shift is engraved on the compass.', 'Trang mật mã trong nhật ký: độ dịch được khắc trên la bàn.')],
      [g => g.f.float, g => true, T('Les filets près de la porte : un flotteur sonne creux.', 'The nets by the door: one float sounds hollow.', 'Những tấm lưới cạnh cửa: có một chiếc phao kêu rỗng.')],
      [g => g.f.box, g => g.has('brass'), T('La clé en laiton ouvre la boîte sur l’étagère.', 'The brass key opens the box on the shelf.', 'Chìa khóa đồng mở chiếc hộp trên kệ.')],
      [g => g.solved('slide'), g => g.has('pieces'), T('Examine les morceaux de photo dans ton inventaire.', 'Examine the photo pieces in your inventory.', 'Xem kỹ các mảnh ảnh trong túi đồ.')],
      [g => g.solved('jugs'), g => true, T('Les tonneaux près de la porte : mesure la ration avec les deux bidons.', 'The barrels by the door: measure the ration with the two cans.', 'Mấy thùng gỗ cạnh cửa: đong khẩu phần bằng hai chiếc can.')],
      [g => g.solved('river'), g => true, T('Les caisses près de la porte : l’énigme de la traversée de Tư.', 'The crates by the door: Tư’s crossing riddle.', 'Các thùng hàng cạnh cửa: câu đố chuyến đò của chú Tư.')]
    ]
  };

  // ============================ 3. LE TEMPLE ============================
  const BEASTS = [
    { k: 0, i: '🦅', n: T('L’aigle', 'The eagle', 'Đại bàng'), r: T('celui qui voit le ciel de plus près', 'the one who sees the sky up close', 'kẻ nhìn bầu trời gần nhất') },
    { k: 1, i: '🐍', n: T('Le serpent', 'The snake', 'Con rắn'), r: T('celui qui marche sans pattes', 'the one who walks without legs', 'kẻ bước đi không cần chân') },
    { k: 2, i: '🐒', n: T('Le singe', 'The monkey', 'Con khỉ'), r: T('celui qui rit dans les arbres', 'the one who laughs in the trees', 'kẻ cười đùa trên cây') },
    { k: 3, i: '🐅', n: T('Le tigre', 'The tiger', 'Con hổ'), r: T('celui qui rugit dans l’ombre', 'the one who roars in the shadows', 'kẻ gầm vang trong bóng tối') }
  ];
  const FACE = {
    plain: T('{b} regarde vers {d}.', '{b} faces {d}.', '{b} nhìn về hướng {d}.'),
    poet: T('{b} regarde {d}.', '{b} looks {d}.', '{b} nhìn {d}.'),
    rel: [T('{b} regarde dans la même direction que {a}.', '{b} looks the same way as {a}.', '{b} nhìn cùng hướng với {a}.'),
      T('{b} regarde un quart de tour plus à droite que {a}.', '{b} looks a quarter turn further right than {a}.', '{b} nhìn lệch một góc vuông về bên phải so với {a}.'),
      T('{b} et {a} regardent dans des directions opposées.', '{b} and {a} look in opposite directions.', '{b} và {a} nhìn về hai hướng ngược nhau.'),
      T('{b} regarde un quart de tour plus à gauche que {a}.', '{b} looks a quarter turn further left than {a}.', '{b} nhìn lệch một góc vuông về bên trái so với {a}.')]
  };
  const DIRP = [T('le nord', 'north', 'Bắc'), T("l'est", 'east', 'Đông'), T('le sud', 'south', 'Nam'), T("l'ouest", 'west', 'Tây')];
  const DIRS = [T("vers l'étoile polaire", 'towards the Pole Star', 'về phía sao Bắc Cực'), T('vers le soleil levant', 'towards the rising sun', 'về phía mặt trời mọc'), T('vers le grand fleuve du sud', 'towards the great river of the south', 'về phía dòng sông lớn phương nam'), T('vers le soleil couchant', 'towards the setting sun', 'về phía mặt trời lặn')];
  const temple = {
    id: 'temple', icon: '🐊', amb: ['lowpass', 900, .035], morse: null,
    name: T('Le temple du crocodile', 'The Crocodile Temple', 'Ngôi đền cá sấu'),
    desc: T('Des ruines oubliées au cœur de la jungle.', 'Forgotten ruins deep in the jungle.', 'Tàn tích bị lãng quên giữa rừng sâu.'),
    intro: T("Personne ne sait vraiment où se cache le Temple du Roi Crocodile. En 1932, l'archéologue Élise Marchand y est entrée… et n'a plus jamais donné de nouvelles. Tu as retrouvé son carnet, et sa piste t'a mené(e) ici. À peine entré(e), la porte de pierre s'est refermée derrière toi. Étrange : les torches brûlent encore.",
      "No one really knows where the Temple of the Crocodile King lies hidden. In 1932, the archaeologist Élise Marchand went inside… and was never heard from again. You found her notebook, and her trail led you here. As soon as you stepped in, the stone door slammed shut behind you. Strange: the torches are still burning.",
      'Không ai thực sự biết Ngôi đền Vua Cá Sấu nằm ở đâu. Năm 1932, nhà khảo cổ Élise Marchand đã bước vào đó… và từ đó bặt vô âm tín. Bạn tìm được cuốn sổ tay của bà, và dấu vết ấy dẫn bạn đến đây. Vừa bước vào, cánh cửa đá đã đóng sập sau lưng. Lạ thật: các ngọn đuốc vẫn đang cháy.'),
    outro: T("La porte de pierre gronde et glisse. La lumière du jour t'éblouit. Sur le seuil, gravé à la hâte : « É. M. — sortie le 3 mars 1932. Merci, Roi Crocodile. » Élise Marchand s'en était sortie… et maintenant, toi aussi.",
      "The stone door rumbles and slides open. Daylight dazzles you. On the threshold, carved in a hurry: 'É. M. — got out on 3 March 1932. Thank you, Crocodile King.' Élise Marchand made it out… and now, so have you.",
      'Cánh cửa đá ầm ầm trượt mở. Ánh sáng ban ngày làm bạn chói mắt. Trên ngưỡng cửa có dòng chữ khắc vội: « É. M. — thoát ra ngày 3 tháng 3 năm 1932. Cảm ơn Vua Cá Sấu. » Élise Marchand đã thoát được… và giờ đây, bạn cũng vậy.'),
    views: {
      a: { scene: 'templeA', n: T('La salle de la porte', 'Hall of the door', 'Sảnh cửa đá') },
      b: { scene: 'templeB', n: T('La galerie des bêtes', 'Gallery of beasts', 'Hành lang muông thú'), lock: g => !g.f.gate,
        unlock: g => { if (!g.has('jade')) return false; g.set('gate'); g.drop('jade'); g.say(T('La clé de jade tourne dans la gueule de pierre : la grille s’ouvre en grinçant.', 'The jade key turns in the stone jaws: the gate creaks open.', 'Chìa khóa ngọc xoay trong miệng đá: cánh cổng kẽo kẹt mở ra.')); return true; },
        lockMsg: T('Une grille de jade bloque le passage. Au centre, une serrure en forme de gueule de crocodile.', 'A jade gate blocks the way. In the middle, a lock shaped like crocodile jaws.', 'Một cánh cổng ngọc chắn lối. Ở giữa có ổ khóa hình miệng cá sấu.') },
      c: { scene: 'templeC', n: T('La crypte', 'The crypt', 'Hầm mộ'), lock: g => !g.f.crypt, dark: g => true, light: 'torch',
        lockMsg: T('Un mur de pierre ferme la crypte. Des rigoles sèches courent jusqu’à lui, comme si l’eau devait le faire bouger.', 'A stone wall seals the crypt. Dry channels run up to it, as if water were meant to move it.', 'Một bức tường đá bịt kín hầm mộ. Những rãnh khô chạy đến chân tường, như thể nước sẽ làm nó chuyển động.') }
    },
    order: ['a', 'b', 'c'],
    init(g) {
      const v = g.v; v.glyph = genGlyphs(); v.beasts = BEASTS;
      const tgt = BEASTS.map(() => rand(4)), o = shuffle([0, 1, 2, 3]), plan = [];
      if (g.lvl === 0) o.forEach(b => plan.push({ b, abs: 'plain' }));
      else if (g.lvl === 1) { plan.push({ b: o[0], abs: 'poet' }, { b: o[1], abs: 'poet' }, { b: o[2], a: o[0] }, { b: o[3], a: o[1] }); }
      else { plan.push({ b: o[0], abs: 'poet' }, { b: o[1], a: o[0] }, { b: o[2], a: o[1] }, { b: o[3], a: o[2] }); }
      v.face = { tgt, plan: g.lvl === 2 ? shuffle(plan) : plan };
      const low = s => s.charAt(0).toLowerCase() + s.slice(1);
      v.faceClues = g2 => v.face.plan.map(c => {
        const b = g2.X(BEASTS[c.b].n);
        if (c.abs) return g2.X(c.abs === 'plain' ? FACE.plain : FACE.poet).replace('{b}', b).replace('{d}', g2.X((c.abs === 'plain' ? DIRP : DIRS)[tgt[c.b]]));
        const rel = (tgt[c.b] - tgt[c.a] + 4) % 4;
        return g2.X(FACE.rel[rel]).replace('{b}', b).replace('{a}', low(g2.X(BEASTS[c.a].n)));
      });
    },
    items: {
      torch: { i: '🔥', n: T('Torche', 'Torch', 'Ngọn đuốc'), d: T('Une torche enflammée. Elle éclairera les endroits les plus sombres.', 'A burning torch. It will light up the darkest places.', 'Một ngọn đuốc đang cháy. Nó sẽ soi sáng những nơi tối tăm nhất.') },
      jade: { i: '🟢', n: T('Clé de jade', 'Jade key', 'Chìa khóa ngọc'), d: T('Une clé sculptée en forme de dent de crocodile.', 'A key carved like a crocodile tooth.', 'Một chiếc chìa khóa tạc hình răng cá sấu.') },
      disc: { i: '🌞', n: T('Disque solaire', 'Sun disc', 'Đĩa mặt trời'), d: T('Un disque d’or gravé d’un soleil. « Le soleil réveille celui qui dort. »', 'A gold disc engraved with a sun. “The sun wakes the one who sleeps.”', 'Một chiếc đĩa vàng khắc hình mặt trời. « Mặt trời đánh thức kẻ đang ngủ. »') }
    },
    combos: [],
    docs: {
      legend: { s: 'old', t: T('Carnet d’Élise — la légende', 'Élise’s notebook — the legend', 'Sổ tay của Élise — truyền thuyết'), b: T(
        "Traduction des gravures de l'entrée :\n\n« Le Roi Crocodile garde le temple. Ses yeux ne s'ouvrent qu'à la lumière du soleil : guide-la jusqu'à lui, et sa gueule s'ouvrira.\n\nQuatre bêtes veillent dans la galerie. Elles ne s'éveillent que lorsqu'elles regardent là où la légende le dit.\n\nL'eau ouvre la voie des morts. Le soleil réveille celui qui dort. »\n\nNote d'Élise : la porte demande six chiffres, marqués ★ ● ▲ ■ ◆ ♥. Je les trouverai.",
        "Translation of the carvings at the entrance:\n\n'The Crocodile King guards the temple. His eyes only open to sunlight: guide it to him, and his jaws will open.\n\nFour beasts keep watch in the gallery. They only awaken when they look where the legend says.\n\nWater opens the way of the dead. The sun wakes the one who sleeps.'\n\nÉlise's note: the door asks for six digits, marked ★ ● ▲ ■ ◆ ♥. I will find them.",
        'Bản dịch những hình khắc ở lối vào:\n\n« Vua Cá Sấu canh giữ ngôi đền. Mắt ngài chỉ mở ra trước ánh mặt trời: hãy dẫn ánh sáng đến ngài, miệng ngài sẽ mở ra.\n\nBốn con thú canh giữ hành lang. Chúng chỉ thức giấc khi nhìn đúng hướng mà truyền thuyết đã nói.\n\nNước mở đường xuống cõi chết. Mặt trời đánh thức kẻ đang ngủ. »\n\nGhi chú của Élise: cánh cửa đòi sáu chữ số, mang ký hiệu ★ ● ▲ ■ ◆ ♥. Tôi sẽ tìm ra chúng.') },
      camp: { s: 'old', t: T('Carnet d’Élise — page 2', 'Élise’s notebook — page 2', 'Sổ tay của Élise — trang 2'), b: g => g.X(T(
        "J'ai dû abandonner mon sac ici, la galerie est trop étroite. Mais j'ai enfin traduit la légende des quatre bêtes :",
        "I had to leave my bag here, the gallery is too narrow. But I have finally translated the legend of the four beasts:",
        'Tôi đành bỏ lại túi ở đây, hành lang quá hẹp. Nhưng cuối cùng tôi đã dịch được truyền thuyết về bốn con thú:')) + '\n\n' + g.v.faceClues(g).map(s => '« ' + s + ' »').join('\n') },
      glyphs: { s: 'old', t: T('Table des symboles', 'Symbol key', 'Bảng ký hiệu'), b: g => `<div class="gkey">${Object.entries(g.v.glyph).map(([l, s]) => `<span><b>${s}</b>${l}</span>`).join('')}</div>` },
      last: { s: 'old', t: T('Dernière page d’Élise', 'Élise’s last page', 'Trang cuối của Élise'), b: T(
        "Si quelqu'un lit ceci, il est arrivé jusqu'à la crypte. Bravo.\n\nLe Roi Crocodile n'a jamais existé : c'est le temple lui-même qui teste ses visiteurs. Rien ici n'a été construit pour tuer, seulement pour réfléchir.\n\nJ'ai traduit l'inscription, reconstitué le relief du sarcophage. Je sors demain. Je laisse les torches allumées pour ceux qui viendront après moi.\n\n— É. M., 2 mars 1932",
        "If someone is reading this, they made it to the crypt. Well done.\n\nThe Crocodile King never existed: it is the temple itself that tests its visitors. Nothing here was built to kill, only to make you think.\n\nI translated the inscription and restored the relief on the sarcophagus. I leave tomorrow. I am leaving the torches lit for those who come after me.\n\n— É. M., 2 March 1932",
        'Nếu ai đó đọc được dòng này, nghĩa là họ đã đến được hầm mộ. Giỏi lắm.\n\nVua Cá Sấu chưa từng tồn tại: chính ngôi đền đang thử thách những người đến thăm. Không có gì ở đây được xây để giết người, chỉ để bắt người ta suy nghĩ.\n\nTôi đã dịch bia khắc và ghép lại bức phù điêu trên quan tài đá. Ngày mai tôi sẽ ra ngoài. Tôi để đuốc cháy sẵn cho những người đến sau.\n\n— É. M., ngày 2 tháng 3 năm 1932') }
    },
    pzs: {
      mirror: { type: 'mirror', t: T('Le regard du crocodile', 'The crocodile’s gaze', 'Ánh mắt cá sấu'), ctx: T('Un rai de soleil perce le plafond. Des miroirs de bronze, couverts de poussière, peuvent pivoter sur leur socle.', 'A ray of sunlight pierces the ceiling. Dusty bronze mirrors can turn on their bases.', 'Một tia nắng xuyên qua trần. Những tấm gương đồng phủ bụi có thể xoay trên bệ.'),
        done: T('Le rayon frappe l’œil du crocodile ! La mâchoire de pierre s’ouvre dans un grondement : une clé de jade.', 'The beam strikes the crocodile’s eye! The stone jaw grinds open: a jade key.', 'Tia nắng chiếu trúng mắt cá sấu! Hàm đá ầm ầm mở ra: một chiếc chìa khóa ngọc.'), ok: g => { g.set('croc'); g.take('jade'); } },
      rebus: { type: 'rebus', idx: 1, dig: '■', t: T('La stèle', 'The stone tablet', 'Tấm bia đá'), ctx: T('Des images taillées dans la pierre, et un ■ gravé en dessous. Élise a écrit à côté : « Lis-les à voix haute. »', 'Pictures carved into the stone, with a ■ engraved below. Élise wrote beside them: “Read them aloud.”', 'Những hình ảnh tạc vào đá, bên dưới khắc dấu ■. Élise ghi bên cạnh: « Hãy đọc to lên. »'),
        done: T('La stèle pivote : derrière, un ■ et un chiffre.', 'The tablet swivels: behind it, a ■ and a digit.', 'Tấm bia xoay ra: phía sau là dấu ■ và một chữ số.') },
      weights: { type: 'weights', dig: '●', t: T('La balance de l’autel', 'The altar scale', 'Chiếc cân trên bệ thờ'), ctx: T('« Le dieu n’accepte que l’offrande juste », dit l’inscription. Une idole repose sur un plateau, des pierres numérotées attendent à côté.', '“The god accepts only the right offering,” says the inscription. An idol rests on one pan; numbered stones wait beside it.', '« Thần chỉ nhận lễ vật vừa đủ », dòng chữ khắc viết. Một bức tượng nằm trên đĩa cân, bên cạnh là những hòn đá đánh số.'),
        done: T('La balance s’équilibre parfaitement. Sous l’idole, gravé : ● et un chiffre.', 'The scale balances perfectly. Under the idol, carved: ● and a digit.', 'Chiếc cân thăng bằng hoàn hảo. Dưới tượng thần có khắc: ● và một chữ số.') },
      statues: { type: 'facing', t: T('Les quatre bêtes', 'The four beasts', 'Bốn con thú'), ctx: T('Quatre statues pivotent lourdement sur leurs socles.', 'Four statues turn heavily on their plinths.', 'Bốn bức tượng nặng nề xoay trên bệ.'),
        done: T('Les yeux des statues s’allument l’un après l’autre. Au-dessus, une niche s’ouvre : un disque d’or brille à l’intérieur.', 'The statues’ eyes light up one after another. Above them, a niche opens: a gold disc gleams inside.', 'Mắt các bức tượng lần lượt sáng lên. Phía trên, một hốc tường mở ra: bên trong lấp lánh một chiếc đĩa vàng.'), ok: g => g.set('niche') },
      pipes: { type: 'pipes', t: T('Les canaux du bassin', 'The basin channels', 'Kênh dẫn nước'), ctx: T('Un bassin de pierre et des canaux pivotants. « L’eau ouvre la voie des morts. »', 'A stone basin and swivelling channels. “Water opens the way of the dead.”', 'Một bể đá và những kênh dẫn có thể xoay. « Nước mở đường xuống cõi chết. »'),
        done: T('L’eau s’engouffre dans les canaux… Un grondement sourd : quelque part, un mur de pierre s’est ouvert vers la crypte.', 'Water rushes into the channels… A deep rumble: somewhere, a stone wall has opened onto the crypt.', 'Nước ào vào các kênh… Một tiếng ầm vang: đâu đó, bức tường đá dẫn xuống hầm mộ đã mở ra.'), ok: g => g.set('crypt') },
      glyph: { type: 'glyph', dig: '▲', t: T('L’inscription', 'The inscription', 'Bia khắc'), ctx: T('Une inscription en symboles inconnus, surmontée d’un ▲.', 'An inscription in unknown symbols, topped with a ▲.', 'Một dòng khắc bằng ký hiệu lạ, phía trên có dấu ▲.'),
        done: T('Les symboles s’illuminent : le chiffre ▲ est {d▲}.', 'The symbols glow: the ▲ digit is {d▲}.', 'Các ký hiệu bừng sáng: chữ số ▲ là {d▲}.') },
      relief: { type: 'rotimg', dig: '★', img: 'temple', t: T('Le relief du sarcophage', 'The sarcophagus relief', 'Phù điêu trên quan tài'), ctx: T('Le disque solaire réveille le mécanisme : les pierres du couvercle tournent sur elles-mêmes.', 'The sun disc wakes the mechanism: the stones of the lid spin on themselves.', 'Đĩa mặt trời đánh thức cơ quan: các phiến đá trên nắp tự xoay tròn.'),
        done: T('Le relief du Roi Crocodile se reforme et le couvercle glisse : à l’intérieur, une étoile ★ et un chiffre gravés.', 'The relief of the Crocodile King comes together and the lid slides away: inside, a star ★ and a digit are carved.', 'Hình phù điêu Vua Cá Sấu hiện ra trọn vẹn và nắp quan tài trượt mở: bên trong khắc một ngôi sao ★ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [140, 240, 270, 230], n: T('Gravures', 'Carvings', 'Hình khắc'), click: g => g.doc('legend', true) },
      { v: 'a', r: [1185, 295, 250, 260], n: T('Crocodile de pierre', 'Stone crocodile', 'Cá sấu đá'), click: g => g.solved('mirror') ? g.say(T('La gueule du crocodile est grande ouverte. Ses yeux brillent encore.', 'The crocodile’s jaws are wide open. Its eyes are still glowing.', 'Miệng cá sấu đã há rộng. Đôi mắt nó vẫn còn sáng.')) : g.pz('mirror') },
      { v: 'a', r: [180, 580, 230, 240], n: T('Stèle', 'Stone tablet', 'Bia đá'), click: g => g.pz('rebus') },
      { v: 'a', r: [1120, 595, 355, 225], n: T('Autel', 'Altar', 'Bệ thờ'), click: g => g.pz('weights') },
      { v: 'a', r: [484, 280, 72, 190], n: T('Torche', 'Torch', 'Ngọn đuốc'), show: g => !g.f.torch, click: g => { g.set('torch'); g.take('torch'); g.say(T('Tu décroches la torche du mur. Elle brûle bien.', 'You take the torch off the wall. It burns brightly.', 'Bạn gỡ ngọn đuốc khỏi tường. Nó cháy rất sáng.')); } },
      { v: 'a', r: [625, 200, 350, 560], n: T('Porte de pierre', 'Stone door', 'Cửa đá'), fin: true },
      ...[130, 430, 930, 1230].map((x, i) => ({ v: 'b', r: [x, 250, 240, 410], n: BEASTS[i].n, click: g => g.solved('statues') ? g.say(T('Les yeux de la statue brillent doucement.', 'The statue’s eyes glow softly.', 'Mắt bức tượng sáng lấp lánh.')) : g.pz('statues') })),
      { v: 'b', r: [720, 110, 160, 140], n: T('Niche', 'Niche', 'Hốc tường'), show: g => g.f.niche && !g.has('disc') && !g.f.disc, click: g => { g.take('disc'); g.say(T('Tu prends le disque solaire. Il est lourd et tiède.', 'You take the sun disc. It is heavy and warm.', 'Bạn lấy chiếc đĩa mặt trời. Nó nặng và âm ấm.')); } },
      { v: 'b', r: [500, 660, 600, 200], n: T('Bassin', 'Basin', 'Bể nước'), click: g => g.solved('pipes') ? g.say(T('L’eau coule maintenant vers la crypte.', 'Water now flows towards the crypt.', 'Giờ nước đang chảy về phía hầm mộ.')) : g.pz('pipes') },
      { v: 'b', r: [40, 720, 230, 140], n: T('Vieux sac', 'Old bag', 'Chiếc túi cũ'), hid: true, click: g => { g.doc('camp'); g.say(T('Un sac de toile moisi, aux initiales « É. M. ». Dedans, une page de carnet.', 'A mouldy canvas bag with the initials “É. M.”. Inside, a notebook page.', 'Một chiếc túi vải mốc meo, thêu chữ « É. M. ». Bên trong có một trang sổ tay.')); } },
      { v: 'c', r: [80, 150, 400, 420], n: T('Mur des symboles', 'Wall of symbols', 'Bức tường ký hiệu'), click: g => { g.set('glyphkey'); g.doc('glyphs', true); } },
      { v: 'c', r: [1140, 150, 400, 300], n: T('Inscription', 'Inscription', 'Bia khắc'), click: g => g.pz('glyph') },
      { v: 'c', r: [520, 470, 560, 300], n: T('Sarcophage', 'Sarcophagus', 'Quan tài đá'), click: g => {
        if (g.solved('relief')) return g.say(T('Le sarcophage est ouvert. Il est vide, à part la gravure.', 'The sarcophagus is open. It is empty, apart from the carving.', 'Quan tài đá đã mở. Trống rỗng, chỉ có hình khắc.'));
        if (g.f.disc) return g.pz('relief');
        if (g.has('disc')) { g.set('disc'); g.drop('disc'); g.say(T('Tu poses le disque dans le creux du couvercle. Un déclic… les pierres se mettent à tourner !', 'You set the disc in the hollow of the lid. A click… the stones begin to turn!', 'Bạn đặt chiếc đĩa vào hốc trên nắp. Tách… các phiến đá bắt đầu xoay!')); return g.pz('relief'); }
        g.say(T('Un sarcophage scellé. Au centre du couvercle, un creux rond, de la taille d’une grande pièce d’or.', 'A sealed sarcophagus. In the middle of the lid, a round hollow the size of a large gold coin.', 'Một chiếc quan tài đá niêm kín. Giữa nắp có một hốc tròn, cỡ một đồng tiền vàng lớn.'));
      } },
      { v: 'c', r: [1220, 560, 300, 240], n: T('Jarres', 'Jars', 'Chum gốm'), hid: true, click: g => { g.doc('last'); g.say(T('Dans la plus petite jarre, des feuillets roulés : la dernière page d’Élise !', 'In the smallest jar, rolled-up sheets: Élise’s last page!', 'Trong chiếc chum nhỏ nhất có mấy tờ giấy cuộn: trang cuối của Élise!')); } }
    ],
    goals: [
      [g => g.f.doc_legend, g => true, T('Les gravures près de l’entrée racontent la légende du temple.', 'The carvings by the entrance tell the temple’s legend.', 'Những hình khắc gần lối vào kể lại truyền thuyết ngôi đền.')],
      [g => g.solved('mirror'), g => true, T('Guide le rayon de soleil jusqu’aux yeux du crocodile avec les miroirs.', 'Guide the sunbeam to the crocodile’s eyes with the mirrors.', 'Dùng các tấm gương dẫn tia nắng đến mắt cá sấu.')],
      [g => g.f.gate, g => g.has('jade'), T('La clé de jade ouvre la grille : va vers la galerie (flèche).', 'The jade key opens the gate: head to the gallery (arrow).', 'Chìa khóa ngọc mở được cổng: hãy sang hành lang (mũi tên).')],
      [g => g.solved('rebus'), g => true, T('La stèle porte un rébus : lis les images à voix haute.', 'The tablet bears a picture riddle: read the pictures aloud.', 'Tấm bia có câu đố hình: hãy đọc to các hình lên.')],
      [g => g.solved('weights'), g => true, T('L’autel : équilibre la balance avec les bonnes pierres.', 'The altar: balance the scale with the right stones.', 'Bệ thờ: cân bằng chiếc cân bằng những hòn đá đúng.')],
      [g => g.f.doc_camp, g => g.f.gate, T('Dans la galerie, fouille l’ombre du coin en bas à gauche.', 'In the gallery, search the shadows in the bottom-left corner.', 'Trong hành lang, hãy lục tìm chỗ tối ở góc dưới bên trái.')],
      [g => g.solved('statues'), g => g.f.doc_camp, T('Tourne les statues comme le dit la légende d’Élise.', 'Turn the statues the way Élise’s legend says.', 'Xoay các bức tượng theo đúng truyền thuyết của Élise.')],
      [g => g.has('disc') || g.f.disc, g => g.f.niche, T('Prends le disque dans la niche au-dessus des statues.', 'Take the disc from the niche above the statues.', 'Lấy chiếc đĩa trong hốc tường phía trên các tượng.')],
      [g => g.solved('pipes'), g => g.f.gate, T('Relie les canaux du bassin pour ouvrir la crypte.', 'Connect the basin channels to open the crypt.', 'Nối các kênh của bể nước để mở hầm mộ.')],
      [g => g.has('torch'), g => g.f.crypt, T('La crypte est plongée dans le noir. Une torche, peut-être, dans la première salle ?', 'The crypt is pitch dark. Perhaps a torch from the first hall?', 'Hầm mộ tối om. Có lẽ cần một ngọn đuốc ở sảnh đầu tiên?')],
      [g => g.f.glyphkey, g => g.f.crypt && g.has('torch'), T('Dans la crypte, le mur de gauche donne la table des symboles.', 'In the crypt, the left wall gives the symbol key.', 'Trong hầm mộ, bức tường bên trái là bảng đối chiếu ký hiệu.')],
      [g => g.solved('glyph'), g => g.f.glyphkey, T('Traduis l’inscription de droite avec la table des symboles.', 'Translate the inscription on the right with the symbol key.', 'Dịch bia khắc bên phải bằng bảng ký hiệu.')],
      [g => g.solved('relief'), g => g.f.crypt && (g.has('disc') || g.f.disc), T('Le disque solaire va dans le creux du sarcophage.', 'The sun disc goes into the hollow of the sarcophagus.', 'Đĩa mặt trời đặt vào hốc trên quan tài đá.')]
    ]
  };

  // ============================ 4. LA STATION ============================
  const station = {
    id: 'station', icon: '🛰️', amb: ['lowpass', 190, .14], morse: null,
    name: T('Station Aurore', 'Aurora Station', 'Trạm Bình Minh'),
    desc: T("En orbite, l'alarme vient de se déclencher.", 'In orbit — the alarm has just gone off.', 'Trên quỹ đạo, chuông báo động vừa vang lên.'),
    intro: T("An 2091. Station de recherche Aurore, en orbite à 400 km de la Terre. Une alarme te tire du sommeil cryogénique. Les couloirs sont vides : l'équipage a évacué sans toi. L'ordinateur de bord, HÉLIOS, ne répond plus correctement et l'oxygène baisse. Ta seule chance : la capsule de secours, derrière le sas verrouillé.",
      'Year 2091. Aurora research station, in orbit 400 km above Earth. An alarm drags you out of cryo-sleep. The corridors are empty: the crew evacuated without you. The onboard computer, HELIOS, is malfunctioning and the oxygen is dropping. Your only chance: the escape pod, behind the sealed airlock.',
      'Năm 2091. Trạm nghiên cứu Bình Minh, bay trên quỹ đạo cách Trái Đất 400 km. Tiếng báo động kéo bạn ra khỏi giấc ngủ đông. Hành lang vắng tanh: cả phi hành đoàn đã sơ tán mà không có bạn. Máy tính HELIOS hoạt động sai lệch và ô-xy đang giảm dần. Cơ hội duy nhất: tàu thoát hiểm phía sau cửa khoang đã khóa.'),
    outro: T("Le sas siffle et s'ouvre. Tu te glisses dans la capsule, et la station s'éloigne doucement. Dans la radio, une voix : « Ici la commandante Sato. On t'a cru perdu(e)… Bienvenue à bord. » Sous toi, la Terre s'illumine au lever du soleil.",
      "The airlock hisses open. You slip into the pod, and the station slowly drifts away. On the radio, a voice: 'This is Commander Sato. We thought we'd lost you… Welcome aboard.' Below you, Earth lights up at sunrise.",
      'Cửa khoang rít lên rồi mở ra. Bạn chui vào tàu thoát hiểm, trạm vũ trụ từ từ lùi xa. Trong radio vang lên một giọng nói: « Chỉ huy Sato đây. Chúng tôi tưởng đã mất bạn rồi… Chào mừng bạn trở lại. » Bên dưới, Trái Đất bừng sáng trong ánh bình minh.'),
    views: {
      a: { scene: 'stationA', n: T('Le poste de contrôle', 'Control room', 'Phòng điều khiển') },
      b: { scene: 'stationB', n: T('La salle des machines', 'Engine room', 'Phòng máy'), dark: g => !g.f.lights, light: 'flash' },
      c: { scene: 'stationC', n: T('Les quartiers', 'Crew quarters', 'Khu nghỉ ngơi') }
    },
    order: ['a', 'b', 'c'],
    init(g) { g.v.word = g2 => g.v.words[g2.lang()][g2.lvl]; g.v.words = { fr: ['LUNE', 'COMETE', 'ECLIPSE'], en: ['MOON', 'COMET', 'ECLIPSE'], vi: ['TRANG', 'VUTRU', 'THIENHA'] }; },
    items: {
      flash: { i: '🔦', n: T('Lampe torche', 'Flashlight', 'Đèn pin'), d: T('Une lampe torche de secours, encore chargée.', 'An emergency flashlight, still charged.', 'Một chiếc đèn pin khẩn cấp, vẫn còn pin.') },
      card: { i: '💳', n: T('Badge d’accès', 'Access card', 'Thẻ ra vào'), d: T('Le badge de la commandante Sato. Niveau d’accès : 5.', 'Commander Sato’s badge. Clearance level: 5.', 'Thẻ của chỉ huy Sato. Cấp truy cập: 5.') }
    },
    combos: [],
    docs: {
      ai: { s: 'screen', t: T('Journal d’HÉLIOS', 'HELIOS log', 'Nhật ký HELIOS'), b: T(
        "[04:12] Collision avec un débris. Fuite d'oxygène, secteur 3.\n[04:15] Évacuation ordonnée par la commandante Sato.\n[04:16] ERREUR : capsule cryo n° 6 bloquée. Ingénieur(e) non réveillé(e).\n[04:20] Protocole 7 : code du sas fragmenté en six parties ★ ● ▲ ■ ◆ ♥, dispersées dans la station.\n[04:31] Disjoncteurs principaux coupés. Salle des machines dans le noir. Réarmement : code binaire.\n[04:32] Boîtier de jonction du sas verrouillé par combinaison.\n[05:00] Mot de passe du casier de la commandante enregistré dans un fichier… corrompu. Les lettres sont toutes là, mais dans le désordre.",
        "[04:12] Debris collision. Oxygen leak, sector 3.\n[04:15] Evacuation ordered by Commander Sato.\n[04:16] ERROR: cryo pod #6 jammed. Engineer not awakened.\n[04:20] Protocol 7: airlock code split into six parts ★ ● ▲ ■ ◆ ♥, scattered around the station.\n[04:31] Main breakers tripped. Engine room in darkness. Reset: binary code.\n[04:32] Airlock junction box locked by combination.\n[05:00] Password for the commander’s locker saved in a file… corrupted. The letters are all there, but scrambled.",
        '[04:12] Va chạm với mảnh vỡ. Rò rỉ ô-xy, khu vực 3.\n[04:15] Chỉ huy Sato ra lệnh sơ tán.\n[04:16] LỖI: khoang ngủ đông số 6 bị kẹt. Kỹ sư chưa được đánh thức.\n[04:20] Giao thức 7: mật mã cửa khoang chia thành sáu phần ★ ● ▲ ■ ◆ ♥, rải khắp trạm.\n[04:31] Cầu dao chính bị ngắt. Phòng máy chìm trong bóng tối. Khởi động lại: mã nhị phân.\n[04:32] Hộp nối của cửa khoang bị khóa bằng tổ hợp.\n[05:00] Mật khẩu tủ của chỉ huy được lưu trong một tệp… bị hỏng. Các chữ cái vẫn còn đủ, nhưng bị xáo trộn.') },
      crew: { s: 'paper', t: T('Mur de photos', 'Photo wall', 'Bức tường ảnh'), b: T(
        "Équipage de la station Aurore :\n\n• Sato — commandante. Garde toujours son badge sous clé.\n• Okafor — médecin.\n• Lindqvist — biologiste. Ses échantillons sont rangés par un petit drone.\n• Ruiz — pilote. Imbattable au jeu de mémoire.\n• Nguyễn — informaticienne. A appris à HÉLIOS les images à colorier.\n• Toi — ingénieur(e). Dernier arrivé, premier endormi.",
        "Crew of Aurora station:\n\n• Sato — commander. Always keeps her badge under lock and key.\n• Okafor — doctor.\n• Lindqvist — biologist. Her samples are stored by a little drone.\n• Ruiz — pilot. Unbeatable at the memory game.\n• Nguyễn — computer scientist. Taught HELIOS picture puzzles.\n• You — engineer. Last to arrive, first to fall asleep.",
        'Phi hành đoàn trạm Bình Minh:\n\n• Sato — chỉ huy. Luôn cất thẻ trong tủ khóa.\n• Okafor — bác sĩ.\n• Lindqvist — nhà sinh học. Mẫu vật được một chiếc máy bay nhỏ sắp xếp.\n• Ruiz — phi công. Vô địch trò chơi trí nhớ.\n• Nguyễn — kỹ sư tin học. Đã dạy HELIOS trò tô hình.\n• Bạn — kỹ sư. Đến sau cùng, ngủ trước tiên.') },
      cmdr: { s: 'screen', t: T('Message de la commandante', 'Message from the commander', 'Lời nhắn của chỉ huy'), b: T(
        "Si tu lis ceci, tu as survécu. Pardon de t'avoir laissé(e) : ta capsule cryo ne voulait pas s'ouvrir et l'oxygène fuyait.\n\nMon badge est dans ce casier, prends-le : il ouvre l'armoire de Lindqvist. Son drone y range une fiole marquée ★.\n\nLe jeu de Ruiz, sur la tablette près des couchettes, cache le ●. Et HÉLIOS dessine le ■ sur son hologramme quand il a assez de courant.\n\nCourage. On t'attend dehors.\n— Sato",
        "If you are reading this, you survived. Sorry we left you behind: your cryo pod wouldn't open and oxygen was leaking.\n\nMy badge is in this locker, take it: it opens Lindqvist's cabinet. Her drone keeps a vial marked ★ in there.\n\nRuiz's game, on the tablet by the bunks, hides the ●. And HELIOS draws the ■ on its hologram when it has enough power.\n\nHang in there. We are waiting for you outside.\n— Sato",
        'Nếu bạn đọc được dòng này, bạn đã sống sót. Xin lỗi vì đã bỏ bạn lại: khoang ngủ đông của bạn không chịu mở mà ô-xy thì đang rò rỉ.\n\nThẻ của tôi ở trong tủ này, cầm lấy đi: nó mở được tủ của Lindqvist. Máy bay nhỏ của cô ấy cất một lọ mẫu đánh dấu ★ trong đó.\n\nTrò chơi của Ruiz trên máy tính bảng cạnh giường giấu dấu ●. Còn HELIOS sẽ vẽ dấu ■ trên ảnh ba chiều khi có đủ điện.\n\nCố lên. Chúng tôi đang đợi bạn bên ngoài.\n— Sato') },
      tools: { s: 'note', t: T('Post-it de Nguyễn', 'Nguyễn’s sticky note', 'Giấy nhớ của Nguyễn'), b: T(
        "Pense-bête :\n– Disjoncteurs : chaque interrupteur vaut le double du suivant (1, 2, 4, 8…). On additionne !\n– Boîtier de jonction : il dit combien de symboles sont bien placés. Commencer par des essais avec un seul symbole répété.\n– HÉLIOS ne parle à personne tant que l'antenne n'est pas calibrée.",
        "Reminder:\n– Breakers: each switch is worth double the next (1, 2, 4, 8…). Add them up!\n– Junction box: it tells you how many symbols are in the right place. Start with tries using a single repeated symbol.\n– HELIOS won't talk to anyone until the antenna is calibrated.",
        'Ghi nhớ:\n– Cầu dao: mỗi công tắc có giá trị gấp đôi công tắc kế tiếp (1, 2, 4, 8…). Cộng lại!\n– Hộp nối: nó cho biết có bao nhiêu ký hiệu đúng chỗ. Bắt đầu bằng những lần thử chỉ lặp một ký hiệu.\n– HELIOS sẽ không nói chuyện với ai cho đến khi ăng-ten được hiệu chỉnh.') }
    },
    pzs: {
      wave: { type: 'wave', t: T('L’antenne', 'The antenna', 'Ăng-ten'), ctx: T('L’antenne capte un signal faible : celui d’HÉLIOS. Il faut caler ton émetteur exactement sur lui pour rétablir la liaison.', 'The antenna picks up a weak signal: HELIOS. Your transmitter must match it exactly to restore the link.', 'Ăng-ten bắt được một tín hiệu yếu: đó là HELIOS. Phải chỉnh máy phát của bạn trùng khít với nó để khôi phục liên lạc.'),
        done: T('Liaison rétablie ! HÉLIOS envoie son journal au terminal.', 'Link restored! HELIOS sends its log to the terminal.', 'Đã khôi phục liên lạc! HELIOS gửi nhật ký đến máy tính.'), ok: g => { g.set('signal'); g.doc('ai'); } },
      anagram: { type: 'anagram', word: g => g.v.words[g.lang()][g.lvl], t: T('Le fichier corrompu', 'The corrupted file', 'Tệp bị hỏng'), ctx: T('« Mot de passe du casier de la commandante » — les lettres ont été mélangées par la collision.', '“Commander’s locker password” — the collision scrambled the letters.', '« Mật khẩu tủ của chỉ huy » — vụ va chạm đã làm xáo trộn các chữ cái.'),
        done: T('Mot de passe reconstitué : {word}.', 'Password restored: {word}.', 'Đã khôi phục mật khẩu: {word}.'), note: T('Mot de passe du casier : {word}', 'Locker password: {word}', 'Mật khẩu tủ: {word}') },
      nonogram: { type: 'nonogram', dig: '■', t: T('L’hologramme', 'The hologram', 'Ảnh ba chiều'), ctx: T('HÉLIOS projette une grille vide : « Dessine ce que je cache. »', 'HELIOS projects an empty grid: “Draw what I am hiding.”', 'HELIOS chiếu ra một lưới trống: « Hãy vẽ thứ tôi đang giấu. »'),
        done: T('L’image apparaît : c’est le chiffre ■ !', 'The picture appears: it is the ■ digit!', 'Hình hiện ra: đó chính là chữ số ■!') },
      binary: { type: 'binary', t: T('Les disjoncteurs', 'The breakers', 'Cầu dao'), ctx: T('Le panneau des disjoncteurs principaux attend son code de réarmement.', 'The main breaker panel is waiting for its reset code.', 'Bảng cầu dao chính đang chờ mã khởi động lại.'),
        done: T('Les néons se rallument un à un. L’hologramme du poste de contrôle reprend vie.', 'The lights come back on one by one. The hologram in the control room flickers back to life.', 'Đèn lần lượt sáng trở lại. Ảnh ba chiều ở phòng điều khiển hoạt động lại.'), ok: g => g.set('lights') },
      master: { type: 'master', t: T('Le boîtier de jonction', 'The junction box', 'Hộp nối'), ctx: T('Le circuit du sas est coupé. Le boîtier ne se rouvrira qu’avec sa combinaison de couleurs.', 'The airlock circuit is cut. The box will only reopen with its colour combination.', 'Mạch điện cửa khoang bị ngắt. Hộp nối chỉ mở lại khi nhập đúng tổ hợp màu.'),
        done: T('Le courant passe ! Au loin, le sas émet un long bip.', 'Power is flowing! In the distance, the airlock lets out a long beep.', 'Có điện rồi! Đằng xa, cửa khoang kêu một tiếng bíp dài.'), ok: g => g.set('power') },
      pattern: { type: 'pattern', pt: 2, dig: '▲', t: T('Le tableau blanc', 'The whiteboard', 'Bảng trắng'), ctx: T('Les calculs de Nguyễn. En bas, entouré : « ▲ = la réponse ».', 'Nguyễn’s calculations. At the bottom, circled: “▲ = the answer”.', 'Các phép tính của Nguyễn. Dưới cùng, khoanh tròn: « ▲ = đáp án ».'),
        done: T('Sous l’effaceur, une note : ▲ et un chiffre.', 'Under the eraser, a note: ▲ and a digit.', 'Dưới cái lau bảng có ghi: ▲ và một chữ số.') },
      memory: { type: 'memory', dig: '●', t: T('Le jeu de Ruiz', 'Ruiz’s game', 'Trò chơi của Ruiz'), ctx: T('« Retrouve toutes les paires et je te donne un chiffre. » — Ruiz', '“Find all the pairs and I will give you a digit.” — Ruiz', '« Tìm hết các cặp, tôi sẽ cho bạn một chữ số. » — Ruiz'),
        done: T('« BRAVO ! » En récompense : ● et un chiffre.', '“WELL DONE!” As a reward: ● and a digit.', '« GIỎI LẮM! » Phần thưởng: ● và một chữ số.') },
      locker: { type: 'word', ans: g => [g.v.words[g.lang()][g.lvl]], t: T('Le casier de la commandante', 'The commander’s locker', 'Tủ của chỉ huy'), ctx: T('CASIER SATO — SAISIR LE MOT DE PASSE', 'SATO LOCKER — ENTER PASSWORD', 'TỦ SATO — NHẬP MẬT KHẨU'),
        h2: g => g.tr('first', { x: g.v.words[g.lang()][g.lvl][0] }), done: T('Le casier s’ouvre : un badge d’accès et un message enregistré.', 'The locker opens: an access card and a recorded message.', 'Tủ mở ra: một thẻ ra vào và một tin nhắn đã ghi.'), ok: g => { g.take('card'); g.doc('cmdr'); } },
      maze: { type: 'maze', dig: '★', t: T('Le drone de Lindqvist', 'Lindqvist’s drone', 'Máy bay của Lindqvist'), ctx: T('L’armoire est un labyrinthe de rayonnages. Un petit drone attend tes ordres pour aller chercher la fiole ★.', 'The cabinet is a maze of racks. A little drone is waiting for your orders to fetch the ★ vial.', 'Tủ là một mê cung giá kệ. Một chiếc máy bay nhỏ đang chờ lệnh của bạn để lấy lọ mẫu ★.'),
        done: T('Le drone rapporte la fiole. Étiquette : ★ et un chiffre.', 'The drone brings back the vial. Label: ★ and a digit.', 'Máy bay mang lọ mẫu về. Nhãn ghi: ★ và một chữ số.') }
    },
    hs: [
      { v: 'a', r: [905, 160, 110, 110], n: T('Antenne', 'Antenna', 'Ăng-ten'), click: g => g.solved('wave') ? g.say(T('Liaison stable avec HÉLIOS.', 'Stable link with HELIOS.', 'Liên lạc với HELIOS ổn định.')) : g.pz('wave') },
      { v: 'a', r: [285, 540, 240, 168], n: T('Terminal', 'Terminal', 'Máy tính'), click: g => {
        if (!g.f.signal) return g.say(T('« HÉLIOS : HORS LIGNE. » Il faut d’abord calibrer l’antenne.', '“HELIOS: OFFLINE.” The antenna must be calibrated first.', '« HELIOS: NGOẠI TUYẾN. » Phải hiệu chỉnh ăng-ten trước.'));
        g.solved('anagram') ? g.doc('ai', true) : g.pz('anagram');
      } },
      { v: 'a', r: [535, 350, 160, 215], n: T('Hologramme', 'Hologram', 'Ảnh ba chiều'), click: g => g.f.lights ? g.pz('nonogram') : g.say(T('Le projecteur holographique n’a plus assez d’énergie.', 'The hologram projector does not have enough power.', 'Máy chiếu ảnh ba chiều không đủ năng lượng.')) },
      { v: 'a', r: [300, 110, 560, 340], n: T('Baie vitrée', 'Viewport', 'Cửa kính'), click: g => g.say(T('La Terre, immense et bleue. Quelque part en bas, l’équipage attend de tes nouvelles.', 'Earth, huge and blue. Somewhere down there, the crew is waiting to hear from you.', 'Trái Đất xanh thẳm, mênh mông. Đâu đó dưới kia, phi hành đoàn đang chờ tin bạn.')) },
      { v: 'a', r: [705, 563, 160, 164], n: T('Clavier du sas', 'Airlock keypad', 'Bàn phím cửa khoang'), fin: true },
      { v: 'a', r: [1095, 155, 330, 630], n: T('Sas', 'Airlock', 'Cửa khoang'), fin: true },
      { v: 'b', r: [140, 200, 260, 360], n: T('Disjoncteurs', 'Breakers', 'Cầu dao'), click: g => g.solved('binary') ? g.say(T('Tous les disjoncteurs sont enclenchés.', 'All breakers are on.', 'Tất cả cầu dao đã bật.')) : g.pz('binary') },
      { v: 'b', r: [480, 200, 360, 300], n: T('Boîte de jonction', 'Junction box', 'Hộp nối'), click: g => g.solved('master') ? g.say(T('Le circuit du sas est rétabli.', 'The airlock circuit is restored.', 'Mạch điện cửa khoang đã được nối lại.')) : g.pz('master') },
      { v: 'b', r: [900, 150, 500, 300], n: T('Tableau blanc', 'Whiteboard', 'Bảng trắng'), click: g => g.pz('pattern') },
      { v: 'b', r: [1150, 480, 250, 330], n: T('Armoire à échantillons', 'Sample cabinet', 'Tủ mẫu vật'), click: g => {
        if (g.f.fridge) return g.pz('maze');
        if (g.has('card')) { g.set('fridge'); g.say(T('Bip vert ! L’armoire s’ouvre dans un nuage de givre. Un petit drone s’allume.', 'Green beep! The cabinet opens in a cloud of frost. A little drone switches on.', 'Bíp xanh! Tủ mở ra trong làn sương giá. Một chiếc máy bay nhỏ bật sáng.')); return g.pz('maze'); }
        g.say(T('Une armoire réfrigérée. Lecteur de badge : ACCÈS REFUSÉ.', 'A refrigerated cabinet. Badge reader: ACCESS DENIED.', 'Một tủ lạnh mẫu vật. Đầu đọc thẻ: TỪ CHỐI TRUY CẬP.'));
      } },
      { v: 'b', r: [460, 700, 220, 120], n: T('Caisse à outils', 'Toolbox', 'Hộp đồ nghề'), hid: true, click: g => { g.doc('tools'); g.say(T('Sous les clés à molette, un post-it oublié.', 'Under the spanners, a forgotten sticky note.', 'Dưới mấy cờ lê có một mẩu giấy nhớ bị bỏ quên.')); } },
      { v: 'c', r: [100, 200, 330, 440], n: T('Capsule cryo', 'Cryo pod', 'Khoang ngủ đông'), click: g => g.say(T('Ta capsule de cryo-sommeil, encore couverte de givre. Le tiroir à sa base est entrouvert…', 'Your cryo-sleep pod, still frosted over. The drawer at its base is ajar…', 'Khoang ngủ đông của bạn, vẫn phủ đầy sương giá. Ngăn kéo ở chân khoang hé mở…')) },
      { v: 'c', r: [150, 650, 230, 80], n: T('Tiroir de la capsule', 'Pod drawer', 'Ngăn kéo khoang'), hid: true, show: g => !g.f.flash, click: g => { g.set('flash'); g.take('flash'); g.say(T('Dans le tiroir de secours : une lampe torche.', 'In the emergency drawer: a flashlight.', 'Trong ngăn kéo khẩn cấp: một chiếc đèn pin.')); } },
      { v: 'c', r: [520, 160, 360, 240], n: T('Photos de l’équipage', 'Crew photos', 'Ảnh phi hành đoàn'), click: g => g.doc('crew', true) },
      { v: 'c', r: [960, 180, 240, 560], n: T('Casier de la commandante', 'Commander’s locker', 'Tủ của chỉ huy'), click: g => g.solved('locker') ? g.doc('cmdr', true) : g.pz('locker') },
      { v: 'c', r: [1260, 600, 200, 120], n: T('Tablette', 'Tablet', 'Máy tính bảng'), click: g => g.pz('memory') },
      { v: 'c', r: [560, 470, 220, 160], n: T('Hublot', 'Porthole', 'Ô cửa sổ'), click: g => g.say(T('Les étoiles défilent lentement. La station tourne sur elle-même.', 'The stars drift slowly past. The station is spinning.', 'Các vì sao chậm rãi trôi qua. Trạm đang tự quay.')) },
      { v: 'c', r: [1200, 380, 360, 180], n: T('Couchette', 'Bunk', 'Giường'), click: g => g.say(T('Une couchette sanglée au mur. Un ours en peluche flotte au-dessus, attaché par une ficelle.', 'A bunk strapped to the wall. A teddy bear floats above it, tied with a string.', 'Một chiếc giường gắn vào tường. Một chú gấu bông lơ lửng phía trên, buộc bằng sợi dây.')) }
    ],
    finNeed: g => g.f.power ? null : T('Le sas n’est pas alimenté : le boîtier de jonction est coupé dans la salle des machines.', 'The airlock has no power: the junction box is cut in the engine room.', 'Cửa khoang không có điện: hộp nối ở phòng máy đã bị ngắt.'),
    goals: [
      [g => g.solved('wave'), g => true, T('L’antenne, à côté de la baie vitrée : cale ton signal sur celui d’HÉLIOS.', 'The antenna by the viewport: match your signal to HELIOS’s.', 'Ăng-ten cạnh cửa kính: chỉnh tín hiệu của bạn khớp với tín hiệu của HELIOS.')],
      [g => g.solved('anagram'), g => g.f.signal, T('Sur le terminal, remets les lettres du mot de passe dans l’ordre.', 'On the terminal, put the password’s letters back in order.', 'Trên máy tính, sắp xếp lại các chữ cái của mật khẩu.')],
      [g => g.f.flash, g => true, T('La salle des machines est noire. Ta capsule cryo, dans les quartiers, a un tiroir de secours.', 'The engine room is dark. Your cryo pod, in the quarters, has an emergency drawer.', 'Phòng máy tối om. Khoang ngủ đông của bạn ở khu nghỉ có một ngăn kéo khẩn cấp.')],
      [g => g.solved('binary'), g => g.f.flash, T('Avec la lampe, trouve les disjoncteurs et additionne les interrupteurs.', 'With the flashlight, find the breakers and add up the switches.', 'Dùng đèn pin tìm cầu dao rồi cộng các công tắc lại.')],
      [g => g.solved('master'), g => g.f.flash || g.f.lights, T('Le boîtier de jonction du sas attend sa combinaison de couleurs.', 'The airlock junction box is waiting for its colour combination.', 'Hộp nối của cửa khoang đang chờ tổ hợp màu.')],
      [g => g.solved('nonogram'), g => g.f.lights, T('L’hologramme fonctionne : HÉLIOS veut que tu dessines quelque chose.', 'The hologram works: HELIOS wants you to draw something.', 'Ảnh ba chiều đã chạy: HELIOS muốn bạn vẽ một thứ.')],
      [g => g.solved('pattern'), g => g.f.flash || g.f.lights, T('Les calculs du tableau blanc cachent une règle.', 'The calculations on the whiteboard hide a rule.', 'Các phép tính trên bảng trắng ẩn chứa một quy luật.')],
      [g => g.solved('locker'), g => g.solved('anagram'), T('Le mot de passe reconstitué ouvre le casier de la commandante.', 'The restored password opens the commander’s locker.', 'Mật khẩu đã khôi phục mở được tủ của chỉ huy.')],
      [g => g.solved('memory'), g => true, T('La tablette de Ruiz, près des couchettes : un jeu de mémoire.', 'Ruiz’s tablet, by the bunks: a memory game.', 'Máy tính bảng của Ruiz cạnh giường: một trò chơi trí nhớ.')],
      [g => g.f.fridge, g => g.has('card'), T('Le badge ouvre l’armoire à échantillons de la salle des machines.', 'The badge opens the sample cabinet in the engine room.', 'Thẻ ra vào mở được tủ mẫu vật trong phòng máy.')],
      [g => g.solved('maze'), g => g.f.fridge, T('Guide le drone jusqu’à la fiole dans l’armoire.', 'Guide the drone to the vial in the cabinet.', 'Điều khiển máy bay đến lọ mẫu trong tủ.')]
    ]
  };

  window.Content = [classroom, ship, temple, station];
  window.Content.SYM = SYM;
})();

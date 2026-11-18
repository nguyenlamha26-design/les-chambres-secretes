// Textes des nouveaux types d'énigmes (français, anglais, vietnamien).
(() => {
  const add = (l, ui, pz) => { Object.assign(window.T[l], ui); Object.assign(window.T[l].pz, pz); };

  add('fr', {
    fill: 'Remplir', empty: 'Vider', pour: 'Verser →', goalL: 'Objectif : exactement {t} L dans un bidon', jugMoves: { fA: 'remplir le petit bidon', fB: 'remplir le grand bidon', eA: 'vider le petit bidon', eB: 'vider le grand bidon', pAB: 'verser le petit dans le grand', pBA: 'verser le grand dans le petit' },
    nextStep: 'Prochaine étape : {x}', cross: 'Traverser ⛵', bankL: 'Ton bateau', bankR: 'Le bateau de Tư', you: 'Toi', boat: 'Chaloupe',
    riverNames: ['toi seul', 'le chat', 'l’oiseau', 'le riz'], eatBird: 'Le chat a mangé l’oiseau !', eatRice: 'L’oiseau a picoré le riz !', crossings: 'Traversées : {n} / {m}', tooMany: 'Trop de traversées : la tempête t’a rattrapé !',
    idol: 'Idole', target: 'Poids à équilibrer : {t}', pickK: 'Choisis exactement {k} pierres.', stoneH: 'La pierre de {x} fait partie de la solution.',
    noLegend: 'Sans la légende des quatre bêtes, impossible de savoir comment les orienter… Élise l’a peut-être notée quelque part.', faceH: '{b} doit regarder vers le {d}.', turn: 'Clique sur une statue pour la faire pivoter.',
    amp: 'Amplitude', freq: 'Fréquence', phase: 'Décalage', waveH: 'La fréquence du signal est {x}.', waveOk: 'Signal verrouillé !',
    binTarget: 'Code de réarmement : {t}', binVal: 'Valeur actuelle : {v}', binH: 'Commence par l’interrupteur qui vaut {x}.',
    tryIt: 'Essayer', erase: '⌫', triesLeft: 'Essais restants : {n}', mmLegend: '● = bon symbole bien placé · ○ = bon symbole mal placé', mmLost: 'Plus d’essais ! Le boîtier génère un nouveau code.', mmH: 'Le premier symbole est {x}.',
    errors: 'Erreurs : {n} / {m}', memLost: 'Trop d’erreurs ! Les cartes sont mélangées à nouveau.',
    mazeH: 'Le robot doit atteindre la fiole 🧪. Utilise les flèches du clavier ou les boutons.', clear: 'Effacer', enter: 'Entrer',
    nonoH: 'La case qui clignote doit être noircie.', rotH: 'La pièce qui clignote n’est pas dans le bon sens.', mirH: 'Le miroir qui clignote est mal orienté.', algH: '{x} vaut {v}.',
    dirArrow: { N: 'nord', E: 'est', S: 'sud', W: 'ouest' }
  }, {
    algebra: { t: 'Calcul en images', i: 'Chaque image cache un nombre. Trouve-les, puis calcule la dernière ligne.', h: 'Commence par la ligne où la même image est répétée.' },
    jugs: { t: 'Les bidons', i: 'Tu n’as que deux bidons sans graduations. Remplis, vide et transvase pour obtenir la quantité demandée.', h: 'Remplis un bidon, verse-le dans l’autre, et observe ce qui reste.' },
    river: { t: 'La traversée', i: 'Fais passer le chat, l’oiseau et le riz sur l’autre bateau. La chaloupe ne porte que toi et une seule chose. Seul, le chat mange l’oiseau ; seul, l’oiseau mange le riz.', h: 'Tu as le droit de ramener quelque chose en arrière.' },
    mirror: { t: 'Le rayon de soleil', i: 'Clique sur les miroirs pour les faire pivoter et guide le rayon de soleil jusqu’à l’œil du crocodile.', h: 'Suis le rayon depuis le soleil : chaque miroir le fait tourner d’un quart de tour.' },
    weights: { t: 'La balance des offrandes', i: 'Pose des pierres sur le plateau pour équilibrer exactement l’idole.', h: 'Additionne les poids : il faut tomber pile sur le poids de l’idole.' },
    facing: { t: 'Le regard des bêtes', i: 'Oriente chaque statue comme le dit la légende.', h: 'Commence par la bête dont la direction est donnée directement, puis déduis les autres.' },
    rotimg: { t: 'Le relief brisé', i: 'Clique sur les pierres pour les faire pivoter et reconstitue le relief.', h: 'Repère d’abord les coins et les bords du dessin.' },
    wave: { t: 'Calibrage de l’antenne', i: 'Règle ton signal (vert) pour qu’il se superpose exactement au signal reçu (orange).', h: 'Compte les bosses du signal orange pour trouver la fréquence, puis règle la hauteur.' },
    anagram: { t: 'Le fichier corrompu', i: 'Les lettres d’un mot de passe ont été mélangées. Clique sur les lettres dans le bon ordre.', h: 'Le mot a un rapport avec l’espace.' },
    nonogram: { t: 'Image cachée', i: 'Noircis les cases : les nombres indiquent les groupes de cases noires, dans l’ordre, sur chaque ligne et chaque colonne. Clic droit pour marquer une case vide.', h: 'Commence par les lignes ou colonnes qui contiennent un 5 : elles sont entièrement noires.' },
    binary: { t: 'Les disjoncteurs', i: 'Chaque interrupteur vaut le double du suivant. Allume ceux dont la somme donne le code de réarmement.', h: 'Pars du plus grand interrupteur : allume-le s’il ne dépasse pas le code, puis continue avec le reste.' },
    master: { t: 'Le boîtier codé', i: 'Devine la combinaison. Après chaque essai, le boîtier dit combien de symboles sont bien placés (●) ou présents mais mal placés (○).', h: 'Essaie d’abord des combinaisons avec un seul symbole répété pour savoir lesquels sont présents.' },
    memory: { t: 'Le jeu de mémoire', i: 'Retourne les cartes deux par deux et retrouve toutes les paires.', h: 'Retiens la position de chaque carte retournée, même ratée.' },
    maze: { t: 'Le drone de prélèvement', i: 'Guide le petit drone dans les rayonnages jusqu’à la fiole.', h: 'Longe toujours le même mur : tu finiras par sortir.' }
  });

  add('en', {
    fill: 'Fill', empty: 'Empty', pour: 'Pour →', goalL: 'Goal: exactly {t} L in one can', jugMoves: { fA: 'fill the small can', fB: 'fill the big can', eA: 'empty the small can', eB: 'empty the big can', pAB: 'pour the small into the big', pBA: 'pour the big into the small' },
    nextStep: 'Next step: {x}', cross: 'Cross ⛵', bankL: 'Your boat', bankR: 'Tư’s boat', you: 'You', boat: 'Dinghy',
    riverNames: ['you alone', 'the cat', 'the bird', 'the rice'], eatBird: 'The cat ate the bird!', eatRice: 'The bird pecked at the rice!', crossings: 'Crossings: {n} / {m}', tooMany: 'Too many crossings: the storm caught up with you!',
    idol: 'Idol', target: 'Weight to balance: {t}', pickK: 'Choose exactly {k} stones.', stoneH: 'The {x} stone is part of the solution.',
    noLegend: 'Without the legend of the four beasts, there is no way to know how to turn them… Maybe Élise wrote it down somewhere.', faceH: '{b} must face {d}.', turn: 'Click a statue to turn it.',
    amp: 'Amplitude', freq: 'Frequency', phase: 'Phase', waveH: 'The signal frequency is {x}.', waveOk: 'Signal locked!',
    binTarget: 'Reset code: {t}', binVal: 'Current value: {v}', binH: 'Start with the switch worth {x}.',
    tryIt: 'Try', erase: '⌫', triesLeft: 'Tries left: {n}', mmLegend: '● = right symbol, right place · ○ = right symbol, wrong place', mmLost: 'Out of tries! The box generates a new code.', mmH: 'The first symbol is {x}.',
    errors: 'Mistakes: {n} / {m}', memLost: 'Too many mistakes! The cards are shuffled again.',
    mazeH: 'The robot must reach the vial 🧪. Use the arrow keys or the buttons.', clear: 'Clear', enter: 'Enter',
    nonoH: 'The blinking square must be filled.', rotH: 'The blinking piece is the wrong way round.', mirH: 'The blinking mirror is turned the wrong way.', algH: '{x} is worth {v}.',
    dirArrow: { N: 'north', E: 'east', S: 'south', W: 'west' }
  }, {
    algebra: { t: 'Picture Maths', i: 'Each picture hides a number. Work them out, then solve the last line.', h: 'Start with the line where the same picture is repeated.' },
    jugs: { t: 'The Water Cans', i: 'You only have two unmarked cans. Fill, empty and pour to get the requested amount.', h: 'Fill one can, pour it into the other, and look at what is left.' },
    river: { t: 'The Crossing', i: 'Get the cat, the bird and the rice onto the other boat. The dinghy only holds you and one thing. Left alone, the cat eats the bird and the bird eats the rice.', h: 'You are allowed to bring something back.' },
    mirror: { t: 'The Sunbeam', i: 'Click the mirrors to turn them and guide the sunbeam to the crocodile’s eye.', h: 'Follow the beam from the sun: each mirror turns it by a quarter turn.' },
    weights: { t: 'The Offering Scale', i: 'Place stones on the pan to balance the idol exactly.', h: 'Add up the weights: you must land exactly on the idol’s weight.' },
    facing: { t: 'The Gaze of the Beasts', i: 'Turn each statue the way the legend says.', h: 'Start with the beast whose direction is given directly, then work out the others.' },
    rotimg: { t: 'The Broken Relief', i: 'Click the stones to rotate them and rebuild the relief.', h: 'Find the corners and edges of the picture first.' },
    wave: { t: 'Antenna Calibration', i: 'Tune your signal (green) so it lies exactly on top of the received signal (orange).', h: 'Count the peaks of the orange signal to find the frequency, then set the height.' },
    anagram: { t: 'The Corrupted File', i: 'The letters of a password have been scrambled. Click the letters in the right order.', h: 'The word has something to do with space.' },
    nonogram: { t: 'Hidden Picture', i: 'Fill in squares: the numbers give the groups of filled squares, in order, for each row and column. Right-click to mark a square as empty.', h: 'Start with rows or columns containing a 5: they are completely filled.' },
    binary: { t: 'The Breakers', i: 'Each switch is worth double the next one. Turn on the ones that add up to the reset code.', h: 'Start from the biggest switch: turn it on if it doesn’t exceed the code, then carry on with the rest.' },
    master: { t: 'The Coded Box', i: 'Guess the combination. After each try, the box tells you how many symbols are in the right place (●) or present but misplaced (○).', h: 'First try combinations with a single repeated symbol to find out which ones are present.' },
    memory: { t: 'The Memory Game', i: 'Turn the cards over two at a time and find all the pairs.', h: 'Remember where each card was, even the missed ones.' },
    maze: { t: 'The Sampling Drone', i: 'Guide the little drone through the racks to the vial.', h: 'Keep following the same wall: you will get out eventually.' }
  });

  add('vi', {
    fill: 'Đổ đầy', empty: 'Đổ hết', pour: 'Rót sang →', goalL: 'Mục tiêu: đúng {t} lít trong một can', jugMoves: { fA: 'đổ đầy can nhỏ', fB: 'đổ đầy can lớn', eA: 'đổ hết can nhỏ', eB: 'đổ hết can lớn', pAB: 'rót can nhỏ sang can lớn', pBA: 'rót can lớn sang can nhỏ' },
    nextStep: 'Bước tiếp theo: {x}', cross: 'Chèo sang ⛵', bankL: 'Thuyền của bạn', bankR: 'Thuyền chú Tư', you: 'Bạn', boat: 'Xuồng',
    riverNames: ['một mình bạn', 'con mèo', 'con chim', 'bao gạo'], eatBird: 'Con mèo đã ăn mất con chim!', eatRice: 'Con chim đã mổ gạo!', crossings: 'Số lượt: {n} / {m}', tooMany: 'Quá nhiều lượt: cơn bão đã đuổi kịp bạn!',
    idol: 'Tượng thần', target: 'Cân nặng cần cân bằng: {t}', pickK: 'Chọn đúng {k} hòn đá.', stoneH: 'Hòn đá nặng {x} nằm trong lời giải.',
    noLegend: 'Không có truyền thuyết về bốn con thú thì chẳng biết phải xoay chúng thế nào… Có lẽ Élise đã ghi lại ở đâu đó.', faceH: '{b} phải nhìn về hướng {d}.', turn: 'Bấm vào một bức tượng để xoay nó.',
    amp: 'Biên độ', freq: 'Tần số', phase: 'Độ lệch', waveH: 'Tần số của tín hiệu là {x}.', waveOk: 'Đã khóa tín hiệu!',
    binTarget: 'Mã khởi động lại: {t}', binVal: 'Giá trị hiện tại: {v}', binH: 'Bắt đầu với công tắc có giá trị {x}.',
    tryIt: 'Thử', erase: '⌫', triesLeft: 'Lượt thử còn lại: {n}', mmLegend: '● = đúng ký hiệu, đúng chỗ · ○ = đúng ký hiệu, sai chỗ', mmLost: 'Hết lượt! Hộp tạo ra một mã mới.', mmH: 'Ký hiệu đầu tiên là {x}.',
    errors: 'Lỗi: {n} / {m}', memLost: 'Sai quá nhiều! Các lá bài được xáo lại.',
    mazeH: 'Rô-bốt phải đến được lọ mẫu 🧪. Dùng phím mũi tên hoặc các nút.', clear: 'Xóa', enter: 'Nhập',
    nonoH: 'Ô đang nhấp nháy phải được tô đen.', rotH: 'Mảnh đang nhấp nháy bị xoay sai.', mirH: 'Tấm gương đang nhấp nháy bị xoay sai.', algH: '{x} có giá trị {v}.',
    dirArrow: { N: 'Bắc', E: 'Đông', S: 'Nam', W: 'Tây' }
  }, {
    algebra: { t: 'Phép tính bằng hình', i: 'Mỗi hình ẩn một con số. Hãy tìm ra chúng rồi tính dòng cuối cùng.', h: 'Bắt đầu từ dòng có một hình lặp lại nhiều lần.' },
    jugs: { t: 'Hai chiếc can', i: 'Bạn chỉ có hai chiếc can không có vạch chia. Đổ đầy, đổ hết và rót qua lại để có đúng lượng nước cần thiết.', h: 'Đổ đầy một can, rót sang can kia rồi xem phần còn lại.' },
    river: { t: 'Chuyến đò', i: 'Đưa con mèo, con chim và bao gạo sang thuyền bên kia. Xuồng chỉ chở được bạn và một thứ. Nếu bị bỏ lại, mèo sẽ ăn chim và chim sẽ ăn gạo.', h: 'Bạn được phép chở một thứ quay lại.' },
    mirror: { t: 'Tia nắng', i: 'Bấm vào các tấm gương để xoay và dẫn tia nắng đến mắt con cá sấu.', h: 'Đi theo tia nắng từ mặt trời: mỗi tấm gương bẻ nó đi một góc vuông.' },
    weights: { t: 'Chiếc cân lễ vật', i: 'Đặt các hòn đá lên đĩa cân để cân bằng chính xác với tượng thần.', h: 'Cộng các khối lượng lại: phải đúng bằng cân nặng của tượng.' },
    facing: { t: 'Ánh mắt muông thú', i: 'Xoay từng bức tượng theo đúng lời truyền thuyết.', h: 'Bắt đầu với con thú có hướng được cho trực tiếp, rồi suy ra các con khác.' },
    rotimg: { t: 'Bức phù điêu vỡ', i: 'Bấm vào các phiến đá để xoay và ghép lại bức phù điêu.', h: 'Tìm các góc và cạnh của hình trước.' },
    wave: { t: 'Hiệu chỉnh ăng-ten', i: 'Chỉnh tín hiệu của bạn (xanh) sao cho trùng khít với tín hiệu nhận được (cam).', h: 'Đếm số đỉnh sóng cam để tìm tần số, rồi chỉnh độ cao.' },
    anagram: { t: 'Tệp bị hỏng', i: 'Các chữ cái của một mật khẩu đã bị xáo trộn. Bấm vào các chữ theo đúng thứ tự.', h: 'Từ này liên quan đến vũ trụ.' },
    nonogram: { t: 'Hình ẩn', i: 'Tô đen các ô: các con số cho biết các nhóm ô đen liên tiếp, theo thứ tự, trên mỗi hàng và mỗi cột. Bấm chuột phải để đánh dấu ô trống.', h: 'Bắt đầu với hàng hoặc cột có số 5: chúng được tô đen toàn bộ.' },
    binary: { t: 'Cầu dao', i: 'Mỗi công tắc có giá trị gấp đôi công tắc kế tiếp. Bật những công tắc có tổng bằng mã khởi động lại.', h: 'Bắt đầu từ công tắc lớn nhất: bật nó nếu không vượt quá mã, rồi tiếp tục với phần còn lại.' },
    master: { t: 'Hộp mật mã', i: 'Đoán tổ hợp. Sau mỗi lần thử, hộp cho biết có bao nhiêu ký hiệu đúng chỗ (●) hoặc có mặt nhưng sai chỗ (○).', h: 'Hãy thử trước những tổ hợp chỉ lặp lại một ký hiệu để biết ký hiệu nào có mặt.' },
    memory: { t: 'Trò chơi trí nhớ', i: 'Lật từng cặp hai lá bài và tìm ra tất cả các cặp giống nhau.', h: 'Ghi nhớ vị trí của từng lá đã lật, kể cả những lá lật sai.' },
    maze: { t: 'Máy bay lấy mẫu', i: 'Điều khiển chiếc máy bay nhỏ đi qua các giá kệ đến lọ mẫu.', h: 'Luôn đi men theo một bức tường: cuối cùng bạn sẽ ra được.' }
  });
})();

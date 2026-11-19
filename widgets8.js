// Énigmes des scénarios « Académie de magie », « La Famille » (mafia) et « L'Agora du temps » (philosophes).
(() => {
  'use strict';
  const K = window.GameKit, { rand, shuffle, DIG5 } = window.Logic, W = K.W, $ = K.$;
  const tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  const lv = () => Math.min(2, K.G.lvl + (K.G.S.hard ? 1 : 0));
  const box = () => $('#pzb');
  const T = (fr, en, vi) => ({ fr, en, vi });
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const answer = (p, test, num) => { box().insertAdjacentHTML('beforeend', K.inputRow(num ? 'number' : '')); K.bindInput(test, p); };

  const UI = {
    fr: {
      poBook: 'Le grimoire de potions dit :', poPour: '🧪 Verser dans le chaudron', poEmpty: 'Vider', poBad: 'La potion fume, noircit… et explose en bulles violettes !', poH: 'Il faut exactement {n} goutte(s) de {x}.',
      poTot: 'En tout, {n} gouttes.', poDiff: 'Il y a {k} goutte(s) de {x} de plus que de {y}.', poMul: 'Il y a {k} fois plus de {x} que de {y}.', poSum: 'Il y a autant de {x} que de {y} et de {z} réunis.', poZero: 'Pas une seule goutte de {x}.', poEq: 'Autant de {x} que de {y}.', poGt: 'Plus de {x} que de {y}.', poVal: 'Exactement {n} goutte(s) de {x}.',
      mrT0: 'Le miroir montre la rune inversée de gauche à droite. Trace la vraie rune.', mrT1: 'La rune se reflète dans le lac : elle est à l’envers, de haut en bas. Trace la vraie rune.', mrT2: 'Le miroir inverse la rune de gauche à droite, puis la fait pivoter d’un quart de tour vers la droite. Trace la vraie rune.', mrMirror: 'Dans le miroir', mrYou: 'Ta rune', mrClear: 'Effacer', mrBad: 'La rune grésille et s’éteint. Ce n’est pas la bonne.', mrH: 'La vraie rune commence ou finit au point surligné.',
      gQ: 'La première roue fait {r} tours dans le sens des aiguilles d’une montre. Combien de tours fait la dernière roue, et dans quel sens ?', gCW: '↻ horaire', gCCW: '↺ antihoraire', gDir: 'Choisis aussi le sens.', gAxle: 'même axe', gH: 'Il y a {m} engrenage(s) entre deux roues, donc la dernière tourne dans le sens {d}.',
      vgKey: 'Clé gravée sur la baguette : {k}', vgAid: 'Pour chaque lettre, recule dans l’alphabet d’autant de rangs que la lettre de la clé (A = 0, B = 1…). La clé se répète.', vgH: 'La première lettre est {x}.',
      rmQ: 'Quelle carte montre la même constellation, simplement tournée ?', rmRound: 'Constellation {n} / {m}', rmBad: 'Ce n’est pas la même constellation. Le ciel change !', rmH: 'La bonne carte est tournée de {x}°.',
      brGo: '▶ Décoller', brScore: 'Anneaux : {n} / {m}', brLives: 'Vies : {n}', brLost: 'Ton balai a heurté trop d’obstacles ! On recommence.', brKeys: 'Flèches ← → ou boutons pour te déplacer.', brH: 'Reste au centre : tu atteindras plus vite les deux côtés.',
      alClaims: 'Ce que disent les suspects :', alSeen: 'Ce qu’ont vu les témoins :', alCrime: 'Le vol a eu lieu à {t}, {p}.', alWho: 'Qui ment ?', alAt: 'À {t}, {p} : quelqu’un {d}.', alHat: 'au chapeau {x}', alAcc: 'avec {x}', alH: 'Le coupable est forcément {d}.',
      lgQ: 'Clique sur la ligne trafiquée : son solde ne correspond pas au calcul.', lgCols: 'Date|Opération|Entrée|Sortie|Solde', lgH: 'La ligne trafiquée se trouve après la ligne {n}.',
      pkQ: 'Qui remporte la main ?', pkRank: 'Du plus faible au plus fort :', pkH: 'La main gagnante est : {x}.',
      roPlay: '▶ Écouter la ligne', roQ: 'Un ancien téléphone à cadran : chaque chiffre fait autant de déclics que sa valeur (0 = 10 déclics). Quel numéro a été composé ?', roH: 'Le premier chiffre est {x}.',
      skQ: 'Partage le quartier en rectangles. Chaque rectangle contient un seul nombre, égal à son nombre de cases. Clique sur deux coins opposés pour tracer un rectangle ; clique dans un rectangle pour l’effacer.', skBad: 'Le partage n’est pas bon : un rectangle a zéro ou plusieurs nombres, ou une mauvaise taille.', skFull: 'Couvre toutes les cases avant de valider.', skH: 'Le rectangle du {n} en haut à gauche fait {w} × {h}.',
      knQ: 'Le camion supporte {c} kg. Charge la marchandise la plus précieuse possible.', knTot: 'Poids : {w} / {c} kg · Valeur : {v} $', knGo: '🚚 Charger le camion', knOver: 'Trop lourd : les essieux craquent !', knLow: 'Le camion part… mais on pouvait emporter plus de valeur.', knH: 'La meilleure cargaison vaut {v} $.',
      syQ: 'Des deux premières phrases, quelles conclusions découlent forcément ?', syRound: 'Raisonnement {n} / {m}', syY: '✓ découle', syN: '✗ ne découle pas', syU: '❔', syAll: 'Juge chaque conclusion.', syH: 'Une conclusion correcte : « {x} »',
      syAll2: 'Tous les {x} sont {y}.', syNo: 'Aucun {xs} n’est {ys}.', sySome: 'Certains {x} sont {y}.', syNot: 'Certains {x} ne sont pas {y}.',
      euRound: 'Solide {n} / {m}', euV: 'sommets', euE: 'arêtes', euF: 'faces', euQ: '{s} : {a}. Combien de {x} ?', euH: 'Sommets − arêtes + faces = 2.', euAnon: 'Un solide convexe',
      caQ: 'Place ces points sur le repère, puis lis le chiffre qu’ils dessinent.', caShift: 'Attention : chaque point a été déplacé de ({dx} ; {dy}). Remets-le à sa vraie place.', caH: 'Le premier point se place en ({x} ; {y}).',
      coQ: 'Les citoyens ont classé les projets. Lequel bat tous les autres en duel (préféré par une majorité face à chacun) ?', coVoters: 'électeurs', coH: '{a} bat {b} : {x} voix contre {y}.',
      baQ: 'Combien de {g} faut-il pour {q} {h} ?', baH: '1 {h} vaut {r} {g}.',
      tlQ: 'Clique les événements dans l’ordre chronologique, du plus ancien au plus récent.', tlBad: 'Ce n’est pas le bon ordre ! On recommence.', tlH: 'Le plus ancien : « {x} ».'
    },
    en: {
      poBook: 'The potion book says:', poPour: '🧪 Pour into the cauldron', poEmpty: 'Empty', poBad: 'The potion smokes, turns black… and bursts into purple bubbles!', poH: 'You need exactly {n} drop(s) of {x}.',
      poTot: '{n} drops in total.', poDiff: 'There are {k} more drop(s) of {x} than of {y}.', poMul: 'There is {k} times as much {x} as {y}.', poSum: 'There is as much {x} as {y} and {z} together.', poZero: 'Not a single drop of {x}.', poEq: 'As much {x} as {y}.', poGt: 'More {x} than {y}.', poVal: 'Exactly {n} drop(s) of {x}.',
      mrT0: 'The mirror shows the rune flipped left to right. Draw the real rune.', mrT1: 'The rune is reflected in the lake: it is upside down. Draw the real rune.', mrT2: 'The mirror flips the rune left to right, then turns it a quarter turn clockwise. Draw the real rune.', mrMirror: 'In the mirror', mrYou: 'Your rune', mrClear: 'Clear', mrBad: 'The rune fizzles out. That isn’t it.', mrH: 'The real rune starts or ends at the highlighted dot.',
      gQ: 'The first wheel turns {r} times clockwise. How many turns does the last wheel make, and in which direction?', gCW: '↻ clockwise', gCCW: '↺ anticlockwise', gDir: 'Choose the direction too.', gAxle: 'same axle', gH: 'There are {m} mesh(es), so the last wheel turns {d}.',
      vgKey: 'Key carved on the wand: {k}', vgAid: 'For each letter, go back in the alphabet as many places as the key letter (A = 0, B = 1…). The key repeats.', vgH: 'The first letter is {x}.',
      rmQ: 'Which chart shows the same constellation, simply rotated?', rmRound: 'Constellation {n} / {m}', rmBad: 'That is not the same constellation. The sky changes!', rmH: 'The right chart is rotated by {x}°.',
      brGo: '▶ Take off', brScore: 'Rings: {n} / {m}', brLives: 'Lives: {n}', brLost: 'Your broom hit too many obstacles! Start again.', brKeys: 'Use ← → arrows or the buttons to move.', brH: 'Stay in the middle: you reach both sides faster.',
      alClaims: 'What the suspects say:', alSeen: 'What the witnesses saw:', alCrime: 'The robbery took place at {t}, {p}.', alWho: 'Who is lying?', alAt: 'At {t}, {p}: someone {d}.', alHat: 'in a {x} hat', alAcc: 'with {x}', alH: 'The culprit must be {d}.',
      lgQ: 'Click the forged line: its balance doesn’t match the sum.', lgCols: 'Date|Entry|In|Out|Balance', lgH: 'The forgery comes after line {n}.',
      pkQ: 'Who wins the hand?', pkRank: 'From weakest to strongest:', pkH: 'The winning hand is: {x}.',
      roPlay: '▶ Listen to the line', roQ: 'An old rotary phone: each digit makes as many clicks as its value (0 = 10 clicks). Which number was dialled?', roH: 'The first digit is {x}.',
      skQ: 'Split the district into rectangles. Each rectangle contains exactly one number, equal to its number of squares. Click two opposite corners to draw a rectangle; click inside one to erase it.', skBad: 'Not a valid split: a rectangle has no number, several numbers or the wrong size.', skFull: 'Cover every square before checking.', skH: 'The rectangle of the top-left {n} is {w} × {h}.',
      knQ: 'The truck can carry {c} kg. Load the most valuable cargo possible.', knTot: 'Weight: {w} / {c} kg · Value: ${v}', knGo: '🚚 Load the truck', knOver: 'Too heavy: the axles crack!', knLow: 'The truck leaves… but you could have taken more value.', knH: 'The best cargo is worth ${v}.',
      syQ: 'From the first two sentences, which conclusions necessarily follow?', syRound: 'Argument {n} / {m}', syY: '✓ follows', syN: '✗ doesn’t follow', syU: '❔', syAll: 'Judge every conclusion.', syH: 'One correct conclusion: “{x}”',
      syAll2: 'All {x} are {y}.', syNo: 'No {x} are {y}.', sySome: 'Some {x} are {y}.', syNot: 'Some {x} are not {y}.',
      euRound: 'Solid {n} / {m}', euV: 'vertices', euE: 'edges', euF: 'faces', euQ: '{s}: {a}. How many {x}?', euH: 'Vertices − edges + faces = 2.', euAnon: 'A convex solid',
      caQ: 'Plot these points on the grid, then read the digit they draw.', caShift: 'Careful: each point has been moved by ({dx}, {dy}). Put it back in its true place.', caH: 'The first point goes at ({x}, {y}).',
      coQ: 'The citizens ranked the projects. Which one beats every other in a head-to-head (preferred by a majority against each)?', coVoters: 'voters', coH: '{a} beats {b}: {x} votes to {y}.',
      baQ: 'How many {g} are needed for {q} {h}?', baH: '1 {h} is worth {r} {g}.',
      tlQ: 'Click the events in chronological order, from oldest to most recent.', tlBad: 'Wrong order! Start again.', tlH: 'The oldest: “{x}”.'
    },
    vi: {
      poBook: 'Sách độc dược viết:', poPour: '🧪 Đổ vào vạc', poEmpty: 'Đổ hết', poBad: 'Thuốc bốc khói, đen lại… rồi nổ thành bong bóng tím!', poH: 'Cần đúng {n} giọt {x}.',
      poTot: 'Tổng cộng {n} giọt.', poDiff: 'Số giọt {x} nhiều hơn {y} là {k}.', poMul: 'Số giọt {x} gấp {k} lần {y}.', poSum: 'Số giọt {x} bằng tổng số giọt {y} và {z}.', poZero: 'Không có giọt {x} nào.', poEq: 'Số giọt {x} bằng số giọt {y}.', poGt: 'Số giọt {x} nhiều hơn {y}.', poVal: 'Đúng {n} giọt {x}.',
      mrT0: 'Chiếc gương cho thấy ký tự bị lật trái sang phải. Hãy vẽ ký tự thật.', mrT1: 'Ký tự phản chiếu trên mặt hồ: nó bị lộn ngược trên xuống dưới. Hãy vẽ ký tự thật.', mrT2: 'Gương lật ký tự trái sang phải, rồi xoay nó một phần tư vòng theo chiều kim đồng hồ. Hãy vẽ ký tự thật.', mrMirror: 'Trong gương', mrYou: 'Ký tự của bạn', mrClear: 'Xóa', mrBad: 'Ký tự xèo xèo rồi tắt. Không phải nó.', mrH: 'Ký tự thật bắt đầu hoặc kết thúc ở điểm được tô sáng.',
      gQ: 'Bánh xe đầu tiên quay {r} vòng theo chiều kim đồng hồ. Bánh cuối quay bao nhiêu vòng, theo chiều nào?', gCW: '↻ thuận chiều', gCCW: '↺ ngược chiều', gDir: 'Hãy chọn cả chiều quay.', gAxle: 'cùng trục', gH: 'Có {m} chỗ ăn khớp, nên bánh cuối quay {d}.',
      vgKey: 'Chìa khóa khắc trên đũa phép: {k}', vgAid: 'Với mỗi chữ, lùi lại trong bảng chữ cái số bậc bằng chữ của khóa (A = 0, B = 1…). Khóa được lặp lại.', vgH: 'Chữ đầu tiên là {x}.',
      rmQ: 'Tấm bản đồ nào cho thấy cùng chòm sao, chỉ bị xoay đi?', rmRound: 'Chòm sao {n} / {m}', rmBad: 'Không phải cùng chòm sao. Bầu trời thay đổi!', rmH: 'Tấm đúng bị xoay {x}°.',
      brGo: '▶ Cất cánh', brScore: 'Vòng: {n} / {m}', brLives: 'Mạng: {n}', brLost: 'Chổi bay va phải quá nhiều chướng ngại! Làm lại.', brKeys: 'Dùng phím ← → hoặc các nút để di chuyển.', brH: 'Hãy ở giữa: bạn sẽ tới hai bên nhanh hơn.',
      alClaims: 'Lời khai của các nghi phạm:', alSeen: 'Những gì nhân chứng thấy:', alCrime: 'Vụ trộm xảy ra lúc {t}, {p}.', alWho: 'Ai nói dối?', alAt: 'Lúc {t}, {p}: có người {d}.', alHat: 'đội mũ {x}', alAcc: 'mang {x}', alH: 'Thủ phạm chắc chắn {d}.',
      lgQ: 'Bấm vào dòng bị sửa: số dư của nó không khớp với phép tính.', lgCols: 'Ngày|Khoản|Thu|Chi|Số dư', lgH: 'Chỗ gian lận nằm sau dòng {n}.',
      pkQ: 'Ai thắng ván này?', pkRank: 'Từ yếu nhất đến mạnh nhất:', pkH: 'Bài thắng là: {x}.',
      roPlay: '▶ Nghe đường dây', roQ: 'Một chiếc điện thoại quay số cũ: mỗi chữ số kêu bấy nhiêu tiếng tách (0 = 10 tiếng). Số nào đã được quay?', roH: 'Chữ số đầu tiên là {x}.',
      skQ: 'Chia khu phố thành các hình chữ nhật. Mỗi hình chứa đúng một con số, bằng số ô của nó. Bấm hai góc đối nhau để vẽ; bấm vào bên trong để xóa.', skBad: 'Cách chia chưa đúng: có hình không có số, có nhiều số hoặc sai kích thước.', skFull: 'Hãy phủ kín mọi ô trước khi kiểm tra.', skH: 'Hình chữ nhật của số {n} ở góc trên bên trái có kích thước {w} × {h}.',
      knQ: 'Xe tải chở được {c} kg. Hãy chất hàng có giá trị cao nhất có thể.', knTot: 'Khối lượng: {w} / {c} kg · Giá trị: {v} $', knGo: '🚚 Chất hàng', knOver: 'Quá nặng: trục xe nứt rồi!', knLow: 'Xe chạy đi… nhưng lẽ ra có thể mang được nhiều giá trị hơn.', knH: 'Chuyến hàng tốt nhất trị giá {v} $.',
      syQ: 'Từ hai câu đầu, những kết luận nào chắc chắn đúng?', syRound: 'Lập luận {n} / {m}', syY: '✓ suy ra được', syN: '✗ không suy ra được', syU: '❔', syAll: 'Hãy đánh giá từng kết luận.', syH: 'Một kết luận đúng: « {x} »',
      syAll2: 'Mọi {x} đều là {y}.', syNo: 'Không {x} nào là {y}.', sySome: 'Có những {x} là {y}.', syNot: 'Có những {x} không phải là {y}.',
      euRound: 'Khối {n} / {m}', euV: 'đỉnh', euE: 'cạnh', euF: 'mặt', euQ: '{s}: {a}. Có bao nhiêu {x}?', euH: 'Đỉnh − cạnh + mặt = 2.', euAnon: 'Một khối lồi',
      caQ: 'Đặt các điểm này lên hệ trục, rồi đọc chữ số mà chúng vẽ ra.', caShift: 'Chú ý: mỗi điểm đã bị dời đi ({dx} ; {dy}). Hãy đưa về đúng chỗ.', caH: 'Điểm đầu tiên nằm ở ({x} ; {y}).',
      coQ: 'Người dân đã xếp hạng các dự án. Dự án nào thắng mọi dự án khác khi đấu tay đôi (được đa số ưa hơn)?', coVoters: 'cử tri', coH: '{a} thắng {b}: {x} phiếu so với {y}.',
      baQ: 'Cần bao nhiêu {g} để đổi {q} {h}?', baH: '1 {h} bằng {r} {g}.',
      tlQ: 'Bấm các sự kiện theo thứ tự thời gian, từ cũ nhất đến mới nhất.', tlBad: 'Sai thứ tự rồi! Làm lại.', tlH: 'Sớm nhất: « {x} ».'
    }
  };
  const PZ = {
    fr: {
      potion: { t: 'La potion', i: 'Trouve combien de gouttes de chaque couleur verser.', h: 'Essaie chaque possibilité pour une couleur, et vérifie les autres phrases.' },
      mrune: { t: 'Le miroir aux runes', i: 'Clique sur les points, l’un après l’autre, pour tracer la rune.', h: 'Retourne la rune dans ta tête, point par point.' },
      gears: { t: 'L’horloge enchantée', i: 'Deux roues qui s’engrènent tournent en sens contraires ; deux roues sur le même axe tournent ensemble.', h: 'Les dents qui passent sont les mêmes pour deux roues engrenées : tours × dents se conserve.' },
      vigenere: { t: 'La boîte à baguette', i: 'Le message est chiffré avec la clé gravée. Déchiffre-le.', h: 'Écris la clé sous le message, lettre par lettre.' },
      rotmatch: { t: 'Les cartes du ciel', i: 'Retrouve la constellation parmi les cartes.', h: 'Attention aux cartes vues dans un miroir : elles ne se superposent pas en tournant.' },
      broom: { t: 'La course de balais', i: 'Attrape les anneaux dorés et évite les obstacles.', h: 'Anticipe : regarde le haut du couloir, pas ton balai.' },
      alibi: { t: 'Le tableau des alibis', i: 'Un seul suspect ment. Trouve-le en croisant les alibis et les témoignages.', h: 'Chaque témoignage doit être expliqué par quelqu’un qui était vraiment là.' },
      ledger: { t: 'Le livre de comptes', i: 'Solde = solde précédent + entrée − sortie.', h: 'Refais le calcul ligne par ligne.' },
      poker: { t: 'La partie de poker', i: 'Compare les mains des joueurs.', h: 'À égalité de combinaison, c’est la carte la plus haute de la combinaison qui départage.' },
      rotary: { t: 'Le téléphone sur écoute', i: 'Écoute les déclics et compte-les.', h: 'Les pauses plus longues séparent les chiffres.' },
      shikaku: { t: 'Le partage des quartiers', i: 'Chaque famille aura un quartier rectangulaire.', h: 'Commence par les grands nombres coincés dans les coins.' },
      knap: { t: 'La contrebande', i: 'Choisis les caisses à charger.', h: 'Regarde la valeur par kilo… mais vérifie les combinaisons.' },
      syllog: { t: 'Le dialogue de Socrate', i: 'Juge chaque conclusion : découle-t-elle forcément des deux premières phrases ?', h: 'Dessine trois cercles qui se chevauchent et cherche un contre-exemple.' },
      euler: { t: 'Les solides de Platon', i: 'Trouve le nombre manquant.', h: 'Il existe une relation simple entre sommets, arêtes et faces de tout solide convexe.' },
      cartesian: { t: 'Le repère de Descartes', i: 'Place les points (x ; y) puis donne le chiffre dessiné.', h: 'x se lit à l’horizontale, y à la verticale.' },
      condorcet: { t: 'Le vote de la cité', i: 'Trouve le projet qui gagne chacun de ses duels.', h: 'Pour chaque duel, additionne les électeurs qui classent l’un avant l’autre.' },
      barter: { t: 'Les marchandises', i: 'Utilise les équivalences pour trouver la réponse.', h: 'Enchaîne les équivalences, de proche en proche.' },
      timeline: { t: 'Le voyage d’une vie', i: 'Remets en ordre les grandes étapes de la vie de Hồ Chí Minh.', h: 'Pense à son parcours : départ, Europe, Moscou, Asie, retour.' }
    },
    en: {
      potion: { t: 'The Potion', i: 'Work out how many drops of each colour to pour.', h: 'Try every option for one colour, and check the other sentences.' },
      mrune: { t: 'The Rune Mirror', i: 'Click the dots one after another to draw the rune.', h: 'Flip the rune in your head, dot by dot.' },
      gears: { t: 'The Enchanted Clock', i: 'Two meshing wheels turn in opposite directions; two wheels on the same axle turn together.', h: 'The teeth passing are the same for two meshing wheels: turns × teeth is conserved.' },
      vigenere: { t: 'The Wand Box', i: 'The message is encrypted with the carved key. Decrypt it.', h: 'Write the key under the message, letter by letter.' },
      rotmatch: { t: 'The Star Charts', i: 'Find the constellation among the charts.', h: 'Beware of mirrored charts: rotating them never makes them match.' },
      broom: { t: 'The Broom Race', i: 'Catch the golden rings and dodge the obstacles.', h: 'Look ahead at the top of the lane, not at your broom.' },
      alibi: { t: 'The Alibi Board', i: 'Only one suspect is lying. Find them by cross-checking alibis and sightings.', h: 'Each sighting must be explained by someone who was really there.' },
      ledger: { t: 'The Account Book', i: 'Balance = previous balance + in − out.', h: 'Redo the sum line by line.' },
      poker: { t: 'The Poker Game', i: 'Compare the players’ hands.', h: 'With the same combination, the highest card of the combination decides.' },
      rotary: { t: 'The Tapped Phone', i: 'Listen to the clicks and count them.', h: 'The longer pauses separate the digits.' },
      shikaku: { t: 'Dividing the Districts', i: 'Each family gets a rectangular district.', h: 'Start with the big numbers squeezed into corners.' },
      knap: { t: 'The Contraband', i: 'Choose the crates to load.', h: 'Look at value per kilo… but check the combinations.' },
      syllog: { t: 'Socrates’ Dialogue', i: 'Judge each conclusion: does it necessarily follow from the first two sentences?', h: 'Draw three overlapping circles and look for a counter-example.' },
      euler: { t: 'Plato’s Solids', i: 'Find the missing number.', h: 'There is a simple relation between the vertices, edges and faces of any convex solid.' },
      cartesian: { t: 'Descartes’ Grid', i: 'Plot the points (x, y), then give the digit they draw.', h: 'x is read horizontally, y vertically.' },
      condorcet: { t: 'The City Vote', i: 'Find the project that wins all its head-to-heads.', h: 'For each duel, add up the voters who rank one above the other.' },
      barter: { t: 'The Commodities', i: 'Use the equivalences to find the answer.', h: 'Chain the equivalences one step at a time.' },
      timeline: { t: 'A Life’s Journey', i: 'Put the main stages of Hồ Chí Minh’s life in order.', h: 'Think of his path: departure, Europe, Moscow, Asia, return.' }
    },
    vi: {
      potion: { t: 'Thuốc phép', i: 'Tìm số giọt mỗi màu cần đổ vào.', h: 'Thử từng khả năng cho một màu, rồi kiểm tra các câu còn lại.' },
      mrune: { t: 'Gương ký tự', i: 'Bấm lần lượt các điểm để vẽ ký tự.', h: 'Lật ký tự trong đầu, từng điểm một.' },
      gears: { t: 'Chiếc đồng hồ phép', i: 'Hai bánh ăn khớp quay ngược chiều nhau; hai bánh cùng trục quay cùng nhau.', h: 'Số răng đi qua của hai bánh ăn khớp là như nhau: số vòng × số răng không đổi.' },
      vigenere: { t: 'Hộp đũa phép', i: 'Thông điệp được mã hóa bằng khóa khắc sẵn. Hãy giải mã.', h: 'Viết khóa bên dưới thông điệp, từng chữ một.' },
      rotmatch: { t: 'Bản đồ sao', i: 'Tìm chòm sao trong các tấm bản đồ.', h: 'Cẩn thận với bản đồ bị soi gương: xoay thế nào cũng không trùng.' },
      broom: { t: 'Cuộc đua chổi bay', i: 'Bắt những chiếc vòng vàng và tránh chướng ngại.', h: 'Hãy nhìn trước phía trên đường bay, đừng nhìn chổi.' },
      alibi: { t: 'Bảng chứng cứ ngoại phạm', i: 'Chỉ một nghi phạm nói dối. Hãy đối chiếu lời khai và lời nhân chứng.', h: 'Mỗi lời nhân chứng phải được giải thích bởi người thực sự có mặt ở đó.' },
      ledger: { t: 'Sổ sách kế toán', i: 'Số dư = số dư trước + thu − chi.', h: 'Tính lại từng dòng một.' },
      poker: { t: 'Ván bài poker', i: 'So sánh bài của các người chơi.', h: 'Nếu cùng loại bài, lá cao nhất trong bộ sẽ phân định.' },
      rotary: { t: 'Điện thoại bị nghe lén', i: 'Nghe các tiếng tách và đếm chúng.', h: 'Những khoảng lặng dài hơn ngăn cách các chữ số.' },
      shikaku: { t: 'Chia địa bàn', i: 'Mỗi gia đình có một địa bàn hình chữ nhật.', h: 'Bắt đầu với những số lớn bị kẹt ở góc.' },
      knap: { t: 'Hàng lậu', i: 'Chọn những thùng hàng để chất lên xe.', h: 'Xem giá trị trên mỗi ký… nhưng hãy kiểm tra các tổ hợp.' },
      syllog: { t: 'Cuộc đối thoại của Socrates', i: 'Đánh giá từng kết luận: nó có chắc chắn suy ra từ hai câu đầu không?', h: 'Vẽ ba vòng tròn giao nhau và tìm một phản ví dụ.' },
      euler: { t: 'Các khối của Plato', i: 'Tìm con số còn thiếu.', h: 'Có một hệ thức đơn giản giữa số đỉnh, số cạnh và số mặt của mọi khối lồi.' },
      cartesian: { t: 'Hệ trục của Descartes', i: 'Đặt các điểm (x ; y) rồi cho biết chữ số được vẽ ra.', h: 'x đọc theo chiều ngang, y theo chiều dọc.' },
      condorcet: { t: 'Cuộc bỏ phiếu của thành bang', i: 'Tìm dự án thắng trong mọi cuộc đấu tay đôi.', h: 'Với mỗi cặp, cộng số cử tri xếp dự án này trên dự án kia.' },
      barter: { t: 'Hàng hóa', i: 'Dùng các quan hệ tương đương để tìm đáp án.', h: 'Nối các phép đổi lần lượt từng bước.' },
      timeline: { t: 'Hành trình một đời người', i: 'Sắp xếp các chặng đời chính của Hồ Chí Minh theo thứ tự.', h: 'Hãy nghĩ đến hành trình: ra đi, châu Âu, Moskva, châu Á, trở về.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ======================= ACADÉMIE DE MAGIE =======================
  // ---- Potion (déduction du nombre de gouttes) ----
  const PCOL = [T('rouge', 'red', 'đỏ'), T('jaune', 'yellow', 'vàng'), T('bleu', 'blue', 'xanh lam')];
  const RYB = [[1, 1, 1], [1, 0, 0], [1, 1, 0], [1, .5, 0], [.163, .373, .6], [.5, 0, .5], [0, .66, .2], [.2, .094, 0]];
  const ryb = ([r, y, b]) => { const m = Math.max(r, y, b) || 1; [r, y, b] = [r / m, y / m, b / m]; const o = [0, 0, 0];
    for (let i = 0; i < 8; i++) { const w = (i & 1 ? r : 1 - r) * (i & 2 ? y : 1 - y) * (i & 4 ? b : 1 - b); for (let k = 0; k < 3; k++) o[k] += w * RYB[i][k]; }
    return `rgb(${o.map(v => Math.round(v * 255)).join(',')})`; };
  const poOk = (s, c) => { const [a, b, d] = [s[c.x], s[c.y], s[c.z]];
    switch (c.t) { case 'tot': return s[0] + s[1] + s[2] === c.n; case 'diff': return a === b + c.k; case 'mul': return a === c.k * b; case 'sum': return a === b + d; case 'zero': return !a; case 'eq': return a === b; case 'gt': return a > b; default: return a === c.n; } };
  W.potion = {
    init(p) {
      const l = lv(), max = [5, 6, 7][l], all = [];
      for (let a = 0; a <= max; a++) for (let b = 0; b <= max; b++) for (let c = 0; c <= max; c++) all.push([a, b, c]);
      for (;;) {
        const s = l === 0 ? shuffle([1 + rand(4), 1 + rand(4), 0]) : [1 + rand(max), 1 + rand(max), 1 + rand(max)];
        if (s[0] + s[1] + s[2] < 4) continue;
        const pool = [{ t: 'tot', n: s[0] + s[1] + s[2] }];
        for (let x = 0; x < 3; x++) { if (!s[x]) pool.push({ t: 'zero', x }); pool.push({ t: 'val', x, n: s[x] });
          for (let y = 0; y < 3; y++) if (x !== y) { if (s[x] > s[y]) { pool.push({ t: 'diff', x, y, k: s[x] - s[y] }, { t: 'gt', x, y }); if (s[y] && s[x] % s[y] === 0 && s[x] / s[y] > 1) pool.push({ t: 'mul', x, y, k: s[x] / s[y] }); }
            if (s[x] === s[y] && x < y) pool.push({ t: 'eq', x, y }); const z = 3 - x - y; if (s[x] === s[y] + s[z] && y < z) pool.push({ t: 'sum', x, y, z }); } }
        const order = shuffle(pool).sort((a, b) => (a.t === 'val') - (b.t === 'val'));
        let cand = all, cl = [];
        for (const c of order) { const nx = cand.filter(v => poOk(v, c)); if (nx.length < cand.length) { cand = nx; cl.push(c); } if (cand.length === 1) break; }
        if (cand.length !== 1) continue;
        for (const c of shuffle(cl)) { const r = cl.filter(x => x !== c); if (all.filter(v => r.every(q => poOk(v, q))).length === 1) cl = r; }
        if (cl.filter(c => c.t === 'val').length > [1, 1, 0][l] || cl.length > 5) continue;
        p.sol = s; p.clues = shuffle(cl); p.cur = [0, 0, 0]; return;
      }
    },
    say(c) { const n = i => X(PCOL[i]);
      return tr({ tot: 'poTot', diff: 'poDiff', mul: 'poMul', sum: 'poSum', zero: 'poZero', eq: 'poEq', gt: 'poGt', val: 'poVal' }[c.t], { n: c.n, k: c.k, x: n(c.x), y: c.y != null ? n(c.y) : '', z: c.z != null ? n(c.z) : '' }); },
    render(p) {
      const col = p.cur.some(Boolean) ? ryb(p.cur) : '#2a3a2a';
      box().innerHTML = `<div class="stnotes potbook"><b>${tr('poBook')}</b><ul>${p.clues.map(c => `<li>${esc(W.potion.say(c))}</li>`).join('')}</ul></div>
        <div class="cauldron"><div class="brew" style="background:radial-gradient(circle at 40% 35%,#fff6,${col} 45%,#0008)"></div></div>
        <div class="row drops">${PCOL.map((c, i) => `<div class="drop d${i}"><b>${X(c)}</b><div><button class="btn" data-i="${i}" data-d="-1">−</button><span>${p.cur[i]}</span><button class="btn" data-i="${i}" data-d="1">+</button></div></div>`).join('')}</div>
        <div class="row"><button class="btn" id="poe">${tr('poEmpty')}</button><button class="btn gold" id="pog">${tr('poPour')}</button></div>`;
      box().querySelectorAll('.drops .btn').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.cur[i] = Math.max(0, Math.min(9, p.cur[i] + +b.dataset.d)); K.beep(500 + p.cur[i] * 60, .05, 'sine', .06); W.potion.render(p); }; });
      $('#poe').onclick = () => { p.cur = [0, 0, 0]; W.potion.render(p); };
      $('#pog').onclick = () => { if (p.cur.every((v, i) => v === p.sol[i])) { K.solve(p); return; } p.cur = [0, 0, 0]; W.potion.render(p); K.fail(tr('poBad')); };
    },
    hint(p) { const i = p.sol.findIndex(v => v > 0); return tr('poH', { n: p.sol[i], x: X(PCOL[i]) }); }
  };

  // ---- Miroir aux runes ----
  W.mrune = {
    init(p) {
      const l = lv(), g = [3, 4, 4][l], k = [4, 6, 8][l]; p.g = g; p.l = l;
      for (;;) {
        let cur = [rand(g), rand(g)], path = [cur], ok = true;
        for (let s = 0; s < k; s++) {
          const nb = []; for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const x = cur[0] + dx, y = cur[1] + dy; if ((dx || dy) && x >= 0 && y >= 0 && x < g && y < g && !path.some(q => q[0] === x && q[1] === y)) nb.push([x, y]); }
          if (!nb.length) { ok = false; break; } cur = nb[rand(nb.length)]; path.push(cur);
        }
        if (ok) { p.path = path; break; }
      }
      p.draw = [];
    },
    tf(p, [x, y]) { const g = p.g - 1; if (p.l === 0) return [g - x, y]; if (p.l === 1) return [x, g - y]; const [mx, my] = [g - x, y]; return [g - my, mx]; },
    segs: pts => new Set(pts.slice(1).map((q, i) => { const a = pts[i].join(','), b = q.join(','); return a < b ? a + '|' + b : b + '|' + a; })),
    svg(p, pts, click, hl) {
      const s = 60, pad = 30, n = p.g, sz = pad * 2 + s * (n - 1);
      let o = `<svg viewBox="0 0 ${sz} ${sz}" class="runesvg">`;
      if (pts.length > 1) o += `<polyline points="${pts.map(([x, y]) => `${pad + x * s},${pad + y * s}`).join(' ')}" class="rl"/>`;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) o += `<circle cx="${pad + x * s}" cy="${pad + y * s}" r="${click ? 13 : 8}" class="rd${hl && hl[0] === x && hl[1] === y ? ' hl' : ''}${click ? ' ck' : ''}" data-x="${x}" data-y="${y}"/>`;
      return o + '</svg>';
    },
    render(p) {
      const mir = p.path.map(q => W.mrune.tf(p, q)), end = p.path[0];
      box().innerHTML = `<p class="goal">${tr('mrT' + p.l)}</p><div class="runes"><div><small>${tr('mrMirror')}</small><div class="mirror">${W.mrune.svg(p, mir)}</div></div>
        <div><small>${tr('mrYou')}</small><div class="slate">${W.mrune.svg(p, p.draw, true, p.hl >= 2 ? end : null)}</div></div></div>
        <div class="row"><button class="btn" id="mrc">${tr('mrClear')}</button><button class="btn gold" id="ok">${K.tr('check')}</button></div>`;
      box().querySelectorAll('circle.ck').forEach(c => { c.onclick = () => {
        const q = [+c.dataset.x, +c.dataset.y], last = p.draw[p.draw.length - 1];
        if (last && (Math.max(Math.abs(last[0] - q[0]), Math.abs(last[1] - q[1])) !== 1)) return;
        if (p.draw.some(d => d[0] === q[0] && d[1] === q[1])) return;
        p.draw.push(q); K.beep(600 + p.draw.length * 50, .05, 'sine', .06); W.mrune.render(p);
      }; });
      $('#mrc').onclick = () => { p.draw = []; W.mrune.render(p); };
      $('#ok').onclick = () => { const a = W.mrune.segs(p.path), b = W.mrune.segs(p.draw); if (a.size === b.size && [...a].every(s => b.has(s))) { K.solve(p); return; } p.draw = []; W.mrune.render(p); K.fail(tr('mrBad')); };
    },
    hint: () => tr('mrH')
  };

  // ---- Engrenages de l'horloge ----
  const TEETH = [8, 10, 12, 15, 16, 20, 24, 30, 36, 40];
  W.gears = {
    init(p) {
      const l = lv(), n = [3, 4, 5][l];
      for (;;) {
        const el = [{ t: TEETH[rand(TEETH.length)], axle: false }];
        for (let i = 1; i < n; i++) el.push({ t: TEETH[rand(TEETH.length)], axle: l === 2 && i === 2 });
        if (l === 2 && el[2].t === el[1].t) continue;
        let num = 1, den = 1, sign = 1;
        for (let i = 1; i < n; i++) { if (el[i].axle) continue; num *= el[i - 1].t; den *= el[i].t; sign = -sign; const g = gcd(num, den); num /= g; den /= g; }
        const R = den * (1 + rand(2)); if (R > 40 || R < 2) continue; const out = R * num / den; if (out === R || out > 200) continue;
        p.el = el; p.R = R; p.out = out; p.dir = sign; p.meshes = el.filter((e, i) => i && !e.axle).length; p.ans = 0; return;
      }
    },
    render(p) {
      let x = 0; const pos = p.el.map((e, i) => { const r = 12 + e.t * 1.6; if (i) x += e.axle ? 0 : (12 + p.el[i - 1].t * 1.6) + r + 2; return { x, r }; });
      const W2 = x + pos[pos.length - 1].r + 20, Hh = 2 * Math.max(...pos.map(q => q.r)) + 40, cy = Hh / 2, x0 = pos[0].r + 10;
      const gear = (cx, r, t, k) => { let d = ''; for (let i = 0; i < t * 2; i++) { const a = i * Math.PI / t, rr2 = i % 2 ? r - 5 : r + 3; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr2).toFixed(1) + ',' + (cy + Math.sin(a) * rr2).toFixed(1); } return `<path d="${d}Z" class="gr g${k % 3}"/><circle cx="${cx}" cy="${cy}" r="4" fill="#222"/><text x="${cx}" y="${cy + 4}" class="gt">${t}</text>`; };
      box().innerHTML = `<p class="goal">${tr('gQ', { r: p.R })}</p><div class="gearbox"><svg viewBox="0 0 ${W2 + x0} ${Hh}">${p.el.map((e, i) => gear(x0 + pos[i].x + (e.axle ? 0 : 0), e.axle ? pos[i].r * .9 : pos[i].r, e.t, i)).join('')}${p.el.map((e, i) => e.axle ? `<text x="${x0 + pos[i].x}" y="${Hh - 4}" class="gt ax">${tr('gAxle')}</text>` : '').join('')}</svg></div>
        <div class="row"><button class="btn gdir${p.ans === 1 ? ' on' : ''}" data-d="1">${tr('gCW')}</button><button class="btn gdir${p.ans === -1 ? ' on' : ''}" data-d="-1">${tr('gCCW')}</button></div>`;
      box().querySelectorAll('.gdir').forEach(b => { b.onclick = () => { p.ans = +b.dataset.d; box().querySelectorAll('.gdir').forEach(o => o.classList.toggle('on', o === b)); }; });
      answer(p, v => { if (!p.ans) { $('#fb').textContent = tr('gDir'); return false; } return +v.trim() === p.out && p.ans === p.dir; }, true);
    },
    hint: p => tr('gH', { m: p.meshes, d: tr(p.dir > 0 ? 'gCW' : 'gCCW') })
  };

  // ---- Chiffre de Vigenère ----
  const VW = { fr: [['CHAUDRON', 'GRIMOIRE', 'CHOUETTE', 'LICORNE', 'DRAGON'], ['ETOILE FILANTE', 'PLUME DORE', 'LUNE NOIRE'], ['LA CLE EST SOUS LE HIBOU', 'CHERCHE LA TOUR DU NORD']],
    en: [['CAULDRON', 'SPELLBOOK', 'UNICORN', 'DRAGON', 'LANTERN'], ['SHOOTING STAR', 'GOLDEN QUILL', 'BLACK MOON'], ['THE KEY IS UNDER THE OWL', 'SEEK THE NORTH TOWER']],
    vi: [['PHUTHUY', 'KYLAN', 'RONGLUA', 'CUDEM', 'DUAPHEP'], ['SAO BANG', 'LONG VANG', 'TRANG DEN'], ['CHIA KHOA DUOI CON CU', 'TIM THAP PHIA BAC']] };
  const KEYS = [['OR', 'LUNE', 'MAGE'], ['SORT', 'RUNE', 'ASTRE'], ['BRUME', 'ORACLE', 'NEBULA']];
  W.vigenere = {
    init(p) { const l = lv(); p.l = l; p.key = KEYS[l][rand(3)]; p.wi = rand(VW.fr[l].length); },
    plain: p => VW[K.lang] ? VW[K.lang][p.l][p.wi % VW[K.lang][p.l].length] : VW.fr[p.l][p.wi],
    enc(p) { let k = 0; return [...W.vigenere.plain(p)].map(ch => ch === ' ' ? ' ' : String.fromCharCode(65 + (ch.charCodeAt(0) - 65 + p.key.charCodeAt(k++ % p.key.length) - 65) % 26)).join(''); },
    render(p) {
      box().innerHTML = `<div class="cipher">${esc(W.vigenere.enc(p))}</div><p class="goal">🪄 ${tr('vgKey', { k: `<b>${p.key}</b>` })}</p><p class="cnt">${tr('vgAid')}</p>
        <div class="abc">${Array.from({ length: 26 }, (_, i) => `<span><b>${String.fromCharCode(65 + i)}</b><small>${i}</small></span>`).join('')}</div>`;
      answer(p, v => K.norm(v).replace(/\s/g, '') === W.vigenere.plain(p).replace(/\s/g, ''));
    },
    hint: p => tr('vgH', { x: W.vigenere.plain(p)[0] })
  };

  // ---- Cartes du ciel (rotation mentale) ----
  const canon = pts => { const mx = Math.min(...pts.map(q => q[0])), my = Math.min(...pts.map(q => q[1])); return pts.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const key = pts => canon(pts).map(q => q.join(',')).join(';');
  const rot = pts => pts.map(([x, y]) => [y, -x]), mir = pts => pts.map(([x, y]) => [-x, y]);
  const rots = pts => { const o = [pts]; for (let i = 0; i < 3; i++) o.push(rot(o[o.length - 1])); return o; };
  W.rotmatch = {
    init(p) { const l = lv(); p.rounds = [1, 2, 3][l]; p.r = 0; p.k = [5, 6, 8][l]; W.rotmatch.gen(p); },
    gen(p) {
      for (;;) {
        let pts = [[0, 0]]; while (pts.length < p.k) { const b = pts[rand(pts.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][rand(4)], q = [b[0] + d[0], b[1] + d[1]]; if (!pts.some(z => z[0] === q[0] && z[1] === q[1])) pts.push(q); }
        const R4 = rots(pts).map(key), M4 = rots(mir(pts)).map(key); if (M4.some(m => R4.includes(m)) || new Set(R4).size < 4) continue;
        const turn = 1 + rand(3), good = rots(pts)[turn], cands = [{ pts: good, ok: true }], seen = new Set(R4);
        const add = q => { const kq = key(q); if (seen.has(kq)) return false; rots(q).forEach(z => seen.add(key(z))); cands.push({ pts: q, ok: false }); return true; };
        add(rots(mir(pts))[rand(4)]);
        for (let tries = 0; cands.length < 4 && tries < 200; tries++) {
          const base = rots(lv() === 2 ? mir(pts) : pts)[rand(4)].map(q => q.slice()), i = rand(base.length), b = base[rand(base.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][rand(4)], q = [b[0] + d[0], b[1] + d[1]];
          if (base.some(z => z[0] === q[0] && z[1] === q[1])) continue; base[i] = q;
          const conn = new Set(['0']), st = [0]; while (st.length) { const a = base[st.pop()]; base.forEach((z, j) => { if (!conn.has(String(j)) && Math.abs(z[0] - a[0]) + Math.abs(z[1] - a[1]) === 1) { conn.add(String(j)); st.push(j); } }); }
          if (conn.size === base.length) add(base);
        }
        if (cands.length < 4) continue;
        p.target = pts; p.turn = turn * 90; p.cands = shuffle(cands); return;
      }
    },
    grid(pts) { const c = canon(pts), w = Math.max(...c.map(q => q[0])) + 1, h = Math.max(...c.map(q => q[1])) + 1, set = new Set(c.map(q => q.join(',')));
      return `<div class="sky" style="grid-template-columns:repeat(${w},1fr);aspect-ratio:${w}/${h}">${Array.from({ length: w * h }, (_, i) => `<i>${set.has(`${i % w},${Math.floor(i / w)}`) ? '★' : ''}</i>`).join('')}</div>`; },
    render(p) {
      box().innerHTML = `<p class="cnt">${tr('rmRound', { n: p.r + 1, m: p.rounds })}</p><div class="skyt">${W.rotmatch.grid(p.target)}</div><p class="goal">${tr('rmQ')}</p>
        <div class="skyc">${p.cands.map((c, i) => `<button class="skyb" data-i="${i}">${W.rotmatch.grid(c.pts)}</button>`).join('')}</div>`;
      box().querySelectorAll('.skyb').forEach(b => { b.onclick = () => {
        if (!p.cands[+b.dataset.i].ok) { W.rotmatch.gen(p); W.rotmatch.render(p); K.fail(tr('rmBad')); return; }
        K.beep(880, .1, 'triangle', .08); if (++p.r >= p.rounds) { K.solve(p); return; } W.rotmatch.gen(p); W.rotmatch.render(p);
      }; });
    },
    hint: p => tr('rmH', { x: p.turn })
  };

  // ---- Course de balais ----
  W.broom = {
    init(p) { const l = lv(); p.L = [3, 4, 5][l]; p.need = [8, 10, 12][l]; p.lives0 = [3, 2, 2][l]; p.spawn = [950, 780, 640][l]; p.v = [1.6, 2, 2.4][l]; },
    render(p) {
      clearInterval(p.iv); p.on = false; p.lane = Math.floor(p.L / 2); p.obj = []; p.got = 0; p.lives = p.lives0;
      box().innerHTML = `<div class="sky2" id="brf" style="--n:${p.L}"><span class="brm" id="brm">🧹</span></div><p class="cnt" id="brs">${tr('brScore', { n: 0, m: p.need })} · ${tr('brLives', { n: p.lives })}</p><p class="cnt">${tr('brKeys')}</p>
        <div class="row"><button class="btn" id="brl">←</button><button class="btn gold" id="brg">${tr('brGo')}</button><button class="btn" id="brr">→</button></div>`;
      const f = $('#brf'), place = () => { const m = $('#brm'); if (m) m.style.left = `${(p.lane + .5) * 100 / p.L}%`; };
      const mv = d => { p.lane = Math.max(0, Math.min(p.L - 1, p.lane + d)); place(); };
      place(); $('#brl').onclick = () => mv(-1); $('#brr').onclick = () => mv(1);
      const key = e => { if (!f.isConnected) { document.removeEventListener('keydown', key); return; } if (e.key === 'ArrowLeft') { mv(-1); e.preventDefault(); } if (e.key === 'ArrowRight') { mv(1); e.preventDefault(); } };
      document.addEventListener('keydown', key);
      $('#brg').onclick = () => {
        if (p.on) return; p.on = true; $('#brg').disabled = true; let last = 0;
        p.iv = setInterval(() => {
          if (!f.isConnected) { clearInterval(p.iv); document.removeEventListener('keydown', key); return; }
          const now = performance.now();
          if (now - last > p.spawn) { last = now; const el = document.createElement('span'), hoop = Math.random() < .55; el.className = 'bro'; el.textContent = hoop ? '💫' : '🪨'; f.appendChild(el); p.obj.push({ lane: rand(p.L), y: -8, hoop, el }); }
          p.obj.forEach(o => { o.y += p.v; o.el.style.left = `${(o.lane + .5) * 100 / p.L}%`; o.el.style.top = o.y + '%'; });
          p.obj = p.obj.filter(o => {
            if (o.y >= 80 && o.y < 92 && o.lane === p.lane) { o.el.remove(); if (o.hoop) { p.got++; K.beep(880 + p.got * 30, .06, 'triangle', .07); } else { p.lives--; K.beep(120, .25, 'sawtooth', .08); } return false; }
            if (o.y > 105) { o.el.remove(); return false; } return true;
          });
          $('#brs').textContent = `${tr('brScore', { n: p.got, m: p.need })} · ${tr('brLives', { n: p.lives })}`;
          if (p.lives <= 0) { clearInterval(p.iv); document.removeEventListener('keydown', key); W.broom.render(p); K.fail(tr('brLost')); return; }
          if (p.got >= p.need) { clearInterval(p.iv); document.removeEventListener('keydown', key); p.on = false; setTimeout(() => K.solve(p), 300); }
        }, 40);
      };
    },
    onHint2(p) { p.v *= .8; },
    hint: () => tr('brH')
  };

  // ======================= LA FAMILLE (mafia) =======================
  const HATS = [T('noir', 'black', 'đen'), T('gris', 'grey', 'xám'), T('brun', 'brown', 'nâu')];
  const ACCS = [T('une canne', 'a cane', 'gậy'), T('des gants blancs', 'white gloves', 'găng tay trắng'), T('un cigare', 'a cigar', 'xì gà')];
  const SUSP = ['Tony Bellini', 'Rosa Marchetti', 'Sal Greco', 'Vito Russo', 'Lucia Ferri'];
  const HOURS = ['20 h', '21 h', '22 h', '23 h'];
  const PLACES = [T('au port', 'at the harbour', 'ở bến cảng'), T('au casino', 'at the casino', 'ở sòng bạc'), T('à la boulangerie', 'at the bakery', 'ở tiệm bánh'), T('à l’église', 'at the church', 'ở nhà thờ'), T('à la gare', 'at the station', 'ở nhà ga')];
  W.alibi = {
    init(p) {
      const l = lv(), n = [3, 4, 5][l], nt = [3, 3, 4][l], np = [3, 4, 5][l];
      for (let tries = 0; ; tries++) {
        const tr2 = shuffle([...Array(9).keys()]).slice(0, n).map(k => [Math.floor(k / 3), k % 3]);
        const truth = Array.from({ length: n }, () => Array.from({ length: nt }, () => rand(np)));
        const c = rand(n), tc = rand(nt), pc = truth[c][tc];
        if (truth.some((r, s) => s !== c && r[tc] === pc)) continue;
        const claim = truth.map(r => r.slice()); let alt; do alt = rand(np); while (alt === pc); claim[c][tc] = alt;
        if (l > 0) { const t2 = (tc + 1 + rand(nt - 1)) % nt; let a2; do a2 = rand(np); while (a2 === truth[c][t2]); claim[c][t2] = a2; }
        const sub = (s, both) => { const [h, a] = tr2[s]; if (both) return { h, a }; return rand(2) ? { h } : { a }; };
        const seen = [{ t: tc, p: pc, ...sub(c, l === 0) }];
        const match = (s, sg) => (sg.h == null || tr2[s][0] === sg.h) && (sg.a == null || tr2[s][1] === sg.a);
        const consistent = h => claim[h][tc] !== pc && seen.every(sg => truth.some((_, s) => match(s, sg) && (s === h || claim[s][sg.t] === sg.p)));
        let cnt = 0;
        while (cnt++ < 14) {
          const ok = [...Array(n).keys()].filter(consistent); if (ok.length === 1 && ok[0] === c) break;
          const s = rand(n), t = rand(nt); seen.push({ t, p: truth[s][t], ...sub(s, l === 0 && rand(2)) });
        }
        while (seen.length < 3) { const s = rand(n), t = rand(nt); seen.push({ t, p: truth[s][t], ...sub(s, l === 0) }); }
        const ok = [...Array(n).keys()].filter(consistent);
        if (ok.length !== 1 || ok[0] !== c || seen.length > [6, 8, 9][l]) continue;
        Object.assign(p, { n, nt, traits: tr2, claim, c, tc, pc, seen: shuffle(seen) }); return;
      }
    },
    desc(sg) { const d = []; if (sg.h != null) d.push(tr('alHat', { x: X(HATS[sg.h]) })); if (sg.a != null) d.push(tr('alAcc', { x: X(ACCS[sg.a]) })); return d.join(', '); },
    render(p) {
      box().innerHTML = `<p class="goal">🔫 ${tr('alCrime', { t: HOURS[p.tc], p: X(PLACES[p.pc]) })}</p>
        <div class="altab"><b>${tr('alClaims')}</b><table><tr><th></th>${HOURS.slice(0, p.nt).map(h => `<th>${h}</th>`).join('')}</tr>${p.claim.map((r, s) => `<tr><th>${SUSP[s]}<small>🎩 ${X(HATS[p.traits[s][0]])} · ${X(ACCS[p.traits[s][1]])}</small></th>${r.map(pl => `<td>${X(PLACES[pl])}</td>`).join('')}</tr>`).join('')}</table></div>
        <div class="stnotes"><b>${tr('alSeen')}</b><ul>${p.seen.map(sg => `<li>${esc(tr('alAt', { t: HOURS[sg.t], p: X(PLACES[sg.p]), d: W.alibi.desc(sg) }))}</li>`).join('')}</ul></div>
        <p class="goal">${tr('alWho')}</p><div class="row">${SUSP.slice(0, p.n).map((s, i) => `<button class="btn alw" data-i="${i}">${s}</button>`).join('')}</div>`;
      box().querySelectorAll('.alw').forEach(b => { b.onclick = () => { if (+b.dataset.i === p.c) K.solve(p); else { W.alibi.init(p); W.alibi.render(p); K.fail(); } }; });
    },
    hint: p => tr('alH', { d: W.alibi.desc(p.seen.find(s => s.t === p.tc && s.p === p.pc)) })
  };

  // ---- Livre de comptes ----
  const LBL = [T('Livraison de farine', 'Flour delivery', 'Giao bột mì'), T('Recette du casino', 'Casino takings', 'Thu từ sòng bạc'), T('Salaire des chauffeurs', 'Drivers’ wages', 'Lương tài xế'), T('Location de l’entrepôt', 'Warehouse rent', 'Thuê kho'), T('« Dons » du quartier', 'Neighbourhood “gifts”', '« Quà » của khu phố'), T('Réparation du camion', 'Truck repair', 'Sửa xe tải'), T('Vente de caisses', 'Crate sales', 'Bán thùng hàng'), T('Pot-de-vin', 'Bribe', 'Tiền hối lộ'), T('Facture d’électricité', 'Electricity bill', 'Hóa đơn điện'), T('Recette du bar', 'Bar takings', 'Thu từ quán rượu')];
  W.ledger = {
    init(p) {
      const l = lv(), n = [6, 8, 10][l], cents = l === 2; let bal = 1000 + rand(4000) * (cents ? 1 : 1);
      p.rows = []; const lbls = shuffle(LBL);
      for (let i = 0; i < n; i++) { const amt = cents ? Math.round((20 + Math.random() * 900) * 100) / 100 : (2 + rand(90)) * 10, inn = rand(2) === 0; bal = Math.round((bal + (inn ? amt : -amt)) * 100) / 100; p.rows.push({ d: `1931-03-${String(2 + i * 3).padStart(2, '0')}`, l: lbls[i % lbls.length], i: inn ? amt : 0, o: inn ? 0 : amt, b: bal }); }
      p.bad = 1 + rand(n - 1); const r = p.rows[p.bad], delta = (cents ? Math.round((5 + Math.random() * 90) * 100) / 100 : (1 + rand(9)) * 10) * (rand(2) ? 1 : -1);
      if (r.i) r.i = Math.max(1, Math.round((r.i + delta) * 100) / 100); else r.o = Math.max(1, Math.round((r.o + delta) * 100) / 100);
      p.start = Math.round((p.rows[0].b - p.rows[0].i + p.rows[0].o) * 100) / 100;
    },
    render(p) {
      const f = v => v ? v.toLocaleString(K.lang === 'en' ? 'en-US' : 'fr-CA', { minimumFractionDigits: lv() === 2 ? 2 : 0 }) : '';
      const c = tr('lgCols').split('|');
      box().innerHTML = `<p class="goal">${tr('lgQ')}</p><table class="ledger"><tr>${c.map(h => `<th>${h}</th>`).join('')}</tr><tr class="st"><td></td><td>—</td><td></td><td></td><td>${f(p.start)}</td></tr>
        ${p.rows.map((r, i) => `<tr class="lgr" data-i="${i}"><td>${r.d}</td><td>${esc(X(r.l))}</td><td>${f(r.i)}</td><td>${f(r.o)}</td><td>${f(r.b)}</td></tr>`).join('')}</table>`;
      box().querySelectorAll('.lgr').forEach(b => { b.onclick = () => { if (+b.dataset.i === p.bad) K.solve(p); else { b.classList.add('no'); K.fail(); } }; });
    },
    hint: p => tr('lgH', { n: p.bad })
  };

  // ---- Poker ----
  const HN = { fr: ['Carte haute', 'Paire', 'Double paire', 'Brelan', 'Quinte', 'Couleur', 'Full', 'Carré', 'Quinte flush'], en: ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'], vi: ['Mậu thầu', 'Đôi', 'Thú', 'Sám cô', 'Sảnh', 'Thùng', 'Cù lũ', 'Tứ quý', 'Thùng phá sảnh'] };
  const hn = () => HN[K.lang] || HN.fr;
  function evalHand(cards) {
    const r = cards.map(c => c % 13 + 2).sort((a, b) => b - a), s = cards.map(c => Math.floor(c / 13)), cnt = {};
    r.forEach(x => { cnt[x] = (cnt[x] || 0) + 1; });
    const g = Object.entries(cnt).map(([v, c]) => [c, +v]).sort((a, b) => b[0] - a[0] || b[1] - a[1]), ord = g.map(x => x[1]);
    const flush = s.every(x => x === s[0]), uniq = g.length === 5, wheel = uniq && r[0] === 14 && r[1] === 5, straight = uniq && (r[0] - r[4] === 4 || wheel), top = wheel ? 5 : r[0];
    if (straight && flush) return [8, top]; if (g[0][0] === 4) return [7, ...ord]; if (g[0][0] === 3 && g[1][0] === 2) return [6, ...ord];
    if (flush) return [5, ...r]; if (straight) return [4, top]; if (g[0][0] === 3) return [3, ...ord]; if (g[0][0] === 2 && g[1][0] === 2) return [2, ...ord]; if (g[0][0] === 2) return [1, ...ord]; return [0, ...r];
  }
  const cmp = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0); } return 0; };
  const PLAY = ['Tony', 'Rosa', 'Sal', 'Vito'];
  W.poker = {
    init(p) {
      const l = lv(), n = [3, 4, 4][l];
      for (;;) {
        const deck = shuffle([...Array(52).keys()]), hands = Array.from({ length: n }, (_, i) => deck.slice(i * 5, i * 5 + 5)), ev = hands.map(evalHand);
        const ord = ev.map((e, i) => i).sort((a, b) => cmp(ev[b], ev[a]));
        if (cmp(ev[ord[0]], ev[ord[1]]) === 0) continue;
        if (l === 0 && new Set(ev.map(e => e[0])).size < n) continue;
        if (l === 2 && ev[ord[0]][0] !== ev[ord[1]][0]) continue;
        if (l === 2 && ev[ord[0]][0] < 1) continue;
        p.hands = hands; p.win = ord[0]; p.cat = ev[ord[0]][0]; return;
      }
    },
    card(c) { const v = c % 13 + 2, s = Math.floor(c / 13), sym = '♠♥♦♣'[s], name = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }[v] || v; return `<span class="pc${s === 1 || s === 2 ? ' red' : ''}">${name}<i>${sym}</i></span>`; },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('pkQ')}</p><div class="pkt">${p.hands.map((h, i) => `<button class="pkh" data-i="${i}"><b>${PLAY[i]}</b><div>${h.slice().sort((a, b) => b % 13 - a % 13).map(W.poker.card).join('')}</div></button>`).join('')}</div>
        <p class="cnt">${tr('pkRank')} ${hn().join(' < ')}</p>`;
      box().querySelectorAll('.pkh').forEach(b => { b.onclick = () => { if (+b.dataset.i === p.win) K.solve(p); else { W.poker.init(p); W.poker.render(p); K.fail(); } }; });
    },
    hint: p => tr('pkH', { x: hn()[p.cat] })
  };

  // ---- Téléphone à cadran ----
  W.rotary = {
    init(p) { const l = lv(); p.num = Array.from({ length: [3, 4, 5][l] }, () => rand(10)).join(''); p.gap = [190, 150, 115][l]; p.pause = [950, 750, 560][l]; },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('roQ')}</p><div class="phone"><span id="rolamp">☎️</span></div><div class="row"><button class="btn" id="ropl">${tr('roPlay')}</button></div>`;
      $('#ropl').onclick = () => {
        $('#ropl').disabled = true; let at = 300;
        [...p.num].forEach(d => { const k = +d || 10; for (let i = 0; i < k; i++) { const t0 = at; setTimeout(() => { const l = $('#rolamp'); if (!l) return; l.classList.add('on'); K.beep(1400, .025, 'square', .08); setTimeout(() => l.classList.remove('on'), p.gap * .45); }, t0); at += p.gap; } at += p.pause; });
        setTimeout(() => { const b = $('#ropl'); if (b) b.disabled = false; }, at);
      };
      answer(p, v => v.replace(/\D/g, '') === p.num, true);
    },
    hint: p => tr('roH', { x: p.num[0] })
  };

  // ---- Partage des quartiers (shikaku) ----
  W.shikaku = {
    init(p) {
      const l = lv(), n = [5, 6, 7][l], maxA = [6, 8, 9][l]; p.n = n;
      for (;;) {
        const own = Array(n * n).fill(-1), rects = []; let bad = false;
        for (let i = 0; i < n * n && !bad; i++) {
          if (own[i] >= 0) continue; const r0 = Math.floor(i / n), c0 = i % n, opts = [];
          for (let h = 1; r0 + h <= n; h++) for (let w = 1; c0 + w <= n; w++) { if (w * h > maxA) continue; let free = true; for (let r = r0; r < r0 + h && free; r++) for (let c = c0; c < c0 + w; c++) if (own[r * n + c] >= 0) { free = false; break; } if (free && w * h >= 2) opts.push([w, h]); }
          if (!opts.length) { bad = true; break; }
          opts.sort((a, b) => b[0] * b[1] - a[0] * a[1]); const [w, h] = opts[rand(Math.min(4, opts.length))];
          for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) own[r * n + c] = rects.length;
          rects.push({ r: r0, c: c0, w, h, num: (r0 + rand(h)) * n + c0 + rand(w) });
        }
        if (bad) continue; p.sol = rects; p.nums = {}; rects.forEach(R => { p.nums[R.num] = R.w * R.h; }); break;
      }
      p.mine = []; p.start = null;
    },
    owner: (p, i) => p.mine.findIndex(R => { const r = Math.floor(i / p.n), c = i % p.n; return r >= R.r && r < R.r + R.h && c >= R.c && c < R.c + R.w; }),
    render(p) {
      const n = p.n;
      box().innerHTML = `<p class="goal">${tr('skQ')}</p><div class="shk" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => { const o = W.shikaku.owner(p, i); return `<button class="skc${o >= 0 ? ' r' + (o % 6) : ''}${p.start === i ? ' st' : ''}" data-i="${i}">${p.nums[i] || ''}</button>`; }).join('')}</div>
        <div class="row"><button class="btn" id="skr">↺ ${K.tr('reset')}</button><button class="btn gold" id="ok">${K.tr('check')}</button></div>`;
      box().querySelectorAll('.skc').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i, o = W.shikaku.owner(p, i);
        if (p.start == null) { if (o >= 0) { p.mine.splice(o, 1); W.shikaku.render(p); return; } p.start = i; W.shikaku.render(p); return; }
        const a = p.start, R = { r: Math.min(Math.floor(a / n), Math.floor(i / n)), c: Math.min(a % n, i % n) }; R.h = Math.abs(Math.floor(a / n) - Math.floor(i / n)) + 1; R.w = Math.abs(a % n - i % n) + 1; p.start = null;
        for (let r = R.r; r < R.r + R.h; r++) for (let c = R.c; c < R.c + R.w; c++) if (W.shikaku.owner(p, r * n + c) >= 0) { W.shikaku.render(p); return; }
        p.mine.push(R); K.beep(520, .04, 'triangle', .05); W.shikaku.render(p);
      }; });
      $('#skr').onclick = () => { p.mine = []; p.start = null; W.shikaku.render(p); };
      $('#ok').onclick = () => {
        if (p.mine.reduce((s, R) => s + R.w * R.h, 0) < n * n) { $('#fb').textContent = tr('skFull'); return; }
        const ok = p.mine.every(R => { const ns = Object.keys(p.nums).map(Number).filter(i => { const r = Math.floor(i / n), c = i % n; return r >= R.r && r < R.r + R.h && c >= R.c && c < R.c + R.w; }); return ns.length === 1 && p.nums[ns[0]] === R.w * R.h; });
        if (ok) K.solve(p); else K.fail(tr('skBad'));
      };
    },
    hint(p) { const R = p.sol[0]; return tr('skH', { n: R.w * R.h, w: R.w, h: R.h }); }
  };

  // ---- Contrebande (sac à dos) ----
  const CRATES = ['🥃', '🍷', '☕', '🚬', '🧀', '💎', '🎻', '📻'];
  W.knap = {
    init(p) {
      const l = lv(), k = [5, 6, 7][l];
      p.items = Array.from({ length: k }, (_, i) => ({ e: CRATES[i], w: 2 + rand([8, 12, 15][l]), v: 5 + rand(40) * 5 }));
      const tot = p.items.reduce((s, x) => s + x.w, 0); p.cap = Math.round(tot * (.4 + Math.random() * .15));
      const dp = Array(p.cap + 1).fill(0); p.items.forEach(x => { for (let c = p.cap; c >= x.w; c--) dp[c] = Math.max(dp[c], dp[c - x.w] + x.v); }); p.best = dp[p.cap]; p.sel = new Set();
    },
    render(p) {
      const w = [...p.sel].reduce((s, i) => s + p.items[i].w, 0), v = [...p.sel].reduce((s, i) => s + p.items[i].v, 0);
      box().innerHTML = `<p class="goal">${tr('knQ', { c: p.cap })}</p><div class="crates">${p.items.map((x, i) => `<button class="crate${p.sel.has(i) ? ' on' : ''}" data-i="${i}"><span>${x.e}</span><b>${x.w} kg</b><small>${x.v} $</small></button>`).join('')}</div>
        <p class="cnt">${tr('knTot', { w, c: p.cap, v })}</p><div class="row"><button class="btn gold" id="kng">${tr('knGo')}</button></div>`;
      box().querySelectorAll('.crate').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.sel.has(i) ? p.sel.delete(i) : p.sel.add(i); K.beep(400, .04, 'triangle', .05); W.knap.render(p); }; });
      $('#kng').onclick = () => { if (w > p.cap) { K.fail(tr('knOver')); return; } if (v === p.best) { K.solve(p); return; } K.fail(tr('knLow')); };
    },
    hint: p => tr('knH', { v: p.best })
  };

  // ======================= L'AGORA DU TEMPS =======================
  // ---- Syllogismes de Socrate ----
  const TERMS = [[T('Grecs', 'Greeks', 'người Hy Lạp'), T('Grec', 'Greek', '')], [T('philosophes', 'philosophers', 'triết gia'), T('philosophe', 'philosopher', '')], [T('sages', 'wise people', 'người hiền'), T('sage', 'wise', '')], [T('mortels', 'mortals', 'kẻ phàm trần'), T('mortel', 'mortal', '')], [T('poètes', 'poets', 'nhà thơ'), T('poète', 'poet', '')], [T('citoyens', 'citizens', 'công dân'), T('citoyen', 'citizen', '')], [T('musiciens', 'musicians', 'nhạc sĩ'), T('musicien', 'musician', '')]];
  const syTrue = (st, m) => { const has = r => m & (1 << r), regs = [...Array(8).keys()], inA = (r, x) => r & (1 << x);
    switch (st.t) { case 'A': return !regs.some(r => has(r) && inA(r, st.x) && !inA(r, st.y)); case 'E': return !regs.some(r => has(r) && inA(r, st.x) && inA(r, st.y)); case 'I': return regs.some(r => has(r) && inA(r, st.x) && inA(r, st.y)); default: return regs.some(r => has(r) && inA(r, st.x) && !inA(r, st.y)); } };
  W.syllog = {
    init(p) { const l = lv(); p.rounds = [1, 2, 3][l]; p.r = 0; W.syllog.gen(p); },
    gen(p) {
      const l = lv(), types = l === 0 ? ['A', 'E', 'I'] : ['A', 'E', 'I', 'O'];
      for (;;) {
        p.terms = shuffle(TERMS).slice(0, 3);
        const st = (a, b) => { const t = types[rand(types.length)]; return (t === 'E' || t === 'I') && rand(2) ? { t, x: b, y: a } : { t, x: a, y: b }; };
        p.prem = [st(0, 1), st(1, 2)];
        const models = []; for (let m = 1; m < 256; m++) if (p.prem.every(s => syTrue(s, m))) models.push(m);
        if (!models.length) continue;
        const all = []; ['A', 'E', 'I', 'O'].forEach(t => { all.push({ t, x: 0, y: 2 }, { t, x: 2, y: 0 }); });
        all.forEach(c => { c.v = models.every(m => syTrue(c, m)); });
        const val = all.filter(c => c.v), inv = all.filter(c => !c.v);
        if (!val.length || inv.length < 2) continue;
        p.cands = shuffle([...shuffle(val).slice(0, 1 + rand(Math.min(2, val.length))), ...shuffle(inv)]).slice(0, 4);
        if (!p.cands.some(c => c.v)) continue; p.ans = p.cands.map(() => 0); return;
      }
    },
    say(p, s) { const t = i => X(p.terms[i][0]), ts = i => X(p.terms[i][1]);
      if (s.t === 'E' && K.lang === 'fr') return tr('syNo', { xs: ts(s.x), ys: ts(s.y) });
      return tr({ A: 'syAll2', E: 'syNo', I: 'sySome', O: 'syNot' }[s.t], { x: t(s.x), y: t(s.y) }); },
    render(p) {
      box().innerHTML = `<p class="cnt">${tr('syRound', { n: p.r + 1, m: p.rounds })}</p><div class="prem">${p.prem.map(s => `<p>« ${esc(W.syllog.say(p, s))} »</p>`).join('')}</div><p class="goal">${tr('syQ')}</p>
        <div class="concl">${p.cands.map((c, i) => `<div><span>${esc(W.syllog.say(p, c))}</span><button class="btn syb${p.ans[i] === 1 ? ' y' : p.ans[i] === -1 ? ' n' : ''}" data-i="${i}">${p.ans[i] === 1 ? tr('syY') : p.ans[i] === -1 ? tr('syN') : tr('syU')}</button></div>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${K.tr('check')}</button></div>`;
      box().querySelectorAll('.syb').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.ans[i] = p.ans[i] === 1 ? -1 : 1; W.syllog.render(p); }; });
      $('#ok').onclick = () => {
        if (p.ans.includes(0)) { $('#fb').textContent = tr('syAll'); return; }
        if (!p.cands.every((c, i) => (p.ans[i] === 1) === c.v)) { W.syllog.gen(p); W.syllog.render(p); K.fail(); return; }
        K.beep(880, .1, 'triangle', .08); if (++p.r >= p.rounds) { K.solve(p); return; } W.syllog.gen(p); W.syllog.render(p);
      };
    },
    hint: p => tr('syH', { x: W.syllog.say(p, p.cands.find(c => c.v)) })
  };

  // ---- Solides de Platon (relation d'Euler) ----
  const SOL = [[T('Le tétraèdre', 'The tetrahedron', 'Khối tứ diện'), 4, 6, 4], [T('Le cube', 'The cube', 'Khối lập phương'), 8, 12, 6], [T('L’octaèdre', 'The octahedron', 'Khối bát diện'), 6, 12, 8], [T('Le dodécaèdre', 'The dodecahedron', 'Khối mười hai mặt'), 20, 30, 12], [T('L’icosaèdre', 'The icosahedron', 'Khối hai mươi mặt'), 12, 30, 20]];
  const EXO = [[12, 18, 8], [12, 24, 14], [24, 36, 14], [60, 90, 32], [30, 60, 32], [24, 48, 26], [16, 32, 18], [14, 21, 9], [18, 27, 11]];
  W.euler = {
    init(p) { const l = lv(); p.rounds = [2, 3, 3][l]; p.r = 0; W.euler.gen(p); },
    gen(p) { const l = lv(); if (l === 0 || (l === 1 && rand(2))) { const s = SOL[rand(5)]; p.name = s[0]; p.v = s.slice(1); } else { p.name = null; p.v = EXO[rand(EXO.length)]; } p.ask = l === 0 ? 1 : rand(3); },
    render(p) {
      const keys = ['euV', 'euE', 'euF'], given = [0, 1, 2].filter(i => i !== p.ask).map(i => `${p.v[i]} ${tr(keys[i])}`).join(K.lang === 'en' ? ' and ' : K.lang === 'vi' ? ' và ' : ' et ');
      box().innerHTML = `<p class="cnt">${tr('euRound', { n: p.r + 1, m: p.rounds })}</p><div class="solid">${['🔺', '🧊', '💠', '⚽', '🔷'][p.r % 5]}</div><p class="goal">${tr('euQ', { s: p.name ? X(p.name) : tr('euAnon'), a: given, x: tr(keys[p.ask]) })}</p>`;
      box().insertAdjacentHTML('beforeend', K.inputRow('number'));
      const inp = $('#ans'), go = () => { if (!inp.value.trim()) return; if (+inp.value === p.v[p.ask]) { K.beep(880, .1, 'triangle', .08); if (++p.r >= p.rounds) { K.solve(p); return; } W.euler.gen(p); W.euler.render(p); } else { K.fail(); inp.select(); } };
      $('#ok').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); }; inp.focus();
    },
    hint: () => tr('euH')
  };

  // ---- Repère de Descartes ----
  W.cartesian = {
    init(p) {
      const l = lv(); p.l = l; p.d = rand(10); const bm = DIG5[p.d]; p.pts = [];
      bm.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '1') p.pts.push(l === 0 ? [c + 1, 5 - r] : [c - 2, 2 - r]); }));
      p.dx = l === 2 ? 1 + rand(3) : 0; p.dy = l === 2 ? -(1 + rand(3)) : 0; p.list = shuffle(p.pts).map(([x, y]) => [x + p.dx, y + p.dy]); p.mark = new Set();
    },
    render(p) {
      const lo = p.l === 0 ? 0 : -3, hi = p.l === 0 ? 6 : 3, N = hi - lo + 1, sep = K.lang === 'en' ? ', ' : ' ; ';
      let cells = ''; for (let y = hi; y >= lo; y--) for (let x = lo; x <= hi; x++) cells += `<button class="cpt${p.mark.has(x + ',' + y) ? ' on' : ''}${x === 0 || y === 0 ? ' ax' : ''}" data-k="${x},${y}" title="(${x}${sep}${y})">${x === 0 && y === 0 ? '0' : ''}</button>`;
      box().innerHTML = `<p class="goal">${tr('caQ')}</p>${p.l === 2 ? `<p class="cnt">⚠️ ${tr('caShift', { dx: (p.dx > 0 ? '+' : '') + p.dx, dy: p.dy })}</p>` : ''}
        <div class="cawrap"><div class="calist">${p.list.map(([x, y]) => `<span>(${x}${sep}${y})</span>`).join('')}</div><div class="cagrid" style="--n:${N}">${cells}</div></div>`;
      box().querySelectorAll('.cpt').forEach(b => { b.onclick = () => { const k = b.dataset.k; p.mark.has(k) ? p.mark.delete(k) : p.mark.add(k); b.classList.toggle('on'); }; });
      answer(p, v => +v.trim() === p.d, true);
    },
    hint(p) { const [x, y] = p.pts[0]; return tr('caH', { x, y }); }
  };

  // ---- Vote de Condorcet (Rousseau) ----
  const PROJ = [T('La bibliothèque', 'The library', 'Thư viện'), T('Le théâtre', 'The theatre', 'Nhà hát'), T('La fontaine', 'The fountain', 'Đài phun nước'), T('L’école', 'The school', 'Trường học')];
  W.condorcet = {
    init(p) {
      const l = lv(), k = [3, 4, 4][l], m = [4, 5, 6][l];
      for (;;) {
        const perms = []; const perm = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r]));
        const all = perm([...Array(k).keys()]), bal = shuffle(all).slice(0, m).map(r => ({ r, n: 2 + rand(9) }));
        const beats = (a, b) => bal.reduce((s, x) => s + (x.r.indexOf(a) < x.r.indexOf(b) ? x.n : 0), 0);
        const cw = [...Array(k).keys()].find(a => [...Array(k).keys()].every(b => b === a || beats(a, b) > beats(b, a)));
        if (cw == null) continue;
        const first = Array(k).fill(0); bal.forEach(x => { first[x.r[0]] += x.n; }); const mx = Math.max(...first);
        if (l > 0 && (first[cw] === mx)) continue; if (first.filter(v => v === mx).length > 1) continue;
        p.bal = bal; p.k = k; p.cw = cw; p.beats = beats; void perms; return;
      }
    },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('coQ')}</p><div class="ballots">${p.bal.map(x => `<div class="bal"><b>${x.n} ${tr('coVoters')}</b><ol>${x.r.map(i => `<li>${esc(X(PROJ[i]))}</li>`).join('')}</ol></div>`).join('')}</div>
        <div class="row">${PROJ.slice(0, p.k).map((c, i) => `<button class="btn cow" data-i="${i}">${esc(X(c))}</button>`).join('')}</div>`;
      box().querySelectorAll('.cow').forEach(b => { b.onclick = () => { if (+b.dataset.i === p.cw) K.solve(p); else { W.condorcet.init(p); W.condorcet.render(p); K.fail(); } }; });
    },
    hint(p) { const b = p.cw === 0 ? 1 : 0; return tr('coH', { a: X(PROJ[p.cw]), b: X(PROJ[b]), x: p.beats(p.cw, b), y: p.beats(b, p.cw) }); }
  };

  // ---- Équivalences de marchandises (Marx) ----
  const GOODS = [T('rouleaux de toile', 'rolls of linen', 'cuộn vải lanh'), T('habits', 'coats', 'áo khoác'), T('sacs de thé', 'bags of tea', 'bao trà'), T('barres de fer', 'iron bars', 'thanh sắt'), T('sacs de blé', 'sacks of wheat', 'bao lúa mì'), T('onces d’or', 'ounces of gold', 'lạng vàng'), T('sacs de café', 'bags of coffee', 'bao cà phê')];
  W.barter = {
    init(p) {
      const l = lv(), k = [2, 3, 4][l];
      for (;;) {
        const g = shuffle([...Array(GOODS.length).keys()]).slice(0, k + 2), eq = []; let num = 1, den = 1;
        for (let i = 0; i < k; i++) { const a = 2 + rand(4), b = 2 + rand(5); if (a === b) continue; eq.push([a, g[i], b, g[i + 1]]); num *= b; den *= a; const d = gcd(num, den); num /= d; den /= d; }
        if (eq.length !== k) continue;
        const q = den * (den > 1 ? 1 + rand(3) : 2 + rand(3)), ans = q * num / den; if (ans > 400 || ans < 2) continue;
        const shown = eq.map(e => rand(2) && l > 0 ? [e[2], e[3], e[0], e[1]] : e);
        if (l === 2) shown.push([2 + rand(4), g[k + 1], 2 + rand(5), g[rand(k)]]);
        p.eq = l > 0 ? shuffle(shown) : shown; p.from = g[0]; p.to = g[k]; p.q = q; p.ans = ans; p.rate = num / den; return;
      }
    },
    render(p) {
      const n = i => X(GOODS[i]);
      box().innerHTML = `<div class="prem">${p.eq.map(([a, x, b, y]) => `<p>${a} ${esc(n(x))} = ${b} ${esc(n(y))}</p>`).join('')}</div><p class="goal">${tr('baQ', { g: n(p.to), q: p.q, h: n(p.from) })}</p>`;
      answer(p, v => +v.trim() === p.ans, true);
    },
    hint: p => tr('baH', { h: X(GOODS[p.from]), r: Math.round(p.rate * 100) / 100, g: X(GOODS[p.to]) })
  };

  // ---- Frise de la vie de Hồ Chí Minh ----
  const LIFE = [
    [1890, T('Naissance à Kim Liên, dans la province de Nghệ An', 'Born in Kim Liên, Nghệ An province', 'Sinh ra ở làng Kim Liên, tỉnh Nghệ An')],
    [1911, T('Quitte Saïgon comme aide-cuisinier sur un navire français', 'Leaves Saigon as a kitchen hand on a French ship', 'Rời Sài Gòn làm phụ bếp trên một con tàu Pháp')],
    [1919, T('Signe « Nguyễn Ái Quốc » les Revendications du peuple annamite, à Paris', 'Signs the Demands of the Annamese People as “Nguyễn Ái Quốc”, in Paris', 'Ký tên « Nguyễn Ái Quốc » dưới Bản yêu sách của nhân dân An Nam, tại Paris')],
    [1920, T('Participe au congrès de Tours', 'Takes part in the Congress of Tours', 'Tham dự Đại hội Tours')],
    [1923, T('Part pour Moscou', 'Leaves for Moscow', 'Sang Moskva')],
    [1930, T('Fonde le Parti communiste vietnamien, à Hong Kong', 'Founds the Communist Party of Vietnam in Hong Kong', 'Thành lập Đảng Cộng sản Việt Nam tại Hồng Kông')],
    [1941, T('Rentre au Vietnam, à la grotte de Pác Bó', 'Returns to Vietnam, to the Pác Bó cave', 'Trở về Việt Nam, ở hang Pác Bó')],
    [1945, T('Lit la Déclaration d’indépendance, place Ba Đình', 'Reads the Declaration of Independence in Ba Đình Square', 'Đọc Tuyên ngôn Độc lập tại quảng trường Ba Đình')],
    [1966, T('Lance l’appel « Rien n’est plus précieux que l’indépendance et la liberté »', 'Issues the call “Nothing is more precious than independence and freedom”', 'Ra lời kêu gọi « Không có gì quý hơn độc lập, tự do »')]
  ];
  W.timeline = {
    init(p) { const n = [4, 6, 8][lv()]; p.ev = shuffle(shuffle([...LIFE.keys()]).slice(0, n)); p.done = []; },
    render(p) {
      const sorted = p.ev.slice().sort((a, b) => LIFE[a][0] - LIFE[b][0]);
      box().innerHTML = `<p class="goal">${tr('tlQ')}</p><div class="tline">${p.ev.map(i => { const k = p.done.indexOf(i); return `<button class="tle${k >= 0 ? ' ok' : ''}" data-i="${i}" ${k >= 0 ? 'disabled' : ''}>${k >= 0 ? `<b>${k + 1}. ${LIFE[i][0]}</b>` : ''}${esc(X(LIFE[i][1]))}</button>`; }).join('')}</div>`;
      box().querySelectorAll('.tle').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i; if (sorted[p.done.length] !== i) { p.done = []; W.timeline.render(p); K.fail(tr('tlBad')); return; }
        p.done.push(i); K.beep(520 + p.done.length * 60, .06, 'triangle', .06); W.timeline.render(p); if (p.done.length === p.ev.length) setTimeout(() => K.solve(p), 500);
      }; });
    },
    hint(p) { const i = p.ev.slice().sort((a, b) => LIFE[a][0] - LIFE[b][0])[0]; return tr('tlH', { x: X(LIFE[i][1]) }); }
  };
})();

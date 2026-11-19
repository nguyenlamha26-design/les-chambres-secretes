// Énigmes des scénarios « corsés » :
// le Grand Jeu (1-2-3 soleil, billes, gué, pierre-feuille-ciseaux, chaises, bascule)
// et la Ville vide (menteurs, fausse pièce, tunnel à la lampe, cordes, compte est bon, allumettes).
(() => {
  'use strict';
  const K = window.GameKit, { rand, shuffle } = window.Logic, W = K.W, $ = K.$;
  const tr = (k, v) => K.tr(k, v), X = t => K.X(t), esc = s => K.esc(s);
  // Les scénarios corsés jouent les énigmes un cran plus difficiles
  const lv = () => Math.min(2, K.G.lvl + (K.G.S.hard ? 1 : 0));
  const box = () => $('#pzb');
  const T = (fr, en, vi) => ({ fr, en, vi });

  const UI = {
    fr: {
      solGo: '▶ Départ', solMove: '🏃 Maintenir pour avancer', solTime: 'Temps limite : {n} s', solLeft: 'Temps restant : {n} s', solCaught: 'Le feu t’a vu bouger ! Retour à la ligne de départ.', solSlow: 'Trop lent ! Retour à la ligne de départ.',
      solWords: 'Un,|deux,|trois,|SOLEIL !',
      nimR0: 'Chacun prend 1 à {m} billes à son tour. Celui qui prend la dernière bille gagne. Tu commences.', nimR1: 'Chacun prend 1 à {m} billes à son tour. Celui qui prend la dernière bille PERD. Tu commences.', nimR2: 'À ton tour, prends autant de billes que tu veux, mais dans un seul tas. Celui qui prend la dernière bille gagne. Tu commences.',
      nimMe: 'À toi : clique sur une bille, elle et toutes celles à sa droite sont prises.', nimAi: 'L’hôte prend {n} bille(s)…', nimLost: 'L’hôte a gagné la partie. Nouvelle partie !', nimMax: 'Maximum {m} billes par tour.', nimH: 'Coup gagnant : prends {n} bille(s) dans le tas {h}.', nimH0: 'Ta position est perdante : prends une seule bille et espère une erreur.',
      stNotes: 'Notes griffonnées par les joueurs précédents :', stStep: 'Pas {i}', stFall: 'La pierre s’enfonce dans l’eau glacée ! Retour à la rive.', stH: 'Au pas {i}, la pierre sûre est à {s}.', stL: 'gauche', stR: 'droite',
      stFix: 'Au pas {i}, la pierre sûre est à {s}.', stSame: 'Aux pas {i} et {j}, la pierre sûre est du même côté.', stDiff: 'Aux pas {i} et {j}, les pierres sûres sont de côtés opposés.', stCnt: 'En tout, {k} pierres sûres sont à gauche.', stRng: 'Du pas {a} au pas {b}, exactement {k} pierre(s) sûre(s) à gauche.', stNo3: 'Jamais trois pierres sûres de suite du même côté.',
      rpsNeed: 'Gagne {n} manches d’affilée.', rpsStreak: 'Série : {n} / {m}', rpsWin: 'Gagné', rpsLose: 'Perdu', rpsTie: 'Égalité', rpsYou: 'Toi', rpsHost: 'Hôte',
      rpsH_cyc: 'L’hôte répète toujours la même suite de {n} coups.', rpsH_beat: 'L’hôte joue ce qui aurait battu TON coup précédent.', rpsH_copy: 'L’hôte rejoue TON coup précédent.', rpsH_wsls: 'Si l’hôte gagne, il rejoue le même coup ; sinon il joue ce qui bat ton coup précédent.',
      chRule: '{n} chaises. On compte de 1 à {k} en partant de la chaise {s}, dans le sens des numéros ; la chaise qui tombe sur {k} est retirée, et on recompte à partir de la suivante. La dernière chaise gagne.', chMark: 'Clique sur une chaise pour la barrer (brouillon).', chSit: 'Je m’assois', chH: 'Les premières chaises retirées sont la {a}, puis la {b}.',
      ssPool: 'Enfants à placer :', ssDrop: '⚖️ Lâcher la bascule', ssLeft: 'La bascule penche à gauche !', ssRight: 'La bascule penche à droite !', ssPlace: 'Place d’abord tous les enfants.', ssH: 'L’enfant de {w} kg va à la place {d}, côté {s}.',
      knQ: 'Qui dit la vérité ? Marque chaque carte.', knT: '😇 Vrai', knL: '😈 Menteur', knU: '❔', knAll: 'Marque toutes les cartes.', knH: '{a} est {x}.', knTw: 'honnête', knLw: 'menteur',
      knSL: '{a} ment.', knST: '{a} dit la vérité.', knSame: '{a} et {b} sont du même camp.', knDiff: '{a} et {b} ne sont pas du même camp.', knN: 'Parmi nous, exactement {k} mentent.', knN1: 'Parmi nous, un seul ment.', knOr: 'Au moins un des deux ment : {a} ou {b}.',
      cnRule: '{n} pièces, une seule est fausse ({hl}). {w} pesées.', cnHeavy: 'plus lourde', cnHL: 'plus lourde OU plus légère', cnTap: 'Clique sur une pièce : table → plateau gauche → plateau droit.', cnWeigh: '⚖️ Peser', cnEq: 'Mets le même nombre de pièces (au moins une) sur chaque plateau.', cnLeftW: 'Pesées restantes : {n}', cnRL: 'Le plateau gauche penche (plus lourd).', cnRR: 'Le plateau droit penche (plus lourd).', cnRE: 'Équilibre parfait.', cnPick: 'La fausse pièce est :', cnWrong: 'Mauvaise pièce ! On remélange.', cnH: 'Première pesée conseillée : {x} pièces contre {x}.',
      tcGo: 'Traverser', tcTime: 'Temps : {t} / {m} min', tcRule: 'Le tunnel ne laisse passer que 2 personnes à la fois, avec l’unique lampe. Un duo avance au rythme du plus lent.', tcOver: 'La pile de la lampe est morte ! Tout le monde revient au départ.', tcPick: 'Choisis 1 ou 2 personnes du côté de la lampe.', tcH: 'Premier passage : {a} et {b}.', tcNear: 'Entrée du tunnel', tcFar: 'Sortie',
      rpGoal: 'Objectif : mesurer exactement {x}, à partir du moment où tu allumes la première mèche.', rpWait: '⏩ Laisser brûler', rpNow: '⏰ C’est l’heure !', rpNone: 'Aucune mèche n’est allumée.', rpOut: 'La mèche {r} vient de s’éteindre.', rpBad: 'Raté : ce n’était pas le bon moment ! Nouvelles mèches.', rpRule: 'Chaque mèche brûle en 60 minutes, mais de façon irrégulière. Clique sur un bout pour l’allumer.',
      rpH0: 'Allume les deux bouts en même temps : la mèche brûle deux fois plus vite.', rpH1: 'Allume A des deux côtés et B d’un seul. Quand A s’éteint, allume l’autre bout de B.', rpH2: 'Au départ : A des deux côtés, B et C d’un seul. Quand A s’éteint, autre bout de B ; quand B s’éteint, autre bout de C.',
      cdTarget: 'Cible : {t}', cdUndo: '↶ Annuler', cdBad: 'Opération impossible (pas de négatif ni de division avec reste).', cdH: 'Premier calcul : {a} {o} {b} = {r}.',
      mtMoves: 'Allumettes déplacées : {n} / {m}', mtRule: 'Déplace exactement {m} allumette(s) pour que l’égalité soit juste. Clique sur une allumette, puis sur un emplacement vide.', mtBad: 'L’égalité est toujours fausse. On remet les allumettes.', mtH: 'Le déplacement concerne le symbole n° {x}.', solH: 'Ta marge de réaction est maintenant plus grande.'
    },
    en: {
      solGo: '▶ Start', solMove: '🏃 Hold to move', solTime: 'Time limit: {n} s', solLeft: 'Time left: {n} s', solCaught: 'The light saw you move! Back to the start line.', solSlow: 'Too slow! Back to the start line.',
      solWords: 'Green|light…|green|light…|RED LIGHT!',
      nimR0: 'Take 1 to {m} marbles in turn. Whoever takes the last marble wins. You start.', nimR1: 'Take 1 to {m} marbles in turn. Whoever takes the last marble LOSES. You start.', nimR2: 'On your turn take as many marbles as you like, but from one pile only. Whoever takes the last marble wins. You start.',
      nimMe: 'Your turn: click a marble; it and every marble to its right are taken.', nimAi: 'The host takes {n} marble(s)…', nimLost: 'The host won the game. New game!', nimMax: 'At most {m} marbles per turn.', nimH: 'Winning move: take {n} marble(s) from pile {h}.', nimH0: 'You are in a losing position: take a single marble and hope for a mistake.',
      stNotes: 'Notes scribbled by earlier players:', stStep: 'Step {i}', stFall: 'The stone sinks into the icy water! Back to the bank.', stH: 'At step {i}, the safe stone is on the {s}.', stL: 'left', stR: 'right',
      stFix: 'At step {i}, the safe stone is on the {s}.', stSame: 'At steps {i} and {j}, the safe stone is on the same side.', stDiff: 'At steps {i} and {j}, the safe stones are on opposite sides.', stCnt: 'In total, {k} safe stones are on the left.', stRng: 'From step {a} to step {b}, exactly {k} safe stone(s) on the left.', stNo3: 'Never three safe stones in a row on the same side.',
      rpsNeed: 'Win {n} rounds in a row.', rpsStreak: 'Streak: {n} / {m}', rpsWin: 'Won', rpsLose: 'Lost', rpsTie: 'Draw', rpsYou: 'You', rpsHost: 'Host',
      rpsH_cyc: 'The host always repeats the same sequence of {n} moves.', rpsH_beat: 'The host plays whatever would have beaten YOUR previous move.', rpsH_copy: 'The host replays YOUR previous move.', rpsH_wsls: 'If the host wins, it repeats its move; otherwise it plays whatever beats your previous move.',
      chRule: '{n} chairs. Count from 1 to {k} starting at chair {s}, in number order; the chair that lands on {k} is removed, and counting restarts at the next one. The last chair wins.', chMark: 'Click a chair to cross it out (scratch work).', chSit: 'Sit down', chH: 'The first chairs removed are {a}, then {b}.',
      ssPool: 'Children to place:', ssDrop: '⚖️ Release the seesaw', ssLeft: 'The seesaw tips to the left!', ssRight: 'The seesaw tips to the right!', ssPlace: 'Place every child first.', ssH: 'The {w} kg child goes in seat {d}, on the {s}.',
      knQ: 'Who tells the truth? Mark every card.', knT: '😇 Truthful', knL: '😈 Liar', knU: '❔', knAll: 'Mark every card.', knH: '{a} is {x}.', knTw: 'truthful', knLw: 'a liar',
      knSL: '{a} is lying.', knST: '{a} tells the truth.', knSame: '{a} and {b} are on the same side.', knDiff: '{a} and {b} are not on the same side.', knN: 'Exactly {k} of us are lying.', knN1: 'Exactly one of us is lying.', knOr: 'At least one of these two is lying: {a} or {b}.',
      cnRule: '{n} coins, only one is fake ({hl}). {w} weighings.', cnHeavy: 'heavier', cnHL: 'heavier OR lighter', cnTap: 'Click a coin: table → left pan → right pan.', cnWeigh: '⚖️ Weigh', cnEq: 'Put the same number of coins (at least one) on each pan.', cnLeftW: 'Weighings left: {n}', cnRL: 'The left pan goes down (heavier).', cnRR: 'The right pan goes down (heavier).', cnRE: 'Perfect balance.', cnPick: 'The fake coin is:', cnWrong: 'Wrong coin! The coins are shuffled.', cnH: 'Suggested first weighing: {x} coins against {x}.',
      tcGo: 'Cross', tcTime: 'Time: {t} / {m} min', tcRule: 'The tunnel lets only 2 people through at a time, with the single lamp. A pair moves at the slower one’s pace.', tcOver: 'The lamp battery is dead! Everyone back to the start.', tcPick: 'Choose 1 or 2 people on the lamp’s side.', tcH: 'First crossing: {a} and {b}.', tcNear: 'Tunnel entrance', tcFar: 'Exit',
      rpGoal: 'Goal: measure exactly {x}, starting when you light the first fuse.', rpWait: '⏩ Let it burn', rpNow: '⏰ Time’s up!', rpNone: 'No fuse is burning.', rpOut: 'Fuse {r} has just burnt out.', rpBad: 'Missed: that wasn’t the right moment! New fuses.', rpRule: 'Each fuse burns in 60 minutes, but unevenly. Click an end to light it.',
      rpH0: 'Light both ends at once: the fuse burns twice as fast.', rpH1: 'Light A at both ends and B at one. When A burns out, light B’s other end.', rpH2: 'At the start: A at both ends, B and C at one end. When A burns out, light B’s other end; when B burns out, light C’s other end.',
      cdTarget: 'Target: {t}', cdUndo: '↶ Undo', cdBad: 'Not allowed (no negatives, no division with a remainder).', cdH: 'First step: {a} {o} {b} = {r}.',
      mtMoves: 'Matches moved: {n} / {m}', mtRule: 'Move exactly {m} match(es) to make the equation true. Click a match, then an empty slot.', mtBad: 'The equation is still wrong. The matches go back.', mtH: 'The move involves symbol no. {x}.', solH: 'You now have a bigger reaction margin.'
    },
    vi: {
      solGo: '▶ Xuất phát', solMove: '🏃 Giữ để tiến lên', solTime: 'Giới hạn: {n} giây', solLeft: 'Còn lại: {n} giây', solCaught: 'Đèn đã thấy bạn cử động! Quay về vạch xuất phát.', solSlow: 'Chậm quá! Quay về vạch xuất phát.',
      solWords: 'Một,|hai,|ba…|ĐỨNG IM!',
      nimR0: 'Lần lượt mỗi người lấy từ 1 đến {m} viên bi. Ai lấy viên cuối cùng thì thắng. Bạn đi trước.', nimR1: 'Lần lượt mỗi người lấy từ 1 đến {m} viên bi. Ai lấy viên cuối cùng thì THUA. Bạn đi trước.', nimR2: 'Đến lượt, bạn lấy bao nhiêu bi cũng được, nhưng chỉ trong một đống. Ai lấy viên cuối cùng thì thắng. Bạn đi trước.',
      nimMe: 'Lượt bạn: bấm một viên bi, viên đó và mọi viên bên phải nó sẽ bị lấy.', nimAi: 'Người dẫn trò lấy {n} viên…', nimLost: 'Người dẫn trò đã thắng. Ván mới!', nimMax: 'Tối đa {m} viên mỗi lượt.', nimH: 'Nước thắng: lấy {n} viên ở đống {h}.', nimH0: 'Thế của bạn đang thua: lấy một viên và chờ đối thủ sai.',
      stNotes: 'Ghi chú nguệch ngoạc của những người chơi trước:', stStep: 'Bước {i}', stFall: 'Hòn đá chìm xuống làn nước lạnh buốt! Quay về bờ.', stH: 'Ở bước {i}, hòn đá an toàn nằm bên {s}.', stL: 'trái', stR: 'phải',
      stFix: 'Ở bước {i}, hòn đá an toàn nằm bên {s}.', stSame: 'Ở bước {i} và {j}, đá an toàn nằm cùng một bên.', stDiff: 'Ở bước {i} và {j}, đá an toàn nằm ở hai bên khác nhau.', stCnt: 'Tổng cộng có {k} hòn đá an toàn bên trái.', stRng: 'Từ bước {a} đến bước {b}, có đúng {k} hòn đá an toàn bên trái.', stNo3: 'Không bao giờ có ba hòn đá an toàn liên tiếp cùng một bên.',
      rpsNeed: 'Thắng {n} ván liên tiếp.', rpsStreak: 'Chuỗi thắng: {n} / {m}', rpsWin: 'Thắng', rpsLose: 'Thua', rpsTie: 'Hòa', rpsYou: 'Bạn', rpsHost: 'Người dẫn',
      rpsH_cyc: 'Người dẫn trò luôn lặp lại cùng một chuỗi {n} nước.', rpsH_beat: 'Người dẫn trò ra cái thắng được nước trước của BẠN.', rpsH_copy: 'Người dẫn trò ra lại nước trước của BẠN.', rpsH_wsls: 'Nếu thắng, người dẫn trò ra lại nước cũ; nếu không, ra cái thắng được nước trước của bạn.',
      chRule: '{n} chiếc ghế. Đếm từ 1 đến {k} bắt đầu từ ghế {s}, theo thứ tự số; ghế rơi vào số {k} bị rút đi, rồi đếm lại từ ghế kế tiếp. Ghế cuối cùng thắng.', chMark: 'Bấm vào ghế để gạch đi (nháp).', chSit: 'Ngồi xuống', chH: 'Những ghế bị rút đầu tiên là ghế {a}, rồi ghế {b}.',
      ssPool: 'Các em cần xếp chỗ:', ssDrop: '⚖️ Thả bập bênh', ssLeft: 'Bập bênh nghiêng về bên trái!', ssRight: 'Bập bênh nghiêng về bên phải!', ssPlace: 'Hãy xếp chỗ cho tất cả các em trước.', ssH: 'Em nặng {w} kg ngồi ở chỗ số {d}, bên {s}.',
      knQ: 'Ai nói thật? Đánh dấu từng lá bài.', knT: '😇 Thật', knL: '😈 Dối', knU: '❔', knAll: 'Hãy đánh dấu tất cả các lá bài.', knH: '{a} là người {x}.', knTw: 'nói thật', knLw: 'nói dối',
      knSL: '{a} nói dối.', knST: '{a} nói thật.', knSame: '{a} và {b} cùng một phe.', knDiff: '{a} và {b} không cùng phe.', knN: 'Trong chúng tôi có đúng {k} người nói dối.', knN1: 'Trong chúng tôi chỉ có đúng một người nói dối.', knOr: 'Ít nhất một trong hai nói dối: {a} hoặc {b}.',
      cnRule: '{n} đồng xu, chỉ có một đồng giả ({hl}). {w} lần cân.', cnHeavy: 'nặng hơn', cnHL: 'nặng hơn HOẶC nhẹ hơn', cnTap: 'Bấm vào đồng xu: trên bàn → đĩa trái → đĩa phải.', cnWeigh: '⚖️ Cân', cnEq: 'Đặt số đồng xu bằng nhau (ít nhất một) lên mỗi đĩa.', cnLeftW: 'Số lần cân còn lại: {n}', cnRL: 'Đĩa trái chúc xuống (nặng hơn).', cnRR: 'Đĩa phải chúc xuống (nặng hơn).', cnRE: 'Cân thăng bằng.', cnPick: 'Đồng xu giả là:', cnWrong: 'Sai đồng xu! Các đồng xu được trộn lại.', cnH: 'Lần cân đầu nên là: {x} đồng xu với {x}.',
      tcGo: 'Đi qua', tcTime: 'Thời gian: {t} / {m} phút', tcRule: 'Đường hầm chỉ cho 2 người đi qua mỗi lần, với cây đèn duy nhất. Hai người đi theo tốc độ của người chậm hơn.', tcOver: 'Đèn đã hết pin! Mọi người quay về đầu hầm.', tcPick: 'Chọn 1 hoặc 2 người ở phía có đèn.', tcH: 'Lượt đầu: {a} và {b}.', tcNear: 'Đầu hầm', tcFar: 'Lối ra',
      rpGoal: 'Mục tiêu: đo đúng {x}, tính từ lúc bạn châm ngòi đầu tiên.', rpWait: '⏩ Để ngòi cháy', rpNow: '⏰ Đúng giờ rồi!', rpNone: 'Không có ngòi nào đang cháy.', rpOut: 'Ngòi {r} vừa cháy hết.', rpBad: 'Trượt rồi: chưa đúng lúc! Thay ngòi mới.', rpRule: 'Mỗi ngòi cháy hết trong 60 phút, nhưng cháy không đều. Bấm vào một đầu để châm lửa.',
      rpH0: 'Châm cả hai đầu cùng lúc: ngòi cháy nhanh gấp đôi.', rpH1: 'Châm A cả hai đầu, B một đầu. Khi A tắt, châm đầu còn lại của B.', rpH2: 'Lúc đầu: A cả hai đầu, B và C một đầu. Khi A tắt, châm đầu kia của B; khi B tắt, châm đầu kia của C.',
      cdTarget: 'Mục tiêu: {t}', cdUndo: '↶ Hoàn tác', cdBad: 'Không được (không có số âm, không chia có dư).', cdH: 'Phép tính đầu tiên: {a} {o} {b} = {r}.',
      mtMoves: 'Que diêm đã di chuyển: {n} / {m}', mtRule: 'Di chuyển đúng {m} que diêm để đẳng thức đúng. Bấm vào một que, rồi vào một chỗ trống.', mtBad: 'Đẳng thức vẫn sai. Các que diêm trở về chỗ cũ.', mtH: 'Việc di chuyển liên quan đến ký hiệu thứ {x}.', solH: 'Giờ bạn có nhiều thời gian phản xạ hơn.'
    }
  };
  const PZ = {
    fr: {
      soleil: { t: '1, 2, 3… soleil !', i: 'Traverse la cour pendant que le feu est vert. Quand il devient rouge, ne bouge plus !', h: 'Relâche dès le dernier mot : le feu ne pardonne pas le moindre geste.' },
      nim: { t: 'Les billes', i: 'Bats l’hôte au jeu de billes.', h: 'Cherche les positions perdantes à laisser à ton adversaire, en partant de la fin.' },
      stones: { t: 'Le gué', i: 'Traverse la rivière : à chaque pas, une seule des deux pierres tient. Déduis le bon chemin des notes.', h: 'Commence par les notes qui donnent un côté, puis propage avec « même côté » et « côtés opposés ».' },
      rps: { t: 'Pierre, feuille, ciseaux', i: 'L’hôte suit une règle cachée. Observe l’historique et devine son prochain coup.', h: 'Compare chaque coup de l’hôte à ton coup précédent… ou à ses propres coups.' },
      chairs: { t: 'Les chaises musicales', i: 'Choisis la chaise qui restera la dernière.', h: 'Simule le décompte sur papier en barrant les chaises retirées.' },
      seesaw: { t: 'La bascule', i: 'Place les enfants pour que la bascule soit parfaitement en équilibre.', h: 'De chaque côté, additionne poids × distance au centre : les deux totaux doivent être égaux.' },
      knights: { t: 'Les menteurs', i: 'Chaque carte dit toujours la vérité, ou ment toujours.', h: 'Suppose qu’une carte dit vrai, et regarde si tout reste cohérent.' },
      coins: { t: 'La fausse pièce', i: 'Trouve la fausse pièce avec la balance, en un nombre limité de pesées.', h: 'Divise en trois groupes : deux sur la balance, un sur la table.' },
      torch: { t: 'Le tunnel', i: 'Fais traverser tout le monde dans le temps donné.', h: 'Les deux plus lents doivent traverser ensemble, et ce ne sont pas eux qui rapportent la lampe.' },
      ropes: { t: 'Les mèches', i: 'Mesure le temps exact avec des mèches irrégulières.', h: 'Une mèche allumée des deux bouts dure deux fois moins longtemps, peu importe sa forme.' },
      countdown: { t: 'Le compte est bon', i: 'Combine les nombres (+ − × ÷) pour atteindre exactement la cible. Chaque nombre sert au plus une fois.', h: 'Pars de la cible : de quel produit simple est-elle proche ?' },
      matches: { t: 'Les allumettes', i: 'L’enseigne au néon affiche une égalité fausse.', h: 'Un + peut devenir un −, un 9 un 8 ou un 5… Regarde chaque symbole.' }
    },
    en: {
      soleil: { t: 'Red Light', i: 'Cross the yard while the light is green. When it turns red, freeze!', h: 'Let go as soon as you hear the last word: the light forgives nothing.' },
      nim: { t: 'Marbles', i: 'Beat the host at marbles.', h: 'Look for the losing positions to leave your opponent, working back from the end.' },
      stones: { t: 'The Ford', i: 'Cross the river: at each step only one of the two stones holds. Deduce the safe path from the notes.', h: 'Start with the notes that give a side, then spread with “same side” and “opposite sides”.' },
      rps: { t: 'Rock, Paper, Scissors', i: 'The host follows a hidden rule. Study the history and predict its next move.', h: 'Compare each host move with your previous move… or with its own moves.' },
      chairs: { t: 'Musical Chairs', i: 'Choose the chair that will be the last one standing.', h: 'Simulate the count on paper, crossing out the chairs removed.' },
      seesaw: { t: 'The Seesaw', i: 'Seat the children so the seesaw is perfectly balanced.', h: 'On each side, add up weight × distance from the centre: both totals must be equal.' },
      knights: { t: 'The Liars', i: 'Each card either always tells the truth or always lies.', h: 'Assume one card is truthful and check whether everything stays consistent.' },
      coins: { t: 'The Fake Coin', i: 'Find the fake coin with the balance, in a limited number of weighings.', h: 'Split into three groups: two on the scale, one on the table.' },
      torch: { t: 'The Tunnel', i: 'Get everyone through in the given time.', h: 'The two slowest must cross together, and they are not the ones who bring the lamp back.' },
      ropes: { t: 'The Fuses', i: 'Measure the exact time with uneven fuses.', h: 'A fuse lit at both ends lasts half as long, whatever its shape.' },
      countdown: { t: 'Numbers Game', i: 'Combine the numbers (+ − × ÷) to hit the target exactly. Each number can be used at most once.', h: 'Work from the target: which simple product is it close to?' },
      matches: { t: 'The Matches', i: 'The neon sign shows a false equation.', h: 'A + can become a −, a 9 an 8 or a 5… Look at each symbol.' }
    },
    vi: {
      soleil: { t: 'Đèn xanh, đèn đỏ', i: 'Băng qua sân khi đèn xanh. Khi đèn chuyển đỏ, đứng im!', h: 'Buông tay ngay khi nghe tiếng cuối cùng: đèn không tha một cử động nào.' },
      nim: { t: 'Bắn bi', i: 'Đánh bại người dẫn trò trong trò chơi bi.', h: 'Tìm những thế thua để nhường cho đối thủ, suy ngược từ cuối ván.' },
      stones: { t: 'Lội qua suối', i: 'Băng qua suối: ở mỗi bước chỉ một trong hai hòn đá đứng vững. Suy ra lối đi từ các ghi chú.', h: 'Bắt đầu từ ghi chú cho biết một bên, rồi lan ra bằng « cùng bên » và « khác bên ».' },
      rps: { t: 'Oẳn tù tì', i: 'Người dẫn trò theo một quy luật bí mật. Quan sát lịch sử và đoán nước tiếp theo.', h: 'So sánh mỗi nước của người dẫn trò với nước trước của bạn… hoặc với chính các nước của họ.' },
      chairs: { t: 'Ghế âm nhạc', i: 'Chọn chiếc ghế sẽ còn lại cuối cùng.', h: 'Mô phỏng việc đếm trên giấy, gạch đi những ghế bị rút.' },
      seesaw: { t: 'Bập bênh', i: 'Xếp chỗ cho các em để bập bênh cân bằng hoàn toàn.', h: 'Mỗi bên, cộng cân nặng × khoảng cách đến tâm: hai tổng phải bằng nhau.' },
      knights: { t: 'Kẻ nói dối', i: 'Mỗi lá bài hoặc luôn nói thật, hoặc luôn nói dối.', h: 'Giả sử một lá bài nói thật, rồi xem mọi thứ có còn khớp không.' },
      coins: { t: 'Đồng xu giả', i: 'Tìm đồng xu giả bằng cái cân, với số lần cân có hạn.', h: 'Chia làm ba nhóm: hai nhóm lên cân, một nhóm để trên bàn.' },
      torch: { t: 'Đường hầm', i: 'Đưa mọi người qua hầm trong thời gian cho phép.', h: 'Hai người chậm nhất phải đi cùng nhau, và họ không phải người mang đèn quay lại.' },
      ropes: { t: 'Những sợi ngòi', i: 'Đo đúng thời gian bằng những sợi ngòi cháy không đều.', h: 'Ngòi châm cả hai đầu cháy hết trong một nửa thời gian, dù hình dạng thế nào.' },
      countdown: { t: 'Tính ra đáp số', i: 'Kết hợp các số (+ − × ÷) để được đúng số mục tiêu. Mỗi số dùng nhiều nhất một lần.', h: 'Bắt đầu từ mục tiêu: nó gần với tích đơn giản nào?' },
      matches: { t: 'Que diêm', i: 'Bảng đèn neon hiện một đẳng thức sai.', h: 'Dấu + có thể thành −, số 9 thành 8 hoặc 5… Hãy xem từng ký hiệu.' }
    }
  };
  for (const l in UI) { Object.assign(window.T[l], UI[l]); Object.assign(window.T[l].pz, PZ[l]); }

  // ================= 1, 2, 3… soleil =================
  W.soleil = {
    init(p) { const l = lv(); p.grace = [380, 260, 190][l]; p.limit = [60, 45, 36][l]; p.speed = [1.7, 1.5, 1.35][l]; p.dmin = [1800, 1200, 700][l]; p.dmax = [3600, 3200, 3000][l]; },
    render(p) {
      clearInterval(p.iv); p.pos = 0; p.on = false; p.hold = false;
      box().innerHTML = `<div class="sol"><div class="soltrack"><span class="solrun" id="solrun">🏃</span><span class="solfin">🏁</span></div><div class="sollt" id="sollt">🟢</div></div>
        <p class="solch" id="solch">&nbsp;</p><p class="cnt" id="soltm">${tr('solTime', { n: p.limit })}</p>
        <div class="row"><button class="btn gold" id="solgo">${tr('solGo')}</button><button class="btn big solmv" id="solmv" disabled>${tr('solMove')}</button></div>`;
      const mv = $('#solmv'), words = tr('solWords').split('|');
      const lose = msg => { clearInterval(p.iv); p.on = false; K.beep(110, .4, 'sawtooth', .1); W.soleil.render(p); K.fail(msg); };
      const green = now => { p.ph = 'g'; p.ph0 = now; p.dur = p.dmin + Math.random() * (p.dmax - p.dmin); $('#sollt').textContent = '🟢'; $('#sollt').classList.remove('red'); };
      mv.onpointerdown = e => { e.preventDefault(); p.hold = true; mv.classList.add('on'); };
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => mv.addEventListener(ev, () => { p.hold = false; mv.classList.remove('on'); }));
      $('#solgo').onclick = () => {
        $('#solgo').disabled = true; mv.disabled = false; p.on = true; p.t0 = performance.now(); green(p.t0);
        p.iv = setInterval(() => {
          if (!mv.isConnected) { clearInterval(p.iv); return; }
          const now = performance.now(), left = Math.ceil(p.limit - (now - p.t0) / 1000);
          $('#soltm').textContent = tr('solLeft', { n: Math.max(0, left) });
          if (left <= 0) return lose(tr('solSlow'));
          if (p.ph === 'g') {
            const k = Math.min(words.length, Math.floor((now - p.ph0) / p.dur * words.length) + 1);
            $('#solch').textContent = words.slice(0, k).join(' ');
            if (now - p.ph0 >= p.dur) { p.ph = 'r'; p.ph0 = now; p.rdur = 1300 + Math.random() * 1500; $('#sollt').textContent = '🔴'; $('#sollt').classList.add('red'); K.beep(880, .15, 'square', .06); }
            else if (p.hold) p.pos += p.speed;
          } else {
            if (p.hold && now - p.ph0 > p.grace) return lose(tr('solCaught'));
            if (now - p.ph0 >= p.rdur) { green(now); $('#solch').textContent = ''; }
          }
          $('#solrun').style.left = `calc(${Math.min(100, p.pos) * .9}%)`;
          if (p.pos >= 100) { clearInterval(p.iv); p.on = false; mv.disabled = true; K.beep(1046, .2, 'triangle', .1); setTimeout(() => K.solve(p), 400); }
        }, 50);
      };
    },
    onHint2(p) { p.grace += 250; },
    hint: () => tr('solH')
  };

  // ================= Billes (jeu de Nim) =================
  W.nim = {
    init(p) {
      const l = lv(); p.l = l; p.msg = ''; p.busy = false;
      if (l === 0) { p.max = 3; p.mis = false; let n; do n = 15 + rand(7); while (n % 4 === 0); p.h = [n]; }
      else if (l === 1) { p.max = 4; p.mis = true; let n; do n = 17 + rand(8); while (n % 5 === 1); p.h = [n]; }
      else { p.max = 0; p.mis = false; let h; do h = [3 + rand(3), 4 + rand(3), 6 + rand(3)]; while ((h[0] ^ h[1] ^ h[2]) === 0); p.h = h; }
    },
    best(p) {
      if (p.h.length === 1) { const n = p.h[0], m = p.max + 1, t = p.mis ? (n - 1) % m : n % m; return t > 0 && t <= p.max ? [0, t] : null; }
      const x = p.h.reduce((a, b) => a ^ b, 0); if (!x) return null;
      for (let i = 0; i < p.h.length; i++) { const g = p.h[i] ^ x; if (g < p.h[i]) return [i, p.h[i] - g]; } return null;
    },
    render(p) {
      const rule = tr(['nimR0', 'nimR1', 'nimR2'][p.l], { m: p.max });
      box().innerHTML = `<p class="goal">${rule}</p><div class="heaps">${p.h.map((n, i) => `<div class="heap">${p.h.length > 1 ? `<b>${i + 1}</b>` : ''}${Array.from({ length: n }, (_, j) => `<button class="mb" data-h="${i}" data-j="${j}"></button>`).join('')}</div>`).join('')}</div>
        <p class="cnt" id="nimmsg">${p.msg || tr('nimMe')}</p>`;
      const end = () => p.h.every(n => !n);
      box().querySelectorAll('.mb').forEach(b => {
        b.onmouseenter = () => box().querySelectorAll(`.mb[data-h="${b.dataset.h}"]`).forEach(o => o.classList.toggle('sel', +o.dataset.j >= +b.dataset.j));
        b.onmouseleave = () => box().querySelectorAll('.mb.sel').forEach(o => o.classList.remove('sel'));
        b.onclick = () => {
          if (p.busy) return;
          const h = +b.dataset.h, take = p.h[h] - +b.dataset.j;
          if (p.max && take > p.max) { $('#nimmsg').textContent = tr('nimMax', { m: p.max }); return; }
          p.h[h] -= take; K.beep(520, .05, 'triangle', .06);
          if (end()) { if (p.mis) return W.nim.lost(p); W.nim.render(p); setTimeout(() => K.solve(p), 400); return; }
          p.busy = true; p.msg = ''; W.nim.render(p);
          setTimeout(() => {
            if (!$('#nimmsg')) { p.busy = false; return; }
            let mv = W.nim.best(p);
            if (!mv) { const ne = p.h.map((n, i) => n ? i : -1).filter(i => i >= 0), i = ne[rand(ne.length)]; mv = [i, 1]; }
            p.h[mv[0]] -= mv[1]; p.busy = false; p.msg = tr('nimAi', { n: mv[1] }) + ' ' + tr('nimMe'); K.beep(300, .05, 'triangle', .06);
            if (end()) { if (p.mis) { W.nim.render(p); setTimeout(() => K.solve(p), 400); return; } return W.nim.lost(p); }
            W.nim.render(p);
          }, 750);
        };
      });
    },
    lost(p) { W.nim.init(p); p.msg = tr('nimLost'); W.nim.render(p); K.fail(tr('nimLost')); },
    hint(p) { const b = W.nim.best(p); return b ? tr('nimH', { n: b[1], h: b[0] + 1 }) : tr('nimH0'); }
  };

  // ================= Le gué (pierres sûres) =================
  const three = s => s.some((v, i) => i >= 2 && v === s[i - 1] && v === s[i - 2]);
  const stOk = (s, c) => {
    switch (c.t) {
      case 'fix': return s[c.i] === c.s;
      case 'same': return s[c.i] === s[c.j];
      case 'diff': return s[c.i] !== s[c.j];
      case 'cnt': return s.filter(v => !v).length === c.k;
      case 'rng': { let k = 0; for (let q = c.a; q <= c.b; q++) k += !s[q]; return k === c.k; }
      case 'no3': return !three(s);
    }
    return false;
  };
  W.stones = {
    init(p) {
      const l = lv(), n = [6, 8, 10][l]; p.n = n; p.at = 0; p.known = Array(n).fill(0);
      const all = []; for (let m = 0; m < 1 << n; m++) all.push(Array.from({ length: n }, (_, i) => (m >> i) & 1));
      for (let tries = 0; tries < 400; tries++) {
        const sol = Array.from({ length: n }, () => rand(2)), pool = [];
        for (let i = 0; i < n; i++) pool.push({ t: 'fix', i, s: sol[i] });
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pool.push({ t: sol[i] === sol[j] ? 'same' : 'diff', i, j });
        pool.push({ t: 'cnt', k: sol.filter(v => !v).length });
        for (let i = 0; i < n - 2; i++) { const b = Math.min(n - 1, i + 2 + rand(3)); let k = 0; for (let q = i; q <= b; q++) k += !sol[q]; pool.push({ t: 'rng', a: i, b, k }); }
        if (!three(sol)) pool.push({ t: 'no3' }, { t: 'no3' });
        const order = shuffle(pool).sort((a, b) => (a.t === 'fix') - (b.t === 'fix'));
        let cand = all, clues = [];
        for (const c of order) { const nx = cand.filter(s => stOk(s, c)); if (nx.length < cand.length) { cand = nx; clues.push(c); } if (cand.length === 1) break; }
        if (cand.length !== 1) continue;
        for (const c of shuffle(clues)) { const rest = clues.filter(x => x !== c); if (all.filter(s => rest.every(r => stOk(s, r))).length === 1) clues = rest; }
        const fixes = clues.filter(c => c.t === 'fix').length;
        if (fixes > [2, 1, 1][l] || clues.length > n + [2, 1, 1][l]) continue;
        p.sol = sol; p.clues = shuffle(clues); return;
      }
      p.sol = Array.from({ length: n }, () => rand(2)); p.clues = p.sol.map((s, i) => ({ t: 'fix', i, s }));
    },
    clue(c) {
      const side = s => tr(s ? 'stR' : 'stL');
      switch (c.t) {
        case 'fix': return tr('stFix', { i: c.i + 1, s: side(c.s) });
        case 'same': return tr('stSame', { i: c.i + 1, j: c.j + 1 });
        case 'diff': return tr('stDiff', { i: c.i + 1, j: c.j + 1 });
        case 'cnt': return tr('stCnt', { k: c.k });
        case 'rng': return tr('stRng', { a: c.a + 1, b: c.b + 1, k: c.k });
        default: return tr('stNo3');
      }
    },
    render(p) {
      const rows = []; for (let i = p.n - 1; i >= 0; i--) rows.push(`<div class="strow${i === p.at ? ' cur' : ''}"><small>${tr('stStep', { i: i + 1 })}</small>${[0, 1].map(s => `<button class="stn${p.known[i] && p.sol[i] === s ? ' ok' : ''}" data-i="${i}" data-s="${s}" ${i === p.at ? '' : 'disabled'}>${i === p.at - 1 && p.sol[i] === s ? '🧍' : ''}</button>`).join('')}</div>`);
      box().innerHTML = `<div class="stwrap"><div class="stnotes"><b>${tr('stNotes')}</b><ul>${p.clues.map(c => `<li>${esc(W.stones.clue(c))}</li>`).join('')}</ul></div>
        <div class="ford">${rows.join('')}<div class="strow bank">${p.at === 0 ? '🧍' : ''}</div></div></div>`;
      box().querySelectorAll('.stn').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i, s = +b.dataset.s; if (i !== p.at) return;
        if (p.sol[i] !== s) { K.beep(120, .4, 'sawtooth', .1); p.at = 0; W.stones.render(p); K.fail(tr('stFall')); return; }
        p.known[i] = 1; p.at++; K.beep(500 + i * 40, .06, 'triangle', .07);
        W.stones.render(p); if (p.at === p.n) setTimeout(() => K.solve(p), 400);
      }; });
    },
    hint(p) { const i = p.known.indexOf(0) < 0 ? p.at : p.known.indexOf(0); return tr('stH', { i: i + 1, s: tr(p.sol[i] ? 'stR' : 'stL') }); }
  };

  // ================= Pierre, feuille, ciseaux =================
  const HAND = ['✊', '✋', '✌️'], beats = a => (a + 1) % 3;
  W.rps = {
    init(p) {
      const l = lv(); p.need = [4, 5, 6][l]; p.streak = 0; p.hist = []; p.lastHostWon = false;
      p.rule = l === 0 ? 'cyc' : l === 1 ? ['beat', 'copy'][rand(2)] : ['wsls', 'cyc'][rand(2)];
      if (p.rule === 'cyc') { const len = l === 0 ? 3 : 4; do p.cyc = Array.from({ length: len }, () => rand(3)); while (new Set(p.cyc).size < 2); }
    },
    host(p) {
      const last = p.hist[p.hist.length - 1];
      switch (p.rule) {
        case 'cyc': return p.cyc[p.hist.length % p.cyc.length];
        case 'beat': return last ? beats(last[0]) : rand(3);
        case 'copy': return last ? last[0] : rand(3);
        default: return !last ? rand(3) : p.lastHostWon ? last[1] : beats(last[0]);
      }
    },
    render(p) {
      const res = r => r > 0 ? `<em class="w">${tr('rpsWin')}</em>` : r < 0 ? `<em class="l">${tr('rpsLose')}</em>` : `<em>${tr('rpsTie')}</em>`;
      box().innerHTML = `<p class="goal">${tr('rpsNeed', { n: p.need })} — ${tr('rpsStreak', { n: p.streak, m: p.need })}</p>
        <div class="row rpsb">${HAND.map((h, i) => `<button class="btn rh" data-m="${i}">${h}</button>`).join('')}</div>
        <div class="rpsh"><div><b>#</b><b>${tr('rpsYou')}</b><b>${tr('rpsHost')}</b><b></b></div>${p.hist.slice(-14).map((h, k) => `<div><span>${p.hist.length - Math.min(14, p.hist.length) + k + 1}</span><span>${HAND[h[0]]}</span><span>${HAND[h[1]]}</span>${res(h[2])}</div>`).reverse().join('')}</div>`;
      box().querySelectorAll('.rh').forEach(b => { b.onclick = () => {
        const me = +b.dataset.m, hm = W.rps.host(p), r = me === hm ? 0 : beats(hm) === me ? 1 : -1;
        p.hist.push([me, hm, r]); p.lastHostWon = r < 0;
        if (r > 0) { p.streak++; K.beep(660 + p.streak * 60, .08, 'triangle', .07); } else { p.streak = 0; K.beep(160, .15, 'sawtooth', .06); }
        W.rps.render(p); if (p.streak >= p.need) setTimeout(() => K.solve(p), 400);
      }; });
    },
    hint: p => tr('rpsH_' + p.rule, { n: p.cyc ? p.cyc.length : 0 })
  };

  // ================= Chaises musicales (Josèphe) =================
  W.chairs = {
    init(p) {
      const l = lv(); p.n = [7, 10, 13][l] + rand(2); p.k = [2, 3, 3 + rand(2)][l]; p.s = l === 2 ? 1 + rand(p.n) : 1; p.mark = {};
      const c = Array.from({ length: p.n }, (_, i) => i + 1); let idx = p.s - 1; p.out = [];
      while (c.length > 1) { idx = (idx + p.k - 1) % c.length; p.out.push(c.splice(idx, 1)[0]); if (idx === c.length) idx = 0; }
      p.win = c[0];
    },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('chRule', { n: p.n, k: p.k, s: p.s })}</p><p class="cnt">${tr('chMark')}</p>
        <div class="circle">${Array.from({ length: p.n }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / p.n; return `<button class="chair${p.mark[i + 1] ? ' x' : ''}" data-c="${i + 1}" style="left:${50 + 42 * Math.cos(a)}%;top:${50 + 42 * Math.sin(a)}%">🪑<b>${i + 1}</b></button>`; }).join('')}<div class="cmid">🎵</div></div>
        <div class="row"><input class="ans" id="ans" inputmode="numeric" autocomplete="off" style="max-width:120px"><button class="btn gold" id="ok">${tr('chSit')}</button></div>`;
      box().querySelectorAll('.chair').forEach(b => { b.onclick = () => { const c = +b.dataset.c; p.mark[c] = !p.mark[c]; b.classList.toggle('x', p.mark[c]); K.beep(400, .03, 'triangle', .04); }; });
      K.bindInput(v => +v.trim() === p.win, p);
    },
    hint: p => tr('chH', { a: p.out[0], b: p.out[1] })
  };

  // ================= Bascule =================
  W.seesaw = {
    init(p) {
      const l = lv(), nf = [2, 2, 3][l], nm = [1, 2, 3][l], WS = [20, 25, 30, 35, 40, 45];
      for (;;) {
        const pos = shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), kids = [];
        for (let i = 0; i < nf + nm - 1; i++) kids.push({ w: WS[rand(WS.length)], d: pos[i] });
        const tq = kids.reduce((s, k) => s + k.w * k.d, 0); if (!tq) continue;
        const free = pos.slice(nf + nm - 1), opts = free.filter(d => -tq % d === 0 && WS.includes(-tq / d));
        if (!opts.length) continue;
        const d = opts[rand(opts.length)]; kids.push({ w: -tq / d, d });
        const fixed = kids.slice(0, nf); if (fixed.reduce((s, k) => s + k.w * k.d, 0) === 0) continue;
        p.fixed = fixed; p.mov = kids.slice(nf).map((k, i) => ({ id: i, w: k.w, sol: k.d, at: 0 })); break;
      }
      p.sel = null; p.tilt = 0;
    },
    render(p) {
      const slot = d => { const f = p.fixed.find(k => k.d === d), m = p.mov.find(k => k.at === d);
        return `<button class="ssl${f ? ' fx' : ''}${m ? ' mv' : ''}" data-d="${d}">${f ? `🧒<b>${f.w}</b>` : m ? `🧒<b>${m.w}</b>` : ''}<small>${Math.abs(d)}</small></button>`; };
      box().innerHTML = `<div class="saw" style="--tilt:${p.tilt}deg"><div class="plank">${[-5, -4, -3, -2, -1].map(slot).join('')}<span class="piv">▲</span>${[1, 2, 3, 4, 5].map(slot).join('')}</div></div>
        <p class="cnt">${tr('ssPool')}</p><div class="row sspool">${p.mov.filter(k => !k.at).map(k => `<button class="btn ssk${p.sel === k.id ? ' on' : ''}" data-k="${k.id}">🧒 ${k.w} kg</button>`).join('') || '—'}</div>
        <div class="row"><button class="btn gold" id="ssgo">${tr('ssDrop')}</button></div>`;
      box().querySelectorAll('.ssk').forEach(b => { b.onclick = () => { p.sel = +b.dataset.k; W.seesaw.render(p); }; });
      box().querySelectorAll('.ssl').forEach(b => { b.onclick = () => {
        const d = +b.dataset.d; if (p.fixed.some(k => k.d === d)) return;
        const m = p.mov.find(k => k.at === d); if (m) { m.at = 0; p.tilt = 0; W.seesaw.render(p); return; }
        if (p.sel == null) return; p.mov.find(k => k.id === p.sel).at = d; p.sel = null; p.tilt = 0; K.beep(500, .04, 'triangle', .05); W.seesaw.render(p);
      }; });
      $('#ssgo').onclick = () => {
        if (p.mov.some(k => !k.at)) { $('#fb').textContent = tr('ssPlace'); return; }
        const tq = p.fixed.reduce((s, k) => s + k.w * k.d, 0) + p.mov.reduce((s, k) => s + k.w * k.at, 0);
        p.tilt = Math.max(-12, Math.min(12, tq / 20)); W.seesaw.render(p);
        if (!tq) { K.beep(880, .2, 'triangle', .08); setTimeout(() => K.solve(p), 600); return; }
        K.fail(tr(tq < 0 ? 'ssLeft' : 'ssRight'));
      };
    },
    hint(p) { const m = p.mov[0]; return tr('ssH', { w: m.w, d: Math.abs(m.sol), s: tr(m.sol < 0 ? 'stL' : 'stR') }); }
  };

  // ================= Les menteurs =================
  const FIG = [[T('V', 'J', 'J') , T('Le Valet', 'The Jack', 'Lá Bồi'), '♠'], [T('D', 'Q', 'Q'), T('La Dame', 'The Queen', 'Lá Đầm'), '♥'], [T('R', 'K', 'K'), T('Le Roi', 'The King', 'Lá Già'), '♣'], [T('A', 'A', 'A'), T('L’As', 'The Ace', 'Lá Át'), '♦'], [null, T('Le Joker', 'The Joker', 'Lá Phăng-teo'), '🃏']];
  const knVal = (st, A) => {
    switch (st.t) {
      case 'L': return !A[st.a];
      case 'T': return !!A[st.a];
      case 'same': return A[st.a] === A[st.b];
      case 'diff': return A[st.a] !== A[st.b];
      case 'nL': return A.filter(v => !v).length === st.k;
      default: return !A[st.a] || !A[st.b];
    }
  };
  W.knights = {
    init(p) {
      const n = [3, 4, 5][lv()]; p.n = n; p.ans = Array(n).fill(-1);
      for (;;) {
        const A = Array.from({ length: n }, () => rand(2)); if (A.every(v => v) || A.every(v => !v)) continue;
        const st = A.map((v, s) => {
          for (;;) {
            const o = [...Array(n).keys()].filter(i => i !== s), a = o[rand(o.length)], b = shuffle(o.filter(i => i !== a))[0];
            const c = [{ t: 'L', a }, { t: 'T', a }, { t: 'same', a, b }, { t: 'diff', a, b }, { t: 'nL', k: 1 + rand(n - 1) }, { t: 'or', a, b }][rand(6)];
            if (knVal(c, A) === !!v) return c;
          }
        });
        let sols = 0; for (let m = 0; m < 1 << n; m++) { const B = Array.from({ length: n }, (_, i) => (m >> i) & 1); if (st.every((c, s) => knVal(c, B) === !!B[s])) sols++; }
        if (sols === 1) { p.A = A; p.st = st; return; }
      }
    },
    say(c) {
      const nm = i => X(FIG[i][1]);
      switch (c.t) {
        case 'L': return tr('knSL', { a: nm(c.a) });
        case 'T': return tr('knST', { a: nm(c.a) });
        case 'same': return tr('knSame', { a: nm(c.a), b: nm(c.b) });
        case 'diff': return tr('knDiff', { a: nm(c.a), b: nm(c.b) });
        case 'nL': return c.k === 1 ? tr('knN1') : tr('knN', { k: c.k });
        default: return tr('knOr', { a: nm(c.a), b: nm(c.b) });
      }
    },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('knQ')}</p><div class="kcards">${p.st.map((c, i) => `<div class="kc"><div class="kf${FIG[i][2] === '♥' || FIG[i][2] === '♦' ? ' red' : ''}">${FIG[i][0] ? `<i>${X(FIG[i][0])}</i>` : ''}${FIG[i][2]}</div><b>${esc(X(FIG[i][1]))}</b><p>« ${esc(W.knights.say(c))} »</p>
        <button class="btn kt${p.ans[i] === 1 ? ' t' : p.ans[i] === 0 ? ' l' : ''}" data-i="${i}">${p.ans[i] === 1 ? tr('knT') : p.ans[i] === 0 ? tr('knL') : tr('knU')}</button></div>`).join('')}</div>
        <div class="row"><button class="btn gold" id="ok">${K.tr('check')}</button></div>`;
      box().querySelectorAll('.kt').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.ans[i] = p.ans[i] === 1 ? 0 : 1; W.knights.render(p); }; });
      $('#ok').onclick = () => {
        if (p.ans.includes(-1)) { $('#fb').textContent = tr('knAll'); return; }
        if (p.ans.every((v, i) => v === p.A[i])) K.solve(p); else K.fail();
      };
    },
    hint: p => tr('knH', { a: X(FIG[0][1]), x: tr(p.A[0] ? 'knTw' : 'knLw') })
  };

  // ================= La fausse pièce (balance contre un adversaire) =================
  W.coins = {
    init(p) {
      const l = lv(); [p.n, p.w, p.both] = [[8, 2, false], [9, 2, false], [12, 3, true]][l];
      p.st = Array(p.n).fill(0); p.left = p.w; p.log = [];
      p.cand = []; for (let i = 0; i < p.n; i++) { p.cand.push([i, 1]); if (p.both) p.cand.push([i, -1]); }
    },
    render(p) {
      box().innerHTML = `<p class="goal">${tr('cnRule', { n: p.n, hl: tr(p.both ? 'cnHL' : 'cnHeavy'), w: p.w })}</p><p class="cnt">${tr('cnTap')}</p>
        <div class="pans"><div class="pan"><b>⬅</b>${p.st.map((s, i) => s === 1 ? `<span>${i + 1}</span>` : '').join('')}</div><div class="pan"><b>➡</b>${p.st.map((s, i) => s === 2 ? `<span>${i + 1}</span>` : '').join('')}</div></div>
        <div class="coins">${p.st.map((s, i) => `<button class="coin s${s}" data-i="${i}">${i + 1}</button>`).join('')}</div>
        <div class="row"><button class="btn gold" id="cnw" ${p.left ? '' : 'disabled'}>${tr('cnWeigh')}</button><span class="cnt">${tr('cnLeftW', { n: p.left })}</span></div>
        <ol class="cnlog">${p.log.map(x => `<li>${x}</li>`).join('')}</ol>
        <p class="cnt">${tr('cnPick')}</p><div class="coins pick">${p.st.map((s, i) => `<button class="btn cpk" data-i="${i}">${i + 1}</button>`).join('')}</div>`;
      box().querySelectorAll('.coin').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.st[i] = (p.st[i] + 1) % 3; K.beep(600, .03, 'triangle', .04); W.coins.render(p); }; });
      $('#cnw').onclick = () => {
        const A = p.st.flatMap((s, i) => s === 1 ? [i] : []), B = p.st.flatMap((s, i) => s === 2 ? [i] : []);
        if (!A.length || A.length !== B.length) { $('#fb').textContent = tr('cnEq'); return; }
        const out = ([i, s]) => A.includes(i) ? (s > 0 ? 'L' : 'R') : B.includes(i) ? (s > 0 ? 'R' : 'L') : 'E';
        const grp = { L: [], R: [], E: [] }; p.cand.forEach(c => grp[out(c)].push(c));
        const mx = Math.max(grp.L.length, grp.R.length, grp.E.length), keys = shuffle(['L', 'R', 'E'].filter(k => grp[k].length === mx)), r = keys[0];
        p.cand = grp[r]; p.left--; K.beep(r === 'E' ? 500 : 300, .15, 'triangle', .07);
        p.log.push(`${A.map(i => i + 1).join(' ')} ⚖️ ${B.map(i => i + 1).join(' ')} → ${tr(r === 'L' ? 'cnRL' : r === 'R' ? 'cnRR' : 'cnRE')}`);
        p.st.fill(0); W.coins.render(p);
      };
      box().querySelectorAll('.cpk').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i;
        if (p.cand.every(c => c[0] === i)) { K.solve(p); return; }
        W.coins.init(p); W.coins.render(p); K.fail(tr('cnWrong'));
      }; });
    },
    hint: p => tr('cnH', { x: [3, 3, 4][lv()] })
  };

  // ================= Le tunnel et la lampe =================
  const TSETS = [[[1, 2, 5, 10], [1, 2, 4, 9], [1, 3, 4, 8]], [[1, 3, 6, 8, 12], [1, 2, 5, 8, 13], [2, 3, 5, 9, 11]], [[1, 2, 4, 7, 11, 15], [1, 3, 4, 6, 10, 14], [2, 3, 5, 8, 12, 16]]];
  const FOLK = ['🧑‍🦰', '👩', '🧔', '👵', '🧑‍🦯', '👨‍🦽'];
  function torchBest(t) {
    const n = t.length, full = (1 << n) - 1, dist = new Map(), prev = new Map(), key = (m, s) => m * 2 + s;
    const pq = [[0, 0, 0]]; dist.set(0, 0);
    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0]); const [d, m, s] = pq.shift(); if (d > dist.get(key(m, s))) continue;
      if (m === full && s === 1) { const path = []; let k = key(m, s); while (prev.has(k)) { const [pk, mv] = prev.get(k); path.unshift(mv); k = pk; } return { best: d, path }; }
      const side = []; for (let i = 0; i < n; i++) if (((m >> i) & 1) === s) side.push(i);
      const moves = []; side.forEach((a, x) => { moves.push([a]); side.slice(x + 1).forEach(b => moves.push([a, b])); });
      for (const mv of moves) {
        const nm = mv.reduce((acc, i) => acc ^ (1 << i), m), nd = d + Math.max(...mv.map(i => t[i])), nk = key(nm, 1 - s);
        if (!dist.has(nk) || nd < dist.get(nk)) { dist.set(nk, nd); prev.set(nk, [key(m, s), mv]); pq.push([nd, nm, 1 - s]); }
      }
    }
    return { best: 0, path: [] };
  }
  W.torch = {
    init(p) { const sets = TSETS[lv()]; p.t = sets[rand(sets.length)]; const b = torchBest(p.t); p.lim = b.best; p.path = b.path; W.torch.reset(p); },
    reset(p) { p.far = Array(p.t.length).fill(0); p.lamp = 0; p.used = 0; p.sel = []; },
    render(p) {
      const who = side => p.t.map((v, i) => p.far[i] === side ? `<button class="btn tp${p.sel.includes(i) ? ' on' : ''}" data-i="${i}" ${p.lamp === side ? '' : 'disabled'}>${FOLK[i]} <b>${v}</b></button>` : '').join('');
      box().innerHTML = `<p class="goal">${tr('tcRule')}</p><p class="cnt">${tr('tcTime', { t: p.used, m: p.lim })}</p>
        <div class="tun"><div class="bank"><small>${tr('tcNear')}</small>${who(0)}${p.lamp === 0 ? '<i>🔦</i>' : ''}</div><div class="tube">🚇</div><div class="bank"><small>${tr('tcFar')}</small>${who(1)}${p.lamp === 1 ? '<i>🔦</i>' : ''}</div></div>
        <div class="row"><button class="btn" id="tcrs">↺ ${K.tr('reset')}</button><button class="btn gold" id="tcgo">${p.lamp ? '⬅ ' : ''}${tr('tcGo')}${p.lamp ? '' : ' ➜'}</button></div>`;
      box().querySelectorAll('.tp').forEach(b => { b.onclick = () => { const i = +b.dataset.i; p.sel = p.sel.includes(i) ? p.sel.filter(x => x !== i) : p.sel.length < 2 ? [...p.sel, i] : [p.sel[1], i]; W.torch.render(p); }; });
      $('#tcrs').onclick = () => { W.torch.reset(p); W.torch.render(p); };
      $('#tcgo').onclick = () => {
        if (!p.sel.length) { $('#fb').textContent = tr('tcPick'); return; }
        p.used += Math.max(...p.sel.map(i => p.t[i])); p.sel.forEach(i => { p.far[i] = 1 - p.lamp; }); p.lamp = 1 - p.lamp; p.sel = []; K.beep(440, .08, 'triangle', .06);
        if (p.used > p.lim) { W.torch.reset(p); W.torch.render(p); K.fail(tr('tcOver')); return; }
        W.torch.render(p); if (p.far.every(Boolean)) setTimeout(() => K.solve(p), 400);
      };
    },
    hint(p) { const m = p.path[0] || [0, 1]; return tr('tcH', { a: FOLK[m[0]] + ' ' + p.t[m[0]], b: FOLK[m[1] ?? m[0]] + ' ' + p.t[m[1] ?? m[0]] }); }
  };

  // ================= Les mèches =================
  const fmtMin = x => { const m = Math.floor(x), s = Math.round((x - m) * 60); return s ? `${m} min ${s} s` : `${m} min`; };
  W.ropes = {
    init(p) { const l = lv(); p.l = l; p.goal = [30, 45, 52.5][l]; W.ropes.reset(p); },
    reset(p) { p.time = 0; p.log = []; p.r = Array.from({ length: p.l + 1 }, () => ({ rem: 60, lit: [0, 0], done: false, g: .45 + Math.random() * 1.6 })); },
    render(p) {
      const name = i => 'ABC'[i];
      box().innerHTML = `<p class="goal">${tr('rpGoal', { x: fmtMin(p.goal) })}</p><p class="cnt">${tr('rpRule')}</p>
        <div class="ropes">${p.r.map((r, i) => { const f = r.done ? 0 : Math.pow(r.rem / 60, r.g), pos = r.lit[0] && !r.lit[1] ? 'right' : r.lit[1] && !r.lit[0] ? 'left' : 'center';
          return `<div class="rope"><b>${name(i)}</b><button class="rend${r.lit[0] ? ' on' : ''}" data-i="${i}" data-e="0" ${r.lit[0] || r.done ? 'disabled' : ''}>${r.lit[0] && !r.done ? '🔥' : '•'}</button>
          <div class="rbar" style="justify-content:${pos === 'right' ? 'flex-end' : pos === 'left' ? 'flex-start' : 'center'}"><i style="width:${f * 100}%"></i></div>
          <button class="rend${r.lit[1] ? ' on' : ''}" data-i="${i}" data-e="1" ${r.lit[1] || r.done ? 'disabled' : ''}>${r.lit[1] && !r.done ? '🔥' : '•'}</button></div>`; }).join('')}</div>
        <ol class="cnlog">${p.log.map(x => `<li>${x}</li>`).join('')}</ol>
        <div class="row"><button class="btn" id="rprs">↺ ${K.tr('reset')}</button><button class="btn" id="rpw">${tr('rpWait')}</button><button class="btn gold" id="rpn">${tr('rpNow')}</button></div>`;
      box().querySelectorAll('.rend').forEach(b => { b.onclick = () => { const r = p.r[+b.dataset.i]; r.lit[+b.dataset.e] = 1; p.started = true; K.beep(700, .05, 'sawtooth', .04); W.ropes.render(p); }; });
      $('#rprs').onclick = () => { W.ropes.reset(p); W.ropes.render(p); };
      $('#rpw').onclick = () => {
        const burn = p.r.filter(r => !r.done && (r.lit[0] || r.lit[1])); if (!burn.length) { $('#fb').textContent = tr('rpNone'); return; }
        const ends = r => r.lit[0] + r.lit[1], dt = Math.min(...burn.map(r => r.rem / ends(r))); p.time += dt;
        const out = []; burn.forEach(r => { r.rem -= dt * ends(r); if (r.rem < 1e-9) { r.rem = 0; r.done = true; out.push(name(p.r.indexOf(r))); } });
        p.log.push(out.map(n => tr('rpOut', { r: n })).join(' ')); K.beep(260, .2, 'triangle', .06); W.ropes.render(p);
      };
      $('#rpn').onclick = () => { if (p.time > 0 && Math.abs(p.time - p.goal) < 1e-6) { K.solve(p); return; } W.ropes.reset(p); W.ropes.render(p); K.fail(tr('rpBad')); };
    },
    hint: p => tr(['rpH0', 'rpH1', 'rpH2'][p.l])
  };

  // ================= Le compte est bon =================
  const OPS = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
  W.countdown = {
    init(p) {
      const l = lv(), cnt = [4, 5, 6][l], big = [0, 1, 2][l], steps = [2, 3, 4][l], range = [[21, 99], [101, 499], [101, 999]][l];
      for (;;) {
        const nums = shuffle([...shuffle([25, 50, 75, 100]).slice(0, big), ...Array.from({ length: cnt - big }, () => 1 + rand(10))]);
        // Chaîne de calculs : chaque étape réutilise le résultat précédent
        const rest = shuffle(nums), sol = []; let cur = rest.pop(), bad = false;
        for (let s = 0; s < steps; s++) {
          const n = rest.pop(), [a, b] = rand(2) ? [cur, n] : [n, cur];
          const ok = Object.keys(OPS).filter(o => (o !== '−' || a > b) && (o !== '÷' || (b > 1 && a % b === 0)) && (o !== '×' || (a > 1 && b > 1 && a * b <= 1000)));
          if (!ok.length) { bad = true; break; }
          const o = ok[rand(ok.length)]; cur = OPS[o](a, b); sol.push([a, o, b, cur]);
        }
        if (bad) continue;
        const tgt = cur, one = new Set();
        nums.forEach((x, i) => nums.forEach((y, j) => { if (i !== j) { one.add(x + y); one.add(x * y); if (x > y) one.add(x - y); if (y > 1 && x % y === 0) one.add(x / y); } }));
        if (tgt >= range[0] && tgt <= range[1] && !nums.includes(tgt) && !one.has(tgt)) { p.nums = nums; p.tgt = tgt; p.sol = sol; break; }
      }
      p.cur = p.nums.map((v, i) => ({ v, id: i })); p.hist = []; p.a = null; p.o = null;
    },
    render(p) {
      box().innerHTML = `<div class="cdt">${tr('cdTarget', { t: `<b>${p.tgt}</b>` })}</div>
        <div class="row cdn">${p.cur.map((x, i) => `<button class="btn cdv${p.a === i ? ' on' : ''}" data-i="${i}">${x.v}</button>`).join('')}</div>
        <div class="row">${Object.keys(OPS).map(o => `<button class="btn cdo${p.o === o ? ' on' : ''}" data-o="${o}">${o}</button>`).join('')}</div>
        <ol class="cnlog">${p.hist.map(h => `<li>${h.txt}</li>`).join('')}</ol>
        <div class="row"><button class="btn" id="cdu">${tr('cdUndo')}</button><button class="btn" id="cdr">↺ ${K.tr('reset')}</button></div>`;
      box().querySelectorAll('.cdv').forEach(b => { b.onclick = () => {
        const i = +b.dataset.i;
        if (p.a == null || p.o == null || p.a === i) { p.a = p.a === i ? null : i; p.o = null; W.countdown.render(p); return; }
        const a = p.cur[p.a].v, c = p.cur[i].v, o = p.o;
        if ((o === '−' && a <= c) || (o === '÷' && a % c !== 0)) { $('#fb').textContent = tr('cdBad'); return; }
        const r = OPS[o](a, c); p.hist.push({ cur: p.cur, txt: `${a} ${o} ${c} = ${r}` });
        p.cur = [...p.cur.filter((_, k) => k !== p.a && k !== i), { v: r, id: 'r' + p.hist.length }]; p.a = null; p.o = null; K.beep(600, .05, 'triangle', .05);
        W.countdown.render(p); if (r === p.tgt) setTimeout(() => K.solve(p), 400);
      }; });
      box().querySelectorAll('.cdo').forEach(b => { b.onclick = () => { if (p.a == null) return; p.o = b.dataset.o; W.countdown.render(p); }; });
      $('#cdu').onclick = () => { const h = p.hist.pop(); if (h) p.cur = h.cur; p.a = p.o = null; W.countdown.render(p); };
      $('#cdr').onclick = () => { p.cur = p.nums.map((v, i) => ({ v, id: i })); p.hist = []; p.a = p.o = null; W.countdown.render(p); };
    },
    hint(p) { const [a, o, b, r] = p.sol[0]; return tr('cdH', { a, o, b, r }); }
  };

  // ================= Les allumettes =================
  const SEG = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
  const DIG = Object.fromEntries(SEG.map((s, d) => [s, d]));
  const SPOS = { a: [12, 4, 36, 7], b: [48, 10, 7, 40], c: [48, 58, 7, 40], d: [12, 98, 36, 7], e: [5, 58, 7, 40], f: [5, 10, 7, 40], g: [12, 51, 36, 7], h: [12, 51, 36, 7], v: [26, 37, 7, 34] };
  const mkEq = (a, op, b, c) => [...String(a)].map(d => ({ k: 'd', s: new Set(SEG[d]) })).concat([{ k: 'o', s: new Set(op === '+' ? 'hv' : 'h') }], [...String(b)].map(d => ({ k: 'd', s: new Set(SEG[d]) })), [{ k: 'e' }], [...String(c)].map(d => ({ k: 'd', s: new Set(SEG[d]) })));
  const slots = ch => ch.k === 'd' ? 'abcdefg' : ch.k === 'o' ? 'hv' : '';
  function evalEq(eq) {
    let s = '';
    for (const ch of eq) {
      if (ch.k === 'e') { s += '='; continue; }
      const key = [...ch.s].sort().join('');
      if (ch.k === 'o') { if (key === 'hv') s += '+'; else if (key === 'h') s += '-'; else return false; continue; }
      if (!(key in DIG)) return false; s += DIG[key];
    }
    const m = s.match(/^(\d+)([+-])(\d+)=(\d+)$/); if (!m) return false;
    return (m[2] === '+' ? +m[1] + +m[3] : +m[1] - +m[3]) === +m[4];
  }
  const valid = eq => eq.every(ch => ch.k === 'e' || (ch.k === 'o' ? ch.s.has('h') : [...ch.s].sort().join('') in DIG));
  const clone = eq => eq.map(ch => ({ k: ch.k, s: ch.s ? new Set(ch.s) : undefined }));
  function randMove(eq) {
    const lit = [], off = [];
    eq.forEach((ch, i) => { for (const g of slots(ch)) (ch.s.has(g) ? lit : off).push([i, g]); });
    const [fi, fg] = lit[rand(lit.length)], [ti, tg] = off[rand(off.length)];
    const e = clone(eq); e[fi].s.delete(fg); e[ti].s.add(tg); return e;
  }
  W.matches = {
    init(p) {
      const l = lv(); p.m = l === 2 ? 2 : 1;
      for (let tries = 0; ; tries++) {
        let a, b, op = rand(2) ? '+' : '-', c;
        if (l === 0) { a = rand(10); b = rand(10); c = op === '+' ? a + b : a - b; if (c < 0 || c > 9) continue; }
        else { a = 10 + rand(40); b = 1 + rand(9); c = op === '+' ? a + b : a - b; }
        const E = mkEq(a, op, b, c); let P = E;
        for (let k = 0; k < p.m; k++) P = randMove(P);
        if (valid(P) && !evalEq(P)) { p.E = E; p.P = P; break; }
      }
      W.matches.reset(p);
    },
    reset(p) { p.cur = clone(p.P); p.moves = 0; p.held = null; },
    render(p) {
      const svg = p.cur.map((ch, i) => {
        let g = '';
        if (ch.k === 'e') g = `<rect x="12" y="40" width="36" height="7" class="mt fix"/><rect x="12" y="62" width="36" height="7" class="mt fix"/>`;
        else for (const sg of slots(ch)) { const [x, y, w, h] = SPOS[sg], on = ch.s.has(sg), held = p.held && p.held[0] === i && p.held[1] === sg;
          g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" class="mt${on ? ' on' : ''}${held ? ' held' : ''}" data-i="${i}" data-g="${sg}"/>`; }
        return `<g transform="translate(${i * 64},0)">${g}</g>`;
      }).join('');
      box().innerHTML = `<p class="goal">${tr('mtRule', { m: p.m })}</p><div class="neon"><svg viewBox="-4 -4 ${p.cur.length * 64 + 4} 116">${svg}</svg></div>
        <p class="cnt">${tr('mtMoves', { n: p.moves, m: p.m })}</p><div class="row"><button class="btn" id="mtrs">↺ ${K.tr('reset')}</button><button class="btn gold" id="ok">${K.tr('check')}</button></div>`;
      box().querySelectorAll('rect[data-i]').forEach(r => { r.onclick = () => {
        const i = +r.dataset.i, g = r.dataset.g, ch = p.cur[i];
        if (ch.s.has(g) && !(p.held && p.held[0] === i && p.held[1] === g)) { if (p.moves >= p.m) return; p.held = [i, g]; K.beep(700, .03, 'triangle', .04); W.matches.render(p); return; }
        if (p.held && p.held[0] === i && p.held[1] === g) { p.held = null; W.matches.render(p); return; }
        if (!p.held) return;
        p.cur[p.held[0]].s.delete(p.held[1]); ch.s.add(g); p.held = null; p.moves++; K.beep(520, .05, 'triangle', .05); W.matches.render(p);
      }; });
      $('#mtrs').onclick = () => { W.matches.reset(p); W.matches.render(p); };
      $('#ok').onclick = () => { if (valid(p.cur) && evalEq(p.cur)) { K.solve(p); return; } W.matches.reset(p); W.matches.render(p); K.fail(tr('mtBad')); };
    },
    hint(p) { const i = p.P.findIndex((ch, k) => ch.k !== 'e' && [...slots(ch)].some(g => ch.s.has(g) !== p.E[k].s.has(g))); return tr('mtH', { x: i + 1 }); }
  };
})();

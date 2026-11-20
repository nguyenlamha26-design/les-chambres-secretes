# Les Chambres Secrètes · The Secret Chambers · Mật Thất

Jeu d'évasion dans le navigateur : explore, fouille, déduis. 18 scénarios (dont 2 corsés, 2 axés sur le récit et 2 très culturels), classés par catégories, 3 niveaux de difficulté, 131 énigmes de 111 types différents, une section de commentaires, en français, anglais et vietnamien.

Browser escape game: explore, search, deduce. 18 scenarios (2 of them tough, 2 story-driven, 2 deeply cultural), sorted into categories, 3 difficulty levels, 131 puzzles of 111 different kinds, a comments section, in French, English and Vietnamese.

Trò chơi thoát phòng trên trình duyệt: khám phá, lục tìm, suy luận. 18 kịch bản (2 kịch bản khó, 2 kịch bản thiên về cốt truyện, 2 kịch bản đậm chất văn hóa), xếp theo thể loại, 3 cấp độ, 131 câu đố thuộc 111 loại khác nhau, có mục bình luận, bằng tiếng Pháp, tiếng Anh và tiếng Việt.

## Scénarios

- 🎒 **Le cartable verrouillé** — une classe la nuit, sous l'orage
- ⛵ **La flotte de pêche** — une cabine de bateau au large de la baie d'Hạ Long, 1958
- 🐊 **Le temple du crocodile** — des ruines oubliées au cœur de la jungle
- 🛰️ **Station Aurore** — une station orbitale en alerte
- 🕵️ **L'emblème volé** — une enquête dans les rues enneigées de Rimouski
- 🏮 **La maison des lanternes** — Hội An, la nuit de la fête de la mi-automne
- 🚂 **Le train de nuit** — bloqué par la tempête entre Rimouski et Mont-Joli
- 🎃 **Le manoir hanté** — Halloween, un pari et un fantôme joueur
- 🎄 **L’atelier des lutins** — le soir de Noël, au pôle Nord
- 🎲 **Le Grand Jeu** 💀 — six jeux d'enfance sur une île du Saint-Laurent (scénario corsé)
- 🃏 **La ville vide** 💀 — Montréal déserte, des écrans géants qui invitent à jouer (scénario corsé)
- 🪄 **L’Académie de Brumeval** — une école de magie cachée dans les Laurentides
- 🎩 **La Famille Corsetti** — Montréal 1931, la prohibition et un traître
- 🏛️ **L’Agora du temps** — Socrate, Platon, Descartes, Rousseau, Marx et Hồ Chí Minh
- 🌊 **Le Phare de Cap-aux-Brumes** — un journal de bord aux pages arrachées, une lettre jamais lue (récit)
- 🪞 **L’Autre Moi** — trois jours perdus, deux écritures, une conversation avec son reflet (récit)
- 🍜 **La Recette de Bà Hạnh** — reconstituer le bouillon de phở d’une grand-mère disparue : épices, dégustation, herbes (cuisine vietnamienne)
- 🗡️ **Le Serment du Lac de Jade** — une secte de cape et d’épée inventée : huit trigrammes, cinq éléments, cithare qin, miroir de bronze (culture chinoise)

Les scénarios corsés donnent 25 % de temps en moins, deux indices de moins, des erreurs plus coûteuses et des énigmes d'un cran plus difficiles.

## Jouer

Ouvre `index.html` dans un navigateur, ou joue en ligne via GitHub Pages. Aucune installation, aucune dépendance : tout est en HTML, CSS et JavaScript.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page, styles |
| `game.js` | Moteur : exploration, inventaire, carnet, chrono, verrou final |
| `fx.js` | Rendu commun : caméra, lumière, particules |
| `leaderboard.js` | Classement en ligne |
| `widgets2.js` … `widgets7.js` | Types d'énigmes ajoutés |
| `logic.js` | Générateurs d'énigmes (aléatoires à chaque partie) |
| `content*.js` | Histoires, objets, documents et énigmes des scénarios |
| `scenes*.js` | Décors animés dessinés sur canvas |
| `i18n*.js` | Textes de l'interface en 3 langues |

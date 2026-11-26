# Les Chambres Secrètes · The Secret Chambers · Mật Thất

Deux modes dans le navigateur : **jeu d'évasion** (explore, fouille, déduis) et **jeu d'enquête** (dossiers d'affaires criminelles à résoudre pièce par pièce). Mode évasion : 20 scénarios (dont 2 corsés, 2 axés sur le récit, 2 très culturels et 2 enquêtes à preuves), classés par catégories, 3 niveaux de difficulté, 143 énigmes de 116 types différents, une section de commentaires. Mode enquête : 3 dossiers. En français, anglais et vietnamien.

Two modes in the browser: **escape game** (explore, search, deduce) and **investigation game** (criminal case files solved document by document). Escape mode: 20 scenarios (2 of them tough, 2 story-driven, 2 deeply cultural, 2 evidence-based investigations), sorted into categories, 3 difficulty levels, 143 puzzles of 116 different kinds, a comments section. Investigation mode: 3 case files. In French, English and Vietnamese.

Hai chế độ trên trình duyệt: **thoát phòng** (khám phá, lục tìm, suy luận) và **phá án** (hồ sơ vụ án giải từng tài liệu một). Chế độ thoát phòng: 20 kịch bản (2 kịch bản khó, 2 kịch bản thiên về cốt truyện, 2 kịch bản đậm chất văn hóa, 2 vụ điều tra dựa trên bằng chứng), xếp theo thể loại, 3 cấp độ, 143 câu đố thuộc 116 loại khác nhau, có mục bình luận. Chế độ phá án: 3 hồ sơ. Bằng tiếng Pháp, tiếng Anh và tiếng Việt.

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
- 🎭 **Le Dernier Rappel** — Québec 1959, une vedette empoisonnée en pleine première : empreintes, analyse, interrogatoires, accusation (enquête)
- 🖼️ **La Toile disparue** — un chef-d’œuvre remplacé par un faux pendant une tempête de neige, trois complices à démasquer (enquête)

Les enquêtes reposent sur les preuves : on compare des empreintes, on conçoit une analyse avec peu de réactifs, on confronte chaque mensonge à la bonne pièce à conviction, on repère la phrase qui trahit le coupable, puis on formule une accusation justifiée point par point.

Les scénarios corsés donnent 25 % de temps en moins, deux indices de moins, des erreurs plus coûteuses et des énigmes d'un cran plus difficiles.

## Mode enquête

Chaque dossier commence par l'appel de ton supérieur. Tu brises les scellés des chemises, lis les pièces (procès-verbaux, dépositions, messages, caméras, relevés, photos), puis tu remplis le rapport de chaque mission : une réponse et la pièce qui la prouve. Score sur 1000 : −100 par mauvaise réponse, −250 pour une fausse accusation, −50 pour une mauvaise pièce, −100 par indice. Lien direct : `index.html#enquete`.

- 🔥 **Dossier 01 · Le Feu de la rue Saint-Vallier** — Québec, une boulangerie incendiée la nuit, un boulanger blessé
- 💍 **Dossier 02 · Le Collier de la mariée** — Montréal, un mariage vietnamien, des bijoux en or remplacés par des copies
- 🚂 **Dossier 03 · Le passager de la couchette 4** — le train de nuit Hà Nội → Lào Cai, une couchette vide au petit matin

## Jouer

Ouvre `index.html` dans un navigateur, ou joue en ligne via GitHub Pages. Aucune installation, aucune dépendance : tout est en HTML, CSS et JavaScript.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page, styles |
| `game.js` | Moteur : exploration, inventaire, carnet, chrono, verrou final |
| `fx.js` | Rendu commun : caméra, lumière, particules |
| `enquete.js` | Moteur du mode enquête : archives, scellés, documents, rapports, score |
| `dossiers1.js` … `dossiers3.js` | Affaires du mode enquête |
| `leaderboard.js` | Classement en ligne |
| `widgets2.js` … `widgets11.js` | Types d'énigmes ajoutés |
| `logic.js` | Générateurs d'énigmes (aléatoires à chaque partie) |
| `content*.js` | Histoires, objets, documents et énigmes des scénarios |
| `scenes*.js` | Décors animés dessinés sur canvas |
| `i18n*.js` | Textes de l'interface en 3 langues |

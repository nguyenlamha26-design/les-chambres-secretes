// Décors : Le Dernier Rappel (loge, scène, dessous) et La Toile disparue (salle 3, atelier, poste de sécurité).
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const ell = (c, x, y, rx, ry) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col, al = 'center') => { c.font = font; c.fillStyle = col; c.textAlign = al; c.fillText(s, x, y); c.textAlign = 'left'; };

  // Silhouette debout : pieds en (x, y), hauteur h
  function figure(c, t, x, y, h, o) {
    const s = h / 400, sw = Math.sin(t * 1.3 + x) * 2;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.3)'; ell(c, 0, 0, 70, 12);
    c.fillStyle = o.legs || '#22222a'; c.fillRect(-34, -170, 28, 168); c.fillRect(6, -170, 28, 168);
    c.fillStyle = o.shoe || '#111'; ell(c, -22, -4, 26, 9); ell(c, 22, -4, 26, 9);
    c.fillStyle = o.coat; poly(c, [[-62, -320], [62, -320], [o.dress ? 90 : 66, o.dress ? -20 : -150], [o.dress ? -90 : -66, o.dress ? -20 : -150]]); c.fill();
    c.fillStyle = o.coat; c.fillRect(-82, -316, 24, 150); c.fillRect(58, -316, 24, 150);
    c.fillStyle = o.skin || '#e8c8a8'; circ(c, -70, -160, 13); circ(c, 70, -160, 13);
    if (o.shirt) { c.fillStyle = o.shirt; poly(c, [[-18, -320], [18, -320], [0, -260]]); c.fill(); }
    if (o.tie) { c.fillStyle = o.tie; poly(c, [[-6, -314], [6, -314], [8, -268], [0, -258], [-8, -268]]); c.fill(); }
    c.fillStyle = o.skin || '#e8c8a8'; c.fillRect(-12, -338, 24, 22); ell(c, 0, -370 + sw * .3, 36, 44);
    c.fillStyle = o.hair || '#2a2018';
    c.beginPath(); c.ellipse(0, -386, 38, 30, 0, Math.PI, TAU); c.fill();
    if (o.long) { c.fillRect(-38, -390, 14, 70); c.fillRect(24, -390, 14, 70); }
    if (o.bun) circ(c, 0, -420, 16);
    c.fillStyle = '#2a1a14'; circ(c, -13, -372, 3.5); circ(c, 13, -372, 3.5);
    c.strokeStyle = '#8a4a3a'; c.lineWidth = 3; c.beginPath(); c.arc(0, -350, 10, .4, Math.PI - .4); c.stroke();
    if (o.hat) { c.fillStyle = o.hat; ell(c, 0, -398, 58, 10); c.fillRect(-34, -444, 68, 46); }
    if (o.cap) { c.fillStyle = o.cap; c.beginPath(); c.ellipse(0, -398, 40, 22, 0, Math.PI, TAU); c.fill(); c.fillRect(0, -402, 50, 8); }
    if (o.glasses) { c.strokeStyle = '#222'; c.lineWidth = 3; c.strokeRect(-26, -380, 20, 14); c.strokeRect(6, -380, 20, 14); }
    if (o.smock) { c.fillStyle = o.smock; poly(c, [[-48, -300], [48, -300], [56, -150], [-56, -150]]); c.fill(); c.fillStyle = '#c84a3a'; circ(c, -20, -220, 6); c.fillStyle = '#3a6ab0'; circ(c, 14, -190, 5); }
    c.restore();
  }
  function curtain(c, t, x, w, y0, y1, col, flip) {
    for (let k = 0; k < 7; k++) {
      const xx = x + k * w / 7, sway = Math.sin(t * .5 + k) * 3;
      c.fillStyle = lg(c, xx, 0, xx + w / 7, 0, 0, col[0], .5, col[1], 1, col[0]);
      poly(c, [[xx, y0], [xx + w / 7, y0], [xx + w / 7 + sway + (flip ? -10 : 10), y1], [xx + sway, y1]]); c.fill();
    }
  }
  function paper(c, x, y, w, h, a, col = '#f2ead6') { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.fillStyle = col; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = 'rgba(60,50,40,.35)'; for (let k = 0; k < Math.floor(h / 12) - 1; k++) c.fillRect(-w / 2 + 8, -h / 2 + 10 + k * 12, w - 16 - R(k) * 20, 2); c.restore(); }
  function bulbs(c, t, x, y, w, h) {
    const n = Math.floor(w / 60);
    for (let k = 0; k <= n; k++) for (const yy of [y, y + h]) { c.fillStyle = '#fff3c8'; circ(c, x + k * w / n, yy, 11); glow(c, x + k * w / n, yy, 40, '#ffe8a0', .35 * flick(t, k)); }
    for (let k = 1; k < 5; k++) for (const xx of [x, x + w]) { c.fillStyle = '#fff3c8'; circ(c, xx, y + k * h / 5, 11); glow(c, xx, y + k * h / 5, 40, '#ffe8a0', .35); }
  }
  function snowfall(c, t, x, y, w, h, n) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = '#fff';
    for (let k = 0; k < n; k++) { c.globalAlpha = .5 + R(k + 1) * .5; circ(c, x + mod(R(k) * w + Math.sin(t * .6 + k) * 12, w), y + mod(R(k + 9) * h + t * (30 + R(k + 3) * 30), h), 1.5 + R(k + 4) * 2); }
    c.globalAlpha = 1; c.restore();
  }

  // ======================= LE DERNIER RAPPEL =======================
  function thA(c, t, st) {
    // Mur de loge, papier peint à rayures
    c.fillStyle = lg(c, 0, 0, 0, 660, 0, '#5a3a3e', 1, '#3a2226'); c.fillRect(0, 0, W, 660);
    c.fillStyle = 'rgba(255,220,180,.05)'; for (let x = 0; x < W; x += 40) c.fillRect(x, 0, 14, 660);
    c.fillStyle = lg(c, 0, 660, 0, H, 0, '#4a3022', 1, '#1a100a'); c.fillRect(0, 660, W, H - 660);
    c.fillStyle = 'rgba(120,20,30,.4)'; ell(c, 780, 800, 420, 60);
    // Portant et manteau de Victor
    c.fillStyle = '#6a6a70'; c.fillRect(120, 150, 250, 8); c.fillRect(124, 150, 8, 620); c.fillRect(358, 150, 8, 620);
    c.fillStyle = '#2a2230'; poly(c, [[180, 170], [310, 170], [340, 640], [150, 640]]); c.fill();
    c.fillStyle = '#1a1420'; c.fillRect(240, 170, 8, 470); c.fillStyle = '#c8a050'; for (let k = 0; k < 4; k++) circ(c, 262, 260 + k * 80, 6);
    c.fillStyle = '#5a1a20'; poly(c, [[200, 170], [245, 170], [245, 260]]); c.fill();
    if (!st.f.ev_letter) { c.fillStyle = '#f2ead6'; c.save(); c.translate(296, 420); c.rotate(.2); c.fillRect(-18, -24, 36, 30); c.restore(); }
    c.fillStyle = '#8a2a2a'; poly(c, [[380, 160], [430, 230], [400, 560], [370, 560]]); c.fill(); // écharpe de costume
    // Coiffeuse et miroir aux ampoules
    c.fillStyle = '#3a2418'; c.fillRect(560, 110, 480, 290); c.fillStyle = lg(c, 0, 120, 0, 390, 0, '#a8b4bc', 1, '#5a646c'); c.fillRect(580, 130, 440, 250);
    c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [[620, 130], [700, 130], [600, 380], [580, 380], [580, 220]]); c.fill();
    txt(c, 'Merde pour ce soir !', 800, 210, 'italic bold 30px Cambria', 'rgba(190,20,40,.85)');
    // Photo et télégrammes glissés dans le cadre
    c.fillStyle = '#e8e0d0'; c.save(); c.translate(985, 175); c.rotate(.08); c.fillRect(-36, -44, 72, 88); c.fillStyle = '#6a6460'; c.fillRect(-30, -38, 60, 64); c.fillStyle = '#2a2622'; circ(c, -12, -10, 9); circ(c, 12, -12, 9); c.restore();
    bulbs(c, t, 560, 110, 480, 290);
    c.fillStyle = lg(c, 0, 400, 0, 480, 0, '#7a4a2a', 1, '#4a2a18'); c.fillRect(470, 400, 600, 24); c.fillStyle = '#4a2a18'; c.fillRect(490, 424, 560, 230);
    c.strokeStyle = '#c8a050'; c.lineWidth = 3; c.strokeRect(510, 450, 240, 180); c.strokeRect(790, 450, 240, 180);
    // Objets sur la coiffeuse
    c.fillStyle = '#e8d4b0'; rr(c, 500, 412, 84, 52, 3); c.fill(); c.fillStyle = '#8a2a2a'; c.fillRect(500, 412, 84, 10); txt(c, 'DOSSIER', 542, 446, 'bold 13px Segoe UI', '#5a3a20');
    c.fillStyle = '#e8d0b8'; ell(c, 650, 412, 32, 10); c.fillStyle = '#c89878'; c.fillRect(618, 412, 64, 44); ell(c, 650, 456, 32, 10); c.fillStyle = '#f0dcc4'; ell(c, 650, 412, 30, 8);
    paper(c, 710, 408, 60, 44, -.12, '#f4e8a8'); paper(c, 770, 412, 60, 40, .1, '#f4e8a8');
    if (!st.f.ev_flask) { c.fillStyle = lg(c, 895, 0, 965, 0, 0, '#8a9098', .5, '#e8eef4', 1, '#7a8088'); rr(c, 895, 394, 70, 66, 10); c.fill(); c.fillStyle = '#5a6068'; c.fillRect(920, 380, 20, 16); c.strokeStyle = 'rgba(60,70,80,.6)'; c.lineWidth = 1.5; c.strokeRect(908, 410, 44, 30); glow(c, 930, 420, 40, '#ffffff', .2); }
    c.fillStyle = '#c84a6a'; c.fillRect(1000, 400, 10, 22); c.fillStyle = '#e8c860'; c.fillRect(998, 412, 14, 12);
    // Porte vers le couloir, consignes du commissaire
    c.fillStyle = '#2a1810'; c.fillRect(1250, 170, 260, 490); c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#8a6a3a', 1, '#5a4024'); c.fillRect(1262, 180, 236, 470);
    c.fillStyle = 'rgba(255,230,180,.12)'; c.fillRect(1262, 330, 60, 320); glow(c, 1290, 480, 200, '#ffe0a0', .25);
    c.fillStyle = '#e8c860'; poly(c, [[1340, 230], [1358, 258], [1390, 262], [1366, 284], [1374, 314], [1340, 298], [1306, 314], [1314, 284], [1290, 262], [1322, 258]]); c.fill();
    txt(c, 'V. DELORME', 1340, 340, 'bold 16px Cambria', '#3a2818');
    paper(c, 1325, 190, 120, 84, .04); c.fillStyle = '#c0282a'; circ(c, 1385, 196, 6);
    c.fillStyle = '#d8b060'; circ(c, 1470, 430, 10);
    // Mallette du labo
    c.fillStyle = '#2a2a2a'; rr(c, 1180, 620, 260, 120, 10); c.fill(); c.fillStyle = '#4a4a4a'; rr(c, 1180, 620, 260, 30, 10); c.fill();
    c.fillStyle = '#c8c8c8'; c.fillRect(1290, 604, 40, 18); c.fillStyle = '#e8e0d0'; c.fillRect(1200, 670, 120, 24); txt(c, 'SÛRETÉ — LABO', 1260, 688, 'bold 13px Segoe UI', '#2a2a2a');
    for (let k = 0; k < 5; k++) { c.fillStyle = ['#e8e8e8', '#c0d0e0', '#e0c0f0', '#e8e8e8', '#d0e0c0'][k]; c.fillRect(1340 + k * 18, 662, 10, 56); }
    glow(c, 800, 250, 600, '#ffe0a0', .15); dust(c, t, 16, 0, 0, W, 660, '#ffe8c0'); vign(c, .7);
  }

  function thB(c, t, st) {
    c.fillStyle = '#0c0608'; c.fillRect(0, 0, W, H);
    // Fond de scène peint : salle du trône
    c.fillStyle = lg(c, 0, 80, 0, 560, 0, '#3a1a3a', 1, '#5a2a3a'); c.fillRect(300, 80, 1000, 500);
    c.fillStyle = 'rgba(220,180,90,.18)'; for (let k = 0; k < 5; k++) { c.fillRect(360 + k * 200, 120, 40, 440); ell(c, 380 + k * 200, 120, 40, 18); }
    c.fillStyle = '#e8d8a0'; circ(c, 800, 190, 46); c.fillStyle = '#3a1a3a'; circ(c, 818, 180, 40);
    // Plancher de scène
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#6a4a2a', 1, '#2a1a0e'); poly(c, [[300, 560], [1300, 560], [1600, 900], [0, 900]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; for (let k = 0; k < 14; k++) { const x0 = 300 + k * 1000 / 13; c.beginPath(); c.moveTo(x0, 560); c.lineTo(x0 + (x0 - 800) * .9, 900); c.stroke(); }
    // Rideaux rouges
    curtain(c, t, 0, 300, 0, 900, ['#5a0a12', '#a8182a'], 0); curtain(c, t, 1300, 300, 0, 900, ['#5a0a12', '#a8182a'], 1);
    c.fillStyle = lg(c, 0, 0, 0, 90, 0, '#a8182a', 1, '#5a0a12'); c.fillRect(0, 0, W, 90); c.fillStyle = '#d8a840'; for (let x = 20; x < W; x += 40) { c.beginPath(); c.moveTo(x - 20, 90); c.quadraticCurveTo(x, 120, x + 20, 90); c.fill(); }
    // Poursuite
    c.fillStyle = 'rgba(255,240,200,.08)'; poly(c, [[760, 0], [840, 0], [1000, 620], [600, 620]]); c.fill(); glow(c, 800, 560, 260, '#fff0c0', .25);
    // Table du banquet, trône
    c.fillStyle = '#8a1a20'; c.fillRect(560, 540, 480, 22); c.fillStyle = '#d8a840'; c.fillRect(560, 560, 480, 6); c.fillStyle = '#4a2a18'; c.fillRect(580, 566, 20, 70); c.fillRect(1000, 566, 20, 70);
    [[620, '#e8a020'], [660, '#c03030'], [960, '#80a030']].forEach(([x, col]) => { c.fillStyle = col; circ(c, x, 528, 16); });
    c.fillStyle = '#c8c0b0'; ell(c, 880, 536, 40, 8); c.fillStyle = 'rgba(200,220,240,.6)'; c.fillRect(680, 470, 34, 66); c.fillStyle = '#6a1a3a'; c.fillRect(682, 500, 30, 34);
    if (!st.f.ev_goblet) { c.save(); c.translate(800, 510); c.rotate(1.3); c.fillStyle = lg(c, -20, 0, 20, 0, 0, '#a88020', .5, '#ffe080', 1, '#a88020'); poly(c, [[-26, -40], [26, -40], [8, 0], [4, 30], [18, 40], [-18, 40], [-4, 30], [-8, 0]]); c.fill(); c.restore(); c.fillStyle = 'rgba(120,10,40,.6)'; ell(c, 760, 538, 40, 6); glow(c, 800, 510, 50, '#ffe080', .3); }
    c.fillStyle = '#d8a840'; c.fillRect(1010, 360, 120, 20); poly(c, [[1010, 360], [1070, 300], [1130, 360]]); c.fill(); c.fillStyle = '#7a1a3a'; c.fillRect(1020, 380, 100, 150); c.fillStyle = '#d8a840'; c.fillRect(1010, 520, 120, 24); c.fillRect(1014, 544, 14, 60); c.fillRect(1112, 544, 14, 60);
    // Coulisse gauche : feuille de présence et tableau des clés
    c.fillStyle = '#3a2a1e'; c.fillRect(60, 220, 210, 380);
    paper(c, 80, 240, 170, 180, 0, '#efe6cc'); txt(c, 'ENTRÉE DES ARTISTES', 165, 262, 'bold 12px Segoe UI', '#3a2a1a');
    c.fillStyle = '#6a4a2a'; c.fillRect(80, 460, 170, 110); c.fillStyle = '#c8a050';
    for (let k = 0; k < 6; k++) { const x = 100 + (k % 3) * 52, y = 482 + Math.floor(k / 3) * 46; c.fillRect(x, y, 6, 8); if (k !== 4 || !st.f.gotkey) { c.fillStyle = '#d8c070'; circ(c, x + 3, y + 20, 7); c.fillRect(x + 1, y + 20, 4, 18); c.fillStyle = '#c8a050'; } }
    txt(c, 'Dessous', 152, 566, '11px Segoe UI', '#f0e0c0');
    // Paul, la doublure, sur une malle
    c.fillStyle = '#5a3a1a'; c.fillRect(300, 680, 190, 80); c.strokeStyle = '#c8a050'; c.lineWidth = 4; c.strokeRect(300, 680, 190, 80);
    figure(c, t, 395, 690, 230, { coat: '#3a6a5a', legs: '#c8b080', hair: '#6a4a2a', skin: '#ecd0b4' });
    // Armand devant la régie
    figure(c, t, 1205, 620, 360, { coat: '#1a1a22', shirt: '#f4f0e8', tie: '#8a1a20', hair: '#8a8a8a', glasses: 1 });
    c.fillStyle = '#1a1a22'; ell(c, 1150, 470, 22, 8); c.fillRect(1134, 446, 32, 24);
    // Régie : pupitre, papiers, téléphone, coffre
    c.fillStyle = '#1a1612'; c.fillRect(1280, 200, 320, 560); c.fillStyle = '#2a241c'; c.fillRect(1280, 380, 320, 30);
    c.fillStyle = '#3a3a34'; c.fillRect(1300, 230, 240, 120); for (let k = 0; k < 8; k++) { c.fillStyle = '#5a5a52'; c.fillRect(1316 + k * 28, 250, 12, 80); c.fillStyle = k % 3 ? '#e04030' : '#40c060'; circ(c, 1322 + k * 28, 270 + R(k) * 50, 6); }
    if (!st.f.ev_policy) { paper(c, 1296, 398, 84, 50, -.06); paper(c, 1306, 404, 76, 46, .08); } else paper(c, 1296, 404, 76, 40, -.05);
    c.fillStyle = '#111'; rr(c, 1392, 404, 74, 46, 8); c.fill(); c.fillStyle = '#222'; ell(c, 1429, 400, 40, 12); c.fillStyle = '#d8d0c0'; circ(c, 1429, 428, 14); c.fillStyle = '#111'; circ(c, 1429, 428, 6);
    c.fillStyle = lg(c, 1300, 0, 1490, 0, 0, '#4a4a4e', .5, '#7a7a80', 1, '#3a3a3e'); rr(c, 1310, 570, 170, 170, 8); c.fill();
    c.strokeStyle = '#2a2a2e'; c.lineWidth = 4; c.strokeRect(1324, 584, 142, 142); c.fillStyle = '#c8c8c8'; circ(c, 1395, 655, 26); c.fillStyle = '#4a4a4e'; circ(c, 1395, 655, 18);
    txt(c, 'SCELLÉS', 1395, 614, 'bold 14px Segoe UI', '#e8e0c8'); c.fillStyle = '#c8a050'; c.fillRect(1440, 640, 10, 30);
    dust(c, t, 22, 300, 0, 1000, 620, '#fff4d0'); vign(c, .75);
  }

  function thC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 620, 0, '#1a1612', 1, '#2a241c'); c.fillRect(0, 0, W, 620);
    // Poutres du plancher de scène au-dessus
    c.fillStyle = '#3a2a1a'; c.fillRect(0, 0, W, 50); for (let x = 0; x < W; x += 160) c.fillRect(x, 0, 30, 140);
    c.fillStyle = '#4a3622'; for (let x = 60; x < W; x += 160) { c.save(); c.translate(x, 140); c.rotate(.6); c.fillRect(0, 0, 18, 200); c.restore(); }
    // Rai de lumière par la trappe ouverte
    c.fillStyle = 'rgba(255,230,170,.12)'; poly(c, [[740, 40], [860, 40], [1000, 900], [600, 900]]); c.fill();
    c.fillStyle = '#ffe8b0'; c.fillRect(740, 30, 120, 18); glow(c, 800, 40, 220, '#ffe8b0', .45);
    // Échelle
    c.fillStyle = '#6a4a2a'; c.fillRect(740, 50, 14, 560); c.fillRect(846, 50, 14, 560); for (let y = 90; y < 600; y += 52) c.fillRect(740, y, 120, 10);
    // Étagère de gauche
    c.fillStyle = '#3a2818'; c.fillRect(80, 180, 14, 440); c.fillRect(386, 180, 14, 440); [240, 400, 560].forEach(y => c.fillRect(80, y, 320, 14));
    c.fillStyle = '#8a7a5a'; for (let k = 0; k < 4; k++) { c.fillRect(110 + k * 64, 196, 40, 44); } c.fillStyle = '#6a4a3a'; ell(c, 330, 540, 50, 20); c.strokeStyle = '#8a7050'; c.lineWidth = 6; c.beginPath(); c.arc(330, 530, 36, 0, TAU); c.stroke();
    c.fillStyle = '#5a5a52'; for (let k = 0; k < 6; k++) c.fillRect(110 + k * 40, 500 + (k % 2) * 6, 26, 60 - (k % 2) * 6);
    if (!st.f.ev_rat) { c.fillStyle = lg(c, 160, 0, 280, 0, 0, '#8a7a2a', .5, '#d8c860', 1, '#7a6a20'); rr(c, 170, 322, 110, 78, 4); c.fill(); c.fillStyle = '#c02020'; c.fillRect(170, 344, 110, 26); txt(c, 'RATICIDE', 225, 363, 'bold 15px Segoe UI', '#fff'); txt(c, '☠', 225, 396, '20px serif', '#1a1a1a'); glow(c, 225, 360, 70, '#fff0b0', .15); }
    else { c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(170, 392, 110, 8); }
    // Vieux décors
    c.fillStyle = '#5a6a8a'; poly(c, [[1160, 600], [1180, 240], [1300, 200], [1420, 260], [1440, 600]]); c.fill();
    c.fillStyle = '#8a9ab8'; for (let k = 0; k < 3; k++) c.fillRect(1200 + k * 80, 230 - k * 6, 40, 60); c.fillStyle = '#2a3048'; c.fillRect(1270, 450, 60, 150);
    c.fillStyle = '#e8e0d0'; ell(c, 1480, 300, 40, 50); c.fillStyle = '#1a1a1a'; ell(c, 1466, 290, 8, 10); ell(c, 1494, 290, 8, 10); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.beginPath(); c.arc(1480, 320, 14, .2, Math.PI - .2); c.stroke();
    c.fillStyle = '#6a2a4a'; poly(c, [[1340, 620], [1530, 560], [1540, 600], [1350, 650]]); c.fill();
    // Sol poussiéreux et traces
    c.fillStyle = lg(c, 0, 620, 0, H, 0, '#5a5246', 1, '#2a2620'); c.fillRect(0, 620, W, H - 620);
    c.fillStyle = 'rgba(200,190,170,.15)'; for (let k = 0; k < 120; k++) circ(c, R(k) * W, 630 + R(k + 50) * 270, 2 + R(k + 3) * 6);
    for (let k = 0; k < 9; k++) {
      const p = k / 8, x = 820 - p * 560 + (k % 2 ? 26 : -26), y = 860 - p * 210, s = 1 - p * .35;
      c.save(); c.translate(x, y); c.rotate(-.9); c.scale(s, s); c.fillStyle = 'rgba(20,14,10,.55)'; ell(c, 0, -10, 15, 24); ell(c, 0, 24, 12, 12); c.restore();
    }
    for (let k = 0; k < 4; k++) { const x = 580 + k * 160, y = 900 - k * 30; c.save(); c.translate(x, y - 40); c.rotate(.2 * k); c.fillStyle = 'rgba(20,14,10,.2)'; ell(c, 0, 0, 10, 18); c.restore(); }
    dust(c, t, 40, 600, 40, 400, 860, '#fff0c0'); vign(c, .85);
  }

  // ======================= LA TOILE DISPARUE =======================
  function frame(c, x, y, w, h, gild) {
    c.fillStyle = gild ? lg(c, x, y, x + w, y + h, 0, '#8a6a20', .5, '#e8c870', 1, '#7a5a18') : '#2a2a2a'; c.fillRect(x - 18, y - 18, w + 36, h + 36);
    c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x - 4, y - 4, w + 8, h + 8);
  }
  function bay(c, x, y, w, h, t) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = lg(c, 0, y, 0, y + h * .6, 0, '#2a3a6a', .5, '#c86a4a', 1, '#f0b060'); c.fillRect(x, y, w, h * .6);
    c.fillStyle = '#f8d890'; circ(c, x + w * .7, y + h * .55, 22);
    c.fillStyle = '#3a3050'; poly(c, [[x, y + h * .6], [x + w * .2, y + h * .38], [x + w * .45, y + h * .5], [x + w * .65, y + h * .4], [x + w, y + h * .58], [x + w, y + h * .62], [x, y + h * .62]]); c.fill();
    c.fillStyle = lg(c, 0, y + h * .6, 0, y + h, 0, '#5a4a6a', 1, '#1a2a4a'); c.fillRect(x, y + h * .6, w, h * .4);
    c.fillStyle = 'rgba(248,200,120,.5)'; for (let k = 0; k < 6; k++) c.fillRect(x + w * .7 - 30 + Math.sin(t + k) * 6, y + h * .65 + k * 12, 60 - k * 8, 3);
    c.fillStyle = '#1a1a2a'; c.fillRect(x + w * .2, y + h * .74, 50, 8); c.fillRect(x + w * .2 + 22, y + h * .56, 4, 64);
    c.restore();
  }
  function muA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 660, 0, '#e8e2d6', 1, '#c8c0b0'); c.fillRect(0, 0, W, 660);
    c.fillStyle = '#d8d0c0'; c.fillRect(0, 0, W, 30);
    c.fillStyle = lg(c, 0, 660, 0, H, 0, '#8a6a4a', 1, '#4a3424'); c.fillRect(0, 660, W, H - 660);
    c.strokeStyle = 'rgba(0,0,0,.15)'; c.lineWidth = 2; for (let x = 0; x < W; x += 80) { c.beginPath(); c.moveTo(x, 660); c.lineTo(x + (x - 800) * .3, H); c.stroke(); }
    // Spots
    for (const x of [300, 800, 1300]) { c.fillStyle = '#2a2a2a'; c.fillRect(x - 20, 30, 40, 22); c.fillStyle = 'rgba(255,248,220,.1)'; poly(c, [[x - 14, 52], [x + 14, 52], [x + 220, 600], [x - 220, 600]]); c.fill(); }
    // Caméra
    c.fillStyle = '#3a3a3e'; c.fillRect(60, 40, 18, 40); rr(c, 70, 70, 90, 46, 8); c.fill(); c.fillStyle = '#1a1a1a'; circ(c, 158, 93, 16); c.fillStyle = '#40e060'; circ(c, 90, 82, 5); glow(c, 90, 82, 18, '#40e060', .7);
    // Autre tableau (paysage d'hiver)
    frame(c, 130, 180, 220, 170, 1); c.fillStyle = lg(c, 0, 180, 0, 300, 0, '#9ab0c8', 1, '#e8eef4'); c.fillRect(130, 180, 220, 170);
    c.fillStyle = '#f8f8fc'; poly(c, [[130, 300], [220, 260], [350, 290], [350, 350], [130, 350]]); c.fill(); c.fillStyle = '#3a4a3a'; for (let k = 0; k < 4; k++) poly(c, [[160 + k * 40, 300], [172 + k * 40, 250], [184 + k * 40, 300]]), c.fill();
    // Le faux
    frame(c, 620, 150, 360, 250, 1); bay(c, 620, 150, 360, 250, t);
    c.fillStyle = '#c8b890'; c.fillRect(760, 440, 80, 30); txt(c, 'M. ARSENAULT · 1912', 800, 460, '11px Segoe UI', '#3a2a1a');
    c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(600, 500, 400, 4); c.fillStyle = '#b8a888'; for (let k = 0; k < 6; k++) c.fillRect(610 + k * 76, 500, 6, 60);
    // Chloé
    figure(c, t, 480, 660, 340, { coat: '#2a4a6a', legs: '#1a2a3a', hair: '#1a1410', long: 1, skin: '#e8cca8' });
    c.fillStyle = '#111'; rr(c, 512, 470, 16, 28, 3); c.fill(); c.fillStyle = '#4a8ad0'; c.fillRect(514, 474, 12, 20);
    // Banquette, note de la collègue, flûtes
    c.fillStyle = '#5a2a2a'; rr(c, 620, 600, 500, 50, 10); c.fill(); c.fillStyle = '#3a1a1a'; c.fillRect(640, 650, 20, 60); c.fillRect(1080, 650, 20, 60);
    paper(c, 660, 580, 120, 40, -.05, '#fffbe8'); c.fillStyle = '#f0d040'; c.fillRect(660, 578, 22, 22);
    for (let k = 0; k < 3; k++) { c.fillStyle = 'rgba(230,240,250,.7)'; c.fillRect(920 + k * 40, 540 + (k % 2) * 4, 12, 50); c.fillRect(912 + k * 40, 590, 28, 4); }
    paper(c, 1020, 576, 64, 44, .2, '#1a2a4a');
    // Vestiaire (portant de manteaux)
    c.fillStyle = '#6a6a70'; c.fillRect(70, 430, 270, 8); c.fillRect(74, 430, 8, 330); c.fillRect(328, 430, 8, 330);
    [['#3a3a3a', 100], ['#8a6a4a', 160], ['#c8b8a0', 220], ['#2a2a4a', 280]].forEach(([col, x]) => { c.fillStyle = col; poly(c, [[x - 24, 440], [x + 24, 440], [x + 34, 700], [x - 34, 700]]); c.fill(); });
    txt(c, 'VESTIAIRE', 205, 418, 'bold 14px Segoe UI', '#4a3a2a');
    // Issue de secours avec la neige
    c.fillStyle = '#5a5a5a'; c.fillRect(1250, 190, 260, 530); c.fillStyle = lg(c, 0, 200, 0, 700, 0, '#1a2a4a', 1, '#6a7a98'); c.fillRect(1268, 210, 224, 300);
    snowfall(c, t, 1268, 210, 224, 300, 50); c.fillStyle = '#e8eef8'; c.fillRect(1268, 470, 224, 40);
    c.fillStyle = '#7a7a7a'; c.fillRect(1268, 510, 224, 200); c.fillStyle = '#c8c8c8'; c.fillRect(1280, 560, 200, 18);
    c.fillStyle = '#1a8a3a'; c.fillRect(1310, 140, 140, 40); txt(c, 'SORTIE  EXIT', 1380, 167, 'bold 17px Segoe UI', '#fff'); glow(c, 1380, 160, 80, '#40e060', .3);
    dust(c, t, 10, 0, 0, W, 660, '#ffffff'); vign(c, .5);
  }

  function muB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#d8dcd8', 1, '#a8aca8'); c.fillRect(0, 0, W, 640);
    c.fillStyle = lg(c, 0, 640, 0, H, 0, '#7a7a74', 1, '#3a3a36'); c.fillRect(0, 640, W, H - 640);
    c.fillStyle = 'rgba(160,60,40,.18)'; for (let k = 0; k < 20; k++) circ(c, R(k) * W, 680 + R(k + 30) * 200, 4 + R(k + 2) * 10);
    // Tableau de liège
    c.fillStyle = '#8a6a3a'; c.fillRect(130, 140, 230, 220); c.fillStyle = '#c8a060'; c.fillRect(140, 150, 210, 200);
    paper(c, 150, 162, 80, 100, -.06); paper(c, 246, 170, 90, 70, .05); paper(c, 236, 252, 100, 84, -.03, st.f.ev_ins ? '#e8e0c8' : '#fff8e8');
    c.fillStyle = '#c02020'; circ(c, 190, 166, 6); circ(c, 290, 174, 6); circ(c, 286, 256, 6);
    // Fenêtre sur la baie enneigée
    c.fillStyle = lg(c, 0, 420, 0, 720, 0, '#4a5a7a', 1, '#9aaac0'); c.fillRect(70, 420, 280, 300);
    c.fillStyle = '#e8eef8'; poly(c, [[70, 640], [180, 600], [350, 630], [350, 720], [70, 720]]); c.fill();
    snowfall(c, t, 70, 420, 280, 300, 40); c.strokeStyle = '#e8e8e8'; c.lineWidth = 12; c.strokeRect(70, 420, 280, 300); c.lineWidth = 6; c.beginPath(); c.moveTo(210, 420); c.lineTo(210, 720); c.stroke();
    // Lampe UV
    c.fillStyle = '#3a3a3e'; c.fillRect(444, 290, 12, 380); ell(c, 450, 670, 50, 12);
    c.save(); c.translate(450, 280); c.rotate(.5); c.fillStyle = '#2a2a2e'; rr(c, -70, -26, 140, 52, 8); c.fill(); c.fillStyle = '#9a50ff'; c.fillRect(-60, 10, 120, 10); c.restore();
    glow(c, 500, 330, 180, '#a060ff', .3 * flick(t, 3));
    // Chevalet avec le châssis nu
    c.fillStyle = '#7a5a3a'; poly(c, [[730, 150], [750, 150], [900, 640], [880, 640]]); c.fill(); poly(c, [[730, 150], [750, 150], [600, 640], [580, 640]]); c.fill(); c.fillRect(735, 150, 10, 500);
    c.fillStyle = '#c8a878'; c.fillRect(590, 200, 300, 14); c.fillRect(590, 410, 300, 14); c.fillRect(590, 200, 14, 224); c.fillRect(876, 200, 14, 224);
    c.fillStyle = 'rgba(240,230,200,.5)'; c.fillRect(604, 214, 272, 196); c.strokeStyle = 'rgba(120,100,70,.35)'; c.lineWidth = 1;
    for (let k = 0; k < 14; k++) { c.beginPath(); c.moveTo(610 + R(k) * 260, 220 + R(k + 5) * 180); c.lineTo(610 + R(k + 2) * 260, 220 + R(k + 8) * 180); c.stroke(); }
    c.fillStyle = '#6a4a2a'; c.fillRect(600, 440, 290, 14);
    // Étagère des tubes saisis
    c.fillStyle = '#5a5a5e'; c.fillRect(1040, 390, 320, 12); c.fillRect(1040, 300, 320, 10);
    const tubes = ['#f8f8f8', '#f4f4f0', '#ececf0', '#f8f4ec', '#8a8a8a', '#b07a3a', '#1a3a7a', '#f0f0f4'];
    tubes.forEach((col, k) => { const x = 1056 + k * 38, y = k < 4 ? 250 : 340; c.fillStyle = col; rr(c, x, y, 26, 48, 4); c.fill(); c.fillStyle = '#2a2a2a'; c.fillRect(x + 7, y - 10, 12, 10); c.fillStyle = '#e8e0c0'; c.fillRect(x + 2, y + 28, 22, 10); });
    txt(c, 'SAISIE', 1200, 236, 'bold 14px Segoe UI', '#8a1a1a');
    // Table de travail et carnet d'esquisses
    c.fillStyle = '#8a6a4a'; c.fillRect(960, 560, 280, 16); c.fillRect(980, 576, 14, 180); c.fillRect(1210, 576, 14, 180);
    if (!st.f.ev_sketch) { c.fillStyle = '#2a2a3a'; c.fillRect(1000, 510, 160, 50); c.fillStyle = '#f4ecd8'; c.fillRect(1006, 514, 148, 42); c.strokeStyle = '#4a3a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(1010, 548); c.quadraticCurveTo(1050, 520, 1080, 540); c.quadraticCurveTo(1110, 520, 1150, 546); c.stroke(); }
    else { c.fillStyle = '#2a2a3a'; c.fillRect(1010, 540, 120, 18); }
    for (let k = 0; k < 4; k++) { c.fillStyle = '#c8a070'; c.fillRect(1170 + k * 10, 500, 4, 56); c.fillStyle = ['#c03030', '#3060c0', '#f0d040', '#2a2a2a'][k]; c.fillRect(1169 + k * 10, 496, 6, 10); }
    // Inès
    figure(c, t, 1390, 750, 380, { coat: '#3a3a40', smock: '#f0ece0', hair: '#2a1a12', bun: 1, skin: '#d8b090' });
    glow(c, 700, 100, 700, '#ffffff', .1); dust(c, t, 12, 0, 0, W, 640, '#ffffff'); vign(c, .55);
  }

  function muC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#3a4048', 1, '#2a2e34'); c.fillRect(0, 0, W, 640);
    c.fillStyle = lg(c, 0, 640, 0, H, 0, '#4a4e54', 1, '#1a1c20'); c.fillRect(0, 640, W, H - 640);
    // Mur d'écrans
    c.fillStyle = '#111'; c.fillRect(100, 100, 460, 300);
    for (let k = 0; k < 6; k++) {
      const x = 116 + (k % 3) * 148, y = 116 + Math.floor(k / 3) * 140, dead = k === 0 && Math.floor(t * 2) % 2;
      c.fillStyle = k === 0 ? (dead ? '#1a1a2a' : '#2a2a4a') : lg(c, 0, y, 0, y + 124, 0, '#2a4a5a', 1, '#1a2a34'); c.fillRect(x, y, 132, 124);
      if (k === 0) txt(c, 'SALLE 3 — NO SIGNAL', x + 66, y + 66, 'bold 11px Consolas', '#e04040');
      else { c.fillStyle = 'rgba(200,230,240,.3)'; c.fillRect(x + 20, y + 60 + R(k) * 30, 92, 4); c.fillRect(x + 40, y + 30, 6, 60); }
      c.fillStyle = 'rgba(255,255,255,.04)'; for (let s = 0; s < 124; s += 6) c.fillRect(x, y + s + mod(t * 20, 6), 132, 2);
    }
    // Bureau, ordinateur des badges, téléphone
    c.fillStyle = '#5a5a60'; c.fillRect(100, 520, 560, 16); c.fillStyle = '#3a3a40'; c.fillRect(120, 536, 520, 200);
    c.fillStyle = '#111'; rr(c, 170, 420, 230, 100, 4); c.fill(); c.fillStyle = '#0a2a1a'; c.fillRect(180, 428, 210, 84);
    for (let k = 0; k < 5; k++) txt(c, ['23:30 J.ROY CAM-3 OFF', '23:41 J.ROY EXIT-3', '23:52 J.ROY DOCK', '23:55 J.ROY CAM-3 ON', '06:12 I.HADDAD ATL'][k], 188, 446 + k * 15, '11px Consolas', '#40e080', 'left');
    c.fillStyle = '#2a2a2a'; c.fillRect(420, 500, 70, 20); c.fillStyle = '#d8d0c0'; c.fillRect(424, 502, 62, 14);
    c.fillStyle = '#1a1a1a'; rr(c, 530, 470, 80, 46, 6); c.fill(); c.fillStyle = '#2a2a2a'; ell(c, 570, 466, 42, 12); c.fillStyle = '#c03030'; circ(c, 596, 488, 5); glow(c, 596, 488, 16, '#ff4040', .6 * (Math.sin(t * 4) > 0 ? 1 : .3));
    // Casiers
    for (let k = 0; k < 3; k++) { const x = 650 + k * 72; c.fillStyle = '#6a7a88'; c.fillRect(x, 200, 66, 480); c.fillStyle = '#5a6a78'; c.fillRect(x + 6, 210, 54, 220); c.fillRect(x + 6, 440, 54, 230);
      for (let s = 0; s < 4; s++) { c.fillStyle = '#3a4a58'; c.fillRect(x + 16, 226 + s * 10, 34, 4); } c.fillStyle = '#c8c8c8'; c.fillRect(x + 50, 320, 6, 24); }
    c.fillStyle = '#f0e8d0'; c.fillRect(670, 380, 40, 18); txt(c, 'J. ROY', 690, 393, 'bold 10px Segoe UI', '#2a2a2a');
    // Julien
    figure(c, t, 965, 720, 390, { coat: '#2a3a5a', legs: '#1a2438', cap: '#1a2438', hair: '#5a5a5a', skin: '#e0c0a0', shirt: '#c8d0e0' });
    c.fillStyle = '#d8b040'; circ(c, 940, 470, 8);
    // Porte vitrée du quai et la neige
    c.fillStyle = '#5a5e64'; c.fillRect(1100, 70, 420, 230); c.fillStyle = lg(c, 0, 80, 0, 290, 0, '#1a2440', 1, '#5a6a88'); c.fillRect(1116, 86, 388, 198);
    snowfall(c, t, 1116, 86, 388, 198, 60); c.fillStyle = '#e8eef8'; c.fillRect(1116, 250, 388, 34);
    c.fillStyle = 'rgba(30,40,60,.6)'; for (let k = 0; k < 6; k++) ell(c, 1140 + k * 60, 266 - (k % 2) * 6, 10, 5);
    c.strokeStyle = '#3a3e44'; c.lineWidth = 6; c.beginPath(); c.moveTo(1310, 86); c.lineTo(1310, 284); c.stroke();
    // Caisse n° 12 et son bordereau
    c.fillStyle = lg(c, 1100, 0, 1500, 0, 0, '#a88050', .5, '#c8a070', 1, '#906a40'); c.fillRect(1110, 420, 380, 290);
    c.strokeStyle = '#6a4a2a'; c.lineWidth = 8; c.strokeRect(1114, 424, 372, 282); c.beginPath(); c.moveTo(1114, 424); c.lineTo(1486, 706); c.stroke();
    for (let y = 470; y < 700; y += 50) { c.fillStyle = 'rgba(90,60,30,.35)'; c.fillRect(1118, y, 364, 3); }
    txt(c, 'N° 12', 1300, 560, 'bold 54px Cambria', '#3a2010'); txt(c, '↑ FRAGILE ↑', 1300, 610, 'bold 22px Segoe UI', '#a02020');
    c.fillStyle = '#c02020'; c.fillRect(1180, 420, 22, 40); c.fillRect(1400, 420, 22, 40);
    if (!st.f.ev_manifest) { paper(c, 1120, 316, 120, 64, -.04, '#fff8e0'); c.fillStyle = '#4a4a4a'; c.fillRect(1172, 312, 16, 10); }
    else paper(c, 1130, 340, 90, 40, -.04, '#e8e0c8');
    c.fillStyle = '#2a2a2a'; c.fillRect(1100, 712, 400, 14);
    glow(c, 330, 250, 400, '#80c0ff', .12); dust(c, t, 10, 0, 0, W, 640, '#c0d8ff'); vign(c, .7);
  }

  Object.assign(window.Scenes, { thA, thB, thC, muA, muB, muC });
})();

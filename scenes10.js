// Décors : La Recette de Bà Hạnh (appartement, restaurant, cuisine) et Le Serment du Lac de Jade (pavillons, grotte).
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const ell = (c, x, y, rx, ry) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col, al = 'center') => { c.font = font; c.fillStyle = col; c.textAlign = al; c.fillText(s, x, y); c.textAlign = 'left'; };

  // Nuit de neige sur Montréal, découpée dans un rectangle
  function snowNight(c, t, x, y, w, h) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = lg(c, 0, y, 0, y + h, 0, '#0c1630', 1, '#2a3550'); c.fillRect(x, y, w, h);
    for (let k = 0; k < 6; k++) { const bx = x + k * w / 5 - 20, bh = 90 + R(k + 3) * 120; c.fillStyle = '#141c30'; c.fillRect(bx, y + h - bh, w / 5 - 6, bh);
      c.fillStyle = 'rgba(255,214,140,.75)'; for (let j = 0; j < 6; j++) if (R(k * 9 + j) > .45) c.fillRect(bx + 8 + (j % 3) * 18, y + h - bh + 14 + Math.floor(j / 3) * 26, 9, 12); }
    c.fillStyle = '#e8eef8'; c.fillRect(x, y + h - 26, w, 26);
    c.fillStyle = '#fff';
    for (let k = 0; k < 60; k++) { const sx = x + mod(R(k) * w + Math.sin(t * .7 + k) * 14, w), sy = y + mod(R(k + 7) * h + t * (26 + R(k + 2) * 30), h); c.globalAlpha = .5 + R(k + 1) * .5; circ(c, sx, sy, 1.2 + R(k + 4) * 2); }
    c.globalAlpha = 1; c.restore();
  }
  function frameWin(c, x, y, w, h, col) {
    c.strokeStyle = col; c.lineWidth = 14; c.strokeRect(x, y, w, h);
    c.lineWidth = 7; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h / 2); c.lineTo(x + w, y + h / 2); c.stroke();
  }
  function woodFloor(c, y0, a, b) {
    c.fillStyle = lg(c, 0, y0, 0, H, 0, a, 1, b); c.fillRect(0, y0, W, H - y0);
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let y = y0 + 22; y < H; y += 36) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  }
  function smoke(c, t, x, y, n, col) {
    c.save(); c.strokeStyle = col; c.lineWidth = 2;
    for (let k = 0; k < n; k++) { c.globalAlpha = .35; c.beginPath(); for (let s = 0; s < 30; s++) { const yy = y - s * 6, xx = x + k * 6 + Math.sin(s * .3 + t * 1.5 + k) * s * .5; if (!s) c.moveTo(xx, yy); else c.lineTo(xx, yy); } c.stroke(); }
    c.restore();
  }
  function steam(c, t, x, y, w, n) {
    c.save();
    for (let k = 0; k < n; k++) { const ph = mod(t * .25 + R(k), 1); c.globalAlpha = .28 * (1 - ph); c.fillStyle = '#f4f6f8'; ell(c, x + R(k + 2) * w + Math.sin(t + k) * 14, y - ph * 220, 30 + ph * 40, 18 + ph * 26); }
    c.restore();
  }
  function candle(c, t, x, y, k) {
    c.fillStyle = '#c8202a'; c.fillRect(x - 7, y - 44, 14, 44); c.fillStyle = '#e8c060'; c.fillRect(x - 10, y - 4, 20, 6);
    const f = flick(t, k); c.fillStyle = '#ffd27a'; ell(c, x, y - 52, 4 * f, 9 * f); glow(c, x, y - 52, 60, '#ffb050', .5 * f);
  }

  // ======================= LA RECETTE DE BÀ HẠNH =======================
  function phoA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#6a5240', 1, '#4a3828'); c.fillRect(0, 0, W, 640);
    c.fillStyle = 'rgba(255,240,200,.05)'; for (let x = 0; x < W; x += 48) c.fillRect(x, 0, 2, 640);
    c.fillStyle = '#3a2a1e'; c.fillRect(0, 610, W, 30);
    woodFloor(c, 640, '#5a4030', '#22170f');
    c.fillStyle = 'rgba(140,30,30,.45)'; ell(c, 800, 790, 520, 70);
    // Fenêtre sur la neige
    snowNight(c, t, 70, 110, 320, 320); frameWin(c, 70, 110, 320, 320, '#e0d6c4');
    c.fillStyle = '#c8bca8'; c.fillRect(56, 430, 348, 16);
    // Calendrier à effeuiller
    c.fillStyle = '#f4efe2'; c.fillRect(450, 140, 84, 120); c.fillStyle = '#c0282a'; c.fillRect(450, 140, 84, 26);
    txt(c, 'THÁNG 12', 492, 159, 'bold 13px Segoe UI', '#fff'); txt(c, '28', 492, 222, 'bold 48px Georgia', '#c0282a'); txt(c, 'Thứ Bảy', 492, 248, '13px Segoe UI', '#5a4a3a');
    // Autel
    c.fillStyle = '#4a0e10'; c.fillRect(580, 130, 400, 280); c.strokeStyle = '#d8a840'; c.lineWidth = 6; c.strokeRect(588, 138, 384, 264);
    c.fillStyle = 'rgba(216,168,64,.35)'; for (let k = 0; k < 6; k++) circ(c, 610 + k * 68, 392, 5);
    [[620, 'tam'], [820, 'ba']].forEach(([x, who]) => {
      c.fillStyle = '#d8a840'; c.fillRect(x - 6, 154, 132, 172); c.fillStyle = lg(c, 0, 160, 0, 320, 0, '#b8b0a4', 1, '#7a7268'); c.fillRect(x, 160, 120, 160);
      c.fillStyle = who === 'tam' ? '#f0eee8' : '#3a5a7a'; poly(c, [[x + 18, 320], [x + 34, 268], [x + 86, 268], [x + 102, 320]]); c.fill();
      c.fillStyle = '#d8c4a8'; ell(c, x + 60, 232, 26, 32); c.fillStyle = '#2a2420';
      if (who === 'tam') { c.beginPath(); c.ellipse(x + 60, 212, 28, 16, 0, Math.PI, TAU); c.fill(); }
      else { c.beginPath(); c.ellipse(x + 60, 214, 29, 18, 0, Math.PI, TAU); c.fill(); circ(c, x + 60, 196, 12); }
      c.fillStyle = '#3a2a20'; circ(c, x + 50, 232, 2.5); circ(c, x + 70, 232, 2.5); c.strokeStyle = '#7a4a3a'; c.lineWidth = 2; c.beginPath(); c.arc(x + 60, 244, 8, .3, Math.PI - (who === 'ba' ? .8 : .3)); c.stroke();
    });
    c.fillStyle = '#d8a840'; c.fillRect(756, 214, 48, 64); c.fillStyle = '#8a8274'; c.fillRect(760, 218, 40, 56); c.fillStyle = '#3a342c'; circ(c, 780, 236, 7); c.fillRect(766, 248, 4, 24); c.fillRect(764, 252, 34, 3);
    c.fillStyle = lg(c, 0, 400, 0, 430, 0, '#a8242a', 1, '#6a1216'); c.fillRect(550, 405, 460, 26);
    c.fillStyle = lg(c, 0, 430, 0, 700, 0, '#7a1418', 1, '#3a0a0c'); c.fillRect(570, 430, 420, 270); c.strokeStyle = '#d8a840'; c.lineWidth = 4; c.strokeRect(590, 450, 180, 230); c.strokeRect(790, 450, 180, 230);
    c.fillStyle = '#d8a840'; txt(c, '福', 680, 590, 'bold 70px serif', '#d8a840'); txt(c, '壽', 880, 590, 'bold 70px serif', '#d8a840');
    candle(c, t, 620, 404, 1); candle(c, t, 990, 404, 2);
    // Bol à encens
    c.fillStyle = lg(c, 740, 0, 830, 0, 0, '#8a6a2a', .5, '#e8c870', 1, '#7a5a20'); c.beginPath(); c.moveTo(742, 372); c.quadraticCurveTo(785, 420, 828, 372); c.closePath(); c.fill(); ell(c, 785, 372, 43, 8);
    c.fillStyle = '#9a9088'; ell(c, 785, 372, 38, 6);
    for (let k = 0; k < 3; k++) { const x = 772 + k * 13; c.strokeStyle = '#a02a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, 372); c.lineTo(x + (k - 1) * 3, 322); c.stroke(); c.fillStyle = '#ff7a30'; circ(c, x + (k - 1) * 3, 322, 2.5); glow(c, x + (k - 1) * 3, 322, 16, '#ff7a30', .6); }
    smoke(c, t, 774, 318, 3, 'rgba(230,230,230,.6)');
    // Fruits
    c.fillStyle = '#d8a840'; ell(c, 935, 398, 50, 9); c.fillStyle = '#e8d040'; ell(c, 935, 372, 26, 24); c.fillStyle = '#f0a020'; circ(c, 905, 386, 14); circ(c, 965, 386, 14); c.fillStyle = '#e84a20'; circ(c, 935, 352, 12); c.fillStyle = '#4a8a30'; c.fillRect(933, 336, 4, 8);
    // Étagère et lecteur de cassettes
    c.fillStyle = '#3a2618'; c.fillRect(1100, 268, 420, 14);
    c.fillStyle = '#2a2a2e'; rr(c, 1160, 190, 180, 78, 8); c.fill(); c.fillStyle = '#4a4a52'; rr(c, 1176, 202, 110, 46, 4); c.fill();
    const spin = t * 2; [1206, 1256].forEach(x => { c.fillStyle = '#d8d0c0'; circ(c, x, 225, 14); c.strokeStyle = '#2a2a2e'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { const a = spin + k * TAU / 3; c.beginPath(); c.moveTo(x, 225); c.lineTo(x + Math.cos(a) * 12, 225 + Math.sin(a) * 12); c.stroke(); } });
    c.fillStyle = '#c0282a'; c.fillRect(1296, 206, 30, 10); c.fillStyle = '#8a8a90'; for (let k = 0; k < 4; k++) c.fillRect(1180 + k * 26, 254, 20, 8);
    c.fillStyle = '#f4efe2'; c.fillRect(1380, 210, 26, 58); c.fillRect(1410, 220, 22, 48); c.fillStyle = '#8a2a2a'; c.fillRect(1440, 200, 30, 68);
    // Petite table, carnet, lampe
    c.fillStyle = '#5a3a24'; c.fillRect(1160, 566, 180, 14); c.fillRect(1176, 580, 12, 220); c.fillRect(1312, 580, 12, 220);
    if (!st.f.pz_log) { c.fillStyle = '#e8dcc0'; [[1196, 552, -.2], [1232, 548, .15], [1214, 540, .05]].forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); c.fillRect(-22, -14, 44, 28); c.restore(); }); }
    else { c.fillStyle = '#6a2a2a'; c.fillRect(1186, 542, 80, 22); c.fillStyle = '#e8dcc0'; c.fillRect(1190, 538, 72, 6); }
    c.fillStyle = '#c8a050'; c.fillRect(1306, 470, 6, 96); ell(c, 1309, 564, 18, 5);
    c.fillStyle = '#f0d8a0'; poly(c, [[1278, 470], [1340, 470], [1328, 430], [1290, 430]]); c.fill(); glow(c, 1309, 470, 220, '#ffd890', .5);
    // Fauteuil avec coussin à la grue
    c.fillStyle = '#6a3a2a'; rr(c, 1360, 430, 200, 230, 26); c.fill(); c.fillStyle = '#7a4a34'; rr(c, 1340, 560, 240, 110, 20); c.fill();
    c.fillStyle = '#5a2a1e'; c.fillRect(1360, 670, 16, 120); c.fillRect(1544, 670, 16, 120);
    c.fillStyle = '#d8c8a0'; rr(c, 1400, 470, 120, 100, 14); c.fill(); c.strokeStyle = '#2a2a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(1430, 540); c.quadraticCurveTo(1460, 500, 1490, 490); c.moveTo(1460, 512); c.lineTo(1446, 552); c.moveTo(1470, 510); c.lineTo(1484, 550); c.stroke(); c.fillStyle = '#c0282a'; circ(c, 1493, 488, 4);
    glow(c, 785, 330, 260, '#ffb060', .22);
    dust(c, t, 16, 0, 0, W, 640, '#ffe0b0'); vign(c, .7);
  }

  function phoB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#6a9a84', 1, '#3e6a58'); c.fillRect(0, 0, W, 640);
    c.fillStyle = '#2e4a3e'; c.fillRect(0, 560, W, 80);
    c.fillStyle = '#d8d2c4'; c.fillRect(0, 640, W, 260);
    for (let y = 640; y < H; y += 44) for (let x = ((y - 640) / 44) % 2 * 44; x < W; x += 88) { c.fillStyle = '#2a2a2e'; c.fillRect(x, y, 44, 44); }
    c.fillStyle = lg(c, 0, 640, 0, H, 0, 'rgba(0,0,0,.1)', 1, 'rgba(0,0,0,.55)'); c.fillRect(0, 640, W, 260);
    // Vitrine
    snowNight(c, t + 3, 70, 90, 330, 330); frameWin(c, 70, 90, 330, 330, '#d8d2c4');
    c.save(); c.translate(235, 170); c.scale(-1, 1); txt(c, 'Phở Hạnh', 0, 0, 'bold 40px Georgia', 'rgba(255,90,70,.85)'); txt(c, 'depuis 1982', 0, 30, 'italic 18px Georgia', 'rgba(255,220,180,.8)'); c.restore();
    // Lanternes
    [470, 1110].forEach((x, k) => { c.strokeStyle = '#1a1a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 34); c.stroke(); const s = Math.sin(t * 1.2 + k) * .04; c.save(); c.translate(x, 34); c.rotate(s); c.fillStyle = '#d0202a'; ell(c, 0, 40, 34, 40); c.fillStyle = '#e8b030'; c.fillRect(-16, -2, 32, 8); c.fillRect(-16, 78, 32, 8); c.strokeStyle = '#e8b030'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 86); c.lineTo(0, 110); c.stroke(); c.restore(); glow(c, x, 74, 110, '#ff6040', .35); });
    // Menu
    c.fillStyle = '#1e2a24'; rr(c, 520, 110, 560, 200, 10); c.fill(); c.strokeStyle = '#a8803a'; c.lineWidth = 6; c.stroke();
    txt(c, 'THỰC ĐƠN', 800, 150, 'bold 26px Georgia', '#ffd27a');
    [['Phở tái', '14,50'], ['Phở chín', '14,50'], ['Phở nạm', '15,00'], ['Phở gầu', '15,50'], ['Phở đặc biệt', '16,50'], ['Cà phê sữa đá', '4,50']].forEach(([a, b], k) => {
      const x = k < 3 ? 550 : 820, y = 192 + (k % 3) * 38; txt(c, a, x, y, '20px Segoe UI', '#f0ece0', 'left'); txt(c, b + ' $', x + 230, y, '20px Segoe UI', '#ffd27a', 'right');
    });
    // Mur de photos
    for (let k = 0; k < 6; k++) { const x = 1160 + (k % 3) * 100, y = 96 + Math.floor(k / 3) * 86; c.fillStyle = '#f4efe2'; c.fillRect(x, y, 84, 72); c.fillStyle = lg(c, 0, y, 0, y + 64, 0, k % 2 ? '#8a7a6a' : '#6a7a8a', 1, '#3a3430'); c.fillRect(x + 5, y + 5, 74, 56);
      c.fillStyle = '#2a201a'; circ(c, x + 30, y + 30, 9); circ(c, x + 54, y + 32, 8); c.fillRect(x + 20, y + 40, 20, 20); c.fillRect(x + 45, y + 40, 18, 20); }
    // Table, herbes, condiments
    c.fillStyle = '#8a5a34'; c.fillRect(110, 600, 480, 20); c.fillStyle = '#6a4224'; c.fillRect(130, 620, 16, 180); c.fillRect(554, 620, 16, 180);
    [[180, 760], [480, 760]].forEach(([x, y]) => { c.fillStyle = '#c0282a'; ell(c, x, y - 70, 40, 10); c.fillRect(x - 30, y - 70, 6, 70); c.fillRect(x + 24, y - 70, 6, 70); });
    c.fillStyle = '#f4f4ee'; ell(c, 340, 598, 90, 18);
    if (!st.f.pz_herbs) { c.fillStyle = '#c8c8c0'; ell(c, 340, 594, 70, 10); }
    [['#3a8a3a', 300, 584], ['#2a6a2a', 330, 578], ['#5aa040', 360, 586], ['#f0f0d8', 392, 588], ['#7ac040', 280, 590]].forEach(([col, x, y]) => { c.fillStyle = col; ell(c, x, y, 20, 9); });
    c.fillStyle = '#9ad040'; ell(c, 405, 594, 12, 7); c.fillStyle = '#e02020'; ell(c, 312, 596, 7, 3); ell(c, 324, 598, 7, 3);
    c.fillStyle = '#d02a1a'; rr(c, 452, 528, 26, 70, 8); c.fill(); c.fillStyle = '#2a8a3a'; c.fillRect(456, 520, 18, 12);
    c.fillStyle = '#4a2a1a'; rr(c, 488, 536, 26, 62, 6); c.fill(); c.fillStyle = '#e8d0a0'; c.fillRect(490, 556, 22, 16);
    c.fillStyle = '#c8a070'; c.fillRect(522, 548, 22, 50); c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(526 + k * 5, 548); c.lineTo(524 + k * 6, 512); c.stroke(); }
    // Comptoir
    c.fillStyle = lg(c, 0, 486, 0, 800, 0, '#7a4a28', 1, '#3a2010'); c.fillRect(870, 486, 680, 314);
    c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 3; for (let x = 890; x < 1540; x += 130) c.strokeRect(x, 510, 110, 260);
    c.fillStyle = '#a87040'; c.fillRect(856, 470, 700, 20);
    // Mot de Lan
    c.save(); c.translate(960, 462); c.rotate(-.05); c.fillStyle = '#fbe98a'; c.fillRect(-60, -16, 120, 30); c.fillStyle = '#5a4a2a'; for (let k = 0; k < 3; k++) c.fillRect(-50, -8 + k * 7, 90 - k * 18, 2); c.restore();
    // Bols et plateaux
    for (let s = 0; s < 3; s++) for (let k = 0; k < 4; k++) { c.fillStyle = k % 2 ? '#e8e8e2' : '#f6f6f0'; c.beginPath(); c.ellipse(1080 + s * 56, 466 - k * 14, 26, 9, 0, 0, Math.PI); c.fill(); c.fillStyle = '#3a6ab0'; c.fillRect(1056 + s * 56, 462 - k * 14, 48, 2); }
    c.fillStyle = '#d8d8d0'; c.fillRect(1236, 440, 50, 30); c.fillStyle = '#f0ece0'; for (let k = 0; k < 8; k++) c.fillRect(1240 + k * 5, 444, 3, 20);
    if (st.f.pz_bowl) { c.fillStyle = '#f6f6f0'; ell(c, 1150, 400, 34, 12); c.fillStyle = '#c89a50'; ell(c, 1150, 398, 30, 8); steam(c, t, 1120, 390, 60, 4); }
    // Caisse
    c.fillStyle = '#3a3a40'; poly(c, [[1330, 470], [1480, 470], [1470, 400], [1340, 400]]); c.fill(); c.fillStyle = '#2a2a2e'; rr(c, 1360, 352, 100, 52, 6); c.fill();
    c.fillStyle = '#7ad890'; c.fillRect(1372, 362, 76, 22); txt(c, '0,00', 1410, 380, 'bold 16px Consolas', '#1a3a1a');
    c.fillStyle = '#c8c8cc'; for (let k = 0; k < 12; k++) c.fillRect(1352 + (k % 6) * 20, 414 + Math.floor(k / 6) * 22, 14, 14);
    c.fillStyle = '#f0e8d0'; ell(c, 1500, 452, 18, 20); c.fillStyle = '#c0282a'; ell(c, 1500, 452, 6, 6);
    glow(c, 800, 0, 700, '#fff0d0', .12); dust(c, t, 14, 0, 0, W, 640, '#fff0d0'); vign(c, .65);
  }

  function phoC(c, t, st) {
    c.fillStyle = '#b8c0bc'; c.fillRect(0, 0, W, 660);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 660); c.stroke(); } for (let y = 0; y < 660; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.fillStyle = lg(c, 0, 0, 0, 660, 0, 'rgba(0,0,0,.45)', .5, 'rgba(0,0,0,.15)', 1, 'rgba(0,0,0,.45)'); c.fillRect(0, 0, W, 660);
    c.fillStyle = '#3a3a3a'; c.fillRect(0, 660, W, 240); for (let x = 0; x < W; x += 80) { c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(x, 660, 78, 240); }
    // Ampoule
    c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.moveTo(780, 0); c.lineTo(780, 50); c.stroke(); c.fillStyle = '#fff4c0'; circ(c, 780, 62, 12); glow(c, 780, 62, 520, '#fff0c0', .38);
    // Étagère à épices
    c.fillStyle = '#5a3a24'; c.fillRect(90, 270, 380, 12); c.fillRect(90, 410, 380, 12);
    const jars = ['#5a2a1a', '#8a4a20', '#3a2a1a', '#4a3020', '#c8a040', '#7a5a2a', '#e8a020', '#3a2010', '#9a6a3a'];
    jars.forEach((col, k) => { const top = k < 5, x = top ? 112 + k * 72 : 130 + (k - 5) * 86, y = top ? 270 : 410, h = 70 + (k % 3) * 10;
      c.fillStyle = 'rgba(220,235,240,.35)'; rr(c, x, y - h, 50, h, 8); c.fill(); c.fillStyle = col; rr(c, x + 4, y - h * .7, 42, h * .7 - 4, 6); c.fill(); c.fillStyle = '#c0282a'; c.fillRect(x + 2, y - h - 10, 46, 12); c.fillStyle = '#f4efe2'; c.fillRect(x + 8, y - h * .5, 34, 14); });
    c.fillStyle = '#c8a050'; c.fillRect(380, 470, 80, 6); c.fillRect(416, 476, 8, 30); ell(c, 420, 466, 44, 6);
    // Note du goût au mur
    c.save(); c.translate(770, 150); c.rotate(.02); c.fillStyle = '#efe6cc'; c.fillRect(-140, -54, 280, 108);
    c.font = 'italic 18px Segoe Print, Comic Sans MS, cursive'; c.fillStyle = '#3a3a5a'; c.fillText('Mặn · Ngọt · Thơm', -124, -18); c.fillText('Nếm trước, nêm sau', -124, 10); c.fillStyle = '#a02020'; c.fillText('Ít thôi !', -124, 38); c.restore();
    // Fourneau et marmite
    c.fillStyle = '#5a5a60'; c.fillRect(530, 700, 460, 20); c.fillStyle = '#3a3a40'; c.fillRect(550, 720, 420, 100); c.fillStyle = '#2a2a2e'; c.fillRect(570, 820, 24, 70); c.fillRect(926, 820, 24, 70);
    if (st.f.spiced) for (let k = 0; k < 12; k++) { const f = flick(t, k); c.fillStyle = `rgba(80,140,255,${.6 * f})`; ell(c, 600 + k * 30, 694, 8, 14 * f); }
    c.fillStyle = lg(c, 580, 0, 940, 0, 0, '#7a7c80', .3, '#d8dade', .55, '#a8aaae', 1, '#5a5c60'); rr(c, 580, 430, 360, 270, 18); c.fill();
    c.fillStyle = '#c8cace'; ell(c, 760, 430, 186, 30); c.fillStyle = st.f.tasted ? '#c8904a' : st.f.spiced ? '#a8784a' : '#7a6a5a'; ell(c, 760, 434, 168, 22);
    c.fillStyle = 'rgba(255,240,200,.3)'; for (let k = 0; k < 7; k++) ell(c, 680 + R(k) * 160, 432 + Math.sin(t * 2 + k) * 3, 10, 3);
    c.strokeStyle = '#4a4a50'; c.lineWidth = 10; c.beginPath(); c.arc(572, 500, 20, Math.PI * .5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(948, 500, 20, -Math.PI * .5, Math.PI * .5); c.stroke();
    c.strokeStyle = '#9a9aa0'; c.lineWidth = 6; c.beginPath(); c.moveTo(860, 420); c.lineTo(960, 330); c.stroke(); c.fillStyle = '#9a9aa0'; ell(c, 846, 430, 22, 8);
    if (st.f.spiced) steam(c, t, 620, 420, 280, 10);
    // Grill à charbon
    c.fillStyle = '#8a4a2a'; poly(c, [[1030, 640], [1190, 640], [1176, 560], [1044, 560]]); c.fill(); c.fillStyle = '#2a1a10'; ell(c, 1110, 560, 66, 12);
    for (let k = 0; k < 7; k++) { c.fillStyle = `rgba(255,${90 + R(k) * 80},30,${.6 + .3 * Math.sin(t * 3 + k)})`; circ(c, 1062 + k * 15, 560, 5); }
    c.fillStyle = '#3a2a1e'; ell(c, 1086, 548, 18, 14); ell(c, 1124, 546, 16, 13); c.fillStyle = '#6a5030'; ell(c, 1152, 550, 14, 8);
    glow(c, 1110, 556, 120, '#ff7a30', .4); smoke(c, t, 1100, 536, 2, 'rgba(160,160,160,.4)');
    // Plan de travail, planche, couperet
    c.fillStyle = '#6a6a70'; c.fillRect(60, 600, 450, 22); c.fillStyle = '#4a3a2e'; c.fillRect(70, 622, 430, 200);
    c.fillStyle = '#b8884a'; ell(c, 270, 588, 150, 22); c.fillStyle = '#c87a7a'; for (let k = 0; k < 6; k++) ell(c, 200 + k * 22, 584, 12, 6);
    c.fillStyle = '#c8cacc'; poly(c, [[340, 556], [420, 556], [420, 596], [334, 596]]); c.fill(); c.fillStyle = '#3a2a1e'; c.fillRect(420, 570, 50, 12);
    // Étagère haute, boîte en fer
    c.fillStyle = '#5a3a24'; c.fillRect(1120, 270, 400, 12);
    c.fillStyle = '#2a4a8a'; rr(c, 1190, 180, 150, 90, 8); c.fill(); c.fillStyle = '#c8a040'; c.fillRect(1190, 196, 150, 6); c.fillRect(1190, 250, 150, 6);
    c.fillStyle = '#e8d8b0'; for (let k = 0; k < 5; k++) { const x = 1210 + k * 28; circ(c, x, 226, 8); c.fillStyle = '#d0404a'; circ(c, x, 226, 3); c.fillStyle = '#e8d8b0'; }
    c.fillStyle = '#c8a040'; rr(c, 1252, 250, 26, 26, 4); c.fill(); c.strokeStyle = '#c8a040'; c.lineWidth = 4; c.beginPath(); c.arc(1265, 250, 9, Math.PI, TAU); c.stroke();
    c.fillStyle = '#e8e4da'; for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(1400 + k * 40, 262, 18, 8, 0, Math.PI, TAU); c.fill(); }
    // Bocal de riz
    c.fillStyle = lg(c, 1240, 0, 1440, 0, 0, '#5a3418', .4, '#9a6030', 1, '#4a2a12'); c.beginPath(); c.moveTo(1270, 600); c.quadraticCurveTo(1220, 700, 1270, 800); c.lineTo(1410, 800); c.quadraticCurveTo(1460, 700, 1410, 600); c.closePath(); c.fill();
    c.fillStyle = '#3a2210'; ell(c, 1340, 598, 74, 16); c.fillStyle = '#6a4220'; ell(c, 1340, 586, 64, 14); c.fillRect(1326, 568, 28, 18);
    c.strokeStyle = 'rgba(255,220,160,.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(1250, 690); c.quadraticCurveTo(1340, 720, 1430, 690); c.stroke();
    dust(c, t, 12, 0, 0, W, 660, '#fff4d0'); vign(c, .6);
  }

  // ======================= LE SERMENT DU LAC DE JADE =======================
  function mountains(c, t, x, y, w, h) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = lg(c, 0, y, 0, y + h, 0, '#0a1430', 1, '#2a3a5a'); c.fillRect(x, y, w, h);
    [['#1a2a48', .55, 0], ['#14223a', .7, 3], ['#0e1a2c', .85, 7]].forEach(([col, base, s]) => {
      c.fillStyle = col; c.beginPath(); c.moveTo(x, y + h);
      for (let k = 0; k <= 12; k++) { const xx = x + k * w / 12, yy = y + h * base - (R(k + s) * .35 + (k % 3 === 1 ? .2 : 0)) * h * .6; c.lineTo(xx, yy); }
      c.lineTo(x + w, y + h); c.closePath(); c.fill();
    });
    c.fillStyle = 'rgba(200,215,240,.12)'; for (let k = 0; k < 4; k++) ell(c, x + mod(R(k) * w + t * 8, w + 300) - 150, y + h * (.6 + k * .08), 200, 18);
    c.restore();
  }
  function moon(c, t, x, y, r) { glow(c, x, y, r * 4, '#e8f0ff', .35); c.fillStyle = '#fbf6e0'; circ(c, x, y, r); c.fillStyle = 'rgba(200,190,160,.35)'; circ(c, x - r * .3, y - r * .2, r * .22); circ(c, x + r * .25, y + r * .3, r * .15); }
  function lantern(c, t, x, y, k) {
    c.strokeStyle = '#1a1010'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y - 40); c.stroke();
    const s = Math.sin(t * 1.1 + k) * .05; c.save(); c.translate(x, y); c.rotate(s); c.fillStyle = '#c81e24'; ell(c, 0, 0, 30, 40); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; for (let j = -2; j <= 2; j++) { c.beginPath(); c.ellipse(0, 0, Math.abs(j) * 7 + 1, 40, 0, 0, TAU); c.stroke(); }
    c.fillStyle = '#1a1010'; c.fillRect(-14, -44, 28, 8); c.fillRect(-14, 36, 28, 8); c.strokeStyle = '#e8b030'; c.beginPath(); c.moveTo(0, 44); c.lineTo(0, 70); c.stroke(); c.restore();
    glow(c, x, y, 120, '#ff7040', .4 * flick(t, k));
  }
  const TRI = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1]];

  function wuxA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#2a1a14', 1, '#1a100c'); c.fillRect(0, 0, W, 640);
    // Fenêtre ronde
    c.save(); c.beginPath(); c.arc(800, 230, 145, 0, TAU); c.clip(); mountains(c, t, 655, 85, 290, 290); moon(c, t, 850, 170, 34); c.restore();
    c.strokeStyle = '#5a2a1a'; c.lineWidth = 18; c.beginPath(); c.arc(800, 230, 150, 0, TAU); c.stroke();
    c.strokeStyle = 'rgba(90,42,26,.85)'; c.lineWidth = 5; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(800 + k * 55, 84); c.lineTo(800 + k * 55, 376); c.stroke(); } c.beginPath(); c.moveTo(652, 230); c.lineTo(948, 230); c.stroke();
    glow(c, 800, 230, 380, '#b8d0ff', .12);
    // Piliers rouges
    [[560, 40], [1020, 40]].forEach(([x, w]) => { c.fillStyle = lg(c, x, 0, x + w, 0, 0, '#6a1414', .5, '#a02020', 1, '#5a1010'); c.fillRect(x, 0, w, 640); });
    // Étagères à rouleaux
    [40, 1340].forEach(x => {
      c.fillStyle = '#3a2216'; c.fillRect(x, 120, 220, 560); c.strokeStyle = '#1a0e08'; c.lineWidth = 6; for (let r = 0; r < 5; r++) { c.beginPath(); c.moveTo(x, 120 + r * 112); c.lineTo(x + 220, 120 + r * 112); c.stroke(); }
      for (let r = 0; r < 5; r++) for (let k = 0; k < 6; k++) { const cx = x + 22 + k * 35, cy = 160 + r * 112 + (k % 2) * 12; c.fillStyle = '#e8dcc0'; circ(c, cx, cy, 13); c.fillStyle = ['#8a2a1a', '#2a5a3a', '#c8a040', '#2a3a6a'][(k + r) % 4]; circ(c, cx, cy, 6); }
    });
    // Lanternes
    lantern(c, t, 470, 160, 1); lantern(c, t, 1130, 160, 2);
    // Sol de bois
    woodFloor(c, 600, '#4a2e1e', '#1a100a');
    // Formation des huit trigrammes
    const ok = st.f.pz_bagua;
    c.save(); c.translate(800, 720); c.scale(1, .29);
    c.fillStyle = 'rgba(30,20,14,.6)'; circ(c, 0, 0, 360); c.strokeStyle = ok ? '#ffd27a' : '#a8803a'; c.lineWidth = 10; c.beginPath(); c.arc(0, 0, 350, 0, TAU); c.stroke(); c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.stroke();
    TRI.forEach((tr, k) => { const a = (-90 - k * 45) * Math.PI / 180; c.save(); c.translate(Math.cos(a) * 250, Math.sin(a) * 250); c.rotate(a + Math.PI / 2);
      c.fillStyle = ok ? '#ffd27a' : '#c8a050'; tr.forEach((v, j) => { const y = 30 - j * 26; if (v) c.fillRect(-48, y, 96, 14); else { c.fillRect(-48, y, 40, 14); c.fillRect(8, y, 40, 14); } }); c.restore(); });
    c.rotate(ok ? t * .4 : 0);
    c.fillStyle = '#f0e8d8'; c.beginPath(); c.arc(0, 0, 110, -Math.PI / 2, Math.PI / 2); c.arc(0, 55, 55, Math.PI / 2, -Math.PI / 2, true); c.arc(0, -55, 55, Math.PI / 2, -Math.PI / 2); c.fill();
    c.fillStyle = '#1a1010'; c.beginPath(); c.arc(0, 0, 110, Math.PI / 2, -Math.PI / 2); c.arc(0, -55, 55, -Math.PI / 2, Math.PI / 2, true); c.arc(0, 55, 55, -Math.PI / 2, Math.PI / 2); c.fill();
    c.fillStyle = '#1a1010'; circ(c, 0, -55, 16); c.fillStyle = '#f0e8d8'; circ(c, 0, 55, 16);
    c.restore();
    if (ok) glow(c, 800, 720, 380, '#ffd27a', .25 + .08 * Math.sin(t * 2));
    // Lutrin et Chronique
    c.fillStyle = '#4a2a18'; c.fillRect(392, 470, 16, 140); c.fillRect(352, 600, 96, 12);
    c.save(); c.translate(400, 450); c.rotate(-.12); c.fillStyle = '#5a3420'; c.fillRect(-100, -40, 200, 70);
    if (st.f.pz_chron) { c.fillStyle = '#d8c48a'; for (let k = 0; k < 14; k++) c.fillRect(-92 + k * 13, -54, 11, 76); c.fillStyle = '#3a2a1a'; for (let k = 0; k < 14; k++) for (let j = 0; j < 5; j++) c.fillRect(-89 + k * 13, -46 + j * 12, 5, 6); }
    else { c.fillStyle = '#d8c48a'; for (let k = 0; k < 9; k++) { c.save(); c.translate(-80 + k * 20, -20 + (k % 3) * 8); c.rotate((R(k) - .5) * 1.2); c.fillRect(-5, -36, 11, 72); c.restore(); } }
    c.restore();
    // Table basse et mot de Han
    c.fillStyle = '#3a2014'; c.fillRect(600, 512, 220, 14); c.fillRect(612, 526, 10, 70); c.fillRect(798, 526, 10, 70);
    c.save(); c.translate(708, 496); c.rotate(.04); c.fillStyle = '#efe4c8'; c.fillRect(-64, -16, 128, 30); c.fillStyle = '#2a1a10'; for (let k = 0; k < 6; k++) c.fillRect(46 - k * 18, -11, 4, 20); c.restore();
    // Brûle-parfum
    c.fillStyle = lg(c, 870, 0, 960, 0, 0, '#5a4a2a', .5, '#a8904a', 1, '#4a3a20'); c.beginPath(); c.moveTo(872, 500); c.quadraticCurveTo(915, 556, 958, 500); c.closePath(); c.fill(); ell(c, 915, 500, 44, 10);
    c.fillRect(884, 536, 6, 50); c.fillRect(940, 536, 6, 50); c.fillRect(912, 540, 6, 46);
    smoke(c, t, 906, 494, 3, 'rgba(220,220,230,.55)');
    // Coffret des cinq éléments
    c.fillStyle = '#1a1214'; rr(c, 1090, 340, 200, 240, 6); c.fill(); c.strokeStyle = '#c8a040'; c.lineWidth = 4; c.stroke();
    ['#2a8a3a', '#c02020', '#d8b030', '#e8e8e8', '#202020'].forEach((col, k) => { const y = 356 + k * 44, out = st.f.pz_wuxing ? 14 : 0; c.fillStyle = col; rr(c, 1106 + out, y, 168, 36, 4); c.fill(); c.strokeStyle = '#c8a040'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#c8a040'; circ(c, 1190 + out, y + 18, 5); });
    c.fillStyle = '#1a1214'; c.fillRect(1100, 580, 14, 30); c.fillRect(1266, 580, 14, 30);
    dust(c, t, 22, 0, 0, W, 640, '#ffe8c0'); vign(c, .75);
  }

  function wuxB(c, t, st) {
    mountains(c, t, 0, 0, W, 640); moon(c, t, 800, 170, 90);
    for (let k = 0; k < 40; k++) { c.fillStyle = '#fff'; c.globalAlpha = .3 + .4 * Math.abs(Math.sin(t + k)); circ(c, R(k) * W, R(k + 30) * 260, 1.3); } c.globalAlpha = 1;
    // Mur et porte de lune
    c.fillStyle = '#d8d0c0'; c.fillRect(0, 140, 470, 500); c.fillStyle = '#2a2a30'; c.fillRect(0, 124, 490, 24);
    c.save(); c.beginPath(); c.arc(260, 430, 170, 0, TAU); c.clip(); mountains(c, t + 5, 90, 260, 340, 340); c.fillStyle = 'rgba(200,210,230,.25)'; c.fillRect(90, 260, 340, 340); c.fillStyle = '#5a5a50'; poly(c, [[230, 600], [290, 600], [272, 480], [250, 480]]); c.fill(); c.restore();
    c.strokeStyle = '#8a8478'; c.lineWidth = 14; c.beginPath(); c.arc(260, 430, 172, 0, TAU); c.stroke();
    // Avant-toit
    c.fillStyle = '#1a1a20'; c.beginPath(); c.moveTo(0, 0); c.lineTo(W, 0); c.lineTo(W, 30); c.quadraticCurveTo(W - 60, 40, W - 40, 80); c.quadraticCurveTo(W - 160, 54, 800, 54); c.quadraticCurveTo(160, 54, 40, 80); c.quadraticCurveTo(60, 40, 0, 30); c.closePath(); c.fill();
    c.fillStyle = '#7a1a1a'; c.fillRect(0, 50, W, 10);
    lantern(c, t, 520, 150, 1); lantern(c, t, 1080, 150, 3);
    // Prunier
    c.strokeStyle = '#2a1a14'; c.lineCap = 'round';
    const br = [[1420, 640, 1400, 470, 26], [1400, 470, 1330, 340, 18], [1400, 470, 1490, 330, 16], [1330, 340, 1220, 260, 11], [1330, 340, 1360, 170, 10], [1490, 330, 1540, 200, 9], [1490, 330, 1420, 230, 8], [1220, 260, 1170, 170, 6], [1360, 170, 1300, 100, 5]];
    br.forEach(([a, b, x, y, w]) => { c.lineWidth = w; c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + x) / 2 + 20, (b + y) / 2, x, y); c.stroke(); }); c.lineCap = 'butt';
    for (let k = 0; k < 70; k++) { const b = br[1 + (k % 8)], u = R(k + 9); const x = b[0] + (b[2] - b[0]) * u + (R(k) - .5) * 30, y = b[1] + (b[3] - b[1]) * u + (R(k + 3) - .5) * 30; c.fillStyle = k % 3 ? '#f8d0dc' : '#fff4f6'; circ(c, x, y, 5 + R(k + 5) * 3); c.fillStyle = '#e04a6a'; circ(c, x, y, 1.6); }
    for (let k = 0; k < 14; k++) { const ph = mod(t * .08 + R(k), 1); c.fillStyle = 'rgba(250,210,220,.85)'; ell(c, 1200 + R(k + 2) * 380 - ph * 300 + Math.sin(t + k) * 20, 120 + ph * 700, 5, 3); }
    // Terrasse et étang
    c.fillStyle = lg(c, 0, 620, 0, 760, 0, '#6a6a70', 1, '#3a3a40'); c.fillRect(0, 620, W, 140); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let x = 0; x < W; x += 100) { c.beginPath(); c.moveTo(x, 620); c.lineTo(x - 30, 760); c.stroke(); }
    c.fillStyle = '#4a4a50'; c.fillRect(0, 752, W, 12);
    c.fillStyle = lg(c, 0, 764, 0, H, 0, '#0e1a30', 1, '#06101e'); c.fillRect(0, 764, W, 136);
    c.fillStyle = 'rgba(250,246,224,.5)'; ell(c, 800 + Math.sin(t) * 6, 820, 70, 14); c.fillStyle = 'rgba(250,246,224,.2)'; ell(c, 800, 852, 110, 8);
    [[180, 800], [330, 840], [520, 810], [1120, 830], [1350, 800]].forEach(([x, y], k) => { c.fillStyle = '#1e4a2a'; ell(c, x, y, 50, 14); if (k % 2) { c.fillStyle = '#f0a8c0'; ell(c, x + 10, y - 10, 10, 12); } });
    // Table basse et qin
    c.fillStyle = '#2a1810'; c.fillRect(560, 650, 540, 16); c.fillRect(580, 666, 14, 80); c.fillRect(1066, 666, 14, 80);
    c.fillStyle = lg(c, 0, 600, 0, 650, 0, '#3a1a10', 1, '#1a0a06'); c.beginPath(); c.moveTo(600, 606); c.quadraticCurveTo(830, 590, 1060, 612); c.lineTo(1060, 648); c.lineTo(600, 648); c.closePath(); c.fill();
    c.fillStyle = '#f0e8d0'; for (let k = 0; k < 13; k++) circ(c, 660 + k * 28, 616, 2.2);
    for (let k = 0; k < 7; k++) { const vib = st.f.pz_qin ? Math.sin(t * 40 + k) * .8 : 0; c.strokeStyle = 'rgba(240,230,200,.8)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(610, 620 + k * 4); c.lineTo(1050, 620 + k * 4 + vib); c.stroke(); }
    c.fillStyle = '#c8a040'; for (let k = 0; k < 7; k++) circ(c, 1040, 620 + k * 4, 2);
    if (st.f.pz_qin) glow(c, 830, 620, 260, '#ffe8b0', .25);
    // Partition
    c.fillStyle = '#3a2014'; c.fillRect(510, 540, 8, 110); c.save(); c.translate(514, 516); c.rotate(-.06); c.fillStyle = '#efe4c8'; c.fillRect(-46, -40, 92, 66); c.fillStyle = '#2a1a10'; for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) c.fillRect(-36 + k * 22, -32 + j * 14, 8, 8); c.restore();
    // Banc de pierre et paquet
    c.fillStyle = '#7a7a80'; c.fillRect(1170, 690, 260, 22); c.fillStyle = '#5a5a60'; c.fillRect(1190, 712, 34, 44); c.fillRect(1376, 712, 34, 44);
    if (!st.f.pz_letter) { c.fillStyle = '#2a4a7a'; ell(c, 1300, 672, 70, 26); c.fillStyle = '#1a3a6a'; poly(c, [[1290, 650], [1312, 650], [1330, 620], [1272, 624]]); c.fill(); c.fillStyle = 'rgba(160,200,255,.6)'; for (let k = 0; k < 4; k++) circ(c, 1250 + k * 30, 698 + (k % 2) * 4, 3); }
    else { c.fillStyle = '#2a4a7a'; ell(c, 1300, 684, 76, 12); c.fillStyle = '#5a3a20'; rr(c, 1236, 660, 130, 20, 8); c.fill(); }
    dust(c, t, 14, 0, 0, W, 640, '#e8f0ff'); vign(c, .6);
  }

  function wuxC(c, t, st) {
    c.fillStyle = rg(c, 800, 380, 1000, 0, '#1e3a5a', .6, '#0e1e34', 1, '#040a14'); c.fillRect(0, 0, W, H);
    // Stalactites
    for (let k = 0; k < 18; k++) { const x = k * 92 + R(k) * 40, h = 60 + R(k + 2) * 140; c.fillStyle = 'rgba(160,210,255,.25)'; poly(c, [[x - 18, 0], [x + 18, 0], [x + 2, h]]); c.fill(); c.fillStyle = 'rgba(220,240,255,.35)'; poly(c, [[x - 4, 0], [x + 4, 0], [x + 1, h * .7]]); c.fill(); }
    // Porte aux six sceaux
    c.fillStyle = '#2a3440'; c.beginPath(); c.moveTo(590, 740); c.lineTo(590, 260); c.quadraticCurveTo(800, 110, 1010, 260); c.lineTo(1010, 740); c.closePath(); c.fill();
    c.fillStyle = lg(c, 620, 0, 980, 0, 0, '#4a5462', .5, '#6a7684', 1, '#3a4452'); c.beginPath(); c.moveTo(620, 740); c.lineTo(620, 276); c.quadraticCurveTo(800, 150, 980, 276); c.lineTo(980, 740); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 4; c.beginPath(); c.moveTo(800, 190); c.lineTo(800, 740); c.stroke();
    c.strokeStyle = 'rgba(200,230,255,.3)'; c.lineWidth = 2; c.beginPath(); c.moveTo(700, 230); c.quadraticCurveTo(760, 200, 800, 214); c.quadraticCurveTo(850, 196, 890, 226); c.stroke();
    const seals = [['★', 'bagua'], ['●', 'wuxing'], ['▲', 'qin'], ['■', 'chron'], ['◆', 'letter'], ['♥', 'mirror']];
    seals.forEach(([s, id], k) => { const x = k < 3 ? 710 : 890, y = 340 + (k % 3) * 130, on = st.f['pz_' + id];
      c.fillStyle = on ? '#c8a040' : '#5a1a1a'; circ(c, x, y, 44); c.strokeStyle = on ? '#ffe8a0' : '#2a0a0a'; c.lineWidth = 5; c.beginPath(); c.arc(x, y, 44, 0, TAU); c.stroke();
      txt(c, s, x, y + 14, 'bold 38px Segoe UI Symbol, sans-serif', on ? '#3a1a06' : '#e8c8a0'); if (on) glow(c, x, y, 90, '#ffd27a', .35 + .1 * Math.sin(t * 2 + k)); });
    // Miroir de bronze
    c.fillStyle = '#3a2414'; c.fillRect(312, 470, 16, 180); c.fillRect(260, 640, 120, 14);
    c.fillStyle = lg(c, 220, 280, 420, 480, 0, '#5a3a14', .5, '#c8902a', 1, '#5a3a14'); circ(c, 320, 380, 112);
    const on = st.f.pz_mirror; c.fillStyle = rg(c, 300, 360, 100, 0, on ? '#fff0c0' : '#b8a070', 1, on ? '#c8902a' : '#5a4a2a'); circ(c, 320, 380, 94);
    c.fillStyle = `rgba(255,255,255,${.15 + .1 * Math.sin(t * 1.5)})`; poly(c, [[260, 320], [300, 300], [380, 420], [350, 440]]); c.fill();
    c.strokeStyle = 'rgba(90,60,20,.6)'; c.lineWidth = 3; for (let k = 0; k < 12; k++) { const a = k * TAU / 12; c.beginPath(); c.moveTo(320 + Math.cos(a) * 98, 380 + Math.sin(a) * 98); c.lineTo(320 + Math.cos(a) * 108, 380 + Math.sin(a) * 108); c.stroke(); }
    glow(c, 320, 380, 220, on ? '#ffd890' : '#a8c8ff', on ? .45 : .15 + .08 * Math.sin(t));
    // Cristaux de glace
    [[1250, 580, 60, 300], [1330, 580, 50, 380], [1410, 580, 70, 260], [1480, 580, 40, 200], [1200, 580, 36, 160]].forEach(([x, y, w, h], k) => {
      c.fillStyle = `rgba(150,210,255,${.3 + .05 * k})`; poly(c, [[x - w / 2, y], [x - w / 2, y - h * .8], [x, y - h], [x + w / 2, y - h * .8], [x + w / 2, y]]); c.fill();
      c.fillStyle = 'rgba(240,250,255,.35)'; poly(c, [[x - w / 6, y], [x - w / 6, y - h * .78], [x, y - h * .95], [x, y]]); c.fill(); });
    glow(c, 1350, 420, 260, '#a8d8ff', .2);
    // Lac gelé
    c.fillStyle = lg(c, 0, 740, 0, H, 0, '#9ac8e8', 1, '#3a6a90'); c.fillRect(0, 740, W, 160);
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; for (let k = 0; k < 10; k++) { const x = R(k) * W; c.beginPath(); c.moveTo(x, 760 + R(k + 1) * 120); c.lineTo(x + 60 + R(k + 2) * 80, 770 + R(k + 3) * 110); c.stroke(); }
    for (let k = 0; k < 40; k++) { c.fillStyle = 'rgba(240,170,190,.5)'; ell(c, R(k + 7) * W, 770 + R(k + 8) * 120, 5, 3); }
    c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(0, 740, W, 6);
    dust(c, t, 30, 0, 0, W, H, '#e0f0ff'); vign(c, .7);
  }

  Object.assign(window.Scenes, { phoA, phoB, phoC, wuxA, wuxB, wuxC });
})();

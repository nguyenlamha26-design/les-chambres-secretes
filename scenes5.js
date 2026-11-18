// Décors de « La maison des lanternes » et du « Train de nuit ».
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const snow = (c, t, n, x0, y0, w, h, wind = 30) => { c.fillStyle = '#fff'; for (let i = 0; i < n; i++) { const sp = 40 + R(i) * 60, x = x0 + mod(R(i + 3) * w + t * wind * (1 + R(i)), w), y = y0 + mod(R(i + 7) * h + t * sp, h); c.globalAlpha = .4 + R(i + 9) * .6; circ(c, x, y, 1 + R(i + 1) * 2.4); } c.globalAlpha = 1; };
  function lanternShape(c, x, y, s, col, t, k, lit = true) {
    const sw = Math.sin(t * 1.1 + k) * .06; c.save(); c.translate(x, y); c.rotate(sw);
    c.strokeStyle = '#2a1a0e'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -40 * s); c.lineTo(0, -22 * s); c.stroke();
    c.fillStyle = lit ? rg(c, 0, 0, 30 * s, 0, '#fff2c0', .45, col, 1, '#5a1010') : '#3a2a20'; c.beginPath(); c.ellipse(0, 0, 22 * s, 24 * s, 0, 0, TAU); c.fill();
    c.fillStyle = '#c9a050'; c.fillRect(-10 * s, -26 * s, 20 * s, 6 * s); c.fillRect(-10 * s, 20 * s, 20 * s, 6 * s);
    c.strokeStyle = 'rgba(80,20,10,.5)'; c.lineWidth = 1; for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(0, 0, Math.abs(i) * 12 * s + 4, 24 * s, 0, 0, TAU); c.stroke(); }
    c.strokeStyle = '#d9b24a'; c.beginPath(); for (let i = -2; i <= 2; i++) { c.moveTo(i * 4 * s, 26 * s); c.lineTo(i * 4 * s, 40 * s); } c.stroke();
    c.restore(); if (lit) glow(c, x, y, 90 * s, col, .35 * flick(t, k));
  }

  // ---------- Maison des lanternes : l'atelier ----------
  function lanternA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#3a2014', 1, '#160b06'); c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 70) { c.fillStyle = `rgba(0,0,0,${.08 + R(x) * .14})`; c.fillRect(x, 0, 68, 540); }
    c.save(); rr(c, 100, 100, 320, 300, 8); c.clip(); c.fillStyle = lg(c, 0, 100, 0, 400, 0, '#0b1430', 1, '#2a3060'); c.fillRect(100, 100, 320, 300);
    glow(c, 300, 180, 140, '#fff4c8', .5); c.fillStyle = '#fff6d8'; circ(c, 300, 180, 38);
    c.fillStyle = '#1a1010'; for (let i = 0; i < 5; i++) poly(c, [[100 + i * 70, 400], [135 + i * 70, 330 - R(i) * 30], [170 + i * 70, 400]]), c.fill();
    c.restore(); c.strokeStyle = '#5a2a14'; c.lineWidth = 10; c.strokeRect(100, 100, 320, 300); c.lineWidth = 4; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(100 + k * 80, 100); c.lineTo(100 + k * 80, 400); c.stroke(); }
    c.fillStyle = '#4a2a14'; c.fillRect(1060, 330, 460, 14);
    ['#e0453a', '#f2c230', '#e8701a', '#c0392b', '#ff7aa8'].forEach((col, k) => lanternShape(c, 1110 + k * 92, 230 + (k % 2) * 30, .9, col, t, k));
    // Cadre de soie
    c.fillStyle = '#5a2a14'; c.fillRect(740, 500, 20, 140); c.fillRect(600, 520, 12, 120); c.fillRect(888, 520, 12, 120);
    c.fillStyle = '#4a2410'; c.fillRect(560, 160, 380, 360); c.fillStyle = '#f6efdc'; c.fillRect(578, 178, 344, 324);
    const sv = st.v.__sym; const n = 8;
    for (let r = 0; r < 6; r++) for (let k = 0; k < n; k++) { const left = k < n / 2, on = (R(r * 13 + Math.min(k, n - 1 - k)) > .55) && (left || st.f.pz_symmetry); if (on) { c.fillStyle = (r + k) % 3 ? '#c0392b' : '#d9a520'; c.fillRect(590 + k * 41, 190 + r * 50, 38, 46); } }
    c.strokeStyle = 'rgba(90,40,20,.35)'; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(750, 178); c.lineTo(750, 502); c.stroke(); c.setLineDash([]);
    // Établi
    c.fillStyle = lg(c, 0, 540, 0, 580, 0, '#7a4a24', 1, '#4a2a12'); poly(c, [[60, 540], [1000, 540], [1030, 590], [30, 590]]); c.fill();
    c.fillStyle = lg(c, 0, 590, 0, H, 0, '#3e2410', 1, '#140a04'); c.fillRect(30, 590, 1000, 310);
    ['#d33a2c', '#efd23a', '#2e6fd1', '#f4f1e8', '#222'].forEach((col, k) => { const x = 140 + k * 66; c.fillStyle = '#6a5040'; rr(c, x - 26, 560, 52, 60, 10); c.fill(); c.fillStyle = col; c.beginPath(); c.ellipse(x, 566, 20, 7, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(x - 18, 580, 6, 30); });
    c.save(); c.translate(710, 640); c.rotate(-.06); c.fillStyle = '#efe0b8'; c.fillRect(-90, -34, 180, 68); c.strokeStyle = 'rgba(80,40,20,.5)'; c.lineWidth = 1.5; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-76, -20 + i * 10); c.lineTo(60 - R(i) * 30, -20 + i * 10); c.stroke(); } c.fillStyle = '#c0392b'; circ(c, 70, 20, 8); c.restore();
    // Comptoir et boulier
    c.fillStyle = lg(c, 0, 660, 0, 860, 0, '#6a3a1c', 1, '#2e180a'); c.fillRect(1060, 660, 400, 200); c.fillStyle = '#8a5a30'; c.fillRect(1050, 650, 420, 16);
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 3; c.strokeRect(1080, 700, 360, 110); c.fillStyle = '#c9a050'; c.fillRect(1240, 750, 40, 8);
    c.fillStyle = '#5a2a14'; c.fillRect(1090, 540, 340, 106); c.fillStyle = '#e8d6a8'; c.fillRect(1100, 550, 320, 86); c.fillStyle = '#5a2a14'; c.fillRect(1100, 576, 320, 6);
    for (let k = 0; k < 8; k++) { const x = 1120 + k * 40; c.fillStyle = '#3a2410'; c.fillRect(x - 1, 550, 3, 86); c.fillStyle = '#7a1a10'; c.beginPath(); c.ellipse(x, 562, 12, 7, 0, 0, TAU); c.fill(); for (let b = 0; b < 4; b++) { c.beginPath(); c.ellipse(x, 596 + b * 11, 12, 5, 0, 0, TAU); c.fill(); } }
    glow(c, 300, 160, 500, '#ffd27a', .12); dust(c, t, 22, 200, 100, 1200, 500, '#ffe6b8');
    vign(c, .78);
  }

  // ---------- Maison des lanternes : la cour ----------
  function lanternB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 520, 0, '#08102a', 1, '#1d2552'); c.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(255,255,255,${.2 + .5 * Math.abs(Math.sin(t * .6 + i))})`; c.fillRect(R(i) * W, R(i + 4) * 200, 2, 2); }
    glow(c, 1300, 110, 200, '#fff4c8', .5); c.fillStyle = '#fff6d8'; circ(c, 1300, 110, 50);
    c.fillStyle = '#d9c38a'; c.fillRect(0, 300, W, 260); c.fillStyle = 'rgba(80,50,20,.25)'; for (let i = 0; i < 30; i++) c.fillRect(R(i) * W, 300 + R(i + 2) * 240, 40 + R(i) * 80, 3);
    c.fillStyle = '#5a2a20'; poly(c, [[0, 300], [W, 300], [W, 270], [0, 270]]); c.fill(); for (let x = 0; x < W; x += 30) { c.fillStyle = x % 60 ? '#6a3020' : '#4a2018'; c.fillRect(x, 262, 28, 12); }
    // Portail
    c.fillStyle = '#4a2a14'; c.fillRect(600, 120, 400, 440); c.fillStyle = lg(c, 620, 0, 980, 0, 0, '#a82a1a', .5, '#c0392b', 1, '#8a2014'); c.fillRect(620, 140, 360, 400);
    c.strokeStyle = '#d9a520'; c.lineWidth = 4; c.beginPath(); c.moveTo(800, 140); c.lineTo(800, 540); c.stroke(); for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { c.fillStyle = '#d9a520'; circ(c, 700 + k * 200, 200 + r * 90, 9); }
    rr(c, 770, 320, 60, 70, 8); c.fillStyle = lg(c, 770, 320, 830, 390, 0, '#e8c468', 1, '#8a6a20'); c.fill(); txt(c, '★●▲', 800, 352, '14px Segoe UI Symbol', '#3a2a08'); txt(c, '■◆♥', 800, 374, '14px Segoe UI Symbol', '#3a2a08');
    c.fillStyle = '#3a2014'; poly(c, [[580, 120], [1020, 120], [980, 80], [620, 80]]); c.fill();
    // Guirlandes de lanternes
    c.strokeStyle = '#2a1a0e'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 40); c.quadraticCurveTo(800, 140, W, 40); c.stroke();
    for (let k = 0; k < 10; k++) { const x = 80 + k * 160, y = 40 + Math.sin(k / 9 * Math.PI) * 50 + 40; lanternShape(c, x, y, .8, ['#e0453a', '#f2c230', '#e8701a', '#ff7aa8'][k % 4], t, k, k !== 2); }
    // Puits
    c.fillStyle = lg(c, 100, 0, 380, 0, 0, '#6a6552', .5, '#8a8570', 1, '#4a4637'); rr(c, 120, 580, 240, 180, 20); c.fill(); c.fillStyle = '#0a0a10'; c.beginPath(); c.ellipse(240, 590, 110, 26, 0, 0, TAU); c.fill();
    c.fillStyle = '#4a2a14'; c.fillRect(130, 470, 14, 130); c.fillRect(336, 470, 14, 130); c.fillRect(120, 466, 240, 14); c.strokeStyle = '#8a7040'; c.beginPath(); c.moveTo(240, 480); c.lineTo(240, 540); c.stroke(); c.fillStyle = '#7a5a3a'; rr(c, 222, 540, 36, 30, 4); c.fill();
    // Tambour
    c.fillStyle = '#4a2a14'; c.fillRect(1250, 640, 14, 130); c.fillRect(1436, 640, 14, 130);
    const hit = st.f.pz_rhythm ? Math.sin(t * 3) * 2 : 0; c.fillStyle = lg(c, 1230, 0, 1470, 0, 0, '#8a1a10', .5, '#c0392b', 1, '#6a1008'); c.beginPath(); c.ellipse(1350, 560 + hit, 120, 110, 0, 0, TAU); c.fill();
    c.fillStyle = '#efe0b8'; c.beginPath(); c.ellipse(1350, 560 + hit, 92, 86, 0, 0, TAU); c.fill(); c.fillStyle = '#c0392b'; txt(c, '福', 1350, 590 + hit, 'bold 70px serif', '#c0392b');
    for (let k = 0; k < 16; k++) { const a = k * TAU / 16; c.fillStyle = '#d9a520'; circ(c, 1350 + Math.cos(a) * 106, 560 + hit + Math.sin(a) * 100, 4); }
    // Bassin aux carpes
    c.fillStyle = '#6a6552'; c.beginPath(); c.ellipse(800, 730, 300, 120, 0, 0, TAU); c.fill(); c.fillStyle = lg(c, 0, 620, 0, 840, 0, '#1d5a70', 1, '#0a2a38'); c.beginPath(); c.ellipse(800, 730, 270, 100, 0, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.ellipse(800, 730, 270, 100, 0, 0, TAU); c.clip();
    for (let k = 0; k < 5; k++) { const a = t * (.3 + k * .07) + k * 1.3, x = 800 + Math.cos(a) * (150 + k * 20), y = 730 + Math.sin(a) * (50 + k * 6); c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2); c.fillStyle = k ? ['#f4f1e8', '#e8701a', '#c0392b', '#f4f1e8'][k - 1] : (st.f.pz_rush ? 'rgba(0,0,0,0)' : '#f2c230'); c.beginPath(); c.ellipse(0, 0, 22, 9, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-18, 0); c.lineTo(-32, -9); c.lineTo(-32, 9); c.fill(); c.restore(); }
    [[640, 690], [940, 760], [760, 790]].forEach(([x, y], k) => { c.fillStyle = '#2e7a3a'; c.beginPath(); c.ellipse(x, y, 34, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#ff9ac0'; circ(c, x + 6, y - 8, 9); });
    c.restore();
    glow(c, 800, 300, 700, '#ffb070', .1); dust(c, t, 20, 0, 0, W, 600, '#ffd8a0');
    vign(c, .75);
  }

  // ---------- Maison des lanternes : le salon des ancêtres ----------
  function lanternC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#5a1410', 1, '#200604'); c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(217,165,32,.15)'; c.lineWidth = 2; for (let x = 0; x < W; x += 80) for (let y = 0; y < 560; y += 80) { c.strokeRect(x + 10, y + 10, 60, 60); }
    c.fillStyle = lg(c, 0, 600, 0, H, 0, '#3a1a0e', 1, '#120604'); c.fillRect(0, 600, W, 300);
    // Portrait
    c.fillStyle = '#d9a520'; c.fillRect(700, 80, 200, 170); c.fillStyle = '#e9dcc0'; c.fillRect(712, 92, 176, 146); c.fillStyle = '#5a4030'; circ(c, 800, 150, 34); c.fillRect(760, 184, 80, 54); c.fillStyle = '#e8c49a'; circ(c, 800, 150, 26); lanternShape(c, 862, 200, .4, '#e0453a', t, 9);
    // Autel
    c.fillStyle = lg(c, 0, 400, 0, 560, 0, '#8a2a14', 1, '#4a1008'); c.fillRect(520, 420, 560, 160); c.fillStyle = '#d9a520'; c.fillRect(500, 404, 600, 20);
    c.fillStyle = lg(c, 0, 570, 0, 690, 0, '#c0392b', 1, '#8a2014'); poly(c, [[600, 580], [1000, 580], [990, 690], [610, 690]]); c.fill(); c.strokeStyle = '#d9a520'; c.lineWidth = 3; c.strokeRect(620, 595, 360, 80); txt(c, '壽', 800, 655, 'bold 52px serif', '#d9a520');
    [[620, '#e8701a'], [680, '#f2c230'], [920, '#c0392b']].forEach(([x, col]) => { c.fillStyle = col; circ(c, x, 388, 16); circ(c, x + 18, 392, 14); });
    c.fillStyle = '#d9a520'; c.fillRect(780, 340, 40, 64); c.fillStyle = '#7a5a2a'; c.fillRect(788, 300, 4, 44); c.fillRect(800, 296, 4, 48); c.fillRect(812, 302, 4, 42);
    for (let k = 0; k < 3; k++) for (let i = 0; i < 8; i++) { const y = 290 - i * 22 - mod(t * 20, 22), x = 790 + k * 12 + Math.sin(t * 1.5 + i * .6 + k) * (i * 1.6); c.fillStyle = `rgba(230,230,230,${.12 * (1 - i / 8)})`; circ(c, x, y, 4 + i); }
    [560, 1040].forEach((x, k) => { c.fillStyle = '#efe0b8'; c.fillRect(x - 8, 340, 16, 64); const f = flick(t, k); c.fillStyle = '#ffd27a'; c.beginPath(); c.ellipse(x, 330, 5, 12 * f, 0, 0, TAU); c.fill(); glow(c, x, 330, 160, '#ffb050', .35 * f); });
    // Calendrier lunaire
    c.fillStyle = '#d9a520'; c.fillRect(100, 150, 280, 380); c.fillStyle = '#f4ead2'; c.fillRect(112, 162, 256, 356); txt(c, '月', 240, 210, 'bold 40px serif', '#c0392b');
    ['🐀', '🐃', '🐅', '🐈', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'].forEach((e, i) => txt(c, e, 150 + (i % 4) * 60, 270 + Math.floor(i / 4) * 80, '34px Segoe UI Emoji', '#000'));
    // Rouleau des devinettes
    c.fillStyle = '#5a2a14'; c.fillRect(1210, 126, 300, 14); c.fillRect(1210, 560, 300, 14);
    c.fillStyle = lg(c, 1220, 0, 1500, 0, 0, '#e9dcc0', .5, '#f6efdc', 1, '#d9c8a0'); c.fillRect(1222, 140, 276, 420);
    c.strokeStyle = 'rgba(40,20,10,.75)'; c.lineWidth = 4; for (let col = 0; col < 4; col++) for (let i = 0; i < 8; i++) { const x = 1460 - col * 60, y = 170 + i * 46; c.beginPath(); c.moveTo(x - 12, y); c.lineTo(x + 12, y + 4); c.moveTo(x, y - 10); c.lineTo(x - 4, y + 18); c.stroke(); }
    c.fillStyle = '#c0392b'; c.fillRect(1240, 510, 34, 34);
    lanternShape(c, 300, 60, .8, '#e0453a', t, 3); lanternShape(c, 1300, 60, .8, '#f2c230', t, 5);
    dust(c, t, 22, 300, 100, 1000, 500, '#ffd8a0');
    vign(c, .82);
  }

  // ---------- Train de nuit : le compartiment ----------
  function trainShake(c, t) { const sh = Math.sin(t * 40) * .3; c.translate(0, sh); }
  function trainA(c, t, st) {
    c.save(); trainShake(c, t);
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#4a3020', 1, '#1e120a'); c.fillRect(0, -2, W, H + 4);
    for (let x = 0; x < W; x += 60) { c.fillStyle = `rgba(0,0,0,${.08 + R(x + 1) * .12})`; c.fillRect(x, 0, 58, 540); }
    c.fillStyle = '#2e5a3a'; c.fillRect(0, 520, W, 40);
    c.save(); rr(c, 500, 110, 600, 340, 40); c.clip(); c.fillStyle = lg(c, 0, 110, 0, 450, 0, '#0a1020', 1, '#1a2438'); c.fillRect(500, 110, 600, 340);
    c.fillStyle = '#e8eef6'; poly(c, [[500, 450], [1100, 450], [1100, 400], [800, 380], [500, 410]]); c.fill();
    c.strokeStyle = '#2a3040'; c.lineWidth = 4; c.beginPath(); c.moveTo(700, 450); c.lineTo(700, 250); c.moveTo(680, 260); c.lineTo(720, 260); c.stroke();
    snow(c, t, 140, 500, 110, 600, 340, 160); c.restore();
    c.lineWidth = 16; c.strokeStyle = '#7a5a3a'; rr(c, 500, 110, 600, 340, 40); c.stroke();
    // Horaire encadré
    c.fillStyle = '#3a2410'; c.fillRect(120, 150, 270, 320); c.fillStyle = '#f6f3ea'; c.fillRect(134, 164, 242, 292); txt(c, '🚂 HORAIRE', 255, 196, 'bold 18px Georgia', '#2a2118');
    c.strokeStyle = '#9aa8c0'; c.lineWidth = 1; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(146, 216 + i * 22); c.lineTo(364, 216 + i * 22); c.stroke(); c.fillStyle = '#556'; c.fillRect(150, 206 + i * 22, 90 - R(i) * 30, 6); c.fillRect(310, 206 + i * 22, 40, 6); }
    // Porte-bagages
    c.fillStyle = '#9aa0aa'; c.fillRect(1150, 250, 400, 8); for (let k = 0; k < 9; k++) c.fillRect(1160 + k * 46, 180, 3, 74);
    if (st.f.pz_pack) ['#c0392b', '#2e6fd1', '#e8a33a', '#3fa34d'].forEach((col, k) => { c.fillStyle = col; rr(c, 1160 + k * 96, 180, 88, 68, 8); c.fill(); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(1196 + k * 96, 172, 16, 10); });
    else { c.save(); c.translate(1300, 360); c.rotate(.3); c.fillStyle = '#c0392b'; rr(c, -60, -30, 120, 70, 8); c.fill(); c.restore(); c.save(); c.translate(1420, 400); c.rotate(-.2); c.fillStyle = '#2e6fd1'; rr(c, -50, -28, 100, 60, 8); c.fill(); c.restore(); }
    // Porte et avis
    c.fillStyle = '#5a3a20'; c.fillRect(1240, 280, 260, 300); c.fillStyle = '#f6f3ea'; c.save(); c.translate(1365, 440); c.rotate(.04); c.fillRect(-90, -110, 180, 220); c.fillStyle = '#c0392b'; c.fillRect(-90, -110, 180, 26); txt(c, 'AVIS', 0, -90, 'bold 18px Georgia', '#fff'); c.fillStyle = '#556'; for (let i = 0; i < 7; i++) c.fillRect(-74, -64 + i * 22, 140 - R(i) * 40, 6); c.restore();
    // Banquette
    c.fillStyle = lg(c, 0, 560, 0, 760, 0, '#2e6a46', 1, '#1a3a26'); rr(c, 200, 560, 1000, 200, 20); c.fill(); c.fillStyle = '#1e4a30'; c.fillRect(200, 740, 1000, 30);
    c.fillStyle = '#d9cfb6'; rr(c, 260, 580, 180, 60, 18); c.fill(); c.fillStyle = '#0c0805'; c.fillRect(200, 770, 1000, 130);
    const f = flick(t * .4, 3); glow(c, 800, 40, 520, '#ffd8a0', .2 * f); c.fillStyle = '#ffe9a8'; rr(c, 760, 20, 80, 24, 8); c.fill();
    c.restore(); vign(c, .8);
  }

  // ---------- Train de nuit : la voiture-restaurant ----------
  function trainB(c, t, st) {
    c.save(); trainShake(c, t);
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#5a3a24', 1, '#1e120a'); c.fillRect(0, -2, W, H + 4);
    for (let k = 0; k < 4; k++) { const x = 100 + k * 360; c.save(); rr(c, x, 110, 320, 260, 30); c.clip(); c.fillStyle = lg(c, 0, 110, 0, 370, 0, '#0a1020', 1, '#1a2438'); c.fillRect(x, 110, 320, 260); snow(c, t, 50, x, 110, 320, 260, 160);
      c.strokeStyle = 'rgba(220,235,255,.35)'; c.lineWidth = 1.5; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(x + R(i + k) * 320, 370); for (let j = 0; j < 5; j++) c.lineTo(x + R(i + k) * 320 + (R(i * j + k) - .5) * 60, 370 - j * 18); c.stroke(); } c.restore(); c.strokeStyle = '#7a5a3a'; c.lineWidth = 12; rr(c, x, 110, 320, 260, 30); c.stroke(); }
    [[160, 300], [560, 480], [1000, 0]].forEach(([x, w]) => { if (!w) return; c.fillStyle = '#f4f1e8'; poly(c, [[x, 540], [x + w, 540], [x + w + 20, 600], [x - 20, 600]]); c.fill(); c.fillStyle = '#d9cfb6'; c.fillRect(x - 20, 600, w + 40, 40); c.fillStyle = '#2a1a0e'; c.fillRect(x + w / 2 - 8, 640, 16, 160); });
    // Verre de thé
    c.fillStyle = 'rgba(220,235,255,.55)'; poly(c, [[280, 500], [330, 500], [324, 560], [286, 560]]); c.fill(); c.fillStyle = 'rgba(160,90,30,.6)'; poly(c, [[284, 520], [326, 520], [324, 556], [286, 556]]); c.fill();
    c.strokeStyle = 'rgba(80,80,90,.5)'; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(306, 528, 4 + i * 3, 6 + i * 3, .3, .4, 5.8); c.stroke(); }
    // Journal
    c.save(); c.translate(800, 568); c.rotate(-.05); c.fillStyle = '#ece6d6'; c.fillRect(-150, -40, 300, 80); c.fillStyle = '#2a2118'; c.font = 'bold 16px Georgia'; c.fillText('LE SOIR', -140, -18); c.fillStyle = '#887'; for (let i = 0; i < 4; i++) c.fillRect(-140, -6 + i * 10, 130, 4); for (let r = 0; r < 5; r++) for (let k = 0; k < 6; k++) { c.fillStyle = '#bbb'; c.fillRect(10 + k * 20, -30 + r * 14, 16, 12); } c.restore();
    // Corbeille à pain
    c.fillStyle = '#a0703a'; c.beginPath(); c.ellipse(950, 540, 60, 22, 0, 0, Math.PI); c.fill(); c.fillStyle = '#e8b870'; circ(c, 930, 530, 16); circ(c, 966, 528, 14);
    // Bar et télégramme
    c.fillStyle = lg(c, 0, 500, 0, 720, 0, '#7a4a24', 1, '#3e2410'); c.fillRect(1150, 500, 380, 220); c.fillStyle = '#9a6a3a'; c.fillRect(1140, 486, 400, 18);
    for (let k = 0; k < 6; k++) { c.fillStyle = ['#3a6a3a', '#7a1a10', '#c9a050', '#2a4a7a', '#7a1a10', '#3a6a3a'][k]; c.fillRect(1180 + k * 56, 400, 22, 86); }
    c.save(); c.translate(1300, 470); c.rotate(.06); c.fillStyle = '#f2e8a8'; c.fillRect(-70, -24, 140, 48); c.fillStyle = '#556'; for (let i = 0; i < 3; i++) c.fillRect(-60, -12 + i * 12, 110 - R(i) * 30, 4); c.restore();
    const f = flick(t * .4, 7); [400, 800, 1200].forEach(x => { c.fillStyle = '#ffe9a8'; circ(c, x, 50, 16); glow(c, x, 60, 380, '#ffd8a0', .18 * f); });
    c.restore(); vign(c, .8);
  }

  // ---------- Train de nuit : le fourgon à bagages ----------
  function trainC(c, t, st) {
    c.save(); trainShake(c, t);
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#3a3530', 1, '#14120f'); c.fillRect(0, -2, W, H + 4);
    for (let x = 0; x < W; x += 40) { c.fillStyle = `rgba(0,0,0,${.1 + R(x + 2) * .15})`; c.fillRect(x, 0, 38, 640); }
    c.fillStyle = '#2a2622'; c.fillRect(0, 640, W, 260);
    // Chaudière
    c.fillStyle = lg(c, 80, 0, 460, 0, 0, '#3a3f48', .5, '#6a707c', 1, '#2a2e36'); rr(c, 100, 260, 340, 440, 60); c.fill();
    for (let k = 0; k < 3; k++) { c.fillStyle = '#e8e8e0'; circ(c, 170 + k * 100, 360, 34); c.strokeStyle = '#2a2e36'; c.lineWidth = 4; c.beginPath(); c.arc(170 + k * 100, 360, 34, 0, TAU); c.stroke(); const a = -Math.PI / 2 + (st.f.pz_valves ? .6 : -.9) + Math.sin(t * 2 + k) * .1; c.strokeStyle = '#c0392b'; c.lineWidth = 3; c.beginPath(); c.moveTo(170 + k * 100, 360); c.lineTo(170 + k * 100 + Math.cos(a) * 26, 360 + Math.sin(a) * 26); c.stroke(); }
    txt(c, '▲', 270, 312, 'bold 22px Georgia', '#ffd27a');
    for (let k = 0; k < 4; k++) { c.fillStyle = '#c9a050'; circ(c, 160 + k * 80, 470, 18); c.fillStyle = '#7a1a10'; c.fillRect(156 + k * 80, 440, 8, 30); }
    c.fillStyle = '#5a606c'; c.fillRect(260, 100, 40, 170); for (let i = 0; i < 6; i++) { const y = 100 - mod(t * 30 + i * 18, 100); c.fillStyle = `rgba(230,230,230,${.15 * (y / 100)})`; circ(c, 280 + Math.sin(t + i) * 10, y, 10 + (100 - y) * .15); }
    if (st.f.pz_valves) glow(c, 270, 560, 260, '#ff8a3a', .35);
    // Tableau de manœuvre
    c.fillStyle = '#6a4a2a'; c.fillRect(560, 150, 440, 290); c.fillStyle = '#d9c38a'; c.fillRect(576, 166, 408, 258);
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 4; [[600, 230, 960, 230], [600, 360, 960, 360], [700, 230, 840, 360]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); });
    for (let k = 0; k < 4; k++) { c.fillStyle = ['#c0392b', '#2e6fd1', '#3fa34d', '#e8a33a'][k]; rr(c, 610 + k * 50, 214, 42, 26, 4); c.fill(); }
    // Sacs postaux
    [[1150, 760, 1], [1260, 740, 1.2], [1350, 770, .9]].forEach(([x, y, s]) => { c.fillStyle = '#8a7a5a'; c.beginPath(); c.moveTo(x - 50 * s, y + 60 * s); c.quadraticCurveTo(x - 60 * s, y - 40 * s, x, y - 50 * s); c.quadraticCurveTo(x + 60 * s, y - 40 * s, x + 50 * s, y + 60 * s); c.fill(); c.fillStyle = '#5a4a30'; c.fillRect(x - 20 * s, y - 56 * s, 40 * s, 10 * s); txt(c, 'POSTES', x, y + 20 * s, `bold ${14 * s}px Consolas`, 'rgba(40,30,20,.7)'); });
    // Coffret de commande
    c.fillStyle = lg(c, 1150, 0, 1470, 0, 0, '#4a5260', .5, '#6a7484', 1, '#3a404c'); rr(c, 1150, 140, 320, 420, 12); c.fill(); c.strokeStyle = '#15171c'; c.lineWidth = 4; c.stroke();
    c.fillStyle = '#e2b521'; c.fillRect(1166, 156, 288, 22); txt(c, '⚡ CHAUFFAGE · RADIO', 1310, 173, 'bold 14px Consolas, monospace', '#1a1a1a');
    ['★', '●', '▲', '■', '◆', '♥'].forEach((s, k) => { const x = 1200 + (k % 3) * 110, y = 240 + Math.floor(k / 3) * 120; c.fillStyle = '#1a1d22'; circ(c, x, y, 34); c.fillStyle = '#c8ccd4'; circ(c, x, y, 26); txt(c, s, x, y + 8, 'bold 22px Segoe UI Symbol', '#2a2e36'); });
    c.fillStyle = '#c9cbd3'; c.fillRect(1290, 470, 40, 60);
    c.restore(); vign(c, .85);
  }

  Object.assign(window.Scenes, { lanternA, lanternB, lanternC, trainA, trainB, trainC });
})();

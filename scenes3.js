// Décors du scénario « L'emblème volé » : bureau d'enquête, rue enneigée (deux trottoirs) et boutique de jeux.
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  function snow(c, t, n, x0, y0, w, h, a = .8) {
    c.fillStyle = '#fff';
    for (let i = 0; i < n; i++) {
      const sp = 20 + R(i) * 40, x = x0 + mod(R(i + 3) * w + Math.sin(t * .8 + i) * 18 + t * 8, w), y = y0 + mod(R(i + 7) * h + t * sp, h);
      c.globalAlpha = a * (.4 + R(i + 9) * .6); circ(c, x, y, 1 + R(i + 1) * 2.4);
    }
    c.globalAlpha = 1;
  }

  // ---------- Bureau d'enquête ----------
  function cityA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#2a2420', 1, '#140f0c'); c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 80) { c.fillStyle = `rgba(0,0,0,${.12 + R(x) * .12})`; c.fillRect(x, 0, 78, 560); c.fillStyle = 'rgba(255,220,170,.03)'; c.fillRect(x, 0, 2, 560); }
    c.fillStyle = '#3a2a1e'; c.fillRect(0, 548, W, 14);
    // Fenêtre : la ville sous la neige
    c.save(); rr(c, 100, 120, 360, 330, 6); c.clip();
    c.fillStyle = lg(c, 0, 120, 0, 450, 0, '#0b1630', 1, '#1d2c4c'); c.fillRect(100, 120, 360, 330);
    c.fillStyle = '#0a0f1c'; c.fillRect(100, 360, 360, 90);
    for (let i = 0; i < 9; i++) { const x = 110 + i * 40, h = 40 + R(i) * 80; c.fillStyle = '#0f1628'; c.fillRect(x, 400 - h, 34, h + 50); for (let k = 0; k < 6; k++) if (R(i * 7 + k) > .5) { c.fillStyle = 'rgba(255,210,120,.8)'; c.fillRect(x + 6 + (k % 2) * 14, 410 - h + Math.floor(k / 2) * 18, 8, 8); } }
    const on = (t % 4) < 1.5; c.fillStyle = '#e8e8e0'; c.fillRect(424, 312, 8, 30); if (on) glow(c, 428, 312, 40, '#fff0b0', .9);
    snow(c, t, 60, 100, 120, 360, 330);
    c.restore();
    c.strokeStyle = '#4a3626'; c.lineWidth = 14; c.strokeRect(100, 120, 360, 330); c.lineWidth = 6; c.beginPath(); c.moveTo(280, 120); c.lineTo(280, 450); c.stroke();
    // Tableau d'enquête
    c.fillStyle = '#5a3a1f'; c.fillRect(1200, 140, 330, 300); c.fillStyle = lg(c, 1200, 140, 1530, 440, 0, '#b88d58', 1, '#8f6a3c'); c.fillRect(1210, 150, 310, 280);
    [[1240, 170, 80, 100, '#e9e4d6'], [1360, 180, 70, 90, '#d9e4f0'], [1440, 260, 70, 90, '#e9e4d6']].forEach(([x, y, w, h, col], i) => { c.fillStyle = col; c.fillRect(x, y, w, h); c.fillStyle = '#556'; circ(c, x + w / 2, y + 30, 16); c.fillRect(x + w / 2 - 18, y + 50, 36, 40); c.fillStyle = '#c0392b'; circ(c, x + w / 2, y + 4, 5); });
    c.fillStyle = '#fbfbf5'; c.fillRect(1250, 300, 160, 120); c.strokeStyle = '#9aa8c0'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(1250, 318 + i * 18); c.lineTo(1410, 318 + i * 18); c.stroke(); } for (let k = 1; k < 5; k++) { c.beginPath(); c.moveTo(1250 + k * 32, 300); c.lineTo(1250 + k * 32, 420); c.stroke(); }
    if (st.f.pz_color) { c.fillStyle = 'rgba(232,196,104,.6)'; (st.v.color ? st.v.color.bm : []).forEach((b, i) => { if (b) c.fillRect(1250 + (i % 5) * 32 + 2, 320 + Math.floor(i / 5) * 18, 28, 16); }); }
    c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(1280, 175); c.lineTo(1395, 185); c.lineTo(1475, 265); c.lineTo(1330, 305); c.stroke();
    // Bureau
    c.fillStyle = lg(c, 0, 560, 0, 600, 0, '#6b4a2e', 1, '#4a3220'); poly(c, [[200, 560], [1500, 560], [1560, 610], [140, 610]]); c.fill();
    c.fillStyle = lg(c, 0, 610, 0, H, 0, '#3e2a1a', 1, '#160e08'); c.fillRect(160, 610, 1380, 290);
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 3; c.strokeRect(380, 680, 300, 110); c.fillStyle = '#c9a050'; c.fillRect(510, 728, 40, 8);
    if (st.f.scraps) { c.fillStyle = '#120a05'; c.fillRect(386, 686, 288, 14); }
    // Ordinateur
    c.fillStyle = '#1a1c22'; rr(c, 560, 300, 330, 230, 10); c.fill(); c.fillStyle = '#2a2d36'; c.fillRect(705, 530, 40, 30); c.fillRect(660, 552, 130, 10);
    c.save(); rr(c, 575, 315, 300, 200, 4); c.clip();
    if (st.f.pc) { c.fillStyle = lg(c, 0, 315, 0, 515, 0, '#f6b26b', 1, '#203a55'); c.fillRect(575, 315, 300, 200); [[600, 340], [600, 390], [660, 340]].forEach(([x, y]) => { c.fillStyle = '#ffe9a8'; c.fillRect(x, y, 34, 28); }); txt(c, '🗺️', 617, 362, '20px Segoe UI Emoji', '#000'); }
    else { c.fillStyle = lg(c, 0, 315, 0, 515, 0, '#1d4f8f', 1, '#0d2446'); c.fillRect(575, 315, 300, 200); c.fillStyle = '#e8eef8'; circ(c, 725, 390, 22); c.fillStyle = 'rgba(255,255,255,.85)'; rr(c, 650, 430, 150, 22, 4); c.fill(); if (Math.sin(t * 6) > 0) { c.fillStyle = '#123'; c.fillRect(660, 435, 2, 12); } }
    c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 315; y < 515; y += 3) c.fillRect(575, y, 300, 1);
    c.restore(); glow(c, 725, 415, 260, st.f.pc ? '#ffcf8a' : '#5aa0ff', .18);
    c.fillStyle = '#2a2d36'; poly(c, [[600, 600], [860, 600], [880, 632], [580, 632]]); c.fill();
    // Dossier, tasse, lampe
    c.save(); c.translate(1070, 600); c.rotate(-.06); c.fillStyle = '#d9b46a'; c.fillRect(-105, -32, 210, 66); c.fillStyle = '#c9a050'; c.fillRect(-105, -40, 80, 12); txt(c, 'POLICE · 2047', 0, 8, 'bold 18px Consolas, monospace', '#7a2a1a'); c.restore();
    c.fillStyle = '#e9e4d6'; rr(c, 1300, 570, 44, 46, 6); c.fill(); c.strokeStyle = '#e9e4d6'; c.lineWidth = 5; c.beginPath(); c.arc(1348, 592, 11, -1.4, 1.4); c.stroke();
    for (let i = 0; i < 3; i++) { c.strokeStyle = `rgba(255,255,255,${.15 + .1 * Math.sin(t + i)})`; c.lineWidth = 2; c.beginPath(); c.moveTo(1314 + i * 8, 565); c.quadraticCurveTo(1304 + i * 8 + Math.sin(t * 2 + i) * 8, 540, 1318 + i * 8, 515); c.stroke(); }
    c.fillStyle = '#c9a050'; c.fillRect(300, 470, 10, 100); c.fillRect(270, 562, 70, 10); c.fillStyle = lg(c, 0, 440, 0, 480, 0, '#1f6b3a', 1, '#0f3a1f'); c.beginPath(); c.ellipse(305, 470, 70, 22, 0, Math.PI, 0); c.fill();
    const f = flick(t * .3, 3); glow(c, 305, 500, 420, '#ffd27a', .3 * f); glow(c, 305, 486, 60, '#fff1c0', .6 * f);
    // Corbeille
    c.fillStyle = lg(c, 1250, 0, 1400, 0, 0, '#3a3f48', .5, '#5a606c', 1, '#2a2e36'); poly(c, [[1262, 660], [1388, 660], [1374, 800], [1276, 800]]); c.fill();
    c.fillStyle = '#e9e4d6'; circ(c, 1300, 654, 16); circ(c, 1338, 650, 18);
    vign(c, .82);
  }

  // ---------- Rue enneigée ----------
  function street(c, t, st, side) {
    c.fillStyle = lg(c, 0, 0, 0, 500, 0, '#070c1c', 1, '#18223e'); c.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,255,255,${.2 + .5 * Math.abs(Math.sin(t * .7 + i))})`; c.fillRect(R(i) * W, R(i + 9) * 110, 2, 2); }
    const lots = side ? [3, 4, 5] : [0, 1, 2], LN = l => l < 3 ? 101 + 2 * l : 102 + 2 * (l - 3);
    const rects = [[80, 130, 440, 520], [580, 130, 440, side ? 520 : 320], [1080, 130, 440, 520]];
    rects.forEach(([x, y, w, h], k) => {
      const l = lots[k], hue = [12, 200, 30, 280, 150, 45][l];
      c.fillStyle = `hsl(${hue},28%,${18 + R(l) * 6}%)`; c.fillRect(x, y, w, h);
      for (let r = 0; r < h / 22; r++) for (let q = 0; q < w / 44; q++) { c.fillStyle = `rgba(0,0,0,${.08 + R(r * 13 + q + l) * .12})`; c.fillRect(x + q * 44 + (r % 2) * 22, y + r * 22, 42, 20); }
      c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(x - 6, y - 10, w + 12, 12);
      const wy = y + 150, wh = Math.min(200, h - 210);
      if (wh > 40) { c.fillStyle = lg(c, 0, wy, 0, wy + wh, 0, 'rgba(255,214,140,.95)', 1, 'rgba(210,140,60,.85)'); c.fillRect(x + 30, wy, w * .55, wh); glow(c, x + 30 + w * .27, wy + wh / 2, 260, '#ffc070', .25); c.strokeStyle = '#2a1a10'; c.lineWidth = 6; c.strokeRect(x + 30, wy, w * .55, wh); }
      c.fillStyle = '#2a1a10'; c.fillRect(x + w * .66, y + h - 210, w * .26, 210); c.fillStyle = '#d9b24a'; circ(c, x + w * .7, y + h - 100, 5);
      rr(c, x + w * .66, y + h - 250, 80, 30, 5); c.fillStyle = '#f2ede0'; c.fill(); txt(c, String(LN(l)), x + w * .66 + 40, y + h - 228, 'bold 20px Georgia', '#1d2c4c');
      rr(c, x + 30, y + 30, w - 60, 90, 8); c.fillStyle = '#1a1410'; c.fill();
      if (st.f.map && st.v.street) { const s = st.v.shops[st.v.street.L.indexOf(l)]; txt(c, s.i, x + w / 2, y + 100, '60px Segoe UI Emoji, sans-serif', '#fff'); glow(c, x + w / 2, y + 75, 120, '#ffd27a', .3); }
      else {
        c.fillStyle = 'rgba(70,110,170,.85)'; c.fillRect(x + 24, y + 24, w - 48, 104);
        c.strokeStyle = '#9aa0aa'; c.lineWidth = 6; for (let q = 0; q < 4; q++) { c.beginPath(); c.moveTo(x + 20 + q * (w - 40) / 3, y + 10); c.lineTo(x + 20 + q * (w - 40) / 3, y + 160); c.stroke(); } c.beginPath(); c.moveTo(x + 20, y + 140); c.lineTo(x + w - 20, y + 140); c.moveTo(x + 20, y + 20); c.lineTo(x + w - 20, y + 140); c.stroke();
      }
    });
    if (!side) {
      c.fillStyle = '#2a2a2e'; c.fillRect(795, 640, 10, 120); c.fillRect(855, 640, 10, 120);
      c.fillStyle = '#f2ede0'; c.fillRect(680, 480, 240, 170);
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#e8701a' : '#fff'; c.fillRect(680 + i * 40, 470, 40, 14); }
      c.strokeStyle = '#7a8aa8'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.strokeRect(700 + i * 72, 500, 60, 50); c.strokeRect(700 + i * 72, 580, 60, 50); }
      c.fillStyle = '#c0392b'; c.fillRect(698, 557, 210, 14); txt(c, '?', 730, 540, 'bold 26px Georgia', '#c0392b'); txt(c, '?', 875, 620, 'bold 26px Georgia', '#c0392b');
    }
    // Trottoir, réverbères, neige
    c.fillStyle = lg(c, 0, 650, 0, H, 0, '#cfd6e2', 1, '#7d8798'); c.fillRect(0, 650, W, 250);
    c.fillStyle = '#e8eef6'; for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(R(i + 40) * W, 660 + R(i) * 30, 80 + R(i + 1) * 80, 18, 0, 0, TAU); c.fill(); }
    if (side) { c.fillStyle = '#f2f6fa'; c.beginPath(); c.ellipse(1410, 780, 110, 50, 0, Math.PI, 0); c.fill(); c.fillStyle = '#5a3a2a'; c.beginPath(); c.ellipse(1440, 752, 16, 9, .4, 0, TAU); c.fill(); }
    [540, 1050].forEach((x, i) => {
      c.fillStyle = '#1d1f26'; c.fillRect(x - 5, 230, 10, 450); c.fillRect(x - 40, 226, 50, 8);
      c.fillStyle = '#fff3c4'; c.beginPath(); c.ellipse(x - 40, 240, 16, 10, 0, 0, TAU); c.fill();
      glow(c, x - 40, 245, 320, '#ffd890', .32 * flick(t * .2, i)); c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .08; c.fillStyle = '#ffe8b0'; poly(c, [[x - 52, 248], [x - 28, 248], [x + 60, 700], [x - 140, 700]]); c.fill(); c.restore();
    });
    snow(c, t, 220, 0, 0, W, H, .9);
    vign(c, .75);
  }
  const cityB = (c, t, st) => street(c, t, st, 0);
  const cityC = (c, t, st) => street(c, t, st, 1);

  // ---------- Boutique de jeux ----------
  function cityD(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#3a2418', 1, '#1a0f08'); c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 60) { c.fillStyle = `rgba(0,0,0,${.1 + R(x + 5) * .1})`; c.fillRect(x, 0, 58, 560); }
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#5a3a22', 1, '#24160c'); c.fillRect(0, 560, W, 340);
    for (let r = 0; r < 6; r++) for (let q = 0; q < 14; q++) { if ((r + q) % 2) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(q * 120 - r * 20, 580 + r * 54, 120, 54); } }
    // Étagères
    c.fillStyle = '#4a2c14'; c.fillRect(80, 120, 420, 440);
    for (let s = 0; s < 4; s++) { const y = 140 + s * 104; let x = 96, k = 0; while (x < 480) { const w = 30 + R(s * 30 + k) * 40, h = 56 + R(s * 30 + k + 4) * 34; c.fillStyle = `hsl(${R(s * 30 + k + 9) * 360},55%,${40 + R(k) * 15}%)`; c.fillRect(x, y + 96 - h, w, h); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 4, y + 96 - h + 8, w - 8, 6); x += w + 4; k++; } c.fillStyle = '#6a4220'; c.fillRect(88, y + 96, 404, 8); }
    // Vitrine : la boulangerie d'en face
    c.save(); rr(c, 560, 120, 360, 300, 6); c.clip();
    c.fillStyle = lg(c, 0, 120, 0, 420, 0, '#0b1630', 1, '#1d2c4c'); c.fillRect(560, 120, 360, 300);
    c.fillStyle = '#3a2620'; c.fillRect(600, 200, 280, 220); c.fillStyle = 'rgba(255,214,140,.95)'; c.fillRect(630, 280, 140, 110); glow(c, 700, 330, 180, '#ffc070', .35);
    rr(c, 640, 215, 200, 46, 6); c.fillStyle = '#1a1410'; c.fill(); txt(c, '🥐 HÉBERT', 740, 248, 'bold 22px Georgia', '#ffd27a');
    snow(c, t, 50, 560, 120, 360, 300); c.restore();
    c.strokeStyle = '#6a4220'; c.lineWidth = 14; c.strokeRect(560, 120, 360, 300);
    // Comptoir et factures
    c.fillStyle = lg(c, 0, 600, 0, 760, 0, '#7a4a24', 1, '#3e2410'); c.fillRect(300, 640, 440, 160); c.fillStyle = '#8a5a30'; c.fillRect(290, 626, 460, 20);
    c.fillStyle = '#2a2d36'; rr(c, 560, 560, 150, 70, 8); c.fill(); c.fillStyle = '#7dffb0'; c.fillRect(578, 572, 90, 18);
    for (let k = 0; k < 5; k++) { c.save(); c.translate(400 + k * 6, 606 - k * 3); c.rotate((R(k) - .5) * .3); c.fillStyle = '#f6f3ea'; c.fillRect(-60, -16, 120, 30); c.strokeStyle = '#b9c7e0'; c.beginPath(); c.moveTo(-50, -4); c.lineTo(40, -4); c.moveTo(-50, 6); c.lineTo(20, 6); c.stroke(); c.restore(); }
    // Plateau de jeu
    c.fillStyle = '#5a3418'; c.fillRect(840, 700, 16, 100); c.fillRect(1120, 700, 16, 100);
    c.fillStyle = '#7a4a24'; poly(c, [[820, 640], [1150, 640], [1170, 710], [800, 710]]); c.fill();
    for (let r = 0; r < 4; r++) for (let q = 0; q < 8; q++) { c.fillStyle = (r + q) % 2 ? '#2a1a10' : '#e9dcc0'; const x = 860 + q * 30 - r * 6, y = 648 + r * 14; poly(c, [[x, y], [x + 30, y], [x + 26, y + 14], [x - 4, y + 14]]); c.fill(); }
    [['#c0392b', 900, 640], ['#2e6fd1', 1000, 650], ['#3fa34d', 1080, 632]].forEach(([col, x, y]) => { c.fillStyle = col; circ(c, x, y - 10, 9); c.fillRect(x - 7, y - 4, 14, 14); });
    txt(c, '🌎 ?', 985, 600, 'bold 30px Segoe UI Emoji, Georgia', '#ffd27a');
    // Porte de la réserve
    c.fillStyle = '#1a0f07'; c.fillRect(1140, 120, 350, 640);
    c.fillStyle = lg(c, 1150, 0, 1480, 0, 0, '#5a3418', .5, '#6e4222', 1, '#4a2a12'); c.fillRect(1150, 130, 330, 620);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(1180, 170, 270, 240); c.strokeRect(1180, 450, 270, 260);
    rr(c, 1235, 300, 160, 70, 6); c.fillStyle = '#f2ede0'; c.fill(); txt(c, st.f.quiz ? '✔ OK' : '🔒 🌎 ?', 1315, 345, 'bold 22px Georgia', st.f.quiz ? '#2e7d32' : '#7a2a1a');
    c.strokeStyle = '#c9cbd3'; c.lineWidth = 6; c.beginPath(); c.arc(1430, 470, 12, Math.PI, TAU); c.stroke(); rr(c, 1412, 470, 36, 34, 5); c.fillStyle = '#c79a2e'; c.fill();
    glow(c, 1430, 488, 40, '#fff1b0', .2 + .2 * Math.sin(t * 2.4));
    for (const x of [300, 800, 1300]) { c.fillStyle = '#ffe9a8'; circ(c, x, 30, 14); glow(c, x, 40, 420, '#ffcf8a', .16); }
    dust(c, t, 24, 200, 100, 1200, 600, '#ffe6b8');
    vign(c, .8);
  }

  Object.assign(window.Scenes, { cityA, cityB, cityC, cityD });
})();

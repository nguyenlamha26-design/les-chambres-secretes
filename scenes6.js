// Décors festifs : le manoir hanté (Halloween) et l'atelier des lutins (Noël).
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const snow = (c, t, n, x0, y0, w, h) => { c.fillStyle = '#fff'; for (let i = 0; i < n; i++) { const x = x0 + mod(R(i + 3) * w + Math.sin(t * .7 + i) * 20, w), y = y0 + mod(R(i + 7) * h + t * (20 + R(i) * 30), h); c.globalAlpha = .4 + R(i + 9) * .6; circ(c, x, y, 1.2 + R(i + 1) * 2.5); } c.globalAlpha = 1; };
  const candle = (c, t, x, y, k) => { c.fillStyle = '#efe6d0'; c.fillRect(x - 6, y, 12, 40); const f = flick(t, k); c.fillStyle = '#ffd27a'; c.beginPath(); c.ellipse(x, y - 8, 4, 10 * f, 0, 0, TAU); c.fill(); glow(c, x, y - 8, 120, '#ffaa40', .35 * f); };
  const ghost = (c, x, y, s, a) => { c.save(); c.globalAlpha = a; c.fillStyle = '#eef4ff'; c.beginPath(); c.arc(x, y, 26 * s, Math.PI, 0); c.lineTo(x + 26 * s, y + 34 * s); for (let k = 0; k < 4; k++) c.quadraticCurveTo(x + 26 * s - (k * 13 + 6.5) * s, y + 26 * s, x + 26 * s - (k + 1) * 13 * s, y + 34 * s); c.closePath(); c.fill(); c.fillStyle = '#223'; circ(c, x - 9 * s, y - 4 * s, 4 * s); circ(c, x + 9 * s, y - 4 * s, 4 * s); c.restore(); };

  // ---------- Manoir : le grand hall ----------
  function hallA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#2a1a2e', 1, '#0c0610'); c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 120) { c.strokeStyle = 'rgba(120,80,140,.12)'; c.lineWidth = 2; c.strokeRect(x + 10, 20, 100, 500); }
    c.fillStyle = lg(c, 0, 600, 0, H, 0, '#3a2418', 1, '#120a06'); c.fillRect(0, 600, W, 300);
    for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.03)'; poly(c, [[k * 200, 600], [k * 200 + 200, 600], [k * 260 + 160, 900], [k * 260 - 100, 900]]); c.fill(); }
    // Portraits
    [[580, 130, 140, 180], [740, 110, 140, 210], [900, 130, 140, 180], [640, 330, 120, 110], [800, 330, 120, 110]].forEach(([x, y, w, h], k) => {
      c.fillStyle = '#c9a050'; c.fillRect(x, y, w, h); c.fillStyle = lg(c, 0, y, 0, y + h, 0, '#3a3040', 1, '#1a1420'); c.fillRect(x + 10, y + 10, w - 20, h - 20);
      const a = Math.max(0, Math.sin(t * .9 + k * 1.7)); if (!st.f.pz_catch) ghost(c, x + w / 2, y + h / 2 + Math.sin(t * 2 + k) * 6, .8, .25 + .6 * a); else { c.fillStyle = '#c8a888'; circ(c, x + w / 2, y + h / 2 - 10, 18); c.fillStyle = '#2a2030'; c.fillRect(x + w / 2 - 22, y + h / 2 + 10, 44, 30); }
    });
    // Table de la voyante
    c.fillStyle = '#4a1a4a'; c.beginPath(); c.ellipse(310, 640, 210, 50, 0, 0, TAU); c.fill(); c.fillStyle = lg(c, 0, 640, 0, 760, 0, '#5a1a5a', 1, '#2a0a2a'); poly(c, [[100, 640], [520, 640], [480, 760], [140, 760]]); c.fill();
    c.fillStyle = rg(c, 300, 590, 50, 0, '#e0f0ff', .5, '#8ab4ff', 1, '#3a5aaa'); circ(c, 300, 600, 36); glow(c, 300, 600, 120, '#8ab4ff', .4 + .2 * Math.sin(t * 2));
    [[220, 630], [380, 630]].forEach(([x, y]) => { c.fillStyle = '#c0392b'; poly(c, [[x - 18, y], [x + 18, y], [x + 12, y - 30], [x - 12, y - 30]]); c.fill(); });
    candle(c, t, 150, 590, 1); candle(c, t, 470, 590, 2);
    // Enveloppe, horloge, porte
    c.save(); c.translate(700, 690); c.rotate(-.15); c.fillStyle = '#f4e8c8'; c.fillRect(-60, -30, 120, 60); c.strokeStyle = '#c9a050'; c.beginPath(); c.moveTo(-60, -30); c.lineTo(0, 6); c.lineTo(60, -30); c.stroke(); txt(c, '🎃', 0, 20, '22px Segoe UI Emoji', '#000'); c.restore();
    c.fillStyle = lg(c, 1060, 0, 1200, 0, 0, '#3a1e10', .5, '#5a3018', 1, '#2a1408'); c.fillRect(1060, 160, 140, 460); c.fillStyle = '#efe6d0'; circ(c, 1130, 250, 50);
    c.strokeStyle = '#2a1408'; c.lineWidth = 4; c.beginPath(); c.moveTo(1130, 250); c.lineTo(1130, 208); c.moveTo(1130, 250); c.lineTo(1124, 212); c.stroke();
    const pa = Math.sin(t * 2.4) * .3; c.save(); c.translate(1130, 330); c.rotate(pa); c.strokeStyle = '#c9a050'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 200); c.stroke(); c.fillStyle = '#c9a050'; circ(c, 0, 210, 20); c.restore();
    c.fillStyle = '#1a0a08'; c.fillRect(1230, 150, 320, 580); c.fillStyle = lg(c, 1240, 0, 1540, 0, 0, '#4a2010', .5, '#5a2a14', 1, '#3a1a0a'); c.beginPath(); c.moveTo(1240, 730); c.lineTo(1240, 300); c.arc(1390, 300, 150, Math.PI, 0); c.lineTo(1540, 730); c.fill();
    rr(c, 1360, 470, 60, 70, 8); c.fillStyle = lg(c, 1360, 470, 1420, 540, 0, '#e8c468', 1, '#7a5a1a'); c.fill(); txt(c, '★●▲', 1390, 500, '13px Segoe UI Symbol', '#3a2a08'); txt(c, '■◆♥', 1390, 522, '13px Segoe UI Symbol', '#3a2a08');
    for (let k = 0; k < 3; k++) { const x = 300 + k * 500, y = 60; c.strokeStyle = '#3a3040'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y); c.stroke(); txt(c, '🕷️', x, y + 20 + Math.sin(t + k) * 10, '26px Segoe UI Emoji', '#000'); }
    dust(c, t, 22, 0, 0, W, 700, '#c8b8ff'); vign(c, .85);
  }

  // ---------- Manoir : le grenier ----------
  function hallB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#2a2026', 1, '#0e0a0c'); c.fillRect(0, 0, W, H);
    c.fillStyle = '#1a1210'; poly(c, [[0, 0], [W, 0], [W, 80], [800, 0], [0, 80]]); c.fill();
    for (let x = -200; x < W + 200; x += 160) { c.strokeStyle = '#2a1a12'; c.lineWidth = 18; c.beginPath(); c.moveTo(800, -40); c.lineTo(x, 900); c.stroke(); }
    c.fillStyle = lg(c, 0, 620, 0, H, 0, '#3a2a1e', 1, '#120a06'); c.fillRect(0, 620, W, 280);
    // Fenêtre ronde et toile d'araignée
    c.save(); c.beginPath(); c.arc(800, 300, 190, 0, TAU); c.clip(); c.fillStyle = lg(c, 0, 110, 0, 490, 0, '#1a2050', 1, '#3a2a60'); c.fillRect(600, 100, 400, 400);
    glow(c, 880, 220, 120, '#fff4c8', .5); c.fillStyle = '#fff6d8'; circ(c, 880, 220, 44); c.fillStyle = '#2a2050'; circ(c, 900, 210, 40); c.restore();
    c.strokeStyle = '#5a3a20'; c.lineWidth = 16; c.beginPath(); c.arc(800, 300, 196, 0, TAU); c.stroke();
    c.strokeStyle = 'rgba(230,230,240,.55)'; c.lineWidth = 1.5; for (let k = 0; k < 12; k++) { const a = k * TAU / 12; c.beginPath(); c.moveTo(800, 300); c.lineTo(800 + Math.cos(a) * 190, 300 + Math.sin(a) * 190); c.stroke(); }
    for (let r = 30; r < 190; r += 30) { c.beginPath(); for (let k = 0; k <= 12; k++) { const a = k * TAU / 12, rr2 = r + Math.sin(k * 3) * 4; k ? c.lineTo(800 + Math.cos(a) * rr2, 300 + Math.sin(a) * rr2) : c.moveTo(800 + Math.cos(a) * rr2, 300 + Math.sin(a) * rr2); } c.stroke(); }
    txt(c, '🕷️', 800 + Math.sin(t * .8) * 40, 320 + Math.cos(t * .6) * 30, '40px Segoe UI Emoji', '#000');
    // Garde-robe
    c.fillStyle = lg(c, 100, 0, 460, 0, 0, '#3a1e10', .5, '#5a3018', 1, '#2a1408'); c.fillRect(100, 140, 360, 560); c.strokeStyle = '#1a0a04'; c.lineWidth = 4; c.strokeRect(116, 160, 160, 520); c.strokeRect(284, 160, 160, 520);
    c.fillStyle = '#c9a050'; circ(c, 266, 420, 7); circ(c, 294, 420, 7); const op = Math.max(0, Math.sin(t * .7)) * 10; c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(274, 170, 10 + op, 500);
    // Livres et coffre
    c.fillStyle = '#3a2410'; c.fillRect(1100, 420, 340, 14); for (let k = 0; k < 12; k++) { c.fillStyle = ['#5a1a1a', '#1a3a5a', '#3a5a1a', '#5a4a1a'][k % 4]; c.fillRect(1110 + k * 27, 300 + R(k) * 40, 24, 120 - R(k) * 40); }
    c.strokeStyle = 'rgba(220,220,230,.3)'; c.lineWidth = 1; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(1100, 200 + k * 10); c.quadraticCurveTo(1250, 260, 1440, 200 + k * 12); c.stroke(); }
    c.fillStyle = lg(c, 0, 560, 0, 780, 0, '#5a3418', 1, '#2a1408'); c.fillRect(1090, 620, 340, 160); c.beginPath(); c.moveTo(1090, 620); c.quadraticCurveTo(1260, 540, 1430, 620); c.fill();
    [1120, 1250, 1380].forEach(x => { c.fillStyle = '#4a4f58'; c.fillRect(x, 580, 24, 200); }); rr(c, 1236, 640, 52, 56, 6); c.fillStyle = st.f.pz_pins ? '#62d48a' : '#c9a050'; c.fill();
    // Chaise à bascule
    const rock = Math.sin(t * 1.2) * .08; c.save(); c.translate(700, 760); c.rotate(rock); c.strokeStyle = '#3a2410'; c.lineWidth = 8; c.beginPath(); c.arc(0, 40, 120, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.fillStyle = '#4a2a14'; c.fillRect(-60, -80, 14, 100); c.fillRect(46, -80, 14, 100); c.fillRect(-60, -20, 120, 14); c.fillRect(-60, -150, 14, 80); c.restore();
    dust(c, t, 30, 0, 0, W, 800, '#e0d8ff'); vign(c, .85);
  }

  // ---------- Manoir : le jardin aux tombes ----------
  function hallC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 560, 0, '#0a0a20', 1, '#2a2050'); c.fillRect(0, 0, W, H);
    glow(c, 1250, 140, 180, '#fff4c8', .45); c.fillStyle = '#fff6d8'; circ(c, 1250, 140, 60);
    for (let i = 0; i < 4; i++) { const x = mod(t * 40 + i * 400, W + 200) - 100, y = 120 + i * 40 + Math.sin(t * 3 + i) * 10; c.fillStyle = '#111'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 20, y - 14 - Math.sin(t * 12 + i) * 10, x - 40, y); c.quadraticCurveTo(x - 20, y - 6, x, y); c.quadraticCurveTo(x + 20, y - 14 - Math.sin(t * 12 + i) * 10, x + 40, y); c.quadraticCurveTo(x + 20, y - 6, x, y); c.fill(); }
    c.fillStyle = '#14101e'; poly(c, [[0, 460], [200, 380], [420, 430], [700, 360], [1000, 420], [1300, 370], [W, 430], [W, 560], [0, 560]]); c.fill();
    c.fillStyle = '#1e1a14'; for (let x = 590; x < 1010; x += 24) c.fillRect(x, 160, 6, 290); c.fillRect(580, 200, 440, 8); c.fillRect(580, 400, 440, 8);
    c.fillStyle = lg(c, 0, 520, 0, H, 0, '#1e2a1a', 1, '#0a100a'); c.fillRect(0, 520, W, 380);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) { const x = 320 + k * 150 + r * 20, y = 600 + r * 90, s = 1 + r * .15; c.fillStyle = `hsl(240,6%,${30 + R(r * 7 + k) * 12}%)`; c.beginPath(); c.moveTo(x - 30 * s, y + 30 * s); c.lineTo(x - 30 * s, y - 10 * s); c.arc(x, y - 10 * s, 30 * s, Math.PI, 0); c.lineTo(x + 30 * s, y + 30 * s); c.fill(); c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(x - 12 * s, y - 14 * s, 24 * s, 4 * s); c.fillRect(x - 2 * s, y - 24 * s, 4 * s, 24 * s); }
    if (!st.f.pz_mines) ghost(c, 600 + Math.sin(t * .5) * 300, 520 + Math.sin(t * 1.3) * 20, .9, .35 + .25 * Math.sin(t * 2));
    c.fillStyle = '#e8701a'; c.beginPath(); c.ellipse(1455, 730, 60, 46, 0, 0, TAU); c.fill(); c.fillStyle = '#2e5a1a'; c.fillRect(1450, 676, 10, 16);
    c.fillStyle = '#ffd27a'; poly(c, [[1430, 716], [1446, 716], [1438, 704]]); c.fill(); poly(c, [[1464, 716], [1480, 716], [1472, 704]]); c.fill(); c.fillRect(1430, 740, 50, 8); glow(c, 1455, 730, 80, '#ffaa40', .35 * flick(t, 4));
    for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(200,210,230,${.06 + .03 * Math.sin(t + i)})`; c.beginPath(); c.ellipse(mod(R(i) * W + t * 15, W + 400) - 200, 700 + R(i + 1) * 150, 300, 40, 0, 0, TAU); c.fill(); }
    vign(c, .85);
  }

  // ---------- Noël : l'atelier ----------
  function xmasA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#6a2a1a', 1, '#2a0e08'); c.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 80) { c.fillStyle = `rgba(0,0,0,${.06 + R(x) * .1})`; c.fillRect(x, 0, 78, 600); }
    c.fillStyle = lg(c, 0, 600, 0, H, 0, '#7a4a24', 1, '#2a160a'); c.fillRect(0, 600, W, 300);
    c.strokeStyle = '#2e7a3a'; c.lineWidth = 10; c.beginPath(); c.moveTo(0, 50); for (let x = 0; x <= W; x += 100) c.quadraticCurveTo(x + 50, 90, x + 100, 50); c.stroke();
    for (let k = 0; k < 16; k++) { const on = Math.sin(t * 3 + k) > 0, col = ['#ff4040', '#ffd040', '#40a0ff', '#60ff80'][k % 4]; c.fillStyle = on ? col : '#333'; circ(c, 50 + k * 100, 70, 7); if (on) glow(c, 50 + k * 100, 70, 26, col, .6); }
    // Cloches
    c.fillStyle = '#5a3418'; c.fillRect(110, 120, 400, 12);
    for (let k = 0; k < 5; k++) { const x = 150 + k * 80, sw = Math.sin(t * 2 + k) * (st.f.pz_bells ? .25 : .05); c.save(); c.translate(x, 132); c.rotate(sw); c.strokeStyle = '#c0392b'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 40 + k * 8); c.stroke(); c.translate(0, 40 + k * 8);
      c.fillStyle = lg(c, -26, 0, 26, 0, 0, '#a8801a', .5, '#f2d060', 1, '#8a6010'); c.beginPath(); c.moveTo(-8, 0); c.quadraticCurveTo(-22 - k, 30, -28 - k * 2, 50 + k * 4); c.lineTo(28 + k * 2, 50 + k * 4); c.quadraticCurveTo(22 + k, 30, 8, 0); c.fill(); c.fillStyle = '#8a6010'; circ(c, 0, 52 + k * 4, 6); c.restore(); }
    c.save(); c.translate(270, 530); c.rotate(.04); c.fillStyle = '#fff6c8'; c.fillRect(-160, -50, 320, 100); c.fillStyle = '#c0392b'; circ(c, 0, -46, 6); c.fillStyle = '#556'; for (let i = 0; i < 4; i++) c.fillRect(-140, -26 + i * 18, 260 - R(i) * 80, 5); c.restore();
    // Étagères de jouets
    c.fillStyle = '#4a2a14'; for (let s = 0; s < 3; s++) c.fillRect(600, 190 + s * 100, 480, 10);
    ['🧸', '🚂', '🪀', '🎨', '🪁', '🎲', '🪆', '🚗', '⚽', '🎺', '🪅', '🛷'].forEach((e, k) => txt(c, e, 640 + (k % 4) * 120, 180 + Math.floor(k / 4) * 100, '48px Segoe UI Emoji', '#000'));
    // Table d'emballage
    c.fillStyle = lg(c, 0, 560, 0, 620, 0, '#9a6a3a', 1, '#6a4220'); poly(c, [[580, 580], [1020, 580], [1050, 630], [550, 630]]); c.fill(); c.fillStyle = '#4a2a14'; c.fillRect(570, 630, 470, 140);
    c.fillStyle = '#c0392b'; c.fillRect(620, 520, 90, 64); c.fillStyle = '#ffd040'; c.fillRect(658, 520, 14, 64); c.fillStyle = '#2e7a3a'; c.fillRect(740, 540, 70, 44); c.fillStyle = '#fff'; c.fillRect(770, 540, 10, 44);
    c.save(); c.translate(900, 590); c.rotate(-.1); c.fillStyle = '#e8f0ff'; [[0, 0], [30, 0], [60, 0], [30, -30], [30, 30], [90, 0]].forEach(([x, y]) => { c.fillRect(x - 40, y - 14, 28, 28); c.strokeStyle = '#2e6fd1'; c.strokeRect(x - 40, y - 14, 28, 28); }); c.restore();
    // Porte du hangar
    c.fillStyle = '#2a1408'; c.fillRect(1170, 130, 360, 620); c.fillStyle = lg(c, 1180, 0, 1520, 0, 0, '#8a2a1a', .5, '#a83a24', 1, '#6a1a10'); c.fillRect(1180, 140, 340, 600);
    c.strokeStyle = '#f2d060'; c.lineWidth = 6; c.beginPath(); c.moveTo(1350, 140); c.lineTo(1350, 740); c.stroke(); c.beginPath(); c.moveTo(1180, 440); c.lineTo(1520, 440); c.stroke();
    rr(c, 1320, 470, 60, 70, 8); c.fillStyle = lg(c, 1320, 470, 1380, 540, 0, '#e8c468', 1, '#7a5a1a'); c.fill(); txt(c, '★●▲', 1350, 500, '13px Segoe UI Symbol', '#3a2a08'); txt(c, '■◆♥', 1350, 522, '13px Segoe UI Symbol', '#3a2a08');
    txt(c, '🛷', 1350, 300, '90px Segoe UI Emoji', '#000');
    glow(c, 800, 300, 700, '#ffcf8a', .12); dust(c, t, 24, 0, 100, W, 600, '#ffe6b8'); vign(c, .78);
  }

  // ---------- Noël : la cuisine ----------
  function xmasB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#e8d8b8', 1, '#a8906a'); c.fillRect(0, 0, W, H);
    for (let y = 0; y < 560; y += 40) for (let x = (y / 40) % 2 ? 20 : 0; x < W; x += 40) { c.fillStyle = (x / 40 + y / 40) % 2 ? 'rgba(200,60,40,.08)' : 'rgba(255,255,255,.08)'; c.fillRect(x, y, 40, 40); }
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#7a4a24', 1, '#3a200c'); c.fillRect(0, 560, W, 340);
    // Four et recette
    c.fillStyle = '#3a3a40'; rr(c, 120, 480, 300, 260, 16); c.fill(); c.fillStyle = '#1a1a1e'; rr(c, 150, 540, 240, 150, 10); c.fill();
    const f = .7 + .3 * Math.sin(t * 2); c.fillStyle = `rgba(255,140,40,${.5 * f})`; rr(c, 160, 550, 220, 130, 8); c.fill(); glow(c, 270, 615, 160, '#ff8a3a', .3 * f);
    for (let k = 0; k < 6; k++) { c.fillStyle = '#c8823a'; circ(c, 200 + (k % 3) * 70, 590 + Math.floor(k / 3) * 50, 18); }
    c.save(); c.translate(470, 560); c.rotate(.08); c.fillStyle = '#fff6e0'; c.fillRect(-60, -70, 130, 160); c.fillStyle = '#c0392b'; c.fillRect(-60, -70, 130, 24); txt(c, '🍪', 5, -50, '18px Segoe UI Emoji', '#000'); c.fillStyle = '#887'; for (let i = 0; i < 6; i++) c.fillRect(-46, -30 + i * 16, 90 - R(i) * 30, 5); c.restore();
    // Calendrier de l'Avent
    c.fillStyle = '#2e6a3a'; c.fillRect(620, 110, 400, 330); c.fillStyle = '#a8301a'; c.fillRect(632, 122, 376, 306);
    for (let k = 0; k < 24; k++) { const x = 644 + (k % 6) * 60, y = 136 + Math.floor(k / 6) * 72, open = st.f.pz_advent || k < 4; c.fillStyle = open ? '#f2d060' : '#e8c468'; c.fillRect(x, y, 52, 62); c.fillStyle = '#6a1a10'; c.font = 'bold 18px Georgia'; c.textAlign = 'center'; c.fillText(String(k + 1), x + 26, y + 38); c.textAlign = 'left'; }
    // Fenêtre et aurore
    c.save(); rr(c, 1150, 120, 330, 280, 10); c.clip(); c.fillStyle = '#0a1430'; c.fillRect(1150, 120, 330, 280);
    for (let k = 0; k < 3; k++) { c.strokeStyle = `rgba(${80 + k * 40},255,${160 + k * 30},${.3 + .15 * Math.sin(t + k)})`; c.lineWidth = 18 - k * 4; c.beginPath(); for (let x = 1150; x <= 1480; x += 10) c.lineTo(x, 200 + k * 20 + Math.sin(x * .02 + t * .8 + k) * 20); c.stroke(); }
    c.fillStyle = '#e8f0ff'; c.fillRect(1150, 340, 330, 60); for (let k = 0; k < 4; k++) { c.fillStyle = '#1a4a2a'; poly(c, [[1180 + k * 80, 345], [1210 + k * 80, 270], [1240 + k * 80, 345]]); c.fill(); } snow(c, t, 30, 1150, 120, 330, 280);
    c.restore(); c.strokeStyle = '#f4f1e8'; c.lineWidth = 14; rr(c, 1150, 120, 330, 280, 10); c.stroke();
    // Pot à biscuits
    c.fillStyle = 'rgba(220,235,255,.6)'; rr(c, 1200, 590, 130, 130, 20); c.fill(); c.fillStyle = '#c0392b'; rr(c, 1190, 570, 150, 26, 8); c.fill(); for (let k = 0; k < 5; k++) { c.fillStyle = '#c8823a'; circ(c, 1230 + (k % 3) * 34, 650 + Math.floor(k / 3) * 34, 14); }
    c.fillStyle = '#5a3418'; c.fillRect(80, 740, W - 160, 16);
    vign(c, .6);
  }

  // ---------- Noël : la cour enneigée ----------
  function xmasC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 520, 0, '#061030', 1, '#1a2a5a'); c.fillRect(0, 0, W, H);
    for (let i = 0; i < 80; i++) { c.fillStyle = `rgba(255,255,255,${.3 + .5 * Math.abs(Math.sin(t * .5 + i))})`; c.fillRect(R(i) * W, R(i + 5) * 300, 2, 2); }
    for (let k = 0; k < 3; k++) { c.strokeStyle = `rgba(${90 + k * 40},255,${170 + k * 20},${.2 + .1 * Math.sin(t * .7 + k)})`; c.lineWidth = 30 - k * 8; c.beginPath(); for (let x = 0; x <= W; x += 20) c.lineTo(x, 120 + k * 30 + Math.sin(x * .006 + t * .4 + k) * 40); c.stroke(); }
    c.fillStyle = '#eef4fb'; c.fillRect(0, 480, W, 420);
    // Écurie
    c.fillStyle = '#6a3a1c'; c.fillRect(820, 220, 560, 220); c.fillStyle = '#f4f8fc'; poly(c, [[800, 230], [1100, 120], [1400, 230]]); c.fill(); c.fillStyle = '#3a1e0c'; c.fillRect(900, 290, 140, 150); c.fillRect(1160, 290, 140, 150);
    txt(c, '🦌', 970, 400, '70px Segoe UI Emoji', '#000'); txt(c, '🦌', 1230, 400, '70px Segoe UI Emoji', '#000'); glow(c, 1215, 362, 26, '#ff3030', .6 + .3 * Math.sin(t * 3));
    // Sapin
    for (let k = 0; k < 5; k++) { const y = 140 + k * 110, w = 70 + k * 50; c.fillStyle = k % 2 ? '#1e5a2a' : '#246a32'; poly(c, [[380, y - 40], [380 - w, y + 90], [380 + w, y + 90]]); c.fill(); c.fillStyle = '#f4f8fc'; poly(c, [[380 - w, y + 90], [380 + w, y + 90], [380 + w - 20, y + 80], [380 - w + 20, y + 80]]); c.fill(); }
    c.fillStyle = '#5a3418'; c.fillRect(360, 680, 40, 80);
    const lit = st.f.pz_garland; for (let k = 0; k < 18; k++) { const y = 200 + (k % 6) * 80, x = 380 + Math.sin(k * 2.3) * (40 + (k % 6) * 30), col = ['#d33a2c', '#2e9a4a', '#e8b830'][k % 3]; c.fillStyle = col; circ(c, x, y, 10); if (lit || Math.sin(t * 5 + k) > .6) glow(c, x, y, 30, col, .6); }
    txt(c, '⭐', 380, 120, '60px Segoe UI Emoji', '#000'); if (lit) glow(c, 380, 100, 120, '#fff0a0', .6);
    // Patinoire
    c.fillStyle = lg(c, 0, 540, 0, 850, 0, '#bfe4f8', 1, '#8ac4e8'); c.beginPath(); c.ellipse(1110, 690, 400, 150, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(1110 + Math.sin(k) * 80, 690 + Math.cos(k * 2) * 30, 120 - k * 15, 30, k * .3, 0, 4); c.stroke(); }
    txt(c, '🛷', 900 + Math.sin(t * .6) * 60, 720, '50px Segoe UI Emoji', '#000'); txt(c, '🎁', 1300, 680, '44px Segoe UI Emoji', '#000');
    snow(c, t, 160, 0, 0, W, H); vign(c, .6);
  }

  Object.assign(window.Scenes, { hallA, hallB, hallC, xmasA, xmasB, xmasC });
})();

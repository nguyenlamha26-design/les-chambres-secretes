// Décors : l'Académie de Brumeval, la Famille Corsetti et l'Agora du temps.
(function () {
  'use strict';
  const { W, H, TAU, R, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const candle = (c, t, x, y, k, s = 1) => { c.fillStyle = '#efe6d0'; c.fillRect(x - 5 * s, y, 10 * s, 34 * s); const f = flick(t, k); c.fillStyle = '#ffd27a'; c.beginPath(); c.ellipse(x, y - 8 * s, 4 * s, 10 * s * f, 0, 0, TAU); c.fill(); glow(c, x, y - 8 * s, 120 * s, '#ffaa40', .35 * f); };
  const bricks = (c, x0, y0, w, h, a, b) => { c.fillStyle = a; c.fillRect(x0, y0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let y = y0; y < y0 + h; y += 40) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke(); for (let x = x0 + ((y - y0) / 40 % 2) * 40; x < x0 + w; x += 80) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 40); c.stroke(); } } };
  // Personnage stylisé : toge ou costume, tête, cheveux et barbe
  function sage(c, x, y, s, o) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 0, 70, 14, 0, 0, TAU); c.fill();
    c.fillStyle = o.robe; poly(c, [[-56, 0], [56, 0], [42, -150], [-42, -150]]); c.fill();
    if (o.sash) { c.fillStyle = o.sash; poly(c, [[-42, -150], [-20, -150], [40, 0], [16, 0]]); c.fill(); }
    if (o.collar) { c.fillStyle = o.collar; poly(c, [[-14, -150], [14, -150], [0, -118]]); c.fill(); }
    c.fillStyle = o.skin || '#e8c09a'; circ(c, 0, -178, 30);
    if (o.hair) { c.fillStyle = o.hair; c.beginPath(); c.arc(0, -184, 31, Math.PI * 1.05, Math.PI * 1.95); c.fill(); if (o.long) { c.fillRect(-31, -186, 12, 44); c.fillRect(19, -186, 12, 44); } }
    if (o.beard) { c.fillStyle = o.beard; c.beginPath(); c.moveTo(-26, -172); c.quadraticCurveTo(0, -100 - (o.bl || 0), 26, -172); c.quadraticCurveTo(0, -154, -26, -172); c.fill(); }
    if (o.wig) { c.fillStyle = o.wig; circ(c, -26, -176, 16); circ(c, 26, -176, 16); circ(c, 0, -200, 24); }
    c.fillStyle = '#2a1a10'; circ(c, -10, -180, 3); circ(c, 10, -180, 3);
    c.restore();
  }

  // ======================= ACADÉMIE DE BRUMEVAL =======================
  function magicA(c, t, st) {
    bricks(c, 0, 0, W, 620, '#2a2430', 'rgba(0,0,0,.35)');
    c.fillStyle = lg(c, 0, 0, 0, 620, 0, 'rgba(60,40,90,.2)', 1, 'rgba(0,0,0,.4)'); c.fillRect(0, 0, W, 620);
    c.fillStyle = lg(c, 0, 600, 0, H, 0, '#3a3034', 1, '#120e10'); c.fillRect(0, 600, W, 300);
    // Étagères de flacons
    c.fillStyle = '#4a2e1a'; c.fillRect(1120, 120, 400, 440); c.fillStyle = '#2a1a0e'; c.fillRect(1134, 134, 372, 412);
    for (let r = 0; r < 4; r++) { c.fillStyle = '#5a3a20'; c.fillRect(1120, 230 + r * 100, 400, 12); for (let k = 0; k < 7; k++) { const x = 1150 + k * 50, col = ['#e84a8a', '#4ae8c8', '#e8d44a', '#8a5aff', '#4a9aff', '#ff7a3a', '#7aff7a'][(k + r) % 7]; c.fillStyle = col; rr(c, x, 180 + r * 100, 26, 50, 8); c.fill(); c.fillStyle = '#c8b8a0'; c.fillRect(x + 8, 170 + r * 100, 10, 12); glow(c, x + 13, 205 + r * 100, 40, col, .18 + .1 * Math.sin(t * 2 + k + r)); } }
    // Chaudron
    const bubbling = !st.f.pz_potion, col = st.f.pz_potion ? '#ffe680' : '#6ae88a';
    c.fillStyle = '#ff7a20'; for (let k = 0; k < 5; k++) { const f = flick(t, k); c.beginPath(); c.ellipse(720 + k * 40, 760, 18, 40 * f, 0, 0, TAU); c.fill(); } glow(c, 800, 760, 240, '#ff8a30', .5);
    c.fillStyle = lg(c, 560, 0, 1040, 0, 0, '#1a1a1e', .5, '#3a3a40', 1, '#141418'); c.beginPath(); c.ellipse(800, 600, 250, 160, 0, 0, Math.PI); c.fill(); c.fillRect(550, 560, 500, 40);
    c.fillStyle = col; c.beginPath(); c.ellipse(800, 560, 240, 40, 0, 0, TAU); c.fill(); glow(c, 800, 540, 300, col, .45);
    if (bubbling) for (let k = 0; k < 8; k++) { const ph = (t * .8 + k * .37) % 1, x = 640 + R(k) * 320, y = 556 - ph * 160; c.globalAlpha = 1 - ph; c.fillStyle = col; circ(c, x + Math.sin(t * 3 + k) * 10, y, 8 + 10 * ph); } c.globalAlpha = 1;
    // Parchemin flottant
    const py = 190 + Math.sin(t * 1.3) * 12; c.save(); c.translate(800, py); c.rotate(Math.sin(t * .9) * .04); c.fillStyle = '#f2e2b8'; rr(c, -160, -80, 320, 160, 10); c.fill(); c.fillStyle = '#d8c090'; c.fillRect(-170, -86, 340, 14); c.fillRect(-170, 72, 340, 14);
    txt(c, '★ ● ▲ ■ ◆ ♥', 0, -20, '28px Segoe UI Symbol', '#6a3a10'); for (let k = 0; k < 3; k++) { c.fillStyle = '#9a7a4a'; c.fillRect(-120, 10 + k * 18, 240 - k * 40, 5); } c.restore(); glow(c, 800, py, 260, '#fff2c0', .25);
    // Boîte à baguette
    c.save(); c.translate(270, 640); c.rotate(-.06); c.fillStyle = '#5a2a1a'; rr(c, -180, -50, 360, 100, 8); c.fill(); c.fillStyle = '#7a3a22'; c.fillRect(-180, -50, 360, 26); c.fillStyle = '#c9a050'; c.fillRect(-12, -40, 24, 30); c.restore();
    c.strokeStyle = '#d8c8a8'; c.lineWidth = 8; c.beginPath(); c.moveTo(120, 560); c.lineTo(400, 540); c.stroke(); glow(c, 400, 540, 50, '#c8b8ff', .5 + .3 * Math.sin(t * 4));
    // Grimoire tombé
    c.save(); c.translate(1310, 690); c.rotate(.18); c.fillStyle = '#3a1a4a'; rr(c, -110, -50, 220, 100, 6); c.fill(); c.fillStyle = '#e8dcc0'; c.fillRect(-100, -42, 200, 84); c.fillStyle = '#3a1a4a'; c.fillRect(-4, -46, 8, 92); c.restore();
    [[180, 300], [1000, 280]].forEach(([x, y], k) => candle(c, t, x, y, k));
    dust(c, t, 22, 0, 0, W, 700, '#c8ffd8'); vign(c, .8);
  }

  function magicB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#141a3a', 1, '#06081a'); c.fillRect(0, 0, W, H);
    c.fillStyle = '#3a3448'; c.fillRect(0, 640, W, 260); bricks(c, 0, 0, 100, 640, '#2e2a3a', 'rgba(0,0,0,.3)'); bricks(c, 1520, 0, 80, 640, '#2e2a3a', 'rgba(0,0,0,.3)');
    // Fenêtre et ciel étoilé, balai
    c.fillStyle = '#0a1030'; c.beginPath(); c.moveTo(1140, 620); c.lineTo(1140, 260); c.arc(1310, 260, 170, Math.PI, 0); c.lineTo(1480, 620); c.fill();
    for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(255,255,255,${.4 + .6 * Math.abs(Math.sin(t + k))})`; c.fillRect(1150 + R(k) * 320, 110 + R(k + 3) * 500, 2, 2); }
    c.fillStyle = '#fff6d8'; circ(c, 1390, 220, 40); c.fillStyle = '#0a1030'; circ(c, 1408, 210, 36);
    c.strokeStyle = '#6a4a2a'; c.lineWidth = 14; c.beginPath(); c.moveTo(1140, 620); c.lineTo(1140, 260); c.arc(1310, 260, 170, Math.PI, 0); c.lineTo(1480, 620); c.stroke();
    const by = 520 + Math.sin(t * 2) * 10; c.save(); c.translate(1310, by); c.rotate(-.15); c.strokeStyle = '#8a5a2a'; c.lineWidth = 10; c.beginPath(); c.moveTo(-130, 0); c.lineTo(90, 0); c.stroke(); c.fillStyle = '#c8a050'; poly(c, [[90, -16], [170, -30], [170, 30], [90, 16]]); c.fill(); c.restore();
    // Horloge géante
    c.fillStyle = '#2a1e14'; circ(c, 330, 400, 220); c.fillStyle = '#e8dcc0'; circ(c, 330, 400, 190);
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12; txt(c, ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][k], 330 + Math.sin(a) * 160, 410 - Math.cos(a) * 160, 'bold 24px Georgia', '#3a2a14'); }
    [[300, 470, 60, t * .6], [380, 450, 40, -t * .9], [330, 360, 30, t * 1.2]].forEach(([x, y, r, a]) => { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = 'rgba(180,140,60,.8)'; for (let k = 0; k < 12; k++) { c.rotate(TAU / 12); c.fillRect(-5, -r - 8, 10, 12); } circ(c, 0, 0, r); c.fillStyle = '#e8dcc0'; circ(c, 0, 0, r * .35); c.restore(); });
    c.strokeStyle = '#1a1208'; c.lineWidth = 8; c.lineCap = 'round'; const hr = st.f.pz_clock ? 0 : t * .05, mn = st.f.pz_clock ? 0 : t * .6; c.beginPath(); c.moveTo(330, 400); c.lineTo(330 + Math.sin(hr) * 90, 400 - Math.cos(hr) * 90); c.moveTo(330, 400); c.lineTo(330 + Math.sin(mn) * 140, 400 - Math.cos(mn) * 140); c.stroke(); c.lineCap = 'butt';
    // Télescope
    c.save(); c.translate(810, 330); c.rotate(-.5); c.fillStyle = lg(c, -140, 0, 140, 0, 0, '#c9a050', .5, '#f2d080', 1, '#9a7020'); rr(c, -140, -26, 280, 52, 20); c.fill(); c.fillStyle = '#1a2040'; circ(c, 140, 0, 26); c.restore();
    c.strokeStyle = '#6a5030'; c.lineWidth = 8; c.beginPath(); c.moveTo(810, 340); c.lineTo(760, 430); c.moveTo(810, 340); c.lineTo(860, 430); c.stroke();
    // Table des cartes du ciel
    c.fillStyle = '#4a3020'; c.fillRect(620, 560, 420, 20); c.fillRect(640, 580, 16, 140); c.fillRect(1004, 580, 16, 140);
    [[650, 470, -.1], [790, 460, .06], [900, 480, -.04]].forEach(([x, y, a], k) => { c.save(); c.translate(x + 60, y + 50); c.rotate(a); c.fillStyle = '#1a2450'; rr(c, -70, -50, 140, 100, 6); c.fill(); for (let s = 0; s < 6; s++) txt(c, '★', -50 + R(s + k * 7) * 100, -24 + R(s + k * 5) * 70, '14px Segoe UI Symbol', '#fff4c0'); c.restore(); });
    dust(c, t, 16, 0, 0, W, 700, '#d8e0ff'); vign(c, .8);
  }

  function magicC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#1e1610', 1, '#0a0806'); c.fillRect(0, 0, W, H);
    [[80, 400], [1560, 40]].forEach(([x, w]) => { for (let r = 0; r < 6; r++) { c.fillStyle = '#3a2412'; c.fillRect(x, 160 + r * 90, w === 40 ? 0 : 400, 10); for (let k = 0; k < 16; k++) { c.fillStyle = ['#7a2a2a', '#2a4a7a', '#3a6a3a', '#7a6a2a', '#5a2a6a'][(k + r) % 5]; c.fillRect(x + 6 + k * 24, 100 + r * 90 + R(k + r) * 12, 20, 60 - R(k + r) * 12); } } });
    c.fillStyle = '#4a2e18'; c.fillRect(70, 150, 12, 560); c.fillRect(480, 150, 12, 560);
    // Miroir
    c.fillStyle = lg(c, 560, 0, 1040, 0, 0, '#8a6a2a', .5, '#e8c468', 1, '#8a6a2a'); rr(c, 560, 110, 480, 620, 200); c.fill();
    c.fillStyle = lg(c, 0, 140, 0, 700, 0, '#3a4a6a', .5, '#1a2440', 1, '#0e1428'); rr(c, 590, 140, 420, 560, 180); c.fill();
    const sh = (t * .3) % 2; c.fillStyle = 'rgba(255,255,255,.08)'; poly(c, [[590 + sh * 300, 140], [650 + sh * 300, 140], [590 + sh * 300 - 120, 700], [530 + sh * 300 - 120, 700]]); c.fill();
    if (!st.f.pz_mirror) { c.strokeStyle = `rgba(200,180,255,${.4 + .3 * Math.sin(t * 2)})`; c.lineWidth = 6; c.beginPath(); c.moveTo(740, 330); c.lineTo(860, 330); c.lineTo(800, 460); c.lineTo(860, 540); c.stroke(); } else txt(c, '♥', 800, 460, 'bold 120px Segoe UI Symbol', '#ff8ab0');
    // Grande porte
    c.fillStyle = '#1a1008'; c.beginPath(); c.moveTo(1180, 720); c.lineTo(1180, 300); c.arc(1350, 300, 170, Math.PI, 0); c.lineTo(1520, 720); c.fill();
    c.fillStyle = lg(c, 1190, 0, 1510, 0, 0, '#4a2e18', .5, '#6a4224', 1, '#3a2412'); c.beginPath(); c.moveTo(1196, 710); c.lineTo(1196, 304); c.arc(1350, 304, 154, Math.PI, 0); c.lineTo(1504, 710); c.fill();
    ['★', '●', '▲', '■', '◆', '♥'].forEach((s, k) => { const a = Math.PI + (k + .5) * Math.PI / 6; txt(c, s, 1350 + Math.cos(a) * 110, 320 + Math.sin(a) * 110, '26px Segoe UI Symbol', `rgba(200,180,255,${.5 + .3 * Math.sin(t * 2 + k)})`); });
    c.fillStyle = '#c9a050'; circ(c, 1460, 520, 14);
    dust(c, t, 20, 0, 0, W, 800, '#ffe8c0'); vign(c, .85);
  }

  // ======================= FAMILLE CORSETTI =======================
  function mafiaA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 600, 0, '#3a1e14', 1, '#1e0e08'); c.fillRect(0, 0, W, 600);
    for (let x = 0; x < W; x += 60) { c.fillStyle = x % 120 ? 'rgba(255,200,120,.04)' : 'rgba(0,0,0,.12)'; c.fillRect(x, 0, 60, 600); }
    c.fillStyle = lg(c, 0, 600, 0, H, 0, '#2a1a12', 1, '#0e0806'); c.fillRect(0, 600, W, 300);
    for (let k = 0; k < 10; k++) { c.fillStyle = k % 2 ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.03)'; poly(c, [[k * 160, 600], [k * 160 + 160, 600], [k * 200 + 120, 900], [k * 200 - 80, 900]]); c.fill(); }
    // Comptoir et bouteilles
    c.fillStyle = '#5a2e14'; c.fillRect(380, 120, 840, 30); for (let r = 0; r < 2; r++) for (let k = 0; k < 16; k++) { const x = 400 + k * 50, y = 160 + r * 110; c.fillStyle = ['#8a5a1a', '#2a6a2a', '#7a1a1a', '#c8a050'][(k + r) % 4]; rr(c, x, y + 20, 30, 70, 6); c.fill(); c.fillRect(x + 10, y, 10, 22); glow(c, x + 15, y + 50, 30, '#ffb060', .12); }
    c.fillStyle = '#3a1e0c'; c.fillRect(380, 380, 840, 20);
    // Lampes
    [500, 800, 1100].forEach((x, k) => { c.strokeStyle = '#1a0e08'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 60); c.stroke(); c.fillStyle = '#c87a2a'; poly(c, [[x - 40, 90], [x + 40, 90], [x + 16, 60], [x - 16, 60]]); c.fill(); glow(c, x, 110, 260, '#ffb060', .4 * flick(t, k)); });
    // Table de poker
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(800, 720, 330, 60, 0, 0, TAU); c.fill();
    c.fillStyle = '#4a2a14'; c.beginPath(); c.ellipse(800, 640, 320, 110, 0, 0, TAU); c.fill(); c.fillStyle = rg(c, 800, 620, 300, 0, '#2a8a4a', 1, '#14502a'); c.beginPath(); c.ellipse(800, 632, 296, 96, 0, 0, TAU); c.fill();
    for (let k = 0; k < 4; k++) { const a = k * TAU / 4 + .4, x = 800 + Math.cos(a) * 200, y = 632 + Math.sin(a) * 60; for (let j = 0; j < 3; j++) { c.fillStyle = '#f4f0e8'; rr(c, x - 30 + j * 14, y - 20, 28, 40, 4); c.fill(); } }
    [[740, 620, '#c0392b'], [770, 630, '#2a5ad8'], [860, 615, '#1a1a1a']].forEach(([x, y, col]) => { for (let j = 0; j < 4; j++) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y - j * 5, 14, 6, 0, 0, TAU); c.fill(); } });
    // Téléphone mural
    c.fillStyle = '#1a1a1a'; rr(c, 1270, 300, 140, 190, 14); c.fill(); c.fillStyle = '#e8e0d0'; circ(c, 1340, 400, 46); c.fillStyle = '#1a1a1a'; for (let k = 0; k < 10; k++) { const a = -2.4 + k * .5; circ(c, 1340 + Math.cos(a) * 30, 400 + Math.sin(a) * 30, 6); }
    c.fillStyle = '#2a2a2a'; rr(c, 1250, 270, 180, 34, 14); c.fill(); if (!st.f.pz_phone) glow(c, 1300, 300, 60, '#ff3a3a', .4 * (Math.sin(t * 5) > 0 ? 1 : .2));
    // Mot sous la porte
    c.fillStyle = '#1a0e08'; c.fillRect(40, 300, 280, 420); c.fillStyle = '#5a3a20'; c.fillRect(56, 316, 248, 400); c.fillStyle = 'rgba(255,220,150,.5)'; c.fillRect(56, 712, 248, 6);
    if (!st.f.doc_note) { c.save(); c.translate(190, 740); c.rotate(.1); c.fillStyle = '#f4ecd8'; c.fillRect(-60, -24, 120, 48); c.restore(); }
    // Journal froissé
    c.save(); c.translate(1460, 710); c.rotate(-.3); c.fillStyle = '#d8d0b8'; c.fillRect(-70, -44, 140, 88); c.fillStyle = '#5a5a5a'; c.fillRect(-60, -34, 120, 12); for (let k = 0; k < 4; k++) c.fillRect(-60, -12 + k * 12, 50, 4); c.restore();
    dust(c, t, 26, 0, 0, W, 700, '#ffd8a0'); vign(c, .8);
  }

  function mafiaB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#2a3a2a', 1, '#141e14'); c.fillRect(0, 0, W, 640);
    for (let x = 0; x < W; x += 40) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x, 0, 2, 640); }
    c.fillStyle = lg(c, 0, 640, 0, H, 0, '#5a1a1a', 1, '#2a0a0a'); c.fillRect(0, 640, W, 260);
    // Carte de Montréal
    c.fillStyle = '#5a3a1a'; c.fillRect(80, 120, 420, 380); c.fillStyle = '#e8dcbc'; c.fillRect(96, 136, 388, 348);
    c.strokeStyle = '#4a8ac8'; c.lineWidth = 16; c.beginPath(); c.moveTo(96, 440); c.quadraticCurveTo(300, 380, 484, 460); c.stroke();
    c.strokeStyle = 'rgba(80,60,40,.5)'; c.lineWidth = 2; for (let k = 0; k < 8; k++) { c.beginPath(); c.moveTo(96 + k * 50, 136); c.lineTo(96 + k * 50 + 30, 420); c.stroke(); c.beginPath(); c.moveTo(96, 160 + k * 34); c.lineTo(484, 150 + k * 34); c.stroke(); }
    [[180, 220, '#c0392b'], [320, 260, '#2a5ad8'], [400, 200, '#2a8a4a'], [240, 340, '#c89a10']].forEach(([x, y, col]) => { c.fillStyle = col; circ(c, x, y, 10); });
    // Bureau et livre de comptes
    c.fillStyle = '#4a2a14'; c.fillRect(540, 540, 520, 30); c.fillStyle = '#3a1e0c'; c.fillRect(560, 570, 100, 160); c.fillRect(940, 570, 100, 160);
    c.fillStyle = '#2a1a0e'; c.save(); c.translate(800, 520); c.rotate(-.04); c.fillStyle = '#5a1a1a'; rr(c, -140, -30, 280, 60, 6); c.fill(); c.fillStyle = '#f2e8d0'; c.fillRect(-130, -26, 125, 50); c.fillRect(5, -26, 125, 50); c.fillStyle = '#6a6a6a'; for (let k = 0; k < 5; k++) { c.fillRect(-120, -18 + k * 9, 100, 3); c.fillRect(15, -18 + k * 9, 100, 3); } c.restore();
    c.fillStyle = '#1a1a1a'; rr(c, 960, 470, 70, 50, 8); c.fill(); txt(c, '☎', 995, 506, '30px Segoe UI Symbol', '#c9a050');
    candle(c, t, 620, 470, 2, 1.1); c.fillStyle = '#c8c8c8'; circ(c, 700, 525, 18); c.fillStyle = '#5a5a5a'; circ(c, 700, 525, 8);
    // Coffre vide
    c.fillStyle = '#2a2e34'; rr(c, 1140, 160, 340, 460, 16); c.fill(); c.fillStyle = '#14161a'; rr(c, 1170, 190, 280, 400, 8); c.fill();
    c.save(); c.translate(1140, 160); c.transform(1, .1, -0.0, 1, 0, 0); c.fillStyle = lg(c, -200, 0, 0, 0, 0, '#3a3e46', 1, '#5a5e66'); c.fillRect(-180, 30, 180, 400); c.fillStyle = '#c9a050'; circ(c, -90, 230, 34); c.fillStyle = '#2a2e34'; circ(c, -90, 230, 20); c.restore();
    // Lampe verte de banquier
    c.fillStyle = '#c9a050'; c.fillRect(1100, 470, 8, 70); c.fillStyle = '#1a6a3a'; poly(c, [[1050, 470], [1160, 470], [1140, 440], [1070, 440]]); c.fill(); glow(c, 1104, 500, 200, '#fff0b0', .4);
    dust(c, t, 18, 0, 0, W, 700, '#ffe8c0'); vign(c, .75);
  }

  function mafiaC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 560, 0, '#1a2228', 1, '#0e1418'); c.fillRect(0, 0, W, 560);
    for (let x = 0; x < W; x += 30) { c.fillStyle = x % 60 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.2)'; c.fillRect(x, 0, 30, 560); }
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#3a3430', 1, '#141210'); c.fillRect(0, 560, W, 340);
    for (let k = 0; k < 12; k++) { c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 580 + k * 28); c.lineTo(W, 580 + k * 28); c.stroke(); }
    // Ampoule qui se balance
    const sw = Math.sin(t * 1.2) * .2; c.save(); c.translate(700, 0); c.rotate(sw); c.strokeStyle = '#111'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 200); c.stroke(); c.fillStyle = '#fff2c0'; circ(c, 0, 214, 16); c.restore();
    glow(c, 700 + Math.sin(sw) * 210, 214, 520, '#ffe0a0', .4 * flick(t, 1));
    // Caisses
    [[120, 520, 220, 180], [350, 560, 200, 140], [560, 500, 240, 200], [200, 380, 180, 140], [600, 380, 160, 120], [810, 580, 170, 120]].forEach(([x, y, w, h], k) => {
      c.fillStyle = lg(c, x, y, x, y + h, 0, '#b88a4a', 1, '#7a5a2a'); c.fillRect(x, y, w, h); c.strokeStyle = '#5a3a1a'; c.lineWidth = 6; c.strokeRect(x + 3, y + 3, w - 6, h - 6); c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y + h); c.stroke();
      txt(c, ['RHUM', 'CAFÉ', 'SIROP', 'THÉ', 'VIN', 'FROMAGE'][k], x + w / 2, y + h / 2 + 8, 'bold 22px Georgia', 'rgba(40,20,0,.7)');
    });
    // Tableau des alibis
    c.fillStyle = '#4a3020'; c.fillRect(1060, 120, 380, 320); c.fillStyle = '#b8905a'; c.fillRect(1074, 134, 352, 292);
    for (let k = 0; k < 5; k++) { const x = 1100 + (k % 3) * 110, y = 160 + Math.floor(k / 3) * 130; c.fillStyle = '#e8e4d8'; c.fillRect(x, y, 80, 100); c.fillStyle = '#5a5a5a'; circ(c, x + 40, y + 40, 20); c.fillRect(x + 20, y + 62, 40, 30); c.fillStyle = '#c0392b'; circ(c, x + 40, y + 6, 5); }
    c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(1140, 166); c.lineTo(1250, 296); c.lineTo(1360, 166); c.stroke();
    // Porte de service
    c.fillStyle = '#14161a'; c.fillRect(1230, 470, 280, 340); c.fillStyle = lg(c, 1250, 0, 1490, 0, 0, '#4a5058', .5, '#6a7078', 1, '#3a4048'); c.fillRect(1250, 490, 240, 320);
    c.fillStyle = '#1a1a1a'; rr(c, 1320, 600, 100, 70, 8); c.fill(); txt(c, '★●▲', 1370, 630, '15px Segoe UI Symbol', '#ffd27a'); txt(c, '■◆♥', 1370, 654, '15px Segoe UI Symbol', '#ffd27a');
    txt(c, 'QUAI 7', 1370, 530, 'bold 24px Consolas', '#e8e8e8');
    dust(c, t, 24, 0, 0, W, 800, '#ffe8c0'); vign(c, .85);
  }

  // ======================= L'AGORA DU TEMPS =======================
  const column = (c, x, y, h, w) => { c.fillStyle = lg(c, x - w / 2, 0, x + w / 2, 0, 0, '#c8bca0', .4, '#f4ecd8', 1, '#a89c80'); c.fillRect(x - w / 2, y, w, h); for (let k = 1; k < 5; k++) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x - w / 2 + k * w / 5, y, 2, h); } c.fillStyle = '#e8dcc0'; c.fillRect(x - w / 2 - 14, y - 20, w + 28, 22); c.fillRect(x - w / 2 - 10, y + h, w + 20, 20); };
  function philoA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 520, 0, '#f8c870', .6, '#ffe0a8', 1, '#f8ecd0'); c.fillRect(0, 0, W, 520); glow(c, 1300, 120, 380, '#fff4d0', .6);
    c.fillStyle = '#c8b898'; poly(c, [[0, 420], [300, 360], [520, 400], [800, 330], [1100, 380], [1400, 340], [W, 400], [W, 520], [0, 520]]); c.fill();
    // Temple au loin
    c.fillStyle = '#e8dcc0'; poly(c, [[560, 250], [1040, 250], [800, 170]]); c.fill(); c.fillRect(570, 250, 460, 16); for (let k = 0; k < 8; k++) c.fillRect(590 + k * 58, 266, 22, 110); c.fillRect(570, 376, 460, 14);
    c.fillStyle = lg(c, 0, 520, 0, H, 0, '#e8dcc0', 1, '#b8a888'); c.fillRect(0, 520, W, 380);
    for (let k = 0; k < 14; k++) { c.strokeStyle = 'rgba(120,100,70,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(k * 120, 520); c.lineTo(k * 160 - 200, 900); c.stroke(); }
    column(c, 80, 140, 520, 70); column(c, 1520, 140, 520, 70);
    // Socrate (pieds nus, toge blanche, barbe)
    sage(c, 400, 760, 1.5, { robe: '#f4f0e4', sash: '#d8cfb8', beard: '#e8e4dc', hair: '#e8e4dc', bl: 20, skin: '#e0b48a' });
    // Platon (toge bleue, barbe brune) et ses solides
    sage(c, 1150, 760, 1.5, { robe: '#5a7ab8', sash: '#e8dcc0', beard: '#6a4a2a', hair: '#6a4a2a', bl: 10 });
    [[1300, 500, '#8adcff'], [1340, 560, '#ffd27a'], [1270, 580, '#c8a8ff']].forEach(([x, y, col], k) => { c.save(); c.translate(x, y + Math.sin(t * 1.5 + k) * 8); c.rotate(t * .5 + k); c.fillStyle = col; c.globalAlpha = .8; poly(c, [[0, -24], [22, 12], [-22, 12]]); c.fill(); c.restore(); c.globalAlpha = 1; glow(c, x, y, 60, col, .3); });
    // Rouleau
    c.fillStyle = '#f2e2b8'; rr(c, 690, 640, 200, 60, 20); c.fill(); c.fillStyle = '#c8a870'; circ(c, 690, 670, 30); circ(c, 890, 670, 30); c.fillStyle = '#8a6a3a'; for (let k = 0; k < 3; k++) c.fillRect(720, 652 + k * 14, 140, 4);
    // Tonneau de Diogène
    c.fillStyle = lg(c, 1410, 0, 1550, 0, 0, '#6a4224', .5, '#9a6a3a', 1, '#5a3a1a'); c.beginPath(); c.ellipse(1480, 650, 70, 110, 0, 0, TAU); c.fill(); c.strokeStyle = '#3a2a1a'; c.lineWidth = 6; [590, 650, 710].forEach(y => { c.beginPath(); c.moveTo(1416, y); c.lineTo(1544, y); c.stroke(); });
    if (!st.f.lant) { c.fillStyle = '#ffd27a'; circ(c, 1480, 560, 10); glow(c, 1480, 560, 60, '#ffb040', .4 * flick(t, 4)); }
    dust(c, t, 18, 0, 0, W, 700, '#fff0c8'); vign(c, .45);
  }

  function philoB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#e8dcc8', 1, '#c8b898'); c.fillRect(0, 0, W, 640);
    for (let x = 60; x < W; x += 260) { c.strokeStyle = '#c9a050'; c.lineWidth = 4; c.strokeRect(x, 60, 200, 480); }
    c.fillStyle = lg(c, 0, 640, 0, H, 0, '#8a5a3a', 1, '#4a2a1a'); c.fillRect(0, 640, W, 260);
    for (let k = 0; k < 20; k++) { c.fillStyle = k % 2 ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.04)'; poly(c, [[k * 80, 640], [k * 80 + 80, 640], [k * 100 + 40, 900], [k * 100 - 60, 900]]); c.fill(); }
    // Lustre
    c.strokeStyle = '#c9a050'; c.lineWidth = 3; c.beginPath(); c.moveTo(800, 0); c.lineTo(800, 70); c.stroke(); for (let k = 0; k < 6; k++) { const x = 680 + k * 48; candle(c, t, x, 90, k, .6); } c.fillStyle = '#c9a050'; c.fillRect(670, 112, 260, 8);
    // Descartes à son bureau, avec un quadrillage
    c.fillStyle = '#e8e0cc'; c.fillRect(140, 160, 280, 220); c.strokeStyle = '#8a7a5a'; c.lineWidth = 1; for (let k = 0; k <= 8; k++) { c.beginPath(); c.moveTo(140 + k * 35, 160); c.lineTo(140 + k * 35, 380); c.stroke(); c.beginPath(); c.moveTo(140, 160 + k * 27.5); c.lineTo(420, 160 + k * 27.5); c.stroke(); }
    c.strokeStyle = '#2a1a0a'; c.lineWidth = 3; c.beginPath(); c.moveTo(140, 325); c.lineTo(420, 325); c.moveTo(175, 160); c.lineTo(175, 380); c.stroke();
    txt(c, '🪰', 280 + Math.sin(t) * 60, 260 + Math.cos(t * 1.3) * 40, '22px Segoe UI Emoji', '#000');
    sage(c, 360, 720, 1.45, { robe: '#1a1a1e', collar: '#f4f0e8', hair: '#2a1a10', long: true, beard: '#2a1a10', bl: -40 });
    // Rousseau
    sage(c, 1190, 720, 1.45, { robe: '#7a4a2a', collar: '#f4f0e8', wig: '#e8e0d0' });
    c.fillStyle = '#4a2a1a'; c.fillRect(1320, 500, 140, 20); c.fillStyle = '#d8d0c0'; rr(c, 1340, 430, 100, 70, 10); c.fill(); txt(c, '🗳️', 1390, 480, '40px Segoe UI Emoji', '#000');
    // Carnet de citations
    c.save(); c.translate(790, 640); c.rotate(-.05); c.fillStyle = '#6a2a2a'; rr(c, -130, -70, 260, 140, 8); c.fill(); c.fillStyle = '#f4ecd8'; c.fillRect(-120, -62, 116, 124); c.fillRect(4, -62, 116, 124); c.fillStyle = '#7a6a5a'; for (let k = 0; k < 6; k++) { c.fillRect(-110, -48 + k * 18, 96, 3); c.fillRect(14, -48 + k * 18, 96, 3); } c.restore();
    dust(c, t, 16, 0, 0, W, 700, '#fff0d0'); vign(c, .55);
  }

  function philoC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#2a2018', 1, '#0e0a08'); c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(200,220,255,.08)'; c.beginPath(); c.arc(800, 0, 500, 0, Math.PI); c.fill(); for (let k = 0; k < 12; k++) { c.strokeStyle = 'rgba(200,180,140,.15)'; c.lineWidth = 3; c.beginPath(); c.moveTo(800, 0); c.lineTo(800 + Math.cos(k * Math.PI / 11) * 500, Math.sin(k * Math.PI / 11) * 500); c.stroke(); }
    for (let r = 0; r < 5; r++) for (let k = 0; k < 60; k++) { c.fillStyle = ['#6a2a1a', '#2a3a5a', '#3a4a2a', '#6a5a2a'][(k + r) % 4]; c.fillRect(k * 27, 560 - r * 110 + R(k + r) * 10, 22, 80 - R(k * r) * 12); }
    for (let r = 0; r < 5; r++) { c.fillStyle = '#3a2412'; c.fillRect(0, 640 - r * 110, W, 10); }
    c.fillStyle = lg(c, 0, 700, 0, H, 0, '#4a3020', 1, '#1a0e08'); c.fillRect(0, 700, W, 200);
    // Marx à sa table de lecture
    c.fillStyle = '#3a2412'; c.fillRect(140, 600, 460, 22); c.fillRect(160, 620, 16, 120); c.fillRect(560, 620, 16, 120);
    c.fillStyle = '#f2e8d0'; c.fillRect(420, 570, 140, 30); c.fillRect(200, 560, 120, 40); c.fillStyle = '#2a5a3a'; c.fillRect(440, 520, 30, 50); c.fillRect(474, 530, 30, 40);
    sage(c, 340, 740, 1.4, { robe: '#2a2a30', collar: '#f4f0e8', hair: '#e8e4dc', beard: '#e8e4dc', bl: 50 });
    // Globe
    c.fillStyle = '#5a3a1a'; c.fillRect(870, 640, 20, 110); c.fillRect(820, 740, 120, 14);
    c.strokeStyle = '#c9a050'; c.lineWidth = 6; c.beginPath(); c.arc(880, 500, 150, -1.2, 1.9); c.stroke();
    c.save(); c.beginPath(); c.arc(880, 500, 130, 0, TAU); c.clip(); c.fillStyle = '#2a6aa8'; c.fillRect(740, 360, 280, 280);
    const off = (t * 20) % 260; c.fillStyle = '#7ab86a'; [[0, -40, 60, 40], [90, 10, 50, 70], [170, -60, 70, 50], [40, 60, 40, 30]].forEach(([x, y, w, h]) => { [-260, 0, 260].forEach(d => { c.beginPath(); c.ellipse(760 + ((x + off + d) % 520), 500 + y, w / 2, h / 2, 0, 0, TAU); c.fill(); }); });
    c.restore(); glow(c, 860, 460, 160, '#bfe8ff', .2);
    // Porte du temps
    c.fillStyle = '#0a0806'; c.beginPath(); c.moveTo(1190, 720); c.lineTo(1190, 300); c.arc(1350, 300, 160, Math.PI, 0); c.lineTo(1510, 720); c.fill();
    c.save(); c.beginPath(); c.moveTo(1200, 710); c.lineTo(1200, 304); c.arc(1350, 304, 150, Math.PI, 0); c.lineTo(1500, 710); c.clip();
    c.fillStyle = rg(c, 1350, 420, 300, 0, '#fff4c8', .4, '#c89a40', 1, '#3a2a10'); c.fillRect(1180, 140, 340, 600);
    for (let k = 0; k < 6; k++) { c.strokeStyle = `rgba(255,240,200,${.3 - k * .04})`; c.lineWidth = 3; c.beginPath(); c.arc(1350, 420, (t * 40 + k * 40) % 240, 0, TAU); c.stroke(); } c.restore();
    c.fillStyle = '#1a1a1a'; rr(c, 1300, 560, 100, 70, 8); c.fill(); txt(c, '★●▲', 1350, 590, '15px Segoe UI Symbol', '#ffd27a'); txt(c, '■◆♥', 1350, 614, '15px Segoe UI Symbol', '#ffd27a');
    dust(c, t, 20, 0, 0, W, 800, '#ffe8c0'); vign(c, .8);
  }

  Object.assign(window.Scenes, { magicA, magicB, magicC, mafiaA, mafiaB, mafiaC, philoA, philoB, philoC });
})();

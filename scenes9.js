// Décors : le Phare de Cap-aux-Brumes et L'Autre Moi.
(function () {
  'use strict';
  const { W, H, TAU, R, lg, rg, glow, vign, rr, poly, flick, dust, lightning } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const lang = () => (window.GameKit && window.GameKit.lang) || 'fr';

  // Ciel d'orage, mer agitée et pluie, découpés dans un rectangle
  function storm(c, t, x, y, w, h, o = {}) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    const L = lightning(t + (o.ph || 0));
    c.fillStyle = lg(c, 0, y, 0, y + h, 0, '#070c18', .6, '#16243a', 1, '#0a1420'); c.fillRect(x, y, w, h);
    for (let k = 0; k < 6; k++) { c.fillStyle = 'rgba(40,50,70,.5)'; c.beginPath(); c.ellipse(x + ((R(k) * w + t * 14) % (w + 200)) - 100, y + 30 + R(k + 4) * h * .3, 160, 40, 0, 0, TAU); c.fill(); }
    if (L) { c.fillStyle = `rgba(200,220,255,${L * .55})`; c.fillRect(x, y, w, h); }
    const sy = y + h * (o.sea || .68);
    c.fillStyle = '#0b1622'; c.fillRect(x, sy, w, y + h - sy);
    if (o.land) o.land(sy);
    c.lineWidth = 3;
    for (let k = 0; k < 6; k++) {
      const yy = sy + 8 + k * 16; c.strokeStyle = `rgba(170,200,235,${.12 + k * .05})`; c.beginPath();
      for (let xx = x; xx <= x + w; xx += 12) { const v = Math.sin(xx * .025 + t * (1.6 + k * .2) + k) * (3 + k); if (xx === x) c.moveTo(xx, yy + v); else c.lineTo(xx, yy + v); }
      c.stroke();
    }
    c.strokeStyle = 'rgba(200,220,255,.32)'; c.lineWidth = 1.5;
    for (let k = 0; k < (o.n || 70); k++) {
      const rx = x + (R(k) * w + t * 90) % w, ry = y + (R(k + 3) * h + t * 760 * (.7 + R(k + 5) * .5)) % h;
      c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 6, ry + 20); c.stroke();
    }
    c.restore();
  }
  function frameWin(c, x, y, w, h, col, bars) {
    c.strokeStyle = col; c.lineWidth = 16; c.strokeRect(x, y, w, h);
    c.lineWidth = 8; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); if (bars) { c.moveTo(x, y + h / 2); c.lineTo(x + w, y + h / 2); } c.stroke();
  }
  function planks(c, y0, h, a, b, step = 64) {
    for (let x = 0; x < W; x += step) { c.fillStyle = (x / step) % 2 ? a : b; c.fillRect(x, y0, step - 2, h); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(x + step - 2, y0, 2, h); }
  }
  function floor(c, y0, a, b) {
    c.fillStyle = lg(c, 0, y0, 0, H, 0, a, 1, b); c.fillRect(0, y0, W, H - y0);
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let y = y0 + 24; y < H; y += 38) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  }

  // ======================= LE PHARE DE CAP-AUX-BRUMES =======================
  function phareA(c, t, st) {
    planks(c, 0, 640, '#523a2c', '#4a3428');
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, 'rgba(0,0,0,.4)', .5, 'rgba(0,0,0,0)', 1, 'rgba(0,0,0,.3)'); c.fillRect(0, 0, W, 640);
    c.fillStyle = '#33241a'; c.fillRect(0, 600, W, 40);
    floor(c, 640, '#5a4434', '#21170f');
    // Fenêtre sur la tempête
    storm(c, t, 80, 120, 340, 340); frameWin(c, 80, 120, 340, 340, '#e8e0cc', true);
    c.fillStyle = '#d8d0bc'; c.fillRect(64, 460, 372, 18);
    // Horloge
    c.fillStyle = '#3a2414'; rr(c, 500, 90, 120, 300, 14); c.fill(); c.fillStyle = '#2a180c'; rr(c, 528, 230, 64, 140, 6); c.fill();
    c.fillStyle = '#c9a050'; circ(c, 560, 160, 56); c.fillStyle = '#f2ead4'; circ(c, 560, 160, 48);
    c.fillStyle = '#3a2a1a'; for (let k = 0; k < 12; k++) { const a = k * TAU / 12; c.fillRect(560 + Math.sin(a) * 40 - 2, 160 - Math.cos(a) * 40 - 2, 4, 4); }
    const run = st.f.pz_clock, hA = run ? (2.5 + t / 3600) * TAU / 12 : 0, mA = run ? (30 + t / 60) * TAU / 60 : 0;
    c.strokeStyle = '#1a1208'; c.lineCap = 'round';
    c.lineWidth = 5; c.beginPath(); c.moveTo(560, 160); c.lineTo(560 + Math.sin(hA) * 24, 160 - Math.cos(hA) * 24); c.stroke();
    c.lineWidth = 3; c.beginPath(); c.moveTo(560, 160); c.lineTo(560 + Math.sin(mA) * 36, 160 - Math.cos(mA) * 36); c.stroke(); c.lineCap = 'butt';
    const sw = run ? Math.sin(t * 3) * .25 : 0;
    c.save(); c.translate(560, 236); c.rotate(sw); c.strokeStyle = '#c9a050'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 100); c.stroke(); c.fillStyle = '#c9a050'; circ(c, 0, 108, 14); c.restore();
    if (!run) { c.strokeStyle = '#0a0a0a'; c.lineWidth = 6; c.beginPath(); c.moveTo(532, 300); c.lineTo(588, 320); c.stroke(); c.fillStyle = '#0a0a0a'; poly(c, [[588, 320], [600, 350], [590, 352]]); c.fill(); }
    // Calendrier
    c.fillStyle = '#efe8d6'; c.fillRect(700, 150, 120, 150); c.fillStyle = '#8a2a1a'; c.fillRect(700, 150, 120, 30);
    txt(c, '10 · 1962', 760, 172, 'bold 16px Georgia', '#fff');
    c.fillStyle = '#6a5a4a'; for (let k = 0; k < 31; k++) c.fillRect(708 + (k % 7) * 16, 190 + Math.floor(k / 7) * 20, 10, 10);
    c.strokeStyle = '#111'; c.lineWidth = 3; c.beginPath(); c.arc(708 + 4 * 16 + 5, 190 + 2 * 20 + 5, 11, 0, TAU); c.stroke();
    // Buffet, assiettes et boîte à musique
    c.fillStyle = '#4a2e1a'; c.fillRect(1080, 200, 380, 14); for (let k = 0; k < 6; k++) { c.fillStyle = '#e8e4da'; circ(c, 1120 + k * 62, 176, 24); c.fillStyle = '#5a7ab8'; circ(c, 1120 + k * 62, 176, 14); c.fillStyle = '#e8e4da'; circ(c, 1120 + k * 62, 176, 9); }
    c.fillStyle = lg(c, 0, 430, 0, 700, 0, '#6a4228', 1, '#3a2414'); c.fillRect(1080, 430, 380, 270); c.fillStyle = '#7a5032'; c.fillRect(1066, 420, 408, 20);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(1100, 460, 160, 210); c.strokeRect(1280, 460, 160, 210); c.fillStyle = '#c9a050'; circ(c, 1250, 565, 6); circ(c, 1290, 565, 6);
    c.fillStyle = '#5a2a3a'; rr(c, 1180, 368, 140, 54, 6); c.fill(); c.fillStyle = '#7a3a4a'; c.fillRect(1180, 368, 140, 14); c.fillStyle = '#c9a050'; c.fillRect(1180, 380, 140, 3);
    const spin = st.f.pz_music ? Math.cos(t * 3) : 1; c.save(); c.translate(1250, 366); c.scale(spin, 1);
    c.fillStyle = '#f0d8e0'; poly(c, [[-16, 0], [16, 0], [0, -22]]); c.fill(); c.fillStyle = '#f2e0c8'; circ(c, 0, -30, 7); c.fillRect(-1.5, -24, 3, 4); c.restore();
    if (st.f.pz_music) glow(c, 1250, 350, 70, '#ffd8e8', .25);
    // Table, tasses, mot de Gilles et lampe à huile
    c.fillStyle = '#6a4630'; c.fillRect(620, 560, 420, 24); c.fillStyle = '#4a3020'; c.fillRect(640, 584, 20, 216); c.fillRect(1000, 584, 20, 216); c.fillRect(660, 584, 340, 14);
    c.fillStyle = '#f4ecd8'; c.save(); c.translate(760, 552); c.rotate(-.08); c.fillRect(-52, -14, 104, 28); c.fillStyle = '#5a4a3a'; for (let k = 0; k < 3; k++) c.fillRect(-42, -8 + k * 7, 80 - k * 14, 2); c.restore();
    [[900, '#e8e4da', '#6a8ac8'], [960, '#f4ecd8', '#c86a6a']].forEach(([x, a, b]) => { c.fillStyle = a; rr(c, x - 22, 520, 44, 40, 6); c.fill(); c.strokeStyle = a; c.lineWidth = 5; c.beginPath(); c.arc(x + 24, 538, 10, -1.3, 1.3); c.stroke(); c.fillStyle = b; c.fillRect(x - 18, 530, 36, 6); });
    c.fillStyle = '#c9a050'; rr(c, 1040 - 60, 528, 30, 32, 6); c.fill(); c.fillStyle = 'rgba(255,240,200,.6)'; c.beginPath(); c.ellipse(995, 510, 14, 22, 0, 0, TAU); c.fill();
    const f = flick(t, 2); c.fillStyle = '#ffcf6a'; c.beginPath(); c.ellipse(995, 512, 4, 9 * f, 0, 0, TAU); c.fill(); glow(c, 995, 510, 340, '#ffb050', .38 * f);
    // Chaise berçante, tricot et écharpe bleue
    c.strokeStyle = '#3a2414'; c.lineWidth = 12; c.lineCap = 'round';
    c.beginPath(); c.moveTo(310, 480); c.lineTo(340, 660); c.moveTo(430, 480); c.lineTo(440, 660); c.stroke();
    c.lineWidth = 8; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(316 + k * 2, 510 + k * 36); c.lineTo(432 - k * 1, 510 + k * 36); c.stroke(); }
    c.lineWidth = 14; c.beginPath(); c.moveTo(320, 660); c.lineTo(500, 660); c.stroke();
    c.lineWidth = 10; c.beginPath(); c.moveTo(340, 660); c.lineTo(350, 770); c.moveTo(480, 660); c.lineTo(470, 770); c.stroke();
    c.lineWidth = 10; c.beginPath(); c.moveTo(290, 760); c.quadraticCurveTo(410, 800, 530, 750); c.stroke(); c.lineCap = 'butt';
    c.fillStyle = '#3a6aa8'; poly(c, [[430, 640], [470, 640], [462, 740], [440, 744]]); c.fill(); c.fillStyle = 'rgba(255,255,255,.2)'; for (let k = 0; k < 6; k++) c.fillRect(434, 650 + k * 15, 32, 3);
    c.fillStyle = '#8a6a3a'; rr(c, 230, 720, 90, 60, 10); c.fill(); c.fillStyle = '#3a6aa8'; circ(c, 260, 716, 16); c.fillStyle = '#c84a4a'; circ(c, 290, 718, 14); c.strokeStyle = '#ddd'; c.lineWidth = 3; c.beginPath(); c.moveTo(250, 700); c.lineTo(300, 680); c.moveTo(262, 704); c.lineTo(318, 690); c.stroke();
    dust(c, t, 16, 0, 0, W, 640, '#ffe0b0'); vign(c, .85);
  }

  function phareB(c, t, st) {
    planks(c, 0, 640, '#3e4854', '#38414c', 72);
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, 'rgba(0,0,0,.45)', 1, 'rgba(0,0,0,.2)'); c.fillRect(0, 0, W, 640);
    floor(c, 640, '#4a3a2e', '#1a120c');
    // Grande fenêtre, continent et lampe du passeur
    storm(c, t, 520, 100, 560, 370, { sea: .7, ph: 3, land: sy => {
      c.fillStyle = '#05080e'; poly(c, [[880, sy], [920, sy - 26], [1000, sy - 34], [1080, sy - 22], [1080, sy]]); c.fill();
      const on = st.morse; if (on) { c.fillStyle = '#fff6c8'; circ(c, 960, sy - 30, 6); glow(c, 960, sy - 30, 70, '#fff0a0', .8); }
      else { c.fillStyle = '#3a3420'; circ(c, 960, sy - 30, 4); }
    } });
    frameWin(c, 520, 100, 560, 370, '#d8d2c4', true); c.fillStyle = '#cfc8b8'; c.fillRect(500, 470, 600, 20);
    // Baromètre
    c.fillStyle = '#6a4228'; circ(c, 180, 200, 62); c.fillStyle = '#efe6cc'; circ(c, 180, 200, 50);
    c.strokeStyle = '#8a2a1a'; c.lineWidth = 3; c.beginPath(); c.arc(180, 200, 40, Math.PI * .8, Math.PI * 1.1); c.stroke();
    c.strokeStyle = '#1a1208'; c.lineWidth = 3; c.beginPath(); c.moveTo(180, 200); c.lineTo(180 - 36, 200 + 4); c.stroke(); c.fillStyle = '#c9a050'; circ(c, 180, 200, 5);
    // Classeur
    c.fillStyle = lg(c, 120, 0, 360, 0, 0, '#5a6470', .5, '#7a8490', 1, '#4a525c'); c.fillRect(120, 380, 240, 440);
    for (let k = 0; k < 3; k++) { c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 3; c.strokeRect(136, 396 + k * 140, 208, 124); c.fillStyle = '#c8ccd4'; c.fillRect(210, 440 + k * 140, 60, 12); c.fillStyle = '#efe8d6'; c.fillRect(220, 420 + k * 140, 40, 14); }
    if (!st.f.pz_report) { c.fillStyle = '#f4f0e2'; c.save(); c.translate(240, 386); c.rotate(-.1); c.fillRect(-40, -12, 80, 20); c.restore(); }
    // Bureau, journal de bord et lampe
    c.fillStyle = '#5a3a24'; c.fillRect(440, 590, 720, 30); c.fillStyle = '#42291a'; c.fillRect(460, 620, 680, 180); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 3; c.strokeRect(500, 650, 260, 120); c.strokeRect(840, 650, 260, 120);
    c.fillStyle = '#3a1a10'; rr(c, 650, 520, 320, 76, 6); c.fill();
    c.fillStyle = '#f2e6c8'; c.beginPath(); c.moveTo(662, 528); c.quadraticCurveTo(735, 516, 806, 530); c.lineTo(806, 590); c.quadraticCurveTo(735, 578, 662, 590); c.fill();
    c.beginPath(); c.moveTo(958, 528); c.quadraticCurveTo(885, 516, 814, 530); c.lineTo(814, 590); c.quadraticCurveTo(885, 578, 958, 590); c.fill();
    c.fillStyle = '#6a5a4a'; for (let k = 0; k < 5; k++) { c.fillRect(676, 540 + k * 9, 110 - (k % 2) * 30, 2); if (st.f.pz_log) c.fillRect(828, 540 + k * 9, 110 - (k % 3) * 20, 2); }
    c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(980, 560); c.lineTo(1040, 520); c.stroke();
    c.fillStyle = '#2a4a3a'; c.beginPath(); c.moveTo(1080, 500); c.lineTo(1140, 500); c.lineTo(1124, 530); c.lineTo(1096, 530); c.fill(); c.fillStyle = '#c9a050'; c.fillRect(1106, 530, 8, 60);
    glow(c, 1110, 540, 300, '#ffcf80', .35 * flick(t, 4));
    // Radio
    c.fillStyle = '#4a3020'; c.fillRect(1180, 550, 280, 16); c.fillStyle = '#6a4a30'; rr(c, 1200, 430, 240, 120, 12); c.fill();
    c.fillStyle = '#d8c8a0'; rr(c, 1220, 450, 120, 60, 6); c.fill(); c.fillStyle = '#2a1a10'; circ(c, 1390, 480, 20); circ(c, 1390, 530, 10);
    c.strokeStyle = '#5a4a3a'; c.lineWidth = 1; for (let k = 0; k < 8; k++) { c.beginPath(); c.moveTo(1228 + k * 14, 454); c.lineTo(1228 + k * 14, 506); c.stroke(); }
    // Photo de mariage
    c.fillStyle = '#c9a050'; c.fillRect(1220, 140, 160, 180); c.fillStyle = lg(c, 0, 152, 0, 308, 0, '#d8c8a8', 1, '#a8987a'); c.fillRect(1232, 152, 136, 156);
    c.fillStyle = '#6a5a48'; c.fillRect(1340, 172, 14, 110); c.fillStyle = '#4a3a2a'; circ(c, 1276, 230, 12); c.fillRect(1264, 242, 24, 50); circ(c, 1306, 228, 11);
    c.fillStyle = '#efe6d8'; poly(c, [[1296, 240], [1316, 240], [1326, 292], [1286, 292]]); c.fill();
    // Fauteuil d'Émile, tourné vers la mer
    c.fillStyle = '#5a2a20'; rr(c, 1180, 600, 200, 200, 30); c.fill(); c.fillStyle = '#6a3428'; rr(c, 1196, 580, 168, 80, 24); c.fill();
    dust(c, t, 14, 0, 0, W, 640, '#d8e8ff'); vign(c, .85);
  }

  function phareC(c, t, st) {
    storm(c, t, 0, 0, W, 620, { sea: .62, ph: 6, n: 120 });
    c.strokeStyle = '#2a2a2a'; c.lineWidth = 18; for (let x = 0; x <= W; x += 266) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 620); c.stroke(); }
    c.lineWidth = 10; c.beginPath(); c.moveTo(0, 90); c.lineTo(W, 90); c.stroke();
    c.fillStyle = lg(c, 0, 560, 0, 640, 0, '#3a3a3e', 1, '#1e1e22'); c.fillRect(0, 560, W, 80);
    c.fillStyle = '#16161a'; c.fillRect(0, 640, W, 260); c.strokeStyle = 'rgba(120,120,130,.2)'; c.lineWidth = 2;
    for (let x = 0; x < W; x += 30) { c.beginPath(); c.moveTo(x, 640); c.lineTo(800 + (x - 800) * 1.6, H); c.stroke(); }
    // Rambarde et initiales gravées
    c.fillStyle = '#6a4a2a'; c.fillRect(1100, 640, 420, 22); c.fillStyle = '#5a3a20'; c.fillRect(1120, 662, 14, 160); c.fillRect(1480, 662, 14, 160);
    c.fillStyle = '#4a2e18'; c.fillRect(1160, 662, 220, 40);
    c.strokeStyle = '#d8b888'; c.lineWidth = 2; c.beginPath(); const hx = 1270, hy = 674; c.moveTo(hx, hy + 22); c.bezierCurveTo(hx - 40, hy, hx - 20, hy - 14, hx, hy); c.bezierCurveTo(hx + 20, hy - 14, hx + 40, hy, hx, hy + 22); c.stroke();
    txt(c, 'É+M', hx, hy + 12, 'bold 12px Georgia', '#e8c898');
    c.fillStyle = 'rgba(216,184,136,.5)'; for (let k = 0; k < 40; k++) c.fillRect(1166 + (k % 20) * 10, k < 20 ? 666 : 694, 2, 6);
    // Carnet sur le rebord
    c.fillStyle = '#2a1a10'; c.save(); c.translate(320, 612); c.rotate(-.06); c.fillRect(-80, -18, 160, 36); c.fillStyle = '#e8dcc0'; c.fillRect(-74, -22, 148, 6); c.restore();
    // La grande lentille de Fresnel
    c.fillStyle = '#2a2420'; c.fillRect(720, 640, 160, 140); c.fillStyle = '#c9a050'; c.fillRect(700, 620, 200, 24); c.fillRect(700, 772, 200, 16);
    for (let k = 0; k < 9; k++) {
      const y = 600 - k * 48, w = 120 + Math.sin(k / 8 * Math.PI) * 90;
      c.fillStyle = lg(c, 800 - w, 0, 800 + w, 0, 0, 'rgba(120,150,170,.55)', .5, 'rgba(220,240,255,.75)', 1, 'rgba(120,150,170,.55)');
      c.beginPath(); c.ellipse(800, y, w, 26, 0, 0, TAU); c.fill(); c.strokeStyle = '#c9a050'; c.lineWidth = 2; c.stroke();
    }
    c.fillStyle = '#c9a050'; c.beginPath(); c.ellipse(800, 186, 70, 20, 0, 0, TAU); c.fill(); c.fillRect(794, 150, 12, 36);
    glow(c, 800, 420, 200, '#fff0c0', .12 + .06 * Math.sin(t * 1.5));
    dust(c, t, 22, 0, 0, W, 900, '#e0e8ff'); vign(c, .9);
  }

  // ======================= L'AUTRE MOI =======================
  function otherA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#3a4252', 1, '#4a5262'); c.fillRect(0, 0, W, 640);
    c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = 0; x < W; x += 120) c.fillRect(x, 0, 60, 640);
    c.fillStyle = '#e8e4dc'; c.fillRect(0, 620, W, 20); floor(c, 640, '#7a5a40', '#3a2818');
    // Fenêtre sur la rue Saint-Jean enneigée
    c.save(); c.beginPath(); c.rect(100, 140, 300, 340); c.clip();
    c.fillStyle = lg(c, 0, 140, 0, 480, 0, '#8a98b0', 1, '#c8d0dc'); c.fillRect(100, 140, 300, 340);
    [[100, 260, 90, '#6a5a58'], [190, 230, 80, '#7a6a60'], [270, 280, 70, '#5a5050'], [340, 250, 70, '#6a6060']].forEach(([x, y, w, col]) => { c.fillStyle = col; c.fillRect(x, y, w, 300); c.fillStyle = '#efe8d8'; poly(c, [[x - 4, y], [x + w / 2, y - 30], [x + w + 4, y]]); c.fill(); c.fillStyle = 'rgba(255,220,140,.7)'; for (let k = 0; k < 4; k++) c.fillRect(x + 12 + (k % 2) * 36, y + 30 + Math.floor(k / 2) * 50, 18, 26); });
    c.fillStyle = '#f4f4f8'; c.fillRect(100, 440, 300, 40);
    c.fillStyle = '#fff'; for (let k = 0; k < 50; k++) circ(c, 100 + (R(k) * 300 + Math.sin(t + k) * 10 + 300) % 300, 140 + (R(k + 7) * 340 + t * 40 * (.6 + R(k + 2))) % 340, 2 + R(k + 1) * 2);
    c.restore(); frameWin(c, 100, 140, 300, 340, '#f0ece4', true); c.fillStyle = '#e8e4dc'; c.fillRect(84, 480, 332, 16);
    // Chevalet et toile violette
    c.strokeStyle = '#6a4a2a'; c.lineWidth = 10; c.beginPath(); c.moveTo(600, 200); c.lineTo(500, 760); c.moveTo(600, 200); c.lineTo(700, 760); c.moveTo(600, 200); c.lineTo(620, 740); c.stroke();
    c.fillStyle = '#6a4a2a'; c.fillRect(490, 480, 220, 12);
    c.fillStyle = lg(c, 500, 230, 700, 470, 0, '#6a3a9a', 1, '#3a1a5a'); c.fillRect(500, 230, 200, 250);
    c.fillStyle = '#e8c8a8'; circ(c, 586, 330, 46); c.fillStyle = '#4a2a1a'; c.beginPath(); c.arc(586, 316, 48, Math.PI * 1.05, Math.PI * 1.95); c.fill();
    c.fillStyle = '#2a1a2a'; circ(c, 570, 330, 5); circ(c, 602, 330, 5); c.strokeStyle = '#8a2a3a'; c.lineWidth = 3; c.beginPath(); c.arc(586, 344, 16, .2, Math.PI - .2); c.stroke();
    c.fillStyle = '#ffd040'; for (let k = 0; k < 3; k++) { const fx = 530 + k * 60, fy = 430; for (let a = 0; a < 8; a++) circ(c, fx + Math.cos(a) * 10, fy + Math.sin(a) * 10, 6); c.fillStyle = '#6a3a1a'; circ(c, fx, fy, 6); c.fillStyle = '#ffd040'; }
    if (!st.f.pz_paint) {
      c.fillStyle = 'rgba(232,226,236,.92)'; poly(c, [[630, 230], [700, 230], [700, 480], [600, 480], [612, 400]]); c.fill();
      c.strokeStyle = 'rgba(90,80,110,.45)'; c.lineWidth = 1.5; for (let k = 0; k < 9; k++) { c.beginPath(); c.moveTo(640 + k * 7, 250); c.lineTo(626 + k * 8, 390); c.stroke(); }
    }
    if (!st.f.pz_paint) { c.strokeStyle = 'rgba(120,110,150,.7)'; c.lineWidth = 1; for (let k = 0; k <= 5; k++) { c.beginPath(); c.moveTo(640 + k * 10, 410); c.lineTo(640 + k * 10, 460); c.moveTo(640, 410 + k * 10); c.lineTo(690, 410 + k * 10); c.stroke(); } }
    c.fillStyle = '#d8d0c4'; c.fillRect(640, 470, 50, 14); c.fillStyle = '#8a4ac8'; circ(c, 650, 476, 5); circ(c, 668, 476, 5);
    // Étagère, répondeur et boîte de thé
    c.fillStyle = '#e8e4dc'; c.fillRect(820, 300, 300, 12);
    c.fillStyle = '#2a2a30'; rr(c, 850, 258, 100, 42, 6); c.fill(); c.fillStyle = '#4a4a54'; c.fillRect(860, 266, 50, 24);
    c.fillStyle = Math.sin(t * 6) > 0 ? '#ff4a4a' : '#5a1a1a'; circ(c, 932, 278, 5);
    c.fillStyle = '#7a4aa8'; rr(c, 1004, 232, 56, 68, 8); c.fill(); c.fillStyle = '#ffd860'; c.fillRect(1004, 256, 56, 14); c.fillStyle = '#5a3a8a'; c.fillRect(1000, 228, 64, 10);
    c.fillStyle = '#3a6a3a'; for (let k = 0; k < 5; k++) { c.beginPath(); c.ellipse(1090 + k * 6 - 12, 270, 6, 24, (k - 2) * .4, 0, TAU); c.fill(); } c.fillStyle = '#b86a4a'; c.fillRect(1078, 282, 26, 18);
    // Canapé, table basse et téléphone
    c.fillStyle = '#5a5a6a'; rr(c, 760, 500, 420, 110, 24); c.fill(); c.fillStyle = '#6a6a7a'; rr(c, 760, 590, 420, 90, 14); c.fill();
    c.fillStyle = '#4a4a5a'; rr(c, 740, 540, 50, 160, 14); c.fill(); rr(c, 1150, 540, 50, 160, 14); c.fill();
    c.fillStyle = '#8a5ac0'; poly(c, [[1000, 520], [1120, 530], [1110, 640], [990, 620]]); c.fill();
    c.fillStyle = '#6a4a30'; c.fillRect(820, 700, 290, 18); c.fillStyle = '#4a3220'; c.fillRect(836, 718, 14, 80); c.fillRect(1080, 718, 14, 80);
    c.fillStyle = '#1a1a22'; rr(c, 920, 676, 90, 26, 6); c.fill(); c.fillStyle = `rgba(150,190,255,${.6 + .3 * Math.sin(t * 2)})`; c.fillRect(926, 680, 78, 18); glow(c, 965, 688, 70, '#9ac0ff', .3);
    // Manteau
    c.fillStyle = '#c9a050'; circ(c, 1120, 200, 6);
    c.fillStyle = '#b8a888'; poly(c, [[1100, 206], [1140, 206], [1176, 480], [1070, 480]]); c.fill(); c.fillStyle = '#a89878'; poly(c, [[1120, 206], [1140, 206], [1132, 480], [1116, 480]]); c.fill();
    c.fillStyle = '#efe8d8'; c.save(); c.translate(1150, 400); c.rotate(.2); c.fillRect(-10, -14, 24, 30); c.restore();
    // Porte et serrure à code
    c.fillStyle = '#d8d4cc'; c.fillRect(1290, 190, 200, 620); c.fillStyle = lg(c, 1300, 0, 1480, 0, 0, '#f0ece4', 1, '#d0ccc4'); c.fillRect(1306, 206, 168, 594);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 3; c.strokeRect(1330, 240, 120, 220); c.strokeRect(1330, 500, 120, 260);
    c.fillStyle = '#9a9aa0'; circ(c, 1324, 500, 10);
    c.fillStyle = '#1e1e26'; rr(c, 1238, 428, 52, 104, 8); c.fill(); c.fillStyle = '#3a3a48'; for (let k = 0; k < 9; k++) c.fillRect(1246 + (k % 3) * 14, 456 + Math.floor(k / 3) * 22, 10, 14);
    c.fillStyle = Math.sin(t * 3) > -.3 ? '#ff3a3a' : '#5a1010'; circ(c, 1264, 442, 4);
    dust(c, t, 10, 0, 0, W, 640, '#fff4e0'); vign(c, .7);
  }

  function otherB(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#3e3644', 1, '#4a4250'); c.fillRect(0, 0, W, 640);
    c.fillStyle = 'rgba(255,255,255,.03)'; for (let k = 0; k < 14; k++) for (let j = 0; j < 7; j++) { c.beginPath(); c.arc(60 + k * 116 + (j % 2) * 58, 50 + j * 90, 6, 0, TAU); c.fill(); }
    c.fillStyle = '#d8d0dc'; c.fillRect(0, 620, W, 20); floor(c, 640, '#6a5048', '#2a1c18');
    // Lit
    c.fillStyle = '#5a4a40'; c.fillRect(70, 470, 30, 330); c.fillStyle = '#e8e4ec'; rr(c, 90, 600, 380, 80, 10); c.fill();
    c.fillStyle = '#6a7aa8'; rr(c, 200, 590, 270, 120, 14); c.fill(); c.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 5; k++) c.fillRect(214, 604 + k * 20, 242, 4);
    c.fillStyle = '#f4f0f6'; rr(c, 104, 560, 120, 50, 18); c.fill(); c.fillStyle = 'rgba(138,74,200,.7)'; c.beginPath(); c.ellipse(160, 584, 22, 10, .3, 0, TAU); c.fill();
    c.fillStyle = '#4a3a30'; c.fillRect(100, 680, 14, 120); c.fillRect(450, 680, 14, 120);
    // Table de chevet, lampe et journal intime
    c.fillStyle = '#6a5040'; c.fillRect(480, 600, 130, 160); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 3; c.strokeRect(492, 640, 106, 50); c.fillStyle = '#c9a050'; circ(c, 545, 665, 5);
    c.fillStyle = '#2a4a6a'; c.save(); c.translate(530, 590); c.rotate(-.05); c.fillRect(-36, -12, 72, 18); c.fillStyle = '#efe8d8'; c.fillRect(-32, -15, 64, 4); c.restore();
    c.fillStyle = '#e8d8b8'; poly(c, [[570, 500], [604, 500], [614, 540], [560, 540]]); c.fill(); c.fillStyle = '#5a4a3a'; c.fillRect(584, 540, 6, 52);
    glow(c, 587, 520, 220, '#ffe0a0', .4);
    // Le miroir
    c.fillStyle = '#c9a050'; rr(c, 640, 110, 320, 690, 160); c.fill();
    c.save(); rr(c, 660, 130, 280, 650, 140); c.clip();
    c.fillStyle = lg(c, 0, 130, 0, 780, 0, '#2a2a3a', 1, '#1a1622'); c.fillRect(660, 130, 280, 650);
    c.fillStyle = 'rgba(80,70,100,.5)'; c.fillRect(660, 600, 280, 180);
    const done = st.f.pz_reflet, lag = done ? 0 : .6, sx = 800 + Math.sin(t * .8 - lag) * 6, sy = Math.sin(t * .5 - lag) * 3;
    c.fillStyle = done ? 'rgba(120,110,150,.9)' : 'rgba(90,80,120,.85)'; circ(c, sx, 430 + sy, 46);
    c.beginPath(); c.moveTo(sx - 90, 780); c.quadraticCurveTo(sx - 84, 520 + sy, sx, 500 + sy); c.quadraticCurveTo(sx + 84, 520 + sy, sx + 90, 780); c.fill();
    c.fillStyle = 'rgba(255,255,255,.08)'; poly(c, [[700, 130], [760, 130], [660, 420], [660, 300]]); c.fill();
    if (!done) {
      const M = { fr: ['Ne va pas', 'au rendez-vous', '— L.'], en: ['Don’t go to', 'the appointment', '— L.'], vi: ['Đừng đến', 'buổi hẹn', '— L.'] }[lang()] || ['Ne va pas', 'au rendez-vous', '— L.'];
      c.save(); c.translate(800, 250); c.rotate(-.06); M.forEach((s, k) => txt(c, s, k === 2 ? 50 : 0, k * 44, 'bold 34px "Segoe Print","Comic Sans MS",cursive', 'rgba(200,30,50,.85)')); c.restore();
    } else {
      c.fillStyle = 'rgba(230,230,255,.18)'; c.beginPath(); c.ellipse(800, 280, 110, 70, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 4; const hx = 800, hy = 262; c.beginPath(); c.moveTo(hx, hy + 36); c.bezierCurveTo(hx - 60, hy, hx - 30, hy - 26, hx, hy); c.bezierCurveTo(hx + 30, hy - 26, hx + 60, hy, hx, hy + 36); c.stroke();
    }
    c.restore();
    glow(c, 800, 440, 300, '#b8a8ff', .12 + .05 * Math.sin(t));
    // Placard et boîte d'enfance
    c.fillStyle = '#e4dce4'; c.fillRect(1060, 120, 420, 680); c.fillStyle = '#2a2230'; c.fillRect(1080, 140, 300, 640);
    c.fillStyle = '#d8d0d8'; poly(c, [[1380, 140], [1470, 120], [1470, 800], [1380, 780]]); c.fill(); c.fillStyle = '#9a9aa0'; circ(c, 1394, 470, 8);
    c.strokeStyle = '#8a8a90'; c.lineWidth = 5; c.beginPath(); c.moveTo(1084, 200); c.lineTo(1376, 200); c.stroke();
    [['#8a5a5a', 1110], ['#5a6a8a', 1170], ['#d8c8a0', 1230], ['#4a4a4a', 1290], ['#6a8a6a', 1340]].forEach(([col, x]) => { c.fillStyle = col; poly(c, [[x, 204], [x + 40, 204], [x + 50, 440], [x - 10, 440]]); c.fill(); });
    c.fillStyle = '#5a4a5a'; c.fillRect(1084, 690, 292, 10);
    c.fillStyle = '#c86a6a'; rr(c, 1160, 570, 220, 120, 8); c.fill(); c.fillStyle = '#e88a8a'; c.fillRect(1160, 570, 220, 24);
    c.fillStyle = st.f.pz_box ? '#8a8a90' : '#c9a050'; rr(c, 1258, 600, 24, 28, 4); c.fill();
    c.fillStyle = '#fff8e0'; c.save(); c.translate(1220, 650); c.rotate(-.06); c.fillRect(-40, -12, 80, 24); c.restore(); txt(c, '♥ ♥ ♥', 1220, 656, 'bold 14px Segoe UI Symbol', '#c83a3a');
    dust(c, t, 12, 0, 0, W, 640, '#f0e0ff'); vign(c, .8);
  }

  function otherC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 640, 0, '#3a2050', 1, '#5a3070'); c.fillRect(0, 0, W, 640);
    c.fillStyle = '#2a1a3a'; c.fillRect(0, 620, W, 20); floor(c, 640, '#4a3048', '#1a1020');
    c.fillStyle = 'rgba(138,90,200,.35)'; c.beginPath(); c.ellipse(760, 780, 420, 70, 0, 0, TAU); c.fill();
    // Guirlande lumineuse
    c.strokeStyle = '#2a2a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 60); for (let x = 0; x <= W; x += 100) c.quadraticCurveTo(x + 50, 100, x + 100, 60); c.stroke();
    for (let k = 0; k < 32; k++) { const x = k * 50 + 25, y = 60 + Math.sin((k % 2) * Math.PI / 2) * 30; const on = .6 + .4 * Math.sin(t * 2 + k); c.fillStyle = ['#ffd860', '#ff9ad8', '#9ad8ff'][k % 3]; circ(c, x, y + 8, 5); glow(c, x, y + 8, 26, c.fillStyle, .5 * on); }
    // Toiles : toujours le même petit garçon
    [[110, 130, 150, 190], [280, 150, 120, 150], [420, 120, 130, 170], [570, 160, 100, 130], [220, 300, 110, 50]].forEach(([x, y, w, h], i) => {
      c.fillStyle = '#e8dcc8'; c.fillRect(x - 6, y - 6, w + 12, h + 12);
      c.fillStyle = lg(c, x, y, x + w, y + h, 0, ['#6a3a9a', '#8a5ab8', '#4a2a7a', '#7a4aa8', '#5a3a8a'][i], 1, '#2a1a4a'); c.fillRect(x, y, w, h);
      if (h > 80) {
        const cx = x + w / 2, cy = y + h * .45, r = Math.min(w, h) * .22 * (1 + i * .05);
        c.fillStyle = '#e8c8a8'; circ(c, cx, cy, r); c.fillStyle = '#4a2a1a'; c.beginPath(); c.arc(cx, cy - r * .3, r * 1.02, Math.PI * 1.05, Math.PI * 1.95); c.fill();
        c.fillStyle = '#2a1a2a'; circ(c, cx - r * .35, cy, 2.5); circ(c, cx + r * .35, cy, 2.5); c.strokeStyle = '#8a2a3a'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy + r * .25, r * .35, .2, Math.PI - .2); c.stroke();
        c.fillStyle = '#ffd040'; circ(c, x + w * .8, y + h * .85, 8); c.fillStyle = '#6a3a1a'; circ(c, x + w * .8, y + h * .85, 3);
      } else { c.fillStyle = '#ffd040'; for (let k = 0; k < 3; k++) circ(c, x + 20 + k * 35, y + 25, 9); }
    });
    // Veilleuse lune
    c.fillStyle = '#2a1a3a'; c.fillRect(730, 352, 150, 12);
    c.fillStyle = '#fff2b0'; circ(c, 805, 300, 44); c.fillStyle = '#4a2a60'; circ(c, 826, 288, 40); glow(c, 790, 304, 200, '#fff0a0', .45 + .05 * Math.sin(t * 1.3));
    // Bureau, théière, miel et corbeille
    c.fillStyle = '#5a3a5a'; c.fillRect(1000, 530, 460, 24); c.fillStyle = '#4a2a4a'; c.fillRect(1016, 554, 16, 246); c.fillRect(1428, 554, 16, 246);
    c.fillStyle = '#e8e0f0'; c.beginPath(); c.ellipse(1100, 500, 46, 34, 0, 0, TAU); c.fill(); c.fillRect(1084, 458, 32, 12); c.strokeStyle = '#e8e0f0'; c.lineWidth = 7; c.beginPath(); c.moveTo(1144, 496); c.lineTo(1170, 476); c.stroke(); c.beginPath(); c.arc(1052, 500, 14, Math.PI * .5, Math.PI * 1.5); c.stroke();
    c.fillStyle = '#7a4aa8'; c.fillRect(1074, 492, 52, 8);
    c.fillStyle = 'rgba(255,255,255,.25)'; for (let k = 0; k < 3; k++) { const ph = (t * .4 + k / 3) % 1; c.globalAlpha = 1 - ph; c.beginPath(); c.arc(1100 + Math.sin(t + k) * 8, 450 - ph * 60, 8, 0, TAU); c.fill(); } c.globalAlpha = 1;
    c.fillStyle = '#e8a830'; rr(c, 1182, 486, 38, 44, 8); c.fill(); c.fillStyle = '#fff4d0'; c.fillRect(1182, 496, 38, 10);
    [1250, 1310].forEach(x => { c.fillStyle = '#f0e8f8'; rr(c, x, 500, 36, 30, 5); c.fill(); });
    c.fillStyle = '#6a5a7a'; poly(c, [[1300, 660], [1430, 660], [1416, 800], [1314, 800]]); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(1312 + k * 22, 662); c.lineTo(1318 + k * 19, 798); c.stroke(); }
    if (!st.f.pz_letter) { c.fillStyle = '#efe6f4'; [[1330, 650], [1366, 640], [1400, 652], [1350, 628]].forEach(([x, y], k) => { c.beginPath(); c.arc(x, y, 18 - k * 2, 0, TAU); c.fill(); }); c.strokeStyle = '#8a5ab8'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(1356, 636); c.lineTo(1376, 644); c.stroke(); }
    // Petit lit à étoiles
    c.fillStyle = '#3a2a4a'; c.fillRect(90, 500, 26, 300);
    c.fillStyle = '#1e2a5a'; rr(c, 110, 600, 410, 120, 14); c.fill(); c.fillStyle = '#f0e8ff'; rr(c, 124, 566, 130, 46, 18); c.fill();
    c.fillStyle = '#ffd860'; for (let k = 0; k < 14; k++) { const x = 270 + (k % 7) * 36, y = 624 + Math.floor(k / 7) * 40; c.beginPath(); for (let a = 0; a < 10; a++) { const rr2 = a % 2 ? 3 : 8, an = a * Math.PI / 5 - Math.PI / 2; c.lineTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2); } c.fill(); }
    c.fillStyle = '#2a1a3a'; c.fillRect(120, 720, 14, 80); c.fillRect(496, 720, 14, 80);
    dust(c, t, 18, 0, 0, W, 640, '#ffd8ff'); vign(c, .75);
  }

  Object.assign(window.Scenes, { phareA, phareB, phareC, otherA, otherB, otherC });
})();

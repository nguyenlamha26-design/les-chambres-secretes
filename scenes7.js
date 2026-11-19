// Décors des scénarios corsés : le Grand Jeu (dortoir, cour de jeu, rivière souterraine)
// et la Ville vide (rue déserte, station de métro, toit de la tour).
(function () {
  'use strict';
  const { W, H, TAU, R, lg, rg, glow, vign, rr, poly, flick, dust } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col, al) => { c.font = font; c.fillStyle = col; c.textAlign = al || 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const tube = (c, t, x, y, w, k) => { const f = .85 + .15 * Math.sin(t * 40 + k) * (Math.sin(t * .7 + k) > .96 ? 1 : 0); c.fillStyle = `rgba(230,250,255,${f})`; rr(c, x, y, w, 8, 4); c.fill(); glow(c, x + w / 2, y + 4, w * .8, '#cfefff', .22 * f); };
  const sunMask = (c, x, y, s) => {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#f2c230'; for (let k = 0; k < 12; k++) { c.save(); c.rotate(k * TAU / 12); poly(c, [[-7, -30], [7, -30], [0, -46]]); c.fill(); c.restore(); }
    c.fillStyle = rg(c, -6, -6, 34, 0, '#fff2b0', 1, '#e8a820'); circ(c, 0, 0, 30);
    c.fillStyle = '#2a1a06'; c.beginPath(); c.ellipse(-10, -6, 5, 3, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(10, -6, 5, 3, 0, 0, TAU); c.fill();
    c.strokeStyle = '#2a1a06'; c.lineWidth = 3; c.beginPath(); c.arc(0, 4, 13, .2, Math.PI - .2); c.stroke(); c.restore();
  };
  const person = (c, x, y, s, col, head) => { c.fillStyle = col; rr(c, x - 22 * s, y - 70 * s, 44 * s, 80 * s, 14 * s); c.fill(); c.fillStyle = head || '#e8c09a'; circ(c, x, y - 88 * s, 18 * s); };

  // ================= LE GRAND JEU =================
  function gamesA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#2e4248', .6, '#1c2a2e', 1, '#0e1416'); c.fillRect(0, 0, W, H);
    // Gradins de lits superposés au fond
    for (let row = 0; row < 4; row++) {
      const y = 140 + row * 92;
      c.fillStyle = 'rgba(10,16,18,.6)'; c.fillRect(0, y + 70, W, 8);
      for (let x = -40 + (row % 2) * 60; x < W; x += 150) {
        c.strokeStyle = '#6a7e86'; c.lineWidth = 4; c.strokeRect(x, y, 130, 70);
        c.fillStyle = '#d8dee0'; c.fillRect(x + 6, y + 40, 118, 22);
        if (R(row * 31 + x) > .45) { c.fillStyle = '#e86a1e'; rr(c, x + 20 + R(x + row) * 40, y + 28, 60, 22, 10); c.fill(); c.fillStyle = '#e8c09a'; circ(c, x + 18 + R(x + row) * 40, y + 36, 9); }
      }
    }
    c.fillStyle = lg(c, 0, 0, 0, 120, 0, '#0e1416', 1, 'rgba(14,20,22,0)'); c.fillRect(0, 0, W, 120);
    [160, 560, 960, 1360].forEach((x, k) => tube(c, t, x, 40, 200, k));
    // Sol de béton ciré
    c.fillStyle = lg(c, 0, 520, 0, H, 0, '#4a5a5e', 1, '#1a2224'); c.fillRect(0, 520, W, 380);
    c.fillStyle = 'rgba(255,255,255,.05)'; [300, 700, 1100, 1450].forEach(x => { c.beginPath(); c.ellipse(x, 600, 140, 14, 0, 0, TAU); c.fill(); });
    // Tableau d'affichage
    c.fillStyle = '#5a3a1e'; rr(c, 620, 130, 360, 220, 8); c.fill(); c.fillStyle = '#b8854a'; c.fillRect(632, 142, 336, 196);
    [[650, 160, 120, 150, '#f4f0e0', -.04], [790, 156, 160, 90, '#fff8d0', .03], [800, 256, 140, 70, '#e8f0ff', -.02]].forEach(([x, y, w, h, col, a]) => { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.fillStyle = col; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = '#c0392b'; circ(c, 0, -h / 2 + 6, 5); c.fillStyle = '#4a4a4a'; for (let l = 0; l < 5; l++) c.fillRect(-w / 2 + 10, -h / 2 + 20 + l * 14, w - 20 - R(l + x) * 30, 4); c.restore(); });
    txt(c, '★●▲■◆♥', 710, 300, '16px Segoe UI Symbol', '#c0392b');
    // Casiers
    for (let k = 0; k < 4; k++) { const x = 1070 + k * 80; c.fillStyle = lg(c, x, 0, x + 76, 0, 0, '#7a8a90', .5, '#9aaab0', 1, '#6a7a80'); c.fillRect(x, 160, 76, 480); c.strokeStyle = '#4a565a'; c.lineWidth = 2; c.strokeRect(x, 160, 76, 480);
      for (let v = 0; v < 6; v++) { c.fillStyle = '#4a565a'; c.fillRect(x + 18, 180 + v * 8, 40, 3); }
      txt(c, String(305 + k), x + 38, 270, 'bold 18px Consolas', k === 2 ? '#ffd27a' : '#2a3236'); c.fillStyle = '#2a3236'; c.fillRect(x + 60, 380, 6, 30); }
    if (!st.f.locker) { c.fillStyle = '#c9a050'; rr(c, 1222, 392, 22, 26, 4); c.fill(); }
    // Haut-parleur
    c.fillStyle = '#3a4448'; poly(c, [[1380, 170], [1440, 150], [1500, 120], [1500, 260], [1440, 230], [1380, 210]]); c.fill(); c.fillStyle = '#20282a'; c.fillRect(1360, 165, 24, 50);
    const sp = .5 + .5 * Math.sin(t * 3); c.strokeStyle = `rgba(255,220,140,${.3 * sp})`; c.lineWidth = 3; for (let k = 1; k < 4; k++) { c.beginPath(); c.arc(1500, 190, 20 * k + sp * 6, -.6, .6); c.stroke(); }
    // Lit du premier plan avec les billes
    c.fillStyle = '#5a6a70'; c.fillRect(80, 430, 14, 300); c.fillRect(486, 430, 14, 300);
    c.fillStyle = '#e8ecee'; rr(c, 90, 560, 400, 60, 10); c.fill(); c.fillStyle = '#b8c0c4'; c.fillRect(90, 610, 400, 14);
    c.fillStyle = '#e86a1e'; rr(c, 100, 448, 380, 40, 10); c.fill(); c.fillStyle = '#5a6a70'; c.fillRect(80, 490, 420, 10);
    c.fillStyle = '#8a6a3a'; c.beginPath(); c.ellipse(220, 548, 46, 30, 0, 0, TAU); c.fill(); c.fillStyle = '#6a4a20'; c.fillRect(206, 514, 28, 10);
    const mcol = ['#e84a4a', '#4a8ae8', '#4ae86a', '#e8d44a', '#c84ae8'];
    for (let k = 0; k < (st.f.pz_nim ? 2 : 12); k++) { const x = 290 + (k % 6) * 30, y = 548 - Math.floor(k / 6) * 22; c.fillStyle = rg(c, x - 3, y - 3, 12, 0, '#fff', .35, mcol[k % 5], 1, '#111'); circ(c, x, y, 10); }
    // Cercle de chaises
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(820, 700, 250, 70, 0, 0, TAU); c.fill();
    for (let k = 0; k < 9; k++) { const a = k * TAU / 9 + Math.PI / 2, x = 820 + Math.cos(a) * 230, y = 690 + Math.sin(a) * 70, s = .8 + .25 * (Math.sin(a) + 1) / 2;
      c.fillStyle = '#3a8ad8'; rr(c, x - 22 * s, y - 50 * s, 44 * s, 10 * s, 3); c.fill(); c.fillRect(x - 22 * s, y - 50 * s, 6 * s, 50 * s); c.fillStyle = '#2a6aa8'; c.fillRect(x - 22 * s, y - 6 * s, 44 * s, 8 * s); c.fillRect(x - 20 * s, y, 4 * s, 26 * s); c.fillRect(x + 16 * s, y, 4 * s, 26 * s); }
    txt(c, '🎵', 820, 700 + Math.sin(t * 3) * 6, '40px Segoe UI Emoji', '#000');
    // Survêtement plié
    c.fillStyle = '#e86a1e'; rr(c, 1380, 680, 130, 50, 8); c.fill(); c.fillStyle = '#c8540e'; c.fillRect(1380, 700, 130, 6); txt(c, '307', 1445, 724, 'bold 16px Consolas', '#fff4e0');
    dust(c, t, 18, 0, 0, W, 600, '#dff6ff'); vign(c, .75);
  }

  function gamesB(c, t, st) {
    // Plafond peint en ciel d'été
    c.fillStyle = lg(c, 0, 0, 0, 480, 0, '#5aa8e8', 1, '#b8e0f8'); c.fillRect(0, 0, W, 480);
    for (let k = 0; k < 6; k++) { const x = ((k * 300 + t * 6) % (W + 300)) - 150, y = 70 + (k % 3) * 60; c.fillStyle = 'rgba(255,255,255,.9)'; [[0, 0, 50], [40, -16, 40], [80, 0, 46], [40, 12, 40]].forEach(([dx, dy, r]) => circ(c, x + dx, y + dy, r)); }
    c.strokeStyle = 'rgba(40,60,80,.25)'; c.lineWidth = 3; for (let x = 0; x < W; x += 200) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 480); c.stroke(); }
    // Mur peint : maisons de banlieue
    c.fillStyle = '#9ad08a'; c.fillRect(0, 400, W, 80);
    [['#f2b8c8', 60], ['#f8e0a0', 300], ['#b8d8f8', 560], ['#f8c8a0', 860], ['#c8f0c0', 1120], ['#e8c8f8', 1380]].forEach(([col, x]) => { c.fillStyle = col; c.fillRect(x, 350, 180, 110); c.fillStyle = '#c86a5a'; poly(c, [[x - 14, 350], [x + 90, 290], [x + 194, 350]]); c.fill(); c.fillStyle = '#fff'; c.fillRect(x + 24, 380, 40, 36); c.fillRect(x + 116, 380, 40, 36); });
    // Sol en terre battue
    c.fillStyle = lg(c, 0, 480, 0, H, 0, '#e8c890', 1, '#a8804a'); c.fillRect(0, 480, W, 420);
    c.strokeStyle = '#fff'; c.lineWidth = 8; c.setLineDash([30, 20]); c.beginPath(); c.moveTo(0, 860); c.lineTo(W, 820); c.stroke(); c.setLineDash([]);
    // Feu géant
    const green = Math.sin(t * .8) > -.2 && !st.f.pz_soleil ? Math.sin(t * .8) > .3 : true;
    c.fillStyle = '#2a2a2e'; c.fillRect(1338, 300, 24, 280); rr(c, 1260, 90, 180, 300, 30); c.fill();
    [['#ff3a2a', 160, !green], ['#ffb020', 240, false], ['#3aff7a', 320, green]].forEach(([col, y, on]) => { c.fillStyle = on ? col : '#3a3a3e'; circ(c, 1350, y, 34); if (on) glow(c, 1350, y, 160, col, .55); });
    // Bascule
    const tilt = st.f.pz_seesaw ? 0 : Math.sin(t * .9) * .08;
    c.fillStyle = '#c84a3a'; poly(c, [[400, 720], [440, 720], [420, 650]]); c.fill();
    c.save(); c.translate(420, 650); c.rotate(tilt); c.fillStyle = lg(c, -300, 0, 300, 0, 0, '#3a7ad8', .5, '#5a9af8', 1, '#3a7ad8'); rr(c, -300, -12, 600, 20, 8); c.fill();
    [-250, -140, 160, 260].forEach((x, k) => { c.fillStyle = ['#f2c8a0', '#e8b890', '#f8d0b0', '#d8a880'][k]; circ(c, x, -50, 16); c.fillStyle = ['#e86a1e', '#4aa8e8', '#e84a8a', '#4ae88a'][k]; rr(c, x - 16, -36, 32, 26, 8); c.fill(); });
    c.restore();
    // Table de l'hôte
    c.fillStyle = '#6a4a2a'; c.fillRect(840, 640, 300, 18); c.fillRect(860, 658, 14, 110); c.fillRect(1106, 658, 14, 110);
    person(c, 990, 630, 1.25, '#e8e0f0', '#e8e0f0'); sunMask(c, 990, 520, 1.15);
    ['✊', '✋', '✌️'].forEach((h, k) => txt(c, h, 900 + k * 90, 636, '36px Segoe UI Emoji', '#000'));
    if (st.f.pz_rps) txt(c, '■', 990, 600, 'bold 30px Segoe UI Symbol', '#ffd27a');
    dust(c, t, 16, 0, 400, W, 500, '#fff4d0'); vign(c, .55);
  }

  function gamesC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#0a1418', .5, '#10242a', 1, '#06100e'); c.fillRect(0, 0, W, H);
    for (let k = 0; k < 14; k++) { c.fillStyle = `rgba(${40 + k * 3},${60 + k * 4},${64 + k * 3},.5)`; poly(c, [[R(k) * W - 100, 0], [R(k) * W + 140, 0], [R(k) * W + 20, 80 + R(k + 3) * 160]]); c.fill(); }
    // Rivière
    c.fillStyle = lg(c, 0, 420, 0, 860, 0, '#0e3a48', 1, '#062028'); c.fillRect(0, 430, W, 420);
    c.strokeStyle = 'rgba(140,220,240,.18)'; c.lineWidth = 2; for (let k = 0; k < 18; k++) { const y = 450 + k * 22, x = ((k * 173 + t * 60) % (W + 200)) - 100; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 40, y - 6, x + 90, y); c.stroke(); }
    c.fillStyle = '#1a2a24'; c.fillRect(0, 400, W, 40); c.fillRect(0, 840, W, 60);
    // Gué : deux rangées de pierres
    for (let i = 0; i < 8; i++) for (let s = 0; s < 2; s++) {
      const x = 330 + i * 125 + s * 20, y = 520 + s * 150 + Math.sin(i) * 12, bob = Math.sin(t * 1.5 + i * 1.3 + s) * 2;
      c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, y + 16, 50, 14, 0, 0, TAU); c.fill();
      c.fillStyle = lg(c, x, y - 18, x, y + 14, 0, '#9aa8a0', 1, '#4a5a52'); c.beginPath(); c.ellipse(x, y + bob, 48, 20, 0, 0, TAU); c.fill();
      if (st.f.pz_stones && (i + s) % 2 === 0) glow(c, x, y, 60, '#7aff9a', .25);
    }
    // Paroi gravée
    c.fillStyle = '#2a3a36'; rr(c, 60, 120, 240, 300, 20); c.fill(); ['001', '044', '118', '199', '256', '306'].forEach((n, k) => txt(c, n, 120 + (k % 2) * 110, 180 + Math.floor(k / 2) * 80, 'bold 26px Consolas', 'rgba(200,230,220,.55)'));
    // Porte du quai
    c.fillStyle = '#1a1e20'; rr(c, 1270, 130, 280, 440, 16); c.fill();
    c.fillStyle = lg(c, 1290, 0, 1530, 0, 0, '#5a646a', .5, '#7a868c', 1, '#4a5458'); rr(c, 1290, 150, 240, 410, 10); c.fill();
    for (let k = 0; k < 5; k++) { c.fillStyle = '#3a4448'; c.fillRect(1300, 180 + k * 80, 220, 6); }
    c.fillStyle = '#e86a1e'; rr(c, 1355, 330, 110, 70, 10); c.fill(); txt(c, '★●▲', 1410, 360, '18px Segoe UI Symbol', '#fff'); txt(c, '■◆♥', 1410, 388, '18px Segoe UI Symbol', '#fff');
    txt(c, '⚓', 1410, 290, '44px Segoe UI Emoji', '#000');
    [[200, 380], [700, 360], [1180, 380]].forEach(([x, y], k) => { c.fillStyle = '#3a2a1a'; c.fillRect(x - 3, y - 40, 6, 40); const f = flick(t, k); c.fillStyle = '#ffb040'; c.beginPath(); c.ellipse(x, y - 52, 8, 16 * f, 0, 0, TAU); c.fill(); glow(c, x, y - 50, 220, '#ff9a30', .4 * f); });
    dust(c, t, 20, 0, 0, W, 800, '#bfefff'); vign(c, .85);
  }

  // ================= LA VILLE VIDE =================
  const CARD = [['J', '♠'], ['Q', '♥'], ['K', '♣'], ['A', '♦'], ['', '']];
  function emptyA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 500, 0, '#05060e', 1, '#1a1830'); c.fillRect(0, 0, W, 500);
    for (let k = 0; k < 60; k++) { c.fillStyle = `rgba(255,255,255,${.3 + .5 * R(k + 9)})`; c.fillRect(R(k) * W, R(k + 1) * 200, 2, 2); }
    // Immeubles éteints
    [[0, 120, 260], [240, 60, 200], [420, 160, 260], [660, 40, 240], [880, 130, 220], [1080, 70, 260], [1320, 140, 280]].forEach(([x, y, w], k) => {
      c.fillStyle = `rgb(${18 + k * 2},${18 + k * 2},${30 + k * 2})`; c.fillRect(x, y, w, 520 - y);
      for (let wy = y + 20; wy < 480; wy += 34) for (let wx = x + 14; wx < x + w - 20; wx += 30) { c.fillStyle = R(wx * 3 + wy) > .97 ? '#ffd890' : '#0c0c16'; c.fillRect(wx, wy, 16, 20); }
    });
    // Rue
    c.fillStyle = lg(c, 0, 500, 0, H, 0, '#22222a', 1, '#0c0c10'); c.fillRect(0, 500, W, 400);
    c.fillStyle = '#3a3a44'; poly(c, [[0, 500], [W, 500], [W, 540], [0, 560]]); c.fill();
    c.fillStyle = 'rgba(255,220,120,.7)'; for (let k = 0; k < 7; k++) { const x = 160 + k * 220; poly(c, [[x, 700], [x + 110, 690], [x + 116, 702], [x + 6, 712]]); c.fill(); }
    c.fillStyle = 'rgba(120,160,255,.06)'; c.fillRect(0, 560, W, 340);
    // Écrans géants
    c.fillStyle = '#0a0a10'; rr(c, 60, 70, 640, 340, 10); c.fill(); c.fillStyle = lg(c, 0, 80, 0, 400, 0, '#1a0a2a', 1, '#2a0a1a'); c.fillRect(72, 82, 616, 316);
    const red = st.f.pz_knights; CARD.forEach(([l, s], k) => { const x = 130 + k * 118, y = 240 + Math.sin(t * 1.5 + k) * 8, col = s === '♥' || s === '♦' ? '#c0392b' : '#1a1a2a'; c.fillStyle = '#f4f0e8'; rr(c, x - 44, y - 64, 88, 128, 8); c.fill();
      if (l) { txt(c, l, x - 30, y - 38, 'bold 20px Georgia', col); txt(c, s, x - 30, y - 20, '16px Segoe UI Symbol', col); txt(c, s, x, y + 22, '58px Segoe UI Symbol', col); txt(c, l, x + 30, y + 56, 'bold 20px Georgia', col); } else txt(c, '🃏', x, y + 24, '64px Segoe UI Emoji', '#000'); });
    glow(c, 380, 240, 420, red ? '#ff3a4a' : '#8a5aff', .3 + .1 * Math.sin(t * 2));
    for (let y = 82; y < 398; y += 4) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(72, y, 616, 2); }
    // Enseigne au néon (dépanneur)
    c.fillStyle = '#0c0c14'; rr(c, 880, 120, 420, 200, 14); c.fill();
    const nf = .8 + .2 * Math.sin(t * 17) * (Math.sin(t * .9) > .9 ? 1 : 0);
    c.strokeStyle = `rgba(255,80,160,${nf})`; c.lineWidth = 4; rr(c, 892, 132, 396, 176, 10); c.stroke(); glow(c, 1090, 220, 300, '#ff4aa0', .3 * nf);
    txt(c, 'DÉPANNEUR', 1090, 182, 'bold 34px Consolas', `rgba(255,120,190,${nf})`);
    txt(c, st.f.pz_matches ? '♥' : '8 + 3 = 4 ?', 1090, 262, 'bold 46px Consolas', `rgba(120,255,240,${nf})`);
    // Kiosque à journaux
    c.fillStyle = '#2a4a3a'; c.fillRect(80, 600, 280, 160); c.fillStyle = '#1a3a2a'; poly(c, [[60, 600], [380, 600], [360, 560], [80, 560]]); c.fill();
    [0, 1, 2].forEach(k => { c.fillStyle = '#e8e4d8'; c.fillRect(100 + k * 86, 620, 70, 90); c.fillStyle = '#4a4a4a'; c.fillRect(108 + k * 86, 632, 54, 8); });
    // Taxi abandonné
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(1200, 750, 260, 24, 0, 0, TAU); c.fill();
    c.fillStyle = '#e8b81a'; rr(c, 960, 600, 480, 130, 30); c.fill(); poly(c, [[1060, 600], [1120, 530], [1300, 530], [1360, 600]]); c.fill();
    c.fillStyle = '#2a3a4a'; poly(c, [[1080, 598], [1128, 544], [1200, 544], [1200, 598]]); c.fill(); poly(c, [[1216, 598], [1216, 544], [1292, 544], [1340, 598]]); c.fill();
    c.fillStyle = '#111'; circ(c, 1060, 730, 40); circ(c, 1340, 730, 40); c.fillStyle = '#666'; circ(c, 1060, 730, 16); circ(c, 1340, 730, 16);
    c.fillStyle = '#f8f0c0'; rr(c, 1170, 510, 80, 24, 6); c.fill(); txt(c, 'TAXI', 1210, 529, 'bold 18px Consolas', '#1a1a1a');
    c.fillStyle = '#ff3a2a'; c.fillRect(1428, 640, 12, 30); glow(c, 1434, 655, 60, '#ff3a2a', .5 * (Math.sin(t * 4) > 0 ? 1 : .2));
    if (!st.f.gotLamp) { c.fillStyle = '#c89a10'; c.fillRect(1380, 610, 52, 8); }
    // Carte sur l'asphalte
    if (!st.f.doc_card) { c.save(); c.translate(505, 795); c.rotate(.25); c.fillStyle = '#f4f0e8'; rr(c, -34, -48, 68, 96, 6); c.fill(); txt(c, '🃏', 0, 16, '48px Segoe UI Emoji', '#000'); c.restore(); glow(c, 505, 795, 90, '#fff4c8', .25 + .1 * Math.sin(t * 3)); }
    dust(c, t, 14, 0, 0, W, 700, '#c8c8ff'); vign(c, .8);
  }

  function emptyB(c, t, st) {
    c.fillStyle = '#d8dcd4'; c.fillRect(0, 0, W, 560);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; for (let y = 0; y < 560; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 560); c.stroke(); }
    c.fillStyle = '#e8a020'; c.fillRect(0, 420, W, 26); txt(c, 'BERRI-UQAM', 1000, 440, 'bold 22px Segoe UI', '#1a1a1a');
    // Tunnel
    c.fillStyle = '#0a0a0c'; c.beginPath(); c.moveTo(80, 680); c.lineTo(80, 340); c.arc(380, 340, 300, Math.PI, 0); c.lineTo(680, 680); c.fill();
    c.strokeStyle = '#5a5a60'; c.lineWidth = 14; c.beginPath(); c.arc(380, 340, 300, Math.PI, 0); c.stroke();
    c.fillStyle = 'rgba(255,240,180,.15)'; circ(c, 380, 420, 16 + Math.sin(t * 2) * 3);
    // Quai et voies
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#5a5a5e', 1, '#2a2a2e'); c.fillRect(680, 560, W - 680, 340);
    c.fillStyle = '#ffe040'; c.fillRect(680, 560, W - 680, 12);
    c.fillStyle = '#1a1a1e'; c.fillRect(0, 680, 680, 220); c.strokeStyle = '#8a8a90'; c.lineWidth = 6; [740, 840].forEach(y => { c.beginPath(); c.moveTo(0, y); c.lineTo(680, y - 20); c.stroke(); });
    // Guichet
    c.fillStyle = '#3a4a6a'; c.fillRect(760, 300, 360, 380); c.fillStyle = 'rgba(160,200,230,.35)'; c.fillRect(790, 330, 300, 160);
    c.fillStyle = '#2a3048'; c.fillRect(760, 490, 360, 20); txt(c, 'GUICHET', 940, 324, 'bold 18px Segoe UI', '#e8e8f0');
    c.fillStyle = '#c9a050'; c.fillRect(925, 410, 10, 70); c.fillRect(870, 410, 120, 6); c.beginPath(); c.ellipse(870, 440, 30, 8, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(990, 440, 30, 8, 0, 0, TAU); c.fill();
    if (!st.f.pz_coins) for (let k = 0; k < 6; k++) { c.fillStyle = rg(c, 820 + k * 50, 600, 20, 0, '#fff4c0', 1, '#b8902a'); circ(c, 820 + k * 50, 600, 16); }
    // Plan du métro
    c.fillStyle = '#f4f4f0'; c.fillRect(1220, 120, 280, 200); c.lineWidth = 8; [['#e8a020', [[1240, 220], [1480, 220]]], ['#2a8a3a', [[1260, 140], [1360, 300]]], ['#2a5ad8', [[1460, 140], [1380, 300]]]].forEach(([col, pts]) => { c.strokeStyle = col; c.beginPath(); c.moveTo(...pts[0]); c.lineTo(...pts[1]); c.stroke(); });
    // Coffre de chantier
    c.fillStyle = '#c87a1a'; rr(c, 1220, 560, 280, 180, 12); c.fill(); c.fillStyle = '#1a1a1a'; for (let k = 0; k < 7; k++) poly(c, [[1220 + k * 40, 560], [1240 + k * 40, 560], [1220 + k * 40 + 40, 590], [1200 + k * 40 + 40, 590]]), c.fill();
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 4; c.beginPath(); c.moveTo(1260, 650); c.bezierCurveTo(1300, 610, 1360, 690, 1420, 640); c.stroke();
    if (!st.f.pz_ropes) { const sp = flick(t, 3); c.fillStyle = '#ffb040'; circ(c, 1420, 640, 6 * sp); glow(c, 1420, 640, 60, '#ff9a30', .5 * sp); }
    dust(c, t, 16, 0, 0, W, 800, '#e8e8f0'); vign(c, .7);
  }

  function emptyC(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, 560, 0, '#03040c', .7, '#141a34', 1, '#2a2040'); c.fillRect(0, 0, W, 560);
    for (let k = 0; k < 90; k++) { c.fillStyle = `rgba(255,255,255,${.25 + .6 * R(k + 4)})`; c.fillRect(R(k + 2) * W, R(k + 5) * 380, 2, 2); }
    // Ville éteinte au loin, écrans allumés
    for (let k = 0; k < 40; k++) { const x = k * 42, h = 60 + R(k + 7) * 160; c.fillStyle = '#0a0c18'; c.fillRect(x, 560 - h, 40, h); if (R(k + 11) > .85) { c.fillStyle = '#8a5aff'; c.fillRect(x + 6, 560 - h + 10, 28, 18); glow(c, x + 20, 560 - h + 19, 60, '#8a5aff', .4); } }
    // Toit
    c.fillStyle = lg(c, 0, 560, 0, H, 0, '#3a3a44', 1, '#16161c'); c.fillRect(0, 560, W, 340);
    c.strokeStyle = '#ffd040'; c.lineWidth = 8; c.beginPath(); c.ellipse(800, 760, 260, 70, 0, 0, TAU); c.stroke(); txt(c, 'H', 800, 790, 'bold 80px Segoe UI', 'rgba(255,208,64,.85)');
    // Tableau géant
    c.fillStyle = '#2a2a30'; c.fillRect(560, 480, 20, 100); c.fillRect(1020, 480, 20, 100);
    c.fillStyle = '#08080c'; rr(c, 360, 100, 880, 380, 14); c.fill(); c.strokeStyle = '#4a4a54'; c.lineWidth = 6; rr(c, 360, 100, 880, 380, 14); c.stroke();
    const tgt = st.f.pz_countdown ? '◆' : String(100 + Math.floor(t * 7) % 900);
    txt(c, tgt, 800, 270, 'bold 140px Consolas', '#ffb020'); glow(c, 800, 230, 380, '#ffb020', .25);
    [25, 50, 7, 3, 9, 100].forEach((n, k) => { c.fillStyle = '#1a1a24'; rr(c, 400 + k * 135, 330, 120, 100, 10); c.fill(); txt(c, String(n), 460 + k * 135, 400, 'bold 50px Consolas', '#7ae8ff'); });
    // Porte de l'hélistation
    c.fillStyle = '#2a2a34'; c.fillRect(1270, 410, 260, 400); c.fillStyle = lg(c, 1290, 0, 1510, 0, 0, '#5a5a66', .5, '#7a7a88', 1, '#4a4a56'); c.fillRect(1290, 430, 220, 380);
    c.fillStyle = '#1a1a20'; rr(c, 1350, 560, 100, 70, 8); c.fill(); txt(c, '★●▲', 1400, 590, '16px Segoe UI Symbol', '#ffd27a'); txt(c, '■◆♥', 1400, 614, '16px Segoe UI Symbol', '#ffd27a');
    const blink = Math.sin(t * 3) > 0; c.fillStyle = blink ? '#ff3a3a' : '#5a1a1a'; circ(c, 1400, 450, 10); if (blink) glow(c, 1400, 450, 80, '#ff3a3a', .5);
    // Parapet
    c.fillStyle = '#4a4a54'; c.fillRect(0, 560, 420, 30); c.fillStyle = '#2a2a32'; c.fillRect(0, 590, 420, 14);
    dust(c, t, 12, 0, 0, W, 600, '#ffffff'); vign(c, .75);
  }

  Object.assign(window.Scenes, { gamesA, gamesB, gamesC, emptyA, emptyB, emptyC });
})();

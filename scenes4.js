// Objets ajoutés aux décors pour les nouvelles énigmes (tablette, piliers, panneau de soudure, pièces, coffre, échiquier).
(function () {
  'use strict';
  const { TAU, lg, rg, glow, rr, poly } = window.SK, S = window.Scenes;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = 'center'; c.fillText(s, x, y); c.textAlign = 'left'; };
  const wrap = (name, extra) => { const f = S[name]; S[name] = (c, t, st) => { f(c, t, st); c.save(); extra(c, t, st); c.restore(); }; };

  // Temple, salle de la porte : tablette des nombres en haut à droite
  wrap('templeA', (c, t, st) => {
    rr(c, 1190, 50, 210, 210, 12); c.fillStyle = lg(c, 1190, 50, 1400, 260, 0, '#6a6552', 1, '#34322a'); c.fill();
    c.strokeStyle = '#1b1912'; c.lineWidth = 4; c.strokeRect(1210, 70, 170, 170);
    for (let k = 1; k < 3; k++) { c.beginPath(); c.moveTo(1210 + k * 56.7, 70); c.lineTo(1210 + k * 56.7, 240); c.moveTo(1210, 70 + k * 56.7); c.lineTo(1380, 70 + k * 56.7); c.stroke(); }
    const lit = st.f.pz_magic;
    [[0, 4], [4, 5], [8, 6]].forEach(([i, v]) => txt(c, lit ? '♥' : '·', 1238 + (i % 3) * 56.7, 112 + Math.floor(i / 3) * 56.7, 'bold 28px Georgia', lit ? '#ff8a8a' : 'rgba(230,210,170,.5)'));
    if (lit) glow(c, 1295, 155, 160, '#ffc94a', .3 + .1 * Math.sin(t * 2));
  });

  // Temple, crypte : trois piliers et disques de pierre
  wrap('templeC', (c, t, st) => {
    const done = st.f.pz_hanoi;
    [640, 800, 960].forEach((x, k) => {
      c.fillStyle = lg(c, x - 12, 0, x + 12, 0, 0, '#4a4637', .5, '#6a6552', 1, '#34322a'); c.fillRect(x - 10, 170, 20, 190); c.fillStyle = '#3a372c'; c.fillRect(x - 60, 356, 120, 16);
      const n = (k === 0 && !done) || (k === 2 && done) ? 4 : 0;
      for (let d = 0; d < n; d++) { const w = 100 - d * 20; rr(c, x - w / 2, 336 - d * 22, w, 20, 6); c.fillStyle = `hsl(${35 + d * 10},20%,${30 + d * 6}%)`; c.fill(); }
    });
    if (done) txt(c, '◆', 960, 160, 'bold 30px Georgia', '#ffd27a');
  });

  // Station, poste de contrôle : panneau de maintenance (soudure)
  wrap('stationA', (c, t, st) => {
    rr(c, 40, 570, 210, 180, 10); c.fillStyle = lg(c, 40, 0, 250, 0, 0, '#3a4252', 1, '#262c38'); c.fill(); c.strokeStyle = '#11141a'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#e2b521'; c.fillRect(52, 582, 186, 14); txt(c, '⚠ MAINT.', 145, 594, 'bold 12px Consolas, monospace', '#1a1a1a');
    for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { const on = st.f.weld || (r * 5 + k) % 3 === 0; c.fillStyle = on ? '#ffb347' : '#1a1f28'; c.fillRect(62 + k * 36, 612 + r * 32, 28, 24); }
    if (!st.f.weld && (t * 5) % 2 < .3) glow(c, 150, 670, 60, '#ffd27a', .8);
  });
  // Station, salle des machines : tiroir des pièces de rechange
  wrap('stationB', (c, t, st) => {
    rr(c, 60, 610, 360, 120, 8); c.fillStyle = lg(c, 0, 610, 0, 730, 0, '#6a7484', 1, '#3a404c'); c.fill(); c.strokeStyle = '#11141a'; c.lineWidth = 3; c.stroke();
    for (let k = 0; k < 3; k++) { c.strokeRect(74 + k * 112, 628, 100, 84); c.fillStyle = '#c8d0dc'; c.fillRect(104 + k * 112, 664, 40, 8); }
    txt(c, '⚙', 124, 650, '18px Segoe UI Symbol', '#c8d0dc');
  });

  // Enquête, bureau : coffre-fort sous le bureau et sous-main
  wrap('cityA', (c, t, st) => {
    c.fillStyle = 'rgba(30,20,10,.85)'; rr(c, 600, 566, 260, 32, 4); c.fill();
    rr(c, 182, 642, 186, 186, 10); c.fillStyle = lg(c, 182, 642, 368, 828, 0, '#5a606c', 1, '#2a2e36'); c.fill(); c.strokeStyle = '#15171c'; c.lineWidth = 4; c.stroke();
    c.fillStyle = rg(c, 268, 728, 50, 0, '#c8ccd4', 1, '#6a707c'); circ(c, 275, 735, 42); c.strokeStyle = '#2a2e36'; c.lineWidth = 2;
    for (let k = 0; k < 20; k++) { const a = k * TAU / 20; c.beginPath(); c.moveTo(275 + Math.cos(a) * 34, 735 + Math.sin(a) * 34); c.lineTo(275 + Math.cos(a) * 40, 735 + Math.sin(a) * 40); c.stroke(); }
    c.fillStyle = '#2a2e36'; circ(c, 275, 735, 12); c.fillStyle = '#c9a050'; c.fillRect(340, 700, 12, 70);
    if (st.f.scraps) { c.fillStyle = '#0c0d10'; rr(c, 192, 652, 166, 166, 8); c.fill(); }
  });
  // Enquête, boutique : petit échiquier
  wrap('cityD', (c, t, st) => {
    c.fillStyle = '#5a3418'; c.fillRect(90, 720, 12, 70); c.fillRect(240, 720, 12, 70);
    poly(c, [[60, 660], [290, 660], [300, 722], [50, 722]]); c.fillStyle = '#7a4a24'; c.fill();
    for (let r = 0; r < 4; r++) for (let k = 0; k < 8; k++) { c.fillStyle = (r + k) % 2 ? '#2a1a10' : '#e9dcc0'; const x = 80 + k * 24 - r * 3, y = 664 + r * 13; poly(c, [[x, y], [x + 24, y], [x + 21, y + 13], [x - 3, y + 13]]); c.fill(); }
    txt(c, '♞', 150, 668, 'bold 30px Segoe UI Symbol, Georgia', '#1a1a1a'); txt(c, '♟', 230, 676, 'bold 24px Segoe UI Symbol, Georgia', '#f2ede0');
  });
})();

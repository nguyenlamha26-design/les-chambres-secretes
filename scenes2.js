// Vues supplémentaires des quatre salles (on se déplace entre elles avec les flèches).
(function () {
  'use strict';
  const { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust, flame, glyph, OCT } = window.SK;
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const txt = (c, s, x, y, font, col, al = 'center') => { c.font = font; c.fillStyle = col; c.textAlign = al; c.fillText(s, x, y); c.textAlign = 'left'; };

  // ======================= CLASSE =======================
  function classWall(c) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#1b243c', .6, '#101628', 1, '#090c16'); c.fillRect(0, 0, W, H);
    c.fillStyle = lg(c, 0, 520, 0, 720, 0, '#1f1c26', 1, '#131019'); c.fillRect(0, 520, W, 200);
    c.fillStyle = '#2d2735'; c.fillRect(0, 514, W, 7);
    c.fillStyle = lg(c, 0, 720, 0, H, 0, '#33231c', 1, '#0f0a09'); c.fillRect(0, 720, W, 180);
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2;
    for (let i = -14; i < 15; i++) { c.beginPath(); c.moveTo(800 + i * 95, 720); c.lineTo(800 + i * 240, 900); c.stroke(); }
  }
  const BOOKC = ['#8a2b22', '#2b4a7a', '#3f6b35', '#7a5a23', '#5a2e5e', '#2e5f63', '#6b3a1f', '#9a7b3a'];
  const RAIN = { red: '#d33a2c', orange: '#ec8a22', yellow: '#efd23a', green: '#3fa34d', blue: '#2e6fd1', indigo: '#3b2f9a', violet: '#8e3fbf', brown: '#6b4423', black: '#1d1d22', white: '#e9e6dc', pink: '#ee86b5' };

  function classB(c, t, st) {
    classWall(c);
    const f = flick(t * .35, 5);
    // Bibliothèque
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(132, 182, 400, 520);
    c.fillStyle = lg(c, 120, 0, 520, 0, 0, '#4a2f1a', 1, '#2e1c0f'); c.fillRect(120, 170, 400, 520);
    c.fillStyle = '#1a0f07'; c.fillRect(138, 188, 364, 484);
    for (let s = 0; s < 4; s++) {
      const y = 188 + s * 121; let x = 146, k = 0;
      while (x < 488) {
        const w = 16 + R(s * 40 + k) * 14, h = 70 + R(s * 40 + k + 7) * 36;
        const special = s === 2 && k >= 4 && k < 4 + st.v.shelf.length;
        if (!(special && st.f.pz_books)) {
          c.fillStyle = special ? RAIN[st.v.shelf[k - 4]] : BOOKC[Math.floor(R(s * 40 + k + 3) * BOOKC.length)];
          c.fillRect(x, y + 115 - h, w, h); c.fillStyle = 'rgba(255,255,255,.15)'; c.fillRect(x + 2, y + 115 - h + 8, w - 4, 3); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(x + w - 3, y + 115 - h, 3, h);
        }
        x += w + 2; k++;
      }
      c.fillStyle = '#5a3a20'; c.fillRect(138, y + 115, 364, 8);
    }
    if (st.f.pz_books) { c.fillStyle = '#060402'; c.fillRect(220, 470, 150, 70); c.strokeStyle = '#3a2412'; c.lineWidth = 3; c.strokeRect(220, 470, 150, 70); }
    // Horloge
    const cx = 800, cy = 230;
    c.fillStyle = 'rgba(0,0,0,.4)'; circ(c, cx + 6, cy + 8, 94);
    c.fillStyle = lg(c, cx - 92, cy - 92, cx + 92, cy + 92, 0, '#e3c98e', .5, '#8a6a32', 1, '#c9a560'); circ(c, cx, cy, 92);
    c.fillStyle = rg(c, cx - 15, cy - 20, 110, 0, '#fffaf0', 1, '#d8cdb2'); circ(c, cx, cy, 78);
    c.strokeStyle = '#2b2418'; for (let i = 0; i < 60; i++) { const a = i * TAU / 60, r0 = i % 5 ? 70 : 62; c.lineWidth = i % 5 ? 1.5 : 3.5; c.beginPath(); c.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); c.lineTo(cx + Math.sin(a) * 75, cy - Math.cos(a) * 75); c.stroke(); }
    for (let i = 1; i <= 12; i++) { const a = i * TAU / 12; txt(c, String(i), cx + Math.sin(a) * 50, cy - Math.cos(a) * 50 + 7, 'bold 18px Georgia', '#2b2418'); }
    let hh = 6, mm = 0, ss = 0;
    if (st.f.pz_clock) { const tot = st.v.cm + t / 60; hh = st.v.ch + tot / 60; mm = tot % 60; ss = (t % 60); }
    const hand = (a, len, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len); c.stroke(); };
    hand((hh % 12 + mm / 60) * TAU / 12, 38, 6, '#1e1a12'); hand(mm * TAU / 60, 60, 4, '#1e1a12'); if (st.f.pz_clock) hand(ss * TAU / 60, 64, 1.5, '#b3261e');
    c.fillStyle = '#1e1a12'; circ(c, cx, cy, 6);
    c.save(); c.globalAlpha = .18; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cx - 30, cy - 35, 34, 16, -.6, 0, TAU); c.fill(); c.restore();
    // Tableau de liège
    c.fillStyle = '#5a3a1f'; c.fillRect(1000, 160, 440, 300);
    c.fillStyle = lg(c, 1010, 170, 1430, 450, 0, '#c49a62', 1, '#9a7240'); c.fillRect(1012, 172, 416, 276);
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(80,50,20,${.15 + R(i) * .25})`; c.fillRect(1012 + R(i + 1) * 414, 172 + R(i + 2) * 274, 2, 2); }
    c.save(); c.translate(1110, 245); c.rotate(-.05); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-86, -58, 180, 130); c.fillStyle = '#fbe57a'; c.fillRect(-90, -62, 180, 128);
    c.strokeStyle = 'rgba(60,50,120,.6)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-74, -36 + i * 17); c.lineTo(60 - R(i) * 40, -36 + i * 17); c.stroke(); }
    txt(c, '♥', 66, 52, '22px Georgia', '#d1483b'); c.fillStyle = '#c0392b'; circ(c, 0, -56, 6); c.restore();
    c.save(); c.translate(1328, 310); c.rotate(.03); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-86, -126, 180, 260); c.fillStyle = '#f6f3ea'; c.fillRect(-90, -130, 180, 258);
    c.strokeStyle = '#9fb3d9'; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-82, -96 + i * 26); c.lineTo(82, -96 + i * 26); c.stroke(); } c.beginPath(); c.moveTo(-30, -122); c.lineTo(-30, 120); c.stroke();
    c.fillStyle = '#2e6fd1'; c.fillRect(-82, -124, 164, 20); c.fillStyle = '#2b5fb0'; circ(c, 0, -126, 6); c.restore();
    c.save(); c.translate(1110, 390); c.rotate(.06); c.fillStyle = '#f4f1e8'; c.fillRect(-92, -48, 184, 104); c.fillStyle = '#6a7fa0'; c.fillRect(-82, -40, 164, 70);
    [[-40, '#f2c9a0'], [-10, '#e8b98a'], [25, '#f0c8a0'], [55, '#d9a77a']].forEach(([x, col], i) => { c.fillStyle = col; circ(c, x, -8, 10); c.fillStyle = ['#c0392b', '#2e6fd1', '#3fa34d', '#efd23a'][i]; c.fillRect(x - 11, 4, 22, 26); });
    c.fillStyle = '#c0392b'; circ(c, 0, -50, 6); c.restore();
    // Globe sur un meuble
    c.fillStyle = lg(c, 0, 480, 0, 700, 0, '#5c3d22', 1, '#2b1a0c'); c.fillRect(560, 480, 140, 210);
    c.fillStyle = '#6d4a2c'; c.fillRect(552, 470, 156, 14);
    c.strokeStyle = '#b8964e'; c.lineWidth = 5; c.beginPath(); c.arc(630, 400, 62, Math.PI * .6, Math.PI * 2.1); c.stroke(); c.fillStyle = '#7a5a2a'; c.fillRect(620, 455, 20, 16);
    c.save(); c.beginPath(); c.arc(630, 400, 54, 0, TAU); c.clip(); c.fillStyle = rg(c, 615, 385, 70, 0, '#5fa8e0', 1, '#1d4a7a'); c.fillRect(570, 340, 120, 120);
    for (let i = 0; i < 7; i++) { const x = 570 + mod(R(i) * 220 + t * 14, 220) - 50; c.fillStyle = '#5c9a4a'; c.beginPath(); c.ellipse(x, 360 + R(i + 3) * 80, 14 + R(i) * 18, 9 + R(i + 1) * 14, R(i), 0, TAU); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.arc(650, 410, 60, 0, TAU); c.arc(620, 395, 56, 0, TAU, true); c.fill(); c.restore();
    // Pupitres
    [[620, 900], [960, 1240]].forEach(([a, b]) => {
      c.fillStyle = '#20140c'; c.fillRect(a + 20, 740, 14, 160); c.fillRect(b - 34, 740, 14, 160);
      c.fillStyle = lg(c, 0, 690, 0, 745, 0, '#8a6238', 1, '#5a3b20'); poly(c, [[a + 10, 692], [b - 10, 692], [b, 745], [a, 745]]); c.fill();
      c.strokeStyle = 'rgba(40,20,10,.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(a + 60, 712); c.lineTo(a + 120, 718); c.stroke();
    });
    // Corbeille
    c.fillStyle = lg(c, 1300, 0, 1430, 0, 0, '#4a505c', .5, '#7a8290', 1, '#3a3f48'); poly(c, [[1300, 660], [1430, 660], [1415, 820], [1315, 820]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(1300 + i * 22, 662); c.lineTo(1315 + i * 20, 818); c.stroke(); }
    [[1335, 652, 20], [1372, 646, 24], [1405, 656, 18]].forEach(([x, y, r]) => { c.fillStyle = '#e9e4d6'; circ(c, x, y, r); c.strokeStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.moveTo(x - r * .6, y); c.lineTo(x + r * .3, y - r * .5); c.stroke(); });
    glow(c, 800, 0, 720, '#ffd9a0', .18 * f);
    dust(c, t, 26, 300, 100, 1000, 600, '#ffe6b8');
    vign(c, .8);
  }

  function classC(c, t, st) {
    classWall(c);
    // Casiers
    for (let i = 0; i < 4; i++) {
      const x = 80 + i * 100, open = i === 2 && st.f.pz_locker;
      c.fillStyle = lg(c, x, 0, x + 96, 0, 0, '#3d5a78', .5, '#4f6f90', 1, '#34506b'); c.fillRect(x, 180, 96, 560);
      if (open) { c.fillStyle = '#0d1219'; c.fillRect(x + 6, 186, 84, 548); c.fillStyle = lg(c, x - 40, 0, x + 6, 0, 0, '#2b4058', 1, '#4f6f90'); poly(c, [[x + 6, 186], [x - 44, 200], [x - 44, 724], [x + 6, 734]]); c.fill(); }
      else {
        c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2; c.strokeRect(x + 6, 186, 84, 548);
        for (let k = 0; k < 5; k++) { c.fillStyle = '#20303f'; c.fillRect(x + 22, 210 + k * 12, 52, 5); }
        c.fillStyle = '#9aa6b5'; c.fillRect(x + 76, 440, 8, 50);
        if (i === 2) { c.strokeStyle = '#ccc'; c.lineWidth = 4; c.beginPath(); c.arc(x + 80, 498, 9, Math.PI, TAU); c.stroke(); rr(c, x + 66, 498, 28, 30, 5); c.fillStyle = '#c0392b'; c.fill(); for (let k = 0; k < 4; k++) { c.fillStyle = '#1a1a1a'; c.fillRect(x + 69 + k * 6, 506, 4, 14); } }
      }
    }
    // Porte
    c.fillStyle = '#2a2230'; c.fillRect(588, 128, 304, 612);
    c.fillStyle = lg(c, 600, 0, 880, 0, 0, '#5c3f26', .5, '#6e4c2e', 1, '#4a321d'); c.fillRect(600, 140, 280, 600);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(625, 400, 230, 300);
    rr(c, 660, 175, 160, 180, 6); c.fillStyle = lg(c, 0, 175, 0, 355, 0, '#1b2a44', 1, '#0d1424'); c.fill();
    c.fillStyle = 'rgba(255,240,200,.08)'; c.fillRect(660, 175 + mod(t * 20, 180), 160, 10);
    c.fillStyle = lg(c, 0, 520, 0, 545, 0, '#e8d08a', 1, '#8a6a2a'); rr(c, 838, 520, 34, 18, 8); c.fill();
    rr(c, 690, 92, 100, 32, 4); c.fillStyle = '#0e3a1c'; c.fill(); txt(c, '🏃 ➜', 740, 116, 'bold 20px Segoe UI Emoji, sans-serif', '#7dffa6');
    glow(c, 740, 108, 120, '#3dff7a', .35);
    // Panneau électrique
    rr(c, 910, 370, 70, 100, 6); c.fillStyle = lg(c, 910, 0, 980, 0, 0, '#8a8f99', 1, '#5b606a'); c.fill();
    for (let k = 0; k < 4; k++) { const on = st.f.lights || (k === 1); c.fillStyle = on ? '#4dff88' : '#ff4d4d'; circ(c, 930 + (k % 2) * 30, 395 + Math.floor(k / 2) * 34, 7); if (on) glow(c, 930 + (k % 2) * 30, 395 + Math.floor(k / 2) * 34, 18, '#4dff88', .5); }
    // Porte-manteau et veste
    c.fillStyle = '#2a1a0e'; c.fillRect(1100, 160, 12, 590); c.fillRect(1060, 740, 92, 12);
    const sw = Math.sin(t * .8) * .02;
    c.save(); c.translate(1106, 190); c.rotate(sw);
    c.fillStyle = lg(c, -80, 0, 80, 0, 0, '#2c4a6e', .5, '#3d6390', 1, '#24405f'); poly(c, [[-30, 0], [30, 0], [80, 40], [74, 330], [-74, 330], [-80, 40]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 10); c.lineTo(0, 330); c.stroke();
    c.fillStyle = '#20344d'; rr(c, -60, 200, 52, 50, 6); c.fill();
    if (!st.f.pocket) { c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.ellipse(-34, 228, 20, 16, 0, 0, TAU); c.fill(); }
    c.restore();
    // Clavier électrique
    c.strokeStyle = '#1a1a1e'; c.lineWidth = 10; c.beginPath(); c.moveTo(1260, 760); c.lineTo(1520, 650); c.moveTo(1520, 760); c.lineTo(1260, 650); c.stroke();
    rr(c, 1220, 590, 340, 70, 10); c.fillStyle = lg(c, 0, 590, 0, 660, 0, '#2c2c34', 1, '#111116'); c.fill();
    for (let k = 0; k < 22; k++) { c.fillStyle = '#f2f0ea'; c.fillRect(1232 + k * 14.5, 622, 13, 32); }
    for (let k = 0; k < 21; k++) if ([0, 1, 3, 4, 5].includes(k % 7)) { c.fillStyle = '#111'; c.fillRect(1242 + k * 14.5, 622, 8, 20); }
    c.fillStyle = st.f.lights ? '#4dff88' : '#5a1010'; circ(c, 1250, 605, 5); if (st.f.lights) glow(c, 1250, 605, 20, '#4dff88', .6);
    rr(c, 1300, 598, 90, 16, 3); c.fillStyle = st.f.lights ? '#0c2a3a' : '#0a0a0c'; c.fill(); if (st.f.lights) txt(c, '♪ 120', 1345, 611, '11px Consolas, monospace', '#7ae0ff');
    // Éclairage
    if (!st.f.lights) { c.fillStyle = 'rgba(2,4,14,.58)'; c.fillRect(0, 0, W, H); glow(c, 740, 108, 260, '#3dff7a', .25); }
    else { for (const x of [300, 800, 1300]) { c.fillStyle = '#f4f8ff'; c.fillRect(x - 120, 20, 240, 10); glow(c, x, 30, 520, '#e8f0ff', .16); } }
    dust(c, t, 22, 0, 100, W, 600, '#d8e4ff');
    vign(c, .8);
  }

  // ======================= BATEAU =======================
  function planks(c) {
    for (let y = 0, k = 0; y < 720; y += 78, k++) {
      c.fillStyle = lg(c, 0, y, 0, y + 78, 0, '#553520', .5, '#422816', 1, '#2a180c'); c.fillRect(0, y, W, 78);
      c.fillStyle = `rgba(0,0,0,${R(k + 30) * .22})`; c.fillRect(0, y, W, 78);
      c.strokeStyle = 'rgba(20,10,4,.3)'; c.lineWidth = 1.5;
      for (let g = 0; g < 5; g++) { c.beginPath(); const yy = y + 10 + g * 14; c.moveTo(0, yy); for (let x = 0; x <= W; x += 80) c.lineTo(x, yy + Math.sin(x * .01 + k * 5 + g) * 5 + R(k * 7 + g) * 4); c.stroke(); }
      c.fillStyle = '#120a05'; c.fillRect(0, y, W, 4);
    }
    c.fillStyle = lg(c, 0, 0, 0, 66, 0, '#150c07', 1, '#34200f'); c.fillRect(0, 0, W, 66);
    c.fillStyle = lg(c, 0, 720, 0, H, 0, '#2a180c', 1, '#0d0704'); c.fillRect(0, 720, W, 180);
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2; for (let i = -10; i < 11; i++) { c.beginPath(); c.moveTo(800 + i * 120, 720); c.lineTo(800 + i * 280, 900); c.stroke(); }
  }
  function rocking(c, t) { const rock = Math.sin(t * .7) * .014; c.fillStyle = '#0b0705'; c.fillRect(0, 0, W, H); c.save(); c.translate(W / 2, H / 2); c.rotate(rock); c.scale(1.05, 1.05); c.translate(-W / 2, -H / 2); return rock; }
  function sconce(c, t, x, y, k) {
    const f = flick(t, k);
    c.fillStyle = '#2a2116'; c.fillRect(x - 6, y, 12, 40); rr(c, x - 22, y - 50, 44, 56, 6); c.fillStyle = rg(c, x, y - 22, 40, 0, `rgba(255,235,170,${.95 * f})`, 1, 'rgba(140,60,10,.7)'); c.fill();
    c.strokeStyle = '#2a2116'; c.lineWidth = 3; rr(c, x - 22, y - 50, 44, 56, 6); c.stroke();
    glow(c, x, y - 22, 520, '#ff9b3d', .3 * f); glow(c, x, y - 22, 90, '#ffe2a8', .8 * f);
  }

  function shipB(c, t, st) {
    rocking(c, t); planks(c);
    // Carte marine
    c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(160, 152, 520, 360);
    c.fillStyle = lg(c, 150, 140, 670, 500, 0, '#efe0b8', 1, '#cdb88a'); rr(c, 150, 140, 520, 360, 6); c.fill();
    const n = st.v.map.n, gx = 190, gy = 170, cs = Math.min(440 / n, 300 / n);
    c.save(); c.beginPath(); c.rect(gx, gy, cs * n, cs * n); c.clip();
    c.fillStyle = 'rgba(80,140,170,.25)'; c.fillRect(gx, gy, cs * n, cs * n);
    for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(140,120,70,.55)'; c.beginPath(); c.ellipse(gx + R(i + 70) * cs * n, gy + R(i + 71) * cs * n, 20 + R(i) * 40, 12 + R(i + 1) * 25, R(i), 0, TAU); c.fill(); }
    c.restore();
    c.strokeStyle = 'rgba(70,50,30,.45)'; c.lineWidth = 1; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(gx + i * cs, gy); c.lineTo(gx + i * cs, gy + cs * n); c.moveTo(gx, gy + i * cs); c.lineTo(gx + cs * n, gy + i * cs); c.stroke(); }
    const [sr, sc] = st.v.map.start; txt(c, '🗼', gx + sc * cs + cs / 2, gy + sr * cs + cs * .72, `${cs * .6}px Segoe UI Emoji, sans-serif`, '#000');
    c.strokeStyle = '#c0392b'; c.lineWidth = 3; c.beginPath(); c.arc(gx + sc * cs + cs / 2, gy + sr * cs + cs / 2, cs * .48, 0, TAU); c.stroke();
    if (st.f.pz_map) { const [er, ec] = st.v.map.end; c.lineWidth = 4; const x = gx + ec * cs, y = gy + er * cs; c.beginPath(); c.moveTo(x + 6, y + 6); c.lineTo(x + cs - 6, y + cs - 6); c.moveTo(x + cs - 6, y + 6); c.lineTo(x + 6, y + cs - 6); c.stroke(); }
    c.save(); c.translate(590, 420); c.strokeStyle = '#6b4a2a'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.rotate(TAU / 8); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, i % 2 ? -22 : -40); c.stroke(); } c.restore(); txt(c, 'N', 590, 372, 'bold 16px Georgia', '#6b4a2a');
    // Photo encadrée
    c.fillStyle = '#2a170b'; c.fillRect(760, 200, 120, 150); c.fillStyle = lg(c, 0, 212, 0, 338, 0, '#cdb48a', 1, '#8a7050'); c.fillRect(772, 212, 96, 126);
    c.fillStyle = 'rgba(60,40,20,.75)'; poly(c, [[800, 300], [850, 300], [822, 232]]); c.fill(); c.fillRect(782, 300, 76, 14);
    for (let k = 0; k < 4; k++) { circ(c, 786 + k * 22, 318, 5); }
    // Baromètre
    c.fillStyle = lg(c, 920, 180, 1040, 300, 0, '#f3d98f', .5, '#8a6524', 1, '#c7a04d'); circ(c, 980, 240, 60);
    c.fillStyle = '#f7f1e0'; circ(c, 980, 240, 48);
    c.strokeStyle = '#3a2c18'; c.lineWidth = 1.5; for (let i = 0; i < 21; i++) { const a = -2.3 + i * 4.6 / 20; c.beginPath(); c.moveTo(980 + Math.sin(a) * 38, 240 - Math.cos(a) * 38); c.lineTo(980 + Math.sin(a) * 45, 240 - Math.cos(a) * 45); c.stroke(); }
    const na = -1.6 + Math.sin(t * .5) * .08; c.strokeStyle = '#a3262e'; c.lineWidth = 3; c.beginPath(); c.moveTo(980, 240); c.lineTo(980 + Math.sin(na) * 40, 240 - Math.cos(na) * 40); c.stroke(); c.fillStyle = '#3a2c18'; circ(c, 980, 240, 4);
    // Étagère : bouteille et boîte
    c.fillStyle = '#4a2c14'; c.fillRect(1230, 400, 330, 14); c.fillStyle = '#2a170b'; poly(c, [[1260, 414], [1280, 414], [1260, 450]]); c.fill(); poly(c, [[1520, 414], [1540, 414], [1540, 450]]); c.fill();
    c.save(); c.globalAlpha = .35; c.fillStyle = '#9fd0c0'; c.beginPath(); c.ellipse(1340, 368, 88, 32, 0, 0, TAU); c.fill(); c.fillRect(1420, 356, 30, 24); c.restore();
    c.fillStyle = '#7a5a3a'; c.fillRect(1448, 358, 12, 20);
    c.fillStyle = '#5a3a20'; poly(c, [[1290, 382], [1390, 382], [1378, 394], [1300, 394]]); c.fill(); c.fillStyle = '#efe6d0'; poly(c, [[1320, 380], [1320, 344], [1350, 380]]); c.fill(); poly(c, [[1354, 380], [1354, 352], [1376, 380]]); c.fill();
    c.save(); c.globalAlpha = .4; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(1320, 352, 40, 6, -.1, 0, TAU); c.fill(); c.restore();
    c.fillStyle = lg(c, 0, 345, 0, 400, 0, '#8a5a30', 1, '#5a3618'); c.fillRect(1450, 350, 100, 50);
    if (st.f.box) { c.fillStyle = '#6a4220'; poly(c, [[1450, 350], [1550, 350], [1540, 312], [1460, 312]]); c.fill(); c.fillStyle = '#1a0f07'; c.fillRect(1456, 352, 88, 8); }
    else { c.fillStyle = '#6a4220'; c.fillRect(1446, 340, 108, 14); c.fillStyle = '#d9b24a'; rr(c, 1490, 352, 20, 18, 3); c.fill(); }
    // Couchette
    c.fillStyle = '#2a170b'; c.fillRect(700, 500, 560, 200); c.fillStyle = lg(c, 0, 520, 0, 600, 0, '#e6dcc2', 1, '#b8ab8a'); rr(c, 716, 520, 528, 70, 14); c.fill();
    c.fillStyle = '#efe7d4'; rr(c, 1120, 506, 120, 50, 18); c.fill();
    c.fillStyle = lg(c, 0, 540, 0, 610, 0, '#8a2a24', 1, '#5a1612'); poly(c, [[716, 548], [1110, 540], [1150, 610], [716, 610]]); c.fill();
    c.strokeStyle = 'rgba(240,200,120,.35)'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(740 + i * 55, 544); c.lineTo(760 + i * 58, 610); c.stroke(); }
    c.fillStyle = lg(c, 0, 610, 0, 780, 0, '#4a2c14', 1, '#24140a'); c.fillRect(700, 610, 560, 170);
    const dOpen = st.f.pz_drawer ? 22 : 0;
    c.fillStyle = '#100804'; if (dOpen) c.fillRect(760, 690, 240, 80);
    c.fillStyle = lg(c, 0, 690, 0, 770, 0, '#6a4220', 1, '#3e2410'); c.fillRect(760 - dOpen * .3, 690 + dOpen, 240, 80); c.strokeStyle = 'rgba(0,0,0,.4)'; c.strokeRect(760 - dOpen * .3, 690 + dOpen, 240, 80);
    c.fillStyle = '#c79a2e'; rr(c, 860, 724, 40, 10, 4); c.fill();
    sconce(c, t, 1120, 160, 4);
    c.restore();
    dust(c, t, 22, 700, 60, 700, 600, '#ffd9a0');
    vign(c, .85);
  }

  function shipC(c, t, st) {
    rocking(c, t); planks(c);
    // Porte
    c.fillStyle = '#1a0f07'; c.fillRect(636, 106, 328, 668);
    c.fillStyle = lg(c, 650, 0, 950, 0, 0, '#5a3418', .5, '#6e4222', 1, '#4a2a12'); c.fillRect(650, 120, 300, 640);
    [200, 420, 640].forEach(y => { c.fillStyle = lg(c, 0, y, 0, y + 24, 0, '#5d6068', 1, '#2d2f34'); c.fillRect(650, y, 300, 24); for (let k = 0; k < 6; k++) { c.fillStyle = '#9aa0aa'; circ(c, 670 + k * 52, y + 12, 4); } });
    c.fillStyle = '#1b2b3d'; circ(c, 800, 330, 52); c.strokeStyle = '#b08a3e'; c.lineWidth = 10; c.beginPath(); c.arc(800, 330, 56, 0, TAU); c.stroke();
    const fl = (t % 9) < .12 ? 1 : 0; if (fl) { c.fillStyle = 'rgba(220,230,255,.8)'; circ(c, 800, 330, 50); }
    c.strokeStyle = '#c9a050'; c.lineWidth = 6; c.beginPath(); c.arc(915, 500, 18, 0, TAU); c.stroke();
    // Radio sur son bureau
    c.fillStyle = lg(c, 0, 598, 0, 620, 0, '#6a4220', 1, '#3e2410'); c.fillRect(90, 598, 420, 22);
    c.fillStyle = '#2a170b'; c.fillRect(110, 620, 16, 200); c.fillRect(474, 620, 16, 200);
    rr(c, 120, 380, 360, 220, 18); c.fillStyle = lg(c, 0, 380, 0, 600, 0, '#7a4a24', 1, '#4a2a12'); c.fill();
    c.fillStyle = '#2a1a0e'; circ(c, 210, 490, 70); c.strokeStyle = '#7a5a3a'; c.lineWidth = 2; for (let i = -60; i <= 60; i += 10) { c.beginPath(); c.moveTo(210 + i, 490 - Math.sqrt(4900 - i * i)); c.lineTo(210 + i, 490 + Math.sqrt(4900 - i * i)); c.stroke(); }
    rr(c, 300, 410, 160, 70, 8); c.fillStyle = rg(c, 380, 445, 90, 0, '#ffd27a', 1, '#a0601a'); c.fill();
    c.strokeStyle = 'rgba(60,30,0,.6)'; c.lineWidth = 1.5; for (let i = 0; i < 16; i++) { c.beginPath(); c.moveTo(310 + i * 9.5, 460); c.lineTo(310 + i * 9.5, 470); c.stroke(); }
    const nx = 380 + Math.sin(t * .6) * (st.f.radio ? 4 : 60); c.strokeStyle = '#a3262e'; c.lineWidth = 3; c.beginPath(); c.moveTo(nx, 418); c.lineTo(nx, 474); c.stroke();
    glow(c, 380, 445, 120, '#ffb347', .3);
    [340, 420].forEach(x => { c.fillStyle = lg(c, x - 20, 0, x + 20, 0, 0, '#2a2a2a', .5, '#555', 1, '#1a1a1a'); circ(c, x, 545, 22); });
    c.fillStyle = st.f.radio ? '#4dff88' : '#5a1010'; circ(c, 450, 400, 6); if (st.f.radio) glow(c, 450, 400, 20, '#4dff88', .6);
    // Tonneaux
    [[200, 760], [380, 770]].forEach(([x, y]) => {
      c.fillStyle = lg(c, x - 80, 0, x + 80, 0, 0, '#4a2a12', .5, '#7a4a24', 1, '#3a200c'); c.beginPath(); c.ellipse(x, y, 82, 100, 0, 0, TAU); c.fill();
      c.fillStyle = '#5a3a20'; c.beginPath(); c.ellipse(x, y - 92, 64, 14, 0, 0, TAU); c.fill();
      [-60, 0, 60].forEach(d => { c.strokeStyle = '#2d2f34'; c.lineWidth = 7; c.beginPath(); c.ellipse(x, y + d, 80 - Math.abs(d) * .25, 12, 0, 0, Math.PI); c.stroke(); });
    });
    // Filets et flotteurs
    c.strokeStyle = 'rgba(190,170,120,.55)'; c.lineWidth = 1.6;
    for (let i = 0; i < 26; i++) { const x = 1000 + i * 22; c.beginPath(); c.moveTo(x, 130); c.quadraticCurveTo(x + 40 + Math.sin(t * .7 + i) * 4, 330, x + 10, 510); c.stroke(); c.beginPath(); c.moveTo(x + 22, 130); c.quadraticCurveTo(x - 30 + Math.sin(t * .7 + i) * 4, 330, x - 10, 510); c.stroke(); }
    c.strokeStyle = '#8a7040'; c.lineWidth = 6; c.beginPath(); c.moveTo(990, 130); c.quadraticCurveTo(1280, 160, 1570, 130); c.stroke();
    c.lineWidth = 4; c.beginPath(); c.moveTo(1010, 335); c.quadraticCurveTo(1280, 380, 1550, 330); c.stroke();
    for (let k = 0; k < 9; k++) {
      const u = k / 8, x = 1010 + u * 540, y = 335 + Math.sin(u * Math.PI) * 40 * (1 - Math.abs(u - .5)) + Math.sin(t * .9 + k) * 3;
      const special = k === 6 && !st.f.float; c.fillStyle = special ? lg(c, x - 24, 0, x + 24, 0, 0, '#a86a3a', 1, '#6e3a18') : lg(c, x - 24, 0, x + 24, 0, 0, '#c99a5a', 1, '#8a6232');
      if (k === 6 && st.f.float) continue;
      c.beginPath(); c.ellipse(x, y, 26, 18, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, 26, 18, 0, 0, TAU); c.stroke();
    }
    // Caisses
    [[1060, 640, 200, 180], [1270, 660, 180, 160], [1150, 520, 170, 130]].forEach(([x, y, w, h], i) => {
      c.fillStyle = lg(c, 0, y, 0, y + h, 0, '#8a6232', 1, '#5a3a1a'); c.fillRect(x, y, w, h);
      c.strokeStyle = 'rgba(40,20,5,.6)'; c.lineWidth = 3; c.strokeRect(x, y, w, h); c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y + h); c.stroke();
      txt(c, ['🐈 🐦 🍚', 'HL-58', '→ ■'][i], x + w / 2, y + h / 2 + 8, 'bold 26px Consolas, monospace', 'rgba(30,15,5,.7)');
    });
    sconce(c, t, 560, 200, 7);
    c.restore();
    dust(c, t, 22, 300, 60, 900, 600, '#ffd9a0');
    vign(c, .85);
  }

  // ======================= TEMPLE =======================
  function stoneWall(c, dark) {
    c.fillStyle = '#12110d'; c.fillRect(0, 0, W, H);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 12; col++) {
      const x = (row % 2 ? -80 : 0) + col * 160, y = row * 90, v = R(row * 37 + col * 11 + 5);
      c.fillStyle = `hsl(${40 + v * 16},${10 + v * 9}%,${(dark ? 8 : 14) + v * (dark ? 6 : 9)}%)`; c.fillRect(x + 2, y + 2, 156, 86);
      c.fillStyle = 'rgba(255,240,200,.05)'; c.fillRect(x + 2, y + 2, 156, 3); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x + 2, y + 82, 156, 6);
    }
    c.fillStyle = lg(c, 0, 720, 0, H, 0, '#2c2920', 1, '#0b0a07'); c.fillRect(0, 720, W, 180);
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 3; for (let i = -10; i < 11; i++) { c.beginPath(); c.moveTo(800 + i * 130, 720); c.lineTo(800 + i * 300, 900); c.stroke(); }
  }
  function wallTorch(c, t, x, y, k) {
    c.fillStyle = '#2a1c10'; poly(c, [[x - 8, y + 20], [x + 8, y + 20], [x + 4, y + 120], [x - 4, y + 120]]); c.fill();
    c.fillStyle = '#4a4034'; poly(c, [[x - 24, y], [x + 24, y], [x + 14, y + 26], [x - 14, y + 26]]); c.fill();
    flame(c, t + k, x, y - 2, 1); const f = flick(t, k);
    glow(c, x, y - 30, 480, '#ff7a1f', .3 * f); glow(c, x, y - 25, 90, '#ffd27a', .7 * f);
  }
  function beast(c, k, x, y, lit, t) {
    const S1 = '#6d6a58', S2 = '#3e3c30';
    c.fillStyle = lg(c, x - 90, 0, x + 90, 0, 0, '#5a5646', .5, '#77725e', 1, '#3e3b2f'); c.fillRect(x - 90, 560, 180, 100); c.fillStyle = '#87826c'; c.fillRect(x - 100, 548, 200, 16);
    c.fillStyle = lg(c, x - 80, 260, x + 80, 548, 0, S1, 1, S2); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2;
    let eyes = [];
    if (k === 0) { // aigle
      c.beginPath(); c.ellipse(x, 440, 52, 100, 0, 0, TAU); c.fill();
      poly(c, [[x - 48, 380], [x - 110, 300], [x - 70, 500]]); c.fill(); poly(c, [[x + 48, 380], [x + 110, 300], [x + 70, 500]]); c.fill();
      c.beginPath(); c.arc(x, 330, 34, 0, TAU); c.fill(); c.fillStyle = '#8a7a50'; poly(c, [[x - 8, 338], [x + 8, 338], [x, 364]]); c.fill(); eyes = [[x - 12, 324], [x + 12, 324]];
    } else if (k === 1) { // serpent
      for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(x, 530 - i * 34, 80 - i * 14, 24, 0, 0, TAU); c.fill(); c.stroke(); }
      c.beginPath(); c.moveTo(x - 10, 420); c.quadraticCurveTo(x + 40, 360, x + 6, 310); c.lineWidth = 26; c.strokeStyle = S1; c.stroke(); c.lineWidth = 2;
      c.beginPath(); c.ellipse(x + 4, 300, 30, 20, -.2, 0, TAU); c.fill(); eyes = [[x - 6, 294], [x + 14, 292]];
      c.strokeStyle = '#8a3a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 30, 304); c.lineTo(x + 48, 300 + Math.sin(t * 6) * 4); c.stroke();
    } else if (k === 2) { // singe
      c.beginPath(); c.ellipse(x, 470, 56, 76, 0, 0, TAU); c.fill();
      c.lineWidth = 14; c.strokeStyle = S2; c.beginPath(); c.moveTo(x + 40, 520); c.bezierCurveTo(x + 120, 520, x + 110, 400, x + 70, 420); c.stroke(); c.lineWidth = 2;
      c.beginPath(); c.arc(x, 360, 44, 0, TAU); c.fill(); c.beginPath(); c.arc(x - 46, 350, 16, 0, TAU); c.arc(x + 46, 350, 16, 0, TAU); c.fill();
      c.fillStyle = '#8a8268'; c.beginPath(); c.ellipse(x, 376, 26, 18, 0, 0, TAU); c.fill(); eyes = [[x - 14, 350], [x + 14, 350]];
    } else { // tigre
      c.beginPath(); c.ellipse(x, 490, 84, 56, 0, 0, TAU); c.fill();
      c.beginPath(); c.arc(x - 40, 400, 46, 0, TAU); c.fill(); poly(c, [[x - 76, 370], [x - 70, 336], [x - 52, 362]]); c.fill(); poly(c, [[x - 4, 370], [x - 10, 336], [x - 28, 362]]); c.fill();
      c.strokeStyle = 'rgba(20,20,10,.5)'; c.lineWidth = 6; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x - 30 + i * 22, 448); c.lineTo(x - 20 + i * 22, 486); c.stroke(); }
      eyes = [[x - 56, 396], [x - 24, 396]];
    }
    eyes.forEach(([ex, ey]) => { c.fillStyle = lit ? '#fff3b0' : '#1c1a12'; circ(c, ex, ey, 5); if (lit) glow(c, ex, ey, 34, '#ffc94a', .8); });
  }

  function templeB(c, t, st) {
    stoneWall(c, false);
    // Colonnes
    [40, 1500].forEach(x => { c.fillStyle = lg(c, x, 0, x + 70, 0, 0, '#3a372c', .5, '#5a5646', 1, '#2a281f'); c.fillRect(x, 0, 70, 760); });
    // Niche
    c.fillStyle = '#4a4638'; c.fillRect(710, 100, 180, 160);
    if (st.f.niche) { c.fillStyle = '#0c0b08'; c.fillRect(728, 118, 144, 124); if (!st.f.disc && !st.inv.includes('disc')) { c.fillStyle = rg(c, 792, 172, 50, 0, '#fff2b0', .5, '#e8b030', 1, '#8a5a10'); circ(c, 800, 180, 40); glow(c, 800, 180, 120, '#ffcf5a', .5 + .2 * Math.sin(t * 2)); } }
    else { c.fillStyle = lg(c, 0, 118, 0, 242, 0, '#5a5646', 1, '#3a372c'); c.fillRect(728, 118, 144, 124); c.strokeStyle = 'rgba(255,200,120,.25)'; c.lineWidth = 3; c.beginPath(); c.arc(800, 180, 34, 0, TAU); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; c.beginPath(); c.moveTo(800 + Math.cos(a) * 40, 180 + Math.sin(a) * 40); c.lineTo(800 + Math.cos(a) * 52, 180 + Math.sin(a) * 52); c.stroke(); } }
    // Statues
    [250, 550, 1050, 1350].forEach((x, i) => beast(c, i, x, 0, !!st.f.pz_statues, t));
    // Bassin et canaux
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(800, 800, 310, 60, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, 0, 690, 0, 820, 0, '#6a6552', 1, '#34322a'); c.beginPath(); c.ellipse(800, 760, 300, 70, 0, 0, TAU); c.fill();
    c.fillStyle = st.f.pz_pipes ? rg(c, 780, 750, 260, 0, '#5fb4d0', 1, '#1d5a70') : '#1d1b14'; c.beginPath(); c.ellipse(800, 756, 260, 50, 0, 0, TAU); c.fill();
    if (st.f.pz_pipes) for (let i = 0; i < 4; i++) { const r = mod(t * 40 + i * 65, 260); c.strokeStyle = `rgba(220,245,255,${.4 * (1 - r / 260)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(800, 756, r, r * .19, 0, 0, TAU); c.stroke(); }
    else { c.strokeStyle = 'rgba(0,0,0,.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(640, 750); c.lineTo(700, 765); c.lineTo(760, 748); c.stroke(); }
    c.strokeStyle = st.f.pz_pipes ? '#3f9ab8' : '#24221a'; c.lineWidth = 12; c.beginPath(); c.moveTo(1100, 760); c.lineTo(1500, 790); c.lineTo(1600, 790); c.stroke();
    // Sac abandonné
    c.fillStyle = '#4a4430'; c.beginPath(); c.moveTo(60, 850); c.quadraticCurveTo(70, 740, 150, 735); c.quadraticCurveTo(250, 740, 255, 850); c.fill();
    c.strokeStyle = '#2a2618'; c.lineWidth = 4; c.beginPath(); c.moveTo(100, 760); c.quadraticCurveTo(155, 700, 210, 760); c.stroke();
    c.fillStyle = '#d8c89a'; c.save(); c.translate(170, 790); c.rotate(-.3); c.fillRect(-30, -8, 60, 16); c.restore();
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(0, 700, 300, 200);
    wallTorch(c, t, 400, 260, 2); wallTorch(c, t, 1200, 260, 5);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .07; c.fillStyle = lg(c, 800, 0, 800, 800, 0, '#fff1c0', 1, 'rgba(0,0,0,0)'); poly(c, [[700, 0], [900, 0], [1050, 900], [550, 900]]); c.fill(); c.restore();
    dust(c, t, 30, 500, 0, 600, 800, '#fff1c0');
    vign(c, .85);
  }

  function templeC(c, t, st) {
    stoneWall(c, true);
    for (let i = 0; i < 4; i++) { c.strokeStyle = '#0a0907'; c.lineWidth = 30; c.beginPath(); c.arc(200 + i * 400, 120, 200, Math.PI, 0); c.stroke(); }
    // Mur des symboles
    c.fillStyle = lg(c, 80, 150, 480, 570, 0, '#4a4637', 1, '#24221a'); c.fillRect(80, 150, 400, 420);
    c.strokeStyle = '#141209'; c.lineWidth = 5; c.strokeRect(92, 162, 376, 396);
    const ent = Object.entries(st.v.glyph);
    ent.forEach(([l, s], i) => { const col = Math.floor(i / 13), row = i % 13; txt(c, s + ' ' + l, 170 + col * 200, 196 + row * 28, 'bold 22px Segoe UI Symbol, Georgia', 'rgba(230,210,170,.82)'); });
    // Inscription
    c.fillStyle = lg(c, 1140, 150, 1540, 450, 0, '#5a5646', 1, '#2e2b21'); c.fillRect(1140, 150, 400, 300);
    c.strokeStyle = '#141209'; c.lineWidth = 5; c.strokeRect(1152, 162, 376, 276);
    txt(c, '▲', 1340, 220, 'bold 40px Georgia', 'rgba(255,200,120,.75)');
    const gw = [...(st.glyphWord || '')]; const sz = Math.min(60, 340 / Math.max(1, gw.length));
    txt(c, gw.map(ch => st.v.glyph[ch] || ch).join(' '), 1340, 340, `bold ${sz}px Segoe UI Symbol, Georgia`, st.f.pz_glyph ? '#ffe9a0' : 'rgba(230,210,170,.85)');
    if (st.f.pz_glyph) glow(c, 1340, 330, 200, '#ffc94a', .35);
    // Sarcophage
    c.fillStyle = 'rgba(0,0,0,.5)'; c.beginPath(); c.ellipse(800, 790, 320, 30, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, 0, 600, 0, 780, 0, '#5a5646', 1, '#2a281f'); c.fillRect(530, 600, 540, 180);
    const off = st.f.pz_relief ? 180 : 0;
    if (off) { c.fillStyle = '#060504'; c.fillRect(546, 560, 508, 50); txt(c, '★', 700, 600, 'bold 34px Georgia', '#ffd27a'); glow(c, 700, 590, 80, '#ffc94a', .5); }
    c.save(); c.translate(off, off ? -12 : 0); if (off) c.rotate(.05);
    c.fillStyle = lg(c, 0, 520, 0, 610, 0, '#7a7560', 1, '#4a4638'); poly(c, [[520, 560], [1080, 560], [1060, 520], [540, 520]]); c.fill(); c.fillRect(520, 560, 560, 46);
    c.fillStyle = 'rgba(30,40,20,.6)'; c.beginPath(); c.ellipse(700, 560, 120, 18, 0, 0, TAU); c.fill(); poly(c, [[580, 560], [520, 552], [590, 545]]); c.fill();
    c.fillStyle = '#26241b'; circ(c, 800, 560, 26);
    if (st.f.disc) { c.fillStyle = rg(c, 795, 555, 30, 0, '#fff2b0', .5, '#e8b030', 1, '#8a5a10'); circ(c, 800, 560, 24); glow(c, 800, 560, 90, '#ffcf5a', .6); }
    c.restore();
    // Jarres
    [[1270, 760, 1], [1370, 740, 1.3], [1470, 770, .9]].forEach(([x, y, s]) => {
      c.fillStyle = lg(c, x - 40 * s, 0, x + 40 * s, 0, 0, '#5a3218', .5, '#8a5228', 1, '#4a2810');
      c.beginPath(); c.moveTo(x - 16 * s, y - 120 * s); c.quadraticCurveTo(x - 60 * s, y - 70 * s, x - 34 * s, y); c.lineTo(x + 34 * s, y); c.quadraticCurveTo(x + 60 * s, y - 70 * s, x + 16 * s, y - 120 * s); c.fill();
      c.fillStyle = '#3a200c'; c.fillRect(x - 20 * s, y - 128 * s, 40 * s, 10 * s);
    });
    // Toiles d'araignée
    c.strokeStyle = 'rgba(220,220,220,.18)'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(180 - i * 30, i * 30); c.stroke(); c.beginPath(); c.arc(0, 0, 40 + i * 25, 0, Math.PI / 2); c.stroke(); }
    dust(c, t, 20, 0, 0, W, 800, '#fff1c0');
    vign(c, .9);
  }

  // ======================= STATION =======================
  function stationWall(c, t) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#1e2838', .6, '#121824', 1, '#090c13'); c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 3;
    for (let x = 100; x < W; x += 200) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    [90, 500, 760].forEach(y => { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); });
    c.fillStyle = 'rgba(160,180,210,.22)'; for (let x = 100; x < W; x += 200) for (const y of [102, 488, 512, 748]) { circ(c, x + 12, y, 3); circ(c, x - 12, y, 3); }
    c.fillStyle = lg(c, 0, 760, 0, H, 0, '#151b26', 1, '#06080c'); c.fillRect(0, 760, W, 140);
    c.strokeStyle = 'rgba(120,140,170,.18)'; c.lineWidth = 2; for (let x = 0; x < W; x += 24) { c.beginPath(); c.moveTo(x, 760); c.lineTo(x - 60, 900); c.stroke(); }
  }
  function stationB(c, t, st) {
    stationWall(c, t);
    // Tuyaux au plafond
    for (let k = 0; k < 3; k++) { c.fillStyle = lg(c, 0, 50 + k * 26, 0, 70 + k * 26, 0, '#7a8494', .5, '#a8b2c2', 1, '#4a5260'); c.fillRect(0, 50 + k * 26, W, 18); for (let x = 60; x < W; x += 240) { c.fillStyle = '#3a404c'; c.fillRect(x + k * 40, 46 + k * 26, 16, 26); } }
    c.fillStyle = lg(c, 1470, 0, 1510, 0, 0, '#4a5260', .5, '#a8b2c2', 1, '#4a5260'); c.fillRect(1470, 100, 40, 660);
    // Disjoncteurs
    rr(c, 140, 200, 260, 360, 10); c.fillStyle = lg(c, 140, 0, 400, 0, 0, '#5b606a', .5, '#7a808a', 1, '#4a4f58'); c.fill(); c.strokeStyle = '#1a1d22'; c.lineWidth = 3; c.stroke();
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
      const on = st.f.lights || R(r * 4 + k + Math.floor(t * 2) * 0) > .45, x = 175 + k * 55, y = 240 + r * 75;
      rr(c, x, y, 34, 50, 4); c.fillStyle = '#20242c'; c.fill(); rr(c, x + 6, on ? y + 6 : y + 26, 22, 18, 3); c.fillStyle = '#d8dce4'; c.fill();
      c.fillStyle = on ? '#4dff88' : '#ff4d4d'; circ(c, x + 17, y + 60, 4); if (on && st.f.lights) glow(c, x + 17, y + 60, 12, '#4dff88', .5);
    }
    // Boîte de jonction
    rr(c, 480, 200, 360, 300, 10); c.fillStyle = '#2a303a'; c.fill(); c.strokeStyle = '#11141a'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#e2b521'; c.fillRect(496, 212, 328, 16); txt(c, '⚡ 480V', 660, 226, 'bold 13px Consolas, monospace', '#1a1a1a');
    ['#ff5a5a', '#5ad1ff', '#ffd24a', '#6dff9a'].forEach((col, i) => {
      c.strokeStyle = st.f.power ? col : '#3a3f48'; c.lineWidth = 7; c.beginPath(); c.moveTo(510, 260 + i * 55); c.bezierCurveTo(600, 230 + i * 60, 720, 330 + i * 30, 820, 270 + i * 50); c.stroke();
      if (st.f.power) glow(c, 520 + mod(t * 160 + i * 70, 300), 260 + i * 55 + Math.sin(t + i) * 10, 18, col, .5);
    });
    if (!st.f.power && (t * 7) % 3 < .4) { const sx = 700 + R(Math.floor(t * 7)) * 80, sy = 330 + R(Math.floor(t * 7) + 3) * 80; glow(c, sx, sy, 60, '#bfe6ff', 1); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy); for (let k = 0; k < 4; k++) c.lineTo(sx + (R(k + t) - .5) * 60, sy + (R(k + 9 + t) - .5) * 60); c.stroke(); }
    // Tableau blanc
    c.fillStyle = '#8a929e'; c.fillRect(890, 140, 520, 320); c.fillStyle = '#f2f4f6'; c.fillRect(900, 150, 500, 300);
    c.strokeStyle = 'rgba(30,60,160,.7)'; c.lineWidth = 2.5; for (let r = 0; r < 6; r++) { c.beginPath(); let x = 930; c.moveTo(x, 190 + r * 40); while (x < 1100 + R(r) * 230) { x += 12; c.lineTo(x, 190 + r * 40 + Math.sin(x * .3 + r) * 4); } c.stroke(); }
    txt(c, '∫ Δv = ?', 1300, 210, 'italic 26px Georgia', '#c0392b'); txt(c, '▲ = ?', 1310, 400, 'bold 30px Georgia', '#c0392b');
    c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.ellipse(1310, 390, 55, 26, 0, 0, TAU); c.stroke();
    // Armoire à échantillons
    rr(c, 1150, 480, 250, 330, 10); c.fillStyle = lg(c, 1150, 0, 1400, 0, 0, '#c8d0dc', 1, '#8a94a4'); c.fill();
    rr(c, 1170, 500, 210, 250, 6); c.fillStyle = 'rgba(160,210,240,.45)'; c.fill();
    for (let s = 0; s < 3; s++) { c.fillStyle = '#6a7484'; c.fillRect(1176, 570 + s * 70, 198, 4); for (let k = 0; k < 6; k++) { c.fillStyle = ['#ff7a7a', '#7affb0', '#7ac8ff', '#ffe07a'][(k + s) % 4]; c.fillRect(1186 + k * 32, 530 + s * 70, 12, 38); } }
    for (let i = 0; i < 20; i++) { c.fillStyle = 'rgba(255,255,255,.25)'; circ(c, 1170 + R(i + 40) * 210, 500 + R(i + 41) * 250, 3 + R(i) * 6); }
    rr(c, 1330, 760, 50, 34, 4); c.fillStyle = '#1a1d22'; c.fill(); c.fillStyle = st.f.fridge ? '#4dff88' : '#ff4d4d'; circ(c, 1355, 777, 6); glow(c, 1355, 777, 20, st.f.fridge ? '#4dff88' : '#ff4d4d', .6);
    // Caisse à outils
    c.fillStyle = '#9a2a24'; rr(c, 470, 720, 200, 90, 8); c.fill(); c.fillStyle = '#6a1a16'; c.fillRect(470, 744, 200, 8); c.strokeStyle = '#2a2a2a'; c.lineWidth = 6; c.beginPath(); c.moveTo(530, 720); c.lineTo(530, 700); c.lineTo(610, 700); c.lineTo(610, 720); c.stroke();
    // Éclairage
    if (st.f.lights) { for (const x of [300, 800, 1300]) { c.fillStyle = '#e8f6ff'; c.fillRect(x - 140, 120, 280, 8); glow(c, x, 128, 520, '#d8f0ff', .14); } }
    else { c.fillStyle = `rgba(255,30,30,${.05 + .04 * Math.sin(t * 3)})`; c.fillRect(0, 0, W, H); }
    dust(c, t, 30, 0, 0, W, H, '#bfe6ff');
    vign(c, .8);
  }

  function stationC(c, t, st) {
    stationWall(c, t);
    // Capsule cryo
    c.fillStyle = 'rgba(0,0,0,.4)'; rr(c, 112, 212, 330, 440, 140); c.fill();
    rr(c, 100, 200, 330, 440, 140); c.fillStyle = lg(c, 100, 0, 430, 0, 0, '#9aa6b8', .5, '#d8e0ea', 1, '#7a8698'); c.fill();
    rr(c, 140, 240, 250, 360, 110); c.fillStyle = rg(c, 265, 400, 220, 0, 'rgba(160,230,255,.9)', 1, 'rgba(40,110,170,.8)'); c.fill();
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${.15 + R(i) * .3})`; circ(c, 150 + R(i + 1) * 230, 250 + R(i + 2) * 340, 2 + R(i + 3) * 7); }
    glow(c, 265, 420, 220, '#6fd8ff', .25 + .08 * Math.sin(t * 2));
    c.fillStyle = lg(c, 0, 640, 0, 740, 0, '#5a6474', 1, '#2a303a'); c.fillRect(120, 636, 290, 100);
    const dOpen = st.f.flash ? 0 : 14;
    c.fillStyle = '#0c0f14'; c.fillRect(150, 652, 230, 70); c.fillStyle = lg(c, 0, 650, 0, 720, 0, '#7a8494', 1, '#4a5260'); c.fillRect(150, 652 + dOpen, 230, 66); c.fillStyle = '#c8d0dc'; c.fillRect(240, 676 + dOpen, 50, 8);
    if (!st.f.flash) { c.fillStyle = '#e2b521'; c.fillRect(170, 652, 60, 10); }
    // Photos
    c.fillStyle = '#2a303a'; c.fillRect(510, 150, 380, 260);
    for (let i = 0; i < 6; i++) {
      const x = 530 + (i % 3) * 120, y = 168 + Math.floor(i / 3) * 118, rot = (R(i + 50) - .5) * .12;
      c.save(); c.translate(x + 50, y + 50); c.rotate(rot); c.fillStyle = '#f4f1e8'; c.fillRect(-50, -50, 100, 106);
      c.fillStyle = ['#5a7fa0', '#a07a5a', '#5aa07a', '#a05a7a', '#7a5aa0', '#a0a05a'][i]; c.fillRect(-42, -42, 84, 76);
      c.fillStyle = ['#f2c9a0', '#8a5a3a', '#f0d0b0', '#d9a77a', '#e8c8a0', '#f2d0b0'][i]; circ(c, 0, -10, 16); c.fillStyle = '#e9edf2'; c.fillRect(-20, 8, 40, 26);
      c.fillStyle = '#d33a2c'; circ(c, 0, -50, 5); c.restore();
    }
    // Hublot
    rr(c, 560, 470, 220, 160, 60); c.save(); c.clip(); c.fillStyle = '#02030a'; c.fillRect(560, 470, 220, 160);
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${.4 + .5 * Math.abs(Math.sin(t + i))})`; c.fillRect(560 + mod(R(i) * 220 + t * 12, 220), 470 + R(i + 9) * 160, 2, 2); }
    c.restore(); c.strokeStyle = '#7a8698'; c.lineWidth = 14; rr(c, 560, 470, 220, 160, 60); c.stroke();
    // Casier de la commandante
    const open = st.f.pz_locker;
    c.fillStyle = lg(c, 960, 0, 1200, 0, 0, '#4a5260', .5, '#6a7484', 1, '#3a404c'); c.fillRect(960, 180, 240, 560);
    if (open) { c.fillStyle = '#0a0d12'; c.fillRect(970, 190, 220, 540); c.fillStyle = '#5a6474'; poly(c, [[970, 190], [900, 210], [900, 720], [970, 730]]); c.fill(); }
    else {
      c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2; c.strokeRect(970, 190, 220, 540);
      for (let k = 0; k < 6; k++) { c.fillStyle = '#20262f'; c.fillRect(1010, 220 + k * 14, 140, 6); }
      rr(c, 1020, 400, 120, 60, 6); c.fillStyle = '#05080c'; c.fill(); for (let k = 0; k < 4; k++) { rr(c, 1030 + k * 27, 412, 22, 36, 3); c.fillStyle = '#0d2a1c'; c.fill(); txt(c, '?', 1041 + k * 27, 438, 'bold 20px Consolas, monospace', '#6dff9a'); }
    }
    txt(c, 'SATO', 1080, 170, 'bold 20px Consolas, monospace', '#9aa6b8');
    // Couchette et ours en peluche
    c.fillStyle = '#3a404c'; c.fillRect(1200, 380, 360, 180); c.fillStyle = lg(c, 0, 400, 0, 470, 0, '#5a6a8a', 1, '#3a4a6a'); rr(c, 1212, 400, 336, 70, 12); c.fill();
    c.strokeStyle = '#e2b521'; c.lineWidth = 6; [1300, 1460].forEach(x => { c.beginPath(); c.moveTo(x, 390); c.lineTo(x, 480); c.stroke(); });
    const by = 300 + Math.sin(t * .8) * 14, bx = 1390 + Math.cos(t * .5) * 10;
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(1390, 400); c.lineTo(bx, by + 30); c.stroke();
    c.save(); c.translate(bx, by); c.rotate(Math.sin(t * .6) * .3); c.fillStyle = '#a0703a'; circ(c, 0, 0, 22); circ(c, -18, -18, 9); circ(c, 18, -18, 9); c.beginPath(); c.ellipse(0, 34, 18, 22, 0, 0, TAU); c.fill(); c.fillStyle = '#2a1a0a'; circ(c, -7, -3, 3); circ(c, 7, -3, 3); c.restore();
    // Tablette sur une petite table
    c.fillStyle = '#2a303a'; c.fillRect(1240, 720, 240, 14); c.fillRect(1260, 734, 10, 30); c.fillRect(1450, 734, 10, 30);
    rr(c, 1260, 600, 200, 120, 12); c.fillStyle = '#0a0d12'; c.fill();
    const cur = Math.floor(t * 2) % 4;
    ['#ff5a5a', '#5ad1ff', '#ffd24a', '#6dff9a'].forEach((col, i) => { const x = 1280 + (i % 2) * 85, y = 615 + Math.floor(i / 2) * 50; rr(c, x, y, 75, 42, 6); c.fillStyle = i === cur ? col : 'rgba(255,255,255,.08)'; c.fill(); if (i === cur) glow(c, x + 37, y + 21, 50, col, .5); });
    dust(c, t, 26, 0, 0, W, H, '#bfe6ff');
    c.fillStyle = `rgba(255,30,30,${.03 + .04 * Math.max(0, Math.sin(t * 3))})`; c.fillRect(0, 0, W, H);
    vign(c, .8);
  }

  Object.assign(window.Scenes, { classB, classC, shipB, shipC, templeB, templeC, stationB, stationC });
})();

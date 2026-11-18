// Décors animés des quatre salles, dessinés en temps réel sur un canvas 1600×900.
(function () {
  'use strict';
  const W = 1600, H = 900, TAU = Math.PI * 2;
  const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mod = (a, n) => ((a % n) + n) % n;
  function lg(c, x0, y0, x1, y1, ...s) { const g = c.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < s.length; i += 2) g.addColorStop(s[i], s[i + 1]); return g; }
  function rg(c, x, y, r, ...s) { const g = c.createRadialGradient(x, y, 0, x, y, r); for (let i = 0; i < s.length; i += 2) g.addColorStop(s[i], s[i + 1]); return g; }
  function glow(c, x, y, r, col, a) {
    if (a <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, a);
    c.fillStyle = rg(c, x, y, r, 0, col, 1, 'rgba(0,0,0,0)'); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore();
  }
  function vign(c, a) { c.fillStyle = rg(c, W / 2, H / 2, 1000, 0, 'rgba(0,0,0,0)', .55, 'rgba(0,0,0,0)', 1, `rgba(0,0,0,${a})`); c.fillRect(0, 0, W, H); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function poly(c, pts) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
  const flick = (t, k) => .86 + .09 * Math.sin(t * 11 + k) + .05 * Math.sin(t * 23.7 + k * 2);
  function dust(c, t, n, x0, y0, w, h, col) {
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const x = x0 + mod(R(i) * w + t * (5 + R(i + 9) * 12), w), y = y0 + mod(R(i + 50) * h - t * (3 + R(i + 20) * 6) + Math.sin(t * .4 + i) * 18, h);
      c.globalAlpha = .12 + .3 * Math.abs(Math.sin(t * .7 + i * 3)); c.beginPath(); c.arc(x, y, 1.2 + R(i + 5) * 2.2, 0, TAU); c.fill();
    }
    c.restore();
  }
  function flame(c, t, x, y, s) {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) {
      const l = mod(t * (.9 + R(i) * .6) + R(i + 40), 1);
      const px = x + Math.sin(l * 7 + i + t * 2) * 12 * s * (1 - l * .4), py = y - l * 115 * s, r = (26 * (1 - l) + 4) * s;
      c.globalAlpha = (1 - l) * .55;
      c.fillStyle = rg(c, px, py, r, 0, l < .3 ? '#fff3c4' : l < .65 ? '#ff9a2e' : '#d8380f', 1, 'rgba(0,0,0,0)');
      c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill();
    }
    c.restore();
  }

  // ================= 1. Salle de classe, la nuit =================
  function lightning(t) { const p = t % 11; return p < .08 ? 1 : p < .16 ? .3 : p < .24 ? .85 : p < .7 ? (.7 - p) * .9 : 0; }
  function classA(c, t, st) {
    const fl = lightning(t);
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#1b243c', .6, '#101628', 1, '#090c16'); c.fillRect(0, 0, W, H);
    c.fillStyle = lg(c, 0, 520, 0, 720, 0, '#1f1c26', 1, '#131019'); c.fillRect(0, 520, W, 200);
    c.fillStyle = '#2d2735'; c.fillRect(0, 514, W, 7);
    c.fillStyle = lg(c, 0, 720, 0, H, 0, '#33231c', 1, '#0f0a09'); c.fillRect(0, 720, W, 180);
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2;
    for (let i = -14; i < 15; i++) { c.beginPath(); c.moveTo(800 + i * 95, 720); c.lineTo(800 + i * 240, 900); c.stroke(); }

    // Fenêtre, pluie et orage
    const wx = 990, wy = 100, ww = 420, wh = 390;
    c.save(); rr(c, wx, wy, ww, wh, 4); c.clip();
    c.fillStyle = lg(c, 0, wy, 0, wy + wh, 0, '#22355f', 1, '#0a1226'); c.fillRect(wx, wy, ww, wh);
    glow(c, wx + 310, wy + 95, 150, '#b9cfff', .5); c.fillStyle = '#eaf1ff'; c.beginPath(); c.arc(wx + 310, wy + 95, 32, 0, TAU); c.fill();
    c.fillStyle = 'rgba(8,12,26,.75)';
    for (let i = 0; i < 6; i++) { const x = wx + mod(R(i) * 700 + t * (6 + i * 2), 700) - 140; c.beginPath(); c.ellipse(x, wy + 60 + i * 26, 130, 26, 0, 0, TAU); c.fill(); }
    c.fillStyle = '#060912'; c.beginPath(); c.moveTo(wx, wy + wh);
    for (let x = 0; x <= ww; x += 20) c.lineTo(wx + x, wy + wh - 60 - Math.sin(x * .05) * 22 - R(x) * 30 - Math.sin(t * .8 + x * .02) * 3);
    c.lineTo(wx + ww, wy + wh); c.fill();
    if (fl) { c.fillStyle = `rgba(220,230,255,${fl * .75})`; c.fillRect(wx, wy, ww, wh); }
    c.strokeStyle = 'rgba(200,220,255,.4)'; c.lineWidth = 1.6; c.beginPath();
    for (let i = 0; i < 110; i++) {
      const x = wx - 40 + mod(R(i) * (ww + 80) - t * 90, ww + 80), y = wy + mod(R(i + 7) * wh + t * (760 + R(i + 3) * 420), wh);
      c.moveTo(x, y); c.lineTo(x - 7, y + 30);
    }
    c.stroke();
    for (let i = 0; i < 16; i++) {
      const x = wx + 20 + R(i + 80) * (ww - 40) + Math.sin(t + i) * 2, y = wy + mod(R(i + 90) * wh + t * (10 + R(i + 2) * 30), wh);
      c.fillStyle = 'rgba(200,220,255,.28)'; c.beginPath(); c.ellipse(x, y, 3, 4.5, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(x - 1, y - 1.5, 1, 0, TAU); c.fill();
    }
    c.restore();
    c.strokeStyle = '#3d4257'; c.lineWidth = 16; c.strokeRect(wx, wy, ww, wh);
    c.lineWidth = 9; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh * .45); c.lineTo(wx + ww, wy + wh * .45); c.stroke();
    c.fillStyle = '#4a4f66'; c.fillRect(wx - 22, wy + wh + 6, ww + 44, 14);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .09 + fl * .4; c.fillStyle = '#8fb0ff';
    poly(c, [[wx, wy + wh + 20], [wx + ww, wy + wh + 20], [1330, 900], [640, 900]]); c.fill(); c.restore();

    // Tableau noir
    c.fillStyle = lg(c, 0, 140, 0, 500, 0, '#5d3c22', 1, '#3a2413'); c.fillRect(168, 138, 644, 356);
    c.fillStyle = lg(c, 190, 160, 790, 470, 0, '#1a3d35', 1, '#0d221e'); c.fillRect(190, 160, 600, 310);
    for (let i = 0; i < 9; i++) { c.fillStyle = `rgba(255,255,255,${.015 + R(i) * .03})`; c.beginPath(); c.ellipse(240 + R(i + 3) * 500, 200 + R(i + 6) * 230, 90 + R(i) * 90, 26 + R(i + 1) * 30, R(i) * 3, 0, TAU); c.fill(); }
    c.strokeStyle = 'rgba(238,242,230,.55)'; c.lineWidth = 3; c.lineCap = 'round';
    for (let r = 0; r < 6; r++) {
      let x = 225;
      while (x < 730 - R(r) * 160) {
        const w = 18 + R(x + r) * 46; c.beginPath(); c.moveTo(x, 212 + r * 42);
        for (let k = 0; k <= 5; k++) c.lineTo(x + w * k / 5, 212 + r * 42 + Math.sin(k * 2 + x) * 5 * R(x + k));
        c.stroke(); x += w + 14;
      }
    }
    c.strokeStyle = 'rgba(255,225,130,.7)'; c.beginPath(); c.moveTo(225, 188); c.lineTo(470, 186); c.stroke();
    c.fillStyle = '#6b4728'; c.fillRect(168, 494, 644, 12);
    c.fillStyle = '#f2f2ea'; c.fillRect(300, 488, 34, 7); c.fillStyle = '#f4b6b6'; c.fillRect(350, 488, 22, 7);

    // Affiche
    c.save(); c.translate(895, 265); c.rotate(-.03 + Math.sin(t * .9) * .004);
    c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(-56, -80, 120, 170);
    c.fillStyle = lg(c, -60, -85, 60, 85, 0, '#efe3c6', 1, '#cdbd98'); c.fillRect(-60, -85, 120, 170);
    c.fillStyle = '#d1483b'; c.beginPath(); c.arc(-22, -42, 20, 0, TAU); c.fill();
    c.fillStyle = '#2f6fb3'; poly(c, [[10, -22], [44, -22], [27, -58]]); c.fill();
    c.fillStyle = '#e6b23a'; c.fillRect(-40, 2, 34, 34);
    c.fillStyle = '#3c2f22'; c.font = 'bold 54px Georgia'; c.fillText('?', 8, 48);
    c.fillStyle = '#b73a30'; c.beginPath(); c.arc(0, -78, 5, 0, TAU); c.fill();
    c.restore();
    { const near = st.held === 'uv' && Math.hypot(st.mx - 895, st.my - 265) < 170; if (st.f.uvPoster || near) uvText(c, '▲ ' + st.code['▲'], 895, 300, st.f.uvPoster ? 1 : Math.max(0, 1 - Math.hypot(st.mx - 895, st.my - 265) / 170)); }

    // Lampe suspendue
    const a = .075 * Math.sin(t * 1.2), f = flick(t * .35, 2);
    c.save(); c.translate(600, 0); c.rotate(a);
    c.strokeStyle = '#0c0c10'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 108); c.stroke();
    c.fillStyle = lg(c, -62, 0, 62, 0, 0, '#1c1e26', .5, '#3a3d4a', 1, '#15161c'); poly(c, [[-62, 150], [62, 150], [30, 106], [-30, 106]]); c.fill();
    c.fillStyle = '#fff1c9'; c.beginPath(); c.ellipse(0, 152, 26, 9, 0, 0, TAU); c.fill();
    c.restore();
    const lx = 600 - Math.sin(a) * 152, ly = Math.cos(a) * 152;
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .2 * f;
    c.fillStyle = rg(c, lx, ly, 760, 0, '#ffd9a0', 1, 'rgba(0,0,0,0)'); poly(c, [[lx - 55, ly], [lx + 55, ly], [lx + 470, 900], [lx - 470, 900]]); c.fill(); c.restore();
    glow(c, lx, ly, 110, '#ffe0ad', .9 * f);

    // Bureau, cahier, cartes
    c.fillStyle = lg(c, 0, 668, 0, 712, 0, '#7a5534', 1, '#52361f'); poly(c, [[230, 668], [970, 668], [1010, 712], [190, 712]]); c.fill();
    c.fillStyle = lg(c, 0, 712, 0, 900, 0, '#3f2917', 1, '#170e08'); c.fillRect(200, 712, 800, 188);
    if (st.f.drawer) { c.fillStyle = '#120a05'; c.fillRect(250, 740, 300, 110); c.fillStyle = lg(c, 0, 760, 0, 880, 0, '#6a4628', 1, '#3a2414'); poly(c, [[236, 772], [564, 772], [580, 880], [220, 880]]); c.fill(); c.fillStyle = '#1a0f07'; poly(c, [[252, 778], [548, 778], [556, 812], [244, 812]]); c.fill(); c.fillStyle = '#b89a56'; c.beginPath(); c.arc(400, 846, 8, 0, TAU); c.fill(); }
    else { c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = 3; c.strokeRect(250, 740, 300, 110); c.fillStyle = '#b89a56'; c.beginPath(); c.arc(400, 795, 8, 0, TAU); c.fill(); c.fillStyle = '#d9b24a'; c.fillRect(395, 760, 10, 14); }
    glow(c, lx, 690, 300, '#ffcf8a', .22 * f);
    c.fillStyle = 'rgba(0,0,0,.35)'; poly(c, [[368, 672], [520, 664], [526, 674], [372, 682]]); c.fill();
    c.fillStyle = '#f1e8d2'; poly(c, [[372, 618], [504, 610], [518, 662], [364, 672]]); c.fill();
    c.strokeStyle = 'rgba(70,100,160,.5)'; c.lineWidth = 1.5;
    for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(376, 620 + i * 8.5); c.lineTo(510, 612 + i * 8.5); c.stroke(); }
    c.strokeStyle = '#444'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(376 + i * 14.4, 617 - i * .9, 4, Math.PI, TAU); c.stroke(); }
    c.strokeStyle = '#e0a52c'; c.lineWidth = 6; c.beginPath(); c.moveTo(535, 650); c.lineTo(585, 676); c.stroke();
    for (let k = 0; k < 6; k++) {
      c.save(); c.translate(676 + k * 2, 648 - k * 3.5); c.transform(1, -.06, .35, .6, 0, 0); rr(c, -48, -30, 96, 60, 6);
      c.fillStyle = k < 5 ? '#ece6d6' : '#fbf8f0'; c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1.5; c.stroke();
      if (k === 5) { rr(c, -40, -23, 80, 46, 4); c.fillStyle = '#a3262e'; c.fill(); c.strokeStyle = '#e9c98a'; c.lineWidth = 2; c.strokeRect(-32, -16, 64, 32); }
      c.restore();
    }

    // Tabouret et cartable verrouillé
    c.fillStyle = '#20140c'; c.fillRect(1160, 822, 16, 78); c.fillRect(1324, 822, 16, 78);
    c.fillStyle = lg(c, 0, 800, 0, 830, 0, '#6d4a2c', 1, '#3a2514'); c.beginPath(); c.ellipse(1250, 814, 150, 20, 0, 0, TAU); c.fill();
    c.strokeStyle = '#3b1512'; c.lineWidth = 12; c.beginPath(); c.arc(1250, 600, 46, Math.PI, TAU); c.stroke();
    rr(c, 1140, 598, 220, 212, 34); c.fillStyle = lg(c, 1140, 598, 1360, 810, 0, '#c9443a', 1, '#6a1915'); c.fill();
    rr(c, 1140, 592, 220, 116, 34); c.fillStyle = lg(c, 0, 592, 0, 708, 0, '#a8322a', 1, '#7d201b'); c.fill();
    c.strokeStyle = 'rgba(255,220,200,.25)'; c.lineWidth = 2; c.setLineDash([8, 6]); rr(c, 1150, 602, 200, 96, 26); c.stroke(); c.setLineDash([]);
    rr(c, 1175, 728, 150, 64, 14); c.fillStyle = 'rgba(0,0,0,.22)'; c.fill();
    c.fillStyle = '#4b1512'; c.fillRect(1180, 640, 18, 80); c.fillRect(1302, 640, 18, 80);
    c.strokeStyle = '#c9cbd3'; c.lineWidth = 6; c.beginPath(); c.arc(1250, 702, 13, Math.PI, TAU); c.stroke();
    rr(c, 1230, 702, 40, 34, 6); c.fillStyle = lg(c, 1230, 702, 1270, 736, 0, '#ffe59a', .5, '#c79a2e', 1, '#8a6417'); c.fill();
    c.fillStyle = '#3a2a08'; c.beginPath(); c.arc(1250, 716, 4, 0, TAU); c.fill(); c.fillRect(1248.5, 716, 3, 10);
    glow(c, 1250, 716, 40, '#fff1b0', .25 + .25 * Math.sin(t * 2.6));

    dust(c, t, 34, lx - 300, 160, 600, 520, '#ffe6b8');
    if (fl) { c.fillStyle = `rgba(190,210,255,${fl * .16})`; c.fillRect(0, 0, W, H); }
    vign(c, .78);
    uvLamp(c, st);
  }

  // ================= 2. Cabine du bateau =================
  function shipA(c, t, st) {
    const rock = Math.sin(t * .7) * .014;
    c.fillStyle = '#0b0705'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H / 2); c.rotate(rock); c.scale(1.05, 1.05); c.translate(-W / 2, -H / 2);
    for (let y = 0, k = 0; y < 720; y += 78, k++) {
      c.fillStyle = lg(c, 0, y, 0, y + 78, 0, '#553520', .5, '#422816', 1, '#2a180c'); c.fillRect(0, y, W, 78);
      c.fillStyle = `rgba(0,0,0,${R(k) * .22})`; c.fillRect(0, y, W, 78);
      c.strokeStyle = 'rgba(20,10,4,.3)'; c.lineWidth = 1.5;
      for (let g = 0; g < 5; g++) { c.beginPath(); const yy = y + 10 + g * 14; c.moveTo(0, yy); for (let x = 0; x <= W; x += 80) c.lineTo(x, yy + Math.sin(x * .01 + k * 3 + g) * 5 + R(k * 9 + g) * 4); c.stroke(); }
      c.fillStyle = '#120a05'; c.fillRect(0, y, W, 4);
      for (let n = 0; n < 5; n++) { const nx = 70 + n * 370 + R(k * 5 + n) * 50; c.fillStyle = '#1a100a'; c.beginPath(); c.arc(nx, y + 16, 4, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,220,160,.25)'; c.beginPath(); c.arc(nx - 1, y + 15, 1.4, 0, TAU); c.fill(); }
    }
    c.fillStyle = lg(c, 0, 0, 0, 66, 0, '#150c07', 1, '#34200f'); c.fillRect(0, 0, W, 66);

    // Hublot : mer, lune et phare
    const px = 1050, py = 300, pr = 150;
    c.save(); c.beginPath(); c.arc(px, py, pr, 0, TAU); c.clip();
    c.fillStyle = lg(c, 0, py - pr, 0, py + pr, 0, '#0a1430', .55, '#27406a', 1, '#0a1c30'); c.fillRect(px - pr, py - pr, pr * 2, pr * 2);
    c.translate(px, py); c.rotate(-rock * 6);
    for (let i = 0; i < 34; i++) { c.fillStyle = `rgba(255,255,255,${.3 + .5 * Math.abs(Math.sin(t * 1.3 + i * 2.2))})`; c.fillRect(-190 + R(i) * 380, -190 + R(i + 11) * 190, 2, 2); }
    glow(c, 80, -85, 80, '#dfe8ff', .55); c.fillStyle = '#f2f5ff'; c.beginPath(); c.arc(80, -85, 20, 0, TAU); c.fill();
    const hz = 22 + Math.sin(t * .7 + 1) * 16;
    c.fillStyle = '#070d18'; c.beginPath(); c.moveTo(-150, hz + 4); c.quadraticCurveTo(-85, hz - 34, -30, hz + 4); c.fill();
    c.fillStyle = '#d9dde6'; poly(c, [[-92, hz - 18], [-74, hz - 18], [-78, hz - 78], [-88, hz - 78]]); c.fill();
    c.fillStyle = '#b2343a'; c.fillRect(-90, hz - 52, 14, 10); c.fillStyle = '#20242e'; c.fillRect(-91, hz - 90, 16, 13);
    if (st.morse) {
      c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .3; c.fillStyle = lg(c, -83, 0, 200, 0, 0, '#fff4c8', 1, 'rgba(0,0,0,0)');
      poly(c, [[-83, hz - 84], [200, hz - 150], [200, hz - 10]]); c.fill(); c.restore();
      glow(c, -83, hz - 84, 130, '#fff2c0', .95); glow(c, -83, hz - 84, 28, '#ffffff', 1);
    } else glow(c, -83, hz - 84, 16, '#fff2c0', .18);
    for (let k = 0; k < 6; k++) {
      c.fillStyle = `rgb(${30 - k * 4},${78 - k * 10},${112 - k * 13})`; c.beginPath(); c.moveTo(-220, 260);
      for (let x = -220; x <= 220; x += 10) c.lineTo(x, hz + k * 22 + Math.sin(x * .03 * (1 + k * .15) + t * (1.1 + k * .28) + k * 1.7) * (3 + k * 2.6));
      c.lineTo(220, 260); c.fill();
    }
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = '#dbe6ff';
    for (let i = 0; i < 22; i++) { c.globalAlpha = .1 + .5 * Math.abs(Math.sin(t * 3 + i * 1.9)); c.fillRect(60 + (R(i) - .5) * 60 * (1 + i * .08), hz + 8 + i * 6, 10 + R(i + 4) * 16, 2); }
    c.restore();
    c.restore();
    c.save(); c.globalAlpha = .14; c.strokeStyle = '#fff'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.arc(px, py, pr - 28, Math.PI * 1.1, Math.PI * 1.42); c.stroke(); c.restore();
    c.lineWidth = 32; c.strokeStyle = lg(c, px - pr, py - pr, px + pr, py + pr, 0, '#f3d98f', .45, '#8a6524', .7, '#c7a04d', 1, '#5f4416'); c.beginPath(); c.arc(px, py, pr + 12, 0, TAU); c.stroke();
    c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.arc(px, py, pr - 3, 0, TAU); c.stroke(); c.beginPath(); c.arc(px, py, pr + 28, 0, TAU); c.stroke();
    for (let i = 0; i < 12; i++) { const an = i * TAU / 12, bx = px + Math.cos(an) * (pr + 12), by = py + Math.sin(an) * (pr + 12); c.fillStyle = rg(c, bx - 2, by - 2, 8, 0, '#fff0b8', 1, '#6b4d18'); c.beginPath(); c.arc(bx, by, 6.5, 0, TAU); c.fill(); }

    // Lanterne qui se balance
    const la = .17 * Math.sin(t * .7 + .6), f = flick(t, 1);
    c.save(); c.translate(470, 64); c.rotate(la);
    c.strokeStyle = '#17110a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 112); c.stroke();
    c.fillStyle = '#2a2116'; poly(c, [[-24, 126], [24, 126], [12, 108], [-12, 108]]); c.fill();
    rr(c, -27, 126, 54, 80, 8); c.fillStyle = rg(c, 0, 170, 60, 0, `rgba(255,235,170,${.95 * f})`, .5, 'rgba(255,150,50,.75)', 1, 'rgba(120,50,10,.6)'); c.fill();
    c.strokeStyle = '#2a2116'; c.lineWidth = 4; rr(c, -27, 126, 54, 80, 8); c.stroke(); c.beginPath(); c.moveTo(-9, 126); c.lineTo(-9, 206); c.moveTo(9, 126); c.lineTo(9, 206); c.stroke();
    c.fillStyle = '#fffbe0'; c.beginPath(); c.ellipse(Math.sin(t * 9) * 1.5, 172, 6, 14 * f, 0, 0, TAU); c.fill();
    c.fillStyle = '#2a2116'; c.fillRect(-30, 204, 60, 10);
    c.restore();
    const lx = 470 - Math.sin(la) * 168, ly = 64 + Math.cos(la) * 168;
    glow(c, lx, ly, 620, '#ff9b3d', .34 * f); glow(c, lx, ly, 130, '#ffe2a8', .85 * f);

    // Table et objets
    c.fillStyle = lg(c, 0, 700, 0, 790, 0, '#6a4526', 1, '#402614'); poly(c, [[110, 705], [1490, 705], [1580, 790], [20, 790]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(110 + i * 230, 705); c.lineTo(20 + i * 260, 790); c.stroke(); }
    c.fillStyle = lg(c, 0, 790, 0, 900, 0, '#2a180c', 1, '#0d0704'); c.fillRect(20, 790, 1560, 130);
    glow(c, lx, 745, 420, '#ffb060', .2 * f);
    // journal de bord
    c.fillStyle = 'rgba(0,0,0,.4)'; poly(c, [[282, 748], [578, 748], [584, 760], [276, 760]]); c.fill();
    c.fillStyle = '#5a2a1c'; poly(c, [[286, 668], [566, 668], [580, 752], [272, 752]]); c.fill();
    c.fillStyle = lg(c, 290, 0, 426, 0, 0, '#efe3c4', 1, '#d8c9a2'); poly(c, [[296, 672], [426, 676], [426, 744], [284, 744]]); c.fill();
    c.fillStyle = lg(c, 426, 0, 570, 0, 0, '#d2c298', .12, '#f3e8cb', 1, '#e6d9b6'); poly(c, [[426, 676], [556, 672], [568, 744], [426, 744]]); c.fill();
    c.strokeStyle = 'rgba(60,40,25,.55)'; c.lineWidth = 1.6;
    for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(304, 686 + i * 9.5); c.lineTo(414 - R(i) * 30, 688 + i * 9.5); c.moveTo(438, 688 + i * 9.5); c.lineTo(550 - R(i + 9) * 40, 686 + i * 9.5); c.stroke(); }
    c.fillStyle = '#a3262e'; c.fillRect(470, 674, 9, 86);
    // cartes en éventail
    for (let k = 0; k < 5; k++) {
      c.save(); c.translate(735, 770); c.transform(1, 0, 0, .62, 0, 0); c.rotate((k - 2) * .27); rr(c, -24, -150, 48, 70, 6);
      c.fillStyle = '#f7f2e4'; c.fill(); c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = k % 2 ? '#b8242c' : '#1b1b22'; c.font = 'bold 26px Georgia'; c.textAlign = 'center'; c.fillText('♠♥♣♦♠'[k], 0, -106); c.restore();
    }
    c.textAlign = 'left';
    // boussole
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(925, 722, 62, 12, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, 865, 595, 985, 715, 0, '#f6dd96', .5, '#9a7227', 1, '#e0bd68'); c.beginPath(); c.arc(925, 655, 60, 0, TAU); c.fill();
    c.fillStyle = rg(c, 915, 640, 60, 0, '#fbf5e2', 1, '#cdbf9b'); c.beginPath(); c.arc(925, 655, 47, 0, TAU); c.fill();
    c.strokeStyle = '#3a2c18'; c.lineWidth = 2; for (let i = 0; i < 16; i++) { const an = i * TAU / 16, r0 = i % 4 ? 40 : 34; c.beginPath(); c.moveTo(925 + Math.cos(an) * r0, 655 + Math.sin(an) * r0); c.lineTo(925 + Math.cos(an) * 45, 655 + Math.sin(an) * 45); c.stroke(); }
    c.save(); c.translate(925, 655); c.rotate(-rock * 22 + Math.sin(t * 1.4) * .22 - .5);
    c.fillStyle = '#c0282e'; poly(c, [[0, -36], [7, 0], [-7, 0]]); c.fill(); c.fillStyle = '#e9e9ee'; poly(c, [[0, 36], [7, 0], [-7, 0]]); c.fill();
    c.fillStyle = '#3a2c18'; c.beginPath(); c.arc(0, 0, 4, 0, TAU); c.fill(); c.restore();
    c.save(); c.globalAlpha = .25; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(908, 636, 22, 10, -.6, 0, TAU); c.fill(); c.restore();
    // coffre
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(1315, 762, 170, 16, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, 0, 545, 0, 640, 0, '#7b4d26', 1, '#4a2b14'); c.beginPath(); c.moveTo(1170, 640); c.quadraticCurveTo(1170, 548, 1315, 546); c.quadraticCurveTo(1460, 548, 1460, 640); c.fill();
    c.fillStyle = lg(c, 0, 640, 0, 760, 0, '#6a4020', 1, '#2e1a0b'); c.fillRect(1170, 640, 290, 120);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(1170, 640 + i * 30); c.lineTo(1460, 640 + i * 30); c.stroke(); }
    [1192, 1300, 1408].forEach(bx => { c.fillStyle = lg(c, bx, 0, bx + 30, 0, 0, '#6d7078', .5, '#b9bcc4', 1, '#4d4f56'); c.fillRect(bx, 560, 30, 200); });
    c.fillStyle = '#16100a'; c.fillRect(1170, 636, 290, 6);
    rr(c, 1288, 628, 54, 58, 8); c.fillStyle = lg(c, 1288, 628, 1342, 686, 0, '#ffe59a', .5, '#c79a2e', 1, '#7a5a14'); c.fill();
    c.fillStyle = '#2a1c06'; c.beginPath(); c.arc(1315, 652, 6, 0, TAU); c.fill(); c.fillRect(1312.5, 652, 5, 16);
    glow(c, 1315, 656, 46, '#fff1b0', .2 + .22 * Math.sin(t * 2.4));
    c.restore();
    dust(c, t, 26, lx - 320, 120, 640, 560, '#ffd9a0');
    vign(c, .85);
  }

  // ================= 3. Temple du crocodile =================
  function glyph(c, k, x, y, s) {
    c.beginPath();
    switch (k % 5) {
      case 0: c.arc(x, y, s, 0, TAU); c.moveTo(x + s * .4, y); c.arc(x, y, s * .4, 0, TAU); break;
      case 1: c.moveTo(x - s, y + s); c.lineTo(x, y - s); c.lineTo(x + s, y + s); c.closePath(); break;
      case 2: for (let i = 0; i < 5; i++) c.lineTo(x - s + i * s / 2, y + (i % 2 ? -s : s) * .7); break;
      case 3: c.ellipse(x, y, s, s * .55, 0, 0, TAU); c.moveTo(x + s * .25, y); c.arc(x, y, s * .25, 0, TAU); break;
      default: c.moveTo(x - s, y - s); c.lineTo(x + s, y - s); c.lineTo(x + s, y + s); c.lineTo(x - s * .3, y + s); c.lineTo(x - s * .3, y); c.lineTo(x + s * .3, y);
    }
    c.stroke();
  }
  function templeA(c, t, st) {
    c.fillStyle = '#12110d'; c.fillRect(0, 0, W, H);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 12; col++) {
      const x = (row % 2 ? -80 : 0) + col * 160, y = row * 90, v = R(row * 31 + col * 7);
      c.fillStyle = `hsl(${40 + v * 16},${10 + v * 9}%,${14 + v * 9}%)`; c.fillRect(x + 2, y + 2, 156, 86);
      c.fillStyle = 'rgba(255,240,200,.05)'; c.fillRect(x + 2, y + 2, 156, 3); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x + 2, y + 82, 156, 6);
      if (v > .72) { c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 30 + v * 60, y + 2); c.lineTo(x + 50 + v * 50, y + 40); c.lineTo(x + 36 + v * 70, y + 86); c.stroke(); }
    }
    for (let i = 0; i < 16; i++) { c.fillStyle = `rgba(${40 + R(i) * 30},${85 + R(i + 1) * 40},40,.2)`; c.beginPath(); c.ellipse(R(i + 3) * W, R(i + 7) * 720, 50 + R(i) * 90, 18 + R(i + 2) * 30, R(i) * 3, 0, TAU); c.fill(); }
    c.fillStyle = lg(c, 0, 720, 0, H, 0, '#2c2920', 1, '#0b0a07'); c.fillRect(0, 720, W, 180);
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 3; for (let i = -10; i < 11; i++) { c.beginPath(); c.moveTo(800 + i * 130, 720); c.lineTo(800 + i * 300, 900); c.stroke(); }
    c.beginPath(); c.moveTo(0, 800); c.lineTo(W, 800); c.stroke();

    // Porte de pierre
    c.fillStyle = lg(c, 600, 0, 1000, 0, 0, '#4a4638', .5, '#5a5646', 1, '#3a372c'); c.beginPath(); c.moveTo(590, 770); c.lineTo(590, 330); c.arc(800, 330, 210, Math.PI, 0); c.lineTo(1010, 770); c.fill();
    c.fillStyle = lg(c, 0, 180, 0, 770, 0, '#2f2c22', 1, '#17150f'); c.beginPath(); c.moveTo(630, 770); c.lineTo(630, 340); c.arc(800, 340, 170, Math.PI, 0); c.lineTo(970, 770); c.fill();
    c.strokeStyle = '#0a0907'; c.lineWidth = 5; c.beginPath(); c.moveTo(800, 172); c.lineTo(800, 770); c.stroke();
    c.strokeStyle = 'rgba(255,205,140,.22)'; c.lineWidth = 5; c.beginPath(); c.arc(800, 380, 68, 0, TAU); c.stroke(); c.beginPath(); c.arc(800, 380, 30, 0, TAU); c.stroke();
    for (let i = 0; i < 12; i++) { const an = i * TAU / 12 + t * .05; c.beginPath(); c.moveTo(800 + Math.cos(an) * 78, 380 + Math.sin(an) * 78); c.lineTo(800 + Math.cos(an) * 100, 380 + Math.sin(an) * 100); c.stroke(); }
    c.lineWidth = 4; for (let i = 0; i < 6; i++) glyph(c, i + 2, 665 + i * 54, 690, 15);
    c.fillStyle = rg(c, 792, 552, 44, 0, '#8a8168', 1, '#3b382c'); c.beginPath(); c.arc(800, 560, 40, 0, TAU); c.fill();
    c.strokeStyle = `rgba(255,190,90,${.5 + .3 * Math.sin(t * 2)})`; c.lineWidth = 3;
    for (let i = 0; i < 4; i++) { const an = i * TAU / 4 + t * .4; c.beginPath(); c.arc(800 + Math.cos(an) * 24, 560 + Math.sin(an) * 24, 5, 0, TAU); c.stroke(); }
    glow(c, 800, 560, 70, '#ffb347', .18 + .12 * Math.sin(t * 2));

    // Gravures
    rr(c, 140, 240, 270, 230, 10); c.fillStyle = lg(c, 140, 240, 410, 470, 0, '#4a4637', 1, '#2e2b21'); c.fill();
    c.strokeStyle = '#191710'; c.lineWidth = 4; rr(c, 152, 252, 246, 206, 6); c.stroke();
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) {
      const gx = 190 + k * 57, gy = 292 + r * 64;
      c.lineWidth = 5; c.strokeStyle = '#14120c'; glyph(c, r * 4 + k + Math.floor(R(r * 4 + k) * 5), gx, gy, 17);
      c.lineWidth = 1.5; c.strokeStyle = 'rgba(255,200,140,.22)'; glyph(c, r * 4 + k + Math.floor(R(r * 4 + k) * 5), gx + 2, gy + 2, 17);
    }

    // Crocodile de pierre
    rr(c, 1190, 300, 240, 250, 22); c.fillStyle = lg(c, 0, 300, 0, 550, 0, '#3b3d2e', 1, '#22241a'); c.fill();
    c.fillStyle = lg(c, 0, 320, 0, 540, 0, '#5a6a45', 1, '#2b3523');
    poly(c, [[1228, 332], [1392, 332], [1414, 420], [1206, 420]]); c.fill(); poly(c, [[1238, 420], [1382, 420], [1362, 534], [1258, 534]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2;
    for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(1262 + k * 24 + (r % 2) * 12, 440 + r * 18, 9, .2, Math.PI - .2); c.stroke(); }
    c.fillStyle = '#e4dcc2';
    for (let k = 0; k < 6; k++) { poly(c, [[1236 + k * 3.4, 428 + k * 17], [1224 + k * 3.4, 436 + k * 17], [1238 + k * 3.4, 444 + k * 17]]); c.fill(); poly(c, [[1384 - k * 3.4, 428 + k * 17], [1396 - k * 3.4, 436 + k * 17], [1382 - k * 3.4, 444 + k * 17]]); c.fill(); }
    c.fillStyle = '#10140c'; c.beginPath(); c.ellipse(1292, 516, 6, 4, 0, 0, TAU); c.ellipse(1328, 516, 6, 4, 0, 0, TAU); c.fill();
    if (st.f.croc) { c.fillStyle = '#0a0c07'; poly(c, [[1240, 424], [1380, 424], [1362, 532], [1258, 532]]); c.fill(); glow(c, 1310, 480, 60, '#3a6a30', .3); }
    const eyes = !!st.f.croc;
    [1262, 1358].forEach(ex => {
      c.fillStyle = '#0c100a'; c.beginPath(); c.ellipse(ex, 378, 26, 19, 0, 0, TAU); c.fill();
      c.fillStyle = eyes ? '#d9ffe6' : '#1c3a28'; c.beginPath(); c.ellipse(ex, 378, 18, 12, 0, 0, TAU); c.fill();
      c.fillStyle = '#04140a'; c.beginPath(); c.ellipse(ex, 378, 3.5, 11, 0, 0, TAU); c.fill();
      if (eyes) { glow(c, ex, 378, 95, '#5dff9a', .95); glow(c, ex, 378, 24, '#ffffff', .8); }
    });

    // Stèle et autel
    c.save(); c.translate(295, 702); c.rotate(-.08);
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(6, 112, 120, 14, 0, 0, TAU); c.fill();
    rr(c, -100, -110, 200, 220, [70, 70, 8, 8]); c.fillStyle = lg(c, -100, -110, 100, 110, 0, '#6a6552', 1, '#34322a'); c.fill();
    c.strokeStyle = '#1b1912'; c.lineWidth = 4; for (let r = 0; r < 4; r++) for (let k = 0; k < 3 + (r % 2); k++) { c.beginPath(); c.moveTo(-62 + k * 30, -50 + r * 36); c.lineTo(-62 + k * 30, -28 + r * 36); c.stroke(); }
    c.lineWidth = 2; c.beginPath(); c.moveTo(40, -108); c.lineTo(56, -40); c.lineTo(38, 20); c.stroke();
    c.restore();
    c.fillStyle = lg(c, 0, 690, 0, 815, 0, '#3e3b2f', 1, '#1c1a14'); c.fillRect(1152, 690, 290, 125);
    rr(c, 1120, 652, 354, 42, 6); c.fillStyle = lg(c, 0, 652, 0, 694, 0, '#75705c', 1, '#48453a'); c.fill();
    { const tilt = st.f.pz_weights ? 0 : Math.sin(t * .8) * .06; c.fillStyle = '#8a7a50'; c.fillRect(1292, 540, 10, 112); c.save(); c.translate(1297, 545); c.rotate(tilt);
      c.fillStyle = '#b8964e'; c.fillRect(-120, -4, 240, 8); [[-110, 1], [110, -1]].forEach(([x]) => { c.strokeStyle = '#8a7a50'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x - 30, 50); c.moveTo(x, 0); c.lineTo(x + 30, 50); c.stroke(); c.fillStyle = '#c9a560'; c.beginPath(); c.ellipse(x, 52, 40, 9, 0, 0, Math.PI * 2); c.fill(); });
      c.fillStyle = '#d9c38a'; c.font = 'bold 30px Segoe UI Emoji, Georgia'; c.textAlign = 'center'; c.fillText('🗿', -110 - Math.sin(tilt) * 10, 46); c.restore(); }
    c.textAlign = 'left';

    // Torches
    [520, 1080].forEach((x, i) => {
      const f = flick(t, i * 3);
      if (i === 0 && st.f.torch) { c.fillStyle = '#4a4034'; poly(c, [[x - 24, 330], [x + 24, 330], [x + 14, 356], [x - 14, 356]]); c.fill(); return; }
      c.fillStyle = '#2a1c10'; poly(c, [[x - 8, 350], [x + 8, 350], [x + 4, 450], [x - 4, 450]]); c.fill();
      c.fillStyle = '#4a4034'; poly(c, [[x - 24, 330], [x + 24, 330], [x + 14, 356], [x - 14, 356]]); c.fill();
      flame(c, t + i * 1.7, x, 328, 1);
      glow(c, x, 300, 460, '#ff7a1f', .3 * f); glow(c, x, 305, 90, '#ffd27a', .75 * f);
    });

    // Lianes, rayon de lumière, lucioles
    for (let i = 0; i < 9; i++) {
      const x = 40 + R(i + 60) * 1520, len = 110 + R(i + 61) * 240, sw = Math.sin(t * .6 + i) * 12;
      c.strokeStyle = '#1c3a1a'; c.lineWidth = 5; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + sw * .4, len * .5, x + sw, len); c.stroke();
      c.fillStyle = '#2c5a26'; for (let k = 1; k < 6; k++) { const q = k / 6; c.beginPath(); c.ellipse(x + sw * q * q + (k % 2 ? 9 : -9), len * q, 10, 5, k % 2 ? .6 : -.6, 0, TAU); c.fill(); }
    }
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .09 + .025 * Math.sin(t * .5); c.fillStyle = lg(c, 250, 0, 520, 800, 0, '#fff1c0', 1, 'rgba(0,0,0,0)');
    poly(c, [[160, 0], [380, 0], [780, 900], [320, 900]]); c.fill(); c.restore();
    dust(c, t, 30, 180, 0, 520, 800, '#fff1c0');
    for (let i = 0; i < 16; i++) {
      const x = W * (.5 + .47 * Math.sin(t * .11 * (1 + R(i)) + i * 2.1)), y = H * (.5 + .4 * Math.sin(t * .13 * (1 + R(i + 5)) + i));
      glow(c, x, y, 14, '#c8ff7a', Math.max(0, Math.sin(t * 1.5 + i * 1.7)) * .9);
    }
    vign(c, .85);
  }

  // ================= 4. Station orbitale =================
  const OCT = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  function stationA(c, t, st) {
    c.fillStyle = lg(c, 0, 0, 0, H, 0, '#1e2838', .6, '#121824', 1, '#090c13'); c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 3;
    for (let x = 100; x < W; x += 200) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    [90, 500, 800].forEach(y => { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); });
    c.fillStyle = 'rgba(160,180,210,.25)'; for (let x = 100; x < W; x += 200) for (const y of [102, 488, 512, 788]) { c.beginPath(); c.arc(x + 12, y, 3, 0, TAU); c.arc(x - 12, y, 3, 0, TAU); c.fill(); }
    const pulse = .6 + .25 * Math.sin(t * 2);
    c.fillStyle = `rgba(110,220,255,${pulse})`; c.fillRect(0, 44, W, 8);
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(c, 0, 50, 0, 260, 0, `rgba(80,200,255,${.16 * pulse})`, 1, 'rgba(0,0,0,0)'); c.fillRect(0, 50, W, 210); c.restore();

    // Baie vitrée : étoiles et Terre
    c.save(); rr(c, 300, 110, 560, 340, 44); c.clip();
    c.fillStyle = '#02030a'; c.fillRect(300, 110, 560, 340);
    glow(c, 420, 190, 240, '#5b3fa8', .22); glow(c, 760, 160, 160, '#27508f', .2);
    for (let i = 0; i < 130; i++) {
      const x = 300 + mod(R(i) * 560 - t * (1.5 + R(i + 3) * 4), 560), y = 110 + R(i + 200) * 340, s = R(i + 5);
      c.fillStyle = `rgba(255,255,255,${.35 + .6 * Math.abs(Math.sin(t * (1 + s * 2) + i))})`; c.fillRect(x, y, 1 + s * 1.8, 1 + s * 1.8);
    }
    const ex = 540, ey = 740, er = 440;
    glow(c, ex, ey, er + 46, '#58b8ff', .55);
    c.save(); c.beginPath(); c.arc(ex, ey, er, 0, TAU); c.clip();
    c.fillStyle = rg(c, ex - 120, ey - 330, 620, 0, '#7fd0ff', .3, '#2f86de', .75, '#0e3f8c', 1, '#062052'); c.fillRect(ex - er, ey - er, er * 2, er * 2);
    for (let i = 0; i < 14; i++) {
      const x = ex - er + mod(R(i + 300) * 1100 + t * 7, 1100) - 100, y = ey - er + 20 + R(i + 310) * 170;
      c.fillStyle = `rgba(${50 + R(i) * 40},${140 + R(i + 1) * 40},${80 + R(i + 2) * 30},.8)`; c.beginPath(); c.ellipse(x, y, 40 + R(i + 320) * 70, 14 + R(i + 330) * 26, R(i) * 2, 0, TAU); c.fill();
    }
    for (let i = 0; i < 18; i++) {
      const x = ex - er + mod(R(i + 400) * 1200 + t * 13, 1200) - 150, y = ey - er + 10 + R(i + 410) * 190;
      c.fillStyle = `rgba(255,255,255,${.25 + R(i) * .35})`; c.beginPath(); c.ellipse(x, y, 60 + R(i + 420) * 90, 6 + R(i + 430) * 10, (R(i) - .5) * .5, 0, TAU); c.fill();
    }
    c.fillStyle = lg(c, 600, 0, 900, 0, 0, 'rgba(0,0,12,0)', 1, 'rgba(0,0,12,.9)'); c.fillRect(ex - er, ey - er, er * 2, er * 2);
    c.restore();
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(130,210,255,.55)'; c.lineWidth = 5; c.beginPath(); c.arc(ex, ey, er + 2, Math.PI * 1.15, Math.PI * 1.75); c.stroke(); c.restore();
    c.save(); c.globalAlpha = .05; c.fillStyle = '#fff'; poly(c, [[380, 110], [470, 110], [330, 450], [300, 450], [300, 300]]); c.fill(); c.restore();
    c.restore();
    c.lineWidth = 24; c.strokeStyle = lg(c, 300, 110, 860, 450, 0, '#6a7689', .5, '#2a3140', 1, '#586478'); rr(c, 300, 110, 560, 340, 44); c.stroke();
    c.lineWidth = 2; c.strokeStyle = 'rgba(0,0,0,.6)'; rr(c, 312, 122, 536, 316, 34); c.stroke();
    for (let i = 0; i < 20; i++) { const u = i / 20 * 2 * (560 + 340); let bx, by; if (u < 560) { bx = 300 + u; by = 110; } else if (u < 900) { bx = 860; by = 110 + u - 560; } else if (u < 1460) { bx = 860 - (u - 900); by = 450; } else { bx = 300; by = 450 - (u - 1460); } if ((bx === 300 || bx === 860) && (by < 150 || by > 410)) continue; if ((by === 110 || by === 450) && (bx < 340 || bx > 820)) continue; c.fillStyle = '#9aa6b8'; c.beginPath(); c.arc(bx, by, 4, 0, TAU); c.fill(); }

    // Balise lumineuse
    rr(c, 912, 166, 96, 98, 14); c.fillStyle = lg(c, 0, 166, 0, 264, 0, '#2c3546', 1, '#151a25'); c.fill(); c.strokeStyle = '#0a0d13'; c.lineWidth = 3; c.stroke();
    c.fillStyle = st.morse ? rg(c, 952, 205, 34, 0, '#fffbe0', .5, '#ffc14a', 1, '#d47a00') : rg(c, 952, 205, 34, 0, '#6a4f22', 1, '#2b1f0c'); c.beginPath(); c.arc(960, 213, 32, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(10,12,18,.8)'; c.lineWidth = 3; c.beginPath(); c.arc(960, 213, 32, 0, TAU); c.moveTo(928, 213); c.lineTo(992, 213); c.moveTo(960, 181); c.lineTo(960, 245); c.stroke();
    if (st.morse) { glow(c, 960, 213, 210, '#ffb030', .9); glow(c, 960, 213, 50, '#fff6d8', .9); }

    // Sas
    rr(c, 1090, 150, 340, 640, 30); c.fillStyle = lg(c, 1090, 0, 1430, 0, 0, '#2c3646', .5, '#3b4658', 1, '#232b38'); c.fill(); c.strokeStyle = '#0b0e14'; c.lineWidth = 4; c.stroke();
    c.save(); rr(c, 1112, 168, 296, 26, 6); c.clip(); c.fillStyle = '#e2b521'; c.fillRect(1112, 168, 296, 26); c.fillStyle = '#15161a';
    for (let i = -2; i < 16; i++) { poly(c, [[1112 + i * 24, 194], [1124 + i * 24, 194], [1150 + i * 24, 168], [1138 + i * 24, 168]]); c.fill(); } c.restore();
    c.fillStyle = rg(c, 1220, 430, 220, 0, '#7c889a', .6, '#465064', 1, '#252c39'); c.beginPath(); c.arc(1260, 480, 152, 0, TAU); c.fill();
    c.strokeStyle = '#141922'; c.lineWidth = 6; c.beginPath(); c.arc(1260, 480, 152, 0, TAU); c.stroke(); c.lineWidth = 3; c.beginPath(); c.arc(1260, 480, 126, 0, TAU); c.stroke();
    for (let i = 0; i < 12; i++) { const an = i * TAU / 12; c.fillStyle = '#1a2029'; c.beginPath(); c.arc(1260 + Math.cos(an) * 139, 480 + Math.sin(an) * 139, 6, 0, TAU); c.fill(); }
    c.save(); c.translate(1260, 480); c.rotate(Math.sin(t * .5) * .25);
    c.strokeStyle = lg(c, -70, -70, 70, 70, 0, '#d2d8e2', 1, '#5c6676'); c.lineWidth = 13; c.beginPath(); c.arc(0, 0, 64, 0, TAU); c.stroke();
    c.lineWidth = 9; for (let i = 0; i < 5; i++) { const an = i * TAU / 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(an) * 64, Math.sin(an) * 64); c.stroke(); }
    c.fillStyle = '#8f99a8'; c.beginPath(); c.arc(0, 0, 16, 0, TAU); c.fill(); c.restore();
    const al = .5 + .5 * Math.sin(t * 5);
    c.fillStyle = `rgb(${150 + 105 * al},30,30)`; c.beginPath(); c.arc(1260, 250, 13, 0, TAU); c.fill(); glow(c, 1260, 250, 80, '#ff3030', .5 * al);
    rr(c, 1200, 680, 120, 50, 8); c.fillStyle = '#05080c'; c.fill();
    c.fillStyle = `rgba(255,70,70,${.6 + .4 * al})`; c.font = 'bold 26px Consolas, monospace'; c.textAlign = 'center'; c.fillStyle = st.f.power ? '#6dff9a' : c.fillStyle; c.fillText(st.f.power ? 'READY' : 'LOCK', 1260, 714); c.textAlign = 'left';

    // Console : terminal, voyants, hologramme, clavier
    c.fillStyle = lg(c, 0, 520, 0, 720, 0, '#323d50', 1, '#161c28'); poly(c, [[270, 520], [890, 520], [930, 720], [230, 720]]); c.fill();
    c.fillStyle = lg(c, 0, 720, 0, 900, 0, '#121722', 1, '#06080c'); c.fillRect(230, 720, 700, 180);
    c.strokeStyle = 'rgba(110,220,255,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(230, 720); c.lineTo(930, 720); c.stroke();
    rr(c, 288, 542, 234, 162, 12); c.fillStyle = '#0a0e14'; c.fill();
    c.save(); rr(c, 296, 550, 218, 146, 8); c.clip(); c.fillStyle = '#03170e'; c.fillRect(296, 550, 218, 146);
    const sc = Math.floor(t * 2.2);
    for (let r = 0; r < 10; r++) { c.fillStyle = `rgba(90,255,160,${.5 + .4 * R(r + sc)})`; c.fillRect(306, 560 + r * 13.5, 30 + R(r + sc + 7) * 160, 6); }
    if (Math.sin(t * 6) > 0) { c.fillStyle = '#7dffb0'; c.fillRect(306, 560 + 10 * 13.5 - 13.5, 9, 7); }
    c.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 550; y < 700; y += 4) c.fillRect(296, y, 218, 1.5);
    c.fillStyle = `rgba(120,255,180,${.04 + .03 * Math.sin(t * 40)})`; c.fillRect(296, 550 + mod(t * 60, 146), 218, 14);
    c.restore(); glow(c, 405, 622, 190, '#30ff90', .1);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) {
      const i = r * 5 + k, on = Math.sin(t * (1 + R(i) * 3) + i * 2) > .2, col = ['#ff5a5a', '#ffd24a', '#5ad1ff', '#6dff9a'][i % 4];
      rr(c, 548 + k * 28, 622 + r * 28, 20, 16, 4); c.fillStyle = on ? col : '#1c2330'; c.fill(); if (on) glow(c, 558 + k * 28, 630 + r * 28, 16, col, .5);
    }
    c.fillStyle = '#0b0f16'; c.beginPath(); c.ellipse(615, 560, 62, 15, 0, 0, TAU); c.fill();
    c.strokeStyle = `rgba(110,230,255,${.7 + .3 * Math.sin(t * 8)})`; c.lineWidth = 3; c.beginPath(); c.ellipse(615, 558, 48, 10, 0, 0, TAU); c.stroke();
    const hf = (st.f.lights ? .75 : .12) + (st.f.lights ? .2 : .08) * Math.sin(t * 17) * Math.sin(t * 3.1);
    c.save(); c.globalCompositeOperation = 'lighter';
    c.globalAlpha = .1 * hf; c.fillStyle = lg(c, 0, 560, 0, 350, 0, '#7ae8ff', 1, 'rgba(0,0,0,0)'); poly(c, [[570, 558], [660, 558], [712, 350], [518, 350]]); c.fill();
    c.globalAlpha = hf; c.strokeStyle = '#8cf0ff'; c.lineWidth = 2.5;
    const P = OCT.map(([x, y, z]) => { const a = t * .9, x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a); return [615 + x1 * 52, 445 + y * 62 + z1 * 14 + Math.sin(t * 1.3) * 6]; });
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { if ((i ^ j) === 1) continue; c.beginPath(); c.moveTo(P[i][0], P[i][1]); c.lineTo(P[j][0], P[j][1]); c.stroke(); }
    c.fillStyle = '#c8f8ff'; c.font = 'bold 40px Georgia'; c.textAlign = 'center'; c.fillText('?', 615, 460 + Math.sin(t * 1.3) * 6); c.textAlign = 'left';
    c.globalAlpha = .25 * hf; c.fillStyle = '#8cf0ff'; c.fillRect(540, 370 + mod(t * 70, 170), 150, 3);
    c.restore(); glow(c, 615, 450, 130, '#40d8ff', .16 * hf);
    rr(c, 708, 566, 154, 158, 10); c.fillStyle = '#0a0e15'; c.fill(); c.strokeStyle = '#2b3546'; c.lineWidth = 2; c.stroke();
    rr(c, 720, 576, 130, 24, 4); c.fillStyle = '#03170e'; c.fill(); c.fillStyle = '#6dff9a'; c.font = '18px Consolas, monospace'; c.fillText('> ' + '_ _ _ _'.slice(0, 1 + (Math.floor(t * 1.5) % 4) * 2), 728, 594);
    const hk = Math.floor(t * 2.5) % 12;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
      const i = r * 3 + k; rr(c, 722 + k * 44, 608 + r * 28, 38, 22, 5); c.fillStyle = i === hk ? '#3fd2ff' : '#1d2738'; c.fill();
      if (i === hk) glow(c, 741 + k * 44, 619 + r * 28, 30, '#3fd2ff', .6);
    }

    // Objets en apesanteur
    c.save(); c.translate(1010 + Math.sin(t * .23) * 40, 640 + Math.cos(t * .19) * 50); c.rotate(t * .35);
    c.fillStyle = '#aab3c2'; c.fillRect(-34, -5, 68, 10); c.beginPath(); c.arc(-36, 0, 12, .6, TAU - .6); c.fill(); c.beginPath(); c.arc(36, 0, 10, 0, TAU); c.fill(); c.fillStyle = '#121824'; c.beginPath(); c.arc(36, 0, 5, 0, TAU); c.fill(); c.restore();
    c.save(); c.translate(160 + Math.sin(t * .17) * 50, 330 + Math.cos(t * .21) * 60); c.rotate(-t * .5); c.fillStyle = '#e8c468'; c.fillRect(-24, -3, 48, 6); c.fillStyle = '#333'; c.fillRect(20, -3, 8, 6); c.restore();

    dust(c, t, 36, 0, 0, W, H, '#bfe6ff');
    c.fillStyle = `rgba(255,30,30,${.04 + .06 * Math.max(0, Math.sin(t * 3))})`; c.fillRect(0, 0, W, H);
    vign(c, .8);
  }

  // Lumière UV qui suit la souris quand on tient la lampe
  function uvLamp(c, st) {
    if (st.held !== 'uv' || st.mx == null) return;
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .55;
    c.fillStyle = rg(c, st.mx, st.my, 170, 0, 'rgba(150,70,255,.7)', .6, 'rgba(90,30,200,.25)', 1, 'rgba(0,0,0,0)'); c.beginPath(); c.arc(st.mx, st.my, 170, 0, TAU); c.fill(); c.restore();
  }
  function uvText(c, s, x, y, a) {
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.font = 'bold 44px Georgia'; c.textAlign = 'center'; c.shadowColor = '#c38bff'; c.shadowBlur = 22; c.fillStyle = '#e9d4ff'; c.fillText(s, x, y); c.restore();
  }
  window.Scenes = { classA, shipA, templeA, stationA };
  window.SK = { W, H, TAU, R, mod, lg, rg, glow, vign, rr, poly, flick, dust, flame, glyph, lightning, OCT };
})();

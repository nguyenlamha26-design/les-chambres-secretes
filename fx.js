// Rendu « jeu vidéo » commun à tous les décors : caméra en parallaxe, étalonnage des couleurs,
// halo lumineux (bloom), particules d'ambiance, flou de premier plan, grain et lueur de survol.
(() => {
  'use strict';
  const W = 1600, H = 900, TAU = Math.PI * 2;
  const R = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mod = (a, n) => ((a % n) + n) % n;

  // Ambiance de chaque scénario : teinte, éclaircissement des ombres, intensité du halo, particules
  const THEME = {
    class: { tint: '#ffb070', ta: .14, lift: .10, bloom: .45, p: 'dust', pc: '#ffe2b0', bokeh: '#ffcf8a' },
    ship: { tint: '#ff9a50', ta: .14, lift: .09, bloom: .5, p: 'dust', pc: '#ffd9a0', bokeh: '#ffb060' },
    temple: { tint: '#b8ff9a', ta: .10, lift: .10, bloom: .5, p: 'firefly', pc: '#d8ff7a', bokeh: '#ffb050' },
    station: { tint: '#7ad8ff', ta: .14, lift: .08, bloom: .6, p: 'spark', pc: '#bfe8ff', bokeh: '#5ad1ff' },
    city: { tint: '#9ab8ff', ta: .12, lift: .10, bloom: .5, p: 'snow', pc: '#ffffff', bokeh: '#ffd890' },
    lantern: { tint: '#ffa060', ta: .16, lift: .10, bloom: .6, p: 'ember', pc: '#ffc070', bokeh: '#ff7040' },
    train: { tint: '#ffc080', ta: .12, lift: .10, bloom: .5, p: 'dust', pc: '#ffe6c0', bokeh: '#ffd8a0' },
    halloween: { tint: '#c890ff', ta: .16, lift: .12, bloom: .55, p: 'wisp', pc: '#d8c8ff', bokeh: '#ff9a3a' },
    xmas: { tint: '#ffd0a0', ta: .12, lift: .08, bloom: .55, p: 'snow', pc: '#ffffff', bokeh: '#ffd040' }
  };
  const theme = id => THEME[id] || THEME.class;

  // ---------- Caméra ----------
  const cam = { x: 0, y: 0, s: 1.03 };
  function camera(ctx, t, mx, my, fade) {
    const tx = mx == null ? 0 : -(mx / W - .5) * 16, ty = my == null ? 0 : -(my / H - .5) * 9;
    cam.x += (tx - cam.x) * .06; cam.y += (ty - cam.y) * .06;
    const enter = Math.max(0, 1 - fade / 650);
    cam.s = 1.03 + .004 * Math.sin(t * .35) + .045 * enter * enter;
    const dx = cam.x + Math.sin(t * .23) * 2, dy = cam.y + Math.cos(t * .19) * 1.5;
    ctx.setTransform(cam.s, 0, 0, cam.s, W / 2 + dx - W / 2 * cam.s, H / 2 + dy - H / 2 * cam.s);
    const hs = document.getElementById('hs');
    if (hs) hs.style.transform = `translate(${dx / W * 100}%, ${dy / H * 100}%) scale(${cam.s})`;
  }

  // ---------- Étalonnage (avant l'obscurité des pièces sombres) ----------
  function grade(ctx, id) {
    const th = theme(id);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = th.lift; ctx.fillStyle = '#3a3048'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = th.ta * 2.2; ctx.fillStyle = th.tint; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, H * .42, 80, W / 2, H * .42, 900); g.addColorStop(0, 'rgba(255,240,215,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---------- Halo lumineux ----------
  const small = document.createElement('canvas'); small.width = 320; small.height = 180; const sc = small.getContext('2d');
  const blur = document.createElement('canvas'); blur.width = 320; blur.height = 180; const bc = blur.getContext('2d');
  bc.filter = 'blur(3px)'; const canFilter = bc.filter === 'blur(3px)'; bc.filter = 'none';
  function bloom(ctx, cv, k) {
    if (!canFilter || k <= 0) return;
    sc.globalCompositeOperation = 'copy'; sc.drawImage(cv, 0, 0, 320, 180);
    bc.globalCompositeOperation = 'copy'; bc.filter = 'brightness(.55) contrast(3) saturate(1.4) blur(7px)'; bc.drawImage(small, 0, 0); bc.filter = 'none';
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = k; ctx.drawImage(blur, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---------- Particules d'ambiance et flou de premier plan ----------
  function particles(ctx, t, id) {
    const th = theme(id), px = cam.x * 2.2, py = cam.y * 2.2;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 46; i++) {
      let x, y, r, a;
      const s = R(i + 11), sp = .4 + R(i + 3);
      switch (th.p) {
        case 'snow': x = mod(R(i) * W + Math.sin(t * .6 + i) * 30 + t * 12, W); y = mod(R(i + 1) * H + t * (25 + s * 40), H); r = 1.5 + s * 3; a = .35 + .4 * s; break;
        case 'ember': x = mod(R(i) * W + Math.sin(t * .8 + i) * 40, W); y = mod(R(i + 1) * H - t * (20 + s * 35), H); r = 1.5 + s * 2.5; a = .3 + .6 * Math.abs(Math.sin(t * 2 + i)); break;
        case 'firefly': x = W * (.5 + .48 * Math.sin(t * .09 * sp + i * 2.1)); y = H * (.5 + .42 * Math.sin(t * .11 * sp + i)); r = 2 + s * 2; a = Math.max(0, Math.sin(t * 1.4 + i * 1.7)) ** 3; break;
        case 'spark': x = mod(R(i) * W + t * (8 + s * 20), W); y = mod(R(i + 1) * H + Math.sin(t + i) * 20, H); r = 1 + s * 1.8; a = .2 + .5 * Math.abs(Math.sin(t * 3 + i)); break;
        case 'wisp': x = mod(R(i) * W + Math.sin(t * .3 + i) * 80 + t * 10, W); y = mod(R(i + 1) * H - t * (6 + s * 10), H); r = 2 + s * 3; a = .15 + .35 * Math.abs(Math.sin(t * .8 + i)); break;
        default: x = mod(R(i) * W + t * (4 + s * 8) + Math.sin(t * .4 + i) * 20, W); y = mod(R(i + 1) * H - t * (3 + s * 6), H); r = 1 + s * 2; a = .12 + .3 * Math.abs(Math.sin(t * .7 + i * 3));
      }
      const g = ctx.createRadialGradient(x + px * s, y + py * s, 0, x + px * s, y + py * s, r * 3); g.addColorStop(0, th.pc); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + px * s, y + py * s, r * 3, 0, TAU); ctx.fill();
    }
    for (let i = 0; i < 5; i++) {
      const x = mod(R(i + 50) * W + Math.sin(t * .05 + i) * 120 + px * 4, W + 400) - 200, y = mod(R(i + 51) * H + Math.cos(t * .04 + i) * 80 + py * 4, H + 300) - 150, r = 60 + R(i + 52) * 90;
      const g = ctx.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, th.bokeh); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = .05 + .03 * Math.sin(t * .5 + i); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---------- Grain ----------
  const noise = document.createElement('canvas'); noise.width = noise.height = 128; (() => { const n = noise.getContext('2d'), d = n.createImageData(128, 128); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } n.putImageData(d, 0, 0); })();
  let pat = null;
  function grain(ctx) {
    pat = pat || ctx.createPattern(noise, 'repeat');
    ctx.setTransform(1, 0, 0, 1, Math.random() * 128, Math.random() * 128); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .05; ctx.fillStyle = pat; ctx.fillRect(-128, -128, W + 256, H + 256);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---------- Lueur sur la zone survolée ----------
  function hover(ctx, t, rect) {
    if (!rect) return;
    const [x, y, w, h] = rect, cx = x + w / 2, cy = y + h / 2, pulse = .6 + .4 * Math.sin(t * 4);
    ctx.save(); ctx.setTransform(cam.s, 0, 0, cam.s, W / 2 + cam.x - W / 2 * cam.s, H / 2 + cam.y - H / 2 * cam.s);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * .75); g.addColorStop(0, `rgba(255,220,140,${.16 * pulse})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - w * .3, y - h * .3, w * 1.6, h * 1.6);
    ctx.strokeStyle = `rgba(255,226,150,${.55 * pulse})`; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.stroke(); ctx.setLineDash([]);
    for (let k = 0; k < 4; k++) { const a = t * 1.5 + k * TAU / 4, sx = cx + Math.cos(a) * w * .52, sy = cy + Math.sin(a) * h * .52, s = 6 + 3 * Math.sin(t * 5 + k); ctx.strokeStyle = 'rgba(255,240,190,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy); ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s); ctx.stroke(); }
    ctx.restore();
  }

  window.FX = { camera, grade, bloom, particles, grain, hover, theme, reset() { const hs = document.getElementById('hs'); if (hs) hs.style.transform = ''; } };
})();

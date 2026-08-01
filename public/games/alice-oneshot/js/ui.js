/* ------------------------------------------------------------------
   Greenfingers - immediate mode UI, toasts and particles
   Widgets are drawn and hit-tested in the same call, which keeps the
   panel code short and always in sync with what is on screen.
------------------------------------------------------------------ */
(function () {
  var PAL = AG.PAL, C = AG.C, F = AG.Font, S = AG.SPR;

  var M = { x: -99, y: -99, down: false, click: false, wheel: 0, inside: false };

  function inside(x, y, w, h) {
    return M.x >= x && M.x < x + w && M.y >= y && M.y < y + h;
  }

  function eatClick() { M.click = false; }

  // ------------------------------------------------------------------
  // panels
  // ------------------------------------------------------------------
  function shadowRect(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(29,20,16,0.30)';
    ctx.fillRect(x + 3, y + 4, w, h);
  }

  function panel(ctx, x, y, w, h) {
    shadowRect(ctx, x, y, w, h);
    ctx.fillStyle = PAL['6'];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = PAL['b'];
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.fillStyle = PAL['c'];
    ctx.fillRect(x + 1, y + 1, w - 2, 1);
    ctx.fillStyle = PAL['d'];
    ctx.fillRect(x + 1, y + h - 2, w - 2, 1);
    ctx.fillRect(x + w - 2, y + 1, 1, h - 2);
    // corner nibbles keep the frame from looking like a plain box
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(x + 1, y + 1, 1, 1);
    ctx.fillRect(x + w - 2, y + 1, 1, 1);
    ctx.fillRect(x + 1, y + h - 2, 1, 1);
    ctx.fillRect(x + w - 2, y + h - 2, 1, 1);
  }

  function titledPanel(ctx, x, y, w, h, title) {
    panel(ctx, x, y, w, h);
    ctx.fillStyle = PAL['a'];
    ctx.fillRect(x + 1, y + 1, w - 2, 15);
    ctx.fillStyle = PAL['c'];
    ctx.fillRect(x + 1, y + 1, w - 2, 1);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(x + 1, y + 16, w - 2, 1);
    F.drawCentered(ctx, title, x + w / 2, y + 5, C.ink, 1);
  }

  function closeButton(ctx, x, y) {
    var hot = inside(x, y, 11, 11);
    ctx.fillStyle = hot ? PAL['v'] : PAL['u'];
    ctx.fillRect(x, y, 11, 11);
    ctx.fillStyle = PAL['t'];
    ctx.fillRect(x, y + 10, 11, 1);
    ctx.fillRect(x + 10, y, 1, 11);
    ctx.fillStyle = PAL['c'];
    for (var i = 0; i < 5; i++) {
      ctx.fillRect(x + 3 + i, y + 3 + i, 1, 1);
      ctx.fillRect(x + 7 - i, y + 3 + i, 1, 1);
    }
    if (hot && M.click) { eatClick(); return true; }
    return false;
  }

  // ------------------------------------------------------------------
  // buttons
  // ------------------------------------------------------------------
  function button(ctx, x, y, w, h, label, opt) {
    opt = opt || {};
    var enabled = opt.enabled !== false;
    var hot = enabled && inside(x, y, w, h);
    var pressed = hot && M.down;
    var oy = pressed ? 1 : 0;

    var face = opt.tone === 'go' ? PAL['j'] : (opt.tone === 'coin' ? PAL['B'] : PAL['a']);
    var edge = opt.tone === 'go' ? PAL['g'] : (opt.tone === 'coin' ? PAL['A'] : PAL['e']);
    var lift = opt.tone === 'go' ? PAL['k'] : (opt.tone === 'coin' ? PAL['C'] : PAL['c']);
    var ink = C.ink;

    if (!enabled) { face = PAL['d']; edge = PAL['e']; lift = PAL['a']; ink = PAL['e']; }
    else if (hot) { face = lift; }

    ctx.fillStyle = 'rgba(29,20,16,0.22)';
    ctx.fillRect(x + 1, y + 2, w, h);
    ctx.fillStyle = edge;
    ctx.fillRect(x, y + oy, w, h);
    ctx.fillStyle = face;
    ctx.fillRect(x + 1, y + 1 + oy, w - 2, h - 2);
    ctx.fillStyle = enabled ? lift : PAL['a'];
    ctx.fillRect(x + 1, y + 1 + oy, w - 2, 1);

    if (label) F.drawCentered(ctx, label, x + w / 2, y + oy + Math.round((h - 7) / 2), ink, 1);

    if (opt.icon) {
      ctx.drawImage(opt.icon, Math.round(x + (opt.iconX == null ? 3 : opt.iconX)),
        Math.round(y + oy + (opt.iconY == null ? (h - opt.icon.height) / 2 : opt.iconY)));
    }

    if (hot && M.click) { eatClick(); return true; }
    return false;
  }

  // slim icon-only toggle used in the top bar
  function iconButton(ctx, x, y, w, h, icon) {
    var hot = inside(x, y, w, h);
    ctx.fillStyle = hot ? PAL['c'] : PAL['a'];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x + w - 1, y, 1, h);
    ctx.drawImage(icon, Math.round(x + (w - icon.width) / 2), Math.round(y + (h - icon.height) / 2));
    if (hot && M.click) { eatClick(); return true; }
    return false;
  }

  // ------------------------------------------------------------------
  // scroll helper
  // ------------------------------------------------------------------
  function scrollbar(ctx, x, y, h, offset, contentH, viewH) {
    if (contentH <= viewH) return;
    ctx.fillStyle = PAL['d'];
    ctx.fillRect(x, y, 3, h);
    var th = Math.max(8, Math.round(h * viewH / contentH));
    var ty = y + Math.round((h - th) * (offset / (contentH - viewH)));
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(x, ty, 3, th);
    ctx.fillStyle = PAL['6'];
    ctx.fillRect(x, ty, 1, th);
  }

  // ------------------------------------------------------------------
  // coin readout
  // ------------------------------------------------------------------
  function coins(ctx, x, y, amount, color, scale) {
    scale = scale || 1;
    ctx.drawImage(S.coin, x, y);
    F.draw(ctx, String(amount), x + 10, y + (scale > 1 ? 0 : 0), color || C.ink, scale);
    return 10 + F.width(String(amount), scale);
  }

  // ------------------------------------------------------------------
  // toasts - little floating messages
  // ------------------------------------------------------------------
  var toasts = [];
  function toast(text, x, y, color) {
    toasts.push({ text: text, x: x, y: y, color: color || PAL['C'], life: 0, max: 1.5 });
  }
  function updateToasts(dt) {
    for (var i = toasts.length - 1; i >= 0; i--) {
      var t = toasts[i];
      t.life += dt;
      t.y -= dt * 14;
      if (t.life >= t.max) toasts.splice(i, 1);
    }
  }
  function drawToasts(ctx) {
    for (var i = 0; i < toasts.length; i++) {
      var t = toasts[i];
      var a = t.life > t.max - 0.4 ? (t.max - t.life) / 0.4 : 1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      F.drawCenteredShadow(ctx, t.text, t.x, Math.round(t.y), t.color, 'rgba(29,20,16,0.8)', 1);
      ctx.restore();
    }
  }

  // ------------------------------------------------------------------
  // particles
  // ------------------------------------------------------------------
  var parts = [];
  function particle(o) {
    parts.push({
      x: o.x, y: o.y,
      vx: o.vx || 0, vy: o.vy || 0,
      g: o.g == null ? 60 : o.g,
      life: 0, max: o.max || 0.6,
      color: o.color || PAL['c'],
      size: o.size || 1,
      spin: o.spin || 0,
      sprite: o.sprite || null
    });
  }
  function burst(x, y, n, color, opts) {
    opts = opts || {};
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = (opts.speed || 30) * (0.4 + Math.random() * 0.8);
      particle({
        x: x, y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - (opts.lift || 20),
        g: opts.g == null ? 90 : opts.g,
        max: (opts.max || 0.7) * (0.6 + Math.random() * 0.7),
        color: color,
        size: opts.size || 1
      });
    }
  }
  function updateParticles(dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
      if (p.life >= p.max) parts.splice(i, 1);
    }
  }
  function drawParticles(ctx) {
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var a = 1 - (p.life / p.max);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, a * 1.4));
      if (p.sprite) {
        ctx.drawImage(p.sprite, Math.round(p.x), Math.round(p.y));
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.restore();
    }
  }

  function clearEffects() { toasts.length = 0; parts.length = 0; }

  // ------------------------------------------------------------------
  // tooltip - queued during the frame, drawn last so it sits on top
  // ------------------------------------------------------------------
  var tip = null;
  function tooltip(text, sub) { tip = { text: text, sub: sub || null }; }
  function drawTooltip(ctx) {
    if (!tip) return;
    var lines = [tip.text];
    if (tip.sub) lines.push(tip.sub);
    var w = 0;
    for (var i = 0; i < lines.length; i++) w = Math.max(w, F.width(lines[i], 1));
    w += 8;
    var h = lines.length * 9 + 5;
    var x = Math.min(AG.W - w - 2, M.x + 8);
    var y = M.y - h - 4;
    if (y < 2) y = M.y + 12;
    if (x < 2) x = 2;
    panel(ctx, x, y, w, h);
    F.draw(ctx, lines[0], x + 4, y + 3, C.ink, 1);
    if (lines[1]) F.draw(ctx, lines[1], x + 4, y + 12, PAL['e'], 1);
    tip = null;
  }
  function clearTooltip() { tip = null; }

  AG.UI = {
    mouse: M,
    inside: inside,
    eatClick: eatClick,
    panel: panel,
    titledPanel: titledPanel,
    closeButton: closeButton,
    button: button,
    iconButton: iconButton,
    scrollbar: scrollbar,
    coins: coins,
    toast: toast,
    updateToasts: updateToasts,
    drawToasts: drawToasts,
    particle: particle,
    burst: burst,
    updateParticles: updateParticles,
    drawParticles: drawParticles,
    clearEffects: clearEffects,
    tooltip: tooltip,
    drawTooltip: drawTooltip,
    clearTooltip: clearTooltip
  };
})();

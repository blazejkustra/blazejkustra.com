/* ------------------------------------------------------------------
   Greenfingers - drawing the farm
------------------------------------------------------------------ */
(function () {
  var PAL = AG.PAL, C = AG.C, F = AG.Font, S = AG.SPR, L = AG.L;
  var W = AG.W, H = AG.H;

  var ground = null;
  var groundKey = '';

  // deterministic little random so the grass looks the same every day
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ------------------------------------------------------------------
  // ground: grass, dirt paths, scattered detail. Rebuilt only when a
  // purchase changes it.
  // ------------------------------------------------------------------
  function dirt(ctx, x, y, w, h, r) {
    ctx.fillStyle = PAL['3'];
    ctx.fillRect(x, y, w, h);
    for (var i = 0; i < w * h / 6; i++) {
      var px = x + Math.floor(r() * w);
      var py = y + Math.floor(r() * h);
      ctx.fillStyle = r() < 0.5 ? PAL['4'] : PAL['2'];
      ctx.fillRect(px, py, 1, 1);
    }
    // ragged edges so paths do not look like rectangles
    for (var e = 0; e < w; e += 1) {
      if (r() < 0.35) { ctx.fillStyle = PAL['m']; ctx.fillRect(x + e, y, 1, 1); }
      if (r() < 0.35) { ctx.fillStyle = PAL['m']; ctx.fillRect(x + e, y + h - 1, 1, 1); }
    }
    for (var e2 = 0; e2 < h; e2 += 1) {
      if (r() < 0.35) { ctx.fillStyle = PAL['m']; ctx.fillRect(x, y + e2, 1, 1); }
      if (r() < 0.35) { ctx.fillStyle = PAL['m']; ctx.fillRect(x + w - 1, y + e2, 1, 1); }
    }
  }

  function stones(ctx, x, y, w, h, r) {
    var n = Math.max(3, Math.round(w * h / 90));
    for (var i = 0; i < n; i++) {
      var px = x + 3 + r() * (w - 6);
      var py = y + 3 + r() * (h - 6);
      AG.px.ell(ctx, px, py, 3.2, 2.4, 'J');
      AG.px.ell(ctx, px - 0.4, py - 0.5, 2.6, 1.8, 'K');
      AG.px.ell(ctx, px - 0.8, py - 0.9, 1.6, 1.0, 'L');
    }
  }

  function buildGround(s) {
    var c = AG.cv(W, H);
    var x = c.ctx;
    var r = rng(1337);

    // base grass
    x.fillStyle = PAL['m'];
    x.fillRect(0, 0, W, H);

    // soft mottling
    for (var i = 0; i < 2600; i++) {
      var px = Math.floor(r() * W), py = Math.floor(r() * H);
      var v = r();
      x.fillStyle = v < 0.35 ? PAL['l'] : (v < 0.8 ? PAL['n'] : PAL['o']);
      x.fillRect(px, py, 1 + (r() < 0.25 ? 1 : 0), 1);
    }
    // broader light patches
    for (var b = 0; b < 26; b++) {
      var bx = r() * W, by = r() * H;
      AG.px.ell(x, bx, by, 8 + r() * 14, 4 + r() * 7, r() < 0.5 ? PAL['n'] : PAL['l']);
    }
    for (var b2 = 0; b2 < 2000; b2++) {
      var px2 = Math.floor(r() * W), py2 = Math.floor(r() * H);
      var v2 = r();
      x.fillStyle = v2 < 0.4 ? PAL['m'] : (v2 < 0.85 ? PAL['n'] : PAL['o']);
      x.fillRect(px2, py2, 1, 1);
    }

    // --- dirt paths ------------------------------------------------
    var f = L.field;
    var ringX = f.x - 10, ringY = f.y - 10;
    var ringW = f.cols * f.tile + 20, ringH = f.rows * f.tile + 20;
    dirt(x, ringX, ringY, ringW, 10, r);                      // top
    dirt(x, ringX, ringY + ringH - 10, ringW, 10, r);         // bottom
    dirt(x, ringX, ringY, 10, ringH, r);                      // left
    dirt(x, ringX + ringW - 10, ringY, 10, ringH, r);         // right

    dirt(x, 36, 74, 12, 30, r);              // house steps down
    dirt(x, 36, 96, ringX - 36, 10, r);      // house to field
    dirt(x, ringX + ringW, 56, 348 - (ringX + ringW), 10, r); // field to shop
    dirt(x, 340, 56, 10, 22, r);
    dirt(x, 188, ringY + ringH, 10, 30, r);  // field down to the stall
    dirt(x, 188, 176, 160, 10, r);
    dirt(x, 44, 118, ringX - 44, 9, r);      // field to the pond

    if (s.up.path) {
      stones(x, ringX, ringY, ringW, 10, r);
      stones(x, ringX, ringY + ringH - 10, ringW, 10, r);
      stones(x, ringX, ringY, 10, ringH, r);
      stones(x, ringX + ringW - 10, ringY, 10, ringH, r);
      stones(x, 36, 96, ringX - 36, 10, r);
      stones(x, ringX + ringW, 56, 348 - (ringX + ringW), 10, r);
      stones(x, 188, 176, 160, 10, r);
    }

    // --- scattered detail -----------------------------------------
    var occupied = [
      [L.house.x, L.house.y, L.house.w, L.house.h],
      [L.pond.x, L.pond.y, L.pond.w, L.pond.h],
      [L.shop.x, L.shop.y, L.shop.w, L.shop.h],
      [L.stall.x, L.stall.y, L.stall.w, L.stall.h],
      [f.x - 12, f.y - 12, f.cols * f.tile + 24, f.rows * f.tile + 24]
    ];
    function free(px3, py3) {
      if (py3 < L.hudH + 4 || py3 > L.barY - 10) return false;
      for (var k = 0; k < occupied.length; k++) {
        var o = occupied[k];
        if (px3 > o[0] - 4 && px3 < o[0] + o[2] + 4 && py3 > o[1] - 4 && py3 < o[1] + o[3] + 4) return false;
      }
      return true;
    }
    for (var t = 0; t < 260; t++) {
      var tx = Math.floor(r() * W), ty = Math.floor(r() * H);
      if (!free(tx, ty)) continue;
      var pick = r();
      var spr = pick < 0.45 ? S.tuftA : (pick < 0.78 ? S.tuftB : (pick < 0.9 ? S.daisy : (pick < 0.96 ? S.clover : S.pebble)));
      x.drawImage(spr, tx, ty);
    }

    return c;
  }

  function groundSignature(s) {
    return [s.up.path ? 1 : 0].join(',');
  }

  function ensureGround(s) {
    var k = groundSignature(s);
    if (!ground || k !== groundKey) {
      ground = buildGround(s);
      groundKey = k;
    }
  }
  function invalidate() { ground = null; }

  // ------------------------------------------------------------------
  // wandering animals
  // ------------------------------------------------------------------
  var chickens = [];
  var cows = [];

  function syncHerds(s) {
    while (chickens.length < s.chickens) {
      var y = L.chickenYard;
      chickens.push({
        x: y.x + Math.random() * y.w, y: y.y + Math.random() * y.h,
        tx: 0, ty: 0, wait: Math.random() * 2, frame: 0, flip: false, bob: Math.random() * 6
      });
      chickens[chickens.length - 1].tx = chickens[chickens.length - 1].x;
      chickens[chickens.length - 1].ty = chickens[chickens.length - 1].y;
    }
    while (chickens.length > s.chickens) chickens.pop();

    while (cows.length < s.cows) {
      var p = L.pasture;
      cows.push({
        x: p.x + 10 + Math.random() * (p.w - 30), y: p.y + 10 + Math.random() * (p.h - 20),
        tx: 0, ty: 0, wait: Math.random() * 4, frame: 0, flip: false, bob: Math.random() * 6
      });
      cows[cows.length - 1].tx = cows[cows.length - 1].x;
      cows[cows.length - 1].ty = cows[cows.length - 1].y;
    }
    while (cows.length > s.cows) cows.pop();
  }

  function wander(list, area, speed, dt, pad) {
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var dx = a.tx - a.x, dy = a.ty - a.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1.5) {
        a.wait -= dt;
        if (a.wait <= 0) {
          a.tx = area.x + pad + Math.random() * (area.w - pad * 2);
          a.ty = area.y + pad + Math.random() * (area.h - pad * 2);
          a.wait = 0.6 + Math.random() * 3.5;
        }
      } else {
        var step = speed * dt;
        a.x += (dx / d) * step;
        a.y += (dy / d) * step;
        a.flip = dx < 0;
        a.frame += dt * 6;
      }
      a.bob += dt * 5;
    }
  }

  function updateAnimals(s, dt) {
    syncHerds(s);
    wander(chickens, L.chickenYard, 11, dt, 4);
    wander(cows, L.pasture, 5, dt, 12);
  }

  function drawFlipped(ctx, spr, x, y, flip) {
    if (!flip) { ctx.drawImage(spr, Math.round(x), Math.round(y)); return; }
    ctx.save();
    ctx.translate(Math.round(x) + spr.width, Math.round(y));
    ctx.scale(-1, 1);
    ctx.drawImage(spr, 0, 0);
    ctx.restore();
  }

  // ------------------------------------------------------------------
  // pieces of scenery
  // ------------------------------------------------------------------
  function drawPond(ctx, t) {
    var p = L.pond;
    ctx.drawImage(S.pond, p.x, p.y);
    // shimmer lines drifting across the water
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(p.x + 32, p.y + 22, 24, 12, 0, 0, Math.PI * 2);
    ctx.clip();
    for (var i = 0; i < 5; i++) {
      var yy = p.y + 12 + i * 5;
      var off = Math.sin(t * 0.9 + i * 1.3) * 7;
      ctx.fillStyle = i % 2 ? PAL['r'] : PAL['s'];
      ctx.globalAlpha = 0.55;
      ctx.fillRect(Math.round(p.x + 14 + off), yy, 10 + (i % 3) * 4, 1);
      ctx.globalAlpha = 0.35;
      ctx.fillRect(Math.round(p.x + 32 + off * 0.6), yy + 2, 6, 1);
    }
    ctx.restore();
  }

  function fence(ctx, x, y, w, h) {
    var postC = '7', railC = '8';
    AG.px.R(ctx, x, y + 4, w, 2, railC);
    AG.px.R(ctx, x, y + h - 8, w, 2, railC);
    AG.px.R(ctx, x, y + 4, w, 1, '9');
    for (var px = x; px <= x + w - 3; px += 16) {
      AG.px.R(ctx, px, y, 3, h - 2, postC);
      AG.px.R(ctx, px, y, 1, h - 2, '8');
      AG.px.R(ctx, px, y, 3, 1, '9');
    }
    AG.px.R(ctx, x + w - 3, y, 3, h - 2, postC);
  }

  function fancyFence(ctx, x, y, w, h) {
    AG.px.R(ctx, x, y + 3, w, 2, 'c');
    AG.px.R(ctx, x, y + h - 9, w, 2, 'c');
    AG.px.R(ctx, x, y + 5, w, 1, 'd');
    AG.px.R(ctx, x, y + h - 7, w, 1, 'd');
    for (var px = x; px <= x + w - 3; px += 14) {
      AG.px.R(ctx, px, y - 1, 3, h, 'b');
      AG.px.R(ctx, px + 2, y - 1, 1, h, 'd');
      AG.px.R(ctx, px, y - 2, 3, 1, 'c');
    }
    AG.px.R(ctx, x + w - 3, y - 1, 3, h, 'b');
  }

  function label(ctx, text, cx, y) {
    F.drawCenteredShadow(ctx, text, cx, y, PAL['c'], 'rgba(29,20,16,0.75)', 1);
  }

  // ------------------------------------------------------------------
  // the field
  // ------------------------------------------------------------------
  function plotRect(i) {
    var f = L.field;
    var r = Math.floor(i / f.cols), c = i % f.cols;
    return { x: f.x + c * f.tile, y: f.y + r * f.tile, w: f.tile, h: f.tile };
  }

  function plotAt(mx, my) {
    var f = L.field;
    if (mx < f.x || my < f.y) return -1;
    var c = Math.floor((mx - f.x) / f.tile);
    var r = Math.floor((my - f.y) / f.tile);
    if (c < 0 || c >= f.cols || r < 0 || r >= f.rows) return -1;
    return r * f.cols + c;
  }

  function cropArt(s, p) {
    var crop = AG.CROP_BY_ID[p.crop];
    if (!crop) return null;
    var art = S.crops[p.crop];
    if (p.stage >= crop.days) return art[3];
    if (p.stage === 0) return art[0];
    return (p.stage <= crop.days / 2) ? art[1] : art[2];
  }

  function drawField(ctx, s, t, hoverIdx) {
    var f = L.field;
    for (var r = 0; r < f.rows; r++) {
      for (var c = 0; c < f.cols; c++) {
        var i = r * f.cols + c;
        var p = s.plots[i];
        var px = f.x + c * f.tile, py = f.y + r * f.tile;

        if (!p.open) {
          // untended ground: a touch darker than the lawn, with two weed
          // patterns mirrored about so the block never looks tiled
          ctx.fillStyle = 'rgba(29,20,16,0.17)';
          ctx.fillRect(px, py, f.tile, f.tile);
          var wspr = ((r + c) % 2) ? S.weeds2 : S.weeds;
          if ((r * 3 + c) % 3 === 0) {
            ctx.save();
            ctx.translate(px + f.tile, py);
            ctx.scale(-1, 1);
            ctx.drawImage(wspr, 0, 0);
            ctx.restore();
          } else {
            ctx.drawImage(wspr, px, py);
          }
          continue;
        }

        var soil = s.up.richSoil
          ? (p.wet ? S.soilRichWet : S.soilRich)
          : (p.wet ? S.soilWet : S.soilDry);
        ctx.drawImage(soil, px, py);

        if (p.wet) {
          ctx.fillStyle = PAL['s'];
          ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 2 + i);
          ctx.fillRect(px + 3, py + 4, 1, 1);
          ctx.fillRect(px + 11, py + 9, 1, 1);
          ctx.globalAlpha = 1;
        }

        if (p.crop) {
          var spr = cropArt(s, p);
          var crop = AG.CROP_BY_ID[p.crop];
          var ripe = p.stage >= crop.days;
          var sway = Math.round(Math.sin(t * 1.5 + i * 0.8) * 1.1);
          var oy = py - 6;
          ctx.drawImage(spr, 0, 0, 16, 10, px + sway, oy, 16, 10);
          ctx.drawImage(spr, 0, 10, 16, 6, px, oy + 10, 16, 6);

          if (ripe) {
            var tw = (Math.sin(t * 3 + i * 1.7) + 1) / 2;
            if (tw > 0.72) {
              ctx.fillStyle = PAL['c'];
              ctx.globalAlpha = (tw - 0.72) / 0.28;
              var sx = px + 3 + ((i * 5) % 9);
              var sy = oy + 2 + ((i * 3) % 5);
              ctx.fillRect(sx, sy, 1, 1);
              ctx.fillRect(sx - 1, sy + 1, 3, 1);
              ctx.fillRect(sx, sy + 2, 1, 1);
              ctx.globalAlpha = 1;
            }
          }
        }
      }
    }

    // sprinkler posts at the corners once installed
    if (s.up.sprinkler) {
      var fw = f.cols * f.tile, fh = f.rows * f.tile;
      var pts = [[f.x - 8, f.y - 12], [f.x + fw - 4, f.y - 12],
                 [f.x - 8, f.y + fh - 8], [f.x + fw - 4, f.y + fh - 8]];
      for (var k = 0; k < pts.length; k++) {
        ctx.drawImage(S.sprinkler, pts[k][0], pts[k][1]);
        var ph = t * 2 + k;
        ctx.fillStyle = PAL['s'];
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(ph * 3);
        ctx.fillRect(pts[k][0] + 5 + Math.round(Math.sin(ph) * 4), pts[k][1] - 2, 1, 2);
        ctx.globalAlpha = 1;
      }
    }

    // hover frame
    if (hoverIdx >= 0) {
      var rc = plotRect(hoverIdx);
      ctx.strokeStyle = PAL['c'];
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1;
      ctx.strokeRect(rc.x + 0.5, rc.y + 0.5, rc.w - 1, rc.h - 1);
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAL['c'];
      ctx.fillRect(rc.x, rc.y, 2, 1); ctx.fillRect(rc.x, rc.y, 1, 2);
      ctx.fillRect(rc.x + rc.w - 2, rc.y, 2, 1); ctx.fillRect(rc.x + rc.w - 1, rc.y, 1, 2);
      ctx.fillRect(rc.x, rc.y + rc.h - 1, 2, 1); ctx.fillRect(rc.x, rc.y + rc.h - 2, 1, 2);
      ctx.fillRect(rc.x + rc.w - 2, rc.y + rc.h - 1, 2, 1); ctx.fillRect(rc.x + rc.w - 1, rc.y + rc.h - 2, 1, 2);
    }
  }

  // ------------------------------------------------------------------
  // world
  // ------------------------------------------------------------------
  function drawWorld(ctx, s, t, hover) {
    ensureGround(s);
    ctx.drawImage(ground, 0, 0);

    drawPond(ctx, t);

    // pasture
    if (s.up.barn) {
      var p = L.pasture;
      ctx.fillStyle = 'rgba(116,169,79,0.35)';
      ctx.fillRect(p.x + 2, p.y + 6, p.w - 4, p.h - 12);
      if (s.up.fence) fancyFence(ctx, p.x, p.y, p.w, p.h);
      else fence(ctx, p.x, p.y, p.w, p.h);
    }

    // decor behind buildings
    if (s.up.trees) {
      ctx.drawImage(S.tree, L.treeA.x, L.treeA.y);
      ctx.drawImage(S.tree, L.treeB.x, L.treeB.y);
    }

    // buildings
    var bob = function (key) { return hover.building === key ? -1 : 0; };
    ctx.drawImage(S.house, L.house.x, L.house.y + bob('house'));
    label(ctx, 'Home', L.house.x + 30, L.house.y + 58);

    ctx.drawImage(S.shop, L.shop.x, L.shop.y + bob('shop'));
    label(ctx, 'Shop', L.shop.x + 32, L.shop.y + 56);

    if (s.up.coop) {
      ctx.drawImage(S.coop, L.coop.x, L.coop.y + bob('coop'));
      label(ctx, 'Coop', L.coop.x + 28, L.coop.y + 42);
      if (s.ready.egg > 0) bubble(ctx, L.coop.x + 46, L.coop.y + 4, S.icons.egg, t, s.ready.egg);
    }
    if (s.up.barn) {
      ctx.drawImage(S.barn, L.barn.x, L.barn.y + bob('barn'));
      label(ctx, 'Barn', L.barn.x + 35, L.barn.y + 50);
      if (s.ready.milk > 0) bubble(ctx, L.barn.x + 56, L.barn.y + 2, S.icons.milk, t, s.ready.milk);
    }

    // decor in front
    if (s.up.flowers) {
      ctx.drawImage(S.flowers, L.flowerA.x, L.flowerA.y);
      ctx.drawImage(S.flowers, L.flowerB.x, L.flowerB.y);
    }
    if (s.up.mailbox) ctx.drawImage(S.mailbox, L.mailbox.x, L.mailbox.y);
    if (s.up.lamp) {
      ctx.drawImage(S.lamp, L.lamp.x, L.lamp.y);
      ctx.fillStyle = PAL['C'];
      ctx.globalAlpha = 0.10 + 0.03 * Math.sin(t * 2);
      ctx.beginPath();
      ctx.ellipse(L.lamp.x + 7, L.lamp.y + 8, 11, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (s.up.scarecrow) ctx.drawImage(S.scarecrow, L.scarecrow.x, L.scarecrow.y);

    drawField(ctx, s, t, hover.plot);

    // cows, then chickens (both in front of the field rows they stand near)
    for (var i = 0; i < cows.length; i++) {
      var cw = cows[i];
      var moving = Math.abs(cw.tx - cw.x) + Math.abs(cw.ty - cw.y) > 2;
      drawFlipped(ctx, S.cow[moving ? (Math.floor(cw.frame) % 2) : 0],
        cw.x - 9, cw.y - 12 + (moving ? Math.round(Math.sin(cw.bob) * 0.5) : 0), cw.flip);
    }
    for (var j = 0; j < chickens.length; j++) {
      var ch = chickens[j];
      var mv = Math.abs(ch.tx - ch.x) + Math.abs(ch.ty - ch.y) > 2;
      drawFlipped(ctx, S.chicken[mv ? (Math.floor(ch.frame) % 2) : 0],
        ch.x - 5, ch.y - 10 + (mv ? Math.round(Math.sin(ch.bob) * 0.6) : 0), ch.flip);
    }

    // stall and the produce crate beside it
    ctx.drawImage(S.stall, L.stall.x, L.stall.y + bob('stall'));
    label(ctx, 'Stall', L.stall.x + 39, L.stall.y + 50);

    var count = AG.State.produceCount(s);
    if (count > 0) {
      ctx.drawImage(S.crate, L.crate.x, L.crate.y);
      var ids = Object.keys(s.produce).filter(function (k) { return s.produce[k] > 0; });
      for (var q = 0; q < Math.min(3, ids.length); q++) {
        var ic = S.icons[ids[q]];
        if (ic) ctx.drawImage(ic, 0, 0, 12, 12, L.crate.x + 1 + q * 5, L.crate.y - 5 + (q % 2) * 2, 12, 12);
      }
      F.drawCenteredShadow(ctx, String(count), L.crate.x + 9, L.crate.y + 16, PAL['c'], 'rgba(29,20,16,0.8)', 1);
    }

    // smoke from the chimney
    smoke(ctx, L.house.x + 42, L.house.y + 2, t);
  }

  var puffs = [];
  function smoke(ctx, x, y, t) {
    if (puffs.length < 7 && Math.random() < 0.06) {
      puffs.push({ x: x, y: y, t: 0, drift: (Math.random() - 0.5) * 6, size: 1 + Math.random() * 2 });
    }
    for (var i = puffs.length - 1; i >= 0; i--) {
      var p = puffs[i];
      p.t += 1 / 60;
      if (p.t > 3.2) { puffs.splice(i, 1); continue; }
      var a = 1 - p.t / 3.2;
      ctx.save();
      ctx.globalAlpha = a * 0.4;
      ctx.fillStyle = PAL['L'];
      var sz = p.size + p.t * 2;
      ctx.beginPath();
      ctx.ellipse(p.x + p.drift * p.t + Math.sin(p.t * 2) * 2, p.y - p.t * 11, sz, sz * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function bubble(ctx, x, y, icon, t, count) {
    var by = y + Math.round(Math.sin(t * 3) * 1.5);
    AG.UI.panel(ctx, x - 9, by - 2, 18, 18);
    AG.px.ell(ctx, x, by + 7, 7, 7, 'd');
    ctx.drawImage(icon, x - 6, by + 1);
    ctx.fillStyle = PAL['b'];
    ctx.fillRect(x - 2, by + 16, 4, 2);
    ctx.fillRect(x - 1, by + 18, 2, 1);
    if (count > 1) {
      F.drawShadow(ctx, String(count), x + 6, by + 10, PAL['c'], 'rgba(29,20,16,0.85)', 1);
    }
  }

  // ------------------------------------------------------------------
  // HUD
  // ------------------------------------------------------------------
  function drawHUD(ctx, s, t, g) {
    // top bar
    ctx.fillStyle = PAL['a'];
    ctx.fillRect(0, 0, W, L.hudH);
    ctx.fillStyle = PAL['c'];
    ctx.fillRect(0, 0, W, 1);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(0, L.hudH - 1, W, 1);
    ctx.fillStyle = PAL['d'];
    ctx.fillRect(0, L.hudH - 2, W, 1);

    ctx.drawImage(S.coin, 5, 4);
    F.draw(ctx, String(s.coins), 16, 4, C.ink, 1);

    F.drawCentered(ctx, 'Day ' + s.day, W / 2, 4, C.ink, 1);

    var val = AG.State.produceValue(s);
    if (val > 0) {
      var txt = 'Stall: ' + val;
      F.drawRight(ctx, txt, 358, 4, PAL['e'], 1);
    }

    if (AG.UI.iconButton(ctx, 383, 3, 14, 11, AG.Audio.isMuted() ? S.speakerOff : S.speakerOn)) {
      g.toggleMute();
    }
    if (AG.UI.inside(383, 3, 14, 11)) AG.UI.tooltip(AG.Audio.isMuted() ? 'Sound off (M)' : 'Sound on (M)');

    // bottom bar
    var by = L.barY;
    ctx.fillStyle = PAL['a'];
    ctx.fillRect(0, by, W, L.barH);
    ctx.fillStyle = PAL['c'];
    ctx.fillRect(0, by, W, 1);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(0, by + 1, W, 1);

    // seed slots - every crop has a slot from the start, so the bar reads
    // as a row of pockets waiting to be filled
    for (var i = 0; i < AG.CROPS.length; i++) {
      var cr = AG.CROPS[i];
      var open = s.day >= cr.unlock;
      var sx = 4 + i * 22, sy = by + 3;
      var sel = open && s.tool.type === 'seed' && s.tool.crop === cr.id;
      var hot = AG.UI.inside(sx, sy, 20, 20);

      ctx.fillStyle = sel ? PAL['C'] : (!open ? PAL['d'] : (hot ? PAL['c'] : PAL['b']));
      ctx.fillRect(sx, sy, 20, 20);
      ctx.fillStyle = sel ? PAL['A'] : PAL['e'];
      ctx.fillRect(sx, sy, 20, 1); ctx.fillRect(sx, sy + 19, 20, 1);
      ctx.fillRect(sx, sy, 1, 20); ctx.fillRect(sx + 19, sy, 1, 20);

      ctx.save();
      if (!open) ctx.globalAlpha = 0.35;
      ctx.drawImage(S.seedbags[cr.id], sx + 4, sy + 1);
      ctx.restore();

      F.draw(ctx, String(i + 1), sx + 3, sy + 12, PAL['d'], 1);
      if (open) {
        var n = s.seeds[cr.id] || 0;
        F.drawRight(ctx, String(n), sx + 17, sy + 12, n > 0 ? C.ink : PAL['u'], 1);
      }

      if (hot) {
        if (open) {
          var n2 = s.seeds[cr.id] || 0;
          AG.UI.tooltip(cr.name + ' seeds  (' + (i + 1) + ')',
            n2 > 0 ? n2 + ' in the bag' : 'none left - buy at the shop');
          if (AG.UI.mouse.click) { AG.UI.eatClick(); g.selectSeed(cr.id); }
        } else {
          AG.UI.tooltip(cr.name + ' seeds', 'the shop gets these on day ' + cr.unlock);
          if (AG.UI.mouse.click) AG.UI.eatClick();
        }
      }
    }

    // watering can slot
    var cx = 4 + 6 * 22 + 4, cy = by + 3;
    var canSel = s.tool.type === 'can';
    var canHot = AG.UI.inside(cx, cy, 24, 20);
    ctx.fillStyle = canSel ? PAL['s'] : (canHot ? PAL['c'] : PAL['b']);
    ctx.fillRect(cx, cy, 24, 20);
    ctx.fillStyle = canSel ? PAL['q'] : PAL['e'];
    ctx.fillRect(cx, cy, 24, 1); ctx.fillRect(cx, cy + 19, 24, 1);
    ctx.fillRect(cx, cy, 1, 20); ctx.fillRect(cx + 23, cy, 1, 20);
    ctx.drawImage(S.can, cx + 5, cy + 5);
    F.draw(ctx, 'Q', cx + 2, cy - 1, PAL['e'], 1);
    if (canHot) {
      AG.UI.tooltip('Watering can  (Q)', s.up.sprinkler ? 'the sprinklers do this for you' : 'refill free at the pond (R)');
      if (AG.UI.mouse.click) { AG.UI.eatClick(); g.selectCan(); }
    }

    // water gauge, with the reading printed inside so nothing can spill
    // into the buttons
    var gx = cx + 28, gy = by + 6, gw = 70;
    if (s.up.sprinkler) {
      F.draw(ctx, 'Sprinklers on', gx, gy + 1, PAL['g'], 1);
    } else {
      var cap = AG.State.canCapacity(s);
      ctx.fillStyle = PAL['e'];
      ctx.fillRect(gx, gy, gw, 11);
      ctx.fillStyle = PAL['1'];
      ctx.fillRect(gx + 1, gy + 1, gw - 2, 9);
      var fillw = Math.round((gw - 2) * (s.can.water / cap));
      ctx.fillStyle = PAL['q'];
      ctx.fillRect(gx + 1, gy + 1, fillw, 9);
      ctx.fillStyle = PAL['s'];
      ctx.fillRect(gx + 1, gy + 1, fillw, 1);
      F.drawCenteredShadow(ctx, s.can.water + ' / ' + cap, gx + gw / 2, gy + 2,
        PAL['c'], 'rgba(29,20,16,0.9)', 1);
    }

    // action buttons
    if (AG.UI.button(ctx, 246, by + 4, 46, 18, 'Shop', {})) g.openShop();
    if (AG.UI.button(ctx, 296, by + 4, 46, 18, 'Stall', {})) g.openMarket();
    if (AG.UI.button(ctx, 346, by + 4, 50, 18, 'Sleep', { tone: 'go' })) g.askSleep();
  }

  // ------------------------------------------------------------------
  // title screen
  // ------------------------------------------------------------------
  var titleBg = null;
  function buildTitle() {
    var c = AG.cv(W, H), x = c.ctx;
    var r = rng(90210);

    // sky
    for (var y = 0; y < 130; y++) {
      var tt = y / 130;
      x.fillStyle = AG.mix(PAL['E'], PAL['F'], tt);
      x.fillRect(0, y, W, 1);
    }
    // sun
    AG.px.ell(x, 322, 40, 20, 20, '#ffe9a8');
    AG.px.ell(x, 322, 40, 15, 15, '#fff6d8');
    // clouds
    function cloud(cx2, cy, sc) {
      x.globalAlpha = 0.9;
      AG.px.ell(x, cx2, cy, 16 * sc, 6 * sc, 'F');
      AG.px.ell(x, cx2 - 12 * sc, cy + 2 * sc, 10 * sc, 4.5 * sc, 'F');
      AG.px.ell(x, cx2 + 13 * sc, cy + 2 * sc, 9 * sc, 4 * sc, 'F');
      AG.px.ell(x, cx2 + 2 * sc, cy - 4 * sc, 9 * sc, 5 * sc, 'M');
      x.globalAlpha = 1;
    }
    cloud(70, 34, 1); cloud(190, 24, 0.75); cloud(300, 62, 0.6);

    // rolling hills
    for (var h1 = 0; h1 < W; h1++) {
      var yy = 118 + Math.sin(h1 * 0.017) * 8 + Math.sin(h1 * 0.006) * 5;
      x.fillStyle = PAL['h'];
      x.fillRect(h1, Math.round(yy), 1, H - yy);
    }
    for (var h2 = 0; h2 < W; h2++) {
      var yy2 = 138 + Math.sin(h2 * 0.013 + 2) * 7;
      x.fillStyle = PAL['i'];
      x.fillRect(h2, Math.round(yy2), 1, H - yy2);
    }
    x.fillStyle = PAL['m'];
    x.fillRect(0, 158, W, H - 158);
    for (var i = 0; i < 2200; i++) {
      var px = Math.floor(r() * W), py = 158 + Math.floor(r() * (H - 158));
      var v = r();
      x.fillStyle = v < 0.35 ? PAL['l'] : (v < 0.8 ? PAL['n'] : PAL['o']);
      x.fillRect(px, py, 1, 1);
    }

    // a farm on the hill
    x.drawImage(S.tree, 100, 94);
    x.drawImage(S.tree, 358, 100);
    x.drawImage(S.house, 296, 96);
    x.drawImage(S.flowers, 268, 146);
    x.drawImage(S.stall, 18, 122);
    x.drawImage(S.pond, 300, 150);

    // two rows of crops along the bottom
    var kinds = ['carrot', 'wheat', 'tomato', 'corn', 'pumpkin', 'melon'];
    for (var row = 0; row < 2; row++) {
      for (var col = 0; col < 9; col++) {
        var sx = 118 + col * 17 + row * 6;
        var sy = 148 + row * 15;
        x.drawImage(S.soilDry, sx, sy);
        x.drawImage(S.crops[kinds[(col + row * 2) % 6]][3], sx, sy - 6);
      }
    }

    for (var t2 = 0; t2 < 90; t2++) {
      var tx = Math.floor(r() * W), ty = 158 + Math.floor(r() * 24);
      if (tx > 110 && tx < 300) continue;
      x.drawImage(r() < 0.5 ? S.tuftA : S.daisy, tx, ty);
    }
    return c;
  }

  function drawTitle(ctx, t, g) {
    if (!titleBg) titleBg = buildTitle();
    ctx.drawImage(titleBg, 0, 0);

    // drifting butterfly
    var bx = 60 + ((t * 18) % 300);
    var byy = 96 + Math.sin(t * 2.4) * 7;
    ctx.fillStyle = PAL['I'];
    ctx.fillRect(Math.round(bx), Math.round(byy), 2, 2);
    ctx.fillStyle = PAL['H'];
    ctx.fillRect(Math.round(bx + 2 + Math.sin(t * 12)), Math.round(byy - 1), 2, 3);

    // title plaque
    var pw = 232, ph = 62, px = (W - pw) / 2, py = 26;
    AG.UI.panel(ctx, px, py, pw, ph);
    ctx.fillStyle = PAL['a'];
    ctx.fillRect(px + 4, py + 4, pw - 8, ph - 8);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(px + 4, py + 4, pw - 8, 1);
    ctx.fillRect(px + 4, py + ph - 5, pw - 8, 1);

    F.drawCenteredShadow(ctx, 'GREENFINGERS', W / 2, py + 12, PAL['g'], PAL['d'], 2);
    F.drawCentered(ctx, 'a small cosy farm', W / 2, py + 34, PAL['e'], 1);
    ctx.drawImage(S.crops.carrot[3], px + 2, py + 22);
    ctx.drawImage(S.crops.pumpkin[3], px + pw - 18, py + 22);
    F.drawCentered(ctx, 'plant  water  sleep  harvest  sell', W / 2, py + 46, PAL['h'], 1);

    var by = 104;
    if (AG.State.hasSave()) {
      if (AG.UI.button(ctx, W / 2 - 54, by, 108, 20, 'Keep farming', { tone: 'go' })) g.continueGame();
      if (AG.UI.button(ctx, W / 2 - 54, by + 25, 108, 18, 'Start a new farm', {})) g.confirmNew();
    } else {
      if (AG.UI.button(ctx, W / 2 - 54, by + 6, 108, 22, 'Start farming', { tone: 'go' })) g.newGame();
    }

    // controls note
    AG.UI.panel(ctx, 6, 182, 388, 39);
    F.drawCentered(ctx, 'Mouse to work the farm.   1-6 pick seeds,  Q watering can,  R refill.', W / 2, 187, C.ink, 1);
    F.drawCentered(ctx, 'E shop,   T stall,   N sleep,   M mute,   Esc closes a panel.', W / 2, 197, C.ink, 1);
    F.drawCentered(ctx, 'Your farm saves itself in this browser, once a day.', W / 2, 208, PAL['e'], 1);

    if (AG.UI.iconButton(ctx, 379, 4, 15, 12, AG.Audio.isMuted() ? S.speakerOff : S.speakerOn)) {
      g.toggleMute();
    }
  }

  // ------------------------------------------------------------------
  // night transition
  // ------------------------------------------------------------------
  var stars = null;
  function drawNight(ctx, alpha, day, phase) {
    if (!stars) {
      stars = [];
      var r = rng(4242);
      for (var i = 0; i < 60; i++) {
        stars.push({ x: Math.floor(r() * W), y: Math.floor(r() * 150), p: r() });
      }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = PAL['N'];
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = alpha;
    for (var i2 = 0; i2 < stars.length; i2++) {
      var st = stars[i2];
      ctx.fillStyle = PAL['c'];
      ctx.globalAlpha = alpha * (0.35 + 0.65 * Math.abs(Math.sin(phase * 2 + st.p * 9)));
      ctx.fillRect(st.x, st.y, 1, 1);
    }
    ctx.globalAlpha = alpha;
    ctx.drawImage(S.moon, 340, 26);
    ctx.restore();
  }

  AG.Render = {
    invalidate: invalidate,
    updateAnimals: updateAnimals,
    drawWorld: drawWorld,
    drawHUD: drawHUD,
    drawTitle: drawTitle,
    drawNight: drawNight,
    plotAt: plotAt,
    plotRect: plotRect,
    cropArt: cropArt,
    label: label
  };
})();

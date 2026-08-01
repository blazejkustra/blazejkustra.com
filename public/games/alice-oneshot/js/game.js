/* ------------------------------------------------------------------
   Greenfingers - rules, shop, stall, tutorial
------------------------------------------------------------------ */
(function () {
  var PAL = AG.PAL, C = AG.C, F = AG.Font, S = AG.SPR, L = AG.L, UI = AG.UI;
  var W = AG.W, H = AG.H;

  var G = {
    s: null,
    scene: 'title',        // 'title' | 'farm'
    panel: null,           // {type, ...}
    trans: null,           // sleep transition
    kb: { active: false, idx: 0 },
    hover: { plot: -1, building: null },
    saveFlash: 0
  };

  // ------------------------------------------------------------------
  // tutorial
  // ------------------------------------------------------------------
  var TUTORIAL = [
    'Pick the carrot seeds down in the bar (or press 1).',
    'Click any bare plot to press a seed into the soil.',
    'Now take the watering can - click it, or press Q.',
    'Water the seeds. Crops only grow on the days you water them.',
    'That is a day\'s work. Click your house, or Sleep, to turn in.',
    'Good morning! Your carrots are ripe - click them to harvest.',
    'Carry the crop to the Stall and sell it.',
    'Coins in hand. Visit the Shop for seeds, land and more.',
    ''
  ];

  function tutorialAdvance(step) {
    if (G.s.tutorial === step) {
      G.s.tutorial++;
      if (G.s.tutorial >= TUTORIAL.length - 1) G.s.tutorial = 99;
    }
  }

  function tutorialText() {
    if (!G.s || G.s.tutorial >= TUTORIAL.length) return null;
    var t = TUTORIAL[G.s.tutorial];
    return t || null;
  }

  // ------------------------------------------------------------------
  // helpers
  // ------------------------------------------------------------------
  function say(text, x, y, color) {
    UI.toast(text, x == null ? W / 2 : x, y == null ? 120 : y, color);
  }

  function nextPlotIndex() {
    var s = G.s;
    for (var i = 0; i < AG.PLOT_ORDER.length; i++) {
      if (!s.plots[AG.PLOT_ORDER[i]].open) return AG.PLOT_ORDER[i];
    }
    return -1;
  }

  function save(flash) {
    if (AG.State.save(G.s) && flash !== false) G.saveFlash = 1.6;
  }

  // ------------------------------------------------------------------
  // actions on the field
  // ------------------------------------------------------------------
  function selectSeed(id) {
    G.s.tool = { type: 'seed', crop: id };
    AG.Audio.play('click');
    tutorialAdvance(0);
  }

  function selectCan() {
    G.s.tool = { type: 'can' };
    AG.Audio.play('click');
    tutorialAdvance(2);
  }

  function buyNextPlot() {
    var s = G.s;
    var idx = nextPlotIndex();
    if (idx < 0) { say('The field is as big as it gets.', W / 2, 120, PAL['c']); return false; }
    var owned = AG.State.openPlots(s);
    var price = AG.plotPrice(owned);
    if (s.coins < price) {
      AG.Audio.play('deny');
      say('Needs ' + price + ' coins', W / 2, 120, PAL['w']);
      return false;
    }
    s.coins -= price;
    s.plots[idx].open = true;
    AG.Audio.play('build');
    var r = AG.Render.plotRect(idx);
    UI.burst(r.x + 8, r.y + 8, 14, PAL['4'], { speed: 40, lift: 26 });
    say('-' + price, r.x + 8, r.y, PAL['w']);
    save();
    return true;
  }

  function plant(i) {
    var s = G.s, p = s.plots[i];
    if (s.tool.type !== 'seed') {
      say('Pick a seed packet first', W / 2, 120, PAL['c']);
      return;
    }
    var id = s.tool.crop;
    if ((s.seeds[id] || 0) <= 0) {
      AG.Audio.play('deny');
      say('No ' + AG.CROP_BY_ID[id].name.toLowerCase() + ' seeds - buy some at the shop', W / 2, 120, PAL['w']);
      return;
    }
    s.seeds[id]--;
    p.crop = id;
    p.stage = 0;
    AG.Audio.play('plant');
    var r = AG.Render.plotRect(i);
    UI.burst(r.x + 8, r.y + 10, 6, PAL['4'], { speed: 22, lift: 14, max: 0.5 });
    tutorialAdvance(1);
  }

  function water(i) {
    var s = G.s, p = s.plots[i];
    if (s.up.sprinkler) {
      say('The sprinklers take care of that now', W / 2, 120, PAL['c']);
      return;
    }
    if (!p.crop) { say('Nothing planted here yet', W / 2, 120, PAL['c']); return; }
    if (p.wet) return;
    if (s.can.water <= 0) {
      AG.Audio.play('deny');
      say('The can is empty - click the pond to refill (R)', W / 2, 120, PAL['w']);
      return;
    }
    s.can.water--;
    p.wet = true;
    AG.Audio.play('water');
    var r = AG.Render.plotRect(i);
    for (var d = 0; d < 8; d++) {
      UI.particle({
        x: r.x + 3 + Math.random() * 10, y: r.y - 4,
        vx: (Math.random() - 0.5) * 12, vy: 20 + Math.random() * 30,
        g: 120, max: 0.45, color: Math.random() < 0.5 ? PAL['s'] : PAL['r']
      });
    }
    tutorialAdvance(3);
  }

  function harvest(i) {
    var s = G.s, p = s.plots[i];
    var crop = AG.CROP_BY_ID[p.crop];
    s.produce[p.crop] = (s.produce[p.crop] || 0) + 1;
    s.totalHarvested++;
    p.crop = null;
    p.stage = 0;
    p.wet = false;
    AG.Audio.play('harvest');
    var r = AG.Render.plotRect(i);
    UI.burst(r.x + 8, r.y + 4, 10, PAL['C'], { speed: 34, lift: 30, max: 0.7 });
    UI.particle({
      x: r.x + 2, y: r.y - 6, vx: 0, vy: -22, g: 26, max: 0.85,
      sprite: S.icons[crop.id]
    });
    say(crop.name + ' picked', r.x + 8, r.y - 8, PAL['c']);
    tutorialAdvance(5);
  }

  function clickPlot(i) {
    var s = G.s, p = s.plots[i];
    if (!p.open) {
      var next = nextPlotIndex();
      if (i === next) buyNextPlot();
      else {
        AG.Audio.play('deny');
        say('The field grows outward - the marked plot is next', W / 2, 120, PAL['c']);
      }
      return;
    }
    if (p.crop) {
      var crop = AG.CROP_BY_ID[p.crop];
      if (p.stage >= crop.days) { harvest(i); return; }
      if (s.tool.type === 'can') { water(i); return; }
      say(crop.name + ' is still growing', AG.Render.plotRect(i).x + 8,
        AG.Render.plotRect(i).y - 6, PAL['c']);
      return;
    }
    if (s.tool.type === 'can') { water(i); return; }
    plant(i);
  }

  function refillCan() {
    var s = G.s;
    if (s.up.sprinkler) { say('The sprinklers keep everything watered', W / 2, 120, PAL['c']); return; }
    var cap = AG.State.canCapacity(s);
    if (s.can.water >= cap) { say('The can is already full', L.pond.x + 32, L.pond.y, PAL['c']); return; }
    s.can.water = cap;
    AG.Audio.play('refill');
    for (var d = 0; d < 14; d++) {
      UI.particle({
        x: L.pond.x + 24 + Math.random() * 16, y: L.pond.y + 18,
        vx: (Math.random() - 0.5) * 30, vy: -20 - Math.random() * 30,
        g: 120, max: 0.6, color: Math.random() < 0.5 ? PAL['s'] : PAL['r']
      });
    }
    say('Can filled', L.pond.x + 32, L.pond.y + 4, PAL['s']);
  }

  function collect(kind) {
    var s = G.s;
    var n = s.ready[kind];
    if (!n) {
      say(kind === 'egg' ? 'No eggs today - come back tomorrow' : 'No milk today - come back tomorrow',
        W / 2, 120, PAL['c']);
      return;
    }
    s.ready[kind] = 0;
    s.produce[kind] = (s.produce[kind] || 0) + n;
    AG.Audio.play('animal');
    var src = kind === 'egg' ? L.coop : L.barn;
    UI.burst(src.x + 28, src.y + 16, 10, PAL['M'], { speed: 30, lift: 26 });
    say('+' + n + ' ' + AG.GOODS[kind].name.toLowerCase() + (n > 1 ? 's' : ''),
      src.x + 28, src.y + 4, PAL['c']);
  }

  // ------------------------------------------------------------------
  // shop
  // ------------------------------------------------------------------
  function shopItems(tab) {
    var s = G.s;
    var out = [];

    if (tab === 'seeds') {
      AG.State.unlockedCrops(s).forEach(function (c) {
        out.push({
          id: 'seed:' + c.id,
          name: c.name + ' seeds',
          desc: c.days + (c.days === 1 ? ' day' : ' days') + ', sells for ' + AG.State.sellPrice(s, c.id),
          price: c.seed,
          icon: S.seedbags[c.id],
          repeat: true,
          act: function (n) {
            s.seeds[c.id] = (s.seeds[c.id] || 0) + n;
          }
        });
      });
      AG.CROPS.filter(function (c) { return s.day < c.unlock; }).forEach(function (c) {
        out.push({
          id: 'locked:' + c.id,
          name: c.name + ' seeds',
          desc: 'the shop gets these in on day ' + c.unlock,
          price: c.seed,
          icon: S.seedbags[c.id],
          locked: true
        });
      });

    } else if (tab === 'farm') {
      var owned = AG.State.openPlots(s);
      if (owned < AG.MAX_PLOTS) {
        out.push({
          id: 'plot',
          name: 'A new plot of land',
          desc: owned + ' of ' + AG.MAX_PLOTS + ' plots tilled',
          price: AG.plotPrice(owned),
          icon: S.plotIcon,
          repeat: true,
          buyLabel: 'Buy',
          act: function () { s.plots[nextPlotIndex()].open = true; }
        });
      } else {
        out.push({ id: 'plot', name: 'A new plot of land', desc: 'the whole field is yours', price: 0, icon: S.plotIcon, done: true });
      }

      if (s.can.level < 2) {
        out.push({
          id: 'canII', name: 'Bigger watering can', desc: 'holds 12 instead of 6',
          price: AG.PRICES.canII, icon: S.can,
          act: function () { s.can.level = 2; s.can.water = AG.CAN_SIZES[1]; }
        });
      } else if (s.can.level < 3) {
        out.push({
          id: 'canIII', name: 'Copper watering can', desc: 'holds 24 instead of 12',
          price: AG.PRICES.canIII, icon: S.can,
          act: function () { s.can.level = 3; s.can.water = AG.CAN_SIZES[2]; }
        });
      } else {
        out.push({ id: 'canIII', name: 'Copper watering can', desc: 'the finest can around', price: 0, icon: S.can, done: true });
      }

      out.push({
        id: 'sprinkler', name: 'Sprinkler system', desc: 'waters the field daily',
        price: AG.PRICES.sprinkler, icon: S.sprinkler, done: s.up.sprinkler,
        act: function () { s.up.sprinkler = true; }
      });
      out.push({
        id: 'scarecrow', name: 'Scarecrow', desc: '+5% on all your sales',
        price: AG.PRICES.scarecrow, icon: S.scarecrow, done: s.up.scarecrow,
        act: function () { s.up.scarecrow = true; }
      });
      out.push({
        id: 'richSoil', name: 'Rich soil', desc: '+20% on all your sales',
        price: AG.PRICES.richSoil, icon: S.miniSoil, done: s.up.richSoil,
        act: function () { s.up.richSoil = true; }
      });

    } else if (tab === 'animals') {
      out.push({
        id: 'coop', name: 'Chicken coop', desc: 'a home for the hens',
        price: AG.PRICES.coop, icon: S.miniCoop, done: s.up.coop,
        act: function () { s.up.coop = true; }
      });
      out.push({
        id: 'chicken', name: 'Chicken', desc: s.up.coop
          ? s.chickens + ' of ' + AG.LIMITS.chickens + ' - an egg a day'
          : 'needs a coop first',
        price: AG.PRICES.chicken, icon: S.chicken[0], repeat: true,
        locked: !s.up.coop, done: s.up.coop && s.chickens >= AG.LIMITS.chickens,
        act: function () { s.chickens++; }
      });
      out.push({
        id: 'barn', name: 'Barn', desc: 'a barn and a pasture',
        price: AG.PRICES.barn, icon: S.miniBarn, done: s.up.barn,
        act: function () { s.up.barn = true; }
      });
      out.push({
        id: 'cow', name: 'Cow', desc: s.up.barn
          ? s.cows + ' of ' + AG.LIMITS.cows + ' - a pail of milk'
          : 'needs a barn first',
        price: AG.PRICES.cow, icon: S.cow[0], repeat: true,
        locked: !s.up.barn, done: s.up.barn && s.cows >= AG.LIMITS.cows,
        act: function () { s.cows++; }
      });

    } else {
      out.push({
        id: 'flowers', name: 'Flower beds', desc: 'two cheerful beds',
        price: AG.PRICES.flowers, icon: S.flowers, done: s.up.flowers,
        act: function () { s.up.flowers = true; }
      });
      out.push({
        id: 'mailbox', name: 'Mailbox', desc: 'the farm gets an address',
        price: AG.PRICES.mailbox, icon: S.mailbox, done: s.up.mailbox,
        act: function () { s.up.mailbox = true; }
      });
      out.push({
        id: 'trees', name: 'Shade trees', desc: 'two big leafy ones',
        price: AG.PRICES.trees, icon: S.tree, done: s.up.trees,
        act: function () { s.up.trees = true; }
      });
      out.push({
        id: 'path', name: 'Stone path', desc: 'no more muddy boots',
        price: AG.PRICES.path, icon: S.miniPath, done: s.up.path,
        act: function () { s.up.path = true; AG.Render.invalidate(); }
      });
      out.push({
        id: 'lamp', name: 'Lamp post', desc: 'a warm glow at dusk',
        price: AG.PRICES.lamp, icon: S.lamp, done: s.up.lamp,
        act: function () { s.up.lamp = true; }
      });
      out.push({
        id: 'fence', name: 'White pasture fence', desc: s.up.barn ? 'smart rails for the cows' : 'needs a barn first',
        price: AG.PRICES.fence, icon: S.miniFence, done: s.up.fence, locked: !s.up.barn,
        act: function () { s.up.fence = true; }
      });
    }
    return out;
  }

  function buy(item, n) {
    var s = G.s;
    n = n || 1;
    if (item.locked || item.done || !item.act) { AG.Audio.play('deny'); return; }
    var total = item.price * n;
    if (s.coins < total) {
      AG.Audio.play('deny');
      say('Not enough coins', W / 2, 150, PAL['w']);
      return;
    }
    if (item.id === 'plot') {
      var idx = nextPlotIndex();
      if (idx < 0) return;
    }
    s.coins -= total;
    item.act(n);
    AG.Audio.play(item.id.indexOf('seed:') === 0 ? 'buy' : 'build');
    say('-' + total, W / 2, 150, PAL['w']);
    UI.burst(W / 2, 150, 8, PAL['B'], { speed: 30, lift: 20 });
    save();
  }

  // ------------------------------------------------------------------
  // selling
  // ------------------------------------------------------------------
  function sell(id, n) {
    var s = G.s;
    var have = s.produce[id] || 0;
    n = Math.min(n, have);
    if (n <= 0) return 0;
    var unit = AG.State.sellPrice(s, id);
    var total = unit * n;
    s.produce[id] -= n;
    if (s.produce[id] <= 0) delete s.produce[id];
    s.coins += total;
    s.totalEarned += total;
    AG.Audio.play('sell');
    UI.burst(W / 2, 150, 10, PAL['B'], { speed: 40, lift: 28 });
    say('+' + total, W / 2, 148, PAL['C']);
    tutorialAdvance(6);
    save();
    return total;
  }

  function sellAll() {
    var s = G.s;
    var ids = Object.keys(s.produce);
    var total = 0;
    for (var i = 0; i < ids.length; i++) {
      var have = s.produce[ids[i]] || 0;
      total += AG.State.sellPrice(s, ids[i]) * have;
      delete s.produce[ids[i]];
    }
    if (total <= 0) return;
    s.coins += total;
    s.totalEarned += total;
    AG.Audio.play('sell');
    UI.burst(W / 2, 150, 18, PAL['B'], { speed: 55, lift: 34 });
    say('+' + total, W / 2, 146, PAL['C']);
    tutorialAdvance(6);
    save();
  }

  // ------------------------------------------------------------------
  // sleeping
  // ------------------------------------------------------------------
  function dryPlots() {
    var n = 0;
    for (var i = 0; i < G.s.plots.length; i++) {
      var p = G.s.plots[i];
      if (p.open && p.crop && !p.wet) {
        var crop = AG.CROP_BY_ID[p.crop];
        if (p.stage < crop.days) n++;
      }
    }
    return n;
  }

  // nothing in the ground, nothing in the crate, nothing in the purse
  function destitute(s) {
    if (s.coins >= AG.CROPS[0].seed) return false;
    for (var k in s.seeds) if (s.seeds[k] > 0) return false;
    for (var p in s.produce) if (s.produce[p] > 0) return false;
    if (s.ready.egg > 0 || s.ready.milk > 0) return false;
    for (var i = 0; i < s.plots.length; i++) if (s.plots[i].crop) return false;
    return true;
  }

  function askSleep() {
    if (G.trans) return;
    G.panel = { type: 'sleep' };
    AG.Audio.play('click');
  }

  function beginSleep() {
    G.panel = null;
    G.trans = { t: 0, applied: false };
    AG.Audio.play('sleep');
  }

  function advanceDay() {
    var s = G.s;
    var ripened = 0;
    for (var i = 0; i < s.plots.length; i++) {
      var p = s.plots[i];
      if (!p.open || !p.crop) { if (p.open) p.wet = false; continue; }
      var crop = AG.CROP_BY_ID[p.crop];
      var grew = p.wet || s.up.sprinkler;
      if (grew && p.stage < crop.days) {
        p.stage++;
        if (p.stage >= crop.days) ripened++;
      }
      p.wet = s.up.sprinkler ? true : false;
    }

    var eggs = s.chickens, milk = s.cows;
    s.ready.egg += eggs;
    s.ready.milk += milk;

    s.day++;
    s.can.water = AG.State.canCapacity(s);

    var fresh = AG.CROPS.filter(function (c) { return c.unlock === s.day; });

    // A farm can never dead-end. If you somehow wake with nothing at all,
    // the shopkeeper has left a few seeds on the step.
    var gift = false;
    if (destitute(s)) {
      s.seeds.carrot = (s.seeds.carrot || 0) + 4;
      gift = true;
    }

    tutorialAdvance(4);
    save(false);

    G.panel = {
      type: 'morning',
      ripened: ripened,
      eggs: eggs,
      milk: milk,
      gift: gift,
      fresh: fresh.map(function (c) { return c.name; })
    };
  }

  // ------------------------------------------------------------------
  // hover
  // ------------------------------------------------------------------
  function rectHit(r, mx, my) {
    return mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h;
  }

  function computeHover() {
    var s = G.s;
    var m = UI.mouse;
    G.hover.plot = -1;
    G.hover.building = null;
    if (G.panel || G.trans) return;
    if (G.kb.active) { G.hover.plot = G.kb.idx; return; }
    if (m.y < L.hudH || m.y > L.barY) return;

    var pi = AG.Render.plotAt(m.x, m.y);
    if (pi >= 0) { G.hover.plot = pi; return; }

    var checks = [
      ['house', L.house], ['shop', L.shop], ['stall', L.stall], ['pond', L.pond]
    ];
    if (s.up.coop) checks.push(['coop', L.coop]);
    if (s.up.barn) checks.push(['barn', L.barn]);
    for (var i = 0; i < checks.length; i++) {
      if (rectHit(checks[i][1], m.x, m.y)) { G.hover.building = checks[i][0]; return; }
    }
  }

  function worldClick() {
    var s = G.s, m = UI.mouse;
    if (m.y < L.hudH || m.y > L.barY) return;
    if (G.hover.plot >= 0) { clickPlot(G.hover.plot); return; }
    switch (G.hover.building) {
      case 'house': askSleep(); break;
      case 'shop': openShop(); break;
      case 'stall': openMarket(); break;
      case 'pond': refillCan(); break;
      case 'coop': collect('egg'); break;
      case 'barn': collect('milk'); break;
    }
  }

  function openShop() {
    G.panel = { type: 'shop', tab: 'seeds', scroll: 0 };
    AG.Audio.play('click');
    tutorialAdvance(7);
  }
  function openMarket() {
    G.panel = { type: 'market', scroll: 0 };
    AG.Audio.play('click');
  }
  function closePanel() {
    if (!G.panel) return;
    G.panel = null;
    AG.Audio.play('click');
  }

  // ------------------------------------------------------------------
  // panel drawing
  // ------------------------------------------------------------------
  function priceTag(ctx, x, y, price, afford) {
    ctx.drawImage(S.coin, x, y);
    F.draw(ctx, String(price), x + 10, y, afford ? C.ink : PAL['u'], 1);
    return 10 + F.width(String(price), 1);
  }

  function drawShop(ctx) {
    var s = G.s, p = G.panel;
    var px = 52, py = 22, pw = 296, ph = 174;
    UI.titledPanel(ctx, px, py, pw, ph, 'Village Shop');
    if (UI.closeButton(ctx, px + pw - 14, py + 3)) closePanel();

    ctx.drawImage(S.coin, px + 6, py + 4);
    F.draw(ctx, String(s.coins), px + 16, py + 4, C.ink, 1);

    // tabs
    var tabs = [['seeds', 'Seeds'], ['farm', 'Farm'], ['animals', 'Animals'], ['decor', 'Comforts']];
    var tw = 64;
    for (var i = 0; i < tabs.length; i++) {
      var tx = px + 12 + i * (tw + 4), ty = py + 21;
      var on = p.tab === tabs[i][0];
      var hot = UI.inside(tx, ty, tw, 15);
      ctx.fillStyle = on ? PAL['b'] : (hot ? PAL['a'] : PAL['d']);
      ctx.fillRect(tx, ty, tw, 15);
      ctx.fillStyle = on ? PAL['c'] : PAL['a'];
      ctx.fillRect(tx, ty, tw, 1);
      ctx.fillStyle = PAL['e'];
      ctx.fillRect(tx, ty, 1, 15); ctx.fillRect(tx + tw - 1, ty, 1, 15);
      if (!on) ctx.fillRect(tx, ty + 14, tw, 1);
      F.drawCentered(ctx, tabs[i][1], tx + tw / 2, ty + 4, on ? C.ink : PAL['e'], 1);
      if (hot && UI.mouse.click) {
        UI.eatClick();
        p.tab = tabs[i][0]; p.scroll = 0;
        AG.Audio.play('click');
      }
    }
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(px + 8, py + 36, pw - 16, 1);

    // list
    var items = shopItems(p.tab);
    var listX = px + 8, listY = py + 39;
    var listW = pw - 22, listH = ph - 47;
    var rowH = 28;
    var contentH = items.length * rowH;
    var maxScroll = Math.max(0, contentH - listH);
    if (UI.inside(px, py, pw, ph) && UI.mouse.wheel) {
      p.scroll = Math.max(0, Math.min(maxScroll, p.scroll + UI.mouse.wheel * 18));
    }
    p.scroll = Math.max(0, Math.min(maxScroll, p.scroll));

    ctx.save();
    ctx.beginPath();
    ctx.rect(listX, listY, listW, listH);
    ctx.clip();

    for (var r = 0; r < items.length; r++) {
      var it = items[r];
      var ry = listY + r * rowH - p.scroll;
      if (ry > listY + listH || ry + rowH < listY) continue;

      var hotRow = UI.inside(listX, Math.max(listY, ry), listW, rowH) && UI.mouse.y >= listY && UI.mouse.y < listY + listH;
      ctx.fillStyle = hotRow ? PAL['c'] : (r % 2 ? PAL['b'] : PAL['a']);
      ctx.fillRect(listX, ry, listW, rowH - 2);
      ctx.fillStyle = PAL['d'];
      ctx.fillRect(listX, ry + rowH - 2, listW, 1);

      // icon well
      ctx.fillStyle = PAL['6'];
      ctx.fillRect(listX + 2, ry + 2, 24, 22);
      ctx.fillStyle = PAL['5'];
      ctx.fillRect(listX + 3, ry + 3, 22, 20);
      if (it.icon) {
        var iw = Math.min(it.icon.width, 22), ih = Math.min(it.icon.height, 20);
        ctx.save();
        ctx.beginPath(); ctx.rect(listX + 3, ry + 3, 22, 20); ctx.clip();
        ctx.drawImage(it.icon,
          Math.max(0, Math.round((it.icon.width - 22) / 2)),
          Math.max(0, Math.round((it.icon.height - 20) / 2)),
          iw, ih,
          Math.round(listX + 3 + (22 - iw) / 2), Math.round(ry + 3 + (20 - ih) / 2), iw, ih);
        ctx.restore();
      }

      // work out where the price / buttons begin, then keep the text
      // strictly to the left of it
      var isSeed = it.id.indexOf('seed:') === 0;
      var pwid = F.width(String(it.price), 1) + 10;
      var blockLeft;
      if (it.done || it.locked) blockLeft = listX + listW - 40;
      else if (isSeed) blockLeft = listX + listW - 30 - 28 - pwid - 6;
      else blockLeft = listX + listW - 44 - pwid - 6;

      var tx2 = listX + 31;
      ctx.save();
      ctx.beginPath();
      ctx.rect(tx2, ry, Math.max(20, blockLeft - 4 - tx2), rowH - 2);
      ctx.clip();
      F.draw(ctx, it.name, tx2, ry + 4, it.locked ? PAL['e'] : C.ink, 1);
      F.draw(ctx, it.desc, tx2, ry + 15, PAL['e'], 1);
      ctx.restore();

      if (it.done) {
        F.drawRight(ctx, 'owned', listX + listW - 6, ry + 9, PAL['h'], 1);
      } else if (it.locked) {
        F.drawRight(ctx, 'soon', listX + listW - 6, ry + 9, PAL['e'], 1);
      } else {
        var afford = s.coins >= it.price;
        if (isSeed) {
          var b5 = listX + listW - 30;
          var b1 = b5 - 28;
          if (UI.button(ctx, b1, ry + 5, 26, 17, 'x1', { enabled: afford, tone: 'coin' })) buy(it, 1);
          if (UI.button(ctx, b5, ry + 5, 26, 17, 'x5', { enabled: s.coins >= it.price * 5, tone: 'coin' })) buy(it, 5);
          priceTag(ctx, blockLeft, ry + 9, it.price, afford);
        } else {
          if (UI.button(ctx, listX + listW - 44, ry + 5, 40, 17, 'Buy', { enabled: afford, tone: 'coin' })) buy(it, 1);
          priceTag(ctx, blockLeft, ry + 9, it.price, afford);
        }
      }
    }
    ctx.restore();

    UI.scrollbar(ctx, px + pw - 10, listY, listH, p.scroll, contentH, listH);
    if (UI.inside(px, py, pw, ph) && UI.mouse.click) UI.eatClick();
  }

  function drawMarket(ctx) {
    var s = G.s, p = G.panel;
    var px = 84, pw = 232, py = 30, ph = 162;
    UI.titledPanel(ctx, px, py, pw, ph, 'Market Stall');
    if (UI.closeButton(ctx, px + pw - 14, py + 3)) closePanel();

    ctx.drawImage(S.coin, px + 6, py + 4);
    F.draw(ctx, String(s.coins), px + 16, py + 4, C.ink, 1);

    var ids = Object.keys(s.produce).filter(function (k) { return s.produce[k] > 0; });
    ids.sort(function (a, b) { return AG.ITEM_BASE_PRICE(b) - AG.ITEM_BASE_PRICE(a); });

    var listX = px + 8, listY = py + 21, listW = pw - 22, listH = ph - 52;
    var rowH = 24;
    var contentH = ids.length * rowH;
    var maxScroll = Math.max(0, contentH - listH);
    if (UI.inside(px, py, pw, ph) && UI.mouse.wheel) {
      p.scroll = Math.max(0, Math.min(maxScroll, p.scroll + UI.mouse.wheel * 16));
    }
    p.scroll = Math.max(0, Math.min(maxScroll, p.scroll));

    if (!ids.length) {
      F.drawCentered(ctx, 'Your crate is empty.', px + pw / 2, py + 56, C.ink, 1);
      F.drawCentered(ctx, 'Harvest something and come back.', px + pw / 2, py + 68, PAL['e'], 1);
    }

    ctx.save();
    ctx.beginPath(); ctx.rect(listX, listY, listW, listH); ctx.clip();
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var ry = listY + i * rowH - p.scroll;
      if (ry > listY + listH || ry + rowH < listY) continue;
      var n = s.produce[id];
      var unit = AG.State.sellPrice(s, id);

      ctx.fillStyle = i % 2 ? PAL['b'] : PAL['a'];
      ctx.fillRect(listX, ry, listW, rowH - 2);
      ctx.fillStyle = PAL['d'];
      ctx.fillRect(listX, ry + rowH - 2, listW, 1);

      if (S.icons[id]) ctx.drawImage(S.icons[id], listX + 2, ry + 4);
      F.draw(ctx, AG.ITEM_NAME(id), listX + 17, ry + 3, C.ink, 1);
      F.draw(ctx, 'x' + n + '   ' + unit + ' each', listX + 17, ry + 13, PAL['e'], 1);

      if (UI.button(ctx, listX + listW - 76, ry + 3, 32, 17, 'Sell 1', { tone: 'coin' })) sell(id, 1);
      if (UI.button(ctx, listX + listW - 40, ry + 3, 36, 17, 'All', { tone: 'coin' })) sell(id, n);
    }
    ctx.restore();
    UI.scrollbar(ctx, px + pw - 10, listY, listH, p.scroll, contentH, listH);

    var total = AG.State.produceValue(s);
    ctx.fillStyle = PAL['e'];
    ctx.fillRect(px + 8, py + ph - 28, pw - 16, 1);
    if (UI.button(ctx, px + 8, py + ph - 25, pw - 16, 19,
      total > 0 ? 'Sell everything  (' + total + ')' : 'Nothing to sell',
      { tone: 'go', enabled: total > 0 })) sellAll();

    var mult = AG.State.sellMultiplier(s);
    if (mult > 1) {
      F.drawRight(ctx, '+' + Math.round((mult - 1) * 100) + '% farm bonus', px + pw - 8, py + 8, PAL['h'], 1);
    }
    if (UI.inside(px, py, pw, ph) && UI.mouse.click) UI.eatClick();
  }

  function drawSleepPanel(ctx) {
    var px = 124, pw = 152, py = 76, ph = 74;
    UI.titledPanel(ctx, px, py, pw, ph, 'Turn in for the night?');
    var dry = dryPlots();
    ctx.drawImage(S.moon, px + 8, py + 24);
    if (dry > 0) {
      F.draw(ctx, dry + (dry === 1 ? ' plot is' : ' plots are') + ' still dry.', px + 24, py + 24, C.ink, 1);
      F.draw(ctx, 'They will simply wait for you.', px + 24, py + 34, PAL['e'], 1);
    } else {
      F.draw(ctx, 'Everything is watered.', px + 24, py + 24, C.ink, 1);
      F.draw(ctx, 'Sleep well.', px + 24, py + 34, PAL['e'], 1);
    }
    if (UI.button(ctx, px + 10, py + 48, 62, 19, 'Sleep', { tone: 'go' })) beginSleep();
    if (UI.button(ctx, px + 80, py + 48, 62, 19, 'Not yet', {})) closePanel();
    if (UI.inside(px, py, pw, ph) && UI.mouse.click) UI.eatClick();
  }

  function drawMorningPanel(ctx) {
    var p = G.panel, s = G.s;
    var lines = [];
    if (p.ripened > 0) lines.push(p.ripened + (p.ripened === 1 ? ' crop is' : ' crops are') + ' ripe.');
    if (p.eggs > 0) lines.push(p.eggs + (p.eggs === 1 ? ' egg' : ' eggs') + ' waiting in the coop.');
    if (p.milk > 0) lines.push(p.milk + (p.milk === 1 ? ' pail' : ' pails') + ' of milk in the barn.');
    if (p.fresh.length) lines.push('New at the shop: ' + p.fresh.join(', ') + '.');
    if (p.gift) lines.push('The shopkeeper left you four carrot seeds.');
    if (!lines.length) lines.push('A quiet morning on the farm.');

    var pw = 216, ph = 46 + lines.length * 11;
    var px = (W - pw) / 2, py = 66;
    UI.titledPanel(ctx, px, py, pw, ph, 'Day ' + s.day);
    for (var i = 0; i < lines.length; i++) {
      F.drawCentered(ctx, lines[i], px + pw / 2, py + 24 + i * 11, C.ink, 1);
    }
    if (UI.button(ctx, px + pw / 2 - 40, py + ph - 24, 80, 19, 'Good morning', { tone: 'go' })) {
      closePanel();
    }
    if (UI.inside(px, py, pw, ph) && UI.mouse.click) UI.eatClick();
  }

  function drawNewFarmPanel(ctx) {
    var pw = 208, ph = 78, px = (W - pw) / 2, py = 74;
    UI.titledPanel(ctx, px, py, pw, ph, 'Start a new farm?');
    F.drawCentered(ctx, 'This clears the farm you already have.', px + pw / 2, py + 24, C.ink, 1);
    F.drawCentered(ctx, 'There is no way back.', px + pw / 2, py + 36, PAL['e'], 1);
    if (UI.button(ctx, px + 14, py + 50, 84, 19, 'Start over', { tone: 'go' })) {
      AG.State.wipe();
      newGame();
    }
    if (UI.button(ctx, px + pw - 98, py + 50, 84, 19, 'Keep mine', {})) {
      G.panel = null;
      AG.Audio.play('click');
    }
    if (UI.inside(px, py, pw, ph) && UI.mouse.click) UI.eatClick();
  }

  function drawPanels(ctx) {
    if (!G.panel) return;
    ctx.fillStyle = 'rgba(29,20,16,0.35)';
    ctx.fillRect(0, 0, W, H);
    switch (G.panel.type) {
      case 'shop': drawShop(ctx); break;
      case 'market': drawMarket(ctx); break;
      case 'sleep': drawSleepPanel(ctx); break;
      case 'morning': drawMorningPanel(ctx); break;
      case 'newfarm': drawNewFarmPanel(ctx); break;
    }
    if (UI.mouse.click) UI.eatClick();
  }

  // ------------------------------------------------------------------
  // tutorial ribbon and hover tooltips
  // ------------------------------------------------------------------
  function drawTutorial(ctx) {
    var text = tutorialText();
    if (!text) return;
    var w = F.width(text, 1) + 22;
    var x = Math.round((W - w) / 2), y = 20;
    UI.panel(ctx, x, y, w, 16);
    ctx.fillStyle = PAL['C'];
    var blink = (Math.sin(performance.now() / 240) + 1) / 2;
    ctx.globalAlpha = 0.4 + blink * 0.6;
    ctx.fillRect(x + 5, y + 5, 3, 3);
    ctx.fillRect(x + 6, y + 4, 1, 5);
    ctx.globalAlpha = 1;
    F.draw(ctx, text, x + 12, y + 4, C.ink, 1);
  }

  function hoverTips(ctx) {
    var s = G.s;
    if (G.panel || G.trans) return;
    if (G.hover.plot >= 0) {
      var i = G.hover.plot, p = s.plots[i];
      if (!p.open) {
        var next = nextPlotIndex();
        var price = AG.plotPrice(AG.State.openPlots(s));
        if (i === next) UI.tooltip('Untilled ground', 'clear it for ' + price + ' coins');
        else UI.tooltip('Untilled ground', 'the marked plot comes first');
      } else if (!p.crop) {
        UI.tooltip('Bare soil', s.tool.type === 'seed'
          ? 'click to sow ' + AG.CROP_BY_ID[s.tool.crop].name.toLowerCase()
          : 'pick a seed packet below');
      } else {
        var crop = AG.CROP_BY_ID[p.crop];
        if (p.stage >= crop.days) UI.tooltip(crop.name + ' - ripe!', 'click to harvest  (+' + AG.State.sellPrice(s, crop.id) + ')');
        else UI.tooltip(crop.name + '  ' + p.stage + '/' + crop.days,
          p.wet ? 'watered - it will grow tonight' : (s.up.sprinkler ? 'the sprinklers have it' : 'needs water today'));
      }
      return;
    }
    switch (G.hover.building) {
      case 'house': UI.tooltip('Your house', 'click to sleep  (N)'); break;
      case 'shop': UI.tooltip('Village shop', 'seeds, land and upgrades  (E)'); break;
      case 'stall': UI.tooltip('Market stall', 'sell what you grew  (T)'); break;
      case 'pond': UI.tooltip('The pond', 'refill the watering can  (R)'); break;
      case 'coop': UI.tooltip('Chicken coop', s.ready.egg ? s.ready.egg + ' egg(s) to collect' : 'the hens are resting'); break;
      case 'barn': UI.tooltip('The barn', s.ready.milk ? s.ready.milk + ' pail(s) to collect' : 'nothing to collect yet'); break;
    }
  }

  // ------------------------------------------------------------------
  // keyboard
  // ------------------------------------------------------------------
  function moveCursor(dx, dy) {
    var f = L.field;
    if (!G.kb.active) { G.kb.active = true; return; }
    var r = Math.floor(G.kb.idx / f.cols), c = G.kb.idx % f.cols;
    r = Math.max(0, Math.min(f.rows - 1, r + dy));
    c = Math.max(0, Math.min(f.cols - 1, c + dx));
    G.kb.idx = r * f.cols + c;
  }

  function key(k) {
    if (G.scene === 'title') {
      if (k === 'm' || k === 'M') { toggleMute(); return; }
      if (G.panel) {
        if (k === 'Escape') { G.panel = null; AG.Audio.play('click'); }
        return;
      }
      if (k === 'Enter' || k === ' ') {
        if (AG.State.hasSave()) continueGame(); else newGame();
      }
      return;
    }
    if (G.trans) return;

    if (k === 'Escape') { if (G.panel) closePanel(); return; }
    if (k === 'm' || k === 'M') { toggleMute(); return; }

    if (G.panel) {
      if (k === 'Enter' || k === ' ') {
        if (G.panel.type === 'sleep') beginSleep();
        else if (G.panel.type === 'morning') closePanel();
      }
      return;
    }

    if (k >= '1' && k <= '6') {
      var crops = AG.State.unlockedCrops(G.s);
      var idx = parseInt(k, 10) - 1;
      if (crops[idx]) selectSeed(crops[idx].id);
      return;
    }
    switch (k) {
      case 'q': case 'Q': selectCan(); break;
      case 'r': case 'R': refillCan(); break;
      case 'e': case 'E': openShop(); break;
      case 't': case 'T': openMarket(); break;
      case 'n': case 'N': askSleep(); break;
      case 'ArrowLeft': case 'a': case 'A': moveCursor(-1, 0); break;
      case 'ArrowRight': case 'd': case 'D': moveCursor(1, 0); break;
      case 'ArrowUp': case 'w': case 'W': moveCursor(0, -1); break;
      case 'ArrowDown': case 's': case 'S': moveCursor(0, 1); break;
      case 'Enter': case ' ':
        if (G.kb.active) clickPlot(G.kb.idx);
        break;
    }
  }

  // ------------------------------------------------------------------
  // scene control
  // ------------------------------------------------------------------
  function newGame() {
    G.s = AG.State.newGame();
    G.scene = 'farm';
    G.panel = null;
    G.trans = null;
    G.kb = { active: false, idx: 0 };
    AG.Render.invalidate();
    UI.clearEffects();
    AG.Audio.init();
    AG.Audio.play('wake');
    save(false);
  }

  function continueGame() {
    var s = AG.State.load();
    G.s = s || AG.State.newGame();
    G.scene = 'farm';
    G.panel = null;
    G.trans = null;
    AG.Render.invalidate();
    UI.clearEffects();
    AG.Audio.init();
    AG.Audio.play('wake');
  }

  function confirmNew() {
    G.panel = { type: 'newfarm' };
    AG.Audio.play('click');
  }

  function toggleMute() {
    var m = AG.Audio.toggle();
    AG.State.saveSettings({ muted: m });
  }

  // ------------------------------------------------------------------
  // frame
  // ------------------------------------------------------------------
  function update(dt, t) {
    if (G.scene !== 'farm') return;
    AG.Render.updateAnimals(G.s, dt);
    if (G.saveFlash > 0) G.saveFlash -= dt;

    if (G.trans) {
      G.trans.t += dt;
      if (!G.trans.applied && G.trans.t >= 0.95) {
        G.trans.applied = true;
        advanceDay();
      }
      if (G.trans.t >= 2.0) {
        G.trans = null;
        AG.Audio.play('wake');
      }
    }
    computeHover();

    // clicks on the farm itself, before any widget gets a look in
    if (UI.mouse.click && !G.panel && !G.trans) {
      var m = UI.mouse;
      if (m.y >= L.hudH && m.y <= L.barY) {
        worldClick();
        UI.eatClick();
      }
    }
  }

  function draw(ctx, t) {
    var s = G.s;
    AG.Render.drawWorld(ctx, s, t, G.hover);

    // next plot marker
    var np = nextPlotIndex();
    if (np >= 0 && !G.panel) {
      var r = AG.Render.plotRect(np);
      var a = 0.55 + 0.35 * Math.sin(t * 3);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = PAL['C'];
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;
      ctx.strokeRect(r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3);
      // a little spade mark so it reads as "clear this next"
      ctx.fillStyle = PAL['C'];
      ctx.fillRect(r.x + 7, r.y + 5, 2, 6);
      ctx.fillRect(r.x + 5, r.y + 9, 6, 3);
      ctx.restore();
      if (G.hover.plot === np) {
        var price = AG.plotPrice(AG.State.openPlots(s));
        UI.panel(ctx, r.x - 6, r.y - 14, 30, 12);
        ctx.drawImage(S.coin, r.x - 4, r.y - 12);
        F.draw(ctx, String(price), r.x + 6, r.y - 12, C.ink, 1);
      }
    }

    UI.drawParticles(ctx);
    UI.drawToasts(ctx);
    drawTutorial(ctx);
    AG.Render.drawHUD(ctx, s, t, G);
    hoverTips(ctx);
    drawPanels(ctx);

    if (G.saveFlash > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, G.saveFlash);
      F.drawRight(ctx, 'saved', 396, L.hudH + 3, PAL['c'], 1);
      ctx.restore();
    }

    if (G.trans) {
      var tt = G.trans.t;
      var a2 = tt < 0.95 ? (tt / 0.95) : Math.max(0, 1 - (tt - 0.95) / 1.0);
      AG.Render.drawNight(ctx, Math.min(1, a2) * 0.92, s.day, t);
      if (tt > 0.4 && tt < 1.6) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, a2 * 1.4);
        F.drawCentered(ctx, 'Day ' + s.day, W / 2, 100, PAL['c'], 2);
        ctx.restore();
      }
    }
  }

  G.selectSeed = selectSeed;
  G.selectCan = selectCan;
  G.openShop = openShop;
  G.openMarket = openMarket;
  G.askSleep = askSleep;
  G.closePanel = closePanel;
  G.refillCan = refillCan;
  G.toggleMute = toggleMute;
  G.newGame = newGame;
  G.continueGame = continueGame;
  G.confirmNew = confirmNew;
  G.worldClick = worldClick;
  G.drawPanels = drawPanels;
  G.key = key;
  G.update = update;
  G.draw = draw;
  G.save = save;
  G.nextPlotIndex = nextPlotIndex;

  AG.Game = G;
})();

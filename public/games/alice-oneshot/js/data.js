/* ------------------------------------------------------------------
   Greenfingers - content and tuning
   Longer crops always pay more per day, so every unlock is a real
   step up.  Nothing here can lose you money.
------------------------------------------------------------------ */
(function () {
  AG.W = 400;
  AG.H = 225;

  AG.L = {
    hudH: 16,
    barY: 199,
    barH: 26,

    field: { x: 136, y: 60, cols: 8, rows: 5, tile: 16 },

    house:  { x: 8,   y: 20,  w: 60, h: 58 },
    pond:   { x: 6,   y: 88,  w: 64, h: 42 },
    barn:   { x: 4,   y: 136, w: 70, h: 52 },
    shop:   { x: 320, y: 16,  w: 64, h: 56 },
    coop:   { x: 328, y: 82,  w: 56, h: 44 },
    stall:  { x: 316, y: 140, w: 78, h: 54 },

    pasture: { x: 138, y: 152, w: 124, h: 44 },

    treeA:  { x: 84,  y: 26 },
    treeB:  { x: 276, y: 24 },
    flowerA: { x: 88, y: 80 },
    flowerB: { x: 278, y: 150 },
    chickenYard: { x: 276, y: 92, w: 50, h: 54 },
    lamp:   { x: 112, y: 150 },
    mailbox: { x: 80, y: 172 },
    crate:  { x: 296, y: 166 },
    scarecrow: { x: 100, y: 112 }
  };

  AG.CROPS = [
    { id: 'carrot',  name: 'Carrot',  seed: 8,   days: 1, sell: 16,  unlock: 1,
      blurb: 'Ready overnight. Never not worth planting.' },
    { id: 'wheat',   name: 'Wheat',   seed: 15,  days: 2, sell: 40,  unlock: 2,
      blurb: 'Two days of sun and it turns gold.' },
    { id: 'tomato',  name: 'Tomato',  seed: 30,  days: 3, sell: 90,  unlock: 4,
      blurb: 'Heavy on the vine, heavy in the purse.' },
    { id: 'corn',    name: 'Corn',    seed: 55,  days: 4, sell: 175, unlock: 7,
      blurb: 'Tall, patient, and rather profitable.' },
    { id: 'pumpkin', name: 'Pumpkin', seed: 90,  days: 5, sell: 315, unlock: 10,
      blurb: 'Takes up the whole plot. Worth every day.' },
    { id: 'melon',   name: 'Melon',   seed: 150, days: 7, sell: 640, unlock: 14,
      blurb: 'A week of care for the best price at the stall.' }
  ];

  AG.CROP_BY_ID = {};
  AG.CROPS.forEach(function (c) { AG.CROP_BY_ID[c.id] = c; });

  AG.GOODS = {
    egg:  { id: 'egg',  name: 'Egg',  sell: 30 },
    milk: { id: 'milk', name: 'Milk', sell: 110 }
  };

  AG.ITEM_NAME = function (id) {
    if (AG.CROP_BY_ID[id]) return AG.CROP_BY_ID[id].name;
    if (AG.GOODS[id]) return AG.GOODS[id].name;
    return id;
  };
  AG.ITEM_BASE_PRICE = function (id) {
    if (AG.CROP_BY_ID[id]) return AG.CROP_BY_ID[id].sell;
    if (AG.GOODS[id]) return AG.GOODS[id].sell;
    return 0;
  };

  AG.CAN_SIZES = [6, 12, 24];

  AG.LIMITS = { chickens: 6, cows: 3 };

  AG.PRICES = {
    canII: 200,
    canIII: 600,
    sprinkler: 2500,
    scarecrow: 350,
    richSoil: 1200,
    coop: 500,
    chicken: 150,
    barn: 1800,
    cow: 700,
    flowers: 120,
    trees: 180,
    path: 240,
    mailbox: 90,
    lamp: 260,
    fence: 400
  };

  // Cost of the next plot of land, given how many you already own.
  AG.plotPrice = function (owned) {
    return Math.round(60 * Math.pow(1.16, owned - 9));
  };

  // Plots unlock outward from the top-left corner of the field, so the
  // tilled area grows as a neat block rather than scattered squares.
  AG.PLOT_ORDER = (function () {
    var f = AG.L.field;
    var cells = [];
    for (var r = 0; r < f.rows; r++) {
      for (var c = 0; c < f.cols; c++) cells.push({ r: r, c: c });
    }
    cells.sort(function (a, b) {
      var ka = Math.max(a.r, a.c), kb = Math.max(b.r, b.c);
      if (ka !== kb) return ka - kb;
      if (a.r !== b.r) return a.r - b.r;
      return a.c - b.c;
    });
    return cells.map(function (p) { return p.r * f.cols + p.c; });
  })();

  AG.MAX_PLOTS = AG.PLOT_ORDER.length;
  AG.START_PLOTS = 9;
})();

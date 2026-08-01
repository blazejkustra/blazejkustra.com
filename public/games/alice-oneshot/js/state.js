/* ------------------------------------------------------------------
   Greenfingers - game state and saving
------------------------------------------------------------------ */
(function () {
  var KEY = 'greenfingers.save.v1';
  var SETTINGS_KEY = 'greenfingers.settings.v1';

  function store(key, value) {
    try { window.localStorage.setItem(key, value); return true; }
    catch (e) { return false; }
  }
  function fetchRaw(key) {
    try { return window.localStorage.getItem(key); }
    catch (e) { return null; }
  }
  function drop(key) {
    try { window.localStorage.removeItem(key); } catch (e) {}
  }

  function newGame() {
    var s = {
      version: 1,
      day: 1,
      coins: 40,
      plots: [],
      seeds: { carrot: 6 },
      produce: {},
      can: { level: 1, water: 6 },
      up: {
        sprinkler: false, scarecrow: false, richSoil: false,
        coop: false, barn: false,
        flowers: false, trees: false, path: false,
        mailbox: false, lamp: false, fence: false
      },
      chickens: 0,
      cows: 0,
      ready: { egg: 0, milk: 0 },
      totalEarned: 0,
      totalHarvested: 0,
      tutorial: 0,
      tool: { type: 'seed', crop: 'carrot' }
    };
    for (var i = 0; i < AG.MAX_PLOTS; i++) {
      s.plots.push({ open: false, crop: null, stage: 0, wet: false });
    }
    for (var k = 0; k < AG.START_PLOTS; k++) s.plots[AG.PLOT_ORDER[k]].open = true;
    return s;
  }

  function openPlots(s) {
    var n = 0;
    for (var i = 0; i < s.plots.length; i++) if (s.plots[i].open) n++;
    return n;
  }

  function canCapacity(s) {
    if (s.up.sprinkler) return 99;
    return AG.CAN_SIZES[s.can.level - 1] || AG.CAN_SIZES[0];
  }

  function sellMultiplier(s) {
    var m = 1;
    if (s.up.scarecrow) m += 0.05;
    if (s.up.richSoil) m += 0.20;
    return m;
  }

  function sellPrice(s, id) {
    return Math.round(AG.ITEM_BASE_PRICE(id) * sellMultiplier(s));
  }

  function unlockedCrops(s) {
    return AG.CROPS.filter(function (c) { return s.day >= c.unlock; });
  }

  function produceCount(s) {
    var n = 0;
    for (var k in s.produce) n += s.produce[k];
    return n;
  }

  function produceValue(s) {
    var v = 0;
    for (var k in s.produce) v += s.produce[k] * sellPrice(s, k);
    return v;
  }

  function save(s) {
    if (!s) return false;
    var payload = {
      version: 1,
      day: s.day,
      coins: s.coins,
      plots: s.plots.map(function (p) {
        return [p.open ? 1 : 0, p.crop || '', p.stage, p.wet ? 1 : 0];
      }),
      seeds: s.seeds,
      produce: s.produce,
      can: s.can,
      up: s.up,
      chickens: s.chickens,
      cows: s.cows,
      ready: s.ready,
      totalEarned: s.totalEarned,
      totalHarvested: s.totalHarvested,
      tutorial: s.tutorial,
      tool: s.tool
    };
    return store(KEY, JSON.stringify(payload));
  }

  function hasSave() { return !!fetchRaw(KEY); }

  function load() {
    var raw = fetchRaw(KEY);
    if (!raw) return null;
    var d;
    try { d = JSON.parse(raw); } catch (e) { return null; }
    if (!d || !d.plots) return null;

    var s = newGame();
    s.day = d.day || 1;
    s.coins = d.coins || 0;
    s.seeds = d.seeds || {};
    s.produce = d.produce || {};
    s.can = d.can || { level: 1, water: 6 };
    if (d.up) for (var k in s.up) if (d.up[k] != null) s.up[k] = d.up[k];
    s.chickens = d.chickens || 0;
    s.cows = d.cows || 0;
    s.ready = d.ready || { egg: 0, milk: 0 };
    s.totalEarned = d.totalEarned || 0;
    s.totalHarvested = d.totalHarvested || 0;
    s.tutorial = d.tutorial == null ? 99 : d.tutorial;
    s.tool = d.tool || { type: 'seed', crop: 'carrot' };

    for (var i = 0; i < AG.MAX_PLOTS && i < d.plots.length; i++) {
      var p = d.plots[i];
      s.plots[i] = {
        open: !!p[0],
        crop: p[1] || null,
        stage: p[2] || 0,
        wet: !!p[3]
      };
    }
    return s;
  }

  function loadSettings() {
    var raw = fetchRaw(SETTINGS_KEY);
    if (!raw) return { muted: false };
    try { return JSON.parse(raw) || { muted: false }; }
    catch (e) { return { muted: false }; }
  }
  function saveSettings(o) { store(SETTINGS_KEY, JSON.stringify(o)); }

  AG.State = {
    newGame: newGame,
    save: save,
    load: load,
    hasSave: hasSave,
    wipe: function () { drop(KEY); },
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    openPlots: openPlots,
    canCapacity: canCapacity,
    sellMultiplier: sellMultiplier,
    sellPrice: sellPrice,
    unlockedCrops: unlockedCrops,
    produceCount: produceCount,
    produceValue: produceValue
  };
})();

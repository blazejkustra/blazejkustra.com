/* ------------------------------------------------------------------
   Greenfingers - audio
   Everything is synthesised with the Web Audio API: a slow warm pad
   loop, a little wind, occasional birdsong, and short sounds for the
   things you do.  No files, no downloads, and one mute switch.
------------------------------------------------------------------ */
(function () {
  var ctx = null;
  var master = null;
  var ambientGain = null;
  var sfxGain = null;
  var noiseBuf = null;
  var started = false;
  var muted = false;
  var birdTimer = null;
  var chordTimer = null;
  var padOsc = [];

  // F major-ish, gentle and unhurried
  var CHORDS = [
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66], // G min-ish
    [130.81, 174.61, 220.00], // C / F
    [220.00, 261.63, 329.63]  // A min
  ];
  var chordIndex = 0;

  function makeNoise() {
    var len = ctx.sampleRate * 2;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function init() {
    if (started) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    started = true;

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.6;
    master.connect(ctx.destination);

    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.0;
    ambientGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.9;
    sfxGain.connect(master);

    noiseBuf = makeNoise();

    // --- pad ------------------------------------------------------
    var padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 700;
    padFilter.Q.value = 0.4;
    padFilter.connect(ambientGain);

    for (var v = 0; v < 3; v++) {
      var o = ctx.createOscillator();
      o.type = v === 2 ? 'sine' : 'triangle';
      o.frequency.value = CHORDS[0][v];
      o.detune.value = (v - 1) * 5;
      var g = ctx.createGain();
      g.gain.value = v === 2 ? 0.10 : 0.16;
      o.connect(g); g.connect(padFilter);
      o.start();
      padOsc.push(o);
    }

    // slow breathing on the pad
    var lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.055;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start();

    // --- soft wind ------------------------------------------------
    var wind = ctx.createBufferSource();
    wind.buffer = noiseBuf;
    wind.loop = true;
    var wf = ctx.createBiquadFilter();
    wf.type = 'lowpass';
    wf.frequency.value = 340;
    var wg = ctx.createGain();
    wg.gain.value = 0.035;
    wind.connect(wf); wf.connect(wg); wg.connect(ambientGain);
    wind.start();

    var wlfo = ctx.createOscillator();
    wlfo.type = 'sine';
    wlfo.frequency.value = 0.08;
    var wlg = ctx.createGain();
    wlg.gain.value = 0.02;
    wlfo.connect(wlg); wlg.connect(wg.gain);
    wlfo.start();

    // fade the ambience in
    ambientGain.gain.setTargetAtTime(0.55, ctx.currentTime, 2.5);

    chordTimer = setInterval(nextChord, 7000);
    scheduleBird();
  }

  function nextChord() {
    if (!ctx) return;
    chordIndex = (chordIndex + 1) % CHORDS.length;
    var t = ctx.currentTime;
    for (var i = 0; i < padOsc.length; i++) {
      padOsc[i].frequency.setTargetAtTime(CHORDS[chordIndex][i], t, 1.6);
    }
  }

  function scheduleBird() {
    if (birdTimer) clearTimeout(birdTimer);
    birdTimer = setTimeout(function () {
      bird();
      scheduleBird();
    }, 5000 + Math.random() * 11000);
  }

  function bird() {
    if (!ctx || muted) return;
    var t = ctx.currentTime;
    var n = 2 + Math.floor(Math.random() * 3);
    var base = 1500 + Math.random() * 900;
    for (var i = 0; i < n; i++) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'sine';
      var st = t + i * 0.11;
      var f = base * (1 + (Math.random() - 0.5) * 0.25);
      o.frequency.setValueAtTime(f, st);
      o.frequency.exponentialRampToValueAtTime(f * 1.35, st + 0.05);
      o.frequency.exponentialRampToValueAtTime(f * 0.92, st + 0.09);
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.035, st + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.1);
      o.connect(g); g.connect(ambientGain);
      o.start(st); o.stop(st + 0.14);
    }
  }

  // --- sfx primitives -------------------------------------------
  function tone(opts) {
    if (!ctx || muted) return;
    var t = ctx.currentTime + (opts.delay || 0);
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(opts.f0, t);
    if (opts.f1) o.frequency.exponentialRampToValueAtTime(opts.f1, t + opts.dur);
    var vol = opts.vol == null ? 0.2 : opts.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (opts.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
    o.connect(g);
    if (opts.filter) {
      var f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = opts.filter;
      g.connect(f); f.connect(sfxGain);
    } else {
      g.connect(sfxGain);
    }
    o.start(t); o.stop(t + opts.dur + 0.05);
  }

  function noise(opts) {
    if (!ctx || muted) return;
    var t = ctx.currentTime + (opts.delay || 0);
    var s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = opts.type || 'bandpass';
    f.frequency.setValueAtTime(opts.f0, t);
    if (opts.f1) f.frequency.exponentialRampToValueAtTime(opts.f1, t + opts.dur);
    f.Q.value = opts.q == null ? 1.2 : opts.q;
    var g = ctx.createGain();
    var vol = opts.vol == null ? 0.15 : opts.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (opts.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
    s.connect(f); f.connect(g); g.connect(sfxGain);
    s.start(t); s.stop(t + opts.dur + 0.05);
  }

  var SFX = {
    click: function () {
      tone({ type: 'triangle', f0: 620, f1: 480, dur: 0.06, vol: 0.09 });
    },
    plant: function () {
      noise({ f0: 900, f1: 260, dur: 0.16, vol: 0.13, q: 0.9 });
      tone({ type: 'sine', f0: 190, f1: 110, dur: 0.14, vol: 0.16, filter: 700 });
    },
    water: function () {
      noise({ f0: 500, f1: 2400, dur: 0.26, vol: 0.10, q: 2.2 });
      noise({ f0: 1800, f1: 700, dur: 0.3, vol: 0.07, q: 3, delay: 0.06 });
      tone({ type: 'sine', f0: 700, f1: 1200, dur: 0.18, vol: 0.05, delay: 0.02 });
    },
    harvest: function () {
      noise({ f0: 1400, f1: 500, dur: 0.12, vol: 0.09, q: 1.4 });
      tone({ type: 'triangle', f0: 523, dur: 0.14, vol: 0.16 });
      tone({ type: 'triangle', f0: 784, dur: 0.18, vol: 0.13, delay: 0.06 });
    },
    sell: function () {
      tone({ type: 'sine', f0: 1318, dur: 0.22, vol: 0.15 });
      tone({ type: 'sine', f0: 1760, dur: 0.3, vol: 0.11, delay: 0.05 });
      tone({ type: 'sine', f0: 2637, dur: 0.24, vol: 0.05, delay: 0.09 });
    },
    buy: function () {
      tone({ type: 'triangle', f0: 880, dur: 0.12, vol: 0.14 });
      tone({ type: 'triangle', f0: 587, dur: 0.2, vol: 0.13, delay: 0.07 });
    },
    deny: function () {
      tone({ type: 'triangle', f0: 260, f1: 180, dur: 0.16, vol: 0.12, filter: 900 });
    },
    sleep: function () {
      tone({ type: 'sine', f0: 330, f1: 110, dur: 1.4, vol: 0.14, attack: 0.3, filter: 600 });
      noise({ f0: 600, f1: 180, dur: 1.6, vol: 0.05, q: 0.7, attack: 0.4 });
    },
    wake: function () {
      tone({ type: 'sine', f0: 392, dur: 0.5, vol: 0.11, attack: 0.05 });
      tone({ type: 'sine', f0: 523, dur: 0.6, vol: 0.10, delay: 0.12, attack: 0.05 });
      tone({ type: 'sine', f0: 659, dur: 0.8, vol: 0.09, delay: 0.24, attack: 0.05 });
    },
    refill: function () {
      noise({ f0: 300, f1: 1500, dur: 0.45, vol: 0.09, q: 1.6 });
      tone({ type: 'sine', f0: 300, f1: 620, dur: 0.4, vol: 0.06 });
    },
    animal: function () {
      tone({ type: 'triangle', f0: 660, f1: 990, dur: 0.1, vol: 0.11 });
      tone({ type: 'triangle', f0: 880, f1: 620, dur: 0.14, vol: 0.09, delay: 0.08 });
    },
    build: function () {
      tone({ type: 'triangle', f0: 330, dur: 0.18, vol: 0.16, filter: 1200 });
      tone({ type: 'triangle', f0: 494, dur: 0.22, vol: 0.14, delay: 0.09 });
      tone({ type: 'triangle', f0: 659, dur: 0.4, vol: 0.13, delay: 0.18 });
    }
  };

  function setMuted(m) {
    muted = !!m;
    if (master && ctx) {
      master.gain.setTargetAtTime(muted ? 0 : 0.6, ctx.currentTime, 0.15);
    }
  }

  AG.Audio = {
    init: function () {
      init();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    isMuted: function () { return muted; },
    setMuted: setMuted,
    toggle: function () { setMuted(!muted); return muted; },
    play: function (name) {
      if (!started || muted) return;
      var f = SFX[name];
      if (f) f();
    }
  };
})();

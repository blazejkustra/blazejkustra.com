/* ------------------------------------------------------------------
   Greenfingers - boot, scaling, input, main loop
------------------------------------------------------------------ */
(function () {
  var UI = AG.UI, S = AG.SPR, PAL = AG.PAL, F = AG.Font;
  var W = AG.W, H = AG.H;

  var canvas = document.getElementById('screen');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ------------------------------------------------------------------
  // integer scaling to the window
  // ------------------------------------------------------------------
  function resize() {
    var pad = 0;   // embed copy: fill the frame, no breathing room around the canvas
    var aw = Math.max(1, window.innerWidth - pad);
    var ah = Math.max(1, window.innerHeight - pad);
    var s = Math.min(aw / W, ah / H);   // embed copy: fill the frame, no integer floor
    if (s < 0.25) s = 0.25;
    canvas.style.width = Math.round(W * s) + 'px';
    canvas.style.height = Math.round(H * s) + 'px';
  }
  window.addEventListener('resize', resize);

  // ------------------------------------------------------------------
  // input
  // ------------------------------------------------------------------
  var audioReady = false;
  function wakeAudio() {
    if (audioReady) return;
    audioReady = true;
    AG.Audio.init();
  }

  function toLocal(e) {
    var r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width * W,
      y: (e.clientY - r.top) / r.height * H
    };
  }

  canvas.addEventListener('mousemove', function (e) {
    var p = toLocal(e);
    UI.mouse.x = p.x; UI.mouse.y = p.y;
    UI.mouse.inside = true;
    if (AG.Game.kb) AG.Game.kb.active = false;
  });
  canvas.addEventListener('mouseleave', function () {
    UI.mouse.inside = false;
    UI.mouse.x = -99; UI.mouse.y = -99;
    UI.mouse.down = false;
  });
  canvas.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    wakeAudio();
    var p = toLocal(e);
    UI.mouse.x = p.x; UI.mouse.y = p.y;
    UI.mouse.down = true;
    UI.mouse.click = true;
    e.preventDefault();
  });
  window.addEventListener('mouseup', function () { UI.mouse.down = false; });
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  canvas.addEventListener('wheel', function (e) {
    UI.mouse.wheel = e.deltaY > 0 ? 1 : (e.deltaY < 0 ? -1 : 0);
    e.preventDefault();
  }, { passive: false });

  // touch: treat a tap as a click so it is at least playable on a tablet
  canvas.addEventListener('touchstart', function (e) {
    wakeAudio();
    if (!e.touches.length) return;
    var t = e.touches[0];
    var r = canvas.getBoundingClientRect();
    UI.mouse.x = (t.clientX - r.left) / r.width * W;
    UI.mouse.y = (t.clientY - r.top) / r.height * H;
    UI.mouse.inside = true;
    UI.mouse.down = true;
    UI.mouse.click = true;
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', function (e) {
    UI.mouse.down = false;
    e.preventDefault();
  }, { passive: false });

  var HELD = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, ' ': 1 };
  window.addEventListener('keydown', function (e) {
    wakeAudio();
    var k = e.key;
    if (HELD[k]) e.preventDefault();
    AG.Game.key(k);
  });

  // ------------------------------------------------------------------
  // cursor
  // ------------------------------------------------------------------
  function drawCursor(ctx2) {
    if (!UI.mouse.inside) return;
    var x = Math.round(UI.mouse.x), y = Math.round(UI.mouse.y);
    var s = AG.Game.s;
    // a small badge showing what is in your hand
    if (AG.Game.scene === 'farm' && s && !AG.Game.panel && !AG.Game.trans &&
        y > AG.L.hudH && y < AG.L.barY) {
      if (s.tool.type === 'can' && !s.up.sprinkler) {
        ctx2.globalAlpha = 0.9;
        ctx2.drawImage(S.can, x + 6, y + 5);
        ctx2.globalAlpha = 1;
      } else if (s.tool.type === 'seed') {
        ctx2.globalAlpha = 0.9;
        ctx2.drawImage(S.seedbags[s.tool.crop], x + 6, y + 5);
        ctx2.globalAlpha = 1;
      }
    }
    ctx2.drawImage(S.pointer, x, y);
  }

  // ------------------------------------------------------------------
  // loop
  // ------------------------------------------------------------------
  var last = performance.now();
  var time = 0;

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    UI.updateParticles(dt);
    UI.updateToasts(dt);
    AG.Game.update(dt, time);

    ctx.fillStyle = PAL['m'];
    ctx.fillRect(0, 0, W, H);

    if (AG.Game.scene === 'title') {
      AG.Render.drawTitle(ctx, time, AG.Game);
      AG.Game.drawPanels(ctx);
    } else {
      AG.Game.draw(ctx, time);
    }

    UI.drawTooltip(ctx);
    drawCursor(ctx);

    UI.mouse.click = false;
    UI.mouse.wheel = 0;

    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------------
  // boot
  // ------------------------------------------------------------------
  var settings = AG.State.loadSettings();
  AG.Audio.setMuted(!!settings.muted);

  resize();
  requestAnimationFrame(frame);

  // keep the farm safe if the tab is closed mid-day
  window.addEventListener('beforeunload', function () {
    if (AG.Game.scene === 'farm' && AG.Game.s) AG.State.save(AG.Game.s);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && AG.Game.scene === 'farm' && AG.Game.s) AG.State.save(AG.Game.s);
  });
})();

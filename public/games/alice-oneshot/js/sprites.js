/* ------------------------------------------------------------------
   Greenfingers - sprites
   Small things (crops, animals, icons) are drawn as character grids.
   Big things (buildings, trees, water) are painted with rectangles so
   every pixel is still placed by hand, just more legibly.
------------------------------------------------------------------ */
(function () {
  var PAL = AG.PAL;

  // ---------------------------------------------------------------
  // helpers
  // ---------------------------------------------------------------
  function cv(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.ctx = c.getContext('2d');
    c.ctx.imageSmoothingEnabled = false;
    return c;
  }

  // Build a sprite from rows of palette characters.
  function sprite(rows, subst) {
    var h = rows.length, w = rows[0].length;
    for (var i = 0; i < h; i++) {
      if (rows[i].length !== w) {
        console.warn('sprite row ' + i + ' is ' + rows[i].length + ', expected ' + w, rows[i]);
      }
    }
    var c = cv(w, h);
    var img = c.ctx.createImageData(w, h);
    var d = img.data;
    for (var y = 0; y < h; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; x++) {
        var ch = row[x];
        if (ch === '.') continue;
        var col = (subst && subst[ch]) || PAL[ch];
        if (!col) continue;
        var rgb = col.charAt(0) === '#' ? AG.rgb(col) : [0, 0, 0];
        var p = (y * w + x) * 4;
        d[p] = rgb[0]; d[p + 1] = rgb[1]; d[p + 2] = rgb[2]; d[p + 3] = 255;
      }
    }
    c.ctx.putImageData(img, 0, 0);
    return c;
  }

  // rect in palette colour
  function R(x, X, Y, W, H, ch) {
    x.fillStyle = (ch.charAt(0) === '#' || ch.indexOf('rgb') === 0) ? ch : PAL[ch];
    x.fillRect(X, Y, W, H);
  }
  // 1px outline rect
  function O(x, X, Y, W, H, ch) {
    R(x, X, Y, W, 1, ch); R(x, X, Y + H - 1, W, 1, ch);
    R(x, X, Y, 1, H, ch); R(x, X + W - 1, Y, 1, H, ch);
  }
  // soft ground shadow
  function shadow(x, cx, cy, rx, ry) {
    x.save();
    x.fillStyle = 'rgba(29,20,16,0.22)';
    x.beginPath();
    x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }
  function ell(x, cx, cy, rx, ry, ch) {
    x.fillStyle = (ch.charAt(0) === '#') ? ch : PAL[ch];
    x.beginPath();
    x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    x.fill();
  }

  // ---------------------------------------------------------------
  // ground: soil plots
  // ---------------------------------------------------------------
  var SOIL = [
    '2222222222222222',
    '2443344334433442',
    '2334433443344332',
    '2433443344334432',
    '2344334433443342',
    '2433443344334432',
    '2344334433443342',
    '2433443344334432',
    '2344334433443342',
    '2433443344334432',
    '2344334433443342',
    '2433443344334432',
    '2344334433443342',
    '2433443344334432',
    '2333333333333332',
    '2222222222222222'
  ];

  var soilDry = sprite(SOIL);
  var soilWet = sprite(SOIL, { '2': PAL['1'], '3': PAL['2'], '4': PAL['3'] });
  var soilRich = sprite(SOIL, { '2': '#2b1d12', '3': '#573a24', '4': '#6f4c2d' });
  var soilRichWet = sprite(SOIL, { '2': '#211609', '3': '#3b2718', '4': '#4d341f' });

  // untilled, scruffy ground waiting to be bought - deliberately dark and
  // sparse so it never reads as a planted crop
  var WEEDS = [
    '................',
    '................',
    '.....h..........',
    '....ghg....h....',
    '....ghg...ghg...',
    '.....g.....g....',
    '..h.......h.....',
    '.ghg.....ghg....',
    '..g.......g.....',
    '.........JKg....',
    '........JKKKJ...',
    '..h......JKJ....',
    '.ghg............',
    '..g....h........',
    '......ghg.......',
    '.......g........'
  ];
  var WEEDS2 = [
    '................',
    '.......h........',
    '......ghg.......',
    '.......g........',
    '..h.........h...',
    '.ghg.......ghg..',
    '..g.........g...',
    '.....h..........',
    '....ghg.........',
    '.....g..........',
    '..........h.....',
    '.JKg.....ghg....',
    'JKKKJ.....g.....',
    '.JKJ............',
    '................',
    '................'
  ];
  var weeds = sprite(WEEDS);
  var weeds2 = sprite(WEEDS2);

  // ---------------------------------------------------------------
  // crops - shared early stages, unique later ones
  // ---------------------------------------------------------------
  var SPROUT = [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.....j...j......',
    '....jhi.ihj.....',
    '.....hhihh......',
    '.......i........',
    '.......g........',
    '......ggg.......',
    '................'
  ];

  var YOUNG = [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.......h........',
    '....j..h..j.....',
    '...jhi.h.ihj....',
    '..jhii.h.iihj...',
    '...jhhihhihj....',
    '......ghg.......',
    '.......g........',
    '......ggg.......',
    '................'
  ];

  var CROPART = {
    carrot: {
      grown: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.......j........',
        '....j..j..j.....',
        '...jhi.h.ihj....',
        '..jhii.h.iihj...',
        '..jhi.ihi.ihj...',
        '...jhhihhihj....',
        '....ghhihhg.....',
        '......ghg.......',
        '.......g........',
        '......ggg.......',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.......j........',
        '....j..j..j.....',
        '...jhi.h.ihj....',
        '..jhii.h.iihj...',
        '..jhi.ihi.ihj...',
        '...jhhihhihj....',
        '....hh...hh.....',
        '.....xyzyx......',
        '.....xyzyx......',
        '......xyx.......',
        '................'
      ]
    },
    wheat: {
      grown: [
        '................',
        '................',
        '................',
        '................',
        '....i.....i.....',
        '...ii..i..ii....',
        '...hi.ii..ih....',
        '...hi.hi..ih....',
        '...hi.hi..ih....',
        '..ghi.hi..ihg...',
        '...gh.gh..hg....',
        '....g..g...g....',
        '....g..g...g....',
        '....g..g...g....',
        '...gggggggg.....',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '................',
        '....B.....B.....',
        '...BC.....CB....',
        '...ABB.B..BBA...',
        '...ABB.BC.BBA...',
        '...ABB.AB.BBA...',
        '....AB.AB.BA....',
        '....A..AB..A....',
        '....A..A...A....',
        '....A..A...A....',
        '....A..A...A....',
        '....A..A...A....',
        '...AAAAAAAA.....',
        '................'
      ]
    },
    tomato: {
      grown: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.....j...j......',
        '....jhi.ihj.....',
        '...jhihihihj....',
        '...jhi.h.ihj....',
        '...jhihihihj....',
        '....jhi.ihj.....',
        '.....hhihh......',
        '......ghg.......',
        '.......g........',
        '......ggg.......',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '................',
        '................',
        '.....j...j......',
        '....jhi.ihj.....',
        '...jhihihihj....',
        '...jhi.h.ihj....',
        '....jhhihhj.....',
        '....uu....uu....',
        '...uvwu..uvwu...',
        '...uvvu..uvvu...',
        '....uu....uu....',
        '.......g........',
        '......ggg.......',
        '................'
      ]
    },
    corn: {
      grown: [
        '................',
        '................',
        '.......i........',
        '......ihi.......',
        '...j..ihi..j....',
        '..jhi.ihi.ihj...',
        '...jhhihihhj....',
        '......ihi.......',
        '...j..ihi..j....',
        '..jhi.ihi.ihj...',
        '...jhhihihhj....',
        '......ghg.......',
        '......ghg.......',
        '......ghg.......',
        '.....ggggg......',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '.......i........',
        '......ihi.......',
        '...j..ihi..j....',
        '..jhi.ihi.ihj...',
        '...jhhihihhj....',
        '...ACA.h.ACA....',
        '...BCBihiBCB....',
        '...BCBihiBCB....',
        '...ACAihiACA....',
        '....A.ghg.A.....',
        '......ghg.......',
        '......ghg.......',
        '.....ggggg......',
        '................'
      ]
    },
    pumpkin: {
      grown: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '..j.........j...',
        '.jhij.....jhij..',
        '..jhij...jhij...',
        '...jhhihhhij....',
        '......iii.......',
        '.....ihhhi......',
        '....ihhhhhi.....',
        '....ihhhhhi.....',
        '.....iiiii......',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.......g........',
        '..j....g...j....',
        '.jhij..g..jhij..',
        '..jhij.g.jhij...',
        '...jhh.g.hhj....',
        '.....xyxyx......',
        '...xyzyzyzyx....',
        '..xyzyzyzyzyx...',
        '..xyzyzyzyzyx...',
        '...xxyxyxyxx....',
        '................'
      ]
    },
    melon: {
      grown: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '..j........j....',
        '.jhij....jhij...',
        '..jhhihhhihj....',
        '......hhh.......',
        '.....hihih......',
        '....hihihih.....',
        '....hihihih.....',
        '.....hhhhh......',
        '................'
      ],
      ripe: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '..j........j....',
        '.jhij....jhij...',
        '..jhhihhhihj....',
        '......g.g.......',
        '....fgfgfgf.....',
        '..fgjgjgjgjgf...',
        '.fgjgjgjgjgjgf..',
        '.fgjgjgjgjgjgf..',
        '..fgjgjgjgjgf...',
        '....ffgfgff.....',
        '................'
      ]
    }
  };

  // ---------------------------------------------------------------
  // produce icons (12 wide)
  // ---------------------------------------------------------------
  var ICONART = {
    carrot: [
      '............',
      '.....g.g....',
      '....gggg....',
      '.....zz.....',
      '....zyyz....',
      '....xyyx....',
      '....xyyx....',
      '.....xy.....',
      '.....xx.....',
      '......x.....',
      '............',
      '............'
    ],
    wheat: [
      '............',
      '...B....B...',
      '..BCB..BCB..',
      '..ACA..ACA..',
      '...A....A...',
      '...A....A...',
      '...AA..AA...',
      '....AAAA....',
      '...9AAAA9...',
      '....AAAA....',
      '.....AA.....',
      '............'
    ],
    tomato: [
      '............',
      '.....g......',
      '....ggg.....',
      '...uvvvu....',
      '..uvwvvvu...',
      '..uvvvvvu...',
      '..uvvvvvu...',
      '...uvvvu....',
      '....uuu.....',
      '............',
      '............',
      '............'
    ],
    corn: [
      '............',
      '.....h......',
      '....hCh.....',
      '...hCBCh....',
      '...hCBCh....',
      '...hCBCh....',
      '...hCBCh....',
      '...hCBCh....',
      '....hCh.....',
      '.....h......',
      '............',
      '............'
    ],
    pumpkin: [
      '............',
      '.....g......',
      '....xgx.....',
      '..xyzyzyx...',
      '.xyzyzyzyx..',
      '.xyzyzyzyx..',
      '.xyzyzyzyx..',
      '..xyzyzyx...',
      '...xxxxx....',
      '............',
      '............',
      '............'
    ],
    melon: [
      '............',
      '.....g......',
      '....fgf.....',
      '..fgjgjgf...',
      '.fgjgjgjgf..',
      '.fgjgjgjgf..',
      '.fgjgjgjgf..',
      '..fgjgjgf...',
      '...fffff....',
      '............',
      '............',
      '............'
    ],
    egg: [
      '............',
      '.....KK.....',
      '....KLLK....',
      '...KLMMLK...',
      '...KLMMLK...',
      '...KLMMLK...',
      '....KLLK....',
      '.....KK.....',
      '............',
      '............',
      '............',
      '............'
    ],
    milk: [
      '............',
      '.....99.....',
      '....KMMK....',
      '...KMMMMK...',
      '...KLMMLK...',
      '...KLMMLK...',
      '...KLMMLK...',
      '...KLMMLK...',
      '....KKKK....',
      '............',
      '............',
      '............'
    ]
  };

  var COIN = [
    '..AAAA..',
    '.ACBBCA.',
    'ACBCCBCA',
    'ACBCCBCA',
    'ACBCCBCA',
    'ACBCCBCA',
    '.ACBBCA.',
    '..AAAA..'
  ];

  var CAN = [
    '....JJJJ......',
    '...J....J.....',
    '...J....J..JJ.',
    '.JJJJJJJJJJJJ.',
    '.JKKKKKKKJJJJ.',
    '.JKLLKKKKJ....',
    '.JKKKKKKKJ....',
    '.JKKKKKKKJ....',
    '.JKKKKKKKJ....',
    '.JJJJJJJJJ....',
    '..JJJJJJJ.....'
  ];

  var SEEDBAG = [
    '............',
    '.eeeeeeeeee.',
    '.ebbbbbbbbe.',
    '.eb######be.',
    '.eb######be.',
    '.eb######be.',
    '.ebbbbbbbbe.',
    '.eb1bb1bb1e.',
    '.ebbbbbbbbe.',
    '.eeeeeeeeee.',
    '............',
    '............'
  ];

  var BASKET = [
    '...u.y......',
    '..uuuyyy....',
    '..88888888..',
    '..87979798..',
    '..87979798..',
    '..87979798..',
    '...878787...',
    '....8888....'
  ];

  var PLOTICON = [
    '............',
    '.2222222222.',
    '.2434343432.',
    '.2343434342.',
    '.2434343432.',
    '.2343434342.',
    '.2434343432.',
    '.2222222222.',
    '............'
  ];

  var MOON = [
    '....LLL..',
    '..LLL....',
    '.LL......',
    '.L.......',
    '.L.......',
    '.L.......',
    '.LL......',
    '..LLL....',
    '....LLL..'
  ];

  var SPEAKER_ON = [
    '.....K.....',
    '....KK.....',
    '...KKK..K..',
    '.KKKKK.K.K.',
    '.KKKKK.K.K.',
    '.KKKKK.K.K.',
    '...KKK..K..',
    '....KK.....',
    '.....K.....'
  ];
  var SPEAKER_OFF = [
    '.....K.....',
    '....KK.....',
    '...KKK.....',
    '.KKKKK.u.u.',
    '.KKKKK..u..',
    '.KKKKK.u.u.',
    '...KKK.....',
    '....KK.....',
    '.....K.....'
  ];

  var POINTER = [
    '0.......',
    '00......',
    '0M0.....',
    '0MM0....',
    '0MMM0...',
    '0MMMM0..',
    '0MMMMM0.',
    '0MMMMMM0',
    '0MMM0000',
    '0M0M0...',
    '00.0M0..',
    '....00..'
  ];

  var CHICKEN_A = [
    '......uu...',
    '.....MMMM..',
    '....MM0MMy.',
    '..L.MMMMMy.',
    '.LMMMMMMM..',
    'LMMMMMMMM..',
    'LMMMMMMMM..',
    '.LMMMMMMM..',
    '..LMMMMM...',
    '...y...y...',
    '..yy...yy..'
  ];
  var CHICKEN_B = [
    '......uu...',
    '.....MMMM..',
    '....MM0MMy.',
    '..L.MMMMMy.',
    '.LMMMMMMM..',
    'LMMMMMMMM..',
    'LMMMMMMMM..',
    '.LMMMMMMM..',
    '..LMMMMM...',
    '....y.y....',
    '...yy.yy...'
  ];

  var COW_A = [
    '..................',
    '..................',
    '...LLLLLLLL.......',
    '..LMMMMMMMMML.....',
    '.LMM333MMMMML.LL..',
    '.LM33333MMMMLLMML.',
    '.LM33333MMMMLM0ML.',
    '.LMMM333MMMMLMMMH.',
    '.LMMMMMMMMMMLMMML.',
    '..LMMMMMMMMMLLLL..',
    '...LL.LL..LL.LL...',
    '...LL.LL..LL.LL...',
    '...11.11..11.11...',
    '..................'
  ];
  var COW_B = [
    '..................',
    '..................',
    '...LLLLLLLL.......',
    '..LMMMMMMMMML.....',
    '.LMM333MMMMML.LL..',
    '.LM33333MMMMLLMML.',
    '.LM33333MMMMLM0ML.',
    '.LMMM333MMMMLMMMH.',
    '.LMMMMMMMMMMLMMML.',
    '..LMMMMMMMMMLLLL..',
    '...LL..LL.LL..LL..',
    '...LL..LL.LL..LL..',
    '...11..11.11..11..',
    '..................'
  ];

  // small grass tufts scattered over the ground
  var TUFT_A = ['..m..', '.mnm.', 'mnnnm', '.mmm.'];
  var TUFT_B = ['.n.n.', 'nlnln', '.lll.', '..l..'];
  var PEBBLE = ['.KK.', 'KJJK', '.JJ.'];
  var DAISY = ['.c.', 'cBc', '.c.'];
  var CLOVER = ['.I.', 'IHI', '.h.'];

  // ---------------------------------------------------------------
  // painted objects
  // ---------------------------------------------------------------

  function farmhouse() {
    var c = cv(60, 58), x = c.ctx;
    shadow(x, 30, 53, 26, 5);

    // chimney (drawn first so the roof laps over its base)
    R(x, 38, 2, 8, 22, '2');
    R(x, 39, 3, 3, 21, '3');
    R(x, 37, 0, 10, 3, '1');

    // roof
    for (var i = 0; i <= 20; i++) {
      var t = i / 20;
      var hw = Math.round(4 + 24 * t);
      var y = 6 + i;
      var col = (i < 2) ? 'v' : (i % 4 === 3 ? 't' : 'u');
      R(x, 30 - hw, y, hw * 2, 1, col);
      R(x, 30 - hw, y, 1, 1, 't');
      R(x, 30 + hw - 1, y, 1, 1, 't');
    }
    R(x, 2, 26, 56, 2, 't');       // eaves
    R(x, 2, 26, 56, 1, 'w');

    // walls
    R(x, 8, 28, 44, 24, 'a');
    R(x, 44, 28, 8, 24, 'd');
    O(x, 8, 28, 44, 24, 'e');
    R(x, 8, 28, 44, 1, 'c');
    // timber frame
    R(x, 8, 28, 3, 24, 'e');
    R(x, 49, 28, 3, 24, 'e');
    R(x, 8, 39, 44, 1, 'e');

    // door
    R(x, 25, 34, 11, 18, '6');
    R(x, 26, 35, 9, 17, '7');
    R(x, 27, 36, 3, 16, '8');
    R(x, 33, 42, 2, 2, 'B');
    R(x, 24, 52, 13, 3, '5');
    R(x, 24, 54, 13, 1, '4');

    // windows
    [12, 40].forEach(function (wx) {
      R(x, wx, 30, 9, 9, '6');
      R(x, wx + 1, 31, 7, 7, 'q');
      R(x, wx + 1, 31, 3, 3, 's');
      R(x, wx + 4, 31, 1, 7, '6');
      R(x, wx + 1, 34, 7, 1, '6');
      // window box + blooms
      R(x, wx - 1, 39, 11, 3, '7');
      R(x, wx - 1, 39, 11, 1, '8');
      R(x, wx, 38, 2, 1, 'H');
      R(x, wx + 3, 38, 2, 1, 'C');
      R(x, wx + 6, 38, 2, 1, 'I');
    });

    return c;
  }

  function shopHut() {
    var c = cv(64, 56), x = c.ctx;
    shadow(x, 32, 51, 28, 5);

    // roof
    for (var i = 0; i <= 18; i++) {
      var t = i / 18;
      var hw = Math.round(6 + 25 * t);
      var y = 4 + i;
      var col = (i < 2) ? 'i' : (i % 4 === 3 ? 'f' : 'h');
      R(x, 32 - hw, y, hw * 2, 1, col);
      R(x, 32 - hw, y, 1, 1, 'f');
      R(x, 32 + hw - 1, y, 1, 1, 'f');
    }
    R(x, 5, 22, 54, 2, 'f');
    R(x, 5, 22, 54, 1, 'i');

    // walls
    R(x, 7, 24, 50, 26, '7');
    O(x, 7, 24, 50, 26, '6');
    for (var px = 9; px < 56; px += 5) R(x, px, 25, 1, 24, '6');
    R(x, 7, 48, 50, 2, '6');

    // striped awning
    for (var s = 0; s < 9; s++) {
      var ax = 4 + s * 6;
      R(x, ax, 25, 6, 7, (s % 2 === 0) ? 'u' : 'b');
      R(x, ax + 1, 32, 4, 1, (s % 2 === 0) ? 't' : 'a');
    }
    R(x, 4, 25, 56, 1, 'e');

    // counter window with sacks of seed
    R(x, 14, 34, 36, 12, '1');
    O(x, 13, 33, 38, 14, '6');
    R(x, 13, 45, 38, 3, '8');
    R(x, 13, 45, 38, 1, '9');
    R(x, 17, 37, 7, 8, '9');
    R(x, 18, 36, 5, 2, '5');
    R(x, 26, 39, 6, 6, '5');
    R(x, 27, 38, 4, 2, '9');
    R(x, 36, 38, 8, 7, '9');
    R(x, 37, 37, 6, 2, '5');
    R(x, 19, 40, 1, 1, 'y'); R(x, 21, 41, 1, 1, 'u');
    R(x, 28, 41, 1, 1, 'B'); R(x, 38, 40, 1, 1, 'j');

    // hanging sign with a coin on it
    R(x, 50, 14, 2, 6, '6');
    R(x, 44, 19, 15, 11, 'a');
    O(x, 44, 19, 15, 11, 'e');
    R(x, 48, 22, 7, 5, 'B');
    R(x, 49, 23, 5, 3, 'C');
    R(x, 47, 21, 9, 1, 'A');
    R(x, 47, 27, 9, 1, 'A');

    return c;
  }

  function marketStall() {
    var c = cv(78, 54), x = c.ctx;
    shadow(x, 39, 49, 34, 5);

    // posts
    R(x, 4, 16, 4, 30, '6');
    R(x, 70, 16, 4, 30, '6');
    R(x, 5, 16, 1, 30, '7');
    R(x, 71, 16, 1, 30, '7');

    // striped canopy
    for (var s = 0; s < 13; s++) {
      var ax = s * 6;
      var col = (s % 2 === 0) ? 'b' : 'h';
      R(x, ax, 6, 6, 14, col);
      // scalloped hem
      R(x, ax + 1, 20, 4, 1, col);
      R(x, ax + 2, 21, 2, 1, col);
    }
    R(x, 0, 5, 78, 2, 'e');
    R(x, 0, 6, 78, 1, 'c');

    // counter
    R(x, 4, 32, 70, 4, '8');
    R(x, 4, 32, 70, 1, '9');
    R(x, 6, 36, 66, 12, '7');
    for (var px = 9; px < 72; px += 6) R(x, px, 36, 1, 12, '6');
    R(x, 6, 46, 66, 2, '6');

    // crates of produce on the counter
    function crate(cx2, a, b) {
      R(x, cx2, 24, 14, 9, '5');
      O(x, cx2, 24, 14, 9, '6');
      R(x, cx2 + 1, 26, 12, 1, '9');
      R(x, cx2 + 2, 21, 4, 4, a);
      R(x, cx2 + 7, 20, 5, 5, b);
      R(x, cx2 + 8, 21, 2, 2, 'c');
    }
    crate(10, 'y', 'u');
    crate(54, 'B', 'j');

    // little chalk price board
    R(x, 31, 22, 17, 11, '6');
    R(x, 32, 23, 15, 9, '1');
    R(x, 34, 25, 9, 1, 'L');
    R(x, 34, 27, 11, 1, 'L');
    R(x, 34, 29, 7, 1, 'L');

    return c;
  }

  function coop() {
    var c = cv(56, 44), x = c.ctx;
    shadow(x, 27, 39, 24, 4);

    // ramp
    R(x, 12, 32, 18, 6, '7');
    for (var i = 0; i < 5; i++) R(x, 13 + i * 4, 32, 1, 6, '6');

    // body
    R(x, 6, 12, 44, 22, '8');
    O(x, 6, 12, 44, 22, '6');
    for (var px = 10; px < 49; px += 6) R(x, px, 13, 1, 20, '7');
    R(x, 6, 30, 44, 4, '7');

    // slanted roof
    for (var i2 = 0; i2 < 46; i2++) {
      var y = 12 - Math.round(i2 * 5 / 46);
      R(x, 4 + i2, y - 4, 1, 5, (i2 % 5 === 0) ? '2' : '6');
    }
    R(x, 4, 8, 46, 1, '7');

    // door hole + window
    R(x, 15, 20, 10, 12, '1');
    O(x, 14, 19, 12, 14, '6');
    R(x, 16, 30, 8, 2, 'C');
    R(x, 32, 17, 12, 9, '6');
    R(x, 33, 18, 10, 7, 'q');
    R(x, 33, 18, 4, 3, 's');
    R(x, 37, 18, 1, 7, '6');

    // straw
    R(x, 8, 34, 40, 2, 'B');
    R(x, 10, 36, 12, 1, 'C');
    R(x, 30, 36, 14, 1, 'C');

    return c;
  }

  function barn() {
    var c = cv(70, 52), x = c.ctx;
    shadow(x, 35, 47, 32, 5);

    // gambrel roof, two slopes
    for (var i = 0; i < 8; i++) {
      var hw = 12 + i * 2;
      R(x, 35 - hw, 4 + i, hw * 2, 1, (i < 2) ? 'v' : 'u');
    }
    for (var j = 0; j < 8; j++) {
      var hw2 = 28 + Math.round(j * 7 / 8);
      R(x, 35 - hw2, 12 + j, hw2 * 2, 1, (j % 4 === 3) ? 't' : 'u');
    }
    R(x, 2, 20, 66, 2, 't');
    R(x, 2, 20, 66, 1, 'w');
    R(x, 34, 4, 2, 1, 'b');

    // walls
    R(x, 4, 22, 62, 24, 'u');
    for (var py = 25; py < 45; py += 5) R(x, 4, py, 62, 1, 't');
    O(x, 4, 22, 62, 24, 't');
    R(x, 4, 22, 3, 24, 'b');
    R(x, 63, 22, 3, 24, 'b');
    R(x, 4, 44, 62, 2, 't');

    // hayloft door
    R(x, 30, 8, 10, 10, '6');
    R(x, 31, 9, 8, 8, '1');
    R(x, 31, 9, 8, 3, '9');

    // big doors
    R(x, 22, 26, 26, 20, 't');
    O(x, 22, 26, 26, 20, 'b');
    R(x, 34, 26, 2, 20, 'b');
    // white cross braces
    x.save();
    x.strokeStyle = PAL['b'];
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(23, 27); x.lineTo(34, 45);
    x.moveTo(34, 27); x.lineTo(23, 45);
    x.moveTo(36, 27); x.lineTo(47, 45);
    x.moveTo(47, 27); x.lineTo(36, 45);
    x.stroke();
    x.restore();

    return c;
  }

  function pondBase() {
    var c = cv(64, 42), x = c.ctx;
    // damp earth ring
    ell(x, 32, 22, 31, 19, '3');
    ell(x, 32, 22, 29, 17, '2');
    // stones around the rim
    for (var a = 0; a < 16; a++) {
      var ang = (a / 16) * Math.PI * 2;
      var sx = 32 + Math.cos(ang) * 28;
      var sy = 22 + Math.sin(ang) * 16.5;
      ell(x, sx, sy, 3.2, 2.4, 'K');
      ell(x, sx - 0.6, sy - 0.6, 2.2, 1.5, 'L');
      ell(x, sx + 0.8, sy + 0.8, 1.8, 1.2, 'J');
    }
    // water
    ell(x, 32, 22, 26, 14, 'p');
    ell(x, 32, 22, 24.5, 12.5, 'q');
    ell(x, 30, 20, 18, 8, 'r');
    // lily pads
    ell(x, 18, 18, 4.5, 3, 'h');
    ell(x, 18, 18, 3.5, 2.2, 'i');
    R(x, 18, 15, 1, 3, 'g');
    ell(x, 45, 27, 4, 2.6, 'h');
    ell(x, 45, 27, 3, 1.8, 'i');
    ell(x, 44, 25, 2, 1.4, 'I');
    ell(x, 44, 25, 1, 0.7, 'c');
    return c;
  }

  function tree() {
    var c = cv(30, 40), x = c.ctx;
    shadow(x, 15, 36, 11, 3);
    // trunk
    R(x, 12, 22, 6, 14, '2');
    R(x, 13, 22, 3, 14, '3');
    R(x, 11, 34, 8, 2, '2');
    R(x, 17, 26, 2, 4, '2');
    // canopy
    ell(x, 15, 16, 14, 12, 'f');
    ell(x, 10, 15, 9, 8, 'g');
    ell(x, 20, 14, 9, 8, 'g');
    ell(x, 15, 11, 10, 8, 'h');
    ell(x, 11, 12, 6, 5, 'i');
    ell(x, 20, 10, 5, 4, 'i');
    ell(x, 12, 9, 3.5, 2.5, 'j');
    ell(x, 21, 16, 3, 2, 'h');
    R(x, 8, 20, 2, 1, 'g');
    R(x, 21, 21, 2, 1, 'g');
    return c;
  }

  function flowerBed() {
    var c = cv(26, 14), x = c.ctx;
    ell(x, 13, 9, 12, 4.5, '3');
    ell(x, 13, 9, 11, 3.5, '4');
    var cols = ['H', 'I', 'C', 'M', 'H', 'I', 'C'];
    for (var i = 0; i < 7; i++) {
      var fx = 3 + i * 3.4;
      var fy = 5 + (i % 3);
      R(x, Math.round(fx), Math.round(fy) + 2, 1, 3, 'h');
      R(x, Math.round(fx) - 1, Math.round(fy), 3, 1, cols[i]);
      R(x, Math.round(fx), Math.round(fy) - 1, 1, 3, cols[i]);
      R(x, Math.round(fx), Math.round(fy), 1, 1, 'B');
    }
    return c;
  }

  function scarecrow() {
    var c = cv(20, 32), x = c.ctx;
    shadow(x, 10, 30, 7, 2.5);
    R(x, 9, 12, 3, 18, '6');       // post
    R(x, 10, 12, 1, 18, '7');
    R(x, 3, 15, 15, 3, '6');       // arms
    R(x, 3, 15, 15, 1, '7');
    R(x, 3, 18, 2, 3, '9');        // straw hands
    R(x, 16, 18, 2, 3, '9');
    R(x, 5, 14, 11, 12, 'u');      // shirt
    R(x, 5, 14, 11, 1, 'v');
    R(x, 5, 20, 11, 1, 't');
    R(x, 6, 24, 9, 4, '9');        // straw skirt
    R(x, 7, 3, 7, 8, 'C');         // head
    O(x, 7, 3, 7, 8, 'B');
    R(x, 8, 6, 1, 1, '1');
    R(x, 12, 6, 1, 1, '1');
    R(x, 9, 9, 3, 1, '1');
    R(x, 4, 1, 13, 2, '5');        // hat
    R(x, 6, 0, 9, 2, '6');
    R(x, 6, 0, 9, 1, '7');
    return c;
  }

  function lamp() {
    var c = cv(14, 34), x = c.ctx;
    shadow(x, 7, 32, 6, 2.5);
    R(x, 5, 8, 4, 24, '2');
    R(x, 6, 8, 1, 24, '3');
    R(x, 3, 30, 8, 2, '2');
    R(x, 3, 4, 8, 8, '6');
    R(x, 4, 5, 6, 6, 'C');
    R(x, 5, 6, 4, 4, 'M');
    R(x, 2, 2, 10, 3, '6');
    R(x, 4, 0, 6, 2, '7');
    return c;
  }

  function mailbox() {
    var c = cv(14, 22), x = c.ctx;
    shadow(x, 7, 20, 5, 2);
    R(x, 6, 8, 3, 12, '6');
    R(x, 7, 8, 1, 12, '7');
    R(x, 2, 2, 11, 8, 'u');
    O(x, 2, 2, 11, 8, 't');
    R(x, 2, 2, 11, 1, 'v');
    R(x, 3, 4, 4, 4, '1');
    R(x, 11, 3, 2, 1, 'b');
    R(x, 12, 3, 1, 4, 'b');
    return c;
  }

  function crate() {
    var c = cv(18, 15), x = c.ctx;
    shadow(x, 9, 14, 8, 2);
    R(x, 1, 3, 16, 11, '7');
    O(x, 1, 3, 16, 11, '6');
    R(x, 1, 6, 16, 1, '6');
    R(x, 1, 10, 16, 1, '6');
    R(x, 8, 3, 1, 11, '6');
    R(x, 2, 4, 5, 2, '8');
    return c;
  }

  function sprinklerPost() {
    var c = cv(12, 18), x = c.ctx;
    R(x, 5, 6, 3, 11, '2');
    R(x, 6, 6, 1, 11, '3');
    R(x, 3, 16, 7, 2, '2');
    R(x, 3, 3, 7, 4, 'K');
    R(x, 4, 4, 5, 2, 'L');
    R(x, 5, 1, 3, 2, 'J');
    R(x, 1, 4, 2, 1, 'K');
    R(x, 10, 4, 2, 1, 'K');
    return c;
  }

  // small shop-row icons
  function miniCoop() {
    var c = cv(20, 16), x = c.ctx;
    R(x, 2, 5, 16, 9, '8');
    O(x, 2, 5, 16, 9, '6');
    R(x, 1, 2, 18, 3, '6');
    R(x, 1, 2, 18, 1, '7');
    R(x, 5, 8, 5, 6, '1');
    R(x, 12, 8, 4, 4, 'q');
    R(x, 2, 14, 16, 2, 'B');
    return c;
  }
  function miniBarn() {
    var c = cv(20, 16), x = c.ctx;
    R(x, 2, 6, 16, 10, 'u');
    O(x, 2, 6, 16, 10, 't');
    for (var i = 0; i < 5; i++) R(x, 10 - i * 2, 2 + i, 1 + i * 4, 1, 'u');
    R(x, 1, 5, 18, 1, 't');
    R(x, 7, 9, 6, 7, 't');
    O(x, 7, 9, 6, 7, 'b');
    R(x, 2, 6, 1, 10, 'b');
    R(x, 17, 6, 1, 10, 'b');
    return c;
  }
  function miniPath() {
    var c = cv(20, 12), x = c.ctx;
    ell(x, 5, 5, 4, 3, 'K');
    ell(x, 5, 5, 3, 2, 'L');
    ell(x, 13, 4, 4, 3, 'K');
    ell(x, 13, 4, 3, 2, 'L');
    ell(x, 9, 9, 4, 3, 'K');
    ell(x, 9, 9, 3, 2, 'L');
    return c;
  }
  function miniFence() {
    var c = cv(22, 14), x = c.ctx;
    R(x, 2, 3, 3, 11, '7');
    R(x, 10, 3, 3, 11, '7');
    R(x, 18, 3, 3, 11, '7');
    R(x, 0, 5, 22, 2, '8');
    R(x, 0, 10, 22, 2, '8');
    return c;
  }
  function miniSoil() {
    var c = cv(20, 14), x = c.ctx;
    R(x, 1, 3, 18, 10, '2');
    for (var y = 4; y < 12; y++) {
      for (var xx = 2; xx < 18; xx++) {
        if (((xx + y) % 3) === 0) R(x, xx, y, 1, 1, '#5c3f27');
        else if (((xx + y) % 3) === 1) R(x, xx, y, 1, 1, '#75512f');
      }
    }
    R(x, 4, 2, 2, 2, 'k');
    R(x, 14, 5, 2, 2, 'k');
    R(x, 9, 9, 2, 2, 'k');
    return c;
  }

  // ---------------------------------------------------------------
  // bake everything
  // ---------------------------------------------------------------
  var S = {
    soilDry: soilDry,
    soilWet: soilWet,
    soilRich: soilRich,
    soilRichWet: soilRichWet,
    weeds: weeds,
    weeds2: weeds2,
    sprout: sprite(SPROUT),
    coin: sprite(COIN),
    can: sprite(CAN),
    basket: sprite(BASKET),
    plotIcon: sprite(PLOTICON),
    moon: sprite(MOON),
    speakerOn: sprite(SPEAKER_ON),
    speakerOff: sprite(SPEAKER_OFF),
    pointer: sprite(POINTER),
    chicken: [sprite(CHICKEN_A), sprite(CHICKEN_B)],
    cow: [sprite(COW_A), sprite(COW_B)],
    tuftA: sprite(TUFT_A),
    tuftB: sprite(TUFT_B),
    pebble: sprite(PEBBLE),
    daisy: sprite(DAISY),
    clover: sprite(CLOVER),
    house: farmhouse(),
    shop: shopHut(),
    stall: marketStall(),
    coop: coop(),
    barn: barn(),
    pond: pondBase(),
    tree: tree(),
    flowers: flowerBed(),
    scarecrow: scarecrow(),
    lamp: lamp(),
    mailbox: mailbox(),
    crate: crate(),
    sprinkler: sprinklerPost(),
    miniCoop: miniCoop(),
    miniBarn: miniBarn(),
    miniPath: miniPath(),
    miniFence: miniFence(),
    miniSoil: miniSoil(),
    crops: {},
    icons: {},
    seedbags: {}
  };

  // per-crop stage art + icons + tinted seed packets
  var cropIds = ['carrot', 'wheat', 'tomato', 'corn', 'pumpkin', 'melon'];
  var leafTint = {
    carrot: '#8fbf5a', wheat: '#a8c05a', tomato: '#79b256',
    corn: '#93c25c', pumpkin: '#6ea84c', melon: '#84bd5f'
  };
  var packetTint = {
    carrot: '#db8028', wheat: '#dcb44a', tomato: '#c95f4c',
    corn: '#f2d97a', pumpkin: '#b85c1e', melon: '#6ea84c'
  };

  cropIds.forEach(function (id) {
    S.crops[id] = [
      S.sprout,
      sprite(YOUNG, { 'j': leafTint[id] }),
      sprite(CROPART[id].grown),
      sprite(CROPART[id].ripe)
    ];
    S.icons[id] = sprite(ICONART[id]);
    S.seedbags[id] = sprite(SEEDBAG, { '#': packetTint[id] });
  });
  S.icons.egg = sprite(ICONART.egg);
  S.icons.milk = sprite(ICONART.milk);

  AG.SPR = S;
  AG.sprite = sprite;
  AG.cv = cv;
  AG.px = { R: R, O: O, ell: ell, shadow: shadow };
})();

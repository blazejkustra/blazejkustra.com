/* ------------------------------------------------------------------
   Greenfingers - palette
   One shared palette for every sprite, every panel, every particle.
   Sprite art is written as rows of characters; each character maps to
   one colour here.  '.' is transparent.

   0 1        outlines / deep shadow
   2 3 4 5    soil
   6 7 8 9    wood
   a b c d e  cream (UI, plaster, paper)
   f g h i j k  leaves
   l m n o    grass
   p q r s    water
   t u v w    reds (roofs, tomatoes)
   x y z      oranges (carrots, pumpkins)
   A B C      golds (wheat, corn, coins, lamplight)
   D E F      sky
   G H I      blossom pinks
   J K L M    stone / feathers / milk
   N O        night
------------------------------------------------------------------ */
window.AG = window.AG || {};

(function () {
  var PAL = {
    '.': null,

    '0': '#1d1410', // outline, near-black warm
    '1': '#35251b', // deep brown

    '2': '#4a3324', // soil shadow
    '3': '#63452e', // soil
    '4': '#7b5639', // soil light
    '5': '#916b48', // soil dry highlight

    '6': '#6b4423', // wood dark
    '7': '#8a5c31', // wood
    '8': '#a9773f', // wood light
    '9': '#c79a5c', // wood pale / straw rope

    'a': '#e8d5a8', // cream
    'b': '#f5e8c8', // cream light
    'c': '#fff8e6', // cream lightest
    'd': '#bd9a6a', // cream shadow
    'e': '#8a6b45', // cream border

    'f': '#21401f', // leaf darkest
    'g': '#2f5c28', // leaf dark
    'h': '#437536', // leaf
    'i': '#5b9243', // leaf light
    'j': '#79b256', // leaf pale
    'k': '#9dd06f', // leaf highlight

    'l': '#4d7a37', // grass dark
    'm': '#5f9040', // grass
    'n': '#74a94f', // grass light
    'o': '#8dc264', // grass highlight

    'p': '#2c5f7a', // water deep
    'q': '#3f83a3', // water
    'r': '#5aa6c4', // water light
    's': '#8fd3e6', // water shine

    't': '#7d2f2a', // red dark
    'u': '#a8433a', // red
    'v': '#c95f4c', // red light
    'w': '#e08a6a', // red pale

    'x': '#b85c1e', // orange dark
    'y': '#db8028', // orange
    'z': '#f2a83e', // orange light

    'A': '#b98a2e', // gold dark
    'B': '#dcb44a', // gold
    'C': '#f2d97a', // gold light

    'D': '#7fb8d6', // sky
    'E': '#a9d7ea', // sky light
    'F': '#d9f0f7', // cloud

    'G': '#8a4a7a', // plum
    'H': '#c96f9e', // pink
    'I': '#f0a8c8', // pink light

    'J': '#6b6357', // stone dark
    'K': '#9c9384', // stone
    'L': '#d8d0be', // off white
    'M': '#fdf8ec', // white

    'N': '#1b2340', // night
    'O': '#2e3a63'  // night light
  };

  function rgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }

  // Blend two hex colours, t in 0..1
  function mix(a, b, t) {
    var A = rgb(a), B = rgb(b);
    var r = Math.round(A[0] + (B[0] - A[0]) * t);
    var g = Math.round(A[1] + (B[1] - A[1]) * t);
    var bl = Math.round(A[2] + (B[2] - A[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  AG.PAL = PAL;
  AG.rgb = rgb;
  AG.mix = mix;

  // Named colours used by UI code, all drawn from the same palette.
  AG.C = {
    ink: PAL['1'],
    inkSoft: PAL['e'],
    panel: PAL['b'],
    panelAlt: PAL['a'],
    panelEdge: PAL['e'],
    panelDeep: PAL['6'],
    gold: PAL['B'],
    goldDark: PAL['A'],
    good: PAL['h'],
    bad: PAL['u'],
    white: PAL['c'],
    shade: 'rgba(29,20,16,0.35)'
  };
})();

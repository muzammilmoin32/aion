/*
 * ===================================================================================
 *  WAVES SETTINGS — controls the glowing light stream ("waves") behind the page.
 *  Edit a value, save, and reload the page. Nothing else needs to change.
 *  Delete a line (or the whole file) to fall back to the built-in default.
 * ===================================================================================
 */
window.AION_WAVES = {
  // Turn the whole effect on or off.
  enabled: true,

  /* ---------------- colours (R, G, B from 0 to 255) ---------------- */
  colors: {
    main:  [60, 228, 212],   // most of the fibres (Aion teal)
    core:  [92, 200, 255],   // fibres near the middle of the ribbon (cyan)
    white: [235, 255, 250],  // a few bright white fibres
    dust:  [210, 255, 248],  // particles travelling along the ribbon
    point: [77, 235, 219],   // the bright point beside the phone
  },

  /* ---------------- the ribbon ---------------- */
  fibres: 110,             // number of fibres in the ribbon (40 – 200)
  fibreBrightness: 1.35,   // how bright each fibre is (0.5 – 2.5)
  fibreThickness: 1,       // fibre line width multiplier (0.5 – 2)
  ribbonWidth: 1,          // overall width of the ribbon (0.5 – 1.8)
  glowLayers: 40,          // soft glow strips around the ribbon on desktop (0 – 60)
  glowLayersMobile: 12,    // the same on phones (lower = faster)
  flowSpeed: 1,            // how fast the light pulses and fibres move (0 = still, 2 = fast)
  waviness: 1,             // how much the fibres ripple sideways (0 – 2)

  /* ---------------- particles ---------------- */
  dust: 1.6,               // particles rushing along the ribbon, per path step (0 – 4)
  dustSpeed: 1.8,          // how fast those particles travel along the ribbon (1 = original, 0.5 – 3)
  dustSpread: 1.7,         // how far they scatter either side of the ribbon (1 = original, 0.5 – 3)
  bokeh: 0.16,             // big soft discs drifting around the ribbon (0 – 0.6)
  specks: 90,              // faint specks scattered over the page, per screen height (0 – 300)

  /* ---------------- "Show what's behind it" switch ---------------- */
  boost: {
    extraDust: 2.2,        // extra particles that appear while the switch is on (0 – 5)
    brighterDust: 0.7,     // how much brighter the existing dust gets (0 – 2)
    brighterGlow: 0.45,    // how much brighter the fibres glow (0 – 1.5)
    easeSeconds: 0.35,     // how quickly it fades in and out (seconds, roughly)
  },

  /* ---------------- path down the page ---------------- */
  path: {
    brightPointX: 0.62,        // where the bright point sits across the hero (0 = left, 1 = right), desktop
    brightPointXMobile: 0.86,  // the same on phones
    swingInSoftSections: 0.38, // how far the ribbon swings from the centre inside blurred sections (0 – 0.9; keep under 0.45 so the turns stay on screen)
    swingElsewhere: 0.42,      // how far it swings from the centre in sharp areas (0 – 0.5; bigger keeps it at the edges, clear of text)
    bendEveryScreens: 1.3,     // distance between bends, in screen heights (0.8 – 2.5)
    endSweep: true,            // finish with one smooth sweep behind the closing card (no sharp corner)
    mergeAtTurns: 0.85,        // right at every turn the wires gather into one bright bundle; everywhere else they stay spread (0 = no merge, 1 = tightest bundle)
    mergeLength: 220,          // how long the merged stretch is around each turn, in px (100 = a short pinch, 400 = a long gathered stretch)
  },

  /* ---------------- drawing as you scroll ---------------- */
  drawAhead: 0.72,             // where the drawing tip sits, as a share of the screen height (0.4 – 1.5: 0.5 = middle, 1 = bottom edge;
                               //   above 1 = finished before you see it). The tip fades in over about 220px. At the end of the page it always finishes.
  drawDelay: 0,                // 0 = the drawing follows your scrolling exactly (fast scroll = fast drawing, slow = slow);
                               //   above 0 = it trails behind by about that many seconds (0.3 = slight lag, 1 = lazy)

  /* ---------------- focus and brightness ---------------- */
  blurAll: true,               // true = blur the stream behind every section after the hero, gaps and bends included, up to the last section (which stays sharp);
                               //   on a page too short for that, it falls back to the sections marked as soft
                               // false = blur only inside the sections marked as soft, sharp in the gaps between them
  blurAmount: 0.4,             // how strong the blur is behind the sections (0 = no blur, 0.4 = light, 1 = fully out of focus)
  softEdge: 150,               // px over which the stream fades from sharp to blurred at a section edge
  heroBrightness: 1,           // stream opacity in the hero (0 – 1)
  sectionBrightness: 0.7,      // stream opacity behind the reading sections (0 – 1)
  closingBrightness: 0.85,     // stream opacity near the closing card (0 – 1)
};

/*
 * ===================================================================================
 *  SMOOTH SCROLLING — how the page glides when you use the mouse wheel, trackpad or keyboard.
 *  Phones and tablets keep their own native scrolling. Visitors who ask for reduced motion get normal scrolling.
 * ===================================================================================
 */
window.AION_SCROLL = {
  enabled: true,      // false = plain browser scrolling
  smoothness: 1.3,    // how long the glide lasts (0.3 = snappy, 1 = smooth, 2 – 3 = very floaty)
  wheelSpeed: 1,      // how far one wheel notch moves the page (0.5 = half, 2 = double)
  keyboard: true,     // arrows, Page Up/Down, Space, Home/End glide too
};

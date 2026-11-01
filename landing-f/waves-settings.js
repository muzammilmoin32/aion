/*
 * LINES SETTINGS for this page (landing-f): the main page's light stream, cut down to a few lines so it
 * sits well with the theme's particles. Same keys as the main page's waves-settings.js; edit, save, reload.
 */
window.AION_WAVES = {
  enabled: true,
  fibres: 36,              // how many lines (24 – 48 suits this page)
  fibreBrightness: 1.7,    // each line's brightness
  fibreThickness: 1.2,     // line width
  ribbonWidth: 0.85,        // how far apart the lines run
  glowLayers: 12,          // soft glow around the lines (0 = none)
  glowLayersMobile: 6,
  waviness: 1,
  dust: 0.35,              // particles running along the lines (the theme has its own particles, so keep this low)
  dustSpeed: 1.8,
  dustSpread: 1,
  bokeh: 0,
  specks: 0,
  boost: { extraDust: 0.6, brighterDust: 0.6, brighterGlow: 0.45, easeSeconds: 0.35 },
  path: { brightPointX: 0.62, brightPointXMobile: 0.86, swingInSoftSections: 0.38, swingElsewhere: 0.42, bendEveryScreens: 1.3, endSweep: true, mergeAtTurns: 0.85, mergeLength: 220 },
  drawAhead: 0.72,         // the lines draw as you scroll, with the tip this far down the screen
  drawDelay: 0,
  blurAll: true,
  blurAmount: 0.25,        // light blur behind the reading sections
  softEdge: 150,
  heroBrightness: 1,
  sectionBrightness: 0.8,
  closingBrightness: 0.9,
};

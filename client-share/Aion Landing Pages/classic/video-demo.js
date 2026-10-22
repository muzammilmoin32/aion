'use strict';

/*
 * Sample videos for the demos. Loaded after app.js and before landing.js.
 * Each journey gets a real video in place of the animated HTML phone screens; the engine then
 * times the progress steps, captions and trace from the video's own duration.
 *
 * SAMPLE FOOTAGE: these are free stock clips from Pexels (pexels.com, Pexels License) of Saudi and Gulf
 * people using their phones, used only to show the look and feel. Swap each file for the production screen recording of that journey
 * (MP4 + WebM, 1080p, under 2 MB, poster frame) and nothing else needs to change.
 */
(() => {
  const dir = `${document.body.dataset.base || ''}assets/video/`;
  // Where the person sits in each clip, so the portrait phone crop keeps them in frame.
  const FOCUS = { sme: '50% 30%', payroll: '30% 50%', sadad: '50% 40%', cards: '50% 40%', lending: '50% 40%', ews: '28% 40%' };
  Object.keys(JOURNEYS).forEach((id) => {
    JOURNEYS[id].video = {
      focus: FOCUS[id] || '50% 50%',
      mp4: `${dir}${id}-720.mp4`,     // in the phone
      thumb: `${dir}${id}-360.mp4`,   // small looping card thumbnail
      poster: `${dir}${id}-poster.jpg`,
    };
  });
})();

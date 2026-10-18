'use strict';

/*
 * Video version of the demos (landing-c-video/). Loaded after app.js and before landing.js.
 * Each journey gets a real video in place of the animated HTML phone screens; the engine then
 * times the progress steps, captions and trace from the video's own duration.
 *
 * SAMPLE FOOTAGE: these are free stock clips from Mixkit (mixkit.co, Mixkit License), used only to
 * show the look and feel. Swap each file for the production screen recording of that journey
 * (MP4 + WebM, 1080p, under 2 MB, poster frame) and nothing else needs to change.
 */
(() => {
  const dir = `${document.body.dataset.base || ''}assets/video/`;
  Object.keys(JOURNEYS).forEach((id) => {
    JOURNEYS[id].video = {
      mp4: `${dir}${id}-720.mp4`,     // in the phone
      thumb: `${dir}${id}-360.mp4`,   // small looping card thumbnail
      poster: `${dir}${id}-poster.jpg`,
    };
  });
})();

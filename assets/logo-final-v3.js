/* Kartik Clarity logo renderer - isolated, lightweight, no observers, no loops. */
(function () {
  'use strict';

  /* Same-origin GitHub Pages assets. No relative SVG chain and no external CDN. */
  var mark = '/Executive-Revenue-Scorecard/assets/kartik-clarity-mark.jpg';
  var wordmark = '/Executive-Revenue-Scorecard/assets/kartik-clarity-logo.jpg';

  function apply(img, src) {
    if (!img) return;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.setProperty('display', 'block', 'important');
    img.style.setProperty('visibility', 'visible', 'important');
    img.style.setProperty('opacity', '1', 'important');
  }

  function repair() {
    var selectors = [
      '.brand img', '.profile img', '.user img', '.hero-brand img', '.footer img',
      'img[src*="logo-circle"]', 'img[src*="logo-rectangle"]',
      'img[src*="logo.jpg"]', 'img[src*="logo.svg"]'
    ];
    var seen = new Set();
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (img) {
        if (seen.has(img)) return;
        seen.add(img);
        var word = !!img.closest('.hero-brand, .footer');
        apply(img, word ? wordmark : mark);
      });
    });
    var icon = document.querySelector('link[rel="icon"]');
    if (icon) icon.href = mark;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repair, { once: true });
  } else {
    repair();
  }
  window.addEventListener('load', repair, { once: true, passive: true });
})();

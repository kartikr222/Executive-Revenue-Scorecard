/* Kartik Clarity logo renderer - isolated, lightweight, no observers, no loops. */
(function () {
  'use strict';

  var root = document.querySelector('base');
  var base = root && root.href ? root.href : document.baseURI;
  var mark = new URL('assets/kartik-clarity-mark.jpg', base).href;
  var wordmark = new URL('assets/kartik-clarity-logo.jpg', base).href;

  function apply(img, src) {
    if (!img) return;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    if (img.getAttribute('src') !== src) img.src = src;
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

  /* One additional pass after all normal page scripts have initialized. */
  window.addEventListener('load', repair, { once: true, passive: true });
})();

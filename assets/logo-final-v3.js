/* Kartik Clarity permanent logo renderer - safe, idempotent, no observer loop. */
(function () {
  'use strict';

  var base = new URL('./', document.baseURI).href;
  var mark = base + 'assets/kartik-clarity-mark.jpg';
  var wordmark = base + 'assets/kartik-clarity-logo.jpg';
  var repairing = false;

  function setIfNeeded(img, src) {
    if (!img) return;
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
    if (img.hasAttribute('sizes')) img.removeAttribute('sizes');
    if (img.getAttribute('decoding') !== 'sync') img.setAttribute('decoding', 'sync');
    if (img.getAttribute('loading') !== 'eager') img.setAttribute('loading', 'eager');
    if (img.style.display !== 'block') img.style.setProperty('display', 'block', 'important');
    if (img.style.visibility !== 'visible') img.style.setProperty('visibility', 'visible', 'important');
    if (img.style.opacity !== '1') img.style.setProperty('opacity', '1', 'important');
  }

  function repair() {
    if (repairing) return;
    repairing = true;
    try {
      var selectors = [
        '.brand img', '.profile img', '.user img', '.hero-brand img', '.footer img',
        'img[src*="logo-circle"]', 'img[src*="logo-rectangle"]',
        'img[src*="logo.jpg"]', 'img[src*="logo.svg"]'
      ];
      var seen = [];
      selectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (img) {
          if (seen.indexOf(img) !== -1) return;
          seen.push(img);
          var isWordmark = img.closest('.hero-brand, .footer') !== null;
          setIfNeeded(img, isWordmark ? wordmark : mark);
        });
      });
      var icon = document.querySelector('link[rel="icon"]');
      if (icon && icon.href !== mark) icon.href = mark;
    } finally {
      repairing = false;
    }
  }

  function boot() {
    repair();
    /* Observe only newly inserted/removed nodes. Do NOT observe src/style/class changes: repair() itself changes those attributes. */
    new MutationObserver(function () { repair(); }).observe(document.body || document.documentElement, {
      subtree: true,
      childList: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

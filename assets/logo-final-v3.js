/* Kartik Clarity permanent logo renderer - direct local images, browser-independent. */
(function () {
  'use strict';

  var base = new URL('./', document.baseURI).href;
  var mark = base + 'assets/kartik-clarity-mark.jpg';
  var wordmark = base + 'assets/kartik-clarity-logo.jpg';

  function repair() {
    var selectors = [
      '.brand img',
      '.profile img',
      '.user img',
      '.hero-brand img',
      '.footer img',
      'img[src*="logo-circle"]',
      'img[src*="logo-rectangle"]',
      'img[src*="logo.jpg"]',
      'img[src*="logo.svg"]'
    ];

    var seen = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (img) {
        if (seen.indexOf(img) !== -1) return;
        seen.push(img);
        var isWordmark = img.closest('.hero-brand, .footer') !== null;
        var src = isWordmark ? wordmark : mark;
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('src', src);
        img.setAttribute('decoding', 'sync');
        img.setAttribute('loading', 'eager');
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('visibility', 'visible', 'important');
        img.style.setProperty('opacity', '1', 'important');
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

  new MutationObserver(repair).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'style', 'class']
  });
})();

/*! Kartik Clarity™ - permanent logo guard. Official artwork only. */
(function () {
  'use strict';
  var ROOT = 'https://kartikr222.github.io/Executive-Revenue-Scorecard/';
  var LOGOS = {
    circle: ROOT + 'logo-circle.jpg',
    rectangle: ROOT + 'logo-rectangle.jpg'
  };
  function apply() {
    document.querySelectorAll('img').forEach(function (img) {
      var s = ((img.getAttribute('src') || '') + ' ' + (img.getAttribute('alt') || '')).toLowerCase();
      var kind = /circle|mark|profile/.test(s) ? 'circle' : (/rectangle|kartik clarity/.test(s) ? 'rectangle' : null);
      if (!kind) return;
      img.onerror = null;
      img.src = LOGOS[kind];
      img.style.visibility = 'visible';
      img.style.opacity = '1';
      img.style.display = 'block';
    });
    document.querySelectorAll('link[rel~="icon"]').forEach(function (link) {
      link.href = LOGOS.circle;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();

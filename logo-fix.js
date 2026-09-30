/*! Kartik Clarity™ - permanent logo guard. Official artwork only. */
(function () {
  'use strict';
  var LOGOS = {
    circle: 'https://raw.githubusercontent.com/kartikr222/Executive-Revenue-Scorecard/main/logo-circle.jpg',
    rectangle: 'https://raw.githubusercontent.com/kartikr222/Executive-Revenue-Scorecard/main/logo-rectangle.jpg'
  };
  function setLogo(img, url) {
    if (!img) return;
    img.setAttribute('decoding', 'sync');
    img.setAttribute('draggable', 'false');
    img.style.visibility = 'visible';
    img.style.opacity = '1';
    img.style.display = 'block';
    img.style.objectFit = 'contain';
    img.onerror = function () {
      if (img.dataset.kcLogoGuard === '1') return;
      img.dataset.kcLogoGuard = '1';
      img.onerror = null;
      img.src = url;
    };
    img.src = url;
  }
  function apply() {
    document.querySelectorAll('img').forEach(function (img) {
      var s = ((img.getAttribute('src') || '') + ' ' + (img.getAttribute('alt') || '') + ' ' + (img.className || '') + ' ' + (img.parentElement && img.parentElement.className || '')).toLowerCase();
      if (/hero-brand|footer|rectangle/.test(s)) setLogo(img, LOGOS.rectangle);
      else if (/brand|profile|avatar|account|circle|mark/.test(s)) setLogo(img, LOGOS.circle);
    });
    document.querySelectorAll('link[rel~="icon"]').forEach(function (link) { link.href = LOGOS.circle; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
/*!
 * Kartik Clarity™ — logo-fix.js
 * Drop next to index.html (repo root) and add before </body>:
 *   <script src="logo-fix.js"></script>
 *
 * What it does on every page that loads it:
 *  1. Finds every Kartik Clarity logo <img> (circle + rectangle) and the favicon.
 *  2. Tries the expected files (assets/logo-circle.*, assets/logo-rectangle.*).
 *  3. If those are broken/missing, scans the repo file tree via the GitHub API,
 *     loads every logo-like image, and classifies by SHAPE (square = circle logo,
 *     wide = rectangle logo) — so it finds your uploaded files whatever they are named.
 *  4. Adds a white plate behind dark logos on the dark navy sidebar so they are visible.
 *  5. Last resort: built-in Kartik Clarity™ vector logos, so nothing is ever blank.
 */
(function () {
  'use strict';

  var REPO = 'kartikr222/Executive-Revenue-Scorecard';
  var BRANCH = 'main';
  var ROOT = (document.currentScript && document.currentScript.src)
    ? new URL('./', document.currentScript.src).href
    : new URL('./', document.baseURI).href;
  var BUST = '?v=' + Date.now();
  var EXTS = ['svg', 'png', 'jpg', 'jpeg', 'webp'];
  var CACHE_KEY = 'kc-logo-map-v1';

  /* ---------- built-in vector fallbacks (always visible) ---------- */
  var FALLBACK = {
    circle:
      'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="58" fill="#0b2450"/>' +
        '<circle cx="60" cy="60" r="50" fill="none" stroke="#61a0ff" stroke-width="3"/>' +
        '<text x="60" y="76" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="46" fill="#ffffff">KC</text>' +
        '</svg>'),
    rectangle:
      'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 90">' +
        '<circle cx="45" cy="45" r="38" fill="#0b2450"/>' +
        '<circle cx="45" cy="45" r="32" fill="none" stroke="#61a0ff" stroke-width="2.5"/>' +
        '<text x="45" y="57" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="34" fill="#ffffff">KC</text>' +
        '<text x="100" y="56" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="34" fill="#0b2450">Kartik Clarity\u2122</text>' +
        '</svg>')
  };

  /* ---------- helpers ---------- */
  function loadImg(url, ms) {
    return new Promise(function (resolve) {
      var im = new Image(), done = false;
      var t = setTimeout(function () { finish(null); }, ms || 8000);
      function finish(v) { if (done) return; done = true; clearTimeout(t); resolve(v); }
      im.onload = function () {
        var w = im.naturalWidth || 0, h = im.naturalHeight || 0;
        // SVGs without intrinsic size report 0 in some browsers; treat as valid, ratio unknown
        finish({ url: url, w: w, h: h, img: im });
      };
      im.onerror = function () { finish(null); };
      im.src = url;
    });
  }

  function ratio(r) { return (r && r.w && r.h) ? r.w / r.h : 0; }

  function firstLoadable(urls) {
    return urls.reduce(function (p, u) {
      return p.then(function (found) { return found || loadImg(u); });
    }, Promise.resolve(null));
  }

  /* ---------- step 2: expected filenames ---------- */
  function tryExpected(kind) {
    var base = ROOT + 'assets/logo-' + kind + '.';
    return firstLoadable(EXTS.map(function (e) { return base + e + BUST; }));
  }

  /* ---------- step 3: discover uploaded files via repo tree ---------- */
  function discover() {
    try {
      var c = sessionStorage.getItem(CACHE_KEY);
      if (c) return Promise.resolve(JSON.parse(c));
    } catch (e) {}
    var api = 'https://api.github.com/repos/' + REPO + '/git/trees/' + BRANCH + '?recursive=1';
    return fetch(api).then(function (r) { return r.ok ? r.json() : { tree: [] }; })
      .then(function (j) {
        var paths = (j.tree || [])
          .filter(function (n) { return n.type === 'blob'; })
          .map(function (n) { return n.path; })
          .filter(function (p) { return /\.(svg|png|jpe?g|webp)$/i.test(p); })
          .filter(function (p) { return /(logo|kartik|clarity|brand|mark|kc[-_])/i.test(p); })
          .filter(function (p) { return !/(favicon|screenshot|og[-_]|social|preview)/i.test(p); })
          .slice(0, 40);
        return Promise.all(paths.map(function (p) {
          return loadImg(ROOT + p.split('/').map(encodeURIComponent).join('/') + BUST, 8000)
            .then(function (r) { if (r) r.path = p; return r; });
        }));
      })
      .then(function (list) {
        list = list.filter(Boolean);
        var map = { circle: pick(list, 'circle'), rectangle: pick(list, 'rectangle') };
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(map)); } catch (e) {}
        return map;
      })
      .catch(function () { return { circle: null, rectangle: null }; });
  }

  function pick(list, kind) {
    var best = null, bestScore = -1;
    list.forEach(function (r) {
      var rt = ratio(r), name = (r.path || '').toLowerCase(), s = 0;
      if (kind === 'circle') {
        if (rt && rt >= 0.8 && rt <= 1.25) s += 5;
        if (/circ|round|mark|icon|avatar|badge/.test(name)) s += 10;
        if (rt > 1.5) s -= 20;
      } else {
        if (rt && rt >= 1.5) s += 5;
        if (/rect|wide|horiz|full|word|landscape|banner/.test(name)) s += 10;
        if (rt && rt <= 1.25) s -= 20;
      }
      if (!rt) s += 1;                       // unknown-size SVG: weak candidate
      s += Math.min(r.w || 0, 2000) / 4000;   // prefer higher resolution
      if (s > bestScore) { bestScore = s; best = r; }
    });
    return best && bestScore > 0 ? { url: best.url, path: best.path } : null;
  }

  /* ---------- step 4: contrast check (dark logo on navy sidebar) ---------- */
  function isDark(r) {
    try {
      var im = r.img, w = 96, h = 96;
      var rt = ratio(r) || (im.width && im.height ? im.width / im.height : 1);
      if (rt >= 1) h = Math.max(8, Math.round(w / rt)); else w = Math.max(8, Math.round(h * rt));
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var x = c.getContext('2d'); x.drawImage(im, 0, 0, w, h);
      var d = x.getImageData(0, 0, w, h).data, sum = 0, n = 0;
      for (var i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 40) { sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; }
      }
      if (!n) return true;
      return (sum / n) < 170;
    } catch (e) { return true; } // can't inspect -> plate is the safe choice
  }

  /* ---------- styles ---------- */
  var css = document.createElement('style');
  css.textContent =
    'img[data-kc-kind]{visibility:visible!important;opacity:1!important;display:block}' +
    '.side img[data-kc-kind="rectangle"].kc-plate{background:#fff!important;border-radius:12px;padding:6px 12px!important;box-shadow:0 0 0 1px rgba(255,255,255,.4)}' +
    '.side img[data-kc-kind="circle"],.user img[data-kc-kind="circle"]{background:#fff!important}';
  document.head.appendChild(css);

  /* ---------- apply ---------- */
  function kindOf(img) {
    var s = (img.getAttribute('src') || '') + ' ' + (img.getAttribute('alt') || '') + ' ' + (img.dataset.fallback || '');
    if (/logo-circle|mark/i.test(s) || img.closest('.profile,.user')) return 'circle';
    if (/logo-rectangle|kartik clarity/i.test(s)) return 'rectangle';
    return null;
  }

  function setAll(kind, res) {
    var url = res ? res.url : FALLBACK[kind];
    var probe = res ? Promise.resolve(res) : loadImg(url);
    probe.then(function (r) {
      var dark = r ? isDark(r) : true;
      document.querySelectorAll('img[data-kc-kind="' + kind + '"]').forEach(function (img) {
        img.onerror = function () { img.onerror = null; img.src = FALLBACK[kind]; };
        img.removeAttribute('data-fallback');
        img.src = url;
        img.classList.toggle('kc-plate', dark);
      });
      document.querySelectorAll('link[rel~="icon"]').forEach(function (l) {
        if (kind === 'circle') l.href = url;
      });
    });
  }

  function run() {
    var found = { circle: false, rectangle: false };
    document.querySelectorAll('img').forEach(function (img) {
      var k = kindOf(img);
      if (k) { img.setAttribute('data-kc-kind', k); found[k] = true; }
    });

    ['circle', 'rectangle'].forEach(function (kind) {
      tryExpected(kind).then(function (hit) {
        if (hit) return setAll(kind, hit);
        return discover().then(function (map) {
          setAll(kind, map && map[kind] ? map[kind] : null);
        });
      });
    });

    // final guard: anything still not rendering gets the built-in logo
    setTimeout(function () {
      document.querySelectorAll('img[data-kc-kind]').forEach(function (img) {
        if (!img.complete || !img.naturalWidth) {
          img.onerror = null;
          img.src = FALLBACK[img.getAttribute('data-kc-kind')];
        }
      });
    }, 12000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

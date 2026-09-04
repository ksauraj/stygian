/*!
 * Stygian - docs theme engine (vanilla JS, no dependencies)
 * Modules: theme switch with binary-ripple View Transition, mobile
 * navigation drawer, code copy buttons, table wrappers, heading anchors,
 * lazy Mermaid rendering.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var STORAGE_KEY = 'stygian-theme';
  var TRANSITION_DURATION = 1800;

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ==================================================================
   * THEME - data-theme swap with binary-ripple View Transition
   * ================================================================== */

  function getTheme() {
    return root.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }
    }
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f6f7f9' : '#000000';
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    var sun = doc.querySelector('.js-theme-icon-sun');
    var moon = doc.querySelector('.js-theme-icon-moon');
    if (!sun || !moon) return;
    var showSun = theme === 'dark'; // dark mode shows the sun, click for light
    sun.style.display = showSun ? '' : 'none';
    moon.style.display = showSun ? 'none' : '';
  }

  /* --- ripple engine (port of the ksau-portfolio binary wave) --- */

  var MOBILE_RIPPLE_CENTRES = 7;
  var DESKTOP_RIPPLE_CENTRES = 18;
  var MIN_RIPPLE_BAND_CELLS = 12;
  var MAX_RIPPLE_BAND_CELLS = 20;
  var WAVE_SPEED = 0.28;
  var COLLISION_OVERLAP_DURATION = 180;
  var COLLISION_FADE_DURATION = 420;
  var MAIN_DESKTOP_CELL_SIZE = 12;
  var MAIN_MOBILE_CELL_SIZE = 16;
  var DESKTOP_CELL_SIZE = 6;
  var MOBILE_CELL_SIZE = 8;

  function transitionProgress(progress) {
    if (progress < 0.35) return progress * 0.9;
    if (progress < 0.7) return 0.315 + (progress - 0.35) * 0.12;
    return 0.357 + Math.pow((progress - 0.7) / 0.3, 0.55) * 0.643;
  }

  function transitionArrival(revealProgress) {
    if (revealProgress < 0.315) return revealProgress / 0.9;
    if (revealProgress < 0.357) return 0.35 + (revealProgress - 0.315) / 0.12;
    return 0.7 + Math.pow((revealProgress - 0.357) / 0.643, 1 / 0.55) * 0.3;
  }

  function lowerBound(cells, distance) {
    var low = 0, high = cells.length;
    while (low < high) {
      var middle = (low + high) >>> 1;
      if (cells[middle].distance < distance) low = middle + 1;
      else high = middle;
    }
    return low;
  }

  function createMainField(center, width, height, cellSize) {
    var cells = [];
    var columns = Math.ceil(width / cellSize) + 1;
    var rows = Math.ceil(height / cellSize) + 1;
    for (var row = 0; row < rows; row++) {
      var y = row * cellSize + cellSize / 2;
      for (var col = 0; col < columns; col++) {
        var x = col * cellSize + cellSize / 2;
        cells.push({
          x: x,
          y: y,
          distance: Math.hypot(x - center.x, y - center.y),
          bit: Math.random() > 0.5 ? 1 : 0,
          shimmer: 0.72 + (((col * 17 + row * 31) % 7) / 7) * 0.28
        });
      }
    }
    cells.sort(function (a, b) { return a.distance - b.distance; });
    return cells;
  }

  function solveCollisionTime(first, second) {
    var distance = Math.hypot(first.x - second.x, first.y - second.y);
    var laterStart = Math.max(first.delay, second.delay);
    var firstRadiusAtLaterStart = Math.max(0, laterStart - first.delay) * WAVE_SPEED;
    var secondRadiusAtLaterStart = Math.max(0, laterStart - second.delay) * WAVE_SPEED;
    if (firstRadiusAtLaterStart + secondRadiusAtLaterStart >= distance) return laterStart;
    return laterStart + (distance - firstRadiusAtLaterStart - secondRadiusAtLaterStart) / (2 * WAVE_SPEED);
  }

  function createRippleFields(seeds, origin, width, height, cellSize) {
    var ripples = seeds.map(function (seed, index) {
      var collisionTime = Infinity;
      for (var other = 0; other < seeds.length; other++) {
        if (other === index) continue;
        collisionTime = Math.min(collisionTime, solveCollisionTime(seed, seeds[other]));
      }
      var endTime = collisionTime + COLLISION_OVERLAP_DURATION + COLLISION_FADE_DURATION;
      var maxDistance = Math.max(0, endTime - seed.delay) * WAVE_SPEED;
      return {
        x: seed.x, y: seed.y, band: seed.band, delay: seed.delay,
        collisionTime: collisionTime, maxDistance: maxDistance, cells: []
      };
    });

    ripples.forEach(function (ripple) {
      var left = Math.max(0, ripple.x - ripple.maxDistance);
      var right = Math.min(width, ripple.x + ripple.maxDistance);
      var top = Math.max(0, ripple.y - ripple.maxDistance);
      var bottom = Math.min(height, ripple.y + ripple.maxDistance);
      for (var y = top; y <= bottom; y += cellSize) {
        for (var x = left; x <= right; x += cellSize) {
          var distance = Math.hypot(x - ripple.x, y - ripple.y);
          if (distance > ripple.maxDistance) continue;
          ripple.cells.push({
            x: x, y: y,
            distance: distance,
            revealDistance: Math.hypot(x - origin.x, y - origin.y),
            bit: Math.random() > 0.5 ? 1 : 0,
            shimmer: 0.72 + Math.random() * 0.28
          });
        }
      }
      ripple.cells.sort(function (a, b) { return a.distance - b.distance; });
    });
    return ripples;
  }

  function runBinaryRipple(origin, targetTheme) {
    var canvas = doc.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'binary-pixel-transition';
    doc.body.appendChild(canvas);
    var context = canvas.getContext('2d');
    if (!context) { canvas.remove(); return; }

    var width = window.innerWidth;
    var height = window.innerHeight;
    var isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    var rippleCount = isMobile ? MOBILE_RIPPLE_CENTRES : DESKTOP_RIPPLE_CENTRES;
    var rippleColumns = Math.ceil(Math.sqrt((rippleCount * width) / height));
    var rippleRows = Math.ceil(rippleCount / rippleColumns);
    var cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
    var mainCellSize = isMobile ? MAIN_MOBILE_CELL_SIZE : MAIN_DESKTOP_CELL_SIZE;
    var dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
    var startedAt = performance.now();
    var center = origin || { x: width / 2, y: 32 };
    var maxRevealRadius = Math.hypot(
      Math.max(center.x, width - center.x),
      Math.max(center.y, height - center.y)
    );

    var rippleSeeds = Array.from({ length: rippleCount }, function (_, index) {
      var column = index % rippleColumns;
      var row = Math.floor(index / rippleColumns);
      var x = width * ((column + 0.2 + Math.random() * 0.6) / rippleColumns);
      var y = height * ((row + 0.2 + Math.random() * 0.6) / rippleRows);
      var distanceFromOrigin = Math.hypot(x - center.x, y - center.y);
      var revealArrival = transitionArrival(Math.min(1, distanceFromOrigin / maxRevealRadius));
      var bandCells = MIN_RIPPLE_BAND_CELLS + Math.random() * (MAX_RIPPLE_BAND_CELLS - MIN_RIPPLE_BAND_CELLS);
      return {
        x: x, y: y,
        band: bandCells * cellSize,
        delay: revealArrival * TRANSITION_DURATION
      };
    });

    var rippleCentres = createRippleFields(rippleSeeds, center, width, height, cellSize);

    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.font = '700 ' + (isMobile ? 8 : 9) + "px 'Space Mono', monospace";
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    var rgb = targetTheme === 'dark' ? '255,255,255' : '17,24,39';
    var frame = 0;

    var mainCells = createMainField(center, width, height, mainCellSize);

    function drawMainReveal(radius) {
      var revealBand = mainCellSize * 3;
      var from = lowerBound(mainCells, Math.max(0, radius - revealBand));
      var to = lowerBound(mainCells, radius);
      for (var i = from; i < to; i++) {
        var cell = mainCells[i];
        var offset = radius - cell.distance;
        var alpha = Math.sin((offset / revealBand) * Math.PI) * 0.7 * cell.shimmer;
        if (alpha < 0.05) continue;
        context.fillStyle = 'rgba(' + rgb + ',' + alpha + ')';
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y);
      }
    }

    function drawLocalRipple(ripple, elapsed, revealedRadius) {
      var localElapsed = elapsed - ripple.delay;
      if (localElapsed <= 0) return;
      var collisionElapsed = elapsed - ripple.collisionTime;
      var collisionGlow = collisionElapsed <= 0
        ? 1
        : 1 + Math.max(0, 1 - collisionElapsed / COLLISION_OVERLAP_DURATION) * 0.8;
      var fadeElapsed = collisionElapsed - COLLISION_OVERLAP_DURATION;
      var collisionOpacity = fadeElapsed <= 0
        ? 1
        : Math.max(0, 1 - fadeElapsed / COLLISION_FADE_DURATION) ** 2;
      if (collisionOpacity <= 0) return;
      var rippleRadius = localElapsed * WAVE_SPEED;
      var from = lowerBound(ripple.cells, Math.max(0, rippleRadius - ripple.band));
      var to = lowerBound(ripple.cells, rippleRadius);
      for (var i = from; i < to; i++) {
        var cell = ripple.cells[i];
        if (cell.revealDistance > revealedRadius) continue;
        var offset = rippleRadius - cell.distance;
        var intensity = Math.sin((offset / ripple.band) * Math.PI);
        var alpha = Math.min(1, intensity * cell.shimmer * collisionGlow * collisionOpacity * 0.95);
        if (alpha < 0.08) continue;
        context.fillStyle = 'rgba(' + rgb + ',' + alpha + ')';
        context.fillText(cell.bit ? '1' : '0', cell.x, cell.y);
      }
    }

    var latestRippleEnd = Math.max.apply(null, rippleCentres.map(function (r) {
      return r.collisionTime + COLLISION_OVERLAP_DURATION + COLLISION_FADE_DURATION;
    }));
    var animationEnd = Math.max(TRANSITION_DURATION, latestRippleEnd);

    function draw(now) {
      var elapsed = now - startedAt;
      var progress = Math.min(elapsed / TRANSITION_DURATION, 1);
      var revealedRadius = transitionProgress(progress) * maxRevealRadius;
      context.clearRect(0, 0, width, height);
      if (elapsed < TRANSITION_DURATION) drawMainReveal(revealedRadius);
      rippleCentres.forEach(function (r) { drawLocalRipple(r, elapsed, revealedRadius); });
      if (elapsed < animationEnd) {
        frame = requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
        canvas.remove();
      }
    }

    frame = requestAnimationFrame(draw);
  }

  function toggleTheme(originX, originY) {
    var current = getTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    var origin = {
      x: typeof originX === 'number' ? originX : window.innerWidth / 2,
      y: typeof originY === 'number' ? originY : 32
    };

    var applyTheme = function () { setTheme(next, true); };

    var revealRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    );
    root.style.setProperty('--theme-transition-duration', TRANSITION_DURATION + 'ms');
    root.style.setProperty('--theme-origin-x', origin.x + 'px');
    root.style.setProperty('--theme-origin-y', origin.y + 'px');
    root.style.setProperty('--theme-reveal-radius', revealRadius + 'px');
    root.style.setProperty('--theme-reveal-pause-start', revealRadius * 0.315 + 'px');
    root.style.setProperty('--theme-reveal-pause-end', revealRadius * 0.357 + 'px');

    if (reduceMotion() || typeof doc.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    doc.startViewTransition(function () {
      applyTheme();
      runBinaryRipple(origin, next);
    });
  }

  function initTheme() {
    var transition = true;
    try {
      var cfg = JSON.parse(doc.body.getAttribute('data-sty-config') || '{}');
      if (cfg && cfg.theme && cfg.theme.transition === false) transition = false;
    } catch (e) { /* keep defaults */ }
    doc.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var x = e.clientX || e.pageX;
        var y = e.clientY || e.pageY;
        if (transition) {
          toggleTheme(x, y);
        } else {
          var current = getTheme();
          setTheme(current === 'dark' ? 'light' : 'dark', true);
        }
      });
    });
    updateToggleIcons(getTheme());
  }

  /* ==================================================================
   * MOBILE NAVIGATION (off-canvas sidebar)
   * ================================================================== */

  function initNav() {
    var openBtn = doc.querySelector('.js-nav-toggle');
    var closeBtn = doc.querySelector('.js-nav-close');
    var scrim = doc.querySelector('.js-nav-scrim');
    if (!openBtn || !closeBtn) return;

    function openNav() {
      doc.body.classList.add('nav-open');
      openBtn.setAttribute('aria-expanded', 'true');
      if (scrim) scrim.hidden = false;
    }
    function closeNav() {
      doc.body.classList.remove('nav-open');
      openBtn.setAttribute('aria-expanded', 'false');
      if (scrim) scrim.hidden = true;
    }

    openBtn.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    if (scrim) scrim.addEventListener('click', closeNav);
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ==================================================================
   * CODE COPY BUTTONS + GLARE
   * ================================================================== */

  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = doc.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand('copy'); } catch (e) { /* noop */ }
    doc.body.removeChild(ta);
    done();
  }

  function initCopyButtons() {
    doc.querySelectorAll('.highlighter-rouge').forEach(function (wrap) {
      if (wrap.parentElement && wrap.parentElement.classList.contains('code-block')) return;
      var block = doc.createElement('div');
      block.className = 'code-block';
      wrap.parentNode.insertBefore(block, wrap);
      block.appendChild(wrap);

      var btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
        '<span>copy</span>';
      block.appendChild(btn);

      btn.addEventListener('click', function () {
        var code = block.querySelector('code');
        var text = code ? code.innerText : block.innerText;
        copyText(text, function () {
          var span = btn.querySelector('span');
          span.textContent = 'copied';
          btn.classList.add('is-copied');
          var glare = doc.createElement('span');
          glare.className = 'code-copy-glare';
          glare.setAttribute('aria-hidden', 'true');
          block.appendChild(glare);
          setTimeout(function () {
            btn.classList.remove('is-copied');
            span.textContent = 'copy';
            if (glare.parentNode) glare.parentNode.removeChild(glare);
          }, 1600);
        });
      });
    });
  }

  /* ==================================================================
   * TABLE WRAPPERS (horizontal scroll on small screens)
   * ================================================================== */

  function initTableWrappers() {
    doc.querySelectorAll('.sty-prose > table, .sty-prose table').forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains('table-scroll')) return;
      var wrap = doc.createElement('div');
      wrap.className = 'table-scroll';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  /* ==================================================================
   * HEADING ANCHOR LINKS
   * ================================================================== */

  function initHeadingAnchors() {
    doc.querySelectorAll('.sty-prose h2, .sty-prose h3, .sty-prose h4').forEach(function (h) {
      if (!h.id || h.querySelector('.anchor-link')) return;
      var a = doc.createElement('a');
      a.className = 'anchor-link';
      a.href = '#' + h.id;
      a.setAttribute('aria-label', 'Link to this section');
      a.textContent = '#';
      h.appendChild(a);
    });
  }

  /* ==================================================================
   * MERMAID (lazy, only when a ```mermaid fence exists)
   * ================================================================== */

  function initMermaid() {
    var blocks = doc.querySelectorAll('pre > code.language-mermaid');
    if (!blocks.length) return;

    blocks.forEach(function (code) {
      var pre = code.parentElement;
      var chart = code.textContent.trim();
      var viewport = doc.createElement('div');
      viewport.className = 'mermaid-viewport';
      var diagram = doc.createElement('div');
      diagram.className = 'mermaid-diagram';
      diagram.setAttribute('data-chart', chart);
      viewport.appendChild(diagram);
      pre.replaceWith(viewport);
    });

    var script = doc.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = function () {
      if (!window.mermaid) return;
      window.mermaid.initialize({
        startOnLoad: false,
        theme: getTheme() === 'dark' ? 'dark' : 'neutral',
        fontFamily: "'Space Mono', monospace"
      });
      doc.querySelectorAll('.mermaid-diagram[data-chart]').forEach(function (dia, i) {
        var chart = dia.getAttribute('data-chart');
        dia.removeAttribute('data-chart');
        window.mermaid.render('mermaid-' + Date.now() + '-' + i, chart).then(function (res) {
          dia.innerHTML = res.svg;
        }).catch(function () {
          dia.textContent = 'Mermaid failed to render this diagram.';
        });
      });
    };
    doc.head.appendChild(script);
  }

  /* ==================================================================
   * INIT
   * ================================================================== */

  function init() {
    initTheme();
    initNav();
    initCopyButtons();
    initTableWrappers();
    initHeadingAnchors();
    initMermaid();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/*!
 * Stygian - docs theme engine (vanilla JS, no dependencies)
 * Modules: theme switch (clean crossfade, no ripple), mobile navigation
 * drawer, code copy buttons, table wrappers, heading anchors, lazy
 * Mermaid rendering.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var STORAGE_KEY = 'stygian-theme';

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ==================================================================
   * THEME - data-theme swap
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

  /* Theme swap with no decoration: no ripple, no expanding circle.
     Uses the browser's default View Transition crossfade when available;
     instant otherwise (or with reduced motion). */
  function toggleTheme() {
    var current = getTheme();
    var next = current === 'dark' ? 'light' : 'dark';

    var applyTheme = function () { setTheme(next, true); };

    if (reduceMotion() || typeof doc.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    var transition = doc.startViewTransition(function () {
      applyTheme();
    });
    /* No post-transition effects: the transition is left to finish. */
  }

  function initTheme() {
    var useTransition = true;
    try {
      var cfg = JSON.parse(doc.body.getAttribute('data-sty-config') || '{}');
      if (cfg && cfg.theme && cfg.theme.transition === false) useTransition = false;
    } catch (e) { /* keep defaults */ }
    doc.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!useTransition) {
          var current = getTheme();
          setTheme(current === 'dark' ? 'light' : 'dark', true);
          return;
        }
        toggleTheme();
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
      // fenced blocks only: inline code carries the class too, skip it
      if (wrap.tagName !== 'DIV') return;
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
    doc.querySelectorAll('.sty-prose table').forEach(function (table) {
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

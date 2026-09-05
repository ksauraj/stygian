/*!
 * Stygian - docs theme engine (vanilla JS, no dependencies)
 * Modules: theme switch (circular reveal transition, no ripple), mobile
 * navigation drawer, code copy buttons, table wrappers, heading anchors,
 * lazy Mermaid rendering.
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

  /* Theme swap: circular reveal from the click point via View
     Transitions. No post-transition ripple of any kind. Mermaid diagrams
     are re-rendered with the new theme once the reveal has finished. */
  function toggleTheme(originX, originY) {
    var current = getTheme();
    var next = current === 'dark' ? 'light' : 'dark';

    var applyTheme = function () { setTheme(next, true); };
    var refreshDiagrams = function () { renderMermaidDiagrams(); };

    // Circular reveal parameters (origin + radius as CSS variables).
    var origin = {
      x: typeof originX === 'number' ? originX : window.innerWidth / 2,
      y: typeof originY === 'number' ? originY : 32
    };
    var revealRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    );
    root.style.setProperty('--theme-origin-x', origin.x + 'px');
    root.style.setProperty('--theme-origin-y', origin.y + 'px');
    root.style.setProperty('--theme-reveal-radius', revealRadius + 'px');

    if (reduceMotion() || typeof doc.startViewTransition !== 'function') {
      applyTheme();
      refreshDiagrams();
      return;
    }

    var transition = doc.startViewTransition(function () {
      applyTheme();
    });
    if (transition && transition.finished && typeof transition.finished.then === 'function') {
      transition.finished.then(refreshDiagrams);
    } else {
      refreshDiagrams();
    }
  }

  function initTheme() {
    var useTransition = true;
    try {
      var cfg = JSON.parse(doc.body.getAttribute('data-sty-config') || '{}');
      if (cfg && cfg.theme && cfg.theme.transition === false) useTransition = false;
    } catch (e) { /* keep defaults */ }
    doc.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var x = e.clientX || e.pageX;
        var y = e.clientY || e.pageY;
        if (!useTransition) {
          var current = getTheme();
          setTheme(current === 'dark' ? 'light' : 'dark', true);
          renderMermaidDiagrams();
          return;
        }
        toggleTheme(x, y);
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

  // Render every pending diagram with the palette matching the active
  // theme. The chart source stays in data-chart so diagrams can be
  // re-rendered after a theme switch (SVG colors are baked at render
  // time, so a stale diagram goes faint when the theme flips).
  function renderMermaidDiagrams() {
    var diagrams = doc.querySelectorAll('.mermaid-diagram[data-chart]');
    if (!diagrams.length || !window.mermaid) return;
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: getTheme() === 'dark' ? 'dark' : 'neutral',
        fontFamily: "'Space Mono', monospace"
      });
    } catch (e) { return; }
    diagrams.forEach(function (dia, i) {
      var chart = dia.getAttribute('data-chart');
      window.mermaid.render('mermaid-' + Date.now() + '-' + i, chart).then(function (res) {
        if (!dia.isConnected) return;
        dia.innerHTML = res.svg;
      }).catch(function () {
        if (dia.isConnected) dia.textContent = 'Mermaid failed to render this diagram.';
      });
    });
  }

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
      renderMermaidDiagrams();
    };
    doc.head.appendChild(script);
  }

  /* ==================================================================
   * SEARCH (client-side, index fetched from search-data.json)
   * ================================================================== */

  var styCfg = null;

  function readConfig() {
    if (styCfg) return styCfg;
    try { styCfg = JSON.parse(doc.body.getAttribute('data-sty-config') || '{}'); }
    catch (e) { styCfg = {}; }
    return styCfg;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  var searchIndex = null;
  var searchIndexPromise = null;

  function loadSearchIndex(baseurl) {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch(baseurl + '/assets/js/search-data.json', { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('search index ' + r.status); return r.json(); })
        .then(function (json) { searchIndex = json || []; })
        .catch(function () { searchIndex = []; });
    }
    return searchIndexPromise;
  }

  function searchDocs(query, index) {
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length || !index.length) return [];
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var doc = index[i];
      var title = (doc.title || '').toLowerCase();
      var content = (doc.content || '').toLowerCase();
      var score = 0;
      var hit = true;
      for (var t = 0; t < tokens.length; t++) {
        var tok = tokens[t];
        var inTitle = title.indexOf(tok) !== -1;
        var inContent = content.indexOf(tok) !== -1;
        if (!inTitle && !inContent) { hit = false; break; }
        if (title.indexOf(tok) === 0) score += 30;
        else if (inTitle) score += 18;
        if (inContent) score += Math.min(6, (content.split(tok).length - 1)) * 3;
      }
      if (hit) scored.push({ doc: doc, score: score });
    }
    scored.sort(function (a, b) { return b.score - a.score || String(a.doc.title).localeCompare(String(b.doc.title)); });
    return scored.slice(0, 12).map(function (s) { return s.doc; });
  }

  function snippetFor(doc, query) {
    var content = String(doc.content || '');
    var text = content.replace(/\s+/g, ' ').trim();
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var at = -1;
    for (var i = 0; i < tokens.length; i++) {
      at = text.toLowerCase().indexOf(tokens[i]);
      if (at !== -1) break;
    }
    if (at === -1) at = 0;
    var start = Math.max(0, at - 55);
    var end = Math.min(text.length, start + 150);
    if (end - start < 150) start = Math.max(0, end - 150);
    return { text: text.slice(start, end), lead: start > 0, trail: end < text.length, at: at - start };
  }

  function appendHighlighted(parent, text, query) {
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var re = new RegExp('(' + tokens.map(escapeRegExp).join('|') + ')', 'gi');
    var parts = text.split(re);
    // split() with a capturing group: even indexes are plain text,
    // odd indexes are the matched separators (the highlights)
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2 === 1) parent.appendChild(makeMark(parts[i]));
      else parent.appendChild(doc.createTextNode(parts[i]));
    }
  }

  function makeMark(text) {
    var m = doc.createElement('mark');
    m.textContent = text;
    return m;
  }

  function renderSearchResults(query, list, meta, index) {
    list.innerHTML = '';
    if (!query.trim()) {
      meta.textContent = 'Type to search the documentation.';
      return;
    }
    var hits = searchDocs(query, index);
    if (!hits.length) {
      meta.textContent = 'No results for "' + query + '".';
      return;
    }
    meta.textContent = hits.length + (hits.length === 1 ? ' result' : ' results') + ' for "' + query + '".';
    for (var i = 0; i < hits.length; i++) {
      var hit = hits[i];
      var li = doc.createElement('li');
      li.className = 'search-overlay__result';
      var a = doc.createElement('a');
      a.href = hit.url;
      var title = doc.createElement('span');
      title.className = 'search-overlay__result-title';
      appendHighlighted(title, hit.title || hit.url, query);
      var snip = doc.createElement('span');
      snip.className = 'search-overlay__result-snippet';
      var sn = snippetFor(hit, query);
      var body = doc.createElement('span');
      if (sn.lead) body.appendChild(doc.createTextNode('... '));
      appendHighlighted(body, sn.text, query);
      if (sn.trail) body.appendChild(doc.createTextNode(' ...'));
      snip.appendChild(body);
      a.appendChild(title);
      a.appendChild(snip);
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  function initSearch() {
    var cfg = readConfig();
    var searchCfg = cfg.search || {};
    if (searchCfg.enabled === false) return;
    var overlay = doc.querySelector('.js-search-overlay');
    var openBtn = doc.querySelector('.js-search-open');
    if (!overlay || !openBtn) return;
    var placeholder = searchCfg.placeholder || 'Search docs';
    var baseurl = searchCfg.baseurl || '';

    overlay.innerHTML =
      '<div class="search-overlay__panel">' +
        '<div class="search-overlay__bar">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          '<input type="search" class="search-overlay__input js-search-input" placeholder="' + escapeHtml(placeholder) + '" autocomplete="off" spellcheck="false" aria-label="Search">' +
          '<button type="button" class="search-overlay__close js-search-close">Esc</button>' +
        '</div>' +
        '<p class="search-overlay__meta js-search-meta">Type to search the documentation.</p>' +
        '<ul class="search-overlay__results js-search-results"></ul>' +
      '</div>';

    var input = overlay.querySelector('.js-search-input');
    var meta = overlay.querySelector('.js-search-meta');
    var list = overlay.querySelector('.js-search-results');

    function open() {
      overlay.hidden = false;
      doc.body.classList.add('modal-open');
      input.value = '';
      meta.textContent = 'Type to search the documentation.';
      list.innerHTML = '';
      input.focus();
      loadSearchIndex(baseurl);
    }
    function close() {
      overlay.hidden = true;
      doc.body.classList.remove('modal-open');
    }
    function onInput() {
      if (!searchIndex) { loadSearchIndex(baseurl).then(function () { renderSearchResults(input.value, list, meta, searchIndex); }); return; }
      renderSearchResults(input.value, list, meta, searchIndex);
    }

    openBtn.addEventListener('click', open);
    overlay.querySelector('.js-search-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var links = Array.prototype.slice.call(list.querySelectorAll('a'));
        if (!links.length) return;
        e.preventDefault();
        var cur = links.indexOf(doc.activeElement);
        var next = e.key === 'ArrowDown' ? Math.min(links.length - 1, cur + 1) : Math.max(0, cur - 1);
        if (cur !== -1) links[cur].classList.remove('is-active');
        links[next].classList.add('is-active');
        links[next].focus();
        return;
      }
      if (e.key === 'Enter') {
        var active = list.querySelector('a.is-active');
        var first = list.querySelector('a');
        var target = active || first;
        if (target) { e.preventDefault(); window.location.href = target.href; }
      }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === '/' && overlay.hidden) {
        var tag = (doc.activeElement && doc.activeElement.tagName) || '';
        var typing = tag === 'INPUT' || tag === 'TEXTAREA' || (doc.activeElement && doc.activeElement.isContentEditable);
        if (!typing) { e.preventDefault(); open(); }
      }
    });
  }

  /* ==================================================================
   * BACK TO TOP (floating button)
   * ================================================================== */

  function initBackToTop() {
    var cfg = readConfig();
    if (cfg.back_to_top === false) return;
    var btn = doc.querySelector('.js-back-to-top');
    if (!btn) return;
    var ticking = false;

    function update() {
      ticking = false;
      btn.hidden = window.pageYOffset < 560;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();

    btn.addEventListener('click', function () {
      var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
  }

  /* ==================================================================
   * INIT
   * ================================================================== */

  function init() {
    initTheme();
    initNav();
    initSearch();
    initBackToTop();
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

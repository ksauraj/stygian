<div align="center">

# Stygian

**A modern docs theme for Jekyll and GitHub Pages.**

Markdown in, docs site out: sidebar navigation, prev/next browsing, dark and
light themes with a binary-ripple transition. No frameworks, no build step.

[Live demo](https://ksauraj.github.io/stygian/) · [MIT License](LICENSE)

</div>

Stygian is a docs-first Jekyll theme in the spirit of just-the-docs, with a
modern look: drop markdown files into a `_docs/` collection and the engine
renders a documentation site with ordered sidebar navigation, nested
sections, prev/next page links and a prose engine that makes code, tables,
callouts and Mermaid diagrams look sharp.

## Why Stygian

- **Markdown in, docs out.** The theme is an engine, not a template. No
  homepage sections, no portfolio chrome, no loaders. Just your docs.
- **Modern light and dark themes.** Every color is an RGB-triplet CSS custom
  property swapped on `html[data-theme]`; prose, code blocks and glow all
  re-tokenize per mode.
- **Binary-ripple theme transition.** The sun/moon toggle expands a
  full-screen wave of 0/1 glyphs from the click point using the View
  Transitions API: collision-aware ripple rings, 12 to 20 glyph-cell bands,
  sync with the reveal curve. Falls back to an instant swap without the API
  and under `prefers-reduced-motion`.
- **Flicker and glare accents.** A restrained effect suite driven by the
  glow token: toggle border flicker, code-copy glare sweep, hover glare on
  prev/next cards. Never gates content.
- **just-the-docs conventions.** `nav_order`, `parent`, `nav_exclude` and
  a docs collection are all you need to know.
- **Zero framework.** Plain CSS variables, one dependency-free vanilla JS
  file, Google Fonts only. No Sass pipeline, no npm.
- **Accessible.** Skip link, focus rings, reduced-motion support, no-JS
  fallback for the saved theme, mobile drawer that closes on Escape.

## Quick start

On GitHub Pages, add to `_config.yml`:

```yaml
remote_theme: ksauraj/stygian

collections:
  docs:
    output: true
    permalink: /:collection/:path/
```

Create `_docs/` and write your first page:

```markdown
---
title: Getting started
nav_order: 1
---
Everything here renders with the Stygian prose engine.
```

Push and your docs are live. The full annotated example lives in this
repo: browse the `_docs/` folder to see markdown for nested navigation,
code, tables, callouts and Mermaid, then read the rendered result in the
live demo.

## Local development

```bash
git clone https://github.com/ksauraj/stygian.git
cd stygian
bundle install
bundle exec jekyll serve --livereload
```

## Page front matter

| Key | Meaning |
| --- | --- |
| `title` | Page heading and sidebar label |
| `lede` | One-line subtitle under the heading |
| `nav_order` | Sidebar position, lowest first |
| `parent` | Basename of the parent page (one level of nesting) |
| `nav_exclude` | `true` removes the page from navigation |

## Theme configuration

```yaml
stygian:
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/yourname/yourrepo }
  theme:
    default: dark    # dark or light
    transition: true # set false to disable the ripple animation
  nav:
    title: Docs      # sidebar heading
  footer:
    note: Your project docs
    right: "© 2026 Your Name"
```

## File map

```text
_layouts/            default (chrome) . page (no sidebar) . docs (sidebar)
_includes/           head, header, nav-list, prev-next, footer, scripts
assets/css/          stygian.css - tokens, prose, docs layout, effects
assets/js/           stygian.js  - theme ripple, drawer, copy, mermaid
_docs/               sample markdown collection (this site's content)
index.md              landing page
.github/workflows/   GitHub Pages deployment for the live demo
```

## Customizing

Copy `assets/css/stygian.css` conventions and override any token in your
own stylesheet; every rule reads through the variables, so a two-line
override re-skins the site including the ripple color. To replace the
prose or layout behavior, copy the include or layout you want to change
into your site with the same path.

## Keywords

modern jekyll docs theme, just-the-docs alternative, jekyll documentation
theme, github pages docs, markdown documentation site, jekyll sidebar
navigation, nested docs navigation, dark mode docs, light mode docs, view
transitions theme, jekyll prose engine, mermaid jekyll docs, copy code
button, responsive docs theme, accessible jekyll theme, reduced motion,
jekyll collection docs, vanilla javascript theme, css custom properties

## Credits and license

Designed for and inspired by the UI language of
[ksau-portfolio](https://github.com/ksauraj/ksau-portfolio): its binary
ripple transition, flicker suite and light mode treatment were
re-implemented here in dependency-free JavaScript and CSS, stripped down to
a pure docs engine.

Released under the [MIT License](LICENSE). Copyright (c) 2026 Sauraj Kumar
Singh (ksauraj).

---
title: Customization
nav_order: 4
lede: >
  Four ways to make Stygian yours: configuration, extension hooks,
  token overrides and full file shadows.
---

## 1. Configuration

Almost every behavior is a key under `stygian:` - see
[Configuration](configuration). Most common customization:

```yaml
stygian:
  nav:
    title: User guide
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/you/repo }
    aux_links_new_tab: true
  theme:
    default: dark
  edit:
    enabled: true
    repo: https://github.com/you/repo
    branch: main
```

## 2. Extension hooks (recommended)

The theme ships four empty include files and renders them at fixed
points. To add your own markup, create a file with the same name in
your site's `_includes/` - your file shadows the theme's empty one:

| Hook | Rendered | Typical use |
| --- | --- | --- |
| `head_custom.html` | end of `<head>` | fonts, extra meta, analytics |
| `header_custom.html` | bottom of the header bar | announcement strip, badge |
| `footer_custom.html` | bottom of the footer | license, social links |
| `nav_footer_custom.html` | bottom of the sidebar | version label, feedback |

Example - a version badge under the sidebar:

```html
<!-- _includes/nav_footer_custom.html -->
<p class="mono-xs">Docs v1.4</p>
```

## 3. Token overrides

Colors and spacing are CSS custom properties. Override them in a
`head_custom.html` include to re-skin the theme without forking files:

```html
<style>
  :root {
    /* color tokens are "r g b" triplets used as rgb(var(--token)) */
    --color-surface: 24 26 30;      /* panels, chips */
    --color-border: 52 56 62;       /* hairline borders */
    --theme-glow: 45 212 191;       /* teal accent glow */
  }
</style>
```

The full token reference lives in [Theming](customization/theming).

## 4. Shadowing theme files

For deep changes, copy any theme file into your site at the same path
and edit it:

- `_includes/header.html` - header structure
- `_includes/nav-list.html` - sidebar generation
- `assets/css/stygian.css` - the whole design system
- `assets/js/stygian.js` - all behavior

Files in your site always win over theme files with the same path.

## Layouts

| Layout | Used for | Renders |
| --- | --- | --- |
| `docs` | pages in the docs collection | sidebar + breadcrumbs + article + prev/next |
| `page` | standalone pages | header + article + footer |
| `default` | base chrome | every page inherits it |

Give a regular page the docs sidebar by setting `layout: docs` and
giving it `nav_order` front matter - the sidebar sources the collection,
not the layout, so it will not appear there unless the file lives in
the collection.

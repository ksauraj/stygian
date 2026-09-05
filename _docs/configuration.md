---
title: Configuration
nav_order: 2
lede: >
  Every option the theme reads, with a runnable example for each group.
---

## Layout of the config

Site-level Jekyll options live at the top of `_config.yml` (`title`,
`description`, `url`, `baseurl`). Theme options live under `stygian:`.

```yaml
title: My docs          # used in <title>, header and WebSite JSON-LD
description: >-         # used for meta description when a page has none
  Short site description.

remote_theme: ksauraj/stygian   # GitHub Pages
# theme: stygian               # or install the gem instead

collections:
  docs:
    output: true
    permalink: /:collection/:path/

defaults:
  - scope:
      path: ""
      type: docs
    values:
      layout: docs
```

The collection block and defaults are the standard wiring: every file in
`_docs/` becomes a docs page. If you prefer a different collection name,
keep the name in sync with `stygian.nav.collection`.

## Navigation

| Key | Default | Meaning |
| --- | --- | --- |
| `stygian.nav.title` | `Docs` | Heading at the top of the sidebar |
| `stygian.nav.collection` | `docs` | Collection rendered in the sidebar |

```yaml
stygian:
  nav:
    title: Guide
    collection: docs
```

Per-page front matter: `nav_order` (order in the sidebar, lowest first),
`parent` (filename of the parent page, no extension), `nav_exclude`
(hide from the sidebar) and `search_exclude` (keep the page, hide it
from search).

## Header

```yaml
stygian:
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/you/repo }
      - { label: Releases, href: https://github.com/you/repo/releases }
    aux_links_new_tab: true   # open aux links in a new tab
```

The brand title links to the site root and comes from `site.title`. The
hamburger and search button are added automatically on docs pages.

## Theme

```yaml
stygian:
  theme:
    default: dark     # 'dark' or 'light'; fallback before a visitor choice
    transition: true  # circular View Transitions reveal; false = instant
```

Visitors override the default from the sun/moon toggle; their choice is
kept in `localStorage` and applied before first paint (no flash).

## Search

```yaml
stygian:
  search:
    enabled: true
    placeholder: Search docs
```

Search is client-side over a Liquid-generated index at
`assets/js/search-data.json`. Pages whose front matter sets
`search_exclude: true` are skipped. The index covers the docs
collection only.

## Back to top

```yaml
stygian:
  back_to_top: true
```

A floating button appears after 560 px of scrolling. The footer keeps
its static `[ back to top ]` link either way.

## SEO

```yaml
stygian:
  seo:
    enabled: true
    image: /assets/img/og.png   # optional; relative or absolute URL
```

When enabled the theme emits WebSite JSON-LD in the head, BreadcrumbList
JSON-LD on every docs page, Open Graph tags and a Twitter card. Set
`stygian.seo.enabled: false` to strip them (description and canonical
stay: they are plain meta). See [SEO](seo).

## Edit this page

```yaml
stygian:
  edit:
    enabled: true
    repo: https://github.com/you/repo
    branch: main       # branch the docs are served from
    view: tree         # or 'edit' to jump into the GitHub editor
```

The link points at `repo/view/branch/<page.path>` - for a site served
from `gh-pages`, set `branch: gh-pages`.

## Footer

```yaml
stygian:
  footer:
    note: My docs                 # left text, defaults to site.title
    right: "MIT licensed"         # right text, optional
```

For anything richer, shadow `_includes/footer_custom.html` in your site.

## Kramdown and plugins

The demo site uses GFM kramdown, Rouge highlighting and the
`jekyll-sitemap` plugin. Those are site choices, not theme requirements:
the theme works with plain `markdown: kramdown` and no plugins. The only
hard requirement is a docs collection with `output: true`.

## Per-page front matter summary

```yaml
---
title: Page title       # H1, sidebar label, <title>, JSON-LD
nav_order: 5            # sidebar position
parent: guide           # filename of the parent page (optional)
nav_exclude: true       # optional: hide from sidebar
search_exclude: true    # optional: hide from search index
lede: >                 # optional: subtitle under the H1
  One-line summary.
description: >-         # optional: overrides SEO meta description
  Longer page description for search engines.
---
```

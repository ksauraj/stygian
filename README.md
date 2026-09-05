# Stygian

A modern docs-first theme for Jekyll and GitHub Pages. Drop markdown into
a docs collection, get a documentation site with search, dark/light
themes, breadcrumbs, prev/next paging and automatic SEO. No frameworks,
no build step: CSS custom properties plus one vanilla JavaScript file.

**Live demo:** <https://ksauraj.github.io/stygian>

## Why Stygian

Stygian is built in the spirit of just-the-docs but modernized:

| Capability | Stygian | just-the-docs |
| --- | --- | --- |
| Dark/light themes | Built-in pair, visitor toggle, saved preference | Per-site color scheme, no visitor toggle |
| Theme switch | View Transitions circular reveal | Instant |
| Search | Client-side, no plugin, `/` shortcut | Plugin-free index, overlay |
| Breadcrumbs | Every docs page | Nested pages only |
| Inline code | Atomic chips, never split at hyphens | Can split tokens mid-word |
| SEO | Auto JSON-LD + Open Graph, switchable | Manual |
| Page caching | Versioned assets (`?v=N`) | Plain URLs |
| Dependencies | Zero (one vanilla JS file) | One JS file + vendor |

## Features

Content engine

- Ordered sidebar navigation: `nav_order`, one-level `parent` nesting,
  `nav_exclude`, active state and collapsible mobile drawer
- Breadcrumbs (Home / section / page) and prev/next page cards
- Client-side search across the docs collection: header magnifier or `/`
  shortcut, ranked results, `<mark>` highlights, snippets, arrow keys and
  Enter to open
- Prose engine: callouts (`{: .callout }`), scrollable tables, code
  blocks with copy buttons, lazy Mermaid diagrams, heading anchors
- "Edit this page on GitHub" links driven by config
- Back-to-top button

Theming and motion

- Dark and light design systems on CSS custom properties
- Saved theme preference (localStorage) with no-flash boot
- View Transitions circular reveal on theme switch
- Restrained flicker/glare accents; everything disabled under
  `prefers-reduced-motion`

SEO and publishing

- `stygian.seo.enabled` (default on): WebSite JSON-LD, BreadcrumbList
  JSON-LD on docs pages, Open Graph, Twitter card, optional
  `stygian.seo.image`
- Automatic description and canonical URL; sitemap via `jekyll-sitemap`
  when you add it
- Versioned assets so Pages deploys never serve stale CSS/JS

Engineering

- Zero runtime dependencies, one vanilla JS file
- Extension hooks: `head_custom`, `header_custom`, `footer_custom`,
  `nav_footer_custom` - shadow them in your site's `_includes/`
- RSpec smoke suite that builds the demo site and asserts output
  invariants; CI matrix; gem-publish workflow on tags
- Immutable SemVer releases (alpha, beta, rc, stable) - see
  [CHANGELOG.md](CHANGELOG.md)

## Quick start (GitHub Pages)

Add this to your site's `_config.yml`:

```yaml
remote_theme: ksauraj/stygian

title: My docs
description: Short site description used for SEO meta.
```

Create `_docs/` and drop markdown files in it. Each file becomes a page:

```markdown
---
title: Installation
nav_order: 2
---

# Installation

Your content here. Front matter `title` and `nav_order` drive the sidebar.
```

Then commit and push; GitHub Pages renders the site. Layout and URLs:

- `_docs/foo.md` renders at `/docs/foo/`
- `layout: docs` is applied automatically via config defaults

## Quick start (Ruby gem)

```ruby
# Gemfile
gem "stygian"
```

```yaml
# _config.yml
theme: stygian
```

```shell
bundle
bundle exec jekyll serve
```

## Configuration

Everything lives under the `stygian:` key:

```yaml
stygian:
  nav:
    title: Docs          # sidebar heading (default "Docs")
    collection: docs     # collection rendered in the sidebar
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/you/repo }
    aux_links_new_tab: true
  theme:
    default: dark        # fallback theme before the visitor's choice
    transition: true     # circular reveal on switch; false = instant
  search:
    enabled: true
    placeholder: Search docs
  back_to_top: true
  seo:
    enabled: true
    # image: /assets/og.png   # optional Open Graph image
  edit:
    enabled: true
    repo: https://github.com/you/repo
    branch: main
    view: tree           # or "edit" to jump into the editor
  footer:
    note: your site name
    right: "Copyright and so on"
```

Per-page front matter: `title`, `nav_order`, `nav_exclude`, `parent`,
`lede` (subtitle under the H1), `description` (SEO override), `hide` a
page from search with `search_exclude`.

## Extending

- **Custom hooks** - create `_includes/head_custom.html`,
  `_includes/header_custom.html`, `_includes/footer_custom.html` or
  `_includes/nav_footer_custom.html` in your site; your file shadows the
  theme's empty hook and is rendered in the matching place.
- **Theming** - override the CSS custom properties, e.g. in a
  `head_custom.html` include. The full token list lives in the
  [Theming](https://ksauraj.github.io/stygian/docs/theming/) doc.
- **Code** - the theme is one CSS file and one JS file under `assets/`;
  copy them into your site to fork the styling entirely.

## Development

```shell
bundle install
bundle exec jekyll serve   # this repo is itself the demo site
bundle exec rspec          # build smoke tests
node --check assets/js/stygian.js
```

Releases are cut from version tags (`v0.1.0`, `v0.2.0-beta1`, ...) by
the publish workflow; see [CHANGELOG.md](CHANGELOG.md).

## License

MIT - see [LICENSE](LICENSE).

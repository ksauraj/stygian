# Stygian

A modern docs-first theme for Jekyll and GitHub Pages, built as a
drop-in alternative to just-the-docs: same front matter, same config
keys, same component classes - plus dark/light visitor theming,
automatic SEO, prev/next paging and code copy buttons. No frameworks,
no build step: CSS custom properties plus one vanilla JavaScript file.

[![CI](https://github.com/ksauraj/stygian/actions/workflows/ci.yml/badge.svg)](https://github.com/ksauraj/stygian/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Live demo:** <https://ksauraj.github.io/stygian>

## Why Stygian

| Capability | Stygian | just-the-docs |
| --- | --- | --- |
| Dark/light themes | Built-in pair, visitor toggle, saved preference | Per-site color scheme, no visitor toggle |
| Theme switch | View Transitions circular reveal | Instant |
| Search | Client-side, no plugin, `/` shortcut | Plugin-free index, overlay |
| Migration | JTD front matter + config keys work as-is | - |
| Breadcrumbs | Every docs page | Nested pages only |
| Prev/next paging | Every docs page | Not available |
| Inline code | Atomic chips, never split at hyphens | Can split tokens mid-word |
| SEO | Auto JSON-LD + Open Graph, switchable | Manual |
| Syntax highlighting | Optional, dark/light aware | Built-in |
| Dependencies | Zero (one vanilla JS file) | One JS file + vendor |

## Features

Content engine

- Just-the-docs compatible navigation: parents by page title,
  unlimited depth, `nav_order` as numbers or strings, `nav_sort`,
  `nav_exclude`, `has_toc`, automatic child lists on parent pages,
  external nav links, `nav_enabled` global toggle, multi-collection
  categories (`just_the_docs.collections`) with `nav_fold`
- Breadcrumbs (Home / section / page) and prev/next page cards
- Client-side search across pages and collections, split into sections
  by `heading_level`: ranked results with per-section previews,
  `<mark>` highlights, configurable word windows, `/` and `ctrl/cmd+k`
  shortcuts, optional floating search button
- Prose engine: buttons, labels and callouts with JTD class names,
  scrollable tables, code blocks with copy buttons and optional line
  numbers, lazy theme-aware Mermaid, heading anchors, definition lists
- "Edit this page on GitHub" links (native `stygian.edit` or JTD
  `gh_edit_link`)
- Back-to-top button; print stylesheet

Theming and motion

- Dark and light design systems on CSS custom properties, `color_scheme`
  alias for JTD sites
- Saved theme preference (localStorage) with no-flash boot
- View Transitions circular reveal on theme switch
- Restrained flicker/glare accents; everything disabled under
  `prefers-reduced-motion`

SEO and publishing

- Automatic WebSite + BreadcrumbList JSON-LD, Open Graph, Twitter card
- Automatic description and canonical URL
- Optional rouge syntax highlighting (`stygian.syntax_highlighting`)
- Versioned assets so Pages deploys never serve stale CSS/JS

Engineering

- Zero runtime dependencies, one vanilla JS file
- Extension hooks: `head_custom`, `header_custom`, `footer_custom`,
  `nav_footer_custom` - shadow them in your site's `_includes/`
- RSpec smoke suite that builds the demo site and asserts output
  invariants; CI matrix on Ruby 3.2/3.3
- Gap analysis and roadmap against just-the-docs:
  [GAP-ANALYSIS.md](GAP-ANALYSIS.md)

## Quick start (GitHub Pages)

Add this to your site's `_config.yml`:

```yaml
remote_theme: ksauraj/stygian

title: My docs
description: Short site description used for SEO meta.

collections:
  docs:
    output: true
    permalink: /:path/

defaults:
  - scope:
      path: ""
      type: docs
    values:
      layout: docs
```

Create `_docs/` and drop markdown files in it:

```markdown
---
title: Installation
nav_order: 2
---

Your content here. Front matter `title` and `nav_order` drive the sidebar.
```

Commit and push; GitHub Pages renders the site.

## Migrating from just-the-docs

Point the remote theme at Stygian. Your front matter, config keys,
buttons, labels and callouts keep working:

```yaml
# before
remote_theme: just-the-docs/just-the-docs

# after
remote_theme: ksauraj/stygian
```

See the full guide: [Migration from just-the-docs](https://ksauraj.github.io/stygian/docs/migration-from-just-the-docs/).

## Configuration

Everything native lives under the `stygian:` key; just-the-docs keys
(`aux_links`, `color_scheme`, `search_enabled`, `heading_anchors`,
`nav_sort`, `nav_external_links`, `footer_content`, `gh_edit_link`,
`logo`, `favicon_ico`, `mermaid`, ...) are honored as aliases.

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
  syntax_highlighting:
    enabled: true        # optional rouge token colors (dark/light aware)
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

Per-page front matter: `title`, `nav_order` (number or string),
`parent` (by title), `grand_parent`, `has_children`, `has_toc`,
`nav_exclude`, `search_exclude`, `lede` (subtitle under the H1),
`description` (SEO override).

## Extending

- **Custom hooks** - create `_includes/head_custom.html`,
  `_includes/header_custom.html`, `_includes/footer_custom.html` or
  `_includes/nav_footer_custom.html` in your site; your file shadows the
  theme's empty hook and is rendered in the matching place.
- **Theming** - override the CSS custom properties in a
  `head_custom.html` include. The full token list lives in the
  Theming doc.
- **Code** - the theme is one CSS file and one JS file under `assets/`;
  copy them into your site to fork the styling entirely.

## Contributing

Bug reports, docs fixes and feature implementations are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md), the
[Contributing](https://ksauraj.github.io/stygian/docs/contributing/) doc
and the issue templates. All contributors are expected to follow the
[Contributor Covenant](CODE_OF_CONDUCT.md); security issues go through
the [security advisory workflow](SECURITY.md).

## Development

```shell
bundle install
bundle exec jekyll serve --config _config.demo.yml   # this repo is itself the demo site
bundle exec rake spec      # build smoke tests
node --check assets/js/stygian.js
```

The demo site has its own `_config.demo.yml` so the theme root ships no
`_config.yml`: consumers never inherit demo defaults (Jekyll merges a
theme's `_config.yml` when present).

Releases bump `lib/stygian/version.rb` and the matching `?v=` asset
strings together, then tag `v<X.Y.Z>`; see
[CHANGELOG.md](CHANGELOG.md) and the release section of
[CONTRIBUTING.md](CONTRIBUTING.md).

## Versioning

Stygian follows SemVer, just-the-docs style: changes accumulate on
`main` and are released as coherent milestones, not per-commit bumps.

- `lib/stygian/version.rb` is the source of truth
- the asset query strings (`?v=`) in the theme includes are tied to the
  gem version (the spec suite fails the build if they drift)
- every release gets a `v<X.Y.Z>` git tag and a CHANGELOG section;
  tags are never rewritten
- consumers on GitHub Pages pick the theme up on their next rebuild;
  the versioned asset URLs bust the Pages CDN cache automatically

See [CHANGELOG.md](CHANGELOG.md) and the release section of
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT - see [LICENSE](LICENSE).

---
title: Getting started
nav_order: 1
lede: >
  From zero to a documentation site on GitHub Pages in five minutes.
---

## One paragraph

Stygian is a Jekyll theme for documentation. You write plain markdown
files in a `_docs/` folder; the theme renders them as pages with a
sidebar, search, breadcrumbs, prev/next paging, dark and light themes and
automatic SEO. No frameworks and no build step: plain CSS variables and
one vanilla JavaScript file.

## Use it on GitHub Pages

Point your site at the theme in `_config.yml`:

```yaml
remote_theme: ksauraj/stygian

title: Your docs
description: Short description used for the site meta and SEO.
```

Create `_docs/` and add your first page:

```markdown
---
title: Hello world
nav_order: 1
---

# Hello world

Welcome to your documentation.
```

Commit and push. GitHub Pages builds the site and publishes it. The
`_docs/hello-world.md` file becomes a page at `/docs/hello-world/`, with
a sidebar entry, a search hit and a breadcrumb.

> **Tip:** the sidebar order comes from `nav_order` (lowest first). Ties
> break alphabetically by title. Omit nothing: every page should declare
> a `title` and a `nav_order`.

## Or install the gem

For local development or non-Pages hosting, install the theme as a gem:

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

## What you get for free

- Ordered sidebar with nested pages (`parent:` front matter)
- Search across all docs pages: click the magnifier or press `/`
- Breadcrumbs and prev/next cards on every page
- Dark and light themes with a saved preference and a circular reveal
  transition when switching
- Copy buttons on code blocks, scrollable tables, callouts, lazy
  Mermaid diagrams
- Automatic SEO: WebSite and BreadcrumbList JSON-LD, Open Graph tags
  (disable with `stygian.seo.enabled: false`)
- Versioned assets - a deployed update is visible immediately, not after
  a ten-minute cache window

## Try the full example config

```yaml
remote_theme: ksauraj/stygian

title: Acme docs
description: Documentation for the Acme platform.

stygian:
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/acme/acme }
    aux_links_new_tab: true
  theme:
    default: dark
  search:
    enabled: true
  seo:
    enabled: true
  edit:
    enabled: true
    repo: https://github.com/acme/acme
    branch: main
    view: tree
  footer:
    note: Acme docs
    right: "MIT licensed"
```

For every option, see [Configuration](configuration).

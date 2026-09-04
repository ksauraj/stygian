---
title: Getting started
nav_order: 1
lede: >
  Install Stygian, drop in markdown, publish. This theme only renders the
  docs you write; every page in your docs collection becomes a sidebar entry
  with prev/next navigation, exactly like the site you are reading.
---
## What Stygian is

Stygian is a modern, docs-first Jekyll theme for GitHub Pages. It replaces
old-school docs engines (the just-the-docs family) while keeping the same
conventions you already know:

- plain markdown files under a `_docs/` folder
- sidebar navigation ordered with `nav_order`
- nested sections via `parent`
- prev/next links at the bottom of every page

What it adds is a current look: dark and light themes driven by CSS
variables, a binary-ripple transition when you switch themes, and a prose
renderer that makes code, tables, callouts and Mermaid diagrams look good
in both modes.

## Requirements

- A GitHub Pages site (any Jekyll theme works on Pages).
- Ruby locally only if you want to preview with `jekyll serve`. Publishing
  through Pages needs no local tooling at all.

## Install

Add the theme to `_config.yml`:

```yaml
remote_theme: ksauraj/stygian

plugins:
  - jekyll-sitemap
  - jekyll-seo-tag
```

Create a `_docs/` folder next to your existing content and give the
collection an output path in `_config.yml`:

```yaml
collections:
  docs:
    output: true
    permalink: /:collection/:path/
```

Your first page is now one markdown file:

```markdown
---
title: Welcome
nav_order: 1
---
Write anything here. Headings, lists, tables and code fences render with
the Stygian prose engine automatically.
```

## Local preview

```bash
git clone https://github.com/ksauraj/stygian.git
cd stygian
bundle install
bundle exec jekyll serve --livereload
```

Then open `http://localhost:4000`. The repo itself is a demo docs site: the
`_docs/` folder here is exactly what you should replicate in your own
project.

> **Tip:** keep `url` and `baseurl` empty for local builds, or set
> `baseurl: ""` when your site lives at the root of a user page.
{: .callout }

## Publish

Commit and push. On GitHub Pages, set the Pages source to your branch and
root directory (or use the `jekyll build` Actions workflow this repo ships
in `.github/workflows/pages.yml`). Every push rebuilds the docs.

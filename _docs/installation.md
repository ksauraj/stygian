---
title: Installation
parent: Getting started
nav_order: 1
lede: >
  Two ways to install Stygian: remote theme on GitHub Pages, or a Ruby
  gem for any Jekyll site.
---

## On GitHub Pages (remote theme)

Add the remote theme to `_config.yml` and let GitHub Pages do the rest.
No plugins are required: the theme ships its own search index, SEO tags
and copy buttons, so there is nothing to whitelist.

```yaml
remote_theme: ksauraj/stygian
```

GitHub Pages rebuilds the site on every push to the publishing branch
and resolves `remote_theme` from the default branch of the theme
repository. To pin a specific state of the theme instead of always
following the default branch, use a commit hash:

```yaml
remote_theme: ksauraj/stygian@a1b2c3d
```

The pinned hash must be a full 40-character commit SHA.

## As a Ruby gem

```bash
gem install stygian
```

Then add the theme to your site's `Gemfile`:

```ruby
gem "stygian"
```

and set it in `_config.yml`:

```yaml
theme: stygian
```

Run `bundle install`, then `bundle exec jekyll serve` to preview.

## Minimal site wiring

Every Stygian site needs three things: a docs collection, a front
matter default that routes the collection through the `docs` layout,
and the `stygian:` config block (all keys optional).

```yaml
title: My docs
description: Short site description.

remote_theme: ksauraj/stygian   # or: theme: stygian

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

stygian:
  theme:
    default: dark
```

Drop markdown files into `_docs/`. Each file becomes a page with an
entry in the sidebar, ordered by `nav_order` (see Navigation).

## Local development

For local builds against the gem, `bundle install` with the Gemfile
above and run:

```bash
bundle exec jekyll build
```

Sites that use `remote_theme` can build locally too: GitHub Pages
injects `jekyll-remote-theme` automatically, so add it to your Gemfile:

```ruby
gem "jekyll-remote-theme"
```

and keep `remote_theme:` in `_config.yml`. Jekyll fetches the theme
over HTTPS on build.

---
title: Search
parent: User guide
nav_order: 1
lede: >
  Client-side search with zero plugins: how the index is built, what is
  searchable, and how to configure or disable it.
---

## How it works

Stygian ships a no-plugin search: at build time a Liquid template
renders `assets/js/search-data.json` with every page in the docs
collection; at runtime one vanilla JavaScript file ranks results with
word tokens, title boosts and `<mark>` highlighting.

Because the index is a static asset, the feature works on GitHub Pages
with no plugins whitelisted and no external search service.

## Enabling and disabling

```yaml
# native key
stygian:
  search:
    enabled: true
```

```yaml
# just-the-docs key (alias)
search_enabled: true
```

Set either to `false` to remove the magnifier button and the `/`
shortcut. The search overlay and index are skipped entirely.

## Searchable content

The index covers the docs collection (`stygian.nav.collection`,
default `docs`). Pages whose front matter sets `search_exclude: true`
are skipped, mirroring just-the-docs:

```yaml
---
title: Internal notes
search_exclude: true
---
```

## Placeholder

```yaml
stygian:
  search:
    placeholder: Search the docs
```

## Keyboard

Press `/` anywhere (except while typing in a field) to open search.
`Esc` closes it; arrow keys move through results; `Enter` opens the
selected result. The focus shortcut key is not yet configurable.

## Differences from just-the-docs

- Previews are single snippets per result; `search.previews` and
  `search.preview_words_*` are not implemented yet.
- `search.heading_level` section splitting is not implemented: each
  page is indexed as one document.
- `search.button` (floating search button) is not implemented.
- `search.tokenizer_separator` is not implemented.

These are tracked in `GAP-ANALYSIS.md` under the v15 milestone.

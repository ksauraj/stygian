---
title: Search
parent: User guide
nav_order: 1
lede: >
  Client-side search with zero plugins: section-level indexing, previews,
  keyboard shortcuts and a floating trigger - configurable like
  just-the-docs.
---

## How it works

Stygian ships a no-plugin search: at build time a Liquid template
renders `assets/js/search-data.json`; at runtime one vanilla JavaScript
file ranks results, groups them by page and highlights matches.

The index is **split into sections by headings** (up to
`search.heading_level`, default 2), so results point at the exact
heading - the same behavior as just-the-docs.

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

Set either to `false` to remove the magnifier button, the `/` and
`ctrl/cmd+k` shortcuts and the floating trigger.

## Options

All keys work in both the native `stygian.search.*` form and the
just-the-docs top-level `search.*` form. Native wins when both are set.

```yaml
search:
  # split pages into sections at this heading level (1-6, default 2)
  heading_level: 2
  # maximum section previews per result (default 3)
  previews: 3
  # words to show before / after a match in the preview (default 5 / 10)
  preview_words_before: 5
  preview_words_after: 10
  # show the relative url in results (default true)
  rel_url: true
  # floating search button in the lower right (default false)
  button: false
  # focus search with ctrl/cmd + key (default "k")
  focus_shortcut_key: "k"
  # token separator regex (default /[\s\-/]+/ - so kube-system matches
  # both "kube" and "system")
  tokenizer_separator: /[\s\-/]+/
```

## Searchable content

The index covers regular pages and every collection configured under
`just_the_docs.collections` (or the native `stygian.nav.collection`).
Pages with `search_exclude: true` in front matter are skipped, as are
collections with `search_exclude: true` in their collection config.

```yaml
---
title: Internal notes
search_exclude: true
---
```

## Keyboard

- `/` opens search from anywhere (except while typing in a field)
- `ctrl/cmd + k` (configurable via `focus_shortcut_key`) also opens it
- `Esc` closes; arrow keys move through results; `Enter` opens

## Placeholder

```yaml
stygian:
  search:
    placeholder: Search the docs
```

## Missing vs just-the-docs

Nothing functional: `heading_level`, `previews`, `preview_words_*`,
`rel_url`, `button`, `focus_shortcut_key` and `tokenizer_separator` are
all implemented. The result ranking differs (Stygian uses a lightweight
token scorer instead of lunr), which is a deliberate zero-dependency
trade-off.

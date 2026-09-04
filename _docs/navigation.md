---
title: Navigation
nav_order: 3
lede: >
  How the sidebar orders and nests your pages, and how the prev/next links
  are computed.
---
## Ordering

Pages sort by `nav_order` (lowest first). When two pages share a value they
fall back to title order. Pages without `nav_order` are kept in document
order after the numbered ones. To place a page last explicitly:

```yaml
---
title: Changelog
nav_order: 999
---
```

## Nesting with `parent`

A page becomes a child by pointing at the **basename** of its parent file,
without the `.md` extension. Given this file layout:

```text
_docs/
  getting-started.md
  customization.md        <- key: customization
  theming.md              <- parent: customization
  effects.md              <- parent: customization
```

`customization.md` renders as a top-level entry and `theming.md` plus
`effects.md` render nested beneath it, ordered by their own `nav_order`
values. The parent page itself keeps its position with its own `nav_order`.

```yaml
# theming.md
---
title: Theming
parent: customization
nav_order: 1
---
```

> **Note:** child keys must match the parent file basename exactly. The
> engine supports one nesting level; put deeper structures in separate
> top-level sections.
{: .callout }

## Hiding pages

Set `nav_exclude: true` to keep a page out of the sidebar. It stays
published and linkable.

## Prev / next

The bottom navigation flattens the tree in sidebar order: each parent is
followed immediately by its children, then the next parent. The page you
are reading now shows the pattern: previous links to `Configuration`, next
links to `Customization`, whose children follow it in sequence.

## Active state

The current page is highlighted in the sidebar, and its parent entry stays
highlighted too, so a deep child never looks orphaned.

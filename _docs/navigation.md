---
title: Navigation
nav_order: 3
lede: >
  The sidebar model, compatible with just-the-docs: parents by title,
  numbers or strings for nav_order, arbitrary depth, exclusions and
  external links.
---

Every page in the docs collection appears in the sidebar. Ordering,
nesting and visibility are controlled with front matter on each page.

## Ordering with nav_order

`nav_order` accepts numbers (integers and floats) or strings:

```yaml
---
title: Installation
nav_order: 1
---
```

```yaml
---
title: Alpha section
nav_order: "a"
---
```

Rules, identical to just-the-docs:

- Pages with numeric `nav_order` come first, sorted numerically.
- Then string `nav_order` values, sorted lexicographically.
- Pages without `nav_order` come last, sorted by `title` (numbers
  first, then strings).
- Add `nav_sort: case_insensitive` in `_config.yml` to ignore case when
  sorting strings.
- Equal `nav_order` values fall back to insertion order.

## Nesting with parent

Set `parent` to the **title** of the parent page. Nesting depth is
unlimited.

```yaml
---
title: Search
parent: User guide
nav_order: 1
---
```

Parents are matched by title first (just-the-docs convention). For
backwards compatibility with older stygian sites, a `parent` that
matches no page title falls back to matching the parent page's
filename.

Use `grand_parent` (or `ancestor` for deeper trees) only to
disambiguate when two pages share a title:

```yaml
---
title: Search
parent: User guide
grand_parent: User guide
---
```

`has_children` is accepted but ignored: children are derived from the
`parent` fields, exactly like just-the-docs.

## Automatic child list

A page with children renders a "Table of contents" list of links to
them below its content. Disable it per page:

```yaml
---
title: User guide
has_toc: false
---
```

## Hiding pages

```yaml
---
title: Internal notes
nav_exclude: true
---
```

Hidden pages and their subtrees disappear from the sidebar. They remain
reachable by URL, and remain in the search index unless
`search_exclude: true` is set.

## External links

Add external links at the bottom of the sidebar from `_config.yml`:

```yaml
nav_external_links:
  - title: Releases
    url: https://github.com/you/repo/releases
nav_external_links_new_tab: true
```

## Disabling the sidebar globally

```yaml
nav_enabled: false
```

replaces the sidebar with a full-width content column everywhere.
Enable the sidebar on a single page with `nav_enabled: true` in that
page's front matter, or vice versa.

The native equivalent is `stygian.nav.enabled`.

## Collections

`stygian.nav.collection` selects which collection feeds the sidebar
(default `docs`). The sidebar title is `stygian.nav.title` (default
`Docs`). Multi-collection categories (`just_the_docs.collections`) are
not implemented yet; see `GAP-ANALYSIS.md`.

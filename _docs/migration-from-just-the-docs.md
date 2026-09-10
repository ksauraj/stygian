---
title: Migration from just-the-docs
parent: Developer guide
nav_order: 5
lede: >
  Move a just-the-docs site to Stygian with minimal effort: the config
  surface, front matter and component classes are compatible by design.
---

Stygian was built as a docs engine in the spirit of just-the-docs, and
the migration path is deliberate: keep your content, change the theme
line, and most things keep working.

## 1. Switch the theme

```yaml
# before
remote_theme: just-the-docs/just-the-docs

# after
remote_theme: ksauraj/stygian
```

That is the whole migration for many sites. The docs collection wiring
(`collections.docs`, `defaults` for the `docs` layout) is identical.

## 2. Layouts

- `layout: docs` (stygian native) renders the sidebar layout.
- `layout: default` on a page inside the docs collection, or on a page
  with any nav front matter (`nav_order`, `parent`, `grand_parent`,
  `has_children`, `has_toc`), renders the same sidebar layout
  automatically.
- `layout: minimal` and `layout: page` render a standalone page without
  the sidebar.

A site whose defaults point the docs collection at `layout: default`
(JTD convention) works without changes.

## 3. Front matter

Supported as-is:

| Key | Notes |
| --- | --- |
| `title` | required for nav membership |
| `nav_order` | numbers (int/float) and strings; numbers first |
| `parent` | matched by parent page **title** (JTD) |
| `grand_parent` | disambiguation for deep trees |
| `has_children` | ignored (children are derived) |
| `has_toc: false` | hides the automatic child list |
| `nav_exclude: true` | hides from the sidebar |
| `search_exclude: true` | hides from the search index |
| `last_modified_date` | feeds the footer timestamp |

Legacy stygian `parent: <filename>` still works as a fallback.

## 4. Config keys

Every common just-the-docs key is honored, as an alias or a direct
equivalent:

```yaml
# just-the-docs style - works as-is
logo: /assets/logo.png
favicon_ico: /assets/favicon.ico
search_enabled: true
heading_anchors: true
color_scheme: dark
nav_sort: case_insensitive
nav_enabled: true
back_to_top: true
aux_links:
  "GitHub": "https://github.com/you/repo"
aux_links_new_tab: true
nav_external_links:
  - title: Releases
    url: https://github.com/you/repo/releases
nav_external_links_new_tab: true
footer_content: "Copyright &copy; 2026 You"
last_edit_timestamp: true
last_edit_time_format: "%b %e %Y"
gh_edit_link: true
gh_edit_repository: "https://github.com/you/repo"
gh_edit_branch: "main"
mermaid:
  version: "11.4.1"
callouts:
  warning:
    title: Warning
    color: red
```

The native `stygian:` block remains available and takes precedence:

```yaml
stygian:
  theme:
    default: dark
  search:
    enabled: true
    heading_level: 2
    previews: 3
    button: false
    focus_shortcut_key: "k"
  header:
    aux_links:
      - { label: GitHub, href: https://github.com/you/repo }
  edit:
    enabled: true
    repo: https://github.com/you/repo
    branch: main
  footer:
    note: My docs
  syntax_highlighting:
    enabled: true
```

Precedence rule: where a key exists in both forms, `stygian.*` wins.

## 5. Component classes

Buttons (`.btn`, `.btn-purple`, `.btn-blue`, `.btn-green`, `.btn-red`,
`.btn-yellow`, `.btn-outline`), labels (`.label`,
`.label-blue/green/purple/yellow/red`), callouts (`.note`, `.tip`,
`.warning`, `.important`), typography (`.fs-1`..`.fs-10`, `.fw-300`..)
and color utilities (`.text-*`, `.bg-*`) all use the same names.

## 6. Things that differ

- Dark mode is the default scheme; set `color_scheme: light` for the
  just-the-docs default look. Visitors can switch at runtime either way.
- Search ranking uses a lightweight zero-dependency token scorer rather
  than lunr; all `search.*` options are supported.
- The footer layout differs; `footer_content`, `last_edit_timestamp`
  and `gh_edit_link` are rendered in a dedicated meta row.
- Custom callout colors via a `callouts:` config block are not
  implemented yet (the four built-in classes work as-is).
- `search_placeholder_custom` and `toc_heading_custom` hooks are not
  implemented; `head_custom`, `header_custom`, `footer_custom` and
  `nav_footer_custom` are identical.

Everything else - navigation model (including multi-collection
categories and `nav_fold`), config keys, front matter, component
classes and the utility matrix - is compatible. See
[GAP-ANALYSIS.md](https://github.com/ksauraj/stygian/blob/main/GAP-ANALYSIS.md)
for the row-by-row comparison.

## 7. Verify

```bash
bundle exec jekyll build
# or, against the gem:
bundle exec jekyll serve
```

Check the sidebar order, a parent page's automatic child list, search
over a page, and the dark/light toggle. Then push and let GitHub Pages
rebuild.

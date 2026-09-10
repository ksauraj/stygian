# Gap analysis: stygian vs just-the-docs

Status of stygian relative to [just-the-docs](https://just-the-docs.github.io/just-the-docs/) (JTD).
Legend: [x] shipped, [~] partial / planned, [ ] missing.

## Configuration surface

| JTD key | stygian key | Status |
| --- | --- | --- |
| `title`, `description`, `url`, `baseurl` | same | [x] |
| `logo` (header logo image) | `logo` | [x] |
| `favicon_ico` | `favicon_ico` | [x] |
| `search_enabled` | `stygian.search.enabled` (+ alias) | [x] |
| `search.heading_level` | same (section index) | [x] |
| `search.previews` / `preview_words_before` / `after` | same | [x] |
| `search.button` (floating search FAB) | same | [x] |
| `search.focus_shortcut_key` | same (ctrl/cmd + key) | [x] |
| `search.tokenizer_separator` | same | [x] |
| `mermaid.version` / `mermaid.path` | same | [x] |
| `aux_links` (hash) / `aux_links_new_tab` | `stygian.header.aux_links` (list) | [x] both formats |
| `nav_enabled` (global sidebar toggle) | `stygian.nav.enabled` (+ alias) | [x] |
| `heading_anchors` | same | [x] |
| `nav_external_links` / `nav_external_links_new_tab` | same | [x] |
| `nav_sort: case_insensitive` | same | [x] |
| `footer_content` | `stygian.footer.note/right` | [x] |
| `last_edit_timestamp` / `last_edit_time_format` | same | [x] |
| `gh_edit_link` family | `stygian.edit.*` | [x] |
| `color_scheme` | `stygian.theme.default` (+ alias) | [x] |
| `callouts: {name: {title, color}}` | `.note/.tip/.warning/.important` built-in | [~] config-driven custom colors |
| `just_the_docs.collections.*` (name/nav_exclude/nav_fold/search_exclude) | same | [x] |
| `ga_tracking` | - | [ ] (intentionally: privacy-first theme) |

## Navigation model

| JTD behavior | stygian | Status |
| --- | --- | --- |
| parent by page **title** (not filename) | same (+ legacy filename fallback) | [x] |
| `grand_parent` / `ancestor` recursion, arbitrary depth | same | [x] |
| `nav_order` numbers (int/float) + strings, numbers first | same | [x] |
| default order = title alphabetical | same | [x] |
| `nav_sort: case_insensitive` | same | [x] |
| `nav_exclude` | same | [x] |
| `has_children` (redundant in JTD) | accepted (derived) | [x] |
| auto child table of contents on parent pages | same | [x] |
| `has_toc: false` | same | [x] |
| external nav links | same | [x] |
| `nav_fold` collapsible collections | same (expanded without JS) | [x] |
| multiple collections as nav categories | same (`just_the_docs.collections`) | [x] |
| regular pages rendered before collections | same | [x] |

## UI components

| JTD | stygian | Status |
| --- | --- | --- |
| buttons: `.btn` + color variants + `.btn-outline` + sizes | same | [x] |
| labels: `.label` + color variants | same | [x] |
| callouts: `.note/.tip/.warning/.important` (+ `.name-title`) | same | [x] |
| code: inline chips, copy buttons | same | [x] |
| code: line numbers (`linenos`) | same (`.lineno` styled) | [x] |
| code: mermaid (lazy, theme-aware) | same (better: re-renders on theme switch) | [x] |
| tables: auto scroll wrapper | same | [x] |
| lists: task list, definition list | same | [x] |
| typography scale `.fs-1..fs-10`, `.fw-*`, `.text-*` | same | [x] |
| color utilities `.text-*` / `.bg-*` | same (JTD palette) | [x] |
| spacing `.m-*`/`.p-*`, flex, `.v-align-*`, `.d-*` | same | [x] |
| print stylesheet | same | [x] |

## Layouts

| JTD | stygian | Status |
| --- | --- | --- |
| `layout: default` (sidebar + title H1 + child TOC) | same (docs-mode) | [x] |
| `layout: minimal` (no sidebar) | same (`minimal` + `page`) | [x] |
| `layout: home` | same (alias of page) | [x] |
| `layout: post` (blog) | - | [ ] (out of scope: docs engine) |

## Customization / hooks

| JTD | stygian | Status |
| --- | --- | --- |
| `head_custom`, `header_custom`, `footer_custom`, `nav_footer_custom` | identical hooks | [x] |
| `search_placeholder_custom` | - | [ ] |
| `toc_heading_custom` | - | [ ] |
| custom color schemes (`_sass/color_schemes/*.scss`) | CSS variable `--color-*` overrides via `head_custom` | [~] documented |
| custom styles (`_sass/custom/custom.scss`) | `head_custom` + `assets/css` overrides | [~] documented |

## Search / SEO / misc

| JTD | stygian | Status |
| --- | --- | --- |
| client-side search, zero plugins | same architecture | [x] |
| `search_exclude` front matter + per collection | same | [x] |
| SEO | auto WebSite + Breadcrumb JSON-LD + OG (better than JTD default) | [x] |
| dark/light with saved preference + animated reveal | yes | [x] (JTD: static scheme only) |
| prev/next paging, breadcrumbs, back-to-top | yes | [x] (JTD lacks prev/next) |
| versioned asset URLs tied to the gem version | yes (spec-guarded) | [x] |
| `fix_linenos` | n/a (modern rouge output) | [x] |

## Verdict

Stygian now covers the just-the-docs surface end to end - config keys,
front matter, the navigation model (including multi-collection
categories and `nav_fold`), component classes and the utility matrix -
while keeping its own extras: zero-plugin search with section-level
indexing, automatic SEO, animated theme switching, prev/next paging,
code copy buttons and lazy theme-aware mermaid. Remaining gaps are
small: config-driven custom callout colors, two minor extension hooks
and GA tracking (deliberately excluded).

# Roadmap

- **0.2.0** (current): full JTD parity - search section indexing
  (`heading_level`, previews, FAB, focus shortcut, tokenizer),
  multi-collection navigation with `nav_fold`, spacing/flex/v-align
  utilities, definition lists, print stylesheet, `layout: home`,
  SemVer releases with tags (version.rb + `?v=` tied, spec-guarded).
- **0.3.0**: config-driven custom callouts (`callouts:` colors/titles),
  `search_placeholder_custom` / `toc_heading_custom` hooks, custom
  color scheme authoring parity (`_sass/color_schemes` style via CSS
  variables), `layout: post` for blog-style collections.
- **0.4.0**: search result ranking parity (lunr-style phrase scoring),
  optional `ga_tracking` module, API-stability audit and
  `MIGRATION.md` per-release notes like just-the-docs.

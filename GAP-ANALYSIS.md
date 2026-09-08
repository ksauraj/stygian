# Gap analysis: stygian vs just-the-docs

Status of stygian relative to [just-the-docs](https://just-the-docs.github.io/just-the-docs/) (JTD).
Legend: [x] shipped, [~] partial / planned, [ ] missing.

## Configuration surface

| JTD key | stygian key | Status |
| --- | --- | --- |
| `title`, `description`, `url`, `baseurl` | same | [x] |
| `logo` (header logo image) | `logo` | [~] added v14 |
| `favicon_ico` | `favicon_ico` | [~] added v14 |
| `search_enabled` | `stygian.search.enabled` (+ alias) | [x] |
| `search.heading_level`, `previews`, `preview_words_*` | fixed result rendering | [ ] |
| `search.button` (floating search FAB) | - | [ ] |
| `search.focus_shortcut_key` | `/` shortcut only | [ ] |
| `search.tokenizer_separator` | - | [ ] |
| `mermaid.version` / `mermaid.path` | hardcoded jsDelivr v11 | [~] configurable v14 |
| `aux_links` (hash) / `aux_links_new_tab` | `stygian.header.aux_links` (list) | [x] both formats |
| `nav_enabled` (global sidebar toggle) | `stygian.nav.enabled` (+ alias) | [~] added v14 |
| `heading_anchors` | anchors always on | [~] configurable v14 |
| `nav_external_links` / `nav_external_links_new_tab` | - | [~] added v14 |
| `nav_sort: case_insensitive` | - | [~] added v14 |
| `footer_content` | `stygian.footer.note/right` | [~] added v14 |
| `last_edit_timestamp` / `last_edit_time_format` | - | [~] added v14 |
| `gh_edit_link` family | `stygian.edit.*` | [~] added v14 (alias) |
| `color_scheme` | `stygian.theme.default` (+ alias) | [~] added v14 |
| `callouts: {name: {title, color}}` | `.callout` only | [~] added v14 (named callouts) |
| `just_the_docs.collections.*` (name/nav_exclude/nav_fold/search_exclude) | `stygian.nav.collection` | [~] name + excludes; `nav_fold` [ ] |
| `ga_tracking` | - | [ ] (intentionally: privacy-first theme) |

## Navigation model

| JTD behavior | stygian | Status |
| --- | --- | --- |
| parent by page **title** (not filename) | filename | [~] v14: title first, filename fallback |
| `grand_parent` / `ancestor` recursion, arbitrary depth | 1 level | [~] v14 |
| `nav_order` numbers (int/float) + strings, numbers first | numbers only | [~] v14 |
| default order = title alphabetical | - | [~] v14 |
| `nav_sort: case_insensitive` | - | [~] v14 |
| `nav_exclude` | same | [x] |
| `has_children` (redundant in JTD) | ignored | [x] (engine derives children) |
| auto child table of contents on parent pages | - | [~] v14 |
| `has_toc: false` | - | [~] v14 |
| external nav links | - | [~] v14 |
| `nav_fold` collapsible collections | - | [ ] |
| multiple collections as nav categories | single collection | [ ] |

## UI components

| JTD | stygian | Status |
| --- | --- | --- |
| buttons: `.btn` + `.btn-purple/.btn-blue/.btn-green/.btn-red/.btn-yellow/.btn-outline/.btn-primary` | `.btn`, `.btn--ghost` | [~] v14 adds color variants |
| labels: `.label` + color variants | `.label` (1 style) | [~] v14 adds variants |
| callouts: `.note/.tip/.warning/.important` (+ `.name-title`) | `.callout` | [~] v14 adds JTD classes |
| code: inline chips, copy buttons | same | [x] |
| code: line numbers (`linenos`) | - | [~] v14 styles `.lineno` |
| code: mermaid (lazy, theme-aware) | same (better) | [x] |
| tables: auto scroll wrapper | same | [x] |
| lists: task list, definition list | task list | [~] definition list styling |
| typography scale `.fs-1..fs-10`, `.fw-*`, `.text-*` | - | [~] v14 adds utility subset |
| color utilities `.text-*` / `.bg-*` (grey/purple/blue/green/yellow/red) | - | [~] v14 adds core set |
| `.d-inline-block`, `.flex-*`, `.v-align-*`, `.m-*`/`.p-*` spacing | - | [ ] (partial v14: d-inline-block) |

## Layouts

| JTD | stygian | Status |
| --- | --- | --- |
| `layout: default` (sidebar + title H1 + child TOC) | chrome only | [~] v14: docs-mode |
| `layout: minimal` (no sidebar) | `layout: page` | [~] v14 alias |
| `layout: home` | `layout: page` for landing | [ ] alias |
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
| `search_exclude` front matter | same | [x] |
| SEO | auto WebSite + Breadcrumb JSON-LD + OG (better than JTD default) | [x] |
| dark/light with saved preference + animated reveal | yes | [x] (JTD: static scheme only) |
| prev/next paging, breadcrumbs, back-to-top | yes | [x] (JTD lacks prev/next) |
| print stylesheet | - | [ ] |
| `fix_linenos` | n/a (modern rouge output) | [x] |

## Verdict

Stygian already beats JTD on: zero-plugin search, automatic SEO, animated
theme switch, prev/next paging, code copy buttons, lazy theme-aware
mermaid. The gap is **drop-in migration**: JTD front matter, config keys,
nav model and component classes. That is what the v14 line of work
closes. See ROADMAP.md for the plan.

# Roadmap

- **v14** (current): migration surface — JTD nav model (title parents,
  recursive levels, number/string `nav_order`, `nav_sort`, child TOC,
  `has_toc`, external links, `nav_enabled`), config aliases (logo,
  favicon, color_scheme, search_enabled, heading_anchors, footer_content,
  last_edit_timestamp, gh_edit_link, mermaid.version, callouts, aux_links
  hash), JTD component classes (labels, buttons, callouts, line numbers,
  typography/color utilities), `layout: minimal` + docs-mode `default`,
  migration guide, extensive docs, collaboration tooling, personal-data
  scrub.
- **v15**: search parity (`heading_level` section search, previews count,
  tokenizer separator, focus shortcut key config), `nav_fold`
  collapsible collections, multiple collections as categories,
  `search.button` FAB, definition-list styling, print stylesheet,
  `layout: home`.
- **v16**: spacing/layout utility matrix (`m-*`/`p-*`, `flex-*`,
  `v-align-*`), `search_placeholder_custom` / `toc_heading_custom` hooks,
  JTD color scheme authoring parity via `_sass/color_schemes`.

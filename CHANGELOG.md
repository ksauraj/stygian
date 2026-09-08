# Changelog

Stygian follows immutable SemVer progression: alpha, beta, release
candidate, then stable. Every release keeps its tag and is never
rewritten - fixes land as the next version, not as a force-pushed edit.

Legend:

- **Added** - new capability
- **Changed** - behavior update
- **Fixed** - bug resolved
- **Removed** - capability dropped

## [Unreleased]

### Added

- **Just-the-docs compatibility layer**:
  - Navigation engine rewritten to the JTD model: parents matched by
    page title (legacy filename fallback), unlimited nesting depth via
    recursive include, `nav_order` as numbers and strings (numbers
    first, then strings, then title alphabetical), `nav_sort:
    case_insensitive`, `grand_parent`/`ancestor` disambiguation,
    `has_children` accepted (derived), automatic child table of
    contents on parent pages, `has_toc: false`, external nav links
    (`nav_external_links` + `nav_external_links_new_tab`), global
    sidebar toggle (`nav_enabled` / `stygian.nav.enabled` with page
    overrides).
  - Config aliases honored alongside the native `stygian:` block:
    `aux_links` (hash) and `aux_links_new_tab`, `color_scheme`,
    `search_enabled`, `heading_anchors`, `back_to_top`,
    `footer_content`, `last_edit_timestamp` + `last_edit_time_format`,
    `gh_edit_link` family, `logo`, `favicon_ico`, `mermaid.version` /
    `mermaid.path`, `callouts` (named callouts), `nav_sort`.
  - JTD UI classes: buttons (`.btn-purple/.btn-blue/.btn-green/
    .btn-red/.btn-yellow/.btn-outline/.btn-primary`, `.btn-sm`,
    `.btn-xs`), labels (`.label` + color variants), callouts
    (`.note/.tip/.warning/.important` + `-title` variants), code line
    numbers (`.lineno`), typography scale (`.fs-1`..`.fs-10`,
    `.fw-300..700`, `.text-center/left/right`, `.text-mono`,
    `.text-delta`, `.d-inline-block`), color utilities
    (`.text-*`/`.bg-*` over the JTD palette).
  - `layout: default` renders the sidebar layout for pages in the docs
    collection or with nav front matter; new `layout: minimal` alias;
    `layout: page` unchanged.
- Extensive documentation: the demo docs now mirror the JTD structure
  (Getting started / Configuration / Navigation / User guide /
  Developer guide / FAQ), including a step-by-step
  migration-from-just-the-docs guide, search, UI components, utilities
  and contributing pages.
- Collaboration tooling: CONTRIBUTING.md, CODE_OF_CONDUCT.md,
  SECURITY.md, issue templates (bug + feature request), PR template,
  GAP-ANALYSIS.md with roadmap, README overhaul.
- Personal data removed from the gem spec and demo footer.

### Changed

- Unordered list bullets are circular (`disc`) instead of squares, with
  `circle` / `square` for deeper nesting levels.
- Mermaid is loaded per `mermaid.version` / `mermaid.path` when set.

### Fixed

- Header overflow on phones: text aux links are hidden from the header
  below 768px and re-surfaced at the bottom of the off-canvas drawer, the
  site title ellipsizes when space runs out, and icon buttons never
  shrink. Header no longer squeezes regardless of title length or number
  of aux links.

## [0.1.0] - 2026-09-05

Initial public theme, iterated against the live telectl docs site.

### Added

- Docs engine: `_docs` collection rendering with ordered sidebar
  navigation (flat or one-level `parent` nesting), `nav_order`,
  `nav_exclude`, prev/next paging, breadcrumbs, back-to-top button.
- Dark/light design system on CSS custom properties with a saved
  visitor preference and a View Transitions circular reveal on toggle.
- Client-side search: no-plugin `search-data.json` index, header
  magnifier and `/` shortcut, result ranking with `<mark>` highlights,
  snippets and keyboard navigation. Configurable via
  `stygian.search.enabled` / `stygian.search.placeholder`.
- Edit this page on GitHub links (`stygian.edit.{enabled,repo,branch,
  view}`).
- Prose engine: atomic inline-code chips that never split mid-token,
  fenced code blocks with copy buttons, scrollable tables, callouts
  (`{: .callout }`), lazy Mermaid diagrams that re-render on theme
  switch, heading anchor links.
- Auto SEO (`stygian.seo.enabled`, default on): WebSite JSON-LD,
  BreadcrumbList JSON-LD on docs pages, Open Graph, Twitter cards,
  optional `stygian.seo.image`, auto description and canonical URL.
- Extension hooks in the just-the-docs style: `head_custom`,
  `header_custom`, `footer_custom`, `nav_footer_custom` empty override
  includes.
- Restrained flicker and glare effect suite with full
  `prefers-reduced-motion` support.
- Cache-busted versioned assets (`?v=N`) so Pages deploys never serve
  stale CSS/JS for ten minutes.
- Repo engineering: RSpec smoke suite that builds the demo site and
  asserts output invariants, CI matrix workflow, gem-publish workflow
  on version tags, this changelog.

### Changed

- Theme switch reworked over several iterations: binary-glyph ripple
  canvas removed, then the post-transition tide ripple removed; the
  final transition is the circular View Transitions reveal only.

### Fixed

- Inline code chips were wrapped in block containers by the copy-button
  setup (each token on its own line) - copy buttons now attach to real
  fenced blocks only.
- Chrome treated `-` as a line-break opportunity, splitting tokens such
  as `readonly-user`; inline code is now an atomic chip.
- Inline-block chips with scrollable overflow lost their text baseline
  and floated above the line; alignment compensated via
  `vertical-align`.
- Leading `# Title` in markdown duplicated the layout H1 - the layout
  now strips a redundant leading H1.
- Mermaid SVGs kept load-time colors after a theme switch (faint
  diagrams); charts re-render with the new palette.
- Conditional `{% seo %}` usage crashed sites without jekyll-seo-tag;
  manual OG/Twitter meta is emitted instead.
- Search-index snippets lost spaces at block boundaries (`strip_html`
  glue); block tags and newlines are converted to spaces first.

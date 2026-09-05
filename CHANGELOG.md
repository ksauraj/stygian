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

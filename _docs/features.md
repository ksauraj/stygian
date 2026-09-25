---
title: Feature list
nav_order: 7
lede: >
  The complete current inventory of Stygian, so you can compare it with
  what you use today.
---

## Docs engine

- Ordered sidebar navigation from `nav_order`; ties break
  alphabetically by title
- One-level nesting with `parent: <filename>` front matter; nested pages
  indent under their parent and highlight with it
- `nav_exclude` hides a page from the sidebar, `search_exclude` hides it
  from search only
- Breadcrumbs on every docs page: Home, parent page (when nested),
  current page
- Prev/next page cards at the bottom of each docs page
- Mobile drawer: hamburger in the header, scrim, Esc to close
- "Edit this page on GitHub" link, driven by `stygian.edit`

## Search

- Client-side over a Liquid-generated `search-data.json` index
- Header magnifier button or the `/` shortcut
- Ranking: title prefix and title matches score above content matches;
  every query term must hit somewhere
- Result list with `<mark>` highlights in titles and snippets
- Keyboard: arrow keys move, Enter opens, Esc closes
- Configurable placeholder; indexable per-page off switch

## Prose and content

- Atomic inline code chips - a token never splits across lines, not even
  at hyphens; over-long tokens scroll inside the chip
- Fenced code blocks with a copy button and a confirmation flash
- Tables wrapped for horizontal scrolling on small screens
- Callouts: apply `{: .callout }` to a blockquote
- Lazy Mermaid diagrams (CDN loaded only when a diagram exists) that
  re-render with the correct palette when the theme switches
- Automatic heading anchors (`#` on hover) on h2-h4

## Theming and motion

- Dark and light design systems driven by CSS custom properties
- Visitor preference saved in localStorage, applied before first paint
  (no flash of the wrong theme)
- Circular View Transitions reveal on theme switch, from the click point
- Restrained accents: theme-button glow, button glare sweep, copy
  confirmation flash
- `prefers-reduced-motion` honored: instant theme swap, no animation

## SEO (switchable)

- WebSite JSON-LD and per-page BreadcrumbList JSON-LD
- Open Graph and Twitter card meta, optional `og:image`
- Automatic meta description (page description > lede > site
  description)
- Canonical URL built from `url` + `baseurl`
- One switch: `stygian.seo.enabled: false`

## Blog

- Collections opt into date ordering with `just_the_docs.collections.<name>
  .sort_by: date` (or `stygian.nav.sort_by: date` for the sidebar
  collection); other collections keep normal `nav_order` ordering
- `layout: blog` post pages on the docs shell: publish date as a `<time>`
  element, excerpt as lede, tag chips, no breadcrumbs, no child TOC
- `post: true` in front matter opts any page into post rendering from any
  layout
- `BlogPosting` JSON-LD on posts; docs pages keep `BreadcrumbList`
- `_includes/post-list.html` newest-first dated archive with optional
  `limit` and `collection` params
- Copy-in `feed.xml` RSS 2.0 template sourcing `site.posts` (or the
  sidebar collection), honoring `feed_exclude` and `stygian.feed.limit`
- Prev/next resolves across all output collections, so a post can follow
  a docs page

## Authoring ergonomics

- Every rendered page has exactly one H1: the page title; a redundant
  leading `# Heading` in content is stripped automatically
- `lede` front matter renders a subtitle under the H1
- Versioned assets (`?v=N`) bypass GitHub Pages' ten-minute asset cache,
  so updates show up immediately after deploy

## Engineering

- Zero runtime dependencies; one vanilla JS file, no build step
- Four empty extension hooks shipped in the theme:
  `head_custom.html`, `header_custom.html`, `footer_custom.html`,
  `nav_footer_custom.html` - shadow any of them in your site's
  `_includes/`
- RSpec smoke suite builds the demo site and asserts invariants (one H1
  per page, parseable search index, JSON-LD present, assets shipped)
- CI matrix (Ruby 3.2/3.3): site build, JS syntax check, specs
- Gem-publish workflow on version tags; CHANGELOG; MIT license

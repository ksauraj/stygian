---
title: Contributing
parent: Developer guide
nav_order: 6
lede: >
  How to contribute to Stygian: issues, code changes, the test suite and
  the design principles behind the theme.
---

Stygian is a community theme. Issues, bug reports, documentation fixes
and feature implementations are all welcome. The repository root has a
`CONTRIBUTING.md` with the full workflow; this page is the short
version.

## Reporting issues

Use the issue templates:

- **Bug report**: include the Jekyll version, the theme version (the
  `?v=` on the stylesheet or the commit SHA), a minimal reproduction
  and the expected versus actual behavior.
- **Feature request**: describe the use case, not just the feature.
  Features that close a gap against just-the-docs are prioritized
  (see `GAP-ANALYSIS.md`).

## Development setup

```bash
git clone https://github.com/ksauraj/stygian
cd stygian
bundle install
bundle exec jekyll build   # builds the demo site
bundle exec rake spec      # runs the smoke suite
```

The spec suite builds the demo site and asserts output invariants:
single H1 per page, parseable search index, JSON-LD presence, and now
the navigation tree and compatibility config. Run it before opening a
pull request.

## Submitting changes

1. Branch from `main`: `fix/...` or `feat/...`.
2. Make the change; keep it surgical. This theme is a docs engine:
   no portfolio UI, no demo personas, no emoji in site copy.
3. Add or update a spec for the behavior.
4. Bump the asset version in `_includes/head.html` and
   `_includes/scripts.html` (`?v=N`) so Pages never serves stale
   assets, and note the change in `CHANGELOG.md`.
5. Open a pull request against `main` with the template filled in.
6. CI runs the spec suite on Ruby 3.2 and 3.3; it must pass.

## Design principles

- **Docs first.** The theme is an engine for markdown collections:
  sidebar navigation, prev/next, search. Anything that is not
  documentation infrastructure needs a strong reason to exist.
- **Zero plugins, zero frameworks.** Everything ships as Liquid
  includes, one CSS file and one vanilla JS file. It must keep working
  on GitHub Pages without a whitelist.
- **Compatibility over convention.** Just-the-docs config keys, front
  matter and class names keep working; the native `stygian:` block
  wins when both are set.
- **Reduced motion is a first-class user.** Every effect has a
  `prefers-reduced-motion` fallback.
- **Accessible by default.** Semantic landmarks, aria labels, keyboard
  search and visible focus states are part of the theme, not add-ons.

## Code of conduct

Contributors are expected to follow the Contributor Covenant, published
in the repository as `CODE_OF_CONDUCT.md`.

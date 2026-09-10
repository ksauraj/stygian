# Contributing to Stygian

Thanks for helping make Stygian a better docs theme. This project aims
to be a serious alternative to just-the-docs, so compatibility,
accessibility and zero-plugin operation are first-class concerns.

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Reporting issues](#reporting-issues)
- [Feature requests](#feature-requests)
- [Development setup](#development-setup)
- [Submitting changes](#submitting-changes)
- [Design and development principles](#design-and-development-principles)

## Code of conduct

This project and everyone participating in it is governed by the
[Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are
expected to uphold this code. Report unacceptable behavior privately
via a GitHub security advisory or by opening a confidential issue.

## Reporting issues

Before opening an issue, search existing issues and the demo docs to
avoid duplicates.

A good bug report includes:

- Jekyll version and how the theme is installed
  (`remote_theme:` versus `theme:` gem)
- Theme version: the `?v=` query string on the stylesheet, or the
  commit SHA of the theme
- A minimal reproduction: the smallest `_config.yml` and markdown files
  that trigger the bug
- Expected behavior and actual behavior (screenshot if visual)

Use the bug report template - it asks for exactly this.

## Feature requests

Describe the use case, not just the feature. Features that close a gap
against just-the-docs are tracked in [GAP-ANALYSIS.md](GAP-ANALYSIS.md)
and prioritized; mention which gap you are addressing in the issue.

## Development setup

Requirements: Ruby 3.2+, Bundler.

```bash
git clone https://github.com/ksauraj/stygian
cd stygian
bundle install
bundle exec jekyll build --config _config.demo.yml  # build the demo site into _site/
bundle exec rake spec           # run the smoke test suite
bundle exec jekyll serve --config _config.demo.yml  # local preview at http://localhost:4000
```

The spec suite builds the demo site and asserts output invariants:
exactly one H1 per page, a parseable search index, JSON-LD output, the
navigation tree shape, and compatibility config behavior.

## Submitting changes

1. Fork the repository, or push a branch directly if you have access.
2. Branch from `main`. Use `fix/...` for bug fixes and `feat/...` for
   new capabilities.
3. Keep changes surgical. This theme is a docs engine: no portfolio
   UI, no demo personas, no emoji or em/en dashes in site copy.
4. Add or update a spec in `spec/` for the behavior you changed.
5. Record the change under `[Unreleased]` in `CHANGELOG.md`. Do **not**
   bump the version or the asset query strings for a regular change -
   those only move when a release is cut.
6. Open a pull request against `main` and fill in the template.
7. CI runs `bundle exec rake spec` on Ruby 3.2 and 3.3. It must pass
   before the PR can merge.

### Commit messages

Use conventional commits: `fix(theme): ...`, `feat(theme): ...`,
`docs: ...`, `chore: ...`.

## Cutting a release

Releases are real SemVer milestones, not per-commit bumps (the old
`?v=N`-per-commit flow is gone). Multiple PRs accumulate on `main`
under `[Unreleased]`; when a coherent batch is ready:

1. Decide the version (`MAJOR.MINOR.PATCH`) and note it in
   `CHANGELOG.md`: rename `[Unreleased]` to `[X.Y.Z] - <date>`.
2. Bump `lib/stygian/version.rb` to the same value.
3. Update the asset query strings in `_includes/head.html` and
   `_includes/scripts.html` to `?v=<X.Y.Z>` (the spec suite asserts
   they match `Stygian::VERSION`, so they cannot drift).
4. Open the release PR (theme changes + changelog + version bump) and
   merge it after CI passes.
5. Tag the release on `main`: `git tag v<X.Y.Z>` and push the tag.
   The publish-gem workflow builds the gem from version tags.
6. Consumers on GitHub Pages pick the theme up on their next rebuild;
   versioned asset URLs bust the Pages CDN cache automatically.

Every release keeps its tag and is never rewritten - fixes land as the
next version, never as a force-pushed edit. See the versioning note in
`README.md`.

## Design and development principles

- **Docs first.** The theme is an engine for markdown collections:
  sidebar navigation, prev/next, search, SEO. Anything that is not
  documentation infrastructure needs a strong reason to exist.
- **Zero plugins, zero frameworks.** Everything ships as Liquid
  includes, one CSS file and one vanilla JS file. It must keep working
  on GitHub Pages without a plugin whitelist.
- **Compatibility over convention.** Just-the-docs config keys, front
  matter and class names keep working; the native `stygian:` block
  wins when both are set.
- **Reduced motion is a first-class user.** Every effect has a
  `prefers-reduced-motion` fallback.
- **Accessible by default.** Semantic landmarks, aria labels, keyboard
  search and visible focus states are part of the theme, not add-ons.
- **No personal data.** The repository must stay free of personal
  identities: no author emails, no personal handles in copyright
  lines, no private links.

## License

By contributing you agree that your contributions are licensed under
the MIT license, as described in [LICENSE](LICENSE).

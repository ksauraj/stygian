# Security policy

## Supported versions

Stygian is distributed as a remote theme (default branch) and as a gem.
Fixes land on the default branch and are released with the next asset
version bump. The gem version follows the `lib/stygian/version.rb`
value; only the latest gem release receives security fixes.

## Reporting a vulnerability

Please do **not** open a public issue for security vulnerabilities.
Report privately through the GitHub security advisory workflow:

https://github.com/ksauraj/stygian/security/advisories/new

You can expect:

- an acknowledgment within 48 hours
- a status update at least once a week while the report is open
- credit for the finding in the advisory and changelog, unless you
  prefer to stay anonymous

## Scope

In scope:

- XSS or injection vectors reachable from site configuration or
  markdown content rendered by the theme
- Script injection via the JavaScript modules (search, mermaid, theme
  switch)
- Dependency vulnerabilities in the runtime assets the theme loads
  (mermaid via jsDelivr, Google Fonts)

Out of scope:

- Vulnerabilities in Jekyll or GitHub Pages themselves
- Issues in a specific site's content or deployment
- Phishing-style abuse of sites built with the theme

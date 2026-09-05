# frozen_string_literal: true

require_relative "lib/stygian/version"

Gem::Specification.new do |spec|
  spec.name          = "stygian"
  spec.version       = Stygian::VERSION
  spec.authors       = ["ksauraj"]
  spec.email         = ["gitsauraj@gmail.com"]

  spec.summary       = "Stygian - a modern docs theme for Jekyll and GitHub Pages: search, dark/light themes, SEO."
  spec.description   = "Stygian is a docs-first Jekyll theme in the spirit of just-the-docs. Drop markdown files into a docs collection and it renders a documentation site with ordered sidebar navigation (nav_order, parent nesting, nav_exclude), breadcrumbs, prev/next paging, client-side search with zero plugins, copy buttons on code blocks, callouts, scrollable tables, lazy Mermaid diagrams that follow the theme, and automatic SEO (WebSite + BreadcrumbList JSON-LD, Open Graph, canonical). Includes dark and light design systems built on CSS custom properties, a saved visitor theme preference with a View Transitions circular reveal, extension hooks (head/header/footer/nav-footer custom), reduced-motion support, and restrained flicker/glare accents. No frameworks, no build step: one vanilla JavaScript file."
  spec.homepage      = "https://github.com/ksauraj/stygian"
  spec.license       = "MIT"

  spec.metadata = {
    "homepage_uri"      => spec.homepage,
    "source_code_uri"   => spec.homepage,
    "bug_tracker_uri"   => "#{spec.homepage}/issues",
    "documentation_uri" => "#{spec.homepage}/#documentation",
    "rubygems_mfa_required" => "true",
  }

  spec.files = Dir[
    "_includes/**/*",
    "_layouts/**/*",
    "assets/**/*",
    "lib/**/*",
    "LICENSE",
    "README.md",
  ]
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency "jekyll", ">= 3.9", "< 5.0"
end

# frozen_string_literal: true

require_relative "lib/stygian/version"

Gem::Specification.new do |spec|
  spec.name          = "stygian"
  spec.version       = Stygian::VERSION
  spec.authors       = ["ksauraj"]
  spec.email         = ["gitsauraj@gmail.com"]

  spec.summary       = "Stygian - a modern docs theme for Jekyll and GitHub Pages with dark/light themes and a binary-ripple transition."
  spec.description   = "Stygian is a docs-first Jekyll theme in the spirit of just-the-docs. Drop markdown files into a docs collection and it renders a documentation site with ordered sidebar navigation, nested sections (parent/nav_order/nav_exclude), prev/next page links, and a prose engine for code blocks with copy buttons, scrollable tables, callouts and lazy Mermaid diagrams. Includes a light and dark design system built on CSS custom properties, a View Transitions theme switch with a collision-aware binary-glyph ripple, and a restrained flicker/glare effect suite. No frameworks, no build step: plain CSS variables and one vanilla JavaScript file."
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

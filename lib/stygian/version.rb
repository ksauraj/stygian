# frozen_string_literal: true

module Stygian
  # SemVer release version. Bumped only when cutting a release; the asset
  # query strings in _includes/head.html and _includes/scripts.html must
  # match (guarded by spec/build_spec.rb). Tags follow v<version>.
  VERSION = "0.2.0"
end

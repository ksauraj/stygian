# frozen_string_literal: true

require "jekyll"
require "tmpdir"
require "json"
require_relative "../lib/stygian/version"

ROOT = File.expand_path("..", __dir__)

def build_site
  dest = Dir.mktmpdir("stygian-site")
  cfg = Jekyll.configuration(
    "source" => ROOT,
    "destination" => dest,
    "baseurl" => "",
    "url" => "https://example.com",
    "quiet" => true,
    "disable_disk_cache" => true
  )
  site = Jekyll::Site.new(cfg)
  site.process
  dest
end

def read(dest, rel)
  File.read(File.join(dest, rel))
end

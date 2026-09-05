# frozen_string_literal: true

require "rspec/core/rake_task"
require "rubygems/package_task"

RSpec::Core::RakeTask.new(:spec)

desc "Build the gem"
task :gem do
  sh "gem build stygian.gemspec"
end

task default: :spec

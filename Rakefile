# frozen_string_literal: true
require "bundler/gem_tasks"
require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "test/ruby"
  t.test_files = FileList["test/ruby/**/*_test.rb"]
  t.warning = false
end

task default: :test

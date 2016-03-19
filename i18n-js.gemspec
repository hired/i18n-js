# frozen_string_literal: true
require File.expand_path("../lib/i18n/js/version", __FILE__)

Gem::Specification.new do |s|
  s.required_ruby_version = ">= 2.1.0"
  s.name        = "i18n-js"
  s.version     = I18n::JS::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Nando Vieira"]
  s.email       = ["fnando.vieira@gmail.com"]
  s.homepage    = "http://rubygems.org/gems/i18n-js"
  s.summary     = "It's a small library to provide the Rails I18n translations on the Javascript."
  s.description = s.summary
  s.license       = "MIT"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map {|f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_dependency "railties"
  s.add_dependency "sprockets-rails", ">= 3.0"
  s.add_development_dependency "activesupport"
  s.add_development_dependency "rake"
  s.add_development_dependency "minitest-utils"
  s.add_development_dependency "pry-meta"
  s.add_development_dependency "rubocop"
  s.add_development_dependency "oj"
  s.add_development_dependency "mocha"
end

# frozen_string_literal: true
require "bundler/setup"
require "i18n/js"

require "minitest/utils"
require "minitest/autorun"
require "mocha/mini_test"

I18n.load_path += ["#{__dir__}/fixtures/locales.yml"]
I18n.available_locales = %w[en fr]

module Minitest
  class Test
    # Shortcut to I18n::JS.translations
    def translations
      I18n::JS::Filter.translations
    end
  end
end

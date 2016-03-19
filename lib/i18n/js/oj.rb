# frozen_string_literal: true
require "i18n/js"
require "oj"

I18n::JS.json_encoder = lambda do |translations|
  Oj.dump(translations, mode: :compat)
end

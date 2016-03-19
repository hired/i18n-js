# frozen_string_literal: true
require "i18n/js"
require "json"

I18n::JS.json_encoder = lambda do |translations|
  JSON.pretty_generate(translations)
end

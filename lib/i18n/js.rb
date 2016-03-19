# frozen_string_literal: true
require "rails/engine"
require "sprockets/context"

require "i18n/js/engine"
require "i18n/js/dependency_resolver"
require "i18n/js/filter"
require "i18n/js/view_helpers"

module I18n
  module JS
    class << self
      attr_accessor :output_namespace
      attr_accessor :fallbacks
      attr_accessor :json_encoder
      attr_accessor :translations
      attr_accessor :include_shims
    end

    def self.configure
      yield self
    end

    def self.defaults!
      @include_shims = true
      @output_namespace = "I18n"
      @fallbacks = false
      @json_encoder = ->(translations) { JSON.dump(translations) }
      @translations = proc do
        ::I18n.backend.instance_eval do
          init_translations unless initialized?
          translations.slice(*::I18n.available_locales)
        end
      end
    end

    defaults!
  end
end

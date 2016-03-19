# frozen_string_literal: true
module I18n
  module JS
    module ViewHelpers
      # Generate a JavaScript call to `I18n.storeTranslations(translations);`.
      #
      #   store_translations "*"
      #   store_translations "*.date.*", "*.time.*"
      #   store_translations ["*.date.*", "*.time.*"]
      #
      def store_translations(*scopes)
        translations = Filter.filter(scopes)
        payload = I18n::JS.json_encoder.call(translations)

        if translations.values.first
          "#{JS.output_namespace}.storeTranslations(#{payload});"
        else
          "console.warn('[i18njs] scope is not defined:', '#{scopes}');"
        end
      end
    end
  end
end

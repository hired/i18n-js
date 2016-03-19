# frozen_string_literal: true
module I18n
  module JS
    class Filter
      def self.filter(scopes)
        result = {}
        scopes = [scopes].flatten

        scopes.each do |scope|
          result = result.deep_merge(new.filter(I18n::JS.translations.call, scope) || {})
        end

        result
      end

      # Filter translations according to the specified scope.
      def filter(translations, scopes)
        scopes = scopes.split(".") if scopes.kind_of?(String)
        scopes = scopes.clone
        current_scope = scopes.shift

        if current_scope == "*"
          translations.each_with_object({}) do |(next_scope, next_translations), results|
            tmp = scopes.empty? ? next_translations : filter(next_translations, scopes)
            results[next_scope.to_sym] = tmp unless tmp.nil?
          end
        elsif translations.respond_to?(:key?) && translations.key?(current_scope.to_sym)
          value = translations[current_scope.to_sym]
          {current_scope.to_sym => scopes.empty? ? value : filter(value, scopes)}
        end
      end
    end
  end
end

# frozen_string_literal: true
module I18n
  module JS
    class Engine < ::Rails::Engine
      initializer :i18njs do
        Sprockets.register_dependency_resolver "translations" do
          # These are the files that must be watched. Any changes on
          # any of these will trigger a recompilation of the translations
          # files.
          files = [
            File.expand_path("../version.rb", __FILE__),
            root.join("app/assets/javascripts/i18n.js.erb").to_s,
            *I18n.load_path
          ]

          # Similar to `files`, this is the list of static values that, when
          # changed, will trigger a recompilation of the translations files.
          values = [config.assets.version, I18n::JS.include_shims.to_s]

          DependencyResolver.new(files, values).digest
        end

        config.assets.configure do |env|
          env.depend_on "translations"
        end

        Sprockets::Context.class_eval do
          include ActionView::Helpers::JavaScriptHelper
          include ViewHelpers
        end
      end
    end
  end
end

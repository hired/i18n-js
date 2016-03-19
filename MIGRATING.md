# Migrating from older versions

## From any version to v4.0.0

- The option `I18n.missingBehaviour` was renamed to `missingBehavior`.
- The configuration through YAML files was removed; use template files that calls `<%= store_translations "en.*" %>`.
- The `pretty_print` configuration was removed; set a callable to `I18n::JS.json_encoder` to transform the output.
- The `sort_translation_keys` configuration was removed; set a callable to `I18n::JS.json_encoder` to transform the output.
- Remove the middleware if you're using it.

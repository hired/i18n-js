# frozen_string_literal: true
require "test_helper"

class ViewHelpersTest < Minitest::Test
  let(:helpers) {
    Object.new.extend(I18n::JS::ViewHelpers)
  }

  setup do
    I18n::JS.defaults!
  end

  teardown do
    I18n::JS.defaults!
  end

  test "uses default json exporter" do
    content = helpers.store_translations("en.foo")
    expected = %[I18n.storeTranslations({"en":{"foo":"Foo"}});]

    assert_equal expected, content
  end

  test "warns about missing scope" do
    content = helpers.store_translations("missing.scope")
    expected = %[console.warn('[i18njs] scope is not defined:', '["missing.scope"]');]

    assert_equal expected, content
  end

  test "uses custom json exporter" do
    I18n::JS.json_encoder = proc { %["CUSTOM"] }

    content = helpers.store_translations("*")
    expected = %[I18n.storeTranslations("CUSTOM");]

    assert_equal expected, content
  end
end

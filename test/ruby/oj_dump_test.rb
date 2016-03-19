# frozen_string_literal: true
require "test_helper"

class OjDumpTest < Minitest::Test
  setup do
    load "i18n/js/oj.rb"
  end

  teardown do
    I18n::JS.defaults!
  end

  test "uses Oj" do
    translations = {en: {hello: "hello"}}
    I18n::JS.translations = -> { translations }
    helpers = Object.new.extend(I18n::JS::ViewHelpers)

    Oj.expects(:dump).with(translations, mode: :compat).returns(%["DATA"])

    actual = helpers.store_translations("*")
    assert_equal %[I18n.storeTranslations("DATA");], actual
  end
end

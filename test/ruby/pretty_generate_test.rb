# frozen_string_literal: true
require "test_helper"

class PrettyGenerateTest < Minitest::Test
  setup do
    load "i18n/js/pretty_print.rb"
  end

  teardown do
    I18n::JS.defaults!
  end

  test "performs pretty print" do
    translations = {en: {hello: "hello"}}
    I18n::JS.translations = -> { translations }
    helpers = Object.new.extend(I18n::JS::ViewHelpers)

    JSON.expects(:pretty_generate).with(translations).returns(%["DATA"])

    actual = helpers.store_translations("*")
    assert_equal %[I18n.storeTranslations("DATA");], actual
  end
end

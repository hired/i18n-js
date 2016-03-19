# frozen_string_literal: true
require "test_helper"

class TranslationsTest < Minitest::Test
  teardown do
    I18n::JS.defaults!
  end

  test "returns custom translations" do
    I18n::JS.translations = proc do
      {en: {foo: "Bar"}}
    end

    expected = {en: {foo: "Bar"}}

    assert_equal expected, I18n::JS::Filter.filter("*")
  end
end

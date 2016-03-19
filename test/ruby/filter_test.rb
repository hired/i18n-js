# frozen_string_literal: true
require "test_helper"

class FilterTest < Minitest::Test
  test "filters translations using scope *.date.formats" do
    result = I18n::JS::Filter.filter("*.date.formats")

    assert_equal [:formats], result[:en][:date].keys
    assert_equal [:formats], result[:fr][:date].keys
  end

  test "filters translations using scope a list of scopes" do
    scopes = ["*.date.formats", "*.number.currency.format"]
    result = I18n::JS::Filter.filter(scopes)

    assert_equal %i[date number], result[:en].keys.sort
    assert_equal %i[date number], result[:fr].keys.sort
  end

  test "filters translations using multi-star scope" do
    result = I18n::JS::Filter.filter("*.*.formats")

    assert_equal %i[date time], result[:en].keys.sort
    assert_equal %i[date time], result[:fr].keys.sort

    assert_equal %i[formats], result[:en][:date].keys
    assert_equal %i[formats], result[:en][:time].keys
  end

  test "filters translations using alternated stars" do
    result = I18n::JS::Filter.filter("*.admin.*.title")

    assert_equal %i[edit show], result[:en][:admin].keys.sort
    assert_equal %i[edit show], result[:fr][:admin].keys.sort

    assert_equal "Show", result[:en][:admin][:show][:title]
    assert_equal "Visualiser", result[:fr][:admin][:show][:title]

    assert_equal "Edit", result[:en][:admin][:edit][:title]
    assert_equal "Editer", result[:fr][:admin][:edit][:title]
  end
end

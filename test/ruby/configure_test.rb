# frozen_string_literal: true
require "test_helper"

class ConfigureTest < Minitest::Test
  test "yields object" do
    actual = nil

    I18n::JS.configure do |config|
      actual = config
    end

    assert_equal I18n::JS, actual
  end
end

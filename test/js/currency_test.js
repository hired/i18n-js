var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

QUnit.module("Currency", {beforeEach: function() {
  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("formats currency with default settings", function(assert) {
  assert.equal(I18n.toCurrency(100.99), "$100.99");
  assert.equal(I18n.toCurrency(1000.99), "$1,000.99");
  assert.equal(I18n.toCurrency(-1000), "-$1,000.00");
});

QUnit.test("formats currency with custom settings", function(assert) {
  I18n.translations.en.number = {
    currency: {
      format: {
        format: "%n %u",
        unit: "USD",
        delimiter: ".",
        separator: ",",
        precision: 2
      }
    }
  };

  assert.equal(I18n.toCurrency(12), "12,00 USD");
  assert.equal(I18n.toCurrency(123), "123,00 USD");
  assert.equal(I18n.toCurrency(1234.56), "1.234,56 USD");
});

QUnit.test("formats currency with custom settings and partial overriding", function(assert) {
  I18n.translations.en.number = {
    currency: {
      format: {
        format: "%n %u",
        unit: "USD",
        delimiter: ".",
        separator: ",",
        precision: 2
      }
    }
  };

  assert.equal(I18n.toCurrency(12, {precision: 0}), "12 USD");
  assert.equal(I18n.toCurrency(123, {unit: "bucks"}), "123,00 bucks");
});

QUnit.test("formats currency with some custom options that should be merged with default options", function(assert) {
  assert.equal(I18n.toCurrency(1234, {precision: 0}), "$1,234");
  assert.equal(I18n.toCurrency(1234, {unit: "º"}), "º1,234.00");
  assert.equal(I18n.toCurrency(1234, {separator: "-"}), "$1,234-00");
  assert.equal(I18n.toCurrency(1234, {delimiter: "-"}), "$1-234.00");
  assert.equal(I18n.toCurrency(1234, {format: "%u %n"}), "$ 1,234.00");
  assert.equal(I18n.toCurrency(-123, {sign_first: false}), "$-123.00");
});

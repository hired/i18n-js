var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var actual;
var options;

QUnit.module("Numbers", {beforeEach: function() {
  actual = null;
  options = null;

  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("formats number with default settings", function(assert) {
  assert.equal(I18n.toNumber(1), "1.000");
  assert.equal(I18n.toNumber(12), "12.000");
  assert.equal(I18n.toNumber(123), "123.000");
  assert.equal(I18n.toNumber(1234), "1,234.000");
  assert.equal(I18n.toNumber(12345), "12,345.000");
  assert.equal(I18n.toNumber(123456), "123,456.000");
  assert.equal(I18n.toNumber(1234567), "1,234,567.000");
  assert.equal(I18n.toNumber(12345678), "12,345,678.000");
  assert.equal(I18n.toNumber(123456789), "123,456,789.000");
});

QUnit.test("formats negative numbers with default settings", function(assert) {
  assert.equal(I18n.toNumber(-1), "-1.000");
  assert.equal(I18n.toNumber(-12), "-12.000");
  assert.equal(I18n.toNumber(-123), "-123.000");
  assert.equal(I18n.toNumber(-1234), "-1,234.000");
  assert.equal(I18n.toNumber(-12345), "-12,345.000");
  assert.equal(I18n.toNumber(-123456), "-123,456.000");
  assert.equal(I18n.toNumber(-1234567), "-1,234,567.000");
  assert.equal(I18n.toNumber(-12345678), "-12,345,678.000");
  assert.equal(I18n.toNumber(-123456789), "-123,456,789.000");
});

QUnit.test("formats number with partial translation and default options", function(assert) {
  I18n.translations.en.number = {
    format: {
      precision: 2
    }
  };

  assert.equal(I18n.toNumber(1234), "1,234.00");
});

QUnit.test("formats number with full translation and default options", function(assert) {
  I18n.translations.en.number = {
    format: {
      delimiter: ".",
      separator: ",",
      precision: 2
    }
  };

  assert.equal(I18n.toNumber(1234), "1.234,00");
});

QUnit.test("formats numbers with some custom options that should be merged with default options", function(assert) {
  assert.equal(I18n.toNumber(1234.56, {precision: 0}), "1,235");
  assert.equal(I18n.toNumber(1234, {separator: "-"}), "1,234-000");
  assert.equal(I18n.toNumber(1234, {delimiter: "_"}), "1_234.000");
});

QUnit.test("formats number considering options", function(assert) {
  options = {
    precision: 2,
    separator: ",",
    delimiter: "."
  };

  assert.equal(I18n.toNumber(1, options), "1,00");
  assert.equal(I18n.toNumber(12, options), "12,00");
  assert.equal(I18n.toNumber(123, options), "123,00");
  assert.equal(I18n.toNumber(1234, options), "1.234,00");
  assert.equal(I18n.toNumber(123456, options), "123.456,00");
  assert.equal(I18n.toNumber(1234567, options), "1.234.567,00");
  assert.equal(I18n.toNumber(12345678, options), "12.345.678,00");
});

QUnit.test("formats numbers with different precisions", function(assert) {
  options = {separator: ".", delimiter: ","};

  options["precision"] = 2;
  assert.equal(I18n.toNumber(1.98, options), "1.98");

  options["precision"] = 3;
  assert.equal(I18n.toNumber(1.98, options), "1.980");

  options["precision"] = 2;
  assert.equal(I18n.toNumber(1.987, options), "1.99");

  options["precision"] = 1;
  assert.equal(I18n.toNumber(1.98, options), "2.0");

  options["precision"] = 0;
  assert.equal(I18n.toNumber(1.98, options), "2");
});

QUnit.test("rounds numbers correctly when precision is given", function(assert) {
  options = {separator: ".", delimiter: ","};

  options["precision"] = 2;
  assert.equal(I18n.toNumber(0.104, options), "0.10");

  options["precision"] = 2;
  assert.equal(I18n.toNumber(0.105, options), "0.11");

  options["precision"] = 2;
  assert.equal(I18n.toNumber(1.005, options), "1.01");

  options["precision"] = 3;
  assert.equal(I18n.toNumber(35.855, options), "35.855");

  options["precision"] = 2;
  assert.equal(I18n.toNumber(35.855, options), "35.86");

  options["precision"] = 1;
  assert.equal(I18n.toNumber(35.855, options), "35.9");

  options["precision"] = 0;
  assert.equal(I18n.toNumber(35.855, options), "36");

  options["precision"] = 0;
  assert.equal(I18n.toNumber(0.000000000000001, options), "0");
});

QUnit.test("returns number as human size", function(assert) {
  var kb = 1024;

  assert.equal(I18n.toHumanSize(1), "1Byte");
  assert.equal(I18n.toHumanSize(100), "100Bytes");

  assert.equal(I18n.toHumanSize(kb), "1KB");
  assert.equal(I18n.toHumanSize(kb * 1.5), "1.5KB");

  assert.equal(I18n.toHumanSize(kb * kb), "1MB");
  assert.equal(I18n.toHumanSize(kb * kb * 1.5), "1.5MB");

  assert.equal(I18n.toHumanSize(kb * kb * kb), "1GB");
  assert.equal(I18n.toHumanSize(kb * kb * kb * 1.5), "1.5GB");

  assert.equal(I18n.toHumanSize(kb * kb * kb * kb), "1TB");
  assert.equal(I18n.toHumanSize(kb * kb * kb * kb * 1.5), "1.5TB");

  assert.equal(I18n.toHumanSize(kb * kb * kb * kb * kb), "1024TB");
});

QUnit.test("returns number as human size using custom options", function(assert) {
  assert.equal(I18n.toHumanSize(1024 * 1.6, {precision: 0}), "2KB");
});

QUnit.test("formats numbers with strip insignificant zero", function(assert) {
  options = {separator: ".", delimiter: ",", strip_insignificant_zeros: true};

  options["precision"] = 2;
  assert.equal(I18n.toNumber(1.0, options), "1");

  options["precision"] = 3;
  assert.equal(I18n.toNumber(1.98, options), "1.98");

  options["precision"] = 4;
  assert.equal(I18n.toNumber(1.987, options), "1.987");
});

QUnit.test("keeps significant zeros [issue#103]", function(assert) {
  actual = I18n.toNumber(30, {strip_insignificant_zeros: true, precision: 0});
  assert.equal(actual, "30");
});

var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

QUnit.module("Localization", {beforeEach: function() {
  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("localizes number", function(assert) {
  assert.equal(I18n.l("number", 1234567), "1,234,567.000");
});

QUnit.test("localizes currency", function(assert) {
  assert.equal(I18n.l("currency", 1234567), "$1,234,567.00");
});

QUnit.test("localizes date strings", function(assert) {
  I18n.locale = "pt-BR";

  assert.equal(I18n.l("date.formats.default", "2009-11-29"), "29/11/2009");
  assert.equal(I18n.l("date.formats.short", "2009-01-07"), "07 de Janeiro");
  assert.equal(I18n.l("date.formats.long", "2009-01-07"), "07 de Janeiro de 2009");
});

QUnit.test("localizes time strings", function(assert) {
  I18n.locale = "pt-BR";

  assert.equal(I18n.l("time.formats.default", "2009-11-29 15:07:59"), "Domingo, 29 de Novembro de 2009, 15:07 h");
  assert.equal(I18n.l("time.formats.short", "2009-01-07 09:12:35"), "07/01, 09:12 h");
  assert.equal(I18n.l("time.formats.long", "2009-11-29 15:07:59"), "Domingo, 29 de Novembro de 2009, 15:07 h");
});

QUnit.test("localizes date/time strings with placeholders", function(assert) {
  I18n.locale = "pt-BR";

  assert.equal(I18n.l("date.formats.short_with_placeholders", "2009-01-07", {p1: "!", p2: "?"}), "07 de Janeiro ! ?");
  assert.equal(I18n.l("time.formats.short_with_placeholders", "2009-01-07 09:12:35", {p1: "!"}), "07/01, 09:12 h !");
});

QUnit.test("localizes percentage", function(assert) {
  I18n.locale = "pt-BR";
  assert.equal(I18n.l("percentage", 123.45), "123,45%");
});

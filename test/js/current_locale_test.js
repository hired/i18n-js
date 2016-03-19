var I18n = require("../../dist/i18n");

QUnit.module("Current locale", {beforeEach: function() {
  I18n.reset();
}});

QUnit.test("returns I18n.locale", function(assert) {
  I18n.locale = "pt-BR";
  assert.equal(I18n.currentLocale(), "pt-BR");
});

QUnit.test("returns I18n.defaultLocale", function(assert) {
  I18n.locale = null;
  I18n.defaultLocale = "pt-BR";

  assert.equal(I18n.currentLocale(), "pt-BR");
});

var I18n = require("../../dist/i18n");

QUnit.module("Defaults", {beforeEach: function() {
  I18n.reset();
}});

QUnit.test("sets the default locale", function(assert) {
  assert.equal(I18n.defaultLocale, "en");
});

QUnit.test("sets current locale", function(assert) {
  assert.equal(I18n.locale, "en");
});

QUnit.test("sets default separator", function(assert) {
  assert.equal(I18n.defaultSeparator, ".");
});

QUnit.test("sets fallback", function(assert) {
  assert.equal(I18n.fallbacks, false);
});

QUnit.test("set empty translation prefix", function(assert) {
  assert.equal(I18n.missingTranslationPrefix, "");
});

QUnit.test("sets default missingBehavior", function(assert) {
  assert.equal(I18n.missingBehavior, "message");
});

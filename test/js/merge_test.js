var I18n = require("../../dist/i18n");

QUnit.module("Merging translations", {beforeEach: function() {
  I18n.translations = {};
}});

QUnit.test("merges different translations", function(assert) {
  I18n.storeTranslations({a: 1});
  I18n.storeTranslations({b: 2});

  assert.deepEqual(I18n.translations, {a: 1, b: 2});
});

QUnit.test("overrides existing properties", function(assert) {
  I18n.storeTranslations({a: 1});
  I18n.storeTranslations({a: 2});

  assert.deepEqual(I18n.translations, {a: 2});
});

QUnit.test("overrides existing properties", function(assert) {
  I18n.storeTranslations({a: 1});
  I18n.storeTranslations({a: 2});

  assert.deepEqual(I18n.translations, {a: 2});
});

QUnit.test("performs deep merge", function(assert) {
  I18n.storeTranslations({a: 1, b: {c: 2}});
  I18n.storeTranslations({b: {c: 3, d: 4}});
  var expected = {a: 1, b: {c: 3, d: 4}};

  assert.deepEqual(I18n.translations, expected);
});

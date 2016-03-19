var I18n = require("../../dist/i18n");

QUnit.module("Locales", {beforeEach: function() {
  I18n.reset();
}});

QUnit.test("returns the requested locale, if available", function(assert) {
  I18n.locales["ab"] = ["ab"];
  assert.deepEqual(I18n.locales.get("ab"), ["ab"]);
});

QUnit.test("wraps single results in an array", function(assert) {
  I18n.locales["cd"] = "cd";
  assert.deepEqual(I18n.locales.get("cd"), ["cd"]);
});

QUnit.test("returns the result of locale functions", function(assert) {
  I18n.locales["fn"] = function() {
    return "gg";
  };

  assert.deepEqual(I18n.locales.get("fn"), ["gg"]);
});

QUnit.test("uses I18n.locale as a fallback", function(assert) {
  I18n.locale = "xx";
  I18n.locales["xx"] = ["xx"];

  assert.deepEqual(I18n.locales.get(), ["xx"]);
  assert.deepEqual(I18n.locales.get("yy"), ["xx"]);
});

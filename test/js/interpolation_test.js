var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var actual;

QUnit.module("Interpolation", {beforeEach: function() {
  actual = null;

  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("performs single interpolation", function(assert) {
  actual = I18n.t("greetings.name", {name: "John Doe"});
  assert.equal(actual, "Hello John Doe!");
});

QUnit.test("performs multiple interpolations", function(assert) {
  actual = I18n.t("profile.details", {name: "John Doe", age: 27});
  assert.equal(actual, "John Doe is 27-years old");
});

QUnit.test("outputs missing placeholder message if interpolation value is missing", function(assert) {
  actual = I18n.t("greetings.name");
  assert.equal(actual, "Hello [missing {{name}} value]!");
});

QUnit.test("outputs missing placeholder message if interpolation value is null", function(assert) {
  actual = I18n.t("greetings.name", {name: null});
  assert.equal(actual, "Hello [missing {{name}} value]!");
});

QUnit.test("allows overriding the null placeholder message", function(assert) {
  var orig = I18n.nullPlaceholder;
  I18n.nullPlaceholder = function() { return ""; };
  actual = I18n.t("greetings.name", {name: null});
  assert.equal(actual, "Hello !");
  I18n.nullPlaceholder = orig;
});

QUnit.test("provides missingPlaceholder with the placeholder, message, and options object", function(assert) {
  var orig = I18n.missingPlaceholder;

  I18n.missingPlaceholder = function(placeholder, message, options) {
    assert.equal(placeholder, "{{name}}");
    assert.equal(message, "Hello {{name}}!");
    assert.equal(options.debugScope, "landing-page");
    return "[missing-placeholder-debug]";
  };

  actual = I18n.t("greetings.name", {debugScope: "landing-page"});
  assert.equal(actual, "Hello [missing-placeholder-debug]!");
  I18n.missingPlaceholder = orig;
});

var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var actual;
var expected;

var moduleOptions = {beforeEach: function() {
  actual = null;
  expected = null;

  I18n.reset();
  I18n.translations = translations();
}};

QUnit.module("Translate", moduleOptions);

QUnit.test("returns translation for single scope", function(assert) {
  assert.equal(I18n.t("hello"), "Hello World!");
});

QUnit.test("returns translation as object", function(assert) {
  assert.equal(I18n.t("greetings"), I18n.translations.en.greetings);
});

QUnit.test("returns missing message translation for invalid scope", function(assert) {
  actual = I18n.t("invalid.scope");
  expected = "[missing \"en.invalid.scope\" translation]";
  assert.equal(actual, expected);
});

QUnit.test("returns guessed translation if missingBehavior is set to guess", function(assert) {
  I18n.missingBehavior = "guess";
  actual = I18n.t("invalid.thisIsAutomaticallyGeneratedTranslation");
  expected = "this is automatically generated translation";
  assert.equal(actual, expected);
});

QUnit.test("returns guessed translation with prefix if missingBehavior is set to guess and prefix is also provided", function(assert) {
  I18n.missingBehavior = "guess";
  I18n.missingTranslationPrefix = "EE: ";
  actual = I18n.t("invalid.thisIsAutomaticallyGeneratedTranslation");
  expected = "EE: this is automatically generated translation";
  assert.equal(actual, expected);
});

QUnit.test("returns missing message translation for valid scope with scope", function(assert) {
  actual = I18n.t("monster", {scope: "greetings"});
  expected = "[missing \"en.greetings.monster\" translation]";
  assert.equal(actual, expected);
});

QUnit.test("returns translation for single scope on a custom locale", function(assert) {
  I18n.locale = "pt-BR";
  assert.equal(I18n.t("hello"), "Olá Mundo!");
});

QUnit.test("returns translation for multiple scopes", function(assert) {
  assert.equal(I18n.t("greetings.stranger"), "Hello stranger!");
});

QUnit.test("returns translation with default locale option", function(assert) {
  assert.equal(I18n.t("hello", {locale: "en"}), "Hello World!");
  assert.equal(I18n.t("hello", {locale: "pt-BR"}), "Olá Mundo!");
});

QUnit.test("fallbacks to the default locale when I18n.fallbackss is enabled", function(assert) {
  I18n.locale = "pt-BR";
  I18n.fallbacks = true;
  assert.equal(I18n.t("greetings.stranger"), "Hello stranger!");
});

QUnit.test("fallbacks to default locale when providing an unknown locale", function(assert) {
  I18n.locale = "fr";
  I18n.fallbacks = true;
  assert.equal(I18n.t("greetings.stranger"), "Hello stranger!");
});

QUnit.test("fallbacks to less specific locale", function(assert) {
  I18n.locale = "de-DE";
  I18n.fallbacks = true;
  assert.equal(I18n.t("hello"), "Hallo Welt!");
});

QUnit.test("fallbacks using custom rules (function)", function(assert) {
  I18n.locale = "no";
  I18n.fallbacks = true;
  I18n.locales["no"] = function() {
    return ["nb"];
  };

  assert.equal(I18n.t("hello"), "Hei Verden!");
});

QUnit.test("fallbacks using custom rules (array)", function(assert) {
  I18n.locale = "no";
  I18n.fallbacks = true;
  I18n.locales["no"] = ["no", "nb"];

  assert.equal(I18n.t("hello"), "Hei Verden!");
});

QUnit.test("fallbacks using custom rules (string)", function(assert) {
  I18n.locale = "no";
  I18n.fallbacks = true;
  I18n.locales["no"] = "nb";

  assert.equal(I18n.t("hello"), "Hei Verden!");
});

QUnit.test("uses default value for simple translation", function(assert) {
  actual = I18n.t("warning", {defaultValue: "Warning!"});
  assert.equal(actual, "Warning!");
});

QUnit.test("uses default value for unknown locale", function(assert) {
  I18n.locale = "fr";
  actual = I18n.t("warning", {defaultValue: "Warning!"});
  assert.equal(actual, "Warning!");
});

QUnit.test("uses default value with interpolation", function(assert) {
  actual = I18n.t(
    "alert",
    {defaultValue: "Attention! {{message}}", message: "You're out of quota!"}
  );

  assert.equal(actual, "Attention! You're out of quota!");
});

QUnit.test("ignores default value when scope exists", function(assert) {
  actual = I18n.t("hello", {defaultValue: "What's up?"});
  assert.equal(actual, "Hello World!");
});

QUnit.test("returns translation for custom scope separator", function(assert) {
  I18n.defaultSeparator = "•";
  actual = I18n.t("greetings•stranger");
  assert.equal(actual, "Hello stranger!");
});

QUnit.test("returns boolean values", function(assert) {
  assert.equal(I18n.t("booleans.yes"), true);
  assert.equal(I18n.t("booleans.no"), false);
});

QUnit.test("escapes $ when doing substitution (IE)", function(assert) {
  I18n.locale = "en";

  assert.equal(I18n.t("paid", {price: "$0.12"}), "You were paid $0.12");
  assert.equal(I18n.t("paid", {price: "$1.35"}), "You were paid $1.35");
});

QUnit.test("replaces all occurrences of escaped $", function(assert) {
  I18n.locale = "en";
  actual = I18n.t("paid_with_vat", {
    price: "$0.12",
    vat: "$0.02"}
  );

  assert.equal(actual, "You were paid $0.12 (incl. VAT $0.02)");
});

QUnit.test("sets default scope", function(assert) {
  var options = {scope: "greetings"};
  assert.equal(I18n.t("stranger", options), "Hello stranger!");
});

QUnit.test("accepts the scope as an array", function(assert) {
  assert.equal(I18n.t(["greetings", "stranger"]), "Hello stranger!");
});

QUnit.test("accepts the scope as an array using a base scope", function(assert) {
  assert.equal(I18n.t(["stranger"], {scope: "greetings"}), "Hello stranger!");
});

QUnit.module("Pluralization - when provided default values", moduleOptions);

QUnit.test("uses scope provided in defaults if scope doesn't exist", function(assert) {
  actual = I18n.t("Hello!", {defaults: [{scope: "greetings.stranger"}]});
  assert.equal(actual, "Hello stranger!");
});

QUnit.test("continues to fallback until a scope is found", function(assert) {
  var defaults = [{scope: "foo"}, {scope: "hello"}];

  actual = I18n.t("foo", {defaults: defaults});
  assert.equal(actual, "Hello World!");
});

QUnit.test("uses message if specified as a default", function(assert) {
  var defaults = [{message: "Hello all!"}];
  actual = I18n.t("foo", {defaults: defaults});

  assert.equal(actual, "Hello all!");
});

QUnit.test("uses the first message if no scopes are found", function(assert) {
  var defaults = [
    {scope: "bar"},
    {message: "Hello all!"},
    {scope: "hello"}
  ];
  actual = I18n.t("foo", {defaults: defaults});

  assert.equal(actual, "Hello all!");
});

QUnit.test("uses default value if no scope is found", function(assert) {
  var options = {
    defaults: [{scope: "bar"}],
    defaultValue: "Hello all!"
  };
  actual = I18n.t("foo", options);

  assert.equal(actual, "Hello all!");
});

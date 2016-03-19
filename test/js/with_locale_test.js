QUnit.module("I18n.withLocale");

QUnit.test("restores locale", function(assert) {
  var actual;
  I18n.locale = "pt-BR";

  I18n.withLocale("fr", function() {
    actual = I18n.locale;
  });

  assert.equal(I18n.locale, "pt-BR");
  assert.equal(actual, "fr");
});

QUnit.test("restores locale when function raises exception", function(assert) {
  I18n.locale = "pt-BR";

  assert.throws(function() {
    I18n.withLocale("fr", function() {
      throw "sample";
    });
  }, "sample");

  assert.equal(I18n.locale, "pt-BR");
});

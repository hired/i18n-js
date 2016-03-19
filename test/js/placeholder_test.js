var I18n = require("../../dist/i18n");

QUnit.module("Placeholder", {beforeEach: function() {
  I18n.reset();
}});

QUnit.test("matches {{name}}", function(assert) {
  assert.ok("{{name}}".match(I18n.placeholder));
});

QUnit.test("matches %{name}", function(assert) {
  assert.ok("%{name}".match(I18n.placeholder));
});

QUnit.test("returns placeholders", function(assert) {
  var translation = "I like %{javascript}. I also like %{ruby}";
  var matches = translation.match(I18n.placeholder);

  assert.equal(matches[0], "%{javascript}");
  assert.equal(matches[1], "%{ruby}");
});

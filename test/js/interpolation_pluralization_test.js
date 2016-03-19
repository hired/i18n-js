var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var translationKey;
var moduleOptions = {beforeEach: function() {
  translationKey = null;
  I18n.translations = translations();
}};

QUnit.module("Pluralization", moduleOptions);

QUnit.test("when count is provided and translation key has pluralization", function(assert) {
  translationKey = "inbox";

  assert.equal(I18n.t(translationKey, {count: 0}), "You have no messages");
  assert.equal(I18n.t(translationKey, {count: 1}), "You have 1 message");
  assert.equal(I18n.t(translationKey, {count: 5}), "You have 5 messages");
});

QUnit.test("when count is provided and translation key doesn't have pluralization", function(assert) {
  translationKey = "hello";

  assert.equal(I18n.t(translationKey, {count: 0}), "Hello World!");
  assert.equal(I18n.t(translationKey, {count: 1}), "Hello World!");
  assert.equal(I18n.t(translationKey, {count: 5}), "Hello World!");
});

QUnit.test("when count is not provided and translation key has pluralization", function(assert) {
  translationKey = "inbox";

  var options = {
    one : "You have {{count}} message",
    other : "You have {{count}} messages",
    zero : "You have no messages"
  };

  assert.deepEqual(I18n.t(translationKey, {not_count: 0}), options);
  assert.deepEqual(I18n.t(translationKey, {not_count: 1}), options);
  assert.deepEqual(I18n.t(translationKey, {not_count: 5}), options);
});

QUnit.test("when count is not provided and translation key doesn't have pluralization", function(assert) {
  translationKey = "hello";

  assert.equal(I18n.t(translationKey, {not_count: 0}), "Hello World!");
  assert.equal(I18n.t(translationKey, {not_count: 1}), "Hello World!");
  assert.equal(I18n.t(translationKey, {not_count: 5}), "Hello World!");
});

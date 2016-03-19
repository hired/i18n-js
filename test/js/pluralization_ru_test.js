var I18n = require("../../dist/i18n");

try {
  // require.js hack, so it doesn't fail when trying to load these files.
  require("../../app/assets/javascripts/i18n/pluralization/ru");
  require("../../app/assets/javascripts/i18n/shims");
} catch (e) {
  // no-op
}

var keyFor = I18n.pluralization.ru;

QUnit.module("Pluralization - Russian");

QUnit.test("detects one key", function(assert) {
  assert.deepEqual(keyFor(1), ["one"]);
  assert.deepEqual(keyFor(21), ["one"]);
  assert.deepEqual(keyFor(31), ["one"]);
  assert.deepEqual(keyFor(41), ["one"]);
  assert.deepEqual(keyFor(51), ["one"]);
});

QUnit.test("detects few key", function(assert) {
  assert.deepEqual(keyFor(2), ["few"]);
  assert.deepEqual(keyFor(3), ["few"]);
  assert.deepEqual(keyFor(4), ["few"]);
  assert.deepEqual(keyFor(22), ["few"]);
  assert.deepEqual(keyFor(23), ["few"]);
  assert.deepEqual(keyFor(24), ["few"]);
});

QUnit.test("detects many key", function(assert) {
  assert.deepEqual(keyFor(0), ["many"]);
  assert.deepEqual(keyFor(5), ["many"]);
  assert.deepEqual(keyFor(6), ["many"]);
  assert.deepEqual(keyFor(7), ["many"]);
  assert.deepEqual(keyFor(8), ["many"]);
  assert.deepEqual(keyFor(9), ["many"]);
  assert.deepEqual(keyFor(10), ["many"]);
  assert.deepEqual(keyFor(11), ["many"]);
  assert.deepEqual(keyFor(12), ["many"]);
  assert.deepEqual(keyFor(13), ["many"]);
  assert.deepEqual(keyFor(14), ["many"]);
  assert.deepEqual(keyFor(15), ["many"]);
  assert.deepEqual(keyFor(16), ["many"]);
  assert.deepEqual(keyFor(17), ["many"]);
  assert.deepEqual(keyFor(18), ["many"]);
  assert.deepEqual(keyFor(19), ["many"]);
  assert.deepEqual(keyFor(20), ["many"]);
});

QUnit.test("detects other key", function(assert) {
  assert.deepEqual(keyFor(1.1), ["other"]);
});

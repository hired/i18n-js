QUnit.module("Public API check");

var addMessage = [
  "Looks like you're adding a new public attribute to I18n:",
  "a) update this test count",
  "b) update the list of bound attributes at the end of i18n.js.erb"
].join("\n");

var removeMessage = [
  "Looks like you're removing a public attribute from I18n:",
  "a) update this test count",
  "b) update the list of bound attributes at the end of i18n.js.erb"
].join("\n");

QUnit.test("list of public attributes", function(assert) {
  var expected = 30;
  var count = Object.keys(I18n).length;
  var message = count > expected ? addMessage : removeMessage;

  assert.equal(count, expected, message);
});

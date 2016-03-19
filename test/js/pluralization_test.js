var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var actual;
var options;

QUnit.module("Pluralization", {beforeEach: function() {
  actual = null;
  options = null;

  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("sets alias", function(assert) {
  assert.equal(I18n.p, I18n.pluralize);
});

QUnit.test("pluralizes scope", function(assert) {
  assert.equal(I18n.p(0, "inbox"), "You have no messages");
  assert.equal(I18n.p(1, "inbox"), "You have 1 message");
  assert.equal(I18n.p(5, "inbox"), "You have 5 messages");
});

QUnit.test("pluralizes using the 'other' scope", function(assert) {
  I18n.translations["en"]["inbox"]["zero"] = null;
  assert.equal(I18n.p(0, "inbox"), "You have 0 messages");
});

QUnit.test("pluralizes using the 'zero' scope", function(assert) {
  I18n.translations["en"]["inbox"]["zero"] = "No messages (zero)";

  assert.equal(I18n.p(0, "inbox"), "No messages (zero)");
});

QUnit.test("pluralizes using negative values", function(assert) {
  assert.equal(I18n.p(-1, "inbox"), "You have -1 messages");
  assert.equal(I18n.p(-5, "inbox"), "You have -5 messages");
});

QUnit.test("returns missing translation", function(assert) {
  assert.equal(I18n.p(-1, "missing"), "[missing \"en.missing\" translation]");
});

QUnit.test("pluralizes using multiple placeholders", function(assert) {
  actual = I18n.p(1, "unread", {unread: 5});
  assert.equal(actual, "You have 1 new message (5 unread)");

  actual = I18n.p(10, "unread", {unread: 2});
  assert.equal(actual, "You have 10 new messages (2 unread)");

  actual = I18n.p(0, "unread", {unread: 5});
  assert.equal(actual, "You have no new messages (5 unread)");
});

QUnit.test("allows empty strings", function(assert) {
  I18n.translations["en"]["inbox"]["zero"] = "";

  assert.equal(I18n.p(0, "inbox"), "");
});

QUnit.test("pluralizes using custom rules", function(assert) {
  I18n.locale = "custom";

  I18n.pluralization["custom"] = function(count) {
    if (count === 0) { return ["zero"]; }
    if (count >= 1 && count <= 5) { return ["few", "other"]; }
    return ["other"];
  };

  I18n.translations["custom"] = {
    things: {
      zero: "No things",
      few: "A few things",
      other: "%{count} things"
    }
  };

  assert.equal(I18n.p(0, "things"), "No things");
  assert.equal(I18n.p(4, "things"), "A few things");
  assert.equal(I18n.p(-4, "things"), "-4 things");
  assert.equal(I18n.p(10, "things"), "10 things");
});

QUnit.test("pluralizes default value", function(assert) {
  options = {defaultValue: {
    zero: "No things here!",
    one: "There is {{count}} thing here!",
    other: "There are {{count}} things here!"
  }};

  assert.equal(I18n.p(0, "things", options), "No things here!");
  assert.equal(I18n.p(1, "things", options), "There is 1 thing here!");
  assert.equal(I18n.p(5, "things", options), "There are 5 things here!");
});

QUnit.test("ignores pluralization when scope exists", function(assert) {
  options = {defaultValue: {
    zero: "No things here!",
    one: "There is {{count}} thing here!",
    other: "There are {{count}} things here!"
  }};

  assert.equal(I18n.p(0, "inbox", options), "You have no messages");
  assert.equal(I18n.p(1, "inbox", options), "You have 1 message");
  assert.equal(I18n.p(5, "inbox", options), "You have 5 messages");
});

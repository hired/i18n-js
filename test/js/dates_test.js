var I18n = require("../../dist/i18n");
var translations = require("./support/translations");

var expected, actual;

QUnit.module("Dates", {beforeEach: function() {
  expected = null;
  actual = null;

  I18n.reset();
  I18n.translations = translations();
}});

QUnit.test("parses date", function(assert) {
  expected = new Date(2009, 0, 24, 0, 0, 0);
  actual = I18n.parseDate("2009-01-24");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 0, 15, 0);
  actual = I18n.parseDate("2009-01-24 00:15:00");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 0, 0, 15);
  actual = I18n.parseDate("2009-01-24 00:00:15");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 15, 33, 44);
  actual = I18n.parseDate("2009-01-24 15:33:44");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 0, 0, 0);
  actual = I18n.parseDate(expected.getTime());
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 0, 0, 0);
  actual = I18n.parseDate("01/24/2009");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(2009, 0, 24, 14, 33, 55);
  actual = I18n.parseDate(expected).toString();
  assert.equal(actual, expected.toString());

  expected = new Date(2009, 0, 24, 15, 33, 44);
  actual = I18n.parseDate("2009-01-24T15:33:44");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(Date.UTC(2011, 6, 20, 12, 51, 55));
  actual = I18n.parseDate("2011-07-20T12:51:55+0000");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(Date.UTC(2011, 6, 20, 12, 51, 55));
  actual = I18n.parseDate("2011-07-20T12:51:55+00:00");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(Date.UTC(2011, 6, 20, 13, 3, 39));
  actual = I18n.parseDate("Wed Jul 20 13:03:39 +0000 2011");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(Date.UTC(2009, 0, 24, 15, 33, 44));
  actual = I18n.parseDate("2009-01-24T15:33:44Z");
  assert.equal(actual.toString(), expected.toString());

  expected = new Date(Date.UTC(2009, 0, 24, 15, 34, 44, 200));
  actual = I18n.parseDate("2009-01-24T15:34:44.200Z");
  assert.equal(actual.toString(), expected.toString());
  assert.equal(actual.getMilliseconds(), expected.getMilliseconds());

  expected = new Date(Date.UTC(2009, 0, 24, 15, 34, 45, 200));
  actual = I18n.parseDate("2009-01-24T15:34:45.200+0000");
  assert.equal(actual.toString(), expected.toString());
  assert.equal(actual.getMilliseconds(), expected.getMilliseconds());

  expected = new Date(Date.UTC(2009, 0, 24, 15, 34, 46, 200));
  actual = I18n.parseDate("2009-01-24T15:34:46.200+00:00");
  assert.equal(actual.toString(), expected.toString());
  assert.equal(actual.getMilliseconds(), expected.getMilliseconds());
});

QUnit.test("formats date", function(assert) {
  I18n.locale = "pt-BR";

  // 2009-04-26 19:35:44 (Sunday)
  var date = new Date(2009, 3, 26, 19, 35, 44);

  // short week day
  assert.equal(I18n.strftime(date, "%a"), "Dom");

  // full week day
  assert.equal(I18n.strftime(date, "%A"), "Domingo");

  // short month
  assert.equal(I18n.strftime(date, "%b"), "Abr");

  // full month
  assert.equal(I18n.strftime(date, "%B"), "Abril");

  // day
  assert.equal(I18n.strftime(date, "%d"), "26");

  // 24-hour
  assert.equal(I18n.strftime(date, "%H"), "19");

  // 12-hour
  assert.equal(I18n.strftime(date, "%I"), "07");

  // month
  assert.equal(I18n.strftime(date, "%m"), "04");

  // minutes
  assert.equal(I18n.strftime(date, "%M"), "35");

  // meridian
  assert.equal(I18n.strftime(date, "%p"), "PM");

  // seconds
  assert.equal(I18n.strftime(date, "%S"), "44");

  // week day
  assert.equal(I18n.strftime(date, "%w"), "0");

  // short year
  assert.equal(I18n.strftime(date, "%y"), "09");

  // full year
  assert.equal(I18n.strftime(date, "%Y"), "2009");
});

QUnit.test("formats date without padding", function(assert) {
  I18n.locale = "pt-BR";

  // 2009-04-26 19:35:44 (Sunday)
  var date = new Date(2009, 3, 9, 7, 8, 9);

  // 24-hour without padding
  assert.equal(I18n.strftime(date, "%-H"), "7");

  // 12-hour without padding
  assert.equal(I18n.strftime(date, "%-I"), "7");

  // minutes without padding
  assert.equal(I18n.strftime(date, "%-M"), "8");

  // seconds without padding
  assert.equal(I18n.strftime(date, "%-S"), "9");

  // short year without padding
  assert.equal(I18n.strftime(date, "%-y"), "9");

  // month without padding
  assert.equal(I18n.strftime(date, "%-m"), "4");

  // day without padding
  assert.equal(I18n.strftime(date, "%-d"), "9");
  assert.equal(I18n.strftime(date, "%e"), "9");
});

QUnit.test("formats date with padding", function(assert) {
  I18n.locale = "pt-BR";

  // 2009-04-26 19:35:44 (Sunday)
  var date = new Date(2009, 3, 9, 7, 8, 9);

  // 24-hour
  assert.equal(I18n.strftime(date, "%H"), "07");

  // 12-hour
  assert.equal(I18n.strftime(date, "%I"), "07");

  // minutes
  assert.equal(I18n.strftime(date, "%M"), "08");

  // seconds
  assert.equal(I18n.strftime(date, "%S"), "09");

  // short year
  assert.equal(I18n.strftime(date, "%y"), "09");

  // month
  assert.equal(I18n.strftime(date, "%m"), "04");

  // day
  assert.equal(I18n.strftime(date, "%d"), "09");
});

QUnit.test("formats date with negative time zone", function(assert) {
  I18n.locale = "pt-BR";
  var date = new Date(2009, 3, 26, 19, 35, 44);

  sinon.stub(date, "getTimezoneOffset").returns(345);

  assert.ok(I18n.strftime(date, "%z").match(/^(\+|-)[\d]{4}$/));
  assert.equal(I18n.strftime(date, "%z"), "-0545");
});

QUnit.test("formats date with positive time zone", function(assert) {
  I18n.locale = "pt-BR";
  var date = new Date(2009, 3, 26, 19, 35, 44);

  sinon.stub(date, "getTimezoneOffset").returns(-345);

  assert.ok(I18n.strftime(date, "%z").match(/^(\+|-)[\d]{4}$/));
  assert.equal(I18n.strftime(date, "%z"), "+0545");
});

QUnit.test("formats date with custom meridian", function(assert) {
  I18n.locale = "en-US";
  var date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%p"), "pm");
});

QUnit.test("formats date with meridian boundaries", function(assert) {
  I18n.locale = "en-US";
  var date = new Date(2009, 3, 26, 0, 35, 44);
  assert.equal(I18n.strftime(date, "%p"), "am");

  date = new Date(2009, 3, 26, 12, 35, 44);
  assert.equal(I18n.strftime(date, "%p"), "pm");
});

QUnit.test("formats date using 12-hours format", function(assert) {
  I18n.locale = "pt-BR";
  var date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%I"), "07");

  date = new Date(2009, 3, 26, 12, 35, 44);
  assert.equal(I18n.strftime(date, "%I"), "12");

  date = new Date(2009, 3, 26, 0, 35, 44);
  assert.equal(I18n.strftime(date, "%I"), "12");
});

QUnit.test("defaults to English", function(assert) {
  I18n.locale = "wk";

  var date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%a"), "Sun");
});

QUnit.test("applies locale fallback", function(assert) {
  I18n.defaultLocale = "en-US";
  I18n.locale = "de";

  var date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%A"), "Sonntag");

  date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%a"), "Sun");
});

QUnit.test("uses time as the meridian scope", function(assert) {
  I18n.locale = "de";

  var date = new Date(2009, 3, 26, 19, 35, 44);
  assert.equal(I18n.strftime(date, "%p"), "de:PM");

  date = new Date(2009, 3, 26, 7, 35, 44);
  assert.equal(I18n.strftime(date, "%p"), "de:AM");
});

QUnit.test("fails to format invalid date", function(assert) {
  var date = new Date("foo");
  expected = "I18n.strftime() requires a valid date object, but received an invalid date.";

  assert.throws(function() {
    I18n.strftime(date, "%a");
  }, expected);
});

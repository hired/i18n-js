# I18n.js

![This project is under development. The idea is to replace i18n-js with a simpler solution.](http://messages.hellobits.com/info.svg?message=This%20project%20is%20under%20development.%20The%20idea%20is%20to%20replace%20i18n-js%20with%20a%20simpler%20solution.)

![This branch is compatible with Rails 4.2+ and Ruby 2.1+ only.](http://messages.hellobits.com/warning.svg?message=This%20branch%20is%20compatible%20with%20Rails%204.2%2B%20only.)

[![Build Status](http://img.shields.io/travis/fnando/i18n-js/experiment.svg?style=flat-square)](https://travis-ci.org/fnando/i18n-js)
[![Code Climate](http://img.shields.io/codeclimate/github/fnando/i18n-js/experiment.svg?style=flat-square)](https://codeclimate.com/github/fnando/i18n-js)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-1dce73.svg?style=flat-square)](https://gitter.im/fnando/i18n-js)

It's a small library to provide the Rails I18n translations on the JavaScript.

Features:

- Pluralization
- Date/Time localization
- Number localization
- Locale fallback
- Asset pipeline support
- Lots more! :)

## Version Notice

The `experiment` branch (including this README) is for upcoming work. To use it on your application, add the following line to your `Gemfile`:

```ruby
gem "i18n-js", github: "fnando/i18n-js", branch: "experiment"
```

## Usage

### Using in a Rails app

Requirements:

- Rails 4.2+
- Ruby 2.1+

Add the gem to your Gemfile.

```ruby
source "https://rubygems.org"
gem "rails", "your_rails_version"
gem "i18n-js"
```

I18n.js is integrated with [Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html). Embrace it; it's easy to use it and it's awesome! 

Start by importing the necessary files at `app/assets/javascripts/application.js`.

```js
//= require i18n
//= require_tree ./locales
```

Did you notice that we're importing `locales`? That's where you'll put your translation files (just a suggestion, of course). If you won't be using too many translation strings, then it's safe to import everything from one single file. Create a `app/assets/javascripts/locales/all.js.erb` like the following:

```erb
<%# encoding: UTF-8 %>
// This will import scopes required for date/time and number localization.
<%= store_translations "*.date.*" %>
<%= store_translations "*.time.*" %>
<%= store_translations "*.number.*" %>

// This will import user's translations.
<%= store_translations "*.messages.*" %>
<%= store_translations "*.inbox.*" %>
```

Now, if you know you'll have a lot of translations, break each language on its own file. First, remove the `require_tree ./locales` from your `application.js`. Then import the same scopes to a specific language. The following example shows how to use a `app/assets/javascripts/locales/en.js.erb` file storing English translations.

```erb
<%# encoding: UTF-8 %>
// This will import scopes required for date/time and number localization.
<%= store_translations "en.date.*" %>
<%= store_translations "en.time.*" %>
<%= store_translations "en.number.*" %>

// This will import user's translations.
<%= store_translations "en.messages.*" %>
<%= store_translations "en.inbox.*" %>
```

To avoid duplication and out-of-sync imports, do it dynamically. Create a initializer at `config/initializers/i18njs.rb`:

```ruby
DEFAULT_I18NJS_SCOPES = %w[
  date.*
  time.*
  number.*
  messages.*
  inbox.*
]
```

Now, load translations like the following:

```erb
<%# encoding: UTF-8 %>
<% for scope in DEFAULT_I18NJS_SCOPES %>
  <%= store_translations "en.#{scope}" %>
<% end %>
```

To load these translations as you need, add the files to `config.assets.precompile`, so that you can compile them individually.

```ruby
# config/initializers/assets.rb
# Adapt how files are going to be imported to your own structure.
Rails.application.config.assets.precompile += I18n.available_locales.map {|locale| "locales/#{locale}.js" }
```

On your `app/views/layouts/application.html.erb` you can load the script like this:

```erb
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <%= javascript_include_tag "application" %>
    <%= javascript_include_tag "locales/#{I18n.default_locale}" %>
    <%= javascript_include_tag "locales/#{I18n.locale}" %>
</head>
<body>
    <%= yield %>
</body>
</html>
```

Notice that we're always loading the JavaScript file for the default locale; that's required if you want to use locale fallback. You can import even import it from `application.js`, avoiding an additional HTTP request. If you don't need locale fallback, you can safely load only the file for the current locale.

#### Configuration

You can also set configuration by using `I18n::JS.configure(&block)`.

```ruby
I18n::JS.configure do |config|
  config.output_namespace = "MyApp.I18n"
  config.json_encoder = lambda do |translations|
    JSON.pretty_generate(translation)
  end
end
```

#### Namespace

If you need to use a different JavaScript namespace, set the following option on `config/initializers/i18njs.rb`:

```ruby
I18n::JS.output_namespace = "MyApp.I18n"
```

The library and the translations will now be namespaced as `MyApp.I18n`.

#### Vanilla JavaScript

Just add the `i18n.js` file to your page. You'll have to build the translations object
by hand or using your favorite programming language. More info below.


#### Via NPM with webpack and CommonJS

Add the following line to your package.json dependencies (where version is the version you want - n.b. npm install requires it to be the gzipped tarball, see [npm install](https://www.npmjs.org/doc/cli/npm-install.html))

```js
"i18n-js": "http://github.com/fnando/i18n-js/archive/v3.0.0.rc8.tar.gz"
```
Run npm install then use via
```js
var i18n = require("i18n-js");
```

### Setting up

Set your locale is easy as

```js
I18n.defaultLocale = "pt-BR";
I18n.locale = "pt-BR";
I18n.currentLocale();
// pt-BR
```

To set these values even before the library is available, create a `I18n` object with all your configuration. This is useful if you're setting the locale dynamically at `app/views/layouts/application.html.erb`:

```erb
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
  <%= yield %>
    
  <!-- setting locale beforehand -->
  <script>
    I18n = {locale: "<%= I18n.locale %>", defaultLocale: "<%= I18n.default_locale %>"};
  </script>

  <!-- loading javascript at the bottom -->
  <%= javascript_include_tag "application" %>
</body>
</html>
```

You can use `I18n.translate` (also aliased as `I18n.t`) to translate your texts:

```js
I18n.t("some.scoped.translation");
// or translate with explicit setting of locale
I18n.t("some.scoped.translation", {locale: "fr"});
```

Text interpolation is also available:

```js
I18n.t("hello", {name: "John Doe"});
```

You can set default values for missing scopes:

```js
// simple translation
I18n.t("some.missing.scope", {defaultValue: "A default message"});

// with interpolation
I18n.t("noun", {defaultValue: "I'm a {{noun}}", noun: "Mac"});
```

You can also provide a list of default fallbacks for missing scopes:

```js
// As a scope
I18n.t("some.missing.scope", {defaults: [{scope: "some.existing.scope"}]});

// As a simple translation
I18n.t("some.missing.scope", {defaults: [{message: "Some message"}]});
```

Default values must be provided as an array of hashs where the key is the
type of translation desired, a `scope` or a `message`. The translation returned
will be either the first scope recognized, or the first message defined.

The translation will fallback to the `defaultValue` translation if no scope
in `defaults` matches and if no default of type `message` is found.

Translation fallback can be enabled by setting the `I18n.fallbacks` option:

```js
I18n.fallbacks = true;
```

By default missing translations will first be looked for in less
specific versions of the requested locale and if that fails by taking
them from your `I18n.defaultLocale`.

```js
// if I18n.defaultLocale = "en" and translation doesn't exist
// for I18n.locale = "de-DE" this key will be taken from "de" locale scope
// or, if that also doesn't exist, from "en" locale scope
I18n.t("some.missing.scope");
```

Custom fallback rules can also be specified for a particular language. There
are three different ways of doing it so:

```js
I18n.locales.no = ["nb", "en"];
I18n.locales.no = "nb";
I18n.locales.no = function(locale){ return ["nb"]; };
```

By default a missing translation will be displayed as

    [missing "name of scope" translation]

While you are developing or if you do not want to provide a translation
in the default language you can set

```js
I18n.missingBehavior = "guess";
```

this will take the last section of your scope and guess the intended value.
Camel case becomes lower cased text and underscores are replaced with space

    questionnaire.whatIsYourFavorite_ChristmasPresent

becomes `what is your favorite Christmas present`.

In order to still detect untranslated strings, you can set `i18n.missingTranslationPrefix` to something like:

```js
I18n.missingTranslationPrefix = 'EE: ';
```

And result will be:

```js
"EE: what is your favorite Christmas present"
```

This will help you doing automated tests against your localization assets.

Some people prefer returning `null` or `undefined` for missing translation:

```js
I18n.missingTranslation = function () { return undefined; };
```

Pluralization is possible as well and by default provides English rules:

```js
I18n.t("inbox.counting", {count: 10}); // You have 10 messages
```

The sample above expects the following translation:

```yaml
en:
  inbox:
    counting:
      one: You have 1 new message
      other: You have {{count}} new messages
      zero: You have no messages
```

**NOTE:** Ruby's I18n recognizes the `zero` option.

If you need special rules just define them for your language, for example Russian, just add a new pluralizer:

```js
I18n.pluralization.ru = function (count) {
  var key = count % 10 == 1 && count % 100 != 11 ? "one" : [2, 3, 4].indexOf(count % 10) >= 0 && [12, 13, 14].indexOf(count % 100) < 0 ? "few" : count % 10 == 0 || [5, 6, 7, 8, 9].indexOf(count % 10) >= 0 || [11, 12, 13, 14].indexOf(count % 100) >= 0 ? "many" : "other";
  return [key];
};
```

You can find all rules on <http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html>. 

You can import some built-in pluralizer rules like the following. Check `app/assets/i18n/pluralization/` for a list of available pluralization rules.

```js
//= require i18n/pluralization/ru
```

![Help us! Check out app/assets/javascripts/i18n/pluralization and see how to add new rules.](http://messages.hellobits.com/success.svg?message=Help%20us!%20Check%20out%20app%2Fassets%2Fjavascripts%2Fi18n%2Fpluralization%20and%20see%20how%20to%20add%20new%20rules.)

If you're using the same scope over and over again, you may use the `scope` option.

```js
var options = {scope: "activerecord.attributes.user"};

I18n.t("name", options);
I18n.t("email", options);
I18n.t("username", options);
```

You can also provide an array as scope.

```js
// use the greetings.hello scope
I18n.t(["greetings", "hello"]);
```

#### Temporarily set locale

You can set the locale duration the execution of a function.

```js
I18n.withLocale("pt-BR", function() {
  console.log(I18n.locale);
  //=> "pt-BR"
});
```

#### Number formatting

Similar to Rails helpers, you have localized number and currency formatting.

```js
I18n.l("currency", 1990.99);
// $1,990.99

I18n.l("number", 1990.99);
// 1,990.99

I18n.l("percentage", 123.45);
// 123.450%
```

To have more control over number formatting, you can use the
`I18n.toNumber`, `I18n.toPercentage`, `I18n.toCurrency` and `I18n.toHumanSize`
functions.

```js
I18n.toNumber(1000);     // 1,000.000
I18n.toCurrency(1000);   // $1,000.00
I18n.toPercentage(100);  // 100.000%
```

The `toNumber` and `toPercentage` functions accept the following options:

- `precision`: defaults to `3`
- `separator`: defaults to `.`
- `delimiter`: defaults to `,`
- `strip_insignificant_zeros`: defaults to `false`

See some number formatting examples:

```js
I18n.toNumber(1000, {precision: 0});                   // 1,000
I18n.toNumber(1000, {delimiter: ".", separator: ","}); // 1.000,000
I18n.toNumber(1000, {delimiter: ".", precision: 0});   // 1.000
```

The `toCurrency` function accepts the following options:

- `precision`: sets the level of precision
- `separator`: sets the separator between the units
- `delimiter`: sets the thousands delimiter
- `format`: sets the format of the output string
- `unit`: sets the denomination of the currency
- `strip_insignificant_zeros`: defaults to `false`
- `sign_first`: defaults to `true`

You can provide only the options you want to override:

```js
I18n.toCurrency(1000, {precision: 0}); // $1,000
```

The `toHumanSize` function accepts the following options:

- `precision`: defaults to `1`
- `separator`: defaults to `.`
- `delimiter`: defaults to `""`
- `strip_insignificant_zeros`: defaults to `false`
- `format`: defaults to `%n%u`

```js
I18n.toHumanSize(1234); // 1KB
I18n.toHumanSize(1234 * 1024); // 1MB
```

#### Date formatting

```js
// accepted formats
I18n.l("date.formats.short", "2009-09-18");           // yyyy-mm-dd
I18n.l("time.formats.short", "2009-09-18 23:12:43");  // yyyy-mm-dd hh:mm:ss
I18n.l("time.formats.short", "2009-11-09T18:10:34");  // JSON format with local Timezone (part of ISO-8601)
I18n.l("time.formats.short", "2009-11-09T18:10:34Z"); // JSON format in UTC (part of ISO-8601)
I18n.l("date.formats.short", 1251862029000);          // Epoch time
I18n.l("date.formats.short", "09/18/2009");           // mm/dd/yyyy
I18n.l("date.formats.short", (new Date()));           // Date object
```

You can also add placeholders to the date format:

```js
I18n.translations.en = {
  date: {
    formats: {
      ordinal_day: "%B %{day}"
    }
  }
}
I18n.l("date.formats.ordinal_day", "2009-09-18", {day: "18th"}); // Sep 18th
```

If you prefer, you can use the `I18n.strftime` function to format dates.

```js
var date = new Date();
I18n.strftime(date, "%d/%m/%Y");
```

The accepted formats are:

    %a  - The abbreviated weekday name (Sun)
    %A  - The full weekday name (Sunday)
    %b  - The abbreviated month name (Jan)
    %B  - The full month name (January)
    %d  - Day of the month (01..31)
    %-d - Day of the month (1..31)
    %H  - Hour of the day, 24-hour clock (00..23)
    %-H - Hour of the day, 24-hour clock (0..23)
    %I  - Hour of the day, 12-hour clock (01..12)
    %-I - Hour of the day, 12-hour clock (1..12)
    %m  - Month of the year (01..12)
    %-m - Month of the year (1..12)
    %M  - Minute of the hour (00..59)
    %-M - Minute of the hour (0..59)
    %p  - Meridian indicator (AM  or  PM)
    %S  - Second of the minute (00..60)
    %-S - Second of the minute (0..60)
    %w  - Day of the week (Sunday is 0, 0..6)
    %y  - Year without a century (00..99)
    %-y - Year without a century (0..99)
    %Y  - Year with century
    %z  - Timezone offset (+0545)

Check out `spec/*.spec.js` files for more examples!

### Using require.js / r.js / almond

I'm assuming you're using [requirejs-rails](https://github.com/jwhitley/requirejs-rails).

First, create your translation files. Repeat the procedure below for every locale you're defining.

```erb
<%# encoding: UTF-8 %>
define("application/locales/en", ["i18n"], (I18n) => {
  <%= store_translations "en.*" %>
});
```

You also have to create a file that loads everything, making your `require` life easier. I'm creating `app/assets/javascripts/application/translations.js` as the following:

```erb
<%# encoding: UTF-8 %>
define("application/translations", ["i18n", "application/locales/en"], function(I18n) {
  return I18n;
});
```

Finally, on your script, you can load `I18n` like this:

```erb
require(["application/translations"], function(i18n) {
  console.log(i18n.t("hello"));
});
```

### Using I18n.js with other languages (Python, PHP, ...)

The JavaScript library is language agnostic; so you can use it with PHP, Python, [your favorite language here].
The only requirement is that you need to set the `translations` attribute like following:

```js
I18n.translations = {};

I18n.translations.en = {
  message: "Some special message for you"
}

I18n.translations["pt-BR"] = {
  message: "Uma mensagem especial para você"
}
```

### Customize JSON output

To customize the JSON output, just set a callable object (a.k.a. an object that responds to `.call(translations)`). The default behavior is just dumping with `JSON`.

```ruby
I18n::JS.json_encoder = lambda do |translations|
  JSON.dump(translations)
end
```

I18n has a few built-in generators. If you want to use [oj](https://github.com/ohler55/oj), you can load `i18n/js/oj.rb`.

```
gem "i18n-js", require: "i18n/js/oj"
```

If you want pretty print, you can load `i18n/js/pretty_print.rb`.

```
gem "i18n-js", require: "i18n/js/pretty_print"
```

## FAQ

#### I18n.js is including some shims and I'm already doing it. How to skip this behavior?

Add the following snippet to `config/initializers/i18njs.rb`:

```ruby
I18n::JS.include_shims = false
```

Notice that the distribution versions (`dist/i18n.js` and `dist/i18n.min.js`) **do not** include shims, so you have to do it yourself.

## Maintainer

- Nando Vieira - <http://nandovieira.com.br>

## Contributors

- https://github.com/fnando/i18n-js/graphs/contributors

## Contributing

Once you've made your great commits:

1. [Fork](http://help.github.com/forking/) I18n.js
2. Create a branch with a clear name
3. Make your changes (Please also add/change spec, README and CHANGELOG if applicable)
4. Push changes to the created branch
5. [Create an Pull Request](http://github.com/fnando/i18n-js/pulls)
6. That's it!

Please respect the indentation rules and code style.
And use 2 spaces, not tabs. And don't touch the versioning thing.

## Running tests

Install ruby dependencies:

```
bundle install
```

Then install Node dependencies:

```
npm install
```

Run all tests and linting:

```
./script/test
```

You can also run individual tests; just use `./script/ruby-test` or `./script/js-test`.

To run tests in your browser (e.g. debugging browser-specific issues), open the files `test/js/tests.html` and `test/js/tests_amd.html`.

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


/*
 * I18n.js v4.0.0
 * https://github.com/fnando/i18n-js
 *
 * Copyright 2009-2016 Nando Vieira
 * Released under the MIT license
 */

(function(factory) {
  if (typeof module !== "undefined" && module.exports) {
    // Node/CommonJS
    module.exports = factory(this);
  } else if (typeof define === "function" && define.amd) {
    // AMD
    var self = this;
    define("i18n", function() { return factory(self); });
  } else {
    // Browser globals
    var namespace = function(root, ns, value) {
      var paths = ns.split(".");
      var lastPath = paths.pop();

      paths.forEach(function(path) {
        root[path] = root[path] || {};
        root = root[path];
      });

      root[lastPath] = value;
    };

    namespace(this, "I18n", factory(this));
  }
}(function(global) {
  "use strict";

  /**
   * Use previously defined object if exists in current scope.
   */
  var I18n = (global && global.I18n) || {};

  /**
   * Just cache the Array#slice function.
   */
  var slice = Array.prototype.slice;

  /**
   * Just cache the Object#hasOwnProperty function.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Apply number padding.
   */
  function padding(number) {
    return ("0" + number.toString()).substr(-2);
  }

  /**
   * Improved toFixed number rounding function with support for unprecise
   * floating points. JavaScript's standard toFixed function does not round
   * certain numbers correctly (for example 0.105 with precision 2).
   */
  function toFixed(number, precision) {
    return decimalAdjust("round", number, -precision).toFixed(precision);
  }

  /**
   * Check if value is different than undefined and null.
   */
  function isSet(value) {
    return value !== undefined && value !== null;
  }

  /**
   * Is a given variable an object?
   * Borrowed from Underscore.js
   */
  function isObject(object) {
    var type = typeof(object);
    return type === "function" || type === "object" && object;
  }

  /**
   * Is a given value an array?
   * Borrowed from Underscore.js
   */
  function isArray(object) {
    if (Array.isArray) {
      return Array.isArray(object);
    }

    return Object.prototype.toString.call(object) === "[object Array]";
  }

  /**
   * Decimal adjustment of a number.
   * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](value);
    }

    value = +value;
    exp = +exp;

    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
      return NaN;
    }

    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));

    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
  }

  /**
   * Get the full scope.
   *
   * @private
   * @param  {string|array} scope   The scope object.
   * @param  {object}       options Options containing the base scope to
   *                                be prepended.
   * @return {string}               The full scope joined by the defautl
   *                                separator.
   */
  function getFullScope(scope, options) {
    options = prepareOptions(options);

    // Deal with the scope as an array.
    if (scope.constructor === Array) {
      scope = scope.join(I18n.defaultSeparator);
    }

    // Deal with the scope option provided through the second argument.
    //
    //    I18n.t('hello', {scope: 'greetings'});
    //
    if (options.scope) {
      scope = [options.scope, scope].join(I18n.defaultSeparator);
    }

    return scope;
  }

  /**
   * Merge serveral hash options, checking if value is set before
   * overwriting any value. The precedence is from left to right.
   *
   *   prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
   *   #=> {name: "John Doe", role: "user"}
   *
   * @private
   */
  function prepareOptions() {
    var args = slice.call(arguments);
    var options = {};
    var subject;

    while (args.length) {
      subject = args.shift();

      if (typeof(subject) !== "object") {
        continue;
      }

      for (var attr in subject) {
        if (!subject.hasOwnProperty(attr)) {
          continue;
        }

        if (isSet(options[attr])) {
          continue;
        }

        options[attr] = subject[attr];
      }
    }

    return options;
  }

  /**
   * Deep merge objects.
   *
   * @param  {Object} target The target object.
   * @param  {Object} source The source object.
   * @return {Object}        The modified target object.
   */
  function merge(target, source) {
    for (var prop in source) {
      if (!hasOwnProperty.call(source, prop)) {
        continue;
      }

      var value = source[prop];

      if (isObject(value)) {
        target[prop] = merge(target[prop] || {}, value);
      } else {
        target[prop] = value;
      }
    }

    return target || {};
  }

  /**
   * Much like `reset`, but only assign options if not already assigned.
   */
  function initializeOptions() {
    // Only set the value if it's `undefined`.
    var set = function(prop) {
      if (typeof(I18n[prop]) === "undefined" && I18n[prop] !== null) {
        I18n[prop] = DEFAULT_OPTIONS[prop];
      }
    };

    set("defaultLocale");
    set("locale");
    set("defaultSeparator");
    set("placeholder");
    set("fallbacks");
    set("translations");
    set("missingBehavior");
    set("missingTranslationPrefix");
  }

  /**
   * Find and process the translation using the provided scope and options.
   * This is used internally by some functions and should not be used as a
   * public API.
   */
  function lookup(scope, options) {
    options = prepareOptions(options);

    var locales = I18n.locales.get(options.locale).slice();
    var locale;
    var scopes;
    var translations;

    scope = getFullScope(scope, options);

    while (locales.length) {
      locale = locales.shift();
      scopes = scope.split(I18n.defaultSeparator);
      translations = I18n.translations[locale];

      if (!translations) {
        continue;
      }

      while (scopes.length) {
        translations = translations[scopes.shift()];

        if (translations === undefined || translations === null) {
          break;
        }
      }

      if (translations !== undefined && translations !== null) {
        return translations;
      }
    }

    if (isSet(options.defaultValue)) {
      return options.defaultValue;
    }
  }

  /**
   * Rails changed the way the meridian is stored.
   * It started with `date.meridian` returning an array,
   * then it switched to `time.am` and `time.pm`.
   * This function abstracts this difference and returns
   * the correct meridian or the default value when none is provided.
   */
  function _meridian() {
    var time = lookup("time");
    var date = lookup("date");

    if (time && time.am && time.pm) {
      return [time.am, time.pm];
    } else if (date && date.meridian) {
      return date.meridian;
    } else {
      return DATE.meridian;
    }
  }

  /**
   * Set default days/months translations.
   */
  var DATE = {
    day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    meridian: ["AM", "PM"]
  };

  /**
   * Set default number format.
   */
  var NUMBER_FORMAT = {
    precision: 3,
    separator: ".",
    delimiter: ",",
    strip_insignificant_zeros: false
  };

  /**
   * Set default currency format.
   */
  var CURRENCY_FORMAT = {
    unit: "$",
    precision: 2,
    format: "%u%n",
    sign_first: true,
    delimiter: ",",
    separator: "."
  };

  /**
   * Set default percentage format.
   */
  var PERCENTAGE_FORMAT = {
    unit: "%",
    precision: 3,
    format: "%n%u",
    separator: ".",
    delimiter: ""
  };

  /**
   * Set default size units.
   */
  var SIZE_UNITS = [null, "kb", "mb", "gb", "tb"];

  /**
   * Other default options.
   */
  var DEFAULT_OPTIONS = {
    // Set default locale. This locale will be used when fallback is enabled and
    // the translation doesn't exist in a particular locale.
    defaultLocale: "en",

    // Set the current locale to `en`.
    locale: "en",

    // Set the translation key separator.
    defaultSeparator: ".",

    // Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
    placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,

    // Set if engine should fallback to the default locale when a translation
    // is missing.
    fallbacks: false,

    // Set the default translation object.
    translations: {},

    // Set missing translation behavior. 'message' will display a message
    // that the translation is missing, 'guess' will try to guess the string
    missingBehavior: "message",

    // if you use missingBehavior with 'message', but want to know that the
    // string is actually missing for testing purposes, you can prefix the
    // guessed string by setting the value here. By default, no prefix!
    missingTranslationPrefix: ""
  };

  /**
   * Reset all configurations to the default values.
   */
  I18n.reset = function() {
    // Set default locale. This locale will be used when fallback is enabled and
    // the translation doesn't exist in a particular locale.
    this.defaultLocale = DEFAULT_OPTIONS.defaultLocale;

    // Set the current locale to `en`.
    this.locale = DEFAULT_OPTIONS.locale;

    // Set the translation key separator.
    this.defaultSeparator = DEFAULT_OPTIONS.defaultSeparator;

    // Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
    this.placeholder = DEFAULT_OPTIONS.placeholder;

    // Set if engine should fallback to the default locale when a translation
    // is missing.
    this.fallbacks = DEFAULT_OPTIONS.fallbacks;

    // Set the default translation object.
    this.translations = DEFAULT_OPTIONS.translations;

    // Set the default missing behaviour
    this.missingBehavior = DEFAULT_OPTIONS.missingBehavior;

    // Set the default missing string prefix for guess behaviour
    this.missingTranslationPrefix = DEFAULT_OPTIONS.missingTranslationPrefix;
  };

  // Hold the list of locale resolvers.
  I18n.locales = {};

  /**
   * Return a list of all locales that must be tried before returning the
   * missing translation message. By default, this will consider the inline option,
   * current locale and fallback locale.
   *
   *   I18n.locales.get("de-DE");
   *   // ["de-DE", "de", "en"]
   *
   * You can define custom rules for any locale. Just make sure you return an
   * array containing all locales.
   *
   *   // Default the Wookie locale to English.
   *   I18n.locales.wk = function(locale) {
   *     return ["en"];
   *   };
   */
  I18n.locales.get = function(locale) {
    var result = this[locale] || this[I18n.locale] || this["default"];

    if (typeof(result) === "function") {
      result = result(locale);
    }

    if (isArray(result) === false) {
      result = [result];
    }

    return result;
  };

  /**
   * The default locale list.
   */
  I18n.locales["default"] = function(locale) {
    var locales = [];
    var list = [];
    var countryCode;

    // Handle the inline locale option that can be provided to
    // the `I18n.t` options.
    if (locale) {
      locales.push(locale);
    }

    // Add the current locale to the list.
    if (!locale && I18n.locale) {
      locales.push(I18n.locale);
    }

    // Add the default locale if fallback strategy is enabled.
    if (I18n.fallbacks && I18n.defaultLocale) {
      locales.push(I18n.defaultLocale);
    }

    // Compute each locale with its country code.
    // So this will return an array containing both
    // `de-DE` and `de` locales.
    locales.forEach(function(_locale) {
      countryCode = _locale.split("-")[0];

      if (!list.includes(_locale)) {
        list.push(_locale);
      }

      if (I18n.fallbacks && countryCode && countryCode !== _locale && !list.includes(countryCode)) {
        list.push(countryCode);
      }
    });

    // No locales set? English it is.
    if (locales.length === 0) {
      locales.push("en");
    }

    return list;
  };

  /**
   * Hold pluralization rules.
   */
  I18n.pluralization = {};

  /**
   * Return the pluralizer for a specific locale.
   * If no specify locale is found, then I18n's default will be used.
   */
  I18n.pluralization.get = function(locale) {
    return this[locale] || this[I18n.locale] || this["default"];
  };

  /**
   * The default pluralizer rule.
   * It detects the `zero`, `one`, and `other` scopes.
   */
  I18n.pluralization["default"] = function(count) {
    switch (count) {
      case 0: return ["zero", "other"];
      case 1: return ["one"];
      default: return ["other"];
    }
  };

  /**
   * Return current locale. If no locale has been set, then
   * the current locale will be the default locale.
   */
  I18n.currentLocale = function() {
    return this.locale || this.defaultLocale;
  };

  /**
   * Generate a list of translation options for default fallback.
   * `defaultValue` is also deleted from options as it is returned as part of
   * the translationOptions array.
   *
   * @private
   * @param  {string|array} scope
   * @param  {object}       options
   * @return {array}
   */
  function createTranslationOptions(scope, options) {
    var translationOptions = [{scope: scope}];

    // Defaults should be an array of hashes containing either
    // fallback scopes or messages
    if (isSet(options.defaults)) {
      translationOptions = translationOptions.concat(options.defaults);
    }

    // Maintain support for defaultValue. Since it is always a message
    // insert it in to the translation options as such.
    if (isSet(options.defaultValue)) {
      translationOptions.push({message: options.defaultValue});
      delete options.defaultValue;
    }

    return translationOptions;
  }

  /**
   * Translate the given scope with the provided options.
   *
   * @param  {string|array} scope   The scope that will be used.
   * @param  {object} options       The options that will be used on the
   *                                translation. Can include some special options
   *                                like `defaultValue`, `count`, and `scope`.
   * @return {string}               The translated string.
   */
  I18n.translate = function(scope, options) {
    options = prepareOptions(options);

    var translationOptions = createTranslationOptions(scope, options);

    var translation;
    // Iterate through the translation options until a translation
    // or message is found.
    var translationFound =
      translationOptions.some(function(translationOption) {
        if (isSet(translationOption.scope)) {
          translation = lookup(translationOption.scope, options);
        } else if (isSet(translationOption.message)) {
          translation = translationOption.message;
        }

        if (translation !== undefined && translation !== null) {
          return true;
        }
      }, this);

    if (!translationFound) {
      return this.missingTranslation(scope, options);
    }

    if (typeof(translation) === "string") {
      translation = interpolate(translation, options);
    } else if (isObject(translation) && isSet(options.count)) {
      translation = this.pluralize(options.count, translation, options);
    }

    return translation;
  };

  /**
   * This function interpolates the all variables in the given message.
   *
   * @param  {string} message The string containing the placeholders.
   * @param  {object} options The source object that will be used as the
   *                          placeholders' source.
   * @return {string}         The interpolated string.
   */
  function interpolate(message, options) {
    options = prepareOptions(options);
    var matches = message.match(I18n.placeholder);
    var placeholder;
    var value;
    var name;
    var regex;

    if (!matches) {
      return message;
    }

    var value;

    while (matches.length) {
      placeholder = matches.shift();
      name = placeholder.replace(I18n.placeholder, "$1");

      if (isSet(options[name])) {
        value = options[name].toString().replace(/\$/gm, "_#$#_");
      } else if (name in options) {
        value = I18n.nullPlaceholder(placeholder, message, options);
      } else {
        value = I18n.missingPlaceholder(placeholder, message, options);
      }

      regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
      message = message.replace(regex, value);
    }

    return message.replace(/_#\$#_/g, "$");
  }

  /**
   * Pluralize the given scope using the `count` value.
   * The pluralized translation may have other placeholders,
   * which will be retrieved from `options`.
   *
   * @param  {number} count   The counting number.
   * @param  {scope} scope    The translation scope.
   * @param  {object} options The translation options.
   * @return {string}         The translated string.
   */
  I18n.pluralize = function(count, scope, options) {
    options = prepareOptions(options);
    var translations;
    var pluralizer;
    var keys;
    var key;
    var message;

    if (isObject(scope)) {
      translations = scope;
    } else {
      translations = lookup(scope, options);
    }

    if (!translations) {
      return this.missingTranslation(scope, options);
    }

    pluralizer = this.pluralization.get(options.locale);
    keys = pluralizer(count);

    while (keys.length) {
      key = keys.shift();

      if (isSet(translations[key])) {
        message = translations[key];
        break;
      }
    }

    options.count = String(count);
    return interpolate(message, options);
  };

  /**
   * Return a missing translation message for the given parameters.
   */
  I18n.missingTranslation = function(scope, options) {
    return I18n.missingTranslation[this.missingBehavior].call(this, scope, options);
  };

  /**
   * Generate a human readable version of the scope as the missing translation.
   * To use it, you have to set `I18n.missingBehavior` to `"guess"`.
   *
   * @param  {string} scope The missing scope.
   * @return {string}       The human-readable string.
   */
  I18n.missingTranslation.guess = function(scope) {
    // Get only the last portion of the scope.
    var s = scope.split(".").slice(-1)[0];

    // Replace underscore with space and camelcase with space and
    // lowercase letter.
    return (this.missingTranslationPrefix.length > 0 ? this.missingTranslationPrefix : "") +
        s.replace("_", " ").replace(/([a-z])([A-Z])/g,
        function(match, p1, p2) {
          return p1 + " " + p2.toLowerCase();
        }
    );
  };

  /**
   * Generate the missing translation message, which includes the full scope.
   * To use it, you have to set `I18n.missingBehavior` to `"message"`.
   * This is the default behavior.
   *
   * @param  {string} scope
   * @param  {object} options
   * @return {string}
   */
  I18n.missingTranslation.message = function(scope, options) {
    var fullScope           = getFullScope(scope, options);
    var fullScopeWithLocale = [this.currentLocale(), fullScope].join(this.defaultSeparator);

    return "[missing \"" + fullScopeWithLocale + "\" translation]";
  };

  /**
   * Return a missing placeholder message for given parameters
   */
  I18n.missingPlaceholder = function(placeholder) {
    return "[missing " + placeholder + " value]";
  };

  /**
   * Return a placeholder message for null values.
   * It defaults to the same behavior as `I18n.missingPlaceholder`.
   */
  I18n.nullPlaceholder = function() {
    return I18n.missingPlaceholder.apply(I18n, arguments);
  };

  /**
   * Format number using localization rules.
   * The options will be retrieved from the `number.format` scope.
   *
   * If this isn't present, then the following options will be used:
   *
   * - `precision`: `3`
   * - `separator`: `"."`
   * - `delimiter`: `","`
   * - `strip_insignificant_zeros`: `false`
   *
   * You can also override these options by providing the `options` argument.
   *
   * @param {number} number The number to be formatted.
   * @param {object} options The formatting options. When defined, supersedes
   *                         the default options defined by `number.format`.
   * @return {string}        The formatted number.
   */
  I18n.toNumber = function(number, options) {
    options = prepareOptions(
      options,
      lookup("number.format"),
      NUMBER_FORMAT
    );

    var negative = number < 0;
    var string = toFixed(Math.abs(number), options.precision).toString();
    var parts = string.split(".");
    var precision;
    var buffer = [];
    var formattedNumber;
    var format = options.format || "%n";
    var sign = negative ? "-" : "";

    number = parts[0];
    precision = parts[1];

    while (number.length > 0) {
      buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
      number = number.substr(0, number.length -3);
    }

    formattedNumber = buffer.join(options.delimiter);

    if (options.strip_insignificant_zeros && precision) {
      precision = precision.replace(/0+$/, "");
    }

    if (options.precision > 0 && precision) {
      formattedNumber += options.separator + precision;
    }

    if (options.sign_first) {
      format = "%s" + format;
    } else {
      format = format.replace("%n", "%s%n");
    }

    formattedNumber = format
      .replace("%u", options.unit)
      .replace("%n", formattedNumber)
      .replace("%s", sign)
    ;

    return formattedNumber;
  };

  /**
   * Format currency with localization rules.
   *
   * The options will be retrieved from the `number.currency.format` and
   * `number.format` scopes, in that order.
   *
   * Any missing option will be retrieved from the `I18n.toNumber` defaults and
   * the following options:
   *
   * - `unit`: `"$"`
   * - `precision`: `2`
   * - `format`: `"%u%n"`
   * - `delimiter`: `","`
   * - `separator`: `"."`
   *
   * You can also override these options by providing the `options` argument.
   *
   * @param  {number} number  The number to be formatted.
   * @param  {object} options The formatting options. When defined, supersedes
   *                          the default options defined by `number.currency.*`
   *                          and `number.format`.
   * @return {string}         The formatted number.
   */
  I18n.toCurrency = function(number, options) {
    options = prepareOptions(
      options,
      lookup("number.currency.format"),
      lookup("number.format"),
      CURRENCY_FORMAT
    );

    return this.toNumber(number, options);
  };

  /**
   * Localize several values.
   * You can provide the following scopes: `currency`, `number`, or `percentage`.
   * If you provide a scope that matches the `/^(date|time)/` regular expression
   * then the `value` will be converted by using the `I18n.toTime` function.
   * It will default to the value's `toString` function.
   *
   * @param  {string}      scope   The localization scope.
   * @param  {number|date} value   The value that must be localized.
   * @param  {object}      options The localization options.
   * @return {string}              The localized string.
   */
  I18n.localize = function(scope, value, options) {
    options || (options = {});

    switch (scope) {
      case "currency":
        return this.toCurrency(value);
      case "number":
        scope = lookup("number.format");
        return this.toNumber(value, scope);
      case "percentage":
        return this.toPercentage(value);
      default:
        var localizedValue;

        if (scope.match(/^(date|time)/)) {
          localizedValue = this.toTime(scope, value);
        } else {
          localizedValue = value.toString();
        }

        return interpolate(localizedValue, options);
    }
  };

  /**
   * Parse a given `date` string into a JavaScript Date object.
   * This function is time zone aware.
   *
   * The following string formats are recognized:
   *
   *    yyyy-mm-dd
   *    yyyy-mm-dd[ T]hh:mm::ss
   *    yyyy-mm-dd[ T]hh:mm::ss
   *    yyyy-mm-dd[ T]hh:mm::ssZ
   *    yyyy-mm-dd[ T]hh:mm::ss+0000
   *    yyyy-mm-dd[ T]hh:mm::ss+00:00
   *    yyyy-mm-dd[ T]hh:mm::ss.123Z
   *
   * @param {string|date} date The date string that must be parsed into a Date object.
   * @return {date}            The parsed date.
   */
  I18n.parseDate = function(date) {
    var matches;
    var convertedDate;
    var fraction;

    // we have a date, so just return it.
    if (typeof(date) === "object") {
      return date;
    }

    matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/);

    if (matches) {
      for (var i = 1; i <= 6; i += 1) {
        matches[i] = parseInt(matches[i], 10) || 0;
      }

      // month starts on 0
      matches[2] -= 1;

      fraction = matches[7] ? 1000 * ("0" + matches[7]) : null;

      if (matches[8]) {
        convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction));
      } else {
        convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction);
      }
    } else if (typeof(date) === "number") {
      // UNIX timestamp
      convertedDate = new Date();
      convertedDate.setTime(date);
    } else if (date.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/)) {
      // This format `Wed Jul 20 13:03:39 +0000 2011` is parsed by
      // webkit/firefox, but not by IE, so we must parse it manually.
      convertedDate = new Date();
      convertedDate.setTime(Date.parse([
        RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$6, RegExp.$4, RegExp.$5
      ].join(" ")));
    } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
      // a valid javascript format with timezone info
      convertedDate = new Date();
      convertedDate.setTime(Date.parse(date));
    } else {
      // an arbitrary javascript string
      convertedDate = new Date();
      convertedDate.setTime(Date.parse(date));
    }

    return convertedDate;
  };

  /**
  * Formats time according to the directives in the given format string.
  * The directives begins with a percent (%) character. Any text not listed as a
  * directive will be passed through to the output string.
  *
  * The accepted formats are:
  *
  *     %a  - The abbreviated weekday name (Sun)
  *     %A  - The full weekday name (Sunday)
  *     %b  - The abbreviated month name (Jan)
  *     %B  - The full month name (January)
  *     %c  - The preferred local date and time representation
  *     %d  - Day of the month (01..31)
  *     %-d - Day of the month (1..31)
  *     %H  - Hour of the day, 24-hour clock (00..23)
  *     %-H - Hour of the day, 24-hour clock (0..23)
  *     %I  - Hour of the day, 12-hour clock (01..12)
  *     %-I - Hour of the day, 12-hour clock (1..12)
  *     %m  - Month of the year (01..12)
  *     %-m - Month of the year (1..12)
  *     %M  - Minute of the hour (00..59)
  *     %-M - Minute of the hour (0..59)
  *     %p  - Meridian indicator (AM  or  PM)
  *     %S  - Second of the minute (00..60)
  *     %-S - Second of the minute (0..60)
  *     %w  - Day of the week (Sunday is 0, 0..6)
  *     %y  - Year without a century (00..99)
  *     %-y - Year without a century (0..99)
  *     %Y  - Year with century
  *     %z  - Timezone offset (+0545)
  *
  * @param {date}   date    The date that must be formatted.
  * @param {string} format  The formatting scope that must be used.
  * @return {string}        The formatted date.
  */
  I18n.strftime = function(date, format) {
    var options = lookup("date");
    var meridianOptions = _meridian();

    if (!options) {
      options = {};
    }

    options = prepareOptions(options, DATE);

    if (isNaN(date.getTime())) {
      throw new Error("I18n.strftime() requires a valid date object, but received an invalid date.");
    }

    var weekDay = date.getDay();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var hour12 = hour;
    var meridian = hour > 11 ? 1 : 0;
    var secs = date.getSeconds();
    var mins = date.getMinutes();
    var offset = date.getTimezoneOffset();
    var absOffsetHours = Math.floor(Math.abs(offset / 60));
    var absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60);
    var timezoneoffset = (offset > 0 ? "-" : "+") +
          (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) +
          (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
    ;

    if (hour12 > 12) {
      hour12 = hour12 - 12;
    } else if (hour12 === 0) {
      hour12 = 12;
    }

    format = format.replace("%a", options.abbr_day_names[weekDay]);
    format = format.replace("%A", options.day_names[weekDay]);
    format = format.replace("%b", options.abbr_month_names[month]);
    format = format.replace("%B", options.month_names[month]);
    format = format.replace("%d", padding(day));
    format = format.replace("%e", day);
    format = format.replace("%-d", day);
    format = format.replace("%H", padding(hour));
    format = format.replace("%-H", hour);
    format = format.replace("%I", padding(hour12));
    format = format.replace("%-I", hour12);
    format = format.replace("%m", padding(month));
    format = format.replace("%-m", month);
    format = format.replace("%M", padding(mins));
    format = format.replace("%-M", mins);
    format = format.replace("%p", meridianOptions[meridian]);
    format = format.replace("%S", padding(secs));
    format = format.replace("%-S", secs);
    format = format.replace("%w", weekDay);
    format = format.replace("%y", padding(year));
    format = format.replace("%-y", padding(year).replace(/^0+/, ""));
    format = format.replace("%Y", year);
    format = format.replace("%z", timezoneoffset);

    return format;
  };

  /**
   * Convert the given dateString into a formatted date.
   * @param  {scope} scope           The formatting scope.
   * @param  {dateString} dateString The string that must be parsed into a Date
   *                                 object.
   * @return {string}                The formatted date.
   */
  I18n.toTime = function(scope, dateString) {
    var date = this.parseDate(dateString);
    var format = lookup(scope);

    if (date.toString().match(/invalid/i)) {
      return date.toString();
    }

    if (!format) {
      return date.toString();
    }

    return this.strftime(date, format);
  };

  /**
   * Convert a number into a formatted percentage value.
   * @param  {number} number   The number to be formatted.
   * @param  {options} options The formatting options. When defined, supersedes
   *                           the default options stored at
   *                           `number.percentage.*`.
   * @return {string}          The formatted number.
   */
  I18n.toPercentage = function(number, options) {
    options = prepareOptions(
      options,
      lookup("number.percentage.format"),
      lookup("number.format"),
      PERCENTAGE_FORMAT
    );

    return this.toNumber(number, options);
  };

  /**
   * Convert a number into a readable size representation.
   * @param  {number} number  The number that will be formatted.
   * @param  {object} options The formatting options. When defined, supersedes
   *                          the default options stored at
   *                          `number.human.storage_units.*`.
   * @return {string}         The formatted number.
   */
  I18n.toHumanSize = function(number, options) {
    var kb = 1024;
    var size = number;
    var iterations = 0;
    var unit;
    var precision;

    while (size >= kb && iterations < 4) {
      size = size / kb;
      iterations += 1;
    }

    if (iterations === 0) {
      unit = this.t("number.human.storage_units.units.byte", {count: size});
      precision = 0;
    } else {
      unit = this.t("number.human.storage_units.units." + SIZE_UNITS[iterations]);
      precision = (size - Math.floor(size) === 0) ? 0 : 1;
    }

    options = prepareOptions(
        options,
        {unit: unit, precision: precision, format: "%n%u", delimiter: ""}
    );

    return this.toNumber(size, options);
  };

  /**
   * Merge provided translations into internal translations object.
   * @param {object} translations The translations that will be merged into the
   *                              stored translations.
   */
  I18n.storeTranslations = function(translations) {
    I18n.translations = merge(I18n.translations, translations);
  };

  /**
   * Executes function with given I18n.locale set.
   *
   * @param {String} locale     The temporary locale that will be set during the
   *                            function's execution.
   * @param {Function} callback The function that will be executed with a
   *                            temporary locale set.
   */
  I18n.withLocale = function(locale, callback) {
    var originalLocale = I18n.locale;

    try {
      I18n.locale = locale;
      callback();
    } finally {
      I18n.locale = originalLocale;
    }
  };

  // Bind functions to I18n, so that we can have shortcuts like `toNumber`.
  // This will be useful with destructuring assignment.
  // const { t, toCurrency } = I18n;
  [
    "localize",
    "parseDate",
    "pluralize",
    "storeTranslations",
    "strftime",
    "toCurrency",
    "toHumanSize",
    "toNumber",
    "toPercentage",
    "toTime",
    "translate",
    "withLocale"
  ].forEach(function(name) {
    I18n[name] = I18n[name].bind(I18n);
  });

  // Set aliases, so we can save some typing.
  I18n.t = I18n.translate;
  I18n.l = I18n.localize;
  I18n.p = I18n.pluralize;

  // First boot initialization.
  initializeOptions();

  return I18n;
}));

(function(factory) {
  if (typeof module !== "undefined" && module.exports) {
    // Node/CommonJS
    factory(require("i18n"));
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define("i18n/pluralization/ru", ["i18n"], function(i18n) {
      factory(i18n);
    });
  } else {
    // Global
    factory(I18n);
  }
}(function(I18n) {
  "use strict";

  I18n.pluralization.ru = function ru(count) {
    var mod10 = count % 10;
    var mod100 = count % 100;
    var key;

    var one = mod10 === 1 && mod100 !== 11;
    var few = [2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100);
    var many = mod10 === 0 ||
                [5, 6, 7, 8, 9].includes(mod10) ||
                [11, 12, 13, 14].includes(mod100);

    if (one) {
      key = "one";
    } else if (few) {
      key = "few";
    } else if (many) {
      key = "many";
    } else {
      key = "other";
    }

    return [key];
  };
}));

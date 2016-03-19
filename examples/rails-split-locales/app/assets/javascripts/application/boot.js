(function() {
  function toCamelCase(term) {
    if (!term) {
      return;
    }

    term = term[0].toUpperCase() + term.slice(1);

    return term.replace(/_(.)/g, function(char) {
      return (char).toUpperCase();
    });
  }

  function runner() {
    // All scripts must live in app/assets/javascripts/application/pages/**/*.es6.
    var path = $("body").data("route");
    var paths = path.split("/");
    var context = window;
    var namespace;

    // Load script for this page.
    try {
      while ((namespace = toCamelCase(paths.shift()))) {
        context = context && context[namespace];

        if (!context) {
          break;
        }
      }

      if (context) {
        onload(context);
      } else {
        throw new Error("undefined missing: " + path);
      }
    } catch (error) {
      handleError(error);
    }
  }

  function onload(Page) {
    // Instantiate the page, passing <body> as the root element.
    var page = new Page($(document.body));

    // Set up page and run scripts for it.
    if (page.setup) {
      page.setup();
    }

    page.run();
  }

  // Handles exception.
  function handleError(error) {
    if (error.message.match(/undefined missing/)) {
      console.warn("missing module:", error.message.split(" ").pop());
    } else {
      throw error;
    }
  }

  $(window).on("turbolinks:load", runner);
}());

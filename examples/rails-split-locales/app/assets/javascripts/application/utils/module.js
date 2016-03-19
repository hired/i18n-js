function Module(path, callback) {
  var context = window;
  var paths = path.split(".");
  var path;

  while ((path = paths.shift())) {
    context[path] = context[path] || {};

    if (paths.length === 0) {
      context[path] = callback();
    } else {
      context = context[path];
    }
  }
}

define(['./bar'], function(bar) {var _exports;

  _exports.foo = function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  };
  return _exports;
});
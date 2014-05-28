define(['./bar'], function(bar) {
  'use strict';var _exports;

  _exports.foo = function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  };
  return _exports;
});
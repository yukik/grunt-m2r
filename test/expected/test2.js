/* !!!!! GRUNT-M2R GENERATED THIS FILE !!!!! */ define(['require', 'bar'], function(require) {
  'use strict'; var exports = {};
  var bar = require('bar');
  exports.foo = function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  };
  return exports;
});
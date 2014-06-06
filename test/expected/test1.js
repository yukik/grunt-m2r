/* !!!!! GRUNT-M2R GENERATED THIS FILE !!!!! */ define(['require', 'bar'], function(require) {
  'use strict';
  var bar = require('bar');
  function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  }

  return foo;
});
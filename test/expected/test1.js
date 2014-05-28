define(['./bar'], function(bar) {
  'use strict';

  function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  }

  return foo;
});
/*grunt-m2r*/
'use strict';
var bar = require('./bar');
exports.foo = function foo (message) {
  console.log('foo say ' + message);
  bar(message);
};
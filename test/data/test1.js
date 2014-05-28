/*grunt-m2r*/
'use strict';
var bar = require('./bar');
function foo (message) {
  console.log('foo say ' + message);
  bar(message);
}
module.exports = exports = foo;
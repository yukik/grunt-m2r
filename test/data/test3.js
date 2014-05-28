/*grunt-m2r*/
var bar = require('./bar');
exports.foo = function foo (message) {
  console.log('foo say ' + message);
  bar(message);
};
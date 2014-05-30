/*grunt-m2r*/
var bar = require('./bar');

function foo (message) {
  console.log('foo say ' + message);
  bar(message);
}

module.exports = exports = foo;

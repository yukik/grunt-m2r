/* !!!!! GRUNT-M2R GENERATED THIS FILE !!!!! */ define(['require', 'tmp2/module1/node_modules/module2', 'tmp2/module3'], function(require) {
  var module2 = require('tmp2/module1/node_modules/module2');
  var module3 = require('tmp2/module3');
  function module1 () {
    console.log('called module1');
    module2();
  }

  return module1;
});
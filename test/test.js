'use strict';

var grunt = require('grunt');

exports.test = {

  'test1': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test1.js'),
      grunt.file.read('test/expected/test1.js')
    );
    test.done();
  },

  'test2': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test2.js'),
      grunt.file.read('test/expected/test2.js')
    );
    test.done();
  },

  'test3': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test3.js'),
      grunt.file.read('test/expected/test3.js')
    );
    test.done();
  },

  'test4': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module1/lib/m1.js'),
      grunt.file.read('test/expected2/module1/lib/m1.js')
    );
    test.done();
  },

  'test5': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module1/node_modules/module2/index.js'),
      grunt.file.read('test/expected2/module1/node_modules/module2/index.js')
    );
    test.done();
  },

  'test6': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module1/node_modules/module2.js'),
      grunt.file.read('test/expected2/module1/node_modules/module2.js')
    );
    test.done();
  },

  'test7': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module2/index.js'),
      grunt.file.read('test/expected2/module2/index.js')
    );
    test.done();
  },

  'test8': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module1.js'),
      grunt.file.read('test/expected2/module1.js')
    );
    test.done();
  },

  'test9': function (test) {
    test.equal(
      grunt.file.read('test/tmp2/module2.js'),
      grunt.file.read('test/expected2/module2.js')
    );
    test.done();
  }
};
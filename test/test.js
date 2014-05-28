'use strict';

var grunt = require('grunt');

exports.test = {

  'test1': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test1.js'),
      grunt.file.read('test/expected/test1.js'),
      ''
    );
    test.done();
  },

  'test2': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test2.js'),
      grunt.file.read('test/expected/test2.js'),
      ''
    );
    test.done();
  },

  'test3': function(test) {
    test.equal(
      grunt.file.read('test/tmp/test3.js'),
      grunt.file.read('test/expected/test3.js'),
      ''
    );
    test.done();
  }
};
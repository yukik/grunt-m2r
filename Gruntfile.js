'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    m2r: {
      test1: {
        cwd: 'test/data',
        dest: 'test/tmp'
      },
      test2: {
        node_modules: 'test/data2',
        dest: 'test/tmp2',
        prefix: 'tmp2'
      }
    },

    clean: {
      test: ['test/tmp', 'test/tmp2']
    },

    nodeunit: {
      test: ['test/test.js']
    }

  });

  grunt.loadTasks('tasks');

  // plugin
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // test task
  grunt.registerTask('test', ['clean', 'm2r', 'nodeunit', 'clean']);

  grunt.registerTask('default', ['m2r']);
};

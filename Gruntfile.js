'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    m2r: {
      test: {
        cwd: 'test/data',
        src: '*.js',
        dest: 'test/tmp'
      }
    },

    clean: {
      test: ['test/tmp']
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

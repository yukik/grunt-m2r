'use strict';

module.exports = function (grunt) {

  // config 
  grunt.initConfig({
    m2r: {
      complie: {
        cwd: 'lib',
        src: '**/*.js',
        dest: 'src'
      }
    }
  });

  // plugin
  grunt.loadTasks('../tasks'); //<- example only!!!!!!! 
  // grunt.loadNpmTasks('grunt-m2r'); // <- normally

  // task
  grunt.registerTask('default', ['m2r']);

};
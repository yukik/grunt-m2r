module.exports = function (grunt) {

  // config 
  grunt.initConfig({
    m2r: {
      complie: {
        cwd: 'lib',
        dest: 'src',
        prefix: 'src'
      }
    },

    // auto m2r
    watch: {
      m2r: {
        files: 'lib/**/*.js',
        tasks: ['m2r']
      },
      options: {
        livereload: true
      }
    }
  });

  // plugin
  // grunt.loadTasks('../tasks'); //<- example only!!!!!!! 
  grunt.loadNpmTasks('grunt-m2r'); // <- normally
  grunt.loadNpmTasks('grunt-contrib-watch'); // auto

  // task
  grunt.registerTask('default', ['m2r']); // manual
  // grunt.registerTask('default', ['m2r', 'watch']); // auto

};
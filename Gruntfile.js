/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */
'use strict'

/*var uglify = require('grunt-contrib-uglify');
var htmlmin= require('grunt-contrib-htmlmin');*/

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
          {
            name: 'large',
            width: 660,
            suffix: '_2x',
            quality: 35
          },
          {
            name: 'large',
            width: 330,
            suffix: '_1x',
            quality: 35
          },
          {
            name: 'small',
            width: 200,
            quality: 35
          },
          {
            name: 'original',
            width: 980,
            quality: 35
          }
          ]
        },
        files: [{
          expand: true,
          src: ['*.png'],
          cwd: 'imagesrc/',
          dest: 'images/'
        }]
      }
    }
  });

  // Register default tasks
  grunt.registerTask('default', ['responsive_images']);
}
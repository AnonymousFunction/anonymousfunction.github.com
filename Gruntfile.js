module.exports = function (grunt) {
    'use strict';

    // Auto load tasks for each grunt-* package
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: ['zelda-canvas/scripts/**.js'],
                tasks: ['concat', 'uglify']
            }
        },

        concat: {
            zelda: {
                src: [
                    'zelda-canvas/scripts/**.js'
                ],
                dest: 'zelda-canvas/output.js'
            }
        },

        uglify: {
            zelda: {
                files: {
                    'zelda-canvas/output.min.js': [ 'zelda-canvas/output.js']
                },
                options: {
                    mangle: false
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                runnerPort: 9876,
                singleRun: true,
                browsers: ['Chrome'],
                logLevel: 'ERROR'
            }
        }
    });
};

module.exports = function (grunt) {
    'use strict';

    // Auto load tasks for each grunt-* package
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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

// Karma configuration
// Generated on Thu Jul 17 2014 10:14:21 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter


        // list of files / patterns to load in the browser
        files: [
            'zelda/jquery.min.js'  ,
            'zelda/jquery.mobile-1.4.5.min.js',

            //Application Dependencies - Start
            'zelda/jquery.timer.js',
            'zelda/enemyMaps.js',
            'zelda/mapBuilder.js',
            'zelda/movement.js',
            'zelda/zelda.js',


            //your Jasmine specs (tests) -->
            'zelda/test/zelda.js',
            'zelda/test/enemyMaps.js'
        ],
        frameworks: ['jasmine'],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'zelda/enemyMaps.js': ['coverage'],
            'zelda/mapBuilder.js': ['coverage'],
            'zelda/movement.js': ['coverage'],
            'zelda/zelda.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage', 'html', 'junit'],

        coverageReporter: {
            type: 'lcov',
            dir: 'target/karma-reports/coverage/',
            subdir: 'jasmine'
        },

        // the default configuration
        // note the htmlReporter doesn't obey basePath, thus adding the common-web prefix here explicitly
        htmlReporter: {
            outputDir: 'target/karma-reports/tests/',
            templatePath: 'node_modules/karma-html-reporter/jasmine_template.html'
        },

        //For bamboo to absorb the jasmine test output.
        junitReporter: {
            outputFile: "target/surefire-reports/TEST-jasmine-junit.xml",
            suite:''
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['Chrome'],
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};

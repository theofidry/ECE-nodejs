/**
 * Grunt tasks configuration file.
 */
module.exports = function (grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({

        clean: ['public/*.js', 'public/*.css'],

        mochaTest: {
            test:     {
                options: {
                    reporter: 'spec',
                    // Require blanket wrapper here to instrument other required
                    // files on the fly.
                    //
                    // NB. We cannot require blanket directly as it
                    // detects that we are not running mocha cli and loads differently.
                    //
                    // NNB. As mocha is 'clever' enough to only run the tests once for
                    // each file the following coverage task does not actually run any
                    // tests which is why the coverage instrumentation has to be done here
                    require:  'coverage/blanket'
                },
                src:     ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter:    'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet:       true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src:     ['test/**/*.js']
            }
        },

        stylus: {
            dev:  {
                options: {
                    compress: false,
                    lineos:   true
                },
                files:   {
                    'public/app.min.css': 'assets/styl/app.styl'
                }
            },
            prod: {
                files: {
                    'public/app.min.css': 'assets/styl/app.styl'
                }
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            dev:     {
                options: {
                    beautify: {
                        width:    120,
                        beautify: true
                    }
                },
                files:   {
                    'public/app.min.js': ['assets/js/*.js']
                }
            },
            prod:    {
                files: {
                    'public/app.min.js': ['assets/js/*.js']
                }
            }
        },

        watch: {
            scripts: {
                files:   ['assets/js/**/*'],
                tasks:   ['js'],
                options: {
                    spawn: false    // for faster processing
                }
            },
            styl:    {
                files:   ['assets/styl/**/*.styl'],
                tasks:   ['css'],
                options: {
                    spawn: false    // for faster processing
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');


    // Custom tasks
    grunt.registerTask('css', ['stylus:dev']);
    grunt.registerTask('css-prod', ['stylus:prod']);

    grunt.registerTask('js', ['uglify:dev']);
    grunt.registerTask('js-prod', ['uglify:prod']);

    grunt.registerTask('build', ['clean', 'css', 'js']);
    grunt.registerTask('publish', ['clean', 'css-prod', 'js-prod']);
    grunt.registerTask('start', ['build', 'watch']);

    grunt.registerTask('test', ['mochaTest']);

    // Default tasks
    grunt.registerTask('default', ['start']);
};

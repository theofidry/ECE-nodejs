/**
 * Grunt tasks configuration file.
 */
module.exports = function (grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({

        clean: {
            css: ['assets/styl/app.css']
        },

        concat: {
            options: {
                separator: '\n'
            },
            dist:    {
                src:  ['assets/styl/lib/*.css', 'assets/styl/app.css'],
                dest: 'public/app.css'
            }
        },

        copy: {
            jquery: {
                expand: true,
                cwd:  'node_modules/jquery/dist',
                src:  'jquery.min.js',
                dest: 'public/js/'
            },
            js: {
                expand: true,
                cwd:  'assets/js',
                src:  '*',
                dest: 'public/js/'
            }
        },

        stylus: {
            dev:  {
                options: {
                    compress: false,
                    lineos:   true
                },
                files:   {
                    'assets/styl/app.css': 'assets/styl/app.styl'
                }
            },
            prod: {
                files: {
                    'assets/styl/app.css': 'assets/styl/app.styl'
                }
            }
        },

        symlink: {
            options: {
                overwrite: true
            },
            tw_css:  {
                src:  'node_modules/bootstrap/dist/css/bootstrap.min.css',
                dest: 'assets/styl/lib/bootstrap.css'
            }
        },

        watch: {
            scripts: {
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Custom tasks
    grunt.registerTask('css', ['stylus:dev', 'concat', 'clean:css']);
    grunt.registerTask('css-prod', ['stylus:prod', 'concat', 'clean:css']);

    grunt.registerTask('js', ['copy:jquery', 'copy:js']);
    grunt.registerTask('js-prod', ['copy:jquery', 'copy:js']);

    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('publish', ['css-prod', 'js-prod']);
    grunt.registerTask('start', ['build', 'watch']);

    // Default tasks
    grunt.registerTask('default', ['start']);
};

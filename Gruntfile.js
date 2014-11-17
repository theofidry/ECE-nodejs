/**
 * Grunt tasks configuration file.
 */
module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({

        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['assets/styl/lib/*.css', 'assets/styl/app.css'],
                dest: 'public/app.css'
            }
        },

        stylus: {
            dev: {
                options: {
                    compress: false,
                    lineos: true
                },
                files: {
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
            tw_css: {
                src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                dest: 'assets/styl/lib/bootstrap.css'
            }
//            tw_fonts: {
//                files: [{
//                    expand:    true,
//                    cwd:       'node_modules/bootstrap/dist/fonts',
//                    src:       ['*'],
//                    dest:      'assets/fonts'
//                }]
//            }
        },

        watch: {
            scripts: {
                files: ['assets/styl/**/*.styl'],
                tasks: ['css'],
                options: {
                    spawn: false    // for faster processing
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Custom tasks
    grunt.registerTask('css', ['stylus:dev', 'concat']);
    grunt.registerTask('css-prod', ['stylus:prod', 'concat']);

    grunt.registerTask('build', ['css']);
    grunt.registerTask('publish', ['css-prod']);
    grunt.registerTask('start', ['build', 'watch']);

    // Default tasks
    grunt.registerTask('default', ['start']);
};

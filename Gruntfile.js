/**
 * Grunt tasks configuration file.
 */
module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({

        stylus: {
            dev: {
                options: {
                    compress: false,
                    lineos: true
                },
                files: {
                    'public/app.css': 'assets/styl/app.styl'
                }
            },
            prod: {
                files: {
                    'public/app.css': 'assets/styl/app.styl'
                }
            }
        },

        watch: {
            scripts: {
                files: ['assets/styl/**/*.styl'],
                tasks: ['stylus:dev'],
                options: {
                    spawn: false    // for faster processing
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Custom tasks
    grunt.registerTask('css', ['stylus:dev']);
    grunt.registerTask('css-prod', ['stylus:prod']);

    grunt.registerTask('build', ['css']);
    grunt.registerTask('publish', ['css-prod']);
    grunt.registerTask('start', ['build', 'watch']);

    // Default tasks
    grunt.registerTask('default', ['start']);
};

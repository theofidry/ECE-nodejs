var levelup = require('levelup'),
    db = levelup(__dirname + '/../../db', { valueEncoding: 'json' });

/**
 * Database module.
 *
 * @param globals App globals parameters, contain the admin user.
 */
module.exports = function (globals) {

    'use strict';

    /*
     * Initialise database: put the admin user
     */
    db.get('user:admin', function (err, value) {

        if (err) {

            db.put('user:admin', globals.admin, function (err) {

                if (err) {

                    // An error occurred, maybe a I/O one
                    console.log('Could not initialise database!');
                    console.log(err);

                    return;
                }

                // The database has been properly initialised
                // Try to output the value in dev environment
                if (env === 'development') {

                    db.get('user:admin', function (err, value) {

                        if (err) {

                            console.log('An error occurred!', err);
                            console.log(err);

                            return;
                        }

                        console.log('admin = ');
                        console.log(value);
                    });
                }
            });
        }
        else
            console.log('Database initialised.');
    });

    return {

        /**
         * Closes the underlying LevelDB store. The callback will receive any error encountered during closing as the first argument.
         *
         * @param {callback} callback
         * @returns {*}
         */
        close: function (callback) {
            return db.close(callback);
        },

        get: function (key, callback) {
            db.get(key, callback);
        },

        /**
         *
         */
        users: {
            /**
             * Get a user by its username.
             *
             * @param {string} username
             * @param {Function} callback
             * @returns {Object}
             */
            get: function (username, callback) {

                var user = {};

                return db.get('user:' + username, callback);
            },

            /**
             * Add a new user.
             *
             * @param {string} username
             * @param user
             * @param {Function} callback
             * @returns {*}
             */
            set: function (user, callback) {

                if ((user === undefined || user.name === undefined || user.password === undefined) && user.name !== 'admin')
                    return console.log("User must at least have the attributes 'name' and 'password.");

                db.put('user:' + user.name, user);
            },

            /**
             * Closes the underlying LevelDB store. The callback will receive any error encountered during closing as the first argument.
             *
             * @param {string} username
             * @param {Function} callback
             */
            del: function (username, callback) {

                return db.del('user:' + username, callback);
            }
        }
    };
};

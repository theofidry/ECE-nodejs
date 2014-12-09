var levelup = require('levelup');

/**
 * Database module.
 *
 * @param globals App globals parameters, contain the admin user in an attribute admin with the attributes name and password.
 * @param path Optional: path to a database. By default use the prod database specified in globals.
 * @returns {*}
 */
module.exports = function (globals, path) {

    'use strict';

    /*
     * Global check
     */
    // Check if globals contains admin user with the proper attributes
    try {
        if (globals.admin.name === undefined || globals.admin.password === undefined)
            return null;
    }
    catch (err) {
        return null;
    }

    // Reset type of path
    if (typeof(path) !== 'string')
        path = undefined;

    // Get defaut path
    path = path || globals.db;

    // Check if path is correct
    if (typeof(path) !== 'string')
        return null;


    /*
     * Load and initialise database
     */
    var db;

    try {
        db = levelup(path, {valueEncoding: 'json'});
    }
    catch (err) {
        console.log('Could not initialise database!');
        console.log(err);

        return null;
    }

    db.get('user:admin', function (err, value) {

        if (err) {

            db.put('user:admin', globals.admin, function (err) {

                if (err) {

                    // An error occurred, maybe a I/O one
                    console.log('Could not initialise database!');
                    console.log(err);

                    return;
                }

                // Is undefined during tests which is dev env...
                var env = env || 'development';

                // The database has been properly initialised
                // Try to output the value in dev environment
                if (env === undefined || env === 'development') {

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

    /*
     * Database API
     */
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
             * Add a new user. Cannot be admin user.
             *
             * @param {string} username
             * @param user must have the attributes name, email and password
             * @param {Function} callback
             * @returns {*}
             */
            set: function (user, callback) {

                if ((user === undefined || user.name === undefined || user.email == undefined || user.password === undefined) && user.name !== 'admin')
                    return console.log("User must at least have the attributes 'name' and 'password.");

                // create user key access (username and email)
                db.put('user:' + user.name, user.password);
                db.put('user:' + user.email, user.name);

                // serialize object
                for (var key in user) {

                    if (key !== 'name' && key != 'password')
                        db.put('user' + user.name, user[key])
                }

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
//#TODO: do a key per property

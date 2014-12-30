var levelup = require('levelup');
var fs = require('fs');
var levelWriteStream = require('level-writestream');
process.stdin.resume();
process.stdin.setEncoding('utf8');
var stdio = require('stdio');
var prompt = require('prompt');

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
        if (globals.admin.name === undefined || globals.admin.password === undefined) {
            return null;
        }
    }
    catch (err) {
        return null;
    }
    // Reset type of path
    if (typeof(path) !== 'string') {
        path = undefined;
    }

    // Get defaut path
    path = path || globals.db;

    // Check if path is correct
    if (typeof(path) !== 'string') {
        return null;
    }


    /*
     * Load database
     */
    var count = 0;
    var db = levelup(path, {db: require('jsondown')});

    var getPathForImport = function () {

        console.log('\n\tFor import, enter your path or the world: "default" to import default file csv');
        prompt.start();

        prompt.get(['command'], function (err, value) {

            console.log('Command-line input received:' + value.command);

            var pathfile = (value.command === 'default')? __dirname + '/users.csv': value.command;

            var read = fs.createReadStream(pathfile)
                .on('data', function (line) {
                    //storage of user's data
                    var infoUsersArray = line.toString().split('\r\n');

                    //writting in the database
                    var dest = db.createWriteStream()
                        .on('error', function (err) {console.log(err.message);})
                        .on('close', function () {console.log('streamed close');});

                    for (var i = 0; i < infoUsersArray.length - 1; i++) {
                        var user = infoUsersArray[i].split(',');
                        var keyuser = 'user:' + user[0]; //"user:nameofUser" => nameofUser
                        var keypass = keyuser + ":pass";// "user:nameofUser:pass" => pass
                        var keyusermail = keyuser + ":email";// "user:nameofUser:email" => email
                        var keyemail = 'user:' + user[1];// "user:email" => nameofUser for connexion with email adress
                        dest.write({key: keyuser, value: user[0]});
                        dest.write({key: keypass, value: user[2]});
                        dest.write({key: keyusermail, value: user[1]});
                        dest.write({key: keyemail, value: user[0]});
                    }
                    dest.end();
                })
                /*.on('close', function(){
                 console.log('db close');
                 })*/
                //readStream.pipe(db.createWriteStream('fillCache'));
                .on('error', function (error) {
                    console.log('error : ', error.message);
                });
        });
    };


    /*
     * Database API
     */
    var api = {

        /**
         * Closes the underlying LevelDB store. The callback will receive any error encountered during closing as the first argument.
         *
         * @param {Function} callback
         * @returns {*}
         */
        close: function (callback) {
            return db.close(callback);
        },

        /**
         * Get a value by its key.
         *
         * @param {string} key
         * @param {Function} callback
         */
        get: function (key, callback) {
            db.get(key, callback);
        },

        /**
         * Put a value in the database
         * @param {string} key
         * @param {*} value
         * @param {Function} callback
         */
        put: function (key, value, callback) {
            db.put(key, value, callback);
        },

        /**
         * Users API
         */
        users: {

            /**
             * Get a user by its name or email.
             *
             * @param {string} username
             * @param {Function|null} callback Callback may take 'err' and 'user' parameters.
             */
            get: function (username, callback) {

                var user = {
                    'name': username
                };
                var exist = false;

                db.createReadStream({
                    gte: 'user:' + username
                })
                    .on('data', function (data) {

                        var keys = data.key.split(':'),
                            key = keys[keys.length - 1];

                        // Get the password
                        if (keys.length === 2 && key === username) {
                            user.password = data.value;
                        }

                        // Password and email case
                        if (keys.length === 3) {

                            if (key === 'email') {
                                user.email = data.value;
                            } else {
                                user[key] = data.value;
                            }
                        }
                    })
                    .on('error', function (err) {
                        callback(err, undefined);
                    })
                    .on('end', function () {

                        if (user.password !== undefined) {
                            if (user.email === undefined) {

                                // Case where the user has been required by the email, the password is then the user name
                                api.users.get(user.password, callback);
                            } else {
                                callback(undefined, user);
                            }
                        } else {
                            callback(new Error('User not found'), undefined);
                        }
                    });
            },

            /**
             * Add a new user. Cannot be admin user.
             *
             * @param user {Object} User object: must have the attributes name, email and password. Other attributes may be included as long as it's not a object or a function. Otherwise nothing happens.
             * @param {Function|null} callback Callback may take 'err' parameter defined when an error occurred.
             */
            set: function (user, callback) {

                // Check if the user has the required properties
                if ((user === undefined || user.name === undefined || user.email == undefined || user.password === undefined) && user.name !== 'admin') {
                    return callback(new Error("User must at least have the attributes 'name' and 'password.'"));
                }

                // Set the user permissions if lacking
                // Admin are specified as such, otherwise is considered as not admin
                if (!user.hasOwnProperty('isAdmin')) {
                    user.isAdmin = false;
                }

                // Register all the operations to do
                // Primary operations
                var ops = [
                    {
                        type:  'put',
                        key:   'user:' + user.name,
                        value: user.password
                    },
                    {
                        type:  'put',
                        key:   'user:' + user.name + ':email',
                        value: user.email
                    },
                    {
                        type:  'put',
                        key:   'user:' + user.email,
                        value: user.name
                    }
                ];

                // Secondary operations: optional attributes
                for (var key in user) {

                    if (key !== 'name' && key != 'password' && key !== 'email') {
                        ops.push({
                            type:  'put',
                            key:   'user:' + user.name + ':' + key,
                            value: user[key]
                        });
                    }
                }

                // Batch operations
                db.batch(ops, function (err) {
                    callback(err);
                }, callback);
            },

            /**
             * Closes the underlying LevelDB store. The callback will receive any error encountered during closing as the first argument.
             *
             * @param {string} username
             * @param {Function|null} callback Callback may take 'err' parameter defined when an error occured.
             */
            del: function (username, callback) {

                api.users.get(username, function (err, user) {

                    if (err) {
                        callback(err);
                    } else {

                        var ops = [
                            {
                                type: 'del',
                                key:  'user:' + user.name
                            },
                            {
                                type: 'del',
                                key:  'user:' + user.email
                            }
                        ];

                        for (var key in user) {

                            if (key !== 'name' && key !== 'password') {
                                ops.push({
                                    type: 'del',
                                    key:  'user:' + user.name + ':' + key
                                });
                            }
                        }

                        db.batch(ops, function (err) {
                            if (err) {
                                callback(err);
                            }
                        })
                    }
                });
            }
        }
    };


    /*
     * Initialize database: placed after API declaration since it use it
     */
    api.users.get('admin', function (err, value) {

        if (err) {
            // Handle 'NotFoundError': add the lacking admin user
            api.users.set(globals.admin, function (err) {

                if (err) {
                    // I/O or other error occurred
                    console.log('ERROR: Could not initialise database!');
                    console.log('ERROR: ' + err.message);
                }

                // The database has been properly initialised
                // Try to output the value in dev environment
                if (process.env.NODE_ENV === 'development') {
                    /*console.log('admin = ');
                     console.log(value);*/
                    getPathForImport();
                }
            });
        } else {
            getPathForImport();
        }
    });


    // Return API
    return api;
};

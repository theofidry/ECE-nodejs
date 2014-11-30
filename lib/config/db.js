var levelup = require('levelup'),
    db = levelup(__dirname + '/../db', { valueEncoding: 'json' });

/**
 *
 * @param db
 * @param levelup
 */
module.exports = function (globals) {

    'use strict';

    /*
     * Initialise database: put the admin user
     */
    db.get('admin', function (err, value) {

        if (err) {

            db.put('admin', globals.admin, function (err) {

                if (err) {

                    // An error occurred, maybe a I/O one
                    console.log('Could not initialise database!');
                    console.log(err);

                    return;
                }

                // The database has been properly initialised
                // Try to output the value in dev environment
                if (env === 'development') {

                    db.get('admin', function (err, value) {

                        if (err) {

                            console.log('An error occurred!', err);
                            console.log(err);

                            return;
                        }

                        console.log('admin:');
                        console.log(value);
                    });
                }
            });
        } else
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

        get: function(key, callback) {
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
             * @param {callback} callback
             * @returns {*}
             */
            get: function (username, callback) {

                var user = {};

                return db.createReadStream({
                    gt: "users:" + username + ":"
                })
                    .on('data', function (data) {

                        var key, _, _ref;
                        _ref = data.key.split(':'), _ = _ref[0], username = _ref[1], key = _ref[2];

                        if (user.username == null) {
                            user.username = username;
                        }

                        return user[key] = data.value;
                    })
                    .on('error', function (err) {
                        return callback(err);
                    })
                    .on('end', function () {
                        return callback(null, user);
                    });
            },

            /**
             * Add a new user.
             *
             * @param {string} username
             * @param user
             * @param {callback} callback
             * @returns {*}
             */
            set: function (username, user, callback) {

                var k, ops, v;

                ops = (function () {

                    var _results = [];

                    for (k in user) {

                        v = user[k];

                        if (k === 'username') {
                            continue;
                        }
                        _results.push({
                            type:  'put',
                            key:   "users:" + username + ":" + k,
                            value: v
                        });
                    }

                    return _results;
                })();

                return db.batch(ops, function (err) {
                    return callback(err);
                });
            },
            /**
             * Closes the underlying LevelDB store. The callback will receive any error encountered during closing as the first argument.
             *
             * @param {string} username
             * @param {callback} callback
             */
            del: function (username, callback) {}
        }
    };
};

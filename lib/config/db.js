'use strict';
var levelup = require('levelup');
var fs = require('fs');
var LevelWriteStream = require('level-writestream');
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
     * Load and initialise database
     */
    var count = 0;
    var db = levelup(path, {db: require('jsondown')});

    var getPathForImport = function(){
      console.log('Admin added');
      console.log('\n\tFor import, enter your path or the world: "default" to import default file csv');
      prompt.start();

      prompt.get(['command'], function(err, value){
         console.log('Command-line input received:' + value.command);

         var pathfile = (value.command === 'default')? __dirname + '/users.csv' : value.command;

         var read = fs.createReadStream(pathfile)
             //.pipe(db.createWriteStream())
             .on('data', function(line) {
               //storage of user's data
               var infoUsersArray = line.toString().split('\r\n');

               //writting in the database
               var dest = db.createWriteStream()
                 .on('error', function(err){console.log(err.message);})
                 .on('close', function(){console.log('streamed close')});

               for(var i=0; i<infoUsersArray.length-1; i++){
                 var user = infoUsersArray[i].split(',');
                 var keyuser = 'user:'+ user[0]; //"user:nameofUser" => nameofUser
                 var keypass = keyuser + ":pass";// "user:nameofUser:pass" => pass
                 var keyusermail= keyuser + ":email";// "user:nameofUser:email" => email
                 var keyemail= 'user:' + user[1];// "user:email" => nameofUser for connexion with email adress
                 dest.write({key: keyuser , value: user[0]});
                 dest.write({key: keypass , value: user[2]});
                 dest.write({key: keyusermail , value: user[1]});
                 dest.write({key: keyemail, value: user[0]});
               }
               dest.end();
             })
            .on('close', function(){
                 console.log('db close');
             })
             //readStream.pipe(db.createWriteStream('fillCache'));
            .on('error', function(error){
              console.log('error : ', error.message);
            });
      });
    };

    db.get('user:admin', function (err, value) {
        if (err) {
            if (err.notFound) {
                // Handle 'NotFoundError': add the lacking admin user
                db.put('user:admin', globals.admin, function (err) {
                    if (err) {
                        // I/O or other error occurred
                        console.log('ERROR: Could not initialise database!');
                        console.log('ERROR: ' + err.message);
                    }
                    // The database has been properly initialised
                    // Try to output the value in dev environment
                    if (process.env.NODE_ENV === 'development') {
                        console.log('admin = ');
                        console.log(value);
                        getPathForImport();
                    }
                });
            } else {
                // I/O or other error
                console.log('ERROR: Could get value from the database!');
                console.log('ERROR: ' + err.message);
            }
        } else {
          getPathForImport();
        }

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

                if ((user === undefined || user.name === undefined || user.email == undefined || user.password === undefined) && user.name !== 'admin') {
                    return console.log("User must at least have the attributes 'name' and 'password.");
                }

                // create user key access (username and email)
                db.put('user:' + user.name, user.password);
                db.put('user:' + user.email, user.name);

                // serialize object
                for (var key in user) {

                    if (key !== 'name' && key != 'password') {
                        db.put('user' + user.name, user[key])
                    }
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

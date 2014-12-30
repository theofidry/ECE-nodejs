var express = require('express'),
    fs      = require('fs'),
    mkdirp  = require('mkdirp');


/**
 * Routes of the application.
 *
 * @param app Express application
 * @param io Socket.io instance
 */
module.exports = function (app, io) {

    'use strict';

    var router = express.Router(),
        logPath = __dirname + '/../../logs',
        accessLogPath = logPath + '/access.log';

    // create log folder if doesn't exists
    mkdirp.sync(logPath);

    // create a writing stream
    var logFile = fs.createWriteStream(accessLogPath, {flags: 'a+'});

    /**
     * Notify admin users.
     *
     * @param {Server} io   Socket.io server instance
     * @param {Request} req Express request object
     */
    var notifyAdmin = function (io, req) {

        var data = {
            ip:     req.ip || 'NaN',
            method: req.method || 'NaN',
            uri:    req.path || 'Nan',
            user:   req.session.user || 'anonymous',
            time:   new Date()
        };

        io.sockets.emit('userData', data);
        logFile.write(data.time + ' -- ' + data.ip + ' ' + data.user + ' ' + data.method + ' ' + data.uri + '\n');
    };


    /*
     * Filters
     */
    /**
     * Notify the admin users whatever the request is
     */
    router.all('*', function (req, res, next) {

        //console.log(socketio);
        notifyAdmin(io, req);

        return next();
    });

    /**
     * Check if the user is authenticated.
     */
    function checkAuth(req, res, next) {

        if (req.session.user !== undefined && req.session.user !== null) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    /**
     * Check if the user is not authenticated.
     */
    function checkUnauth(req, res, next) {

        if (req.session.user !== undefined && req.session.user !== null) {
            res.redirect('/user/' + req.session.user);
        } else {
            return next();
        }
    }


    /*
     * Routes
     */

    router.get('/', checkUnauth, function (req, res) {

        // Retrieve errors from session if any
        var errors = req.session.errors,
            signup_msg = req.session.signup_msg;

        // Reset errors or messages in session
        req.session.errors = undefined;
        req.session.signup_msg = undefined;

        res.render('index', {
            title:      'Home',
            errors:     errors,
            signup_msg: signup_msg
        });
    });


    // Sign up
    router.get('/signup', checkUnauth, function (req, res) {
        res.redirect('/');
    });

    router.post('/signup', function (req, res) {

        var user = {
            name:     req.body.signup_username,
            email:    req.body.signup_email,
            password: req.body.signup_password
        };

        // Validation rules
        req.assert('signup_username', 'Your name is required.').notEmpty();
        req.assert('signup_email', 'Valid remail required').isEmail();
        req.assert('signup_password', 'No empty password: 4 to 32 characters required.').len(4, 32);

        // Validate
        var errors = req.validationErrors();

        if (!errors) {

            app.db.users.set(user, function (err) {

                if (err) {
                    req.session.errors = err;
                } else {
                    req.session.signup_msg = 'Your account has been created ' + user.name + '. You can now sign in.';
                }

                res.redirect('/');
            });
        } else {

            // Redirect user to login page with errors
            req.session.errors = errors;
            res.redirect('/');
        }
    });


    // Login
    router.get('/login', checkUnauth, function (req, res) {
        res.redirect('/');
    });

    router.post('/login', function (req, res) {

        var username = req.body.username,
            password = req.body.password;

        // Reset session username
        req.session.user = null;

        //// Notify the admin users of a connection
        //io.sockets.on('login', function (socket) {
        //    socket.emit('login', {
        //        user: username,
        //        time: new Date()
        //    })
        //});

        // Validation rules
        req.assert('username', 'Your name is required.').notEmpty();
        req.assert('password', 'No empty password: 4 to 32 characters required.').len(4, 32);

        // Validate
        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            errors = {};

            app.db.users.get(username, function (err, user) {

                if (!err) {

                    // User has been found in the database
                    // Check if the credentials are correct
                    if ((username === user.name || username === user.email) && password == user.password) {

                        // Credentials match

                        // Set the sessions data
                        req.session.isAdmin = user.isAdmin;
                        req.session.user = username;

                        // Redirect the user
                        res.redirect('/user/' + username);
                        return;
                    } else {

                        // Wrong password
                        errors['msg'] = 'Wrong password';
                    }
                } else {

                    // Unknown user or another error
                    errors['msg'] = err.message;
                }

                // Redirect user to login page with errors
                req.session.errors = errors;
                res.redirect('/');
            });
        } else {

            // Redirect user to login page with errors
            req.session.errors = errors;
            res.redirect('/');
        }
    });


    // User
    router.get('/user', checkAuth, function (req, res) {

        res.redirect('/user/' + req.session.user);
    });

    router.get('/user/:username', checkAuth, function (req, res) {

        // Check if the URI and session username matchs
        if (req.params.username !== req.session.user) {

            // User try to access to another user space
            res.redirect('/user/' + req.session.user);
        } else {

            if (req.session.isAdmin === true) {
                res.render('admin/index', {
                    title:    'Dashboard',
                    session:  true,
                    username: req.session.user
                });
            } else {
                res.render('user/index', {
                    title:    'Dashboard',
                    session:  true,
                    username: req.session.user
                });
            }
        }
    });


    // Logout
    router.get('/logout', checkAuth, function (req, res) {

        req.session.destroy();
        res.redirect('/');
    });

    // Keep this as the last route rule
    router.get('*', function (req, res) {

        res.status(404);
        res.render('errors/404', {
            title: 'Error 404'
        });
    });

    app.use('/', router);
};

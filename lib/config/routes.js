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

        if (req.session.user !== undefined) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    /**
     * Check if the user is not authenticated.
     */
    function checkUnauth(req, res, next) {

        if (req.session.user !== undefined) {
            res.redirect('/user/' + req.session.user);
        } else {
            return next();
        }
    }


    /*
     * Routes
     */

    router.get('/', checkUnauth, function (req, res) {

        res.render('index', {
            title: 'Home'
        });
    });


    // Sign up
    router.get('/signup', checkUnauth, function (req, res) {
        res.redirect('/');
    });

    router.post('/signup', function (req, res) {
        console.log("signup");
        var username = req.body.username,
            email = req.body.email,
            password = req.body.password;

        // Validation rules
        req.assert('username', 'Your name is required.').notEmpty();
        req.assert('password', 'No empty password: 4 to 32 characters required.').len(4, 32);

        // Validate
        var errors = req.validationErrors();
        if (!errors) {
            app.db.put("user:" + username, username);
            app.db.put("user:" + email, username);
            app.db.put("user:" + username + ":pass", password);
            app.db.put("user:" + username + ":email", email);
        }

        res.render('index', {
            title:  'App',
            errors: errors
        });
        req.session.user = username;
        res.redirect('/user/' + username);
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

        // Notify the admin users of a connection
        io.sockets.on('login', function (socket) {
            socket.emit('login', {
                user: username,
                time: new Date()
            })
        });

        // Validation rules
        req.assert('username', 'Your name is required.').notEmpty();
        req.assert('password', 'No empty password: 4 to 32 characters required.').len(4, 32);

        // Validate
        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            errors = {};

            app.db.users.get('admin', function (err, user) {

                if (!err) {

                    // User has been found in the database
                    // Check if the credentials are correct
                    if (username === user.name && password == user.password) {

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
                res.render('index', {
                    title:  'App',
                    errors: errors
                });
            });
        }

        // Redirect user to login page with errors
        res.render('index', {
            title:  'App',
            errors: errors
        });
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

            if (req.session.isAdmin) {
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

//TODO: Apply a filter for secure connections and store id in session.
//TODO: Display errors given by the routing when form input is not correct

// When trying to access to a page accessible only logged in when not logged in, the user is redirect to the login page.
//TODO: in this case, add a flash message error explaining to the user that he must first log in to access to the page
//TODO: in this case, be sure that once logged in, he is redirected to the wished page and no the default index page
// ex: if he asked /user/admin/mypage when not logged in -> login page -> once logged, redirected to /user/admin/myage instead of /user/admin

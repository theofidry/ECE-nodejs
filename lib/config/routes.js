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

        // checks here
        if (req.session.user !== undefined) {
            return next();
        }// user authenticated
        else {
            res.redirect('/');
        }  // user not logged in, is redirected to home page
    }


    /*
     * Routes
     */
    router.get('/', function (req, res) {

        res.render('index', {
            title: 'Home'
        });
    });

    router.post('/login', function (req, res) {

        var username = req.body.username,
            password = req.body.password;

        // Reset session username
        req.session.user = null;


        // Validation rules
        req.assert('username', 'Your name is required.').notEmpty();
        req.assert('password', 'No empty password: 4 to 32 characters required.').len(4, 32);

        // Validate
        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            errors = {};

            req.session.user = username;

            if (username === app.config.admin.name && password === app.config.admin.password) {

                // User is admin
                io.sockets.on('login', function (socket) {
                    socket.emit('login', {
                        user: username,
                        time: new Date()
                    })
                });

                res.redirect('/user/' + username);
            }
            else {

                // User is not admin
                if (username === app.config.admin.name) {

                    app.db.users.get('')

                    // wrong password
                    errors['msg'] = "Wrong password.";
                    errors['password'] = true;
                } else {

                    // unknown user
                    errors['msg'] = "Unknown user.";
                    errors['user'] = true;
                }

                //TODO: Redirect to home page with errors/data instead of regenerating the page
                res.render('index', {
                    title:  'App',
                    errors: errors
                });
            }
        }
        else {

            //TODO: Redirect to home page with errors/data instead of regenerating the page
            // Display errors to user
            res.render('index', {
                title:  'App',
                errors: errors
            });
        }
    });

    router.get('/user/:username', checkAuth, function (req, res) {

        if (req.params.username === 'admin') {
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
    });

    router.get('/logout', function (req, res) {

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

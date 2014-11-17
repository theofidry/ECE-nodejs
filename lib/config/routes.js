/**
 * Routes of the application.
 *
 * @param app     Application module
 * @param express Express module
 */
module.exports = function (app, express) {

    'use strict';

    var router = express.Router();

    router.get('/', function (req, res) {
        res.render('index', {
            title: 'App'
        });
    });

    router.post('/', function(req, res) {

        var username = req.body.username,
            password = req.body.password;

        req.assert('username', 'Your name is required.').notEmpty();
        req.assert('password', 'No empty password: 6 to 32 characters required.').notEmpty().len(6, 32);

        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            errors = {};

            if (username === app.config.admin.name && password === app.config.admin.password) {

                // User is admin
                req.cookies.username = username;

                res.render('login', {
                    title:    'App',
                    username: username,
                    password: password
                })
            } else {

                // User is not admin
                if (username === app.config.admin.name)
                    errors['msg'] = "Wrong password.";  // wrong password
                else
                    errors['msg'] = "Unknown user.";    // unknown user

                res.render('index', {
                    title: 'App',
                    errors: errors
                });
            }
        } else {

            // Display errors to user
            res.render('index', {
                title: 'App',
                errors: errors
            });
        }
    });


    // Keep this as the last route rule
    router.get('*', function(req, res) {

        res.status(404);
        res.render('errors/404', {
            title: 'Error 404'
        });
    });

    app.use('/', router);
};

//TODO: Apply a filter for secure connections and store id in session.
//TODO: Display errors given by the routing when form input is not correct
//TODO: Add a logout link; clear cookie

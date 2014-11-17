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
        req.assert('password', 'No empty password.').notEmpty();

        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            errors = {};

            if (username === app.config.admin.name && password === app.config.admin.password) {

                // User is admin
                res.render('login', {
                    title:    'App',
                    username: username,
                    password: password
                })
            } else {

                errors['msg'] = "Unknown user.";

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
    router.get('*', function(req, res){
        res.send(404);
    });

    app.use('/', router);                                       // use routers
};

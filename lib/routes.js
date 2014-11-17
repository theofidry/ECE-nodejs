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
//
//        req.assert('username', 'Your name is required.').notEmpty();
//        req.assert('password', 'No empty password.').notEmpty();

        var errors = req.validationErrors();

        if (!errors) {

            // No errors were found, passed validation
            res.render('login', {
                title:    'App',
                username: username,
                password: passowrd
            })
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

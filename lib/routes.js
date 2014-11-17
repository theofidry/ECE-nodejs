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
            title: 'Hello world!'
        });
    });

    router.post('/login', function(req, res) {

        // Retrieve form data
        var username = req.param('username'),
            passowrd = req.param('password');

        console.log("username: " + username);
        console.log("password: " + passowrd);

        res.render('login', {
            username: username,
            password: passowrd
        })
    });


    // Keep this as the last route rule
    router.get('*', function(req, res){
        res.send(404);
    });

    app.use('/', router);                                       // use routers
};

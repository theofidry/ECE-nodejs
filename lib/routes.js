/**
 * Routes of the application.
 *
 * @param app     Application module
 * @param express Express module
 */
module.exports = function (app, express) {

    var router = express.Router();

    router.get('/', function (req, res) {
        res.render('index', {
            title: 'Hello world!'
        });
    });

    // Keep this as the last route rule
    router.get('*', function(req, res){
        res.send(404);
    });


    app.use('/', express.static(__dirname + '/../public'));     // server static content of '/public'
    app.use('/', router);                                       // use routers
};



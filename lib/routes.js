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

    //input
    router.post('/login',function(req, res){
      //console.log('working');
      /*res.render('working', {
        title : 'working'
      });*/
      res.render('login', {
          title: 'Hello world!'
      });
      console.log('request is login :' + req.user);
    });


    // Keep this as the last route rule
    router.get('*', function(req, res){
        res.send(404);
    });


    app.use('/', express.static(__dirname + '/../public'));     // server static content of '/public'
    app.use('/', router);                                       // use routers
};

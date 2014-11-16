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
    /*router.get('/login', function (req, res){
      res.render('login', {
          title: 'Hello world!',
      });
      //res.send({messages : messageStore.slice(req.params.since) });
    });
*/

    router.post('/login',function(req, res){
      //console.log('working');
      //console.log('req ' + req.body.user);
      var user = "";
      user = req.header.user;
      var pass = "";
      var pass = req.header.pass;
      console.log("user :" + user);
      console.log("pass :" + pass);
      res.render('login', {
          title: 'Hello world!',
      });
    });


    // Keep this as the last route rule
    router.get('*', function(req, res){
        res.send(404);
    });


    app.use('/', express.static(__dirname + '/../public'));     // server static content of '/public'
    app.use('/', router);                                       // use routers
};

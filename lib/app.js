/*
 * Module dependencies
 */
var express = require('express'),
    stylus = require('stylus'),
    nid = require('nid');

// Create an express application
var app = express();


/*
 * Routing
 */
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello world!'
    });
});

app.use('/', express.static(__dirname + '/../public'));
app.use('/', router);


/*
 * Jade template engine
 */
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');


/*
 * Export module
 */
module.exports = app;

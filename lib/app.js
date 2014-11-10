/*
 * Node.js app
 */
//// Declare a module
//var http = require('http');
//
//// Declare a HTTP server
//var app = http.createServer(function(req, res) {
//
//    // Write a response Header
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    // Write a response content
//    res.end('Hello World!');
//});
//
//module.exports = app;


/*
 * Express.js app
 */

/*
 * Module dependencies
 */
var express = require('express'),
    stylus  = require('stylus'),
    nid     = require('nid');

// Create an express application
var app = express();

/*
 * Routing
 */
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {
        title : 'Hello world!'
    });
});

app.use(router);


function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nid())
}

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.use(express.static(__dirname + '/../public'));




// Export module
module.exports = app;

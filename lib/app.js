/*
 * Module dependencies
 */
var express = require('express');

// Create an express application
var app = express();


/*
 * Routing
 */
require(__dirname + '/routes')(app, express);


/*
 * Jade template engine
 */
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');


/*
 * Export module
 */
module.exports = app;

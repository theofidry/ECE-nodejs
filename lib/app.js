/*
 * Module dependencies
 */
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    validator = require('express-validator'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    session = require('express-session');

// Create an express application
var app = express();


/*
 * Configure app
 */
env = process.env.NODE_ENV || 'development';    // put as global to be used everywhere
app.config = require(__dirname + '/config/globals');

// Jade template engine
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

// Error handler in dev environment
if (env === 'development') {
    // only use in development
    app.use(errorHandler())
}

app.use(methodOverride()); 					            // simulate DELETE and PUT
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-url
app.use(bodyParser.json());                             // parse application/json
app.use(validator([]));
app.use(favicon(__dirname + '/../public/favicon.ico')); // serve favicon
app.use(express.static(__dirname + '/../public'));      // server static content of '/public'
require(__dirname + '/config/db')(app.config);

// Add session support
app.use(cookieParser('VHZd553sJumsi7ahX2S9Bz5G2776XsAm'));
app.use(session({
    cookie:            {
        maxAge: 2628000000
    },
    resave:            true,
    saveUninitialized: true,
    secret:            '6dxQ47H66W8aKhS7gtHP8AmnytiR39F5'
}));

// Routing
require(__dirname + '/config/routes')(app, express);


/*
 * Export module
 */
module.exports = app;

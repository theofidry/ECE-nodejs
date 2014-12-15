/*
 * Module dependencies
 */
var bodyParser     = require('body-parser'),
    cookieParser   = require('cookie-parser'),
    errorHandler   = require('errorhandler'),
    express        = require('express'),
    favicon        = require('serve-favicon'),
    fs             = require('fs'),
    methodOverride = require('method-override'),
    session        = require('express-session'),
    validator      = require('express-validator');

// Create an express application
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var logfile = fs.createWriteStream(__dirname + '/../logs/access.log', {flags: 'w'});

io.on('connection', function (socket) {

    socket.on('connection', function (data) {

        // Logs data into log file
        logfile.write('\n' + data.time + ' -- ' + data.ip + ' ' + data.user + ' ' + data.method);

        // Notify view of new data
        io.sockets.emit('logsData', data);
        console.log(data);
    });
});


/*
 * Configure app
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';    // put as global to be used everywhere
app.config = require(__dirname + '/config/globals');

// Jade template engine
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

// Error handler in dev environment
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler())
}

app.use(methodOverride()); 					            // simulate DELETE and PUT
app.use(bodyParser.urlencoded({extended: false}));    // parse application/x-www-form-url
app.use(bodyParser.json());                             // parse application/json
app.use(validator([]));
app.use(favicon(__dirname + '/../public/favicon.ico')); // serve favicon
app.use(express.static(__dirname + '/../public'));      // server static content of '/public'
app.db = require(__dirname + '/config/db')(app.config);

// Add session support
app.use(cookieParser('VHZd553sJumsi7ahX2S9Bz5G2776XsAm'));
app.use(session({
    cookie:            {
        maxAge: 2628000000
    },
    httpOnly:          false,
    resave:            true,
    saveUninitialized: true,
    secret:            '6dxQ47H66W8aKhS7gtHP8AmnytiR39F5'
}));

// Routing
require(__dirname + '/config/routes')(app, io);


/*
 * Export module
 */
module.exports = server;

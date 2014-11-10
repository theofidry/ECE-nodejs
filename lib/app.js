// Declare a module
var http = require('http');

// Declare a HTTP server
var app = http.createServer(function(req, resp) {

    // Write a response Header
    resp.writeHead(200, {'Content-Type': 'text/plain'});
    // Write a response content
    resp.end('Hello World!');
});

module.exports = app;

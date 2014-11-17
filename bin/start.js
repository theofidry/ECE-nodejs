// Load application module
var app = require('../lib/app');

// Start server
var server = app.listen(1337, 'localhost', function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server running at http://%s:%s', host, port);
});

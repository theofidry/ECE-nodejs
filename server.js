// Load application module
var app = require('lib/app');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// Start server
try {
    var server = app.listen(port, host, function () {
        console.log('Server running at http://%s:%s', host, port);
    });
} catch (err) {
    console.log('Could not start server:' + err.message);
    console.log(err.trace());
}

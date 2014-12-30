/**
 * Application configuration files
 */
module.exports = {

    /*
     * Admin user: default user present in the configuration
     */
    admin: {
        name:     'admin',
        email:    'admin@example.com',
        test:     'Hello',
        password: 'Admin!'
    },

    /*
     * Production database
     */
    db:    __dirname + '/../../db'
};

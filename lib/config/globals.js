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
        password: 'admin',
        isAdmin:  true
    },

    /*
     * Production database
     */
    db:    __dirname + '/../../db'
};

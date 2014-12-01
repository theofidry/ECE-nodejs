/**
 * Application configuration files
 */
module.exports = {

    /*
     * Admin user: default user present in the configuration
     */
    admin: {
        name:     'admin',
        password: 'admin'
    },

    /*
     * Production database
     */
    db: __dirname + '/../../db'
};

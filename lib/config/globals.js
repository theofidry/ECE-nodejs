/**
 * Application configuration files
 */
module.exports = {

    /*
     * Admin user: default user present in the configuration
     */
    admin: {
        name:     'admin',
        password: 'admin1234'
    },

    /*
     * Database configuration
     */
    db: {
        database: 'expressjs',
        host:     'localhost',
        post:     8889,
        prefix:   'ece'
    }
};

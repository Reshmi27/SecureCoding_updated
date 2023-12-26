config = require('../config/config');
const pool = require('../config/database')
const winston = require('winston');

module.exports.authenticate = (email, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            winston.error(`Error getting connection: ${err}`);
            return callback(err, null);
        }

        try {
            connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id 
                              FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`, [email], (err, rows) => {
                if (err) {
                    winston.error(`Error executing SQL query: ${err}`);
                    return callback(err, null);
                }

                if (rows.length === 1) {
                    winston.info(`User authenticated successfully: ${email}`);
                    return callback(null, rows);
                } else {
                    winston.warn(`Login failed for user: ${email}`);
                    return callback('Login has failed', null);
                }
                
                connection.release();
            });
        } catch (error) {
            winston.error(`Exception during authentication: ${error}`);
            return callback(error, null);
        }
    });
};
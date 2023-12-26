const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const winston = require('winston');



exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    try {
        auth.authenticate(email, function (error, results) {
            if (error) {
                winston.error(`Authentication failed: ${error}`);
                return res.status(500).json({ message: error });
            } else {
                if (results.length === 1) {
                    if ((password == null) || (results[0] == null)) {
                        winston.warn('Login failed: Invalid password or user data');
                        return res.status(500).json({ message: 'login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) === true) {
                        let data = {
                            user_id: results[0].user_id,
                            role_name: results[0].role_name,
                            token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            })
                        }; //End of data variable setup
                        winston.info(`User logged in successfully: ${results[0].email}`);
                        return res.status(200).json(data);
                    } else {
                        winston.warn(`Login failed: Incorrect password for user ${results[0].email}`);
                        return res.status(500).json({ message: 'Login has failed.' });
                    }
                }
            }
        });
    } catch (error) {
        winston.error(`Exception during login process: ${error}`);
        return res.status(500).json({ message: error });
    }
};

exports.verifyAdmin = (req, res, next) => {
    console.log("verifyAdmin endpoint works")
    const userId = req.headers.user; // Assuming user_id is sent in the request body
    console.log(userId)
    user.getUserRole(userId, (error, results) => {
        console.log(error)
        console.log(results)
        if (error) {
            return res.status(500).json({ message: error });

        }
        if (results && results.length === 1) {
            const role = results[0].role_name;
            if (role === 'admin') {
                
            } else {
                // User is not an admin, redirect to login page
                return res.status(403).json({ message: 'Access forbidden. User is not an admin.' });
            }
        } else {
            return res.status(500).json({ message: 'Error verifying admin status.' });
        }
    });
};


exports.processRegister = (req, res, next) => {
    console.log('processRegister running.');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err || hash === null) {
            console.log('Error on hashing password');
            return res.status(500).json({ statusMessage: 'Unable to complete registration' });
        }

        user.createUser(fullName, email, hash, function (results, error) {
            if (error) {
                console.log('processRegister method: callback error block section is running.');
                console.log(error, '==================================================================');
                return res.status(500).json({ statusMessage: 'Unable to complete registration', error });
            }

            if (results && results.message) {
                // The createUser method returned an error message
                return res.status(400).json({ statusMessage: results.message });
            }

            console.log(results);
            return res.status(200).json({ statusMessage: 'Completed registration.' });
        });
    });
};
//end of registration
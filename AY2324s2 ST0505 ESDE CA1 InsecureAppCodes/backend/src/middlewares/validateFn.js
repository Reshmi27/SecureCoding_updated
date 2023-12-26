var validator = require('validator');
const user = require('../services/userService');


var validateFn = {
    validateUpdateSubmission: function (req, res, next) {
        var designTitle = req.body.designTitle;
        var designDescription = req.body.designDescription;
        var fileId = req.body.fileId;

        var reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        var reDesignDescription = new RegExp(`^[\\w\\s.]+$`);
        var reFileId = new RegExp(`^\\d+$`);

        if (reDesignTitleInput.test(designTitle)
            && reDesignDescription.test(designDescription)
            && reFileId.test(fileId)) {
            next()
        } else {
            res.status(400);
            res.send(`{"Error" : "Invalid data received"}`);

        }

    },
    //validate the user input for registration
    validateRegister: async function (req, res, next) {
        var fullName = req.body.fullName;
        var email = req.body.email;
        var password = req.body.password;

        reFullName = new RegExp("^[A-Za-z\\s'-]+$");
        rePassword = new RegExp(`^[a-zA-Z0-9!@#$%]{8,12}$`);

        if (
            reFullName.test(fullName) &&
            rePassword.test(password) &&
            validator.isEmail(email)
        ) {
            // Check if the email already exists in the database
            const emailExists = await user.emailExists(email);

            if (emailExists) {
                res.status(400);
                res.send({ error: 'Email already exists. Please use another email.' });
            } else {
                next();
            }
        } else {
            res.status(400);
            res.send({ error: 'Invalid data received' });
        }
    },


    // verifyAdmin: function (req, res, next) {
    //     // Extract the token from the request headers
    //     const token = req.headers.authorization;

    //     if (!token) {
    //         // If no token is provided, return an error
    //         return res.status(401).json({ message: 'Authorization token not found' });
    //     }

    //     // Verify the token
    //     jwt.verify(token, config.JWTKey, (err, decoded) => {
    //         if (err) {
    //             return res.status(401).json({ message: 'Invalid token' });
    //         }

    //         // Extract user information from the decoded token
    //         const { role_name } = decoded;

    //         // Check if the user has the necessary role for accessing the route
    //         if (role_name !== 'admin') {
    //             return res.status(403).json({ message: 'Unauthorized access' });
                
    //         }

    //         // Attach user information to the request object for further use
    //         req.user = decoded;

    //         // If the user has the required role, allow access to the route
    //         next();
    //     });
    // },


    validateInvitation: function (req, res, next) {
        var userId = req.body.userId;
        var recipientEmail = req.body.recipientEmail;
        var recipientName = req.body.recipientName;

        var reRecipientEmail = new RegExp(`^[\\w\\s.-]+@[\\w\\.-]+\\.[a-z]{2,}$`);
        var reRecipientName = new RegExp(`^[\\w\\s.]+$`);
        var reUserId = new RegExp(`^\\d+$`);
        if (reRecipientEmail.test(recipientEmail)
            && reRecipientName.test(recipientName)
            && reUserId.test(userId)) {
            next()
        } else {
            res.status(400);
            res.send(`{"Error" : "Invalid data received"}`);

        }

    },
    validateDesignSubmission: function (req, res, next) {
        console.log("middleware Works")
        var designTitle = req.body.designTitle;
        var designDescription = req.body.designDescription;
        let userId = req.body.userId;
        // var fileId = req.body.fileId;

        var reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        var reDesignDescription = new RegExp(`^[\\w\\s.]+$`);
        var reUserId = new RegExp(`^\\d+$`);
        // var reFileId = new RegExp(`^\\d+$`);
        
        if (reDesignTitleInput.test(designTitle)
            && reDesignDescription.test(designDescription)
            && reUserId.test(userId)
            // && reFileId.test(fileId)
            ) {
            next()
        } else {
            res.status(400);
            res.send(`{"Error" : "Invalid data received"}`);
            console.log(res.err.message);

        }
       console.log("middelware ends")
    },

}

module.exports = validateFn;
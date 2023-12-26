const express = require("express");
const cors = require('cors')
const config = require('./src/config/config');
const formData = require('express-form-data');
const fs = require('fs');
const https = require('https'); // Add this line
const path = require("path");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");

const winston = require('winston');


let app = express();
app.use('*', cors());

// Server Settings
//const HTTP_PORT = 5000;
const HTTPS_PORT = 5000; // Change this to the desired HTTPS port
const pathModule = require("path");
const privateKeyPath = path.resolve("C:/Users/arumu/localhost.key"); // Update with your private key path
const certificatePath = path.resolve("C:/Users/arumu/localhost.crt"); // Update with your certificate path

// ... (Other middleware setup)

// Parse data with connect-multiparty.
app.use(formData.parse({}));
// Delete from the request all empty files (size == 0)
app.use(formData.format());
// Change the file objects to fs.ReadStream
app.use(formData.stream());
// Union the body and the files
app.use(formData.union());

// Pug Template Engine
app.set("view engine", "pug");
app.set("views", path.resolve("./src/views"));

// Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Router
const router = express.Router();
app.use(router);
const rootPath = path.resolve("./dist");

// All client-side files are parked inside the dist directory.
// The client-side files are compiled by using Gulp
// The actual code files which developers edit are at /src/assets
app.use(express.static(rootPath));

// Applied this middleware function to supply dummy user id for testing
// when I have not prepared the login functionality.
// router.use(dummyUserFn.useDummyUserForTesting);
bootstrap(app, router);

// Initialize Winston logger
winston.configure({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Index Page (Home public page)
router.get('/', (req, res, next) => {
    res.send('<html><title>Backend API system for experimenting security concept</title><body>This project provides only backend API support</body></html>');
    res.end();
});

router.use((err, req, res, next) => {
    if (err) {
        // Handle file type and max size of image
        return res.send(err.message);
    }
});

// HTTPS Server setup
const credentials = {
    key: fs.readFileSync(privateKeyPath, 'utf8'),
    cert: fs.readFileSync(certificatePath, 'utf8'),
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(HTTPS_PORT, err => {
    if (err) return console.log(`Cannot Listen on HTTPS PORT: ${HTTPS_PORT}`);
    console.log(`HTTPS Server is Listening on: https://localhost:${HTTPS_PORT}/`);
});

// HTTP Server setup
// app.listen(HTTP_PORT, err => {
//     if (err) return console.log(`Cannot Listen on HTTP PORT: ${HTTP_PORT}`);
//     console.log(`HTTP Server is Listening on: http://localhost:${HTTP_PORT}/`);
// });

const path = require("path");
const fs = require('fs');
const https = require('https'); // Add this line


const express=require('express');
const serveStatic=require('serve-static');


var hostname="localhost";
var port=3001;


var app=express();


// Server Settings
const HTTP_PORT = 5000;
const HTTPS_PORT = 3001; // Change this to the desired HTTPS port
const pathModule = require("path");
const privateKeyPath = path.resolve("C:/Users/arumu/localhost.key"); // Update with your private key path
const certificatePath = path.resolve("C:/Users/arumu/localhost.crt"); // Update with your certificate path

app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if(req.method!="GET"){
        res.type('.html');
        var msg='<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    }else{
        next();
    }
});


app.use(serveStatic(__dirname+"/public"));


app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
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

// app.listen(port,hostname,function(){

//     console.log(`Server hosted at http://${hostname}:${port}`);
// });
'use strict'
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require('cors');
const FileHelper = require('./file-helper.js');

let port = 3200;

if(process.argv.length > 2) {
    const argu = require('minimist')(process.argv.slice(2));
    if(argu.port) {
        port = argu.port;
    }
    if(argu.help) {
        console.log("--- Simple file server ---");
        console.log("Usage: node main.js [--port p] [--help]");
        process.exit();
    }
}

//Allow usage of cors
app.use(cors());

//Parse the body of the messages (json/application/urlencoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//The static folder is accessible
//Note we use uuids for folders with files
//Not the most secure way, but not a problem in this scenario
app.use('/static', express.static(path.join(__dirname, "static")));

//Delete a file
//Returns status 200 OK, or 400 Bad Request(err)
app.delete('/file/delete/:id', (req, res) => {
    if(!req.params.id) {
        res.statusCode = 401;
        res.send();
        return;
    }
    FileHelper.deleteFile(req.params.id)
        .then(res.send("OK"))            
        .catch(err => {
            res.statusCode = 400;
            res.send(err);
        });
});

//Post a file
//Returns status 200 OK with a json fileObject, or 400 Bad Request(err)
app.post('/file/upload', upload.array('files'), (req, res) => {
    if (req.files.length > 0) {
        FileHelper.uploadFile(req.files[0])
            .then(fileRes => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.send(fileRes);
            })
            .catch(err => {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.send(err); // A little to dirty perhaps
            });
    }

});

//Welcome
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ name: "Welcome", age: 2 }));
});

console.log("Listening on port " + port);
app.listen(3200);
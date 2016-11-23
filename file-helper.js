const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

/**
 * File helper module
 */
module.exports = {
    /**
     * Upload a file to the server
     * Will generate an uuid folder inside static with the file uploaded
     * @param(file) : The file to be uploaded
     * @return{Promise} : A promise object resolving a fileObject or rejecting an error 
     */
    uploadFile: function (file) {
        return new Promise((resolve, reject) => {
            if (!file) reject("Argument file is empty");

            //Generate an unique id for the file
            const urlUuid = uuid.v4();
            const uri = path.resolve(__dirname, "static/" + urlUuid)

            fs.mkdir(uri);

            fs.writeFile(uri + path.sep + file.originalname, file.buffer, (err) => {
                if (err) reject(err);
                resolve({
                    id: urlUuid,
                    path_display: "static/" + urlUuid + "/" + file.originalname,
                    publicPath: "static/" + urlUuid + "/" + file.originalname,
                    mimetype: file.mimetype,
                    name: file.originalname
                });
            });
        })
    },

    /**
     * Delete a file on the server
     * @param(id) : The id of the folder (uuid)
     * @return{Promise} : A promise object resolving with no body or rejecting an error 
     */
    deleteFile: function (id) {
        return new Promise((resolve, reject) => {
            const uriPath = path.resolve(__dirname, "static/" + id);
            fs.exists(uriPath), (exists) => {
                if (exists) {
                    fs.rmdir(uriPath, (err) => {
                        if (err) reject(err);
                        resolve();
                    })
                } else {
                    reject("File does not exists");
                }
            }
        });
    }
}
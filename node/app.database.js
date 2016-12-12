"use strict";
var MongoClient = require('mongodb').MongoClient;
var databaseConnection = (function () {
    function databaseConnection() {
    }
    databaseConnection.connect = function (url, callback) {
        MongoClient
            .connect(url)
            .then(function (database) {
            console.log('Connection established to', url);
            databaseConnection.db = database;
            callback();
        })
            .catch(console.error);
    };
    return databaseConnection;
}());
exports.databaseConnection = databaseConnection;

// Importing npm package
const inquirer = require("inquirer");

// importing connection file
const connection = require("./connection");

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

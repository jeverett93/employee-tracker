const mysql = require("mysql");
require("dotenv").config();

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // PORT
  port: 3306,

  // Username
  user: "root",

  // Your password
  password: process.env.USER_PWD,
  database: "tracker_db"
});

module.exports = connection;
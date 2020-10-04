// Importing modules
const inquirer = require("inquirer");
const mysql = require("mysql");

// Connecting database
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Servient376!",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

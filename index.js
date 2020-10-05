// Importing modules
const inquirer = require("inquirer");
const mysql = require("mysql");
// const {
//   initialPrompt,
//   addDepartmentPrompt,
//   addEmployeeRole
// } = require("./created_modules/prompts");

// Connecting database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Servient376!",
  database: "employee_tracker_db",
});

// Defining starting function for program
function start() {
  inquirer.prompt(initialPrompt).then((data) => {
    if (data.initialResponse === "Add Department") {
      addDepartmentQuery();
    } else if (data.initialResponse === "Add Employee Role") {
      console.log("Hello!");
    } else if (data.initialResponse === "View All Departments") {
      viewAllDepartmentsQuery();
    } else if (data.initialResponse === "Exit") {
      connection.end();
    }
  });
}

// --------------------------------------------------------------------------------------------

// Defining query functions
function addDepartmentQuery() {
  inquirer.prompt(addDepartmentPrompt).then((response) => {
    connection.query(
      "INSERT INTO department SET ?",
      { name: response.addedDepartment },
      (err, results) => {
        if (err) throw err;
        start();
      }
    );
  });
}

function viewAllDepartmentsQuery() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// --------------------------------------------------------------------------------------------

const departmentArray = [];

var initialPrompt = {
  type: "list",
  name: "initialResponse",
  message: "What would you like to do?",
  choices: [
    "Add Department",
    "Add Employee Role",
    "Add Employee",
    "View All Departments",
    "View All Employees by Role",
    "View All Employee",
    "Update Employee Roles",
    "Exit",
  ],
};

var addDepartmentPrompt = {
  type: "input",
  name: "addedDepartment",
  message: "What is the name of the department you would like to add?",
};

// -------------------------------------------------------------------------------------------

// Starting databse connection
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  start();
});

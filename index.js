// Importing modules
const inquirer = require("inquirer");
const mysql = require("mysql");

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
    if (data.initialResponse === "View All Departments") {
      viewAllDepartmentsQuery();
    } else if (data.initialResponse === "View All Employees") {
      viewAllEmployeesQuery();
    } else if (data.initialResponse === "View All Roles") {
      viewAllRolesQuery();
    } else if (data.initialResponse === "Exit") {
      connection.end();
    } else if (data.initialResponse === "Add Department") {
      addDepartmentQuery();
    } else if (data.initialResponse === "Add Employee") {
      connection.query("SELECT * FROM role", (err, results) => {
        const allEmployees = ["None"];
        connection.query("SELECT * FROM employee", function (err, data) {
          if (err) throw err;
          for (let i = 0; i < data.length; i++) {
            allEmployees.push(`${data[i].first_name} ${data[i].last_name}`);
          }
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
              },
              {
                type: "list",
                name: "addedEmployeesRole",
                message: "What is the employee's role?",
                choices: function () {
                  var choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].title);
                  }
                  return choiceArray;
                },
              },
              {
                type: "list",
                name: "addedManager",
                message: "Who is the employee's manager?",
                choices: allEmployees,
              },
            ])
            .then((response) => {
              const firstNameOfManager = response.addedManager.split(" ")[0];
              for (let i = 0; i < results.length; i++) {
                if (response.addedEmployeesRole === results[i].title) {
                  response.addedEmployeesRole = results[i].id;
                }
              }
              for (let i = 0; i < data.length; i++) {
                if (response.addedManager === "None") {
                  response.addedManager = null;
                } else if (response.addedManager !== "None" && firstNameOfManager === data[i].first_name) {
                  response.addedManager = data[i].id;
                }
              }
              connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: response.firstName,
                  last_name: response.lastName,
                  role_id: response.addedEmployeesRole,
                  manager_id: response.addedManager,
                },
                (err, results) => {
                  if (err) throw err;
                  start();
                }
              );
            });
        });
      });
    } else if (data.initialResponse === "Add Role") {
      connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        inquirer
          .prompt([
            {
              type: "input",
              name: "roleTitle",
              message:
                "What is the name of the employee role you would like to add?",
            },
            {
              type: "input",
              name: "roleSalary",
              message: "What is the salary for this role?",
            },
            {
              type: "list",
              name: "departmentName",
              message: "What department does this role associate with?",
              choices: function () {
                var choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
              },
            },
          ])
          .then((response) => {
            for (let i = 0; i < results.length; i++) {
              if (response.departmentName === results[i].name) {
                response.departmentName = results[i].id;
              }
            }
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: response.roleTitle,
                salary: response.roleSalary,
                department_id: response.departmentName,
              },
              (err, results) => {
                if (err) throw err;
                start();
              }
            );
          });
      });
    } else if (data.initialResponse === "Update Employee Role") {
      const allRoles = [];
      connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        for (let i = 0; i < data.length; i++) {
          allRoles.push(data[i].title);
        }
        connection.query("SELECT * FROM employee", (err, results) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "list",
                name: "employeeUpdate",
                message: "Which employee's role would you like to update?",
                choices: function () {
                  var choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(
                      `${results[i].first_name} ${results[i].last_name}`
                    );
                  }
                  return choiceArray;
                },
              },
              {
                type: "list",
                name: "roleUpdate",
                message:
                  "Which role would you like to set for the selected employee?",
                choices: allRoles,
              },
            ])
            .then((response) => {
              for (let i = 0; i < data.length; i++) {
                if (response.roleUpdate === data[i].title) {
                  response.roleUpdate = data[i].id;
                }
              }
              connection.query(
                `UPDATE employee SET role_id = ${
                  response.roleUpdate
                } WHERE first_name = "${
                  response.employeeUpdate.split(" ")[0]
                }"`,
                (err, results) => {
                  if (err) throw err;
                  start();
                }
              );
            });
        });
      });
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

function viewAllEmployeesQuery() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id FROM department 
  INNER JOIN role
  ON role.department_id = department.id
  INNER JOIN employee
  ON role.id = employee.role_id`,
    (err, results) => {
      results.title;
      if (err) throw err;
      console.table(results);
      start();
    }
  );
}

function viewAllRolesQuery() {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// --------------------------------------------------------------------------------------------

var initialPrompt = {
  type: "list",
  name: "initialResponse",
  message: "What would you like to do?",
  choices: [
    "Add Department",
    "Add Role",
    "Add Employee",
    "View All Departments",
    "View All Roles",
    "View All Employees",
    "Update Employee Role",
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

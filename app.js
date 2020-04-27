// Importing npm package
const inquirer = require("inquirer");

// importing connection file
const connection = require("./connection");

// SQL Connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});

// Menu that gives user options for building team
const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to do?",
                choices: [
                    "Add Department",
                    "View Departments",
                    "Delete Departments",
                    "Add Role",
                    "View Roles",
                    "Delete Roles",
                    "Add Employee",
                    "View Employees",
                    "Update Employee Role",
                    "Remove Employee",
                    "Finish",
                ],
                name: "userChoice"
            },
        ])
        .then(res => {
            const userChoice = res.userChoice;
            switch (userChoice) {
                // Adding department
                case "Add Department":
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What department do you want to add?",
                            name: "dept_name",
                        },
                    ]).then((answer) => {
                        connection.query(
                            "INSERT INTO departments SET ?",
                            {
                                dept_name: answer.dept_name,
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added department!");
                                // showing the departments
                                connection.query("SELECT departments.id, departments.dept_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (
                                    err,
                                    res
                                ) {
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    // sends user back to main menu
                                    mainMenu();
                                });
                            }
                        );
                    });
                    break;
                    // Viewing department
                case "View Departments":
                    connection.query("SELECT departments.id, departments.dept_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        // sends user back to main menu
                        mainMenu();
                    });
                    break;
                    // Deleting departments
                case "Delete Departments":
                    connection.query("SELECT departments.id, departments.dept_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (err, departments) {
                        if (err) throw err;
                        departments.length > 0 && console.table(departments);
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Which department would you like to delete?",
                                    name: "deleteDept",
                                    choices: () => departments.map(department => `${department.id} ${department.dept_name}`)
                                },
                            ])
                            .then((answer) => {
                                connection.query(
                                    "DELETE FROM departments WHERE id = ? ",
                                    [answer.deleteDept.slice(0,2).trim()],
                                    function (err, res) {
                                        if (err) throw err;
                                        connection.query("SELECT departments.id, departments.dept_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON (departments.id = roles.dept_id) LEFT JOIN employees ON (roles.id = employees.role_id)", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            // showing remaining departments
                                            res.length > 0 && console.table(res);
                                            // sends user back to main menu
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });
                    break;
                    // Adding roles
                case "Add Role":
                    connection.query(
                        "SELECT * FROM departments",
                        function (err, departments) {
                            if (err) throw err;
                            inquirer.prompt([
                                {
                                    type: "input",
                                    message: "What role do you want to add?",
                                    name: "title",

                                },
                                {
                                    type: "input",
                                    message: "What is the salary for this role?",
                                    name: "salary",
                                },
                                {
                                    type: "list",
                                    message: "What is the department for this role:",
                                    name: "dept_id",
                                    choices: () => departments.map(department => `${department.id} ${department.dept_name}`)
                                },
                            ])
                                .then((answer) => {
                                    connection.query(
                                        "INSERT INTO roles SET ?",
                                        {
                                            title: answer.title,
                                            salary: answer.salary,
                                            dept_id: answer.dept_id.slice(0, 2).trim(),
                                        },
                                        function (err) {
                                            if (err) throw err;
                                            console.log("Successfully added role!");
                                            // viewing the roles
                                            connection.query("SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles LEFT JOIN departments ON (roles.dept_id = departments.id)", function (
                                                err,
                                                res
                                            ) {
                                                if (err) throw err;
                                                res.length > 0 && console.table(res);
                                                // sends user back to main menu
                                                mainMenu();
                                            });
                                        }
                                    );
                                });
                        })
                    break;
                    // Viewing Roles
                case "View Roles":
                    connection.query("SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles LEFT JOIN departments ON (roles.dept_id = departments.id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        // sends user back to main menu
                        mainMenu();
                    });
                    break;
                    // Deleting Roles
                case "Delete Roles":
                    connection.query("SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles LEFT JOIN departments ON (roles.dept_id = departments.id)", function (err, roles) {
                        if (err) throw err;
                        roles.length > 0 && console.table(roles);
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Which role do you want to delete?",
                                    name: "deleteRoles",
                                    choices: () => roles.map(role => `${role.id} ${role.title}`)
                                },
                            ])
                            .then((answer) => {
                                connection.query(
                                    "DELETE FROM roles WHERE id=? ",
                                    [answer.deleteRoles.slice(0, 2).trim()],
                                    function (err, res) {
                                        if (err) throw err;
                                        // Viewing remaining roles
                                        connection.query("SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles LEFT JOIN departments ON (roles.dept_id = departments.id)", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            // sends user back to main menu
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });
                    break;
                    // Viewing Employees
                case "View Employees":
                    connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        // sends user back to main menu
                        mainMenu();
                    });
                    break;
                    // Adding Employee
                case "Add Employee":
                    connection.query(
                        "SELECT * FROM roles",
                        function (err, roles) {
                            if (err) throw err
                            connection.query(
                                "SELECT * FROM employees",
                                function (err, employees) {
                                    if (err) throw err
                                    inquirer.prompt([
                                        {
                                            type: "input",
                                            message: "What is the employee's first name?",
                                            name: "first_name",
                                        },
                                        {
                                            type: "input",
                                            message: "What is the employee's last name?",
                                            name: "last_name",
                                        },
                                        {
                                            type: "list",
                                            message: "What is the employee's role?",
                                            name: "role_id",
                                            choices: () => roles.map(role => `${role.id} ${role.title}`)
                                        },
                                        {
                                            type: "list",
                                            message: "Who is the employee's manager?",
                                            name: "manager_id",
                                            choices: () => employees.map(employee => `${employee.id} ${employee.first_name} ${employee.last_name}`)
                                        },
                                    ])
                                        .then((answer) => {
                                            connection.query(
                                                "INSERT INTO  employees SET ?",
                                                {
                                                    first_name: answer.first_name,
                                                    last_name: answer.last_name,
                                                    role_id: answer.role_id.slice(0,2).trim(),
                                                    manager_id: answer.manager_id.slice(0,2).trim(),
                                                },
                                                function (err) {
                                                    if (err) throw err;
                                                    console.log("Successfully added an employee!");
                                                    // viewing the employees
                                                    connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)", function (
                                                        err,
                                                        res
                                                    ) {
                                                        if (err) throw err;
                                                        res.length > 0 && console.table(res);
                                                        // sends user back to main menu
                                                        mainMenu();
                                                    });
                                                }
                                            );
                                        });
                                })
                        })
                    break;
                    // Deleting Employee
                case "Remove Employee":
                    connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)", function (err, employees) {
                        if (err) throw err;
                        employees.length > 0 && console.table(employees);
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Which employee would you like to remove?",
                                    name: "removeEmployee",
                                    choices: () => employees.map(employee => `${employee.id} ${employee.first_name} ${employee.last_name}`)
                                },
                            ])
                            .then((answer) => {
                                connection.query(
                                    "DELETE FROM employees WHERE id=? ",
                                    [answer.removeEmployee.slice(0, 2).trim()],
                                    function (err, res) {
                                        if (err) throw err;
                                        // Viewing Remaining Employees
                                        connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            // sends user back to main menu
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });
                    break;
                    // Updating role of employee
                case "Update Employee Role":
                    connection.query("SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles LEFT JOIN departments ON (roles.dept_id = departments.id)",
                        function (err, roles) {
                            if (err) throw err;
                            connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)",
                                function (err, employees) {
                                    if (err) throw err;
                                    inquirer
                                        .prompt([
                                            {
                                                type: "list",
                                                message: "Which employee would you like to update?",
                                                name: "empId",
                                                choices: () => employees.map(employee => `${employee.id} ${employee.first_name} ${employee.last_name}`)
                                            },
                                            {
                                                type: "list",
                                                message: "What would you like to update their role to?",
                                                name: "empRole",
                                                choices: () => roles.map(role => `${role.id} ${role.title}`)
                                            }
                                        ])
                                        .then((answers) => {
                                            connection.query(
                                                "UPDATE employees SET role_id=? WHERE id=?",
                                                [answers.empRole.slice(0, 1), answers.empId.slice(0, 2).trim()],
                                                function (err, res) {
                                                    if (err) throw err;
                                                    console.log("Successfully updated employee!")
                                                    connection.query(
                                                        // viewing remaining employees
                                                        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.id, departments.dept_name FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.dept_id = departments.id)",
                                                        function (
                                                            err,
                                                            res
                                                        ) {
                                                            if (err) throw err;
                                                            res.length > 0 && console.table(res);
                                                            // sends user back to main menu
                                                            mainMenu();
                                                        })
                                                })
                                        });
                                })
                        })
                    break;
                    // User is done and connection ends
                case "Finish":
                    connection.end();
                    break;
                default:
                    break;
            }
        })
};



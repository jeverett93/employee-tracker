// Importing npm package
const inquirer = require("inquirer");

// importing connection file
const connection = require("./connection");

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});

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
                    "Update Employee Managers",
                    "Remove Employee",
                    "Finish",
                ],
                name: "userChoice"
            },
        ])
        .then(res => {
            const userChoice = res.userChoice;

            switch (userChoice) {
                case "Add Department":
                    inquirer.prompt(addDept).then((answer) => {
                        connection.query(
                            "INSERT INTO departments SET ?",
                            {
                                dept_name: answer.dept_name,
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added department!");
                                // show the departments
                                connection.query("SELECT * FROM departments", function (
                                    err,
                                    res
                                ) {
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    mainMenu();
                                });
                            }
                        );
                    });
                    break;

                case "View Departments":
                    connection.query("SELECT * FROM departments", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        mainMenu();
                    });
                    break;

                case "Delete Departments":
                    connection.query("SELECT * FROM departments ", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        inquirer
                            .prompt([
                                {
                                    type: "input",
                                    message: "Which department id would you like to delete?",
                                    name: "deleteDept",
                                },
                            ])
                            .then((answer) => {
                                connection.query(
                                    "DELETE FROM departments WHERE id=? ",
                                    [answer.deleteDept],
                                    function (err, res) {
                                        if (err) throw err;
                                        connection.query("SELECT * FROM departments", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });
                    break;

                case "Add Role":
                    inquirer.prompt(addRole).then((answer) => {
                        connection.query(
                            "INSERT INTO roles SET ?",
                            {
                                title: answer.title,
                                salary: answer.salary,
                                dept_id: parseInt(answer.dept_id),
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added role!");
                                // view the roles
                                connection.query("SELECT * FROM departments", function (
                                    err,
                                    res
                                ) {
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    mainMenu();
                                });
                            }
                        );
                    });
                    break;

                case "View Roles":
                    connection.query("SELECT * FROM roles", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        mainMenu();
                    });
                    break;

                case "Delete Roles":
                    connection.query("SELECT * FROM roles", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        inquirer
                            .prompt([
                                {
                                    type: "input",
                                    message: "Which role id do you want to delete?",
                                    name: "deleteRoles",
                                },
                            ])
                            .then((answer) => {
                                connection.query(
                                    "DELETE FROM roles WHERE id=? ",
                                    [answer.deleteRoles],
                                    function (err, res) {
                                        if (err) throw err;
                                        connection.query("SELECT * FROM roles", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });
                    break;

                case "View Employees":
                    connection.query("SELECT * FROM employees", function (err, res) {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        mainMenu();
                    });
                    break;
                case "Add Employee":
                    inquirer.prompt(addEmployee).then((answer) => {
                        connection.query(
                            "INSERT INTO  employees SET ?",
                            {
                                first_name: answer.first_name,
                                last_name: answer.last_name,
                                role_id: parseInt(answer.role_id),
                                manager_id: parseInt(answer.manager_id),
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Successfully added an employee!");
                                // view the employees
                                connection.query("SELECT * FROM employees", function (
                                    err,
                                    res
                                ) {
                                    if (err) throw err;
                                    res.length > 0 && console.table(res);
                                    mainMenu();
                                });
                            }
                        );
                    });
                    break;

                case "Remove Employee":
                    connection.query("SELECT * FROM employees", function (err, employees) {
                        if (err) throw err;
                        employees.length > 0 && console.table(res);
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
                                    [answer.removeEmployee.slice(0,1)],
                                    function (err, res) {
                                        if (err) throw err;
                                        connection.query("SELECT * FROM employees", function (
                                            err,
                                            res
                                        ) {
                                            if (err) throw err;
                                            res.length > 0 && console.table(res);
                                            mainMenu();
                                        });
                                    }
                                );
                            });
                    });

                    break;

                case "Update Employee Role":
                    connection.query("SELECT * FROM roles",
                        function (err, roles) {
                            if (err) throw err;
                            connection.query("SELECT * FROM employees",
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
                                                [answers.empRole.slice(0, 1), answers.empId.slice(0, 1)],
                                                function (err, res) {
                                                    if (err) throw err;
                                                    res.length > 0 && console.table(res);
                                                    mainMenu();
                                                })
                                        });
                                })
                        })

                    break;

                // case "See Manager Employees":
                //     inquirer.prompt(questions).then((response) => { });
                //     break;

                case "Finish":
                    connection.end();
                    break;
                default:
                    break;
            }
        })
};

const addDept = [
    {
        type: "input",
        message: "What department do you want to add?",
        name: "dept_name",
    },
];

const addRole = [
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
        type: "input",
        message: "What is the department ID for this role:",
        name: "dept_id",
    },
];
const addEmployee = [
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
        type: "input",
        message: "What is the employee's role ID?",
        name: "role_id",
    },
    {
        type: "input",
        message: "What is the ID of the employee's manager?",
        name: "manager_id",
    },
];
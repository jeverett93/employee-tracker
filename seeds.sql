-- adding initial data into table
USE tracker_db;

INSERT INTO departments (dept_name)
VALUES ("IT");

INSERT INTO roles (title, salary, dept_id)
VALUES ("team lead", 60000, 1);

INSERT INTO roles (title, salary, dept_id)
VALUES ("programmer", 40000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy", "Mack", 1, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Darlene", "McKay", 2, 1);


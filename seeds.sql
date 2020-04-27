-- adding initial data into table
USE tracker_db;

INSERT INTO departments (dept_name)
VALUES ("IT");

INSERT INTO roles (title, salary, dept_id)
VALUES ("associate", 60000.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy", "Mack", 1, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Darlene", "McKay", 2, 1);


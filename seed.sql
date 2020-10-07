DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(55),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(55),
    salary DECIMAL,
    department_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(55),
    last_name VARCHAR(55),
    role_id INTEGER,
    manager_id INTEGER NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000.00, 1), ("Salesperson", 80000.00, 1),
("Lead Engineer", 150000.00, 2), ("Software Engineer", 120000.00, 2), 
("Accountant", 125000.00, 3), ("Legal Team Lead", 250000.00, 4), 
("Lawyer", 190000.00, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kingston", "Phelps", 1), ("Johnny", "Ryder", 3), ("Phil", "Robinson", 4), ("Kali", "Hutchins", 2);
DROP DATABASE IF EXISTS employee_tracker; 
CREATE database employee_tracker; 

USE employee_tracker; 

CREATE TABLE department ( 
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30), 
    salary DECIMAL,
    department_id Int
); 

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    first_name VARCHAR(30), 
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT
); 

-- This is the select all parameters-- 
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS 'Department'
FROM employee
	JOIN (role, department)
    ON (employee.role_id = role.id AND employee.manager_id = department.id);
    
    
-- This is the correct way of joining rows 
SELECT e.id, e.first_name, e.last_name, e.manager_id AS 'manager', role.title, role.salary, department.name AS 'department'
FROM employee e
	LEFT JOIN  role
    ON (e.role_id = role.id)
	LEFT JOIN department
    ON role.department_id = department.id;
    
-- This is view with Employee and Department  
SELECT e.first_name, e.last_name,department.name AS 'department'
FROM employee e
	LEFT JOIN  role
    ON (e.role_id = role.id)
	LEFT JOIN department
    ON role.department_id = department.id;

-- This is employee and roles
SELECT e.first_name, e.last_name, role.title, role.salary
FROM employee e
	LEFT JOIN  role
    ON (e.role_id = role.id)
	LEFT JOIN department
    ON role.department_id = department.id;
    


    
SELECT * FROM department; 
SELECT * FROM role; 
SELECT * FROM employee; 



INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("John", "Doe",1,3);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Mike", "Chan",2,1);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Ashley", "Rodriguez",3,null);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Kevin", "Tupik",4,3);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Malia", "Brown",5,null);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Sarah", "Lourd",6,null);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Tom", "Allen",7,6);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Christian", "Eckenrode",8,2);


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1); 

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000,1); 

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000,2); 

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000,2); 

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000,3); 

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000,4); 

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000,4); 

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000,2); 


INSERT INTO department (name)
VALUES ("Sales"); 

INSERT INTO department (name)
VALUES ("Engineering"); 

INSERT INTO department (name)
VALUES ("Finance"); 

INSERT INTO department (name)
VALUES ("Legal"); 


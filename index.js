const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Johnson5',
  database: 'employee_tracker',
});

const start = () => {
  inquirer
    .prompt({
      name: 'start',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View All employees', 'View departments', 'View Roles', 'Add employee', "Add department", "Add Role", "Update Employee Role"],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.start === 'View All employees') {
        readAllEmployee();
      } else if (answer.start === 'View departments') {
        readAllDepartments();
      } else if (answer.start === "View Roles") {
        readAllRoles();
      } else {
        connection.end();
      }
    });
};













const readAllEmployee = () => {
  console.log('Selecting all employee...\n');
  connection.query(`SELECT e.id, e.first_name, e.last_name, e.manager_id AS 'manager', role.title, role.salary, department.name AS 'department'
  FROM employee e
    LEFT JOIN  role
      ON (e.role_id = role.id)
    LEFT JOIN department
      ON role.department_id = department.id;`, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table([res]);
    start();
  });
};

const readAllDepartments = () => {
  console.log('Selecting all employee and departments...\n');
  connection.query(`SELECT e.id, e.first_name, e.last_name,department.name AS 'department'
  FROM employee e
    LEFT JOIN  role
      ON (e.role_id = role.id)
    LEFT JOIN department
      ON role.department_id = department.id;`, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
};

const readAllRoles = () => {
  console.log('Selecting all employee and roles...\n');
  connection.query(`SELECT e.first_name, e.last_name, role.title, role.salary
  FROM employee e
    LEFT JOIN  role
      ON (e.role_id = role.id)
    LEFT JOIN department
      ON role.department_id = department.id;
      `, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}
// const deleteProduct = () => {
//   console.log('Deleting all strawberry icecream...\n');
//   connection.query(
//     'DELETE FROM products WHERE ?',
//     {
//       flavor: 'strawberry',
//     },
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products deleted!\n`);
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// };

const updateProduct = () => {
  console.log('Updating all Rocky Road quantities...\n');
  const query = connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        quantity: 100,
      },
      {
        title: 'Rocky Road',
      },
    ],
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} products updated!\n`);
      // Call deleteProduct AFTER the UPDATE completes
      deleteProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
};

const createProduct = () => {
  console.log('Inserting a new product...\n');
  const query = connection.query(
    'INSERT INTO products SET ?',
    {
      flavor: 'Rocky Road',
      price: 3.0,
      quantity: 50,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} product inserted!\n`);
      // Call updateProduct AFTER the INSERT completes
      updateProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
};



// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});

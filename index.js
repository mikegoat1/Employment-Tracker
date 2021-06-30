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
      } else if (answer.start === 'Update Employee Role') {
        updateEmployeeRole();
      } else if (answer.start === 'Add employee') {
        addEmployee();
      } else if (answer.start === "Add Role") {
        addRole();
      } else if (answer.start === "Add department") {
        addDepartment();
      } else {
        connection.end();
      }
    });
};

const readAllEmployee = () => {
  console.log('Selecting all employee...\n');
  connection.query(`SELECT e.id, 
  e.first_name, 
  e.last_name, 
  concat(manager.first_name, ' ', manager.last_name) AS manager, 
  role.title, 
  role.salary, 
  department.name AS 'department'
  FROM employee e
    LEFT JOIN  role
      ON (e.role_id = role.id)
    LEFT JOIN department
      ON role.department_id = department.id
    LEFT JOIN employee manager
      ON manager.id = e.manager_id;`, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
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
    console.table(res);
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
    console.table(res);
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
const updateEmployeeRole = () => {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'list',
        message: 'What do you want to update the Role to?',
        choices: ['Salesperson', 'Sales Lead', 'Software Engineer', 'Lead Engineer', 'Accountant', 'Lawyer', 'Legal Team Lead']
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the new salary',
      },
      {
        name: 'id',
        type: 'input',
        message: 'What is the id of the person who role you would like to change?',

      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      console.log('Updating all employee Role...\n');
      const query = connection.query(
        'UPDATE role SET ? , ? WHERE ?',
        [
          {
            title: answer.title,
          },
          {
            salary: answer.salary,
          },
          {
            id: answer.id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role updated!\n`);
          start()
        }
      );

      // logs the actual query being run
      console.log(query.sql);
    });
};


const addEmployee = () => {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: 'first',
        type: 'input',
        message: 'What is the employee first name?',
      },
      {
        name: 'last',
        type: 'input',
        message: 'What is the employee last name?',
      },
      {
        name: 'manager',
        type: 'input',
        message: 'What is the manager id?',

      },
      {
        name: "role",
        type: "input",
        message: "Whats your employee ID?"
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO employee SET ?',
        // QUESTION: What does the || 0 do?
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: answer.role,
          manager_id: answer.manager,
        },
        (err) => {
          if (err) throw err;
          console.log('You added another victim');
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

const addRole = () => {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'list',
        message: 'What Role do you want to add?',
        choices: ['Salesperson', 'Sales Lead', 'Software Engineer', 'Lead Engineer', 'Accountant', 'Lawyer', 'Legal Team Lead'],
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Whats the Salary?',
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO role SET ?',
        // QUESTION: What does the || 0 do?
        {
          title: answer.title,
          salary: answer.salary,
          department_id: whatDepartment(answer.title),
        },
        (err) => {
          if (err) throw err;
          console.log('You added another role');
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

function whatDepartment(str) {
  if (str === "Salesperson" || "Sales Lead") {
    return 1;
  } else if (str === "Lead Engineer" || "Software Engineer") {
    return 2;
  } else if (str === "Accountant") {
    return 3;
  } else if (str === "Legal Team Lead" || "Lawyer") {
    return 4;
  } else {
    return str;
  }
}
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the new department?"
      }
    ])

    .then((answer) => {
      console.log('Inserting a new department...\n');
      const query = connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.department,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department inserted!\n`);
          // Call updateProduct AFTER the INSERT completes
          start();
        }
      );

      // logs the actual query being run
      console.log(query.sql);
    });
};



// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});

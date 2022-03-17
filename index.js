const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db',
  },
  console.log(`Connected to the employees_db database.`)
);

// Inquirer prompt for the user to choose what they would like to display
const init = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
      },
    ])
    .then((answer) => {
      switch (answer.choice) {
        case 'view all departments':
          viewAllDepartments();
          break;
        case 'view all roles':
          viewAllRoles();
          break;
        case 'view all employees':
          viewAllEmployees();
          break;
        case 'add a department':
          addDepartment();
          break;
        case 'add a role':
          addRole();
          break;
        case 'add an employee':
          addEmployee();
          break;
        case 'update an employee role':
          updateEmployeeRole();
          break;
      }
    });
};

// Functions to display user's choices
const viewAllDepartments = () => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.table(rows);
      init();
    }
  });
};

const viewAllRoles = () => {
  const sql = `SELECT roles.id AS id, roles.title AS title, department.name AS department, roles.salary AS salary
  FROM roles
  JOIN department ON roles.department_id = department.id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.table(rows);
      init();
    }
  });
};

const viewAllEmployees = () => {
  const sql = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, roles.title AS job_title, department.name AS department, roles.salary AS salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
  FROM employee
  JOIN roles ON employee.role_id = roles.id
  JOIN department ON roles.department_id = department.id
  LEFT JOIN employee manager on employee.manager_id = manager.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.table(rows);
      init();
    }
  });
};

const addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES (?)`;
      db.query(sql, answer.departmentName, (err, rows) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('Added department successfully');
          init();
        }
      });
    });
};

// Function call to initialise the app
init();

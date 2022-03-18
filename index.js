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
      db.query(sql, answer.departmentName, (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('Added the department successfully');
          init();
        }
      });
    });
};

const addRole = () => {
  updateDepartmentArr();
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        choices: departmentArr,
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
      db.query(sql, [[answers.roleName, answers.roleSalary, answers.roleDepartment]], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added the role successfully');

          init();
        }
      });
    });
};

// Empty array to be populated with the different departments, to then be used as the choices for the list inquirer prompt
const departmentArr = [];

// A function to update the department array, called when the user wants to add a new role.
const updateDepartmentArr = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.forEach((department) => {
        let departmentObj = {
          name: department.name,
          value: department.id,
        };
        departmentArr.push(departmentObj);
      });
    }
  });
};

const addEmployee = () => {
  updateRolesArr();
  updateManagerArr();

  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeFirstName',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'employeeLastName',
        message: "What is the employee's last name?",
      },
      {
        type: 'list',
        name: 'employeeRole',
        message: "What is the employee's role?",
        choices: rolesArr,
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: "Who is the employee's manager?",
        choices: managerArr,
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
      db.query(sql, [[answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager]], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added the employee successfully');
          init();
        }
      });
    });
};

// Empty array to be populated with the different roles, to then be used as the choices for the list inquirer prompt
const rolesArr = [];

const updateRolesArr = () => {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.forEach((role) => {
        let roleObj = {
          name: role.title,
          value: role.id,
        };
        rolesArr.push(roleObj);
      });
    }
  });
};

// Empty array to be populated with the different managers, to then be used as the choices for the list inquirer prompt
const managerArr = [];

const updateManagerArr = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.forEach((manager) => {
        let managerObj = {
          name: manager.first_name + ' ' + manager.last_name,
          value: manager.id,
        };
        managerArr.push(managerObj);
      });
    }
  });
};

const updateEmployeeRole = () => {
  updateRolesArr();
  updateManagerArr();
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeSelect',
        message: "Which employee's role do you want to update?",
        choices: managerArr,
      },
      {
        type: 'list',
        name: 'roleSelect',
        message: 'Which role do you want to assign the selected employee?',
        choices: rolesArr,
      },
    ])
    .then((answers) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      db.query(sql, [[answers.roleSelect], [answers.employeeSelect]], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated the employee's role successfully");
          init();
        }
      });
    });
};

// Function call to initialise the app
init();

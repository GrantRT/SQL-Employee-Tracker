# SQL-Employee-Tracker

## Introduction

A command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Technology used

- Javascript
- Node.js
- mySQL

## Instructions

Firstly make sure all dependencies are installed by typing `npm i` in the console.

Then to start the app, type `node index.js` in the console and follow the instructions.

## Summary

When the user runs the application they are given the following options:

- View all departments (The user is presented with a table showing department names and department ids)
- View all roles (The user is presented with a table showing the job title, role id, the department that role belongs to, and the salary for that role)
- View all employees (The user is presented with a table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to)
- Add a department (The user is prompted to enter the name of the department and that department is added to the database)
- Add a role (The user is prompted to enter the name, salary, and department for the role and that role is added to the database)
- Add an employee (The user is prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database)
- Update an employee's role (The user is prompted to select an employee to update and their new role and this information is updated in the database)

## Video demonstration

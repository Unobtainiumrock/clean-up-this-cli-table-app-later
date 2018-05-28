
const mysql = require('mysql');
const inquire = require('inquirer');
const { customerChoices, managerChoices, supervisorChoices } = require('./controllers/index');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  database: 'bamazon_DB',
  password: ''
})

connection.connect(((err) => {
  const { host, port, database } = connection.config;
  if (err) throw err;
  console.log(` Successfully connected to ${database} on ${host}:${port}!`);
  getUserType()
    .then((user) => {
      start(user.status);
    })
}))

function start(user) {
  if(user === 'CUSTOMER') {
    customerChoices();
  }

  if(user === 'MANAGER') {
    managerChoices();
  }

  if(user === 'SUPERVISOR') {
    supervisorChoices();
  }
}

/**
 * @returns a promise object containing the authority of user as a string
 */
function getUserType() {
  return inquire
    .prompt({
      name: 'status',
      type: 'list',
      message: 'Plese indicate your level of authority',
      choices: ['CUSTOMER','MANAGER','SUPERVISOR']
    })
}

function displayInventory() {
  connection.query('SELECT * FROM products', (err) => {
    if (err) throw err;
  })
}
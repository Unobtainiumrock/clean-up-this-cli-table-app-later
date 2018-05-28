
const mysql = require('mysql');
const inquire = require('inquirer');
const { /*customerChoices,*/ managerChoices, supervisorChoices } = require('./controllers/index');
const { customerView } = require('./views/index');

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
      start(user.status,connection);
    })
}))

function start(user,connection) {
  if(user === 'CUSTOMER') {
    customerChoices(connection);
  }

  if(user === 'MANAGER') {
    managerChoices();
  }

  if(user === 'SUPERVISOR') {
    supervisorChoices();
  }
}

const customerChoices = () => {
  console.log('Getting Customer Choices..')
  // Request something fromt the DB and pass it to view
  connection.query('SELECT * FROM products',(err,res) => console.log(res));
  customerView();
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
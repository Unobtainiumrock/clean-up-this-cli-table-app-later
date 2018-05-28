
// const mysql = require('mysql');
const MySQL = require('./db/promisify-mysql');
const inquire = require('inquirer');
const { /*customerChoices,*/ managerChoices, supervisorChoices } = require('./controllers/index');
const { customerView } = require('./views/index');

const connection = new MySQL({
  host: 'localhost',
  port: '3306',
  user: 'root',
  database: 'bamazon_DB',
  password: ''
})


  getUserType()
    .then((user) => {
      start(user.status,connection);
    })


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
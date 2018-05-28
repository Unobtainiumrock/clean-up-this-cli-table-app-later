
const MySQL = require('./db/promisify-mysql');
const inquire = require('inquirer');
const { /*customerChoices,*/ managerChoices, supervisorChoices } = require('./controllers/index');
// const { customerView } = require('./views/index');

const connection = new MySQL({
  host: 'localhost',
  port: '3306',
  user: 'root',
  database: 'bamazon_DB',
  password: ''
});

(async () => {
  let userAuthority = await getUserType();
  start(userAuthority.status);
})()

async function start(user) {
  if(user === 'CUSTOMER') {
    let query = await customerChoices();
    query = parseInt(query.userChoice);
    console.log(query,'====');
    connection.query('SELECT * FROM products WHERE ?',{ item_ID: query },(err,res) => {
      console.log(res);
    })
  }

  if(user === 'MANAGER') {
    managerChoices();
  }

  if(user === 'SUPERVISOR') {
    supervisorChoices();
  }
}

// const customerChoices = () => {
//   console.log('Getting Customer Choices..')
//   // Request something fromt the DB and pass it to view
//   connection.query('SELECT * FROM products',(err,res) => console.log(res));
//   customerView();
// }

const customerChoices = () => {
  return inquire
    .prompt({
      name: 'userChoice',
      type: 'input',
      message: 'What is the ID of the item you would like to purchase? [Quit with Q]'
    })
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
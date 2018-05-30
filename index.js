
const MySQL = require('./db/promisify-mysql');
const inquire = require('inquirer');
const { customerChoices, managerChoices, supervisorChoices } = require('./controllers/index');
const { customerView, managerView, supervisorView } = require('./views/index');

const connection = new MySQL({
  host: 'localhost',
  port: '3306',
  user: 'root',
  database: 'bamazon_DB',
  password: ''
});

//Starts the Application by grabbing the user's level of authority
(async () => {
  let userAuthority = await getUserType();
  start(userAuthority.status);
})()


//Core logic for app flow. Checks the user's authority and calls the respective functions
async function start(user) {
  if(user === 'CUSTOMER') {

  // Show the inventory to the user
  try {
    const inventory = await connection.query('SELECT * FROM products');
      customerView(inventory);
  } catch (err) {
    console.error(`Failed to grab store inventory:${err}`);
  }

  // Grab the user's shopping choice
    let item_ID = await customerChoices();
    item_ID = parseInt(item_ID.userChoice);

    try {
    // Modify inventory amount UPDATE
      const rows = await connection.query('SELECT * FROM products WHERE ?',{ item_ID });
      console.log(rows);
    } catch (err) {
      console.error(`Failed to grab item:${err}`);
    }
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

// const customerChoices = () => {
//   return inquire
//     .prompt({
//       name: 'userChoice',
//       type: 'input',
//       message: 'What is the ID of the item you would like to purchase? [Quit with Q]'
//     })
// }

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

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

  if (user === 'CUSTOMER') {
    // Show the inventory to the user
    await display(customerView);
    // User make a selection
    const choices = await grabChoices(customerChoices);
    // Check if the user wished to quit
    for (let key in choices) {
      if(choices[key].toUpperCase() === 'Q') {
        console.log('Good bye!');
        connection.end();
        return;
      }
    }
    // Execute purchase
    await makePurchase(choices);
    // Start over
      start(user);
  }

  if (user === 'MANAGER') {
    // Show the
    managerChoices();
  }

  if (user === 'SUPERVISOR') {
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
      choices: ['CUSTOMER', 'MANAGER', 'SUPERVISOR']
    })
}

/**
 * @param  {Function} cb is a "views" callback: customer, manager, or supervisor
 */
async function display(cb) {
  try {
    const inventory = await connection.query('SELECT * FROM products');
    cb(inventory);
  } catch (err) {
    console.error(`Failed to grab store inventory:${err}`);
  }
}

/**
 * Makes a purchase from the inventory
 */
async function makePurchase(choices) {

  // Grab the user's shopping choices
  const { item_ID, qty } = choices;

  try {
    // Modify inventory amount
    const rows = await connection.query('SELECT * FROM products WHERE ?', { item_ID });
    //If there's enough in stock
    if (qty <= rows[0].stock_quantity) {
      connection.query('UPDATE products SET ? WHERE ?', [
        {
          stock_quantity: rows[0].stock_quantity - parseInt(qty)
        },
        { item_ID }
      ])
      console.log(`Successfully purchased ${qty} ${rows[0].product_name}`);

    } else {
      console.log('Cannot complete this purchase. There are not enough in stock');
    }

  } catch (err) {
    console.error(`Failed to grab item:${err}`);
  }
}

/**
 * @param  {Function} cb is a "choices" callback: customer, manager, or supervisor
 * @returns and object with the resulting user choices
 */
async function grabChoices(cb) {
  const userChoices = await cb();
  console.log(userChoices);
  return userChoices;
}
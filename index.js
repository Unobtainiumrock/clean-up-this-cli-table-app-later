
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

    // Show the inventory to the user READ
    await showInventory();
    // Make a purchase
    await makePurchase();
    start(user);
  }

  if (user === 'MANAGER') {
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

// Read
async function showInventory() {
  try {
    const inventory = await connection.query('SELECT * FROM products');
    customerView(inventory);
  } catch (err) {
    console.error(`Failed to grab store inventory:${err}`);
  }
}

// Update
async function makePurchase() {

  // Grab the user's shopping choices
  const { item_ID, qty } = await grabChoices(customerChoices);

  try {
    // Modify inventory amount -UPDATE
    const rows = await connection.query('SELECT * FROM products WHERE ?', { item_ID });
    //If there's enough in stock
    if (qty <= rows[0].stock_quantity) {
      connection.query('UPDATE products SET ? WHERE ?', [
        {
          stock_quantity: rows[0].stock_quantity - qty
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
  const item_ID = parseInt(userChoices.item_ID);
  const qty = parseInt(userChoices.qty);
  return {
    item_ID,
    qty
  }
}
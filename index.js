
const MySQL = require('./db/promisify-mysql');
const inquire = require('inquirer');
const listController = require('./list-controller');
const makeTable = require('./make-table');
const { customerPrompts, managerPrompts, supervisorPrompts } = require('./prompts/index');

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
    await display(makeTable,'SELECT * FROM products ORDER BY department_name, product_name');
    // User make a selection.
    const choices = await grabChoices(user,listController, customerPrompts());
    // Check if the user wished to quit and quit if asked. Pulled this from the demo giphy
    for (let key in choices) {
      if (choices[key].toUpperCase() === 'Q') {
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
    let choices;
    try {
      // Manager makes a selection
      choices = await grabChoices(user,listController,managerPrompts());

      const { managerChoice } = choices;

      if (managerChoice === 'View products for sale') {
        // show inventory to manager
        await display(makeTable,'SELECT * FROM products ORDER BY department_name, product_name');
        start(user);
      }
      if (managerChoice === 'View low inventory') {
        // Display low inventory
       await display(makeTable,'SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name, product_name');
       start(user);
      }
      if (managerChoice === 'Add to inventory') {
        //Add to inventory
        await grabChoices(listController,)
      }
      // if (managerChoice === 'Add new product') {

      // }
      if (managerChoice === 'Quit') {
        console.log('Good bye!');
        connection.end();
      }
    } catch(err) {
      console.error(err);
    }
    
  }

  // if (user === 'SUPERVISOR') {
  //   supervisorChoices();
  // }
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
 * @param  {Function} cb is a callback use to create tables
 * @param {string} str is a query string 
 */
async function display(cb,str) {
  try {
    const inventory = await connection.query(str);
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
          stock_quantity: rows[0].stock_quantity - parseInt(qty),
          // product_sales: row[0].product_sales + 
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

// async function viewLowInventory() {
//   try {

//   }
// }

// async function addToInventory() {

// }

/**
 * @param  {Function} cb is a callback grabbing user choices
 * @param {Array} prompts is an array 
 * @returns and object with the resulting user choices
 */
async function grabChoices(user,cb, prompts) {
  const userChoices = await cb(user,prompts);
  return userChoices;
}

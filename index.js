
const MySQL = require('./db/promisify-mysql');
const inquire = require('inquirer');
const { makeTable, inquireController } = require('./helper-functions-and-classes/index');
const { customerPrompts, managerPrompts, supervisorPrompts, inventoryPrompts } = require('./prompts/index');

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
    await display(makeTable, 'SELECT * FROM products ORDER BY department_name, product_name');
    // User make a selection.
    const choices = await grabChoices(user, inquireController, customerPrompts());
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
      choices = await grabChoices(user, inquireController, managerPrompts());

      const { managerChoice } = choices;

      if (managerChoice === 'View products for sale') {
        // show inventory to manager
        await display(makeTable, 'SELECT * FROM products ORDER BY department_name, product_name');
        start(user);
      }
      if (managerChoice === 'View low inventory') {
        // Display low inventory
        await display(makeTable, 'SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name, product_name');
        start(user);
      }
      if (managerChoice === 'Add to inventory') {
        //Add to inventory
        let inventoryArgs = await connection.query('SELECT * FROM products');
        inventoryArgs = inventoryArgs.map(val => val.product_name);

        const { product_name } = await grabChoices(user, inquireController, inventoryPrompts(inventoryArgs));

        const { amt } = await inquire.prompt({
          name: 'amt',
          type: 'input',
          message: 'how many?',
          validate: val => {
            if (isNaN(val) === false) {
              return true;
            }
            console.log('  Provide a number!');
            return false;
          }
        });

        const targets = await connection.query('SELECT * FROM products WHERE ?', { product_name });
        await connection.query('UPDATE products SET ? WHERE ? ', [
          { stock_quantity: parseInt(amt) + parseInt(targets[0].stock_quantity) },
          { product_name }
        ])
        start(user);
      }
      if (managerChoice === 'Add new product') {
        let { product_name, department_name, price, stock_quantity } = await inquire.prompt([
          {
            name: 'product_name',
            type: 'input',
            message: 'What is the product?',
          },
          {
            name: 'department_name',
            type: 'input',
            message: 'What department will this belong to?'
          },
          {
            name: 'price',
            type: 'input',
            message: 'How much does this item cost?',
            validate: val => {
              if(isNaN(val) === false) {
                return true;
              }
              return false;
            }
          },
          {
            name: 'stock_quantity',
            type: 'input',
            message: 'How many would you like to put in stock?',
            validate: val => {
              if(isNaN(val) === false) {
                return true;
              }
              return false;
            }
          }

        ])
        price = parseInt(price);
        stock_quantity = parseInt(stock_quantity);
        console.log(product_name,department_name,typeof price, typeof stock_quantity);
      }
      if (managerChoice === 'Quit') {
        console.log('Good bye!');
        connection.end();
      }
    } catch (err) {
      console.error(err);
    }

  }

  if (user === 'SUPERVISOR') {
    // supervisorChoices();
    console.log('Sorry, supervisor is not currently accessible to you. Good Bye!');
    connection.end();
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
 * @param  {Function} cb is a callback use to create tables
 * @param {string} str is a query string 
 */
async function display(cb, str) {
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
async function grabChoices(user, cb, prompts) {
  const userChoices = await cb(user, prompts);
  return userChoices;
}

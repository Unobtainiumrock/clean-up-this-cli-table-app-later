
const { customerView } = require('../views/index');
const inquire = require('inquirer');

const customerChoices = async () => {
  return inquire
    .prompt([
      {
        name: 'item_ID',
        type: 'input',
        message: 'What is the ID of the item you would like to purchase? [Quit with Q]',
      },
      {
        name: 'qty',
        type: 'input',
        message: 'How many would you like? [Quit with Q]',
      }
    ])
}

module.exports = customerChoices;


const { customerView } = require('../views/index');
const inquire = require('inquirer');

const customerChoices = () => {
  return inquire
    .prompt([
      {
        name: 'item_ID',
        type: 'input',
        message: 'What is the ID of the item you would like to purchase? [Quit with Q]',
        validate: val => {
          if (isNaN(val) === false) {
            return true;
          }
          console.log('   Provide a number');
          return false;
        }
      },
      {
        name: 'qty',
        type: 'input',
        message: 'How many would you like?',
        validate: val => {
          if (isNaN(val) === false) {
            return true;
          }
          console.log('   Provide a number');
          return false;
        }
      }
    ])
}

module.exports = customerChoices;


const { customerView } = require('../views/index');
const inquire = require('inquirer');

const customerChoices = () => {
  return inquire
    .prompt({
      name: 'userChoice',
      type: 'input',
      message: 'What is the ID of the item you would like to purchase? [Quit with Q]',
    })
}

module.exports = customerChoices;

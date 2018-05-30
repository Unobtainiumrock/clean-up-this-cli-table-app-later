
const { customerView } = require('../views/index');
const inquire = require('inquirer');

const customerChoices = async () => {

  const choiceOne = await inquire.prompt({
    name: 'item_ID',
    type: 'input',
    message: 'What is the ID of the item you would like to purcahse? [Quit with Q]'
  })

  if(choiceOne.item_ID.toUpperCase() === 'Q') {
    return new Promise(resolve => {
      resolve({ ans: 'Q'});
    })
  } else {
    const choiceTwo = await inquire.prompt({
      name: 'qty',
      type: 'input',
      message: 'How many would you like? [Quit with Q]'
    })
    if (choiceTwo.qty.toUpperCase() === 'Q') {
      return new Promise(resolve => {
        resolve({ans: 'Q'})
      });
    } else {
      return new Promise(resolve => {
        resolve(choiceTwo);
      });
    }

  }

}

module.exports = customerChoices;

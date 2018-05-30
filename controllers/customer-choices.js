
const { customerView } = require('../views/index');
const inquire = require('inquirer');
const Prompt = require('../helper-functions-and-classes/prompt');



// This is going to be transformed from customerChoices into JUST CHOICES
// Rather than hard coding choice 1, choice 2, so on and so forth. It will change this
// function  so that..
// it will take information as an array of prompts, and then go through
// each prompt and store the awaited result of a prompt on each of them
// Will most likely use the map to achieve this. It will also copy the current
// logic which is set up to break the chain of prompts of the user wishes to quit at any point
// The GOAL here is to have a single function which handles choices, and then replicate the same logic into
// something modular for generating the user's views.

// Contollers foler will contain a singular choices function
// Views folder will contain a singular vews function
// Not there yet...

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
      message: 'How many would you like? [Quit with Q]',
      validate: val => {
        if (isNaN(val) === false) {
          return true;
        } else if (val.toUpperCase === 'Q') {
          return true;
        }
        return false;
      }
    })
    if (choiceTwo.qty.toUpperCase() === 'Q') {
      return new Promise(resolve => {
        resolve({ans: 'Q'})
      });
    } else {

      return new Promise(resolve => {
        resolve({

        });
      });
    }

  }

}

module.exports = customerChoices;

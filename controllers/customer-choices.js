
const { customerView } = require('../views/index');
const inquire = require('inquirer');
const Prompt = require('../helper-functions-and-classes/prompt');



// This is going to be transformed from customerChoices into JUST CHOICES
// Rather than hard coding choice 1, choice 2, so on and so forth. It will change this
// function  so that..
// it will take information as an array of prompts, and then go through
// each prompt and store the awaited result of a prompt on each of them. 
// Will most likely use map or reduce achieve this, since you have a way to track previous results.
//  It will also copy the current
// logic which is set up to break the chain of prompts of the user wishes to quit at any point
// The GOAL here is to have a single function which handles choices, and then replicate the same logic into
// something modular for generating the user's views.

// The modular code would look something like...

// takes in a properly corresponding prompts array from some other file
// const storedResults = questions.reduce((mem,question) => {
//   // have a check for if the previous value concatenated was a Q. If so, break out of this and
//   // return a
//   let ans = await inquire.prompt(question);
//   return mem.concat(ans);
// },[])


// Contollers foler will contain a singular choices function
// Views folder will contain a singular vews function
// Not there yet...

const customerChoices = async (questions) => {

  // It is currently a mystery (what Object  has that my class doesn't),
  // but I assumed instances of my class weren't working, because
  // instances of Javascript's native Object has a property which plays nicely with how 
  // npm inquirer works. I was getting errors, so I used Object.assign with an instance
  // of the native Object and an instance of my custom Class to give my class properties to 
  // play well with inquirer.

  // Pattern is here...
  // PROMPT
  const promptOne = Object.assign(new Object, new Prompt(
    'item_ID',
    'input',
    'What is the ID of the item you would like to purchase? [Quit with Q]'
  ));
  // CHOICE
  const choiceOne = await inquire.prompt(promptOne);
  //EXIT
  if (choiceOne.item_ID.toUpperCase() === 'Q') {
    return new Promise(resolve => {
      resolve({ ans: 'Q' });
    })
  } else {
  // CONTINUE PROMPT
    const promptTwo = Object.assign(new Object, new Prompt(
      'qty',
      'input',
      'How many would you like? [Quit with Q]'
    ))
    // CHOICE
    const choiceTwo = await inquire.prompt(promptTwo);
    // EXIT
    if (choiceTwo.qty.toUpperCase() === 'Q') {
      return new Promise(resolve => {
        resolve({ ans: 'Q' })
      });
    } else {
      // CONTINUE END OF PROMPTS
      return new Promise(resolve => {
        resolve({
          item_ID: choiceOne.item_ID,
          qty: choiceTwo.qty
        });
      });
    }

  }

}

module.exports = customerChoices;

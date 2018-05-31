
const inquire = require('inquirer');
const { ManagerPrompt, Prompt } = require('./helper-functions-and-classes/index');

/**
 * @param  {Array} prompts is an array of arrays containing the prompt values.
 *                 it is set  up like this so that we can .apply our prompts to new instances of
 *                 the prompt class.
 * @returns a promise object that contains the item_ID and quantity of the item being purchased
 */
const inputController = async (user, prompts) => {
  const answers = {};
  // Iterate the prompts and go through each one, unless Q is submitted, and modify
  // our answers object to contain the user's choices
  for (let i = 0; i < prompts.length; i++) {
    let userChoice, currentPrompt;

    if (user === "MANAGER") {
      currentPrompt = Object.assign(
        new Object,
        new (Function.prototype.bind.apply(ManagerPrompt, prompts[i]))
      )
    } else if (user === "CUSTOMER") {
      currentPrompt = Object.assign(
        new Object,
        new (Function.prototype.bind.apply(Prompt, prompts[i]))
      )
    } else {

    }

    try {
      userChoice = await inquire.prompt(currentPrompt);
    } catch (err) {
      console.error(err)
    }

    const key = Object.keys(userChoice)[0];
    const val = userChoice[key];
    
    if (val.toUpperCase() === 'Q') {
      answers['ans'] = 'Q';
      break;
    } else {
      answers[key] = val;
    }
  }

  return new Promise(resolve => {
    resolve(answers);
  })

}

module.exports = inputController;

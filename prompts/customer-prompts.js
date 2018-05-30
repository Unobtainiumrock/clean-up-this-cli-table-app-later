
const Prompt = require('../helper-functions-and-classes/prompt');

const customerPrompts = () => {
  return [
    [null,'item_ID','input','What is the ID of the item you would like to purchase? [Quit with Q]'],
    [null,'qty','input','How many would you like? [Quit with Q]']
  ];
}

module.exports = customerPrompts;

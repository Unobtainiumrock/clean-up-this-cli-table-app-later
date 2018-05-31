
const Prompt = require('../helper-functions-and-classes/prompt');

const managerPrompts = () => {
  return [
    // Prompt 1
    [
      null,
      'managerChoice',
      'list',
      'What would you like to do? [Quit with Q] ',
      [
        'View products for sale',
        'View low inventory',
        'Add to inventory',
        'Add new product',
        'Quit'
      ]
    ]    
  ]
}

module.exports = managerPrompts;

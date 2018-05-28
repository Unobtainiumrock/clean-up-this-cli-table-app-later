
const { customerView } = require('../views/index');

const customerChoices = () => {
  console.log('Getting Customer Choices..')
  // Request something fromt the DB and pass it to view
  customerView();
}

module.exports = customerChoices;

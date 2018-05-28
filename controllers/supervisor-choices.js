
const { supervisorView } = require('../views/index');

const supervisorChoices = () => {
  console.log('Getting supervisor Choices..');
  // Request something from the DB and pass it to view
  supervisorView();
}

module.exports = supervisorChoices;

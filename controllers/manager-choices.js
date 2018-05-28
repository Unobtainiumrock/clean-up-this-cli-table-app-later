
const { managerView } = require('../views/index');

const managerChoices = () => {
  console.log('Getting manager Choices..')
  // Request something from the DB and pass it to view
  managerView();
}

module.exports = managerChoices;

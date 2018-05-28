
const { customerView } = require('../views/index');

const customerChoices = () => {
  console.log('Getting Customer Choices..')
  // Request something fromt the DB and pass it to view
  connection.query('SELECT * FROM products',(err,res) => console.log(res));
  customerView();
}

module.exports = customerChoices;

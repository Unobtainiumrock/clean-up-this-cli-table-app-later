
const Table = require('cli-table2');

const customerView = (inventory) => {
  const table = new Table({
    head: ['ID','Product','Department','Price','Stock'],
    colWidths: [10,40,20,15,15]
  });
  inventory.forEach(e => {
    table.push([e.item_ID,e.product_name,e.department_name,e.price,e.stock_quantity]);
  })
  console.log(table.toString());
  // console.log(inventory);
}

module.exports = customerView ;
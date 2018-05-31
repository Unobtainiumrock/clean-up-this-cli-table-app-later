
const inventoryPrompts = (inventoryArgs) => {
  console.log(inventoryArgs, '=======');
  return [
    [
      null,
      'product_name',
      'list',
      'What item would you like to restock?',
      inventoryArgs
    ]
  ]
}

module.exports = inventoryPrompts;
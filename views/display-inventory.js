
function displayInventory() {
  connection.query('SELECT * FROM products', (err) => {
    if (err) throw err;
  })
}

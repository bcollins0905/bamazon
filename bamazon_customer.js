var mysql = require('mysql')
var inquirer = require('inquirer')
var Table = require('cli-table')


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  myTable()


});

//--------Pushing database to CLI_table----------------------------------------//
function myTable(){

  connection.query('SELECT * FROM products', function(err, result){
  if(err) console.log(err);

    var table = new Table({
    head: ['Item Id#', 'Product Name', 'Department', 'Price', 'Quantity'],
    style: {
    head: ['blue'],
    compact: false,
    colAligns: ['center'],
    }
  });

  for(var i = 0; i < result.length; i++){
    table.push(
      [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
        );
      }
      console.log(table.toString());
      idPromptSearch(result)
    })
}


//----------------------Creating Prompts-----------------------------------------------
  function idPromptSearch(inventory, inStock) {
  inquirer
    .prompt([
    {    
      name: "id",
      type: "input",
      message: "What is the ID of the product you would like to buy?"
    },

    {
      name: "quantity",
      type: "input",
      message: "How many units would you like to buy?"
    }
  ])  
    
    .then(function(val, stock, inStock, myTable) {
      
      var userChoice = parseInt(val.id)
      var matchedProduct = checkInventory(userChoice, inventory)
      var desiredQuantity = parseInt(val.quantity)
      if (desiredQuantity <= matchedProduct.stock_quantity)
        console.log("Thank you for your purchase")
        console.log("Your total is $"+ matchedProduct.price * desiredQuantity)
        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (matchedProduct.stock_quantity - desiredQuantity) + ' WHERE item_id = ' + val.id;

        connection.query(updateQueryStr, function(err, data) {
        if (err) throw err;
        })
      })
    } 


function checkInventory(userChoice, inventory){
    for (var i = 0; i < inventory.length; i++) {   
    if(inventory[i].item_id === userChoice){
      return inventory[i]
          }
        }
      return null
  }



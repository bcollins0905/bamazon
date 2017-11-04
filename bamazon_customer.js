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
      // stockPromptSearch()
    })
}


//----------------------Creating Prompts-----------------------------------------------

  function idPromptSearch(inventory) {
  inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "What is the ID of the product you would like to buy?"
    })

    .then(function(val) {
      console.log(val.id)
      var userChoice = parseInt(val.id)
      var matchedProduct = checkInventory(userChoice, inventory)
      console.log(matchedProduct)
      })

  function checkInventory(userChoice, inventory){
    for (var i = 0; i < inventory.length; i++) {   
    if(inventory[i].item_id === userChoice){
      return inventory[i]
          }
        }
      return null
  }
}

//   function stockPromptSearch(){
//   inquirer
//     .prompt({
//       name: "quantity",
//       type: "input",
//       message: "How many units would you like to purchase?"
//     })
    
//     .then(function(val) {
//       console.log(val.quantity)
//       var chosenQty = parseInt(val.quantity)
//       var matchedQuantity = checkQuantity(chosenQty, stock)
//       console.log(matchedQuantity)
//     })  
// }

//   function checkQuantity(chosenQty, stock){
//     for (var i = 0; i < inventory.length; i++) {
//     if(inventory[i].stock_quantity >= userChoice){
//       console.log("Your purchase is complete")
//         }
//       }
//     } 

 
 
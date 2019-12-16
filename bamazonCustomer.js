//Required Packages

const mysql = require("mysql");
const inquirer = require("inquirer");


//mysql Connection

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "wstinol",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    bamazon();
});

function bamazon() {

    console.log("Welcome to Bamazon!")



    // Build Department Dataset

    connection.query("SELECT DISTINCT department_name FROM bamazon_db.products;", function (err, results) {



        const departments = [];

        for (let i = 0; i < results.length; i++) {
            departments.push(results[i].department_name);
        };


        // Prompt for Department and Sort Method

        inquirer.prompt([

                {
                    name: "department",
                    type: "list",
                    message: "Which deprtment would you like to buy from?",
                    choices: departments,
                },
                {
                    name: "sort",
                    type: "list",
                    message: "How would you like results sorted?",
                    choices: ["By Product Name", "By Price", "By Availability"],
                    values: ["product_name", "price", "stock_quantity"],
                },

            ])
            .then(function (answer) {


                // Build Available Product Dataset

                var query = "SELECT product_name, price, stock_quantity, item_id FROM bamazon_db.products WHERE department_name = ? && stock_quantity > 0  ORDER BY ?"
                connection.query(query, [answer.department, answer.sort], function (err, res) {

                    if (err) throw err;

                    const products = [];
                    const item_ids = [];

                    for (let i = 0; i < res.length; i++) {
                        products.push(res[i].product_name + " --- Price: $" + res[i].price + " Stock: " + res[i].stock_quantity + " *** Item ID: " + res[i].item_id + " ***");
                        item_ids.push(res[i].item_id);
                    };

                    console.log("Here are the available products");

                    for (let i = 0; i < products.length; i++) {
                        let printProduct = products[i];
                        console.log(printProduct);
                    };





                    // Prompt for Product


                    //*******Was having trouble getting ID's to hold value on backend while also displaying names pretty*************

                    //inquirer.prompt([

                    //{
                    //name: "product",
                    //type: "list",
                    //message: "Which product would you like to buy?",
                    //choices: products,
                    //values: item_ids

                    //},

                    //]).then(function (answer){

                    // console.log(answer.product);
                    //console.log(answer.product.value);
                    //console.log(answer.product.values);

                    //});


                    //Prompt for Product ID

                    inquirer.prompt([

                        {
                            name: "item_id",
                            type: "list",
                            message: "Which product would you like to buy? (Pick the Item ID)",
                            choices: item_ids,

                        },
                        {
                            name: "quantity",
                            type: "number",
                            message: "How many would you like to order?",

                        },

                    ]).then(function (answer) {

                        var query = "SELECT stock_quantity FROM bamazon_db.products WHERE item_id = ?"
                        connection.query(query, [answer.item_id], function (err, res) {

                            if (err) throw err;

                            if (answer.quantity > res[0].stock_quantity) {
                                console.log("Insufficent Inventory! You have requested " + answer.quantity + " units, but only " + res[0].stock_quantity + " are in stock.")
                                console.log("Please re-try your order");
                            } else {

                                // Update SQL
                                var new_quantity = res[0].stock_quantity - answer.quantity ; 
                                var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
                                connection.query(query, [new_quantity, answer.item_id], function (err, res) {
                                    if (err) throw err;
                               
                                });

                                // Give Customer Receipt
                                var query = "SELECT * FROM bamazon_db.products WHERE item_id = ?"
                                connection.query(query, [answer.item_id], function (err, res) {
                                    if (err) throw err;

                                    total = answer.quantity * res[0].price;
                                
                                    console.log("Thank you for purchasing " + answer.quantity + " units of " + res[0].product_name + ".");
                                    console.log("Inventory has been updated to " + res[0].stock_quantity + ".");
                                    console.log("Your total is $" + total);



                                });



                            }






                        });






                    });
                });

            });
    });

};
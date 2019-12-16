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


    console.log("******************************************************************************************************************************");
    console.log("Welcome, Boss.")

    inquirer.prompt([

            {
                name: "action",
                type: "list",
                message: "What would you like to do next?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            },


        ])
        .then(function (answer) {

            switch (answer.action) {
                case "View Products for Sale":
                    viewProductsForSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

            };



        });

}


function viewProductsForSale() {

    var query = "SELECT * FROM bamazon_db.products WHERE stock_quantity > 0  ORDER BY item_id"
    connection.query(query, function (err, res) {

        if (err) throw err;

        console.log("Here are the available products");

        console.log("******************************************************************************************************************************");

        for (let i = 0; i < res.length; i++) {
            console.log(" *** Item ID: " + res[i].item_id + " *** Stock: " + res[i].stock_quantity + " --- Price: $" + res[i].price + "--- Product: " + res[i].product_name );
        };

        bamazon();

    });

}

function viewLowInventory() {

    var query = "SELECT * FROM bamazon_db.products WHERE stock_quantity < 5  ORDER BY item_id"
    connection.query(query, function (err, res) {

        if (err) throw err;

        if (res.length === 0){

            console.log("No Low Inventory")
        }
        else{

        
        console.log("Here are the Low Inventory Poducts");
        console.log("******************************************************************************************************************************");

        for (let i = 0; i < res.length; i++) {
            console.log(" *** Item ID: " + res[i].item_id + " *** Stock: " + res[i].stock_quantity + " --- Price: $" + res[i].price + "--- Product: " + res[i].product_name );
        };  

    }

    bamazon();

    });


}

function addToInventory() {

    inquirer.prompt([

        
        {
            name: "item_id",
            type: "number",
            message: "Enter the Item ID",

        },
        {
            name: "stock_quantity",
            type: "number",
            message: "Enter the Stock Quantity (Inventory)",

        },


    ]).then(function (answer) {



        var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
        connection.query(query, [answer.stock_quantity, answer.item_id ], function (err, res) {

            if (err) throw err;

            console.log("Inventory has been added");

            bamazon();

        });
    });

}

function addNewProduct() {

    inquirer.prompt([

            {
                name: "product_name",
                type: "input",
                message: "Enter the Product Name",

            },
            {
                name: "department_name",
                type: "input",
                message: "Enter the Department Name",

            },
            {
                name: "price",
                type: "decimal",
                message: "Enter the Price",

            },
            {
                name: "stock_quantity",
                type: "number",
                message: "Enter the Stock Quantity (Inventory)",

            },


        ])
        .then(function (answer) {


            var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)"
            connection.query(query, [answer.product_name, answer.department_name, answer.price, answer.stock_quantity], function (err, res) {

                if (err) throw err;

                console.log("New Item Added to Inventory");

                bamazon();

            });


        });


}
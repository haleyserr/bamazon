DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT
    , product_name VARCHAR(250)
    , department_name VARCHAR(100)
    , price DECIMAL(10,2)
    , stock_quantity INTEGER(10)
    , PRIMARY KEY(item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 

("Milk", "Grocery", 2.50, 100)
,("Eggs", "Grocery", 1.50, 200)
,("Bread", "Grocery", 2.00, 50)

,("Knome", "Garden", 5.00, 100)
,("Mushroom House", "Garden", 50.00, 50)
,("Shears", "Garden", 3.50, 25)

,("iPad", "Electronics", 250.00, 75)
,("Wii", "Electronics", 300.00, 100)
,("Alexis", "Electronics", 150.00, 50);
# <Your-Project-Title>

## Description

Basic backend of an ecommerce sight with products, product categories, and product tags.


## Installation
Start by logging into postgres and running "\i db/schema.sql" in the terminal. Then run "npm i" in the terminal. Then run "node seeds/index.js" in the terminal. Finally initialize the server with "node server.js" in the terminal.

## Usage

You can use insomnia or postman to run the different request routes. Use the following json format to test.

{
    “product_name”: “Leg Warmers”,
    “price”: 6.99,
    “stock”: 50,
    “category_id”: 3,
}

{
“category_name”: “Leg Warmers”
}

{
“tag_name”: “Fuzzy”
}

    ![Demo Video](https://drive.google.com/file/d/130_bpu4o1f0uk1MO1xyiIff-XUt_8Wwd/view)
    

## License

MIT


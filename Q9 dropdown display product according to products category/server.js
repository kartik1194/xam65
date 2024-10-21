const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Middleware to serve static files (for the HTML page)
app.use(express.static(path.join(__dirname)));

// Path to the products.json file
const PRODUCTS_FILE_PATH = path.join(__dirname, 'products.json');

// Serve the HTML page at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get products by category
app.get('/GetProducts', (req, res) => {
    const category = req.query.category; // Get category from query parameters

    fs.readFile(PRODUCTS_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading products file.' });
        }

        const products = JSON.parse(data);
        const filteredProducts = products.filter(product => product.product_category === category);

        res.json({ success: true, products: filteredProducts });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

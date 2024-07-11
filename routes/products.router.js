const express = require('express');
const router = express.Router();


const products = []

//ruta traer products
router.get('/products', (req, res) => {
    res.json(products);
})

//post

router.post('/prducts', (req, res) => {
    const newProduct = req.body
    products.push(newProduct);
    res.status(201).json({ message: 'product added successfully' });
})

module.exports = router
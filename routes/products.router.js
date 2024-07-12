const express = require('express');
const ProductManager = require('../ProductManager');
const router = express.Router();

const productManager = new ProductManager('./products.json');

// Ruta para obtener todos los productos
router.get('/products', (req, res) => {
    const products = productManager.getProducts();

    // Aplicar el limit si se brinda
    const limit = req.query.limit;
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

// Ruta para obtener un producto por ID
router.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/products', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails.' });
    }

    const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [] // Establecer thumbnails como un array vacío si no se proporciona
    };

    const addedProduct = productManager.addProduct(newProduct);

    res.status(201).json(addedProduct);
});

// Ruta para actualizar un producto por ID
router.put('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    // Eliminar el campo id del objeto updatedFields si está presente
    if ('id' in updatedFields) {
        delete updatedFields.id;
    }

    const updatedProduct = productManager.updateProduct(productId, updatedFields);

    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar' });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const deletedProduct = productManager.deleteProduct(productId);
    if (deletedProduct) {
        res.json(deletedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado o no se pudo eliminar' });
    }
});

module.exports = router;

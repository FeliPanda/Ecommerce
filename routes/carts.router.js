const express = require('express');
const router = express.Router();
const CartManager = require('../cartManager');
const ProductManager = require('../productManager');

const cartManager = new CartManager('./carts.json');
const productManager = new ProductManager('./products.json');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    try {
        const newCart = cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para listar los productos de un carrito específico
router.get('/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = cartManager.getProductsByCartId(cartId);

        if (!products) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const detailedProducts = products.map(item => {
            const product = productManager.getProductById(item.product);
            return { ...product, quantity: item.quantity };
        });

        res.json(detailedProducts);
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/products/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = parseInt(req.params.pid);

        // Validar que el producto exista
        const product = productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser un número positivo.' });
        }

        const updatedCart = cartManager.addProductToCart(cartId, productId, quantity);
        if (updatedCart) {
            const updatedProduct = updatedCart.products.find(p => p.product === productId);
            const detailedProduct = {
                ...product,
                quantity: updatedProduct.quantity
            };
            res.json(detailedProduct);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;

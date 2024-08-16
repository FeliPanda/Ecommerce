import express from 'express';
import mongoose from 'mongoose';
import CartManager from '../cartManager.js';
import ProductManager from '../productManager.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Ruta para obtener todos los carritos
router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.render('carts', { carts });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para obtener un carrito específico por ID
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Renderizar la vista del carrito con los productos actualizados
        res.render('cartDetail', { cart });
        res.render('cartDetail', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para agregar un producto al carrito
router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid) || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Datos inválidos' });
    }

    try {
        let cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        product.stock -= quantity;
        await product.save();

        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        console.error('Error al añadir el producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para eliminar todos los carritos
router.delete('/carts', async (req, res) => {
    try {
        const result = await cartManager.deleteAllCarts(); // Ajusta el método si es necesario

        if (result.deletedCount > 0) {
            res.json({ message: 'Carrito(s) eliminado(s)' });
        } else {
            res.status(404).json({ message: 'No se encontraron carritos para eliminar' });
        }
    } catch (error) {
        console.error('Error al eliminar los carritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;

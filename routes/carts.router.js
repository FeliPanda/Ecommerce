import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/carts.model.js';
import Product from '../models/products.model.js';

const router = express.Router();

// Función para validar ObjectId de MongoDB
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Ruta para obtener todos los carritos
router.get('/carts', async (req, res) => {
    try {
        // Obtiene el valor del parámetro 'limit' de la consulta (query)
        const limit = parseInt(req.query.limit) || 0; // Si no se proporciona, el límite será 0 (sin límite)
        // Consulta los carritos con el límite especificado
        const carts = await Cart.find().populate('products.productId').limit(limit);
        // Calcula el total para cada carrito
        const cartsWithTotal = carts.map(cart => {
            const total = cart.products.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
            return { ...cart.toObject(), total };
        });
        // Renderiza la vista 'carts' con los carritos y sus totales
        res.render('carts', { carts: cartsWithTotal });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para obtener un carrito específico por ID
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        if (!isValidObjectId(cartId)) {
            return res.status(400).send('ID de carrito inválido');
        }

        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const total = cart.products.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);

        res.render('cartDetails', { cart, total });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para agregar un producto al carrito
// Ruta para agregar un producto al carrito
router.post('/carts/:pid', async (req, res) => {
    const { pid: productId } = req.params; // Obtiene el productId de los parámetros de la ruta
    const quantity = parseInt(req.body.quantity) || 1; // Obtiene la cantidad del cuerpo de la solicitud

    if (!isValidObjectId(productId)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
    }

    try {
        // Encuentra un carrito existente (si hay alguno)
        let cart = await Cart.findOne().exec();

        if (!cart) {
            // Si no hay carrito, crea uno nuevo
            cart = new Cart();
        }

        // Verifica si el producto existe y tiene stock suficiente
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        // Encuentra el producto en el carrito
        const productInCart = cart.products.find(p => p.productId.toString() === productId);

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        // Actualiza el stock del producto
        product.stock -= quantity;
        await product.save();

        // Guarda el carrito con el producto agregado
        await cart.save();
        res.json({ message: 'Producto agregado al carrito', cartId: cart._id });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
});


// Ruta para eliminar todos los carritos
router.delete('/carts', async (req, res) => {
    try {
        const result = await Cart.deleteMany();

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

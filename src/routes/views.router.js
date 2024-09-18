import express from 'express';
import ProductManager from '../productManager.js'; // Importar la clase
import { io } from '../app.js';
import { authenticateJWT } from '../middleware/auth.js';
import Cart from '../models/carts.model.js'; // Asegúrate de importar el modelo de Cart
import Product from '../models/products.model.js';
import User from '../models/user.model.js';

const router = express.Router();

const productManager = new ProductManager('./products.json');

router.get('/realtimeproducts', (req, res) => {
    // Usar la instancia productManager para llamar al método getProducts
    const products = productManager.getProducts();
    res.render('realtimeproducts', { products });
});

router.post('/realtimeproducts', (req, res) => {
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
        thumbnails: thumbnails || []
    };

    const addedProduct = productManager.addProduct(newProduct);

    // Emitir el evento de socket.io
    io.emit('newProduct', addedProduct);

    res.status(201).json({ message: 'Producto agregado correctamente.', product: addedProduct });
});

router.get('/login', (req, res) => {
    res.render('login', {
        registered: req.query.registered === 'true',
        email: req.query.email
    });
});

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        console.log('Accediendo a la ruta /profile');
        console.log('Usuario autenticado:', req.user);

        const userId = req.user.id;
        const user = await User.findById(userId);
        let cart = await Cart.findOne({ user: userId }).populate('products.productId');

        console.log('Usuario encontrado:', user);
        console.log('Carrito encontrado:', cart);

        res.render('profile', { user, cart });
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        res.status(500).render('error', { message: 'Error al cargar el perfil' });
    }
});

// Añade esta ruta si no existe
router.get('/register', (req, res) => {
    res.render('register');
});

export default router;

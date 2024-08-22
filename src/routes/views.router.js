import express from 'express';
import ProductManager from '../productManager.js'; // Importar la clase
import { io } from '../app.js';

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



export default router;

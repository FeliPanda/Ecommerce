import express from 'express';
import ProductManager from '../productManager.js';
import Product from '../models/products.model.js';
import { io } from '../app.js'; // Importar el servidor io

const router = express.Router();
const productManager = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = req.query.query ? JSON.parse(req.query.query) : {};
        const sort = req.query.sort === 'desc' ? -1 : 1;

        const products = await Product.find(query)
            .sort({ price: sort })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Construye el objeto de respuesta y pasa los datos a la vista
        res.render('index', {
            products,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?page=${page - 1}` : null,
            nextLink: page < totalPages ? `/products?page=${page + 1}` : null,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});




router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.render('productDetail', { product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener producto por ID' });
    }
});

router.post('/products', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails.' });
    }

    try {
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado correctamente.', product: addedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar producto' });
    }
});

router.put('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;

    if ('id' in updatedFields) {
        delete updatedFields.id;
    }

    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado correctamente.', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
});

router.delete('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json({ message: 'Producto eliminado correctamente.', product: deletedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado o no se pudo eliminar' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
});

export default router;

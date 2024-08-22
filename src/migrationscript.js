import fs from 'fs';
import mongoose from 'mongoose';
import Product from './models/products.model.js'; // Asegúrate de que la ruta es correcta

// Conectar a MongoDB
mongoose.connect('mongodb+srv://Felipanda:1jPwdOs2hhn3HbWD@cluster0.tpicd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    
}).then(() => {
    console.log('¡Conexión exitosa a MongoDB!');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});

// Leer productos desde el archivo
const filePath = './products.json'; // Asegúrate de que la ruta es correcta
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Guardar productos en MongoDB
async function migrateProducts() {
    try {
        await Product.insertMany(products);
        console.log('Productos migrados exitosamente!');
    } catch (error) {
        console.error('Error al migrar productos:', error);
    } finally {
        mongoose.connection.close();
    }
}

migrateProducts();

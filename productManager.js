import fs from 'fs';

class ProductManager {
    constructor(filepath) {
        this.path = filepath;
        this.initializeFile();
    }

    // Inicializar el archivo
    initializeFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    // Obtener el siguiente ID autoincrementable
    getNextId() {
        const products = this.getProductsFromFile();
        return products.length === 0 ? 1 : Math.max(...products.map(p => p.id)) + 1;
    }

    // Método para agregar productos
    addProduct({ title, description, price, thumbnails = [], code, stock, category }) {
        const products = this.getProductsFromFile();
        const newProduct = {
            id: this.getNextId(),
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status: true
        };

        products.push(newProduct);
        console.log('nuevo producto agregado:' + newProduct);
        this.saveProductsToFile(products);
        console.log('producto pusheado:' + products);
        return newProduct;
    }

    // Obtener todos los productos
    getProducts() {
        return this.getProductsFromFile();
    }

    // Obtener productos desde el archivo
    getProductsFromFile() {
        const jsonString = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(jsonString);
    }

    // Obtener producto por ID
    getProductById(id) {
        const products = this.getProductsFromFile();
        return products.find(product => product.id === id);
    }

    // Actualizar producto
    updateProduct(id, updatedFields) {
        const products = this.getProductsFromFile();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            Object.assign(products[index], updatedFields);
            this.saveProductsToFile(products);
            return products[index];
        }
        return null;
    }

    // Eliminar producto
    deleteProduct(id) {
        const products = this.getProductsFromFile();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = products.splice(index, 1)[0];
            this.saveProductsToFile(products);
            return deletedProduct;
        }
        return null;
    }

    // Guardar productos en el archivo
    saveProductsToFile(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
}

export default ProductManager;
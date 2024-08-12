import Product from './models/products.model.js'

class ProductManager {

    // Método para agregar productos
    async addProduct({ title, description, price, thumbnails = [], code, stock, category }) {
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
        try {
            const savedProduct = await newProduct.save();
            console.log('Nuevo producto agregado', savedProduct);
        } catch {
            console.error('no se puede agregar el producto', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            return await Product.find({});
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            return await Product.findOneAndUpdate(id, updatedFields, { new: true });
        } catch (error) {
            console.error('no se pudo actualizar el producto', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await Product.findOneAndDelete(id)
        } catch (error) {
            console.error(error);
        }
    }
}

export default ProductManager;
import Product from './models/products.model.js'

class ProductManager {

    // Método para agregar productos
    async addProduct({ title, description, price, thumbnails = [], code, stock, category }) {
        const newProduct = new Product({
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status: true
        });

        try {
            const savedProduct = await newProduct.save(); // Usa el modelo Product para guardar el nuevo producto
            console.log('Nuevo producto agregado', savedProduct);
            return savedProduct;
        } catch (error) {
            console.error('No se puede agregar el producto', error);
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

    async getProductById(productId) { // Cambiado a productId
        try {
            return await Product.findById(productId);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
        }
    }

    async updateProduct(productId, updatedFields) { // Cambiado a productId
        try {
            return await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
        } catch (error) {
            console.error('No se pudo actualizar el producto', error);
            throw error;
        }
    }

    async deleteProduct(productId) { // Cambiado a productId
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductManager;

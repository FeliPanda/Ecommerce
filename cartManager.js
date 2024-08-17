import Cart from './models/carts.model.js';
import Product from './models/products.model.js';

class CartManager {
    async getAllCarts() {
        try {
            const carts = await Cart.find().populate('products.productId');

            // Calcular el total para cada carrito
            carts.forEach(cart => {
                let total = 0;
                cart.products.forEach(product => {
                    total += product.productId.price * product.quantity;
                });
                cart.total = total; // Agrega el total al carrito
            });

            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            return await Cart.create({ products: [] });
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            return await Cart.findById(cartId).populate('products.productId');
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    }

    async getProductsByCartId(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log('Carrito no encontrado');
                return null;
            }
            return cart.products;
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            let cart = await this.getCartById(cartId);

            // Si no se encuentra el carrito, crea uno nuevo
            if (!cart) {
                console.log('Carrito no encontrado, creando uno nuevo.');
                cart = await this.createCart();
            }

            const product = await Product.findById(productId);
            if (!product) {
                console.log('Producto no encontrado');
                return null;
            }

            if (quantity > product.stock) {
                console.log('Cantidad solicitada excede el stock disponible');
                return null;
            }

            const existingProduct = cart.products.find(p => p.productId.toString() === productId.toString());
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            product.stock -= quantity;
            await product.save();
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
            throw error;
        }
    }

    async deleteAllCarts() {
        try {
            return await Cart.deleteMany({});
        } catch (error) {
            console.error('Error al eliminar los carritos:', error);
            throw error;
        }
    }
}

export default CartManager;

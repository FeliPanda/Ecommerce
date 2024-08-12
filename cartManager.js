import fs from 'fs';

class CartManager {
    constructor(filepath) {
        this.path = filepath;
        this.initializeFile();
    }

    async initializeFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async getAllCarts() {
        return await this.getCartsFromFile();
    }

    async getCartsFromFile() {
        const jsonString = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(jsonString);
    }

    async saveCartsToFile(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
    }

    getNextId(carts) {
        if (carts.length === 0) {
            return 1;
        }
        const lastCart = carts[carts.length - 1];
        return lastCart.id + 1;
    }

    async createCart() {
        const carts = this.getCartsFromFile();
        const newId = this.getNextId(carts);
        const newCart = {
            id: newId,
            products: [],
        };
        carts.push(newCart);
        this.saveCartsToFile(carts);
        return newCart;
    }

    async getProductsByCartId(cartId) {
        const carts = await this.getCartsFromFile();
        const cart = carts.find(c => c.id.toString() === cartId.toString());
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = this.getCartsFromFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            console.log('Carrito no encontrado');
            return null;
        }

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity: quantity });
        }

        this.saveCartsToFile(carts);
        return cart;
    }
}


export default CartManager;
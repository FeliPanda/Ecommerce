const fs = require('fs');

class CartManager {
    constructor(filepath) {
        this.path = filepath;
        this.initializeFile();
    }

    initializeFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    getCartsFromFile() {
        const jsonString = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(jsonString);
    }

    saveCartsToFile(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
    }

    generateRandomId() {
        return 'xxx'.replace(/[x]/g, () => (Math.random() * 36 | 0).toString(36));
    }

    createCart() {
        const carts = this.getCartsFromFile();
        const newCart = {
            id: this.generateRandomId(),
            products: [],
        };
        carts.push(newCart);
        this.saveCartsToFile(carts);
        return newCart;
    }

    getProductsByCartId(cartId) {
        const carts = this.getCartsFromFile();
        const cart = carts.find(c => c.id === cartId);
        return cart ? cart.products : null;
    }

    addProductToCart(cartId, productId, quantity) {
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

module.exports = CartManager;

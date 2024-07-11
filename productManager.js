const fs = require('fs');
const filepath =

    class productManager {

        constructor(filepath) {
            this.path = filepath
            this.initializaFile();
            this.nextId = this.getNextId();
        }

        //initializating the file
        initializaFile() {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, json.stringify([]));
            }
        }

        getNextId() {
            const products = this.getProductsFromFile();
            return products.length === 0 ? 1 : Math.max(...products.map(p => p.id)) + 1;
        }


        //method to add productos

        addProduct(title, description, price, thumbnail, code, stock) {
            const products = this.getProductsFromFile();
            const newProduct = {
                id: this.getNextId(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            products.push(newProduct);
            this.saveProductsToFile(products);
            return newProduct;
        };


        getProductsFromFile() {
            const jsonString = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(jsonString);
        }
        getProductsById(id) {
            const products = this.getProductsFromFile();
            return products.find(product => product.id === id);
        }

        //update products
        updateProduct(id, updatedFields) {
            const products = this.getProductsFromFile();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                Object.assign(products[index], updatedFields);
                this.saveProductsToFile(products);
            }

        }

        deleteProduct(id) {
            const products = this.getProductsFromFile();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products.splice(index, 1);
                this.saveProductsToFile(products);
            }
        }

        saveProductsToFile(products) {
            fs.writeFileSync(this.path, JSON.stringify(products));
        }
    }
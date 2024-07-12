const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const app = express();

const PORT = 8080;

app.use(express.json()); // para que el servidor pueda recibir JSONs al momento de la petición
app.use(express.urlencoded({ extended: true })); // para que el servidor pueda recibir URL-encoded data

// Agregar el enrutador como middleware
app.use('/api', productsRouter); // prefijo '/api' para las rutas
//app.use('/api', cartsRouter); // prefijo '/api' para las rutas

// Activar servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

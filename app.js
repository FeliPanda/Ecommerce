const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/products.router');
const app = express();

const PORT = 8080

app.use(express.json()); // para que el servidor pueda recibir jsons al momento de la peticion
app.use(express.urlencoded({ extended: true })); //para que el servidor pueda recibir 


// Agregar el enrutador como middleware
app.use('/', productsRouter);
app.use('/', cartsRouter);

// Activar servidor
app.listen(PORT, () => {
    console.log(`Server running on port PORT`);
})

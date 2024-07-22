import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

import __dirname from './utils.js';

const app = express();

const PORT = 8080;

app.use(express.json()); // para que el servidor pueda recibir JSONs al momento de la petición
app.use(express.urlencoded({ extended: true })); // para que el servidor pueda recibir URL-encoded data

// Agregar el enrutador como middleware
app.use('/api', productsRouter); // prefijo '/api' para las rutas
app.use('/api/carts', cartsRouter); // prefijo '/api' para las rutas

//config de handlbebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
//consumir recursos estaticos.
app.use(express.static(__dirname + '/public'))

// Activar servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




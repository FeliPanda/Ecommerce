// import express from 'express';
// import handlebars from 'express-handlebars';
// import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
// import viewsRouter from './routes/views.router.js';
// import { Server } from 'socket.io'; // importar websocket

// import http from 'http';

// import __dirname from './utils.js';

// const app = express();

// const PORT = 8080;

// app.use(express.json()); // para que el servidor pueda recibir JSONs al momento de la petición
// app.use(express.urlencoded({ extended: true })); // para que el servidor pueda recibir URL-encoded data

// // Agregar el enrutador como middleware
// app.use('/api', productsRouter); // prefijo '/api' para las rutas
// app.use('/api/carts', cartsRouter); // prefijo '/api' para las rutas

// //config de handlbebars
// app.engine('handlebars', handlebars.engine());
// app.set('views', __dirname + '/views')
// app.set('view engine', 'handlebars');
// //consumir recursos estaticos.
// app.use(express.static(__dirname + '/public'))
// app.use('/api', viewsRouter); // ruta para productos con websockets

// // Activar servidor
// const httpServer = app.listen(PORT, () =>
//     console.log(`Server running on port ${PORT}`)
// );

// const socketServer = new Server(httpServer)

// socketServer.on('connection', socket => {
//     console.log("New Cliente Connected");

//     socket.on('mensaje', data => {
//         console.log(`soy la ${data}`);
//     })
// });






import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Recursos estáticos
app.use(express.static(__dirname + '/public'));

// Rutas
app.use('/api', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api', viewsRouter);

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log("New Client Connected");
});

// Exportar io para usarlo en los routers
export { io };

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


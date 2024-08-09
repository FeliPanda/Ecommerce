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


import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import mongoose from 'mongoose';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/', viewsRouter);

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log("New Client Connected");
});

app.use((err, req, res, next) => {
    console.error('Error interno del servidor:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Exportar io para usarlo en los routers
export { io };

// Conectar a la DB
mongoose.connect('mongodb+srv://Felipanda:1jPwdOs2hhn3HbWD@cluster0.tpicd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

}).then(() => {
    console.log('¡Conexión exitosa a tu DB en MongoDB Atlas!');
}).catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

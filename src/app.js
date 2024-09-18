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
import Handlebars from './helpers/handlebarsHelpers.js';
import passport from 'passport';
import authRoutes from './routes/auth.router.js';
import sessionRoutes from './routes/session.router.js';
import configurePassport from './config/passport.js';
import cookieParser from 'cookie-parser';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
configurePassport(passport);

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
app.use(express.static('public'));
// Rutas
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);

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
mongoose.connect(process.env.DB_URL, {

}).then(() => {
    console.log('¡Conexión exitosa a tu DB en MongoDB Atlas!');
}).catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
});

// Iniciar el servidor
httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

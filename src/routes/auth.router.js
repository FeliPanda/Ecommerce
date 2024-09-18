import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

// Ruta de registro actualizada
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        console.log('Contraseña antes de hashear:', password);

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword // Guardar la contraseña hasheada
        });

        const savedUser = await newUser.save();

        console.log('Usuario guardado:', savedUser);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            redirectUrl: '/login',
            email: email
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
});

// Ruta de login actualizada
router.post('/login', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas (usuario no encontrado)' });
        }

        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada (hash):', user.password);

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log('Resultado de bcrypt.compareSync:', isMatch);

        if (isMatch) {
            // Si las credenciales son correctas
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000 // 1 hora en milisegundos
            });

            res.status(200).json({
                message: 'Login exitoso',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({ message: 'Credenciales incorrectas' });
        }

    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
    }
});

export default router;
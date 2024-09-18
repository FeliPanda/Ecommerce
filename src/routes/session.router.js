import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para obtener la información del usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        message: 'Usuario autenticado',
        user: req.user, // Datos del usuario autenticado
    });
});

export default router;

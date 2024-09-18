// src/config/passport.js

import { Strategy as JwtStrategy } from 'passport-jwt';
import User from '../models/user.model.js';
import { cookieExtractor } from '../utils.js';

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};

if (!jwtOptions.secretOrKey) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

const configurePassport = (passport) => {
    passport.use(
        new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};

export default configurePassport;

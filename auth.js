import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import User from './models/User'
import config from './config/config'

const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, (payload, done) => {    
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err, null);
        }
        if (user) {
            return done(null, {
                _id: user._id,
                email: user.email,
                name: user.name
            })
        }
        return done(null, false)
    })
});
passport.use(strategy);


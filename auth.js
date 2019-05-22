import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import User from './models/User'
import config from './config/config'

const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, (payload, done) => {    
    User.findById(payload.id).then(user => {
        if (user) {
            return done(null, {
                _id: user._id,
                email: user.email,
                name: user.name
            })
        }
        return done(null, false)
    }).catch(err => {
        return done(err, null);
    })
});
passport.use(strategy);


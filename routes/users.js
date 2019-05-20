import express from 'express'
import bcrypt from 'bcrypt'
import jwt from'jwt-simple'
import passport from 'passport'

import User from '../models/User'
import config from '../config/config'

const router = express.Router();

router.get('/', passport.authenticate('jwt',{ session: false }),
    (req, res) => {
        return res.json({ user: req.user })
})

router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(newUser.password.toString(), 10);
    newUser.save((err, user) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            message: "User created successfully",
            user
        })
    })
});

router.post('/token', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.json({ error: err })
        }
        if (user) {
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) { console.log(err); }
                if(isMatch) {
                    // Passwords match
                    const payload = { id: user._id }
                    res.json({
                        token: jwt.encode(payload, config.jwtSecret)
                    })
                } else {
                    // Passwords don't match
                    return res.status(401).json({ message: "wrong user credentials"})
                }
            });
        } else {
            return res.status(401).json({
                message: "User does not exist"
            })
        }
    })
});

export default router;

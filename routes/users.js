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
});

/**
 * 
 * @api {post} /users Register a user
 * @apiGroup Users
 * @apiParam  {String} name User name
 * @apiParam  {String} email User email
 * @apiParam  {String} password User password
 * 
 * @apiParamExample  {json} Input
 * {
 *     "name" : "Blessed Sibanda",
 *     "email" : "blessedsibanda.me@gmail.com",
 *     "password" : "mysecret"
 * }
 * 
 * @apiSuccess {String} message response message
 * @apiSuccess {Object} user Newly created user
 * @apiSuccess {Number} _id User id
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 * @apiSuccess {String} password User encrypted password
 * 
 * @apiSuccessExample {type} Success
 * {
 *      "message": "User created successfully",
 *      "user": {
 *          "__v": 0,
 *          "_id": "5ce521c27cc5c648cf8a2941",
 *          "email": "blessedsibanda.me@gmail.com",
 *          "name": "Blessed Sibanda",
 *          "password": "$2b$10$ik90TzvxVASsDUk57E.aMudbtqJTRO3YO8WtMrnq/tmT0.8/H6MkW"
 *       }
 *
 * }
 * @apiErrorExample {json} Error
 *      HTTP/1.1 412 Precondition Failed
 * 
 */    
router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(newUser.password.toString(), 10);
    newUser.save((err, user) => {
        if (err) {
            return res.status(412).json({
                error: err
            })
        }
        return res.status(201).json({
            message: "User created successfully",
            user
        })
    })
});


/**
 * 
 * @api {post} /users/token Create and Get a Token
 * @apiGroup Users
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *  
 * @apiParamExample  {json} Input
 * {
 *     "email" : "blessedsibanda.me@gmail.com",
 *     "password" : "mysecret"
 * }
 * 
 * @apiSuccess {String} token User authentication token
 * 
 * @apiSuccessExample {json} Success
 * {
 *     "token" : "xyz.abc.ghi"
 * }
 * 
 * @apiErrorExample {json} Error
 *      HTTP/1.1 412 Precondition Failed
 * 
 */
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
                    const payload = { id: user._id };
                    return res.json({
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

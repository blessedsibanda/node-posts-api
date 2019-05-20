import express from 'express'

import User from '../models/User'

const router = express.Router();

router.post('/', (req, res) => {
    User.create(req.body, (err, user) => {
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
    User.find
});

export default router;

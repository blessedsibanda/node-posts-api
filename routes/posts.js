import express from 'express'

import Post from '../models/Post'

const router = express.Router()

router.post('/', (req, res) => {
    Post.create(req.body, (err, post) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            message: "Post created successfully",
            post
        })
    })
})

export default router;
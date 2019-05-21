import express from 'express';
import passport from 'passport';


import Post from '../models/Post';

const router = express.Router()

router.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({ posts })
    })
})

router.post('/', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const newPost = new Post(req.body)
        newPost.createdBy = req.user
        newPost.save((err, post) => {
            if (err) {
                return res.json({
                    error: err
                })
            } 
            return res.status(201).json({
                message: "Post created successfully",
                post
            })
        })
})

export default router;
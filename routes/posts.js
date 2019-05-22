import express from 'express';
import passport from 'passport';

import Post from '../models/Post';


const router = express.Router()

// get all posts
router.get('/', (req, res) => {
    Post.find()
      .then(posts => res.json({ posts }))
      .catch(err => res.json({ error: err }))
})

// get a single post
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json({ post }))
        .catch(err => res.json({ error: err }))
})

// create a comment for a post
router.post('/:id/comments', 
    passport.authenticate('jwt', { session: false}),
    (req, res) => {       
        Post.findById(req.params.id)
            .then(post => {
                post.comments.push({
                    body: req.body.body,
                    createdBy: req.user,
                })
                post.save().then(updatedPost => {
                    return res.status(201).json({
                        message: "comment created successfully",
                        comments: updatedPost.comments
                    })
                })
            })
            .catch(err => res.json({ error: err }))
})

// update a post
router.put('/:id', 
    passport.authenticate('jwt', { session: false}),
    (req, res) => {
        const { title, body } = req.body;
        Post.findById(req.params.id)
            .then(post => {
                if (post.createdBy.toString() == req.user._id.toString() ) {                 
                    post.title = title;
                    post.body = body;

                    post.save().then(updatedPost => {
                        return res.json({
                            message: "Post updated successfully",
                            updatedPost
                        })
                    })   
                } else {
                    return res.json({
                        error: "Post update failed - only owner of post can edit it"
                    })
                }
            })
            .catch(err => res.json({ error: err }))
})

// delete a post
router.delete('/:id', passport.authenticate('jwt', { session: false}),
    (req, res) => {      
        Post.findById(req.params.id)
            .then(post => {
                if (post.createdBy.toString() == req.user._id.toString() ) {                 
                    post.remove(()  => res.sendStatus(204))
                } else {
                    return res.json({
                        error: "only owner of post can remove it"
                    })
                }
            })
            .catch(err => res.json({ error: err }))
})

// create a new post
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
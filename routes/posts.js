import express from 'express';
import passport from 'passport';


import Post from '../models/Post';
import { Comment } from '../models/Comment';

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


// get a single post
router.get('/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (post) {
            return res.json({ post })
        }
    })
})


// get comments for a post
router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        if (post) {
            return res.json({
                comments: post.comments
            })
        }
    })
})

// create a comment for a post
router.post('/:id/comments', passport.authenticate('jwt', { session: false}),
    (req, res) => {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            if (post) {
                const newComment = new Comment(req.body)
                newComment.createdBy = req.user;
                post.comments.push(req.body);
                post.save((err, updatedPost) => {
                    if (err) {
                        return res.json({
                            error: err
                        })
                    } 
                    return res.status(201).json({
                        message: "comment created successfully",
                        comments: updatedPost.comments
                    })
                })
            
            }
        })
})

router.put('/:id', passport.authenticate('jwt', { session: false}),
    (req, res) => {
        const { title, body } = req.body;
      
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            if (post) {
                if (post.createdBy.toString() == req.user._id.toString() ) {                 
                    post.title = title;
                    post.body = body;

                    post.save((err, updatedPost) => {
                        if (err) {
                            return res.json({
                                error: err
                            })
                        }
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
            }
        })
    })

router.delete('/:id', passport.authenticate('jwt', { session: false}),
    (req, res) => {      
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            if (post) {
                if (post.createdBy.toString() == req.user._id.toString() ) {                 
        
                    post.remove(err  => {
                        if (err) {
                            return res.json({
                                error: err
                            })
                        }
                        return res.status(204).json({
                            message: "Post removed successfully"
                        })
                    })

                } else {
                    return res.json({
                        error: "only owner of post can remove it"
                    })
                }
            }
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
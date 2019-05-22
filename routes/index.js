import express from 'express'

const router = express.Router()

/**
 * 
 * @api {get} / API Welcome Message
 * @apiGroup Status
 * @apiSuccess {String} message Welcome Message
 * @apiSuccessExample {json} Success
 * {
 *     "message": "Welcome to the Node.js social site REST API"
 * } 
 */
router.get('/', (req, res) => {
    res.json({
        "message": "Welcome to the Node.js social site REST API"
    })
});

export default router;

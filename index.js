import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to the Node.js Blog API"
    })
})

app.listen(3000, () => {
    console.log('API server running at http://localhost:3000')
})
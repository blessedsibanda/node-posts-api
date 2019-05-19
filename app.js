import express from 'express'
import logger from 'morgan'

import indexRouter from './routes'
import usersRouter from './routes/users'
import './models/db'

const app = express()

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter)
app.use('/posts', usersRouter)

app.listen(3000, () => {
    console.log('API server running at http://localhost:3000')
})
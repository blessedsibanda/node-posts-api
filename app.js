import express from 'express'
import logger from 'morgan'

import indexRouter from './routes'
import usersRouter from './routes/users'
import postsRouter from './routes/posts'

import './models/db'
import './auth'

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(3000, () => {
    console.log('API server running at http://localhost:3000')
});

export default app;

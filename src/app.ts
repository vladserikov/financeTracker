import express from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';

import { MONGO_URI } from './utils/config';
import userRouter from './routers/user';
import { errorHandler } from './utils/middleware';
import loginRouter from './routers/login';

const app = express();

mongoose.set('strictQuery', false);
mongoose
    .connect(MONGO_URI)
    .then((_result) => {
        console.log('good connection');
        // console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());

app.get('/', (_req, res) => {
    res.send(`<h1>Hello</h1>`);
});

app.use('/user', userRouter);
app.use('/login', loginRouter);

app.use(errorHandler);

export default app;

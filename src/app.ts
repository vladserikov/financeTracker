import express from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';

import { MONGO_URI } from './utils/config';
import userRouter from './routers/user';
import { errorHandler, userExtractor } from './utils/middleware';
import loginRouter from './routers/login';
import storageRouter from './routers/storage';
import transactionRouter from './routers/transaction';

const app = express();

declare global {
    namespace Express {
        interface Request {
            userRequest: null | {
                username: string;
                id: string;
            };
        }
    }
}

mongoose.set('strictQuery', false);
mongoose
    .connect(MONGO_URI)
    .then((_result) => {
        console.log('good connection');
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
app.use('/storage', userExtractor, storageRouter);
app.use('/transaction', userExtractor, transactionRouter);

app.use(errorHandler);

export default app;

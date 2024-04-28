import express from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';

import { MONGO_URI } from './utils/config';
import userRouter from './routers/user';
import { errorHandler, userExtractor } from './utils/middleware';
import loginRouter from './routers/login';
import walletRouter from './routers/wallet';
import transactionRouter from './routers/transaction';
import cors from 'cors';
import { requestLogger } from './utils/logger';

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

const connectDB = async () => {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connect DB');
    } catch (error) {
        console.log(error);
    }
};

connectDB();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use(express.static('dist'));
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/wallet', userExtractor, walletRouter);
app.use('/api/transaction', userExtractor, transactionRouter);

app.use(errorHandler);

export default app;


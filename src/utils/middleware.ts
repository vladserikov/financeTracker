import { ErrorRequestHandler, Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';

export const unknownEndpoint = (_: Request, response: Response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler: ErrorRequestHandler = (error, _, response, _next) => {
    console.log('error:', error);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' });
    }

    return response.status(467).json({ error: 'I dont know' });
};

const getTokenString = (token?: string) => {
    if (token?.startsWith('Bearer ')) {
        return token.split(' ')[1];
    }
    return null;
};

export const userExtractor = (req: Request, res: Response, next: NextFunction) => {
    const {
        headers: { authorization },
    } = req;

    const token = getTokenString(authorization);

    if (!token) {
        req.userRequest = null;
        console.log('no token');

        return res.status(401).json({ error: 'login please' }).redirect('/');
    }

    req.userRequest = jwt.verify(token, SECRET) as { username: string; id: string };
    next();
};


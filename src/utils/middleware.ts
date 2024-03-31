import { ErrorRequestHandler, Response, Request } from 'express';

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
    // next(error);
};

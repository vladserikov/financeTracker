import { Request, Response, NextFunction } from 'express';

export const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
    console.log('url', request.url);
    console.log('method', request.method);
    console.log('body', request.body);
    console.log('params', request.params);

    next();
};

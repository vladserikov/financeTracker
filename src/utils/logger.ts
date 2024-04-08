import { Request, Response, NextFunction } from 'express';

export const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
    console.log(request.body);
    console.log(request.params);
    console.log(request.url);

    next();
};

import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError.js';

export const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // Handle known domain errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

  // Handle generic errors safely
    if (err instanceof Error) {
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }

  // Handle non-error rejections
    return res.status(500).json({
        error: 'Internal server error',
    });
};

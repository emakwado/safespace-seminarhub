import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new AppError(message || 'Validation failed', 400);
    }
  };
};

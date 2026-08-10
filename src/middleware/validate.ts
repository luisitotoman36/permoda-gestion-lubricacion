import { plainToInstance } from 'class-transformer';
import { validate as classValidate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

function formatErrors(errors: ValidationError[]): string[] {
  const result: string[] = [];
  for (const err of errors) {
    if (err.constraints) result.push(...Object.values(err.constraints));
    if (err.children && err.children.length) result.push(...formatErrors(err.children));
  }
  return result;
}

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await classValidate(instance as object, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const messages = formatErrors(errors);
      return res.status(400).json({ errors: messages });
    }
    req.body = instance;
    next();
  };
}

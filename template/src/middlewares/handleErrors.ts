import { NextFunction, Request, Response } from 'express';

const handleErrors = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  console.error(err);
  return res.status(500).json({ type: err.name, message: err.message });
};

export default handleErrors;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header found' });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }
    const decoded = jwt.verify(token, secretKey!) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};




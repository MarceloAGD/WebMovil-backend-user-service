import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, 'secret');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token error: ' + (err.message || err.name) });
    }
  }
}

import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    try {
      request.user = await this.validateToken(request.headers.authorization);
      return true;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token format', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];

    try {
      const decoded = jwt.verify(token, 'secret'); // Cambia 'secret' por tu clave secreta
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { UserRepository } from '../../features/users/repositories/user.repository';
//Прописываем в настройкаъ App modules
@Injectable()
export class PayloadFromJwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userOrmRepository: UserRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Bearer <token>

      try {
        const payload = this.jwtService.verify(token);
        const user = await this.userOrmRepository.getById(payload.userId);
        req.user = user ? { id: payload.userId } : null;
      } catch (e) {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  }
}

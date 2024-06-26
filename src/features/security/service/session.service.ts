/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { ErrorStatus, Result } from '../../../infrastructure/object-result/objcet-result';
import { SessionRepository } from '../repository/session.repository';

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: SessionRepository) {}

  async terminateCurrentSession(userId: number, tokenKey: string): Promise<Result<string>> {
    await this.sessionRepository.terminateSessionByTokenKey(tokenKey);
    const chekResult = await this.sessionRepository.getByUserIdAndTokenKey(userId, tokenKey);
    if (chekResult) return Result.Err(ErrorStatus.SERVER_ERROR, 'Session not terminated');
    return Result.Ok('Session terminated');
  }
  async terminateAllSession(userId: number, entityManager?: EntityManager): Promise<void> {
    await this.sessionRepository.terminateAllSessionByUserId(userId, entityManager);
  }
  async terminateSessionByDeviceIdAndUserId(deviceId: string, userId: number): Promise<Result<string>> {
    await this.sessionRepository.terminateSessionByDeviceIdAndUserId(deviceId, userId);
    return Result.Ok(`Session ${deviceId} terminated`);
  }
  async terminateOtherSession(userId: number, tokenKey: string): Promise<Result<string>> {
    await this.sessionRepository.terminateOtherSession(userId, tokenKey);
    return Result.Ok(`other sessions terminated`);
  }
}

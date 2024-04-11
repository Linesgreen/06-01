/* eslint-disable no-underscore-dangle */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Result } from '../../../../infrastructure/object-result/objcet-result';
import { Session_Orm } from '../../../security/entites/orm_session';
import { SessionRepository } from '../../../security/repository/session.repository';
import { SessionCreateData } from '../../../security/types/commot.types';
import { AuthService } from '../auth.service';

export class UserLoginCommand {
  constructor(
    public userId: number,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
  constructor(
    protected sessionRepository: SessionRepository,
    protected authService: AuthService,
  ) {}

  async execute(command: UserLoginCommand): Promise<Result<{ token: string; refreshToken: string }>> {
    const { userId, ip, userAgent } = command;
    const tokenKey = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    await this.createSession({ userId, deviceId, ip, title: userAgent, tokenKey });
    const { token, refreshToken } = await this.authService.generateTokenPair(userId, tokenKey, deviceId);
    return Result.Ok({ token, refreshToken });
  }

  async createSession(sessionData: SessionCreateData): Promise<void> {
    const session = Session_Orm.createSessionModel(sessionData);
    await this.sessionRepository.save(session);
  }
}

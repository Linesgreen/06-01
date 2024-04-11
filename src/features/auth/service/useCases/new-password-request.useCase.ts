import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ErrorStatus, Result } from '../../../../infrastructure/object-result/objcet-result';
import { MailService } from '../../../../mail/mail.service';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuthService } from '../auth.service';

export class NewPasswordRequestCommand {
  constructor(public email: string) {}
}

@CommandHandler(NewPasswordRequestCommand)
export class NewPasswordRequestUseCase implements ICommandHandler<NewPasswordRequestCommand> {
  constructor(
    protected mailService: MailService,
    protected userRepository: UserRepository,
    protected authService: AuthService,
  ) {}

  async execute({ email }: NewPasswordRequestCommand): Promise<Result<string>> {
    const existResult = await this.chekUserIsExist(email);
    if (!existResult) return Result.Ok('user not found');

    const passwordRecoveryToken = await this.authService.createJwt({ email }, '3600');
    await this.sendEmail(email, passwordRecoveryToken);
    return Result.Ok('email sended');
  }

  private async chekUserIsExist(email: string): Promise<boolean> {
    const result = await this.userRepository.getByLoginOrEmail(email);
    if (!result) {
      console.warn('User with email ' + email + ' not found');
      return false;
    }
    return true;
  }

  private async sendEmail(email: string, passwordRecoveryToken: string): Promise<Result<string>> {
    try {
      await this.mailService.sendUserConfirmation(email, 'User', passwordRecoveryToken);
      return Result.Ok('email sended');
    } catch (error) {
      console.error(error);
      return Result.Err(ErrorStatus.SERVER_ERROR, 'email not sended');
    }
  }
}

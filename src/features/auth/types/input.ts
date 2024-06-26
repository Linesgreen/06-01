// noinspection RegExpRedundantEscape

import { IsEmail, IsString, IsUUID, Length, Matches } from 'class-validator';

import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { ConfCodeIsValid } from '../../../infrastructure/decorators/validate/conf-code.decorator';
import { EmailIsConformed } from '../../../infrastructure/decorators/validate/email-is-conformed.decorator';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';
import { RecoveryCodeIsValid } from '../../../infrastructure/decorators/validate/password-recovery-code.decorator';

export class UserRegistrationModel {
  @Trim()
  @NameIsExist()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @Trim()
  @IsString()
  @Length(6, 20)
  password: string;
  @Trim()
  @NameIsExist()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class ValidationCodeModel {
  @Trim()
  @ConfCodeIsValid()
  @IsUUID()
  code: string;
}

export class EmailResendingModel {
  @Trim()
  @IsEmail()
  @EmailIsConformed()
  email: string;
}

export class EmailInBodyModel {
  @Trim()
  @IsEmail()
  email: string;
}

export class RecoveryCodeModel {
  @Trim()
  @RecoveryCodeIsValid()
  recoveryCode: string;
  @Trim()
  @IsString()
  @Length(6, 20)
  newPassword: string;
}

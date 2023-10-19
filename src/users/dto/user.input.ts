import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RecoveryUserInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ValidateRecoveryUserInput {
  @IsNotEmpty()
  recoveryPass: number;
}

export class ChangePassUserInput {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  recoveryPass: number;
}

export class DeleteUserInput {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class addTeamToUserInput {
  
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  teamId: number;
}
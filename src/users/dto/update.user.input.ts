import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsEmpty

  } from 'class-validator';
export class UpdateUserInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    role?: string;
}

export class UpdatePasswordUserInput {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
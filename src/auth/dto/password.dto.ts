import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class RecoverPassword {
    @IsEmail()
    email: string;
  }
  
  export class ResetPassword {
    @IsNotEmpty()
    token: string;
  
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    passwordConfirm: string;
  }
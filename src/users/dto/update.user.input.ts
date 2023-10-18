import {
    IsEmail,
    IsNotEmpty,
    IsString,

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

}
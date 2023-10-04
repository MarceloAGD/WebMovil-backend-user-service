import { IsNotEmpty, IsEmail} from 'class-validator';

export class CreateUserInput {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
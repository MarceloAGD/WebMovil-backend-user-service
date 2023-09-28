import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail} from 'class-validator';

@InputType()
export class CreateUserInput {
    @IsEmail()
    @IsNotEmpty()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    name: string;

    @IsNotEmpty()
    @Field()
    password: string;
}
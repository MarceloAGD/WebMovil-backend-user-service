import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmptyObject, IsEmail} from 'class-validator';

@InputType()
export class CreateUserInput {
    @IsEmail()
    @IsNotEmptyObject()
    @Field()
    email: string;

    @IsNotEmptyObject()
    @Field()
    name: string;

    @IsNotEmptyObject()
    @Field()
    password: string;
}
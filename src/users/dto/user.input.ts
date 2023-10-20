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

export class addTeamToUserInput {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  teamId: number;
}

export class removeTeamToUserInput {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  teamId: number;
}

export class validateUserInput {
  
  @IsNotEmpty()
  userEmail: string;

}
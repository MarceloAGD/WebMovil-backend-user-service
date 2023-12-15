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

  role?: string;
}

export class addTeamToUserInput {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  teamId: number;
}

export class removeTeamToUserInput {
  @IsNotEmpty()
  teamId: number;
}

export class validateUserInput {
  
  @IsNotEmpty()
  userEmail: string;

}

export class validateUserResponse {
    
  success: boolean;

  message: string;

  idUser?: number;
}  
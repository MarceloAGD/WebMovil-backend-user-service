import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.input';
import { User } from './users.entity'
import { AuthGuard} from './auth.guard';
import {UseGuards} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('getUser')
  @UseGuards(AuthGuard) 
  async user(@Query('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post('sign-in')
  async signin(@Body() input: CreateUserInput): Promise<any> {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      const newUser = await this.userService.createUser(input);
      return await this.userService.createToken(newUser);
    }
    return await this.userService.createToken(user);
  }

  @Post('login')
  async login(@Body() input: CreateUserInput ): Promise<any>{
    try{
      return await this.userService.login(input);
    }catch(error){
      //console.error('error de tipo', error)
      if (error instanceof EntityNotFoundError) {
        // El usuario no existe en la base de datos
        // Aquí puedes lanzar tu propio error o manejarlo según sea necesario
        return { error: 'User does not exist' };
      }else if (error.message === 'incorrect password') {
        // El error es "incorrect password"
        return { error: 'Incorrect password' };
      } 
      else if (error.message === 'user does not exist') {
        // El error es "incorrect password"
        return { error: 'user does not exist' };
      }
      else {
        // Manejar otros errores aquí
        return { error: 'An error occurred' };
      }

    }
  }
}

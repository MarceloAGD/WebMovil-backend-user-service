import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Response, DeleteUserResponse } from './users.entity'
import { AuthGuard } from './auth.guard';
import { UseGuards } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import * as input from './dto/user.input';
import { promises } from 'dns';
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get('getUser')
  @UseGuards(AuthGuard)
  async user(@Query('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post('sign-up')
  async signUp(@Body() input: input.CreateUserInput) {
    try {
      const newUser = await this.userService.createUser(input);
      return await this.userService.createToken(newUser);

    } catch (error) {
      if (error.message === 'User already exists')
        return { error: 'User already existss' };

    }

  }

  @Post('login')
  async login(@Body() input: input.LoginUserInput) {
    try {
      return await this.userService.login(input);
    } catch (error) {
      //console.error('error de tipo', error)
      if (error instanceof EntityNotFoundError) {
        // El usuario no existe en la base de datos
        // Aquí puedes lanzar tu propio error o manejarlo según sea necesario
        return { error: 'User does not exist' };
      } else if (error.message === 'incorrect password') {
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

  @Post('recovery')
  async recovery(@Body() input: input.RecoveryUserInput): Promise<Response> {
    try {
      const sentEmail = await this.userService.sendRecoveryEmail(input);
      if (sentEmail) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      if (error.message === 'user does not exist') {
        throw new Error('user does not exist');
      } else if (error.message === 'email could not be sent') {
        throw new Error('email could not be sent');
      } else {
        throw new Error('An error occurred');
      }
    }

  }

  @Post('validateRecovery')
  async validateRecovery(@Body() validateRecoveryInput: input.ValidateRecoveryUserInput) {
    try {
      const validate = await this.userService.validateRecovery(validateRecoveryInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      if (error.message === 'incorrect recovery code') {
        throw new Error('incorrect recovery code');
      } else {
        throw new Error('An error occurred');
      }
    }
  }

  @Post('changePass')
  async changePass(@Body() changePassUserInput: input.ChangePassUserInput) {
    try {
      const validate = await this.userService.changePass(changePassUserInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      if (error.message === 'same password') {
        throw new Error('same password');
      } else {
        throw new Error('An error occurred');
      }
    }
  }

  @Post('deleteUser')
  async DeleteUser(@Body() deleteUserInput: input.DeleteUserInput): Promise<DeleteUserResponse> {
    try {
      const { email, password } = deleteUserInput;
      console.log('antes de entrar al service');
      const response = await this.userService.deleteUser(email, password);
      console.log(response);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return { success: false, message: 'error deleting user' };
    }


  }


}

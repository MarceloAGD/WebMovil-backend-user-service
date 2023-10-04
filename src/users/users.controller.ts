import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.input';
import { User } from './users.entity'
import { AuthMiddleware} from './auth.guard';
import {UseGuards } from '@nestjs/common';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('getUser')
  @UseGuards(AuthMiddleware) // Mueva el guardia a nivel de clase si es necesario
  async user(@Query('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post('sign-in')
  async login(@Body() input: CreateUserInput): Promise<any> {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      const newUser = await this.userService.createUser(input);
      return await this.userService.createToken(newUser);
    }
    return await this.userService.createToken(user);
  }
}

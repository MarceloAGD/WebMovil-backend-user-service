import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.input';
import { User } from './users.entity'
import { AuthMiddleware} from './auth.guard';
import {UseGuards } from '@nestjs/common';

@Controller('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('get-user')
  @UseGuards(AuthMiddleware)
  user(@Query('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post('sign-in')
  async login(@Body('input') input: CreateUserInput){
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      const user = await this.userService.createUser(input);
      return await this.userService.createToken(user);
    }
    return await this.userService.createToken(user);
  }
}

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.input';
import { User } from './users.entity'
import { AuthGuard } from './auth.guard';
import { UseGuards } from '@nestjs/common';
import { LoginResponse } from './dto/login.response';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  @UseGuards(new AuthGuard())
  user(@Args('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: CreateUserInput){
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      const user = await this.userService.createUser(input);
      return await this.userService.createToken(user);
    }
    return await this.userService.createToken(user);
  }
}

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/user.input';
import { User } from './entitiy/users.entity'
import { AuthGuard } from './auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  @UseGuards(new AuthGuard())
  user(@Args('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Mutation(() => String)
  async login(@Args('input') input: CreateUserInput) {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      const user = await this.userService.createUser(input);
      return this.userService.createToken(user);
    }
    return this.userService.createToken(user);
  }
}

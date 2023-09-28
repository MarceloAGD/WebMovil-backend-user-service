import { Resolver } from '@nestjs/graphql';
import { UsersService } from '../service/users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
}

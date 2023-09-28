import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersResolver } from './resolver/users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
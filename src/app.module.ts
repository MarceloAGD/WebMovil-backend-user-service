import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
//import {dataSourceOptions} from '../orm.config'
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
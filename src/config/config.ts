import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { RecoveryPassword } from 'src/auth/entities/recovery.pass.entity';
import { User } from 'src/users/users.entity';

dotenv.config()

const config: TypeOrmModuleOptions = {
  type: 'postgres', // Cambia esto según tu base de datos
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, AuthEntity, RecoveryPassword], 
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, 
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
};

export default config;

import { HttpException, Injectable } from '@nestjs/common';
import * as input from './dto/user.input';
import { User } from './users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/app.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}
  async getUserByEmail(email: string) {
    return this.userRepository.findOne({where: {email} });
  }

  async createUser(
    createUserEnt: input.CreateUserInput,
  ): Promise<HttpException | ResponseDto> {
    const user: input.CreateUserInput = {
      ...createUserEnt,
      password: await bcrypt.hash(createUserEnt.password, 10),
    };

    try {
      const user = await this.userRepository.findOne({
        where: {
          email: createUserEnt.email,
        },
      });

      if (user) {
        return new HttpException(
          { msg: 'the user already exists', err: true },
          400,
        );
      }
    } catch (err) {
      return new HttpException(
        { msg: 'internal server error', err: true },
        500,
      );
    }

    try {
      await this.userRepository.create(user);
    } catch (err) {
      return new HttpException(
        { msg: 'failed to register user', err: true },
        500,
      );
    }
    
    this.userRepository.save(user)
    return { msg: 'user registered with success', err: false };
  }

  async updatePasswordUser(email: string, pass: string): Promise<User>{
    const user = await this.getUserByEmail(email);
    user.password = pass;
    return await this.userRepository.save(user)
  }
}

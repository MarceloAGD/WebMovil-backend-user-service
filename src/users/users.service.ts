import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/user.input';
import { User } from './entitiy/users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}

  createToken({email, name, password}: User) {
    return jwt.sign({ email, name, password }, 'secret');
  }

  async createUser(user: CreateUserInput): Promise<User> {
    const { password, ...userData } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOne({where: {email} });
  }
}
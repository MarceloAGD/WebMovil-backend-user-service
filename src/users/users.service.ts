import { Injectable } from '@nestjs/common';
import * as input from './dto/user.input';
import { User } from './users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async createToken({ email, password }: User) {

    return {
      accessToken: jwt.sign({ email, password }, 'secret'),
    }
  };

  getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(input: input.CreateUserInput): Promise<User> {

    const user = await this.getUserByEmail(input.email);
    if (user) {
      throw new Error('User already exists');
    }

    const token_email = input.email;
    const token_password = input.password;
    const { password, ...userData } = input;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    newUser.access_token = jwt.sign({token_email,token_password}, 'secret');
    return this.userRepository.save(newUser);
  }

  async login(input: input.LoginUserInput): Promise<any> {

    const email = input.email
    const password = input.password
    const user = await this.userRepository.findOne({//TODO: usar try catch
      where: { email }
    })
    if (!user) {//TODO: si usuario no existe lanzar un error
      throw new Error('user does not exist');
    }
    //comparar la contraseña que viene del front con la contraseña de la base de datos.

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {//las contraseñas no coinciden

      throw new Error('incorrect password');
    }
    const token_email = input.email;
    const token_password = input.password;
    //user.access_token = jwt.sign({token_email,token_password}, 'secret');
    
    //await this.userRepository.save(user);
    
    //return user;
    return await this.updateToken(user);

  }

  async updateToken(user: User) {
    const token_email = user.email;
    const token_password = user.password; 
    const access_token = jwt.sign({token_email,token_password}, 'secret');
    user.access_token = access_token;
    this.userRepository.save(user);
    return {
      accessToken: access_token,
    }
  };

}
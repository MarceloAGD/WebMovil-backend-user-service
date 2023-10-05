import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/user.input';
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
  ){}

  async createToken({email, password}: User){
    return {
      accessToken: jwt.sign({ email, password}, 'secret'),
    }
  };

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

  async login(input: CreateUserInput): Promise<any>{
    
    const email = input.email
    const password = input.password
    const user = await this.userRepository.findOne({//TODO: usar try catch
      where: {email}
    }) 
    if(!user){//TODO: si usuario no existe lanzar un error
       throw new Error('user does not exist');
    }
    //comparar la contraseña que viene del front con la contraseña de la base de datos.
    
    const valid = await bcrypt.compare(password, user.password)
    
    if(!valid){//las contraseñas no coinciden
      
      throw new Error('incorrect password');
    }
    
    return await this.createToken(user);

  }
}
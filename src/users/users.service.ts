import { HttpException, Injectable } from '@nestjs/common';
import * as input from './dto/user.input';
import { User, } from './users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/app.dto';
import { validateUserResponse } from './dto/user.input';
import { UpdateUserInput } from './dto/update.user.input';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getUserByEmail(email: string): Promise<User> {
    
    const user =  await this.userRepository.findOne({ where: { email } });
    
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async createUser(
    createUserEnt: input.CreateUserInput,
  ): Promise<HttpException | ResponseDto> {
    const user: input.CreateUserInput = {
      ...createUserEnt,
      password: await bcrypt.hash(createUserEnt.password, 10),
      
    };
    user.role = 'user';
    
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

    this.userRepository.save(user);
    return { msg: 'user registered with success', err: false };
  }

  async updatePasswordUser(email: string, pass: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    user.password = pass;
    return await this.userRepository.save(user);
  }

  async removeUser(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    await this.userRepository.remove(user);
    return true;
  }

  async updateUser(input: UpdateUserInput,
  ): Promise<boolean> {
    try {
      await this.userRepository.update(
        {
          email: input.email,
        },
        {
          name: input.name,
          lastname: input.lastname,
          role: input.role,
        },
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    console.log("email en service: ", email);
    console.log("oldpass en service: ", oldPassword);
    console.log("newPass en service: ", newPassword);
    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    try {
      const user = await this.userRepository.findOne(
        {
          where: {email: email},
        },
      );
      console.log("printenado user:");
      console.log(user)
      if(await bcrypt.compare(oldPassword, user.password)){
        console.log("entro al if");
        user.password = newPasswordHashed
        await this.userRepository.save(user);
        return true
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async validateUser(input: input.validateUserInput): Promise<validateUserResponse>{
    const email = input.userEmail;
    const user = await this.userRepository.findOne({
      where: { email }
    })
    if(!user){
      return { success: false, message: "user does not exist" };
    }
    return { success: true, message: "user exist", idUser: user.id };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import * as input from './dto/user.input';
import { User, addTeamToUserResponse, validateUserResponse } from './users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/app.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getUserByEmail(email: string): Promise<User> {
    console.log("email en users.service");
    console.log(email);
    const user =  await this.userRepository.findOne({ where: { email } });
    console.log(user);
    return user;
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

  async updateUser(
    email: string,
    name: string,
    lastname: string,
  ): Promise<boolean> {
    try {
      await this.userRepository.update(
        {
          email: email,
        },
        {
          name: name,
          lastname: lastname,
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
    const pass = await bcrypt.hash(newPassword, 10);
    try {
      const user = await this.userRepository.findOne(
        {
          where: {email: email},
        },
      );
      if(bcrypt.compare(user.password, oldPassword)){
        user.password = pass
        await this.userRepository.save(user);
        return true
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  /*
  async addTeamToUser(input: input.addTeamToUserInput):Promise<addTeamToUserResponse>{
    const id = input.userId
    const teamId = input.teamId

    const user = await this.userRepository.findOne({
      where: { id }
    })
    if(!user){
      return { success: false, message: "user does not exists"};
    }
    if (user.idTeams.includes(teamId)) {
      return { success: false, message: "Team is already associated with the user" };
    }
    user.idTeams.push(teamId);

    await this.userRepository.save(user);
    return { success: true, message: "Team added to user" };

  }
  */
 /*
  async removeTeamToUser(teamId: number): Promise<addTeamToUserResponse> {
    // Encuentra todos los usuarios que tienen el teamId en su lista idTeams
    const users = await this.userRepository
      .createQueryBuilder("user")
      .where(":teamId = ANY(user.idTeams)", { teamId })
      .getMany();
    
    if (users.length === 0) {
      return { success: false, message: "No users are associated with this team" };
    }
  
    // Elimina teamId de la lista idTeams de cada usuario
    for (const user of users) {
      user.idTeams = user.idTeams.filter((id) => id !== teamId);
      await this.userRepository.save(user);
    }
  
    return { success: true, message: "Team removed from users" };
  }*/

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
}

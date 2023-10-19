import { Injectable } from '@nestjs/common';
import * as input from './dto/user.input';
import { User, addTeamToUserResponse, validateUserResponse } from './users.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';
import nodemailer = require('nodemailer')


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
    newUser.access_token = jwt.sign({ token_email, token_password }, 'secret');
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
    const access_token = jwt.sign({ token_email, token_password }, 'secret');
    user.access_token = access_token;
    this.userRepository.save(user);
    return {
      accessToken: access_token,
    }
  };

  async sendRecoveryEmail(recoveryUserInput: input.RecoveryUserInput): Promise<User> {
    const email = recoveryUserInput.email;
    const user = await this.userRepository.findOne({
      where: { email }
    })
    if (!user) {
      throw new Error('user does not exist');
    }


    /*const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        //user: process.env.darkface,
        //pass: process.env.nwjsmctpfmiyusgg
      }
    });*/
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'brayanmaldonadocarrasco@gmail.com',
        pass: 'nwjsmctpfmiyusgg'
      }
    })

    const recoveryPass = await this.findRecoveryPass();

    transporter.sendMail(
      {
        from: '"Night Watch" <noreply@example.com>',
        to: user.email,
        subject: "Codigo de recuperacion de contraseña",
        text: "Estimado" + user.name + " " + user.lastname + " su codigo de recuperacion de contraseña es: " + recoveryPass,
      },
      (error) => {
        if (error) {
          throw new Error('email could not be sent');
        } else {
          console.log("Message sent successfully!");
          user.recoveryPass = recoveryPass;
          this.userRepository.save(user);
        }
      }
    );
    return user;
  }

  async findRecoveryPass(): Promise<number> {
    const recoveryPass = Math.floor(100000 + Math.random() * 900000);
    const user = await this.userRepository.findOne({
      where: { recoveryPass }
    });
    //esta funcion es recurdiva para asegurarse de que los recovery pass sean unicos.
    if (!user) {
      return recoveryPass;
    } else {
      return this.findRecoveryPass();
    }
  }

  async validateRecovery(validateRecoveryInput: input.ValidateRecoveryUserInput): Promise<User> {
    const recoveryPass = validateRecoveryInput.recoveryPass;
    const user = await this.userRepository.findOne({
      where: { recoveryPass }
    })
    if (!user) {
      throw new Error('incorrect recovery code');
    } else {
      await this.userRepository.save(user);
      return user;
    }
  }

  async changePass(changePassUserInput: input.ChangePassUserInput): Promise<User> {
    const newPassword = changePassUserInput.password;
    const recoveryPass = changePassUserInput.recoveryPass;
    const user = await this.userRepository.findOne({
      where: {
        recoveryPass
      }
    })

    const same = await bcrypt.compare(newPassword, user.password);

    if (same) {
      throw new Error('same password');
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.recoveryPass = null;
      await this.userRepository.save(user);
      return user;
    }
  }

  async deleteUser(email: string, password: string): Promise<string> {
    console.log('entrando a deleteUser en service');
    const user = await this.userRepository.findOne({
      where: { email }
    })
    console.log(user);
    if (!user) { throw new Error('user does not exist'); }
    //validar la contraseña que viene del front con la de la base de datos
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { throw new Error('incorrect password') };//'invalid credentials'
    //el usuario existe y su contraseña es correcta
    //por lo tanto existe en la base de datos
    //ahora hay q borrarlo
    try {
      this.userRepository.remove(user);
      return 'user deleted';
    } catch (error) {
      throw new Error('Error deleting user');
    }

  }

  async addTeamToUser(input: input.addTeamToUserInput):Promise<addTeamToUserResponse>{
    console.log("entro a service")
    const id = input.userId
    const teamId = input.teamId
    console.log("antes del where id")
    const user = await this.userRepository.findOne({
      where: { id }
    })
    console.log("antes del if")
    if(!user){
      return { success: false, message: "user does not exists"};
    }
    //add teamId to user.idTeams array
    //revisar que teamId no este ya presente en user.idTeams
    if (user.idTeams.includes(teamId)) {
      return { success: false, message: "Team is already associated with the user" };
    }
    user.idTeams.push(teamId);

    await this.userRepository.save(user);
    return { success: true, message: "Team added to user" };

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

}
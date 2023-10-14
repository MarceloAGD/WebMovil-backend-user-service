import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.entity';
import { AuthEntity } from './entities/auth.entity';
import { RecoveryPassword } from './entities/recovery.pass.entity';
import { RecoverPassword, ResetPassword } from './dto/password.dto';
import { Payload, UserDto} from './dto/auth.dto';
import { ResponseDto } from 'src/app.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity) private authServiceRepository: Repository<AuthEntity>,
    @InjectRepository(RecoveryPassword) private recoverPasswordRepository: Repository<RecoveryPassword>,
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async loginByPayload(user: Payload): Promise<{ access_token: string } | HttpException> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
    };

    const token: string = this.jwtService.sign(payload);
    const error: string = await this.saveToken(token, payload.email);

    if (error) {
      return new HttpException({ msg: 'failed to perform the login', err: true }, 500);
    }

    return {
      access_token: token,
    };
  }

  async saveToken(token: string, email: string): Promise<string> {
    try {
      const auth = await this.authServiceRepository.create({
        email: email,
        token: token,
      });
      this.authServiceRepository.save(auth);
      return '';
    } catch (err) {
      try {
        await this.authServiceRepository.update(
          {
            email: email,
          },
          {
            token: token,
          }
        );
        return '';
      } catch (err) {
        return 'error trying to save token';
      }
    }
  }

  async refreshToken(oldToken: string): Promise<
    | HttpException
    | {
        data: { access_token: string } | HttpException;
        msg: string;
        err: boolean;
      }
  > {
    const token = await this.authServiceRepository.findOne({
      where: {
        token: oldToken,
      },
    });

    if (token) {
      let user: Payload;

      try {
        user = await this.authServiceRepository.findOne({
          where: {
            email: token.email,
          },
          select: ['id', 'email'],
        });
      } catch (err) {
        return new HttpException({ msg: 'invalid token', err: true }, 401);
      }

      return { data: await this.loginByPayload(user), msg: null, err: false };
    } else {
      return new HttpException({ msg: 'invalid token', err: true }, 401);
    }
  }

  async validateUser(email: string, password: string): Promise<Payload | HttpException> {
    let user: UserDto;

    try {
      user = await this.userService.getUserByEmail(email);
    } catch (err) {
      return new HttpException({ msg: 'email and/or password invalid', err: true }, 401);
    }

    try {
      if ((await bcrypt.compare(password, user.password)) === false) {
        return new HttpException({ msg: 'email and/or password invalid', err: true }, 401);
      }
    } catch (err) {
      return new HttpException({ msg: 'email and/or password invalid', err: true }, 401);
    }

    return { id: user.id, email: user.email };
  }

  async recoverPassword(email: string): Promise<ResponseDto | HttpException> {
    const token = Math.random().toString(20).substring(2, 22);

    try {
      const pass = await this.recoverPasswordRepository.create({
        email,
        token
      });
      this.recoverPasswordRepository.save(pass);
      
    } catch (err) {
      try {
        const pass = await this.recoverPasswordRepository.findOne({where:{email: email}});

        pass.token = token

        this.recoverPasswordRepository.save(pass);
      } catch (err) {
        return new HttpException({ msg: 'internal server error', err: true }, 500);
      }
    }

    const url = `http://localhost:3000/reset/${token}`;

    await this.mailerService.sendMail({
      from: 'marceloguerra215@gmail.com',
      to: email,
      subject: 'Reset your password!',
      html: `Click <a href="${url}">here</a> to reset your password!`,
    });

    return { msg: 'Please check your email!', err: false };
  }

  async resetPassword(token: string, password: string, passwordConfirm: string): Promise<HttpException | ResponseDto> {
    if (password !== passwordConfirm) {
      return new HttpException({ msg: 'Password do not match', err: true }, 400);
    }

    const passwordReset = await this.recoverPasswordRepository.findOne({
      where: {
        token: token,
      },
    });

    const user = await this.authServiceRepository.findOne({
      where: {
        email: passwordReset.email,
      },
    });

    if (!user) {
      return new HttpException({ msg: 'user not found', err: true }, 404);
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    await this.authServiceRepository.save(
      {
        id: user.id,
        password: hashedPassword,
      }
    );

    return { msg: 'Password reset', err: false };
  }
}

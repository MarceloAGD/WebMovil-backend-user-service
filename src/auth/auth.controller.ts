import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Put,
  Req,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from 'src/app.dto';
import { AuthService } from './auth.service';
import { RecoverPassword, ResetPassword } from './dto/password.dto';
import { Login, RefreshToken } from './dto/auth.dto';
import { User } from 'src/users/users.entity';
import { AuthGuards } from './auth.guard';

// Authentication controller
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Function login, auth controller and route
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() input: Login,
  ): Promise<{ access_token: string } | HttpException> {
    const result = await this.authService.validateUser(input.email, input.password);
    if (result instanceof HttpException) {
      return result;
    }
    return await this.authService.loginByPayload(result);
  }

  // Function login, refresh controller and route
  @Put('/refresh')
  async refreshToken(
    @Body() bodyData: RefreshToken,
  ): Promise<HttpException | ResponseDto> {
    return await this.authService.refreshToken(bodyData.oldToken);
  }

  @Post('/recover')
  async recoverPassword(@Body() body: RecoverPassword) {
    return await this.authService.recoverPassword(body.email);
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPassword) {
    return this.authService.resetPassword(body);
  }

  @Get('get-user')
  @UseGuards(AuthGuards)
  async getUser(@Param('email') email: string): Promise<User>{
    return this.authService.getUser(email);
  }
}
import { Controller, Post, Body,HttpException, Delete, Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseDto } from 'src/app.dto';
import * as input from './dto/user.input';
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  createUser(
    @Body() input: input.CreateUserInput,
  ): Promise<HttpException | ResponseDto> {
    return this.userService.createUser(input);
  }

  @Delete('delete')
  deleteUser(@Param('email') email: string){
    return this.userService.removeUser(email);
  }
}

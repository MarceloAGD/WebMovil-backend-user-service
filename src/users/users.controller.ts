import { Controller, Post, Body,HttpException, Delete, Param, Get, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseDto } from 'src/app.dto';
import * as input from './dto/user.input';
import { User } from './users.entity';
import { UpdateUserInput } from './dto/update.user.input';
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

  @Post('update-user')
  updateUser(@Body('input') input: UpdateUserInput){
    return this.userService.updateUser(input.email, input.name, input.lastname);
  }
  
}

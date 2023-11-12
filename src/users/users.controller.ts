import { Controller, Post, Body,HttpException, Delete, Param, Get, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseDto } from 'src/app.dto';
import * as input from './dto/user.input';
import { User, addTeamToUserResponse, validateUserResponse } from './users.entity';
import { UpdateUserInput, UpdatePasswordUserInput} from './dto/update.user.input';
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
  updateUser(@Body() input: UpdateUserInput){
    return this.userService.updateUser(input.email, input.name, input.lastname);
  }
  
  @Post('update-password')
  updatePassword(@Body() input: UpdatePasswordUserInput): Promise<boolean>{
    console.log("old password:", input.oldPassword);
    console.log("new password:", input.newPassword);
    return this.userService.updatePassword(input.email, input.oldPassword, input.newPassword);
  }

  /** 
  @Post('addTeamToUser')
  async addTeamToUser(@Body() input: input.addTeamToUserInput):Promise<addTeamToUserResponse>{
    try{
      return await this.userService.addTeamToUser(input);
    }catch(error){
      return { success: false, message: "an error has ocurred"};
    }

  }
*/
/*
  @Post('removeTeamUser')
  async removeTeamUser(@Body() input: input.removeTeamToUserInput):Promise<addTeamToUserResponse>{
    const teamId = input.teamId
    try{
      
      return await this.userService.removeTeamToUser(teamId);
    }catch(error){
      return { success: false, message: "an error has ocurred"};
    }
  }*/

 @Get('validateUser')
  async validateUser(@Body() validateUserInput: input.validateUserInput): Promise<validateUserResponse>{
    try{
      return await this.userService.validateUser(validateUserInput);
    }catch(error){
      return { success: false, message: "an error has ocurred" };
    }
    
  }
}

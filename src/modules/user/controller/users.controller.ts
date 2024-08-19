import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { Users } from '../entities/users.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //   @Get('/getUser')
  //   async getAllUsers(): Promise<Users[]> {
  //     try {
  //       return await this.userService.getAllUsers();
  //     } catch (error) {
  //       throw new Error('Error retrieving users');
  //     }
  //   }

  //   @Get('/:cid_no')
  //   async getUserByCid(@Param('cid_no') cid_no: string): Promise<Users> {
  //     return await this.userService.getUserByCid(cid_no);
  //   }

  //   @Get('/:id')
  //   async getUserById(
  //     @Param('id', new ParseUUIDPipe()) id: string,
  //   ): Promise<Users> {
  //     return await this.userService.getUserById(id);
  //   }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async createStudent(@Body() studentData: CreateUserDto) {
    return await this.userService.createNewUser(studentData);
  }
}

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserResponse } from './user-response.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerUser(
    @Body() studentData: CreateUserDto,
  ): Promise<{ msg: string }> {
    return this.userService.initiateUserCreation(studentData);
  }

  //   @Post('/verify')
  //   @UsePipes(ValidationPipe)
  //   async verifyOtpAndCreateUser(
  //     @Body() data: { user: CreateUserDto; otpCode: string },
  //   ): Promise<UserResponse> {
  //     return this.userService.verifyOtpAndCreateUser(data.user, data.otpCode);
  //   }

  @Post('/verify')
  @UsePipes(ValidationPipe)
  async verifyOtpAndCreateUser(
    @Body()
    data: {
      mobile_no: string;
      otpCode: string;
      userDto: Partial<CreateUserDto>;
    },
  ): Promise<UserResponse> {
    const { mobile_no, otpCode, userDto } = data;
    return this.userService.verifyOtpAndCreateUser(mobile_no, otpCode, userDto);
  }
}

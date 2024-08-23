import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async createStudent(@Body() studentData: CreateUserDto) {
    return await this.userService.createNewUser(studentData);
  }

  //   @Post('/VerifyOtpEmail')
  //   async verifyByEmail(
  //     @Body() data: { id: string; otp: string },
  //   ): Promise<void> {
  //     await this.userService.verifyByEmail(data.id, data.otp);
  //   }

  @Post('/VerifyOtpEmail')
  async verifyByEmail(
    @Body() data: { id: string; otp: string },
  ): Promise<string> {
    return await this.userService.verifyByEmail(data.id, data.otp);
  }

  ////////////////////////////////////////////////////////////////////

  @Post('/forgot-password')
  async forgotPasswordByEmail(@Body() data: { email: string }) {
    return await this.userService.forgotPasswordByEmail(data.email);
  }

  @Post('/reset-password')
  async resetPasswordByEmail(
    @Body() data: { id: string; otp: string; password: string },
  ) {
    return await this.userService.resetPasswordByEmail(
      data.id,
      data.otp,
      data.password,
    );
  }
}

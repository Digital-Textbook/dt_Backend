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

  @Post('/VerifyOtp')
  async verifyOtp(
    @Body() data: { phone: string; otp: string },
  ): Promise<{ msg: string }> {
    let prefix = '+975';
    let phone = prefix.concat(data.phone);
    return await this.userService.verifyOtpByPhone(phone, data.otp);
  }
  ////////////////////////////////////////////////////////////////////

  @Post('/VerifyOtp2')
  async verifyOtp2(
    @Body() data: { phone: string; otp: string },
  ): Promise<{ msg: string }> {
    let prefix = '+975';
    let phone = prefix.concat(data.phone);

    const verificationResult = await this.userService.verifyOtpByPhone(
      phone,
      data.otp,
    );

    if (verificationResult.msg === 'approved') {
      await this.userService.updateUserStatusByPhone(phone);
    }

    return verificationResult;
  }

  //   @Post('/VerifyOtpEmail')
  //   async verifyByEmail(@Body() data: { otp: string }): Promise<void> {
  //     await this.userService.verifyByEmail(data.otp);
  //   }
}

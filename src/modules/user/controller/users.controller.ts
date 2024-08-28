import { Body, Controller, Param, Post, Patch } from '@nestjs/common';
import { UserService } from '../service/users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateForgotPasswordDto } from '../../../common/dto/forgotPassword.dto';
import { CreateRegisterDto } from '../dto/createPermit.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/VerifyOtpEmail/:otp')
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'User cannot be verified' })
  async verifyByEmail(@Param('id') id: string, @Param('otp') otp: string) {
    return await this.userService.verifyByEmail(id, otp);
  }

  @Post('/forgot-password')
  @ApiOkResponse({ description: 'OTP is successfully send.' })
  @ApiBadRequestResponse({ description: 'OTP cannot be send.' })
  async forgotPasswordByEmail(@Body() data: CreateForgotPasswordDto) {
    return await this.userService.forgotPasswordByEmail(data.email);
  }

  @Post(':id/reset-password/:otp')
  @ApiOkResponse({ description: 'OTP is successfully verified.' })
  @ApiBadRequestResponse({ description: 'OTP cannot be verified.' })
  async resetPasswordVerifyByEmail(
    @Param('id') id: string,
    @Param('otp') otp: string,
  ) {
    return await this.userService.verifyByEmail(id, otp);
  }

  //////////////////////////////////////////////////////////////////////////
  @Post(':id/update-password/:password')
  @ApiOkResponse({ description: 'Password update is successfully done.' })
  @ApiBadRequestResponse({ description: 'Password update cannot be done.' })
  async updatePassword(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    return await this.userService.resetPassword(id, password);
  }

  @Post('/getCidDetail/:cidNo')
  @ApiCreatedResponse({ description: 'Details successfully fetched' })
  @ApiBadRequestResponse({ description: 'Details cannot be fetched.' })
  async getCidDetail(@Param('cidNo') cidNo: string) {
    return await this.userService.registerByCid(cidNo);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'Registration successfully!' })
  @ApiBadRequestResponse({ description: 'Registration cannot be done.' })
  async registerByPermit(@Body() userData: CreateRegisterDto) {
    return await this.userService.register(userData);
  }
}

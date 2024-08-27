import { Body, Controller, Param, Post, Patch } from '@nestjs/common';
import { UserService } from '../service/users.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateForgotPasswordDto } from '../../../common/dto/forgotPassword.dto';
import { updateRegister } from '../dto/updateRegistration.dto';
import { permitOrNon } from '../dto/createPermit.dto';

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

  @Post(':id/reset-password-byEmail/:password')
  @ApiOkResponse({ description: 'Reset password is successfully done.' })
  @ApiBadRequestResponse({ description: 'Reset password cannot be done.' })
  async resetPasswordByEmail(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    console.log('ID:', id);
    console.log('OTP:', password);
    return await this.userService.resetPasswordByEmail(id, password);
  }

  //////////////////////////////////////////////////////////////////////////
  @Post(':id/update-password/:password')
  @ApiOkResponse({ description: 'Password update is successfully done.' })
  @ApiBadRequestResponse({ description: 'Password update cannot be done.' })
  async updatePassword(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    console.log('ID:', id);
    console.log('Password:', password);
    return await this.userService.updatePassword(id, password);
  }

  @Post('/getCidDetail/:cidNo')
  @ApiCreatedResponse({ description: 'Details successfully fetched' })
  @ApiBadRequestResponse({ description: 'Details cannot be fetched.' })
  async getCidDetail(@Param('cidNo') cidNo: string) {
    return await this.userService.registerByCid(cidNo);
  }

  @Patch('/registerByCid/:id')
  @ApiCreatedResponse({ description: 'User updated successfully!' })
  @ApiBadRequestResponse({ description: 'User cannot be updated.' })
  async updateRegister(
    @Param('id') id: string,
    @Body() updateRegister: updateRegister,
  ) {
    return await this.userService.updateRegister(id, updateRegister);
  }

  //////// PERMIT OR NON-NHUTANESE USER ////////
  @Post('/registerByPermit')
  @ApiCreatedResponse({ description: 'Registration successfully!' })
  @ApiBadRequestResponse({ description: 'Registration cannot be done.' })
  async registerByPermit(@Body() userData: permitOrNon) {
    return await this.userService.registerByPermit(userData);
  }
}

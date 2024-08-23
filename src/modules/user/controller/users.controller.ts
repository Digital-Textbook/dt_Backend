import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/createUser.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '../entities/users.entity';
import { CreateForgotPasswordDto } from '../dto/forgotPassword.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: Users,
  })
  @ApiBadRequestResponse({ description: 'User cannot be registered' })
  @UsePipes(ValidationPipe)
  async createStudent(@Body() studentData: CreateUserDto) {
    return await this.userService.createNewUser(studentData);
  }

  @Post(':id/VerifyOtpEmail/:otp')
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'User cannot be verified' })
  async verifyByEmail(
    @Param('id') id: string,
    @Param('otp') otp: string,
  ): Promise<string> {
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
}

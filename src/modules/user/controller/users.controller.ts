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
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '../entities/users.entity';

@ApiTags('User')
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
  async verifyByEmail(
    @Param('id') id: string,
    @Param('otp') otp: string,
  ): Promise<string> {
    return await this.userService.verifyByEmail(id, otp);
  }

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

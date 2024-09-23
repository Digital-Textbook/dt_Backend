import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  BadRequestException,
  HttpCode,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Get,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRegisterDto } from '../dto/createRegister.dto';

@ApiTags('users')
@Controller('Digital-textbook/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/VerifyOtpEmail/:otp')
  @ApiOkResponse({ description: 'OTP is successfully verified.' })
  @ApiBadRequestResponse({ description: 'Invalid otp.' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while verifying otp!',
  })
  async verifyByEmail(@Param('id') id: string, @Param('otp') otp: string) {
    return await this.userService.verifyByEmail(id, otp);
  }

  @Post('/forgot-password/:email')
  @ApiOkResponse({ description: 'OTP is successfully send.' })
  @ApiBadRequestResponse({ description: 'Invalid email format!' })
  @ApiNotFoundResponse({ description: 'Email not found or invalid!' })
  @ApiInternalServerErrorResponse({ description: 'Error while sending otp!' })
  @HttpCode(200)
  async forgotPasswordByEmail(@Param('email') email: string) {
    return await this.userService.forgotPasswordByEmail(email);
  }

  @Post(':id/reset-password/:otp')
  @ApiOkResponse({ description: 'OTP is successfully verified.' })
  @ApiBadRequestResponse({ description: 'Invalid otp.' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while verifying otp!',
  })
  @HttpCode(200)
  async resetPasswordVerifyByEmail(
    @Param('id') id: string,
    @Param('otp') otp: string,
  ) {
    return await this.userService.verifyByEmail(id, otp);
  }

  //////////////////////////////////////////////////////////////////////////
  @Post(':id/update-password/:password')
  @ApiOkResponse({ description: 'Password successfully updated!' })
  @ApiBadRequestResponse({ description: 'Invalid user ID!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @ApiInternalServerErrorResponse({ description: 'Password update failed!' })
  @HttpCode(200)
  async updatePassword(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    return await this.userService.resetPassword(id, password);
  }

  @Post('/getCidDetail/:cidNo')
  @ApiOkResponse({ description: 'Details successfully fetched' })
  @ApiBadRequestResponse({ description: 'Invalid CID number!' })
  @ApiNotFoundResponse({ description: 'User with CID Number does not exist!' })
  @HttpCode(200)
  async getCidDetail(@Param('cidNo') cidNo: string) {
    return await this.userService.registerByCid(cidNo);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'Registration successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid registration data!' })
  @ApiConflictResponse({ description: 'Duplicate creation of user!' })
  @ApiInternalServerErrorResponse({
    description: 'Duplicated data or internal server error!',
  })
  async registerByPermit(@Body() userData: CreateRegisterDto) {
    return await this.userService.register(userData);
  }

  ////////////////////////////// User Update by Admin //////////////////////
  @Patch('/:id')
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user data!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server code while updating user!',
  })
  @UsePipes(ValidationPipe)
  async updateUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUserById(id);
  }

  /////////////////////////////// Delete By Admin //////////////////////
  @Delete('/:id')
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid User ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while deleting user!',
  })
  @UsePipes(ValidationPipe)
  async deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUserById(id);
  }

  ///////////////////////////// Get All User By Admin ///////////////
  @Get('/')
  @ApiOkResponse({ description: 'User successfully fetch from database!' })
  @ApiBadRequestResponse({ description: 'Invalid User ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching user!',
  })
  async getAllUser() {
    return await this.userService.getAllUser();
  }
}

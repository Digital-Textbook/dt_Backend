import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  HttpCode,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRegisterDto } from '../dto/createRegister.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { AuthGuard } from 'src/modules/guard/auth.guard';

@ApiTags('users')
@Controller('digital-textbook/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/forgot-password/:email')
  @ApiOkResponse({ description: 'OTP is successfully send.' })
  @ApiBadRequestResponse({ description: 'Invalid email format!' })
  @ApiNotFoundResponse({ description: 'Email not found or invalid!' })
  @HttpCode(200)
  async forgotPasswordByEmail(@Param('email') email: string) {
    return await this.userService.forgotPasswordByEmail(email);
  }

  @Post(':id/reset-password/:otp')
  @ApiOkResponse({ description: 'OTP is successfully verified.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiNotFoundResponse({ description: 'User ID not found!' })
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
  async registerByPermit(@Body() userData: CreateRegisterDto) {
    return await this.userService.register(userData);
  }

  ////////////////////////////// User Update by Admin //////////////////////
  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'Super Admin')
  @Permissions('update')
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user data!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.userService.updateUserById(id, userData);
  }

  /////////////////////////////// Delete By Admin //////////////////////
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'Super Admin')
  @Permissions('delete')
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid User ID!' })
  @UsePipes(ValidationPipe)
  async deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUserById(id);
  }

  ///////////////////////////// Get All User By Admin ///////////////
  @Get('/')
  @ApiOkResponse({ description: 'User successfully fetch from database!' })
  @ApiNotFoundResponse({ description: 'Users not found!' })
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'User successfully fetch from database!' })
  @ApiBadRequestResponse({ description: 'Invalid User ID!' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUserById(id);
  }

  //////////////////////////  Get user details //////////////////////
}

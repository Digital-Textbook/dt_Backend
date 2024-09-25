import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../../admin/dto/createAdmin.dto';
import { UpdateAdminDto } from '../../admin/dto/updateAdmin.dto';
import { Admin } from '../entities/admin.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateForgotPasswordDto } from 'src/common/dto/forgotPassword.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('admin')
@Controller('digital-textbook/admin')
// @UseGuards(AuthGuard())
// @ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @ApiOkResponse({ description: 'Admin and super admin fetch successfully.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching admin and super admin!',
  })
  async getAllAdmin() {
    return await this.adminService.getAllAdmin();
  }

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Admin registered successfully',
  })
  @ApiBadRequestResponse({ description: 'Admin cannot be registered' })
  @UsePipes(ValidationPipe)
  async createAdmin(@Body() adminData: CreateAdminDto) {
    return await this.adminService.createNewAdmin(adminData);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Admin successfully found.' })
  @ApiBadRequestResponse({ description: 'Admin does not exist' })
  async getAdminById(@Param('id', ParseUUIDPipe) id: string): Promise<Admin> {
    return await this.adminService.getAdminById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'Admin updated successfully.' })
  @ApiBadRequestResponse({ description: 'Admin cannot be updated' })
  @UsePipes(ValidationPipe)
  async updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminData: UpdateAdminDto,
  ) {
    return await this.adminService.updateAdmin(id, adminData);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Admin delete successfully.' })
  @ApiBadRequestResponse({ description: 'Admin cannot be deleted' })
  @UsePipes(ValidationPipe)
  async deleteAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.adminService.deleteAdminById(id);
  }

  //////////////////////////////////////////////////////////////////////////////

  @Post('/forgot-password/:email')
  @ApiOkResponse({ description: 'OTP is successfully send.' })
  @ApiBadRequestResponse({ description: 'OTP cannot be send.' })
  async forgotPasswordByEmail(@Param('email') email: string) {
    return await this.adminService.forgotPasswordByEmail(email);
  }

  @Post(':id/reset-password/:otp')
  @ApiOkResponse({ description: 'OTP is successfully verified.' })
  @ApiBadRequestResponse({ description: 'OTP cannot be verified.' })
  async resetPasswordVerifyByEmail(
    @Param('id') id: string,
    @Param('otp') otp: string,
  ) {
    return await this.adminService.verifyByEmail(id, otp);
  }

  @Post(':id/reset-password-by-email/:password')
  @ApiOkResponse({ description: 'Reset password is successfully done.' })
  @ApiBadRequestResponse({ description: 'Reset password cannot be done.' })
  async resetPasswordByEmail(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    return await this.adminService.resetPasswordByEmail(id, password);
  }

  @Patch('/:id/deactive')
  @UsePipes(ValidationPipe)
  async deactivateAccount(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adminService.deactivateAccount(id);
  }
}

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

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { Auth } from 'src/modules/guard/auth.guard';

@ApiTags('admin')
@Controller('digital-textbook/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/register')
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Roles('Super Admin')
  @Permissions('create')
  @ApiCreatedResponse({ description: 'Admin registered successfully' })
  @ApiBadRequestResponse({ description: 'Admin cannot be registered' })
  @UsePipes(ValidationPipe)
  async createAdmin(@Body() adminData: CreateAdminDto) {
    return await this.adminService.createNewAdmin(adminData);
  }

  @Get('/')
  @ApiOkResponse({ description: 'Admin and super admin fetch successfully.' })
  @ApiNotFoundResponse({ description: 'Admin not found!' })
  async getAllAdmin() {
    return await this.adminService.getAllAdmin();
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Admin successfully found.' })
  @ApiBadRequestResponse({ description: 'Invalid Admin ID' })
  @ApiNotFoundResponse({ description: 'Admin not found!' })
  async getAdminById(@Param('id', ParseUUIDPipe) id: string): Promise<Admin> {
    return await this.adminService.getAdminById(id);
  }

  @Patch('/:id')
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Roles('Super Admin')
  @Permissions('update')
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
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Roles('Super Admin')
  @Permissions('update')
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
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async deactivateAccount(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adminService.deactivateAccount(id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getAllAdmin(): Promise<Admin[]> {
    return await this.adminService.getAllAdmin();
  }

  @Post('/register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: Admin,
  })
  @ApiBadRequestResponse({ description: 'User cannot be registered' })
  @UsePipes(ValidationPipe)
  async createAdmin(@Body() adminData: CreateAdminDto) {
    return await this.adminService.createNewAdmin(adminData);
  }

  @Get('/:id')
  async getAdminById(@Param('id', ParseUUIDPipe) id: string): Promise<Admin> {
    return await this.adminService.getAdminById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminData: UpdateAdminDto,
  ) {
    return await this.adminService.updateAdmin(id, adminData);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  async deleteAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.adminService.deleteAdminById(id);
  }
}

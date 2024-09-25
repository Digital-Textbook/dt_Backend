import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleService } from '../service/role.service';
import { CreateRoleDto } from '../dto/createRole.dto';

@ApiTags('roles&permission')
@Controller('digital-textbook/role')
// @UseGuards(AuthGuard())
// @ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('/')
  @ApiOkResponse({ description: 'Role fetched successfully!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching Role',
  })
  async getRole() {
    return await this.roleService.findAll();
  }

  @Post('/')
  @ApiCreatedResponse({ description: 'Role created successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role data. Please try again',
  })
  async createRole(@Body() roleData: CreateRoleDto) {
    return await this.roleService.create(roleData);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'Role updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Role Id not found!' })
  async updateRole(@Param('id') id: string, @Body() roleData: CreateRoleDto) {
    return await this.roleService.update(id, roleData);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Role deleted successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Role Id not found!' })
  async deleteRole(@Param('id') id: string) {
    return await this.roleService.deleteRole(id);
  }
}

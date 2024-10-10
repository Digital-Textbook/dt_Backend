import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleService } from '../service/role.service';
import { CreateRoleDto } from '../../role/dto/createRole.dto';
import { UpdateRoleDto } from '../dto/updateRole.dto';
import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { AuthGuard } from 'src/modules/guard/auth.guard';

@ApiTags('roles&permission')
@Controller('digital-textbook/role')
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

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roleService.getRoleById(id);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('create')
  @ApiCreatedResponse({ description: 'Role created successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role data. Please try again',
  })
  async createRole(@Body() roleData: CreateRoleDto) {
    return await this.roleService.create(roleData);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('delete')
  @ApiOkResponse({ description: 'Role deleted successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Role Id not found!' })
  async deleteRole(@Param('id') id: string) {
    return await this.roleService.deleteRole(id);
  }

  @Get('/:id/permission')
  async getRoleForPermission(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roleService.getRoleForPermission(id);
  }

  @Patch(':id/permissions')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('update')
  @ApiOkResponse({ description: 'Role updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid Role Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Role Id not found!' })
  @ApiBody({
    description: 'Array of permission IDs to update the role with',
    schema: {
      properties: {
        permissionIds: { type: 'array', items: { type: 'string' } },
        roleData: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  })
  async updateRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[]; roleData: UpdateRoleDto },
  ) {
    const { permissionIds, roleData } = body;
    return await this.roleService.updateRolePermissions(
      id,
      permissionIds,
      roleData,
    );
  }
}

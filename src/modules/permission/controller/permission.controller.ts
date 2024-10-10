import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionService } from '../service/permission.service';
import { CreatePermissionDto } from '../dto/createPermission.dto';
import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { AuthGuard } from 'src/modules/guard/auth.guard';

@ApiTags('roles&permission')
@Controller('digital-textbook/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('/')
  @ApiOkResponse({ description: 'Permission fetched successfully!' })
  @ApiNotFoundResponse({ description: 'Permission not found!' })
  async getPermission() {
    return await this.permissionService.findAll();
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('create')
  @ApiCreatedResponse({ description: 'Permission created successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission data. Please check input data!',
  })
  async createPermission(@Body() permissionData: CreatePermissionDto) {
    return await this.permissionService.create(permissionData);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('update')
  @ApiOkResponse({ description: 'Permission updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission Id. Please check the input data!',
  })
  @ApiNotFoundResponse({ description: 'Permission Id not found!' })
  async updatePermission(
    @Param('id') id: string,
    @Body() permissionData: CreatePermissionDto,
  ) {
    return await this.permissionService.update(id, permissionData);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles('Super Admin')
  @Permissions('delete')
  @ApiOkResponse({ description: 'Permission deleted successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission Id. Please check the id!',
  })
  @ApiNotFoundResponse({ description: 'Permission Id not found!' })
  async deletePermission(@Param('id') id: string) {
    return await this.permissionService.deletePermission(id);
  }

  @Get('roles')
  @ApiOkResponse({ description: 'Permission fetched successfully!' })
  @ApiNotFoundResponse({ description: 'Permission not found!' })
  async getPermissionsWithRoles() {
    return await this.permissionService.getPermissionsWithRoles();
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Permission fetched successfully!' })
  @ApiNotFoundResponse({ description: 'Permission not found!' })
  async permission(@Param('id', ParseUUIDPipe) id: string) {
    return await this.permissionService.getPermissionById(id);
  }
}

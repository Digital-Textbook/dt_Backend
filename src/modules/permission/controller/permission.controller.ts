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
import { PermissionService } from '../service/permission.service';
import { CreatePermissionDto } from '../dto/createPermission.dto';

@ApiTags('roles&permission')
@Controller('digital-textbook/permission')
// @UseGuards(AuthGuard())
// @ApiBearerAuth()
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('/')
  @ApiOkResponse({ description: 'Permission fetched successfully!' })
  @ApiNotFoundResponse({ description: 'Permission not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching permission',
  })
  async getPermission() {
    return await this.permissionService.findAll();
  }

  @Post('/')
  @ApiCreatedResponse({ description: 'Permission created successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission data. Please try again',
  })
  async createPermission(@Body() permissionData: CreatePermissionDto) {
    return await this.permissionService.create(permissionData);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'Permission updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Permission Id not found!' })
  async updatePermission(
    @Param('id') id: string,
    @Body() permissionData: CreatePermissionDto,
  ) {
    return await this.permissionService.update(id, permissionData);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Permission deleted successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid permission Id. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Permission Id not found!' })
  async deletePermission(@Param('id') id: string) {
    return await this.permissionService.deletePermission(id);
  }

  @Get('roles')
  async getPermissionsWithRoles() {
    return await this.permissionService.getPermissionsWithRoles();
  }
}

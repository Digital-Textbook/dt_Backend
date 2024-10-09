import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/loginUser.dto';
import { LoginAdminDto } from '../dto/admin-signin.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Users } from 'src/modules/user/entities/users.entity';

@ApiTags('auth')
@Controller('digital-textbook/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User successfully login!' })
  @ApiBadRequestResponse({ description: 'User cannot login!' })
  async signin(
    @Body() signinData: LoginUserDto,
  ): Promise<{ accessToken: string; user: Partial<Users> }> {
    return await this.authService.SignIn(signinData);
  }

  @Post('/admin/login')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Admin successfully login!' })
  @ApiBadRequestResponse({ description: 'Invalid admin data!' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized admin user!' })
  @ApiConflictResponse({
    description: 'User already logged in another devices!',
  })
  async adminSignIn(@Body() adminSignInData: LoginAdminDto) {
    return await this.authService.adminSignIn(adminSignInData);
  }

  @Post('/:id/user-logout')
  @ApiOkResponse({ description: 'User successfully logout!' })
  @ApiBadRequestResponse({ description: 'User cannot logout!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async userLogout(@Param('id') id: string) {
    return await this.authService.userLogOut(id);
  }

  @Post('/:id/admin-logout')
  @ApiOkResponse({ description: 'User successfully logout!' })
  @ApiBadRequestResponse({ description: 'User cannot logout!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async adminLogout(@Param('id') id: string) {
    return await this.authService.adminLogOut(id);
  }

  @Get('/:id')
  async getAdminProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.authService.adminProfile(id);
  }
}

import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/loginUser.dto';
import { LoginAdminDto } from '../dto/admin-signin.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Users } from 'src/modules/user/entities/users.entity';

@Controller('auth')
@ApiTags('auth')
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
  @ApiBadRequestResponse({ description: 'Admin cannot login!' })
  async adminSignIn(
    @Body() adminSignInData: LoginAdminDto,
  ): Promise<{ adminAccessToken }> {
    return await this.authService.adminSignIn(adminSignInData);
  }

  @Post('/:id/user-logout')
  @ApiOkResponse({ description: 'User successfully logout!' })
  @ApiBadRequestResponse({ description: 'User cannot logout!' })
  async userLogout(@Param('id') id: string) {
    return await this.authService.userLogOut(id);
  }

  @Post('/:id/admin-logout')
  @ApiOkResponse({ description: 'User successfully logout!' })
  @ApiBadRequestResponse({ description: 'User cannot logout!' })
  async adminLogout(@Param('id') id: string) {
    return await this.authService.adminLogOut(id);
  }
}

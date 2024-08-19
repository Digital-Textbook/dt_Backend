import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/loginUser.dto';
import { LoginAdminDto } from '../dto/admin-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async signin(
    @Body() signinData: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.SignIn(signinData);
  }

  @Post('/admin/login')
  @UsePipes(ValidationPipe)
  async adminSignIn(
    @Body() adminSignInData: LoginAdminDto,
  ): Promise<{ adminAccessToken }> {
    return await this.authService.adminSignIn(adminSignInData);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/loginUser.dto';
import { LoginAdminDto } from '../dto/admin-signin.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
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

  ////////////////////////////////////////////////
  //   @Get('fetch-citizen-details-from-data-hub/:cid')
  //   //@Auth()
  //   @HttpCode(200)
  //   @ApiOkResponse({
  //     description: 'Get Citizen details from census',
  //   })
  //   fetchCitizenDetailsFromDataHub(@Param('cid') cid: string) {
  //     return this.authService.fetchCitizenDetailsFromDataHub(cid);
  //   }
}

import {
  Body,
  Controller,
  Param,
  Patch,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { UserProfileService } from '../service/UserProfile.service';
import { UserProfile } from '../entities/UserProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserProfileDto } from '../dto/createUserProfile.dto';
import { UpdateUserProfilePassword } from '../dto/updatePassword.dto';

@ApiTags('user-profile')
@Controller('user-profile')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Post('/:id/user-profile')
  async createProfile(
    @Param('id') id: string,
    @Body() userProfileData: CreateUserProfileDto,
  ) {
    return await this.userProfileService.createUserProfile(id, userProfileData);
  }

  @Get('/:id/user-profile')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully fetched!' })
  @ApiBadRequestResponse({ description: 'User profile not found!' })
  async getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userProfileService.getProfileById(id);
  }

  @Patch('/:id/user-profile')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully updated!' })
  @ApiBadRequestResponse({ description: 'User profile cannot updated!' })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() studentData: UpdateProfileDto,
  ) {
    return await this.userProfileService.updateProfile(id, studentData);
  }

  @Delete('/:id/user-profile')
  @ApiOkResponse({ description: 'User profile successfully deleted!' })
  @ApiBadRequestResponse({ description: 'User profile cannot be deleted!' })
  async deleteUserProfile(@Param('id') id: string) {
    return await this.userProfileService.deleteProfile(id);
  }

  @Patch('/:id/user-profile/setting')
  @ApiOkResponse({ description: 'User password upadted successfully!' })
  @ApiBadRequestResponse({ description: 'User password cannot updated!' })
  async changePassword(
    @Param('id') id: string,
    @Body() data: UpdateUserProfilePassword,
  ) {
    return await this.userProfileService.changePassword(id, data);
  }
}

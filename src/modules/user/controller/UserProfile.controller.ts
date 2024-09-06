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

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Post('/')
  async createProfile(@Body() userProfileData: CreateUserProfileDto) {
    return await this.userProfileService.createUserProfile(userProfileData);
  }

  @Get('/:id/profile')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully fetched!' })
  @ApiBadRequestResponse({ description: 'User profile not found!' })
  async getProfileById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserProfile> {
    return await this.userProfileService.getProfileById(id);
  }

  @Patch('/:id/profile')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully updated!' })
  @ApiBadRequestResponse({ description: 'User profile cannot updated!' })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() studentData: UpdateProfileDto,
  ) {
    return await this.userProfileService.updateProfile(id, studentData);
  }
}

import {
  Body,
  Controller,
  Param,
  Patch,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserProfileService } from '../service/UserProfile.service';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserProfileDto } from '../dto/createUserProfile.dto';
import { UpdateUserProfilePassword } from '../dto/updatePassword.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@ApiTags('user-profile')
@Controller('digital-textbook/user-profile')
// @UseGuards(AuthGuard())
// @ApiBearerAuth()
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Post('/:id')
  @ApiCreatedResponse({ description: 'User profile successfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid user data!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @ApiConflictResponse({ description: 'Duplicate entity!' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload user profile image and user data',
    type: CreateUserProfileDto,
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async createProfile(
    @Param('id') id: string,
    @UploadedFile() profileImage: BufferedFile,
    @Body() userProfileData: CreateUserProfileDto,
  ) {
    return await this.userProfileService.createUserProfile(
      id,
      userProfileData,
      profileImage,
    );
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully fetched!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userProfileService.getProfileById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'User profile successfully updated!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @ApiConflictResponse({ description: 'Duplicate entry!' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload user profile image and user data',
    type: UpdateProfileDto,
  })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() studentData: UpdateProfileDto,
    @UploadedFile() profileImage: BufferedFile,
  ) {
    return await this.userProfileService.updateProfile(
      id,
      studentData,
      profileImage,
    );
  }

  @Delete('/:userId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User profile successfully deleted!' })
  @ApiBadRequestResponse({ description: 'Invalid user Id!' })
  async deleteUserProfile(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.userProfileService.deleteProfile(userId);
  }

  @Patch('/:userId/setting')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'User password upadted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid data!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async changePassword(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateUserProfilePassword,
  ) {
    return await this.userProfileService.changePassword(userId, data);
  }
}

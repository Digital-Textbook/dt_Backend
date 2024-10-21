import {
  Body,
  Controller,
  Patch,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserProfileService } from '../service/UserProfile.service';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { UserAuthGuard } from 'src/modules/guard/user-auth.guard';

@ApiTags('user-profile')
@Controller('digital-textbook/user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Post('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
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
    @Request() req,
    @UploadedFile() profileImage: BufferedFile,
    @Body() userProfileData: CreateUserProfileDto,
  ) {
    const id = req.user.id;
    return await this.userProfileService.createUserProfile(
      id,
      userProfileData,
      profileImage,
    );
  }

  @Get('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User profile successfully fetched!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async getProfileById(@Request() req) {
    const id = req.user.id;
    return await this.userProfileService.getProfileById(id);
  }

  @Patch('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
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
    @Request() req,
    @Body() studentData: UpdateProfileDto,
    @UploadedFile() profileImage: BufferedFile,
  ) {
    const id = req.user.id;
    return await this.userProfileService.updateProfile(
      id,
      studentData,
      profileImage,
    );
  }

  @Delete('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User profile successfully deleted!' })
  @ApiBadRequestResponse({ description: 'Invalid user Id!' })
  async deleteUserProfile(@Request() req) {
    const id = req.user.id;
    return await this.userProfileService.deleteProfile(id);
  }

  @Patch('/setting')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User password upadted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid data!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  async changePassword(
    @Request() req,
    @Body() data: UpdateUserProfilePassword,
  ) {
    const id = req.user.id;
    return await this.userProfileService.changePassword(id, data);
  }
}

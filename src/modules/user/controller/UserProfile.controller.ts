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
} from '@nestjs/common';
import { StudentProfileService } from '../service/UserProfile.service';
import { UserProfile } from '../entities/UserProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserProfileController {
  constructor(private studentProfileService: StudentProfileService) {}

  @Get('/profile/:id')
  async getProfileById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserProfile> {
    return await this.studentProfileService.getProfileById(id);
  }

  @Patch('/profile/:id')
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() studentData: UpdateProfileDto,
  ) {
    return await this.studentProfileService.updateProfile(id, studentData);
  }
}

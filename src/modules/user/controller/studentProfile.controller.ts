import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StudentProfileService } from '../service/studentProfile.service';
import { StudentProfile } from '../entities/studentProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';

@Controller('user')
export class StudentProfileController {
  constructor(private studentProfileService: StudentProfileService) {}

  @Get('/profile')
  async getAllProfile(): Promise<StudentProfile[]> {
    try {
      return await this.studentProfileService.getAllProfile();
    } catch (error) {
      throw new Error('Error retrieving profile');
    }
  }

  @Get('/profile/:id')
  async getProfileById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentProfile> {
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

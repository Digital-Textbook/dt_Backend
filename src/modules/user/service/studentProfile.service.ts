import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entities/studentProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(StudentProfile)
    private profileRepository: Repository<StudentProfile>,
  ) {}

  async getAllProfile(): Promise<StudentProfile[]> {
    const profiles = await this.profileRepository.find();
    console.log('Retrieved Profiles:', profiles);
    console.log('Retrieved Profiles');
    return profiles;
  }

  async getProfileById(id: string): Promise<StudentProfile> {
    if (!id) {
      throw new Error('ID is required');
    }

    const profile = await this.profileRepository.findOne({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`No matching profile found with ID: ${id}`);
    }
    return profile;
  }

  async updateProfile(
    id: string,
    studentData: UpdateProfileDto,
  ): Promise<StudentProfile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} was not found`);
    }

    Object.assign(profile, studentData);

    return await this.profileRepository.save(profile);
  }
}

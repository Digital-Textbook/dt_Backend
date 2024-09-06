import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { CreateUserProfileDto } from '../dto/createUserProfile.dto';
import { Users } from '../entities/users.entity';
import { School } from 'src/modules/school/entities/school.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
  ) {}

  async createUserProfile(userProfileData: CreateUserProfileDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userProfileData.userId },
    });
    const existingSchool = await this.schoolRepository.findOne({
      where: { id: userProfileData.schoolId },
    });

    if (!existingUser || !existingSchool) {
      throw new NotFoundException('Invalid user or School data');
    }

    const userProfile = {
      name: userProfileData.name,
      studentCode: userProfileData.studentCode,
      mobileNo: userProfileData.mobileNo,
      class: userProfileData.class,
      schoolId: existingSchool,
      gender: userProfileData.gender,
      dateOfBirth: userProfileData.dateOfBirth,
      userId: existingUser,
      dzongkhagId: userProfileData.dzongkhagId,
    };

    return await this.profileRepository.save(userProfile);
  }

  async getProfileById(id: string): Promise<UserProfile> {
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
    userData: UpdateProfileDto,
  ): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} was not found`);
    }

    Object.assign(profile, userData);

    return await this.profileRepository.save(profile);
  }
}

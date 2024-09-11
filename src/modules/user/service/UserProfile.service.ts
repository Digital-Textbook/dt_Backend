import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { CreateUserProfileDto } from '../dto/createUserProfile.dto';
import { Users } from '../entities/users.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
  ) {}

  async createUserProfile(
    userId: string,
    userProfileData: CreateUserProfileDto,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    const existingSchool = await this.schoolRepository.findOne({
      where: { id: userProfileData.schoolId },
    });

    const existingDzongkhag = await this.dzongkhagRepository.findOne({
      where: { id: userProfileData.dzongkhagId },
    });

    if (!existingUser || !existingSchool || !existingDzongkhag) {
      throw new NotFoundException('Invalid data provided by the user!');
    }

    const userProfile = this.profileRepository.create({
      name: userProfileData.name,
      studentCode: userProfileData.studentCode,
      mobileNo: userProfileData.mobileNo,
      class: userProfileData.class,
      gender: userProfileData.gender,
      dateOfBirth: userProfileData.dateOfBirth,
      user: existingUser,
      school: existingSchool,
      dzongkhag: existingDzongkhag,
    });

    await this.profileRepository.save(userProfile);

    return {
      id: userProfile.id,
      name: userProfile.name,
      studentCode: userProfile.studentCode,
      mobileNo: userProfile.mobileNo,
      class: userProfile.class,
      gender: userProfile.gender,
      dateOfBirth: userProfile.dateOfBirth,
      userId: userProfile.user.id,
      schoolName: userProfile.school.schoolName,
      dzongkhagName: userProfile.dzongkhag.name,
    };
  }

  async getProfileById(id: string) {
    if (!id) {
      throw new Error('ID is required');
    }

    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['school', 'dzongkhag'],
      select: ['id', 'name', 'studentCode', 'class', 'gender', 'dateOfBirth'],
    });

    if (!profile) {
      throw new NotFoundException(`No matching profile found with ID: ${id}`);
    }

    return {
      id: profile.id,
      name: profile.name,
      studentCode: profile.studentCode,
      class: profile.class,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      schoolName: profile.school?.schoolName,
      dzongkhagName: profile.dzongkhag?.name,
    };
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

  async deleteProfile(id: string) {
    const result = await this.profileRepository.delete(id);

    if (result.affected === 0) {
      throw new ConflictException(
        `Error deleting user profile with User ID ${id}!`,
      );
    }

    return { msg: 'User profile successfully deleted!' };
  }
}

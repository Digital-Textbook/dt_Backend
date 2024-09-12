import {
  BadRequestException,
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
import * as bcrypt from 'bcrypt';
import { UpdateUserProfilePassword } from '../dto/updatePassword.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Console } from 'console';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
    private minioClientService: MinioClientService,
  ) {}

  async createUserProfile(
    userId: string,
    userProfileData: CreateUserProfileDto,
    profileImage: BufferedFile,
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

    const uploadProfile =
      await this.minioClientService.uploadProfile(profileImage);

    const userProfile = {
      name: userProfileData.name,
      studentCode: userProfileData.studentCode,
      mobileNo: userProfileData.mobileNo,
      class: userProfileData.class,
      gender: userProfileData.gender,
      dateOfBirth: userProfileData.dateOfBirth,
      user: existingUser,
      dzongkhag: existingDzongkhag,
      school: existingSchool,
      profileImageUrl: uploadProfile.url,
    };

    return await this.profileRepository.save(userProfile);
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
    profileImage: BufferedFile,
  ): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} was not found`);
    }

    Object.assign(profile, userData);

    if (profileImage) {
      const oldProfileImage = profile.profileImageUrl;

      if (!oldProfileImage) {
        console.log('No previous profile image found.');
      } else {
        const oldFileName = oldProfileImage.split('/').pop();
        await this.minioClientService.deleteProfileImage(oldFileName);
      }

      const newProfileImage =
        await this.minioClientService.uploadProfile(profileImage);
      profile.profileImageUrl = newProfileImage.url;

      await this.profileRepository.save(profile);
    }

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

  async changePassword(id: string, data: UpdateUserProfilePassword) {
    const existingUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      throw new NotFoundException('Invalid user!');
    }
    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect!');
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match!',
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    existingUser.password = hashedPassword;
    await this.userRepository.save(existingUser);

    return { message: 'Password updated successfully!' };
  }
}

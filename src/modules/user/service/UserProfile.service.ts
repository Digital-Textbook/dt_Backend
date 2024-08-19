import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

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

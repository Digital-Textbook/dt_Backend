import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../entities/users.entity';
import { Students } from '../entities/students.entity';
import { UserProfile } from '../entities/UserProfile.entity';
import { OtpEntity } from '../entities/otp.entity';

import { CreateUserDto } from '../dto/createUser.dto';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  private saltRounds = 10;
  private twilioClient: Twilio;
  private readonly otpCache = new Map<
    string,
    { otp: string; expiresAt: Date }
  >();

  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Students) private studentRepository: Repository<Students>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async getStudentByCid(cid_no: string): Promise<Students> {
    if (!cid_no) {
      throw new Error('CID No is required');
    }

    const student = await this.studentRepository.findOne({
      where: { cid_no },
    });

    if (!student) {
      throw new NotFoundException(
        `No matching student data found for the provided CID No: ${cid_no}`,
      );
    }

    return student;
  }

  async createNewUser(user: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        cid_no: user.cid_no,
        student_code: user.student_code,
        status: 'inactive',
      },
    });

    const emailExists = await this.usersRepository.findOne({
      where: {
        email: user.email,
        status: 'active',
      },
    });

    if (emailExists) {
      throw new BadRequestException('Email is already taken');
    }

    const userPhone = await this.usersRepository.findOne({
      where: {
        mobile_no: user.mobile_no,
        status: 'active',
      },
    });

    if (userPhone) {
      throw new BadRequestException('Phone is already taken');
    }

    if (existingUser) {
      if (user.otpOption === 'phone') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        if (existingUser) {
          existingUser.name = user.name;
          existingUser.mobile_no = user.mobile_no;
          existingUser.email = user.email;
          existingUser.user_type = user.user_type;
          existingUser.password = await bcrypt.hash(
            user.password,
            this.saltRounds,
          );
          existingUser.updated_at = new Date(Date.now());

          await this.usersRepository.save(existingUser);

          const profile = await this.userProfileRepository.findOne({
            where: {
              student_code: user.student_code,
            },
          });

          profile.name = user.name;
          profile.mobile_no = user.mobile_no;
          profile.email = user.email;
          profile.updated_at = new Date(Date.now());

          await this.userProfileRepository.save(profile);

          let otpEntity = await this.otpRepository.findOne({
            where: {
              user: { id: existingUser.id },
            },
          });

          if (otpEntity) {
            otpEntity.otp = otp;
            otpEntity.otpExpiresAt = otpExpiresAt;
            otpEntity.updatedAt = new Date(Date.now());
          } else {
            otpEntity = this.otpRepository.create({
              otp,
              otpExpiresAt,
              user: existingUser,
            });
          }

          await this.otpRepository.save(otpEntity);

          let prefix = '+975';
          let phone = prefix.concat(user.mobile_no);

          await this.sendOtp(phone, otp);

          console.log(`OTP sent to phone: ${otp}`);
        } else {
          throw new NotFoundException(
            'No inactive user found with the provided cid_no and student_code',
          );
        }
      } else if (user.otpOption === 'email') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        if (existingUser) {
          existingUser.name = user.name;
          existingUser.mobile_no = user.mobile_no;
          existingUser.email = user.email;
          existingUser.user_type = user.user_type;
          existingUser.password = await bcrypt.hash(
            user.password,
            this.saltRounds,
          );
          existingUser.updated_at = new Date(Date.now());

          await this.usersRepository.save(existingUser);

          const profile = await this.userProfileRepository.findOne({
            where: {
              student_code: user.student_code,
            },
          });

          profile.name = user.name;
          profile.mobile_no = user.mobile_no;
          profile.email = user.email;
          profile.updated_at = new Date(Date.now());

          await this.userProfileRepository.save(profile);

          let otpEntity = await this.otpRepository.findOne({
            where: {
              user: { id: existingUser.id },
            },
          });

          if (otpEntity) {
            otpEntity.otp = otp;
            otpEntity.otpExpiresAt = otpExpiresAt;
            otpEntity.updatedAt = new Date(Date.now());
          } else {
            otpEntity = this.otpRepository.create({
              otp,
              otpExpiresAt,
              user: existingUser,
            });
          }

          await this.otpRepository.save(otpEntity);

          await this.mailerService.sendMail({
            to: existingUser.email,
            subject: 'Your OTP Code',
            template: './otp',
            context: {
              otp,
              name: existingUser.name,
            },
          });

          console.log(`OTP generated for email: ${otp}`);
        } else {
          throw new NotFoundException(
            'No inactive user found with the provided cid_no and student_code',
          );
        }

        return {
          msg: 'User updated and OTP sent or generated for existing inactive user.',
        };
      }

      return { msg: 'OTP sent or generated for existing inactive user.' };
    }

    const student = await this.getStudentByCid(user.cid_no);

    if (student) {
      const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

      let newUser = this.usersRepository.create({
        ...user,
        password: hashedPassword,
        status: 'inactive',
      });

      const savedUser = await this.usersRepository.save(newUser);

      const newProfile = this.userProfileRepository.create({
        user: savedUser,
        name: student.name,
        student_code: student.student_code,
        class: student.class,
        school: student.school,
        dzongkhag: student.dzongkhag,
        mobile_no: `+975${user.mobile_no}`,
        email: user.email,
      });

      const savedProfile = await this.userProfileRepository.save(newProfile);

      savedUser.profile = savedProfile;
      await this.usersRepository.save(savedUser);

      if (user.otpOption === 'phone') {
        let prefix = '+975';
        let phone = prefix.concat(user.mobile_no);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const newOtpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          user: savedUser,
        });
        await this.otpRepository.save(newOtpEntity);

        await this.sendOtp(phone, otp);

        console.log(`OTP sent to phone: ${otp}`);
      } else if (user.otpOption === 'email') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const newOtpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          user: savedUser,
        });
        await this.otpRepository.save(newOtpEntity);

        await this.mailerService.sendMail({
          to: savedProfile.email,
          subject: 'Your OTP Code',
          template: './otp',
          context: {
            otp,
            name: savedProfile.name,
          },
        });

        console.log(`OTP generated for email: ${otp}`);
      }

      return savedUser;
    } else {
      throw new NotFoundException(
        `No matching student data found for the provided CID No: ${user.cid_no}`,
      );
    }
  }

  async sendOtp(phoneNumber: string, otp: string) {
    const url = this.configService.get<string>('PLAYSMS_URL');
    const username = this.configService.get<string>('PLAYSMS_USERNAME');
    const token = this.configService.get<string>('PLAYSMS_TOKEN');
    const operationType = this.configService.get<string>(
      'PLAYSMS_OPERATION_TYPE',
    );
    const senderName = 'Digital Textbook';

    const params = new URLSearchParams({
      u: username,
      h: token,
      op: operationType,
      to: phoneNumber,
      from: senderName,
      msg: `Your OTP code is ${otp}`,
    }).toString();

    console.log(params);
    try {
      const response = await this.httpService.axiosRef.get(`${url}?${params}`);
      return { msg: response.data };
    } catch (error) {
      console.error('Error sending OTP:', error.message || error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyByEmail(id: string, otp: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User ID not found');
    }

    const otpEntry = await this.otpRepository.findOne({
      where: {
        user: { id: id },
      },
    });

    console.log('OTP Entity: ', otpEntry);

    if (!otpEntry) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpEntry.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    user.status = 'active';
    await this.usersRepository.save(user);

    await this.otpRepository.delete(otpEntry.id);

    return `User is verified and status updated to active.`;
  }

  ////////////////////////
  async forgotPasswordByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email, status: 'active' },
    });

    console.log('Email by user: ', user);

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const existingUser = await this.usersRepository.findOne({
        where: {
          email: user.email,
          status: 'active',
        },
      });
      let otpEntity = await this.otpRepository.findOne({
        where: {
          user: { id: existingUser.id },
        },
      });

      if (otpEntity) {
        otpEntity.otp = otp;
        otpEntity.otpExpiresAt = otpExpiresAt;
        otpEntity.updatedAt = new Date(Date.now());
      } else {
        otpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          user: existingUser,
        });
      }

      await this.otpRepository.save(otpEntity);

      await this.mailerService.sendMail({
        to: existingUser.email,
        subject: 'Your OTP Code',
        template: './otp',
        context: {
          otp,
          name: existingUser.name,
        },
      });

      return {
        msg: 'OTP successfully send',
        user,
      };
    } else {
      throw new NotFoundException(
        'User is not verifief with the provided cid_no and student_code',
      );
    }
  }

  async resetPasswordByEmail(id: string, otp: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User ID not found');
    }

    const otpEntry = await this.otpRepository.findOne({
      where: {
        user: { id: id },
      },
    });

    console.log('OTP Entity: ', otpEntry);

    if (!otpEntry) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpEntry.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return {
      msg: 'Password is update for this user',
      user,
    };
  }
}

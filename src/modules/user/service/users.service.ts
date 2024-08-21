import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUser.dto';
import { Students } from '../entities/students.entity';
import { UserProfile } from '../entities/UserProfile.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { OtpEntity } from '../entities/otp.entity';

import { MailerService } from '@nestjs-modules/mailer';

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
      where: [
        { cid_no: user.cid_no, status: 'inactive' },
        { mobile_no: user.mobile_no, status: 'inactive' },
        { student_code: user.student_code, status: 'inactive' },
        { email: user.email, status: 'inactive' },
      ],
    });

    if (existingUser) {
      if (user.otpOption === 'phone') {
        let prefix = '+975';
        let phone = prefix.concat(user.mobile_no);

        const otpResponse = await this.sendOtp(phone);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const newOtpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          user: existingUser,
        });
        await this.otpRepository.save(newOtpEntity);

        console.log(`OTP sent to phone: ${otpResponse.msg}`);
      } else if (user.otpOption === 'email') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const otpEntity = await this.otpRepository.findOne({
          where: {
            user: { id: existingUser.id },
          },
        });

        if (otpEntity) {
          otpEntity.otp = otp;
          otpEntity.otpExpiresAt = otpExpiresAt;
          otpEntity.createdAt = new Date(Date.now());
          otpEntity.updatedAt = new Date(Date.now());

          await this.otpRepository.save(otpEntity);
        } else {
          const newOtpEntity = this.otpRepository.create({
            otp,
            otpExpiresAt,
            user: existingUser,
          });

          await this.otpRepository.save(newOtpEntity);
        }

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

        const otpResponse = await this.sendOtp(phone);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const newOtpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          user: savedUser,
        });
        await this.otpRepository.save(newOtpEntity);

        console.log(`OTP sent to phone: ${otpResponse.msg}`);
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

  async sendOtp(phoneNumber: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );
    let msg = '';

    await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' })
      .then((verification) => {
        msg = verification.status;
      });

    return { msg: msg };
  }

  async verifyOtpByPhone(phoneNumber: string, code: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );
    let msg = '';
    await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: code })
      .then((verification) => (msg = verification.status));
    return { msg: msg };
  }

  async updateUserStatusByPhone(phone: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { mobile_no: phone },
    });

    if (user) {
      user.status = 'active';
      await this.usersRepository.save(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async verifyByEmail(id: string, otp: string): Promise<void> {
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

    console.log(`User ${user.id} verified and status updated to active.`);
  }
}

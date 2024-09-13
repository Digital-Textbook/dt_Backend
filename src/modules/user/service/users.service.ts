import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../entities/users.entity';
import { UserProfile } from '../entities/UserProfile.entity';
import { OtpEntity } from '../entities/otp.entity';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Gender } from 'src/constants/gender';
import { DataHubApiService } from './datahub.service';
import { userType } from 'src/constants/user-type';
import { Status } from 'src/constants/status';
import { CreateRegisterDto } from '../dto/createRegister.dto';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly mailerService: MailerService,
    private dataHubApiService: DataHubApiService,
  ) {}
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

  async verifyByEmail(id: string, otp: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpEntry = await this.otpRepository.findOne({
      where: {
        user: { id: id },
      },
    });

    if (!otpEntry) {
      throw new BadRequestException('No OTP entry found');
    }

    // console.log('Stored OTP (hashed):', otpEntry.otp);
    // console.log('Provided OTP:', otp);

    const isValidOtp = await bcrypt.compare(otp, otpEntry.otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpEntry.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    user.status = Status.ACTIVE;
    await this.usersRepository.save(user);

    return { user, msg: `OTP is verified.` };
  }

  //   ////////////////////////
  async forgotPasswordByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email, status: Status.ACTIVE },
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const hashedOtp = await bcrypt.hash(otp, 10);

      console.log('OTP: ', otp);
      console.log('Hashed OTP: ', hashedOtp);

      const existingUser = await this.usersRepository.findOne({
        where: {
          email: user.email,
          status: Status.ACTIVE,
        },
      });
      let otpEntity = await this.otpRepository.findOne({
        where: {
          user: { id: existingUser.id },
        },
      });

      if (otpEntity) {
        otpEntity.otp = hashedOtp;
        otpEntity.otpExpiresAt = otpExpiresAt;
        otpEntity.updatedAt = new Date(Date.now());
      } else {
        otpEntity = this.otpRepository.create({
          otp: hashedOtp,
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
        'User is not verified with the provided email',
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  async resetPassword(id: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    console.log('Users: ', user);
    if (!user) {
      throw new NotFoundException('User ID not found');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    user.password = hashedPassword;

    const updated = await this.usersRepository.save(user);

    if (!updated) {
      throw new InternalServerErrorException('Password update failed!');
    } else {
      return {
        msg: 'Password is updated for this user',
        user,
      };
    }
  }
  ///////////////////////

  async fetchCitizenDetailsFromDataHub(cid: string) {
    const censusData = await this.dataHubApiService.getCensusDataByCid(cid);

    let name = `${censusData.firstName}`;

    if (censusData.middleName !== null) {
      name = `${name} ${censusData.middleName}`;
    }

    if (censusData.lastName !== null) {
      name = `${name} ${censusData.lastName}`;
    }

    const dateOfBirth = censusData.dob.split('/').reverse().join('-');

    const gender = censusData.gender === 'M' ? Gender.MALE : Gender.FEMALE;

    const contactNo = censusData.mobileNumber;

    const citizenDto = {
      cidNo: cid,
      name,
      gender,
      dateOfBirth,
      contactNo,
    };

    return citizenDto;
  }

  /////////////// CID Details //////////////////
  async registerByCid(cidNo: string) {
    if (cidNo.length !== 11 || !/^\d+$/.test(cidNo)) {
      throw new BadRequestException(
        'Invalid CID number. It must be 11 digits and contain only numbers.',
      );
    }

    const user = await this.fetchCitizenDetailsFromDataHub(cidNo);

    if (!user) {
      throw new NotFoundException(`Details with CID ${cidNo} not found!`);
    }
    return user;
  }

  async sendMailOtp(user: Users, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your OTP Code',
        template: './otp',
        context: {
          otp: otp,
          name: user.name,
        },
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new InternalServerErrorException(
        "OTP couldn't be sent. Please try again",
      );
    }
  }

  async phoneOtp(mobileNo: string, otp: string) {
    let prefix = '+975';
    let phone = prefix.concat(mobileNo);
    try {
      await this.sendOtp(phone, otp);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new InternalServerErrorException(
        "OTP couldn't be sent. Please try again",
      );
    }
  }

  async generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return { otp: otp, expiresAt: otpExpiresAt };
  }

  async register(userData: CreateRegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {
        cidNo: userData.cidNo,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with Cid or Permit or Document ID ${userData.cidNo} already exist`,
      );
    }

    const existingEmail = await this.usersRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (existingEmail) {
      throw new ConflictException(
        `User with email ${userData.email} already exists`,
      );
    }

    const existingMobileNo = await this.usersRepository.findOne({
      where: {
        mobileNo: userData.mobileNo,
      },
    });

    if (existingMobileNo) {
      throw new ConflictException(
        `User with mobile number ${userData.mobileNo} already exists`,
      );
    }

    const permitDto = {
      name: userData.name,
      cidNo: userData.cidNo,
      email: userData.email,
      mobileNo: userData.mobileNo,
      status: Status.INACTIVE,
      userType: userData.userType as userType,
    };
    const user = await this.usersRepository.save(permitDto);

    if (!user) {
      throw new InternalServerErrorException('Erro while creating user!');
    }

    const newOtp = await this.generateOtp();

    const hashedOtp = await bcrypt.hash(newOtp.otp, 10);

    let otpEntity = await this.otpRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (otpEntity) {
      otpEntity.otp = hashedOtp;
      otpEntity.otpExpiresAt = newOtp.expiresAt;
      otpEntity.updatedAt = new Date(Date.now());
    } else {
      otpEntity = this.otpRepository.create({
        otp: hashedOtp,
        otpExpiresAt: newOtp.expiresAt,
        user: user,
      });
    }

    await this.otpRepository.save(otpEntity);

    try {
      if (userData.otpOption === 'email') {
        await this.sendMailOtp(user, newOtp.otp);
      } else {
        await this.phoneOtp(user.mobileNo, newOtp.otp);
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new InternalServerErrorException(
        "OTP couldn't be sent. Please try again",
      );
    }
    return { user, message: 'OTP sent successfully!' };
  }
}

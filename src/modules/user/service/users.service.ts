import {
  Injectable,
  ConflictException,
  NotFoundException,
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
import { UserResponse } from '../controller/user-response.interface';

// @Injectable()
// export class UserService {
//   private saltRounds = 10;
//   private twilioClient: Twilio;
//   private readonly otpCache = new Map<string, string>();

//   constructor(
//     @InjectRepository(Users) private usersRepository: Repository<Users>,
//     @InjectRepository(Students) private studentRepository: Repository<Students>,
//     @InjectRepository(UserProfile)
//     private userProfileRepository: Repository<UserProfile>,
//     private readonly configService: ConfigService,
//   ) {
//     const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
//     const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
//     this.twilioClient = new Twilio(accountSid, authToken);
//   }

//   async sendOtp(phoneNumber: string): Promise<{ msg: string }> {
//     const formattedPhoneNumber = `+975${phoneNumber}`;

//     const serviceSid = this.configService.get<string>(
//       'TWILIO_VERIFICATION_SERVICE_SID',
//     );
//     const verification = await this.twilioClient.verify.v2
//       .services(serviceSid)
//       .verifications.create({ to: formattedPhoneNumber, channel: 'sms' });

//     return { msg: verification.status };
//   }

//   async verifyOtp(phoneNumber: string, code: string): Promise<{ msg: string }> {
//     const formattedPhoneNumber = `+975${phoneNumber}`;

//     const serviceSid = this.configService.get<string>(
//       'TWILIO_VERIFICATION_SERVICE_SID',
//     );
//     const verification = await this.twilioClient.verify.v2
//       .services(serviceSid)
//       .verificationChecks.create({ to: formattedPhoneNumber, code: code });

//     return { msg: verification.status };
//   }

//   async initiateUserCreation(user: CreateUserDto): Promise<{ msg: string }> {
//     const existingUser = await this.usersRepository.findOne({
//       where: { cid_no: user.cid_no },
//     });
//     if (existingUser) {
//       throw new ConflictException(
//         `User with this CID already exists: ${user.cid_no}`,
//       );
//     }

//     const existingUserByEmail = await this.usersRepository.findOne({
//       where: { email: user.email },
//     });
//     if (existingUserByEmail) {
//       throw new ConflictException(`This email is already taken: ${user.email}`);
//     }

//     const existingUserByMobile = await this.usersRepository.findOne({
//       where: { mobile_no: user.mobile_no },
//     });
//     if (existingUserByMobile) {
//       throw new ConflictException(
//         `This phone number is already taken: ${user.mobile_no}`,
//       );
//     }

//     const existingUserByStudentCode = await this.usersRepository.findOne({
//       where: { student_code: user.student_code },
//     });
//     if (existingUserByStudentCode) {
//       throw new ConflictException(
//         `User with this student code already exists: ${user.student_code}`,
//       );
//     }

//     const student = await this.getStudentByCid(user.cid_no);
//     if (!student) {
//       throw new NotFoundException(
//         `No matching student data found for the provided CID No: ${user.cid_no}`,
//       );
//     }

//     // Send OTP to the mobile number
//     await this.sendOtp(user.mobile_no);
//     return { msg: 'OTP sent successfully' };
//   }

//   async verifyOtpAndCreateUser(
//     user: CreateUserDto,
//     otpCode: string,
//   ): Promise<UserResponse> {
//     if (!user) {
//       throw new BadRequestException('User data is missing');
//     }
//     if (!user.mobile_no) {
//       throw new BadRequestException('Phone number is missing');
//     }

//     const otpVerification = await this.verifyOtp(user.mobile_no, otpCode);
//     if (otpVerification.msg === 'approved') {
//       const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

//       let newUser = this.usersRepository.create({
//         ...user,
//         password: hashedPassword,
//         status: 'active',
//       });

//       const savedUser = await this.usersRepository.save(newUser);

//       const student = await this.getStudentByCid(user.cid_no);
//       const newProfile = this.userProfileRepository.create({
//         user: savedUser,
//         name: student.name,
//         student_code: student.student_code,
//         class: student.class,
//         school: student.school,
//         dzongkhag: student.dzongkhag,
//         email: user.email,
//       });

//       const savedProfile = await this.userProfileRepository.save(newProfile);

//       savedUser.profile = savedProfile;
//       await this.usersRepository.save(savedUser);

//       return { msg: 'User created successfully', user: savedUser };
//     } else {
//       throw new ConflictException('OTP verification failed');
//     }
//   }

//   async getStudentByCid(cid_no: string): Promise<Students> {
//     if (!cid_no) {
//       throw new Error('CID No is required');
//     }
//     const student = await this.studentRepository.findOne({ where: { cid_no } });
//     if (!student) {
//       throw new NotFoundException(
//         `No matching student data found for the provided CID No: ${cid_no}`,
//       );
//     }
//     return student;
//   }
// }

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
    private readonly configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string): Promise<{ msg: string }> {
    const formattedPhoneNumber = `+975${phoneNumber}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );
    await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({ to: formattedPhoneNumber, channel: 'sms' });

    this.otpCache.set(formattedPhoneNumber, { otp, expiresAt });
    return { msg: 'OTP sent successfully' };
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<{ msg: string }> {
    if (!phoneNumber || !code) {
      throw new ConflictException(
        `Phone number: ${phoneNumber} or OTP code : ${code} is missing`,
      );
    }

    const formattedPhoneNumber = `+975${phoneNumber}`;

    const cachedOtp = this.otpCache.get(formattedPhoneNumber);

    if (cachedOtp) {
      if (cachedOtp.otp === code && new Date() <= cachedOtp.expiresAt) {
        this.otpCache.delete(formattedPhoneNumber);
        return { msg: 'OTP approved' };
      } else {
        this.otpCache.delete(formattedPhoneNumber);
      }
    }
    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );
    if (!serviceSid) {
      throw new ConflictException('Twilio service SID is not configured');
    }

    try {
      const verification = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: formattedPhoneNumber, code });

      const msg = verification.status;

      if (msg === 'approved') {
        return { msg: 'OTP approved' };
      } else {
        throw new ConflictException('OTP verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP with Twilio:', error);
      throw new ConflictException('OTP verification failed');
    }
  }

  async initiateUserCreation(user: CreateUserDto): Promise<{ msg: string }> {
    await this.checkIfUserExists(user);

    const student = await this.getStudentByCid(user.cid_no);
    if (!student) {
      throw new NotFoundException(
        `No matching student data found for CID No: ${user.cid_no}`,
      );
    }

    await this.sendOtp(user.mobile_no);
    return { msg: 'OTP sent successfully' };
  }
  async verifyOtpAndCreateUser(
    mobile_no: string,
    otpCode: string,
    userDto: Partial<CreateUserDto>,
  ): Promise<UserResponse> {
    console.log('Phone Number: ', mobile_no);
    console.log('OTP : ', otpCode);
    const otpVerification = await this.verifyOtp(mobile_no, otpCode);

    if (otpVerification.msg === 'OTP approved') {
      const existingUser = await this.usersRepository.findOne({
        where: { mobile_no },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with phone number ${mobile_no} already exists`,
        );
      }

      const student = await this.getStudentByCid(userDto.cid_no);
      if (!student) {
        throw new NotFoundException(
          `No matching student data found for CID No: ${userDto.cid_no}`,
        );
      }
      const hashedPassword = await bcrypt.hash(
        userDto.password,
        this.saltRounds,
      );

      const newUser = this.usersRepository.create({
        ...userDto,
        mobile_no,
        password: hashedPassword,
        status: 'active',
      });

      const savedUser = await this.usersRepository.save(newUser);

      const newProfile = this.userProfileRepository.create({
        user: savedUser,
        name: student.name,
        student_code: student.student_code,
        class: student.class,
        school: student.school,
        dzongkhag: student.dzongkhag,
        mobile_no: userDto.mobile_no,
        email: userDto.email,
      });

      const savedProfile = await this.userProfileRepository.save(newProfile);
      savedUser.profile = savedProfile;
      await this.usersRepository.save(savedUser);

      return { msg: 'User created successfully', user: savedUser };
    } else {
      throw new ConflictException('OTP verification failed');
    }
  }

  private async checkIfUserExists(user: CreateUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { cid_no: user.cid_no },
        { email: user.email },
        { mobile_no: user.mobile_no },
        { student_code: user.student_code },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User already exists with one of the provided details.',
      );
    }
  }

  async getStudentByCid(cid_no: string): Promise<Students> {
    if (!cid_no) {
      throw new Error('CID No is required');
    }
    const student = await this.studentRepository.findOne({ where: { cid_no } });
    if (!student) {
      throw new NotFoundException(
        `No matching student data found for CID No: ${cid_no}`,
      );
    }
    return student;
  }
}

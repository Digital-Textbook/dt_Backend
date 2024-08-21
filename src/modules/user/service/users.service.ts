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
import { OtpEntity } from '../entities/otp.entity';

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
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  /////////////////////////////////////////////////////////////
  //   async createNewUser(user: CreateUserDto) {
  //     const existingUser = await this.usersRepository.findOne({
  //       where: { cid_no: user.cid_no },
  //     });

  //     if (existingUser) {
  //       throw new ConflictException(
  //         `User with this CID already exists: ${user.cid_no}`,
  //       );
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

  //     if (student) {
  //       const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

  //       let newUser = this.usersRepository.create({
  //         ...user,
  //         password: hashedPassword,
  //         status: 'inactive',
  //       });

  //       const savedUser = await this.usersRepository.save(newUser);

  //       const newProfile = this.userProfileRepository.create({
  //         user: savedUser,
  //         name: student.name,
  //         student_code: student.student_code,
  //         class: student.class,
  //         school: student.school,
  //         dzongkhag: student.dzongkhag,
  //         mobile_no: user.mobile_no,
  //         email: user.email,
  //       });

  //       const savedProfile = await this.userProfileRepository.save(newProfile);

  //       savedUser.profile = savedProfile;
  //       await this.usersRepository.save(savedUser);

  //       return savedUser;
  //     } else {
  //       throw new NotFoundException(
  //         `No matching student data found for the provided CID No: ${user.cid_no}`,
  //       );
  //     }
  //   }
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
      where: { cid_no: user.cid_no },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with this CID already exists: ${user.cid_no}`,
      );
    }

    const existingUserByMobile = await this.usersRepository.findOne({
      where: { mobile_no: user.mobile_no },
    });

    if (existingUserByMobile) {
      throw new ConflictException(
        `This phone number is already taken: ${user.mobile_no}`,
      );
    }

    const existingUserByStudentCode = await this.usersRepository.findOne({
      where: { student_code: user.student_code },
    });

    if (existingUserByStudentCode) {
      throw new ConflictException(
        `User with this student code already exists: ${user.student_code}`,
      );
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
        mobile_no: user.mobile_no,
        email: user.email,
      });

      const savedProfile = await this.userProfileRepository.save(newProfile);

      savedUser.profile = savedProfile;
      await this.usersRepository.save(savedUser);

      if (user.otpOption === 'phone') {
        let prefix = '+975';
        let phone = prefix.concat(user.mobile_no);

        const otpResponse = await this.sendOtp(phone);
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
      .then((verification) => (msg = verification.status));
    return { msg: msg };
  }
}

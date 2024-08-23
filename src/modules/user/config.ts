// config.ts
export default () => ({
  playsmsConfig: {
    url: process.env.PLAYSMS_URL || 'http://default-url.com',
    username: process.env.PLAYSMS_USERNAME || 'default-username',
    token: process.env.PLAYSMS_TOKEN || 'default-token',
    operationType: process.env.PLAYSMS_OPERATION_TYPE || 'default-operation',
  },
});

// if (user.otpOption === 'phone') {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     console.log('Phone Number: ', user.mobile_no);

//     let prefix = '+975';
//     let phone = prefix.concat(user.mobile_no);

//     // if (isBhutanesePhoneNumber(phone)) {
//       await this.smsService.sendSms(
//         user.mobile_no,
//         `Your OTP for News App is ${otp}`,
//       );

//       const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

//       const newOtpEntity = this.otpRepository.create({
//         otp,
//         otpExpiresAt,
//         user: savedUser,
//       });
//       await this.otpRepository.save(newOtpEntity);

//       return {
//         msg: 'User updated and OTP sent or generated for existing inactive user.',
//         data: savedUser,
//       };
//     } else {
//       throw new BadRequestException('Invalid phone number format.');
//     }
//   } else

// if (user.otpOption === 'phone') {
//     let prefix = '+975';
//     let phone = prefix.concat(user.mobile_no);

//     // const otpResponse = await this.sendOtp(phone);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

//     const newOtpEntity = this.otpRepository.create({
//       otp,
//       otpExpiresAt,
//       user: existingUser,
//     });
//     await this.otpRepository.save(newOtpEntity);

//     // console.log(`OTP sent to phone: ${otpResponse.msg}`);
//   } else

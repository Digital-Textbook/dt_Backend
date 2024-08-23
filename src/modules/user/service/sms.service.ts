import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private playsmsConfig: {
    url: string;
    username: string;
    token: string;
    operationType: string;
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.playsmsConfig = {
      url: this.configService.get<string>('PLAYSMS_URL'),
      username: this.configService.get<string>('PLAYSMS_USERNAME'),
      token: this.configService.get<string>('PLAYSMS_TOKEN'),
      operationType: this.configService.get<string>('PLAYSMS_OPERATION_TYPE'),
    };
  }

  async sendSms(to: string, message: string): Promise<void> {
    const { url, username, token, operationType } = this.playsmsConfig;

    const response = await this.httpService.axiosRef.get(
      `${url}&u=${username}&h=${token}&op=${operationType}&to=${to}&from=Bhutan News&msg=${message}`,
    );

    if (response.data.status !== 'OK') {
      throw new Error('Failed to send SMS');
    }
  }
}

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable canonical/no-unused-exports */
import { Agent } from 'node:https';

import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DataHubApiService {
  public readonly dataHubApiConfig: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    accessTokenUrl: string;
    grantType: string;
    censusDataUrl?: string;
  };

  constructor(public httpService: HttpService) {
    this.dataHubApiConfig = {
      baseUrl: process.env.DATA_HUB_API_BASE_URL,
      accessTokenUrl: process.env.DATA_HUB_API_ACCESS_TOKEN_ENDPOINT,
      grantType: process.env.DATA_HUB_API_GRANT_TYPE,
      clientId: process.env.DATA_HUB_API_CLIENT_ID,
      clientSecret: process.env.DATA_HUB_API_CLIENT_SECRET,
      censusDataUrl: process.env.DATA_HUB_API_FETCH_CENSUS_BY_CID_ENDPOINT,
    };
    // this.dataHubApiConfig = {this.configService.dataHubApiConfig;}
  }

  getDataHubApiAccessToken() {
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const credentials = btoa(
      `${this.dataHubApiConfig.clientId}:${this.dataHubApiConfig.clientSecret}`,
    );
    const headers = {
      Authorization: `Basic ${credentials}`,
    };

    return (
      this.httpService.axiosRef
        .post(
          `${this.dataHubApiConfig.accessTokenUrl}?grant_type=${this.dataHubApiConfig.grantType}`,
          undefined,
          {
            headers,
          },
        )
        .then((response) => response.data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
          console.info('Data Hub Api Error', error);
        })
    );
  }

  async getCensusDataByCid(cid) {
    const token = await this.getDataHubApiAccessToken();

    if (token) {
      const headers = {
        Authorization: `${token.token_type} ${token.access_token}`,
      };

      const censusData = await this.httpService.axiosRef
        .get(
          `${this.dataHubApiConfig.baseUrl}/${this.dataHubApiConfig.censusDataUrl}${cid}`,
          {
            headers,
            // httpsAgent: new Agent({ rejectUnauthorized: false }),
          },
        )
        .then((response) => response.data)
        .catch((error) => {
          console.info(error);

          throw new NotFoundException('Citizen Details not found');
        });

      if (
        censusData?.citizenDetailsResponse?.citizenDetail &&
        censusData?.citizenDetailsResponse?.citizenDetail.length > 0
      ) {
        return censusData?.citizenDetailsResponse?.citizenDetail[0];
      }

      throw new NotFoundException('Citizen Details not found');
    }
  }
}

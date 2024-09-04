import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { config } from './config';
import { Stream } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET;
  private readonly imageBucket = config.MINIO_BUCKET_TEXTBOOKDETAILS;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioClientService');
    // this.setBucketPolicies(); // Set bucket policies on initialization
  }

  private generateFileName(originalName: string): string {
    const tempFilename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(tempFilename)
      .digest('hex');
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    return hashedFileName + ext;
  }

  private validateFile(file: BufferedFile, allowedMimeTypes: string[]): void {
    if (!file || !file.originalname || !file.mimetype || !file.buffer) {
      console.log('File object:', file);
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }

    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const mimeType = file.mimetype.split('/').pop()?.toLowerCase();

    if (
      !allowedMimeTypes.includes(fileExtension) ||
      !allowedMimeTypes.includes(mimeType)
    ) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.imageBucket,
  ) {
    const allowedMimeTypes = ['jpeg', 'png', 'jpg'];

    this.validateFile(file, allowedMimeTypes);

    const filename = this.generateFileName(file.originalname);
    const fileBuffer = file.buffer;

    console.log('Filename: ', filename);

    const metaData = {
      'Content-Type': file.mimetype,
      'Content-Disposition': 'inline',
    };

    try {
      await this.client.putObject(
        baseBucket,
        filename,
        fileBuffer,
        fileBuffer.length,
        metaData,
      );

      return {
        url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${baseBucket}/${filename}`,
      };
    } catch (error) {
      this.logger.error('Upload failed', error.stack);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  public async uploadTextbook(
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
  ) {
    const allowedMimeTypes = ['jpeg', 'png', 'pdf', 'epub'];

    this.validateFile(file, allowedMimeTypes);

    const filename = this.generateFileName(file.originalname);
    const fileBuffer = file.buffer;

    const metaData = {
      'Content-Type': file.mimetype,
      'Content-Disposition': 'inline',
    };

    try {
      await this.client.putObject(
        baseBucket,
        filename,
        fileBuffer,
        fileBuffer.length,
        metaData,
      );

      return {
        url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${baseBucket}/${filename}`,
      };
    } catch (error) {
      this.logger.error('Upload failed', error.stack);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  async getImage(imageBucket: string, imageName: string): Promise<Stream> {
    try {
      const stream = await this.client.getObject(imageBucket, imageName);
      return stream as Stream;
    } catch (error) {
      throw new Error(`Error fetching image: ${error.message}`);
    }
  }

  async delete(objectName: string, baseBucket: string = this.baseBucket) {
    try {
      await this.client.removeObject(baseBucket, objectName);
    } catch (error) {
      this.logger.error('Delete failed', error.stack);
      throw new HttpException(
        'Oops Something wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //   private async setBucketPolicies() {
  //     const buckets = [this.baseBucket, this.imageBucket];

  //     const policy = {
  //       Version: '2012-10-17',
  //       Statement: [
  //         {
  //           Effect: 'Allow',
  //           Principal: {
  //             AWS: ['*'],
  //           },
  //           Action: [
  //             's3:ListBucketMultipartUploads',
  //             's3:GetBucketLocation',
  //             's3:ListBucket',
  //           ],
  //           Resource: [],
  //         },
  //         {
  //           Effect: 'Allow',
  //           Principal: {
  //             AWS: ['*'],
  //           },
  //           Action: [
  //             's3:PutObject',
  //             's3:AbortMultipartUpload',
  //             's3:DeleteObject',
  //             's3:GetObject',
  //             's3:ListMultipartUploadParts',
  //           ],
  //           Resource: [],
  //         },
  //       ],
  //     };

  //     for (const bucketName of buckets) {
  //       try {
  //         console.log('Bucket Name: ', bucketName);
  //         policy.Statement[0].Resource = [`arn:aws:s3:::${bucketName}`];
  //         policy.Statement[1].Resource = [`arn:aws:s3:::${bucketName}/*`];

  //         await this.client.setBucketPolicy(bucketName, JSON.stringify(policy));

  //         this.logger.log(`Bucket policy set for ${bucketName}`);
  //       } catch (err) {
  //         this.logger.error(`Failed to set policy for ${bucketName}`, err.stack);
  //         throw new HttpException(
  //           `Failed to set bucket policy for ${bucketName}`,
  //           HttpStatus.INTERNAL_SERVER_ERROR,
  //         );
  //       }
  //     }
  //   }
}

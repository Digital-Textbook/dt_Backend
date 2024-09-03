import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { config } from './config';

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
  }

  private generateFileName(originalName: string): string {
    let tempFilename = Date.now().toString();
    let hashedFileName = crypto
      .createHash('md5')
      .update(tempFilename)
      .digest('hex');
    let ext = originalName.substring(originalName.lastIndexOf('.'));
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

    try {
      await this.client.putObject(baseBucket, filename, fileBuffer);

      return {
        url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET_TEXTBOOKDETAILS}/${filename}`,
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

    try {
      await this.client.putObject(baseBucket, filename, fileBuffer);

      return {
        url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
      };
    } catch (error) {
      this.logger.error('Upload failed', error.stack);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
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
}

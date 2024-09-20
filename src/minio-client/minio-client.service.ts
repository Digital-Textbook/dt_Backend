import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { config } from './config';
import { Stream } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET_TEXTBOOK;
  private readonly imageBucket = config.MINIO_BUCKET_TEXTBOOKDETAILS;
  private readonly profileBucket = config.MINIO_BUCKET_USERPROFILES;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioClientService');
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

  private validateFile(
    file: BufferedFile,
    fileType: 'image' | 'document',
  ): void {
    if (!file || !file.originalname || !file.mimetype || !file.buffer) {
      console.log('File object:', file);
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }

    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    console.log('File MIME type:', mimeType);
    console.log('File extension:', fileExtension);

    const allowedImageExtensions = ['jpeg', 'jpg', 'png'];
    const allowedImageMimeTypes = ['image/jpeg', 'image/png'];

    const allowedDocumentExtensions = ['pdf', 'epub'];
    const allowedDocumentMimeTypes = [
      'application/pdf',
      'application/epub+zip',
    ];

    if (fileType === 'image') {
      if (
        !allowedImageExtensions.includes(fileExtension) ||
        !allowedImageMimeTypes.includes(mimeType)
      ) {
        throw new HttpException(
          'Invalid image file type',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (fileType === 'document') {
      if (
        !allowedDocumentExtensions.includes(fileExtension) ||
        !allowedDocumentMimeTypes.includes(mimeType)
      ) {
        throw new HttpException(
          'Invalid document file type',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.imageBucket,
  ) {
    this.validateFile(file, 'image');

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
      throw new HttpException(
        'Error uploading cover image',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async uploadTextbook(
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
  ) {
    this.validateFile(file, 'document');

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
      throw new HttpException(
        'Error uploading textbook file',
        HttpStatus.BAD_REQUEST,
      );
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

  async deleteProfileImage(
    profileImageName: string,
    profileImageBucket: string = this.profileBucket,
  ) {
    try {
      await this.client.removeObject(profileImageBucket, profileImageName);
      console.log('OLD PROFILE DELETED!');
    } catch (error) {
      this.logger.error('Delete failed ', error.stack);
      throw new HttpException(
        'Oops Something wrong happened',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //////////////// USER PROFILE //////////////////////////
  public async uploadProfile(
    file: BufferedFile,
    baseBucket: string = this.profileBucket,
  ) {
    const allowedMimeTypes = ['jpeg', 'png', 'jpg'];

    this.validateFile(file, 'image');

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
      throw new HttpException(
        'Error uploading profile image',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

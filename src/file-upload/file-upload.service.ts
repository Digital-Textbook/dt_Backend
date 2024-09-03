import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { UploadSingleFileDto } from './dto/single-file.dto';
import { UploadMultipleFilesDto } from './dto/multiple-file.dto';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(
    file: BufferedFile,
    uploadSingleFileDto: UploadSingleFileDto,
  ) {
    let uploaded_image = await this.minioClientService.upload(file);

    return {
      image_url: uploaded_image.url,
      message: 'Successfully uploaded to MinIO S3',
    };
  }

  async uploadTextbook(textbook: BufferedFile) {
    let upload_textbook =
      await this.minioClientService.uploadTextbook(textbook);

    return {
      textbook_url: upload_textbook.url,
      message: 'Textbook successfully uploaded to MinIO S3',
    };
  }

  async uploadMany(
    files: { image1?: BufferedFile[]; image2?: BufferedFile[] },
    uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    const responses = [];
    if (files.image1) {
      responses.push(await this.minioClientService.upload(files.image1[0]));
    }
    if (files.image2) {
      responses.push(await this.minioClientService.upload(files.image2[0]));
    }
    return responses;
  }
}

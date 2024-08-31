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
    // Handle file upload and any additional metadata here
    return await this.minioClientService.upload(file);
  }

  async uploadMany(
    files: { image1?: BufferedFile[]; image2?: BufferedFile[] },
    uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    // Handle multiple file uploads and additional metadata here
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

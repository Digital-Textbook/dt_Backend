import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Textbook } from '../entities/textbook.entity';
import { CreateTextbookDto } from '../dto/textbook.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Subject } from 'src/modules/subject/entities/subject.entity';

@Injectable()
export class TextbookService {
  constructor(
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    private minioClientService: MinioClientService,
  ) {}
  async createTextbook(
    data: CreateTextbookDto,
    textbookImage: BufferedFile,
    textbookFile: BufferedFile,
  ) {
    try {
      const uploadImageResult =
        await this.minioClientService.upload(textbookImage);

      const uploadFileResult =
        await this.minioClientService.uploadTextbook(textbookFile);

      const subject = await this.subjectRepository.findOne({
        where: { id: data.subjectID },
      });

      if (!subject) {
        throw new HttpException(
          'Invalid subject ID provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newTextbook = {
        author: data.author,
        chapter: data.chapter,
        totalPages: data.totalPages,
        summary: data.summary,
        edition: data.edition,
        coverUrl: uploadImageResult.url,
        textbookUrl: uploadFileResult.url,
        subject,
      };

      const textbook = await this.textbookRepository.save(newTextbook);

      return {
        textbook,
        message: 'Textbook successfully created',
      };
    } catch (error) {
      console.error('Error creating textbook:', error);

      throw new HttpException(
        'Failed to create textbook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  ///////////////////// GET PNG OR PDF ///////////////////
  //   async getFile(bucket: string, filename: string, res: Response): Promise<void> {
  //     try {
  //       const fileStream = await this.minioClientService.getObject(bucket, filename);
  //       const fileExtension = filename.split('.').pop();

  //       let contentType = 'application/octet-stream'; // Default content type

  //       if (fileExtension === 'png') {
  //         contentType = 'image/png';
  //       } else if (fileExtension === 'pdf') {
  //         contentType = 'application/pdf';
  //       }

  //       res.set({
  //         'Content-Type': contentType,
  //         'Content-Disposition': `inline; filename="${filename}"`,
  //       });

  //       fileStream.pipe(res);
  //     } catch (error) {
  //       throw new Error(`Error retrieving file: ${error.message}`);
  //     }
  //   }

  //////////////////// DELETE PNG OR PDF ///////////////
}

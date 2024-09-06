import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Textbook } from '../entities/textbook.entity';
import { CreateTextbookDto } from '../dto/textbook.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { UpdateTextbookDto } from '../dto/updateTextbook.dto';
import { text } from 'stream/consumers';

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

  async getImage(id: string): Promise<{ msg: string; coverUrl?: string }> {
    try {
      const textbook = await this.textbookRepository.findOne({
        where: { id: id },
      });

      if (!textbook) {
        throw new NotFoundException(`Textbook Cover with ID ${id} not found!`);
      }

      if (textbook.coverUrl) {
        return {
          msg: 'Textbook cover URL found!',
          coverUrl: textbook.coverUrl,
        };
      } else {
        return { msg: 'Textbook cover URL not found!' };
      }
    } catch (error) {
      throw new Error(`Error retrieving image: ${error.message}`);
    }
  }

  async getAllTextbook() {
    const textbooks = await this.textbookRepository.find({
      relations: ['subject', 'subject.class'],
    });

    if (!textbooks || textbooks.length === 0) {
      throw new NotFoundException('No textbooks found in the database!');
    }

    return textbooks.map((textbook) => {
      const className = textbook.subject?.class?.class || 'N/A';

      const subjectName = textbook.subject?.subjectName || 'N/A';

      return {
        id: textbook.id,
        author: textbook.author,
        chapter: textbook.chapter,
        totalPages: textbook.totalPages,
        summary: textbook.summary,
        edition: textbook.edition,
        coverUrl: textbook.coverUrl,
        textbookUrl: textbook.textbookUrl,
        class: className,
        subjectName: subjectName,
      };
    });
  }

  //////////////////// UPDATE TEXTBOOK ///////////////
  async updateTextbook(
    id: string,
    data: UpdateTextbookDto,
    textbookImage: BufferedFile | null,
    textbookFile: BufferedFile | null,
  ) {
    const textbook = await this.textbookRepository.findOne({
      where: { id: id },
    });
    if (!textbook) {
      throw new NotFoundException(`Textbook with ID ${id} not found!`);
    }

    if (textbookFile) {
      const uploadedFile =
        await this.minioClientService.uploadTextbook(textbookFile);
      textbook.textbookUrl = uploadedFile.url;
    }

    if (textbookImage) {
      const uploadedImage = await this.minioClientService.upload(textbookImage);
      textbook.coverUrl = uploadedImage.url;
    }

    Object.assign(textbook, data);
    await this.textbookRepository.save(textbook);
    return { msg: 'Textbook updated successfully!', textbook };
  }
  //////////////////// DELETE PNG OR PDF ///////////////

  async deleteTextbook(id: string) {
    const result = await this.textbookRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Textbook with ID ${id} not found!`);
    }

    return { msg: 'Textbook deleted successfully!' };
  }

  //////////////////// GET TEXTBOOK BY ID ///////////////
  async getTextbookById(id: string) {
    const textbook = await this.textbookRepository.findOne({
      where: { id: id },
      relations: ['subject', 'subject.class'],
    });

    // const textbook = await this.textbookRepository
    // .createQueryBuilder('textbook')
    // .leftJoinAndSelect('textbook.subject', 'subject')   // Join the subject relation
    // .leftJoinAndSelect('subject.class', 'class')        // Join the class relation through subject
    // .where('textbook.id = :id', { id })
    // .getOne();

    if (!textbook) {
      throw new NotFoundException(`Textbook with ID ${id} not found!`);
    }
    const className = textbook.subject?.class?.class || 'N/A';
    const subjectName = textbook.subject?.subjectName || 'N/A';

    return {
      id: textbook.id,
      author: textbook.author,
      chapter: textbook.chapter,
      totalPages: textbook.totalPages,
      summary: textbook.summary,
      edition: textbook.edition,
      coverUrl: textbook.coverUrl,
      textbookUrl: textbook.textbookUrl,
      class: className,
      subjectName: subjectName,
    };
  }

  ////////////////////// GET TEXTBOOK INFORMATION /////////////
  async getTextbookInfo(id: string) {
    try {
      const textbookInfo = await this.textbookRepository.findOne({
        where: { id: id },
      });
      if (!textbookInfo) {
        throw new NotFoundException(`No Textbook found with ID ${id}!`);
      }
      if (textbookInfo.textbookUrl) {
        return {
          msg: 'Textbook information found!',
          coverUrl: textbookInfo.textbookUrl,
        };
      } else {
        return { msg: 'Textbook Information not found!' };
      }
    } catch (error) {
      throw new Error(
        `Error retrieving textbook information: ${error.message}`,
      );
    }
  }
}

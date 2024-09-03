import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TextbookService } from '../service/textbook.service';
import { CreateTextbookDto } from '../dto/textbook.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('textbook')
@ApiTags('textbook')
export class TextbookController {
  constructor(private textbookService: TextbookService) {}

  @Post('/')
  @ApiOkResponse({ description: 'Textbook successfully uploaded!' })
  @ApiBadRequestResponse({ description: 'Textbook cannot be uploaded!' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload textbook image and content file',
    type: CreateTextbookDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'textbookImage', maxCount: 1 },
      { name: 'textbookFile', maxCount: 1 },
    ]),
  )
  async createTextbook(
    @UploadedFiles()
    files: { textbookImage?: BufferedFile[]; textbookFile?: BufferedFile[] },
    @Body() data: CreateTextbookDto,
  ) {
    const textbookImage = files.textbookImage ? files.textbookImage[0] : null;
    const textbookFile = files.textbookFile ? files.textbookFile[0] : null;

    return await this.textbookService.createTextbook(
      data,
      textbookImage,
      textbookFile,
    );
  }

  //   @Get(':filename')
  //   async getFile(@Param('filename') filename: string, @Res() res: Response) {
  //     const bucket = 'textbook';
  //     await this.textbookService.getFile(bucket, filename, res);
  //   }
}

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
  HttpException,
  HttpStatus,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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

  // @Get('/:filename')
  // async getFile(@Param('filename') filename: string, @Res() res: Response) {
  //   const bucket = 'textbook';
  //   await this.textbookService.getImage(bucket, filename, res);
  // }

  @Get('textbook-cover/:id')
  async getBookCover(@Param('id') id: string) {
    try {
      const result = await this.textbookService.getImage(id);

      // Check if coverUrl is present in the result
      if (result.coverUrl) {
        return result; // Return the result with the coverUrl
      } else {
        throw new HttpException(result.msg, HttpStatus.NOT_FOUND); // Handle the case where coverUrl is not found
      }
    } catch (error) {
      throw new HttpException(
        `Error retrieving image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

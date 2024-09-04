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
  UsePipes,
  ValidationPipe,
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
import { UpdateTextbookDto } from '../dto/updateTextbook.dto';

@Controller('textbook')
@ApiTags('textbook')
export class TextbookController {
  constructor(private textbookService: TextbookService) {}

  @Get('/')
  @ApiOkResponse({ description: 'Textbook found!' })
  @ApiBadRequestResponse({ description: 'Textbook not found!' })
  async getAllTextbook() {
    return await this.textbookService.getAllTextbook();
  }

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

  @Patch('/:id')
  @ApiOkResponse({ description: 'Textbook successfully updated!' })
  @ApiBadRequestResponse({ description: 'Textbook cannot be updated!' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload textbook image and content file',
    type: UpdateTextbookDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'textbookImage', maxCount: 1 },
      { name: 'textbookFile', maxCount: 1 },
    ]),
  )
  async updateTextbook(
    @Param('id') id: string,
    @UploadedFiles()
    files: { textbookImage?: BufferedFile[]; textbookFile?: BufferedFile[] },
    @Body() data: UpdateTextbookDto,
  ) {
    const textbookImage = files.textbookImage ? files.textbookImage[0] : null;
    const textbookFile = files.textbookFile ? files.textbookFile[0] : null;

    return await this.textbookService.updateTextbook(
      id,
      data,
      textbookImage,
      textbookFile,
    );
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Textbook deleted successfully!' })
  @ApiBadRequestResponse({ description: 'Textbook cannot be deleted!' })
  async deleteTextbook(@Param('id') id: string): Promise<void> {
    await this.textbookService.deleteTextbook(id);
  }

  @Get('textbook-cover/:id')
  async getBookCover(@Param('id') id: string) {
    try {
      const result = await this.textbookService.getImage(id);

      if (result.coverUrl) {
        return result;
      } else {
        throw new HttpException(result.msg, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `Error retrieving image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

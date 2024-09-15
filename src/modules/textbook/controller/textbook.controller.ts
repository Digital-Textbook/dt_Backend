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
  NotFoundException,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TextbookService } from '../service/textbook.service';
import { CreateTextbookDto } from '../dto/textbook.dto';
import { BufferedFile } from 'src/minio-client/file.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateTextbookDto } from '../dto/updateTextbook.dto';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Response } from 'express';

@Controller('Digital-textbook/textbook')
@ApiTags('textbook')
export class TextbookController {
  constructor(
    private textbookService: TextbookService,
    private minioClientService: MinioClientService,
  ) {}

  //////////////// Get All Textbook ///////////////////////
  @Get('/')
  @ApiOkResponse({ description: 'Textbook found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fecthing textbook from database',
  })
  async getAllTextbook() {
    return await this.textbookService.getAllTextbook();
  }

  //////////////// Create Textbook ///////////////////////
  @Post('/')
  @ApiCreatedResponse({ description: 'Textbook successfully uploaded!' })
  @ApiBadRequestResponse({
    description: 'Invalid data or information for uploading textbook!',
  })
  @ApiNotFoundResponse({ description: 'Invalid subject Id!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while uploading textbook!',
  })
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

  //////////////// Updated Textbook By ID ///////////////////////
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Textbook successfully updated!' })
  @ApiBadRequestResponse({ description: 'Invalid textbook ID!' })
  @ApiNotFoundResponse({ description: 'Textbook Id not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating textbook',
  })
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
    @Param('id', ParseUUIDPipe) id: string,
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

  //////////////// Delete Textbook By ID ///////////////////////
  @Delete('/:id')
  @ApiOkResponse({ description: 'Textbook deleted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid textbook ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting textbook!',
  })
  async deleteTextbook(@Param('id') id: string): Promise<void> {
    await this.textbookService.deleteTextbook(id);
  }

  //////////////// Get textbook By ID///////////////////////
  @Get(':id/textbook-details')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Textbook successfully fetched!' })
  @ApiBadRequestResponse({ description: 'Invalid textbook Id!' })
  @ApiNotFoundResponse({ description: 'Textbook not found!' })
  async getTextbook(@Param('id', ParseUUIDPipe) id: string) {
    return await this.textbookService.getTextbookById(id);
  }

  @Get('/:id/textbook-cover')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Textbook cover Url successfully found!' })
  @ApiBadRequestResponse({ description: 'Invalid Textbook ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching textbook cover!',
  })
  async getBookCover(@Param('id', ParseUUIDPipe) id: string) {
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

  //////////////// Download textbook By ID///////////////////////
  @Get(':id/download')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Textbook successfully downloaded!' })
  @ApiBadRequestResponse({ description: 'Invalid Textbook ID!' })
  @ApiNotFoundResponse({ description: 'Textbook not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fecthing textbook url!',
  })
  async downloadTextbook(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const textbook = await this.textbookService.getTextbookById(id);

    if (!textbook || !textbook.textbookUrl) {
      throw new NotFoundException(
        'Textbook not found or no associated file URL.',
      );
    }

    const url = textbook.textbookUrl;

    const match = url.match(/\/([^\/]+)\/(.+)$/);
    if (!match) {
      throw new NotFoundException('Invalid URL format.');
    }
    // (/ for // in url), \/([^\/]+) for bucketname, (.+)$/ for filename

    const bucketName = match[1];
    const fileName = match[2];

    try {
      const fileStream = await this.minioClientService.client.getObject(
        bucketName,
        fileName,
      );

      if (!fileStream) {
        throw new NotFoundException('File not found in storage.');
      }

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException(`Error downloading file: ${error.message}`);
    }
  }

  @Get('/:id/textbook-info')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Textbook Url successfully found!' })
  @ApiBadRequestResponse({ description: 'Invalid Textbook Id!' })
  @ApiNotFoundResponse({ description: 'Textbook not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fecthing textbook information!',
  })
  async getTextbookInfo(@Param('id', ParseUUIDPipe) id: string) {
    return await this.textbookService.getTextbookInfo(id);
  }
}

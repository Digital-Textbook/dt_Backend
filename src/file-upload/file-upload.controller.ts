import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { UploadSingleFileDto } from './dto/single-file.dto';
import { UploadMultipleFilesDto } from './dto/multiple-file.dto';
import { TextbookDto } from './dto/textbook-file.dto';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('singleImage')
  @ApiOkResponse({ description: 'Image successfully uploaded!' })
  @ApiBadRequestResponse({ description: 'Image cannot be uploaded!' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single image file',
    type: UploadSingleFileDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(
    @UploadedFile() image: BufferedFile,
    @Body() uploadSingleFileDto: UploadSingleFileDto,
  ) {
    return await this.fileUploadService.uploadSingle(
      image,
      uploadSingleFileDto,
    );
  }

  @Post('textbook-upload')
  @ApiOkResponse({ description: 'Textbook successfully uploaded!' })
  @ApiBadRequestResponse({ description: 'Textbook cannot be uploaded!' })
  @ApiBody({
    description: 'Textbook file',
    type: TextbookDto,
  })
  @UseInterceptors(FileInterceptor('textbook'))
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() textbook: BufferedFile) {
    return await this.fileUploadService.uploadTextbook(textbook);
  }

  @Post('many')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple image files',
    type: UploadMultipleFilesDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
    ]),
  )
  async uploadMany(
    @UploadedFiles()
    files: { image1?: BufferedFile[]; image2?: BufferedFile[] },
    @Body() uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    return this.fileUploadService.uploadMany(files, uploadMultipleFilesDto);
  }
}

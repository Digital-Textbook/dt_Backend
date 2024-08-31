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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { UploadSingleFileDto } from './dto/single-file.dto';
import { UploadMultipleFilesDto } from './dto/multiple-file.dto';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload a single image' })
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

  @Post('many')
  @ApiOperation({ summary: 'Upload multiple images' })
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

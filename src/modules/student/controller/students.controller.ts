import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from '../service/students.service';
import { CreateStudentDto } from '../dto/createStudent.dto';
import { Students } from '../entities/students.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('students')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/getStudents')
  async getAllStudents(): Promise<Students[]> {
    try {
      return await this.studentService.getStudents();
    } catch (error) {
      throw new Error('Error retrieving students');
    }
  }

  @Get('/:cid_no')
  async getStudentByCid(
    @Param('cid_no', ParseIntPipe) cid_no: string,
  ): Promise<Students> {
    return await this.studentService.getStudentByCid(cid_no);
  }

  @Post('createStudents')
  @UsePipes(ValidationPipe)
  async createStudent(@Body() studentData: CreateStudentDto) {
    return await this.studentService.createNewStudent(studentData);
  }
}

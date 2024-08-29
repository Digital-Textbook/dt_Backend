import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
} from '@nestjs/common';

import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PastQuestionPaperService } from '../service/pastQuestion.service';

@Controller('subject')
@ApiTags('subject')
export class SubjectController {
  constructor(private pastQuestionPaperService: PastQuestionPaperService) {}
}

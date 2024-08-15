import { NotFoundException } from '@nestjs/common';

export class SubjectNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.subjectNotFound', error);
  }
}

import { NotFoundException } from '@nestjs/common';

export class TextbookNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.textbookNotFound', error);
  }
}

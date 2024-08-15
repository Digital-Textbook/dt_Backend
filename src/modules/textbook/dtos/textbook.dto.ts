import { AbstractDto } from '../../../common/dto/abstract.dto';
import { type TextbookEntity } from '../textbook.entity';

export class TextbookDto extends AbstractDto {
  constructor(entityName: TextbookEntity) {
    super(entityName);
  }
}

import { Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { TextbookDto } from './dtos/textbook.dto';

@Entity({ name: 'textbooks' })
@UseDto(TextbookDto)
export class TextbookEntity extends AbstractEntity<TextbookDto> {}

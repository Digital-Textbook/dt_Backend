import { Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SubjectDto } from './dtos/subject.dto';

@Entity({ name: 'subjects' })
@UseDto(SubjectDto)
export class SubjectEntity extends AbstractEntity<SubjectDto> {}

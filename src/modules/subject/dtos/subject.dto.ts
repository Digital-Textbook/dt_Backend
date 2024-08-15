import { AbstractDto } from '../../../common/dto/abstract.dto';
import { type SubjectEntity } from '../subject.entity';

export class SubjectDto extends AbstractDto {
  constructor(entityName: SubjectEntity) {
    super(entityName);
  }
}

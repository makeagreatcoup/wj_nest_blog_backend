
import { BaseRepository } from '@/modules/database/base/repository';
import { CustomRepository } from '@/modules/database/decorators/repository.decorator';

import { TagEntity } from '../entities';

@CustomRepository(TagEntity)
export class TagRepository extends BaseRepository<TagEntity> {
  protected _qbName='tag';
  
  protected orderBy = 'createdAt';
  
  buildBaseQB() {
    return super.buildBaseQB()
      .leftJoinAndSelect(`${this.qbName}.posts`,'posts')
      
      ;
  }
}

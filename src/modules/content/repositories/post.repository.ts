
import { BaseRepository } from '@/modules/database/base/repository';
import { CustomRepository } from '@/modules/database/decorators/repository.decorator';

import { CommentEntity } from '../entities/comment.entity';
import { PostEntity } from '../entities/post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
  protected _qbName='post';
  
  buildBaseQB() {
    return this.createQueryBuilder(this.qbName)
      .leftJoinAndSelect(`${this.qbName}.category`,'category')
      .addSelect((subQuery)=>{
        return subQuery.select('COUNT(c.id)','count').from(CommentEntity,'c').where('c.post.id=post.id');
      },'commentCount')
      .loadRelationCountAndMap(`${this.qbName}.commentCount`,`${this.qbName}.comments`)
      ;
  }
}

import { isNil } from 'lodash';
import { DataSource, EventSubscriber, ObjectType } from 'typeorm';

import { App } from '@/modules/core/app';
import { PostBodyType } from '@/modules/core/constants';
import { BaseSubscriber } from '@/modules/database/base/subscriber';

import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { SanitizeService } from '../services/sanitize.service';

@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity>{
  constructor(
    protected dataSource: DataSource,
    protected sanitizeService: SanitizeService,
    protected postRepository: PostRepository,
  ) {
    super(dataSource);
  }

  protected entity: ObjectType<PostEntity>=PostEntity;

  listenTo() {
    return PostEntity;
  }

  /**
   * 加载文章数据的处理
   * @param post 
   */
  async afterLoad(post: PostEntity) {
    const sanitizeService=App.app.get(SanitizeService,{strict:false});
    console.log(sanitizeService)
    console.log(this.sanitizeService)
    if (post.type === PostBodyType.HTML&&!isNil(sanitizeService)) {
      post.body = this.sanitizeService.sanitize(post.body);
    }
  }
}

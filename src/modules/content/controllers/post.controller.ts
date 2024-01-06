import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseControllerWithTrash } from '@/modules/restful/base/trashed.controller';
import { Crud, Depends } from '@/modules/restful/decorators';
import { createHookOption } from '@/modules/restful/helpers';

import { ContentModule } from '../content.module';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos/post.dto';
import { PostService } from '../services/post.service';

@ApiTags('文章')
@Depends(ContentModule)
@Crud(async () => ({
  id: 'post',
  enabled: [
    {
      name: 'list',
      option: createHookOption({
        summary: '文章查询,以分页模式展示',
        guest: true,
      }),
    },
    {
      name: 'detail',
      option: createHookOption({
        summary: '文章查询,以分页模式展示',
        guest: true,
      }),
    },
    {
      name: 'store',
      option: createHookOption('创建文章'),
    },
    {
      name: 'update',
      option: createHookOption('更新文章'),
    },
    {
      name: 'delete',
      option: createHookOption('删除文章'),
    },
    {
      name: 'restore',
      option: createHookOption('恢复文章'),
    },
  ],
  dtos: {
    store: CreatePostDto,
    update: UpdatePostDto,
    list: QueryPostDto,
  },
}))
@Controller('posts')
export class PostController extends BaseControllerWithTrash<PostService> {
  constructor(protected service: PostService) {
    super(service);
  }

  @Get('titleList')
  @ApiOperation({ summary: '获取标题数组' })
  @SerializeOptions({ groups: ['post-list'] })
  async titleList() {
    return this.service.titleList();
  }
}

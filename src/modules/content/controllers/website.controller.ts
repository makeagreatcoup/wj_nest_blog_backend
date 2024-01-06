import {
  Controller,
  Get,
  Param,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindTreeOptions } from 'typeorm';

import { Depends } from '@/modules/restful/decorators';
import { Guest } from '@/modules/user/decorators';
import { NoneAuthGuard } from '@/modules/user/guards/none-auth.guard';

import { ContentModule } from '../content.module';
import { QueryPostDto } from '../dtos';
import { CategoryService, TagService } from '../services';
import { PostService } from '../services/post.service';

@ApiTags('网站')
@Controller('website')
@Depends(ContentModule)
@Guest()
@UseGuards(NoneAuthGuard)
export class WebsiteController {
  constructor(
    protected readonly postService: PostService,
    protected readonly categoryService: CategoryService,
    protected readonly tagService: TagService,
  ) {}

  @Get('post/list')
  @ApiOperation({ summary: '博客列表' })
  async postList(@Query() options: QueryPostDto) {
    return this.postService.paginate(options);
  }

  @Get('post/detail/:id')
  @SerializeOptions({ groups: ['post-detail'] })
  @ApiOperation({ summary: '博客单篇文章' })
  async postOne(@Param('id') id: string) {
    return this.postService.detail(id);
  }

  @Get('category/list')
  @ApiOperation({ summary: '分类列表' })
  @SerializeOptions({ groups: ['category-tree'] })
  async categoryList(@Query() options: FindTreeOptions) {
    return this.categoryService.findTrees(options);
  }

  @Get('tag/list')
  @ApiOperation({ summary: '标签列表' })
  async tagList() {
    return this.tagService.searchList();
  }
}

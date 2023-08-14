import {
  Controller, Get, SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/modules/restful/base';
import { Crud, Depends } from '@/modules/restful/decorators';
import { createHookOption } from '@/modules/restful/helpers';

import { ContentModule } from '../content.module';
import { CreateTagDto,  UpdateTagDto } from '../dtos';
import { TagService } from '../services';

@ApiTags('标签')
@Depends(ContentModule)
@Crud(async()=>({
  id:'tag',
  enabled:[{
    name: 'list',
    option: createHookOption({ summary: '标签查询,以分页模式展示', guest: true }),
},
{
    name: 'detail',
    option: createHookOption({ summary: '标签查询,以分页模式展示', guest: true }),
},
{
    name: 'store',
    option: createHookOption('创建标签'),
},
{
    name: 'update',
    option: createHookOption('更新标签'),
},
{
    name: 'delete',
    option: createHookOption('删除标签'),
}],
  dtos:{
    store:CreateTagDto,
    update:UpdateTagDto,
  }
}))
@Controller('tags')
export class TagController extends BaseController<TagService>{
  constructor(protected service: TagService) {
    super(service)
  }
  
  @Get('searchList')
  @ApiOperation({summary:'获取所有标签名称'})
  @SerializeOptions({ groups: ['tag-list'] })
  async searchList() {
    return this.service.searchList();
  }
}


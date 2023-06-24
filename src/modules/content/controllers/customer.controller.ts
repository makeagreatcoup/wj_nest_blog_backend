
import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/modules/restful/base';
import { Crud, Depends } from '@/modules/restful/decorators';
import { createHookOption } from '@/modules/restful/helpers';

import { ContentModule } from '../content.module';
import { CreateCustomerDto, QueryCustomerDto, UpdateCustomerDto } from '../dtos';
import { CustomerService } from '../services';

@ApiTags('评论人')
@Depends(ContentModule)
@Crud(async()=>({
  id:'customer',
  enabled:[{
    name: 'list',
    option: createHookOption({ summary: '评论人查询,以分页模式展示', guest: true }),
},
{
    name: 'detail',
    option: createHookOption({ summary: '评论人查询', guest: true }),
},
{
    name: 'store',
    option: createHookOption('创建评论人'),
},
{
    name: 'update',
    option: createHookOption('更新评论人'),
},
{
    name: 'delete',
    option: createHookOption('删除评论人'),
},
{
    name: 'restore',
    option: createHookOption('恢复评论人'),
}],
  dtos:{
    store:CreateCustomerDto,
    update:UpdateCustomerDto,
    list:QueryCustomerDto
  }
}))
@Controller('customers')
export class CustomerController extends BaseController<CustomerService>{
  constructor(protected service: CustomerService) {
    super(service)
  }

}
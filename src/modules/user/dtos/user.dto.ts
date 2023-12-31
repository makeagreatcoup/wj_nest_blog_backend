import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { ListWithTrashedQueryDto } from '@/modules/restful/dtos';

import { UserOrderType, UserValidateGroups } from '../constants';

import { UserCommonDto } from './common.dto';

/**
 * 创建时的请求数据验证
 */
@DtoValidation({ groups: [UserValidateGroups.CREATE] })
export class CreateUserDto extends PickType(UserCommonDto, [
  'username',
  'nickname',
  'password',
  'phone',
  'email',
]) {}

/**
 * 更新时的请求数据验证
 */
@DtoValidation({ groups: [UserValidateGroups.UPDATE] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '待更新的用户ID',
  })
  @IsUUID(undefined, {
    groups: [UserValidateGroups.UPDATE],
    message: '用户ID格式不正确',
  })
  @IsDefined({ groups: ['update'], message: '用户ID必须指定' })
  id!: string;
}

@DtoValidation({ type: 'query' })
export class QueryUserDto extends ListWithTrashedQueryDto {
  @ApiPropertyOptional({
    description: '排序规则:可指定用户列表的排序规则,默认为按创建时间降序排序',
    enum: UserOrderType,
  })
  @IsEnum(UserOrderType)
  orderBy?: UserOrderType;
}

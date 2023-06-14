import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';

import { DeleteDto } from './delete.dto';
/**
 * 带软删除的批量删除验证
 */
@DtoValidation()
export class DeleteWithTrashDto extends DeleteDto {
  @ApiPropertyOptional({
    description: '是否删除到回收站',
  })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  trash?: boolean;
}

/**
 * 批量恢复验证
 */
@DtoValidation()
export class RestoreDto{

  @ApiProperty({
    description: '待删除的ID列表',
    type: [String],
  })
  @IsUUID(undefined,{
    each:true,message:'ID格式错误'
  })
  @IsDefined({each:true,message:'ID不能为空'})
  ids:string[];
}
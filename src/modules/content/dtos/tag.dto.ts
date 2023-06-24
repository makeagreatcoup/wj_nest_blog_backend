import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength } from "class-validator";

import { EffectType } from "@/modules/core/constants";
import { DtoValidation } from "@/modules/core/decorators";
import { IsUniqueExist } from "@/modules/database/constraints";

import { TagEntity } from "../entities";

@DtoValidation({groups:['create']})
export class CreateTagDto {
  @ApiProperty({
    description: '标签名称',
    uniqueItems: true,
    maxLength: 5,
  })
  @IsUniqueExist(TagEntity, {
      groups: ['update'],
      message: '标签名称重复',
  })
  @MaxLength(5,{always:true,message:'标签名称长度不能超过$constraint1'})
  @IsNotEmpty({groups:['create'],message:'标签名称不得为空'})
  @IsOptional({ groups: ['update'] })
  title: string;

  @ApiPropertyOptional({ description: '标签描述', maxLength: 50 })
  @MaxLength(50, { always: true, message: '文章描述长度最大为$constraint1' })
  @IsOptional({ always: true })
  summary?: string;

  @ApiProperty({
    description: '标签颜色',
    type: [String],
    maxLength: 20,
  })
  @MaxLength(20, { message: '字段长度最大为$constraint1' })
  @IsOptional({ always: true })
  color?:string;

  @ApiPropertyOptional({
    description: '标签状态类型: 默认为ON',
    enum: EffectType,
    default: 'markdown',
  })
  @IsEnum(EffectType, {
      message: `标签状态类型必须是${Object.values(EffectType).join(',')}其中一项`,
  })
  @IsOptional()
  type:EffectType;
  
}

/**
 * 标签更新验证
 */
@DtoValidation({groups:['update']})
export class UpdateTagDto extends PartialType(CreateTagDto){
  @ApiProperty({
    description: '待更新的标签ID',
  })
  @IsUUID(undefined, { groups: ['update'], message: '标签ID格式错误' })
  @IsNotEmpty({ groups: ['update'], message: '标签ID不能为空' })
  id: string;

}
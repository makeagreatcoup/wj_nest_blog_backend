import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from "class-validator";

import { DtoValidation } from "@/modules/core/decorators";
import { IsDataExist } from "@/modules/database/constraints";
import { ListQueryDto } from "@/modules/restful/dtos";
import { UserEntity } from "@/modules/user/entities";

@DtoValidation({type:'query'})
export class QueryCustomerDto extends ListQueryDto {
  @ApiProperty({
    description: '评论人姓名',
    maximum: 50,
  })
  @MaxLength(50, { message: '评论人姓名不能超过$constraint1个字' })
  @IsNotEmpty({ message: '评论人姓名不能为空' })
  nickname!:string;

  @ApiPropertyOptional({
    description: '和后台用户关联的ID',
  })
  @IsDataExist(UserEntity, {
    message: '用户ID不存在',
  })
  @IsUUID(undefined,{message:'用户ID格式错误'})
  @IsOptional()
  user?:string;
}

@DtoValidation({groups:['create']})
export class CreateCustomerDto{
  @ApiProperty({
    description: '评论人姓名',
    maximum: 50,
  })
  @MaxLength(50, { message: '评论人姓名不能超过$constraint1个字' })
  @IsNotEmpty({ message: '评论人姓名不能为空' })
  nickname!:string;

  @ApiPropertyOptional({
    description: '和后台用户关联的ID',
  })
  @IsDataExist(UserEntity, {
    message: '用户ID不存在',
  })
  @IsUUID(undefined,{message:'用户ID格式错误'})
  @IsOptional()
  user?:string;
}

@DtoValidation({groups:['update']})
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: '待更新的评论人ID',
  })
  @IsUUID(undefined, {
    groups: ['update'],
    message: '评论人ID格式错误',
  })
  @IsDefined({ groups: ['update'], message: '评论人ID必须指定' })
  id!: string;
}
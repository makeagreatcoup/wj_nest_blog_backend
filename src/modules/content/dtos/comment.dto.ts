import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateIf } from "class-validator";

import { DtoValidation } from "@/modules/core/decorators";
import { IsDataExist } from "@/modules/database/constraints";
import { ListQueryDto } from "@/modules/restful/dtos";

import { CommentEntity, PostEntity } from "../entities";

@DtoValidation({type:'query'})
export class QueryCommentDto extends ListQueryDto{
  @ApiPropertyOptional({
    description: '评论所属文章ID:根据传入评论所属文章的ID对评论进行过滤',
  })
  @IsDataExist(PostEntity, {
    message: '所属的文章不存在',
  })
  @IsUUID(undefined,{message:'评论所属文章ID格式错误'})
  @IsOptional()
  postId?:string;

  @ApiPropertyOptional({
    description: '评论人ID:根据传入评论人的ID对评论进行过滤',
  })
  @IsUUID(undefined,{message:'评论人ID格式错误'})
  @IsOptional()
  customerId?:string;
}

/**
 * 评论树查询
 */
@DtoValidation({ type: 'query' })
export class QueryCommentTreeDto extends PickType(QueryCommentDto,['postId','customerId']){}

/**
 * 评论树分页查询
 */
@DtoValidation({ type: 'query' })
export class QueryCommentTreePaginateDto extends QueryCommentDto{}

@DtoValidation({groups:['create']})
export class CreateCommentDto{
  @ApiProperty({
    description: '评论内容',
    maximum: 1000,
  })
  @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  body:string;

  @ApiProperty({
    description: '评论所属文章ID',
  })
  @IsDataExist(PostEntity, { message: '指定的文章不存在' })
  @IsUUID(undefined,{message:'文章ID格式错误'})
  @IsDefined({message:'文章ID不能为空'})
  post:string;

  @ApiProperty({
    description: '父级评论ID',
  })
  @IsDataExist(CommentEntity, { message: '父评论不存在' })
  @ValidateIf((value) => value && typeof value.parent === 'string' && value.parent.trim() !== '')
  @IsUUID(undefined, { always: false, message: '父类评论ID格式不正确' })
  @IsOptional()
  parent?:string;

  @ApiProperty({
    description: 'ID',
  })
  customer:string;
}

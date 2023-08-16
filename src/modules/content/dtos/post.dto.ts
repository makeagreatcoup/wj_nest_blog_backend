import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { isNil, toNumber } from 'lodash';

import { EffectType, PostBodyType, PostOrderType } from '@/modules/core/constants';
import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';
import { IsDataExist } from '@/modules/database/constraints';
import { ListWithTrashedQueryDto } from '@/modules/restful/dtos';

import { CategoryEntity } from '../entities';

/**
 * 数据分页查询验证，数据验证管道对象
 */
@DtoValidation({type:'query'})
export class QueryPostDto extends ListWithTrashedQueryDto {

  @ApiPropertyOptional({
    description: '发布状态:根据是否发布过滤文章状态',
  })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: '文章状态类型: 默认为ON',
    enum: EffectType,
    default: 'ON',
  })
  @IsEnum(EffectType, {
      message: `文章状态类型必须是${Object.values(EffectType).join(',')}其中一项`,
  })
  @IsOptional()
  state:EffectType;

  @ApiPropertyOptional({
    description: '排序规则:可指定文章列表的排序规则,默认为综合排序',
    enum: PostOrderType,
  })
  @IsEnum(PostOrderType, {
    message: `排序类型必须为${Object.values(PostOrderType).join(',')}其中一项`,
  })
  @IsOptional()
  orderBy?: PostOrderType;

  @ApiPropertyOptional({
    description: '分类ID:过滤一个分类及其子孙分类下的文章',
  })
  @IsDataExist(CategoryEntity, {
      message: '指定的分类不存在',
  })
  @IsUUID(undefined, {message:'分类ID格式错误'})
  @IsOptional()
  category?:string;

  @ApiPropertyOptional({
    description: '标签ID:包含这些标签id的结果',
  })
  @IsUUID(undefined, {
    each: true,
    always: true,
    message: '标签ID格式不正确',
  })
  @IsOptional({ always: true })
  tags?:string[];

  @ApiPropertyOptional({
    description: '搜索关键字:文章全文搜索字符串',
    maxLength: 100,
  })
  @MaxLength(100,{
    always:true,
    message:'搜索字符串长度不得超过$constraint1'
  })
  @IsOptional({always:true})
  search?:string;

  @ApiPropertyOptional({
    description: '查询创建时间开始',
    type: Date,
  })
  @IsDateString({ strict: true }, { always: true })
  @IsOptional({ always: true })
  startTime?:Date;

  @ApiPropertyOptional({
    description: '查询创建时间结束',
    type: Date,
  })
  @IsDateString({ strict: true }, { always: true })
  @IsOptional({ always: true })
  endTime?:Date;
}

/**
 * 文章创建验证
 */
export class CreatePostDto {
  @ApiProperty({ description: '文章标题', maxLength: 255 })
  @MaxLength(255, { always: true, message: '标题最大长度为$constraint1' })
  @IsNotEmpty({ groups: ['create'], message: '标题不能为空' })
  @IsOptional({ groups: ['update'] })
  title!: string;

  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty({ groups: ['create'], message: '内容必须填写' })
  @IsOptional({ groups: ['update'] })
  body!: string;

  @ApiPropertyOptional({
    description: '文章内容类型: 默认为markdown',
    enum: PostBodyType,
    default: 'markdown',
  })
  @IsEnum(PostBodyType, {
      message: `内容类型必须是${Object.values(PostBodyType).join(',')}其中一项`,
  })
  @IsOptional()
  type?: PostBodyType;

  @ApiPropertyOptional({ description: '文章描述', maxLength: 500 })
  @MaxLength(500, { always: true, message: '文章描述长度最大为$constraint1' })
  @IsOptional({ always: true })
  summary?: string;

  @ApiPropertyOptional({
    description: '发布时间:通过设置文章的发布时间来发布文章',
    type: Date,
  })
  @IsDateString({ strict: true }, { always: true })
  @IsOptional({ always: true })
  @ValidateIf((value) => !isNil(value.publishedAt))
  @Transform(({ value }) => (value === 'null' ? null : value))
  publishedAt?: Date;

  @ApiPropertyOptional({
    description: '文章封面',
    type:[String]
  })
  @IsOptional({ always: true })
  cover?: string;

  @ApiPropertyOptional({
    description: '文章状态类型: 默认为ON',
    enum: EffectType,
    default: 'ON',
  })
  @IsEnum(EffectType, {
      message: `文章状态类型必须是${Object.values(EffectType).join(',')}其中一项`,
  })
  @IsOptional()
  state:EffectType;

  @ApiPropertyOptional({
    description: '关键字:用于SEO',
    type: [String],
    maxLength: 20,
  })
  @MaxLength(20, {
    each: true,
    always: true,
    message: '每个关键字长度最大为$constraint1',
  })
  @IsOptional({ always: true })
  keywords?: string[];

  @ApiPropertyOptional({
    description: '关联分类ID',
    type: [String],
  })
  @IsDataExist(CategoryEntity, {
      each: true,
      always: true,
      message: '分类不存在',
  })
  @IsUUID(undefined, {
    always: true,
    message: '分类ID格式不正确',
  })
  @IsOptional({ always: true })
  category?: string;

  @IsUUID(undefined, {
    each: true,
    always: true,
    message: '标签ID格式不正确',
  })
  @IsOptional({ always: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: '自定义排序',
    type: Number,
    minimum: 0,
    default: 0,
  })
  @Transform(({ value }) => toNumber(value))
  @Min(0, { always: true, message: '排序值必须大于0' })
  @IsNumber(undefined, { always: true })
  @IsOptional({ always: true })
  customOrder = 0;
}

/**
 * 文章更新验证
 */
@DtoValidation({groups:['update']})
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: '待更新的文章ID',
  })
  @IsUUID(undefined, {
    groups: ['update'],
    message: '文章ID格式错误',
  })
  @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
  id!: string;
}

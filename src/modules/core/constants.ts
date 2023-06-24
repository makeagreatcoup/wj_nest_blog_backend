import { ObjectType } from 'typeorm';

export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * dto验证装饰器选项
 */
export const DTO_VALIDATION_OPTIONS = 'dto_validation_options';

/**
 * 文章内容类型
 */
export enum PostBodyType {
  HTML = 'html',
  MD = 'markdown',
}
/**
 * 文章内容类型
 */
export enum EffectType {
  ON = 'ON',
  OFF = 'OFF',
}
/**
 * 文章排序类型
 */
export enum PostOrderType {
  CREATED = 'created',
  UPDATED = 'updated',
  PUBLISHED = 'published',
  COMMENTCOUNT = 'commentCount',
  CUSTOM = 'custom',
}

export interface CustomRepositoryMetadata {
  entity: ObjectType<any>;
}

/**
 * 软删除数据查询类型
 */
export enum SelectTrashMode{
  ALL = 'all',
  ONLY = 'only',
  NONE = 'none'
}

/**
 * 排序
 */
export enum OrderType {
  ASC='ASC',
  DESC='DESC'
}

/**
 * 树形模型在删除父级后子级的处理方式
 */
export enum TreeChildrenResolve{
  Delete='delete',
  UP='up',
  ROOT='root'
}

/**
 * 定义当前运行环境
 */
export enum EnvironmentType{
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prod',
  TEST = 'test',
  PREVIEW = 'preview',
}

/**
 * 模块构造器
 */
export const MODULE_BUILDER_REGISTER='module_builder_register'
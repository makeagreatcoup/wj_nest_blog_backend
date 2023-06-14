import { SetMetadata } from '@nestjs/common';
import { ObjectType } from 'typeorm';

// import { PostRepository } from '@/modules/content/repositories/post.repository';

import { CUSTOM_REPOSITORY_METADATA } from '../../core/constants';

export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator => 
  // SetMetadata是在不删除其他元数据的情况下添加元数据的关联关系
  SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);

// export const CustomRepository = <T>(entity: ObjectType<T>) => {
//   return (target: typeof PostRepository) => {
//     // defineMetadata是完全替换现有的元数据关联关系
//     Reflect.defineMetadata(CUSTOM_REPOSITORY_METADATA, { entity }, target);
//   };
// };

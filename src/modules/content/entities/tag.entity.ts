import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
} from 'typeorm';

import { BaseEntity } from '@/modules/database/base/entity';

import { EffectType } from '../../core/constants';

import { PostEntity } from './post.entity';

@Exclude()
@Entity('content_tags')
export class TagEntity extends BaseEntity {

  @Expose()
  @Column({ comment: '标签名称' })
  title!: string;

  @Expose()
  @Column({ comment: '标签描述', nullable: true })
  summary?: string;

  @ManyToMany(()=>PostEntity,(posts)=>posts.tags)
  posts?:PostEntity[];

  @Expose()
  @Column({ comment: '标签颜色', nullable: true })
  color?:string;

  @Expose()
  @Column({ 
    comment: '标签状态',
    type:'enum',
    enum:EffectType,
    default:EffectType.ON
  })
  type:EffectType;

}

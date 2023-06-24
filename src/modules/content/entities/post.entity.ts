import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from '@/modules/database/base/entity';

import { PostBodyType } from '../../core/constants';

import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';

@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {

  @Expose()
  @Column({ comment: '文章标题' })
  @Index({fulltext:true})
  title!: string;

  @Expose({ groups: ['post-detail'] })
  @Column({ comment: '文章内容', type: 'longtext' })
  @Index({fulltext:true})
  body!: string;

  @Expose()
  @Column({ comment: '文章描述', nullable: true })
  @Index({fulltext:true})
  summary?: string;

  @Expose()
  @Column({ comment: '关键字', type: 'simple-array', nullable: true })
  keywords?: string[];

  @Expose()
  @Column({
    comment: '文章类型',
    type: 'enum',
    enum: PostBodyType,
    default: PostBodyType.MD,
  })
  type!: PostBodyType;

  @Expose()
  @Column({
    comment: '发布时间',
    type: 'varchar',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Expose()
  @Column({ comment: '文章排序', default: 0 })
  customOrder!: number;

  @ManyToOne(()=>CategoryEntity,(category)=>category.posts,{
    // 新增文章时，如果所属分类不存在则直接创建
    cascade:true
  })
  category!:CategoryEntity;

  @OneToMany(()=>CommentEntity,(comment)=>comment.post,{
    cascade:true
  })
  comments:CommentEntity[];

  @Expose()
  commentCount!:number;

  @Expose()
  @Type(() => Date)
  @DeleteDateColumn({ comment: '删除时间'})
  deleteAt:Date;
}

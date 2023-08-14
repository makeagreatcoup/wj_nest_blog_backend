import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@/modules/database/base/entity';
import { UserEntity } from '@/modules/user/entities';

import { CommentEntity } from './comment.entity';

@Exclude()
@Entity('content_customer')
export class 
CustomerEntity extends BaseEntity {

  @Expose()
  @Column({ comment: '姓名',unique: true})
  nickname!: string;

  // @Column({ comment: '后台用户', nullable: true })
  @Expose()
  @OneToOne(()=>UserEntity,(user)=>user.customer)
  @JoinColumn()
  user?: UserEntity;

  // @Column({ comment: '评论数据', nullable: true })
  @Expose()
  @OneToMany(()=>CommentEntity,(comment)=>comment.customer,{
    cascade:true
  })
  comments:CommentEntity[];

  @Expose()
  @Type(() => Date)
  @DeleteDateColumn({ comment: '删除时间'})
  deleteAt:Date;
}

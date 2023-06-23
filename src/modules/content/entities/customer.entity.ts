import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@/modules/database/base/entity';
import { UserEntity } from '@/modules/user/entities';

import { CommentEntity } from './comment.entity';

@Exclude()
@Entity('content_customer')
export class CustomerEntity extends BaseEntity {

  @Expose()
  @Column({ comment: '用户名', unique: true })
  username!: string;

  @Expose()
  @Column({ comment: '后台用户', nullable: true })
  @OneToOne(()=>UserEntity,(user)=>user.customer)
  user?: UserEntity|null;

  @Expose()
  @Column({ comment: '后台用户', nullable: true })
  @OneToMany(()=>CommentEntity,(comment)=>comment.customer,{
    cascade:true
  })
  comments:CommentEntity[];

  @Expose()
  @Type(() => Date)
  @DeleteDateColumn({ comment: '删除时间'})
  deleteAt:Date;
}

import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { CustomerEntity } from '@/modules/content/entities';
import { BaseEntity } from '@/modules/database/base';

import { AccessTokenEntity } from './access-token.entity';

@Exclude()
@Entity('users')
export class UserEntity extends BaseEntity {
  @Expose()
  @Column({
    comment: '姓名',
    nullable: true,
  })
  nickname?: string;

  @Expose()
  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar?: string;

  @Expose()
  @Column({
    comment: '评论人',
    nullable: true,
  })
  @OneToOne(()=>CustomerEntity,(customer)=>customer.user)
  customer?:CustomerEntity|null;

  @Expose()
  @Column({ comment: '用户名', unique: true })
  username!: string;

  @Column({ comment: '密码', length: 500, select: false })
  password!: string;

  @Expose()
  @Column({ comment: '手机号', nullable: true, unique: true })
  phone?: string;

  @Expose()
  @Column({ comment: '邮箱', nullable: true, unique: true })
  email?: string;

  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
    cascade: true,
  })
  accessTokens!: AccessTokenEntity[];

  @Expose()
  @Expose()
  @Type(() => Date)
  @DeleteDateColumn({
    comment: '删除时间',
  })
  deletedAt!: Date;
}

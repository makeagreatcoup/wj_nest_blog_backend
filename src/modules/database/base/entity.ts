import { Expose, Type } from 'class-transformer';
import { BaseEntity as TypeormBaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity extends TypeormBaseEntity{
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!:string;

  @Expose()
  @Type(() => Date)
  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date;
}
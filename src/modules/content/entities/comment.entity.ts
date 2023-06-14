import { Exclude, Expose, Type } from "class-transformer";
import {  Column, CreateDateColumn, Entity, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm";

import { BaseEntity } from "@/modules/database/base/entity";

import { PostEntity } from "./post.entity";


@Exclude()
@Tree('materialized-path')
@Entity('content_comments')
export class CommentEntity extends BaseEntity{

  @Expose()
  @Column({comment:'评论内容',type:'longtext',})
  body:string;

  @Expose()
  @Type(()=>Date)
  @CreateDateColumn({
    comment:'创建时间'
  })
  createAt:Date;

  @Expose()
  depth = 0;

  @Expose()
  @ManyToOne(()=>PostEntity,(post)=>post.comments,{
    // 文章不能为空
    nullable:false,
    // 跟随父表删除与更新
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
  })
  post:PostEntity;

  @TreeParent({onDelete:'CASCADE'})
  parent:CommentEntity|null;

  @Expose()
  @TreeChildren({cascade:true})
  children:CommentEntity[];
}
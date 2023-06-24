import { Exclude, Expose} from "class-transformer";
import {  Column, Entity, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm";

import { BaseEntity } from "@/modules/database/base/entity";

import { CustomerEntity } from "./customer.entity";
import { PostEntity } from "./post.entity";

@Exclude()
@Tree('materialized-path')
@Entity('content_comments')
export class CommentEntity extends BaseEntity{

  @Expose()
  @Column({comment:'评论内容',type:'longtext',})
  body:string;

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

  @Expose()
  @ManyToOne(()=>CustomerEntity,(customer)=>customer.comments,{
    // 评论人不能为空
    nullable:false,
    // 跟随父表删除与更新
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
  })
  customer:CustomerEntity;

  @TreeParent({onDelete:'CASCADE'})
  parent:CommentEntity|null;

  @Expose()
  @TreeChildren({cascade:true})
  children:CommentEntity[];
}
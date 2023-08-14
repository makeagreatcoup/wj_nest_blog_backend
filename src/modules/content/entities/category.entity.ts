import { Exclude, Expose, Type } from "class-transformer";
import {  Column, DeleteDateColumn, Entity, Index, OneToMany, Tree, TreeChildren, TreeParent } from "typeorm";

import { BaseEntity } from "@/modules/database/base/entity";

import { PostEntity } from "./post.entity";

@Exclude()
@Tree('materialized-path')
@Entity('content_categories')
export class CategoryEntity extends BaseEntity{

  @Expose()
  @Column({comment:'分类名称'})
  @Index({fulltext:true,unique:true})
  name!:string;

  @Expose({groups:['category-tree','category-list', 'category-detail']})
  @Column({comment:'分类排序',default:0})
  customOrder!:number;

  @OneToMany(()=>PostEntity,(post)=>post.category)
  posts!:PostEntity[];

  @Expose({groups:['category-list']})
  depth = 0;

  @Expose({groups:['category-detail','category-list','category-tree']})
  @Type(()=>CategoryEntity)
  @TreeParent({onDelete:'NO ACTION'})
  parent!:CategoryEntity|null;

  @Expose({ groups: ['category-tree'] })
  @Type(()=>CategoryEntity)
  @TreeChildren({cascade:true})
  children!:CategoryEntity[];

  @Expose()
  @Type(()=>Date)
  @DeleteDateColumn({comment:'删除时间'})
  deleteAt:Date;
  
}
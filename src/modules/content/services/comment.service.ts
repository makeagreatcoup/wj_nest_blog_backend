import { ForbiddenException, Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { EntityNotFoundError, SelectQueryBuilder } from "typeorm";

import { BaseService } from "@/modules/database/base/service";

import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from "../dtos/comment.dto";
import { CommentEntity } from "../entities/comment.entity";
import { PostRepository } from "../repositories";
import { CommentRepository } from "../repositories/comment.repository";


@Injectable()
export class CommentService extends BaseService<CommentEntity,CommentRepository>{
  constructor(protected repository:CommentRepository,
    protected postRepository:PostRepository){
      super(repository)
    }

  /**
   * 直接查询评论树
   * @param options 分页条件
   * @returns 
   */
  async findTrees(options:QueryCommentTreeDto={}){
    return this.repository.findTrees({
      addQuery:async qb=>{
        return isNil(options.postId)?qb:qb.andWhere('comment.postId = :postId',{postId:options.postId})
      }
    })
  }

  /**
   * 查询文章的评论并分页
   * @param dto 评论对象
   * @returns 
   */
  async paginate(dto:QueryCommentDto){
    const {postId}=dto;
    const addQuery=(qb:SelectQueryBuilder<CommentEntity>)=>{
      const condition:Record<string,string>={}
      if(!isNil(postId)){
        condition.postId=postId;
      }
      return Object.keys(condition).length>0?qb.andWhere(condition):qb;
    }
    return super.paginate({
      ...dto,
      addQuery
    });
  }

  /**
   * 新增评论
   * @param data 
   * @returns 
   */
  async create(data:CreateCommentDto){
    const parent = await this.getParent(undefined,data.parent);
    if(!isNil(parent)&&parent.post.id!==data.post){
      throw new ForbiddenException('评论ID数据错误');
    }
    const item=await this.repository.save({
      ...data,parent,post:await this.getPost(data.post)
    })
    return this.repository.findOneOrFail({where:{id:item.id}});
  }

  /**
   * 获取评论所属文章实例
   * @param id 
   * @returns 
   */
  protected async getPost(id:string){
    return this.postRepository.findOneOrFail({where:{id}});
  }

  /**
   * 获取请求传入的父评论
   * @param current 当前评论ID
   * @param parentId 父评论ID
   */
  protected async getParent(current?:string,parentId?:string){
    if(current===parentId)return undefined;
    let parent :CommentEntity|undefined;
    if(!isNil(parentId)){
      parent=await this.repository.findOneOrFail({
        relations:['parent','post'],
        where:{id:parentId}
      });
      if(!parent){
        throw new EntityNotFoundError(CommentEntity,`父评论ID${parentId}不存在`)
      }
    }
    return parent;
  }
}

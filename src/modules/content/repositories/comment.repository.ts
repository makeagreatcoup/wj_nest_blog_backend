import { FindTreeOptions, SelectQueryBuilder } from "typeorm";

import { BaseTreeRepository } from "@/modules/database/base/tree.repository";
import { CustomRepository } from "@/modules/database/decorators/repository.decorator";
import { QueryParams } from "@/modules/database/types";

import { CommentEntity } from "../entities";

@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity>{

  protected _qbName='comment';

  protected orderBy = 'createdAt';

  /**
   * 构建基础查询器
   * @param qb 基础查询器
   * @returns 
   */
  buildBaseQB(qb:SelectQueryBuilder<CommentEntity>):SelectQueryBuilder<CommentEntity>{
    return super.buildBaseQB(qb)
    .leftJoinAndSelect(`${this.qbName}.post`,'post')
    .leftJoinAndSelect(`${this.qbName}.customer`,'customer')
  }

  /**
   * 查询树的根节点列表,新增根据post文章id查询评论
   * @param options 查询条件
   * @returns 
   */
  async findTrees(options:FindTreeOptions & QueryParams<CommentEntity> & {post?:string}={}){
    const {addQuery} =options;
    return super.findTrees({
      ...options,
      addQuery:async qb=>{
        return addQuery?addQuery(qb):qb;
      }
    })
  }
  
}
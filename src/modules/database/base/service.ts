import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { isNil } from "lodash";
import { In, ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { SelectTrashMode, TreeChildrenResolve } from "@/modules/core/constants";

import { paginate, treePaginate } from "../helpers";
import { IPaginateOptions, IPaginateResult, QueryHook, ServiceListQueryOption } from "../types";

import { BaseRepository } from "./repository";
import { BaseTreeRepository } from "./tree.repository";

export abstract class BaseService<E extends ObjectLiteral,R extends BaseRepository<E>|BaseTreeRepository<E>,P extends ServiceListQueryOption<E> = ServiceListQueryOption<E>>{
  
  /**
   * 服务默认存储类
   */
  protected repository:R;

  /**
   * 是否开启软删除功能
   */
  protected enableTrash = false;

  constructor(repository:R){
    this.repository = repository;
    if(!(this.repository instanceof BaseRepository||this.repository instanceof BaseTreeRepository)){
      throw new Error('Repository类型错误,请实现BaseRepository类或BaseTreeRepository类')
    }
  }

  /**
   * 获取查询数据列表的querybuilder
   * @param qb querybuilder实例
   * @param options 查询选项
   * @param callback 查询回调
   * @returns 
   */
  protected async buildListQB(qb:SelectQueryBuilder<E>,options?:P,callback?:QueryHook<E>){
    const {trashed}=options??{};
    const queryName=this.repository.qbName;
    if(this.enableTrash&&(trashed===SelectTrashMode.ALL||trashed===SelectTrashMode.ONLY)){
      qb.withDeleted();
      if(trashed===SelectTrashMode.ONLY){
        qb.where(`${queryName}.deleteAt is not null`);
      }
    }
    return callback?callback(qb):qb;
  }

  /**
   * 获取查询单个项目的querybuilder
   * @param id 查询数据的id
   * @param qb 
   * @param callback 
   * @returns 
   */
  protected async buildItemQB(id:string,qb:SelectQueryBuilder<E>,callback?:QueryHook<E>){
    qb.where(`${this.repository.qbName}.id=:id`,{id});
    if(callback)return callback(qb);
    return qb;
  }

  /**
   * 获取数据列表
   * @param options 
   * @param callback 
   * @returns 
   */
  async list(options?:P,callback?:QueryHook<E>):Promise<E[]>{
    const {trashed:isTradhed=false}=options??{};
    const trashed = isTradhed||SelectTrashMode.NONE;

    if(this.repository instanceof BaseTreeRepository){
      const withTrashed=this.enableTrash&&(trashed===SelectTrashMode.ALL||trashed===SelectTrashMode.ONLY);
      const onlyTrashed=this.enableTrash&&trashed===SelectTrashMode.ONLY;
      const tree = await this.repository.findTrees({
        ...options,
        withTrashed,
        onlyTrashed
      })
      return this.repository.toFlatTrees(tree);
    }
    const qb=await this.buildListQB(this.repository.buildBaseQB(),options,callback);
    return qb.getMany();
  }

  /**
   * 获取分页数据
   * @param options 分页选项
   * @param callback 回调查询
   * @returns 
   */
  async paginate(options?:IPaginateOptions&P,callback?:QueryHook<E>):Promise<IPaginateResult<E>>{
    const queryOptions=(options??{}) as P;
    if(this.repository instanceof BaseTreeRepository){
      const data=await this.list(queryOptions,callback);
      return treePaginate(options,data) as IPaginateResult<E>;
    }
    const qb=await this.buildListQB(this.repository.buildBaseQB(),queryOptions,callback);
    return paginate(qb,options);
  }

  /**
   * 获取数据详情
   * @param id 
   * @param callback 
   * @returns 
   */
  async detail(id:string,callback?:QueryHook<E>):Promise<E>{
    const qb=await this.buildItemQB(id,this.repository.buildBaseQB(),callback);
    const item=await qb.getOne();
    if(!item){
      throw new NotFoundException(`${this.repository.qbName} ${id}不存在`)
    }
    return item;
  }

  /**
   * 创建数据,子类没有实现则抛出异常404
   * @param data 
   * @param others 
   */
  create(data:any,...others:any[]):Promise<E>{
    throw new ForbiddenException(`创建${this.repository.qbName}失败`)
  }

  /**
   * 更新数据,子类没有实现则抛出异常404
   * @param data 
   * @param others 
   */
  update(data:any,...others:any[]):Promise<E>{
    throw new ForbiddenException(`更新${this.repository.qbName}失败`)
  }

  /**
   * 批量删除数据
   * @param ids 需要删除的id列表
   * @param trash 是否开启回收站,如果true则软删除
   */
  async delete(ids:string[],trash?:boolean){
    let items:E[]=[];
    if(this.repository instanceof BaseTreeRepository){
      items=await this.repository.find({
        where:{id:In(ids) as any},
        withDeleted:this.enableTrash?true:undefined,
        relations:['parent','children']
      })
      if(this.repository.childrenResolve===TreeChildrenResolve.UP){
        items.forEach(async item=>{
          if(!isNil(item.children)&&item.children.length>0) {
            const nchildren=[...item.children].map(e=>{
              e.parent=item.parent;
              return item;
            })
            await this.repository.save(nchildren)
          }
        })
      }
    }else{
      items=await this.repository.find({
        where:{id:In(ids) as any},
        withDeleted:this.enableTrash?true:undefined
      })
    }
    if(this.enableTrash&&trash){
      const directs=items.filter(item=>!isNil(item.deleteAt))
      const softs=items.filter(item=>isNil(item.deleteAt));
      return [
        ...await this.repository.remove(directs),
        ...await this.repository.softRemove(softs)
      ]
    }
    return this.repository.remove(items);
  }

  /**
   * 批量恢复回收站的数据
   * @param ids 需要恢复的id列表
   * @returns 
   */
  async restore(ids:string[]){
    if(!this.enableTrash){
      throw new ForbiddenException(`恢复失败,${this.repository.qbName}数据不支持恢复`)
    }
    const items=await this.repository.find({
      where:{id:In(ids) as any},
      withDeleted:true
    })
    const trasheds=items.filter(item=>!isNil(item));
    if(trasheds.length<0)return [];
    await this.repository.restore(trasheds.map(item=>item.id));
    const qb=await this.buildListQB(
      this.repository.buildBaseQB(),
      null,
      async builder=>builder.andWhereInIds(trasheds))
    return qb.getMany();
  }
}
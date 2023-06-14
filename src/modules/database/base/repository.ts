import { isNil } from "lodash";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

import { OrderType } from "@/modules/core/constants";

import {OrderQueryType} from '../types'


export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E>{
  /**
     * 构建查询时默认的模型对应的查询名称
     */
  protected abstract _qbName: string;

  protected orderBy?:string|{name:string;order:`${OrderType}`};

  /**
     * 返回查询器名称
     */
  get qbName() {
    return this._qbName;
  }

  /**
   * 构建基础查询器
   */
  buildBaseQB(): SelectQueryBuilder<E> {
      return this.createQueryBuilder(this.qbName);
  }

  /**
   * 生成排序的qb
   * @param qb 
   * @param orderBy 
   * @returns 
   */
  addOrderByQuery(qb:SelectQueryBuilder<E>,orderBy?:OrderQueryType){
    const orderByQuery=orderBy??this.orderBy;
    return !isNil(orderByQuery)?getOrderByQuery(qb,this.qbName,orderByQuery):qb;
  }
}


/**
 * 为查询添加排序方式,默认DESC
 * @param qb 原查询构造器
 * @param alias 别名
 * @param orderBy 查询排序方式
 * @returns 
 */
export const getOrderByQuery=<E extends ObjectLiteral>(qb:SelectQueryBuilder<E>,alias:string,orderBy?:OrderQueryType)=>{
  if(isNil(orderBy))return qb;
  if(typeof orderBy === 'string'){
    return qb.orderBy(`${alias}.${orderBy}`,'DESC')
  }
  if(Array.isArray(orderBy)){
    orderBy.forEach((item,i)=>{
      if(i===0){
        typeof item==='string'
        ?qb.orderBy(`${alias}.${item}`,'DESC')
        :qb.orderBy(`${alias}.${item}`,item.order)
      }else{
        typeof item==='string'
        ?qb.addOrderBy(`${alias}.${item}`,'DESC')
        :qb.addOrderBy(`${alias}.${item}`,item.order)
      }
    })
    return qb;
  }
  return qb.orderBy(`${alias}.${orderBy.name}`,orderBy.order);
}
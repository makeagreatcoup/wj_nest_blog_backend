import { Optional } from "@nestjs/common";
import { isNil } from "lodash";
import { DataSource, EntitySubscriberInterface, EntityTarget, EventSubscriber, InsertEvent, LoadEvent, ObjectLiteral, ObjectType, RecoverEvent, RemoveEvent, SoftRemoveEvent, TransactionCommitEvent, TransactionRollbackEvent, TransactionStartEvent, UpdateEvent } from "typeorm";

import { getCustomRepository } from "../helpers";
import {  RepositoryType } from "../types";

type SubscriberEvent<E extends ObjectLiteral>=
|InsertEvent<E>
| UpdateEvent<E>
| SoftRemoveEvent<E>
| RemoveEvent<E>
| RecoverEvent<E>
| TransactionStartEvent
| TransactionCommitEvent
| TransactionRollbackEvent;

/**
 * 基础模型观察者
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral> implements EntitySubscriberInterface<E>{

  /**
   * 监听模型
   */
  protected abstract entity:ObjectType<E>;

  constructor(@Optional() protected dataSource?:DataSource){
    if(!isNil(this.dataSource)){
      this.dataSource.subscribers.push(this);
    }
  }

  listenTo(){
    return this.entity;
  }

  async afterLoad(entity: any, event?: LoadEvent<E>){
    // 是否启用树形结构
    if('parent' in entity && isNil(entity.depth)){
      entity.depth=0;
    }
  }

  protected getDataSource(event:SubscriberEvent<E>){
    return event.connection;
  }

  protected getManage(event:SubscriberEvent<E>){
    return event.manager;
  }

  protected getRepository<
  C extends ClassType<T>,
  T extends RepositoryType<E>,
  A extends EntityTarget<ObjectLiteral>>
  (event:SubscriberEvent<E>,repository?:C,entity?:A){
    return isNil(repository)
    ?this.getDataSource(event).getRepository(entity??this.entity)
    :getCustomRepository<T,E>(this.getDataSource(event),repository);
  }

  /**
   * 判断某个字段是否更新
   * @param column 传入字段key
   * @param event 
   * @returns 
   */
  protected isUpdated(column:keyof E,event:UpdateEvent<E>){
    return event.updatedColumns.find(item=>item.propertyName === column);
  }
}
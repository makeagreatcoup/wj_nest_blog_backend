import { SetMetadata, Type } from "@nestjs/common";

import { BaseController } from "../base";
import { BaseControllerWithTrash } from "../base/trashed.controller";
import { CONTROLLER_DEPENDS, CRUD_OPTIONS_REGISTER } from "../constants";
import { CrudOptionsRegister } from "../type";

/**
 * 控制器上的crud装饰器
 * @param factory 
 * @returns 
 */
export const Crud = (factory:CrudOptionsRegister)=>
  <T extends BaseController<any>|BaseControllerWithTrash<any>>(Target:Type<T>)=>
  {
    Reflect.defineMetadata(CRUD_OPTIONS_REGISTER,factory,Target);
  }

/**
 * 存储导入的依赖模块
 * @param depends 
 * @returns 
 */
export const Depends=(...depends:Type<any>[])=>
  SetMetadata(CONTROLLER_DEPENDS,depends??[]);
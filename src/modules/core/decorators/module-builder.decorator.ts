import { MODULE_BUILDER_REGISTER } from "../constants";
import { ModuleMetaRegister } from "../type";

/**
 * 替换默认的 @Module 模块装饰器
 * @param register 
 * @returns 
 */
export function ModuleBuilder<P extends Record<string,any>>(register:ModuleMetaRegister<P>){
  return <M extends new(...args:any[])=>any>(target:M)=>{
    Reflect.defineMetadata(MODULE_BUILDER_REGISTER,register,target);
    return target;
  }
}
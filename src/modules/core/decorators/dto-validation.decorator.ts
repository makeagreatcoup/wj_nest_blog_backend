import { Paramtype, SetMetadata } from "@nestjs/common";
import { ClassTransformOptions } from "class-transformer";
import { ValidatorOptions } from "class-validator";
 
import { DTO_VALIDATION_OPTIONS } from "../constants";

/**
 * 配置通过全局验证管道数据的dto类装饰器
 * @param options 验证条件
 * @returns 
 */
export const DtoValidation=(
  options?:ValidatorOptions &{
    transformOptions?:ClassTransformOptions;
  }&{type?:Paramtype}
)=>SetMetadata(DTO_VALIDATION_OPTIONS,options??{})


import { Injectable, Paramtype, ValidationPipe } from '@nestjs/common';
import { isObject, merge, omit } from 'lodash';

import { DTO_VALIDATION_OPTIONS } from '../constants';

@Injectable()
export class AppPipe extends ValidationPipe {
  async transform(value: any, metadata: { metatype: any; type: any }) {
    const { metatype, type } = metadata;
    // 获取验证的dto
    const dto = metatype;
    // 获取dto类的装饰器元数据中的自定义选项
    const options = Reflect.getMetadata(DTO_VALIDATION_OPTIONS, dto) || {};
    //  把当前已设置的选项解构到备份对象
    const originOptions = { ...this.validatorOptions };
    // 把当前已设置的class-transform选项解构到备份对象
    const originTransformOptions = { ...this.transformOptions };

    const { transformOptions, optionsType, ...customOptions } = options;
    // 根据dto类上设置的type来设置当前dto请求类型
    const requestType: Paramtype = optionsType ?? 'body';

    if (requestType !== type) {
      return value;
    }

    //
    // 合并当前transform选项和自定义选项
    if (transformOptions) {
      this.transformOptions = merge(
        this.transformOptions,
        originTransformOptions ?? {},
        {
          arrayMerge: (sourceArray: any) => sourceArray,
        },
      );
    }
    // 合并当前验证选项和自定义选项
    this.validatorOptions = merge(this.validatorOptions, customOptions ?? {}, {
      arrayMerge: (sourceArray: any) => sourceArray,
    });
    const toValidate = isObject(value)
      ? Object.fromEntries(
        Object.entries(value as Record<string, any>).map(([key, v]) => {
          if (!isObject(v) || !('mimetype' in v)) return [key, v];
          return [key, omit(v, ['fields'])];
        })
      )
      : value;
    // 默认调用父类的transform方法
    let result = await super.transform(toValidate, metadata);
    if(typeof result.transform==='function'){
      result=await result.transform(result)
      const {transform,...data}=result
      result=data
    }
    // 重置验证选项
    this.validatorOptions=originOptions ?? {}
    // 恢复原有transform选项和默认项
    this.transformOptions = originTransformOptions ?? {}

    return result;
  }
}

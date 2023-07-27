import { ClassSerializerContextOptions, ClassSerializerInterceptor, PlainLiteralObject, StreamableFile } from "@nestjs/common";
import { isArray, isNil, isObject } from "lodash";

export class AppIntercepter extends ClassSerializerInterceptor{
  serialize(response: PlainLiteralObject | PlainLiteralObject[], options: ClassSerializerContextOptions): PlainLiteralObject | PlainLiteralObject[] {
    if((!isObject(response)&&!isArray(response))||response instanceof StreamableFile){
      return response;
    }
    // 数组对每一项进行序列化
    if(isArray(response)){
      return (response as PlainLiteralObject[]).map((item)=>
        !isObject(item)?item:this.transformToPlain(item,options)
      )
    }
    // 分页数据，对items每一项进行序列话
    if('meta' in response && 'items' in response){
      const items=!isNil(response.items)&&isArray(response.items)?response.items:[];
      return {
        data:{
          items:(items as PlainLiteralObject[]).map(
            (item)=>!isObject(item)?item:this.transformToPlain(item,options)
          ),
          meta:response.meta
        },
        
      }
    }
    // 对象直接序列化
    return {data:this.transformToPlain(response, options)};
  }
}
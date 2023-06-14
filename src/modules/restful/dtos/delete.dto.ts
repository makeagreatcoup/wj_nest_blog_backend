import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";

import { DtoValidation } from "@/modules/core/decorators";

@DtoValidation()
export class DeleteDto{
  @ApiProperty({
    description: '待删除的ID列表',
    type: [String],
  })
  @IsUUID(undefined,{each:true,message:'ID格式错误'})
  @IsDefined({each:true,message:'ID不能为空'})
  ids:string[]=[]
}
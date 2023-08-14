import { Injectable } from "@nestjs/common";
import { omit } from 'lodash';

import { BaseService } from "@/modules/database/base";
import { UserRepository } from "@/modules/user/repositories";

import { CreateCustomerDto, UpdateCustomerDto } from "../dtos";
import { CustomerEntity } from "../entities";
import { CustomerRepository } from "../repositories";

@Injectable()
export class CustomerService extends BaseService<CustomerEntity,CustomerRepository>{
  constructor(protected repository:CustomerRepository,
    protected userRepository:UserRepository
    ){
    super(repository)
  }

    /**
   * 查询数组
   */
    async searchList(){
      return this.repository.buildSingleQB()
        .select(["id", "nickname"])
        .getRawMany();
    }


  async create(data: CreateCustomerDto): Promise<CustomerEntity> {
    const item = await this.repository.save({
      ...data,
      user: data.user!==null
      ?await this.userRepository.findOneBy({id:data.user})
      :null});
    return this.detail(item.id);
  }

  async update(data: UpdateCustomerDto): Promise<CustomerEntity> {
    const user=await this.detail(data.id);
    await this.repository.update(data.id, omit({...data,user}, ['id']));
    return this.detail(data.id);
  }
}
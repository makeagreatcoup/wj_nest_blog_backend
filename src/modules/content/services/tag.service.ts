import { Injectable } from "@nestjs/common";
import { omit } from 'lodash';

import { BaseService } from "@/modules/database/base";
import { UserRepository } from "@/modules/user/repositories";

import { CreateTagDto, UpdateTagDto } from "../dtos";
import { TagEntity } from "../entities";
import { TagRepository } from "../repositories";

@Injectable()
export class TagService extends BaseService<TagEntity,TagRepository>{
  constructor(protected repository:TagRepository,
    protected userRepository:UserRepository
    ){
    super(repository)
  }

  async searchList(){
    return this.repository.buildSingleQB()
      .select(["id", "title","color"])
      .where({state:'ON'})
      .getRawMany();
  }

  async create(data: CreateTagDto): Promise<TagEntity> {
    const item = await this.repository.save(data);
    return this.detail(item.id);
  }

  async update(data: UpdateTagDto): Promise<TagEntity> {
    await this.repository.update(data.id, omit({...data}, ['id']));
    return this.detail(data.id);
  }
}